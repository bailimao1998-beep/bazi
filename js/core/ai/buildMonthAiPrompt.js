import { buildStageAiTrustedPack } from "./buildStageAiTrustedPack.js";
import { buildStageAiPromptSource } from "./buildStageAiPromptSource.js";
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

  const promptSource =
    buildStageAiPromptSource(
      trustedPack,
    );

  return {
    system:
      buildStageReportSystem(
        "month",
      ),
    user: JSON.stringify(
      {
        任务:
          "生成当前流月正式报告。提炼二至三个主要主题，讲清本月最可能出现的现实过程、次要落点和具体建议；可以展开有价值的故事，但不得重复或编造关系。",
        资料包:
          promptSource,
      },
      null,
      2,
    ),
    trustedPack,
    evidenceIds:
      trustedPack
        .allowedEvidenceRefs,
    maxTokens: 3800,
  };
}
