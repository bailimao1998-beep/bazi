import test from "node:test";
import assert from "node:assert/strict";

import {
  buildStageReportSystem,
} from "../js/core/ai/stageReportPromptPolicy.js";

test(
  "提示词明确禁止AI重新计算命理",
  () => {
    const system =
      buildStageReportSystem(
        "year",
      );

    assert.match(
      system,
      /不得重新计算/,
    );

    assert.match(
      system,
      /依据编号/,
    );

    assert.match(
      system,
      /只返回一个JSON对象/,
    );

    assert.match(
      system,
      /不要设置“可能的发展路径”章节/,
    );
  },
);
