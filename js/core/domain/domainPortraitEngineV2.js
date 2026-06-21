import {
  domainRules,
} from "./domainRuleDatabase.js";

/**
 * 十二维基础画像第二版。
 *
 * 不再通过固定规则ID挑选文案，
 * 而是从该领域已经命中的事实中选择：
 *
 * 主证、辅证、压力证据、弱证据。
 */
export function buildFactDrivenDomainReport({
  featureVector = {},
  atomicFacts = {},
} = {}) {
  const facts = Array.isArray(
    atomicFacts.facts,
  )
    ? atomicFacts.facts
    : [];

  const domainEvidenceMap = {};
  const twelveDomains = [];

  for (const rule of domainRules) {
    const selected =
      selectDomainFacts(
        rule.key,
        facts,
      );

    const score =
      calculateDomainScore(selected);

    const confidence =
      calculateConfidence(
        score,
        selected.primaryFact,
      );

    const evidence =
      buildEvidence(selected);

    const matchedFactIds =
      uniqueText([
        selected.primaryFact?.id,
        ...selected.secondaryFacts.map(
          (fact) => fact.id,
        ),
        selected.tensionFact?.id,
        selected.counterFact?.id,
      ]);

    const evidenceItem = {
      domain: rule.key,
      score,
      confidence,

      primaryFact:
        selected.primaryFact,

      secondaryFacts:
        selected.secondaryFacts,

      tensionFact:
        selected.tensionFact,

      counterFact:
        selected.counterFact,

      matchedFactIds,

      evidence,

      matchedSignals: [],

      matchedRules: uniqueText([
        selected.primaryFact?.name,
        ...selected.secondaryFacts.map(
          (fact) => fact.name,
        ),
        selected.tensionFact?.name,
      ]),

      matchedCombinations: [],
    };

    domainEvidenceMap[rule.key] =
      evidenceItem;

    twelveDomains.push(
      buildDomainPortrait(
        rule,
        evidenceItem,
      ),
    );
  }

  return {
    domainEvidence: {
      engineVersion:
        "domain-v2",

      signals: [],

      atomicFacts,

      featureVector,

      domainEvidence:
        domainEvidenceMap,
    },

    twelveDomains,
  };
}

function selectDomainFacts(
  domainKey,
  facts,
) {
  const matched = facts
    .filter(
      (fact) =>
        (fact.domains ?? [])
          .includes(domainKey),
    )
    .filter(
      (fact) =>
        fact.category !== "神煞辅助",
    )
    .sort(compareFacts);

  const primaryFact =
    matched.find(
      (fact) =>
        fact.status !== "weak" &&
        fact.role !== "tension" &&
        fact.specificity !== "generic",
    ) ??
    matched.find(
      (fact) =>
        fact.status !== "weak" &&
        fact.role !== "tension",
    ) ??
    matched.find(
      (fact) =>
        fact.status !== "weak",
    ) ??
    matched[0] ??
    null;

  const secondaryFacts =
    matched
      .filter(
        (fact) =>
          fact.id !== primaryFact?.id &&
          fact.status !== "weak" &&
          fact.role !== "tension",
      )
      .slice(0, 2);

  const tensionFact =
    matched.find(
      (fact) =>
        fact.id !== primaryFact?.id &&
        (
          fact.role === "tension" ||
          fact.polarity === "negative"
        ),
    ) ?? null;

  const counterFact =
    matched.find(
      (fact) =>
        fact.id !== primaryFact?.id &&
        (
          fact.status === "weak" ||
          fact.role === "weak" ||
          fact.role === "condition"
        ),
    ) ?? null;

  return {
    matched,
    primaryFact,
    secondaryFacts,
    tensionFact,
    counterFact,
  };
}

function buildDomainPortrait(
  rule,
  evidence,
) {
  const primary =
    evidence.primaryFact;

  const secondary =
    evidence.secondaryFacts ?? [];

  const tension =
    evidence.tensionFact;

  const counter =
    evidence.counterFact;

  const title = primary
    ? `${rule.label}：${shortName(
        primary.name,
      )}`
    : `${rule.label}：原局信号不重`;

  const judgement = primary
    ? joinClauses([
        factText(primary),
        secondary[0]
          ? `同时，${factText(
              secondary[0],
            )}`
          : "",
      ])
    : rule.weakEvidenceText;

  const manifestation =
    primary
      ? buildManifestation(
          rule.key,
          primary,
        )
      : buildWeakManifestation(
          rule,
        );

  const pressure =
    factText(tension) ||
    factText(counter) ||
    rule.weakEvidenceText;

  const keywords =
    uniqueText([
      ...(primary?.tags ?? []),
      ...secondary.flatMap(
        (fact) =>
          fact.tags ?? [],
      ),
      ...(tension?.tags ?? []),
    ]).slice(0, 5);

  const condition =
    uniqueText([
      primary
        ? `主证：${primary.name}`
        : "",

      ...secondary.map(
        (fact) =>
          `辅证：${fact.name}`,
      ),

      tension
        ? `压力：${tension.name}`
        : "",

      counter
        ? `边界：${counter.name}`
        : "",
    ]).slice(0, 8);

  const counterEvidence =
    uniqueText([
      ...normalizeTextList(
        primary?.counterEvidence,
      ),

      ...normalizeTextList(
        tension?.counterEvidence,
      ),

      ...normalizeTextList(
        counter?.counterEvidence,
      ),

      evidence.confidence === "low"
        ? "该维度在原局不是强主线，现实中不一定明显外显。"
        : "",

      "本维度只作原局基础画像，具体事件仍需结合现实背景和岁运。",
    ]).slice(0, 6);

  return {
    key: rule.key,
    label: rule.label,

    title,

    judgement,

    manifestation,

    pressure,

    strengths:
      uniqueText(
        [primary, ...secondary]
          .filter(
            (fact) =>
              fact &&
              fact.polarity !== "negative",
          )
          .map(factText),
      ).slice(0, 3),

    pressures:
      uniqueText([
        factText(tension),
        factText(counter),
      ]).slice(0, 3),

    keywords,

    tags: keywords,

    evidence:
      evidence.evidence.length
        ? evidence.evidence
        : [
            rule.defaultJudgement,
          ],

    primaryFact:
      primary ?? null,

    secondaryFacts:
      secondary,

    tensionFact:
      tension ?? null,

    counterFact:
      counter ?? null,

    matchedFactIds:
      evidence.matchedFactIds,

    matchedCombinations: [],

    condition,

    bookExplanation:
      rule.defaultJudgement,

    counterEvidence,

    confidence:
      evidence.confidence,

    score:
      evidence.score,

    evidenceLevel:
      evidence.score >= 78
        ? "strong"
        : evidence.score >= 55
          ? "medium"
          : "weak",
  };
}

function buildManifestation(
  domain,
  fact,
) {
  const primaryText =
    factText(fact);

  const templates = {
    self:
      `现实中主要体现在性格、判断方式、做事节奏和边界感上。其基础表现为：${primaryText}`,

    parents:
      `现实中主要体现在早年环境、家中规则、父母分工和成长资源上。其基础表现为：${primaryText}`,

    siblings:
      `现实中主要体现在同辈竞争、合作分工和资源边界上。其基础表现为：${primaryText}`,

    spouse:
      `现实中主要体现在亲密关系中的安全感、沟通方式、边界和责任分配上。其基础表现为：${primaryText}`,

    children:
      `现实中主要体现在子女议题、作品、项目成果、表达输出和长期规划上。其基础表现为：${primaryText}`,

    wealth:
      `现实中主要体现在收入方式、资源调度、变现能力和财务承载上。其基础表现为：${primaryText}`,

    health:
      `现实中主要体现在长期体质、睡眠、消化、精力和压力反应上。其基础表现为：${primaryText}`,

    movement:
      `现实中主要体现在居住、出行、异地、岗位环境和生活节奏变化上。其基础表现为：${primaryText}`,

    friends:
      `现实中主要体现在朋友圈层、合作关系、人情往来和资源交换上。其基础表现为：${primaryText}`,

    career:
      `现实中主要体现在岗位职责、专业承接、规则压力和成果交付上。其基础表现为：${primaryText}`,

    property:
      `现实中主要体现在居住环境、固定资产、家庭资源和长期承载上。其基础表现为：${primaryText}`,

    fortune:
      `现实中主要体现在精神安全感、兴趣系统、长期心态和内在消耗上。其基础表现为：${primaryText}`,
  };

  return (
    templates[domain] ||
    `现实中会通过该领域的选择和承接方式表现出来：${primaryText}`
  );
}

function buildWeakManifestation(
  rule,
) {
  return (
    rule.weakEvidenceText ||
    `${rule.label}在原局中不是最明显的主线，需要后天环境和现实阶段带动。`
  );
}

function calculateDomainScore(
  selected,
) {
  const primaryScore =
    Number(
      selected.primaryFact
        ?.score ?? 0,
    );

  const secondaryScores =
    selected.secondaryFacts.map(
      (fact) =>
        Number(
          fact.score ?? 0,
        ),
    );

  const secondaryAverage =
    secondaryScores.length
      ? secondaryScores.reduce(
          (sum, value) =>
            sum + value,
          0,
        ) /
        secondaryScores.length
      : 0;

  const tensionScore =
    Number(
      selected.tensionFact
        ?.score ?? 0,
    );

  if (
    !selected.primaryFact &&
    !selected.tensionFact
  ) {
    return 20;
  }

  const score =
    primaryScore * 0.65 +
    secondaryAverage * 0.2 +
    tensionScore * 0.1 +
    Math.min(
      selected.matched.length * 2,
      8,
    );

  return Math.max(
    20,
    Math.min(
      100,
      Math.round(score),
    ),
  );
}

function calculateConfidence(
  score,
  primaryFact,
) {
  if (
    primaryFact?.confidence === "high" &&
    score >= 70
  ) {
    return "high";
  }

  if (
    score >= 55 &&
    primaryFact
  ) {
    return "medium";
  }

  return "low";
}

function buildEvidence(
  selected,
) {
  return uniqueText([
    ...normalizeEvidence(
      selected.primaryFact
        ?.evidence,
    ),

    ...selected.secondaryFacts.flatMap(
      (fact) =>
        normalizeEvidence(
          fact.evidence,
        ),
    ),

    ...normalizeEvidence(
      selected.tensionFact
        ?.evidence,
    ),
  ]).slice(0, 10);
}

function compareFacts(
  left,
  right,
) {
  return (
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

    Number(
      right.score ?? 0,
    ) -
      Number(
        left.score ?? 0,
      )
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

function factText(fact) {
  if (!fact) return "";

  return cleanSentence(
    fact.brief ||
    fact.meaning ||
    "",
  );
}

function shortName(name) {
  return String(name ?? "")
    .replace(/线索$/g, "")
    .replace(/原局/g, "")
    .trim();
}

function normalizeEvidence(value) {
  return normalizeArray(value)
    .map((item) => {
      if (
        typeof item === "string"
      ) {
        return item;
      }

      if (
        item &&
        typeof item === "object"
      ) {
        return (
          item.text ||
          item.description ||
          item.evidence ||
          [
            item.position,
            item.value,
          ]
            .filter(Boolean)
            .join("：")
        );
      }

      return "";
    })
    .filter(Boolean);
}

function normalizeTextList(value) {
  return normalizeArray(value)
    .map((item) =>
      typeof item === "string"
        ? item
        : item?.text ||
          item?.description ||
          "",
    )
    .filter(Boolean);
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
        .filter(Boolean)
        .map((item) =>
          String(item).trim(),
        )
        .filter(Boolean),
    ),
  ];
}

function cleanSentence(text) {
  return String(text ?? "")
    .replace(/\s+/g, " ")
    .replace(/[。；，\s]+$/g, "")
    .trim();
}

function joinClauses(items) {
  const content =
    uniqueText(items);

  if (!content.length) {
    return "";
  }

  return `${content.join("；")}。`;
}