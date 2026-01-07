import type { Skill } from '../../model/types';

export const SKILLS: Skill[] = [
    // 骑士 (PLD)
    { id: 'pld-rampart', name: '铁壁', cooldownSec: 90, durationSec: 20, job: 'PLD', color: 'bg-blue-500' },
    { id: 'pld-sentinel', name: '绝对防御', cooldownSec: 120, durationSec: 15, job: 'PLD', color: 'bg-blue-600' },
    { id: 'pld-h-sheltron', name: '圣盾阵', cooldownSec: 5, durationSec: 8, job: 'PLD', color: 'bg-blue-400' },
    { id: 'pld-bulwark', name: '壁垒', cooldownSec: 90, durationSec: 10, job: 'PLD', color: 'bg-blue-700' },

    // 战士 (WAR)
    { id: 'war-rampart', name: '铁壁', cooldownSec: 90, durationSec: 20, job: 'WAR', color: 'bg-red-500' },
    { id: 'war-vengeance', name: '复仇', cooldownSec: 120, durationSec: 15, job: 'WAR', color: 'bg-red-600' },
    { id: 'war-bloodwhetting', name: '原初的血气', cooldownSec: 25, durationSec: 8, job: 'WAR', color: 'bg-red-400' },
    { id: 'war-thrill', name: '战栗', cooldownSec: 90, durationSec: 10, job: 'WAR', color: 'bg-red-700' },

    // 暗黑骑士 (DRK)
    { id: 'drk-rampart', name: '铁壁', cooldownSec: 90, durationSec: 20, job: 'DRK', color: 'bg-purple-500' },
    { id: 'drk-shadow-wall', name: '暗影墙', cooldownSec: 120, durationSec: 15, job: 'DRK', color: 'bg-purple-600' },
    { id: 'drk-tbn', name: '至黑之夜', cooldownSec: 15, durationSec: 7, job: 'DRK', color: 'bg-purple-400' },
    { id: 'drk-oblation', name: '献奉', cooldownSec: 60, durationSec: 10, job: 'DRK', color: 'bg-purple-700' },

    // 绝枪战士 (GNB)
    { id: 'gnb-rampart', name: '铁壁', cooldownSec: 90, durationSec: 20, job: 'GNB', color: 'bg-orange-500' },
    { id: 'gnb-nebula', name: '大星云', cooldownSec: 120, durationSec: 15, job: 'GNB', color: 'bg-orange-600' },
    { id: 'gnb-hoc', name: '刚玉之心', cooldownSec: 25, durationSec: 8, job: 'GNB', color: 'bg-orange-400' },
    { id: 'gnb-camouflage', name: '伪装', cooldownSec: 90, durationSec: 20, job: 'GNB', color: 'bg-orange-700' },
];
