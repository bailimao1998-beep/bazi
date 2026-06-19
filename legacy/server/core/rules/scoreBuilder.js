export function buildRuleScore(rule = {}, matchedFacts = [], context = {}) {
  const scoreConfig = rule.score;
  if (!scoreConfig) {
    return { score: 0, scoreDetail: { base: 0, boost: [], reduce: [] } };
  }
  const base = Number(scoreConfig.base ?? 0);
  const boost = applyScoreItems(scoreConfig.boost, matchedFacts, context);
  const reduce = applyScoreItems(scoreConfig.reduce, matchedFacts, context);
  const score = clampScore(base + sumValues(boost) + sumValues(reduce));
  return {
    score,
    scoreDetail: { base, boost, reduce },
  };
}

function applyScoreItems(items = [], matchedFacts = [], context = {}) {
  return (Array.isArray(items) ? items : [])
    .filter((item) => scoreWhenMatched(item.when, matchedFacts, context))
    .map((item) => ({
      when: item.when,
      value: Number(item.value ?? 0),
      reason: item.reason,
    }));
}

function scoreWhenMatched(when, matchedFacts = [], context = {}) {
  if (when === "targetIsDayBranch") return matchedFacts.some((fact) => fact.type === "relation" && fact.target === "dayBranch");
  if (when === "spouseStarTriggered") return matchedFacts.some((fact) => fact.type === "tenGod" && spouseStars(context.chart?.input?.gender).includes(fact.value));
  if (when === "luckAlsoTriggered") return matchedFacts.some((fact) => String(fact.source || "").startsWith("luck"));
  if (when === "onlyWeakEvidence") return matchedFacts.length <= 1;
  if (when === "careerStarTriggered") return matchedFacts.some((fact) => fact.type === "tenGod" && ["正官", "七杀"].includes(fact.value));
  if (when === "outputStarTriggered") return matchedFacts.some((fact) => fact.type === "tenGod" && ["食神", "伤官"].includes(fact.value));
  if (when === "targetIsMonthBranch") return matchedFacts.some((fact) => fact.type === "relation" && fact.target === "monthBranch");
  return false;
}

function spouseStars(gender) {
  if (gender === "male") return ["正财", "偏财"];
  if (gender === "female") return ["正官", "七杀"];
  return ["正财", "偏财", "正官", "七杀"];
}

function sumValues(items = []) {
  return items.reduce((sum, item) => sum + Number(item.value || 0), 0);
}

function clampScore(value) {
  return Math.max(0, Math.min(100, Number.isFinite(value) ? value : 0));
}
