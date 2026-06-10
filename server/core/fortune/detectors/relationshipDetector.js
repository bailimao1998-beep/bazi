import { chainsForEvent, createEventCandidate, evidenceFromChains, strongestChains, sumStrength, timingFromChains } from "../eventTaxonomy.js";

export function detectRelationshipEvent({ triggerChains = [], chart } = {}) {
  const gender = chart?.input?.gender || "unknown";
  const annualChains = triggerChains.filter((chain) => !String(chain.level || "").startsWith("month-"));
  const direct = chainsForEvent(annualChains, "relationship_marriage");
  const timingChains = chainsForEvent(triggerChains, "relationship_marriage");
  const dayBranchHits = direct.filter((chain) =>
    /日/.test(chain.target?.role || "") &&
    ["同支", "伏吟", "冲", "反吟", "合", "害", "穿", "破", "刑"].includes(chain.type)
  );
  const spouseStarHits = annualChains.filter((chain) => {
    const tenGod = chain.metadata?.tenGod;
    return (gender === "male" && ["正财", "偏财"].includes(tenGod)) || (gender === "female" && ["正官", "七杀"].includes(tenGod));
  });
  const relationMoodHits = dayBranchHits.filter((chain) => /冲|反吟|害|穿|刑|合|同支|伏吟/.test(chain.type));
  const annualBonus = getAnnualRelationshipBonus({ annualChains, chart, gender });
  const picked = strongestChains([...direct, ...dayBranchHits, ...spouseStarHits], 8);
  const score = 12
    + sumStrength(strongestChains(direct, 3)) * 0.45
    + dayBranchHits.length * 18
    + spouseStarHits.length * 12
    + relationMoodHits.length * 6
    + annualBonus.score;

  return createEventCandidate({
    eventType: "relationship_marriage",
    score,
    confidence: dayBranchHits.length && spouseStarHits.length ? "high" : picked.length ? "medium" : "low",
    evidenceChain: [...annualBonus.evidence, ...evidenceFromChains(picked)],
    possibleManifestations: [
      annualBonus.score ? "感情或关系议题被带到台前，可能是初恋、暧昧、确定关系、旧关系启动或关系边界变化" : "",
      ...relationManifestations(relationMoodHits),
      "关系边界重谈",
      "合作或亲密关系的承诺、分工、相处节奏变化",
      "旧关系议题或旧沟通方式回到台前",
    ],
    timing: timingFromChains([...timingChains, ...spouseStarHits], "全年看关系边界、合作承诺和现实反馈；若流月继续触发日支，再看当月。"),
    debug: { direct: direct.length, dayBranchHits: dayBranchHits.length, spouseStarHits: spouseStarHits.length },
  });
}

function getAnnualRelationshipBonus({ annualChains = [], chart, gender } = {}) {
  const dayBranch = chart?.pillars?.day?.branch;
  const yearDayChains = annualChains.filter((chain) =>
    chain.level === "year-natal" &&
    chain.metadata?.targetKey === "day" &&
    ["同支", "伏吟", "冲", "反吟", "合", "害", "穿", "破", "刑"].includes(chain.type) &&
    chain.target?.branch === dayBranch
  );
  const evidence = [];
  let score = 0;
  for (const chain of yearDayChains) {
    const yearBranch = chain.source?.branch;
    if (!yearBranch || !dayBranch) continue;
    if (["同支", "伏吟"].includes(chain.type)) {
      score += 35;
      evidence.push(`流年${yearBranch}触发日支${dayBranch}，日支作为关系宫位被重复引动。`);
    } else if (["冲", "反吟"].includes(chain.type)) {
      score += 40;
      evidence.push(`流年${yearBranch}冲动日支${dayBranch}，关系宫位有变化、拉扯、调整之象。`);
    } else if (chain.type === "合") {
      score += 25;
      evidence.push(`流年${yearBranch}合动日支${dayBranch}，关系宫位有靠近、牵连、绑定之象。`);
    } else if (["害", "穿", "破", "刑"].includes(chain.type)) {
      score += 20;
      evidence.push(`流年${yearBranch}对日支${dayBranch}形成不顺互动，关系细节容易别扭或反复。`);
    }
  }

  const spouseStarHits = annualChains.filter((chain) => {
    if (chain.level !== "year-natal") return false;
    const tenGod = chain.metadata?.tenGod;
    return (gender === "male" && ["正财", "偏财"].includes(tenGod)) || (gender === "female" && ["正官", "七杀"].includes(tenGod));
  });
  if (spouseStarHits.length) {
    score += 25;
    evidence.push(gender === "male"
      ? "男命流年出现财星，传统命理中可作为关系对象的重要观察点。"
      : "女命流年出现官杀，传统命理中可作为关系对象的重要观察点。");
  }

  return { score, evidence };
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
