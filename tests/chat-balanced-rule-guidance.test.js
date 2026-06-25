import test from "node:test";
import assert from "node:assert/strict";
import { buildChatContextPlan } from "../js/core/ai/buildChatContextPlan.js";
import { validateChatResponse } from "../js/core/ai/chatResponseGuard.js";

test("直接回答会进入简洁模式", () => {
  const plan = buildChatContextPlan({
    question: "直接回答，这个人适合技术还是管理",
    chatIntent: "career",
    chartAvailable: true,
  });
  assert.equal(plan.answerDepth, "concise");
});

test("简洁模式只要求四个核心栏目", () => {
  const prompt = {
    user: JSON.stringify({
      chatIntent: "career",
      contextPlan: {
        isBaziQuestion: true,
        timeScope: "natal",
        answerDepth: "concise",
      },
      natalHardFacts: {
        dayMaster: "辛",
        pillars: {
          year: { label: "戊寅" },
          month: { label: "辛酉" },
          day: { label: "辛酉" },
          hour: { label: "戊子" },
        },
      },
      imageryRulePack: {
        ruleConstraint: {
          mode: "rule_guided",
          auditRequired: false,
        },
      },
    }),
  };

  const text = `
## 直接回答
更偏专业技术与分析型岗位，管理能力适合在专业基础上逐步发展。

## 核心取象
主象是专业积累强、输出需要现实节点推动。

## 行动建议
先用作品、项目和沟通能力把专业优势转成可见成果。

## 注意边界
这只是职业方式倾向，不能替代现实经历和行业条件。
`;

  const result = validateChatResponse({ text, prompt });
  assert.equal(result.valid, true, result.violations.join("\n"));
});
