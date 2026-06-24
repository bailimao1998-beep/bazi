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

const ABSOLUTE_PATTERNS = [
  /百分之百/,
  /注定/,
  /必然结婚/,
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

export function validateStageAiText({
  text,
  stage = "luck",
} = {}) {
  const normalized = String(text || "").trim();
  const missingDomains = STAGE_AI_DOMAIN_LABELS.filter(
    (label) => !normalized.includes(label),
  );
  const violations = [];

  if (!normalized.includes("十二领域逐项分析")) {
    violations.push("missing_domain_section");
  }

  ABSOLUTE_PATTERNS.forEach((pattern) => {
    if (pattern.test(normalized)) {
      violations.push(`absolute_claim:${pattern.source}`);
    }
  });

  if (stage === "year") {
    YEAR_TIMING_PATTERNS.forEach((pattern) => {
      if (pattern.test(normalized)) {
        violations.push(`unsupported_year_timing:${pattern.source}`);
      }
    });
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
    violations,
    warnings,
  };
}

export function buildStageAiRepairPrompt(
  prompt,
  validation,
) {
  const missing = validation?.missingDomains?.length
    ? validation.missingDomains.join("、")
    : "无";

  const violations = validation?.violations?.length
    ? validation.violations.join("；")
    : "无";

  return {
    ...prompt,
    system: [
      prompt?.system || "",
      "",
      "上一版回答未通过完整性校验，请完整重写，不要只补一句。",
      `遗漏领域：${missing}`,
      `违规项：${violations}`,
      "必须保留原任务边界，逐项写出十二个固定领域名称。",
      "流年没有流月证据时，不得加入年初、年中、年末、上半年、下半年或具体月份。",
    ].join("\n"),
    user: [
      prompt?.user || "",
      "",
      "请重新生成完整报告。必须逐项覆盖十二领域，并修复上述遗漏或越界内容。",
    ].join("\n"),
  };
}
