import { loadRuntimeAiSettings, readAiSettings, saveAiSettings } from "./core/ai/aiSettingsClient.js?v=20260613c";
import { buildChatPrompt } from "./core/ai/buildChatPrompt.js";
import { buildLuckAiPrompt } from "./core/ai/buildLuckAiPrompt.js";
import { buildMonthAiPrompt } from "./core/ai/buildMonthAiPrompt.js";
import { buildNatalAiPrompt } from "./core/ai/buildNatalAiPrompt.js";
import { buildYearAiPrompt } from "./core/ai/buildYearAiPrompt.js";
import { generateWithDeepSeek } from "./core/ai/deepseekClient.js?v=20260613b";
import { buildLuckImageReport } from "./core/blind-bazi/buildLuckImageReport.js";
import { buildMonthImageReport } from "./core/blind-bazi/buildMonthImageReport.js";
import { buildNatalImageReport } from "./core/blind-bazi/buildNatalImageReport.js";
import { buildYearImageReport } from "./core/blind-bazi/buildYearImageReport.js";
import { buildBaseBaziViewModel } from "./core/bazi/buildBaseBaziViewModel.js";
import { calculateBazi } from "./core/bazi/calculateBazi.js";
import { renderAiSettingsPanel } from "./components/aiSettingsPanel.js?v=20260613c";
import { renderAiChatPanel } from "./components/aiChatPanel.js";
import { renderBaseBaziPanel } from "./components/baseBaziPanel.js";
import { renderBirthForm } from "./components/birthForm.js";
import { renderDebugPanel } from "./components/debugPanel.js";
import { renderFortuneTransitPanel } from "./components/fortuneTransitPanel.js";
import { renderLuckAiNarrativePanel } from "./components/luckAiNarrativePanel.js";
import { renderLuckImagePanel } from "./components/luckImagePanel.js";
import { renderMonthAiNarrativePanel } from "./components/monthAiNarrativePanel.js";
import { renderMonthImagePanel } from "./components/monthImagePanel.js";
import { renderNatalAiNarrativePanel } from "./components/natalAiNarrativePanel.js";
import { renderNatalImagePanel } from "./components/natalImagePanel.js";
import { renderYearAiNarrativePanel } from "./components/yearAiNarrativePanel.js";
import { renderYearImagePanel } from "./components/yearImagePanel.js";

const roots = {
  birthForm: document.querySelector("#birthForm"),
  chartSummary: document.querySelector("#chartSummary"),
  baseBaziPanel: document.querySelector("#baseBaziPanel"),
  natalImagePanel: document.querySelector("#natalImagePanel"),
  natalAiNarrative: document.querySelector("#natalAiNarrative"),
  luckImagePanel: document.querySelector("#luckImagePanel"),
  luckAiNarrative: document.querySelector("#luckAiNarrative"),
  yearImagePanel: document.querySelector("#yearImagePanel"),
  yearAiNarrative: document.querySelector("#yearAiNarrative"),
  monthImagePanel: document.querySelector("#monthImagePanel"),
  monthAiNarrative: document.querySelector("#monthAiNarrative"),
  fortuneTransitPanel: document.querySelector("#fortuneTransitPanel"),
  aiChatPanel: document.querySelector("#aiChatPanel"),
  aiChatToggle: document.querySelector("#aiChatToggle"),
  aiChatDrawer: document.querySelector("#aiChatDrawer"),
  aiChatClose: document.querySelector("#aiChatClose"),
  status: document.querySelector("#status"),
};

const elementLabels = { wood: "木", fire: "火", earth: "土", metal: "金", water: "水" };
const stemElements = {
  甲: "wood", 乙: "wood",
  丙: "fire", 丁: "fire",
  戊: "earth", 己: "earth",
  庚: "metal", 辛: "metal",
  壬: "water", 癸: "water",
};
const branchElements = {
  寅: "wood", 卯: "wood",
  巳: "fire", 午: "fire",
  辰: "earth", 戌: "earth", 丑: "earth", 未: "earth",
  申: "metal", 酉: "metal",
  亥: "water", 子: "water",
};

let activeFortuneTab = "luck";
let aiChatOpen = false;
let state = null;
let aiSettingsState = {
  settings: readAiSettings(),
  status: "正在读取 config/ai-config.json。",
};
let natalAiState = {
  loading: false,
  text: "",
  error: "",
};
let luckAiState = {
  loading: false,
  text: "",
  error: "",
};
let yearAiState = {
  loading: false,
  text: "",
  error: "",
};
let yearAiGenerationId = 0;
let monthAiState = {
  loading: false,
  text: "",
  error: "",
};
let chatState = {
  question: "",
  loading: false,
  error: "",
  messages: [],
};
let currentInput = {
  name: "测试用户",
  birthDate: "1949-10-01",
  birthTime: "00:00",
  birthplace: "北京",
  gender: "male",
  targetYear: 2026,
  selectedMonth: 1,
  trueSolarTime: false,
  preInterpretAi: false,
};

init();

async function init() {
  await loadRuntimeAiSettings();
  const settings = readAiSettings();
  aiSettingsState = {
    settings,
    status: settings.deepseek?.hasApiKey
      ? "已读取 config/ai-config.json 中的 DeepSeek Key。"
      : "未检测到 config/ai-config.json 中的 DeepSeek Key。",
  };

  renderBirthForm(roots.birthForm, {
    initialValue: currentInput,
    onSubmit(payload) {
      currentInput = { ...currentInput, ...payload };
      refresh();
    },
  });

  bindFortuneTabs();
  bindAiChatDrawer();
  renderShell();
  refresh();
}

function refresh() {
  roots.status.textContent = "正在前端排盘...";
  try {
    const chart = calculateBazi(currentInput);
    const baseBaziViewModel = buildBaseBaziViewModel(chart);
    const natalImageReport = buildNatalImageReport({ chart, baseBaziViewModel });
    const luckImageReport = buildLuckImageReport({
      chart,
      baseBaziViewModel,
      natalImageReport,
      targetYear: currentInput.targetYear,
    });
    const yearImageReport = buildYearImageReport({
      chart,
      baseBaziViewModel,
      natalImageReport,
      luckImageReport,
      targetYear: currentInput.targetYear,
    });
    const monthImageReport = dedupeMonthImageReportRelations(buildMonthImageReport({
      chart,
      baseBaziViewModel,
      natalImageReport,
      luckImageReport,
      yearImageReport,
      targetYear: currentInput.targetYear,
      selectedMonth: currentInput.selectedMonth,
    }));
    const monthImageReports = Array.from({ length: 12 }, (_, index) => dedupeMonthImageReportRelations(buildMonthImageReport({
      chart,
      baseBaziViewModel,
      natalImageReport,
      luckImageReport,
      yearImageReport,
      targetYear: currentInput.targetYear,
      selectedMonth: index + 1,
    })));
    state = {
      input: currentInput,
      chart,
      baseBaziViewModel,
      natalImageReport,
      luckImageReport,
      yearImageReport,
      monthImageReport,
      monthImageReports,
    };
    yearAiGenerationId += 1;
    natalAiState = { loading: false, text: "", error: "" };
    luckAiState = { loading: false, text: "", error: "" };
    yearAiState = { loading: false, text: "", error: "" };
    monthAiState = { loading: false, text: "", error: "" };
    chatState = { question: "", loading: false, error: "", messages: [] };
    renderBaseOnly();
    roots.status.textContent = "基础排盘已完成。";
    maybeGeneratePreInterpretYearAi();
  } catch (error) {
    state = { input: currentInput, error: error.message };
    renderBaseError(error);
    roots.status.textContent = `基础排盘失败：${error.message}`;
  }
}


function renderShell() {
  renderChartSummary(roots.chartSummary, null);
  renderBaseBaziPanel(roots.baseBaziPanel, null);
  renderNatalImagePanel(roots.natalImagePanel, null);
  renderNatalAiNarrativePanel(roots.natalAiNarrative, {
    state: natalAiState,
    hasReport: false,
    onGenerate: generateNatalAiNarrative,
  });
  renderLuckImagePanel(roots.luckImagePanel, null);
  renderLuckAiNarrativePanel(roots.luckAiNarrative, {
    state: luckAiState,
    hasReport: false,
    onGenerate: generateLuckAiNarrative,
  });
  renderYearImagePanel(roots.yearImagePanel, null);
  renderYearAiNarrativePanel(roots.yearAiNarrative, {
    state: yearAiState,
    hasReport: false,
    onGenerate: generateYearAiNarrative,
  });
  renderMonthImagePanel(roots.monthImagePanel, null);
  renderMonthAiNarrativePanel(roots.monthAiNarrative, {
    state: monthAiState,
    hasReport: false,
    onGenerate: generateMonthAiNarrative,
  });
  renderFortuneTransitPanel(roots.fortuneTransitPanel, {
    state,
    luckAiState,
    yearAiState,
    monthAiState,
    onSelectLuckYear: selectTargetYear,
    onSelectYear: selectTargetYear,
    onSelectMonth: selectTargetMonth,
    onGenerateLuckAi: generateLuckAiNarrative,
    onGenerateYearAi: generateYearAiNarrative,
    onGenerateMonthAi: generateMonthAiNarrative,
  });
  renderAiChatPanel(roots.aiChatPanel, {
    state: chatState,
    hasReport: false,
    onAsk: askAiQuestion,
  });
}

function renderBaseOnly() {
  renderChartSummary(roots.chartSummary, state);
  renderBaseBaziPanel(roots.baseBaziPanel, state.baseBaziViewModel);
  renderNatalImagePanel(roots.natalImagePanel, state.natalImageReport);
  renderNatalAiNarrativePanel(roots.natalAiNarrative, {
    state: natalAiState,
    hasReport: Boolean(state.natalImageReport),
    onGenerate: generateNatalAiNarrative,
  });
  renderLuckImagePanel(roots.luckImagePanel, state.luckImageReport);

  renderYearImagePanel(roots.yearImagePanel, state.yearImageReport);

  renderMonthImagePanel(roots.monthImagePanel, state.monthImageReport);
  renderMonthAiNarrativePanel(roots.monthAiNarrative, {
    state: monthAiState,
    hasReport: Boolean(state.monthImageReport?.monthItem),
    onGenerate: generateMonthAiNarrative,
  });
  renderFortuneTransitPanel(roots.fortuneTransitPanel, {
    state,
    luckAiState,
    yearAiState,
    monthAiState,
    onSelectLuckYear: selectTargetYear,
    onSelectYear: selectTargetYear,
    onSelectMonth: selectTargetMonth,
    onGenerateLuckAi: generateLuckAiNarrative,
    onGenerateYearAi: generateYearAiNarrative,
    onGenerateMonthAi: generateMonthAiNarrative,
  });
  renderAiChatPanel(roots.aiChatPanel, {
    state: chatState,
    hasReport: Boolean(state.natalImageReport),
    onAsk: askAiQuestion,
  });
  setAiChatOpen(aiChatOpen);
  bindShenshaPopupEvents();
}

async function generateNatalAiNarrative() {
  natalAiState = { loading: true, text: "", error: "" };
  renderBaseOnly();
  try {
    const settings = readAiSettings({ includeSecret: true });
    const prompt = buildNatalAiPrompt({
      baseBaziViewModel: state.baseBaziViewModel,
      natalImageReport: state.natalImageReport,
    });
    const result = await generateWithDeepSeek({ settings, prompt });
    natalAiState = { loading: false, text: result.text, error: "" };
  } catch (error) {
    natalAiState = { loading: false, text: "", error: error.message };
  }
  renderBaseOnly();
}

async function generateLuckAiNarrative() {
  luckAiState = { loading: true, text: "", error: "" };
  renderBaseOnly();
  try {
    const settings = readAiSettings({ includeSecret: true });
    const prompt = buildLuckAiPrompt({
      baseBaziViewModel: state.baseBaziViewModel,
      natalImageReport: state.natalImageReport,
      luckImageReport: state.luckImageReport,
    });
    const result = await generateWithDeepSeek({ settings, prompt });
    luckAiState = { loading: false, text: result.text, error: "" };
  } catch (error) {
    luckAiState = { loading: false, text: "", error: error.message };
  }
  renderBaseOnly();
}

async function generateYearAiNarrative() {
  const generationId = ++yearAiGenerationId;
  const targetYear = state?.yearImageReport?.yearItem?.year;
  yearAiState = { loading: true, text: "", error: "" };
  renderBaseOnly();
  try {
    const settings = readAiSettings({ includeSecret: true });
    const prompt = buildYearAiPrompt({
      baseBaziViewModel: state.baseBaziViewModel,
      natalImageReport: state.natalImageReport,
      luckImageReport: state.luckImageReport,
      yearImageReport: state.yearImageReport,
    });
    const result = await generateWithDeepSeek({ settings, prompt });
    if (generationId !== yearAiGenerationId || targetYear !== state?.yearImageReport?.yearItem?.year) return;
    yearAiState = { loading: false, text: result.text, error: "" };
  } catch (error) {
    if (generationId !== yearAiGenerationId || targetYear !== state?.yearImageReport?.yearItem?.year) return;
    yearAiState = { loading: false, text: "", error: error.message };
  }
  renderBaseOnly();
}

function maybeGeneratePreInterpretYearAi() {
  if (!currentInput.preInterpretAi || !state?.yearImageReport?.yearItem) return;
  const scheduledState = state;
  queueMicrotask(() => {
    if (state !== scheduledState || !currentInput.preInterpretAi) return;
    generateYearAiNarrative();
  });
}

async function generateMonthAiNarrative() {
  monthAiState = { loading: true, text: "", error: "" };
  renderBaseOnly();
  try {
    const settings = readAiSettings({ includeSecret: true });
    const prompt = buildMonthAiPrompt({
      baseBaziViewModel: state.baseBaziViewModel,
      natalImageReport: state.natalImageReport,
      luckImageReport: state.luckImageReport,
      yearImageReport: state.yearImageReport,
      monthImageReport: state.monthImageReport,
    });
    const result = await generateWithDeepSeek({ settings, prompt });
    monthAiState = { loading: false, text: result.text, error: "" };
  } catch (error) {
    monthAiState = { loading: false, text: "", error: error.message };
  }
  renderBaseOnly();
}

async function askAiQuestion(question) {
  const trimmedQuestion = String(question ?? "").trim();
  if (!trimmedQuestion) return;
  chatState = { ...chatState, question: trimmedQuestion, loading: true, error: "" };
  renderBaseOnly();
  try {
    const settings = readAiSettings({ includeSecret: true });
    const chatIntent = detectChatIntent(trimmedQuestion);
    const requestedYears = extractYearsFromQuestion(trimmedQuestion, currentInput.targetYear);
    const requestedYearReports = buildRequestedYearReports(requestedYears);

    const prompt = buildChatPrompt({
      question: trimmedQuestion,
      input: state.input,
      chart: state.chart,
      baseBaziViewModel: state.baseBaziViewModel,
      natalImageReport: state.natalImageReport,
      luckImageReport: state.luckImageReport,
      yearImageReport: state.yearImageReport,
      monthImageReport: state.monthImageReport,
      monthImageReports: state.monthImageReports,
      chatIntent,
      requestedYears,
      requestedYearReports,
    });
    const result = await generateWithDeepSeek({ settings, prompt });
    chatState = {
      question: "",
      loading: false,
      error: "",
      messages: [...chatState.messages, { question: trimmedQuestion, answer: result.text }].slice(-3),
    };
  } catch (error) {
    chatState = { ...chatState, loading: false, error: error.message };
  }
  renderBaseOnly();
}

function detectChatIntent(question = "") {
  const text = String(question);

  if (/20\d{2}.*20\d{2}|未来.{0,3}(三|四|五|六|七|八|九|十|\d+)年|几年|多年/.test(text)) {
    return "multiYear";
  }

  if (/流年|今年|明年|后年|年份|哪一年|20\d{2}/.test(text)) {
    return "yearTrend";
  }

  if (/流月|月份|这个月|下个月|几月|哪月/.test(text)) {
    return "monthTrend";
  }

  if (/感情|婚姻|对象|正缘|桃花|恋爱|分手|复合|配偶/.test(text)) {
    return "relationship";
  }

  if (/事业|工作|职业|行业|上班|创业|项目|学业|学习|考试/.test(text)) {
    return "career";
  }

  if (/财|钱|收入|赚钱|投资|资产|负债/.test(text)) {
    return "wealth";
  }

  if (/健康|身体|疾病|体质|睡眠|焦虑|压力/.test(text)) {
    return "health";
  }

  if (/为什么|依据|证据|怎么看出来|哪里看/.test(text)) {
    return "chartEvidence";
  }

  return "free";
}
function extractYearsFromQuestion(question = "", baseYear = new Date().getFullYear()) {
  const text = String(question);
  const years = new Set();
  const currentYear = Number(baseYear) || new Date().getFullYear();

  const rangeMatch = text.match(/((?:19|20)\d{2})\s*(?:到|至|-|—|~)\s*((?:19|20)\d{2})/);
  if (rangeMatch) {
    const start = Number(rangeMatch[1]);
    const end = Number(rangeMatch[2]);
    const min = Math.min(start, end);
    const max = Math.max(start, end);

    for (let year = min; year <= max && years.size < 10; year += 1) {
      years.add(year);
    }
  }

  for (const match of text.matchAll(/(?:19|20)\d{2}/g)) {
    years.add(Number(match[0]));
  }

  const futureMatch = text.match(/未来\s*(\d+|三|四|五|六|七|八|九|十)\s*年/);
  if (futureMatch) {
    const count = chineseNumberToInt(futureMatch[1]) || 3;
    for (let i = 0; i < count && i < 10; i += 1) {
      years.add(currentYear + i);
    }
  }

  if (/明年/.test(text)) years.add(currentYear + 1);
  if (/后年/.test(text)) years.add(currentYear + 2);
  if (/今年|当前年份|目标年份/.test(text)) years.add(currentYear);

  return Array.from(years)
    .filter((year) => Number.isFinite(year) && year >= 1900 && year <= 2100)
    .sort((a, b) => a - b)
    .slice(0, 10);
}

function chineseNumberToInt(value) {
  const map = {
    三: 3,
    四: 4,
    五: 5,
    六: 6,
    七: 7,
    八: 8,
    九: 9,
    十: 10,
  };

  if (/^\d+$/.test(String(value))) return Number(value);
  return map[value] ?? null;
}
function renderBaseError(error) {
  if (roots.chartSummary) {
    roots.chartSummary.innerHTML = `
      <div class="plugin-header">
        <p class="eyebrow">基础排盘</p>
        <h2>基础排盘</h2>
      </div>
      <p class="muted">基础排盘失败：${escapeHtml(error.message)}</p>
    `;
  }
  renderBaseBaziPanel(roots.baseBaziPanel, null);
  renderPlaceholderPanel(roots.natalImagePanel, "原局取象");
  renderPlaceholderPanel(roots.natalAiNarrative, "原局 AI 分析", "AI 解读待接入。当前系统先保证纯前端排盘与取象。");
  renderPlaceholderPanel(roots.luckImagePanel, "大运取象");
  renderPlaceholderPanel(roots.luckAiNarrative, "大运 AI 分析", "AI 解读待接入。当前系统先保证纯前端排盘与取象。");
  renderPlaceholderPanel(roots.yearImagePanel, "流年取象");
  renderPlaceholderPanel(roots.yearAiNarrative, "流年 AI 分析", "AI 解读待接入。当前系统先保证纯前端排盘与取象。");
  renderPlaceholderPanel(roots.monthImagePanel, "流月取象");
  renderPlaceholderPanel(roots.monthAiNarrative, "流月 AI 分析", "AI 解读待接入。当前系统先保证纯前端排盘与取象。");
  renderFortuneTransitPanel(roots.fortuneTransitPanel, { state });
  renderPlaceholderPanel(roots.aiChatPanel, "AI 问答", "AI 问答待接入。当前系统先保证纯前端排盘与取象。");
}

function selectTargetYear(year) {
  const targetYear = Number(year);
  if (!Number.isFinite(targetYear)) return;
  currentInput = { ...currentInput, targetYear };
  refresh();
}

function selectTargetMonth(month) {
  const selectedMonth = Math.min(12, Math.max(1, Math.trunc(Number(month))));
  if (!Number.isFinite(selectedMonth)) return;
  currentInput = { ...currentInput, selectedMonth };
  refresh();
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

function bindFortuneTabs() {
  document.querySelectorAll("[data-fortune-tab]").forEach((button) => {
    button.addEventListener("click", () => setActiveFortuneTab(button.dataset.fortuneTab));
  });
  setActiveFortuneTab(activeFortuneTab);
}

function setActiveFortuneTab(tabId = "luck") {
  activeFortuneTab = tabId === "year" ? "year" : "luck";
  document.querySelectorAll("[data-fortune-tab]").forEach((button) => {
    const active = button.dataset.fortuneTab === activeFortuneTab;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", active ? "true" : "false");
  });
  document.querySelectorAll("[data-fortune-panel]").forEach((panel) => {
    const active = panel.dataset.fortunePanel === activeFortuneTab;
    panel.classList.toggle("is-active", active);
    panel.hidden = !active;
  });
}

function bindAiChatDrawer() {
  roots.aiChatToggle?.addEventListener("click", () => setAiChatOpen(true));
  roots.aiChatClose?.addEventListener("click", () => setAiChatOpen(false));
  setAiChatOpen(aiChatOpen);
}

function setAiChatOpen(open) {
  aiChatOpen = Boolean(open);
  if (roots.aiChatDrawer) roots.aiChatDrawer.hidden = !aiChatOpen;
  roots.aiChatToggle?.setAttribute("aria-expanded", aiChatOpen ? "true" : "false");
}

function renderChartSummary(root, currentState) {
  if (!root) return;
  if (!currentState?.baseBaziViewModel) {
    root.innerHTML = `
      <div class="plugin-header">
        <p class="eyebrow">核心命盘</p>
        <h2>基础排盘展示</h2>
      </div>
      <p class="muted">等待基础排盘。</p>
    `;
    return;
  }

  const viewModel = currentState.baseBaziViewModel;
  const currentLuck = currentState.luckImageReport?.luckItems?.find((item) => item.isCurrent)
    ?? currentState.luckImageReport?.luckItems?.[0];

  root.innerHTML = `
    <div class="plugin-header chart-display-header">
      <p class="eyebrow">核心命盘</p>
      <h2>基础排盘展示</h2>
    </div>
    ${renderChartTopline(viewModel, currentState.chart)}
    ${renderBaziMatrix(viewModel.pillars, currentState.chart)}
    <details class="relation-overview">
      ${(() => {
        const unique = uniqueBaseRelations(viewModel.relations);
        return `<summary><span>干支关系 <b>${escapeHtml(String(unique.length))} 条</b></span><i class="relation-toggle-hint"><em class="is-closed">展开</em><em class="is-open">收起</em></i></summary>
      ${renderRelationList(unique)}`;
      })()}
    </details>
    ${renderAuxiliaryObservation(currentState, currentLuck)}
  `;
  bindCoreTabs(root);
}

function renderChartTopline(viewModel = {}, chart = {}) {
  const dayPillar = viewModel.pillars?.find((item) => item.key === "day") ?? {};
  const monthPillar = viewModel.pillars?.find((item) => item.key === "month") ?? {};
  const dayElement = chart.pillars?.day?.stemElement ?? stemElements[dayPillar.stem];
  const monthElement = chart.pillars?.month?.branchElement ?? branchElements[monthPillar.branch];
  const visibleCounts = viewModel.fiveElements?.visible?.counts ?? {};
  return `
    <div class="chart-topline">
      <article class="chart-topline-item chart-topline-primary"><span>日主</span><strong>${escapeHtml(dayPillar.stem || dayMaster(viewModel) || "待查")}${escapeHtml(elementLabels[dayElement] ?? "")}</strong></article>
      <article class="chart-topline-item"><span>月令</span><strong>${escapeHtml(monthPillar.branch || "待查")}${escapeHtml(elementLabels[monthElement] ?? "")}</strong></article>
      <article class="chart-topline-item element-mini"><span>五行</span>${renderElementBars(visibleCounts)}</article>
    </div>
  `;
}

function renderBirthInfoStrip(currentState = {}) {
  const chart = currentState.chart ?? {};
  const viewModel = currentState.baseBaziViewModel ?? {};
  const calendar = chart.calendar ?? {};
  const trueSolar = calendar.trueSolarTime ?? {};
  const location = trueSolar.location ?? {};
  const input = chart.input ?? currentState.input ?? {};
  const solarTermPillars = viewModel.pillars?.map((item) => `${item.name}${item.pillar}`).join("、");
  const optionalNonTerm = chart.nonSolarTermPillars ?? chart.calendarPillars ?? chart.meta?.nonSolarTermPillars;
  const facts = [
    ["姓名", viewModel.birthInfo?.name],
    ["性别", genderLabel(input.gender ?? viewModel.birthInfo?.gender)],
    ["出生地", input.birthplace ?? viewModel.birthInfo?.birthplace],
    ["公历时间", joinParts([calendar.solarDate ?? input.birthDate, calendar.time ?? input.birthTime])],
    ["农历时间", calendar.lunarDate ?? viewModel.birthInfo?.lunarDate],
    ["真太阳时", joinParts([calendar.solarDate, calendar.time])],
    ["是否使用真太阳时", trueSolar.enabled ? "是" : "否"],
    ["节气四柱", solarTermPillars],
    ["非节气四柱", formatMaybePillars(optionalNonTerm)],
    ["经度/纬度", formatLocation(location)],
    ["节气范围", calendar.solarTermRange],
  ].filter(([, value]) => hasValue(value));

  return `
    <div class="birth-info-strip">
      ${facts.map(([label, value]) => `<article><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></article>`).join("")}
    </div>
  `;
}

function renderBaziMatrix(pillars = [], chart = {}) {
  return `
    <div class="bazi-matrix chart-summary-matrix">
      <div class="matrix-row matrix-head"><span></span>${pillars.map((item) => `<b>${escapeHtml(item.name)}</b>`).join("")}</div>
      <div class="matrix-row ten-god-row"><span>天干十神</span>${pillars.map((item) => `<em>${escapeHtml(item.stemTenGod || "待查")}</em>`).join("")}</div>
      <div class="matrix-row main-symbol-row">
        <span>天干</span>
        ${pillars.map((item) => {
          const raw = chart.pillars?.[item.key] ?? {};
          return renderSymbol(item.stem, raw.stemElement ?? stemElements[item.stem], raw.yinYang, item.key === "day");
        }).join("")}
      </div>
      <div class="matrix-row main-symbol-row">
        <span>地支</span>
        ${pillars.map((item) => {
          const raw = chart.pillars?.[item.key] ?? {};
          return renderSymbol(item.branch, raw.branchElement ?? branchElements[item.branch]);
        }).join("")}
      </div>
      <div class="matrix-row ten-god-row"><span>地支主气十神</span>${pillars.map((item) => `<em>${escapeHtml(item.branchMainTenGod || "待查")}</em>`).join("")}</div>
      <div class="matrix-row hidden-row">
        <span>完整藏干</span>
        ${pillars.map((item) => `<small>${renderHiddenStemChips(item.hiddenStems)}</small>`).join("")}
      </div>
      <div class="matrix-row shensha-row"><span>神煞</span>${pillars.map((item) => renderPillarShensha(item.shensha)).join("")}</div>
    </div>
  `;
}

function renderSymbol(symbol, element, yinYang, isDayMaster = false) {
  const elementText = `${escapeHtml(yinYangLabel(yinYang))}${escapeHtml(elementLabels[element] ?? "五行")}`;
  return `
    <b class="bazi-symbol element-${escapeHtml(element || "earth")}${isDayMaster ? " is-day-master" : ""}">
      <strong>${escapeHtml(symbol || "待")}</strong>
      <small>${elementText}</small>
    </b>
  `;
}

function renderHiddenStemChips(stems = []) {
  return stems.length
    ? `<span class="hidden-chip-list">${stems.map((item) => `
      <span class="hidden-chip element-${escapeHtml(item.element || "earth")}">
        <b>${escapeHtml(item.stem)}</b>
        <em>${escapeHtml(item.tenGod)}</em>
        <small>${escapeHtml(item.role)}<br>${escapeHtml(item.elementLabel ?? elementLabels[item.element] ?? item.element ?? "五行待查")}</small>
      </span>
    `).join("")}</span>`
    : "未列";
}

function renderPillarShensha(items = []) {
  const visibleItems = (items ?? []).slice(0, 4);
  const more = items.length > visibleItems.length ? `<em>+${escapeHtml(items.length - visibleItems.length)}</em>` : "";
  return `
    <small class="pillar-shensha">
      ${visibleItems.length ? visibleItems.map((item) => `<i>${escapeHtml(item.name)}</i>`).join("") + more : "<i>未列</i>"}
    </small>
  `;
}

function renderAuxiliaryObservation(currentState = {}, currentLuck = {}) {
  return `
    <details class="auxiliary-observation">
      <summary class="auxiliary-summary">
        <span>
          <b>辅助观察项</b>
          <small>神煞、纳音、长生、旬空、五行、专家明细与历法依据</small>
        </span>
        <em>展开</em>
      </summary>
      ${renderAuxiliaryTabs(currentState, currentLuck)}
    </details>
  `;
}

function renderAuxiliaryTabs(currentState = {}, currentLuck = {}) {
  const viewModel = currentState.baseBaziViewModel ?? {};
  const tabs = [
    ["shensha", "神煞总表", renderShenshaAuxiliary(viewModel)],
    ["nayin", "纳音长生", `<p class="fine-print">排盘细节：纳音、空亡、十二长生、胎元命宫</p>${renderChartDetails(viewModel)}`],
    ["voids", "空亡旬空", renderVoidAuxiliary(viewModel)],
    ["elements", "五行详表", renderElementStatsFull(viewModel.pillars, viewModel.fiveElements)],
    ["expert", "专家明细", `${renderTenGodStatsFull(viewModel.pillars, viewModel.tenGods)}${renderCurrentContext(currentState, currentLuck)}<p class="fine-print">大运表：天干十神、地支主气十神</p>${renderLuckSummaryTable(viewModel.luckCycles, currentLuck, currentState.luckImageReport, currentState.chart)}`],
    ["calendar", "历法依据", renderBirthInfoStrip(currentState)],
  ];
  return `
    <section class="core-tabs">
      <div class="core-tab-list" role="tablist" aria-label="辅助观察项">
        ${tabs.map(([id, label], index) => `
          <button type="button" class="core-tab${index === 0 ? " is-active" : ""}" data-core-tab="${escapeHtml(id)}" aria-selected="${index === 0 ? "true" : "false"}">${escapeHtml(label)}</button>
        `).join("")}
      </div>
      ${tabs.map(([id, , html], index) => `
        <div class="core-tab-panel${index === 0 ? " is-active" : ""}" data-core-panel="${escapeHtml(id)}" ${index === 0 ? "" : "hidden"}>${html}</div>
      `).join("")}
    </section>
  `;
}

function bindCoreTabs(root) {
  root.querySelectorAll("[data-core-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      const tabId = button.dataset.coreTab;
      root.querySelectorAll("[data-core-tab]").forEach((item) => {
        const active = item.dataset.coreTab === tabId;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-selected", active ? "true" : "false");
      });
      root.querySelectorAll("[data-core-panel]").forEach((panel) => {
        const active = panel.dataset.corePanel === tabId;
        panel.classList.toggle("is-active", active);
        panel.hidden = !active;
      });
    });
  });
}

function renderShenshaAuxiliary(viewModel = {}) {
  const pillars = viewModel.pillars ?? [];
  const allItems = pillars.flatMap((pillar) =>
    (pillar.shensha ?? []).map((item) => ({
      ...item,
      pillarName: pillar.name,
      pillarText: pillar.pillar,
      pillarBranch: pillar.branch,
    }))
  );

  if (!allItems.length) {
    return `<p class="fine-print">当前内置常用实务神煞规则未命中。神煞只作为辅助观察点，不单独作为结论。</p>`;
  }

  return `
    <div class="shensha-list-view">
      <p class="fine-print">神煞只作为辅助观察点，不单独作为结论；具体应象需结合十神、柱位、原局结构和岁运触发。</p>

      <div class="shensha-pillar-list">
        ${pillars.map((pillar) => renderShenshaPillarRow(pillar)).join("")}
      </div>
    </div>
  `;
}

function renderShenshaPillarRow(pillar = {}) {
  const items = pillar.shensha ?? [];

  return `
    <section class="shensha-pillar-row">
      <div class="shensha-pillar-title">
        <strong>${escapeHtml(pillar.name)} ${escapeHtml(pillar.pillar)}</strong>
        <span>${items.length ? `${items.length} 个` : "未列"}</span>
      </div>

      <div class="shensha-chip-list">
        ${items.length
          ? items.map((item) => `
            <button
              type="button"
              class="shensha-chip"
              data-shensha-name="${escapeHtml(item.name)}"
              data-shensha-pillar="${escapeHtml(`${pillar.name} ${pillar.pillar}`)}"
              data-shensha-source="${escapeHtml(item.sourceBasis || item.evidence || "按传统神煞规则命中。")}"
              data-shensha-note="${escapeHtml(item.typicalMeaning || item.learningNote || "需要结合柱位、十神、岁运继续验证。")}"
            >
              ${escapeHtml(item.name)}
            </button>
          `).join("")
          : `<span class="muted">此柱未列出神煞</span>`}
      </div>
    </section>
  `;
}

function renderVoidAuxiliary(viewModel = {}) {
  return `
    <div class="core-tab-grid">
      ${(viewModel.pillars ?? []).map((item) => `
        <article class="core-fact">
          <span>${escapeHtml(item.name)}</span>
          <strong>${escapeHtml(item.voidBranches?.join("、") || "待查")}</strong>
          <small>${escapeHtml(item.pillar)} 旬空观察</small>
        </article>
      `).join("")}
    </div>
  `;
}

function renderCurrentContext(currentState = {}, currentLuck = {}) {
  const yearItem = currentState.yearImageReport?.yearItem;
  const monthItem = currentState.monthImageReport?.monthItem;
  return `
    <div class="chart-flow-summary chart-context-summary">
      <article><span>当前大运</span><strong>${escapeHtml(currentLuck?.ganZhi || currentLuck?.label || "待查")}</strong><small>${escapeHtml(formatRange(currentLuck?.ageRange, currentLuck?.yearRange))}</small></article>
      <article><span>目标流年</span><strong>${escapeHtml(yearItem?.ganZhi || "待查")}</strong><small>${escapeHtml(String(yearItem?.year ?? currentState.input?.targetYear ?? "待查"))}</small></article>
      <article><span>目标流月</span><strong>${escapeHtml(monthItem?.ganZhi || "待查")}</strong><small>${escapeHtml(`${monthItem?.year ?? currentState.input?.targetYear ?? "待查"}年${monthItem?.month ?? currentState.input?.selectedMonth ?? "待查"}月`)}</small></article>
    </div>
  `;
}

function renderElementBars(counts = {}) {
  const max = Math.max(1, ...Object.values(counts).map((value) => Number(value) || 0));
  return `
    <div class="element-bars">
      ${Object.entries(elementLabels).map(([key, label]) => {
        const value = Number(counts[key] || 0);
        const level = `${Math.round((value / max) * 100)}%`;
        return `<i class="topline-element-bar element-${key}" style="--level:${level}"><b>${escapeHtml(label)}</b><em>${escapeHtml(value)}</em></i>`;
      }).join("")}
    </div>
  `;
}

function renderElementStatsFull(pillars = [], fiveElements = {}) {
  const stemCounts = countBy(pillars, (item) => stemElements[item.stem]);
  const branchCounts = countBy(pillars, (item) => branchElements[item.branch]);
  const hiddenCounts = countHiddenElements(pillars);
  const combinedCounts = combineCounts(stemCounts, branchCounts, hiddenCounts);
  const groups = [
    ["天干五行统计", stemCounts],
    ["地支主气五行统计", branchCounts],
    ["完整藏干五行统计", hiddenCounts],
    ["综合五行统计", Object.keys(combinedCounts).length ? combinedCounts : combineCounts(fiveElements.visible?.counts, fiveElements.hidden?.counts)],
  ];
  return `
    <section class="chart-stat-block">
      <div class="board-title"><h3>五行统计</h3><span>分层统计</span></div>
      <div class="element-stat-grid">
        ${groups.map(([label, counts]) => `<article><span>${escapeHtml(label)}</span>${renderElementBars(counts)}</article>`).join("")}
      </div>
      <p class="fine-print">主导：${escapeHtml((fiveElements.dominant ?? []).map((item) => `${item.label}${item.value}`).join("、") || "待复核")}</p>
    </section>
  `;
}

function renderTenGodStatsFull(pillars = [], tenGods = {}) {
  const stemCounts = countBy(pillars, (item) => item.stemTenGod);
  const branchCounts = countBy(pillars, (item) => item.branchMainTenGod);
  const hiddenCounts = countHiddenTenGods(pillars);
  const combinedCounts = combineCounts(stemCounts, branchCounts, hiddenCounts);
  const groups = [
    ["天干十神", stemCounts],
    ["地支主气十神", branchCounts],
    ["完整藏干十神", Object.keys(hiddenCounts).length ? hiddenCounts : tenGods.fullHidden],
    ["综合十神", combinedCounts],
  ];
  return `
    <section class="chart-stat-block">
      <div class="board-title"><h3>十神统计</h3><span>分层统计</span></div>
      <div class="ten-god-stat-grid">
        ${groups.map(([label, counts]) => `
          <article>
            <span>${escapeHtml(label)}</span>
            <div class="stat-chip-row">${renderCountChips(counts)}</div>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function renderRelationList(relations = []) {
  const unique = uniqueBaseRelations(relations);

  return unique.length
    ? `<div class="relation-compact-list">${unique.map((item) => `
      <details class="relation-compact-item">
        <summary>
          <span class="relation-members">${escapeHtml(relationMembers(item))}</span>
          <span class="relation-main">
            <strong>${escapeHtml(relationName(item))}</strong>
            <em>${escapeHtml(relationEffect(item))}</em>
          </span>
        </summary>
        <p>${escapeHtml(item.evidence || item.description || item.effect || "此关系只作为结构观察点，需结合柱位、旺衰与岁运触发复核。")}</p>
      </details>
    `).join("")}</div>`
    : `<p class="muted relation-empty">当前内置规则未列出明显干支关系，继续结合岁运触发复核。</p>`;
}

function relationMembers(relation = {}) {
  const members = relation.ganzhi ?? relation.members ?? [];
  return Array.isArray(members) && members.length
    ? members.join(" / ")
    : "干支待查";
}

function relationName(relation = {}) {
  return relation.type || relation.relationType || relation.name || "关系";
}

function relationEffect(relation = {}) {
  const effect = relation.effect ?? "";

  if (!effect) return "";

  const name = relationName(relation);
  return String(effect).replace(name, "").trim();
}

function uniqueBaseRelations(relations = []) {
  const seen = new Set();

  return (Array.isArray(relations) ? relations : []).filter((relation) => {
    const displayGanZhi = normalizeDisplayPair(relation.ganzhi ?? relation.members ?? []);
    const relationName = relation.type ?? relation.relationType ?? relation.name ?? "";

    const key = [
      displayGanZhi.join("/"),
      relationName,
    ].join("|");

    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function normalizeDisplayPair(value = []) {
  const list = Array.isArray(value) ? value : [value];

  return list
    .map((item) => String(item ?? "").trim())
    .filter(Boolean)
    .sort();
}

function renderChartDetails(viewModel = {}) {
  const auxiliary = viewModel.auxiliary ?? {};
  const extraFacts = [
    ["胎元", auxiliary.fetalOrigin?.label, auxiliary.fetalOrigin?.meta?.method],
    ["命宫", auxiliary.lifePalace?.label, auxiliary.lifePalace?.meta?.method],
    ["身宫", auxiliary.bodyPalace?.label, auxiliary.bodyPalace?.meta?.method],
    ["胎息", auxiliary.fetalBreath?.label ?? auxiliary.fetalRest?.label ?? auxiliary.fetalBreath],
  ].filter(([, value]) => hasValue(value));
  return `
    <div class="chart-detail-panel">
      <div class="compact-table">
        <div class="compact-row compact-head"><span>柱位</span><span>纳音</span><span>空亡</span><span>十二长生</span></div>
        ${(viewModel.pillars ?? []).map((item) => `
          <div class="compact-row">
            <span>${escapeHtml(item.name)}</span>
            <strong>${escapeHtml(item.nayin || "待查")}</strong>
            <span>${escapeHtml(item.voidBranches?.join("、") || "待查")}</span>
            <span>${escapeHtml(item.twelveGrowth || "待查")}</span>
          </div>
        `).join("")}
      </div>
      ${extraFacts.length ? `<div class="chart-extra-facts">${extraFacts.map(([label, value, note]) => `
        <article><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong>${note ? `<small>${escapeHtml(note)}</small>` : ""}</article>
      `).join("")}</div>` : ""}
    </div>
  `;
}

function renderLuckSummaryTable(cycles = [], currentLuck = {}, luckImageReport = {}, chart = {}) {
  const luckItems = luckImageReport?.luckItems ?? [];
  const start = chart.luckCycles?.startCalculation ?? {};
  const introFacts = [
    ["顺逆", chart.luckCycles?.directionLabel],
    ["起运年龄", chart.luckCycles?.startAgeText ?? chart.luckCycles?.startAge],
    ["起运说明", chart.luckCycles?.startNote ?? start.method],
  ].filter(([, value]) => hasValue(value));
  return `
    <div class="chart-luck-panel">
      ${introFacts.length ? `<div class="chart-extra-facts luck-start-facts">${introFacts.map(([label, value]) => `<article><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></article>`).join("")}</div>` : ""}
      <div class="compact-table chart-luck-full-table">
        <div class="compact-row compact-head"><span>序号</span><span>大运</span><span>年龄</span><span>年份</span><span>天干十神</span><span>地支主气十神</span></div>
      ${(cycles ?? []).map((item) => {
        const matched = luckItems.find((luck) => luck.index === item.index || luck.ganZhi === item.label) ?? {};
        const active = currentLuck?.index === item.index || currentLuck?.ganZhi === item.label || matched.isCurrent;
        return `
          <div class="compact-row${active ? " is-current-luck-row" : ""}">
            <span>${escapeHtml(item.index)}${active ? " 当前" : ""}</span>
            <strong>${escapeHtml(item.label)}</strong>
            <span>${escapeHtml(item.startAge)}-${escapeHtml(item.endAge)}岁</span>
            <span>${escapeHtml(item.startYear)}-${escapeHtml(item.endYear)}</span>
            <span>${escapeHtml(matched.tenGod || "待查")}</span>
            <span>${escapeHtml(matched.branchTenGod || "待查")}</span>
          </div>
        `;
      }).join("") || `<p class="muted">暂无大运数据。</p>`}
      </div>
    </div>
  `;
}

function dayMaster(viewModel = {}) {
  return viewModel.pillars?.find((item) => item.key === "day")?.stem;
}

function combineCounts(...maps) {
  const result = {};
  for (const map of maps) {
    for (const [key, value] of Object.entries(map || {})) {
      result[key] = (result[key] || 0) + Number(value || 0);
    }
  }
  return result;
}

function renderCountChips(counts = {}, labels = {}) {
  const entries = Object.entries(counts || {});
  return entries.length
    ? entries.map(([key, value]) => `<span><b>${escapeHtml(labels[key] ?? key)}</b>${escapeHtml(value)}</span>`).join("")
    : `<span><b>暂无</b>0</span>`;
}

function formatRange(ageRange, yearRange) {
  return [ageRange, yearRange].filter(Boolean).join(" / ") || "待查";
}

function genderLabel(value) {
  return { male: "男", female: "女", unknown: "未填" }[value] ?? value ?? "未填";
}

function yinYangLabel(value) {
  return { yang: "阳", yin: "阴" }[value] ?? "";
}

function hasValue(value) {
  if (Array.isArray(value)) return value.length > 0;
  return value !== undefined && value !== null && value !== "";
}

function joinParts(parts = []) {
  return parts.filter(hasValue).join(" ");
}

function formatLocation(location = {}) {
  const longitude = location.longitude;
  const latitude = location.latitude;
  if (!hasValue(longitude) && !hasValue(latitude)) return "";
  return `${hasValue(longitude) ? `经度${longitude}` : ""}${hasValue(longitude) && hasValue(latitude) ? "，" : ""}${hasValue(latitude) ? `纬度${latitude}` : ""}`;
}

function formatMaybePillars(value) {
  if (!value) return "";
  if (Array.isArray(value)) {
    return value.map((item) => item?.label ?? item?.pillar ?? item).filter(Boolean).join("、");
  }
  if (typeof value === "object") {
    return Object.values(value).map((item) => item?.label ?? item?.pillar ?? item).filter(Boolean).join("、");
  }
  return String(value);
}

function countBy(items = [], pick) {
  const result = {};
  for (const item of items ?? []) {
    const key = pick(item);
    if (!key) continue;
    result[key] = (result[key] || 0) + 1;
  }
  return result;
}

function countHiddenElements(pillars = []) {
  const result = {};
  for (const pillar of pillars ?? []) {
    for (const stem of pillar.hiddenStems ?? []) {
      const key = stem.element;
      if (!key) continue;
      result[key] = (result[key] || 0) + 1;
    }
  }
  return result;
}

function countHiddenTenGods(pillars = []) {
  const result = {};
  for (const pillar of pillars ?? []) {
    for (const stem of pillar.hiddenStems ?? []) {
      const key = stem.tenGod;
      if (!key) continue;
      result[key] = (result[key] || 0) + 1;
    }
  }
  return result;
}

function groupRelations(relations = []) {
  const preferredOrder = ["天干五合", "地支六合", "地支六冲", "刑", "害", "破", "三合", "半合"];
  const groups = new Map();
  for (const relation of relations ?? []) {
    const type = relation.type || "其他关系";
    const bucket = preferredOrder.find((label) => type.includes(label)) ?? type;
    if (!groups.has(bucket)) groups.set(bucket, []);
    groups.get(bucket).push(relation);
  }
  return [...groups.entries()].sort(([left], [right]) => {
    const leftIndex = preferredOrder.indexOf(left);
    const rightIndex = preferredOrder.indexOf(right);
    if (leftIndex === -1 && rightIndex === -1) return left.localeCompare(right, "zh-CN");
    if (leftIndex === -1) return 1;
    if (rightIndex === -1) return -1;
    return leftIndex - rightIndex;
  });
}

function renderPlaceholderPanel(root, title, message = "待实现。") {
  if (!root) return;
  root.innerHTML = `
    <div class="plugin-header">
      <p class="eyebrow">${escapeHtml(title)}</p>
      <h2>${escapeHtml(title)}</h2>
    </div>
    <p class="muted">${escapeHtml(message)}</p>
  `;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function bindShenshaPopupEvents() {
  document.querySelectorAll(".shensha-chip").forEach((button) => {
    button.addEventListener("click", () => {
      openShenshaPopup({
        name: button.dataset.shenshaName,
        pillar: button.dataset.shenshaPillar,
        source: button.dataset.shenshaSource,
        note: button.dataset.shenshaNote,
      });
    });
  });
}

function openShenshaPopup({ name, pillar, source, note } = {}) {
  const old = document.querySelector(".shensha-popup-backdrop");
  old?.remove();

  const backdrop = document.createElement("div");
  backdrop.className = "shensha-popup-backdrop";
  backdrop.innerHTML = `
    <div class="shensha-popup" role="dialog" aria-modal="true" aria-label="${escapeHtml(name || "神煞说明")}">
      <div class="shensha-popup-head">
        <div>
          <p class="eyebrow">神煞说明</p>
          <h3>${escapeHtml(name || "未命名神煞")}</h3>
        </div>
        <button type="button" class="shensha-popup-close" aria-label="关闭">×</button>
      </div>

      <div class="shensha-popup-body">
        <p><b>位置：</b>${escapeHtml(pillar || "待查")}</p>
        <p><b>取象：</b>${escapeHtml(source || "按传统神煞规则命中。")}</p>
        <p><b>提示：</b>${escapeHtml(note || "需要结合柱位、十神、岁运继续验证。")}</p>
      </div>
    </div>
  `;

  backdrop.addEventListener("click", (event) => {
    if (event.target === backdrop) backdrop.remove();
  });

  backdrop.querySelector(".shensha-popup-close")?.addEventListener("click", () => {
    backdrop.remove();
  });

  document.body.appendChild(backdrop);
}