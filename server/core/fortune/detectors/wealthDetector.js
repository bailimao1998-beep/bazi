import { chainsForEvent, createEventCandidate, evidenceFromChains, strongestChains, sumStrength, timingFromChains } from "../eventTaxonomy.js";

export function detectWealthEvent({ triggerChains = [] } = {}) {
  const annualChains = triggerChains.filter((chain) => !String(chain.level || "").startsWith("month-"));
  const direct = chainsForEvent(annualChains, "wealth_resource");
  const timingChains = chainsForEvent(triggerChains, "wealth_resource");
  const wealthStars = annualChains.filter((chain) => ["正财", "偏财"].includes(chain.metadata?.tenGod));
  const outputStars = annualChains.filter((chain) => ["食神", "伤官"].includes(chain.metadata?.tenGod));
  const peerStars = annualChains.filter((chain) => ["比肩", "劫财"].includes(chain.metadata?.tenGod));
  const wealthRelations = direct.filter((chain) => /冲|合|害|穿|刑|同支|伏吟/.test(chain.type));
  const picked = strongestChains([...direct, ...wealthStars, ...outputStars, ...peerStars], 8);
  let score = 10
    + sumStrength(strongestChains(direct, 3)) * 0.42
    + wealthStars.length * 14
    + (wealthStars.length && outputStars.length ? 14 : 0)
    + peerStars.length * 8
    + wealthRelations.length * 8;
  if (!wealthStars.length && !outputStars.length && !peerStars.length) score = Math.min(score, 56);

  return createEventCandidate({
    eventType: "wealth_resource",
    score,
    confidence: wealthStars.length || wealthRelations.length ? "medium" : "low",
    evidenceChain: evidenceFromChains(picked),
    possibleManifestations: [
      wealthStars.length ? "收入、报价、付款或资源安排被带到台前" : "",
      outputStars.length && wealthStars.length ? "作品、方案或交付成果可能进入变现讨论" : "",
      peerStars.length ? "朋友同辈、团队合作或合伙资源带来分配压力" : "",
      "预算重算、合同金额复核、支出节奏调整",
    ],
    timing: timingFromChains([...timingChains, ...wealthStars], "全年看收支、报价、付款和资源归属；有月度触发时再看对应月份。"),
    debug: { direct: direct.length, wealthStars: wealthStars.length, outputStars: outputStars.length, peerStars: peerStars.length },
  });
}
