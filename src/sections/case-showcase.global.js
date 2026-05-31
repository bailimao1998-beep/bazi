(function () {
  const { escapeHtml } = window.BaziShared;

  function renderCaseShowcase({ state, el }) {
    const cases = getVisibleCases(state);
    el.cases.innerHTML = `
      <div class="plugin-header">
        <p class="eyebrow">案例展示 · 实验功能</p>
        <h2 id="case-title">本地案例库 <span class="badge muted">Beta</span></h2>
      </div>
      <p class="quick-read-lead">该模块用于辅助学习，当前不作为主报告内容。</p>
      <p class="quick-read-lead">案例仅作结构复盘参考，不能用单个案例反推当前命盘结论。</p>
      <div class="case-grid">
        ${
          cases.length
            ? cases.map(renderCaseCard).join("")
            : `<article class="signal"><strong>暂无相似案例</strong><p>案例库会随本地数据增加而变得更有参考价值。</p></article>`
        }
      </div>
    `;
  }

  function getVisibleCases(state) {
    const judgementCases = state.reading?.judgement?.caseSignals ?? [];
    if (judgementCases.length) return judgementCases;
    const aiCases = state.aiResult?.similarCases ?? [];
    if (aiCases.length) return aiCases;
    return findSimilarCases(state.reading, state.datasets.caseStudies?.cases ?? [], 4);
  }

  function findSimilarCases(reading, cases = [], limit = 4) {
    const readingTags = collectReadingTags(reading);
    return cases
      .map((caseItem) => {
        const caseTags = caseItem.tags ?? [];
        const matchedTags = caseTags.filter((tag) => readingTags.some((readingTag) => readingTag.includes(tag) || tag.includes(readingTag)));
        return { ...caseItem, matchedTags, score: matchedTags.length };
      })
      .filter((caseItem) => caseItem.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  function collectReadingTags(reading) {
    return [
      ...(reading?.natal?.patternCandidates ?? []).map((item) => item.name),
      ...(reading?.natal?.combinations ?? []).map((item) => item.title),
      ...(reading?.natal?.starSignals ?? []).map((item) => item.name),
      ...(reading?.natal?.referenceKnowledgeHits ?? []).flatMap((item) => [item.title, ...(item.tags ?? [])]),
      ...(reading?.topics ?? []).flatMap((topic) => topic.signals ?? []),
    ].filter(Boolean);
  }

  function renderCaseCard(caseItem) {
    return `
      <article class="case-card">
        <h3>${escapeHtml(caseItem.title)}</h3>
        <p>${escapeHtml(caseItem.analysis)}</p>
        ${renderReasons(caseItem)}
        ${renderEvents(caseItem)}
        <div class="tag-row">${(caseItem.matchedTags?.length ? caseItem.matchedTags : caseItem.tags ?? []).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>
      </article>
    `;
  }

  function renderReasons(caseItem) {
    const reasons = caseItem.reasons ?? [];
    if (!reasons.length) return "";
    return `
      <div class="case-reasons">
        <strong>命中原因</strong>
        <ul>${reasons.slice(0, 4).map((reason) => `<li>${escapeHtml(reason)}</li>`).join("")}</ul>
      </div>
    `;
  }

  function renderEvents(caseItem) {
    const events = caseItem.matchedEvents ?? [];
    if (!events.length) return "";
    return `
      <div class="case-events">
        ${events.slice(0, 3).map((event) => `<p><b>${escapeHtml(event.year)}</b> ${escapeHtml(event.event)}<small>${escapeHtml(event.evidence ?? "")}</small></p>`).join("")}
      </div>
    `;
  }

  window.BaziSections = window.BaziSections ?? {};
  window.BaziSections.renderCaseShowcase = renderCaseShowcase;
})();
