import { getAiSettings, requestNarrative, saveAiSettings, testAiSettings } from "./apiClient.js";
import { renderAiNarrativePanel } from "./components/aiNarrativePanel.js";
import { renderAiSettingsPanel } from "./components/aiSettingsPanel.js";
import { renderBirthForm } from "./components/birthForm.js";
import { renderChartSummary } from "./components/chartSummary.js";
import { renderDebugPanel } from "./components/debugPanel.js";
import { renderEvidenceCards } from "./components/evidenceCards.js";
import { renderMonthTimeline } from "./components/monthTimeline.js";
import { renderYearStoryPanel } from "./components/yearStoryPanel.js";

const roots = {
  birthForm: document.querySelector("#birthForm"),
  chartSummary: document.querySelector("#chartSummary"),
  yearStory: document.querySelector("#yearStory"),
  evidenceCards: document.querySelector("#evidenceCards"),
  aiSettings: document.querySelector("#aiSettings"),
  monthTimeline: document.querySelector("#monthTimeline"),
  aiNarrative: document.querySelector("#aiNarrative"),
  debug: document.querySelector("#debugPanel"),
  status: document.querySelector("#status"),
};

let state = null;
let aiSettingsState = {
  settings: null,
  status: "正在读取 AI 设置...",
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
  async onSubmit(payload) {
    currentInput = { ...currentInput, ...payload };
    await refresh();
  },
});

initializeAiSettings();
refresh();

async function initializeAiSettings() {
  renderAiSettings();
  try {
    aiSettingsState = {
      settings: await getAiSettings(),
      status: "AI 设置已读取。",
    };
  } catch (error) {
    aiSettingsState = { settings: null, status: error.message };
  }
  renderAiSettings();
}

async function refresh() {
  roots.status.textContent = "本地计算中...";
  try {
    state = await requestNarrative(currentInput);
    renderAll();
    roots.status.textContent = "已完成后端排盘、规则匹配、证据报告和 AI 叙事。";
  } catch (error) {
    roots.status.textContent = error.message;
  }
}

function renderAiSettings() {
  renderAiSettingsPanel(roots.aiSettings, aiSettingsState, {
    async onSave(payload) {
      aiSettingsState = { ...aiSettingsState, status: "正在保存 AI 设置..." };
      renderAiSettings();
      try {
        const result = await saveAiSettings(payload);
        aiSettingsState = { settings: result.settings, status: "AI 设置已保存。" };
        renderAiSettings();
        await refresh();
      } catch (error) {
        aiSettingsState = { ...aiSettingsState, status: error.message };
        renderAiSettings();
      }
    },
    async onTest(payload) {
      aiSettingsState = { ...aiSettingsState, status: "正在测试连接..." };
      renderAiSettings();
      try {
        const result = await testAiSettings(payload);
        aiSettingsState = { ...aiSettingsState, status: result.ok ? `测试通过：${result.message}` : `测试未通过：${result.message}` };
      } catch (error) {
        aiSettingsState = { ...aiSettingsState, status: error.message };
      }
      renderAiSettings();
    },
  });
}

function renderAll() {
  renderChartSummary(roots.chartSummary, state);
  renderYearStoryPanel(roots.yearStory, state, {
    onSelectYear(year) {
      currentInput = { ...currentInput, targetYear: year };
      refresh();
    },
  });
  renderMonthTimeline(roots.monthTimeline, state, {
    onSelectMonth(month) {
      currentInput = { ...currentInput, selectedMonth: month };
      refresh();
    },
    onSelectLuck(luck) {
      currentInput = {
        ...currentInput,
        targetYear: luck.startYear,
        selectedMonth: 1,
        selectedLuckIndex: luck.index - 1,
      };
      refresh();
    },
  });
  renderAiNarrativePanel(roots.aiNarrative, state);
  renderEvidenceCards(roots.evidenceCards, state.evidenceReport);
  renderDebugPanel(roots.debug, state);
}
