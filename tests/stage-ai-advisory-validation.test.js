import test from "node:test";
import assert from "node:assert/strict";

import {
  validateStageAiText,
} from "../js/core/ai/stageAiTextValidator.js";

function trustedPack() {
  return {
    relationFacts: [],
    relationWhitelist: [],
    evidenceConvergences: {},
    factualContext: {
      natal: {
        pillars: [],
      },
    },
  };
}

function reportWith(text) {
  return [
    "### 今年总断",
    "今年存在多个并行主题。",
    "### 主要主题",
    "#### 主题一",
    "核心判断：规则与计划需要重新协调。",
    "#### 主题二",
    "核心判断：关系互动需要现实验证。",
    "### 可能的发展路径",
    text,
    "### 有利与风险",
    "- 有利：更容易看清重点。",
    "- 风险：避免过度推断。",
    "### 行动建议",
    "1. 先核对要求。",
    "2. 给计划留出修改空间。",
    "### 现实验证",
    "1. 是否出现材料或计划调整？",
    "2. 是否出现持续关系互动？",
  ].join("\n");
}

test(
  "年初等时间词仍记录警告但允许展示",
  () => {
    const result =
      validateStageAiText({
        text:
          reportWith(
            "年初更容易出现规则调整，之后逐步适应。",
          ),
        stage: "year",
        trustedPack:
          trustedPack(),
      });

    assert.equal(
      result.valid,
      false,
    );

    assert.equal(
      result.safeToDisplay,
      true,
    );

    assert.ok(
      result.hardViolations.some(
        (entry) =>
          entry.startsWith(
            "unsupported_year_timing:",
          ),
      ),
    );
  },
);

test(
  "大运前后段仍记录警告但允许展示",
  () => {
    const result =
      validateStageAiText({
        text:
          reportWith(
            "大运后半段更重视成果与关系选择。",
          ),
        stage: "luck",
        trustedPack:
          trustedPack(),
      });

    assert.equal(
      result.valid,
      false,
    );

    assert.equal(
      result.safeToDisplay,
      true,
    );

    assert.ok(
      result.hardViolations.some(
        (entry) =>
          entry.startsWith(
            "unsupported_luck_timing:",
          ),
      ),
    );
  },
);

test(
  "关系错误也只做警告不再阻止返回",
  () => {
    const result =
      validateStageAiText({
        text:
          reportWith(
            "寅酉暗合后，关系出现新的牵动。",
          ),
        stage: "year",
        trustedPack:
          trustedPack(),
      });

    assert.equal(
      result.valid,
      false,
    );

    assert.equal(
      result.safeToDisplay,
      true,
    );

    assert.ok(
      result.blockingViolations.some(
        (entry) =>
          entry.startsWith(
            "unsupported_relation_claim:",
          ),
      ),
    );
  },
);

test(
  "空内容仍然不能展示",
  () => {
    const result =
      validateStageAiText({
        text: "",
        stage: "year",
        trustedPack:
          trustedPack(),
      });

    assert.equal(
      result.safeToDisplay,
      false,
    );
  },
);
