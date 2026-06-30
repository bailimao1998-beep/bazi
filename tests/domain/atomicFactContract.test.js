import test from "node:test";
import assert from "node:assert/strict";

import {
  createEmptyAtomicNatalFacts,
  normalizeAtomicNatalFacts,
  validateAtomicNatalFacts,
} from "../../js/domain/natal/facts/atomicFactContract.js";

test("empty atomic natal facts contract is stable and valid", () => {
  const result = createEmptyAtomicNatalFacts();

  assert.equal(result.version, "atomic-natal-facts-v1");
  assert.deepEqual(result.facts, []);
  assert.deepEqual(Object.keys(result.indexes), [
    "byCategory",
    "bySubject",
    "byPredicate",
    "byStatus",
    "byConfidence",
    "bySourceFeature",
    "byTag",
  ]);
  assert.equal(validateAtomicNatalFacts(result).valid, true);
});

test("atomic fact validator reports invalid structures without throwing", () => {
  assert.doesNotThrow(() => validateAtomicNatalFacts(null));

  const result = validateAtomicNatalFacts({
    version: "atomic-natal-facts-v1",
    facts: [
      {
        id: "bad",
        category: "relation",
        subject: {},
        predicate: "",
        value: { raw: {} },
        status: "observed",
        confidence: "high",
        sourceRefs: [],
        evidence: [],
        tags: [],
        warnings: [],
      },
    ],
    indexes: { byCategory: { relation: ["missing"] } },
    summary: { total: 2 },
    warnings: [],
  });

  assert.equal(result.valid, false);
  assert.ok(result.errors.some((item) => /predicate/.test(item)));
  assert.ok(result.errors.some((item) => /raw/.test(item)));
  assert.ok(result.errors.some((item) => /index/.test(item)));
  assert.ok(result.errors.some((item) => /summary.total/.test(item)));
});

test("atomic fact validator rejects invalid machine fact arrays without fallback", () => {
  const validContract = createEmptyAtomicNatalFacts();

  for (const contractFacts of [{}, null]) {
    const result = validateAtomicNatalFacts({
      factContractVersion: "atomic-natal-facts-v1",
      contractFacts,
      facts: validContract.facts,
      legacyFacts: validContract.facts,
      indexes: validContract.indexes,
      summary: validContract.summary,
      warnings: [],
    });

    assert.equal(result.valid, false);
    assert.ok(result.errors.some((item) => /contractFacts/.test(item)));
  }

  const pureResult = validateAtomicNatalFacts({
    version: "atomic-natal-facts-v1",
    facts: "not an array",
    indexes: validContract.indexes,
    summary: validContract.summary,
    warnings: [],
  });

  assert.equal(pureResult.valid, false);
  assert.ok(pureResult.errors.some((item) => /facts/.test(item)));
});

test("atomic fact validator only checks the machine contract projection", () => {
  const contract = normalizeAtomicNatalFacts({
    facts: [validFact()],
    warnings: [],
  });

  const legacyWithOldShape = {
    raw: { legacy: true },
    score: Number.POSITIVE_INFINITY,
  };

  const wrapperResult = validateAtomicNatalFacts({
    factContractVersion: "atomic-natal-facts-v1",
    contractFacts: contract.facts,
    indexes: contract.indexes,
    summary: contract.summary,
    warnings: [],
    facts: [legacyWithOldShape],
    legacyFacts: [legacyWithOldShape],
  });

  assert.equal(wrapperResult.valid, true);

  const rawContract = normalizeAtomicNatalFacts({
    facts: [validFact()],
    warnings: [],
  });
  rawContract.facts[0].value.raw = {};

  const rawResult = validateAtomicNatalFacts(rawContract);
  assert.equal(rawResult.valid, false);
  assert.ok(rawResult.errors.some((item) => /raw/.test(item)));

  const nonFiniteContract = normalizeAtomicNatalFacts({
    facts: [validFact()],
    warnings: [],
  });
  nonFiniteContract.facts[0].value.score = Number.NaN;

  const nonFiniteResult = validateAtomicNatalFacts(nonFiniteContract);
  assert.equal(nonFiniteResult.valid, false);
  assert.ok(nonFiniteResult.errors.some((item) => /non-finite/.test(item)));
});

function validFact() {
  return {
    category: "day_master",
    subject: {
      type: "day_master",
      key: "day_master",
      keys: ["day_master"],
      label: "day_master",
    },
    predicate: "day_master_stem",
    value: { stem: "甲" },
    status: "observed",
    confidence: "high",
    sourceRefs: [
      {
        featureGroup: "dayMaster",
        path: "stem",
        itemId: "day_master",
      },
    ],
    evidence: [],
    tags: ["day_master_stem"],
    warnings: [],
  };
}
