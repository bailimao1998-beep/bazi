import { branchElements, countElements, dominantElements, elementLabels, hiddenStems, stemElements } from "./fiveElements.js";
import { branches, branchMainStem, buildTenGodSummary, getTenGod, stems } from "./tenGods.js";
import { buildLuckCycles } from "./luckCycles.js";
import { buildShensha } from "./shensha.js";
import { buildBaziRelations } from "./relations.js";
import { buildBaziStructureAnalysis } from "./buildBaziStructureAnalysis.js";
import {
  buildNatalPillars,
  createPillarByIndex,
  formatBirthDate,
  formatBirthTime,
  getGanzhiIndex,
  parseBirth,
} from "./pillarMath.js";
import {
  TWELVE_GROWTH_MATRIX,
  resolveVoidBranches,
} from "./specialStateTables.js";

const pillarKeys = ["year", "month", "day", "hour"];
const monthBranches = ["寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥", "子", "丑"];
const nayinByPair = [
  "海中金", "炉中火", "大林木", "路旁土", "剑锋金", "山头火", "涧下水", "城头土", "白蜡金", "杨柳木",
  "泉中水", "屋上土", "霹雳火", "松柏木", "长流水", "沙中金", "山下火", "平地木", "壁上土", "金箔金",
  "覆灯火", "天河水", "大驿土", "钗钏金", "桑柘木", "大溪水", "沙中土", "天上火", "石榴木", "大海水",
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
  const shensha = buildShensha(pillars, input);
  const pillarDetails = buildPillarDetails(pillars, shensha.byPillar);
  const relations = buildBaziRelations(pillars);
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
  const chart = {
    input: {
      name: input.name ?? "",
      birthDate: input.birthDate ?? input.date,
      birthTime: input.birthTime ?? input.time,
      gender: input.gender ?? "unknown",
      birthProvince: input.birthProvince ?? "",
      birthplace: input.birthplace ?? "",
      birthLongitude: input.birthLongitude,
      birthLatitude: input.birthLatitude,
      standardMeridian: input.standardMeridian,
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
    relations,
    shensha,
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
  return {
    ...chart,
    structureAnalysis: buildBaziStructureAnalysis(chart),
  };
}

function buildPillarDetails(pillars, shenshaByPillar = {}) {
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
      twelveGrowth: TWELVE_GROWTH_MATRIX[pillars.day.stem]?.[pillar.branch] ?? "待查",
      voidBranches: getVoidBranches(pillar),
      shensha: shenshaByPillar[key] ?? [],
    },
  ]));
}

function buildAuxiliaryChart(pillars) {
  return {
    nayin: Object.fromEntries(pillarKeys.map((key) => [key, getNayin(pillars[key])])),
    twelveStages: Object.fromEntries(pillarKeys.map((key) => [key, TWELVE_GROWTH_MATRIX[pillars.day.stem]?.[pillars[key].branch] ?? "待查"])),
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

function createFetalOrigin(monthPillar) {
  const stemIndex = stems.indexOf(monthPillar?.stem);
  const branchIndex = branches.indexOf(monthPillar?.branch);

  if (stemIndex < 0 || branchIndex < 0) {
    throw new Error("无法计算胎元：月柱干支无效");
  }

  // 胎元常用口径：月干进一位，月支进三位。
  const fetalStem = stems[(stemIndex + 1) % stems.length];
  const fetalBranch = branches[(branchIndex + 3) % branches.length];

  return createPillarByIndex(
    getGanzhiIndex(fetalStem, fetalBranch),
    "胎元",
    {
      method: "胎元按月干进一、月支进三计算。",
      sourceMonthPillar:
        monthPillar.label ?? `${monthPillar.stem}${monthPillar.branch}`,
    },
  );
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
  return resolveVoidBranches(
    pillar?.stem,
    pillar?.branch,
  );
}

function incrementName(counts, name) {
  if (!name || name === "未知") return;
  counts[name] = (counts[name] ?? 0) + 1;
}
