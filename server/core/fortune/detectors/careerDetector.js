import { chainsForEvent, createEventCandidate, evidenceFromChains, strongestChains, sumStrength, timingFromChains } from "../eventTaxonomy.js";

export function detectCareerEvent({ triggerChains = [] } = {}) {
  const annualChains = triggerChains.filter((chain) => !String(chain.level || "").startsWith("month-"));
  const direct = chainsForEvent(annualChains, "career_status");
  const timingChains = chainsForEvent(triggerChains, "career_status");
  const officerStars = annualChains.filter((chain) => ["正官", "七杀"].includes(chain.metadata?.tenGod));
  const resourceStars = annualChains.filter((chain) => ["正印", "偏印"].includes(chain.metadata?.tenGod));
  const outputStars = annualChains.filter((chain) => ["食神", "伤官"].includes(chain.metadata?.tenGod));
  const monthPillarHits = direct.filter((chain) => /月/.test(chain.target?.role || ""));
  const pressureCombos = officerStars.length && outputStars.length ? 1 : 0;
  const picked = strongestChains([...direct, ...officerStars, ...resourceStars, ...outputStars], 8);
  const score = 12
    + sumStrength(strongestChains(direct, 4)) * 0.48
    + officerStars.length * 14
    + resourceStars.length * 10
    + (officerStars.length && resourceStars.length ? 14 : 0)
    + pressureCombos * 10
    + monthPillarHits.length * 10;

  return createEventCandidate({
    eventType: "career_status",
    score,
    confidence: officerStars.length || monthPillarHits.length ? "medium" : "low",
    evidenceChain: evidenceFromChains(picked),
    possibleManifestations: [
      officerStars.length ? "岗位职责、考核、审批或规则流程被带到台前" : "",
      resourceStars.length ? "证书材料、学习资质、上级支持或制度资源需要整理" : "",
      officerStars.length && resourceStars.length ? "官印相生取象：职责与资质材料、流程承接同时出现" : "",
      pressureCombos ? "伤官见官取象：表达输出和规则要求之间需要磨合" : "",
      "身份角色、岗位权限或考试证照安排被重新确认",
    ],
    timing: timingFromChains([...timingChains, ...officerStars, ...resourceStars], "全年看职责、证照、流程、考核和岗位权限；流月继续触发时看当月节点。"),
    debug: { direct: direct.length, officerStars: officerStars.length, resourceStars: resourceStars.length, outputStars: outputStars.length, monthPillarHits: monthPillarHits.length },
  });
}
