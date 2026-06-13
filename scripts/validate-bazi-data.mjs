import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const required = [
  "data/rules/bazi/base-personality.json",
  "data/rules/bazi/relationship.json",
  "data/rules/bazi/career.json",
  "data/rules/bazi/wealth.json",
  "data/rules/bazi/liunian.json",
  "data/rules/bazi/liuyue.json",
  "data/rules/bazi/shensha.json",
  "data/story-templates/year-themes.json",
  "data/story-templates/month-roles.json",
  "data/story-templates/relationship-stories.json",
  "data/story-templates/career-stories.json",
  "data/story-templates/wealth-stories.json",
  "data/mock/mock-chart.json",
  "data/mock/mock-year-story-tags.json",
  "data/mock/mock-ai-response.json",
  "config/ai-config.example.json",
];

const forbidden = /一定|必定|绝对|必然|必离婚|必发财|必有灾|必坐牢|必死亡/;

for (const filePath of required) {
  const absolutePath = path.resolve(process.cwd(), filePath);
  const content = readFileSync(absolutePath, "utf8");
  JSON.parse(content);
  if (forbidden.test(content)) {
    throw new Error(`${filePath} contains forbidden deterministic wording`);
  }
}

for (const filePath of listJsonFiles("data")) {
  JSON.parse(readFileSync(filePath, "utf8"));
}

console.log(`Fortune AI data validation passed (${required.length} required JSON files checked).`);

function listJsonFiles(directory) {
  const results = [];
  for (const name of readdirSync(directory)) {
    const filePath = path.join(directory, name);
    const stat = statSync(filePath);
    if (stat.isDirectory()) results.push(...listJsonFiles(filePath));
    if (stat.isFile() && filePath.endsWith(".json")) results.push(filePath);
  }
  return results;
}
