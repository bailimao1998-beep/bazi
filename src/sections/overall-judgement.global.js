(function () {
  const { escapeHtml } = window.BaziShared;
  const { buildCoreReadingReport } = window.BaziCoreReadingReportEngine;

  function renderOverallJudgement({ state, el }) {
    const report = buildCoreReadingReport({ reading: state.reading, state });
    el.overall.innerHTML = `
      <div class="plugin-header"><p class="eyebrow">结构报告</p><h2 id="overall-title">核心解读报告</h2></div>
      ${renderReportHeadline(report)}
      ${renderLearningNotice()}
      ${renderPrioritySignals(report)}
      ${renderTeacherSummary(report)}
      ${renderReportStructure(report)}
      ${renderReportEvidenceChain(report)}
      ${renderReportThemes(report)}
      ${renderReportUncertainty(report)}
      ${renderReportTransitBridge(report)}
    `;
  }

  function renderReportHeadline(report) {
    return `
      <section class="analysis-block overall-report-section">
        <h3>报告标题</h3>
        <p class="reading-lead">${safe(report.headline)}</p>
      </section>
    `;
  }

  function renderLearningNotice() {
    return `
      <section class="analysis-block overall-report-section">
        <h3>统一学习提示</h3>
        <p class="reading-lead">本报告用于结构学习：先看盘面最突出的信号，再回到柱位、旺衰、十神和岁运复核。以下内容不替代人工判断。</p>
      </section>
    `;
  }

  function renderPrioritySignals(report) {
    return `
      <section class="analysis-block priority-reading-section">
        <h3>读盘重点排序</h3>
        <div class="priority-signal-grid">
          ${(report.prioritySignals ?? []).map(renderPrioritySignalCard).join("")}
        </div>
      </section>
    `;
  }

  function renderPrioritySignalCard(signal) {
    return `
      <article class="priority-signal-card priority-level-${safe(signal.level)}">
        <div class="priority-signal-head">
          <span>第${safe(signal.rank)}重点</span>
          <b>${safe(signal.level)}</b>
        </div>
        <strong>${safe(signal.title)}</strong>
        <p><b>为什么重要：</b>${safe(signal.whyImportant)}</p>
        <p><b>盘面证据：</b>${safe(signal.evidence)}</p>
        <p><b>怎么读：</b>${safe(signal.howToRead)}</p>
        <p><b>下一步看什么：</b>${safe(signal.nextCheck)}</p>
      </article>
    `;
  }

  function renderTeacherSummary(report) {
    return `
      <section class="analysis-block overall-report-section">
        <h3>老师式讲盘摘要</h3>
        <div class="report-copy">
          ${(report.teacherSummary ?? []).map((line) => `<p>${safe(line)}</p>`).join("")}
        </div>
      </section>
    `;
  }

  function renderReportStructure(report) {
    return `
      <section class="analysis-block quick-read-section">
        <h3>结构重点</h3>
        <div class="field-guide-grid">
          ${(report.structureSections ?? []).map(renderReportStructureCard).join("")}
        </div>
      </section>
    `;
  }

  function renderReportStructureCard(section) {
    return `
      <article>
        <strong>${safe(section.title)}</strong>
        <p><b>盘面证据：</b>${safe(section.evidence)}</p>
        <p><b>怎么理解：</b>${safe(section.explanation)}</p>
        <p><b>还要验证什么：</b>${safe(section.needVerify)}</p>
      </article>
    `;
  }

  function renderReportThemes(report) {
    return `
      <section class="analysis-block quick-read-section">
        <h3>主题观察</h3>
        <div class="field-guide-grid">
          ${(report.themeSections ?? []).map(renderReportThemeCard).join("")}
        </div>
      </section>
    `;
  }

  function renderReportThemeCard(section) {
    return `
      <article>
        <strong>${safe(section.title)}</strong>
        <p><b>当前观察点：</b>${safe(section.observation)}</p>
        <p><b>依据来自哪里：</b>${safe(section.evidence)}</p>
        <p><b>暂不能下结论的原因：</b>${safe(section.limitation)}</p>
      </article>
    `;
  }

  function renderReportEvidenceChain(report) {
    return `
      <section class="analysis-block quick-read-section">
        <h3>证据链</h3>
        <div class="quick-read-steps evidence-chain-list">
          ${(report.evidenceChain ?? []).map(renderReportEvidenceStep).join("")}
        </div>
      </section>
    `;
  }

  function renderReportEvidenceStep(item) {
    return `
      <article class="quick-read-step evidence-chain-step">
        <span>${safe(String(item.step).padStart(2, "0"))}</span>
        <div>
          <strong>${safe(item.title)}</strong>
          <p><b>证据：</b>${safe(item.evidence)}</p>
          <p><b>含义：</b>${safe(item.meaning)}</p>
          <p><b>下一步：</b>${safe(item.nextCheck)}</p>
        </div>
      </article>
    `;
  }

  function renderReportUncertainty(report) {
    return `
      <section class="analysis-block quick-read-section">
        <h3>风险与不确定</h3>
        <div class="signal-list compact">
          ${(report.uncertaintyNotes ?? []).map((item) => `<article class="signal"><strong>${safe(item.title)}</strong><p>${safe(item.text)}</p></article>`).join("")}
        </div>
      </section>
    `;
  }

  function renderReportTransitBridge(report) {
    return `
      <section class="analysis-block quick-read-section">
        <h3>下一步看岁运</h3>
        <p class="reading-lead">${safe(report.transitBridge)}</p>
      </section>
    `;
  }

  function safe(value) {
    return escapeHtml(value ?? "");
  }

  window.BaziSections = window.BaziSections ?? {};
  window.BaziSections.renderOverallJudgement = renderOverallJudgement;
})();
