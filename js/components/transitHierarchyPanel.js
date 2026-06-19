import { escapeHtml } from "../utils/html.js";

export function renderTransitHierarchyPanel({ state = {}, currentLuck = {}, selectedYear, selectedMonth } = {}) {
  const luckItems = state.luckImageReport?.luckItems ?? [];
  const yearOptions = buildYearOptions(currentLuck, selectedYear);
  const monthReports = normalizeMonthReports(state.monthImageReports, state.monthImageReport);

  return `
    <section class="transit-hierarchy" aria-label="大运流年流月层级推演">
      <div class="transit-column">
        <div class="transit-column-header">
          <strong>大运</strong>
          <span>全部大运</span>
        </div>
        <div class="transit-node-list">
          ${luckItems.map((item) => renderLuckNode(item, currentLuck)).join("") || `<p class="muted">暂无大运数据。</p>`}
        </div>
      </div>

      <div class="transit-column">
        <div class="transit-column-header">
          <strong>流年</strong>
          <span>${escapeHtml(currentLuck.ganZhi || "所在大运")}</span>
        </div>
        <div class="transit-node-list">
          ${yearOptions.map((item) => renderYearNode(item, state.yearImageReport?.yearItem, currentLuck)).join("")}
        </div>
      </div>

      <div class="transit-column transit-month-column">
        <div class="transit-column-header">
          <strong>流月</strong>
          <span>${escapeHtml(`${selectedYear || "目标年"} 年`)}</span>
        </div>
        <div class="transit-month-grid">
          ${monthReports.map((report) => renderMonthNode(report.monthItem ?? {}, selectedMonth)).join("")}
        </div>
      </div>
    </section>
  `;
}

function renderLuckNode(item = {}, currentLuck = {}) {
  const active = item.index === currentLuck.index || item.ganZhi === currentLuck.ganZhi;
  const relationSummary = summarizeRelations(item.relationToNatal);
  return `
    <button type="button" class="transit-node${active ? " is-active" : ""}${item.isCurrent ? " is-current" : ""}" data-luck-step="${escapeHtml(firstYearOfRange(item.yearRange))}">
      <span class="transit-node-main">
        <b>${escapeHtml(item.ganZhi || "待查")}</b>
        <em>${escapeHtml(item.ageRange || "年龄待查")}</em>
      </span>
      <span class="transit-node-meta">${escapeHtml(item.yearRange || "年份待查")} · ${escapeHtml(item.tenGod || "天干十神待查")} / ${escapeHtml(displayBranchTenGod(item) || "地支主气待查")}</span>
      <span class="transit-relation-tags">${escapeHtml(relationSummary)}</span>
    </button>
  `;
}

function renderYearNode(option = {}, yearItem = {}, currentLuck = {}) {
  const active = Number(option.value) === Number(yearItem.year);
  const relationSummary = active
    ? summarizeRelations([yearItem.relationToNatal, yearItem.relationToLuck].flat())
    : currentLuck.ganZhi ? `所在大运 ${currentLuck.ganZhi}` : "等待选择";
  return `
    <button type="button" class="transit-node${active ? " is-active" : ""}" data-year-step="${escapeHtml(option.value)}">
      <span class="transit-node-main">
        <b>${escapeHtml(option.value || "待查")}</b>
        <em>${escapeHtml(active ? yearItem.ganZhi || "当前" : option.note || "")}</em>
      </span>
      <span class="transit-node-meta">${escapeHtml(active ? `${yearItem.stemTenGod || "年干待查"} / ${yearItem.branchTenGod || "年支待查"}` : "点击切换流年")}</span>
      <span class="transit-relation-tags">${escapeHtml(relationSummary)}</span>
    </button>
  `;
}

function renderMonthNode(item = {}, selectedMonth) {
  const active = Number(item.month) === Number(selectedMonth);
  const relationSummary = summarizeRelations([item.relationToNatal, item.relationToLuck, item.relationToYear].flat());
  return `
    <button type="button" class="transit-node month-node${active ? " is-active" : ""}" data-month-select="${escapeHtml(item.month)}">
      <span class="transit-node-main">
        <b>${escapeHtml(formatFlowMonthLabel(item))}</b>
        <em>${escapeHtml(item.ganZhi || "待查")}</em>
      </span>
      <span class="transit-node-meta">${escapeHtml(item.stemTenGod || "月干待查")} / ${escapeHtml(item.branchTenGod || "月支待查")}</span>
      <span class="transit-relation-tags">${escapeHtml(relationSummary)}</span>
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
      note: currentLuck.ganZhi ? `所在大运 ${currentLuck.ganZhi}` : "所在大运待查",
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
  return visible.length ? [...new Set(visible)].slice(0, 3).join("、") : "暂无明显关系触发";
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
