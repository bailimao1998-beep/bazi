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

const quickStart =
  source.indexOf(
    "function renderStageQuickSummary(",
  );

const quickEnd =
  source.indexOf(
    "\nfunction renderStageThemeCard(",
    quickStart,
  );

const quickSource =
  source.slice(
    quickStart,
    quickEnd,
  );

test(
  "阶段页继续渲染详细证据",
  () => {
    assert.match(
      source,
      /\$\{\s*renderStageEvidenceDetails\(\s*model\s*,\s*evidencePack\s*\)\s*\}/,
    );

    assert.match(
      source,
      /function renderStageEvidenceDetails\(/,
    );

    assert.match(
      source,
      /stage-evidence-details-compact/,
    );
  },
);

test(
  "只删除阶段速断中的主要触发和重点观察",
  () => {
    assert.doesNotMatch(
      quickSource,
      /<h4>主要触发<\/h4>/,
    );

    assert.doesNotMatch(
      quickSource,
      /<h4>重点观察<\/h4>/,
    );

    assert.doesNotMatch(
      quickSource,
      /stage-compact-balance/,
    );

    assert.doesNotMatch(
      quickSource,
      /可利用：|需留意：/,
    );
  },
);

test(
  "阶段速断顶部与四栏摘要仍保留",
  () => {
    assert.match(
      quickSource,
      /阶段速断/,
    );

    assert.match(
      quickSource,
      /外显主线/,
    );

    assert.match(
      quickSource,
      /现实承接/,
    );

    assert.match(
      quickSource,
      /主要结构/,
    );

    assert.match(
      quickSource,
      /现实落点/,
    );
  },
);
