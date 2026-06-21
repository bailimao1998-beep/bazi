import test from "node:test";
import assert from "node:assert/strict";

import {
  createEmptyAtomicNatalFacts,
  validateAtomicNatalFacts,
} from "../js/core/natal/facts/atomicFactContract.js";

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
