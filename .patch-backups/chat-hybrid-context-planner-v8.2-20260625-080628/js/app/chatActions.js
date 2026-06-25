import { readAiSettings } from "../core/ai/aiSettingsClient.js?v=20260613c";
import { buildChatPrompt } from "../core/ai/buildChatPrompt.js";
import {
  buildChatRepairPrompt,
  sanitizeChatResponse,
  validateChatResponse,
} from "../core/ai/chatResponseGuard.js";
import { generateWithDeepSeek } from "../core/ai/deepseekClient.js?v=20260613b";
import { buildLuckImageReport } from "../core/blind-bazi/buildLuckImageReport.js";
import { buildYearImageReport } from "../core/blind-bazi/buildYearImageReport.js";
import {
  buildRequestedYearReports,
  buildYearSearchPlan,
  detectChatIntent,
} from "./yearQuestionUtils.js";

export function createChatActions({
  store,
  renderBaseOnly,
}) {
  async function askAiQuestion(question) {
    const trimmedQuestion = String(question ?? "").trim();
    if (!trimmedQuestion) return;

    store.chatState = {
      ...store.chatState,
      question: trimmedQuestion,
      loading: true,
      error: "",
    };
    renderBaseOnly();

    try {
      const settings = readAiSettings({
        includeSecret: true,
      });
      const chatIntent = detectChatIntent(trimmedQuestion);
      const yearSearchPlan =
        buildYearSearchPlan({
          question:
            trimmedQuestion,

          baseYear:
            store.currentInput
              .targetYear,

          birthYear:
            store.state
              .chart
              ?.input
              ?.year ??
            store.state
              .baseBaziViewModel
              ?.birthInfo
              ?.year,

          luckItems:
            store.state
              .luckImageReport
              ?.luckItems ??
            [],
        });

      const requestedYears =
        yearSearchPlan.years;

      const requestedYearReports = buildRequestedYearReports({
        years: requestedYears,
        state: store.state,
        buildLuckImageReport,
        buildYearImageReport,
      });

      const prompt = buildChatPrompt({
        question: trimmedQuestion,
        natalImageReport: store.state.natalImageReport,
        luckImageReport: store.state.luckImageReport,
        yearImageReport: store.state.yearImageReport,
        monthImageReport: store.state.monthImageReport,
        monthImageReports: store.state.monthImageReports,
        chatIntent,
        requestedYears,
        requestedYearReports,
        yearSearchPlan,

        chart:
          store.state.chart,

        baseBaziViewModel:
          store.state
            .baseBaziViewModel,

        currentInput:
          store.currentInput,
      });

      const firstResult = await generateWithDeepSeek({
        settings,
        prompt,
      });
      const firstValidation = validateChatResponse({
        text: firstResult.text,
        prompt,
      });

      let finalText = firstResult.text;
      const attempts = [
        {
          attempt: 1,
          violations: firstValidation.violations,
          finishReason: firstResult.finishReason ?? null,
        },
      ];

      if (!firstValidation.valid) {
        const repairPrompt = buildChatRepairPrompt({
          basePrompt: prompt,
          draft: firstResult.text,
          violations: firstValidation.violations,
        });
        const repairResult = await generateWithDeepSeek({
          settings,
          prompt: repairPrompt,
        });
        const repairValidation = validateChatResponse({
          text: repairResult.text,
          prompt,
        });

        attempts.push({
          attempt: 2,
          violations: repairValidation.violations,
          finishReason: repairResult.finishReason ?? null,
        });

        finalText = repairValidation.valid
          ? repairResult.text
          : sanitizeChatResponse({
              text: repairResult.text,
              prompt,
            });
      }

      globalThis.__lastChatAiDebug = {
        chatIntent,
        requestedYears,
        yearSearchPlan,
        dataMode: "hard_facts_only",
        attempts,
        promptPayload: safeParseJson(prompt.user),
      };

      store.chatState = {
        question: "",
        loading: false,
        error: "",
        messages: [
          ...store.chatState.messages,
          {
            question: trimmedQuestion,
            answer: finalText,
          },
        ].slice(-5),
      };
    } catch (error) {
      store.chatState = {
        ...store.chatState,
        loading: false,
        error: error.message,
      };
    }

    renderBaseOnly();
  }

  return {
    askAiQuestion,
  };
}

function safeParseJson(value) {
  try {
    return JSON.parse(String(value ?? "{}"));
  } catch {
    return null;
  }
}
