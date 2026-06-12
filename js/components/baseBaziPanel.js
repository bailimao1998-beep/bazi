const elementLabels = { wood: "木", fire: "火", earth: "土", metal: "金", water: "水" };
const genderLabels = { male: "男", female: "女", unknown: "未填" };

export function renderBaseBaziPanel(root, viewModel) {
  if (!root) return;
  if (!viewModel) {
    root.innerHTML = `<p class="muted">等待基础排盘。</p>`;
    return;
  }
  root.innerHTML = `
    <div class="plugin-header">
      <p class="eyebrow">基础排盘</p>
      <h2>盲派八字基础盘</h2>
    </div>
    ${renderBirthInfo(viewModel.birthInfo)}
    ${renderPillarTable(viewModel.pillars)}
    ${renderHiddenStemTable(viewModel.pillars)}
    <div class="stats-two-col below">
      ${renderElementStats(viewModel.fiveElements)}
      ${renderTenGodStats(viewModel.tenGods)}
    </div>
    ${renderRelations(viewModel.relations)}
    ${renderAuxiliary(viewModel)}
    ${renderLuckCycles(viewModel.luckCycles)}
  `;
}

function renderBirthInfo(info = {}) {
  return `
    <section class="base-bazi-section">
      <div class="board-title"><h3>出生信息</h3><span>${safe(info.name || "未署名")}</span></div>
      <div class="evidence-summary">
        <article><span>性别</span><strong>${safe(genderLabels[info.gender] ?? info.gender ?? "未填")}</strong></article>
        <article><span>出生地</span><strong>${safe(info.birthplace || "未填")}</strong></article>
        <article><span>阳历</span><strong>${safe(info.solarDate || "待排")}</strong></article>
        <article><span>农历</span><strong>${safe(info.lunarDate || "待查")}</strong></article>
        <article><span>真太阳时</span><strong>${info.trueSolarTime ? "已启用" : "未启用"}</strong></article>
      </div>
      ${renderList("历法依据", info.calendarNotes)}
    </section>
  `;
}

function renderPillarTable(pillars = []) {
  return `
    <section class="base-bazi-section">
      <div class="board-title"><h3>四柱表</h3><span>${pillars.length} 柱</span></div>
      <div class="compact-table">
        <div class="compact-row compact-head"><span>柱位</span><span>干支</span><span>天干十神</span><span>地支主气十神</span></div>
        ${pillars.map((item) => `
          <div class="compact-row">
            <span>${safe(item.name)}</span>
            <strong>${safe(item.pillar)}</strong>
            <span>${safe(item.stem)} · ${safe(item.stemTenGod)}</span>
            <span>${safe(item.branch)} · ${safe(item.branchMainTenGod)}</span>
          </div>
        `).join("")}
      </div>
    </section>
  `;
}

function renderHiddenStemTable(pillars = []) {
  return `
    <section class="base-bazi-section">
      <div class="board-title"><h3>藏干十神表</h3><span>主气 / 中气 / 余气</span></div>
      <div class="compact-table">
        <div class="compact-row hidden-detail compact-head"><span>柱位</span><span>地支</span><span>藏干</span></div>
        ${pillars.map((item) => `
          <div class="compact-row hidden-detail">
            <span>${safe(item.name)}</span>
            <strong>${safe(item.branch)}</strong>
            <small>${renderHiddenStems(item.hiddenStems)}</small>
          </div>
        `).join("")}
      </div>
    </section>
  `;
}

function renderElementStats(fiveElements = {}) {
  const visible = fiveElements.visible?.counts ?? fiveElements.visible ?? {};
  const hidden = fiveElements.hidden?.counts ?? fiveElements.hidden ?? {};
  return `
    <article class="stats-box">
      <span>五行统计</span>
      <strong>明面 / 藏干 / 主导五行</strong>
      <div class="stat-chip-row">${renderCountChips(visible, elementLabels)}</div>
      <div class="stat-chip-row">${renderCountChips(hidden, elementLabels)}</div>
      <p class="fine-print">主导：${safe((fiveElements.dominant ?? []).map((item) => `${item.label}${item.value}`).join("、") || "待复核")}</p>
    </article>
  `;
}

function renderTenGodStats(tenGods = {}) {
  return `
    <article class="stats-box">
      <span>十神统计</span>
      <strong>主气 / 完整藏干</strong>
      <div class="stat-chip-row">${renderCountChips(tenGods.mainQi)}</div>
      <div class="stat-chip-row">${renderCountChips(tenGods.fullHidden)}</div>
    </article>
  `;
}

function renderRelations(relations = []) {
  return `
    <section class="base-bazi-section">
      <div class="board-title"><h3>干支关系</h3><span>${relations.length} 条</span></div>
      ${relations.length
        ? `<div class="relation-chip-list">${relations.map((item) => `<details><summary>${safe(item.ganzhi?.join(" / "))} · ${safe(item.type)}</summary><p>${safe(item.evidence)}</p></details>`).join("")}</div>`
        : `<p class="muted">当前内置规则未列出明显干支关系，继续结合岁运触发复核。</p>`}
    </section>
  `;
}

function renderAuxiliary(viewModel = {}) {
  const pillars = viewModel.pillars ?? [];
  const auxiliary = viewModel.auxiliary ?? {};
  return `
    <section class="base-bazi-section">
      <div class="board-title"><h3>纳音、十二长生、空亡与神煞</h3><span>辅助观察</span></div>
      <div class="compact-table">
        <div class="compact-row compact-head"><span>柱位</span><span>纳音</span><span>十二长生</span><span>空亡</span><span>神煞</span></div>
        ${pillars.map((item) => `
          <div class="compact-row">
            <span>${safe(item.name)}</span>
            <span>${safe(item.nayin)}</span>
            <span>${safe(item.twelveGrowth)}</span>
            <span>${safe(item.voidBranches?.join("、") || "未列")}</span>
            <span>${safe((item.shensha ?? []).map((hit) => hit.name).join("、") || "未列")}</span>
          </div>
        `).join("")}
      </div>
      <p class="fine-print">胎元：${safe(auxiliary.fetalOrigin?.label ?? "待查")}；命宫：${safe(auxiliary.lifePalace?.label ?? "待查")}；身宫：${safe(auxiliary.bodyPalace?.label ?? "待查")}。</p>
    </section>
  `;
}

function renderLuckCycles(cycles = []) {
  return `
    <section class="base-bazi-section">
      <div class="board-title"><h3>大运表</h3><span>${cycles.length} 步</span></div>
      <div class="luck-table">
        ${cycles.map((item) => `
          <article class="luck-cell">
            <span>${safe(item.startAge)}-${safe(item.endAge)}岁</span>
            <strong>${safe(item.label)}</strong>
            <small>${safe(item.startYear)}-${safe(item.endYear)}</small>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function renderHiddenStems(stems = []) {
  return stems.length
    ? stems.map((item) => `<i>${safe(item.role)} ${safe(item.stem)} ${safe(item.tenGod)}</i>`).join(" ")
    : "未列";
}

function renderCountChips(counts = {}, labels = {}) {
  const entries = Object.entries(counts);
  return entries.length
    ? entries.map(([key, value]) => `<span><b>${safe(labels[key] ?? key)}</b>${safe(value)}</span>`).join("")
    : `<span><b>暂无</b>0</span>`;
}

function renderList(title, items = []) {
  const rows = (Array.isArray(items) ? items : [items]).filter(Boolean);
  return rows.length ? `<section><h4>${title}</h4><ul>${rows.map((item) => `<li>${safe(item)}</li>`).join("")}</ul></section>` : "";
}

function safe(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
