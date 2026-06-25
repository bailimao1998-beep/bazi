import { buildStageGuidedPrompt } from "./buildStageGuidedPrompt.js";

export function buildYearAiPrompt({
  baseBaziViewModel,
  natalImageReport,
  luckImageReport,
  yearImageReport,
} = {}) {
  const yearItem = yearImageReport?.yearItem ?? null;
  const luckItems = Array.isArray(luckImageReport?.luckItems) ? luckImageReport.luckItems : [];
  const currentLuckItem = yearItem?.currentLuckItem ?? luckItems.find((item) => item?.isCurrent) ?? luckItems[0] ?? null;
  return buildStageGuidedPrompt({
    stage: "year",
    item: yearItem,
    currentLuckItem,
    yearItem,
    baseBaziViewModel,
    natalImageReport,
    luckImageReport,
    yearImageReport,
  });
}
