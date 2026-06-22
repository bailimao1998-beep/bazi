export const NATAL_COMPOSITION_COMPARISON_VERSION =
  "natal-composition-shadow-compare-v1";

const standardFamilyKeys = [
  "official_resource_support",
  "wealth_official_resource_trace",
  "day_pillar_repetition",
  "spouse_palace_relation_tension",
  "peer_wealth_competition",
  "resource_heavy_output_weak",
  "element_bias_visible",
  "month_command_official",
];

const legacyFamilyAliases = {
  official_resource_support: {
    sourceRuleIds: [
      "officer_resource_chain",
    ],
    semanticGroups: [
      "officer-resource-chain",
    ],
    ids: [
      "officer_resource_chain",
    ],
    names: [
      "官印承接",
      "杀印承接",
      "官印相生",
    ],
    requiredTags: [
      ["官印", "承接"],
      ["杀印", "承接"],
    ],
  },

  wealth_official_resource_trace: {
    sourceRuleIds: [
      "wealth_officer_resource_chain",
      "wealth_officer_resource_trace",
    ],
    semanticGroups: [
      "wealth-officer-resource-chain",
    ],
    ids: [
      "wealth_officer_resource_chain",
      "wealth_officer_resource_trace",
    ],
    names: [
      "财官印承接线索",
      "年月财官印有承接线索",
    ],
    requiredTags: [
      ["财官印"],
    ],
  },

  day_pillar_repetition: {
    sourceRuleIds: [
      "day_pillar_fuyin",
    ],
    semanticGroups: [
      "day-pillar-fuyin",
    ],
    ids: [
      "day_pillar_fuyin",
    ],
    idPatterns: [
      /^repetition-pillar-(year|month|hour)-day-.+$/,
      /^repetition-pillar-day-(year|month|hour)-.+$/,
    ],
    names: [
      "日柱参与伏吟",
    ],
    namePatterns: [
      /日柱.+伏吟/,
      /.+日柱.+伏吟/,
    ],
    requiredTags: [
      ["日柱", "伏吟"],
    ],
  },

  spouse_palace_relation_tension: {
    sourceRuleIds: [
      "day_branch_clashed",
      "day_branch_punished_harmed_broken",
    ],
    semanticGroups: [
      "day-branch-clashed",
      "day-branch-tension",
    ],
    ids: [
      "day_branch_clashed",
      "day_branch_punished_harmed_broken",
    ],
    idPatterns: [
      /^relation-.+day-branch.+branch_(clash|punish|self_punish|harm|break).+$/,
      /^relation-.+branch_(clash|punish|self_punish|harm|break).+day-branch.+$/,
    ],
    names: [
      "日支受冲",
      "日支刑害破牵动",
    ],
    namePatterns: [
      /日支.+(冲|刑|害|破|自刑)/,
    ],
    requiredTags: [
      ["日支", "冲"],
      ["日支", "刑害破"],
    ],
  },

  peer_wealth_competition: {
    sourceRuleIds: [
      "peer_wealth_tension",
    ],
    semanticGroups: [
      "peer-wealth-tension",
    ],
    ids: [
      "peer_wealth_tension",
    ],
    names: [
      "比劫牵财",
    ],
    requiredTags: [
      ["比劫", "财星"],
    ],
  },

  resource_heavy_output_weak: {
    sourceRuleIds: [
      "resource_heavy_output_weak",
    ],
    semanticGroups: [
      "resource-heavy-output-weak",
    ],
    ids: [
      "resource_heavy_output_weak",
    ],
    names: [
      "印重食伤弱",
    ],
    requiredTags: [
      ["印重", "食伤弱"],
    ],
  },

  element_bias_visible: {
    sourceRuleIds: [
      "element_bias_clear",
    ],
    semanticGroups: [
      "element-bias-clear",
    ],
    ids: [
      "element_bias_clear",
    ],
    names: [
      "五行偏性明显",
      "五行偏颇明显",
    ],
    requiredTags: [
      ["五行偏颇"],
      ["偏性"],
    ],
  },

  month_command_official: {
    sourceRuleIds: [
      "branch-main-month-正官",
      "branch-main-month-七杀",
    ],
    semanticGroups: [
      "branch-main-month-正官",
      "branch-main-month-七杀",
    ],
    ids: [
      "branch-main-month-正官",
      "branch-main-month-七杀",
    ],
    idPatterns: [
      /^branch-main-month-(正官|七杀)$/,
    ],
    names: [
      "月令正官",
      "月令七杀",
    ],
    namePatterns: [
      /^月令(正官|七杀)$/,
    ],
    requiredTags: [
      ["月令", "正官"],
      ["月令", "七杀"],
    ],
  },
};

const atomicCategories = new Set([
  "日主根气",
  "十神透藏",
  "干支关系",
  "柱位重复",
  "五行调候",
]);

export function compareNatalCompositionShadow({
  legacyItems = [],
  contractImages = [],
} = {}) {
  const warnings = [];
  const safeLegacyItems = normalizeObjectArray(
    legacyItems,
    "legacyItems",
    warnings,
  );
  const safeContractImages = normalizeObjectArray(
    contractImages,
    "contractImages",
    warnings,
  );

  const legacyByFamily = buildLegacyProjection(
    safeLegacyItems,
  );
  const contractByFamily =
    buildContractProjection(
      safeContractImages,
    );

  const matched = [];
  const missingLegacy = [];
  const contractOnly = [];

  for (const familyKey of standardFamilyKeys) {
    const legacyGroup =
      legacyByFamily.comparable.get(familyKey);
    const contractGroup =
      contractByFamily.get(familyKey);

    if (legacyGroup && contractGroup) {
      matched.push(createMatchedItem(
        familyKey,
        legacyGroup,
        contractGroup,
      ));
      continue;
    }

    if (legacyGroup && !contractGroup) {
      missingLegacy.push({
        familyKey,
        legacyItemIds:
          uniqueSortedStrings(
            legacyGroup.items.map(getLegacyId),
          ),
        legacyTitles:
          uniqueSortedStrings(
            legacyGroup.items.map(getLegacyTitle),
          ),
        reason: "no_contract_composition",
      });
      continue;
    }

    if (!legacyGroup && contractGroup) {
      contractOnly.push({
        familyKey,
        contractImageIds:
          uniqueSortedStrings(
            contractGroup.images.map(
              getContractImageId,
            ),
          ),
        contractRuleIds:
          uniqueSortedStrings(
            contractGroup.images.map(
              getContractRuleId,
            ),
          ),
        contractTitles:
          uniqueSortedStrings(
            contractGroup.images.map(
              getContractTitle,
            ),
          ),
        reason: "new_contract_composition",
      });
    }
  }

  matched.sort(compareFamilyItems);
  missingLegacy.sort(compareFamilyItems);
  contractOnly.sort(compareFamilyItems);
  legacyByFamily.intentionallyUncompared.sort(
    compareUncomparedItems,
  );

  const comparableLegacyCount =
    [...legacyByFamily.comparable.values()]
      .filter((group) => group.items.length > 0)
      .length;
  const matchedCount = matched.length;

  return {
    version:
      NATAL_COMPOSITION_COMPARISON_VERSION,
    mode: "read_only",

    legacyCount: Array.isArray(legacyItems)
      ? legacyItems.length
      : 0,
    contractCount: Array.isArray(contractImages)
      ? contractImages.length
      : 0,
    comparableLegacyCount,
    matchedCount,
    missingLegacyCount:
      missingLegacy.length,
    contractOnlyCount:
      contractOnly.length,

    coverageRate: clampCoverageRate(
      comparableLegacyCount > 0
        ? matchedCount / comparableLegacyCount
        : 0,
    ),

    matched,
    missingLegacy,
    contractOnly,
    intentionallyUncompared:
      legacyByFamily.intentionallyUncompared,

    summaryByFamily: buildSummaryByFamily({
      matched,
      missingLegacy,
      contractOnly,
      legacyByFamily,
    }),

    warnings: uniqueSortedStrings(warnings),
  };
}

function buildLegacyProjection(items) {
  const comparable = new Map();
  const intentionallyUncompared = [];

  for (const item of items) {
    const familyKey =
      normalizeLegacyFamilyKey(item);

    if (familyKey) {
      const group =
        comparable.get(familyKey) ?? {
          items: [],
        };
      group.items.push(item);
      comparable.set(familyKey, group);
      continue;
    }

    intentionallyUncompared.push({
      legacyItemId: getLegacyId(item),
      legacyTitle: getLegacyTitle(item),
      category: normalizeText(item.category),
      reason:
        classifyIntentionallyUncompared(item),
    });
  }

  return {
    comparable,
    intentionallyUncompared,
  };
}

function buildContractProjection(images) {
  const projection = new Map();

  for (const image of images) {
    const familyKey = normalizeText(
      image.ruleId,
    );

    if (
      !standardFamilyKeys.includes(familyKey)
    ) {
      continue;
    }

    const group =
      projection.get(familyKey) ?? {
        images: [],
      };
    group.images.push(image);
    projection.set(familyKey, group);
  }

  return projection;
}

function normalizeLegacyFamilyKey(item) {
  for (const familyKey of standardFamilyKeys) {
    const alias =
      legacyFamilyAliases[familyKey];

    if (matchesAlias(item, alias)) {
      return familyKey;
    }
  }

  return "";
}

function matchesAlias(item, alias = {}) {
  const sourceRuleId = normalizeText(
    item.sourceRuleId,
  );
  const semanticGroup = normalizeText(
    item.semanticGroup,
  );
  const id = normalizeText(item.id);
  const title = getLegacyTitle(item);
  const tags = uniqueSortedStrings(
    Array.isArray(item.tags) ? item.tags : [],
  );

  return (
    includesText(alias.sourceRuleIds, sourceRuleId) ||
    includesText(alias.semanticGroups, semanticGroup) ||
    includesText(alias.ids, id) ||
    matchesPattern(alias.idPatterns, id) ||
    includesText(alias.names, title) ||
    matchesPattern(alias.namePatterns, title) ||
    matchesRequiredTags(alias.requiredTags, tags)
  );
}

function includesText(items, value) {
  return (
    Boolean(value) &&
    Array.isArray(items) &&
    items.map(normalizeText).includes(value)
  );
}

function matchesRequiredTags(
  tagGroups,
  tags,
) {
  if (!Array.isArray(tagGroups)) {
    return false;
  }

  return tagGroups.some((group) =>
    Array.isArray(group) &&
    group.every((tag) =>
      tags.includes(normalizeText(tag)),
    ),
  );
}

function matchesPattern(patterns, value) {
  return (
    Boolean(value) &&
    Array.isArray(patterns) &&
    patterns.some((pattern) =>
      pattern instanceof RegExp &&
      pattern.test(value),
    )
  );
}

function createMatchedItem(
  familyKey,
  legacyGroup,
  contractGroup,
) {
  const legacyRoles = uniqueSortedStrings(
    legacyGroup.items.map((item) => item.role),
  );
  const contractRoles = uniqueSortedStrings(
    contractGroup.images.map((image) => image.role),
  );
  const legacyDomains = uniqueSortedStrings(
    legacyGroup.items.flatMap((item) =>
      Array.isArray(item.domains)
        ? item.domains
        : [],
    ),
  );
  const contractDomains = uniqueSortedStrings(
    contractGroup.images.flatMap((image) =>
      Array.isArray(image.domains)
        ? image.domains
        : [],
    ),
  );

  return {
    familyKey,

    legacyItemIds: uniqueSortedStrings(
      legacyGroup.items.map(getLegacyId),
    ),
    legacyTitles: uniqueSortedStrings(
      legacyGroup.items.map(getLegacyTitle),
    ),

    contractImageIds: uniqueSortedStrings(
      contractGroup.images.map(getContractImageId),
    ),
    contractRuleIds: uniqueSortedStrings(
      contractGroup.images.map(getContractRuleId),
    ),
    contractTitles: uniqueSortedStrings(
      contractGroup.images.map(getContractTitle),
    ),

    roleAgreement: compareRoles(
      legacyRoles,
      contractRoles,
    ),
    domainOverlap: intersectSorted(
      legacyDomains,
      contractDomains,
    ),

    legacyRoles,
    contractRoles,

    legacyDomains,
    contractDomains,
  };
}

function compareRoles(legacyRoles, contractRoles) {
  if (
    legacyRoles.length === 0 ||
    contractRoles.length === 0
  ) {
    return null;
  }

  return intersectSorted(
    legacyRoles,
    contractRoles,
  ).length > 0;
}

function classifyIntentionallyUncompared(
  item,
) {
  const category = normalizeText(item.category);

  if (category === "神煞辅助") {
    return "auxiliary_fact_not_composition";
  }

  if (category === "五行调候") {
    return /^element-flow-/.test(
      normalizeText(item.id),
    )
      ? "unsupported_legacy_composition"
      : "atomic_fact_not_composition";
  }

  if (
    category &&
    atomicCategories.has(category) &&
    category !== "组合结构"
  ) {
    return "atomic_fact_not_composition";
  }

  return "unsupported_legacy_composition";
}

function buildSummaryByFamily({
  matched,
  missingLegacy,
  contractOnly,
  legacyByFamily,
}) {
  const summary = {};

  for (const familyKey of standardFamilyKeys) {
    summary[familyKey] = {
      legacyComparable:
        legacyByFamily.comparable.has(familyKey)
          ? 1
          : 0,
      matched: matched.some((item) =>
        item.familyKey === familyKey,
      )
        ? 1
        : 0,
      missing: missingLegacy.some((item) =>
        item.familyKey === familyKey,
      )
        ? 1
        : 0,
      contractOnly: contractOnly.some((item) =>
        item.familyKey === familyKey,
      )
        ? 1
        : 0,
    };
  }

  return summary;
}

function normalizeObjectArray(
  items,
  label,
  warnings,
) {
  if (!Array.isArray(items)) {
    warnings.push(`${label} should be an array`);
    return [];
  }

  const normalized = [];

  for (const item of items) {
    if (
      !item ||
      typeof item !== "object" ||
      Array.isArray(item)
    ) {
      warnings.push(
        `${label} contains null or non-object item`,
      );
      continue;
    }

    normalized.push(item);
  }

  return normalized;
}

function intersectSorted(left, right) {
  const rightSet = new Set(right);

  return left
    .filter((item) => rightSet.has(item))
    .sort();
}

function compareFamilyItems(left, right) {
  return left.familyKey.localeCompare(
    right.familyKey,
  );
}

function compareUncomparedItems(left, right) {
  return (
    left.reason.localeCompare(right.reason) ||
    left.category.localeCompare(right.category) ||
    left.legacyTitle.localeCompare(
      right.legacyTitle,
    ) ||
    left.legacyItemId.localeCompare(
      right.legacyItemId,
    )
  );
}

function clampCoverageRate(value) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(
    1,
    Math.max(0, value),
  );
}

function getLegacyId(item) {
  return normalizeText(item?.id);
}

function getLegacyTitle(item) {
  return (
    normalizeText(item?.name) ||
    normalizeText(item?.title)
  );
}

function getContractImageId(image) {
  return normalizeText(image?.id);
}

function getContractRuleId(image) {
  return normalizeText(image?.ruleId);
}

function getContractTitle(image) {
  return normalizeText(image?.title);
}

function uniqueSortedStrings(items) {
  return [
    ...new Set(
      (Array.isArray(items) ? items : [])
        .map(normalizeText)
        .filter(Boolean),
    ),
  ].sort();
}

function normalizeText(value) {
  return typeof value === "string"
    ? value.trim()
    : "";
}
