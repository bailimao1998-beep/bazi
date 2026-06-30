import { branches, stems } from "./tenGods.js";

export const PILLAR_KEYS = ["year", "month", "day", "hour"];

export const VOID_BRANCHES_BY_DECADE = [
  ["戌", "亥"],
  ["申", "酉"],
  ["午", "未"],
  ["辰", "巳"],
  ["寅", "卯"],
  ["子", "丑"],
];

export const TWELVE_GROWTH_STAGES = [
  "长生", "沐浴", "冠带", "临官", "帝旺", "衰",
  "病", "死", "墓", "绝", "胎", "养",
];

export const TWELVE_GROWTH_PHASES = {
  长生: "inception",
  沐浴: "development",
  冠带: "development",
  临官: "maturity",
  帝旺: "maturity",
  衰: "decline",
  病: "decline",
  死: "closure",
  墓: "closure",
  绝: "closure",
  胎: "gestation",
  养: "gestation",
};

export const TWELVE_GROWTH_MATRIX = {
  甲: { 子: "沐浴", 丑: "冠带", 寅: "临官", 卯: "帝旺", 辰: "衰", 巳: "病", 午: "死", 未: "墓", 申: "绝", 酉: "胎", 戌: "养", 亥: "长生" },
  乙: { 子: "病", 丑: "衰", 寅: "帝旺", 卯: "临官", 辰: "冠带", 巳: "沐浴", 午: "长生", 未: "养", 申: "胎", 酉: "绝", 戌: "墓", 亥: "死" },
  丙: { 子: "胎", 丑: "养", 寅: "长生", 卯: "沐浴", 辰: "冠带", 巳: "临官", 午: "帝旺", 未: "衰", 申: "病", 酉: "死", 戌: "墓", 亥: "绝" },
  丁: { 子: "绝", 丑: "墓", 寅: "死", 卯: "病", 辰: "衰", 巳: "帝旺", 午: "临官", 未: "冠带", 申: "沐浴", 酉: "长生", 戌: "养", 亥: "胎" },
  戊: { 子: "胎", 丑: "养", 寅: "长生", 卯: "沐浴", 辰: "冠带", 巳: "临官", 午: "帝旺", 未: "衰", 申: "病", 酉: "死", 戌: "墓", 亥: "绝" },
  己: { 子: "绝", 丑: "墓", 寅: "死", 卯: "病", 辰: "衰", 巳: "帝旺", 午: "临官", 未: "冠带", 申: "沐浴", 酉: "长生", 戌: "养", 亥: "胎" },
  庚: { 子: "死", 丑: "墓", 寅: "绝", 卯: "胎", 辰: "养", 巳: "长生", 午: "沐浴", 未: "冠带", 申: "临官", 酉: "帝旺", 戌: "衰", 亥: "病" },
  辛: { 子: "长生", 丑: "养", 寅: "胎", 卯: "绝", 辰: "墓", 巳: "死", 午: "病", 未: "衰", 申: "帝旺", 酉: "临官", 戌: "冠带", 亥: "沐浴" },
  壬: { 子: "帝旺", 丑: "衰", 寅: "病", 卯: "死", 辰: "墓", 巳: "绝", 午: "胎", 未: "养", 申: "长生", 酉: "沐浴", 戌: "冠带", 亥: "临官" },
  癸: { 子: "临官", 丑: "冠带", 寅: "沐浴", 卯: "长生", 辰: "养", 巳: "胎", 午: "绝", 未: "墓", 申: "死", 酉: "病", 戌: "衰", 亥: "帝旺" },
};

export const STORAGE_BRANCH_CONFIG = {
  辰: { branch: "辰", storageElement: "water", storageElementLabel: "水", storageLabel: "水库", storedStem: "癸" },
  戌: { branch: "戌", storageElement: "fire", storageElementLabel: "火", storageLabel: "火库", storedStem: "丁" },
  丑: { branch: "丑", storageElement: "metal", storageElementLabel: "金", storageLabel: "金库", storedStem: "辛" },
  未: { branch: "未", storageElement: "wood", storageElementLabel: "木", storageLabel: "木库", storedStem: "乙" },
};

export function resolveGanzhiIndex(stem, branch) {
  const stemIndex = stems.indexOf(stem);
  const branchIndex = branches.indexOf(branch);

  if (stemIndex < 0 || branchIndex < 0) {
    return -1;
  }

  for (let index = 0; index < 60; index += 1) {
    if (
      index % stems.length === stemIndex &&
      index % branches.length === branchIndex
    ) {
      return index;
    }
  }

  return -1;
}

export function resolveVoidBranches(stem, branch) {
  const index = resolveGanzhiIndex(stem, branch);
  if (index < 0) return [];
  return [...(VOID_BRANCHES_BY_DECADE[Math.floor(index / 10)] ?? [])];
}

export function resolveGrowthStage(stem, branch) {
  return TWELVE_GROWTH_MATRIX?.[stem]?.[branch] ?? "unknown";
}
