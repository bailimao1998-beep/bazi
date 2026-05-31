import test from "node:test";
import assert from "node:assert/strict";
import { buildOfflineAnalysisPrompt, findSimilarCases, summarizeReadingForAi } from "./offlineAi.js";

test("finds similar local cases by chart tags and matched rules", () => {
  const reading = {
    natal: {
      pillars: {
        year: { label: "壬申" },
        month: { label: "戊申" },
        day: { label: "丙寅" },
        hour: { label: "乙未" },
      },
      dayMaster: "丙",
      patternCandidates: [{ name: "七杀格" }],
      combinations: [{ title: "年柱壬申 与 日柱丙寅：地支六冲", effect: "冲" }],
      matchedRules: [{ title: "申寅冲", category: "branch_pair_relation" }],
      starSignals: [{ name: "驿马" }],
    },
    luck: { directionLabel: "顺行", startAge: 7, pillars: [{ label: "己酉", startAge: 7, endAge: 16 }] },
    transit: { selectedYear: { label: "丙午" }, selectedMonth: { label: "癸巳" }, hits: [] },
    topics: [{ label: "事业", paragraphs: ["事业看官杀印食配合"], signals: ["七杀：候选"] }],
  };
  const cases = [
    { id: "case-weak", title: "无关案例", tags: ["正印"], analysis: "无关" },
    { id: "case-strong", title: "申寅冲迁动案例", tags: ["申寅冲", "七杀格", "驿马"], analysis: "迁动明显" },
  ];

  const matches = findSimilarCases(reading, cases, 1);

  assert.equal(matches.length, 1);
  assert.equal(matches[0].id, "case-strong");
  assert.ok(matches[0].score > 0);
  assert.ok(matches[0].matchedTags.includes("申寅冲"));
});

test("builds an offline-only prompt with chart summary and case evidence", () => {
  const readingSummary = summarizeReadingForAi({
    natal: {
      pillars: {
        year: { label: "壬申" },
        month: { label: "戊申" },
        day: { label: "丙寅" },
        hour: { label: "乙未" },
      },
      dayMaster: "丙",
      chartMeta: { nayin: { day: "炉中火" }, voidBranches: { day: ["戌", "亥"] } },
      patternCandidates: [{ name: "七杀格", summary: "以七杀成格" }],
      strengthSignals: [{ label: "火", seasonalStatus: "囚", interpretation: "火在申月为囚" }],
      matchedRules: [{ title: "申寅冲", category: "branch_pair_relation", interpretation: "迁动明显" }],
      starSignals: [{ name: "驿马", basis: "申属申子辰" }],
      referenceKnowledgeHits: [
        {
          title: "资料卡：申寅冲迁动",
          summary: "申寅冲多看迁移、职业路径和外部压力。",
          interpretation: "命中申寅冲时，把动象和职业变化列入重点。",
          sourceRefs: [{ sourceId: "cui-blind-notes-5000", pageStart: 21, pageEnd: 22 }],
        },
      ],
    },
    luck: { directionLabel: "顺行", startAge: 7, pillars: [{ label: "己酉", startAge: 7, endAge: 16 }] },
    transit: { selectedYear: { label: "丙午" }, selectedMonth: { label: "癸巳" }, hits: [] },
    topics: [],
  });
  const prompt = buildOfflineAnalysisPrompt({
    promptTemplate: {
      system: "你是离线命理分析助手。",
      outputSections: ["总论", "依据", "提醒"],
      safetyRules: ["不得编造外部案例。"],
    },
    readingSummary,
    similarCases: [{ id: "case-strong", title: "申寅冲迁动案例", matchedTags: ["申寅冲"], analysis: "迁动明显" }],
  });

  assert.match(prompt, /完全离线/);
  assert.match(prompt, /不得编造外部案例/);
  assert.match(prompt, /壬申 戊申 丙寅 乙未/);
  assert.match(prompt, /申寅冲迁动案例/);
  assert.match(prompt, /资料卡：申寅冲迁动/);
  assert.match(prompt, /cui-blind-notes-5000:21-22/);
});

test("includes judgement overview, transit layers, and case reasons in offline prompt", () => {
  const readingSummary = summarizeReadingForAi({
    natal: {
      pillars: {
        year: { label: "壬申" },
        month: { label: "戊申" },
        day: { label: "丙寅" },
        hour: { label: "乙未" },
      },
      dayMaster: "丙",
      chartMeta: { nayin: { day: "炉中火" }, voidBranches: { day: ["戌", "亥"] } },
      patternCandidates: [],
      strengthSignals: [],
      matchedRules: [],
      starSignals: [],
      referenceKnowledgeHits: [],
    },
    luck: { directionLabel: "顺行", startAge: 7, pillars: [{ label: "己酉", startAge: 7, endAge: 16 }] },
    transit: { selectedYear: { label: "丙午" }, selectedMonth: { label: "癸巳" }, hits: [] },
    topics: [],
    judgement: {
      overview: {
        conclusions: ["综合判断：日主偏弱，先看印比承接。"],
      },
      transit: {
        majorLuck: { summary: "大运己酉作为十年环境，增强金土主题。" },
        annual: { summary: "流年丙午触发火气和事业表达。" },
        monthly: { summary: "流月癸巳细化到出行与合作窗口。" },
      },
      domains: [
        {
          label: "事业",
          sections: {
            主题判断: "事业先看官杀印食配合。",
            触发依据: "流年丙午触发事业证据。",
            强弱取舍: "日主承载不足，需印比承接。",
            提醒建议: "先稳住资源边界。",
          },
          signals: ["事业证据 2 条"],
        },
      ],
      evidence: [
        {
          title: "流年丙午触发事业",
          layer: "annual",
          category: "transit",
          interpretation: "流年把事业主题推到前面。",
          evidenceLevel: "derived",
          status: "active",
          sourceIds: ["test-source"],
        },
      ],
      caseSignals: [
        {
          id: "case-flow",
          title: "丙午流年事业变化案例",
          matchedTags: ["流年", "事业"],
          reasons: ["命中标签：流年、事业", "命中 2026 年事件：岗位变化"],
          analysis: "流年触发时，事业事件更明显。",
        },
      ],
    },
  });

  const prompt = buildOfflineAnalysisPrompt({
    promptTemplate: {
      system: "你是离线命理分析助手。",
      outputSections: ["总论", "岁运", "案例"],
      safetyRules: [],
    },
    readingSummary,
    similarCases: readingSummary.judgement.caseSignals,
  });

  assert.match(prompt, /综合判断：日主偏弱/);
  assert.match(prompt, /大运己酉作为十年环境/);
  assert.match(prompt, /流年丙午触发火气/);
  assert.match(prompt, /流月癸巳细化/);
  assert.match(prompt, /事业先看官杀印食配合/);
  assert.match(prompt, /命中原因：命中标签：流年、事业；命中 2026 年事件：岗位变化/);
});
