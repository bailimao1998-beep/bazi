import { renderTransitHierarchyPanel } from "./transitHierarchyPanel.js";
import { escapeHtml } from "../utils/html.js";

export function renderFortuneTransitPanel(root, payload = {}) {
  if (!root) return;
  const { state } = payload ?? {};
  if (!state?.baseBaziViewModel) {
    root.innerHTML = `
      <div class="plugin-header">
        <h2>大运 / 流年 / 流月</h2>
      </div>
      <p class="muted">等待基础排盘后生成三排选择卡片。</p>
    `;
    return;
  }

  const luckItems = state.luckImageReport?.luckItems ?? [];
  const currentLuck = luckItems.find((item) => item.isCurrent) ?? luckItems[0] ?? {};
  const yearItem = state.yearImageReport?.yearItem ?? {};
  const monthItem = state.monthImageReport?.monthItem ?? {};
  const selectedYear = Number(yearItem.year ?? state.input?.targetYear);
  const selectedMonth = Number(monthItem.month ?? state.input?.selectedMonth ?? 1);
  const luckCycleInfo = state.chart?.luckCycles ?? {};
  const startNote = luckCycleInfo.startNote ?? "";

  root.innerHTML = `
    <section class="transit-selector-shell">
      <div class="plugin-header">
        <div>
          <p class="eyebrow">岁运选择</p>
          <h2>大运 / 流年 / 流月</h2>
        </div>
        <span class="transit-context-pill">${escapeHtml(formatSelectionSummary(currentLuck, yearItem, monthItem))}</span>
      </div>
      ${renderTransitHierarchyPanel({
        state,
        currentLuck,
        selectedYear,
        selectedMonth,
      })}

      ${startNote
        ? `<p class="fine-print transit-start-note">${escapeHtml(startNote)}</p>`
        : ""}
          </section>
        `;

  bindTransitEvents(root, payload);
}

function bindTransitEvents(root, payload = {}) {
  root.querySelectorAll("[data-luck-step]").forEach((button) => {
    button.addEventListener("click", () => payload.onSelectLuckYear?.(Number(button.dataset.luckStep)));
  });
  root.querySelectorAll("[data-year-step]").forEach((button) => {
    button.addEventListener("click", () => payload.onSelectYear?.(Number(button.dataset.yearStep)));
  });
  root.querySelectorAll("[data-month-select]").forEach((button) => {
    button.addEventListener("click", () => payload.onSelectMonth?.(Number(button.dataset.monthSelect)));
  });
}

function formatSelectionSummary(currentLuck = {}, yearItem = {}, monthItem = {}) {
  return [
    currentLuck.ganZhi ? `大运 ${currentLuck.ganZhi}` : "",
    yearItem.year ? `${yearItem.year} ${yearItem.ganZhi || ""}` : "",
    monthItem.branch
  ? `${monthItem.branch}月 ${monthItem.ganZhi || ""}`
  : "",
  ].filter(Boolean).join(" · ") || "当前选择待查";
}
