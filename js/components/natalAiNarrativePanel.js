import {
  renderAiCollapse,
} from "./stageAnalysisPanel.js";

import {
  renderAiText,
} from "./aiTextRenderer.js";

import {
  escapeHtml,
} from "../utils/html.js";

export function renderNatalAiNarrativePanel(
  root,
  payload = {},
  actions = {},
) {
  if (!root) {
    return;
  }

  const state =
    payload.state ??
    {};

  const hasReport =
    Boolean(
      payload.hasReport,
    );

  const onGenerate =
    payload.onGenerate ??
    actions.onGenerate;

  if (!state.structured) {
    root.innerHTML =
      renderAiCollapse({
        title:
          "AI 深度分析",

        button:
          "生成原局 AI 深度分析",

        helper:
          "AI会基于原局硬事实、专业结构和做功路径，整理为一份有主线、可验证、可行动的完整报告。",

        state,

        hasReport,
      });

    bindGenerate(
      root,
      onGenerate,
    );

    return;
  }

  root.innerHTML =
    renderStructuredReport({
      report:
        state.structured,

      state,

      hasReport,
    });

  bindGenerate(
    root,
    onGenerate,
  );
}

function renderStructuredReport({
  report,
  state,
  hasReport,
}) {
  return `
    <details
      class="
        ai-collapse-card
        natal-ai-deep-shell
      "
      open
    >
      <summary>
        <span>
          ${escapeHtml(
            report.title ||
            "出生原局深度分析",
          )}
        </span>

        <b
          class="
            ai-collapse-summary-action
          "
        >
          展开 / 收起
        </b>
      </summary>

      <div
        class="
          ai-collapse-body
          natal-ai-deep-body
        "
      >
        <div
          class="
            ai-collapse-toolbar
          "
        >
          <span
            class="
              ai-collapse-status
            "
          >
            <b>
              AI原局综合
            </b>

            <small>
              本报告不重新排盘，所有结论均来自当前原局证据包。
            </small>
          </span>

          <button
            type="button"
            class="
              secondary
              ai-collapse-button
            "
            data-stage-ai-generate
            ${
              state.loading ||
              !hasReport
                ? "disabled"
                : ""
            }
          >
            ${
              state.loading
                ? "生成中..."
                : "重新生成"
            }
          </button>
        </div>

        ${
          state.error
            ? `
              <p class="form-error">
                ${escapeHtml(
                  state.error,
                )}
              </p>
            `
            : ""
        }

        ${renderDeepReport(
          report,
        )}

        ${
          state.warnings
            ?.length
            ? renderTechnicalWarnings(
                state.warnings,
              )
            : ""
        }
      </div>
    </details>
  `;
}

function renderDeepReport(
  report = {},
) {
  return `
    <article
      class="
        natal-ai-deep-report
      "
    >
      ${renderOverview(
        report,
      )}

      ${renderCoreMechanism(
        report.coreMechanism,
      )}

      ${renderDualInsightSection({
        leftTitle:
          "核心优势与代价",

        leftRows:
          report.strengths,

        leftRenderer:
          renderStrengthCard,

        rightTitle:
          "容易反复的模式",

        rightRows:
          report.repeatingPatterns,

        rightRenderer:
          renderPatternCard,
      })}

      ${renderLifeThemes(
        report.lifeThemes,
      )}

      ${renderReviewGrid(
        report.realityChecks,
        report.actions,
      )}

      ${renderConditionalInsights(
        report.conditionalInsights,
      )}

      ${renderBoundaries(
        report.boundaries,
      )}
    </article>
  `;
}

function renderOverview(
  report,
) {
  const overview =
    report.overview ??
    {};

  return `
    <section
      class="
        natal-ai-overview
      "
    >
      <div
        class="
          natal-ai-overview-meta
        "
      >
        <span>
          原局核心结论
        </span>

        <b
          class="
            natal-ai-confidence
            is-${escapeHtml(
              report.confidence ||
              "medium",
            )}
          "
        >
          ${escapeHtml(
            confidenceLabel(
              report.confidence,
            ),
          )}
        </b>
      </div>

      <h3>
        ${escapeHtml(
          overview.headline ||
          report.title ||
          "出生原局深度分析",
        )}
      </h3>

      ${
        overview.summary
          ? `
            <p>
              ${escapeHtml(
                overview.summary,
              )}
            </p>
          `
          : ""
      }

      ${renderEvidenceCount(
        overview.evidenceRefs,
      )}
    </section>
  `;
}

function renderCoreMechanism(
  mechanism = {},
) {
  const steps =
    Array.isArray(
      mechanism.steps,
    )
      ? mechanism.steps
      : [];

  if (
    !steps.length &&
    !mechanism.synthesis
  ) {
    return "";
  }

  return `
    <section
      class="
        natal-ai-section
        natal-ai-mechanism
      "
    >
      <div
        class="
          natal-ai-section-head
        "
      >
        <div>
          <span>
            整盘如何运转
          </span>

          <h3>
            ${escapeHtml(
              mechanism.title ||
              "核心运行机制",
            )}
          </h3>
        </div>

        ${renderEvidenceCount(
          mechanism.evidenceRefs,
        )}
      </div>

      ${
        steps.length
          ? `
            <ol
              class="
                natal-ai-mechanism-list
              "
            >
              ${steps
                .map(
                  (
                    step,
                    index,
                  ) => `
                    <li>
                      <b>
                        ${escapeHtml(
                          index + 1,
                        )}
                      </b>

                      <div>
                        <strong>
                          ${escapeHtml(
                            step.title ||
                            `机制步骤${index + 1}`,
                          )}
                        </strong>

                        <p>
                          ${escapeHtml(
                            step.content ||
                            "",
                          )}
                        </p>

                        ${renderEvidenceCount(
                          step.evidenceRefs,
                        )}
                      </div>
                    </li>
                  `,
                )
                .join("")}
            </ol>
          `
          : ""
      }

      ${
        mechanism.synthesis
          ? `
            <p
              class="
                natal-ai-synthesis
              "
            >
              ${escapeHtml(
                mechanism.synthesis,
              )}
            </p>
          `
          : ""
      }
    </section>
  `;
}

function renderDualInsightSection({
  leftTitle,
  leftRows,
  leftRenderer,
  rightTitle,
  rightRows,
  rightRenderer,
}) {
  const safeLeft =
    asObjectRows(
      leftRows,
    );

  const safeRight =
    asObjectRows(
      rightRows,
    );

  if (
    !safeLeft.length &&
    !safeRight.length
  ) {
    return "";
  }

  return `
    <section
      class="
        natal-ai-dual-grid
      "
    >
      ${renderInsightColumn(
        leftTitle,
        safeLeft,
        leftRenderer,
      )}

      ${renderInsightColumn(
        rightTitle,
        safeRight,
        rightRenderer,
      )}
    </section>
  `;
}

function renderInsightColumn(
  title,
  rows,
  renderer,
) {
  if (!rows.length) {
    return "";
  }

  return `
    <section
      class="
        natal-ai-insight-column
      "
    >
      <div
        class="
          natal-ai-section-head
        "
      >
        <div>
          <span>
            深度理解
          </span>

          <h3>
            ${escapeHtml(
              title,
            )}
          </h3>
        </div>
      </div>

      <div
        class="
          natal-ai-insight-list
        "
      >
        ${rows
          .map(renderer)
          .join("")}
      </div>
    </section>
  `;
}

function renderStrengthCard(
  item = {},
) {
  return `
    <article
      class="
        natal-ai-insight-card
        is-strength
      "
    >
      <h4>
        ${escapeHtml(
          item.title ||
          "结构优势",
        )}
      </h4>

      ${renderField(
        "为什么形成",
        item.explanation,
      )}

      ${renderField(
        "同时的代价",
        item.cost,
      )}

      ${renderField(
        "最适合发挥",
        item.bestUse,
      )}

      ${renderEvidenceCount(
        item.evidenceRefs,
      )}
    </article>
  `;
}

function renderPatternCard(
  item = {},
) {
  return `
    <article
      class="
        natal-ai-insight-card
        is-pattern
      "
    >
      <h4>
        ${escapeHtml(
          item.title ||
          "重复模式",
        )}
      </h4>

      ${renderField(
        "如何开始",
        item.trigger,
      )}

      ${renderField(
        "循环过程",
        item.cycle,
      )}

      ${renderField(
        "长期影响",
        item.consequence,
      )}

      ${renderField(
        "调整方式",
        item.adjustment,
      )}

      ${renderEvidenceCount(
        item.evidenceRefs,
      )}
    </article>
  `;
}

function renderLifeThemes(
  themes,
) {
  const rows =
    asObjectRows(themes);

  if (!rows.length) {
    return "";
  }

  const standalone =
    rows.filter(
      (item) =>
        item.treatment ===
        "standalone",
    );

  const integrated =
    rows.filter(
      (item) =>
        item.treatment !==
        "standalone",
    );

  return `
    <section
      class="
        natal-ai-section
        natal-ai-themes
      "
    >
      <div
        class="
          natal-ai-section-head
        "
      >
        <div>
          <span>
            人生主题
          </span>

          <h3>
            有证据的重点领域
          </h3>
        </div>
      </div>

      <div
        class="
          natal-ai-theme-grid
        "
      >
        ${[
          ...standalone,
          ...integrated,
        ]
          .map(
            renderThemeCard,
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderThemeCard(
  theme = {},
) {
  return `
    <article
      class="
        natal-ai-theme-card
        is-${escapeHtml(
          theme.treatment ||
          "integrated",
        )}
      "
    >
      <div
        class="
          natal-ai-theme-head
        "
      >
        <h4>
          ${escapeHtml(
            theme.title ||
            "人生主题",
          )}
        </h4>

        <span>
          ${escapeHtml(
            treatmentLabel(
              theme.treatment,
            ),
          )}
        </span>
      </div>

      ${
        theme.summary
          ? `
            <p
              class="
                natal-ai-theme-summary
              "
            >
              ${escapeHtml(
                theme.summary,
              )}
            </p>
          `
          : ""
      }

      ${renderTextList(
        "有利表现",
        theme.positive,
        "is-positive",
      )}

      ${renderTextList(
        "压力与限制",
        theme.pressure,
        "is-pressure",
      )}

      ${renderField(
        "与整盘的联系",
        theme.connection,
      )}

      ${renderEvidenceCount(
        theme.evidenceRefs,
      )}
    </article>
  `;
}

function renderReviewGrid(
  checks,
  actions,
) {
  const checkRows =
    asObjectRows(checks);

  const actionRows =
    asObjectRows(actions);

  if (
    !checkRows.length &&
    !actionRows.length
  ) {
    return "";
  }

  return `
    <section
      class="
        natal-ai-review-grid
      "
    >
      ${renderReviewColumn(
        "现实验证点",
        "可以观察这些模式是否长期存在",
        checkRows,
        (item) =>
          item.description,
      )}

      ${renderReviewColumn(
        "行动方向",
        "建议必须直接对应前面的结构机制",
        actionRows,
        (item) =>
          [
            item.action,
            item.basis
              ? `依据：${item.basis}`
              : "",
          ]
            .filter(Boolean)
            .join(" "),
      )}
    </section>
  `;
}

function renderReviewColumn(
  title,
  subtitle,
  rows,
  contentResolver,
) {
  if (!rows.length) {
    return "";
  }

  return `
    <section
      class="
        natal-ai-review-card
      "
    >
      <div
        class="
          natal-ai-section-head
        "
      >
        <div>
          <span>
            ${escapeHtml(
              subtitle,
            )}
          </span>

          <h3>
            ${escapeHtml(
              title,
            )}
          </h3>
        </div>
      </div>

      <ul
        class="
          natal-ai-number-list
        "
      >
        ${rows
          .map(
            (item) => `
              <li>
                <strong>
                  ${escapeHtml(
                    item.title ||
                    title,
                  )}
                </strong>

                <p>
                  ${escapeHtml(
                    contentResolver(
                      item,
                    ) ||
                    "",
                  )}
                </p>

                ${renderEvidenceCount(
                  item.evidenceRefs,
                )}
              </li>
            `,
          )
          .join("")}
      </ul>
    </section>
  `;
}

function renderConditionalInsights(
  insights,
) {
  const rows =
    asObjectRows(insights);

  if (!rows.length) {
    return "";
  }

  return `
    <details
      class="
        natal-ai-details
        natal-ai-conditional
      "
    >
      <summary>
        <span>
          条件结构与潜在线索
        </span>

        <b>
          ${escapeHtml(
            rows.length,
          )}
          项
        </b>
      </summary>

      <div
        class="
          natal-ai-details-body
        "
      >
        ${rows
          .map(
            (item) => `
              <article
                class="
                  natal-ai-condition-card
                "
              >
                <div
                  class="
                    natal-ai-condition-head
                  "
                >
                  <h4>
                    ${escapeHtml(
                      item.title ||
                      "条件结构",
                    )}
                  </h4>

                  <span>
                    ${escapeHtml(
                      statusLabel(
                        item.status,
                      ),
                    )}
                  </span>
                </div>

                ${renderField(
                  "目前看到",
                  item.whatSeen,
                )}

                ${renderTextList(
                  "加强条件",
                  item.conditions,
                )}

                ${renderTextList(
                  "削弱或反证",
                  item.counterEvidence,
                )}

                ${renderEvidenceCount(
                  item.evidenceRefs,
                )}
              </article>
            `,
          )
          .join("")}
      </div>
    </details>
  `;
}

function renderBoundaries(
  boundaries,
) {
  const rows =
    asTextRows(boundaries);

  if (!rows.length) {
    return "";
  }

  return `
    <details
      class="
        natal-ai-details
        natal-ai-boundaries
      "
    >
      <summary>
        <span>
          确定程度与分析边界
        </span>

        <b>
          查看
        </b>
      </summary>

      <div
        class="
          natal-ai-details-body
        "
      >
        <ul>
          ${rows
            .map(
              (item) => `
                <li>
                  ${escapeHtml(
                    item,
                  )}
                </li>
              `,
            )
            .join("")}
        </ul>
      </div>
    </details>
  `;
}

function renderTechnicalWarnings(
  warnings,
) {
  const rows =
    asTextRows(warnings);

  if (!rows.length) {
    return "";
  }

  return `
    <details
      class="
        natal-ai-details
        natal-ai-technical
      "
    >
      <summary>
        <span>
          生成校验信息
        </span>

        <b>
          ${escapeHtml(
            rows.length,
          )}
          项
        </b>
      </summary>

      <div
        class="
          natal-ai-details-body
        "
      >
        <ul>
          ${rows
            .map(
              (item) => `
                <li>
                  ${escapeHtml(
                    item,
                  )}
                </li>
              `,
            )
            .join("")}
        </ul>
      </div>
    </details>
  `;
}

function renderField(
  label,
  value,
) {
  const text =
    typeof value ===
    "string"
      ? value.trim()
      : "";

  if (!text) {
    return "";
  }

  return `
    <p
      class="
        natal-ai-field
      "
    >
      <b>
        ${escapeHtml(label)}
      </b>

      <span>
        ${escapeHtml(text)}
      </span>
    </p>
  `;
}

function renderTextList(
  title,
  items,
  className = "",
) {
  const rows =
    asTextRows(items);

  if (!rows.length) {
    return "";
  }

  return `
    <section
      class="
        natal-ai-mini-list
        ${escapeHtml(className)}
      "
    >
      <b>
        ${escapeHtml(title)}
      </b>

      <ul>
        ${rows
          .map(
            (item) => `
              <li>
                ${escapeHtml(
                  item,
                )}
              </li>
            `,
          )
          .join("")}
      </ul>
    </section>
  `;
}

function renderEvidenceCount(
  refs,
) {
  const rows =
    asTextRows(refs);

  if (!rows.length) {
    return `
      <span
        class="
          natal-ai-evidence-count
          is-empty
        "
      >
        证据待复核
      </span>
    `;
  }

  return `
    <span
      class="
        natal-ai-evidence-count
      "
      title="${escapeHtml(
        rows.join("、"),
      )}"
    >
      ${escapeHtml(
        rows.length,
      )}
      条本地依据
    </span>
  `;
}

function asObjectRows(
  value,
) {
  return (
    Array.isArray(value)
      ? value
      : []
  ).filter(
    (item) =>
      item &&
      typeof item ===
        "object" &&
      !Array.isArray(item),
  );
}

function asTextRows(
  value,
) {
  return (
    Array.isArray(value)
      ? value
      : (
          value
            ? [value]
            : []
        )
  )
    .map(
      (item) =>
        String(
          item ??
          "",
        ).trim(),
    )
    .filter(Boolean);
}

function confidenceLabel(
  value,
) {
  return {
    high:
      "依据较强",

    medium:
      "综合参考",

    low:
      "谨慎参考",
  }[value] ||
  "综合参考";
}

function treatmentLabel(
  value,
) {
  return {
    standalone:
      "重点展开",

    integrated:
      "融合分析",

    brief:
      "简要提示",
  }[value] ||
  "融合分析";
}

function statusLabel(
  value,
) {
  return {
    confirmed:
      "明确成立",

    structurally_supported:
      "结构明显",

    conditional:
      "条件候选",

    candidate:
      "观察线索",
  }[value] ||
  "条件候选";
}

function bindGenerate(
  root,
  onGenerate,
) {
  root
    .querySelector(
      "[data-stage-ai-generate]",
    )
    ?.addEventListener(
      "click",
      () =>
        onGenerate?.(),
    );
}