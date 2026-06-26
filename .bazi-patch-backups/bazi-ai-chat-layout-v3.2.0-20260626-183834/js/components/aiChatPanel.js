import { renderAiText } from "./aiTextRenderer.js";
import {
  buildFollowUpQuestions,
  buildStarterQuestions,
} from "../core/ai/chatSuggestionEngine.js";

const AI_CHAT_READING_V3 = true;
const AI_CHAT_REFINEMENT_V31 = true;
const AI_CHAT_REFINEMENT_V311 = true;
const aiChatDismissBoundRoots = new WeakSet();

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
  const primaryStarterQuestions = starterQuestions.slice(0, 4);
  const moreStarterQuestions = starterQuestions.slice(4);
  const followUpQuestions = buildFollowUpQuestions({
    messages: allMessages,
    chartContext,
    limit: 4,
  });
  const contextLabel = buildChatContextLabel(chartContext);

  root.innerHTML = `
    <section class="ai-chat-shell ai-chat-chatmode ai-chat-reading-v3">
      <header class="ai-chat-context-bar">
        <div class="ai-chat-context-icon" aria-hidden="true">✦</div>
        <div class="ai-chat-context-copy">
          <span>当前解读范围</span>
          <strong>${escapeHtml(contextLabel)}</strong>
        </div>
        <b class="ai-chat-record-count">${messages.length ? `${messages.length} 条对话` : "新对话"}</b>
      </header>

      ${!hasMessages ? renderSuggestionBlock({
        title: "从一个方向开始",
        hint: "点击问题会填入输入框，你可以继续修改",
        questions: primaryStarterQuestions,
        moreQuestions: moreStarterQuestions,
        disabled,
        className: "is-starter",
      }) : ""}

      <section class="ai-chat-history-section">
        ${
          messages.length
            ? `<div class="ai-chat-history">${messages.map((message, index) => renderMessage(message, index)).join("")}</div>`
            : renderEmptyState(hasReport)
        }
      </section>

      ${hasMessages && followUpQuestions.length ? renderSuggestionBlock({
        eyebrow: "追加提问",
        title: "顺着当前结果继续问",
        hint: "选一个追问，或在下方输入自己的问题",
        questions: followUpQuestions,
        disabled,
        className: "is-follow-up",
        collapsible: true,
        defaultOpen: false,
      }) : ""}

      ${state.loading ? `
        <div class="ai-chat-loading" role="status">
          <span class="ai-chat-loading-dot"></span>
          <span>正在整理命盘依据与现实落点……</span>
        </div>
      ` : ""}
      ${state.error ? `<p class="error-text ai-chat-error">${escapeHtml(state.error)}</p>` : ""}

      <form data-ai-chat-form class="ai-chat-form ai-chat-composer chatgpt-composer">
        <div class="chatgpt-input-shell">
          <textarea
            data-ai-chat-question
            name="question"
            rows="2"
            placeholder="结合当前命盘，输入你真正想问的问题……"
            ${disabled ? "disabled" : ""}
          >${escapeHtml(state.question || "")}</textarea>

          <button type="submit" class="chatgpt-send-button" ${disabled ? "disabled" : ""} aria-label="发送问题">
            ${state.loading ? `<span class="ai-chat-stop-mark">■</span>` : `<span aria-hidden="true">↑</span>`}
          </button>
        </div>

        <div class="chatgpt-composer-meta">
          <span>${hasReport ? `基于：${escapeHtml(contextLabel)}` : "请先完成基础排盘与取象"}</span>
          <small>Enter 发送 · Shift + Enter 换行</small>
        </div>
      </form>
    </section>
  `;

  const ask = payload.onAsk ?? actions.onAsk;
  const textarea = root.querySelector?.("[data-ai-chat-question]");
  const form = root.querySelector?.("[data-ai-chat-form]");

  const resizeTextarea = () => {
    if (!textarea) return;

    textarea.style.height = "auto";

    // 空输入框保持紧凑，把更多高度留给中间的 AI 解读正文。
    if (!textarea.value.trim()) {
      textarea.style.height = "52px";
      return;
    }

    textarea.style.height = `${Math.min(textarea.scrollHeight, 144)}px`;
  };

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = textarea?.value ?? "";
    ask?.(value);
  });

  textarea?.addEventListener("input", resizeTextarea);
  textarea?.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" || event.shiftKey || event.isComposing) return;
    event.preventDefault();
    form?.requestSubmit?.();
  });
  resizeTextarea();

  root.querySelectorAll?.("[data-ai-chat-suggestion]").forEach((button) => {
    button.addEventListener("click", () => {
      const question = button.dataset.aiChatSuggestion || "";
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

  root.querySelectorAll?.("[data-ai-copy-answer]").forEach((button) => {
    button.addEventListener("click", async () => {
      const index = Number(button.dataset.aiCopyAnswer);
      const answer = messages[index]?.answer || "";
      if (!answer) return;

      const copied = await copyText(answer);
      if (!copied) return;

      const original = button.textContent;
      button.textContent = "已复制";
      button.classList.add("is-success");
      globalThis.setTimeout?.(() => {
        button.textContent = original;
        button.classList.remove("is-success");
      }, 1200);
    });
  });

  root.querySelectorAll?.("[data-ai-reuse-question]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.aiReuseQuestion);
      const question = messages[index]?.question || "";
      if (!question || disabled || !textarea) return;
      textarea.value = question;
      textarea.dispatchEvent(new Event("input", { bubbles: true }));
      textarea.focus();
      textarea.setSelectionRange?.(question.length, question.length);
    });
  });

  bindAiChatDismissInteractions(root);
}

function bindAiChatDismissInteractions(root) {
  if (!root || aiChatDismissBoundRoots.has(root)) return;
  const drawer = root.closest?.("#aiChatDrawer");
  const toggle = document.querySelector("#aiChatToggle");
  const closeButton = document.querySelector("#aiChatClose");
  if (!drawer || !closeButton) return;
  aiChatDismissBoundRoots.add(root);
  closeButton.setAttribute("title", "关闭 AI 问答（Esc）");
  closeButton.setAttribute("aria-keyshortcuts", "Escape");
  const closeDrawer = () => closeButton.click();
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || drawer.hidden) return;
    event.preventDefault();
    closeDrawer();
  });
  document.addEventListener("pointerdown", (event) => {
    if (drawer.hidden) return;
    const target = event.target;
    if (!target) return;
    if (drawer.contains(target) || toggle?.contains(target)) return;
    closeDrawer();
  });
}

function renderSuggestionBlock({
  eyebrow = "推荐提问",
  title,
  hint,
  questions = [],
  moreQuestions = [],
  disabled = false,
  className = "",
  collapsible = false,
  defaultOpen = false,
} = {}) {
  if (!questions.length && !moreQuestions.length) return "";
  const questionContent = `
    <div class="ai-chat-question-list">
      ${questions.map((item) => renderSuggestionButton(item, disabled)).join("")}
    </div>
    ${moreQuestions.length ? `
      <details class="ai-chat-more-questions">
        <summary>查看更多问题 <span>${moreQuestions.length}</span></summary>
        <div class="ai-chat-question-list is-more">
          ${moreQuestions.map((item) => renderSuggestionButton(item, disabled)).join("")}
        </div>
      </details>
    ` : ""}
  `;
  if (collapsible) {
    return `
      <details class="ai-chat-question-shelf ${escapeHtml(className)} is-collapsible" ${defaultOpen ? "open" : ""}>
        <summary>
          <div class="ai-chat-question-shelf-summary-copy">
            <span>${escapeHtml(eyebrow)}</span>
            <strong>${escapeHtml(title || "建议问题")}</strong>
          </div>
          <div class="ai-chat-question-shelf-summary-side">
            <small>${escapeHtml(hint || "")}</small>
            <b class="ai-chat-question-shelf-toggle">
              <span class="when-open">收起</span>
              <span class="when-closed">展开</span>
              <i aria-hidden="true">⌃</i>
            </b>
          </div>
        </summary>
        <div class="ai-chat-question-shelf-body">${questionContent}</div>
      </details>
    `;
  }
  return `
    <section class="ai-chat-question-shelf ${escapeHtml(className)}">
      <header>
        <div>
          <span>${escapeHtml(eyebrow)}</span>
          <strong>${escapeHtml(title || "建议问题")}</strong>
        </div>
        <small>${escapeHtml(hint || "")}</small>
      </header>
      ${questionContent}
    </section>
  `;
}
function renderSuggestionButton(item, disabled) {
  return `
    <button
      type="button"
      class="ai-chat-suggestion"
      data-ai-chat-suggestion="${escapeHtml(item)}"
      ${disabled ? "disabled" : ""}
    >
      <span>${escapeHtml(item)}</span>
      <b aria-hidden="true">→</b>
    </button>
  `;
}

function renderEmptyState(hasReport) {
  return `
    <div class="ai-chat-empty-state">
      <div class="ai-chat-empty-orbit" aria-hidden="true">
        <span>命</span>
      </div>
      <strong>${hasReport ? "命盘已经准备好" : "等待完成基础排盘"}</strong>
      <p>${hasReport
        ? "可以从上面的推荐问题开始，也可以在下方直接描述你真正关心的事情。"
        : "完成排盘后，AI 会结合原局、大运、流年和流月回答问题。"}</p>
    </div>
  `;
}

function renderMessage(message = {}, index = 0) {
  return `
    <article class="ai-conversation-turn">
      <div class="ai-chat-user-row">
        <div class="ai-chat-question user-bubble">
          <small>你</small>
          <strong>${escapeHtml(message.question || "问题")}</strong>
        </div>
      </div>

      <div class="ai-chat-assistant-row">
        <div class="ai-chat-assistant-mark" aria-hidden="true">✦</div>
        <div class="ai-chat-answer ai-bubble">
          <div class="ai-chat-answer-head">
            <div>
              <b>AI 命理解读</b>
              <span>结合当前命盘结构作答</span>
            </div>
            <div class="ai-chat-answer-tools">
              <button type="button" data-ai-copy-answer="${index}">复制回答</button>
              <button type="button" data-ai-reuse-question="${index}">修改问题</button>
            </div>
          </div>
          ${renderAiText(message.answer || "", { className: "ai-chat-answer-output", promoteSummary: true })}
        </div>
      </div>
    </article>
  `;
}

function buildChatContextLabel(chartContext = {}) {
  const input = chartContext.input ?? {};
  const luckGanZhi = firstText(
    chartContext.luckImageReport?.currentLuck?.ganZhi,
    chartContext.luckImageReport?.selectedLuck?.ganZhi,
    chartContext.luckImageReport?.targetLuck?.ganZhi,
    chartContext.luckImageReport?.item?.ganZhi,
    chartContext.luckImageReport?.ganZhi,
  );
  const yearGanZhi = firstText(
    chartContext.yearImageReport?.yearItem?.ganZhi,
    chartContext.yearImageReport?.selectedYear?.ganZhi,
    chartContext.yearImageReport?.target?.ganZhi,
    chartContext.yearImageReport?.item?.ganZhi,
    chartContext.yearImageReport?.ganZhi,
  );
  const monthGanZhi = firstText(
    chartContext.monthImageReport?.monthItem?.ganZhi,
    chartContext.monthImageReport?.selectedMonth?.ganZhi,
    chartContext.monthImageReport?.target?.ganZhi,
    chartContext.monthImageReport?.item?.ganZhi,
    chartContext.monthImageReport?.ganZhi,
  );

  const targetYear = Number(input.targetYear);
  const selectedMonth = Number(input.selectedMonth);
  const parts = [];

  if (luckGanZhi) parts.push(`大运 ${luckGanZhi}`);
  if (yearGanZhi) {
    parts.push(`流年 ${yearGanZhi}`);
  } else if (Number.isFinite(targetYear)) {
    parts.push(`${Math.trunc(targetYear)}年`);
  }

  if (monthGanZhi) {
    parts.push(`流月 ${monthGanZhi}`);
  } else if (Number.isFinite(selectedMonth) && selectedMonth >= 1 && selectedMonth <= 12) {
    parts.push(`${Math.trunc(selectedMonth)}月`);
  }

  return parts.join(" · ") || "当前完整命盘";
}

function firstText(...values) {
  return values
    .map((value) => String(value ?? "").trim())
    .find(Boolean) || "";
}

async function copyText(value) {
  const text = String(value ?? "");
  try {
    await navigator.clipboard?.writeText?.(text);
    return true;
  } catch {
    // Electron 或旧浏览器可能没有剪贴板权限，继续使用后备方案。
  }

  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand("copy");
    textarea.remove();
    return copied;
  } catch {
    return false;
  }
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
