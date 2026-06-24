import test from "node:test";
import assert from "node:assert/strict";

import {
  buildStageReportSystem,
} from "../js/core/ai/stageReportPromptPolicy.js";

test(
  "提示词强调可靠优先且允许分层可能性",
  () => {
    const luck =
      buildStageReportSystem(
        "luck",
      );

    const year =
      buildStageReportSystem(
        "year",
      );

    const month =
      buildStageReportSystem(
        "month",
      );

    assert.match(
      luck,
      /三至四个/,
    );

    assert.match(
      luck,
      /二至四种可能表现/,
    );

    assert.match(
      luck,
      /不追求绝对唯一答案/,
    );

    assert.match(
      year,
      /一至三种现实可能/,
    );

    assert.match(
      month,
      /一至两种短期表现/,
    );
  },
);
