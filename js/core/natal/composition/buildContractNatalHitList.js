export const CONTRACT_NATAL_HIT_LIST_VERSION =
  "contract-natal-hit-list-v1";

const defaultFeaturedLimit = 8;

const roleCategoryMap = {
  core: "核心结构",
  support: "支持结构",
  tension: "张力结构",
  conditional: "条件结构",
};

const statusMap = {
  derived: "confirmed",
  conditional: "conditional",
  candidate: "weak",
  confirmed: "confirmed",
  weak: "weak",
};

const importanceRank = {
  low: 1,
  medium: 2,
  high: 3,
};

const confidenceRank = {
  unknown: 0,
  low: 1,
  medium: 2,
  high: 3,
};

export function buildContractNatalHitList({
  images = [],
  facts = [],
  featuredLimit = defaultFeaturedLimit,
} = {}) {
  const warnings = [];
  const safeImages = normalizeObjectArray(
    images,
    "images",
    warnings,
  );
  const safeFacts = normalizeObjectArray(
    facts,
    "facts",
    warnings,
  );
  const normalizedFeaturedLimit =
    normalizeFeaturedLimit(
      featuredLimit,
      warnings,
    );
  const factById = buildFactIndex(safeFacts);

  const all = safeImages
    .map((image) =>
      buildHitListRow(image, factById),
    )
    .sort(compareRows);

  return {
    version: CONTRACT_NATAL_HIT_LIST_VERSION,
    mode: "preview",
    all,
    featured: all.slice(
      0,
      normalizedFeaturedLimit,
    ),
    confirmed: all.filter(
      (row) => row.status === "confirmed",
    ),
    conditional: all.filter(
      (row) => row.status === "conditional",
    ),
    weak: all.filter(
      (row) => row.status === "weak",
    ),
    byCategory: buildByCategory(all),
    warnings: uniqueSortedStrings(warnings),
  };
}

function buildHitListRow(image, factById) {
  const rawStatus = normalizeText(image.status);
  const role = normalizeText(image.role);
  const relatedFactIds = uniqueSortedStrings(
    image.matchedFactIds,
  );
  const counterFactIds = uniqueSortedStrings(
    image.counterFactIds,
  );
  const domains = uniqueSortedStrings(
    image.domains,
  );
  const tags = uniqueSortedStrings(image.tags);

  return {
    id: normalizeText(image.id),
    name: normalizeText(image.title),
    type: "新版组合取象",
    category:
      roleCategoryMap[role] ?? "组合结构",
    subcategory: normalizeText(image.ruleId),

    status:
      statusMap[rawStatus] ?? "weak",
    rawStatus,
    role,
    polarity: "mixed",

    score: parseFiniteNumber(
      image.priority,
    ) ?? 0,
    priority:
      parseFiniteNumber(image.priority) ?? 0,
    importance: normalizeText(
      image.importance,
    ),
    confidence: normalizeText(
      image.confidence,
    ),
    specificity: "high",

    sourceRuleId: normalizeText(
      image.ruleId,
    ),
    relatedFactIds,
    semanticGroup: normalizeText(
      image.ruleId,
    ),

    domains,
    supports: domains,

    evidence: resolveFactSummaries(
      relatedFactIds,
      factById,
    ),
    conditions: normalizeStringArray(
      image.reasoning,
    ),
    counterEvidence: resolveFactSummaries(
      counterFactIds,
      factById,
    ),

    source: "新版原局组合规则",
    brief: normalizeText(image.brief),
    image: tags,
    tags,
  };
}

function buildFactIndex(facts) {
  const factById = new Map();

  for (const fact of facts) {
    const id = normalizeText(fact.id);

    if (id && !factById.has(id)) {
      factById.set(id, fact);
    }
  }

  return factById;
}

function resolveFactSummaries(ids, factById) {
  return uniqueSortedStrings(
    ids.map((id) => {
      const fact = factById.get(id);

      if (!fact) {
        return `事实ID：${id}`;
      }

      return summarizeFact(fact);
    }),
  );
}

function summarizeFact(fact) {
  const subjectLabel =
    normalizeText(fact.subject?.label) ||
    normalizeText(fact.subject?.key);
  const predicate = normalizeText(
    fact.predicate,
  );
  const canonicalValue =
    canonicalizeValue(fact.value);

  return `${subjectLabel} · ${predicate}：${canonicalValue}`;
}

function canonicalizeValue(value) {
  if (typeof value === "string") {
    return value.trim();
  }

  if (
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value.map(canonicalizeValue).join("、");
  }

  if (
    value &&
    typeof value === "object"
  ) {
    return `{${Object.keys(value)
      .sort()
      .map(
        (key) =>
          `${key}:${canonicalizeValue(value[key])}`,
      )
      .join(",")}}`;
  }

  return "";
}

function buildByCategory(all) {
  const grouped = {};

  for (const row of all) {
    if (!grouped[row.category]) {
      grouped[row.category] = [];
    }

    grouped[row.category].push(row);
  }

  return Object.fromEntries(
    Object.keys(grouped)
      .sort()
      .map((category) => [
        category,
        grouped[category],
      ]),
  );
}

function compareRows(left, right) {
  return (
    right.priority - left.priority ||
    rankValue(
      right.importance,
      importanceRank,
    ) -
      rankValue(
        left.importance,
        importanceRank,
      ) ||
    rankValue(
      right.confidence,
      confidenceRank,
    ) -
      rankValue(
        left.confidence,
        confidenceRank,
      ) ||
    left.sourceRuleId.localeCompare(
      right.sourceRuleId,
    ) ||
    left.id.localeCompare(right.id)
  );
}

function rankValue(value, rankMap) {
  return rankMap[normalizeText(value)] ?? 0;
}

function normalizeObjectArray(
  items,
  label,
  warnings,
) {
  if (!Array.isArray(items)) {
    warnings.push(`${label} should be an array`);
    return [];
  }

  const result = [];

  for (const item of items) {
    if (
      !item ||
      typeof item !== "object" ||
      Array.isArray(item)
    ) {
      warnings.push(
        `${label} contains null or non-object item`,
      );
      continue;
    }

    result.push(item);
  }

  return result;
}

function normalizeFeaturedLimit(value, warnings) {
  const parsed = Number(value);

  if (
    !Number.isFinite(parsed) ||
    parsed <= 0
  ) {
    warnings.push(
      "featuredLimit should be a finite positive integer",
    );
    return defaultFeaturedLimit;
  }

  return Math.floor(parsed);
}

function normalizeStringArray(value) {
  return uniqueSortedStrings(
    Array.isArray(value) ? value : [],
  );
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

function parseFiniteNumber(value) {
  if (
    value === undefined ||
    value === null
  ) {
    return null;
  }

  if (
    typeof value === "string" &&
    value.trim() === ""
  ) {
    return null;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed)
    ? parsed
    : null;
}

function normalizeText(value) {
  return typeof value === "string"
    ? value.trim()
    : "";
}
