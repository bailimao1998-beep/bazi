import { buildStageAiTrustedPack } from "./buildStageAiTrustedPack.js";
import { buildStageReportSystem } from "./stageReportPromptPolicy.js";

export function buildYearAiPrompt({
  baseBaziViewModel,
  natalImageReport,
  luckImageReport,
  yearImageReport,
} = {}) {
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

  return {
    system:
      buildStageReportSystem(
        "year",
      ),
    user: JSON.stringify(
      {
        task:
          "生成当前流年正式报告。将流年放在当前大运与原局中比较，通常提炼二至五个主要主题；不要默认工作场景，应同时比较学业资格、职业职责、手续规则、感情关系和成果变化等可能落点。",
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
