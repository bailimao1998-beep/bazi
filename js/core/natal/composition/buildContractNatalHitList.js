import {
  getNatalCompositionSemantic,
} from "../narrative/natalCompositionSemantics.js";

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
  confirmed: "confirmed",

  structurally_supported:
    "conditional",

  conditional: "conditional",

  candidate: "weak",
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
  scope = "natal",
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
  const normalizedScope =
    normalizeScope(scope);
  const factById = buildFactIndex(safeFacts);

  const all = safeImages
    .map((image) =>
      buildHitListRow(
        image,
        factById,
        normalizedScope,
      ),
    )
    .sort(compareRows);

  return {
    version: CONTRACT_NATAL_HIT_LIST_VERSION,
    mode: "preview",
    scope: normalizedScope,
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

function buildHitListRow(
  image,
  factById,
  scope,
) {
  const rawStatus =
    normalizeText(image.status);

  const role =
    normalizeText(image.role);

  const ruleId =
    normalizeText(image.ruleId);

  const semantic =
    normalizeInlineSemantic(
      image.semantic,
    ) ||
    getNatalCompositionSemantic(
      ruleId,
    );
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
    scope,
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

  evidence:
    uniqueSortedStrings([
      ...normalizeStringArray(
        image.evidence,
      ),

      ...resolveFactSummaries(
        relatedFactIds,
        factById,
      ),
    ]),
  conditions:
    uniqueSortedStrings([
      ...normalizeStringArray(
        image.reasoning,
      ),

      ...normalizeStringArray(
        image.supportingEvidence,
      ),

      ...normalizeStringArray(
        image.weakeningEvidence,
      ).map(
        (item) =>
          `减弱条件：${item}`,
      ),
    ]),
  counterEvidence:
    uniqueSortedStrings([
      ...normalizeStringArray(
        image.counterEvidence,
      ),

      ...resolveFactSummaries(
        counterFactIds,
        factById,
      ),
    ]),

  source:
    image.source ===
    "professional_context"
      ? "V2专业组合判断"
      : "新版组合取象规则",

    brief:
      normalizeText(image.brief),

    formation:
      semantic?.formation ?? "",

    meaning:
      semantic?.meaning ??
      normalizeText(image.brief),

    manifestations:
      normalizeNarrativeArray(
        semantic?.manifestations,
      ),

    strengths:
      normalizeNarrativeArray(
        semantic?.strengths,
      ),

    risks:
      normalizeNarrativeArray(
        semantic?.risks,
      ),

    boundary:
      semantic?.boundary ?? "",

    hasSemantic:
      Boolean(semantic),

    image: tags,
    tags,
  };
}

function normalizeInlineSemantic(
  value,
) {
  if (
    !value ||
    typeof value !==
      "object" ||
    Array.isArray(value)
  ) {
    return null;
  }

  return {
    formation:
      normalizeText(
        value.formation,
      ),

    meaning:
      normalizeText(
        value.meaning,
      ),

    manifestations:
      normalizeNarrativeArray(
        value.manifestations,
      ),

    strengths:
      normalizeNarrativeArray(
        value.strengths,
      ),

    risks:
      normalizeNarrativeArray(
        value.risks,
      ),

    boundary:
      normalizeText(
        value.boundary,
      ),
  };
}

function normalizeNarrativeArray(
  value,
) {
  return [
    ...new Set(
      (Array.isArray(value)
        ? value
        : [])
        .map(normalizeText)
        .filter(Boolean),
    ),
  ];
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

function normalizeScope(value) {
  const normalized = normalizeText(value);

  return normalized || "natal";
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
