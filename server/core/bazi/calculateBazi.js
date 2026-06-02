import { branchElements, countElements, dominantElements, elementLabels, hiddenStems, stemElements } from "./fiveElements.js";
import { branches, branchMainStem, buildTenGodSummary, getTenGod, stems } from "./tenGods.js";
import { buildLuckCycles } from "./luckCycles.js";
import {
  buildNatalPillars,
  createPillarByIndex,
  formatBirthDate,
  formatBirthTime,
  getGanzhiIndex,
  parseBirth,
} from "./pillarMath.js";

const pillarKeys = ["year", "month", "day", "hour"];
const monthBranches = ["寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥", "子", "丑"];
const nayinByPair = [
  "海中金", "炉中火", "大林木", "路旁土", "剑锋金", "山头火", "涧下水", "城头土", "白蜡金", "杨柳木",
  "泉中水", "屋上土", "霹雳火", "松柏木", "长流水", "沙中金", "山下火", "平地木", "壁上土", "金箔金",
  "覆灯火", "天河水", "大驿土", "钗钏金", "桑柘木", "大溪水", "沙中土", "天上火", "石榴木", "大海水",
];
const voidBranchesByDecade = [
  ["戌", "亥"],
  ["申", "酉"],
  ["午", "未"],
  ["辰", "巳"],
  ["寅", "卯"],
  ["子", "丑"],
];
const twelveStageMatrix = {
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
const comboRules = [
  ["天干五合", ["甲", "己"], "合化土"],
  ["天干五合", ["乙", "庚"], "合化金"],
  ["天干五合", ["丙", "辛"], "合化水"],
  ["天干五合", ["丁", "壬"], "合化木"],
  ["天干五合", ["戊", "癸"], "合化火"],
  ["地支六合", ["子", "丑"], "合土"],
  ["地支六合", ["寅", "亥"], "合木"],
  ["地支六合", ["卯", "戌"], "合火"],
  ["地支六合", ["辰", "酉"], "合金"],
  ["地支六合", ["巳", "申"], "合水"],
  ["地支六合", ["午", "未"], "合土"],
  ["地支六冲", ["子", "午"], "冲"],
  ["地支六冲", ["丑", "未"], "冲"],
  ["地支六冲", ["寅", "申"], "冲"],
  ["地支六冲", ["卯", "酉"], "冲"],
  ["地支六冲", ["辰", "戌"], "冲"],
  ["地支六冲", ["巳", "亥"], "冲"],
  ["地支六害", ["子", "未"], "害"],
  ["地支六害", ["丑", "午"], "害"],
  ["地支六害", ["寅", "巳"], "害"],
  ["地支六害", ["卯", "辰"], "害"],
  ["地支六害", ["申", "亥"], "害"],
  ["地支六害", ["酉", "戌"], "害"],
];

export function calculateBazi(input = {}, datasets = {}) {
  const birth = parseBirth(input, datasets);
  const pillars = buildNatalPillars(birth);
  const elements = countElements(pillars);
  const tenGods = buildTenGodSummary(pillars.day.stem, pillars);
  const luckCycles = buildLuckCycles({
    birth,
    gender: input.gender,
    yearPillar: pillars.year,
    monthPillar: pillars.month,
  });
  const pillarDetails = buildPillarDetails(pillars);
  const calendar = {
    solarDate: formatBirthDate(birth),
    time: formatBirthTime(birth),
    originalSolarDate: birth.original ? formatBirthDate(birth.original) : formatBirthDate(birth),
    originalTime: birth.original ? formatBirthTime(birth.original) : formatBirthTime(birth),
    inputCalendarType: birth.calendar?.inputCalendarType ?? "solar",
    lunarDate: birth.calendar?.lunarDate ?? "",
    trueSolarTime: birth.trueSolarTime,
    monthNote: pillars.month.meta?.method ?? "",
    solarTermRange: `${pillars.month.meta?.solarTerm ?? "节气"}之后、${pillars.month.meta?.nextSolarTerm ?? "下一节气"}之前`,
    dayPillarDate: pillars.day.meta?.pillarDate ?? "",
    dayPillarRule: "23:00-23:59按次日计算日柱（晚子时换日）",
    hourPillarRule: "按最终排盘时间取时辰，晚子时使用次日日干起时柱。",
  };
  const auxiliary = buildAuxiliaryChart(pillars);

  return {
    input: {
      name: input.name ?? "",
      birthDate: input.birthDate ?? input.date,
      birthTime: input.birthTime ?? input.time,
      gender: input.gender ?? "unknown",
      birthplace: input.birthplace ?? "",
      trueSolarTime: Boolean(input.trueSolarTime),
    },
    pillars,
    dayMaster: {
      stem: pillars.day.stem,
      element: stemElements[pillars.day.stem],
      label: `${pillars.day.stem}日主`,
    },
    elements,
    dominantElements: dominantElements(elements),
    tenGods,
    tenGodStats: buildTenGodStats(pillarDetails),
    elementStats: buildElementStats(pillars),
    pillarDetails,
    relations: findRelations(pillars),
    auxiliary,
    luckCycles,
    calendar,
    meta: {
      engine: "birth-chart-engine",
      version: "0.2.0",
      calendar,
      evidence: [
        `四柱：${Object.values(pillars).map((pillar) => pillar.label).join(" ")}`,
        `月柱依据${pillars.month.meta?.solarTerm ?? "节气"}换月；日柱日期为${pillars.day.meta?.pillarDate ?? calendar.solarDate}。`,
      ],
      confidence: "medium",
      needVerify: ["节气时刻、真太阳时和起运口径仍建议保留人工复核入口。"],
    },
  };
}

function buildPillarDetails(pillars) {
  return Object.fromEntries(Object.entries(pillars).map(([key, pillar]) => [
    key,
    {
      key,
      label: pillar.role,
      pillar,
      stemTenGod: key === "day" ? "日主" : getTenGod(pillars.day.stem, pillar.stem),
      branchMainTenGod: getTenGod(pillars.day.stem, branchMainStem(pillar.branch)),
      hiddenStems: (hiddenStems[pillar.branch] ?? []).map((stem, index) => ({
        stem,
        tenGod: getTenGod(pillars.day.stem, stem),
        element: stemElements[stem],
        elementLabel: elementLabels[stemElements[stem]],
        role: ["主气", "中气", "余气"][index] ?? "余气",
      })),
      nayin: getNayin(pillar),
      twelveGrowth: twelveStageMatrix[pillars.day.stem]?.[pillar.branch] ?? "待查",
      voidBranches: getVoidBranches(pillar),
    },
  ]));
}

function buildAuxiliaryChart(pillars) {
  return {
    nayin: Object.fromEntries(pillarKeys.map((key) => [key, getNayin(pillars[key])])),
    twelveStages: Object.fromEntries(pillarKeys.map((key) => [key, twelveStageMatrix[pillars.day.stem]?.[pillars[key].branch] ?? "待查"])),
    voidBranches: Object.fromEntries(pillarKeys.map((key) => [key, getVoidBranches(pillars[key])])),
    fetalOrigin: createFetalOrigin(pillars.month),
    lifePalace: createPalacePillar(pillars.month, pillars.hour, "命宫", false),
    bodyPalace: createPalacePillar(pillars.month, pillars.hour, "身宫", true),
  };
}

function buildTenGodStats(pillarDetails) {
  const hiddenCounts = {};
  const mainCounts = {};
  for (const detail of Object.values(pillarDetails)) {
    incrementName(mainCounts, detail.stemTenGod === "日主" ? "比肩" : detail.stemTenGod);
    incrementName(mainCounts, detail.branchMainTenGod);
    for (const hidden of detail.hiddenStems ?? []) {
      incrementName(hiddenCounts, hidden.tenGod);
    }
  }
  return {
    fullHidden: hiddenCounts,
    mainQi: mainCounts,
    notes: {
      fullHidden: "按完整藏干统计",
      mainQi: "按天干与地支主气统计",
    },
  };
}

function buildElementStats(pillars) {
  const visible = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
  const hidden = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
  for (const pillar of Object.values(pillars)) {
    visible[stemElements[pillar.stem]] += 1;
    visible[branchElements[pillar.branch]] += 1;
    for (const stem of hiddenStems[pillar.branch] ?? []) {
      hidden[stemElements[stem]] += 1;
    }
  }
  return {
    visible: { label: "明面五行", note: "按四柱天干地支统计", counts: visible },
    hidden: { label: "藏干五行", note: "按地支藏干统计", counts: hidden },
  };
}

function findRelations(pillars) {
  const items = Object.values(pillars);
  const relations = [];
  for (let leftIndex = 0; leftIndex < items.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < items.length; rightIndex += 1) {
      const left = items[leftIndex];
      const right = items[rightIndex];
      for (const [type, members, effect] of comboRules) {
        if (samePair(members, [left.stem, right.stem]) || samePair(members, [left.branch, right.branch])) {
          relations.push({
            type,
            effect,
            pillars: [left.role, right.role],
            members,
            ganzhi: [left.label, right.label],
            evidence: `${left.role}${left.label} 与 ${right.role}${right.label}：${type}${effect}`,
            confidence: "medium",
            needVerify: ["干支关系为结构观察点，需要结合柱位与岁运继续验证。"],
          });
        }
      }
    }
  }
  return relations;
}

function samePair(left, right) {
  return left.length === right.length && left.every((item) => right.includes(item));
}

function createFetalOrigin(monthPillar) {
  return createPillarByIndex(getGanzhiIndex(monthPillar.stem, monthPillar.branch) + 1, "胎元", { method: "月柱后一干三支近似法" });
}

function createPalacePillar(monthPillar, hourPillar, role, isBodyPalace) {
  const monthPosition = monthBranches.indexOf(monthPillar.branch) + 1;
  const hourPosition = branches.indexOf(hourPillar.branch) + 1;
  const branchIndexFromYin = isBodyPalace
    ? (monthPosition + hourPosition - 2) % 12
    : (14 - monthPosition - hourPosition + 12) % 12;
  const branch = monthBranches[branchIndexFromYin];
  const stem = stems[(stems.indexOf(monthPillar.stem) + branchIndexFromYin) % 10];
  return {
    ...createPillarByIndex(getGanzhiIndex(stem, branch), role, { method: isBodyPalace ? "月时顺推身宫近似法" : "月时逆推命宫近似法" }),
    stem,
    branch,
    label: `${stem}${branch}`,
  };
}

function getNayin(pillar) {
  return nayinByPair[Math.floor(getGanzhiIndex(pillar.stem, pillar.branch) / 2)] ?? "待查";
}

function getVoidBranches(pillar) {
  return voidBranchesByDecade[Math.floor(getGanzhiIndex(pillar.stem, pillar.branch) / 10)] ?? [];
}

function incrementName(counts, name) {
  if (!name || name === "未知") return;
  counts[name] = (counts[name] ?? 0) + 1;
}
