import { buildStageAiTrustedPack } from "./buildStageAiTrustedPack.js";
import { buildStageReportSystem } from "./stageReportPromptPolicy.js";

export function buildLuckAiPrompt({
  baseBaziViewModel,
  natalImageReport,
  luckImageReport,
} = {}) {
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

  return {
    system:
      buildStageReportSystem(
        "luck",
      ),
    user: JSON.stringify(
      {
        task:
          "生成当前大运正式报告。比较同一结构的不同现实落点，通常提炼三至五个主要主题；主要可能详写，次要可能有独立证据才写，最弱可能省略。",
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
    maxTokens: 7000,
  };
}
