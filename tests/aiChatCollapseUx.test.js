import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const source = await readFile(new URL("../js/app/aiChatDrawerUx.js", import.meta.url), "utf8");
const css = await readFile(new URL("../styles/ai-chat-collapse-ux.css", import.meta.url), "utf8");

test("AI问答支持标题、Esc和页面空白收起", () => {
  assert.match(source, /header\.addEventListener\("click"/);
  assert.match(source, /event\.key !== "Escape"/);
  assert.match(source, /document\.addEventListener\("pointerdown"/);
});

test("收起时保留未发送草稿", () => {
  assert.match(source, /sessionStorage\.setItem\(DRAFT_KEY/);
  assert.match(source, /restoreDraft/);
  assert.match(source, /clearDraft/);
});

test("关闭按钮改为更明确的收起操作", () => {
  assert.match(source, /closeButton\.textContent = "收起"/);
  assert.match(css, /#aiChatClose/);
});
