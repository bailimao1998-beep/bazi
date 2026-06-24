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
            "生成结构化大运报告。只依据事实编号判断现实主题；重点讲清两至三个真正不同的主线，避免把规则、审核、计划和成果拆成重复主题。",
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
