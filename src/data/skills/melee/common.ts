import type { Skill } from '../../../model/types';

export const MELEE_COMMON_SKILLS: Skill[] = [
  {
    id: 'role-bloodbath',
    name: '浴血',
    name_en: 'Bloodbath',
    name_jp: 'ブラッドバス',
    name_fr: 'Bain de sang',
    name_de: 'Blutbad',
    cooldownSec: 90,
    durationSec: 20,
    job: 'ALL',
    color: 'bg-slate-500',
    actionId: 7542,
  },
  {
    id: 'role-feint',
    name: '牵制',
    name_en: 'Feint',
    name_jp: '牽制',
    name_fr: 'Restreinte',
    name_de: 'Zermürben',
    cooldownSec: 90,
    durationSec: 15,
    mitigation: [
      {
        kind: 'damage-down',
        target: 'boss',
        pct: 10,
        durationSec: 15,
        damageType: 'physical',
        targeting: { kind: 'party' },
      },
      {
        kind: 'damage-down',
        target: 'boss',
        pct: 5,
        durationSec: 15,
        damageType: 'magical',
        targeting: { kind: 'party' },
      },
    ],
    job: 'ALL',
    color: 'bg-slate-600',
    actionId: 7549,
  },
];
