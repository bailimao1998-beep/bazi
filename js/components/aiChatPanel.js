import { renderAiText } from "./aiTextRenderer.js";

export function renderAiChatPanel(root, payload = {}, actions = {}) {
  if (!root) return;
  const state = payload.state ?? {};
  const hasReport = Boolean(payload.hasReport);
  const messages = Array.isArray(state.messages) ? state.messages.slice(-3) : [];
  root.innerHTML = `
    <div class="plugin-header">
      <h2>AI 问答</h2>
    </div>
    <p class="muted">基于当前页面已有排盘与取象提问。</p>
    <form data-ai-chat-form class="ai-chat-form">
      <label>
        <span>问题</span>
        <textarea data-ai-chat-question name="question" rows="3" placeholder="请输入一个基于当前命盘的问题" ${state.loading || !hasReport ? "disabled" : ""}>${escapeHtml(state.question || "")}</textarea>
      </label>
      <div class="form-actions">
        <button type="submit" ${state.loading || !hasReport ? "disabled" : ""}>${state.loading ? "回答中..." : "提问"}</button>
        <span class="muted">${hasReport ? "回答只引用当前页面已有证据。" : "请先完成基础排盘与取象。"}</span>
      </div>
    </form>
    ${state.loading ? `<p class="muted">正在回答...</p>` : ""}
    ${state.error ? `<p class="error-text">${escapeHtml(state.error)}</p>` : ""}
    <section class="base-bazi-section">
      <div class="board-title"><h3>最近 3 条</h3><span>${messages.length} 条</span></div>
      ${messages.length ? `<div class="ai-chat-history">${messages.map(renderMessage).join("")}</div>` : `<p class="muted">暂无问答记录。</p>`}
    </section>
  `;

  root.querySelector?.("[data-ai-chat-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = root.querySelector?.("[data-ai-chat-question]")?.value ?? "";
    (payload.onAsk ?? actions.onAsk)?.(value);
  });
}

function renderMessage(message = {}) {
  return `
    <article class="ai-chat-message">
      <div class="ai-chat-question"><span>问</span><strong>${escapeHtml(message.question || "问题")}</strong></div>
      <div class="ai-chat-answer">${renderAiText(message.answer || "", { className: "ai-chat-answer-output" })}</div>
    </article>
  `;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
