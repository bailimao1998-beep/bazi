import { readFileSync } from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";

import { calculateBazi } from "../js/core/bazi/calculateBazi.js";
import { buildBaseBaziViewModel } from "../js/core/bazi/buildBaseBaziViewModel.js";
import { buildNatalFeatureVector } from "../js/core/natal/natalFeatureVector.js";
import { buildAtomicNatalFacts } from "../js/core/natal/atomicNatalFactEngine.js";
import { validateAtomicNatalFacts } from "../js/core/natal/facts/atomicFactContract.js";

function loadLocations() {
  global.window = {};
  Function(readFileSync("js/locationData.js", "utf8"))();
  return global.window.FortuneLocationData;
}

function buildFeatureVector(input = {}) {
  const chart = calculateBazi({
    gender: "unknown",
    birthDate: "1998-09-11",
    birthTime: "00:30",
    birthProvince: "广东省",
    birthplace: "广州",
    birthLongitude: 114.967,
    timezone: "Asia/Shanghai",
    trueSolarTime: false,
    ...input,
  }, {
    locations: loadLocations(),
  });
  const baseBaziViewModel = buildBaseBaziViewModel(chart);
  return buildNatalFeatureVector({ chart, baseBaziViewModel });
}

test("atomic natal facts expose deterministic contract facts and keep legacy facts", () => {
  const featureVector = buildFeatureVector();
  const resultA = buildAtomicNatalFacts(featureVector);
  const resultB = buildAtomicNatalFacts(featureVector);

  assert.ok(resultA.facts.length > 0, "legacy facts should remain for current reports");
  assert.equal(resultA.factContractVersion, "atomic-natal-facts-v1");
  assert.deepEqual(resultA.contractFacts, resultB.contractFacts);
  assert.deepEqual(resultA.indexes, resultB.indexes);
  assert.deepEqual(resultA.summary, resultB.summary);
  assert.equal(new Set(resultA.contractFacts.map((fact) => fact.id)).size, resultA.contractFacts.length);
  assert.equal(validateAtomicNatalFacts(resultA).valid, true);
});

test("atomic natal facts cover stable feature groups with source refs", () => {
  const featureVector = buildFeatureVector();
  const result = buildAtomicNatalFacts(featureVector);
  const categories = new Set(result.contractFacts.map((fact) => fact.category));

  for (const expected of [
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
    "work_edge",
    "work_chain",
  ]) {
    assert.ok(categories.has(expected), `missing category ${expected}`);
  }

  for (const fact of result.contractFacts) {
    assert.ok(fact.id);
    assert.ok(fact.predicate);
    assert.ok(fact.subject && typeof fact.subject === "object");
    assert.match(fact.status, /^(observed|derived|candidate)$/);
    assert.match(fact.confidence, /^(unknown|low|medium|high)$/);
    assert.ok(Array.isArray(fact.sourceRefs));
    assert.ok(fact.sourceRefs.length > 0);
    assert.ok(Array.isArray(fact.evidence));
    assert.ok(Array.isArray(fact.tags));
    assert.ok(Array.isArray(fact.warnings));
  }
});

test("atomic natal facts preserve candidate and derived boundaries", () => {
  const featureVector = buildFeatureVector();
  const result = buildAtomicNatalFacts(featureVector);

  assert.ok(result.contractFacts.some((fact) =>
    fact.category === "work_edge" &&
    fact.value.activation === "potential" &&
    fact.status === "candidate",
  ));
  assert.ok(result.contractFacts.some((fact) =>
    fact.category === "work_edge" &&
    fact.value.activation === "activated" &&
    fact.status === "derived",
  ));
  assert.ok(result.contractFacts.some((fact) =>
    fact.category === "work_chain" &&
    fact.status === "candidate",
  ));
  assert.ok(result.contractFacts.some((fact) =>
    fact.category === "storage" &&
    fact.predicate === "opening_signal" &&
    fact.status === "candidate",
  ));
  assert.ok(result.contractFacts.some((fact) =>
    fact.category === "climate" &&
    fact.predicate === "climate_candidate_element" &&
    fact.status === "candidate",
  ));
});

test("unknown gender kinship mapping facts stay candidate", () => {
  const featureVector = buildFeatureVector({ gender: "unknown" });
  const result = buildAtomicNatalFacts(featureVector);

  assert.ok(result.contractFacts.some((fact) =>
    fact.category === "kinship" &&
    fact.predicate === "kinship_mapping" &&
    fact.subject.key === "spouse" &&
    fact.status === "candidate",
  ));
});

test("atomic natal facts are json safe and indexes match facts", () => {
  const result = buildAtomicNatalFacts(buildFeatureVector());
  const text = JSON.stringify(result);

  assert.doesNotMatch(text, /NaN|undefined/);
  assertNoForbiddenKeys(result.contractFacts);
  assert.equal(result.summary.total, result.contractFacts.length);

  const ids = new Set(result.contractFacts.map((fact) => fact.id));
  for (const index of Object.values(result.indexes)) {
    for (const idsInBucket of Object.values(index)) {
      for (const id of idsInBucket) {
        assert.ok(ids.has(id), `index references missing fact ${id}`);
      }
    }
  }
});

function assertNoForbiddenKeys(value, seen = new WeakSet()) {
  if (!value || typeof value !== "object") return;
  if (seen.has(value)) return;
  seen.add(value);

  for (const key of Object.keys(value)) {
    assert.notEqual(key, "raw");
    assert.notEqual(key, "relatedRelations");
  }

  for (const item of Object.values(value)) {
    assertNoForbiddenKeys(item, seen);
  }
}
