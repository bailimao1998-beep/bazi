export function renderNatalAiNarrativePanel(root, payload = {}, actions = {}) {
  if (!root) return;
  const state = payload.state ?? {};
  const hasReport = Boolean(payload.hasReport);
  root.innerHTML = `
    <div class="plugin-header">
      <p class="eyebrow">原局 AI 分析</p>
      <h2>原局 AI 分析</h2>
    </div>
    <p class="muted">AI 只解释原局取象，不参与排盘和取象。</p>
    <div class="form-actions">
      <button type="button" data-natal-ai-generate ${state.loading || !hasReport ? "disabled" : ""}>
        ${state.loading ? "生成中..." : "生成原局 AI 分析"}
      </button>
      <span class="muted">${hasReport ? "基于当前 natalImageReport 生成。" : "请先完成基础排盘和原局取象。"}</span>
    </div>
    ${state.loading ? `<p class="muted">正在生成原局 AI 分析...</p>` : ""}
    ${state.error ? `<p class="error-text">${escapeHtml(state.error)}</p>` : ""}
    ${state.text ? `<article class="ai-narrative-output"><pre>${escapeHtml(state.text)}</pre></article>` : ""}
  `;
  root.querySelector("[data-natal-ai-generate]")?.addEventListener("click", () => (payload.onGenerate ?? actions.onGenerate)?.());
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
