import { createMonthPillar } from "../bazi/pillarMath.js";
import { branchMainStem, getTenGod } from "../bazi/tenGods.js";

const tenGodThemes = {
  比肩: "竞争、同辈、自主、合作",
  劫财: "竞争、同辈、自主、合作",
  正印: "学习、贵人、资质、保护、资料",
  偏印: "学习、贵人、资质、保护、资料",
  食神: "表达、技术、作品、输出、自由度",
  伤官: "表达、技术、作品、输出、自由度",
  正财: "收入、资源、现实事务、关系责任",
  偏财: "收入、资源、现实事务、关系责任",
  正官: "岗位、规则、压力、身份、考核",
  七杀: "岗位、规则、压力、身份、考核",
};

const relationRules = [
  ["冲", ["子", "午"], "变化、拉扯、动荡"],
  ["冲", ["丑", "未"], "变化、拉扯、动荡"],
  ["冲", ["寅", "申"], "变化、拉扯、动荡"],
  ["冲", ["卯", "酉"], "变化、拉扯、动荡"],
  ["冲", ["辰", "戌"], "变化、拉扯、动荡"],
  ["冲", ["巳", "亥"], "变化、拉扯、动荡"],
  ["合", ["子", "丑"], "牵连、合作、绑定"],
  ["合", ["寅", "亥"], "牵连、合作、绑定"],
  ["合", ["卯", "戌"], "牵连、合作、绑定"],
  ["合", ["辰", "酉"], "牵连、合作、绑定"],
  ["合", ["巳", "申"], "牵连、合作、绑定"],
  ["合", ["午", "未"], "牵连、合作、绑定"],
  ["害", ["子", "未"], "暗中牵制、不顺畅"],
  ["害", ["丑", "午"], "暗中牵制、不顺畅"],
  ["害", ["寅", "巳"], "暗中牵制、不顺畅"],
  ["害", ["卯", "辰"], "暗中牵制、不顺畅"],
  ["害", ["申", "亥"], "暗中牵制、不顺畅"],
  ["害", ["酉", "戌"], "暗中牵制、不顺畅"],
  ["破", ["子", "酉"], "反复、松动、破局"],
  ["破", ["卯", "午"], "反复、松动、破局"],
  ["破", ["辰", "丑"], "反复、松动、破局"],
  ["破", ["戌", "未"], "反复、松动、破局"],
  ["破", ["寅", "亥"], "反复、松动、破局"],
  ["破", ["巳", "申"], "反复、松动、破局"],
  ["刑", ["寅", "巳"], "规则压力、摩擦、内耗"],
  ["刑", ["巳", "申"], "规则压力、摩擦、内耗"],
  ["刑", ["申", "寅"], "规则压力、摩擦、内耗"],
  ["刑", ["丑", "戌"], "规则压力、摩擦、内耗"],
  ["刑", ["戌", "未"], "规则压力、摩擦、内耗"],
  ["刑", ["未", "丑"], "规则压力、摩擦、内耗"],
  ["刑", ["子", "卯"], "规则压力、摩擦、内耗"],
  ["刑", ["卯", "子"], "规则压力、摩擦、内耗"],
];

const pillarNames = {
  year: "年支",
  month: "月支",
  day: "日支",
  hour: "时支",
};

const pillarRoleMeanings = {
  year: "早年、家庭、根基结构被牵动",
  month: "事业环境、成长秩序、工作规则被牵动",
  day: "关系宫、亲密关系、合作模式被牵动",
  hour: "执行层、后期规划、子女/结果层被牵动",
};

export function buildMonthImageReport({
  chart,
  baseBaziViewModel,
  natalImageReport,
  luckImageReport,
  yearImageReport,
  targetYear,
  selectedMonth,
} = {}) {
  const context = createContext({ chart, baseBaziViewModel, natalImageReport, luckImageReport, yearImageReport, targetYear, selectedMonth });
  const monthItem = buildMonthItem(context);

  return {
    summary: buildSummary(monthItem),
    monthItem,
    keySignals: buildKeySignals(monthItem),
    needVerify: buildNeedVerify(context, monthItem),
  };
}

function createContext({ chart, baseBaziViewModel, natalImageReport, luckImageReport, yearImageReport, targetYear, selectedMonth }) {
  const normalizedYear = normalizeTargetYear(targetYear, chart, baseBaziViewModel);
  const normalizedMonth = normalizeSelectedMonth(selectedMonth, chart, baseBaziViewModel);
  const luckItems = Array.isArray(luckImageReport?.luckItems) ? luckImageReport.luckItems : [];
  const currentLuckItem = luckItems.find((item) => item?.isCurrent) ?? luckItems[0] ?? null;
  const yearItem = yearImageReport?.yearItem ?? null;
  return {
    chart: chart ?? {},
    dayStem: chart?.dayMaster?.stem,
    natalBranches: collectNatalBranches(chart),
    natalImageReport,
    luckImageReport,
    yearImageReport,
    targetYear: normalizedYear,
    selectedMonth: normalizedMonth,
    currentLuckItem,
    yearItem,
    usedFallbackLuck: Boolean(currentLuckItem && !currentLuckItem.isCurrent),
  };
}

function buildMonthItem(context) {
  const pillar = createMonthPillar(context.targetYear, context.selectedMonth, "流月");
  const stem = pillar.stem ?? "";
  const branch = pillar.branch ?? "";
  const stemTenGod = getTenGod(context.dayStem, stem);
  const branchTenGod = getTenGod(context.dayStem, branchMainStem(branch));
  const stemTheme = tenGodThemes[stemTenGod] ?? "当月外显主题待复核";
  const branchTheme = tenGodThemes[branchTenGod] ?? "当月环境承接待复核";
  const flowMonthLabel = `${context.selectedMonth}月/${branch}月`;
  const relationToNatal = findRelationToNatal(branch, context.natalBranches);
  const relationToLuck = findRelationToLuck(branch, context.currentLuckItem);
  const relationToYear = findRelationToYear(branch, context.yearItem);
  const natalText = relationToNatal.length
    ? relationToNatal.map((relation) => relation.description).join("；")
    : "流月与原局四支暂未命中冲、合、刑、害、破，先以天干十神与地支主气观察。";
  const luckText = relationToLuck.length
    ? relationToLuck.map((relation) => relation.description).join("；")
    : "流月地支与当前大运地支暂未命中冲、合、刑、害、破。";
  const yearText = relationToYear.length
    ? relationToYear.map((relation) => relation.description).join("；")
    : "流月地支与当前流年地支暂未命中冲、合、刑、害、破。";
  const luckLabel = context.currentLuckItem?.ganZhi ?? "当前大运待复核";
  const yearLabel = context.yearItem?.ganZhi ?? "当前流年待复核";

  return {
    year: context.targetYear,
    month: context.selectedMonth,
    flowMonthLabel,
    ganZhi: pillar.label,
    stem,
    branch,
    stemTenGod,
    branchTenGod,
    currentLuckItem: context.currentLuckItem,
    yearItem: context.yearItem,
    relationToNatal,
    relationToLuck,
    relationToYear,
    image: `${context.targetYear}年${flowMonthLabel}${pillar.label}流月，天干${stemTenGod}看当月外显主题，重点观察${stemTheme}；地支${branch}看当月环境、执行场景和触发点，地支主气十神${branchTenGod}偏向${branchTheme}。当前大运背景为${luckLabel}，当前流年背景为${yearLabel}，流月取象需放在这两层背景下复核。`,
    reality: `现实应象可观察${stemTheme}是否在当月更集中，同时看${branch}对应的执行节奏、环境变化和事务推进。原局触发：${natalText} 大运触发：${luckText} 流年触发：${yearText}`,
    boundary: "流月只作单月结构触发提示，不直接等同具体事件；需结合原局证据、大运阶段背景、流年年度背景和现实反馈复核。",
    confidence: confidenceForMonthItem({ relationToNatal, relationToLuck, relationToYear, currentLuckItem: context.currentLuckItem, yearItem: context.yearItem }),
  };
}

function buildSummary(monthItem) {
  const luckLabel = monthItem.currentLuckItem?.ganZhi ?? "当前大运待复核";
  const yearLabel = monthItem.yearItem?.ganZhi ?? "当前流年待复核";
  const relationCount = monthItem.relationToNatal.length + monthItem.relationToLuck.length + monthItem.relationToYear.length;
  return {
    title: "流月取象总览",
    overview: `${monthItem.year}年${monthItem.flowMonthLabel || `${monthItem.month}月/${monthItem.branch}月`}${monthItem.ganZhi}流月，以天干${monthItem.stemTenGod}看当月外显主题，以地支${monthItem.branch}看环境与执行触发，并引用当前大运${luckLabel}、当前流年${yearLabel}作为背景。`,
    currentLuck: luckLabel,
    currentYear: yearLabel,
    relationCount,
    confidence: monthItem.confidence,
  };
}

function buildKeySignals(monthItem) {
  return compact([
    `目标流月：${monthItem.year}年${monthItem.flowMonthLabel || `${monthItem.month}月/${monthItem.branch}月`}${monthItem.ganZhi}`,
    `流月天干十神：${monthItem.stemTenGod}，主题偏向${tenGodThemes[monthItem.stemTenGod] ?? "待复核"}`,
    `流月地支主气十神：${monthItem.branchTenGod}，环境偏向${tenGodThemes[monthItem.branchTenGod] ?? "待复核"}`,
    monthItem.currentLuckItem?.ganZhi ? `当前大运背景：${monthItem.currentLuckItem.ganZhi}` : "当前大运背景：待复核",
    monthItem.yearItem?.ganZhi ? `当前流年背景：${monthItem.yearItem.ganZhi}` : "当前流年背景：待复核",
    monthItem.relationToNatal.length
      ? `原局触发：${monthItem.relationToNatal.map((relation) => `${relation.type}${relation.natalPillar}`).join("、")}`
      : "原局触发：暂未命中冲、合、刑、害、破。",
    monthItem.relationToLuck.length
      ? `大运触发：${monthItem.relationToLuck.map((relation) => `${relation.type}当前大运支${relation.luckBranch}`).join("、")}`
      : "大运触发：暂未命中冲、合、刑、害、破。",
    monthItem.relationToYear.length
      ? `流年触发：${monthItem.relationToYear.map((relation) => `${relation.type}当前流年支${relation.yearBranch}`).join("、")}`
      : "流年触发：暂未命中冲、合、刑、害、破。",
  ]);
}

function buildNeedVerify(context, monthItem) {
  return compact([
    context.usedFallbackLuck ? "当前大运未能根据目标年份定位，已暂用第一步大运作为背景，需复核起运年份和目标年份。" : "",
    context.yearItem ? "" : "当前流年背景缺失，流月取象需先复核流年取象是否生成。",
    "流月与原局、大运、流年的冲、合、刑、害、破只提示结构被触发，不直接断具体事件。",
    "需结合原局取象证据、大运阶段背景、流年年度背景与当月现实反馈判断成立条件。",
    monthItem.relationToYear.length ? "该月对当前流年背景有明显触发，需重点复核流年取象中的现实应象与成立边界。" : "",
  ]);
}

function normalizeTargetYear(targetYear, chart, baseBaziViewModel) {
  const candidates = [
    targetYear,
    chart?.input?.targetYear,
    baseBaziViewModel?.birthInfo?.targetYear,
    new Date().getFullYear(),
  ];
  const matched = candidates.map(Number).find((year) => Number.isFinite(year));
  return matched ?? new Date().getFullYear();
}

function normalizeSelectedMonth(selectedMonth, chart, baseBaziViewModel) {
  const candidates = [
    selectedMonth,
    chart?.input?.selectedMonth,
    baseBaziViewModel?.birthInfo?.selectedMonth,
    1,
  ];
  const matched = candidates.map(Number).find((month) => Number.isFinite(month));
  return Math.min(12, Math.max(1, Math.trunc(matched ?? 1)));
}

function collectNatalBranches(chart = {}) {
  return Object.entries(chart.pillars ?? {})
    .map(([key, pillar]) => ({
      key,
      name: pillarNames[key] ?? key,
      label: pillar?.label ?? "",
      branch: pillar?.branch ?? "",
    }))
    .filter((pillar) => pillar.branch);
}

function findRelationToNatal(monthBranch, natalBranches) {
  if (!monthBranch) return [];
  return natalBranches.flatMap((pillar) => findBranchRelations(monthBranch, pillar.branch)
    .map((relation) => ({
      ...relation,
      natalPillar: `${pillar.name}${pillar.label}`,
      natalBranch: pillar.branch,
      monthBranch,
      description: `流月支${monthBranch}与${pillar.name}${pillar.branch}成${relation.type}：${pillarRoleMeanings[pillar.key] ?? "对应原局结构被牵动"}，${relation.effect}`,
    })));
}

function findRelationToLuck(monthBranch, currentLuckItem) {
  const luckBranch = currentLuckItem?.branch;
  if (!monthBranch || !luckBranch) return [];
  return findBranchRelations(monthBranch, luckBranch).map((relation) => ({
    ...relation,
    monthBranch,
    luckBranch,
    luckGanZhi: currentLuckItem?.ganZhi ?? "",
    description: `流月支${monthBranch}与当前大运支${luckBranch}成${relation.type}：当月对当前大运背景形成结构触发，${relation.effect}。`,
  }));
}

function findRelationToYear(monthBranch, yearItem) {
  const yearBranch = yearItem?.branch;
  if (!monthBranch || !yearBranch) return [];
  return findBranchRelations(monthBranch, yearBranch).map((relation) => ({
    ...relation,
    monthBranch,
    yearBranch,
    yearGanZhi: yearItem?.ganZhi ?? "",
    description: `流月支${monthBranch}与当前流年支${yearBranch}成${relation.type}：当月对当前流年背景形成结构触发，${relation.effect}。`,
  }));
}

function findBranchRelations(leftBranch, rightBranch) {
  const seen = new Set();

  return relationRules
    .filter(([, members]) => samePair(members, [leftBranch, rightBranch]))
    .map(([type, members, effect]) => ({
      type,
      members: members.join(""),
      effect,
    }))
    .filter((relation) => {
      const key = [
        relation.type,
        relation.members.split("").sort().join(""),
        relation.effect,
      ].join("|");

      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function confidenceForMonthItem({ relationToNatal, relationToLuck, relationToYear, currentLuckItem, yearItem }) {
  const relationCount = relationToNatal.length + relationToLuck.length + relationToYear.length;
  if (currentLuckItem?.isCurrent && yearItem && relationCount >= 2) return "high";
  if (relationCount > 0 || currentLuckItem?.isCurrent || yearItem) return "medium";
  return "low";
}

function samePair(left, right) {
  return left.length === right.length && left.every((item) => right.includes(item));
}

function compact(items = []) {
  return (Array.isArray(items) ? items : [items])
    .flat()
    .filter((item) => item !== undefined && item !== null && String(item).trim())
    .map((item) => String(item));
}
