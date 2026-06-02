const pillarKeys = ["year", "month", "day", "hour"];
const elementLabels = { wood: "木", fire: "火", earth: "土", metal: "金", water: "水" };
const elementAttributes = {
  wood: "生发、条达、规划",
  fire: "表达、热度、显化",
  earth: "承载、稳定、转化",
  metal: "规则、收敛、执行",
  water: "流动、信息、应变",
};
const polarityLabels = { yang: "阳", yin: "阴" };

export function renderChartSummary(root, data) {
  const chart = data?.chart;
  if (!chart) {
    root.innerHTML = `<p class="muted">等待排盘。</p>`;
    return;
  }
  root.innerHTML = `
    <div class="plugin-header">
      <p class="eyebrow">核心命盘</p>
      <h2>基础排盘展示</h2>
    </div>
    ${renderBaziMatrix(chart)}
    ${renderCoreTabs(chart)}
  `;
  bindTabs(root);
}

function renderBaziMatrix(chart) {
  const details = chart.pillarDetails ?? {};
  return `
    <div class="bazi-matrix">
      <div class="matrix-row matrix-head"><span></span>${pillarKeys.map((key) => `<b>${safe(details[key]?.label)}</b>`).join("")}</div>
      <div class="matrix-row ten-god-row"><span>天干十神</span>${pillarKeys.map((key) => `<em>${safe(details[key]?.stemTenGod)}</em>`).join("")}</div>
      <div class="matrix-row main-symbol-row"><span>天干</span>${pillarKeys.map((key) => renderSymbol(details[key]?.pillar?.stem, details[key]?.pillar?.stemElement, details[key]?.pillar?.yinYang)).join("")}</div>
      <div class="matrix-row main-symbol-row"><span>地支</span>${pillarKeys.map((key) => renderSymbol(details[key]?.pillar?.branch, details[key]?.pillar?.branchElement)).join("")}</div>
      <div class="matrix-row ten-god-row"><span>地支主气十神</span>${pillarKeys.map((key) => `<em>${safe(details[key]?.branchMainTenGod)}</em>`).join("")}</div>
      <div class="matrix-row hidden-row"><span>完整藏干</span>${pillarKeys.map((key) => `<small>${renderHiddenStems(details[key]?.hiddenStems)}</small>`).join("")}</div>
      <div class="matrix-row aux-row"><span>纳音</span>${pillarKeys.map((key) => `<small>${safe(details[key]?.nayin)}</small>`).join("")}</div>
      <div class="matrix-row aux-row"><span>十二长生</span>${pillarKeys.map((key) => `<small>${safe(details[key]?.twelveGrowth)}</small>`).join("")}</div>
    </div>
    <p class="fine-print">基础盘只提供结构观察，后续判断需要结合柱位、旺衰、十神和岁运继续验证。</p>
  `;
}

function renderCoreTabs(chart) {
  const tabs = [
    ["elements", "五行统计", renderElementStats(chart)],
    ["hidden", "十神藏干", renderTenGodStats(chart)],
    ["voids", "空亡旬空", renderVoidStats(chart)],
    ["relations", "干支关系", renderRelations(chart)],
    ["expert", "专家明细", renderExpert(chart)],
    ["calendar", "历法依据", renderCalendar(chart)],
  ];
  return `
    <section class="core-tabs">
      <div class="core-tab-list" role="tablist">
        ${tabs.map(([id, label], index) => `
          <button type="button" class="core-tab ${index === 0 ? "is-active" : ""}" aria-selected="${index === 0 ? "true" : "false"}" data-tab="${id}">
            ${safe(label)}
          </button>
        `).join("")}
      </div>
      ${tabs.map(([id, , html], index) => `
        <div class="core-tab-panel ${index === 0 ? "is-active" : ""}" data-panel="${id}" ${index === 0 ? "" : "hidden"}>
          ${html}
        </div>
      `).join("")}
    </section>
  `;
}

function renderElementStats(chart) {
  const visible = chart.elementStats?.visible ?? {};
  const hidden = chart.elementStats?.hidden ?? {};
  return `<div class="stats-two-col element-stats-layout">${renderElementBox(visible)}${renderElementBox(hidden)}</div>`;
}

function renderElementBox(stat) {
  const counts = stat.counts ?? {};
  const max = Math.max(1, ...Object.values(counts).map(Number));
  return `
    <article class="stats-box">
      <span>${safe(stat.label)}</span>
      <strong>${safe(stat.note)}</strong>
      <p class="element-summary">${safe(elementSummaryText(counts))}</p>
      <p class="element-attribute">${safe(elementAttributeText(counts, stat.label))}</p>
      <div class="element-count-grid">
        ${Object.entries(elementLabels).map(([key, label]) => {
          const value = Number(counts[key] ?? 0);
          const percent = Math.max(8, Math.round((value / max) * 100));
          return `
            <div class="element-card element-${key}">
              <span>${label}</span>
              <b>${formatNumber(value)}</b>
              <i class="element-bar"><em style="width:${percent}%"></em></i>
            </div>
          `;
        }).join("")}
      </div>
    </article>
  `;
}

function elementSummaryText(counts = {}) {
  const summary = Object.entries(elementLabels)
    .map(([key, label]) => `${label}${formatNumber(Number(counts[key] ?? 0))}`)
    .join("、");
  return `统计：${summary}。`;
}

function elementAttributeText(counts = {}, label = "") {
  const entries = Object.entries(elementLabels).map(([key, elementLabel]) => ({
    key,
    label: elementLabel,
    value: Number(counts[key] ?? 0),
    attributes: elementAttributes[key],
  }));
  const max = Math.max(...entries.map((item) => item.value));
  const min = Math.min(...entries.map((item) => item.value));
  const prominent = entries.filter((item) => item.value === max && item.value > 0).slice(0, 2);
  const zeroItems = entries.filter((item) => item.value === 0);
  const weak = zeroItems.length ? zeroItems.slice(0, 2) : entries.filter((item) => item.value === min && item.value < max).slice(0, 2);
  const lens = String(label).includes("藏干") ? "藏干层面" : "明面层面";
  const role = String(label).includes("藏干") ? "内在根气、来源支撑" : "外显结构、表层呈现";
  const prominentText = prominent.length
    ? `${formatElementNames(prominent)}相对突出，可作为${formatElementAttributes(prominent)}相关属性的候选信号`
    : "五行数量暂无明显突出项";
  const weakText = weak.length
    ? `${formatElementNames(weak)}在${lens}${zeroItems.length ? "暂未出现" : "相对偏弱"}，${formatElementAttributes(weak)}相关属性需要结合柱位、旺衰、十神和岁运继续观察`
    : "五行数量接近，属性差异需要结合柱位、旺衰、十神和岁运继续观察";
  return `属性倾向：从${role}看，${prominentText}；${weakText}。`;
}

function formatElementNames(items) {
  return items.map((item) => item.label).join("、");
}

function formatElementAttributes(items) {
  return items.map((item) => `${item.label}的${item.attributes}`).join("、");
}

function renderTenGodStats(chart) {
  const stats = chart.tenGodStats ?? {};
  const details = chart.pillarDetails ?? {};
  return `
    <div class="compact-table">
      <div class="compact-row hidden-detail compact-head"><span>柱位</span><span>地支</span><span>完整藏干</span></div>
      ${pillarKeys.map((key) => `
        <div class="compact-row hidden-detail">
          <span>${safe(details[key]?.label)}</span>
          <strong>${safe(details[key]?.pillar?.branch)}</strong>
          <small>${renderHiddenStems(details[key]?.hiddenStems, true)}</small>
        </div>
      `).join("")}
    </div>
    <div class="stats-two-col below">
      ${renderStatBox("完整藏干十神", stats.notes?.fullHidden, stats.fullHidden)}
      ${renderStatBox("主气十神", stats.notes?.mainQi, stats.mainQi)}
    </div>
  `;
}

function renderStatBox(title, note, counts = {}) {
  const entries = Object.entries(counts);
  return `
    <article class="stats-box">
      <span>${safe(title)}</span>
      <strong>${safe(note)}</strong>
      <div class="stat-chip-row">
        ${entries.length ? entries.map(([name, count]) => `<span><b>${safe(name)}</b>${safe(count)}</span>`).join("") : `<span><b>暂无</b>0</span>`}
      </div>
    </article>
  `;
}

function renderVoidStats(chart) {
  const details = chart.pillarDetails ?? {};
  return `
    <div class="core-tab-grid">
      ${pillarKeys.map((key) => `
        <article class="core-fact">
          <span>${safe(details[key]?.label)}</span>
          <strong>${safe(details[key]?.voidBranches?.join("、"))}</strong>
          <small>${safe(details[key]?.pillar?.label)} 旬空观察</small>
        </article>
      `).join("")}
    </div>
  `;
}

function renderRelations(chart) {
  const relations = chart.relations ?? [];
  if (!relations.length) return `<p class="fine-print">当前命盘未命中已启用的干支关系规则。</p>`;
  return `
    <div class="relation-list">
      ${relations.map((item) => `
        <article>
          <span>${safe(item.type)}</span>
          <strong>${safe(item.members?.join("、"))} ${safe(item.effect)}</strong>
          <small>${safe(item.ganzhi?.join(" / "))}</small>
        </article>
      `).join("")}
    </div>
  `;
}

function renderExpert(chart) {
  const details = chart.pillarDetails ?? {};
  const auxiliary = chart.auxiliary ?? {};
  return `
    <div class="compact-table">
      <div class="compact-row expert compact-head"><span>柱位</span><span>干支</span><span>纳音</span><span>长生</span><span>旬空</span></div>
      ${pillarKeys.map((key) => `
        <div class="compact-row expert">
          <span>${safe(details[key]?.label)}</span>
          <strong>${safe(details[key]?.pillar?.label)}</strong>
          <small>${safe(details[key]?.nayin)}</small>
          <small>${safe(details[key]?.twelveGrowth)}</small>
          <small>${safe(details[key]?.voidBranches?.join("、"))}</small>
        </div>
      `).join("")}
    </div>
    <div class="candidate-grid below">
      ${renderFact("胎元", auxiliary.fetalOrigin?.label, auxiliary.fetalOrigin?.meta?.method)}
      ${renderFact("命宫", auxiliary.lifePalace?.label, auxiliary.lifePalace?.meta?.method)}
      ${renderFact("身宫", auxiliary.bodyPalace?.label, auxiliary.bodyPalace?.meta?.method)}
    </div>
  `;
}

function renderCalendar(chart) {
  const calendar = chart.calendar ?? {};
  const solar = calendar.trueSolarTime ?? {};
  return `
    <div class="core-tab-grid">
      ${renderFact("原始输入", `${calendar.originalSolarDate ?? ""} ${calendar.originalTime ?? ""}`, "用户输入")}
      ${renderFact("最终排盘时间", `${calendar.solarDate ?? ""} ${calendar.time ?? ""}`, "真太阳时启用时会调整")}
      ${renderFact("真太阳时", solar.enabled ? "启用" : "未启用", solar.applied ? "已参与排盘" : "未参与排盘")}
      ${renderFact("出生地", solar.location?.name, solar.location?.source)}
      ${renderFact("经度校正", `${solar.longitudeCorrectionMinutes ?? 0}分钟`, "按出生地经度")}
      ${renderFact("均时差", `${solar.equationOfTimeMinutes ?? 0}分钟`, "用于真太阳时校正")}
      ${renderFact("月柱换月", calendar.solarTermRange, calendar.monthNote)}
      ${renderFact("日柱取日", calendar.dayPillarDate, calendar.dayPillarRule)}
      ${renderFact("时柱规则", chart.pillars?.hour?.branch, calendar.hourPillarRule)}
    </div>
  `;
}

function renderFact(label, value, note) {
  return `<article class="core-fact"><span>${safe(label)}</span><strong>${safe(value)}</strong><small>${safe(note, "")}</small></article>`;
}

function renderSymbol(value, element, yinYang) {
  const label = [polarityLabels[yinYang], elementLabels[element]].filter(Boolean).join("");
  return `
    <span class="bazi-symbol element-${safeAttr(element)} polarity-${safeAttr(yinYang)}" data-element-label="${safeAttr(label)}">
      <strong>${safe(value)}</strong>
      <small>${safe(label || elementLabels[element])}</small>
    </span>
  `;
}

function renderHiddenStems(items = [], showElement = false) {
  if (!items.length) return "待查";
  return `
    <span class="hidden-chip-list">
      ${items.map((item) => `
        <span class="hidden-chip">
          <b>${safe(item.stem)}</b>
          <em>${safe(item.tenGod)}</em>
          <small>${safe(item.role)}</small>
          ${showElement ? `<i>${safe(item.elementLabel)}</i>` : ""}
        </span>
      `).join("")}
    </span>
  `;
}

function bindTabs(root) {
  const buttons = [...root.querySelectorAll("[data-tab]")];
  const panels = [...root.querySelectorAll("[data-panel]")];
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.tab;
      buttons.forEach((item) => {
        const active = item === button;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-selected", active ? "true" : "false");
      });
      panels.forEach((panel) => {
        const active = panel.dataset.panel === target;
        panel.classList.toggle("is-active", active);
        panel.hidden = !active;
      });
    });
  });
}

function formatNumber(value) {
  return new Intl.NumberFormat("zh-CN", { maximumFractionDigits: 1 }).format(value);
}

function safe(value, fallback = "待查") {
  const text = value === undefined || value === null || value === "" ? fallback : String(value);
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function safeAttr(value) {
  return safe(value, "unknown").replaceAll(" ", "-");
}
