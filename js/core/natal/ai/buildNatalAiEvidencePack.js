export const NATAL_AI_EVIDENCE_PACK_VERSION =
  "natal-ai-evidence-pack-v1";

export const NATAL_DEEP_ANALYSIS_PACK_VERSION =
  "bazi-deep-analysis-pack-v1";

const MAX_FACTS = 120;
const MAX_COMPOSITIONS = 48;
const MAX_WORK_CHAINS = 32;

const boundaries = [
  "本数据包只用于出生原局深度分析。",
  "排盘、十神、旺衰、干支关系和结构状态以本地引擎为准。",
  "AI不得重新排盘，不得增加数据包之外的命理事实。",
  "AI应尽量讲全有充分依据的重要内容，不因固定字数省略关键结构。",
  "同一事实不得重复包装成多个独立结论。",
  "confirmed可作为明确结构使用。",
  "structurally_supported可作为明显倾向使用。",
  "conditional必须说明成立条件。",
  "candidate只能作为观察线索。",
  "不得混入大运、流年和流月判断。",
  "健康内容只作传统体质与生活节奏倾向，不构成医学诊断。",
  "不得给出确定性的法律、投资、死亡、疾病或灾祸结论。",
];

const statusRank = {
  activated: 8,
  confirmed: 7,
  structurally_supported: 6,
  connected: 5,
  conditional: 4,
  candidate: 3,
  presence_only: 2,
  weak: 1,
  unknown: 0,
};

const confidenceRank = {
  high: 3,
  medium: 2,
  low: 1,
  unknown: 0,
};

const roleRank = {
  core: 7,
  main: 6,
  tension: 5,
  support: 4,
  resource: 3,
  conditional: 2,
  candidate: 1,
};

export function buildNatalAiEvidencePack({
  chart = {},
  featureVector = {},
  structureSynopsis = {},
  professionalContext = {},
  professionalPatterns = {},
  contractFacts = [],
  compositionImages = [],
  hitList = {},
  twelveDomains = [],
  masterSummary = {},
  scope = "natal",
} = {}) {
  const warnings = [];

  const normalizedScope =
    normalizeText(scope) ||
    "natal";

  const professionalImageIds =
    new Set(
      normalizeObjects(
        professionalPatterns.images,
        "professionalPatterns.images",
        warnings,
        {
          optional: true,
        },
      )
        .map(
          (image) =>
            normalizeText(image.id),
        )
        .filter(Boolean),
    );

  const facts =
    normalizeObjects(
      contractFacts,
      "contractFacts",
      warnings,
    )
      .filter(isUsefulFact)
      .sort(compareFactsForAi)
      .slice(0, MAX_FACTS)
      .map(compactFact);

  const compositions =
    normalizeObjects(
      compositionImages,
      "compositionImages",
      warnings,
    )
      .map(
        (image) =>
          compactComposition(
            image,
            professionalImageIds,
          ),
      )
      .filter(
        (image) =>
          image.id,
      )
      .sort(compareCompositionsForAi)
      .slice(
        0,
        MAX_COMPOSITIONS,
      );

  const domains =
    normalizeObjects(
      twelveDomains,
      "twelveDomains",
      warnings,
    )
      .map(compactDomain)
      .filter(
        (domain) =>
          domain.key,
      )
      .sort(
        (left, right) =>
          left.key.localeCompare(
            right.key,
          ),
      );

  const selectionHints =
    buildSelectionHints({
      masterSummary,
      professionalPatterns,
      compositions,
    });

  const domainEvidenceMap =
    buildDomainEvidenceMap(
      domains,
    );

  const professionalPatternIds =
    uniqueSortedStrings(
      compositions
        .filter(
          (image) =>
            image.sourceLayer ===
            "professional_pattern",
        )
        .map(
          (image) =>
            image.id,
        ),
    );

  const structuralCompositionIds =
    uniqueSortedStrings(
      compositions
        .filter(
          (image) =>
            image.sourceLayer !==
            "professional_pattern",
        )
        .map(
          (image) =>
            image.id,
        ),
    );

  return {
    /*
     * 兼容已有测试与调用方。
     */
    version:
      NATAL_AI_EVIDENCE_PACK_VERSION,

    contractVersion:
      NATAL_DEEP_ANALYSIS_PACK_VERSION,

    scope:
      normalizedScope,

    task: {
      type:
        "natal_deep_analysis",

      language:
        "zh-CN",

      audienceMode:
        "general_with_professional_evidence",

      interactionMode:
        "one_click_report",

      allowQuestions:
        false,
    },

    chartSummary:
      buildChartSummary(
        chart,
        featureVector,
      ),

    dayMasterSummary:
      buildDayMasterSummary(
        featureVector,
        chart,
      ),

    natalBaseline:
      buildNatalBaseline({
        featureVector,
        structureSynopsis,
      }),

    facts,

    /*
     * 这里保留所有正式组合象，
     * sourceLayer用于区分高阶专业结构
     * 与普通合同组合结构。
     */
    compositions,

    professionalPatternIds,

    structuralCompositionIds,

    workChains:
      compactWorkChains(
        featureVector.workChains,
      ),

    arbitration:
      compactArbitration(
        professionalPatterns,
      ),

    /*
     * 只保留选择器的ID结果，
     * 不把总批文字当作AI答案。
     */
    selectionHints,

    /*
     * domains保留兼容字段，
     * domainEvidenceMap是AI真正使用的路由数据。
     */
    domains,

    domainEvidenceMap,

    /*
     * masterSummary不再作为结论文案，
     * 这里只保留弱提示和选择索引。
     */
    masterSummary:
      compactMasterSelection(
        masterSummary,
      ),

    hitListSummary:
      compactHitListSummary(
        hitList,
      ),

    allowedFactIds:
      uniqueSortedStrings(
        facts.map(
          (fact) =>
            fact.id,
        ),
      ),

    allowedPatternIds:
      professionalPatternIds,

    allowedCompositionIds:
      uniqueSortedStrings(
        compositions.map(
          (image) =>
            image.id,
        ),
      ),

    allowedDomainKeys:
      uniqueSortedStrings(
        domains.map(
          (domain) =>
            domain.key,
        ),
      ),

    boundaries,

    warnings:
      uniqueSortedStrings(
        warnings,
      ),
  };
}

function compactFact(
  fact,
) {
  return deepClean({
    id:
      normalizeText(fact.id),

    category:
      normalizeText(
        fact.category,
      ),

    predicate:
      normalizeText(
        fact.predicate,
      ),

    name:
      firstText(
        fact.name,
        fact.label,
      ),

    statement:
      firstText(
        fact.brief,
        fact.meaning,
        fact.text,
        fact.description,
      ),

    subject:
      compactUnknown(
        fact.subject,
      ),

    value:
      compactUnknown(
        fact.value,
      ),

    role:
      normalizeText(fact.role),

    status:
      normalizeText(
        fact.status,
      ),

    polarity:
      normalizeText(
        fact.polarity,
      ),

    confidence:
      normalizeText(
        fact.confidence,
      ) ||
      "unknown",

    importance:
      normalizeText(
        fact.importance,
      ),

    score:
      finiteOrNull(
        fact.score,
      ),

    semanticGroup:
      normalizeText(
        fact.semanticGroup,
      ),

    domains:
      uniqueStrings(
        fact.domains,
      ),

    tags:
      uniqueStrings(
        fact.tags,
      ),

    sourceRuleId:
      normalizeText(
        fact.sourceRuleId,
      ),

    source:
      uniqueSortedStrings(
        (
          fact.sourceRefs ??
          []
        ).map(
          (ref) =>
            ref.featureGroup,
        ),
      ),
  });
}

function compactComposition(
  image,
  professionalImageIds,
) {
  const id =
    normalizeText(image.id);

  const ruleId =
    normalizeText(
      image.ruleId,
    );

  const isProfessional =
    professionalImageIds.has(id) ||
    ruleId.startsWith(
      "professional_",
    );

  return deepClean({
    id,

    ruleId,

    sourceLayer:
      isProfessional
        ? "professional_pattern"
        : "contract_composition",

    title:
      firstText(
        image.title,
        image.name,
        image.label,
      ),

    brief:
      firstText(
        image.brief,
        image.summary,
      ),

    formation:
      firstText(
        image.formation,
        image.meaning,
        image.judgement,
      ),

    semanticGroup:
      normalizeText(
        image.semanticGroup,
      ),

    role:
      normalizeText(
        image.role,
      ),

    status:
      normalizeText(
        image.status,
      ) ||
      "candidate",

    workStatus:
      normalizeText(
        image.workStatus,
      ),

    importance:
      normalizeText(
        image.importance,
      ),

    polarity:
      normalizeText(
        image.polarity,
      ),

    confidence:
      normalizeText(
        image.confidence,
      ) ||
      "unknown",

    domains:
      uniqueStrings(
        image.domains,
      ),

    manifestations:
      normalizeTextList(
        image.manifestations ??
        image.realityImages ??
        image.images ??
        image.image,
      ),

    strengths:
      normalizeTextList(
        image.strengths,
      ),

    risks:
      normalizeTextList(
        image.risks ??
        image.pressures,
      ),

    conditions:
      normalizeTextList(
        image.conditions ??
        image.condition,
      ),

    counterEvidence:
      normalizeTextList(
        image.counterEvidence ??
        image.boundary,
      ),

    supportingEvidence:
      normalizeTextList(
        image.supportingEvidence ??
        image.evidence,
      ),

    weakeningEvidence:
      normalizeTextList(
        image.weakeningEvidence,
      ),

    blockingEvidence:
      normalizeTextList(
        image.blockingEvidence,
      ),

    workPath:
      compactWorkPath(
        image.workPath ??
        image.workRoute ??
        image.route,
      ),

    matchedFactIds:
      uniqueSortedStrings(
        image.matchedFactIds,
      ),

    counterFactIds:
      uniqueSortedStrings(
        image.counterFactIds,
      ),
  });
}

function compactWorkPath(
  path,
) {
  if (
    !path ||
    typeof path !== "object" ||
    Array.isArray(path)
  ) {
    return null;
  }

  return deepClean({
    chainId:
      normalizeText(
        path.chainId ??
        path.id,
      ),

    startTenGod:
      normalizeText(
        path.startTenGod,
      ),

    endTenGod:
      normalizeText(
        path.endTenGod,
      ),

    nodeTenGods:
      uniqueStrings(
        path.nodeTenGods,
      ),

    activationLevel:
      normalizeText(
        path.activationLevel,
      ),

    confidence:
      normalizeText(
        path.confidence,
      ),

    hiddenNodeCount:
      finiteOrNull(
        path.hiddenNodeCount,
      ),

    priorityScore:
      finiteOrNull(
        path.priorityScore,
      ),

    evidenceText:
      normalizeText(
        path.evidenceText,
      ),

    nodeIds:
      uniqueStrings(
        path.nodeIds,
      ),

    edgeIds:
      uniqueStrings(
        path.edgeIds,
      ),
  });
}

function compactDomain(
  domain,
) {
  return deepClean({
    key:
      normalizeText(
        domain.key,
      ),

    label:
      firstText(
        domain.label,
        domain.title,
      ),

    confidence:
      normalizeText(
        domain.confidence,
      ),

    evidenceFactIds:
      uniqueSortedStrings(
        domain.evidenceFactIds,
      ),

    compositionImageIds:
      uniqueSortedStrings(
        domain.compositionImageIds,
      ),

    compositionRuleIds:
      uniqueSortedStrings(
        domain.compositionRuleIds,
      ),
  });
}

function buildDomainEvidenceMap(
  domains,
) {
  return Object.fromEntries(
    domains.map(
      (domain) => [
        domain.key,
        {
          label:
            domain.label,

          confidence:
            domain.confidence,

          factIds:
            domain.evidenceFactIds ??
            [],

          patternIds:
            domain.compositionImageIds ??
            [],

          ruleIds:
            domain.compositionRuleIds ??
            [],
        },
      ],
    ),
  );
}

function buildSelectionHints({
  masterSummary,
  professionalPatterns,
  compositions,
}) {
  const primaryPatternIds =
    uniqueSortedStrings([
      professionalPatterns
        ?.primaryImage?.id,

      ...(
        masterSummary
          ?.compositionImageIds ??
        []
      ).slice(0, 1),
    ]);

  const supportingPatternIds =
    uniqueSortedStrings([
      ...normalizeIdList(
        professionalPatterns
          ?.secondaryImages,
      ),

      ...(
        masterSummary
          ?.compositionImageIds ??
        []
      ).filter(
        (id) =>
          !primaryPatternIds.includes(
            id,
          ),
      ),
    ]);

  const tensionPatternIds =
    uniqueSortedStrings([
      ...normalizeIdList(
        professionalPatterns
          ?.byRole?.tension,
      ),

      ...compositions
        .filter(
          (item) =>
            item.role ===
              "tension" ||
            item.polarity ===
              "negative",
        )
        .map(
          (item) =>
            item.id,
        ),
    ]);

  const conditionalPatternIds =
    uniqueSortedStrings(
      compositions
        .filter(
          (item) =>
            [
              "conditional",
              "candidate",
              "connected",
              "presence_only",
            ].includes(
              item.status,
            ) ||
            [
              "connected",
              "presence_only",
            ].includes(
              item.workStatus,
            ),
        )
        .map(
          (item) =>
            item.id,
        ),
    );

  return {
    hintStrength:
      "weak",

    source:
      "local_selector",

    primaryPatternIds,

    supportingPatternIds,

    tensionPatternIds,

    conditionalPatternIds,

    selectedFactIds:
      uniqueSortedStrings(
        masterSummary
          ?.evidenceFactIds,
      ),

    conditionalFactIds:
      uniqueSortedStrings(
        masterSummary
          ?.conditionalFactIds,
      ),
  };
}

function compactMasterSelection(
  summary,
) {
  return deepClean({
    version:
      normalizeText(
        summary.version,
      ),

    scope:
      normalizeText(
        summary.scope,
      ),

    confidence:
      normalizeText(
        summary.confidence,
      ),

    selectedFactIds:
      uniqueSortedStrings(
        summary.evidenceFactIds,
      ),

    conditionalFactIds:
      uniqueSortedStrings(
        summary.conditionalFactIds,
      ),

    selectedCompositionIds:
      uniqueSortedStrings(
        summary.compositionImageIds,
      ),

    domainKeys:
      uniqueSortedStrings(
        summary.domainKeys,
      ),

    selectionTrace:
      compactUnknown(
        summary.selectionDebug
          ?.selectionTrace ??
        summary.selectionDebug
          ?.selected,
      ),
  });
}

function compactArbitration(
  professionalPatterns,
) {
  return deepClean({
    primaryPatternId:
      normalizeText(
        professionalPatterns
          ?.primaryImage?.id,
      ),

    suppressedPatternIds:
      normalizeIdList(
        professionalPatterns
          ?.suppressedPatterns,
      ),

    decisions:
      (
        Array.isArray(
          professionalPatterns
            ?.controlArbitration,
        )
          ? professionalPatterns
              .controlArbitration
          : []
      )
        .map(compactDecision)
        .filter(Boolean),
  });
}

function compactDecision(
  decision,
) {
  if (
    !decision ||
    typeof decision !==
      "object"
  ) {
    return null;
  }

  return deepClean({
    semanticGroup:
      firstText(
        decision.semanticGroup,
        decision.group,
      ),

    keptPatternId:
      firstText(
        decision.keptImageId,
        decision.winnerId,
        decision.primaryImageId,
      ),

    suppressedPatternId:
      firstText(
        decision.suppressedImageId,
        decision.loserId,
      ),

    action:
      firstText(
        decision.action,
        decision.decision,
      ),

    reason:
      firstText(
        decision.reason,
        decision.code,
      ),
  });
}

function buildNatalBaseline({
  featureVector,
  structureSynopsis,
}) {
  return deepClean({
    dayMaster:
      structureSynopsis
        .dayMaster ??
      buildDayMasterSummary(
        featureVector,
        {},
      ),

    monthCommand:
      structureSynopsis
        .monthCommand,

    elements: {
      counts:
        structureSynopsis
          .elements?.counts ??
        featureVector
          .elements?.counts,

      dominant:
        structureSynopsis
          .elements?.dominant ??
        featureVector
          .elements?.dominant,

      weakest:
        structureSynopsis
          .elements?.weakest ??
        featureVector
          .elements?.weakest,

      biasLevel:
        featureVector
          .elements?.biasLevel,
    },

    tenGods: {
      groups:
        structureSynopsis
          .tenGods?.groups,

      dominantGroups:
        structureSynopsis
          .tenGods
          ?.dominantGroups ??
        featureVector
          .tenGods
          ?.dominantGroups,

      weakGroups:
        structureSynopsis
          .tenGods
          ?.weakGroups ??
        featureVector
          .tenGods
          ?.weakGroups,
    },

    repetition:
      structureSynopsis
        .repetition,

    climate: {
      tendencies:
        structureSynopsis
          .climate
          ?.tendencies,

      priorityNeeds:
        structureSynopsis
          .climate
          ?.priorityNeeds,
    },

    relativeElements:
      structureSynopsis
        .relativeElements,

    balance:
      structureSynopsis
        .balance,

    confidence:
      structureSynopsis
        .confidence,
  });
}

function compactWorkChains(
  workChains,
) {
  const chains =
    Array.isArray(
      workChains?.chains,
    )
      ? workChains.chains
      : [];

  return deepClean({
    version:
      normalizeText(
        workChains?.version,
      ),

    chains:
      chains
        .slice(
          0,
          MAX_WORK_CHAINS,
        )
        .map(
          (chain) =>
            deepClean({
              id:
                normalizeText(
                  chain.id,
                ),

              nodeIds:
                uniqueStrings(
                  chain.nodeIds,
                ),

              edgeIds:
                uniqueStrings(
                  chain.edgeIds,
                ),

              activationLevel:
                normalizeText(
                  chain.activationLevel,
                ),

              confidence:
                normalizeText(
                  chain.confidence,
                ),

              hiddenNodeCount:
                finiteOrNull(
                  chain.hiddenNodeCount,
                ),

              priorityScore:
                finiteOrNull(
                  chain.priorityScore,
                ),
            }),
        ),

    interruptionCount:
      Array.isArray(
        workChains
          ?.interruptionSignals,
      )
        ? workChains
            .interruptionSignals
            .length
        : 0,
  });
}

function compactHitListSummary(
  hitList,
) {
  const rows =
    Array.isArray(
      hitList?.all,
    )
      ? hitList.all
      : [];

  return {
    scope:
      normalizeText(
        hitList?.scope,
      ),

    count:
      rows.length,

    featuredIds:
      normalizeIdList(
        hitList?.featured,
      ),

    ruleIds:
      uniqueSortedStrings(
        rows.map(
          (row) =>
            row.sourceRuleId,
        ),
      ),
  };
}

function buildChartSummary(
  chart,
  featureVector,
) {
  const chartPillars =
    chart?.pillars ??
    {};

  const featurePillars =
    featureVector?.pillars ??
    {};

  const pillars =
    Object.fromEntries(
      [
        "year",
        "month",
        "day",
        "hour",
      ].map(
        (key) => {
          const chartPillar =
            chartPillars[key] ??
            {};

          const featurePillar =
            featurePillars[key] ??
            {};

          return [
            key,
            deepClean({
              label:
                firstText(
                  featurePillar.label,
                  chartPillar.label,
                ),

              stem:
                firstText(
                  featurePillar.stem,
                  chartPillar.stem,
                ),

              branch:
                firstText(
                  featurePillar.branch,
                  chartPillar.branch,
                ),

              stemTenGod:
                normalizeText(
                  featurePillar
                    .stemTenGod,
                ),

              branchMainTenGod:
                normalizeText(
                  featurePillar
                    .branchMainTenGod,
                ),

              hiddenStems:
                (
                  featurePillar
                    .hiddenStems ??
                  []
                ).map(
                  (item) =>
                    deepClean({
                      stem:
                        item.stem,

                      tenGod:
                        item.tenGod,

                      role:
                        item.role ??
                        item.qiLevel,

                      weight:
                        item.weight ??
                        item.percentage,
                    }),
                ),
            }),
          ];
        },
      ),
    );

  return deepClean({
    gender:
      normalizeText(
        featureVector
          ?.meta?.gender ??
        chart?.gender,
      ),

    pillars,

    dayMaster:
      firstText(
        featureVector
          ?.dayMaster?.stem,
        chart?.dayMaster
          ?.stem,
        chart?.dayMaster,
      ),
  });
}

function buildDayMasterSummary(
  featureVector,
  chart,
) {
  const dayMaster =
    featureVector
      ?.dayMaster ??
    {};

  return deepClean({
    stem:
      firstText(
        dayMaster.stem,
        chart?.dayMaster?.stem,
        chart?.dayMaster,
      ),

    element:
      normalizeText(
        dayMaster.element,
      ),

    strengthLevel:
      normalizeText(
        dayMaster.strengthLevel,
      ),

    strengthScore:
      finiteOrNull(
        dayMaster.strengthScore,
      ),

    rootLevel:
      normalizeText(
        dayMaster.rootLevel,
      ),

    inSeason:
      dayMaster.inSeason,
  });
}

function isUsefulFact(
  fact,
) {
  return Boolean(
    normalizeText(fact?.id),
  ) &&
  fact?.suppressed !== true &&
  fact?.status !==
    "suppressed";
}

function compareFactsForAi(
  left,
  right,
) {
  return (
    rankStatus(right) -
      rankStatus(left) ||

    rankConfidence(right) -
      rankConfidence(left) ||

    (
      roleRank[
        normalizeText(
          right.role,
        )
      ] ??
      0
    ) -
      (
        roleRank[
          normalizeText(
            left.role,
          )
        ] ??
        0
      ) ||

    Number(
      right.score ??
      0,
    ) -
      Number(
        left.score ??
        0,
      ) ||

    normalizeText(left.id)
      .localeCompare(
        normalizeText(
          right.id,
        ),
      )
  );
}

function compareCompositionsForAi(
  left,
  right,
) {
  return (
    rankStatus(right) -
      rankStatus(left) ||

    (
      roleRank[
        normalizeText(
          right.role,
        )
      ] ??
      0
    ) -
      (
        roleRank[
          normalizeText(
            left.role,
          )
        ] ??
        0
      ) ||

    rankConfidence(right) -
      rankConfidence(left) ||

    normalizeText(left.id)
      .localeCompare(
        normalizeText(
          right.id,
        ),
      )
  );
}

function rankStatus(
  item,
) {
  return Math.max(
    statusRank[
      normalizeText(
        item?.status,
      )
    ] ??
    0,

    statusRank[
      normalizeText(
        item?.workStatus,
      )
    ] ??
    0,
  );
}

function rankConfidence(
  item,
) {
  return (
    confidenceRank[
      normalizeText(
        item?.confidence,
      )
    ] ??
    0
  );
}

function normalizeIdList(
  items,
) {
  return uniqueSortedStrings(
    (
      Array.isArray(items)
        ? items
        : []
    ).map(
      (item) =>
        typeof item ===
          "string"
          ? item
          : (
              item?.id ??
              item?.imageId ??
              item?.patternId ??
              ""
            ),
    ),
  );
}

function normalizeTextList(
  items,
) {
  const source =
    (
      Array.isArray(items)
        ? items
        : [items]
    )
      .flat(Infinity);

  return uniqueStrings(
    source.map(
      (item) => {
        if (
          typeof item ===
          "string"
        ) {
          return item;
        }

        if (
          item &&
          typeof item ===
            "object"
        ) {
          return firstText(
            item.text,
            item.label,
            item.name,
            item.brief,
            item.description,
          );
        }

        return "";
      },
    ),
  );
}

function compactUnknown(
  value,
  depth = 0,
) {
  if (
    value === undefined ||
    value === null
  ) {
    return undefined;
  }

  if (
    typeof value ===
    "string"
  ) {
    return value.trim();
  }

  if (
    typeof value ===
      "number" ||
    typeof value ===
      "boolean"
  ) {
    return value;
  }

  if (depth >= 2) {
    return undefined;
  }

  if (Array.isArray(value)) {
    return value
      .slice(0, 12)
      .map(
        (item) =>
          compactUnknown(
            item,
            depth + 1,
          ),
      )
      .filter(hasValue);
  }

  if (
    typeof value ===
    "object"
  ) {
    return Object.fromEntries(
      Object.entries(value)
        .slice(0, 16)
        .map(
          ([key, item]) => [
            key,
            compactUnknown(
              item,
              depth + 1,
            ),
          ],
        )
        .filter(
          ([, item]) =>
            hasValue(item),
        ),
    );
  }

  return undefined;
}

function normalizeObjects(
  items,
  label,
  warnings,
  {
    optional = false,
  } = {},
) {
  if (!Array.isArray(items)) {
    if (!optional) {
      warnings.push(
        `${label} should be an array`,
      );
    }

    return [];
  }

  return items.filter(
    (item) => {
      const valid =
        item &&
        typeof item ===
          "object" &&
        !Array.isArray(item);

      if (!valid) {
        warnings.push(
          `${label} contains invalid item`,
        );
      }

      return valid;
    },
  );
}

function deepClean(
  value,
) {
  if (Array.isArray(value)) {
    return value
      .map(deepClean)
      .filter(hasValue);
  }

  if (
    value &&
    typeof value ===
      "object"
  ) {
    return Object.fromEntries(
      Object.entries(value)
        .map(
          ([key, item]) => [
            key,
            deepClean(item),
          ],
        )
        .filter(
          ([, item]) =>
            hasValue(item),
        ),
    );
  }

  if (
    typeof value ===
    "string"
  ) {
    return value.trim();
  }

  return value;
}

function hasValue(
  value,
) {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return false;
  }

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  if (
    typeof value ===
    "object"
  ) {
    return Object.keys(value)
      .length > 0;
  }

  return true;
}

function uniqueStrings(
  items,
) {
  return [
    ...new Set(
      (
        Array.isArray(items)
          ? items
          : []
      )
        .map(normalizeText)
        .filter(Boolean),
    ),
  ];
}

function uniqueSortedStrings(
  items,
) {
  return uniqueStrings(items)
    .sort();
}

function firstText(
  ...values
) {
  return values
    .map(normalizeText)
    .find(Boolean) ||
    "";
}

function finiteOrNull(
  value,
) {
  const number =
    Number(value);

  return Number.isFinite(
    number,
  )
    ? number
    : null;
}

function normalizeText(
  value,
) {
  return typeof value ===
    "string"
    ? value.trim()
    : "";
}