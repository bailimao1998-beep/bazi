import { analyzeMonthlyWindows } from "./analyzeMonthlyWindows.js";
import { buildTriggerChains } from "./buildTriggerChains.js";
import { eventTaxonomy, unique } from "./eventTaxonomy.js";
import { scoreEventCandidates } from "./scoreEventCandidates.js";

export function buildAnnualEventReport({ chart, selectedLuck, yearInfluence, monthInfluences = [], matchedRules = [] } = {}) {
  const triggerChains = buildTriggerChains({ chart, selectedLuck, yearInfluence, monthInfluences });
  const scored = scoreEventCandidates({ triggerChains, chart, selectedLuck, yearInfluence, monthInfluences, matchedRules });
  const monthlyHighlights = analyzeMonthlyWindows({
    triggerChains,
    monthInfluences,
    mainEvents: scored.mainEvents,
    eventCandidates: scored.eventCandidates,
  });
  const withTiming = (event) => ({
    ...event,
    timing: event.timing?.length ? event.timing : timingFromHighlights(monthlyHighlights, event.eventType),
  });
  const mainEvents = scored.mainEvents.map(withTiming);
  const parallelEvents = scored.parallelEvents.map(withTiming);
  const annualTheme = buildAnnualTheme({ yearInfluence, mainEvents });
  const luckBackground = buildLuckBackground({ selectedLuck, triggerChains });
  const annualChains = triggerChains.filter((chain) => !String(chain.level || "").startsWith("month-"));
  const luckChains = annualChains.filter((chain) => chain.level === "luck-natal" || chain.level === "luck-year");
  const monthChains = triggerChains.filter((chain) => String(chain.level || "").startsWith("month-"));
  const yearAnalysis = {
    year: yearInfluence?.year,
    selectedLuck,
    annualTheme,
    overallSummary: buildOverallSummary({ yearInfluence, selectedLuck, mainEvents, triggerChains: annualChains, monthlyHighlights: [] }),
    luckBackground,
    triggerChains: annualChains,
    eventCandidates: scored.eventCandidates,
    mainEvents,
    parallelEvents,
    monthlyHighlights: [],
    lowEvidenceTopics: scored.lowEvidenceTopics,
    eventScores: scored.eventScores,
    advice: buildAdvice(mainEvents),
    debug: {
      engine: "annual-fortune-event-engine",
      layer: "yearAnalysis",
      triggerChainCount: annualChains.length,
      mainEventCount: mainEvents.length,
      ruleV2MatchCount: countRuleV2Matches(matchedRules),
    },
  };
  const luckAnalysis = {
    year: yearInfluence?.year,
    selectedLuck,
    annualTheme: selectedLuck?.label ? `${selectedLuck.label}大运阶段背景` : "大运阶段背景",
    overallSummary: luckBackground.conclusion,
    luckBackground,
    triggerChains: luckChains,
    eventCandidates: [],
    mainEvents: [],
    parallelEvents: [],
    monthlyHighlights: [],
    lowEvidenceTopics: [],
    eventScores: {},
    advice: ["大运只看阶段背景，不直接断某一年结果。"],
    debug: {
      engine: "annual-fortune-event-engine",
      layer: "luckAnalysis",
      triggerChainCount: luckChains.length,
      ruleV2MatchCount: countRuleV2Matches(matchedRules),
    },
  };
  const monthAnalysis = {
    year: yearInfluence?.year,
    selectedLuck,
    annualTheme: `${yearInfluence?.year ?? ""}年流月应期观察`,
    overallSummary: "流月层只用于短期应期观察，不替代年度主事件。",
    luckBackground,
    triggerChains: monthChains,
    eventCandidates: scored.eventCandidates,
    mainEvents,
    parallelEvents,
    monthlyHighlights,
    lowEvidenceTopics: scored.lowEvidenceTopics,
    eventScores: scored.eventScores,
    advice: ["流月只判断短期应期，不代表全年。"],
    debug: {
      engine: "annual-fortune-event-engine",
      layer: "monthAnalysis",
      triggerChainCount: monthChains.length,
      monthlyHighlightCount: monthlyHighlights.length,
      ruleV2MatchCount: countRuleV2Matches(matchedRules),
    },
  };

  return {
    luckAnalysis,
    yearAnalysis,
    monthAnalysis,
    year: yearInfluence?.year,
    selectedLuck,
    annualTheme,
    overallSummary: buildOverallSummary({ yearInfluence, selectedLuck, mainEvents, triggerChains, monthlyHighlights }),
    luckBackground,
    triggerChains,
    eventCandidates: scored.eventCandidates,
    mainEvents,
    parallelEvents,
    monthlyHighlights,
    lowEvidenceTopics: scored.lowEvidenceTopics,
    eventScores: scored.eventScores,
    advice: buildAdvice(mainEvents),
    debug: {
      engine: "annual-fortune-event-engine",
      triggerChainCount: triggerChains.length,
      eventCandidateCount: scored.eventCandidates.length,
      mainEventCount: mainEvents.length,
      monthlyHighlightCount: monthlyHighlights.length,
      ruleV2MatchCount: countRuleV2Matches(matchedRules),
    },
  };
}

function countRuleV2Matches(matchedRules = []) {
  return (Array.isArray(matchedRules) ? matchedRules : []).filter((rule) => rule?.version === "rule-v2").length;
}

function buildAnnualTheme({ yearInfluence, mainEvents }) {
  const labels = mainEvents.map((event) => eventTaxonomy[event.eventType]?.label).filter(Boolean);
  if (labels.length) return `${yearInfluence?.year ?? ""}年重点候选：${labels.join("、")}`;
  return `${yearInfluence?.year ?? ""}年暂未形成高强度事件候选，先看有证据的低强度主题。`;
}

function buildLuckBackground({ selectedLuck, triggerChains }) {
  const luckChains = triggerChains.filter((chain) => chain.level === "luck-natal" || chain.level === "luck-year");
  const evidence = unique(luckChains.map((chain) => chain.evidence)).slice(0, 5);
  return {
    conclusion: selectedLuck?.label
      ? `大运${selectedLuck.label}作为阶段背景，先看它与原局、流年的承接关系。`
      : "未选中大运时，只保留年度触发链观察。",
    evidence: evidence.length ? evidence : ["当前报告优先使用年度和月度触发链。"],
    reality: "大运只作为十年背景，不直接替代年度事件判断；事件仍以当年触发链和流月窗口为准。",
  };
}

function buildOverallSummary({ yearInfluence, selectedLuck, mainEvents, triggerChains, monthlyHighlights }) {
  const eventText = mainEvents.length
    ? mainEvents.map((event) => `${eventTaxonomy[event.eventType]?.label}为${event.level}`).join("；")
    : "暂未出现高强度主事件";
  const evidence = triggerChains.slice(0, 3).map((chain) => chain.evidence).join("；");
  const months = monthlyHighlights.map((month) => `${month.month}月`).join("、") || "后续流月";
  return [
    `结论：${yearInfluence?.year ?? ""}年先看${eventText}。`,
    `命理依据：原局接大运${selectedLuck?.label ?? "未选"}，再由流年${yearInfluence?.pillar?.label ?? ""}触发；${evidence}`,
    `现实表现：重点观察${mainEvents.flatMap((event) => event.possibleManifestations).slice(0, 4).join("、") || "职责、资源、关系、迁动和作息复核"}。`,
    `时间点：优先看${months}是否出现具体反馈。`,
    "边界：本地事件引擎只输出候选事件和证据链，需要结合现实反馈复核，不能单独作为结论。",
  ].join("\n");
}

function buildAdvice(mainEvents = []) {
  const advice = mainEvents.map((event) => eventTaxonomy[event.eventType]?.advice).filter(Boolean);
  return unique(advice).slice(0, 4);
}

function timingFromHighlights(monthlyHighlights = [], eventType) {
  const rows = monthlyHighlights
    .filter((month) => month.eventTypes?.includes(eventType))
    .map((month) => `${month.month}月${month.pillar}：${month.level}触发，${month.reasons?.[0] || "看现实反馈"}`);
  return rows.length ? rows : ["全年观察，等流月继续触发时再确认应期。"];
}
