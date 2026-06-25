const STAGE_LABELS = {
  luck: "大运",
  year: "流年",
  month: "流月",
};

const CONDITIONAL_STATUSES = new Set([
  "condition_only",
  "arch_condition",
  "unresolved",
  "conditional",
]);

const SAFE_META_KEYS = new Set([
  "transformationStatus",
  "targetElement",
  "controller",
  "controlled",
  "direction",
  "element",
  "formationStatus",
  "conditionType",
  "subtype",
  "members",
]);

export function buildStageRawFactPack({
  stage = "luck",
  item = {},
  currentLuckItem = null,
  yearItem = null,
  baseBaziViewModel = {},
  natalImageReport = {},
} = {}) {
  const normalizedStage = STAGE_LABELS[stage] ? stage : "luck";
  const current = compactStagePillar(
    item,
    normalizedStage,
    STAGE_LABELS[normalizedStage],
  );
  const luck = compactStagePillar(
    item?.currentLuckItem || currentLuckItem || (normalizedStage === "luck" ? item : null),
    "luck",
    "大运",
  );
  const year = compactStagePillar(
    item?.yearItem || yearItem || (normalizedStage === "year" ? item : null),
    "year",
    "流年",
  );
  const month = normalizedStage === "month"
    ? compactStagePillar(item, "month", "流月")
    : null;

  const structureFacts = array(item?.transitStructure?.facts)
    .map(compactStructureFact)
    .filter((fact) => fact.id && fact.relation);

  const tenGodFacts = [
    createTenGodFact(current, "stem"),
    createTenGodFact(current, "branch"),
    normalizedStage !== "luck" ? createTenGodFact(luck, "stem") : null,
    normalizedStage !== "luck" ? createTenGodFact(luck, "branch") : null,
    normalizedStage === "month" ? createTenGodFact(year, "stem") : null,
    normalizedStage === "month" ? createTenGodFact(year, "branch") : null,
  ].filter(Boolean);

  const facts = dedupeFacts([...tenGodFacts, ...structureFacts]);

  return {
    schemaVersion: "stage-raw-facts-v8.7.0",
    stage: normalizedStage,
    stageLabel: STAGE_LABELS[normalizedStage],
    target: compactTarget(normalizedStage, item),
    natal: compactNatal(baseBaziViewModel, natalImageReport),
    layers: {
      current,
      luck,
      year,
      month,
    },
    facts,
    factGroups: groupFactsByParticipants(facts),
    boundaries: unique([
      ...array(item?.transitStructure?.boundaries),
      "这里只确认排盘、十神、参与者、关系类型与成立状态，不预先决定现实领域和具体事件。",
      "同一组参与者出现多个关系标签时，只能视为一个复合作用组，不能重复计数。",
      "条件组合、化气候选、半合、拱合与三会两支不能直接写成已经成局。",
    ]),
  };
}

function compactNatal(viewModel, natalReport) {
  const pillars = array(viewModel?.pillars).map((pillar, index) => ({
    key: text(pillar?.key || ["year", "month", "day", "hour"][index]),
    name: text(pillar?.name || pillar?.label || ["年柱", "月柱", "日柱", "时柱"][index]),
    ganZhi: text(pillar?.ganZhi || pillar?.pillar || pillar?.label),
    stem: text(pillar?.stem || pillar?.heavenlyStem),
    branch: text(pillar?.branch || pillar?.earthlyBranch),
  }));

  const natalImagery = array(natalReport?.imageCards)
    .slice(0, 12)
    .map((card, index) => ({
      id: text(card?.id || `natal-image:${index + 1}`),
      title: text(card?.title || "原局取象"),
      image: shortText(card?.image || card?.summary, 180),
      evidence: unique(array(card?.evidence)).slice(0, 6),
      usage: "只作为原局底色和承接方式，不得单独当作当前岁运已经发生的事件。",
    }))
    .filter((card) => card.title || card.image);

  return {
    pillars,
    dayMaster: text(viewModel?.dayMaster?.stem || viewModel?.dayMaster || viewModel?.dayStem),
    fiveElements: viewModel?.fiveElements ?? null,
    structureAnalysis: viewModel?.structureAnalysis ?? null,
    natalImagery,
  };
}

function compactStagePillar(value, level, displayName) {
  if (!value || typeof value !== "object") return null;
  const ganZhi = text(value?.ganZhi || value?.label);
  const stem = text(value?.stem || ganZhi.slice(0, 1));
  const branch = text(value?.branch || ganZhi.slice(1, 2));
  const id = text(value?.id || `${level}:${value?.year || value?.month || ganZhi || displayName}`);
  return {
    id,
    level,
    displayName,
    year: numberOrNull(value?.year),
    month: numberOrNull(value?.month || value?.flowMonthIndex),
    flowMonthLabel: text(value?.flowMonthLabel),
    dateRangeLabel: text(value?.dateRangeLabel),
    ganZhi,
    stem,
    branch,
    stemTenGod: text(value?.stemTenGod || value?.tenGod),
    branchMainTenGod: text(value?.branchMainTenGod || value?.branchTenGod),
    ageRange: text(value?.ageRange),
    yearRange: text(value?.yearRange),
  };
}

function createTenGodFact(pillar, position) {
  if (!pillar) return null;
  const tenGod = position === "stem"
    ? pillar.stemTenGod
    : pillar.branchMainTenGod;
  const char = position === "stem" ? pillar.stem : pillar.branch;
  if (!tenGod || !char) return null;
  return {
    id: `fact:${pillar.id}:${position}-ten-god`,
    kind: "ten_god",
    category: "base",
    type: `${position}_ten_god`,
    relation: position === "stem" ? "天干十神" : "地支主气十神",
    status: "direct",
    certainty: "direct",
    sourceLayer: pillar.level,
    participants: [pillar.id],
    tenGod,
    char,
    meta: {},
  };
}

function compactStructureFact(fact) {
  const status = text(fact?.status || "direct");
  return {
    id: text(fact?.id),
    kind: "structure",
    category: text(fact?.category || "direct"),
    type: text(fact?.type || "relation"),
    relation: text(fact?.label || fact?.type || "结构关系"),
    status,
    certainty: CONDITIONAL_STATUSES.has(status) ? "conditional" : "direct",
    sourceLayer: text(fact?.stage),
    participants: unique(array(fact?.participants)),
    tags: unique(array(fact?.tags)).slice(0, 4),
    meta: compactMeta(fact?.meta),
  };
}

function compactMeta(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value)
      .filter(([key, item]) => SAFE_META_KEYS.has(key) && item !== undefined && item !== null)
      .map(([key, item]) => [key, Array.isArray(item) ? unique(item) : item]),
  );
}

function groupFactsByParticipants(facts) {
  const groups = new Map();
  array(facts)
    .filter((fact) => fact.kind === "structure")
    .forEach((fact, index) => {
      const participants = unique(fact.participants).sort();
      const key = participants.length
        ? participants.join("|")
        : `ungrouped:${fact.id || index}`;
      const current = groups.get(key) || {
        id: `fact-group:${groups.size + 1}`,
        participants,
        evidenceIds: [],
        relations: [],
        instruction: "本组内多个关系标签来自同一组参与者，只能合并判断一次。",
      };
      current.evidenceIds.push(fact.id);
      current.relations.push({
        factId: fact.id,
        relation: fact.relation,
        type: fact.type,
        status: fact.status,
        certainty: fact.certainty,
        meta: fact.meta,
      });
      groups.set(key, current);
    });

  return [...groups.values()].map((group) => ({
    ...group,
    evidenceIds: unique(group.evidenceIds),
    relations: dedupeRelations(group.relations),
  }));
}

function dedupeRelations(relations) {
  const seen = new Set();
  return array(relations).filter((relation) => {
    const key = [relation.relation, relation.type, JSON.stringify(relation.meta || {})].join("|");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function dedupeFacts(facts) {
  const seen = new Set();
  return array(facts).filter((fact) => {
    if (!fact?.id || seen.has(fact.id)) return false;
    seen.add(fact.id);
    return true;
  });
}

function compactTarget(stage, item) {
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

function shortText(value, maxLength = 180) {
  const normalized = text(value).replace(/\s+/g, " ");
  return normalized.length <= maxLength
    ? normalized
    : `${normalized.slice(0, Math.max(0, maxLength - 1))}…`;
}

function numberOrNull(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function text(value) {
  return value === undefined || value === null ? "" : String(value).trim();
}

function array(value) {
  return Array.isArray(value) ? value : value === undefined || value === null ? [] : [value];
}

function unique(values) {
  return [...new Set(array(values).map(text).filter(Boolean))];
}
