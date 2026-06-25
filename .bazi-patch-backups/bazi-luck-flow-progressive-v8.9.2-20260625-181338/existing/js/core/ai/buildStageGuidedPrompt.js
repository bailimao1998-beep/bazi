import { buildStageRulePack } from "../transit/buildStageRulePack.js";
import { buildStageRawFactPack } from "./buildStageRawFactPack.js";
import { buildStageImageCandidatePack } from "./buildStageImageCandidatePack.js";
import { buildFactRulePreflight } from "./stageFactRuleGuard.js";
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
  const preflight = buildFactRulePreflight({ rawFactPack, candidatePack });
  const outputContract = getStageAiOutputContract(normalizedStage);

  return {
    system: buildSystemPrompt(normalizedStage),
    user: JSON.stringify({
      task: buildTask(normalizedStage),
      preflight,
      rawFactPack,
      candidatePack,
      outputContract,
    }, null, 2),
    stage: normalizedStage,
    rawFactPack,
    candidatePack,
    preflight,
    outputContract,
    evidenceIds: rawFactPack.facts.map((fact) => fact.id),
  };
}

function buildSystemPrompt(stage) {
  const common = [
    "你是八字命理系统的受约束取象与分析层，不是排盘层。",
    "rawFactPack中的性别、四柱、日主、十神、藏干、岁运干支、关系类型和成立状态是唯一硬事实，不得修改或重算。",
    "只有天干出现的十神可以称透干；地支主气和藏干不能称透。",
    "亥子相邻只能表述为三会水方条件或水势相连，不得写成六合、半合或已经成水局。",
    "子卯刑称无礼之刑；丑戌未称无恩之刑；寅巳申称恃势之刑。",
    "一个岁运天干同时与原局多个同类天干形成五合时，只能写多目标五合候选，不得直接写单一稳定合身。",
    "前端提供原局底色、当前岁运硬事实、通过性别年龄时间层审核的规则候选和输出契约。",
    "不得补造未提供的干支关系，也不得创建候选规则之外的新取象。",
    "每个具有解释性的栏目必须引用真实evidenceIds和ruleIds。",
    "先按factGroups合并同一组参与者的多个关系标签；不得把同源的合、破、冲、刑重复当作多条独立证据。",
    "原局取象只能说明底色和承接方式，必须有当前阶段硬事实触发，才能进入当前报告主结论。",
    "直接事实优先；条件事实只能作为弱象、替代分支或成立条件。",
    "男命不得使用女命夫星规则，女命不得使用男命妻星规则。",
    "青年阶段不能仅凭时柱优先断晚年、子女、孙辈或下属。",
    "没有专门规则支持时，不得输出具体器官、疾病、祖产、祖业或长辈资源。",
    "建议必须对应当前象，不得只写保持积极、注意沟通、顺势而为等空话。",
    "关系机会、关系质量与婚姻落地条件必须分开。",
    "只返回一个JSON对象，不得输出Markdown、解释文字、代码围栏或内部分析过程。",
    "JSON必须严格符合outputContract；不得输出候选包之外的事实ID或规则ID。",
  ];

  if (stage === "luck") {
    return [
      ...common,
      "大运报告只按九步流程组织，不再写领域大全。",
      "第一步分析大运天干，页面标题固定为‘天干前五年’，但这只是前段权重和外显主题，不得解释成后五年天干完全失效。",
      "第二步分析大运地支，页面标题固定为‘地支后五年’，但这只是后段权重和深层承接，不得解释成前五年地支完全不起作用。",
      "第三步综合判断本运偏顺、偏压还是混合调整。不得只凭身强身弱一句话定喜忌，必须说明原局承接、天干地支是否同向、得到什么和付出什么。",
      "第四至第六步只展开三个方向：事业/方向、感情/关系、健康/状态。没有独立强象时要明确写证据不足，不得补造事件。",
      "事业/方向可以包含学业、考试、资格、工作、技术、项目和输出，但只能选择候选规则支持的现实范围。",
      "感情/关系必须按性别规则和夫妻宫、财星或官杀的实际触发判断，不得机械套用。",
      "健康/状态只写压力、精力、作息、情绪和节奏倾向；没有专门规则时不得写具体器官和疾病。",
      "第七步只说明‘大运定背景、流年定触发’，不在大运报告中自行编造具体年份应事。",
      "第八步给出主动推进、需要控制、暂不勉强三类行动建议。",
      "第九步给出换运交接提示，只讲收尾、观察和准备，不把换运前后写成必然大吉大凶。",
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
    return "严格按九步大运流程生成结构化报告：天干前五年、地支后五年、顺压混合总判、事业方向、感情关系、健康状态、流年叠加说明、行动建议、换运交接。所有解释必须服从硬事实和候选规则。";
  }
  if (stage === "year") {
    return "先服从硬事实和规则资格审核，再从候选象池中选择当前流年最明显的一至四个象，说明年度总断、现实表现、有利面、风险和建议。";
  }
  return "先服从硬事实和规则资格审核，再从候选象池中选择当前流月最明显的一至三个象，说明短期主线、现实表现、有利面、风险和行动建议。";
}
