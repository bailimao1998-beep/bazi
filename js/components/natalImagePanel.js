const topicLabels = {
  personality: "性格底色",
  family: "家庭背景",
  study_skill: "学业技能",
  career: "事业方向",
  wealth: "财务方式",
  relationship: "感情模式",
  health: "健康体质",
  movement: "迁动环境",
  life_pattern: "人生主线",
};

export function renderNatalImagePanel(root, report) {
  if (!root) return;
  if (!report) {
    root.innerHTML = `
      <div class="plugin-header">
        <p class="eyebrow">原局取象</p>
        <h2>原局整体取象</h2>
      </div>
      <p class="muted">等待基础排盘完成后生成原局取象。</p>
    `;
    return;
  }
  root.innerHTML = `
    <div class="plugin-header">
      <p class="eyebrow">原局取象</p>
      <h2>原局整体取象</h2>
    </div>
    ${renderSummary(report.summary)}
    ${renderSignals("关键结构信号", report.keySignals, "keySignals")}
    ${renderImageCards(report.imageCards)}
    ${renderSignals("弱信号与保留点", report.weakSignals, "weakSignals")}
    ${renderSignals("师傅复核点", report.needVerify, "needVerify")}
  `;
}

function renderSummary(summary = {}) {
  return `
    <section class="base-bazi-section">
      <div class="board-title"><h3>${safe(summary.title || "原局整体取象")}</h3><span>${safe(summary.confidence || "medium")}</span></div>
      <div class="evidence-summary">
        <article><span>日主</span><strong>${safe(summary.dayMaster || "待查")}</strong></article>
        <article><span>结构</span><strong>${safe(summary.mainStructure || "待复核")}</strong></article>
        <article><span>强弱</span><strong>${safe(summary.strengthLevel || "待查")}</strong></article>
      </div>
      <p>${safe(summary.mainImage || "等待结构取象。")}</p>
      <p class="fine-print">${safe(summary.usefulHint || "初步倾向，需结合格局、通关、调候复核。")}</p>
      <p class="fine-print">${safe(summary.boundary || "原局取象只作结构观察。")}</p>
    </section>
  `;
}

function renderImageCards(cards = []) {
  return `
    <section class="base-bazi-section">
      <div class="board-title"><h3>取象卡片</h3><span>${cards.length} 张</span></div>
      <div class="natal-card-grid">
        ${cards.map(renderImageCard).join("")}
      </div>
    </section>
  `;
}

function renderImageCard(card = {}) {
  return `
    <article class="natal-image-card">
      <div class="board-title">
        <h3>${safe(card.title)}</h3>
        <span>${safe(topicLabels[card.topic] ?? card.topic)} · ${safe(card.level)}</span>
      </div>
      ${renderList("断法依据", card.evidence)}
      <section><h4>结构取象</h4><p>${safe(card.image)}</p></section>
      <section><h4>现实应象</h4><p>${safe(card.reality)}</p></section>
      <section><h4>成立边界</h4><p>${safe(card.boundary)}</p></section>
      <p class="fine-print">置信度：${safe(card.confidence || "medium")}</p>
    </article>
  `;
}

function renderSignals(title, items = [], className = "") {
  const rows = (Array.isArray(items) ? items : [items]).filter(Boolean);
  return `
    <section class="base-bazi-section ${safe(className)}">
      <div class="board-title"><h3>${safe(title)}</h3><span>${rows.length} 条</span></div>
      ${rows.length ? `<ul>${rows.map((item) => `<li>${safe(item)}</li>`).join("")}</ul>` : `<p class="muted">暂无。</p>`}
    </section>
  `;
}

function renderList(title, items = []) {
  const rows = (Array.isArray(items) ? items : [items]).filter(Boolean);
  return rows.length ? `<section><h4>${safe(title)}</h4><ul>${rows.map((item) => `<li>${safe(item)}</li>`).join("")}</ul></section>` : "";
}

function safe(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
