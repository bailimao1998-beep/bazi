import { eventTaxonomy, scoreLevel, unique } from "./eventTaxonomy.js";

export function analyzeMonthlyWindows({ triggerChains = [], monthInfluences = [], mainEvents = [], eventCandidates = [] } = {}) {
  const focusEvents = mainEvents.length ? mainEvents : eventCandidates.filter((event) => event.score >= 30).slice(0, 3);
  const focusTypes = focusEvents.map((event) => event.eventType);
  const monthRows = monthInfluences.map((month) => {
    const monthChains = triggerChains.filter((chain) => Number(chain.metadata?.month) === Number(month.month));
    const matchedChains = focusTypes.length
      ? monthChains.filter((chain) => chain.topicHints?.some((hint) => focusTypes.includes(hint)))
      : monthChains;
    const score = matchedChains.reduce((sum, chain) => sum + Number(chain.strength || 0), 0)
      + new Set(matchedChains.map((chain) => chain.level)).size * 4;
    const level = score >= 75 ? "high" : score >= 45 ? "medium" : score >= 25 ? "low" : "none";
    return {
      month: Number(month.month),
      pillar: month.pillar?.label || "",
      level,
      intensity: level,
      score: Math.round(score),
      eventTypes: unique(matchedChains.flatMap((chain) => chain.topicHints || []).filter((hint) => !focusTypes.length || focusTypes.includes(hint))),
      reasons: unique(matchedChains.map((chain) => chain.evidence)).slice(0, 5),
      evidence: unique(matchedChains.map((chain) => chain.evidence)).slice(0, 5),
      realityMapping: buildMonthReality(matchedChains),
      triggerLinks: matchedChains.map((chain) => chain.id),
      debug: { chainCount: monthChains.length, matchedChainCount: matchedChains.length },
    };
  }).filter((row) => row.level !== "none" && row.reasons.length > 0)
    .sort((a, b) => b.score - a.score || a.month - b.month)
    .slice(0, 5);

  return monthRows.sort((a, b) => a.month - b.month);
}

function buildMonthReality(chains = []) {
  const eventTypes = unique(chains.flatMap((chain) => chain.topicHints || []));
  const labels = eventTypes.map((type) => eventTaxonomy[type]?.label).filter(Boolean);
  const realities = unique(chains.map((chain) => chain.realityMapping)).slice(0, 3);
  if (!labels.length && !realities.length) return "本月只保留低强度观察。";
  return `本月明显处在${labels.join("、") || "相关主题"}窗口；现实中看${realities.join("；") || "安排是否出现反馈"}。`;
}

