const stageLabels = {
  luck: "大运",
  year: "流年",
  month: "流月",
};

const certaintyOrder = {
  direct: 0,
  combined: 1,
  background: 2,
  conditional: 9,
};

const statusOrder = {
  direct: 0,
  inferred: 1,
  background: 2,
  condition_only: 8,
  unresolved: 9,
  arch_condition: 10,
};

export function buildStageAiTrustedPack({
  stage = "luck",
  item = {},
  currentLuckItem = null,
  yearItem = null,
  baseBaziViewModel = {},
  natalImageReport = {},
} = {}) {
  const normalizedStage = stageLabels[stage] ? stage : "luck";
  const triggerImages = object(item?.triggerImages);
  const storyPack = object(triggerImages?.storyPack);
  const themeHierarchy = object(
    storyPack?.themeHierarchy ||
    triggerImages?.themeHierarchy,
  );
  const structureFacts = array(item?.transitStructure?.facts);
  const threadIndex = new Map(
    array(storyPack?.sceneThreads)
      .map((thread) => [String(thread?.id || ""), thread])
      .filter(([id]) => id),
  );

  const evidenceFacts = structureFacts
    .map(compactFact)
    .filter((fact) => fact.id && fact.text)
    .sort((left, right) =>
      statusOrder[left.status] - statusOrder[right.status] ||
      Number(right.strength || 0) - Number(left.strength || 0),
    )
    .slice(0, 20);

  const domainEvidenceCandidates = compactDomainEvidenceCandidates(
    item?.domainSignals,
  );

  const compactStoryPack = {
    schemaVersion: String(storyPack?.schemaVersion || "stage-story-v2"),
    themeHierarchy: {
      primary: compactThread(themeHierarchy?.primary),
      supporting: compactThread(themeHierarchy?.supporting),
      concentrated: Boolean(themeHierarchy?.concentrated),
      instruction: text(themeHierarchy?.instruction),
    },
    background: compactThreadList(storyPack?.background, 2),
    directTriggers: compactThreadList(storyPack?.directTriggers, 4),
    hierarchyInteractions: compactThreadList(storyPack?.hierarchyInteractions, 3),
    convergence: compactThreadList(storyPack?.convergence, 3),
    conditionalPatterns: compactThreadList(storyPack?.conditionalPatterns, 3)
      .map((thread) => ({
        ...thread,
        usage: "只能作为辅助趋势或待验证条件，不得作为标题、主结论或已发生事件。",
      })),
    storyOrder: buildResolvedStoryOrder(
      storyPack?.storyOrder,
      threadIndex,
    ),
    narrationRules: unique([
      ...array(storyPack?.narrationRules),
      "先讲天干外显主线，再讲地支现实承接，不得把两个十神平均展开。",
      "条件事实必须降级处理，只能放在辅助趋势或复核问题中。",
      "直接触发用于描述发展，层级关系用于描述转折，多层汇合用于描述现实落点。",
      "同一条事实只讲一次，不得在事业、感情、财务等章节重复复述。",
    ]).slice(0, 10),
    unknowns: unique([
      ...array(storyPack?.unknowns),
      "尚未单独确认原局喜忌、调候与制化，不能把加力直接等同为吉，把冲克直接等同为凶。",
    ]).slice(0, 8),
    forbiddenClaims: unique([
      ...array(storyPack?.forbiddenClaims),
      "不得把地支主气十神与天干十神无主次地平均展开",
      "不得用条件组合推导确定事件",
      "不得凭空补充事实包中不存在的冲合刑害破、伏吟、天克地冲或宫位触发",
    ]).slice(0, 10),
  };

  const allowedEvidenceRefs = unique([
    ...evidenceFacts.map((fact) => fact.id),
    ...collectThreadRefs(compactStoryPack),
    ...collectDomainEvidenceRefs(domainEvidenceCandidates),
  ]);

  return {
    schemaVersion: "stage-ai-trusted-v1",
    stage: normalizedStage,
    stageLabel: stageLabels[normalizedStage],
    target: buildTarget(normalizedStage, item),
    context: {
      natal: compactNatalContext(baseBaziViewModel, natalImageReport),
      luck: compactLuck(
        item?.currentLuckItem ||
        currentLuckItem ||
        (normalizedStage === "luck" ? item : null),
      ),
      year: compactYear(
        item?.yearItem ||
        yearItem ||
        (normalizedStage === "year" ? item : null),
      ),
      month: normalizedStage === "month"
        ? compactMonth(item)
        : null,
    },
    themeHierarchy: compactStoryPack.themeHierarchy,
    storyPack: compactStoryPack,
    domainEvidenceCandidates,
    evidenceFacts,
    allowedEvidenceRefs,
    outputRules: [
      "所有判断必须能回指 themeHierarchy、storyPack、domainEvidenceCandidates 或 evidenceFacts。",
      "主线、发展、转折、落点必须按 storyOrder 组织。",
      "domainEvidenceCandidates 只是浏览器收集的候选证据索引，不是领域排名、吉凶评分或最终结论。",
      "必须由 AI 独立逐项分析十二领域，不得照搬前端旧分数、旧主线或旧副线。",
      "候选领域没有直接证据时，可以结合原局和上下层背景写为证据较弱，但不得虚构事实。",
      "桃花、贵人、驿马、藏干等辅助事实不能单独推出确定事件。",
      "具体场景只能写成较可能、容易表现为、可观察，不得写成必然发生。",
      "条件组合不得进入一句话总览和主要结论。",
      "没有直接触发时，应明确写成背景延续或证据不足，不得硬造事件。",
    ],
  };
}

function buildResolvedStoryOrder(rawOrder, threadIndex) {
  const order = object(rawOrder);
  const resolve = (values) => array(values)
    .map((id) => threadIndex.get(String(id || "")))
    .filter(Boolean)
    .map(compactThread)
    .filter(Boolean);

  return {
    opening: resolve(order.opening),
    development: resolve(order.development),
    turn: resolve(order.turn),
    landing: resolve(order.landing),
  };
}

function compactThreadList(values, limit) {
  return array(values)
    .map(compactThread)
    .filter(Boolean)
    .sort((left, right) =>
      certaintyOrder[left.certainty] - certaintyOrder[right.certainty] ||
      Number(right.strength || 0) - Number(left.strength || 0),
    )
    .slice(0, limit);
}

function compactThread(thread) {
  if (!thread || typeof thread !== "object") return null;
  return {
    id: text(thread.id),
    factId: text(thread.factId),
    tenGod: text(thread.tenGod),
    sourceLevel: text(thread.sourceLevel),
    themeRank: Number(thread.themeRank || 99),
    narrativePriority: text(thread.narrativePriority),
    layerRole: text(thread.layerRole),
    label: text(thread.label),
    domain: text(thread.domain),
    domainLabel: text(thread.domainLabel),
    domains: unique(array(thread.domains)),
    certainty: text(thread.certainty || "background"),
    status: text(thread.status),
    polarity: text(thread.polarity || "mixed"),
    trigger: shortText(thread.trigger, 100),
    summary: shortText(thread.summary, 180),
    possibleScenes: unique(array(thread.possibleScenes)).slice(0, 4),
    usefulDirections: unique(array(thread.usefulDirections)).slice(0, 3),
    pressureSignals: unique(array(thread.pressureSignals)).slice(0, 3),
    conditions: unique(array(thread.conditions)).slice(0, 3),
    evidenceRefs: unique(array(thread.evidenceRefs)),
    strength: Number(thread.strength || 0),
  };
}

function compactFact(fact) {
  return {
    id: text(fact?.id),
    label: text(fact?.label),
    text: shortText(fact?.text, 180),
    category: text(fact?.category || "direct"),
    status: text(fact?.status || "direct"),
    source: text(fact?.source),
    polarity: text(fact?.polarity || "mixed"),
    strength: Number(fact?.strength || 0),
    domains: unique(array(fact?.domains)),
  };
}

function buildTarget(stage, item) {
  if (stage === "luck") {
    return {
      ganZhi: text(item?.ganZhi),
      ageRange: text(item?.ageRange),
      yearRange: text(item?.yearRange),
    };
  }
  if (stage === "year") {
    return {
      year: numberOrNull(item?.year),
      ganZhi: text(item?.ganZhi),
    };
  }
  return {
    year: numberOrNull(item?.year),
    month: numberOrNull(item?.month || item?.flowMonthIndex),
    flowMonthLabel: text(item?.flowMonthLabel),
    dateRangeLabel: text(item?.dateRangeLabel),
    ganZhi: text(item?.ganZhi),
  };
}

function compactLuck(item) {
  if (!item) return null;
  return {
    ganZhi: text(item?.ganZhi),
    ageRange: text(item?.ageRange),
    yearRange: text(item?.yearRange),
    tenGod: text(item?.tenGod || item?.stemTenGod),
    branchTenGod: text(item?.branchTenGod || item?.branchMainTenGod),
  };
}

function compactYear(item) {
  if (!item) return null;
  return {
    year: numberOrNull(item?.year),
    ganZhi: text(item?.ganZhi),
    stemTenGod: text(item?.stemTenGod || item?.tenGod),
    branchTenGod: text(item?.branchTenGod || item?.branchMainTenGod),
  };
}

function compactMonth(item) {
  if (!item) return null;
  return {
    year: numberOrNull(item?.year),
    month: numberOrNull(item?.month || item?.flowMonthIndex),
    flowMonthLabel: text(item?.flowMonthLabel),
    dateRangeLabel: text(item?.dateRangeLabel),
    ganZhi: text(item?.ganZhi),
    stemTenGod: text(item?.stemTenGod || item?.tenGod),
    branchTenGod: text(item?.branchTenGod || item?.branchMainTenGod),
  };
}

function compactNatalContext(viewModel, natalReport) {
  return {
    gender: text(viewModel?.birthInfo?.gender || "unknown"),
    pillars: array(viewModel?.pillars).map((pillar) => ({
      key: text(pillar?.key),
      name: text(pillar?.name || pillar?.label),
      stem: text(pillar?.stem),
      branch: text(pillar?.branch),
      ganZhi: text(pillar?.pillar || pillar?.ganZhi || pillar?.label),
      stemTenGod: text(pillar?.stemTenGod),
      branchMainTenGod: text(pillar?.branchMainTenGod),
      hiddenStems: array(pillar?.hiddenStems).slice(0, 3).map((hidden) => ({
        stem: text(hidden?.stem),
        tenGod: text(hidden?.tenGod),
        role: text(hidden?.role),
      })),
      shensha: array(pillar?.shensha).slice(0, 6).map((item) => ({
        name: text(item?.name),
        category: text(item?.category),
      })),
    })),
    fiveElements: viewModel?.fiveElements || null,
    structureAnalysis: viewModel?.structureAnalysis || null,
    summary: natalReport?.summary || null,
    imageCards: array(natalReport?.imageCards)
      .slice(0, 10)
      .map((card) => ({
        id: text(card?.id),
        title: text(card?.title),
        image: shortText(card?.image || card?.summary, 150),
        evidence: unique(array(card?.evidence)).slice(0, 5),
      })),
  };
}

function compactDomainEvidenceCandidates(value) {
  const source = object(value);
  const domains = array(source?.domains).map((entry) => {
    const directFacts = compactDomainEvidence(entry?.directFacts, 5);
    const supportingFacts = compactDomainEvidence(entry?.supportingFacts, 5);
    const counterFacts = compactDomainEvidence(entry?.counterFacts, 4);
    const hiddenStemSignals = compactDomainEvidence(entry?.hiddenStemSignals, 4);
    const auxiliarySignals = compactDomainEvidence(entry?.auxiliarySignals, 4);
    const palaceTriggers = compactDomainEvidence(entry?.palaceTriggers, 4);
    const evidenceIds = unique([
      ...array(entry?.evidenceIds),
      ...directFacts.map((fact) => fact.id),
      ...supportingFacts.map((fact) => fact.id),
      ...counterFacts.map((fact) => fact.id),
      ...hiddenStemSignals.map((fact) => fact.id),
      ...auxiliarySignals.map((fact) => fact.id),
      ...palaceTriggers.map((fact) => fact.id),
    ]);

    return {
      domain: text(entry?.domain),
      label: text(entry?.label),
      evidenceStatus: evidenceIds.length
        ? "has_candidates"
        : "no_direct_candidate",
      directFacts,
      supportingFacts,
      counterFacts,
      hiddenStemSignals,
      auxiliarySignals,
      palaceTriggers,
      evidenceIds,
    };
  });

  if (!domains.length) return null;

  return {
    schemaVersion: "stage-domain-evidence-candidates-v1",
    checkedDomainCount: Number(
      source?.checkedDomainCount ||
      domains.length,
    ),
    domains,
    boundaries: unique([
      ...array(source?.boundaries),
      "候选证据只说明该事实可能涉及某领域，不表示领域强弱、吉凶或主次。",
      "同一事实可能被多个领域引用，AI必须自行去重并判断主落点与延伸落点。",
    ]).slice(0, 8),
  };
}

function compactDomainEvidence(values, limit) {
  return array(values).slice(0, limit).map((entry) => ({
    id: text(entry?.id),
    type: text(entry?.type),
    source: text(entry?.source),
    status: text(entry?.status),
    polarity: text(entry?.polarity),
    strength: Number(entry?.strength || 0),
    text: shortText(entry?.text, 200),
    originalFactId: text(entry?.originalFactId),
  }));
}

function collectDomainEvidenceRefs(domainEvidenceCandidates) {
  return array(domainEvidenceCandidates?.domains).flatMap((entry) =>
    array(entry?.evidenceIds),
  );
}

function collectThreadRefs(storyPack) {
  return [
    ...array(storyPack?.background),
    ...array(storyPack?.directTriggers),
    ...array(storyPack?.hierarchyInteractions),
    ...array(storyPack?.convergence),
    ...array(storyPack?.conditionalPatterns),
  ].flatMap((thread) => array(thread?.evidenceRefs));
}

function numberOrNull(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
}

function shortText(value, maxLength = 160) {
  const normalized = text(value).replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, Math.max(0, maxLength - 1))}…`;
}

function text(value) {
  return value === undefined || value === null ? "" : String(value).trim();
}

function unique(values) {
  return [...new Set(array(values).map(text).filter(Boolean))];
}

function array(value) {
  return Array.isArray(value) ? value : value === undefined || value === null ? [] : [value];
}

function object(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}
