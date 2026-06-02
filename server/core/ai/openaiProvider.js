export function createOpenaiProvider(config = {}) {
  return {
    name: "openai",
    async generate({ prompt }) {
      const apiKey = config.apiKey ?? process.env.OPENAI_API_KEY;
      if (!apiKey) {
        if (prompt?.mode) {
          const report = createPlaceholderFlowReport(prompt.mode);
          return { provider: "openai", text: report.summary, report };
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
        const report = parseFlowReport(text, prompt.mode);
        return { provider: "openai", text: report.summary, report };
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

function parseFlowReport(text, mode) {
  try {
    const parsed = JSON.parse(text);
    return normalizeFlowReport(parsed, mode);
  } catch {
    const fallback = createPlaceholderFlowReport(mode);
    return { ...fallback, summary: text || fallback.summary };
  }
}

function normalizeFlowReport(report = {}, mode) {
  const fallback = createPlaceholderFlowReport(mode);
  return {
    summary: typeof report.summary === "string" && report.summary.trim() ? report.summary : fallback.summary,
    keySignals: normalizeList(report.keySignals, fallback.keySignals),
    likelyThemes: normalizeList(report.likelyThemes, fallback.likelyThemes),
    cautions: normalizeList(report.cautions, fallback.cautions),
    verificationLimits: normalizeList(report.verificationLimits, fallback.verificationLimits),
  };
}

function normalizeList(value, fallback) {
  return Array.isArray(value) && value.length ? value.map((item) => String(item)) : fallback;
}

function createPlaceholderFlowReport(mode) {
  const labels = { luck: "大运", year: "流年", month: "流月" };
  const label = labels[mode] ?? "岁运";
  return {
    summary: `${label}AI辅助报告：当前未配置 OPENAI_API_KEY，先返回本地占位取象，不能单独作为结论。`,
    keySignals: ["本地矩阵已经列出可观察的岁运触发点。"],
    likelyThemes: ["可围绕阶段背景、现实事务、情绪节奏与关系互动继续观察。"],
    cautions: ["AI层只做语言整理，不重新排盘，也不补充不存在的干支关系。"],
    verificationLimits: ["仍需结合原局、大运、流年、流月与现实反馈综合验证。"],
  };
}
