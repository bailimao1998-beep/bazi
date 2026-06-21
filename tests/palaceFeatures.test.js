import test from "node:test";
import assert from "node:assert/strict";

import { buildRelationMatrix } from "../js/core/natal/featureBuilders/buildRelationMatrix.js";
import { buildPalaceFeatures } from "../js/core/natal/featureBuilders/buildPalaceFeatures.js";
import { buildTenGodStates } from "../js/core/natal/featureBuilders/buildTenGodStates.js";

const pillars = {
  year: {
    key: "year",
    label: "甲申",
    stem: "甲",
    branch: "申",
    stemTenGod: "偏财",
    branchMainTenGod: "比肩",
    hiddenStems: [{ stem: "庚", tenGod: "比肩", role: "主气" }],
  },
  month: {
    key: "month",
    label: "丙子",
    stem: "丙",
    branch: "子",
    stemTenGod: "七杀",
    branchMainTenGod: "伤官",
    hiddenStems: [{ stem: "癸", tenGod: "伤官", role: "主气" }],
  },
  day: {
    key: "day",
    label: "戊辰",
    stem: "戊",
    branch: "辰",
    stemTenGod: "日主",
    branchMainTenGod: "偏印",
    hiddenStems: [{ stem: "戊", tenGod: "偏印", role: "主气" }],
  },
  hour: {
    key: "hour",
    label: "庚午",
    stem: "庚",
    branch: "午",
    stemTenGod: "食神",
    branchMainTenGod: "正官",
    hiddenStems: [{ stem: "丁", tenGod: "正官", role: "主气" }],
  },
};

function buildFeatures(relations) {
  const relationMatrix = buildRelationMatrix({ pillars, relations });
  const tenGodStates = buildTenGodStates({
    pillars,
    tenGods: {},
    relationMatrix,
  });
  return buildPalaceFeatures({
    pillars,
    relationMatrix,
    tenGodStates,
  });
}

test("four pillar palace features always exist with stable fields", () => {
  const features = buildPalaceFeatures();

  assert.deepEqual(Object.keys(features), ["year", "month", "day", "hour", "spousePalace"]);
  for (const key of ["year", "month", "day", "hour"]) {
    assert.equal(features[key].key, key);
    assert.deepEqual(features[key].relationSummary, {
      combineCount: 0,
      clashCount: 0,
      punishCount: 0,
      harmCount: 0,
      breakCount: 0,
      controlCount: 0,
      repetitionCount: 0,
      harmonyCount: 0,
    });
    assert.ok(Array.isArray(features[key].traditionalThemes));
  }
  assert.equal(features.spousePalace.key, "spousePalace");
  assert.equal(features.spousePalace.position, "branch");
});

test("pillar palace fields map stems branches flags and ten-god states", () => {
  const features = buildFeatures([]);

  assert.equal(features.year.label, "年柱");
  assert.equal(features.year.stem, "甲");
  assert.equal(features.year.branch, "申");
  assert.equal(features.year.pillarLabel, "甲申");
  assert.equal(features.day.isDayPillar, true);
  assert.equal(features.month.isMonthCommandPillar, true);
  assert.equal(features.hour.isDayPillar, false);
  assert.equal(features.year.visibleTenGodState?.name, "偏财");
  assert.equal(features.day.mainQiTenGodState?.name, "偏印");
  assert.deepEqual(features.hour.hiddenTenGods, ["正官"]);
});

test("stem and branch relations are separated and summary counts once", () => {
  const features = buildFeatures([
    {
      type: "天干五合",
      members: ["丙", "戊"],
      pillars: ["月柱", "日柱"],
      ganzhi: ["丙子", "戊辰"],
    },
    {
      type: "地支六冲",
      members: ["子", "辰"],
      pillars: ["月柱", "日柱"],
      ganzhi: ["丙子", "戊辰"],
    },
  ]);

  assert.equal(features.day.stemRelationIds.length, 1);
  assert.equal(features.day.branchRelationIds.length, 1);
  assert.equal(features.day.relationIds.length, 2);
  assert.equal(features.day.relationSummary.combineCount, 1);
  assert.equal(features.day.relationSummary.clashCount, 1);
});

test("spouse palace only uses day branch relations including third harmony member", () => {
  const features = buildFeatures([
    {
      type: "天干五合",
      members: ["丙", "戊"],
      pillars: ["月柱", "日柱"],
      ganzhi: ["丙子", "戊辰"],
    },
    {
      type: "地支六冲",
      members: ["子", "辰"],
      pillars: ["月柱", "日柱"],
      ganzhi: ["丙子", "戊辰"],
    },
    {
      type: "地支三合",
      members: ["申", "子", "辰"],
      pillars: ["年柱", "月柱", "日柱"],
      ganzhi: ["甲申", "丙子", "戊辰"],
    },
  ]);

  assert.equal(features.spousePalace.branch, "辰");
  assert.equal(features.spousePalace.mainTenGod, "偏印");
  assert.equal(features.spousePalace.relationIds.length, 2);
  assert.equal(features.spousePalace.hasClash, true);
  assert.equal(features.spousePalace.hasHarmony, true);
  assert.equal(features.spousePalace.hasCombine, false);
  assert.ok(features.spousePalace.relationTypes.includes("branch_clash"));
  assert.ok(features.spousePalace.relationTypes.includes("three_harmony"));
});
