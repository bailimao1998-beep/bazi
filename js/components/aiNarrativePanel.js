export function renderAiNarrativePanel(root, data) {
  const narrative = data?.narrative;
  root.innerHTML = `
    <h2>AI 剧情讲述</h2>
    <p class="muted">模型只负责根据本地 storyTags 扩写，不参与排盘和规则判断。</p>
    <article class="narrative">${narrative?.text ?? "等待生成。"}</article>
  `;
}
