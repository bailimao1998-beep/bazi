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

  assert.doesNotMatch(JSON.stringify(report), FORBIDDEN_TEXT);
});

async function loadDatasets() {
  const bundle = JSON.parse(await fs.readFile(new URL("../../data/bazi-data-bundle.json", import.meta.url), "utf8"));
  return bundle.datasets ?? {};
}
