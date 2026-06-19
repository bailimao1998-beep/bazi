import { escapeHtml } from "../utils/html.js";

export function renderChartSummary(root, currentState) {
  if (!root) return;
  if (!currentState?.baseBaziViewModel) {
    root.innerHTML = `
      <div class="plugin-header">
        <p class="eyebrow">核心命盘</p>
        <h2>七列盘面</h2>
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
  const columns = [
    buildTransitColumn("大运", currentLuck, "luck"),
    buildTransitColumn("流年", yearItem, "year"),
    buildTransitColumn("流月", monthItem, "month"),
    ...pillars.map((pillar) => buildNatalColumn(pillar)),
  ];

  root.innerHTML = `
    <section class="core-seven-chart">
      <div class="plugin-header">
        <div>
          <p class="eyebrow">核心命盘</p>
          <h2>七列盘面</h2>
          <p class="muted">左三列为当前岁运，右四列为原局四柱。</p>
        </div>
      </div>
      <div class="core-seven-grid">
        ${columns.map(renderColumn).join("")}
      </div>
    </section>
  `;
}

function buildTransitColumn(title, item = {}, type = "luck") {
  return {
    title,
    type: "transit",
    active: true,
    label: transitLabel(item, type),
    stem: item.stem,
    branch: item.branch,
    stemTenGod: item.tenGod || item.stemTenGod,
    branchTenGod: item.branchTenGod || item.branchMainTenGod || displayBranchTenGod(item),
    hidden: "-",
    relation: summarizeRelations([
      item.relationToNatal,
      item.relationToLuck,
      item.relationToYear,
    ].flat()),
    meta: transitMeta(item, type),
  };
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
    hidden: (pillar.hiddenStems ?? []).map((item) => item.stem).join("、") || "未列",
    relation: (pillar.shensha ?? []).slice(0, 3).map((item) => item.name).join("、") || "神煞未列",
    meta: pillar.nayin || "",
  };
}

function renderColumn(column = {}) {
  const className = [
    "core-seven-column",
    column.type === "transit" ? "is-transit" : "is-natal",
    column.day ? "is-day" : "",
    column.active ? "is-active" : "",
  ].filter(Boolean).join(" ");

  return `
    <article class="${className}">
      <header class="core-seven-header">
        <span>${escapeHtml(column.title)}</span>
        <strong class="core-seven-ganzhi">${escapeHtml(column.label || "待查")}</strong>
        ${column.meta ? `<small>${escapeHtml(column.meta)}</small>` : ""}
      </header>
      <div class="core-seven-symbol-pair">
        ${renderRow("天干", column.stem, "core-seven-symbol core-seven-stem")}
        ${renderRow("地支", column.branch, "core-seven-symbol core-seven-branch")}
      </div>
      ${renderRow("天干十神", column.stemTenGod, "core-seven-meta core-seven-ten-god")}
      ${renderRow("地支主气", column.branchTenGod, "core-seven-meta")}
      ${renderRow("藏干", column.hidden, "core-seven-meta core-seven-hidden")}
      ${renderRow("关系", column.relation, "core-seven-relation")}
    </article>
  `;
}

function renderRow(label, value, className) {
  return `
    <div class="core-seven-row ${escapeHtml(className)}">
      <span>${escapeHtml(label)}</span>
      <b>${escapeHtml(value || "待查")}</b>
    </div>
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

function summarizeRelations(relations = []) {
  const visible = (Array.isArray(relations) ? relations : [])
    .filter(Boolean)
    .map((item) => item.type || item.relationType || item.name || "关系触发")
    .filter(Boolean);
  return visible.length ? [...new Set(visible)].slice(0, 4).join("、") : "暂无明显关系";
}

function displayBranchTenGod(item = {}) {
  return String(item.structureImage ?? "").match(/地支主气十神为([^，。；]+)/)?.[1] || "";
}
