import { buildEventCandidateReportFromPrompt } from "../story/eventCandidates.js";

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
          const report = buildEventCandidateReportFromPrompt(prompt);
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
    scenarios: normalizeScenarios(report.scenarios, fallback.scenarios),
  };
}

function normalizeList(value, fallback) {
  return Array.isArray(value) && value.length ? value.map((item) => String(item)) : fallback;
}

function normalizeScenarios(value, fallback) {
  if (!Array.isArray(value) || !value.length) return fallback;
  return value.map((scenario, index) => {
    const fallbackScenario = fallback[index] ?? fallback[0];
    return {
      title: normalizeText(scenario?.title, fallbackScenario.title),
      evidence: normalizeList(scenario?.evidence, fallbackScenario.evidence),
      lifeSignals: normalizeList(scenario?.lifeSignals, fallbackScenario.lifeSignals),
      verification: normalizeList(scenario?.verification, fallbackScenario.verification),
      boundary: normalizeText(scenario?.boundary, fallbackScenario.boundary),
    };
  });
}

function normalizeText(value, fallback) {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function createPlaceholderFlowReport(mode) {
  const labels = { luck: "大运", year: "流年", month: "流月" };
  const label = labels[mode] ?? "岁运";
  return {
    summary: `${label}咨询总览：当前未配置 DEEPSEEK_API_KEY，先按本地证据链给出候选事象，不能单独作为结论。`,
    keySignals: ["证据链 -> 本地矩阵已经列出岁运触发点；候选事象 -> 重点复核职责变化、收支安排、合作摩擦、搬动出行和作息体感波动。"],
    likelyThemes: ["候选事象：工作职责变化、合同手续复核、收支安排、合作摩擦、搬动出行、作息体感波动。"],
    cautions: ["DeepSeek 层只做咨询式整理，不重新排盘，也不补充不存在的干支关系。"],
    verificationLimits: ["现实验证仍需结合原局、大运、流年、流月与实际反馈综合观察。"],
    scenarios: createPlaceholderScenarios(label, mode),
  };
}

function createPlaceholderScenarios(label, mode) {
  const base = [
    {
      title: `${label}候选方向：职责资源与手续复核`,
      evidence: [`证据链 -> ${label}层级已有本地矩阵触发点，需要回看对应十神、五行和干支关系。`],
      lifeSignals: ["候选事象：工作职责变化、合同手续复核、收支安排、流程合规。"],
      verification: ["验证条件 -> 当现实中出现职责、流程、合同或收支节点时，再回到柱位和岁运层级复核。"],
      boundary: "边界 -> 不能单独推出具体结果，不能单独作为结论。",
    },
    {
      title: `${label}候选方向：关系迁动与状态复核`,
      evidence: [`证据链 -> ${label}层级的十神或干支互动可作为关系、人际、合作主题的候选信号。`],
      lifeSignals: ["候选事象：合作摩擦、边界调整、搬动出行、作息体感波动、出行操作安全复核。"],
      verification: ["验证条件 -> 若现实反馈集中在人际协作、地点变动或体感节奏，再结合原局结构继续验证。"],
      boundary: "边界 -> 不能单独推出关系结论，不能单独作为结论。",
    },
  ];
  if (mode === "month") return base;
  return [
    ...base,
    {
      title: `${label}候选方向：事业学习与表达交付`,
      evidence: [`证据链 -> ${label}层级若触发官杀、印星、食伤或相关五行，可作为职责、学习、表达的观察点。`],
      lifeSignals: ["候选事象：任务交付、学习证照、公开表达、规则适配、流程合规。"],
      verification: ["验证条件 -> 当任务类型、学习投入或职责边界变清晰时，再结合旺衰、柱位和流月细看。"],
      boundary: "边界 -> 不能单独推出事业结果，不能单独作为结论。",
    },
  ];
}
