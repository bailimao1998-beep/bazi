import { escapeHtml } from "../utils/html.js";


export function renderTransitHierarchyPanel({ state = {}, currentLuck = {}, selectedYear, selectedMonth } = {}) {
  const luckItems = state.luckImageReport?.luckItems ?? [];
  const yearReports = normalizeYearReports(state.yearImageReports, state.yearImageReport);
  const monthReports = normalizeMonthReports(state.monthImageReports, state.monthImageReport);
  const yearItem = state.yearImageReport?.yearItem ?? {};

  return `
    <section class="transit-selector-board" aria-label="大运流年流月选择">
      ${renderSelectorRow({
        title: "大运",
        hint: "按年龄段切换",
        type: "luck",
        cards: luckItems.map((item) => renderLuckCard(item, currentLuck)),
      })}
      ${renderSelectorRow({
        title: "流年",
        hint: currentLuck.ganZhi ? `当前大运 ${currentLuck.ganZhi}` : "选择目标年份",
        type: "year",
        cards: yearReports.map((report) => renderYearCard(report.yearItem ?? {}, yearItem)),
      })}
      ${renderSelectorRow({
        title: "流月",
        hint: `${selectedYear || "目标年"} 年十二流月`,
        type: "month",
        cards: monthReports.map((report) => renderMonthCard(report.monthItem ?? {}, selectedMonth)),
      })}
    </section>
  `;
}

function renderSelectorRow({ title, hint, type = "luck", cards = [] } = {}) {
  return `
    <section class="transit-selector-row is-${escapeHtml(type)}">
      <div class="transit-selector-row-header">
        <h3>${escapeHtml(title || "阶段")}</h3>
        <span>${escapeHtml(hint || "")}</span>
      </div>
      <div class="transit-card-list is-${escapeHtml(type)}-row">
        ${cards.join("") || `<p class="muted">暂无数据。</p>`}
      </div>
    </section>
  `;
}

function renderLuckCard(item = {}, currentLuck = {}) {
  const active = item.index === currentLuck.index || item.ganZhi === currentLuck.ganZhi;
  const tenGodText = joinTenGods(item.tenGod || item.stemTenGod, displayBranchTenGod(item));
  const relationText = summarizeRelations(item.relationToNatal);

  return `
    <button type="button" class="transit-select-card is-luck-card${active ? " is-active" : ""}${item.isCurrent ? " is-current" : ""}" data-luck-step="${escapeHtml(firstYearOfRange(item.yearRange))}">
      <strong class="luck-card-title">${escapeHtml([item.ageRange, item.ganZhi].filter(Boolean).join(" · ") || "待查")}</strong>
      <span class="luck-card-years">${escapeHtml(item.yearRange || "年份待查")}</span>
      <span class="luck-card-ten-god">${escapeHtml(tenGodText)}</span>
      <i class="luck-card-relation">${escapeHtml(relationText)}</i>
    </button>
  `;
}

function renderYearCard(item = {}, selectedYearItem = {}) {
  const active = Number(item.year) === Number(selectedYearItem.year);
  const relationText = summarizeRelations([
    item.relationToNatal,
    item.relationToLuck,
  ].flat());

  return `
    <button type="button" class="transit-select-card is-year-card${active ? " is-active" : ""}" data-year-step="${escapeHtml(item.year)}">
      <strong>${escapeHtml(`${item.year || "待查"} · ${item.ganZhi || "待查"}`)}</strong>
      <small>${escapeHtml(joinTenGods(item.stemTenGod, item.branchTenGod))}</small>
      <i>${escapeHtml(relationText)}</i>
    </button>
  `;
}

function renderMonthCard(item = {}, selectedMonth) {
  const active = Number(item.month) === Number(selectedMonth);
  const tenGodText = joinTenGods(item.stemTenGod || item.tenGod, item.branchTenGod || item.branchMainTenGod);
  const relationText = summarizeRelations([item.relationToNatal, item.relationToLuck, item.relationToYear].flat());

  return `
    <button type="button" class="transit-select-card is-month-card${active ? " is-active" : ""}" data-month-select="${escapeHtml(item.month)}">
      <strong>${escapeHtml(formatFlowMonthLabel(item))}</strong>
      <small>${escapeHtml(tenGodText)}</small>
      <i>${escapeHtml(relationText)}</i>
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

function normalizeYearReports(yearReports, selectedReport) {
  if (Array.isArray(yearReports) && yearReports.length) return yearReports;
  return selectedReport?.yearItem ? [selectedReport] : [];
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
  return visible.length ? [...new Set(visible)].join("、") : "暂无明显关系";
}

function joinTenGods(...values) {
  const visible = values
    .flat()
    .filter((item) => item !== undefined && item !== null && String(item).trim())
    .map((item) => String(item).trim());

  return visible.length ? visible.slice(0, 2).join(" / ") : "十神待查";
}

function formatFlowMonthLabel(item = {}) {
  return `${item.month || "待查"}月 / ${item.ganZhi || "待查"}`;
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
