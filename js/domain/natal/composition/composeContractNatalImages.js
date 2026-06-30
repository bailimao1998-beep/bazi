import {
  selectAtomicFacts,
} from "../facts/selectAtomicFacts.js";

import {
  natalCompositionRules,
} from "./natalCompositionRuleDatabase.js";

export const NATAL_COMPOSITION_SHADOW_VERSION =
  "natal-composition-shadow-v1";

const roleKeys = [
  "core",
  "support",
  "tension",
  "conditional",
];

const confidenceRank = {
  unknown: 0,
  low: 1,
  medium: 2,
  high: 3,
};

const pillarOrder = [
  "year",
  "month",
  "day",
  "hour",
];

const tenGodGroups = {
  officer: ["正官", "七杀"],
  resource: ["正印", "偏印"],
  wealth: ["正财", "偏财"],
  peer: ["比肩", "劫财"],
  output: ["食神", "伤官"],
};

export function composeContractNatalImages({
  facts = [],
  rules = natalCompositionRules,
} = {}) {
  const warnings = [];

  const factSelection = selectAtomicFacts({
    facts,
  });

  warnings.push(
    ...factSelection.warnings.map(
      (warning) => `facts: ${warning}`,
    ),
  );

  const safeRules = Array.isArray(rules)
    ? rules
    : [];

  if (!Array.isArray(rules)) {
    warnings.push("rules should be an array");
  }

  const context = buildCompositionContext(
    factSelection.selectedFacts,
  );

  const images = [];
  const hitRuleIds = [];
  const skippedRuleIds = [];

  for (const rule of safeRules) {
    const ruleId = normalizeText(rule?.id);

    if (!ruleId) {
      warnings.push("rule without id skipped");
      continue;
    }

    try {
      const image = evaluateRule(
        rule,
        context,
      );

      if (image) {
        images.push(image);
        hitRuleIds.push(ruleId);
      } else {
        skippedRuleIds.push(ruleId);
      }
    } catch (error) {
      warnings.push(
        `rule ${ruleId} failed: ${
          error?.message ??
          "unknown error"
        }`,
      );
      skippedRuleIds.push(ruleId);
    }
  }

  const sortedImages = images
    .slice()
    .sort(compareImages);

  return {
    version: NATAL_COMPOSITION_SHADOW_VERSION,
    mode: "shadow",
    images: sortedImages,
    byRole: buildByRole(sortedImages),
    hitRuleIds: uniqueSortedStrings(
      hitRuleIds,
    ),
    skippedRuleIds: uniqueSortedStrings(
      skippedRuleIds,
    ),
    summary: {
      totalRules: safeRules.length,
      hitRules:
        uniqueSortedStrings(hitRuleIds).length,
      imageCount: sortedImages.length,
    },
    warnings: uniqueSortedStrings(warnings),
  };
}

function evaluateRule(rule, context) {
  switch (rule.id) {
    case "official_resource_support":
      return evaluateOfficialResourceSupport(
        rule,
        context,
      );

    case "wealth_official_resource_trace":
      return evaluateWealthOfficialResourceTrace(
        rule,
        context,
      );

    case "day_pillar_repetition":
      return evaluateDayPillarRepetition(
        rule,
        context,
      );

    case "spouse_palace_relation_tension":
      return evaluateSpousePalaceRelationTension(
        rule,
        context,
      );

    case "peer_wealth_competition":
      return evaluatePeerWealthCompetition(
        rule,
        context,
      );

    case "resource_heavy_output_weak":
      return evaluateResourceHeavyOutputWeak(
        rule,
        context,
      );

    case "element_bias_visible":
      return evaluateElementBiasVisible(
        rule,
        context,
      );

    case "month_command_official":
      return evaluateMonthCommandOfficial(
        rule,
        context,
      );

    case "output_wealth_chain":
      return evaluateOutputWealthChain(
        rule,
        context,
      );

    case "hurting_officer_resource_balance":
      return evaluateHurtingOfficerResourceBalance(
        rule,
        context,
      );

    case "hurting_officer_meets_officer":
      return evaluateHurtingOfficerMeetsOfficer(
        rule,
        context,
      );

    case "wealth_heavy_body_weak":
      return evaluateWealthHeavyBodyWeak(
        rule,
        context,
      );

    case "officer_killing_mixed":
      return evaluateOfficerKillingMixed(
        rule,
        context,
      );

    case "day_branch_combined":
      return evaluateDayBranchCombined(
        rule,
        context,
      );

    case "metal_water_fire_weak":
      return evaluateMetalWaterFireWeak(
        rule,
        context,
      );

    default:
      return null;
  }
}

function evaluateOfficialResourceSupport(
  rule,
  context,
) {
  const officer =
    context.tenGodGroups.officer;
  const resource =
    context.tenGodGroups.resource;
  const thresholds =
    rule.thresholds ?? {};

  if (
    officer.total <
      numberThreshold(
        thresholds.officerMinWeightedCount,
      ) ||
    resource.total <
      numberThreshold(
        thresholds.resourceMinWeightedCount,
      )
  ) {
    return null;
  }

  const anchorFacts =
    findOfficialResourceAnchorFacts(context);

  if (
    thresholds.requireStructuralAnchor &&
    anchorFacts.length === 0
  ) {
    return null;
  }

  const monthFacts = [
    ...context.monthTenGodFacts.officer,
    ...context.monthTenGodFacts.resource,
  ];

  const hasMonthParticipation =
    monthFacts.length > 0;

  return createImage(rule, {
    priority:
      rule.priority +
      (hasMonthParticipation
        ? numberThreshold(
            thresholds.monthParticipationPriorityBonus,
          )
        : 0),
    confidence: hasMonthParticipation
      ? maxConfidence(
          rule.baseConfidence,
          thresholds.monthParticipationConfidence,
        )
      : rule.baseConfidence,
    matchedFactIds: [
      ...officer.positiveFacts,
      ...resource.positiveFacts,
      ...monthFacts,
      ...anchorFacts,
    ].map(getFactId),
  });
}

function evaluateWealthOfficialResourceTrace(
  rule,
  context,
) {
  const wealth = context.tenGodGroups.wealth;
  const officer =
    context.tenGodGroups.officer;
  const resource =
    context.tenGodGroups.resource;
  const thresholds =
    rule.thresholds ?? {};

  if (
    wealth.total <
      numberThreshold(
        thresholds.wealthMinWeightedCount,
      ) ||
    officer.total <
      numberThreshold(
        thresholds.officerMinWeightedCount,
      ) ||
    resource.total <
      numberThreshold(
        thresholds.resourceMinWeightedCount,
      )
  ) {
    return null;
  }

  return createImage(rule, {
    matchedFactIds: [
      ...wealth.positiveFacts,
      ...officer.positiveFacts,
      ...resource.positiveFacts,
    ].map(getFactId),
  });
}

function evaluateDayPillarRepetition(
  rule,
  context,
) {
  const day = context.pillars.day;

  if (!day?.stem?.value || !day?.branch?.value) {
    return null;
  }

  const matchedFacts = [
    day.stem.fact,
    day.branch.fact,
  ];

  for (const pillar of pillarOrder) {
    if (pillar === "day") {
      continue;
    }

    const current = context.pillars[pillar];

    if (
      current?.stem?.value === day.stem.value &&
      current?.branch?.value === day.branch.value
    ) {
      matchedFacts.push(
        current.stem.fact,
        current.branch.fact,
      );
    }
  }

  if (matchedFacts.length <= 2) {
    return null;
  }

  return createImage(rule, {
    matchedFactIds:
      matchedFacts.map(getFactId),
  });
}

function evaluateSpousePalaceRelationTension(
  rule,
  context,
) {
  const allowedTypes = new Set(
    normalizeArray(
      rule.thresholds?.tensionRelationTypes,
    ),
  );

  const matchedFacts =
    context.relationFacts.filter((fact) => {
      const relationType = normalizeText(
        fact.value?.relationType,
      );

      if (!allowedTypes.has(relationType)) {
        return false;
      }

      return relationHasDayBranch(fact);
    });

  if (matchedFacts.length === 0) {
    return null;
  }

  return createImage(rule, {
    matchedFactIds:
      matchedFacts.map(getFactId),
  });
}

function evaluatePeerWealthCompetition(
  rule,
  context,
) {
  const peer = context.tenGodGroups.peer;
  const wealth = context.tenGodGroups.wealth;
  const thresholds =
    rule.thresholds ?? {};

  if (
    peer.total <
      numberThreshold(
        thresholds.peerMinWeightedCount,
      ) ||
    wealth.total <
      numberThreshold(
        thresholds.wealthMinWeightedCount,
      )
  ) {
    return null;
  }

  return createImage(rule, {
    matchedFactIds: [
      ...peer.positiveFacts,
      ...wealth.positiveFacts,
    ].map(getFactId),
  });
}

function evaluateResourceHeavyOutputWeak(
  rule,
  context,
) {
  const resource =
    context.tenGodGroups.resource;
  const output = context.tenGodGroups.output;
  const thresholds =
    rule.thresholds ?? {};
  const outputWeakMax =
    numberThreshold(
      thresholds.outputWeakMaxWeightedCount,
    );
  const resourceMin =
    numberThreshold(
      thresholds.resourceMinWeightedCount,
    );
  const ratioMin =
    numberThreshold(
      thresholds.resourceToOutputRatioMin,
    );

  const ratio = output.total > 0
    ? resource.total / output.total
    : Number.POSITIVE_INFINITY;

  if (
    resource.total < resourceMin ||
    output.total > outputWeakMax ||
    (
      ratioMin > 0 &&
      ratio < ratioMin
    )
  ) {
    return null;
  }

  return createImage(rule, {
    matchedFactIds: [
      ...resource.positiveFacts,
      ...output.facts,
    ].map(getFactId),
  });
}

function evaluateElementBiasVisible(
  rule,
  context,
) {
  const thresholds =
    rule.thresholds ?? {};
  const acceptedBiasLevels = new Set(
    normalizeArray(
      thresholds.acceptedBiasLevels,
    ),
  );
  const biasLevel = normalizeText(
    context.elementFacts.biasLevel?.value,
  );
  const dominantElements = normalizeValueArray(
    context.elementFacts.dominantElements?.value,
  );
  const weakestElements = normalizeValueArray(
    context.elementFacts.weakestElements?.value,
  );

  if (
    !acceptedBiasLevels.has(biasLevel) ||
    (
      thresholds.requireDominantElements &&
      dominantElements.length === 0
    ) ||
    (
      thresholds.requireWeakestElements &&
      weakestElements.length === 0
    )
  ) {
    return null;
  }

  return createImage(rule, {
    matchedFactIds: [
      context.elementFacts.biasLevel,
      context.elementFacts.dominantElements,
      context.elementFacts.weakestElements,
    ].map(getFactId),
  });
}

function evaluateMonthCommandOfficial(
  rule,
  context,
) {
  const monthBranchMain =
    context.pillars.month?.branchMainTenGod;
  const tenGod = normalizeText(
    monthBranchMain?.value,
  );
  const acceptedTenGods = new Set(
    normalizeArray(
      rule.thresholds?.acceptedTenGods,
    ),
  );

  if (!acceptedTenGods.has(tenGod)) {
    return null;
  }

  return createImage(rule, {
    title:
      rule.titleByTenGod?.[tenGod] ??
      rule.title,
    matchedFactIds: [
      getFactId(monthBranchMain?.fact),
    ],
  });
}

function evaluateOutputWealthChain(
  rule,
  context,
) {
  const output = context.tenGodGroups.output;
  const wealth = context.tenGodGroups.wealth;
  const thresholds = rule.thresholds ?? {};

  if (
    output.total <
      numberThreshold(
        thresholds.outputMinWeightedCount,
      ) ||
    wealth.total <
      numberThreshold(
        thresholds.wealthMinWeightedCount,
      )
  ) {
    return null;
  }

  return createImage(rule, {
    matchedFactIds: [
      ...output.positiveFacts,
      ...wealth.positiveFacts,
    ].map(getFactId),
  });
}

function evaluateHurtingOfficerResourceBalance(
  rule,
  context,
) {
  const hurtingOfficer =
    context.tenGodFactsByName["伤官"];
  const resource =
    context.tenGodGroups.resource;
  const thresholds = rule.thresholds ?? {};

  if (
    weightedCount(hurtingOfficer) <
      numberThreshold(
        thresholds.hurtingOfficerMinWeightedCount,
      ) ||
    resource.total <
      numberThreshold(
        thresholds.resourceMinWeightedCount,
      )
  ) {
    return null;
  }

  return createImage(rule, {
    matchedFactIds: [
      getFactId(hurtingOfficer),
      ...resource.positiveFacts.map(getFactId),
    ],
  });
}

function evaluateHurtingOfficerMeetsOfficer(
  rule,
  context,
) {
  const hurtingOfficer =
    context.tenGodFactsByName["伤官"];
  const properOfficer =
    context.tenGodFactsByName["正官"];
  const thresholds = rule.thresholds ?? {};

  if (
    weightedCount(hurtingOfficer) <
      numberThreshold(
        thresholds.hurtingOfficerMinWeightedCount,
      ) ||
    weightedCount(properOfficer) <
      numberThreshold(
        thresholds.properOfficerMinWeightedCount,
      )
  ) {
    return null;
  }

  return createImage(rule, {
    matchedFactIds: [
      getFactId(hurtingOfficer),
      getFactId(properOfficer),
    ],
  });
}

function evaluateWealthHeavyBodyWeak(
  rule,
  context,
) {
  const wealth = context.tenGodGroups.wealth;
  const strengthScoreFact =
    context.dayMasterFacts.strengthScore;
  const strengthScore = parseFiniteNumber(
    strengthScoreFact?.value,
  );
  const thresholds = rule.thresholds ?? {};

  if (
    strengthScore === null ||
    wealth.total <
      numberThreshold(
        thresholds.wealthMinWeightedCount,
      ) ||
    strengthScore >
      numberThreshold(
        thresholds.maxDayMasterStrengthScore,
      )
  ) {
    return null;
  }

  return createImage(rule, {
    matchedFactIds: [
      ...wealth.positiveFacts.map(getFactId),
      getFactId(strengthScoreFact),
    ],
  });
}

function evaluateOfficerKillingMixed(
  rule,
  context,
) {
  const properOfficer =
    context.tenGodFactsByName["正官"];
  const killing =
    context.tenGodFactsByName["七杀"];
  const thresholds = rule.thresholds ?? {};

  if (
    weightedCount(properOfficer) <
      numberThreshold(
        thresholds.properOfficerMinWeightedCount,
      ) ||
    weightedCount(killing) <
      numberThreshold(
        thresholds.killingMinWeightedCount,
      )
  ) {
    return null;
  }

  return createImage(rule, {
    matchedFactIds: [
      getFactId(properOfficer),
      getFactId(killing),
    ],
  });
}

function evaluateDayBranchCombined(
  rule,
  context,
) {
  const allowedTypes = new Set(
    normalizeArray(
      rule.thresholds?.combineRelationTypes,
    ),
  );
  const matchedFacts =
    context.relationFacts.filter((fact) => {
      const relationType = normalizeText(
        fact.value?.relationType,
      );

      return (
        allowedTypes.has(relationType) &&
        relationHasDayBranch(fact)
      );
    });

  if (matchedFacts.length === 0) {
    return null;
  }

  return createImage(rule, {
    matchedFactIds:
      matchedFacts.map(getFactId),
  });
}

function evaluateMetalWaterFireWeak(
  rule,
  context,
) {
  const counts = context.elementFacts.counts;
  const thresholds = rule.thresholds ?? {};
  const metal = counts.metal;
  const water = counts.water;
  const fire = counts.fire;

  if (
    !metal.fact ||
    !water.fact ||
    !fire.fact ||
    metal.value <
      numberThreshold(thresholds.metalMinCount) ||
    water.value <
      numberThreshold(thresholds.waterMinCount) ||
    fire.value >
      numberThreshold(thresholds.fireMaxCount)
  ) {
    return null;
  }

  return createImage(rule, {
    matchedFactIds: [
      getFactId(metal.fact),
      getFactId(water.fact),
      getFactId(fire.fact),
    ],
  });
}

function buildCompositionContext(facts) {
  const tenGodPresenceFacts =
    selectAtomicFacts({
      facts,
      query: {
        categories: ["ten_god"],
        predicates: [
          "ten_god_presence",
        ],
      },
    }).selectedFacts;

  const pillarFacts = selectAtomicFacts({
    facts,
    query: {
      categories: ["pillar"],
      predicates: [
        "pillar_stem",
        "pillar_branch",
        "pillar_stem_ten_god",
        "pillar_branch_main_ten_god",
      ],
    },
  }).selectedFacts;

  const relationFacts = selectAtomicFacts({
    facts,
    query: {
      categories: ["relation"],
      predicates: ["has_relation"],
    },
  }).selectedFacts;

  const elementFacts = selectAtomicFacts({
    facts,
    query: {
      categories: ["element"],
      predicates: [
        "bias_level",
        "dominant_elements",
        "weakest_elements",
        "element_count",
      ],
    },
  }).selectedFacts;

  const dayMasterFacts = selectAtomicFacts({
    facts,
    query: {
      categories: ["day_master"],
      predicates: ["strength_score"],
    },
  }).selectedFacts;

  return {
    tenGodGroups:
      buildTenGodGroups(tenGodPresenceFacts),
    tenGodFactsByName:
      buildTenGodFactsByName(
        tenGodPresenceFacts,
      ),
    monthTenGodFacts:
      buildMonthTenGodFacts(pillarFacts),
    pillars: buildPillars(pillarFacts),
    relationFacts,
    elementFacts:
      buildElementFacts(elementFacts),
    dayMasterFacts:
      buildDayMasterFacts(dayMasterFacts),
  };
}

function buildTenGodFactsByName(facts) {
  const result = {};

  for (const fact of facts) {
    const tenGod = normalizeText(
      fact.value?.tenGod ??
        fact.subject?.key,
    );

    if (tenGod && !result[tenGod]) {
      result[tenGod] = fact;
    }
  }

  return result;
}

function buildTenGodGroups(facts) {
  const groups = {};

  for (const group of Object.keys(tenGodGroups)) {
    groups[group] = {
      total: 0,
      facts: [],
      positiveFacts: [],
    };
  }

  for (const fact of facts) {
    const tenGod = normalizeText(
      fact.value?.tenGod ??
        fact.subject?.key,
    );
    const weightedCount =
      parseFiniteNumber(
        fact.value?.weightedCount,
      ) ?? 0;

    for (const [group, members] of Object.entries(
      tenGodGroups,
    )) {
      if (!members.includes(tenGod)) {
        continue;
      }

      groups[group].total += weightedCount;
      groups[group].facts.push(fact);

      if (weightedCount > 0) {
        groups[group].positiveFacts.push(fact);
      }
    }
  }

  return groups;
}

function buildMonthTenGodFacts(facts) {
  const result = {};

  for (const group of Object.keys(tenGodGroups)) {
    result[group] = [];
  }

  for (const fact of facts) {
    if (
      fact.subject?.key !== "month" ||
      (
        fact.predicate !== "pillar_stem_ten_god" &&
        fact.predicate !==
          "pillar_branch_main_ten_god"
      )
    ) {
      continue;
    }

    const tenGod = normalizeText(fact.value);

    for (const [group, members] of Object.entries(
      tenGodGroups,
    )) {
      if (members.includes(tenGod)) {
        result[group].push(fact);
      }
    }
  }

  return result;
}

function buildPillars(facts) {
  const pillars = {};

  for (const pillar of pillarOrder) {
    pillars[pillar] = {};
  }

  for (const fact of facts) {
    const pillar = normalizeText(
      fact.subject?.key,
    );

    if (!pillarOrder.includes(pillar)) {
      continue;
    }

    const slot = pillars[pillar];

    if (fact.predicate === "pillar_stem") {
      slot.stem = {
        value: normalizeText(fact.value),
        fact,
      };
    }

    if (fact.predicate === "pillar_branch") {
      slot.branch = {
        value: normalizeText(fact.value),
        fact,
      };
    }

    if (
      fact.predicate ===
      "pillar_branch_main_ten_god"
    ) {
      slot.branchMainTenGod = {
        value: normalizeText(fact.value),
        fact,
      };
    }

    if (
      fact.predicate ===
      "pillar_stem_ten_god"
    ) {
      slot.stemTenGod = {
        value: normalizeText(fact.value),
        fact,
      };
    }
  }

  return pillars;
}

function findOfficialResourceAnchorFacts(context) {
  const monthStemTenGod =
    context.pillars.month?.stemTenGod;
  const monthBranchMainTenGod =
    context.pillars.month?.branchMainTenGod;
  const yearStemTenGod =
    context.pillars.year?.stemTenGod;

  const anchors = [];

  if (
    tenGodGroups.resource.includes(
      normalizeText(monthStemTenGod?.value),
    )
  ) {
    anchors.push(monthStemTenGod.fact);
  }

  if (
    tenGodGroups.officer.includes(
      normalizeText(monthBranchMainTenGod?.value),
    )
  ) {
    anchors.push(monthBranchMainTenGod.fact);
  }

  if (
    [
      ...tenGodGroups.officer,
      ...tenGodGroups.resource,
    ].includes(
      normalizeText(yearStemTenGod?.value),
    )
  ) {
    anchors.push(yearStemTenGod.fact);
  }

  return anchors;
}

function buildElementFacts(facts) {
  const result = {
    biasLevel: null,
    dominantElements: null,
    weakestElements: null,
    counts: {
      wood: { value: 0, fact: null },
      fire: { value: 0, fact: null },
      earth: { value: 0, fact: null },
      metal: { value: 0, fact: null },
      water: { value: 0, fact: null },
    },
  };

  for (const fact of facts) {
    if (fact.predicate === "bias_level") {
      result.biasLevel = fact;
    }

    if (fact.predicate === "dominant_elements") {
      result.dominantElements = fact;
    }

    if (fact.predicate === "weakest_elements") {
      result.weakestElements = fact;
    }

    if (fact.predicate === "element_count") {
      const element = normalizeText(
        fact.value?.element ??
          fact.subject?.key,
      );
      const count =
        parseFiniteNumber(
          fact.value?.count ??
            fact.value?.weightedCount ??
            fact.value,
        ) ?? 0;

      if (Object.hasOwn(result.counts, element)) {
        result.counts[element] = {
          value: count,
          fact,
        };
      }
    }
  }

  return result;
}

function buildDayMasterFacts(facts) {
  const result = {
    strengthScore: null,
  };

  for (const fact of facts) {
    if (fact.predicate === "strength_score") {
      result.strengthScore = fact;
    }
  }

  return result;
}

function relationHasDayBranch(fact) {
  return (
    Array.isArray(fact.value?.participants) &&
    fact.value.participants.some((participant) =>
      participant?.pillar === "day" &&
      participant?.position === "branch",
    )
  );
}

function createImage(
  rule,
  overrides = {},
) {
  const role = roleKeys.includes(
    normalizeText(rule.role),
  )
    ? normalizeText(rule.role)
    : "conditional";

  const ruleId = normalizeText(rule.id);
  const priority = parseFiniteNumber(
    overrides.priority,
  ) ?? parseFiniteNumber(rule.priority) ?? 0;

  return {
    id: `contract_image:${ruleId}`,
    ruleId,
    title: normalizeText(
      overrides.title ?? rule.title,
    ),
    brief: normalizeText(rule.brief),
    role,
    status: normalizeText(rule.status),
    importance: normalizeText(
      rule.importance,
    ),
    confidence: normalizeConfidence(
      overrides.confidence ??
        rule.baseConfidence,
    ),
    priority,
    matchedFactIds: uniqueSortedStrings(
      overrides.matchedFactIds ?? [],
    ),
    counterFactIds: uniqueSortedStrings(
      overrides.counterFactIds ?? [],
    ),
    tags: uniqueSortedStrings(rule.tags),
    domains: uniqueSortedStrings(
      rule.domains,
    ),
    reasoning: normalizeArray(
      rule.reasoning,
    ),
  };
}

function buildByRole(images) {
  const byRole = {
    core: [],
    support: [],
    tension: [],
    conditional: [],
  };

  for (const image of images) {
    const role = roleKeys.includes(image.role)
      ? image.role
      : "conditional";

    byRole[role].push(image);
  }

  return byRole;
}

function compareImages(left, right) {
  return (
    right.priority - left.priority ||
    left.ruleId.localeCompare(right.ruleId)
  );
}

function maxConfidence(left, right) {
  const leftValue = normalizeConfidence(left);
  const rightValue = normalizeConfidence(right);

  return confidenceRank[rightValue] >
    confidenceRank[leftValue]
    ? rightValue
    : leftValue;
}

function normalizeConfidence(value) {
  const confidence = normalizeText(value);

  return Object.hasOwn(
    confidenceRank,
    confidence,
  )
    ? confidence
    : "unknown";
}

function numberThreshold(value) {
  return parseFiniteNumber(value) ?? 0;
}

function parseFiniteNumber(value) {
  if (
    value === undefined ||
    value === null
  ) {
    return null;
  }

  if (
    typeof value === "string" &&
    value.trim() === ""
  ) {
    return null;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed)
    ? parsed
    : null;
}

function weightedCount(fact) {
  return parseFiniteNumber(
    fact?.value?.weightedCount,
  ) ?? 0;
}

function normalizeValueArray(value) {
  return uniqueSortedStrings(
    Array.isArray(value) ? value : [],
  );
}

function normalizeArray(value) {
  return Array.isArray(value)
    ? value.map(normalizeText).filter(Boolean)
    : [];
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

function getFactId(fact) {
  return normalizeText(fact?.id);
}

function normalizeText(value) {
  return typeof value === "string"
    ? value.trim()
    : "";
}
