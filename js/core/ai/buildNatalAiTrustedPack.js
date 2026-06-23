const internalTextPattern =
  /加权|权重|评分|得分|比例|weightedCount|strengthScore|priorityScore|hiddenNodeCount|interruptionCount/i;

const internalPredicatePattern =
  /(?:weighted|weight|score|ratio|priority|internal)/i;

const confirmedStatuses =
  new Set([
    "activated",
    "confirmed",
  ]);

const supportedStatuses =
  new Set([
    "structurally_supported",
  ]);

const suppressedStatuses =
  new Set([
    "suppressed",
  ]);

export function buildNatalAiTrustedPack({
  natalImageReport = {},
  evidencePack = {},
} = {}) {
  const professionalContext =
    natalImageReport
      .professionalContext ??
    natalImageReport
      .natalDebug
      ?.professionalContext ??
    {};

  const facts =
    compactFacts(
      evidencePack.facts,
    );

  const factIdSet =
    new Set(
      facts.map(
        (fact) => fact.id,
      ),
    );

  const allPatterns =
    compactPatterns(
      evidencePack.compositions,
      factIdSet,
    );

  const relations =
    compactRelations(
      professionalContext.relations,
    );

  const positionContext =
    compactProfessionalContext({
      context:
        professionalContext,

      relations,
    });

  const patternGroups =
    partitionPatterns(
      allPatterns,
    );

  const workMechanisms =
    buildReadableWorkMechanisms(
      allPatterns,
    );

  const evidenceIds =
    uniqueStrings([
      ...facts.map(
        (fact) => fact.id,
      ),

      ...allPatterns.map(
        (pattern) =>
          pattern.id,
      ),

      ...relations.map(
        (relation) =>
          relation.id,
      ),
    ]);

  const modelPack =
    cleanObject({
      version:
        "natal-ai-trusted-pack-v2",

      scope:
        "natal",

      chart:
        compactChart(
          evidencePack
            .chartSummary ??
          {},
        ),

      baseline:
        compactBaseline(
          evidencePack
            .natalBaseline ??
          evidencePack
            .dayMasterSummary ??
          {},
        ),

      hardFacts:
        facts,

      positionContext,

      patterns:
        patternGroups,

      workMechanisms,

      domainLabels:
        compactDomainLabels(
          evidencePack.domains,
        ),

      evidenceRules: [
        "hardFacts是确定事实。",
        "positionContext只描述十神、宫位、主宾和关系所在位置，不等于现实事件已经发生。",
        "confirmedPatterns可进入核心结论。",
        "supportedPatterns只能作为明显倾向。",
        "conditionalPatterns只能作为条件线索。",
        "domainLabels只是分类名称，不是独立证据。",
        "evidenceRefs只能引用实际存在的事实、结构或关系ID。",
      ],

      boundaries:
        uniqueStrings(
          evidencePack.boundaries,
        ),
    });

  return {
    modelPack,
    evidenceIds,
  };
}

function compactChart(
  chart = {},
) {
  const pillars =
    chart.pillars ?? {};

  return cleanObject({
    gender:
      normalizeText(
        chart.gender,
      ),

    dayMaster:
      normalizeText(
        chart.dayMaster,
      ),

    pillars:
      Object.fromEntries(
        [
          "year",
          "month",
          "day",
          "hour",
        ].map(
          (key) => {
            const pillar =
              pillars[key] ??
              {};

            return [
              key,

              cleanObject({
                stem:
                  normalizeText(
                    pillar.stem,
                  ),

                branch:
                  normalizeText(
                    pillar.branch,
                  ),

                stemTenGod:
                  normalizeText(
                    pillar
                      .stemTenGod,
                  ),

                branchMainTenGod:
                  normalizeText(
                    pillar
                      .branchMainTenGod,
                  ),

                hiddenStems:
                  (
                    Array.isArray(
                      pillar
                        .hiddenStems,
                    )
                      ? pillar
                          .hiddenStems
                      : []
                  ).map(
                    (item) =>
                      cleanObject({
                        stem:
                          normalizeText(
                            item.stem,
                          ),

                        tenGod:
                          normalizeText(
                            item.tenGod,
                          ),

                        role:
                          normalizeText(
                            item.role,
                          ),
                      }),
                  ),
              }),
            ];
          },
        ),
      ),
  });
}

function compactBaseline(
  baseline = {},
) {
  const dayMaster =
    baseline.dayMaster ??
    baseline;

  return cleanObject({
    dayMaster: {
      stem:
        normalizeText(
          dayMaster.stem,
        ),

      element:
        normalizeText(
          dayMaster.element,
        ),

      strengthLevel:
        normalizeText(
          dayMaster
            .strengthLevel,
        ),

      rootLevel:
        normalizeText(
          dayMaster.rootLevel,
        ),

      inSeason:
        typeof dayMaster
          .inSeason ===
          "boolean"
          ? dayMaster.inSeason
          : undefined,
    },

    monthCommand:
      cleanReadableValue(
        baseline.monthCommand,
      ),

    elements: {
      dominant:
        uniqueStrings(
          baseline.elements
            ?.dominant,
        ),

      weakest:
        uniqueStrings(
          baseline.elements
            ?.weakest,
        ),
    },

    tenGods: {
      dominantGroups:
        uniqueStrings(
          baseline.tenGods
            ?.dominantGroups,
        ),

      weakGroups:
        uniqueStrings(
          baseline.tenGods
            ?.weakGroups,
        ),
    },

    repetition:
      cleanReadableValue(
        baseline.repetition,
      ),

    climate:
      cleanReadableValue(
        baseline.climate,
      ),

    relativeElements:
      cleanReadableValue(
        baseline
          .relativeElements,
      ),

    balance:
      cleanReadableValue(
        baseline.balance,
      ),

    confidence:
      normalizeText(
        baseline.confidence,
      ),
  });
}

function compactFacts(
  rows,
) {
  const facts =
    (
      Array.isArray(rows)
        ? rows
        : []
    )
      .map(compactFact)
      .filter(Boolean);

  const seen =
    new Set();

  return facts.filter(
    (fact) => {
      const key = [
        fact.category,
        fact.predicate,
        fact.statement,
      ].join("|");

      if (
        seen.has(key)
      ) {
        return false;
      }

      seen.add(key);
      return true;
    },
  );
}

function compactFact(
  fact = {},
) {
  const id =
    normalizeText(fact.id);

  const status =
    normalizeText(
      fact.status,
    );

  const predicate =
    normalizeText(
      fact.predicate,
    );

  const statement =
    firstText(
      fact.statement,
      fact.name,
    );

  if (
    !id ||
    fact.suppressed ===
      true ||
    suppressedStatuses.has(
      status,
    )
  ) {
    return null;
  }

  /*
   * 内部量化结果只用于本地排序，
   * 不交给模型解释。
   */
  if (
    internalPredicatePattern
      .test(predicate) ||
    internalTextPattern.test(
      statement,
    )
  ) {
    return null;
  }

  return cleanObject({
    id,

    category:
      normalizeText(
        fact.category,
      ),

    predicate,

    statement,

    subject:
      compactSubject(
        fact.subject,
      ),

    value:
      compactSafeValue(
        fact.value,
      ),

    role:
      normalizeText(
        fact.role,
      ),

    status:
      status ||
      "confirmed",

    polarity:
      normalizeText(
        fact.polarity,
      ),

    confidence:
      normalizeText(
        fact.confidence,
      ),

    importance:
      normalizeText(
        fact.importance,
      ),

    semanticGroup:
      normalizeText(
        fact.semanticGroup,
      ),

    domains:
      uniqueStrings(
        fact.domains,
      ),

    sourceRuleId:
      normalizeText(
        fact.sourceRuleId,
      ),
  });
}

function compactPatterns(
  rows,
  factIdSet,
) {
  return (
    Array.isArray(rows)
      ? rows
      : []
  )
    .map(
      (pattern) =>
        compactPattern(
          pattern,
          factIdSet,
        ),
    )
    .filter(Boolean);
}

function compactPattern(
  pattern = {},
  factIdSet,
) {
  const id =
    normalizeText(
      pattern.id,
    );

  const status =
    normalizeText(
      pattern.status,
    ) ||
    "candidate";

  if (
    !id ||
    suppressedStatuses.has(
      status,
    )
  ) {
    return null;
  }

  return cleanObject({
    id,

    sourceLayer:
      normalizeText(
        pattern.sourceLayer,
      ),

    title:
      firstText(
        pattern.title,
        pattern.brief,
      ),

    brief:
      normalizeText(
        pattern.brief,
      ),

    formation:
      normalizeText(
        pattern.formation,
      ),

    semanticGroup:
      normalizeText(
        pattern.semanticGroup,
      ),

    role:
      normalizeText(
        pattern.role,
      ),

    status,

    workStatus:
      normalizeText(
        pattern.workStatus,
      ),

    importance:
      normalizeText(
        pattern.importance,
      ),

    polarity:
      normalizeText(
        pattern.polarity,
      ),

    confidence:
      normalizeText(
        pattern.confidence,
      ),

    domains:
      uniqueStrings(
        pattern.domains,
      ),

    strengths:
      uniqueStrings(
        pattern.strengths,
      ),

    risks:
      uniqueStrings(
        pattern.risks,
      ),

    conditions:
      uniqueStrings(
        pattern.conditions,
      ),

    counterEvidence:
      uniqueStrings(
        pattern
          .counterEvidence,
      ),

    weakeningEvidence:
      uniqueStrings(
        pattern
          .weakeningEvidence,
      ),

    blockingEvidence:
      uniqueStrings(
        pattern
          .blockingEvidence,
      ),

    workPath:
      compactWorkPath(
        pattern.workPath,
      ),

    matchedFactIds:
      filterExistingIds(
        pattern
          .matchedFactIds,
        factIdSet,
      ),

    counterFactIds:
      filterExistingIds(
        pattern
          .counterFactIds,
        factIdSet,
      ),
  });
}

function compactWorkPath(
  path,
) {
  if (
    !path ||
    typeof path !==
      "object" ||
    Array.isArray(path)
  ) {
    return null;
  }

  return cleanObject({
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

    evidenceText:
      normalizeText(
        path.evidenceText,
      ),
  });
}

function partitionPatterns(
  patterns,
) {
  return {
    confirmedPatterns:
      patterns.filter(
        (pattern) =>
          confirmedStatuses.has(
            pattern.status,
          ),
      ),

    supportedPatterns:
      patterns.filter(
        (pattern) =>
          supportedStatuses.has(
            pattern.status,
          ),
      ),

    conditionalPatterns:
      patterns.filter(
        (pattern) =>
          !confirmedStatuses.has(
            pattern.status,
          ) &&
          !supportedStatuses.has(
            pattern.status,
          ),
      ),
  };
}

function buildReadableWorkMechanisms(
  patterns,
) {
  return patterns
    .filter(
      (pattern) =>
        pattern.workPath &&
        (
          pattern.workPath
            .startTenGod ||
          pattern.workPath
            .endTenGod ||
          pattern.workPath
            .evidenceText
        ),
    )
    .map(
      (pattern) =>
        cleanObject({
          patternId:
            pattern.id,

          title:
            pattern.title,

          status:
            pattern.workStatus ||
            pattern.status,

          startTenGod:
            pattern.workPath
              .startTenGod,

          endTenGod:
            pattern.workPath
              .endTenGod,

          nodeTenGods:
            pattern.workPath
              .nodeTenGods,

          activationLevel:
            pattern.workPath
              .activationLevel,

          confidence:
            pattern.workPath
              .confidence,

          explanation:
            pattern.workPath
              .evidenceText,

          conditions:
            pattern.conditions,

          weakeningEvidence:
            pattern
              .weakeningEvidence,

          blockingEvidence:
            pattern
              .blockingEvidence,
        }),
    );
}

function compactProfessionalContext({
  context,
  relations,
}) {
  const pillars =
    context.pillars ?? {};

  const tenGods =
    context.tenGods ?? {};

  const kinships =
    context.kinships ?? {};

  return cleanObject({
    mapping: {
      hostPillars:
        uniqueStrings(
          context.mapping
            ?.hostPillars,
        ),

      guestPillars:
        uniqueStrings(
          context.mapping
            ?.guestPillars,
        ),

      boundary:
        normalizeText(
          context.mapping
            ?.boundary,
        ),
    },

    hostGuest:
      compactHostGuest(
        context.hostGuest,
      ),

    pillars:
      Object.fromEntries(
        Object.entries(
          pillars,
        ).map(
          ([key, pillar]) => [
            key,

            cleanObject({
              label:
                normalizeText(
                  pillar.label,
                ),

              ownership:
                normalizeText(
                  pillar
                    .ownership,
                ),

              proximity:
                normalizeText(
                  pillar
                    .proximity,
                ),

              stage:
                normalizeText(
                  pillar.stage,
                ),

              themes:
                uniqueStrings(
                  pillar.themes,
                ),

              stem:
                normalizeText(
                  pillar.stem,
                ),

              branch:
                normalizeText(
                  pillar.branch,
                ),

              stemTenGod:
                normalizeText(
                  pillar
                    .stemTenGod,
                ),

              branchMainTenGod:
                normalizeText(
                  pillar
                    .branchMainTenGod,
                ),

              hiddenTenGods:
                uniqueStrings(
                  pillar
                    .hiddenTenGods,
                ),

              relationIds:
                uniqueStrings(
                  pillar
                    .relationIds,
                ),

              relationTitles:
                uniqueStrings(
                  pillar
                    .relationTitles,
                ),
            }),
          ],
        ),
      ),

    tenGodPositions:
      Object.fromEntries(
        Object.entries(
          tenGods,
        )
          .map(
            ([name, item]) => [
              name,
              compactTenGodContext(
                item,
              ),
            ],
          )
          .filter(
            ([, item]) =>
              item &&
              (
                item.isVisible ||
                item.isHiddenOnly ||
                item.positions
                  ?.length
              ),
          ),
      ),

    relations,

    spousePalace:
      compactSpousePalace(
        context.palaces
          ?.spousePalace,
      ),

    kinships:
      Object.fromEntries(
        Object.entries(
          kinships,
        ).map(
          ([key, item]) => [
            key,
            compactKinship(
              item,
            ),
          ],
        ),
      ),

    confidence:
      normalizeText(
        context.confidence,
      ),
  });
}

function compactHostGuest(
  hostGuest = {},
) {
  return cleanObject({
    hostPillars:
      uniqueStrings(
        hostGuest.hostPillars,
      ),

    guestPillars:
      uniqueStrings(
        hostGuest.guestPillars,
      ),

    hostTenGods:
      uniqueStrings(
        hostGuest.hostTenGods,
      ),

    guestTenGods:
      uniqueStrings(
        hostGuest.guestTenGods,
      ),

    mixedTenGods:
      uniqueStrings(
        hostGuest.mixedTenGods,
      ),

    bridgeRelationIds:
      uniqueStrings(
        hostGuest
          .bridgeRelationIds,
      ),

    hostOnlyRelationIds:
      uniqueStrings(
        hostGuest
          .hostOnlyRelationIds,
      ),

    guestOnlyRelationIds:
      uniqueStrings(
        hostGuest
          .guestOnlyRelationIds,
      ),
  });
}

function compactTenGodContext(
  item = {},
) {
  return cleanObject({
    name:
      normalizeText(
        item.name,
      ),

    strengthLevel:
      normalizeText(
        item.strengthLevel,
      ),

    isVisible:
      Boolean(item.isVisible),

    isHiddenOnly:
      Boolean(
        item.isHiddenOnly,
      ),

    hasRoot:
      Boolean(item.hasRoot),

    isFloating:
      Boolean(
        item.isFloating,
      ),

    isBlocked:
      Boolean(item.isBlocked),

    inMonthStem:
      Boolean(
        item.inMonthStem,
      ),

    inMonthCommand:
      Boolean(
        item.inMonthCommand,
      ),

    placementScope:
      normalizeText(
        item.placementScope,
      ),

    positions:
      compactPositions(
        item.positions,
      ),

    tensionRelationIds:
      uniqueStrings(
        item
          .tensionRelationIds,
      ),

    connectionRelationIds:
      uniqueStrings(
        item
          .connectionRelationIds,
      ),
  });
}

function compactRelations(
  rows,
) {
  return (
    Array.isArray(rows)
      ? rows
      : []
  )
    .map(
      (relation) =>
        cleanObject({
          id:
            normalizeText(
              relation.id,
            ),

          relationType:
            normalizeText(
              relation
                .relationType,
            ),

          relationLabel:
            normalizeText(
              relation
                .relationLabel,
            ),

          nature:
            normalizeText(
              relation.nature,
            ),

          formation:
            normalizeText(
              relation.formation,
            ),

          confidence:
            normalizeText(
              relation.confidence,
            ),

          title:
            normalizeText(
              relation.title,
            ),

          hostGuestBridge:
            Boolean(
              relation
                .hostGuestBridge,
            ),

          hostOnly:
            Boolean(
              relation.hostOnly,
            ),

          guestOnly:
            Boolean(
              relation.guestOnly,
            ),

          affectedDomains:
            uniqueStrings(
              relation
                .affectedDomains,
            ),

          participants:
            (
              Array.isArray(
                relation
                  .participants,
              )
                ? relation
                    .participants
                : []
            ).map(
              (participant) =>
                cleanObject({
                  pillar:
                    normalizeText(
                      participant
                        .pillar,
                    ),

                  pillarLabel:
                    normalizeText(
                      participant
                        .pillarLabel,
                    ),

                  position:
                    normalizeText(
                      participant
                        .position,
                    ),

                  value:
                    normalizeText(
                      participant
                        .value,
                    ),

                  tenGod:
                    normalizeText(
                      participant
                        .tenGod,
                    ),

                  ownership:
                    normalizeText(
                      participant
                        .ownership,
                    ),

                  proximity:
                    normalizeText(
                      participant
                        .proximity,
                    ),
                }),
            ),
        }),
    )
    .filter(
      (relation) =>
        relation.id &&
        relation.title,
    );
}

function compactSpousePalace(
  palace = {},
) {
  return cleanObject({
    branch:
      normalizeText(
        palace.branch,
      ),

    mainTenGod:
      normalizeText(
        palace.mainTenGod,
      ),

    hiddenTenGods:
      uniqueStrings(
        palace.hiddenTenGods,
      ),

    relationIds:
      uniqueStrings(
        palace.relationIds,
      ),

    relationTitles:
      uniqueStrings(
        palace
          .relationTitles,
      ),

    tensionRelationTitles:
      uniqueStrings(
        palace
          .tensionRelationTitles,
      ),

    connectionRelationTitles:
      uniqueStrings(
        palace
          .connectionRelationTitles,
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
  });
}

function compactKinship(
  item = {},
) {
  return cleanObject({
    label:
      normalizeText(
        item.label,
      ),

    mappingStatus:
      normalizeText(
        item.mappingStatus,
      ),

    primaryTenGods:
      uniqueStrings(
        item.primaryTenGods,
      ),

    secondaryTenGods:
      uniqueStrings(
        item.secondaryTenGods,
      ),

    palaceRefs:
      uniqueStrings(
        item.palaceRefs,
      ),

    strengthLevels:
      uniqueStrings(
        item.strengthLevels,
      ),

    placementScope:
      normalizeText(
        item.placementScope,
      ),

    positions:
      compactPositions(
        item.positions,
      ),

    relationIds:
      uniqueStrings(
        item.relationIds,
      ),

    relationTypes:
      uniqueStrings(
        item.relationTypes,
      ),
  });
}

function compactPositions(
  rows,
) {
  return (
    Array.isArray(rows)
      ? rows
      : []
  ).map(
    (position) =>
      cleanObject({
        path:
          firstText(
            position.path,
            position
              .positionPath,
          ),

        pillar:
          normalizeText(
            position.pillar,
          ),

        pillarLabel:
          normalizeText(
            position
              .pillarLabel,
          ),

        position:
          normalizeText(
            position.position,
          ),

        positionLabel:
          normalizeText(
            position
              .positionLabel,
          ),

        visibility:
          normalizeText(
            position.visibility,
          ),

        ownership:
          normalizeText(
            position.ownership,
          ),

        proximity:
          normalizeText(
            position.proximity,
          ),

        stage:
          normalizeText(
            position.stage,
          ),

        stem:
          normalizeText(
            position.stem,
          ),

        branch:
          normalizeText(
            position.branch,
          ),

        tenGod:
          normalizeText(
            position.tenGod,
          ),
      }),
  );
}

function compactDomainLabels(
  rows,
) {
  return Object.fromEntries(
    (
      Array.isArray(rows)
        ? rows
        : []
    )
      .map(
        (domain) => [
          normalizeText(
            domain.key,
          ),

          firstText(
            domain.label,
            domain.title,
          ),
        ],
      )
      .filter(
        ([key, label]) =>
          key && label,
      ),
  );
}

function compactSubject(
  subject,
) {
  if (
    !subject ||
    typeof subject !==
      "object" ||
    Array.isArray(subject)
  ) {
    return compactSafeValue(
      subject,
    );
  }

  return cleanObject({
    key:
      normalizeText(
        subject.key,
      ),

    type:
      normalizeText(
        subject.type,
      ),

    pillar:
      normalizeText(
        subject.pillar,
      ),

    position:
      normalizeText(
        subject.position,
      ),

    stem:
      normalizeText(
        subject.stem,
      ),

    branch:
      normalizeText(
        subject.branch,
      ),

    tenGod:
      normalizeText(
        subject.tenGod,
      ),

    relationId:
      normalizeText(
        subject.relationId,
      ),
  });
}

function compactSafeValue(
  value,
) {
  if (
    typeof value ===
      "boolean"
  ) {
    return value;
  }

  if (
    typeof value ===
      "string"
  ) {
    const text =
      value.trim();

    return (
      text &&
      !internalTextPattern
        .test(text)
    )
      ? text
      : undefined;
  }

  return undefined;
}

function cleanReadableValue(
  value,
  key = "",
) {
  if (
    typeof value ===
      "number"
  ) {
    return undefined;
  }

  if (
    typeof value ===
      "boolean"
  ) {
    return value;
  }

  if (
    typeof value ===
      "string"
  ) {
    const text =
      value.trim();

    return (
      text &&
      !internalTextPattern
        .test(text)
    )
      ? text
      : undefined;
  }

  if (Array.isArray(value)) {
    return value
      .map(
        (item) =>
          cleanReadableValue(
            item,
            key,
          ),
      )
      .filter(hasValue);
  }

  if (
    value &&
    typeof value ===
      "object"
  ) {
    return Object.fromEntries(
      Object.entries(value)
        .filter(
          ([childKey]) =>
            !internalPredicatePattern
              .test(childKey),
        )
        .map(
          ([childKey, item]) => [
            childKey,

            cleanReadableValue(
              item,
              childKey,
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

function filterExistingIds(
  rows,
  allowedSet,
) {
  return uniqueStrings(rows)
    .filter(
      (id) =>
        allowedSet.has(id),
    );
}

function cleanObject(
  value,
) {
  if (Array.isArray(value)) {
    return value
      .map(cleanObject)
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
            cleanObject(item),
          ],
        )
        .filter(
          ([, item]) =>
            hasValue(item),
        ),
    );
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
  rows,
) {
  return [
    ...new Set(
      (
        Array.isArray(rows)
          ? rows
          : []
      )
        .map(
          (item) =>
            String(
              item ?? "",
            ).trim(),
        )
        .filter(Boolean),
    ),
  ];
}

function firstText(
  ...values
) {
  return values
    .map(normalizeText)
    .find(Boolean) ?? "";
}

function normalizeText(
  value,
) {
  return typeof value ===
    "string"
    ? value.trim()
    : "";
}