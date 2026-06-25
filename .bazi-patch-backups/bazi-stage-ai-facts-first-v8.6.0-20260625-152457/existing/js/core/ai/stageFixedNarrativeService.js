import {
  renderStageFixedReportMarkdown,
} from "../transit/buildStageFixedReportModel.js";

import {
  KNOWN_NAMED_PATTERNS,
} from "../transit/stageSemanticModel.js";

const REQUIRED_HEADINGS = {
  luck: [
    "阶段总判",
    "主要现实领域",
    "现实验证点",
  ],
  year: [
    "年度总判",
    "今年新增的作用",
    "最强现实落点",
  ],
  month: [
    "本月主线",
    "本月新增触发",
    "行动节奏",
  ],
};

const INTERNAL_DOMAIN_KEYS = [
  "execution",
  "expression",
  "cooperation",
  "credential",
  "health_state",
  "fortune",
];

export async function generateStageFixedNarrative({
  settings,
  prompt,
  stage = "luck",
  generate,
} = {}) {
  if (typeof generate !== "function") {
    throw new TypeError(
      "generateStageFixedNarrative requires a generate function.",
    );
  }

  const attempts = [];
  let lastError = null;
  let previousIssues = [];

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const result = await generate({
        settings,
        prompt:
          attempt === 0
            ? prompt
            : buildRetryPrompt(
                prompt,
                stage,
                previousIssues,
              ),
      });

      const text = String(result?.text || "").trim();
      const validation = validateStageNarrative({
        text,
        stage,
        fixedReportModel: prompt?.fixedReportModel,
      });

      attempts.push({
        attempt: attempt + 1,
        finishReason: result?.finishReason ?? null,
        textLength: text.length,
        usable: validation.valid,
        issues: validation.issues,
      });

      if (validation.valid) {
        return {
          text,
          fallbackUsed: false,
          attempts,
          result,
        };
      }

      previousIssues = validation.issues;
      lastError = new Error(
        `AI阶段报告存在越级或不受支持的表达：${validation.issues.join("；")}`,
      );
    } catch (error) {
      lastError = error;
      previousIssues = [error?.message || "unknown_error"];
      attempts.push({
        attempt: attempt + 1,
        error: error?.message || "unknown_error",
        usable: false,
      });

      if (isFatalConfigurationError(error)) break;
    }
  }

  const fallbackText = renderStageFixedReportMarkdown(
    prompt?.fixedReportModel,
  );

  if (fallbackText) {
    return {
      text: fallbackText,
      fallbackUsed: true,
      attempts,
      result: null,
      warning:
        lastError?.message ||
        "AI报告未返回，已使用本地固定报告。",
    };
  }

  throw lastError || new Error("阶段报告生成失败。");
}

export function isUsableStageText(
  text,
  stage = "luck",
  fixedReportModel = null,
) {
  return validateStageNarrative({
    text,
    stage,
    fixedReportModel,
  }).valid;
}

export function validateStageNarrative({
  text,
  stage = "luck",
  fixedReportModel = null,
} = {}) {
  const normalized = String(text || "").trim();
  const issues = [];
  const model = fixedReportModel || {};
  const semantics = model?.semanticContext || {};
  const temporal = semantics?.temporalEvidence || {};
  const relationship = semantics?.relationshipEvidence || {};
  const allowedNamedPatterns = array(
    semantics?.allowedNamedPatterns,
  );

  if (normalized.length < 120) {
    issues.push("内容为空或过短");
  }

  const headings = REQUIRED_HEADINGS[stage] || REQUIRED_HEADINGS.luck;
  for (const heading of headings) {
    if (!normalized.includes(heading)) {
      issues.push(`缺少章节:${heading}`);
    }
  }

  for (const key of INTERNAL_DOMAIN_KEYS) {
    if (
      new RegExp(`\\(${key}\\)|（${key}）|\\b${key}\\b`, "i")
        .test(normalized)
    ) {
      issues.push(`泄漏内部领域字段:${key}`);
    }
  }

  if (
    stage === "luck" &&
    !temporal.allowsExactPhaseYears &&
    /(前期|中期|后期)[^。\n]{0,50}(19|20)\d{2}/.test(normalized)
  ) {
    issues.push("无逐年证据却切分大运前中后期具体年份");
  }

  if (
    stage === "year" &&
    !temporal.allowsYearSubperiods &&
    /(年初|年中|年末|上半年|下半年|第一季度|第二季度|第三季度|第四季度)/.test(normalized)
  ) {
    issues.push("无流月或分段证据却定位年内时段");
  }

  if (
    relationship.dayStemTriggered &&
    !relationship.dayBranchTriggered &&
    (
      /夫妻宫[^。\n]{0,20}(被|受)[^。\n]{0,20}(合|冲|刑|害|穿|破)/.test(normalized) ||
      /日柱[^。\n]{0,16}被[^。\n]{0,12}合动/.test(normalized) ||
      /日柱被流年合动/.test(normalized)
    )
  ) {
    issues.push("把日干被合误写成夫妻宫或整个日柱被合动");
  }

  const unsupportedPatterns = KNOWN_NAMED_PATTERNS
    .filter((name) =>
      normalized.includes(name) &&
      !allowedNamedPatterns.includes(name),
    );
  for (const name of unsupportedPatterns) {
    issues.push(`使用未获事实或规则支持的命名组合:${name}`);
  }

  if (
    /(一定|必然|注定|必定|肯定会|一定会)/.test(normalized)
  ) {
    issues.push("使用确定性事件措辞");
  }

  if (
    /(会遇到对象|一定遇到|必然升职|必然失业|一定破财|一定离婚)/.test(normalized)
  ) {
    issues.push("把候选场景写成确定事件");
  }

  return {
    valid: issues.length === 0,
    issues: unique(issues),
  };
}

function buildRetryPrompt(
  prompt,
  stage,
  previousIssues = [],
) {
  const headings = REQUIRED_HEADINGS[stage] || REQUIRED_HEADINGS.luck;

  return {
    ...prompt,
    system: [
      prompt?.system || "",
      "",
      "上一轮需要纠错：",
      ...array(previousIssues).map((issue) => `- ${issue}`),
      `本次必须包含：${headings.join("、")}。`,
      "每个领域按“确定主象→较可能落点→一个替代分支→成立条件”组织，但保持简洁。",
      "日干被合不等同夫妻宫被合；时干被合不等同整个时柱或时支被合。",
      "没有逐年逐月数据，不得写前中后期具体年份或年初年中年末。",
      "不得使用semanticContext.allowedNamedPatterns之外的命名组合。",
      "只使用fixedReportModel、stageRulePack与trustedPack，不重新排盘。",
      "不得输出JSON、规则ID、证据ID或内部领域key。",
    ].join("\n"),
  };
}

function isFatalConfigurationError(error) {
  const message = String(error?.message || "");
  return (
    message.includes("未检测到本地 DeepSeek Key") ||
    message.includes("401") ||
    message.includes("Unauthorized")
  );
}

function array(value) {
  return Array.isArray(value)
    ? value
    : value === null || value === undefined
      ? []
      : [value];
}

function unique(value) {
  return [...new Set(array(value).filter(Boolean))];
}
