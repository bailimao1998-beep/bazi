import { loadBaziDatasets, summarizeDatasets } from "./lib/dataLoader.js";
import { analyzeBirth, getTransitMonths, getTransitYears, labels } from "./lib/readingEngine.js";

const state = {
  date: "1992-08-18",
  time: "14:30",
  selectedYear: new Date().getFullYear(),
  selectedMonth: new Date().getMonth() + 1,
  datasets: {},
  reading: null,
};

const el = {
  dataStatus: document.querySelector("#dataStatus"),
  birth: document.querySelector("#birthInputPlugin"),
  chart: document.querySelector("#baziChartPlugin"),
  timeline: document.querySelector("#transitTimelinePlugin"),
  inspector: document.querySelector("#combinationInspectorPlugin"),
  overall: document.querySelector("#overallReadingPlugin"),
  topics: document.querySelector("#topicReadingPlugin"),
};

boot();

async function boot() {
  try {
    state.datasets = await loadBaziDatasets();
    el.dataStatus.textContent = summarizeDatasets(state.datasets);
  } catch (error) {
    el.dataStatus.textContent = "数据读取失败，使用内置基础规则";
    el.dataStatus.classList.add("is-warning");
    console.error(error);
  }
  updateReading();
}

function updateReading() {
  state.reading = analyzeBirth(state, state.datasets);
  render();
}

function render() {
  renderBirthInput();
  renderBaziChart();
  renderTimeline();
  renderInspector();
  renderOverall();
  renderTopics();
}

function renderBirthInput() {
  el.birth.innerHTML = `
    <div class="plugin-header">
      <p class="eyebrow">命盘设置</p>
      <h2 id="birth-input-title">出生信息</h2>
    </div>
    <form id="birthForm" class="birth-form">
      <label>
        <span>公历日期</span>
        <input type="date" name="date" value="${state.date}" required />
      </label>
      <label>
        <span>出生时间</span>
        <input type="time" name="time" value="${state.time}" required />
      </label>
      <button type="submit">重新排盘</button>
    </form>
    <p class="fine-print">当前已展示专业命盘字段；节气与真太阳时为近似提示，精确版需接入天文历接口。</p>
  `;
  el.birth.querySelector("#birthForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    state.date = form.get("date");
    state.time = form.get("time");
    updateReading();
  });
}

function renderBaziChart() {
  const pillars = state.reading.natal.pillars;
  el.chart.innerHTML = `
    <div class="plugin-header">
      <p class="eyebrow">核心命盘</p>
      <h2 id="bazi-chart-title">四柱八字</h2>
    </div>
    <div class="pillar-grid">
      ${Object.values(pillars).map(renderPillarCard).join("")}
    </div>
    <div class="energy-row">${renderEnergyBars(state.reading.natal.elements)}</div>
  `;
}

function renderTimeline() {
  const years = getTransitYears(state.selectedYear, 5);
  const months = getTransitMonths(state.selectedYear);
  el.timeline.innerHTML = `
    <div class="plugin-header">
      <p class="eyebrow">岁运推演</p>
      <h2 id="transit-title">流年流月</h2>
    </div>
    <div class="timeline-group">
      ${years
        .map(
          ({ year, pillar }) => `
            <button class="chip ${year === state.selectedYear ? "is-active" : ""}" data-year="${year}">
              <span>${year}</span><strong>${pillar.label}</strong>
            </button>
          `,
        )
        .join("")}
    </div>
    <div class="timeline-group month-grid">
      ${months
        .map(
          ({ month, pillar }) => `
            <button class="chip month ${month === state.selectedMonth ? "is-active" : ""}" data-month="${month}">
              <span>${month}月</span><strong>${pillar.label}</strong>
            </button>
          `,
        )
        .join("")}
    </div>
  `;
  el.timeline.querySelectorAll("[data-year]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedYear = Number(button.dataset.year);
      updateReading();
    });
  });
  el.timeline.querySelectorAll("[data-month]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedMonth = Number(button.dataset.month);
      updateReading();
    });
  });
}

function renderInspector() {
  const { selectedYear, selectedMonth, triggers, energyDelta } = state.reading.transit;
  el.inspector.innerHTML = `
    <div class="plugin-header">
      <p class="eyebrow">触发关系</p>
      <h2 id="inspector-title">组合与能量</h2>
    </div>
    <div class="selected-flow">
      ${renderPillarCard(selectedYear)}
      ${selectedMonth ? renderPillarCard(selectedMonth) : ""}
    </div>
    <div class="mini-energy">${renderEnergyBars(energyDelta)}</div>
    <div class="signal-list">${triggers.map(renderSignal).join("")}</div>
  `;
}

function renderOverall() {
  el.overall.innerHTML = `
    <div class="plugin-header">
      <p class="eyebrow">综合判断</p>
      <h2 id="overall-title">整体情况</h2>
    </div>
    <ol class="summary-list">
      ${state.reading.summary.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
    </ol>
    <div class="signal-list compact">
      ${
        state.reading.natal.combinations.length
          ? state.reading.natal.combinations.map(renderSignal).join("")
          : `<article class="signal"><strong>原局组合</strong><p>暂未检出明显合冲刑害破，先看日主、月令、五行和十神。</p></article>`
      }
    </div>
  `;
}

function renderTopics() {
  el.topics.innerHTML = `
    <div class="plugin-header">
      <p class="eyebrow">分项报告</p>
      <h2 id="topic-title">单项分析</h2>
    </div>
    <div class="topic-grid">
      ${state.reading.topics
        .map(
          (topic) => `
            <article class="topic-card">
              <div class="topic-head">
                <h3>${topic.label}</h3>
                <span>${topic.id}</span>
              </div>
              ${topic.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
              <div class="tag-row">
                ${topic.signals.map((signal) => `<span>${escapeHtml(signal)}</span>`).join("")}
              </div>
            </article>
          `,
        )
        .join("")}
    </div>
  `;
}

function renderPillarCard(pillar) {
  return `
    <article class="pillar-card">
      <span>${pillar.role}</span>
      <strong>${pillar.label}</strong>
      <small>${labels.elements[pillar.stemElement]}干 · ${labels.elements[pillar.branchElement]}支</small>
    </article>
  `;
}

function renderEnergyBars(energy) {
  const max = Math.max(1, ...Object.values(energy));
  return Object.entries(labels.elements)
    .map(([key, label]) => {
      const value = energy[key] ?? 0;
      return `
        <div class="energy-item">
          <div class="energy-label"><span>${label}</span><b>${formatEnergyValue(value)}</b></div>
          <div class="bar"><i style="width:${Math.round((value / max) * 100)}%"></i></div>
        </div>
      `;
    })
    .join("");
}

function formatEnergyValue(value) {
  const rounded = Math.round((Number(value) + Number.EPSILON) * 10) / 10;
  return new Intl.NumberFormat("zh-CN", { maximumFractionDigits: 1 }).format(rounded);
}

function renderSignal(signal) {
  const isActive = signal.status === "active";
  return `
    <article class="signal">
      <div>
        <strong>${escapeHtml(signal.title)}</strong>
        <span class="${isActive ? "badge" : "badge muted"}">${isActive ? "已验证" : "候选参考"}</span>
      </div>
      <p>${escapeHtml(signal.description)}</p>
      <small>证据等级：${escapeHtml(signal.evidenceLevel ?? "derived")}</small>
    </article>
  `;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
