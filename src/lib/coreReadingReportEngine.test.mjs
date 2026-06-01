import assert from "node:assert/strict";
import fs from "node:fs/promises";
import test from "node:test";
import { buildCoreReadingReport } from "./coreReadingReportEngine.js";
import { analyzeBirth } from "./readingEngine.js";

const FORBIDDEN_TEXT = /(一定|必定|绝对|必然|必离婚|必发财|必有灾|必坐牢|必死亡)/;
const CHART_KEYWORDS = /(日主|月令|五行|十神|干支|关系|规则|岁运|流年|大运|藏干|天干|地支)/;

test("builds an enriched core reading report from existing reading data", async () => {
  const datasets = await loadDatasets();
  const reading = analyzeBirth({
    date: "1998-09-11",
    time: "00:30",
    birthplace: "河北定州",
    gender: "male",
    selectedYear: 2026,
    selectedMonth: 5,
  }, datasets);

  const report = buildCoreReadingReport({
    reading,
    state: {
      date: "1998-09-11",
      time: "00:30",
      birthplace: "河北定州",
      gender: "male",
      trueSolarTime: false,
    },
  });

  assert.ok(report.headline);
  assert.ok(report.prioritySignals.length >= 3);
  assert.ok(report.prioritySignals.length <= 5);
  assert.ok(report.prioritySignals[0].title);
  assert.ok(report.prioritySignals[0].evidence);
  assert.ok(report.prioritySignals[0].howToRead);
  assert.ok(report.prioritySignals[0].contentReading);
  assert.ok(report.prioritySignals[0].themeMeaning);
  assert.ok(report.prioritySignals[0].limitation);
  assert.ok(report.coreTakeaways.length >= 4);
  assert.ok(report.coreTakeaways.length <= 6);
  assert.ok(report.teacherSummary.length >= 5);
  assert.ok(Array.isArray(report.secondaryNotes));
  assert.ok(report.mainNarrative.length >= 5);
  assert.ok(report.structureSections.length >= 5);
  assert.ok(report.themeSections.length >= 5);
  assert.ok(report.evidenceChain.length >= 6);
  assert.ok(report.uncertaintyNotes.length >= 7);
  assert.ok(report.transitBridge);

  for (const section of report.structureSections) {
    assert.ok(section.title);
    assert.ok(section.evidence || section.explanation);
    assert.ok(section.needVerify);
  }
  const tenGodStructure = report.structureSections.find((section) => section.title === "十神结构");
  assert.ok(tenGodStructure);
  assert.match(tenGodStructure.currentFocus, /当前十神重点|较突出|待观察/);
  assert.match(tenGodStructure.explanation, /财、官杀、印、食伤、比劫/);
  assert.match(tenGodStructure.explanation, /不把十神直接断成现实事件/);

  for (const item of report.coreTakeaways) {
    assert.ok(item.title);
    assert.ok(item.conclusion);
    assert.ok(item.evidence);
    assert.ok(item.meaning);
  }

  for (const section of report.themeSections) {
    assert.ok(section.title);
    assert.ok(section.reading);
    assert.ok(section.evidence);
    assert.ok(section.likelyExpression);
    assert.ok(section.caution);
  }

  for (const item of report.evidenceChain) {
    assert.ok(item.step);
    assert.ok(item.title);
    assert.ok(item.evidence);
    assert.ok(item.meaning);
    assert.ok(item.nextCheck);
  }

  const teacherText = report.teacherSummary.join("\n");
  for (const signal of report.prioritySignals.slice(0, 3)) {
    assert.match(teacherText, new RegExp(escapeRegExp(signal.title)));
  }
  for (const paragraph of report.teacherSummary) {
    assert.match(paragraph, CHART_KEYWORDS);
  }

  const reportText = JSON.stringify(report);
  assert.doesNotMatch(reportText, FORBIDDEN_TEXT);
  assert.ok(countOccurrences(reportText, "不能单独作为结论") <= 2);
  assert.ok(countOccurrences(reportText, "需要结合岁运继续验证") <= 2);
  assert.ok(countOccurrences(reportText, "当前没有明显命中") <= 1);
});

async function loadDatasets() {
  const bundle = JSON.parse(await fs.readFile(new URL("../../data/bazi-data-bundle.json", import.meta.url), "utf8"));
  return bundle.datasets ?? {};
}

function countOccurrences(text, phrase) {
  return String(text).split(phrase).length - 1;
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
