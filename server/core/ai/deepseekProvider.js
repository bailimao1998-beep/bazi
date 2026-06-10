import { buildReadableAiReportFromPrompt, sanitizeReport } from "../story/eventCandidates.js";

export function createDeepseekProvider(config = {}) {
  return createHttpProvider({
    name: "deepseek",
    endpoint: config.endpoint ?? "https://api.deepseek.com/chat/completions",
    apiKey: config.apiKey ?? process.env.DEEPSEEK_API_KEY,
    model: config.model ?? "deepseek-v4-flash",
  });
}

function createHttpProvider({ name, endpoint, apiKey, model }) {
  return {
    name,
    async generate({ prompt }) {
      if (!apiKey) {
        if (prompt?.mode) {
          const report = buildReadableAiReportFromPrompt(prompt);
          return { provider: name, text: report.coreConclusion, report, isPlaceholder: true };
        }
        return { provider: name, text: `${name} provider 未配置 apiKey，当前使用占位响应。` };
      }
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify(buildRequestBody(model, prompt)),
      });
      const data = await response.json();
      const text = data.choices?.[0]?.message?.content ?? "";
      if (prompt?.mode) {
        const report = parseFlowReport(text, prompt);
        return { provider: name, text: report.coreConclusion, report, isPlaceholder: false };
      }
      return { provider: name, text };
    },
  };
}

function buildRequestBody(model, prompt = {}) {
  const body = {
    model,
    messages: [
      { role: "system", content: prompt.schema ? `${prompt.system}\n只输出一个合法 JSON 对象，不要输出 Markdown。` : prompt.system },
      { role: "user", content: prompt.user },
    ],
  };
  if (!prompt.schema) return body;
  return {
    ...body,
    response_format: { type: "json_object" },
  };
}

function parseFlowReport(text, prompt) {
  try {
    return normalizeFlowReport(JSON.parse(text), prompt);
  } catch {
    const fallback = buildReadableAiReportFromPrompt(prompt);
    return text ? { ...fallback, coreConclusion: text } : fallback;
  }
}

function normalizeFlowReport(report = {}, prompt) {
  const fallback = buildReadableAiReportFromPrompt(prompt);
  return sanitizeReport({
    title: normalizeText(report.title, fallback.title),
    coreConclusion: normalizeText(report.coreConclusion, fallback.coreConclusion),
    luckBackground: normalizeBlock(report.luckBackground, fallback.luckBackground),
    yearTrigger: normalizeBlock(report.yearTrigger, fallback.yearTrigger),
    likelyEvents: normalizeLikelyEvents(report.likelyEvents, fallback.likelyEvents),
    eventFocus: normalizeEventFocus(report.eventFocus, fallback.eventFocus),
    monthlyHighlights: normalizeMonths(report.monthlyHighlights, fallback.monthlyHighlights),
    overallAdvice: normalizeList(report.overallAdvice, fallback.overallAdvice),
    boundary: normalizeText(report.boundary, fallback.boundary),
  });
}

function normalizeList(value, fallback) {
  return Array.isArray(value) && value.length ? value.map((item) => String(item)) : fallback;
}

function normalizeBlock(value, fallback) {
  return {
    conclusion: normalizeText(value?.conclusion, fallback.conclusion),
    evidence: normalizeList(value?.evidence, fallback.evidence),
    reality: normalizeText(value?.reality, fallback.reality),
  };
}

function normalizeEventFocus(value, fallback) {
  if (!Array.isArray(value) || !value.length) return fallback;
  return value.map((item, index) => {
    const fallbackItem = fallback[index] ?? fallback[0];
    return {
      topic: normalizeEnum(item?.topic, ["career", "wealth", "relationship", "study", "health", "movement", "social"], fallbackItem.topic),
      level: normalizeEnum(item?.level, ["high", "medium", "low"], fallbackItem.level),
      conclusion: normalizeText(item?.conclusion, fallbackItem.conclusion),
      evidence: normalizeList(item?.evidence, fallbackItem.evidence),
      reality: normalizeText(item?.reality, fallbackItem.reality),
      advice: normalizeText(item?.advice, fallbackItem.advice),
    };
  });
}

function normalizeLikelyEvents(value, fallback) {
  if (!Array.isArray(value) || !value.length) return fallback;
  return value.map((item, index) => {
    const fallbackItem = fallback[index] ?? fallback[0];
    return {
      event: normalizeText(item?.event, fallbackItem.event),
      conclusion: normalizeText(item?.conclusion, fallbackItem.conclusion),
      probabilityLevel: normalizeEnum(item?.probabilityLevel, ["high", "medium", "low"], fallbackItem.probabilityLevel),
      timeWindow: normalizeText(item?.timeWindow, fallbackItem.timeWindow),
      timing: normalizeText(item?.timing, fallbackItem.timing),
      evidence: normalizeList(item?.evidence, fallbackItem.evidence),
      reality: normalizeText(item?.reality, fallbackItem.reality),
      advice: normalizeText(item?.advice, fallbackItem.advice),
      verifyBy: normalizeList(item?.verifyBy, fallbackItem.verifyBy),
      boundary: normalizeText(item?.boundary, fallbackItem.boundary),
    };
  });
}

function normalizeMonths(value, fallback) {
  if (!Array.isArray(value) || !value.length) return fallback;
  return value.map((item, index) => {
    const fallbackItem = fallback[index] ?? fallback[0];
    return {
      month: Number(item?.month || fallbackItem.month),
      level: normalizeEnum(item?.level, ["high", "medium", "low"], fallbackItem.level),
      theme: normalizeText(item?.theme, fallbackItem.theme),
      evidence: normalizeList(item?.evidence, fallbackItem.evidence),
      reality: normalizeText(item?.reality, fallbackItem.reality),
      advice: normalizeText(item?.advice, fallbackItem.advice),
    };
  });
}

function normalizeText(value, fallback) {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function normalizeEnum(value, allowed, fallback) {
  return allowed.includes(value) ? value : fallback;
}
