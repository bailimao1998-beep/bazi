import test from "node:test";
import assert from "node:assert/strict";

import { buildRelationMatrix } from "../../js/domain/natal/featureBuilders/buildRelationMatrix.js";
import { buildPalaceFeatures } from "../../js/domain/natal/featureBuilders/buildPalaceFeatures.js";
import { buildTenGodStates } from "../../js/domain/natal/featureBuilders/buildTenGodStates.js";

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
    assert.deepEqual(features[key].relationTypes, []);
    assert.deepEqual(features[key].pillarRelationIds, []);
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
  assert.equal(features.day.pillarRelationIds.length, 0);
  assert.equal(features.day.relationIds.length, 2);
  assert.deepEqual(features.day.relationTypes.sort(), ["branch_clash", "stem_combine"]);
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

test("pillar repetition enters pillarRelationIds and day repetition enters spouse palace", () => {
  const features = buildFeatures([
    {
      type: "伏吟",
      pillars: ["年柱", "日柱"],
      ganzhi: ["甲申", "戊辰"],
    },
    {
      type: "天干五合",
      members: ["丙", "戊"],
      pillars: ["月柱", "日柱"],
      ganzhi: ["丙子", "戊辰"],
    },
  ]);

  assert.equal(features.year.pillarRelationIds.length, 1);
  assert.equal(features.day.pillarRelationIds.length, 1);
  assert.ok(features.day.relationTypes.includes("repetition"));
  assert.equal(features.day.relationSummary.repetitionCount, 1);
  assert.ok(features.spousePalace.relationTypes.includes("repetition"));
  assert.equal(features.spousePalace.hasRepetition, true);
  assert.equal(features.spousePalace.hasCombine, false);
});

test("harmony and direct combine are counted separately", () => {
  const features = buildFeatures([
    {
      type: "地支三合",
      members: ["申", "子", "辰"],
      pillars: ["年柱", "月柱", "日柱"],
      ganzhi: ["甲申", "丙子", "戊辰"],
    },
    {
      type: "地支六合",
      members: ["辰", "酉"],
      pillars: ["日柱", "时柱"],
      ganzhi: ["戊辰", "庚午"],
    },
  ]);

  assert.equal(features.day.relationSummary.harmonyCount, 1);
  assert.equal(features.day.relationSummary.combineCount, 1);
  assert.ok(features.day.relationTypes.includes("three_harmony"));
  assert.ok(features.day.relationTypes.includes("branch_combine"));
});

test("palace ten god states are snapshots without related relation objects", () => {
  const features = buildFeatures([
    {
      type: "地支六冲",
      members: ["子", "辰"],
      pillars: ["月柱", "日柱"],
      ganzhi: ["丙子", "戊辰"],
    },
  ]);

  assert.equal(features.day.mainQiTenGodState.name, "偏印");
  assert.ok(Array.isArray(features.day.mainQiTenGodState.relationIds));
  assert.equal("relatedRelations" in features.day.mainQiTenGodState, false);
  assert.equal("raw" in features.day.mainQiTenGodState, false);
});
