import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = path.join(repoRoot, "data");
const sourceDir = path.join(dataDir, "source");
const bundleFile = "bazi-data-bundle.json";

const stems = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const branches = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];

const FILES = {
  sources: "00-来源-sources.json",
  stemsBranches: "01-天干地支-stems-branches.json",
  fiveElements: "02-五行强弱-five-elements.json",
  tenGods: "03-十神-ten-gods.json",
  combinations: "04-合冲刑害破-combinations.json",
  twelveStages: "05-十二长生-twelve-stages.json",
  systemRules: "06-程序规则-system-rules.json",
  locations: "13-城市经纬度-locations.json",
  index: "index.json",
};

const expectedCombos = {
  "heavenlyStemCombinations.rules": ["甲己", "乙庚", "丙辛", "丁壬", "戊癸"],
  "branchSixCombinations.rules": ["子丑", "寅亥", "卯戌", "辰酉", "巳申", "午未"],
  "branchThreeCombinations.rules": ["申子辰", "亥卯未", "寅午戌", "巳酉丑"],
  "branchThreeMeetings.rules": ["寅卯辰", "巳午未", "申酉戌", "亥子丑"],
  "branchSixClashes.rules": ["子午", "丑未", "寅申", "卯酉", "辰戌", "巳亥"],
  "branchSixHarms.rules": ["子未", "丑午", "寅巳", "卯辰", "申亥", "酉戌"],
  "branchSixBreaks.rules": ["子酉", "丑辰", "寅亥", "卯午", "巳申", "未戌"],
};

const basicRuleCategories = new Set([
  "day_master",
  "month_order",
  "five_elements",
  "ten_gods",
  "strength",
  "personality",
  "career",
  "wealth",
  "relationship",
  "transit",
]);
const basicRuleConditionKeys = new Set([
  "dayStem",
  "monthBranch",
  "dayMasterSeasonalStatus",
  "elementCount",
  "tenGodCount",
  "tenGodGroupCount",
  "hasSelectedLuck",
  "hasSelectedYear",
]);
const basicRuleConfidence = new Set(["high", "medium", "low"]);
const basicRuleElements = new Set(["wood", "fire", "earth", "metal", "water"]);
const basicRuleTenGodGroups = new Set(["peer", "output", "wealth", "power", "resource"]);
const basicRuleCountOperators = new Set([">", ">=", "<", "<=", "=", "=="]);

const staleRootFiles = [
  ...Object.values(FILES).filter((fileName) => fileName !== FILES.index),
  "00-sources.json",
  "01-stems-branches.json",
  "02-five-elements.json",
  "03-ten-gods.json",
  "04-combinations-clashes.json",
  "05-twelve-growth-stages.json",
  "06-system-rules.json",
  "07-blind-bazi-cases.json",
  "08-strength-model.json",
  "07-盲派候选-blind-cases.json",
  "08-力量模型-strength-model.json",
  "09-格局用神-patterns-useful-gods.json",
  "10-神煞-stars-spirits.json",
  "11-盲派核心方法-blind-core-methods.json",
  "12-输出主题模板-output-templates.json",
  "14-案例库-case-studies.json",
  "15-AI分析模板-ai-prompts.json",
  "16-参考资料知识卡-reference-cards.json",
  "bazi-system-rules.json",
  "blind-bazi-cases.json",
  "gemini-code-1779699914160.json",
  "gemini-code-1779699919542.json",
  "gemini-code-1779699928438.json",
  "rules.json",
];

const deletedInactiveFiles = [
  "README_副本.md",
  "bazi_atomic_notes_v2.jsonl",
  "bazi_runtime_rules_v2.json",
  "bazi_blind_school_database_v2.json",
  "database_schema_postgres.sql",
  "legacy",
];

const deletedSourceFiles = [
  "07-盲派候选-blind-cases.json",
  "08-力量模型-strength-model.json",
  "09-格局用神-patterns-useful-gods.json",
  "10-神煞-stars-spirits.json",
  "11-盲派核心方法-blind-core-methods.json",
  "12-输出主题模板-output-templates.json",
  "14-案例库-case-studies.json",
  "15-AI分析模板-ai-prompts.json",
  "16-参考资料知识卡-reference-cards.json",
];

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readJSON(fileName) {
  return JSON.parse(await fs.readFile(path.join(sourceDir, fileName), "utf8"));
}

async function readRootJSON(fileName) {
  return JSON.parse(await fs.readFile(path.join(dataDir, fileName), "utf8"));
}

function fail(errors, message) {
  errors.push(message);
}

function pairKey(item) {
  if (Array.isArray(item)) return item.join("");
  if (item?.branches) return item.branches.join("");
  if (item?.stems) return item.stems.join("");
  if (item?.pair) return Array.isArray(item.pair) ? item.pair.join("") : item.pair;
  if (typeof item === "string") return item;
  return JSON.stringify(item);
}

function getByPath(object, dottedPath) {
  return dottedPath.split(".").reduce((value, key) => value?.[key], object);
}

function collectStatusObjects(value, pathName = "$", out = []) {
  if (!value || typeof value !== "object") return out;
  if (Array.isArray(value)) {
    value.forEach((item, index) => collectStatusObjects(item, `${pathName}[${index}]`, out));
    return out;
  }
  if (typeof value.status === "string") {
    out.push({ pathName, value });
  }
  for (const [key, child] of Object.entries(value)) {
    collectStatusObjects(child, `${pathName}.${key}`, out);
  }
  return out;
}

function validateBasicInterpretationRules(systemRules, errors) {
  const rules = systemRules.basicInterpretationRules;
  if (!Array.isArray(rules) || rules.length === 0) {
    fail(errors, `${FILES.systemRules} missing basicInterpretationRules`);
    return;
  }
  const seen = new Set();
  for (const rule of rules) {
    for (const key of ["id", "category", "condition", "title", "conclusion", "evidence", "reason", "displayOrder", "confidence", "sourceIds", "status"]) {
      if (rule[key] === undefined) fail(errors, `basic rule ${rule.id ?? "(missing id)"} missing ${key}`);
    }
    if (seen.has(rule.id)) fail(errors, `duplicate basic interpretation rule id ${rule.id}`);
    seen.add(rule.id);
    if (!basicRuleCategories.has(rule.category)) fail(errors, `basic rule ${rule.id} unknown category ${rule.category}`);
    if (!basicRuleConfidence.has(rule.confidence)) fail(errors, `basic rule ${rule.id} invalid confidence ${rule.confidence}`);
    if (!Number.isFinite(Number(rule.displayOrder))) fail(errors, `basic rule ${rule.id} displayOrder must be numeric`);
    validateBasicCondition(rule.id, rule.condition, errors);
  }
}

function validateBasicCondition(ruleId, condition, errors) {
  if (!condition || typeof condition !== "object" || Array.isArray(condition)) {
    fail(errors, `basic rule ${ruleId} condition must be an object`);
    return;
  }
  const keys = Object.keys(condition);
  if (!keys.length) fail(errors, `basic rule ${ruleId} condition must not be empty`);
  for (const key of keys) {
    if (!basicRuleConditionKeys.has(key)) fail(errors, `basic rule ${ruleId} unknown condition key ${key}`);
  }
  if (condition.elementCount) validateCountCondition(ruleId, "elementCount", condition.elementCount, "element", basicRuleElements, errors);
  if (condition.tenGodCount) validateCountCondition(ruleId, "tenGodCount", condition.tenGodCount, "name", null, errors);
  if (condition.tenGodGroupCount) validateCountCondition(ruleId, "tenGodGroupCount", condition.tenGodGroupCount, "group", basicRuleTenGodGroups, errors);
}

function validateCountCondition(ruleId, label, condition, targetKey, allowedTargets, errors) {
  const items = Array.isArray(condition) ? condition : [condition];
  for (const item of items) {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      fail(errors, `basic rule ${ruleId} ${label} must contain object condition(s)`);
      continue;
    }
    if (!item[targetKey]) fail(errors, `basic rule ${ruleId} ${label} missing ${targetKey}`);
    if (allowedTargets && !allowedTargets.has(item[targetKey])) fail(errors, `basic rule ${ruleId} ${label} invalid ${targetKey} ${item[targetKey]}`);
    if (!basicRuleCountOperators.has(item.operator)) fail(errors, `basic rule ${ruleId} ${label} invalid operator ${item.operator}`);
    if (!Number.isFinite(Number(item.value))) fail(errors, `basic rule ${ruleId} ${label} value must be numeric`);
  }
}

function validateSourceIds(fileName, data, sourceIds, errors) {
  for (const { pathName, value } of collectStatusObjects(data)) {
    if (value.status !== "active") continue;
    if (!Array.isArray(value.sourceIds) || value.sourceIds.length === 0) {
      fail(errors, `${fileName}${pathName}: active entry missing sourceIds`);
      continue;
    }
    for (const sourceId of value.sourceIds) {
      if (!sourceIds.has(sourceId)) {
        fail(errors, `${fileName}${pathName}: unknown sourceId ${sourceId}`);
      }
    }
  }
}

async function main() {
  const errors = [];
  const jsonFiles = (await fs.readdir(sourceDir))
    .filter((fileName) => fileName.endsWith(".json"))
    .sort();

  const parsed = {};
  for (const fileName of jsonFiles) {
    try {
      parsed[fileName] = await readJSON(fileName);
    } catch (error) {
      fail(errors, `${fileName}: invalid JSON: ${error.message}`);
    }
  }

  const index = await readRootJSON(FILES.index).catch((error) => {
    fail(errors, `${FILES.index}: invalid JSON: ${error.message}`);
    return null;
  });
  if (!index) {
    fail(errors, `${FILES.index} missing`);
  } else {
    if (index.runtimeBundle?.file !== bundleFile) fail(errors, `${FILES.index} missing runtimeBundle ${bundleFile}`);
    if (index.sourceDirectory !== "source/") fail(errors, `${FILES.index} sourceDirectory must be source/`);
    for (const dataset of index.datasets ?? []) {
      if (!dataset.bundleKey) fail(errors, `${FILES.index} dataset ${dataset.id} missing bundleKey`);
      if (!(await exists(path.join(dataDir, dataset.file)))) {
        fail(errors, `${FILES.index} references missing file ${dataset.file}`);
      }
    }
  }

  const bundle = await readRootJSON(bundleFile).catch((error) => {
    fail(errors, `${bundleFile}: invalid JSON: ${error.message}`);
    return null;
  });
  if (!bundle?.datasets) {
    fail(errors, `${bundleFile} missing datasets`);
  } else {
    const bundleKeys = new Set(Object.keys(bundle.datasets));
    for (const dataset of index?.datasets ?? []) {
      if (!bundleKeys.has(dataset.bundleKey)) fail(errors, `${bundleFile} missing bundle key ${dataset.bundleKey}`);
    }
    if (Object.keys(bundle.datasets).length !== 8) fail(errors, `${bundleFile} should contain only 8 core datasets`);
    if (bundle.datasets.systemRules?.rules?.length !== 674) fail(errors, `${bundleFile} systemRules should contain 674 rules`);
    if ((bundle.datasets.locations?.cities?.length ?? 0) < 1000) fail(errors, `${bundleFile} locations should contain full city list`);
  }

  const sources = parsed[FILES.sources];
  const sourceIds = new Set((sources?.sources ?? []).map((source) => source.id));
  if (!sourceIds.size) fail(errors, `${FILES.sources} has no sources`);

  for (const [fileName, data] of Object.entries(parsed)) {
    if (fileName === FILES.sources || fileName === FILES.index) continue;
    validateSourceIds(fileName, data, sourceIds, errors);
  }

  const basics = parsed[FILES.stemsBranches];
  if (!basics) {
    fail(errors, `${FILES.stemsBranches} missing`);
  } else {
    if (basics.heavenlyStems?.length !== 10) fail(errors, "heavenlyStems must contain 10 items");
    if (basics.earthlyBranches?.length !== 12) fail(errors, "earthlyBranches must contain 12 items");
    if (basics.sixtyJiaziCycle?.list?.length !== 60) fail(errors, "sixtyJiaziCycle.list must contain 60 items");
    const actualStems = new Set((basics.heavenlyStems ?? []).map((item) => item.stem));
    const actualBranches = new Set((basics.earthlyBranches ?? []).map((item) => item.branch));
    for (const stem of stems) if (!actualStems.has(stem)) fail(errors, `missing stem ${stem}`);
    for (const branch of branches) if (!actualBranches.has(branch)) fail(errors, `missing branch ${branch}`);
  }

  const tenGods = parsed[FILES.tenGods];
  if (!tenGods) {
    fail(errors, `${FILES.tenGods} missing`);
  } else {
    const matrix = tenGods.tenGodMatrix?.matrix ?? {};
    for (const row of stems) {
      if (!matrix[row]) fail(errors, `tenGodMatrix missing row ${row}`);
      for (const col of stems) {
        if (!matrix[row]?.[col]) fail(errors, `tenGodMatrix missing cell ${row}/${col}`);
      }
    }
  }

  const combos = parsed[FILES.combinations];
  if (!combos) {
    fail(errors, `${FILES.combinations} missing`);
  } else {
    for (const [pathName, expected] of Object.entries(expectedCombos)) {
      const actual = getByPath(combos, pathName) ?? [];
      const actualKeys = new Set(actual.map(pairKey));
      if (actual.length !== expected.length) {
        fail(errors, `${pathName} expected ${expected.length}, got ${actual.length}`);
      }
      for (const expectedKey of expected) {
        if (!actualKeys.has(expectedKey)) fail(errors, `${pathName} missing ${expectedKey}`);
      }
    }
    const supplementalCounts = {
      "stemBranchSelfCombinations.rules": 9,
      "stemBranchSelfCombinations.conditionalRules": 1,
      "branchHiddenCombinations.rules": 3,
      "branchHiddenCombinations.variantRules": 3,
      "remoteCombinations.stemRemoteRules": 5,
      "remoteCombinations.branchRemoteRules": 6,
      "archedCombinations.archThreeCombinationRules": 4,
      "archedCombinations.archThreeMeetingRules": 4,
    };
    for (const [pathName, expectedCount] of Object.entries(supplementalCounts)) {
      const actual = getByPath(combos, pathName);
      if (!Array.isArray(actual) || actual.length !== expectedCount) {
        fail(errors, `${pathName} expected ${expectedCount}, got ${actual?.length ?? "missing"}`);
      }
    }
  }

  const stages = parsed[FILES.twelveStages];
  if (!stages) {
    fail(errors, `${FILES.twelveStages} missing`);
  } else if (stages.rules?.length !== 120) {
    fail(errors, `twelve growth stage rules expected 120, got ${stages.rules?.length}`);
  }

  const systemRules = parsed[FILES.systemRules];
  if (!systemRules) {
    fail(errors, `${FILES.systemRules} missing`);
  } else {
    const seen = new Map();
    const supplementalCategories = new Set();
    for (const rule of systemRules.rules ?? []) {
      if (rule.category?.startsWith("stem_branch_") || [
        "branch_hidden_combination",
        "remote_combination",
        "arched_combination",
      ].includes(rule.category)) {
        supplementalCategories.add(rule.category);
      }
      if (rule.status !== "active") continue;
      if (seen.has(rule.id)) fail(errors, `duplicate active system rule id ${rule.id}`);
      seen.set(rule.id, true);
      for (const key of ["id", "category", "match", "domains", "interpretation", "display", "sourceIds", "evidenceLevel", "status"]) {
        if (rule[key] === undefined) fail(errors, `rule ${rule.id} missing ${key}`);
      }
    }
    for (const category of [
      "stem_branch_self_combination",
      "branch_hidden_combination",
      "remote_combination",
      "arched_combination",
    ]) {
      if (!supplementalCategories.has(category)) {
        fail(errors, `${FILES.systemRules} missing supplemental category ${category}`);
      }
    }
    validateBasicInterpretationRules(systemRules, errors);
  }

  for (const fileName of staleRootFiles) {
    if (await exists(path.join(dataDir, fileName))) {
      fail(errors, `source or stale file should not be in data root: ${fileName}`);
    }
  }

  for (const fileName of deletedSourceFiles) {
    if (await exists(path.join(sourceDir, fileName))) {
      fail(errors, `deleted source file should not remain: ${fileName}`);
    }
  }

  if (await exists(path.join(dataDir, "archive"))) {
    fail(errors, "archive directory should not remain after deleting inactive files");
  }

  for (const fileName of deletedInactiveFiles) {
    if (await exists(path.join(dataDir, fileName))) {
      fail(errors, `inactive file should not be in data root: ${fileName}`);
    }
  }

  if (errors.length) {
    console.error(`Bazi data validation failed with ${errors.length} issue(s):`);
    for (const error of errors) console.error(`- ${error}`);
    process.exitCode = 1;
    return;
  }

  console.log(`Bazi data validation passed (${jsonFiles.length} source JSON files + runtime bundle checked).`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
