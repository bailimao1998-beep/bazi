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
      warnings: array(prompt?.preflight?.warnings),
      preflightBlocked: true,
    };
  }

  const attempts = [];
  let lastError = null;
  let previousIssues = [];
  let lastValidation = null;
  let lastParsed = null;

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

      lastParsed = parsed;
      lastValidation = validation;

      attempts.push({
        attempt: attempt + 1,
        finishReason: result?.finishReason ?? null,
        textLength: rawText.length,
        usable: validation.usable,
        issues: validation.issues,
        warnings: validation.warnings,
      });

      if (validation.usable) {
        return {
          text: renderStageAiReportMarkdown(validation.structured, stage),
          structured: validation.structured,
          fallbackUsed: false,
          attempts,
          result,
          validation,
          warnings: validation.warnings || [],
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

  if (stage === "luck" && prompt?.rawFactPack?.validation?.usable !== false) {
    const safeStructured = lastValidation?.structured || buildLuckFlowSkeleton(prompt?.rawFactPack);
    return {
      text: renderStageAiReportMarkdown(safeStructured, "luck"),
      structured: safeStructured,
      fallbackUsed: true,
      attempts,
      result: null,
      warning: "AI部分内容未通过强证据校验，系统已保留大运九步流程，并将缺证据栏目降级为保守表述。",
      warnings: [
        ...(lastValidation?.warnings || []),
        ...(lastValidation?.issues || previousIssues),
      ],
      validation: lastValidation,
      rawParsed: lastParsed,
    };
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
      warnings: previousIssues,
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
        "感情或健康没有独立规则时，直接写未形成独立强象，evidenceIds和ruleIds可以为空。",
        "不要写祖产、祖业、长辈资源、具体器官疾病、具体年龄段或指定年份高峰。",
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

function buildLuckFlowSkeleton(rawFactPack = {}) {
  const facts = array(rawFactPack?.facts);
  const stemFact = facts.find((fact) => fact?.kind === "ten_god" && fact?.type === "stem_ten_god");
  const branchFact = facts.find((fact) => fact?.kind === "ten_god" && fact?.type === "branch_ten_god");
  const stemText = stemFact
    ? `大运天干${stemFact.char}为${stemFact.tenGod}，前段更偏外显主题与主动表现。`
    : "大运天干部分已完成基础排盘，具体取象等待重新生成。";
  const branchText = branchFact
    ? `大运地支${branchFact.char}主气为${branchFact.tenGod}，后段更偏环境承接与深层变化。`
    : "大运地支部分已完成基础排盘，具体取象等待重新生成。";

  return {
    stage: "luck",
    overallJudgment: "当前大运的基础事实已经通过校验。系统先保留九步分析流程，缺少独立规则支持的栏目不强行下结论。",
    stemPhase: {
      title: "天干前五年",
      phaseNote: "前段权重与外显主题，不代表后段完全失效。",
      summary: stemText,
      evidenceIds: stemFact?.id ? [stemFact.id] : [],
      ruleIds: [],
      positive: [],
      risks: [],
      advice: [],
    },
    branchPhase: {
      title: "地支后五年",
      phaseNote: "后段权重与深层承接，不代表前段完全不起作用。",
      summary: branchText,
      evidenceIds: branchFact?.id ? [branchFact.id] : [],
      ruleIds: [],
      positive: [],
      risks: [],
      advice: [],
    },
    assessment: {
      verdict: "mixed",
      label: "中性（调整）",
      summary: "当前只保留已确认的命盘与岁运事实，顺逆结论等待规则匹配完整后再细化。",
      evidenceIds: [],
      ruleIds: [],
      gains: ["保留可用结构，避免因局部缺证据否定整篇分析"],
      costs: ["部分栏目需要等待流年或更多规则触发后才能具体化"],
    },
    directions: {
      careerDirection: emptyDirection(),
      relationship: emptyDirection(),
      healthState: emptyDirection(),
    },
    actionAdvice: {
      advance: ["先沿已确认的大运主线推进可验证的现实事项"],
      control: ["避免把单一冲合直接扩写成具体事件"],
      avoidForNow: ["缺少独立证据的领域暂不下长期结论"],
    },
    transition: {
      summary: "换运前后以收尾、观察和准备为主，具体交接表现结合临近流年再看。",
      advice: [],
    },
    verificationQuestions: [],
  };
}

function emptyDirection() {
  return {
    summary: "本运在该方向暂未形成独立强象，先看原局底色，并等待流年进一步触发。",
    evidenceIds: [],
    ruleIds: [],
    positive: [],
    risks: [],
    advice: [],
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
