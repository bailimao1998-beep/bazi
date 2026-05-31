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
  "blindCases",
  "strengthModel",
  "patternsUsefulGods",
  "blindCoreMethods",
  "outputTemplates",
  "locations",
  "caseStudies",
  "aiPrompts",
  "referenceKnowledge",
];

const restoredSourceFiles = [
  "07-盲派候选-blind-cases.json",
  "08-力量模型-strength-model.json",
  "09-格局用神-patterns-useful-gods.json",
  "11-盲派核心方法-blind-core-methods.json",
  "12-输出主题模板-output-templates.json",
  "14-案例库-case-studies.json",
  "15-AI分析模板-ai-prompts.json",
  "16-参考资料知识卡-reference-cards.json",
];

const requiredLearningRuleFields = [
  "id",
  "title",
  "category",
  "trigger",
  "conditions",
  "logic",
  "plainExplanation",
  "evidence",
  "sourceRefs",
  "outputTemplate",
  "confidence",
  "status",
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
  assert.equal(bundle._meta.datasetCount, requiredBundleKeys.length);
  assert.equal(bundle.datasets.systemRules.rules.length, 674);
  assert.equal(bundle.datasets.systemRules.basicInterpretationRules.length, 55);
  assert.ok(bundle.datasets.locations.cities.length > 1000);
  assert.equal(index.runtimeBundle.file, "bazi-data-bundle.json");
  assert.equal(index.sourceDirectory, "source/");

  for (const key of requiredBundleKeys) {
    assert.ok(index.datasets.some((dataset) => dataset.bundleKey === key), `index should describe bundle key ${key}`);
  }

  for (const file of restoredSourceFiles) {
    assert.ok(index.datasets.some((dataset) => dataset.file === `source/${file}`), `index should describe restored source ${file}`);
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
  assert.equal(sourceFiles.includes("07-盲派候选-blind-cases.json"), true);
  assert.equal(sourceFiles.includes("08-力量模型-strength-model.json"), true);
  assert.equal(sourceFiles.includes("09-格局用神-patterns-useful-gods.json"), true);
  assert.equal(sourceFiles.includes("10-神煞-stars-spirits.json"), false);
  assert.equal(sourceFiles.includes("11-盲派核心方法-blind-core-methods.json"), true);
  assert.equal(sourceFiles.includes("12-输出主题模板-output-templates.json"), true);
  assert.equal(sourceFiles.includes("14-案例库-case-studies.json"), true);
  assert.equal(sourceFiles.includes("15-AI分析模板-ai-prompts.json"), true);
  assert.equal(sourceFiles.includes("16-参考资料知识卡-reference-cards.json"), true);
  assert.equal(rootFiles.has("legacy"), false, "legacy directory should be deleted");
});

test("restored learning knowledge modules expose explanation-rule schema", async () => {
  for (const file of restoredSourceFiles) {
    const data = JSON.parse(await fs.readFile(path.join(sourceDir, file), "utf8"));
    assert.equal(Array.isArray(data.rules), true, `${file} should expose rules[]`);
    assert.ok(data.rules.length >= 1, `${file} should start with at least one structural rule`);

    for (const rule of data.rules) {
      for (const field of requiredLearningRuleFields) {
        assert.notEqual(rule[field], undefined, `${file} rule ${rule.id ?? "(missing id)"} missing ${field}`);
      }
      assert.equal(Array.isArray(rule.sourceRefs), true, `${file} rule ${rule.id} sourceRefs should be an array`);
      assert.equal(typeof rule.outputTemplate, "string", `${file} rule ${rule.id} outputTemplate should be a template id`);
      assert.doesNotMatch(JSON.stringify(rule), /一定发生/, `${file} rule ${rule.id} must not contain absolute-event wording`);
    }
  }
});
