import { candidateToLegacyScore, eventTaxonomy } from "./eventTaxonomy.js";
import { detectCareerEvent } from "./detectors/careerDetector.js";
import { detectChildrenOutputEvent } from "./detectors/childrenOutputDetector.js";
import { detectFamilyHomeEvent } from "./detectors/familyHomeDetector.js";
import { detectHealthEvent } from "./detectors/healthDetector.js";
import { detectMovementEvent } from "./detectors/movementDetector.js";
import { detectRelationshipEvent } from "./detectors/relationshipDetector.js";
import { detectSocialEvent } from "./detectors/socialDetector.js";
import { detectWealthEvent } from "./detectors/wealthDetector.js";

const detectors = [
  detectRelationshipEvent,
  detectWealthEvent,
  detectChildrenOutputEvent,
  detectCareerEvent,
  detectHealthEvent,
  detectMovementEvent,
  detectSocialEvent,
  detectFamilyHomeEvent,
];

const legacyScoreKeys = ["career", "wealth", "relationship", "study", "health", "movement", "social"];

export function scoreEventCandidates(context = {}) {
  const ranked = detectors
    .map((detector) => detector(context))
    .sort((a, b) => Number(b.score || 0) - Number(a.score || 0))
    .map((candidate, index) => ({ ...candidate, rank: index + 1 }));

  const eventCandidates = ranked.filter((candidate) => candidate.score >= 30 || candidate.evidenceChain.length > 0);
  const mainEvents = eventCandidates
    .filter((candidate) => ["high", "medium"].includes(candidate.level) && candidate.evidenceChain.length > 0)
    .slice(0, 3);
  const mainEventTypes = new Set(mainEvents.map((event) => event.eventType));
  const parallelEvents = eventCandidates
    .filter((candidate) => !mainEventTypes.has(candidate.eventType))
    .filter((candidate) => candidate.score >= 30 && candidate.evidenceChain.length > 0)
    .slice(0, 5);
  const lowEvidenceTopics = ranked
    .filter((candidate) => candidate.score < 30 || candidate.evidenceChain.length === 0)
    .map((candidate) => ({
      eventType: candidate.eventType,
      label: eventTaxonomy[candidate.eventType]?.label ?? candidate.eventType,
      score: candidate.score,
      reason: "本地触发链证据不足，本轮不进入重点事件。",
    }));

  return {
    eventCandidates,
    mainEvents,
    parallelEvents,
    lowEvidenceTopics,
    eventScores: buildLegacyEventScores(eventCandidates),
  };
}

function buildLegacyEventScores(eventCandidates = []) {
  const grouped = Object.fromEntries(legacyScoreKeys.map((key) => [key, {
    score: 0,
    label: key,
    evidence: ["本年度事件引擎未把该领域列为重点，只保留低强度观察。"],
    realityMapping: "不平均展开，等触发链更明确时再解释。",
    caution: "低证据主题不进入重点事件。",
  }]));

  for (const candidate of eventCandidates) {
    const legacy = candidateToLegacyScore(candidate);
    if (!grouped[legacy.label]) continue;
    if (legacy.score >= grouped[legacy.label].score) {
      grouped[legacy.label] = legacy;
    }
  }
  return grouped;
}
