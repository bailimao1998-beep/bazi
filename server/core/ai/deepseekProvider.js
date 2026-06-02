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
          const report = createPlaceholderFlowReport(prompt.mode);
          return { provider: name, text: report.summary, report };
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
        const report = parseFlowReport(text, prompt.mode);
        return { provider: name, text: report.summary, report };
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

function parseFlowReport(text, mode) {
  try {
    return normalizeFlowReport(JSON.parse(text), mode);
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
    summary: `${label}DeepSeek辅助报告：当前未配置 DEEPSEEK_API_KEY，先返回本地占位取象，不能单独作为结论。`,
    keySignals: ["本地矩阵已经列出可观察的岁运触发点。"],
    likelyThemes: ["可围绕阶段背景、现实事务、情绪节奏与关系互动继续观察。"],
    cautions: ["DeepSeek 层只做语言整理，不重新排盘，也不补充不存在的干支关系。"],
    verificationLimits: ["仍需结合原局、大运、流年、流月与现实反馈综合验证。"],
  };
}
