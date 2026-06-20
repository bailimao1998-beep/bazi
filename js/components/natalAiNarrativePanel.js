import { renderAiCollapse } from "./stageAnalysisPanel.js";

export function renderNatalAiNarrativePanel(root, payload = {}, actions = {}) {
  if (!root) return;
  const state = payload.state ?? {};
  const hasReport = Boolean(payload.hasReport);
  root.innerHTML = renderAiCollapse({
    title: "AI 深度分析",
    button: "生成原局 AI 深度分析",
    helper: "AI 会基于上方命局画像和命中取象清单扩展说明，不重新排盘。",
    state,
    hasReport,
  });
  root.querySelector("[data-stage-ai-generate]")?.addEventListener("click", () => (payload.onGenerate ?? actions.onGenerate)?.());
}
