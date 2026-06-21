import test from "node:test";
import assert from "node:assert/strict";

import { buildRelationMatrix } from "../js/core/natal/featureBuilders/buildRelationMatrix.js";
import { buildWorkChains } from "../js/core/natal/featureBuilders/buildWorkChains.js";

const pillars = {
  year: {
    key: "year", stem: "戊", branch: "辰", stemTenGod: "偏财", branchMainTenGod: "偏财",
    hiddenStems: [{ stem: "戊", tenGod: "偏财", role: "主气" }],
  },
  month: {
    key: "month", stem: "丙", branch: "午", stemTenGod: "食神", branchMainTenGod: "伤官",
    hiddenStems: [{ stem: "丁", tenGod: "伤官", role: "主气" }],
  },
  day: {
    key: "day", stem: "甲", branch: "寅", stemTenGod: "日主", branchMainTenGod: "比肩",
    hiddenStems: [{ stem: "甲", tenGod: "比肩", role: "主气" }],
  },
  hour: {
    key: "hour", stem: "庚", branch: "申", stemTenGod: "七杀", branchMainTenGod: "七杀",
    hiddenStems: [{ stem: "庚", tenGod: "七杀", role: "主气" }],
  },
};

test("work-chain nodes distinguish self body and use, and find body-to-use candidates", () => {
  const relationMatrix = buildRelationMatrix({ pillars, relations: [] });
  const result = buildWorkChains({
    dayMaster: { stem: "甲" },
    pillars,
    relationMatrix,
    climateProfile: { passThroughCandidates: [] },
  });

  assert.equal(result.nodes.find((item) => item.id === "day.stem").role, "self");
  assert.equal(result.nodes.find((item) => item.id === "month.stem").role, "body");
  assert.equal(result.nodes.find((item) => item.id === "year.stem").role, "use");
  assert.ok(result.edges.some((item) => item.source === "day.stem" && item.target === "month.stem" && item.edgeType === "generate"));
  assert.ok(result.edges.some((item) => item.source === "month.stem" && item.target === "year.stem" && item.edgeType === "generate"));
  assert.ok(result.bodyToUseCandidates.some((item) => item.nodeIds.join(",") === "day.stem,month.stem,year.stem"));
  assert.ok(result.chains.every((item) => item.status === "candidate"));
});

test("explicit branch clash becomes an interruption signal without a final event conclusion", () => {
  const relationMatrix = buildRelationMatrix({
    pillars,
    relations: [{
      type: "地支六冲",
      members: ["寅", "申"],
      pillars: ["日柱", "时柱"],
      ganzhi: ["甲寅", "庚申"],
    }],
  });
  const result = buildWorkChains({
    dayMaster: { stem: "甲" },
    pillars,
    relationMatrix,
  });

  assert.ok(result.interruptionSignals.some((item) => item.relationType === "branch_clash"));
  assert.equal("event" in result.interruptionSignals[0], false);
  assert.equal("result" in result.interruptionSignals[0], false);
});

test("hidden main qi is not duplicated as an extra hidden node", () => {
  const result = buildWorkChains({
    dayMaster: { stem: "甲" },
    pillars,
    relationMatrix: { items: [] },
  });

  assert.equal(result.nodes.filter((item) => item.id === "day.branch.mainQi").length, 1);
  assert.equal(result.nodes.some((item) => item.id === "day.branch.hidden.0"), false);
  assert.doesNotMatch(JSON.stringify(result), /NaN|undefined/);
});
