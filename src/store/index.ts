import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Actor, CastEvent, DamageEvent, Fight, Job, MitEvent } from '../model/types';
import { fetchEvents, fetchReport } from '../api/fflogsV1';

interface AppState {
    // 输入
    apiKey: string;
    reportCode: string;
    fightId: string; // 用户输入通常是字符串，解析为数字

    // 数据
    fight: Fight | null;
    actors: Actor[];
    selectedJob: Job | null;
    selectedPlayerId: number | null;

    damageEvents: DamageEvent[];
    castEvents: CastEvent[];
    mitEvents: MitEvent[];

    // UI 状态
    isLoading: boolean;
    isRendering: boolean;
    error: string | null;

    setApiKey: (key: string) => void;
    setReportCode: (code: string) => void;
    setFightId: (id: string) => void;
    setSelectedJob: (job: Job) => void;
    setSelectedPlayerId: (id: number) => void;
    setIsRendering: (is: boolean) => void;

    loadFightMetadata: () => Promise<void>;
    loadEvents: () => Promise<void>;

    addMitEvent: (event: MitEvent) => void;
    updateMitEvent: (id: string, updates: Partial<MitEvent>) => void;
    removeMitEvent: (id: string) => void;
    setMitEvents: (events: MitEvent[]) => void;
}

export const useStore = create<AppState>()(
    persist(
        (set, get) => ({
            apiKey: '',
            reportCode: '',
            fightId: '',
            fight: null,
            actors: [],
            selectedJob: null,
            selectedPlayerId: null,
            damageEvents: [],
            castEvents: [],
            mitEvents: [],
            isLoading: false,
            isRendering: false,
            error: null,

            setApiKey: (key) => set({ apiKey: key }),
            setReportCode: (code) => set({ reportCode: code }),
            setFightId: (id) => set({ fightId: id }),
            setSelectedJob: (job) => set({ selectedJob: job }),
            setSelectedPlayerId: (id) => set({ selectedPlayerId: id }),
            setIsRendering: (is) => set({ isRendering: is }),

            loadFightMetadata: async () => {
                const { apiKey, reportCode, fightId } = get();
                if (!apiKey || !reportCode || !fightId) {
                    set({ error: '缺少输入' });
                    return;
                }

                set({ isLoading: true, error: null });
                try {
                    const report = await fetchReport(reportCode, apiKey);
                    const fightMeta = report.fights.find((f) => f.id === Number(fightId));

                    if (!fightMeta) {
                        throw new Error('报告中未找到该 Fight ID');
                    }

                    const fight: Fight = {
                        id: fightMeta.id,
                        start: fightMeta.start_time,
                        end: fightMeta.end_time,
                        durationMs: fightMeta.end_time - fightMeta.start_time,
                        name: fightMeta.name,
                    };

                    const actors: Actor[] = report.friendlies
                        .filter((f) => f.type !== 'LimitBreak' && f.type !== 'Environment') // 基础过滤
                        .map((f) => ({
                            id: f.id,
                            name: f.name,
                            type: f.type,
                            subType: f.type, // 简化
                        }));

                    set({ fight, actors, isLoading: false });
                } catch (err: any) {
                    console.error(err);
                    set({ error: err.message || '加载战斗失败', isLoading: false });
                }
            },

            loadEvents: async () => {
                const { apiKey, reportCode, fight, selectedPlayerId } = get();
                if (!apiKey || !reportCode || !fight || !selectedPlayerId) return;

                // 设置 rendering 为 true，直到 Timeline 组件通知渲染完成
                set({ isLoading: true, isRendering: true, error: null });
                try {
                    // 并行拉取
                    const [damages, casts] = await Promise.all([
                        fetchEvents<DamageEvent>(
                            reportCode, apiKey, fight.id, 'damage-taken', fight.start, fight.end, selectedPlayerId
                        ),
                        fetchEvents<CastEvent>(
                            reportCode, apiKey, fight.id, 'casts', fight.start, fight.end, undefined, 1 // hostility=1 代表敌人
                        )
                    ]);

                    // 后处理添加 tMs
                    const processTimestamp = (e: any) => ({ ...e, tMs: e.timestamp - fight.start });

                    // --- 伤害事件合并逻辑 ---
                    const dict = new Map<number, { calc?: DamageEvent, dmg?: DamageEvent }>();
                    const standaloneEvents: DamageEvent[] = [];

                    damages.forEach(e => {
                        const pid = e.packetID;
                        if (pid) {
                            if (!dict.has(pid)) dict.set(pid, {});
                            const entry = dict.get(pid)!;

                            if (e.type === 'calculateddamage') {
                                entry.calc = e;
                            } else {
                                // 假设是 'damage' 或 'damage-taken'
                                entry.dmg = e;
                            }
                        } else {
                            // 无 packetID，视为独立事件
                            // 如果是没有 packetID 的 calculateddamage，也许也要用 ? 标记？
                            if (e.type === 'calculateddamage') {
                                standaloneEvents.push({ ...e, ability: { ...e.ability, name: `? ${e.ability.name}` } });
                            } else {
                                standaloneEvents.push(e);
                            }
                        }
                    });

                    const combinedDamages: DamageEvent[] = [];

                    for (const { calc, dmg } of dict.values()) {
                        if (calc && dmg) {
                            // 合并：时间来自计算值，数值来自实际伤害
                            combinedDamages.push({
                                ...dmg, // 以伤害事件为基础（用于数值、技能信息等）
                                timestamp: calc.timestamp, // 使用计算出的快照时间覆盖时间戳
                                packetID: calc.packetID,
                                type: 'damage-combined'
                            });
                        } else if (calc) {
                            // 只有计算值 -> ?
                            combinedDamages.push({
                                ...calc,
                                ability: { ...calc.ability, name: `? ${calc.ability.name}` }
                            });
                        } else if (dmg) {
                            // 只有伤害值 -> *
                            combinedDamages.push({
                                ...dmg,
                                ability: { ...dmg.ability, name: `* ${dmg.ability.name}` }
                            });
                        }
                    }

                    const finalDamages = [...standaloneEvents, ...combinedDamages].sort((a, b) => a.timestamp - b.timestamp);

                    set({
                        damageEvents: finalDamages.map(processTimestamp),
                        castEvents: casts.map(processTimestamp),
                        isLoading: false
                        // 注意: isRendering 仍然为 true，将在 Timeline 渲染完成后设置为 false
                    });
                } catch (err: any) {
                    console.error(err);
                    set({ error: err.message || '加载事件失败', isLoading: false, isRendering: false });
                }
            },

            addMitEvent: (event) => set((state) => ({ mitEvents: [...state.mitEvents, event] })),
            updateMitEvent: (id, updates) =>
                set((state) => ({
                    mitEvents: state.mitEvents.map((e) => (e.id === id ? { ...e, ...updates } : e)),
                })),
            removeMitEvent: (id) =>
                set((state) => ({ mitEvents: state.mitEvents.filter((e) => e.id !== id) })),
            setMitEvents: (events) => set({ mitEvents: events }),
        }),
        {
            name: 'xiv-mit-composer-storage',
            partialize: (state) => ({
                apiKey: state.apiKey,
                reportCode: state.reportCode,
                fightId: state.fightId,
                selectedJob: state.selectedJob,
                selectedPlayerId: state.selectedPlayerId,
                mitEvents: state.mitEvents,
            }),
        }
    )
);
