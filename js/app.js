import { requestNarrative } from "./apiClient.js";
import { renderAiNarrativePanel } from "./components/aiNarrativePanel.js";
import { renderBirthForm } from "./components/birthForm.js";
import { renderChartSummary } from "./components/chartSummary.js";
import { renderDebugPanel } from "./components/debugPanel.js";
import { renderMonthTimeline } from "./components/monthTimeline.js";
import { renderYearStoryPanel } from "./components/yearStoryPanel.js";

const roots = {
  birthForm: document.querySelector("#birthForm"),
  chartSummary: document.querySelector("#chartSummary"),
  yearStory: document.querySelector("#yearStory"),
  monthTimeline: document.querySelector("#monthTimeline"),
  aiNarrative: document.querySelector("#aiNarrative"),
  debug: document.querySelector("#debugPanel"),
  status: document.querySelector("#status"),
};

let state = null;
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

refresh();

async function refresh() {
  roots.status.textContent = "本地计算中...";
  try {
    state = await requestNarrative(currentInput);
    renderAll();
    roots.status.textContent = "已完成本地排盘、规则匹配和 mock 叙事。";
  } catch (error) {
    roots.status.textContent = error.message;
  }
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
  renderDebugPanel(roots.debug, state);
}
