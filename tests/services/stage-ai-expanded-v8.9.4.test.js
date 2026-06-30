import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const panel = fs.readFileSync("js/ui/transit/stageAnalysisPanel.js", "utf8");
const css = fs.readFileSync("styles/chat/ai.css", "utf8");

test("stage AI result is rendered as an open collapsible block", () => {
  assert.match(panel, /stage-ai-result-details/);
  assert.match(panel, /stage-ai-result-summary/);
  assert.match(panel, /<details class="ai-collapse-card[^>]+open>/);
  assert.doesNotMatch(panel, /ai-collapse-card ai-collapse-expanded/);
});

test("stage AI result has no internal max-height or scroll clipping", () => {
  assert.match(css, /stage-ai-expanded-v8\.9\.4/);
  assert.match(css, /max-height:\s*none\s*!important/);
  assert.match(css, /overflow:\s*visible\s*!important/);
});
