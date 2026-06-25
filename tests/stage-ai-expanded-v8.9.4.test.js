import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const panel = fs.readFileSync("js/components/stageAnalysisPanel.js", "utf8");
const css = fs.readFileSync("styles/ai.css", "utf8");

test("stage AI result is rendered as a permanently expanded block", () => {
  assert.match(panel, /ai-collapse-card ai-collapse-expanded/);
  assert.match(panel, /ai-collapse-expanded-head/);
  assert.doesNotMatch(panel, /<details class="ai-collapse-card" open>/);
});

test("stage AI result has no internal max-height or scroll clipping", () => {
  assert.match(css, /stage-ai-expanded-v8\.9\.4/);
  assert.match(css, /max-height:\s*none\s*!important/);
  assert.match(css, /overflow:\s*visible\s*!important/);
});
