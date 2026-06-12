export function buildRuleEvidence(rule = {}, context = {}, matchedFacts = []) {
  const templates = Array.isArray(rule.evidence?.templates) ? rule.evidence.templates : [];
  if (templates.length) {
    return templates.map((template) => fillTemplate(template, context, matchedFacts)).filter(Boolean);
  }
  if (Array.isArray(rule.evidence)) return rule.evidence.map((item) => String(item));
  if (typeof rule.evidence === "string") return [rule.evidence];
  return buildLegacyEvidence(rule, context);
}

function buildLegacyEvidence(rule, context) {
  const evidence = [];
  if (rule.when?.dayElement) evidence.push(`日主五行：${context.chart?.dayMaster?.element}`);
  if (rule.when?.yearTenGod) evidence.push(`流年十神：${Object.values(context.yearInfluence?.tenGods ?? {}).join("、")}`);
  if (rule.when?.monthRole) evidence.push(`流月角色：${rule.when.monthRole}`);
  if (rule.when?.dominantElement) evidence.push(`突出五行：${context.chart?.dominantElements?.map((item) => item.element).join("、")}`);
  return evidence.length ? evidence : [rule.title ?? rule.id];
}

function fillTemplate(template = "", context = {}, matchedFacts = []) {
  const relationFact = matchedFacts.find((fact) => fact.type === "relation") ?? {};
  const tenGodFact = matchedFacts.find((fact) => fact.type === "tenGod") ?? {};
  return String(template)
    .replaceAll("{yearPillar}", context.yearInfluence?.pillar?.label ?? "")
    .replaceAll("{luckPillar}", context.selectedLuck?.label ?? "")
    .replaceAll("{monthPillar}", context.selectedMonthInfluence?.pillar?.label ?? "")
    .replaceAll("{dayBranch}", context.chart?.pillars?.day?.branch ?? "")
    .replaceAll("{monthBranch}", context.chart?.pillars?.month?.branch ?? "")
    .replaceAll("{relation}", relationFact.relation ?? "")
    .replaceAll("{tenGod}", tenGodFact.value ?? "")
    .replaceAll("{yearTenGod}", context.yearInfluence?.tenGods?.stem ?? "")
    .trim();
}
