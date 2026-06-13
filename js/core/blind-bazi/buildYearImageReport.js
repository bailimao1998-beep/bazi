import { createPillarFromYear } from "../bazi/pillarMath.js";
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

export function buildYearImageReport({
  chart,
  baseBaziViewModel,
  natalImageReport,
  luckImageReport,
  targetYear,
} = {}) {
  const context = createContext({ chart, baseBaziViewModel, natalImageReport, luckImageReport, targetYear });
  const yearItem = buildYearItem(context);

  return {
    summary: buildSummary(yearItem, context),
    yearItem,
    keySignals: buildKeySignals(yearItem),
    needVerify: buildNeedVerify(context, yearItem),
  };
}

function createContext({ chart, baseBaziViewModel, natalImageReport, luckImageReport, targetYear }) {
  const normalizedYear = normalizeTargetYear(targetYear, chart, baseBaziViewModel);
  const luckItems = Array.isArray(luckImageReport?.luckItems) ? luckImageReport.luckItems : [];
  const currentLuckItem = luckItems.find((item) => item?.isCurrent) ?? luckItems[0] ?? null;
  return {
    chart: chart ?? {},
    dayStem: chart?.dayMaster?.stem,
    natalBranches: collectNatalBranches(chart),
    natalImageReport,
    luckImageReport,
    targetYear: normalizedYear,
    currentLuckItem,
    usedFallbackLuck: Boolean(currentLuckItem && !currentLuckItem.isCurrent),
  };
}

function buildYearItem(context) {
  const pillar = createPillarFromYear(context.targetYear, "流年");
  const stem = pillar.stem ?? "";
  const branch = pillar.branch ?? "";
  const stemTenGod = getTenGod(context.dayStem, stem);
  const branchTenGod = getTenGod(context.dayStem, branchMainStem(branch));
  const stemTheme = tenGodThemes[stemTenGod] ?? "外显主题待复核";
  const branchTheme = tenGodThemes[branchTenGod] ?? "环境承接待复核";
  const relationToNatal = findRelationToNatal(branch, context.natalBranches);
  const relationToLuck = findRelationToLuck(branch, context.currentLuckItem);
  const relationText = relationToNatal.length
    ? relationToNatal.map((relation) => relation.description).join("；")
    : "流年与原局四支暂未命中冲、合、刑、害、破，先以天干十神与地支主气观察。";
  const luckText = relationToLuck.length
    ? relationToLuck.map((relation) => relation.description).join("；")
    : "流年地支与当前大运地支暂未命中冲、合、刑、害、破。";
  const currentLuckLabel = context.currentLuckItem?.ganZhi ?? "当前大运待复核";

  return {
    year: context.targetYear,
    ganZhi: pillar.label,
    stem,
    branch,
    stemTenGod,
    branchTenGod,
    currentLuckItem: context.currentLuckItem,
    relationToNatal,
    relationToLuck,
    image: `${context.targetYear}年${pillar.label}流年，天干${stemTenGod}主外显主题，重点看${stemTheme}；地支${branch}主当年环境与落地场景，地支主气十神${branchTenGod}偏向${branchTheme}。当前大运背景为${currentLuckLabel}，流年取象需放在这步大运中复核。`,
    reality: `现实应象可观察${stemTheme}是否在当年更容易浮出，同时看${branch}所对应的环境、人事与执行场景。原局触发：${relationText} 大运触发：${luckText}`,
    boundary: "流年只作单年结构触发提示，不直接等同具体事件；需结合原局证据、大运背景、现实反馈和反证条件复核。",
    confidence: confidenceForYearItem({ relationToNatal, relationToLuck, currentLuckItem: context.currentLuckItem }),
  };
}

function buildSummary(yearItem, context) {
  const luckLabel = yearItem.currentLuckItem?.ganZhi ?? "当前大运待复核";
  const relationCount = yearItem.relationToNatal.length + yearItem.relationToLuck.length;
  return {
    title: "流年取象总览",
    overview: `${yearItem.year}年${yearItem.ganZhi}流年，以天干${yearItem.stemTenGod}看外显主题，以地支${yearItem.branch}看环境落点，并引用当前大运${luckLabel}作为背景。`,
    currentLuck: luckLabel,
    relationCount,
    confidence: yearItem.confidence,
  };
}

function buildKeySignals(yearItem) {
  return compact([
    `目标年份：${yearItem.year}年${yearItem.ganZhi}`,
    `流年天干十神：${yearItem.stemTenGod}，主题偏向${tenGodThemes[yearItem.stemTenGod] ?? "待复核"}`,
    `流年地支主气十神：${yearItem.branchTenGod}，环境偏向${tenGodThemes[yearItem.branchTenGod] ?? "待复核"}`,
    yearItem.currentLuckItem?.ganZhi ? `当前大运背景：${yearItem.currentLuckItem.ganZhi}` : "当前大运背景：待复核",
    yearItem.relationToNatal.length
      ? `原局触发：${yearItem.relationToNatal.map((relation) => `${relation.type}${relation.natalPillar}`).join("、")}`
      : "原局触发：暂未命中冲、合、刑、害、破。",
    yearItem.relationToLuck.length
      ? `大运触发：${yearItem.relationToLuck.map((relation) => `${relation.type}当前大运支${relation.luckBranch}`).join("、")}`
      : "大运触发：暂未命中冲、合、刑、害、破。",
  ]);
}

function buildNeedVerify(context, yearItem) {
  return compact([
    context.usedFallbackLuck ? "当前大运未能根据目标年份定位，已暂用第一步大运作为背景，需复核起运年份和目标年份。" : "",
    "流年与原局、大运的冲、合、刑、害、破只提示结构被触发，不直接断具体事件。",
    "需结合原局取象证据、大运阶段背景与现实反馈判断成立条件。",
    yearItem.relationToLuck.length ? "该年对当前大运背景有明显触发，需重点复核大运取象中的现实应象与成立边界。" : "",
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

function findRelationToNatal(yearBranch, natalBranches) {
  if (!yearBranch) return [];
  return natalBranches.flatMap((pillar) => findBranchRelations(yearBranch, pillar.branch)
    .map((relation) => ({
      ...relation,
      natalPillar: `${pillar.name}${pillar.label}`,
      natalBranch: pillar.branch,
      yearBranch,
      description: `${relation.type}${pillar.name}${pillar.branch}：${pillarRoleMeanings[pillar.key] ?? "对应原局结构被牵动"}，${relation.effect}`,
    })));
}

function findRelationToLuck(yearBranch, currentLuckItem) {
  const luckBranch = currentLuckItem?.branch;
  if (!yearBranch || !luckBranch) return [];
  return findBranchRelations(yearBranch, luckBranch).map((relation) => ({
    ...relation,
    yearBranch,
    luckBranch,
    luckGanZhi: currentLuckItem?.ganZhi ?? "",
    description: `流年支${yearBranch}与当前大运支${luckBranch}成${relation.type}：该年对当前大运背景有明显触发，${relation.effect}。`,
  }));
}

function findBranchRelations(leftBranch, rightBranch) {
  return relationRules
    .filter(([, members]) => samePair(members, [leftBranch, rightBranch]))
    .map(([type, members, effect]) => ({
      type,
      members: members.join(""),
      effect,
    }));
}

function confidenceForYearItem({ relationToNatal, relationToLuck, currentLuckItem }) {
  const hasNatalRelation = relationToNatal.length > 0;
  const hasLuckRelation = relationToLuck.length > 0;
  if (currentLuckItem?.isCurrent && hasNatalRelation && hasLuckRelation) return "high";
  if (currentLuckItem?.isCurrent && (hasNatalRelation || hasLuckRelation)) return "medium";
  if (hasNatalRelation || hasLuckRelation) return "medium";
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
