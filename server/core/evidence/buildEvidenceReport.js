import { eventTaxonomy, unique } from "../fortune/eventTaxonomy.js";

const defaultTiming = "暂无明确流月，应等后续触发复核";
const parallelBoundary = "有证据，但未进入年度主断，需结合现实背景判断是否承接。";

export function buildEvidenceReport({
  selectedLuck,
  yearInfluence,
  annualEventReport = {},
  matchedRules = [],
} = {}) {
  const mainEventCards = buildEventCards(annualEventReport.mainEvents, { role: "main" });
  const parallelEventCards = buildEventCards(annualEventReport.parallelEvents, { role: "parallel" });
  const ruleCards = buildRuleCards(matchedRules);
  const timingCards = buildTimingCards(annualEventReport.monthlyHighlights, ruleCards);
  return {
    summary: {
      year: yearInfluence?.year ?? annualEventReport.year ?? null,
      selectedLuck: selectedLuck?.label ?? selectedLuck ?? null,
      mainEventCount: mainEventCards.length,
      ruleV2Count: ruleCards.filter((rule) => rule.version === "rule-v2").length,
      topTopics: buildTopTopics([...mainEventCards, ...parallelEventCards], ruleCards),
    },
    mainEventCards,
    parallelEventCards,
    ruleCards,
    timingCards,
    reviewQuestions: buildReviewQuestions([...mainEventCards, ...parallelEventCards], ruleCards),
  };
}

function buildEventCards(events = [], { role = "main" } = {}) {
  return normalizeList(events).map((event, index) => {
    const taxonomy = eventTaxonomy[event.eventType] ?? {};
    const reality = normalizeList(event.possibleManifestations);
    const ruleCounterEvidence = normalizeList(event.debug?.ruleEvidence?.counterEvidence);
    return {
      id: `${role}-${event.eventType ?? "event"}-${index + 1}`,
      eventType: event.eventType,
      title: taxonomy.label ?? event.eventType ?? "事件候选",
      level: event.level,
      score: Number(event.score || 0),
      confidence: event.confidence ?? "medium",
      evidence: normalizeList(event.evidenceChain).slice(0, 8),
      reality,
      timing: normalizeList(event.timing).length ? normalizeList(event.timing) : [defaultTiming],
      possibleManifestations: reality,
      verifyBy: role === "parallel" ? [parallelBoundary] : [],
      boundary: role === "parallel"
        ? parallelBoundary
        : ruleCounterEvidence.join("；") || "本地事件引擎只输出候选事件和证据链，需要结合现实反馈复核。",
      debug: event.debug ?? {},
      ...(role === "parallel" ? { role: "副线复核" } : {}),
    };
  });
}

function buildRuleCards(matchedRules = []) {
  return normalizeList(matchedRules)
    .slice()
    .sort((left, right) => {
      const versionDiff = versionRank(right.version) - versionRank(left.version);
      if (versionDiff) return versionDiff;
      return Number(right.score || 0) - Number(left.score || 0);
    })
    .slice(0, 12)
    .map((rule) => ({
      id: rule.id,
      title: rule.title,
      topic: rule.topic,
      source: rule.source,
      version: rule.version ?? "legacy-v1",
      score: Number(rule.score || 0),
      confidence: rule.confidence ?? "medium",
      evidence: normalizeList(rule.evidence).slice(0, 4),
      timing: rule.timing ?? [],
      counterEvidence: normalizeList(rule.counterEvidence).slice(0, 3),
      needVerify: normalizeList(rule.needVerify),
      matchedFacts: normalizeList(rule.matchedFacts),
    }));
}

function buildTimingCards(monthlyHighlights = [], ruleCards = []) {
  const cards = [];
  const seen = new Set();
  for (const month of normalizeList(monthlyHighlights)) {
    pushTimingCard(cards, seen, {
      month: Number(month.month || 0) || null,
      pillar: month.pillar,
      level: month.level ?? month.intensity ?? "medium",
      theme: month.theme ?? month.eventTypes?.join("、") ?? "流月触发",
      evidence: normalizeList(month.reasons ?? month.evidence).slice(0, 4),
      source: "monthlyHighlights",
    });
  }
  for (const rule of ruleCards) {
    for (const month of normalizeList(rule.timing?.matchedMonths)) {
      pushTimingCard(cards, seen, {
        month: Number(month.month || 0) || null,
        pillar: month.pillar,
        level: "medium",
        theme: rule.title ?? rule.topic ?? "规则应期",
        evidence: normalizeList(month.reason ?? rule.evidence).slice(0, 4),
        source: "ruleTiming",
      });
    }
  }
  return cards.slice(0, 12);
}

function pushTimingCard(cards, seen, card) {
  const key = `${card.month ?? ""}-${card.pillar ?? ""}`;
  if (!card.month || seen.has(key)) return;
  seen.add(key);
  cards.push(card);
}

function buildReviewQuestions(eventCards = [], ruleCards = []) {
  const raw = [
    ...eventCards.flatMap((card) => [...normalizeList(card.verifyBy), card.boundary]),
    ...ruleCards.flatMap((rule) => [...normalizeList(rule.needVerify), ...normalizeList(rule.counterEvidence)]),
  ];
  return unique(raw.map(toReviewQuestion).filter(Boolean)).slice(0, 12);
}

function buildTopTopics(eventCards = [], ruleCards = []) {
  const counts = new Map();
  for (const card of eventCards) {
    const topic = eventTaxonomy[card.eventType]?.legacyTopic ?? card.eventType;
    if (topic) counts.set(topic, (counts.get(topic) || 0) + 1);
  }
  for (const rule of ruleCards) {
    if (rule.topic) counts.set(rule.topic, (counts.get(rule.topic) || 0) + 1);
  }
  return [...counts.entries()]
    .sort((left, right) => right[1] - left[1])
    .map(([topic]) => topic)
    .slice(0, 5);
}

function versionRank(version) {
  return version === "rule-v2" ? 2 : 1;
}

function toReviewQuestion(text = "") {
  const value = String(text || "").trim();
  if (!value) return "";
  if (/若|如果/.test(value)) return value.replace(/^若/, "如果").replace(/[。；;]*$/, "？");
  if (/[？?]$/.test(value)) return value;
  return `${value}？`;
}

function normalizeList(value) {
  if (!value) return [];
  return (Array.isArray(value) ? value : [value]).map((item) => typeof item === "string" ? item.trim() : item).filter(Boolean);
}
