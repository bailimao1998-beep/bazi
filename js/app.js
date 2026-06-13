import { loadRuntimeAiSettings, readAiSettings, saveAiSettings } from "./core/ai/aiSettingsClient.js?v=20260613c";
import { buildLuckAiPrompt } from "./core/ai/buildLuckAiPrompt.js";
import { buildNatalAiPrompt } from "./core/ai/buildNatalAiPrompt.js";
import { generateWithDeepSeek } from "./core/ai/deepseekClient.js?v=20260613b";
import { buildLuckImageReport } from "./core/blind-bazi/buildLuckImageReport.js";
import { buildNatalImageReport } from "./core/blind-bazi/buildNatalImageReport.js";
import { buildYearImageReport } from "./core/blind-bazi/buildYearImageReport.js";
import { buildBaseBaziViewModel } from "./core/bazi/buildBaseBaziViewModel.js";
import { calculateBazi } from "./core/bazi/calculateBazi.js";
import { renderAiSettingsPanel } from "./components/aiSettingsPanel.js?v=20260613c";
import { renderBaseBaziPanel } from "./components/baseBaziPanel.js";
import { renderBirthForm } from "./components/birthForm.js";
import { renderDebugPanel } from "./components/debugPanel.js";
import { renderLuckAiNarrativePanel } from "./components/luckAiNarrativePanel.js";
import { renderLuckImagePanel } from "./components/luckImagePanel.js";
import { renderNatalAiNarrativePanel } from "./components/natalAiNarrativePanel.js";
import { renderNatalImagePanel } from "./components/natalImagePanel.js";
import { renderYearImagePanel } from "./components/yearImagePanel.js";

const roots = {
  birthForm: document.querySelector("#birthForm"),
  baseBaziPanel: document.querySelector("#baseBaziPanel"),
  natalImagePanel: document.querySelector("#natalImagePanel"),
  natalAiNarrative: document.querySelector("#natalAiNarrative"),
  luckImagePanel: document.querySelector("#luckImagePanel"),
  luckAiNarrative: document.querySelector("#luckAiNarrative"),
  yearImagePanel: document.querySelector("#yearImagePanel"),
  yearAiNarrative: document.querySelector("#yearAiNarrative"),
  monthImagePanel: document.querySelector("#monthImagePanel"),
  monthAiNarrative: document.querySelector("#monthAiNarrative"),
  aiChatPanel: document.querySelector("#aiChatPanel"),
  aiSettings: document.querySelector("#aiSettings"),
  debug: document.querySelector("#debugPanel"),
  status: document.querySelector("#status"),
};

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
let currentInput = {
  name: "测试用户",
  birthDate: "1949-10-01",
  birthTime: "00:00",
  birthplace: "北京",
  gender: "male",
  targetYear: 2026,
  selectedMonth: 1,
  trueSolarTime: false,
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

  renderShell();
  renderAiSettings();
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
    state = { input: currentInput, chart, baseBaziViewModel, natalImageReport, luckImageReport, yearImageReport };
    natalAiState = { loading: false, text: "", error: "" };
    luckAiState = { loading: false, text: "", error: "" };
    renderBaseOnly();
    roots.status.textContent = "基础排盘已完成。";
  } catch (error) {
    state = { input: currentInput, error: error.message };
    renderBaseError(error);
    roots.status.textContent = `基础排盘失败：${error.message}`;
  }
}

function renderAiSettings() {
  renderAiSettingsPanel(roots.aiSettings, aiSettingsState);
}

function renderShell() {
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
  renderPlaceholderPanel(roots.yearAiNarrative, "流年 AI 分析", "AI 解读待接入。当前系统先保证纯前端排盘与取象。");
  renderPlaceholderPanel(roots.monthImagePanel, "流月取象");
  renderPlaceholderPanel(roots.monthAiNarrative, "流月 AI 分析", "AI 解读待接入。当前系统先保证纯前端排盘与取象。");
  renderPlaceholderPanel(roots.aiChatPanel, "AI 问答", "AI 问答待接入。当前系统先保证纯前端排盘与取象。");
  renderDebugPanel(roots.debug, state);
}

function renderBaseOnly() {
  renderBaseBaziPanel(roots.baseBaziPanel, state.baseBaziViewModel);
  renderNatalImagePanel(roots.natalImagePanel, state.natalImageReport);
  renderNatalAiNarrativePanel(roots.natalAiNarrative, {
    state: natalAiState,
    hasReport: Boolean(state.natalImageReport),
    onGenerate: generateNatalAiNarrative,
  });
  renderLuckImagePanel(roots.luckImagePanel, state.luckImageReport);
  renderLuckAiNarrativePanel(roots.luckAiNarrative, {
    state: luckAiState,
    hasReport: Boolean(state.luckImageReport?.luckItems?.length),
    onGenerate: generateLuckAiNarrative,
  });
  renderYearImagePanel(roots.yearImagePanel, state.yearImageReport);
  renderPlaceholderPanel(roots.yearAiNarrative, "流年 AI 分析", "AI 解读待接入。当前系统先保证纯前端排盘与取象。");
  renderPlaceholderPanel(roots.monthImagePanel, "流月取象");
  renderPlaceholderPanel(roots.monthAiNarrative, "流月 AI 分析", "AI 解读待接入。当前系统先保证纯前端排盘与取象。");
  renderPlaceholderPanel(roots.aiChatPanel, "AI 问答", "AI 问答待接入。当前系统先保证纯前端排盘与取象。");
  renderDebugPanel(roots.debug, state);
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

function renderBaseError(error) {
  if (roots.baseBaziPanel) {
    roots.baseBaziPanel.innerHTML = `
      <div class="plugin-header">
        <p class="eyebrow">基础排盘</p>
        <h2>基础排盘</h2>
      </div>
      <p class="muted">基础排盘失败：${escapeHtml(error.message)}</p>
    `;
  }
  renderPlaceholderPanel(roots.natalImagePanel, "原局取象");
  renderPlaceholderPanel(roots.natalAiNarrative, "原局 AI 分析", "AI 解读待接入。当前系统先保证纯前端排盘与取象。");
  renderPlaceholderPanel(roots.luckImagePanel, "大运取象");
  renderPlaceholderPanel(roots.luckAiNarrative, "大运 AI 分析", "AI 解读待接入。当前系统先保证纯前端排盘与取象。");
  renderPlaceholderPanel(roots.yearImagePanel, "流年取象");
  renderPlaceholderPanel(roots.yearAiNarrative, "流年 AI 分析", "AI 解读待接入。当前系统先保证纯前端排盘与取象。");
  renderPlaceholderPanel(roots.monthImagePanel, "流月取象");
  renderPlaceholderPanel(roots.monthAiNarrative, "流月 AI 分析", "AI 解读待接入。当前系统先保证纯前端排盘与取象。");
  renderPlaceholderPanel(roots.aiChatPanel, "AI 问答", "AI 问答待接入。当前系统先保证纯前端排盘与取象。");
  renderDebugPanel(roots.debug, state);
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
