import test from "node:test";
import assert from "node:assert/strict";

import { buildImageryRulePack } from "../../js/domain/shared/imagery/buildImageryRulePack.js";

function natalReport(gender = "男") {
  return {
    natalAiEvidencePack: {
      chartSummary: {
        gender,
        dayMaster: "辛",
        pillars: {
          year: { label: "戊寅", stem: "戊", branch: "寅", stemTenGod: "正印", branchMainTenGod: "正财", hiddenStems: [] },
          month: { label: "辛酉", stem: "辛", branch: "酉", stemTenGod: "比肩", branchMainTenGod: "比肩", hiddenStems: [] },
          day: { label: "辛酉", stem: "辛", branch: "酉", stemTenGod: "比肩", branchMainTenGod: "比肩", hiddenStems: [] },
          hour: { label: "戊子", stem: "戊", branch: "子", stemTenGod: "正印", branchMainTenGod: "食神", hiddenStems: [] },
        },
      },
      natalBaseline: {
        monthCommand: "酉",
        elements: { dominant: ["金"], weakest: ["火"] },
      },
    },
  };
}

function basePlan(domains, timeScope = "natal", answerDepth = "standard") {
  return {
    isBaziQuestion: true,
    domainKeys: domains,
    timeScope,
    answerDepth,
    limits: { methodologyRules: 18, imageryRules: 18 },
  };
}

test("感情问题召回配偶星、夫妻宫与比劫财星边界规则", () => {
  const pack = buildImageryRulePack({
    question: "我的感情和正缘怎么看，哪几年容易稳定？",
    plan: basePlan(["spouse"], "multiYear"),
    natalImageReport: natalReport("男"),
    luckImageReport: { luckItems: [{ ganZhi: "癸亥", tenGod: "食神", branchTenGod: "伤官", transitStructure: { facts: [] } }] },
    requestedYearReports: [],
  });

  const ids = new Set(pack.matchedRuleIds);
  assert.ok(ids.has("spouse_gender_primary_star"));
  assert.ok(ids.has("spouse_star_and_palace"));
  assert.ok(ids.has("spouse_timing_multi_condition"));
  assert.ok(pack.methodologyRules.length > 0);
});

test("规则召回会依据真实关系，不会无条件塞入冲刑害破", () => {
  const pack = buildImageryRulePack({
    question: "这个人性格怎么样？",
    plan: basePlan(["self"], "natal"),
    natalImageReport: natalReport(),
  });

  const relationIds = pack.matchedRules
    .filter((item) => item.category === "relation")
    .map((item) => item.id);

  assert.equal(relationIds.length, 0);
});

test("职业问题会召回职业取象与食伤/印星工作方式规则", () => {
  const pack = buildImageryRulePack({
    question: "更适合技术还是管理，职业方向怎么选？",
    plan: basePlan(["career"], "natal", "deep"),
    natalImageReport: natalReport(),
  });

  const ids = new Set(pack.matchedRuleIds);
  assert.ok(ids.has("career_object_and_method"));
  assert.ok(ids.has("career_output_skill"));
  assert.ok(ids.has("career_resource_support"));
});
