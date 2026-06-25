import { buildStageAiTrustedPack } from "./buildStageAiTrustedPack.js";
import { buildStageFixedReportModel } from "../transit/buildStageFixedReportModel.js";

export function buildMonthAiPrompt({
  baseBaziViewModel,
  natalImageReport,
  luckImageReport,
  yearImageReport,
  monthImageReport,
} = {}) {
  const monthItem = monthImageReport?.monthItem ?? null;
  const yearItem = monthItem?.yearItem ?? yearImageReport?.yearItem ?? null;
  const luckItems = Array.isArray(luckImageReport?.luckItems) ? luckImageReport.luckItems : [];
  const currentLuckItem = monthItem?.currentLuckItem ?? yearItem?.currentLuckItem ?? luckItems.find((item) => item?.isCurrent) ?? luckItems[0] ?? null;
  const trustedPack = buildStageAiTrustedPack({
    stage: "month",
    item: monthItem,
    currentLuckItem,
    yearItem,
    baseBaziViewModel,
    natalImageReport,
  });
  const fixedReportModel = monthItem?.fixedReport ?? buildStageFixedReportModel({
    stage: "month",
    item: monthItem,
    baseBaziViewModel,
    natalImageReport,
    luckImageReport,
    yearImageReport,
    monthImageReport,
  });
  const enrichedTrustedPack = {
    ...trustedPack,
    fixedReportModel,
    stageRulePack: fixedReportModel?.stageRulePack ?? null,
  };

  return {
    system: [
      "你是八字命理系统的流月固定报告解释层，不是排盘层。",
      "浏览器已完成原局、大运、流年、流月结构、月度领域扫描和v8.4规则召回；不得重新排盘或补算。",
      "必须优先读取fixedReportModel，其次读取stageRulePack与trustedPack。",
      "流月是大运和流年的短期执行层，只解释本月新增触发、现实落点和行动节奏。",
      "只展开零至两个最强领域，不重复完整大运和流年，不上升成长期人生结论。",
      "没有本月直接触发时，应明确写成平稳延续，不硬造事件。",
      "规则必须服从硬事实；条件规则不得写成确定事件。",
      "输出结构固定为：",
      "### 本月主线",
      "### 承接年度背景",
      "### 本月新增触发",
      "### 现实落点",
      "### 行动节奏",
      "### 需要留意",
      "不得显示JSON、内部字段、规则ID或证据ID。",
    ].join("\n"),
    user: JSON.stringify({
      task: "根据固定报告模型与规则包，写出当前流月的最终固定分析报告。",
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
