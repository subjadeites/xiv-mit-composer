export type Job = 'PLD' | 'WAR' | 'DRK' | 'GNB';

export interface Fight {
    id: number;
    start: number;
    end: number;
    durationMs: number;
    name: string;
}

export interface Actor {
    id: number;
    name: string;
    type: string;
    subType: string;
}

export interface Skill {
    id: string;
    name: string;
    cooldownSec: number;
    durationSec: number;
    job: Job | 'ALL';
    icon?: string;
    color?: string;
}

export interface MitEvent {
    id: string; // uuid
    skillId: string;
    tStartMs: number;
    durationMs: number;
    // 辅助字段
    tEndMs: number;
}

// API 响应结构 (简化版)
export interface FFLogsAbility {
    name: string;
    guid: number;
    type: number;
}

export interface DamageEvent {
    timestamp: number;
    type: string; // 'damage-taken' 或 'calculateddamage'
    sourceID: number;
    targetID: number;
    ability: FFLogsAbility;
    amount: number;
    unmitigatedAmount: number;
    packetID?: number;
    // 计算字段
    tMs: number;
}

export interface CastEvent {
    timestamp: number;
    type: string; // 'cast' 或 'begincast'
    sourceID: number;
    targetID: number;
    ability: FFLogsAbility;
    duration?: number;
    // 计算字段
    tMs: number;
}
