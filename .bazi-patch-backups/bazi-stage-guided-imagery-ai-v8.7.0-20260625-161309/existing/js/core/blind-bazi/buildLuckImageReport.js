import { branchMainStem, getTenGod } from "../bazi/tenGods.js";
import { buildTransitStructureAnalysis } from "../transit/transitStructureAnalyzer.js";
import { buildTransitTriggeredImages } from "../transit/transitImageComposer.js";
import { formatLuckDateRange } from "../transit/stageSemanticModel.js";

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

const pillarRoleMeanings = {
  year: "早年、家庭、根基结构被牵动",
  month: "事业环境、成长秩序、工作规则被牵动",
  day: "关系宫、亲密关系、合作模式被牵动",
  hour: "执行层、后期规划、子女/结果层被牵动",
};

const relationTypeMeanings = {
  合: "牵连、合作、绑定",
  冲: "变化、拉扯、动荡",
  刑: "规则压力、摩擦、内耗",
  害: "暗中牵制、不顺畅",
  破: "反复、松动、破局",
};

export function buildLuckImageReport({
  chart,
  baseBaziViewModel,
  natalImageReport,
  targetYear,
  selectedMonth,
} = {}) {
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

  const resolvedTargetYear = Number(
    targetYear ??
    chart?.input?.targetYear ??
    baseBaziViewModel?.birthInfo?.targetYear,
  );

  const resolvedSelectedMonth = normalizeFlowMonth(
    selectedMonth ??
    chart?.input?.selectedMonth ??
    1,
  );

  const natalPillars = collectNatalPillars(chart);
  const context = {
    chart: chart ?? {},
    dayStem: chart?.dayMaster?.stem,
    natalPillars,
    natalBranches: natalPillars.map((pillar) => ({
      key: pillar.key,
      name: pillarNames[pillar.key] ?? pillar.key,
      label: pillar.label,
      branch: pillar.branch,
    })),
    targetYear: resolvedTargetYear,
    selectedMonth: resolvedSelectedMonth,
    targetMonthIndex: flowMonthToMonthIndex(
      resolvedTargetYear,
      resolvedSelectedMonth,
    ),
    usefulHint: pickUsefulHint(chart, natalImageReport),
  };

  const luckItems = luckPillars.map((pillar, index) =>
    buildLuckItem(pillar, index, context),
  );

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
  const selectionTarget = resolveLuckSelectionTarget(pillar);
  const relationToNatal = findRelationToNatal(branch, context.natalBranches);
  const theme = tenGodThemes[tenGod] ?? "阶段主题待复核";
  const branchTheme = tenGodThemes[branchTenGod] ?? "地支环境待复核";
  const isCurrent = isCurrentLuck(pillar, context.targetMonthIndex);
  const label = pillar.label ?? `${stem}${branch}`;
  const dateRangeLabel = formatLuckDateRange(pillar);
  const shortImage = `${label}大运偏向${tenGod}${theme.split("、")[0]}，重点看${theme}。`;
  const relationText = relationToNatal.length
    ? `与原局${relationToNatal.map((item) => `${item.natalPillar}${item.type}`).join("、")}，这步运容易触发原局对应结构。`
    : "与原局四支暂未命中冲、合、刑、害、破，先以十神和地支环境观察。";

  const transitStructure = buildTransitStructureAnalysis({
    stage: "luck",
    current: {
      id: `luck:${index + 1}:${label}`,
      ganZhi: label,
      stem,
      branch,
      tenGod,
      branchTenGod,
    },
    natalPillars: context.natalPillars,
  });

  const triggerImages = buildTransitTriggeredImages({
    stage: "luck",
    item: {
      ganZhi: label,
      stem,
      branch,
      tenGod,
      branchTenGod,
    },
    structureAnalysis: transitStructure,
  });

  return {
    index: pillar.index ?? index + 1,
    ageRange: `${pillar.startAge ?? ""}-${pillar.endAge ?? ""}岁`,
    yearRange:
      dateRangeLabel ||
      `${pillar.startYear ?? ""}-${pillar.endYear ?? ""}`,
    dateRangeLabel,
    startMonthIndex:
      Number.isFinite(Number(pillar.startMonthIndex))
        ? Number(pillar.startMonthIndex)
        : null,
    endMonthIndexExclusive:
      Number.isFinite(Number(pillar.endMonthIndexExclusive))
        ? Number(pillar.endMonthIndexExclusive)
        : null,
    ganZhi: label,
    stem,
    branch,
    tenGod,
    branchTenGod,
    isCurrent,
    selectionYear: selectionTarget.year,
    selectionMonth: selectionTarget.month,
    relationToNatal,
    transitStructure,
    triggerImages,
    shortImage,
    image: shortImage,
    structureImage: `${label}大运天干为${tenGod}，阶段主题偏向${theme}；地支${branch}可看环境、落地场景与根气承接，地支主气十神为${branchTenGod}，偏向${branchTheme}。原局关系触发：${relationText} ${transitStructure.summary.text}`,
    reality: `现实应象可先观察${theme}是否在这一步运中更常被提到，同时看${branch}所代表的环境与原局四支是否形成牵引。${relationText}`,
    boundary: `大运只作十年阶段背景，不直接断事件；${localizeStrengthTerms(context.usefulHint)}，此处只写偏顺、偏压或需复核的观察方向。`,
    confidence: confidenceForLuckItem({
      isCurrent,
      relationToNatal,
      transitStructure,
    }),
  };
}

function buildSummary(luckItems, context) {
  const relationCount = luckItems.filter((item) => item.relationToNatal.length).length;
  const structureCount = luckItems.reduce(
    (sum, item) => sum + Number(item.transitStructure?.summary?.highFactCount || 0),
    0,
  );
  const highFocus = luckItems
    .slice(0, 3)
    .map((item) => `${item.ganZhi}${item.tenGod}`)
    .join("、");

  return {
    title: "大运取象总览",
    overview: `当前共列出${luckItems.length}步大运，先以大运天干十神定阶段主题，再以地支、天干关系、伏吟、组合条件与原局触发观察长期环境。前几步重点可先看：${highFocus || "待复核"}。`,
    usefulHint: context.usefulHint,
    relationCount,
    structureCount,
    confidence: relationCount || structureCount ? "medium" : "low",
  };
}

function buildKeySignals(luckItems, context) {
  const relationItems = luckItems.filter((item) => item.relationToNatal.length);
  const currentItem = luckItems.find((item) => item.isCurrent) ?? luckItems[0] ?? null;
  const structureSignals = currentItem?.transitStructure?.facts
    ?.slice(0, 5)
    .map((fact) => `结构组合：${fact.text}`) ?? [];

  return compact([
    `大运总数：${luckItems.length}步`,
    `用忌提示：${context.usefulHint}`,
    relationItems.length
      ? `关系触发：${relationItems.slice(0, 6).map((item) => `${item.ganZhi}见${item.relationToNatal.map((relation) => relation.type).join("、")}`).join("；")}`
      : "关系触发：当前未见基础冲、合、刑、害、破命中，仍需继续看天干关系、重复与组合条件。",
    ...structureSignals,
  ]);
}

function buildNeedVerify(context) {
  return compact([
    "起运岁数、性别顺逆和节气边界是否已复核。",
    "大运天干与地支主气只看阶段主题，仍需回到原局强弱、月令和现实承接。",
    "三合、三会、半合、伏吟、自刑和天克地冲只提示结构条件，不直接等同具体事件。",
    `用忌提示仅作方向参考：${context.usefulHint}`,
  ]);
}

function normalizeLuckPillars(chart, baseBaziViewModel) {
  const fromChart = chart?.luckCycles?.pillars ?? chart?.luckCycles?.cycles;
  const fromViewModel = baseBaziViewModel?.luckCycles;
  return (Array.isArray(fromChart) ? fromChart : Array.isArray(fromViewModel) ? fromViewModel : [])
    .filter((pillar) => pillar?.stem && pillar?.branch);
}

function collectNatalPillars(chart = {}) {
  return Object.entries(chart.pillars ?? {})
    .map(([key, pillar]) => ({
      id: `natal:${key}:${pillar?.label || ""}`,
      key,
      name: pillarNames[key] ?? key,
      label: pillar?.label ?? `${pillar?.stem ?? ""}${pillar?.branch ?? ""}`,
      stem: pillar?.stem ?? "",
      branch: pillar?.branch ?? "",
      tenGod: pillar?.stemTenGod || pillar?.tenGod || "",
      branchTenGod: pillar?.branchTenGod || pillar?.branchMainTenGod || "",
    }))
    .filter((pillar) => pillar.stem || pillar.branch);
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
      description: describeRelation(type, pillar),
    })));
}

function describeRelation(type, pillar) {
  const roleMeaning = pillarRoleMeanings[pillar.key] ?? "对应原局结构被牵动";
  const typeMeaning = relationTypeMeanings[type] ?? "结构牵动需复核";
  return `${type}${pillar.name}${pillar.branch}：${roleMeaning}，${typeMeaning}`;
}

function isCurrentLuck(pillar, targetMonthIndex) {
  if (!Number.isFinite(targetMonthIndex)) return false;

  const startMonthIndex = Number(pillar.startMonthIndex);
  const endMonthIndexExclusive = Number(pillar.endMonthIndexExclusive);

  if (Number.isFinite(startMonthIndex) && Number.isFinite(endMonthIndexExclusive)) {
    return startMonthIndex <= targetMonthIndex && targetMonthIndex < endMonthIndexExclusive;
  }

  const targetYear = Math.floor(targetMonthIndex / 12);
  return Number(pillar.startYear) <= targetYear && targetYear <= Number(pillar.endYear);
}

function pickUsefulHint(chart, natalImageReport) {
  return localizeStrengthTerms(
    natalImageReport?.summary?.usefulHint ??
    chart?.structureAnalysis?.usefulGodHint?.reasoning ??
    "用忌神初步倾向需结合格局、通关、调候复核",
  );
}

function confidenceForLuckItem({ isCurrent, relationToNatal, transitStructure }) {
  const hasRelation = relationToNatal.length > 0;
  const hasStrongStructure = Number(transitStructure?.summary?.highFactCount || 0) > 0;
  if (isCurrent && hasRelation && hasStrongStructure) return "high";
  if (isCurrent && (hasRelation || hasStrongStructure)) return "medium";
  if (hasRelation || hasStrongStructure) return "medium";
  return "low";
}

function localizeStrengthTerms(text = "") {
  return String(text)
    .replaceAll(/\bweak\b/g, "偏弱")
    .replaceAll(/\bstrong\b/g, "偏强")
    .replaceAll(/\bbalanced\b/g, "平衡")
    .replaceAll(/\bmedium\b/g, "中和")
    .replaceAll(/\bmixed\b/g, "需复核");
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

function normalizeFlowMonth(value) {
  const month = Math.trunc(Number(value));
  if (!Number.isFinite(month)) return 1;
  return Math.min(12, Math.max(1, month));
}

function flowMonthToMonthIndex(targetYear, flowMonth) {
  const year = Number(targetYear);
  if (!Number.isFinite(year)) return null;

  const month = normalizeFlowMonth(flowMonth);
  const gregorianYear = month === 12 ? year + 1 : year;
  const gregorianMonth = month === 12 ? 1 : month + 1;

  return gregorianYear * 12 + gregorianMonth - 1;
}

function resolveLuckSelectionTarget(pillar = {}) {
  const startMonthIndex = Number(pillar.startMonthIndex);
  const endMonthIndexExclusive = Number(pillar.endMonthIndexExclusive);

  if (
    Number.isFinite(startMonthIndex) &&
    Number.isFinite(endMonthIndexExclusive) &&
    startMonthIndex < endMonthIndexExclusive
  ) {
    const safeMonthIndex = Math.min(
      startMonthIndex + 1,
      endMonthIndexExclusive - 1,
    );
    return monthIndexToFlowSelection(safeMonthIndex);
  }

  const startYear = Number(pillar.startYear);
  const endYear = Number(pillar.endYear);

  return {
    year: Number.isFinite(startYear)
      ? Number.isFinite(endYear) && endYear > startYear
        ? startYear + 1
        : startYear
      : "",
    month: 1,
  };
}

function monthIndexToFlowSelection(monthIndex) {
  const gregorianYear = Math.floor(monthIndex / 12);
  const gregorianMonth = ((monthIndex % 12) + 12) % 12 + 1;

  if (gregorianMonth === 1) {
    return {
      year: gregorianYear - 1,
      month: 12,
    };
  }

  return {
    year: gregorianYear,
    month: gregorianMonth - 1,
  };
}
