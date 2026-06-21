import test from "node:test";
import assert from "node:assert/strict";

import {
  NATAL_FEATURE_VERSION,
  createEmptyNatalFeatureVector,
  normalizeNatalFeatureVector,
  validateNatalFeatureVector,
} from "../js/core/natal/natalFeatureContract.js";

test("empty natal feature vector has the full stable V2 structure", () => {
  const vector = createEmptyNatalFeatureVector();

  assert.equal(vector.featureVersion, NATAL_FEATURE_VERSION);
  assert.equal(vector.meta.gender, "unknown");
  assert.equal(vector.meta.source, "chart");
  assert.deepEqual(vector.meta.warnings, []);
  assert.deepEqual(Object.keys(vector.pillars), ["year", "month", "day", "hour"]);
  assert.deepEqual(vector.relationMatrix.items, []);
  assert.deepEqual(vector.relationMatrix.byPillarPair, {});
  assert.deepEqual(vector.relationMatrix.byRelationType, {});
  assert.deepEqual(vector.relationMatrix.dayStemRelations, []);
  assert.deepEqual(vector.relationMatrix.dayBranchRelations, []);
  assert.deepEqual(vector.tenGodStates, {});
});

test("normalizing sparse input preserves legacy fields and removes NaN", () => {
  const vector = normalizeNatalFeatureVector({
    meta: { gender: "" },
    dayMaster: { strengthScore: Number.NaN },
    pillars: { month: { stem: "甲" } },
    tenGods: { weightedCounts: { 正印: Number.NaN } },
  });

  assert.equal(vector.featureVersion, "natal-feature-v2");
  assert.equal(vector.meta.gender, "unknown");
  assert.equal(vector.pillars.month.stem, "甲");
  assert.equal(vector.pillars.day.stem, "");
  assert.equal(vector.dayMaster.strengthScore, null);
  assert.equal(vector.tenGods.weightedCounts.正印, null);
  assert.doesNotMatch(JSON.stringify(vector), /NaN/);
});

test("validation never throws for missing fields or NaN", () => {
  assert.doesNotThrow(() => validateNatalFeatureVector(null));
  assert.doesNotThrow(() => validateNatalFeatureVector({ elements: { counts: { wood: Number.NaN } } }));

  const result = validateNatalFeatureVector({
    meta: { gender: "other" },
    elements: { counts: { wood: Number.NaN } },
  });

  assert.equal(typeof result.valid, "boolean");
  assert.ok(Array.isArray(result.errors));
  assert.ok(Array.isArray(result.warnings));
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((item) => /NaN/.test(item)));
  assert.ok(result.warnings.some((item) => /gender/.test(item)));
});
