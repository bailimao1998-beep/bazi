const REQUIRED_HEADINGS = {
  luck: ["阶段总判", "主要现实领域", "现实验证点"],
  year: ["年度总判", "今年新增的作用", "最强现实落点", "现实验证点"],
  month: ["本月主线", "本月新增触发", "行动节奏"],
};

const MIN_LENGTH = {
  luck: 260,
  year: 220,
  month: 140,
};

const DOMAIN_KEYWORDS = {
  self: ["个人", "自身", "选择", "状态"],
  learning: ["学习", "学业", "考试", "资格", "证书"],
  career: ["事业", "工作", "岗位", "职业", "项目"],
  wealth: ["财务", "收入", "资源", "回报", "客户", "预算"],
  relationship: ["感情", "恋爱", "伴侣", "婚姻"],
  family: ["家庭", "六亲", "家人", "长辈"],
  parents: ["父母", "长辈"],
  children: ["子女", "孩子"],
  health: ["健康", "疾病", "身心", "作息"],
  movement: ["环境", "迁移", "异地", "出行", "居住", "城市", "海外"],
  foundation: ["根基", "居住", "生活基础"],
  cooperation: ["合作", "责任", "绑定", "协商"],
  execution: ["执行", "交付", "任务", "进度", "时间表"],
  rules: ["规则", "制度", "资格", "考核", "条件"],
  pressure: ["压力", "竞争", "约束"],
  resource: ["资源", "分配", "预算", "机会"],
  expression: ["表达", "技术", "输出", "作品", "解决问题"],
  output: ["成果", "交付", "输出"],
  competition: ["竞争", "同辈", "同事", "同行"],
  support: ["学习", "支持", "贵人", "资格"],
  result: ["结果", "规划", "后续"],
};

const INTERNAL_TERMS = [
  "fixedReportModel",
  "stageRulePack",
  "trustedPack",
  "factPack",
  "schemaVersion",
  "evidenceRefs",
  "ruleIds",
  "sourceLevel",
  "condition_only",
  "arch_condition",
  "unresolved",
  "narrativePriority",
];

export async function generateStageFixedNarrative({
  settings,
  prompt,
  stage = "luck",
  generate,
} = {}) {
  if (typeof generate !== "function") {
    throw new TypeError("generateStageFixedNarrative requires a generate function.");
  }

  const attempts = [];
  let lastError = null;
  let previousIssues = [];

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const result = await generate({
        settings,
        prompt: attempt === 0
          ? prompt
          : buildRetryPrompt(prompt, stage, previousIssues),
      });
      const text = String(result?.text || "").trim();
      const validation = validateStageNarrative({
        text,
        stage,
        narrativeBrief: prompt?.narrativeBrief,
        factPack: prompt?.factPack,
      });
      attempts.push({
        attempt: attempt + 1,
        finishReason: result?.finishReason ?? null,
        textLength: text.length,
        usable: validation.usable,
        score: validation.score,
        issues: validation.issues,
        checks: validation.checks,
      });
      if (validation.usable) {
        return {
          text,
          fallbackUsed: false,
          attempts,
          result,
          validation,
        };
      }
      previousIssues = validation.issues;
      lastError = new Error(`AI阶段报告语义质量不足：${validation.issues.join("；") || "未通过质量检查"}`);
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

  const fallbackText = renderFactOnlyFallback(prompt?.factPack, stage);
  if (fallbackText) {
    return {
      text: fallbackText,
      fallbackUsed: true,
      attempts,
      result: null,
      warning: lastError?.message || "AI报告未返回，已仅展示基础事实。",
    };
  }

  throw lastError || new Error("阶段报告生成失败。");
}

export function validateStageNarrative({
  text,
  stage = "luck",
  narrativeBrief = {},
  factPack = {},
} = {}) {
  const normalizedStage = ["luck", "year", "month"].includes(stage) ? stage : "luck";
  const normalized = String(text || "").trim();
  const issues = [];
  const headings = REQUIRED_HEADINGS[normalizedStage] || REQUIRED_HEADINGS.luck;
  const missingHeadings = headings.filter((heading) => !normalized.includes(heading));
  const headingsOk = missingHeadings.length === 0;
  if (!headingsOk) issues.push(`缺少核心章节：${missingHeadings.join("、")}`);

  const minLength = MIN_LENGTH[normalizedStage] || MIN_LENGTH.luck;
  const lengthOk = normalized.length >= minLength;
  if (!lengthOk) issues.push(`内容过短，当前${normalized.length}字，至少需要${minLength}字左右`);

  const causalMatches = normalized.match(/因为|因此|从而|这使得|由此|意味着|所以|形成了|导致|在这种作用下/g) ?? [];
  const requiredCausalCount = normalizedStage === "month" ? 1 : 2;
  const causalChainsOk = causalMatches.length >= requiredCausalCount;
  if (!causalChainsOk) issues.push("只罗列了标签，缺少清晰的形成原因和现实作用链");

  const realityMarkers = normalized.match(/现实中|可能表现为|较可能|容易表现为|更像|可观察|替代分支|成立条件|例如/g) ?? [];
  const sceneSpecificityOk = realityMarkers.length >= (normalizedStage === "month" ? 1 : 2);
  if (!sceneSpecificityOk) issues.push("缺少候选现实场景、替代分支或成立条件");

  const allowedKeywords = unique([
    ...array(narrativeBrief?.allowedDomainKeywords),
    ...array(narrativeBrief?.allowedDomainLabels),
  ]);
  const evidenceCoverageOk = !allowedKeywords.length || allowedKeywords.some((keyword) => keyword && normalized.includes(keyword));
  if (!evidenceCoverageOk) issues.push("没有覆盖证据提纲允许的主要现实领域");

  const allowedDomains = new Set(array(narrativeBrief?.allowedDomains));
  const forbiddenDomains = array(narrativeBrief?.forbiddenDomains);
  const guardedUnsupportedDomains = new Set(["health", "children", "parents", "family", "relationship", "wealth", "movement"]);
  const unsupportedHits = forbiddenDomains
    .filter((domain) => guardedUnsupportedDomains.has(domain) && !allowedDomains.has(domain))
    .map((domain) => ({
      domain,
      hits: countKeywordHits(normalized, DOMAIN_KEYWORDS[domain] ?? []),
    }))
    .filter((entry) => entry.hits >= 2);
  const unsupportedDomainsOk = unsupportedHits.length === 0;
  if (!unsupportedDomainsOk) {
    issues.push(`重点扩写了证据未允许的领域：${unsupportedHits.map((entry) => entry.domain).join("、")}`);
  }

  const certaintyText = normalized
    .replaceAll("不一定", "")
    .replaceAll("并不一定", "")
    .replaceAll("不能断定", "")
    .replaceAll("不代表", "");
  const forbiddenCertainty = certaintyText.match(/必然|注定|肯定会|一定会|必定|百分之百|毫无疑问会/g) ?? [];
  const forbiddenCertaintyOk = forbiddenCertainty.length === 0;
  if (!forbiddenCertaintyOk) issues.push("出现没有证据支持的绝对化措辞");

  const inventedTimelineOk = normalizedStage !== "luck" || !hasInventedLuckTimeline(normalized, factPack);
  if (!inventedTimelineOk) issues.push("大运报告自行划分了没有流年证据支持的具体年份区间");

  const monthLongTermOk = normalizedStage !== "month" || !/(?:将会|会在本月|本月会|必然|注定|确定)(?:[^。；，]{0,12})(结婚|离婚|分手|定居|移民|彻底转行|终身)/.test(normalized);
  if (!monthLongTermOk) issues.push("流月报告越级写成长期确定结果");

  const failureOverreachOk = !/(学业彻底失败|事业彻底结束|关系必然破裂|一定无法结婚|肯定分手)/.test(certaintyText);
  if (!failureOverreachOk) issues.push("把受阻或现实困难直接写成了彻底失败或必然终止");

  const internalLeakHits = INTERNAL_TERMS.filter((term) => normalized.includes(term));
  const englishTokens = normalized.match(/\b[A-Za-z][A-Za-z_]{2,}\b/g) ?? [];
  const allowedEnglish = new Set(["AI"]);
  const unexpectedEnglish = englishTokens.filter((token) => !allowedEnglish.has(token));
  const internalLanguageOk = internalLeakHits.length === 0 && unexpectedEnglish.length <= 1 && !/^\s*[\[{]/.test(normalized);
  if (!internalLanguageOk) issues.push("报告泄露了英文枚举、JSON或内部字段");

  const verificationOk = normalizedStage === "month" || hasRealityVerification(normalized);
  if (!verificationOk) issues.push("现实验证点写成了命理方法说明，没有提出可在生活中核验的问题");

  const repetitionOk = !hasExcessiveParagraphRepetition(normalized);
  if (!repetitionOk) issues.push("多个章节重复复述同一结论，缺少层次推进");

  const checks = {
    headings: headingsOk,
    length: lengthOk,
    causalChains: causalChainsOk,
    evidenceCoverage: evidenceCoverageOk,
    sceneSpecificity: sceneSpecificityOk,
    unsupportedDomains: unsupportedDomainsOk,
    forbiddenCertainty: forbiddenCertaintyOk,
    inventedTimeline: inventedTimelineOk,
    monthLongTermBoundary: monthLongTermOk,
    failureBoundary: failureOverreachOk,
    internalLanguage: internalLanguageOk,
    realityVerification: verificationOk,
    excessiveRepetition: repetitionOk,
  };

  const weights = {
    headings: 16,
    length: 7,
    causalChains: 13,
    evidenceCoverage: 8,
    sceneSpecificity: 11,
    unsupportedDomains: 8,
    forbiddenCertainty: 7,
    inventedTimeline: 5,
    monthLongTermBoundary: 4,
    failureBoundary: 4,
    internalLanguage: 8,
    realityVerification: 8,
    excessiveRepetition: 1,
  };
  const score = Math.max(0, Math.round(Object.entries(checks)
    .reduce((sum, [key, passed]) => sum + (passed ? weights[key] || 0 : 0), 0)));
  const criticalOk = headingsOk && lengthOk && unsupportedDomainsOk && forbiddenCertaintyOk && inventedTimelineOk && monthLongTermOk && failureOverreachOk && internalLanguageOk && verificationOk;

  return {
    usable: criticalOk && causalChainsOk && evidenceCoverageOk && sceneSpecificityOk && score >= 72,
    score,
    issues: unique(issues),
    checks,
  };
}

export function isUsableStageText(text, stage = "luck") {
  const normalized = String(text || "").trim();
  if (normalized.length < 120) return false;
  const headings = REQUIRED_HEADINGS[stage] || REQUIRED_HEADINGS.luck;
  return headings.every((heading) => normalized.includes(heading));
}

function buildRetryPrompt(prompt, stage, issues = []) {
  const headings = REQUIRED_HEADINGS[stage] || REQUIRED_HEADINGS.luck;
  const issueLines = array(issues).length
    ? array(issues).map((issue, index) => `${index + 1}. ${issue}`)
    : ["1. 上一轮内容为空、过短或缺少核心章节。"];
  return {
    ...prompt,
    system: [
      prompt?.system || "",
      "",
      "语义纠错：上一轮阶段报告没有通过质量检查。",
      "存在的问题：",
      ...issueLines,
      `本次仍必须包含：${headings.join("、")}。`,
      "只使用factPack中的基础事实、结构事实和候选规则，由你重新完成主次排序。",
      "不要引用前端固定报告、领域评分、内部字段或英文枚举。",
      "现实验证点必须询问生活中是否出现某种情况，不能复述命理方法。",
    ].join("\n"),
  };
}

function renderFactOnlyFallback(factPack, stage) {
  if (!factPack || typeof factPack !== "object") return "";
  const stageLabel = factPack?.stageLabel || { luck: "大运", year: "流年", month: "流月" }[stage] || "阶段";
  const target = factPack?.target ?? {};
  const targetText = [target?.year ? `${target.year}年` : "", target?.flowMonthLabel, target?.ganZhi, target?.ageRange, target?.yearRange]
    .filter(Boolean)
    .join(" · ");
  const facts = [
    ...array(factPack?.facts?.direct),
    ...array(factPack?.facts?.supporting),
  ].slice(0, 8);
  if (!facts.length && !targetText) return "";
  return [
    `### ${stageLabel}基础事实`,
    targetText || "当前阶段",
    "",
    ...facts.map((fact) => `- ${[fact?.label, fact?.text].filter(Boolean).join("：")}`),
    "",
    "### 说明",
    "本次AI综合判断未通过质量检查，因此没有使用前端领域排名或固定结论，只保留可复核的基础事实。请重新生成AI分析。",
  ].join("\n").trim();
}

function hasRealityVerification(text) {
  const section = extractHeadingSection(text, "现实验证点");
  if (!section) return false;
  const hasQuestion = /是否|有没有|现实中|目前|已经|出现|正在|需要|能否|有没有发生/.test(section);
  const methodologyOnly = /(层级判断|天干只定|地支主气|化气条件|规则必须|条件组合|不得单独决定吉凶)/.test(section) && !hasQuestion;
  return hasQuestion && !methodologyOnly;
}

function extractHeadingSection(text, heading) {
  const marker = `### ${heading}`;
  const start = text.indexOf(marker);
  if (start < 0) return "";
  const after = text.slice(start + marker.length);
  const next = after.search(/\n###\s/);
  return (next >= 0 ? after.slice(0, next) : after).trim();
}

function hasInventedLuckTimeline(text, factPack) {
  const permittedRange = String(
    factPack?.target?.yearRange || "",
  ).replace(/\s+/g, "");
  const ranges = text.match(/(?:19|20)\d{2}\s*(?:年)?\s*[-—~至到]\s*(?:19|20)\d{2}\s*年?/g) ?? [];
  return ranges.some((range) => {
    const normalizedRange = range.replace(/年|\s+/g, "").replace(/[—~至到]/g, "-");
    const normalizedPermitted = permittedRange.replace(/年|\s+/g, "").replace(/[—~至到]/g, "-");
    return !normalizedPermitted || normalizedRange !== normalizedPermitted;
  });
}

function hasExcessiveParagraphRepetition(text) {
  const paragraphs = text
    .split(/\n{2,}|(?=###\s)/)
    .map((paragraph) => paragraph.replace(/###\s*[^\n]+/, "").replace(/\s+/g, "").trim())
    .filter((paragraph) => paragraph.length >= 40);
  for (let index = 0; index < paragraphs.length; index += 1) {
    for (let next = index + 1; next < paragraphs.length; next += 1) {
      const shorter = paragraphs[index].length <= paragraphs[next].length ? paragraphs[index] : paragraphs[next];
      const longer = shorter === paragraphs[index] ? paragraphs[next] : paragraphs[index];
      if (shorter.length >= 60 && longer.includes(shorter.slice(0, Math.min(80, shorter.length)))) return true;
    }
  }
  return false;
}

function countKeywordHits(text, keywords) {
  return array(keywords).reduce((count, keyword) => {
    if (!keyword) return count;
    return count + (text.split(keyword).length - 1);
  }, 0);
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
  return Array.isArray(value) ? value : value === undefined || value === null ? [] : [value];
}

function unique(value) {
  return [...new Set(array(value).filter(Boolean))];
}
