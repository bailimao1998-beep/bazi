import test from "node:test";
import assert from "node:assert/strict";

import {
  buildChatPrompt,
} from "../js/core/ai/buildChatPrompt.js";

const natalImageReport = {
  natalAiEvidencePack: {
    chartSummary: {
      gender:
        "男",
      dayMaster:
        "辛",
      pillars: {
        year: {
          label:
            "戊寅",
          stem:
            "戊",
          branch:
            "寅",
          stemTenGod:
            "正印",
          branchMainTenGod:
            "正财",
          hiddenStems: [],
        },
        month: {
          label:
            "辛酉",
          stem:
            "辛",
          branch:
            "酉",
          stemTenGod:
            "比肩",
          branchMainTenGod:
            "比肩",
          hiddenStems: [],
        },
        day: {
          label:
            "辛酉",
          stem:
            "辛",
          branch:
            "酉",
          stemTenGod:
            "比肩",
          branchMainTenGod:
            "比肩",
          hiddenStems: [],
        },
        hour: {
          label:
            "戊子",
          stem:
            "戊",
          branch:
            "子",
          stemTenGod:
            "正印",
          branchMainTenGod:
            "食神",
          hiddenStems: [],
        },
      },
    },
    dayMasterSummary: {
      stem:
        "辛",
      element:
        "金",
    },
    natalBaseline: {
      monthCommand: {
        branch:
          "酉",
      },
      elements: {
        counts: {
          金:
            3,
        },
      },
      confidence:
        "medium",
    },
    warnings: [],
  },
};

const luckImageReport = {
  luckItems: [
    {
      index:
        1,
      ageRange:
        "21-30岁",
      yearRange:
        "2019-2028",
      ganZhi:
        "癸亥",
      stem:
        "癸",
      branch:
        "亥",
      tenGod:
        "食神",
      branchTenGod:
        "伤官",
      isCurrent:
        true,
      relationToNatal: [],
      transitStructure: {
        facts: [],
      },
    },
  ],
};

test(
  "通用命理问题始终携带原局硬数据辅助信息和完整大运基础",
  () => {
    const result =
      buildChatPrompt({
        question:
          "这个人控制欲强吗？",
        chatIntent:
          "free",
        natalImageReport,
        luckImageReport,
        contextPlan: {
          version:
            "chat-context-plan-v1",
          isBaziQuestion:
            true,
          timeScope:
            "natal",
          answerDepth:
            "standard",
          domainKeys: [
            "self",
          ],
          include: {},
          limits: {
            chatTurns:
              4,
          },
        },
        selectedImagery: {
          source:
            "local_rule_engine",
          role:
            "reference_only",
          natal: [
            {
              title:
                "边界感较强",
            },
          ],
        },
        chatHistory: [
          {
            question:
              "先看性格",
            answer:
              "上轮回答",
          },
        ],
        chart: {
          input: {
            year:
              1998,
          },
        },
        currentInput: {
          targetYear:
            2026,
        },
      });

    const payload =
      JSON.parse(
        result.user,
      );

    assert.equal(
      payload.dataMode,
      "hybrid_facts_plus_selected_imagery_plus_rule_kb",
    );

    assert.equal(
      payload
        .natalHardFacts
        .dayMaster,
      "辛",
    );

    assert.equal(
      payload
        .natalAuxiliaryFacts
        .role,
      "auxiliary_reference_not_final",
    );

    assert.equal(
      payload
        .luckHardFacts
        .luckCycles
        .length,
      1,
    );

    assert.equal(
      payload
        .selectedImagery
        .role,
      "reference_only",
    );

    assert.equal(
      payload
        .chatHistory
        .length,
      1,
    );
  },
);

test(
  "提示词明确要求先取象后展开并允许否定候选取象",
  () => {
    const result =
      buildChatPrompt({
        question:
          "全面分析",
        chatIntent:
          "natalOverview",
        natalImageReport,
        luckImageReport,
      });

    assert.match(
      result.system,
      /必须先取象再展开/,
    );

    assert.match(
      result.system,
      /可以对本次匹配规则和候选取象做合并、降级、否定、排序和现实化表达/,
    );

    assert.match(
      result.system,
      /## 核心取象/,
    );
  },
);
