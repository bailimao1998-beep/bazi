
const ROLE_SCORE = {
  core: 10,
  main: 9,
  tension: 8,
  support: 7,
  resource: 5,
  conditional: 4,
  candidate: 1,
};

const STATUS_SCORE = {
  activated: 10,
  confirmed: 9,
  structurally_supported: 8,
  connected: 6,
  conditional: 4,
  candidate: 1,
  presence_only: 0,
  weak: -2,
};

const CONFIDENCE_SCORE = {
  high: 5,
  medium: 3,
  low: 0,
  unknown: 0,
};

const DOMAIN_TEXT_MAP = {
  self: [
    "性格",
    "自我",
    "主见",
    "边界",
    "比肩",
    "劫财",
    "日主",
    "根气",
  ],

  parents: [
    "父母",
    "长辈",
    "家庭",
    "年柱",
    "月柱",
    "印星",
  ],

  siblings: [
    "兄弟",
    "姐妹",
    "同辈",
    "比肩",
    "劫财",
  ],

  spouse: [
    "感情",
    "婚姻",
    "关系",
    "配偶",
    "日支",
    "夫妻",
    "正财",
    "偏财",
    "正官",
    "七杀",
  ],

  children: [
    "子女",
    "孩子",
    "成果",
    "作品",
    "时柱",
    "食神",
    "伤官",
  ],

  wealth: [
    "财",
    "收入",
    "资源",
    "变现",
    "正财",
    "偏财",
  ],

  health: [
    "健康",
    "体质",
    "作息",
    "气候",
    "五行偏性",
  ],

  movement: [
    "迁移",
    "异地",
    "出行",
    "居住",
    "环境",
    "冲",
    "变动",
  ],

  friends: [
    "朋友",
    "人际",
    "合作",
    "社交",
    "同辈",
    "合",
  ],

  career: [
    "事业",
    "工作",
    "职业",
    "岗位",
    "规则",
    "项目",
    "学习",
    "考试",
    "正官",
    "七杀",
    "印星",
    "食伤",
  ],

  property: [
    "房产",
    "居住",
    "资产",
    "田宅",
    "辰",
    "戌",
    "丑",
    "未",
  ],

  fortune: [
    "福气",
    "心态",
    "精神",
    "安全感",
    "长期",
    "福德",
  ],
};

export function selectChatImagery({
  plan = {},
  natalImageReport,
  luckImageReport,
  yearImageReport,
  monthImageReport,
  monthImageReports,
  requestedYearReports,
} = {}) {
  if (
    !plan?.isBaziQuestion
  ) {
    return {
      source:
        "local_rule_engine",

      role:
        "reference_only",

      selectedDomains:
        [],

      natal:
        [],

      luck:
        [],

      years:
        [],

      months:
        [],

      instruction:
        "当前问题未识别为命理问题，不注入候选取象。",
    };
  }

  const domains =
    Array.isArray(
      plan?.domainKeys,
    )
      ? plan.domainKeys
      : [
          "general",
        ];

  const limits =
    plan?.limits ??
    {};

  const natal =
    plan?.include
      ?.natalImagery
      ? selectNatalImagery({
          report:
            natalImageReport,
          domains,
          limit:
            limits.natalImagery ??
            7,
          manifestationsLimit:
            limits
              .manifestationsPerItem ??
            3,
        })
      : [];

  const luck =
    plan?.include
      ?.luckImagery
      ? selectLuckImagery({
          report:
            luckImageReport,
          domains,
          years:
            plan.requestedYears ??
            [],
          limit:
            limits.luckImagery ??
            5,
        })
      : [];

  const years =
    plan?.include
      ?.yearImagery
      ? selectYearImagery({
          yearImageReport,
          requestedYearReports,
          domains,
          limit:
            limits.yearImagery ??
            10,
        })
      : [];

  const months =
    plan?.include
      ?.monthImagery
      ? selectMonthImagery({
          monthImageReport,
          monthImageReports,
          domains,
          monthMode:
            plan.monthMode ??
            "selected",
          selectedMonth:
            plan.selectedMonth,
          limit:
            limits.monthImagery ??
            3,
        })
      : [];

  const warnings = [];

  if (
    natal.some(
      isWeakCandidate,
    )
  ) {
    warnings.push(
      "原局候选取象中含低置信或候选项，AI必须降级表达并结合硬事实复核。",
    );
  }

  if (
    years.some(
      isWeakCandidate,
    ) ||
    months.some(
      isWeakCandidate,
    )
  ) {
    warnings.push(
      "岁运候选取象含条件性内容，不能直接等同具体事件。",
    );
  }

  return deepClean({
    version:
      "selected-chat-imagery-v1",

    source:
      "local_rule_engine",

    role:
      "reference_only",

    selectedDomains:
      domains,

    instruction:
      "以下取象由本地规则引擎按用户问题筛选，只作候选参考。AI必须先用硬事实复核，可以合并、降级或否定，严禁直接照抄为确定事件。",

    natal,

    luck,

    years,

    months,

    warnings,
  });
}

export function selectNatalImagery({
  report,
  domains = [
    "general",
  ],
  limit = 7,
  manifestationsLimit = 3,
} = {}) {
  const candidates =
    collectNatalCandidates(
      report,
    )
      .map(
        (item) =>
          normalizeImageryCandidate(
            item,
            manifestationsLimit,
          ),
      )
      .filter(
        hasImageryContent,
      )
      .map(
        (item) => ({
          ...item,
          score:
            scoreImagery({
              item,
              domains,
            }),
        }),
      )
      .sort(
        (
          left,
          right,
        ) =>
          right.score -
          left.score,
      );

  const specificDomains =
    (
      Array.isArray(
        domains,
      )
        ? domains
        : []
    ).filter(
      (domain) =>
        domain !==
        "general",
    );

  const matchedCandidates =
    specificDomains.length >
      0
      ? candidates.filter(
          (item) =>
            matchesSelectedDomain({
              item,
              domains:
                specificDomains,
            }),
        )
      : candidates;

  const strong =
    matchedCandidates.filter(
      (item) =>
        ![
          "weak",
          "presence_only",
        ].includes(
          String(
            item.status ??
            "",
          ),
        ),
    );

  const selected =
    (
      strong.length >
        0
        ? strong
        : matchedCandidates.length >
            0
          ? matchedCandidates
          : candidates
    )
      .slice(
        0,
        Math.max(
          0,
          Number(
            limit,
          ) ||
            0,
        ),
      )
      .map(
        stripScore,
      );

  return uniqueByKey(
    selected,
  );
}

export function selectLuckImagery({
  report,
  years = [],
  domains = [
    "general",
  ],
  limit = 5,
} = {}) {
  const requestedYears =
    new Set(
      (
        Array.isArray(
          years,
        )
          ? years
          : []
      ).map(
        Number,
      ),
    );

  const items =
    (
      Array.isArray(
        report?.luckItems,
      )
        ? report.luckItems
        : []
    )
      .map(
        (item) => ({
          item,
          score:
            scoreTransitItem({
              item,
              domains,
              requestedYears,
            }),
        }),
      )
      .sort(
        (
          left,
          right,
        ) =>
          right.score -
          left.score,
      )
      .slice(
        0,
        Math.max(
          0,
          Number(
            limit,
          ) ||
            0,
        ),
      )
      .map(
        ({
          item,
        }) =>
          compactTransitImagery(
            item,
            "luck",
          ),
      )
      .filter(Boolean);

  return uniqueByKey(
    items,
  );
}

export function selectYearImagery({
  yearImageReport,
  requestedYearReports = [],
  domains = [
    "general",
  ],
  limit = 10,
} = {}) {
  const reports = [
    yearImageReport,
    ...(
      Array.isArray(
        requestedYearReports,
      )
        ? requestedYearReports.map(
            (item) =>
              item?.yearImageReport,
          )
        : []
    ),
  ].filter(Boolean);

  const items =
    uniqueByYear(
      reports
        .map(
          (report) =>
            report?.yearItem,
        )
        .filter(Boolean),
    )
      .map(
        (item) => ({
          item,
          score:
            scoreTransitItem({
              item,
              domains,
              requestedYears:
                new Set([
                  Number(
                    item.year,
                  ),
                ]),
            }),
        }),
      )
      .sort(
        (
          left,
          right,
        ) =>
          right.score -
          left.score,
      )
      .slice(
        0,
        Math.max(
          0,
          Number(
            limit,
          ) ||
            0,
        ),
      )
      .map(
        ({
          item,
        }) =>
          compactTransitImagery(
            item,
            "year",
          ),
      )
      .filter(Boolean);

  return items;
}

export function selectMonthImagery({
  monthImageReport,
  monthImageReports = [],
  domains = [
    "general",
  ],
  monthMode = "selected",
  selectedMonth = null,
  limit = 3,
} = {}) {
  const reports = [
    monthImageReport,
    ...(
      Array.isArray(
        monthImageReports,
      )
        ? monthImageReports
        : []
    ),
  ].filter(Boolean);

  let items =
    uniqueByMonth(
      reports
        .map(
          (report) =>
            report?.monthItem,
        )
        .filter(Boolean),
    );

  if (
    monthMode !==
      "all" &&
    Number.isFinite(
      Number(
        selectedMonth,
      ),
    )
  ) {
    const target =
      Number(
        selectedMonth,
      );

    items =
      items.filter(
        (item) =>
          Number(
            item.month ??
            item.flowMonthIndex,
          ) ===
          target,
      );
  }

  return items
    .map(
      (item) => ({
        item,
        score:
          scoreTransitItem({
            item,
            domains,
            requestedYears:
              new Set([
                Number(
                  item.year,
                ),
              ]),
          }),
      }),
    )
    .sort(
      (
        left,
        right,
      ) =>
        right.score -
        left.score,
    )
    .slice(
      0,
      Math.max(
        0,
        Number(
          limit,
        ) ||
          0,
      ),
    )
    .map(
      ({
        item,
      }) =>
        compactTransitImagery(
          item,
          "month",
        ),
    )
    .filter(Boolean);
}

function collectNatalCandidates(
  report,
) {
  const pack =
    report
      ?.natalAiEvidencePack ??
    report
      ?.natalDebug
      ?.natalAiEvidencePack ??
    {};

  const domainRows =
    (
      Array.isArray(
        report?.twelveDomains,
      )
        ? report.twelveDomains
        : []
    ).map(
      (item) => ({
        ...item,
        sourceKind:
          "domain_portrait",
        domains: [
          item?.key ??
          item?.domain,
        ].filter(Boolean),
      }),
    );

  return [
    ...toArray(
      report?.hitList?.all,
    ),
    ...toArray(
      report?.coreImages,
    ),
    ...toArray(
      report?.mergedComposition
        ?.images,
    ),
    ...toArray(
      pack?.compositions,
    ),
    ...domainRows,
  ];
}

function normalizeImageryCandidate(
  item,
  manifestationsLimit,
) {
  const nested =
    item?.image &&
    typeof item.image ===
      "object"
      ? item.image
      : {};

  return deepClean({
    id:
      firstText(
        item?.id,
        nested?.id,
        item?.ruleId,
      ),

    sourceKind:
      firstText(
        item?.sourceKind,
        item?.sourceLayer,
        nested?.sourceLayer,
        "natal_imagery",
      ),

    title:
      firstText(
        item?.title,
        item?.name,
        item?.label,
        nested?.title,
        nested?.name,
      ),

    brief:
      firstText(
        item?.brief,
        item?.summary,
        item?.overview,
        item?.meaning,
        nested?.brief,
        nested?.summary,
      ),

    formation:
      firstText(
        item?.formation,
        item?.judgement,
        nested?.formation,
        nested?.judgement,
      ),

    role:
      firstText(
        item?.role,
        nested?.role,
      ),

    status:
      firstText(
        item?.status,
        nested?.status,
        "candidate",
      ),

    confidence:
      firstText(
        item?.confidence,
        nested?.confidence,
        "unknown",
      ),

    domains:
      uniqueStrings([
        ...toArray(
          item?.domains,
        ),
        ...toArray(
          nested?.domains,
        ),
        item?.key,
        item?.domain,
      ]),

    manifestations:
      takeStrings(
        firstArray(
          item?.manifestations,
          item?.realityImages,
          item?.images,
          nested?.manifestations,
          nested?.realityImages,
          nested?.images,
        ),
        manifestationsLimit,
      ),

    strengths:
      takeStrings(
        firstArray(
          item?.strengths,
          nested?.strengths,
        ),
        3,
      ),

    risks:
      takeStrings(
        firstArray(
          item?.risks,
          item?.pressures,
          nested?.risks,
          nested?.pressures,
        ),
        3,
      ),

    conditions:
      takeStrings(
        firstArray(
          item?.conditions,
          item?.condition,
          nested?.conditions,
          nested?.condition,
        ),
        3,
      ),

    counterEvidence:
      takeStrings(
        firstArray(
          item?.counterEvidence,
          item?.boundary,
          nested?.counterEvidence,
          nested?.boundary,
        ),
        3,
      ),

    supportingEvidence:
      takeStrings(
        firstArray(
          item?.supportingEvidence,
          item?.evidence,
          nested?.supportingEvidence,
          nested?.evidence,
        ),
        4,
      ),
  });
}

function compactTransitImagery(
  item,
  stage,
) {
  if (
    !item ||
    typeof item !==
      "object"
  ) {
    return null;
  }

  return deepClean({
    stage,

    index:
      item.index,

    year:
      item.year,

    month:
      item.month,

    flowMonthLabel:
      item.flowMonthLabel,

    dateRangeLabel:
      item.dateRangeLabel,

    ageRange:
      item.ageRange,

    yearRange:
      item.yearRange,

    ganZhi:
      item.ganZhi,

    stemTenGod:
      item.stemTenGod ??
      item.tenGod,

    branchMainTenGod:
      item.branchTenGod ??
      item.branchMainTenGod,

    isCurrent:
      Boolean(
        item.isCurrent,
      ),

    confidence:
      item.confidence,

    image:
      firstText(
        item.shortImage,
        item.image,
      ),

    structureImage:
      firstText(
        item.structureImage,
      ),

    reality:
      firstText(
        item.reality,
      ),

    boundary:
      firstText(
        item.boundary,
      ),

    triggerImages:
      compactUnknown(
        item.triggerImages,
        0,
      ),
  });
}


function matchesSelectedDomain({
  item,
  domains,
}) {
  const itemDomains =
    Array.isArray(
      item?.domains,
    )
      ? item.domains
      : [];

  if (
    domains.some(
      (domain) =>
        itemDomains.includes(
          domain,
        ),
    )
  ) {
    return true;
  }

  const text =
    collectCandidateText(
      item,
    );

  return domains.some(
    (domain) =>
      (
        DOMAIN_TEXT_MAP[
          domain
        ] ??
        []
      ).some(
        (word) =>
          text.includes(
            word,
          ),
      ),
  );
}

function scoreImagery({
  item,
  domains,
}) {
  let score =
    ROLE_SCORE[
      String(
        item.role ??
        "",
      )
    ] ??
    0;

  score +=
    STATUS_SCORE[
      String(
        item.status ??
        "",
      )
    ] ??
    0;

  score +=
    CONFIDENCE_SCORE[
      String(
        item.confidence ??
        "",
      )
    ] ??
    0;

  const domainList =
    Array.isArray(
      item.domains,
    )
      ? item.domains
      : [];

  const selected =
    Array.isArray(
      domains,
    )
      ? domains
      : [];

  if (
    selected.includes(
      "general",
    )
  ) {
    score +=
      2;
  } else {
    const matched =
      selected.filter(
        (domain) =>
          domainList.includes(
            domain,
          ),
      );

    score +=
      matched.length *
      8;

    const text =
      collectCandidateText(
        item,
      );

    selected.forEach(
      (domain) => {
        const words =
          DOMAIN_TEXT_MAP[
            domain
          ] ??
          [];

        if (
          words.some(
            (word) =>
              text.includes(
                word,
              ),
          )
        ) {
          score +=
            4;
        }
      },
    );
  }

  if (
    item.conditions
      ?.length
  ) {
    score +=
      1;
  }

  if (
    item.counterEvidence
      ?.length
  ) {
    score +=
      1;
  }

  return score;
}

function scoreTransitItem({
  item,
  domains,
  requestedYears,
}) {
  let score = 0;

  if (
    item?.isCurrent
  ) {
    score +=
      10;
  }

  const range =
    parseYearRange(
      item?.yearRange,
    );

  if (
    range &&
    requestedYears
      ?.size
  ) {
    const intersects =
      [
        ...requestedYears,
      ].some(
        (year) =>
          year >=
            range.start &&
          year <=
            range.end,
      );

    if (
      intersects
    ) {
      score +=
        12;
    }
  }

  if (
    Number.isFinite(
      Number(
        item?.year,
      ),
    ) &&
    requestedYears
      ?.has(
        Number(
          item.year,
        ),
      )
  ) {
    score +=
      14;
  }

  score +=
    CONFIDENCE_SCORE[
      String(
        item?.confidence ??
        "",
      )
    ] ??
    0;

  const text = [
    item?.image,
    item?.shortImage,
    item?.structureImage,
    item?.reality,
    JSON.stringify(
      item?.triggerImages ??
      {},
    ),
  ].join(
    " ",
  );

  (
    Array.isArray(
      domains,
    )
      ? domains
      : []
  ).forEach(
    (domain) => {
      const words =
        DOMAIN_TEXT_MAP[
          domain
        ] ??
        [];

      if (
        words.some(
          (word) =>
            text.includes(
              word,
            ),
        )
      ) {
        score +=
          4;
      }
    },
  );

  return score;
}

function collectCandidateText(
  item,
) {
  return [
    item?.title,
    item?.brief,
    item?.formation,
    ...toArray(
      item?.manifestations,
    ),
    ...toArray(
      item?.strengths,
    ),
    ...toArray(
      item?.risks,
    ),
  ].join(
    " ",
  );
}

function compactUnknown(
  value,
  depth,
) {
  if (
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
    return value.slice(
      0,
      420,
    );
  }

  if (
    typeof value ===
      "number" ||
    typeof value ===
      "boolean"
  ) {
    return value;
  }

  if (
    depth >=
      3
  ) {
    return null;
  }

  if (
    Array.isArray(
      value,
    )
  ) {
    return value
      .slice(
        0,
        6,
      )
      .map(
        (item) =>
          compactUnknown(
            item,
            depth +
              1,
          ),
      )
      .filter(
        (item) =>
          item !==
            null &&
          item !==
            undefined,
      );
  }

  if (
    typeof value ===
      "object"
  ) {
    const allowedKeys =
      new Set([
        "summary",
        "title",
        "label",
        "role",
        "certainty",
        "confidence",
        "domains",
        "scenes",
        "useful",
        "pressure",
        "conditions",
        "counterEvidence",
        "stories",
        "items",
        "cards",
        "selected",
        "image",
        "reality",
        "boundary",
        "text",
      ]);

    return Object.fromEntries(
      Object.entries(
        value,
      )
        .filter(
          (
            [
              key,
            ],
          ) =>
            allowedKeys.has(
              key,
            ),
        )
        .slice(
          0,
          16,
        )
        .map(
          (
            [
              key,
              child,
            ],
          ) => [
            key,
            compactUnknown(
              child,
              depth +
                1,
            ),
          ],
        )
        .filter(
          (
            [
              ,
              child,
            ],
          ) =>
            child !==
              null &&
            child !==
              undefined,
        ),
    );
  }

  return null;
}

function isWeakCandidate(
  item,
) {
  return [
    "candidate",
    "weak",
    "presence_only",
  ].includes(
    String(
      item?.status ??
      "",
    ),
  ) ||
  String(
    item?.confidence ??
    "",
  ) ===
    "low";
}

function hasImageryContent(
  item,
) {
  return Boolean(
    item?.title ||
    item?.brief ||
    item?.formation ||
    item?.manifestations
      ?.length,
  );
}

function stripScore(
  item,
) {
  const {
    score,
    ...rest
  } = item;

  return rest;
}

function uniqueByKey(
  items,
) {
  const seen =
    new Set();

  return (
    Array.isArray(
      items,
    )
      ? items
      : []
  ).filter(
    (item) => {
      const key = [
        item?.stage,
        item?.year,
        item?.month,
        item?.ganZhi,
        item?.id,
        item?.title,
        item?.brief,
      ].join(
        "|",
      );

      if (
        seen.has(
          key,
        )
      ) {
        return false;
      }

      seen.add(
        key,
      );

      return true;
    },
  );
}

function uniqueByYear(
  items,
) {
  const seen =
    new Set();

  return items.filter(
    (item) => {
      const key =
        Number(
          item?.year,
        );

      if (
        !Number.isFinite(
          key,
        ) ||
        seen.has(
          key,
        )
      ) {
        return false;
      }

      seen.add(
        key,
      );

      return true;
    },
  );
}

function uniqueByMonth(
  items,
) {
  const seen =
    new Set();

  return items.filter(
    (item) => {
      const key = [
        item?.year,
        item?.month ??
        item?.flowMonthIndex,
      ].join(
        ":",
      );

      if (
        seen.has(
          key,
        )
      ) {
        return false;
      }

      seen.add(
        key,
      );

      return true;
    },
  );
}

function parseYearRange(
  value,
) {
  const matched =
    String(
      value ??
      "",
    ).match(
      /((?:19|20)\d{2})\D+((?:19|20)\d{2})/,
    );

  if (
    !matched
  ) {
    return null;
  }

  return {
    start:
      Math.min(
        Number(
          matched[1],
        ),
        Number(
          matched[2],
        ),
      ),

    end:
      Math.max(
        Number(
          matched[1],
        ),
        Number(
          matched[2],
        ),
      ),
  };
}

function firstText(
  ...items
) {
  const matched =
    items.find(
      (item) =>
        typeof item ===
          "string" &&
        item.trim(),
    );

  return matched
    ?.trim() ??
    null;
}

function firstArray(
  ...items
) {
  return (
    items.find(
      (item) =>
        Array.isArray(
          item,
        ) &&
        item.length >
          0,
    ) ??
    []
  );
}

function takeStrings(
  value,
  limit,
) {
  return uniqueStrings(
    toArray(
      value,
    )
      .map(
        (item) =>
          typeof item ===
            "string"
            ? item.trim()
            : firstText(
                item?.text,
                item?.label,
                item?.brief,
                item?.title,
              ),
      )
      .filter(Boolean),
  ).slice(
    0,
    limit,
  );
}

function uniqueStrings(
  items,
) {
  return [
    ...new Set(
      (
        Array.isArray(
          items,
        )
          ? items
          : []
      )
        .map(
          (item) =>
            String(
              item ??
              "",
            ).trim(),
        )
        .filter(Boolean),
    ),
  ];
}

function toArray(
  value,
) {
  if (
    Array.isArray(
      value,
    )
  ) {
    return value;
  }

  if (
    value ===
      null ||
    value ===
      undefined
  ) {
    return [];
  }

  return [
    value,
  ];
}

function deepClean(
  value,
) {
  if (
    Array.isArray(
      value,
    )
  ) {
    return value
      .map(
        deepClean,
      )
      .filter(
        (item) =>
          item !==
            null &&
          item !==
            undefined,
      );
  }

  if (
    value &&
    typeof value ===
      "object"
  ) {
    return Object.fromEntries(
      Object.entries(
        value,
      )
        .filter(
          (
            [
              ,
              child,
            ],
          ) =>
            child !==
              null &&
            child !==
              undefined &&
            child !==
              "",
        )
        .map(
          (
            [
              key,
              child,
            ],
          ) => [
            key,
            deepClean(
              child,
            ),
          ],
        ),
    );
  }

  return value;
}
