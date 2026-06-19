export function buildRuleTiming(rule = {}, context = {}, matchedFacts = []) {
  if (!rule.timing) return [];
  const timing = { ...rule.timing };
  if (Array.isArray(timing.windows) && timing.windows.includes("matchedMonths")) {
    timing.matchedMonths = matchedMonths(context, matchedFacts);
  }
  return timing;
}

function matchedMonths(context = {}, matchedFacts = []) {
  const relationFacts = matchedFacts.filter((fact) => fact.type === "relation");
  const targetBranches = relationFacts
    .map((fact) => fact.target === "dayBranch" ? context.chart?.pillars?.day?.branch : context.chart?.pillars?.month?.branch)
    .filter(Boolean);
  return (context.monthInfluences ?? [])
    .filter((month) => targetBranches.includes(month.pillar?.branch))
    .map((month) => ({
      month: month.month,
      pillar: month.pillar?.label,
      reason: "流月地支再次触发规则关注宫位。",
    }))
    .slice(0, 6);
}
