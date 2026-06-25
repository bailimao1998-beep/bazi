const STAGE_LIMITS = {
  luck: 16,
  year: 12,
  month: 8,
};

const RELATION_TERMS = [
  "天干五合", "六合", "冲", "刑", "自刑", "害", "穿", "破",
  "半合", "拱合", "三合", "三会", "伏吟", "反吟", "天干相克", "天克地冲",
];

const TEN_GODS = [
  "比肩", "劫财", "正印", "偏印", "食神", "伤官", "正财", "偏财", "正官", "七杀",
];

export function buildStageImageCandidatePack({
  stage = "luck",
  rawFactPack = {},
  stageRulePack = {},
} = {}) {
  const facts = array(rawFactPack?.facts);
  const rules = array(stageRulePack?.matchedRules)
    .filter((rule) => rule?.claimSupportAllowed !== false);

  const candidateImages = rules
    .map((rule) => compactCandidate(rule, facts, rawFactPack))
    .filter((candidate) => candidate && candidate.evidenceIds.length)
    .slice(0, STAGE_LIMITS[stage] || STAGE_LIMITS.luck);

  return {
    schemaVersion: "stage-image-candidates-v8.7.0",
    stage,
    candidateImages,
    candidateRuleIds: candidateImages.map((candidate) => candidate.ruleId),
    selectionLimits: {
      min: candidateImages.length ? 1 : 0,
      max: stage === "luck" ? 6 : stage === "year" ? 4 : 3,
    },
    selectionContract: [
      "只能从candidateImages中选择当前阶段主象，不得自行创建规则库之外的新象。",
      "每个选中主象必须同时引用至少一个evidenceId和一个ruleId。",
      "同一factGroup内多个关系标签属于同一复合作用，不得拆成多个主象重复加权。",
      "允许用自然语言概括规则意义，但不得扩展到allowedDomains与allowedScenes之外的新事件类别。",
      "原局取象只说明底色，必须有当前阶段事实触发后才能进入本阶段主结论。",
      "条件事实只能成为弱象、替代分支或成立条件，不能压过直接事实。",
    ],
    methodologyRules: array(stageRulePack?.methodologyRules)
      .map((rule) => ({
        id: text(rule?.id),
        title: text(rule?.title),
        instruction: text(rule?.instruction),
      }))
      .filter((rule) => rule.title || rule.instruction)
      .slice(0, stage === "luck" ? 10 : 8),
  };
}

function compactCandidate(rule, facts, rawFactPack) {
  if (!rule || typeof rule !== "object") return null;
  const evidenceIds = resolveEvidenceIds(rule, facts, rawFactPack);
  if (!evidenceIds.length) return null;

  return {
    id: `candidate:${text(rule?.id || rule?.title)}`,
    ruleId: text(rule?.id || `rule:${slug(rule?.title)}`),
    title: text(rule?.title || "候选取象"),
    evidenceIds,
    allowedDomains: unique(array(rule?.domains)).slice(0, 8),
    allowedMeanings: unique([
      ...array(rule?.imagery?.core),
    ]).slice(0, 4),
    positive: unique(array(rule?.imagery?.positive)).slice(0, 4),
    risks: unique(array(rule?.imagery?.negative)).slice(0, 4),
    allowedScenes: unique(array(rule?.imagery?.realityChecks)).slice(0, 4),
    advice: unique(array(rule?.advice)).slice(0, 4),
    requires: unique(array(rule?.requires)).slice(0, 4),
    weakeningConditions: unique(array(rule?.weakeningConditions)).slice(0, 4),
    prohibitions: unique(array(rule?.prohibitions)).slice(0, 4),
    sourceRefs: array(rule?.sourceRefs).slice(0, 3),
  };
}

function resolveEvidenceIds(rule, facts, rawFactPack) {
  const explicitTerms = parseMatchedTerms(rule?.matchedBy);
  const ruleText = JSON.stringify({
    title: rule?.title,
    requires: rule?.requires,
    imagery: rule?.imagery,
  });

  const ids = [];
  array(facts).forEach((fact) => {
    if (fact.kind === "ten_god") {
      if (
        explicitTerms.tenGods.includes(fact.tenGod) ||
        (!explicitTerms.tenGods.length && TEN_GODS.some((name) => name === fact.tenGod && ruleText.includes(name)))
      ) {
        ids.push(fact.id);
      }
      return;
    }

    const relationMatched = explicitTerms.relations.some((term) => relationMatches(fact, term));
    const structureMatched = explicitTerms.structures.some((term) => factSearchText(fact).includes(term));
    const fallbackMatched = RELATION_TERMS.some((term) => ruleText.includes(term) && relationMatches(fact, term));
    const stemBranchMatched = explicitTerms.stemsBranches.some((term) => factSearchText(fact).includes(term));

    if (relationMatched || structureMatched || fallbackMatched || stemBranchMatched) {
      ids.push(fact.id);
    }
  });

  // 只命中十神但没有结构事实时，允许使用本层十神事实；不使用前端领域命中作为证据。
  return unique(ids).slice(0, 10);
}

function parseMatchedTerms(values) {
  const result = {
    tenGods: [],
    relations: [],
    structures: [],
    stemsBranches: [],
  };

  array(values).forEach((value) => {
    const textValue = text(value);
    const [kind, raw = ""] = textValue.split(":", 2);
    const terms = raw.split(/[、＋+，,\s]+/).map(text).filter(Boolean);
    if (kind.includes("十神")) result.tenGods.push(...terms);
    if (kind.includes("关系")) result.relations.push(...terms);
    if (kind.includes("结构")) result.structures.push(...terms);
    if (kind.includes("干支")) result.stemsBranches.push(...terms);
  });

  return Object.fromEntries(
    Object.entries(result).map(([key, items]) => [key, unique(items)]),
  );
}

function relationMatches(fact, term) {
  const relation = text(fact?.relation);
  const type = text(fact?.type);
  if (relation === term || relation.includes(term) || term.includes(relation)) return true;
  if (term === "半合" && type.includes("half_harmony")) return true;
  if (term === "拱合" && type.includes("arch_harmony")) return true;
  if (term === "三合" && type.includes("triple_harmony")) return true;
  if (term === "三会" && (type.includes("meeting") || relation.includes("三会"))) return true;
  if (term === "反吟" && (relation === "天克地冲" || array(fact?.tags).includes("反吟倾向"))) return true;
  return false;
}

function factSearchText(fact) {
  return JSON.stringify({
    relation: fact?.relation,
    type: fact?.type,
    participants: fact?.participants,
    tags: fact?.tags,
    meta: fact?.meta,
  });
}

function slug(value) {
  return text(value).replace(/\s+/g, "-").slice(0, 40) || "candidate";
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
