(function () {
  const { getTransitMonths, getTransitYears } = window.BaziEngine;
  const { escapeHtml, renderEnergyBars, renderPillarCard, renderSignal } = window.BaziShared;

  function renderTransitLuck({ state, el, updateReading }) {
    const years = getTransitYears(state.selectedYear, 5);
    const months = getTransitMonths(state.selectedYear);
    el.timeline.innerHTML = `
      <div class="plugin-header"><p class="eyebrow">大运流年</p><h2 id="transit-title">岁运推演</h2></div>
      ${renderLuckBoard(state)}
      <div class="transit-layout">
        <div class="flow-focus">
          ${renderPillarCard(state.reading.transit.selectedYear)}
          ${state.reading.transit.selectedMonth ? renderPillarCard(state.reading.transit.selectedMonth) : ""}
        </div>
        <div>
          <h3>流年</h3>
          <div class="year-strip">
            ${years.map(({ year, pillar }) => `<button class="flow-chip ${year === state.selectedYear ? "is-active" : ""}" data-year="${year}"><span>${year}</span><strong>${pillar.label}</strong></button>`).join("")}
          </div>
          <h3>流月</h3>
          <div class="month-board">
            ${months.map(({ month, pillar }) => `<button class="flow-chip month ${month === state.selectedMonth ? "is-active" : ""}" data-month="${month}"><span>${month}月</span><strong>${pillar.label}</strong></button>`).join("")}
          </div>
        </div>
      </div>
      ${renderTransitInspector(state)}
    `;
    el.timeline.querySelectorAll("[data-year]").forEach((button) => {
      button.addEventListener("click", () => {
        state.selectedYear = Number(button.dataset.year);
        state.selectedLuckIndex = findLuckIndexByYear(state, state.selectedYear);
        updateReading();
      });
    });
    el.timeline.querySelectorAll("[data-month]").forEach((button) => {
      button.addEventListener("click", () => {
        state.selectedMonth = Number(button.dataset.month);
        updateReading();
      });
    });
    el.timeline.querySelectorAll("[data-luck-index]").forEach((button) => {
      button.addEventListener("click", () => {
        state.selectedLuckIndex = Number(button.dataset.luckIndex);
        state.selectedYear = Number(button.dataset.luckYear);
        state.selectedMonth = 1;
        updateReading();
      });
    });
  }

  function renderLuckBoard(state) {
    const luck = state.reading.luck;
    const selectedLuck = state.reading.transit.selectedLuck ?? luck.pillars[state.selectedLuckIndex] ?? luck.pillars[0];
    return `
      <section class="data-board luck-board">
        <div class="board-title"><h3>大运</h3><span>${luck.gender === "male" ? "男命" : "女命"} · ${luck.directionLabel} · 约${luck.startAge}岁起运 · 当前${selectedLuck?.label ?? ""}</span></div>
        <div class="luck-table">
          ${luck.pillars
            .map(
              (item, index) => `
                <button class="luck-cell ${index === state.selectedLuckIndex ? "is-active" : ""}" data-luck-index="${index}" data-luck-year="${item.startYear}">
                  <span>${item.startAge}-${item.endAge}岁</span>
                  <strong>${item.label}</strong>
                  <small>${item.startYear}-${item.endYear}</small>
                </button>
              `,
            )
            .join("")}
        </div>
        <p class="fine-print">${escapeHtml(luck.startNote)}</p>
      </section>
    `;
  }

  function renderTransitInspector(state) {
    const { triggers, hits, energyDelta } = state.reading.transit;
    const judgementTransit = state.reading.judgement?.transit;
    return `
      ${judgementTransit ? renderJudgementTransit(judgementTransit) : ""}
      <section class="analysis-block">
        <h3>组合与能量</h3>
        <div class="mini-energy">${renderEnergyBars(energyDelta)}</div>
        <h3>岁运命中原局</h3>
        <div class="transit-hit-list">
          ${
            hits.length
              ? hits.map((hit) => `<article><strong>${escapeHtml(hit.transit)} → ${escapeHtml(hit.target)}</strong><p>${escapeHtml(hit.relation)}：${escapeHtml(hit.interpretation)}</p><small>${escapeHtml(hit.domains.join("、"))}</small></article>`).join("")
              : `<article><strong>暂无直接命中</strong><p>当前流年流月未直接触发原局地支关系，先看透干十神和五行增减。</p></article>`
          }
        </div>
        <div class="signal-list">${triggers.map(renderSignal).join("")}</div>
      </section>
    `;
  }

  function renderJudgementTransit(transit) {
    return `
      <section class="analysis-block">
        <h3>岁运分层</h3>
        <div class="transit-hit-list">
          ${renderTransitLayer("十年环境", transit.majorLuck)}
          ${renderTransitLayer("年度触发", transit.annual)}
          ${renderTransitLayer("月度窗口", transit.monthly)}
        </div>
      </section>
    `;
  }

  function renderTransitLayer(title, layer) {
    if (!layer) return "";
    const evidence = layer.evidence ?? [];
    return `
      <article>
        <strong>${escapeHtml(title)}</strong>
        <p>${escapeHtml(layer.summary)}</p>
        ${evidence.length ? `<small>${escapeHtml(evidence.slice(0, 3).map((item) => item.title).join("；"))}</small>` : ""}
      </article>
    `;
  }

  function findLuckIndexByYear(state, year) {
    const index = (state.reading?.luck?.pillars ?? []).findIndex((item) => year >= item.startYear && year <= item.endYear);
    return index >= 0 ? index : state.selectedLuckIndex;
  }

  window.BaziSections = window.BaziSections ?? {};
  window.BaziSections.renderTransitLuck = renderTransitLuck;
})();
