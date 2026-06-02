export function matchRules(rules = [], context = {}) {
  return rules.filter((rule) => matchesRule(rule, context)).map((rule) => ({
    id: rule.id,
    topic: rule.topic,
    tag: rule.tag,
    title: rule.title,
    evidence: buildEvidence(rule, context),
    confidence: rule.confidence ?? "medium",
    needVerify: rule.needVerify ?? ["需要结合更多本地证据复核。"],
  }));
}

function matchesRule(rule, context) {
  const when = rule.when ?? {};
  if (when.dayElement && context.chart?.dayMaster?.element !== when.dayElement) return false;
  if (when.yearTenGod && !Object.values(context.yearInfluence?.tenGods ?? {}).includes(when.yearTenGod)) return false;
  if (when.monthRole && !context.monthInfluences?.some((month) => month.role === when.monthRole)) return false;
  if (when.dominantElement && !context.chart?.dominantElements?.some((item) => item.element === when.dominantElement)) return false;
  return true;
}

function buildEvidence(rule, context) {
  const evidence = [];
  if (rule.when?.dayElement) evidence.push(`日主五行：${context.chart?.dayMaster?.element}`);
  if (rule.when?.yearTenGod) evidence.push(`流年十神：${Object.values(context.yearInfluence?.tenGods ?? {}).join("、")}`);
  if (rule.when?.monthRole) evidence.push(`流月角色：${rule.when.monthRole}`);
  if (rule.when?.dominantElement) evidence.push(`突出五行：${context.chart?.dominantElements?.map((item) => item.element).join("、")}`);
  return evidence.length ? evidence : [rule.title ?? rule.id];
}
