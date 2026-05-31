import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { analyzeBirth } from "./readingEngine.js";
import { buildLearningInterpretations } from "./learningInterpretationEngine.js";

const FORBIDDEN_TEXT = /(一定|必定|绝对|必然)/;

function loadDatasets() {
  const bundle = JSON.parse(fs.readFileSync("data/bazi-data-bundle.json", "utf8"));
  return bundle.datasets;
}

test("builds safe learning interpretations for the Dingzhou sample", () => {
  const datasets = loadDatasets();
  const reading = analyzeBirth({
    date: "1998-09-11",
    time: "00:30",
    birthplace: "河北定州",
    gender: "male",
    selectedYear: 2026,
    selectedMonth: 5,
  }, datasets);

  const result = buildLearningInterpretations(reading, datasets);

  assert.ok(result.learningInterpretations.length > 0);
  for (const item of result.learningInterpretations) {
    assert.ok(item.reason, `${item.id} should include reason`);
    assert.ok(item.learningLogic, `${item.id} should include learningLogic`);
    assert.ok(item.plainExplanation, `${item.id} should include plainExplanation`);
    assert.ok(Array.isArray(item.uncertaintyFactors), `${item.id} should include uncertaintyFactors`);
    assert.ok(item.uncertaintyFactors.length > 0, `${item.id} should include non-empty uncertaintyFactors`);
  }

  assert.deepEqual(Object.keys(result.grouped), [
    "structure",
    "tenGods",
    "branchRelations",
    "blindCandidates",
    "strengthUsefulGods",
    "luckFlow",
    "cases",
  ]);
  assert.ok(Array.isArray(result.grouped.cases));
  assert.doesNotMatch(JSON.stringify(result), FORBIDDEN_TEXT);
});
