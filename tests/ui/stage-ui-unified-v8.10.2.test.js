import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const panel = fs.readFileSync("js/ui/transit/stageAnalysisPanel.js", "utf8");
const aiCss = fs.readFileSync("styles/chat/ai.css", "utf8");
const luckCss = fs.readFileSync("styles/transit/luck-flow.css", "utf8");
const yearMonthCss = fs.readFileSync("styles/transit/year-month-flow.css", "utf8");

test("stage AI result is collapsible and remains fully expanded internally", () => {
  assert.match(panel, /stage-ai-result-details/);
  assert.match(panel, /<summary class="stage-ai-result-summary">/);
  assert.doesNotMatch(panel, /class="ai-collapse-card ai-collapse-expanded"/);
  assert.match(aiCss, /stage-ui-unified-v8\.10\.2/);
  assert.match(aiCss, /max-height:\s*none\s*!important/);
  assert.match(aiCss, /overflow:\s*visible\s*!important/);
});

test("stage AI toolbar keeps its original class", () => {
  assert.match(panel, /ai-feature-result-toolbar/);
});

test("luck cards use the light site palette", () => {
  assert.match(luckCss, /background:\s*#fffdf9/);
  assert.match(luckCss, /color:\s*var\(--ink\)/);
  assert.doesNotMatch(luckCss, /linear-gradient\(145deg,\s*#4d459b/);
  assert.doesNotMatch(luckCss, /color:\s*#f7f4ed/);
});

test("year and month cards use the light site palette", () => {
  assert.match(yearMonthCss, /background:\s*#fffdf9/);
  assert.match(yearMonthCss, /border-top:\s*4px solid/);
  assert.doesNotMatch(yearMonthCss, /background:\s*linear-gradient\(180deg,\s*#09634f/);
  assert.doesNotMatch(yearMonthCss, /color:\s*#f6f1e8/);
});
