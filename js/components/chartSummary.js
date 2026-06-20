import { escapeHtml } from "../utils/html.js";
import { branchElements, elementLabels, hiddenStems as hiddenStemMap, stemElements } from "../core/bazi/fiveElements.js";
import { getTenGod } from "../core/bazi/tenGods.js";

const polarityLabels = { yang: "阳", yin: "阴" };
const stemPolarity = {
  甲: "yang",
  乙: "yin",
  丙: "yang",
  丁: "yin",
  戊: "yang",
  己: "yin",
  庚: "yang",
  辛: "yin",
  壬: "yang",
  癸: "yin",
};
const branchPolarity = {
  子: "yang",
  丑: "yin",
  寅: "yang",
  卯: "yin",
  辰: "yang",
  巳: "yin",
  午: "yang",
  未: "yin",
  申: "yang",
  酉: "yin",
  戌: "yang",
  亥: "yin",
};

export function renderChartSummary(root, currentState) {
  if (!root) return;
  if (!currentState?.baseBaziViewModel) {
    root.innerHTML = `
      <div class="plugin-header">
        <p class="eyebrow">核心命盘</p>
        <h2>核心命盘</h2>
        <p class="muted">左三列为当前岁运，右四列为原局四柱。</p>
      </div>
      <p class="muted">等待基础排盘。</p>
    `;
    return;
  }

  const viewModel = currentState.baseBaziViewModel;
  const currentLuck = currentState.luckImageReport?.luckItems?.find((item) => item.isCurrent)
    ?? currentState.luckImageReport?.luckItems?.[0]
    ?? {};
  const yearItem = currentState.yearImageReport?.yearItem ?? {};
  const monthItem = currentState.monthImageReport?.monthItem ?? {};
  const pillars = viewModel.pillars ?? [];
  const dayStem = pillars.find((pillar) => pillar.key === "day")?.stem ?? "";
  const columns = [
    buildTransitColumn("大运", currentLuck, "luck", dayStem),
    buildTransitColumn("流年", yearItem, "year", dayStem),
    buildTransitColumn("流月", monthItem, "month", dayStem),
    ...pillars.map((pillar) => buildNatalColumn(pillar)),
  ].slice(0, 7);

  while (columns.length < 7) {
    columns.push(buildEmptyColumn());
  }

  const rows = [
    ["天干十神", "ten-god", (column) => renderTextCell(column.stemTenGod, "matrix-ten-god")],
    ["天干", "stem", (column) => renderSymbolCell(column.stem, column)],
    ["地支", "branch", (column) => renderSymbolCell(column.branch, column, "branch")],
    ["地支主气十神", "ten-god", (column) => renderTextCell(column.branchTenGod, "matrix-ten-god")],
    ["藏干", "hidden", (column) => renderHiddenCell(column.hiddenStems)],
  ];

  root.innerHTML = `
    <section class="core-chart-matrix">
      <div class="plugin-header">
        <div>
          <p class="eyebrow">核心命盘</p>
          <h2>基础排盘展示</h2>
        </div>
      </div>
      ${renderChartTopline(viewModel)}
      <div class="core-matrix-scroll">
        <div class="core-matrix-grid bazi-matrix">
          <div class="matrix-row matrix-group-row">
            <span class="matrix-corner"></span>
            <b class="matrix-group-label is-transit">当前岁运</b>
            <b class="matrix-group-label is-natal">原局四柱</b>
          </div>
          <div class="matrix-row matrix-head">
            <span class="matrix-row-label"></span>
            ${columns.map(renderColumnHead).join("")}
          </div>
          ${rows.map(([label, rowType, renderCell]) => `
            <div class="${rowClass(rowType)}">
              <span class="matrix-row-label">${escapeHtml(label)}</span>
              ${columns.map((column, index) => renderMatrixCell(column, rowType, renderCell, index)).join("")}
            </div>
          `).join("")}
        </div>
      </div>
    </section>
  `;
}

function buildTransitColumn(title, item = {}, type = "luck", dayStem = "") {
  return {
    title,
    type: "transit",
    active: true,
    label: transitLabel(item, type),
    meta: transitMeta(item, type),
    stem: item.stem,
    branch: item.branch,
    stemTenGod: item.tenGod || item.stemTenGod,
    branchTenGod: item.branchTenGod || item.branchMainTenGod || displayBranchTenGod(item),
    hiddenStems: normalizeHiddenStems(item.hiddenStems).length
      ? normalizeHiddenStems(item.hiddenStems)
      : buildHiddenStemsForBranch(item.branch, dayStem),
  };
}

function rowClass(rowType = "") {
  if (rowType === "stem" || rowType === "branch") return "matrix-row main-symbol-row";
  if (rowType === "hidden") return "matrix-row hidden-row";
  return `${rowType}-row matrix-row`;
}

function buildNatalColumn(pillar = {}) {
  return {
    title: pillar.name,
    type: "natal",
    day: pillar.key === "day",
    label: pillar.pillar || `${pillar.stem ?? ""}${pillar.branch ?? ""}`,
    stem: pillar.stem,
    branch: pillar.branch,
    stemTenGod: pillar.key === "day" ? "日主" : pillar.stemTenGod,
    branchTenGod: pillar.branchMainTenGod,
    hiddenStems: normalizeHiddenStems(pillar.hiddenStems),
    meta: pillar.nayin || "",
  };
}

function buildEmptyColumn() {
  return {
    title: "待查",
    type: "natal",
    label: "待查",
    hiddenStems: [],
  };
}

function renderColumnHead(column = {}, index = 0) {
  const className = [
    "matrix-col-head",
    column.type === "transit" ? "is-transit" : "is-natal",
    column.day ? "is-day" : "",
    index === 2 ? "has-divider" : "",
  ].filter(Boolean).join(" ");

  return `
    <div class="${className}">
      <b>${escapeHtml(column.title || "待查")}</b>
    </div>
  `;
}

function renderMatrixCell(column = {}, rowType = "", renderCell, index = 0) {
  const className = [
    "matrix-cell",
    column.type === "transit" ? "is-transit" : "is-natal",
    column.day ? "is-day" : "",
    column.active ? "is-active" : "",
    index === 2 ? "has-divider" : "",
    rowType ? `matrix-${rowType}-cell` : "",
    rowType ? `is-${rowType}` : "",
  ].filter(Boolean).join(" ");

  return `<div class="${className}">${renderCell(column)}</div>`;
}

function renderTextCell(value, className = "") {
  return `<em class="${escapeHtml(className)}">${escapeHtml(value || "待查")}</em>`;
}

function renderSymbolCell(value, column = {}, symbolType = "stem") {
  const element = elementForSymbol(value, symbolType);
  const attributeLabel = symbolAttributeLabel(value, symbolType);
  const className = [
    "bazi-symbol",
    "matrix-symbol",
    symbolType === "branch" ? "is-branch" : "is-stem",
    element ? `element-${element}` : "",
    elementClassForSymbol(value, symbolType),
    column.day ? "is-day" : "",
    column.day && symbolType === "stem" ? "is-day-master" : "",
  ].filter(Boolean).join(" ");
  return `
    <span class="${className}">
      <strong>${escapeHtml(value || "待查")}</strong>
      <small>${escapeHtml(attributeLabel || "-")}</small>
    </span>
  `;
}

function renderHiddenCell(hiddenStems = []) {
  const stems = normalizeHiddenStems(hiddenStems);
  if (!stems.length) return `<span class="matrix-empty">-</span>`;
  return `
    <small class="matrix-hidden-stems hidden-chip-list">
      ${stems.map((item) => `
        <span class="hidden-chip ${escapeHtml(elementClassForSymbol(item.stem, "stem"))}">
          <b>${escapeHtml(item.stem || "待查")}</b>
          <em>${escapeHtml(item.tenGod || "待查")}</em>
          <small>${escapeHtml(item.attributeLabel || symbolAttributeLabel(item.stem, "stem"))}</small>
        </span>
      `).join("")}
    </small>
  `;
}

function renderChartTopline(viewModel = {}) {
  const day = viewModel.pillars?.find((pillar) => pillar.key === "day") ?? {};
  const month = viewModel.pillars?.find((pillar) => pillar.key === "month") ?? {};
  const dayElement = stemElements[day.stem];
  const monthElement = branchElements[month.branch];
  const visible = viewModel.fiveElements?.visible?.counts ?? viewModel.fiveElements?.visible ?? {};
  return `
    <div class="chart-topline core-chart-topline">
      <article class="chart-topline-item chart-topline-primary"><span>日主</span><strong>${escapeHtml(`${day.stem || "待查"}${elementLabels[dayElement] || ""}`)}</strong></article>
      <article class="chart-topline-item"><span>月令</span><strong>${escapeHtml(`${month.branch || "待查"}${elementLabels[monthElement] || ""}`)}</strong></article>
      <article class="chart-topline-item element-mini"><span>五行</span>${renderElementBars(visible)}</article>
    </div>
  `;
}

function renderElementBars(counts = {}) {
  const max = Math.max(1, ...Object.keys(elementLabels).map((key) => Number(counts[key] || 0)));
  return `
    <span class="element-bars">
      ${Object.entries(elementLabels).map(([key, label]) => {
        const value = Number(counts[key] || 0);
        const level = Math.max(4, Math.round((value / max) * 100));
        return `<i class="topline-element-bar element-${key}" style="--level:${level}%"><b>${escapeHtml(label)}</b><em>${escapeHtml(value)}</em></i>`;
      }).join("")}
    </span>
  `;
}

function transitLabel(item = {}, type = "luck") {
  if (type === "luck") return item.ganZhi || item.label || "待查";
  if (type === "year") return `${item.year ?? ""} ${item.ganZhi ?? ""}`.trim() || "待查";
  return `${item.month ?? ""}月 ${item.ganZhi ?? ""}`.trim() || "待查";
}

function transitMeta(item = {}, type = "luck") {
  if (type === "luck") return [item.ageRange, item.yearRange].filter(Boolean).join(" / ");
  if (type === "year") return item.currentLuckItem?.ganZhi ? `大运 ${item.currentLuckItem.ganZhi}` : "";
  return [item.currentLuckItem?.ganZhi, item.yearItem?.ganZhi].filter(Boolean).join(" / ");
}

function displayBranchTenGod(item = {}) {
  return String(item.structureImage ?? "").match(/地支主气十神为([^，。；]+)/)?.[1] || "";
}

function elementClassForSymbol(value, symbolType = "stem") {
  const element = elementForSymbol(value, symbolType);
  return element ? `is-${element}` : "";
}

function elementForSymbol(value, symbolType = "stem") {
  return symbolType === "branch" ? branchElements[value] : stemElements[value];
}

function polarityForSymbol(value, symbolType = "stem") {
  return symbolType === "branch" ? branchPolarity[value] : stemPolarity[value];
}

function symbolAttributeLabel(value, symbolType = "stem") {
  const polarity = polarityLabels[polarityForSymbol(value, symbolType)] ?? "";
  const element = elementLabels[elementForSymbol(value, symbolType)] ?? "";
  return [polarity, element].filter(Boolean).join("");
}

function normalizeHiddenStems(hiddenStems = []) {
  if (!Array.isArray(hiddenStems)) return [];
  return hiddenStems
    .map((item) => {
      if (typeof item === "string") return { stem: item, tenGod: "" };
      return {
        stem: item?.stem ?? item?.label ?? "",
        tenGod: item?.tenGod ?? item?.god ?? "",
        elementLabel: item?.elementLabel ?? "",
        attributeLabel: item?.attributeLabel ?? "",
      };
    })
    .filter((item) => item.stem);
}

function buildHiddenStemsForBranch(branch, dayStem = "") {
  return (hiddenStemMap[branch] ?? []).map((stem) => ({
    stem,
    tenGod: getTenGod(dayStem, stem),
    elementLabel: elementLabels[stemElements[stem]] ?? "",
    attributeLabel: symbolAttributeLabel(stem, "stem"),
  }));
}
