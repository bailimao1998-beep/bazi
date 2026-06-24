export const STAGE_AI_DOMAIN_LABELS = [
  "事业与工作",
  "学业与资格",
  "财富与资源",
  "感情与婚姻",
  "家庭与父母",
  "兄弟朋友",
  "子女与成果",
  "身心与健康",
  "迁移与出行",
  "住房与资产",
  "合作与人际",
  "精神状态",
];

const REQUIRED_SECTIONS = [
  "重点主线",
  "次要领域",
  "当前不突出",
  "事情发展逻辑",
  "有利与风险",
  "现实验证点",
];

const ABSOLUTE_PATTERNS = [
  /百分之百/,
  /注定/,
  /必然会/,
  /必然结婚/,
  /一定会/,
  /一定发生/,
];

const YEAR_TIMING_PATTERNS = [
  /年初/,
  /年中/,
  /年末/,
  /上半年/,
  /下半年/,
  /农历[一二三四五六七八九十冬腊\d]+月/,
  /最后一个月/,
  /项目最后(?:阶段|部分|\s*20%)/,
];

const QUIET_OVERREACH_PATTERNS = [
  /买房/,
  /换房/,
  /装修/,
  /结婚/,
  /生子/,
  /怀孕/,
  /升职/,
  /创业/,
  /搬家/,
  /疾病/,
  /炎症/,
  /投资/,
  /收入增加/,
  /协议签署/,
];

const HEALTH_SPECIFIC_PATTERNS = [
  /循环系统/,
  /内分泌/,
  /炎症/,
  /下焦/,
  /肠胃不适/,
  /具体疾病/,
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
  const violations = [];

  REQUIRED_SECTIONS.forEach((section) => {
    if (!normalized.includes(`### ${section}`)) {
      violations.push(`missing_section:${section}`);
    }
  });

  const grouped = extractDomainGroups(normalized);
  const domainCounts = new Map(
    STAGE_AI_DOMAIN_LABELS.map((label) => [
      label,
      [grouped.primary, grouped.secondary, grouped.quiet]
        .filter((section) => section.includes(label))
        .length,
    ]),
  );

  const missingDomains = STAGE_AI_DOMAIN_LABELS.filter(
    (label) => domainCounts.get(label) === 0,
  );
  const duplicateDomains = STAGE_AI_DOMAIN_LABELS.filter(
    (label) => domainCounts.get(label) > 1,
  );

  if (duplicateDomains.length) {
    violations.push(
      `duplicate_domains:${duplicateDomains.join(",")}`,
    );
  }

  const primaryDomains = STAGE_AI_DOMAIN_LABELS.filter(
    (label) => grouped.primary.includes(label),
  );
  const quietDomains = STAGE_AI_DOMAIN_LABELS.filter(
    (label) => grouped.quiet.includes(label),
  );

  const primaryMax = stage === "month" ? 2 : 4;
  if (primaryDomains.length < 1 || primaryDomains.length > primaryMax) {
    violations.push(
      `invalid_primary_count:${primaryDomains.length}`,
    );
  }

  if (quietDomains.length < 1) {
    violations.push("missing_quiet_domain");
  }

  QUIET_OVERREACH_PATTERNS.forEach((pattern) => {
    if (pattern.test(grouped.quiet)) {
      violations.push(`quiet_domain_overreach:${pattern.source}`);
    }
  });

  ABSOLUTE_PATTERNS.forEach((pattern) => {
    if (pattern.test(normalized)) {
      violations.push(`absolute_claim:${pattern.source}`);
    }
  });

  HEALTH_SPECIFIC_PATTERNS.forEach((pattern) => {
    if (
      pattern.test(normalized) &&
      !trustedMaterialIncludes(trustedPack, pattern)
    ) {
      violations.push(`unsupported_health_specific:${pattern.source}`);
    }
  });

  if (
    normalized.includes("财库") &&
    !trustedMaterialIncludes(trustedPack, /财库/)
  ) {
    violations.push("unsupported_treasury_claim");
  }

  if (
    normalized.includes("年柱驿马") &&
    !trustedMaterialIncludes(
      trustedPack,
      /年柱[^。；\n]{0,12}驿马|驿马[^。；\n]{0,12}年柱/,
    )
  ) {
    violations.push("unsupported_year_pillar_horse");
  }

  violations.push(
    ...detectReversedControls(normalized, trustedPack),
  );

  if (stage === "year") {
    YEAR_TIMING_PATTERNS.forEach((pattern) => {
      if (pattern.test(normalized)) {
        violations.push(`unsupported_year_timing:${pattern.source}`);
      }
    });
  }

  if (stage === "luck") {
    const ageRanges = normalized.match(
      /\d{1,2}\s*(?:[-—至~～到])\s*\d{1,2}\s*岁/g,
    ) || [];

    if (ageRanges.length > 1) {
      violations.push(
        `unsupported_luck_age_segments:${ageRanges.join(",")}`,
      );
    }
  }

  const warnings = [];
  if (missingDomains.length) {
    warnings.push(
      `missing_domains:${missingDomains.join(",")}`,
    );
  }
  warnings.push(...violations);

  return {
    valid:
      Boolean(normalized) &&
      missingDomains.length === 0 &&
      violations.length === 0,
    missingDomains,
    duplicateDomains,
    primaryDomains,
    quietDomains,
    violations: [...new Set(violations)],
    warnings: [...new Set(warnings)],
  };
}

export function buildStageAiRepairPrompt(
  prompt,
  validation,
) {
  const missing = validation?.missingDomains?.length
    ? validation.missingDomains.join("、")
    : "无";

  const duplicates = validation?.duplicateDomains?.length
    ? validation.duplicateDomains.join("、")
    : "无";

  const violations = validation?.violations?.length
    ? validation.violations.join("；")
    : "无";

  return {
    ...prompt,
    system: [
      prompt?.system || "",
      "",
      "上一版报告未通过校验，请完整重写，不要只局部补充。",
      `遗漏领域：${missing}`,
      `重复归类领域：${duplicates}`,
      `其他违规项：${violations}`,
      "十二领域必须分别归入重点主线、次要领域、当前不突出，而且每个领域只出现一次。",
      "当前不突出领域只能写证据不足原因，禁止补具体事件。",
      "必须服从事实包中的生克方向，禁止使用没有依据的财库、年柱驿马和具体健康诊断。",
    ].join("\n"),
    user: [
      prompt?.user || "",
      "",
      "请重新生成完整正式报告，并修复上述遗漏、重复归类、事实方向或过度推断问题。",
    ].join("\n"),
  };
}

function extractDomainGroups(text) {
  return {
    primary: extractSection(
      text,
      "重点主线",
      "次要领域",
    ),
    secondary: extractSection(
      text,
      "次要领域",
      "当前不突出",
    ),
    quiet: extractSection(
      text,
      "当前不突出",
      "事情发展逻辑",
    ),
  };
}

function extractSection(text, start, end) {
  const startMarker = `### ${start}`;
  const endMarker = `### ${end}`;
  const startIndex = text.indexOf(startMarker);

  if (startIndex < 0) return "";

  const contentStart = startIndex + startMarker.length;
  const endIndex = text.indexOf(endMarker, contentStart);

  return text.slice(
    contentStart,
    endIndex >= 0 ? endIndex : undefined,
  );
}

function trustedMaterialIncludes(trustedPack, pattern) {
  const material = collectTrustedMaterial(trustedPack);
  pattern.lastIndex = 0;
  return pattern.test(material);
}

function collectTrustedMaterial(trustedPack) {
  const factTexts = array(trustedPack?.evidenceFacts)
    .map((fact) => fact?.text);

  const candidateTexts = array(
    trustedPack?.domainEvidenceCandidates?.domains,
  ).flatMap((entry) => [
    ...array(entry?.directFacts),
    ...array(entry?.supportingFacts),
    ...array(entry?.counterFacts),
    ...array(entry?.hiddenStemSignals),
    ...array(entry?.auxiliarySignals),
    ...array(entry?.palaceTriggers),
  ]).map((entry) => entry?.text);

  const natalImages = array(
    trustedPack?.context?.natal?.imageCards,
  ).flatMap((entry) => [
    entry?.title,
    entry?.image,
    ...array(entry?.evidence),
  ]);

  return [
    ...factTexts,
    ...candidateTexts,
    ...natalImages,
    trustedPack?.context?.natal?.summary,
  ]
    .filter(Boolean)
    .join("\n");
}

function detectReversedControls(text, trustedPack) {
  return array(trustedPack?.evidenceFacts)
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
        `[^，。；\\n]{0,8}(?:克制|克|制约)` +
        `[^，。；\\n]{0,8}` +
        `${escapeRegExp(controller)}${controllerElement}?`,
      );

      return reversed.test(text)
        ? [`reversed_control:${controlled}->${controller}`]
        : [];
    });
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
