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
  const disabled = state.loading || !hasReport;
  const buttonText = state.loading ? "生成中..." : escapeHtml(button || "生成 AI 分析");
  const helperText = state.loading
    ? "正在生成 AI 分析..."
    : "AI 用来整理语言和扩展解释，不替代原盘判断。";

  if (!state.text) {
    return `
      <div class="ai-collapse-card ai-collapse-action-only">
        <button type="button" class="secondary" data-stage-ai-generate ${disabled ? "disabled" : ""}>
          ${buttonText}
        </button>
        <p class="muted">${escapeHtml(helperText)}</p>
        ${state.error ? `<p class="form-error">${escapeHtml(state.error)}</p>` : ""}
      </div>
    `;
  }

  return `
    <details class="ai-collapse-card" open>
      <summary>
        <span>${escapeHtml(aiResultTitle(title))}</span>
        <b>可折叠</b>
      </summary>
      <div class="ai-collapse-body">
        <button type="button" class="secondary" data-stage-ai-generate ${disabled ? "disabled" : ""}>
          ${buttonText}
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
  const relationGroups = buildRelationGroups(item, stage);
  const evidence = buildEvidenceSignals(report, item, stage);

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
      ${renderEvidenceCard(evidence, report)}
    </div>
  `;
}

function renderStageFacts(item = {}, stage = "luck") {
  const facts = buildStageFacts(item, stage);

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
  return `
    <article class="stage-image-card stage-relation-groups">
      <h3>关系触发</h3>
      ${
        groups.some((group) => group.relations.length)
          ? groups.map((group) => `
              <section>
                <h4>${escapeHtml(group.title)}</h4>
                ${
                  group.relations.length
                    ? `<ul>${group.relations.map((relation) => `<li>${escapeHtml(formatRelation(relation))}</li>`).join("")}</ul>`
                    : `<p class="muted">暂未命中明显关系。</p>`
                }
              </section>
            `).join("")
          : `<p class="muted">暂未命中冲、合、刑、害、破等明显关系。</p>`
      }
    </article>
  `;
}

function renderEvidenceCard(evidence = [], report = {}) {
  const reportSignals = [
    ...(Array.isArray(report.keySignals) ? report.keySignals : []),
    ...(Array.isArray(report.needVerify) ? report.needVerify : []),
  ];
  const lines = [...evidence, ...reportSignals].filter(Boolean).slice(0, 12);
  return `
    <article class="stage-image-card stage-evidence-list">
      <h3>关键证据 / 观察点</h3>
      ${
        lines.length
          ? `<ul>${lines.map((line) => `<li>${escapeHtml(formatEvidence(line))}</li>`).join("")}</ul>`
          : `<p class="muted">暂无额外证据项，先按十神、地支环境与关系触发复核。</p>`
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

function aiResultTitle(title = "") {
  if (title.includes("原局")) return "AI 原局分析结果";
  if (title.includes("大运")) return "AI 大运分析结果";
  if (title.includes("流年")) return "AI 流年分析结果";
  if (title.includes("流月")) return "AI 流月分析结果";
  return `${title || "AI 分析"}结果`;
}

function buildStageFacts(item = {}, stage = "luck") {
  if (stage === "luck") {
    return [
      ["阶段", "大运"],
      ["年龄范围", item.ageRange],
      ["年份范围", item.yearRange],
      ["大运干支", item.ganZhi],
      ["天干十神", item.tenGod || item.stemTenGod],
      ["地支主气", item.branchTenGod || item.branchMainTenGod || displayBranchTenGod(item)],
    ].filter(hasFactValue);
  }
  if (stage === "year") {
    return [
      ["年份", item.year],
      ["流年干支", item.ganZhi],
      ["年干十神", item.stemTenGod || item.tenGod],
      ["年支十神", item.branchTenGod || item.branchMainTenGod],
      ["所在大运", formatLuck(item.currentLuckItem)],
    ].filter(hasFactValue);
  }
  if (stage === "month") {
    return [
      ["月份", item.flowMonthLabel || (item.month ? `${item.month}月` : "")],
      ["流月干支", item.ganZhi],
      ["月干十神", item.stemTenGod || item.tenGod],
      ["月支十神", item.branchTenGod || item.branchMainTenGod],
      ["当前大运", formatLuck(item.currentLuckItem)],
      ["当前流年", formatYear(item.yearItem)],
    ].filter(hasFactValue);
  }
  return [];
}

function buildRelationGroups(item = {}, stage = "luck") {
  const groups = [
    { title: "原局触发", relations: normalizeRelations(item.relationToNatal) },
  ];
  if (stage === "year" || stage === "month") {
    groups.push({ title: "大运触发", relations: normalizeRelations(item.relationToLuck) });
  }
  if (stage === "month") {
    groups.push({ title: "流年触发", relations: normalizeRelations(item.relationToYear) });
  }
  return groups;
}

function buildEvidenceSignals(report = {}, item = {}, stage = "luck") {
  const lines = [];
  if (stage === "luck") {
    pushLine(lines, `大运阶段：${item.ageRange || "年龄待查"}，${item.yearRange || "年份待查"}。`);
    pushLine(lines, `大运干支：${item.ganZhi || "待查"}，天干十神 ${item.tenGod || item.stemTenGod || "待查"}，地支主气 ${item.branchTenGod || item.branchMainTenGod || displayBranchTenGod(item) || "待查"}。`);
  }
  if (stage === "year") {
    pushLine(lines, `目标流年：${item.year || "待查"} 年 ${item.ganZhi || "待查"}。`);
    pushLine(lines, `年干十神 ${item.stemTenGod || item.tenGod || "待查"}，年支十神 ${item.branchTenGod || item.branchMainTenGod || "待查"}。`);
    pushLine(lines, `所在大运：${formatLuck(item.currentLuckItem) || "待查"}。`);
  }
  if (stage === "month") {
    pushLine(lines, `目标流月：${item.flowMonthLabel || (item.month ? `${item.month}月` : "待查")} ${item.ganZhi || ""}`.trim());
    pushLine(lines, `月干十神 ${item.stemTenGod || item.tenGod || "待查"}，月支十神 ${item.branchTenGod || item.branchMainTenGod || "待查"}。`);
    pushLine(lines, `当前大运：${formatLuck(item.currentLuckItem) || "待查"}。`);
    pushLine(lines, `当前流年：${formatYear(item.yearItem) || "待查"}。`);
  }
  const relations = buildRelationGroups(item, stage)
    .flatMap((group) => group.relations.map((relation) => `${group.title}：${formatRelation(relation)}`));
  lines.push(...relations.slice(0, 6));
  const summaryLine = report.summary?.overview || report.summary?.focus;
  pushLine(lines, summaryLine);
  return lines;
}

function normalizeRelations(relations) {
  return (Array.isArray(relations) ? relations : []).filter(Boolean);
}

function formatRelation(relation = {}) {
  return relation.description
    || [relation.type || relation.relationType || relation.name, relation.members, relation.effect].filter(Boolean).join("，")
    || "关系触发";
}

function formatEvidence(item) {
  if (typeof item === "string") return item;
  return item.description || item.text || item.name || item.title || JSON.stringify(item);
}

function formatLuck(item = {}) {
  return [item.ganZhi, item.ageRange, item.yearRange].filter(Boolean).join(" / ");
}

function formatYear(item = {}) {
  return [item.year, item.ganZhi].filter(Boolean).join(" / ");
}

function pushLine(lines, value) {
  if (value && String(value).trim()) lines.push(String(value).trim());
}

function hasFactValue(entry) {
  const [, value] = entry;
  return value !== undefined && value !== null && String(value).trim();
}
