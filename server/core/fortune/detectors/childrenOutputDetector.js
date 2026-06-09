import { chainsForEvent, createEventCandidate, evidenceFromChains, strongestChains, sumStrength, timingFromChains } from "../eventTaxonomy.js";

export function detectChildrenOutputEvent({ triggerChains = [] } = {}) {
  const annualChains = triggerChains.filter((chain) => !String(chain.level || "").startsWith("month-"));
  const direct = chainsForEvent(annualChains, "children_output");
  const timingChains = chainsForEvent(triggerChains, "children_output");
  const outputStars = annualChains.filter((chain) => ["食神", "伤官"].includes(chain.metadata?.tenGod));
  const hourHits = direct.filter((chain) => /时/.test(chain.target?.role || ""));
  const wealthStars = annualChains.filter((chain) => ["正财", "偏财"].includes(chain.metadata?.tenGod));
  const picked = strongestChains([...direct, ...outputStars, ...wealthStars], 8);
  const score = 8
    + sumStrength(strongestChains(direct, 3)) * 0.45
    + outputStars.length * 15
    + hourHits.length * 14
    + (outputStars.length && wealthStars.length ? 12 : 0);

  return createEventCandidate({
    eventType: "children_output",
    score,
    confidence: outputStars.length || hourHits.length ? "medium" : "low",
    evidenceChain: evidenceFromChains(picked),
    possibleManifestations: [
      outputStars.length ? "作品、方案、表达发布或项目成果进入交付阶段" : "",
      hourHits.length ? "时柱被触发，晚辈、学生、宠物、长期项目或后续安排增多" : "",
      outputStars.length && wealthStars.length ? "食伤生财取象：作品、项目或交付成果进入资源回收讨论" : "",
      "年轻用户优先按作品、项目、成果、学生和长期计划观察",
    ],
    timing: timingFromChains([...timingChains, ...outputStars], "全年看输出、交付、学生晚辈和长期项目；有流月触发再看当月反馈。"),
    debug: { direct: direct.length, outputStars: outputStars.length, hourHits: hourHits.length, wealthStars: wealthStars.length },
  });
}
