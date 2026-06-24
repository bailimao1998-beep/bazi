import { buildStageAiTrustedPack } from "./buildStageAiTrustedPack.js";
import {
  buildStageStructuredPromptSource,
  buildStageVerifiedFactPack,
} from "./buildStageVerifiedFactPack.js";
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
      item:
        currentLuckItem,
      currentLuckItem,
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
        "luck",
      ),

    user:
      JSON.stringify(
        {
          任务:
            "生成结构化大运报告。可靠性优先，但内容要比流年、流月更完整：从领域证据排序中提炼三至四个不同的长期主题，每个主题先写最可能的发展，再列二至四种有层次的可能表现；覆盖能力、资源、关系环境和生活节奏，不得把同一主线拆成近义主题，也不得虚构具体年份分段。",
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
      7600,
  };
}
