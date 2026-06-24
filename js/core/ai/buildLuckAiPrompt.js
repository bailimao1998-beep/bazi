import { buildStageAiTrustedPack } from "./buildStageAiTrustedPack.js";
import { buildStageAiPromptSource } from "./buildStageAiPromptSource.js";
import { buildStageReportSystem } from "./stageReportPromptPolicy.js";

export function buildLuckAiPrompt(
{
  baseBaziViewModel,
  natalImageReport,
  luckImageReport,
} = {}
) {
  const luckItems =
    Array.isArray(
      luckImageReport?.luckItems,
    )
      ? luckImageReport.luckItems
      : [];

  const currentLuckItem =
    luckItems.find(
      (item) =>
        item?.isCurrent,
    ) ??
    luckItems[0] ??
    null;

  const trustedPack =
    buildStageAiTrustedPack({
      stage: "luck",
      item: currentLuckItem,
      currentLuckItem,
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
        "luck",
      ),
    user: JSON.stringify(
      {
        任务:
          "生成当前大运正式报告。提炼三至四个彼此不同的主要主题，先讲最强结论，再写必要补充；不得重复同一冲合、生克或现实判断。",
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
    maxTokens: 3000,
  };
}
