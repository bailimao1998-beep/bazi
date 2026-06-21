/**
 * 原局高阶组合规则库。
 *
 * 本文件只放“多个条件共同成立后才能下结论”的规则。
 *
 * 不在这里处理：
 * - 单柱十神透出；
 * - 单个藏干；
 * - 日主得令失令；
 * - 单条冲合刑害；
 * - 单个神煞；
 * - 单一五行计数。
 */

export const atomicNatalRules = [
  {
    id: "officer_resource_chain",
    name: (fv) =>
      weighted(fv, "七杀") >
      weighted(fv, "正官")
        ? "杀印相生线索"
        : "官印相生线索",

    category: "组合结构",
    subcategory: "官杀印",
    semanticGroup: "officer-resource-chain",

    role: "core",
    polarity: "positive",
    status: "confirmed",
    priority: 94,
    score: 86,
    confidence: "high",
    importance: "high",

    conditions: {
      all: [
        {
          path: "tenGods.groupCounts.officer",
          op: "gte",
          value: 0.7,
          label: "官杀有实际落点",
        },
        {
          path: "tenGods.groupCounts.resource",
          op: "gte",
          value: 0.7,
          label: "印星有实际落点",
        },
      ],

      any: [
        {
          path: "pillars.month.stemTenGod",
          op: "matches",
          value: "正印|偏印",
          label: "月干见印",
        },
        {
          path: "pillars.month.branchMainTenGod",
          op: "matches",
          value: "正官|七杀",
          label: "月令见官杀",
        },
        {
          path: "pillars.year.stemTenGod",
          op: "matches",
          value: "正官|七杀|正印|偏印",
          label: "年干参与官印",
        },
      ],
    },

    brief:
      "规则、责任和外部压力有机会通过学习、资质、经验和系统能力得到承接。",

    evidence: [
      (fv) =>
        `官杀加权约${round(
          group(fv, "officer"),
        )}`,

      (fv) =>
        `印星加权约${round(
          group(fv, "resource"),
        )}`,
    ],

    conditionNotes: [
      "官杀与印星都必须在原局有实际落点",
      "月令或月干参与时，组合权重更高",
    ],

    counterEvidence: [
      "若日主承受能力不足，官杀首先体现为压力",
      "若印星被财星严重损伤，承接能力会下降",
    ],

    domains: [
      "self",
      "parents",
      "career",
      "fortune",
    ],

    tags: [
      "官印",
      "杀印",
      "规则",
      "资质",
      "承接",
    ],
  },

  {
    id: "wealth_officer_resource_chain",
    name: "财官印承接线索",
    category: "组合结构",
    subcategory: "财官印",
    semanticGroup: "wealth-officer-resource-chain",

    role: "core",
    polarity: "positive",
    status: "conditional",
    priority: 96,
    score: 88,
    confidence: "medium",
    importance: "high",

    conditions: {
      all: [
        {
          path: "tenGods.groupCounts.wealth",
          op: "gte",
          value: 0.7,
          label: "财星有落点",
        },
        {
          path: "tenGods.groupCounts.officer",
          op: "gte",
          value: 0.7,
          label: "官杀有落点",
        },
        {
          path: "tenGods.groupCounts.resource",
          op: "gte",
          value: 0.7,
          label: "印星有落点",
        },
      ],
    },

    brief:
      "资源、规则和承接能力同时出现，具备从现实资源进入岗位责任，再转化为资质或系统能力的可能。",

    evidence: [
      (fv) =>
        `财星约${round(
          group(fv, "wealth"),
        )}`,

      (fv) =>
        `官杀约${round(
          group(fv, "officer"),
        )}`,

      (fv) =>
        `印星约${round(
          group(fv, "resource"),
        )}`,
    ],

    conditionNotes: [
      "财、官、印三者均需在原局有真实位置",
      "是否形成顺生，还要继续看距离、阻隔和强弱",
    ],

    counterEvidence: [
      "三者只是同时出现时，只能作为承接线索",
      "若比劫或食伤形成明显阻隔，链条会转向竞争或冲突",
    ],

    domains: [
      "wealth",
      "career",
      "parents",
      "property",
      "self",
    ],

    tags: [
      "财官印",
      "资源",
      "岗位",
      "资质",
    ],
  },

  {
    id: "output_wealth_chain",
    name: "食伤生财线索",
    category: "组合结构",
    subcategory: "食伤财",
    semanticGroup: "output-wealth-chain",

    role: "main",
    polarity: "positive",
    status: "confirmed",
    priority: 90,
    score: 83,
    confidence: "high",

    conditions: {
      all: [
        {
          path: "tenGods.groupCounts.output",
          op: "gte",
          value: 0.9,
          label: "食伤有实际落点",
        },
        {
          path: "tenGods.groupCounts.wealth",
          op: "gte",
          value: 0.5,
          label: "财星有实际落点",
        },
      ],
    },

    brief:
      "表达、技术、作品或项目成果与现实收益之间存在转化通道。",

    evidence: [
      (fv) =>
        `食伤加权约${round(
          group(fv, "output"),
        )}`,

      (fv) =>
        `财星加权约${round(
          group(fv, "wealth"),
        )}`,
    ],

    counterEvidence: [
      "食伤无根或受印星过度压制时，输出转化会减弱",
      "财星过弱时，容易有成果但变现不足",
    ],

    domains: [
      "career",
      "wealth",
      "children",
    ],

    tags: [
      "食伤",
      "财星",
      "项目",
      "变现",
    ],
  },

  {
    id: "hurting_officer_resource_balance",
    name: "伤官配印线索",
    category: "组合结构",
    subcategory: "伤官印",
    semanticGroup: "hurting-officer-resource",

    role: "main",
    polarity: "positive",
    status: "conditional",
    priority: 88,
    score: 82,
    confidence: "medium",

    conditions: {
      all: [
        {
          path: "tenGods.weightedCounts.伤官",
          op: "gte",
          value: 0.6,
          label: "伤官有实际落点",
        },
        {
          path: "tenGods.groupCounts.resource",
          op: "gte",
          value: 0.7,
          label: "印星有实际落点",
        },
      ],
    },

    brief:
      "表达、批判和创造能力有机会通过学习、专业体系和资质约束得到整理。",

    evidence: [
      (fv) =>
        `伤官加权约${round(
          weighted(fv, "伤官"),
        )}`,

      (fv) =>
        `印星加权约${round(
          group(fv, "resource"),
        )}`,
    ],

    counterEvidence: [
      "印星过重时可能压制表达",
      "伤官过强而印弱时，容易先表现为挑战规则",
    ],

    domains: [
      "self",
      "career",
      "fortune",
      "children",
    ],

    tags: [
      "伤官配印",
      "表达",
      "专业",
      "体系",
    ],
  },

  {
    id: "hurting_officer_meets_officer",
    name: "伤官见官线索",
    category: "组合结构",
    subcategory: "伤官官星",
    semanticGroup: "hurting-officer-officer",

    role: "tension",
    polarity: "negative",
    status: "conditional",
    priority: 91,
    score: 85,
    confidence: "medium",

    conditions: {
      all: [
        {
          path: "tenGods.weightedCounts.伤官",
          op: "gte",
          value: 0.6,
          label: "伤官有实际落点",
        },
        {
          path: "tenGods.weightedCounts.正官",
          op: "gte",
          value: 0.6,
          label: "正官有实际落点",
        },
      ],
    },

    brief:
      "个人表达、判断和自由度容易与规则、岗位要求或权威体系发生拉扯。",

    evidence: [
      (fv) =>
        `伤官约${round(
          weighted(fv, "伤官"),
        )}`,

      (fv) =>
        `正官约${round(
          weighted(fv, "正官"),
        )}`,
    ],

    counterEvidence: [
      "印星能制伤官时，冲突可转为专业表达",
      "财星通关时，表达可能转向成果和现实效率",
    ],

    domains: [
      "career",
      "self",
      "spouse",
      "friends",
    ],

    tags: [
      "伤官见官",
      "规则冲突",
      "表达",
      "权威",
    ],
  },

  {
    id: "peer_wealth_tension",
    name: "比劫牵财",
    category: "组合结构",
    subcategory: "比劫财星",
    semanticGroup: "peer-wealth-tension",

    role: "tension",
    polarity: "mixed",
    status: "confirmed",
    priority: 86,
    score: 79,
    confidence: "high",

    conditions: {
      all: [
        {
          path: "tenGods.groupCounts.peer",
          op: "gte",
          value: 2,
          label: "比劫有明显分量",
        },
        {
          path: "tenGods.groupCounts.wealth",
          op: "gte",
          value: 0.5,
          label: "财星有实际落点",
        },
      ],
    },

    brief:
      "钱财、合作、同辈和资源分配容易互相牵动，既有共同争取资源的能力，也有人情与利益边界问题。",

    evidence: [
      (fv) =>
        `比劫约${round(
          group(fv, "peer"),
        )}`,

      (fv) =>
        `财星约${round(
          group(fv, "wealth"),
        )}`,
    ],

    counterEvidence: [
      "官杀有力时可以约束比劫",
      "食伤生财顺畅时，竞争可转为共同创造收益",
    ],

    domains: [
      "wealth",
      "siblings",
      "friends",
      "career",
    ],

    tags: [
      "比劫",
      "财星",
      "合作",
      "分配",
    ],
  },

  {
    id: "wealth_heavy_body_weak",
    name: "财多身弱线索",
    category: "组合结构",
    subcategory: "财身关系",
    semanticGroup: "wealth-heavy-body-weak",

    role: "tension",
    polarity: "negative",
    status: "conditional",
    priority: 93,
    score: 87,
    confidence: "medium",

    conditions: {
      all: [
        {
          path: "tenGods.groupCounts.wealth",
          op: "gte",
          value: 1.8,
          label: "财星分量偏重",
        },
        {
          path: "dayMaster.strengthScore",
          op: "lte",
          value: 45,
          label: "日主承受能力偏弱",
        },
      ],
    },

    brief:
      "现实资源、金钱责任或关系责任较多，但自身承接能力不足时，容易先感到压力和消耗。",

    evidence: [
      (fv) =>
        `财星约${round(
          group(fv, "wealth"),
        )}`,

      (fv) =>
        `日主强弱分约${round(
          fv.dayMaster?.strengthScore,
        )}`,
    ],

    counterEvidence: [
      "印比得力时可增强承接",
      "财星有序且不过度集中时，压力会下降",
    ],

    domains: [
      "wealth",
      "spouse",
      "self",
      "health",
    ],

    tags: [
      "财多身弱",
      "责任",
      "承载",
      "压力",
    ],
  },

  {
    id: "resource_heavy_output_weak",
    name: "印重食伤弱",
    category: "组合结构",
    subcategory: "印食关系",
    semanticGroup: "resource-heavy-output-weak",

    role: "tension",
    polarity: "mixed",
    status: "confirmed",
    priority: 85,
    score: 78,
    confidence: "high",

    conditions: {
      all: [
        {
          path: "tenGods.groupCounts.resource",
          op: "gte",
          value: 2,
          label: "印星分量明显",
        },
        {
          path: "tenGods.groupCounts.output",
          op: "lte",
          value: 0.7,
          label: "食伤输出偏弱",
        },
      ],
    },

    brief:
      "吸收、思考和体系意识较强，但表达、项目落地和成果外显可能偏慢。",

    evidence: [
      (fv) =>
        `印星约${round(
          group(fv, "resource"),
        )}`,

      (fv) =>
        `食伤约${round(
          group(fv, "output"),
        )}`,
    ],

    suppresses: [
      "output-wealth-chain",
    ],

    counterEvidence: [
      "食伤透干或在时柱有根时，后期输出能力会增强",
      "现实训练和项目反馈可改善落地速度",
    ],

    domains: [
      "self",
      "career",
      "children",
      "fortune",
    ],

    tags: [
      "印重",
      "食伤弱",
      "思考",
      "落地",
    ],
  },

  {
    id: "officer_killing_mixed",
    name: "官杀混杂线索",
    category: "组合结构",
    subcategory: "官杀关系",
    semanticGroup: "officer-killing-mixed",

    role: "tension",
    polarity: "mixed",
    status: "conditional",
    priority: 84,
    score: 77,
    confidence: "medium",

    conditions: {
      all: [
        {
          path: "tenGods.weightedCounts.正官",
          op: "gte",
          value: 0.5,
          label: "正官有落点",
        },
        {
          path: "tenGods.weightedCounts.七杀",
          op: "gte",
          value: 0.5,
          label: "七杀有落点",
        },
      ],
    },

    brief:
      "稳定规则与高压竞争同时存在，容易面对多套标准、不同权威或职责边界不清的问题。",

    evidence: [
      (fv) =>
        `正官约${round(
          weighted(fv, "正官"),
        )}`,

      (fv) =>
        `七杀约${round(
          weighted(fv, "七杀"),
        )}`,
    ],

    counterEvidence: [
      "官杀有明确主次时，不宜直接作混乱解释",
      "印星、食伤或合化可能重新整理官杀关系",
    ],

    domains: [
      "career",
      "self",
      "spouse",
      "health",
    ],

    tags: [
      "官杀混杂",
      "规则",
      "压力",
      "主次",
    ],
  },

  {
    id: "day_branch_clashed",
    name: "日支受冲",
    category: "组合结构",
    subcategory: "夫妻宫关系",
    semanticGroup: "day-branch-clashed",

    role: "tension",
    polarity: "mixed",
    status: "confirmed",
    priority: 92,
    score: 86,
    confidence: "high",

    customMatch: (fv) => {
      const relations = dayRelations(
        fv,
        /冲/,
      );

      return {
        matched: relations.length > 0,
        label: "日支受到冲动",
        actual: relations.map(
          (item) => item.text,
        ),
        expected: "至少一条冲",
      };
    },

    evidence: (fv) =>
      dayRelations(fv, /冲/)
        .map((item) => item.text),

    brief:
      "关系宫、生活落点和自身节奏容易受到另一柱直接推动，变化感和边界问题较明显。",

    counterEvidence: [
      "冲不等于必然分离，也可能表现为迁动、变化和关系重组",
      "需要结合被冲地支的十神与强弱判断现实方向",
    ],

    domains: [
      "spouse",
      "self",
      "movement",
      "health",
    ],

    tags: [
      "日支",
      "夫妻宫",
      "冲",
      "变化",
    ],
  },

  {
    id: "day_branch_combined",
    name: "日支逢合",
    category: "组合结构",
    subcategory: "夫妻宫关系",
    semanticGroup: "day-branch-combined",

    role: "support",
    polarity: "mixed",
    status: "confirmed",
    priority: 84,
    score: 76,
    confidence: "high",

    customMatch: (fv) => {
      const relations = dayRelations(
        fv,
        /合/,
      );

      return {
        matched: relations.length > 0,
        label: "日支形成合局关系",
        actual: relations.map(
          (item) => item.text,
        ),
        expected: "至少一条合",
      };
    },

    evidence: (fv) =>
      dayRelations(fv, /合/)
        .map((item) => item.text),

    brief:
      "关系宫容易与另一柱形成连接、牵绊或合作，亲密关系和现实责任之间的绑定感较明显。",

    counterEvidence: [
      "合不等于感情一定好，也可能表现为牵制和不易分开",
      "是否合化需结合月令、透干和五行条件",
    ],

    domains: [
      "spouse",
      "self",
      "friends",
    ],

    tags: [
      "日支",
      "夫妻宫",
      "合",
      "连接",
    ],
  },

  {
    id: "day_branch_punished_harmed_broken",
    name: "日支刑害破牵动",
    category: "组合结构",
    subcategory: "夫妻宫关系",
    semanticGroup: "day-branch-tension",

    role: "tension",
    polarity: "negative",
    status: "confirmed",
    priority: 87,
    score: 81,
    confidence: "high",

    customMatch: (fv) => {
      const relations = dayRelations(
        fv,
        /刑|害|穿|破/,
      );

      return {
        matched: relations.length > 0,
        label: "日支见刑害穿破",
        actual: relations.map(
          (item) => item.text,
        ),
        expected: "至少一条刑害穿破",
      };
    },

    evidence: (fv) =>
      dayRelations(
        fv,
        /刑|害|穿|破/,
      ).map((item) => item.text),

    brief:
      "亲密关系、生活节奏和安全感容易出现隐性摩擦、反复调整或边界消耗。",

    counterEvidence: [
      "需要区分刑、害、穿、破的不同作用方式",
      "不能仅凭一条关系直接判断婚姻结果",
    ],

    domains: [
      "spouse",
      "self",
      "health",
      "fortune",
    ],

    tags: [
      "日支",
      "刑害破",
      "关系摩擦",
    ],
  },

  {
    id: "day_pillar_fuyin",
    name: "日柱参与伏吟",
    category: "组合结构",
    subcategory: "柱位重复",
    semanticGroup: "day-pillar-fuyin",

    role: "tension",
    polarity: "mixed",
    status: "confirmed",
    priority: 88,
    score: 82,
    confidence: "high",

    customMatch: (fv) => {
      const dayLabel =
        fv.pillars?.day?.label;

      const matches =
        Object.values(
          fv.pillars ?? {},
        ).filter(
          (pillar) =>
            pillar.key !== "day" &&
            pillar.label &&
            pillar.label === dayLabel,
        );

      return {
        matched:
          Boolean(dayLabel) &&
          matches.length > 0,

        label: "日柱与其他柱干支相同",

        actual: matches.map(
          (pillar) =>
            `${pillar.name}${pillar.label}`,
        ),

        expected: dayLabel,
      };
    },

    evidence: (fv) => {
      const dayLabel =
        fv.pillars?.day?.label;

      return Object.values(
        fv.pillars ?? {},
      )
        .filter(
          (pillar) =>
            pillar.key !== "day" &&
            pillar.label === dayLabel,
        )
        .map(
          (pillar) =>
            `日柱${dayLabel}与${pillar.name}${pillar.label}相同`,
        );
    },

    brief:
      "自我、关系宫和被重复柱位的象会相互叠加，容易形成固定模式、反复主题或同类事务放大。",

    counterEvidence: [
      "伏吟只代表重复与放大，不能直接按吉凶解释",
      "具体应象仍取决于该柱十神、位置和原局关系",
    ],

    domains: [
      "self",
      "spouse",
      "movement",
      "fortune",
    ],

    tags: [
      "伏吟",
      "日柱",
      "重复",
      "放大",
    ],
  },

  {
    id: "element_bias_clear",
    name: "五行偏性明显",
    category: "组合结构",
    subcategory: "五行偏颇",
    semanticGroup: "element-bias-clear",

    role: "tension",
    polarity: "mixed",
    status: "confirmed",
    priority: 78,
    score: 72,
    confidence: "high",

    conditions: {
      all: [
        {
          path: "elements.biasLevel",
          op: "eq",
          value: "偏颇",
          label: "五行分布偏颇",
        },
      ],
    },

    brief:
      "某类五行反应方式较集中，性格、体感和现实选择容易形成固定偏性。",

    evidence: [
      (fv) =>
        `主导五行为${
          (fv.elements?.dominant ??
            []).join("、") ||
          "待查"
        }`,
    ],

    counterEvidence: [
      "偏性不等于坏，需要结合喜忌、调候与做工判断",
      "后天环境和岁运能够补充原局不足",
    ],

    domains: [
      "self",
      "health",
      "fortune",
    ],

    tags: [
      "五行偏颇",
      "偏性",
      "调候",
    ],
  },

  {
    id: "metal_water_fire_weak",
    name: "金水偏重、火气不足线索",
    category: "组合结构",
    subcategory: "寒暖燥湿",
    semanticGroup: "metal-water-fire-weak",

    role: "condition",
    polarity: "mixed",
    status: "conditional",
    priority: 75,
    score: 70,
    confidence: "medium",

    conditions: {
      all: [
        {
          path: "elements.counts.metal",
          op: "gte",
          value: 1.5,
          label: "金气有分量",
        },
        {
          path: "elements.counts.water",
          op: "gte",
          value: 1.5,
          label: "水气有分量",
        },
        {
          path: "elements.counts.fire",
          op: "lte",
          value: 0.5,
          label: "火气偏弱",
        },
      ],
    },

    brief:
      "规则、信息和流动感较明显，但温度、推动和外显热度不足时，容易偏向冷静、慢热或寒湿感。",

    evidence: [
      (fv) =>
        `金约${round(
          fv.elements?.counts?.metal,
        )}`,

      (fv) =>
        `水约${round(
          fv.elements?.counts?.water,
        )}`,

      (fv) =>
        `火约${round(
          fv.elements?.counts?.fire,
        )}`,
    ],

    counterEvidence: [
      "月令、透干和实际调候比单纯数量更重要",
      "不能只凭五行计数直接判断身体疾病",
    ],

    domains: [
      "health",
      "self",
      "fortune",
      "career",
    ],

    tags: [
      "金水",
      "火弱",
      "寒湿",
      "慢热",
    ],
  },
];

function group(
  featureVector,
  groupName,
) {
  return Number(
    featureVector
      ?.tenGods
      ?.groupCounts
      ?.[groupName] ?? 0,
  );
}

function weighted(
  featureVector,
  tenGodName,
) {
  return Number(
    featureVector
      ?.tenGods
      ?.weightedCounts
      ?.[tenGodName] ?? 0,
  );
}

function dayRelations(
  featureVector,
  pattern,
) {
  return (
    featureVector.relations ?? []
  ).filter((relation) => {
    if (!relation.affectsDayBranch) {
      return false;
    }

    return pattern.test(
      [
        relation.type,
        relation.name,
        relation.text,
      ].join(" "),
    );
  });
}

function round(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return 0;
  }

  return Math.round(number * 100) / 100;
}