import { buildStageAiTrustedPack } from "./buildStageAiTrustedPack.js";
import { buildStageFixedReportModel } from "../transit/buildStageFixedReportModel.js";

export function buildLuckAiPrompt({
  baseBaziViewModel,
  natalImageReport,
  luckImageReport,
} = {}) {
  const luckItems = Array.isArray(luckImageReport?.luckItems) ? luckImageReport.luckItems : [];
  const currentLuckItem = luckItems.find((item) => item?.isCurrent) ?? luckItems[0] ?? null;
  const trustedPack = buildStageAiTrustedPack({
    stage: "luck",
    item: currentLuckItem,
    currentLuckItem,
    baseBaziViewModel,
    natalImageReport,
  });
  const fixedReportModel = currentLuckItem?.fixedReport ?? buildStageFixedReportModel({
    stage: "luck",
    item: currentLuckItem,
    baseBaziViewModel,
    natalImageReport,
    luckImageReport,
  });
  const enrichedTrustedPack = {
    ...trustedPack,
    fixedReportModel,
    stageRulePack: fixedReportModel?.stageRulePack ?? null,
  };

  return {
    system: [
      "你是八字命理系统的大运固定报告解释层，不是排盘层。",
      "浏览器已完成原局、大运结构、阶段领域扫描和v8.4规则召回；不得重新排盘或补算。",
      "必须优先读取fixedReportModel，其次读取stageRulePack与trustedPack。",
      "大运要讲十年核心任务、原局承接、持续作用链、主要现实领域、阶段节奏、所得与代价。",
      "只展开二至五个突出领域，不机械覆盖所有领域，不延伸具体流年和流月。",
      "没有直接触发时写成背景延续，不硬造重大事件。",
      "规则必须服从硬事实；条件规则不得写成确定事件。",
      "输出结构固定为：",
      "### 阶段总判",
      "### 原局如何承接",
      "### 这十年的作用链",
      "### 主要现实领域",
      "### 阶段节奏",
      "### 可以获得什么，需要付出什么",
      "### 现实验证点",
      "不得显示JSON、内部字段、规则ID或证据ID。",
    ].join("\n"),
    user: JSON.stringify({
      task: "根据固定报告模型与规则包，写出当前大运的最终固定分析报告。",
      fixedReportModel,
      stageRulePack: fixedReportModel?.stageRulePack ?? null,
      trustedPack: enrichedTrustedPack,
    }, null, 2),
    trustedPack: enrichedTrustedPack,
    fixedReportModel,
    stageRulePack: fixedReportModel?.stageRulePack ?? null,
    evidenceIds: trustedPack.allowedEvidenceRefs,
  };
}
