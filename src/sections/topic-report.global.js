(function () {
  const { escapeHtml } = window.BaziShared;

  function renderTopicReport({ state, el }) {
    const judgementDomains = state.reading.judgement?.domains ?? [];
    if (judgementDomains.length) {
      renderJudgementTopics(judgementDomains, el);
      return;
    }
    el.topics.innerHTML = `
      <div class="plugin-header"><p class="eyebrow">分项报告 · 实验功能</p><h2 id="topic-title">单项分析 <span class="badge muted">Beta</span></h2></div>
      <p class="quick-read-lead">该模块用于辅助学习，当前不作为主报告内容。</p>
      <div class="topic-list">
        ${state.reading.topics
          .map(
            (topic) => `
              <article class="topic-card">
                <div class="topic-head"><h3>${topic.label}</h3><span>${topic.id}</span></div>
                <div class="topic-body">
                  <section>
                    <b>主题判断</b>
                    ${topic.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
                  </section>
                  <section>
                    <b>依据</b>
                    <ul>${topic.evidence.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
                  </section>
                </div>
                <div class="tag-row">${topic.signals.map((signal) => `<span>${escapeHtml(signal)}</span>`).join("")}</div>
              </article>
            `,
          )
          .join("")}
      </div>
    `;
  }

  function renderJudgementTopics(domains, el) {
    el.topics.innerHTML = `
      <div class="plugin-header"><p class="eyebrow">分项报告 · 实验功能</p><h2 id="topic-title">单项分析 <span class="badge muted">Beta</span></h2></div>
      <p class="quick-read-lead">该模块用于辅助学习，当前不作为主报告内容。</p>
      <div class="topic-list">
        ${domains.map(renderDomainCard).join("")}
      </div>
    `;
  }

  function renderDomainCard(domain) {
    const sections = domain.sections ?? {};
    return `
      <article class="topic-card">
        <div class="topic-head"><h3>${escapeHtml(domain.label)}</h3><span>${escapeHtml(domain.id)}</span></div>
        <div class="topic-body">
          ${["主题判断", "触发依据", "强弱取舍", "提醒建议"].map((title) => `
            <section>
              <b>${title}</b>
              <p>${escapeHtml(sections[title] ?? "")}</p>
            </section>
          `).join("")}
          <section>
            <b>依据</b>
            <ul>${(domain.evidence ?? []).slice(0, 6).map((item) => `<li>${escapeHtml(item.title)}：${escapeHtml(item.interpretation)}</li>`).join("")}</ul>
          </section>
        </div>
        <div class="tag-row">${(domain.signals ?? []).map((signal) => `<span>${escapeHtml(signal)}</span>`).join("")}</div>
      </article>
    `;
  }

  window.BaziSections = window.BaziSections ?? {};
  window.BaziSections.renderTopicReport = renderTopicReport;
})();
