import { readFileSync } from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";

import { calculateBazi } from "../js/core/bazi/calculateBazi.js";
import {
  STORAGE_BRANCH_CONFIG,
  TWELVE_GROWTH_MATRIX,
  VOID_BRANCHES_BY_DECADE,
  resolveGrowthStage,
  resolveVoidBranches,
} from "../js/core/bazi/specialStateTables.js";

import {
  STORAGE_BRANCH_CONFIG as natalStorageConfig,
  TWELVE_GROWTH_MATRIX as natalGrowthMatrix,
  VOID_BRANCHES_BY_DECADE as natalVoidTable,
} from "../js/core/natal/config/specialStateTables.js";

test("special-state tables use one shared source", () => {
  assert.equal(natalStorageConfig, STORAGE_BRANCH_CONFIG);
  assert.equal(natalGrowthMatrix, TWELVE_GROWTH_MATRIX);
  assert.equal(natalVoidTable, VOID_BRANCHES_BY_DECADE);
});

test("shared resolvers return known results", () => {
  assert.deepEqual(resolveVoidBranches("甲", "子"), ["戌", "亥"]);
  assert.equal(resolveGrowthStage("甲", "亥"), "长生");
  assert.equal(resolveGrowthStage("辛", "酉"), "临官");
});

test("calculateBazi consumes the shared special-state source", () => {
  const chart = calculateBazi({
    birthDate: "1998-09-11",
    birthTime: "00:30",
    gender: "male",
  });

  for (const key of ["year", "month", "day", "hour"]) {
    const pillar = chart.pillars[key];
    const detail = chart.pillarDetails[key];

    assert.equal(
      detail.twelveGrowth,
      resolveGrowthStage(chart.dayMaster.stem, pillar.branch),
    );
    assert.deepEqual(
      detail.voidBranches,
      resolveVoidBranches(pillar.stem, pillar.branch),
    );
  }

  const source = readFileSync("js/core/bazi/calculateBazi.js", "utf8");
  assert.match(source, /from "\.\/specialStateTables\.js"/);
  assert.doesNotMatch(source, /const voidBranchesByDecade\s*=/);
  assert.doesNotMatch(source, /const twelveStageMatrix\s*=/);
});
