import { getAiSettings, requestNarrative, saveAiSettings, testAiSettings } from "./apiClient.js";
import { renderAiNarrativePanel } from "./components/aiNarrativePanel.js";
import { renderAiSettingsPanel } from "./components/aiSettingsPanel.js";
import { renderBaseBaziPanel } from "./components/baseBaziPanel.js";
import { renderBirthForm } from "./components/birthForm.js";
import { renderDebugPanel } from "./components/debugPanel.js";
import { renderEvidenceCards } from "./components/evidenceCards.js";
import { renderMonthTimeline } from "./components/monthTimeline.js";
import { renderYearStoryPanel } from "./components/yearStoryPanel.js";

const roots = {
  birthForm: document.querySelector("#birthForm"),
  baseChartPanel: document.querySelector("#baseChartPanel"),
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
  renderBaseBaziPanel(roots.baseChartPanel, state.baseBaziViewModel);
  renderEvidenceCards(roots.natalImagePanel, state.evidenceReport);
  renderAiNarrativePanel(roots.natalAiNarrative, state, { title: "原局 AI 解读" });
  renderLuckImagePanel(roots.luckImagePanel, state);
  renderAiNarrativePanel(roots.luckAiNarrative, state, { title: "大运 AI 解读" });
  renderYearStoryPanel(roots.yearImagePanel, state, {
    onSelectYear(year) {
      currentInput = { ...currentInput, targetYear: year };
      refresh();
    },
  });
  renderAiNarrativePanel(roots.yearAiNarrative, state, { title: "流年 AI 解读" });
  renderMonthTimeline(roots.monthImagePanel, state, {
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
  renderAiNarrativePanel(roots.monthAiNarrative, state, { title: "流月 AI 解读" });
  renderChatPanel(roots.aiChatPanel);
  renderDebugPanel(roots.debug, state);
}

function renderLuckImagePanel(root, data) {
  if (!root) return;
  const luck = data?.selectedLuck;
  root.innerHTML = `
    <div class="plugin-header">
      <p class="eyebrow">大运取象</p>
      <h2>当前大运</h2>
    </div>
    <article class="story-card">
      <strong>${escapeHtml(luck?.label ?? "大运待选")}</strong>
      <p>${escapeHtml(luck ? `${luck.startYear}-${luck.endYear}，${luck.startAge}-${luck.endAge}岁。` : "等待排盘。")}</p>
    </article>
  `;
}

function renderChatPanel(root) {
  if (!root) return;
  root.innerHTML = `
    <div class="plugin-header">
      <p class="eyebrow">AI 问答</p>
      <h2>师傅问答</h2>
    </div>
    <p class="muted">AI 问答接口已保留在后端，主页面问答交互将在后续阶段接入。</p>
  `;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
