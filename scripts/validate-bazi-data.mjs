import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const required = [
  "data/rules/natal/base-personality.json",
  "data/rules/natal/relationship.json",
  "data/rules/natal/career.json",
  "data/rules/natal/wealth.json",
  "data/rules/transit/liunian.json",
  "data/rules/transit/liuyue.json",
  "data/rules/natal/shensha.json",
  "data/rules/natal/master-summary.json",
  "data/content/stories/year-themes.json",
  "data/content/stories/month-roles.json",
  "data/content/stories/relationship-stories.json",
  "data/content/stories/career-stories.json",
  "data/content/stories/wealth-stories.json",
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
  ...listJsonFiles("data/content"),
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
