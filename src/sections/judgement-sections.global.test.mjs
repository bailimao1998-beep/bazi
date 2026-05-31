import assert from "node:assert/strict";
import fs from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

test("renders judgement overview, transit layers, domains, and case signals", async () => {
  const context = buildContext();
  vm.createContext(context);
  for (const file of [
    "./overall-judgement.global.js",
    "./transit-luck.global.js",
    "./topic-report.global.js",
    "./case-showcase.global.js",
  ]) {
    vm.runInContext(await fs.readFile(new URL(file, import.meta.url), "utf8"), context);
  }

  const el = {
    overall: buildElement(),
    timeline: buildElement(),
    topics: buildElement(),
    cases: buildElement(),
  };
  const state = buildState();

  context.window.BaziSections.renderOverallJudgement({ state, el });
  context.window.BaziSections.renderTransitLuck({ state, el, updateReading() {} });
  context.window.BaziSections.renderTopicReport({ state, el });
  context.window.BaziSections.renderCaseShowcase({ state, el });

  assert.match(el.overall.innerHTML, /一句话总览/);
  assert.match(el.overall.innerHTML, /日主：辛金/);
  assert.match(el.overall.innerHTML, /月令：酉月/);
  assert.match(el.overall.innerHTML, /五行重点：金气较明显/);
  assert.match(el.overall.innerHTML, /十神重点：/);
  assert.match(el.overall.innerHTML, /结构提示：当前命盘先从日主、月令和五行分布入手学习/);
  assert.match(el.overall.innerHTML, /学习提醒：当前为学习型解读，只作结构参考，不作确定结论/);
  assert.match(el.overall.innerHTML, /证据链解读/);
  assert.match(el.overall.innerHTML, /先看日主/);
  assert.match(el.overall.innerHTML, /再看月令/);
  assert.match(el.overall.innerHTML, /再看五行/);
  assert.match(el.overall.innerHTML, /再看十神/);
  assert.match(el.overall.innerHTML, /再看干支关系/);
  assert.match(el.overall.innerHTML, /最后看大运流年触发/);
  assert.match(el.overall.innerHTML, /为什么看这个：/);
  assert.match(el.overall.innerHTML, /命盘证据：/);
  assert.match(el.overall.innerHTML, /白话解释：/);
  assert.match(el.overall.innerHTML, /还需要验证：/);
  assert.match(el.overall.innerHTML, /日柱天干为辛/);
  assert.match(el.overall.innerHTML, /月支为酉/);
  assert.match(el.overall.innerHTML, /地支六破/);
  assert.doesNotMatch(el.overall.innerHTML, /学习型规则命中/);
  assert.doesNotMatch(el.overall.innerHTML, /大运流年判断/);
  assert.doesNotMatch(el.overall.innerHTML, /大运己酉作为十年环境/);
  assert.match(el.timeline.innerHTML, /岁运只作为触发层学习，需要先回到原局看主题/);
  assert.match(el.timeline.innerHTML, /十年环境/);
  assert.match(el.timeline.innerHTML, /大运己酉作为十年环境/);
  assert.match(el.timeline.innerHTML, /流年丙午触发事业/);
  assert.match(el.topics.innerHTML, /强弱取舍/);
  assert.match(el.topics.innerHTML, /日主承载不足/);
  assert.match(el.cases.innerHTML, /案例仅作结构复盘参考，不能用单个案例反推当前命盘结论/);
  assert.match(el.cases.innerHTML, /命中原因/);
  assert.match(el.cases.innerHTML, /命中 2026 年事件：岗位变化/);
});

test("renders detailed learning cards as secondary collapsed content", async () => {
  const context = buildContext();
  context.window.BaziLearningInterpretationEngine = {
    buildLearningInterpretations() {
      return {
        grouped: {
          structure: [
            {
              title: "日主学习卡",
              status: "active",
              category: "structure",
              matched: true,
              reason: "日主为辛。",
              learningLogic: "先看日主和月令。",
              plainExplanation: "这是学习卡片。",
              uncertaintyFactors: ["柱位", "岁运"],
              sourceRefs: [],
              confidence: "medium",
            },
          ],
        },
      };
    },
  };
  vm.createContext(context);
  vm.runInContext(await fs.readFile(new URL("./learning-interpretation.global.js", import.meta.url), "utf8"), context);

  const el = { learning: buildElement() };
  context.window.BaziSections.renderLearningInterpretation({ state: buildState(), el });

  assert.match(el.learning.innerHTML, /详细学习卡片/);
  assert.match(el.learning.innerHTML, /这里是更细的规则卡片，适合进一步学习。初次查看建议先看上方一句话总览和证据链。/);
  assert.match(el.learning.innerHTML, /展开详细学习卡片/);
  assert.match(el.learning.innerHTML, /data-learning-details/);
  assert.doesNotMatch(el.learning.innerHTML, /data-learning-details open/);
  assert.match(el.learning.innerHTML, /日主学习卡/);
});

test("keeps the main page sections in the beta learning flow order", async () => {
  const html = await fs.readFile(new URL("../../index.html", import.meta.url), "utf8");
  const ids = [
    "birthInputPlugin",
    "baziChartPlugin",
    "overallReadingPlugin",
    "learningInterpretationPlugin",
    "transitTimelinePlugin",
    "topicReadingPlugin",
    "caseStudyPlugin",
    "offlineAiPlugin",
  ];
  const positions = ids.map((id) => html.indexOf(`id="${id}"`));
  assert.deepEqual(positions.every((position) => position >= 0), true);
  assert.deepEqual([...positions].sort((a, b) => a - b), positions);
});

function buildContext() {
  return {
    window: {
      BaziEngine: {
        getTransitYears() {
          return [{ year: 2026, pillar: { role: "流年", label: "丙午", stemElement: "fire", branchElement: "fire" } }];
        },
        getTransitMonths() {
          return [{ month: 5, pillar: { role: "流月", label: "癸巳", stemElement: "water", branchElement: "fire" } }];
        },
        labels: { elements: { wood: "木", fire: "火", earth: "土", metal: "金", water: "水" } },
      },
      BaziShared: {
        categoryLabel(value) {
          return value;
        },
        escapeHtml(value) {
          return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
        },
        groupBy(items, key) {
          return items.reduce((acc, item) => {
            const group = item[key] ?? "other";
            acc[group] = acc[group] ?? [];
            acc[group].push(item);
            return acc;
          }, {});
        },
        renderEnergyBars() {
          return "<div>energy</div>";
        },
        renderPillarCard(pillar) {
          return `<article>${pillar.role}${pillar.label}</article>`;
        },
        renderSignal(signal) {
          return `<article><strong>${signal.title}</strong><p>${signal.description ?? signal.interpretation ?? ""}</p></article>`;
        },
      },
      BaziSections: {},
    },
  };
}

function buildElement() {
  return {
    innerHTML: "",
    querySelectorAll() {
      return [];
    },
  };
}

function buildState() {
  const evidence = [
    {
      id: "e-annual",
      layer: "annual",
      category: "transit",
      title: "流年丙午触发事业",
      interpretation: "流年把事业主题推到前面。",
      domains: ["career"],
      sourceIds: ["test-source"],
      evidenceLevel: "derived",
      status: "active",
      priority: 30,
      tags: ["流年", "事业"],
    },
  ];
  return {
    selectedYear: 2026,
    selectedMonth: 5,
    selectedLuckIndex: 0,
    datasets: { caseStudies: { cases: [] } },
    aiResult: null,
    reading: {
      natal: {
        basicBaziDisplay: {
          pillars: {
            year: { label: "年柱", ganzhi: "戊寅", stem: "戊", branch: "寅", stemElementLabel: "阳土", branchElementLabel: "阳木", stemTenGod: "正印", branchMainTenGod: "正财" },
            month: { label: "月柱", ganzhi: "辛酉", stem: "辛", branch: "酉", stemElementLabel: "阴金", branchElementLabel: "阴金", stemTenGod: "比肩", branchMainTenGod: "比肩" },
            day: { label: "日柱", ganzhi: "辛酉", stem: "辛", branch: "酉", stemElementLabel: "阴金", branchElementLabel: "阴金", stemTenGod: "日主", branchMainTenGod: "比肩" },
            hour: { label: "时柱", ganzhi: "戊子", stem: "戊", branch: "子", stemElementLabel: "阳土", branchElementLabel: "阳水", stemTenGod: "正印", branchMainTenGod: "食神" },
          },
          elementStats: {
            visible: { counts: { wood: 1, fire: 0, earth: 2, metal: 4, water: 1 } },
            hidden: { counts: { wood: 1, fire: 1, earth: 1, metal: 2, water: 1 } },
          },
          tenGods: {
            stats: { fullHidden: { 比肩: 2, 正财: 1, 正官: 1, 正印: 1, 食神: 1 } },
          },
          relations: [{ type: "地支六破", pillars: ["月柱", "时柱"], members: ["酉", "子"], ganzhi: ["辛酉", "戊子"] }],
        },
        basicInterpretations: [
          {
            id: "basic-day-master-test",
            title: "辛金日主",
            conclusion: "因为日干为辛金，命主性格底色偏精细、重标准、讲原则。",
            evidence: "日干为辛。",
            reason: "八字以日干代表命主本人，辛金类象珠玉精金，所以常代表审美、标准、细腻和敏感。",
            category: "day_master",
            confidence: "high",
            displayOrder: 10,
          },
          {
            id: "basic-month-order-test",
            title: "酉月月令",
            conclusion: "因为月支为酉，金气纯而当令，标准、审美、规则和边界感是重要背景。",
            evidence: "月支为酉。",
            reason: "酉为纯金，季节气势集中，读盘时先看金气是帮身、成才，还是过强而带来压迫和锋芒。",
            category: "month_order",
            confidence: "high",
            displayOrder: 20,
          },
          {
            id: "basic-strength-test",
            title: "日主得令偏旺",
            conclusion: "因为日主五行在月令为旺，命主自身气势较容易显出来，判断时要看输出、财官或结构是否能疏导。",
            evidence: "日主对应五行在月令强弱为旺。",
            reason: "月令是旺衰判断的第一入口，日主得令时自我能量较足，但强不等于吉。",
            category: "strength",
            confidence: "high",
            displayOrder: 60,
          },
          {
            id: "basic-career-test",
            title: "事业看官印配合",
            conclusion: "因为官杀与印星同时出现，事业上更适合看规则资质、证书平台、责任承接和组织体系。",
            evidence: "官杀至少 1 个，印星至少 1 个。",
            reason: "官杀带来要求，印星提供承接和资质，两者同见时，压力可能转成职位、资格和平台支持。",
            category: "career",
            confidence: "medium",
            displayOrder: 80,
          },
          {
            id: "basic-wealth-test",
            title: "财运看财星",
            conclusion: "因为财星较明显，财运主题更容易围绕收入、客户、资源、市场和现实选择展开。",
            evidence: "正财、偏财合计达到 2 以上。",
            reason: "财星代表日主所能支配和经营的对象，财多只是说明资源主题明显，还要继续看日主旺衰。",
            category: "wealth",
            confidence: "medium",
            displayOrder: 90,
          },
        ],
        overallAnalysis: ["旧总论"],
        patternCandidates: [],
        combinations: [],
        matchedRules: [],
        referenceKnowledgeHits: [],
        learningRuleHits: [
          {
            id: "learn-test",
            title: "学习规则：酉月先看金气",
            category: "month_order_learning",
            trigger: "月支为酉",
            whyMatched: "当前月支为酉，且明面金出现较多。",
            howToLearn: "先学月令，再看日主和五行分布。",
            plainExplanation: "这里只解释读盘顺序，不给事件断语。",
            uncertaintyFactors: ["日主强弱", "透干组合"],
            absoluteWarning: "不允许说成单独结论，只能说这是学习提示。",
            confidence: "medium",
            status: "draft",
          },
        ],
        pairInteractions: [],
        starSignals: [],
        datasetCoverage: [],
      },
      luck: {
        gender: "male",
        directionLabel: "顺行",
        startAge: 7,
        startNote: "起运说明",
        pillars: [{ label: "己酉", startAge: 7, endAge: 16, startYear: 2007, endYear: 2016 }],
      },
      transit: {
        selectedLuck: { label: "己酉", startAge: 7, endAge: 16, startYear: 2007, endYear: 2016 },
        selectedYear: { role: "流年", label: "丙午", stemElement: "fire", branchElement: "fire" },
        selectedMonth: { role: "流月", label: "癸巳", stemElement: "water", branchElement: "fire" },
        triggers: [],
        hits: [],
        energyDelta: { wood: 0, fire: 2, earth: 0, metal: 0, water: 1 },
      },
      topics: [],
      judgement: {
        evidence,
        overview: {
          conclusions: ["日主偏弱，先看印比承接。"],
          coreEvidence: evidence,
          candidates: [],
          cautions: ["候选判断需结合真实案例继续校验。"],
        },
        transit: {
          majorLuck: { summary: "大运己酉作为十年环境，增强金土主题。", evidence: [] },
          annual: { summary: "流年丙午触发事业表达。", evidence },
          monthly: { summary: "流月癸巳细化到合作窗口。", evidence: [] },
        },
        domains: [
          {
            id: "career",
            label: "事业",
            sections: {
              主题判断: "事业先看官杀印食配合。",
              触发依据: "流年丙午触发事业证据。",
              强弱取舍: "日主承载不足，需印比承接。",
              提醒建议: "先稳住资源边界。",
            },
            evidence,
            signals: ["事业证据 1 条"],
          },
        ],
        caseSignals: [
          {
            id: "case-flow",
            title: "丙午流年事业变化案例",
            matchedTags: ["流年", "事业"],
            matchedEvents: [{ year: 2026, event: "岗位变化", evidence: "流年触发" }],
            matchedEvidence: evidence,
            reasons: ["命中标签：流年、事业", "命中 2026 年事件：岗位变化"],
            analysis: "流年触发时，事业事件更明显。",
            score: 6,
          },
        ],
      },
    },
  };
}
