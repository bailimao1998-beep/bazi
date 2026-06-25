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
const core = readJson("rules-core.json");

const ids = new Set();
for (const item of [...methodology.rules, ...core.rules]) {
  if (!item.id || ids.has(item.id)) {
    throw new Error(`规则ID缺失或重复：${item.id || "<empty>"}`);
  }
  ids.add(item.id);
}

const payload = [
  `export const IMAGERY_RULE_CORPUS_VERSION = ${JSON.stringify("blind-bazi-imagery-kb-v1")};`,
  `export const IMAGERY_SOURCE_REGISTRY = ${JSON.stringify(sources.sources, null, 2)};`,
  `export const IMAGERY_METHODOLOGY_RULES = ${JSON.stringify(methodology.rules, null, 2)};`,
  `export const IMAGERY_RULES = ${JSON.stringify(core.rules, null, 2)};`,
  "",
].join("\n\n");

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, payload, "utf8");
console.log(`已生成 ${path.relative(root, output)}：${core.rules.length}条规则，${methodology.rules.length}条总纲。`);
