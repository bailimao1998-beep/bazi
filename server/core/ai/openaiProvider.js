import { buildReadableAiReportFromPrompt, sanitizeReport } from "../story/eventCandidates.js";

export function createOpenaiProvider(config = {}) {
  return {
    name: "openai",
    async generate({ prompt }) {
      const apiKey = config.apiKey ?? process.env.OPENAI_API_KEY;
      if (!apiKey) {
        if (prompt?.mode) {
          const report = buildReadableAiReportFromPrompt(prompt);
          return { provider: "openai", text: report.coreConclusion, report, isPlaceholder: true };
        }
        return { provider: "openai", text: "openai provider 未配置 apiKey，当前使用占位响应。" };
      }

      const response = await fetch(config.endpoint ?? "https://api.openai.com/v1/responses", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify(buildRequestBody(config, prompt)),
      });
      const data = await response.json();
      const text = data.output_text ?? data.output?.flatMap((item) => item.content ?? []).find((item) => item.type === "output_text")?.text ?? "";
      if (prompt?.mode) {
        const report = parseFlowReport(text, prompt);
        return { provider: "openai", text: report.coreConclusion, report, isPlaceholder: false };
      }
      return { provider: "openai", text };
    },
  };
}

function buildRequestBody(config, prompt = {}) {
  const base = {
    model: config.model ?? "gpt-4o-mini",
    input: [
      { role: "system", content: prompt.system },
      { role: "user", content: prompt.user },
    ],
  };
  if (!prompt.schema) return base;
  return {
    ...base,
    text: {
      format: {
        type: "json_schema",
        name: "structured_bazi_flow_report",
        strict: true,
        schema: prompt.schema,
      },
    },
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
