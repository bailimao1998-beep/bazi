import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildCoreSignals } from "./coreSignalsEngine.js";
import { coreSignalSampleCases, makeCoreSignalSampleReading } from "./coreSignalsEngine.sampleCases.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const requiredSections = [
  "dayMaster",
  "monthCommand",
  "elementSignals",
  "tenGodSignals",
  "relationSignals",
  "palaceSignals",
  "topicTags",
  "cautions",
];

for (const sample of coreSignalSampleCases) {
  test(`coreSignals sample ${sample.id} outputs the required structured sections`, () => {
    const coreSignals = buildCoreSignals(makeCoreSignalSampleReading(sample), loadBundleDatasets());

    for (const section of requiredSections) {
      assert.notEqual(coreSignals[section], undefined, `${sample.id} missing ${section}`);
    }
    assert.ok(Array.isArray(coreSignals.relationSignals), `${sample.id} relationSignals should be an array`);
    assert.equal(coreSignals.palaceSignals.length, 4, `${sample.id} should include four palace signals`);
    assert.ok(Array.isArray(coreSignals.topicTags), `${sample.id} topicTags should be an array`);
    assert.ok(Array.isArray(coreSignals.cautions), `${sample.id} cautions should be an array`);
    assertAllSignalsHaveMeta(coreSignals, sample.id);
  });
}

for (const sample of coreSignalSampleCases) {
  test(`coreSignals sample ${sample.id} keeps expected topic tags stable`, () => {
    const coreSignals = buildCoreSignals(makeCoreSignalSampleReading(sample), loadBundleDatasets());
    const topicTagNames = coreSignals.topicTags.map((item) => item.name);

    for (const expectedTag of sample.expectedTopicTags) {
      assert.ok(topicTagNames.includes(expectedTag), `${sample.id} should output ${expectedTag}`);
    }
  });
}

function assertAllSignalsHaveMeta(coreSignals, sampleId) {
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
    ...coreSignals.topicTags,
    ...(coreSignals.transitHooks ?? []),
    ...coreSignals.cautions,
  ];

  for (const [index, signal] of signalObjects.entries()) {
    assert.ok(Array.isArray(signal.evidence), `${sampleId} signal ${index} should include evidence array`);
    assert.ok(signal.evidence.length > 0, `${sampleId} signal ${index} should include non-empty evidence`);
    assert.ok(["high", "medium", "low"].includes(signal.confidence), `${sampleId} signal ${index} should include confidence`);
    assert.ok(Array.isArray(signal.needVerify), `${sampleId} signal ${index} should include needVerify array`);
    assert.ok(signal.needVerify.length > 0, `${sampleId} signal ${index} should include non-empty needVerify`);
  }
}

function loadBundleDatasets() {
  return JSON.parse(readFileSync(path.join(repoRoot, "data/bazi-data-bundle.json"), "utf8")).datasets;
}
