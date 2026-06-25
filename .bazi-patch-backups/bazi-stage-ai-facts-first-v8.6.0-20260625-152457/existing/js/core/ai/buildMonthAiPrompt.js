import {
  buildStageAiTrustedPack,
} from "./buildStageAiTrustedPack.js";

import {
  compactFixedReportForPrompt,
} from "./compactStagePromptPayload.js";

import {
  buildStageFixedReportModel,
} from "../transit/buildStageFixedReportModel.js";

export function buildMonthAiPrompt({
  baseBaziViewModel,
  natalImageReport,
  luckImageReport,
  yearImageReport,
  monthImageReport,
} = {}) {
  const monthItem = monthImageReport?.monthItem ?? null;
  const yearItem = monthItem?.yearItem ?? yearImageReport?.yearItem ?? null;
  const luckItems = Array.isArray(luckImageReport?.luckItems)
    ? luckImageReport.luckItems
    : [];
  const currentLuckItem = monthItem?.currentLuckItem ??
    yearItem?.currentLuckItem ??
    luckItems.find((item) => item?.isCurrent) ??
    luckItems[0] ??
    null;

  const trustedPack = buildStageAiTrustedPack({
    stage: "month",
    item: monthItem,
    currentLuckItem,
    yearItem,
    baseBaziViewModel,
    natalImageReport,
  });

  const fixedReportModel =
    monthItem?.fixedReport ??
    buildStageFixedReportModel({
      stage: "month",
      item: monthItem,
      baseBaziViewModel,
      natalImageReport,
      luckImageReport,
      yearImageReport,
      monthImageReport,
    });

  const stageRulePack =
    fixedReportModel?.stageRulePack ??
    null;

  const fixedReportForPrompt =
    compactFixedReportForPrompt(
      fixedReportModel,
    );

  return {
    system: [
      "你是八字命理系统的流月固定报告解释层，不是排盘层。",
      "必须优先读取fixedReportModel.semanticContext、fixedReportModel.primaryDomains、stageRulePack与trustedPack。",
      "先说结构能确认的核心主象，再说证据最强的现实落点；每个领域最多补充一个替代分支和一个成立条件。",
      "流月只解释大运和流年背景上的本月新增触发、现实落点和行动节奏。",
      "生克解释必须服从semanticContext.hierarchyRelations的方向。",
      "日干被合不等同夫妻宫被合；时干被合不等同整个时柱或时支被合。",
      "命名组合只能使用semanticContext.allowedNamedPatterns中已有的名称。",
      "只展开零至两个最强领域，每个领域一个短段落；没有本月直接触发时写平稳延续。",
      "输出结构固定为：",
      "### 本月主线",
      "### 承接年度背景",
      "### 本月新增触发",
      "### 现实落点",
      "### 行动节奏",
      "### 需要留意",
      "不得显示JSON、内部字段、规则ID、证据ID或英文领域key。",
    ].join("\n"),

    user: JSON.stringify(
      {
        task: "根据固定报告模型和语义边界，写出当前流月的最终固定分析报告。",
        fixedReportModel: fixedReportForPrompt,
        stageRulePack,
        trustedPack,
      },
      null,
      2,
    ),

    trustedPack,
    fixedReportModel,
    stageRulePack,
    evidenceIds: trustedPack.allowedEvidenceRefs,
  };
}
