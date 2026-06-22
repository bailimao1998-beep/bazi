export const NATAL_PROFESSIONAL_CONTEXT_VERSION =
  "natal-professional-context-v1";

const pillarKeys = [
  "year",
  "month",
  "day",
  "hour",
];

const pillarMeta = {
  year: {
    label: "年柱",
    ownership: "guest",
    ownershipLabel: "宾位",
    proximity: "far",
    proximityLabel: "远位",
    distanceFromDay: 2,
    stage: "early",
    themes: [
      "祖上",
      "早年环境",
      "外部背景",
    ],
  },

  month: {
    label: "月柱",
    ownership: "guest",
    ownershipLabel: "宾位",
    proximity: "near",
    proximityLabel: "近位",
    distanceFromDay: 1,
    stage: "environment",
    themes: [
      "父母家庭",
      "成长环境",
      "工作与社会入口",
    ],
  },

  day: {
    label: "日柱",
    ownership: "host",
    ownershipLabel: "主位",
    proximity: "core",
    proximityLabel: "核心位",
    distanceFromDay: 0,
    stage: "self",
    themes: [
      "命主自身",
      "夫妻宫",
      "日常生活",
    ],
  },

  hour: {
    label: "时柱",
    ownership: "host",
    ownershipLabel: "主位",
    proximity: "near",
    proximityLabel: "近位",
    distanceFromDay: 1,
    stage: "result",
    themes: [
      "子女晚辈",
      "作品成果",
      "后期发展",
    ],
  },
};

const relationLabels = {
  stem_combine: "天干相合",
  stem_clash: "天干相冲",
  stem_control: "天干相克",

  branch_combine: "地支六合",
  branch_clash: "地支相冲",
  branch_punish: "地支相刑",
  branch_self_punish: "地支自刑",
  branch_harm: "地支相害",
  branch_break: "地支相破",

  three_harmony: "地支三合",
  three_meeting: "地支三会",
  half_harmony: "地支半合",
  arch_harmony: "地支拱合",

  repetition: "伏吟重复",
  unknown: "未识别关系",
};

const relationNatureMap = {
  stem_combine: "connection",
  branch_combine: "connection",
  three_harmony: "connection",
  three_meeting: "connection",
  half_harmony: "connection",
  arch_harmony: "connection",

  stem_clash: "tension",
  stem_control: "tension",
  branch_clash: "tension",
  branch_punish: "tension",
  branch_self_punish: "tension",
  branch_harm: "tension",
  branch_break: "tension",

  repetition: "repetition",
  unknown: "unknown",
};

const positionPriority = {
  visible: 4,
  main_qi: 3,
  hidden: 2,
  unknown: 1,
};

const kinshipKeys = [
  "father",
  "mother",
  "siblings",
  "spouse",
  "children",
];

export function buildNatalProfessionalContext(
  featureVector = {},
) {
  const pillars =
    featureVector.pillars ?? {};

  const relationMatrix =
    featureVector.relationMatrix ?? {};

  const tenGodStates =
    featureVector.tenGodStates ?? {};

  const palaceFeatures =
    featureVector.palaceFeatures ?? {};

  const kinshipFeatures =
    featureVector.kinshipFeatures ?? {};

  const relationContexts =
    (
      Array.isArray(
        relationMatrix.items,
      )
        ? relationMatrix.items
        : []
    ).map((relation) =>
      buildRelationContext({
        relation,
        pillars,
      }),
    );

  const relationById =
    Object.fromEntries(
      relationContexts
        .filter(
          (relation) =>
            relation.id,
        )
        .map(
          (relation) => [
            relation.id,
            relation,
          ],
        ),
    );

  const pillarContexts =
    Object.fromEntries(
      pillarKeys.map(
        (pillarKey) => [
          pillarKey,
          buildPillarContext({
            pillarKey,
            pillar:
              pillars[pillarKey] ??
              {},

            palace:
              palaceFeatures[
                pillarKey
              ] ?? {},

            relationById,
          }),
        ],
      ),
    );

  const tenGodContexts =
    Object.fromEntries(
      Object.entries(
        tenGodStates,
      ).map(
        ([name, state]) => [
          name,
          buildTenGodContext({
            name,
            state,
            pillars,
          }),
        ],
      ),
    );

  const spousePalace =
    buildSpousePalaceContext({
      palace:
        palaceFeatures
          .spousePalace ?? {},

      relationById,
    });

  const kinshipContexts =
    Object.fromEntries(
      kinshipKeys.map(
        (key) => [
          key,
          buildKinshipContext({
            key,
            profile:
              kinshipFeatures[
                key
              ] ?? {},
          }),
        ],
      ),
    );

  const hostGuest =
    buildHostGuestSummary({
      tenGodContexts,
      relationContexts,
    });

  const warnings = [];

  if (
    !Object.keys(
      tenGodContexts,
    ).length
  ) {
    warnings.push(
      "ten_god_states_missing",
    );
  }

  if (
    !relationContexts.length
  ) {
    warnings.push(
      "relation_context_empty",
    );
  }

  return {
    version:
      NATAL_PROFESSIONAL_CONTEXT_VERSION,

    mapping: {
      hostPillars: [
        "day",
        "hour",
      ],

      guestPillars: [
        "year",
        "month",
      ],

      boundary:
        "本层采用盲派常用的年月为宾、日时为主作为结构观察口径；具体结论仍需结合十神、宫位、做功和全局制化。",
    },

    hostGuest,

    pillars:
      pillarContexts,

    tenGods:
      tenGodContexts,

    relations:
      relationContexts,

    relationById,

    palaces: {
      ...pillarContexts,
      spousePalace,
    },

    kinships:
      kinshipContexts,

    keyFacts:
      buildKeyFacts({
        hostGuest,
        tenGodContexts,
        relationContexts,
        spousePalace,
        kinshipContexts,
      }),

    confidence:
      calculateConfidence({
        pillars:
          pillarContexts,

        tenGods:
          tenGodContexts,

        relations:
          relationContexts,
      }),

    warnings,
  };
}

function buildPillarContext({
  pillarKey,
  pillar,
  palace,
  relationById,
}) {
  const meta =
    pillarMeta[pillarKey];

  const relationIds =
    uniqueText(
      palace.relationIds,
    );

  const relations =
    relationIds
      .map(
        (relationId) =>
          relationById[
            relationId
          ],
      )
      .filter(Boolean);

  return {
    key:
      pillarKey,

    label:
      meta.label,

    ownership:
      meta.ownership,

    ownershipLabel:
      meta.ownershipLabel,

    proximity:
      meta.proximity,

    proximityLabel:
      meta.proximityLabel,

    distanceFromDay:
      meta.distanceFromDay,

    stage:
      meta.stage,

    themes:
      [...meta.themes],

    stem:
      normalizeText(
        pillar.stem,
      ),

    branch:
      normalizeText(
        pillar.branch,
      ),

    pillarLabel:
      normalizeText(
        pillar.label,
      ) ||
      `${normalizeText(
        pillar.stem,
      )}${normalizeText(
        pillar.branch,
      )}`,

    stemTenGod:
      normalizeText(
        pillar.stemTenGod,
      ),

    branchMainTenGod:
      normalizeText(
        pillar
          .branchMainTenGod,
      ),

    hiddenTenGods:
      (
        Array.isArray(
          pillar.hiddenStems,
        )
          ? pillar.hiddenStems
          : []
      )
        .map(
          (item) =>
            normalizeText(
              item?.tenGod,
            ),
        )
        .filter(Boolean),

    relationIds,

    relationTypes:
      uniqueText(
        relations.map(
          (relation) =>
            relation.relationType,
        ),
      ),

    relationTitles:
      uniqueText(
        relations.map(
          (relation) =>
            relation.title,
        ),
      ),

    relationSummary:
      palace.relationSummary ??
      {},

    evidence:
      Array.isArray(
        palace.evidence,
      )
        ? palace.evidence
        : [],
  };
}

function buildTenGodContext({
  name,
  state,
  pillars,
}) {
  const positions =
    [
      ...normalizePositionPaths(
        state.visiblePositions,
        "visible",
      ),

      ...normalizePositionPaths(
        state.mainQiPositions,
        "main_qi",
      ),

      ...normalizePositionPaths(
        state.hiddenPositions,
        "hidden",
      ),
    ]
      .map(
        (position) =>
          enrichPosition({
            position,
            pillars,
          }),
      )
      .sort(comparePositions);

  const hostPositions =
    positions.filter(
      (position) =>
        position.ownership ===
        "host",
    );

  const guestPositions =
    positions.filter(
      (position) =>
        position.ownership ===
        "guest",
    );

  const relationIds =
    uniqueText(
      (
        Array.isArray(
          state.relatedRelations,
        )
          ? state
              .relatedRelations
          : []
      ).map(
        (relation) =>
          relation?.id,
      ),
    );

  const relationTypes =
    uniqueText(
      (
        Array.isArray(
          state.relatedRelations,
        )
          ? state
              .relatedRelations
          : []
      ).map(
        (relation) =>
          relation
            ?.relationType,
      ),
    );

  return {
    name:
      normalizeText(name),

    weightedCount:
      finite(
        state.weightedCount,
      ),

    strengthLevel:
      normalizeText(
        state.strengthLevel,
      ) || "unknown",

    usableLevel:
      normalizeText(
        state.usableLevel,
      ) || "unknown",

    visibleCount:
      finite(
        state.visibleCount,
      ),

    hiddenCount:
      finite(
        state.hiddenCount,
      ),

    mainQiCount:
      finite(
        state.mainQiCount,
      ),

    isVisible:
      Boolean(
        state.isVisible,
      ),

    isHiddenOnly:
      Boolean(
        state.isHiddenOnly,
      ),

    hasRoot:
      Boolean(
        state.hasRoot,
      ),

    isFloating:
      Boolean(
        state.isFloating,
      ),

    isBlocked:
      Boolean(
        state.isBlocked,
      ),

    inMonthStem:
      Boolean(
        state.inMonthStem,
      ),

    inMonthCommand:
      Boolean(
        state.inMonthCommand,
      ),

    positions,

    hostPositions,

    guestPositions,

    placementScope:
      resolvePlacementScope({
        hostPositions,
        guestPositions,
      }),

    nearestPosition:
      positions[0] ??
      null,

    nearestDistance:
      positions.length
        ? Math.min(
            ...positions.map(
              (position) =>
                position
                  .distanceFromDay,
            ),
          )
        : null,

    relationIds,

    relationTypes,

    combinedBy:
      uniqueText(
        state.combinedBy,
      ),

    clashedBy:
      uniqueText(
        state.clashedBy,
      ),

    punishedBy:
      uniqueText(
        state.punishedBy,
      ),

    harmedBy:
      uniqueText(
        state.harmedBy,
      ),

    brokenBy:
      uniqueText(
        state.brokenBy,
      ),

    controlledBy:
      uniqueText(
        state.controlledBy,
      ),

    statusText:
      buildTenGodStatusText({
        name,
        state,
        hostPositions,
        guestPositions,
      }),

    evidence:
      Array.isArray(
        state.evidence,
      )
        ? state.evidence
        : [],

    warnings:
      Array.isArray(
        state.warnings,
      )
        ? state.warnings
        : [],
  };
}

function buildRelationContext({
  relation,
  pillars,
}) {
  const participants =
    uniqueParticipants(
      relation.participants ??
      relation.members ??
      [],
    ).map((participant) =>
      buildRelationParticipant({
        participant,
        pillars,
      }),
    );

  const hasHost =
    participants.some(
      (participant) =>
        participant.ownership ===
        "host",
    );

  const hasGuest =
    participants.some(
      (participant) =>
        participant.ownership ===
        "guest",
    );

  const relationType =
    normalizeText(
      relation.relationType,
    ) || "unknown";

  const affectedDomains =
    uniqueText([
      ...participants.flatMap(
        (participant) =>
          domainsForParticipant(
            participant,
          ),
      ),

      relation.affects
        ?.spousePalace
        ? "spouse"
        : "",

      relation.affects
        ?.dayStem ||
      relation.affects
        ?.dayBranch
        ? "self"
        : "",

      relation.affects
        ?.monthBranch
        ? "career"
        : "",
    ]);

  return {
    id:
      normalizeText(
        relation.id,
      ),

    relationType,

    relationLabel:
      relationLabels[
        relationType
      ] ||
      relationType,

    nature:
      relationNatureMap[
        relationType
      ] || "unknown",

    layer:
      normalizeText(
        relation.layer,
      ),

    formation:
      normalizeText(
        relation.formation,
      ),

    confidence:
      normalizeText(
        relation.confidence,
      ) || "unknown",

    participants,

    title:
      buildRelationTitle({
        relationType,
        participants,
      }),

    hostGuestBridge:
      hasHost &&
      hasGuest,

    hostOnly:
      hasHost &&
      !hasGuest,

    guestOnly:
      hasGuest &&
      !hasHost,

    affects: {
      dayStem:
        Boolean(
          relation.affects
            ?.dayStem,
        ),

      dayBranch:
        Boolean(
          relation.affects
            ?.dayBranch,
        ),

      monthStem:
        Boolean(
          relation.affects
            ?.monthStem,
        ),

      monthBranch:
        Boolean(
          relation.affects
            ?.monthBranch,
        ),

      spousePalace:
        Boolean(
          relation.affects
            ?.spousePalace,
        ),
    },

    affectedDomains,

    evidence:
      Array.isArray(
        relation.evidence,
      )
        ? relation.evidence
        : [],

    warnings:
      Array.isArray(
        relation.warnings,
      )
        ? relation.warnings
        : [],
  };
}

function buildRelationParticipant({
  participant,
  pillars,
}) {
  const pillarKey =
    normalizePillarKey(
      participant.pillar,
    );

  const meta =
    pillarMeta[pillarKey] ??
    unknownPillarMeta();

  const position =
    normalizeText(
      participant.position,
    );

  const pillar =
    pillars[pillarKey] ?? {};

  return {
    pillar:
      pillarKey,

    pillarLabel:
      meta.label,

    position,

    positionLabel:
      positionLabel(position),

    value:
      normalizeText(
        participant.value,
      ),

    ownership:
      meta.ownership,

    ownershipLabel:
      meta.ownershipLabel,

    proximity:
      meta.proximity,

    distanceFromDay:
      meta.distanceFromDay,

    tenGod:
      position === "stem"
        ? normalizeText(
            pillar.stemTenGod,
          )
        : position ===
            "branch"
          ? normalizeText(
              pillar
                .branchMainTenGod,
            )
          : "",
  };
}

function buildSpousePalaceContext({
  palace,
  relationById,
}) {
  const relationIds =
    uniqueText(
      palace.relationIds,
    );

  const relations =
    relationIds
      .map(
        (relationId) =>
          relationById[
            relationId
          ],
      )
      .filter(Boolean);

  return {
    key:
      "spousePalace",

    label:
      "夫妻宫",

    pillar:
      "day",

    ownership:
      "host",

    branch:
      normalizeText(
        palace.branch,
      ),

    mainTenGod:
      normalizeText(
        palace.mainTenGod,
      ),

    hiddenTenGods:
      uniqueText(
        palace.hiddenTenGods,
      ),

    relationIds,

    relationTypes:
      uniqueText(
        palace.relationTypes,
      ),

    relationTitles:
      uniqueText(
        relations.map(
          (relation) =>
            relation.title,
        ),
      ),

    tensionRelationTitles:
      uniqueText(
        relations
          .filter(
            (relation) =>
              relation.nature ===
              "tension",
          )
          .map(
            (relation) =>
              relation.title,
          ),
      ),

    connectionRelationTitles:
      uniqueText(
        relations
          .filter(
            (relation) =>
              relation.nature ===
              "connection",
          )
          .map(
            (relation) =>
              relation.title,
          ),
      ),

    hasCombine:
      Boolean(
        palace.hasCombine,
      ),

    hasClash:
      Boolean(
        palace.hasClash,
      ),

    hasPunish:
      Boolean(
        palace.hasPunish,
      ),

    hasSelfPunish:
      Boolean(
        palace.hasSelfPunish,
      ),

    hasHarm:
      Boolean(
        palace.hasHarm,
      ),

    hasBreak:
      Boolean(
        palace.hasBreak,
      ),

    hasRepetition:
      Boolean(
        palace.hasRepetition,
      ),

    evidence:
      Array.isArray(
        palace.evidence,
      )
        ? palace.evidence
        : [],
  };
}

function buildKinshipContext({
  key,
  profile,
}) {
  const starProfile =
    profile.starProfile ?? {};

  const positions =
    [
      ...normalizePositionPaths(
        starProfile
          .visiblePositions,
        "visible",
      ),

      ...normalizePositionPaths(
        starProfile
          .mainQiPositions,
        "main_qi",
      ),

      ...normalizePositionPaths(
        starProfile
          .hiddenPositions,
        "hidden",
      ),
    ].sort(comparePositions);

  const hostPositions =
    positions.filter(
      (position) =>
        position.ownership ===
        "host",
    );

  const guestPositions =
    positions.filter(
      (position) =>
        position.ownership ===
        "guest",
    );

  return {
    key,

    label:
      normalizeText(
        profile.label,
      ),

    mappingStatus:
      normalizeText(
        profile.mappingStatus,
      ) || "unknown",

    primaryTenGods:
      uniqueText(
        profile.primaryTenGods,
      ),

    secondaryTenGods:
      uniqueText(
        profile.secondaryTenGods,
      ),

    palaceRefs:
      uniqueText(
        profile.palaceRefs,
      ),

    weightedCount:
      finite(
        starProfile
          .weightedCount,
      ),

    strengthLevels:
      uniqueText(
        starProfile
          .strengthLevels,
      ),

    positions,

    hostPositions,

    guestPositions,

    placementScope:
      resolvePlacementScope({
        hostPositions,
        guestPositions,
      }),

    nearestPosition:
      positions[0] ??
      null,

    relationIds:
      uniqueText(
        profile
          .palaceProfile
          ?.relationIds,
      ),

    relationTypes:
      uniqueText(
        profile
          .palaceProfile
          ?.relationTypes,
      ),

    evidence:
      Array.isArray(
        profile.evidence,
      )
        ? profile.evidence
        : [],

    warnings:
      Array.isArray(
        profile.warnings,
      )
        ? profile.warnings
        : [],
  };
}

function buildHostGuestSummary({
  tenGodContexts,
  relationContexts,
}) {
  const contexts =
    Object.values(
      tenGodContexts,
    );

  return {
    hostPillars: [
      "day",
      "hour",
    ],

    guestPillars: [
      "year",
      "month",
    ],

    hostTenGods:
      contexts
        .filter(
          (context) =>
            context.placementScope ===
              "host" ||
            context.placementScope ===
              "mixed",
        )
        .map(
          (context) =>
            context.name,
        ),

    guestTenGods:
      contexts
        .filter(
          (context) =>
            context.placementScope ===
              "guest" ||
            context.placementScope ===
              "mixed",
        )
        .map(
          (context) =>
            context.name,
        ),

    mixedTenGods:
      contexts
        .filter(
          (context) =>
            context.placementScope ===
            "mixed",
        )
        .map(
          (context) =>
            context.name,
        ),

    bridgeRelationIds:
      relationContexts
        .filter(
          (relation) =>
            relation
              .hostGuestBridge,
        )
        .map(
          (relation) =>
            relation.id,
        ),

    bridgeRelationTitles:
      relationContexts
        .filter(
          (relation) =>
            relation
              .hostGuestBridge,
        )
        .map(
          (relation) =>
            relation.title,
        ),
  };
}

function buildKeyFacts({
  hostGuest,
  tenGodContexts,
  relationContexts,
  spousePalace,
  kinshipContexts,
}) {
  const facts = [];

  if (
    hostGuest
      .bridgeRelationTitles
      .length
  ) {
    facts.push(
      `宾主之间存在${hostGuest.bridgeRelationTitles
        .slice(0, 3)
        .join("、")}`,
    );
  }

  const strongTenGods =
    Object.values(
      tenGodContexts,
    )
      .filter(
        (context) =>
          context.strengthLevel ===
            "strong" ||
          context.weightedCount >=
            2,
      )
      .map(
        (context) =>
          context.name,
      );

  if (strongTenGods.length) {
    facts.push(
      `${strongTenGods
        .slice(0, 4)
        .join("、")}力量较集中`,
    );
  }

  const tensionRelations =
    relationContexts
      .filter(
        (relation) =>
          relation.nature ===
          "tension",
      )
      .map(
        (relation) =>
          relation.title,
      );

  if (
    tensionRelations.length
  ) {
    facts.push(
      `原局可见${tensionRelations
        .slice(0, 4)
        .join("、")}`,
    );
  }

  if (
    spousePalace
      .tensionRelationTitles
      .length
  ) {
    facts.push(
      `夫妻宫受到${spousePalace.tensionRelationTitles
        .slice(0, 3)
        .join("、")}牵动`,
    );
  }

  const spouse =
    kinshipContexts.spouse;

  if (
    spouse &&
    spouse.mappingStatus ===
      "resolved" &&
    spouse.nearestPosition
  ) {
    facts.push(
      `配偶星最近落在${spouse.nearestPosition.pillarLabel}${spouse.nearestPosition.positionLabel}`,
    );
  }

  return uniqueText(facts);
}

function normalizePositionPaths(
  values,
  visibility,
) {
  return (
    Array.isArray(values)
      ? values
      : []
  )
    .map(
      (path) =>
        parsePositionPath({
          path,
          visibility,
        }),
    )
    .filter(Boolean);
}

function parsePositionPath({
  path,
  visibility,
}) {
  const text =
    normalizeText(path);

  const match =
    /^(year|month|day|hour)\.(stem|branch)(?:\.(mainQi|hidden)(?:\.(\d+))?)?$/.exec(
      text,
    );

  if (!match) {
    return null;
  }

  const pillarKey =
    match[1];

  const meta =
    pillarMeta[pillarKey];

  return {
    path:
      text,

    pillar:
      pillarKey,

    pillarLabel:
      meta.label,

    position:
      match[2],

    positionLabel:
      match[2] === "stem"
        ? "天干"
        : match[3] ===
            "mainQi"
          ? "地支主气"
          : "地支藏干",

    visibility:
      visibility ||
      "unknown",

    ownership:
      meta.ownership,

    ownershipLabel:
      meta.ownershipLabel,

    proximity:
      meta.proximity,

    proximityLabel:
      meta.proximityLabel,

    distanceFromDay:
      meta.distanceFromDay,

    hiddenIndex:
      match[4] === undefined
        ? null
        : Number(
            match[4],
          ),
  };
}

function enrichPosition({
  position,
  pillars,
}) {
  const pillar =
    pillars[
      position.pillar
    ] ?? {};

  return {
    ...position,

    value:
      position.position ===
        "stem"
        ? normalizeText(
            pillar.stem,
          )
        : normalizeText(
            pillar.branch,
          ),
  };
}

function comparePositions(
  left,
  right,
) {
  return (
    positionPriority[
      right.visibility
    ] -
      positionPriority[
        left.visibility
      ] ||
    left.distanceFromDay -
      right.distanceFromDay ||
    pillarKeys.indexOf(
      left.pillar,
    ) -
      pillarKeys.indexOf(
        right.pillar,
      )
  );
}

function resolvePlacementScope({
  hostPositions,
  guestPositions,
}) {
  if (
    hostPositions.length &&
    guestPositions.length
  ) {
    return "mixed";
  }

  if (hostPositions.length) {
    return "host";
  }

  if (guestPositions.length) {
    return "guest";
  }

  return "none";
}

function buildTenGodStatusText({
  name,
  state,
  hostPositions,
  guestPositions,
}) {
  const parts = [];

  if (state.isVisible) {
    parts.push(
      `${name}有透出`,
    );
  } else if (
    state.isHiddenOnly
  ) {
    parts.push(
      `${name}藏支不透`,
    );
  } else {
    parts.push(
      `${name}原局不显`,
    );
  }

  if (state.hasRoot) {
    parts.push("有根");
  }

  if (state.inMonthCommand) {
    parts.push("入月令主气");
  }

  if (state.isFloating) {
    parts.push("透而无根");
  }

  if (state.isBlocked) {
    parts.push("受关系牵动");
  }

  if (
    hostPositions.length &&
    guestPositions.length
  ) {
    parts.push("主宾皆见");
  } else if (
    hostPositions.length
  ) {
    parts.push("主要落主位");
  } else if (
    guestPositions.length
  ) {
    parts.push("主要落宾位");
  }

  return parts.join("，");
}

function buildRelationTitle({
  relationType,
  participants,
}) {
  const participantText =
    participants
      .map(
        (participant) =>
          `${participant.pillarLabel}${participant.positionLabel}${participant.value}`,
      )
      .filter(Boolean)
      .join("与");

  const relationLabel =
    relationLabels[
      relationType
    ] ||
    relationType;

  return participantText
    ? `${participantText}${relationLabel}`
    : relationLabel;
}

function domainsForParticipant(
  participant,
) {
  const domains = [];

  if (
    participant.pillar ===
    "year"
  ) {
    domains.push(
      "parents",
    );
  }

  if (
    participant.pillar ===
    "month"
  ) {
    domains.push(
      "parents",
      "career",
      "siblings",
    );
  }

  if (
    participant.pillar ===
    "day"
  ) {
    domains.push(
      "self",
    );

    if (
      participant.position ===
      "branch"
    ) {
      domains.push(
        "spouse",
      );
    }
  }

  if (
    participant.pillar ===
    "hour"
  ) {
    domains.push(
      "children",
      "fortune",
    );
  }

  return domains;
}

function uniqueParticipants(
  participants,
) {
  const seen =
    new Set();

  const result = [];

  for (
    const participant of
    Array.isArray(
      participants,
    )
      ? participants
      : []
  ) {
    const key =
      [
        participant?.pillar,
        participant?.position,
        participant?.value,
      ].join("|");

    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    result.push(
      participant,
    );
  }

  return result;
}

function positionLabel(
  position,
) {
  return {
    stem: "天干",
    branch: "地支",
    pillar: "整柱",
  }[position] || "位置";
}

function normalizePillarKey(
  value,
) {
  const text =
    normalizeText(value);

  return pillarKeys.includes(
    text,
  )
    ? text
    : "unknown";
}

function unknownPillarMeta() {
  return {
    label: "未知柱位",
    ownership: "unknown",
    ownershipLabel:
      "未知宾主",

    proximity: "unknown",
    proximityLabel:
      "未知距离",

    distanceFromDay: 99,
    stage: "unknown",
    themes: [],
  };
}

function calculateConfidence({
  pillars,
  tenGods,
  relations,
}) {
  const hasPillars =
    pillarKeys.every(
      (key) =>
        Boolean(
          pillars[key]
            ?.pillarLabel,
        ),
    );

  const hasTenGods =
    Object.keys(
      tenGods,
    ).length >= 5;

  const relationsResolved =
    relations.every(
      (relation) =>
        relation.relationType !==
          "unknown" &&
        relation.participants.every(
          (participant) =>
            participant.pillar !==
            "unknown",
        ),
    );

  if (
    hasPillars &&
    hasTenGods &&
    relationsResolved
  ) {
    return "high";
  }

  if (
    hasPillars &&
    hasTenGods
  ) {
    return "medium";
  }

  return "low";
}

function uniqueText(
  values,
) {
  return [
    ...new Set(
      (
        Array.isArray(values)
          ? values
          : []
      )
        .map(normalizeText)
        .filter(Boolean),
    ),
  ];
}

function finite(
  value,
) {
  const number =
    Number(value);

  return Number.isFinite(
    number,
  )
    ? number
    : 0;
}

function normalizeText(
  value,
) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();
}