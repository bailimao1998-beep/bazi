export function getRuleEvidenceBoost(matchedRules = [], topic) {
  const rules = (Array.isArray(matchedRules) ? matchedRules : [])
    .filter((rule) => rule?.version === "rule-v2")
    .filter((rule) => rule.topic === topic)
    .filter((rule) => Number(rule.score || 0) >= 50)
    .sort((left, right) => Number(right.score || 0) - Number(left.score || 0))
    .slice(0, 3);
  const evidence = rules.map((rule) => {
    const evidenceText = normalizeList(rule.evidence).slice(0, 2).join("；");
    return `规则补强：${rule.title ?? rule.id}｜${evidenceText}`;
  });
  const counterEvidence = unique(rules.flatMap((rule) => normalizeList(rule.counterEvidence)));
  return {
    boostScore: Math.min(20, rules.reduce((sum, rule) => sum + boostFromScore(rule.score), 0)),
    evidence,
    counterEvidence,
    rules: rules.map((rule) => ({
      id: rule.id,
      title: rule.title,
      score: rule.score,
      evidence: normalizeList(rule.evidence).slice(0, 2),
      counterEvidence: normalizeList(rule.counterEvidence).slice(0, 2),
    })),
  };
}

function boostFromScore(score) {
  const value = Number(score || 0);
  if (value >= 85) return 15;
  if (value >= 70) return 12;
  if (value >= 50) return 8;
  return 0;
}

function normalizeList(value) {
  if (!value) return [];
  return (Array.isArray(value) ? value : [value]).map((item) => String(item ?? "").trim()).filter(Boolean);
}

function unique(items = []) {
  return [...new Set(items.filter(Boolean))];
}
