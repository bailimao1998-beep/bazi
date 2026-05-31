import { formatLunarDate, lunarToSolar, solarToLunar } from "./lunarCalendar.js";
import { getBasicBaziDisplay } from "./baziBasics.js";
import { adaptBaziBasicChart, matchBaziBasicRules } from "./baziBasicRules.js";
import { matchReferenceKnowledge as matchReferenceKnowledgeCards } from "./referenceKnowledge.js";

const STEMS = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const BRANCHES = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
const ELEMENT_LABELS = {
  wood: "木",
  fire: "火",
  earth: "土",
  metal: "金",
  water: "水",
};
const STEM_ELEMENTS = {
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
const STEM_YIN_YANG = {
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
const BRANCH_ELEMENTS = {
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
const ZODIAC_BY_BRANCH = {
  子: "鼠", 丑: "牛", 寅: "虎", 卯: "兔", 辰: "龙", 巳: "蛇",
  午: "马", 未: "羊", 申: "猴", 酉: "鸡", 戌: "狗", 亥: "猪",
};
const MONTH_BRANCHES = ["寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥", "子", "丑"];
const DEFAULT_LOCATIONS = [
  { name: "北京", aliases: ["北京市"], longitude: 116.4074, latitude: 39.9042, timezone: "Asia/Shanghai", standardMeridian: 120 },
  { name: "上海", aliases: ["上海市"], longitude: 121.4737, latitude: 31.2304, timezone: "Asia/Shanghai", standardMeridian: 120 },
  { name: "广州", aliases: ["广州市"], longitude: 113.2644, latitude: 23.1291, timezone: "Asia/Shanghai", standardMeridian: 120 },
  { name: "深圳", aliases: ["深圳市"], longitude: 114.0579, latitude: 22.5431, timezone: "Asia/Shanghai", standardMeridian: 120 },
  { name: "成都", aliases: ["成都市"], longitude: 104.0665, latitude: 30.5728, timezone: "Asia/Shanghai", standardMeridian: 120 },
  { name: "乌鲁木齐", aliases: ["乌市", "乌鲁木齐市"], longitude: 87.6168, latitude: 43.8256, timezone: "Asia/Shanghai", standardMeridian: 120 },
];
const NAYIN_BY_PAIR = [
  "海中金",
  "炉中火",
  "大林木",
  "路旁土",
  "剑锋金",
  "山头火",
  "涧下水",
  "城头土",
  "白蜡金",
  "杨柳木",
  "泉中水",
  "屋上土",
  "霹雳火",
  "松柏木",
  "长流水",
  "沙中金",
  "山下火",
  "平地木",
  "壁上土",
  "金箔金",
  "覆灯火",
  "天河水",
  "大驿土",
  "钗钏金",
  "桑柘木",
  "大溪水",
  "沙中土",
  "天上火",
  "石榴木",
  "大海水",
];
const VOID_BRANCHES_BY_DECADE = [
  ["戌", "亥"],
  ["申", "酉"],
  ["午", "未"],
  ["辰", "巳"],
  ["寅", "卯"],
  ["子", "丑"],
];
const TWELVE_STAGE_MATRIX = {
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
const LOCAL_TIMEZONE_OFFSET_MINUTES = 480;
const DAY_PILLAR_ANCHOR = { year: 1984, month: 2, day: 2, index: 2, label: "丙寅" };
const MONTH_BOUNDARY_TERMS = [
  { name: "小寒", month: 1, day: 6, longitude: 285, branch: "丑" },
  { name: "立春", month: 2, day: 4, longitude: 315, branch: "寅" },
  { name: "惊蛰", month: 3, day: 6, longitude: 345, branch: "卯" },
  { name: "清明", month: 4, day: 5, longitude: 15, branch: "辰" },
  { name: "立夏", month: 5, day: 6, longitude: 45, branch: "巳" },
  { name: "芒种", month: 6, day: 6, longitude: 75, branch: "午" },
  { name: "小暑", month: 7, day: 7, longitude: 105, branch: "未" },
  { name: "立秋", month: 8, day: 8, longitude: 135, branch: "申" },
  { name: "白露", month: 9, day: 8, longitude: 165, branch: "酉" },
  { name: "寒露", month: 10, day: 8, longitude: 195, branch: "戌" },
  { name: "立冬", month: 11, day: 7, longitude: 225, branch: "亥" },
  { name: "大雪", month: 12, day: 7, longitude: 255, branch: "子" },
];
const APPROX_SOLAR_MONTH_BOUNDARIES = MONTH_BOUNDARY_TERMS.map(({ month, day, branch }) => ({ month, day, branch }));
const solarTermCache = new Map();
const TOPICS = [
  { id: "personality", label: "性格", gods: ["比肩", "劫财", "食神", "伤官", "偏印", "正印"] },
  { id: "family", label: "家庭", gods: ["正印", "偏印", "正财", "偏财", "比肩"] },
  { id: "children", label: "子女", gods: ["食神", "伤官"] },
  { id: "health", label: "健康", gods: ["正印", "偏印", "七杀", "伤官"] },
  { id: "money", label: "财运", gods: ["正财", "偏财", "比肩", "劫财"] },
  { id: "marriage", label: "夫妻", gods: ["正官", "七杀", "正财", "偏财"] },
  { id: "career", label: "官禄", gods: ["正官", "七杀", "正印", "偏印", "食神"] },
];
const PILLAR_KEYS = ["year", "month", "day", "hour"];
const PILLAR_LABELS = { year: "年柱", month: "月柱", day: "日柱", hour: "时柱" };
const COMBO_RULES = [
  ["天干五合", ["甲", "己"], "合化土", "两干相合，现实协调、牵绊和合作主题增强。"],
  ["天干五合", ["乙", "庚"], "合化金", "柔韧与规则相合，关系里有约束和成事机会。"],
  ["天干五合", ["丙", "辛"], "合化水", "明暗互引，表达、资源和情绪流动变强。"],
  ["天干五合", ["丁", "壬"], "合化木", "情感牵引明显，学习、生发和关系黏性增强。"],
  ["天干五合", ["戊", "癸"], "合化火", "现实与愿望相遇，计划、欲望和行动被点燃。"],
  ["地支六合", ["子", "丑"], "合土", "合作、稳定和资源整合主题增强。"],
  ["地支六合", ["寅", "亥"], "合木", "人脉、学习、流动和生发力量增强。"],
  ["地支六合", ["卯", "戌"], "合火", "表达、热度和关系中的承诺感增强。"],
  ["地支六合", ["辰", "酉"], "合金", "规则、技术、执行和收束力量增强。"],
  ["地支六合", ["巳", "申"], "合水", "变动、信息、暗线和策略力量增强。"],
  ["地支六合", ["午", "未"], "合土", "日常经营、稳定和承载力量增强。"],
  ["地支六冲", ["子", "午"], "冲", "动荡、迁移、冲突或事情被迫推进。"],
  ["地支六冲", ["丑", "未"], "冲", "家庭、资产、身体承载层面容易被触动。"],
  ["地支六冲", ["寅", "申"], "冲", "行动路线、事业变化和外部压力容易显现。"],
  ["地支六冲", ["卯", "酉"], "冲", "关系、审美、合作和边界问题容易显现。"],
  ["地支六冲", ["辰", "戌"], "冲", "旧结构被翻动，合同、房产或责任主题明显。"],
  ["地支六冲", ["巳", "亥"], "冲", "信息、出行、情绪和健康节律易有波动。"],
  ["地支六害", ["子", "未"], "害", "暗中牵制，容易有难明说的不舒服。"],
  ["地支六害", ["丑", "午"], "害", "稳定与热度互扰，消耗感上升。"],
  ["地支六害", ["寅", "巳"], "害", "急进与焦灼并见，行动前要留余地。"],
  ["地支六害", ["卯", "辰"], "害", "关系和现实条件互相磨损。"],
  ["地支六害", ["申", "亥"], "害", "信息、人情和计划容易绕路。"],
  ["地支六害", ["酉", "戌"], "害", "规则与情面相害，容易有口舌或误解。"],
  ["地支六破", ["子", "酉"], "破", "原有秩序被拆动，适合修补不适合硬冲。"],
  ["地支六破", ["丑", "辰"], "破", "资源安排和长期结构容易松动。"],
  ["地支六破", ["寅", "亥"], "破", "机会中带反复，行动需要确认边界。"],
  ["地支六破", ["卯", "午"], "破", "情绪、表达和关系热度易过头。"],
  ["地支六破", ["巳", "申"], "破", "计划被临时变量打断，需备选方案。"],
  ["地支六破", ["未", "戌"], "破", "责任、家庭和承诺层面需要重新整理。"],
];

export function analyzeBirth(input, datasets = {}) {
  const birth = parseBirth(input, datasets);
  const pillars = buildNatalPillars(birth);
  const selectedYear = createPillarFromYear(input.selectedYear ?? new Date().getFullYear(), "流年");
  const selectedMonth = input.selectedMonth
    ? createMonthPillar(input.selectedYear ?? new Date().getFullYear(), input.selectedMonth, "流月")
    : undefined;
  const natalList = [pillars.year, pillars.month, pillars.day, pillars.hour];
  const transitList = [selectedYear, selectedMonth].filter(Boolean);
  const hiddenStems = collectHiddenStemSignals(natalList, datasets);
  const elements = calculateElements([...natalList], hiddenStems);
  const elementScores = buildElementScores(elements);
  const energyDelta = calculateElements(transitList);
  const transitElementScores = buildElementScores(energyDelta);
  const natalTenGods = buildTenGodSignals(pillars.day.stem, natalList, datasets, hiddenStems);
  const tenGods = buildTenGodSignals(pillars.day.stem, [...natalList, ...transitList], datasets, hiddenStems);
  const pillarDetails = buildPillarDetails(pillars, hiddenStems, datasets);
  const chartMeta = buildChartMeta(birth, pillars, pillarDetails, datasets);
  const basicBaziDisplay = getBasicBaziDisplay({ input, birth, pillars, datasets, chartMeta });
  const luck = buildLuckPillars(input, birth, pillars);
  const selectedLuck = selectLuckPillar(luck, input.selectedLuckIndex, selectedYear.meta?.year);
  const strengthSignals = buildStrengthSignals(pillars.month.branch, elements, datasets);
  const coreChart = buildCoreChartMeta(input, pillars, elements, natalTenGods, strengthSignals, chartMeta);
  const natalCombinations = findCombinations(natalList, datasets, "原局");
  const transitTriggers = findCombinations([...natalList, ...transitList], datasets, "岁运");
  const fallbackTriggers = buildFallbackTriggers(pillars.day.stem, transitList, tenGods);
  const triggers = transitTriggers.length ? transitTriggers : fallbackTriggers;
  const transitHits = buildTransitHits(pillars, selectedYear, selectedMonth, datasets);
  const matchedRules = matchSystemRules(pillars, selectedYear, selectedMonth, elements, tenGods, datasets);
  const patternCandidates = matchPatternCandidates(pillars, pillarDetails, datasets);
  const starSignals = matchStars(pillars, datasets);
  const pairInteractions = buildPairInteractions(pillars, pillarDetails, datasets);
  const referenceKnowledgeHits = matchReferenceKnowledgeCards({
    pillars,
    elements,
    tenGods,
    matchedRules,
    patternCandidates,
    starSignals,
    combinations: natalCombinations,
    transitHits,
  }, datasets?.referenceKnowledge);
  const learningRuleHits = buildLearningRuleHits({
    pillars,
    elements,
    tenGods,
    matchedRules,
    patternCandidates,
    natalCombinations,
    transitHits,
    referenceKnowledgeHits,
    datasets,
  });
  const overallAnalysis = buildOverallAnalysis(pillars, elements, strengthSignals, patternCandidates, natalCombinations, pairInteractions);
  const datasetCoverage = buildDatasetCoverage(datasets, matchedRules, patternCandidates, starSignals, referenceKnowledgeHits);
  const summary = buildSummary(pillars, elements, tenGods, natalCombinations, triggers);
  const topics = buildTopics(pillars, elements, tenGods, triggers, datasets, matchedRules, transitHits, referenceKnowledgeHits);
  const judgement = buildJudgement({
    pillars,
    elements,
    strengthSignals,
    patternCandidates,
    natalCombinations,
    matchedRules,
    referenceKnowledgeHits,
    triggers,
    transitHits,
    selectedLuck,
    selectedYear,
    selectedMonth,
    topics,
    overallAnalysis,
    datasets,
  });
  const basicInterpretations = matchBaziBasicRules(adaptBaziBasicChart({ natal: {
    pillars,
    dayMaster: pillars.day.stem,
    elements,
    coreChart,
    tenGods: natalTenGods,
    strengthSignals,
  }, transit: { selectedLuck, selectedYear } }), datasets?.systemRules?.basicInterpretationRules ?? []);

  return {
    natal: {
      pillars,
      dayMaster: pillars.day.stem,
      elements,
      elementScores,
      chartMeta,
      basicBaziDisplay,
      coreChart,
      pillarDetails,
      tenGods,
      hiddenStems,
      strengthSignals,
      matchedRules,
      patternCandidates,
      starSignals,
      pairInteractions,
      referenceKnowledgeHits,
      learningRuleHits,
      overallAnalysis,
      basicInterpretations,
      datasetCoverage,
      combinations: natalCombinations,
    },
    transit: {
      selectedLuck,
      selectedYear,
      selectedMonth,
      triggers,
      hits: transitHits,
      energyDelta,
      elementScores: transitElementScores,
    },
    luck,
    judgement,
    summary,
    topics,
  };
}

export function getTransitYears(centerYear = new Date().getFullYear(), range = 5) {
  const years = [];
  for (let year = centerYear - range; year <= centerYear + range; year += 1) {
    years.push({ year, pillar: createPillarFromYear(year, "流年") });
  }
  return years;
}

export function getTransitMonths(year) {
  return Array.from({ length: 12 }, (_, index) => {
    const month = index + 1;
    return { month, pillar: createMonthPillar(year, month, "流月") };
  });
}

function parseBirth(input, datasets = {}) {
  const calendar = normalizeBirthCalendar(input);
  const dateText = calendar.solarDate;
  const timeText = input.time ?? "12:00";
  const [year, month, day] = dateText.split("-").map(Number);
  const [hour, minute] = timeText.split(":").map(Number);
  const rawBirth = { year, month, day, hour, minute: minute || 0, calendar };
  const location = resolveBirthLocation(input.birthplace, datasets);
  return applyTrueSolarTime(rawBirth, location, input.trueSolarTime);
}

function normalizeBirthCalendar(input) {
  const inputCalendarType = input.calendarType === "lunar" ? "lunar" : "solar";
  const solarDate = inputCalendarType === "lunar"
    ? lunarToSolar({
        year: input.lunarYear,
        month: input.lunarMonth,
        day: input.lunarDay,
        isLeapMonth: input.lunarLeapMonth,
      })
    : input.date;
  const lunar = solarToLunar(solarDate);
  return {
    inputCalendarType,
    solarDate,
    lunar,
    lunarDate: formatLunarDate(lunar),
  };
}

function resolveBirthLocation(birthplace, datasets) {
  const defaultLocation = {
    name: "北京",
    longitude: 116.4074,
    latitude: 39.9042,
    timezone: "Asia/Shanghai",
    standardMeridian: 120,
    source: "default",
  };
  const query = String(birthplace ?? "").trim();
  const cities = datasets?.locations?.cities?.length ? datasets.locations.cities : DEFAULT_LOCATIONS;
  if (!query) return defaultLocation;
  const matched = cities.find((city) => {
    const names = [city.name, ...(city.aliases ?? [])].filter(Boolean);
    return names.some((name) => query === name || query.includes(name) || name.includes(query));
  });
  return matched
    ? { ...defaultLocation, ...matched, source: "dataset" }
    : {
        name: query,
        longitude: null,
        latitude: null,
        timezone: defaultLocation.timezone,
        standardMeridian: defaultLocation.standardMeridian,
        source: "unmatched",
      };
}

function applyTrueSolarTime(rawBirth, location, enabled = false) {
  const applied = Boolean(enabled && hasUsableLocation(location));
  const correctionMinutes = applied ? calculateTrueSolarCorrection(rawBirth, location) : 0;
  const utc = Date.UTC(rawBirth.year, rawBirth.month - 1, rawBirth.day, rawBirth.hour, rawBirth.minute) + correctionMinutes * 60000;
  const adjusted = new Date(utc);
  return {
    year: adjusted.getUTCFullYear(),
    month: adjusted.getUTCMonth() + 1,
    day: adjusted.getUTCDate(),
    hour: adjusted.getUTCHours(),
    minute: adjusted.getUTCMinutes(),
    original: { ...rawBirth },
    calendar: rawBirth.calendar,
    trueSolarTime: {
      enabled: Boolean(enabled),
      applied,
      correctionMinutes: Math.round(correctionMinutes),
      longitudeCorrectionMinutes: applied ? Math.round((Number(location.longitude) - Number(location.standardMeridian ?? 120)) * 4) : 0,
      equationOfTimeMinutes: applied ? Math.round(calculateEquationOfTime(rawBirth)) : 0,
      note: enabled && !applied ? "出生地未匹配经纬度，未应用真太阳时校正。" : "",
      location,
    },
  };
}

function hasUsableLocation(location) {
  return location?.longitude !== null &&
    location?.longitude !== undefined &&
    location?.longitude !== "" &&
    Number.isFinite(Number(location.longitude)) &&
    Number.isFinite(Number(location.standardMeridian));
}

function calculateTrueSolarCorrection(birth, location) {
  const longitudeCorrection = (Number(location.longitude) - Number(location.standardMeridian ?? 120)) * 4;
  return longitudeCorrection + calculateEquationOfTime(birth);
}

function calculateEquationOfTime(birth) {
  const dayOfYear = getDayOfYear(birth);
  const b = (2 * Math.PI * (dayOfYear - 81)) / 364;
  return 9.87 * Math.sin(2 * b) - 7.53 * Math.cos(b) - 1.5 * Math.sin(b);
}

function getDayOfYear(birth) {
  const start = Date.UTC(birth.year, 0, 0);
  const current = Date.UTC(birth.year, birth.month - 1, birth.day);
  return Math.floor((current - start) / 86400000);
}

function buildNatalPillars(birth) {
  const year = createPillarFromYear(adjustedSolarYear(birth), "年柱");
  const month = createBirthMonthPillar(birth, year.stem);
  const dayPillarBirth = getDayPillarBirth(birth);
  const day = createDayPillar(dayPillarBirth, "日柱");
  const hour = createHourPillar(birth.hour, day.stem, "时柱");
  return { year, month, day, hour };
}

function adjustedSolarYear(birth) {
  const lichun = getSolarTermBoundary(birth.year, "立春");
  return getLocalBirthMs(birth) < lichun.localMs ? birth.year - 1 : birth.year;
}

function createPillarFromYear(year, role) {
  return createPillarByIndex(year - 1984, role, { year });
}

function createBirthMonthPillar(birth, yearStem, role = "月柱") {
  const monthContext = getSolarMonthContext(birth);
  const branch = monthContext.current.branch;
  const branchOrderFromYin = MONTH_BRANCHES.indexOf(branch);
  const yearStemIndex = STEMS.indexOf(yearStem);
  const stem = STEMS[((yearStemIndex % 5) * 2 + 2 + branchOrderFromYin) % 10];
  return makePillar(stem, branch, role, {
    month: birth.month,
    solarTerm: monthContext.current.name,
    nextSolarTerm: monthContext.next.name,
    solarTermAt: formatLocalDateTime(monthContext.current),
    nextSolarTermAt: formatLocalDateTime(monthContext.next),
    method: "月柱按节气排月，以太阳黄经计算的节气时刻为月令边界。",
  });
}

function createMonthPillar(year, month, role) {
  const yearStem = createPillarFromYear(year, "流年").stem;
  return createBirthMonthPillar({ year, month, day: 15, hour: 12, minute: 0 }, yearStem, role);
}

function createDayPillar(birth, role) {
  const diffDays = gregorianToJdn(birth.year, birth.month, birth.day) -
    gregorianToJdn(DAY_PILLAR_ANCHOR.year, DAY_PILLAR_ANCHOR.month, DAY_PILLAR_ANCHOR.day);
  return createPillarByIndex(diffDays + DAY_PILLAR_ANCHOR.index, role, {
    method: `日柱以${formatBirthDate(DAY_PILLAR_ANCHOR)}${DAY_PILLAR_ANCHOR.label}为锚点，用Gregorian JDN推算。`,
    pillarDate: formatBirthDate(birth),
    lateZiApplied: Boolean(birth.lateZiApplied),
  });
}

function createHourPillar(hour, dayStem, role) {
  const branchIndex = hour === 23 ? 0 : Math.floor((hour + 1) / 2) % 12;
  const dayStemIndex = STEMS.indexOf(dayStem);
  const baseStemIndex = [0, 2, 4, 6, 8][dayStemIndex % 5];
  return makePillar(STEMS[(baseStemIndex + branchIndex) % 10], BRANCHES[branchIndex], role);
}

function createPillarByIndex(index, role, meta = {}) {
  const normalized = ((index % 60) + 60) % 60;
  return makePillar(STEMS[normalized % 10], BRANCHES[normalized % 12], role, meta);
}

function makePillar(stem, branch, role, meta = {}) {
  return {
    stem,
    branch,
    label: `${stem}${branch}`,
    role,
    stemElement: STEM_ELEMENTS[stem],
    branchElement: BRANCH_ELEMENTS[branch],
    yinYang: STEM_YIN_YANG[stem],
    meta,
  };
}

function getDayPillarBirth(birth) {
  if (birth.hour < 23) return { ...birth, lateZiApplied: false };
  const shifted = shiftBirthDate(birth, 1);
  return { ...shifted, hour: birth.hour, minute: birth.minute, lateZiApplied: true };
}

function shiftBirthDate(birth, days) {
  const shifted = new Date(Date.UTC(birth.year, birth.month - 1, birth.day + days, birth.hour ?? 0, birth.minute ?? 0));
  return {
    ...birth,
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth() + 1,
    day: shifted.getUTCDate(),
    hour: shifted.getUTCHours(),
    minute: shifted.getUTCMinutes(),
  };
}

function getSolarMonthContext(birth) {
  const localMs = getLocalBirthMs(birth);
  const boundaries = [birth.year - 1, birth.year, birth.year + 1]
    .flatMap((year) => MONTH_BOUNDARY_TERMS.map((term) => getSolarTermBoundary(year, term.name)))
    .sort((a, b) => a.localMs - b.localMs);
  const currentIndex = Math.max(0, boundaries.findLastIndex((boundary) => localMs >= boundary.localMs));
  return {
    current: boundaries[currentIndex],
    next: boundaries[currentIndex + 1] ?? boundaries[currentIndex],
  };
}

function getSolarTermBoundary(year, name) {
  const term = MONTH_BOUNDARY_TERMS.find((item) => item.name === name);
  if (!term) throw new Error(`Unsupported solar term: ${name}`);
  const cacheKey = `${year}-${name}`;
  if (solarTermCache.has(cacheKey)) return solarTermCache.get(cacheKey);
  const utcMs = findSolarTermUtcMs(year, term);
  const localMs = utcMs + LOCAL_TIMEZONE_OFFSET_MINUTES * 60000;
  const local = new Date(localMs);
  const boundary = {
    ...term,
    year,
    localMs,
    localYear: local.getUTCFullYear(),
    localMonth: local.getUTCMonth() + 1,
    localDay: local.getUTCDate(),
    localHour: local.getUTCHours(),
    localMinute: local.getUTCMinutes(),
  };
  solarTermCache.set(cacheKey, boundary);
  return boundary;
}

function findSolarTermUtcMs(year, term) {
  let low = Date.UTC(year, term.month - 1, term.day, 4) - 5 * 86400000;
  let high = Date.UTC(year, term.month - 1, term.day, 4) + 5 * 86400000;
  while (hasReachedSolarLongitude(low, term.longitude)) low -= 86400000;
  while (!hasReachedSolarLongitude(high, term.longitude)) high += 86400000;
  for (let i = 0; i < 48; i += 1) {
    const mid = (low + high) / 2;
    if (hasReachedSolarLongitude(mid, term.longitude)) high = mid;
    else low = mid;
  }
  return high;
}

function hasReachedSolarLongitude(utcMs, longitude) {
  return normalizeDegrees(apparentSolarLongitude(utcMs) - longitude) < 180;
}

function apparentSolarLongitude(utcMs) {
  const jd = utcMs / 86400000 + 2440587.5;
  const t = (jd - 2451545.0) / 36525;
  const l0 = normalizeDegrees(280.46646 + 36000.76983 * t + 0.0003032 * t * t);
  const m = normalizeDegrees(357.52911 + 35999.05029 * t - 0.0001537 * t * t);
  const c = (1.914602 - 0.004817 * t - 0.000014 * t * t) * sinDeg(m) +
    (0.019993 - 0.000101 * t) * sinDeg(2 * m) +
    0.000289 * sinDeg(3 * m);
  const omega = 125.04 - 1934.136 * t;
  return normalizeDegrees(l0 + c - 0.00569 - 0.00478 * sinDeg(omega));
}

function sinDeg(degrees) {
  return Math.sin(degrees * Math.PI / 180);
}

function normalizeDegrees(degrees) {
  return ((degrees % 360) + 360) % 360;
}

function getLocalBirthMs(birth) {
  return Date.UTC(birth.year, birth.month - 1, birth.day, birth.hour ?? 0, birth.minute ?? 0);
}

function gregorianToJdn(year, month, day) {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

function formatBirthDate(birth) {
  return `${birth.year}-${String(birth.month).padStart(2, "0")}-${String(birth.day).padStart(2, "0")}`;
}

function formatLocalDateTime(boundary) {
  return `${boundary.localYear}-${String(boundary.localMonth).padStart(2, "0")}-${String(boundary.localDay).padStart(2, "0")} ${String(boundary.localHour).padStart(2, "0")}:${String(boundary.localMinute).padStart(2, "0")}`;
}

function calculateElements(pillars, hiddenStems = []) {
  const result = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
  for (const pillar of pillars) {
    if (!pillar) continue;
    result[pillar.stemElement] += 1;
    result[pillar.branchElement] += 1;
  }
  for (const hidden of hiddenStems) {
    result[hidden.element] += Number((hidden.weight / 100).toFixed(2));
  }
  return result;
}

function buildElementScores(elements) {
  return Object.fromEntries(
    Object.entries(elements).map(([key, value]) => [
      key,
      {
        value: roundScore(value),
        display: formatScore(value),
      },
    ]),
  );
}

function roundScore(value) {
  return Math.round((Number(value) + Number.EPSILON) * 10) / 10;
}

function formatScore(value) {
  return new Intl.NumberFormat("zh-CN", { maximumFractionDigits: 1 }).format(roundScore(value));
}

function buildChartMeta(birth, pillars, pillarDetails, datasets) {
  const keys = PILLAR_KEYS;
  const twelveMatrix = datasets?.twelveStages?.matrix ?? TWELVE_STAGE_MATRIX;
  return {
    calendar: {
      solarDate: `${birth.year}-${String(birth.month).padStart(2, "0")}-${String(birth.day).padStart(2, "0")}`,
      time: `${String(birth.hour).padStart(2, "0")}:${String(birth.minute).padStart(2, "0")}`,
      originalSolarDate: birth.original
        ? `${birth.original.year}-${String(birth.original.month).padStart(2, "0")}-${String(birth.original.day).padStart(2, "0")}`
        : `${birth.year}-${String(birth.month).padStart(2, "0")}-${String(birth.day).padStart(2, "0")}`,
      originalTime: birth.original ? `${String(birth.original.hour).padStart(2, "0")}:${String(birth.original.minute).padStart(2, "0")}` : `${String(birth.hour).padStart(2, "0")}:${String(birth.minute).padStart(2, "0")}`,
      lunarDate: birth.calendar?.lunarDate ?? "",
      inputCalendarType: birth.calendar?.inputCalendarType ?? "solar",
      trueSolarTime: birth.trueSolarTime,
      monthNote: pillars.month.meta?.method ?? "",
      solarTermRange: `${pillars.month.meta?.solarTerm ?? "节气"}之后、${pillars.month.meta?.nextSolarTerm ?? "下一节气"}之前`,
      dayPillarDate: pillars.day.meta?.pillarDate ?? "",
      dayPillarRule: "23:00-23:59按次日计算日柱（晚子时换日）",
      hourPillarRule: "按最终排盘时间取时辰，晚子时使用次日日干起时柱。",
    },
    nayin: Object.fromEntries(keys.map((key) => [key, getNayin(pillars[key])])),
    twelveStages: Object.fromEntries(keys.map((key) => [key, twelveMatrix[pillars.day.stem]?.[pillars[key].branch] ?? "待查"])),
    voidBranches: Object.fromEntries(keys.map((key) => [key, getVoidBranches(pillars[key])])),
    fetalOrigin: createFetalOrigin(pillars.month),
    lifePalace: createPalacePillar(pillars.month, pillars.hour, "命宫", false),
    bodyPalace: createPalacePillar(pillars.month, pillars.hour, "身宫", true),
    branches: Object.fromEntries(keys.map((key) => [key, pillarDetails[key].hiddenStems.map((item) => `${item.stem}${item.tenGod}`).join(" / ")])),
  };
}

function buildCoreChartMeta(input, pillars, elements, tenGods, strengthSignals, chartMeta) {
  const gender = input.gender === "female" ? "female" : "male";
  const dayElement = pillars.day.stemElement;
  const dayStrength = strengthSignals.find((signal) => signal.element === dayElement);
  const elementRanking = Object.entries(elements)
    .map(([element, value]) => ({ element, value: roundScore(value) }))
    .sort((a, b) => b.value - a.value);
  const weakest = [...elementRanking].sort((a, b) => a.value - b.value).slice(0, 2);
  const strongest = elementRanking.slice(0, 2);

  return {
    genderLabel: gender === "female" ? "坤造" : "乾造",
    zodiac: ZODIAC_BY_BRANCH[pillars.year.branch] ?? "待查",
    tenGodCounts: countTenGods(tenGods),
    dayMasterStrength: {
      label: `${pillars.day.stem}${ELEMENT_LABELS[dayElement]}：${dayStrength?.seasonalStatus ?? "待查"}`,
      status: "候选",
      basis: dayStrength?.interpretation ?? "暂按月令旺相休囚死和五行分布生成候选。",
    },
    usefulGodCandidates: {
      favorable: weakest.map((item) => ({
        element: item.element,
        label: ELEMENT_LABELS[item.element],
        reason: `${ELEMENT_LABELS[item.element]}当前分数较低，暂列为平衡候选。`,
      })),
      caution: strongest.map((item) => ({
        element: item.element,
        label: ELEMENT_LABELS[item.element],
        reason: `${ELEMENT_LABELS[item.element]}当前分数较高，暂列为过旺观察项。`,
      })),
      status: "候选",
      note: "喜用忌神这里只做结构候选，未替代人工格局、调候、通关细判。",
    },
    calendarPrecision: {
      lunarStatus: chartMeta.calendar.lunarDate ? "已接入" : "待接入",
      solarTermStatus: chartMeta.calendar.monthNote || "节气换月使用太阳黄经近似节气时刻。",
      trueSolarStatus: chartMeta.calendar.trueSolarTime?.enabled ? "已启用" : "未启用",
    },
  };
}

function countTenGods(tenGods) {
  return tenGods.reduce((acc, signal) => {
    const name = signal.name === "日主" ? "比肩" : signal.name;
    if (!name) return acc;
    acc[name] = (acc[name] ?? 0) + 1;
    return acc;
  }, {});
}

function getNayin(pillar) {
  return NAYIN_BY_PAIR[Math.floor(getGanzhiIndex(pillar.stem, pillar.branch) / 2)] ?? "待查";
}

function getVoidBranches(pillar) {
  return VOID_BRANCHES_BY_DECADE[Math.floor(getGanzhiIndex(pillar.stem, pillar.branch) / 10)] ?? [];
}

function getGanzhiIndex(stem, branch) {
  for (let index = 0; index < 60; index += 1) {
    if (STEMS[index % 10] === stem && BRANCHES[index % 12] === branch) return index;
  }
  return 0;
}

function createFetalOrigin(monthPillar) {
  const monthIndex = getGanzhiIndex(monthPillar.stem, monthPillar.branch);
  return createPillarByIndex(monthIndex + 1, "胎元", { method: "月柱后一干三支" });
}

function createPalacePillar(monthPillar, hourPillar, role, isBodyPalace) {
  const monthPosition = MONTH_BRANCHES.indexOf(monthPillar.branch) + 1;
  const hourPosition = BRANCHES.indexOf(hourPillar.branch) + 1;
  const branchIndexFromYin = isBodyPalace
    ? (monthPosition + hourPosition - 2) % 12
    : (14 - monthPosition - hourPosition + 12) % 12;
  const branch = MONTH_BRANCHES[branchIndexFromYin];
  const monthStemIndex = STEMS.indexOf(monthPillar.stem);
  const stem = STEMS[(monthStemIndex + branchIndexFromYin) % 10];
  return makePillar(stem, branch, role, { method: isBodyPalace ? "月时顺推身宫近似法" : "月时逆推命宫近似法" });
}

function buildLuckPillars(input, birth, pillars) {
  const gender = input.gender === "female" ? "female" : "male";
  const yearIsYang = STEM_YIN_YANG[pillars.year.stem] === "yang";
  const direction = (gender === "male" && yearIsYang) || (gender === "female" && !yearIsYang) ? "forward" : "reverse";
  const monthIndex = getGanzhiIndex(pillars.month.stem, pillars.month.branch);
  const startAge = estimateLuckStartAge(birth);
  const pillarsList = Array.from({ length: 10 }, (_, index) => {
    const offset = direction === "forward" ? index + 1 : -(index + 1);
    const luckPillar = createPillarByIndex(monthIndex + offset, "大运");
    const start = startAge + index * 10;
    return {
      index: index + 1,
      label: luckPillar.label,
      stem: luckPillar.stem,
      branch: luckPillar.branch,
      stemElement: luckPillar.stemElement,
      branchElement: luckPillar.branchElement,
      startAge: start,
      endAge: start + 9,
      startYear: birth.year + start,
      endYear: birth.year + start + 9,
    };
  });
  return {
    gender,
    direction,
    directionLabel: direction === "forward" ? "顺行" : "逆行",
    startAge,
    startNote: "起运为近似：当前按出生日期距近似节令折算，尚未按精确节气时刻差折算。",
    pillars: pillarsList,
  };
}

function selectLuckPillar(luck, selectedLuckIndex, selectedYear) {
  const byIndex = Number.isInteger(Number(selectedLuckIndex)) ? luck.pillars[Number(selectedLuckIndex)] : null;
  if (byIndex) return byIndex;
  const byYear = luck.pillars.find((item) => Number(selectedYear) >= item.startYear && Number(selectedYear) <= item.endYear);
  return byYear ?? luck.pillars[0];
}

function estimateLuckStartAge(birth) {
  const currentBoundary = APPROX_SOLAR_MONTH_BOUNDARIES.find((item) => item.month === birth.month);
  const nextBoundary = APPROX_SOLAR_MONTH_BOUNDARIES.find((item) => item.month === birth.month + 1) ?? APPROX_SOLAR_MONTH_BOUNDARIES[0];
  const dayDistance = currentBoundary && birth.day >= currentBoundary.day
    ? (nextBoundary.month === 1 ? 31 : nextBoundary.day + 30) - birth.day
    : Math.abs((currentBoundary?.day ?? 15) - birth.day);
  return Math.max(1, Math.round(dayDistance / 3));
}

function collectHiddenStemSignals(pillars, datasets) {
  const branchData = new Map((datasets?.stemsBranches?.earthlyBranches ?? []).map((item) => [item.branch, item]));
  return pillars.flatMap((pillar) => {
    const hiddenStems = branchData.get(pillar.branch)?.hiddenStems ?? [{ stem: branchMainStem(pillar.branch), element: pillar.branchElement, weight: 100, role: "主气" }];
    return hiddenStems.map((hidden) => ({
      branch: pillar.branch,
      pillar: pillar.role,
      stem: hidden.stem,
      element: hidden.element ?? STEM_ELEMENTS[hidden.stem],
      weight: hidden.weight ?? 100,
      role: hidden.role ?? "主气",
      source: `${pillar.role}${pillar.branch}藏干`,
    }));
  });
}

function buildTenGodSignals(dayStem, pillars, datasets, hiddenStems = []) {
  const matrix = datasets?.tenGods?.tenGodMatrix?.matrix;
  const pillarSignals = pillars
    .filter(Boolean)
    .flatMap((pillar) => [
      makeTenGodSignal(dayStem, pillar.stem, `${pillar.role}天干`, matrix),
      makeTenGodSignal(dayStem, branchMainStem(pillar.branch), `${pillar.role}地支主气`, matrix),
    ])
    .filter(Boolean);
  const hiddenSignals = hiddenStems.map((hidden) => ({
    ...makeTenGodSignal(dayStem, hidden.stem, hidden.source, matrix),
    hiddenRole: hidden.role,
    weight: hidden.weight,
  }));
  return [...pillarSignals, ...hiddenSignals];
}

function makeTenGodSignal(dayStem, targetStem, source, matrix) {
  const name = matrix?.[dayStem]?.[targetStem] ?? deriveTenGod(dayStem, targetStem);
  return {
    name,
    targetStem,
    source,
    element: STEM_ELEMENTS[targetStem],
    polarity: STEM_YIN_YANG[targetStem],
  };
}

function buildPillarDetails(pillars, hiddenStems, datasets) {
  const matrix = datasets?.tenGods?.tenGodMatrix?.matrix;
  return Object.fromEntries(
    PILLAR_KEYS.map((key) => {
      const pillar = pillars[key];
      const hidden = hiddenStems.filter((item) => item.pillar === pillar.role);
      return [
        key,
        {
          key,
          label: PILLAR_LABELS[key],
          pillar,
          stemTenGod: key === "day" ? "日主" : makeTenGodSignal(pillars.day.stem, pillar.stem, `${pillar.role}天干`, matrix).name,
          branchMainTenGod: makeTenGodSignal(pillars.day.stem, branchMainStem(pillar.branch), `${pillar.role}地支主气`, matrix).name,
          hiddenStems: hidden.map((item) => ({
            ...item,
            tenGod: makeTenGodSignal(pillars.day.stem, item.stem, item.source, matrix).name,
          })),
        },
      ];
    }),
  );
}

function deriveTenGod(dayStem, targetStem) {
  const dayElement = STEM_ELEMENTS[dayStem];
  const targetElement = STEM_ELEMENTS[targetStem];
  const samePolarity = STEM_YIN_YANG[dayStem] === STEM_YIN_YANG[targetStem];
  if (targetElement === dayElement) return samePolarity ? "比肩" : "劫财";
  if (generates(dayElement) === targetElement) return samePolarity ? "食神" : "伤官";
  if (controls(dayElement) === targetElement) return samePolarity ? "偏财" : "正财";
  if (controls(targetElement) === dayElement) return samePolarity ? "七杀" : "正官";
  return samePolarity ? "偏印" : "正印";
}

function generates(element) {
  return { wood: "fire", fire: "earth", earth: "metal", metal: "water", water: "wood" }[element];
}

function controls(element) {
  return { wood: "earth", fire: "metal", earth: "water", metal: "wood", water: "fire" }[element];
}

function branchMainStem(branch) {
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

function findCombinations(pillars, datasets, scope) {
  const rules = mergeComboRules(datasets);
  const signals = [];
  for (let leftIndex = 0; leftIndex < pillars.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < pillars.length; rightIndex += 1) {
      const left = pillars[leftIndex];
      const right = pillars[rightIndex];
      if (!left || !right) continue;
      for (const rule of rules) {
        if (samePair(rule.members, [left.stem, right.stem]) || samePair(rule.members, [left.branch, right.branch])) {
          signals.push({
            id: `${scope}-${left.role}-${right.role}-${rule.title}-${rule.effect}`,
            title: `${left.role}${left.label} 与 ${right.role}${right.label}：${rule.title}`,
            effect: rule.effect,
            description: rule.note,
            evidenceLevel: rule.evidenceLevel,
            status: rule.status,
            members: rule.members,
            sources: [left.role, right.role],
          });
        }
      }
    }
  }
  return uniqueSignals(signals).slice(0, 12);
}

function mergeComboRules(datasets) {
  const fromData = [];
  const combos = datasets?.combinations;
  const groups = [
    ["heavenlyStemCombinations", "天干五合", "stems"],
    ["branchSixCombinations", "地支六合", "branches"],
    ["branchThreeCombinations", "地支三合", "branches"],
    ["branchThreeMeetings", "地支三会", "branches"],
    ["branchSixClashes", "地支六冲", "branches"],
    ["branchThreePunishments", "地支三刑", "branches"],
    ["branchSixHarms", "地支六害", "branches"],
    ["branchSixBreaks", "地支六破", "branches"],
  ];
  for (const [key, title, memberKey] of groups) {
    for (const item of combos?.[key]?.rules ?? []) {
      fromData.push({
        title,
        members: item[memberKey] ?? item.pair ?? [],
        effect: item.element ? `${item.element}局` : title.replace("地支", "").replace("天干", ""),
        note: item.note ?? combos[key].interpretation ?? "来自数据规则库的组合提示。",
        evidenceLevel: item.evidenceLevel ?? combos[key].evidenceLevel ?? "secondary_source",
        status: item.status ?? combos[key].status ?? "active",
      });
    }
  }
  if (fromData.length) return fromData;
  return COMBO_RULES.map(([title, members, effect, note]) => ({
      title,
      members,
      effect,
      note,
      evidenceLevel: "traditional_consensus",
      status: "active",
    }));
}

function samePair(ruleMembers, pair) {
  return ruleMembers.length === pair.length && ruleMembers.every((member) => pair.includes(member));
}

function uniqueSignals(signals) {
  const seen = new Set();
  return signals.filter((signal) => {
    const key = `${signal.title}-${signal.effect}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function buildFallbackTriggers(dayStem, transitList, tenGods) {
  return transitList.map((pillar) => {
    const tenGod = makeTenGodSignal(dayStem, pillar.stem, pillar.role);
    return {
      id: `ten-god-${pillar.role}-${pillar.label}`,
      title: `${pillar.role}${pillar.label} 触发 ${tenGod.name}`,
      effect: tenGod.name,
      description: `没有形成明显合冲刑害破时，先看${pillar.stem}对日主的十神作用：${tenGod.name}主题被带到台前。`,
      evidenceLevel: "derived",
      status: "active",
      members: [pillar.stem, pillar.branch],
      sources: [pillar.role],
    };
  });
}

function buildSummary(pillars, elements, tenGods, natalCombinations, triggers) {
  const strongest = strongestElements(elements);
  const godCounts = countBy(tenGods.map((item) => item.name));
  const mainGod = Object.entries(godCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "十神";
  return [
    `日主为${pillars.day.stem}${ELEMENT_LABELS[pillars.day.stemElement]}，先看月令${pillars.month.branch}与全局五行分布。`,
    `原局五行以${strongest.map((item) => ELEMENT_LABELS[item]).join("、")}较突出，当前按透干、地支与藏干权重估算，后续可接入回测模型。`,
    `十神信号中${mainGod}出现较多，说明相关的人事、能力或压力会更容易被看见。`,
    natalCombinations.length
      ? `原局可见${natalCombinations[0].title}，读盘时要把组合关系放在单柱含义之前。`
      : "原局未检出强组合，先以日主、五行和十神结构为主线。",
    triggers.length
      ? `当前选择的岁运触发：${triggers[0].title}。`
      : "当前岁运没有明显触发，宜看五行增减和十神主题的细微变化。",
  ];
}

function buildOverallAnalysis(pillars, elements, strengthSignals, patternCandidates, combinations, pairInteractions) {
  const strongest = strongestElements(elements).map((item) => ELEMENT_LABELS[item]).join("、");
  const dayStrength = strengthSignals.find((item) => item.element === pillars.day.stemElement);
  const patternText = patternCandidates.length
    ? `格局候选先看${patternCandidates.map((item) => item.name).join("、")}，但当前仍按候选处理，需要结合月令透藏和清浊成败继续细判。`
    : "暂未形成明确格局候选，先按日主、月令、十神分布和字与字关系读盘。";
  const relationText = pairInteractions
    .filter((item) => item.directRelations.length)
    .slice(0, 3)
    .map((item) => item.title)
    .join("；");
  return [
    `此盘日主为${pillars.day.stem}${ELEMENT_LABELS[pillars.day.stemElement]}，生于${pillars.month.branch}月，月令对日主为“${dayStrength?.seasonalStatus ?? "待判"}”。`,
    `五行分布以${strongest}较显，读整体时先看这些五行是否过旺、是否有通关泄秀或制化。`,
    patternText,
    relationText ? `字与字关系中，优先关注：${relationText}。这些关系会先改变对应柱位的人事和能量流向。` : "原局柱间未命中强合冲刑害破，先看天干十神和五行生克的配合。",
    combinations.length ? `原局组合里可见${combinations.length}条直接关系，合主牵绊成局，冲主变动，刑害破主摩擦暗耗。` : "原局暂无直接组合命中，后续岁运进入时仍可能触发。",
  ];
}

function buildPairInteractions(pillars, pillarDetails, datasets) {
  const comboRules = mergeComboRules(datasets);
  const keys = PILLAR_KEYS;
  const interactions = [];
  for (let i = 0; i < keys.length; i += 1) {
    for (let j = i + 1; j < keys.length; j += 1) {
      const leftKey = keys[i];
      const rightKey = keys[j];
      const left = pillarDetails[leftKey];
      const right = pillarDetails[rightKey];
      const stemDirect = comboRules.filter((rule) => samePair(rule.members, [left.pillar.stem, right.pillar.stem]));
      const branchDirect = comboRules.filter((rule) => samePair(rule.members, [left.pillar.branch, right.pillar.branch]));
      const stemRelationData = stemDirect[0]
        ? relationFromRules(left.pillar.stem, right.pillar.stem, stemDirect)
        : describeElementRelation(left.pillar.stemElement, right.pillar.stemElement, left.pillar.stem, right.pillar.stem, datasets);
      const branchRelationData = branchDirect[0]
        ? relationFromRules(left.pillar.branch, right.pillar.branch, branchDirect)
        : describeElementRelation(left.pillar.branchElement, right.pillar.branchElement, left.pillar.branch, right.pillar.branch, datasets);
      const directRelations = [...stemDirect, ...branchDirect].map((rule) => ({
        title: rule.title,
        effect: rule.effect,
        note: rule.note,
        status: rule.status,
        evidenceLevel: rule.evidenceLevel,
      }));
      interactions.push({
        leftKey,
        rightKey,
        title: `${left.label}${left.pillar.label} ↔ ${right.label}${right.pillar.label}`,
        stemRelation: stemRelationData.text,
        stemRelationSource: stemRelationData.source,
        branchRelation: branchRelationData.text,
        branchRelationSource: branchRelationData.source,
        tenGodRelation: `${left.label}(${left.stemTenGod}/${left.branchMainTenGod}) 与 ${right.label}(${right.stemTenGod}/${right.branchMainTenGod})`,
        directRelations,
        impact: buildPairImpact(left, right, directRelations),
      });
    }
  }
  return interactions;
}

function relationFromRules(leftChar, rightChar, rules) {
  return {
    text: `${leftChar}${rightChar}：${rules.map((rule) => rule.title).join("、")}`,
    source: {
      type: "database",
      label: "数据库关系",
      sourceIds: [...new Set(rules.flatMap((rule) => rule.sourceIds ?? []))],
      evidenceLevel: rules[0]?.evidenceLevel,
      status: rules[0]?.status,
    },
  };
}

function describeElementRelation(leftElement, rightElement, leftChar, rightChar, datasets) {
  const relationMeta = datasets?.fiveElements?.relations;
  const source = {
    type: relationMeta ? "database_derived" : "built_in_derived",
    label: relationMeta ? "五行生克派生" : "内置五行派生",
    sourceIds: relationMeta?.sourceIds ?? [],
    evidenceLevel: relationMeta?.evidenceLevel ?? "derived",
    status: relationMeta?.status ?? "draft",
  };
  if (leftElement === rightElement) return { text: `${leftChar}${rightChar}：同五行，比和、同气、互相加强`, source };
  if ((relationMeta?.generation?.[leftElement] ?? generates(leftElement)) === rightElement) {
    return { text: `${leftChar}生${rightChar}：前者泄出成就后者`, source };
  }
  if ((relationMeta?.generation?.[rightElement] ?? generates(rightElement)) === leftElement) {
    return { text: `${rightChar}生${leftChar}：后者来生扶前者`, source };
  }
  if ((relationMeta?.restriction?.[leftElement] ?? controls(leftElement)) === rightElement) {
    return { text: `${leftChar}克${rightChar}：前者制约后者`, source };
  }
  if ((relationMeta?.restriction?.[rightElement] ?? controls(rightElement)) === leftElement) {
    return { text: `${rightChar}克${leftChar}：后者制约前者`, source };
  }
  return { text: `${leftChar}${rightChar}：未见直接生克`, source };
}

function buildPairImpact(left, right, directRelations) {
  const base = `${left.label}主早年、外缘或该柱位主题，${right.label}主对应柱位主题；两柱互动会把“${left.stemTenGod}、${left.branchMainTenGod}”与“${right.stemTenGod}、${right.branchMainTenGod}”放在一起看。`;
  if (!directRelations.length) return `${base} 未命中直接合冲刑害破时，以五行生克和十神配合判断能量流向。`;
  const notes = directRelations.map((rule) => rule.note).filter(Boolean).join("；");
  return `${base} 命中${directRelations.map((rule) => rule.title).join("、")}，${notes || "相关能量会被牵动，需要结合强弱取舍。"}`;
}

function buildTopics(pillars, elements, tenGods, triggers, datasets, matchedRules = [], transitHits = [], referenceKnowledgeHits = []) {
  const definitions = datasets?.tenGods?.tenGodDefinitions ?? [];
  return TOPICS.map((topic) => {
    const domain = mapTopicToDomain(topic.id);
    const relatedGods = tenGods.filter((signal) => topic.gods.includes(signal.name));
    const domainRules = matchedRules.filter((rule) => rule.domains.includes(domain));
    const domainHits = transitHits.filter((hit) => hit.domains.includes(domain));
    const domainReferences = referenceKnowledgeHits.filter((hit) => hit.domains.includes(domain));
    const datasetGod = tenGods.find((signal) =>
      definitions.some((definition) => definition.name === signal.name && definition.domain_meaning?.[domain]),
    );
    const topGod = datasetGod?.name ?? relatedGods[0]?.name ?? topic.gods[0];
    const definition = definitions.find((item) => item.name === topGod);
    const domainText = definition?.domain_meaning?.[domain];
    const trigger = triggers.find((item) => topic.gods.some((god) => item.effect.includes(god))) ?? triggers[0];
    const elementHint = topicElementHint(topic.id, elements);
    return {
      id: topic.id,
      label: topic.label,
      paragraphs: [
        domainText ?? `${topic.label}先看${topGod}及其所在位置，再结合日主强弱、宫位和岁运触发判断。`,
        domainRules[0]?.interpretation ?? elementHint,
        domainHits[0]
          ? `当前岁运命中${domainHits[0].transit}触发${domainHits[0].target}，关系为${domainHits[0].relation}，会把这个主题推到前面。`
          : `${elementHint} 当前流年流月没有直接命中该主题的强触发，先按原局结构判断。`,
      ],
      signals: [
        `${topGod}：${relatedGods.length ? `${relatedGods.length}处` : "候选观察"}`,
        trigger ? `${trigger.status === "active" ? "已验证" : "候选"}：${trigger.title}` : "暂无明显组合触发",
      ],
      evidence: [
        ...relatedGods.slice(0, 4).map((signal) => `${signal.source} ${signal.targetStem} 为 ${signal.name}`),
        ...domainReferences.slice(0, 3).map((hit) => `${hit.displayTitle}：${hit.interpretation}`),
        ...domainRules.slice(0, 4).map((rule) => `${rule.title}：${rule.interpretation}`),
        ...domainHits.slice(0, 3).map((hit) => `${hit.transit} → ${hit.target}：${hit.relation}`),
      ].slice(0, 8),
    };
  });
}

function buildJudgement({
  pillars,
  elements,
  strengthSignals,
  patternCandidates,
  natalCombinations,
  matchedRules,
  referenceKnowledgeHits,
  triggers,
  transitHits,
  selectedLuck,
  selectedYear,
  selectedMonth,
  topics,
  overallAnalysis,
  datasets,
}) {
  const priorityPolicy = datasets?.outputTemplates?.priorityPolicy;
  const evidence = sortEvidence(uniqueEvidence([
    ...buildStrengthEvidence(strengthSignals),
    ...buildPatternEvidence(patternCandidates),
    ...buildCombinationEvidence(natalCombinations),
    ...buildRuleEvidence(matchedRules),
    ...buildReferenceEvidence(referenceKnowledgeHits),
    ...buildTriggerEvidence(triggers),
    ...buildTransitHitEvidence(transitHits),
    buildLuckEvidence(selectedLuck, pillars.day.stem),
    buildFlowEvidence(selectedYear, "annual", pillars.day.stem),
    selectedMonth ? buildFlowEvidence(selectedMonth, "monthly", pillars.day.stem) : null,
  ].filter(Boolean), priorityPolicy));
  const transit = buildJudgementTransit({ selectedLuck, selectedYear, selectedMonth, evidence });
  const domains = buildJudgementDomains({ evidence, topics });
  const overview = buildJudgementOverview({ overallAnalysis, evidence, transit });
  const caseSignals = buildCaseSignals({
    cases: datasets?.caseStudies?.cases ?? [],
    evidence,
    selectedYear: selectedYear?.meta?.year,
  });

  return {
    evidence,
    overview,
    transit,
    domains,
    caseSignals,
  };
}

function buildStrengthEvidence(strengthSignals = []) {
  return strengthSignals.map((signal) => normalizeEvidence({
    id: `strength-${signal.element}`,
    layer: "natal",
    category: "strength",
    title: `${signal.label}气在月令为${signal.seasonalStatus}`,
    interpretation: signal.interpretation,
    domains: allDomainIds(),
    sourceIds: signal.sourceIds,
    evidenceLevel: signal.evidenceLevel,
    status: signal.status,
    tags: [signal.label, signal.seasonalStatus, signal.element, "月令", "强弱"],
  }));
}

function buildPatternEvidence(patternCandidates = []) {
  return patternCandidates.map((pattern) => normalizeEvidence({
    id: `pattern-${pattern.id ?? pattern.name}`,
    layer: "natal",
    category: "pattern",
    title: pattern.name,
    interpretation: pattern.summary ?? pattern.basis ?? "格局候选需结合月令、透干和清浊继续细判。",
    domains: allDomainIds(),
    sourceIds: pattern.sourceIds,
    evidenceLevel: pattern.evidenceLevel,
    status: pattern.status,
    tags: [pattern.name, pattern.tenGod, "格局"],
  }));
}

function buildCombinationEvidence(combinations = []) {
  return combinations.map((combo) => normalizeEvidence({
    id: combo.id,
    layer: "natal",
    category: "relation",
    title: combo.title,
    interpretation: combo.description,
    domains: inferDomainsFromText(`${combo.title} ${combo.effect} ${combo.description}`),
    sourceIds: combo.sourceIds,
    evidenceLevel: combo.evidenceLevel,
    status: combo.status,
    tags: [combo.effect, ...(combo.members ?? []), ...extractRelationTags(`${combo.title} ${combo.effect}`)],
  }));
}

function buildRuleEvidence(matchedRules = []) {
  return matchedRules.map((rule) => normalizeEvidence({
    id: rule.id,
    layer: rule.category?.startsWith("transit_") ? "annual" : "natal",
    category: rule.category,
    title: rule.title,
    interpretation: rule.interpretation,
    domains: rule.domains,
    sourceIds: rule.sourceIds,
    evidenceLevel: rule.evidenceLevel,
    status: rule.status,
    tags: [
      rule.title,
      rule.category,
      rule.match?.tenGod,
      rule.match?.relation,
      rule.match?.branch,
      rule.match?.branchA && rule.match?.branchB ? `${rule.match.branchA}${rule.match.branchB}` : "",
      ...(rule.match?.branches ?? []),
      ...extractRelationTags(`${rule.title} ${rule.interpretation ?? ""}`),
    ],
  }));
}

function buildReferenceEvidence(referenceKnowledgeHits = []) {
  return referenceKnowledgeHits.map((hit) => normalizeEvidence({
    id: `reference-${hit.id}`,
    layer: "natal",
    category: hit.category ?? "reference",
    title: hit.displayTitle ?? hit.title,
    interpretation: hit.interpretation || hit.summary,
    domains: hit.domains,
    sourceIds: (hit.sourceRefs ?? []).map((ref) => ref.sourceId).filter(Boolean),
    evidenceLevel: hit.confidence === "high" ? "secondary_source" : "derived",
    status: hit.status ?? "auto_enabled",
    tags: [hit.title, hit.displayTitle, ...(hit.tags ?? []), ...(hit.matchReasons ?? [])],
  }));
}

function buildTriggerEvidence(triggers = []) {
  return triggers.map((trigger) => {
    const layer = trigger.sources?.includes("流月") || trigger.title?.includes("流月") ? "monthly" : "annual";
    return normalizeEvidence({
      id: `trigger-${trigger.id}`,
      layer,
      category: "trigger",
      title: trigger.title,
      interpretation: trigger.description,
      domains: inferDomainsFromText(`${trigger.title} ${trigger.effect} ${trigger.description}`),
      sourceIds: trigger.sourceIds,
      evidenceLevel: trigger.evidenceLevel,
      status: trigger.status,
      tags: [trigger.effect, ...(trigger.members ?? []), ...extractRelationTags(`${trigger.title} ${trigger.effect}`)],
    });
  });
}

function buildTransitHitEvidence(transitHits = []) {
  return transitHits.map((hit, index) => normalizeEvidence({
    id: `transit-hit-${index}-${hit.transit}-${hit.target}-${hit.relation}`,
    layer: hit.transit?.includes("流月") ? "monthly" : "annual",
    category: "transit_hit",
    title: `${hit.transit} 触发 ${hit.target}`,
    interpretation: `${hit.relation}：${hit.interpretation}`,
    domains: hit.domains,
    sourceIds: hit.sourceIds,
    evidenceLevel: hit.evidenceLevel,
    status: hit.status,
    tags: [hit.relation, hit.title, hit.transit, hit.target, ...extractRelationTags(`${hit.title} ${hit.relation} ${hit.interpretation}`)],
  }));
}

function buildLuckEvidence(selectedLuck, dayStem) {
  if (!selectedLuck) return null;
  const stemGod = makeTenGodSignal(dayStem, selectedLuck.stem, "大运天干");
  const branchGod = makeTenGodSignal(dayStem, branchMainStem(selectedLuck.branch), "大运地支主气");
  const domains = [...new Set([...domainsForGod(stemGod.name), ...domainsForGod(branchGod.name)])];
  return normalizeEvidence({
    id: `major-luck-${selectedLuck.index}-${selectedLuck.label}`,
    layer: "major_luck",
    category: "major_luck",
    title: `大运${selectedLuck.label}（${selectedLuck.startAge}-${selectedLuck.endAge}岁）`,
    interpretation: `大运作为十年环境，天干${selectedLuck.stem}为${stemGod.name}，地支${selectedLuck.branch}主气为${branchGod.name}，先看它如何长期增减原局主题。`,
    domains,
    sourceIds: [],
    evidenceLevel: "derived",
    status: "active",
    tags: [selectedLuck.label, selectedLuck.stem, selectedLuck.branch, stemGod.name, branchGod.name, "大运", "十年环境"],
  });
}

function buildFlowEvidence(pillar, layer, dayStem) {
  if (!pillar) return null;
  const stemGod = makeTenGodSignal(dayStem, pillar.stem, `${pillar.role}天干`);
  const branchGod = makeTenGodSignal(dayStem, branchMainStem(pillar.branch), `${pillar.role}地支主气`);
  const layerLabel = layer === "annual" ? "流年" : "流月";
  return normalizeEvidence({
    id: `${layer}-${pillar.label}`,
    layer,
    category: "flow_pillar",
    title: `${layerLabel}${pillar.label}引动${stemGod.name}/${branchGod.name}`,
    interpretation: `${layerLabel}不单独定吉凶，先看${pillar.stem}对日主为${stemGod.name}、${pillar.branch}主气为${branchGod.name}，再与原局和大运证据合看。`,
    domains: [...new Set([...domainsForGod(stemGod.name), ...domainsForGod(branchGod.name)])],
    sourceIds: [],
    evidenceLevel: "derived",
    status: "active",
    tags: [pillar.label, pillar.stem, pillar.branch, stemGod.name, branchGod.name, layerLabel],
  });
}

function normalizeEvidence(evidence) {
  const evidenceLevel = evidence.evidenceLevel ?? "derived";
  const status = evidence.status ?? "draft";
  return {
    id: String(evidence.id ?? `${evidence.layer}-${evidence.category}-${evidence.title}`),
    layer: evidence.layer ?? "natal",
    category: evidence.category ?? "derived",
    title: String(evidence.title ?? "未命名证据"),
    interpretation: String(evidence.interpretation ?? ""),
    domains: normalizeDomains(evidence.domains),
    sourceIds: normalizeList(evidence.sourceIds),
    evidenceLevel,
    status,
    priority: evidence.priority ?? evidencePriority({ evidenceLevel, status }),
    tags: uniqueText([...(evidence.tags ?? []), evidence.title, evidence.category]),
  };
}

function uniqueEvidence(items, priorityPolicy) {
  const seen = new Set();
  return items.map((item) => ({ ...item, priority: evidencePriority(item, priorityPolicy) })).filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

function sortEvidence(items) {
  return [...items].sort((left, right) => left.priority - right.priority || String(left.title).localeCompare(String(right.title), "zh-Hans-CN"));
}

function evidencePriority(item, priorityPolicy) {
  const status = item.status ?? "draft";
  const evidenceLevel = item.evidenceLevel ?? "derived";
  const token = `${status} ${evidenceLevel}`;
  const order = priorityPolicy?.order ?? [
    "active traditional_consensus",
    "active secondary_source",
    "derived",
    "draft",
    "needs_review",
  ];
  const index = order.findIndex((entry) => token.includes(entry) || entry.includes(evidenceLevel) || entry.includes(status));
  return index >= 0 ? (index + 1) * 10 : 90;
}

function buildJudgementTransit({ selectedLuck, selectedYear, selectedMonth, evidence }) {
  const luckEvidence = evidence.filter((item) => item.layer === "major_luck");
  const annualEvidence = evidence.filter((item) => item.layer === "annual");
  const monthlyEvidence = evidence.filter((item) => item.layer === "monthly");
  return {
    majorLuck: {
      pillar: selectedLuck,
      summary: selectedLuck
        ? `大运${selectedLuck.label}作为${selectedLuck.startAge}-${selectedLuck.endAge}岁的十年环境，先看长期增减，不直接等同单年事件。`
        : "当前未选中大运，岁运判断先按流年流月触发看。",
      evidence: luckEvidence.slice(0, 6),
    },
    annual: {
      pillar: selectedYear,
      summary: selectedYear
        ? `流年${selectedYear.label}负责把事件主题推到前台，当前命中${annualEvidence.length}条年度触发证据。`
        : "当前未选中流年。",
      evidence: annualEvidence.slice(0, 8),
    },
    monthly: {
      pillar: selectedMonth,
      summary: selectedMonth
        ? `流月${selectedMonth.label}用于细化时间窗口，当前命中${monthlyEvidence.length}条月度触发证据。`
        : "当前未选中流月。",
      evidence: monthlyEvidence.slice(0, 8),
    },
  };
}

function buildJudgementOverview({ overallAnalysis, evidence, transit }) {
  const coreEvidence = evidence.slice(0, 6);
  const candidates = evidence.filter((item) => item.status !== "active").slice(0, 6);
  const conclusions = [
    ...(overallAnalysis ?? []).slice(0, 3),
    transit.annual?.summary,
  ].filter(Boolean);
  return {
    conclusions,
    coreEvidence,
    candidates,
    cautions: candidates.length
      ? ["候选、draft 或自动资料卡只作为提示，需要结合真实案例和人工复核后再升为强结论。"]
      : ["当前结论仍以结构化证据为边界，不把单一规则直接当作最终吉凶。"],
  };
}

function buildJudgementDomains({ evidence, topics }) {
  return TOPICS.map((topic) => {
    const mappedDomain = mapTopicToDomain(topic.id);
    const legacy = topics.find((item) => item.id === topic.id);
    const domainEvidence = evidence.filter((item) => item.domains.includes(topic.id) || item.domains.includes(mappedDomain)).slice(0, 8);
    const primary = domainEvidence[0];
    const basis = domainEvidence.slice(0, 3).map((item) => `${item.title}：${item.interpretation}`).join("；");
    return {
      id: topic.id,
      label: topic.label,
      sections: {
        主题判断: legacy?.paragraphs?.[0] ?? `${topic.label}先看${topic.gods.join("、")}与对应宫位，再合并原局和岁运证据。`,
        触发依据: basis || `当前${topic.label}主题未见强触发，先按原局结构观察。`,
        强弱取舍: legacy?.paragraphs?.[1] ?? (primary ? `${primary.title}提示该主题需要按${primary.evidenceLevel}证据等级处理。` : "强弱取舍暂按日主、月令和五行平衡候选处理。"),
        提醒建议: legacy?.paragraphs?.[2] ?? buildDomainAdvice(topic, primary),
      },
      evidence: domainEvidence,
      signals: [
        `${topic.label}证据 ${domainEvidence.length} 条`,
        ...(legacy?.signals ?? []).slice(0, 2),
      ],
    };
  });
}

function buildDomainAdvice(topic, primary) {
  if (!primary) return `${topic.label}暂无强证据时，不做固定断语，等待岁运或案例证据补强。`;
  if (primary.status !== "active") return `${topic.label}当前以候选证据为主，适合提示方向，不宜直接定论。`;
  return `${topic.label}已有可用证据，先看触发到哪个柱位、十神和现实场景。`;
}

function buildCaseSignals({ cases, evidence, selectedYear }) {
  const readingTags = collectJudgementTags(evidence);
  return (cases ?? [])
    .map((caseItem) => {
      const caseTags = normalizeList(caseItem.tags);
      const matchedTags = caseTags.filter((tag) => readingTags.some((readingTag) => includesEither(readingTag, tag)));
      const matchedEvents = (caseItem.events ?? []).filter((event) => Number(event.year) === Number(selectedYear));
      const matchedEvidence = evidence.filter((item) =>
        matchedTags.some((tag) => includesEither(`${item.title} ${item.interpretation} ${item.tags.join(" ")}`, tag)),
      ).slice(0, 4);
      const score = matchedTags.length * 2 + matchedEvents.length * 3 + matchedEvidence.length;
      const reasons = [
        matchedTags.length ? `命中标签：${matchedTags.join("、")}` : "",
        ...matchedEvents.map((event) => `命中 ${event.year} 年事件：${event.event}`),
        matchedEvidence.length ? `命中证据：${matchedEvidence.map((item) => item.title).join("、")}` : "",
      ].filter(Boolean);
      return {
        ...caseItem,
        score,
        matchedTags,
        matchedEvents,
        matchedEvidence: matchedEvidence.length ? matchedEvidence : evidence.slice(0, matchedTags.length ? 2 : 0),
        reasons,
      };
    })
    .filter((caseItem) => caseItem.score > 0)
    .sort((left, right) => right.score - left.score || String(left.id).localeCompare(String(right.id)))
    .slice(0, 4);
}

function collectJudgementTags(evidence) {
  return uniqueText(evidence.flatMap((item) => [
    item.title,
    item.interpretation,
    item.category,
    item.layer,
    ...(item.tags ?? []),
    ...extractRelationTags(`${item.title} ${item.interpretation}`),
  ]));
}

function domainsForGod(godName) {
  const domains = TOPICS.filter((topic) => topic.gods.includes(godName)).map((topic) => topic.id);
  return domains.length ? domains : allDomainIds();
}

function inferDomainsFromText(text) {
  const source = String(text ?? "");
  const domains = [];
  const checks = [
    ["career", ["事业", "官", "杀", "工作", "迁移", "岗位"]],
    ["money", ["财", "资源", "投资", "收入"]],
    ["marriage", ["夫妻", "婚", "关系", "配偶", "桃花"]],
    ["health", ["健康", "病", "身体", "节律"]],
    ["children", ["子女", "食神", "伤官", "输出"]],
    ["personality", ["性格", "印", "比肩", "劫财", "表达"]],
  ];
  for (const [domain, keywords] of checks) {
    if (keywords.some((keyword) => source.includes(keyword))) domains.push(domain);
  }
  return domains.length ? domains : allDomainIds();
}

function normalizeDomains(domains) {
  const normalized = normalizeList(domains);
  return normalized.length ? [...new Set(normalized)] : allDomainIds();
}

function allDomainIds() {
  return [...new Set(TOPICS.map((topic) => topic.id))];
}

function normalizeList(value) {
  if (!value) return [];
  return (Array.isArray(value) ? value : [value]).map((item) => String(item ?? "").trim()).filter(Boolean);
}

function uniqueText(values) {
  return [...new Set(normalizeList(values))];
}

function includesEither(left, right) {
  const a = String(left ?? "");
  const b = String(right ?? "");
  return Boolean(a && b && (a.includes(b) || b.includes(a)));
}

function extractRelationTags(text) {
  const source = String(text ?? "");
  const tags = [];
  for (const tag of ["伏吟", "反吟", "申寅冲", "寅申冲", "子午冲", "午子冲", "卯酉冲", "辰戌冲", "巳亥冲", "丑未冲", "六合", "六冲", "三合", "三会", "刑", "害", "破"]) {
    if (source.includes(tag)) tags.push(tag);
  }
  return tags;
}

function buildLearningRuleHits(context) {
  const rules = collectLearningRules(context.datasets);
  const hits = rules
    .filter((rule) => learningConditionsMatch(rule.conditions, context))
    .map((rule) => normalizeLearningRuleHit(rule, context))
    .sort((left, right) => learningConfidenceRank(right.confidence) - learningConfidenceRank(left.confidence) || left.title.localeCompare(right.title, "zh-Hans-CN"));
  return hits.slice(0, 8);
}

function collectLearningRules(datasets = {}) {
  return [
    ...(datasets.learningKnowledge?.rules ?? []),
    ...(datasets.blindCases?.rules ?? []),
    ...(datasets.strengthModel?.rules ?? []),
    ...(datasets.patternsUsefulGods?.rules ?? []),
    ...(datasets.blindCoreMethods?.rules ?? []),
    ...(datasets.outputTemplates?.rules ?? []),
    ...(datasets.caseStudies?.rules ?? []),
    ...(datasets.aiPrompts?.rules ?? []),
    ...(datasets.referenceKnowledge?.rules ?? []),
  ].filter((rule) => rule && rule.status !== "archived");
}

function learningConditionsMatch(conditions = {}, context) {
  if (conditions.always) return true;
  const { pillars, elements, tenGods, natalCombinations, matchedRules, patternCandidates, referenceKnowledgeHits } = context;
  if (conditions.dayStem && conditions.dayStem !== pillars.day.stem) return false;
  if (conditions.monthBranch && conditions.monthBranch !== pillars.month.branch) return false;
  if (conditions.yearBranch && conditions.yearBranch !== pillars.year.branch) return false;
  if (conditions.hourBranch && conditions.hourBranch !== pillars.hour.branch) return false;
  if (conditions.relationType) {
    const relationHit = conditions.relationType === "any"
      ? natalCombinations.length > 0
      : natalCombinations.some((combo) => combo.type === conditions.relationType || combo.effect === conditions.relationType || combo.title?.includes(conditions.relationType));
    if (!relationHit) return false;
  }
  if (conditions.hasPatternCandidate && !patternCandidates.length) return false;
  if (conditions.referenceCategory && !referenceKnowledgeHits.some((hit) => hit.category === conditions.referenceCategory)) return false;
  if (conditions.matchedRuleCategory && !matchedRules.some((rule) => rule.category === conditions.matchedRuleCategory)) return false;
  if (conditions.tenGod && !tenGods.some((signal) => signal.name === conditions.tenGod)) return false;
  if (conditions.elementCount && !countConditionMatches(conditions.elementCount, elements, "element")) return false;
  if (conditions.tenGodCount && !countConditionMatches(conditions.tenGodCount, countTenGods(tenGods), "name")) return false;
  return true;
}

function countConditionMatches(condition, counts, targetKey) {
  const items = Array.isArray(condition) ? condition : [condition];
  return items.every((item) => {
    const key = item?.[targetKey];
    if (!key) return false;
    return compareNumber(Number(counts[key] ?? 0), item.operator ?? ">=", Number(item.value ?? 1));
  });
}

function compareNumber(left, operator, right) {
  if (operator === ">") return left > right;
  if (operator === ">=") return left >= right;
  if (operator === "<") return left < right;
  if (operator === "<=") return left <= right;
  if (operator === "=" || operator === "==") return left === right;
  return false;
}

function normalizeLearningRuleHit(rule, context) {
  const evidence = rule.evidence && typeof rule.evidence === "object" ? rule.evidence : {};
  const whyMatched = evidence.whyMatched ?? deriveLearningMatchReason(rule.conditions, context);
  const howToLearn = evidence.howToLearn ?? rule.logic ?? rule.plainExplanation ?? "";
  const uncertaintyFactors = normalizeList(evidence.uncertaintyFactors).length
    ? normalizeList(evidence.uncertaintyFactors)
    : ["出生时间准确性", "强弱取舍", "岁运触发层次"];
  return {
    id: rule.id,
    title: rule.title,
    category: rule.category,
    trigger: rule.trigger,
    conditions: rule.conditions ?? {},
    logic: rule.logic,
    plainExplanation: rule.plainExplanation,
    whyMatched,
    howToLearn,
    uncertaintyFactors,
    sourceRefs: rule.sourceRefs ?? [],
    outputTemplate: rule.outputTemplate,
    confidence: rule.confidence ?? "low",
    status: rule.status ?? "draft",
    absoluteWarning: "不允许说成结论；这条规则只能作为学习线索。",
  };
}

function deriveLearningMatchReason(conditions = {}, context) {
  const reasons = [];
  if (conditions.always) reasons.push("该规则是通用学习规则。");
  if (conditions.dayStem) reasons.push(`日干为${context.pillars.day.stem}。`);
  if (conditions.monthBranch) reasons.push(`月支为${context.pillars.month.branch}。`);
  if (conditions.relationType) reasons.push(`原局关系命中${conditions.relationType === "any" ? "基础干支关系" : conditions.relationType}。`);
  if (conditions.elementCount) reasons.push("五行数量满足规则条件。");
  if (conditions.tenGodCount) reasons.push("十神数量满足规则条件。");
  return reasons.join(" ") || "当前命盘满足规则条件。";
}

function learningConfidenceRank(confidence) {
  return { high: 3, medium: 2, low: 1 }[confidence] ?? 0;
}

function buildTransitHits(pillars, selectedYear, selectedMonth, datasets) {
  const rules = datasets?.systemRules?.rules?.filter((rule) => rule.category === "transit_branch_to_natal_branch") ?? [];
  const transitPillars = [selectedYear, selectedMonth].filter(Boolean);
  const natalEntries = Object.values(pillars);
  const hits = [];
  for (const transit of transitPillars) {
    for (const target of natalEntries) {
      const rule = rules.find((item) => item.match?.transitBranch === transit.branch && item.match?.natalBranch === target.branch);
      if (rule) {
        hits.push({
          transit: `${transit.role}${transit.label}`,
          target: `${target.role}${target.label}`,
          relation: rule.match?.relation ?? rule.display?.title ?? "触发",
          title: rule.display?.title ?? `${transit.branch}触${target.branch}`,
          interpretation: rule.interpretation ?? rule.display?.template ?? "",
          domains: rule.domains ?? [],
          evidenceLevel: rule.evidenceLevel,
          status: rule.status,
          sourceIds: rule.sourceIds ?? [],
        });
      } else if (transit.branch === target.branch) {
        hits.push({
          transit: `${transit.role}${transit.label}`,
          target: `${target.role}${target.label}`,
          relation: "伏吟",
          title: `${transit.branch}临${target.branch}`,
          interpretation: "流支与原局地支相同，事件感增强。",
          domains: ["personality", "career", "money", "health", "children", "marriage"],
          evidenceLevel: "derived",
          status: "active",
          sourceIds: [],
        });
      }
    }
  }
  return hits;
}

function buildStrengthSignals(monthBranch, elements, datasets) {
  const rules = datasets?.fiveElements?.seasonalStrength?.rules ?? datasets?.fiveElements?.seasonalStrength ?? [];
  return Object.keys(elements).map((element) => {
    const rule = rules.find((item) => item.monthBranch === monthBranch && item.element === element);
    if (rule) {
      return {
        element,
        label: ELEMENT_LABELS[element],
        score: rule.score ?? rule.notes?.score ?? 0,
        seasonalStatus: rule.seasonalStatus ?? rule.notes?.seasonalStatus ?? "未知",
        interpretation: rule.interpretation ?? rule.display?.template ?? `${ELEMENT_LABELS[element]}在${monthBranch}月的强弱来自数据库。`,
        evidenceLevel: rule.evidenceLevel,
        status: rule.status,
        sourceIds: rule.sourceIds ?? [],
      };
    }
    return {
      element,
      label: ELEMENT_LABELS[element],
      score: elements[element],
      seasonalStatus: "数量",
      interpretation: `${ELEMENT_LABELS[element]}暂按透干、地支和藏干数量估算。`,
      evidenceLevel: "derived",
      status: "draft",
      sourceIds: [],
    };
  });
}

function matchSystemRules(pillars, selectedYear, selectedMonth, elements, tenGods, datasets) {
  const rules = datasets?.systemRules?.rules ?? [];
  const natalBranches = Object.values(pillars).map((pillar) => pillar.branch);
  const natalStems = Object.values(pillars).map((pillar) => pillar.stem);
  const transitPillars = [selectedYear, selectedMonth].filter(Boolean);
  const transitBranches = transitPillars.map((pillar) => pillar.branch);
  const transitStems = transitPillars.map((pillar) => pillar.stem);
  const tenGodNames = new Set(tenGods.map((signal) => signal.name));
  const strongElements = new Set(strongestElements(elements));
  const weakElements = new Set(weakestElements(elements));

  return rules
    .filter((rule) => {
      const match = rule.match ?? {};
      if (match.monthBranch && match.monthBranch !== pillars.month.branch) return false;
      if (match.dayStem && match.dayStem !== pillars.day.stem) return false;
      if (match.element && !Object.hasOwn(elements, match.element)) return false;
      if (match.branch && !natalBranches.includes(match.branch)) return false;
      if (match.tenGod && !tenGodNames.has(match.tenGod)) return false;
      if (Array.isArray(match.tenGods) && !match.tenGods.every((god) => tenGodNames.has(god))) return false;
      if (match.transitStem && !transitStems.includes(match.transitStem)) return false;
      if (match.transitBranch && !transitBranches.includes(match.transitBranch)) return false;
      if (match.natalBranch && !natalBranches.includes(match.natalBranch)) return false;
      if (match.branchA && match.branchB && !hasPair(natalBranches, transitBranches, match.branchA, match.branchB)) return false;
      if (Array.isArray(match.branches) && !match.branches.every((branch) => [...natalBranches, ...transitBranches].includes(branch))) return false;
      if (match.pillar && !Object.values(pillars).some((pillar) => pillar.label === match.pillar)) return false;
      if (match.stem && !natalStems.includes(match.stem)) return false;
      if (match.hiddenStem && !tenGods.some((signal) => signal.targetStem === match.hiddenStem && signal.source.includes("藏干"))) return false;
      if (match.state === "strong" && match.element && !strongElements.has(match.element)) return false;
      if (match.state === "weak" && match.element && !weakElements.has(match.element)) return false;
      return true;
    })
    .map((rule) => ({
      id: rule.id,
      category: rule.category,
      title: rule.display?.title ?? rule.id,
      interpretation: rule.interpretation ?? rule.display?.template ?? "",
      template: rule.display?.template,
      domains: rule.domains ?? [],
      evidenceLevel: rule.evidenceLevel,
      status: rule.status,
      sourceIds: rule.sourceIds ?? [],
      match: rule.match ?? {},
    }));
}

function hasPair(natalBranches, transitBranches, branchA, branchB) {
  const all = [...natalBranches, ...transitBranches];
  return all.includes(branchA) && all.includes(branchB);
}

function matchPatternCandidates(pillars, pillarDetails, datasets) {
  const patterns = datasets?.patternsUsefulGods?.normalPatterns ?? [];
  const monthGods = new Set([
    pillarDetails.month.stemTenGod,
    pillarDetails.month.branchMainTenGod,
    ...pillarDetails.month.hiddenStems.map((item) => item.tenGod),
  ]);
  return patterns
    .filter((pattern) => {
      const gods = String(pattern.tenGod ?? "").split(/[\/、]/).map((item) => item.trim());
      return gods.some((god) => monthGods.has(god) || (god === "禄" && pillarDetails.month.branchMainTenGod === "比肩"));
    })
    .map((pattern) => ({
      id: pattern.id,
      name: pattern.name,
      tenGod: pattern.tenGod,
      summary: pattern.summary,
      basis: pattern.basis,
      status: pattern.status,
      evidenceLevel: pattern.evidenceLevel,
      sourceIds: pattern.sourceIds ?? [],
    }));
}

function matchStars(pillars, datasets) {
  const stars = datasets?.starsSpirits?.stars ?? [];
  const branches = Object.values(pillars).map((pillar) => pillar.branch);
  const dayStem = pillars.day.stem;
  return stars
    .flatMap((star) => {
      if (star.category === "by_day_stem") {
        const targets = lookupStarTargets(star.table, dayStem);
        const hits = targets.filter((branch) => branches.includes(branch));
        return hits.map((branch) => ({ star, branch, basis: `日干${dayStem}查${branch}` }));
      }
      if (star.category === "by_three_combo_group") {
        const anchorBranches = [pillars.year.branch, pillars.day.branch];
        return anchorBranches.flatMap((anchor) => {
          const group = Object.keys(star.table ?? {}).find((key) => key.includes(anchor));
          const target = group ? star.table[group] : null;
          return target && branches.includes(target) ? [{ star, branch: target, basis: `${anchor}属${group}` }] : [];
        });
      }
      return [];
    })
    .map(({ star, branch, basis }) => ({
      id: star.id,
      name: star.name,
      branch,
      basis,
      note: star.note,
      status: star.status,
      evidenceLevel: star.evidenceLevel,
      sourceIds: star.sourceIds ?? [],
    }));
}

function lookupStarTargets(table = {}, dayStem) {
  const values = [];
  for (const [key, value] of Object.entries(table)) {
    if (key.includes(dayStem)) values.push(...(Array.isArray(value) ? value : [value]));
  }
  return values;
}

function buildDatasetCoverage(datasets, matchedRules, patternCandidates, starSignals, referenceKnowledgeHits = []) {
  return [
    {
      label: "天干地支/藏干",
      count:
        (datasets?.stemsBranches?.heavenlyStems?.length ?? 0) +
        (datasets?.stemsBranches?.earthlyBranches?.length ?? 0) +
        (datasets?.stemsBranches?.sixtyJiaziCycle?.list?.length ?? 0),
      used: true,
    },
    { label: "五行强弱", count: datasets?.fiveElements?.seasonalStrength?.rules?.length ?? 0, used: true },
    { label: "十神矩阵", count: Object.keys(datasets?.tenGods?.tenGodMatrix?.matrix ?? {}).length, used: true },
    { label: "合冲刑害破", count: Object.values(datasets?.combinations ?? {}).filter((value) => value?.rules?.length).length, used: true },
    { label: "程序规则命中", count: matchedRules.length, used: matchedRules.length > 0 },
    { label: "基础解读规则", count: datasets?.systemRules?.basicInterpretationRules?.length ?? 0, used: Boolean(datasets?.systemRules?.basicInterpretationRules?.length) },
    { label: "格局候选", count: patternCandidates.length, used: patternCandidates.length > 0 },
    { label: "神煞候选", count: starSignals.length, used: starSignals.length > 0 },
    { label: "参考知识卡", count: datasets?.referenceKnowledge?.cards?.length ?? 0, used: referenceKnowledgeHits.length > 0 },
    { label: "出生地经纬度", count: datasets?.locations?.cities?.length ?? 0, used: Boolean(datasets?.locations?.cities?.length) },
  ];
}

function mapTopicToDomain(topicId) {
  return {
    personality: "personality",
    family: "personality",
    children: "children",
    health: "health",
    money: "money",
    marriage: "marriage",
    career: "career",
  }[topicId];
}

function topicElementHint(topicId, elements) {
  const strongest = strongestElements(elements)[0];
  const label = ELEMENT_LABELS[strongest];
  const text = {
    personality: `性格底色受${label}气影响较明显，表达方式会带这个五行的味道。`,
    family: `家庭主题要看印星、财星和宫位，${label}气偏重时互动方式会更固定。`,
    children: `子女与输出主题看食伤，${label}气会影响表达、养育和创造方式。`,
    health: `健康先看五行偏盛偏弱，${label}气突出时对应节律需要留意。`,
    money: `财运看财星能否被日主承载，${label}气会影响赚钱方式和资源流动。`,
    marriage: `夫妻关系看配偶星和日支，${label}气突出时关系互动会更有该五行特征。`,
    career: `官禄事业看官杀印食的配合，${label}气会影响执行、职位和方向感。`,
  };
  return text[topicId];
}

function strongestElements(elements) {
  const max = Math.max(...Object.values(elements));
  return Object.entries(elements)
    .filter(([, value]) => value === max)
    .map(([key]) => key);
}

function weakestElements(elements) {
  const min = Math.min(...Object.values(elements));
  return Object.entries(elements)
    .filter(([, value]) => value === min)
    .map(([key]) => key);
}

function countBy(items) {
  return items.reduce((acc, item) => {
    acc[item] = (acc[item] ?? 0) + 1;
    return acc;
  }, {});
}

export const labels = {
  elements: ELEMENT_LABELS,
  stems: STEMS,
  branches: BRANCHES,
};
