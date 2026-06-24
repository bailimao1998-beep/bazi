import test from "node:test";
import assert from "node:assert/strict";

import {
  buildStageAiRepairPrompt,
  validateStageAiText,
} from "../js/core/ai/stageAiTextValidator.js";

function baseReport() {
  return [
    "### 今年总断",
    "今年主要围绕规则审核、关系选择和计划调整展开。",
    "### 主要主题",
    "#### 学业与资格",
    "核心判断：考试、申请或正式审核是较强落点。",
    "#### 感情关系",
    "核心判断：关系机会增加，但需要观察持续投入。",
    "### 可能的发展路径",
    "外部要求先明确，随后个人需要调整方案并检验关系是否稳定。",
    "### 有利与风险",
    "- 有利：标准明确后更容易集中准备。",
    "- 风险：不要把一次互动判断成确定结果。",
    "### 行动建议",
    "1. 提前核对材料与截止要求。",
    "2. 观察关系中的持续行动。",
    "### 现实验证",
    "1. 是否出现考试、申请或材料修改？",
    "2. 是否出现持续的关系互动？",
  ].join("\n");
}

test(
  "只有风格问题时允许安全展示",
  () => {
    const report =
      baseReport().replace(
        "考试、申请",
        "standardsReview、申请",
      );

    const result =
      validateStageAiText({
        text: report,
        stage: "year",
        trustedPack: {
          relationFacts: [],
          relationWhitelist: [],
          evidenceConvergences: {},
          factualContext: {
            natal: {
              pillars: [],
            },
          },
        },
      });

    assert.equal(result.valid, false);
    assert.equal(result.safeToDisplay, true);
    assert.equal(result.blockingViolations.length, 0);

    assert.ok(
      result.qualityWarnings.some(
        (entry) =>
          entry.startsWith(
            "non_chinese_or_internal_term:",
          ),
      ),
    );
  },
);

test(
  "硬事实错误仍然禁止展示",
  () => {
    const report =
      baseReport().replace(
        "外部要求先明确",
        "寅酉暗合后外部要求明确",
      );

    const result =
      validateStageAiText({
        text: report,
        stage: "year",
        trustedPack: {
          relationFacts: [],
          relationWhitelist: [],
          evidenceConvergences: {},
          factualContext: {
            natal: {
              pillars: [],
            },
          },
        },
      });

    assert.equal(result.valid, false);
    assert.equal(result.safeToDisplay, false);

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
  "修复提示不再把英文校验代码喂给模型",
  () => {
    const repaired =
      buildStageAiRepairPrompt(
        {
          system:
            "只使用中文。",
          user:
            "生成报告。",
        },
        {
          hardViolations: [
            "non_chinese_or_internal_term:\\brelationFacts\\b",
            "repetitive_content:similar:2:5",
            "unsupported_relation_claim:寅酉:暗合",
          ],
        },
      );

    assert.doesNotMatch(
      repaired.system,
      /relationFacts|repetitive_content|unsupported_relation_claim/,
    );

    assert.match(repaired.system, /正文出现英文/);
    assert.match(repaired.system, /存在高度重复/);
    assert.match(repaired.system, /不存在的冲合刑害破关系/);
  },
);
