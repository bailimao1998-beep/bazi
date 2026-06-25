import {
  buildStageAiTrustedPack,
} from "./buildStageAiTrustedPack.js";

import {
  compactFixedReportForPrompt,
} from "./compactStagePromptPayload.js";

import {
  buildStageFixedReportModel,
} from "../transit/buildStageFixedReportModel.js";

export function buildYearAiPrompt({
  baseBaziViewModel,
  natalImageReport,
  luckImageReport,
  yearImageReport,
} = {}) {
  const yearItem = yearImageReport?.yearItem ?? null;
  const luckItems = Array.isArray(luckImageReport?.luckItems)
    ? luckImageReport.luckItems
    : [];
  const currentLuckItem = yearItem?.currentLuckItem ??
    luckItems.find((item) => item?.isCurrent) ??
    luckItems[0] ??
    null;

  const trustedPack = buildStageAiTrustedPack({
    stage: "year",
    item: yearItem,
    currentLuckItem,
    yearItem,
    baseBaziViewModel,
    natalImageReport,
  });

  const fixedReportModel =
    yearItem?.fixedReport ??
    buildStageFixedReportModel({
      stage: "year",
      item: yearItem,
      baseBaziViewModel,
      natalImageReport,
      luckImageReport,
      yearImageReport,
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
      "你是八字命理系统的流年固定报告解释层，不是排盘层。",
      "必须优先读取fixedReportModel.semanticContext、fixedReportModel.primaryDomains、stageRulePack与trustedPack。",
      "先说结构能确认的核心主象，再说证据最强的现实落点；每个领域最多补充一个替代分支和一个成立条件。",
      "流年必须放在当前大运背景中，只解释今年新增的作用、转折和现实落点。",
      "生克解释必须服从semanticContext.hierarchyRelations的方向，不能把施克方与受克方倒置。",
      "没有年度分段证据时，不得写年初、年中、年末、上下半年或季度。",
      "日干被合不等同夫妻宫被合；没有日支证据时，感情只能作为重要关系候选之一。",
      "同一天干合向多个同类天干时，必须说明合意分散或争合候选。",
      "命名组合只能使用semanticContext.allowedNamedPatterns中已有的名称。",
      "只展开一至三个最强领域，每个领域一个短段落，不把候选场景写成确定事件。",
      "输出结构固定为：",
      "### 年度总判",
      "### 大运背景",
      "### 今年新增的作用",
      "### 最强现实落点",
      "### 机会与压力",
      "### 今年适合推进与不宜勉强",
      "### 现实验证点",
      "不得显示JSON、内部字段、规则ID、证据ID或英文领域key。",
    ].join("\n"),

    user: JSON.stringify(
      {
        task: "根据固定报告模型和语义边界，写出当前流年的最终固定分析报告。",
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
