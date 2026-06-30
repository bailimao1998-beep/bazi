export function renderYearImagePanel(root, report) {
  if (!root) return;
  if (!report?.yearItem) {
    root.innerHTML = `
      <div class="plugin-header">
        <p class="eyebrow">流年取象</p>
        <h2>流年取象</h2>
      </div>
      <p class="muted">等待基础排盘完成后生成目标年份取象。</p>
    `;
    return;
  }

  const item = report.yearItem;
  root.innerHTML = `
    <div class="plugin-header">
      <p class="eyebrow">流年取象</p>
      <h2>流年取象</h2>
    </div>
    ${renderSummary(report.summary)}
    ${renderYearItem(item)}
    ${renderSignals("关键触发点", report.keySignals)}
    ${renderSignals("复核提醒", report.needVerify)}
  `;
}

function renderSummary(summary = {}) {
  return `
    <section class="base-bazi-section">
      <div class="board-title"><h3>${safe(summary.title || "流年取象总览")}</h3><span>${safe(confidenceLabel(summary.confidence || "medium"))}</span></div>
      <p>${safe(summary.overview || "输入 targetYear 后生成该年取象。")}</p>
      <p class="fine-print">当前大运背景：${safe(summary.currentLuck || "待复核")}</p>
    </section>
  `;
}

function renderYearItem(item = {}) {
  return `
    <section class="base-bazi-section">
      <div class="board-title">
        <h3>${safe(item.year)}年 ${safe(item.ganZhi || "待查")}</h3>
        <span>目标年份</span>
      </div>
      <div class="evidence-summary">
        <article><span>流年干支</span><strong>${safe(item.ganZhi || "待查")}</strong></article>
        <article><span>天干十神</span><strong>${safe(item.stemTenGod || "待查")}</strong></article>
        <article><span>地支主气十神</span><strong>${safe(item.branchTenGod || "待查")}</strong></article>
      </div>
      ${renderCurrentLuck(item.currentLuckItem)}
      <section><h4>结构取象</h4><p>${safe(item.image)}</p></section>
      <section><h4>现实应象</h4><p>${safe(item.reality)}</p></section>
      <details class="evidence-library year-detail-evidence">
        <summary><span>详细取象</span><b>展开查看关系触发与成立边界</b></summary>
        ${renderRelations("流年与原局触发", item.relationToNatal)}
        ${renderRelations("流年与大运触发", item.relationToLuck)}
        <section><h4>成立边界</h4><p>${safe(item.boundary)}</p></section>
        <p class="fine-print">置信度：${safe(confidenceLabel(item.confidence || "medium"))}</p>
      </details>
    </section>
  `;
}

function renderCurrentLuck(currentLuckItem = {}) {
  if (!currentLuckItem?.ganZhi) {
    return `<section><h4>当前大运背景</h4><p class="muted">当前大运待复核。</p></section>`;
  }
  return `
    <section>
      <h4>当前大运背景</h4>
      <p>${safe(currentLuckItem.ganZhi)}大运，${safe(currentLuckItem.ageRange || "年龄待查")}，${safe(currentLuckItem.yearRange || "年份待查")}。${safe(currentLuckItem.shortImage || currentLuckItem.image || "大运背景待复核。")}</p>
    </section>
  `;
}

function renderRelations(title, relations = []) {
  const rows = Array.isArray(relations) ? relations : [];
  return rows.length
    ? `<section><h4>${safe(title)}</h4><ul>${rows.map((relation) => `<li>${safe(relation.description || `${relation.type}：${relation.effect}`)}</li>`).join("")}</ul></section>`
    : `<section><h4>${safe(title)}</h4><p class="muted">暂未命中冲、合、刑、害、破。</p></section>`;
}

function renderSignals(title, items = []) {
  const rows = (Array.isArray(items) ? items : [items]).filter(Boolean);
  return `
    <section class="base-bazi-section">
      <div class="board-title"><h3>${safe(title)}</h3><span>${rows.length} 条</span></div>
      ${rows.length ? `<ul>${rows.map((item) => `<li>${safe(item)}</li>`).join("")}</ul>` : `<p class="muted">暂无。</p>`}
    </section>
  `;
}

function safe(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function confidenceLabel(value) {
  return { high: "重点", medium: "可参考", low: "待验证" }[value] ?? value ?? "可参考";
}
