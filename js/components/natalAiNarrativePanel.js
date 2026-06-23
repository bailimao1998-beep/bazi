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

  const reportText =
    resolveReportText(
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
          </section>

          ${
            reportText
              ? renderAiText(
                  reportText,
                  {
                    className:
                      "natal-ai-continuous-text",
                  },
                )
              : `
                <p class="muted">
                  AI没有返回可展示的正文，请重新生成。
                </p>
              `
          }
        </article>
      </div>
    </details>
  `;
}

function resolveReportText(
  report = {},
) {
  const direct =
    firstText(
      report.text,

      report.overview
        ?.summary,
    );

  if (direct) {
    return direct;
  }

  /*
   * 兼容修改前已经生成或缓存的旧结构，
   * 但统一转成普通文章展示，不再渲染卡片。
   */
  const sections = [];

  const mechanism =
    firstText(
      report.coreMechanism
        ?.synthesis,
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
      firstText(
        theme?.summary,
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
          firstText(
            item?.action,
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

  return sections.join(
    "\n\n",
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
