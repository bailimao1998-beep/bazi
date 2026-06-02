import { loadJson } from "../../utils/jsonLoader.js";
import { matchRules } from "./matchRules.js";

const ruleFiles = [
  "data/rules/bazi/base-personality.json",
  "data/rules/bazi/relationship.json",
  "data/rules/bazi/career.json",
  "data/rules/bazi/wealth.json",
  "data/rules/bazi/liunian.json",
  "data/rules/bazi/liuyue.json",
  "data/rules/ziwei/palace-rules.json",
  "data/rules/ziwei/sihua-rules.json",
  "data/rules/ziwei/relationship-rules.json",
];

export function ruleEngine(context = {}) {
  return ruleFiles.flatMap((file) => {
    const data = loadJson(file);
    return matchRules(data.rules ?? [], context).map((match) => ({ ...match, source: file }));
  });
}
