import { buildStageAiTrustedPack } from "./buildStageAiTrustedPack.js";
import { buildStageReportSystem } from "./stageReportPromptPolicy.js";

export function buildYearAiPrompt({
  baseBaziViewModel,
  natalImageReport,
  luckImageReport,
  yearImageReport,
} = {}) {
  const yearItem = yearImageReport?.yearItem ?? null;
  const luckItems = Array.isArray(luckImageReport?.luckItems)
    ? luckImageReport.luckItems
    : [];
  const currentLuckItem = yearItem?.currentLuckItem ??
    luckItems.find((item) => item?.isCurrent) ??
    luckItems[0] ??
    null;

  const trustedPack = buildStageAiTrustedPack({
    stage: "year",
    item: yearItem,
    currentLuckItem,
    yearItem,
    baseBaziViewModel,
    natalImageReport,
  });

  return {
    system: buildStageReportSystem("year"),
    user: JSON.stringify({
      task:
        "生成当前流年的正式综合报告。必须放在当前大运背景中比较十二领域，再分为重点主线、次要领域和当前不突出。",
      trustedPack,
    }, null, 2),
    trustedPack,
    evidenceIds: trustedPack.allowedEvidenceRefs,
    maxTokens: 7000,
  };
}
