import { forbiddenWords } from "../security/outputSanitizer.js";

export function buildChatPrompt(input = {}) {
  const question = String(input.question ?? "").trim().slice(0, 800);
  const context = pickChatContext(input.context);
  return {
    system: [
      "你是一个通用 AI 助手，同时也可以参考当前八字排盘页面。",
      "当前命理页面定位为面向专业命理师傅的结构化研判辅助工具，目标是整理断事证据链、现实应象和复核条件。",
      "用户可以问任何合理问题，不要把回答限制在网页内容、命盘内容、数据库内容或当前页面内容内。",
      "当前页面传入的 chart、coreSignals、transitSignals、monthSignals、storyTags 和岁运选择只是可选参考，不是唯一依据。",
      "如果用户问题与八字、命盘、流年、流月、当前页面有关，可以结合页面上下文回答。",
      "如果用户问题与当前页面无关，请直接按通用 AI 正常回答，不要说只能基于页面内容回答。",
      "不能重新排盘，除非用户明确要求重新排盘并提供出生信息。",
      "涉及命理判断时，请按专业研判口径回答：先说主断倾向，再说断法依据、现实应象、成立条件和反证条件；涉及普通知识、代码、学习、生活问题时，按正常 AI 助手回答。",
      "命理相关内容不能只按常规象义猜测现实，必须说明证据链和师傅复核点。",
      `命理类高风险断语尽量避免：${forbiddenWords.join("、")}`,
      "回答要自然、清楚、直接。不要输出 API key、配置字段或调试信息。",
    ].join("\n"),
    user: JSON.stringify({
      question,
      recentHistory: normalizeHistory(input.history),
      currentSelection: {
        targetYear: input.state?.targetYear ?? context.yearInfluence?.year,
        selectedMonth: input.state?.selectedMonth ?? context.selectedMonthInfluence?.month,
        selectedLuck: context.selectedLuck?.label,
      },
      context,
      output: {
        style: "中文白话，像给专业师傅整理研判草稿。命理问题必须写清主断倾向、断法依据、现实应象、成立条件和反证条件。",
        maxLength: "500 Chinese characters",
      },
    }, null, 2),
  };
}

function pickChatContext(context = {}) {
  return {
    chart: context.chart,
    coreSignals: context.coreSignals,
    transitSignals: context.transitSignals,
    monthSignals: context.monthSignals,
    selectedLuck: context.selectedLuck,
    yearInfluence: context.yearInfluence,
    selectedMonthInfluence: context.selectedMonthInfluence,
    storyTags: Array.isArray(context.storyTags) ? context.storyTags.slice(0, 24) : [],
  };
}

function normalizeHistory(history = []) {
  if (!Array.isArray(history)) return [];
  return history.slice(-8).map((item) => ({
    role: item?.role === "assistant" ? "assistant" : "user",
    content: String(item?.content ?? "").slice(0, 500),
  }));
}
