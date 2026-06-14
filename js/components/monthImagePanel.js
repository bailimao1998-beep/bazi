export function renderMonthImagePanel(root, report) {
  if (!root) return;
  if (!report?.monthItem) {
    root.innerHTML = `
      <div class="plugin-header">
        <h2>流月取象</h2>
      </div>
      <p class="muted">等待基础排盘完成后生成目标月份取象。</p>
    `;
    return;
  }

  const item = report.monthItem;
  root.innerHTML = `
    <div class="plugin-header">
      <h2>流月取象</h2>
    </div>
    ${renderOverviewCard(item)}
    ${renderTriggerChips(item)}
    ${renderShortSection("结构取象", item.image)}
    ${renderShortSection("现实应象", item.reality)}
    ${renderDetailEvidence(item, report)}
  `;
}

function renderOverviewCard(item = {}) {
  return `
    <section class="base-bazi-section month-overview-card">
      <div class="board-title">
        <h3>流月取象总览</h3>
        <span>${safe(confidenceLabel(item.confidence || "medium"))}</span>
      </div>
      <div class="evidence-summary month-overview-grid">
        <article><span>目标年月</span><strong>${safe(item.year || "待查")}年${safe(item.month || "待查")}月</strong></article>
        <article><span>流月干支</span><strong>${safe(item.ganZhi || "待查")}</strong></article>
        <article><span>天干十神</span><strong>${safe(item.stemTenGod || "待查")}</strong></article>
        <article><span>地支主气十神</span><strong>${safe(item.branchTenGod || "待查")}</strong></article>
        <article><span>当前大运背景</span><strong>${safe(item.currentLuckItem?.ganZhi || "待复核")}</strong></article>
        <article><span>当前流年背景</span><strong>${safe(item.yearItem?.ganZhi || "待复核")}</strong></article>
      </div>
    </section>
  `;
}

function renderTriggerChips(item = {}) {
  return `
    <section class="base-bazi-section month-trigger-summary">
      <div class="board-title"><h3>关键触发点</h3><span>结构触发</span></div>
      <div class="month-trigger-chips">
        ${renderRelationChip("原局触发", item.relationToNatal)}
        ${renderRelationChip("大运触发", item.relationToLuck)}
        ${renderRelationChip("流年触发", item.relationToYear)}
      </div>
    </section>
  `;
}

function renderRelationChip(label, relations = []) {
  const rows = uniqueRelations(relations);
  const text = rows.length
    ? rows.slice(0, 3).map(shortRelationLabel).join("、")
    : "暂未命中冲、合、刑、害、破";
  return `
    <span class="month-trigger-chip">
      <b>${safe(label)}</b>
      <em>${safe(text)}${rows.length > 2 ? ` 等${rows.length}条` : ""}</em>
    </span>
  `;
}

function shortRelationLabel(relation = {}) {
  const natalPosition = String(relation.natalPillar ?? "").match(/年支|月支|日支|时支/)?.[0];
  const target = natalPosition
    ? `${natalPosition}${relation.natalBranch ?? ""}`
    : relation.luckBranch
      ? `大运支${relation.luckBranch}`
      : relation.yearBranch
        ? `流年支${relation.yearBranch}`
        : "目标结构";
  return `${relation.type || "触发"}${target}`;
}

function renderShortSection(title, text) {
  return `
    <section class="base-bazi-section month-short-section">
      <div class="board-title"><h3>${safe(title)}</h3><span>摘要</span></div>
      <p>${safe(firstSentences(text, 2) || "暂无明确摘要，需结合详细证据复核。")}</p>
    </section>
  `;
}

function renderDetailEvidence(item = {}, report = {}) {
  return `
    <details class="evidence-library month-detail-evidence">
      <summary><span>详细证据</span><b>默认折叠</b></summary>
      ${renderRelations("流月与原局触发", item.relationToNatal)}
      ${renderRelations("流月与大运触发", item.relationToLuck)}
      ${renderRelations("流月与流年触发", item.relationToYear)}
      <section><h4>成立边界</h4><p>${safe(item.boundary || "需结合原局、大运、流年与现实反馈复核。")}</p></section>
      ${renderSignals("复核提醒", report.needVerify)}
    </details>
  `;
}

function renderRelations(title, relations = []) {
  const rows = uniqueRelations(relations);
  return rows.length
    ? `<section><h4>${safe(title)}</h4><ul>${rows.map((relation) => `<li>${safe(relation.description || `${relation.type}：${relation.effect}`)}</li>`).join("")}</ul></section>`
    : `<section><h4>${safe(title)}</h4><p class="muted">暂未命中冲、合、刑、害、破。</p></section>`;
}

function renderSignals(title, items = []) {
  const rows = (Array.isArray(items) ? items : [items]).filter(Boolean);
  return rows.length
    ? `<section><h4>${safe(title)}</h4><ul>${rows.map((item) => `<li>${safe(item)}</li>`).join("")}</ul></section>`
    : "";
}

function uniqueRelations(relations = []) {
  const seen = new Set();
  return (Array.isArray(relations) ? relations : []).filter((relation) => {
    const key = [
      relation.type,
      relation.natalPillar ?? relation.luckGanZhi ?? relation.yearGanZhi ?? "",
      relation.natalBranch ?? relation.luckBranch ?? relation.yearBranch ?? "",
      relation.monthBranch ?? relation.sourceBranch ?? "",
    ].join("|");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function confidenceLabel(value) {
  return { high: "重点", medium: "可参考", low: "待验证" }[value] ?? value ?? "可参考";
}

function firstSentences(text = "", limit = 2) {
  return String(text ?? "")
    .split(/(?<=[。！？])/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, limit)
    .join("");
}

function safe(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
