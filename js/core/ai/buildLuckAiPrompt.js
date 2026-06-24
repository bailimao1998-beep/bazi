import { buildStageAiTrustedPack } from "./buildStageAiTrustedPack.js";
import { buildStageReportSystem } from "./stageReportPromptPolicy.js";

export function buildLuckAiPrompt({
  baseBaziViewModel,
  natalImageReport,
  luckImageReport,
} = {}) {
  const luckItems = Array.isArray(luckImageReport?.luckItems)
    ? luckImageReport.luckItems
    : [];
  const currentLuckItem = luckItems.find((item) => item?.isCurrent) ?? luckItems[0] ?? null;

  const trustedPack = buildStageAiTrustedPack({
    stage: "luck",
    item: currentLuckItem,
    currentLuckItem,
    baseBaziViewModel,
    natalImageReport,
  });

  return {
    system: buildStageReportSystem("luck"),
    user: JSON.stringify({
      task:
        "生成当前大运的正式综合报告。先比较十二领域，再分为重点主线、次要领域和当前不突出；不要平均展开。",
      trustedPack,
    }, null, 2),
    trustedPack,
    evidenceIds: trustedPack.allowedEvidenceRefs,
    maxTokens: 7000,
  };
}
