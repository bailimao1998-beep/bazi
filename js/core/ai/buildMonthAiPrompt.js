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
            "生成结构化流月报告。以两个最强主题为主，第三主题只有明显独立证据时才保留；不得自行划分月初、月中或月末。",
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
      3400,
  };
}
