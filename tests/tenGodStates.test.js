import test from "node:test";
import assert from "node:assert/strict";

import { buildRelationMatrix } from "../js/core/natal/featureBuilders/buildRelationMatrix.js";
import { buildTenGodStates } from "../js/core/natal/featureBuilders/buildTenGodStates.js";

function buildMockPillars() {
  return {
    year: {
      key: "year",
      stemTenGod: "偏财",
      branchMainTenGod: "正印",
      hiddenStems: [
        { stem: "癸", tenGod: "正印", role: "主气", percentage: 70 },
      ],
    },
    month: {
      key: "month",
      stemTenGod: "正官",
      branchMainTenGod: "正印",
      hiddenStems: [
        { stem: "癸", tenGod: "正印", role: "主气", percentage: 70 },
        { stem: "辛", tenGod: "正官", role: "中气", percentage: 30 },
      ],
    },
    day: {
      key: "day",
      stemTenGod: "日主",
      branchMainTenGod: "劫财",
      hiddenStems: [
        { stem: "乙", tenGod: "劫财", role: "主气", weight: 0.7 },
      ],
    },
    hour: {
      key: "hour",
      stemTenGod: "伤官",
      branchMainTenGod: "偏印",
      hiddenStems: [
        { stem: "壬", tenGod: "偏印", role: "主气", percentage: 0.7 },
      ],
    },
  };
}

test("ten god states track visible stems and exact positions", () => {
  const states = buildTenGodStates({
    pillars: buildMockPillars(),
    tenGods: { weightedCounts: { 正官: 1.3 } },
    relationMatrix: { items: [] },
  });

  assert.equal(states.正官.visibleCount, 1);
  assert.deepEqual(states.正官.visiblePositions, ["month.stem"]);
  assert.equal(states.正官.inMonthStem, true);
  assert.equal(states.正官.hiddenCount, 1);
  assert.deepEqual(states.正官.hiddenPositions, ["month.branch.hidden.1"]);
});

test("ten god states recognize hidden roots and month command main qi", () => {
  const states = buildTenGodStates({
    pillars: buildMockPillars(),
    tenGods: { weightedCounts: { 正印: 1.4 } },
    relationMatrix: { items: [] },
  });

  assert.equal(states.正印.hiddenCount, 2);
  assert.equal(states.正印.mainQiCount, 2);
  assert.deepEqual(states.正印.mainQiPositions, ["year.branch.mainQi", "month.branch.mainQi"]);
  assert.equal(states.正印.hasRoot, true);
  assert.equal(states.正印.inMonthBranchMainQi, true);
  assert.equal(states.正印.inMonthCommand, true);
  assert.equal(states.正印.strengthLevel, "medium");
});

test("visible ten god without branch root is floating", () => {
  const states = buildTenGodStates({
    pillars: buildMockPillars(),
    tenGods: { weightedCounts: { 伤官: 1 } },
    relationMatrix: { items: [] },
  });

  assert.equal(states.伤官.visibleCount, 1);
  assert.equal(states.伤官.hasRoot, false);
  assert.equal(states.伤官.isFloating, true);
});

test("absent ten god stays absent and percentage 70 is normalized to 0.7", () => {
  const states = buildTenGodStates({
    pillars: buildMockPillars(),
    tenGods: {},
    relationMatrix: { items: [] },
  });

  assert.equal(states.食神.strengthLevel, "absent");
  assert.equal(states.食神.weightedCount, 0);
  assert.equal(states.正印.weightedCount, 1.4);
});

test("hidden weight 70 is normalized to 0.7 and usable level stays unknown", () => {
  const pillars = buildMockPillars();
  pillars.day.hiddenStems = [
    { stem: "乙", tenGod: "劫财", role: "主气", weight: 70 },
  ];

  const states = buildTenGodStates({
    pillars,
    tenGods: {},
    relationMatrix: { items: [] },
  });

  assert.equal(states.劫财.weightedCount, 0.7);
  assert.equal(states.劫财.usableLevel, "unknown");
  assert.ok(states.劫财.warnings.includes("usableLevel requires structure, climate and work-chain analysis"));
});

test("controlled ten god receives stem_control id while controller does not", () => {
  const pillars = buildMockPillars();
  pillars.year = {
    ...pillars.year,
    stem: "甲",
    branch: "子",
    label: "甲子",
    stemTenGod: "偏财",
  };
  pillars.month = {
    ...pillars.month,
    stem: "己",
    branch: "丑",
    label: "己丑",
    stemTenGod: "正官",
  };
  const relationMatrix = buildRelationMatrix({
    pillars,
    relations: [
      {
        type: "天干克",
        members: ["甲", "己"],
        pillars: ["年柱", "月柱"],
        ganzhi: ["甲子", "己丑"],
      },
    ],
  });
  const relationId = relationMatrix.items[0].id;

  const states = buildTenGodStates({
    pillars,
    tenGods: {},
    relationMatrix,
  });

  assert.ok(states.正官.controlledBy.includes(relationId));
  assert.equal(states.偏财.controlledBy.includes(relationId), false);
});

test("main qi does not double count hidden presence for strength", () => {
  const states = buildTenGodStates({
    pillars: {
      year: {
        key: "year",
        stemTenGod: "",
        branchMainTenGod: "正印",
        hiddenStems: [
          { stem: "癸", tenGod: "正印", role: "主气" },
        ],
      },
      month: { key: "month", hiddenStems: [] },
      day: { key: "day", hiddenStems: [] },
      hour: { key: "hour", hiddenStems: [] },
    },
    tenGods: {},
    relationMatrix: { items: [] },
  });

  assert.equal(states.正印.visibleCount, 0);
  assert.equal(states.正印.hiddenCount, 1);
  assert.equal(states.正印.mainQiCount, 1);
  assert.equal(states.正印.strengthLevel, "medium");
});

test("explicit weightedCount 70 is ignored and recalculated", () => {
  const states = buildTenGodStates({
    pillars: buildMockPillars(),
    tenGods: { weightedCounts: { 正印: 70 } },
    relationMatrix: { items: [] },
  });

  assert.ok(states.正印.weightedCount < 20);
  assert.ok(states.正印.warnings.some((item) => /explicit weightedCount was invalid/.test(item)));
});

test("invalid hidden weight records warning before role fallback", () => {
  const states = buildTenGodStates({
    pillars: {
      year: {
        key: "year",
        stemTenGod: "",
        branchMainTenGod: "正印",
        hiddenStems: [
          { stem: "癸", tenGod: "正印", role: "主气", weight: 200 },
        ],
      },
      month: { key: "month", hiddenStems: [] },
      day: { key: "day", hiddenStems: [] },
      hour: { key: "hour", hiddenStems: [] },
    },
    tenGods: {},
    relationMatrix: { items: [] },
  });

  assert.equal(states.正印.weightedCount, 0.7);
  assert.ok(states.正印.warnings.includes("hidden weight or percentage ignored because it is outside 0-100"));
});

test("empty numeric values are ignored instead of becoming zero", () => {
  const states = buildTenGodStates({
    pillars: {
      year: {
        key: "year",
        stemTenGod: "",
        branchMainTenGod: "正印",
        hiddenStems: [
          { stem: "癸", tenGod: "正印", role: "主气", weight: null, percentage: 70 },
        ],
      },
      month: { key: "month", hiddenStems: [] },
      day: { key: "day", hiddenStems: [] },
      hour: { key: "hour", hiddenStems: [] },
    },
    tenGods: { weightedCounts: { 正印: null } },
    relationMatrix: { items: [] },
  });

  assert.equal(states.正印.weightedCount, 0.7);
  assert.ok(states.正印.warnings.some((item) => /explicit weightedCount was invalid/.test(item)));
});

test("branch main ten god alone is present when hidden stems are missing", () => {
  const states = buildTenGodStates({
    pillars: {
      year: {
        key: "year",
        stemTenGod: "",
        branchMainTenGod: "正印",
      },
      month: { key: "month" },
      day: { key: "day" },
      hour: { key: "hour" },
    },
    tenGods: {},
    relationMatrix: { items: [] },
  });

  assert.equal(states.正印.hiddenCount, 0);
  assert.equal(states.正印.mainQiCount, 1);
  assert.equal(states.正印.strengthLevel, "medium");
});
