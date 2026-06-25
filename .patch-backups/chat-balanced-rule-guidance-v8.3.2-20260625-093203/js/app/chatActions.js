
import { readAiSettings } from "../core/ai/aiSettingsClient.js?v=20260613c";
import { buildChatPrompt } from "../core/ai/buildChatPrompt.js";
import {
  buildChatRepairPrompt,
  sanitizeChatResponse,
  stripRuleAudit,
  validateChatResponse,
} from "../core/ai/chatResponseGuard.js";
import {
  buildChatContextPlan,
} from "../core/ai/buildChatContextPlan.js";
import {
  selectChatImagery,
} from "../core/ai/selectChatImagery.js";
import {
  buildImageryRulePack,
} from "../core/imagery-rules/buildImageryRulePack.js";
import { generateWithDeepSeek } from "../core/ai/deepseekClient.js?v=20260613b";
import { buildLuckImageReport } from "../core/blind-bazi/buildLuckImageReport.js";
import { buildYearImageReport } from "../core/blind-bazi/buildYearImageReport.js";
import { buildMonthImageReport } from "../core/blind-bazi/buildMonthImageReport.js";
import {
  buildRequestedYearReports,
  buildYearSearchPlan,
  detectChatIntent,
} from "./yearQuestionUtils.js";

export function createChatActions({
  store,
  renderBaseOnly,
}) {
  async function askAiQuestion(
    question,
  ) {
    const trimmedQuestion =
      String(
        question ??
        "",
      ).trim();

    if (
      !trimmedQuestion
    ) {
      return;
    }

    store.chatState = {
      ...store.chatState,
      question:
        trimmedQuestion,
      loading:
        true,
      error:
        "",
    };

    renderBaseOnly();

    try {
      const settings =
        readAiSettings({
          includeSecret:
            true,
        });

      const chatIntent =
        detectChatIntent(
          trimmedQuestion,
        );

      const birthYear =
        firstFiniteNumber([
          store.state
            .chart
            ?.input
            ?.year,
          store.state
            .chart
            ?.input
            ?.birthYear,
          store.state
            .baseBaziViewModel
            ?.birthInfo
            ?.year,
        ]);

      const targetYear =
        firstFiniteNumber([
          store.currentInput
            ?.targetYear,
          store.state
            .chart
            ?.input
            ?.targetYear,
          new Date()
            .getFullYear(),
        ]);

      const selectedMonth =
        firstFiniteNumber([
          store.currentInput
            ?.selectedMonth,
          store.state
            .chart
            ?.input
            ?.selectedMonth,
          1,
        ]);

      const yearSearchPlan =
        buildYearSearchPlan({
          question:
            trimmedQuestion,

          baseYear:
            targetYear,

          birthYear,

          luckItems:
            store.state
              .luckImageReport
              ?.luckItems ??
            [],
        });

      const requestedYears =
        yearSearchPlan.years;

      const requestedYearReports =
        buildRequestedYearReports({
          years:
            requestedYears,
          state:
            store.state,
          buildLuckImageReport,
          buildYearImageReport,
        });

      const targetYearReport =
        resolveTargetYearReport({
          requestedYearReports,
          fallbackLuckImageReport:
            store.state
              .luckImageReport,
          fallbackYearImageReport:
            store.state
              .yearImageReport,
          targetYear,
        });

      let contextPlan =
        buildChatContextPlan({
          question:
            trimmedQuestion,

          chatIntent,

          requestedYears,

          yearSearchPlan,

          chartAvailable:
            Boolean(
              store.state
                .chart &&
              store.state
                .natalImageReport,
            ),

          monthReportsAvailable:
            hasTwelveMonthReports({
              reports:
                store.state
                  .monthImageReports,
              targetYear:
                targetYearReport
                  .year ??
                targetYear,
            }),

          targetYear:
            targetYearReport
              .year ??
            targetYear,

          selectedMonth,
        });

      const resolvedMonthReports =
        contextPlan
          ?.include
          ?.monthBasics
          ? buildMonthReportsOnDemand({
              state:
                store.state,

              targetYear:
                targetYearReport
                  .year ??
                targetYear,

              existingReports:
                store.state
                  .monthImageReports,

              fallbackLuckImageReport:
                targetYearReport
                  .luckImageReport,

              fallbackYearImageReport:
                targetYearReport
                  .yearImageReport,
            })
          : [];

      const resolvedMonthReport =
        resolveSelectedMonthReport({
          reports:
            resolvedMonthReports,

          fallback:
            store.state
              .monthImageReport,

          targetYear:
            targetYearReport
              .year ??
            targetYear,

          selectedMonth,
        });

      contextPlan = {
        ...contextPlan,

        availability: {
          ...contextPlan
            .availability,

          monthReports:
            hasTwelveMonthReports({
              reports:
                resolvedMonthReports,
              targetYear:
                targetYearReport
                  .year ??
                targetYear,
            }),
        },
      };

      const selectedImagery =
        selectChatImagery({
          plan:
            contextPlan,

          natalImageReport:
            store.state
              .natalImageReport,

          luckImageReport:
            targetYearReport
              .luckImageReport ??
            store.state
              .luckImageReport,

          yearImageReport:
            targetYearReport
              .yearImageReport ??
            store.state
              .yearImageReport,

          monthImageReport:
            resolvedMonthReport,

          monthImageReports:
            resolvedMonthReports,

          requestedYearReports,
        });

      const imageryRulePack =
        buildImageryRulePack({
          question:
            trimmedQuestion,

          plan:
            contextPlan,

          natalImageReport:
            store.state
              .natalImageReport,

          luckImageReport:
            targetYearReport
              .luckImageReport ??
            store.state
              .luckImageReport,

          yearImageReport:
            targetYearReport
              .yearImageReport ??
            store.state
              .yearImageReport,

          monthImageReport:
            resolvedMonthReport,

          monthImageReports:
            resolvedMonthReports,

          requestedYearReports,

          selectedImagery,
        });

      const prompt =
        buildChatPrompt({
          question:
            trimmedQuestion,

          natalImageReport:
            store.state
              .natalImageReport,

          luckImageReport:
            targetYearReport
              .luckImageReport ??
            store.state
              .luckImageReport,

          yearImageReport:
            targetYearReport
              .yearImageReport ??
            store.state
              .yearImageReport,

          monthImageReport:
            resolvedMonthReport,

          monthImageReports:
            resolvedMonthReports,

          chatIntent,

          requestedYears,

          requestedYearReports,

          yearSearchPlan,

          contextPlan,

          selectedImagery,

          imageryRulePack,

          chatHistory:
            store.chatState
              .messages,

          chart:
            store.state
              .chart,

          baseBaziViewModel:
            store.state
              .baseBaziViewModel,

          currentInput:
            store.currentInput,
        });

      const firstResult =
        await generateWithDeepSeek({
          settings,
          prompt,
        });

      const firstValidation =
        validateChatResponse({
          text:
            firstResult.text,
          prompt,
        });

      let finalText =
        firstResult.text;

      const attempts = [
        {
          attempt:
            1,

          violations:
            firstValidation
              .violations,

          finishReason:
            firstResult
              .finishReason ??
            null,

          ruleAuditClaimCount:
            Array.isArray(
              firstValidation
                .ruleAudit
                ?.claims,
            )
              ? firstValidation
                  .ruleAudit
                  .claims
                  .length
              : 0,
        },
      ];

      if (
        !firstValidation.valid
      ) {
        const repairPrompt =
          buildChatRepairPrompt({
            basePrompt:
              prompt,

            draft:
              firstResult.text,

            violations:
              firstValidation
                .violations,
          });

        const repairResult =
          await generateWithDeepSeek({
            settings,
            prompt:
              repairPrompt,
          });

        const repairValidation =
          validateChatResponse({
            text:
              repairResult.text,
            prompt,
          });

        attempts.push({
          attempt:
            2,

          violations:
            repairValidation
              .violations,

          finishReason:
            repairResult
              .finishReason ??
            null,

          ruleAuditClaimCount:
            Array.isArray(
              repairValidation
                .ruleAudit
                ?.claims,
            )
              ? repairValidation
                  .ruleAudit
                  .claims
                  .length
              : 0,
        });

        finalText =
          repairValidation.valid
            ? repairResult.text
            : sanitizeChatResponse({
                text:
                  repairResult.text,
                prompt,
              });
      }

      finalText =
        stripRuleAudit(
          finalText,
        );

      globalThis
        .__lastChatAiDebug = {
          chatIntent,

          requestedYears,

          yearSearchPlan,

          contextPlan,

          selectedImagery,

          imageryRulePack: {
            version:
              imageryRulePack.version,

            matchedRuleIds:
              imageryRulePack
                .matchedRuleIds,

            sourceSummary:
              imageryRulePack
                .sourceSummary,
          },

          dataMode:
            "hybrid_facts_plus_selected_imagery_plus_rule_kb",

          ruleConstraintMode:
            imageryRulePack
              ?.ruleConstraint
              ?.mode ??
            "open",

          attempts,

          promptPayload:
            safeParseJson(
              prompt.user,
            ),
        };

      store.chatState = {
        question:
          "",

        loading:
          false,

        error:
          "",

        messages: [
          ...store.chatState
            .messages,

          {
            question:
              trimmedQuestion,

            answer:
              finalText,
          },
        ].slice(
          -8,
        ),
      };
    } catch (
      error
    ) {
      store.chatState = {
        ...store.chatState,
        loading:
          false,
        error:
          error.message,
      };
    }

    renderBaseOnly();
  }

  return {
    askAiQuestion,
  };
}

function resolveTargetYearReport({
  requestedYearReports,
  fallbackLuckImageReport,
  fallbackYearImageReport,
  targetYear,
} = {}) {
  const reports =
    Array.isArray(
      requestedYearReports,
    )
      ? requestedYearReports
      : [];

  const exact =
    reports.find(
      (item) =>
        Number(
          item?.year,
        ) ===
        Number(
          targetYear,
        ),
    );

  const first =
    exact ??
    reports[0] ??
    null;

  return {
    year:
      first?.year ??
      fallbackYearImageReport
        ?.yearItem
        ?.year ??
      targetYear,

    luckImageReport:
      first
        ?.luckImageReport ??
      fallbackLuckImageReport,

    yearImageReport:
      first
        ?.yearImageReport ??
      fallbackYearImageReport,
  };
}

function buildMonthReportsOnDemand({
  state,
  targetYear,
  existingReports,
  fallbackLuckImageReport,
  fallbackYearImageReport,
} = {}) {
  if (
    hasTwelveMonthReports({
      reports:
        existingReports,
      targetYear,
    })
  ) {
    return existingReports
      .filter(
        (report) =>
          Number(
            report
              ?.monthItem
              ?.year,
          ) ===
          Number(
            targetYear,
          ),
      )
      .sort(
        compareMonthReports,
      );
  }

  if (
    !state?.chart ||
    !state
      ?.baseBaziViewModel ||
    !state
      ?.natalImageReport
  ) {
    return [];
  }

  const luckImageReport =
    fallbackLuckImageReport ??
    buildLuckImageReport({
      chart:
        state.chart,

      baseBaziViewModel:
        state
          .baseBaziViewModel,

      natalImageReport:
        state
          .natalImageReport,

      targetYear,
    });

  const yearImageReport =
    fallbackYearImageReport ??
    buildYearImageReport({
      chart:
        state.chart,

      baseBaziViewModel:
        state
          .baseBaziViewModel,

      natalImageReport:
        state
          .natalImageReport,

      luckImageReport,

      targetYear,
    });

  return Array.from(
    {
      length:
        12,
    },
    (
      _,
      index,
    ) =>
      buildMonthImageReport({
        chart:
          state.chart,

        baseBaziViewModel:
          state
            .baseBaziViewModel,

        natalImageReport:
          state
            .natalImageReport,

        luckImageReport,

        yearImageReport,

        targetYear,

        selectedMonth:
          index +
          1,
      }),
  ).sort(
    compareMonthReports,
  );
}

function resolveSelectedMonthReport({
  reports,
  fallback,
  targetYear,
  selectedMonth,
} = {}) {
  const matched =
    (
      Array.isArray(
        reports,
      )
        ? reports
        : []
    ).find(
      (report) =>
        Number(
          report
            ?.monthItem
            ?.year,
        ) ===
          Number(
            targetYear,
          ) &&
        Number(
          report
            ?.monthItem
            ?.month ??
          report
            ?.monthItem
            ?.flowMonthIndex,
        ) ===
          Number(
            selectedMonth,
          ),
    );

  if (
    matched
  ) {
    return matched;
  }

  const fallbackYear =
    Number(
      fallback
        ?.monthItem
        ?.year,
    );

  const fallbackMonth =
    Number(
      fallback
        ?.monthItem
        ?.month ??
      fallback
        ?.monthItem
        ?.flowMonthIndex,
    );

  if (
    fallback &&
    fallbackYear ===
      Number(
        targetYear,
      ) &&
    fallbackMonth ===
      Number(
        selectedMonth,
      )
  ) {
    return fallback;
  }

  return null;
}

function hasTwelveMonthReports({
  reports,
  targetYear,
} = {}) {
  const months =
    new Set(
      (
        Array.isArray(
          reports,
        )
          ? reports
          : []
      )
        .filter(
          (report) =>
            Number(
              report
                ?.monthItem
                ?.year,
            ) ===
            Number(
              targetYear,
            ),
        )
        .map(
          (report) =>
            Number(
              report
                ?.monthItem
                ?.month ??
              report
                ?.monthItem
                ?.flowMonthIndex,
            ),
        )
        .filter(
          (month) =>
            Number.isFinite(
              month,
            ) &&
            month >=
              1 &&
            month <=
              12,
        ),
    );

  return months.size ===
    12;
}

function compareMonthReports(
  left,
  right,
) {
  return Number(
    left
      ?.monthItem
      ?.month ??
    left
      ?.monthItem
      ?.flowMonthIndex ??
    0,
  ) -
  Number(
    right
      ?.monthItem
      ?.month ??
    right
      ?.monthItem
      ?.flowMonthIndex ??
    0,
  );
}

function firstFiniteNumber(
  items,
) {
  const matched =
    (
      Array.isArray(
        items,
      )
        ? items
        : []
    )
      .map(Number)
      .find(
        Number.isFinite,
      );

  return matched ??
    null;
}

function safeParseJson(
  value,
) {
  try {
    return JSON.parse(
      String(
        value ??
        "{}",
      ),
    );
  } catch {
    return null;
  }
}
