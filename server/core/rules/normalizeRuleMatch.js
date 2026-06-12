import { buildCounterEvidence } from "./counterEvidenceBuilder.js";
import { buildRuleEvidence } from "./evidenceBuilder.js";
import { buildRuleScore } from "./scoreBuilder.js";
import { buildRuleTiming } from "./timingBuilder.js";

export function normalizeRuleMatch({ rule, context, matchedFacts = [], conditionMatched = false, version = "legacy-v1" } = {}) {
  const evidence = buildRuleEvidence(rule, context, matchedFacts);
  const { score, scoreDetail } = buildRuleScore(rule, matchedFacts, context);
  return {
    id: rule.id,
    topic: rule.topic,
    tag: rule.tag,
    title: rule.title,
    evidence,
    confidence: rule.confidence ?? "medium",
    needVerify: rule.needVerify ?? ["需要结合更多本地证据复核。"],
    conditionMatched,
    score,
    scoreDetail,
    timing: buildRuleTiming(rule, context, matchedFacts),
    counterEvidence: buildCounterEvidence(rule),
    matchedFacts,
    version,
  };
}
