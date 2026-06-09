import { branchMainStem, getTenGod } from "../bazi/tenGods.js";
import { eventTypes, unique } from "./eventTaxonomy.js";

const officerGods = ["正官", "七杀"];
const wealthGods = ["正财", "偏财"];
const outputGods = ["食神", "伤官"];
const peerGods = ["比肩", "劫财"];
const resourceGods = ["正印", "偏印"];

export function tenGodTopicHints(tenGod, gender = "unknown") {
  const hints = [];
  if (wealthGods.includes(tenGod)) hints.push("wealth_resource");
  if (outputGods.includes(tenGod)) hints.push("children_output");
  if (officerGods.includes(tenGod)) hints.push("career_status", "health_risk");
  if (resourceGods.includes(tenGod)) hints.push("career_status", "family_home");
  if (peerGods.includes(tenGod)) hints.push("social_conflict");
  if (gender === "male" && wealthGods.includes(tenGod)) hints.push("relationship_marriage");
  if (gender === "female" && officerGods.includes(tenGod)) hints.push("relationship_marriage");
  return unique(hints);
}

export function pillarTopicHints(role = "") {
  if (/年/.test(role)) return ["family_home", "social_conflict", "movement_change"];
  if (/月/.test(role)) return ["career_status", "family_home", "social_conflict"];
  if (/日/.test(role)) return ["relationship_marriage", "health_risk"];
  if (/时/.test(role)) return ["children_output", "movement_change", "health_risk"];
  if (/大运/.test(role)) return ["career_status", "wealth_resource", "relationship_marriage", "movement_change"];
  if (/流年/.test(role)) return ["career_status", "wealth_resource", "relationship_marriage", "movement_change"];
  if (/流月/.test(role)) return ["movement_change", "health_risk"];
  return [];
}

export function relationTopicHints(type, targetRole = "") {
  const hints = [...pillarTopicHints(targetRole)];
  if (["冲", "反吟"].includes(type)) hints.push("movement_change", "health_risk");
  if (["合", "天干合"].includes(type)) hints.push("relationship_marriage", "wealth_resource", "social_conflict");
  if (["害", "穿", "刑"].includes(type)) hints.push("health_risk", "social_conflict");
  if (["同支", "同干", "伏吟"].includes(type)) hints.push(...pillarTopicHints(targetRole));
  return unique(hints);
}

export function pillarTenGods(dayStem, pillar) {
  return {
    stem: getTenGod(dayStem, pillar?.stem),
    branch: getTenGod(dayStem, branchMainStem(pillar?.branch)),
  };
}

export function eventTypeToLegacyTopic(eventType) {
  return {
    relationship_marriage: "relationship",
    wealth_resource: "wealth",
    children_output: "study",
    career_status: "career",
    health_risk: "health",
    movement_change: "movement",
    social_conflict: "social",
    family_home: "family_home",
  }[eventType] || "social";
}

export function ensureKnownEventHints(hints = []) {
  return unique(hints).filter((hint) => eventTypes.includes(hint));
}

