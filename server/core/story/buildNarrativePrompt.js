import { storyToneConfig } from "./storyToneConfig.js";

const forbiddenWords = ["一定", "必定", "绝对", "必然", "必离婚", "必发财", "必有灾", "必坐牢", "必死亡"];

export function buildNarrativePrompt({ chart, yearInfluence, monthInfluences = [], storyTags = [], fortuneAnalysis, tone = "default" } = {}) {
  const pickedFortuneAnalysis = pickFortuneAnalysis(fortuneAnalysis);
  return {
    schema: flowReportSchema,
    system: [
      ...baseNarrativeSystemLines(),
      `语气：${storyToneConfig[tone]?.tone ?? storyToneConfig.default.tone}`,
      `禁用词：${forbiddenWords.join("、")}`,
    ].join("\n"),
    user: JSON.stringify({
      fortuneAnalysis: pickedFortuneAnalysis,
      evidencePackage: buildEvidencePackage(pickedFortuneAnalysis, { mode: "year" }),
      referenceOnly: {
        chartJson: chart,
        yearInfluence,
        monthInfluences,
        storyTags,
      },
      yearInfluence,
      output: {
        schema: "title/coreConclusion/luckBackground/yearTrigger/likelyEvents/eventFocus/monthlyHighlights/overallAdvice/boundary",
        order: ["对应时间层级的候选事象", "依据", "现实表现", "强弱", "建议"],
        style: "先取象，再解释；只解释 fortuneAnalysis.mainEvents 中的重点候选事件，每件事都要说明证据、现实表现、时间点和建议。",
        modeInstruction: flowModeInstruction("year"),
      },
    }, null, 2),
  };
}

export const flowReportSchema = {
  type: "object",
  additionalProperties: false,
  required: ["title", "coreConclusion", "luckBackground", "yearTrigger", "likelyEvents", "eventFocus", "monthlyHighlights", "overallAdvice", "boundary"],
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
    likelyEvents: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["event", "conclusion", "probabilityLevel", "timeWindow", "timing", "evidence", "reality", "advice", "verifyBy"],
        properties: {
          event: { type: "string" },
          conclusion: { type: "string" },
          probabilityLevel: { type: "string", enum: ["high", "medium", "low"] },
          timeWindow: { type: "string" },
          timing: { type: "string" },
          evidence: { type: "array", items: { type: "string" } },
          reality: { type: "string" },
          advice: { type: "string" },
          verifyBy: { type: "array", items: { type: "string" } },
        },
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
  const pickedFortuneAnalysis = pickFortuneAnalysis(fortuneAnalysis);
  const modeInstruction = flowModeInstruction(mode);
  return {
    mode,
    schema: flowReportSchema,
    system: [
      ...baseNarrativeSystemLines(),
      `禁用词：${forbiddenWords.join("、")}`,
      `语气：${storyToneConfig[tone]?.tone ?? storyToneConfig.default.tone}；短句、白话、重点明确，但每个判断都必须回到证据。`,
      "只输出一个合法 JSON 对象，字段必须匹配 title、coreConclusion、luckBackground、yearTrigger、likelyEvents、eventFocus、monthlyHighlights、overallAdvice、boundary，不要输出 Markdown。",
    ].join("\n"),
    user: JSON.stringify({
      mode,
      modeLabel: modeLabels[mode] ?? modeLabels.year,
      modeInstruction,
      fortuneAnalysis: pickedFortuneAnalysis,
      evidencePackage: buildEvidencePackage(pickedFortuneAnalysis, { mode, selectedMonthInfluence }),
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
        schema: "title/coreConclusion/luckBackground/yearTrigger/likelyEvents/eventFocus/monthlyHighlights/overallAdvice/boundary",
        order: ["对应时间层级的候选事象", "依据", "现实表现", "强弱", "建议"],
        style: "先取象，再解释；AI 只解释 fortuneAnalysis.mainEvents，不新增本地没有给出的事件，边界提醒只放 boundary。",
        modeInstruction,
      },
    }, null, 2),
  };
}

function baseNarrativeSystemLines() {
  return [
    "你是命理网站的白话解读层，不是排盘层。",
    "你不能重新排盘，不能新增不存在的干支关系，不能补充不存在的干支关系，不能自行改写年份月份。",
    "本地事件引擎已经提供 eventCandidates 和 mainEvents；AI 不再自己判断事件，也不能新增 mainEvents 之外的强判断。",
    "你只能根据 fortuneAnalysis、mainEvents、triggerChains、monthlyHighlights 和 evidencePackage 写解读。",
    "你的任务是把本地事件引擎识别出的 1-3 个重点候选事件翻译成人能听懂的现实语言。",
    "只重点解释 score 最高的 1-3 个 mainEvents；禁止平均解释所有领域。",
    "每条 likelyEvents 都必须对应一个 mainEvent，并包含 conclusion、evidence、reality、timing、advice。",
    "没有 evidenceChain 的事件不能写成强判断，只能放在 boundary 或不写。",
    "少废话，避免重复；同一条依据不要在多个段落换词复述。",
    "事件标题必须像现实里的动作或节点，例如职责调整、合同复核、付款重算、合作重谈、材料补交、出行改期。",
    "输出顺序：先给结论，也就是先讲当前模式对应层级更像发生的事，再讲依据，再讲现实表现，再讲强弱，最后给建议。",
    "禁止确定性断语，禁止使用：一定、必定、绝对、必然、必发财、必离婚、必有灾、必坐牢、必死亡。",
    "禁止编造输入里没有的干支关系。",
    "禁止平均解释 12 个月；只有流月模式才写选中月份，其他模式不要展开月份。",
    "大运模式：只讲十年背景如何承载原局，不要把它写成某一年或某个月的完整报告。",
    "流年模式：只讲当年被大运和原局引动的事件链条，不要复述十二个月流水账。",
    "流月模式：只讲选中月份的短期应期，候选事件和 timeWindow 都要聚焦该月。",
    "禁止只说“事业、关系、情绪、注意沟通、保持积极、谨慎行事”这种空话。",
    "不要每句话都重复边界提醒，把学习边界集中放到 boundary 字段，一句话即可。",
  ];
}

function pickFortuneAnalysis(fortuneAnalysis = {}) {
  return {
    annualTheme: fortuneAnalysis.annualTheme ?? "",
    overallSummary: fortuneAnalysis.overallSummary ?? "",
    selectedLuck: fortuneAnalysis.selectedLuck ?? null,
    luckBackground: fortuneAnalysis.luckBackground ?? {
      conclusion: fortuneAnalysis.decadeTheme ?? "",
      evidence: fortuneAnalysis.decadeEvidence ?? [],
      reality: "大运作为十年背景影响当年事件承接方式。",
    },
    eventCandidates: Array.isArray(fortuneAnalysis.eventCandidates) ? fortuneAnalysis.eventCandidates : [],
    mainEvents: Array.isArray(fortuneAnalysis.mainEvents) ? fortuneAnalysis.mainEvents : [],
    triggerChains: Array.isArray(fortuneAnalysis.triggerChains) ? fortuneAnalysis.triggerChains : [],
    eventScores: fortuneAnalysis.eventScores ?? {},
    monthlyHighlights: Array.isArray(fortuneAnalysis.monthlyHighlights) ? fortuneAnalysis.monthlyHighlights : [],
    lowEvidenceTopics: Array.isArray(fortuneAnalysis.lowEvidenceTopics) ? fortuneAnalysis.lowEvidenceTopics : [],
    advice: Array.isArray(fortuneAnalysis.advice) ? fortuneAnalysis.advice : [],
  };
}

function buildEvidencePackage(fortuneAnalysis = {}, { mode = "year", selectedMonthInfluence } = {}) {
  const mainEvents = Array.isArray(fortuneAnalysis.mainEvents) ? fortuneAnalysis.mainEvents : [];
  const eventScores = Object.entries(fortuneAnalysis.eventScores ?? {})
    .sort((a, b) => Number(b[1]?.score || 0) - Number(a[1]?.score || 0))
    .slice(0, 5)
    .map(([topic, value]) => ({
      topic,
      score: Number(value?.score || 0),
      evidence: Array.isArray(value?.evidence) ? value.evidence.slice(0, 4) : [],
    }));
  const triggerChains = Array.isArray(fortuneAnalysis.triggerChains) ? fortuneAnalysis.triggerChains.slice(0, 12) : [];
  const monthlyHighlights = Array.isArray(fortuneAnalysis.monthlyHighlights) ? fortuneAnalysis.monthlyHighlights.slice(0, 5) : [];
  const selectedMonth = Number(selectedMonthInfluence?.month || 0);
  const pickedMonthlyHighlights = mode === "month" && selectedMonth
    ? monthlyHighlights.filter((month) => Number(month.month) === selectedMonth)
    : mode === "luck" || mode === "year" ? [] : monthlyHighlights;
  const modeTriggerChains = mode === "luck" || mode === "month" ? [] : triggerChains;
  const modeEventScores = mode === "luck"
    ? inferPromptScoresFromEvidence(fortuneAnalysis.luckBackground?.evidence, fortuneAnalysis.decadeRiskTags, fortuneAnalysis.decadeSupportScore)
    : mode === "month"
      ? inferPromptScoresFromEvidence(pickedMonthlyHighlights.flatMap((month) => month.reasons || selectedMonthInfluence?.evidence || []), [], pickedMonthlyHighlights[0]?.score)
      : eventScores;
  return {
    role: "本地年度事件证据包；AI 只能解释 mainEvents，不允许补充不存在的干支关系或新增事件。",
    mode,
    modeInstruction: flowModeInstruction(mode),
    luckBackground: fortuneAnalysis.luckBackground,
    mainEvents: mainEvents.slice(0, 3).map((event) => ({
      eventType: event.eventType,
      score: event.score,
      level: event.level,
      confidence: event.confidence,
      evidenceChain: Array.isArray(event.evidenceChain) ? event.evidenceChain.slice(0, 6) : [],
      possibleManifestations: Array.isArray(event.possibleManifestations) ? event.possibleManifestations.slice(0, 5) : [],
      timing: Array.isArray(event.timing) ? event.timing.slice(0, 5) : [],
    })),
    triggerChains: modeTriggerChains.map((chain) => ({
      level: chain.level,
      type: chain.type,
      source: chain.source,
      target: chain.target,
      topicHints: chain.topicHints,
      strength: chain.strength,
      reason: chain.reason,
      tags: chain.tags,
      weight: chain.weight,
      evidence: chain.evidence,
      realityMapping: chain.realityMapping,
    })),
    topEventScores: mainEvents.length
      ? mainEvents.slice(0, 3).map((event) => ({
        topic: event.eventType,
        score: event.score,
        evidence: Array.isArray(event.evidenceChain) ? event.evidenceChain.slice(0, 4) : [],
      }))
      : modeEventScores,
    selectedMonth: mode === "month" ? {
      month: selectedMonth || selectedMonthInfluence?.month,
      pillar: selectedMonthInfluence?.pillar?.label || selectedMonthInfluence?.pillar,
      evidence: selectedMonthInfluence?.evidence,
    } : null,
    timeWindows: pickedMonthlyHighlights.map((month) => ({
      month: month.month,
      pillar: month.pillar,
      intensity: month.intensity,
      reasons: month.reasons,
    })),
  };
}

function inferPromptScoresFromEvidence(evidence = [], tags = [], score = 55) {
  const evidenceText = Array.isArray(evidence) ? evidence.join(" ") : String(evidence || "");
  const topics = [
    ...new Set([
      ...(Array.isArray(tags) ? tags : []).filter((tag) => ["career", "wealth", "relationship", "study", "health", "movement", "social"].includes(tag)),
      ...topicHintsFromText(evidenceText),
    ]),
  ];
  const picked = topics.length ? topics : ["career", "study", "social"];
  return picked.slice(0, 5).map((topic, index) => ({
    topic,
    score: Math.max(35, Math.min(100, Number(score || 55) - index * 5)),
    evidence: Array.isArray(evidence) && evidence.length ? evidence.slice(0, 4) : ["当前模式只使用本层级证据。"],
  }));
}

function topicHintsFromText(text = "") {
  const topics = [];
  if (/官|杀|规则|职责|流程|事业|任务/.test(text)) topics.push("career");
  if (/财|资源|收支|付款|报价|预算/.test(text)) topics.push("wealth");
  if (/关系|合作|夫妻|亲密/.test(text)) topics.push("relationship");
  if (/印|食神|伤官|学习|表达|文书|作品|证照/.test(text)) topics.push("study");
  if (/害|刑|穿|压力|作息|体感|安全/.test(text)) topics.push("health");
  if (/冲|迁移|搬动|出行|地点|通勤/.test(text)) topics.push("movement");
  if (/比肩|劫财|同辈|团队|朋友|人际/.test(text)) topics.push("social");
  return topics;
}

function flowModeInstruction(mode = "year") {
  if (mode === "luck") return "大运报告只回答：这步大运给原局带来什么十年背景、哪些领域被长期放大、阶段里反复出现什么候选事象。";
  if (mode === "month") return "流月报告只回答：选中月份发生什么短期应期，本月哪些事变明显，不平均解释其他月份。";
  return "流年报告只回答：这一年自身触发了什么候选事件、依据是什么、现实中可能表现成什么。";
}
