import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import { analyzeBirth } from "./readingEngine.js";
import { buildCoreSignals } from "./coreSignalsEngine.js";

const FORBIDDEN_TEXT = /(一定|必定|绝对|必然|必离婚|必发财|必有灾|必坐牢|必死亡)/;
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const signalRuleFiles = [
  "ten-god-signal-rules.json",
  "element-signal-rules.json",
  "relation-signal-rules.json",
  "palace-signal-rules.json",
  "topic-tag-rules.json",
];
const requiredRuleFields = [
  "id",
  "category",
  "name",
  "conditions",
  "outputs",
  "evidenceTemplate",
  "confidence",
  "needVerify",
  "sourceRefs",
  "status",
];

function makeReading() {
  return analyzeBirth({
    date: "1998-09-11",
    time: "00:30",
    birthplace: "北京",
    gender: "male",
    selectedYear: 2026,
    selectedMonth: 5,
  });
}

test("builds structured core signals from natal chart and basic display", () => {
  const reading = makeReading();
  const datasets = loadBundleDatasets();
  const coreSignals = buildCoreSignals(reading, datasets);

  assert.deepEqual(Object.keys(coreSignals), [
    "dayMaster",
    "monthCommand",
    "elementSignals",
    "tenGodSignals",
    "relationSignals",
    "palaceSignals",
    "strengthSignals",
    "rootingSignals",
    "topicTags",
    "transitHooks",
    "cautions",
  ]);

  assert.equal(coreSignals.dayMaster.stem, "辛");
  assert.equal(coreSignals.dayMaster.element, "metal");
  assert.equal(coreSignals.dayMaster.label, "辛金日主");
  assert.equal(coreSignals.monthCommand.branch, "酉");
  assert.equal(coreSignals.monthCommand.element, "metal");
  assert.equal(coreSignals.monthCommand.label, "酉金月令");

  assert.deepEqual(coreSignals.elementSignals.strong.map((item) => item.element), ["metal", "wood"]);
  assert.ok(coreSignals.elementSignals.strong.length <= 2);
  assert.ok(coreSignals.elementSignals.weak.length <= 2);
  assert.deepEqual(coreSignals.elementSignals.missingVisible.map((item) => item.element), ["fire"]);

  assert.ok(coreSignals.tenGodSignals.strong.length <= 3);
  assert.equal(coreSignals.tenGodSignals.strong[0].name, "比肩");
  assert.equal(coreSignals.tenGodSignals.groups.resource.label, "印星");
  assert.equal(coreSignals.tenGodSignals.groups.output.label, "食伤");
  assert.equal(coreSignals.tenGodSignals.groups.wealth.label, "财星");
  assert.equal(coreSignals.tenGodSignals.groups.authority.label, "官杀");
  assert.equal(coreSignals.tenGodSignals.groups.peer.label, "比劫");

  assert.ok(coreSignals.relationSignals.length <= 5);
  assert.ok(coreSignals.relationSignals.some((item) => item.type === "地支六破" && item.members.includes("子") && item.members.includes("酉")));
  assert.equal(
    coreSignals.relationSignals.filter((item) => item.type === "地支六破" && item.members.join("/") === "子/酉").length,
    1,
  );
  assert.ok(coreSignals.relationSignals.every((item) => Array.isArray(item.meaningKeywords) && item.meaningKeywords.length > 0));

  assert.deepEqual(
    coreSignals.palaceSignals.map((item) => item.pillarKey),
    ["year", "month", "day", "hour"],
  );
  assert.ok(coreSignals.palaceSignals.some((item) => item.stemTenGod === "正印" && item.pillarLabel === "年柱"));

  assert.ok(coreSignals.strengthSignals.some((item) => item.type === "得令" && item.target === "日主"));
  assert.ok(coreSignals.strengthSignals.some((item) => item.type === "得生" && item.target === "日主"));
  assert.ok(coreSignals.strengthSignals.some((item) => item.type === "得助" && item.target === "日主"));
  assert.ok(coreSignals.strengthSignals.some((item) => item.type === "有根" && item.target === "日主"));
  assert.ok(coreSignals.strengthSignals.some((item) => item.type === "被泄" && item.target === "日主"));
  assert.ok(coreSignals.strengthSignals.some((item) => item.type === "被耗" && item.target === "日主"));
  assert.ok(coreSignals.strengthSignals.some((item) => item.type === "透干" && item.target === "正印"));
  assert.ok(coreSignals.strengthSignals.some((item) => item.type === "藏支" && item.target === "正官"));
  assert.ok(coreSignals.strengthSignals.some((item) => item.type === "受关系影响" && item.target === "比肩"));

  assert.ok(coreSignals.rootingSignals.some((item) => item.type === "天干透出" && item.target === "正印"));
  assert.ok(coreSignals.rootingSignals.some((item) => item.type === "地支主气" && item.target === "食神"));
  assert.ok(coreSignals.rootingSignals.some((item) => item.type === "藏干" && item.target === "正官"));
  assert.ok(coreSignals.rootingSignals.some((item) => item.type === "有根" && item.target === "比肩"));
  assert.ok(coreSignals.rootingSignals.some((item) => item.type === "藏而不透" && item.target === "食神"));
  assert.ok(coreSignals.rootingSignals.some((item) => item.type === "透而无根"));
  assertCoreSignalRows(coreSignals.strengthSignals);
  assertCoreSignalRows(coreSignals.rootingSignals);

  assert.ok(coreSignals.topicTags.some((item) => item.name === "学习资源明显"));
  assert.ok(coreSignals.topicTags.some((item) => item.name === "关系有破"));
  assert.ok(coreSignals.topicTags.some((item) => item.name === "需要结合大运验证"));

  assert.ok(coreSignals.transitHooks.some((item) => item.name.includes("子酉")));
  assert.ok(coreSignals.transitHooks.some((item) => item.name.includes("印星")));

  assert.deepEqual(
    coreSignals.cautions.map((item) => item.name),
    ["出生时间", "节气边界", "真太阳时", "晚子时", "旺衰未定", "需要大运流年验证"],
  );

  assertAllSignalsHaveMeta(coreSignals);
  assert.doesNotMatch(JSON.stringify(coreSignals), FORBIDDEN_TEXT);
});

test("accepts natal and explicit basic display without requiring the full reading object", () => {
  const reading = makeReading();
  const coreSignals = buildCoreSignals(reading.natal, reading.natal.basicBaziDisplay);

  assert.equal(coreSignals.dayMaster.stem, reading.natal.pillars.day.stem);
  assert.equal(coreSignals.monthCommand.branch, reading.natal.pillars.month.branch);
  assert.ok(coreSignals.relationSignals.length > 0);
});

test("coreSignals exposes the acceptance JSON contract", () => {
  const coreSignals = buildCoreSignals(makeReading(), loadBundleDatasets());

  assert.ok(coreSignals, "coreSignals should exist");
  assert.deepEqual(Object.keys(coreSignals.tenGodSignals.groups), ["resource", "output", "wealth", "authority", "peer"]);
  assert.ok(Array.isArray(coreSignals.elementSignals.strong));
  assert.ok(Array.isArray(coreSignals.elementSignals.weak));
  assert.ok(Array.isArray(coreSignals.elementSignals.missingVisible));
  assert.ok(Array.isArray(coreSignals.strengthSignals));
  assert.ok(Array.isArray(coreSignals.rootingSignals));
  assert.ok(coreSignals.relationSignals.length <= 5);
  assert.ok(Array.isArray(coreSignals.topicTags));
  assert.ok(Array.isArray(coreSignals.cautions));
  assertAllSignalsHaveMeta(coreSignals);
});

test("all data-driven core signal rules expose the required schema", async () => {
  for (const file of signalRuleFiles) {
    const data = JSON.parse(await fs.readFile(path.join(repoRoot, "data/source", file), "utf8"));
    assert.ok(Array.isArray(data.rules), `${file} should expose rules[]`);
    assert.ok(data.rules.length > 0, `${file} should include at least one rule`);

    for (const rule of data.rules) {
      for (const field of requiredRuleFields) {
        assert.notEqual(rule[field], undefined, `${file} rule ${rule.id ?? "(missing id)"} missing ${field}`);
      }
      assert.equal(Array.isArray(rule.needVerify), true, `${file} rule ${rule.id} needVerify should be an array`);
      assert.equal(Array.isArray(rule.sourceRefs), true, `${file} rule ${rule.id} sourceRefs should be an array`);
      assert.doesNotMatch(JSON.stringify(rule), FORBIDDEN_TEXT);
    }
  }
});

test("uses injected data rules to add structured topic tags", () => {
  const reading = makeReading();
  const coreSignals = buildCoreSignals(reading, {
    topicTagRules: {
      rules: [
        {
          id: "test-peer-topic-tag",
          category: "topicTags",
          name: "测试比劫标签",
          conditions: { tenGodGroupCount: { group: "peer", operator: ">=", value: 1 } },
          outputs: { name: "测试比劫标签" },
          evidenceTemplate: "比劫计数：{count}",
          confidence: "high",
          needVerify: ["测试规则复核"],
          sourceRefs: [{ sourceId: "ten-gods" }],
          status: "active",
        },
      ],
    },
  });

  assert.ok(coreSignals.topicTags.some((item) => item.name === "测试比劫标签"));
});

test("adds output-weak topic tag when food-hurting signals are not prominent", () => {
  const reading = makeReading();
  const natal = structuredClone(reading.natal);
  natal.coreChart.tenGodCounts = { 比肩: 4, 正印: 2, 正财: 1 };
  natal.basicBaziDisplay.tenGods.stats.fullHidden = { 比肩: 2, 正印: 1 };
  natal.basicBaziDisplay.tenGods.stats.mainQi = { 比肩: 2 };
  natal.basicBaziDisplay.tenGods.heavenlyStems = natal.basicBaziDisplay.tenGods.heavenlyStems.filter((item) => item.tenGod !== "食神");
  natal.basicBaziDisplay.tenGods.branchMain = natal.basicBaziDisplay.tenGods.branchMain.filter((item) => item.tenGod !== "食神");

  const coreSignals = buildCoreSignals(natal);

  assert.ok(coreSignals.topicTags.some((item) => item.name === "表达输出偏弱"));
});

test("global core signals engine exposes the same build function", async () => {
  const source = await fs.readFile(new URL("./coreSignalsEngine.global.js", import.meta.url), "utf8");
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(source, context);

  assert.equal(typeof context.window.BaziCoreSignals.buildCoreSignals, "function");
  const reading = makeReading();
  const coreSignals = context.window.BaziCoreSignals.buildCoreSignals(reading);
  assert.equal(coreSignals.dayMaster.label, "辛金日主");
  assert.ok(coreSignals.relationSignals.some((item) => item.type === "地支六破"));
});

function assertAllSignalsHaveMeta(coreSignals) {
  const signalObjects = [
    coreSignals.dayMaster,
    coreSignals.monthCommand,
    coreSignals.elementSignals,
    ...coreSignals.elementSignals.strong,
    ...coreSignals.elementSignals.weak,
    ...coreSignals.elementSignals.missingVisible,
    coreSignals.tenGodSignals,
    ...coreSignals.tenGodSignals.strong,
    ...coreSignals.tenGodSignals.weak,
    ...Object.values(coreSignals.tenGodSignals.groups),
    ...coreSignals.relationSignals,
    ...coreSignals.palaceSignals,
    ...coreSignals.strengthSignals,
    ...coreSignals.rootingSignals,
    ...coreSignals.topicTags,
    ...coreSignals.transitHooks,
    ...coreSignals.cautions,
  ];

  for (const [index, signal] of signalObjects.entries()) {
    assert.ok(Array.isArray(signal.evidence), `signal ${index} should include evidence array`);
    assert.ok(signal.evidence.length > 0, `signal ${index} should include non-empty evidence`);
    assert.ok(["high", "medium", "low"].includes(signal.confidence), `signal ${index} should include confidence`);
    assert.ok(Array.isArray(signal.needVerify), `signal ${index} should include needVerify array`);
    assert.ok(signal.needVerify.length > 0, `signal ${index} should include non-empty needVerify`);
  }
}

function assertCoreSignalRows(signals) {
  for (const signal of signals) {
    assert.equal(typeof signal.name, "string");
    assert.ok(signal.name.length > 0);
    assert.equal(typeof signal.type, "string");
    assert.ok(signal.type.length > 0);
    assert.equal(typeof signal.target, "string");
    assert.ok(signal.target.length > 0);
    assert.ok(Array.isArray(signal.evidence));
    assert.ok(signal.evidence.length > 0);
    assert.ok(["high", "medium", "low"].includes(signal.confidence));
    assert.ok(Array.isArray(signal.needVerify));
    assert.ok(signal.needVerify.length > 0);
  }
}

function loadBundleDatasets() {
  return JSON.parse(readFileSync(path.join(repoRoot, "data/bazi-data-bundle.json"), "utf8")).datasets;
}
