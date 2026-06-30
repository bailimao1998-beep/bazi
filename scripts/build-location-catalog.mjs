import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const source = path.join(root, "data", "knowledge", "location", "location-catalog.json");
const targets = [
  path.join(root, "js", "generated", "locationCatalog.js"),
  path.join(root, "js", "locationData.js"),
];
const checkOnly = process.argv.includes("--check");
const catalog = JSON.parse(fs.readFileSync(source, "utf8"));

if (!Array.isArray(catalog.cities) || catalog.cities.length === 0) {
  throw new Error("地区权威 JSON 缺少城市数据");
}

const payload = `window.FortuneLocationData = ${JSON.stringify(catalog)};\n`;

for (const target of targets) {
  if (checkOnly) {
    if (fs.readFileSync(target, "utf8") !== payload) {
      throw new Error(
        `${path.relative(root, target)} 与地区权威 JSON 不一致，请运行 node scripts/build-location-catalog.mjs`,
      );
    }
  } else {
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, payload, "utf8");
  }
}

const action = checkOnly ? "漂移检查通过" : "已生成";
console.log(`${action}：${catalog.cities.length} 条地区记录`);
