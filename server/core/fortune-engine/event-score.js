import { clamp, loadFortuneRules, tagRuleMatches, unique } from "./rule-data.js";

const scoreKeys = ["career", "wealth", "relationship", "study", "health", "movement", "social"];

export function calculateEventScores({ triggerChains = [], monthlyHighlights = [], natalSignature, decadeAnalysis, rules = loadFortuneRules() } = {}) {
  return Object.fromEntries(scoreKeys.map((key) => [key, scoreEvent(key, { triggerChains, monthlyHighlights, natalSignature, decadeAnalysis, rules })]));
}

function scoreEvent(key, { triggerChains, monthlyHighlights, natalSignature, decadeAnalysis, rules }) {
  const eventRule = rules.eventTags.find((rule) => rule.tags.includes(key));
  const chains = triggerChains.filter((chain) => tagRuleMatches(eventRule, chain.tags) || chain.tags?.includes(key));
  const monthHits = monthlyHighlights.filter((month) => chains.some((chain) => month.triggerLinks?.includes(chain.id)));
  const base = chains.reduce((sum, chain) => sum + Number(chain.weight || 0), 0);
  const monthBoost = monthHits.reduce((sum, month) => sum + (month.intensity === "high" ? 6 : month.intensity === "medium" ? 3 : 1), 0);
  const decadeBoost = decadeAnalysis?.decadeRiskTags?.includes(key) ? 4 : 0;
  const natalBoost = natalSignature?.natalTags?.some((tag) => eventRule?.realityMapping?.includes(tag)) ? 2 : 0;
  const score = clamp(20 + base * 5 + monthBoost + decadeBoost + natalBoost);
  const evidence = unique([
    ...(chains.length ? chains.slice(0, 4).map((chain) => chain.reason) : [`暂未出现直接触发链，先按原局与大运保留低强度观察。`]),
    ...(monthHits.length ? monthHits.slice(0, 3).map((month) => `${month.month}月${month.pillar}为${month.intensity}触发：${month.reasons.join("；")}`) : []),
    eventRule?.explanation,
  ]);
  return {
    score,
    label: key,
    evidence,
    realityMapping: eventRule?.realityMapping,
    caution: eventRule?.caution,
  };
}
