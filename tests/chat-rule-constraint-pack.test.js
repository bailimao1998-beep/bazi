import test from "node:test";
import assert from "node:assert/strict";
import { buildImageryRulePack } from "../js/core/imagery-rules/buildImageryRulePack.js";

const natalImageReport = {
  natalAiEvidencePack: {
    chartSummary: {
      gender: "男",
      dayMaster: "辛",
      pillars: {
        year: { label: "戊寅", stem: "戊", branch: "寅", stemTenGod: "正印", hiddenStems: [] },
        month: { label: "辛酉", stem: "辛", branch: "酉", stemTenGod: "比肩", hiddenStems: [] },
        day: { label: "辛酉", stem: "辛", branch: "酉", hiddenStems: [] },
        hour: { label: "戊子", stem: "戊", branch: "子", stemTenGod: "正印", hiddenStems: [] },
      },
    },
    facts: [
      { id: "fact_1", name: "正印透干", statement: "正印出现" },
    ],
  },
};

test("规则包启用规则优先而非强制封闭模式", () => {
  const pack = buildImageryRulePack({
    question: "这个人的学习和工作方式怎么样",
    plan: {
      isBaziQuestion: true,
      timeScope: "natal",
      answerDepth: "standard",
      domainKeys: ["self", "career"],
      limits: {},
    },
    natalImageReport,
    selectedImagery: { role: "reference_only", natal: [] },
  });

  assert.equal(pack.ruleConstraint.mode, "rule_guided");
  assert.equal(pack.ruleConstraint.allowExternalImageryRules, false);
  assert.equal(pack.ruleConstraint.claimBindingRequired, false);
  assert.equal(pack.ruleConstraint.auditRequired, false);
  assert.equal(pack.ruleConstraint.methodologyCanSupportClaims, true);
  assert.ok(pack.matchedRules.length > 0);
  assert.match(pack.ruleConstraint.fallbackWhenNoRuleMatches, /保守补充推断/);
});

test("规则匹配仍保留真实触发证据和上下文规则区分", () => {
  const pack = buildImageryRulePack({
    question: "感情怎么样",
    plan: {
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
          pillars: {},
        },
      },
    },
    selectedImagery: { role: "reference_only", natal: [] },
  });

  assert.ok(
    pack.matchedRules
      .filter((item) => item.claimSupportAllowed)
      .every((item) => item.triggerEvidence.length > 0),
  );
  assert.ok(
    pack.matchedRules
      .filter((item) => item.triggerEvidence.length === 0)
      .every((item) => item.claimSupportAllowed === false),
  );
});
