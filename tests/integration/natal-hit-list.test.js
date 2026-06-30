import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import test from "node:test";

import { calculateBazi } from "../../js/domain/bazi/calculateBazi.js";
import { buildBaseBaziViewModel } from "../../js/domain/bazi/buildBaseBaziViewModel.js";
import { buildNatalImageReport } from "../../js/domain/natal/reports/buildNatalImageReport.js";
import { buildNatalFeatureVector } from "../../js/domain/natal/natalFeatureVector.js";

const forbiddenTransitPattern = /大运|流年|流月|当前步运|岁运|流日/;

function loadLocations() {
  global.window = {};
  Function(readFileSync("js/generated/locationCatalog.js", "utf8"))();
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

test("natal hit list uses merged composition rows and keeps legacy rows for debug", () => {
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
  assert.equal(report.hitList.scope, "natal");
  assert.equal(report.natalDebug.displayedHitListSource, "merged");
  assert.equal(
    report.hitList.all.length,
    report.natalDebug.mergedComposition.images.length,
  );
  assert.ok(report.hitList.all.length > 0);
  assert.ok(report.natalDebug.legacyHitList.all.length > report.hitList.all.length);
  assert.ok(report.hitList.featured.length <= 8);
  assert.ok(report.hitList.confirmed.length > 0);
  assert.ok(report.hitList.conditional.length > 0);
  assert.ok(Array.isArray(report.hitList.weak));
  assert.ok(report.natalDebug.legacyHitList.weak.length > 0);
  assert.ok(report.hitList.byCategory["核心结构"].length > 0);
  assert.ok(report.hitList.byCategory["支持结构"].length > 0);
  assert.ok(report.hitList.byCategory["张力结构"].length > 0);
  assert.ok(report.hitList.byCategory["条件结构"].length > 0);
  assert.ok(report.natalDebug.legacyHitList.byCategory["日主根气"].length > 0);
  assert.ok(report.natalDebug.legacyHitList.byCategory["十神透藏"].length > 0);
  assert.ok(report.natalDebug.legacyHitList.byCategory["组合结构"].length > 0);
  assert.ok(report.natalDebug.legacyHitList.byCategory["干支关系"].length >= 7);
  assert.ok(report.natalDebug.legacyHitList.byCategory["柱位重复"].some((item) => /伏吟/.test(item.name)));
  assert.ok(report.natalDebug.legacyHitList.byCategory["五行调候"].some((item) => /火弱|火不显/.test(item.name)));
  assert.ok(report.natalDebug.legacyHitList.byCategory["神煞辅助"].length > 0);
  assert.ok(!report.hitList.all.some((item) => item.category === "神煞辅助"));

  const names = report.hitList.all.map((item) => item.name);
  for (const expected of [
    "官印承接结构链候选（受财坏印牵制，结构降级）",
    "月令正官",
    "日柱参与伏吟",
    "夫妻宫见月支酉与日支子相破",
    "日支逢合",
    "金水偏重、火气不足线索",
  ]) {
    assert.ok(names.includes(expected), `missing natal hit: ${expected}`);
  }

  for (const item of report.hitList.all) {
    assert.match(item.status, /^(confirmed|conditional|weak)$/);
    assert.match(item.importance, /^(high|medium|low)$/);
    assert.ok(Array.isArray(item.evidence));
    assert.ok(Array.isArray(item.relatedFactIds));
    assert.equal(item.scope, "natal");
    assert.match(
      item.source,
      /^(新版组合取象规则|V2专业组合判断)$/,
    );
    assert.ok(item.evidence.every((entry) => typeof entry === "string" && entry));
    assert.doesNotMatch(JSON.stringify(item), forbiddenTransitPattern);
  }

  const legacyNames =
    report.natalDebug.legacyHitList.all.map((item) => item.name);
  for (const expected of [
    "甲木生于酉月失令",
    "月干正印透出",
    "时干比肩透出",
    "年干正财透出",
    "原局食伤不显",
  ]) {
    assert.ok(legacyNames.includes(expected), `missing legacy natal hit: ${expected}`);
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
