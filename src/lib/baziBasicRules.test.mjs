import test from "node:test";
import assert from "node:assert/strict";
import { adaptBaziBasicChart, matchBaziBasicRules } from "./baziBasicRules.js";

test("matches basic interpretation rules by day stem, month branch, counts, and keeps display order", () => {
  const chart = {
    yearPillar: { label: "甲子", stem: "甲", branch: "子" },
    monthPillar: { label: "辛酉", stem: "辛", branch: "酉" },
    dayPillar: { label: "辛卯", stem: "辛", branch: "卯" },
    hourPillar: { label: "戊子", stem: "戊", branch: "子" },
    dayStem: "辛",
    monthBranch: "酉",
    dayMasterSeasonalStatus: "旺",
    fiveElements: { wood: 1, fire: 0, earth: 2, metal: 4, water: 1 },
    tenGods: {
      counts: { 比肩: 1, 偏财: 2, 正财: 1 },
      groupCounts: { peer: 1, wealth: 3 },
    },
    selectedLuck: { label: "壬戌" },
    selectedYear: { label: "丙午" },
  };
  const rules = [
    makeRule("unknown", 1, { unsupportedField: true }),
    makeRule("wealth", 40, { tenGodGroupCount: { group: "wealth", operator: ">=", value: 2 } }),
    makeRule("metal", 30, { elementCount: { element: "metal", operator: ">=", value: 4 } }),
    makeRule("day", 10, { dayStem: "辛" }),
    makeRule("month", 20, { monthBranch: "酉" }),
    makeRule("strength", 50, { dayMasterSeasonalStatus: "旺" }),
    makeRule("transit", 100, { hasSelectedLuck: true, hasSelectedYear: true }),
  ];

  const matches = matchBaziBasicRules(chart, rules);

  assert.deepEqual(matches.map((item) => item.id), ["day", "month", "metal", "wealth", "strength", "transit"]);
  assert.deepEqual(Object.keys(matches[0]), [
    "id",
    "title",
    "conclusion",
    "evidence",
    "reason",
    "category",
    "confidence",
    "displayOrder",
  ]);
});

test("adapts the existing reading shape into the standard basic-rule chart shape", () => {
  const reading = {
    natal: {
      pillars: {
        year: { label: "甲子", stem: "甲", branch: "子" },
        month: { label: "辛酉", stem: "辛", branch: "酉" },
        day: { label: "辛卯", stem: "辛", branch: "卯" },
        hour: { label: "戊子", stem: "戊", branch: "子" },
      },
      dayMaster: "辛",
      elements: { wood: 1, fire: 0, earth: 2, metal: 4, water: 1 },
      coreChart: { tenGodCounts: { 比肩: 1, 偏财: 2, 正财: 1 } },
      strengthSignals: [
        { element: "metal", seasonalStatus: "旺" },
        { element: "wood", seasonalStatus: "囚" },
      ],
    },
    transit: {
      selectedLuck: { label: "壬戌" },
      selectedYear: { label: "丙午" },
    },
  };

  const chart = adaptBaziBasicChart(reading);

  assert.equal(chart.dayStem, "辛");
  assert.equal(chart.monthBranch, "酉");
  assert.equal(chart.dayMasterSeasonalStatus, "旺");
  assert.equal(chart.tenGods.groupCounts.wealth, 3);
  assert.deepEqual(chart.fiveElements, { wood: 1, fire: 0, earth: 2, metal: 4, water: 1 });
});

function makeRule(id, displayOrder, condition) {
  return {
    id,
    category: id,
    condition,
    title: `${id} title`,
    conclusion: `${id} conclusion`,
    evidence: `${id} evidence`,
    reason: `${id} reason`,
    displayOrder,
    confidence: "high",
  };
}
