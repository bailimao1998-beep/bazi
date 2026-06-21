import test from "node:test";
import assert from "node:assert/strict";

import { buildVoidFeatures } from "../js/core/natal/featureBuilders/buildVoidFeatures.js";

test("day-pillar xunkong is the primary reference and keeps year reference separately", () => {
  const features = buildVoidFeatures({
    pillars: {
      year: {
        key: "year",
        label: "甲戌",
        stem: "甲",
        branch: "戌",
        branchMainTenGod: "偏财",
        hiddenStems: [{ stem: "戊", tenGod: "偏财" }],
      },
      month: {
        key: "month",
        label: "乙亥",
        stem: "乙",
        branch: "亥",
        branchMainTenGod: "正印",
        hiddenStems: [{ stem: "壬", tenGod: "正印" }],
      },
      day: {
        key: "day",
        label: "甲子",
        stem: "甲",
        branch: "子",
      },
      hour: {
        key: "hour",
        label: "丙寅",
        stem: "丙",
        branch: "寅",
      },
    },
  });

  assert.deepEqual(features.voidBranches, ["戌", "亥"]);
  assert.equal(features.byPillar.year.isVoid, true);
  assert.equal(features.byPillar.month.isVoid, true);
  assert.equal(features.byPillar.day.isVoid, false);
  assert.deepEqual(features.voidPillars, ["year", "month"]);
  assert.ok(features.voidTenGods.all.includes("偏财"));
  assert.ok(features.references.year);
  assert.equal(features.primaryReference, "day");
});

test("supplied day-pillar void branches are preferred and no judgment is generated", () => {
  const features = buildVoidFeatures({
    pillars: {
      year: { key: "year", branch: "申" },
      month: { key: "month", branch: "酉" },
      day: {
        key: "day",
        stem: "辛",
        branch: "酉",
        voidBranches: ["子", "丑"],
      },
      hour: { key: "hour", branch: "子" },
    },
  });

  assert.deepEqual(features.voidBranches, ["子", "丑"]);
  assert.equal(features.byPillar.hour.isVoid, true);
  assert.equal(features.spousePalace.primaryIsVoid, false);
  assert.equal("meaning" in features.byPillar.hour, false);
});
