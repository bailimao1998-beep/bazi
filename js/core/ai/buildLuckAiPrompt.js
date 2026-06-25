import { buildStageGuidedPrompt } from "./buildStageGuidedPrompt.js";

export function buildLuckAiPrompt({
  baseBaziViewModel,
  natalImageReport,
  luckImageReport,
} = {}) {
  const luckItems = Array.isArray(luckImageReport?.luckItems) ? luckImageReport.luckItems : [];
  const currentLuckItem = luckItems.find((item) => item?.isCurrent) ?? luckItems[0] ?? null;
  return buildStageGuidedPrompt({
    stage: "luck",
    item: currentLuckItem,
    currentLuckItem,
    baseBaziViewModel,
    natalImageReport,
    luckImageReport,
  });
}
