import { buildStageAiTrustedPack } from "./buildStageAiTrustedPack.js";
import {
  buildStageStructuredPromptSource,
  buildStageVerifiedFactPack,
} from "./buildStageVerifiedFactPack.js";
import { buildStageReportSystem } from "./stageReportPromptPolicy.js";

export function buildMonthAiPrompt(
{
  baseBaziViewModel,
  natalImageReport,
  luckImageReport,
  yearImageReport,
  monthImageReport,
} = {}
) {
  const monthItem =
    monthImageReport
      ?.monthItem ??
    null;

  const yearItem =
    monthItem
      ?.yearItem ??
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
      item:
        monthItem,
      currentLuckItem,
      yearItem,
      baseBaziViewModel,
      natalImageReport,
    });

  const verifiedFactPack =
    buildStageVerifiedFactPack(
      trustedPack,
    );

  const promptSource =
    buildStageStructuredPromptSource(
      verifiedFactPack,
    );

  return {
    system:
      buildStageReportSystem(
        "month",
      ),

    user:
      JSON.stringify(
        {
          任务:
            "生成结构化流月报告。可靠性优先并保持精简，只保留一至两个最直接的短期触发；每个主题可给一至两种短期表现，重点讲本月如何执行和调整，不得扩写长期人生结论，也不得自行划分月初、月中或月末。",
          资料:
            promptSource,
        },
        null,
        2,
      ),

    trustedPack,
    verifiedFactPack,

    evidenceIds:
      verifiedFactPack
        .factIds,

    maxTokens:
      3300,
  };
}
