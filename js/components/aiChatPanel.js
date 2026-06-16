import { renderAiText } from "./aiTextRenderer.js";


function buildProfessionalQuestions(chartContext = {}) {
  const base = chartContext?.baseBaziViewModel ?? {};
  const luckReport = chartContext?.luckImageReport ?? {};
  const yearReport = chartContext?.yearImageReport ?? {};
  const monthReport = chartContext?.monthImageReport ?? {};

  const currentLuck = luckReport.currentLuckItem
    ?? luckReport.luckItems?.find((item) => item.isCurrent)
    ?? luckReport.luckItems?.[0]
    ?? {};

  const yearItem = yearReport.yearItem ?? {};
  const monthItem = monthReport.monthItem ?? {};

  const dayMaster = base.dayMaster || "日主";
  const luckLabel = currentLuck.ganZhi ? `${currentLuck.ganZhi}大运` : "当前大运";
  const yearLabel = yearItem.year && yearItem.ganZhi
    ? `${yearItem.year}年${yearItem.ganZhi}流年`
    : "目标流年";
  const monthLabel = monthItem.flowMonthLabel && monthItem.ganZhi
    ? `${monthItem.flowMonthLabel}${monthItem.ganZhi}流月`
    : "当前流月";

  return [
    `这个${dayMaster}日主的核心用神和忌神是什么？为什么？`,
    `${luckLabel}这十年的主线是什么，最容易应在哪类事情上？`,
    `${yearLabel}最明显的事情是什么，是事业、财务、感情还是家庭？`,
    `${monthLabel}为什么会被触发，现实中要注意什么？`,
    "从原局到大运看，这个人适合靠什么赚钱？技术、管理、资源还是表达？",
    "这个命盘的婚恋最容易卡在哪里？正缘和烂桃花怎么区分？",
    "用过去3个关键年份验证一下这个命盘准不准，应该看哪些事？",
    "未来三年哪一年最适合主动变化，哪一年更适合保守？",
  ];
}
export function renderAiChatPanel(root, payload = {}, actions = {}) {
  if (!root) return;

  const state = payload.state ?? {};
  const hasReport = Boolean(payload.hasReport);
  const messages = Array.isArray(state.messages) ? state.messages.slice(-5) : [];
  const professionalQuestions = buildProfessionalQuestions(payload.chartContext ?? {}).slice(0, 6);
  const disabled = state.loading || !hasReport;
  const hasMessages = messages.length > 0;

  root.innerHTML = `
    <section class="ai-chat-shell ai-chat-chatmode">
      <div class="ai-chat-compact-head">
        <div>
          <h2>AI 问答</h2>
          <span>${hasReport ? "基于当前命盘、岁运和取象证据回答" : "请先完成基础排盘与取象"}</span>
        </div>
        <b>${messages.length ? `${messages.length} 条记录` : "待提问"}</b>
      </div>

      ${
        hasMessages
          ? ""
          : `
            <div class="ai-chat-guide compact-guide">
              <strong>建议问法</strong>
              <div>
                ${professionalQuestions.map((item) => `
                  <button type="button" class="ai-chat-suggestion" data-ai-chat-suggestion="${escapeHtml(item)}" ${state.loading || !hasReport ? "disabled" : ""}>
                    ${escapeHtml(item)}
                  </button>
                `).join("")}
              </div>
            </div>
          `
      }

      <section class="ai-chat-history-section">
        ${
          messages.length
            ? `<div class="ai-chat-history">${messages.map(renderMessage).join("")}</div>`
            : `<div class="ai-chat-empty">还没有问答记录。可以先问“这个命盘整体怎么看？”</div>`
        }
      </section>

      ${state.loading ? `<div class="ai-chat-loading">AI 正在整理命盘证据和回答结构...</div>` : ""}
      ${state.error ? `<p class="error-text">${escapeHtml(state.error)}</p>` : ""}

      <form data-ai-chat-form class="ai-chat-form ai-chat-composer chatgpt-composer">
        <div class="chatgpt-input-shell">
          <textarea
            data-ai-chat-question
            name="question"
            rows="2"
            placeholder="问当前命盘、岁运、感情、事业、流年流月……"
            ${disabled ? "disabled" : ""}
          >${escapeHtml(state.question || "")}</textarea>

          <button type="submit" class="chatgpt-send-button" ${disabled ? "disabled" : ""} aria-label="发送问题">
            ${state.loading ? "…" : "↑"}
          </button>
        </div>

        <div class="chatgpt-composer-hint">
          回答会区分：命盘依据 / 推演判断 / 现实验证。
        </div>
      </form>
    </section>
  `;

  root.querySelector?.("[data-ai-chat-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = root.querySelector?.("[data-ai-chat-question]")?.value ?? "";
    (payload.onAsk ?? actions.onAsk)?.(value);
  });

  root.querySelectorAll?.("[data-ai-chat-suggestion]").forEach((button) => {
    button.addEventListener("click", () => {
      const textarea = root.querySelector?.("[data-ai-chat-question]");
      if (!textarea) return;
      textarea.value = button.dataset.aiChatSuggestion || "";
      textarea.focus();
    });
  });
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
          <b>AI 结构化分析</b>
          <span>答</span>
        </div>
        ${renderAiText(message.answer || "", { className: "ai-chat-answer-output" })}
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