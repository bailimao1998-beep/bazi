import test from "node:test";
import assert from "node:assert/strict";

import {
  buildStageReportSystem,
} from "../js/core/ai/stageReportPromptPolicy.js";

test(
  "提示词允许术语但限制具体场景和伪精度",
  () => {
    const system =
      buildStageReportSystem(
        "luck",
      );

    assert.match(
      system,
      /允许使用必要的命理术语/,
    );

    assert.match(
      system,
      /旧项目、旧人、旧机会/,
    );

    assert.match(
      system,
      /每三个月、观察一周、提前两周/,
    );

    assert.match(
      system,
      /大运报告至少保留两个主题/,
    );
  },
);
