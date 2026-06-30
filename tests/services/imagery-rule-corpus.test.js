import test from "node:test";
import assert from "node:assert/strict";

import {
  IMAGERY_METHODOLOGY_RULES,
  IMAGERY_RULES,
  IMAGERY_SOURCE_REGISTRY,
} from "../../js/generated/imageryRuleBundle.js";

test("规则库具备来源、总纲与首批核心规则", () => {
  assert.ok(IMAGERY_SOURCE_REGISTRY.length >= 5);
  assert.ok(IMAGERY_METHODOLOGY_RULES.length >= 20);
  assert.ok(IMAGERY_RULES.length >= 45);
});

test("规则ID唯一且用户侧规则具备条件和边界", () => {
  const ids = [...IMAGERY_METHODOLOGY_RULES, ...IMAGERY_RULES].map((item) => item.id);
  assert.equal(ids.length, new Set(ids).size);

  for (const rule of IMAGERY_RULES) {
    assert.ok(rule.title);
    assert.ok(Array.isArray(rule.requires));
    assert.ok(Array.isArray(rule.weakeningConditions));
    assert.ok(Array.isArray(rule.prohibitions));
    assert.ok(Array.isArray(rule.sourceRefs) && rule.sourceRefs.length > 0);
    if (rule.allowInUserAnswer !== false) {
      assert.ok(rule.prohibitions.length > 0, rule.id);
    }
  }
});

test("四本资料全部登记，未核读扫描资料不会冒充已提炼", () => {
  const ids = new Set(IMAGERY_SOURCE_REGISTRY.map((item) => item.id));
  for (const id of [
    "cui_blind_notes_5000",
    "yang_advanced_blind_notes",
    "cui_five_elements",
    "cui_advanced_2025",
  ]) {
    assert.ok(ids.has(id), id);
  }

  const pending = IMAGERY_SOURCE_REGISTRY.filter((item) => item.ingestionStatus.includes("pending"));
  assert.ok(pending.length >= 2);
});
