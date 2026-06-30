import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const panel = fs.readFileSync("js/ui/natal/natalImagePanel.js", "utf8");
const css = fs.readFileSync("styles/natal/natal.css", "utf8");

test("十二领域使用可折叠 details 且默认收起", () => {
  assert.match(panel, /<details\s+class="natal-domain-details"/);
  assert.match(panel, /<summary\s+class="natal-domain-subhead"/);
  assert.match(panel, /展开查看/);
  assert.match(panel, /收起/);

  const openingTag = panel.match(/<details\s+class="natal-domain-details"[^>]*>/)?.[0] || "";
  assert.ok(openingTag);
  assert.doesNotMatch(openingTag, /\bopen\b/);
});

test("十二领域折叠样式完整", () => {
  assert.match(css, /natal-domain-collapse-v8\.10\.5/);
  assert.match(css, /\.natal-domain-details\[open\]/);
  assert.match(css, /\.natal-domain-details-body/);
  assert.match(css, /\.natal-domain-toggle/);
});
