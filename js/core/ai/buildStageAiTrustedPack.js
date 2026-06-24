const STAGE_LABELS = {
  luck: "大运",
  year: "流年",
  month: "流月",
};

const STATUS_ORDER = {
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
  const normalizedStage = STAGE_LABELS[stage] ? stage : "luck";

  const relationFacts = array(item?.transitStructure?.facts)
    .map(compactRelationFact)
    .filter((fact) => fact.id && fact.rawText)
    .sort((left, right) =>
      (STATUS_ORDER[left.status] ?? 99) -
      (STATUS_ORDER[right.status] ?? 99)
    )
    .slice(0, 100);

  const stageImages = compactStageImages(item?.triggerImages);

  const natalImages = array(natalImageReport?.imageCards)
    .map(compactNatalImage)
    .filter(Boolean);

  const allowedEvidenceRefs = unique([
    ...relationFacts.map((fact) => fact.id),
    ...stageImages.flatMap((entry) => [
      entry.id,
      ...entry.evidenceRefs,
    ]),
    ...natalImages.map((entry) => entry.id),
  ]);

  return {
    schemaVersion: "stage-ai-source-v2",
    stage: normalizedStage,
    stageLabel: STAGE_LABELS[normalizedStage],
    target: buildTarget(normalizedStage, item),

    factualContext: {
      natal: compactNatalFacts(baseBaziViewModel),
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

    relationFacts,

    candidateInterpretations: {
      natalStructure: baseBaziViewModel?.structureAnalysis ?? null,
      natalSummary: natalImageReport?.summary ?? null,
      natalImages,
      stageImages,
    },

    allowedEvidenceRefs,

    boundaries: [
      "factualContext 与 relationFacts 是当前报告的事实基础。",
      "candidateInterpretations 全部只是候选取象，不是事实，也不是必须采用的结论。",
      "候选取象与关系事实冲突时，以 relationFacts 为准。",
      "AI可以舍弃候选取象，不得为了使用候选取象而强行补故事。",
      "不得按固定领域逐项填充，只讲真正有力且能相互印证的内容。",
      "关系方向必须服从 relationFacts.meta，不得重新猜测谁生谁、谁克谁。",
      "条件组合不能写成已经成局或已经合化。",
      "神煞、藏干、宫位触发只能辅助，不能单独推出确定事件。",
    ],
  };
}

function compactNatalFacts(viewModel = {}) {
  return {
    gender: text(viewModel?.birthInfo?.gender || "unknown"),
    pillars: array(viewModel?.pillars).map((pillar) => ({
      key: text(pillar?.key),
      name: text(pillar?.name || pillar?.label),
      stem: text(pillar?.stem),
      branch: text(pillar?.branch),
      ganZhi: text(
        pillar?.pillar ||
        pillar?.ganZhi ||
        pillar?.label,
      ),
      stemTenGod: text(pillar?.stemTenGod),
      branchMainTenGod: text(pillar?.branchMainTenGod),
      hiddenStems: array(pillar?.hiddenStems).map((hidden) => ({
        stem: text(hidden?.stem),
        tenGod: text(hidden?.tenGod),
        role: text(hidden?.role),
      })),
      shensha: array(pillar?.shensha).map((entry) => ({
        name: text(entry?.name),
        category: text(entry?.category),
      })),
    })),
    fiveElements: viewModel?.fiveElements ?? null,
  };
}

function compactRelationFact(fact = {}) {
  return {
    id: text(fact?.id),
    type: text(fact?.type),
    label: text(fact?.label),
    status: text(fact?.status || "direct"),
    category: text(fact?.category || "direct"),
    source: text(fact?.source),
    participants: unique(array(fact?.participants)),
    tags: unique(array(fact?.tags)),
    rawText: shortText(fact?.text, 320),
    meta: compactRelationMeta(fact?.meta),
  };
}

function compactRelationMeta(value) {
  const meta = object(value);

  const result = {
    controller: text(meta?.controller),
    controlled: text(meta?.controlled),
    direction: text(meta?.direction),
    targetElement: text(meta?.targetElement),
    transformationStatus: text(meta?.transformationStatus),
    formationStatus: text(meta?.formationStatus),
    conditionType: text(meta?.conditionType),
    parentLevel: text(meta?.parentLevel),
    stemDirection: text(meta?.stemDirection),
    subtype: text(meta?.subtype),
    element: text(meta?.element),
    sourceLevel: text(meta?.sourceLevel),
    targetLevel: text(meta?.targetLevel),
    natalPillar: text(meta?.natalPillar),
  };

  return Object.fromEntries(
    Object.entries(result).filter(([, entry]) =>
      entry !== "" &&
      entry !== null &&
      entry !== undefined
    ),
  );
}

function compactNatalImage(card = {}) {
  const id = text(card?.id);
  const title = text(card?.title);
  const summary = shortText(card?.image || card?.summary, 300);

  if (!id && !title && !summary) return null;

  return {
    id,
    title,
    summary,
    evidence: unique(array(card?.evidence)),
  };
}

function compactStageImages(triggerImages) {
  const source = object(triggerImages);
  const storyPack = object(source?.storyPack);

  const candidates = [
    ...array(source?.threads),
    ...array(storyPack?.sceneThreads),
    ...array(storyPack?.directTriggers),
    ...array(storyPack?.background),
    ...array(storyPack?.hierarchyInteractions),
    ...array(storyPack?.convergence),
    ...array(storyPack?.conditionalPatterns),
  ];

  const seen = new Set();

  return candidates
    .map((entry) => {
      const id = text(entry?.id || entry?.factId);
      const key = id || [
        text(entry?.label),
        text(entry?.summary),
        text(entry?.trigger),
      ].join("|");

      if (!key || seen.has(key)) return null;
      seen.add(key);

      return {
        id,
        label: text(entry?.label),
        trigger: shortText(entry?.trigger, 180),
        summary: shortText(entry?.summary, 320),
        possibleScenes: unique(array(entry?.possibleScenes)),
        conditions: unique(array(entry?.conditions)),
        certainty: text(entry?.certainty || entry?.status),
        evidenceRefs: unique(array(entry?.evidenceRefs)),
      };
    })
    .filter(Boolean);
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
    stemTenGod: text(item?.tenGod || item?.stemTenGod),
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
  return value === undefined || value === null
    ? ""
    : String(value).trim();
}

function unique(values) {
  return [...new Set(array(values).map(text).filter(Boolean))];
}

function array(value) {
  return Array.isArray(value)
    ? value
    : value === undefined || value === null
      ? []
      : [value];
}

function object(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}
