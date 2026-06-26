import { renderAiText } from "./aiTextRenderer.js";
import {
  buildFollowUpQuestions,
  buildStarterQuestions,
} from "../core/ai/chatSuggestionEngine.js";

export function renderAiChatPanel(root, payload = {}, actions = {}) {
  if (!root) return;

  const state = payload.state ?? {};
  const hasReport = Boolean(payload.hasReport);
  const allMessages = Array.isArray(state.messages) ? state.messages : [];
  const messages = allMessages.slice(-5);
  const disabled = state.loading || !hasReport;
  const hasMessages = messages.length > 0;
  const chartContext = payload.chartContext ?? {};
  const starterQuestions = buildStarterQuestions(chartContext, 8);
  const followUpQuestions = buildFollowUpQuestions({
    messages: allMessages,
    chartContext,
    limit: 4,
  });

  root.innerHTML = `
    <section class="ai-chat-shell ai-chat-chatmode">
      <div class="ai-chat-compact-head">
        <div>
          <h2>AI 问答</h2>
          <span>${hasReport ? "点一下问题会放到输入框，确认或修改后再发送" : "请先完成基础排盘与取象"}</span>
        </div>
        <b>${messages.length ? `${messages.length} 条记录` : "待提问"}</b>
      </div>

      ${!hasMessages ? renderSuggestionBlock({
        title: "大家常问",
        hint: "点一下放入输入框，可继续修改",
        questions: starterQuestions,
        disabled,
        className: "is-starter",
      }) : ""}

      <section class="ai-chat-history-section">
        ${
          messages.length
            ? `<div class="ai-chat-history">${messages.map(renderMessage).join("")}</div>`
            : `<div class="ai-chat-empty">还没有问答记录。可以点上面的常见问题放入输入框，也可以自己输入。</div>`
        }
      </section>

      ${hasMessages && followUpQuestions.length ? renderSuggestionBlock({
        title: "接着问",
        hint: "点一下放入输入框，确认后再发送",
        questions: followUpQuestions,
        disabled,
        className: "is-follow-up",
      }) : ""}

      ${state.loading ? `<div class="ai-chat-loading">AI 正在整理命盘依据和回答...</div>` : ""}
      ${state.error ? `<p class="error-text">${escapeHtml(state.error)}</p>` : ""}

      <form data-ai-chat-form class="ai-chat-form ai-chat-composer chatgpt-composer">
        <div class="chatgpt-input-shell">
          <textarea
            data-ai-chat-question
            name="question"
            rows="2"
            placeholder="也可以自己输入想问的问题……"
            ${disabled ? "disabled" : ""}
          >${escapeHtml(state.question || "")}</textarea>

          <button type="submit" class="chatgpt-send-button" ${disabled ? "disabled" : ""} aria-label="发送问题">
            ${state.loading ? "…" : "↑"}
          </button>
        </div>

        <div class="chatgpt-composer-hint">
          回答会说明命盘依据、可能表现和现实建议。
        </div>
      </form>
    </section>
  `;

  const ask = payload.onAsk ?? actions.onAsk;

  root.querySelector?.("[data-ai-chat-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = root.querySelector?.("[data-ai-chat-question]")?.value ?? "";
    ask?.(value);
  });

  root.querySelectorAll?.("[data-ai-chat-suggestion]").forEach((button) => {
    button.addEventListener("click", () => {
      const question = button.dataset.aiChatSuggestion || "";
      const textarea = root.querySelector?.("[data-ai-chat-question]");
      if (!question || disabled || !textarea) return;

      textarea.value = question;
      textarea.dispatchEvent(new Event("input", { bubbles: true }));
      textarea.focus();
      textarea.setSelectionRange?.(question.length, question.length);
      textarea.closest?.(".chatgpt-input-shell")?.classList.add("is-suggestion-filled");

      globalThis.setTimeout?.(() => {
        textarea.closest?.(".chatgpt-input-shell")?.classList.remove("is-suggestion-filled");
      }, 700);
    });
  });
}

function renderSuggestionBlock({
  title,
  hint,
  questions = [],
  disabled = false,
  className = "",
} = {}) {
  if (!questions.length) return "";
  return `
    <section class="ai-chat-question-shelf ${escapeHtml(className)}">
      <header>
        <strong>${escapeHtml(title || "建议问题")}</strong>
        <span>${escapeHtml(hint || "")}</span>
      </header>
      <div class="ai-chat-question-list">
        ${questions.map((item) => `
          <button
            type="button"
            class="ai-chat-suggestion"
            data-ai-chat-suggestion="${escapeHtml(item)}"
            ${disabled ? "disabled" : ""}
          >
            ${escapeHtml(item)}
          </button>
        `).join("")}
      </div>
    </section>
  `;
}

function renderMessage(message = {}) {
  return `
    <article class="ai-chat-message chat-style-message">
      <div class="ai-chat-question user-bubble">
        <span>问</span>
        <strong>${escapeHtml(message.question || "问题")}</strong>
      </div>

      <div class="ai-chat-answer ai-bubble">
        <div class="ai-chat-answer-head">
          <b>AI 分析</b>
          <span>答</span>
        </div>
        ${renderAiText(message.answer || "", { className: "ai-chat-answer-output", promoteSummary: true })}
      </div>
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
