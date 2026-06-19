import { escapeHtml } from "../utils/html.js";

export function renderTransitHierarchyPanel({ state = {}, currentLuck = {}, selectedYear, selectedMonth } = {}) {
  const luckItems = state.luckImageReport?.luckItems ?? [];
  const yearOptions = buildYearOptions(currentLuck, selectedYear);
  const monthReports = normalizeMonthReports(state.monthImageReports, state.monthImageReport);
  const yearItem = state.yearImageReport?.yearItem ?? {};

  return `
    <section class="transit-selector-board" aria-label="大运流年流月选择">
      ${renderSelectorRow({
        title: "大运",
        hint: "按年龄段切换",
        cards: luckItems.map((item) => renderLuckCard(item, currentLuck)),
      })}
      ${renderSelectorRow({
        title: "流年",
        hint: currentLuck.ganZhi ? `当前大运 ${currentLuck.ganZhi}` : "选择目标年份",
        cards: yearOptions.map((item) => renderYearCard(item, yearItem, currentLuck)),
      })}
      ${renderSelectorRow({
        title: "流月",
        hint: `${selectedYear || "目标年"} 年十二流月`,
        cards: monthReports.map((report) => renderMonthCard(report.monthItem ?? {}, selectedMonth)),
      })}
    </section>
  `;
}

function renderSelectorRow({ title, hint, cards = [] } = {}) {
  return `
    <section class="transit-selector-row">
      <div class="transit-selector-row-header">
        <h3>${escapeHtml(title || "阶段")}</h3>
        <span>${escapeHtml(hint || "")}</span>
      </div>
      <div class="transit-card-list">
        ${cards.join("") || `<p class="muted">暂无数据。</p>`}
      </div>
    </section>
  `;
}

function renderLuckCard(item = {}, currentLuck = {}) {
  const active = item.index === currentLuck.index || item.ganZhi === currentLuck.ganZhi;
  return `
    <button type="button" class="transit-select-card${active ? " is-active" : ""}${item.isCurrent ? " is-current" : ""}" data-luck-step="${escapeHtml(firstYearOfRange(item.yearRange))}">
      <strong>${escapeHtml(item.ganZhi || "待查")}</strong>
      <span>${escapeHtml(item.ageRange || "年龄待查")}</span>
      <small>${escapeHtml(item.yearRange || "年份待查")}</small>
      <em>${escapeHtml(item.tenGod || "天干待查")} / ${escapeHtml(displayBranchTenGod(item) || "地支待查")}</em>
      <i>${escapeHtml(summarizeRelations(item.relationToNatal))}</i>
    </button>
  `;
}

function renderYearCard(option = {}, yearItem = {}, currentLuck = {}) {
  const active = Number(option.value) === Number(yearItem.year);
  const relationSummary = active
    ? summarizeRelations([yearItem.relationToNatal, yearItem.relationToLuck].flat())
    : currentLuck.ganZhi ? `大运 ${currentLuck.ganZhi}` : "点击切换";
  return `
    <button type="button" class="transit-select-card${active ? " is-active" : ""}" data-year-step="${escapeHtml(option.value)}">
      <strong>${escapeHtml(option.value || "待查")}</strong>
      <span>${escapeHtml(active ? yearItem.ganZhi || "当前" : option.note || "")}</span>
      <small>${escapeHtml(active ? `${yearItem.stemTenGod || "年干待查"} / ${yearItem.branchTenGod || "年支待查"}` : "流年待选")}</small>
      <i>${escapeHtml(relationSummary)}</i>
    </button>
  `;
}

function renderMonthCard(item = {}, selectedMonth) {
  const active = Number(item.month) === Number(selectedMonth);
  return `
    <button type="button" class="transit-select-card${active ? " is-active" : ""}" data-month-select="${escapeHtml(item.month)}">
      <strong>${escapeHtml(formatFlowMonthLabel(item))}</strong>
      <span>${escapeHtml(item.ganZhi || "待查")}</span>
      <small>${escapeHtml(item.stemTenGod || "月干待查")} / ${escapeHtml(item.branchTenGod || "月支待查")}</small>
      <i>${escapeHtml(summarizeRelations([item.relationToNatal, item.relationToLuck, item.relationToYear].flat()))}</i>
    </button>
  `;
}

function buildYearOptions(currentLuck = {}, selectedYear) {
  const [start, end] = parseYearRange(currentLuck.yearRange);
  const first = Number.isFinite(start) ? start : Number(selectedYear) - 5;
  const last = Number.isFinite(end) ? end : Number(selectedYear) + 4;
  const safeFirst = Number.isFinite(first) ? first : new Date().getFullYear() - 5;
  const safeLast = Number.isFinite(last) ? last : safeFirst + 9;
  return Array.from({ length: Math.max(1, safeLast - safeFirst + 1) }, (_, index) => {
    const year = safeFirst + index;
    return {
      value: year,
      note: currentLuck.ganZhi ? `大运 ${currentLuck.ganZhi}` : "所在大运待查",
    };
  });
}

function normalizeMonthReports(monthReports, selectedReport) {
  if (Array.isArray(monthReports) && monthReports.length) return monthReports;
  return selectedReport?.monthItem ? [selectedReport] : [];
}

function summarizeRelations(relations = []) {
  const visible = (Array.isArray(relations) ? relations : [])
    .filter(Boolean)
    .map((item) => item.type || item.relationType || item.name || "关系触发")
    .filter(Boolean);
  return visible.length ? [...new Set(visible)].slice(0, 3).join("、") : "暂无明显关系";
}

function formatFlowMonthLabel(item = {}) {
  const branch = item.branch ? `${item.branch}月` : "月令待查";
  return `${item.month || "待查"}月/${branch}`;
}

function firstYearOfRange(range = "") {
  const [start] = parseYearRange(range);
  return Number.isFinite(start) ? start : "";
}

function parseYearRange(range = "") {
  const [start, end] = String(range).match(/\d{3,4}/g)?.map(Number) ?? [];
  return [start, end];
}

function displayBranchTenGod(item = {}) {
  return item.branchTenGod
    || item.branchMainTenGod
    || String(item.structureImage ?? "").match(/地支主气十神为([^，。；]+)/)?.[1]
    || "";
}
