import test from "node:test";
import assert from "node:assert/strict";
import {
  readFileSync,
} from "node:fs";

const source =
  readFileSync(
    new URL(
      "../js/components/stageAnalysisPanel.js",
      import.meta.url,
    ),
    "utf8",
  );

test(
  "阶段页面保留顶部速断摘要",
  () => {
    assert.match(
      source,
      /\$\{\s*renderStageQuickSummary\(model\)\s*\}/,
    );
  },
);

test(
  "阶段页面不再渲染主要触发与重点观察详情区",
  () => {
    assert.doesNotMatch(
      source,
      /\$\{\s*renderStageEvidenceDetails\(\s*model\s*,\s*evidencePack\s*\)\s*\}/,
    );
  },
);
