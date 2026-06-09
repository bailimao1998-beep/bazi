import { loadFortuneRules, pairMatches, relationPairs, unique } from "./rule-data.js";

export function analyzeMonthTrigger({ chart, selectedLuck, yearInfluence, monthInfluences = [], triggerChains = [], rules = loadFortuneRules() } = {}) {
  const highlights = monthInfluences.map((month) => scoreMonth({ chart, selectedLuck, yearInfluence, month, triggerChains, rules }))
    .filter((item) => item.score >= 4)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .sort((a, b) => a.month - b.month);
  return highlights.length ? highlights : [scoreMonth({ chart, selectedLuck, yearInfluence, month: monthInfluences[0], triggerChains, rules })];
}

function scoreMonth({ chart, selectedLuck, yearInfluence, month, triggerChains, rules }) {
  const reasons = [];
  let score = 0;
  const targets = [
    ...Object.values(chart.pillars ?? {}).map((pillar) => ({ label: pillar.role, pillar })),
    { label: "大运", pillar: selectedLuck },
    { label: "流年", pillar: yearInfluence?.pillar },
  ];
  for (const target of targets) {
    for (const rule of rules.relations) {
      const hit = relationPairs(rule).some((pair) => pairMatches(pair, month?.pillar?.branch, target.pillar?.branch));
      if (!hit) continue;
      score += rule.weight;
      reasons.push(`${month?.month}月${month?.pillar?.label}与${target.label}${target.pillar?.label}形成${rule.condition.type}`);
    }
  }
  const tenGodHits = triggerChains.filter((chain) => [month?.tenGods?.stem, month?.tenGods?.branch].some((tenGod) => chain.reason?.includes(tenGod)));
  if (tenGodHits.length) {
    score += 3;
    reasons.push(`流月十神${month?.tenGods?.stem}、${month?.tenGods?.branch}在本月形成短期应期`);
  }
  const sameBranch = targets.filter((target) => target.pillar?.branch === month?.pillar?.branch);
  if (sameBranch.length) {
    score += 4;
    reasons.push(`流月地支与${sameBranch.map((item) => item.label).join("、")}同支，主题更容易回到台前`);
  }
  return {
    month: month?.month,
    pillar: month?.pillar?.label,
    intensity: score >= 9 ? "high" : score >= 5 ? "medium" : "low",
    score,
    reasons: unique(reasons.length ? reasons : [`${month?.month}月作为${month?.role}，只保留为低强度观察窗口`]),
    triggerLinks: triggerChains.slice(0, 3).map((chain) => chain.id),
    explanation: reasons.length ? "本月与原局、大运或流年形成关系，适合作为应期观察。" : "本月暂未形成明显关系，作为辅助观察。",
  };
}
