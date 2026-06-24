import { buildStageAiTrustedPack } from "./buildStageAiTrustedPack.js";
import { buildStageAiPromptSource } from "./buildStageAiPromptSource.js";
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
    yearImageReport?.yearItem ??
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
      item: yearItem,
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
        "year",
      ),
    user: JSON.stringify(
      {
        任务:
          "生成当前流年正式报告。提炼二至四个主要主题，比较学业资格、职业职责、手续规则、感情关系和计划成果；讲清最可能的发展剧本、替代剧本和现实建议。",
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
    maxTokens: 4800,
  };
}
