export function renderDebugPanel(root, data) {
  root.innerHTML = `
    <details>
      <summary>调试 JSON</summary>
      <pre>${escapeHtml(JSON.stringify(data ?? {}, null, 2))}</pre>
    </details>
  `;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
