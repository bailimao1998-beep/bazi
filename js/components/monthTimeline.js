export function renderMonthTimeline(root, data, actions = {}) {
  if (!root) return;
  const months = data?.monthInfluences ?? [];
  const selectedMonth = data?.selection?.selectedMonth ?? 1;
  const selectedLuck = data?.selectedLuck;
  const luckPillars = data?.chart?.luckCycles?.pillars ?? [];
  if (!months.length) {
    root.innerHTML = `<p class="muted">等待流月时间线。</p>`;
    return;
  }
  root.innerHTML = `
    <div class="plugin-header">
      <p class="eyebrow">大运流月</p>
      <h2>岁运推演</h2>
    </div>
    ${renderLuckBoard(data, luckPillars, selectedLuck)}
    <div class="transit-layout">
      <div class="flow-focus">
        ${renderFocusPillar(data.yearInfluence?.pillar, `${data.yearInfluence?.year ?? ""} 流年`)}
        ${renderFocusPillar(data.selectedMonthInfluence?.pillar, `${selectedMonth}月流月`)}
      </div>
      <div>
        <h3>流月</h3>
        <div class="month-board">
          ${months.map((month) => `
            <button class="flow-chip month ${month.month === selectedMonth ? "is-active" : ""}" data-month="${month.month}">
              <span>${month.month}月 · ${month.role}</span>
              <strong>${month.pillar.label}</strong>
            </button>
          `).join("")}
        </div>
      </div>
    </div>
    ${renderMonthInspector(data)}
  `;
  root.querySelectorAll("[data-month]").forEach((button) => {
    button.addEventListener("click", () => actions.onSelectMonth?.(Number(button.dataset.month)));
  });
  root.querySelectorAll("[data-luck-index]").forEach((button) => {
    const luck = luckPillars[Number(button.dataset.luckIndex)];
    button.addEventListener("click", () => actions.onSelectLuck?.(luck));
  });
}

function renderLuckBoard(data, luckPillars, selectedLuck) {
  const luck = data?.chart?.luckCycles;
  return `
    <section class="data-board luck-board">
      <div class="board-title">
        <h3>大运</h3>
        <span>${luck?.directionLabel ?? "待查"} · ${luck?.startAgeText ?? "起运待查"} · 当前 ${selectedLuck?.label ?? ""}</span>
      </div>
      <div class="luck-table">
        ${luckPillars.map((pillar, index) => `
          <button class="luck-cell ${selectedLuck?.index === pillar.index ? "is-active" : ""}" data-luck-index="${index}">
            <span>${pillar.startAge}-${pillar.endAge}岁</span>
            <strong>${pillar.label}</strong>
            <small>${pillar.startYear}-${pillar.endYear}</small>
          </button>
        `).join("")}
      </div>
      <p class="fine-print">${escapeHtml(luck?.startNote ?? "")}</p>
    </section>
  `;
}

function renderMonthInspector(data) {
  const month = data.selectedMonthInfluence;
  const tags = (data.storyTags ?? []).filter((tag) => tag.period === "month" && (!tag.month || tag.month === month?.month));
  return `
    <section class="analysis-block">
      <h3>月度窗口</h3>
      <div class="transit-hit-list">
        <article>
          <strong>${month?.month ?? ""}月 ${month?.pillar?.label ?? ""}</strong>
          <p>${escapeHtml(month?.evidence?.join("；") ?? "")}</p>
          <small>${escapeHtml(month?.needVerify?.join("；") ?? "")}</small>
        </article>
      </div>
      <div class="tag-row month-tags">
        ${tags.map((tag) => `<span>${escapeHtml(tag.tag)}</span>`).join("")}
      </div>
    </section>
  `;
}

function renderFocusPillar(pillar, title) {
  if (!pillar) return "";
  return `
    <article class="pillar-card">
      <span>${escapeHtml(title)}</span>
      <strong>${pillar.label}</strong>
      <small>${escapeHtml(pillar.stemElement)} / ${escapeHtml(pillar.branchElement)}</small>
    </article>
  `;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
