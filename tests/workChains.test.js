import test from "node:test";
import assert from "node:assert/strict";

import { buildRelationMatrix } from "../js/core/natal/featureBuilders/buildRelationMatrix.js";
import { buildWorkChains } from "../js/core/natal/featureBuilders/buildWorkChains.js";
import {
  DEFAULT_WORK_ROLE_MAPPING,
} from "../js/core/natal/config/climateAndWorkConfig.js";

const pillars = {
  year: {
    key: "year",
    stem: "戊",
    branch: "辰",
    stemTenGod: "偏财",
    branchMainTenGod: "偏财",
    hiddenStems: [
      { stem: "戊", tenGod: "偏财", role: "主气" },
      { stem: "乙", tenGod: "劫财", role: "中气" },
      { stem: "癸", tenGod: "正印", role: "余气" },
    ],
  },
  month: {
    key: "month",
    stem: "丙",
    branch: "午",
    stemTenGod: "食神",
    branchMainTenGod: "伤官",
    hiddenStems: [
      { stem: "丁", tenGod: "伤官", role: "主气" },
    ],
  },
  day: {
    key: "day",
    stem: "甲",
    branch: "寅",
    stemTenGod: "日主",
    branchMainTenGod: "比肩",
    hiddenStems: [
      { stem: "甲", tenGod: "比肩", role: "主气" },
      { stem: "丙", tenGod: "食神", role: "中气" },
      { stem: "戊", tenGod: "偏财", role: "余气" },
    ],
  },
  hour: {
    key: "hour",
    stem: "庚",
    branch: "申",
    stemTenGod: "七杀",
    branchMainTenGod: "七杀",
    hiddenStems: [
      { stem: "庚", tenGod: "七杀", role: "主气" },
    ],
  },
};

test("role mapping keeps self, separates mediator, and retains compatibility role", () => {
  const result = buildWorkChains({
    dayMaster: { stem: "甲" },
    pillars,
    relationMatrix: { items: [] },
  });

  const self = result.nodes.find((item) => item.id === "day.stem");
  const output = result.nodes.find((item) => item.id === "month.stem");
  const wealth = result.nodes.find((item) => item.id === "year.stem");

  assert.equal(self.defaultRole, "self");
  assert.equal(self.resolvedRole, "self");
  assert.equal(output.defaultRole, "mediator");
  assert.equal(output.resolvedRole, "mediator");
  assert.equal(output.role, "mediator");
  assert.equal(wealth.resolvedRole, "use");
  assert.ok(Array.isArray(output.roleEvidence));
});

test("hidden nodes participate through low-confidence internal edges", () => {
  const result = buildWorkChains({
    dayMaster: { stem: "甲" },
    pillars,
    relationMatrix: { items: [] },
  });

  const hiddenId = "day.branch.hidden.1";
  assert.ok(result.nodes.some((item) => item.id === hiddenId));
  assert.ok(result.edges.some((edge) =>
    (edge.source === hiddenId || edge.target === hiddenId) &&
    edge.scope.includes("internal_hidden"),
  ));
  assert.ok(result.chains.some((chain) =>
    chain.nodeIds.includes(hiddenId),
  ));
  assert.ok(result.chains
    .filter((chain) => chain.nodeIds.includes(hiddenId))
    .every((chain) => chain.confidence === "low"));
});

test("explicit stem control activates and merges the potential control edge", () => {
  const relationMatrix = buildRelationMatrix({
    pillars,
    relations: [{
      type: "天干相克",
      pillars: ["日柱", "时柱"],
      ganzhi: ["甲寅", "庚申"],
    }],
  });

  const result = buildWorkChains({
    dayMaster: { stem: "甲" },
    pillars,
    relationMatrix,
    climateProfile: {
      passThroughCandidates: [{
        conflictElements: ["metal", "wood"],
        mediatorElement: "water",
        mediatorPresent: true,
        label: "金木之间以水作通关候选",
      }],
    },
  });

  const matching = result.edges.filter((edge) =>
    edge.semanticType === "control" &&
    edge.source === "hour.stem" &&
    edge.target === "day.stem",
  );

  assert.equal(matching.length, 1);
  assert.equal(matching[0].activation, "activated");
  assert.ok(matching[0].relationIds.length >= 1);
  assert.ok(matching[0].scopes.includes("primary_structure"));
  assert.ok(matching[0].scopes.includes("explicit_relation"));

  assert.ok(result.actualConflictCandidates.some((candidate) =>
    candidate.sourceNodeId === "hour.stem" &&
    candidate.targetNodeId === "day.stem" &&
    candidate.mediatorElement === "water",
  ));
});

test("coexistence and actual conflict candidates are separated", () => {
  const result = buildWorkChains({
    dayMaster: { stem: "甲" },
    pillars,
    relationMatrix: { items: [] },
    climateProfile: {
      passThroughCandidates: [{
        conflictElements: ["metal", "wood"],
        mediatorElement: "water",
        mediatorPresent: true,
        label: "金木之间以水作通关候选",
      }],
    },
  });

  assert.equal(
    result.coexistenceCandidates[0].candidateLevel,
    "coexistence_candidate",
  );
  assert.deepEqual(result.actualConflictCandidates, []);
});

test("main qi is not duplicated and chain summary remains internally consistent", () => {
  const result = buildWorkChains({
    dayMaster: { stem: "甲" },
    pillars,
    relationMatrix: { items: [] },
  });

  assert.equal(
    result.nodes.filter((item) => item.id === "day.branch.mainQi").length,
    1,
  );
  assert.equal(
    result.nodes.some((item) => item.id === "day.branch.hidden.0"),
    false,
  );
  assert.equal(result.summary.nodeCount, result.nodes.length);
  assert.equal(result.summary.edgeCount, result.edges.length);
  assert.equal(result.summary.chainCount, result.chains.length);
  assert.doesNotMatch(JSON.stringify(result), /NaN|undefined/);
});

test("potential confidence does not raise activated low confidence", () => {
  const relationMatrix = buildRelationMatrix({
    pillars,
    relations: [{
      type: "天干相克",
      pillars: ["日柱", "时柱"],
      ganzhi: ["甲寅", "庚申"],
      confidence: "low",
    }],
  });

  const result = buildWorkChains({
    dayMaster: { stem: "甲" },
    pillars,
    relationMatrix,
  });

  const edge = result.edges.find((item) =>
    item.semanticType === "control" &&
    item.source === "hour.stem" &&
    item.target === "day.stem",
  );

  assert.equal(edge.activation, "activated");
  assert.equal(edge.potentialConfidence, "medium");
  assert.equal(edge.activatedConfidence, "low");
  assert.equal(edge.confidence, "low");
});

test("multiple activated sources can raise activated confidence", () => {
  const relationMatrix = {
    items: [
      {
        id: "low-control",
        relationType: "stem_control",
        confidence: "low",
        direction: {
          controller: { pillar: "hour", position: "stem", value: "庚" },
          controlled: { pillar: "day", position: "stem", value: "甲" },
        },
      },
      {
        id: "medium-control",
        relationType: "stem_control",
        confidence: "medium",
        direction: {
          controller: { pillar: "hour", position: "stem", value: "庚" },
          controlled: { pillar: "day", position: "stem", value: "甲" },
        },
      },
    ],
  };

  const result = buildWorkChains({
    dayMaster: { stem: "甲" },
    pillars,
    relationMatrix,
  });

  const edge = result.edges.find((item) =>
    item.semanticType === "control" &&
    item.source === "hour.stem" &&
    item.target === "day.stem",
  );

  assert.equal(edge.activation, "activated");
  assert.equal(edge.activatedConfidence, "medium");
  assert.equal(edge.confidence, "medium");
  assert.deepEqual(edge.relationIds.sort(), ["low-control", "medium-control"]);
});

test("potential edge keeps potential confidence when not activated", () => {
  const result = buildWorkChains({
    dayMaster: { stem: "甲" },
    pillars,
    relationMatrix: { items: [] },
  });

  const edge = result.edges.find((item) =>
    item.semanticType === "control" &&
    item.source === "hour.stem" &&
    item.target === "day.stem",
  );

  assert.equal(edge.activation, "potential");
  assert.equal(edge.potentialConfidence, "medium");
  assert.equal(edge.activatedConfidence, "unknown");
  assert.equal(edge.confidence, "medium");
});

test("coexistence candidates preserve available compatibility status", () => {
  const result = buildWorkChains({
    dayMaster: { stem: "甲" },
    pillars,
    relationMatrix: { items: [] },
    climateProfile: {
      passThroughCandidates: [{
        conflictElements: ["metal", "wood"],
        mediatorElement: "water",
        mediatorPresent: true,
        status: "available",
        label: "金木之间以水作通关候选",
      }],
    },
  });

  const candidate = result.coexistenceCandidates[0];
  assert.equal(candidate.candidateLevel, "coexistence_candidate");
  assert.equal(candidate.candidateStatus, "candidate");
  assert.equal(candidate.availabilityStatus, "available");
  assert.equal(candidate.status, "available");
  assert.equal(result.passThroughCandidates[0].status, "available");
});

test("coexistence candidates preserve missing compatibility status", () => {
  const result = buildWorkChains({
    dayMaster: { stem: "甲" },
    pillars,
    relationMatrix: { items: [] },
    climateProfile: {
      passThroughCandidates: [{
        conflictElements: ["metal", "wood"],
        mediatorElement: "water",
        mediatorPresent: false,
        status: "missing",
        label: "金木之间以水作通关候选",
      }],
    },
  });

  const candidate = result.coexistenceCandidates[0];
  assert.equal(candidate.availabilityStatus, "missing");
  assert.equal(candidate.status, "missing");
  assert.equal(result.passThroughCandidates[0].status, "missing");
});

test("actual conflict candidates inherit coexistence availability", () => {
  const relationMatrix = buildRelationMatrix({
    pillars,
    relations: [{
      type: "天干相克",
      pillars: ["日柱", "时柱"],
      ganzhi: ["甲寅", "庚申"],
      confidence: "low",
    }],
  });

  const result = buildWorkChains({
    dayMaster: { stem: "甲" },
    pillars,
    relationMatrix,
    climateProfile: {
      passThroughCandidates: [{
        conflictElements: ["metal", "wood"],
        mediatorElement: "water",
        mediatorPresent: true,
        status: "available",
        label: "金木之间以水作通关候选",
      }],
    },
  });

  const actual = result.actualConflictCandidates.find((item) =>
    item.sourceNodeId === "hour.stem" &&
    item.targetNodeId === "day.stem",
  );

  assert.equal(actual.candidateLevel, "actual_conflict_candidate");
  assert.equal(actual.candidateStatus, "candidate");
  assert.equal(actual.availabilityStatus, "available");
  assert.equal(actual.status, "available");
  assert.equal(actual.confidence, "low");
});

test("null role mapping falls back to default mapping", () => {
  assert.doesNotThrow(() =>
    buildWorkChains({
      dayMaster: { stem: "甲" },
      pillars,
      relationMatrix: { items: [] },
      roleMapping: null,
    }),
  );

  const result = buildWorkChains({
    dayMaster: { stem: "甲" },
    pillars,
    relationMatrix: { items: [] },
    roleMapping: null,
  });

  assert.equal(result.roleMappingId, DEFAULT_WORK_ROLE_MAPPING.id);
});

test("partial custom role mapping falls back by missing groups", () => {
  const result = buildWorkChains({
    dayMaster: { stem: "甲" },
    pillars,
    relationMatrix: { items: [] },
    roleMapping: {
      id: "custom-test",
      version: "custom-v1",
      byTenGodGroup: {
        output: "body",
      },
    },
  });

  const output = result.nodes.find((item) => item.id === "month.stem");
  const wealth = result.nodes.find((item) => item.id === "year.stem");
  const peer = result.nodes.find((item) => item.id === "day.branch.mainQi");

  assert.equal(result.roleMappingId, "custom-test");
  assert.equal(output.resolvedRole, "body");
  assert.equal(wealth.resolvedRole, "use");
  assert.equal(peer.resolvedRole, "body");
});
