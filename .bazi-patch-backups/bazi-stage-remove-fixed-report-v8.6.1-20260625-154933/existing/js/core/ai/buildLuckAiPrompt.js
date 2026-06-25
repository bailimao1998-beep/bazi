import {
  buildStageAiTrustedPack,
} from "./buildStageAiTrustedPack.js";

import {
  compactFixedReportForPrompt,
} from "./compactStagePromptPayload.js";

import {
  buildStageFixedReportModel,
} from "../transit/buildStageFixedReportModel.js";

export function buildLuckAiPrompt({
  baseBaziViewModel,
  natalImageReport,
  luckImageReport,
} = {}) {
  const luckItems = Array.isArray(luckImageReport?.luckItems)
    ? luckImageReport.luckItems
    : [];
  const currentLuckItem = luckItems.find((item) => item?.isCurrent) ?? luckItems[0] ?? null;

  const trustedPack = buildStageAiTrustedPack({
    stage: "luck",
    item: currentLuckItem,
    currentLuckItem,
    baseBaziViewModel,
    natalImageReport,
  });

  const fixedReportModel =
    currentLuckItem?.fixedReport ??
    buildStageFixedReportModel({
      stage: "luck",
      item: currentLuckItem,
      baseBaziViewModel,
      natalImageReport,
      luckImageReport,
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
      "你是八字命理系统的大运固定报告解释层，不是排盘层。",
      "必须优先读取fixedReportModel.semanticContext、fixedReportModel.primaryDomains、stageRulePack与trustedPack。",
      "先说结构能确认的核心主象，再说证据最强的现实落点；每个领域最多补充一个替代分支和一个成立条件。",
      "大运讲十年核心任务、原局承接、持续作用链、主要现实领域、阶段节奏、所得与代价。",
      "没有phaseWindows时，只写进入、持续、退出，不得自行编造前期、中期、后期的具体年份。",
      "日干被合不等同夫妻宫被合；时干被合不等同整个时柱或时支被合。",
      "同一天干合向多个同类天干时，必须说明合意分散或争合候选，不能写成多处同时稳定合住。",
      "命名组合只能使用semanticContext.allowedNamedPatterns中已有的名称。",
      "每个主要领域控制在一个短段落，不机械覆盖所有领域，不把所有可能性全部列完。",
      "输出结构固定为：",
      "### 阶段总判",
      "### 原局如何承接",
      "### 这十年的作用链",
      "### 主要现实领域",
      "### 阶段节奏",
      "### 可以获得什么，需要付出什么",
      "### 现实验证点",
      "不得显示JSON、内部字段、规则ID、证据ID或英文领域key。",
    ].join("\n"),

    user: JSON.stringify(
      {
        task: "根据固定报告模型和语义边界，写出当前大运的最终固定分析报告。",
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
