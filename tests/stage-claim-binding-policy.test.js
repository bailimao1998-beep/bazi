import test from "node:test";
import assert from "node:assert/strict";

import {
  buildStageReportSystem,
} from "../js/core/ai/stageReportPromptPolicy.js";

test(
  "提示词绑定术语依据并适配人生阶段",
  () => {
    const system =
      buildStageReportSystem(
        "month",
      );

    assert.match(
      system,
      /每一条技术判断都必须能被.*事实编号直接证明/,
    );

    assert.match(
      system,
      /只有引用事实明确写明整柱相同/,
    );

    assert.match(
      system,
      /写“食神制杀”必须同时引用食神、七杀和明确生克关系/,
    );

    assert.match(
      system,
      /晚年用户优先写生活节奏/,
    );

    assert.match(
      system,
      /流月报告只能写本月范围/,
    );
  },
);
