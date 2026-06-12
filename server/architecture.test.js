import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { calculateBazi } from "./core/bazi/calculateBazi.js";
import { branchMainStem, getTenGod } from "./core/bazi/tenGods.js";
import { calculateYearInfluence } from "./core/liunian/calculateYearInfluence.js";
import { calculateMonthInfluence } from "./core/liunian/calculateMonthInfluence.js";
import { ruleEngine } from "./core/rules/ruleEngine.js";
import { matchRules } from "./core/rules/matchRules.js";
import { analyzeFortuneYear } from "./core/fortune-engine/index.js";
import { buildAnnualEventReport } from "./core/fortune/buildAnnualEventReport.js";
import { buildEvidenceReport } from "./core/evidence/buildEvidenceReport.js";
import { buildEventCandidateScenarios, buildReadableAiReportFromPrompt, collectEventCandidatesFromSignals } from "./core/story/eventCandidates.js";
import { generateStoryTags } from "./core/story/generateStoryTags.js";
import { buildNarrativePrompt, flowReportSchema } from "./core/story/buildNarrativePrompt.js";
import { buildFlowNarrativePrompt } from "./core/story/buildNarrativePrompt.js";
import { buildChatPrompt } from "./prompts/chatPromptBuilder.js";
import { sanitizeChatText } from "./security/outputSanitizer.js";
import { buildChatResponse } from "./services/chatService.js";
import { buildNarrative } from "./services/narrativeService.js";
import { createAppServer } from "./server.js";
import { buildProviderOptionsFromAiSettings, readAiSettings, saveAiSettings } from "./config/aiSettingsStore.js";
import { loadLocalAiProviderOptions } from "./config/aiConfigLoader.js";
import { createAiProvider } from "./core/ai/aiProvider.js";
import { loadJson } from "./utils/jsonLoader.js";
import { formatLunarDate, lunarToSolar, solarToLunar } from "./utils/lunarCalendar.js";
import { renderAiNarrativePanel } from "../js/components/aiNarrativePanel.js";
import { renderEvidenceCards } from "../js/components/evidenceCards.js";

const requiredPaths = [
  "index.html",
  "index.offline.html",
  "desktop/main.js",
  "desktop/preload.js",
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
  "js/components/aiSettingsPanel.js",
  "js/components/debugPanel.js",
  "js/components/evidenceCards.js",
  "server/server.js",
  "server/routes/narrativeRoute.js",
  "server/routes/chatRoute.js",
  "server/routes/aiSettingsRoute.js",
  "server/routes/staticRoute.js",
  "server/routes/requestBody.js",
  "server/services/narrativeService.js",
  "server/services/chatService.js",
  "server/prompts/chatPromptBuilder.js",
  "server/security/outputSanitizer.js",
  "server/config/aiConfigLoader.js",
  "server/config/aiSettingsStore.js",
  "server/core/bazi/calculateBazi.js",
  "server/core/bazi/pillarMath.js",
  "server/core/bazi/tenGods.js",
  "server/core/bazi/fiveElements.js",
  "server/core/bazi/luckCycles.js",
  "server/core/bazi/shensha.js",
  "server/core/ziwei/calculateZiwei.js",
  "server/core/ziwei/palaces.js",
  "server/core/ziwei/transformations.js",
  "server/core/evidence/buildEvidenceReport.js",
  "server/core/liunian/calculateYearInfluence.js",
  "server/core/liunian/calculateMonthInfluence.js",
  "server/core/rules/ruleEngine.js",
  "server/core/rules/matchRules.js",
  "server/core/rules/conditionMatcher.js",
  "server/core/rules/evidenceBuilder.js",
  "server/core/rules/scoreBuilder.js",
  "server/core/rules/timingBuilder.js",
  "server/core/rules/counterEvidenceBuilder.js",
  "server/core/rules/normalizeRuleMatch.js",
  "server/core/fortune-engine/index.js",
  "server/core/fortune-engine/natal-signature.js",
  "server/core/fortune-engine/decade-theme.js",
  "server/core/fortune-engine/year-trigger.js",
  "server/core/fortune-engine/month-trigger.js",
  "server/core/fortune-engine/event-score.js",
  "server/core/fortune-engine/narrative-builder.js",
  "server/core/fortune/relationUtils.js",
  "server/core/fortune/ruleEvidenceUtils.js",
  "server/core/fortune/topicMapper.js",
  "server/core/fortune/eventTaxonomy.js",
  "server/core/fortune/buildTriggerChains.js",
  "server/core/fortune/scoreEventCandidates.js",
  "server/core/fortune/analyzeMonthlyWindows.js",
  "server/core/fortune/buildAnnualEventReport.js",
  "server/core/fortune/detectors/relationshipDetector.js",
  "server/core/fortune/detectors/wealthDetector.js",
  "server/core/fortune/detectors/careerDetector.js",
  "server/core/fortune/detectors/childrenOutputDetector.js",
  "server/core/fortune/detectors/healthDetector.js",
  "server/core/fortune/detectors/movementDetector.js",
  "server/core/fortune/detectors/socialDetector.js",
  "server/core/fortune/detectors/familyHomeDetector.js",
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

function createManualChart({ gender = "unknown", pillars } = {}) {
  const roleLabels = { year: "年柱", month: "月柱", day: "日柱", hour: "时柱" };
  const chartPillars = Object.fromEntries(Object.entries(pillars).map(([key, label]) => [
    key,
    {
      role: roleLabels[key],
      label,
      stem: label.slice(0, 1),
      branch: label.slice(1, 2),
    },
  ]));
  const dayStem = chartPillars.day.stem;
  const tenGodStats = {};
  for (const [key, pillar] of Object.entries(chartPillars)) {
    const stemTenGod = key === "day" ? "比肩" : getTenGod(dayStem, pillar.stem);
    const branchTenGod = getTenGod(dayStem, branchMainStem(pillar.branch));
    tenGodStats[stemTenGod] = (tenGodStats[stemTenGod] || 0) + 1;
    tenGodStats[branchTenGod] = (tenGodStats[branchTenGod] || 0) + 1;
  }
  return {
    input: { gender },
    pillars: chartPillars,
    dayMaster: { stem: dayStem, label: `${dayStem}日主` },
    tenGodStats: { mainQi: tenGodStats, fullHidden: tenGodStats },
    elementStats: { visible: { counts: {} }, hidden: { counts: {} } },
    dominantElements: [],
    relations: [],
    luckCycles: { pillars: [] },
  };
}

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
  const fortuneAnalysis = analyzeFortuneYear({
    chart,
    selectedLuck: chart.luckCycles.pillars[0],
    yearInfluence,
    monthInfluences,
  });
  const prompt = buildNarrativePrompt({ chart, yearInfluence, monthInfluences, storyTags, fortuneAnalysis });
  const provider = createAiProvider({ provider: "mock" });
  const narrative = await provider.generate({ prompt, storyTags });

  assert.match(chart.pillars.day.label, /^[甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥]$/);
  assert.equal(chart.meta.engine, "birth-chart-engine");
  assert.equal(yearInfluence.year, 2026);
  assert.equal(monthInfluences.length, 12);
  assert.ok(matchedRules.length > 0);
  assert.ok(storyTags.some((tag) => tag.period === "year"));
  assert.match(prompt.system, /不能重新排盘/);
  assert.match(prompt.system, /专业研判辅助层/);
  assert.match(prompt.user, /fortuneAnalysis/);
  assert.doesNotMatch(prompt.user, /apiKey|DEEPSEEK_API_KEY|sk-/i);
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
  const modeReports = {};
  for (const mode of ["luck", "year", "month"]) {
    const result = await buildNarrative({ ...input, mode });
    modeReports[mode] = result.narrative.report;
    assert.equal(result.aiMode, mode);
    assert.equal(result.narrative.provider, "mock");
    assert.equal(result.narrative.isPlaceholder, true);
    assert.equal(typeof result.narrative.report.title, "string");
    assert.equal(typeof result.narrative.report.coreConclusion, "string");
    assert.ok(result.narrative.report.luckBackground?.evidence?.length > 0);
    assert.ok(result.narrative.report.yearTrigger?.evidence?.length > 0);
    assert.ok(Array.isArray(result.narrative.report.eventFocus));
    assert.ok(Array.isArray(result.narrative.report.likelyEvents));
    assert.ok(Array.isArray(result.narrative.report.monthlyHighlights));
    assert.ok(result.narrative.report.eventFocus.length > 0);
    assert.ok(result.narrative.report.likelyEvents.length > 0);
    if (mode === "month") {
      assert.ok(result.narrative.report.monthlyHighlights.length > 0);
    } else {
      assert.equal(result.narrative.report.monthlyHighlights.length, 0);
    }
    const reportText = JSON.stringify(result.narrative.report);
    assert.ok((reportText.match(/现实中可观察/g) || []).length <= 1);
    assert.doesNotMatch(reportText, /年度触发主题|现实事务出现|事情落地、反馈出现/);
    for (const event of result.narrative.report.likelyEvents) {
      assert.equal(typeof event.event, "string");
      assert.equal(typeof event.conclusion, "string");
      assert.match(event.probabilityLevel, /^(high|medium|low)$/);
      assert.equal(typeof event.timeWindow, "string");
      assert.equal(typeof event.timing, "string");
      assert.ok(Array.isArray(event.evidence));
      assert.ok(event.evidence.length > 0);
      assert.equal(typeof event.reality, "string");
      assert.equal(typeof event.advice, "string");
      assert.ok(Array.isArray(event.verifyBy));
      assert.ok(event.verifyBy.length > 0);
      assert.doesNotMatch(event.event, /事业为|财运为|感情为|学业为|健康为|迁移为|人际为/);
      assert.doesNotMatch(event.event, /主题|窗口|反馈|节点|现实事务/);
      assert.match(event.event, /调整|复核|核算|讨论|重谈|报名|整理|交付|出行|搬动|协作|分工|审批|合同|付款|文书|作息/);
    }
    for (const item of result.narrative.report.eventFocus) {
      assert.match(item.topic, /^(career|wealth|relationship|study|health|movement|social)$/);
      assert.match(item.level, /^(high|medium|low)$/);
      assert.ok(Array.isArray(item.evidence));
    }
    assert.doesNotMatch(JSON.stringify(result.narrative.report), /一定|必定|绝对|必然|必离婚|必发财|必有灾|必坐牢|必死亡/);
  }
  assert.match(modeReports.luck.title + modeReports.luck.coreConclusion, /大运|十年|阶段/);
  assert.match(modeReports.year.title + modeReports.year.coreConclusion, /流年|今年|年度/);
  assert.match(modeReports.month.title + modeReports.month.coreConclusion, new RegExp(`${input.selectedMonth}月`));
  assert.doesNotMatch(modeReports.luck.coreConclusion, /今年|本月|流月|重点月份/);
  assert.doesNotMatch(modeReports.year.coreConclusion, /本月|流月/);
  assert.doesNotMatch(JSON.stringify(modeReports.luck.monthlyHighlights), /月/);
  assert.doesNotMatch(JSON.stringify(modeReports.year.monthlyHighlights), /月/);
  assert.ok(
    modeReports.month.likelyEvents.every((event) => event.timeWindow.includes(`${input.selectedMonth}月`)),
    "流月报告的候选事件时间窗口应聚焦选中月份",
  );
  assert.notDeepEqual(
    modeReports.luck.likelyEvents.map((event) => event.event),
    modeReports.year.likelyEvents.map((event) => event.event),
    "大运候选事件不能复用流年候选事件列表",
  );
  assert.notDeepEqual(
    modeReports.year.likelyEvents.map((event) => event.timeWindow),
    modeReports.month.likelyEvents.map((event) => event.timeWindow),
    "流年与流月不能共用同一套时间窗口",
  );

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
    fortuneAnalysis: analyzeFortuneYear({
      chart,
      selectedLuck: chart.luckCycles.pillars[0],
      yearInfluence,
      monthInfluences,
    }),
  });
  assert.match(prompt.system, /不能重新排盘/);
  assert.match(prompt.system, /不能补充不存在的干支关系/);
  assert.match(prompt.system, /专业研判辅助层/);
  assert.match(prompt.system, /只能根据 fortuneAnalysis、mainEvents、parallelEvents、triggerChains、monthlyHighlights/);
  assert.match(prompt.system, /本地事件引擎已经提供 eventCandidates 和 mainEvents/);
  assert.match(prompt.system, /AI 不再自己判断事件/);
  assert.match(prompt.system, /score 最高的 1-3 个 mainEvents/);
  assert.match(prompt.system, /没有 evidenceChain 的事件不能写成主断/);
  assert.match(prompt.system, /每条 likelyEvents/);
  assert.match(prompt.system, /少废话/);
  assert.match(prompt.system, /避免重复/);
  assert.match(prompt.system, /主断倾向 → 断法依据 → 现实应象/);
  assert.match(prompt.system, /常规象义直接猜现实/);
  assert.match(prompt.system, /先给主断总览/);
  assert.match(prompt.system, /对应层级/);
  assert.match(prompt.system, /禁止平均解释 12 个月/);
  assert.match(prompt.system, /只有流月模式才写选中月份/);
  assert.match(prompt.system, /大运模式/);
  assert.match(prompt.system, /流年模式/);
  assert.match(prompt.system, /流月模式/);
  assert.match(JSON.stringify(prompt.schema), /coreConclusion/);
  assert.match(JSON.stringify(prompt.schema), /likelyEvents/);
  assert.match(JSON.stringify(prompt.schema), /eventFocus/);
  assert.match(JSON.stringify(prompt.schema), /monthlyHighlights/);
  assert.match(JSON.stringify(flowReportSchema), /coreConclusion/);
  assert.match(prompt.user, /"mode": "year"/);
  assert.match(prompt.user, /fortuneAnalysis/);
  assert.match(prompt.user, /mainEvents/);
  assert.match(prompt.user, /parallelEvents/);
  assert.match(prompt.user, /eventCandidates/);
  assert.match(prompt.user, /evidencePackage/);
  assert.match(prompt.user, /modeInstruction/);
  assert.match(prompt.user, /triggerChains/);
  assert.match(prompt.user, /eventScores/);
  assert.match(prompt.user, /monthlyHighlights/);
  assert.doesNotMatch(prompt.user, /apiKey|DEEPSEEK_API_KEY|sk-/i);
});

test("flow AI schema exposes conclusion-focused report fields", () => {
  const schemaText = JSON.stringify(flowReportSchema);
  assert.match(schemaText, /coreConclusion/);
  assert.match(schemaText, /luckBackground/);
  assert.match(schemaText, /yearTrigger/);
  assert.match(schemaText, /likelyEvents/);
  assert.match(schemaText, /conclusion/);
  assert.match(schemaText, /timing/);
  assert.match(schemaText, /advice/);
  assert.match(schemaText, /eventFocus/);
  assert.match(schemaText, /monthlyHighlights/);
  assert.match(schemaText, /overallAdvice/);
  assert.match(schemaText, /boundary/);
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
  assert.ok(result.annualTheme);
  assert.ok(result.overallSummary);
  assert.ok(result.luckBackground?.conclusion);
  assert.ok(result.luckBackground?.evidence?.length > 0);
  assert.ok(result.luckBackground?.reality);
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
  assert.ok(response.fortuneAnalysis.luckBackground.conclusion);
  assert.ok(Array.isArray(response.fortuneAnalysis.triggerChains));
  assert.ok(Array.isArray(response.fortuneAnalysis.monthlyHighlights));
  assert.ok(Array.isArray(response.fortuneAnalysis.advice));
  assert.deepEqual(Object.keys(response.fortuneAnalysis.eventScores), ["career", "wealth", "relationship", "study", "health", "movement", "social"]);
});

test("annual fortune event engine returns ranked event candidates from trigger chains", async () => {
  const chart = createManualChart({
    gender: "female",
    pillars: {
      year: "戊寅",
      month: "辛酉",
      day: "辛酉",
      hour: "戊子",
    },
  });
  const selectedLuck = { label: "丙申", stem: "丙", branch: "申", startYear: 2010, endYear: 2019, startAge: 20, endAge: 29 };
  const yearInfluence = calculateYearInfluence({ chart, targetYear: 2017 });
  const monthInfluences = Array.from({ length: 12 }, (_, index) =>
    calculateMonthInfluence({ chart, targetYear: 2017, month: index + 1 }),
  );

  const report = buildAnnualEventReport({ chart, selectedLuck, yearInfluence, monthInfluences });

  assert.equal(report.year, 2017);
  assert.ok(Array.isArray(report.triggerChains));
  assert.ok(Array.isArray(report.eventCandidates));
  assert.ok(Array.isArray(report.mainEvents));
  assert.ok(Array.isArray(report.monthlyHighlights));
  assert.ok(report.triggerChains.length > 0);
  assert.ok(report.eventCandidates.length > 0);
  assert.ok(report.mainEvents.length <= 3);
  assert.ok(report.mainEvents.every((event) => ["high", "medium"].includes(event.level)));
  assert.ok(report.mainEvents.every((event) => Array.isArray(event.evidenceChain) && event.evidenceChain.length > 0));
  assert.ok(report.triggerChains.every((chain) => chain.id && chain.level && chain.type && chain.source && chain.target));
  assert.ok(report.triggerChains.every((chain) => Array.isArray(chain.topicHints) && chain.evidence && chain.realityMapping));
  assert.ok(report.monthlyHighlights.length > 0);
  assert.ok(report.monthlyHighlights.length < 12);

  const relationship = report.eventCandidates.find((event) => event.eventType === "relationship_marriage");
  assert.ok(relationship, "2017 丁酉应生成关系候选事件");
  assert.match(relationship.level, /^(high|medium)$/);
  assert.match(JSON.stringify(relationship.evidenceChain), /日支|日柱|酉|伏吟|同支|官|杀/);
});

test("annual fortune event engine accepts rule-v2 relationship evidence as bounded auxiliary boost", async () => {
  const chart = createManualChart({
    gender: "male",
    pillars: {
      year: "戊寅",
      month: "辛酉",
      day: "辛酉",
      hour: "戊子",
    },
  });
  const selectedLuck = { label: "丙申", stem: "丙", branch: "申", startYear: 2010, endYear: 2019, startAge: 20, endAge: 29 };
  const yearInfluence = calculateYearInfluence({ chart, targetYear: 2017 });
  const monthInfluences = Array.from({ length: 12 }, (_, index) =>
    calculateMonthInfluence({ chart, targetYear: 2017, month: index + 1 }),
  );
  const baseline = buildAnnualEventReport({ chart, selectedLuck, yearInfluence, monthInfluences });
  const baselineRelationship = baseline.eventCandidates.find((event) => event.eventType === "relationship_marriage");
  const report = buildAnnualEventReport({
    chart,
    selectedLuck,
    yearInfluence,
    monthInfluences,
    matchedRules: [{
      id: "relationship-v2-boost-test",
      version: "rule-v2",
      topic: "relationship",
      title: "流年引动夫妻宫",
      score: 88,
      evidence: ["流年丁酉与日支酉形成伏吟，日支作为夫妻宫被引动。", "当前规则命中关系宫位触发。"],
      counterEvidence: ["若现实中没有对象或关系互动，则只作关系主题背景。"],
    }],
  });
  const relationship = report.eventCandidates.find((event) => event.eventType === "relationship_marriage");

  assert.ok(relationship, "relationship candidate should still come from original detector evidence");
  assert.ok(relationship.score >= baselineRelationship.score);
  assert.match(JSON.stringify(relationship.evidenceChain), /规则补强：流年引动夫妻宫/);
  assert.ok(relationship.debug.ruleEvidence.boostScore > 0);
  assert.deepEqual(relationship.debug.ruleEvidence.counterEvidence, ["若现实中没有对象或关系互动，则只作关系主题背景。"]);
  assert.ok(relationship.debug.ruleEvidence.boostScore <= 20);
});

test("annual fortune event engine accepts rule-v2 career evidence as bounded auxiliary boost", async () => {
  const chart = createManualChart({
    gender: "female",
    pillars: {
      year: "戊寅",
      month: "辛酉",
      day: "辛酉",
      hour: "戊子",
    },
  });
  const selectedLuck = { label: "丙午", stem: "丙", branch: "午", startYear: 2020, endYear: 2029, startAge: 30, endAge: 39 };
  const yearInfluence = calculateYearInfluence({ chart, targetYear: 2026 });
  const monthInfluences = Array.from({ length: 12 }, (_, index) =>
    calculateMonthInfluence({ chart, targetYear: 2026, month: index + 1 }),
  );
  const baseline = buildAnnualEventReport({ chart, selectedLuck, yearInfluence, monthInfluences });
  const baselineCareer = baseline.eventCandidates.find((event) => event.eventType === "career_status");
  const report = buildAnnualEventReport({
    chart,
    selectedLuck,
    yearInfluence,
    monthInfluences,
    matchedRules: [{
      id: "career-v2-boost-test",
      version: "rule-v2",
      topic: "career",
      title: "官杀触发事业身份与规则压力",
      score: 76,
      evidence: ["岁运出现正官，事业身份、岗位责任或规则压力被引动。", "官杀触发需结合现实岗位复核。"],
      counterEvidence: ["若现实中没有岗位、项目、考试、考核或规则压力，则只作为背景。"],
    }],
  });
  const career = report.eventCandidates.find((event) => event.eventType === "career_status");

  assert.ok(career, "career candidate should still come from original detector evidence");
  assert.ok(career.score >= baselineCareer.score);
  assert.match(JSON.stringify(career.evidenceChain), /规则补强：官杀触发事业身份与规则压力/);
  assert.ok(career.debug.ruleEvidence.boostScore > 0);
  assert.deepEqual(career.debug.ruleEvidence.counterEvidence, ["若现实中没有岗位、项目、考试、考核或规则压力，则只作为背景。"]);
  assert.ok(career.debug.ruleEvidence.boostScore <= 20);
});

test("annual fortune event engine promotes 2017 male relationship trigger into year main events", async () => {
  const chart = createManualChart({
    gender: "male",
    pillars: {
      year: "戊寅",
      month: "辛酉",
      day: "辛酉",
      hour: "戊子",
    },
  });
  const selectedLuck = { label: "丙申", stem: "丙", branch: "申", startYear: 2010, endYear: 2019, startAge: 20, endAge: 29 };
  const yearInfluence = calculateYearInfluence({ chart, targetYear: 2017 });
  const monthInfluences = Array.from({ length: 12 }, (_, index) =>
    calculateMonthInfluence({ chart, targetYear: 2017, month: index + 1 }),
  );

  const report = buildAnnualEventReport({ chart, selectedLuck, yearInfluence, monthInfluences });
  const relationship = report.mainEvents.find((event) => event.eventType === "relationship_marriage");

  assert.ok(relationship, "2017 丁酉应把关系婚恋放入 yearAnalysis/mainEvents 主线");
  assert.match(relationship.level, /^(high|medium)$/);
  assert.match(JSON.stringify(relationship.evidenceChain), /流年酉触发日支酉|流年.*酉.*日支.*酉/);
  assert.match(JSON.stringify(relationship.possibleManifestations), /暧昧|确定关系|旧关系|关系边界变化|关系边界/);
});

test("annual fortune event engine recognizes 2026 career or movement triggers for the sample chart", async () => {
  const chart = createManualChart({
    gender: "female",
    pillars: {
      year: "戊寅",
      month: "辛酉",
      day: "辛酉",
      hour: "戊子",
    },
  });
  const selectedLuck = { label: "丙午", stem: "丙", branch: "午", startYear: 2020, endYear: 2029, startAge: 30, endAge: 39 };
  const yearInfluence = calculateYearInfluence({ chart, targetYear: 2026 });
  const monthInfluences = Array.from({ length: 12 }, (_, index) =>
    calculateMonthInfluence({ chart, targetYear: 2026, month: index + 1 }),
  );

  const report = buildAnnualEventReport({ chart, selectedLuck, yearInfluence, monthInfluences });
  const mediumOrHigh = report.eventCandidates.filter((event) => ["high", "medium"].includes(event.level));
  const eventTypes = mediumOrHigh.map((event) => event.eventType);

  assert.ok(
    ["relationship_marriage", "career_status", "movement_change"].some((type) => eventTypes.includes(type)),
    "2026 丙午应在关系、事业或迁动中至少识别一个 medium/high 事件",
  );
  assert.ok(report.mainEvents.length <= 3);
  assert.ok(report.mainEvents.every((event) => event.evidenceChain.length > 0));
  assert.match(JSON.stringify(report.triggerChains), /丙午|正官|官|午|子|冲|大运/);

  const response = await buildNarrative({
    birthDate: "1992-08-18",
    birthTime: "14:30",
    gender: "female",
    targetYear: 2026,
  });
  assert.ok(Array.isArray(response.eventCandidates));
  assert.ok(Array.isArray(response.mainEvents));
  assert.ok(Array.isArray(response.triggerChains));
  assert.ok(Array.isArray(response.monthlyHighlights));
  assert.equal(response.fortuneAnalysis, response.annualEventReport);
  assert.equal(response.mainEvents, response.annualEventReport.mainEvents);
  assert.ok(response.evidenceReport);
  assert.equal(response.evidenceReport.summary.year, 2026);
  assert.ok(Array.isArray(response.evidenceReport.mainEventCards));
  assert.ok(Array.isArray(response.evidenceReport.ruleCards));
  assert.ok(Array.isArray(response.evidenceReport.reviewQuestions));
  assert.ok(response.mainEvents.length <= 3);
  assert.ok(response.matchedRules.some((rule) => rule.version === "rule-v2"));
  assert.match(JSON.stringify(response.annualEventReport.eventCandidates), /规则补强/);
  assert.match(JSON.stringify(response.annualEventReport.debug), /ruleV2MatchCount/);
  assert.doesNotMatch(JSON.stringify(Object.keys(response)), /ruleV2MatchCount/);
  assert.match(response.prompt.user, /fortuneAnalysis/);
  assert.match(response.prompt.user, /mainEvents/);
  assert.match(response.prompt.user, /eventCandidates/);
  assert.doesNotMatch(response.prompt.user, /apiKey|DEEPSEEK_API_KEY|sk-/i);
});

test("annual fortune event engine keeps 2026 male sample differentiated instead of making every topic high", () => {
  const chart = createManualChart({
    gender: "male",
    pillars: {
      year: "戊寅",
      month: "辛酉",
      day: "辛酉",
      hour: "戊子",
    },
  });
  const selectedLuck = { label: "丙午", stem: "丙", branch: "午", startYear: 2020, endYear: 2029, startAge: 30, endAge: 39 };
  const yearInfluence = calculateYearInfluence({ chart, targetYear: 2026 });
  const monthInfluences = Array.from({ length: 12 }, (_, index) =>
    calculateMonthInfluence({ chart, targetYear: 2026, month: index + 1 }),
  );

  const report = buildAnnualEventReport({ chart, selectedLuck, yearInfluence, monthInfluences });
  const mainTypes = report.mainEvents.map((event) => event.eventType);
  const scoreValues = Object.values(report.eventScores).map((item) => item.score);

  assert.ok(
    ["relationship_marriage", "health_risk", "career_status"].some((type) => mainTypes.includes(type)),
    "2026 丙午应至少在关系、健康或事业身份中识别年度观察重点",
  );
  assert.ok(scoreValues.some((score) => score < 70), "2026 不应所有领域都 high");
  assert.ok(scoreValues.some((score) => score < 100), "2026 不应所有分数都是 100");
  assert.doesNotMatch(JSON.stringify(report.mainEvents), /流年午合动日支酉/);
});

test("evidence report builds readable cards without mutating annual event data", () => {
  const empty = buildEvidenceReport();
  assert.equal(empty.summary.mainEventCount, 0);
  assert.deepEqual(empty.mainEventCards, []);
  assert.deepEqual(empty.reviewQuestions, []);

  const annualEventReport = {
    year: 2026,
    mainEvents: [{
      eventType: "career_status",
      score: 72,
      level: "medium",
      confidence: "medium",
      evidenceChain: ["官杀引动事业角色", "月柱被岁运触发", "第三条", "第四条", "第五条", "第六条", "第七条", "第八条", "第九条"],
      possibleManifestations: ["岗位职责变化", "", "审批考核节点"],
      timing: [],
      debug: { source: "test" },
    }],
    parallelEvents: [{
      eventType: "relationship_marriage",
      score: 42,
      level: "low",
      confidence: "medium",
      evidenceChain: ["日支被流年牵动"],
      possibleManifestations: ["关系边界重谈"],
      timing: ["8月再看流月触发"],
      debug: {},
    }],
    monthlyHighlights: [{
      month: 8,
      pillar: "丙申",
      level: "medium",
      theme: "事业节点",
      reasons: ["流月触发月柱"],
    }],
  };
  const matchedRules = [
    {
      id: "career-v2",
      title: "官杀触发事业身份与规则压力",
      topic: "career",
      source: "data/rules/bazi/career.json",
      version: "rule-v2",
      score: 76,
      confidence: "medium",
      evidence: ["岁运出现正官", "岗位责任被引动", "第三条", "第四条", "第五条"],
      timing: { type: "annual", matchedMonths: [{ month: 9, pillar: "丁酉", reason: "规则应期" }] },
      counterEvidence: ["若现实中没有岗位变化，则降级为背景。"],
      needVerify: ["是否存在岗位调整、流程审核或证照材料"],
      matchedFacts: [{ type: "tenGod", value: "正官" }],
    },
    {
      id: "legacy-career",
      title: "旧规则官杀引动事业角色",
      topic: "career",
      source: "data/rules/bazi/career.json",
      version: "legacy-v1",
      score: 0,
      confidence: "medium",
      evidence: ["流年十神：正官"],
      needVerify: ["旧规则复核点"],
      matchedFacts: [],
    },
  ];
  const report = buildEvidenceReport({
    selectedLuck: { label: "甲辰" },
    yearInfluence: { year: 2026 },
    annualEventReport,
    matchedRules,
  });

  assert.equal(report.summary.year, 2026);
  assert.equal(report.summary.selectedLuck, "甲辰");
  assert.equal(report.summary.mainEventCount, 1);
  assert.equal(report.summary.ruleV2Count, 1);
  assert.ok(report.summary.topTopics.includes("career"));
  assert.equal(report.mainEventCards[0].title, "禄与事业身份");
  assert.equal(report.mainEventCards[0].evidence.length, 8);
  assert.deepEqual(report.mainEventCards[0].timing, ["暂无明确流月，应等后续触发复核"]);
  assert.deepEqual(report.mainEventCards[0].reality, ["岗位职责变化", "审批考核节点"]);
  assert.equal(report.parallelEventCards[0].role, "副线复核");
  assert.match(report.parallelEventCards[0].boundary, /未进入年度主断/);
  assert.equal(report.ruleCards[0].version, "rule-v2");
  assert.equal(report.ruleCards[0].evidence.length, 4);
  assert.equal(report.ruleCards[0].counterEvidence.length, 1);
  assert.equal(report.ruleCards[1].version, "legacy-v1");
  assert.ok(report.timingCards.some((card) => card.month === 8 && card.source === "monthlyHighlights"));
  assert.ok(report.timingCards.some((card) => card.month === 9 && card.source === "ruleTiming"));
  assert.ok(report.reviewQuestions.includes("是否存在岗位调整、流程审核或证照材料？"));
  assert.ok(report.reviewQuestions.some((question) => /降级为背景/.test(question)));
  assert.equal(annualEventReport.mainEvents[0].evidenceChain.length, 9);
});

test("flow narrative prompt reads the requested fortuneAnalysis layer by mode", () => {
  const layeredFortune = {
    mainEvents: [{ eventType: "legacy_top", score: 100, level: "high", evidenceChain: ["旧顶层不应进入 mode 报告"] }],
    eventScores: { relationship: { score: 100, evidence: ["旧顶层"] } },
    triggerChains: [{ reason: "旧顶层 triggerChain" }],
    monthlyHighlights: [{ month: 12, reasons: ["旧顶层月份"] }],
    luckAnalysis: {
      annualTheme: "大运层",
      mainEvents: [{ eventType: "wealth_resource", score: 60, level: "medium", evidenceChain: ["大运层证据"] }],
      eventScores: { wealth: { score: 60, evidence: ["大运层证据"] } },
      triggerChains: [{ reason: "大运层 triggerChain" }],
      monthlyHighlights: [],
    },
    yearAnalysis: {
      annualTheme: "流年层",
      mainEvents: [{ eventType: "relationship_marriage", score: 80, level: "high", evidenceChain: ["流年层证据"] }],
      eventScores: { relationship: { score: 80, evidence: ["流年层证据"] } },
      triggerChains: [{ reason: "流年层 triggerChain" }],
      monthlyHighlights: [{ month: 6, reasons: ["流年层月份不应进入流年 evidencePackage timeWindows"] }],
    },
    monthAnalysis: {
      annualTheme: "流月层",
      mainEvents: [{ eventType: "health_risk", score: 70, level: "medium", evidenceChain: ["流月层证据"] }],
      eventScores: { health: { score: 70, evidence: ["流月层证据"] } },
      triggerChains: [{ reason: "流月层 triggerChain" }],
      monthlyHighlights: [{ month: 3, pillar: "庚寅", intensity: "medium", reasons: ["流月层月份"] }],
    },
  };

  const luckUser = JSON.parse(buildFlowNarrativePrompt({ mode: "luck", fortuneAnalysis: layeredFortune }).user);
  const yearUser = JSON.parse(buildFlowNarrativePrompt({ mode: "year", fortuneAnalysis: layeredFortune }).user);
  const monthUser = JSON.parse(buildFlowNarrativePrompt({
    mode: "month",
    fortuneAnalysis: layeredFortune,
    selectedMonthInfluence: { month: 3, pillar: { label: "庚寅" }, evidence: ["选中流月"] },
  }).user);

  assert.equal(luckUser.fortuneAnalysis.mainEvents[0].eventType, "wealth_resource");
  assert.equal(yearUser.fortuneAnalysis.mainEvents[0].eventType, "relationship_marriage");
  assert.equal(monthUser.fortuneAnalysis.mainEvents[0].eventType, "health_risk");
  assert.equal(yearUser.evidencePackage.timeWindows.length, 0);
  assert.equal(monthUser.evidencePackage.timeWindows[0].month, 3);
  assert.doesNotMatch(JSON.stringify({ luckUser, yearUser, monthUser }), /legacy_top|旧顶层/);
});

test("flow narrative prompt preserves evidenced side lines as parallel review events", () => {
  const fortuneAnalysis = {
    yearAnalysis: {
      annualTheme: "18岁年度样例",
      mainEvents: [{
        eventType: "children_output",
        score: 72,
        level: "medium",
        evidenceChain: ["食伤透出，学习表达和材料交付被推到台前"],
        possibleManifestations: ["学习证照、材料文书或表达交付被推到台前"],
      }],
      eventCandidates: [
        {
          eventType: "children_output",
          score: 72,
          level: "medium",
          evidenceChain: ["食伤透出，学习表达和材料交付被推到台前"],
          possibleManifestations: ["学习证照、材料文书或表达交付被推到台前"],
        },
        {
          eventType: "relationship_marriage",
          score: 46,
          level: "low",
          evidenceChain: ["流年支合动日支，关系宫位有靠近和牵连"],
          possibleManifestations: ["恋爱启动、暧昧或关系边界变化"],
        },
        {
          eventType: "wealth_resource",
          score: 43,
          level: "low",
          evidenceChain: ["流年见财星，资源和收入方式进入复核"],
          possibleManifestations: ["兼职打工、临时收入或资源变现"],
        },
      ],
      triggerChains: [],
      monthlyHighlights: [],
      eventScores: {},
    },
  };

  const prompt = buildFlowNarrativePrompt({ mode: "year", fortuneAnalysis });
  const user = JSON.parse(prompt.user);
  const report = buildReadableAiReportFromPrompt(prompt);

  assert.deepEqual(
    user.evidencePackage.mainEvents.map((event) => event.eventType),
    ["children_output"],
  );
  assert.deepEqual(
    user.evidencePackage.parallelEvents.map((event) => event.eventType),
    ["relationship_marriage", "wealth_resource"],
  );
  assert.match(prompt.system, /并行复核/);
  assert.match(prompt.system, /年龄.*不能覆盖证据链|证据链.*年龄/);
  assert.match(JSON.stringify(report.eventFocus), /副线复核.*关系|关系.*副线复核/);
  assert.match(JSON.stringify(report.eventFocus), /兼职打工|临时收入/);
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

test("rule engine supports legacy when rules and v2 condition rule matches", () => {
  const context = {
    chart: {
      input: { gender: "female" },
      pillars: {
        month: { label: "甲寅", stem: "甲", branch: "寅" },
        day: { label: "戊子", stem: "戊", branch: "子" },
      },
      dayMaster: { element: "土" },
      dominantElements: [{ element: "木" }],
    },
    selectedLuck: {
      label: "乙丑",
      stem: "乙",
      branch: "丑",
      tenGods: { stem: "正官", branch: "劫财" },
    },
    yearInfluence: {
      year: 2026,
      pillar: { label: "丙午", stem: "丙", branch: "午" },
      tenGods: { stem: "偏印", branch: "正官" },
    },
    monthInfluences: [
      { month: 5, pillar: { label: "癸巳", stem: "癸", branch: "巳" }, role: "推进期" },
      { month: 6, pillar: { label: "甲午", stem: "甲", branch: "午" }, role: "落地期" },
    ],
  };
  const matches = matchRules([
    {
      id: "legacy-career-officer-test",
      topic: "career",
      tag: "角色责任上升",
      title: "旧规则官杀引动事业角色",
      when: { yearTenGod: "正官" },
      confidence: "medium",
      needVerify: ["旧规则复核点"],
    },
    {
      id: "relationship-v2-test",
      topic: "relationship",
      tag: "relationship_day_branch_trigger",
      title: "流年引动夫妻宫",
      condition: {
        all: [
          {
            type: "relation",
            source: "year",
            target: "dayBranch",
            relation: ["冲"],
          },
        ],
        any: [
          {
            type: "tenGod",
            source: "luckStem",
            value: ["正官"],
          },
        ],
      },
      evidence: {
        templates: [
          "流年{yearPillar}与日支{dayBranch}形成{relation}，日支作为夫妻宫被引动。",
          "当前规则命中关系宫位触发，需结合现实关系状态复核。",
        ],
      },
      score: {
        base: 40,
        boost: [
          { when: "targetIsDayBranch", value: 20 },
          { when: "spouseStarTriggered", value: 20 },
          { when: "luckAlsoTriggered", value: 15 },
        ],
        reduce: [
          { when: "onlyWeakEvidence", value: -10 },
        ],
      },
      timing: {
        type: "annual",
        windows: ["year", "matchedMonths"],
        text: "全年观察关系互动，若流月再次触发日支，则该月更容易落地。",
      },
      counterEvidence: [
        "若现实中没有对象、没有暧昧、没有合作绑定，则只作为关系主题被引动，不直接断感情事件。",
      ],
      needVerify: ["现实中是否已有对象或暧昧对象"],
      confidence: "medium",
    },
  ], context);

  const legacy = matches.find((rule) => rule.id === "legacy-career-officer-test");
  assert.ok(legacy, "legacy when rule should still match");
  assert.equal(legacy.version, "legacy-v1");
  assert.equal(Array.isArray(legacy.evidence), true);
  assert.equal(legacy.confidence, "medium");
  assert.deepEqual(legacy.needVerify, ["旧规则复核点"]);
  assert.equal(typeof legacy.score, "number");
  assert.equal(Array.isArray(legacy.matchedFacts), true);

  const v2 = matches.find((rule) => rule.id === "relationship-v2-test");
  assert.ok(v2, "v2 condition rule should match");
  assert.equal(v2.version, "rule-v2");
  assert.equal(v2.conditionMatched, true);
  assert.equal(v2.topic, "relationship");
  assert.equal(Array.isArray(v2.evidence), true);
  assert.match(v2.evidence.join(" "), /丙午|日支子|冲/);
  assert.equal(v2.confidence, "medium");
  assert.deepEqual(v2.needVerify, ["现实中是否已有对象或暧昧对象"]);
  assert.equal(typeof v2.score, "number");
  assert.ok(v2.score > 40);
  assert.equal(typeof v2.scoreDetail.base, "number");
  assert.ok(v2.scoreDetail.boost.some((item) => item.when === "targetIsDayBranch"));
  assert.equal(v2.timing.type, "annual");
  assert.ok(Array.isArray(v2.counterEvidence));
  assert.ok(v2.counterEvidence.length > 0);
  assert.ok(v2.matchedFacts.some((fact) => fact.type === "relation" && fact.relation === "冲"));
  assert.ok(v2.matchedFacts.some((fact) => fact.type === "tenGod" && fact.value === "正官"));
});

test("chat prompt and fallback keep AI answers professional without leaking keys", async () => {
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

  assert.match(prompt.system, /专业命理师傅/);
  assert.match(prompt.system, /不能重新排盘/);
  assert.match(prompt.system, /主断倾向/);
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
  assert.match(response.text, /研判/);
  assert.match(response.text, /师傅复核/);
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

test("static index uses server-mode module entry and keeps old birth settings data", () => {
  global.window = {};
  const locationScript = readFileSync("js/locationData.js", "utf8");
  Function(locationScript)();
  const index = readFileSync("index.html", "utf8");
  const offlineIndex = readFileSync("index.offline.html", "utf8");
  const appSource = readFileSync("js/app.js", "utf8");
  const apiClientSource = readFileSync("js/apiClient.js", "utf8");
  const aiSettingsPanelSource = readFileSync("js/components/aiSettingsPanel.js", "utf8");
  const bundle = readFileSync("js/app.bundle.js", "utf8");
  const styles = readFileSync("styles/main.css", "utf8");
  const staticRouteSource = readFileSync("server/routes/staticRoute.js", "utf8");

  assert.equal(global.window.FortuneLocationData.cities.length, 3337);
  assert.doesNotMatch(index, /js\/app\.bundle\.js/);
  assert.doesNotMatch(index, /js\/local-deepseek-config\.local\.js/);
  assert.match(index, /<script\s+type="module"\s+src="js\/app\.js\?v=20260609g"><\/script>/);
  assert.ok(index.indexOf('id="coreSignals"') < index.indexOf('id="monthTimeline"'));
  assert.ok(index.indexOf('id="coreSignals"') < index.indexOf('id="evidenceCards"'));
  assert.ok(index.indexOf('id="evidenceCards"') < index.indexOf('id="monthTimeline"'));
  assert.match(index, /id="evidenceCards"/);
  assert.match(index, /id="aiSettings"/);
  assert.match(index, /id="aiNarrative"/);
  assert.match(index, /id="debugPanel"/);
  assert.match(appSource, /renderEvidenceCards/);
  assert.match(appSource, /renderAiSettingsPanel/);
  assert.match(appSource, /state\.evidenceReport/);
  assert.match(apiClientSource, /\/api\/settings\/ai/);
  assert.match(apiClientSource, /\/api\/settings\/ai\/test/);
  assert.match(aiSettingsPanelSource, /maskedApiKey/);
  assert.match(aiSettingsPanelSource, /type="password"/);
  assert.match(bundle, /function renderEvidenceCards/);
  assert.match(bundle, /年度证据总览/);
  assert.match(bundle, /副线复核/);
  assert.match(bundle, /师傅复核问题/);
  assert.match(bundle, /matchedFacts/);
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
  assert.match(bundle, /function renderNatalMiniChart/);
  assert.match(bundle, /原局对照/);
  assert.ok(bundle.indexOf("1. 大运盘") < bundle.indexOf("2. 流年盘"));
  assert.ok(bundle.indexOf("2. 流年盘") < bundle.indexOf("3. 基础命盘"));
  assert.match(bundle, /renderFortuneTransitChart\(data\)[\s\S]*renderFlowAiStage\("luck"[\s\S]*renderFlowAiStage\("year"/);
  assert.match(bundle, /renderFlowAiStage\("year"[\s\S]*renderTransitSignals\(data\.transitSignals, data\)[\s\S]*4\. 最后细看流月/);
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
  assert.match(bundle, /function renderReadableFlowAiReport/);
  assert.doesNotMatch(bundle, /今年更像发生的事/);
  assert.doesNotMatch(bundle, /这一年更像发生的事/);
  assert.match(bundle, /流年主断事项/);
  assert.match(bundle, /function renderAiLikelyEvent/);
  assert.match(bundle, /专业研判/);
  assert.match(bundle, /断法依据/);
  assert.match(bundle, /现实应象/);
  assert.match(bundle, /ai-one-line/);
  assert.match(bundle, /ai-event-brief/);
  assert.match(bundle, /重点月份/);
  assert.match(bundle, /本地占位报告/);
  assert.match(bundle, /fortuneAnalysis: lastData\.fortuneAnalysis/);
  assert.match(bundle, /function pickBrowserFortuneAnalysis/);
  assert.match(bundle, /evidencePackage/);
  assert.match(bundle, /root\.hidden = false/);
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
  assert.match(bundle, /function renderFortuneTransitChart/);
  assert.match(bundle, /function renderTransitPillarMatrix/);
  assert.match(bundle, /function renderFortuneStepper/);
  assert.match(bundle, /fortune-transit-grid/);
  assert.match(bundle, /fortune-ai-layout/);
  assert.match(bundle, /flow-ai-card/);
  assert.match(bundle, /transit-pillar-matrix/);
  assert.match(bundle, /data-luck-prev/);
  assert.match(bundle, /data-luck-next/);
  assert.match(bundle, /data-year-prev/);
  assert.match(bundle, /data-year-next/);
  assert.match(bundle, /data-luck-select/);
  assert.match(bundle, /data-year-select/);
  assert.doesNotMatch(bundle, /主线观察/);
  assert.doesNotMatch(bundle, /五行合看/);
  assert.match(bundle, /大运盘/);
  assert.match(bundle, /流年盘/);
  assert.match(bundle, /基础命盘/);
  assert.ok(bundle.indexOf("1. 大运盘") < bundle.indexOf("2. 流年盘"));
  assert.ok(bundle.indexOf("2. 流年盘") < bundle.indexOf("3. 基础命盘"));
  assert.ok(bundle.indexOf("renderFortuneTransitChart(data)") < bundle.indexOf('renderFlowAiStage("luck"'));
  assert.ok(bundle.indexOf('renderFlowAiStage("year"') < bundle.indexOf("最后细看流月"));
  assert.match(styles, /fortune-transit-grid/);
  assert.match(styles, /minmax\(440px, 1\.7fr\)/);
  assert.match(styles, /fortune-ai-layout/);
  assert.match(styles, /transit-pillar-matrix/);
  assert.match(styles, /fortune-stepper/);
  assert.match(bundle, /data-ai-mode="luck"/);
  assert.match(bundle, /data-ai-mode="year"/);
  assert.match(bundle, /data-ai-mode="month"/);
  assert.match(bundle, /AI解读大运/);
  assert.match(bundle, /AI解读流年/);
  assert.match(bundle, /AI解读流月/);
  assert.match(bundle, /专业研判/);
  assert.match(bundle, /成立条件/);
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
  assert.match(bundle, /function renderAssistantChatContent/);
  assert.match(bundle, /function renderChatAnswerBlocks/);
  assert.match(bundle, /chat-answer-card/);
  assert.match(bundle, /chat-answer-body/);
  assert.match(bundle, /chat-answer-marker/);
  assert.match(bundle, /chat-answer-text/);
  assert.doesNotMatch(bundle, /function chatPointLabel/);
  assert.match(styles, /chat-widget/);
  assert.match(styles, /chat-answer-card/);
  assert.match(styles, /chat-answer-body/);
  assert.match(styles, /chat-widget\.is-open \.chat-toggle/);
  assert.match(styles, /chat-window\[hidden\]/);
  assert.match(styles, /typing-caret/);
  assert.match(offlineIndex, /js\/local-deepseek-config\.local\.js/);
  assert.match(staticRouteSource, /local-deepseek-config\.local\.js/);
  assert.match(staticRouteSource, /response\.writeHead\(404\)/);
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
  assert.doesNotMatch(bundle, /function renderFortuneAnalysis/);
  assert.doesNotMatch(bundle, /function renderFortuneLikelyEvents/);
  assert.doesNotMatch(bundle, /likely-events-block/);
  assert.doesNotMatch(bundle, /renderFortuneLikelyEvents\(readableReport\)/);
  assert.match(offlineIndex, /app\.bundle\.js\?v=20260609g/);
  assert.match(bundle, /function selectLocalReportContext/);
  assert.match(bundle, /function readableReportSectionTitles/);
  assert.match(bundle, /flowModeInstruction\(mode\)/);
  assert.match(bundle, /大运模式/);
  assert.match(bundle, /流年模式/);
  assert.match(bundle, /流月模式/);
  assert.match(bundle, /fortuneAnalysis/);
  assert.doesNotMatch(bundle, /<h2>年度总论<\/h2>/);
  assert.doesNotMatch(bundle, /岁运综合推演/);
  assert.doesNotMatch(bundle, /大运如何影响这一年/);
  assert.doesNotMatch(bundle, /这一年被什么触发/);
  assert.doesNotMatch(bundle, /fortune-score-grid/);
  assert.doesNotMatch(bundle, /<h2>现实建议<\/h2>/);
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
  const aiConfigJson = JSON.parse(aiConfig);
  assert.equal(aiConfigJson.provider, "mock");
  assert.equal(aiConfigJson.deepseek.model, "deepseek-chat");
  assert.equal(aiConfigJson.deepseek.apiKey, undefined);
  assert.doesNotMatch(aiConfig, /apiKey/);
  assert.doesNotMatch(aiConfig, /sk-/);
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

test("AI narrative panel tolerates missing root", () => {
  assert.doesNotThrow(() => renderAiNarrativePanel(null, { narrative: { text: "测试" } }));
});

test("EvidenceCards renders timing cards and tolerates empty timing data", () => {
  const root = { innerHTML: "" };
  renderEvidenceCards(root, {
    summary: { year: 2026, selectedLuck: "甲子", mainEventCount: 1, ruleV2Count: 1, topTopics: ["career"] },
    mainEventCards: [{ title: "事业身份复核", eventType: "career", level: "medium", score: 68, evidence: ["官杀触发"] }],
    timingCards: [
      {
        month: 4,
        pillar: "壬辰",
        level: "medium",
        theme: "项目推进",
        evidence: ["流月再次触发事业环境"],
        source: "monthlyHighlights",
      },
    ],
    ruleCards: [],
    reviewQuestions: [],
  });

  assert.match(root.innerHTML, /应期观察卡片/);
  assert.match(root.innerHTML, /4月/);
  assert.match(root.innerHTML, /壬辰/);
  assert.match(root.innerHTML, /medium/);
  assert.match(root.innerHTML, /项目推进/);
  assert.match(root.innerHTML, /流月再次触发事业环境/);
  assert.match(root.innerHTML, /monthlyHighlights/);

  renderEvidenceCards(root, { summary: {}, mainEventCards: [], timingCards: [], ruleCards: [], reviewQuestions: [] });
  assert.match(root.innerHTML, /暂无明确应期卡片。/);
});

test("local server can use ignored DeepSeek config without serving it to the browser", () => {
  const serverSource = readFileSync("server/server.js", "utf8");
  const narrativeRouteSource = readFileSync("server/routes/narrativeRoute.js", "utf8");
  const chatRouteSource = readFileSync("server/routes/chatRoute.js", "utf8");
  const staticRouteSource = readFileSync("server/routes/staticRoute.js", "utf8");
  const aiConfigSource = readFileSync("server/config/aiConfigLoader.js", "utf8");
  const settingsRouteSource = readFileSync("server/routes/aiSettingsRoute.js", "utf8");
  const gitignore = readFileSync(".gitignore", "utf8");

  assert.match(aiConfigSource, /function loadLocalAiProviderOptions/);
  assert.match(narrativeRouteSource, /buildNarrative\(input, loadLocalAiProviderOptions\(\)\)/);
  assert.match(chatRouteSource, /buildChatResponse\(input, loadLocalAiProviderOptions\(\)\)/);
  assert.match(settingsRouteSource, /\/api\/settings\/ai/);
  assert.match(settingsRouteSource, /\/api\/settings\/ai\/test/);
  assert.match(staticRouteSource, /normalized === "\/js\/local-deepseek-config\.local\.js"/);
  assert.match(staticRouteSource, /response\.writeHead\(404\)/);
  assert.match(gitignore, /config\/local-ai-settings\.json/);
  assert.match(serverSource, /narrativeRoute\(request, response, url\)/);
  assert.match(serverSource, /chatRoute\(request, response, url\)/);
  assert.match(serverSource, /aiSettingsRoute\(request, response, url\)/);
  assert.ok(serverSource.indexOf("narrativeRoute(request, response, url)") < serverSource.indexOf("chatRoute(request, response, url)"));
  assert.ok(serverSource.indexOf("chatRoute(request, response, url)") < serverSource.indexOf("aiSettingsRoute(request, response, url)"));
  assert.ok(serverSource.indexOf("aiSettingsRoute(request, response, url)") < serverSource.indexOf("staticRoute(url, response)"));
  assert.match(serverSource, /staticRoute\(url, response\)/);
  assert.doesNotMatch(serverSource, /calculateBazi|calculateZiwei|ruleEngine|buildAnnualEventReport|generateStoryTags|createAiProvider/);
  assert.doesNotMatch(aiConfigSource, /deepseekApiKey:\s*["']sk-/);
});

test("default repository files do not contain committed API keys", () => {
  const aiConfig = readFileSync("config/ai-config.json", "utf8");
  const gitignore = readFileSync(".gitignore", "utf8");
  const scannedFiles = collectTextFiles(["README.md", "js", "server"], {
    exclude: new Set([
      "js/local-deepseek-config.local.js",
      "server/architecture.test.js",
    ]),
  });
  const secretPattern = /sk-[A-Za-z0-9_-]{16,}/;
  const hits = scannedFiles.filter((filePath) => secretPattern.test(readFileSync(filePath, "utf8")));

  assert.doesNotMatch(aiConfig, /apiKey|sk-/);
  assert.match(gitignore, /^config\/local-ai-settings\.json$/m);
  assert.match(gitignore, /^js\/local-deepseek-config\.local\.js$/m);
  assert.match(gitignore, /^\.env$/m);
  assert.match(gitignore, /^\.env\.\*$/m);
  assert.deepEqual(hits, []);
});

test("AI settings are saved locally and hide full API keys from public reads", async () => {
  const settingsDir = mkdtempSync(path.join(os.tmpdir(), "fortune-ai-settings-"));
  try {
    const saved = saveAiSettings({
      provider: "deepseek",
      enabled: true,
      deepseek: {
        apiKey: "sk-test-secret-abcd",
        endpoint: "https://api.deepseek.com/chat/completions",
        model: "deepseek-chat",
      },
    }, { settingsDir });
    const publicSettings = readAiSettings({ settingsDir });
    const privateSettings = readAiSettings({ settingsDir, includeSecret: true });
    const providerOptions = buildProviderOptionsFromAiSettings(privateSettings);

    assert.equal(saved.deepseek.apiKey, undefined);
    assert.equal(publicSettings.deepseek.apiKey, undefined);
    assert.equal(publicSettings.deepseek.hasApiKey, true);
    assert.equal(publicSettings.deepseek.maskedApiKey, "sk-****abcd");
    assert.equal(privateSettings.deepseek.apiKey, "sk-test-secret-abcd");
    assert.equal(providerOptions.provider, "deepseek");
    assert.equal(providerOptions.deepseek.apiKey, "sk-test-secret-abcd");
    assert.doesNotMatch(JSON.stringify(publicSettings), /sk-test-secret-abcd/);

    const noConfigDir = mkdtempSync(path.join(os.tmpdir(), "fortune-ai-empty-"));
    try {
      const fallbackOptions = loadLocalAiProviderOptions({ settingsDir: noConfigDir, publicRoot: noConfigDir });
      assert.equal(fallbackOptions.provider, "mock");
      const result = await buildNarrative({
        birthDate: "1949-10-01",
        birthTime: "00:00",
        gender: "male",
        targetYear: 2026,
        selectedMonth: 1,
      }, fallbackOptions);
      assert.equal(result.narrative.provider, "mock");
    } finally {
      rmSync(noConfigDir, { recursive: true, force: true });
    }
  } finally {
    rmSync(settingsDir, { recursive: true, force: true });
  }
});

test("AI settings GET route masks stored API keys", async () => {
  const settingsDir = mkdtempSync(path.join(os.tmpdir(), "fortune-ai-route-settings-"));
  const previousDir = process.env.FORTUNE_AI_USER_DATA_DIR;
  process.env.FORTUNE_AI_USER_DATA_DIR = settingsDir;
  try {
    saveAiSettings({
      provider: "deepseek",
      enabled: true,
      deepseek: {
        apiKey: "sk-route-secret-abcd",
        endpoint: "https://api.deepseek.com/chat/completions",
        model: "deepseek-chat",
      },
    });
    const { aiSettingsRoute } = await import("./routes/aiSettingsRoute.js");
    let statusCode = 0;
    let payload = "";
    const response = {
      writeHead(status) {
        statusCode = status;
      },
      end(data) {
        payload = data;
      },
    };
    const handled = await aiSettingsRoute({ method: "GET" }, response, new URL("http://localhost/api/settings/ai"));
    const body = JSON.parse(payload);

    assert.equal(handled, true);
    assert.equal(statusCode, 200);
    assert.equal(body.deepseek.hasApiKey, true);
    assert.equal(body.deepseek.maskedApiKey, "sk-****abcd");
    assert.equal(body.deepseek.apiKey, undefined);
    assert.doesNotMatch(payload, /sk-route-secret-abcd/);
  } finally {
    if (previousDir === undefined) {
      delete process.env.FORTUNE_AI_USER_DATA_DIR;
    } else {
      process.env.FORTUNE_AI_USER_DATA_DIR = previousDir;
    }
    rmSync(settingsDir, { recursive: true, force: true });
  }
});

test("desktop shell can reuse the local server without exposing Node APIs to the renderer", () => {
  const packageJson = JSON.parse(readFileSync("package.json", "utf8"));
  const serverSource = readFileSync("server/server.js", "utf8");
  const desktopMainSource = readFileSync("desktop/main.js", "utf8");
  const preloadSource = readFileSync("desktop/preload.js", "utf8");
  const appServer = createAppServer({ port: 3000 });

  assert.equal(appServer.url, "http://localhost:3000");
  assert.equal(typeof appServer.start, "function");
  assert.equal(typeof appServer.stop, "function");
  assert.equal(typeof appServer.server.close, "function");
  assert.match(serverSource, /export function createAppServer/);
  assert.match(serverSource, /process\.argv\[1\]/);

  assert.equal(packageJson.scripts.dev, "node server/server.js");
  assert.equal(packageJson.scripts.desktop, "electron desktop/main.js");
  assert.equal(packageJson.scripts["package:mac"], "electron-builder --mac");
  assert.equal(packageJson.scripts["package:win"], "electron-builder --win");
  assert.ok(packageJson.devDependencies?.electron);
  assert.ok(packageJson.devDependencies?.["electron-builder"]);
  assert.equal(packageJson.build.productName, "命理断事系统");
  assert.equal(packageJson.build.directories.output, "dist");

  assert.match(desktopMainSource, /BrowserWindow/);
  assert.match(desktopMainSource, /createAppServer/);
  assert.match(desktopMainSource, /3000,\s*3001,\s*3002,\s*3003,\s*3004,\s*3005/);
  assert.match(desktopMainSource, /EADDRINUSE/);
  assert.match(desktopMainSource, /loadURL\(localUrl\)/);
  assert.match(desktopMainSource, /console\.error\(error\)/);
  assert.match(desktopMainSource, /nodeIntegration:\s*false/);
  assert.match(desktopMainSource, /contextIsolation:\s*true/);
  assert.match(desktopMainSource, /preload:/);
  assert.match(desktopMainSource, /stopLocalServer/);
  assert.doesNotMatch(desktopMainSource, /local-deepseek-config\.local\.js|deepseekApiKey|apiKey/);
  assert.doesNotMatch(preloadSource, /contextBridge\.exposeInMainWorld|ipcRenderer|require\(|node:/);
});

function collectTextFiles(entries, { exclude = new Set() } = {}) {
  return entries.flatMap((entry) => {
    if (!existsSync(entry)) return [];
    const stat = statSync(entry);
    if (stat.isDirectory()) {
      return readdirSync(entry).flatMap((name) => collectTextFiles([path.join(entry, name)], { exclude }));
    }
    const normalized = entry.split(path.sep).join("/");
    if (exclude.has(normalized)) return [];
    return [entry];
  });
}

function assertSignalContract(signal, label) {
  const evidence = Array.isArray(signal.evidence) ? signal.evidence : [signal.evidence].filter(Boolean);
  assert.ok(evidence.length > 0, `${label} should keep at least one evidence item`);
  assert.match(signal.confidence, /^(low|medium|high)$/, `${label} should use known confidence level`);
  assert.ok(Array.isArray(signal.needVerify), `${label} should expose needVerify array`);
  assert.ok(signal.needVerify.length > 0, `${label} should keep verification notes`);
}
