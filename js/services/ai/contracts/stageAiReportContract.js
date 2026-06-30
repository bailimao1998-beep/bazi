import { validateReportSemantics } from "../guards/stageFactRuleGuard.js";

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

const YEAR_DIRECTION_KEYS = [
  "careerDirection",
  "relationship",
  "healthState",
];

const YEAR_DIRECTION_LABELS = {
  careerDirection: "事业 / 方向",
  relationship: "感情 / 关系",
  healthState: "身心 / 状态",
};

const DIRECTION_FALLBACKS = {
  careerDirection: "这一方向当前不是最强主线，现实发展更多承接原局底色与当前阶段背景，具体变化仍看后续触发。",
  relationship: "这一方向当前不是最强主线，关系层面以原有模式的延续和调整为主，具体变化仍看后续触发。",
  healthState: "这一方向当前更多体现为压力承受、精力恢复和生活节奏的变化，重点是及时休息并留意长期紧绷。",
};

const INSUFFICIENT_TEXT = "这一方向不是本运最强主线，当前更多承接原局底色，具体变化更看后续流年触发。";
const INSUFFICIENT_PATTERN = /证据不足|未形成独立强象|主要承接原局|暂不下结论|等待流年/;

const SOFT_SEMANTIC_PATTERNS = [
  /家庭或年柱事实不足以直接扩写祖产、祖业或长辈资源/,
  /大运总报告没有逐年证据时不能自行划分具体年龄段或指定年份高峰/,
  /没有专门健康规则支持时，禁止输出具体器官或疾病/,
  /青年阶段不能仅凭时柱优先断晚年、子女或下属事务/,
];

const HEALTH_TERMS = [
  "心脑血管", "心血管", "脑血管", "肾脏", "泌尿系统", "肝脏", "肺部",
  "脾胃", "胃病", "甲状腺", "妇科", "男科", "精神疾病", "抑郁症", "焦虑症", "失眠症",
];

const FAMILY_REPLACEMENTS = [
  [/祖产|祖业|祖上资源|家族资源|遗产|房产分配/g, "家庭基础或原有资源"],
  [/长辈资源|长辈支持/g, "家庭支持或外部支持"],
];

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
      overallJudgment: "string；简洁即可，不以字数决定是否整篇失败",
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
        evidenceIds: ["必须有效；可综合借用天干或地支阶段证据"],
        ruleIds: ["必须有效；可综合借用天干或地支阶段规则"],
        gains: ["至少一条"],
        costs: ["至少一条"],
      },
      directions: {
        careerDirection: {
          summary: "string；证据不足时明确写未形成独立强象",
          evidenceIds: ["可为空"],
          ruleIds: ["可为空"],
          positive: ["0至2条"],
          risks: ["0至2条"],
          advice: ["0至2条"],
        },
        relationship: {
          summary: "string；无匹配规则时必须写证据不足，不得因此整篇失败",
          evidenceIds: ["可为空"],
          ruleIds: ["可为空"],
          positive: ["0至2条"],
          risks: ["0至2条"],
          advice: ["0至2条"],
        },
        healthState: {
          summary: "只写压力、精力、作息、情绪与节奏；无规则时写证据不足",
          evidenceIds: ["可为空"],
          ruleIds: ["可为空"],
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
      verificationQuestions: ["现实验证问题，可为空"],
    };
  }

  if (normalizedStage === "year") {
    return {
      stage: "year",
      overallJudgment: "年度总断；说明大运背景下今年哪里有动静，不写死具体结果",
      luckOverlay: {
        alignment: "same | supportive | conflicting | mixed",
        title: "叠加大运",
        summary: "流年五行与大运同向、相生、相克或混合",
        evidenceIds: ["可引用大运与流年层事实"],
        ruleIds: ["可引用匹配规则"],
        keyPoints: ["0至3条"],
      },
      natalInteraction: {
        title: "冲合原局",
        summary: "流年干支冲合原局哪些柱，以及触发的结构轮廓",
        evidenceIds: ["可引用冲合刑害破事实"],
        ruleIds: ["可引用匹配规则"],
        keyPoints: ["0至4条"],
      },
      tenGodActivation: {
        title: "十神引动",
        summary: "流年天干对日主是什么十神，年度外显主题是什么",
        evidenceIds: ["至少引用流年十神事实"],
        ruleIds: ["可引用匹配规则"],
        keyPoints: ["0至3条"],
      },
      forceAssessment: {
        verdict: "strong_favorable | favorable_with_pressure | pressure_with_opportunity | strong_pressure | mixed",
        label: "string",
        summary: "综合大运基调和流年触发判断年度力度",
        evidenceIds: ["可综合引用"],
        ruleIds: ["可综合引用"],
        basis: ["0至4条"],
      },
      eventOutline: {
        summary: "只说哪些领域有动静和事件轮廓，不断具体结果",
        domains: ["0至4个领域"],
        evidenceIds: ["可为空"],
        ruleIds: ["可为空"],
        positive: ["0至3条"],
        risks: ["0至3条"],
        advice: ["0至3条"],
      },
      directions: {
        careerDirection: {
          summary: "本年事业、学业、岗位、技术、项目或输出方面的现实表现；不突出时自然说明相对平稳",
          evidenceIds: ["可为空"],
          ruleIds: ["可为空"],
          positive: ["0至2条"],
          risks: ["0至2条"],
          advice: ["0至2条"],
        },
        relationship: {
          summary: "本年感情、合作与人际关系方面的现实表现；不突出时自然说明主要延续原有模式",
          evidenceIds: ["可为空"],
          ruleIds: ["可为空"],
          positive: ["0至2条"],
          risks: ["0至2条"],
          advice: ["0至2条"],
        },
        healthState: {
          summary: "本年压力、精力、恢复、作息、寒暖燥湿与生活节奏；不得诊断疾病",
          evidenceIds: ["可为空"],
          ruleIds: ["可为空"],
          positive: ["0至2条"],
          risks: ["0至2条"],
          advice: ["0至2条"],
        },
      },
      selectedImages: [],
      finalAdvice: ["0至5条"],
      verificationQuestions: ["0至5条"],
    };
  }

  return {
    stage: "month",
    overallJudgment: "流月主线；只讲本月节奏，不写具体结果",
    threeLayerOverlay: {
      title: "三层叠加",
      summary: "大运底色、流年气场与流月五行如何叠加",
      evidenceIds: ["可引用大运、流年、流月事实"],
      ruleIds: ["可引用匹配规则"],
      keyPoints: ["0至4条"],
    },
    rhythmAssessment: {
      mode: "advance | wait | close | adjust | mixed",
      label: "推进 | 等待 | 收尾整理 | 调整节奏 | 边走边看",
      summary: "说明为什么形成这个节奏",
      evidenceIds: ["可为空"],
      ruleIds: ["可为空"],
    },
    localTrigger: {
      title: "小触发点",
      summary: "流月冲合原局哪一柱，只说局部触发方向",
      evidenceIds: ["可引用流月直接事实"],
      ruleIds: ["可引用匹配规则"],
      keyPoints: ["0至3条"],
    },
    actionAdvice: {
      do: ["本月适合做什么"],
      avoid: ["本月不宜做什么"],
      pace: ["节奏如何拿"],
    },
    rhythmSummary: "只总结本月节奏感与适合往哪里使力",
    selectedImages: [],
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
  const fatalIssues = [];
  const warnings = [];
  const refs = buildAllowedRefs(rawFactPack, candidatePack);
  let normalized = normalizeReport(report, normalizedStage);

  if (rawFactPack?.validation?.usable === false) {
    fatalIssues.push(...array(rawFactPack?.validation?.errors).map((item) => `硬事实校验失败：${item}`));
  }

  if (normalized.stage !== normalizedStage) fatalIssues.push("报告时间层与当前请求不一致");

  if (normalizedStage === "luck") {
    const repaired = repairLuckReport(normalized, refs, rawFactPack, candidatePack);
    normalized = repaired.report;
    warnings.push(...repaired.warnings);

    if (normalized.overallJudgment.length < 18) {
      warnings.push("十年总断较短，已保留八步流程，不再因此整篇阻断");
    }

    validateLuckCore(normalized, refs, fatalIssues, warnings);
  } else if (normalizedStage === "year") {
    const repaired = repairYearReport(normalized, candidatePack);
    normalized = repaired.report;
    warnings.push(...repaired.warnings);
    if (normalized.overallJudgment.length < 16) warnings.push("年度总断较短，报告仍照常展示");
    validateYearFlowReport(normalized, refs, warnings);
  } else {
    if (normalized.overallJudgment.length < 12) warnings.push("流月主线较短，报告仍照常展示");
    validateMonthFlowReport(normalized, refs, warnings);
  }

  const visibleText = collectVisibleText(normalized);
  const absoluteCheckText = visibleText.replace(/不必然|并非必然|不是必然|不一定|未必|不能断定/g, "");
  if (/必然|注定|百分之百|肯定会|一定会/.test(absoluteCheckText)) fatalIssues.push("出现无条件绝对化判断");
  if (/学业彻底失败|事业彻底结束|关系必然破裂|一定无法结婚|肯定分手/.test(visibleText)) {
    fatalIssues.push("把阶段受阻写成了必然终止");
  }
  if (normalizedStage === "month" && /(结婚|离婚|移民|定居|终身|彻底转行)/.test(visibleText)) {
    fatalIssues.push("流月越级写成长期结果");
  }

  const semanticIssues = validateReportSemantics({
    report: normalized,
    stage: normalizedStage,
    rawFactPack,
    candidatePack,
  });

  semanticIssues.forEach((issue) => {
    if (normalizedStage === "luck" && SOFT_SEMANTIC_PATTERNS.some((pattern) => pattern.test(issue))) {
      warnings.push(issue);
    } else {
      fatalIssues.push(issue);
    }
  });

  return {
    usable: fatalIssues.length === 0,
    issues: unique(fatalIssues),
    fatalIssues: unique(fatalIssues),
    warnings: unique(warnings),
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
      "### ⑦ 行动建议",
      ...value.actionAdvice.advance.map((item) => `- 主动推进：${item}`),
      ...value.actionAdvice.control.map((item) => `- 需要控制：${item}`),
      ...value.actionAdvice.avoidForNow.map((item) => `- 暂不勉强：${item}`),
      "",
      "### ⑧ 大运交接过渡期提示",
      value.transition.summary,
      ...value.transition.advice.map((item) => `- ${item}`),
      value.verificationQuestions.length ? "" : "",
      value.verificationQuestions.length ? "### 现实验证点" : "",
      ...value.verificationQuestions.map((item) => `- ${item}`),
    ].filter((item) => item !== undefined).join("\n").trim();
  }

  if (normalizedStage === "year") {
    return [
      "### 年度总断｜流年：事件触发层",
      value.overallJudgment,
      "",
      renderFlowSection("① 叠加大运", value.luckOverlay),
      "",
      renderFlowSection("② 冲合原局", value.natalInteraction),
      "",
      renderFlowSection("③ 十神引动", value.tenGodActivation),
      "",
      "### ④ 力度评价",
      `**${value.forceAssessment.label || value.forceAssessment.verdict}**`,
      value.forceAssessment.summary,
      ...value.forceAssessment.basis.map((item) => `- ${item}`),
      "",
      "### 事件轮廓",
      value.eventOutline.summary,
      ...value.eventOutline.advice.map((item) => `- ${item}`),
      "",
      "### 本年三个方向",
      ...YEAR_DIRECTION_KEYS.flatMap((key) => {
        const entry = value.directions[key];
        return [
          `#### ${YEAR_DIRECTION_LABELS[key]}`,
          entry.summary,
          ...renderCompactLists(entry),
          "",
        ];
      }),
      "### 本年建议",
      ...value.finalAdvice.map((item) => `- ${item}`),
    ].join("\n").trim();
  }

  return [
    "### 流月主线｜流月：节奏细化层",
    value.overallJudgment,
    "",
    renderFlowSection("① 三层叠加", value.threeLayerOverlay),
    "",
    "### ② 节奏判断",
    `**${value.rhythmAssessment.label || value.rhythmAssessment.mode}**`,
    value.rhythmAssessment.summary,
    "",
    renderFlowSection("③ 小触发点", value.localTrigger),
    "",
    "### ④ 行动建议",
    ...value.actionAdvice.do.map((item) => `- 适合做：${item}`),
    ...value.actionAdvice.avoid.map((item) => `- 不宜做：${item}`),
    ...value.actionAdvice.pace.map((item) => `- 节奏拿法：${item}`),
    "",
    value.rhythmSummary,
  ].join("\n").trim();
}

function repairLuckReport(report, refs, rawFactPack, candidatePack) {
  const warnings = [];
  const repaired = clone(report);

  repaired.overallJudgment = sanitizeLuckText(repaired.overallJudgment, candidatePack);
  repaired.stemPhase = sanitizeEvidenceSection(repaired.stemPhase, candidatePack);
  repaired.branchPhase = sanitizeEvidenceSection(repaired.branchPhase, candidatePack);
  repaired.assessment.summary = sanitizeLuckText(repaired.assessment.summary, candidatePack);
  repaired.assessment.gains = repaired.assessment.gains.map((item) => sanitizeLuckText(item, candidatePack));
  repaired.assessment.costs = repaired.assessment.costs.map((item) => sanitizeLuckText(item, candidatePack));

  if (repaired.overallJudgment.length < 18) {
    repaired.overallJudgment = "这步大运以天干外显、地支承接和原局互动为主，整体机会与代价并存，宜按现实触发边走边调整。";
    warnings.push("AI十年总断过短，已使用保守总述补齐流程");
  }

  if (!repaired.stemPhase.phaseNote) {
    repaired.stemPhase.phaseNote = "前段权重与外显主题，不代表后段完全失效。";
  }
  if (!repaired.branchPhase.phaseNote) {
    repaired.branchPhase.phaseNote = "后段权重与深层承接，不代表前段完全不起作用。";
  }

  repaired.assessment.verdict = ["favorable", "mixed", "pressure"].includes(repaired.assessment.verdict)
    ? repaired.assessment.verdict
    : "mixed";
  repaired.assessment.label = repaired.assessment.label || {
    favorable: "顺运（借力）",
    mixed: "中性（调整）",
    pressure: "逆运（收敛）",
  }[repaired.assessment.verdict];
  repaired.assessment.summary = repaired.assessment.summary.length >= 18
    ? repaired.assessment.summary
    : "这步大运需要综合天干外显、地支承接与原局可用程度判断，当前以混合调整、发挥可用部分为主。";

  const assessmentPair = findFirstValidPair([
    repaired.assessment,
    repaired.stemPhase,
    repaired.branchPhase,
  ], refs);
  if (assessmentPair) {
    repaired.assessment.evidenceIds = [assessmentPair.evidenceId];
    repaired.assessment.ruleIds = [assessmentPair.ruleId];
  }

  if (!repaired.assessment.gains.length) {
    repaired.assessment.gains = unique([
      ...repaired.stemPhase.positive,
      ...repaired.branchPhase.positive,
      "把当前大运可用的力量转成实际能力与成果",
    ]).slice(0, 3);
  }
  if (!repaired.assessment.costs.length) {
    repaired.assessment.costs = unique([
      ...repaired.stemPhase.risks,
      ...repaired.branchPhase.risks,
      "需要承担调整节奏与处理矛盾的成本",
    ]).slice(0, 3);
  }

  LUCK_DIRECTION_KEYS.forEach((key) => {
    const original = repaired.directions[key];
    const sanitized = sanitizeDirection(original, key, rawFactPack, candidatePack);
    const pair = findFirstValidPair([sanitized], refs);
    const insufficient = INSUFFICIENT_PATTERN.test(sanitized.summary);

    if (!pair && !insufficient) {
      repaired.directions[key] = emptyDirection(key);
      warnings.push(`${LUCK_DIRECTION_LABELS[key]}缺少独立规则证据，已降级为“等待流年触发”，不再阻断整篇报告`);
      return;
    }

    if (pair) {
      sanitized.evidenceIds = [pair.evidenceId];
      sanitized.ruleIds = [pair.ruleId];
    } else {
      sanitized.evidenceIds = [];
      sanitized.ruleIds = [];
    }
    repaired.directions[key] = sanitized;
  });

  if (!repaired.actionAdvice.advance.length) {
    repaired.actionAdvice.advance = unique([
      ...repaired.stemPhase.advice,
      ...repaired.branchPhase.advice,
    ]).slice(0, 2);
  }
  if (!repaired.actionAdvice.advance.length) {
    repaired.actionAdvice.advance = ["优先推进与本运主线一致、能够形成实际成果的事项"];
  }
  if (!repaired.actionAdvice.control.length) {
    repaired.actionAdvice.control = ["控制分散投入，重要决定保留复核和调整空间"];
  }
  if (!repaired.actionAdvice.avoidForNow.length) {
    repaired.actionAdvice.avoidForNow = ["当前不突出的领域先保持观察，把精力放在本运已经显现的主线上"];
  }

  if (!repaired.transition.summary) {
    repaired.transition.summary = "换运前后以收尾、观察和准备为主，不因气场交接仓促扩大结论。";
  }

  return { report: repaired, warnings: unique(warnings) };
}

function repairYearReport(report, candidatePack) {
  const repaired = clone(report);
  const warnings = [];

  YEAR_DIRECTION_KEYS.forEach((key) => {
    const entry = repaired.directions?.[key] ?? normalizeDirection({});
    let summary = naturalizePublicDirectionText(entry.summary, key);
    let positive = entry.positive.map((item) =>
      naturalizePublicDirectionText(item, key),
    );
    let risks = entry.risks.map((item) =>
      naturalizePublicDirectionText(item, key),
    );
    let advice = entry.advice.map((item) =>
      naturalizePublicDirectionText(item, key),
    );

    if (key === "healthState") {
      summary = removeUnsupportedHealthTerms(summary, candidatePack);
      positive = positive.map((item) =>
        removeUnsupportedHealthTerms(item, candidatePack),
      );
      risks = risks.map((item) =>
        removeUnsupportedHealthTerms(item, candidatePack),
      );
      advice = advice.map((item) =>
        removeUnsupportedHealthTerms(item, candidatePack),
      );
    }

    repaired.directions[key] = {
      ...entry,
      summary: summary || DIRECTION_FALLBACKS[key],
      positive: unique(positive),
      risks: unique(risks),
      advice: unique(advice),
    };

    if (!entry.summary) {
      warnings.push(`${YEAR_DIRECTION_LABELS[key]}未形成集中主线，已使用自然保守表达`);
    }
  });

  return {
    report: repaired,
    warnings: unique(warnings),
  };
}

function sanitizeEvidenceSection(section, candidatePack) {
  return {
    ...section,
    title: sanitizeLuckText(section.title, candidatePack),
    phaseNote: sanitizeLuckText(section.phaseNote, candidatePack),
    summary: sanitizeLuckText(section.summary, candidatePack),
    positive: section.positive.map((item) => sanitizeLuckText(item, candidatePack)),
    risks: section.risks.map((item) => sanitizeLuckText(item, candidatePack)),
    advice: section.advice.map((item) => sanitizeLuckText(item, candidatePack)),
  };
}

function sanitizeDirection(entry, key, rawFactPack, candidatePack) {
  const gender = String(rawFactPack?.natal?.gender || "").toLowerCase();
  let summary = sanitizeLuckText(entry.summary, candidatePack);
  let positive = entry.positive.map((item) => sanitizeLuckText(item, candidatePack));
  let risks = entry.risks.map((item) => sanitizeLuckText(item, candidatePack));
  let advice = entry.advice.map((item) => sanitizeLuckText(item, candidatePack));
  const combined = [summary, ...positive, ...risks, ...advice].join(" ");

  if (key === "relationship") {
    const wrongGender = (gender === "male" && /(女命|官杀为夫星|夫星合身|女命以官杀)/.test(combined))
      || (gender === "female" && /(男命|财星为妻星|妻星合身|男命以财星)/.test(combined));
    if (wrongGender) return emptyDirection(key);
  }

  if (key === "healthState") {
    summary = removeUnsupportedHealthTerms(summary, candidatePack);
    positive = positive.map((item) => removeUnsupportedHealthTerms(item, candidatePack));
    risks = risks.map((item) => removeUnsupportedHealthTerms(item, candidatePack));
    advice = advice.map((item) => removeUnsupportedHealthTerms(item, candidatePack));
  }

  return {
    ...entry,
    summary: naturalizePublicDirectionText(summary || INSUFFICIENT_TEXT, key),
    positive: unique(
      positive.map((item) => naturalizePublicDirectionText(item, key)),
    ),
    risks: unique(
      risks.map((item) => naturalizePublicDirectionText(item, key)),
    ),
    advice: unique(
      advice.map((item) => naturalizePublicDirectionText(item, key)),
    ),
  };
}

function sanitizeLuckText(value, candidatePack) {
  let output = text(value);
  if (!output) return "";

  FAMILY_REPLACEMENTS.forEach(([pattern, replacement]) => {
    output = output.replace(pattern, replacement);
  });

  output = removeUnsupportedHealthTerms(output, candidatePack)
    .replace(/亥子.{0,6}(六合|合水|半合水|半会水局|半会水)/g, "亥子三会水方两支条件")
    .replace(/子卯.{0,4}无恩之刑/g, "子卯无礼之刑")
    .replace(/无恩之刑.{0,4}子卯/g, "子卯无礼之刑")
    .replace(/食伤齐透/g, "食伤之气增强")
    .replace(/丙辛合身|官星合身/g, "五合关系被引动")
    .replace(/\d{1,2}\s*[—\-至到~]\s*\d{1,2}\s*岁/g, "阶段性")
    .replace(/20\d{2}年?/g, "某些流年")
    .replace(/前五年.{0,6}(只看天干|地支不起作用)/g, "前五年更偏天干外显")
    .replace(/后五年.{0,6}(只看地支|天干不起作用)/g, "后五年更偏地支承接")
    .replace(/一定会|肯定会/g, "更容易")
    .replace(/必然/g, "倾向于");

  return output.replace(/\s+/g, " ").trim();
}

function removeUnsupportedHealthTerms(value, candidatePack) {
  const candidateText = JSON.stringify(candidatePack?.candidateImages || []);
  let output = text(value);
  let hasSpecificHealthRule = false;
  HEALTH_TERMS.forEach((term) => {
    if (candidateText.includes(term)) {
      hasSpecificHealthRule = true;
    } else {
      output = output.replaceAll(term, "身心状态");
    }
  });
  if (!hasSpecificHealthRule) {
    output = output
      .replace(/身心状态疾病/g, "身心状态波动")
      .replace(/疾病|病症|病变/g, "状态波动");
  }
  return output;
}

function naturalizePublicDirectionText(value, key = "") {
  let output = text(value);

  if (!output) {
    return DIRECTION_FALLBACKS[key] || INSUFFICIENT_TEXT;
  }

  output = output
    .replace(
      /原局只支持寒暖燥湿、压力和生活节奏层面的提醒[，,]?\s*不足以判断具体器官或疾病[。.]?/g,
      "这一方面更多体现为寒暖燥湿、压力承受和生活节奏的变化，重点观察恢复力与长期紧绷感。",
    )
    .replace(
      /不足以判断具体器官或疾病/g,
      "更适合观察压力、恢复力与生活节奏的变化",
    )
    .replace(
      /没有专门(?:健康)?规则支持时?[，,：:]?/g,
      "",
    )
    .replace(
      /证据不足[，,。]?/g,
      "这一方向当前不算突出，",
    )
    .replace(
      /(?:本运在该方向)?暂未形成独立强象[，,。]?\s*(?:先看原局底色[，,。]?)?\s*(?:并)?等待流年进一步触发[。.]?/g,
      DIRECTION_FALLBACKS[key] || INSUFFICIENT_TEXT,
    )
    .replace(
      /未形成独立强象[，,。]?/g,
      "当前不是最强主线，",
    )
    .replace(
      /等待流年进一步触发/g,
      "具体变化更看后续流年触发",
    )
    .replace(/\s+/g, " ")
    .trim();

  return output || DIRECTION_FALLBACKS[key] || INSUFFICIENT_TEXT;
}

function emptyDirection(key = "") {
  return {
    summary: DIRECTION_FALLBACKS[key] || INSUFFICIENT_TEXT,
    evidenceIds: [],
    ruleIds: [],
    positive: [],
    risks: [],
    advice: [],
  };
}

function validateLuckCore(report, refs, fatalIssues, warnings) {
  validateCoreEvidenceSection(report.stemPhase, "天干前五年", refs, fatalIssues, warnings);
  validateCoreEvidenceSection(report.branchPhase, "地支后五年", refs, fatalIssues, warnings);

  const assessment = report.assessment;
  if (!assessment.label || !assessment.summary) fatalIssues.push("大运总判缺少清晰结论");
  validateReferences(assessment, "大运总判", refs, fatalIssues, { required: true });

  LUCK_DIRECTION_KEYS.forEach((key) => {
    const entry = report.directions[key];
    const label = LUCK_DIRECTION_LABELS[key];
    if (!entry.summary) warnings.push(`缺少${label}简断，已显示保守占位`);
    const insufficient = INSUFFICIENT_PATTERN.test(entry.summary);
    if (!insufficient) validateReferences(entry, label, refs, fatalIssues, { required: false });
  });

  const phaseText = `${report.stemPhase.phaseNote} ${report.branchPhase.phaseNote}`;
  const prohibitedAbsoluteSplit = /(天干|地支).{0,8}(只管|仅管)|前五年.{0,8}(地支不起作用|只看天干)|后五年.{0,8}(天干不起作用|只看地支)/;
  if (prohibitedAbsoluteSplit.test(phaseText)) {
    warnings.push("天干前五年与地支后五年被改为权重表达，不作为绝对切割");
  }
}

function validateCoreEvidenceSection(section, label, refs, fatalIssues, warnings) {
  if (!section.title || !section.summary) fatalIssues.push(`${label}缺少核心分析`);
  else if (section.summary.length < 16) warnings.push(`${label}分析较短，但保留流程展示`);
  validateReferences(section, label, refs, fatalIssues, { required: true });
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

function findFirstValidPair(sections, refs) {
  for (const section of sections) {
    for (const ruleId of array(section?.ruleIds)) {
      if (!refs.allowedRuleIds.has(ruleId)) continue;
      const allowed = refs.allowedRuleEvidence.get(ruleId);
      if (!allowed) continue;
      const evidenceId = array(section?.evidenceIds).find((id) => refs.allowedEvidenceIds.has(id) && allowed.has(id));
      if (evidenceId) return { ruleId, evidenceId };
    }
  }
  return null;
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

  if (stage === "year") return normalizeYearFlowReport(report);
  return normalizeMonthFlowReport(report);
}


function normalizeYearFlowReport(report) {
  const legacyImages = array(report?.selectedImages).map(normalizeImage);
  const luckOverlay = normalizeFlowStep(report?.luckOverlay, "叠加大运");
  const natalInteraction = normalizeFlowStep(report?.natalInteraction, "冲合原局");
  const tenGodActivation = normalizeFlowStep(report?.tenGodActivation, "十神引动");
  if (!luckOverlay.summary && legacyImages[0]?.analysis) luckOverlay.summary = legacyImages[0].analysis;
  if (!natalInteraction.summary && legacyImages[1]?.analysis) natalInteraction.summary = legacyImages[1].analysis;
  if (!tenGodActivation.summary && legacyImages[2]?.analysis) tenGodActivation.summary = legacyImages[2].analysis;
  return {
    stage: text(report?.stage || "year"),
    overallJudgment: text(report?.overallJudgment),
    luckOverlay,
    natalInteraction,
    tenGodActivation,
    forceAssessment: {
      verdict: text(report?.forceAssessment?.verdict || "mixed"),
      label: text(report?.forceAssessment?.label),
      summary: text(report?.forceAssessment?.summary),
      evidenceIds: unique(array(report?.forceAssessment?.evidenceIds)),
      ruleIds: unique(array(report?.forceAssessment?.ruleIds)),
      basis: unique(array(report?.forceAssessment?.basis)).slice(0, 4),
    },
    eventOutline: {
      summary: text(report?.eventOutline?.summary),
      domains: unique(array(report?.eventOutline?.domains)).slice(0, 4),
      evidenceIds: unique(array(report?.eventOutline?.evidenceIds)),
      ruleIds: unique(array(report?.eventOutline?.ruleIds)),
      positive: unique(array(report?.eventOutline?.positive)).slice(0, 3),
      risks: unique(array(report?.eventOutline?.risks)).slice(0, 3),
      advice: unique(array(report?.eventOutline?.advice)).slice(0, 3),
    },
    directions: Object.fromEntries(
      YEAR_DIRECTION_KEYS.map((key) => [
        key,
        normalizeDirection(report?.directions?.[key]),
      ]),
    ),
    selectedImages: legacyImages,
    finalAdvice: unique(array(report?.finalAdvice)).slice(0, 5),
    verificationQuestions: unique(array(report?.verificationQuestions)).slice(0, 5),
  };
}

function normalizeMonthFlowReport(report) {
  const legacyImages = array(report?.selectedImages).map(normalizeImage);
  const threeLayerOverlay = normalizeFlowStep(report?.threeLayerOverlay, "三层叠加");
  const localTrigger = normalizeFlowStep(report?.localTrigger, "小触发点");
  if (!threeLayerOverlay.summary && legacyImages[0]?.analysis) threeLayerOverlay.summary = legacyImages[0].analysis;
  if (!localTrigger.summary && legacyImages[1]?.analysis) localTrigger.summary = legacyImages[1].analysis;
  return {
    stage: text(report?.stage || "month"),
    overallJudgment: text(report?.overallJudgment),
    threeLayerOverlay,
    rhythmAssessment: {
      mode: text(report?.rhythmAssessment?.mode || "mixed"),
      label: text(report?.rhythmAssessment?.label),
      summary: text(report?.rhythmAssessment?.summary),
      evidenceIds: unique(array(report?.rhythmAssessment?.evidenceIds)),
      ruleIds: unique(array(report?.rhythmAssessment?.ruleIds)),
    },
    localTrigger,
    actionAdvice: {
      do: unique(array(report?.actionAdvice?.do)).slice(0, 4),
      avoid: unique(array(report?.actionAdvice?.avoid)).slice(0, 4),
      pace: unique(array(report?.actionAdvice?.pace)).slice(0, 4),
    },
    rhythmSummary: text(report?.rhythmSummary),
    selectedImages: legacyImages,
  };
}

function normalizeFlowStep(value, defaultTitle) {
  const entry = value && typeof value === "object" ? value : {};
  return {
    title: text(entry?.title || defaultTitle),
    alignment: text(entry?.alignment),
    summary: text(entry?.summary),
    evidenceIds: unique(array(entry?.evidenceIds)),
    ruleIds: unique(array(entry?.ruleIds)),
    keyPoints: unique(array(entry?.keyPoints)).slice(0, 4),
  };
}

function validateYearFlowReport(report, refs, warnings) {
  [
    [report.luckOverlay, "叠加大运"],
    [report.natalInteraction, "冲合原局"],
    [report.tenGodActivation, "十神引动"],
    [report.forceAssessment, "力度评价"],
  ].forEach(([entry, label]) => {
    if (!entry?.summary) warnings.push(`${label}内容缺失，报告仍照常展示`);
    validateReferences(entry, label, refs, warnings, { required: false });
  });
  if (!report.eventOutline?.summary) warnings.push("事件轮廓缺失，报告仍照常展示");

  YEAR_DIRECTION_KEYS.forEach((key) => {
    const entry = report.directions?.[key];
    const label = YEAR_DIRECTION_LABELS[key];
    if (!entry?.summary) warnings.push(`${label}简断缺失，已显示自然保守表达`);
    validateReferences(entry, label, refs, warnings, { required: false });
  });
}

function validateMonthFlowReport(report, refs, warnings) {
  [
    [report.threeLayerOverlay, "三层叠加"],
    [report.rhythmAssessment, "节奏判断"],
    [report.localTrigger, "小触发点"],
  ].forEach(([entry, label]) => {
    if (!entry?.summary) warnings.push(`${label}内容缺失，报告仍照常展示`);
    validateReferences(entry, label, refs, warnings, { required: false });
  });
  if (!report.actionAdvice.do.length && !report.actionAdvice.avoid.length && !report.actionAdvice.pace.length) {
    warnings.push("流月行动建议为空，报告仍照常展示");
  }
}

function renderFlowSection(title, section) {
  return [
    `### ${title}`,
    section.summary,
    ...section.keyPoints.map((item) => `- ${item}`),
  ].filter(Boolean).join("\n");
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
    section.positive.length ? `**有利面：** ${section.positive.join("；")}` : "",
    section.risks.length ? `**压力与代价：** ${section.risks.join("；")}` : "",
    section.advice.length ? `**建议：** ${section.advice.join("；")}` : "",
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

function clone(value) {
  return JSON.parse(JSON.stringify(value || {}));
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
