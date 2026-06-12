import { getPillarRelations } from "../fortune/relationUtils.js";

export function matchCondition(condition = {}, context = {}) {
  const all = normalizeList(condition.all);
  const any = normalizeList(condition.any);
  const allFacts = [];
  for (const item of all) {
    const result = matchConditionItem(item, context);
    if (!result.matched) return { matched: false, matchedFacts: [] };
    allFacts.push(...result.facts);
  }
  const anyResults = any.map((item) => matchConditionItem(item, context));
  const anyMatched = any.length === 0 || anyResults.some((result) => result.matched);
  if (!anyMatched) return { matched: false, matchedFacts: [] };
  return {
    matched: true,
    matchedFacts: [
      ...allFacts,
      ...anyResults.filter((result) => result.matched).flatMap((result) => result.facts),
    ],
  };
}

function matchConditionItem(item = {}, context = {}) {
  if (item.type === "relation") return matchRelationCondition(item, context);
  if (item.type === "tenGod") return matchTenGodCondition(item, context);
  if (item.type === "monthRole") return matchMonthRoleCondition(item, context);
  if (item.type === "dominantElement") return matchDominantElementCondition(item, context);
  return { matched: false, facts: [] };
}

function matchRelationCondition(item, context) {
  const source = resolvePillarSource(item.source, context);
  const target = resolvePillarTarget(item.target, context);
  const allowed = normalizeList(item.relation);
  if (!source || !target || !allowed.length) return { matched: false, facts: [] };
  const facts = getPillarRelations(source.pillar, target.pillar)
    .filter((relation) => allowed.includes(relation.type))
    .map((relation) => ({
      type: "relation",
      source: item.source,
      sourceLabel: source.label,
      target: item.target,
      targetLabel: target.label,
      relation: relation.type,
      strength: relation.strength,
      reality: relation.reality,
    }));
  return { matched: facts.length > 0, facts };
}

function matchTenGodCondition(item, context) {
  const resolved = resolveTenGodSource(item.source, context);
  const values = normalizeList(item.value);
  const facts = resolved
    .filter((fact) => values.includes(fact.value))
    .map((fact) => ({ type: "tenGod", source: item.source, ...fact }));
  return { matched: facts.length > 0, facts };
}

function matchMonthRoleCondition(item, context) {
  const values = normalizeList(item.value);
  const facts = normalizeList(context.monthInfluences)
    .filter((month) => values.includes(month.role))
    .map((month) => ({
      type: "monthRole",
      source: "monthInfluences",
      month: month.month,
      pillar: month.pillar?.label,
      value: month.role,
    }));
  return { matched: facts.length > 0, facts };
}

function matchDominantElementCondition(item, context) {
  const values = normalizeList(item.value);
  const facts = normalizeList(context.chart?.dominantElements)
    .filter((element) => values.includes(element.element))
    .map((element) => ({
      type: "dominantElement",
      source: "chart",
      value: element.element,
      count: element.count,
    }));
  return { matched: facts.length > 0, facts };
}

function resolvePillarSource(source, context) {
  if (source === "year") return normalizePillarContext(context.yearInfluence?.pillar, "流年");
  if (source === "luck") return normalizePillarContext(context.selectedLuck, "大运");
  if (source === "month") return normalizePillarContext(context.selectedMonthInfluence?.pillar, "流月");
  return normalizePillarContext(context.chart?.pillars?.[source], source);
}

function resolvePillarTarget(target, context) {
  if (target === "dayBranch") return normalizeBranchTarget(context.chart?.pillars?.day?.branch, "日支");
  if (target === "monthBranch") return normalizeBranchTarget(context.chart?.pillars?.month?.branch, "月支");
  if (target === "day") return normalizePillarContext(context.chart?.pillars?.day, "日柱");
  if (target === "month") return normalizePillarContext(context.chart?.pillars?.month, "月柱");
  return normalizePillarContext(context.chart?.pillars?.[target], target);
}

function resolveTenGodSource(source, context) {
  if (source === "yearStem") return [{ part: "stem", value: context.yearInfluence?.tenGods?.stem, pillar: context.yearInfluence?.pillar?.label }];
  if (source === "yearBranch") return [{ part: "branch", value: context.yearInfluence?.tenGods?.branch, pillar: context.yearInfluence?.pillar?.label }];
  if (source === "year") return [
    { part: "stem", value: context.yearInfluence?.tenGods?.stem, pillar: context.yearInfluence?.pillar?.label },
    { part: "branch", value: context.yearInfluence?.tenGods?.branch, pillar: context.yearInfluence?.pillar?.label },
  ];
  if (source === "luckStem") return [{ part: "stem", value: context.selectedLuck?.tenGods?.stem, pillar: context.selectedLuck?.label }];
  if (source === "luckBranch") return [{ part: "branch", value: context.selectedLuck?.tenGods?.branch, pillar: context.selectedLuck?.label }];
  if (source === "luck") return [
    { part: "stem", value: context.selectedLuck?.tenGods?.stem, pillar: context.selectedLuck?.label },
    { part: "branch", value: context.selectedLuck?.tenGods?.branch, pillar: context.selectedLuck?.label },
  ];
  if (source === "month") {
    return normalizeList(context.monthInfluences).flatMap((month) => [
      { part: "stem", value: month.tenGods?.stem, pillar: month.pillar?.label, month: month.month },
      { part: "branch", value: month.tenGods?.branch, pillar: month.pillar?.label, month: month.month },
    ]);
  }
  return [];
}

function normalizePillarContext(pillar, fallbackLabel) {
  if (!pillar) return null;
  const label = pillar.label || `${pillar.stem ?? ""}${pillar.branch ?? ""}` || fallbackLabel;
  return {
    label,
    pillar: {
      ...pillar,
      label,
      stem: pillar.stem || label.slice(0, 1),
      branch: pillar.branch || label.slice(1, 2),
    },
  };
}

function normalizeBranchTarget(branch, label) {
  if (!branch) return null;
  return { label: `${label}${branch}`, pillar: { label: branch, branch } };
}

function normalizeList(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}
