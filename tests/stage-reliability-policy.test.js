import test from "node:test";
import assert from "node:assert/strict";

import {
  buildStageReportSystem,
} from "../js/core/ai/stageReportPromptPolicy.js";

test(
  "提示词要求领域事实卡和主题内证据绑定",
  () => {
    const system =
      buildStageReportSystem(
        "luck",
      );

    assert.match(
      system,
      /主题必须从“领域事实卡”中选择/,
    );

    assert.match(
      system,
      /每个主题只能引用该领域事实卡列出的依据编号/,
    );

    assert.match(
      system,
      /不得自行下否定关系判断/,
    );

    assert.match(
      system,
      /若领域事实卡只有两个可靠领域，不得为了凑数虚构第三主题/,
    );

    assert.match(
      system,
      /"领域编号"/,
    );
  },
);
