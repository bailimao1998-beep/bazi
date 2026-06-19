import { matchCondition } from "./conditionMatcher.js";
import { normalizeRuleMatch } from "./normalizeRuleMatch.js";

export function matchRules(rules = [], context = {}) {
  return rules.flatMap((rule) => {
    if (rule.condition) {
      const result = matchCondition(rule.condition, context);
      if (!result.matched) return [];
      return [normalizeRuleMatch({
        rule,
        context,
        matchedFacts: result.matchedFacts,
        conditionMatched: true,
        version: "rule-v2",
      })];
    }
    if (!matchesRule(rule, context)) return [];
    return [normalizeRuleMatch({
      rule,
      context,
      matchedFacts: buildLegacyMatchedFacts(rule, context),
      version: "legacy-v1",
    })];
  });
}

function matchesRule(rule, context) {
  const when = rule.when ?? {};
  if (when.dayElement && context.chart?.dayMaster?.element !== when.dayElement) return false;
  if (when.yearTenGod && !Object.values(context.yearInfluence?.tenGods ?? {}).includes(when.yearTenGod)) return false;
  if (when.monthRole && !context.monthInfluences?.some((month) => month.role === when.monthRole)) return false;
  if (when.dominantElement && !context.chart?.dominantElements?.some((item) => item.element === when.dominantElement)) return false;
  return true;
}

function buildLegacyMatchedFacts(rule, context) {
  const facts = [];
  if (rule.when?.dayElement) facts.push({ type: "dayElement", source: "chart", value: context.chart?.dayMaster?.element });
  if (rule.when?.yearTenGod) facts.push({ type: "tenGod", source: "year", value: rule.when.yearTenGod });
  if (rule.when?.monthRole) facts.push({ type: "monthRole", source: "monthInfluences", value: rule.when.monthRole });
  if (rule.when?.dominantElement) facts.push({ type: "dominantElement", source: "chart", value: rule.when.dominantElement });
  return facts;
}
