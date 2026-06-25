import test from "node:test";
import assert from "node:assert/strict";

import {
  normalizePillarTenGod,
  validateRawFactPack,
} from "../js/core/ai/stageFactRuleGuard.js";

test("日柱天干允许使用日主标签，不误判为十神错误", () => {
  const dayPillar = normalizePillarTenGod({
    key: "day",
    name: "日柱",
    ganZhi: "甲寅",
    stem: "甲",
    branch: "寅",
    stemTenGod: "日主",
    branchMainTenGod: "比肩",
  }, "甲");

  assert.equal(dayPillar.isDayMasterPillar, true);
  assert.equal(dayPillar.stemRole, "day_master");
  assert.equal(dayPillar.stemTenGod, "日主");
  assert.equal(dayPillar.computedStemTenGod, "比肩");
});

test("甲日主命盘不会因日柱标记日主而阻断岁运AI", () => {
  const natalPillars = [
    { key: "year", name: "年柱", stem: "己", branch: "丑", stemTenGod: "正财", branchMainTenGod: "正财" },
    { key: "month", name: "月柱", stem: "癸", branch: "酉", stemTenGod: "正印", branchMainTenGod: "正官" },
    { key: "day", name: "日柱", stem: "甲", branch: "寅", stemTenGod: "日主", branchMainTenGod: "比肩" },
    { key: "hour", name: "时柱", stem: "丙", branch: "子", stemTenGod: "食神", branchMainTenGod: "正印" },
  ].map((pillar) => normalizePillarTenGod(pillar, "甲"));

  const current = normalizePillarTenGod({
    id: "luck:7:丙寅",
    level: "luck",
    displayName: "大运",
    stem: "丙",
    branch: "寅",
    stemTenGod: "食神",
    branchMainTenGod: "比肩",
  }, "甲");

  const validation = validateRawFactPack({
    natal: {
      gender: "female",
      dayMaster: "甲",
      pillars: natalPillars,
    },
    layers: { current, luck: current, year: null, month: null },
    facts: [],
  });

  assert.equal(validation.usable, true, validation.errors.join("；"));
});

test("日柱若被标成其他十神仍会被拦截", () => {
  const validation = validateRawFactPack({
    natal: {
      gender: "male",
      dayMaster: "甲",
      pillars: [
        normalizePillarTenGod({ key: "year", name: "年柱", stem: "甲", branch: "子", stemTenGod: "比肩", branchMainTenGod: "正印" }, "甲"),
        normalizePillarTenGod({ key: "month", name: "月柱", stem: "丙", branch: "午", stemTenGod: "食神", branchMainTenGod: "伤官" }, "甲"),
        normalizePillarTenGod({ key: "day", name: "日柱", stem: "甲", branch: "寅", stemTenGod: "正官", branchMainTenGod: "比肩" }, "甲"),
        normalizePillarTenGod({ key: "hour", name: "时柱", stem: "戊", branch: "辰", stemTenGod: "偏财", branchMainTenGod: "偏财" }, "甲"),
      ],
    },
    layers: {},
    facts: [],
  });

  assert.equal(validation.usable, false);
  assert.match(validation.errors.join("；"), /日柱甲为日主，当前错误标记为正官/);
});
