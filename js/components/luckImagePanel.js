export function renderLuckImagePanel(root, report) {
  if (!root) return;
  if (!report) {
    root.innerHTML = `
      <div class="plugin-header">
        <p class="eyebrow">大运取象</p>
        <h2>大运取象</h2>
      </div>
      <p class="muted">等待基础排盘完成后生成大运取象。</p>
    `;
    return;
  }
  root.innerHTML = `
    <div class="plugin-header">
      <p class="eyebrow">大运取象</p>
      <h2>大运取象</h2>
    </div>
    ${renderSummary(report.summary)}
    ${renderSignals("关键触发点", report.keySignals)}
    ${renderLuckItems(report.luckItems)}
    ${renderSignals("复核提醒", report.needVerify)}
  `;
  bindLuckDetailToggles(root);
}

function renderSummary(summary = {}) {
  return `
    <section class="base-bazi-section">
      <div class="board-title"><h3>${safe(summary.title || "大运取象总览")}</h3><span>${safe(summary.confidence || "medium")}</span></div>
      <p>${safe(summary.overview || "暂无大运数据")}</p>
      <p class="fine-print">${safe(summary.usefulHint || "用忌神初步倾向需结合格局、通关、调候复核。")}</p>
    </section>
  `;
}

function renderLuckItems(items = []) {
  const rows = Array.isArray(items) ? items : [];
  return `
    <section class="base-bazi-section">
      <div class="board-title"><h3>每步大运卡片</h3><span>${rows.length} 步</span></div>
      ${rows.length ? `<div class="natal-card-grid">${rows.map(renderLuckItem).join("")}</div>` : `<p class="muted">暂无大运数据。</p>`}
    </section>
  `;
}

function renderLuckItem(item = {}) {
  const detailId = `luck-detail-${safeAttribute(item.index ?? item.ganZhi ?? "")}`;
  return `
    <article class="natal-image-card${item.isCurrent ? " current-luck-card" : ""}">
      <div class="board-title">
        <h3>${safe(item.ganZhi || "待查")}${item.isCurrent ? ` <span class="tag">当前大运</span>` : ""}</h3>
        <span>${safe(item.ageRange || "年龄待查")} · ${safe(item.yearRange || "年份待查")}</span>
      </div>
      <div class="evidence-summary">
        <article><span>天干</span><strong>${safe(item.stem || "待查")}</strong></article>
        <article><span>地支</span><strong>${safe(item.branch || "待查")}</strong></article>
        <article><span>十神</span><strong>${safe(item.tenGod || "待查")}</strong></article>
      </div>
      <section><h4>简短取象</h4><p>${safe(item.image)}</p></section>
      <button type="button" class="secondary-button" data-luck-detail-toggle="${detailId}" aria-expanded="false" aria-controls="${detailId}">展开详情</button>
      <div id="${detailId}" data-luck-detail="${detailId}" hidden>
        ${renderRelationToNatal(item.relationToNatal)}
        <section><h4>结构取象</h4><p>${safe(item.structureImage || item.image)}</p></section>
        <section><h4>现实应象</h4><p>${safe(item.reality)}</p></section>
        <section><h4>成立边界</h4><p>${safe(item.boundary)}</p></section>
        <p class="fine-print">置信度：${safe(item.confidence || "medium")}</p>
      </div>
    </article>
  `;
}

function renderRelationToNatal(relationToNatal = []) {
  const rows = Array.isArray(relationToNatal) ? relationToNatal : [];
  return rows.length
    ? `<section><h4>原局关系触发</h4><ul>${rows.map((relation) => `<li>${safe(relation.description || `${relation.type}${relation.natalPillar}：${relation.effect}`)}</li>`).join("")}</ul></section>`
    : `<section><h4>原局关系触发</h4><p class="muted">暂未命中冲、合、刑、害、破。</p></section>`;
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

function bindLuckDetailToggles(root) {
  root.querySelectorAll?.("[data-luck-detail-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const detailId = button.dataset.luckDetailToggle;
      const detail = root.querySelector?.(`[data-luck-detail="${detailId}"]`);
      if (!detail) return;
      const willExpand = detail.hidden;
      detail.hidden = !willExpand;
      button.setAttribute("aria-expanded", String(willExpand));
      button.textContent = willExpand ? "收起" : "展开详情";
    });
  });
}

function safe(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function safeAttribute(value) {
  return String(value ?? "")
    .replaceAll(/[^a-zA-Z0-9_-]/g, "-")
    || "unknown";
}
