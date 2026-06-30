import {
  NATAL_COMPOSITION_MIGRATION_CATALOG_VERSION,
  getNatalCompositionComparableItems,
  natalCompositionFamilyKeys,
  natalCompositionMigrationSummary,
} from "./natalCompositionMigrationCatalog.js";

export const NATAL_COMPOSITION_COMPARISON_VERSION =
  "natal-composition-shadow-compare-v3";

const standardFamilyKeys =
  natalCompositionFamilyKeys;

const comparableCatalogItems =
  getNatalCompositionComparableItems();

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
  const missingLegacyCount =
    missingLegacy.length;
  const contractOnlyCount =
    contractOnly.length;
  const legacyCoverageRate = clampRate(
    comparableLegacyCount > 0
      ? matchedCount / comparableLegacyCount
      : 0,
  );
  const roleComparableCount =
    matched.filter((item) =>
      item.roleAgreement === true ||
      item.roleAgreement === false,
    ).length;
  const roleAgreementCount =
    matched.filter((item) =>
      item.roleAgreement === true,
    ).length;
  const roleDisagreementCount =
    matched.filter((item) =>
      item.roleAgreement === false,
    ).length;

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
    missingLegacyCount,
    contractOnlyCount,

    coverageRate: legacyCoverageRate,
    legacyCoverageRate,
    contractAgreementRate: clampRate(
      matchedCount + contractOnlyCount > 0
        ? matchedCount /
          (matchedCount + contractOnlyCount)
        : 0,
    ),
    bidirectionalAgreementRate: clampRate(
      matchedCount +
        missingLegacyCount +
        contractOnlyCount >
        0
        ? matchedCount /
          (
            matchedCount +
            missingLegacyCount +
            contractOnlyCount
          )
        : 0,
    ),
    roleComparableCount,
    roleAgreementCount,
    roleDisagreementCount,
    roleAgreementRate: clampRate(
      roleComparableCount > 0
        ? roleAgreementCount /
          roleComparableCount
        : 0,
    ),

    catalogVersion:
      NATAL_COMPOSITION_MIGRATION_CATALOG_VERSION,
    totalCatalogItems:
      natalCompositionMigrationSummary.totalCatalogItems,
    compositionNatalItems:
      natalCompositionMigrationSummary
        .compositionNatalItems,
    coveredCatalogItems:
      natalCompositionMigrationSummary
        .coveredCatalogItems,
    mergedCatalogItems:
      natalCompositionMigrationSummary
        .mergedCatalogItems,
    excludedCatalogItems:
      natalCompositionMigrationSummary
        .excludedCatalogItems,
    blockedCatalogItems:
      natalCompositionMigrationSummary
        .blockedCatalogItems,
    unclassifiedCatalogItems:
      natalCompositionMigrationSummary
        .unclassifiedCatalogItems,

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
  for (const catalogItem of comparableCatalogItems) {
    if (matchesCatalogItem(item, catalogItem)) {
      return normalizeText(
        catalogItem.targetFamilyKey,
      );
    }
  }

  return "";
}

function matchesCatalogItem(item, catalogItem) {
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
  const aliases = Array.isArray(
    catalogItem.aliases,
  )
    ? catalogItem.aliases
    : [];

  return (
    sourceRuleId ===
      normalizeText(catalogItem.legacyRuleId) ||
    semanticGroup ===
      normalizeText(
        catalogItem.legacySemanticGroup,
      ) ||
    id === normalizeText(catalogItem.legacyRuleId) ||
    title === normalizeText(catalogItem.legacyTitle) ||
    matchesAliasList(aliases, {
      sourceRuleId,
      semanticGroup,
      id,
      title,
      tags,
    })
  );
}

function matchesAliasList(aliases, values) {
  for (const alias of aliases) {
    if (matchesAlias(alias, values)) {
      return true;
    }
  }

  return false;
}

function matchesAlias(alias, values) {
  const text = normalizeText(alias);

  if (!text) {
    return false;
  }

  if (text.startsWith("idPattern:")) {
    return matchesPatternText(
      text.slice("idPattern:".length),
      values.id,
    );
  }

  if (text.startsWith("namePattern:")) {
    return matchesPatternText(
      text.slice("namePattern:".length),
      values.title,
    );
  }

  if (text.startsWith("tags:")) {
    const requiredTags = text
      .slice("tags:".length)
      .split("|")
      .map(normalizeText)
      .filter(Boolean);

    return requiredTags.every((tag) =>
      values.tags.includes(tag),
    );
  }

  return [
    values.sourceRuleId,
    values.semanticGroup,
    values.id,
    values.title,
    ...values.tags,
  ].includes(text);
}

function matchesPatternText(pattern, value) {
  if (!pattern || !value) {
    return false;
  }

  try {
    return new RegExp(pattern).test(value);
  } catch {
    return false;
  }
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
  const normalizedLegacyRoles =
    uniqueSortedStrings(
      legacyRoles.map(normalizeComparableRole),
    );
  const normalizedContractRoles =
    uniqueSortedStrings(
      contractRoles.map(normalizeComparableRole),
    );

  if (
    normalizedLegacyRoles.length === 0 ||
    normalizedContractRoles.length === 0
  ) {
    return null;
  }

  return intersectSorted(
    normalizedLegacyRoles,
    normalizedContractRoles,
  ).length > 0;
}

function normalizeComparableRole(role) {
  const normalized = normalizeText(role);

  if (normalized === "main") {
    return "core";
  }

  if (normalized === "condition") {
    return "conditional";
  }

  return normalized;
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

function clampRate(value) {
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
