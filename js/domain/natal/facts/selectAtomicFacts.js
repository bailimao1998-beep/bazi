export const ATOMIC_FACT_SELECTOR_VERSION =
  "atomic-fact-selector-v1";

const arrayQueryFields = [
  "factIds",
  "excludeFactIds",
  "categories",
  "predicates",
  "statuses",
  "excludeStatuses",
  "confidences",
  "subjectTypes",
  "subjectKeys",
  "tags",
  "sourceFeatures",
];

const confidenceRank = {
  unknown: 0,
  low: 1,
  medium: 2,
  high: 3,
};

export function selectAtomicFacts({
  facts = [],
  query = {},
} = {}) {
  const warnings = [];

  const safeFacts = normalizeFactsInput(
    facts,
    warnings,
  );

  const normalizedQuery = normalizeQuery(
    query,
    warnings,
  );

  let selectedFacts = [...safeFacts.validFacts];

  selectedFacts = applyArrayIncludeFilter(
    selectedFacts,
    normalizedQuery.factIds,
    getFactId,
  );

  selectedFacts = applyArrayExcludeFilter(
    selectedFacts,
    normalizedQuery.excludeFactIds,
    getFactId,
  );

  selectedFacts = applyArrayIncludeFilter(
    selectedFacts,
    normalizedQuery.categories,
    (fact) => fact.category,
  );

  selectedFacts = applyArrayIncludeFilter(
    selectedFacts,
    normalizedQuery.predicates,
    (fact) => fact.predicate,
  );

  selectedFacts = applyArrayIncludeFilter(
    selectedFacts,
    normalizedQuery.statuses,
    (fact) => fact.status,
  );

  selectedFacts = applyArrayExcludeFilter(
    selectedFacts,
    normalizedQuery.excludeStatuses,
    (fact) => fact.status,
  );

  selectedFacts = applyArrayIncludeFilter(
    selectedFacts,
    normalizedQuery.confidences,
    (fact) => fact.confidence,
  );

  selectedFacts = applyMinConfidenceFilter(
    selectedFacts,
    normalizedQuery.minConfidence,
  );

  selectedFacts = applyArrayIncludeFilter(
    selectedFacts,
    normalizedQuery.subjectTypes,
    (fact) => fact.subject?.type,
  );

  selectedFacts = applyArrayIncludeFilter(
    selectedFacts,
    normalizedQuery.subjectKeys,
    (fact) => fact.subject?.key,
  );

  selectedFacts = applyTagFilter(
    selectedFacts,
    normalizedQuery.tags,
    normalizedQuery.tagMatchMode,
  );

  selectedFacts = applySourceFeatureFilter(
    selectedFacts,
    normalizedQuery.sourceFeatures,
  );

  selectedFacts = selectedFacts
    .slice()
    .sort(compareAtomicFacts);

  if (normalizedQuery.limit !== null) {
    selectedFacts = selectedFacts.slice(
      0,
      normalizedQuery.limit,
    );
  }

  const selectedFactIds =
    uniqueSortedStrings(
      selectedFacts.map(getFactId),
    );

  return {
    version: ATOMIC_FACT_SELECTOR_VERSION,
    selectedFacts,
    selectedFactIds,
    totalInputCount:
      safeFacts.totalInputCount,
    selectedCount:
      selectedFacts.length,
    rejectedCount:
      safeFacts.totalInputCount -
      selectedFacts.length,
    normalizedQuery,
    summary: buildSummary(selectedFacts),
    warnings: uniqueSortedStrings(warnings),
  };
}

function normalizeFactsInput(
  facts,
  warnings,
) {
  if (!Array.isArray(facts)) {
    warnings.push("facts should be an array");
    return {
      totalInputCount: 0,
      validFacts: [],
    };
  }

  const validFacts = [];

  for (const fact of facts) {
    if (
      !fact ||
      typeof fact !== "object" ||
      Array.isArray(fact)
    ) {
      warnings.push(
        "null or non-object fact ignored",
      );
      continue;
    }

    validFacts.push(fact);
  }

  return {
    totalInputCount: facts.length,
    validFacts,
  };
}

function normalizeQuery(query, warnings) {
  const source =
    query &&
    typeof query === "object" &&
    !Array.isArray(query)
      ? query
      : {};

  if (source !== query) {
    warnings.push("query should be an object");
  }

  const normalized = {};

  for (const field of arrayQueryFields) {
    normalized[field] =
      normalizeQueryStringArray(
        source[field],
        field,
        warnings,
      );
  }

  normalized.tagMatchMode =
    normalizeTagMatchMode(
      source.tagMatchMode,
      warnings,
    );

  normalized.minConfidence =
    normalizeMinConfidence(
      source.minConfidence,
      warnings,
    );

  normalized.limit = normalizeLimit(
    source.limit,
    warnings,
  );

  return normalized;
}

function normalizeQueryStringArray(
  value,
  field,
  warnings,
) {
  if (value === undefined) {
    return [];
  }

  if (!Array.isArray(value)) {
    warnings.push(`${field} should be an array`);
    return [];
  }

  return uniqueSortedStrings(value);
}

function normalizeTagMatchMode(
  value,
  warnings,
) {
  const mode = normalizeText(value);

  if (!mode) {
    return "any";
  }

  if (mode === "any" || mode === "all") {
    return mode;
  }

  warnings.push(
    "tagMatchMode should be any or all",
  );
  return "any";
}

function normalizeMinConfidence(
  value,
  warnings,
) {
  if (value === undefined || value === null) {
    return "";
  }

  const confidence = normalizeText(value);

  if (!confidence) {
    return "";
  }

  if (
    Object.hasOwn(confidenceRank, confidence)
  ) {
    return confidence;
  }

  warnings.push(
    "minConfidence should be unknown, low, medium, or high",
  );
  return "";
}

function normalizeLimit(value, warnings) {
  if (value === undefined || value === null) {
    return null;
  }

  if (
    typeof value === "string" &&
    value.trim() === ""
  ) {
    warnings.push(
      "limit should be a finite positive integer",
    );
    return null;
  }

  const parsed = Number(value);

  if (
    !Number.isFinite(parsed) ||
    parsed <= 0
  ) {
    warnings.push(
      "limit should be a finite positive integer",
    );
    return null;
  }

  const limit = Math.floor(parsed);

  if (limit <= 0) {
    warnings.push(
      "limit should be a finite positive integer",
    );
    return null;
  }

  return limit;
}

function applyArrayIncludeFilter(
  facts,
  allowedValues,
  readValue,
) {
  if (allowedValues.length === 0) {
    return facts;
  }

  const allowed = new Set(allowedValues);

  return facts.filter((fact) =>
    allowed.has(
      normalizeText(readValue(fact)),
    ),
  );
}

function applyArrayExcludeFilter(
  facts,
  excludedValues,
  readValue,
) {
  if (excludedValues.length === 0) {
    return facts;
  }

  const excluded = new Set(excludedValues);

  return facts.filter((fact) =>
    !excluded.has(
      normalizeText(readValue(fact)),
    ),
  );
}

function applyMinConfidenceFilter(
  facts,
  minConfidence,
) {
  if (!minConfidence) {
    return facts;
  }

  const minRank =
    confidenceRank[minConfidence];

  return facts.filter((fact) => {
    const confidence = normalizeText(
      fact.confidence,
    );

    const rank =
      confidenceRank[confidence];

    return (
      rank !== undefined &&
      rank >= minRank
    );
  });
}

function applyTagFilter(
  facts,
  tags,
  tagMatchMode,
) {
  if (tags.length === 0) {
    return facts;
  }

  return facts.filter((fact) => {
    const factTags = new Set(
      normalizeQueryStringArray(
        Array.isArray(fact.tags)
          ? fact.tags
          : [],
        "fact.tags",
        [],
      ),
    );

    if (tagMatchMode === "all") {
      return tags.every((tag) =>
        factTags.has(tag),
      );
    }

    return tags.some((tag) =>
      factTags.has(tag),
    );
  });
}

function applySourceFeatureFilter(
  facts,
  sourceFeatures,
) {
  if (sourceFeatures.length === 0) {
    return facts;
  }

  const allowed = new Set(sourceFeatures);

  return facts.filter((fact) =>
    (Array.isArray(fact.sourceRefs)
      ? fact.sourceRefs
      : []
    ).some((sourceRef) =>
      allowed.has(
        normalizeText(
          sourceRef?.featureGroup,
        ),
      ),
    ),
  );
}

function buildSummary(facts) {
  return {
    byCategory: countBy(facts, (fact) =>
      fact.category,
    ),
    byPredicate: countBy(facts, (fact) =>
      fact.predicate,
    ),
    byStatus: countBy(facts, (fact) =>
      fact.status,
    ),
    byConfidence: countBy(facts, (fact) =>
      fact.confidence,
    ),
  };
}

function countBy(facts, readValue) {
  const counts = {};

  for (const fact of facts) {
    const key = normalizeText(
      readValue(fact),
    );

    if (!key) {
      continue;
    }

    counts[key] = (counts[key] ?? 0) + 1;
  }

  return Object.fromEntries(
    Object.entries(counts).sort(
      ([left], [right]) =>
        left.localeCompare(right),
    ),
  );
}

function compareAtomicFacts(left, right) {
  return (
    normalizeText(left.category).localeCompare(
      normalizeText(right.category),
    ) ||
    normalizeText(left.subject?.type).localeCompare(
      normalizeText(right.subject?.type),
    ) ||
    normalizeText(left.subject?.key).localeCompare(
      normalizeText(right.subject?.key),
    ) ||
    normalizeText(left.predicate).localeCompare(
      normalizeText(right.predicate),
    ) ||
    normalizeText(left.status).localeCompare(
      normalizeText(right.status),
    ) ||
    compareConfidence(
      left.confidence,
      right.confidence,
    ) ||
    getFactId(left).localeCompare(
      getFactId(right),
    )
  );
}

function compareConfidence(left, right) {
  const leftText = normalizeText(left);
  const rightText = normalizeText(right);
  const leftRank =
    confidenceRank[leftText];
  const rightRank =
    confidenceRank[rightText];

  if (
    leftRank !== undefined ||
    rightRank !== undefined
  ) {
    return (
      (leftRank ?? Number.MAX_SAFE_INTEGER) -
      (rightRank ?? Number.MAX_SAFE_INTEGER)
    );
  }

  return leftText.localeCompare(rightText);
}

function getFactId(fact) {
  return normalizeText(fact?.id);
}

function uniqueSortedStrings(items) {
  return [
    ...new Set(
      (Array.isArray(items) ? items : [])
        .map(normalizeText)
        .filter(Boolean),
    ),
  ].sort();
}

function normalizeText(value) {
  return typeof value === "string"
    ? value.trim()
    : "";
}
