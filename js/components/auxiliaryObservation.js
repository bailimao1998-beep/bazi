import { escapeHtml, hasValue } from "../utils/html.js";

const elementLabels = { wood: "木", fire: "火", earth: "土", metal: "金", water: "水" };
const stemElements = {
  甲: "wood", 乙: "wood",
  丙: "fire", 丁: "fire",
  戊: "earth", 己: "earth",
  庚: "metal", 辛: "metal",
  壬: "water", 癸: "water",
};
const branchElements = {
  寅: "wood", 卯: "wood",
  巳: "fire", 午: "fire",
  辰: "earth", 戌: "earth", 丑: "earth", 未: "earth",
  申: "metal", 酉: "metal",
  亥: "water", 子: "water",
};

export function renderAuxiliaryObservation(currentState = {}, currentLuck = {}, helpers = {}) {
  return `
    <details class="auxiliary-observation">
      <summary class="auxiliary-summary">
        <span>
          <b>辅助观察项</b>
          <small>神煞、纳音、长生、旬空、五行、专家明细与历法依据</small>
        </span>
        <em>展开</em>
      </summary>
      ${renderAuxiliaryTabs(currentState, currentLuck, helpers)}
    </details>
  `;
}

export function bindCoreTabs(root) {
  root.querySelectorAll("[data-core-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      const tabId = button.dataset.coreTab;
      root.querySelectorAll("[data-core-tab]").forEach((item) => {
        const active = item.dataset.coreTab === tabId;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-selected", active ? "true" : "false");
      });
      root.querySelectorAll("[data-core-panel]").forEach((panel) => {
        const active = panel.dataset.corePanel === tabId;
        panel.classList.toggle("is-active", active);
        panel.hidden = !active;
      });
    });
  });
}

function renderAuxiliaryTabs(currentState = {}, currentLuck = {}, helpers = {}) {
  const viewModel = currentState.baseBaziViewModel ?? {};
  const renderBirthInfoStrip = helpers.renderBirthInfoStrip ?? (() => "");
  const tabs = [
    ["shensha", "神煞总表", renderShenshaAuxiliary(viewModel)],
    ["nayin", "纳音长生", `<p class="fine-print">排盘细节：纳音、空亡、十二长生、胎元命宫</p>${renderChartDetails(viewModel)}`],
    ["voids", "空亡旬空", renderVoidAuxiliary(viewModel)],
    ["elements", "五行详表", renderElementStatsFull(viewModel.pillars, viewModel.fiveElements)],
    ["expert", "专家明细", `${renderTenGodStatsFull(viewModel.pillars, viewModel.tenGods)}${renderCurrentContext(currentState, currentLuck)}<p class="fine-print">大运表：天干十神、地支主气十神</p>${renderLuckSummaryTable(viewModel.luckCycles, currentLuck, currentState.luckImageReport, currentState.chart)}`],
    ["calendar", "历法依据", renderBirthInfoStrip(currentState)],
  ];
  return `
    <section class="core-tabs">
      <div class="core-tab-list" role="tablist" aria-label="辅助观察项">
        ${tabs.map(([id, label], index) => `
          <button type="button" class="core-tab${index === 0 ? " is-active" : ""}" data-core-tab="${escapeHtml(id)}" aria-selected="${index === 0 ? "true" : "false"}">${escapeHtml(label)}</button>
        `).join("")}
      </div>
      ${tabs.map(([id, , html], index) => `
        <div class="core-tab-panel${index === 0 ? " is-active" : ""}" data-core-panel="${escapeHtml(id)}" ${index === 0 ? "" : "hidden"}>${html}</div>
      `).join("")}
    </section>
  `;
}

function renderShenshaAuxiliary(viewModel = {}) {
  const pillars = viewModel.pillars ?? [];
  const allItems = pillars.flatMap((pillar) =>
    (pillar.shensha ?? []).map((item) => ({
      ...item,
      pillarName: pillar.name,
      pillarText: pillar.pillar,
      pillarBranch: pillar.branch,
    }))
  );

  if (!allItems.length) {
    return `<p class="fine-print">当前内置常用实务神煞规则未命中。神煞只作为辅助观察点，不单独作为结论。</p>`;
  }

  return `
    <div class="shensha-list-view">
      <p class="fine-print">神煞只作为辅助观察点，不单独作为结论；具体应象需结合十神、柱位、原局结构和岁运触发。</p>

      <div class="shensha-pillar-list">
        ${pillars.map((pillar) => renderShenshaPillarRow(pillar)).join("")}
      </div>
    </div>
  `;
}

function renderShenshaPillarRow(pillar = {}) {
  const items = pillar.shensha ?? [];

  return `
    <section class="shensha-pillar-row">
      <div class="shensha-pillar-title">
        <strong>${escapeHtml(pillar.name)} ${escapeHtml(pillar.pillar)}</strong>
        <span>${items.length ? `${items.length} 个` : "未列"}</span>
      </div>

      <div class="shensha-chip-list">
        ${items.length
          ? items.map((item) => `
            <button
              type="button"
              class="shensha-chip"
              data-shensha-name="${escapeHtml(item.name)}"
              data-shensha-pillar="${escapeHtml(`${pillar.name} ${pillar.pillar}`)}"
              data-shensha-source="${escapeHtml(item.sourceBasis || item.evidence || "按传统神煞规则命中。")}"
              data-shensha-note="${escapeHtml(item.typicalMeaning || item.learningNote || "需要结合柱位、十神、岁运继续验证。")}"
            >
              ${escapeHtml(item.name)}
            </button>
          `).join("")
          : `<span class="muted">此柱未列出神煞</span>`}
      </div>
    </section>
  `;
}

function renderVoidAuxiliary(viewModel = {}) {
  return `
    <div class="core-tab-grid">
      ${(viewModel.pillars ?? []).map((item) => `
        <article class="core-fact">
          <span>${escapeHtml(item.name)}</span>
          <strong>${escapeHtml(item.voidBranches?.join("、") || "待查")}</strong>
          <small>${escapeHtml(item.pillar)} 旬空观察</small>
        </article>
      `).join("")}
    </div>
  `;
}

function renderCurrentContext(currentState = {}, currentLuck = {}) {
  const yearItem = currentState.yearImageReport?.yearItem;
  const monthItem = currentState.monthImageReport?.monthItem;
  return `
    <div class="chart-flow-summary chart-context-summary">
      <article><span>当前大运</span><strong>${escapeHtml(currentLuck?.ganZhi || currentLuck?.label || "待查")}</strong><small>${escapeHtml(formatRange(currentLuck?.ageRange, currentLuck?.yearRange))}</small></article>
      <article><span>目标流年</span><strong>${escapeHtml(yearItem?.ganZhi || "待查")}</strong><small>${escapeHtml(String(yearItem?.year ?? currentState.input?.targetYear ?? "待查"))}</small></article>
      <article><span>目标流月</span><strong>${escapeHtml(monthItem?.ganZhi || "待查")}</strong><small>${escapeHtml(`${monthItem?.year ?? currentState.input?.targetYear ?? "待查"}年${monthItem?.month ?? currentState.input?.selectedMonth ?? "待查"}月`)}</small></article>
    </div>
  `;
}

function renderElementBars(counts = {}) {
  const max = Math.max(1, ...Object.values(counts).map((value) => Number(value) || 0));
  return `
    <div class="element-bars">
      ${Object.entries(elementLabels).map(([key, label]) => {
        const value = Number(counts[key] || 0);
        const level = `${Math.round((value / max) * 100)}%`;
        return `<i class="topline-element-bar element-${key}" style="--level:${level}"><b>${escapeHtml(label)}</b><em>${escapeHtml(value)}</em></i>`;
      }).join("")}
    </div>
  `;
}

function renderElementStatsFull(pillars = [], fiveElements = {}) {
  const stemCounts = countBy(pillars, (item) => stemElements[item.stem]);
  const branchCounts = countBy(pillars, (item) => branchElements[item.branch]);
  const hiddenCounts = countHiddenElements(pillars);
  const combinedCounts = combineCounts(stemCounts, branchCounts, hiddenCounts);
  const groups = [
    ["天干五行统计", stemCounts],
    ["地支主气五行统计", branchCounts],
    ["完整藏干五行统计", hiddenCounts],
    ["综合五行统计", Object.keys(combinedCounts).length ? combinedCounts : combineCounts(fiveElements.visible?.counts, fiveElements.hidden?.counts)],
  ];
  return `
    <section class="chart-stat-block">
      <div class="board-title"><h3>五行统计</h3><span>分层统计</span></div>
      <div class="element-stat-grid">
        ${groups.map(([label, counts]) => `<article><span>${escapeHtml(label)}</span>${renderElementBars(counts)}</article>`).join("")}
      </div>
      <p class="fine-print">主导：${escapeHtml((fiveElements.dominant ?? []).map((item) => `${item.label}${item.value}`).join("、") || "待复核")}</p>
    </section>
  `;
}

function renderTenGodStatsFull(pillars = [], tenGods = {}) {
  const stemCounts = countBy(pillars, (item) => item.stemTenGod);
  const branchCounts = countBy(pillars, (item) => item.branchMainTenGod);
  const hiddenCounts = countHiddenTenGods(pillars);
  const combinedCounts = combineCounts(stemCounts, branchCounts, hiddenCounts);
  const groups = [
    ["天干十神", stemCounts],
    ["地支主气十神", branchCounts],
    ["完整藏干十神", Object.keys(hiddenCounts).length ? hiddenCounts : tenGods.fullHidden],
    ["综合十神", combinedCounts],
  ];
  return `
    <section class="chart-stat-block">
      <div class="board-title"><h3>十神统计</h3><span>分层统计</span></div>
      <div class="ten-god-stat-grid">
        ${groups.map(([label, counts]) => `
          <article>
            <span>${escapeHtml(label)}</span>
            <div class="stat-chip-row">${renderCountChips(counts)}</div>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function renderChartDetails(viewModel = {}) {
  const auxiliary = viewModel.auxiliary ?? {};
  const extraFacts = [
    ["胎元", auxiliary.fetalOrigin?.label, auxiliary.fetalOrigin?.meta?.method],
    ["命宫", auxiliary.lifePalace?.label, auxiliary.lifePalace?.meta?.method],
    ["身宫", auxiliary.bodyPalace?.label, auxiliary.bodyPalace?.meta?.method],
    ["胎息", auxiliary.fetalBreath?.label ?? auxiliary.fetalRest?.label ?? auxiliary.fetalBreath],
  ].filter(([, value]) => hasValue(value));
  return `
    <div class="chart-detail-panel">
      <div class="compact-table">
        <div class="compact-row compact-head"><span>柱位</span><span>纳音</span><span>空亡</span><span>十二长生</span></div>
        ${(viewModel.pillars ?? []).map((item) => `
          <div class="compact-row">
            <span>${escapeHtml(item.name)}</span>
            <strong>${escapeHtml(item.nayin || "待查")}</strong>
            <span>${escapeHtml(item.voidBranches?.join("、") || "待查")}</span>
            <span>${escapeHtml(item.twelveGrowth || "待查")}</span>
          </div>
        `).join("")}
      </div>
      ${extraFacts.length ? `<div class="chart-extra-facts">${extraFacts.map(([label, value, note]) => `
        <article><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong>${note ? `<small>${escapeHtml(note)}</small>` : ""}</article>
      `).join("")}</div>` : ""}
    </div>
  `;
}

function renderLuckSummaryTable(cycles = [], currentLuck = {}, luckImageReport = {}, chart = {}) {
  const luckItems = luckImageReport?.luckItems ?? [];
  const start = chart.luckCycles?.startCalculation ?? {};
  const introFacts = [
    ["顺逆", chart.luckCycles?.directionLabel],
    ["起运年龄", chart.luckCycles?.startAgeText ?? chart.luckCycles?.startAge],
    ["起运说明", chart.luckCycles?.startNote ?? start.method],
  ].filter(([, value]) => hasValue(value));
  return `
    <div class="chart-luck-panel">
      ${introFacts.length ? `<div class="chart-extra-facts luck-start-facts">${introFacts.map(([label, value]) => `<article><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></article>`).join("")}</div>` : ""}
      <div class="compact-table chart-luck-full-table">
        <div class="compact-row compact-head"><span>序号</span><span>大运</span><span>年龄</span><span>年份</span><span>天干十神</span><span>地支主气十神</span></div>
      ${(cycles ?? []).map((item) => {
        const matched = luckItems.find((luck) => luck.index === item.index || luck.ganZhi === item.label) ?? {};
        const active = currentLuck?.index === item.index || currentLuck?.ganZhi === item.label || matched.isCurrent;
        return `
          <div class="compact-row${active ? " is-current-luck-row" : ""}">
            <span>${escapeHtml(item.index)}${active ? " 当前" : ""}</span>
            <strong>${escapeHtml(item.label)}</strong>
            <span>${escapeHtml(item.startAge)}-${escapeHtml(item.endAge)}岁</span>
            <span>${escapeHtml(item.startYear)}-${escapeHtml(item.endYear)}</span>
            <span>${escapeHtml(matched.tenGod || "待查")}</span>
            <span>${escapeHtml(matched.branchTenGod || "待查")}</span>
          </div>
        `;
      }).join("") || `<p class="muted">暂无大运数据。</p>`}
      </div>
    </div>
  `;
}

function combineCounts(...maps) {
  const result = {};
  for (const map of maps) {
    for (const [key, value] of Object.entries(map || {})) {
      result[key] = (result[key] || 0) + Number(value || 0);
    }
  }
  return result;
}

function renderCountChips(counts = {}, labels = {}) {
  const entries = Object.entries(counts || {});
  return entries.length
    ? entries.map(([key, value]) => `<span><b>${escapeHtml(labels[key] ?? key)}</b>${escapeHtml(value)}</span>`).join("")
    : `<span><b>暂无</b>0</span>`;
}

function formatRange(ageRange, yearRange) {
  return [ageRange, yearRange].filter(Boolean).join(" / ") || "待查";
}

function countBy(items = [], pick) {
  const result = {};
  for (const item of items ?? []) {
    const key = pick(item);
    if (!key) continue;
    result[key] = (result[key] || 0) + 1;
  }
  return result;
}

function countHiddenElements(pillars = []) {
  const result = {};
  for (const pillar of pillars ?? []) {
    for (const stem of pillar.hiddenStems ?? []) {
      const key = stem.element;
      if (!key) continue;
      result[key] = (result[key] || 0) + 1;
    }
  }
  return result;
}

function countHiddenTenGods(pillars = []) {
  const result = {};
  for (const pillar of pillars ?? []) {
    for (const stem of pillar.hiddenStems ?? []) {
      const key = stem.tenGod;
      if (!key) continue;
      result[key] = (result[key] || 0) + 1;
    }
  }
  return result;
}
