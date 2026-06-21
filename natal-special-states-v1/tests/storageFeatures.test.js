import test from "node:test";
import assert from "node:assert/strict";

import { buildRelationMatrix } from "../js/core/natal/featureBuilders/buildRelationMatrix.js";
import { buildStorageFeatures } from "../js/core/natal/featureBuilders/buildStorageFeatures.js";

test("four storage branches are identified without deciding open or closed", () => {
  const pillars = {
    year: {
      key: "year",
      label: "戊辰",
      stem: "戊",
      branch: "辰",
      hiddenStems: [
        { stem: "戊", tenGod: "偏印", role: "主气" },
        { stem: "乙", tenGod: "正财", role: "中气" },
        { stem: "癸", tenGod: "伤官", role: "余气" },
      ],
    },
    month: {
      key: "month",
      label: "壬戌",
      stem: "壬",
      branch: "戌",
      hiddenStems: [
        { stem: "戊", tenGod: "偏印", role: "主气" },
        { stem: "辛", tenGod: "劫财", role: "中气" },
        { stem: "丁", tenGod: "正官", role: "余气" },
      ],
    },
    day: { key: "day", label: "庚子", stem: "庚", branch: "子", hiddenStems: [] },
    hour: {
      key: "hour",
      label: "丁丑",
      stem: "丁",
      branch: "丑",
      hiddenStems: [{ stem: "辛", tenGod: "劫财", role: "余气" }],
    },
  };
  const relationMatrix = buildRelationMatrix({
    pillars,
    relations: [{
      type: "地支六冲",
      members: ["辰", "戌"],
      pillars: ["年柱", "月柱"],
      ganzhi: ["戊辰", "壬戌"],
    }],
  });

  const features = buildStorageFeatures({
    pillars,
    relationMatrix,
    dayMaster: { stem: "庚" },
  });

  assert.deepEqual(features.storagePillars, ["year", "month", "hour"]);
  assert.equal(features.byPillar.year.storageLabel, "水库");
  assert.equal(features.byPillar.month.storageLabel, "火库");
  assert.equal(features.byPillar.hour.storageLabel, "金库");
  assert.equal(features.byPillar.day.isStorage, false);
  assert.equal(features.byPillar.year.hasOpeningSignal, true);
  assert.equal(features.byPillar.month.hasOpeningSignal, true);
  assert.equal(features.byPillar.year.openState, "unknown");
  assert.equal("isOpen" in features.byPillar.year, false);
});

test("harmony alone is not treated as an opening signal", () => {
  const pillars = {
    year: { key: "year", label: "戊辰", stem: "戊", branch: "辰", hiddenStems: [] },
    month: { key: "month", label: "辛酉", stem: "辛", branch: "酉", hiddenStems: [] },
    day: { key: "day", label: "庚子", stem: "庚", branch: "子", hiddenStems: [] },
    hour: { key: "hour", label: "甲寅", stem: "甲", branch: "寅", hiddenStems: [] },
  };
  const relationMatrix = buildRelationMatrix({
    pillars,
    relations: [{
      type: "地支六合",
      members: ["辰", "酉"],
      pillars: ["年柱", "月柱"],
      ganzhi: ["戊辰", "辛酉"],
    }],
  });

  const features = buildStorageFeatures({
    pillars,
    relationMatrix,
    dayMaster: { stem: "庚" },
  });

  assert.equal(features.byPillar.year.hasOpeningSignal, false);
  assert.deepEqual(features.byPillar.year.openingSignalRelationIds, []);
});
