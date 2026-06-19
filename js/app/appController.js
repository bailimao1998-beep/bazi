import { loadRuntimeAiSettings } from "../core/ai/aiSettingsClient.js?v=20260613c";
import { buildLuckImageReport } from "../core/blind-bazi/buildLuckImageReport.js";
import { buildMonthImageReport } from "../core/blind-bazi/buildMonthImageReport.js";
import { buildNatalImageReport } from "../core/blind-bazi/buildNatalImageReport.js";
import { buildYearImageReport } from "../core/blind-bazi/buildYearImageReport.js";
import { buildBaseBaziViewModel } from "../core/bazi/buildBaseBaziViewModel.js";
import { calculateBazi } from "../core/bazi/calculateBazi.js";
import { loadLocationCatalog } from "../core/location/locationCatalogClient.js";
import { renderAiChatPanel } from "../components/aiChatPanel.js";
import { renderBaseBaziPanel } from "../components/baseBaziPanel.js";
import { renderBirthForm } from "../components/birthForm.js";
import { renderChartSummary } from "../components/chartSummary.js";
import { renderFloatingAssistPanel } from "../components/floatingAssistPanel.js";
import { renderFortuneTransitPanel } from "../components/fortuneTransitPanel.js";
import { renderNatalAiNarrativePanel } from "../components/natalAiNarrativePanel.js";
import { renderNatalImagePanel } from "../components/natalImagePanel.js";
import { renderStageAnalysisPanel } from "../components/stageAnalysisPanel.js";
import { createAiActions } from "./aiActions.js";
import { createAppState, resetGeneratedStates } from "./appState.js";
import { createChatActions } from "./chatActions.js";
import { renderBaseError } from "./renderBaseError.js";
import { bindShenshaPopupEvents } from "./shenshaPopup.js";

export function createAppController({ roots, initialInput }) {
  const store = createAppState(initialInput);
  const aiActions = createAiActions({ store, renderBaseOnly });
  const chatActions = createChatActions({ store, renderBaseOnly });

  async function init() {
    store.locationCatalog = await loadLocationCatalog();
    await loadRuntimeAiSettings();

    renderBirthForm(roots.birthForm, {
      initialValue: store.currentInput,
      locationCatalog: store.locationCatalog,
      onSubmit(payload) {
        store.currentInput = { ...store.currentInput, ...payload };
        refresh();
      },
    });

    bindAiChatDrawer();
    renderShell();
    refresh();
  }

  function refresh() {
    if (roots.status) roots.status.textContent = "正在前端排盘...";
    try {
      const chart = calculateBazi(store.currentInput, {
        locations: store.locationCatalog,
      });
      const baseBaziViewModel = buildBaseBaziViewModel(chart);
      const natalImageReport = buildNatalImageReport({ chart, baseBaziViewModel });
      const luckImageReport = buildLuckImageReport({
        chart,
        baseBaziViewModel,
        natalImageReport,
        targetYear: store.currentInput.targetYear,
      });
      const yearImageReport = buildYearImageReport({
        chart,
        baseBaziViewModel,
        natalImageReport,
        luckImageReport,
        targetYear: store.currentInput.targetYear,
      });
      const monthImageReport = dedupeMonthImageReportRelations(buildMonthImageReport({
        chart,
        baseBaziViewModel,
        natalImageReport,
        luckImageReport,
        yearImageReport,
        targetYear: store.currentInput.targetYear,
        selectedMonth: store.currentInput.selectedMonth,
      }));
      const monthImageReports = Array.from({ length: 12 }, (_, index) => dedupeMonthImageReportRelations(buildMonthImageReport({
        chart,
        baseBaziViewModel,
        natalImageReport,
        luckImageReport,
        yearImageReport,
        targetYear: store.currentInput.targetYear,
        selectedMonth: index + 1,
      })));
      store.state = {
        input: store.currentInput,
        chart,
        baseBaziViewModel,
        natalImageReport,
        luckImageReport,
        yearImageReport,
        monthImageReport,
        monthImageReports,
      };
      store.yearAiGenerationId += 1;
      resetGeneratedStates(store);
      renderBaseOnly();
      if (roots.status) roots.status.textContent = "基础排盘已完成。";
      aiActions.maybeGeneratePreInterpretYearAi();
    } catch (error) {
      store.state = { input: store.currentInput, error: error.message };
      renderBaseError(error, { roots, state: store.state });
      if (roots.status) roots.status.textContent = `基础排盘失败：${error.message}`;
    }
  }

  function renderShell() {
    renderChartSummary(roots.chartSummary, null);
    renderBaseBaziPanel(roots.baseBaziPanel, null);
    renderNatalImagePanel(roots.natalImagePanel, null);
    renderNatalAiNarrativePanel(roots.natalAiNarrative, {
      state: store.natalAiState,
      hasReport: false,
      onGenerate: aiActions.generateNatalAiNarrative,
    });
    renderFortuneTransitPanel(roots.fortuneTransitPanel, {
      state: store.state,
      luckAiState: store.luckAiState,
      yearAiState: store.yearAiState,
      monthAiState: store.monthAiState,
      onSelectLuckYear: selectTargetYear,
      onSelectYear: selectTargetYear,
      onSelectMonth: selectTargetMonth,
      onGenerateLuckAi: aiActions.generateLuckAiNarrative,
      onGenerateYearAi: aiActions.generateYearAiNarrative,
      onGenerateMonthAi: aiActions.generateMonthAiNarrative,
    });
    renderStageAnalysisPanel(roots.luckStageAnalysis, {
      title: "大运分析",
      description: "围绕当前选中的大运展开取象与 AI 分析。",
      stage: "luck",
      aiState: store.luckAiState,
      aiTitle: "AI 大运分析",
      aiButton: "生成大运 AI 分析",
      onGenerateAi: aiActions.generateLuckAiNarrative,
    });
    renderStageAnalysisPanel(roots.yearStageAnalysis, {
      title: "流年分析",
      description: "围绕当前选中的流年展开取象与 AI 分析。",
      stage: "year",
      aiState: store.yearAiState,
      aiTitle: "AI 流年分析",
      aiButton: "生成流年 AI 分析",
      onGenerateAi: aiActions.generateYearAiNarrative,
    });
    renderStageAnalysisPanel(roots.monthStageAnalysis, {
      title: "流月分析",
      description: "围绕当前选中的流月展开取象与 AI 分析。",
      stage: "month",
      aiState: store.monthAiState,
      aiTitle: "AI 流月分析",
      aiButton: "生成流月 AI 分析",
      onGenerateAi: aiActions.generateMonthAiNarrative,
    });
    renderAiChatPanel(roots.aiChatPanel, {
      state: store.chatState,
      hasReport: false,
      chartContext: null,
      onAsk: chatActions.askAiQuestion,
    });
    renderFloatingAssistPanel(roots.floatingAssist, { state: store.state });
  }

  function renderBaseOnly() {
    renderChartSummary(roots.chartSummary, store.state);
    renderBaseBaziPanel(roots.baseBaziPanel, store.state.baseBaziViewModel);
    renderNatalImagePanel(roots.natalImagePanel, store.state.natalImageReport);
    renderNatalAiNarrativePanel(roots.natalAiNarrative, {
      state: store.natalAiState,
      hasReport: Boolean(store.state.natalImageReport),
      onGenerate: aiActions.generateNatalAiNarrative,
    });
    renderFortuneTransitPanel(roots.fortuneTransitPanel, {
      state: store.state,
      luckAiState: store.luckAiState,
      yearAiState: store.yearAiState,
      monthAiState: store.monthAiState,
      onSelectLuckYear: selectTargetYear,
      onSelectYear: selectTargetYear,
      onSelectMonth: selectTargetMonth,
      onGenerateLuckAi: aiActions.generateLuckAiNarrative,
      onGenerateYearAi: aiActions.generateYearAiNarrative,
      onGenerateMonthAi: aiActions.generateMonthAiNarrative,
    });
    renderStageAnalysisPanel(roots.luckStageAnalysis, {
      title: "大运分析",
      description: "围绕当前选中的大运展开取象与 AI 分析。",
      report: store.state.luckImageReport,
      stage: "luck",
      aiState: store.luckAiState,
      aiTitle: "AI 大运分析",
      aiButton: "生成大运 AI 分析",
      onGenerateAi: aiActions.generateLuckAiNarrative,
    });
    renderStageAnalysisPanel(roots.yearStageAnalysis, {
      title: "流年分析",
      description: "围绕当前选中的流年展开取象与 AI 分析。",
      report: store.state.yearImageReport,
      stage: "year",
      aiState: store.yearAiState,
      aiTitle: "AI 流年分析",
      aiButton: "生成流年 AI 分析",
      onGenerateAi: aiActions.generateYearAiNarrative,
    });
    renderStageAnalysisPanel(roots.monthStageAnalysis, {
      title: "流月分析",
      description: "围绕当前选中的流月展开取象与 AI 分析。",
      report: store.state.monthImageReport,
      stage: "month",
      aiState: store.monthAiState,
      aiTitle: "AI 流月分析",
      aiButton: "生成流月 AI 分析",
      onGenerateAi: aiActions.generateMonthAiNarrative,
    });
    renderAiChatPanel(roots.aiChatPanel, {
      state: store.chatState,
      hasReport: Boolean(store.state?.natalImageReport),
      chartContext: store.state,
      onAsk: chatActions.askAiQuestion,
    });
    setAiChatOpen(store.aiChatOpen);
    bindShenshaPopupEvents();
    renderFloatingAssistPanel(roots.floatingAssist, { state: store.state });
  }

  function selectTargetYear(year) {
    const targetYear = Number(year);
    if (!Number.isFinite(targetYear)) return;
    store.currentInput = { ...store.currentInput, targetYear };
    refresh();
  }

  function selectTargetMonth(month) {
    const selectedMonth = Math.min(12, Math.max(1, Math.trunc(Number(month))));
    if (!Number.isFinite(selectedMonth)) return;
    store.currentInput = { ...store.currentInput, selectedMonth };
    refresh();
  }

  function bindAiChatDrawer() {
    roots.aiChatToggle?.addEventListener("click", () => setAiChatOpen(true));
    roots.aiChatClose?.addEventListener("click", () => setAiChatOpen(false));
    setAiChatOpen(store.aiChatOpen);
  }

  function setAiChatOpen(open) {
    store.aiChatOpen = Boolean(open);
    if (roots.aiChatDrawer) roots.aiChatDrawer.hidden = !store.aiChatOpen;
    roots.aiChatToggle?.setAttribute("aria-expanded", store.aiChatOpen ? "true" : "false");
  }

  return {
    init,
    refresh,
    renderShell,
    renderBaseOnly,
    selectTargetYear,
    selectTargetMonth,
    bindAiChatDrawer,
    setAiChatOpen,
    store,
  };
}

function dedupeMonthImageReportRelations(report = {}) {
  const item = report.monthItem;
  if (!item) return report;
  return {
    ...report,
    monthItem: {
      ...item,
      relationToNatal: uniqueRelations(item.relationToNatal),
      relationToLuck: uniqueRelations(item.relationToLuck),
      relationToYear: uniqueRelations(item.relationToYear),
    },
  };
}

function uniqueRelations(relations = []) {
  const seen = new Set();
  return (Array.isArray(relations) ? relations : []).filter((relation) => {
    const key = [
      relation.type,
      relation.natalPillar ?? relation.luckGanZhi ?? relation.yearGanZhi ?? "",
      relation.natalBranch ?? relation.luckBranch ?? relation.yearBranch ?? "",
      relation.monthBranch ?? relation.sourceBranch ?? "",
    ].join("|");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
