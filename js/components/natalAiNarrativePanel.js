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
          "AI 原局综合分析",

        button:
          "生成原局 AI 分析",

        helper:
          "AI会读取四柱、十神、藏干、位置和明确干支关系，生成一篇连续的原局分析与建议。",

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
    renderContinuousReport({
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

function renderContinuousReport({
  report = {},
  state = {},
  hasReport = false,
} = {}) {
  const headline =
    firstText(
      report.overview
        ?.headline,

      report.title,

      "出生原局综合分析",
    );
  const overviewSummary =
    firstText(
      report.overview
        ?.summary,
    );

  const sections =
    Array.isArray(
      report.sections,
    )
      ? report.sections
      : [];
  const legacyReportText =
    sections.length
      ? ""
      : resolveReportText(
          report,
        );

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
            "出生原局综合分析",
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
              基于当前原局确定性证据生成，不重新排盘。
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

        <article
          class="
            natal-ai-deep-report
            is-article-mode
          "
        >
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
                原局核心判断
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
                headline,
              )}
            </h3>
            ${
              overviewSummary
                ? `
                  <p
                    class="
                      natal-ai-overview-summary
                    "
                  >
                    ${escapeHtml(
                      overviewSummary,
                    )}
                  </p>
                `
                : ""
            }
          </section>

          ${
            sections.length
              ? renderStructuredSections(
                  sections,
                )
              : (
                  legacyReportText
                    ? renderAiText(
                        legacyReportText,
                        {
                          className:
                            "natal-ai-continuous-text",
                        },
                      )
                    : `
                      <p class="muted">
                        当前报告结构不完整，系统将保留上一次有效报告。
                      </p>
                    `
                )
          }
        </article>
      </div>
    </details>
  `;
}

function renderStructuredSections(
  sections = [],
) {
  return `
    <div
      class="
        natal-ai-sections
      "
    >
      ${sections
        .map(
          renderStructuredSection,
        )
        .join("")}
    </div>
  `;
}

function renderStructuredSection(
  section = {},
) {
  const title =
    firstText(
      section.title,
      "领域分析",
    );

  return `
    <section
      class="
        natal-ai-section
        natal-ai-section-${escapeHtml(
          section.key ||
          "general",
        )}
      "
    >
      <h4>
        ${escapeHtml(
          title,
        )}
      </h4>

      ${
        section.summary
          ? `
            <p
              class="
                natal-ai-section-summary
              "
            >
              ${escapeHtml(
                section.summary,
              )}
            </p>
          `
          : ""
      }

      <div
        class="
          natal-ai-section-points
        "
      >
        ${renderSectionPoint({
          label:
            "优势",

          value:
            section.advantage,

          type:
            "advantage",
        })}

        ${renderSectionPoint({
          label:
            "容易付出的代价",

          value:
            section.cost,

          type:
            "cost",
        })}

        ${renderSectionPoint({
          label:
            "建议",

          value:
            section.advice,

          type:
            "advice",
        })}
      </div>
    </section>
  `;
}

function renderSectionPoint({
  label,
  value,
  type,
} = {}) {
  const text =
    firstText(value);

  if (!text) {
    return "";
  }

  return `
    <div
      class="
        natal-ai-section-point
        is-${escapeHtml(type)}
      "
    >
      <b>
        ${escapeHtml(label)}
      </b>

      <p>
        ${escapeHtml(text)}
      </p>
    </div>
  `;
}

function resolveReportText(
  report = {},
) {
  if (
    typeof report ===
    "string"
  ) {
    return normalizeReportMarkdown(
      report,
    );
  }

  const direct =
    firstText(
      report.text,

      report.overview
        ?.summary,

      typeof report.overview ===
        "string"
        ? report.overview
        : "",

      report.summary,
      report.content,
      report.analysis,
      report.answer,
      report.markdown,
      report.narrative,

      report.result
        ?.text,

      report.result
        ?.summary,

      report.result
        ?.content,

      report.result
        ?.analysis,

      report.data
        ?.text,

      report.data
        ?.summary,

      report.data
        ?.content,

      report.data
        ?.analysis,

      report.data
        ?.overview
        ?.summary,
    );

  if (direct) {
    return normalizeReportMarkdown(
      direct,
    );
  }

  /*
   * 兼容旧版结构。
   * 这里只负责展示已有内容，不重新生成，也不改写AI原文。
   */
  const sections = [];

  const mechanism =
    firstText(
      report.coreMechanism
        ?.synthesis,

      report.coreMechanism
        ?.content,

      report.mainline,
    );

  if (mechanism) {
    sections.push(
      `## 总体判断\n${mechanism}`,
    );
  }

  const themes =
    Array.isArray(
      report.lifeThemes,
    )
      ? report.lifeThemes
      : [];

  for (
    const theme of
    themes
  ) {
    const summary =
      typeof theme ===
      "string"
        ? theme
        : firstText(
            theme?.summary,
            theme?.content,
            theme?.description,
            theme?.explanation,
          );

    if (!summary) {
      continue;
    }

    sections.push(
      `## ${
        firstText(
          theme?.title,
          "领域分析",
        )
      }\n${summary}`,
    );
  }

  const actions =
    Array.isArray(
      report.actions,
    )
      ? report.actions
      : [];

  const actionText =
    actions
      .map(
        (item) =>
          typeof item ===
          "string"
            ? item
            : firstText(
                item?.action,
                item?.content,
                item?.description,
              ),
      )
      .filter(Boolean);

  if (actionText.length) {
    sections.push(
      [
        "## 综合建议",

        ...actionText.map(
          (item) =>
            `- ${item}`,
        ),
      ].join("\n"),
    );
  }

  const legacyText =
    sections.join(
      "\n\n",
    );

  if (legacyText) {
    return normalizeReportMarkdown(
      legacyText,
    );
  }

  return normalizeReportMarkdown(
    collectReadableReportText(
      report,
    ),
  );
}

function collectReadableReportText(
  value,
  key = "",
  seen = new Set(),
) {
  const ignoredKeys =
    new Set([
      "version",
      "scope",
      "title",
      "headline",
      "confidence",
      "key",
      "status",
      "treatment",
      "id",
      "evidenceId",
      "evidenceIds",
      "evidenceRefs",
      "warnings",
      "boundaries",
    ]);

  if (
    typeof value ===
    "string"
  ) {
    const text =
      value.trim();

    if (
      ignoredKeys.has(key) ||
      text.length < 24 ||
      seen.has(text)
    ) {
      return "";
    }

    seen.add(text);
    return text;
  }

  if (
    Array.isArray(value)
  ) {
    return value
      .map(
        (item) =>
          collectReadableReportText(
            item,
            key,
            seen,
          ),
      )
      .filter(Boolean)
      .join("\n\n");
  }

  if (
    !value ||
    typeof value !==
      "object"
  ) {
    return "";
  }

  return Object.entries(value)
    .map(
      ([childKey, item]) =>
        collectReadableReportText(
          item,
          childKey,
          seen,
        ),
    )
    .filter(Boolean)
    .join("\n\n");
}

function normalizeReportMarkdown(
  text = "",
) {
  const normalized =
    String(text)
      .replace(
        /\r\n?/g,
        "\n",
      )
      .replace(
        /\\n/g,
        "\n",
      )
      .replace(
        /＃/g,
        "#",
      );

  return splitInsightLabels(
    normalizeMarkdownHeadings(
      normalized,
    ),
  )
    .replace(
      /\n{3,}/g,
      "\n\n",
    )
    .trim();
}

function normalizeMarkdownHeadings(
  text = "",
) {
  let value =
    String(text);

  value =
    value.replace(
      /^[ \t]*#{1,6}[ \t]*$/gm,
      "",
    );

  value =
    value.replace(
      /^[ \t]*#{1,6}[ \t]+(.+)$/gm,
      (_match, title) =>
        `## ${String(title).trim()}`,
    );

  value =
    value.replace(
      /([。！？；])[\t ]*#{1,6}[\t ]+(?=\S)/g,
      "$1\n\n## ",
    );

  value =
    value.replace(
      /([^\n#])[\t ]+#{1,6}[\t ]+(?=\S)/g,
      "$1\n\n## ",
    );

  return value;
}

function splitInsightLabels(
  text = "",
) {
  return String(text)
    .replace(
      /[ \t]*(\*{0,2}(?:优势|容易付出的代价|代价|劣势)(?:[：:]|是)\*{0,2})[ \t]*/g,
      "\n$1 ",
    )
    .replace(
      /[ \t]*(\*{0,2}建议[：:]\*{0,2})[ \t]*/g,
      "\n$1 ",
    )
    .replace(
      /\n{2,}(?=\*{0,2}(?:优势|容易付出的代价|代价|劣势|建议)(?:[：:]|是))/g,
      "\n",
    );
}

function bindGenerate(
  root,
  onGenerate,
) {
  const button =
    root.querySelector(
      "[data-stage-ai-generate]",
    );

  if (
    !button ||
    typeof onGenerate !==
      "function"
  ) {
    return;
  }

  button.addEventListener(
    "click",
    () => {
      onGenerate();
    },
  );
}

function confidenceLabel(
  confidence,
) {
  return {
    high:
      "较高可信",

    medium:
      "综合参考",

    low:
      "谨慎参考",
  }[
    confidence
  ] ?? "综合参考";
}

function firstText(
  ...values
) {
  for (
    const value of
    values
  ) {
    if (
      typeof value ===
      "string" &&
      value.trim()
    ) {
      return value.trim();
    }
  }

  return "";
}
