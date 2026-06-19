export const elementLabels = {
  wood: "木",
  fire: "火",
  earth: "土",
  metal: "金",
  water: "水",
};

export const stemElements = {
  甲: "wood",
  乙: "wood",
  丙: "fire",
  丁: "fire",
  戊: "earth",
  己: "earth",
  庚: "metal",
  辛: "metal",
  壬: "water",
  癸: "water",
};

export const branchElements = {
  子: "water",
  丑: "earth",
  寅: "wood",
  卯: "wood",
  辰: "earth",
  巳: "fire",
  午: "fire",
  未: "earth",
  申: "metal",
  酉: "metal",
  戌: "earth",
  亥: "water",
};

export const hiddenStems = {
  子: ["癸"],
  丑: ["己", "癸", "辛"],
  寅: ["甲", "丙", "戊"],
  卯: ["乙"],
  辰: ["戊", "乙", "癸"],
  巳: ["丙", "庚", "戊"],
  午: ["丁", "己"],
  未: ["己", "丁", "乙"],
  申: ["庚", "壬", "戊"],
  酉: ["辛"],
  戌: ["戊", "辛", "丁"],
  亥: ["壬", "甲"],
};

export function countElements(pillars = {}) {
  const counts = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
  for (const pillar of Object.values(pillars)) {
    if (!pillar) continue;
    increment(counts, stemElements[pillar.stem], 1);
    increment(counts, branchElements[pillar.branch], 1);
    for (const stem of hiddenStems[pillar.branch] ?? []) {
      increment(counts, stemElements[stem], 0.4);
    }
  }
  return counts;
}

export function dominantElements(counts = {}) {
  return Object.entries(counts)
    .sort((left, right) => Number(right[1]) - Number(left[1]))
    .slice(0, 2)
    .map(([element, value]) => ({ element, label: elementLabels[element], value: round(value) }));
}

function increment(counts, element, value) {
  if (!element) return;
  counts[element] = round(Number(counts[element] ?? 0) + value);
}

function round(value) {
  return Math.round((Number(value) + Number.EPSILON) * 10) / 10;
}
