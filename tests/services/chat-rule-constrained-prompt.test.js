import test from "node:test";
import assert from "node:assert/strict";
import { buildChatPrompt } from "../../js/services/ai/chat/buildChatPrompt.js";

test("Prompt以规则为主但不过度封闭AI表达", () => {
  const result = buildChatPrompt({
    question: "这个人的感情怎么样",
    chatIntent: "relationship",
    contextPlan: {
      isBaziQuestion: true,
      timeScope: "natal",
      answerDepth: "standard",
      domainKeys: ["spouse"],
      limits: {},
    },
    natalImageReport: {
      natalAiEvidencePack: {
        chartSummary: {
          gender: "男",
          dayMaster: "辛",
          pillars: {
            year: { label: "戊寅", stem: "戊", branch: "寅", hiddenStems: [] },
            month: { label: "辛酉", stem: "辛", branch: "酉", hiddenStems: [] },
            day: { label: "辛酉", stem: "辛", branch: "酉", hiddenStems: [] },
            hour: { label: "戊子", stem: "戊", branch: "子", hiddenStems: [] },
          },
        },
      },
    },
    selectedImagery: { role: "reference_only", natal: [] },
    imageryRulePack: {
      methodologyRules: [{ id: "method_1", instruction: "先取象" }],
      matchedRules: [{ id: "spouse_star_and_palace", title: "星宫共看" }],
      ruleConstraint: {
        mode: "rule_guided",
        allowExternalImageryRules: false,
        auditRequired: false,
        allowedRuleIds: ["spouse_star_and_palace"],
      },
    },
  });

  const payload = JSON.parse(result.user);
  assert.equal(payload.imageryRulePack.ruleConstraint.mode, "rule_guided");
  assert.match(result.system, /匹配规则优先/);
  assert.match(result.system, /保守补充推断/);
  assert.doesNotMatch(result.system, /具体取象只能来自本次匹配规则/);
  assert.doesNotMatch(result.system, /RULE_AUDIT/);
});
