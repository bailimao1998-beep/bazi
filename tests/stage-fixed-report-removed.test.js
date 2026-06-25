import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("stage image builders no longer create fixed reports", () => {
  for (const path of [
    "js/core/blind-bazi/buildLuckImageReport.js",
    "js/core/blind-bazi/buildYearImageReport.js",
    "js/core/blind-bazi/buildMonthImageReport.js",
  ]) {
    const source = read(path);
    assert.equal(source.includes("buildStageFixedReportModel"), false, path);
    assert.equal(/fixedReport\s*:/.test(source), false, path);
  }
});

test("stage AI prompts do not calculate or expose fixed report models", () => {
  for (const path of [
    "js/core/ai/buildLuckAiPrompt.js",
    "js/core/ai/buildYearAiPrompt.js",
    "js/core/ai/buildMonthAiPrompt.js",
  ]) {
    const source = read(path);
    assert.equal(source.includes("buildStageFixedReportModel"), false, path);
    assert.equal(source.includes("fallbackReportModel"), false, path);
    assert.equal(source.includes("fixedReportModel:"), false, path);
  }
});

test("stage UI no longer renders a fixed report card", () => {
  const source = read("js/components/stageAnalysisPanel.js");
  assert.equal(source.includes("renderStageFixedReportCard"), false);
  assert.equal(source.includes("十年阶段固定报告"), false);
  assert.equal(source.includes("年度固定报告"), false);
  assert.equal(source.includes("本月固定报告"), false);
});
