import test from "node:test";
import assert from "node:assert/strict";

import { validateStageAiReport } from "../js/core/ai/stageAiReportContract.js";
import { generateStageAiReport } from "../js/core/ai/stageAiReportService.js";

const rawFactPack = {
  validation: { usable: true, errors: [], warnings: [] },
  stage: "luck",
  stageLabel: "大运",
  target: { ganZhi: "癸亥", ageRange: "19-28岁", yearRange: "2017年12月—2027年12月" },
  natal: { gender: "male", ageAtTarget: 27, dayMaster: "辛" },
  facts: [
    { id: "fact:stem", kind: "ten_god", type: "stem_ten_god", char: "癸", tenGod: "食神", relation: "天干十神" },
    { id: "fact:branch", kind: "ten_god", type: "branch_ten_god", char: "亥", tenGod: "伤官", relation: "地支主气十神" },
  ],
};

const candidatePack = {
  candidateImages: [
    { ruleId: "rule:stem", evidenceIds: ["fact:stem"], allowedScenes: ["技能输出"] },
    { ruleId: "rule:branch", evidenceIds: ["fact:branch"], allowedScenes: ["环境承接"] },
  ],
};

function baseReport() {
  return {
    stage: "luck",
    overallJudgment: "短",
    stemPhase: {
      title: "天干前五年",
      phaseNote: "前五年只看天干",
      summary: "19-23岁容易得到长辈资源，并在2020年出现高峰。",
      evidenceIds: ["fact:stem"],
      ruleIds: ["rule:stem"],
      positive: ["技能输出"],
      risks: ["节奏偏快"],
      advice: ["形成成果"],
    },
    branchPhase: {
      title: "地支后五年",
      phaseNote: "后段偏重地支",
      summary: "亥子半会水局，后段更偏环境承接。",
      evidenceIds: ["fact:branch"],
      ruleIds: ["rule:branch"],
      positive: ["适应变化"],
      risks: ["反复"],
      advice: ["保留调整空间"],
    },
    assessment: {
      verdict: "",
      label: "",
      summary: "",
      evidenceIds: [],
      ruleIds: [],
      gains: [],
      costs: [],
    },
    directions: {
      careerDirection: {
        summary: "技能与输出是主线。",
        evidenceIds: ["fact:stem"],
        ruleIds: ["rule:stem"],
        positive: ["形成作品"],
        risks: ["分散"],
        advice: ["聚焦主线"],
      },
      relationship: {
        summary: "感情一定会进入婚姻。",
        evidenceIds: [],
        ruleIds: [],
        positive: ["关系机会"],
        risks: [],
        advice: ["主动承诺"],
      },
      healthState: {
        summary: "需注意肾脏和泌尿系统。",
        evidenceIds: [],
        ruleIds: [],
        positive: [],
        risks: ["肾脏压力"],
        advice: ["注意肾脏"],
      },
    },
    actionAdvice: { advance: [], control: [], avoidForNow: [] },
    transition: { summary: "", advice: [] },
    verificationQuestions: [],
  };
}

test("大运软缺陷不再阻断九步流程", () => {
  const result = validateStageAiReport({
    report: baseReport(),
    stage: "luck",
    rawFactPack,
    candidatePack,
  });

  assert.equal(result.usable, true);
  assert.equal(result.fatalIssues.length, 0);
  assert.match(result.structured.directions.relationship.summary, /未形成独立强象/);
  assert.match(result.structured.directions.healthState.summary, /未形成独立强象/);
  assert.doesNotMatch(JSON.stringify(result.structured), /长辈资源|2020|19-23岁|半会水局|肾脏|泌尿系统/);
  assert.ok(result.warnings.length > 0);
  assert.equal(result.structured.assessment.verdict, "mixed");
  assert.ok(result.structured.actionAdvice.advance.length > 0);
  assert.ok(result.structured.transition.summary.length > 0);
});

test("核心天干阶段引用不存在时仍然阻断", () => {
  const report = baseReport();
  report.stemPhase.evidenceIds = ["fact:missing"];
  report.stemPhase.ruleIds = ["rule:missing"];

  const result = validateStageAiReport({ report, stage: "luck", rawFactPack, candidatePack });
  assert.equal(result.usable, false);
  assert.ok(result.fatalIssues.some((item) => item.includes("天干前五年引用了不存在")));
});

test("两次AI核心引用失败后仍返回九步结构而不是只显示事实", async () => {
  const invalid = baseReport();
  invalid.stemPhase.evidenceIds = ["fact:missing"];
  invalid.stemPhase.ruleIds = ["rule:missing"];

  const outcome = await generateStageAiReport({
    settings: {},
    stage: "luck",
    prompt: {
      system: "test",
      user: "{}",
      preflight: { usable: true, errors: [], warnings: [] },
      rawFactPack,
      candidatePack,
    },
    generate: async () => ({ text: JSON.stringify(invalid), finishReason: "stop" }),
  });

  assert.equal(outcome.fallbackUsed, true);
  assert.ok(outcome.structured);
  assert.equal(outcome.structured.stage, "luck");
  assert.ok(outcome.structured.stemPhase);
  assert.ok(outcome.structured.branchPhase);
  assert.ok(outcome.structured.directions.relationship);
});
