import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const dataDir = path.join(root, "data", "imagery-rules");
const output = path.join(root, "js", "core", "imagery-rules", "imageryRuleBundle.js");

function readJson(name) {
  return JSON.parse(fs.readFileSync(path.join(dataDir, name), "utf8"));
}

const sources = readJson("sources.json");
const methodology = readJson("methodology.json");
const moduleIndex = readJson("module-index.json");
const conflicts = readJson("source-conflicts.json");
const researchPending = readJson("research-pending.json");

const modulePayloads = moduleIndex.activeRuleFiles.map((file) => {
  const payload = readJson(file);
  return {
    id: payload.module ?? file.replace(/^rules-|\.json$/g, ""),
    file,
    version: payload.version,
    rules: Array.isArray(payload.rules) ? payload.rules : [],
  };
});

const rules = modulePayloads.flatMap((item) => item.rules);
const ids = new Set();
for (const item of [...methodology.rules, ...rules]) {
  if (!item.id || ids.has(item.id)) {
    throw new Error(`规则ID缺失或重复：${item.id || "<empty>"}`);
  }
  ids.add(item.id);
}

for (const rule of rules) {
  const required = [
    "title", "category", "domains", "scopes", "trigger", "requires",
    "weakeningConditions", "imagery", "advice", "prohibitions", "sourceRefs",
  ];
  const missing = required.filter((key) => rule[key] == null);
  if (missing.length) {
    throw new Error(`规则 ${rule.id} 缺字段：${missing.join(",")}`);
  }
  if (rule.researchOnly === true || rule.allowInUserAnswer === false) {
    throw new Error(`正式规则文件中发现非用户侧规则：${rule.id}`);
  }
}

const moduleSummary = modulePayloads.map((item) => ({
  id: item.id,
  file: item.file,
  version: item.version,
  ruleCount: item.rules.length,
}));

const payload = [
  `export const IMAGERY_RULE_CORPUS_VERSION = ${JSON.stringify("blind-bazi-imagery-kb-v8.4")};`,
  `export const IMAGERY_SOURCE_REGISTRY = ${JSON.stringify(sources.sources, null, 2)};`,
  `export const IMAGERY_METHODOLOGY_RULES = ${JSON.stringify(methodology.rules, null, 2)};`,
  `export const IMAGERY_RULE_MODULES = ${JSON.stringify(moduleSummary, null, 2)};`,
  `export const IMAGERY_SOURCE_CONFLICTS = ${JSON.stringify(conflicts.resolutions, null, 2)};`,
  `export const IMAGERY_RESEARCH_PENDING = ${JSON.stringify(researchPending.items, null, 2)};`,
  `export const IMAGERY_RULES = ${JSON.stringify(rules, null, 2)};`,
  "",
].join("\n\n");

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, payload, "utf8");
console.log(
  `已生成 ${path.relative(root, output)}：${rules.length}条正式规则，` +
  `${methodology.rules.length}条总纲，${modulePayloads.length}个模块。`,
);
