import { analyzeDecadeTheme } from "./decade-theme.js";
import { calculateEventScores } from "./event-score.js";
import { analyzeMonthTrigger } from "./month-trigger.js";
import { analyzeNatalSignature } from "./natal-signature.js";
import { buildFortuneNarrative } from "./narrative-builder.js";
import { loadFortuneRules } from "./rule-data.js";
import { analyzeYearTrigger } from "./year-trigger.js";

export function analyzeFortuneYear({ chart, selectedLuck, yearInfluence, monthInfluences = [] } = {}) {
  const rules = loadFortuneRules();
  const natalSignature = analyzeNatalSignature(chart, rules);
  const decadeAnalysis = analyzeDecadeTheme({ chart, selectedLuck, natalSignature, rules });
  const triggerChains = analyzeYearTrigger({ chart, selectedLuck, yearInfluence, decadeAnalysis, rules });
  const monthlyHighlights = analyzeMonthTrigger({ chart, selectedLuck, yearInfluence, monthInfluences, triggerChains, rules });
  const eventScores = calculateEventScores({ triggerChains, monthlyHighlights, natalSignature, decadeAnalysis, rules });
  const narrative = buildFortuneNarrative({
    year: yearInfluence?.year,
    natalSignature,
    decadeAnalysis,
    triggerChains,
    monthlyHighlights,
    eventScores,
    rules,
  });

  return {
    year: yearInfluence?.year,
    decadeTheme: decadeAnalysis.decadeTheme,
    decadeSupportScore: decadeAnalysis.decadeSupportScore,
    decadeRiskTags: decadeAnalysis.decadeRiskTags,
    annualTheme: narrative.annualTheme,
    overallSummary: narrative.overallSummary,
    eventScores,
    triggerChains,
    monthlyHighlights,
    advice: narrative.advice,
    natalSignature,
    narrative: narrative.narrative,
  };
}
