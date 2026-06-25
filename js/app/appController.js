import { loadRuntimeAiSettings } from "../core/ai/aiSettingsClient.js?v=20260613c";
import { buildLuckImageReport } from "../core/blind-bazi/buildLuckImageReport.js";
import { buildMonthImageReport } from "../core/blind-bazi/buildMonthImageReport.js";
import { buildNatalImageReport } from "../core/blind-bazi/buildNatalImageReport.js";
import { buildYearImageReport } from "../core/blind-bazi/buildYearImageReport.js";
import { buildBaseBaziViewModel } from "../core/bazi/buildBaseBaziViewModel.js";
import { calculateBazi } from "../core/bazi/calculateBazi.js";
import { loadLocationCatalog } from "../core/location/locationCatalogClient.js";
import { loadMasterSummaryDatabase } from "../core/master-summary/masterSummaryEngine.js";
import { renderAiChatPanel } from "../components/aiChatPanel.js";
import { renderBaseBaziPanel } from "../components/baseBaziPanel.js";
import { renderBirthForm } from "../components/birthForm.js";
import { renderChartSummary } from "../components/chartSummary.js";
import { renderFloatingAssistPanel } from "../components/floatingAssistPanel.js";
import { queueTransitReveal, renderFortuneTransitPanel } from "../components/fortuneTransitPanel.js";
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
    store.masterSummaryDatabase = await loadMasterSummaryDatabase();
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
        targetYear:
          store.currentInput.targetYear,
        selectedMonth:
          store.currentInput.selectedMonth,
      });
      const yearImageReport = buildYearImageReport({
        chart,
        baseBaziViewModel,
        natalImageReport,
        luckImageReport,
        targetYear: store.currentInput.targetYear,
      });
      const yearImageReports = buildYearImageReportsForCurrentLuck({
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
        yearImageReports,
        monthImageReport,
        monthImageReports,
      };
      store.yearAiGenerationId += 1;
      resetGeneratedStates(store);
      renderBaseOnly();
      if (roots.status) roots.status.textContent = "基础排盘已完成。";
      aiActions.maybeGeneratePreInterpretAi();
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
      onSelectLuck:
        selectTargetLuck,
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
    renderNatalImagePanel(roots.natalImagePanel, store.state.natalImageReport, {
      chart: store.state.chart,
      baseBaziViewModel: store.state.baseBaziViewModel,
      masterSummaryDatabase: store.masterSummaryDatabase,
    });
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
      onSelectLuck:
        selectTargetLuck,
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
      selector: buildLuckStageSelector(store.state),
      evidenceContext: {
        baseBaziViewModel: store.state.baseBaziViewModel,
      },
      aiState: store.luckAiState,
      aiTitle: "AI 大运分析",
      aiButton: "生成大运 AI 分析",
      onGenerateAi: aiActions.generateLuckAiNarrative,
      onSelectStageValue: selectTargetMonthFromSelector,
    });
    renderStageAnalysisPanel(roots.yearStageAnalysis, {
      title: "流年分析",
      description: "围绕当前选中的流年展开取象与 AI 分析。",
      report: store.state.yearImageReport,
      stage: "year",
      selector: buildYearStageSelector(store.state),
      evidenceContext: {
        baseBaziViewModel: store.state.baseBaziViewModel,
        luckImageReport: store.state.luckImageReport,
      },
      aiState: store.yearAiState,
      aiTitle: "AI 流年分析",
      aiButton: "生成流年 AI 分析",
      onGenerateAi: aiActions.generateYearAiNarrative,
      onSelectStageValue: selectTargetYearFromSelector,
    });
    renderStageAnalysisPanel(roots.monthStageAnalysis, {
      title: "流月分析",
      description: "围绕当前选中的流月展开取象与 AI 分析。",
      report: store.state.monthImageReport,
      stage: "month",
      selector: buildMonthStageSelector(store.state),
      evidenceContext: {
        baseBaziViewModel: store.state.baseBaziViewModel,
        luckImageReport: store.state.luckImageReport,
        yearImageReport: store.state.yearImageReport,
      },
      aiState: store.monthAiState,
      aiTitle: "AI 流月分析",
      aiButton: "生成流月 AI 分析",
      onGenerateAi: aiActions.generateMonthAiNarrative,
      onSelectStageValue: selectTargetMonthFromSelector,
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

  function selectTargetLuckFromSelector(value) {
    const [yearValue, monthValue] = String(value ?? "").split("|");
    const year = Number(yearValue);
    const month = Number(monthValue);
    if (!Number.isFinite(year)) return;

    queueTransitReveal("luck");
    selectTargetLuck({
      year,
      month: Number.isFinite(month) ? month : 1,
    });
  }

  function selectTargetYearFromSelector(value) {
    queueTransitReveal("year");
    selectTargetYear(value);
  }

  function selectTargetMonthFromSelector(value) {
    queueTransitReveal("month");
    selectTargetMonth(value);
  }

  function selectTargetLuck({ year, month } = {}) {
    const targetYear = Number(year);
    if (!Number.isFinite(targetYear)) return;

    updateTransitSelection({
      targetYear: Math.trunc(targetYear),
      selectedMonth: normalizeSelectedMonth(month, 1),
      resetScope: "all",
    });
  }

  function selectTargetYear(year) {
    const targetYear = Number(year);
    if (!Number.isFinite(targetYear)) return;

    const previousLuck = findLuckItemForYear(
      store.state?.luckImageReport?.luckItems,
      store.currentInput?.targetYear,
    );

    const nextLuck = findLuckItemForYear(
      store.state?.luckImageReport?.luckItems,
      targetYear,
    );

    updateTransitSelection({
      targetYear: Math.trunc(targetYear),
      selectedMonth: normalizeSelectedMonth(
        store.currentInput?.selectedMonth,
        1,
      ),
      resetScope:
        previousLuck &&
        nextLuck &&
        previousLuck.index === nextLuck.index
          ? "year"
          : "all",
    });
  }

  function selectTargetMonth(month) {
    const selectedMonth = normalizeSelectedMonth(month, NaN);
    if (!Number.isFinite(selectedMonth)) return;

    updateTransitSelection({
      targetYear: Number(store.currentInput?.targetYear),
      selectedMonth,
      resetScope: "month",
    });
  }

  function updateTransitSelection({
    targetYear,
    selectedMonth,
    resetScope = "all",
  } = {}) {
    const {
      chart,
      baseBaziViewModel,
      natalImageReport,
    } = store.state ?? {};

    if (
      !chart ||
      !baseBaziViewModel ||
      !natalImageReport ||
      !Number.isFinite(Number(targetYear))
    ) {
      return;
    }

    const nextInput = {
      ...store.currentInput,
      targetYear: Math.trunc(Number(targetYear)),
      selectedMonth: normalizeSelectedMonth(
        selectedMonth,
        1,
      ),
    };

    const luckImageReport = buildLuckImageReport({
      chart,
      baseBaziViewModel,
      natalImageReport,
      targetYear: nextInput.targetYear,
      selectedMonth: nextInput.selectedMonth,
    });

    const yearImageReport = buildYearImageReport({
      chart,
      baseBaziViewModel,
      natalImageReport,
      luckImageReport,
      targetYear: nextInput.targetYear,
    });

    const yearImageReports =
      buildYearImageReportsForCurrentLuck({
        chart,
        baseBaziViewModel,
        natalImageReport,
        luckImageReport,
        targetYear: nextInput.targetYear,
      });

    const buildMonthReport = (monthValue) =>
      dedupeMonthImageReportRelations(
        buildMonthImageReport({
          chart,
          baseBaziViewModel,
          natalImageReport,
          luckImageReport,
          yearImageReport,
          targetYear: nextInput.targetYear,
          selectedMonth: monthValue,
        }),
      );

    const monthImageReport =
      buildMonthReport(nextInput.selectedMonth);

    const monthImageReports = Array.from(
      { length: 12 },
      (_, index) => buildMonthReport(index + 1),
    );

    store.currentInput = nextInput;

    store.state = {
      ...store.state,
      input: nextInput,
      luckImageReport,
      yearImageReport,
      yearImageReports,
      monthImageReport,
      monthImageReports,
    };

    resetTransitAiStates(resetScope);
    renderTransitOnly();

    if (roots.status) {
      roots.status.textContent =
        `已切换至 ${nextInput.targetYear} 年第 ${nextInput.selectedMonth} 流月。`;
    }
  }

  function renderTransitOnly() {
    renderFortuneTransitPanel(
      roots.fortuneTransitPanel,
      {
        state: store.state,
        luckAiState: store.luckAiState,
        yearAiState: store.yearAiState,
        monthAiState: store.monthAiState,

        onSelectLuck: selectTargetLuck,
        onSelectYear: selectTargetYear,
        onSelectMonth: selectTargetMonth,

        onGenerateLuckAi:
          aiActions.generateLuckAiNarrative,

        onGenerateYearAi:
          aiActions.generateYearAiNarrative,

        onGenerateMonthAi:
          aiActions.generateMonthAiNarrative,
      },
    );

    renderStageAnalysisPanel(
      roots.luckStageAnalysis,
      {
        title: "大运分析",
        description:
          "围绕当前选中的大运展开取象与 AI 分析。",
        report: store.state.luckImageReport,
        stage: "luck",
        selector:
          buildLuckStageSelector(store.state),

        evidenceContext: {
          baseBaziViewModel:
            store.state.baseBaziViewModel,
        },

        aiState: store.luckAiState,
        aiTitle: "AI 大运分析",
        aiButton: "生成大运 AI 分析",

        onGenerateAi:
          aiActions.generateLuckAiNarrative,

        onSelectStageValue:
          selectTargetLuckFromSelector,
      },
    );

    renderStageAnalysisPanel(
      roots.yearStageAnalysis,
      {
        title: "流年分析",
        description:
          "围绕当前选中的流年展开取象与 AI 分析。",
        report: store.state.yearImageReport,
        stage: "year",
        selector:
          buildYearStageSelector(store.state),

        evidenceContext: {
          baseBaziViewModel:
            store.state.baseBaziViewModel,

          luckImageReport:
            store.state.luckImageReport,
        },

        aiState: store.yearAiState,
        aiTitle: "AI 流年分析",
        aiButton: "生成流年 AI 分析",

        onGenerateAi:
          aiActions.generateYearAiNarrative,

        onSelectStageValue:
          selectTargetYearFromSelector,
      },
    );

    renderStageAnalysisPanel(
      roots.monthStageAnalysis,
      {
        title: "流月分析",
        description:
          "围绕当前选中的流月展开取象与 AI 分析。",
        report: store.state.monthImageReport,
        stage: "month",
        selector:
          buildMonthStageSelector(store.state),

        evidenceContext: {
          baseBaziViewModel:
            store.state.baseBaziViewModel,

          luckImageReport:
            store.state.luckImageReport,

          yearImageReport:
            store.state.yearImageReport,
        },

        aiState: store.monthAiState,
        aiTitle: "AI 流月分析",
        aiButton: "生成流月 AI 分析",

        onGenerateAi:
          aiActions.generateMonthAiNarrative,

        onSelectStageValue:
          selectTargetMonthFromSelector,
      },
    );

    renderFloatingAssistPanel(
      roots.floatingAssist,
      {
        state: store.state,
      },
    );

    bindShenshaPopupEvents();
  }

  function resetTransitAiStates(scope = "all") {
    const emptyState = () => ({
      loading: false,
      text: "",
      error: "",
    });

    store.yearAiGenerationId += 1;

    if (scope === "all") {
      store.luckAiState = emptyState();
    }

    if (
      scope === "all" ||
      scope === "year"
    ) {
      store.yearAiState = emptyState();
    }

    store.monthAiState = emptyState();
  }

  function normalizeSelectedMonth(
    value,
    fallback = 1,
  ) {
    const month = Number(value);

    if (!Number.isFinite(month)) {
      return fallback;
    }

    return Math.min(
      12,
      Math.max(
        1,
        Math.trunc(month),
      ),
    );
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
    selectTargetLuck,
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

function findLuckItemForYear(
  luckItems = [],
  targetYear,
) {
  const year = Number(targetYear);

  if (!Number.isFinite(year)) {
    return null;
  }

  return (
    (
      Array.isArray(luckItems)
        ? luckItems
        : []
    ).find((item) => {
      const [
        startYear,
        endYear,
      ] = parseYearRange(
        item?.yearRange,
      );

      return (
        Number.isFinite(startYear) &&
        Number.isFinite(endYear) &&
        year >= startYear &&
        year <= endYear
      );
    }) ?? null
  );
}

function encodeLuckSelectorValue(item = {}) {
  const year = Number(item.selectionYear);
  const month = Number(item.selectionMonth);

  if (Number.isFinite(year)) {
    return `${Math.trunc(year)}|${
      Number.isFinite(month)
        ? Math.min(12, Math.max(1, Math.trunc(month)))
        : 1
    }`;
  }

  const fallbackYear = firstYearOfRange(item.yearRange);
  return fallbackYear === ""
    ? ""
    : `${fallbackYear}|1`;
}

function buildLuckStageSelector(state = {}) {
  const luckItems = Array.isArray(
    state.luckImageReport?.luckItems,
  )
    ? state.luckImageReport.luckItems
    : [];

  const currentLuck =
    luckItems.find((item) => item?.isCurrent) ??
    findLuckItemForYear(
      luckItems,
      state.input?.targetYear,
    ) ??
    luckItems[0] ??
    {};

  return {
    label: "切换大运",
    value: encodeLuckSelectorValue(currentLuck),
    options: luckItems
      .map((item) => ({
        value: encodeLuckSelectorValue(item),
        label:
          [item.ageRange, item.ganZhi]
            .filter(Boolean)
            .join(" · ") ||
          item.yearRange ||
          "待查",
      }))
      .filter((option) => option.value !== ""),
  };
}

function buildYearStageSelector(state = {}) {
  const yearReports = Array.isArray(state.yearImageReports) ? state.yearImageReports : [];
  const currentYear = state.yearImageReport?.yearItem?.year ?? state.input?.targetYear ?? "";
  return {
    label: "切换流年",
    value: currentYear,
    options: yearReports
      .map((report) => report.yearItem ?? {})
      .filter((item) => item.year)
      .map((item) => ({
        value: item.year,
        label: [item.year, item.ganZhi].filter(Boolean).join(" · ") || String(item.year),
      })),
  };
}

function buildMonthStageSelector(state = {}) {
  const monthReports = Array.isArray(state.monthImageReports) ? state.monthImageReports : [];
  const currentMonth = state.monthImageReport?.monthItem?.month ?? state.input?.selectedMonth ?? "";
  return {
    label: "切换流月",
    value: currentMonth,
    options: monthReports
      .map((report) => report.monthItem ?? {})
      .filter((item) => item.month)
      .map((item) => ({
        value: item.month,
        label:
          [
            item.dateRangeLabel ||
            (
              item.branch
                ? `${item.branch}月`
                : ""
            ),

            item.ganZhi,
          ]
            .filter(Boolean)
            .join(" · ") ||
          "待查",
      })),
  };
}

function buildYearImageReportsForCurrentLuck({
  chart,
  baseBaziViewModel,
  natalImageReport,
  luckImageReport,
  targetYear,
} = {}) {
  const luckItems =
    Array.isArray(
      luckImageReport?.luckItems,
    )
      ? luckImageReport.luckItems
      : [];

  const currentLuck =
    luckItems.find(
      (item) =>
        item?.isCurrent,
    ) ??
    findLuckItemForYear(
      luckItems,
      targetYear,
    ) ??
    luckItems[0];

  const [
    startYear,
    endYear,
  ] = parseYearRange(
    currentLuck?.yearRange,
  );

  if (
    !Number.isFinite(startYear) ||
    !Number.isFinite(endYear)
  ) {
    return [];
  }

  return Array.from(
    {
      length:
        Math.max(
          1,
          endYear - startYear + 1,
        ),
    },

    (_, index) => {
      const year =
        startYear + index;

      return buildYearImageReport({
        chart,
        baseBaziViewModel,
        natalImageReport,
        luckImageReport,
        targetYear: year,
      });
    },
  );
}

function firstYearOfRange(range = "") {
  const [start] = parseYearRange(range);
  return Number.isFinite(start) ? start : "";
}

function parseYearRange(range = "") {
  const [start, end] = String(range).match(/\d{3,4}/g)?.map(Number) ?? [];
  return [start, end];
}

