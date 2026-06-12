export function renderEvidenceCards(root, evidenceReport) {
  if (!root) return;
  const report = evidenceReport ?? {};
  const summary = report.summary ?? {};
  root.innerHTML = `
    <div class="plugin-header"><p class="eyebrow">证据链</p><h2>EvidenceCards 证据卡片</h2></div>
    <div class="board-title"><h3>年度证据总览</h3><span>${Number(summary.mainEventCount || 0)} 个主断</span></div>
    <section class="evidence-summary">
      <article><span>年份</span><strong>${escapeHtml(summary.year ?? "未定")}</strong></article>
      <article><span>大运</span><strong>${escapeHtml(summary.selectedLuck ?? "未选")}</strong></article>
      <article><span>主事件</span><strong>${Number(summary.mainEventCount || 0)}</strong></article>
      <article><span>rule-v2</span><strong>${Number(summary.ruleV2Count || 0)}</strong></article>
      <article><span>重点主题</span><strong>${escapeHtml((summary.topTopics ?? []).join("、") || "待复核")}</strong></article>
    </section>
    ${renderEventSection("主断事件卡片", report.mainEventCards)}
    ${renderEventSection("副线复核卡片", report.parallelEventCards, { parallel: true })}
    ${renderTimingCards(report.timingCards)}
    ${renderRuleCards(report.ruleCards)}
    ${renderReviewQuestions(report.reviewQuestions)}
  `;
}

function renderEventSection(title, cards = [], { parallel = false } = {}) {
  return `
    <section class="evidence-card-section">
      <div class="board-title"><h3>${title}</h3><span>${cards.length} 条</span></div>
      <div class="evidence-card-grid">
        ${cards.length ? cards.map((card) => renderEventCard(card, parallel)).join("") : `<p class="muted">暂无证据卡片。</p>`}
      </div>
    </section>
  `;
}

function renderEventCard(card = {}, parallel = false) {
  return `
    <article class="evidence-card ${parallel ? "is-parallel" : ""}">
      <header>
        <span>${parallel ? "副线复核" : "主断倾向"}</span>
        <strong>${escapeHtml(card.title ?? card.eventType ?? "事件候选")}</strong>
        <small>${escapeHtml(card.level ?? "low")} · ${Number(card.score || 0)} · ${escapeHtml(card.confidence ?? "medium")}</small>
      </header>
      ${renderList("断法依据", card.evidence)}
      ${renderList("现实应象", card.reality ?? card.possibleManifestations)}
      ${renderList("应期观察", card.timing)}
      ${parallel ? `<p class="evidence-boundary">${escapeHtml(card.boundary ?? "")}</p>` : ""}
    </article>
  `;
}

function renderRuleCards(cards = []) {
  return `
    <section class="evidence-card-section">
      <div class="board-title"><h3>规则证据卡片</h3><span>${cards.length} 条</span></div>
      <div class="evidence-card-grid">
        ${cards.length ? cards.map(renderRuleCard).join("") : `<p class="muted">暂无规则证据。</p>`}
      </div>
    </section>
  `;
}

function renderTimingCards(cards = []) {
  return `
    <section class="evidence-card-section">
      <div class="board-title"><h3>应期观察卡片</h3><span>${cards.length} 条</span></div>
      <div class="evidence-card-grid">
        ${cards.length ? cards.map(renderTimingCard).join("") : `<p class="muted">暂无明确应期卡片。</p>`}
      </div>
    </section>
  `;
}

function renderTimingCard(card = {}) {
  const month = card.month ? `${Number(card.month)}月` : "月份待复核";
  return `
    <article class="evidence-card timing">
      <header>
        <span>${escapeHtml(month)} · ${escapeHtml(card.pillar ?? "干支待复核")}</span>
        <strong>${escapeHtml(card.theme ?? "应期观察")}</strong>
        <small>${escapeHtml(card.level ?? "medium")} · ${escapeHtml(card.source ?? "evidenceReport")}</small>
      </header>
      ${renderList("应期依据", card.evidence)}
    </article>
  `;
}

function renderRuleCard(card = {}) {
  return `
    <article class="evidence-card rule">
      <header>
        <span>${escapeHtml(card.version ?? "legacy-v1")} · ${escapeHtml(card.topic ?? "general")}</span>
        <strong>${escapeHtml(card.title ?? card.id ?? "规则")}</strong>
        <small>${Number(card.score || 0)} · ${escapeHtml(card.confidence ?? "medium")}</small>
      </header>
      ${renderList("规则依据", card.evidence)}
      ${renderList("反证条件", card.counterEvidence)}
      ${renderList("师傅复核点", card.needVerify)}
      <details>
        <summary>matchedFacts</summary>
        <pre>${escapeHtml(JSON.stringify(card.matchedFacts ?? [], null, 2))}</pre>
      </details>
    </article>
  `;
}

function renderReviewQuestions(questions = []) {
  return `
    <section class="evidence-card-section">
      <div class="board-title"><h3>师傅复核问题</h3><span>${questions.length} 条</span></div>
      ${questions.length ? `<ol class="review-question-list">${questions.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ol>` : `<p class="muted">暂无复核问题。</p>`}
    </section>
  `;
}

function renderList(title, items = []) {
  const rows = (Array.isArray(items) ? items : [items]).filter(Boolean);
  if (!rows.length) return "";
  return `<section><h4>${title}</h4><ul>${rows.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></section>`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
