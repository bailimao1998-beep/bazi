import { readAiSettings } from "../core/ai/aiSettingsClient.js?v=20260613c";
import { buildChatPrompt } from "../core/ai/buildChatPrompt.js";
import { generateWithDeepSeek } from "../core/ai/deepseekClient.js?v=20260613b";
import { buildLuckImageReport } from "../core/blind-bazi/buildLuckImageReport.js";
import { buildYearImageReport } from "../core/blind-bazi/buildYearImageReport.js";
import {
  buildRequestedYearReports,
  detectChatIntent,
  extractYearsFromQuestion,
} from "./yearQuestionUtils.js";

export function createChatActions({ store, renderBaseOnly }) {
  async function askAiQuestion(question) {
    const trimmedQuestion = String(question ?? "").trim();
    if (!trimmedQuestion) return;
    store.chatState = { ...store.chatState, question: trimmedQuestion, loading: true, error: "" };
    renderBaseOnly();
    try {
      const settings = readAiSettings({ includeSecret: true });
      const chatIntent = detectChatIntent(trimmedQuestion);
      const requestedYears = extractYearsFromQuestion(trimmedQuestion, store.currentInput.targetYear);
      const requestedYearReports = buildRequestedYearReports({
        years: requestedYears,
        state: store.state,
        buildLuckImageReport,
        buildYearImageReport,
      });

      const prompt = buildChatPrompt({
        question: trimmedQuestion,
        input: store.state.input,
        chart: store.state.chart,
        baseBaziViewModel: store.state.baseBaziViewModel,
        natalImageReport: store.state.natalImageReport,
        luckImageReport: store.state.luckImageReport,
        yearImageReport: store.state.yearImageReport,
        monthImageReport: store.state.monthImageReport,
        monthImageReports: store.state.monthImageReports,
        chatIntent,
        requestedYears,
        requestedYearReports,
      });
      const result = await generateWithDeepSeek({ settings, prompt });
      store.chatState = {
        question: "",
        loading: false,
        error: "",
        messages: [...store.chatState.messages, { question: trimmedQuestion, answer: result.text }].slice(-5),
      };
    } catch (error) {
      store.chatState = { ...store.chatState, loading: false, error: error.message };
    }
    renderBaseOnly();
  }

  return { askAiQuestion };
}
