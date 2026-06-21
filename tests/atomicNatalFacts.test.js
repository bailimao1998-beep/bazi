import { readFileSync } from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";

import { calculateBazi } from "../js/core/bazi/calculateBazi.js";
import { buildBaseBaziViewModel } from "../js/core/bazi/buildBaseBaziViewModel.js";
import { buildNatalFeatureVector } from "../js/core/natal/natalFeatureVector.js";
import { buildAtomicNatalFacts } from "../js/core/natal/atomicNatalFactEngine.js";
import { buildAtomicFactContract } from "../js/core/natal/facts/buildAtomicFactContract.js";
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
  assert.equal(Object.hasOwn(resultA, "version"), false);
  assert.equal(resultA.debug.contractValidation.valid, true);
  assert.equal(resultA.debug.contractFactCount, resultA.contractFacts.length);
  assert.equal(resultA.debug.contractCategoryCounts.pillar, resultA.summary.byCategory.pillar);
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

test("missing numeric values do not become zero but real zero is retained", () => {
  const contract = buildAtomicFactContract({
    dayMaster: {
      stem: "甲",
      element: "wood",
      strengthScore: null,
    },
    elements: {
      counts: {
        wood: "",
        fire: "   ",
        earth: 0,
      },
      ratios: {
        wood: null,
        fire: "",
        earth: 0,
      },
    },
    tenGodStates: {
      比肩: {
        weightedCount: null,
        visibleCount: "",
        hiddenCount: "   ",
        mainQiCount: 0,
      },
    },
    kinshipFeatures: {
      father: {
        mappingStatus: "resolved",
        starProfile: {
          weightedCount: "",
          weightedByTenGod: {
            偏财: null,
            正财: 0,
          },
        },
      },
    },
    growthStageFeatures: {
      referenceStem: "甲",
      byPillar: {
        year: { stageIndex: "", stage: "unknown" },
        month: { stageIndex: "   ", stage: "unknown" },
        day: { stageIndex: null, stage: "unknown" },
        hour: { stageIndex: 0, stage: "长生" },
      },
    },
    workChains: {
      nodes: [
        { id: "node_missing", weight: "" },
        { id: "node_zero", weight: 0 },
      ],
      chains: [
        {
          id: "chain_missing",
          hiddenNodeCount: "",
          priorityScore: "   ",
        },
        {
          id: "chain_zero",
          hiddenNodeCount: 0,
          priorityScore: 0,
        },
      ],
    },
  });

  assert.equal(contract.facts.some((fact) => fact.predicate === "strength_score"), false);
  assert.equal(hasScalarFact(contract, "element", "wood", "element_count"), false);
  assert.equal(hasScalarFact(contract, "element", "fire", "element_count"), false);
  assert.equal(hasScalarFact(contract, "element", "earth", "element_count", 0), true);
  assert.equal(hasScalarFact(contract, "element", "earth", "element_ratio", 0), true);

  const tenGodPresence = findFact(contract, "ten_god", "比肩", "ten_god_presence");
  assert.equal(Object.hasOwn(tenGodPresence.value, "weightedCount"), false);
  assert.equal(Object.hasOwn(tenGodPresence.value, "visibleCount"), false);
  assert.equal(Object.hasOwn(tenGodPresence.value, "hiddenCount"), false);
  assert.equal(tenGodPresence.value.mainQiCount, 0);

  const kinshipPresence = findFact(contract, "kinship", "father", "kinship_star_presence");
  assert.equal(Object.hasOwn(kinshipPresence.value, "weightedCount"), false);
  assert.deepEqual(kinshipPresence.value.weightedByTenGod, { 正财: 0 });

  const missingNode = findFact(contract, "work_node", "node_missing", "work_node_role");
  const zeroNode = findFact(contract, "work_node", "node_zero", "work_node_role");
  assert.equal(Object.hasOwn(missingNode.value, "weight"), false);
  assert.equal(zeroNode.value.weight, 0);

  const missingChain = findFact(contract, "work_chain", "chain_missing", "work_chain_candidate");
  const zeroChain = findFact(contract, "work_chain", "chain_zero", "work_chain_candidate");
  assert.equal(Object.hasOwn(missingChain.value, "hiddenNodeCount"), false);
  assert.equal(Object.hasOwn(missingChain.value, "priorityScore"), false);
  assert.equal(zeroChain.value.hiddenNodeCount, 0);
  assert.equal(zeroChain.value.priorityScore, 0);

  const yearGrowth = findFact(contract, "growth_stage", "year", "growth_stage");
  const hourGrowth = findFact(contract, "growth_stage", "hour", "growth_stage");
  assert.equal(Object.hasOwn(yearGrowth.value, "stageIndex"), false);
  assert.equal(hourGrowth.value.stageIndex, 0);
});

test("void references are atomic by reference pillar", () => {
  const contract = buildAtomicFactContract({
    voidFeatures: {
      primaryReference: "day",
      references: {
        day: { referencePillar: "day", voidBranches: ["寅", "卯"] },
        year: { referencePillar: "year", voidBranches: ["申", "酉"] },
      },
      byReference: {
        day: {
          byPillar: {
            day: { isVoid: false, branchMainTenGod: "比肩" },
          },
        },
        year: {
          byPillar: {
            day: { isVoid: true, branchMainTenGod: "比肩" },
          },
        },
      },
    },
  });

  const dayReference = findFact(contract, "void", "day", "void_reference");
  const yearReference = findFact(contract, "void", "year", "void_reference");

  assert.notEqual(dayReference.id, yearReference.id);
  assert.equal(dayReference.value.referencePillar, "day");
  assert.deepEqual(dayReference.value.voidBranches, ["寅", "卯"]);
  assert.equal(yearReference.value.referencePillar, "year");
  assert.deepEqual(yearReference.value.voidBranches, ["申", "酉"]);
  assert.ok(dayReference.sourceRefs.some((ref) => ref.path === "references.day"));
  assert.ok(yearReference.sourceRefs.some((ref) => ref.path === "references.year"));

  const dayState = contract.facts.find((fact) =>
    fact.category === "void" &&
    fact.subject.key === "day:day" &&
    fact.predicate === "pillar_void_state",
  );
  const yearState = contract.facts.find((fact) =>
    fact.category === "void" &&
    fact.subject.key === "year:day" &&
    fact.predicate === "pillar_void_state",
  );
  assert.equal(dayState.value.referencePillar, "day");
  assert.equal(yearState.value.referencePillar, "year");
});

test("storage opening signal only appears for real storage opening candidates", () => {
  const contract = buildAtomicFactContract({
    storageFeatures: {
      byPillar: {
        year: {
          isStorage: false,
          hasOpeningSignal: true,
          openingSignalTypes: ["clash"],
        },
        month: {
          isStorage: true,
          hasOpeningSignal: false,
          openingSignalTypes: ["clash"],
        },
        day: {
          isStorage: true,
          hasOpeningSignal: true,
          openingSignalTypes: [],
          openingSignalRelationIds: [],
        },
        hour: {
          isStorage: true,
          hasOpeningSignal: true,
          openingSignalTypes: ["clash"],
          openingSignalRelationIds: ["r1"],
        },
      },
    },
  });

  const openingSignals = contract.facts.filter((fact) => fact.predicate === "opening_signal");
  assert.equal(openingSignals.length, 1);
  assert.equal(openingSignals[0].subject.key, "hour");
  assert.equal(openingSignals[0].status, "candidate");
});

test("unresolved or missing kinship mapping states remain candidate", () => {
  const contract = buildAtomicFactContract({
    kinshipFeatures: {
      father: { mappingStatus: "unknown" },
      mother: { mappingStatus: "missing" },
      siblings: { mappingStatus: "unresolved" },
      spouse: {},
      children: { mappingStatus: "resolved" },
    },
  });

  for (const key of ["father", "mother", "siblings", "spouse"]) {
    for (const predicate of ["kinship_mapping", "kinship_star_presence", "kinship_star_visibility"]) {
      assert.equal(findFact(contract, "kinship", key, predicate).status, "candidate");
    }
  }

  for (const predicate of ["kinship_mapping", "kinship_star_presence", "kinship_star_visibility"]) {
    assert.equal(findFact(contract, "kinship", "children", predicate).status, "derived");
  }
});

test("semantic fact ids are stable when unordered feature arrays are reversed", () => {
  const featureVector = buildFeatureVector();
  const reordered = structuredClone(featureVector);

  for (const pillar of Object.values(reordered.pillars)) {
    pillar.hiddenStems?.reverse();
  }
  reordered.climateProfile.priorityNeeds.reverse();
  reordered.climateProfile.candidateElements.reverse();
  reordered.climateProfile.existingSupport.reverse();
  reordered.climateProfile.missingSupport.reverse();
  reordered.climateProfile.passThroughCandidates.reverse();
  reordered.workChains.actualConflictCandidates.reverse();

  const originalIds = new Set(buildAtomicFactContract(featureVector).facts.map((fact) => fact.id));
  const reorderedIds = new Set(buildAtomicFactContract(reordered).facts.map((fact) => fact.id));

  assert.deepEqual(reorderedIds, originalIds);
});

test("atomic contract fact budgets stay within stable ranges", () => {
  const featureVector = buildFeatureVector();
  const result = buildAtomicNatalFacts(featureVector);
  const counts = result.summary.byCategory;

  assert.ok(result.summary.total >= 120, `too few facts: ${result.summary.total}`);
  assert.ok(result.summary.total <= 280, `too many facts: ${result.summary.total}`);

  for (const [category, [min, max]] of Object.entries({
    pillar: [20, 36],
    void: [6, 14],
    storage: [4, 8],
    kinship: [18, 24],
    climate: [8, 28],
    work_node: [8, 24],
    work_edge: [8, 40],
    work_chain: [1, 20],
  })) {
    assert.ok(counts[category] >= min, `${category} below budget: ${counts[category]}`);
    assert.ok(counts[category] <= max, `${category} above budget: ${counts[category]}`);
  }

  const duplicateKeys = new Map();
  for (const fact of result.contractFacts) {
    const key = `${fact.category}:${fact.subject.type}:${fact.subject.key}:${fact.predicate}`;
    duplicateKeys.set(key, (duplicateKeys.get(key) ?? 0) + 1);
  }
  for (const [key, count] of duplicateKeys) {
    assert.ok(count <= 2, `${key} duplicated ${count} times`);
  }

  const openingSignalFacts = result.contractFacts.filter((fact) => fact.predicate === "opening_signal");
  const trueOpeningSignalCount = Object.values(featureVector.storageFeatures.byPillar)
    .filter((item) =>
      item.isStorage === true &&
      item.hasOpeningSignal === true &&
      [
        ...(item.openingSignalTypes ?? []),
        ...(item.openingSignalRelationIds ?? []),
      ].filter(Boolean).length > 0,
    ).length;
  assert.ok(openingSignalFacts.length <= trueOpeningSignalCount);
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

function findFact(contract, category, subjectKey, predicate) {
  const fact = contract.facts.find((item) =>
    item.category === category &&
    item.subject.key === subjectKey &&
    item.predicate === predicate,
  );
  assert.ok(fact, `missing ${category}:${subjectKey}:${predicate}`);
  return fact;
}

function hasScalarFact(contract, category, subjectKey, predicate, value) {
  return contract.facts.some((fact) =>
    fact.category === category &&
    fact.subject.key === subjectKey &&
    fact.predicate === predicate &&
    (arguments.length < 5 || fact.value === value),
  );
}
