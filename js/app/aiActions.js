import { readAiSettings } from "../core/ai/aiSettingsClient.js?v=20260613c";
import { buildLuckAiPrompt } from "../core/ai/buildLuckAiPrompt.js";
import { buildMonthAiPrompt } from "../core/ai/buildMonthAiPrompt.js";
import { buildNatalAiPrompt } from "../core/ai/buildNatalAiPrompt.js";
import { buildYearAiPrompt } from "../core/ai/buildYearAiPrompt.js";
import {
  buildStageStructuredRepairPrompt,
  normalizeStageReportResponse,
  renderStageReport,
  validateStageReportContract,
} from "../core/ai/stageReportContract.js";
import { generateWithDeepSeek } from "../core/ai/deepseekClient.js?v=20260613b";
import {
  guardNatalAiContent,
} from "../core/ai/natalAiContentGuard.js";
import {
  normalizeNatalAiReport,
  validateNatalAiReport,
} from "../core/ai/natalAiReportContract.js";

export function createAiActions({ store, renderBaseOnly }) {
  async function generateNatalAiNarrative() {
    const previousStructured =
      store.natalAiState
        ?.structured ??
      null;

    const previousWarnings =
      Array.isArray(
        store.natalAiState
          ?.warnings,
      )
        ? store.natalAiState
            .warnings
        : [];

    store.natalAiState = {
      loading:
        true,

      text:
        "",

      error:
        "",

      structured:
        previousStructured,

      warnings:
        previousWarnings,
    };

    renderBaseOnly();

    try {
      const settings =
        readAiSettings({
          includeSecret:
            true,
        });

      const prompt =
        buildNatalAiPrompt({
          natalImageReport:
            store.state
              .natalImageReport,
        });

      globalThis
        .__lastNatalAiDebug = {
          trustedPack:
            prompt.trustedPack,

          evidenceIds:
            prompt.evidenceIds,

          attempts: [],

          rawResponse:
            "",

          normalizedResponse:
            null,
        };

      const outcome =
        await requestNatalAiReportWithRetry({
          settings,
          prompt,
        });

      globalThis
        .__lastNatalAiDebug = {
          ...globalThis
            .__lastNatalAiDebug,

          attempts:
            outcome.attempts,

          rawResponse:
            outcome.result
              .text,

          normalizedResponse:
            outcome.validated
              .structured,
        };

      store.natalAiState = {
        loading:
          false,

        text:
          "",

        error:
          "",

        structured:
          outcome.validated
            .structured,

        warnings:
          uniqueText([
            ...outcome.validated
              .warnings,

            ...(
              outcome.retried
                ? [
                    "auto_retry_used",
                  ]
                : []
            ),
          ]),
      };
    } catch (error) {
      const message =
        error?.message ??
        "AI深度分析生成失败。";

      store.natalAiState = {
        loading:
          false,

        text:
          "",

        error:
          previousStructured
            ? `${message} 已保留上一次成功报告。`
            : message,

        structured:
          previousStructured,

        warnings:
          previousWarnings,
      };
    }

    renderBaseOnly();
  }

async function generateLuckAiNarrative() {
    const previousText =
      String(
        store.luckAiState
          ?.text ??
        "",
      );

    const previousWarnings =
      Array.isArray(
        store.luckAiState
          ?.warnings,
      )
        ? store.luckAiState
            .warnings
        : [];

    store.luckAiState = {
      loading: true,
      text: previousText,
      error: "",
      warnings:
        previousWarnings,
    };

    renderBaseOnly();
    try {
      const settings = readAiSettings({ includeSecret: true });
      const prompt = buildLuckAiPrompt({
        baseBaziViewModel: store.state.baseBaziViewModel,
        natalImageReport: store.state.natalImageReport,
        luckImageReport: store.state.luckImageReport,
      });
      const outcome = await requestStageAiNarrativeWithRetry({
        settings,
        prompt,
        stage: "luck",
      });
      store.luckAiState = {
        loading: false,
        text: outcome.result.text,
        error: "",
        warnings: outcome.validation.warnings,
      };
    } catch (error) {
      store.luckAiState = {
        loading: false,
        text: previousText,
        error: previousText
          ? `${error.message} 已保留上一次成功报告。`
          : error.message,
        warnings:
          previousWarnings,
      };
    }
    renderBaseOnly();
  }

  async function generateYearAiNarrative() {
    const generationId = ++store.yearAiGenerationId;
    const targetYear = store.state?.yearImageReport?.yearItem?.year;

    const previousText =
      String(
        store.yearAiState
          ?.text ??
        "",
      );

    const previousWarnings =
      Array.isArray(
        store.yearAiState
          ?.warnings,
      )
        ? store.yearAiState
            .warnings
        : [];

    store.yearAiState = {
      loading: true,
      text: previousText,
      error: "",
      warnings:
        previousWarnings,
    };

    renderBaseOnly();
    try {
      const settings = readAiSettings({ includeSecret: true });
      const prompt = buildYearAiPrompt({
        baseBaziViewModel: store.state.baseBaziViewModel,
        natalImageReport: store.state.natalImageReport,
        luckImageReport: store.state.luckImageReport,
        yearImageReport: store.state.yearImageReport,
      });
      const outcome = await requestStageAiNarrativeWithRetry({
        settings,
        prompt,
        stage: "year",
      });
      if (generationId !== store.yearAiGenerationId || targetYear !== store.state?.yearImageReport?.yearItem?.year) return;
      store.yearAiState = {
        loading: false,
        text: outcome.result.text,
        error: "",
        warnings: outcome.validation.warnings,
      };
    } catch (error) {
      if (generationId !== store.yearAiGenerationId || targetYear !== store.state?.yearImageReport?.yearItem?.year) return;

      store.yearAiState = {
        loading: false,
        text: previousText,
        error: previousText
          ? `${error.message} 已保留上一次成功报告。`
          : error.message,
        warnings:
          previousWarnings,
      };
    }
    renderBaseOnly();
  }

  function maybeGeneratePreInterpretYearAi() {
    if (!store.currentInput.preInterpretAi || !store.state?.yearImageReport?.yearItem) return;
    const scheduledState = store.state;
    queueMicrotask(() => {
      if (store.state !== scheduledState || !store.currentInput.preInterpretAi) return;
      generateYearAiNarrative();
    });
  }

  async function generateMonthAiNarrative() {
    const previousText =
      String(
        store.monthAiState
          ?.text ??
        "",
      );

    const previousWarnings =
      Array.isArray(
        store.monthAiState
          ?.warnings,
      )
        ? store.monthAiState
            .warnings
        : [];

    store.monthAiState = {
      loading: true,
      text: previousText,
      error: "",
      warnings:
        previousWarnings,
    };

    renderBaseOnly();
    try {
      const settings = readAiSettings({ includeSecret: true });
      const prompt = buildMonthAiPrompt({
        baseBaziViewModel: store.state.baseBaziViewModel,
        natalImageReport: store.state.natalImageReport,
        luckImageReport: store.state.luckImageReport,
        yearImageReport: store.state.yearImageReport,
        monthImageReport: store.state.monthImageReport,
      });
      const outcome = await requestStageAiNarrativeWithRetry({
        settings,
        prompt,
        stage: "month",
      });
      store.monthAiState = {
        loading: false,
        text: outcome.result.text,
        error: "",
        warnings: outcome.validation.warnings,
      };
    } catch (error) {
      store.monthAiState = {
        loading: false,
        text: previousText,
        error: previousText
          ? `${error.message} 已保留上一次成功报告。`
          : error.message,
        warnings:
          previousWarnings,
      };
    }
    renderBaseOnly();
  }

  return {
    generateNatalAiNarrative,
    generateLuckAiNarrative,
    generateYearAiNarrative,
    maybeGeneratePreInterpretYearAi,
    generateMonthAiNarrative,
  };
}


async function requestStageAiNarrativeWithRetry({
  settings,
  prompt,
  stage,
} = {}) {
  const attempts = [];

  let currentPrompt =
    prompt;

  let lastRawResult =
    null;

  let lastNormalized =
    null;

  let lastValidation =
    null;

  const verifiedFacts =
    prompt
      ?.verifiedFactPack
      ?.facts ??
    [];

  for (
    let attempt = 0;
    attempt < 2;
    attempt += 1
  ) {
    const rawResult =
      await generateWithDeepSeek({
        settings,
        prompt:
          currentPrompt,
      });

    const normalized =
      normalizeStageReportResponse({
        text:
          rawResult.text,
        stage,
      });

    const validation =
      validateStageReportContract({
        report:
          normalized.report,
        stage,
        verifiedFacts,
        parseError:
          normalized.parseError,
      });

    const renderedText =
      normalized.report
        ? renderStageReport({
            report:
              normalized.report,
            stage,
            verifiedFacts,
          })
        : "";

    attempts.push({
      attempt:
        attempt + 1,
      finishReason:
        rawResult
          .finishReason,
      rawTextLength:
        String(
          rawResult
            .text ||
          "",
        ).length,
      renderedTextLength:
        renderedText
          .length,
      validation,
    });

    lastRawResult =
      rawResult;

    lastNormalized =
      normalized;

    lastValidation =
      validation;

    if (
      validation.valid &&
      renderedText
    ) {
      globalThis
        .__lastStageAiDebug = {
          stage,
          trustedPack:
            prompt
              ?.trustedPack ??
            null,
          verifiedFactPack:
            prompt
              ?.verifiedFactPack ??
            null,
          attempts,
          rawResponse:
            rawResult.text,
          structuredReport:
            normalized.report,
          renderedReport:
            renderedText,
          validation,
        };

      return {
        result: {
          ...rawResult,
          text:
            renderedText,
          structured:
            normalized.report,
        },
        validation,
        attempts,
        retried:
          attempt > 0,
      };
    }

    if (
      attempt ===
      0
    ) {
      currentPrompt =
        buildStageStructuredRepairPrompt(
          prompt,
          validation,
        );
    }
  }

  if (
    lastNormalized
      ?.report
  ) {
    const renderedText =
      renderStageReport({
        report:
          lastNormalized
            .report,
        stage,
        verifiedFacts,
      });

    if (
      renderedText
    ) {
      globalThis
        .__lastStageAiDebug = {
          stage,
          trustedPack:
            prompt
              ?.trustedPack ??
            null,
          verifiedFactPack:
            prompt
              ?.verifiedFactPack ??
            null,
          attempts,
          rawResponse:
            lastRawResult
              ?.text ??
            "",
          structuredReport:
            lastNormalized
              .report,
          renderedReport:
            renderedText,
          validation:
            lastValidation,
          displayedWithWarnings:
            true,
        };

      return {
        result: {
          ...lastRawResult,
          text:
            renderedText,
          structured:
            lastNormalized
              .report,
        },
        validation:
          lastValidation,
        attempts,
        retried:
          true,
        incomplete:
          true,
        displayedWithWarnings:
          true,
      };
    }
  }

  const rawFallback =
    String(
      lastRawResult
        ?.text ??
      "",
    ).trim();

  if (
    rawFallback
  ) {
    const fallbackValidation = {
      valid:
        false,
      safeToDisplay:
        true,
      errors:
        lastValidation
          ?.errors ??
        [
          "structured_parse_failed",
        ],
      warnings:
        lastValidation
          ?.warnings ??
        [
          "structured_parse_failed",
        ],
    };

    globalThis
      .__lastStageAiDebug = {
        stage,
        trustedPack:
          prompt
            ?.trustedPack ??
          null,
        verifiedFactPack:
          prompt
            ?.verifiedFactPack ??
          null,
        attempts,
        rawResponse:
          rawFallback,
        structuredReport:
          null,
        renderedReport:
          rawFallback,
        validation:
          fallbackValidation,
        displayedRawFallback:
          true,
      };

    return {
      result: {
        ...lastRawResult,
        text:
          rawFallback,
      },
      validation:
        fallbackValidation,
      attempts,
      retried:
        true,
      incomplete:
        true,
      displayedRawFallback:
        true,
    };
  }

  throw new Error(
    "AI未返回可显示的报告内容，请重新生成。",
  );
}


/* ===== natal-ai-robust-json:start ===== */

async function requestNatalAiReportWithRetry({
  settings,
  prompt,
} = {}) {
  const attempts = [];
  let lastError = null;

  for (
    let attempt = 0;
    attempt < 2;
    attempt += 1
  ) {
    const attemptPrompt =
      attempt === 0
        ? prompt
        : buildNatalRetryPrompt(
            prompt,
          );

    try {
      const result =
        await generateWithDeepSeek({
          settings,

          prompt:
            attemptPrompt,
        });

      attempts.push({
        attempt:
          attempt + 1,

        finishReason:
          result.finishReason,

        textLength:
          String(
            result.text ??
            "",
          ).length,

        usage:
          result.usage ??
          null,
      });

      if (
        result.finishReason ===
        "length"
      ) {
        lastError =
          new Error(
            "AI返回内容被截断。",
          );

        continue;
      }

      const validated =
        validateNatalAiResult({
          text:
            result.text,

          allowedEvidenceRefs:
            prompt.evidenceIds,

          guardEvidencePack:
            prompt.trustedPack,
        });

      if (
          validated.structured &&
          validated.valid
        ) {
        return {
          result,
          validated,
          attempts,

          retried:
            attempt > 0,
        };
      }

      lastError =
        new Error(
          "AI返回的JSON缺少完整正文。",
        );
    } catch (error) {
      lastError =
        error;

      attempts.push({
        attempt:
          attempt + 1,

        error:
          error?.message ??
          "unknown_error",
      });

      if (
        isFatalAiConfigurationError(
          error,
        )
      ) {
        break;
      }
    }
  }

  if (
    isFatalAiConfigurationError(
      lastError,
    )
  ) {
    throw lastError;
  }

  throw new Error(
    "本次AI返回格式异常，系统已自动重试一次但仍未成功，请稍后再试。",
  );
}

function buildNatalRetryPrompt(
  prompt = {},
) {
  return {
    ...prompt,

    maxTokens:
      Math.max(
        Number(
          prompt.maxTokens,
        ) || 0,
        8192,
      ),

    system: [
      prompt.system,

      "",
      "JSON格式纠错要求：",
      "上一轮输出未形成可解析的完整JSON。",
      "这一次必须从左大括号开始，到右大括号结束。",
      "不得使用Markdown代码块，不得在JSON前后添加解释。",
      "必须完整提供overview和sections。",
      "sections必须包含overall、personality、learning、career、wealth、relationship、family、expression、wellbeing九个固定key。",
      "每个section必须包含title、summary、advantage、cost、advice和evidenceRefs。",
      "不得把完整报告重新塞入overview.summary。",
      "必须完整提供summaryAdvice和reviewQuestions。",
      "summaryAdvice必须包含headline、summary、正好3条priorities、caution和evidenceRefs。",
      "每条priority必须包含title、action、reason和evidenceRefs。",
      "reviewQuestions必须包含3至5条，每条具有domain、question、reviewFocus和evidenceRefs。",
    ].join("\n"),
  };
}

function hasRenderableNatalContent(
  report = {},
) {
  if (
    textValue(
      report.text,
    ) ||
    textValue(
      report.overview
        ?.summary,
    ) ||
    textValue(
      report.coreMechanism
        ?.synthesis,
    )
  ) {
    return true;
  }

  const themeHasText =
    Array.isArray(
      report.lifeThemes,
    ) &&
    report.lifeThemes.some(
      (theme) =>
        textValue(
          theme?.summary,
        ) ||
        textValue(
          theme?.content,
        ),
    );

  if (themeHasText) {
    return true;
  }

  return (
    Array.isArray(
      report.actions,
    ) &&
    report.actions.some(
      (item) =>
        textValue(
          item?.action,
        ) ||
        textValue(
          item?.content,
        ),
    )
  );
}

function isFatalAiConfigurationError(
  error,
) {
  const message =
    String(
      error?.message ??
      "",
    );

  return (
    message.includes(
      "未检测到本地 DeepSeek Key",
    ) ||
    message.includes(
      "401",
    ) ||
    message.includes(
      "Unauthorized",
    )
  );
}

/* ===== natal-ai-robust-json:end ===== */

function validateNatalAiResult({
  text = "",
  allowedEvidenceRefs = [],
  guardEvidencePack = {},
} = {}) {
  const warnings = [];

  const allowedRefs =
    new Set(
      Array.isArray(
        allowedEvidenceRefs,
      )
        ? allowedEvidenceRefs
        : [],
    );

  const parsed =
    parseJsonObject(text);

  if (!parsed) {
    return {
      structured: null,

      warnings: [
        "ai_result_not_structured_json",
      ],
    };
  }

  const sanitized =
    sanitizeAiResultNode(
      parsed,
      {
        allowedRefs,
        warnings,
        path: "root",
      },
    );

  const normalized =
    normalizeNatalAiReport(
      sanitized,
    );

  const guarded =
    guardNatalAiContent({
      report:
        normalized,

      evidencePack:
        guardEvidencePack,
    });

  const structured =
    guarded.report;

  const structureValidation =
    validateNatalAiReport(
      structured,
    );

  warnings.push(
    ...structureValidation
      .errors
      .map(
        (error) =>
          `invalid_natal_report:${error}`,
      ),
  );
  warnings.push(
    ...guarded.warnings,
  );

  return {
    structured,

    valid:
      structureValidation.ok,

    warnings:
      uniqueText([
        ...warnings,
        ...(
          structured
            .warnings ??
          []
        ),
      ]),
  };
}

function sanitizeAiResultNode(
  value,
  {
    allowedRefs,
    warnings,
    path,
  },
) {
  if (Array.isArray(value)) {
    return value
      .map(
        (item, index) =>
          sanitizeAiResultNode(
            item,
            {
              allowedRefs,
              warnings,
              path:
                `${path}[${index}]`,
            },
          ),
      )
      .filter(
        (item) =>
          item !== undefined &&
          item !== null,
      );
  }

  if (
    value &&
    typeof value ===
      "object"
  ) {
    return Object.fromEntries(
      Object.entries(value)
        .map(
          ([key, item]) => {
            if (
              key ===
              "evidenceRefs"
            ) {
              const requestedRefs =
                uniqueText(item);

              const validRefs =
                requestedRefs.filter(
                  (ref) =>
                    allowedRefs.has(
                      ref,
                    ),
                );

              if (
                requestedRefs.length &&
                !validRefs.length
              ) {
                warnings.push(
                  `invalid_evidence_refs:${path}`,
                );
              }

              return [
                key,
                validRefs,
              ];
            }

            return [
              key,
              sanitizeAiResultNode(
                item,
                {
                  allowedRefs,
                  warnings,
                  path:
                    `${path}.${key}`,
                },
              ),
            ];
          },
        ),
    );
  }

  if (
    typeof value ===
    "string"
  ) {
    return value.trim();
  }

  return value;
}

function normalizeNatalDeepAnalysisResult(
  result = {},
  warnings = [],
) {
  const overview =
    normalizeObjectSection(
      result.overview,
    );

  const coreMechanism =
    normalizeObjectSection(
      result.coreMechanism,
    );

  coreMechanism.steps =
    normalizeObjectRows(
      coreMechanism.steps,
    );

  const normalized = {
    version:
      textValue(
        result.version,
      ) ||
      "bazi-deep-analysis-result-v1",

    scope:
      "natal",

    title:
      textValue(
        result.title,
      ) ||
      "出生原局深度分析",

    confidence:
      normalizeAiConfidence(
        result.confidence,
      ),

    overview,

    coreMechanism,

    strengths:
      normalizeObjectRows(
        result.strengths,
      ),

    repeatingPatterns:
      normalizeObjectRows(
        result.repeatingPatterns,
      ),

    lifeThemes:
      normalizeObjectRows(
        result.lifeThemes,
      ).map(
        (theme) => ({
          ...theme,

          treatment:
            normalizeThemeTreatment(
              theme.treatment,
            ),

          positive:
            normalizeTextRows(
              theme.positive,
            ),

          pressure:
            normalizeTextRows(
              theme.pressure,
            ),
        }),
      ),

    conditionalInsights:
      normalizeObjectRows(
        result.conditionalInsights,
      ).map(
        (item) => ({
          ...item,

          conditions:
            normalizeTextRows(
              item.conditions,
            ),

          counterEvidence:
            normalizeTextRows(
              item.counterEvidence,
            ),
        }),
      ),

    realityChecks:
      normalizeObjectRows(
        result.realityChecks,
      ),

    actions:
      normalizeObjectRows(
        result.actions,
      ),

    boundaries:
      normalizeTextRows(
        result.boundaries,
      ),

    warnings:
      normalizeTextRows(
        result.warnings,
      ),
  };

  if (
    !textValue(
      overview.headline,
    ) &&
    !textValue(
      overview.summary,
    )
  ) {
    warnings.push(
      "ai_overview_missing",
    );
  }

  if (
    !coreMechanism
      .steps.length &&
    !textValue(
      coreMechanism.synthesis,
    )
  ) {
    warnings.push(
      "ai_core_mechanism_missing",
    );
  }

  if (
    !normalized
      .lifeThemes.length
  ) {
    warnings.push(
      "ai_life_themes_missing",
    );
  }

  return normalized;
}

function normalizeObjectSection(
  value,
) {
  if (
    typeof value ===
    "string"
  ) {
    return {
      summary:
        value.trim(),
    };
  }

  if (
    value &&
    typeof value ===
      "object" &&
    !Array.isArray(value)
  ) {
    return {
      ...value,

      evidenceRefs:
        normalizeTextRows(
          value.evidenceRefs,
        ),
    };
  }

  return {
    evidenceRefs: [],
  };
}

function normalizeObjectRows(
  value,
) {
  return (
    Array.isArray(value)
      ? value
      : []
  )
    .filter(
      (item) =>
        item &&
        typeof item ===
          "object" &&
        !Array.isArray(item),
    )
    .map(
      (item) => ({
        ...item,

        evidenceRefs:
          normalizeTextRows(
            item.evidenceRefs,
          ),
      }),
    );
}

function normalizeTextRows(
  value,
) {
  return uniqueText(
    Array.isArray(value)
      ? value
      : (
          value
            ? [value]
            : []
        ),
  );
}

function normalizeAiConfidence(
  value,
) {
  const normalized =
    textValue(value);

  return [
    "high",
    "medium",
    "low",
  ].includes(normalized)
    ? normalized
    : "medium";
}

function normalizeThemeTreatment(
  value,
) {
  const normalized =
    textValue(value);

  return [
    "standalone",
    "integrated",
    "brief",
  ].includes(normalized)
    ? normalized
    : "integrated";
}

function textValue(
  value,
) {
  return typeof value ===
    "string"
    ? value.trim()
    : "";
}

function parseJsonObject(
  text,
) {
  const raw =
    unwrapJsonCodeFence(
      text,
    )
      .replace(
        /^\uFEFF/,
        "",
      )
      .trim();

  const candidates =
    uniqueText([
      raw,

      extractFirstJsonObject(
        raw,
      ),
    ]);

  for (
    const candidate of
    candidates
  ) {
    if (
      !candidate.startsWith(
        "{",
      )
    ) {
      continue;
    }

    try {
      const parsed =
        JSON.parse(
          candidate,
        );

      if (
        parsed &&
        typeof parsed ===
          "object" &&
        !Array.isArray(
          parsed,
        )
      ) {
        return parsed;
      }
    } catch {
      /*
       * 当前候选不是完整JSON，
       * 继续尝试下一个候选。
       */
    }
  }

  return null;
}

function unwrapJsonCodeFence(
  text,
) {
  const raw =
    String(
      text ??
      "",
    ).trim();

  const match =
    /^```(?:json)?\s*([\s\S]*?)\s*```$/i
      .exec(raw);

  return match
    ? match[1].trim()
    : raw;
}

function extractFirstJsonObject(
  text = "",
) {
  const raw =
    String(text);

  const start =
    raw.indexOf(
      "{",
    );

  if (start < 0) {
    return "";
  }

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (
    let index = start;
    index < raw.length;
    index += 1
  ) {
    const char =
      raw[index];

    if (inString) {
      if (escaped) {
        escaped = false;
        continue;
      }

      if (char === "\\") {
        escaped = true;
        continue;
      }

      if (char === '"') {
        inString = false;
      }

      continue;
    }

    if (char === '"') {
      inString = true;
      continue;
    }

    if (char === "{") {
      depth += 1;
      continue;
    }

    if (char === "}") {
      depth -= 1;

      if (depth === 0) {
        return raw
          .slice(
            start,
            index + 1,
          )
          .trim();
      }
    }
  }

  return "";
}

function uniqueText(items) {
  return [
    ...new Set(
      (Array.isArray(items) ? items : [])
        .map((item) =>
          String(item ?? "").trim(),
        )
        .filter(Boolean),
    ),
  ].sort();
}
