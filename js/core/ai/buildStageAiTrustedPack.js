const STAGE_LABELS = {
  luck: "大运",
  year: "流年",
  month: "流月",
};

const STATUS_ORDER = {
  direct: 0,
  inferred: 1,
  background: 2,
  condition_only: 8,
  unresolved: 9,
  arch_condition: 10,
};

const STEM_META = {
  甲: { element: "木", polarity: "yang" },
  乙: { element: "木", polarity: "yin" },
  丙: { element: "火", polarity: "yang" },
  丁: { element: "火", polarity: "yin" },
  戊: { element: "土", polarity: "yang" },
  己: { element: "土", polarity: "yin" },
  庚: { element: "金", polarity: "yang" },
  辛: { element: "金", polarity: "yin" },
  壬: { element: "水", polarity: "yang" },
  癸: { element: "水", polarity: "yin" },
};

const HIDDEN_STEMS = {
  子: ["癸"],
  丑: ["己", "癸", "辛"],
  寅: ["甲", "丙", "戊"],
  卯: ["乙"],
  辰: ["戊", "乙", "癸"],
  巳: ["丙", "戊", "庚"],
  午: ["丁", "己"],
  未: ["己", "丁", "乙"],
  申: ["庚", "壬", "戊"],
  酉: ["辛"],
  戌: ["戊", "辛", "丁"],
  亥: ["壬", "甲"],
};

const HIDDEN_ROLES = [
  "主气",
  "中气",
  "余气",
];

const GENERATES = {
  木: "火",
  火: "土",
  土: "金",
  金: "水",
  水: "木",
};

const CONTROLS = {
  木: "土",
  土: "水",
  水: "火",
  火: "金",
  金: "木",
};

const AUXILIARY_RULES = [
  {
    group: ["申", "子", "辰"],
    peachBlossom: "酉",
    travelHorse: "寅",
    label: "申子辰",
  },
  {
    group: ["寅", "午", "戌"],
    peachBlossom: "卯",
    travelHorse: "申",
    label: "寅午戌",
  },
  {
    group: ["亥", "卯", "未"],
    peachBlossom: "子",
    travelHorse: "巳",
    label: "亥卯未",
  },
  {
    group: ["巳", "酉", "丑"],
    peachBlossom: "午",
    travelHorse: "亥",
    label: "巳酉丑",
  },
];

export function buildStageAiTrustedPack({
  stage = "luck",
  item = {},
  currentLuckItem = null,
  yearItem = null,
  baseBaziViewModel = {},
  natalImageReport = {},
} = {}) {
  const normalizedStage =
    STAGE_LABELS[stage]
      ? stage
      : "luck";

  const natalFacts =
    compactNatalFacts(
      baseBaziViewModel,
    );

  const resolvedLuck =
    item?.currentLuckItem ||
    currentLuckItem ||
    (
      normalizedStage === "luck"
        ? item
        : null
    );

  const resolvedYear =
    item?.yearItem ||
    yearItem ||
    (
      normalizedStage === "year"
        ? item
        : null
    );

  const resolvedMonth =
    normalizedStage === "month"
      ? item
      : null;

  const relationFacts = array(
    item?.transitStructure?.facts,
  )
    .map(compactRelationFact)
    .filter(
      (fact) =>
        fact.id &&
        fact.type,
    )
    .sort((left, right) =>
      (STATUS_ORDER[left.status] ?? 99) -
      (STATUS_ORDER[right.status] ?? 99)
    )
    .slice(0, 100);

  const natalImages = array(
    natalImageReport?.imageCards,
  )
    .map(compactNatalImage)
    .filter(Boolean);

  const mechanicalSignals =
    buildMechanicalSignals({
      natalFacts,
      gender:
        natalFacts.gender,
      luck: resolvedLuck,
      year: resolvedYear,
      month: resolvedMonth,
    });

  const allowedEvidenceRefs =
    unique([
      ...relationFacts.map(
        (fact) => fact.id,
      ),
      ...natalImages.map(
        (entry) => entry.id,
      ),
    ]);

  return {
    schemaVersion:
      "stage-ai-source-v4",
    stage: normalizedStage,
    stageLabel:
      STAGE_LABELS[
        normalizedStage
      ],
    target: buildTarget(
      normalizedStage,
      item,
    ),

    factualContext: {
      natal: natalFacts,
      luck: compactStageLayer(
        resolvedLuck,
        mechanicalSignals
          .layers
          .luck,
      ),
      year: compactStageLayer(
        resolvedYear,
        mechanicalSignals
          .layers
          .year,
      ),
      month:
        normalizedStage ===
        "month"
          ? compactStageLayer(
              resolvedMonth,
              mechanicalSignals
                .layers
                .month,
            )
          : null,
    },

    relationFacts,

    mechanicalSignals,

    candidateInterpretations: {
      natalStructure:
        baseBaziViewModel
          ?.structureAnalysis ??
        null,
      natalSummary:
        natalImageReport?.summary ??
        null,
      natalImages,
    },

    allowedEvidenceRefs,

    boundaries: [
      "factualContext、relationFacts 与 mechanicalSignals 是当前阶段的机械事实基础。",
      "candidateInterpretations 只包含原局候选取象，不包含前端生成的岁运故事。",
      "原局候选取象不是事实，也不是必须采用的结论。",
      "同一十神或结构可能落在多个现实场景，必须比较多组机械信号后再排序。",
      "选择证据汇合最多的表现作为主要可能；有第二组支持时可写次要可能；只有单一泛义支持的最弱可能不写。",
      "不得默认当事人正在工作、在校、已婚或已有子女。",
      "年柱被触发不自动等于父母、房产或家庭大事。",
      "时柱被触发不自动等于实际子女、迁移或项目交付。",
      "关系方向必须服从 relationFacts.meta，不得重新猜测谁生谁、谁克谁。",
      "条件组合不能写成已经成局、已经合化或必然应事。",
      "神煞、藏干和宫位只能辅助，不能单独推出确定事件。",
    ],
  };
}

function compactNatalFacts(
  viewModel = {},
) {
  const pillars = array(
    viewModel?.pillars,
  ).map((pillar) => ({
    key: text(pillar?.key),
    name: text(
      pillar?.name ||
      pillar?.label,
    ),
    stem: text(pillar?.stem),
    branch: text(
      pillar?.branch,
    ),
    ganZhi: text(
      pillar?.pillar ||
      pillar?.ganZhi ||
      pillar?.label,
    ),
    stemTenGod: text(
      pillar?.stemTenGod,
    ),
    branchMainTenGod: text(
      pillar
        ?.branchMainTenGod,
    ),
    hiddenStems: array(
      pillar?.hiddenStems,
    ).map((hidden) => ({
      stem: text(
        hidden?.stem,
      ),
      tenGod: text(
        hidden?.tenGod,
      ),
      role: text(
        hidden?.role,
      ),
    })),
    shensha: compactShensha(
      pillar?.shensha,
    ),
  }));

  return {
    gender: text(
      viewModel?.birthInfo
        ?.gender ||
      "unknown",
    ),
    pillars,
    dayMaster:
      findDayPillar(
        pillars,
      )?.stem ||
      "",
    fiveElements:
      viewModel?.fiveElements ??
      null,
  };
}

function buildMechanicalSignals({
  natalFacts,
  gender,
  luck,
  year,
  month,
} = {}) {
  const dayPillar =
    findDayPillar(
      natalFacts?.pillars,
    );

  const yearPillar =
    findPillar(
      natalFacts?.pillars,
      "year",
      "年",
    );

  const normalizedGender =
    normalizeGender(gender);

  const spouseTenGods =
    normalizedGender === "male"
      ? ["正财", "偏财"]
      : normalizedGender === "female"
        ? ["正官", "七杀"]
        : [];

  const context = {
    dayStem:
      dayPillar?.stem ||
      "",
    dayBranch:
      dayPillar?.branch ||
      "",
    yearBranch:
      yearPillar?.branch ||
      "",
    natalPillars:
      natalFacts?.pillars ||
      [],
    spouseTenGods,
  };

  const layers = {
    luck: buildLayerSignals(
      "luck",
      luck,
      context,
    ),
    year: buildLayerSignals(
      "year",
      year,
      context,
    ),
    month: buildLayerSignals(
      "month",
      month,
      context,
    ),
  };

  return {
    dayMaster: {
      stem:
        context.dayStem,
      element:
        STEM_META[
          context.dayStem
        ]?.element ||
        "",
      polarity:
        STEM_META[
          context.dayStem
        ]?.polarity ||
        "",
    },
    spouseStarRule: {
      gender:
        normalizedGender,
      tenGods:
        spouseTenGods,
      rule:
        normalizedGender ===
        "male"
          ? "男命以正财、偏财为配偶星候选。"
          : normalizedGender ===
              "female"
            ? "女命以正官、七杀为配偶星候选。"
            : "性别信息不足，不自动指定配偶星。",
    },
    layers,
    convergence:
      buildConvergence(
        layers,
      ),
  };
}

function buildLayerSignals(
  layer,
  item,
  context,
) {
  const ganZhi = text(
    item?.ganZhi,
  );

  const {
    stem,
    branch,
  } = splitGanZhi(ganZhi);

  if (!stem && !branch) {
    return null;
  }

  const hiddenStems =
    getStageHiddenStems(
      item,
      branch,
      context.dayStem,
    );

  const stemTenGod =
    text(
      item?.stemTenGod ||
      item?.tenGod,
    ) ||
    getTenGod(
      context.dayStem,
      stem,
    );

  const branchMainTenGod =
    text(
      item
        ?.branchMainTenGod ||
      item
        ?.branchTenGod,
    ) ||
    hiddenStems[0]?.tenGod ||
    "";

  const spouseStarHits = [
    stemTenGod
      ? {
          location:
            "天干",
          stem,
          tenGod:
            stemTenGod,
        }
      : null,
    ...hiddenStems.map(
      (entry) => ({
        location:
          `地支藏干·${entry.role}`,
        stem:
          entry.stem,
        tenGod:
          entry.tenGod,
      }),
    ),
  ]
    .filter(Boolean)
    .filter((entry) =>
      context.spouseTenGods.includes(
        entry.tenGod,
      ),
    );

  return {
    layer,
    ganZhi,
    stem,
    branch,
    stemTenGod,
    branchMainTenGod,
    hiddenStems,
    spouseStarHits,
    auxiliaryHits:
      buildAuxiliaryHits(
        branch,
        context,
      ),
    natalComparisons:
      buildNatalComparisons(
        stem,
        branch,
        ganZhi,
        context.natalPillars,
      ),
    shensha:
      compactShensha(
        item?.shensha ||
        item?.shenSha ||
        item?.stars,
      ),
  };
}

function getStageHiddenStems(
  item,
  branch,
  dayStem,
) {
  const provided = array(
    item?.hiddenStems,
  );

  const stems =
    provided.length
      ? provided.map(
          (entry) =>
            typeof entry ===
            "string"
              ? {
                  stem:
                    entry,
                }
              : entry,
        )
      : array(
          HIDDEN_STEMS[
            branch
          ],
        ).map(
          (stem) => ({
            stem,
          }),
        );

  return stems
    .map((entry, index) => {
      const stem = text(
        entry?.stem,
      );

      return {
        stem,
        tenGod:
          text(
            entry?.tenGod,
          ) ||
          getTenGod(
            dayStem,
            stem,
          ),
        role:
          text(
            entry?.role,
          ) ||
          HIDDEN_ROLES[
            index
          ] ||
          `藏干${index + 1}`,
      };
    })
    .filter(
      (entry) =>
        entry.stem,
    );
}

function buildNatalComparisons(
  stem,
  branch,
  ganZhi,
  pillars,
) {
  return array(pillars)
    .map((pillar) => {
      const sameStem =
        Boolean(stem) &&
        stem ===
          pillar?.stem;

      const sameBranch =
        Boolean(branch) &&
        branch ===
          pillar?.branch;

      const samePillar =
        Boolean(ganZhi) &&
        ganZhi ===
          pillar?.ganZhi;

      if (
        !sameStem &&
        !sameBranch &&
        !samePillar
      ) {
        return null;
      }

      return {
        targetPillar:
          text(
            pillar?.key,
          ),
        targetPillarName:
          text(
            pillar?.name,
          ),
        targetGanZhi:
          text(
            pillar?.ganZhi,
          ),
        sameStem,
        sameBranch,
        samePillar,
      };
    })
    .filter(Boolean);
}

function buildAuxiliaryHits(
  currentBranch,
  context,
) {
  if (!currentBranch) {
    return [];
  }

  const bases = [
    {
      basisPillar:
        "year",
      basisBranch:
        context.yearBranch,
    },
    {
      basisPillar:
        "day",
      basisBranch:
        context.dayBranch,
    },
  ];

  return bases.flatMap(
    (basis) => {
      const rule =
        AUXILIARY_RULES.find(
          (entry) =>
            entry.group.includes(
              basis.basisBranch,
            ),
        );

      if (!rule) {
        return [];
      }

      const hits = [];

      if (
        currentBranch ===
        rule.peachBlossom
      ) {
        hits.push({
          name: "桃花",
          basisPillar:
            basis.basisPillar,
          basisBranch:
            basis.basisBranch,
          hitBranch:
            currentBranch,
          rule:
            `${rule.label}见${rule.peachBlossom}`,
        });
      }

      if (
        currentBranch ===
        rule.travelHorse
      ) {
        hits.push({
          name: "驿马",
          basisPillar:
            basis.basisPillar,
          basisBranch:
            basis.basisBranch,
          hitBranch:
            currentBranch,
          rule:
            `${rule.label}见${rule.travelHorse}`,
        });
      }

      return hits;
    },
  );
}

function buildConvergence(
  layers,
) {
  const availableLayers =
    Object.entries(layers)
      .filter(
        ([, value]) =>
          Boolean(value),
      );

  const tenGodLayers =
    new Map();

  availableLayers.forEach(
    ([layer, value]) => {
      const signals = [
        value.stemTenGod,
        value
          .branchMainTenGod,
        ...array(
          value.hiddenStems,
        ).map(
          (entry) =>
            entry?.tenGod,
        ),
      ].filter(Boolean);

      unique(signals).forEach(
        (tenGod) => {
          const current =
            tenGodLayers.get(
              tenGod,
            ) ||
            [];

          tenGodLayers.set(
            tenGod,
            unique([
              ...current,
              layer,
            ]),
          );
        },
      );
    },
  );

  return {
    repeatedTenGods: [
      ...tenGodLayers
        .entries(),
    ]
      .filter(
        ([, layerNames]) =>
          layerNames.length >= 2,
      )
      .map(
        ([
          tenGod,
          layerNames,
        ]) => ({
          tenGod,
          layers:
            layerNames,
        }),
      ),
    spouseStarLayers:
      availableLayers
        .filter(
          ([, value]) =>
            array(
              value
                ?.spouseStarHits,
            ).length,
        )
        .map(
          ([layer, value]) => ({
            layer,
            hits:
              value
                .spouseStarHits,
          }),
        ),
    auxiliaryHits:
      availableLayers
        .flatMap(
          ([layer, value]) =>
            array(
              value
                ?.auxiliaryHits,
            ).map(
              (hit) => ({
                layer,
                ...hit,
              }),
            ),
        ),
  };
}

function compactStageLayer(
  item,
  mechanicalLayer,
) {
  if (
    !item &&
    !mechanicalLayer
  ) {
    return null;
  }

  return {
    ganZhi: text(
      item?.ganZhi ||
      mechanicalLayer?.ganZhi,
    ),
    year: numberOrNull(
      item?.year,
    ),
    month: numberOrNull(
      item?.month ||
      item?.flowMonthIndex,
    ),
    ageRange: text(
      item?.ageRange,
    ),
    yearRange: text(
      item?.yearRange,
    ),
    flowMonthLabel: text(
      item?.flowMonthLabel,
    ),
    dateRangeLabel: text(
      item?.dateRangeLabel,
    ),
    stemTenGod:
      mechanicalLayer
        ?.stemTenGod ||
      "",
    branchMainTenGod:
      mechanicalLayer
        ?.branchMainTenGod ||
      "",
    hiddenStems:
      mechanicalLayer
        ?.hiddenStems ||
      [],
    shensha:
      mechanicalLayer
        ?.shensha ||
      [],
  };
}

function getTenGod(
  dayStem,
  otherStem,
) {
  const day =
    STEM_META[dayStem];

  const other =
    STEM_META[otherStem];

  if (!day || !other) {
    return "";
  }

  const samePolarity =
    day.polarity ===
    other.polarity;

  if (
    day.element ===
    other.element
  ) {
    return samePolarity
      ? "比肩"
      : "劫财";
  }

  if (
    GENERATES[
      day.element
    ] === other.element
  ) {
    return samePolarity
      ? "食神"
      : "伤官";
  }

  if (
    GENERATES[
      other.element
    ] === day.element
  ) {
    return samePolarity
      ? "偏印"
      : "正印";
  }

  if (
    CONTROLS[
      day.element
    ] === other.element
  ) {
    return samePolarity
      ? "偏财"
      : "正财";
  }

  if (
    CONTROLS[
      other.element
    ] === day.element
  ) {
    return samePolarity
      ? "七杀"
      : "正官";
  }

  return "";
}

function compactShensha(
  values,
) {
  return array(values)
    .map((entry) =>
      typeof entry ===
      "string"
        ? {
            name:
              text(entry),
            category:
              "",
          }
        : {
            name:
              text(
                entry?.name,
              ),
            category:
              text(
                entry?.category,
              ),
          },
    )
    .filter(
      (entry) =>
        entry.name,
    );
}

function normalizeGender(
  value,
) {
  const normalized =
    text(value)
      .toLowerCase();

  if (
    [
      "男",
      "male",
      "m",
      "man",
    ].includes(
      normalized,
    )
  ) {
    return "male";
  }

  if (
    [
      "女",
      "female",
      "f",
      "woman",
    ].includes(
      normalized,
    )
  ) {
    return "female";
  }

  return "unknown";
}

function findDayPillar(
  pillars,
) {
  return (
    findPillar(
      pillars,
      "day",
      "日",
    ) ||
    null
  );
}

function findPillar(
  pillars,
  key,
  chineseName,
) {
  return (
    array(pillars).find(
      (pillar) =>
        pillar?.key === key,
    ) ||
    array(pillars).find(
      (pillar) =>
        text(
          pillar?.name,
        ).includes(
          chineseName,
        ),
    ) ||
    null
  );
}

function splitGanZhi(
  ganZhi,
) {
  const chars = [
    ...text(ganZhi),
  ];

  return {
    stem:
      STEM_META[
        chars[0]
      ]
        ? chars[0]
        : "",
    branch:
      HIDDEN_STEMS[
        chars[1]
      ]
        ? chars[1]
        : "",
  };
}

function buildTarget(
  stage,
  item,
) {
  if (stage === "luck") {
    return {
      ganZhi: text(
        item?.ganZhi,
      ),
      ageRange: text(
        item?.ageRange,
      ),
      yearRange: text(
        item?.yearRange,
      ),
    };
  }

  if (stage === "year") {
    return {
      year: numberOrNull(
        item?.year,
      ),
      ganZhi: text(
        item?.ganZhi,
      ),
    };
  }

  return {
    year: numberOrNull(
      item?.year,
    ),
    month: numberOrNull(
      item?.month ||
      item?.flowMonthIndex,
    ),
    flowMonthLabel: text(
      item?.flowMonthLabel,
    ),
    dateRangeLabel: text(
      item?.dateRangeLabel,
    ),
    ganZhi: text(
      item?.ganZhi,
    ),
  };
}

function compactRelationFact(
  fact = {},
) {
  return {
    id: text(fact?.id),
    type: text(
      fact?.type,
    ),
    label: text(
      fact?.label,
    ),
    status: text(
      fact?.status ||
      "direct",
    ),
    category: text(
      fact?.category ||
      "direct",
    ),
    source: text(
      fact?.source,
    ),
    participants: unique(
      array(
        fact?.participants,
      ),
    ),
    meta: compactRelationMeta(
      fact?.meta,
    ),
  };
}

function compactRelationMeta(
  value,
) {
  const meta =
    object(value);

  const result = {
    controller: text(
      meta?.controller,
    ),
    controlled: text(
      meta?.controlled,
    ),
    direction: text(
      meta?.direction,
    ),
    targetElement: text(
      meta?.targetElement,
    ),
    transformationStatus: text(
      meta?.transformationStatus,
    ),
    formationStatus: text(
      meta?.formationStatus,
    ),
    conditionType: text(
      meta?.conditionType,
    ),
    parentLevel: text(
      meta?.parentLevel,
    ),
    stemDirection: text(
      meta?.stemDirection,
    ),
    subtype: text(
      meta?.subtype,
    ),
    element: text(
      meta?.element,
    ),
    sourceLevel: text(
      meta?.sourceLevel,
    ),
    targetLevel: text(
      meta?.targetLevel,
    ),
    natalPillar: text(
      meta?.natalPillar,
    ),
    currentStem: text(
      meta?.currentStem,
    ),
    currentBranch: text(
      meta?.currentBranch,
    ),
    targetStem: text(
      meta?.targetStem,
    ),
    targetBranch: text(
      meta?.targetBranch,
    ),
  };

  return Object.fromEntries(
    Object.entries(
      result,
    ).filter(
      ([, entry]) =>
        entry !== "" &&
        entry !== null &&
        entry !== undefined,
    ),
  );
}

function compactNatalImage(
  card = {},
) {
  const id = text(
    card?.id,
  );

  const title = text(
    card?.title,
  );

  const summary =
    shortText(
      card?.image ||
      card?.summary,
      300,
    );

  if (
    !id &&
    !title &&
    !summary
  ) {
    return null;
  }

  return {
    id,
    title,
    summary,
    evidence: unique(
      array(
        card?.evidence,
      ),
    ),
  };
}

function numberOrNull(
  value,
) {
  const numeric =
    Number(value);

  return Number.isFinite(
    numeric,
  )
    ? numeric
    : null;
}

function shortText(
  value,
  maxLength = 160,
) {
  const normalized =
    text(value)
      .replace(
        /\s+/g,
        " ",
      )
      .trim();

  if (
    normalized.length <=
    maxLength
  ) {
    return normalized;
  }

  return `${normalized.slice(
    0,
    Math.max(
      0,
      maxLength - 1,
    ),
  )}…`;
}

function text(value) {
  return value ===
    undefined ||
    value === null
    ? ""
    : String(
        value,
      ).trim();
}

function unique(values) {
  return [
    ...new Set(
      array(values)
        .map(text)
        .filter(Boolean),
    ),
  ];
}

function array(value) {
  return Array.isArray(
    value,
  )
    ? value
    : value ===
          undefined ||
        value === null
      ? []
      : [value];
}

function object(value) {
  return value &&
    typeof value ===
      "object" &&
    !Array.isArray(value)
    ? value
    : {};
}
