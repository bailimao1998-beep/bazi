import { buildStageRulePack } from "./buildStageRulePack.js";

const STAGE_LABELS = { luck: "大运", year: "流年", month: "流月" };
const DOMAIN_LABELS = {
  self: "个人状态与选择",
  learning: "学习与能力积累",
  career: "事业与工作方式",
  wealth: "资源与现实回报",
  spouse: "感情与关系",
  relationship: "感情与关系",
  family: "家庭与六亲",
  parents: "父母与支持结构",
  children: "子女与结果层",
  health: "身心节奏",
  health_state: "身心节奏",
  movement: "环境与变动",
  fortune: "整体阶段",
  general: "整体阶段",
};
const LIMITS = { luck: { min: 2, max: 5 }, year: { min: 1, max: 3 }, month: { min: 0, max: 2 } };
const SECTION_TITLES = {
  luck: [
    ["stageSummary", "阶段总判"],
    ["natalReception", "原局如何承接"],
    ["mechanism", "这十年的作用链"],
    ["primaryDomains", "主要现实领域"],
    ["rhythm", "阶段节奏"],
    ["gainsAndCosts", "可以获得什么，需要付出什么"],
    ["verification", "现实验证点"],
  ],
  year: [
    ["stageSummary", "年度总判"],
    ["natalReception", "大运背景"],
    ["mechanism", "今年新增的作用"],
    ["primaryDomains", "最强现实落点"],
    ["gainsAndCosts", "机会与压力"],
    ["rhythm", "今年适合推进与不宜勉强"],
    ["verification", "现实验证点"],
  ],
  month: [
    ["stageSummary", "本月主线"],
    ["natalReception", "承接年度背景"],
    ["mechanism", "本月新增触发"],
    ["primaryDomains", "现实落点"],
    ["rhythm", "行动节奏"],
    ["gainsAndCosts", "需要留意"],
  ],
};

export function buildStageFixedReportModel({
  stage = "luck",
  item = {},
  natalImageReport,
  luckImageReport,
  yearImageReport,
  monthImageReport,
  baseBaziViewModel,
} = {}) {
  const normalizedStage = STAGE_LABELS[stage] ? stage : "luck";
  const domainScan = buildStageDomainScan({ stage: normalizedStage, item });
  const stageRulePack = buildStageRulePack({
    stage: normalizedStage,
    item,
    natalImageReport,
    luckImageReport,
    yearImageReport,
    monthImageReport,
    domainKeys: domainScan.primaryDomains.map((entry) => entry.key),
  });
  const target = buildTarget(normalizedStage, item);
  const theme = item?.triggerImages?.storyPack?.themeHierarchy ?? item?.triggerImages?.themeHierarchy ?? {};
  const primary = compactTheme(theme?.primary);
  const supporting = compactTheme(theme?.supporting);
  const facts = collectFacts(item);
  const structures = facts
    .filter((fact) => ["direct", "combination"].includes(fact.category))
    .slice(0, 4)
    .map((fact) => fact.text || fact.label)
    .filter(Boolean);
  const primaryDomains = enrichDomains(domainScan.primaryDomains, stageRulePack.matchedRules);
  const secondaryDomains = enrichDomains(domainScan.secondaryDomains, stageRulePack.matchedRules);
  const headline = buildHeadline(normalizedStage, target, primary, primaryDomains);
  const overview = buildOverview(normalizedStage, primary, supporting, primaryDomains, structures);
  const mechanism = {
    primary,
    supporting,
    structures: unique([
      ...facts.filter((fact) => fact.status === "direct" || fact.category === "direct")
        .slice(0, normalizedStage === "luck" ? 4 : 3)
        .map((fact) => fact.text || fact.label),
      ...structures,
    ]).slice(0, 5),
    summary: [primary?.summary || primary?.trigger, supporting?.summary || supporting?.trigger]
      .filter(Boolean)
      .join("；") || "当前作用链需要结合原局与现实反馈继续复核。",
  };
  const opportunities = unique([
    ...primaryDomains.flatMap((entry) => entry.usefulDirections),
    ...stageRulePack.matchedRules.filter((rule) => rule.claimSupportAllowed).flatMap((rule) => rule.imagery?.positive ?? []),
  ]).slice(0, normalizedStage === "luck" ? 4 : 3);
  const pressures = unique([
    ...primaryDomains.flatMap((entry) => entry.pressureSignals),
    ...stageRulePack.matchedRules.filter((rule) => rule.claimSupportAllowed).flatMap((rule) => rule.imagery?.negative ?? []),
  ]).slice(0, normalizedStage === "luck" ? 4 : 3);
  const actions = unique([
    ...primaryDomains.flatMap((entry) => entry.actions),
    ...stageRulePack.matchedRules.filter((rule) => rule.claimSupportAllowed).flatMap((rule) => rule.advice ?? []),
  ]).slice(0, normalizedStage === "luck" ? 4 : 3);
  const verificationQuestions = unique([
    ...primaryDomains.flatMap((entry) => entry.realityChecks),
    ...stageRulePack.matchedRules.filter((rule) => rule.claimSupportAllowed).flatMap((rule) => rule.imagery?.realityChecks ?? []),
  ]).slice(0, normalizedStage === "month" ? 3 : 5);
  const contextSummary = buildContextSummary(normalizedStage, item, baseBaziViewModel);
  const sections = buildSections({
    stage: normalizedStage,
    headline,
    overview,
    contextSummary,
    mechanism,
    primaryDomains,
    secondaryDomains,
    opportunities,
    pressures,
    actions,
    verificationQuestions,
  });

  return {
    schemaVersion: "stage-fixed-report-v8.5",
    stage: normalizedStage,
    stageLabel: STAGE_LABELS[normalizedStage],
    target,
    headline,
    overview,
    contextSummary,
    themeHierarchy: { primary, supporting },
    mechanism,
    primaryDomains,
    secondaryDomains,
    opportunities,
    pressures,
    actions,
    verificationQuestions,
    evidenceSummary: {
      directFactCount: facts.filter((fact) => fact.status === "direct").length,
      combinationFactCount: facts.filter((fact) => fact.category === "combination").length,
      factIds: facts.map((fact) => fact.id).filter(Boolean).slice(0, 20),
      structures,
    },
    stageRulePack,
    sections,
    reportRules: [
      "大运讲长期任务与持续作用，不代替流年断具体事件。",
      "流年讲当年新增作用，不重复完整大运。",
      "流月讲短期执行与落点，不上升成长期结论。",
      "只突出证据最强的领域。",
    ],
  };
}

export function buildStageDomainScan({ stage = "luck", item = {} } = {}) {
  const normalizedStage = STAGE_LABELS[stage] ? stage : "luck";
  const limits = LIMITS[normalizedStage];
  const story = item?.triggerImages?.storyPack ?? {};
  const sources = [
    ...annotate(story.directTriggers, 12),
    ...annotate(story.hierarchyInteractions, 9),
    ...annotate(story.convergence, 8),
    ...annotate(story.background, 4),
    ...annotate(story.conditionalPatterns, 1),
  ];
  const groups = new Map();

  for (const source of sources) {
    const keys = unique([source.domain, ...array(source.domains)]).map(normalizeDomain);
    for (const key of keys) {
      if (!key || key === "general") continue;
      const entry = groups.get(key) ?? createDomainEntry(key);
      const currentLayer = isCurrentLayer(source, normalizedStage);
      entry.score += source._weight + (currentLayer ? 4 : 0) + Number(source.strength || 0) / 20;
      entry.currentLayerEvidenceCount += currentLayer ? 1 : 0;
      entry.threadCount += 1;
      entry.summaries.push(source.summary || source.trigger || source.label);
      entry.possibleScenes.push(...array(source.possibleScenes));
      entry.usefulDirections.push(...array(source.usefulDirections));
      entry.pressureSignals.push(...array(source.pressureSignals));
      entry.realityChecks.push(...array(source.conditions));
      entry.evidenceRefs.push(...array(source.evidenceRefs));
      groups.set(key, entry);
    }
  }

  const sorted = [...groups.values()]
    .map(finalizeDomain)
    .sort((a, b) => b.currentLayerEvidenceCount - a.currentLayerEvidenceCount || b.score - a.score);
  let eligible = sorted;
  if (["year", "month"].includes(normalizedStage)) {
    const current = sorted.filter((entry) => entry.currentLayerEvidenceCount > 0);
    if (current.length) eligible = current;
  }
  const primaryDomains = eligible.slice(0, limits.max);

  if (primaryDomains.length < limits.min && normalizedStage !== "month") {
    for (const key of ["career", "wealth", "self", "relationship"]) {
      if (primaryDomains.length >= limits.min) break;
      if (primaryDomains.some((entry) => entry.key === key)) continue;
      primaryDomains.push({
        ...finalizeDomain(createDomainEntry(key)),
        summary: "当前阶段在这一领域存在基础主题，但仍需结合现实情况复核。",
        certainty: "background",
      });
    }
  }

  const primaryKeys = new Set(primaryDomains.map((entry) => entry.key));
  return {
    stage: normalizedStage,
    primaryDomains,
    secondaryDomains: sorted.filter((entry) => !primaryKeys.has(entry.key)).slice(0, normalizedStage === "luck" ? 3 : 2),
    hasCurrentLayerSignal: primaryDomains.some((entry) => entry.currentLayerEvidenceCount > 0),
    stableContinuation: normalizedStage === "month" && !primaryDomains.some((entry) => entry.currentLayerEvidenceCount > 0),
  };
}

export function renderStageFixedReportMarkdown(model = {}) {
  if (!model?.sections?.length) return "";
  const target = [model?.target?.label, model?.target?.ganZhi].filter(Boolean).join(" · ");
  return [
    target ? `# ${target}` : "",
    ...model.sections.flatMap((section) => [
      `## ${section.title}`,
      section.summary || "",
      ...array(section.items).map((item) => `- ${item}`),
      "",
    ]),
  ].filter((line, index, all) => line !== "" || (index > 0 && all[index - 1] !== "")).join("\n").trim();
}

function buildSections(payload) {
  const {
    stage, headline, overview, contextSummary, mechanism, primaryDomains,
    secondaryDomains, opportunities, pressures, actions, verificationQuestions,
  } = payload;
  const sections = {
    stageSummary: { summary: headline, items: [overview] },
    natalReception: { summary: contextSummary, items: [] },
    mechanism: { summary: mechanism.summary, items: mechanism.structures },
    primaryDomains: {
      summary: primaryDomains.length
        ? `本阶段优先观察：${primaryDomains.map((entry) => entry.label).join("、")}。`
        : "当前层没有足够强的新增显像，以背景延续和现实反馈为主。",
      items: primaryDomains.map((entry) => `${entry.label}：${entry.summary}`),
    },
    rhythm: { summary: rhythmSummary(stage), items: actions },
    gainsAndCosts: {
      summary: opportunities.length || pressures.length
        ? "同一股力量通常同时带来可利用方向与现实代价。"
        : "当前证据更适合观察，不宜预设吉凶。",
      items: [
        ...opportunities.map((item) => `可利用：${item}`),
        ...pressures.map((item) => `需控制：${item}`),
      ],
    },
    verification: { summary: "以下问题用于确认候选象是否真正落到现实。", items: verificationQuestions },
  };
  if (stage === "luck" && secondaryDomains.length) {
    sections.primaryDomains.items.push(...secondaryDomains.map((entry) => `次要观察｜${entry.label}：${entry.summary}`));
  }
  return SECTION_TITLES[stage].map(([key, title]) => ({
    key,
    title,
    summary: sections[key]?.summary ?? "",
    items: unique(sections[key]?.items ?? []).slice(0, stage === "luck" ? 6 : 4),
  }));
}

function buildHeadline(stage, target, primary, domains) {
  const targetText = target.ganZhi || target.label || STAGE_LABELS[stage];
  const primaryText = primary?.tenGod || primary?.label || "阶段主线";
  const domainText = domains.map((entry) => entry.label).slice(0, 2).join("、");
  if (stage === "luck") return `${targetText}大运的主线是${primaryText}逐步进入现实，重点落在${domainText || "个人选择与现实承接"}。`;
  if (stage === "year") return `${targetText}流年在当前大运中放大${primaryText}，今年最值得观察${domainText || "新增作用与现实调整"}。`;
  return `${targetText}流月是短期执行层，${primaryText}在${domainText || "具体事务"}上更容易集中显现。`;
}

function buildOverview(stage, primary, supporting, domains, structures) {
  const p = primary?.summary || primary?.trigger || "外显主题需要结合事实复核";
  const s = supporting?.summary || supporting?.trigger || "现实承接仍需观察";
  const d = domains.map((entry) => entry.label).join("、");
  const st = structures.length ? `当前最强结构为${structures.slice(0, 2).join("；")}。` : "";
  if (stage === "luck") return `这步运不是单一十神的十年，而是${p}，并由${s}承接。${d ? `长期重点集中在${d}。` : ""}${st}`;
  if (stage === "year") return `今年需要放在大运背景中看：${p}，现实层由${s}承接。${d ? `年度显像主要落在${d}。` : ""}${st}`;
  return `本月只看年度背景上的新增触发：${p}，现实执行由${s}承接。${d ? `短期落点主要是${d}。` : ""}${st}`;
}

function buildContextSummary(stage, item, viewModel) {
  const natal = array(viewModel?.pillars).map((p) => p?.ganZhi || p?.label).filter(Boolean).join(" ");
  if (stage === "luck") return `${natal ? `原局为${natal}。` : ""}大运只决定十年背景，需观察它怎样持续引动原局已有结构。`;
  if (stage === "year") return `今年必须放在${item?.currentLuckItem?.ganZhi || "当前大运"}中理解：大运提供背景，流年负责新增触发与年度落点。`;
  return `本月承接${item?.currentLuckItem?.ganZhi || "当前大运"}与${item?.yearItem?.ganZhi || "当前流年"}的既有主线，只解释短期执行、调整和落点。`;
}

function rhythmSummary(stage) {
  if (stage === "luck") return "大运按进入、持续、退出理解；具体年份仍需由流年触发，固定报告不虚构十年中的精确分段。";
  if (stage === "year") return "今年适合顺着最强主线推进，证据不足的领域保持观察；具体月份留给流月页面。";
  return "流月篇幅应短，重点是本月推进、调整、收尾或观察，不上升为长期人生结论。";
}

function enrichDomains(domains, rules) {
  return domains.map((domain) => {
    const related = rules.filter((rule) => array(rule.domains).map(normalizeDomain).includes(domain.key));
    return {
      ...domain,
      ruleIds: related.map((rule) => rule.id).slice(0, 6),
      ruleTitles: related.map((rule) => rule.title).slice(0, 4),
      summary: domain.summary || related.flatMap((rule) => rule.imagery?.core ?? [])[0] || "当前阶段在这一领域存在值得复核的主题。",
      actions: unique([...domain.actions, ...related.flatMap((rule) => rule.advice ?? [])]).slice(0, 3),
      realityChecks: unique([...domain.realityChecks, ...related.flatMap((rule) => rule.imagery?.realityChecks ?? [])]).slice(0, 3),
    };
  });
}

function collectFacts(item) {
  return array(item?.transitStructure?.facts).map((fact) => ({
    id: fact?.id ?? "",
    label: fact?.label ?? "",
    text: fact?.text ?? "",
    category: fact?.category ?? "",
    status: fact?.status ?? "",
    strength: Number(fact?.strength || 0),
  })).sort((a, b) => b.strength - a.strength).slice(0, 20);
}

function annotate(value, weight) { return array(value).filter(Boolean).map((thread) => ({ ...thread, _weight: weight })); }
function isCurrentLayer(thread, stage) {
  return [stage, "current"].includes(String(thread?.sourceLevel || "").toLowerCase()) ||
    String(thread?.status || "").toLowerCase() === "direct" ||
    String(thread?.certainty || "").toLowerCase() === "direct";
}
function createDomainEntry(key) {
  return {
    key,
    label: DOMAIN_LABELS[key] || key,
    score: 0,
    currentLayerEvidenceCount: 0,
    threadCount: 0,
    summaries: [],
    possibleScenes: [],
    usefulDirections: [],
    pressureSignals: [],
    realityChecks: [],
    actions: [],
    evidenceRefs: [],
  };
}
function finalizeDomain(entry) {
  return {
    key: entry.key,
    label: entry.label,
    score: Math.round(entry.score * 10) / 10,
    currentLayerEvidenceCount: entry.currentLayerEvidenceCount,
    threadCount: entry.threadCount,
    summary: unique(entry.summaries)[0] || "当前阶段在这一领域存在值得观察的主题。",
    possibleScenes: unique(entry.possibleScenes).slice(0, 4),
    usefulDirections: unique(entry.usefulDirections).slice(0, 3),
    pressureSignals: unique(entry.pressureSignals).slice(0, 3),
    realityChecks: unique(entry.realityChecks).slice(0, 3),
    actions: unique(entry.usefulDirections).slice(0, 3),
    evidenceRefs: unique(entry.evidenceRefs).slice(0, 10),
    certainty: entry.currentLayerEvidenceCount > 0 ? "current" : "background",
  };
}
function buildTarget(stage, item) {
  if (stage === "luck") return { label: item?.ageRange || item?.yearRange || "当前大运", ganZhi: item?.ganZhi || "", ageRange: item?.ageRange || "", yearRange: item?.yearRange || "" };
  if (stage === "year") return { label: item?.year ? `${item.year}年` : "当前流年", ganZhi: item?.ganZhi || "", year: Number(item?.year) || null };
  return { label: [item?.year ? `${item.year}年` : "", item?.flowMonthLabel || "", item?.dateRangeLabel || ""].filter(Boolean).join(" "), ganZhi: item?.ganZhi || "", year: Number(item?.year) || null, month: Number(item?.month || item?.flowMonthIndex) || null };
}
function compactTheme(theme) {
  if (!theme || typeof theme !== "object") return null;
  return { tenGod: theme.tenGod || "", label: theme.label || "", summary: theme.summary || "", trigger: theme.trigger || "", sourceLevel: theme.sourceLevel || "", evidenceRefs: unique(theme.evidenceRefs) };
}
function normalizeDomain(value) {
  const key = String(value || "").trim();
  if (key === "health_state") return "health";
  if (key === "fortune") return "general";
  return key;
}
function array(value) { return Array.isArray(value) ? value : value == null ? [] : [value]; }
function unique(value) { return [...new Set(array(value).filter(Boolean))]; }
