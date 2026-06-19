import { chainsForEvent, createEventCandidate, evidenceFromChains, strongestChains, sumStrength, timingFromChains } from "../eventTaxonomy.js";

export function detectFamilyHomeEvent({ triggerChains = [] } = {}) {
  const annualChains = triggerChains.filter((chain) => !String(chain.level || "").startsWith("month-"));
  const direct = chainsForEvent(annualChains, "family_home");
  const timingChains = chainsForEvent(triggerChains, "family_home");
  const yearMonthHits = direct.filter((chain) => /年|月/.test(chain.target?.role || "") && /冲|合|害|穿|刑|同支|伏吟|反吟/.test(chain.type));
  const resourceStars = annualChains.filter((chain) => ["正印", "偏印"].includes(chain.metadata?.tenGod));
  const picked = strongestChains([...direct, ...yearMonthHits, ...resourceStars], 8);
  const score = 8
    + sumStrength(strongestChains(direct, 3)) * 0.4
    + yearMonthHits.length * 13
    + resourceStars.length * 9;

  return createEventCandidate({
    eventType: "family_home",
    score,
    confidence: yearMonthHits.length || resourceStars.length ? "medium" : "low",
    evidenceChain: evidenceFromChains(picked),
    possibleManifestations: [
      yearMonthHits.length ? "年柱、月柱被触发，外部环境、家庭背景或居住运行环境需要整理" : "",
      resourceStars.length ? "印星被引动，长辈支持、材料证件、房屋文件或制度资源需要复核" : "",
      "家庭分工、父母长辈、房屋居住、老家事务被带到台前",
    ],
    timing: timingFromChains([...timingChains, ...yearMonthHits], "全年看家庭、父母长辈、居住环境和房屋材料；流月触发时看当月安排。"),
    debug: { direct: direct.length, yearMonthHits: yearMonthHits.length, resourceStars: resourceStars.length },
  });
}
