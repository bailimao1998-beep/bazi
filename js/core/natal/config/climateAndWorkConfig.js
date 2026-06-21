export const ELEMENT_KEYS = ["wood", "fire", "earth", "metal", "water"];

export const ELEMENT_LABELS = {
  wood: "木",
  fire: "火",
  earth: "土",
  metal: "金",
  water: "水",
};

export const ELEMENT_GENERATING = {
  wood: "fire",
  fire: "earth",
  earth: "metal",
  metal: "water",
  water: "wood",
};

export const ELEMENT_CONTROLLING = {
  wood: "earth",
  earth: "water",
  water: "fire",
  fire: "metal",
  metal: "wood",
};

export const TEN_GOD_GROUPS = {
  peer: ["比肩", "劫财", "日主"],
  resource: ["正印", "偏印"],
  output: ["食神", "伤官"],
  wealth: ["正财", "偏财"],
  officer: ["正官", "七杀"],
};

export const ROLE_BY_TEN_GOD_GROUP = {
  peer: "body",
  resource: "body",
  output: "body",
  wealth: "use",
  officer: "use",
  unknown: "unknown",
};

export const MONTH_CLIMATE_BASE = {
  寅: { season: "spring", seasonLabel: "春", cold: 1, warm: 1, dry: 0, wet: 1 },
  卯: { season: "spring", seasonLabel: "春", cold: 0.5, warm: 1, dry: 0, wet: 1 },
  辰: { season: "late_spring", seasonLabel: "暮春", cold: 0.5, warm: 1, dry: 0, wet: 2 },
  巳: { season: "summer", seasonLabel: "夏", cold: 0, warm: 3, dry: 2, wet: 0 },
  午: { season: "summer", seasonLabel: "夏", cold: 0, warm: 4, dry: 3, wet: 0 },
  未: { season: "late_summer", seasonLabel: "长夏", cold: 0, warm: 3, dry: 3, wet: 0.5 },
  申: { season: "autumn", seasonLabel: "秋", cold: 1, warm: 1, dry: 2, wet: 0.5 },
  酉: { season: "autumn", seasonLabel: "秋", cold: 2, warm: 0.5, dry: 3, wet: 0 },
  戌: { season: "late_autumn", seasonLabel: "暮秋", cold: 1, warm: 1, dry: 3, wet: 0 },
  亥: { season: "winter", seasonLabel: "冬", cold: 3, warm: 0, dry: 0, wet: 3 },
  子: { season: "winter", seasonLabel: "冬", cold: 4, warm: 0, dry: 0, wet: 4 },
  丑: { season: "late_winter", seasonLabel: "季冬", cold: 3, warm: 0.5, dry: 0.5, wet: 3 },
};

export const ELEMENT_CLIMATE_CONTRIBUTIONS = {
  wood: { cold: 0, warm: 0.1, dry: 0, wet: 0.35 },
  fire: { cold: 0, warm: 1, dry: 0.5, wet: 0 },
  earth: { cold: 0, warm: 0.2, dry: 0.35, wet: 0.15 },
  metal: { cold: 0.35, warm: 0, dry: 0.5, wet: 0 },
  water: { cold: 1, warm: 0, dry: 0, wet: 0.8 },
};

export const CLIMATE_ADJUSTMENT_CANDIDATES = {
  warming: ["fire"],
  cooling: ["water"],
  drying: ["fire", "earth"],
  moistening: ["water", "wood"],
};

export const PASS_THROUGH_CANDIDATES = [
  { conflictElements: ["fire", "metal"], mediatorElement: "earth", label: "火金之间以土作通关候选" },
  { conflictElements: ["wood", "earth"], mediatorElement: "fire", label: "木土之间以火作通关候选" },
  { conflictElements: ["water", "fire"], mediatorElement: "wood", label: "水火之间以木作通关候选" },
  { conflictElements: ["metal", "wood"], mediatorElement: "water", label: "金木之间以水作通关候选" },
  { conflictElements: ["earth", "water"], mediatorElement: "metal", label: "土水之间以金作通关候选" },
];

export function tenGodGroup(tenGod) {
  for (const [group, names] of Object.entries(TEN_GOD_GROUPS)) {
    if (names.includes(tenGod)) return group;
  }
  return "unknown";
}
