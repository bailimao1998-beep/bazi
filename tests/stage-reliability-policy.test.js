import test from "node:test";
import assert from "node:assert/strict";

import {
  buildStageReportSystem,
} from "../js/core/ai/stageReportPromptPolicy.js";

test(
  "大运提示词要求全景扫描后选择突出领域",
  () => {
    const system =
      buildStageReportSystem(
        "luck",
      );

    assert.match(
      system,
      /先全面扫描领域事实卡/,
    );

    assert.match(
      system,
      /二至五个突出领域/,
    );

    assert.match(
      system,
      /不要读取未来流年、流月来反推十年主题/,
    );

    assert.match(
      system,
      /其他领域概览/,
    );
  },
);

test(
  "流年提示词要求本年新增事实而非重复大运",
  () => {
    const system =
      buildStageReportSystem(
        "year",
      );

    assert.match(
      system,
      /本年新增了什么/,
    );

    assert.match(
      system,
      /流年新增事实至少占三分之一/,
    );

    assert.match(
      system,
      /大运事实只能作背景/,
    );

    assert.match(
      system,
      /不强行凑足数量/,
    );
  },
);

test(
  "流月提示词允许无强触发并要求流月依据占比",
  () => {
    const system =
      buildStageReportSystem(
        "month",
      );

    assert.match(
      system,
      /零至两个/,
    );

    assert.match(
      system,
      /流月新增事实至少占一半/,
    );

    assert.match(
      system,
      /没有新增强信号时直接写本月平稳延续/,
    );
  },
);

test(
  "提示词保留领域事实卡和主题内证据绑定",
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
      /"领域编号"/,
    );
  },
);
