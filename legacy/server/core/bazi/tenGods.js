import { stemElements } from "./fiveElements.js";

export const stems = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
export const branches = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];

const stemPolarity = {
  甲: "yang",
  乙: "yin",
  丙: "yang",
  丁: "yin",
  戊: "yang",
  己: "yin",
  庚: "yang",
  辛: "yin",
  壬: "yang",
  癸: "yin",
};

const generates = { wood: "fire", fire: "earth", earth: "metal", metal: "water", water: "wood" };
const controls = { wood: "earth", earth: "water", water: "fire", fire: "metal", metal: "wood" };

export function getTenGod(dayStem, targetStem) {
  const dayElement = stemElements[dayStem];
  const targetElement = stemElements[targetStem];
  const samePolarity = stemPolarity[dayStem] === stemPolarity[targetStem];
  if (!dayElement || !targetElement) return "未知";
  if (targetElement === dayElement) return samePolarity ? "比肩" : "劫财";
  if (generates[dayElement] === targetElement) return samePolarity ? "食神" : "伤官";
  if (controls[dayElement] === targetElement) return samePolarity ? "偏财" : "正财";
  if (controls[targetElement] === dayElement) return samePolarity ? "七杀" : "正官";
  return samePolarity ? "偏印" : "正印";
}

export function buildTenGodSummary(dayStem, pillars = {}) {
  return Object.fromEntries(Object.entries(pillars).map(([key, pillar]) => [
    key,
    {
      stem: key === "day" ? "日主" : getTenGod(dayStem, pillar.stem),
      branch: getTenGod(dayStem, branchMainStem(pillar.branch)),
    },
  ]));
}

export function branchMainStem(branch) {
  return {
    子: "癸",
    丑: "己",
    寅: "甲",
    卯: "乙",
    辰: "戊",
    巳: "丙",
    午: "丁",
    未: "己",
    申: "庚",
    酉: "辛",
    戌: "戊",
    亥: "壬",
  }[branch];
}
