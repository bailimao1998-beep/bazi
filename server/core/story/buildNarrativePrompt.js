import { storyToneConfig } from "./storyToneConfig.js";

const forbiddenWords = ["一定", "必定", "绝对", "必然", "必离婚", "必发财", "必有灾", "必坐牢", "必死亡"];

export function buildNarrativePrompt({ chart, yearInfluence, monthInfluences = [], storyTags = [], tone = "default" } = {}) {
  return {
    system: [
      "你是命理剧情解读系统的叙事层。",
      "不能重新排盘，不能新增命盘信息，不能自行判断年份月份。",
      "只能根据本地 chartJson、yearInfluence、monthInfluences、storyTags 讲成故事。",
      `语气：${storyToneConfig[tone]?.tone ?? storyToneConfig.default.tone}`,
      `禁用词：${forbiddenWords.join("、")}`,
    ].join("\n"),
    user: JSON.stringify({
      chartJson: chart,
      yearInfluence,
      monthInfluences,
      storyTags,
      output: {
        sections: ["基础盘", "年度主线", "12个月剧情", "关键月份", "建议"],
        style: "有时间线，有情绪价值，但保留观察和验证语气。",
      },
    }, null, 2),
  };
}

export const flowReportSchema = {
  type: "object",
  additionalProperties: false,
  required: ["summary", "keySignals", "likelyThemes", "cautions", "verificationLimits"],
  properties: {
    summary: { type: "string" },
    keySignals: { type: "array", items: { type: "string" } },
    likelyThemes: { type: "array", items: { type: "string" } },
    cautions: { type: "array", items: { type: "string" } },
    verificationLimits: { type: "array", items: { type: "string" } },
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
  tone = "default",
} = {}) {
  const modeLabels = { luck: "大运阶段取象", year: "流年年度取象", month: "流月短期取象" };
  return {
    mode,
    schema: flowReportSchema,
    system: [
      "你是命理结构化学习网站的 AI 辅助取象层。",
      "不能重新排盘，不能补充不存在的干支关系，不能自行改写年份月份。",
      "只能根据本地规则给出的 chart、coreSignals、transitSignals、monthSignals 和当前岁运选择来润色。",
      "禁止确定性断语，不能断吉凶，不能把候选信号写成最终断命。",
      "所有输出都要保留“不能单独作为结论”的学习型边界。",
      `禁用词：${forbiddenWords.join("、")}`,
      `语气：${storyToneConfig[tone]?.tone ?? storyToneConfig.default.tone}；短句、白话、重点明确，允许强判断感的候选结论。`,
      "只输出一个合法 JSON 对象，字段必须匹配 summary、keySignals、likelyThemes、cautions、verificationLimits，不要输出 Markdown。",
    ].join("\n"),
    user: JSON.stringify({
      mode,
      modeLabel: modeLabels[mode] ?? modeLabels.year,
      chart,
      coreSignals,
      transitSignals,
      monthSignals,
      selectedLuck,
      yearInfluence,
      selectedMonthInfluence,
      output: {
        schema: "summary/keySignals/likelyThemes/cautions/verificationLimits",
        style: "像老师点重点，但必须写成候选信号和观察建议。",
      },
    }, null, 2),
  };
}
