import {
  IMAGERY_METHODOLOGY_RULES,
  IMAGERY_RULE_CORPUS_VERSION,
  IMAGERY_RULES,
} from "../../generated/imageryRuleBundle.js";

const STAGE_LIMIT = {
  luck: 14,
  year: 12,
  month: 8,
};

const METHODOLOGY_LIMIT = {
  luck: 12,
  year: 10,
  month: 8,
};

const TEN_GODS = [
  "比肩",
  "劫财",
  "正印",
  "偏印",
  "食神",
  "伤官",
  "正财",
  "偏财",
  "正官",
  "七杀",
];

const RELATIONS = [
  "天干五合",
  "六合",
  "冲",
  "刑",
  "自刑",
  "害",
  "穿",
  "破",
  "半合",
  "拱合",
  "三合",
  "三会",
  "伏吟",
  "反吟",
];

const STEMS = [
  ..."甲乙丙丁戊己庚辛壬癸",
];

const BRANCHES = [
  ..."子丑寅卯辰巳午未申酉戌亥",
];

const HEAVY_CONTEXT_KEYS =
  new Set([
    "fixedReport",
    "stageRulePack",
    "matchedRules",
    "methodologyRules",
    "sections",
    "researchPending",
    "coverage",
    "debug",
    "raw",
  ]);

const COMPILED_RULES =
  IMAGERY_RULES
    .filter(
      (rule) =>
        !rule.researchOnly &&
        rule.allowInUserAnswer !==
          false,
    )
    .map(
      (rule) => ({
        rule,
        scopes:
          array(
            rule.scopes,
          ),
        domains:
          array(
            rule.domains,
          ),
        tenGodAny:
          expand(
            rule.trigger
              ?.tenGodsAny,
          ),
        tenGodAll:
          array(
            rule.trigger
              ?.tenGodsAll,
          ),
        relationAny:
          expand(
            rule.trigger
              ?.relationsAny,
          ),
        stemAny:
          expand(
            rule.trigger
              ?.stemsAny,
          ),
        branchAny:
          expand(
            rule.trigger
              ?.branchesAny,
          ),
        featureAny:
          expand(
            rule.trigger
              ?.featuresAny,
          ),
      }),
    );

const COMPILED_METHODOLOGY =
  IMAGERY_METHODOLOGY_RULES
    .map(
      (rule) => ({
        rule,
        appliesTo:
          array(
            rule?.appliesTo,
          ),
      }),
    );

export function buildStageRulePack({
  stage = "luck",
  item = {},
  natalImageReport,
  luckImageReport,
  yearImageReport,
  monthImageReport,
  domainKeys = [],
} = {}) {
  const normalizedStage =
    [
      "luck",
      "year",
      "month",
    ].includes(
      stage,
    )
      ? stage
      : "luck";

  const context =
    buildContext({
      stage:
        normalizedStage,
      item,
      natalImageReport,
      luckImageReport,
      yearImageReport,
      monthImageReport,
      domainKeys,
    });

  const methodologyRules =
    COMPILED_METHODOLOGY
      .filter(
        (entry) =>
          methodologyApplies(
            entry,
            context,
          ),
      )
      .sort(
        (
          left,
          right,
        ) =>
          Number(
            right.rule
              .priority ||
            0,
          ) -
          Number(
            left.rule
              .priority ||
            0,
          ),
      )
      .slice(
        0,
        METHODOLOGY_LIMIT[
          normalizedStage
        ],
      )
      .map(
        (
          {
            rule,
          },
        ) => ({
          id:
            rule.id,
          title:
            rule.title,
          instruction:
            rule.instruction,
          sourceRefs:
            compactSources(
              rule.sourceRefs,
            ),
        }),
      );

  const matchedRules =
    COMPILED_RULES
      .map(
        (compiled) =>
          scoreRule(
            compiled,
            context,
          ),
      )
      .filter(
        Boolean,
      )
      .sort(
        (
          left,
          right,
        ) =>
          right.score -
            left.score ||
          Number(
            right.rule
              .priority ||
            0,
          ) -
            Number(
              left.rule
                .priority ||
              0,
            ),
      )
      .slice(
        0,
        STAGE_LIMIT[
          normalizedStage
        ],
      )
      .map(
        compactRule,
      );

  return {
    version:
      IMAGERY_RULE_CORPUS_VERSION,

    stage:
      normalizedStage,

    methodologyRules,

    matchedRules,

    matchedRuleIds:
      matchedRules.map(
        (rule) =>
          rule.id,
      ),

    observed: {
      tenGods: [
        ...context.tenGods,
      ],

      relations: [
        ...context.relations,
      ],

      domains: [
        ...context.domains,
      ],
    },

    instruction: [
      "固定岁运报告优先使用本次匹配规则，不把十神词典当成最终结论。",
      "规则必须与当前层硬事实共同使用。",
      "条件规则只能形成候选象，不得越级写成已发生事件。",
      "只展开当前阶段最突出的现实领域。",
    ],
  };
}

function buildContext({
  stage,
  item,
  natalImageReport,
  luckImageReport,
  yearImageReport,
  monthImageReport,
  domainKeys,
}) {
  const compactContext = {
    item:
      compactStageItem(
        item,
      ),

    natal:
      compactNatalContext(
        natalImageReport,
      ),

    luck:
      compactStageItem(
        resolveCurrentLuck(
          item,
          luckImageReport,
        ),
      ),

    year:
      compactStageItem(
        item?.yearItem ??
        yearImageReport
          ?.yearItem,
      ),

    month:
      compactStageItem(
        monthImageReport
          ?.monthItem,
      ),
  };

  const rawText =
    JSON.stringify(
      compactContext,
    );

  const domains =
    new Set([
      ...array(
        domainKeys,
      ),
      ...collectDomains(
        item,
      ),
      "general",
    ]);

  return {
    stage,

    rawText,

    domains,

    tenGods:
      new Set(
        TEN_GODS
          .filter(
            (name) =>
              rawText.includes(
                name,
              ),
          ),
      ),

    relations:
      new Set(
        RELATIONS
          .filter(
            (name) =>
              rawText.includes(
                name,
              ),
          ),
      ),

    stems:
      new Set(
        STEMS
          .filter(
            (name) =>
              rawText.includes(
                name,
              ),
          ),
      ),

    branches:
      new Set(
        BRANCHES
          .filter(
            (name) =>
              rawText.includes(
                name,
              ),
          ),
      ),
  };
}

function compactNatalContext(
  report,
) {
  const pack =
    report
      ?.natalAiEvidencePack ??
    report
      ?.natalDebug
      ?.natalAiEvidencePack ??
    {};

  return {
    chartSummary:
      compactValue(
        pack?.chartSummary,
        0,
        4,
      ),

    facts:
      array(
        pack?.facts,
      )
        .slice(
          0,
          80,
        )
        .map(
          (fact) => ({
            id:
              fact?.id ??
              "",

            statement:
              fact?.statement ??
              fact?.text ??
              fact?.summary ??
              "",

            domains:
              array(
                fact?.domains,
              )
                .slice(
                  0,
                  5,
                ),
          }),
        ),

    summary:
      compactValue(
        report?.summary,
        0,
        2,
      ),

    imageCards:
      array(
        report?.imageCards,
      )
        .slice(
          0,
          16,
        )
        .map(
          (card) => ({
            title:
              card?.title ??
              "",

            image:
              card?.image ??
              card?.summary ??
              "",

            evidence:
              array(
                card?.evidence,
              )
                .slice(
                  0,
                  5,
                ),
          }),
        ),
  };
}

function compactStageItem(
  item,
) {
  if (
    !item ||
    typeof item !==
      "object"
  ) {
    return null;
  }

  return {
    index:
      item?.index ??
      null,

    year:
      item?.year ??
      null,

    month:
      item?.month ??
      item?.flowMonthIndex ??
      null,

    ganZhi:
      item?.ganZhi ??
      "",

    stem:
      item?.stem ??
      "",

    branch:
      item?.branch ??
      "",

    tenGod:
      item?.tenGod ??
      item?.stemTenGod ??
      "",

    stemTenGod:
      item?.stemTenGod ??
      item?.tenGod ??
      "",

    branchTenGod:
      item?.branchTenGod ??
      item?.branchMainTenGod ??
      "",

    ageRange:
      item?.ageRange ??
      "",

    yearRange:
      item?.yearRange ??
      "",

    isCurrent:
      Boolean(
        item?.isCurrent,
      ),

    relationToNatal:
      compactValue(
        item?.relationToNatal,
        0,
        3,
      ),

    relationToLuck:
      compactValue(
        item?.relationToLuck,
        0,
        3,
      ),

    relationToYear:
      compactValue(
        item?.relationToYear,
        0,
        3,
      ),

    transitStructure: {
      facts:
        array(
          item
            ?.transitStructure
            ?.facts,
        )
          .slice(
            0,
            24,
          )
          .map(
            (fact) => ({
              id:
                fact?.id ??
                "",

              label:
                fact?.label ??
                "",

              text:
                fact?.text ??
                "",

              category:
                fact?.category ??
                "",

              status:
                fact?.status ??
                "",

              domains:
                array(
                  fact?.domains,
                )
                  .slice(
                    0,
                    5,
                  ),
            }),
          ),
    },

    storyPack:
      compactStoryPack(
        item
          ?.triggerImages
          ?.storyPack,
      ),
  };
}

function compactStoryPack(
  story = {},
) {
  const compactThread =
    (thread) => {
      if (
        !thread ||
        typeof thread !==
          "object"
      ) {
        return null;
      }

      return {
        id:
          thread?.id ??
          "",

        tenGod:
          thread?.tenGod ??
          "",

        sourceLevel:
          thread?.sourceLevel ??
          "",

        label:
          thread?.label ??
          "",

        domain:
          thread?.domain ??
          "",

        domains:
          array(
            thread?.domains,
          )
            .slice(
              0,
              5,
            ),

        certainty:
          thread?.certainty ??
          "",

        status:
          thread?.status ??
          "",

        trigger:
          thread?.trigger ??
          "",

        summary:
          thread?.summary ??
          "",

        possibleScenes:
          array(
            thread
              ?.possibleScenes,
          )
            .slice(
              0,
              4,
            ),

        usefulDirections:
          array(
            thread
              ?.usefulDirections,
          )
            .slice(
              0,
              3,
            ),

        pressureSignals:
          array(
            thread
              ?.pressureSignals,
          )
            .slice(
              0,
              3,
            ),

        conditions:
          array(
            thread
              ?.conditions,
          )
            .slice(
              0,
              3,
            ),
      };
    };

  const list =
    (
      value,
      limit,
    ) =>
      array(
        value,
      )
        .slice(
          0,
          limit,
        )
        .map(
          compactThread,
        )
        .filter(
          Boolean,
        );

  return {
    themeHierarchy: {
      primary:
        compactThread(
          story
            ?.themeHierarchy
            ?.primary,
        ),

      supporting:
        compactThread(
          story
            ?.themeHierarchy
            ?.supporting,
        ),
    },

    background:
      list(
        story?.background,
        3,
      ),

    directTriggers:
      list(
        story
          ?.directTriggers,
        6,
      ),

    hierarchyInteractions:
      list(
        story
          ?.hierarchyInteractions,
        4,
      ),

    convergence:
      list(
        story?.convergence,
        4,
      ),

    conditionalPatterns:
      list(
        story
          ?.conditionalPatterns,
        4,
      ),
  };
}

function resolveCurrentLuck(
  item,
  report,
) {
  if (
    item?.currentLuckItem
  ) {
    return item.currentLuckItem;
  }

  return (
    array(
      report?.luckItems,
    ).find(
      (entry) =>
        entry?.isCurrent,
    ) ??
    null
  );
}

function compactValue(
  value,
  depth,
  maxDepth,
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
      500,
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
      maxDepth
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
        40,
      )
      .map(
        (child) =>
          compactValue(
            child,
            depth + 1,
            maxDepth,
          ),
      )
      .filter(
        (child) =>
          child !==
            null &&
          child !==
            undefined,
      );
  }

  if (
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
              key,
            ],
          ) =>
            !HEAVY_CONTEXT_KEYS
              .has(
                key,
              ),
        )
        .slice(
          0,
          40,
        )
        .map(
          (
            [
              key,
              child,
            ],
          ) => [
            key,
            compactValue(
              child,
              depth + 1,
              maxDepth,
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

function collectDomains(
  item,
) {
  const story =
    item
      ?.triggerImages
      ?.storyPack ??
    {};

  return unique(
    [
      ...array(
        story.background,
      ),
      ...array(
        story.directTriggers,
      ),
      ...array(
        story.hierarchyInteractions,
      ),
      ...array(
        story.convergence,
      ),
      ...array(
        story.conditionalPatterns,
      ),
    ].flatMap(
      (thread) => [
        thread?.domain,
        ...array(
          thread?.domains,
        ),
      ],
    ),
  );
}

function methodologyApplies(
  entry,
  context,
) {
  const applies =
    entry.appliesTo;

  return (
    applies.includes(
      "all",
    ) ||
    applies.includes(
      context.stage,
    ) ||
    applies.some(
      (key) =>
        context.domains.has(
          key,
        ),
    )
  );
}

function scoreRule(
  compiled,
  context,
) {
  const {
    rule,
    scopes,
    domains,
    tenGodAny,
    tenGodAll,
    relationAny,
    stemAny,
    branchAny,
    featureAny,
  } = compiled;

  const matchedBy = [];

  let score =
    Number(
      rule.priority ||
      0,
    ) /
    20;

  if (
    scopes.includes(
      context.stage,
    )
  ) {
    score += 5;

    matchedBy.push(
      `时间层:${context.stage}`,
    );
  } else if (
    scopes.length &&
    !scopes.includes(
      "all",
    ) &&
    !scopes.includes(
      "natal",
    )
  ) {
    return null;
  }

  const domainHits =
    domains.filter(
      (domain) =>
        context.domains.has(
          domain,
        ),
    );

  if (
    domainHits.length
  ) {
    score +=
      Math.min(
        8,
        domainHits.length *
          3,
      );

    matchedBy.push(
      `领域:${domainHits
        .slice(
          0,
          3,
        )
        .join(
          "、",
        )}`,
    );
  }

  const tenGodHits =
    tenGodAny.filter(
      (name) =>
        context.tenGods.has(
          name,
        ),
    );

  const relationHits =
    relationAny.filter(
      (name) =>
        context.relations.has(
          name,
        ),
    );

  const stemHits =
    stemAny.filter(
      (name) =>
        context.stems.has(
          name,
        ),
    );

  const branchHits =
    branchAny.filter(
      (name) =>
        context.branches.has(
          name,
        ),
    );

  const featureHits =
    featureAny.filter(
      (name) =>
        context.rawText.includes(
          name,
        ),
    );

  const allTenGodsHit =
    tenGodAll.every(
      (group) =>
        String(
          group,
        )
          .split(
            "|",
          )
          .some(
            (name) =>
              context.tenGods.has(
                name,
              ),
          ),
    );

  if (
    tenGodAll.length &&
    !allTenGodsHit
  ) {
    return null;
  }

  if (
    tenGodAll.length
  ) {
    score += 8;

    matchedBy.push(
      `组合十神:${tenGodAll
        .join(
          "＋",
        )}`,
    );
  }

  if (
    tenGodHits.length
  ) {
    score += 6;

    matchedBy.push(
      `十神:${tenGodHits
        .slice(
          0,
          3,
        )
        .join(
          "、",
        )}`,
    );
  }

  if (
    relationHits.length
  ) {
    score += 7;

    matchedBy.push(
      `关系:${relationHits
        .slice(
          0,
          3,
        )
        .join(
          "、",
        )}`,
    );
  }

  if (
    stemHits.length ||
    branchHits.length
  ) {
    score += 3;

    matchedBy.push(
      `干支:${[
        ...stemHits,
        ...branchHits,
      ]
        .slice(
          0,
          4,
        )
        .join(
          "、",
        )}`,
    );
  }

  if (
    featureHits.length
  ) {
    score += 5;

    matchedBy.push(
      `结构:${featureHits
        .slice(
          0,
          3,
        )
        .join(
          "、",
        )}`,
    );
  }

  const triggerCount =
    tenGodHits.length +
    relationHits.length +
    stemHits.length +
    branchHits.length +
    featureHits.length +
    (
      tenGodAll.length
        ? 1
        : 0
    );

  if (
    rule.category ===
      "relation" &&
    relationAny.length &&
    !relationHits.length
  ) {
    return null;
  }

  if (
    rule.category ===
      "storage" &&
    !branchHits.length &&
    !featureHits.length
  ) {
    return null;
  }

  if (
    [
      "element",
      "stem_branch",
    ].includes(
      rule.category,
    ) &&
    !stemHits.length &&
    !branchHits.length &&
    !featureHits.length
  ) {
    return null;
  }

  if (
    !triggerCount &&
    !domainHits.length
  ) {
    return null;
  }

  if (
    !triggerCount
  ) {
    score -= 3;
  }

  return {
    rule,

    score:
      Math.round(
        score *
        10,
      ) /
      10,

    matchedBy,

    claimSupportAllowed:
      triggerCount >
      0,
  };
}

function compactRule(
  entry,
) {
  const rule =
    entry.rule;

  return {
    id:
      rule.id,

    title:
      rule.title,

    module:
      rule.module,

    category:
      rule.category,

    domains:
      array(
        rule.domains,
      ),

    scopes:
      array(
        rule.scopes,
      ),

    genderScope:
      array(
        rule.genderScope ?? rule.genders,
      ),

    ageScope:
      rule.ageScope ?? null,

    trigger:
      compactValue(
        rule.trigger,
        0,
        3,
      ),

    priority:
      rule.priority,

    matchedBy:
      entry.matchedBy,

    claimSupportAllowed:
      entry
        .claimSupportAllowed,

    requires:
      array(
        rule.requires,
      )
        .slice(
          0,
          3,
        ),

    weakeningConditions:
      array(
        rule
          .weakeningConditions,
      )
        .slice(
          0,
          3,
        ),

    imagery: {
      core:
        array(
          rule
            .imagery
            ?.core,
        )
          .slice(
            0,
            2,
          ),

      positive:
        array(
          rule
            .imagery
            ?.positive,
        )
          .slice(
            0,
            2,
          ),

      negative:
        array(
          rule
            .imagery
            ?.negative,
        )
          .slice(
            0,
            2,
          ),

      realityChecks:
        array(
          rule
            .imagery
            ?.realityChecks,
        )
          .slice(
            0,
            2,
          ),
    },

    advice:
      array(
        rule.advice,
      )
        .slice(
          0,
          2,
        ),

    prohibitions:
      array(
        rule.prohibitions,
      )
        .slice(
          0,
          2,
        ),

    sourceRefs:
      compactSources(
        rule.sourceRefs,
      ),

    score:
      entry.score,
  };
}

function compactSources(
  value,
) {
  return array(
    value,
  )
    .slice(
      0,
      3,
    )
    .map(
      (ref) => ({
        sourceId:
          ref?.sourceId ??
          "",

        pdfPage:
          ref?.pdfPage ??
          null,

        section:
          ref?.section ??
          "",
      }),
    );
}

function expand(
  value,
) {
  return unique(
    array(
      value,
    )
      .flatMap(
        (item) =>
          String(
            item,
          )
            .split(
              "|",
            ),
      ),
  );
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
      : [
          value,
        ];
}

function unique(
  value,
) {
  return [
    ...new Set(
      array(
        value,
      )
        .filter(
          Boolean,
        ),
    ),
  ];
}
