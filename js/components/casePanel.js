export function renderCasePanel(root, panelState = {}, actions = {}) {
  if (!root) return;
  const cases = Array.isArray(panelState.cases) ? panelState.cases.slice(0, 10) : [];
  const draft = panelState.draft ?? {};
  root.innerHTML = `
    <div class="plugin-header">
      <p class="eyebrow">案例工作台</p>
      <h2>本地案例保存</h2>
    </div>
    <div class="case-panel-grid">
      <label>
        <span>师傅备注</span>
        <textarea name="teacherNotes" rows="4" placeholder="记录现实背景、成立条件、反证条件和后续复核点。">${escapeHtml(draft.teacherNotes ?? "")}</textarea>
      </label>
      <label>
        <span>Tags</span>
        <input name="caseTags" value="${escapeHtml(draft.tags ?? "")}" placeholder="事业, 2026, 待复盘" />
      </label>
      <label>
        <span>反馈</span>
        <select name="caseFeedback">
          ${["待验证", "较准", "不准", "已应验"].map((item) => `<option value="${item}" ${draft.feedback === item ? "selected" : ""}>${item}</option>`).join("")}
        </select>
      </label>
    </div>
    <div class="form-actions">
      <button type="button" data-case-save ${panelState.canSave ? "" : "disabled"}>保存当前案例</button>
      <button type="button" data-case-refresh>刷新案例列表</button>
      <span class="muted">${escapeHtml(panelState.status ?? "案例仅保存在本机。")}</span>
    </div>
    ${panelState.lastSavedId ? `<p class="muted">最近保存案例 ID：${escapeHtml(panelState.lastSavedId)}</p>` : ""}
    <section class="case-list-section">
      <div class="board-title"><h3>最近 10 个案例</h3><span>${cases.length} 条</span></div>
      ${cases.length ? `<ol class="case-list">${cases.map(renderCaseSummary).join("")}</ol>` : `<p class="muted">暂无本地案例。</p>`}
    </section>
  `;

  root.querySelector("[data-case-save]")?.addEventListener("click", () => {
    actions.onSave?.(collectDraft(root));
  });
  root.querySelector("[data-case-refresh]")?.addEventListener("click", () => actions.onRefresh?.());
}

function renderCaseSummary(item = {}) {
  const input = item.inputSummary ?? {};
  const tags = Array.isArray(item.tags) ? item.tags.join("、") : "";
  return `
    <li>
      <strong>${escapeHtml(item.title ?? item.id ?? "未命名案例")}</strong>
      <span>${escapeHtml(input.name ?? "未署名")} · ${escapeHtml(item.selection?.targetYear ?? "年度待选")} · ${escapeHtml(item.feedback ?? "待验证")}</span>
      ${tags ? `<small>${escapeHtml(tags)}</small>` : ""}
    </li>
  `;
}

function collectDraft(root) {
  return {
    teacherNotes: root.querySelector("[name='teacherNotes']")?.value ?? "",
    tags: root.querySelector("[name='caseTags']")?.value ?? "",
    feedback: root.querySelector("[name='caseFeedback']")?.value ?? "待验证",
  };
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
