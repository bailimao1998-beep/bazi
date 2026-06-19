import { renderAiCollapse } from "./stageAnalysisPanel.js";

export function renderNatalAiNarrativePanel(root, payload = {}, actions = {}) {
  if (!root) return;
  const state = payload.state ?? {};
  const hasReport = Boolean(payload.hasReport);
  root.innerHTML = renderAiCollapse({
    title: "AI 原局分析",
    button: "生成原局 AI 分析",
    state,
    hasReport,
  });
  root.querySelector("[data-stage-ai-generate]")?.addEventListener("click", () => (payload.onGenerate ?? actions.onGenerate)?.());
}
