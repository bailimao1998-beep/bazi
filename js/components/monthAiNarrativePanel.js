export function renderMonthAiNarrativePanel(root, payload = {}, actions = {}) {
  if (!root) return;
  const state = payload.state ?? {};
  const hasReport = Boolean(payload.hasReport);
  root.innerHTML = `
    <div class="plugin-header">
      <h2>流月 AI 分析</h2>
    </div>
    <p class="muted">只分析当前目标月份。</p>
    <div class="form-actions">
      <button type="button" data-month-ai-generate ${state.loading || !hasReport ? "disabled" : ""}>
        ${state.loading ? "生成中..." : "生成目标流月 AI 分析"}
      </button>
      <span class="muted">${hasReport ? "基于目标月份取象生成。" : "请先完成基础排盘和流月取象。"}</span>
    </div>
    ${state.loading ? `<p class="muted">正在生成目标流月 AI 分析...</p>` : ""}
    ${state.error ? `<p class="error-text">${escapeHtml(state.error)}</p>` : ""}
    ${state.text ? `<article class="ai-narrative-output"><pre>${escapeHtml(state.text)}</pre></article>` : ""}
  `;
  root.querySelector?.("[data-month-ai-generate]")?.addEventListener("click", () => (payload.onGenerate ?? actions.onGenerate)?.());
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
