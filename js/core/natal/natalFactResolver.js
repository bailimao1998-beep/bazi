/**
 * 原局事实解析器。
 *
 * 职责：
 * 1. 同义事实合并；
 * 2. 证据、标签、领域合并；
 * 3. 显式冲突和抑制处理；
 * 4. 生成最终事实列表与调试结果。
 */

export function resolveNatalFacts(
  inputFacts = [],
) {
  const normalized = (
    Array.isArray(inputFacts)
      ? inputFacts
      : []
  )
    .map(normalizeFact)
    .filter(
      (fact) =>
        fact.id &&
        fact.name,
    );

  const {
    mergedFacts,
    duplicateSuppressed,
  } = mergeSemanticGroups(normalized);

  const {
    activeFacts,
    conflictSuppressed,
  } = applyExplicitSuppression(
    mergedFacts,
  );

  const facts = activeFacts.sort(
    compareForOutput,
  );

  const suppressedFacts = [
    ...duplicateSuppressed,
    ...conflictSuppressed,
  ].sort(compareForOutput);

  return {
    facts,
    suppressedFacts,
    byDomain: groupByDomain(facts),
    byCategory: groupByCategory(facts),
    hitListGroups: buildHitListGroups(
      facts,
    ),
    debug: {
      inputFactCount: normalized.length,
      resolvedFactCount: facts.length,
      suppressedFactCount:
        suppressedFacts.length,
    },
  };
}

function mergeSemanticGroups(
  facts,
) {
  const grouped = new Map();

  for (const fact of facts) {
    const key =
      fact.semanticGroup ||
      fact.id;

    if (!grouped.has(key)) {
      grouped.set(key, []);
    }

    grouped.get(key).push(fact);
  }

  const mergedFacts = [];
  const duplicateSuppressed = [];

  for (const [
    semanticGroup,
    groupFacts,
  ] of grouped.entries()) {
    const sorted = [...groupFacts].sort(
      compareFactStrength,
    );

    const primary = {
      ...sorted[0],
      semanticGroup,
    };

    for (
      let index = 1;
      index < sorted.length;
      index += 1
    ) {
      const duplicate = sorted[index];

      primary.evidence = mergeArrays(
        primary.evidence,
        duplicate.evidence,
      );

      primary.conditions = mergeArrays(
        primary.conditions,
        duplicate.conditions,
      );

      primary.counterEvidence =
        mergeArrays(
          primary.counterEvidence,
          duplicate.counterEvidence,
        );

      primary.tags = mergeArrays(
        primary.tags,
        duplicate.tags,
      );

      primary.domains = mergeArrays(
        primary.domains,
        duplicate.domains,
      );

      primary.relatedFactIds =
        mergeArrays(
          primary.relatedFactIds,
          [
            duplicate.id,
            ...(duplicate.relatedFactIds ??
              []),
          ],
        );

      primary.score = Math.max(
        Number(primary.score ?? 0),
        Number(duplicate.score ?? 0),
      );

      primary.priority = Math.max(
        Number(primary.priority ?? 0),
        Number(duplicate.priority ?? 0),
      );

      duplicateSuppressed.push({
        ...duplicate,
        suppressedReason:
          `与“${primary.name}”属于同一语义组，证据已合并。`,
        suppressedBy: primary.id,
      });
    }

    mergedFacts.push(primary);
  }

  return {
    mergedFacts,
    duplicateSuppressed,
  };
}

function applyExplicitSuppression(
  facts,
) {
  const activeMap = new Map(
    facts.map((fact) => [
      fact.semanticGroup,
      fact,
    ]),
  );

  const suppressed = new Map();

  for (const fact of facts) {
    for (
      const targetGroup of fact.suppresses ??
      []
    ) {
      const target =
        activeMap.get(targetGroup);

      if (
        !target ||
        target.id === fact.id
      ) {
        continue;
      }

      suppressed.set(target.id, {
        ...target,
        suppressedReason:
          `被更强事实“${fact.name}”抑制。`,
        suppressedBy: fact.id,
      });
    }
  }

  for (const fact of facts) {
    for (
      const conflictGroup of
        fact.conflictsWith ?? []
    ) {
      const other =
        activeMap.get(conflictGroup);

      if (
        !other ||
        other.id === fact.id ||
        suppressed.has(fact.id) ||
        suppressed.has(other.id)
      ) {
        continue;
      }

      const [stronger, weaker] =
        compareFactStrength(fact, other) <= 0
          ? [fact, other]
          : [other, fact];

      suppressed.set(weaker.id, {
        ...weaker,
        suppressedReason:
          `与“${stronger.name}”冲突，保留优先级和证据更强者。`,
        suppressedBy: stronger.id,
      });
    }
  }

  return {
    activeFacts: facts.filter(
      (fact) =>
        !suppressed.has(fact.id),
    ),

    conflictSuppressed: [
      ...suppressed.values(),
    ],
  };
}

function normalizeFact(
  fact = {},
) {
  const score = Number(
    fact.score ?? 50,
  );

  return {
    id: fact.id,
    name:
      fact.name ??
      fact.label ??
      "",
    label:
      fact.label ??
      fact.name ??
      "",

    category:
      fact.category ??
      "结构象",

    subcategory:
      fact.subcategory ??
      "",

    status:
      fact.status ??
      statusFromRole(fact.role),

    role:
      fact.role ??
      "support",

    polarity:
      fact.polarity ??
      "mixed",

    importance:
      fact.importance ??
      importanceFromScore(score),

    confidence:
      fact.confidence ??
      confidenceFromScore(score),

    specificity:
      fact.specificity ??
      "medium",

    factLevel:
      fact.factLevel ??
      "base",

    score,

    priority: Number(
      fact.priority ??
        score,
    ),

    brief:
      cleanNatalText(
        fact.brief ??
          fact.meaning ??
          "",
      ),

    meaning:
      cleanNatalText(
        fact.meaning ??
          fact.brief ??
          "",
      ),

    evidence: normalizeEvidence(
      fact.evidence,
    ),

    conditions: normalizeArray(
      fact.conditions,
    ).map(cleanNatalText),

    counterEvidence: normalizeArray(
      fact.counterEvidence,
    ).map(cleanNatalText),

    tags: normalizeArray(
      fact.tags,
    ).map(cleanNatalText),

    domains: normalizeArray(
      fact.domains,
    ),

    relatedFactIds: normalizeArray(
      fact.relatedFactIds,
    ),

    conflictsWith: normalizeArray(
      fact.conflictsWith,
    ),

    suppresses: normalizeArray(
      fact.suppresses,
    ),

    sourceRuleId:
      fact.sourceRuleId ??
      fact.id,

    semanticGroup:
      fact.semanticGroup ??
      fact.id,

    suppressedReason:
      fact.suppressedReason ??
      "",

    suppressedBy:
      fact.suppressedBy ??
      "",

    relationType:
      fact.relationType,

    layer:
      fact.layer,

    participants:
      fact.participants,

    affects:
      fact.affects,

    formation:
      fact.formation,

    canTransform:
      fact.canTransform,

    transformed:
      fact.transformed,

    debug:
      fact.debug ??
      null,
  };
}

function compareFactStrength(
  left,
  right,
) {
  return (
    factLevelRank(right.factLevel) -
      factLevelRank(left.factLevel) ||

    Number(right.priority ?? 0) -
      Number(left.priority ?? 0) ||

    Number(right.score ?? 0) -
      Number(left.score ?? 0) ||

    confidenceRank(right.confidence) -
      confidenceRank(left.confidence) ||

    statusRank(right.status) -
      statusRank(left.status) ||

    specificityRank(right.specificity) -
      specificityRank(left.specificity)
  );
}

function factLevelRank(factLevel) {
  return {
    pattern: 4,
    structural: 3,
    base: 2,
    raw: 1,
  }[factLevel] ?? 0;
}

function compareForOutput(
  left,
  right,
) {
  return (
    roleRank(right.role) -
      roleRank(left.role) ||

    Number(right.score ?? 0) -
      Number(left.score ?? 0) ||

    String(left.name).localeCompare(
      String(right.name),
      "zh-CN",
    )
  );
}

function groupByDomain(
  facts,
) {
  const result = {};

  for (const fact of facts) {
    for (const domain of fact.domains) {
      if (!result[domain]) {
        result[domain] = [];
      }

      result[domain].push(fact);
    }
  }

  return result;
}

function groupByCategory(
  facts,
) {
  const result = {};

  for (const fact of facts) {
    const category =
      fact.category ||
      "结构象";

    if (!result[category]) {
      result[category] = [];
    }

    result[category].push(fact);
  }

  return result;
}

function buildHitListGroups(
  facts,
) {
  const all = facts.filter(
    (fact) =>
      fact.specificity !== "generic",
  );

  return {
    all,

    confirmed: all.filter(
      (fact) =>
        fact.status === "confirmed",
    ),

    conditional: all.filter(
      (fact) =>
        fact.status === "conditional",
    ),

    weak: all.filter(
      (fact) =>
        fact.status === "weak",
    ),

    featured: all
      .filter(
        (fact) =>
          fact.category !== "神煞辅助" &&
          fact.importance !== "low",
      )
      .slice(0, 8),

    byCategory:
      groupByCategory(all),
  };
}

function mergeArrays(
  ...arrays
) {
  const result = [];
  const seen = new Set();

  for (const item of arrays.flat(Infinity)) {
    if (
      item === undefined ||
      item === null ||
      item === ""
    ) {
      continue;
    }

    const key =
      typeof item === "object"
        ? safeStringify(item)
        : String(item);

    if (seen.has(key)) continue;

    seen.add(key);
    result.push(item);
  }

  return result;
}

function normalizeArray(value) {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return [];
  }

  return mergeArrays(
    Array.isArray(value)
      ? value
      : [value],
  );
}

function normalizeEvidence(value) {
  return normalizeArray(value).map((item) => {
    if (item && typeof item === "object") {
      return {
        ...item,
        text: cleanNatalText(item.text ? String(item.text) : String(item.value ?? item.position ?? "")),
      };
    }
    return {
      type: "structure",
      position: "",
      value: "",
      text: cleanNatalText(String(item ?? "")),
    };
  });
}

function cleanNatalText(text = "") {
  return String(text)
    .replace(/与岁运验证/g, "与现实阶段复核")
    .replace(/岁运/g, "现实阶段")
    .replace(/大运流年/g, "现实阶段")
    .replace(/大运|流年|流月|当前步运|流日/g, "现实阶段")
    .replace(/需要结合/g, "需由")
    .replace(/需要观察/g, "可观察")
    .replace(/需观察/g, "观察")
    .replace(/需要复核/g, "可复核")
    .replace(/需复核/g, "可复核")
    .replace(/不宜直接/g, "不单独");
}

function safeStringify(value) {
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function statusFromRole(role) {
  if (role === "condition") {
    return "conditional";
  }

  if (role === "weak") {
    return "weak";
  }

  return "confirmed";
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

function confidenceRank(value) {
  return {
    high: 3,
    medium: 2,
    low: 1,
  }[value] ?? 0;
}

function statusRank(value) {
  return {
    confirmed: 3,
    conditional: 2,
    weak: 1,
  }[value] ?? 0;
}

function specificityRank(value) {
  return {
    high: 3,
    medium: 2,
    generic: 1,
  }[value] ?? 0;
}

function roleRank(value) {
  return {
    core: 6,
    main: 5,
    tension: 4,
    support: 3,
    condition: 2,
    weak: 1,
    auxiliary: 0,
  }[value] ?? 0;
}
