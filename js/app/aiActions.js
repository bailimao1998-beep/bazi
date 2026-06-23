import { readAiSettings } from "../core/ai/aiSettingsClient.js?v=20260613c";
import { buildLuckAiPrompt } from "../core/ai/buildLuckAiPrompt.js";
import { buildMonthAiPrompt } from "../core/ai/buildMonthAiPrompt.js";
import { buildNatalAiPrompt } from "../core/ai/buildNatalAiPrompt.js";
import { buildYearAiPrompt } from "../core/ai/buildYearAiPrompt.js";
import { generateWithDeepSeek } from "../core/ai/deepseekClient.js?v=20260613b";
import {
  guardNatalAiContent,
} from "../core/ai/natalAiContentGuard.js";

export function createAiActions({ store, renderBaseOnly }) {
  async function generateNatalAiNarrative() {
    store.natalAiState = {
      loading: true,
      text: "",
      error: "",
      structured: null,
      warnings: [],
    };

    renderBaseOnly();

    try {
      const settings =
        readAiSettings({
          includeSecret: true,
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

          rawResponse: "",

          normalizedResponse:
            null,
        };

      const result =
        await generateWithDeepSeek({
          settings,
          prompt,
        });

      /*
      * 模型因长度限制停止时，
      * 返回的JSON通常没有闭合。
      */
      if (
        result.finishReason ===
        "length"
      ) {
        throw new Error(
          "本次AI报告内容过长，返回结果被截断。系统已拦截残缺内容，请重新生成。",
        );
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

      /*
      * JSON解析失败时不能把原始JSON
      * 当成普通文章显示给用户。
      */
      if (!validated.structured) {
        console.warn(
          "[natal-ai] invalid structured result",
          validated.warnings,
        );

        throw new Error(
          "AI返回的报告格式不完整，系统已拦截原始JSON，请重新生成。",
        );
      }

      store.natalAiState = {
        loading: false,

        /*
        * JSON只作为内部数据，
        * 用户页面只展示structured卡片。
        */
        text: "",

        error: "",

        structured:
          validated.structured,

        warnings:
          validated.warnings,
      };
    } catch (error) {
      store.natalAiState = {
        loading: false,
        text: "",
        error:
          error?.message ??
          "AI深度分析生成失败。",
        structured: null,
        warnings: [],
      };
    }

    renderBaseOnly();
  }

  async function generateLuckAiNarrative() {
    store.luckAiState = { loading: true, text: "", error: "" };
    renderBaseOnly();
    try {
      const settings = readAiSettings({ includeSecret: true });
      const prompt = buildLuckAiPrompt({
        baseBaziViewModel: store.state.baseBaziViewModel,
        natalImageReport: store.state.natalImageReport,
        luckImageReport: store.state.luckImageReport,
      });
      const result = await generateWithDeepSeek({ settings, prompt });
      store.luckAiState = { loading: false, text: result.text, error: "" };
    } catch (error) {
      store.luckAiState = { loading: false, text: "", error: error.message };
    }
    renderBaseOnly();
  }

  async function generateYearAiNarrative() {
    const generationId = ++store.yearAiGenerationId;
    const targetYear = store.state?.yearImageReport?.yearItem?.year;
    store.yearAiState = { loading: true, text: "", error: "" };
    renderBaseOnly();
    try {
      const settings = readAiSettings({ includeSecret: true });
      const prompt = buildYearAiPrompt({
        baseBaziViewModel: store.state.baseBaziViewModel,
        natalImageReport: store.state.natalImageReport,
        luckImageReport: store.state.luckImageReport,
        yearImageReport: store.state.yearImageReport,
      });
      const result = await generateWithDeepSeek({ settings, prompt });
      if (generationId !== store.yearAiGenerationId || targetYear !== store.state?.yearImageReport?.yearItem?.year) return;
      store.yearAiState = { loading: false, text: result.text, error: "" };
    } catch (error) {
      if (generationId !== store.yearAiGenerationId || targetYear !== store.state?.yearImageReport?.yearItem?.year) return;
      store.yearAiState = { loading: false, text: "", error: error.message };
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
    store.monthAiState = { loading: true, text: "", error: "" };
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
      const result = await generateWithDeepSeek({ settings, prompt });
      store.monthAiState = { loading: false, text: result.text, error: "" };
    } catch (error) {
      store.monthAiState = { loading: false, text: "", error: error.message };
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
    normalizeNatalDeepAnalysisResult(
      sanitized,
      warnings,
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

  warnings.push(
    ...guarded.warnings,
  );

  return {
    structured,

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

function parseJsonObject(text) {
  const raw =
    unwrapJsonCodeFence(text);

  if (!raw.startsWith("{")) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw);

    return (
      parsed &&
      typeof parsed === "object" &&
      !Array.isArray(parsed)
    )
      ? parsed
      : null;
  } catch {
    return null;
  }
}

function unwrapJsonCodeFence(text) {
  const raw =
    String(text ?? "").trim();

  const match =
    /^```(?:json)?\s*([\s\S]*?)\s*```$/i.exec(
      raw,
    );

  return match
    ? match[1].trim()
    : raw;
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
