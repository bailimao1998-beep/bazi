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
          "生成当前大运正式报告。提炼三至四个主要主题，讲清每条主题最可能的现实剧本、另一种可能和可执行建议；保持内容丰富，但不重复同一依据。",
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
    maxTokens: 6000,
  };
}
