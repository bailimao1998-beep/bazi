/**
 * 原局命理总批引擎。
 *
 * 核心原则：
 * 1. 基础事实只作为证据，不能直接成为“命局核心 / 做工主线 / 长期方向”；
 * 2. 总批正文优先使用组合级、格局级和结构级事实；
 * 3. 干支关系、伏吟、自刑等只进入关系或矛盾章节；
 * 4. 同一 semanticGroup 最多进入一个主要章节；
 * 5. 没有合格事实时宁可省略章节，不拿低层事实凑数。
 */

const SUMMARY_CATEGORIES = new Set([
  "组合结构",
  "格局结构",
  "五行结构",
  "调候结构",
  "做工结构",
]);

const RELATION_CATEGORIES = new Set([
  "干支关系",
  "柱位重复",
]);

const BASE_EVIDENCE_CATEGORIES = new Set([
  "日主根气",
  "十神透藏",
  "神煞辅助",
]);

const WORK_TAGS = [
  "官印",
  "杀印",
  "财官印",
  "食伤",
  "财星",
  "项目",
  "变现",
  "专业",
  "资质",
  "岗位",
  "承接",
  "输出",
  "规则",
];

const ABILITY_TAGS = [
  "学习",
  "理解",
  "专业",
  "表达",
  "输出",
  "规则",
  "资质",
  "承接",
  "判断",
  "组织",
  "项目",
  "资源",
];

const DIRECTION_TAGS = [
  "长期",
  "承接",
  "专业",
  "资质",
  "岗位",
  "项目",
  "变现",
  "规则",
  "系统",
  "发展",
];

export function buildNatalMasterSummary({
  featureVector = {},
  atomicFacts = {},
  coreImages = {},
  facts,
  compositionImages,
  hitList,
  twelveDomains,
  scope = "natal",
} = {}) {
  if (
    Array.isArray(compositionImages) ||
    Array.isArray(twelveDomains) ||
    hitList?.all
  ) {
    return buildContractNatalMasterSummary({
      facts:
        Array.isArray(facts)
          ? facts
          : atomicFacts.contractFacts ?? [],
      compositionImages:
        Array.isArray(compositionImages)
          ? compositionImages
          : [],
      hitList,
      twelveDomains:
        Array.isArray(twelveDomains)
          ? twelveDomains
          : [],
      scope,
    });
  }

  const allFacts = uniqueFacts(
    normalizeFacts([
      ...(Array.isArray(atomicFacts.facts)
        ? atomicFacts.facts
        : []),

      ...(coreImages.core ?? []),
      ...(coreImages.support ?? []),
      ...(coreImages.tension ?? []),
      ...(coreImages.conditional ?? []),
    ]).sort(compareFacts),
  );

  const usedGroups = new Set();
  const selectionTrace = [];

  const structure = buildStructureLine(featureVector);

  /*
   * 命局核心：
   * 只允许组合级、格局级、结构级的 core/main 事实。
   */
  const coreFact = takeFact(
    allFacts,
    usedGroups,
    "core",
    isCoreCandidate,
    selectionTrace,
  );

  /*
   * 做工主线：
   * 必须能回答命局靠什么产生现实结果。
   */
  const workFact = takeFact(
    allFacts,
    usedGroups,
    "work",
    isWorkCandidate,
    selectionTrace,
  );

  /*
   * 优势能力：
   * 只允许明确的能力型结构，禁止冲刑合害、伏吟等进入。
   */
  const strengthFacts = takeFacts(
    allFacts,
    usedGroups,
    "strengths",
    isStrengthCandidate,
    2,
    selectionTrace,
  );

  /*
   * 主要矛盾：
   * 允许负向组合、冲刑害破、伏吟、自刑等。
   */
  const tensionFacts = takeFacts(
    allFacts,
    usedGroups,
    "tensions",
    isTensionCandidate,
    2,
    selectionTrace,
  );

  /*
   * 关系模式：
   * 必须影响 spouse 领域，并且必须有完整解释。
   */
  const relationshipFact = takeFact(
    allFacts,
    usedGroups,
    "relationship",
    isRelationshipCandidate,
    selectionTrace,
  );

  /*
   * 事业与财富：
   * 只允许组合级事实，单柱财星、单柱官星只能留作证据。
   */
  const careerFact = takeFact(
    allFacts,
    usedGroups,
    "career",
    (fact) =>
      isCareerWealthCandidate(
        fact,
        "career",
      ),
    selectionTrace,
  );

  const wealthFact = takeFact(
    allFacts,
    usedGroups,
    "wealth",
    (fact) =>
      isCareerWealthCandidate(
        fact,
        "wealth",
      ),
    selectionTrace,
  );

  /*
   * 长期方向：
   * 只能选未被使用的正向结构，禁止自刑、伏吟、冲害破凑数。
   */
  const directionFact = takeFact(
    allFacts,
    usedGroups,
    "direction",
    isDirectionCandidate,
    selectionTrace,
  );

  const core =
    factText(coreFact) ||
    buildCoreFallback(featureVector);

  const workLine =
    factText(workFact) ||
    buildWorkFallback();

  const strengths = uniqueText(
    strengthFacts.map(factText),
  ).slice(0, 2);

  const tensions = uniqueText(
    tensionFacts.map(factText),
  ).slice(0, 2);

  const relationshipLine =
    factText(relationshipFact);

  const careerWealthLine =
    buildCareerWealthLine(
      careerFact,
      wealthFact,
    );

  const lifeDirection =
    factText(directionFact);

  const sections = buildSections({
    core,
    workLine,
    strengths,
    tensions,
    relationshipLine,
    careerWealthLine,
    lifeDirection,
  });

  const selectedFacts = uniqueFacts([
    coreFact,
    workFact,
    ...strengthFacts,
    ...tensionFacts,
    relationshipFact,
    careerFact,
    wealthFact,
    directionFact,
  ].filter(Boolean));

  const conditionalFacts = allFacts
    .filter(
      (fact) =>
        fact.status === "conditional" ||
        fact.role === "condition",
    )
    .filter(
      (fact) =>
        !usedGroups.has(
          semanticKey(fact),
        ),
    )
    .slice(0, 8);

  return {
    title: "命理总批（原局）",

    structure,

    core,

    workLine,

    strengths,

    tensions,

    relationshipLine,

    careerWealthLine,

    lifeDirection,

    conclusion: buildConclusion({
      featureVector,
      selectedFacts,
      tensions,
      relationshipLine,
    }),

    sections,

    evidenceFactIds:
      selectedFacts.map(
        (fact) => fact.id,
      ),

    conditionalFactIds:
      conditionalFacts.map(
        (fact) => fact.id,
      ),

    selectedFacts:
      selectedFacts.map(
        compactFactReference,
      ),

    selectionDebug:
      buildSelectionDebug(
        allFacts,
        selectedFacts,
        selectionTrace,
      ),

    confidence:
      calculateSummaryConfidence(
        selectedFacts,
      ),

    boundary:
      "本总批只使用出生原局中已经成立的结构事实，不包含大运、流年、流月和现实事件判断。",
  };
}

function isCoreCandidate(fact) {
  return (
    isSummaryStructure(fact) &&
    ["core", "main"].includes(
      fact.role,
    ) &&
    fact.status !== "weak" &&
    fact.polarity !== "negative" &&
    Number(fact.score ?? 0) >= 72 &&
    hasMeaningfulText(fact)
  );
}

function isWorkCandidate(fact) {
  return (
    isSummaryStructure(fact) &&
    hasAnyDomain(fact, [
      "career",
      "wealth",
      "children",
    ]) &&
    [
      "core",
      "main",
      "support",
      "resource",
    ].includes(fact.role) &&
    fact.status === "confirmed" &&
    fact.polarity !== "negative" &&
    Number(fact.score ?? 0) >= 68 &&
    hasAnyTagOrText(
      fact,
      WORK_TAGS,
    ) &&
    hasMeaningfulText(fact)
  );
}

function isStrengthCandidate(fact) {
  return (
    isSummaryStructure(fact) &&
    hasAnyDomain(fact, [
      "self",
      "career",
      "fortune",
      "parents",
      "children",
    ]) &&
    [
      "main",
      "support",
      "resource",
      "base",
    ].includes(fact.role) &&
    fact.status === "confirmed" &&
    fact.polarity !== "negative" &&
    Number(fact.score ?? 0) >= 62 &&
    hasAnyTagOrText(
      fact,
      ABILITY_TAGS,
    ) &&
    !hasRelationshipPressureSignal(
      fact,
    ) &&
    hasMeaningfulText(fact)
  );
}

function isTensionCandidate(fact) {
  return (
    (
      fact.role === "tension" ||
      fact.polarity === "negative" ||
      RELATION_CATEGORIES.has(
        normalizeCategory(
          fact.category,
        ),
      )
    ) &&
    fact.status !== "weak" &&
    Number(fact.score ?? 0) >= 60 &&
    hasMeaningfulText(fact)
  );
}

function isRelationshipCandidate(fact) {
  return (
    hasAnyDomain(fact, [
      "spouse",
    ]) &&
    fact.status !== "weak" &&
    Number(fact.score ?? 0) >= 62 &&
    (
      isSummaryStructure(fact) ||
      RELATION_CATEGORIES.has(
        normalizeCategory(
          fact.category,
        ),
      )
    ) &&
    hasMeaningfulText(fact) &&
    !isNameOnlyFact(fact)
  );
}

function isCareerWealthCandidate(
  fact,
  domain,
) {
  return (
    isSummaryStructure(fact) &&
    hasAnyDomain(fact, [
      domain,
    ]) &&
    [
      "core",
      "main",
      "support",
      "tension",
    ].includes(fact.role) &&
    fact.status !== "weak" &&
    Number(fact.score ?? 0) >= 64 &&
    hasMeaningfulText(fact)
  );
}

function isDirectionCandidate(fact) {
  return (
    isSummaryStructure(fact) &&
    hasAnyDomain(fact, [
      "fortune",
      "career",
      "wealth",
      "self",
    ]) &&
    [
      "core",
      "main",
      "support",
    ].includes(fact.role) &&
    fact.status === "confirmed" &&
    fact.polarity !== "negative" &&
    Number(fact.score ?? 0) >= 66 &&
    hasAnyTagOrText(
      fact,
      DIRECTION_TAGS,
    ) &&
    !hasRelationshipPressureSignal(
      fact,
    ) &&
    hasMeaningfulText(fact)
  );
}

function isSummaryStructure(fact) {
  const category =
    normalizeCategory(
      fact.category,
    );

  return (
    SUMMARY_CATEGORIES.has(
      category,
    ) &&
    !isBaseEvidenceFact(fact)
  );
}

function isBaseEvidenceFact(fact) {
  const category =
    normalizeCategory(
      fact.category,
    );

  if (
    BASE_EVIDENCE_CATEGORIES.has(
      category,
    )
  ) {
    return true;
  }

  const id =
    String(fact.id ?? "");

  return (
    /(?:^|_)(visible|hidden|main_qi|stem|branch|pillar|position)(?:_|$)/.test(
      id,
    ) ||
    /^(day_master_profile|month_pillar_environment|hour_pillar_result)$/.test(
      id,
    )
  );
}

function hasRelationshipPressureSignal(
  fact,
) {
  const text =
    factSearchText(fact);

  return /夫妻宫|日支|冲|刑|害|穿|破|伏吟|自刑|关系摩擦|牵绊/.test(
    text,
  );
}

function hasMeaningfulText(fact) {
  const text =
    factText(fact);

  if (text.length < 10) {
    return false;
  }

  if (isNameOnlyFact(fact)) {
    return false;
  }

  return true;
}

function isNameOnlyFact(fact) {
  const text =
    cleanSentence(
      factText(fact),
    );

  const name =
    cleanSentence(
      fact.name ||
      fact.label ||
      "",
    );

  return (
    !text ||
    text === name ||
    /^(破象|合象|冲象|刑象|害象|自刑|伏吟)$/.test(
      text,
    )
  );
}

function hasAnyDomain(
  fact,
  domains,
) {
  return domains.some(
    (domain) =>
      (fact.domains ?? [])
        .includes(domain),
  );
}

function hasAnyTagOrText(
  fact,
  keywords,
) {
  const text =
    factSearchText(fact);

  return keywords.some(
    (keyword) =>
      text.includes(keyword),
  );
}

function factSearchText(fact) {
  return [
    fact.name,
    fact.brief,
    fact.meaning,
    ...(fact.tags ?? []),
    fact.semanticGroup,
  ]
    .filter(Boolean)
    .join(" ");
}

function takeFact(
  facts,
  usedGroups,
  chapter,
  predicate,
  trace,
) {
  const fact = facts.find(
    (item) =>
      !usedGroups.has(
        semanticKey(item),
      ) &&
      predicate(item),
  );

  if (fact) {
    usedGroups.add(
      semanticKey(fact),
    );

    trace.push({
      chapter,
      factId: fact.id,
      semanticGroup:
        semanticKey(fact),
    });
  }

  return fact ?? null;
}

function takeFacts(
  facts,
  usedGroups,
  chapter,
  predicate,
  limit,
  trace,
) {
  const result = [];

  for (const fact of facts) {
    if (
      result.length >= limit
    ) {
      break;
    }

    const key =
      semanticKey(fact);

    if (
      usedGroups.has(key) ||
      !predicate(fact)
    ) {
      continue;
    }

    usedGroups.add(key);
    result.push(fact);

    trace.push({
      chapter,
      factId: fact.id,
      semanticGroup: key,
    });
  }

  return result;
}

function buildSections({
  core,
  workLine,
  strengths,
  tensions,
  relationshipLine,
  careerWealthLine,
  lifeDirection,
}) {
  const sections = [
    {
      key: "core",
      label: "命局核心",
      text: core,
    },
    {
      key: "work",
      label: "做工主线",
      text: workLine,
    },
  ];

  if (strengths.length) {
    sections.push({
      key: "strengths",
      label: "优势能力",
      items: strengths,
    });
  }

  if (tensions.length) {
    sections.push({
      key: "tensions",
      label: "主要矛盾",
      items: tensions,
    });
  }

  if (relationshipLine) {
    sections.push({
      key: "relationship",
      label: "关系模式",
      text: relationshipLine,
    });
  }

  if (careerWealthLine) {
    sections.push({
      key: "careerWealth",
      label: "事业财富",
      text: careerWealthLine,
    });
  }

  if (lifeDirection) {
    sections.push({
      key: "direction",
      label: "长期方向",
      text: lifeDirection,
    });
  }

  return sections;
}

function buildCareerWealthLine(
  careerFact,
  wealthFact,
) {
  const careerText =
    factText(careerFact);

  const wealthText =
    factText(wealthFact);

  if (
    careerText &&
    wealthText &&
    !textSimilar(
      careerText,
      wealthText,
    )
  ) {
    return `${careerText}；${wealthText}`;
  }

  return (
    careerText ||
    wealthText ||
    ""
  );
}

function buildCoreFallback(
  featureVector,
) {
  const dayMaster =
    featureVector.dayMaster ?? {};

  const strength =
    dayMaster.strengthLevel ||
    "待复核";

  return `原局暂未命中足够明确的组合级主线，目前只能确定日主承载状态为${strength}，需继续结合十神组合和干支做工判断。`;
}

function buildWorkFallback() {
  return "当前原局尚未命中合格的做工组合，暂不能仅凭单柱十神或伏吟关系确定人生做工主线。";
}

function buildConclusion({
  featureVector,
  selectedFacts,
  tensions,
  relationshipLine,
}) {
  const tags = new Set(
    selectedFacts.flatMap(
      (fact) =>
        fact.tags ?? [],
    ),
  );

  const lines = [];

  if (
    [...tags].some(
      (tag) =>
        /官印|杀印|资质|专业|规则|承接/.test(
          tag,
        ),
    )
  ) {
    lines.push(
      "总体更适合走规则清晰、专业能力能够长期沉淀的现实路径",
    );
  } else if (
    [...tags].some(
      (tag) =>
        /食伤|输出|项目|变现|财星/.test(
          tag,
        ),
    )
  ) {
    lines.push(
      "总体更适合把技能、表达或项目成果持续转化为现实收益",
    );
  } else {
    lines.push(
      "总体发展应以可验证、可积累、可持续的现实路径为主",
    );
  }

  if (tensions.length) {
    lines.push(
      "需要避免固定模式、关系摩擦或资源分配问题形成反复消耗",
    );
  }

  if (relationshipLine) {
    lines.push(
      "关系中应把沟通边界和现实责任说清楚",
    );
  }

  const strength =
    featureVector.dayMaster
      ?.strengthLevel;

  if (
    strength === "weak" ||
    strength === "偏弱"
  ) {
    lines.push(
      "重大责任和资源扩张应与自身承载能力匹配",
    );
  }

  return joinSentences(
    uniqueText(lines),
  );
}

function buildStructureLine(
  featureVector,
) {
  const dayMaster =
    featureVector.dayMaster ?? {};

  const monthCommand =
    featureVector.structure
      ?.monthCommand ?? {};

  const parts = [
    dayMaster.label ||
      dayMaster.stem ||
      "日主",

    monthCommand.branch
      ? `生于${monthCommand.branch}月`
      : "",

    dayMaster.inSeason
      ? "得令"
      : monthCommand.branch
        ? "未直接得令"
        : "",

    dayMaster.rootLevel
      ? `根气为${dayMaster.rootLevel}`
      : "",

    dayMaster.strengthLevel
      ? `强弱初判为${dayMaster.strengthLevel}`
      : "",
  ].filter(Boolean);

  return `${parts.join("，")}。`;
}

function normalizeFacts(facts) {
  return facts
    .filter(Boolean)
    .map((fact) => ({
      ...fact,

      name:
        fact.name ||
        fact.label ||
        fact.id ||
        "",

      brief:
        fact.brief ||
        fact.meaning ||
        "",

      meaning:
        fact.meaning ||
        fact.brief ||
        "",

      role:
        fact.role ||
        "support",

      status:
        fact.status ||
        "confirmed",

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

      domains:
        normalizeArray(
          fact.domains,
        ),

      tags:
        normalizeArray(
          fact.tags,
        ),

      semanticGroup:
        fact.semanticGroup ||
        fact.id,

      category:
        normalizeCategory(
          fact.category,
        ),
    }))
    .filter(
      (fact) =>
        fact.id &&
        fact.name,
    );
}

function normalizeCategory(
  category = "",
) {
  if (
    /日主根气|十神透藏|组合结构|格局结构|五行结构|调候结构|做工结构|干支关系|柱位重复|神煞辅助/.test(
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
    element: "五行结构",
    shensha: "神煞辅助",
  }[category] ?? "结构象";
}

function compareFacts(
  left,
  right,
) {
  return (
    roleRank(right.role) -
      roleRank(left.role) ||

    Number(
      right.priority ?? 0,
    ) -
      Number(
        left.priority ?? 0,
      ) ||

    Number(
      right.score ?? 0,
    ) -
      Number(
        left.score ?? 0,
      ) ||

    confidenceRank(
      right.confidence,
    ) -
      confidenceRank(
        left.confidence,
      )
  );
}

function uniqueFacts(facts) {
  const result = [];
  const seen = new Set();

  for (const fact of facts) {
    if (!fact) continue;

    const key =
      semanticKey(fact);

    if (
      !key ||
      seen.has(key)
    ) {
      continue;
    }

    seen.add(key);
    result.push(fact);
  }

  return result;
}

function semanticKey(fact) {
  return (
    fact?.semanticGroup ||
    fact?.id ||
    ""
  );
}

function factText(fact) {
  if (!fact) return "";

  return cleanSentence(
    fact.brief ||
    fact.meaning ||
    "",
  );
}

function compactFactReference(fact) {
  return {
    id: fact.id,
    name: fact.name,
    category:
      fact.category,
    semanticGroup:
      semanticKey(fact),
    role: fact.role,
    score: fact.score,
    domains:
      fact.domains ?? [],
  };
}

function buildSelectionDebug(
  allFacts,
  selectedFacts,
  trace,
) {
  const selectedIds =
    new Set(
      selectedFacts.map(
        (fact) => fact.id,
      ),
    );

  return {
    selected: trace,

    rejectedBaseEvidence:
      allFacts
        .filter(
          isBaseEvidenceFact,
        )
        .map(
          (fact) => fact.id,
        ),

    rejectedShortText:
      allFacts
        .filter(
          (fact) =>
            !hasMeaningfulText(fact),
        )
        .map(
          (fact) => fact.id,
        ),

    unusedStructuralFacts:
      allFacts
        .filter(
          isSummaryStructure,
        )
        .filter(
          (fact) =>
            !selectedIds.has(
              fact.id,
            ),
        )
        .map(
          (fact) => fact.id,
        ),
  };
}

function calculateSummaryConfidence(
  selectedFacts,
) {
  if (!selectedFacts.length) {
    return "low";
  }

  const highCount =
    selectedFacts.filter(
      (fact) =>
        fact.confidence === "high",
    ).length;

  const average =
    selectedFacts.reduce(
      (sum, fact) =>
        sum +
        Number(
          fact.score ?? 0,
        ),
      0,
    ) /
    selectedFacts.length;

  if (
    highCount >= 2 &&
    average >= 72
  ) {
    return "high";
  }

  if (average >= 58) {
    return "medium";
  }

  return "low";
}

function textSimilar(
  left,
  right,
) {
  const leftTokens =
    tokenize(left);

  const rightTokens =
    tokenize(right);

  if (
    !leftTokens.length ||
    !rightTokens.length
  ) {
    return false;
  }

  const rightSet =
    new Set(rightTokens);

  const overlap =
    leftTokens.filter(
      (token) =>
        rightSet.has(token),
    ).length;

  const base =
    Math.min(
      leftTokens.length,
      rightTokens.length,
    );

  return (
    base > 0 &&
    overlap / base >= 0.6
  );
}

function tokenize(text) {
  return String(text ?? "")
    .replace(
      /[，。；：、！？\s]/g,
      "",
    )
    .split("")
    .filter(Boolean);
}

function buildContractNatalMasterSummary({
  facts = [],
  compositionImages = [],
  hitList = {},
  twelveDomains = [],
  scope = "natal",
} = {}) {
  const normalizedScope =
    cleanSentence(scope) || "natal";
  const images = uniqueFacts(
    (Array.isArray(compositionImages)
      ? compositionImages
      : [])
      .filter(Boolean)
      .sort(compareContractImages),
  );
  const domains = Array.isArray(twelveDomains)
    ? twelveDomains
    : [];
  const coreImages =
    images.filter((image) =>
      image.role === "core",
    );
  const supportImages =
    images.filter((image) =>
      image.role === "support",
    );
  const tensionImages =
    images.filter((image) =>
      image.role === "tension",
    );
  const conditionalImages =
    images.filter((image) =>
      image.role === "conditional" ||
      image.status === "conditional",
    );
  const coreStructure =
    summarizeImages(
      coreImages,
      "原局核心结构尚未形成特别突出的高阶组合，先以十二领域中的基础事实复核。",
    );
  const strengths =
    uniqueText([
      ...coreImages.map(imageBrief),
      ...supportImages.map(imageBrief),
    ]).slice(0, 4);
  const tensions =
    uniqueText(
      tensionImages.map(imageBrief),
    ).slice(0, 4);
  const conditions =
    uniqueText(
      conditionalImages.map(imageBrief),
    ).slice(0, 4);
  const careerWealthLine =
    summarizeDomainGroup(domains, [
      "career",
      "wealth",
    ]);
  const workLine =
    summarizeImages(
      [
        ...coreImages,
        ...supportImages,
      ],
      careerWealthLine ||
        "当前原局以合同组合象作为做工线索，仍需结合现实职责、资源承接和时间层触发复核。",
    );
  const relationshipLine =
    summarizeDomainGroup(domains, [
      "spouse",
      "friends",
    ]);
  const healthLine =
    summarizeDomainGroup(domains, [
      "health",
    ]);
  const familyLine =
    summarizeDomainGroup(domains, [
      "parents",
      "siblings",
      "children",
    ]);
  const lifePatternLine =
    summarizeDomainGroup(domains, [
      "self",
      "fortune",
      "movement",
    ]);
  const evidenceFactIds =
    uniqueText([
      ...images.flatMap((image) =>
        image.matchedFactIds ?? [],
      ),
      ...domains.flatMap((domain) =>
        domain.evidenceFactIds ?? [],
      ),
    ]);
  const compositionImageIds =
    uniqueText([
      ...images.map((image) => image.id),
      ...domains.flatMap((domain) =>
        domain.compositionImageIds ?? [],
      ),
    ]);
  const domainKeys = uniqueText(
    domains.map((domain) => domain.key),
  );
  const sections = buildContractSections({
    coreStructure,
    workLine,
    strengths,
    tensions,
    conditions,
    careerWealthLine,
    relationshipLine,
    healthLine,
    familyLine,
    lifePatternLine,
  });
  const conclusion =
    buildContractConclusion({
      coreStructure,
      strengths,
      tensions,
      conditions,
    });

  return {
    version:
      "contract-master-summary-v1",
    scope: normalizedScope,
    title: "命理总批（原局）",
    conclusion,
    coreStructure,
    workLine,
    strengths,
    tensions,
    conditions,
    careerWealthLine,
    relationshipLine,
    healthLine,
    familyLine,
    lifePatternLine,
    evidenceFactIds,
    compositionImageIds,
    domainKeys,
    confidence:
      calculateContractSummaryConfidence(
        images,
        domains,
      ),
    boundary:
      "本报告只分析出生原局，不包含大运、流年、流月的具体事件触发。",
    warnings: [],

    structure: coreStructure,
    core: coreStructure,
    workLine,
    lifeDirection: lifePatternLine,
    sections,
    conditionalFactIds:
      uniqueText(
        conditionalImages.flatMap((image) =>
          image.matchedFactIds ?? [],
        ),
      ),
    selectedFacts:
      images.map((image) => ({
        id: image.id,
        name: image.title,
        brief: image.brief,
        role: image.role,
        status: image.status,
        domains: image.domains ?? [],
      })),
    selectionDebug: {
      source:
        "contract_composition_and_domains",
      hitListCount:
        Array.isArray(hitList?.all)
          ? hitList.all.length
          : 0,
      imageCount: images.length,
      domainCount: domains.length,
    },
  };
}

function buildContractSections({
  coreStructure,
  workLine,
  strengths,
  tensions,
  conditions,
  careerWealthLine,
  relationshipLine,
  healthLine,
  familyLine,
  lifePatternLine,
}) {
  const sections = [];
  const usedTexts = [];

  const canUseText = (text) => {
    const normalized =
      cleanSentence(text);

    if (!normalized) {
      return false;
    }

    return !usedTexts.some(
      (usedText) =>
        textSimilar(
          usedText,
          normalized,
        ),
    );
  };

  const addTextSection = (
    key,
    label,
    text,
  ) => {
    const normalized =
      cleanSentence(text);

    if (!canUseText(normalized)) {
      return;
    }

    usedTexts.push(normalized);

    sections.push({
      key,
      label,
      text: normalized,
    });
  };

  const addItemSection = (
    key,
    label,
    items,
  ) => {
    const availableItems =
      uniqueText(items)
        .filter(canUseText)
        .slice(0, 2);

    if (!availableItems.length) {
      return;
    }

    usedTexts.push(
      ...availableItems,
    );

    sections.push({
      key,
      label,
      items: availableItems,
    });
  };

  addTextSection(
    "core",
    "命局核心",
    coreStructure,
  );

  addTextSection(
    "work",
    "做工主线",
    workLine,
  );

  addTextSection(
    "careerWealth",
    "事业财富",
    careerWealthLine,
  );

  addItemSection(
    "strengths",
    "优势能力",
    strengths,
  );

  addItemSection(
    "tensions",
    "主要矛盾",
    tensions,
  );

  addItemSection(
    "conditions",
    "成立条件",
    conditions,
  );

  addTextSection(
    "relationship",
    "感情关系",
    relationshipLine,
  );

  addTextSection(
    "health",
    "体质状态",
    healthLine,
  );

  addTextSection(
    "family",
    "家庭子女",
    familyLine,
  );

  addTextSection(
    "lifePattern",
    "人生模式",
    lifePatternLine,
  );

  return sections;
}

function summarizeImages(images, fallback) {
  const lines =
    uniqueText(images.map(imageBrief))
      .slice(0, 3);

  return lines.length
    ? lines.join("；")
    : fallback;
}

function summarizeDomainGroup(domains, keys) {
  return uniqueText(
    domains
      .filter((domain) =>
        keys.includes(domain.key),
      )
      .map((domain) =>
        domain.summary ||
        domain.judgement ||
        domain.title,
      ),
  ).slice(0, 3).join("；");
}

function imageBrief(image = {}) {
  return cleanSentence(
    image.brief ||
    image.title,
  );
}

function compareContractImages(left, right) {
  return (
    roleRank(right.role) -
      roleRank(left.role) ||
    Number(right.priority ?? 0) -
      Number(left.priority ?? 0) ||
    cleanSentence(left.ruleId)
      .localeCompare(
        cleanSentence(right.ruleId),
      )
  );
}

function buildContractConclusion({
  coreStructure,
  strengths,
  tensions,
  conditions,
}) {
  const lines = [];

  if (
    coreStructure &&
    !coreStructure.includes(
      "尚未形成特别突出",
    )
  ) {
    lines.push(
      coreStructure,
    );
  }

  if (strengths[0]) {
    lines.push(
      `原局可用的支持点是：${strengths[0]}`,
    );
  }

  if (tensions[0]) {
    lines.push(
      `主要需要留意的张力是：${tensions[0]}`,
    );
  }

  if (conditions[0]) {
    lines.push(
      `另有条件性线索：${conditions[0]}，具体轻重需要结合现实反馈。`,
    );
  }

  if (!lines.length) {
    lines.push(
      "当前原局以基础事实为主，高阶组合不算突出，宜结合现实反馈继续复核。",
    );
  }

  return joinSentences(
    lines.slice(0, 3),
  );
}

function calculateContractSummaryConfidence(
  images,
  domains,
) {
  if (
    images.some((image) =>
      image.confidence === "high" ||
      image.importance === "high",
    )
  ) {
    return "high";
  }

  if (
    images.length >= 2 ||
    domains.some((domain) =>
      domain.confidence === "medium" ||
      domain.confidence === "high",
    )
  ) {
    return "medium";
  }

  return "low";
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

function confidenceRank(
  confidence,
) {
  return {
    high: 3,
    medium: 2,
    low: 1,
  }[confidence] ?? 0;
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
        .map(
          (item) =>
            cleanSentence(item),
        )
        .filter(Boolean),
    ),
  ];
}

function cleanSentence(text) {
  return String(text ?? "")
    .replace(/\s+/g, " ")
    .replace(
      /[。；，\s]+$/g,
      "",
    )
    .trim();
}

function joinSentences(items) {
  return items
    .filter(Boolean)
    .map(cleanSentence)
    .filter(Boolean)
    .map(
      (item) =>
        /[。！？]$/.test(item)
          ? item
          : `${item}。`,
    )
    .join("");
}
