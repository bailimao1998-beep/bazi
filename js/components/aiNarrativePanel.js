export function renderAiNarrativePanel(root, data) {
  if (!root) return;
  const narrative = data?.narrative;
  root.innerHTML = `
    <h2>AI 剧情讲述</h2>
    <p class="muted">模型只根据后端排盘、规则证据和事件候选生成叙事，不参与排盘、取象或触发判断。</p>
    <article class="narrative">${narrative?.text ?? "等待生成。"}</article>
  `;
}
