import test from "node:test";
import assert from "node:assert/strict";

import { resolveNatalFacts } from "../js/core/natal/natalFactResolver.js";

test("same semantic group keeps pattern fact above stronger base fact", () => {
  const baseFact = {
    id: "base-1",
    semanticGroup: "same-group",
    factLevel: "base",
    score: 95,
    priority: 95,
    name: "基础事实",
    evidence: ["基础证据"],
  };

  const patternFact = {
    id: "pattern-1",
    semanticGroup: "same-group",
    factLevel: "pattern",
    score: 70,
    priority: 70,
    name: "高阶结构",
    evidence: ["结构证据"],
  };

  const result = resolveNatalFacts([
    baseFact,
    patternFact,
  ]);

  assert.equal(result.facts.length, 1);
  assert.equal(result.facts[0].id, "pattern-1");
  assert.equal(result.facts[0].factLevel, "pattern");
  assert.deepEqual(result.facts[0].evidence.map((item) => item.text), ["结构证据", "基础证据"]);
  assert.ok(result.suppressedFacts.some((fact) => fact.id === "base-1"));
});
