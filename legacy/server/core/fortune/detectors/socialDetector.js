import { chainsForEvent, createEventCandidate, evidenceFromChains, strongestChains, sumStrength, timingFromChains } from "../eventTaxonomy.js";

export function detectSocialEvent({ triggerChains = [] } = {}) {
  const annualChains = triggerChains.filter((chain) => !String(chain.level || "").startsWith("month-"));
  const direct = chainsForEvent(annualChains, "social_conflict");
  const timingChains = chainsForEvent(triggerChains, "social_conflict");
  const peerStars = annualChains.filter((chain) => ["比肩", "劫财"].includes(chain.metadata?.tenGod));
  const conflictRelations = direct.filter((chain) => /冲|害|穿|刑|反吟/.test(chain.type));
  const wealthChains = chainsForEvent(annualChains, "wealth_resource");
  const peerWealthPressure = peerStars.length && wealthChains.length ? 1 : 0;
  const picked = strongestChains([...direct, ...peerStars, ...wealthChains], 8);
  const score = 8
    + sumStrength(strongestChains(direct, 3)) * 0.4
    + peerStars.length * 14
    + conflictRelations.length * 8
    + peerWealthPressure * 12;

  return createEventCandidate({
    eventType: "social_conflict",
    score,
    confidence: peerStars.length || conflictRelations.length ? "medium" : "low",
    evidenceChain: evidenceFromChains(picked),
    possibleManifestations: [
      peerStars.length ? "同辈、朋友、团队成员或合伙人议题变明显" : "",
      peerWealthPressure ? "比劫夺财取象：资源归属、付款分摊或合作收益需要说清" : "",
      conflictRelations.length ? "合作摩擦、分工争议或沟通误会需要复盘" : "",
      "朋友同辈、竞争协作和团队边界进入现实讨论",
    ],
    timing: timingFromChains([...timingChains, ...peerStars], "全年看合作分工、朋友同辈、资源边界；流月继续触发时看当月沟通。"),
    debug: { direct: direct.length, peerStars: peerStars.length, conflictRelations: conflictRelations.length, peerWealthPressure },
  });
}
