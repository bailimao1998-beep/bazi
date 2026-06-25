import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const luck = readFileSync(new URL("../styles/luck-flow.css", import.meta.url), "utf8");
const ym = readFileSync(new URL("../styles/year-month-flow.css", import.meta.url), "utf8");
const ai = readFileSync(new URL("../styles/ai.css", import.meta.url), "utf8");

test("stage cards use readable type and safe sizing", () => {
  assert.match(luck, /box-sizing:\s*border-box/);
  assert.match(luck, /font-size:\s*16px/);
  assert.match(luck, /\.luck-flow-detail-grid\s*\{[\s\S]*grid-template-columns:\s*1fr/);
  assert.match(ai, /overflow:\s*visible\s*!important/);
});

test("year and month steps use two-column readable layout", () => {
  assert.match(ym, /\.year-month-flow-step-row\s*\{[\s\S]*repeat\(2,\s*minmax\(0,\s*1fr\)\)/);
  assert.match(ym, /\.year-month-flow-card p,[\s\S]*font-size:\s*15px/);
  assert.match(ym, /\.year-month-flow-card::after\s*\{[\s\S]*display:\s*none/);
});
