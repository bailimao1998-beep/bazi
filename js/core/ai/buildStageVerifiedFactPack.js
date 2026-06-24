const STAGE_LABELS = {
  luck: "大运",
  year: "流年",
  month: "流月",
};

const PILLAR_LABELS = {
  year: "年柱",
  month: "月柱",
  day: "日柱",
  hour: "时柱",
};

const RELATION_LABELS = {
  combine: "合",
  harmony: "合",
  stem_combine: "天干五合",
  branch_combine: "地支六合",
  six_harmony: "地支六合",
  clash: "冲",
  branch_clash: "冲",
  punishment: "刑",
  branch_punishment: "刑",
  harm: "害",
  branch_harm: "害",
  break: "破",
  branch_break: "破",
  hidden_combine: "暗合",
  half_harmony: "半合",
  three_harmony: "三合",
  three_meeting: "三会",
  control: "克",
  stem_control: "克",
  same_pillar: "整柱相同",
  same_branch: "同支重复",
  same_stem: "同干重复",
};

const THEME_LABELS = {
  relationship: "感情与重要关系",
  spouse: "感情与重要关系",
  romance: "感情与重要关系",
  peachBlossom: "感情与重要关系",
  standardsReview: "学业资格与规则",
  education: "学业资格与规则",
  qualification: "学业资格与规则",
  officialProcedure: "手续与正式流程",
  planAndResults: "计划执行与成果",
  outputAndRules: "表达输出与规则",
  output: "表达、技能与成果",
  wealth: "资源与收益",
  finance: "资源与收益",
  resource: "资源与收益",
  career: "职业职责与发展",
  work: "职业职责与发展",
  movement: "迁移与环境变化",
  travel: "迁移与环境变化",
  health: "精力与生活节奏",
};

const STEM_ELEMENT = {
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

const STEM_COMBINE_PAIRS = new Set([
  "甲己",
  "乙庚",
  "丙辛",
  "丁壬",
  "戊癸",
]);

const ELEMENT_CONTROLS = {
  木: "土",
  土: "水",
  水: "火",
  火: "金",
  金: "木",
};

const BRANCH_RELATION_PAIRS = {
  地支六合: new Set([
    "子丑",
    "寅亥",
    "卯戌",
    "辰酉",
    "巳申",
    "午未",
  ]),
  冲: new Set([
    "子午",
    "丑未",
    "寅申",
    "卯酉",
    "辰戌",
    "巳亥",
  ]),
  害: new Set([
    "子未",
    "丑午",
    "寅巳",
    "卯辰",
    "申亥",
    "酉戌",
  ]),
  破: new Set([
    "子酉",
    "丑辰",
    "寅亥",
    "卯午",
    "巳申",
    "未戌",
  ]),
};

const THREE_HARMONY_GROUPS = [
  {
    label: "申子辰三合水局",
    branches: ["申", "子", "辰"],
  },
  {
    label: "亥卯未三合木局",
    branches: ["亥", "卯", "未"],
  },
  {
    label: "寅午戌三合火局",
    branches: ["寅", "午", "戌"],
  },
  {
    label: "巳酉丑三合金局",
    branches: ["巳", "酉", "丑"],
  },
];

const THREE_MEETING_GROUPS = [
  {
    label: "亥子丑三会水局",
    branches: ["亥", "子", "丑"],
  },
  {
    label: "寅卯辰三会木局",
    branches: ["寅", "卯", "辰"],
  },
  {
    label: "巳午未三会火局",
    branches: ["巳", "午", "未"],
  },
  {
    label: "申酉戌三会金局",
    branches: ["申", "酉", "戌"],
  },
];

const DOMAIN_DEFINITIONS = [
  {
    id: "ability_output",
    label: "能力输出与技能方向",
    keywords: ["食神", "伤官"],
    allowedClaims: [
      "表达、输出和成果意识增强",
      "更愿意通过实践验证技能",
      "可能探索新的学习或工作方法",
    ],
    forbiddenClaims: [
      "不自动等于考试、考证、竞赛获奖",
      "不自动等于写作、设计或演讲职业",
      "不自动等于兴趣一定变成收入",
    ],
  },
  {
    id: "resource_accumulation",
    label: "资源积累与现实回报",
    keywords: ["正财", "偏财"],
    allowedClaims: [
      "更关注资源配置、投入与回报",
      "现实收益需要条件和持续经营",
      "可能形成新的资源来源或管理需求",
    ],
    forbiddenClaims: [
      "不自动等于兼职、副业、理财或固定储蓄",
      "藏财不等于收入必然增加",
      "不得凭单一财星判断具体金额",
    ],
  },
  {
    id: "rules_responsibility",
    label: "规则、责任与正式要求",
    keywords: ["正官", "七杀"],
    allowedClaims: [
      "外部标准、责任或被评价感增强",
      "需要协调个人方式与正式要求",
      "现实中可能出现更明确的边界",
    ],
    forbiddenClaims: [
      "正官不自动等于贵人、上级或感情对象",
      "七杀不自动等于竞争、事故或强压",
      "不得把一般规则直接写成审批或考试",
    ],
  },
  {
    id: "learning_support",
    label: "学习方式与支持结构",
    keywords: ["正印", "偏印"],
    allowedClaims: [
      "吸收、理解、复盘或依托既有体系",
      "可能得到经验、资料或支持",
    ],
    forbiddenClaims: [
      "印星不自动等于学历、老师或证书",
      "不得仅凭印星判断考试结果",
    ],
  },
  {
    id: "peer_boundary",
    label: "同辈互动与边界",
    keywords: ["比肩", "劫财"],
    allowedClaims: [
      "同辈参与、协作或边界议题增加",
      "资源分配和自主性更受关注",
    ],
    forbiddenClaims: [
      "比劫不自动等于竞争对手或破财",
      "不得直接写资源争夺必然发生",
    ],
  },
  {
    id: "relation_environment_change",
    label: "关系与环境结构变化",
    relationKeywords: [
      "天干五合",
      "地支六合",
      "冲",
      "刑",
      "害",
      "破",
      "三合",
      "三会",
      "同支重复",
      "伏吟",
      "确定生克关系",
      "克",
    ],
    allowedClaims: [
      "相似议题、互动方式或环境结构被重新激活",
      "关系和计划可能需要调整",
      "不同力量之间存在靠近、牵制或变化",
    ],
    forbiddenClaims: [
      "合不自动等于感情或合作成功",
      "冲破不自动等于分手、事故或损失",
      "条件关系不得写成已经成局",
    ],
  },
];


export function buildStageVerifiedFactPack(
  trustedPack = {},
) {
  const stage =
    String(
      trustedPack?.stage ||
      "",
    );

  const factCollector =
    createFactCollector();

  const lifeContext =
    deriveLifeContext(
      trustedPack,
    );

  addLifeStageFact(
    factCollector,
    lifeContext,
  );

  addTargetFact(
    factCollector,
    trustedPack,
  );

  addNatalFacts(
    factCollector,
    trustedPack,
  );

  activeLayerNames(
    stage,
  ).forEach(
    (layerName) => {
      addLayerFacts(
        factCollector,
        trustedPack,
        layerName,
      );
    },
  );

  addRelationFacts(
    factCollector,
    trustedPack,
  );

  addDerivedLayerRelations(
    factCollector,
    trustedPack,
    stage,
  );

  activeLayerNames(
    stage,
  ).forEach(
    (layerName) => {
      addComparisonFacts(
        factCollector,
        trustedPack,
        layerName,
      );
    },
  );

  const facts =
    factCollector.list();

  facts.forEach(
    (fact) => {
      const domains =
        inferFactDomains(
          fact,
        );

      fact.meta = {
        ...(
          fact?.meta &&
          typeof fact.meta ===
            "object"
            ? fact.meta
            : {}
        ),
        domains,
      };
    },
  );

  const domainFactCards =
    buildDomainFactCards(
      facts,
      stage,
    );

  const candidateThemes =
    buildCandidateThemes(
      trustedPack
        ?.evidenceConvergences,
    );

  const domainEvidenceOverview =
    buildDomainEvidenceOverview(
      candidateThemes,
    );

  return {
    stage,
    stageLabel:
      STAGE_LABELS[
        stage
      ] ||
      String(
        trustedPack
          ?.stageLabel ||
        "阶段",
      ),

    target:
      compactTarget(
        trustedPack
          ?.target,
      ),

    lifeContext,

    facts,

    backgroundFacts:
      facts.filter(
        (fact) =>
          !fact.evidenceEligible,
      ),

    evidenceFacts:
      facts.filter(
        (fact) =>
          fact.evidenceEligible,
      ),

    candidateThemes,

    domainEvidenceOverview,

    domainFactCards,

    factIds:
      facts
        .filter(
          (fact) =>
            fact.evidenceEligible,
        )
        .map(
          (fact) =>
            fact.id,
        ),
  };
}

export function buildStageStructuredPromptSource(
  verifiedFactPack = {},
) {
  return {
    报告阶段:
      verifiedFactPack
        ?.stageLabel ||
      "阶段",

    分析目标:
      verifiedFactPack
        ?.target ||
      null,

    人生阶段:
      verifiedFactPack
        ?.lifeContext ||
      null,

    背景资料:
      array(
        verifiedFactPack
          ?.backgroundFacts,
      ).map(
        (fact) =>
          fact.text,
      ),

    可引用事实:
      array(
        verifiedFactPack
          ?.evidenceFacts,
      ).map(
        (fact) => ({
          编号:
            fact.id,
          强度:
            fact.strength,
          类别:
            fact.category,
          事实:
            fact.text,
        }),
      ),

    领域证据排序:
      array(
        verifiedFactPack
          ?.domainEvidenceOverview,
      ),

    领域事实卡:
      array(
        verifiedFactPack
          ?.domainFactCards,
      ),

    候选主题:
      array(
        verifiedFactPack
          ?.candidateThemes,
      ),
  };
}

function addLifeStageFact(
  collector,
  lifeContext,
) {
  if (
    !lifeContext
      ?.lifeStage
  ) {
    return;
  }

  const ageText =
    Number.isFinite(
      lifeContext?.age,
    )
      ? `当前年龄约${lifeContext.age}岁，`
      : "";

  collector.add({
    category:
      "人生阶段",
    strength:
      "背景",
    text:
      `${ageText}人生阶段为${lifeContext.lifeStage}。` +
      `现实场景优先考虑${array(lifeContext.scenePriority).join("、")}。` +
      `${lifeContext.conditionalScenes?.length ? `以下场景只有现实中仍存在对应事务时才展开：${lifeContext.conditionalScenes.join("、")}。` : ""}`,
    sourceRef:
      "life-stage",
    evidenceEligible:
      false,
    meta: {
      lifeContext,
    },
  });
}

function deriveLifeContext(
  trustedPack,
) {
  const target =
    trustedPack?.target ||
    {};

  const natal =
    trustedPack
      ?.factualContext
      ?.natal ||
    {};

  const luck =
    trustedPack
      ?.factualContext
      ?.luck ||
    {};

  const targetYear =
    firstFiniteNumber(
      target?.year,
      parseYearRange(
        target?.yearRange,
      )?.start,
    );

  const directAge =
    firstFiniteNumber(
      target?.age,
      target?.currentAge,
      natal?.age,
      natal?.currentAge,
      luck?.age,
      luck?.currentAge,
    );

  const ageRange =
    parseNumberRange(
      target?.ageRange ||
      luck?.ageRange,
    );

  const yearRange =
    parseYearRange(
      target?.yearRange ||
      luck?.yearRange,
    );

  const birthYear =
    extractBirthYear(
      natal,
    );

  let age =
    directAge;

  let confidence =
    directAge !== null
      ? "直接"
      : "";

  if (
    age ===
      null &&
    targetYear !==
      null &&
    birthYear !==
      null
  ) {
    age =
      targetYear -
      birthYear;
    confidence =
      "推算";
  }

  if (
    age ===
      null &&
    ageRange &&
    yearRange &&
    targetYear !==
      null &&
    targetYear >=
      yearRange.start &&
    targetYear <=
      yearRange.end
  ) {
    age =
      ageRange.start +
      (
        targetYear -
        yearRange.start
      );
    confidence =
      "阶段映射";
  }

  if (
    age ===
      null &&
    ageRange
  ) {
    age =
      Math.floor(
        (
          ageRange.start +
          ageRange.end
        ) /
        2,
      );
    confidence =
      "年龄范围估计";
  }

  if (
    age ===
      null ||
    age <
      0 ||
    age >
      120
  ) {
    return null;
  }

  const lifeStage =
    age >= 70
      ? "晚年"
      : age >= 55
        ? "成熟后期"
        : age >= 35
          ? "中年"
          : age >= 18
            ? "成年早期"
            : age >= 13
              ? "青少年"
              : "童年";

  const sceneConfig =
    lifeStage ===
      "晚年"
      ? {
          scenePriority: [
            "生活节奏与身心承受",
            "家庭和亲友互动",
            "兴趣、经验与精神生活",
            "既有资源和日常收支",
            "社区、老友与社会活动",
          ],
          conditionalScenes: [
            "工作竞争",
            "求职晋升",
            "在校考试",
            "资格申请",
            "副业扩张",
          ],
        }
      : lifeStage ===
          "成熟后期"
        ? {
            scenePriority: [
              "职业与责任调整",
              "家庭和亲友互动",
              "既有资源与长期安排",
              "经验输出和生活节奏",
            ],
            conditionalScenes: [
              "升学考试",
              "求职起步",
            ],
          }
        : {
            scenePriority: [
              "学习与能力",
              "职业和计划",
              "关系与家庭",
              "资源与生活节奏",
            ],
            conditionalScenes: [],
          };

  return {
    age:
      Math.round(
        age,
      ),
    lifeStage,
    confidence,
    ...sceneConfig,
  };
}

function extractBirthYear(
  natal,
) {
  const directKeys = [
    "birthYear",
    "solarYear",
    "gregorianYear",
    "出生年",
    "公历年",
  ];

  for (
    const key of
    directKeys
  ) {
    const value =
      firstFiniteNumber(
        natal?.[key],
      );

    if (
      isPlausibleYear(
        value,
      )
    ) {
      return value;
    }
  }

  const dateKeys = [
    "birthDate",
    "birthday",
    "solarDate",
    "gregorianDate",
    "dateTime",
    "datetime",
    "出生日期",
    "公历日期",
  ];

  for (
    const key of
    dateKeys
  ) {
    const parsed =
      parseYearFromText(
        natal?.[key],
      );

    if (
      isPlausibleYear(
        parsed,
      )
    ) {
      return parsed;
    }
  }

  return findBirthYearDeep(
    natal,
  );
}

function findBirthYearDeep(
  value,
  depth = 0,
) {
  if (
    depth >
      5 ||
    value ===
      null ||
    value ===
      undefined
  ) {
    return null;
  }

  if (
    typeof value ===
    "string"
  ) {
    return parseYearFromText(
      value,
    );
  }

  if (
    Array.isArray(
      value,
    )
  ) {
    for (
      const item of
      value
    ) {
      const found =
        findBirthYearDeep(
          item,
          depth + 1,
        );

      if (
        isPlausibleYear(
          found,
        )
      ) {
        return found;
      }
    }

    return null;
  }

  if (
    typeof value ===
    "object"
  ) {
    for (
      const [
        key,
        child,
      ] of
      Object.entries(
        value,
      )
    ) {
      if (
        /birth|birthday|出生|公历日期|solarDate|gregorianDate/i.test(
          key,
        )
      ) {
        const direct =
          typeof child ===
            "number"
            ? child
            : parseYearFromText(
                child,
              );

        if (
          isPlausibleYear(
            direct,
          )
        ) {
          return direct;
        }
      }

      const nested =
        findBirthYearDeep(
          child,
          depth + 1,
        );

      if (
        isPlausibleYear(
          nested,
        )
      ) {
        return nested;
      }
    }
  }

  return null;
}

function parseYearRange(
  value,
) {
  const range =
    parseNumberRange(
      value,
    );

  if (
    !range ||
    !isPlausibleYear(
      range.start,
    ) ||
    !isPlausibleYear(
      range.end,
    )
  ) {
    return null;
  }

  return range;
}

function parseNumberRange(
  value,
) {
  const normalized =
    normalizeChineseDigits(
      text(
        value,
      ),
    );

  const matches =
    normalized.match(
      /\d{1,4}/g,
    );

  if (
    !matches ||
    matches.length ===
      0
  ) {
    return null;
  }

  const numbers =
    matches
      .map(
        Number,
      )
      .filter(
        Number.isFinite,
      );

  if (
    numbers.length ===
      1
  ) {
    return {
      start:
        numbers[0],
      end:
        numbers[0],
    };
  }

  return {
    start:
      Math.min(
        numbers[0],
        numbers[1],
      ),
    end:
      Math.max(
        numbers[0],
        numbers[1],
      ),
  };
}

function normalizeChineseDigits(
  value,
) {
  return String(
    value || "",
  ).replace(
    /[零〇一二两三四五六七八九十百]+/g,
    (matched) =>
      String(
        chineseNumberToInteger(
          matched,
        ),
      ),
  );
}

function chineseNumberToInteger(
  value,
) {
  const digitMap = {
    零: 0,
    〇: 0,
    一: 1,
    二: 2,
    两: 2,
    三: 3,
    四: 4,
    五: 5,
    六: 6,
    七: 7,
    八: 8,
    九: 9,
  };

  if (
    value.includes(
      "百",
    )
  ) {
    const [
      hundredsPart,
      restPart = "",
    ] =
      value.split(
        "百",
      );

    return (
      (
        digitMap[
          hundredsPart
        ] ||
        1
      ) *
      100
    ) +
    chineseNumberToInteger(
      restPart,
    );
  }

  if (
    value.includes(
      "十",
    )
  ) {
    const [
      tensPart,
      onesPart = "",
    ] =
      value.split(
        "十",
      );

    return (
      (
        tensPart
          ? digitMap[
              tensPart
            ] ||
            0
          : 1
      ) *
      10
    ) +
    (
      onesPart
        ? digitMap[
            onesPart
          ] ||
          0
        : 0
    );
  }

  return value
    .split("")
    .reduce(
      (
        total,
        char,
      ) =>
        total *
          10 +
        (
          digitMap[
            char
          ] ||
          0
        ),
      0,
    );
}

function parseYearFromText(
  value,
) {
  const matched =
    text(
      value,
    ).match(
      /(?:19|20)\d{2}/,
    );

  return matched
    ? Number(
        matched[0],
      )
    : null;
}

function isPlausibleYear(
  value,
) {
  return Number.isFinite(
    value,
  ) &&
    value >=
      1900 &&
    value <=
      2100;
}

function firstFiniteNumber(
  ...values
) {
  for (
    const value of
    values
  ) {
    const number =
      Number(
        value,
      );

    if (
      Number.isFinite(
        number,
      )
    ) {
      return number;
    }
  }

  return null;
}

function addTargetFact(
  collector,
  trustedPack,
) {
  const target =
    trustedPack?.target ||
    {};

  const parts = [
    text(
      target?.ganZhi,
    ),
    text(
      target?.yearRange,
    ),
    text(
      target?.ageRange,
    ),
  ].filter(Boolean);

  if (
    parts.length ===
    0
  ) {
    return;
  }

  collector.add({
    category:
      "分析目标",
    strength:
      "背景",
    text:
      `本次分析目标为${parts.join("，")}。`,
    sourceRef:
      "target",
    evidenceEligible:
      false,
  });
}

function addNatalFacts(
  collector,
  trustedPack,
) {
  const pillars =
    array(
      trustedPack
        ?.factualContext
        ?.natal
        ?.pillars,
    );

  pillars.forEach(
    (pillar) => {
      const pillarLabel =
        PILLAR_LABELS[
          pillar?.key
        ] ||
        text(
          pillar?.label,
        ) ||
        "原局柱位";

      const ganZhi =
        text(
          pillar?.ganZhi,
        ) ||
        `${text(pillar?.stem)}${text(pillar?.branch)}`;

      const stemTenGod =
        text(
          pillar?.stemTenGod,
        );

      const hidden =
        hiddenStemText(
          pillar
            ?.hiddenStems,
        );

      const details = [];

      if (
        stemTenGod
      ) {
        details.push(
          `天干十神为${stemTenGod}`,
        );
      }

      if (
        hidden
      ) {
        details.push(
          `地支藏干为${hidden}`,
        );
      }

      if (
        !ganZhi &&
        details.length ===
          0
      ) {
        return;
      }

      collector.add({
        category:
          "原局基础",
        strength:
          "背景",
        text:
          `${pillarLabel}${ganZhi || ""}` +
          `${details.length ? `，${details.join("，")}` : ""}。`,
        sourceRef:
          `natal:${pillar?.key || pillarLabel}`,
        evidenceEligible:
          false,
      });
    },
  );
}

function addLayerFacts(
  collector,
  trustedPack,
  layerName,
) {
  const layer =
    mergeObjects(
      trustedPack
        ?.factualContext
        ?.[layerName],
      trustedPack
        ?.mechanicalSignals
        ?.layers
        ?.[layerName],
    );

  if (
    !layer ||
    Object.keys(
      layer,
    ).length ===
      0
  ) {
    return;
  }

  const label =
    STAGE_LABELS[
      layerName
    ] ||
    layerName;

  const ganZhi =
    text(
      layer?.ganZhi,
    ) ||
    `${text(layer?.stem)}${text(layer?.branch)}`;

  const stemTenGod =
    text(
      layer?.stemTenGod,
    );

  const hidden =
    hiddenStemText(
      layer?.hiddenStems,
    );

  if (
    ganZhi ||
    stemTenGod
  ) {
    const parts = [];

    if (
      ganZhi
    ) {
      parts.push(
        `干支为${ganZhi}`,
      );
    }

    if (
      stemTenGod
    ) {
      parts.push(
        `天干${text(layer?.stem)}为${stemTenGod}透出`,
      );
    }

    collector.add({
      category:
        `${label}基础`,
      strength:
        "直接",
      text:
        `${label}${parts.join("，")}。`,
      sourceRef:
        `${layerName}:stem`,
      evidenceEligible:
        true,
    });
  }

  if (
    hidden
  ) {
    collector.add({
      category:
        `${label}藏干`,
      strength:
        "辅助",
      text:
        `${label}地支${text(layer?.branch)}藏干为${hidden}，属于藏支信号，不作透干处理。`,
      sourceRef:
        `${layerName}:hidden`,
      evidenceEligible:
        true,
    });
  }
}

function addRelationFacts(
  collector,
  trustedPack,
) {
  array(
    trustedPack
      ?.relationFacts,
  ).forEach(
    (
      relation,
      index,
    ) => {
      const rendered =
        renderRelationFact(
          relation,
        );

      if (
        !rendered
      ) {
        return;
      }

      collector.add({
        category:
          "确定关系",
        strength:
          relationStrength(
            relation,
          ),
        text:
          rendered,
        sourceRef:
          text(
            relation?.id,
          ) ||
          `relation:${index + 1}`,
        evidenceEligible:
          true,
      });
    },
  );
}

function addDerivedLayerRelations(
  collector,
  trustedPack,
  stage,
) {
  const layers =
    activeLayerNames(
      stage,
    )
      .map(
        (layerName) => ({
          key:
            layerName,
          label:
            STAGE_LABELS[
              layerName
            ] ||
            layerName,
          isActive:
            true,
          ...getLayerSnapshot(
            trustedPack,
            layerName,
          ),
        }),
      )
      .filter(
        (layer) =>
          layer?.stem ||
          layer?.branch ||
          layer?.ganZhi,
      );

  const natalPillars =
    array(
      trustedPack
        ?.factualContext
        ?.natal
        ?.pillars,
    )
      .map(
        (pillar) => ({
          key:
            pillar?.key,
          label:
            PILLAR_LABELS[
              pillar?.key
            ] ||
            text(
              pillar?.label,
            ) ||
            "原局柱位",
          stem:
            text(
              pillar?.stem,
            ),
          branch:
            text(
              pillar?.branch,
            ),
          ganZhi:
            text(
              pillar?.ganZhi,
            ) ||
            `${text(pillar?.stem)}${text(pillar?.branch)}`,
          isActive:
            false,
        }),
      )
      .filter(
        (pillar) =>
          pillar?.stem ||
          pillar?.branch,
      );

  layers.forEach(
    (layer) => {
      natalPillars.forEach(
        (pillar) => {
          addStemRelationFacts(
            collector,
            layer,
            pillar,
          );

          addBranchRelationFacts(
            collector,
            layer,
            pillar,
          );
        },
      );
    },
  );

  for (
    let leftIndex = 0;
    leftIndex <
    layers.length;
    leftIndex += 1
  ) {
    for (
      let rightIndex =
        leftIndex + 1;
      rightIndex <
      layers.length;
      rightIndex += 1
    ) {
      addStemRelationFacts(
        collector,
        layers[
          leftIndex
        ],
        layers[
          rightIndex
        ],
      );

      addBranchRelationFacts(
        collector,
        layers[
          leftIndex
        ],
        layers[
          rightIndex
        ],
      );
    }
  }

  addGroupConditionFacts(
    collector,
    [
      ...layers,
      ...natalPillars,
    ],
  );
}

function getLayerSnapshot(
  trustedPack,
  layerName,
) {
  return mergeObjects(
    trustedPack
      ?.factualContext
      ?.[layerName],
    trustedPack
      ?.mechanicalSignals
      ?.layers
      ?.[layerName],
  );
}

function addStemRelationFacts(
  collector,
  left,
  right,
) {
  const leftStem =
    text(
      left?.stem,
    );

  const rightStem =
    text(
      right?.stem,
    );

  if (
    !leftStem ||
    !rightStem
  ) {
    return;
  }

  const leftLabel =
    text(
      left?.label,
    ) ||
    "左侧";

  const rightLabel =
    text(
      right?.label,
    ) ||
    "右侧";

  if (
    pairSetHas(
      STEM_COMBINE_PAIRS,
      leftStem,
      rightStem,
    )
  ) {
    collector.add({
      category:
        "确定关系",
      strength:
        "条件",
      text:
        `${leftLabel}${leftStem}与${rightLabel}${rightStem}构成天干五合，是否合化及化气结果尚未确认。`,
      sourceRef:
        `derived:stem-combine:${leftLabel}:${rightLabel}`,
      evidenceEligible:
        true,
    });
  }

  const leftElement =
    STEM_ELEMENT[
      leftStem
    ];

  const rightElement =
    STEM_ELEMENT[
      rightStem
    ];

  if (
    !leftElement ||
    !rightElement ||
    leftElement ===
      rightElement
  ) {
    return;
  }

  if (
    ELEMENT_CONTROLS[
      leftElement
    ] ===
    rightElement
  ) {
    collector.add({
      category:
        "确定关系",
      strength:
        "直接",
      text:
        `确定生克关系：${leftLabel}${leftStem}克${rightLabel}${rightStem}，施克者为${leftLabel}${leftStem}，受克者为${rightLabel}${rightStem}。`,
      sourceRef:
        `derived:stem-control:${leftLabel}:${rightLabel}`,
      evidenceEligible:
        true,
    });
  } else if (
    ELEMENT_CONTROLS[
      rightElement
    ] ===
    leftElement
  ) {
    collector.add({
      category:
        "确定关系",
      strength:
        "直接",
      text:
        `确定生克关系：${rightLabel}${rightStem}克${leftLabel}${leftStem}，施克者为${rightLabel}${rightStem}，受克者为${leftLabel}${leftStem}。`,
      sourceRef:
        `derived:stem-control:${rightLabel}:${leftLabel}`,
      evidenceEligible:
        true,
    });
  }
}

function addBranchRelationFacts(
  collector,
  left,
  right,
) {
  const leftBranch =
    text(
      left?.branch,
    );

  const rightBranch =
    text(
      right?.branch,
    );

  if (
    !leftBranch ||
    !rightBranch
  ) {
    return;
  }

  const leftLabel =
    text(
      left?.label,
    ) ||
    "左侧";

  const rightLabel =
    text(
      right?.label,
    ) ||
    "右侧";

  if (
    leftBranch ===
    rightBranch
  ) {
    const samePillar =
      text(
        left?.ganZhi,
      ) &&
      text(
        right?.ganZhi,
      ) &&
      text(
        left?.ganZhi,
      ) ===
      text(
        right?.ganZhi,
      );

    collector.add({
      category:
        "重复关系",
      strength:
        "直接",
      text:
        samePillar
          ? `${leftLabel}${text(left?.ganZhi)}与${rightLabel}${text(right?.ganZhi)}整柱相同，可称伏吟。`
          : `${leftLabel}地支${leftBranch}与${rightLabel}地支${rightBranch}同支重复，但不是整柱伏吟。`,
      sourceRef:
        `derived:same-branch:${leftLabel}:${rightLabel}`,
      evidenceEligible:
        true,
    });

    return;
  }

  Object.entries(
    BRANCH_RELATION_PAIRS,
  ).forEach(
    (
      [
        relationLabel,
        pairs,
      ],
    ) => {
      if (
        !pairSetHas(
          pairs,
          leftBranch,
          rightBranch,
        )
      ) {
        return;
      }

      collector.add({
        category:
          "确定关系",
        strength:
          "直接",
        text:
          `${leftLabel}地支${leftBranch}与${rightLabel}地支${rightBranch}构成${relationLabel}。`,
        sourceRef:
          `derived:branch-${relationLabel}:${leftLabel}:${rightLabel}`,
        evidenceEligible:
          true,
      });
    },
  );
}

function addGroupConditionFacts(
  collector,
  entries,
) {
  const branchEntries =
    array(
      entries,
    )
      .map(
        (entry) => ({
          label:
            text(
              entry?.label,
            ),
          branch:
            text(
              entry?.branch,
            ),
          isActive:
            Boolean(
              entry?.isActive,
            ),
        }),
      )
      .filter(
        (entry) =>
          entry.branch,
      );

  [
    ...THREE_HARMONY_GROUPS.map(
      (group) => ({
        ...group,
        type:
          "三合",
      }),
    ),
    ...THREE_MEETING_GROUPS.map(
      (group) => ({
        ...group,
        type:
          "三会",
      }),
    ),
  ].forEach(
    (group) => {
      const matchedEntries =
        branchEntries.filter(
          (entry) =>
            group.branches.includes(
              entry.branch,
            ),
        );

      if (
        !matchedEntries.some(
          (entry) =>
            entry.isActive,
        )
      ) {
        return;
      }

      const matched =
        group.branches.filter(
          (branch) =>
            matchedEntries.some(
              (entry) =>
                entry.branch ===
                branch,
            ),
        );

      const uniqueMatched =
        unique(
          matched,
        );

      if (
        uniqueMatched.length <
        2
      ) {
        return;
      }

      const missing =
        group.branches.filter(
          (branch) =>
            !uniqueMatched.includes(
              branch,
            ),
        );

      const participants =
        uniqueMatched
          .map(
            (branch) => {
              const entry =
                matchedEntries.find(
                  (candidate) =>
                    candidate.branch ===
                      branch &&
                    candidate.isActive,
                ) ||
                matchedEntries.find(
                  (candidate) =>
                    candidate.branch ===
                    branch,
                );

              return `${entry?.label || ""}${branch}`;
            },
          )
          .join("、");

      collector.add({
        category:
          "组合条件",
        strength:
          uniqueMatched.length ===
            3
            ? "条件"
            : "条件",
        text:
          uniqueMatched.length ===
            3
            ? `${participants}使${group.label}三支齐备，但是否成局及化气结果仍需结合全局确认。`
            : `${participants}构成${group.label}的${group.type}条件，尚缺${missing.join("、")}，未成局。`,
        sourceRef:
          `derived:${group.type}:${group.label}`,
        evidenceEligible:
          true,
      });
    },
  );
}

function pairSetHas(
  pairSet,
  left,
  right,
) {
  return pairSet.has(
    `${left}${right}`,
  ) ||
    pairSet.has(
      `${right}${left}`,
    );
}

function inferFactDomains(
  fact,
) {
  const value =
    text(
      fact?.text,
    );

  const domains = [];

  DOMAIN_DEFINITIONS.forEach(
    (definition) => {
      const keywordMatch =
        array(
          definition
            ?.keywords,
        ).some(
          (keyword) =>
            value.includes(
              keyword,
            ),
        );

      const relationMatch =
        array(
          definition
            ?.relationKeywords,
        ).some(
          (keyword) =>
            value.includes(
              keyword,
            ),
        );

      if (
        keywordMatch ||
        relationMatch
      ) {
        domains.push(
          definition.id,
        );
      }
    },
  );

  return unique(
    domains,
  );
}

function buildDomainFactCards(
  facts,
  stage,
) {
  const evidenceFacts =
    array(
      facts,
    ).filter(
      (fact) =>
        fact?.evidenceEligible,
    );

  return DOMAIN_DEFINITIONS
    .map(
      (definition) => {
        const matchedFacts =
          evidenceFacts.filter(
            (fact) =>
              array(
                fact
                  ?.meta
                  ?.domains,
              ).includes(
                definition.id,
              ),
          );

        if (
          matchedFacts.length ===
            0
        ) {
          return null;
        }

        const independentSources =
          unique(
            matchedFacts.map(
              (fact) =>
                text(
                  fact?.sourceRef,
                ) ||
                fact.id,
            ),
          );

        const strength =
          independentSources.length >=
            3
            ? "主线候选"
            : independentSources.length >=
                2
              ? "次线候选"
              : "辅助线索";

        return {
          领域编号:
            definition.id,
          领域:
            definition.label,
          证据等级:
            strength,
          独立证据数:
            independentSources.length,
          依据编号:
            matchedFacts.map(
              (fact) =>
                fact.id,
            ),
          允许推断:
            definition.allowedClaims,
          禁止直接推断:
            definition.forbiddenClaims,
          阶段说明:
            stage ===
              "luck"
              ? "可作为长期主题展开"
              : stage ===
                  "year"
                ? "只说明本年新增或强化部分"
                : "只说明本月短期触发",
        };
      },
    )
    .filter(Boolean)
    .sort(
      (left, right) =>
        Number(
          right
            .独立证据数 ||
          0,
        ) -
        Number(
          left
            .独立证据数 ||
          0,
        ),
    );
}

function addComparisonFacts(
  collector,
  trustedPack,
  layerName,
) {
  const layer =
    trustedPack
      ?.mechanicalSignals
      ?.layers
      ?.[layerName] ||
    {};

  const stageLabel =
    STAGE_LABELS[
      layerName
    ] ||
    layerName;

  array(
    layer?.natalComparisons,
  ).forEach(
    (
      comparison,
      index,
    ) => {
      const targetLabel =
        PILLAR_LABELS[
          comparison
            ?.targetPillar
        ] ||
        text(
          comparison
            ?.targetLabel,
        ) ||
        "原局柱位";

      const currentGanZhi =
        text(
          comparison
            ?.currentGanZhi,
        ) ||
        text(
          layer
            ?.ganZhi,
        );

      const targetGanZhi =
        text(
          comparison
            ?.targetGanZhi,
        );

      if (
        comparison
          ?.samePillar
      ) {
        collector.add({
          category:
            "重复关系",
          strength:
            "直接",
          text:
            `${stageLabel}${currentGanZhi || ""}与${targetLabel}${targetGanZhi || ""}整柱相同，可称伏吟。`,
          sourceRef:
            `${layerName}:comparison:${index + 1}:samePillar`,
          evidenceEligible:
            true,
        });
        return;
      }

      if (
        comparison
          ?.sameBranch
      ) {
        collector.add({
          category:
            "重复关系",
          strength:
            "直接",
          text:
            `${stageLabel}地支${text(comparison?.currentBranch) || text(layer?.branch)}与${targetLabel}地支${text(comparison?.targetBranch)}同支重复，但不是整柱伏吟。`,
          sourceRef:
            `${layerName}:comparison:${index + 1}:sameBranch`,
          evidenceEligible:
            true,
        });
      }

      if (
        comparison
          ?.sameStem
      ) {
        collector.add({
          category:
            "重复关系",
          strength:
            "直接",
          text:
            `${stageLabel}天干${text(comparison?.currentStem) || text(layer?.stem)}与${targetLabel}天干${text(comparison?.targetStem)}同干重复，但不是整柱伏吟。`,
          sourceRef:
            `${layerName}:comparison:${index + 1}:sameStem`,
          evidenceEligible:
            true,
        });
      }
    },
  );
}

function renderRelationFact(
  relation,
) {
  const meta =
    relation?.meta ||
    {};

  const controller =
    firstText(
      meta?.controller,
      relation?.controller,
    );

  const controlled =
    firstText(
      meta?.controlled,
      relation?.controlled,
    );

  if (
    controller &&
    controlled
  ) {
    return `确定生克关系：${controller}克${controlled}，施克者为${controller}，受克者为${controlled}。`;
  }

  const currentStem =
    firstText(
      meta?.currentStem,
      meta?.sourceStem,
      meta?.fromStem,
      meta?.leftStem,
      relation?.currentStem,
      relation?.sourceStem,
      relation?.fromStem,
      relation?.leftStem,
    );

  const targetStem =
    firstText(
      meta?.targetStem,
      meta?.toStem,
      meta?.rightStem,
      relation?.targetStem,
      relation?.toStem,
      relation?.rightStem,
    );

  const currentBranch =
    firstText(
      meta?.currentBranch,
      meta?.sourceBranch,
      meta?.fromBranch,
      meta?.leftBranch,
      relation?.currentBranch,
      relation?.sourceBranch,
      relation?.fromBranch,
      relation?.leftBranch,
    );

  const targetBranch =
    firstText(
      meta?.targetBranch,
      meta?.toBranch,
      meta?.rightBranch,
      relation?.targetBranch,
      relation?.toBranch,
      relation?.rightBranch,
    );

  const relationType =
    normalizeRelationLabel(
      relation?.type ||
      relation?.relation ||
      relation?.kind ||
      meta?.subtype ||
      meta?.relationType,
    );

  const sourceLabel =
    firstText(
      meta?.sourceLabel,
      meta?.sourceLevelLabel,
      relation?.sourceLabel,
    );

  const targetLabel =
    firstText(
      meta?.targetLabel,
      meta?.targetLevelLabel,
      relation?.targetLabel,
    );

  let core = "";

  if (
    currentStem &&
    targetStem &&
    relationType
  ) {
    core =
      `${sourceLabel ? `${sourceLabel}` : ""}${currentStem}` +
      `与${targetLabel ? `${targetLabel}` : ""}${targetStem}` +
      `构成${relationType}`;
  } else if (
    currentBranch &&
    targetBranch &&
    relationType
  ) {
    core =
      `${sourceLabel ? `${sourceLabel}` : ""}${currentBranch}` +
      `与${targetLabel ? `${targetLabel}` : ""}${targetBranch}` +
      `构成${relationType}`;
  }

  if (
    core
  ) {
    const status =
      [
        text(
          meta?.formationStatus,
        ),
        text(
          meta?.transformationStatus,
        ),
      ].filter(Boolean);

    const conditional =
      status.some(
        (value) =>
          [
            "condition_only",
            "unresolved",
            "not_formed",
            "arch_condition",
          ].includes(
            value,
          ),
      );

    return `${core}${conditional ? "，目前只按条件关系处理，不能写成已经成局或合化" : ""}。`;
  }

  const preferred =
    [
      relation?.text,
      relation?.summary,
      relation?.displayText,
      relation?.description,
      relation?.label,
    ]
      .map(
        text,
      )
      .find(
        isSpecificRelationText,
      );

  return preferred
    ? ensurePeriod(
        preferred,
      )
    : "";
}

function isSpecificRelationText(
  value,
) {
  if (
    !value ||
    !containsChinese(
      value,
    )
  ) {
    return false;
  }

  const normalized =
    value
      .replace(
        /[，。；：、！？\s]/g,
        "",
      );

  if (
    /^(?:天干五合|地支六合|六合|冲|刑|害|破|半合条件|三合条件|三会条件|上层约束当前|当前作用原局)$/.test(
      normalized,
    )
  ) {
    return false;
  }

  const stemCount =
    (
      normalized.match(
        /[甲乙丙丁戊己庚辛壬癸]/g,
      ) ||
      []
    ).length;

  const branchCount =
    (
      normalized.match(
        /[子丑寅卯辰巳午未申酉戌亥]/g,
      ) ||
      []
    ).length;

  const pillarCount =
    (
      normalized.match(
        /(?:年柱|月柱|日柱|时柱|大运|流年|流月)/g,
      ) ||
      []
    ).length;

  return (
    stemCount >=
      2 ||
    branchCount >=
      2 ||
    pillarCount >=
      2
  );
}

function firstText(
  ...values
) {
  return values
    .map(
      text,
    )
    .find(Boolean) ||
    "";
}

function buildCandidateThemes(
  evidenceConvergences,
) {
  const found = [];

  walkObject(
    evidenceConvergences,
    (
      value,
      key,
    ) => {
      if (
        !value ||
        typeof value !==
          "object" ||
        Array.isArray(
          value,
        )
      ) {
        return;
      }

      const rawName =
        text(
          value?.theme,
        ) ||
        text(
          value?.title,
        ) ||
        text(
          value?.label,
        ) ||
        text(
          value?.domain,
        ) ||
        key;

      const theme =
        translateThemeName(
          rawName,
        );

      const evidenceCount =
        numberOrNull(
          value
            ?.independentEvidenceCount,
        ) ??
        numberOrNull(
          value
            ?.evidenceCount,
        ) ??
        array(
          value
            ?.evidenceIds,
        ).length;

      const priority =
        text(
          value?.priority,
        ) ||
        text(
          value?.strength,
        ) ||
        (
          value
            ?.mustCompare
            ? "必须比较"
            : ""
        );

      if (
        !theme ||
        (
          evidenceCount ===
            null &&
          !priority
        )
      ) {
        return;
      }

      found.push({
        主题:
          theme,
        独立证据数:
          evidenceCount,
        优先级:
          translatePriority(
            priority,
          ),
      });
    },
  );

  const deduped = [];

  found.forEach(
    (item) => {
      const existing =
        deduped.find(
          (entry) =>
            entry
              .主题 ===
            item
              .主题,
        );

      if (
        !existing
      ) {
        deduped.push(
          item,
        );
        return;
      }

      existing
        .独立证据数 =
        Math.max(
          Number(
            existing
              .独立证据数 ||
            0,
          ),
          Number(
            item
              .独立证据数 ||
            0,
          ),
        );

      if (
        item
          .优先级 ===
        "必须比较"
      ) {
        existing
          .优先级 =
          "必须比较";
      }
    },
  );

  return deduped
    .sort(
      (left, right) =>
        Number(
          right
            .独立证据数 ||
          0,
        ) -
        Number(
          left
            .独立证据数 ||
          0,
        ),
    )
    .slice(
      0,
      8,
    );
}

function buildDomainEvidenceOverview(
  candidateThemes,
) {
  return array(
    candidateThemes,
  ).map(
    (item) => {
      const count =
        Number(
          item?.独立证据数 ||
          0,
        );

      const priority =
        text(
          item?.优先级,
        );

      const tier =
        priority ===
          "必须比较" ||
        priority ===
          "高" ||
        count >=
          3
          ? "主线候选"
          : count >=
              2
            ? "次线候选"
            : "背景参考";

      const writingBoundary =
        tier ===
          "主线候选"
          ? "可以完整展开，但仍需使用概率表达"
          : tier ===
              "次线候选"
            ? "只能简写，并明确现实条件"
            : "不得单独写成主要主题，只可作为背景补充";

      return {
        领域:
          item?.主题 ||
          "",
        独立证据数:
          count,
        证据等级:
          tier,
        写作边界:
          writingBoundary,
      };
    },
  );
}

function createFactCollector() {
  const facts = [];
  const seen = new Set();

  return {
    add(fact) {
      const normalizedText =
        ensurePeriod(
          text(
            fact?.text,
          ),
        );

      if (
        !normalizedText ||
        seen.has(
          normalizedText,
        )
      ) {
        return;
      }

      seen.add(
        normalizedText,
      );

      facts.push({
        id:
          `F${String(
            facts.length +
            1,
          ).padStart(
            2,
            "0",
          )}`,
        category:
          text(
            fact?.category,
          ) ||
          "事实",
        strength:
          text(
            fact?.strength,
          ) ||
          "直接",
        text:
          normalizedText,
        sourceRef:
          text(
            fact?.sourceRef,
          ),
        evidenceEligible:
          Boolean(
            fact?.evidenceEligible,
          ),
        meta:
          fact?.meta &&
          typeof fact.meta ===
            "object"
            ? {
                ...fact.meta,
              }
            : null,
      });
    },

    list() {
      return [
        ...facts,
      ];
    },
  };
}

function relationStrength(
  relation,
) {
  const status =
    String(
      relation
        ?.meta
        ?.formationStatus ||
      relation
        ?.meta
        ?.transformationStatus ||
      "",
    );

  if (
    [
      "condition_only",
      "unresolved",
      "not_formed",
      "arch_condition",
    ].includes(
      status,
    )
  ) {
    return "条件";
  }

  return "直接";
}

function normalizeRelationLabel(
  value,
) {
  const normalized =
    String(
      value || "",
    ).trim();

  if (
    !normalized
  ) {
    return "";
  }

  if (
    RELATION_LABELS[
      normalized
    ]
  ) {
    return RELATION_LABELS[
      normalized
    ];
  }

  if (
    containsChinese(
      normalized,
    )
  ) {
    return normalized;
  }

  const lower =
    normalized
      .toLowerCase();

  const matchedKey =
    Object.keys(
      RELATION_LABELS,
    ).find(
      (key) =>
        lower.includes(
          key,
        ),
    );

  return matchedKey
    ? RELATION_LABELS[
        matchedKey
      ]
    : "";
}

function hiddenStemText(
  hiddenStems,
) {
  return array(
    hiddenStems,
  )
    .map(
      (entry) => {
        if (
          typeof entry ===
          "string"
        ) {
          return entry;
        }

        const stem =
          text(
            entry?.stem,
          ) ||
          text(
            entry?.gan,
          );

        const tenGod =
          text(
            entry?.tenGod,
          ) ||
          text(
            entry?.shiShen,
          );

        if (
          stem &&
          tenGod
        ) {
          return `${stem}${tenGod}`;
        }

        return stem ||
          tenGod;
      },
    )
    .filter(Boolean)
    .join("、");
}

function activeLayerNames(
  stage,
) {
  if (
    stage ===
    "month"
  ) {
    return [
      "luck",
      "year",
      "month",
    ];
  }

  if (
    stage ===
    "year"
  ) {
    return [
      "luck",
      "year",
    ];
  }

  return [
    "luck",
  ];
}

function compactTarget(
  target,
) {
  if (
    !target ||
    typeof target !==
      "object"
  ) {
    return null;
  }

  const compacted = {
    年份:
      numberOrNull(
        target?.year,
      ),
    月份:
      numberOrNull(
        target?.month,
      ),
    干支:
      text(
        target?.ganZhi,
      ),
    年龄范围:
      text(
        target?.ageRange,
      ),
    年份范围:
      text(
        target?.yearRange,
      ),
    名称:
      text(
        target?.name,
      ) ||
      text(
        target?.label,
      ),
  };

  return Object.fromEntries(
    Object.entries(
      compacted,
    ).filter(
      (
        [
          ,
          value,
        ],
      ) =>
        value !==
          null &&
        value !==
          "",
    ),
  );
}

function translateThemeName(
  value,
) {
  const normalized =
    String(
      value || "",
    ).trim();

  if (
    !normalized
  ) {
    return "";
  }

  if (
    THEME_LABELS[
      normalized
    ]
  ) {
    return THEME_LABELS[
      normalized
    ];
  }

  const lower =
    normalized
      .toLowerCase();

  const matched =
    Object.keys(
      THEME_LABELS,
    ).find(
      (key) =>
        lower.includes(
          key
            .toLowerCase(),
        ),
    );

  if (
    matched
  ) {
    return THEME_LABELS[
      matched
    ];
  }

  return containsChinese(
    normalized,
  )
    ? normalized
    : "";
}

function translatePriority(
  value,
) {
  const normalized =
    String(
      value || "",
    );

  if (
    /must_compare|必须/.test(
      normalized,
    )
  ) {
    return "必须比较";
  }

  if (
    /high|strong|高|强/.test(
      normalized,
    )
  ) {
    return "高";
  }

  if (
    /medium|中/.test(
      normalized,
    )
  ) {
    return "中";
  }

  return normalized ||
    "参考";
}

function walkObject(
  value,
  visitor,
  key = "",
  depth = 0,
) {
  if (
    depth >
    6 ||
    value ===
      null ||
    value ===
      undefined
  ) {
    return;
  }

  visitor(
    value,
    key,
  );

  if (
    Array.isArray(
      value,
    )
  ) {
    value.forEach(
      (
        item,
        index,
      ) =>
        walkObject(
          item,
          visitor,
          String(index),
          depth + 1,
        ),
    );
    return;
  }

  if (
    typeof value ===
    "object"
  ) {
    Object.entries(
      value,
    ).forEach(
      (
        [
          childKey,
          childValue,
        ],
      ) =>
        walkObject(
          childValue,
          visitor,
          childKey,
          depth + 1,
        ),
    );
  }
}

function mergeObjects(
  left,
  right,
) {
  return {
    ...(
      left &&
      typeof left ===
        "object"
        ? left
        : {}
    ),
    ...(
      right &&
      typeof right ===
        "object"
        ? right
        : {}
    ),
  };
}

function ensurePeriod(
  value,
) {
  const normalized =
    text(
      value,
    );

  if (
    !normalized
  ) {
    return "";
  }

  return /[。！？]$/.test(
    normalized,
  )
    ? normalized
    : `${normalized}。`;
}

function containsChinese(
  value,
) {
  return /[\u3400-\u9fff]/.test(
    String(
      value || "",
    ),
  );
}

function text(
  value,
) {
  return value ===
      null ||
    value ===
      undefined
    ? ""
    : String(
        value,
      ).trim();
}

function numberOrNull(
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


function unique(
  values,
) {
  return [
    ...new Set(
      array(
        values,
      ),
    ),
  ];
}


function array(
  value,
) {
  return Array.isArray(
    value,
  )
    ? value
    : value ===
          null ||
        value ===
          undefined
      ? []
      : [value];
}
