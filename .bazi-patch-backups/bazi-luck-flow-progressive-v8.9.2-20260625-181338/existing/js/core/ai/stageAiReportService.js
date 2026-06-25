import {
  parseStageAiReport,
  renderStageAiReportMarkdown,
  validateStageAiReport,
} from "./stageAiReportContract.js";

export async function generateStageAiReport({
  settings,
  prompt,
  stage = "luck",
  generate,
} = {}) {
  if (typeof generate !== "function") {
    throw new TypeError("generateStageAiReport requires a generate function.");
  }

  if (prompt?.preflight?.usable === false) {
    return {
      text: renderPreflightFailure(prompt, stage),
      structured: null,
      fallbackUsed: true,
      attempts: [],
      result: null,
      warning: `岁运硬事实或规则资格校验未通过：${array(prompt?.preflight?.errors).join("；")}`,
      preflightBlocked: true,
    };
  }

  const attempts = [];
  let lastError = null;
  let previousIssues = [];

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const result = await generate({
        settings,
        prompt: attempt === 0 ? prompt : buildRetryPrompt(prompt, previousIssues, stage),
      });
      const rawText = String(result?.text || "").trim();
      const parsed = parseStageAiReport(rawText);
      const validation = validateStageAiReport({
        report: parsed,
        stage,
        rawFactPack: prompt?.rawFactPack,
        candidatePack: prompt?.candidatePack,
      });

      attempts.push({
        attempt: attempt + 1,
        finishReason: result?.finishReason ?? null,
        textLength: rawText.length,
        usable: validation.usable,
        issues: validation.issues,
      });

      if (validation.usable) {
        return {
          text: renderStageAiReportMarkdown(validation.structured, stage),
          structured: validation.structured,
          fallbackUsed: false,
          attempts,
          result,
          validation,
        };
      }

      previousIssues = validation.issues;
      lastError = new Error(`AI阶段报告未通过证据契约：${validation.issues.join("；")}`);
    } catch (error) {
      lastError = error;
      previousIssues = [error?.message || "结构化报告解析失败"];
      attempts.push({
        attempt: attempt + 1,
        error: error?.message || "unknown_error",
        usable: false,
      });
      if (isFatalConfigurationError(error)) break;
    }
  }

  const fallbackText = renderFactOnlyFallback(prompt?.rawFactPack, stage);
  if (fallbackText) {
    return {
      text: fallbackText,
      structured: null,
      fallbackUsed: true,
      attempts,
      result: null,
      warning: lastError?.message || "AI报告未返回，已仅展示基础事实。",
    };
  }

  throw lastError || new Error("阶段AI报告生成失败。");
}

function buildRetryPrompt(prompt, issues = [], stage = "luck") {
  const correction = stage === "luck"
    ? [
        "大运JSON必须包含stemPhase、branchPhase、assessment、directions、actionAdvice、transition。",
        "stemPhase与branchPhase必须引用候选规则及其支持的事实。",
        "directions只允许careerDirection、relationship、healthState三个方向。",
        "不得恢复selectedImages或旧的五领域大运结构。",
      ]
    : [
        "每个selectedImages条目必须引用candidatePack中的ruleId，并引用该规则支持的evidenceId。",
        "每个主象必须同时包含有利面、风险和对应建议。",
      ];

  return {
    ...prompt,
    system: [
      prompt?.system || "",
      "",
      "上一轮JSON没有通过结构、事实或规则校验。",
      ...array(issues).map((issue, index) => `${index + 1}. ${issue}`),
      ...correction,
      "本轮必须重新返回完整JSON对象。",
      "不得输出JSON之外的任何内容。",
    ].join("\n"),
  };
}

function renderPreflightFailure(prompt, stage) {
  const errors = array(prompt?.preflight?.errors);
  const warnings = array(prompt?.preflight?.warnings);
  return [
    "### 当前岁运事实校验未通过",
    "系统已经停止AI取象，避免在错误命盘或错误规则上继续生成结论。",
    "",
    ...errors.map((item) => `- 错误：${item}`),
    ...warnings.map((item) => `- 提醒：${item}`),
    "",
    renderFactOnlyFallback(prompt?.rawFactPack, stage),
  ].filter(Boolean).join("\n").trim();
}

function renderFactOnlyFallback(rawFactPack, stage) {
  if (!rawFactPack || typeof rawFactPack !== "object") return "";
  const stageLabel = rawFactPack?.stageLabel || { luck: "大运", year: "流年", month: "流月" }[stage] || "阶段";
  const target = rawFactPack?.target ?? {};
  const targetText = [
    target?.year ? `${target.year}年` : "",
    target?.flowMonthLabel,
    target?.ganZhi,
    target?.ageRange,
    target?.yearRange,
  ].filter(Boolean).join(" · ");
  const facts = array(rawFactPack?.facts).slice(0, 10);
  if (!facts.length && !targetText) return "";

  return [
    `### ${stageLabel}基础事实`,
    targetText || "当前阶段",
    "",
    ...facts.map((fact) => {
      if (fact.kind === "ten_god") {
        return `- ${fact.char}：${fact.tenGod}（${fact.relation}）`;
      }
      return `- ${fact.relation}：参与者 ${array(fact.participants).join("、") || "待复核"}，状态 ${fact.certainty === "conditional" ? "条件待定" : "直接成立"}`;
    }),
    "",
    "### 说明",
    "本次AI结构化取象没有通过事实与规则校验，因此没有生成推断性结论。请检查错误后重新生成。",
  ].join("\n").trim();
}

function isFatalConfigurationError(error) {
  const message = String(error?.message || "");
  return message.includes("未检测到本地 DeepSeek Key") || message.includes("401") || message.includes("Unauthorized");
}

function array(value) {
  return Array.isArray(value) ? value : value === undefined || value === null ? [] : [value];
}
