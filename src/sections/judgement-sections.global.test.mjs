import assert from "node:assert/strict";
import fs from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

test("renders judgement overview, transit layers, domains, and case signals", async () => {
  const context = buildContext();
  vm.createContext(context);
  for (const file of [
    "../lib/coreSignalsEngine.global.js",
    "../lib/coreReadingReportEngine.global.js",
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

  assert.match(el.overall.innerHTML, /本地取象摘要/);
  assert.match(el.overall.innerHTML, /已提取日主、月令、五行信号、十神信号、关系信号、主题标签、岁运触发点/);
  assert.match(el.overall.innerHTML, /核心取象 JSON 调试区/);
  assert.match(el.overall.innerHTML, /core-signals-debug/);
  assert.match(el.overall.innerHTML, /&quot;dayMaster&quot;/);
  assert.match(el.overall.innerHTML, /&quot;tenGodSignals&quot;/);
  assert.doesNotMatch(el.overall.innerHTML, /<details class="core-signals-debug" open>/);
  assert.match(el.overall.innerHTML, /旧版报告\/学习报告/);
  assert.match(el.overall.innerHTML, /<details class="legacy-report-debug">/);
  assert.doesNotMatch(el.overall.innerHTML, /<details class="legacy-report-debug" open>/);
  assert.match(el.overall.innerHTML, /core-report-shell/);
  assert.match(el.overall.innerHTML, /core-report-grid/);
  assert.match(el.overall.innerHTML, /整体画像/);
  assert.match(el.overall.innerHTML, /性格与思维/);
  assert.match(el.overall.innerHTML, /学习与资源/);
  assert.match(el.overall.innerHTML, /事业方向/);
  assert.match(el.overall.innerHTML, /财富与现实/);
  assert.match(el.overall.innerHTML, /感情与合作/);
  assert.match(el.overall.innerHTML, /优势与短板/);
  assert.match(el.overall.innerHTML, /证据链/);
  assert.match(el.overall.innerHTML, /盘面依据/);
  assert.match(el.overall.innerHTML, /白话解释/);
  assert.match(el.overall.innerHTML, /辛金/);
  assert.match(el.overall.innerHTML, /比劫/);
  assert.match(el.overall.innerHTML, /精细、重标准、讲边界/);
  assert.match(el.overall.innerHTML, /整体更偏自我标准清楚、边界感较强/);
  assert.match(el.overall.innerHTML, /思维上容易先看规则、质感和可控性/);
  assert.match(el.overall.innerHTML, /表达和行动不算完全外放/);
  assert.match(el.overall.innerHTML, /学习、证书、长辈支持和平台资源/);
  assert.match(el.overall.innerHTML, /规则型、专业型、证书型、平台型工作/);
  assert.match(el.overall.innerHTML, /财富线索来自年柱正财/);
  assert.match(el.overall.innerHTML, /赚钱方式更适合围绕稳定资源、客户需求和专业服务/);
  assert.match(el.overall.innerHTML, /日支为酉，日支主气为比肩/);
  assert.match(el.overall.innerHTML, /亲密关系和合作里，容易先强调平等、边界和同频/);
  assert.match(el.overall.innerHTML, /优势：标准感强/);
  assert.match(el.overall.innerHTML, /优势：有印星承接/);
  assert.match(el.overall.innerHTML, /短板：火在明面不见/);
  assert.match(el.overall.innerHTML, /短板：比劫较突出/);
  assert.match(el.overall.innerHTML, /依据：日主辛金/);
  assert.match(el.overall.innerHTML, /地支六破/);
  assert.match(el.overall.innerHTML, /当前十神中，比劫较突出/);
  assert.match(el.overall.innerHTML, /比劫主要落在月柱和日支/);
  assert.match(el.overall.innerHTML, /正印出现在年柱和时柱/);
  assert.match(el.overall.innerHTML, /五行中金、土较明显，火在明面不见；藏干里金、木较有来源。/);
  assert.match(el.overall.innerHTML, /天干相生/);
  assert.match(el.overall.innerHTML, /戊、辛/);
  assert.match(el.overall.innerHTML, /酉、子/);
  assert.match(el.overall.innerHTML, /酉子破/);
  assert.equal(countOccurrences(el.overall.innerHTML, "core-report-card"), 8);
  assert.equal(countOccurrences(el.overall.innerHTML, "盘面依据"), 8);
  assert.equal(countOccurrences(el.overall.innerHTML, "白话解释"), 8);
  assert.doesNotMatch(el.overall.innerHTML, /十神分组显示/);
  assert.doesNotMatch(el.overall.innerHTML, /印象/);
  assert.doesNotMatch(el.overall.innerHTML, /日主是谁/);
  assert.doesNotMatch(el.overall.innerHTML, /日主是中心/);
  assert.doesNotMatch(el.overall.innerHTML, /十神是观察入口/);
  assert.doesNotMatch(el.overall.innerHTML, /我是谁：日主/);
  assert.doesNotMatch(el.overall.innerHTML, /环境在哪：月令/);
  assert.doesNotMatch(el.overall.innerHTML, /最明显的象/);
  assert.doesNotMatch(el.overall.innerHTML, /这个象有没有力量/);
  assert.doesNotMatch(el.overall.innerHTML, /这个象和谁发生关系/);
  assert.doesNotMatch(el.overall.innerHTML, /这个象落到什么人事/);
  assert.doesNotMatch(el.overall.innerHTML, /natal\.combinations/);
  assert.doesNotMatch(el.overall.innerHTML, /display\.relations/);
  assert.doesNotMatch(el.overall.innerHTML, /pairInteractions/);
  assert.doesNotMatch(el.overall.innerHTML, /关系牵动：/);
  assert.doesNotMatch(el.overall.innerHTML, /命盘主线/);
  assert.doesNotMatch(el.overall.innerHTML, /盘面重点/);
  assert.doesNotMatch(el.overall.innerHTML, /五行与十神简析/);
  assert.doesNotMatch(el.overall.innerHTML, /<h3>五行状态<\/h3>/);
  assert.doesNotMatch(el.overall.innerHTML, /<h3>十神主题<\/h3>/);
  assert.doesNotMatch(el.overall.innerHTML, /干支关系简析/);
  assert.doesNotMatch(el.overall.innerHTML, /下一步看大运流年/);
  assert.doesNotMatch(el.overall.innerHTML, /观察入口/);
  assert.doesNotMatch(el.overall.innerHTML, /不直接等同现实事件/);
  assert.doesNotMatch(el.overall.innerHTML, /不直接断成现实事件/);
  assert.doesNotMatch(el.overall.innerHTML, /核心内容结论/);
  assert.doesNotMatch(el.overall.innerHTML, /宫位与六亲/);
  assert.doesNotMatch(el.overall.innerHTML, /本盘先怎么看/);
  assert.doesNotMatch(el.overall.innerHTML, /下一步怎么看/);
  assert.doesNotMatch(el.overall.innerHTML, /读盘重点排序/);
  assert.doesNotMatch(el.overall.innerHTML, /老师式讲盘摘要/);
  assert.doesNotMatch(el.overall.innerHTML, /prioritySignals/);
  assert.doesNotMatch(el.overall.innerHTML, /teacherSummary/);
  assert.doesNotMatch(el.overall.innerHTML, /secondaryNotes/);
  assert.doesNotMatch(el.overall.innerHTML, /主题观察/);
  assert.doesNotMatch(el.overall.innerHTML, /结构重点/);
  assert.doesNotMatch(el.overall.innerHTML, /风险与不确定/);
  assert.doesNotMatch(el.overall.innerHTML, /下一步看岁运/);
  assert.doesNotMatch(el.overall.innerHTML, /还要验证什么/);
  assert.doesNotMatch(el.overall.innerHTML, /还需要验证/);
  assert.doesNotMatch(el.overall.innerHTML, /一句话总览/);
  assert.doesNotMatch(el.overall.innerHTML, /证据链解读/);
  assert.doesNotMatch(el.overall.innerHTML, /学习规则：酉月先看金气/);
  assert.doesNotMatch(el.overall.innerHTML, /候选格局\/规则命中/);
  assert.doesNotMatch(el.overall.innerHTML, /五行统计：木1、火0、土2、金4、水1；藏干口径：木1、火1、土1、金2、水1/);
  assert.deepEqual(
    [
      "整体画像",
      "性格与思维",
      "学习与资源",
      "事业方向",
      "财富与现实",
      "感情与合作",
      "优势与短板",
      "证据链",
    ].map((text) => el.overall.innerHTML.indexOf(text)).every((position, index, positions) => position >= 0 && (index === 0 || position > positions[index - 1])),
    true,
  );
  assert.equal(countOccurrences(el.overall.innerHTML, "<h3>"), 9);
  assert.doesNotMatch(el.overall.innerHTML, /学习型规则命中/);
  assert.doesNotMatch(el.overall.innerHTML, /大运流年判断/);
  assert.match(el.timeline.innerHTML, /岁运只作为触发层学习，需要先回到原局看主题/);
  assert.match(el.timeline.innerHTML, /十年环境/);
  assert.match(el.timeline.innerHTML, /大运己酉作为十年环境/);
  assert.match(el.timeline.innerHTML, /流年丙午触发事业/);
  assert.match(el.topics.innerHTML, /强弱取舍/);
  assert.match(el.topics.innerHTML, /日主承载不足/);
  assert.match(el.topics.innerHTML, /实验功能/);
  assert.match(el.topics.innerHTML, /该模块用于辅助学习，当前不作为主报告内容/);
  assert.match(el.cases.innerHTML, /实验功能/);
  assert.match(el.cases.innerHTML, /该模块用于辅助学习，当前不作为主报告内容/);
  assert.match(el.cases.innerHTML, /案例仅作结构复盘参考，不能用单个案例反推当前命盘结论/);
  assert.match(el.cases.innerHTML, /命中原因/);
  assert.match(el.cases.innerHTML, /命中 2026 年事件：岗位变化/);
});

test("renders AI explanation input from coreSignals only", async () => {
  const context = buildContext();
  vm.createContext(context);
  for (const file of ["../lib/coreSignalsEngine.global.js", "./ai-analysis.global.js"]) {
    vm.runInContext(await fs.readFile(new URL(file, import.meta.url), "utf8"), context);
  }

  const el = { offlineAi: buildElement() };
  const state = buildState();

  context.window.BaziSections.renderAiAnalysis({ state, el });

  assert.match(el.offlineAi.innerHTML, /AI 解读报告/);
  assert.match(el.offlineAi.innerHTML, /生成简版解读/);
  assert.match(el.offlineAi.innerHTML, /生成详细解读/);
  assert.match(el.offlineAi.innerHTML, /生成直播口播稿/);
  assert.match(el.offlineAi.innerHTML, /aiExplanationInput/);
  assert.match(el.offlineAi.innerHTML, /整体画像/);
  assert.match(el.offlineAi.innerHTML, /需要大运流年验证的地方/);
  assert.ok(state.aiExplanationInput, "aiExplanationInput should be stored on state");
  assert.deepEqual(Object.keys(state.aiExplanationInput.coreSignals), [
    "dayMaster",
    "monthCommand",
    "elementSignals",
    "tenGodSignals",
    "relationSignals",
    "palaceSignals",
    "strengthSignals",
    "rootingSignals",
    "topicTags",
    "transitHooks",
    "cautions",
  ]);
  assert.doesNotMatch(JSON.stringify(state.aiExplanationInput), /basicBaziDisplay|pairInteractions|combinations|matchedRules/);
});

test("styles local signal summary, debug JSON, and folded legacy report", async () => {
  const css = await fs.readFile(new URL("../styles.css", import.meta.url), "utf8");

  assert.match(css, /#overallReadingPlugin\s*{[^}]*max-width:\s*1000px/s);
  assert.match(css, /#overallReadingPlugin\s*{[^}]*margin-left:\s*auto/s);
  assert.match(css, /#overallReadingPlugin\s*{[^}]*margin-right:\s*auto/s);
  assert.match(css, /\.local-signals-summary\s*{[^}]*border:\s*1px solid/s);
  assert.match(css, /\.core-signals-debug\s*{[^}]*border:\s*1px dashed/s);
  assert.match(css, /\.legacy-report-debug\s*{[^}]*border:\s*1px solid/s);
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

  assert.match(el.learning.innerHTML, /详细规则卡片/);
  assert.match(el.learning.innerHTML, /这里是规则明细，适合复盘学习。主线请以上方基础排盘和本地取象摘要为准。/);
  assert.match(el.learning.innerHTML, /展开详细规则卡片/);
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
    "transitTimelinePlugin",
    "learningInterpretationPlugin",
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
        combinations: [
          { title: "年柱戊寅 与 月柱辛酉：天干相生", effect: "相生", members: ["戊", "辛"], pillars: ["年柱", "月柱"] },
          { title: "月柱辛酉 与 时柱戊子：天干相生", effect: "相生", members: ["辛", "戊"], pillars: ["月柱", "时柱"] },
          { title: "年柱戊寅 与 日柱辛酉：地支相克", effect: "相克", members: ["寅", "酉"], pillars: ["年柱", "日柱"] },
        ],
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
        pairInteractions: [
          {
            title: "日柱辛酉 ↔ 时柱戊子",
            directRelations: [{ title: "酉子破", effect: "破", note: "酉子之间存在地支六破，可作为互动观察点。" }],
            impact: "日柱与时柱命中酉子破，适合观察两个柱位之间的牵动。",
          },
          {
            title: "月柱辛酉 ↔ 时柱戊子",
            directRelations: [{ title: "地支六破", effect: "破", members: ["酉", "子"], note: "重复关系用于测试主报告去重。" }],
            impact: "重复关系用于测试主报告去重。",
          },
        ],
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

function countOccurrences(text, phrase) {
  return String(text).split(phrase).length - 1;
}
