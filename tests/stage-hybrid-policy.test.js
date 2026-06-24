import test from "node:test";
import assert from "node:assert/strict";

import {
  buildStageReportSystem,
} from "../js/core/ai/stageReportPromptPolicy.js";

test(
  "混合版提示词使用领域证据并避免十神模板化",
  () => {
    const system =
      buildStageReportSystem(
        "year",
      );

    assert.match(
      system,
      /领域证据排序/,
    );

    assert.match(
      system,
      /不要把十神机械翻译成固定剧情/,
    );

    assert.match(
      system,
      /人生阶段只用于调整场景优先级，不作为硬性屏蔽/,
    );

    assert.match(
      system,
      /总断、主题、有利、风险和建议都不得补充事实包中不存在/,
    );
  },
);
