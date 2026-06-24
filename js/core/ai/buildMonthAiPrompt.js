import { buildStageAiTrustedPack } from "./buildStageAiTrustedPack.js";
import { buildStageReportSystem } from "./stageReportPromptPolicy.js";

export function buildMonthAiPrompt({
  baseBaziViewModel,
  natalImageReport,
  luckImageReport,
  yearImageReport,
  monthImageReport,
} = {}) {
  const monthItem =
    monthImageReport?.monthItem ??
    null;

  const yearItem =
    monthItem?.yearItem ??
    yearImageReport
      ?.yearItem ??
    null;

  const luckItems =
    Array.isArray(
      luckImageReport?.luckItems,
    )
      ? luckImageReport.luckItems
      : [];

  const currentLuckItem =
    monthItem
      ?.currentLuckItem ??
    yearItem
      ?.currentLuckItem ??
    luckItems.find(
      (item) =>
        item?.isCurrent,
    ) ??
    luckItems[0] ??
    null;

  const trustedPack =
    buildStageAiTrustedPack({
      stage: "month",
      item: monthItem,
      currentLuckItem,
      yearItem,
      baseBaziViewModel,
      natalImageReport,
    });

  return {
    system:
      buildStageReportSystem(
        "month",
      ),
    user: JSON.stringify(
      {
        task:
          "生成当前流月正式报告。承接原局、大运和流年，通常提炼二至四个主要主题；比较多种现实落点，不要把全部信号压成合作、工作或财务一个主题。",
        sourcePack:
          trustedPack,
      },
      null,
      2,
    ),
    trustedPack,
    evidenceIds:
      trustedPack
        .allowedEvidenceRefs,
    maxTokens: 5500,
  };
}
