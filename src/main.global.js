(function () {
  const { analyzeBirth } = window.BaziEngine;
  const {
    renderAiAnalysis,
    renderBirthSettings,
    renderCaseShowcase,
    renderCoreChart,
    renderLearningInterpretation,
    renderOverallJudgement,
    renderTopicReport,
    renderTransitLuck,
  } = window.BaziSections;

  const state = {
    date: "1949-10-01",
    calendarType: "solar",
    lunarYear: 1949,
    lunarMonth: 8,
    lunarDay: 10,
    lunarLeapMonth: false,
    time: "00:00",
    gender: "male",
    birthplace: "北京",
    trueSolarTime: false,
    selectedLuckIndex: 0,
    selectedYear: new Date().getFullYear(),
    selectedMonth: new Date().getMonth() + 1,
    aiModel: "qwen2.5:7b",
    aiLoading: false,
    aiResult: null,
    aiError: "",
    birthInputError: "",
    datasets: {},
    reading: null,
  };

  const dataBundle = "data/bazi-data-bundle.json";

  const el = {
    dataStatus: document.querySelector("#dataStatus"),
    birth: document.querySelector("#birthInputPlugin"),
    chart: document.querySelector("#baziChartPlugin"),
    overall: document.querySelector("#overallReadingPlugin"),
    learning: document.querySelector("#learningInterpretationPlugin"),
    timeline: document.querySelector("#transitTimelinePlugin"),
    topics: document.querySelector("#topicReadingPlugin"),
    offlineAi: document.querySelector("#offlineAiPlugin"),
    cases: document.querySelector("#caseStudyPlugin"),
  };

  boot();

  async function boot() {
    try {
      if (window.location.protocol !== "file:") {
        state.datasets = await loadDatasets();
        el.dataStatus.textContent = summarizeDatasets(state.datasets);
      } else {
        state.datasets = loadBuiltInDatasets();
        el.dataStatus.textContent = summarizeDatasets(state.datasets);
      }
    } catch (error) {
      state.datasets = loadBuiltInDatasets();
      el.dataStatus.textContent = summarizeDatasets(state.datasets);
      el.dataStatus.classList.add("is-warning");
      console.error(error);
    }
    updateReading();
  }

  async function loadDatasets() {
    const response = await fetch(dataBundle);
    if (!response.ok) throw new Error(`无法读取 ${dataBundle}`);
    const bundle = await response.json();
    return {
      ...loadBuiltInDatasets(),
      ...(bundle.datasets ?? {}),
    };
  }

  function loadBuiltInDatasets() {
    return {
      locations: window.BaziLocationData ?? { cities: [] },
      referenceKnowledge: window.BaziReferenceKnowledgeData ?? { sources: [], cards: [] },
    };
  }

  function summarizeDatasets(datasets) {
    const ruleCount = datasets.systemRules?.rules?.length ?? 0;
    const basicRuleCount = datasets.systemRules?.basicInterpretationRules?.length ?? 0;
    const comboGroups = Object.values(datasets.combinations ?? {}).filter((value) => value?.rules?.length).length;
    const tenGods = datasets.tenGods?.tenGodDefinitions?.length ?? 0;
    const cases = datasets.caseStudies?.cases?.length ?? 0;
    const referenceCards = datasets.referenceKnowledge?.cards?.length ?? 0;
    return `已载入 ${ruleCount} 条程序规则、${basicRuleCount} 条基础解读规则、${comboGroups} 组组合关系、${tenGods} 个十神定义、${cases} 个案例、${referenceCards} 张资料卡`;
  }

  function updateReading() {
    state.reading = analyzeBirth(state, state.datasets);
    render();
  }

  function render() {
    const context = { state, el, updateReading };
    renderBirthSettings(context);
    renderCoreChart(context);
    renderOverallJudgement(context);
    renderLearningInterpretation(context);
    renderTransitLuck(context);
    renderTopicReport(context);
    renderCaseShowcase(context);
    renderAiAnalysis(context);
  }
})();
