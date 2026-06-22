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
  structureSynopsis = {},
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
      structureSynopsis,
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

const MASTER_LIFE_PATTERN_BY_RULE = {
  official_resource_support:
    "整体属于越积累越有价值的类型，专业经验、责任信用和判断能力，会随着时间逐渐转化为现实位置。",

  wealth_official_resource_trace:
    "人生发展重点在于把资源、岗位责任和专业能力连接起来，先稳定承接，再逐步扩大范围。",

  day_pillar_repetition:
    "人生中某些课题容易重复出现，真正的成长来自把重复经历沉淀成经验，而不是在同一问题上反复消耗。",

  spouse_palace_relation_tension:
    "关系与现实责任容易成为重要人生课题，边界越明确、沟通越清楚，个人状态越容易稳定。",

  peer_wealth_competition:
    "发展机会常与合作、同辈和人脉有关，但能否走得长久，取决于利益、责任和分工是否清楚。",

  resource_heavy_output_weak:
    "人生优势主要来自学习、理解和积累，后期能否真正打开局面，关键在于把内部能力持续变成外部成果。",

  element_bias_visible:
    "命局优势较集中，适合在匹配自身特点的环境中持续深入，同时要主动补足适应力和结构短板。",

  month_command_official:
    "人生容易围绕责任、岗位、规则和社会角色展开，越能处理好压力与承载的关系，越容易建立稳定位置。",

  output_wealth_chain:
    "人生更适合在持续输出中形成结果，能力只有真正落到作品、服务、产品或项目上，才会转化为现实价值。",

  hurting_officer_resource_balance:
    "人生价值更容易从独立思考、专业知识和解决复杂问题的能力中体现，适合形成自己的方法和判断体系。",

  hurting_officer_meets_officer:
    "人生的重要课题是处理个人判断与现实规则之间的关系，既不能完全压住自己，也不能只靠对抗推动事情。",

  wealth_heavy_body_weak:
    "机会和现实事务可能不少，但发展速度必须与自身能力和精力匹配，承接稳定比盲目扩张更重要。",

  officer_killing_mixed:
    "人生中容易同时面对稳定要求和高压挑战，明确主次、职责和边界，是减少内耗的重要条件。",

  day_branch_combined:
    "关系、合作和共同目标对人生选择影响较深，既要珍惜连接，也要保留独立判断和个人边界。",

  metal_water_fire_weak:
    "命局思考和判断能力较强，但真正改变现实仍需行动、表达与目标感配合，不能长期停留在内部推演阶段。",
};

function buildContractNatalMasterSummary({
  structureSynopsis = {},
  facts = [],
  compositionImages = [],
  hitList = {},
  twelveDomains = [],
  scope = "natal",
} = {}) {
  const normalizedScope =
    cleanSentence(scope) ||
    "natal";

  const images =
    uniqueFacts(
      (
        Array.isArray(
          compositionImages,
        )
          ? compositionImages
          : []
      )
        .filter(Boolean)
        .sort(
          compareContractImages,
        ),
    );

  const domains =
    Array.isArray(
      twelveDomains,
    )
      ? twelveDomains
      : [];

  const hitRows =
    (
      Array.isArray(hitList?.all)
        ? hitList.all
        : []
    )
      .filter(Boolean)
      .slice()
      .sort(compareMasterRows);

  const coreImages =
    images.filter(
      (image) =>
        image.role === "core",
    );

  const supportImages =
    images.filter(
      (image) =>
        image.role === "support",
    );

  const tensionImages =
    images.filter(
      (image) =>
        image.role === "tension",
    );

  const conditionalImages =
    images.filter(
      (image) =>
        image.role ===
          "conditional" ||
        image.status ===
          "conditional",
    );

  const positiveImages = [
    ...coreImages,
    ...supportImages,
  ];

  const primaryImage =
    positiveImages[0] ||
    images[0] ||
    null;

  const secondaryImage =
    positiveImages.find(
      (image) =>
        image !== primaryImage &&
        cleanSentence(
          image.ruleId,
        ) !==
          cleanSentence(
            primaryImage?.ruleId,
          ),
    ) ||
    null;

  const primaryRow =
    findHitRowForImage(
      primaryImage,
      hitRows,
    ) ||
    hitRows.find(
      (row) =>
        row.role === "core",
    ) ||
    hitRows.find(
      (row) =>
        row.role === "support",
    ) ||
    hitRows[0] ||
    null;

  const secondaryRow =
    findHitRowForImage(
      secondaryImage,
      hitRows,
    ) ||
    hitRows.find(
      (row) =>
        row !== primaryRow &&
        (
          row.role === "core" ||
          row.role ===
            "support"
        ),
    ) ||
    null;

  const primaryRuleId =
    cleanSentence(
      primaryRow?.sourceRuleId ||
      primaryImage?.ruleId ||
      "",
    );

  const structureOpening =
    cleanSentence(
      structureSynopsis.summary ||
      structureSynopsis.headline ||
      "",
    );

  const compositionOpening =
    buildProfessionalOpening({
      primaryImage,
      primaryRow,
      secondaryImage,
      secondaryRow,
    });

  const opening =
    compositionOpening
      ? prependNarrativeLead(
          "在上述原局基础上",
          compositionOpening,
        )
      : structureOpening;

  const characterLine =
    buildDomainNarrativeLine({
      domains,

      keys: [
        "self",
        "fortune",
      ],

      fields: [
        "manifestation",
        "strength",
        "pressure",
      ],

      limit: 3,
    });

  const careerWealthLine =
    buildDomainNarrativeLine({
      domains,

      keys: [
        "career",
        "wealth",
      ],

      fields: [
        "judgement",
        "manifestation",
        "strength",
        "pressure",
      ],

      limit: 4,
    });

  const relationshipLine =
    buildDomainNarrativeLine({
      domains,

      keys: [
        "spouse",
        "friends",
      ],

      fields: [
        "manifestation",
        "strength",
        "pressure",
      ],

      limit: 3,
    });

  const familyLine =
    buildDomainNarrativeLine({
      domains,

      keys: [
        "parents",
        "children",
        "siblings",
      ],

      fields: [
        "judgement",
        "manifestation",
        "strength",
        "pressure",
      ],

      limit: 3,
    });

  const healthLine =
    buildDomainNarrativeLine({
      domains,

      keys: [
        "health",
        "fortune",
      ],

      fields: [
        "manifestation",
        "pressure",
      ],

      limit: 3,
    });

  const strengthRows =
    hitRows.filter(
      (row) =>
        (
          row.role === "core" ||
          row.role ===
            "support"
        ) &&
        row.status !== "weak",
    );

  const tensionRows =
    hitRows.filter(
      (row) =>
        row.role === "tension" ||
        row.role ===
          "conditional" ||
        row.status ===
          "conditional",
    );

  let strengths =
    collectNarrativeItems(
      strengthRows,
      "strengths",
      2,
    );

  if (
    !strengths.length &&
    primaryRow
  ) {
    strengths =
      collectNarrativeItems(
        [primaryRow],
        "strengths",
        2,
      );
  }

  let tensions =
    collectNarrativeItems(
      tensionRows,
      "risks",
      2,
    );

  if (
    !tensions.length &&
    primaryRow
  ) {
    tensions =
      collectNarrativeItems(
        [primaryRow],
        "risks",
        1,
      );
  }

  const conditions =
    uniqueText(
      conditionalImages.map(
        imageBrief,
      ),
    ).slice(0, 3);

  const abilityTensionLine =
    buildAbilityTensionLine({
      strengths,
      tensions,
    });

  const lifePatternLine =
    buildLifePatternLine({
      primaryRuleId,
      primaryImage,
      domains,
      structureSynopsis,
    });

  const relationshipFamilyLine =
    joinDistinctSentences([
      relationshipLine,
      familyLine,
    ]);

  const sections =
    buildProfessionalSections({
      opening,
      characterLine,
      careerWealthLine,
      relationshipLine,
      familyLine,
      abilityTensionLine,
      healthLine,
      lifePatternLine,
    });

  const conclusion =
    buildProfessionalConclusion({
      structureSynopsis,

      primaryConclusion:
        primaryImage
          ?.masterNarrative
          ?.conclusion ??
        "",

      strengths,

      tensions,

      relationshipLine,

      usedTexts: [
        opening,

        ...sections.map(
          (section) =>
            section.text,
        ),
      ],
    });

  const evidenceFactIds =
    uniqueText([
      ...images.flatMap(
        (image) =>
          image.matchedFactIds ??
          [],
      ),

      ...domains.flatMap(
        (domain) =>
          domain.evidenceFactIds ??
          [],
      ),
    ]);

  const compositionImageIds =
    uniqueText([
      ...images.map(
        (image) =>
          image.id,
      ),

      ...domains.flatMap(
        (domain) =>
          domain
            .compositionImageIds ??
          [],
      ),
    ]);

  const domainKeys =
    uniqueText(
      domains.map(
        (domain) =>
          domain.key,
      ),
    );

  return {
    version:
      "contract-master-summary-v1",

    narrativeVersion:
  "professional-master-summary-v3",

    narrativeStyle:
      "professional_master",

    scope:
      normalizedScope,

    title:
      "命理总批（原局）",

    opening,

    paragraph:
      opening,

    conclusion,

    structureSynopsis,

    coreStructure:
      structureOpening ||
      opening,

    workLine:
      careerWealthLine ||
      lifePatternLine,

    strengths,

    tensions,

    conditions,

    characterLine,

    careerWealthLine,

    relationshipLine,

    familyLine,

    relationshipFamilyLine,

    healthLine,

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
      "本总批只论出生原局所呈现的性格、结构和人生倾向，不包含大运、流年、流月的具体事件触发。",

    warnings: [],

    structure:
      structureOpening ||
      opening,

    core:
      structureOpening ||
      opening,

    lifeDirection:
      lifePatternLine,

    sections,

    conditionalFactIds:
      uniqueText(
        conditionalImages.flatMap(
          (image) =>
            image.matchedFactIds ??
            [],
        ),
      ),

    selectedFacts:
      images.map(
        (image) => ({
          id:
            image.id,

          name:
            image.title,

          brief:
            image.brief,

          role:
            image.role,

          status:
            image.status,

          domains:
            image.domains ??
            [],
        }),
      ),

    selectionDebug: {
      source:
        "contract_composition_domains_and_semantics",

      hitListCount:
        hitRows.length,

      imageCount:
        images.length,

      domainCount:
        domains.length,

      primaryRuleId,
    },
  };
}

function buildProfessionalOpening({
  primaryImage,
  primaryRow,
  secondaryImage,
  secondaryRow,
}) {
  const primaryTitle =
    cleanSentence(
      primaryRow?.name ||
      primaryImage?.title ||
      "",
    );

  const secondaryTitle =
    cleanSentence(
      secondaryRow?.name ||
      secondaryImage?.title ||
      "",
    );

  const primaryMeaning =
    toMasterVoice(
      primaryRow?.meaning ||
      imageBrief(
        primaryImage,
      ),
    );

  if (!primaryTitle) {
    return (
      primaryMeaning ||
      "原局目前以基础事实为主，高阶组合尚未形成特别集中的主线，整体判断需要保留余地。"
    );
  }

  const isPressureStructure =
    primaryImage?.role ===
      "tension" ||
    primaryImage?.role ===
      "conditional" ||
    primaryRow?.role ===
      "tension" ||
    primaryRow?.role ===
      "conditional";

  const lead =
    isPressureStructure
      ? `原局较明显的结构线索是${primaryTitle}`
      : secondaryTitle &&
          secondaryTitle !==
            primaryTitle
        ? `原局以${primaryTitle}为主，兼见${secondaryTitle}`
        : `原局以${primaryTitle}为主要结构`;

  return joinDistinctSentences([
    lead,
    primaryMeaning,
  ]);
}

function buildDomainNarrativeLine({
  domains,
  keys,
  fields,
  limit = 2,
  allowFallback = false,
}) {
  const texts = [];

  for (const key of keys) {
    const domain =
      domains.find(
        (item) =>
          item.key === key,
      );

    if (!domain) {
      continue;
    }

    const hasUsefulSignal =
      Boolean(
        domain
          .hasCompositionNarrative,
      ) ||
      domain.confidence ===
        "high" ||
      domain.confidence ===
        "medium";

    if (
      !allowFallback &&
      !hasUsefulSignal
    ) {
      continue;
    }

    for (
      const field of fields
    ) {
      const text =
        toMasterVoice(
          domain[field],
        );

      if (
        !text ||
        (
          !allowFallback &&
          isWeakDomainText(text)
        )
      ) {
        continue;
      }

      pushDistinctText(
        texts,
        text,
      );

      if (
        texts.length >= limit
      ) {
        return joinSentences(
          texts,
        );
      }
    }
  }

  return joinSentences(
    texts.slice(0, limit),
  );
}

function buildAbilityTensionLine({
  strengths,
  tensions,
}) {
  const lines = [];

  const strengthText =
    buildNaturalList(
      strengths,
      "，同时",
    );

  const tensionText =
    buildNaturalList(
      tensions,
      "，同时",
    );

  if (strengthText) {
    lines.push(
      `命主的优势主要在于${strengthText}`,
    );
  }

  if (tensionText) {
    lines.push(
      `需要注意的是${tensionText}`,
    );
  }

  return joinSentences(lines);
}

function buildLifePatternLine({
  primaryRuleId,
  primaryImage,
  domains,
  structureSynopsis = {},
}) {
  const ruleLine =
    cleanSentence(
      primaryImage
        ?.masterNarrative
        ?.lifePattern,
    ) ||
    MASTER_LIFE_PATTERN_BY_RULE[
      primaryRuleId
    ] ||
    "整体发展更适合走能够持续积累、反复验证和逐步放大优势的现实路径。";

  const balanceLine =
    cleanSentence(
      structureSynopsis
        .balance
        ?.text,
    );

  const domainLine =
    buildDomainNarrativeLine({
      domains,

      keys: [
        "fortune",
        "movement",
      ],

      fields: [
        "judgement",
      ],

      limit: 1,
    });

  return joinDistinctSentences([
    ruleLine,
    balanceLine,
    domainLine,
  ]);
}

function buildProfessionalSections({
  opening,
  characterLine,
  careerWealthLine,
  relationshipLine,
  familyLine,
  abilityTensionLine,
  healthLine,
  lifePatternLine,
}) {
  const candidates = [
    {
      key:
        "character",

      label:
        "性格与做事方式",

      text:
        characterLine,
    },

    {
      key:
        "careerWealth",

      label:
        "事业与财富",

      text:
        careerWealthLine,
    },

    {
      key:
        "relationship",

      label:
        "感情关系",

      text:
        relationshipLine,
    },

    {
      key:
        "family",

      label:
        "家庭与子女",

      text:
        familyLine,
    },

    {
      key:
        "abilityTension",

      label:
        "优势与短板",

      text:
        abilityTensionLine,
    },

    {
      key:
        "healthInner",

      label:
        "体质与内在状态",

      text:
        healthLine,
    },

    {
      key:
        "lifePattern",

      label:
        "人生发展模式",

      text:
        lifePatternLine,
    },
  ];

  const sections = [];

  const usedSentences =
    splitNarrativeSentences(
      opening,
    );

  for (
    const candidate of
    candidates
  ) {
    const text =
      filterNovelSentences(
        candidate.text,
        usedSentences,
      );

    if (!text) {
      continue;
    }

    usedSentences.push(
      ...splitNarrativeSentences(
        text,
      ),
    );

    sections.push({
      key:
        candidate.key,

      label:
        candidate.label,

      text,
    });
  }

  return sections;
}

function prependNarrativeLead(
  lead,
  value,
) {
  const normalizedLead =
    stripTerminalPunctuation(
      lead,
    );

  const body =
    cleanSentence(value)
      .replace(
        /^原局/,
        "",
      );

  if (!body) {
    return normalizedLead;
  }

  return `${normalizedLead}，${body}`;
}

function buildStructureConclusionSentence(
  structureSynopsis = {},
) {
  const strengthState =
    structureSynopsis
      .dayMaster
      ?.strengthState;

  const dominantGroups =
    Array.isArray(
      structureSynopsis
        .tenGods
        ?.dominantGroups,
    )
      ? structureSynopsis
          .tenGods
          .dominantGroups
      : [];

  const hasResource =
    dominantGroups.includes(
      "resource",
    );

  const hasPeer =
    dominantGroups.includes(
      "peer",
    );

  if (
    strengthState === "strong" &&
    hasResource &&
    hasPeer
  ) {
    return "总体看，命主自身承载和内部积累能力较强，属于先学习、先判断、再逐步形成现实成果的类型；真正的发展重点，是把专业经验、责任感和判断能力稳定转化为输出与行动。";
  }

  if (
    strengthState === "strong"
  ) {
    return "总体看，命主自身力量和承载意识较足，发展上更需要把内部优势落实为稳定输出、现实成果和长期能力。";
  }

  if (
    strengthState === "weak"
  ) {
    return "总体看，命主更适合先稳住能力、精力和支持系统，再逐步扩大责任与现实目标，不宜长期超出自身承载。";
  }

  if (
    strengthState ===
    "balanced"
  ) {
    return "总体看，命局承载与输出相对均衡，发展重点在于保持稳定节奏，并持续把已有优势落实为现实成果。";
  }

  return "总体看，命局更适合走稳定积累、持续验证和逐步形成现实成果的路线。";
}

function buildProfessionalConclusion({
  structureSynopsis = {},
  primaryConclusion = "",
  strengths = [],
  tensions = [],
  relationshipLine = "",
  usedTexts = [],
}) {
  const usedSentences =
    normalizeArray(
      usedTexts,
    ).flatMap(
      splitNarrativeSentences,
    );

  const candidates = [];

  const normalizedPrimaryConclusion =
    cleanSentence(
      primaryConclusion,
    );

  if (
    normalizedPrimaryConclusion
  ) {
    candidates.push(
      normalizedPrimaryConclusion,
    );
  }

  const structureSentence =
    buildStructureConclusionSentence(
      structureSynopsis,
    );

  if (structureSentence) {
    candidates.push(
      structureSentence,
    );
  }

  if (
    strengths[0] ||
    tensions[0]
  ) {
    const parts = [];

    if (strengths[0]) {
      parts.push(
        `真正能够长期依靠的是${stripTerminalPunctuation(
          strengths[0],
        )}`,
      );
    }

    if (tensions[0]) {
      parts.push(
        `需要防止${stripTerminalPunctuation(
          tensions[0],
        )}演变成反复消耗`,
      );
    }

    candidates.push(
      joinSentences(parts),
    );
  }

  if (
    relationshipLine &&
    /边界|责任|沟通|关系|反复/.test(
      relationshipLine,
    )
  ) {
    candidates.push(
      "关系中减少反复确认和自我较劲，把边界、责任和真实需求说清楚，会比一味坚持自己的尺度更有利。",
    );
  }

  const conclusion =
    filterNovelSentences(
      joinSentences(
        candidates,
      ),
      usedSentences,
    );

  return (
    conclusion ||
    "总体看，命局中的优势需要逐步落实为稳定能力和现实成果，结构中的压力则需要通过清楚边界、稳定节奏和持续行动逐步化解。"
  );
}

function splitNarrativeSentences(
  value,
) {
  return (
    String(value ?? "")
      .match(
        /[^。！？；]+[。！？；]?/g,
      ) ||
    []
  )
    .map(cleanSentence)
    .filter(Boolean);
}

function filterNovelSentences(
  value,
  usedSentences = [],
) {
  const result = [];

  for (
    const sentence of
    splitNarrativeSentences(
      value,
    )
  ) {
    const duplicated =
      [
        ...usedSentences,
        ...result,
      ].some(
        (existing) =>
          textSimilar(
            existing,
            sentence,
          ),
      );

    if (!duplicated) {
      result.push(sentence);
    }
  }

  return joinSentences(
    result,
  );
}

function collectNarrativeItems(
  rows,
  field,
  limit,
) {
  const result = [];

  for (const row of rows) {
    const values =
      normalizeArray(
        row?.[field],
      );

    for (
      const value of values
    ) {
      const text =
        toMasterVoice(value);

      if (!text) {
        continue;
      }

      pushDistinctText(
        result,
        text,
      );

      if (
        result.length >= limit
      ) {
        return result;
      }
    }
  }

  return result;
}

function findHitRowForImage(
  image,
  rows,
) {
  if (!image) {
    return null;
  }

  const imageId =
    cleanSentence(
      image.id,
    );

  const ruleId =
    cleanSentence(
      image.ruleId,
    );

  return (
    rows.find((row) => {
      const rowRuleIds = [
        row.sourceRuleId,
        row.subcategory,
        row.semanticGroup,
      ]
        .map(cleanSentence)
        .filter(Boolean);

      return (
        (
          imageId &&
          cleanSentence(
            row.id,
          ) === imageId
        ) ||
        (
          ruleId &&
          rowRuleIds.includes(
            ruleId,
          )
        )
      );
    }) ||
    null
  );
}

function compareMasterRows(
  left,
  right,
) {
  return (
    roleRank(right?.role) -
      roleRank(left?.role) ||
    Number(
      right?.priority ??
      right?.score ??
      0,
    ) -
      Number(
        left?.priority ??
        left?.score ??
        0,
      )
  );
}

function compareContractImages(
  left,
  right,
) {
  return (
    roleRank(right.role) -
      roleRank(left.role) ||
    Number(
      right.priority ??
      0,
    ) -
      Number(
        left.priority ??
        0,
      ) ||
    cleanSentence(
      left.ruleId,
    ).localeCompare(
      cleanSentence(
        right.ruleId,
      ),
    )
  );
}

function imageBrief(
  image = {},
) {
  return cleanSentence(
    image.brief ||
    image.title ||
    "",
  );
}

function buildNaturalList(
  items,
  connector = "，同时",
) {
  return uniqueText(items)
    .map(
      stripTerminalPunctuation,
    )
    .filter(Boolean)
    .join(connector);
}

function joinDistinctSentences(
  items,
) {
  const result = [];

  for (
    const item of
    normalizeArray(items)
  ) {
    const text =
      cleanSentence(item);

    if (!text) {
      continue;
    }

    pushDistinctText(
      result,
      text,
    );
  }

  return joinSentences(result);
}

function pushDistinctText(
  target,
  text,
) {
  const normalized =
    cleanSentence(text);

  if (!normalized) {
    return;
  }

  const duplicated =
    target.some(
      (existing) =>
        textSimilar(
          existing,
          normalized,
        ),
    );

  if (!duplicated) {
    target.push(normalized);
  }
}

function toMasterVoice(
  value,
) {
  return cleanSentence(value)
    .replace(
      /你的/g,
      "命主的",
    )
    .replace(
      /你/g,
      "命主",
    );
}

function stripTerminalPunctuation(
  value,
) {
  return cleanSentence(value)
    .replace(
      /[。；，、！？：]+$/g,
      "",
    );
}

function isWeakDomainText(
  value,
) {
  return /目前以|基础事实为主|高阶组合不算突出|尚未形成特别集中|不宜只凭原局单断|需要结合时间层判断|尚未形成特别突出的高阶组合/.test(
    value,
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
