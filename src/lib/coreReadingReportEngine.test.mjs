import assert from "node:assert/strict";
import fs from "node:fs/promises";
import test from "node:test";
import { buildCoreReadingReport } from "./coreReadingReportEngine.js";
import { analyzeBirth } from "./readingEngine.js";

const FORBIDDEN_TEXT = /(一定|必定|绝对|必然|必离婚|必发财|必有灾|必坐牢|必死亡)/;

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
  assert.ok(report.teacherSummary.length >= 4);
  assert.ok(Array.isArray(report.secondaryNotes));
  assert.ok(report.mainNarrative.length >= 5);
  assert.ok(report.structureSections.length >= 5);
  assert.ok(report.themeSections.length >= 4);
  assert.ok(report.evidenceChain.length >= 6);
  assert.ok(report.uncertaintyNotes.length >= 7);
  assert.ok(report.transitBridge);

  for (const section of report.structureSections) {
    assert.ok(section.title);
    assert.ok(section.evidence || section.explanation);
    assert.ok(section.needVerify);
  }

  for (const section of report.themeSections) {
    assert.ok(section.title);
    assert.ok(section.observation);
    assert.ok(section.evidence);
    assert.ok(section.limitation);
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

  const reportText = JSON.stringify(report);
  assert.doesNotMatch(reportText, FORBIDDEN_TEXT);
  assert.ok(countOccurrences(reportText, "不能单独作为结论") <= 3);
  assert.ok(countOccurrences(reportText, "当前没有明显命中") <= 2);
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
