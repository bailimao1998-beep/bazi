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
  "config/ai-config.example.json",
];

const fixtureRequired = [
  "tests/fixtures/mock-chart.json",
  "tests/fixtures/mock-year-story-tags.json",
  "tests/fixtures/mock-ai-response.json",
];

const forbidden = /一定|必定|绝对|必然|必离婚|必发财|必有灾|必坐牢|必死亡/;

for (const filePath of required) {
  const absolutePath = path.resolve(process.cwd(), filePath);
  const content = readFileSync(absolutePath, "utf8");
  JSON.parse(content);
}

for (const filePath of fixtureRequired) {
  const absolutePath = path.resolve(process.cwd(), filePath);
  JSON.parse(readFileSync(absolutePath, "utf8"));
}

for (const filePath of listJsonFiles("data")) {
  JSON.parse(readFileSync(filePath, "utf8"));
}

for (const filePath of [
  ...listJsonFiles("data/rules"),
  ...listJsonFiles("data/story-templates"),
]) {
  const content = readFileSync(filePath, "utf8");
  if (forbidden.test(content)) {
    throw new Error(`${filePath} contains forbidden deterministic wording`);
  }
}

for (const filePath of listJsonFiles("tests/fixtures")) {
  JSON.parse(readFileSync(filePath, "utf8"));
}

const formalDataCount = listJsonFiles("data").length + 1;
const fixtureCount = listJsonFiles("tests/fixtures").length;
console.log(`Fortune AI data validation passed (${formalDataCount} data files, ${fixtureCount} fixture files checked).`);

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
