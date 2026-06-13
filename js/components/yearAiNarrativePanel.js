export function renderYearAiNarrativePanel(root, payload = {}, actions = {}) {
  if (!root) return;
  const state = payload.state ?? {};
  const hasReport = Boolean(payload.hasReport);
  root.innerHTML = `
    <div class="plugin-header">
      <p class="eyebrow">流年 AI 分析</p>
      <h2>流年 AI 分析</h2>
    </div>
    <p class="muted">只分析当前目标年份。</p>
    <div class="form-actions">
      <button type="button" data-year-ai-generate ${state.loading || !hasReport ? "disabled" : ""}>
        ${state.loading ? "生成中..." : "生成目标流年 AI 分析"}
      </button>
      <span class="muted">${hasReport ? "基于目标年份取象生成。" : "请先完成基础排盘和流年取象。"}</span>
    </div>
    ${state.loading ? `<p class="muted">正在生成目标流年 AI 分析...</p>` : ""}
    ${state.error ? `<p class="error-text">${escapeHtml(state.error)}</p>` : ""}
    ${state.text ? `<article class="ai-narrative-output"><pre>${escapeHtml(state.text)}</pre></article>` : ""}
  `;
  root.querySelector?.("[data-year-ai-generate]")?.addEventListener("click", () => (payload.onGenerate ?? actions.onGenerate)?.());
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
