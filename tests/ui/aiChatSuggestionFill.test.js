import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const panelPath = path.resolve(here, "../../js/ui/chat/aiChatPanel.js");
const source = fs.readFileSync(panelPath, "utf8");

test("建议问题只填入输入框，不直接调用问答", () => {
  assert.match(source, /textarea\.value = question/);
  assert.match(source, /textarea\.focus\(\)/);
  assert.doesNotMatch(source, /ask\?\.\(question\)/);
});

test("界面明确提示确认后再发送", () => {
  assert.match(source, /填入输入框/);
  assert.match(source, /继续修改/);
});
