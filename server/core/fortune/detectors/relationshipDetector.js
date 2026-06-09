import { chainsForEvent, createEventCandidate, evidenceFromChains, strongestChains, sumStrength, timingFromChains } from "../eventTaxonomy.js";

export function detectRelationshipEvent({ triggerChains = [], chart } = {}) {
  const gender = chart?.input?.gender || "unknown";
  const annualChains = triggerChains.filter((chain) => !String(chain.level || "").startsWith("month-"));
  const direct = chainsForEvent(annualChains, "relationship_marriage");
  const timingChains = chainsForEvent(triggerChains, "relationship_marriage");
  const dayBranchHits = direct.filter((chain) => /日/.test(chain.target?.role || "") && /冲|合|害|穿|刑|同支|伏吟|反吟/.test(chain.type));
  const spouseStarHits = annualChains.filter((chain) => {
    const tenGod = chain.metadata?.tenGod;
    return (gender === "male" && ["正财", "偏财"].includes(tenGod)) || (gender === "female" && ["正官", "七杀"].includes(tenGod));
  });
  const relationMoodHits = dayBranchHits.filter((chain) => /冲|反吟|害|穿|刑|合|同支|伏吟/.test(chain.type));
  const picked = strongestChains([...direct, ...dayBranchHits, ...spouseStarHits], 8);
  const score = 12
    + sumStrength(strongestChains(direct, 3)) * 0.45
    + dayBranchHits.length * 18
    + spouseStarHits.length * 12
    + relationMoodHits.length * 6;

  return createEventCandidate({
    eventType: "relationship_marriage",
    score,
    confidence: dayBranchHits.length && spouseStarHits.length ? "high" : picked.length ? "medium" : "low",
    evidenceChain: evidenceFromChains(picked),
    possibleManifestations: [
      ...relationManifestations(relationMoodHits),
      "关系边界重谈",
      "合作或亲密关系的承诺、分工、相处节奏变化",
      "旧关系议题或旧沟通方式回到台前",
    ],
    timing: timingFromChains([...timingChains, ...spouseStarHits], "全年看关系边界、合作承诺和现实反馈；若流月继续触发日支，再看当月。"),
    debug: { direct: direct.length, dayBranchHits: dayBranchHits.length, spouseStarHits: spouseStarHits.length },
  });
}

function relationManifestations(chains = []) {
  const text = chains.map((chain) => chain.type).join("");
  const items = [];
  if (/合/.test(text)) items.push("关系承诺讨论、合作绑定重谈或分工确认");
  if (/冲|反吟/.test(text)) items.push("关系节奏变化、距离变化或安排重排");
  if (/害|穿|刑/.test(text)) items.push("暗处别扭、误会反复或边界不舒服");
  if (/同支|伏吟/.test(text)) items.push("旧关系主题、同类相处模式再次出现");
  return items;
}
