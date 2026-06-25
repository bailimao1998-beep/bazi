const STAGE_LIMITS = {
  luck: { min: 1, max: 6 },
  year: { min: 1, max: 4 },
  month: { min: 1, max: 3 },
};

const LUCK_DOMAIN_KEYS = [
  "careerLearning",
  "wealthResource",
  "relationshipMarriage",
  "familyEnvironment",
  "bodyMindRhythm",
];

const LUCK_DOMAIN_LABELS = {
  careerLearning: "事业与学业",
  wealthResource: "财富与资源",
  relationshipMarriage: "感情与婚姻",
  familyEnvironment: "家庭、居住与环境",
  bodyMindRhythm: "身心节奏",
};

export function getStageAiOutputContract(stage = "luck") {
  const normalizedStage = STAGE_LIMITS[stage] ? stage : "luck";
  const base = {
    stage: normalizedStage,
    overallJudgment: "string",
    selectedImages: [
      {
        title: "string",
        evidenceIds: ["必须来自rawFactPack.facts"],
        ruleIds: ["必须来自candidatePack.candidateImages.ruleId"],
        analysis: "string",
        positive: ["至少一条"],
        risks: ["至少一条"],
        advice: ["至少一条"],
        confidence: "strong | medium | weak",
      },
    ],
    finalAdvice: ["string"],
    verificationQuestions: ["string"],
  };

  if (normalizedStage === "luck") {
    return {
      ...base,
      domainSummaries: Object.fromEntries(
        LUCK_DOMAIN_KEYS.map((key) => [key, {
          summary: "string；证据不足时明确写未形成独立强象",
          evidenceIds: ["可为空；非空时必须有效"],
          advice: ["0至2条"],
        }]),
      ),
      stageRhythm: "只写初入、持续、临近换运，不写无依据的具体年份",
    };
  }

  return base;
}

export function parseStageAiReport(text) {
  const raw = String(text || "").trim();
  if (!raw) throw new Error("AI未返回结构化报告。");
  const unfenced = raw
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
  const start = unfenced.indexOf("{");
  const end = unfenced.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error("AI返回内容不是有效JSON对象。");
  return JSON.parse(unfenced.slice(start, end + 1));
}

export function validateStageAiReport({
  report,
  stage = "luck",
  rawFactPack = {},
  candidatePack = {},
} = {}) {
  const normalizedStage = STAGE_LIMITS[stage] ? stage : "luck";
  const issues = [];
  const normalized = normalizeReport(report, normalizedStage);
  const allowedEvidenceIds = new Set(array(rawFactPack?.facts).map((fact) => text(fact?.id)).filter(Boolean));
  const allowedRuleIds = new Set(array(candidatePack?.candidateImages).map((candidate) => text(candidate?.ruleId)).filter(Boolean));
  const allowedRuleEvidence = new Map(
    array(candidatePack?.candidateImages).map((candidate) => [
      text(candidate?.ruleId),
      new Set(array(candidate?.evidenceIds).map(text).filter(Boolean)),
    ]),
  );

  if (normalized.stage !== normalizedStage) issues.push("报告时间层与当前请求不一致");
  if (normalized.overallJudgment.length < (normalizedStage === "month" ? 20 : normalizedStage === "year" ? 25 : 30)) {
    issues.push("总断过短，没有形成完整主线");
  }

  const limits = STAGE_LIMITS[normalizedStage];
  if (normalized.selectedImages.length < limits.min || normalized.selectedImages.length > limits.max) {
    issues.push(`${normalizedStage === "luck" ? "大运" : normalizedStage === "year" ? "流年" : "流月"}主象数量应为${limits.min}至${limits.max}个`);
  }

  normalized.selectedImages.forEach((image, index) => {
    const label = `第${index + 1}个主象`;
    if (!image.title || image.analysis.length < 30) issues.push(`${label}缺少清晰分析`);
    if (!image.evidenceIds.length) issues.push(`${label}没有引用硬事实`);
    if (!image.ruleIds.length) issues.push(`${label}没有引用取象规则`);
    if (!image.positive.length) issues.push(`${label}没有说明有利面`);
    if (!image.risks.length) issues.push(`${label}没有说明压力或风险`);
    if (!image.advice.length) issues.push(`${label}没有给出对应建议`);

    const unknownEvidence = image.evidenceIds.filter((id) => !allowedEvidenceIds.has(id));
    const unknownRules = image.ruleIds.filter((id) => !allowedRuleIds.has(id));
    if (unknownEvidence.length) issues.push(`${label}引用了不存在的事实ID`);
    if (unknownRules.length) issues.push(`${label}引用了不存在的规则ID`);

    const supported = image.ruleIds.some((ruleId) => {
      const allowed = allowedRuleEvidence.get(ruleId);
      return allowed && image.evidenceIds.some((evidenceId) => allowed.has(evidenceId));
    });
    if (image.ruleIds.length && image.evidenceIds.length && !supported) {
      issues.push(`${label}的规则与引用事实没有匹配关系`);
    }
  });

  if (normalizedStage === "luck") {
    LUCK_DOMAIN_KEYS.forEach((key) => {
      const entry = normalized.domainSummaries[key];
      if (!entry?.summary) issues.push(`缺少${LUCK_DOMAIN_LABELS[key]}简断`);
      const unknown = array(entry?.evidenceIds).filter((id) => !allowedEvidenceIds.has(id));
      if (unknown.length) issues.push(`${LUCK_DOMAIN_LABELS[key]}引用了不存在的事实ID`);
    });
    if (!normalized.stageRhythm) issues.push("缺少十年节奏说明");
  }

  if (!normalized.finalAdvice.length) issues.push("缺少总体建议");
  if (normalizedStage !== "month" && !normalized.verificationQuestions.length) {
    issues.push("缺少现实验证问题");
  }

  const visibleText = collectVisibleText(normalized);
  if (/必然|注定|百分之百|肯定会|一定会/.test(visibleText)) issues.push("出现无条件绝对化判断");
  if (/学业彻底失败|事业彻底结束|关系必然破裂|一定无法结婚|肯定分手/.test(visibleText)) {
    issues.push("把阶段受阻写成了必然终止");
  }
  if (normalizedStage === "month" && /(结婚|离婚|移民|定居|终身|彻底转行)/.test(visibleText)) {
    issues.push("流月越级写成长期结果");
  }

  return {
    usable: issues.length === 0,
    issues: unique(issues),
    structured: normalized,
  };
}

export function renderStageAiReportMarkdown(report, stage = "luck") {
  const normalizedStage = STAGE_LIMITS[stage] ? stage : "luck";
  const value = normalizeReport(report, normalizedStage);

  if (normalizedStage === "luck") {
    return [
      "### 十年总断",
      value.overallJudgment,
      "",
      "### 核心取象",
      renderImages(value.selectedImages),
      "",
      "### 各方面简断",
      ...LUCK_DOMAIN_KEYS.flatMap((key) => {
        const entry = value.domainSummaries[key];
        return [
          `#### ${LUCK_DOMAIN_LABELS[key]}`,
          entry.summary,
          ...renderAdviceLines(entry.advice),
          "",
        ];
      }),
      "### 十年节奏",
      value.stageRhythm,
      "",
      "### 总体建议",
      ...value.finalAdvice.map((item) => `- ${item}`),
      "",
      "### 现实验证点",
      ...value.verificationQuestions.map((item) => `- ${item}`),
    ].join("\n").trim();
  }

  if (normalizedStage === "year") {
    return [
      "### 年度总断",
      value.overallJudgment,
      "",
      "### 今年明显取象",
      renderImages(value.selectedImages),
      "",
      "### 年度建议",
      ...value.finalAdvice.map((item) => `- ${item}`),
      "",
      "### 现实验证点",
      ...value.verificationQuestions.map((item) => `- ${item}`),
    ].join("\n").trim();
  }

  return [
    "### 流月主线",
    value.overallJudgment,
    "",
    "### 本月明显取象",
    renderImages(value.selectedImages),
    "",
    "### 本月建议",
    ...value.finalAdvice.map((item) => `- ${item}`),
  ].join("\n").trim();
}

function normalizeReport(value, stage) {
  const report = value && typeof value === "object" && !Array.isArray(value) ? value : {};
  const selectedImages = array(report?.selectedImages).map((image) => ({
    title: text(image?.title),
    evidenceIds: unique(array(image?.evidenceIds)),
    ruleIds: unique(array(image?.ruleIds)),
    analysis: text(image?.analysis),
    positive: unique(array(image?.positive)),
    risks: unique(array(image?.risks)),
    advice: unique(array(image?.advice)),
    confidence: ["strong", "medium", "weak"].includes(text(image?.confidence))
      ? text(image?.confidence)
      : "medium",
  }));

  const domainSummaries = Object.fromEntries(
    LUCK_DOMAIN_KEYS.map((key) => {
      const entry = report?.domainSummaries?.[key] ?? {};
      return [key, {
        summary: text(entry?.summary),
        evidenceIds: unique(array(entry?.evidenceIds)),
        advice: unique(array(entry?.advice)).slice(0, 2),
      }];
    }),
  );

  return {
    stage: text(report?.stage || stage),
    overallJudgment: text(report?.overallJudgment),
    selectedImages,
    domainSummaries,
    stageRhythm: text(report?.stageRhythm),
    finalAdvice: unique(array(report?.finalAdvice)).slice(0, 8),
    verificationQuestions: unique(array(report?.verificationQuestions)).slice(0, 6),
  };
}

function renderImages(images) {
  return images.map((image, index) => [
    `#### ${index + 1}. ${image.title}`,
    image.analysis,
    "",
    `**有利面：** ${image.positive.join("；")}`,
    "",
    `**压力与代价：** ${image.risks.join("；")}`,
    "",
    `**建议：** ${image.advice.join("；")}`,
  ].join("\n")).join("\n\n");
}

function renderAdviceLines(advice) {
  return array(advice).length
    ? ["", ...array(advice).map((item) => `- 建议：${item}`)]
    : [];
}

function collectVisibleText(report) {
  return JSON.stringify({
    overallJudgment: report.overallJudgment,
    selectedImages: report.selectedImages.map((image) => ({
      title: image.title,
      analysis: image.analysis,
      positive: image.positive,
      risks: image.risks,
      advice: image.advice,
    })),
    domainSummaries: report.domainSummaries,
    stageRhythm: report.stageRhythm,
    finalAdvice: report.finalAdvice,
    verificationQuestions: report.verificationQuestions,
  });
}

function text(value) {
  return value === undefined || value === null ? "" : String(value).trim();
}

function array(value) {
  return Array.isArray(value) ? value : value === undefined || value === null ? [] : [value];
}

function unique(values) {
  return [...new Set(array(values).map(text).filter(Boolean))];
}
