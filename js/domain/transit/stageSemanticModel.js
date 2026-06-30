const STEM_ELEMENT = {
  甲: "wood",
  乙: "wood",
  丙: "fire",
  丁: "fire",
  戊: "earth",
  己: "earth",
  庚: "metal",
  辛: "metal",
  壬: "water",
  癸: "water",
};

const ELEMENT_GENERATES = {
  wood: "fire",
  fire: "earth",
  earth: "metal",
  metal: "water",
  water: "wood",
};

const ELEMENT_CONTROLS = {
  wood: "earth",
  earth: "water",
  water: "fire",
  fire: "metal",
  metal: "wood",
};

const STEM_COMBINATION_PARTNER = {
  甲: "己",
  己: "甲",
  乙: "庚",
  庚: "乙",
  丙: "辛",
  辛: "丙",
  丁: "壬",
  壬: "丁",
  戊: "癸",
  癸: "戊",
};

export const STAGE_DOMAIN_LABELS = {
  general: "整体阶段",
  self: "个人状态与选择",
  learning: "学习与能力积累",
  credential: "资质、证照与规则认可",
  career: "事业与工作方式",
  rules: "规则、责任与身份",
  wealth: "资源与现实回报",
  relationship: "感情与重要关系",
  cooperation: "合作、客户与责任绑定",
  family: "家庭与六亲",
  parents: "父母、长辈与支持结构",
  children: "子女与结果层",
  expression: "表达、技术与成果输出",
  execution: "任务执行与成果落地",
  movement: "环境、出行与变动",
  residence: "居住、根基与生活基础",
  health: "身心节奏与负荷",
};

export const KNOWN_NAMED_PATTERNS = [
  "财破印",
  "食神制杀",
  "伤官见官",
  "官印相生",
  "杀印相生",
  "食伤生财",
  "枭神夺食",
  "比劫夺财",
  "财生官",
  "官杀混杂",
  "伤官佩印",
  "伤官配印",
  "羊刃驾杀",
  "从财格",
  "从官格",
  "从杀格",
  "从儿格",
  "化气格",
];

const RELATION_CORE_IMAGES = [
  ["五合", "连接、牵连、协商或责任绑定增强"],
  ["六合", "关系、资源或事务之间形成连接与绑定"],
  ["冲", "原有节奏与新增要求对冲，需要调整或重新安排"],
  ["刑", "规则压力、摩擦或内耗增加"],
  ["害", "隐性牵制、误解或沟通成本增加"],
  ["穿", "隐性牵制、误解或沟通成本增加"],
  ["破", "原有安排松动、反复或需要修补"],
  ["伏吟", "同类主题重复出现，关注度和体感增强"],
  ["反吟", "原有结构出现方向相反或来回拉扯"],
];

export function formatLuckDateRange(pillar = {}) {
  const explicitStart = firstText([
    pillar.startAt,
    pillar.startDate,
    pillar.startDateTime,
    pillar.startTime,
  ]);
  const explicitEnd = firstText([
    pillar.endAt,
    pillar.endDate,
    pillar.endDateTime,
    pillar.endTime,
  ]);

  if (explicitStart && explicitEnd) {
    return `${formatDateLike(explicitStart)}—${formatDateLike(explicitEnd)}`;
  }

  const startIndex = Number(pillar.startMonthIndex);
  const endExclusive = Number(pillar.endMonthIndexExclusive);

  if (Number.isFinite(startIndex) && Number.isFinite(endExclusive)) {
    const start = monthIndexToYearMonth(startIndex);
    const end = monthIndexToYearMonth(endExclusive);
    return `${start.year}年${start.month}月—${end.year}年${end.month}月`;
  }

  const startYear = Number(pillar.startYear);
  const endYear = Number(pillar.endYear);
  if (Number.isFinite(startYear) && Number.isFinite(endYear)) {
    return `${startYear}年—${endYear}年`;
  }

  return "";
}

export function buildStageSemanticContext({
  stage = "luck",
  item = {},
  baseBaziViewModel,
  natalImageReport,
  stageRulePack,
} = {}) {
  const normalizedStage = ["luck", "year", "month"].includes(stage)
    ? stage
    : "luck";

  const natalPillars = collectNatalPillars(
    baseBaziViewModel,
    natalImageReport,
  );
  const facts = collectSemanticFacts(item);
  const combinationDiagnostics = buildCombinationDiagnostics({
    item,
    natalPillars,
    facts,
  });
  const hierarchyRelations = buildHierarchyRelations({
    stage: normalizedStage,
    item,
  });
  const structuralSignals = buildStructuralSignals({
    facts,
    combinationDiagnostics,
  });

  const sourceText = [
    ...facts.map((fact) => fact.text),
    ...array(stageRulePack?.matchedRules).flatMap((rule) => [
      rule?.title,
      ...array(rule?.imagery?.core),
    ]),
  ].join(" ");

  const allowedNamedPatterns = KNOWN_NAMED_PATTERNS
    .filter((name) => sourceText.includes(name));

  return {
    stage: normalizedStage,
    combinationDiagnostics,
    hierarchyRelations,
    structuralSignals,
    allowedNamedPatterns,
    temporalEvidence: {
      allowsExactPhaseYears:
        normalizedStage === "luck" &&
        Array.isArray(item?.phaseWindows) &&
        item.phaseWindows.length > 0,
      allowsYearSubperiods:
        normalizedStage === "year" &&
        Boolean(
          item?.monthlyHighlights?.length ||
          item?.quarterlyWindows?.length ||
          item?.subperiodEvidence?.length
        ),
      allowsMonthSubperiods:
        normalizedStage === "month" &&
        Boolean(item?.subperiodEvidence?.length),
    },
    relationshipEvidence: {
      dayStemTriggered:
        combinationDiagnostics.affectsDayStem ||
        facts.some((fact) => /日干|日主|日元/.test(fact.text)),
      dayBranchTriggered:
        combinationDiagnostics.dayBranchTriggered,
      spousePalaceDirect:
        combinationDiagnostics.dayBranchTriggered,
      note:
        combinationDiagnostics.affectsDayStem &&
        !combinationDiagnostics.dayBranchTriggered
          ? "当前只确认日干/本人层被牵动，感情是候选落点之一，不等同夫妻宫被直接合冲刑害破。"
          : "",
    },
    wordingRules: [
      "先写结构能确认的核心主象，再写证据最强的现实落点。",
      "每个主要领域最多补充一个替代分支，不把全部可能性机械列完。",
      "日干被合只能说明本人、身份、重要关系或责任被牵动；没有日支证据时，不得写夫妻宫被动。",
      "同一天干同时合向多个同类天干时，应说明合意分散或争合候选，不得写成多个领域同时稳定合住。",
      "生克方向必须按实际五行方向解释，不能把施克方和受克方的作用倒置。",
      "没有逐年或逐月证据时，不得自行切分前中后期、年初年中年末或上下半年。",
    ],
  };
}

export function buildCombinationDiagnostics({
  item = {},
  natalPillars = [],
  facts = [],
} = {}) {
  const currentStem = item?.stem || firstStem(item?.ganZhi);
  const partnerStem = STEM_COMBINATION_PARTNER[currentStem] || "";
  const matches = partnerStem
    ? natalPillars.filter((pillar) => pillar.stem === partnerStem)
    : [];

  const dayBranchTriggered =
    array(item?.relationToNatal).some((relation) =>
      /日支|夫妻宫/.test(
        `${relation?.natalPillar || ""}${relation?.description || ""}`,
      )
    ) ||
    facts.some((fact) =>
      /日支|夫妻宫/.test(fact.text) &&
      /合|冲|刑|害|穿|破/.test(fact.text)
    );

  const affectsDayStem = matches.some((pillar) => pillar.key === "day");
  const affectsMonthStem = matches.some((pillar) => pillar.key === "month");

  return {
    currentStem,
    partnerStem,
    matches: matches.map((pillar) => ({
      key: pillar.key,
      label: pillar.label,
      stem: pillar.stem,
    })),
    matchCount: matches.length,
    multiplePartner: matches.length >= 2,
    affectsDayStem,
    affectsMonthStem,
    dayBranchTriggered,
    note: matches.length >= 2
      ? `${currentStem}${partnerStem}合同时牵动${matches.map((pillar) => pillar.label).join("、")}，属于合意分散或争合候选，不宜理解为多处同时稳定合住。`
      : affectsDayStem && !dayBranchTriggered
        ? `${currentStem}${partnerStem}合目前落在日干/本人层，不等同夫妻宫被直接合动。`
        : "",
  };
}

export function buildHierarchyRelations({
  stage = "luck",
  item = {},
} = {}) {
  const layers = [];

  const luck = item?.currentLuckItem ||
    (stage === "luck" ? item : null);
  const year = item?.yearItem ||
    (stage === "year" ? item : null);
  const month = stage === "month" ? item : null;

  if (stage === "year" && luck && year) {
    layers.push(describeStemRelation("大运", luck, "流年", year));
  }

  if (stage === "month") {
    if (luck && month) {
      layers.push(describeStemRelation("大运", luck, "流月", month));
    }
    if (year && month) {
      layers.push(describeStemRelation("流年", year, "流月", month));
    }
  }

  return layers.filter(Boolean);
}

export function describeStemRelation(
  leftLabel,
  leftItem,
  rightLabel,
  rightItem,
) {
  const leftStem = leftItem?.stem || firstStem(leftItem?.ganZhi);
  const rightStem = rightItem?.stem || firstStem(rightItem?.ganZhi);
  const leftElement = STEM_ELEMENT[leftStem];
  const rightElement = STEM_ELEMENT[rightStem];

  if (!leftElement || !rightElement) return null;

  const leftTenGod =
    leftItem?.tenGod ||
    leftItem?.stemTenGod ||
    "";
  const rightTenGod =
    rightItem?.tenGod ||
    rightItem?.stemTenGod ||
    "";

  if (ELEMENT_CONTROLS[leftElement] === rightElement) {
    return {
      type: "controls",
      controllerLayer: leftLabel,
      controllerStem: leftStem,
      controllerTenGod: leftTenGod,
      controlledLayer: rightLabel,
      controlledStem: rightStem,
      controlledTenGod: rightTenGod,
      text:
        `${leftLabel}${leftStem}${leftTenGod ? `（${leftTenGod}）` : ""}` +
        `制约或调节${rightLabel}${rightStem}${rightTenGod ? `（${rightTenGod}）` : ""}。`,
      interpretation:
        `${leftLabel}层的长期方式在筛选、调节或消化${rightLabel}层的要求；不应解释成受克一方反过来单向限制施克一方。`,
    };
  }

  if (ELEMENT_CONTROLS[rightElement] === leftElement) {
    return {
      type: "controlled_by",
      controllerLayer: rightLabel,
      controllerStem: rightStem,
      controllerTenGod: rightTenGod,
      controlledLayer: leftLabel,
      controlledStem: leftStem,
      controlledTenGod: leftTenGod,
      text:
        `${rightLabel}${rightStem}${rightTenGod ? `（${rightTenGod}）` : ""}` +
        `制约或调节${leftLabel}${leftStem}${leftTenGod ? `（${leftTenGod}）` : ""}。`,
      interpretation:
        `${rightLabel}层的要求对${leftLabel}层形成筛选、约束或调整。`,
    };
  }

  if (ELEMENT_GENERATES[leftElement] === rightElement) {
    return {
      type: "generates",
      sourceLayer: leftLabel,
      sourceStem: leftStem,
      targetLayer: rightLabel,
      targetStem: rightStem,
      text: `${leftLabel}${leftStem}生助${rightLabel}${rightStem}。`,
      interpretation: `${leftLabel}层为${rightLabel}层提供来源、资源或推动。`,
    };
  }

  if (ELEMENT_GENERATES[rightElement] === leftElement) {
    return {
      type: "generated_by",
      sourceLayer: rightLabel,
      sourceStem: rightStem,
      targetLayer: leftLabel,
      targetStem: leftStem,
      text: `${rightLabel}${rightStem}生助${leftLabel}${leftStem}。`,
      interpretation: `${rightLabel}层为${leftLabel}层提供来源、资源或推动。`,
    };
  }

  return null;
}

function buildStructuralSignals({
  facts,
  combinationDiagnostics,
}) {
  const signals = facts
    .filter((fact) => fact.text)
    .slice(0, 14)
    .map((fact) => {
      const candidates = inferDomainCandidates(fact.text, fact.domains);
      return {
        id: fact.id,
        evidenceText: fact.text,
        coreImage: coreImageForText(fact.text),
        certainty:
          fact.status === "direct" || fact.category === "direct"
            ? "direct"
            : fact.status === "condition_only" || fact.category === "conditional"
              ? "conditional"
              : "combined",
        primaryCandidates: candidates.slice(0, 2),
        alternativeCandidates: candidates.slice(2, 5),
        conditions: fact.conditions,
        boundary: boundaryForFact(fact.text),
      };
    });

  if (
    combinationDiagnostics.currentStem &&
    combinationDiagnostics.partnerStem &&
    combinationDiagnostics.matches.length
  ) {
    signals.unshift({
      id: "semantic:stem-combination",
      evidenceText:
        `${combinationDiagnostics.currentStem}${combinationDiagnostics.partnerStem}合，` +
        `命中${combinationDiagnostics.matches.map((item) => item.label).join("、")}`,
      coreImage: "本人、身份、重要关系或现实责任形成牵连，需要协商与重新分配注意力",
      certainty: "combined",
      primaryCandidates: [
        {
          domain: "self",
          label: STAGE_DOMAIN_LABELS.self,
          score: 10,
          reason: "日干或本人层被牵动",
        },
        {
          domain: "cooperation",
          label: STAGE_DOMAIN_LABELS.cooperation,
          score: 8,
          reason: "五合首先代表连接、牵连与责任绑定",
        },
      ],
      alternativeCandidates: [
        {
          domain: "relationship",
          label: STAGE_DOMAIN_LABELS.relationship,
          score: combinationDiagnostics.affectsDayStem ? 7 : 4,
          reason:
            combinationDiagnostics.dayBranchTriggered
              ? "夫妻宫存在直接证据"
              : "感情只是重要关系候选之一",
        },
        {
          domain: "career",
          label: STAGE_DOMAIN_LABELS.career,
          score: combinationDiagnostics.affectsMonthStem ? 7 : 4,
          reason: "月干或工作环境同时被牵动",
        },
      ],
      conditions: [
        "现实中是否已经出现重要对象、合作、岗位责任或长期占用精力的事务",
      ],
      boundary: combinationDiagnostics.note,
    });
  }

  return uniqueById(signals);
}

function inferDomainCandidates(text, explicitDomains = []) {
  const scores = new Map();

  const add = (domain, score, reason) => {
    const previous = scores.get(domain);
    if (!previous || score > previous.score) {
      scores.set(domain, {
        domain,
        label: STAGE_DOMAIN_LABELS[domain] || domain,
        score,
        reason,
      });
    }
  };

  for (const domain of explicitDomains) {
    const normalized = normalizeDomain(domain);
    if (normalized) add(normalized, 10, "结构事实已标注该领域");
  }

  if (/日干|日主|日元/.test(text)) {
    add("self", 10, "本人立场、身份和注意力被牵动");
    add("relationship", 7, "重要关系是可能落点之一");
    add("cooperation", 7, "合作、客户或责任绑定也可能承接");
    add("career", 5, "身份与职责可能同步被牵动");
  }

  if (/日支|夫妻宫/.test(text)) {
    add("relationship", 11, "夫妻宫存在直接结构证据");
  }

  if (/月干|月支|月柱/.test(text)) {
    add("career", 9, "月柱对应事业环境、成长秩序与工作规则");
    add("rules", 7, "工作规则与责任边界被牵动");
    add("parents", 5, "月柱也可承接父母、长辈与成长支持");
  }

  if (/时干|时支|时柱/.test(text)) {
    add("execution", 9, "时柱对应执行、结果、后续安排");
    add("children", 5, "时柱也可承接子女与结果层");
    add("movement", 5, "计划、作息或后续安排可能调整");
    add("health", 3, "也可能表现为节奏与负荷变化");
  }

  if (/年干|年支|年柱/.test(text)) {
    add("family", 9, "年柱对应家庭、根基与早年环境");
    add("residence", 7, "居住与生活基础可能被牵动");
    add("movement", 6, "外部环境或地域安排也可能变化");
    add("parents", 6, "长辈与家族支持是候选落点");
  }

  if (/食神|伤官|食伤/.test(text)) {
    add("expression", 9, "表达、技术、方案与成果输出增强");
    add("career", 6, "输出可能落到工作方式与专业成果");
    add("learning", 5, "知识转化与能力表达被强调");
  }

  if (/正官|七杀|官星|官杀/.test(text)) {
    add("career", 9, "岗位、责任与外部评价进入主线");
    add("rules", 9, "规则、制度与身份要求增强");
    add("credential", 5, "资质、考核或正式认可也可能承接");
  }

  if (/正财|偏财|财星/.test(text)) {
    add("wealth", 9, "资源、投入回报与现实责任成为议题");
    add("cooperation", 5, "资源交换与合作责任可能承接");
    add("relationship", 5, "男命中感情可作为候选落点，但不能单凭财星定事件");
  }

  if (/正印|偏印|印星/.test(text)) {
    add("learning", 9, "学习、吸收、体系与支持增强");
    add("credential", 7, "证照、资格与正式认可可能承接");
    add("parents", 6, "长辈、师长或支持系统也可能承接");
  }

  if (/比肩|劫财|比劫/.test(text)) {
    add("self", 8, "自主、同辈与自我主张增强");
    add("cooperation", 7, "合作、竞争与责任分配成为议题");
    add("wealth", 5, "资源分配与投入回报可能受影响");
  }

  if (/合|五合|六合/.test(text)) {
    add("cooperation", 7, "合首先代表连接、牵连与绑定");
    add("relationship", 6, "重要关系是常见但非唯一落点");
  }

  if (/冲|刑|害|穿|破/.test(text)) {
    add("execution", 6, "节奏、安排与执行路径需要调整");
    add("movement", 6, "环境、出行或位置变化是候选落点");
    add("health", 3, "也可能表现为身心节奏与负荷波动");
  }

  return [...scores.values()]
    .sort((a, b) => b.score - a.score);
}

function coreImageForText(text) {
  for (const [word, image] of RELATION_CORE_IMAGES) {
    if (text.includes(word)) return image;
  }

  if (/食神|伤官|食伤/.test(text)) {
    return "表达、技术、方案与成果输出增强，需要把想法转成可验证结果";
  }
  if (/正官|七杀|官星|官杀/.test(text)) {
    return "规则、责任、身份或外部评价进入主线";
  }
  if (/正财|偏财|财星/.test(text)) {
    return "资源、投入回报与现实责任需要重新排序";
  }
  if (/正印|偏印|印星/.test(text)) {
    return "学习、支持、体系与吸收能力增强，同时也要避免停留在准备层";
  }
  if (/比肩|劫财|比劫/.test(text)) {
    return "自主、同辈、合作与资源分配同时成为议题";
  }

  return text.slice(0, 120);
}

function boundaryForFact(text) {
  const boundaries = [];

  if (
    /日干|日主|日元/.test(text) &&
    /合/.test(text) &&
    !/日支|夫妻宫/.test(text)
  ) {
    boundaries.push("只能确认本人或重要关系被牵动，不能直接写夫妻宫被合动。");
  }
  if (/时干/.test(text) && /合/.test(text)) {
    boundaries.push("只能写时干/执行责任被牵动，不能扩大成时支或整个时柱被合。");
  }
  if (/化|成局|成格/.test(text)) {
    boundaries.push("化气、成局或成格必须有完整条件，当前只能作为待验证条件。");
  }

  return boundaries.join(" ");
}

function collectNatalPillars(baseBaziViewModel, natalImageReport) {
  const fromViewModel = array(baseBaziViewModel?.pillars)
    .map((pillar, index) => normalizePillar(pillar, index))
    .filter((pillar) => pillar.stem || pillar.branch);

  if (fromViewModel.length) return fromViewModel;

  const summaryPillars =
    natalImageReport?.natalAiEvidencePack?.chartSummary?.pillars ||
    natalImageReport?.natalDebug?.natalAiEvidencePack?.chartSummary?.pillars ||
    {};

  return Object.entries(summaryPillars)
    .map(([key, pillar]) => normalizePillar({
      ...pillar,
      key,
    }))
    .filter((pillar) => pillar.stem || pillar.branch);
}

function normalizePillar(pillar = {}, fallbackIndex = -1) {
  const name = String(pillar?.name || pillar?.key || pillar?.pillar || "");
  const key = normalizePillarKey(name, fallbackIndex);
  const ganZhi = String(pillar?.ganZhi || pillar?.label || "");
  return {
    key,
    label:
      pillar?.label ||
      pillar?.ganZhi ||
      `${pillar?.stem || ""}${pillar?.branch || ""}`,
    stem: pillar?.stem || firstStem(ganZhi),
    branch: pillar?.branch || firstBranch(ganZhi),
  };
}

function normalizePillarKey(value, fallbackIndex = -1) {
  const text = String(value || "").toLowerCase();
  if (/year|年/.test(text)) return "year";
  if (/month|月/.test(text)) return "month";
  if (/day|日/.test(text)) return "day";
  if (/hour|time|时/.test(text)) return "hour";
  return ["year", "month", "day", "hour"][fallbackIndex] || "";
}

function collectSemanticFacts(item) {
  return array(item?.transitStructure?.facts)
    .map((fact) => ({
      id: String(fact?.id || ""),
      text: String(fact?.text || fact?.label || ""),
      category: String(fact?.category || ""),
      status: String(fact?.status || ""),
      domains: array(fact?.domains).map(normalizeDomain).filter(Boolean),
      conditions: array(fact?.conditions).filter(Boolean),
    }))
    .filter((fact) => fact.text);
}

function normalizeDomain(value) {
  const key = String(value || "").trim();
  if (!key) return "";
  if (key === "spouse") return "relationship";
  if (key === "health_state") return "health";
  if (key === "fortune") return "general";
  return key;
}

function monthIndexToYearMonth(index) {
  const year = Math.floor(index / 12);
  const month = ((index % 12) + 12) % 12 + 1;
  return { year, month };
}

function formatDateLike(value) {
  const text = String(value || "").trim();
  const match = text.match(/^(\d{4})[-/](\d{1,2})(?:[-/](\d{1,2}))?/);
  if (!match) return text;
  const [, year, month, day] = match;
  return day
    ? `${year}年${Number(month)}月${Number(day)}日`
    : `${year}年${Number(month)}月`;
}

function firstStem(value) {
  return String(value || "").match(/[甲乙丙丁戊己庚辛壬癸]/)?.[0] || "";
}

function firstBranch(value) {
  return String(value || "").match(/[子丑寅卯辰巳午未申酉戌亥]/)?.[0] || "";
}

function firstText(values) {
  return values
    .map((value) => String(value || "").trim())
    .find(Boolean) || "";
}

function array(value) {
  return Array.isArray(value)
    ? value
    : value === null || value === undefined
      ? []
      : [value];
}

function uniqueById(values) {
  const seen = new Set();
  return values.filter((item) => {
    const key = item?.id || JSON.stringify(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
