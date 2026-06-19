import { chainsForEvent, createEventCandidate, evidenceFromChains, strongestChains, sumStrength, timingFromChains } from "../eventTaxonomy.js";

export function detectMovementEvent({ triggerChains = [] } = {}) {
  const annualChains = triggerChains.filter((chain) => !String(chain.level || "").startsWith("month-"));
  const direct = chainsForEvent(annualChains, "movement_change");
  const timingChains = chainsForEvent(triggerChains, "movement_change");
  const clashes = annualChains.filter((chain) => /冲|反吟/.test(chain.type));
  const pillarScenes = direct.filter((chain) => /年|月|日|时/.test(chain.target?.role || ""));
  const picked = strongestChains([...direct, ...clashes], 8);
  const score = 10
    + sumStrength(strongestChains(direct, 3)) * 0.5
    + clashes.length * 10
    + pillarScenes.length * 5;

  return createEventCandidate({
    eventType: "movement_change",
    score,
    confidence: clashes.length ? "medium" : "low",
    evidenceChain: evidenceFromChains(picked),
    possibleManifestations: [
      ...pillarSceneManifestations(pillarScenes),
      "出行、搬动、通勤、办公地点或生活环境出现调整",
      "时间表、计划优先级或路线安排需要重排",
    ],
    timing: timingFromChains([...timingChains, ...clashes], "全年看地点、时间表、出行、搬动和环境安排；月度冲动明显时看对应月份。"),
    debug: { direct: direct.length, clashes: clashes.length, pillarScenes: pillarScenes.length },
  });
}

function pillarSceneManifestations(chains = []) {
  const roles = chains.map((chain) => chain.target?.role || "").join("");
  const items = [];
  if (/年/.test(roles)) items.push("外部环境、远方资源、家族或公开场景有变化");
  if (/月/.test(roles)) items.push("工作环境、团队节奏或现实运行环境有调整");
  if (/日/.test(roles)) items.push("自我状态、关系距离或日常安排有变化");
  if (/时/.test(roles)) items.push("长期项目、晚辈下属或后续计划被调整");
  return items;
}
