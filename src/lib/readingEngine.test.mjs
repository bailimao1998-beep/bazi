import test from "node:test";
import assert from "node:assert/strict";
import { analyzeBirth, getTransitMonths, getTransitYears } from "./readingEngine.js";

test("builds natal pillars and non-empty topic readings from a Gregorian birth date", () => {
  const reading = analyzeBirth({
    date: "1992-08-18",
    time: "14:30",
    selectedYear: 2026,
    selectedMonth: 5,
  });

  const pillarPattern = /^[甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥]$/;
  assert.match(reading.natal.pillars.year.label, pillarPattern);
  assert.match(reading.natal.pillars.month.label, pillarPattern);
  assert.match(reading.natal.pillars.day.label, pillarPattern);
  assert.match(reading.natal.pillars.hour.label, pillarPattern);
  assert.equal(reading.natal.dayMaster, reading.natal.pillars.day.stem);
  assert.ok(reading.summary.length >= 4);
  assert.deepEqual(
    reading.topics.map((topic) => topic.id),
    ["personality", "family", "children", "health", "money", "marriage", "career"],
  );
  assert.equal(reading.topics.every((topic) => topic.paragraphs.length > 0), true);
  assert.deepEqual(reading.natal.referenceKnowledgeHits, []);
});

test("calculates a known four-pillar chart with correct day master and hour pillar", () => {
  const reading = analyzeBirth({
    date: "2000-01-01",
    time: "14:30",
    selectedYear: 2026,
    selectedMonth: 5,
  });

  assert.equal(reading.natal.pillars.year.label, "己卯");
  assert.equal(reading.natal.pillars.month.label, "丙子");
  assert.equal(reading.natal.pillars.day.label, "戊午");
  assert.equal(reading.natal.pillars.hour.label, "己未");
  assert.equal(reading.natal.dayMaster, "戊");
});

test("calculates the requested Dingzhou sample with solar-term month order", () => {
  const reading = analyzeBirth({
    date: "1998-09-11",
    time: "00:30",
    birthplace: "河北定州",
    gender: "male",
    selectedYear: 2026,
    selectedMonth: 5,
  }, {
    locations: {
      cities: [
        {
          name: "保定·定州市",
          aliases: ["河北定州", "定州", "定州市", "河北省保定市定州市"],
          longitude: 114.996496,
          latitude: 38.522199,
          timezone: "Asia/Shanghai",
          standardMeridian: 120,
        },
      ],
    },
  });

  assert.deepEqual(
    Object.values(reading.natal.pillars).map((pillar) => pillar.label),
    ["戊寅", "辛酉", "辛酉", "戊子"],
  );
});

test("uses the calculated lichun moment rather than a fixed date for year and month pillars", () => {
  const beforeLichun = analyzeBirth({
    date: "2024-02-04",
    time: "10:00",
    selectedYear: 2026,
    selectedMonth: 5,
  });
  const afterLichun = analyzeBirth({
    date: "2024-02-04",
    time: "17:00",
    selectedYear: 2026,
    selectedMonth: 5,
  });

  assert.equal(beforeLichun.natal.pillars.year.label, "癸卯");
  assert.equal(beforeLichun.natal.pillars.month.label, "乙丑");
  assert.equal(afterLichun.natal.pillars.year.label, "甲辰");
  assert.equal(afterLichun.natal.pillars.month.label, "丙寅");
});

test("anchors the sexagenary day cycle on 1984-02-02 as bing-yin day", () => {
  const reading = analyzeBirth({
    date: "1984-02-02",
    time: "12:00",
    selectedYear: 2026,
    selectedMonth: 5,
  });

  assert.equal(reading.natal.pillars.day.label, "丙寅");
});

test("applies late zi hour as the next sexagenary day for day and hour pillars", () => {
  const reading = analyzeBirth({
    date: "2000-01-01",
    time: "23:30",
    selectedYear: 2026,
    selectedMonth: 5,
  });

  assert.equal(reading.natal.pillars.day.label, "己未");
  assert.equal(reading.natal.pillars.hour.label, "甲子");
  assert.equal(reading.natal.basicBaziDisplay.calendar.dayPillarRule, "23:00-23:59按次日计算日柱（晚子时换日）");
  assert.equal(reading.natal.basicBaziDisplay.calendar.dayPillarDate, "2000-01-02");
});

test("recalculates hour pillar after true solar time crosses an hour branch", () => {
  const standardTime = analyzeBirth({
    date: "1998-09-11",
    time: "01:05",
    birthplace: "乌鲁木齐",
    trueSolarTime: false,
    selectedYear: 2026,
    selectedMonth: 5,
  });
  const trueSolarTime = analyzeBirth({
    date: "1998-09-11",
    time: "01:05",
    birthplace: "乌鲁木齐",
    trueSolarTime: true,
    selectedYear: 2026,
    selectedMonth: 5,
  });

  assert.notEqual(trueSolarTime.natal.pillars.hour.label, standardTime.natal.pillars.hour.label);
  assert.equal(standardTime.natal.basicBaziDisplay.calendar.finalHourBranch, "丑时");
  assert.equal(trueSolarTime.natal.basicBaziDisplay.calendar.finalHourBranch, "亥时");
  assert.equal(trueSolarTime.natal.basicBaziDisplay.calendar.finalDate, "1998-09-10");
});

test("normalizes lunar birth input to the equivalent Gregorian chart", () => {
  const solar = analyzeBirth({
    calendarType: "solar",
    date: "1992-08-18",
    time: "14:30",
    selectedYear: 2026,
    selectedMonth: 5,
  });
  const lunar = analyzeBirth({
    calendarType: "lunar",
    lunarYear: 1992,
    lunarMonth: 7,
    lunarDay: 20,
    lunarLeapMonth: false,
    time: "14:30",
    selectedYear: 2026,
    selectedMonth: 5,
  });

  assert.deepEqual(lunar.natal.pillars, solar.natal.pillars);
  assert.equal(lunar.natal.chartMeta.calendar.originalSolarDate, "1992-08-18");
  assert.equal(lunar.natal.chartMeta.calendar.lunarDate, "农历壬申年七月二十");
  assert.equal(lunar.natal.chartMeta.calendar.inputCalendarType, "lunar");
});

test("uses dataset ten-god matrix, hidden stems, and seasonal-strength rules when datasets are supplied", () => {
  const datasets = {
    tenGods: {
      tenGodMatrix: { matrix: { 戊: { 己: "DATA_MATRIX_TEST" } } },
      tenGodDefinitions: [
        {
          name: "DATA_MATRIX_TEST",
          domain_meaning: { career: "来自十神数据库的事业解释" },
          status: "active",
          evidenceLevel: "secondary_source",
          sourceIds: ["ten-gods"],
        },
      ],
    },
    stemsBranches: {
      earthlyBranches: [
        {
          branch: "未",
          hiddenStems: [
            { stem: "己", element: "earth", weight: 100, role: "主气" },
            { stem: "丁", element: "fire", weight: 30, role: "中气" },
          ],
        },
      ],
    },
    fiveElements: {
      seasonalStrength: {
        rules: [
          {
            monthBranch: "子",
            element: "earth",
            seasonalStatus: "囚",
            score: 2,
            interpretation: "土在子月为囚：来自五行强弱数据库",
            status: "active",
            evidenceLevel: "secondary_source",
            sourceIds: ["seasonal-strength"],
          },
        ],
      },
    },
  };
  const reading = analyzeBirth({
    date: "2000-01-01",
    time: "14:30",
    selectedYear: 2026,
    selectedMonth: 5,
  }, datasets);

  assert.ok(reading.natal.tenGods.some((signal) => signal.name === "DATA_MATRIX_TEST"));
  assert.ok(reading.natal.hiddenStems.some((signal) => signal.branch === "未" && signal.stem === "己"));
  assert.ok(reading.natal.strengthSignals.some((signal) => signal.interpretation.includes("来自五行强弱数据库")));
  assert.ok(reading.topics.some((topic) => topic.id === "career" && topic.paragraphs.join("").includes("来自十神数据库")));
});

test("returns pillar ten-god rows, matched database rules, and pattern candidates", () => {
  const datasets = {
    tenGods: {
      tenGodMatrix: { matrix: { 戊: { 己: "劫财", 丙: "偏印", 子: "BAD" } } },
      tenGodDefinitions: [],
    },
    systemRules: {
      rules: [
        {
          id: "rule-season-earth-子",
          category: "element_season_strength",
          match: { monthBranch: "子", element: "earth" },
          interpretation: "土在子月为囚",
          display: { title: "土气囚" },
          domains: ["career"],
          status: "active",
          evidenceLevel: "secondary_source",
        },
        {
          id: "rule-branch-子午",
          category: "branch_pair_relation",
          match: { branchA: "子", branchB: "午", relation: "六冲" },
          interpretation: "子午冲",
          display: { title: "子午冲" },
          domains: ["marriage"],
          status: "active",
          evidenceLevel: "traditional_consensus",
        },
      ],
    },
    patternsUsefulGods: {
      normalPatterns: [
        {
          id: "pian_yin",
          name: "偏印格",
          tenGod: "偏印",
          summary: "以偏印成格",
          status: "draft",
          evidenceLevel: "secondary_source",
          sourceIds: ["pattern"],
        },
      ],
    },
  };
  const reading = analyzeBirth({
    date: "2000-01-01",
    time: "14:30",
    selectedYear: 2026,
    selectedMonth: 5,
  }, datasets);

  assert.equal(reading.natal.pillarDetails.month.stemTenGod, "偏印");
  assert.equal(reading.natal.pillarDetails.day.stemTenGod, "日主");
  assert.ok(reading.natal.matchedRules.some((rule) => rule.category === "element_season_strength"));
  assert.ok(reading.natal.matchedRules.some((rule) => rule.category === "branch_pair_relation"));
  assert.ok(reading.natal.patternCandidates.some((pattern) => pattern.name === "偏印格"));
});

test("returns fixed basic interpretation matches from systemRules basicInterpretationRules", () => {
  const datasets = {
    systemRules: {
      basicInterpretationRules: [
        {
          id: "basic-day-master-wu",
          category: "day_master",
          condition: { dayStem: "戊" },
          title: "戊土日主",
          conclusion: "因为日干为戊土，命主底色偏重承载、稳定和现实感。",
          evidence: "日干为戊。",
          reason: "八字以日干代表命主本人，戊土类象高山厚土，所以重稳定与承载。",
          displayOrder: 10,
          confidence: "high",
          status: "active",
        },
        {
          id: "basic-month-order-zi",
          category: "month_order",
          condition: { monthBranch: "子" },
          title: "子月月令",
          conclusion: "出生在子月，水气当令，寒湿与流动信息是原局底色之一。",
          evidence: "月支为子。",
          reason: "月令主季节气候，是判断五行旺衰和命局环境的第一入口。",
          displayOrder: 20,
          confidence: "high",
          status: "active",
        },
      ],
    },
  };

  const reading = analyzeBirth({
    date: "2000-01-01",
    time: "14:30",
    selectedYear: 2026,
    selectedMonth: 5,
  }, datasets);

  assert.deepEqual(
    reading.natal.basicInterpretations.map((item) => item.id),
    ["basic-day-master-wu", "basic-month-order-zi"],
  );
  assert.ok(reading.natal.basicInterpretations.every((item) => item.conclusion.includes("因为") || item.reason.length > 0));
});

test("matches enabled reference knowledge cards against the chart without touching core rules", () => {
  const datasets = {
    referenceKnowledge: {
      sources: [
        {
          id: "cui-blind-notes-5000",
          title: "崔老师盲派八字笔记",
          fileName: "催老师催文举崔老师盲派八字笔记（5000元）.pdf",
          pageCount: 297,
          status: "processed",
        },
      ],
      cards: [
        {
          id: "ref-zi-wu-chong",
          title: "子午冲以动象看婚恋与事业",
          category: "branch_relation",
          domains: ["marriage", "career"],
          tags: ["子午冲", "冲", "偏印"],
          match: {
            branches: ["子", "午"],
            tenGods: ["偏印"],
            relations: ["子午冲"],
          },
          sourceRefs: [{ sourceId: "cui-blind-notes-5000", pageStart: 11, pageEnd: 11 }],
          summary: "子午冲出现时，先看被冲柱位与十神，再定事件主题。",
          interpretation: "原局有子午冲，又见偏印主题，可把变化、牵动和手续文书类信息放入重点观察。",
          display: { title: "资料卡：子午冲", template: "子午相冲，以动象和柱位落点参看。" },
          enabledForAnalysis: true,
          confidence: "high",
          status: "auto_enabled",
        },
        {
          id: "ref-disabled",
          title: "未启用资料卡",
          category: "disabled",
          domains: ["career"],
          tags: ["子午冲"],
          match: { branches: ["子", "午"] },
          sourceRefs: [{ sourceId: "cui-blind-notes-5000", pageStart: 12, pageEnd: 12 }],
          summary: "不应命中。",
          interpretation: "不应命中。",
          display: { title: "不应命中" },
          enabledForAnalysis: false,
          confidence: "high",
          status: "draft",
        },
      ],
    },
  };

  const reading = analyzeBirth({
    date: "2000-01-01",
    time: "14:30",
    selectedYear: 2026,
    selectedMonth: 5,
  }, datasets);

  assert.equal(reading.natal.referenceKnowledgeHits.length, 1);
  assert.equal(reading.natal.referenceKnowledgeHits[0].id, "ref-zi-wu-chong");
  assert.deepEqual(reading.natal.referenceKnowledgeHits[0].sourceRefs, [
    { sourceId: "cui-blind-notes-5000", pageStart: 11, pageEnd: 11 },
  ]);
  assert.ok(reading.natal.referenceKnowledgeHits[0].matchReasons.some((reason) => reason.includes("子、午")));
  assert.ok(reading.topics.some((topic) => topic.id === "marriage" && topic.evidence.some((item) => item.includes("资料卡：子午冲"))));
});

test("shows day stem as day master but keeps same stems in other pillars as ten gods", () => {
  const reading = analyzeBirth({
    date: "2000-01-01",
    time: "12:30",
    selectedYear: 2026,
    selectedMonth: 5,
  });

  assert.equal(reading.natal.pillarDetails.year.stemTenGod, "劫财");
  assert.equal(reading.natal.pillarDetails.month.stemTenGod, "偏印");
  assert.equal(reading.natal.pillarDetails.day.stemTenGod, "日主");
  assert.equal(reading.natal.pillarDetails.hour.pillar.label, "戊午");
  assert.equal(reading.natal.pillarDetails.hour.stemTenGod, "比肩");
  assert.equal(reading.natal.pillarDetails.day.branchMainTenGod, "正印");
  assert.equal(reading.natal.tenGods.some((signal) => signal.source !== "日柱天干" && signal.name === "日主"), false);
});

test("builds overall analysis and every pillar-pair interaction", () => {
  const reading = analyzeBirth({
    date: "2000-01-01",
    time: "14:30",
    selectedYear: 2026,
    selectedMonth: 5,
  });

  assert.ok(reading.natal.overallAnalysis.length >= 4);
  assert.equal(reading.natal.pairInteractions.length, 6);
  assert.ok(
    reading.natal.pairInteractions.some(
      (item) => item.leftKey === "month" && item.rightKey === "hour" && item.title.includes("月柱") && item.title.includes("时柱"),
    ),
  );
  assert.ok(reading.natal.pairInteractions.every((item) => item.stemRelation && item.branchRelation && item.impact));
  assert.ok(reading.natal.pairInteractions.every((item) => item.stemRelationSource && item.branchRelationSource));
});

test("builds distinct topic readings and transit hits against natal pillars", () => {
  const reading = analyzeBirth({
    date: "2000-01-01",
    time: "14:30",
    selectedYear: 2026,
    selectedMonth: 5,
  });

  const topicBodies = new Set(reading.topics.map((topic) => topic.paragraphs.join("|")));
  assert.ok(topicBodies.size > 3);
  assert.ok(reading.topics.every((topic) => topic.evidence.length > 0));
  assert.ok(reading.transit.hits.length > 0);
  assert.ok(reading.transit.hits.every((hit) => hit.transit && hit.target && hit.relation && hit.domains.length > 0));
});

test("builds unified judgement evidence across natal, luck, annual, and monthly layers", () => {
  const reading = analyzeBirth({
    date: "2000-01-01",
    time: "14:30",
    gender: "male",
    selectedLuckIndex: 0,
    selectedYear: 2026,
    selectedMonth: 5,
  });

  assert.equal(reading.transit.selectedLuck.label, reading.luck.pillars[0].label);
  assert.ok(Array.isArray(reading.judgement.evidence));
  assert.ok(reading.judgement.evidence.length >= 8);
  assert.ok(reading.judgement.evidence.every((item) => item.id && item.layer && item.category && item.title));
  assert.ok(reading.judgement.evidence.every((item) => Array.isArray(item.domains) && Array.isArray(item.sourceIds) && Array.isArray(item.tags)));
  assert.ok(reading.judgement.evidence.every((item) => Number.isFinite(item.priority)));
  assert.ok(reading.judgement.evidence.some((item) => item.layer === "natal"));
  assert.ok(reading.judgement.evidence.some((item) => item.layer === "major_luck" && item.title.includes(reading.transit.selectedLuck.label)));
  assert.ok(reading.judgement.evidence.some((item) => item.layer === "annual" && item.title.includes(reading.transit.selectedYear.label)));
  assert.ok(reading.judgement.evidence.some((item) => item.layer === "monthly" && item.title.includes(reading.transit.selectedMonth.label)));
  assert.ok(reading.judgement.overview.conclusions.length >= 3);
  assert.ok(reading.judgement.transit.majorLuck.summary.includes(reading.transit.selectedLuck.label));
  assert.ok(reading.judgement.transit.annual.summary.includes(reading.transit.selectedYear.label));
  assert.ok(reading.judgement.transit.monthly.summary.includes(reading.transit.selectedMonth.label));
  assert.ok(reading.judgement.domains.some((domain) => domain.id === "career" && domain.sections["主题判断"]));
});

test("changes judgement transit analysis when selected flow year changes", () => {
  const first = analyzeBirth({
    date: "1992-08-18",
    time: "14:30",
    selectedLuckIndex: 0,
    selectedYear: 2024,
    selectedMonth: 1,
  });
  const second = analyzeBirth({
    date: "1992-08-18",
    time: "14:30",
    selectedLuckIndex: 0,
    selectedYear: 2026,
    selectedMonth: 1,
  });

  assert.notEqual(first.judgement.transit.annual.summary, second.judgement.transit.annual.summary);
  assert.notEqual(
    first.judgement.evidence.filter((item) => item.layer === "annual").map((item) => item.title).join("|"),
    second.judgement.evidence.filter((item) => item.layer === "annual").map((item) => item.title).join("|"),
  );
});

test("scores local case signals with matched evidence and selected-year events", () => {
  const reading = analyzeBirth({
    date: "2000-01-01",
    time: "14:30",
    selectedLuckIndex: 0,
    selectedYear: 2026,
    selectedMonth: 5,
  }, {
    caseStudies: {
      cases: [
        {
          id: "case-flow-2026",
          title: "午火伏吟带动事业变化",
          tags: ["伏吟", "流年", "事业", "火"],
          events: [{ year: 2026, event: "岗位变化", evidence: "流年伏吟日支" }],
          analysis: "流年伏吟时，原局对应宫位和主题更容易被推到前台。",
        },
        {
          id: "case-unrelated",
          title: "无关案例",
          tags: ["文昌贵人"],
          events: [{ year: 2021, event: "考试", evidence: "文昌" }],
          analysis: "无关。",
        },
      ],
    },
  });

  assert.equal(reading.judgement.caseSignals.length, 1);
  assert.equal(reading.judgement.caseSignals[0].id, "case-flow-2026");
  assert.ok(reading.judgement.caseSignals[0].score > 0);
  assert.ok(reading.judgement.caseSignals[0].matchedTags.includes("伏吟"));
  assert.ok(reading.judgement.caseSignals[0].matchedEvents.some((event) => event.year === 2026));
  assert.ok(reading.judgement.caseSignals[0].reasons.some((reason) => reason.includes("2026")));
  assert.ok(reading.judgement.caseSignals[0].matchedEvidence.length > 0);
});

test("changes transit triggers when the selected flow year changes", () => {
  const first = analyzeBirth({
    date: "1992-08-18",
    time: "14:30",
    selectedYear: 2024,
    selectedMonth: 1,
  });
  const second = analyzeBirth({
    date: "1992-08-18",
    time: "14:30",
    selectedYear: 2026,
    selectedMonth: 1,
  });

  assert.notEqual(first.transit.selectedYear.label, second.transit.selectedYear.label);
  assert.notEqual(
    first.transit.triggers.map((trigger) => trigger.title).join("|"),
    second.transit.triggers.map((trigger) => trigger.title).join("|"),
  );
});

test("creates clickable year and month options around the selected date", () => {
  const years = getTransitYears(2026, 3);
  const months = getTransitMonths(2026);

  assert.deepEqual(
    years.map((item) => item.year),
    [2023, 2024, 2025, 2026, 2027, 2028, 2029],
  );
  assert.equal(months.length, 12);
  assert.equal(months[0].month, 1);
  assert.equal(months[11].month, 12);
});

test("adds professional chart metadata and luck pillars", () => {
  const reading = analyzeBirth({
    date: "1992-08-18",
    time: "14:30",
    gender: "male",
    selectedYear: 2026,
    selectedMonth: 5,
  });

  assert.equal(reading.natal.chartMeta.nayin.year, "剑锋金");
  assert.equal(reading.natal.chartMeta.nayin.day, "炉中火");
  assert.deepEqual(reading.natal.chartMeta.voidBranches.day, ["戌", "亥"]);
  assert.match(reading.natal.chartMeta.fetalOrigin.label, /^[甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥]$/);
  assert.match(reading.natal.chartMeta.lifePalace.label, /^[甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥]$/);
  assert.match(reading.natal.chartMeta.bodyPalace.label, /^[甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥]$/);
  assert.equal(reading.natal.chartMeta.twelveStages.day, "长生");
  assert.equal(reading.luck.direction, "forward");
  assert.equal(reading.luck.pillars.length, 10);
  assert.equal(reading.luck.pillars[0].label, "己酉");
  assert.equal(reading.luck.pillars[0].startAge, 7);
});

test("returns core chart expert metadata for rendering professional tabs", () => {
  const reading = analyzeBirth({
    date: "1992-08-18",
    time: "14:30",
    gender: "male",
    birthplace: "北京",
    trueSolarTime: false,
    selectedYear: 2026,
    selectedMonth: 5,
  });
  const alternateTransitReading = analyzeBirth({
    date: "1992-08-18",
    time: "14:30",
    gender: "male",
    birthplace: "北京",
    trueSolarTime: false,
    selectedYear: 2024,
    selectedMonth: 1,
  });

  assert.equal(reading.natal.coreChart.genderLabel, "乾造");
  assert.equal(reading.natal.coreChart.zodiac, "猴");
  assert.equal(reading.natal.coreChart.tenGodCounts["偏财"] >= 1, true);
  assert.equal(reading.natal.coreChart.tenGodCounts["七杀"] >= 1, true);
  assert.deepEqual(reading.natal.coreChart.tenGodCounts, alternateTransitReading.natal.coreChart.tenGodCounts);
  assert.equal(reading.natal.coreChart.dayMasterStrength.status, "候选");
  assert.match(reading.natal.coreChart.dayMasterStrength.label, /丙火/);
  assert.ok(reading.natal.coreChart.usefulGodCandidates.favorable.length >= 1);
  assert.ok(reading.natal.coreChart.usefulGodCandidates.caution.length >= 1);
  assert.equal(reading.natal.coreChart.calendarPrecision.lunarStatus, "已接入");
  assert.match(reading.natal.coreChart.calendarPrecision.solarTermStatus, /太阳黄经/);
});

test("builds complete basic bazi display without mixing core chart scopes", () => {
  const reading = analyzeBirth({
    calendarType: "solar",
    date: "1998-09-11",
    time: "00:30",
    gender: "male",
    birthplace: "北京",
    trueSolarTime: false,
    selectedYear: 2026,
    selectedMonth: 5,
  });
  const display = reading.natal.basicBaziDisplay;

  assert.equal(display.calendar.originalTime, "00:30");
  assert.equal(display.calendar.finalTime, "00:30");
  assert.equal(display.calendar.trueSolarTime.enabled, false);
  assert.equal(display.calendar.finalHourBranch, "子时");
  assert.match(display.calendar.solarTermRange, /白露之后/);
  assert.match(display.calendar.solarTermRange, /寒露之前/);

  assert.equal(display.pillars.day.stemTenGod, "日主");
  assert.deepEqual(
    display.pillars.year.hiddenStems.map((item) => [item.stem, item.tenGod, item.role]),
    [
      ["甲", "正财", "主气"],
      ["丙", "正官", "中气"],
      ["戊", "正印", "余气"],
    ],
  );
  assert.equal(display.pillars.month.hiddenStems.length, 1);
  assert.equal(display.pillars.hour.hiddenStems[0].stem, "癸");

  assert.equal(display.pillars.year.stemElementLabel, "阳土");
  assert.equal(display.pillars.month.branchElementLabel, "阴金");
  assert.equal(display.pillars.hour.branchElementLabel, "阳水");

  assert.equal(display.elementStats.visible.label, "明面五行");
  assert.equal(display.elementStats.visible.note, "四个天干 + 四个地支本气");
  assert.deepEqual(display.elementStats.visible.counts, { wood: 1, fire: 0, earth: 2, metal: 4, water: 1 });
  assert.equal(display.elementStats.hidden.label, "藏干五行");
  assert.equal(display.elementStats.hidden.note, "按完整藏干逐个统计，不按权重折算");
  assert.deepEqual(display.elementStats.hidden.counts, { wood: 1, fire: 1, earth: 1, metal: 2, water: 1 });

  assert.equal(display.voids.day.pillar, "辛酉");
  assert.equal(display.voids.day.xun, "甲寅旬");
  assert.deepEqual(display.voids.day.branches, ["子", "丑"]);
  assert.equal(display.voids.byPillar.month.xun, "甲寅旬");

  assert.ok(display.relations.every((relation) => !relation.description && !relation.interpretation));
  assert.ok(display.relations.some((relation) => relation.type === "地支六破" && relation.pillars.includes("月柱") && relation.pillars.includes("时柱")));
});

test("rounds element scores for professional display", () => {
  const datasets = {
    stemsBranches: {
      earthlyBranches: [
        { branch: "申", hiddenStems: [{ stem: "庚", element: "metal", weight: 60 }, { stem: "壬", element: "water", weight: 30 }, { stem: "戊", element: "earth", weight: 10 }] },
        { branch: "寅", hiddenStems: [{ stem: "甲", element: "wood", weight: 60 }, { stem: "丙", element: "fire", weight: 30 }, { stem: "戊", element: "earth", weight: 10 }] },
        { branch: "未", hiddenStems: [{ stem: "己", element: "earth", weight: 60 }, { stem: "丁", element: "fire", weight: 30 }, { stem: "乙", element: "wood", weight: 10 }] },
      ],
    },
  };
  const reading = analyzeBirth({
    date: "1992-08-18",
    time: "14:30",
    selectedYear: 2026,
    selectedMonth: 5,
  }, datasets);

  assert.equal(reading.natal.elementScores.earth.display, "2.9");
  assert.equal(reading.natal.elementScores.metal.display, "3.2");
  assert.equal(reading.natal.elementScores.fire.display, "1.6");
});

test("applies birthplace longitude when true solar time is enabled", () => {
  const datasets = {
    locations: {
      cities: [
        {
          name: "乌鲁木齐",
          longitude: 87.62,
          latitude: 43.82,
          timezone: "Asia/Shanghai",
          standardMeridian: 120,
        },
      ],
    },
  };
  const standard = analyzeBirth({
    date: "1992-08-18",
    time: "00:30",
    birthplace: "乌鲁木齐",
    trueSolarTime: false,
    selectedYear: 2026,
    selectedMonth: 5,
  }, datasets);
  const trueSolar = analyzeBirth({
    date: "1992-08-18",
    time: "00:30",
    birthplace: "乌鲁木齐",
    trueSolarTime: true,
    selectedYear: 2026,
    selectedMonth: 5,
  }, datasets);

  assert.equal(standard.natal.pillars.hour.branch, "子");
  assert.equal(trueSolar.natal.pillars.hour.branch, "亥");
  assert.equal(trueSolar.natal.chartMeta.calendar.trueSolarTime.enabled, true);
  assert.equal(trueSolar.natal.chartMeta.calendar.trueSolarTime.applied, true);
  assert.equal(trueSolar.natal.chartMeta.calendar.trueSolarTime.location.name, "乌鲁木齐");
  assert.ok(trueSolar.natal.chartMeta.calendar.trueSolarTime.correctionMinutes < -100);
  assert.notEqual(trueSolar.natal.pillars.hour.label, standard.natal.pillars.hour.label);
});

test("does not silently use Beijing longitude for unmatched birthplace true solar time", () => {
  const standard = analyzeBirth({
    date: "1992-08-18",
    time: "00:30",
    birthplace: "未收录城市",
    trueSolarTime: false,
    selectedYear: 2026,
    selectedMonth: 5,
  });
  const unmatched = analyzeBirth({
    date: "1992-08-18",
    time: "00:30",
    birthplace: "未收录城市",
    trueSolarTime: true,
    selectedYear: 2026,
    selectedMonth: 5,
  });

  assert.equal(unmatched.natal.chartMeta.calendar.trueSolarTime.enabled, true);
  assert.equal(unmatched.natal.chartMeta.calendar.trueSolarTime.applied, false);
  assert.equal(unmatched.natal.chartMeta.calendar.trueSolarTime.location.source, "unmatched");
  assert.equal(unmatched.natal.chartMeta.calendar.trueSolarTime.correctionMinutes, 0);
  assert.equal(unmatched.natal.chartMeta.calendar.trueSolarTime.note, "出生地未匹配经纬度，未应用真太阳时校正。");
  assert.deepEqual(unmatched.natal.pillars, standard.natal.pillars);
});

test("uses built-in common city longitude when location dataset is unavailable", () => {
  const reading = analyzeBirth({
    date: "1992-08-18",
    time: "12:00",
    birthplace: "乌鲁木齐",
    trueSolarTime: true,
    selectedYear: 2026,
    selectedMonth: 5,
  });

  assert.equal(reading.natal.chartMeta.calendar.trueSolarTime.applied, true);
  assert.equal(reading.natal.chartMeta.calendar.trueSolarTime.location.source, "dataset");
  assert.ok(reading.natal.chartMeta.calendar.trueSolarTime.correctionMinutes < -100);
});
