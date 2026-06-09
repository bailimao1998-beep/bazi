import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { calculateBazi } from "./core/bazi/calculateBazi.js";
import { getTenGod } from "./core/bazi/tenGods.js";
import { calculateYearInfluence } from "./core/liunian/calculateYearInfluence.js";
import { calculateMonthInfluence } from "./core/liunian/calculateMonthInfluence.js";
import { ruleEngine } from "./core/rules/ruleEngine.js";
import { analyzeFortuneYear } from "./core/fortune-engine/index.js";
import { buildEventCandidateScenarios, collectEventCandidatesFromSignals } from "./core/story/eventCandidates.js";
import { generateStoryTags } from "./core/story/generateStoryTags.js";
import { buildNarrativePrompt } from "./core/story/buildNarrativePrompt.js";
import { buildFlowNarrativePrompt } from "./core/story/buildNarrativePrompt.js";
import { buildChatPrompt, buildChatResponse, buildNarrative, sanitizeChatText } from "./server.js";
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
  "server/core/bazi/shensha.js",
  "server/core/ziwei/calculateZiwei.js",
  "server/core/ziwei/palaces.js",
  "server/core/ziwei/transformations.js",
  "server/core/liunian/calculateYearInfluence.js",
  "server/core/liunian/calculateMonthInfluence.js",
  "server/core/rules/ruleEngine.js",
  "server/core/rules/matchRules.js",
  "server/core/fortune-engine/index.js",
  "server/core/fortune-engine/natal-signature.js",
  "server/core/fortune-engine/decade-theme.js",
  "server/core/fortune-engine/year-trigger.js",
  "server/core/fortune-engine/month-trigger.js",
  "server/core/fortune-engine/event-score.js",
  "server/core/fortune-engine/narrative-builder.js",
  "server/core/story/eventCandidates.js",
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
  "data/rules/bazi/shensha.json",
  "data/rules/fortune-engine/ten-gods.json",
  "data/rules/fortune-engine/stem-branch-relations.json",
  "data/rules/fortune-engine/clash-combo-penalty.json",
  "data/rules/fortune-engine/event-tags.json",
  "data/rules/fortune-engine/narrative-templates.json",
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

test("flow AI modes build structured prompts and mock reports without model-side divination", async () => {
  const input = {
    name: "测试用户",
    birthDate: "1992-08-18",
    birthTime: "14:30",
    gender: "female",
    targetYear: 2030,
    selectedMonth: 6,
  };
  for (const mode of ["luck", "year", "month"]) {
    const result = await buildNarrative({ ...input, mode });
    assert.equal(result.aiMode, mode);
    assert.equal(result.narrative.provider, "deepseek");
    assert.equal(typeof result.narrative.report.summary, "string");
    assert.ok(Array.isArray(result.narrative.report.keySignals));
    assert.ok(Array.isArray(result.narrative.report.likelyThemes));
    assert.ok(Array.isArray(result.narrative.report.cautions));
    assert.ok(Array.isArray(result.narrative.report.verificationLimits));
    assert.ok(Array.isArray(result.narrative.report.scenarios));
    assert.ok(result.narrative.report.scenarios.length >= 2);
    for (const scenario of result.narrative.report.scenarios) {
      assert.equal(typeof scenario.title, "string");
      assert.ok(Array.isArray(scenario.evidence));
      assert.ok(Array.isArray(scenario.lifeSignals));
      assert.ok(Array.isArray(scenario.verification));
      assert.equal(typeof scenario.boundary, "string");
      assert.match(scenario.boundary, /不能单独作为结论/);
    }
    assert.doesNotMatch(JSON.stringify(result.narrative.report), /一定|必定|绝对|必然|必离婚|必发财|必有灾|必坐牢|必死亡/);
  }

  const chart = calculateBazi(input);
  const yearInfluence = calculateYearInfluence({ chart, targetYear: 2030 });
  const monthInfluences = Array.from({ length: 12 }, (_, index) =>
    calculateMonthInfluence({ chart, targetYear: 2030, month: index + 1 }),
  );
  const prompt = buildFlowNarrativePrompt({
    mode: "year",
    chart,
    coreSignals: { groups: [] },
    transitSignals: { groups: [] },
    monthSignals: { groups: [] },
    selectedLuck: chart.luckCycles.pillars[0],
    yearInfluence,
    selectedMonthInfluence: monthInfluences[5],
  });
  assert.match(prompt.system, /不能重新排盘/);
  assert.match(prompt.system, /不能补充不存在的干支关系/);
  assert.match(prompt.system, /禁止确定性断语/);
  assert.match(prompt.system, /不能单独作为结论/);
  assert.match(prompt.system, /咨询型语言/);
  assert.match(prompt.system, /专业证据链/);
  assert.match(prompt.system, /证据链 -> 生活翻译 -> 验证步骤/);
  assert.match(prompt.system, /多候选方向/);
  assert.match(prompt.system, /证据链/);
  assert.match(prompt.system, /生活落点/);
  assert.match(prompt.system, /验证条件/);
  assert.match(prompt.system, /边界/);
  assert.match(JSON.stringify(prompt.schema), /scenarios/);
  assert.match(JSON.stringify(prompt.schema), /lifeSignals/);
  assert.match(prompt.user, /"mode": "year"/);
  assert.match(prompt.user, /transitSignals/);
  assert.match(prompt.user, /3-5 个年度触发候选/);
  assert.match(prompt.user, /候选方向/);
  assert.match(prompt.user, /验证条件/);
  assert.match(prompt.user, /咨询总览/);
  assert.match(prompt.user, /专业证据链/);
  assert.match(prompt.user, /现实验证/);
});

test("event candidate scenarios translate actual signal matrices into concrete observables", () => {
  const report = buildEventCandidateScenarios({
    mode: "year",
    signals: {
      groups: [
        {
          title: "十神与五行触发",
          signals: [
            {
              title: "流年十神",
              evidence: "2026年丙午：天干正官，地支主气七杀",
              keywords: "流年十神 / 正官、七杀",
              realLifeMeaning: "现实中可观察当年学习、表达、资源、规则、人际竞争等主题是否被放大。",
              caution: "流年十神不能直接断结果，要看是否与原局和大运形成承接或冲突。",
            },
            {
              title: "流年冲",
              evidence: "流年丙午 与 月柱壬子 命中子、午",
              keywords: "流年-月柱 / 子午 / 位置变化",
              realLifeMeaning: "现实中可观察相关主题是否出现变动、调整、冲突或需要重新安排。",
              caution: "冲的轻重需要结合柱位、原局强弱、大运背景和流月是否继续触发。",
            },
          ],
        },
      ],
    },
  });

  assert.ok(report.scenarios.length >= 2);
  const text = JSON.stringify(report);
  assert.match(text, /候选事象/);
  assert.match(text, /职责变化|流程合规|合同手续复核/);
  assert.match(text, /搬动|出行|重新安排/);
  assert.match(text, /作息体感|出行操作安全|流程合规/);
  assert.match(text, /不能单独作为结论/);
  assert.doesNotMatch(text, /现实事务、关系互动、工作节奏、情绪状态/);

  const candidates = collectEventCandidatesFromSignals(report.scenarios);
  assert.ok(candidates.some((item) => item.includes("候选事象")));
});

test("fortune-engine links natal, decade, year, and month into structured trigger chains", async () => {
  const input = {
    birthDate: "1949-10-01",
    birthTime: "00:00",
    birthplace: "北京",
    gender: "male",
    targetYear: 2026,
    selectedMonth: 1,
  };
  const chart = calculateBazi(input);
  const selectedLuck = chart.luckCycles.pillars.find((pillar) => input.targetYear >= pillar.startYear && input.targetYear <= pillar.endYear);
  const yearInfluence = calculateYearInfluence({ chart, targetYear: input.targetYear });
  const monthInfluences = Array.from({ length: 12 }, (_, index) =>
    calculateMonthInfluence({ chart, targetYear: input.targetYear, month: index + 1 }),
  );

  const result = analyzeFortuneYear({ chart, selectedLuck, yearInfluence, monthInfluences });

  assert.equal(result.year, 2026);
  assert.ok(result.natalSignature.natalTags.length > 0);
  assert.ok(result.natalSignature.riskAreas.length > 0);
  assert.ok(Array.isArray(result.natalSignature.usefulElements));
  assert.ok(Array.isArray(result.natalSignature.avoidElements));
  assert.match(result.decadeTheme, /增强原局|补足原局|放大原局问题/);
  assert.equal(typeof result.decadeSupportScore, "number");
  assert.ok(result.triggerChains.some((chain) => chain.chain.includes("原局") && chain.chain.includes("大运") && chain.chain.includes("流年")));
  assert.ok(result.triggerChains.some((chain) => /流年天干十神|流年地支十神|伏吟|反吟|岁运并临|夫妻|财帛|官禄|迁移/.test(chain.reason)));
  assert.ok(result.monthlyHighlights.length > 0);
  assert.ok(result.monthlyHighlights.length < 12);
  assert.ok(result.monthlyHighlights.every((item) => /high|medium|low/.test(item.intensity)));
  for (const score of Object.values(result.eventScores)) {
    assert.equal(typeof score.score, "number");
    assert.ok(score.evidence.length > 0);
  }
  assert.ok(result.overallSummary.includes("命理依据"));
  assert.ok(result.overallSummary.includes("现实表现"));
  assert.ok(result.advice.length > 0);

  const narrativeText = JSON.stringify(result.narrative);
  assert.match(narrativeText, /结论/);
  assert.match(narrativeText, /命理依据/);
  assert.match(narrativeText, /现实表现/);
  assert.match(narrativeText, /注意事项/);

  const response = await buildNarrative(input);
  assert.equal(response.fortuneAnalysis.year, 2026);
  assert.deepEqual(Object.keys(response.fortuneAnalysis.eventScores), ["career", "wealth", "relationship", "study", "health", "movement", "social"]);
});

test("fortune-engine rules keep required rule contract", () => {
  const files = [
    "data/rules/fortune-engine/ten-gods.json",
    "data/rules/fortune-engine/stem-branch-relations.json",
    "data/rules/fortune-engine/clash-combo-penalty.json",
    "data/rules/fortune-engine/event-tags.json",
    "data/rules/fortune-engine/narrative-templates.json",
  ];
  for (const file of files) {
    const data = loadJson(file);
    const rules = data.rules ?? data.templates;
    assert.ok(Array.isArray(rules), `${file} should expose rules/templates array`);
    for (const rule of rules) {
      assert.ok(rule.id, `${file} rule should include id`);
      assert.ok(rule.condition, `${file} rule should include condition`);
      assert.ok(Array.isArray(rule.tags), `${file} rule should include tags`);
      assert.equal(typeof rule.weight, "number", `${file} rule should include numeric weight`);
      assert.ok(rule.explanation, `${file} rule should include explanation`);
      assert.ok(rule.realityMapping, `${file} rule should include realityMapping`);
      assert.ok(rule.caution, `${file} rule should include caution`);
    }
  }
});

test("chat prompt and fallback keep AI answers learning-oriented without leaking keys", async () => {
  const context = {
    chart: { pillars: { day: { label: "甲子" } } },
    coreSignals: { groups: [{ title: "核心", signals: [{ title: "日主观察" }] }] },
    transitSignals: { groups: [] },
    monthSignals: { groups: [] },
    selectedLuck: { label: "乙丑" },
    yearInfluence: { year: 2026, pillar: { label: "丙午" } },
    selectedMonthInfluence: { month: 6, pillar: { label: "甲午" } },
    storyTags: [{ tag: "年度主线" }],
  };
  const prompt = buildChatPrompt({
    question: "这个月适合观察什么？",
    history: [{ role: "user", content: "上一问" }],
    state: { targetYear: 2026, selectedMonth: 6, deepseekApiKey: "sk-test-should-not-leak" },
    context,
  });

  assert.match(prompt.system, /结构化学习/);
  assert.match(prompt.system, /不能重新排盘/);
  assert.match(prompt.system, /不能单独作为结论/);
  assert.match(prompt.user, /这个月适合观察什么/);
  assert.match(prompt.user, /selectedLuck/);
  assert.doesNotMatch(prompt.user, /sk-test-should-not-leak/);

  const sanitized = sanitizeChatText("这件事一定会发生，必发财。");
  assert.equal(sanitized.filtered, true);
  assert.doesNotMatch(sanitized.text, /一定|必发财/);

  const response = await buildChatResponse(
    { question: "流年怎么看？", context },
    { provider: "openai", openai: { apiKey: "" } },
  );
  assert.equal(response.provider, "local-chat");
  assert.match(response.text, /候选信号/);
  assert.match(response.text, /不能单独作为结论/);
  assert.doesNotMatch(response.text, /一定|必定|绝对|必然|必离婚|必发财|必有灾|必坐牢|必死亡/);
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
  assert.match(sixHarmHit.evidence, /牵连|合绊|互动/);
  assert.equal(sixHarmHit.confidence, "medium");
  assert.deepEqual(sixHarmHit.needVerify, ["干支关系只作为结构观察点，具体作用需要结合柱位、月令、透干、根气与岁运验证。"]);
});

test("shensha engine exposes learning-only auxiliary observations", () => {
  const chart = calculateBazi({
    birthDate: "1990-08-28",
    birthTime: "12:00",
    gender: "male",
  });
  const hitNames = chart.shensha.items.map((item) => item.name);

  assertSignalContract(chart.shensha.meta, "shensha meta");
  for (const item of chart.shensha.items) {
    assertSignalContract(item, `shensha ${item.name}`);
    assert.equal(typeof item.category, "string");
    assert.equal(typeof item.sourceBasis, "string");
    assert.equal(typeof item.learningNote, "string");
    assert.equal(typeof item.typicalMeaning, "string");
    assert.ok(Array.isArray(item.matchedPillars));
    assert.ok(item.matchedPillars.length > 0);
    assert.doesNotMatch(JSON.stringify(item), /一定|必定|绝对|必然|必离婚|必发财|必有灾|必坐牢|必死亡/);
  }
  for (const name of ["天乙贵人", "桃花", "驿马", "华盖", "文昌"]) {
    assert.ok(hitNames.includes(name), `${name} should be calculated`);
  }
  assert.ok(chart.pillarDetails.year.shensha.length > 0);
  assert.ok(chart.shensha.summary.some((item) => item.category === "贵人助力"));
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
  assertSignalContract(chart.shensha.meta, "shensha meta");
  for (const item of chart.shensha.items) {
    assertSignalContract(item, `shensha ${item.name}`);
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
  const serverSource = readFileSync("server/server.js", "utf8");

  assert.equal(global.window.FortuneLocationData.cities.length, 3337);
  assert.ok(index.indexOf('id="coreSignals"') < index.indexOf('id="monthTimeline"'));
  assert.equal(index.includes('id="aiNarrative"'), false);
  assert.equal(index.includes('id="debugPanel"'), false);
  assert.equal(bundle.includes("<span>解读年份</span>"), false);
  assert.equal(bundle.includes("<span>解读月份</span>"), false);
  assert.match(bundle, /name="defaultAiYear"/);
  assert.match(bundle, /默认 AI 分析年份/);
  assert.match(bundle, /function triggerInitialFlowAiReports/);
  assert.match(bundle, /triggerInitialFlowAiReports\(\["luck", "year"\]/);
  assert.doesNotMatch(bundle, /triggerInitialFlowAiReports\(\["luck", "year", "month"\]\)/);
  assert.match(bundle, /birthProvince/);
  assert.match(bundle, /resolveLocation\(input\)/);
  assert.match(bundle, /rerenderSettingsOnly\(\)/);
  assert.doesNotMatch(bundle, /bindChange\("birthTime",[\s\S]*?refresh\(\)/);
  assert.match(bundle, /function monthNumberFromLunarLabel/);
  assert.match(bundle, /function parseLunarDayValue/);
  assert.match(bundle, /lunar\.year \?\? lunar\.lunarYear/);
  assert.ok(bundle.indexOf("1. 先选大运") < bundle.indexOf("2. 再看该大运内的流年"));
  assert.match(bundle, /function renderNatalMiniChart/);
  assert.match(bundle, /原局对照/);
  assert.match(bundle, /renderNatalMiniChart\(data\.chart\)[\s\S]*1\. 先选大运/);
  assert.match(bundle, /1\. 先选大运[\s\S]*renderFlowAiStage\("luck"[\s\S]*2\. 再看该大运内的流年/);
  assert.match(bundle, /2\. 再看该大运内的流年[\s\S]*renderFlowAiStage\("year"[\s\S]*renderTransitSignals\(data\.transitSignals, data\)[\s\S]*4\. 最后细看流月/);
  assert.match(bundle, /3\. 大运流年取象证据库/);
  assert.match(bundle, /4\. 最后细看流月[\s\S]*renderFlowAiStage\("month"[\s\S]*renderMonthSignals\(data\.monthSignals, data\)/);
  assert.match(bundle, /5\. 流月取象证据库/);
  assert.doesNotMatch(bundle, /renderFlowAiControls\(\["year", "month", "luck"\]\)/);
  assert.doesNotMatch(bundle, /story-card below/);
  assert.doesNotMatch(bundle, /月度窗口/);
  assert.match(bundle, /renderYearEvidence\(data\)/);
  assert.match(bundle, /renderMonthEvidence\(data\)/);
  assert.match(bundle, /selectedLuck\.startYear \+ i/);
  assert.match(bundle, /function buildCoreSignals/);
  assert.match(bundle, /engine: "coreSignalsEngine"/);
  assert.match(bundle, /function buildTransitSignals/);
  assert.match(bundle, /function buildMonthSignals/);
  assert.match(bundle, /function renderFlowSignalMatrix/);
  assert.match(bundle, /function renderFlowSignalRow/);
  assert.match(bundle, /function generateLuckReading/);
  assert.match(bundle, /function generateYearReading/);
  assert.match(bundle, /function generateTransitTenGodReadings/);
  assert.match(bundle, /function generateTransitElementReadings/);
  assert.match(bundle, /function generateTransitRelationReadings/);
  assert.match(bundle, /function generateTransitCoreHitReadings/);
  assert.match(bundle, /function generateMonthWindowReading/);
  assert.match(bundle, /function generateMonthLayerReading/);
  assert.match(bundle, /function generateMonthTenGodReading/);
  assert.match(bundle, /function generateMonthElementReading/);
  assert.match(bundle, /function generateMonthRelationReadings/);
  assert.match(bundle, /function generateMonthCoreHitReadings/);
  assert.match(bundle, /function requestFlowAiReport/);
  assert.match(bundle, /function renderFlowAiControls/);
  assert.match(bundle, /function renderFlowAiReport/);
  assert.match(bundle, /咨询总览/);
  assert.match(bundle, /专业证据链/);
  assert.match(bundle, /生活落点/);
  assert.match(bundle, /现实验证/);
  assert.match(bundle, /function renderFlowAiScenarios/);
  assert.match(bundle, /ai-scenario-card/);
  assert.match(bundle, /候选方向/);
  assert.match(bundle, /验证条件/);
  assert.match(bundle, /boundary/);
  assert.match(bundle, /function renderFlowAiStage/);
  assert.match(bundle, /data-ai-mode="luck"/);
  assert.match(bundle, /data-ai-mode="year"/);
  assert.match(bundle, /data-ai-mode="month"/);
  assert.match(bundle, /AI解读大运/);
  assert.match(bundle, /AI解读流年/);
  assert.match(bundle, /AI解读流月/);
  assert.match(bundle, /ai-report-panel/);
  assert.match(bundle, /function createLocalFlowAiReport/);
  assert.match(bundle, /function renderChatWidget/);
  assert.match(bundle, /function sendChatQuestion/);
  assert.match(bundle, /function requestChatAnswer/);
  assert.match(bundle, /function requestBrowserDeepseekChat/);
  assert.match(bundle, /function buildBrowserChatPrompt/);
  assert.match(bundle, /function typeChatAnswer/);
  assert.match(bundle, /function sanitizeChatAnswer/);
  assert.match(bundle, /function createLocalChatAnswer/);
  assert.match(bundle, /id="aiChatWidget"/);
  assert.match(bundle, /AI问答/);
  assert.match(bundle, /chatForbiddenWords/);
  assert.match(bundle, /\/api\/chat/);
  assert.match(styles, /chat-widget/);
  assert.match(styles, /typing-caret/);
  assert.match(index, /js\/local-deepseek-config\.local\.js/);
  assert.match(serverSource, /local-deepseek-config\.local\.js/);
  assert.match(serverSource, /response\.writeHead\(404\)/);
  assert.match(bundle, /function getBrowserDeepseekConfig/);
  assert.match(bundle, /function requestBrowserDeepseekReport/);
  assert.match(bundle, /function buildBrowserFlowAiPrompt/);
  assert.match(bundle, /DEEPSEEK_BROWSER_DIRECT/);
  assert.match(bundle, /response_format/);
  assert.match(bundle, /json_object/);
  assert.match(bundle, /window\.FortuneLocalAiConfig/);
  assert.match(bundle, /location\.protocol === "file:"/);
  assert.match(bundle, /文件模式：使用本地占位 AI 辅助取象/);
  assert.match(bundle, /engine: "transitSignalEngine"/);
  assert.match(bundle, /流年关系触发为观察信号/);
  assert.match(bundle, /renderTransitSignals\(data\.transitSignals, data\)/);
  assert.match(bundle, /renderMonthSignals\(data\.monthSignals, data\)/);
  assert.match(bundle, /renderCoreSignals\(data\)/);
  assert.match(bundle, /function renderFortuneAnalysis/);
  assert.match(bundle, /fortuneAnalysis/);
  assert.match(bundle, /年度总论/);
  assert.match(bundle, /大运如何影响这一年/);
  assert.match(bundle, /这一年被什么触发/);
  assert.match(bundle, /重点月份/);
  assert.match(bundle, /现实建议/);
  assert.doesNotMatch(bundle, /renderNarrative\(data\)/);
  assert.doesNotMatch(bundle, /renderDebug\(data\)/);
  assert.match(bundle, /evidence/);
  assert.match(bundle, /plainReading/);
  assert.match(bundle, /realLifeMeaning/);
  assert.match(bundle, /eventCandidates/);
  assert.match(bundle, /候选事象/);
  assert.match(bundle, /工作职责变化/);
  assert.match(bundle, /合同手续复核/);
  assert.match(bundle, /收支安排/);
  assert.match(bundle, /合作摩擦/);
  assert.match(bundle, /搬动出行/);
  assert.match(bundle, /作息体感/);
  assert.match(bundle, /流程合规/);
  assert.match(bundle, /出行操作安全/);
  assert.match(bundle, /caution/);
  assert.equal(index.includes("AI"), false);
  assert.equal(bundle.includes("AI 叙事层"), false);
  assert.equal(bundle.includes("调试 JSON"), false);
  assert.equal(bundle.includes("可直接打开 index.html"), false);
  assert.match(bundle, /function providerLabel/);
  assert.match(bundle, /function generateDayMasterReading/);
  assert.match(bundle, /function generateMonthCommandReading/);
  assert.match(bundle, /function generateElementReading/);
  assert.match(bundle, /function generateTenGodReading/);
  assert.match(bundle, /function generateStemBranchRelationReading/);
  assert.match(bundle, /function generateRootingReadings/);
  assert.match(bundle, /function generateVoidReadings/);
  assert.match(bundle, /function generateNayinReadings/);
  assert.match(bundle, /function generateGrowthReadings/);
  assert.match(bundle, /function generateAuxiliaryReadings/);
  assert.match(bundle, /function generateOverallReading/);
  assert.match(bundle, /一句话总览/);
  assert.match(bundle, /取象证据库/);
  assert.match(bundle, /details class="evidence-library"/);
  assert.match(bundle, /core-signal-matrix/);
  assert.match(bundle, /core-signal-row/);
  assert.match(bundle, /取象关键词/);
  assert.match(bundle, /展开解释/);
  assert.match(bundle, /岁运专业速览/);
  assert.match(bundle, /流月专业速览/);
  assert.match(bundle, /flow-signal-matrix/);
  assert.match(bundle, /flow-signal-row/);
  assert.match(bundle, /大运阶段背景/);
  assert.match(bundle, /流年年度触发/);
  assert.match(bundle, /流月短期窗口/);
  assert.match(bundle, /取象/);
  assert.match(bundle, /解释/);
  assert.match(bundle, /常用实务神煞/);
  assert.match(bundle, /魁罡/);
  assert.match(bundle, /阴差阳错/);
  assert.match(bundle, /天赦/);
  assert.match(bundle, /四废/);
  assert.match(bundle, /dayPillarLabel/);
  assert.match(bundle, /seasonDayPillar/);
  assert.match(bundle, /专业依据/);
  assert.match(bundle, /基础依据/);
  assert.match(bundle, /可取象/);
  assert.match(bundle, /关键结构/);
  assert.match(bundle, /需验证/);
  assert.match(bundle, /不能单断/);
  assert.match(bundle, /辅助取象/);
  assert.match(bundle, /藏干根气/);
  assert.match(bundle, /旬空/);
  assert.match(bundle, /纳音/);
  assert.match(bundle, /十二长生/);
  assert.match(bundle, /胎元/);
  assert.match(bundle, /命宫/);
  assert.match(bundle, /身宫/);
  assert.match(bundle, /取象边界/);
  assert.match(bundle, /const shenshaRules/);
  assert.match(bundle, /function buildShensha/);
  assert.match(bundle, /function renderShenshaStats/);
  assert.match(bundle, /function renderChartTopline/);
  assert.match(bundle, /function renderRelationOverview/);
  assert.match(bundle, /chart-topline/);
  assert.match(bundle, /chart-topline-primary/);
  assert.match(bundle, /element-bars/);
  assert.match(bundle, /topline-element-bar/);
  assert.match(bundle, /--level/);
  assert.match(bundle, /shensha-row/);
  assert.match(bundle, /pillar-shensha/);
  assert.match(bundle, /relation-overview/);
  assert.match(bundle, /relation-toggle-hint/);
  assert.match(bundle, /details class="relation-overview"/);
  assert.match(bundle, /details class="auxiliary-observation"/);
  assert.match(bundle, /神煞总表/);
  assert.match(bundle, /辅助观察项：神煞总表、纳音、十二长生、旬空/);
  assert.match(bundle, /details class="evidence-library"/);
  assert.match(bundle, /核心取象/);
  assert.match(bundle, /matrix-row hidden-row/);
  assert.doesNotMatch(bundle, /matrix-row aux-row/);
  assert.match(bundle, /月令代表出生环境、季节力量、命局大气候/);
  assert.match(bundle, /五行数量不等于喜忌/);
  assert.match(bundle, /是否成化/);
  assert.doesNotMatch(bundle, /中等/);
  assert.doesNotMatch(bundle, /合化土|合化金|合化水|合化木|合化火/);
  assert.doesNotMatch(bundle, /renderDebug[\s\S]*JSON\.stringify/);
  assert.match(bundle, /完整藏干十神/);
  assert.match(bundle, /最终排盘时间/);
  assert.match(bundle, /经度校正/);
  assert.doesNotMatch(bundle, /有观察点|暂未显出/);
  assert.match(bundle, /element-summary/);
  assert.match(bundle, /element-attribute/);
  assert.match(bundle, /属性倾向/);
  assert.match(bundle, /相对突出/);
  assert.match(bundle, /暂未出现|相对偏弱/);
  assert.match(bundle, /生发、条达、规划/);
  assert.match(bundle, /表达、热度、显化/);
  assert.match(bundle, /承载、稳定、转化/);
  assert.match(bundle, /规则、收敛、执行/);
  assert.match(bundle, /流动、信息、应变/);
  const chartSummary = readFileSync("js/components/chartSummary.js", "utf8");
  assert.match(chartSummary, /element-summary/);
  assert.match(chartSummary, /element-attribute/);
  assert.match(chartSummary, /属性倾向/);
  const openaiProvider = readFileSync("server/core/ai/openaiProvider.js", "utf8");
  assert.match(openaiProvider, /\/v1\/responses/);
  assert.match(openaiProvider, /json_schema/);
  assert.match(openaiProvider, /structured_bazi_flow_report/);
  assert.match(openaiProvider, /OPENAI_API_KEY/);
  const deepseekProvider = readFileSync("server/core/ai/deepseekProvider.js", "utf8");
  assert.match(deepseekProvider, /DEEPSEEK_API_KEY/);
  assert.match(deepseekProvider, /response_format/);
  assert.match(deepseekProvider, /json_object/);
  assert.match(deepseekProvider, /parseFlowReport/);
  assert.match(deepseekProvider, /deepseek-v4-flash/);
  const aiConfig = readFileSync("config/ai-config.json", "utf8");
  assert.match(aiConfig, /"provider": "deepseek"/);
  assert.match(aiConfig, /"model": "deepseek-v4-flash"/);
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

test("birth form makes initial AI interpretation opt-in", () => {
  const bundle = readFileSync("js/app.bundle.js", "utf8");
  const birthForm = readFileSync("js/components/birthForm.js", "utf8");

  assert.match(bundle, /name="preInterpretAi"/);
  assert.match(bundle, /AI 预先解读/);
  assert.match(bundle, /preInterpretAi: false/);
  assert.match(bundle, /triggerInitialFlowAiReports\(\["luck", "year"\], \{ reveal: true \}\)/);
  assert.match(bundle, /function revealFlowAiReports/);
  assert.match(bundle, /\.ai-report-panel/);

  assert.match(birthForm, /name="preInterpretAi"/);
  assert.match(birthForm, /AI 预先解读/);
  assert.match(birthForm, /preInterpretAi: Boolean\(initialValue\.preInterpretAi\)/);
});

test("local server can use ignored DeepSeek config without serving it to the browser", () => {
  const serverSource = readFileSync("server/server.js", "utf8");

  assert.match(serverSource, /function loadLocalAiProviderOptions/);
  assert.match(serverSource, /buildNarrative\(input, loadLocalAiProviderOptions\(\)\)/);
  assert.match(serverSource, /buildChatResponse\(input, loadLocalAiProviderOptions\(\)\)/);
  assert.match(serverSource, /normalized === "\/js\/local-deepseek-config\.local\.js"/);
  assert.match(serverSource, /response\.writeHead\(404\)/);
  assert.doesNotMatch(serverSource, /deepseekApiKey:\s*["']sk-/);
});

function assertSignalContract(signal, label) {
  const evidence = Array.isArray(signal.evidence) ? signal.evidence : [signal.evidence].filter(Boolean);
  assert.ok(evidence.length > 0, `${label} should keep at least one evidence item`);
  assert.match(signal.confidence, /^(low|medium|high)$/, `${label} should use known confidence level`);
  assert.ok(Array.isArray(signal.needVerify), `${label} should expose needVerify array`);
  assert.ok(signal.needVerify.length > 0, `${label} should keep verification notes`);
}
