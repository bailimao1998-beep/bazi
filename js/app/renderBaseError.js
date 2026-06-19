import { renderBaseBaziPanel } from "../components/baseBaziPanel.js";
import { renderFortuneTransitPanel } from "../components/fortuneTransitPanel.js";
import { escapeHtml } from "../utils/html.js";

export function renderBaseError(error, { roots, state }) {
  if (roots.chartSummary) {
    roots.chartSummary.innerHTML = `
      <div class="plugin-header">
        <p class="eyebrow">基础排盘</p>
        <h2>基础排盘</h2>
      </div>
      <p class="muted">基础排盘失败：${escapeHtml(error.message)}</p>
    `;
  }
  renderBaseBaziPanel(roots.baseBaziPanel, null);
  renderPlaceholderPanel(roots.natalImagePanel, "原局取象");
  renderPlaceholderPanel(roots.natalAiNarrative, "原局 AI 分析", "AI 解读待接入。当前系统先保证纯前端排盘与取象。");
  renderFortuneTransitPanel(roots.fortuneTransitPanel, { state });
  renderPlaceholderPanel(roots.aiChatPanel, "AI 问答", "AI 问答待接入。当前系统先保证纯前端排盘与取象。");
}

function renderPlaceholderPanel(root, title, message = "待实现。") {
  if (!root) return;
  root.innerHTML = `
    <div class="plugin-header">
      <p class="eyebrow">${escapeHtml(title)}</p>
      <h2>${escapeHtml(title)}</h2>
    </div>
    <p class="muted">${escapeHtml(message)}</p>
  `;
}
