export function renderYearStoryPanel(root, data, actions = {}) {
  if (!root) return;
  const year = data?.yearInfluence;
  const years = data?.transitYears ?? [];
  const yearTags = (data?.storyTags ?? []).filter((tag) => tag.period === "year");
  if (!year) {
    root.innerHTML = `<p class="muted">等待年度主线。</p>`;
    return;
  }
  root.innerHTML = `
    <div class="plugin-header">
      <p class="eyebrow">流年</p>
      <h2>年度主线</h2>
    </div>
    <article class="story-card">
      <strong>${year.year} · ${year.pillar.label}</strong>
      <p>${year.evidence.join("；")}</p>
      <div class="tag-row">${yearTags.map((tag) => `<span>${escapeHtml(tag.tag)}</span>`).join("")}</div>
    </article>
    <div class="year-strip compact-strip">
      ${years.map(({ year: itemYear, pillar }) => `
        <button class="flow-chip ${itemYear === year.year ? "is-active" : ""}" data-year="${itemYear}">
          <span>${itemYear}</span><strong>${pillar.label}</strong>
        </button>
      `).join("")}
    </div>
    <div class="signal-list">
      ${(year.relationHits ?? []).map((hit) => `
        <article class="signal">
          <div><strong>${escapeHtml(hit.type)}</strong><span class="badge muted">候选参考</span></div>
          <p>${escapeHtml(hit.evidence)}</p>
          <small>${escapeHtml(hit.target)}</small>
        </article>
      `).join("") || `<article class="signal"><strong>年度触发</strong><p>当前先看流年天干、地支主气和大运环境。</p></article>`}
    </div>
  `;
  root.querySelectorAll("[data-year]").forEach((button) => {
    button.addEventListener("click", () => actions.onSelectYear?.(Number(button.dataset.year)));
  });
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
