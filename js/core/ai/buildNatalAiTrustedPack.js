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

const AI_PILLAR_KEYS = [
  "year",
  "month",
  "day",
  "hour",
];

const AI_TEN_GODS = [
  "比肩",
  "劫财",
  "食神",
  "伤官",
  "偏财",
  "正财",
  "七杀",
  "正官",
  "偏印",
  "正印",
];

const AI_STEM_ELEMENTS = {
  甲: "木",
  乙: "木",
  丙: "火",
  丁: "火",
  戊: "土",
  己: "土",
  庚: "金",
  辛: "金",
  壬: "水",
  癸: "水",
};

const AI_BRANCH_ELEMENTS = {
  子: "水",
  丑: "土",
  寅: "木",
  卯: "木",
  辰: "土",
  巳: "火",
  午: "火",
  未: "土",
  申: "金",
  酉: "金",
  戌: "土",
  亥: "水",
};

const AI_BRANCH_SEASONS = {
  寅: "春",
  卯: "春",
  辰: "春",
  巳: "夏",
  午: "夏",
  未: "夏",
  申: "秋",
  酉: "秋",
  戌: "秋",
  亥: "冬",
  子: "冬",
  丑: "冬",
};

const AI_DETERMINISTIC_RELATION_PATTERN =
  /天干五合|六合|三合|三会|半合|拱合|暗合|冲|刑|自刑|害|穿|破|伏吟|重复|combine|harmony|clash|punish|harm|break|repetition/i;


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
    const chart =
    compactChart(
        evidencePack
        .chartSummary ??
        evidencePack.chart ??
        natalImageReport
        .chartSummary ??
        natalImageReport.chart ??
        {},
    );

  /*
   * 优先读取新版原局原子事实。
   * 新版不存在时，才回退到旧 evidencePack。
   */
  const sourceFacts =
    natalImageReport
      .atomicFacts
      ?.contractFacts ??
    natalImageReport
      .natalDebug
      ?.atomicFacts
      ?.contractFacts ??
    evidencePack.facts ??
    [];

  /*
   * 优先读取新版原局取象组合。
   * 新版不存在时，才回退到旧 evidencePack。
   */
  const sourcePatterns =
    natalImageReport
      .mergedComposition
      ?.images ??
    natalImageReport
      .natalDebug
      ?.productionCompositionImages ??
    evidencePack.compositions ??
    [];

  const facts =
    compactFacts(
      sourceFacts,
    );

  const factGroups =
    partitionFacts(
      facts,
    );

  const factIdSet =
    new Set(
      facts.map(
        (fact) =>
          fact.id,
      ),
    );

  const allPatterns =
    compactPatterns(
      sourcePatterns,
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
    const deterministicEvidence =
    buildAiDeterministicEvidence({
        chart,
        positionContext,
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
    collectAiDeterministicEvidenceIds(
        deterministicEvidence,
    );

    const modelPack =
    cleanObject({
        version:
        "natal-ai-deterministic-pack-v1",

        scope:
        "natal",

        chart,

        seasonContext:
        deterministicEvidence
            .seasonContext,

        distributions:
        deterministicEvidence
            .distributions,

        tenGodPositions:
        deterministicEvidence
            .tenGodPositions,

        dayMasterRootEvidence:
        deterministicEvidence
            .dayMasterRootEvidence,

        repetitions:
        deterministicEvidence
            .repetitions,

        relations:
        deterministicEvidence
            .relations,

        spousePalace:
        deterministicEvidence
            .spousePalace,

        frameworkContext:
        deterministicEvidence
            .frameworkContext,

        evidenceRules: [
        "四柱、十神、藏干、所在柱位、透藏、重复和明确干支关系属于确定性数据。",
        "五行与十神数量只是原始出现次数，不代表最终旺衰。",
        "同干或同五行落在藏干中，只是根气证据，不等于已经裁定强弱等级。",
        "合冲刑害破只说明原局存在该关系，不直接等于具体吉凶事件。",
        "主宾、宫位和六亲只作为本项目采用的位置映射，不等于现实结果。",
        "现实判断原则上应由至少两个相互支持的独立证据共同形成。",
        "不得根据单一十神判断固定职业、收入高低、婚姻次数、亲属数量或具体疾病。",
        "当前只分析出生原局，不推断具体年份事件。",
        ],
    });

  return {
    modelPack,
    evidenceIds,
  };
}

function buildAiDeterministicEvidence({
  chart = {},
  positionContext = {},
} = {}) {
  const repetitions =
    buildAiChartRepetitions(
      chart,
    );

  const relations =
    compactAiDeterministicRelations({
      rows:
        positionContext.relations,

      chart,
    });

  return cleanObject({
    seasonContext:
      buildAiSeasonContext(
        chart,
      ),

    distributions:
      buildAiRawDistributions(
        chart,
      ),

    tenGodPositions:
      buildAiTenGodPositions({
        chart,

        source:
          positionContext
            .tenGodPositions,
      }),

    dayMasterRootEvidence:
      buildAiDayMasterRootEvidence(
        chart,
      ),

    repetitions,

    relations,

    spousePalace:
      buildAiSpousePalace({
        chart,

        source:
          positionContext
            .spousePalace,

        relations,
      }),

    frameworkContext:
      buildAiFrameworkContext(
        positionContext,
      ),
  });
}

function buildAiSeasonContext(
  chart = {},
) {
  const monthBranch =
    normalizeText(
      chart.pillars
        ?.month
        ?.branch,
    );

  const dayMaster =
    normalizeText(
      chart.dayMaster ??
      chart.pillars
        ?.day
        ?.stem,
    );

  return cleanObject({
    evidenceId:
      "season:month-branch",

    monthBranch,

    season:
      AI_BRANCH_SEASONS[
        monthBranch
      ],

    monthBranchElement:
      AI_BRANCH_ELEMENTS[
        monthBranch
      ],

    dayMasterElement:
      AI_STEM_ELEMENTS[
        dayMaster
      ],
  });
}

function buildAiRawDistributions(
  chart = {},
) {
  const visibleStemElements =
    {};

  const branchElements =
    {};

  const hiddenStemElements =
    {};

  const visibleTenGods =
    {};

  const hiddenTenGods =
    {};

  for (
    const pillarKey of
    AI_PILLAR_KEYS
  ) {
    const pillar =
      chart.pillars
        ?.[pillarKey] ??
      {};

    addAiCount(
      visibleStemElements,

      AI_STEM_ELEMENTS[
        pillar.stem
      ],
    );

    addAiCount(
      branchElements,

      AI_BRANCH_ELEMENTS[
        pillar.branch
      ],
    );

    const isDayMasterStem =
      pillarKey === "day" &&
      pillar.stem ===
        chart.dayMaster;

    if (
      !isDayMasterStem &&
      AI_TEN_GODS.includes(
        pillar.stemTenGod,
      )
    ) {
      addAiCount(
        visibleTenGods,
        pillar.stemTenGod,
      );
    }

    for (
      const hiddenStem of
      pillar.hiddenStems ?? []
    ) {
      addAiCount(
        hiddenStemElements,

        AI_STEM_ELEMENTS[
          hiddenStem.stem
        ],
      );

      if (
        AI_TEN_GODS.includes(
          hiddenStem.tenGod,
        )
      ) {
        addAiCount(
          hiddenTenGods,
          hiddenStem.tenGod,
        );
      }
    }
  }

  return cleanObject({
    elements: {
      visibleStems:
        visibleStemElements,

      branches:
        branchElements,

      hiddenStems:
        hiddenStemElements,
    },

    tenGods: {
      visible:
        visibleTenGods,

      hidden:
        hiddenTenGods,
    },

    boundary:
      "这里只记录原始出现位置和次数，不代表经过月令、根气、生克和组合修正后的最终旺衰。",
  });
}

function buildAiTenGodPositions({
  chart = {},
  source = {},
} = {}) {
  const scanned =
    Object.fromEntries(
      AI_TEN_GODS.map(
        (name) => [
          name,

          {
            visibleCount: 0,
            hiddenCount: 0,
            positions: [],
          },
        ],
      ),
    );

  for (
    const pillarKey of
    AI_PILLAR_KEYS
  ) {
    const pillar =
      chart.pillars
        ?.[pillarKey] ??
      {};

    const isDayMasterStem =
      pillarKey === "day" &&
      pillar.stem ===
        chart.dayMaster;

    const stemTenGod =
      normalizeText(
        pillar.stemTenGod,
      );

    if (
      !isDayMasterStem &&
      scanned[stemTenGod]
    ) {
      scanned[
        stemTenGod
      ].visibleCount += 1;

      scanned[
        stemTenGod
      ].positions.push(
        cleanObject({
          pillar:
            pillarKey,

          position:
            "stem",

          visibility:
            "visible",

          stem:
            pillar.stem,
        }),
      );
    }

    for (
      const hiddenStem of
      pillar.hiddenStems ?? []
    ) {
      const tenGod =
        normalizeText(
          hiddenStem.tenGod,
        );

      if (!scanned[tenGod]) {
        continue;
      }

      scanned[
        tenGod
      ].hiddenCount += 1;

      scanned[
        tenGod
      ].positions.push(
        cleanObject({
          pillar:
            pillarKey,

          position:
            "hiddenStem",

          visibility:
            "hidden",

          stem:
            hiddenStem.stem,

          role:
            hiddenStem.role,
        }),
      );
    }
  }

  return Object.fromEntries(
    AI_TEN_GODS.map(
      (name) => {
        const item =
          scanned[name];

        const sourceItem =
          source?.[name] ??
          {};

        const totalCount =
          item.visibleCount +
          item.hiddenCount;

        return [
          name,

          cleanObject({
            id:
              `ten-god:${name}`,

            name,

            visibleCount:
              item.visibleCount,

            hiddenCount:
              item.hiddenCount,

            totalCount,

            isAbsent:
              totalCount === 0,

            isVisible:
              item.visibleCount >
              0,

            isHiddenOnly:
              item.visibleCount ===
                0 &&
              item.hiddenCount >
                0,

            hasRoot:
              typeof sourceItem
                .hasRoot ===
                "boolean"
                ? sourceItem
                    .hasRoot
                : undefined,

            isFloating:
              typeof sourceItem
                .isFloating ===
                "boolean"
                ? sourceItem
                    .isFloating
                : undefined,

            isBlocked:
              typeof sourceItem
                .isBlocked ===
                "boolean"
                ? sourceItem
                    .isBlocked
                : undefined,

            inMonthStem:
              item.positions.some(
                (position) =>
                  position.pillar ===
                    "month" &&
                  position.position ===
                    "stem",
              ),

            inMonthCommand:
              item.positions.some(
                (position) =>
                  position.pillar ===
                    "month" &&
                  position.position ===
                    "hiddenStem",
              ),

            placementScope:
              normalizeText(
                sourceItem
                  .placementScope,
              ),

            positions:
              item.positions,
          }),
        ];
      },
    ),
  );
}

function buildAiDayMasterRootEvidence(
  chart = {},
) {
  const dayMaster =
    normalizeText(
      chart.dayMaster ??
      chart.pillars
        ?.day
        ?.stem,
    );

  const dayMasterElement =
    AI_STEM_ELEMENTS[
      dayMaster
    ];

  const sameStemInBranches =
    [];

  const sameElementInBranches =
    [];

  for (
    const pillarKey of
    AI_PILLAR_KEYS
  ) {
    const pillar =
      chart.pillars
        ?.[pillarKey] ??
      {};

    for (
      const hiddenStem of
      pillar.hiddenStems ?? []
    ) {
      const row =
        cleanObject({
          pillar:
            pillarKey,

          branch:
            pillar.branch,

          hiddenStem:
            hiddenStem.stem,

          tenGod:
            hiddenStem.tenGod,

          role:
            hiddenStem.role,
        });

      if (
        hiddenStem.stem ===
        dayMaster
      ) {
        sameStemInBranches
          .push(row);
      }

      if (
        AI_STEM_ELEMENTS[
          hiddenStem.stem
        ] ===
        dayMasterElement
      ) {
        sameElementInBranches
          .push(row);
      }
    }
  }

  return cleanObject({
    evidenceId:
      "root:day-master",

    dayMaster,

    dayMasterElement,

    sameStemInBranches,

    sameElementInBranches,

    boundary:
      "这里只列出日主同干或同五行在地支藏干中的实际位置，不直接给出身强身弱等级。",
  });
}

function buildAiChartRepetitions(
  chart = {},
) {
  const stemPositions =
    {};

  const branchPositions =
    {};

  for (
    const pillarKey of
    AI_PILLAR_KEYS
  ) {
    const pillar =
      chart.pillars
        ?.[pillarKey] ??
      {};

    pushAiPosition(
      stemPositions,
      pillar.stem,
      `${pillarKey}.stem`,
    );

    pushAiPosition(
      branchPositions,
      pillar.branch,
      `${pillarKey}.branch`,
    );
  }

  return [
    ...buildAiRepeatedRows(
      "stem",
      stemPositions,
    ),

    ...buildAiRepeatedRows(
      "branch",
      branchPositions,
    ),
  ];
}

function buildAiRepeatedRows(
  type,
  positionMap,
) {
  return Object.entries(
    positionMap,
  )
    .filter(
      ([, positions]) =>
        positions.length > 1,
    )
    .map(
      ([value, positions]) =>
        cleanObject({
          id:
            `repetition:${type}:${value}`,

          type,

          value,

          positions,
        }),
    );
}

function compactAiDeterministicRelations({
  rows,
  chart,
} = {}) {
  return (
    Array.isArray(rows)
      ? rows
      : []
  )
    .map(
      (relation) => {
        const relationType =
          normalizeText(
            relation
              .relationType,
          );

        const relationLabel =
          firstText(
            relation
              .relationLabel,

            relation.title,

            relationType,
          );

        const searchableText = [
          relationType,
          relationLabel,
        ].join(" ");

        if (
          !AI_DETERMINISTIC_RELATION_PATTERN
            .test(
              searchableText,
            )
        ) {
          return null;
        }

        const participants =
          (
            Array.isArray(
              relation
                .participants,
            )
              ? relation
                  .participants
              : []
          )
            .map(
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
            )
            .filter(
              (participant) =>
                participant.pillar &&
                participant.value,
            );

        if (
          participants.length <
          2
        ) {
          return null;
        }

        return cleanObject({
          id:
            normalizeText(
              relation.id,
            ),

          relationType,

          relationLabel,

          participants,

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

          touchesDayBranch:
            participants.some(
              (participant) =>
                participant
                  .pillar ===
                  "day" &&
                participant.value ===
                  chart.pillars
                    ?.day
                    ?.branch,
            ),

          touchesMonthBranch:
            participants.some(
              (participant) =>
                participant
                  .pillar ===
                  "month" &&
                participant.value ===
                  chart.pillars
                    ?.month
                    ?.branch,
            ),

          touchesHourPillar:
            participants.some(
              (participant) =>
                participant
                  .pillar ===
                "hour",
            ),
        });
      },
    )
    .filter(
      (relation) =>
        relation &&
        relation.id,
    );
}

function buildAiSpousePalace({
  chart = {},
  source = {},
  relations = [],
} = {}) {
  const dayPillar =
    chart.pillars?.day ??
    {};

  const sourceRelationIds =
    uniqueStrings(
      source.relationIds,
    );

  const relatedRelations =
    relations.filter(
      (relation) =>
        relation
          .touchesDayBranch ||
        sourceRelationIds
          .includes(
            relation.id,
          ),
    );

  return cleanObject({
    id:
      "palace:spouse",

    branch:
      dayPillar.branch,

    mainTenGod:
      dayPillar
        .branchMainTenGod ??
      source.mainTenGod,

    hiddenStems:
      dayPillar.hiddenStems,

    relationIds:
      relatedRelations.map(
        (relation) =>
          relation.id,
      ),

    relations:
      relatedRelations,

    hasCombine:
      Boolean(
        source.hasCombine,
      ),

    hasClash:
      Boolean(
        source.hasClash,
      ),

    hasPunish:
      Boolean(
        source.hasPunish,
      ),

    hasSelfPunish:
      Boolean(
        source.hasSelfPunish,
      ),

    hasHarm:
      Boolean(
        source.hasHarm,
      ),

    hasBreak:
      Boolean(
        source.hasBreak,
      ),

    hasRepetition:
      Boolean(
        source.hasRepetition,
      ),
  });
}

function buildAiFrameworkContext(
  positionContext = {},
) {
  const mapping =
    positionContext.mapping ??
    {};

  const hostGuest =
    positionContext.hostGuest ??
    {};

  const tenGodPlacements =
    Object.fromEntries(
      Object.entries(
        positionContext
          .tenGodPositions ??
        {},
      ).map(
        ([name, item]) => [
          name,

          cleanObject({
            placementScope:
              normalizeText(
                item
                  ?.placementScope,
              ),

            positions:
              (
                Array.isArray(
                  item?.positions,
                )
                  ? item.positions
                  : []
              ).map(
                (position) =>
                  cleanObject({
                    pillar:
                      normalizeText(
                        position
                          .pillar,
                      ),

                    position:
                      normalizeText(
                        position
                          .position,
                      ),

                    visibility:
                      normalizeText(
                        position
                          .visibility,
                      ),

                    ownership:
                      normalizeText(
                        position
                          .ownership,
                      ),

                    proximity:
                      normalizeText(
                        position
                          .proximity,
                      ),
                  }),
              ),
          }),
        ],
      ),
    );

  const kinshipMap =
    Object.fromEntries(
      Object.entries(
        positionContext
          .kinships ??
        {},
      ).map(
        ([key, item]) => [
          key,

          cleanObject({
            id:
              `kinship:${key}`,

            label:
              normalizeText(
                item?.label,
              ),

            mappingStatus:
              normalizeText(
                item
                  ?.mappingStatus,
              ),

            primaryTenGods:
              uniqueStrings(
                item
                  ?.primaryTenGods,
              ),

            secondaryTenGods:
              uniqueStrings(
                item
                  ?.secondaryTenGods,
              ),

            palaceRefs:
              uniqueStrings(
                item
                  ?.palaceRefs,
              ),

            placementScope:
              normalizeText(
                item
                  ?.placementScope,
              ),

            positions:
              (
                Array.isArray(
                  item?.positions,
                )
                  ? item.positions
                  : []
              ).map(
                (position) =>
                  cleanObject({
                    pillar:
                      normalizeText(
                        position
                          .pillar,
                      ),

                    position:
                      normalizeText(
                        position
                          .position,
                      ),

                    visibility:
                      normalizeText(
                        position
                          .visibility,
                      ),

                    ownership:
                      normalizeText(
                        position
                          .ownership,
                      ),

                    proximity:
                      normalizeText(
                        position
                          .proximity,
                      ),

                    tenGod:
                      normalizeText(
                        position
                          .tenGod,
                      ),
                  }),
              ),

            relationIds:
              uniqueStrings(
                item
                  ?.relationIds,
              ),

            relationTypes:
              uniqueStrings(
                item
                  ?.relationTypes,
              ),
          }),
        ],
      ),
    );

  return cleanObject({
    hostGuest: {
      id:
        "framework:host-guest",

      hostPillars:
        uniqueStrings(
          mapping.hostPillars ??
          hostGuest
            .hostPillars,
        ),

      guestPillars:
        uniqueStrings(
          mapping.guestPillars ??
          hostGuest
            .guestPillars,
        ),

      tenGodPlacements,
    },

    kinshipMap,
  });
}

function collectAiDeterministicEvidenceIds(
  evidence = {},
) {
  return uniqueStrings([
    "chart:four-pillars",
    "season:month-branch",
    "root:day-master",
    "palace:spouse",
    "framework:host-guest",

    ...Object.values(
      evidence
        .tenGodPositions ??
      {},
    ).map(
      (item) =>
        item.id,
    ),

    ...(
      evidence.repetitions ??
      []
    ).map(
      (item) =>
        item.id,
    ),

    ...(
      evidence.relations ??
      []
    ).map(
      (item) =>
        item.id,
    ),

    ...Object.values(
      evidence
        .frameworkContext
        ?.kinshipMap ??
      {},
    ).map(
      (item) =>
        item.id,
    ),
  ]);
}

function addAiCount(
  target,
  key,
) {
  if (!key) {
    return;
  }

  target[key] =
    (
      target[key] ??
      0
    ) + 1;
}

function pushAiPosition(
  target,
  value,
  position,
) {
  if (!value) {
    return;
  }

  target[value] =
    target[value] ??
    [];

  target[value].push(
    position,
  );
}

function partitionFacts(
  facts,
) {
  return {
    hardFacts:
      facts.filter(
        (fact) =>
          [
            "",
            "confirmed",
            "activated",
          ].includes(
            fact.status ?? "",
          ),
      ),

    supportedFacts:
      facts.filter(
        (fact) =>
          fact.status ===
          "structurally_supported",
      ),

    conditionalFacts:
      facts.filter(
        (fact) =>
          ![
            "",
            "confirmed",
            "activated",
            "structurally_supported",
          ].includes(
            fact.status ?? "",
          ),
      ),
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
      fact.brief,
      fact.meaning,
      fact.text,
      fact.description,
      fact.name,
      fact.label,
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