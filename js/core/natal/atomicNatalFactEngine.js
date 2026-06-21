import { atomicNatalRules } from "./atomicNatalRuleDatabase.js";

export function buildAtomicNatalFacts(featureVector = {}) {
  const facts = atomicNatalRules
    .filter((rule) => safeCall(() => rule.match(featureVector), false))
    .map((rule) => {
      const built = safeCall(() => rule.buildFact(featureVector), null) ?? {};
      const score = Number.isFinite(rule.score?.(featureVector))
        ? Number(rule.score(featureVector))
        : Number(built.score ?? 50);
      return {
        polarity: "mixed",
        specificity: "medium",
        evidence: [],
        domains: [],
        tags: [],
        ...built,
        id: built.id || rule.id,
        category: built.category || rule.category || "structure",
        role: built.role || rule.role || "support",
        score,
        domains: [...new Set([...(built.domains ?? []), ...(rule.domains ?? [])])],
      };
    })
    .filter((fact) => fact.id && fact.label)
    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));

  return {
    facts,
    byDomain: groupByDomain(facts),
    byCategory: groupByCategory(facts),
  };
}

function groupByDomain(facts = []) {
  const result = {};
  for (const fact of facts) {
    for (const domain of fact.domains ?? []) {
      if (!result[domain]) result[domain] = [];
      result[domain].push(fact);
    }
  }
  return result;
}

function groupByCategory(facts = []) {
  const result = {};
  for (const fact of facts) {
    const category = fact.category || "structure";
    if (!result[category]) result[category] = [];
    result[category].push(fact);
  }
  return result;
}

function safeCall(fn, fallback) {
  try {
    return fn();
  } catch {
    return fallback;
  }
}
