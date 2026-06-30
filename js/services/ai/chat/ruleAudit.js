const RULE_AUDIT_PATTERN =
  /<!--\s*RULE_AUDIT\s*([\s\S]*?)\s*RULE_AUDIT\s*-->/i;

const VALID_BASIS_LAYERS =
  new Set([
    "natal",
    "luck",
    "year",
    "month",
  ]);

const TEN_GODS = [
  "比肩", "劫财", "正印", "偏印", "食神", "伤官",
  "正财", "偏财", "正官", "七杀",
];

const RELATIONS = [
  "天干五合", "六合", "冲", "刑", "自刑", "害", "穿", "破",
  "半合", "拱合", "三合", "三会", "伏吟", "反吟",
];

const BROAD_FACT_ANCHORS = [
  "原局", "四柱", "日主", "月令", "年柱", "月柱", "日柱", "时柱",
  "藏干", "十神", "根气", "透干", "夫妻宫", "配偶星", "财星",
  "官杀", "印星", "食伤", "比劫", "大运", "当前大运", "流年",
  "目标流年", "流月", "目标流月", "交运", "机械关系", "岁运关系",
  "扫描年份", "年龄阶段",
];

export function parseRuleAudit(
  text,
) {
  const matched =
    String(
      text ??
      "",
    ).match(
      RULE_AUDIT_PATTERN,
    );

  if (!matched) {
    return {
      present:
        false,
      valid:
        false,
      value:
        null,
      error:
        "missing",
    };
  }

  try {
    const value =
      JSON.parse(
        matched[1]
          .trim(),
      );

    return {
      present:
        true,
      valid:
        Boolean(
          value &&
          typeof value ===
            "object",
        ),
      value,
      error:
        null,
    };
  } catch (
    error
  ) {
    return {
      present:
        true,
      valid:
        false,
      value:
        null,
      error:
        error.message,
    };
  }
}

export function stripRuleAudit(
  text,
) {
  return String(
    text ??
    "",
  )
    .replace(
      RULE_AUDIT_PATTERN,
      "",
    )
    .trim();
}

export function validateRuleAudit({
  text,
  payload,
  isBaziQuestion,
} = {}) {
  const constraint =
    payload
      ?.imageryRulePack
      ?.ruleConstraint;

  if (
    !isBaziQuestion ||
    constraint?.auditRequired !==
      true
  ) {
    return {
      violations: [],
      audit:
        null,
    };
  }

  const parsed =
    parseRuleAudit(
      text,
    );

  const violations = [];

  if (!parsed.present) {
    violations.push(
      "missing_rule_audit",
    );

    return {
      violations,
      audit:
        null,
    };
  }

  if (!parsed.valid) {
    violations.push(
      "invalid_rule_audit",
    );

    return {
      violations,
      audit:
        null,
    };
  }

  const allowedRuleIds =
    new Set(
      array(
        constraint
          ?.allowedRuleIds,
      ),
    );

  const conditionalRuleIds =
    new Set(
      array(
        constraint
          ?.conditionalRuleIds,
      ),
    );

  const claims =
    array(
      parsed
        .value
        ?.claims,
    );

  if (
    allowedRuleIds.size >
      0 &&
    claims.length ===
      0
  ) {
    violations.push(
      "empty_rule_audit_claims",
    );
  }

  const allowedFactTokens =
    collectAllowedFactTokens(
      payload,
    );

  claims.forEach(
    (
      claim,
      index,
    ) => {
      const prefix =
        `rule_audit_claim_${index + 1}`;

      if (
        !claim ||
        typeof claim !==
          "object" ||
        String(
          claim.claim ??
          "",
        ).trim().length <
          4
      ) {
        violations.push(
          `${prefix}:missing_claim`,
        );
      }

      const ruleIds =
        array(
          claim.ruleIds,
        );

      if (!ruleIds.length) {
        violations.push(
          `${prefix}:missing_rule_ids`,
        );
      }

      ruleIds.forEach(
        (ruleId) => {
          if (
            !allowedRuleIds.has(
              ruleId,
            )
          ) {
            violations.push(
              `${prefix}:unknown_rule_id:${ruleId}`,
            );
          }
        },
      );

      const factAnchors =
        array(
          claim.factAnchors,
        );

      if (!factAnchors.length) {
        violations.push(
          `${prefix}:missing_fact_anchors`,
        );
      } else if (
        !factAnchors.some(
          (anchor) =>
            factAnchorIsAllowed(
              anchor,
              allowedFactTokens,
            ),
        )
      ) {
        violations.push(
          `${prefix}:unsupported_fact_anchor`,
        );
      }

      const basisLayers =
        array(
          claim.basisLayers,
        );

      if (!basisLayers.length) {
        violations.push(
          `${prefix}:missing_basis_layers`,
        );
      }

      basisLayers.forEach(
        (layer) => {
          if (
            !VALID_BASIS_LAYERS.has(
              layer,
            )
          ) {
            violations.push(
              `${prefix}:invalid_basis_layer:${layer}`,
            );
          }
        },
      );

      const usesConditionalRule =
        ruleIds.some(
          (ruleId) =>
            conditionalRuleIds.has(
              ruleId,
            ),
        );

      if (
        usesConditionalRule &&
        !array(
          claim.conditionsChecked,
        ).length
      ) {
        violations.push(
          `${prefix}:conditional_rule_without_condition_check`,
        );
      }
    },
  );

  validateTimeLayerCoverage({
    claims,
    payload,
  }).forEach(
    (item) =>
      violations.push(item),
  );

  return {
    violations:
      [...new Set(violations)],
    audit:
      parsed.value,
  };
}

function validateTimeLayerCoverage({
  claims,
  payload,
} = {}) {
  const timeScope =
    String(
      payload
        ?.contextPlan
        ?.timeScope ??
      "",
    );

  const requiredLayer =
    timeScope ===
      "month"
      ? "month"
      : timeScope ===
          "singleYear" ||
        timeScope ===
          "multiYear"
        ? "year"
        : timeScope ===
            "currentStage"
          ? "luck"
          : "natal";

  if (
    !claims.length
  ) {
    return [];
  }

  const hasRequiredLayer =
    claims.some(
      (claim) =>
        array(
          claim?.basisLayers,
        ).includes(
          requiredLayer,
        ),
    );

  return hasRequiredLayer
    ? []
    : [
        `rule_audit_missing_time_layer:${requiredLayer}`,
      ];
}

function collectAllowedFactTokens(
  payload,
) {
  const tokens =
    new Set(
      BROAD_FACT_ANCHORS,
    );

  const value =
    JSON.stringify({
      natalHardFacts:
        payload
          ?.natalHardFacts,
      natalAuxiliaryFacts:
        payload
          ?.natalAuxiliaryFacts,
      luckHardFacts:
        payload
          ?.luckHardFacts,
      yearHardFacts:
        payload
          ?.yearHardFacts,
      requestedYearFacts:
        payload
          ?.requestedYearFacts,
      monthHardFacts:
        payload
          ?.monthHardFacts,
      monthHardFactsList:
        payload
          ?.monthHardFactsList,
      luckTimelineForTargetYear:
        payload
          ?.luckTimelineForTargetYear,
    });

  for (
    const matched of
      value.matchAll(
        /[甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥]/g,
      )
  ) {
    tokens.add(
      matched[0],
    );
  }

  TEN_GODS.forEach(
    (item) => {
      if (
        value.includes(
          item,
        )
      ) {
        tokens.add(item);
      }
    },
  );

  RELATIONS.forEach(
    (item) => {
      if (
        value.includes(
          item,
        )
      ) {
        tokens.add(item);
      }
    },
  );

  for (
    const matched of
      value.matchAll(
        /(?:19|20)\d{2}年?/g,
      )
  ) {
    tokens.add(
      matched[0],
    );
  }

  return [
    ...tokens,
  ];
}

function factAnchorIsAllowed(
  anchor,
  allowedTokens,
) {
  const text =
    String(
      anchor ??
      "",
    ).trim();

  if (!text) {
    return false;
  }

  return allowedTokens.some(
    (token) =>
      text.includes(token) ||
      String(token).includes(text),
  );
}

function array(
  value,
) {
  return Array.isArray(value)
    ? value
        .map(
          (item) =>
            typeof item ===
              "string"
              ? item.trim()
              : item,
        )
        .filter(Boolean)
    : [];
}
