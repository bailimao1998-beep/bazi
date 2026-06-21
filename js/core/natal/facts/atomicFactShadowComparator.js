const validPillarKeys = new Set([
  "year",
  "month",
  "day",
  "hour",
]);

const validPositionTypes = new Set([
  "stem",
  "branch_main",
]);

const validElementKeys = new Set([
  "wood",
  "fire",
  "earth",
  "metal",
  "water",
]);

const pillarOrder = [
  "year",
  "month",
  "day",
  "hour",
];

const tenGodGroupMembers = {
  output: ["食神", "伤官"],
  wealth: ["正财", "偏财"],
  officer: ["正官", "七杀"],
  resource: ["正印", "偏印"],
  peer: ["比肩", "劫财"],
};

const contractOnlyNewCapabilityCategories =
  new Set([
    "palace",
    "kinship",
    "void",
    "storage",
    "growth_stage",
    "climate",
    "work_node",
    "work_edge",
  ]);

export function compareLegacyAndContractFacts({
  legacyFacts = [],
  contractFacts = [],
} = {}) {
  const warnings = [];

  const safeLegacyFacts = Array.isArray(legacyFacts)
    ? legacyFacts
    : [];

  const safeContractFacts = Array.isArray(contractFacts)
    ? contractFacts
    : [];

  if (!Array.isArray(legacyFacts)) {
    warnings.push("legacyFacts should be an array");
  }

  if (!Array.isArray(contractFacts)) {
    warnings.push("contractFacts should be an array");
  }

  const legacyProjection = buildSignalProjection(
    safeLegacyFacts,
    projectLegacyFactSignals,
    warnings,
    "legacy",
  );

  const contractProjection = buildSignalProjection(
    safeContractFacts,
    projectContractFactSignals,
    warnings,
    "contract",
  );

  mergeBatchSignals(
    contractProjection,
    projectContractTenGodGroupWeakSignals(
      safeContractFacts,
    ),
  );
  markProjectedSourceIds(
    contractProjection,
    collectContractTenGodPresenceSourceIds(
      safeContractFacts,
    ),
  );

  mergeBatchSignals(
    contractProjection,
    projectContractRepetitionSignals(
      safeContractFacts,
    ),
  );
  markProjectedSourceIds(
    contractProjection,
    collectContractPillarIdentitySourceIds(
      safeContractFacts,
    ),
  );

  finalizeProjection(contractProjection);

  const matched = [];
  const missingComparable = [];
  const contractOnly = [];

  for (const signal of legacyProjection.signals.values()) {
    const contractSignal = contractProjection.signals.get(
      signal.signalKey,
    );

    if (contractSignal) {
      matched.push(createComparisonItem({
        family: signal.family,
        signalKey: signal.signalKey,
        legacyFactIds: signal.sourceIds,
        contractFactIds: contractSignal.sourceIds,
        legacySignal: signal,
        contractSignal,
      }));
    } else {
      missingComparable.push({
        family: signal.family,
        signalKey: signal.signalKey,
        legacyFactIds: signal.sourceIds,
        reason: "no_contract_signal",
      });
    }
  }

  for (const signal of contractProjection.signals.values()) {
    if (!legacyProjection.signals.has(signal.signalKey)) {
      contractOnly.push(createComparisonItem({
        family: signal.family,
        signalKey: signal.signalKey,
        contractFactIds: signal.sourceIds,
        contractSignal: signal,
      }));
    }
  }

  const intentionallyUncompared =
    legacyProjection.unprojected.map((fact) => ({
      legacyFactId: normalizeText(fact?.id),
      legacyCategory: normalizeText(fact?.category),
      reason: classifyUncomparedLegacyFact(
        fact ?? {},
      ),
    }));

  const unmatchedContractFacts =
    buildUnmatchedContractFacts(
      contractProjection.unprojected,
    );

  matched.sort(compareSignalItems);
  missingComparable.sort(compareSignalItems);
  contractOnly.sort(compareSignalItems);
  unmatchedContractFacts.sort(
    compareUnmatchedContractFacts,
  );

  intentionallyUncompared.sort(
    (left, right) =>
      left.reason.localeCompare(right.reason) ||
      left.legacyFactId.localeCompare(
        right.legacyFactId,
      ),
  );

  const comparableLegacyCount =
    legacyProjection.signals.size;

  const matchedLegacyCount = matched.length;

  const coverageRate =
    comparableLegacyCount > 0
      ? matchedLegacyCount /
        comparableLegacyCount
      : 0;

  return {
    version: "atomic-fact-shadow-v1",
    mode: "read_only",

    comparableLegacyCount,
    matchedLegacyCount,

    missingComparableCount:
      missingComparable.length,

    intentionallyUncomparedCount:
      intentionallyUncompared.length,

    coverageRate: clampCoverageRate(
      coverageRate,
    ),

    summaryByFamily: buildSummaryByFamily({
      legacyProjection,
      matched,
      missingComparable,
      contractOnly,
    }),

    matched,
    missingComparable,
    intentionallyUncompared,
    contractOnly,
    unmatchedContractFacts,

    warnings: [...new Set(warnings)].sort(),
  };
}

export function projectLegacyStemTenGodSignal(
  fact = {},
) {
  const id = normalizeText(fact.id);

  const match =
    /^stem-visible-(year|month|day|hour)-(.+)$/.exec(
      id,
    );

  if (!match) {
    return null;
  }

  const [, pillar, tenGod] = match;

  return createTenGodPositionSignal(
    "stem",
    pillar,
    tenGod,
    id,
  );
}

export function projectContractStemTenGodSignal(
  fact = {},
) {
  if (
    fact.category !== "pillar" ||
    fact.predicate !== "pillar_stem_ten_god"
  ) {
    return null;
  }

  return createTenGodPositionSignal(
    "stem",
    fact.subject?.key,
    fact.value,
    fact.id,
  );
}

export function projectLegacyBranchMainTenGodSignal(
  fact = {},
) {
  const id = normalizeText(fact.id);

  const match =
    /^branch-main-(year|month|day|hour)-(.+)$/.exec(
      id,
    );

  if (!match) {
    return null;
  }

  const [, pillar, tenGod] = match;

  return createTenGodPositionSignal(
    "branch_main",
    pillar,
    tenGod,
    id,
  );
}

export function projectContractBranchMainTenGodSignal(
  fact = {},
) {
  if (
    fact.category !== "pillar" ||
    fact.predicate !==
      "pillar_branch_main_ten_god"
  ) {
    return null;
  }

  return createTenGodPositionSignal(
    "branch_main",
    fact.subject?.key,
    fact.value,
    fact.id,
  );
}

export function projectLegacyDayMasterSeasonSignal(
  fact = {},
) {
  const id = normalizeText(fact.id);

  if (!id.startsWith("day-master-season-")) {
    return null;
  }

  const text = [
    fact.name,
    fact.label,
    ...(Array.isArray(fact.tags)
      ? fact.tags
      : []),
  ]
    .map(normalizeText)
    .join("|");

  if (text.includes("失令")) {
    return createSimpleSignal(
      "day_master",
      "day_master:in_season:false",
      id,
    );
  }

  if (text.includes("得令")) {
    return createSimpleSignal(
      "day_master",
      "day_master:in_season:true",
      id,
    );
  }

  return null;
}

export function projectContractDayMasterSeasonSignal(
  fact = {},
) {
  if (
    fact.category !== "day_master" ||
    fact.predicate !== "in_season" ||
    typeof fact.value !== "boolean"
  ) {
    return null;
  }

  return createSimpleSignal(
    "day_master",
    `day_master:in_season:${fact.value}`,
    fact.id,
  );
}

export function projectLegacyDayMasterRootSignal(
  fact = {},
) {
  const id = normalizeText(fact.id);

  const match =
    /^day-master-root-(.+)$/.exec(id);

  if (!match) {
    return null;
  }

  const rootLevel = normalizeText(match[1]);

  if (!rootLevel) {
    return null;
  }

  return createSimpleSignal(
    "day_master",
    `day_master:root_level:${rootLevel}`,
    id,
  );
}

export function projectContractDayMasterRootSignal(
  fact = {},
) {
  if (
    fact.category !== "day_master" ||
    fact.predicate !== "root_level"
  ) {
    return null;
  }

  const rootLevel = normalizeText(fact.value);

  if (!rootLevel) {
    return null;
  }

  return createSimpleSignal(
    "day_master",
    `day_master:root_level:${rootLevel}`,
    fact.id,
  );
}

export function projectLegacyElementWeakSignal(
  fact = {},
) {
  const id = normalizeText(fact.id);

  const match =
    /^element-(wood|fire|earth|metal|water)-weak$/.exec(
      id,
    );

  if (!match) {
    return null;
  }

  return createSimpleSignal(
    "element",
    `element:weak:${match[1]}`,
    id,
  );
}

export function projectContractElementWeakSignal(
  fact = {},
) {
  if (
    fact.category !== "element" ||
    fact.predicate !== "element_count"
  ) {
    return null;
  }

  const element = normalizeText(
    fact.subject?.key,
  );

  const count = parseFiniteNumber(
    fact.value,
  );

  if (
    !validElementKeys.has(element) ||
    count === null ||
    count > 0.5
  ) {
    return null;
  }

  return createSimpleSignal(
    "element",
    `element:weak:${element}`,
    fact.id,
  );
}

export function projectLegacyTenGodGroupWeakSignal(
  fact = {},
) {
  const id = normalizeText(fact.id);

  const match =
    /^(output|wealth|officer|resource|peer)-weak-absent$/.exec(
      id,
    );

  if (!match) {
    return null;
  }

  return createSimpleSignal(
    "ten_god_group",
    `ten_god_group:weak:${match[1]}`,
    id,
  );
}

export function projectContractTenGodGroupWeakSignals(
  facts = [],
) {
  const countsByGroup = new Map();
  const sourceIdsByGroup = new Map();

  for (const fact of facts) {
    if (
      fact?.category !== "ten_god" ||
      fact?.predicate !== "ten_god_presence"
    ) {
      continue;
    }

    const tenGod = normalizeText(
      fact.value?.tenGod,
    );

    const count = parseFiniteNumber(
      fact.value?.weightedCount,
    );

    if (!tenGod || count === null) {
      continue;
    }

    for (const [group, members] of Object.entries(
      tenGodGroupMembers,
    )) {
      if (!members.includes(tenGod)) {
        continue;
      }

      countsByGroup.set(
        group,
        (countsByGroup.get(group) ?? 0) + count,
      );

      sourceIdsByGroup.set(
        group,
        uniqueSortedStrings([
          ...(sourceIdsByGroup.get(group) ?? []),
          fact.id,
        ]),
      );
    }
  }

  const signals = [];

  for (const group of Object.keys(
    tenGodGroupMembers,
  ).sort()) {
    const sourceIds =
      sourceIdsByGroup.get(group) ?? [];

    if (sourceIds.length === 0) {
      continue;
    }

    const weightedCount =
      countsByGroup.get(group) ?? 0;

    if (weightedCount > 0.4) {
      continue;
    }

    signals.push(createSimpleSignalFromIds(
      "ten_god_group",
      `ten_god_group:weak:${group}`,
      sourceIds,
      {
        weightedCount,
      },
    ));
  }

  return compactSignals(signals);
}

function collectContractTenGodPresenceSourceIds(
  facts = [],
) {
  const sourceIds = [];

  for (const fact of facts) {
    if (
      fact?.category !== "ten_god" ||
      fact?.predicate !== "ten_god_presence"
    ) {
      continue;
    }

    const tenGod = normalizeText(
      fact.value?.tenGod,
    );

    const count = parseFiniteNumber(
      fact.value?.weightedCount,
    );

    if (
      !tenGod ||
      count === null ||
      !Object.values(tenGodGroupMembers)
        .flat()
        .includes(tenGod)
    ) {
      continue;
    }

    sourceIds.push(fact.id);
  }

  return sourceIds;
}

export function projectLegacyRelationSignal(
  fact = {},
) {
  if (fact.category !== "干支关系") {
    return null;
  }

  return createRelationSignal({
    sourceId: fact.id,
    relationType: fact.relationType,
    layer: fact.layer,
    participants: fact.participants,
    formation: fact.formation,
    canTransform: fact.canTransform,
    transformed: fact.transformed,
  });
}

export function projectContractRelationSignal(
  fact = {},
) {
  if (
    fact.category !== "relation" ||
    fact.predicate !== "has_relation"
  ) {
    return null;
  }

  return createRelationSignal({
    sourceId: fact.id,
    relationType: fact.value?.relationType,
    layer: fact.value?.layer,
    participants: fact.value?.participants,
    formation: fact.value?.formation,
    canTransform: fact.value?.canTransform,
    transformed: fact.value?.transformed,
  });
}

export function projectLegacyRepetitionSignal(
  fact = {},
) {
  const id = normalizeText(fact.id);

  const pillarMatch =
    /^repetition-pillar-(year|month|day|hour)-(year|month|day|hour)-(.+)$/.exec(
      id,
    );

  if (pillarMatch) {
    const [, left, right, label] =
      pillarMatch;

    return createRepetitionSignal(
      "pillar",
      left,
      right,
      label,
      id,
    );
  }

  const branchMatch =
    /^repetition-branch-(year|month|day|hour)-(year|month|day|hour)-(.+)$/.exec(
      id,
    );

  if (!branchMatch) {
    return null;
  }

  const [, left, right, branch] =
    branchMatch;

  return createRepetitionSignal(
    "branch",
    left,
    right,
    branch,
    id,
  );
}

export function projectContractRepetitionSignals(
  facts = [],
) {
  const pillars = new Map();

  for (const fact of facts) {
    if (fact?.category !== "pillar") {
      continue;
    }

    const pillar = normalizeText(
      fact.subject?.key,
    );

    if (!validPillarKeys.has(pillar)) {
      continue;
    }

    if (
      fact.predicate !== "pillar_stem" &&
      fact.predicate !== "pillar_branch"
    ) {
      continue;
    }

    const current =
      pillars.get(pillar) ?? {
        stem: "",
        branch: "",
        sourceIds: [],
      };

    if (fact.predicate === "pillar_stem") {
      current.stem = normalizeText(fact.value);
    }

    if (fact.predicate === "pillar_branch") {
      current.branch = normalizeText(fact.value);
    }

    current.sourceIds = uniqueSortedStrings([
      ...current.sourceIds,
      fact.id,
    ]);

    pillars.set(pillar, current);
  }

  const signals = [];

  for (let leftIndex = 0;
    leftIndex < pillarOrder.length;
    leftIndex += 1) {
    for (let rightIndex = leftIndex + 1;
      rightIndex < pillarOrder.length;
      rightIndex += 1) {
      const left = pillarOrder[leftIndex];
      const right = pillarOrder[rightIndex];
      const leftPillar = pillars.get(left);
      const rightPillar = pillars.get(right);

      if (!leftPillar || !rightPillar) {
        continue;
      }

      const sourceIds = uniqueSortedStrings([
        ...leftPillar.sourceIds,
        ...rightPillar.sourceIds,
      ]);

      if (
        leftPillar.stem &&
        leftPillar.branch &&
        leftPillar.stem === rightPillar.stem &&
        leftPillar.branch === rightPillar.branch
      ) {
        signals.push(createRepetitionSignal(
          "pillar",
          left,
          right,
          `${leftPillar.stem}${leftPillar.branch}`,
          sourceIds,
        ));
      }

      if (
        leftPillar.branch &&
        leftPillar.branch === rightPillar.branch
      ) {
        signals.push(createRepetitionSignal(
          "branch",
          left,
          right,
          leftPillar.branch,
          sourceIds,
        ));
      }
    }
  }

  return compactSignals(signals);
}

function collectContractPillarIdentitySourceIds(
  facts = [],
) {
  const sourceIds = [];

  for (const fact of facts) {
    if (fact?.category !== "pillar") {
      continue;
    }

    const pillar = normalizeText(
      fact.subject?.key,
    );

    const value = normalizeText(fact.value);

    if (
      !validPillarKeys.has(pillar) ||
      !value ||
      (
        fact.predicate !== "pillar_stem" &&
        fact.predicate !== "pillar_branch"
      )
    ) {
      continue;
    }

    sourceIds.push(fact.id);
  }

  return sourceIds;
}

export function projectLegacyElementFlowSignal(
  fact = {},
) {
  const id = normalizeText(fact.id);

  const match = /^element-flow-(.+)$/.exec(
    id,
  );

  if (!match) {
    return null;
  }

  const canonicalValue =
    normalizeText(match[1]);

  if (!canonicalValue) {
    return null;
  }

  return createSimpleSignal(
    "element_flow",
    `element:flow_chain:${canonicalValue}`,
    id,
  );
}

export function projectContractElementFlowSignal(
  fact = {},
) {
  if (
    fact.category !== "element" ||
    fact.predicate !==
      "flow_chain_candidate"
  ) {
    return null;
  }

  const canonicalValue =
    canonicalizeFlowChainValue(fact.value);

  if (!canonicalValue) {
    return null;
  }

  return createSimpleSignal(
    "element_flow",
    `element:flow_chain:${canonicalValue}`,
    fact.id,
  );
}

function projectLegacyFactSignals(
  fact = {},
) {
  return compactSignals([
    projectLegacyStemTenGodSignal(fact),

    projectLegacyBranchMainTenGodSignal(
      fact,
    ),

    projectLegacyDayMasterSeasonSignal(
      fact,
    ),

    projectLegacyDayMasterRootSignal(
      fact,
    ),

    projectLegacyElementWeakSignal(fact),

    projectLegacyTenGodGroupWeakSignal(
      fact,
    ),

    projectLegacyRelationSignal(fact),

    projectLegacyRepetitionSignal(fact),

    projectLegacyElementFlowSignal(fact),
  ]);
}

function projectContractFactSignals(
  fact = {},
) {
  return compactSignals([
    projectContractStemTenGodSignal(fact),

    projectContractBranchMainTenGodSignal(
      fact,
    ),

    projectContractDayMasterSeasonSignal(
      fact,
    ),

    projectContractDayMasterRootSignal(
      fact,
    ),

    projectContractElementWeakSignal(
      fact,
    ),

    projectContractRelationSignal(fact),

    projectContractElementFlowSignal(
      fact,
    ),
  ]);
}

function buildSignalProjection(
  facts,
  projector,
  warnings,
  sourceLabel,
) {
  const signals = new Map();
  const unprojected = [];
  const projectedSourceIds = new Set();

  for (const fact of facts) {
    try {
      const projected = projector(fact);

      if (projected.length === 0) {
        unprojected.push(fact);
        continue;
      }

      for (const signal of projected) {
        mergeSignalIntoProjection(
          { signals, projectedSourceIds },
          signal,
        );
      }
    } catch (error) {
      warnings.push(
        `${sourceLabel} projection failed: ${
          error?.message ??
          "unknown error"
        }`,
      );

      unprojected.push(fact);
    }
  }

  return {
    signals,
    unprojected,
    projectedSourceIds,
  };
}

function mergeBatchSignals(
  projection,
  signals,
) {
  for (const signal of signals) {
    mergeSignalIntoProjection(
      projection,
      signal,
    );
  }
}

function markProjectedSourceIds(
  projection,
  sourceIds,
) {
  for (const sourceId of uniqueSortedStrings(
    sourceIds,
  )) {
    projection.projectedSourceIds.add(
      sourceId,
    );
  }
}

function mergeSignalIntoProjection(
  projection,
  signal,
) {
  if (
    !signal ||
    !signal.signalKey ||
    !signal.family
  ) {
    return;
  }

  const normalizedSignal = {
    ...signal,
    sourceIds: uniqueSortedStrings(
      signal.sourceIds ?? [],
    ),
  };

  const current =
    projection.signals.get(
      normalizedSignal.signalKey,
    );

  if (!current) {
    projection.signals.set(
      normalizedSignal.signalKey,
      normalizedSignal,
    );
  } else {
    current.sourceIds = uniqueSortedStrings([
      ...current.sourceIds,
      ...normalizedSignal.sourceIds,
    ]);

    mergeSignalMetadata(
      current,
      normalizedSignal,
    );
  }

  for (const sourceId of normalizedSignal.sourceIds) {
    projection.projectedSourceIds.add(
      sourceId,
    );
  }
}

function finalizeProjection(projection) {
  projection.unprojected =
    projection.unprojected.filter((fact) => {
      const id = normalizeText(fact?.id);

      return (
        !id ||
        !projection.projectedSourceIds.has(id)
      );
    });
}

function createTenGodPositionSignal(
  positionType,
  pillar,
  tenGod,
  sourceId,
) {
  const normalizedPositionType =
    normalizeText(positionType);

  const normalizedPillar =
    normalizeText(pillar);

  const normalizedTenGod =
    normalizeText(tenGod);

  if (
    !validPositionTypes.has(
      normalizedPositionType,
    ) ||
    !validPillarKeys.has(
      normalizedPillar,
    ) ||
    !normalizedTenGod ||
    normalizedTenGod === "日主"
  ) {
    return null;
  }

  return createSimpleSignal(
    "ten_god_position",
    `ten_god_position:${normalizedPositionType}:${normalizedPillar}:${normalizedTenGod}`,
    sourceId,
  );
}

function createSimpleSignal(
  family,
  signalKey,
  sourceId,
  metadata = {},
) {
  return createSimpleSignalFromIds(
    family,
    signalKey,
    normalizeText(sourceId)
      ? [sourceId]
      : [],
    metadata,
  );
}

function createSimpleSignalFromIds(
  family,
  signalKey,
  sourceIds,
  metadata = {},
) {
  const normalizedFamily =
    normalizeText(family);

  const normalizedSignalKey =
    normalizeText(signalKey);

  if (
    !normalizedFamily ||
    !normalizedSignalKey
  ) {
    return null;
  }

  return {
    family: normalizedFamily,
    signalKey: normalizedSignalKey,

    sourceIds: uniqueSortedStrings(
      sourceIds,
    ),

    ...normalizeSignalMetadata(metadata),
  };
}

function createRelationSignal({
  sourceId,
  relationType,
  layer,
  participants,
  formation,
  canTransform,
  transformed,
} = {}) {
  const normalizedLayer =
    normalizeText(layer);

  const normalizedRelationType =
    normalizeText(relationType);

  const participantsKey =
    createParticipantsKey(participants);

  if (
    !normalizedLayer ||
    !normalizedRelationType ||
    !participantsKey
  ) {
    return null;
  }

  return createSimpleSignal(
    "relation",
    `relation:${normalizedLayer}:${normalizedRelationType}:${participantsKey}`,
    sourceId,
    {
      formation: normalizeText(formation),
      canTransform:
        typeof canTransform === "boolean"
          ? canTransform
          : undefined,
      transformed:
        typeof transformed === "boolean"
          ? transformed
          : undefined,
    },
  );
}

function createRepetitionSignal(
  type,
  left,
  right,
  value,
  sourceIdOrIds,
) {
  const normalizedType =
    normalizeText(type);

  const normalizedLeft =
    normalizeText(left);

  const normalizedRight =
    normalizeText(right);

  const normalizedValue =
    normalizeText(value);

  if (
    !["pillar", "branch"].includes(
      normalizedType,
    ) ||
    !validPillarKeys.has(normalizedLeft) ||
    !validPillarKeys.has(normalizedRight) ||
    !normalizedValue
  ) {
    return null;
  }

  const ordered = orderPillarPair(
    normalizedLeft,
    normalizedRight,
  );

  if (!ordered) {
    return null;
  }

  const sourceIds = Array.isArray(
    sourceIdOrIds,
  )
    ? sourceIdOrIds
    : [sourceIdOrIds];

  return createSimpleSignalFromIds(
    "repetition",
    `repetition:${normalizedType}:${ordered[0]}:${ordered[1]}:${normalizedValue}`,
    sourceIds,
  );
}

function createParticipantsKey(
  participants,
) {
  if (!Array.isArray(participants)) {
    return "";
  }

  const participantKeys = participants
    .map((participant) => {
      const pillar = normalizeText(
        participant?.pillar,
      );

      const position = normalizeText(
        participant?.position,
      );

      const value = normalizeText(
        participant?.value,
      );

      if (
        !pillar ||
        !position ||
        !value
      ) {
        return "";
      }

      return `${pillar}|${position}|${value}`;
    })
    .filter(Boolean)
    .sort();

  return participantKeys.join(",");
}

function orderPillarPair(left, right) {
  const leftIndex =
    pillarOrder.indexOf(left);

  const rightIndex =
    pillarOrder.indexOf(right);

  if (
    leftIndex < 0 ||
    rightIndex < 0 ||
    leftIndex === rightIndex
  ) {
    return null;
  }

  return leftIndex < rightIndex
    ? [left, right]
    : [right, left];
}

function canonicalizeFlowChainValue(
  value,
) {
  if (typeof value === "string") {
    return value.trim();
  }

  if (
    value &&
    typeof value === "object"
  ) {
    return stableSerialize(value);
  }

  return "";
}

function stableSerialize(value) {
  const seen = new WeakSet();

  function serialize(item) {
    if (item === null) {
      return "null";
    }

    if (Array.isArray(item)) {
      return `[${item.map(serialize).join(",")}]`;
    }

    if (typeof item === "object") {
      if (seen.has(item)) {
        return "";
      }

      seen.add(item);

      const entries = Object.keys(item)
        .sort()
        .map((key) => {
          const serializedValue = serialize(
            item[key],
          );

          if (!serializedValue) {
            return "";
          }

          return `${JSON.stringify(key)}:${serializedValue}`;
        })
        .filter(Boolean);

      seen.delete(item);

      return `{${entries.join(",")}}`;
    }

    if (
      ["string", "number", "boolean"].includes(
        typeof item,
      )
    ) {
      return JSON.stringify(item);
    }

    return "";
  }

  return serialize(value);
}

function createComparisonItem({
  family,
  signalKey,
  legacyFactIds = [],
  contractFactIds = [],
  legacySignal,
  contractSignal,
}) {
  const item = {
    family,
    signalKey,
  };

  if (legacyFactIds.length > 0) {
    item.legacyFactIds =
      uniqueSortedStrings(legacyFactIds);
  }

  if (contractFactIds.length > 0) {
    item.contractFactIds =
      uniqueSortedStrings(contractFactIds);
  }

  mergeSignalMetadata(item, legacySignal);
  mergeSignalMetadata(item, contractSignal);

  return item;
}

function mergeSignalMetadata(target, source) {
  if (!target || !source) {
    return;
  }

  for (const key of [
    "formation",
    "canTransform",
    "transformed",
    "weightedCount",
  ]) {
    if (
      source[key] !== undefined &&
      target[key] === undefined
    ) {
      target[key] = source[key];
    }
  }
}

function normalizeSignalMetadata(
  metadata,
) {
  const normalized = {};

  for (const [key, value] of Object.entries(
    metadata,
  )) {
    if (value === undefined) {
      continue;
    }

    if (typeof value === "string") {
      const text = normalizeText(value);

      if (text) {
        normalized[key] = text;
      }

      continue;
    }

    if (
      typeof value === "number" &&
      Number.isFinite(value)
    ) {
      normalized[key] = value;
      continue;
    }

    if (typeof value === "boolean") {
      normalized[key] = value;
    }
  }

  return normalized;
}

function buildSummaryByFamily({
  legacyProjection,
  matched,
  missingComparable,
  contractOnly,
}) {
  const summary = {};

  for (const signal of legacyProjection.signals.values()) {
    ensureFamilySummary(
      summary,
      signal.family,
    ).legacyComparable += 1;
  }

  for (const item of matched) {
    ensureFamilySummary(
      summary,
      item.family,
    ).matched += 1;
  }

  for (const item of missingComparable) {
    ensureFamilySummary(
      summary,
      item.family,
    ).missing += 1;
  }

  for (const item of contractOnly) {
    ensureFamilySummary(
      summary,
      item.family,
    ).contractOnly += 1;
  }

  return Object.fromEntries(
    Object.entries(summary).sort(
      ([left], [right]) =>
        left.localeCompare(right),
    ),
  );
}

function ensureFamilySummary(
  summary,
  family,
) {
  if (!summary[family]) {
    summary[family] = {
      legacyComparable: 0,
      matched: 0,
      missing: 0,
      contractOnly: 0,
    };
  }

  return summary[family];
}

function buildUnmatchedContractFacts(
  facts,
) {
  return facts.map((fact) => ({
    contractFactId: normalizeText(
      fact?.id,
    ),
    category: normalizeText(
      fact?.category,
    ),
    predicate: normalizeText(
      fact?.predicate,
    ),
    reason: classifyUnmatchedContractFact(
      fact ?? {},
    ),
  }));
}

function classifyUnmatchedContractFact(
  fact = {},
) {
  const category = normalizeText(
    fact.category,
  );

  const predicate = normalizeText(
    fact.predicate,
  );

  if (
    category === "work_chain" ||
    category === "conflict" ||
    predicate === "flow_chain_candidate"
  ) {
    return "candidate_not_comparable_yet";
  }

  if (
    contractOnlyNewCapabilityCategories.has(
      category,
    )
  ) {
    return "contract_only_new_capability";
  }

  return "unsupported_contract_shape";
}

function compareUnmatchedContractFacts(
  left,
  right,
) {
  return (
    left.reason.localeCompare(right.reason) ||
    left.category.localeCompare(right.category) ||
    left.predicate.localeCompare(right.predicate) ||
    left.contractFactId.localeCompare(
      right.contractFactId,
    )
  );
}

function classifyUncomparedLegacyFact(
  fact = {},
) {
  const category = normalizeText(
    fact.category,
  );

  if (category === "神煞辅助") {
    return "shensha_not_in_contract_v1";
  }

  if (
    category === "组合结构" ||
    fact.factLevel === "pattern"
  ) {
    return "interpretive_rule_waiting_for_composition";
  }

  return "unsupported_legacy_shape";
}

function compactSignals(items) {
  return items.filter(Boolean);
}

function uniqueSortedStrings(items) {
  return [
    ...new Set(
      items
        .map(normalizeText)
        .filter(Boolean),
    ),
  ].sort();
}

function compareSignalItems(left, right) {
  return (
    left.family.localeCompare(
      right.family,
    ) ||
    left.signalKey.localeCompare(
      right.signalKey,
    )
  );
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

function clampCoverageRate(value) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(
    1,
    Math.max(0, value),
  );
}

function normalizeText(value) {
  return typeof value === "string"
    ? value.trim()
    : "";
}
