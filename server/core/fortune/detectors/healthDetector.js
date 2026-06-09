import { chainsForEvent, createEventCandidate, evidenceFromChains, strongestChains, sumStrength, timingFromChains } from "../eventTaxonomy.js";

export function detectHealthEvent({ triggerChains = [] } = {}) {
  const annualChains = triggerChains.filter((chain) => !String(chain.level || "").startsWith("month-"));
  const direct = chainsForEvent(annualChains, "health_risk");
  const timingChains = chainsForEvent(triggerChains, "health_risk");
  const hardRelations = annualChains.filter((chain) => /冲|刑|害|穿|反吟/.test(chain.type));
  const repeatedTargets = countRepeatedTargets(hardRelations);
  const pressureStars = annualChains.filter((chain) => ["正官", "七杀"].includes(chain.metadata?.tenGod));
  const picked = strongestChains([...direct, ...hardRelations, ...pressureStars], 8);
  const score = 8
    + sumStrength(strongestChains(direct, 3)) * 0.38
    + hardRelations.length * 6
    + repeatedTargets * 12
    + pressureStars.length * 7;

  return createEventCandidate({
    eventType: "health_risk",
    score,
    confidence: hardRelations.length || repeatedTargets ? "medium" : "low",
    evidenceChain: evidenceFromChains(picked),
    possibleManifestations: [
      "作息体感波动需要记录",
      "压力负荷、流程安全、工具使用和出行操作需要复核",
      repeatedTargets ? "同一柱位被多次触发，相关生活场景容易反复提醒" : "",
      "只作为健康和风险复核清单，不作疾病或严重结果判断",
    ],
    timing: timingFromChains([...timingChains, ...hardRelations], "全年只做作息、体感、流程安全和出行操作复核；流月重叠时看当月。"),
    debug: { direct: direct.length, hardRelations: hardRelations.length, repeatedTargets, pressureStars: pressureStars.length },
  });
}

function countRepeatedTargets(chains = []) {
  const counts = new Map();
  for (const chain of chains) {
    const key = `${chain.target?.role || ""}${chain.target?.label || ""}`;
    if (!key.trim()) continue;
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return [...counts.values()].filter((count) => count >= 2).length;
}
