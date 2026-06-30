import test from "node:test";
import assert from "node:assert/strict";

import { generateStageAiReport } from "../../js/services/ai/transit/stageAiReportService.js";
import { canonicalizeStructureFact } from "../../js/services/ai/guards/stageFactRuleGuard.js";

const minimalYearReport = {
  stage: "year",
  overallJudgment: "今年的主要变化集中在规则压力、执行调整与现实选择之间。",
  selectedImages: [],
  finalAdvice: ["根据现实反馈及时调整。"],
  verificationQuestions: [],
};

test("preflight errors no longer block AI generation", async () => {
  let called = 0;
  const outcome = await generateStageAiReport({
    stage: "year",
    settings: {},
    prompt: {
      preflight: { usable: false, errors: ["示例前置错误"], warnings: [] },
      rawFactPack: { facts: [] },
      candidatePack: { candidateImages: [] },
    },
    generate: async () => {
      called += 1;
      return { text: JSON.stringify(minimalYearReport), finishReason: "stop" };
    },
  });
  assert.equal(called, 1);
  assert.match(outcome.text, /年度总断/);
  assert.ok(outcome.warnings.some((item) => item.includes("示例前置错误")));
});

test("invalid structured report is still returned instead of hidden", async () => {
  const outcome = await generateStageAiReport({
    stage: "year",
    settings: {},
    prompt: {
      preflight: { usable: true, errors: [], warnings: [] },
      rawFactPack: { facts: [] },
      candidatePack: { candidateImages: [] },
    },
    generate: async () => ({ text: JSON.stringify(minimalYearReport), finishReason: "stop" }),
  });
  assert.match(outcome.text, /年度总断/);
  assert.equal(outcome.structured.stage, "year");
  assert.equal(outcome.advisoryOnly, true);
});

test("non-JSON AI response is displayed raw", async () => {
  const raw = "这是模型直接返回的流年分析正文。";
  const outcome = await generateStageAiReport({
    stage: "year",
    settings: {},
    prompt: { preflight: { usable: true }, rawFactPack: {}, candidatePack: {} },
    generate: async () => ({ text: raw, finishReason: "stop" }),
  });
  assert.equal(outcome.text, raw);
  assert.equal(outcome.rawResponseUsed, true);
});

test("half_harmony is not misclassified as harm", () => {
  const fact = canonicalizeStructureFact({
    id: "half",
    type: "half_harmony",
    relation: "半合",
    category: "convergence",
    status: "condition_only",
  });
  assert.equal(fact.relation, "半合条件");
  assert.equal(fact.certainty, "conditional");
  assert.equal(fact.hardFact, true);
});

test("derived hierarchy labels are not hard facts", () => {
  const fact = canonicalizeStructureFact({
    id: "derived",
    type: "cross_domain_linkage",
    relation: "双领域联动",
    category: "hierarchy",
    status: "direct",
  });
  assert.equal(fact.hardFact, false);
});
