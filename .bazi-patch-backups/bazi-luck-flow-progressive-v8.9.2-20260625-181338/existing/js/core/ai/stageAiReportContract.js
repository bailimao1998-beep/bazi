import { validateReportSemantics } from "./stageFactRuleGuard.js";

const STAGE_LIMITS = {
  luck: { min: 0, max: 0 },
  year: { min: 1, max: 4 },
  month: { min: 1, max: 3 },
};

const LUCK_DIRECTION_KEYS = [
  "careerDirection",
  "relationship",
  "healthState",
];

const LUCK_DIRECTION_LABELS = {
  careerDirection: "事业 / 方向",
  relationship: "感情 / 关系",
  healthState: "健康 / 状态",
};

const INSUFFICIENT_PATTERN = /证据不足|未形成独立强象|主要承接原局|暂不下结论/;

export function getStageAiOutputContract(stage = "luck") {
  const normalizedStage = STAGE_LIMITS[stage] ? stage : "luck";

  if (normalizedStage === "luck") {
    const evidenceSection = {
      title: "string",
      summary: "string",
      evidenceIds: ["必须来自rawFactPack.facts"],
      ruleIds: ["必须来自candidatePack.candidateImages.ruleId"],
      positive: ["至少一条"],
      risks: ["至少一条"],
      advice: ["至少一条"],
    };

    return {
      stage: "luck",
      overallJudgment: "string",
      stemPhase: {
        ...evidenceSection,
        title: "天干前五年",
        phaseNote: "前段权重与外显主题，不代表后段完全失效",
      },
      branchPhase: {
        ...evidenceSection,
        title: "地支后五年",
        phaseNote: "后段权重与深层承接，不代表前段完全不起作用",
      },
      assessment: {
        verdict: "favorable | mixed | pressure",
        label: "顺运（借力） | 中性（调整） | 逆运（收敛）",
        summary: "string；不得只凭身强身弱定喜忌",
        evidenceIds: ["必须有效"],
        ruleIds: ["必须有效"],
        gains: ["至少一条"],
        costs: ["至少一条"],
      },
      directions: {
        careerDirection: {
          summary: "string；证据不足时明确写未形成独立强象",
          evidenceIds: ["可为空；非空时必须有效"],
          ruleIds: ["可为空；非空时必须有效"],
          positive: ["0至2条"],
          risks: ["0至2条"],
          advice: ["0至2条"],
        },
        relationship: {
          summary: "string；必须服从性别与夫妻宫/配偶星规则",
          evidenceIds: ["可为空；非空时必须有效"],
          ruleIds: ["可为空；非空时必须有效"],
          positive: ["0至2条"],
          risks: ["0至2条"],
          advice: ["0至2条"],
        },
        healthState: {
          summary: "只写压力、精力、作息、情绪与节奏；无专门规则时不得写具体器官疾病",
          evidenceIds: ["可为空；非空时必须有效"],
          ruleIds: ["可为空；非空时必须有效"],
          positive: ["0至2条"],
          risks: ["0至2条"],
          advice: ["0至2条"],
        },
      },
      actionAdvice: {
        advance: ["适合主动推进的事项"],
        control: ["需要控制或修正的事项"],
        avoidForNow: ["暂不勉强或等待流年触发的事项"],
      },
      transition: {
        summary: "换运前后只讲收尾、观察、准备与气场交接",
        advice: ["0至3条"],
      },
      verificationQuestions: ["现实验证问题"],
    };
  }

  return {
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
  const refs = buildAllowedRefs(rawFactPack, candidatePack);

  if (rawFactPack?.validation?.usable === false) {
    issues.push(...array(rawFactPack?.validation?.errors).map((item) => `硬事实校验失败：${item}`));
  }

  if (normalized.stage !== normalizedStage) issues.push("报告时间层与当前请求不一致");
  if (normalized.overallJudgment.length < (normalizedStage === "month" ? 20 : normalizedStage === "year" ? 25 : 30)) {
    issues.push("总断过短，没有形成完整主线");
  }

  if (normalizedStage === "luck") {
    validateLuckReport(normalized, refs, issues);
  } else {
    validateSelectedImagesReport(normalized, normalizedStage, refs, issues);
  }

  const visibleText = collectVisibleText(normalized);
  const absoluteCheckText = visibleText.replace(/不必然|并非必然|不是必然|不一定|未必|不能断定/g, "");
  if (/必然|注定|百分之百|肯定会|一定会/.test(absoluteCheckText)) issues.push("出现无条件绝对化判断");
  if (/学业彻底失败|事业彻底结束|关系必然破裂|一定无法结婚|肯定分手/.test(visibleText)) {
    issues.push("把阶段受阻写成了必然终止");
  }
  if (normalizedStage === "month" && /(结婚|离婚|移民|定居|终身|彻底转行)/.test(visibleText)) {
    issues.push("流月越级写成长期结果");
  }

  issues.push(...validateReportSemantics({
    report: normalized,
    stage: normalizedStage,
    rawFactPack,
    candidatePack,
  }));

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
      renderLuckEvidenceSection("① 天干前五年", value.stemPhase),
      "",
      renderLuckEvidenceSection("② 地支后五年", value.branchPhase),
      "",
      "### ③ 大运总判",
      `**${value.assessment.label}**`,
      value.assessment.summary,
      `**可以获得：** ${value.assessment.gains.join("；")}`,
      `**需要付出：** ${value.assessment.costs.join("；")}`,
      "",
      "### 展开讲三个方向",
      ...LUCK_DIRECTION_KEYS.flatMap((key) => {
        const entry = value.directions[key];
        return [
          `#### ${LUCK_DIRECTION_LABELS[key]}`,
          entry.summary,
          ...renderCompactLists(entry),
          "",
        ];
      }),
      "### ⑦ 叠加流年看具体年份",
      "大运定背景，流年定触发；具体年份应进入流年模块查看，不在大运总报告中自行编造应期。",
      "",
      "### ⑧ 行动建议",
      ...value.actionAdvice.advance.map((item) => `- 主动推进：${item}`),
      ...value.actionAdvice.control.map((item) => `- 需要控制：${item}`),
      ...value.actionAdvice.avoidForNow.map((item) => `- 暂不勉强：${item}`),
      "",
      "### ⑨ 大运交接过渡期提示",
      value.transition.summary,
      ...value.transition.advice.map((item) => `- ${item}`),
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

function validateLuckReport(report, refs, issues) {
  validateEvidenceSection(report.stemPhase, "天干前五年", refs, issues, { requireDetailLists: true });
  validateEvidenceSection(report.branchPhase, "地支后五年", refs, issues, { requireDetailLists: true });

  const assessment = report.assessment;
  if (!["favorable", "mixed", "pressure"].includes(assessment.verdict)) {
    issues.push("大运总判verdict必须为favorable、mixed或pressure");
  }
  if (!assessment.label || assessment.summary.length < 30) issues.push("大运总判缺少清晰结论");
  validateReferences(assessment, "大运总判", refs, issues, { required: true });
  if (!assessment.gains.length) issues.push("大运总判没有说明可以获得什么");
  if (!assessment.costs.length) issues.push("大运总判没有说明需要付出什么");

  LUCK_DIRECTION_KEYS.forEach((key) => {
    const entry = report.directions[key];
    const label = LUCK_DIRECTION_LABELS[key];
    if (!entry.summary) issues.push(`缺少${label}简断`);
    const insufficient = INSUFFICIENT_PATTERN.test(entry.summary);
    validateReferences(entry, label, refs, issues, { required: !insufficient });
    if (!insufficient && !entry.advice.length) issues.push(`${label}缺少对应建议`);
  });

  const actionCount = report.actionAdvice.advance.length
    + report.actionAdvice.control.length
    + report.actionAdvice.avoidForNow.length;
  if (!actionCount) issues.push("缺少大运行动建议");
  if (!report.transition.summary) issues.push("缺少换运交接提示");
  if (!report.verificationQuestions.length) issues.push("缺少现实验证问题");

  const phaseText = `${report.stemPhase.phaseNote} ${report.branchPhase.phaseNote}`;
  const prohibitedAbsoluteSplit = /(天干|地支).{0,8}(只管|仅管)|前五年.{0,8}(地支不起作用|只看天干)|后五年.{0,8}(天干不起作用|只看地支)/;
  if (prohibitedAbsoluteSplit.test(phaseText)) {
    issues.push("天干前五年与地支后五年只能表示权重，不得写成绝对分割");
  }
}

function validateSelectedImagesReport(report, stage, refs, issues) {
  const limits = STAGE_LIMITS[stage];
  if (report.selectedImages.length < limits.min || report.selectedImages.length > limits.max) {
    issues.push(`${stage === "year" ? "流年" : "流月"}主象数量应为${limits.min}至${limits.max}个`);
  }

  report.selectedImages.forEach((image, index) => {
    const label = `第${index + 1}个主象`;
    if (!image.title || image.analysis.length < 30) issues.push(`${label}缺少清晰分析`);
    validateReferences(image, label, refs, issues, { required: true });
    if (!image.positive.length) issues.push(`${label}没有说明有利面`);
    if (!image.risks.length) issues.push(`${label}没有说明压力或风险`);
    if (!image.advice.length) issues.push(`${label}没有给出对应建议`);
  });

  if (!report.finalAdvice.length) issues.push("缺少总体建议");
  if (stage !== "month" && !report.verificationQuestions.length) issues.push("缺少现实验证问题");
}

function validateEvidenceSection(section, label, refs, issues, { requireDetailLists = false } = {}) {
  if (!section.title || section.summary.length < 25) issues.push(`${label}缺少清晰分析`);
  validateReferences(section, label, refs, issues, { required: true });
  if (requireDetailLists) {
    if (!section.positive.length) issues.push(`${label}没有说明有利面`);
    if (!section.risks.length) issues.push(`${label}没有说明压力或代价`);
    if (!section.advice.length) issues.push(`${label}没有给出对应建议`);
  }
}

function validateReferences(section, label, refs, issues, { required = false } = {}) {
  const evidenceIds = array(section?.evidenceIds);
  const ruleIds = array(section?.ruleIds);
  if (required && !evidenceIds.length) issues.push(`${label}没有引用硬事实`);
  if (required && !ruleIds.length) issues.push(`${label}没有引用取象规则`);

  const unknownEvidence = evidenceIds.filter((id) => !refs.allowedEvidenceIds.has(id));
  const unknownRules = ruleIds.filter((id) => !refs.allowedRuleIds.has(id));
  if (unknownEvidence.length) issues.push(`${label}引用了不存在的事实ID`);
  if (unknownRules.length) issues.push(`${label}引用了不存在的规则ID`);

  if (evidenceIds.length && ruleIds.length) {
    const supported = ruleIds.some((ruleId) => {
      const allowed = refs.allowedRuleEvidence.get(ruleId);
      return allowed && evidenceIds.some((evidenceId) => allowed.has(evidenceId));
    });
    if (!supported) issues.push(`${label}的规则与引用事实没有匹配关系`);
  }
}

function buildAllowedRefs(rawFactPack, candidatePack) {
  return {
    allowedEvidenceIds: new Set(array(rawFactPack?.facts).map((fact) => text(fact?.id)).filter(Boolean)),
    allowedRuleIds: new Set(array(candidatePack?.candidateImages).map((candidate) => text(candidate?.ruleId)).filter(Boolean)),
    allowedRuleEvidence: new Map(
      array(candidatePack?.candidateImages).map((candidate) => [
        text(candidate?.ruleId),
        new Set(array(candidate?.evidenceIds).map(text).filter(Boolean)),
      ]),
    ),
  };
}

function normalizeReport(value, stage) {
  const report = value && typeof value === "object" && !Array.isArray(value) ? value : {};
  if (stage === "luck") return normalizeLuckReport(report);

  return {
    stage: text(report?.stage || stage),
    overallJudgment: text(report?.overallJudgment),
    selectedImages: array(report?.selectedImages).map(normalizeImage),
    finalAdvice: unique(array(report?.finalAdvice)).slice(0, 8),
    verificationQuestions: unique(array(report?.verificationQuestions)).slice(0, 6),
  };
}

function normalizeLuckReport(report) {
  return {
    stage: text(report?.stage || "luck"),
    overallJudgment: text(report?.overallJudgment),
    stemPhase: normalizeLuckEvidenceSection(report?.stemPhase, "天干前五年"),
    branchPhase: normalizeLuckEvidenceSection(report?.branchPhase, "地支后五年"),
    assessment: {
      verdict: text(report?.assessment?.verdict),
      label: text(report?.assessment?.label),
      summary: text(report?.assessment?.summary),
      evidenceIds: unique(array(report?.assessment?.evidenceIds)),
      ruleIds: unique(array(report?.assessment?.ruleIds)),
      gains: unique(array(report?.assessment?.gains)).slice(0, 4),
      costs: unique(array(report?.assessment?.costs)).slice(0, 4),
    },
    directions: Object.fromEntries(
      LUCK_DIRECTION_KEYS.map((key) => [key, normalizeDirection(report?.directions?.[key])]),
    ),
    actionAdvice: {
      advance: unique(array(report?.actionAdvice?.advance)).slice(0, 4),
      control: unique(array(report?.actionAdvice?.control)).slice(0, 4),
      avoidForNow: unique(array(report?.actionAdvice?.avoidForNow)).slice(0, 4),
    },
    transition: {
      summary: text(report?.transition?.summary),
      advice: unique(array(report?.transition?.advice)).slice(0, 3),
    },
    verificationQuestions: unique(array(report?.verificationQuestions)).slice(0, 6),
  };
}

function normalizeLuckEvidenceSection(value, defaultTitle) {
  const section = value && typeof value === "object" ? value : {};
  return {
    title: text(section?.title || defaultTitle),
    phaseNote: text(section?.phaseNote),
    summary: text(section?.summary),
    evidenceIds: unique(array(section?.evidenceIds)),
    ruleIds: unique(array(section?.ruleIds)),
    positive: unique(array(section?.positive)).slice(0, 4),
    risks: unique(array(section?.risks)).slice(0, 4),
    advice: unique(array(section?.advice)).slice(0, 4),
  };
}

function normalizeDirection(value) {
  const entry = value && typeof value === "object" ? value : {};
  return {
    summary: text(entry?.summary),
    evidenceIds: unique(array(entry?.evidenceIds)),
    ruleIds: unique(array(entry?.ruleIds)),
    positive: unique(array(entry?.positive)).slice(0, 2),
    risks: unique(array(entry?.risks)).slice(0, 2),
    advice: unique(array(entry?.advice)).slice(0, 2),
  };
}

function normalizeImage(image) {
  return {
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
  };
}

function renderLuckEvidenceSection(title, section) {
  return [
    `### ${title}`,
    section.summary,
    section.phaseNote ? `> ${section.phaseNote}` : "",
    `**有利面：** ${section.positive.join("；")}`,
    `**压力与代价：** ${section.risks.join("；")}`,
    `**建议：** ${section.advice.join("；")}`,
  ].filter(Boolean).join("\n\n");
}

function renderCompactLists(entry) {
  return [
    entry.positive.length ? `**有利面：** ${entry.positive.join("；")}` : "",
    entry.risks.length ? `**压力点：** ${entry.risks.join("；")}` : "",
    entry.advice.length ? `**建议：** ${entry.advice.join("；")}` : "",
  ].filter(Boolean);
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

function collectVisibleText(report) {
  return JSON.stringify(report || {});
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
