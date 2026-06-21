import test from "node:test";
import assert from "node:assert/strict";

import { buildAtomicNatalFacts } from "../js/core/natal/atomicNatalFactEngine.js";

function baseFeatureVector(relationMatrix) {
  return {
    dayMaster: {},
    pillars: {
      year: { key: "year", name: "年柱", label: "甲子", stem: "甲", branch: "子" },
      month: { key: "month", name: "月柱", label: "己丑", stem: "己", branch: "丑" },
      day: { key: "day", name: "日柱", label: "庚午", stem: "庚", branch: "午" },
      hour: { key: "hour", name: "时柱", label: "辛未", stem: "辛", branch: "未" },
    },
    tenGods: { groupCounts: {}, weightedCounts: {} },
    elements: { counts: {}, flowChains: [] },
    structure: {},
    relations: [
      {
        type: "地支六冲",
        name: "旧字段日柱冲",
        affectsDayBranch: true,
        text: "旧字段不应作为事实推理依据",
      },
    ],
    relationMatrix,
  };
}

test("relation facts route from relationMatrix and keep structured metadata", () => {
  const relation = {
    id: "month-stem_day-stem_stem_combine",
    relationType: "stem_combine",
    layer: "stem",
    left: { pillar: "month", position: "stem", value: "己" },
    right: { pillar: "day", position: "stem", value: "庚" },
    participants: [
      { pillar: "month", position: "stem", value: "己" },
      { pillar: "day", position: "stem", value: "庚" },
    ],
    members: [
      { pillar: "month", position: "stem", value: "己" },
      { pillar: "day", position: "stem", value: "庚" },
    ],
    affects: {
      dayStem: true,
      dayBranch: false,
      monthStem: true,
      monthBranch: false,
      spousePalace: false,
    },
    formation: "direct",
    canTransform: false,
    transformed: false,
    confidence: "medium",
    evidence: ["月干己与日干庚形成天干关系"],
  };

  const result = buildAtomicNatalFacts(baseFeatureVector({
    items: [relation],
    byPillarPair: { "month-day": [relation] },
    byRelationType: { stem_combine: [relation] },
    dayStemRelations: [relation],
    dayBranchRelations: [],
    monthStemRelations: [relation],
    monthBranchRelations: [],
  }));

  const fact = result.facts.find((item) => item.id.startsWith("relation-"));
  assert.equal(fact.factLevel, "structural");
  assert.equal(fact.relationType, "stem_combine");
  assert.equal(fact.layer, "stem");
  assert.equal(fact.affects.spousePalace, false);
  assert.equal(fact.domains.includes("spouse"), false);
  assert.deepEqual(fact.participants, relation.participants);
});

test("day-branch rules match only relationMatrix dayBranchRelations", () => {
  const stemOnlyRelation = {
    id: "month-stem_day-stem_stem_clash",
    relationType: "stem_clash",
    layer: "stem",
    left: { pillar: "month", position: "stem", value: "甲" },
    right: { pillar: "day", position: "stem", value: "庚" },
    participants: [
      { pillar: "month", position: "stem", value: "甲" },
      { pillar: "day", position: "stem", value: "庚" },
    ],
    members: [],
    affects: {
      dayStem: true,
      dayBranch: false,
      monthStem: true,
      monthBranch: false,
      spousePalace: false,
    },
    formation: "direct",
    canTransform: false,
    transformed: false,
    confidence: "medium",
    evidence: ["天干冲不等于日支冲"],
  };
  const result = buildAtomicNatalFacts(baseFeatureVector({
    items: [stemOnlyRelation],
    byPillarPair: { "month-day": [stemOnlyRelation] },
    byRelationType: { stem_clash: [stemOnlyRelation] },
    dayStemRelations: [stemOnlyRelation],
    dayBranchRelations: [],
    monthStemRelations: [stemOnlyRelation],
    monthBranchRelations: [],
  }));

  assert.equal(result.facts.some((fact) => fact.id === "day_branch_clashed"), false);
});
