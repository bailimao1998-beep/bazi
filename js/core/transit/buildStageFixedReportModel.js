import { buildStageRulePack } from "./buildStageRulePack.js";
import {
  buildStageSemanticContext,
  KNOWN_NAMED_PATTERNS,
  STAGE_DOMAIN_LABELS,
} from "./stageSemanticModel.js";

const STAGE_LABELS = {
  luck: "大运",
  year: "流年",
  month: "流月",
};

const LIMITS = {
  luck: { min: 2, max: 5 },
  year: { min: 1, max: 3 },
  month: { min: 0, max: 2 },
};

const SECTION_TITLES = {
  luck: [
    ["stageSummary", "阶段总判"],
    ["natalReception", "原局如何承接"],
    ["mechanism", "这十年的作用链"],
    ["primaryDomains", "主要现实领域"],
    ["rhythm", "阶段节奏"],
    ["gainsAndCosts", "可以获得什么，需要付出什么"],
    ["verification", "现实验证点"],
  ],
  year: [
    ["stageSummary", "年度总判"],
    ["natalReception", "大运背景"],
    ["mechanism", "今年新增的作用"],
    ["primaryDomains", "最强现实落点"],
    ["gainsAndCosts", "机会与压力"],
    ["rhythm", "今年适合推进与不宜勉强"],
    ["verification", "现实验证点"],
  ],
  month: [
    ["stageSummary", "本月主线"],
    ["natalReception", "承接年度背景"],
    ["mechanism", "本月新增触发"],
    ["primaryDomains", "现实落点"],
    ["rhythm", "行动节奏"],
    ["gainsAndCosts", "需要留意"],
  ],
};

export function buildStageFixedReportModel({
  stage = "luck",
  item = {},
  natalImageReport,
  luckImageReport,
  yearImageReport,
  monthImageReport,
  baseBaziViewModel,
} = {}) {
  const normalizedStage = STAGE_LABELS[stage] ? stage : "luck";

  const initialSemantic = buildStageSemanticContext({
    stage: normalizedStage,
    item,
    baseBaziViewModel,
    natalImageReport,
  });

  const domainScan = buildStageDomainScan({
    stage: normalizedStage,
    item,
    semanticContext: initialSemantic,
  });

  const stageRulePack = buildStageRulePack({
    stage: normalizedStage,
    item,
    natalImageReport,
    luckImageReport,
    yearImageReport,
    monthImageReport,
    domainKeys: domainScan.primaryDomains.map((entry) => entry.key),
  });

  const semanticContext = buildStageSemanticContext({
    stage: normalizedStage,
    item,
    baseBaziViewModel,
    natalImageReport,
    stageRulePack,
  });

  const target = buildTarget(normalizedStage, item);
  const theme =
    item?.triggerImages?.storyPack?.themeHierarchy ??
    item?.triggerImages?.themeHierarchy ??
    {};
  const primary = compactTheme(theme?.primary);
  const supporting = compactTheme(theme?.supporting);
  const facts = collectFacts(item);
  const structures = facts
    .filter((fact) => ["direct", "combination"].includes(fact.category))
    .slice(0, 4)
    .map((fact) => fact.text || fact.label)
    .filter(Boolean);

  const primaryDomains = enrichDomains(
    domainScan.primaryDomains,
    stageRulePack.matchedRules,
    semanticContext.structuralSignals,
  );
  const secondaryDomains = enrichDomains(
    domainScan.secondaryDomains,
    stageRulePack.matchedRules,
    semanticContext.structuralSignals,
  );

  const headline = buildHeadline(
    normalizedStage,
    target,
    primary,
    primaryDomains,
  );
  const overview = buildOverview(
    normalizedStage,
    primary,
    supporting,
    primaryDomains,
    structures,
  );

  const mechanism = {
    primary,
    supporting,
    structures: unique([
      ...facts
        .filter((fact) =>
          fact.status === "direct" ||
          fact.category === "direct"
        )
        .slice(0, normalizedStage === "luck" ? 4 : 3)
        .map((fact) => fact.text || fact.label),
      ...structures,
      ...semanticContext.hierarchyRelations
        .map((relation) => `${relation.text}${relation.interpretation}`),
    ]).slice(0, 6),
    summary: buildMechanismSummary({
      primary,
      supporting,
      hierarchyRelations: semanticContext.hierarchyRelations,
    }),
  };

  const opportunities = unique([
    ...primaryDomains.flatMap((entry) => entry.usefulDirections),
    ...stageRulePack.matchedRules
      .filter((rule) => rule.claimSupportAllowed)
      .flatMap((rule) => rule.imagery?.positive ?? []),
  ]).slice(0, normalizedStage === "luck" ? 4 : 3);

  const pressures = unique([
    ...primaryDomains.flatMap((entry) => entry.pressureSignals),
    ...stageRulePack.matchedRules
      .filter((rule) => rule.claimSupportAllowed)
      .flatMap((rule) => rule.imagery?.negative ?? []),
  ]).slice(0, normalizedStage === "luck" ? 4 : 3);

  const actions = unique([
    ...primaryDomains.flatMap((entry) => entry.actions),
    ...stageRulePack.matchedRules
      .filter((rule) => rule.claimSupportAllowed)
      .flatMap((rule) => rule.advice ?? []),
  ]).slice(0, normalizedStage === "luck" ? 4 : 3);

  const verificationQuestions = unique([
    ...primaryDomains.flatMap((entry) => entry.realityChecks),
    ...semanticContext.structuralSignals
      .flatMap((signal) => signal.conditions),
    ...stageRulePack.matchedRules
      .filter((rule) => rule.claimSupportAllowed)
      .flatMap((rule) => rule.imagery?.realityChecks ?? []),
  ]).slice(0, normalizedStage === "month" ? 3 : 5);

  const contextSummary = buildContextSummary(
    normalizedStage,
    item,
    baseBaziViewModel,
  );

  const sections = buildSections({
    stage: normalizedStage,
    headline,
    overview,
    contextSummary,
    mechanism,
    primaryDomains,
    secondaryDomains,
    opportunities,
    pressures,
    actions,
    verificationQuestions,
  });

  return {
    schemaVersion: "stage-fixed-report-v8.5.2",
    stage: normalizedStage,
    stageLabel: STAGE_LABELS[normalizedStage],
    target,
    headline,
    overview,
    contextSummary,
    themeHierarchy: { primary, supporting },
    mechanism,
    primaryDomains,
    secondaryDomains,
    opportunities,
    pressures,
    actions,
    verificationQuestions,
    evidenceSummary: {
      directFactCount: facts.filter((fact) => fact.status === "direct").length,
      combinationFactCount: facts.filter((fact) => fact.category === "combination").length,
      factIds: facts.map((fact) => fact.id).filter(Boolean).slice(0, 20),
      structures,
    },
    semanticContext: {
      combinationDiagnostics: semanticContext.combinationDiagnostics,
      hierarchyRelations: semanticContext.hierarchyRelations,
      structuralSignals: semanticContext.structuralSignals,
      relationshipEvidence: semanticContext.relationshipEvidence,
      temporalEvidence: semanticContext.temporalEvidence,
      allowedNamedPatterns: semanticContext.allowedNamedPatterns,
      forbiddenNamedPatterns: KNOWN_NAMED_PATTERNS.filter(
        (name) => !semanticContext.allowedNamedPatterns.includes(name),
      ),
      wordingRules: semanticContext.wordingRules,
    },
    stageRulePack,
    sections,
    reportRules: [
      "先讲确定主象，再讲证据最强的现实落点，最多补充一个替代分支。",
      "大运讲长期任务与持续作用，不代替流年断具体事件。",
      "流年讲当年新增作用，不重复完整大运。",
      "流月讲短期执行与落点，不上升成长期结论。",
      "日干被合不等同夫妻宫被合动；时干被合不等同整个时柱或时支被合。",
      "没有逐年逐月证据时，不切分前中后期或年初年中年末。",
      "命名格局或组合只有在硬事实、规则标题或来源事实明确出现时才能使用。",
    ],
  };
}

export function buildStageDomainScan({
  stage = "luck",
  item = {},
  semanticContext = {},
} = {}) {
  const normalizedStage = STAGE_LABELS[stage] ? stage : "luck";
  const limits = LIMITS[normalizedStage];
  const story = item?.triggerImages?.storyPack ?? {};

  const sources = [
    ...annotate(story.directTriggers, 12),
    ...annotate(story.hierarchyInteractions, 9),
    ...annotate(story.convergence, 8),
    ...annotate(story.background, 4),
    ...annotate(story.conditionalPatterns, 1),
  ];

  const groups = new Map();

  for (const source of sources) {
    const keys = unique([
      source.domain,
      ...array(source.domains),
    ]).map(normalizeDomain);

    for (const key of keys) {
      if (!key || key === "general") continue;
      const entry = groups.get(key) ?? createDomainEntry(key);
      const currentLayer = isCurrentLayer(source, normalizedStage);
      entry.score +=
        source._weight +
        (currentLayer ? 4 : 0) +
        Number(source.strength || 0) / 20;
      entry.currentLayerEvidenceCount += currentLayer ? 1 : 0;
      entry.threadCount += 1;
      entry.summaries.push(source.summary || source.trigger || source.label);
      entry.possibleScenes.push(...array(source.possibleScenes));
      entry.usefulDirections.push(...array(source.usefulDirections));
      entry.pressureSignals.push(...array(source.pressureSignals));
      entry.realityChecks.push(...array(source.conditions));
      entry.evidenceRefs.push(...array(source.evidenceRefs));
      groups.set(key, entry);
    }
  }

  for (const signal of array(semanticContext.structuralSignals)) {
    const candidates = [
      ...array(signal.primaryCandidates),
      ...array(signal.alternativeCandidates),
    ];
    candidates.forEach((candidate, index) => {
      const key = normalizeDomain(candidate.domain);
      if (!key || key === "general") return;
      const entry = groups.get(key) ?? createDomainEntry(key);
      const weight = Math.max(1, Number(candidate.score || 0) - index);
      entry.score += weight;
      entry.currentLayerEvidenceCount += signal.certainty === "direct" ? 1 : 0;
      entry.threadCount += 1;
      entry.summaries.push(signal.coreImage);
      entry.possibleScenes.push(candidate.reason);
      entry.realityChecks.push(...array(signal.conditions));
      entry.boundaries.push(signal.boundary);
      entry.signalIds.push(signal.id);
      groups.set(key, entry);
    });
  }

  const sorted = [...groups.values()]
    .map(finalizeDomain)
    .sort((a, b) =>
      b.currentLayerEvidenceCount - a.currentLayerEvidenceCount ||
      b.score - a.score ||
      b.threadCount - a.threadCount
    );

  let eligible = sorted;
  if (["year", "month"].includes(normalizedStage)) {
    const current = sorted.filter((entry) => entry.currentLayerEvidenceCount > 0);
    if (current.length) eligible = current;
  }

  const primaryDomains = eligible.slice(0, limits.max);

  if (primaryDomains.length < limits.min && normalizedStage !== "month") {
    for (const key of ["career", "self", "wealth", "relationship"]) {
      if (primaryDomains.length >= limits.min) break;
      if (primaryDomains.some((entry) => entry.key === key)) continue;
      primaryDomains.push({
        ...finalizeDomain(createDomainEntry(key)),
        summary: "当前阶段在这一领域存在基础主题，但仍需结合现实情况复核。",
        certainty: "background",
      });
    }
  }

  const primaryKeys = new Set(primaryDomains.map((entry) => entry.key));
  return {
    stage: normalizedStage,
    primaryDomains,
    secondaryDomains: sorted
      .filter((entry) => !primaryKeys.has(entry.key))
      .slice(0, normalizedStage === "luck" ? 3 : 2),
    hasCurrentLayerSignal: primaryDomains.some(
      (entry) => entry.currentLayerEvidenceCount > 0,
    ),
    stableContinuation:
      normalizedStage === "month" &&
      !primaryDomains.some((entry) => entry.currentLayerEvidenceCount > 0),
  };
}

export function renderStageFixedReportMarkdown(model = {}) {
  if (!model?.sections?.length) return "";

  const target = [
    model?.target?.label,
    model?.target?.ganZhi,
  ].filter(Boolean).join(" · ");

  return [
    target ? `# ${target}` : "",
    ...model.sections.flatMap((section) => [
      `## ${section.title}`,
      section.summary || "",
      ...array(section.items).map((item) => `- ${item}`),
      "",
    ]),
  ]
    .filter((line, index, all) =>
      line !== "" ||
      (index > 0 && all[index - 1] !== "")
    )
    .join("\n")
    .trim();
}

function buildSections(payload) {
  const {
    stage,
    headline,
    overview,
    contextSummary,
    mechanism,
    primaryDomains,
    secondaryDomains,
    opportunities,
    pressures,
    actions,
    verificationQuestions,
  } = payload;

  const sections = {
    stageSummary: {
      summary: headline,
      items: [overview],
    },
    natalReception: {
      summary: contextSummary,
      items: [],
    },
    mechanism: {
      summary: mechanism.summary,
      items: mechanism.structures,
    },
    primaryDomains: {
      summary: primaryDomains.length
        ? `本阶段优先观察：${primaryDomains.map((entry) => entry.label).join("、")}。`
        : "当前层没有足够强的新增显像，以背景延续和现实反馈为主。",
      items: primaryDomains.map((entry) => {
        const alternative = entry.alternativeScenarios?.[0]
          ? `；其他可能：${entry.alternativeScenarios[0]}`
          : "";
        return `${entry.label}：${entry.summary}${alternative}`;
      }),
    },
    rhythm: {
      summary: rhythmSummary(stage),
      items: actions,
    },
    gainsAndCosts: {
      summary: opportunities.length || pressures.length
        ? "同一股力量通常同时带来可利用方向与现实代价。"
        : "当前证据更适合观察，不宜预设吉凶。",
      items: [
        ...opportunities.map((item) => `可利用：${item}`),
        ...pressures.map((item) => `需控制：${item}`),
      ],
    },
    verification: {
      summary: "以下问题用于确认候选象是否真正落到现实。",
      items: verificationQuestions,
    },
  };

  if (stage === "luck" && secondaryDomains.length) {
    sections.primaryDomains.items.push(
      ...secondaryDomains.map((entry) =>
        `次要观察｜${entry.label}：${entry.summary}`,
      ),
    );
  }

  return SECTION_TITLES[stage].map(([key, title]) => ({
    key,
    title,
    summary: sections[key]?.summary ?? "",
    items: unique(sections[key]?.items ?? [])
      .slice(0, stage === "luck" ? 6 : 4),
  }));
}

function buildHeadline(stage, target, primary, domains) {
  const targetText = target.ganZhi || target.label || STAGE_LABELS[stage];
  const primaryText = primary?.tenGod || primary?.label || "阶段主线";
  const domainText = domains
    .map((entry) => entry.label)
    .slice(0, 2)
    .join("、");

  if (stage === "luck") {
    return `${targetText}大运的主线是${primaryText}逐步进入现实，当前更支持落在${domainText || "个人选择与现实承接"}。`;
  }
  if (stage === "year") {
    return `${targetText}流年在当前大运中放大${primaryText}，今年更值得观察${domainText || "新增作用与现实调整"}。`;
  }
  return `${targetText}流月是短期执行层，${primaryText}更容易集中显现在${domainText || "具体事务"}。`;
}

function buildOverview(stage, primary, supporting, domains, structures) {
  const p =
    primary?.summary ||
    primary?.trigger ||
    "外显主题需要结合事实复核";
  const s =
    supporting?.summary ||
    supporting?.trigger ||
    "现实承接仍需观察";
  const d = domains.map((entry) => entry.label).join("、");
  const st = structures.length
    ? `当前最强结构为${structures.slice(0, 2).join("；")}。`
    : "";

  if (stage === "luck") {
    return `这步运不是单一十神的十年，而是${p}，并由${s}承接。${d ? `长期重点目前更支持落在${d}。` : ""}${st}`;
  }
  if (stage === "year") {
    return `今年需要放在大运背景中看：${p}，现实层由${s}承接。${d ? `年度显像目前更支持落在${d}。` : ""}${st}`;
  }
  return `本月只看年度背景上的新增触发：${p}，现实执行由${s}承接。${d ? `短期落点目前更支持${d}。` : ""}${st}`;
}

function buildContextSummary(stage, item, viewModel) {
  const natal = array(viewModel?.pillars)
    .map((pillar) => pillar?.ganZhi || pillar?.label)
    .filter(Boolean)
    .join(" ");

  if (stage === "luck") {
    return `${natal ? `原局为${natal}。` : ""}大运只决定长期背景，需观察它怎样持续引动原局已有结构；具体年份仍交给流年判断。`;
  }
  if (stage === "year") {
    return `今年必须放在${item?.currentLuckItem?.ganZhi || "当前大运"}中理解：大运提供背景，流年负责新增触发与年度落点。`;
  }
  return `本月承接${item?.currentLuckItem?.ganZhi || "当前大运"}与${item?.yearItem?.ganZhi || "当前流年"}的既有主线，只解释短期执行、调整和落点。`;
}

function buildMechanismSummary({
  primary,
  supporting,
  hierarchyRelations,
}) {
  return unique([
    primary?.summary || primary?.trigger,
    supporting?.summary || supporting?.trigger,
    ...hierarchyRelations.map((relation) =>
      `${relation.text}${relation.interpretation}`,
    ),
  ])
    .filter(Boolean)
    .join("；") ||
    "当前作用链需要结合原局与现实反馈继续复核。";
}

function rhythmSummary(stage) {
  if (stage === "luck") {
    return "大运只按进入、持续、退出三种阶段理解；没有逐年证据时，不自行编造前期、中期、后期的具体年份。";
  }
  if (stage === "year") {
    return "今年适合顺着最强主线推进，证据不足的领域保持观察；没有流月证据时，不写年初、年中、年末或上下半年。";
  }
  return "流月篇幅应短，重点是本月推进、调整、收尾或观察，不上升为长期人生结论。";
}

function enrichDomains(domains, rules, signals) {
  return domains.map((domain) => {
    const relatedRules = rules.filter((rule) =>
      array(rule.domains)
        .map(normalizeDomain)
        .includes(domain.key),
    );

    const relatedSignals = signals.filter((signal) =>
      [
        ...array(signal.primaryCandidates),
        ...array(signal.alternativeCandidates),
      ].some((candidate) =>
        normalizeDomain(candidate.domain) === domain.key,
      ),
    );

    const coreImages = unique(
      relatedSignals.map((signal) => signal.coreImage),
    );

    const alternativeScenarios = unique(
      relatedSignals.flatMap((signal) =>
        [
          ...array(signal.primaryCandidates),
          ...array(signal.alternativeCandidates),
        ]
          .filter((candidate) =>
            normalizeDomain(candidate.domain) !== domain.key,
          )
          .slice(0, 2)
          .map((candidate) =>
            `${candidate.label}（${candidate.reason}）`,
          ),
      ),
    ).slice(0, 2);

    const mainSummary =
      coreImages[0] ||
      domain.summary ||
      relatedRules.flatMap((rule) => rule.imagery?.core ?? [])[0] ||
      "当前阶段在这一领域存在值得复核的主题。";

    return {
      ...domain,
      label: STAGE_DOMAIN_LABELS[domain.key] || domain.label || domain.key,
      ruleIds: relatedRules.map((rule) => rule.id).slice(0, 6),
      ruleTitles: relatedRules.map((rule) => rule.title).slice(0, 4),
      summary:
        `确定主象：${mainSummary}。` +
        `当前更支持落在${STAGE_DOMAIN_LABELS[domain.key] || domain.label || domain.key}，但不是唯一结果。`,
      mainScenario:
        domain.possibleScenes?.[0] ||
        relatedSignals.flatMap((signal) =>
          signal.primaryCandidates
            .filter((candidate) =>
              normalizeDomain(candidate.domain) === domain.key,
            )
            .map((candidate) => candidate.reason),
        )[0] ||
        "",
      alternativeScenarios,
      conditions: unique([
        ...domain.realityChecks,
        ...relatedSignals.flatMap((signal) => signal.conditions),
      ]).slice(0, 3),
      boundaries: unique([
        ...array(domain.boundaries),
        ...relatedSignals.map((signal) => signal.boundary),
      ]).filter(Boolean).slice(0, 3),
      actions: unique([
        ...domain.actions,
        ...relatedRules.flatMap((rule) => rule.advice ?? []),
      ]).slice(0, 3),
      realityChecks: unique([
        ...domain.realityChecks,
        ...relatedSignals.flatMap((signal) => signal.conditions),
        ...relatedRules.flatMap((rule) =>
          rule.imagery?.realityChecks ?? [],
        ),
      ]).slice(0, 3),
    };
  });
}

function collectFacts(item) {
  return array(item?.transitStructure?.facts)
    .map((fact) => ({
      id: fact?.id ?? "",
      label: fact?.label ?? "",
      text: fact?.text ?? "",
      category: fact?.category ?? "",
      status: fact?.status ?? "",
      strength: Number(fact?.strength || 0),
      domains: array(fact?.domains),
    }))
    .sort((a, b) => b.strength - a.strength)
    .slice(0, 20);
}

function annotate(value, weight) {
  return array(value)
    .filter(Boolean)
    .map((thread) => ({
      ...thread,
      _weight: weight,
    }));
}

function isCurrentLayer(thread, stage) {
  return (
    [stage, "current"].includes(
      String(thread?.sourceLevel || "").toLowerCase(),
    ) ||
    String(thread?.status || "").toLowerCase() === "direct" ||
    String(thread?.certainty || "").toLowerCase() === "direct"
  );
}

function createDomainEntry(key) {
  return {
    key,
    label: STAGE_DOMAIN_LABELS[key] || key,
    score: 0,
    currentLayerEvidenceCount: 0,
    threadCount: 0,
    summaries: [],
    possibleScenes: [],
    usefulDirections: [],
    pressureSignals: [],
    realityChecks: [],
    actions: [],
    evidenceRefs: [],
    boundaries: [],
    signalIds: [],
  };
}

function finalizeDomain(entry) {
  return {
    key: entry.key,
    label: STAGE_DOMAIN_LABELS[entry.key] || entry.label || entry.key,
    score: Math.round(entry.score * 10) / 10,
    currentLayerEvidenceCount: entry.currentLayerEvidenceCount,
    threadCount: entry.threadCount,
    summary:
      unique(entry.summaries)[0] ||
      "当前阶段在这一领域存在值得观察的主题。",
    possibleScenes: unique(entry.possibleScenes).slice(0, 4),
    usefulDirections: unique(entry.usefulDirections).slice(0, 3),
    pressureSignals: unique(entry.pressureSignals).slice(0, 3),
    realityChecks: unique(entry.realityChecks).slice(0, 3),
    actions: unique(entry.usefulDirections).slice(0, 3),
    evidenceRefs: unique(entry.evidenceRefs).slice(0, 10),
    boundaries: unique(entry.boundaries).filter(Boolean).slice(0, 3),
    signalIds: unique(entry.signalIds).slice(0, 10),
    certainty:
      entry.currentLayerEvidenceCount > 0
        ? "current"
        : "background",
  };
}

function buildTarget(stage, item) {
  if (stage === "luck") {
    return {
      label:
        item?.dateRangeLabel ||
        item?.yearRange ||
        item?.ageRange ||
        "当前大运",
      ganZhi: item?.ganZhi || "",
      ageRange: item?.ageRange || "",
      yearRange: item?.yearRange || "",
      dateRangeLabel: item?.dateRangeLabel || "",
    };
  }

  if (stage === "year") {
    return {
      label: item?.year ? `${item.year}年` : "当前流年",
      ganZhi: item?.ganZhi || "",
      year: Number(item?.year) || null,
    };
  }

  return {
    label: [
      item?.year ? `${item.year}年` : "",
      item?.flowMonthLabel || "",
      item?.dateRangeLabel || "",
    ]
      .filter(Boolean)
      .join(" "),
    ganZhi: item?.ganZhi || "",
    year: Number(item?.year) || null,
    month: Number(item?.month || item?.flowMonthIndex) || null,
  };
}

function compactTheme(theme) {
  if (!theme || typeof theme !== "object") return null;
  return {
    tenGod: theme.tenGod || "",
    label: theme.label || "",
    summary: theme.summary || "",
    trigger: theme.trigger || "",
    sourceLevel: theme.sourceLevel || "",
    evidenceRefs: unique(theme.evidenceRefs),
  };
}

function normalizeDomain(value) {
  const key = String(value || "").trim();
  if (!key) return "";
  if (key === "spouse") return "relationship";
  if (key === "health_state") return "health";
  if (key === "fortune") return "general";
  return key;
}

function array(value) {
  return Array.isArray(value)
    ? value
    : value === null || value === undefined
      ? []
      : [value];
}

function unique(value) {
  return [...new Set(array(value).filter(Boolean))];
}
