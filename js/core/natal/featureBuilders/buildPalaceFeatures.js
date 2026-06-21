const pillarKeys = ["year", "month", "day", "hour"];
const pillarLabels = {
  year: "年柱",
  month: "月柱",
  day: "日柱",
  hour: "时柱",
};

const PALACE_THEMES = {
  year: [
    "祖上与早年环境",
    "家族外缘",
    "早期社会背景",
  ],

  month: [
    "父母家庭环境",
    "成长与工作环境",
    "同辈和社会入口",
  ],

  day: [
    "命主自身",
    "日常生活",
    "亲密关系宫位",
  ],

  hour: [
    "子女与晚辈",
    "作品和结果",
    "后期发展",
  ],
};

export function buildPalaceFeatures({
  pillars,
  relationMatrix,
  tenGodStates,
} = {}) {
  const safePillars = pillars ?? {};
  const safeRelations = Array.isArray(relationMatrix?.items)
    ? relationMatrix.items
    : [];
  const safeTenGodStates = tenGodStates ?? {};

  const features = Object.fromEntries(
    pillarKeys.map((key) => [
      key,
      buildPillarPalace({
        key,
        pillar: safePillars[key] ?? {},
        relations: safeRelations,
        tenGodStates: safeTenGodStates,
      }),
    ]),
  );

  return {
    ...features,
    spousePalace: buildSpousePalace({
      pillar: safePillars.day ?? {},
      relations: Array.isArray(relationMatrix?.dayBranchRelations)
        ? relationMatrix.dayBranchRelations
        : [],
      tenGodStates: safeTenGodStates,
    }),
  };
}

function buildPillarPalace({
  key,
  pillar,
  relations,
  tenGodStates,
}) {
  const stemRelationIds = unique(
    relations
      .filter((relation) => hasParticipant(relation, key, "stem"))
      .map((relation) => relation.id),
  );
  const branchRelationIds = unique(
    relations
      .filter((relation) => hasParticipant(relation, key, "branch"))
      .map((relation) => relation.id),
  );
  const relationIds = unique([
    ...stemRelationIds,
    ...branchRelationIds,
  ]);
  const relatedRelations = relations.filter((relation) =>
    relationIds.includes(relation.id),
  );
  const hiddenTenGods = (Array.isArray(pillar.hiddenStems)
    ? pillar.hiddenStems
    : [])
    .map((item) => item?.tenGod)
    .filter(Boolean);

  return {
    key,
    label: pillarLabels[key] ?? "",

    stem: pillar.stem ?? "",
    branch: pillar.branch ?? "",
    pillarLabel: pillar.label ?? "",

    stemTenGod: pillar.stemTenGod ?? "",
    branchMainTenGod: pillar.branchMainTenGod ?? "",
    hiddenTenGods,

    visibleTenGodState: stateFor(tenGodStates, pillar.stemTenGod),
    mainQiTenGodState: stateFor(tenGodStates, pillar.branchMainTenGod),
    hiddenTenGodStates: hiddenTenGods
      .map((name) => stateFor(tenGodStates, name))
      .filter(Boolean),

    relationIds,
    stemRelationIds,
    branchRelationIds,

    relationSummary: summarizeRelations(relatedRelations),

    isDayPillar: key === "day",
    isMonthCommandPillar: key === "month",

    traditionalThemes: PALACE_THEMES[key] ?? [],
    evidence: buildPillarEvidence(key, pillar),
    warnings: [],
  };
}

function buildSpousePalace({
  pillar,
  relations,
  tenGodStates,
}) {
  const dayBranchRelations = uniqueById(
    relations.filter((relation) => hasParticipant(relation, "day", "branch")),
  );
  const relationIds = dayBranchRelations.map((relation) => relation.id);
  const relationTypes = unique(dayBranchRelations.map((relation) => relation.relationType));
  const hiddenTenGods = (Array.isArray(pillar.hiddenStems)
    ? pillar.hiddenStems
    : [])
    .map((item) => item?.tenGod)
    .filter(Boolean);

  return {
    key: "spousePalace",
    label: "夫妻宫",

    pillar: "day",
    position: "branch",

    branch: pillar.branch ?? "",
    mainTenGod: pillar.branchMainTenGod ?? "",
    hiddenTenGods,

    mainTenGodState: stateFor(tenGodStates, pillar.branchMainTenGod),
    hiddenTenGodStates: hiddenTenGods
      .map((name) => stateFor(tenGodStates, name))
      .filter(Boolean),

    relationIds,
    relationTypes,

    hasCombine: relationTypes.some((type) => type === "branch_combine"),
    hasClash: relationTypes.some((type) => type === "branch_clash"),
    hasPunish: relationTypes.some((type) => type === "branch_punish"),
    hasSelfPunish: relationTypes.some((type) => type === "branch_self_punish"),
    hasHarm: relationTypes.some((type) => type === "branch_harm"),
    hasBreak: relationTypes.some((type) => type === "branch_break"),
    hasHarmony: relationTypes.some(isHarmonyType),
    hasRepetition: relationTypes.some((type) => type === "repetition"),

    evidence: [
      {
        type: "palace",
        position: "day.branch",
        text: `日支${pillar.branch ?? ""}作为夫妻宫结构位`,
      },
      ...dayBranchRelations.map((relation) => relationEvidence(relation)),
    ],
    warnings: [],
  };
}

function summarizeRelations(relations) {
  const summary = {
    combineCount: 0,
    clashCount: 0,
    punishCount: 0,
    harmCount: 0,
    breakCount: 0,
    controlCount: 0,
    repetitionCount: 0,
    harmonyCount: 0,
  };

  for (const relation of uniqueById(relations)) {
    const type = relation.relationType;
    if (isCombineType(type)) summary.combineCount += 1;
    if (isHarmonyType(type)) summary.harmonyCount += 1;
    if (type === "stem_clash" || type === "branch_clash") summary.clashCount += 1;
    if (type === "branch_punish" || type === "branch_self_punish") summary.punishCount += 1;
    if (type === "branch_harm") summary.harmCount += 1;
    if (type === "branch_break") summary.breakCount += 1;
    if (type === "stem_control") summary.controlCount += 1;
    if (type === "repetition") summary.repetitionCount += 1;
  }

  return summary;
}

function isCombineType(type) {
  return [
    "stem_combine",
    "branch_combine",
    "three_harmony",
    "three_meeting",
    "half_harmony",
    "arch_harmony",
  ].includes(type);
}

function isHarmonyType(type) {
  return [
    "three_harmony",
    "three_meeting",
    "half_harmony",
    "arch_harmony",
  ].includes(type);
}

function hasParticipant(relation, pillar, position) {
  return (relation?.participants ?? relation?.members ?? []).some((participant) =>
    participant?.pillar === pillar &&
    participant?.position === position,
  );
}

function stateFor(tenGodStates, name) {
  return name && tenGodStates?.[name] ? tenGodStates[name] : null;
}

function buildPillarEvidence(key, pillar) {
  const label = pillarLabels[key] ?? "";
  return [
    {
      type: "palace",
      position: key,
      text: `${label}${pillar.label ?? ""}作为传统宫位结构位`,
    },
  ];
}

function relationEvidence(relation) {
  return {
    type: "relation",
    id: relation.id,
    relationType: relation.relationType,
    text: `${relation.relationType || "unknown"} 参与日支夫妻宫`,
  };
}

function unique(items = []) {
  return [...new Set(items.filter((item) => item !== undefined && item !== null && item !== ""))];
}

function uniqueById(items = []) {
  const seen = new Set();
  const result = [];
  for (const item of items) {
    const id = item?.id;
    if (!id || seen.has(id)) continue;
    seen.add(id);
    result.push(item);
  }
  return result;
}
