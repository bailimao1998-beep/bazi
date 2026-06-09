import { storyToneConfig } from "./storyToneConfig.js";

const forbiddenWords = ["一定", "必定", "绝对", "必然", "必离婚", "必发财", "必有灾", "必坐牢", "必死亡"];

export function buildNarrativePrompt({ chart, yearInfluence, monthInfluences = [], storyTags = [], fortuneAnalysis, tone = "default" } = {}) {
  return {
    schema: flowReportSchema,
    system: [
      ...baseNarrativeSystemLines(),
      `语气：${storyToneConfig[tone]?.tone ?? storyToneConfig.default.tone}`,
      `禁用词：${forbiddenWords.join("、")}`,
    ].join("\n"),
    user: JSON.stringify({
      fortuneAnalysis: pickFortuneAnalysis(fortuneAnalysis),
      referenceOnly: {
        chartJson: chart,
        yearInfluence,
        monthInfluences,
        storyTags,
      },
      yearInfluence,
      output: {
        schema: "title/coreConclusion/luckBackground/yearTrigger/eventFocus/monthlyHighlights/overallAdvice/boundary",
        order: ["结论", "依据", "现实表现", "强弱", "重点月份", "建议"],
        style: "先取象，再解释；只把本地规则判断翻译成人能听懂的现实语言。",
      },
    }, null, 2),
  };
}

export const flowReportSchema = {
  type: "object",
  additionalProperties: false,
  required: ["title", "coreConclusion", "luckBackground", "yearTrigger", "eventFocus", "monthlyHighlights", "overallAdvice", "boundary"],
  properties: {
    title: { type: "string" },
    coreConclusion: { type: "string" },
    luckBackground: {
      type: "object",
      additionalProperties: false,
      required: ["conclusion", "evidence", "reality"],
      properties: {
        conclusion: { type: "string" },
        evidence: { type: "array", items: { type: "string" } },
        reality: { type: "string" },
      },
    },
    yearTrigger: {
      type: "object",
      additionalProperties: false,
      required: ["conclusion", "evidence", "reality"],
      properties: {
        conclusion: { type: "string" },
        evidence: { type: "array", items: { type: "string" } },
        reality: { type: "string" },
      },
    },
    eventFocus: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["topic", "level", "conclusion", "evidence", "reality", "advice"],
        properties: {
          topic: { type: "string", enum: ["career", "wealth", "relationship", "study", "health", "movement", "social"] },
          level: { type: "string", enum: ["high", "medium", "low"] },
          conclusion: { type: "string" },
          evidence: { type: "array", items: { type: "string" } },
          reality: { type: "string" },
          advice: { type: "string" },
        },
      },
    },
    monthlyHighlights: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["month", "level", "theme", "evidence", "reality", "advice"],
        properties: {
          month: { type: "number" },
          level: { type: "string", enum: ["high", "medium", "low"] },
          theme: { type: "string" },
          evidence: { type: "array", items: { type: "string" } },
          reality: { type: "string" },
          advice: { type: "string" },
        },
      },
    },
    overallAdvice: { type: "array", items: { type: "string" } },
    boundary: { type: "string" },
  },
};

export function buildFlowNarrativePrompt({
  mode = "year",
  chart,
  coreSignals,
  transitSignals,
  monthSignals,
  selectedLuck,
  yearInfluence,
  selectedMonthInfluence,
  fortuneAnalysis,
  tone = "default",
} = {}) {
  const modeLabels = { luck: "大运阶段取象", year: "流年年度取象", month: "流月短期取象" };
  return {
    mode,
    schema: flowReportSchema,
    system: [
      ...baseNarrativeSystemLines(),
      `禁用词：${forbiddenWords.join("、")}`,
      `语气：${storyToneConfig[tone]?.tone ?? storyToneConfig.default.tone}；短句、白话、重点明确，但每个判断都必须回到证据。`,
      "只输出一个合法 JSON 对象，字段必须匹配 title、coreConclusion、luckBackground、yearTrigger、eventFocus、monthlyHighlights、overallAdvice、boundary，不要输出 Markdown。",
    ].join("\n"),
    user: JSON.stringify({
      mode,
      modeLabel: modeLabels[mode] ?? modeLabels.year,
      fortuneAnalysis: pickFortuneAnalysis(fortuneAnalysis),
      referenceOnly: {
        chart,
        coreSignals,
        transitSignals,
        monthSignals,
        selectedLuck,
        yearInfluence,
        selectedMonthInfluence,
      },
      output: {
        schema: "title/coreConclusion/luckBackground/yearTrigger/eventFocus/monthlyHighlights/overallAdvice/boundary",
        order: ["结论", "依据", "现实表现", "强弱", "重点月份", "建议"],
        style: "先取象，再解释；边界提醒只放 boundary，不要每段重复。",
      },
    }, null, 2),
  };
}

function baseNarrativeSystemLines() {
  return [
    "你是命理网站的白话解读层，不是排盘层。",
    "你不能重新排盘，不能新增不存在的干支关系，不能补充不存在的干支关系，不能自行改写年份月份。",
    "你只能根据 fortuneAnalysis、triggerChains、eventScores、monthlyHighlights 写解读。",
    "你的任务是把本地规则判断翻译成人能听懂的现实语言。",
    "输出顺序：先给结论，再讲依据，再讲现实表现，再讲强弱，再讲重点月份，最后给建议。",
    "禁止确定性断语，禁止使用：一定、必定、绝对、必然、必发财、必离婚、必有灾、必坐牢、必死亡。",
    "禁止编造输入里没有的干支关系。",
    "禁止平均解释 12 个月，只能写 fortuneAnalysis.monthlyHighlights 中的重点月份。",
    "禁止只说“注意沟通、保持积极、谨慎行事”这种空话。",
    "不要每句话都重复边界提醒，把学习边界集中放到 boundary 字段，一句话即可。",
  ];
}

function pickFortuneAnalysis(fortuneAnalysis = {}) {
  return {
    annualTheme: fortuneAnalysis.annualTheme ?? "",
    overallSummary: fortuneAnalysis.overallSummary ?? "",
    luckBackground: fortuneAnalysis.luckBackground ?? {
      conclusion: fortuneAnalysis.decadeTheme ?? "",
      evidence: fortuneAnalysis.decadeEvidence ?? [],
      reality: "大运作为十年背景影响当年事件承接方式。",
    },
    triggerChains: Array.isArray(fortuneAnalysis.triggerChains) ? fortuneAnalysis.triggerChains : [],
    eventScores: fortuneAnalysis.eventScores ?? {},
    monthlyHighlights: Array.isArray(fortuneAnalysis.monthlyHighlights) ? fortuneAnalysis.monthlyHighlights : [],
    advice: Array.isArray(fortuneAnalysis.advice) ? fortuneAnalysis.advice : [],
  };
}
