import test from "node:test";
import assert from "node:assert/strict";

import {
  buildStageReportSystem,
} from "../js/core/ai/stageReportPromptPolicy.js";

test(
  "提示词禁止在正文泄露事实编号",
  () => {
    const system =
      buildStageReportSystem(
        "month",
      );

    assert.match(
      system,
      /正文.*禁止出现F01/,
    );

    assert.match(
      system,
      /没有两条独立事实支持时/,
    );

    assert.match(
      system,
      /三至五句/,
    );
  },
);
