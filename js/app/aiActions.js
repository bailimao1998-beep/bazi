import { readAiSettings } from "../core/ai/aiSettingsClient.js?v=20260613c";
import { buildLuckAiPrompt } from "../core/ai/buildLuckAiPrompt.js";
import { buildMonthAiPrompt } from "../core/ai/buildMonthAiPrompt.js";
import { buildNatalAiPrompt } from "../core/ai/buildNatalAiPrompt.js";
import { buildYearAiPrompt } from "../core/ai/buildYearAiPrompt.js";
import { generateWithDeepSeek } from "../core/ai/deepseekClient.js?v=20260613b";

export function createAiActions({ store, renderBaseOnly }) {
  async function generateNatalAiNarrative() {
    store.natalAiState = { loading: true, text: "", error: "" };
    renderBaseOnly();
    try {
      const settings = readAiSettings({ includeSecret: true });
      const prompt = buildNatalAiPrompt({
        baseBaziViewModel: store.state.baseBaziViewModel,
        natalImageReport: store.state.natalImageReport,
      });
      const result = await generateWithDeepSeek({ settings, prompt });
      store.natalAiState = { loading: false, text: result.text, error: "" };
    } catch (error) {
      store.natalAiState = { loading: false, text: "", error: error.message };
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
