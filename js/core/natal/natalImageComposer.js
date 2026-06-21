/**
 * 原局取象组合器。
 *
 * 输入：
 * - 统一特征向量
 * - 已完成去重、冲突处理的 atomicFacts
 *
 * 输出：
 * - 核心主象
 * - 支持象
 * - 矛盾象
 * - 条件象
 * - 弱象
 * - 神煞辅助
 * - 兼容旧页面的 imageCards / summary / hitList
 */

const topicConfigs = [
  {
    topic: "personality",
    title: "命主自身",
    domains: ["self"],
    fallback: "自身底色需要从日主、月令、根气和原局主线综合观察。",
  },
  {
    topic: "family",
    title: "父母家庭",
    domains: ["parents"],
    fallback: "父母家庭需要从年柱、月柱及相关十神结构观察。",
  },
  {
    topic: "study_skill",
    title: "学习技能",
    domains: ["self", "career", "fortune"],
    preferredTags: ["印星", "食伤", "学习", "表达", "专业"],
    fallback: "学习技能需要从印星吸收与食伤输出两条路径观察。",
  },
  {
    topic: "career",
    title: "官禄事业",
    domains: ["career"],
    fallback: "事业需要从官杀、印星、食伤和财星的承接关系观察。",
  },
  {
    topic: "wealth",
    title: "财帛财富",
    domains: ["wealth"],
    fallback: "财富需要从财星落点、日主承载和输出转化路径观察。",
  },
  {
    topic: "relationship",
    title: "夫妻感情",
    domains: ["spouse"],
    fallback: "感情需要从日支夫妻宫、财官和原局关系结构观察。",
  },
  {
    topic: "health",
    title: "疾厄健康",
    domains: ["health"],
    fallback: "健康只作体质倾向观察，重点看五行偏性和寒暖燥湿。",
  },
  {
    topic: "movement",
    title: "迁移环境",
    domains: ["movement"],
    fallback: "迁移环境需要从冲动关系、时柱及整体流动性观察。",
  },
  {
    topic: "life_pattern",
    title: "人生模式",
    domains: ["fortune"],
    fallback: "人生模式需要从命局主线、主要矛盾和长期承接观察。",
  },
];

export function composeNatalImages({
  featureVector = {},
  atomicFacts = {},
} = {}) {
  const facts = sortFacts(
    Array.isArray(atomicFacts.facts)
      ? atomicFacts.facts
      : [],
  );

  const auxiliaryFacts = facts.filter(
    isAuxiliaryFact,
  );

  const structuralFacts = facts.filter(
    (fact) => !isAuxiliaryFact(fact),
  );

  const coreFacts = uniqueFacts(
    structuralFacts.filter(
      (fact) =>
        ["core", "main"].includes(fact.role) &&
        fact.status !== "weak",
    ),
  ).slice(0, 6);

  const tensionFacts = uniqueFacts(
    structuralFacts.filter(
      (fact) => fact.role === "tension",
    ),
  ).slice(0, 6);

  const conditionalFacts = uniqueFacts(
    structuralFacts.filter(
      (fact) =>
        fact.role === "condition" ||
        fact.status === "conditional",
    ),
  ).slice(0, 6);

  const weakFacts = uniqueFacts(
    structuralFacts.filter(
      (fact) =>
        fact.role === "weak" ||
        fact.status === "weak",
    ),
  ).slice(0, 8);

  const supportFacts = uniqueFacts(
    structuralFacts.filter(
      (fact) =>
        !coreFacts.some(
          (core) => core.id === fact.id,
        ) &&
        !tensionFacts.some(
          (tension) => tension.id === fact.id,
        ) &&
        !conditionalFacts.some(
          (conditional) =>
            conditional.id === fact.id,
        ) &&
        !weakFacts.some(
          (weak) => weak.id === fact.id,
        ) &&
        ["support", "base", "resource"].includes(
          fact.role,
        ),
    ),
  ).slice(0, 12);

  /*
   * 当高阶规则暂时较少时，从高分基础事实中
   * 补充核心取象，但不使用神煞和弱事实。
   */
  const effectiveCoreFacts = uniqueFacts([
    ...coreFacts,
    ...structuralFacts.filter(
      (fact) =>
        fact.status === "confirmed" &&
        fact.importance === "high" &&
        fact.score >= 78 &&
        !["weak", "tension", "condition"].includes(
          fact.role,
        ),
    ),
  ]).slice(0, 6);

  const coreImages = {
    core: effectiveCoreFacts.map(toImage),
    support: supportFacts.map(toImage),
    tension: tensionFacts.map(toImage),
    conditional: conditionalFacts.map(toImage),
    weak: weakFacts.map(toImage),
    auxiliary: auxiliaryFacts
      .slice(0, 12)
      .map(toImage),
  };

  const summary = buildSummary(
    featureVector,
    coreImages,
  );

  const masterSummary = buildMasterSummary(
    featureVector,
    coreImages,
  );

  const imageCards = topicConfigs.map(
    (config) =>
      buildLegacyTopicCard(
        config,
        structuralFacts,
      ),
  );

  const keySignals = uniqueText([
    ...effectiveCoreFacts.map(
      (fact) =>
        `${fact.name}：${fact.brief || fact.meaning}`,
    ),
    ...supportFacts
      .slice(0, 3)
      .map(
        (fact) =>
          `${fact.name}：${fact.brief || fact.meaning}`,
      ),
  ]).slice(0, 8);

  const weakSignals = uniqueText([
    ...tensionFacts.map(
      (fact) =>
        `${fact.name}：${fact.brief || fact.meaning}`,
    ),
    ...weakFacts.map(
      (fact) =>
        `${fact.name}：${fact.brief || fact.meaning}`,
    ),
  ]).slice(0, 8);

  const needVerify = uniqueText([
    ...conditionalFacts.map(
      (fact) =>
        `${fact.name}仍需复核：${
          firstText(fact.counterEvidence) ||
          fact.brief ||
          fact.meaning
        }`,
    ),
    ...effectiveCoreFacts
      .flatMap(
        (fact) =>
          normalizeTextList(
            fact.counterEvidence,
          ).map(
            (text) =>
              `${fact.name}的边界：${text}`,
          ),
      ),
  ]).slice(0, 10);

  return {
    summary,
    masterSummary,
    imageCards,
    keySignals,
    weakSignals,
    needVerify,
    coreImages,
    hitList: buildHitList(facts),
  };
}

function buildSummary(
  featureVector,
  coreImages,
) {
  const dayMaster =
    featureVector.dayMaster ?? {};

  const monthCommand =
    featureVector.structure?.monthCommand ?? {};

  const firstCore =
    coreImages.core[0] ??
    coreImages.support[0] ??
    null;

  const secondCore =
    coreImages.core[1] ??
    coreImages.tension[0] ??
    null;

  return {
    title: "原局整体取象",

    dayMaster:
      dayMaster.label ||
      dayMaster.stem ||
      "",

    mainStructure: [
      dayMaster.label ||
        dayMaster.stem ||
        "日主",
      monthCommand.branch
        ? `生于${monthCommand.branch}月`
        : "",
      dayMaster.strengthLevel
        ? `强弱初判为${dayMaster.strengthLevel}`
        : "",
      dayMaster.rootLevel
        ? `根气为${dayMaster.rootLevel}`
        : "",
    ]
      .filter(Boolean)
      .join("，"),

    mainImage: uniqueText([
      firstCore?.brief,
      secondCore?.brief,
    ])
      .filter(Boolean)
      .join("；") ||
      "原局主线需要从月令、根气、十神透藏和组合关系继续观察。",

    strengthLevel:
      dayMaster.strengthLevel ||
      "待复核",

    usefulHint:
      featureVector.structure
        ?.usefulGodHint
        ?.reasoning ||
      "用忌只作结构提示，需结合格局、调候和做工继续复核。",

    confidence:
      firstCore?.confidence ||
      "medium",

    boundary:
      "本部分只分析出生原局，不加入大运、流年和流月；具体事件需要岁运触发和现实情况复核。",
  };
}

function buildMasterSummary(
  featureVector,
  coreImages,
) {
  const core = coreImages.core;
  const support = coreImages.support;
  const tension = coreImages.tension;
  const conditional =
    coreImages.conditional;

  const coreLine =
    core[0]?.brief ||
    support[0]?.brief ||
    "原局尚未形成足够明确的高阶主线。";

  const workLine =
    core[1]?.brief ||
    support.find(
      (item) =>
        item.domains.includes("career") ||
        item.domains.includes("wealth"),
    )?.brief ||
    "现实做工需要结合事业、财富和能力输出继续观察。";

  const strengths = uniqueText(
    [...core, ...support]
      .filter(
        (item) =>
          item.polarity !== "negative",
      )
      .map(
        (item) =>
          item.brief,
      ),
  ).slice(0, 3);

  const tensions = uniqueText(
    tension.map(
      (item) =>
        item.brief,
    ),
  ).slice(0, 3);

  return {
    title: "命理总批（原局草稿）",
    core: coreLine,
    workLine,
    strengths,
    tensions,

    conclusion: uniqueText([
      coreLine,
      workLine,
      tensions[0]
        ? `命局需要处理的主要矛盾是：${tensions[0]}`
        : "",
    ])
      .filter(Boolean)
      .join(" "),

    evidenceFactIds: uniqueText([
      ...core.map((item) => item.id),
      ...support
        .slice(0, 3)
        .map((item) => item.id),
      ...tension
        .slice(0, 2)
        .map((item) => item.id),
    ]),

    conditionalFactIds:
      conditional.map(
        (item) => item.id,
      ),

    confidence:
      core[0]?.confidence ||
      "medium",

    boundary:
      "这是由原局事实自动组织的总批草稿，目前不包含岁运事件判断。",
  };
}

function buildLegacyTopicCard(
  config,
  facts,
) {
  const candidates = facts
    .filter(
      (fact) =>
        config.domains.some(
          (domain) =>
            (fact.domains ?? []).includes(domain),
        ),
    )
    .sort((left, right) => {
      const leftTagScore =
        preferredTagScore(
          left,
          config.preferredTags,
        );

      const rightTagScore =
        preferredTagScore(
          right,
          config.preferredTags,
        );

      return (
        rightTagScore -
          leftTagScore ||
        factRank(right) -
          factRank(left)
      );
    });

  const primary =
    candidates.find(
      (fact) =>
        fact.specificity !== "generic" &&
        fact.status !== "weak",
    ) ??
    candidates[0] ??
    null;

  const secondary = candidates
    .filter(
      (fact) =>
        fact.id !== primary?.id &&
        fact.status !== "weak",
    )
    .slice(0, 2);

  const tension = candidates.find(
    (fact) =>
      fact.role === "tension" &&
      fact.id !== primary?.id,
  );

  const evidence = uniqueText([
    ...normalizeEvidence(
      primary?.evidence,
    ),
    ...secondary.flatMap(
      (fact) =>
        normalizeEvidence(fact.evidence),
    ),
  ]).slice(0, 5);

  return {
    topic: config.topic,

    title:
      primary?.name ||
      config.title,

    level:
      primary?.score >= 82
        ? "high"
        : primary?.score >= 62
          ? "medium"
          : "low",

    evidence,

    image:
      primary?.brief ||
      primary?.meaning ||
      config.fallback,

    reality:
      uniqueText(
        secondary.map(
          (fact) =>
            fact.brief ||
            fact.meaning,
        ),
      ).join("；") ||
      config.fallback,

    boundary:
      firstText(
        primary?.counterEvidence,
      ) ||
      tension?.brief ||
      "该维度只作原局结构观察，具体表现需要现实背景和岁运复核。",

    confidence:
      primary?.confidence ||
      "low",

    factIds: uniqueText([
      primary?.id,
      ...secondary.map(
        (fact) => fact.id,
      ),
      tension?.id,
    ]),
  };
}

function buildHitList(facts) {
  const all = facts
    .filter(
      (fact) =>
        fact.specificity !== "generic",
    )
    .map((fact) => ({
      id: fact.id,
      name:
        fact.name ||
        fact.label,
      category:
        normalizeCategory(
          fact.category,
        ),
      subcategory:
        fact.subcategory ||
        "",
      status:
        fact.status ||
        "confirmed",
      role:
        fact.role ||
        "support",
      polarity:
        fact.polarity ||
        "mixed",
      score:
        Number(
          fact.score ?? 50,
        ),
      priority:
        Number(
          fact.priority ??
          fact.score ??
          50,
        ),
      importance:
        fact.importance ||
        importanceFromScore(
          fact.score,
        ),
      confidence:
        fact.confidence ||
        confidenceFromScore(
          fact.score,
        ),
      specificity:
        fact.specificity ||
        "medium",
      sourceRuleId:
        fact.sourceRuleId ||
        fact.id,
      relatedFactIds:
        fact.relatedFactIds ??
        [],
      semanticGroup:
        fact.semanticGroup ||
        fact.id,
      domains:
        fact.domains ??
        [],
      supports:
        fact.domains ??
        [],
      evidence:
        normalizeEvidence(
          fact.evidence,
        ),
      conditions:
        normalizeTextList(
          fact.conditions,
        ),
      counterEvidence:
        normalizeTextList(
          fact.counterEvidence,
        ),
      source:
        fact.category === "神煞辅助"
          ? "原局神煞"
          : "原局四柱",
      brief:
        fact.brief ||
        fact.meaning ||
        "",
      image:
        fact.tags ??
        [],
      tags:
        fact.tags ??
        [],
    }));

  return {
    all,
    confirmed: all.filter(
      (fact) =>
        fact.status === "confirmed",
    ),
    conditional: all.filter(
      (fact) =>
        fact.status === "conditional",
    ),
    weak: all.filter(
      (fact) =>
        fact.status === "weak",
    ),
    featured: all
      .filter(
        (fact) =>
          fact.category !== "神煞辅助" &&
          fact.importance !== "low",
      )
      .slice(0, 8),
    byCategory:
      groupByCategory(all),
  };
}

function toImage(fact) {
  return {
    id: fact.id,
    name:
      fact.name ||
      fact.label,
    category:
      normalizeCategory(
        fact.category,
      ),
    subcategory:
      fact.subcategory ||
      "",
    role:
      fact.role ||
      "support",
    polarity:
      fact.polarity ||
      "mixed",
    status:
      fact.status ||
      "confirmed",
    score:
      Number(
        fact.score ?? 50,
      ),
    priority:
      Number(
        fact.priority ??
        fact.score ??
        50,
      ),
    confidence:
      fact.confidence ||
      "medium",
    importance:
      fact.importance ||
      importanceFromScore(
        fact.score,
      ),
    brief:
      fact.brief ||
      fact.meaning ||
      "",
    evidence:
      normalizeEvidence(
        fact.evidence,
      ),
    conditions:
      normalizeTextList(
        fact.conditions,
      ),
    counterEvidence:
      normalizeTextList(
        fact.counterEvidence,
      ),
    domains:
      fact.domains ??
      [],
    tags:
      fact.tags ??
      [],
    semanticGroup:
      fact.semanticGroup ||
      fact.id,
    sourceRuleId:
      fact.sourceRuleId ||
      fact.id,
  };
}

function sortFacts(facts) {
  return [...facts].sort(
    (left, right) =>
      roleRank(right.role) -
        roleRank(left.role) ||
      Number(
        right.priority ??
          right.score ??
          0,
      ) -
        Number(
          left.priority ??
            left.score ??
            0,
        ) ||
      Number(right.score ?? 0) -
        Number(left.score ?? 0),
  );
}

function uniqueFacts(facts) {
  const result = [];
  const seen = new Set();

  for (const fact of facts) {
    const key =
      fact.semanticGroup ||
      fact.id;

    if (!key || seen.has(key)) {
      continue;
    }

    seen.add(key);
    result.push(fact);
  }

  return result;
}

function preferredTagScore(
  fact,
  preferredTags = [],
) {
  if (
    !Array.isArray(preferredTags) ||
    preferredTags.length === 0
  ) {
    return 0;
  }

  const text = [
    fact.name,
    fact.brief,
    ...(fact.tags ?? []),
  ].join(" ");

  return preferredTags.filter(
    (tag) =>
      text.includes(tag),
  ).length * 20;
}

function factRank(fact) {
  return (
    roleRank(fact.role) * 100 +
    Number(
      fact.priority ??
        fact.score ??
        0,
    ) +
    Number(
      fact.score ?? 0,
    ) / 10
  );
}

function roleRank(role) {
  return {
    core: 7,
    main: 6,
    tension: 5,
    support: 4,
    resource: 4,
    base: 3,
    condition: 2,
    weak: 1,
    auxiliary: 0,
  }[role] ?? 0;
}

function isAuxiliaryFact(fact) {
  return (
    fact.category === "神煞辅助" ||
    fact.role === "auxiliary"
  );
}

function normalizeEvidence(value) {
  return normalizeArray(value)
    .map((item) => {
      if (
        typeof item === "string"
      ) {
        return {
          type: "structure",
          position: "",
          value: "",
          text: item.trim(),
        };
      }

      if (
        item &&
        typeof item === "object"
      ) {
        const text =
          item.text ||
          item.description ||
          item.evidence ||
          [
            item.position,
            item.value,
          ]
            .filter(Boolean)
            .join("：");

        return {
          ...item,
          text,
        };
      }

      return {
        type: "structure",
        position: "",
        value: "",
        text: String(item ?? ""),
      };
    })
    .filter((item) => item.text);
}

function normalizeTextList(value) {
  return normalizeArray(value)
    .map((item) =>
      typeof item === "string"
        ? item.trim()
        : item?.text ||
          item?.description ||
          String(item ?? ""),
    )
    .filter(Boolean);
}

function firstText(value) {
  return normalizeTextList(value)[0] || "";
}

function normalizeArray(value) {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return [];
  }

  return Array.isArray(value)
    ? value.flat(Infinity)
    : [value];
}

function uniqueText(items) {
  return [
    ...new Set(
      normalizeArray(items)
        .filter(
          (item) =>
            item !== undefined &&
            item !== null &&
            String(item).trim() !== "",
        )
        .map((item) =>
          String(item).trim(),
        ),
    ),
  ];
}

function groupByCategory(items) {
  const result = {};

  for (const item of items) {
    const category =
      item.category ||
      "结构象";

    if (!result[category]) {
      result[category] = [];
    }

    result[category].push(item);
  }

  return result;
}

function normalizeCategory(category = "") {
  if (
    /日主根气|十神透藏|组合结构|干支关系|柱位重复|五行调候|神煞辅助/.test(
      category,
    )
  ) {
    return category;
  }

  return {
    day_master: "日主根气",
    ten_god: "十神透藏",
    ten_god_position: "十神透藏",
    combination: "组合结构",
    relation: "干支关系",
    pillar: "柱位重复",
    element: "五行调候",
    shensha: "神煞辅助",
  }[category] ?? "结构象";
}

function importanceFromScore(score) {
  const number = Number(score ?? 0);

  if (number >= 82) return "high";
  if (number >= 65) return "medium";
  return "low";
}

function confidenceFromScore(score) {
  const number = Number(score ?? 0);

  if (number >= 84) return "high";
  if (number >= 62) return "medium";
  return "low";
}
