import { loadFortuneRules } from "./rule-data.js";

const scoreLabels = {
  career: "事业",
  wealth: "财运",
  relationship: "感情",
  study: "学业",
  health: "健康",
  movement: "迁移",
  social: "人际"
};

export function buildFortuneNarrative({ year, natalSignature, decadeAnalysis, triggerChains, monthlyHighlights, eventScores, rules = loadFortuneRules() } = {}) {
  const topScores = Object.entries(eventScores).sort((a, b) => b[1].score - a[1].score).slice(0, 3);
  const annualTheme = topScores.map(([key]) => scoreLabels[key]).join("、");
  const overallSummary = [
    `结论：${year}年先看${annualTheme}这些候选主题。`,
    `命理依据：原局取象为${natalSignature.natalTags.join("、")}，大运判断为${decadeAnalysis.decadeTheme}，流年触发链共${triggerChains.length}条。`,
    `现实表现：可重点观察${topScores.map(([, item]) => item.realityMapping).filter(Boolean).join("；")}`,
    "注意事项：以上只按本地规则串联取象，需要结合现实反馈、柱位、旺衰和流月继续验证，不能单独作为结论。"
  ].join("\n");
  const sections = [
    section("年度总论", overallSummary),
    section("大运如何影响这一年", [
      `结论：当前大运属于${decadeAnalysis.decadeTheme}，支持分${decadeAnalysis.decadeSupportScore}。`,
      `命理依据：${decadeAnalysis.evidence.join("；")}`,
      `现实表现：十年背景会影响这一年事件的承接方式，尤其看${decadeAnalysis.decadeRiskTags.join("、") || "阶段主题"}。`,
      "注意事项：大运是背景层，仍要看流年和流月如何触发。"
    ].join("\n")),
    section("这一年被什么触发", [
      `结论：今年主要由${triggerChains.slice(0, 3).map((chain) => chain.source).join("、")}引动。`,
      `命理依据：${triggerChains.slice(0, 5).map((chain) => chain.reason).join("；")}`,
      `现实表现：${triggerChains.slice(0, 4).map((chain) => chain.realityMapping).join("；")}`,
      "注意事项：触发链只是把原局、大运、流年连起来，不等同于结果。"
    ].join("\n")),
    section("重点月份", [
      `结论：重点看${monthlyHighlights.map((month) => `${month.month}月${month.pillar}(${month.intensity})`).join("、")}。`,
      `命理依据：${monthlyHighlights.map((month) => month.reasons.join("；")).join("；")}`,
      "现实表现：这些月份更适合观察事情落地、反馈出现、计划改动或关系资源变化。",
      "注意事项：流月是应期窗口，不单独承担全部判断。"
    ].join("\n"))
  ];
  const advice = [
    "先把年度主题对应到现实中的职责、资源、关系、迁动和作息清单。",
    "高强度月份只做重点复核，不把单月信号当成结果。",
    "涉及健康、合规、出行操作安全时，只按现实规则做复核和预防。"
  ];
  return {
    annualTheme,
    overallSummary,
    narrative: sections,
    advice,
    templateIds: rules.narrativeTemplates.map((item) => item.id),
  };
}

function section(title, text) {
  return { title, text };
}
