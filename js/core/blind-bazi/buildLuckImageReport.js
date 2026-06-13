import { branchMainStem, getTenGod } from "../bazi/tenGods.js";

const tenGodThemes = {
  比肩: "同辈、竞争、合作、自主",
  劫财: "同辈、竞争、合作、自主",
  正印: "学习、证照、贵人、保护、资源吸收",
  偏印: "学习、证照、贵人、保护、资源吸收",
  食神: "输出、表达、技术、作品、自由度",
  伤官: "输出、表达、技术、作品、自由度",
  正财: "收入、资源、现实事务、关系责任",
  偏财: "收入、资源、现实事务、关系责任",
  正官: "规则、岗位、压力、身份、考核",
  七杀: "规则、岗位、压力、身份、考核",
};

const relationRules = [
  ["冲", ["子", "午"], "冲动、变化、拉扯"],
  ["冲", ["丑", "未"], "冲动、变化、拉扯"],
  ["冲", ["寅", "申"], "冲动、变化、拉扯"],
  ["冲", ["卯", "酉"], "冲动、变化、拉扯"],
  ["冲", ["辰", "戌"], "冲动、变化、拉扯"],
  ["冲", ["巳", "亥"], "冲动、变化、拉扯"],
  ["合", ["子", "丑"], "合象、牵连、合作"],
  ["合", ["寅", "亥"], "合象、牵连、合作"],
  ["合", ["卯", "戌"], "合象、牵连、合作"],
  ["合", ["辰", "酉"], "合象、牵连、合作"],
  ["合", ["巳", "申"], "合象、牵连、合作"],
  ["合", ["午", "未"], "合象、牵连、合作"],
  ["害", ["子", "未"], "暗中牵制、互动不顺"],
  ["害", ["丑", "午"], "暗中牵制、互动不顺"],
  ["害", ["寅", "巳"], "暗中牵制、互动不顺"],
  ["害", ["卯", "辰"], "暗中牵制、互动不顺"],
  ["害", ["申", "亥"], "暗中牵制、互动不顺"],
  ["害", ["酉", "戌"], "暗中牵制、互动不顺"],
  ["破", ["子", "酉"], "破象、松动、反复"],
  ["破", ["卯", "午"], "破象、松动、反复"],
  ["破", ["辰", "丑"], "破象、松动、反复"],
  ["破", ["戌", "未"], "破象、松动、反复"],
  ["破", ["寅", "亥"], "破象、松动、反复"],
  ["破", ["巳", "申"], "破象、松动、反复"],
  ["刑", ["寅", "巳"], "刑象、规矩压力、内外摩擦"],
  ["刑", ["巳", "申"], "刑象、规矩压力、内外摩擦"],
  ["刑", ["申", "寅"], "刑象、规矩压力、内外摩擦"],
  ["刑", ["丑", "戌"], "刑象、规矩压力、内外摩擦"],
  ["刑", ["戌", "未"], "刑象、规矩压力、内外摩擦"],
  ["刑", ["未", "丑"], "刑象、规矩压力、内外摩擦"],
  ["刑", ["子", "卯"], "刑象、规矩压力、内外摩擦"],
  ["刑", ["卯", "子"], "刑象、规矩压力、内外摩擦"],
];

const pillarNames = {
  year: "年支",
  month: "月支",
  day: "日支",
  hour: "时支",
};

export function buildLuckImageReport({ chart, baseBaziViewModel, natalImageReport } = {}) {
  const luckPillars = normalizeLuckPillars(chart, baseBaziViewModel);
  if (!luckPillars.length) {
    return {
      summary: {
        title: "暂无大运数据",
        overview: "暂无大运数据，当前只显示原局排盘与原局取象。",
        usefulHint: pickUsefulHint(chart, natalImageReport),
        confidence: "low",
      },
      luckItems: [],
      keySignals: [],
      needVerify: ["暂无大运数据，请先确认出生信息、性别和起运计算是否完整。"],
    };
  }

  const context = {
    chart: chart ?? {},
    dayStem: chart?.dayMaster?.stem,
    natalBranches: collectNatalBranches(chart),
    usefulHint: pickUsefulHint(chart, natalImageReport),
  };
  const luckItems = luckPillars.map((pillar, index) => buildLuckItem(pillar, index, context));

  return {
    summary: buildSummary(luckItems, context),
    luckItems,
    keySignals: buildKeySignals(luckItems, context),
    needVerify: buildNeedVerify(context),
  };
}

function buildLuckItem(pillar, index, context) {
  const stem = pillar.stem ?? "";
  const branch = pillar.branch ?? "";
  const tenGod = getTenGod(context.dayStem, stem);
  const branchTenGod = getTenGod(context.dayStem, branchMainStem(branch));
  const relationToNatal = findRelationToNatal(branch, context.natalBranches);
  const theme = tenGodThemes[tenGod] ?? "阶段主题待复核";
  const branchTheme = tenGodThemes[branchTenGod] ?? "地支环境待复核";
  const relationText = relationToNatal.length
    ? `与原局${relationToNatal.map((item) => `${item.natalPillar}${item.type}`).join("、")}，这步运容易触发原局对应结构。`
    : "与原局四支暂未命中冲、合、刑、害、破，先以十神和地支环境观察。";

  return {
    index: pillar.index ?? index + 1,
    ageRange: `${pillar.startAge ?? ""}-${pillar.endAge ?? ""}岁`,
    yearRange: `${pillar.startYear ?? ""}-${pillar.endYear ?? ""}`,
    ganZhi: pillar.label ?? `${stem}${branch}`,
    stem,
    branch,
    tenGod,
    relationToNatal,
    image: `${pillar.label ?? `${stem}${branch}`}大运天干为${tenGod}，阶段主题偏向${theme}；地支${branch}可看环境、落地场景与根气承接，地支主气十神为${branchTenGod}，偏向${branchTheme}。`,
    reality: `现实应象可先观察${theme}是否在这一步运中更常被提到，同时看${branch}所代表的环境与原局四支是否形成牵引。${relationText}`,
    boundary: `大运只作十年阶段背景，不直接断事件；${context.usefulHint}，此处只写偏顺、偏压或需复核的观察方向。`,
    confidence: relationToNatal.length ? "medium" : "low",
  };
}

function buildSummary(luckItems, context) {
  const relationCount = luckItems.filter((item) => item.relationToNatal.length).length;
  const highFocus = luckItems
    .slice(0, 3)
    .map((item) => `${item.ganZhi}${item.tenGod}`)
    .join("、");
  return {
    title: "大运取象总览",
    overview: `当前共列出${luckItems.length}步大运，先以大运天干十神定阶段主题，再以地支看环境与原局关系触发。前几步重点可先看：${highFocus || "待复核"}。`,
    usefulHint: context.usefulHint,
    relationCount,
    confidence: relationCount ? "medium" : "low",
  };
}

function buildKeySignals(luckItems, context) {
  const relationItems = luckItems.filter((item) => item.relationToNatal.length);
  return compact([
    `大运总数：${luckItems.length}步`,
    `用忌提示：${context.usefulHint}`,
    relationItems.length
      ? `关系触发：${relationItems.slice(0, 6).map((item) => `${item.ganZhi}见${item.relationToNatal.map((relation) => relation.type).join("、")}`).join("；")}`
      : "关系触发：当前第一版未见冲、合、刑、害、破命中，先保留观察。",
  ]);
}

function buildNeedVerify(context) {
  return compact([
    "起运岁数、性别顺逆和节气边界是否已复核。",
    "大运天干十神只看阶段主题，仍需回到原局强弱、月令和现实承接。",
    "大运地支与原局四支的冲、合、刑、害、破只提示结构被触发，不直接等同具体事件。",
    `用忌提示仅作方向参考：${context.usefulHint}`,
  ]);
}

function normalizeLuckPillars(chart, baseBaziViewModel) {
  const fromChart = chart?.luckCycles?.pillars ?? chart?.luckCycles?.cycles;
  const fromViewModel = baseBaziViewModel?.luckCycles;
  return (Array.isArray(fromChart) ? fromChart : Array.isArray(fromViewModel) ? fromViewModel : [])
    .filter((pillar) => pillar?.stem && pillar?.branch);
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

function findRelationToNatal(luckBranch, natalBranches) {
  if (!luckBranch) return [];
  return natalBranches.flatMap((pillar) => relationRules
    .filter(([, members]) => samePair(members, [luckBranch, pillar.branch]))
    .map(([type, members, effect]) => ({
      type,
      natalPillar: `${pillar.name}${pillar.label}`,
      natalBranch: pillar.branch,
      luckBranch,
      members: members.join(""),
      effect,
    })));
}

function pickUsefulHint(chart, natalImageReport) {
  return natalImageReport?.summary?.usefulHint
    ?? chart?.structureAnalysis?.usefulGodHint?.reasoning
    ?? "用忌神初步倾向需结合格局、通关、调候复核";
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
