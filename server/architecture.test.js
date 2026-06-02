import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { calculateBazi } from "./core/bazi/calculateBazi.js";
import { getTenGod } from "./core/bazi/tenGods.js";
import { calculateYearInfluence } from "./core/liunian/calculateYearInfluence.js";
import { calculateMonthInfluence } from "./core/liunian/calculateMonthInfluence.js";
import { ruleEngine } from "./core/rules/ruleEngine.js";
import { generateStoryTags } from "./core/story/generateStoryTags.js";
import { buildNarrativePrompt } from "./core/story/buildNarrativePrompt.js";
import { createAiProvider } from "./core/ai/aiProvider.js";
import { loadJson } from "./utils/jsonLoader.js";
import { formatLunarDate, lunarToSolar, solarToLunar } from "./utils/lunarCalendar.js";

const requiredPaths = [
  "index.html",
  "styles/main.css",
  "js/app.js",
  "js/app.bundle.js",
  "js/apiClient.js",
  "js/locationData.js",
  "js/lunarCalendar.js",
  "js/components/birthForm.js",
  "js/components/chartSummary.js",
  "js/components/yearStoryPanel.js",
  "js/components/monthTimeline.js",
  "js/components/aiNarrativePanel.js",
  "js/components/debugPanel.js",
  "server/server.js",
  "server/core/bazi/calculateBazi.js",
  "server/core/bazi/pillarMath.js",
  "server/core/bazi/tenGods.js",
  "server/core/bazi/fiveElements.js",
  "server/core/bazi/luckCycles.js",
  "server/core/ziwei/calculateZiwei.js",
  "server/core/ziwei/palaces.js",
  "server/core/ziwei/transformations.js",
  "server/core/liunian/calculateYearInfluence.js",
  "server/core/liunian/calculateMonthInfluence.js",
  "server/core/rules/ruleEngine.js",
  "server/core/rules/matchRules.js",
  "server/core/story/generateStoryTags.js",
  "server/core/story/buildNarrativePrompt.js",
  "server/core/story/storyToneConfig.js",
  "server/core/ai/aiProvider.js",
  "server/core/ai/mockProvider.js",
  "server/core/ai/deepseekProvider.js",
  "server/core/ai/ollamaProvider.js",
  "server/core/ai/openaiProvider.js",
  "server/core/ai/geminiProvider.js",
  "server/utils/jsonLoader.js",
  "server/utils/response.js",
  "server/utils/logger.js",
  "server/utils/dateUtils.js",
  "server/utils/lunarCalendar.js",
  "data/rules/bazi/base-personality.json",
  "data/rules/bazi/relationship.json",
  "data/rules/bazi/career.json",
  "data/rules/bazi/wealth.json",
  "data/rules/bazi/liunian.json",
  "data/rules/bazi/liuyue.json",
  "data/rules/ziwei/palace-rules.json",
  "data/rules/ziwei/sihua-rules.json",
  "data/rules/ziwei/relationship-rules.json",
  "data/story-templates/year-themes.json",
  "data/story-templates/month-roles.json",
  "data/story-templates/relationship-stories.json",
  "data/story-templates/career-stories.json",
  "data/story-templates/wealth-stories.json",
  "data/mock/mock-chart.json",
  "data/mock/mock-year-story-tags.json",
  "data/mock/mock-ai-response.json",
  "config/ai-config.json",
  "README.md",
];

test("project exposes the requested fortune-ai architecture", () => {
  for (const filePath of requiredPaths) {
    assert.equal(existsSync(filePath), true, `${filePath} should exist`);
  }
  assert.equal(existsSync("src"), false, "legacy src directory should be removed");
});

test("local engines build chart, rules, story tags, prompt, and mock narrative without model-side divination", async () => {
  const input = {
    name: "测试用户",
    birthDate: "1992-08-18",
    birthTime: "14:30",
    gender: "female",
    targetYear: 2026,
  };
  const chart = calculateBazi(input);
  const yearInfluence = calculateYearInfluence({ chart, targetYear: 2026 });
  const monthInfluences = Array.from({ length: 12 }, (_, index) =>
    calculateMonthInfluence({ chart, targetYear: 2026, month: index + 1 }),
  );
  const matchedRules = ruleEngine({ chart, yearInfluence, monthInfluences });
  const storyTags = generateStoryTags({ chart, yearInfluence, monthInfluences, matchedRules });
  const prompt = buildNarrativePrompt({ chart, yearInfluence, monthInfluences, storyTags });
  const provider = createAiProvider({ provider: "mock" });
  const narrative = await provider.generate({ prompt, storyTags });

  assert.match(chart.pillars.day.label, /^[甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥]$/);
  assert.equal(chart.meta.engine, "birth-chart-engine");
  assert.equal(yearInfluence.year, 2026);
  assert.equal(monthInfluences.length, 12);
  assert.ok(matchedRules.length > 0);
  assert.ok(storyTags.some((tag) => tag.period === "year"));
  assert.match(prompt.system, /不能重新排盘/);
  assert.match(prompt.user, /storyTags/);
  assert.equal(narrative.provider, "mock");
  assert.ok(narrative.text.includes("年度主线"));
  assert.doesNotMatch(narrative.text, /一定|必定|绝对|必然|必离婚|必发财|必有灾|必坐牢|必死亡/);
  assert.doesNotMatch(JSON.stringify({ chart, matchedRules, storyTags }), /一定|必定|绝对|必然|必离婚|必发财|必有灾|必坐牢|必死亡/);
});

test("bazi engine keeps migrated chart behavior from the previous page", () => {
  const common = { gender: "female" };
  const newYearDay = calculateBazi({
    ...common,
    birthDate: "2000-01-01",
    birthTime: "14:30",
  });
  assert.equal(newYearDay.pillars.year.label, "己卯");
  assert.equal(newYearDay.pillars.month.label, "丙子");
  assert.equal(newYearDay.pillars.day.label, "戊午");
  assert.equal(newYearDay.pillars.hour.label, "己未");

  const beforeLichun = calculateBazi({
    ...common,
    birthDate: "2024-02-04",
    birthTime: "10:00",
  });
  const afterLichun = calculateBazi({
    ...common,
    birthDate: "2024-02-04",
    birthTime: "17:00",
  });
  assert.equal(beforeLichun.pillars.year.label, "癸卯");
  assert.equal(beforeLichun.pillars.month.label, "乙丑");
  assert.equal(afterLichun.pillars.year.label, "甲辰");
  assert.equal(afterLichun.pillars.month.label, "丙寅");

  const beforeJingzhe = calculateBazi({
    ...common,
    birthDate: "2024-03-05",
    birthTime: "09:00",
  });
  const afterJingzhe = calculateBazi({
    ...common,
    birthDate: "2024-03-05",
    birthTime: "11:00",
  });
  assert.equal(beforeJingzhe.pillars.month.label, "丙寅");
  assert.equal(afterJingzhe.pillars.month.label, "丁卯");
  assert.equal(afterJingzhe.pillars.month.meta.solarTerm, "惊蛰");
});

test("ten-god matrix keeps the expected full relationship map for Jia day master", () => {
  assert.deepEqual(
    Object.fromEntries(["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"].map((stem) => [
      stem,
      getTenGod("甲", stem),
    ])),
    {
      甲: "比肩",
      乙: "劫财",
      丙: "食神",
      丁: "伤官",
      戊: "偏财",
      己: "正财",
      庚: "七杀",
      辛: "正官",
      壬: "偏印",
      癸: "正印",
    },
  );
  assert.equal(getTenGod("甲", ""), "未知");
});

test("solar-term month branches keep the twelve monthly command sequence", () => {
  const monthCases = [
    ["2024-01-15", "丑", "小寒"],
    ["2024-02-15", "寅", "立春"],
    ["2024-03-15", "卯", "惊蛰"],
    ["2024-04-15", "辰", "清明"],
    ["2024-05-15", "巳", "立夏"],
    ["2024-06-15", "午", "芒种"],
    ["2024-07-15", "未", "小暑"],
    ["2024-08-15", "申", "立秋"],
    ["2024-09-15", "酉", "白露"],
    ["2024-10-15", "戌", "寒露"],
    ["2024-11-15", "亥", "立冬"],
    ["2024-12-15", "子", "大雪"],
  ];

  for (const [birthDate, branch, solarTerm] of monthCases) {
    const chart = calculateBazi({ birthDate, birthTime: "12:00", gender: "male" });
    assert.equal(chart.pillars.month.branch, branch, `${birthDate} should use ${branch} month`);
    assert.equal(chart.pillars.month.meta.solarTerm, solarTerm);
  }
});

test("luck-cycle direction follows gender and year-stem yin-yang rules", () => {
  const yangYearMale = calculateBazi({ birthDate: "1984-03-01", birthTime: "12:00", gender: "male" });
  const yangYearFemale = calculateBazi({ birthDate: "1984-03-01", birthTime: "12:00", gender: "female" });
  const yinYearMale = calculateBazi({ birthDate: "1985-03-01", birthTime: "12:00", gender: "male" });
  const yinYearFemale = calculateBazi({ birthDate: "1985-03-01", birthTime: "12:00", gender: "female" });

  assert.equal(yangYearMale.pillars.year.label, "甲子");
  assert.equal(yangYearMale.luckCycles.direction, "forward");
  assert.equal(yangYearFemale.luckCycles.direction, "reverse");
  assert.equal(yinYearMale.pillars.year.label, "乙丑");
  assert.equal(yinYearMale.luckCycles.direction, "reverse");
  assert.equal(yinYearFemale.luckCycles.direction, "forward");
});

test("default chart keeps stable pillars, symbolic fields, and luck cycles", () => {
  const chart = calculateBazi({
    birthDate: "1949-10-01",
    birthTime: "00:00",
    gender: "male",
    birthplace: "北京",
  });
  assert.deepEqual(
    Object.fromEntries(Object.entries(chart.pillars).map(([key, pillar]) => [key, pillar.label])),
    {
      year: "己丑",
      month: "癸酉",
      day: "甲子",
      hour: "甲子",
    },
  );
  assert.deepEqual(chart.tenGods.year, { stem: "正财", branch: "正财" });
  assert.deepEqual(chart.tenGods.month, { stem: "正印", branch: "正官" });
  assert.deepEqual(chart.tenGods.day, { stem: "日主", branch: "正印" });
  assert.deepEqual(chart.tenGods.hour, { stem: "比肩", branch: "正印" });
  assert.deepEqual(
    Object.fromEntries(Object.entries(chart.pillarDetails).map(([key, detail]) => [key, detail.nayin])),
    {
      year: "霹雳火",
      month: "剑锋金",
      day: "海中金",
      hour: "海中金",
    },
  );
  assert.deepEqual(
    Object.fromEntries(Object.entries(chart.pillarDetails).map(([key, detail]) => [key, detail.twelveGrowth])),
    {
      year: "冠带",
      month: "胎",
      day: "沐浴",
      hour: "沐浴",
    },
  );
  assert.deepEqual(
    Object.fromEntries(Object.entries(chart.pillarDetails).map(([key, detail]) => [key, detail.voidBranches])),
    {
      year: ["午", "未"],
      month: ["戌", "亥"],
      day: ["戌", "亥"],
      hour: ["戌", "亥"],
    },
  );
  assert.equal(chart.luckCycles.direction, "reverse");
  assert.deepEqual(
    chart.luckCycles.pillars.slice(0, 3).map((pillar) => `${pillar.label} ${pillar.startYear}-${pillar.endYear}`),
    ["壬申 1957-1966", "辛未 1967-1976", "庚午 1977-1986"],
  );
});

test("relation extraction includes six-harm observations in the local chart engine", () => {
  const chart = calculateBazi({
    birthDate: "2000-01-01",
    birthTime: "14:30",
    gender: "female",
  });
  const sixHarmHit = chart.relations.find(
    (relation) => relation.type === "地支六害" && relation.members.join("") === "子未",
  );

  assert.ok(sixHarmHit);
  assert.equal(sixHarmHit.effect, "害");
  assert.match(sixHarmHit.evidence, /月柱丙子 与 时柱己未/);
  assert.equal(sixHarmHit.confidence, "medium");
  assert.deepEqual(sixHarmHit.needVerify, ["干支关系为结构观察点，需要结合柱位与岁运继续验证。"]);
});

test("local chart, transit, and story outputs keep evidence confidence and verification fields", () => {
  const chart = calculateBazi({
    birthDate: "1992-08-18",
    birthTime: "14:30",
    gender: "female",
    birthplace: "北京",
  });
  const yearInfluence = calculateYearInfluence({ chart, targetYear: 2026 });
  const monthInfluences = Array.from({ length: 12 }, (_, index) =>
    calculateMonthInfluence({ chart, targetYear: 2026, month: index + 1 }),
  );
  const matchedRules = ruleEngine({ chart, yearInfluence, monthInfluences });
  const storyTags = generateStoryTags({ chart, yearInfluence, monthInfluences, matchedRules });

  assertSignalContract(chart.meta, "chart meta");
  assertSignalContract(chart.luckCycles, "luck cycles");
  assertSignalContract(yearInfluence, "year influence");
  for (const monthInfluence of monthInfluences) {
    assertSignalContract(monthInfluence, `month ${monthInfluence.month}`);
  }
  for (const relationHit of yearInfluence.relationHits) {
    assertSignalContract(relationHit, `year relation ${relationHit.type}`);
  }
  for (const relation of chart.relations) {
    assertSignalContract(relation, `relation ${relation.type}`);
  }
  for (const tag of storyTags) {
    assertSignalContract(tag, `story tag ${tag.tag}`);
  }
});

test("bazi engine keeps late-zi and true-solar-time behavior", () => {
  const beforeLateZi = calculateBazi({
    birthDate: "2000-01-01",
    birthTime: "22:59",
  });
  const lateZi = calculateBazi({
    birthDate: "2000-01-01",
    birthTime: "23:00",
  });
  assert.equal(beforeLateZi.pillars.day.label, "戊午");
  assert.equal(beforeLateZi.pillars.hour.label, "癸亥");
  assert.equal(beforeLateZi.meta.calendar.dayPillarDate, "2000-01-01");
  assert.equal(lateZi.pillars.day.label, "己未");
  assert.equal(lateZi.pillars.hour.label, "甲子");
  assert.equal(lateZi.meta.calendar.dayPillarDate, "2000-01-02");

  const urumqi = calculateBazi({
    birthDate: "1992-08-18",
    birthTime: "00:30",
    birthplace: "乌鲁木齐",
    trueSolarTime: true,
  });
  assert.equal(urumqi.meta.calendar.solarDate, "1992-08-17");
  assert.equal(urumqi.pillars.day.label, "乙丑");
  assert.equal(urumqi.pillars.hour.label, "丁亥");
});

test("date settings support lunar conversion and lunar chart input", () => {
  assert.deepEqual(solarToLunar("1992-08-18"), {
    year: 1992,
    month: 7,
    day: 20,
    isLeapMonth: false,
  });
  assert.equal(lunarToSolar({ year: 1992, month: 7, day: 20 }), "1992-08-18");
  assert.equal(formatLunarDate({ year: 1992, month: 7, day: 20 }), "农历壬申年七月二十");

  const solarChart = calculateBazi({
    birthDate: "1992-08-18",
    birthTime: "14:30",
    gender: "female",
  });
  const lunarChart = calculateBazi({
    calendarType: "lunar",
    lunarYear: 1992,
    lunarMonth: 7,
    lunarDay: 20,
    lunarLeapMonth: false,
    birthTime: "14:30",
    gender: "female",
  });
  assert.deepEqual(
    Object.fromEntries(Object.entries(lunarChart.pillars).map(([key, pillar]) => [key, pillar.label])),
    Object.fromEntries(Object.entries(solarChart.pillars).map(([key, pillar]) => [key, pillar.label])),
  );
  assert.equal(lunarChart.calendar.lunarDate, "农历壬申年七月二十");
});

test("static index bundle keeps old birth settings data and linkage fields", () => {
  global.window = {};
  const locationScript = readFileSync("js/locationData.js", "utf8");
  Function(locationScript)();
  const index = readFileSync("index.html", "utf8");
  const bundle = readFileSync("js/app.bundle.js", "utf8");
  const styles = readFileSync("styles/main.css", "utf8");

  assert.equal(global.window.FortuneLocationData.cities.length, 3337);
  assert.ok(index.indexOf('id="coreSignals"') < index.indexOf('id="monthTimeline"'));
  assert.equal(bundle.includes("<span>解读年份</span>"), false);
  assert.equal(bundle.includes("<span>解读月份</span>"), false);
  assert.match(bundle, /birthProvince/);
  assert.match(bundle, /resolveLocation\(input\)/);
  assert.match(bundle, /rerenderSettingsOnly\(\)/);
  assert.doesNotMatch(bundle, /bindChange\("birthTime",[\s\S]*?refresh\(\)/);
  assert.match(bundle, /function monthNumberFromLunarLabel/);
  assert.match(bundle, /function parseLunarDayValue/);
  assert.match(bundle, /lunar\.year \?\? lunar\.lunarYear/);
  assert.ok(bundle.indexOf("1. 先选大运") < bundle.indexOf("2. 再看该大运内的流年"));
  assert.match(bundle, /2\. 再看该大运内的流年[\s\S]*renderTransitSignals\(data\.transitSignals\)[\s\S]*4\. 最后细看流月/);
  assert.match(bundle, /3\. 大运流年取象/);
  assert.match(bundle, /4\. 最后细看流月[\s\S]*renderMonthSignals\(data\.monthSignals\)/);
  assert.match(bundle, /5\. 流月取象/);
  assert.match(bundle, /selectedLuck\.startYear \+ i/);
  assert.match(bundle, /function buildCoreSignals/);
  assert.match(bundle, /engine: "coreSignalsEngine"/);
  assert.match(bundle, /function buildTransitSignals/);
  assert.match(bundle, /function buildMonthSignals/);
  assert.match(bundle, /engine: "transitSignalEngine"/);
  assert.match(bundle, /流年关系触发为观察信号/);
  assert.match(bundle, /renderTransitSignals\(data\.transitSignals\)/);
  assert.match(bundle, /renderMonthSignals\(data\.monthSignals\)/);
  assert.match(bundle, /renderCoreSignals\(data\)/);
  assert.match(bundle, /evidence/);
  assert.match(bundle, /needVerify/);
  assert.equal(index.includes("AI"), false);
  assert.equal(bundle.includes("AI 叙事层"), false);
  assert.equal(bundle.includes("调试 JSON"), false);
  assert.equal(bundle.includes("可直接打开 index.html"), false);
  assert.match(bundle, /function confidenceLabel/);
  assert.match(bundle, /function providerLabel/);
  assert.match(bundle, /confidenceLabel\(signal\.confidence\)/);
  assert.doesNotMatch(bundle, /renderDebug[\s\S]*JSON\.stringify/);
  assert.match(bundle, /完整藏干十神/);
  assert.match(bundle, /最终排盘时间/);
  assert.match(bundle, /经度校正/);
  assert.match(bundle, /地支六害/);
  assert.match(bundle, /\["子", "未"\]/);
  assert.match(bundle, /\["丑", "午"\]/);
  assert.match(bundle, /\["寅", "巳"\]/);
  assert.match(bundle, /\["卯", "辰"\]/);
  assert.match(bundle, /\["申", "亥"\]/);
  assert.match(bundle, /\["酉", "戌"\]/);
  assert.match(bundle, /天干 \+ 地支本气统计/);
  assert.match(bundle, /完整藏干统计/);
  assert.doesNotMatch(bundle, /fire: "炎"/);
  assert.match(styles, /\.element-wood/);
  assert.match(styles, /\.element-fire/);
  assert.match(styles, /\.element-earth/);
  assert.match(styles, /\.element-metal/);
  assert.match(styles, /\.element-water/);
  assert.match(styles, /element-stats-box/);
  assert.match(styles, /\.core-tab-panel/);
  assert.match(styles, /\.relation-list article::before/);
  assert.match(styles, /\.compact-table/);
});

test("luck, year, and month transit engines use migrated local pillars", () => {
  const chart = calculateBazi({
    birthDate: "1998-09-11",
    birthTime: "00:30",
    birthplace: "定州",
    gender: "male",
    trueSolarTime: false,
  });
  assert.equal(chart.pillars.year.label, "戊寅");
  assert.equal(chart.pillars.month.label, "辛酉");
  assert.equal(chart.pillars.day.label, "辛酉");
  assert.equal(chart.pillars.hour.label, "戊子");
  assert.ok(chart.luckCycles.pillars.length >= 8);
  assert.ok(chart.luckCycles.startCalculation.boundaryName);
  assert.equal(chart.luckCycles.cycles[0].label, chart.luckCycles.pillars[0].label);

  const yearInfluence = calculateYearInfluence({ chart, targetYear: 2026 });
  const monthInfluence = calculateMonthInfluence({ chart, targetYear: 2026, month: 3 });
  assert.equal(yearInfluence.pillar.label, "丙午");
  assert.equal(monthInfluence.pillar.meta.solarTerm, "惊蛰");
});

test("year and month transit engines keep expected 2026 pillars for the default chart", () => {
  const chart = calculateBazi({
    birthDate: "1949-10-01",
    birthTime: "00:00",
    gender: "male",
    birthplace: "北京",
  });
  const yearInfluence = calculateYearInfluence({ chart, targetYear: 2026 });
  const monthPillars = Array.from({ length: 12 }, (_, index) =>
    calculateMonthInfluence({ chart, targetYear: 2026, month: index + 1 }).pillar.label,
  );

  assert.equal(yearInfluence.pillar.label, "丙午");
  assert.deepEqual(monthPillars, [
    "辛丑",
    "庚寅",
    "辛卯",
    "壬辰",
    "癸巳",
    "甲午",
    "乙未",
    "丙申",
    "丁酉",
    "戊戌",
    "己亥",
    "庚子",
  ]);
});

test("local json loader reads rule and mock data from project data folders", () => {
  const personalityRules = loadJson("data/rules/bazi/base-personality.json");
  const mockChart = loadJson("data/mock/mock-chart.json");

  assert.ok(Array.isArray(personalityRules.rules));
  assert.equal(mockChart.meta.engine, "birth-chart-engine");
});

function assertSignalContract(signal, label) {
  const evidence = Array.isArray(signal.evidence) ? signal.evidence : [signal.evidence].filter(Boolean);
  assert.ok(evidence.length > 0, `${label} should keep at least one evidence item`);
  assert.match(signal.confidence, /^(low|medium|high)$/, `${label} should use known confidence level`);
  assert.ok(Array.isArray(signal.needVerify), `${label} should expose needVerify array`);
  assert.ok(signal.needVerify.length > 0, `${label} should keep verification notes`);
}
