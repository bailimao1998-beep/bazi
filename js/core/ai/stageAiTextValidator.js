const ABSOLUTE_PATTERNS = [
  /百分之百/,
  /注定/,
  /一定会/,
  /必然发生/,
  /必然结婚/,
];

const YEAR_TIMING_PATTERNS = [
  /年初/,
  /年中/,
  /年末/,
  /上半年/,
  /下半年/,
  /农历[一二三四五六七八九十冬腊\d]+月/,
  /(?:正|二|三|四|五|六|七|八|九|十|冬|腊)月/,
];

const HEALTH_PATTERNS = [
  /循环系统/,
  /内分泌/,
  /炎症/,
  /下焦/,
  /肠胃不适/,
  /心脏问题/,
  /肝脏问题/,
  /肾脏问题/,
];

const USE_GOD_PATTERNS = [
  /为用/,
  /用神/,
  /喜神/,
  /忌神/,
  /喜用/,
];

const FORMED_PATTERNS = [
  /已经合化/,
  /合化为[木火土金水]/,
  /已经成局/,
  /形成(?:三合|三会|六合)?局/,
];

const STEM_ELEMENT = {
  甲: "木",
  乙: "木",
  丙: "火",
  丁: "火",
  戊: "土",
  己: "土",
  庚: "金",
  辛: "金",
  壬: "水",
  癸: "水",
};

export function validateStageAiText({
  text,
  stage = "luck",
  trustedPack = null,
} = {}) {
  const normalized = String(text || "").trim();
  const hardViolations = [];

  if (!normalized) {
    hardViolations.push("empty_response");
  }

  ABSOLUTE_PATTERNS.forEach((pattern) => {
    if (pattern.test(normalized)) {
      hardViolations.push(`absolute_claim:${pattern.source}`);
    }
  });

  HEALTH_PATTERNS.forEach((pattern) => {
    if (
      pattern.test(normalized) &&
      !sourceMaterialIncludes(trustedPack, pattern)
    ) {
      hardViolations.push(
        `unsupported_health_claim:${pattern.source}`,
      );
    }
  });

  if (
    normalized.includes("财库") &&
    !sourceMaterialIncludes(trustedPack, /财库/)
  ) {
    hardViolations.push("unsupported_treasury_claim");
  }

  if (
    USE_GOD_PATTERNS.some((pattern) => pattern.test(normalized)) &&
    !hasConfirmedUseGod(trustedPack)
  ) {
    hardViolations.push("unsupported_use_god_claim");
  }

  if (
    FORMED_PATTERNS.some((pattern) => pattern.test(normalized)) &&
    !hasFormedTransformation(trustedPack)
  ) {
    hardViolations.push("unsupported_formed_transformation");
  }

  hardViolations.push(
    ...detectReversedControls(normalized, trustedPack),
  );

  if (stage === "year") {
    YEAR_TIMING_PATTERNS.forEach((pattern) => {
      if (pattern.test(normalized)) {
        hardViolations.push(
          `unsupported_year_timing:${pattern.source}`,
        );
      }
    });
  }

  if (stage === "luck") {
    const ageRanges = normalized.match(
      /\d{1,2}\s*(?:[-—至~～到])\s*\d{1,2}\s*岁/g,
    ) || [];

    if (ageRanges.length > 1) {
      hardViolations.push(
        `unsupported_luck_age_segments:${ageRanges.join(",")}`,
      );
    }
  }

  const uniqueViolations = [...new Set(hardViolations)];

  return {
    valid:
      Boolean(normalized) &&
      uniqueViolations.length === 0,
    hardViolations: uniqueViolations,
    violations: uniqueViolations,
    warnings: uniqueViolations,
  };
}

export function buildStageAiRepairPrompt(prompt, validation) {
  const violations =
    Array.isArray(validation?.hardViolations) &&
    validation.hardViolations.length
      ? validation.hardViolations.join("；")
      : "未知硬事实错误";

  return {
    ...prompt,
    system: [
      prompt?.system || "",
      "",
      "上一版报告存在硬事实错误，请重新生成完整报告。",
      `需要修复：${violations}`,
      "不要补固定领域，不要扩大篇幅，只修正事实错误并保留真正明显的内容。",
      "必须服从 relationFacts 中的关系方向和成立状态。",
    ].join("\n"),
    user: [
      prompt?.user || "",
      "",
      "请重新生成报告，修复上述硬事实错误。",
    ].join("\n"),
  };
}

function detectReversedControls(text, trustedPack) {
  return array(trustedPack?.relationFacts)
    .filter((fact) =>
      fact?.meta?.controller &&
      fact?.meta?.controlled
    )
    .flatMap((fact) => {
      const controller = String(fact.meta.controller);
      const controlled = String(fact.meta.controlled);
      const controllerElement = STEM_ELEMENT[controller] || "";
      const controlledElement = STEM_ELEMENT[controlled] || "";

      const reversed = new RegExp(
        `${escapeRegExp(controlled)}${controlledElement}?` +
        `[^，。；\\n]{0,10}(?:克制|克|制约)` +
        `[^，。；\\n]{0,10}` +
        `${escapeRegExp(controller)}${controllerElement}?`,
      );

      return reversed.test(text)
        ? [`reversed_control:${controlled}->${controller}`]
        : [];
    });
}

function hasConfirmedUseGod(trustedPack) {
  const material = [
    trustedPack?.candidateInterpretations?.natalStructure,
    trustedPack?.candidateInterpretations?.natalSummary,
    ...array(trustedPack?.candidateInterpretations?.natalImages),
  ];

  const serialized = JSON.stringify(material);

  if (/尚未确认|未确认|待确认|证据不足/.test(serialized)) {
    return false;
  }

  return /用神|喜用|喜神|忌神/.test(serialized);
}

function hasFormedTransformation(trustedPack) {
  return array(trustedPack?.relationFacts).some((fact) => {
    const formation = String(
      fact?.meta?.formationStatus || "",
    );
    const transformation = String(
      fact?.meta?.transformationStatus || "",
    );

    return (
      formation === "formed" ||
      transformation === "formed"
    );
  });
}

function sourceMaterialIncludes(trustedPack, pattern) {
  const material = [
    ...array(trustedPack?.relationFacts).map(
      (fact) => fact?.rawText,
    ),
    trustedPack?.candidateInterpretations?.natalStructure,
    trustedPack?.candidateInterpretations?.natalSummary,
    ...array(trustedPack?.candidateInterpretations?.natalImages),
    ...array(trustedPack?.candidateInterpretations?.stageImages),
  ]
    .filter(Boolean)
    .map((entry) =>
      typeof entry === "string"
        ? entry
        : JSON.stringify(entry),
    )
    .join("\n");

  pattern.lastIndex = 0;
  return pattern.test(material);
}

function escapeRegExp(value) {
  return String(value).replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&",
  );
}

function array(value) {
  return Array.isArray(value)
    ? value
    : value === undefined || value === null
      ? []
      : [value];
}
