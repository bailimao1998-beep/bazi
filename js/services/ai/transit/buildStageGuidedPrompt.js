import { buildStageRulePack } from "../../../domain/transit/buildStageRulePack.js";
import { buildStageRawFactPack } from "./buildStageRawFactPack.js";
import { buildStageImageCandidatePack } from "./buildStageImageCandidatePack.js";
import { buildFactRulePreflight } from "../guards/stageFactRuleGuard.js";
import { getStageAiOutputContract } from "../contracts/stageAiReportContract.js";

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
    "天干阶段、地支阶段和大运总判必须引用真实evidenceIds和ruleIds；事业、感情、健康没有独立规则时允许明确写证据不足并留空引用。",
    "先按factGroups合并同一组参与者的多个关系标签；不得把同源的合、破、冲、刑重复当作多条独立证据。",
    "原局取象只能说明底色和承接方式，必须有当前阶段硬事实触发，才能进入当前报告主结论。",
    "直接事实优先；条件事实只能作为弱象、替代分支或成立条件。",
    "男命不得使用女命夫星规则，女命不得使用男命妻星规则。",
    "青年阶段不能仅凭时柱优先断晚年、子女、孙辈或下属。",
    "没有专门规则支持时，不得输出具体器官、疾病、祖产、祖业或长辈资源。",
    "以上证据边界属于内部约束，不得在用户可见内容中直接复述‘证据不足’、‘没有规则支持’、‘不允许判断’、‘不足以判断具体器官或疾病’等系统提示。弱象要改写成自然命理表达，说明该方向当前不突出、主要承接原局底色，或具体变化更看后续岁运触发。",
    "建议必须对应当前象，不得只写保持积极、注意沟通、顺势而为等空话。",
    "关系机会、关系质量与婚姻落地条件必须分开。",
    "只返回一个JSON对象，不得输出Markdown、解释文字、代码围栏或内部分析过程。",
    "JSON必须严格符合outputContract；不得输出候选包之外的事实ID或规则ID。",
  ];

  if (stage === "luck") {
    return [
      ...common,
      "大运报告只按八步流程组织，不再写领域大全。",
      "第一步分析大运天干，页面标题固定为‘天干前五年’，但这只是前段权重和外显主题，不得解释成后五年天干完全失效。",
      "第二步分析大运地支，页面标题固定为‘地支后五年’，但这只是后段权重和深层承接，不得解释成前五年地支完全不起作用。",
      "第三步综合判断本运偏顺、偏压还是混合调整。不得只凭身强身弱一句话定喜忌，必须说明原局承接、天干地支是否同向、得到什么和付出什么。",
      "第四至第六步固定展开三个方向：事业/方向、感情/关系、健康/状态。没有独立强象时仍必须完整返回该方向，并用‘这一方向不是本运最强主线，当前更多承接原局底色，具体变化更看后续流年触发’一类自然表达；evidenceIds和ruleIds可以为空，不得把内部证据限制直接写给用户。",
      "事业/方向可以包含学业、考试、资格、工作、技术、项目和输出，但只能选择候选规则支持的现实范围。",
      "感情/关系必须按性别规则和夫妻宫、财星或官杀的实际触发判断，不得机械套用。",
      "健康/状态只写压力、精力、作息、情绪和节奏倾向；没有专门规则时不得写具体器官和疾病。",
      "第七步给出主动推进、需要控制、暂不勉强三类行动建议。",
      "第八步给出换运交接提示，只讲收尾、观察和准备，不把换运前后写成必然大吉大凶。",
    ].join("\n");
  }

  if (stage === "year") {
    return [
      ...common,
      "流年报告固定按四步组织：①叠加大运；②冲合原局；③十神引动；④力度评价。",
      "第一步先看流年五行、十神和当前大运是同向、相生、相克还是混合，说明大运背景如何放大或约束本年。",
      "第二步只依据rawFactPack列出流年干支冲合刑害破原局哪些柱，说明哪些位置被触发，不得补造关系。",
      "第三步以流年天干对日主的十神为外显主题，同时结合地支承接，但不要把一个十神直接写成确定事件。",
      "第四步综合大运基调与流年触发判断年度力度，只能使用strong_favorable、favorable_with_pressure、pressure_with_opportunity、strong_pressure或mixed。",
      "流年只说这一年哪些领域有动静、事件大致轮廓、有利面、压力点和建议；不说某件具体事情必然得到什么结果。",
      "四步推导之后必须始终补充directions，固定包含careerDirection、relationship、healthState三个方向，页面分别显示为事业/方向、感情/关系、身心/状态。",
      "三个方向无论强弱都必须返回。被明显触发时写本年表现、有利面、压力点和建议；不突出时用自然语言说明本年相对平稳或主要承接原局与大运背景，不得写成系统限制说明。",
      "healthState只描述压力承受、精力恢复、寒暖燥湿、情绪紧绷、作息与生活节奏；不得诊断疾病，也不要对用户说‘不足以判断具体器官或疾病’。",
      "不得返回selectedImages旧结构，必须严格返回luckOverlay、natalInteraction、tenGodActivation、forceAssessment、eventOutline和directions。",
    ].join("\n");
  }

  return [
    ...common,
    "流月报告固定按四步组织：①三层叠加；②节奏判断；③小触发点；④行动建议。",
    "第一步同时承接大运底色、流年气场和流月五行，只说明三层如何叠加。",
    "第二步判断本月更适合推进、等待、收尾整理、调整节奏还是边走边看，只能使用advance、wait、close、adjust或mixed。",
    "第三步只写流月冲合原局哪一柱、形成什么局部触发，不把局部触发扩大为人生长期结论。",
    "第四步分别给出本月适合做什么、不宜做什么、节奏怎么拿，建议必须可执行。",
    "流月不讲具体事件结果，只讲这个月的节奏感和适合往哪里使力。",
    "不得返回selectedImages旧结构，必须严格返回threeLayerOverlay、rhythmAssessment、localTrigger、actionAdvice和rhythmSummary。",
  ].join("\n");
}

function buildTask(stage) {
  if (stage === "luck") {
    return "严格按八步大运流程生成结构化报告：天干前五年、地支后五年、顺压混合总判、事业方向、感情关系、健康状态、行动建议、换运交接。所有解释必须服从硬事实和候选规则。";
  }
  if (stage === "year") {
    return "按流年四步流程生成：叠加大运、冲合原局、十神引动、力度评价；随后固定补充事业方向、感情关系、身心状态三个现实领域，最后给事件轮廓、利弊和建议，不写死具体结果。";
  }
  return "按流月四步流程生成：三层叠加、节奏判断、小触发点、行动建议；只讲本月节奏和适合往哪里使力，不断具体结果。";
}
