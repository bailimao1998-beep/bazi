import { buildStageAiTrustedPack } from "./buildStageAiTrustedPack.js";
import { buildStageReportSystem } from "./stageReportPromptPolicy.js";

export function buildMonthAiPrompt({
  baseBaziViewModel,
  natalImageReport,
  luckImageReport,
  yearImageReport,
  monthImageReport,
} = {}) {
  const monthItem = monthImageReport?.monthItem ?? null;
  const yearItem = monthItem?.yearItem ?? yearImageReport?.yearItem ?? null;
  const luckItems = Array.isArray(luckImageReport?.luckItems)
    ? luckImageReport.luckItems
    : [];
  const currentLuckItem = monthItem?.currentLuckItem ??
    yearItem?.currentLuckItem ??
    luckItems.find((item) => item?.isCurrent) ??
    luckItems[0] ??
    null;

  const trustedPack = buildStageAiTrustedPack({
    stage: "month",
    item: monthItem,
    currentLuckItem,
    yearItem,
    baseBaziViewModel,
    natalImageReport,
  });

  return {
    system: buildStageReportSystem("month"),
    user: JSON.stringify({
      task:
        "生成当前流月的正式综合报告。承接大运和流年，比较十二领域，只展开本月最明显的一至两个主线。",
      trustedPack,
    }, null, 2),
    trustedPack,
    evidenceIds: trustedPack.allowedEvidenceRefs,
    maxTokens: 6000,
  };
}
