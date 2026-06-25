import { buildStageAiTrustedPack } from "./buildStageAiTrustedPack.js";
import { buildStageFixedReportModel } from "../transit/buildStageFixedReportModel.js";

export function buildYearAiPrompt({
  baseBaziViewModel,
  natalImageReport,
  luckImageReport,
  yearImageReport,
} = {}) {
  const yearItem = yearImageReport?.yearItem ?? null;
  const luckItems = Array.isArray(luckImageReport?.luckItems) ? luckImageReport.luckItems : [];
  const currentLuckItem = yearItem?.currentLuckItem ?? luckItems.find((item) => item?.isCurrent) ?? luckItems[0] ?? null;
  const trustedPack = buildStageAiTrustedPack({
    stage: "year",
    item: yearItem,
    currentLuckItem,
    yearItem,
    baseBaziViewModel,
    natalImageReport,
  });
  const fixedReportModel = yearItem?.fixedReport ?? buildStageFixedReportModel({
    stage: "year",
    item: yearItem,
    baseBaziViewModel,
    natalImageReport,
    luckImageReport,
    yearImageReport,
  });
  const enrichedTrustedPack = {
    ...trustedPack,
    fixedReportModel,
    stageRulePack: fixedReportModel?.stageRulePack ?? null,
  };

  return {
    system: [
      "你是八字命理系统的流年固定报告解释层，不是排盘层。",
      "浏览器已完成原局、大运、流年结构、年度领域扫描和v8.4规则召回；不得重新排盘或补算。",
      "必须优先读取fixedReportModel，其次读取stageRulePack与trustedPack。",
      "流年必须放在当前大运背景中讲，只解释今年新增的作用、转折和现实落点。",
      "只展开一至三个最强领域，不重复完整大运，不展开具体月份。",
      "若今年没有强直接触发，应写成年度背景延续或主题浮现。",
      "规则必须服从硬事实；条件规则不得写成确定事件。",
      "输出结构固定为：",
      "### 年度总判",
      "### 大运背景",
      "### 今年新增的作用",
      "### 最强现实落点",
      "### 机会与压力",
      "### 今年适合推进与不宜勉强",
      "### 现实验证点",
      "不得显示JSON、内部字段、规则ID或证据ID。",
    ].join("\n"),
    user: JSON.stringify({
      task: "根据固定报告模型与规则包，写出当前流年的最终固定分析报告。",
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
