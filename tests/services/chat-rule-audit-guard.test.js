import test from "node:test";
import assert from "node:assert/strict";
import {
  sanitizeChatResponse,
  stripRuleAudit,
  validateChatResponse,
} from "../../js/services/ai/guards/chatResponseGuard.js";

const prompt = {
  user: JSON.stringify({
    chatIntent: "relationship",
    contextPlan: {
      isBaziQuestion: true,
      timeScope: "natal",
      answerDepth: "standard",
    },
    natalHardFacts: {
      gender: "男",
      dayMaster: "辛",
      pillars: {
        year: { label: "戊寅" },
        month: { label: "辛酉" },
        day: { label: "辛酉" },
        hour: { label: "戊子" },
      },
      mechanicalRelations: [
        { relation: "破", branches: ["子", "酉"] },
      ],
    },
    imageryRulePack: {
      matchedRules: [
        { id: "spouse_star_and_palace", title: "配偶星与夫妻宫共看" },
      ],
      ruleConstraint: {
        mode: "rule_guided",
        auditRequired: false,
        allowedRuleIds: ["spouse_star_and_palace"],
      },
    },
  }),
};

const body = `
## 直接回答
感情判断应先看配偶星与夫妻宫能否互相承接，目前更适合看关系边界和责任分配。

## 核心取象
- 主象：关系建立需要现实承接和明确边界。
- 条件象：配偶星、夫妻宫与现实互动同时被引动时更明显。

## 命理依据
原局四柱为戊寅、辛酉、辛酉、戊子，日主辛；感情取象按配偶星与夫妻宫共同复核。

## 展开分析
原局层面先看配偶星来源和日支承接，不把单一十神直接当成婚恋事实。

## 可能表现
### 1. 更重视关系责任和边界
- 可能性：中
- 依据A：原局日支提供关系承接位置。
- 依据B：配偶结构规则与原局事实共同支持。
- 成立条件：现实互动进入责任分配阶段。
- 削弱因素：若互动稳定且边界清楚，压力表现会减弱。

## 行动建议
先观察长期互动、责任分配和沟通稳定性。

## 注意边界
命盘不能确认现实关系状态，也不能仅凭原局锁定婚期。
`;

test("规则引导模式不再强制RULE_AUDIT", () => {
  const result = validateChatResponse({ text: body, prompt });
  assert.equal(result.valid, true, result.violations.join("\n"));
});

test("显示清洗会删除内部规则ID和审计注释", () => {
  const text = `${body}
依据：pattern_peer_competes_wealth规则。
<!--RULE_AUDIT
{"claims":[]}
RULE_AUDIT-->`;

  const cleaned = sanitizeChatResponse({ text, prompt });
  assert.equal(cleaned.includes("pattern_peer_competes_wealth"), false);
  assert.equal(cleaned.includes("RULE_AUDIT"), false);
  assert.equal(stripRuleAudit(text).includes("RULE_AUDIT"), false);
});
