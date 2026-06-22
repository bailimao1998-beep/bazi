export const NATAL_STRUCTURE_SYNOPSIS_VERSION =
  "natal-structure-synopsis-v2";

const pillarKeys = [
  "year",
  "month",
  "day",
  "hour",
];

const pillarLabels = {
  year: "年柱",
  month: "月柱",
  day: "日柱",
  hour: "时柱",
};

const elementLabels = {
  wood: "木",
  fire: "火",
  earth: "土",
  metal: "金",
  water: "水",
};

const elementKeysByLabel = {
  木: "wood",
  火: "fire",
  土: "earth",
  金: "metal",
  水: "water",
};

const generates = {
  wood: "fire",
  fire: "earth",
  earth: "metal",
  metal: "water",
  water: "wood",
};

const controls = {
  wood: "earth",
  earth: "water",
  water: "fire",
  fire: "metal",
  metal: "wood",
};

const generatedBy =
  invertMap(generates);

const controlledBy =
  invertMap(controls);

const tenGodGroupLabels = {
  peer: "比劫",
  resource: "印星",
  output: "食伤",
  wealth: "财星",
  officer: "官杀",
};

const tenGodGroupMembers = {
  peer: [
    "比肩",
    "劫财",
    "日主",
  ],

  resource: [
    "正印",
    "偏印",
  ],

  output: [
    "食神",
    "伤官",
  ],

  wealth: [
    "正财",
    "偏财",
  ],

  officer: [
    "正官",
    "七杀",
  ],
};

export function buildNatalStructureSynopsis(
  featureVector = {},
) {
  const dayMaster =
    featureVector.dayMaster ?? {};

  const pillars =
    featureVector.pillars ?? {};

  const elements =
    featureVector.elements ?? {};

  const tenGods =
    featureVector.tenGods ?? {};

  const climateProfile =
    featureVector
      .climateProfile ?? {};

  const gender =
    normalizeText(
      featureVector.meta?.gender,
    ) || "unknown";

  const dayElementKey =
    resolveElementKey(
      dayMaster.element,
    );

  const strengthState =
    resolveStrengthState({
        label:
        dayMaster.strengthLevel,

        score:
        dayMaster.strengthScore,

        inSeason:
        dayMaster.inSeason,

        rootLevel:
        dayMaster.rootLevel,
    });

  const elementCounts =
    normalizeElementCounts(
      elements.counts,
    );

  const elementOrder =
    Object.entries(
      elementCounts,
    )
      .sort(
        (left, right) =>
          right[1] -
          left[1],
      );

  const groupProfiles =
    Object.fromEntries(
      Object.keys(
        tenGodGroupMembers,
      ).map(
        (groupKey) => [
          groupKey,
          buildGroupProfile(
            groupKey,
            tenGods,
          ),
        ],
      ),
    );

  const dominantGroups =
    Object.values(
      groupProfiles,
    )
      .filter(
        (profile) =>
          profile.totalCount >=
            1.5 ||
          profile.status ===
            "strong",
      )
      .sort(compareGroupProfiles)
      .map(
        (profile) =>
          profile.key,
      );

  const weakGroups =
    Object.values(
      groupProfiles,
    )
      .filter(
        (profile) =>
          profile.totalCount <=
          0.6,
      )
      .sort(compareGroupProfiles)
      .map(
        (profile) =>
          profile.key,
      );

  const repeatedPillars =
    findRepeatedPillars(
      pillars,
    );

  const repeatedBranches =
    findRepeatedBranches(
      pillars,
    );

  const relativeElements =
    buildRelativeElementMap(
      dayElementKey,
    );

  const balance =
    buildBalanceProfile({
      strengthState,
      relativeElements,
      climateProfile,
    });

  const dayMasterLine =
    buildDayMasterLine({
      dayMaster,
      pillars,
      strengthState,
    });

  const tenGodLine =
    buildTenGodLine({
      groupProfiles,
      dominantGroups,
      weakGroups,
    });

  const elementLine =
    buildElementLine({
      elementOrder,
      elements,
    });

  const visibilityLine =
    buildVisibilityLine(
      groupProfiles,
    );

  const repetitionLine =
    buildRepetitionLine({
      repeatedPillars,
      repeatedBranches,
    });

  const climateLine =
    buildClimateLine(
      climateProfile,
    );

  const headline =
    buildHeadline({
      dayMaster,
      pillars,
      strengthState,
      dominantGroups,
    });

  const keyPoints =
    uniqueText([
        dayMasterLine,
        tenGodLine,
        elementLine,
        visibilityLine,
        repetitionLine,
        climateLine,
    ]).filter(Boolean);

  const summary =
    joinSentences(
      keyPoints.slice(0, 5),
    );

  const domainBaselines =
    buildDomainBaselines({
      dayMaster,
      strengthState,
      groupProfiles,
      elementLine,
      climateLine,
      balance,
      gender,
      elementCounts,
      repetitionLine,
    });

  const warnings = [];

  if (!dayMaster.stem) {
    warnings.push(
      "day_master_stem_missing",
    );
  }

  if (!pillars.month?.branch) {
    warnings.push(
      "month_branch_missing",
    );
  }

  if (
    strengthState ===
    "unknown"
  ) {
    warnings.push(
      "strength_state_unknown",
    );
  }

  if (
    !Object.values(
      elementCounts,
    ).some(
      (count) =>
        count > 0,
    )
  ) {
    warnings.push(
      "element_counts_missing",
    );
  }

  return {
    version:
      NATAL_STRUCTURE_SYNOPSIS_VERSION,

    title:
      "原局基础总纲",

    headline,

    summary,

    keyPoints,

    dayMaster: {
      stem:
        normalizeText(
          dayMaster.stem,
        ),

      element:
        normalizeText(
          dayMaster.element,
        ),

      elementKey:
        dayElementKey,

      strengthLevel:
        normalizeText(
          dayMaster
            .strengthLevel,
        ),

      strengthState,

      strengthScore:
        finiteOrNull(
          dayMaster
            .strengthScore,
        ),

      inSeason:
        Boolean(
          dayMaster.inSeason,
        ),

      rootLevel:
        normalizeText(
          dayMaster.rootLevel,
        ),
    },

    monthCommand: {
      branch:
        normalizeText(
          pillars.month
            ?.branch,
        ),

      label:
        normalizeText(
          pillars.month
            ?.label,
        ),
    },

    elements: {
      counts:
        elementCounts,

      dominant:
        elementOrder
          .filter(
            ([, count]) =>
              count > 0,
          )
          .slice(0, 2)
          .map(
            ([key]) =>
              key,
          ),

      weakest:
        resolveWeakestElements(
          elementOrder,
        ),

      line:
        elementLine,
    },

    tenGods: {
      groups:
        groupProfiles,

      dominantGroups,

      weakGroups,

      line:
        tenGodLine,

      visibilityLine,
    },

    repetition: {
      repeatedPillars,

      repeatedBranches,

      line:
        repetitionLine,
    },

    climate: {
      line:
        climateLine,

      tendencies:
        climateProfile
          .tendencies ?? {},

      priorityNeeds:
        Array.isArray(
          climateProfile
            .priorityNeeds,
        )
          ? climateProfile
              .priorityNeeds
          : [],
    },

    relativeElements,

    balance,

    domainBaselines,

    confidence:
      calculateConfidence({
        dayMaster,
        pillars,
        strengthState,
        elementCounts,
      }),

    boundary:
      "本总纲只根据出生原局的月令、根气、强弱、五行和十神分布建立全局基准；平衡方向属于候选，不等同于脱离全局直接确定最终用神。",

    warnings,
  };
}

function buildGroupProfile(
  groupKey,
  tenGods,
) {
  const names =
    tenGodGroupMembers[
      groupKey
    ] ?? [];

  const visibleCount =
    sumNamedCounts(
      tenGods
        .stemVisibleCounts,
      names,
    );

  const mainQiCount =
    sumNamedCounts(
      tenGods
        .branchMainQiCounts,
      names,
    );

  const totalCount =
    sumNamedCounts(
      tenGods
        .weightedCounts,
      names,
    );

  let status =
    "weak";

  if (totalCount >= 3) {
    status =
      "strong";
  } else if (
    visibleCount > 0
  ) {
    status =
      "visible";
  } else if (
    totalCount >= 0.5 ||
    mainQiCount > 0
  ) {
    status =
      "hidden";
  }

  return {
    key:
      groupKey,

    label:
      tenGodGroupLabels[
        groupKey
      ] || groupKey,

    visibleCount:
      round(
        visibleCount,
      ),

    mainQiCount:
      round(
        mainQiCount,
      ),

    totalCount:
      round(
        totalCount,
      ),

    status,
  };
}

function buildDayMasterLine({
  dayMaster,
  pillars,
  strengthState,
}) {
  const parts = [];

  const stem =
    normalizeText(
      dayMaster.stem,
    );

  const element =
    normalizeText(
      dayMaster.element,
    );

  const monthBranch =
    normalizeText(
      pillars.month?.branch,
    );

  if (stem || element) {
    parts.push(
      `${stem}${element}日主`,
    );
  }

  if (monthBranch) {
    parts.push(
      `生于${monthBranch}月`,
    );
  }

  if (monthBranch) {
    parts.push(
      dayMaster.inSeason
        ? "月令得令"
        : "月令未直接得令",
    );
  }

  const rootLevel =
    normalizeText(
      dayMaster.rootLevel,
    );

  if (
    rootLevel &&
    rootLevel !== "unknown"
  ) {
    parts.push(
      `根气${rootLevel}`,
    );
  }

  const strengthLabel =
    normalizeText(
      dayMaster.strengthLevel,
    );

  if (
    strengthLabel &&
    strengthLabel !== "unknown"
  ) {
    parts.push(
      `日主强弱初判为${strengthLabel}`,
    );
  } else if (
    strengthState !==
    "unknown"
  ) {
    parts.push(
      `日主整体${strengthStateLabel(
        strengthState,
      )}`,
    );
  }

  return parts.length
    ? `${parts.join("，")}`
    : "";
}

function buildTenGodLine({
  groupProfiles,
  dominantGroups,
  weakGroups,
}) {
  const dominantText =
    dominantGroups
      .slice(0, 2)
      .map(
        (key) =>
          tenGodGroupLabels[
            key
          ] || key,
      )
      .join("、");

  const weakText =
    weakGroups
      .slice(0, 2)
      .map(
        (key) =>
          tenGodGroupLabels[
            key
          ] || key,
      )
      .join("、");

  if (
    dominantText &&
    weakText
  ) {
    return `十神力量以${dominantText}较集中，${weakText}相对偏弱`;
  }

  if (dominantText) {
    return `十神力量以${dominantText}较集中`;
  }

  const strongest =
    Object.values(
      groupProfiles,
    )
      .sort(
        compareGroupProfiles,
      )[0];

  return strongest
    ? `十神力量目前以${strongest.label}较为明显`
    : "";
}

function buildElementLine({
  elementOrder,
  elements,
}) {
  const present =
    elementOrder.filter(
      ([, count]) =>
        count > 0,
    );

  if (!present.length) {
    return "";
  }

  const dominantText =
    present
      .slice(0, 2)
      .map(
        ([key]) =>
          elementLabels[key],
      )
      .join("、");

  const weakest =
    resolveWeakestElements(
      elementOrder,
    );

  const weakestText =
    weakest
      .map(
        (key) =>
          elementLabels[key],
      )
      .join("、");

  const biasLevel =
    normalizeText(
      elements.biasLevel,
    );

  if (
    weakestText &&
    dominantText
  ) {
    return `五行以${dominantText}较集中，${weakestText}相对不足${
      biasLevel &&
      biasLevel !== "unknown"
        ? `，整体呈${biasLevel}`
        : ""
    }`;
  }

  return `五行以${dominantText}较集中`;
}

function buildVisibilityLine(
  groupProfiles,
) {
  const visible =
    Object.values(
      groupProfiles,
    )
      .filter(
        (profile) =>
          profile.visibleCount >
          0,
      )
      .sort(
        (left, right) =>
          right.visibleCount -
          left.visibleCount,
      )
      .slice(0, 3)
      .map((profile) => {
        if (
          profile.visibleCount >=
          2
        ) {
          return `${profile.label}透干较明显`;
        }

        return `${profile.label}有透出`;
      });

  return visible.length
    ? visible.join("，")
    : "";
}

function buildRepetitionLine({
  repeatedPillars,
  repeatedBranches,
}) {
  if (
    repeatedPillars.length
  ) {
    return repeatedPillars
      .map(
        (item) =>
          `${item.pillarLabels.join(
            "与",
          )}同为${item.label}，柱位重复明显`,
      )
      .join("；");
  }

  if (
    repeatedBranches.length
  ) {
    return repeatedBranches
      .map(
        (item) =>
          `${item.pillarLabels.join(
            "、",
          )}同见${item.branch}`,
      )
      .join("；");
  }

  return "";
}

function buildClimateLine(
  climateProfile,
) {
  const temperature =
    normalizeText(
      climateProfile
        .tendencies
        ?.temperature,
    );

  const moisture =
    normalizeText(
      climateProfile
        .tendencies
        ?.moisture,
    );

  const parts = [];

  const temperatureLabel = {
    cold: "寒",
    warm: "暖",
    balanced: "寒暖较平",
    mixed: "寒暖并见",
  }[temperature];

  const moistureLabel = {
    dry: "偏燥",
    wet: "偏湿",
    balanced: "燥湿较平",
    mixed: "燥湿并见",
  }[moisture];

  if (temperatureLabel) {
    parts.push(
      temperatureLabel,
    );
  }

  if (moistureLabel) {
    parts.push(
      moistureLabel,
    );
  }

  return parts.length
    ? `调候方面${parts.join("、")}`
    : "";
}

function buildHeadline({
  dayMaster,
  pillars,
  strengthState,
  dominantGroups,
}) {
  const stem =
    normalizeText(
      dayMaster.stem,
    );

  const element =
    normalizeText(
      dayMaster.element,
    );

  const monthBranch =
    normalizeText(
      pillars.month?.branch,
    );

  const dominant =
    dominantGroups
      .slice(0, 2)
      .map(
        (key) =>
          tenGodGroupLabels[
            key
          ],
      )
      .filter(Boolean)
      .join("、");

  const parts = [
    stem || element
      ? `${stem}${element}日主`
      : "",

    monthBranch
      ? `${monthBranch}月`
      : "",

    dominant
      ? `${dominant}较重`
      : "",

    strengthState !==
      "unknown"
      ? `日主${strengthStateLabel(
          strengthState,
        )}`
      : "",
  ].filter(Boolean);

  return parts.join("，");
}

function buildBalanceProfile({
  strengthState,
  relativeElements,
  climateProfile,
}) {
  let favorableGroups = [];
  let cautionGroups = [];

  if (
    strengthState ===
    "strong"
  ) {
    favorableGroups = [
      "output",
      "wealth",
      "officer",
    ];

    cautionGroups = [
      "peer",
      "resource",
    ];
  } else if (
    strengthState ===
    "weak"
  ) {
    favorableGroups = [
      "peer",
      "resource",
    ];

    cautionGroups = [
      "output",
      "wealth",
      "officer",
    ];
  }

  const groupElements =
    favorableGroups
      .map(
        (groupKey) =>
          relativeElements[
            groupKey
          ],
      )
      .filter(Boolean);

  const climateCandidates =
    normalizeElementKeyArray(
      climateProfile
        .candidateElements,
    );

  const climatePriority =
    climateCandidates.filter(
      (element) =>
        groupElements.includes(
          element,
        ),
    );

  const favorableElements =
    uniqueText([
      ...climatePriority,
      ...groupElements,
      ...(
        strengthState ===
        "unknown"
          ? climateCandidates
          : []
      ),
    ]);

  const cautionElements =
    uniqueText(
      cautionGroups
        .map(
          (groupKey) =>
            relativeElements[
              groupKey
            ],
        )
        .filter(Boolean),
    );

  let text = "";

  if (
    favorableElements.length &&
    cautionElements.length
  ) {
    text =
      `从原局平衡角度，可优先观察${formatElementKeys(
        favorableElements,
      )}的调节作用，${formatElementKeys(
        cautionElements,
      )}不宜继续无条件堆叠`;
  } else if (
    favorableElements.length
  ) {
    text =
      `从原局平衡角度，可优先观察${formatElementKeys(
        favorableElements,
      )}的调节作用`;
  }

  return {
    favorableGroups,

    favorableElements,

    cautionGroups,

    cautionElements,

    text,

    boundary:
      "平衡方向只作候选提示，最终仍需结合格局、调候、做工与现实反馈复核。",
  };
}

function buildDomainBaselines({
  dayMaster,
  strengthState,
  groupProfiles,
  elementLine,
  climateLine,
  balance,
  gender,
  elementCounts,
  repetitionLine,
}) {
  const resource =
    groupProfiles.resource;

  const peer =
    groupProfiles.peer;

  const output =
    groupProfiles.output;

  const wealth =
    groupProfiles.wealth;

  const officer =
    groupProfiles.officer;

  const spouseGroup =
    gender === "male"
      ? wealth
      : gender === "female"
        ? officer
        : null;

  const dayMasterName =
    `${normalizeText(
      dayMaster.stem,
    )}${normalizeText(
      dayMaster.element,
    )}`;

  return {
    self:
      joinSentences([
        dayMasterName
          ? `${dayMasterName}日主整体${strengthStateLabel(
              strengthState,
            )}，个人标准、主见和承载意识较明显`
          : "",

        groupNarrative(
          resource,
          {
            strong:
              "印星力量集中，学习吸收、规则意识和内在安全需求较强",

            visible:
              "印星有明显透出，重视学习、依据、规则和确定性",

            hidden:
              "印星藏于地支，遇到重要问题时习惯先理解和消化",

            weak:
              "印星力量不算明显，安全感更多需要从现实经验中建立",
          },
        ),

        groupNarrative(
          peer,
          {
            strong:
              "比劫力量集中，自我标准较强，也容易在同辈关系中出现比较和竞争",

            visible:
              "比劫有明显透出，主见、边界感和同辈意识较强",

            hidden:
              "比劫主要藏于地支，外表未必强势，但内在有自己的尺度",

            weak:
              "比劫力量偏弱，个人主见和竞争意识通常不会过度外显",
          },
        ),

        repetitionLine,
      ]),

    parents:
      groupNarrative(
        resource,
        {
          strong:
            "印星力量集中，家庭教育、长辈经验和早年规则对命主影响较深，获得支持的同时也容易承受期待",

          visible:
            "印星有明显透出，家庭教育、长辈意见和规则要求对个人选择影响较深",

          hidden:
            "印星主要藏于地支，长辈影响往往通过生活经验、实际照顾或潜在观念体现",

          weak:
            "印星力量偏弱，父母家庭方面不宜只凭印星作过多判断",
        },
      ),

    siblings:
      groupNarrative(
        peer,
        {
          strong:
            "比劫力量集中，兄弟同辈之间容易同时出现合作、比较、竞争和资源边界问题",

          visible:
            "比劫有明显透出，同辈互动、合作分工和彼此比较较为明显",

          hidden:
            "比劫主要藏于地支，同辈关系表面未必激烈，但利益和距离仍会影响相处",

          weak:
            "比劫力量偏弱，兄弟同辈方面缺少足够强的原局主象",
        },
      ),

    spouse:
      spouseGroup
        ? groupNarrative(
            spouseGroup,
            {
              strong:
                "配偶星力量较集中，感情和现实责任容易成为人生中的重要议题",

              visible:
                "配偶星有明显透出，感情态度和择偶标准较容易直接表现",

              hidden:
                "配偶星主要藏于地支，感情表达和现实投入通常偏谨慎，往往需要经过观察确认后才容易稳定投入",

              weak:
                "配偶星力量偏弱或不显，感情发展通常不宜操之过急，需要结合夫妻宫和现实关系进一步判断",
            },
          )
        : "配偶星需要结合性别映射，目前主要观察夫妻宫、关系结构和现实互动。",

    children:
      groupNarrative(
        output,
        {
          strong:
            "食伤力量集中，子女、作品、表达和项目成果是较明显的人生出口",

          visible:
            "食伤有明显透出，表达、创作和成果展示较容易直接体现",

          hidden:
            "食伤主要藏于地支，表达和成果并非没有出口，但通常需要环境推动和持续训练",

          weak:
            "食伤力量偏弱，容易出现准备较多、表达偏慢或成果显化不足的情况",
        },
      ),

    wealth:
      groupNarrative(
        wealth,
        {
          strong:
            "财星力量集中，现实资源、收益和财富安排在命局中较为重要",

          visible:
            "财星有明显透出，对收益、资源和现实结果的关注较直接",

          hidden:
            "财星主要藏于地支，财富机会并非没有，但更依赖长期积累、现实条件和稳定承接",

          weak:
            "财星力量偏弱或不显，财富更适合依靠专业能力、长期积累和清楚的资源边界取得",
        },
      ),

    health:
      joinSentences([
        elementLine
          ? `${elementLine}，身体状态更容易受到作息、压力和生活环境影响`
          : "",

        climateLine
          ? `${climateLine}，需要重视寒暖燥湿和长期恢复节奏`
          : "",
      ]),

    movement:
      "",

    friends:
      groupNarrative(
        peer,
        {
          strong:
            "比劫力量集中，朋友合作、圈层竞争和资源往来对现实发展影响较明显",

          visible:
            "比劫有明显透出，人际合作中重视平等、边界和彼此投入",

          hidden:
            "比劫主要藏于地支，人际关系表面平和，但利益和资源问题仍会影响距离",

          weak:
            "比劫力量偏弱，交友人脉方面缺少特别集中的原局主象",
        },
      ),

    career:
      joinSentences([
        groupNarrative(
          officer,
          {
            strong:
              "官杀力量集中，岗位责任、规则压力和社会角色是事业发展的重要主轴",

            visible:
              "官杀有明显透出，容易直接面对岗位要求、责任和评价体系",

            hidden:
              "官杀主要藏于地支，事业责任和社会位置需要通过现实经历逐步显现",

            weak:
              "官杀力量偏弱或不显，职业发展更需要依靠专业积累、实际成果和后天平台建立位置",
          },
        ),

        groupNarrative(
          output,
          {
            strong:
              "食伤力量集中，职业成果、表达和交付能力较容易形成现实价值",

            visible:
              "食伤有明显透出，职业中的表达、展示和成果输出较直接",

            hidden:
              "食伤藏于地支但仍有出口，职业成果需要持续训练和现实推动",

            weak:
              "食伤力量偏弱，事业上容易学习准备较多，而成果表达、展示和及时交付偏慢",
          },
        ),
      ]),

    property:
      elementCounts.earth > 0
        ? "田宅资产方面主要观察资源沉淀、稳定承载和居住安排，不直接据此判断具体房产结果。"
        : "田宅资产方面缺少足够直接的高阶信号，不宜只凭原局判断具体房产结果。",

    fortune:
      joinSentences([
        groupNarrative(
          resource,
          {
            strong:
              "印星力量集中，内在安全感较依赖学习、理解、规则和可控感",

            visible:
              "印星有明显透出，习惯通过学习、理解和掌握方法稳定内心",

            hidden:
              "印星主要藏于地支，很多想法会先在内部消化，不一定马上表达",

            weak:
              "印星力量偏弱，精神安全感更需要从现实经验和外部支持中建立",
          },
        ),

        groupNarrative(
          output,
          {
            strong:
              "食伤力量集中，情绪、思想和表达具有较顺畅的现实出口",

            visible:
              "食伤有明显透出，思想和情绪较容易通过表达、创作或行动释放",

            hidden:
              "食伤藏于地支但仍有出口，表达通常需要合适环境和现实推动",

            weak:
              "食伤力量偏弱，容易想得多、表达得少，内部消化时间偏长",
          },
        ),

        climateLine
          ? `${climateLine}，环境和生活节奏会明显影响精神状态`
          : "",

        balance.text,
      ]),
  };
}

function groupNarrative(
  profile,
  phrases = {},
) {
  if (!profile) {
    return "";
  }

  return normalizeText(
    phrases[
      profile.status
    ] ||
    phrases.default ||
    "",
  );
}
function describeGroupInfluence(
  profile,
  topic,
) {
  if (!profile) {
    return "";
  }

  const stateText = {
    strong:
      "力量集中",

    visible:
      "有明显透出",

    hidden:
      "主要藏于地支但仍有落点",

    weak:
      "力量偏弱或不显",
  }[profile.status];

  return `${profile.label}${stateText}，主要影响${topic}`;
}

function findRepeatedPillars(
  pillars,
) {
  const groups = {};

  for (
    const key of pillarKeys
  ) {
    const pillar =
      pillars[key] ?? {};

    const label =
      `${normalizeText(
        pillar.stem,
      )}${normalizeText(
        pillar.branch,
      )}`;

    if (label.length < 2) {
      continue;
    }

    groups[label] ??= [];
    groups[label].push(key);
  }

  return Object.entries(groups)
    .filter(
      ([, keys]) =>
        keys.length > 1,
    )
    .map(
      ([label, keys]) => ({
        label,

        pillarKeys:
          keys,

        pillarLabels:
          keys.map(
            (key) =>
              pillarLabels[key],
          ),
      }),
    );
}

function findRepeatedBranches(
  pillars,
) {
  const groups = {};

  for (
    const key of pillarKeys
  ) {
    const branch =
      normalizeText(
        pillars[key]?.branch,
      );

    if (!branch) {
      continue;
    }

    groups[branch] ??= [];
    groups[branch].push(key);
  }

  return Object.entries(groups)
    .filter(
      ([, keys]) =>
        keys.length > 1,
    )
    .map(
      ([branch, keys]) => ({
        branch,

        pillarKeys:
          keys,

        pillarLabels:
          keys.map(
            (key) =>
              pillarLabels[key],
          ),
      }),
    );
}

function buildRelativeElementMap(
  dayElementKey,
) {
  if (!dayElementKey) {
    return {};
  }

  return {
    peer:
      dayElementKey,

    output:
      generates[
        dayElementKey
      ],

    wealth:
      controls[
        dayElementKey
      ],

    resource:
      generatedBy[
        dayElementKey
      ],

    officer:
      controlledBy[
        dayElementKey
      ],
  };
}

function resolveStrengthState({
  label,
  score,
  inSeason,
  rootLevel,
} = {}) {
  const text =
    normalizeText(label);

  if (
    /从弱|极弱|身弱|偏弱|弱/.test(
      text,
    )
  ) {
    return "weak";
  }

  if (
    /从强|极旺|身旺|偏旺|偏强|旺|强/.test(
      text,
    )
  ) {
    return "strong";
  }

  if (
    /中和|平衡|均衡|中等/.test(
      text,
    )
  ) {
    return "balanced";
  }

  const numericScore =
    finiteOrNull(score);

  if (numericScore !== null) {
    if (numericScore >= 60) {
      return "strong";
    }

    if (numericScore <= 40) {
      return "weak";
    }

    return "balanced";
  }

  const normalizedRoot =
    normalizeText(rootLevel);

  if (
    Boolean(inSeason) &&
    /强|旺|深|有力/.test(
      normalizedRoot,
    )
  ) {
    return "strong";
  }

  if (
    !Boolean(inSeason) &&
    /弱|浅|无根|不显/.test(
      normalizedRoot,
    )
  ) {
    return "weak";
  }

  return "unknown";
}

function strengthStateLabel(
  state,
) {
  return {
    strong: "偏强",
    weak: "偏弱",
    balanced: "较平衡",
    unknown: "待复核",
  }[state] ?? "待复核";
}

function resolveElementKey(
  value,
) {
  const text =
    normalizeText(value);

  if (
    elementLabels[text]
  ) {
    return text;
  }

  return (
    elementKeysByLabel[
      text
    ] ?? ""
  );
}

function normalizeElementCounts(
  value = {},
) {
  return Object.fromEntries(
    Object.keys(
      elementLabels,
    ).map(
      (key) => [
        key,
        Math.max(
          0,
          finite(value[key]),
        ),
      ],
    ),
  );
}

function normalizeElementKeyArray(
  values,
) {
  return uniqueText(
    (
      Array.isArray(values)
        ? values
        : []
    )
      .map(
        resolveElementKey,
      )
      .filter(Boolean),
  );
}

function resolveWeakestElements(
  elementOrder,
) {
  if (!elementOrder.length) {
    return [];
  }

  const minimum =
    elementOrder[
      elementOrder.length - 1
    ][1];

  return elementOrder
    .filter(
      ([, count]) =>
        count === minimum ||
        count <= 0.5,
    )
    .map(
      ([key]) =>
        key,
    )
    .slice(0, 2);
}

function formatElementKeys(
  keys,
) {
  return keys
    .map(
      (key) =>
        elementLabels[key] ||
        key,
    )
    .join("、");
}

function sumNamedCounts(
  source,
  names,
) {
  return names.reduce(
    (sum, name) =>
      sum +
      finite(
        source?.[name],
      ),
    0,
  );
}

function compareGroupProfiles(
  left,
  right,
) {
  return (
    right.totalCount -
    left.totalCount
  );
}

function calculateConfidence({
  dayMaster,
  pillars,
  strengthState,
  elementCounts,
}) {
  const hasDayMaster =
    Boolean(
      dayMaster.stem,
    );

  const hasMonth =
    Boolean(
      pillars.month?.branch,
    );

  const hasElements =
    Object.values(
      elementCounts,
    ).some(
      (count) =>
        count > 0,
    );

  if (
    hasDayMaster &&
    hasMonth &&
    hasElements &&
    strengthState !==
      "unknown"
  ) {
    return "high";
  }

  if (
    hasDayMaster &&
    hasMonth
  ) {
    return "medium";
  }

  return "low";
}

function invertMap(
  value,
) {
  return Object.fromEntries(
    Object.entries(value)
      .map(
        ([key, item]) => [
          item,
          key,
        ],
      ),
  );
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

function joinSentences(
  values,
) {
  return uniqueText(values)
    .map(
      (value) =>
        /[。！？]$/.test(value)
          ? value
          : `${value}。`,
    )
    .join("");
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

function round(
  value,
) {
  return (
    Math.round(
      (
        finite(value) +
        Number.EPSILON
      ) *
        100,
    ) / 100
  );
}

function normalizeText(
  value,
) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .replace(
      /[。；，\s]+$/g,
      "",
    )
    .trim();
}