import test from "node:test";
import assert from "node:assert/strict";

import {
  getStageAiOutputContract,
  validateStageAiReport,
} from "../js/core/ai/stageAiReportContract.js";
import { renderLuckFlowReport } from "../js/components/luckFlowRenderer.js";

const rawFactPack = {
  validation: { usable: true, errors: [], warnings: [] },
  natal: {
    gender: "male",
    ageAtTarget: 28,
    pillars: [
      { key: "year", stemTenGod: "正印" },
      { key: "month", stemTenGod: "比肩" },
      { key: "day", stemTenGod: "比肩" },
      { key: "hour", stemTenGod: "正印" },
    ],
  },
  target: { ganZhi: "癸亥", ageRange: "19-28岁", yearRange: "2017-2026" },
  layers: {
    luck: { stemTenGod: "食神", branchMainTenGod: "伤官" },
  },
  factGroups: [],
  facts: [
    { id: "fact-stem", kind: "ten_god", relation: "天干十神", tenGod: "食神" },
    { id: "fact-branch", kind: "ten_god", relation: "地支主气十神", tenGod: "伤官" },
    { id: "fact-career", kind: "structure", relation: "天干五合" },
    { id: "fact-relation", kind: "structure", relation: "六合" },
    { id: "fact-health", kind: "structure", relation: "三会两支", certainty: "conditional" },
  ],
};

const candidatePack = {
  candidateImages: [
    { ruleId: "rule-stem", evidenceIds: ["fact-stem"], title: "食神外显" },
    { ruleId: "rule-branch", evidenceIds: ["fact-branch"], title: "伤官承接" },
    { ruleId: "rule-career", evidenceIds: ["fact-career"], title: "事业方向" },
    { ruleId: "rule-relation", evidenceIds: ["fact-relation"], title: "关系牵动" },
    { ruleId: "rule-health", evidenceIds: ["fact-health"], title: "节奏状态" },
  ],
};

const validReport = {
  stage: "luck",
  overallJudgment: "这步大运以输出、表达和能力转化为主线，整体属于机会与调整并存的阶段，需要在发挥优势的同时控制节奏。",
  stemPhase: {
    title: "天干前五年",
    phaseNote: "前段权重与外显主题，不代表后段完全失效。",
    summary: "大运天干的食神直接出现在外层，更容易先表现为学习成果、表达方式和技能输出的变化。",
    evidenceIds: ["fact-stem"],
    ruleIds: ["rule-stem"],
    positive: ["输出能力增强"],
    risks: ["容易分散精力"],
    advice: ["把能力沉淀成作品或可交付成果"],
  },
  branchPhase: {
    title: "地支后五年",
    phaseNote: "后段权重与深层承接，不代表前段完全不起作用。",
    summary: "大运地支的伤官主气更偏向深层承接，后段更重视环境、执行方式和长期结构的调整。",
    evidenceIds: ["fact-branch"],
    ruleIds: ["rule-branch"],
    positive: ["解决问题方式更灵活"],
    risks: ["对规则的耐心下降"],
    advice: ["保留表达空间，同时明确现实边界"],
  },
  assessment: {
    verdict: "mixed",
    label: "中性（调整）",
    summary: "原局能够使用食伤带来的输出能力，但天干地支同时增加表达和变化，因此机会与消耗并存，不能只按身强身弱一句话定喜忌。",
    evidenceIds: ["fact-stem"],
    ruleIds: ["rule-stem"],
    gains: ["能力得到外显和转化"],
    costs: ["需要承担节奏和沟通上的调整成本"],
  },
  directions: {
    careerDirection: {
      summary: "事业方向更适合依靠技能、表达和解决实际问题形成成果，具体职业仍需结合现实身份。",
      evidenceIds: ["fact-career"],
      ruleIds: ["rule-career"],
      positive: ["专业能力容易被看见"],
      risks: ["路径可能反复调整"],
      advice: ["优先积累可验证成果"],
    },
    relationship: {
      summary: "关系领域存在连接和磨合并行的可能，但是否进入婚姻仍需流年和现实条件进一步触发。",
      evidenceIds: ["fact-relation"],
      ruleIds: ["rule-relation"],
      positive: ["有建立联系的机会"],
      risks: ["现实安排可能反复"],
      advice: ["区分相处质量与长期落地条件"],
    },
    healthState: {
      summary: "状态层面更容易思维活跃和持续输出，也要留意精力分配、作息和压力节奏。",
      evidenceIds: ["fact-health"],
      ruleIds: ["rule-health"],
      positive: ["反应和创造力较活跃"],
      risks: ["容易过度投入"],
      advice: ["保持规律作息并预留恢复时间"],
    },
  },
  actionAdvice: {
    advance: ["主动沉淀技能成果"],
    control: ["控制分心和无效表达"],
    avoidForNow: ["证据不足的长期决定不要急于定论"],
  },
  transition: {
    summary: "临近换运时以收尾、复盘和观察新运主题为主，不宜因气场交接仓促扩大风险。",
    advice: ["完成旧项目", "为下一阶段预留调整空间"],
  },
  verificationQuestions: ["过去是否明显经历过能力输出和路径调整？"],
};

test("luck contract uses the nine-step flow instead of the old five-domain report", () => {
  const contract = getStageAiOutputContract("luck");
  assert.ok(contract.stemPhase);
  assert.ok(contract.branchPhase);
  assert.ok(contract.assessment);
  assert.deepEqual(Object.keys(contract.directions), ["careerDirection", "relationship", "healthState"]);
  assert.equal(contract.selectedImages, undefined);
  assert.equal(contract.domainSummaries, undefined);
});

test("valid structured luck flow passes fact and rule validation", () => {
  const result = validateStageAiReport({
    report: validReport,
    stage: "luck",
    rawFactPack,
    candidatePack,
  });
  assert.equal(result.usable, true, result.issues.join("；"));
});

test("luck flow renderer contains the requested nine-step visual structure", () => {
  const html = renderLuckFlowReport(validReport);
  assert.match(html, /① 天干前五年/);
  assert.match(html, /② 地支后五年/);
  assert.match(html, /③ 判断这步大运对日主是喜还是忌/);
  assert.match(html, /④ 事业 \/ 方向/);
  assert.match(html, /⑤ 感情 \/ 关系/);
  assert.match(html, /⑥ 健康 \/ 状态/);
  assert.match(html, /⑦ 叠加流年看具体年份/);
  assert.match(html, /⑧ 给出这步大运的行动建议/);
  assert.match(html, /⑨ 大运交接过渡期提示/);
  assert.doesNotMatch(html, /财富与资源|家庭、居住与环境/);
});

test("unsupported specific organ claims are sanitized without blocking the flow", () => {
  const invalid = structuredClone(validReport);
  invalid.directions.healthState.summary = "这步大运需要特别防范肾脏疾病。";
  const result = validateStageAiReport({
    report: invalid,
    stage: "luck",
    rawFactPack,
    candidatePack,
  });
  assert.equal(result.usable, true, result.issues.join("；"));
  assert.doesNotMatch(result.structured.directions.healthState.summary, /肾脏|疾病/);
});

test("year and month contracts keep the existing selectedImages structure", () => {
  assert.ok(getStageAiOutputContract("year").selectedImages);
  assert.ok(getStageAiOutputContract("month").selectedImages);
});
