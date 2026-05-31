import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = path.join(repoRoot, "data");
const sourceDir = path.join(dataDir, "source");

const requiredBundleKeys = [
  "sources",
  "stemsBranches",
  "fiveElements",
  "tenGods",
  "combinations",
  "twelveStages",
  "systemRules",
  "locations",
];

const inactiveRootFiles = [
  "README_副本.md",
  "bazi_atomic_notes_v2.jsonl",
  "bazi_runtime_rules_v2.json",
  "bazi_blind_school_database_v2.json",
  "database_schema_postgres.sql",
];

test("data directory exposes one bundle and keeps source modules under data/source", async () => {
  const bundle = JSON.parse(await fs.readFile(path.join(dataDir, "bazi-data-bundle.json"), "utf8"));
  const index = JSON.parse(await fs.readFile(path.join(dataDir, "index.json"), "utf8"));

  assert.equal(bundle._meta?.file, "bazi-data-bundle.json");
  assert.equal(bundle._meta?.purpose, "single_runtime_bundle");
  assert.deepEqual(Object.keys(bundle.datasets).sort(), requiredBundleKeys.sort());
  assert.equal(bundle.datasets.systemRules.rules.length, 674);
  assert.equal(bundle.datasets.systemRules.basicInterpretationRules.length, 55);
  assert.ok(bundle.datasets.locations.cities.length > 1000);
  assert.equal(index.runtimeBundle.file, "bazi-data-bundle.json");
  assert.equal(index.sourceDirectory, "source/");

  for (const key of requiredBundleKeys) {
    assert.ok(index.datasets.some((dataset) => dataset.bundleKey === key), `index should describe bundle key ${key}`);
  }
});

test("inactive generated or duplicate data files are deleted from active data areas", async () => {
  const rootFiles = new Set(await fs.readdir(dataDir));

  for (const file of inactiveRootFiles) {
    assert.equal(rootFiles.has(file), false, `${file} should not remain in data root`);
  }
  assert.equal(rootFiles.has("archive"), false, "archive directory should not remain after deleting inactive files");

  const sourceFiles = await fs.readdir(sourceDir);
  assert.ok(sourceFiles.includes("01-天干地支-stems-branches.json"));
  assert.equal(sourceFiles.includes("07-盲派候选-blind-cases.json"), false);
  assert.equal(sourceFiles.includes("08-力量模型-strength-model.json"), false);
  assert.equal(sourceFiles.includes("09-格局用神-patterns-useful-gods.json"), false);
  assert.equal(sourceFiles.includes("10-神煞-stars-spirits.json"), false);
  assert.equal(sourceFiles.includes("11-盲派核心方法-blind-core-methods.json"), false);
  assert.equal(sourceFiles.includes("12-输出主题模板-output-templates.json"), false);
  assert.equal(sourceFiles.includes("14-案例库-case-studies.json"), false);
  assert.equal(sourceFiles.includes("15-AI分析模板-ai-prompts.json"), false);
  assert.equal(sourceFiles.includes("16-参考资料知识卡-reference-cards.json"), false);
  assert.equal(rootFiles.has("legacy"), false, "legacy directory should be deleted");
});
