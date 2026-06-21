import { readFileSync } from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";

import { calculateBazi } from "../js/core/bazi/calculateBazi.js";
import { buildBaseBaziViewModel } from "../js/core/bazi/buildBaseBaziViewModel.js";
import { buildNatalFeatureVector } from "../js/core/natal/natalFeatureVector.js";
import { validateNatalFeatureVector } from "../js/core/natal/natalFeatureContract.js";

function loadLocations() {
  global.window = {};
  Function(readFileSync("js/locationData.js", "utf8"))();
  return global.window.FortuneLocationData;
}

test("natal feature V2 integrates with the real bazi calculation entry", () => {
  const chart = calculateBazi({
    gender: "male",
    birthDate: "1998-09-11",
    birthTime: "00:30",
    birthProvince: "广东省",
    birthplace: "广州",
    birthLongitude: 114.967,
    timezone: "Asia/Shanghai",
    trueSolarTime: false,
  }, {
    locations: loadLocations(),
  });
  const baseBaziViewModel = buildBaseBaziViewModel(chart);
  const featureVector = buildNatalFeatureVector({ chart, baseBaziViewModel });

  assert.equal(featureVector.featureVersion, "natal-feature-v2");
  assert.equal(featureVector.meta.gender, "male");
  assert.ok(featureVector.pillars.year);
  assert.ok(featureVector.pillars.month);
  assert.ok(featureVector.pillars.day);
  assert.ok(featureVector.pillars.hour);
  assert.equal(Object.keys(featureVector.tenGodStates).length, 10);
  assert.ok(Array.isArray(featureVector.relationMatrix.items));
  assert.ok(featureVector.palaceFeatures.year);
  assert.ok(featureVector.palaceFeatures.month);
  assert.ok(featureVector.palaceFeatures.day);
  assert.ok(featureVector.palaceFeatures.hour);
  assert.ok(featureVector.palaceFeatures.spousePalace);
  assert.ok(featureVector.kinshipFeatures.father);
  assert.ok(featureVector.kinshipFeatures.mother);
  assert.ok(featureVector.kinshipFeatures.siblings);
  assert.ok(featureVector.kinshipFeatures.spouse);
  assert.ok(featureVector.kinshipFeatures.children);
  assert.ok(Array.isArray(featureVector.palaceFeatures.year.relationTypes));
  assert.ok(Array.isArray(featureVector.palaceFeatures.year.pillarRelationIds));
  assert.ok(featureVector.kinshipFeatures.spouse.starProfile.primary);
  assert.ok(featureVector.kinshipFeatures.spouse.starProfile.secondary);
  assert.equal(typeof featureVector.kinshipFeatures.spouse.starProfile.weightedByTenGod, "object");
  assert.ok(Array.isArray(featureVector.kinshipFeatures.spouse.candidateStarProfiles));
  assert.ok(featureVector.voidFeatures);
  assert.ok(featureVector.storageFeatures);
  assert.ok(featureVector.growthStageFeatures);
  assert.equal(typeof featureVector.voidFeatures.byPillar, "object");
  assert.equal(typeof featureVector.storageFeatures.byPillar, "object");
  assert.equal(typeof featureVector.growthStageFeatures.byPillar, "object");
  assert.equal(featureVector.growthStageFeatures.referenceStem, featureVector.dayMaster.stem);
  assert.ok(featureVector.climateProfile);
  assert.ok(featureVector.workChains);
  assert.equal(typeof featureVector.climateProfile.scores, "object");
  assert.ok(Array.isArray(featureVector.climateProfile.priorityNeeds));
  assert.equal(featureVector.climateProfile.monthBranch, featureVector.pillars.month.branch);
  assert.notEqual(featureVector.climateProfile.confidence, "unknown");
  assert.ok(Array.isArray(featureVector.workChains.nodes));
  assert.ok(Array.isArray(featureVector.workChains.edges));
  assert.ok(Array.isArray(featureVector.workChains.chains));
  assert.equal(typeof featureVector.workChains.summary, "object");
  assert.ok(Array.isArray(featureVector.workChains.potentialEdges));
  assert.ok(Array.isArray(featureVector.workChains.activatedEdges));
  assert.ok(Array.isArray(featureVector.workChains.coexistenceCandidates));
  assert.ok(Array.isArray(featureVector.workChains.actualConflictCandidates));
  assert.ok(featureVector.workChains.nodes.every((node) =>
    typeof node.defaultRole === "string" &&
    typeof node.resolvedRole === "string" &&
    Array.isArray(node.roleEvidence)
  ));
  assert.ok(featureVector.workChains.edges.every((edge) =>
    ["potential", "activated"].includes(edge.activation)
  ));
  assert.ok(featureVector.workChains.edges.every((edge) =>
    typeof edge.potentialConfidence === "string" &&
    typeof edge.activatedConfidence === "string" &&
    typeof edge.confidence === "string" &&
    Array.isArray(edge.relationIds) &&
    Array.isArray(edge.scopes)
  ));
  assert.ok(featureVector.workChains.coexistenceCandidates.every((item) =>
    item.candidateStatus === "candidate" &&
    ["available", "missing", "unknown"].includes(item.availabilityStatus)
  ));
  assert.ok(featureVector.workChains.actualConflictCandidates.every((item) =>
    item.candidateStatus === "candidate" &&
    ["available", "missing", "unknown"].includes(item.availabilityStatus) &&
    Array.isArray(item.relationIds)
  ));
  assert.ok(featureVector.workChains.nodes.length >= 8);
  assert.ok(featureVector.workChains.edges.length > 0);
  assert.equal(featureVector.workChains.summary.nodeCount, featureVector.workChains.nodes.length);
  assert.equal(featureVector.workChains.summary.edgeCount, featureVector.workChains.edges.length);
  assert.equal(featureVector.workChains.summary.chainCount, featureVector.workChains.chains.length);

  const validation = validateNatalFeatureVector(featureVector);
  assert.equal(validation.valid, true, validation.errors.join("; "));

  for (const state of Object.values(featureVector.tenGodStates)) {
    assert.equal(Number.isFinite(state.weightedCount), true);
    assert.ok(state.weightedCount >= 0);
    assert.ok(state.weightedCount <= 20, `${state.name} weightedCount should stay bounded`);
  }

  for (const relation of featureVector.relationMatrix.items) {
    assert.ok(relation.relationType);
    assert.ok(relation.layer);
    assert.ok(Array.isArray(relation.participants));
    assert.equal(typeof relation.affects, "object");
  }

  for (const relation of featureVector.relationMatrix.dayStemRelations) {
    if (!relation.affects.dayBranch) {
      assert.equal(relation.affects.spousePalace, false);
    }
  }

  assert.doesNotMatch(JSON.stringify(featureVector), /NaN/);
  assert.doesNotMatch(JSON.stringify(featureVector), /undefined/);
  assertNoRelationRaw(featureVector.palaceFeatures);
  assertNoRelationRaw(featureVector.kinshipFeatures);
});

function assertNoRelationRaw(value, seen = new WeakSet()) {
  if (!value || typeof value !== "object") return;
  if (seen.has(value)) return;
  seen.add(value);

  if (Object.hasOwn(value, "raw")) {
    assert.fail("feature snapshots should not embed relation raw objects");
  }
  if (Object.hasOwn(value, "relatedRelations")) {
    assert.fail("feature snapshots should not embed full relatedRelations objects");
  }

  for (const item of Object.values(value)) {
    assertNoRelationRaw(item, seen);
  }
}
