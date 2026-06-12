import { calculateBazi } from "../core/bazi/calculateBazi.js";
import { createMonthPillar, createPillarFromYear } from "../core/bazi/pillarMath.js";
import { buildEvidenceReport } from "../core/evidence/buildEvidenceReport.js";
import { buildAnnualEventReport } from "../core/fortune/buildAnnualEventReport.js";
import { calculateMonthInfluence } from "../core/liunian/calculateMonthInfluence.js";
import { calculateYearInfluence } from "../core/liunian/calculateYearInfluence.js";
import { ruleEngine } from "../core/rules/ruleEngine.js";
import { createAiProvider } from "../core/ai/aiProvider.js";
import { generateStoryTags } from "../core/story/generateStoryTags.js";
import { buildFlowNarrativePrompt, buildNarrativePrompt } from "../core/story/buildNarrativePrompt.js";
import { calculateZiwei } from "../core/ziwei/calculateZiwei.js";

export async function buildNarrative(input = {}, providerOptions = {}) {
  const targetYear = Number(input.targetYear ?? new Date().getFullYear());
  const selectedMonth = Number(input.selectedMonth ?? new Date().getMonth() + 1);
  const aiMode = ["luck", "year", "month"].includes(input.mode) ? input.mode : "default";
  const chart = calculateBazi(input);
  const ziwei = calculateZiwei(input, chart);
  const yearInfluence = calculateYearInfluence({ chart, targetYear });
  const monthInfluences = Array.from({ length: 12 }, (_, index) =>
    calculateMonthInfluence({ chart, targetYear, month: index + 1 }),
  );
  const selectedMonthInfluence = monthInfluences[Math.max(0, Math.min(11, selectedMonth - 1))];
  const selectedLuck = selectLuckPillar(chart.luckCycles, input.selectedLuckIndex, targetYear);
  const matchedRules = ruleEngine({ chart, ziwei, selectedLuck, yearInfluence, monthInfluences, selectedMonthInfluence });
  const annualEventReport = buildAnnualEventReport({ chart, selectedLuck, yearInfluence, monthInfluences, matchedRules });
  const evidenceReport = buildEvidenceReport({
    chart,
    selectedLuck,
    yearInfluence,
    selectedMonthInfluence,
    annualEventReport,
    matchedRules,
  });
  const fortuneAnalysis = annualEventReport;
  const transitYears = Array.from({ length: 11 }, (_, index) => {
    const year = targetYear - 5 + index;
    return { year, pillar: createPillarFromYear(year, "流年") };
  });
  const transitMonths = Array.from({ length: 12 }, (_, index) => {
    const month = index + 1;
    return { month, pillar: createMonthPillar(targetYear, month, "流月") };
  });
  const storyTags = generateStoryTags({ chart, yearInfluence, monthInfluences, matchedRules });
  const prompt = aiMode === "default"
    ? buildNarrativePrompt({ chart, yearInfluence, monthInfluences, storyTags, matchedRules, fortuneAnalysis })
    : buildFlowNarrativePrompt({
      mode: aiMode,
      chart,
      coreSignals: input.coreSignals,
      transitSignals: input.transitSignals,
      monthSignals: input.monthSignals,
      selectedLuck,
      yearInfluence,
      selectedMonthInfluence,
      matchedRules,
      fortuneAnalysis,
    });
  const narrative = await generateNarrativeWithFallback(providerOptions, { prompt, storyTags });
  return {
    aiMode,
    chart,
    ziwei,
    yearInfluence,
    monthInfluences,
    selectedMonthInfluence,
    selectedLuck,
    annualEventReport,
    evidenceReport,
    fortuneAnalysis,
    eventCandidates: annualEventReport.eventCandidates,
    mainEvents: annualEventReport.mainEvents,
    triggerChains: annualEventReport.triggerChains,
    monthlyHighlights: annualEventReport.monthlyHighlights,
    transitYears,
    transitMonths,
    matchedRules,
    storyTags,
    prompt,
    narrative,
    selection: { targetYear, selectedMonth, selectedLuckIndex: selectedLuck?.index ? selectedLuck.index - 1 : 0 },
  };
}

async function generateNarrativeWithFallback(providerOptions, payload) {
  try {
    return await createAiProvider(providerOptions).generate(payload);
  } catch (error) {
    const fallback = await createAiProvider({ provider: "mock" }).generate(payload);
    return { ...fallback, fallbackReason: error.message };
  }
}

function selectLuckPillar(luckCycles, selectedLuckIndex, targetYear) {
  const pillars = luckCycles?.pillars ?? [];
  if (!pillars.length) return null;
  const byIndex = Number.isInteger(Number(selectedLuckIndex)) ? pillars[Number(selectedLuckIndex)] : null;
  if (byIndex) return byIndex;
  return pillars.find((item) => Number(targetYear) >= item.startYear && Number(targetYear) <= item.endYear) ?? pillars[0];
}
