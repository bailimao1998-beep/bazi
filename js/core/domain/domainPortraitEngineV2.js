import {
  domainRules,
} from "./domainRuleDatabase.js";
import { DOMAIN_NARRATIVE_COMPOSER_VERSION, composeDomainNarrative, } from "../natal/narrative/domainNarrativeComposer.js";

export const CONTRACT_DOMAIN_ENGINE_VERSION =
  "contract-domain-v1";

const roleOrder = {
  core: 5,
  tension: 4,
  support: 3,
  conditional: 2,
  candidate: 1,
};

const confidenceOrder = {
  high: 3,
  medium: 2,
  low: 1,
  unknown: 0,
};

const domainFactMap = {
  self: [
    "day_master",
    "strength",
    "root",
    "self",
    "比肩",
    "劫财",
  ],
  parents: [
    "year",
    "month",
    "resource",
    "正印",
    "偏印",
    "父母",
  ],
  siblings: [
    "比肩",
    "劫财",
    "peer",
    "siblings",
  ],
  spouse: [
    "day.branch",
    "spouse",
    "relation",
    "正财",
    "偏财",
    "正官",
    "七杀",
  ],
  children: [
    "hour",
    "食神",
    "伤官",
    "output",
    "children",
  ],
  wealth: [
    "正财",
    "偏财",
    "wealth",
    "element_count",
  ],
  health: [
    "element",
    "climate",
    "growth_stage",
    "health",
    "bias",
  ],
  movement: [
    "relation",
    "branch_clash",
    "movement",
    "冲",
  ],
  friends: [
    "比肩",
    "劫财",
    "peer",
    "friends",
    "合",
  ],
  career: [
    "正官",
    "七杀",
    "官杀",
    "career",
    "work",
  ],
  property: [
    "earth",
    "storage",
    "wealth",
    "property",
    "辰",
    "戌",
    "丑",
    "未",
  ],
  fortune: [
    "resource",
    "output",
    "flow",
    "fortune",
    "climate",
  ],
};

const domainFocusText = {
  self: "性格主见、做事节奏和边界感",
  parents: "家庭支持、长辈资源和早年承接方式",
  siblings: "同辈互动、合作竞争和资源边界",
  spouse: "关系互动、责任分配和亲密边界",
  children: "子女议题、作品、项目成果和表达输出",
  wealth: "收入方式、资源调度、变现能力和财务承载",
  health: "体质状态、作息节奏和五行偏性",
  movement: "居住、出行、异地、岗位环境和生活节奏",
  friends: "社交圈层、人脉合作和外部边界",
  career: "职业方向、岗位压力和专业承接",
  property: "固定资产、居住承载和资源沉淀",
  fortune: "精神安全感、长期心态和内在消化方式",
};

export function buildFactDrivenDomainReport({
  featureVector = {},
  structureSynopsis = {},
  atomicFacts = {},
  contractFacts,
  compositionImages = [],
  hitList = {},
  scope = "natal",
} = {}) {
  const normalizedScope =
    normalizeText(scope) || "natal";
  const facts = Array.isArray(contractFacts)
    ? contractFacts
    : Array.isArray(atomicFacts.contractFacts)
      ? atomicFacts.contractFacts
      : Array.isArray(atomicFacts.facts)
        ? atomicFacts.facts
        : [];
  const images = Array.isArray(compositionImages)
    ? compositionImages
    : [];
  const hitRows = Array.isArray(hitList?.all)
    ? hitList.all
    : [];
  const domainEvidenceMap = {};
  const twelveDomains = [];

  for (const rule of domainRules) {
    const selected =
      selectDomainEvidence({
        rule,
        facts,
        images,
        hitRows,
      });
    const portrait =
      buildDomainPortrait({
        rule,
        selected,
        structureSynopsis,
        scope:
          normalizedScope,
      });

    domainEvidenceMap[rule.key] = {
      domain: rule.key,
      scope: normalizedScope,
      confidence: portrait.confidence,
      evidenceFactIds:
        portrait.evidenceFactIds,
      compositionImageIds:
        portrait.compositionImageIds,
      compositionRuleIds:
        portrait.compositionRuleIds,
      evidence: portrait.evidence,
      facts: selected.facts.map(
        compactFactReference,
      ),
      compositions:
        selected.images.map(
          compactImageReference,
        ),
      warnings: portrait.warnings,
    };

    twelveDomains.push(portrait);
  }

  return {
    domainEvidence: {
      engineVersion:
        CONTRACT_DOMAIN_ENGINE_VERSION,

      scope:
        normalizedScope,

      structureSynopsis,

      signals: [],
      atomicFacts,
      featureVector,
      domainEvidence:
        domainEvidenceMap,
    },
    twelveDomains,
  };
}

function selectDomainEvidence({
  rule,
  facts,
  images,
  hitRows,
}) {
  const imageIdsFromRows = new Set(
    hitRows
      .filter((row) =>
        includesDomain(row, rule.key),
      )
      .map((row) =>
        normalizeText(row.id),
      )
      .filter(Boolean),
  );
  const domainImages = images
    .filter((image) =>
      includesDomain(image, rule.key) ||
      imageIdsFromRows.has(
        normalizeText(image.id),
      ),
    )
    .sort(compareImages);
  const domainFacts = facts
    .filter((fact) =>
      factMatchesDomain(fact, rule),
    )
    .sort(compareFacts)
    .slice(0, 8);

  return {
    images: dedupeById(domainImages),
    facts: dedupeById(domainFacts),
  };
}

function buildDomainPortrait({
  rule,
  selected,
  structureSynopsis = {},
  scope,
}) {
  const images =
    selected.images;

  const facts =
    selected.facts;

  const primaryImage =
    images[0] ?? null;

  const tensionImage =
    images.find(
      (image) =>
        image.role ===
          "tension",
    ) ?? null;

  const primaryFact =
    facts[0] ?? null;

  const evidenceFactIds =
    uniqueSortedStrings([
      ...facts.map(
        (fact) =>
          fact.id,
      ),

      ...images.flatMap(
        (image) =>
          image.matchedFactIds ??
          [],
      ),
    ]);

  const compositionImageIds =
    uniqueSortedStrings(
      images.map(
        (image) =>
          image.id,
      ),
    );

  const compositionRuleIds =
    uniqueSortedStrings(
      images.map(
        (image) =>
          image.ruleId,
      ),
    );

  const warnings = [];

  const narrative =
    composeDomainNarrative({
      domainKey:
        rule.key,

      images,

      facts,

      structureSynopsis,
    });

  warnings.push(
    ...(
      Array.isArray(
        narrative.warnings,
      )
        ? narrative.warnings
        : []
    ),
  );

  const title =
    rule.label;

  const summary =
    narrative.overview ||
    rule.weakEvidenceText;

  const judgement =
    narrative.overview ||
    rule.defaultJudgement;

  const manifestation =
    narrative.manifestation ||
    rule.weakEvidenceText ||
    rule.defaultJudgement ||
    summary ||
    "";

  const strength =
    narrative.strength ||
    "";

  const pressure =
    narrative.caution ||
    (
      tensionImage
        ? cleanSentence(
            tensionImage.brief,
          )
        : ""
    );

  const keywords =
    uniqueSortedStrings([
      ...images.flatMap(
        (image) =>
          image.tags ?? [],
      ),

      ...facts.flatMap(
        (fact) =>
          fact.tags ?? [],
      ),

      ...rule.primarySignals,
    ]).slice(0, 6);

  const confidence =
    calculateDomainConfidence(
      images,
      facts,
    );

  const evidence =
    uniqueSortedStrings([
      ...images.map(
        (image) =>
          image.brief,
      ),

      ...facts.map(
        factLabel,
      ),
    ]).slice(0, 10);

  if (
    !evidenceFactIds.length &&
    !compositionImageIds.length
  ) {
    warnings.push(
      "domain has fallback text without direct evidence",
    );
  }

  return {
    key:
      rule.key,

    label:
      rule.label,

    title,

    narrativeVersion:
      DOMAIN_NARRATIVE_COMPOSER_VERSION,

    structureBasis:
      narrative
        .structureBaseline ||
      normalizeText(
        structureSynopsis
          .domainBaselines
          ?.[rule.key],
      ),

    summary:
      cleanFrontText(
        limitSentences(
          summary,
          2,
        ),
      ),

    judgement:
      cleanFrontText(
        limitSentences(
          judgement,
          2,
        ),
      ),

    manifestation:
      cleanFrontText(
        limitSentences(
          resolveFrontManifestation({
            domainKey:
              rule.key,
            judgement,
            manifestation,
          }),
          2,
        ),
      ),

    strength,

    pressure,

    isConditionalNarrative:
      Boolean(
        narrative
          .isConditionalNarrative,
      ),

    hasCompositionNarrative:
      narrative
        .hasCompositionNarrative,

    narrativeSourceRuleIds:
      narrative.sourceRuleIds,

    narrativeSourceImageIds:
      narrative.sourceImageIds,

    keywords,

    tags:
      keywords,

    evidence,

    evidenceFactIds,

    compositionImageIds,

    compositionRuleIds,

    primaryFact:
      primaryImage
        ? compactImageReference(
            primaryImage,
          )
        : primaryFact
          ? compactFactReference(
              primaryFact,
            )
          : null,

    secondaryFacts: [
      ...images
        .slice(1, 3)
        .map(
          compactImageReference,
        ),

      ...facts
        .slice(1, 3)
        .map(
          compactFactReference,
        ),
    ],

    tensionFact:
      tensionImage
        ? compactImageReference(
            tensionImage,
          )
        : null,

    matchedFactIds:
      evidenceFactIds,

    matchedCombinations:
      images.map(
        (image) => ({
          id:
            image.id,

          ruleId:
            image.ruleId,

          label:
            image.title,

          manifestation:
            image.brief,

          keywords:
            image.tags ?? [],
        }),
      ),

    condition:
      uniqueSortedStrings(
        images.flatMap(
          (image) =>
            image.reasoning ?? [],
        ),
      ).slice(0, 8),

    bookExplanation:
      rule.defaultJudgement,

    counterEvidence:
      uniqueSortedStrings(
        images.flatMap(
          (image) =>
            image.counterFactIds ??
            [],
        ),
      ).length
        ? [
            "该领域存在反证事实，需回到证据链复核轻重。",
          ]
        : [
            "本维度只作出生原局画像，具体事件仍需结合现实背景和时间层证据。",
          ],

    confidence,

    score:
      confidence === "high"
        ? 82
        : confidence === "medium"
          ? 62
          : 32,

    evidenceLevel:
      confidence === "high"
        ? "strong"
        : confidence === "medium"
          ? "medium"
          : "weak",

    scope,

    warnings:
      uniqueSortedStrings(
        warnings,
      ),
  };
}

function factMatchesDomain(fact, rule) {
  if (
    !fact ||
    typeof fact !== "object"
  ) {
    return false;
  }

  /*
   * 第一优先级：
   * 事实自己已经声明 domains / supports，
   * 就严格按照声明路由，不能再用关键词塞进其他领域。
   */
  if (hasExplicitDomainMetadata(fact)) {
    return includesDomain(
      fact,
      rule.key,
    );
  }

  /*
   * 第二优先级：
   * 没有领域声明的旧合同事实，
   * 只允许匹配少量直接字段。
   *
   * 禁止再扫描：
   * - 整个 value JSON
   * - tags
   * - sourceRefs
   *
   * 否则 children、father、wealth 等单词
   * 会把一个事实错误复制进多个领域。
   */
  const keywords =
    domainFactMap[rule.key] ?? [];

  const tokens =
    extractDirectFactTokens(fact);

  return keywords.some((keyword) =>
    tokens.some((token) =>
      token === keyword,
    ),
  );
}

function hasExplicitDomainMetadata(
  fact = {},
) {
  return (
    (
      Array.isArray(fact.domains) &&
      fact.domains.length > 0
    ) ||
    (
      Array.isArray(fact.supports) &&
      fact.supports.length > 0
    )
  );
}

function extractDirectFactTokens(
  fact = {},
) {
  const value =
    fact.value &&
    typeof fact.value === "object"
      ? fact.value
      : {};

  return uniqueSortedStrings([
    fact.category,
    fact.predicate,

    fact.subject?.type,
    fact.subject?.key,
    fact.subject?.label,

    typeof fact.value === "string"
      ? fact.value
      : "",

    value.tenGod,
    value.name,
    value.element,
    value.branch,
    value.stem,
    value.relationType,
    value.kinship,
    value.palace,
    value.position,
  ]);
}

function includesDomain(item, domainKey) {
  return [
    ...(Array.isArray(item?.domains)
      ? item.domains
      : []),
    ...(Array.isArray(item?.supports)
      ? item.supports
      : []),
  ]
    .map(normalizeText)
    .includes(domainKey);
}

function compareImages(left, right) {
  return (
    roleRank(right.role) -
      roleRank(left.role) ||
    Number(right.priority ?? 0) -
      Number(left.priority ?? 0) ||
    normalizeText(left.ruleId)
      .localeCompare(
        normalizeText(right.ruleId),
      )
  );
}

function compareFacts(left, right) {
  return (
    confidenceRank(right.confidence) -
      confidenceRank(left.confidence) ||
    normalizeText(left.category)
      .localeCompare(
        normalizeText(right.category),
      ) ||
    normalizeText(left.id)
      .localeCompare(
        normalizeText(right.id),
      )
  );
}

function roleRank(role) {
  return roleOrder[normalizeText(role)] ?? 0;
}

function confidenceRank(confidence) {
  return (
    confidenceOrder[
      normalizeText(confidence)
    ] ?? 0
  );
}

function calculateDomainConfidence(images, facts) {
  if (
    images.some((image) =>
      image.confidence === "high" ||
      image.importance === "high",
    )
  ) {
    return "high";
  }

  if (images.length || facts.length >= 3) {
    return "medium";
  }

  return "low";
}

function buildManifestation(rule, image) {
  const brief =
    typeof image === "string"
      ? image
      : cleanFrontText(image.brief);
  const focus =
    domainFocusText[rule.key] ||
    `${rule.label}的选择、关系和承接方式`;

  if (rule.key === "self") {
    return `现实中主要落在${focus}上：${brief}。`;
  }

  if (rule.key === "health") {
    return `现实中只作体质和结构倾向观察：${brief}。`;
  }

  return `现实中主要落在${focus}上：${brief}。`;
}

function buildDomainJudgement(rule, brief) {
  const focus =
    domainFocusText[rule.key];

  if (rule.key === "self") {
    return `${brief}，会影响${focus}。`;
  }

  if (focus) {
    return `${brief}，会影响${focus}。`;
  }

  return `${brief}。`;
}

function buildWeakManifestation(rule) {
  return (
    rule.weakEvidenceText ||
    `${rule.label}在原局中不是最明显的主线，现实反馈和时间层证据决定显化程度。`
  );
}

function factLabel(fact) {
  const category =
    normalizeText(fact?.category);
  const predicate =
    normalizeText(fact?.predicate);
  const value =
    fact?.value ?? {};

  if (category === "ten_god") {
    const tenGod =
      normalizeText(value.tenGod) ||
      normalizeText(value.name);

    if (tenGod) {
      return `${tenGod}在原局有落点`;
    }
  }

  if (category === "day_master") {
    return "日主承载与根气状态";
  }

  if (category === "pillar") {
    const subject =
      pillarLabel(
        fact?.subject?.key,
      ) ||
      normalizeText(
        fact?.subject?.label,
      );
    const stem =
      normalizeText(value.stem) ||
      normalizeText(value.branch) ||
      normalizeText(value.tenGod) ||
      normalizeText(value.value);

    return [
      subject,
      stem,
      "柱位信息",
    ].filter(Boolean).join(" ");
  }

  if (category === "relation") {
    const relationType =
      normalizeText(
        value.relationType,
      ) ||
      normalizeText(value.type);

    return relationType
      ? `干支${relationType}关系`
      : "干支关系牵动";
  }

  if (category === "element") {
    if (
      predicate === "element_count"
    ) {
      const element =
        normalizeText(
          value.element,
        );

      return element
        ? `${element}五行有落点`
        : "五行数量分布";
    }

    return "五行分布与调候线索";
  }

  if (category === "climate") {
    return "调候气候线索";
  }

  if (
    category === "palace" ||
    category === "kinship"
  ) {
    return "宫位与亲缘辅助事实";
  }

  if (
    category === "work_node" ||
    category === "work_edge" ||
    category === "work_chain" ||
    category === "conflict"
  ) {
    return "做工链候选事实";
  }

  const subject =
    normalizeText(fact?.subject?.label) ||
    normalizeText(fact?.subject?.key);
  const summarizedValue =
    summarizeValue(value);

  return [
    subject,
    friendlyPredicate(predicate),
    summarizedValue,
  ].filter(Boolean).join(" ");
}

function friendlyPredicate(predicate) {
  return {
    ten_god_presence:
      "十神落点",
    pillar_stem:
      "天干",
    pillar_branch:
      "地支",
    pillar_branch_main_ten_god:
      "地支主气十神",
    has_relation:
      "干支关系",
    growth_stage:
      "十二长生状态",
    void_state:
      "空亡状态",
  }[predicate] ?? "";
}

function pillarLabel(key) {
  return {
    year: "年柱",
    month: "月柱",
    day: "日柱",
    hour: "时柱",
  }[normalizeText(key)] ?? "";
}

function summarizeValue(value) {
  if (typeof value === "string") {
    return value;
  }

  if (
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value
      .map(summarizeValue)
      .filter(Boolean)
      .join("、");
  }

  if (
    value &&
    typeof value === "object"
  ) {
    return Object.entries(value)
      .filter(([, item]) =>
        item !== undefined &&
        item !== null &&
        item !== "",
      )
      .slice(0, 4)
      .map(([key, item]) =>
        `${key}:${summarizeValue(item)}`,
      )
      .join("，");
  }

  return "";
}

function compactFactReference(fact) {
  return {
    id: normalizeText(fact.id),
    category: normalizeText(fact.category),
    predicate: normalizeText(fact.predicate),
    subject: fact.subject ?? null,
    confidence:
      normalizeText(fact.confidence) ||
      "unknown",
  };
}

function compactImageReference(image) {
  return {
    id: normalizeText(image.id),
    ruleId: normalizeText(image.ruleId),
    title: normalizeText(image.title),
    role: normalizeText(image.role),
    status: normalizeText(image.status),
  };
}

function dedupeById(items) {
  const seen = new Map();

  for (const item of items) {
    const id = normalizeText(item?.id);

    if (id && !seen.has(id)) {
      seen.set(id, item);
    }
  }

  return [...seen.values()];
}

function cleanSentence(text) {
  return String(text ?? "")
    .replace(/\s+/g, " ")
    .replace(/[。；，\s]+$/g, "")
    .trim();
}

function cleanFrontText(text) {
  return cleanSentence(text)
    .replace(
      /，?需要结合全局复核/g,
      "，轻重由全局结构决定",
    )
    .replace(
      /，?需要结合通关和现实应象复核/g,
      "，轻重取决于通关和现实应象",
    )
    .replace(
      /，?需要结合调候和通关条件复核/g,
      "，轻重取决于调候和通关条件",
    )
    .replace(
      /需要结合/g,
      "取决于",
    )
    .replace(
      /需复核|需要复核/g,
      "待验证",
    )
    .replace(/先看/g, "落在")
    .replace(/再看/g, "并看");
}

function limitSentences(
  text,
  limit = 2,
) {
  const normalized =
    normalizeText(text);

  if (!normalized) {
    return "";
  }

  const sentences =
    normalized.match(
      /[^。！？!?]+[。！？!?]?/g,
    ) ?? [
      normalized,
    ];

  return sentences
    .map((sentence) =>
      sentence.trim(),
    )
    .filter(Boolean)
    .slice(0, limit)
    .join("");
}

function resolveFrontManifestation({
  domainKey,
  judgement,
  manifestation,
} = {}) {
  const combined =
    `${judgement} ${manifestation}`;

  if (domainKey === "wealth") {
    const matchedCount =
      [
        "收入方式",
        "资源调度",
        "变现能力",
        "财务承载",
        "财务",
      ].filter((term) =>
        combined.includes(term),
      ).length;

    if (matchedCount >= 2) {
      return manifestation;
    }

    return "现实里要看收入方式、资源调度和财务承载。";
  }

  if (domainKey !== "self") {
    return manifestation;
  }

  const matchedCount =
    [
      "性格",
      "主见",
      "脾气",
      "节奏",
      "边界",
    ].filter((term) =>
      combined.includes(term),
    ).length;

  if (matchedCount >= 3) {
    return manifestation;
  }

  return "现实里容易表现为主见、判断方式、边界感和自己的做事节奏。";
}

function uniqueSortedStrings(items) {
  return [
    ...new Set(
      (Array.isArray(items) ? items : [])
        .map(normalizeText)
        .filter(Boolean),
    ),
  ].sort();
}

function normalizeText(value) {
  return typeof value === "string"
    ? value.trim()
    : "";
}
