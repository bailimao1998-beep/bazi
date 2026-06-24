import { buildStageAiTrustedPack } from "./buildStageAiTrustedPack.js";
import {
  buildStageStructuredPromptSource,
  buildStageVerifiedFactPack,
} from "./buildStageVerifiedFactPack.js";
import { buildStageReportSystem } from "./stageReportPromptPolicy.js";

export function buildYearAiPrompt(
{
  baseBaziViewModel,
  natalImageReport,
  luckImageReport,
  yearImageReport,
} = {}
) {
  const yearItem =
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
      stage: "year",
      item:
        yearItem,
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
        "year",
      ),

    user:
      JSON.stringify(
        {
          任务:
            "生成结构化流年报告。可靠性优先，承接大运背景，只写本年新增或明显强化的二至三个主题；每个主题给一个主剧本和一至三种现实可能，说明哪些需要现实条件，不得原样重复完整十年结构，也不得自行划分季度或月份。",
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
      5200,
  };
}
