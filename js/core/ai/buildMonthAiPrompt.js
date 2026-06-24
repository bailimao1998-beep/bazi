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
          "生成当前流月正式报告。提炼二至三个主要主题，只保留本月最强现实落点；不要把同一信号在总断、主题、风险和验证中反复解释。",
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
    maxTokens: 2000,
  };
}
