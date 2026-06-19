import { renderAiText } from "./aiTextRenderer.js";
import { escapeHtml } from "../utils/html.js";

export function renderStageAnalysisPanel(root, {
  title,
  description,
  report,
  stage = "luck",
  aiState = {},
  aiTitle = "AI 分析",
  aiButton = "生成 AI 分析",
  onGenerateAi,
} = {}) {
  if (!root) return;
  const item = pickStageItem(report, stage);
  const hasReport = Boolean(item?.ganZhi || report);

  root.innerHTML = `
    <div class="stage-analysis-header">
      <div>
        <h2>${escapeHtml(title || "阶段分析")}</h2>
        <p>${escapeHtml(description || "围绕当前选中的阶段展开取象与 AI 分析。")}</p>
      </div>
      ${renderAiCollapse({
        title: aiTitle,
        button: aiButton,
        state: aiState,
        hasReport,
      })}
    </div>
    <section class="stage-image-content">
      ${hasReport ? renderStageImageCards(report, item, stage) : `<p class="muted">等待基础排盘后生成取象内容。</p>`}
    </section>
  `;

  root.querySelector("[data-stage-ai-generate]")?.addEventListener("click", () => onGenerateAi?.());
}

export function renderAiCollapse({ title, button, state = {}, hasReport = false } = {}) {
  return `
    <details class="ai-collapse-card">
      <summary>
        <span>${escapeHtml(title || "AI 分析")}</span>
        <b>${state.text ? "已生成" : "展开"}</b>
      </summary>
      <div class="ai-collapse-body">
        <p class="muted">AI 用来整理语言和扩展解释，不替代原盘判断。</p>
        <button type="button" class="secondary" data-stage-ai-generate ${state.loading || !hasReport ? "disabled" : ""}>
          ${state.loading ? "生成中..." : escapeHtml(button || "生成 AI 分析")}
        </button>
        ${state.loading ? `<p class="muted">正在生成 AI 分析...</p>` : ""}
        ${state.error ? `<p class="form-error">${escapeHtml(state.error)}</p>` : ""}
        ${state.text ? `<div class="ai-collapse-output">${renderAiText(state.text)}</div>` : ""}
      </div>
    </details>
  `;
}

function renderStageImageCards(report = {}, item = {}, stage = "luck") {
  const summary = report.summary?.overview || item.shortImage || item.image || item.structureImage || "当前阶段取象待复核。";
  const relationGroups = [
    ["原局关系", item.relationToNatal],
    ["大运关系", item.relationToLuck],
    ["流年关系", item.relationToYear],
  ];

  return `
    <div class="stage-card-grid">
      <article class="stage-image-card stage-main-card">
        <div class="board-title">
          <h3>${escapeHtml(stageTitle(stage, item))}</h3>
          <span>${escapeHtml(item.ganZhi || item.label || "待查")}</span>
        </div>
        ${renderStageFacts(item, stage)}
        <p>${escapeHtml(summary)}</p>
      </article>

      ${renderTextCard("结构取象", item.structureImage || item.image)}
      ${renderTextCard("现实应象", item.reality)}
      ${renderTextCard("成立边界", item.boundary)}
      ${renderRelationCard(relationGroups)}
    </div>
  `;
}

function renderStageFacts(item = {}, stage = "luck") {
  const facts = [
    ["阶段", stageTitle(stage, item)],
    ["天干十神", item.tenGod || item.stemTenGod],
    ["地支主气", item.branchTenGod || item.branchMainTenGod],
    ["范围", item.ageRange || item.yearRange || item.year || (item.month ? `${item.year ?? ""}年${item.month}月` : "")],
  ].filter(([, value]) => value !== undefined && value !== null && String(value).trim());

  return `
    <div class="stage-fact-row">
      ${facts.map(([label, value]) => `<span><b>${escapeHtml(label)}</b>${escapeHtml(value)}</span>`).join("")}
    </div>
  `;
}

function renderTextCard(title, text) {
  return text
    ? `<article class="stage-image-card"><h3>${escapeHtml(title)}</h3><p>${escapeHtml(text)}</p></article>`
    : "";
}

function renderRelationCard(groups = []) {
  const relationTexts = groups
    .filter(([, relations]) => Array.isArray(relations) && relations.length)
    .flatMap(([title, relations]) => relations.map((relation) => `${title}：${relation.description || relation.effect || relation.type || "关系触发"}`));

  return `
    <article class="stage-image-card">
      <h3>关系触发</h3>
      ${
        relationTexts.length
          ? `<ul>${relationTexts.map((text) => `<li>${escapeHtml(text)}</li>`).join("")}</ul>`
          : `<p class="muted">暂未命中冲、合、刑、害、破等明显关系。</p>`
      }
    </article>
  `;
}

function pickStageItem(report = {}, stage = "luck") {
  if (stage === "luck") {
    return report.luckItems?.find((item) => item.isCurrent) ?? report.luckItems?.[0] ?? {};
  }
  if (stage === "year") return report.yearItem ?? {};
  if (stage === "month") return report.monthItem ?? {};
  return {};
}

function stageTitle(stage, item = {}) {
  if (stage === "luck") return `当前大运 ${item.ageRange || ""}`.trim();
  if (stage === "year") return `目标流年 ${item.year || ""}`.trim();
  if (stage === "month") return `目标流月 ${item.month || ""}月`.trim();
  return "阶段取象";
}
