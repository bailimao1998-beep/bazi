import { branchMainStem, getTenGod } from "../bazi/tenGods.js";
import { clamp, elementLabel, loadFortuneRules, ruleMatchesTenGod, unique } from "./rule-data.js";

export function analyzeDecadeTheme({ chart, selectedLuck, natalSignature, rules = loadFortuneRules() } = {}) {
  const stemTenGod = getTenGod(chart.dayMaster?.stem, selectedLuck?.stem);
  const branchTenGod = getTenGod(chart.dayMaster?.stem, branchMainStem(selectedLuck?.branch));
  const tenGodRules = rules.tenGods.filter((rule) => [stemTenGod, branchTenGod].some((tenGod) => ruleMatchesTenGod(rule, tenGod)));
  const usefulHit = [elementLabel(selectedLuck?.stemElement), elementLabel(selectedLuck?.branchElement)].some((item) => natalSignature?.usefulElements?.includes(item));
  const avoidHit = [elementLabel(selectedLuck?.stemElement), elementLabel(selectedLuck?.branchElement)].some((item) => natalSignature?.avoidElements?.includes(item));
  const baseScore = 50 + (usefulHit ? 18 : 0) - (avoidHit ? 14 : 0) + tenGodRules.reduce((sum, rule) => sum + rule.weight, 0);
  const decadeSupportScore = clamp(baseScore);
  const decadeTheme = avoidHit ? "放大原局问题" : usefulHit ? "补足原局" : "增强原局";
  const decadeRiskTags = unique([
    ...tenGodRules.flatMap((rule) => rule.tags).filter((tag) => ["pressure", "health", "relationship"].includes(tag)),
    ...(avoidHit ? natalSignature?.riskAreas ?? [] : []),
  ]);

  return {
    decadeTheme,
    decadeSupportScore,
    decadeRiskTags,
    decadeTenGods: { stem: stemTenGod, branch: branchTenGod },
    evidence: [
      `大运${selectedLuck?.label}，天干${stemTenGod}，地支主气${branchTenGod}`,
      `大运五行：${elementLabel(selectedLuck?.stemElement)}、${elementLabel(selectedLuck?.branchElement)}`,
      usefulHit ? "大运补到原局相对不足的五行" : avoidHit ? "大运触到原局相对突出的五行" : "大运与原局五行形成阶段背景",
    ],
  };
}
