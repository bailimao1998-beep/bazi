import { loadJson } from "../../utils/jsonLoader.js";

export function loadFortuneRules() {
  return {
    tenGods: loadJson("data/rules/fortune-engine/ten-gods.json").rules,
    relations: loadJson("data/rules/fortune-engine/stem-branch-relations.json").rules,
    penalties: loadJson("data/rules/fortune-engine/clash-combo-penalty.json").rules,
    eventTags: loadJson("data/rules/fortune-engine/event-tags.json").rules,
    narrativeTemplates: loadJson("data/rules/fortune-engine/narrative-templates.json").templates,
  };
}

export function unique(list = []) {
  return [...new Set(list.filter(Boolean))];
}

export function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Number(value) || 0));
}

export function normalizeEvidence(value) {
  if (Array.isArray(value)) return value.filter(Boolean).map(String);
  return value ? [String(value)] : [];
}

export function relationPairs(rule) {
  return rule?.condition?.pairs ?? [];
}

export function pairMatches(pair, a, b) {
  return Array.isArray(pair) && pair.includes(a) && pair.includes(b);
}

export function ruleMatchesTenGod(rule, tenGod) {
  return (rule?.condition?.tenGods ?? []).includes(tenGod);
}

export function tagRuleMatches(rule, tags = []) {
  return (rule?.condition?.tags ?? []).some((tag) => tags.includes(tag));
}

export function elementLabel(element) {
  return { wood: "木", fire: "火", earth: "土", metal: "金", water: "水" }[element] ?? element;
}

export function branchThemeByPillar(role = "") {
  if (role.includes("年")) return ["external", "social"];
  if (role.includes("月")) return ["career", "pressure"];
  if (role.includes("日")) return ["relationship", "health"];
  if (role.includes("时")) return ["study", "movement"];
  return [];
}
