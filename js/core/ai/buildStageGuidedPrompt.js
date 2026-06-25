import { buildStageRulePack } from "../transit/buildStageRulePack.js";
import { buildStageRawFactPack } from "./buildStageRawFactPack.js";
import { buildStageImageCandidatePack } from "./buildStageImageCandidatePack.js";
import { getStageAiOutputContract } from "./stageAiReportContract.js";

const STAGE_LABELS = {
  luck: "大运",
  year: "流年",
  month: "流月",
};

export function buildStageGuidedPrompt({
  stage = "luck",
  item = {},
  currentLuckItem = null,
  yearItem = null,
  baseBaziViewModel = {},
  natalImageReport = {},
  luckImageReport = {},
  yearImageReport = {},
  monthImageReport = {},
} = {}) {
  const normalizedStage = STAGE_LABELS[stage] ? stage : "luck";
  const rawFactPack = buildStageRawFactPack({
    stage: normalizedStage,
    item,
    currentLuckItem,
    yearItem,
    baseBaziViewModel,
    natalImageReport,
  });
  const stageRulePack = buildStageRulePack({
    stage: normalizedStage,
    item,
    natalImageReport,
    luckImageReport,
    yearImageReport,
    monthImageReport,
    domainKeys: [],
  });
  const candidatePack = buildStageImageCandidatePack({
    stage: normalizedStage,
    rawFactPack,
    stageRulePack,
  });
  const outputContract = getStageAiOutputContract(normalizedStage);

  return {
    system: buildSystemPrompt(normalizedStage),
    user: JSON.stringify({
      task: buildTask(normalizedStage),
      rawFactPack,
      candidatePack,
      outputContract,
    }, null, 2),
    stage: normalizedStage,
    rawFactPack,
    candidatePack,
    outputContract,
    evidenceIds: rawFactPack.facts.map((fact) => fact.id),
  };
}

function buildSystemPrompt(stage) {
  const common = [
    "你是八字命理系统的受约束取象与分析层，不是排盘层。",
    "前端只提供基础数据、原局取象底色、当前岁运硬事实、规则库候选象和输出契约。",
    "不得重新排盘，不得补造未提供的干支关系，也不得创建候选规则之外的新取象。",
    "你可以用自己的语言解释和组合候选象，但每个主象必须同时引用真实evidenceIds和ruleIds。",
    "先按factGroups合并同一组参与者的多个关系标签，再选象；不得把同源的合、破、冲、刑等重复当作多条证据。",
    "原局取象只能说明底色和承接方式，必须有当前阶段硬事实触发，才能进入当前报告主结论。",
    "直接事实优先；条件事实只能作为弱象、替代分支或成立条件。",
    "每个选中主象都必须讲清：形成原因、现实表现、有利面、压力与代价、对应建议。",
    "建议必须对应当前象，不得只写保持积极、注意沟通、顺势而为等空话。",
    "关系质量与婚姻落地条件分开；受阻、延后、补条件、换路径与彻底失败分开。",
    "只返回一个JSON对象，不得输出Markdown、解释文字、代码围栏或内部分析过程。",
    "JSON必须严格符合outputContract；不得输出候选包之外的事实ID或规则ID。",
  ];

  if (stage === "luck") {
    return [
      ...common,
      "大运要先给十年总断，再选一至六个核心象。",
      "随后对事业与学业、财富与资源、感情与婚姻、家庭居住与环境、身心节奏分别做简洁判断。",
      "某方面没有独立强象时必须直说证据不足或主要承接原局，不得为了填栏目造象。",
      "十年节奏只写初入、持续和临近换运，不得自行切分没有流年证据支持的具体年份。",
    ].join("\n");
  }

  if (stage === "year") {
    return [
      ...common,
      "流年只选一至四个本年最明显的象，必须放在当前大运背景中理解。",
      "不要机械覆盖所有领域；只讲今年真正新增或明显放大的触发。",
    ].join("\n");
  }

  return [
    ...common,
    "流月只选一至三个短期明显的象，内容必须简洁。",
    "不得把流月写成十年、终身、婚姻或职业的长期确定结论。",
  ].join("\n");
}

function buildTask(stage) {
  if (stage === "luck") {
    return "从候选象池中选择并组合当前大运的核心主象，形成十年总断、各方面简断、十年节奏及有利面、风险和建议。";
  }
  if (stage === "year") {
    return "从候选象池中选择当前流年最明显的一至四个象，说明年度总断、现实表现、有利面、风险和建议。";
  }
  return "从候选象池中选择当前流月最明显的一至三个象，说明短期主线、现实表现、有利面、风险和行动建议。";
}
