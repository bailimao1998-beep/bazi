/**
 * 原局高阶规则评估器。
 *
 * 职责：
 * 1. 读取统一的 featureVector；
 * 2. 检查 all / any / none 条件；
 * 3. 生成结构化规则事实；
 * 4. 保存命中与未命中的调试信息。
 */

export function evaluateNatalRules(
  featureVector = {},
  rules = [],
) {
  const facts = [];
  const debug = [];

  for (const rule of Array.isArray(rules) ? rules : []) {
    const evaluation = evaluateRule(
      featureVector,
      rule,
    );

    debug.push({
      ruleId: rule.id,
      ruleName: resolveValue(
        rule.name,
        featureVector,
        evaluation,
      ),
      matched: evaluation.matched,
      all: evaluation.all,
      any: evaluation.any,
      none: evaluation.none,
      custom: evaluation.custom,
    });

    if (!evaluation.matched) continue;

    const fact = buildRuleFact(
      featureVector,
      rule,
      evaluation,
    );

    if (fact?.id && fact?.name) {
      facts.push(fact);
    }
  }

  return {
    facts,
    debug,
  };
}

function evaluateRule(featureVector, rule = {}) {
  const conditions = rule.conditions ?? {};

  const all = evaluateConditionList(
    featureVector,
    conditions.all,
  );

  const any = evaluateConditionList(
    featureVector,
    conditions.any,
  );

  const none = evaluateConditionList(
    featureVector,
    conditions.none,
  );

  const allPassed =
    all.length === 0 ||
    all.every((item) => item.matched);

  const anyPassed =
    any.length === 0 ||
    any.some((item) => item.matched);

  const nonePassed =
    none.length === 0 ||
    none.every((item) => !item.matched);

  let custom = {
    matched: true,
    label: "",
    actual: null,
    expected: null,
  };

  if (typeof rule.customMatch === "function") {
    try {
      const customResult = rule.customMatch(
        featureVector,
      );

      if (
        customResult &&
        typeof customResult === "object"
      ) {
        custom = {
          matched: Boolean(customResult.matched),
          label: customResult.label ?? "",
          actual: customResult.actual ?? null,
          expected: customResult.expected ?? null,
        };
      } else {
        custom = {
          matched: Boolean(customResult),
          label: "自定义条件",
          actual: customResult,
          expected: true,
        };
      }
    } catch (error) {
      custom = {
        matched: false,
        label: "自定义条件执行失败",
        actual: error?.message ?? "unknown error",
        expected: true,
      };
    }
  }

  return {
    matched:
      allPassed &&
      anyPassed &&
      nonePassed &&
      custom.matched,

    all,
    any,
    none,
    custom,
  };
}

function evaluateConditionList(
  featureVector,
  conditions,
) {
  return (Array.isArray(conditions)
    ? conditions
    : []
  ).map((condition) =>
    evaluateCondition(
      featureVector,
      condition,
    ),
  );
}

function evaluateCondition(
  featureVector,
  condition = {},
) {
  if (typeof condition.test === "function") {
    try {
      const result = condition.test(featureVector);

      return {
        matched: Boolean(result),
        path: condition.path ?? "",
        op: "custom",
        actual: result,
        expected: true,
        label:
          condition.label ??
          condition.path ??
          "自定义条件",
      };
    } catch (error) {
      return {
        matched: false,
        path: condition.path ?? "",
        op: "custom",
        actual: error?.message ?? "unknown error",
        expected: true,
        label:
          condition.label ??
          condition.path ??
          "自定义条件",
      };
    }
  }

  const actual = getPathValue(
    featureVector,
    condition.path,
  );

  const expected = condition.value;
  const op = condition.op ?? "eq";

  return {
    matched: compareValue(
      actual,
      op,
      expected,
    ),
    path: condition.path ?? "",
    op,
    actual,
    expected,
    label:
      condition.label ??
      condition.path ??
      "未命名条件",
  };
}

function compareValue(
  actual,
  op,
  expected,
) {
  switch (op) {
    case "eq":
      return normalizeComparable(actual) ===
        normalizeComparable(expected);

    case "neq":
      return normalizeComparable(actual) !==
        normalizeComparable(expected);

    case "gt":
      return toNumber(actual) > toNumber(expected);

    case "gte":
      return toNumber(actual) >= toNumber(expected);

    case "lt":
      return toNumber(actual) < toNumber(expected);

    case "lte":
      return toNumber(actual) <= toNumber(expected);

    case "includes":
      if (Array.isArray(actual)) {
        return actual.includes(expected);
      }

      return String(actual ?? "").includes(
        String(expected ?? ""),
      );

    case "containsAny": {
      const expectedList = toArray(expected);

      if (Array.isArray(actual)) {
        return expectedList.some((item) =>
          actual.includes(item),
        );
      }

      const actualText = String(actual ?? "");

      return expectedList.some((item) =>
        actualText.includes(String(item)),
      );
    }

    case "containsAll": {
      const expectedList = toArray(expected);

      if (Array.isArray(actual)) {
        return expectedList.every((item) =>
          actual.includes(item),
        );
      }

      const actualText = String(actual ?? "");

      return expectedList.every((item) =>
        actualText.includes(String(item)),
      );
    }

    case "matches": {
      const regex =
        expected instanceof RegExp
          ? expected
          : new RegExp(String(expected ?? ""));

      return regex.test(String(actual ?? ""));
    }

    case "exists":
      return (
        actual !== undefined &&
        actual !== null &&
        actual !== ""
      );

    case "truthy":
      return Boolean(actual);

    case "falsy":
      return !actual;

    case "in":
      return toArray(expected).includes(actual);

    case "notIn":
      return !toArray(expected).includes(actual);

    case "between": {
      const [min, max] = toArray(expected);
      const number = toNumber(actual);

      return (
        number >= toNumber(min) &&
        number <= toNumber(max)
      );
    }

    default:
      return false;
  }
}

function buildRuleFact(
  featureVector,
  rule,
  evaluation,
) {
  const customFact =
    typeof rule.buildFact === "function"
      ? rule.buildFact(
          featureVector,
          evaluation,
        )
      : {};

  const score = Number(
    resolveValue(
      customFact?.score ?? rule.score ?? 50,
      featureVector,
      evaluation,
    ),
  );

  const priority = Number(
    resolveValue(
      customFact?.priority ??
        rule.priority ??
        score,
      featureVector,
      evaluation,
    ),
  );

  const name = resolveValue(
    customFact?.name ??
      customFact?.label ??
      rule.name ??
      rule.id,
    featureVector,
    evaluation,
  );

  const brief = resolveValue(
    customFact?.brief ??
      customFact?.meaning ??
      rule.brief ??
      "",
    featureVector,
    evaluation,
  );

  const evidence = resolveTextList(
    customFact?.evidence ?? rule.evidence,
    featureVector,
    evaluation,
  );

  if (evidence.length === 0) {
    evidence.push(
      ...buildConditionEvidence(evaluation),
    );
  }

  return {
    id:
      customFact?.id ??
      rule.id,

    name,
    label:
      customFact?.label ??
      name,

    category:
      customFact?.category ??
      rule.category ??
      "组合结构",

    subcategory:
      customFact?.subcategory ??
      rule.subcategory ??
      "",

    status: resolveValue(
      customFact?.status ??
        rule.status ??
        "confirmed",
      featureVector,
      evaluation,
    ),

    role: resolveValue(
      customFact?.role ??
        rule.role ??
        "support",
      featureVector,
      evaluation,
    ),

    polarity: resolveValue(
      customFact?.polarity ??
        rule.polarity ??
        "mixed",
      featureVector,
      evaluation,
    ),

    importance: resolveValue(
      customFact?.importance ??
        rule.importance ??
        importanceFromScore(score),
      featureVector,
      evaluation,
    ),

    confidence: resolveValue(
      customFact?.confidence ??
        rule.confidence ??
        confidenceFromScore(score),
      featureVector,
      evaluation,
    ),

    specificity:
      customFact?.specificity ??
      rule.specificity ??
      "high",

    score,
    priority,

    brief,
    meaning:
      customFact?.meaning ??
      brief,

    evidence,

    conditions: resolveTextList(
      customFact?.conditions ??
        rule.conditionNotes,
      featureVector,
      evaluation,
    ),

    counterEvidence: resolveTextList(
      customFact?.counterEvidence ??
        rule.counterEvidence,
      featureVector,
      evaluation,
    ),

    domains: unique(
      toArray(
        customFact?.domains ??
          rule.domains,
      ),
    ),

    tags: unique(
      resolveTextList(
        customFact?.tags ??
          rule.tags,
        featureVector,
        evaluation,
      ),
    ),

    semanticGroup:
      customFact?.semanticGroup ??
      rule.semanticGroup ??
      rule.id,

    relatedFactIds: unique(
      toArray(
        customFact?.relatedFactIds ??
          rule.relatedFactIds,
      ),
    ),

    conflictsWith: unique(
      toArray(
        customFact?.conflictsWith ??
          rule.conflictsWith,
      ),
    ),

    suppresses: unique(
      toArray(
        customFact?.suppresses ??
          rule.suppresses,
      ),
    ),

    sourceRuleId: rule.id,

    debug: {
      matchedConditions: evaluation,
    },
  };
}

function buildConditionEvidence(
  evaluation = {},
) {
  const details = [
    ...(evaluation.all ?? []),
    ...(evaluation.any ?? []).filter(
      (item) => item.matched,
    ),
  ];

  if (
    evaluation.custom?.matched &&
    evaluation.custom?.label
  ) {
    details.push(evaluation.custom);
  }

  return details
    .filter((item) => item.matched)
    .map((item) => {
      const actual = printableValue(
        item.actual,
      );

      return actual
        ? `${item.label}：${actual}`
        : `${item.label}成立`;
    });
}

function getPathValue(
  source,
  path,
) {
  if (!path) return undefined;

  return String(path)
    .split(".")
    .filter(Boolean)
    .reduce(
      (value, key) =>
        value == null
          ? undefined
          : value[key],
      source,
    );
}

function resolveTextList(
  value,
  featureVector,
  evaluation,
) {
  return unique(
    toArray(value)
      .map((item) =>
        resolveValue(
          item,
          featureVector,
          evaluation,
        ),
      )
      .flat(Infinity)
      .filter(
        (item) =>
          item !== undefined &&
          item !== null &&
          String(item).trim() !== "",
      )
      .map((item) => String(item).trim()),
  );
}

function resolveValue(
  value,
  featureVector,
  evaluation,
) {
  if (typeof value === "function") {
    try {
      return value(
        featureVector,
        evaluation,
      );
    } catch {
      return "";
    }
  }

  return value;
}

function normalizeComparable(value) {
  if (
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value;
  }

  return String(value ?? "");
}

function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number)
    ? number
    : 0;
}

function toArray(value) {
  if (Array.isArray(value)) return value;
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return [];
  }

  return [value];
}

function unique(items = []) {
  return [...new Set(items)];
}

function printableValue(value) {
  if (Array.isArray(value)) {
    return value.join("、");
  }

  if (
    value &&
    typeof value === "object"
  ) {
    try {
      return JSON.stringify(value);
    } catch {
      return "";
    }
  }

  return String(value ?? "");
}

function importanceFromScore(score) {
  if (score >= 82) return "high";
  if (score >= 65) return "medium";
  return "low";
}

function confidenceFromScore(score) {
  if (score >= 84) return "high";
  if (score >= 62) return "medium";
  return "low";
}