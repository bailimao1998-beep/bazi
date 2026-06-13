import { readAiSettings, saveAiSettings } from "./core/ai/aiSettingsClient.js";
import { buildNatalImageReport } from "./core/blind-bazi/buildNatalImageReport.js";
import { buildBaseBaziViewModel } from "./core/bazi/buildBaseBaziViewModel.js";
import { calculateBazi } from "./core/bazi/calculateBazi.js";
import { renderAiSettingsPanel } from "./components/aiSettingsPanel.js";
import { renderBaseBaziPanel } from "./components/baseBaziPanel.js";
import { renderBirthForm } from "./components/birthForm.js";
import { renderDebugPanel } from "./components/debugPanel.js";
import { renderNatalImagePanel } from "./components/natalImagePanel.js";

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
  status: "AI 设置保存在当前浏览器 localStorage。",
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

function refresh() {
  roots.status.textContent = "正在前端排盘...";
  try {
    const chart = calculateBazi(currentInput);
    const baseBaziViewModel = buildBaseBaziViewModel(chart);
    const natalImageReport = buildNatalImageReport({ chart, baseBaziViewModel });
    state = { input: currentInput, chart, baseBaziViewModel, natalImageReport };
    renderBaseOnly();
    roots.status.textContent = "基础排盘已完成。";
  } catch (error) {
    state = { input: currentInput, error: error.message };
    renderBaseError(error);
    roots.status.textContent = `基础排盘失败：${error.message}`;
  }
}

function renderAiSettings() {
  renderAiSettingsPanel(roots.aiSettings, aiSettingsState, {
    async onSave(payload) {
      try {
        const result = await saveAiSettings(payload);
        aiSettingsState = { settings: result, status: "AI 设置已保存到浏览器 localStorage。" };
      } catch (error) {
        aiSettingsState = { ...aiSettingsState, status: error.message };
      }
      renderAiSettings();
    },
    onTest() {
      aiSettingsState = { ...aiSettingsState, status: "AI 解读待接入。当前系统先保证纯前端排盘与取象。" };
      renderAiSettings();
    },
  });
}

function renderShell() {
  renderBaseBaziPanel(roots.baseBaziPanel, null);
  renderNatalImagePanel(roots.natalImagePanel, null);
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

function renderBaseOnly() {
  renderBaseBaziPanel(roots.baseBaziPanel, state.baseBaziViewModel);
  renderNatalImagePanel(roots.natalImagePanel, state.natalImageReport);
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
