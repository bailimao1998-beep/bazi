import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import test from "node:test";

import { calculateBazi } from "../js/core/bazi/calculateBazi.js";
import { buildBaseBaziViewModel } from "../js/core/bazi/buildBaseBaziViewModel.js";
import { buildNatalImageReport } from "../js/core/blind-bazi/buildNatalImageReport.js";
import { buildNatalFeatureVector } from "../js/core/natal/natalFeatureVector.js";

const forbiddenTransitPattern = /大运|流年|流月|当前步运|岁运|流日/;

function loadLocations() {
  global.window = {};
  Function(readFileSync("js/locationData.js", "utf8"))();
  return global.window.FortuneLocationData;
}

function buildReport(input) {
  const chart = calculateBazi({
    birthProvince: "北京市",
    birthplace: "北京",
    gender: "male",
    targetYear: 2026,
    selectedMonth: 6,
    trueSolarTime: false,
    ...input,
  }, {
    locations: loadLocations(),
  });
  const baseBaziViewModel = buildBaseBaziViewModel(chart);
  return {
    chart,
    baseBaziViewModel,
    report: buildNatalImageReport({ chart, baseBaziViewModel }),
  };
}

test("natal feature vector separates ten-god layers and avoids element double counting", () => {
  const { chart, baseBaziViewModel } = buildReport({
    birthDate: "1949-10-01",
    birthTime: "00:30",
  });
  const vector = buildNatalFeatureVector({ chart, baseBaziViewModel });

  assert.equal(vector.tenGods.stemVisibleCounts["正印"], 1);
  assert.equal(vector.tenGods.branchMainQiCounts["正印"], 2);
  assert.equal(vector.tenGods.hiddenCounts["正印"], 3);
  assert.ok(vector.tenGods.weightedCounts["正印"] < vector.tenGods.stemVisibleCounts["正印"] + vector.tenGods.branchMainQiCounts["正印"] + vector.tenGods.hiddenCounts["正印"]);
  assert.equal(vector.tenGods.byPillar.month.stemTenGod, "正印");
  assert.equal(vector.tenGods.byPillar.month.branchMainTenGod, "正官");
  assert.equal(vector.elements.counts.water, chart.elements.water);
  assert.equal(vector.elements.counts.fire, 0);
});

test("natal hit list keeps concrete original-chart facts grouped by status and category", () => {
  const { chart, report } = buildReport({
    birthDate: "1949-10-01",
    birthTime: "00:30",
  });
  assert.deepEqual([
    chart.pillars.year.label,
    chart.pillars.month.label,
    chart.pillars.day.label,
    chart.pillars.hour.label,
  ], ["己丑", "癸酉", "甲子", "甲子"]);

  assert.ok(Array.isArray(report.hitList.all));
  assert.ok(report.hitList.all.length > 18);
  assert.ok(report.hitList.featured.length <= 8);
  assert.ok(report.hitList.confirmed.length > 0);
  assert.ok(report.hitList.conditional.length > 0);
  assert.ok(report.hitList.weak.length > 0);
  assert.ok(report.hitList.byCategory["日主根气"].length > 0);
  assert.ok(report.hitList.byCategory["十神透藏"].length > 0);
  assert.ok(report.hitList.byCategory["组合结构"].length > 0);
  assert.ok(report.hitList.byCategory["干支关系"].length >= 7);
  assert.ok(report.hitList.byCategory["柱位重复"].some((item) => /伏吟/.test(item.name)));
  assert.ok(report.hitList.byCategory["五行调候"].some((item) => /火弱|火不显/.test(item.name)));
  assert.ok(report.hitList.byCategory["神煞辅助"].length > 0);
  assert.ok(!report.hitList.featured.slice(0, 3).some((item) => item.category === "神煞辅助"));

  const names = report.hitList.all.map((item) => item.name);
  for (const expected of [
    "甲木生于酉月失令",
    "月干正印透出",
    "月令正官",
    "官印承接",
    "时干比肩透出",
    "年干正财透出",
    "日柱与时柱甲子伏吟",
    "月支酉与日支子相破",
    "月支酉与时支子相破",
    "年支丑与日支子六合",
    "年支丑与时支子六合",
    "原局食伤不显",
    "原局火弱或不显",
    "金水较有存在感",
  ]) {
    assert.ok(names.includes(expected), `missing natal hit: ${expected}`);
  }

  for (const item of report.hitList.all) {
    assert.match(item.status, /^(confirmed|conditional|weak)$/);
    assert.match(item.importance, /^(high|medium|low)$/);
    assert.ok(Array.isArray(item.evidence));
    assert.ok(item.evidence.every((entry) => typeof entry === "object" && entry.text));
    assert.doesNotMatch(JSON.stringify(item), forbiddenTransitPattern);
  }
});

test("natal hit list differs across charts and stays deterministic", () => {
  const inputs = [
    { birthDate: "1949-10-01", birthTime: "00:30" },
    { birthDate: "1988-03-12", birthTime: "09:20" },
    { birthDate: "1992-08-18", birthTime: "14:30", gender: "female" },
    { birthDate: "2001-10-30", birthTime: "22:10", gender: "female" },
  ];
  const reports = inputs.map((input) => buildReport(input).report);
  const featuredIds = reports.map((report) => report.hitList.featured.map((item) => item.id));

  assert.equal(new Set(featuredIds.map((ids) => ids.join("|"))).size, featuredIds.length);
  assert.ok(jaccardSimilarity(featuredIds[0], featuredIds[1]) < 0.75);

  const repeatA = buildReport(inputs[1]).report.hitList.all.map((item) => item.id);
  const repeatB = buildReport(inputs[1]).report.hitList.all.map((item) => item.id);
  assert.deepEqual(repeatA, repeatB);
});

function jaccardSimilarity(left = [], right = []) {
  const a = new Set(left);
  const b = new Set(right);
  const union = new Set([...a, ...b]);
  const intersection = [...a].filter((item) => b.has(item));
  return union.size ? intersection.length / union.size : 0;
}
