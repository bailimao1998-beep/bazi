export function buildCounterEvidence(rule = {}) {
  if (Array.isArray(rule.counterEvidence)) return rule.counterEvidence.map((item) => String(item));
  if (typeof rule.counterEvidence === "string") return [rule.counterEvidence];
  return [];
}
