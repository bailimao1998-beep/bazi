import { knowledgeBase } from "./knowledgeBase.js";

const stageTitles = {
  natal: "原局证据包",
  luck: "大运证据包",
  year: "流年证据包",
  month: "流月证据包",
};

const stageLabels = {
  natal: "原局",
  luck: "大运",
  year: "流年",
  month: "流月",
};

export function buildNatalEvidencePack({ chart, baseBaziViewModel, natalImageReport } = {}) {
  const dayMaster = chart?.dayMaster?.label || chart?.dayMaster?.stem || baseBaziViewModel?.dayMaster?.label || "日主待查";
  const pillarHits = collectNatalTenGodHits({ chart, baseBaziViewModel });
  const patternHits = collectNatalPatternHits({ chart, baseBaziViewModel, natalImageReport });
  const relations = collectRelationEvidence(
    chart?.relations || baseBaziViewModel?.relations || natalImageReport?.relations || natalImageReport?.relationGroups || natalImageReport?.keyRelations,
    "原局关系"
  );
  const summaryText = natalImageReport?.summary?.overview || natalImageReport?.summary?.mainLine || natalImageReport?.overview || "";

  return createPack({
    stage: "natal",
    target: `${dayMaster}原局`,
    hits: [...patternHits, ...pillarHits],
    relations,
    summarySource: {
      mainLine: summaryText || `${dayMaster}原局呈现出日主、四柱十神和原局关系共同构成的底层结构。`,
      reality: natalImageReport?.summary?.reality || natalImageReport?.summary?.usefulHint || "",
      caution: natalImageReport?.summary?.caution || "原局是底层结构，仍要等岁运触发后再看具体应象。",
      verify: "复核原局时，可回到长期性格、关系模式、职业取向和反复出现的人生主题。",
    },
  });
}

export function buildLuckEvidencePack({ baseBaziViewModel, luckImageReport } = {}) {
  const item = pickStageItem(luckImageReport, "luck");
  return createStagePack({
    stage: "luck",
    item,
    report: luckImageReport,
    target: item?.ganZhi ? `${item.ganZhi}大运` : "大运待查",
    relationSources: [
      ["大运触发原局", item?.relationToNatal],
    ],
    fallbackFacts: baseBaziViewModel?.luckCycles,
  });
}

export function buildYearEvidencePack({ baseBaziViewModel, luckImageReport, yearImageReport } = {}) {
  const item = pickStageItem(yearImageReport, "year");
  return createStagePack({
    stage: "year",
    item,
    report: yearImageReport,
    target: item?.year && item?.ganZhi ? `${item.year}${item.ganZhi}流年` : "流年待查",
    relationSources: [
      ["流年触发原局", item?.relationToNatal],
      ["流年触发大运", item?.relationToLuck],
    ],
    fallbackFacts: [luckImageReport?.summary?.currentLuck, baseBaziViewModel?.birthInfo?.targetYear],
  });
}

export function buildMonthEvidencePack({ baseBaziViewModel, luckImageReport, yearImageReport, monthImageReport } = {}) {
  const item = pickStageItem(monthImageReport, "month");
  return createStagePack({
    stage: "month",
    item,
    report: monthImageReport,
    target: item?.ganZhi ? `${item.year || ""}年${item.flowMonthLabel || `${item.month || ""}月`} ${item.ganZhi}流月`.trim() : "流月待查",
    relationSources: [
      ["流月触发原局", item?.relationToNatal],
      ["流月触发大运", item?.relationToLuck],
      ["流月触发流年", item?.relationToYear],
    ],
    fallbackFacts: [luckImageReport?.summary?.currentLuck, yearImageReport?.summary?.overview, baseBaziViewModel?.birthInfo?.selectedMonth],
  });
}

function createStagePack({ stage, item = {}, report = {}, target, relationSources = [], fallbackFacts = [] } = {}) {
  const hits = [
    buildTenGodHit(item.tenGod || item.stemTenGod, "天干十神"),
    buildTenGodHit(item.branchTenGod || item.branchMainTenGod, "地支主气十神"),
  ].filter(Boolean);
  const relations = relationSources.flatMap(([source, relations]) => collectRelationEvidence(relations, source));
  const summary = report?.summary ?? {};

  return createPack({
    stage,
    target,
    hits,
    relations,
    summarySource: {
      mainLine: item.image || item.shortImage || summary.overview || `${stageLabels[stage]}主线围绕当前命中的十神、关系和阶段背景展开。`,
      reality: item.reality || summary.reality || "",
      caution: item.boundary || summary.caution || "阶段取象只提示结构方向，不直接等同具体事件。",
      verify: buildVerifyText(stage, item, report),
    },
    extraFacts: [
      item.ganZhi ? `${stageLabels[stage]}干支：${item.ganZhi}` : "",
      item.confidence ? `置信度：${confidenceLabel(item.confidence)}` : "",
      ...compact(fallbackFacts),
    ],
  });
}

function createPack({ stage, target, hits = [], relations = [], summarySource = {}, extraFacts = [] } = {}) {
  const stageRule = knowledgeBase.stages[stage] ?? knowledgeBase.stages.natal;
  const uniqueHits = uniqueById(hits);
  const uniqueRelations = uniqueById(relations);
  const explanations = buildExplanationContext(uniqueHits, uniqueRelations);
  const facts = compact([
    `阶段：${stageRule?.label || stageLabels[stage] || stage}`,
    target ? `目标：${target}` : "",
    ...uniqueHits.map((hit) => `${hit.source}：${hit.label}`),
    ...uniqueRelations.map((relation) => `${relation.source}：${relation.description || relation.label}`),
    ...extraFacts,
  ]);
  const evidence = [
    ...uniqueHits.map((hit) => `${hit.label}：${hit.bookExplanation}`),
    ...uniqueRelations.map((relation) => `${relation.label}：${relation.bookExplanation}`),
  ];

  return {
    stage,
    title: stageTitles[stage] ?? "证据包",
    target: target || "目标待查",
    hits: uniqueHits,
    relations: uniqueRelations,
    explanations,
    summary: {
      mainLine: summarySource.mainLine || stageRule?.masterTalk || "",
      reality: summarySource.reality || buildRealityLine(uniqueHits, uniqueRelations),
      caution: summarySource.caution || buildCautionLine(uniqueHits, uniqueRelations),
      verify: summarySource.verify || stageRule?.verify || "",
    },
    aiContext: {
      instruction: "AI 只能基于本证据包扩展说明，不能重新排盘，不能脱离证据另起判断。",
      阶段: stageRule?.label || stageLabels[stage] || stage,
      命中取象: uniqueHits.map((hit) => hit.label),
      资料解释: explanations.bookExplanations,
      成立条件: explanations.conditions,
      反证: explanations.counterEvidence,
      现实取象: explanations.realityImages,
      facts,
      evidence,
      questionHints: buildQuestionHints(stage, uniqueHits, uniqueRelations),
    },
  };
}

function buildExplanationContext(hits = [], relations = []) {
  const sources = [...hits, ...relations];
  return {
    bookExplanations: uniqueText(sources.map((item) => item.bookExplanation)),
    conditions: uniqueText(sources.flatMap((item) => item.condition || [])),
    counterEvidence: uniqueText(sources.flatMap((item) => item.counterEvidence || [])),
    realityImages: uniqueText(sources.flatMap((item) => item.realityImages || [])),
    masterTalk: uniqueText(sources.map((item) => item.masterTalk)),
  };
}

function collectNatalTenGodHits({ chart = {}, baseBaziViewModel = {} } = {}) {
  const pillars = chart?.pillars || baseBaziViewModel?.pillars || {};
  return Object.entries(pillars).flatMap(([key, pillar]) => {
    const pillarName = pillarNameFromKey(key);
    return [
      buildTenGodHit(pillar?.stemTenGod || pillar?.tenGod, `${pillarName}天干十神`),
      buildTenGodHit(pillar?.branchTenGod || pillar?.branchMainTenGod, `${pillarName}地支主气十神`),
    ].filter(Boolean);
  });
}

function buildTenGodHit(label, source) {
  const normalized = String(label || "").trim();
  const info = knowledgeBase.tenGods[normalized];
  if (!normalized || !info) return null;
  return {
    id: `tenGod:${normalized}:${source}`,
    type: "tenGod",
    label: normalized,
    source,
    image: info.image,
    bookExplanation: info.bookExplanation,
    condition: info.condition,
    counterEvidence: info.counterEvidence,
    realityImages: info.realityImages,
    clientTalk: info.clientTalk,
    masterTalk: info.masterTalk,
  };
}

function collectNatalPatternHits({ chart = {}, baseBaziViewModel = {}, natalImageReport = {} } = {}) {
  const tenGodStats = chart?.tenGodStats || baseBaziViewModel?.tenGods || {};
  const mainQi = tenGodStats.mainQi || {};
  const fullHidden = tenGodStats.fullHidden || {};
  const pillars = Array.isArray(baseBaziViewModel?.pillars)
    ? baseBaziViewModel.pillars
    : Object.values(chart?.pillars || {});
  const relationCount = normalizeRelationList(chart?.relations || baseBaziViewModel?.relations || []).length;
  const reportText = JSON.stringify(natalImageReport || {});

  return [
    countTenGodGroup(["比肩", "劫财"], mainQi, fullHidden) >= 2
      ? buildPatternHit("比劫重", "原局十神统计")
      : null,
    pillars.some((pillar) => ["正印", "偏印"].includes(pillar?.stemTenGod || pillar?.tenGod))
      ? buildPatternHit("印星透", "原局天干十神")
      : null,
    isWeakWealth(mainQi, fullHidden)
      ? buildPatternHit("财星弱", "原局十神统计")
      : null,
    relationCount || /冲|合|刑|害|破|伏吟|反吟/.test(reportText)
      ? buildPatternHit("关系触发", "原局关系")
      : null,
  ].filter(Boolean);
}

function buildPatternHit(label, source) {
  const info = knowledgeBase.patterns?.[label];
  if (!info) return null;
  return {
    id: `pattern:${label}:${source}`,
    type: "pattern",
    label,
    source,
    image: info.image,
    bookExplanation: info.bookExplanation,
    condition: info.condition,
    counterEvidence: info.counterEvidence,
    realityImages: info.realityImages,
    clientTalk: info.clientTalk,
    masterTalk: info.masterTalk,
  };
}

function countTenGodGroup(labels = [], mainQi = {}, fullHidden = {}) {
  return labels.reduce((sum, label) => sum + Number(mainQi[label] || 0) + Number(fullHidden[label] || 0), 0);
}

function isWeakWealth(mainQi = {}, fullHidden = {}) {
  const visibleWealth = Number(mainQi.正财 || 0) + Number(mainQi.偏财 || 0);
  const totalWealth = visibleWealth + Number(fullHidden.正财 || 0) + Number(fullHidden.偏财 || 0);
  return visibleWealth === 0 && totalWealth <= 1;
}

function collectRelationEvidence(relations, source = "关系触发") {
  return normalizeRelationList(relations)
    .map((relation) => {
      const label = detectRelationLabel(relation);
      const info = knowledgeBase.relations[label];
      if (!label || !info) return null;
      const description = relation?.description || relation?.name || relation?.evidence || relation?.effect || label;
      return {
        id: `relation:${label}:${source}:${description}`,
        type: "relation",
        label,
        source,
        description,
        image: info.image,
        bookExplanation: info.bookExplanation,
        condition: info.condition,
        counterEvidence: info.counterEvidence,
        realityImages: info.realityImages,
        clientTalk: info.clientTalk,
        masterTalk: info.masterTalk,
      };
    })
    .filter(Boolean);
}

function normalizeRelationList(relations) {
  if (!relations) return [];
  if (Array.isArray(relations)) {
    return relations.flatMap((relation) => {
      if (Array.isArray(relation?.relations)) return normalizeRelationList(relation.relations);
      return relation ? [relation] : [];
    });
  }
  if (typeof relations === "object") {
    return Object.values(relations).flatMap((value) => normalizeRelationList(value));
  }
  return [];
}

function detectRelationLabel(relation = {}) {
  const text = [
    relation.type,
    relation.relationType,
    relation.name,
    relation.description,
    relation.evidence,
    relation.effect,
  ].filter(Boolean).join(" ");
  return Object.keys(knowledgeBase.relations).find((label) => text.includes(label)) || "";
}

function pickStageItem(report = {}, stage) {
  if (stage === "luck") {
    const items = Array.isArray(report?.luckItems) ? report.luckItems : [];
    return items.find((item) => item?.isCurrent) ?? items[0] ?? {};
  }
  if (stage === "year") return report?.yearItem ?? {};
  if (stage === "month") return report?.monthItem ?? {};
  return {};
}

function buildVerifyText(stage, item, report) {
  const stageRule = knowledgeBase.stages[stage] ?? knowledgeBase.stages.natal;
  const reportVerify = compact(report?.needVerify).join("；");
  if (reportVerify) return reportVerify;
  if (item?.confidence === "low") return "当前证据偏少，命中的十神和关系可作为观察线索保留。";
  return stageRule?.verify || "";
}

function buildRealityLine(hits = [], relations = []) {
  const reality = [
    ...hits.flatMap((hit) => hit.realityImages || []),
    ...relations.flatMap((relation) => relation.realityImages || []),
  ].slice(0, 5);
  return reality.length ? `现实里可先观察：${reality.join("、")}。` : "";
}

function buildCautionLine(hits = [], relations = []) {
  const cautions = [
    ...hits.flatMap((hit) => hit.counterEvidence || []),
    ...relations.flatMap((relation) => relation.counterEvidence || []),
  ].slice(0, 2);
  return cautions.join("");
}

function buildQuestionHints(stage, hits = [], relations = []) {
  return compact([
    `${stageLabels[stage] || "当前阶段"}的主线是什么？`,
    hits[0]?.label ? `${hits[0].label}在现实里怎么表现？` : "",
    relations[0]?.label ? `${relations[0].label}要怎么验证？` : "",
  ]);
}

function pillarNameFromKey(key) {
  return ({ year: "年柱", month: "月柱", day: "日柱", hour: "时柱" })[key] || key || "四柱";
}

function confidenceLabel(value) {
  return knowledgeBase.confidence[value]?.label || value || "";
}

function uniqueById(items = []) {
  const seen = new Set();
  return items.filter((item) => {
    if (!item?.id || seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

function uniqueText(items = []) {
  return [...new Set(compact(items))];
}

function compact(items = []) {
  return (Array.isArray(items) ? items : [items])
    .flat()
    .filter((item) => item !== undefined && item !== null && String(item).trim())
    .map((item) => String(item));
}
