export function renderDebugPanel(root, data) {
  if (!root) return;
  const ruleDebug = (data?.matchedRules ?? []).slice(0, 20).map((rule) => ({
    id: rule.id,
    title: rule.title,
    topic: rule.topic,
    score: rule.score,
    scoreDetail: rule.scoreDetail,
    timing: rule.timing,
    counterEvidence: rule.counterEvidence,
    matchedFacts: rule.matchedFacts,
    version: rule.version,
  }));
  root.innerHTML = `
    <details>
      <summary>规则调试</summary>
      <pre>${escapeHtml(JSON.stringify(ruleDebug, null, 2))}</pre>
    </details>
    <details>
      <summary>完整调试 JSON</summary>
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
