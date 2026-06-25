import test from "node:test";
import assert from "node:assert/strict";

import { buildChatPrompt } from "../js/core/ai/buildChatPrompt.js";

const natalImageReport = {
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
};

test("Prompt携带常驻总纲和动态匹配规则", () => {
  const result = buildChatPrompt({
    question: "我的感情怎么样",
    chatIntent: "relationship",
    contextPlan: { isBaziQuestion: true, timeScope: "natal", answerDepth: "standard", domainKeys: ["spouse"], limits: {} },
    natalImageReport,
    luckImageReport: { luckItems: [] },
    selectedImagery: { role: "reference_only", natal: [] },
    imageryRulePack: {
      version: "blind-bazi-imagery-kb-v1",
      methodologyRules: [{ id: "method_image_before_story", instruction: "先取象" }],
      matchedRules: [{ id: "spouse_star_and_palace", requires: ["星宫共看"] }],
      instruction: ["先验证规则"],
    },
  });

  const payload = JSON.parse(result.user);
  assert.equal(payload.dataMode, "hybrid_facts_plus_selected_imagery_plus_rule_kb");
  assert.equal(payload.imageryRulePack.methodologyRules[0].id, "method_image_before_story");
  assert.equal(payload.imageryRulePack.matchedRules[0].id, "spouse_star_and_palace");
  assert.match(result.system, /书本取象规则/);
});
