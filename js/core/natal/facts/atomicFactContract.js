export const ATOMIC_NATAL_FACT_CONTRACT_VERSION =
  "atomic-natal-facts-v1";

const allowedCategories = new Set([
  "day_master",
  "pillar",
  "element",
  "ten_god",
  "relation",
  "palace",
  "kinship",
  "void",
  "storage",
  "growth_stage",
  "climate",
  "work_node",
  "work_edge",
  "work_chain",
  "conflict",
  "pass_through",
]);

const allowedStatuses =
  new Set(["observed", "derived", "candidate"]);

const allowedConfidences =
  new Set(["unknown", "low", "medium", "high"]);

const categoryOrder = [
  "day_master",
  "pillar",
  "element",
  "ten_god",
  "relation",
  "palace",
  "kinship",
  "void",
  "storage",
  "growth_stage",
  "climate",
  "work_node",
  "work_edge",
  "work_chain",
  "conflict",
  "pass_through",
];

const statusOrder = {
  observed: 0,
  derived: 1,
  candidate: 2,
};

export function createEmptyAtomicNatalFacts() {
  return {
    version: ATOMIC_NATAL_FACT_CONTRACT_VERSION,
    facts: [],
    indexes: emptyIndexes(),
    summary: emptySummary(),
    warnings: [],
  };
}

export function normalizeAtomicNatalFacts(input) {
  const source = input && typeof input === "object" && !Array.isArray(input)
    ? input
    : {};
  const warnings = Array.isArray(source.warnings)
    ? [...source.warnings]
    : [];
  const normalizedFacts = dedupeFacts(
    (Array.isArray(source.facts) ? source.facts : [])
      .map(normalizeFact)
      .filter(Boolean),
  ).sort(compareFacts);

  return {
    version: ATOMIC_NATAL_FACT_CONTRACT_VERSION,
    facts: normalizedFacts,
    indexes: buildIndexes(normalizedFacts),
    summary: buildSummary(normalizedFacts),
    warnings,
  };
}

export function validateAtomicNatalFacts(input) {
  const errors = [];
  const warnings = [];

  try {
    if (!input || typeof input !== "object" || Array.isArray(input)) {
      return {
        valid: false,
        errors: ["atomic facts result should be an object"],
        warnings,
      };
    }

    const facts = Array.isArray(input.contractFacts)
      ? input.contractFacts
      : Array.isArray(input.facts)
        ? input.facts
        : [];
    const indexes = input.indexes ?? {};
    const summary = input.summary ?? {};
    const ids = new Set();

    if (!Array.isArray(facts)) {
      errors.push("facts should be an array");
    }

    for (const [index, fact] of facts.entries()) {
      validateFact(fact, index, ids, errors);
    }

    validateIndexes(indexes, ids, errors);
    validateSummary(summary, facts, errors);
    findForbiddenKeys(input, "input", errors);
    for (const path of findNonFiniteNumberPaths(input)) {
      errors.push(`NaN or non-finite number at ${path}`);
    }

    try {
      JSON.stringify(input);
    } catch (error) {
      errors.push(`value is not JSON serializable: ${error?.message ?? "unknown"}`);
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  } catch (error) {
    return {
      valid: false,
      errors: [error?.message ?? "unknown validation error"],
      warnings,
    };
  }
}

export function normalizeFact(input = {}) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return null;
  }
  const fact = {
    category: normalizeCategory(input.category),
    subject: normalizeSubject(input.subject),
    predicate: String(input.predicate ?? ""),
    value: sanitizeValue(input.value ?? null),
    status: normalizeStatus(input.status),
    confidence: normalizeConfidence(input.confidence),
    sourceRefs: normalizeArray(input.sourceRefs).map(normalizeSourceRef),
    evidence: normalizeArray(input.evidence).map((item) => sanitizeValue(item)),
    tags: unique(normalizeArray(input.tags).map(String).filter(Boolean)),
    warnings: unique(normalizeArray(input.warnings).map(String).filter(Boolean)),
  };

  return {
    id: input.id || buildFactId(fact),
    ...fact,
  };
}

export function buildFactId(fact) {
  const canonical = stableStringify({
    category: fact.category,
    subject: fact.subject,
    predicate: fact.predicate,
    value: fact.value,
    status: fact.status,
    sourceRefs: fact.sourceRefs,
  });

  return `fact_${slug(fact.category)}_${fnv1a(canonical)}`;
}

export function stableStringify(value) {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(",")}]`;
  }
  return `{${Object.keys(value).sort().map((key) =>
    `${JSON.stringify(key)}:${stableStringify(value[key])}`,
  ).join(",")}}`;
}

function normalizeFactForMerge(fact) {
  return stableStringify({
    category: fact.category,
    subject: fact.subject,
    predicate: fact.predicate,
    value: fact.value,
    status: fact.status,
  });
}

function dedupeFacts(facts) {
  const map = new Map();
  for (const fact of facts) {
    const key = normalizeFactForMerge(fact);
    const current = map.get(key);
    if (!current) {
      map.set(key, fact);
      continue;
    }
    current.sourceRefs = uniqueObjects([
      ...current.sourceRefs,
      ...fact.sourceRefs,
    ]);
    current.evidence = uniqueObjects([
      ...current.evidence,
      ...fact.evidence,
    ]);
    current.tags = unique([...current.tags, ...fact.tags]);
    current.warnings = unique([...current.warnings, ...fact.warnings]);
    current.confidence = mergeConfidence(current.confidence, fact.confidence);
    current.id = buildFactId(current);
  }
  return [...map.values()];
}

function compareFacts(left, right) {
  return (
    categoryRank(left.category) - categoryRank(right.category) ||
    String(left.subject?.type ?? "").localeCompare(String(right.subject?.type ?? "")) ||
    String(left.subject?.key ?? "").localeCompare(String(right.subject?.key ?? "")) ||
    String(left.predicate ?? "").localeCompare(String(right.predicate ?? "")) ||
    statusOrder[left.status] - statusOrder[right.status] ||
    String(left.id).localeCompare(String(right.id))
  );
}

function buildIndexes(facts) {
  const indexes = emptyIndexes();
  for (const fact of facts) {
    addIndex(indexes.byCategory, fact.category, fact.id);
    addIndex(indexes.bySubject, `${fact.subject.type}:${fact.subject.key}`, fact.id);
    addIndex(indexes.byPredicate, fact.predicate, fact.id);
    addIndex(indexes.byStatus, fact.status, fact.id);
    addIndex(indexes.byConfidence, fact.confidence, fact.id);
    for (const sourceRef of fact.sourceRefs) {
      addIndex(indexes.bySourceFeature, sourceRef.featureGroup, fact.id);
    }
    for (const tag of fact.tags) {
      addIndex(indexes.byTag, tag, fact.id);
    }
  }

  for (const index of Object.values(indexes)) {
    for (const key of Object.keys(index)) {
      index[key] = unique(index[key]).sort();
    }
  }
  return indexes;
}

function buildSummary(facts) {
  const summary = emptySummary();
  summary.total = facts.length;
  for (const fact of facts) {
    if (fact.status === "observed") summary.observedCount += 1;
    if (fact.status === "derived") summary.derivedCount += 1;
    if (fact.status === "candidate") summary.candidateCount += 1;
    summary.byCategory[fact.category] =
      (summary.byCategory[fact.category] ?? 0) + 1;
    summary.byConfidence[fact.confidence] =
      (summary.byConfidence[fact.confidence] ?? 0) + 1;
  }
  return summary;
}

function emptyIndexes() {
  return {
    byCategory: {},
    bySubject: {},
    byPredicate: {},
    byStatus: {},
    byConfidence: {},
    bySourceFeature: {},
    byTag: {},
  };
}

function emptySummary() {
  return {
    total: 0,
    observedCount: 0,
    derivedCount: 0,
    candidateCount: 0,
    byCategory: {},
    byConfidence: {},
  };
}

function validateFact(fact, index, ids, errors) {
  if (!fact || typeof fact !== "object" || Array.isArray(fact)) {
    errors.push(`facts[${index}] should be an object`);
    return;
  }
  if (!fact.id || typeof fact.id !== "string") {
    errors.push(`facts[${index}].id should be a non-empty string`);
  } else if (ids.has(fact.id)) {
    errors.push(`duplicate fact id: ${fact.id}`);
  } else {
    ids.add(fact.id);
  }
  if (!allowedCategories.has(fact.category)) {
    errors.push(`facts[${index}].category is invalid`);
  }
  if (!fact.predicate || typeof fact.predicate !== "string") {
    errors.push(`facts[${index}].predicate should be non-empty`);
  }
  if (!fact.subject || typeof fact.subject !== "object" || Array.isArray(fact.subject)) {
    errors.push(`facts[${index}].subject should be an object`);
  }
  if (!allowedStatuses.has(fact.status)) {
    errors.push(`facts[${index}].status is invalid`);
  }
  if (!allowedConfidences.has(fact.confidence)) {
    errors.push(`facts[${index}].confidence is invalid`);
  }
  for (const key of ["sourceRefs", "evidence", "tags", "warnings"]) {
    if (!Array.isArray(fact[key])) {
      errors.push(`facts[${index}].${key} should be an array`);
    }
  }
  if (Array.isArray(fact.sourceRefs) && fact.sourceRefs.length === 0) {
    errors.push(`facts[${index}].sourceRefs should not be empty`);
  }
}

function validateIndexes(indexes, ids, errors) {
  if (!indexes || typeof indexes !== "object" || Array.isArray(indexes)) {
    errors.push("indexes should be an object");
    return;
  }
  for (const [indexName, index] of Object.entries(indexes)) {
    if (!index || typeof index !== "object" || Array.isArray(index)) {
      errors.push(`indexes.${indexName} should be an object`);
      continue;
    }
    for (const idList of Object.values(index)) {
      if (!Array.isArray(idList)) {
        errors.push(`indexes.${indexName} bucket should be an array`);
        continue;
      }
      for (const id of idList) {
        if (!ids.has(id)) {
          errors.push(`index ${indexName} references missing fact ${id}`);
        }
      }
    }
  }
}

function validateSummary(summary, facts, errors) {
  if (!summary || typeof summary !== "object" || Array.isArray(summary)) {
    errors.push("summary should be an object");
    return;
  }
  if (summary.total !== facts.length) {
    errors.push("summary.total should equal facts.length");
  }
  const counts = {
    observed: facts.filter((fact) => fact.status === "observed").length,
    derived: facts.filter((fact) => fact.status === "derived").length,
    candidate: facts.filter((fact) => fact.status === "candidate").length,
  };
  if (summary.observedCount !== undefined && summary.observedCount !== counts.observed) {
    errors.push("summary.observedCount is inconsistent");
  }
  if (summary.derivedCount !== undefined && summary.derivedCount !== counts.derived) {
    errors.push("summary.derivedCount is inconsistent");
  }
  if (summary.candidateCount !== undefined && summary.candidateCount !== counts.candidate) {
    errors.push("summary.candidateCount is inconsistent");
  }
}

function findForbiddenKeys(value, path, errors, seen = new WeakSet()) {
  if (!value || typeof value !== "object") return;
  if (seen.has(value)) return;
  seen.add(value);
  for (const [key, item] of Object.entries(value)) {
    if (key === "raw" || key === "relatedRelations") {
      errors.push(`forbidden key ${key} at ${path}.${key}`);
    }
    findForbiddenKeys(item, `${path}.${key}`, errors, seen);
  }
}

function findNonFiniteNumberPaths(value, path = "input", seen = new WeakSet()) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? [] : [path];
  }
  if (!value || typeof value !== "object") return [];
  if (seen.has(value)) return [];
  seen.add(value);
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => findNonFiniteNumberPaths(item, `${path}[${index}]`, seen));
  }
  return Object.entries(value).flatMap(([key, item]) => findNonFiniteNumberPaths(item, `${path}.${key}`, seen));
}

function normalizeCategory(value) {
  return allowedCategories.has(value) ? value : "relation";
}

function normalizeStatus(value) {
  return allowedStatuses.has(value) ? value : "candidate";
}

function normalizeConfidence(value) {
  return allowedConfidences.has(value) ? value : "unknown";
}

function normalizeSubject(subject = {}) {
  const safe = subject && typeof subject === "object" && !Array.isArray(subject)
    ? subject
    : {};
  return {
    type: String(safe.type ?? "unknown"),
    key: String(safe.key ?? ""),
    keys: normalizeArray(safe.keys).map(String),
    label: String(safe.label ?? ""),
  };
}

function normalizeSourceRef(ref = {}) {
  const safe = ref && typeof ref === "object" && !Array.isArray(ref)
    ? ref
    : {};
  return {
    featureGroup: String(safe.featureGroup ?? "unknown"),
    path: String(safe.path ?? ""),
    itemId: String(safe.itemId ?? ""),
  };
}

function sanitizeValue(value, seen = new WeakSet()) {
  if (value === undefined) return null;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (!value || typeof value !== "object") return value;
  if (seen.has(value)) return null;
  seen.add(value);
  if (Array.isArray(value)) return value.map((item) => sanitizeValue(item, seen));
  return Object.fromEntries(Object.entries(value)
    .filter(([key]) => key !== "raw" && key !== "relatedRelations")
    .map(([key, item]) => [key, sanitizeValue(item, seen)]));
}

function addIndex(index, key, id) {
  const safeKey = String(key || "unknown");
  if (!index[safeKey]) index[safeKey] = [];
  index[safeKey].push(id);
}

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function unique(items = []) {
  return [...new Set(items.filter((item) => item !== undefined && item !== null && item !== ""))];
}

function uniqueObjects(items = []) {
  const seen = new Set();
  const result = [];
  for (const item of items) {
    const key = stableStringify(item);
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(item);
  }
  return result;
}

function mergeConfidence(left, right) {
  const rank = { unknown: 0, low: 1, medium: 2, high: 3 };
  return rank[right] > rank[left] ? right : left;
}

function categoryRank(category) {
  const index = categoryOrder.indexOf(category);
  return index === -1 ? 999 : index;
}

function fnv1a(value) {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function slug(value) {
  return String(value)
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^\p{L}\p{N}_-]+/gu, "")
    .slice(0, 48) || "fact";
}
