import test from "node:test";
import assert from "node:assert/strict";

import { buildGrowthStageFeatures } from "../js/core/natal/featureBuilders/buildGrowthStageFeatures.js";

test("twelve-growth stages are resolved from day master and pillar branches", () => {
  const features = buildGrowthStageFeatures({
    dayMaster: { stem: "甲" },
    pillars: {
      year: { key: "year", branch: "亥" },
      month: { key: "month", branch: "子" },
      day: { key: "day", branch: "卯" },
      hour: { key: "hour", branch: "申" },
    },
  });

  assert.equal(features.referenceStem, "甲");
  assert.equal(features.byPillar.year.stage, "长生");
  assert.equal(features.byPillar.month.stage, "沐浴");
  assert.equal(features.byPillar.day.stage, "帝旺");
  assert.equal(features.byPillar.hour.stage, "绝");
  assert.equal(features.byPillar.day.phase, "maturity");
  assert.equal(features.stageCounts.长生, 1);
  assert.equal(features.spousePalaceStage.key, "day");
});

test("supplied stage is preferred and unknown input stays neutral", () => {
  const features = buildGrowthStageFeatures({
    dayMaster: { stem: "" },
    pillars: {
      year: { key: "year", branch: "亥", twelveGrowth: "养" },
      month: { key: "month", branch: "" },
      day: { key: "day", branch: "" },
      hour: { key: "hour", branch: "" },
    },
  });

  assert.equal(features.byPillar.year.stage, "养");
  assert.equal(features.byPillar.year.phase, "gestation");
  assert.equal(features.byPillar.month.stage, "unknown");
  assert.ok(features.unknownPillars.includes("month"));
  assert.equal("polarity" in features.byPillar.year, false);
});
