import { renderAiText } from "./aiTextRenderer.js";
import { buildStageAdvice as buildStageAdviceResult } from "../core/advice/stageAdviceEngine.js";
import {
  buildLuckEvidencePack,
  buildMonthEvidencePack,
  buildYearEvidencePack,
} from "../core/evidence/evidencePackBuilder.js";
import { buildLocalNarrative } from "../core/evidence/narrativeBuilder.js";
import { escapeHtml } from "../utils/html.js";

export function renderStageAnalysisPanel(root, {
  title,
  description,
  report,
  stage = "luck",
  aiState = {},
  aiTitle = "AI 分析",
  aiButton = "生成 AI 分析",
  selector,
  evidenceContext = {},
  onGenerateAi,
  onSelectStageValue,
} = {}) {
  if (!root) return;
  const item = pickStageItem(report, stage);
  const hasReport = Boolean(item?.ganZhi || report);
  const selectorHtml = renderStageLocalSelector(selector);

  root.innerHTML = `
    <div class="stage-analysis-header">
      <div>
        <h2>${escapeHtml(title || "阶段分析")}</h2>
        <p>${escapeHtml(description || "围绕当前选中的阶段展开取象与 AI 分析。")}</p>
      </div>
      ${selectorHtml ? `<div class="stage-analysis-tools">${selectorHtml}</div>` : ""}
    </div>
    <section class="stage-image-content">
      ${hasReport ? renderStageImageCards(report, item, stage, evidenceContext) : `<p class="muted">等待基础排盘后生成取象内容。</p>`}
    </section>
    <section class="stage-ai-collapse stage-ai-below">
      ${renderAiCollapse({
        title: aiTitle,
        button: aiButton,
        state: aiState,
        hasReport,
      })}
    </section>
  `;

  root.querySelector("[data-stage-ai-generate]")?.addEventListener("click", () => onGenerateAi?.());
  root.querySelector("[data-stage-selector]")?.addEventListener("change", (event) => {
    onSelectStageValue?.(event.currentTarget.value);
  });
}

function renderStageLocalSelector(selector = {}) {
  const options = Array.isArray(selector?.options) ? selector.options : [];
  if (!options.length) return "";

  const value = String(selector.value ?? "");
  const label = selector.label || "切换阶段";

  return `
    <label class="stage-local-selector">
      <span>${escapeHtml(label)}</span>
      <select data-stage-selector aria-label="${escapeHtml(label)}" ${selector.disabled ? "disabled" : ""}>
        ${options.map((option) => {
          const optionValue = String(option.value ?? "");
          return `
            <option value="${escapeHtml(optionValue)}" ${optionValue === value ? "selected" : ""}>
              ${escapeHtml(option.label || optionValue || "待查")}
            </option>
          `;
        }).join("")}
      </select>
    </label>
  `;
}

export function renderAiCollapse({ title, button, helper, state = {}, hasReport = false } = {}) {
  const disabled = state.loading || !hasReport;
  const buttonText = state.loading ? "生成中..." : escapeHtml(button || "生成 AI 分析");
  const helperText = state.loading
    ? "正在生成 AI 分析..."
    : (helper || "AI 用来整理语言和扩展解释，不替代原盘判断。");
  const statusLabel = state.loading ? "生成中" : hasReport ? "AI 辅助" : "等待排盘";

  if (!state.text) {
    return `
      <div class="ai-collapse-card ai-collapse-action-only">
        <div class="ai-collapse-toolbar">
          <span class="ai-collapse-status">
            <b>${escapeHtml(statusLabel)}</b>
            <small>${escapeHtml(helperText)}</small>
          </span>
          <button type="button" class="secondary ai-collapse-button" data-stage-ai-generate ${disabled ? "disabled" : ""}>
            ${buttonText}
          </button>
        </div>
        ${state.error ? `<p class="form-error">${escapeHtml(state.error)}</p>` : ""}
      </div>
    `;
  }

  return `
    <details class="ai-collapse-card" open>
      <summary>
        <span>${escapeHtml(aiResultTitle(title))}</span>
        <b class="ai-collapse-summary-action">展开 / 收起</b>
      </summary>
      <div class="ai-collapse-body">
        <div class="ai-collapse-toolbar">
          <span class="ai-collapse-status">
            <b>${escapeHtml(statusLabel)}</b>
            <small>${escapeHtml(helperText)}</small>
          </span>
          <button type="button" class="secondary ai-collapse-button" data-stage-ai-generate ${disabled ? "disabled" : ""}>
            ${buttonText}
          </button>
        </div>
        ${state.loading ? `<p class="muted">正在生成 AI 分析...</p>` : ""}
        ${state.error ? `<p class="form-error">${escapeHtml(state.error)}</p>` : ""}
        ${state.text ? `<div class="ai-collapse-output">${renderAiText(state.text)}</div>` : ""}
      </div>
    </details>
  `;
}

function renderStageImageCards(report = {}, item = {}, stage = "luck", evidenceContext = {}) {
  const summary = report.summary?.overview || item.shortImage || item.image || item.structureImage || "当前阶段取象待复核。";
  const relationGroups = buildRelationGroups(item, stage);
  const evidence = buildEvidenceSignals(report, item, stage);
  const relationTuples = relationGroups.map((group) => [`${group.title}关系触发`, group.relations]);
  const evidencePack = buildStageEvidencePack({ report, stage, evidenceContext });
  const localNarrative = buildLocalNarrative(evidencePack);

  return `
    <div class="stage-card-grid">
      ${renderLocalNarrativeCard(localNarrative)}
      <article class="stage-image-card stage-main-card stage-overview-card">
        <div class="board-title">
          <h3>${escapeHtml(stageTitle(stage, item))}</h3>
          <span>${escapeHtml(item.ganZhi || item.label || "待查")}</span>
        </div>
        ${renderStageFacts(item, stage)}
        <p>${escapeHtml(summary)}</p>
      </article>

      <div class="stage-detail-grid">
        ${renderTransitEvidenceCard({
          title: `${stageLabel(stage)}取象`,
          marker: stageMarker(item, stage),
          summary,
          chips: buildStageChips(item, stage),
          structure: item.structureImage || item.image,
          reality: item.reality,
          boundary: item.boundary,
          relations: relationTuples,
          signals: evidence,
        })}
        <div class="stage-side-stack">
          ${renderAdviceCard({
            stage,
            item,
            report,
            relationGroups,
          })}
        </div>
      </div>
    </div>
  `;
}

function buildStageEvidencePack({ report, stage, evidenceContext = {} }) {
  if (stage === "luck") return buildLuckEvidencePack({
    baseBaziViewModel: evidenceContext.baseBaziViewModel,
    luckImageReport: report,
  });
  if (stage === "year") return buildYearEvidencePack({
    baseBaziViewModel: evidenceContext.baseBaziViewModel,
    luckImageReport: evidenceContext.luckImageReport,
    yearImageReport: report,
  });
  if (stage === "month") return buildMonthEvidencePack({
    baseBaziViewModel: evidenceContext.baseBaziViewModel,
    luckImageReport: evidenceContext.luckImageReport,
    yearImageReport: evidenceContext.yearImageReport,
    monthImageReport: report,
  });
  return null;
}

function renderLocalNarrativeCard(localNarrative) {
  if (!localNarrative) return "";
  const sections = Array.isArray(localNarrative.sections) ? localNarrative.sections : [];
  const mainSection = findNarrativeSection(sections, "命理师讲盘");
  const evidenceSections = ["现实画面", "资料解释"]
    .map((title) => findNarrativeSection(sections, title))
    .filter(Boolean);
  const reviewSections = ["成立条件", "反证边界", "师傅复核点"]
    .map((title) => findNarrativeSection(sections, title))
    .filter(Boolean);
  return `
    <article class="stage-image-card stage-local-narrative-card">
      <div class="stage-local-narrative-head">
        <span>命理师讲盘</span>
        <h3>${escapeHtml(localNarrative.headline || "当前阶段呈现出系统命中的取象主题，现实反馈会围绕这些象展开。")}</h3>
      </div>
      ${localNarrative.basis?.length ? `
        <div class="stage-local-narrative-basis">
          ${localNarrative.basis.map((basis) => `<span>${escapeHtml(basis)}</span>`).join("")}
        </div>
      ` : ""}
      ${mainSection ? `
        <section class="stage-local-narrative-main">
          <h4>${escapeHtml(mainSection.title)}</h4>
          <p>${escapeHtml(mainSection.text)}</p>
        </section>
      ` : ""}
      ${evidenceSections.length ? `
        <div class="stage-local-evidence-chain">
          ${evidenceSections.map((section) => renderNarrativeMiniSection(section)).join("")}
        </div>
      ` : ""}
      ${reviewSections.length ? `
        <details class="stage-local-review-details">
          <summary>
            <span>专业复核</span>
            <b>成立条件 / 反证边界 / 师傅复核点</b>
          </summary>
          <div class="stage-local-review-grid">
            ${reviewSections.map((section) => renderNarrativeMiniSection(section)).join("")}
          </div>
        </details>
      ` : ""}
    </article>
  `;
}

function findNarrativeSection(sections = [], title) {
  return sections.find((section) => section?.title === title);
}

function renderNarrativeMiniSection(section = {}) {
  return `
    <section>
      <h4>${escapeHtml(section.title)}</h4>
      <p>${escapeHtml(section.text)}</p>
    </section>
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

function renderAdviceCard({ stage = "luck", item = {}, report = {}, relationGroups = [] } = {}) {
  const relations = relationGroups.flatMap((group) => normalizeRelations(group.relations));
  const advice = buildStageAdviceResult({
    stage,
    item,
    relations,
    confidence: item.confidence,
  });
  const cards = Array.isArray(advice.cards) ? advice.cards : [];

  return `
    <article class="stage-image-card stage-advice-card">
      <div class="stage-advice-head">
        <div>
          <span>师傅复核建议</span>
          <h3>${escapeHtml(advice.title || `${stageLabel(stage)}建议`)}</h3>
        </div>
        <strong>${escapeHtml(stageMarker(item, stage))}</strong>
      </div>
      ${advice.basis?.length ? `
        <div class="stage-advice-basis">
          ${advice.basis.map((basis) => `<span>${escapeHtml(basis)}</span>`).join("")}
        </div>
      ` : ""}
      <ul class="stage-advice-list">
        ${cards.map((card) => `
          <li>
            <b>${escapeHtml(card.title)}</b>
            <span>${escapeHtml(card.content)}</span>
          </li>
        `).join("")}
      </ul>
    </article>
  `;
}

function renderTransitEvidenceCard({
  title,
  marker,
  chips = [],
  summary,
  structure,
  reality,
  boundary,
  relations = [],
  signals = [],
} = {}) {
  const structureText = structure || summary;
  return `
    <article class="stage-image-card stage-evidence-list transit-image-detail transit-evidence-card">
      <div class="transit-card-compact-head">
        <div>
          <span>取象卡片</span>
          <h3>${escapeHtml(title || "阶段取象")}</h3>
        </div>
        <strong>${escapeHtml(marker || "待查")}</strong>
      </div>

      ${renderDetailChips(chips)}
      ${summary ? `<p class="transit-evidence-lead">${escapeHtml(summary)}</p>` : ""}

      <div class="transit-evidence-mini-grid">
        ${renderMiniEvidenceBlock("结构取象", structureText)}
        ${renderMiniEvidenceBlock("现实应象", reality)}
        ${renderMiniEvidenceBlock("成立边界", boundary)}
        ${renderMiniRelationBlock("关系触发", relations)}
      </div>

      ${renderSignalPills("关键证据", signals)}
    </article>
  `;
}

function renderDetailChips(chips = []) {
  const rows = chips.filter(([, value]) => value !== undefined && value !== null && String(value).trim());
  return rows.length
    ? `<div class="transit-detail-chips">${rows.map(([label, value]) => `<span><b>${escapeHtml(label)}</b>${escapeHtml(value)}</span>`).join("")}</div>`
    : "";
}

function renderMiniEvidenceBlock(title, text) {
  const lines = String(text || "暂无明确描述。")
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

  return `
    <section class="transit-mini-block">
      <h4>${escapeHtml(title)}</h4>
      ${
        lines.length > 1
          ? `<ul>${lines.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ul>`
          : `<p>${escapeHtml(lines[0] || "暂无明确描述。")}</p>`
      }
    </section>
  `;
}

function renderMiniRelationBlock(title, groups = []) {
  const relationTexts = groups
    .filter(([, relations]) => Array.isArray(relations) && relations.length)
    .flatMap(([groupTitle, relations]) => {
      const source = String(groupTitle || "关系触发")
        .replaceAll("关系触发", "")
        .replaceAll("触发", "")
        .trim() || "关系";

      return relations.map((relation) => {
        const label = formatRelationEvidence(relation);
        const effect = relation.effect ? `（${relation.effect}）` : "";
        return `${source}触发：${label}${effect}`;
      });
    })
    .filter(Boolean);

  return `
    <section class="transit-mini-block">
      <h4>${escapeHtml(title)}</h4>
      ${
        relationTexts.length
          ? `<ul>${relationTexts.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
          : `<p>暂未命中冲、合、刑、害、破。</p>`
      }
    </section>
  `;
}

function renderSignalPills(title, signals = []) {
  const visible = compact(signals);
  return `
    <section class="transit-signal-pills">
      <h4>${escapeHtml(title)}</h4>
      <div>
        ${
          visible.length
            ? visible.map((item) => `<span>${escapeHtml(item)}</span>`).join("")
            : `<span>暂无证据条目</span>`
        }
      </div>
    </section>
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

function stageLabel(stage = "luck") {
  if (stage === "luck") return "当前大运";
  if (stage === "year") return "目标流年";
  if (stage === "month") return "目标流月";
  return "阶段";
}

function stageMarker(item = {}, stage = "luck") {
  if (stage === "luck") return item.ganZhi || "待查";
  if (stage === "year") return `${item.year ?? ""} ${item.ganZhi ?? ""}`.trim() || "待查";
  return `${item.year ?? ""}年 ${item.flowMonthLabel || (item.month ? `${item.month}月` : "")} ${item.ganZhi ?? ""}`.trim() || "待查";
}

function aiResultTitle(title = "") {
  if (title.includes("深度")) return "AI 深度分析结果";
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

function buildStageChips(item = {}, stage = "luck") {
  if (stage === "luck") {
    return [
      ["大运", item.ganZhi],
      ["年龄", item.ageRange],
      ["年份", item.yearRange],
      ["天干十神", item.tenGod || item.stemTenGod],
      ["地支主气", item.branchTenGod || item.branchMainTenGod || displayBranchTenGod(item)],
      ["置信度", confidenceLabel(item.confidence)],
    ];
  }
  if (stage === "year") {
    return [
      ["流年", `${item.year ?? ""} ${item.ganZhi ?? ""}`.trim()],
      ["年干十神", item.stemTenGod || item.tenGod],
      ["年支主气", item.branchTenGod || item.branchMainTenGod],
      ["当前大运", item.currentLuckItem?.ganZhi],
      ["置信度", confidenceLabel(item.confidence)],
    ];
  }
  if (stage === "month") {
    return [
      ["流月", `${item.year ?? ""}年 ${item.flowMonthLabel || (item.month ? `${item.month}月` : "")} ${item.ganZhi ?? ""}`.trim()],
      ["月干十神", item.stemTenGod || item.tenGod],
      ["月支主气", item.branchTenGod || item.branchMainTenGod],
      ["当前大运", item.currentLuckItem?.ganZhi],
      ["当前流年", item.yearItem?.ganZhi],
      ["置信度", confidenceLabel(item.confidence)],
    ];
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

function formatRelationEvidence(relation = {}) {
  const type = relation.type || relation.relationType || relation.name || "触发";
  const target =
    relation.natalPillar
    || (relation.luckGanZhi ? `当前大运${relation.luckGanZhi}` : "")
    || (relation.yearGanZhi ? `当前流年${relation.yearGanZhi}` : "")
    || relation.natalBranch
    || (relation.luckBranch ? `大运支${relation.luckBranch}` : "")
    || (relation.yearBranch ? `流年支${relation.yearBranch}` : "")
    || relation.members
    || "";

  return `${type}${target}`;
}

function formatLuck(item = {}) {
  return [item.ganZhi, item.ageRange, item.yearRange].filter(Boolean).join(" / ");
}

function formatYear(item = {}) {
  return [item.year, item.ganZhi].filter(Boolean).join(" / ");
}

function displayBranchTenGod(item = {}) {
  return item.branchTenGod
    || item.branchMainTenGod
    || String(item.structureImage ?? "").match(/地支主气十神为([^，。；]+)/)?.[1]
    || "";
}

function pushLine(lines, value) {
  if (value && String(value).trim()) lines.push(String(value).trim());
}

function compact(items = []) {
  return [...new Set(items.flat()
    .filter((item) => item !== undefined && item !== null && String(item).trim())
    .map((item) => String(item)))];
}

function confidenceLabel(value) {
  return { high: "重点", medium: "可参考", low: "待验证" }[value] ?? value ?? "可参考";
}

function hasFactValue(entry) {
  const [, value] = entry;
  return value !== undefined && value !== null && String(value).trim();
}
