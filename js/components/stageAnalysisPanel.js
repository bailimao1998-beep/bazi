import { renderAiText } from "./aiTextRenderer.js";
import { buildStageAdvice as buildStageAdviceResult } from "../core/advice/stageAdviceEngine.js";
import {
  buildLuckEvidencePack,
  buildMonthEvidencePack,
  buildYearEvidencePack,
} from "../core/evidence/evidencePackBuilder.js";
import { buildLocalNarrative } from "../core/evidence/narrativeBuilder.js";
import { escapeHtml } from "../utils/html.js";
import { buildStagePresentationModel } from "../core/transit/buildStagePresentationModel.js";

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
  const evidencePack = buildStageEvidencePack({
    report,
    stage,
    evidenceContext,
  });

  const localNarrative = buildLocalNarrative(evidencePack);

  const model = buildStagePresentationModel({
    stage,
    item,
    report,
    evidencePack,
    localNarrative,
  });

  return `
    <div class="stage-card-grid stage-card-grid-v2">
      ${renderStageQuickSummary(model)}
      ${renderStageEvidenceDetails(model, evidencePack)}
    </div>
  `;
}

function renderStageQuickSummary(model = {}) {
  const contextChain =
    Array.isArray(model.contextChain)
      ? model.contextChain
      : [];

  const focusDomains =
    Array.isArray(model.focusDomains)
      ? model.focusDomains
      : [];

  const keyFacts =
    Array.isArray(model.keyFacts)
      ? model.keyFacts
      : [];

  const advantages =
    Array.isArray(model.advantages)
      ? model.advantages
      : [];

  const pressures =
    Array.isArray(model.pressures)
      ? model.pressures
      : [];

  const structureFacts =
    Array.isArray(model.structureFacts)
      ? model.structureFacts
      : [];

  const structureSummary =
    model.structureSummary ?? null;

  const triggeredImages =
    model.triggeredImages ?? {};

  const themeHierarchy =
    model.themeHierarchy ??
    triggeredImages.themeHierarchy ??
    {};

  const structureLabels = [
    ...new Set(
      structureFacts
        .filter(
          (fact) =>
            Number(fact?.strength || 0) >= 3 &&
            fact?.label !== "层级并行" &&
            fact?.status !== "arch_condition",
        )
        .map((fact) => fact?.label)
        .filter(Boolean),
    ),
  ].slice(0, 6);

  const targetText =
    [
      model.target?.label,
      model.target?.ganZhi,
    ]
      .filter(Boolean)
      .join(" · ") ||
    "待查";

  return `
    <article class="stage-image-card stage-quick-summary stage-quick-summary-v2">
      <header class="stage-quick-head stage-quick-head-v2">
        <div class="stage-quick-title">
          <span class="stage-section-kicker">阶段速断</span>
          <h3>${escapeHtml(
            model.headline ||
            "当前阶段结构待复核。",
          )}</h3>
        </div>

        <strong class="stage-target-pill">
          ${escapeHtml(targetText)}
        </strong>
      </header>

      ${contextChain.length
        ? `
          <div class="stage-context-chain stage-context-chain-v2">
            ${contextChain
              .map(
                (entry, index) => `
                  <span>
                    <em>${String(index + 1).padStart(2, "0")}</em>
                    <b>${escapeHtml(entry.label || "")}</b>
                    <small>${escapeHtml(entry.value || "待复核")}</small>
                  </span>
                `,
              )
              .join("")}
          </div>
        `
        : ""
      }

      ${themeHierarchy.primary || themeHierarchy.supporting
        ? `
          <section class="stage-theme-hierarchy">
            ${renderStageThemeCard(
              themeHierarchy.primary,
              "primary",
            )}

            ${renderStageThemeCard(
              themeHierarchy.supporting,
              "supporting",
            )}
          </section>
        `
        : ""
      }

      ${structureSummary || structureLabels.length
        ? `
          <section class="stage-structure-overview stage-structure-overview-v2">
            <div>
              <span class="stage-mini-label">结构总览</span>
              <h4>层级与组合</h4>
              <p>${escapeHtml(
                structureSummary?.text ||
                "当前阶段的层级关系和组合条件待复核。",
              )}</p>
            </div>

            ${structureLabels.length
              ? `
                <div class="stage-structure-tags">
                  ${structureLabels
                    .map(
                      (label) =>
                        `<span>${escapeHtml(label)}</span>`,
                    )
                    .join("")}
                </div>
              `
              : ""
            }
          </section>
        `
        : ""
      }

      ${renderStageTriggeredImages(triggeredImages)}

      <div class="stage-summary-grid">
        <section class="stage-focus-section stage-summary-panel">
          <div class="stage-summary-panel-head">
            <div>
              <span>优先顺序</span>
              <h4>重点领域</h4>
            </div>
            <b>${focusDomains.length}</b>
          </div>

          <div class="stage-focus-domains stage-focus-domains-v2">
            ${focusDomains.length
              ? focusDomains
                  .map(
                    (entry) => `
                      <article>
                        <span class="stage-focus-domain-head">
                          <b>${escapeHtml(entry.label || "")}</b>
                          <em>${escapeHtml(entry.level || "关注")}</em>
                        </span>

                        <small>${escapeHtml(
                          entry.reason ||
                          "由当前证据排序",
                        )}</small>
                      </article>
                    `,
                  )
                  .join("")
              : `
                <article class="is-empty">
                  <span class="stage-focus-domain-head">
                    <b>暂无明显集中领域</b>
                    <em>待复核</em>
                  </span>
                  <small>先结合现实反馈复核。</small>
                </article>
              `
            }
          </div>
        </section>

        <section class="stage-key-facts stage-summary-panel">
          <div class="stage-summary-panel-head">
            <div>
              <span>证据主干</span>
              <h4>关键事实</h4>
            </div>
            <b>${keyFacts.length}</b>
          </div>

          <ol class="stage-key-fact-list">
            ${keyFacts.length
              ? keyFacts
                  .map(
                    (fact, index) => `
                      <li>
                        <span class="stage-fact-index">
                          ${String(index + 1).padStart(2, "0")}
                        </span>

                        <div>
                          <b>${escapeHtml(
                            fact.label ||
                            "阶段事实",
                          )}</b>

                          <p>${escapeHtml(fact.text || "")}</p>

                          ${fact.source
                            ? `
                              <small>${escapeHtml(fact.source)}</small>
                            `
                            : ""
                          }
                        </div>
                      </li>
                    `,
                  )
                  .join("")
              : `
                <li class="is-empty">
                  <span class="stage-fact-index">--</span>
                  <div>
                    <b>当前证据较少</b>
                    <p>先保留观察，不扩大解释。</p>
                  </div>
                </li>
              `
            }
          </ol>
        </section>
      </div>

      <div class="stage-balance-grid stage-balance-grid-v2">
        <section class="stage-advantages">
          <div class="stage-balance-head">
            <span>顺势使用</span>
            <h4>可利用的力量</h4>
          </div>

          <ul>
            ${advantages.length
              ? advantages
                  .map(
                    (entry) =>
                      `<li>${escapeHtml(entry.text || "")}</li>`,
                  )
                  .join("")
              : `<li>暂无稳定优势结论，先观察现实承接。</li>`
            }
          </ul>
        </section>

        <section class="stage-pressures">
          <div class="stage-balance-head">
            <span>需要控制</span>
            <h4>需要留意的压力</h4>
          </div>

          <ul>
            ${pressures.length
              ? pressures
                  .map(
                    (entry) =>
                      `<li>${escapeHtml(entry.text || "")}</li>`,
                  )
                  .join("")
              : `<li>暂无明显关系压力，仍需结合现实反馈。</li>`
            }
          </ul>
        </section>
      </div>
    </article>
  `;
}

function renderStageThemeCard(entry, role = "primary") {
  if (!entry) {
    return "";
  }

  const isPrimary =
    role === "primary";

  const roleLabel =
    isPrimary
      ? "外显主线"
      : "现实承接";

  const title =
    entry.tenGod ||
    entry.label ||
    "待复核";

  const description =
    entry.summary ||
    entry.trigger ||
    entry.layerRole ||
    "";

  return `
    <article class="stage-theme-card ${
      isPrimary
        ? "is-primary"
        : "is-supporting"
    }">
      <span>${escapeHtml(roleLabel)}</span>
      <b>${escapeHtml(title)}</b>
      ${description
        ? `<small>${escapeHtml(description)}</small>`
        : ""
      }
    </article>
  `;
}

function renderStageTriggeredImages(triggeredImages = {}) {
  const threads = Array.isArray(triggeredImages?.threads)
    ? triggeredImages.threads
    : [];

  if (!threads.length) {
    return "";
  }

  const certaintyLabels = {
    direct: "直接触发",
    combined: "组合取象",
    conditional: "条件取象",
    background: "背景主题",
  };

  return `
    <section class="stage-triggered-images">
      <div class="stage-triggered-images-head">
        <div>
          <h4>触发取象</h4>
          <p>${escapeHtml(
            triggeredImages.headline ||
            "把当前结构转成可供现实复核和 AI 讲述的场景线索。",
          )}</p>
        </div>
        <span>${escapeHtml(triggeredImages.timeframe || "当前阶段")}</span>
      </div>

      <div class="stage-triggered-image-grid">
        ${threads.map((thread) => `
          <article class="stage-triggered-image-card">
            <div class="stage-triggered-image-title">
              <span>${escapeHtml(thread.domainLabel || "现实落点")}</span>
              <em class="is-${escapeHtml(thread.certainty || "background")}">
                ${escapeHtml(certaintyLabels[thread.certainty] || "背景主题")}
              </em>
            </div>

            <h5>${escapeHtml(thread.label || "触发取象")}</h5>
            <p>${escapeHtml(thread.summary || "")}</p>

            ${thread.possibleScenes?.length ? `
              <div class="stage-triggered-scene-list">
                ${thread.possibleScenes.map((scene) => `
                  <span>${escapeHtml(scene)}</span>
                `).join("")}
              </div>
            ` : ""}

            <small>${escapeHtml(thread.trigger || "")}</small>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}


function renderStageEvidenceDetails(
  model = {},
  evidencePack = {},
) {
  const hits =
    Array.isArray(evidencePack?.hits)
      ? evidencePack.hits
      : [];

  const relations =
    Array.isArray(evidencePack?.relations)
      ? evidencePack.relations
      : [];

  const structureFacts =
    Array.isArray(model?.structureFacts)
      ? model.structureFacts
      : [];

  const explanations =
    evidencePack?.explanations ?? {};

  const conditions =
    compactEvidenceTextItems(
      explanations.conditions,
      6,
    );

  const counterEvidence =
    compactEvidenceTextItems(
      explanations.counterEvidence,
      6,
    );

  const realityImages =
    compactEvidenceTextItems(
      explanations.realityImages,
      6,
    );

  const visibleStructureFacts =
    structureFacts
      .filter(
        (fact) =>
          fact?.text ||
          fact?.description,
      )
      .slice(0, 12);

  return `
    <details class="stage-evidence-details stage-evidence-details-v2">
      <summary>
        <span class="stage-evidence-summary-title">
          <b>详细证据与复核</b>
          <small>展开查看证据链、成立条件与反证。</small>
        </span>

        <span class="stage-evidence-summary-metrics">
          ${renderEvidenceMetric("十神", hits.length)}
          ${renderEvidenceMetric("基础关系", relations.length)}
          ${renderEvidenceMetric("层级组合", visibleStructureFacts.length)}
          ${renderEvidenceMetric("成立条件", conditions.length)}
          ${renderEvidenceMetric("反证", counterEvidence.length)}
        </span>
      </summary>

      <div class="stage-evidence-details-body stage-evidence-details-body-v2">
        <div class="stage-evidence-primary-grid">
          <section class="stage-evidence-group is-ten-god">
            <header>
              <div>
                <span>基础主题</span>
                <h4>十神命中</h4>
              </div>
              <b>${hits.length}</b>
            </header>

            ${hits.length
              ? `
                <ul class="stage-evidence-list">
                  ${hits
                    .map(
                      (hit) => `
                        <li>
                          <div class="stage-evidence-item-head">
                            <b>${escapeHtml(
                              hit.source ||
                              "十神命中",
                            )}</b>
                            <em>${escapeHtml(
                              hit.label ||
                              "待查",
                            )}</em>
                          </div>

                          <p>${escapeHtml(
                            hit.bookExplanation ||
                            hit.masterTalk ||
                            "暂无资料解释。",
                          )}</p>
                        </li>
                      `,
                    )
                    .join("")}
                </ul>
              `
              : `<p class="stage-evidence-empty">暂无十神证据。</p>`
            }
          </section>

          <section class="stage-evidence-group is-relation">
            <header>
              <div>
                <span>直接作用</span>
                <h4>基础关系触发</h4>
              </div>
              <b>${relations.length}</b>
            </header>

            ${relations.length
              ? `
                <ul class="stage-evidence-list">
                  ${relations
                    .map(
                      (relation) => `
                        <li>
                          <div class="stage-evidence-item-head">
                            <b>${escapeHtml(
                              relation.source ||
                              "关系触发",
                            )}</b>
                            <em>${escapeHtml(
                              relation.label ||
                              "待查",
                            )}</em>
                          </div>

                          <p>${escapeHtml(
                            relation.description ||
                            relation.bookExplanation ||
                            "暂无关系说明。",
                          )}</p>
                        </li>
                      `,
                    )
                    .join("")}
                </ul>
              `
              : `
                <p class="stage-evidence-empty">
                  暂未命中基础冲、合、刑、害、破。
                </p>
              `
            }
          </section>
        </div>

        <section class="stage-evidence-group stage-structure-evidence is-structure">
          <header>
            <div>
              <span>多层判断</span>
              <h4>层级与组合证据</h4>
            </div>
            <b>${visibleStructureFacts.length}</b>
          </header>

          ${visibleStructureFacts.length
            ? `
              <ul class="stage-evidence-list stage-structure-evidence-list">
                ${visibleStructureFacts
                  .map(
                    (fact) => `
                      <li>
                        <div class="stage-evidence-item-head">
                          <b>${escapeHtml(
                            fact.label ||
                            "结构事实",
                          )}</b>
                          <em class="is-structure">
                            ${escapeHtml(
                              evidenceStatusLabel(
                                fact.status,
                              ),
                            )}
                          </em>
                        </div>

                        <p>${escapeHtml(
                          fact.text ||
                          fact.description ||
                          "",
                        )}</p>

                        ${fact.source
                          ? `
                            <small>${escapeHtml(
                              fact.source,
                            )}</small>
                          `
                          : ""
                        }
                      </li>
                    `,
                  )
                  .join("")}
              </ul>
            `
            : `
              <p class="stage-evidence-empty">
                暂无伏吟、天干关系、三合三会、多层激活或层级转向等附加结构。
              </p>
            `
          }
        </section>

        <div class="stage-evidence-note-grid">
          ${renderEvidenceTextGroup(
            "成立条件",
            conditions,
            {
              subtitle:
                "这些条件决定取象能否进一步落实。",
              tone:
                "condition",
            },
          )}

          ${renderEvidenceTextGroup(
            "反证",
            counterEvidence,
            {
              subtitle:
                "出现这些情况时，应降低原判断权重。",
              tone:
                "counter",
            },
          )}

          ${renderEvidenceTextGroup(
            "现实取象",
            realityImages,
            {
              subtitle:
                "用于把结构对应到可观察的现实线索。",
              tone:
                "reality",
            },
          )}
        </div>
      </div>
    </details>
  `;
}


function renderEvidenceMetric(
  label,
  count,
) {
  return `
    <span>
      ${escapeHtml(label)}
      <b>${Number(count) || 0}</b>
    </span>
  `;
}

function evidenceStatusLabel(status) {
  const labels = {
    direct: "直接",
    inferred: "组合",
    background: "背景",
    condition_only: "条件",
    arch_condition: "拱势",
    unresolved: "待复核",
  };

  return (
    labels[String(status || "")] ||
    "结构"
  );
}

function renderEvidenceTextGroup(
  title,
  items = [],
  {
    subtitle = "",
    tone = "neutral",
  } = {},
) {
  const visible =
    compactEvidenceTextItems(
      items,
      6,
    );

  return `
    <section class="stage-evidence-note is-${escapeHtml(tone)}">
      <header>
        <div>
          <h4>${escapeHtml(title)}</h4>
          ${subtitle
            ? `<small>${escapeHtml(subtitle)}</small>`
            : ""
          }
        </div>
        <b>${visible.length}</b>
      </header>

      ${visible.length
        ? `
          <ul>
            ${visible
              .map(
                (item) =>
                  `<li>${escapeHtml(item)}</li>`,
              )
              .join("")}
          </ul>
        `
        : `<p>暂无明确内容。</p>`
      }
    </section>
  `;
}

function compactEvidenceTextItems(
  items = [],
  limit = 6,
) {
  return [
    ...new Set(
      (
        Array.isArray(items)
          ? items
          : []
      )
        .map(
          (item) =>
            String(item || "")
              .replace(/\s+/g, " ")
              .trim(),
        )
        .filter(Boolean),
    ),
  ].slice(0, limit);
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

  const mainCard = cards.find((card) => card?.title === "先看主线") ?? cards[0] ?? null;
  const realityCard = cards.find((card) => card?.title === "现实反馈") ?? cards[1] ?? null;
  const boundaryCard = cards.find((card) => card?.title === "复核边界") ?? cards[2] ?? null;
  const counterCard = cards.find((card) => card?.title === "反证提醒") ?? cards[3] ?? null;

  const compactCards = [
    {
      title: "观察重点",
      content: mainCard?.content,
    },
    {
      title: "现实验证",
      content: realityCard?.content,
    },
    {
      title: "复核提醒",
      content: boundaryCard?.content || counterCard?.content,
    },
  ].filter((card) => card.content && String(card.content).trim());

  return `
    <article class="stage-image-card stage-advice-card stage-advice-card-compact">
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

      <ul class="stage-advice-list stage-advice-list-compact">
        ${compactCards.map((card) => `
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
