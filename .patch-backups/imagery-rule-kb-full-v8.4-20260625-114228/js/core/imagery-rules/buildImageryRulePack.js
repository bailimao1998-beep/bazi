import {
  IMAGERY_METHODOLOGY_RULES,
  IMAGERY_RULE_CORPUS_VERSION,
  IMAGERY_RULES,
  IMAGERY_SOURCE_REGISTRY,
} from "./imageryRuleBundle.js";

const TEN_GODS = [
  "比肩", "劫财", "正印", "偏印", "食神", "伤官",
  "正财", "偏财", "正官", "七杀",
];

const RELATIONS = [
  "天干五合", "六合", "冲", "刑", "自刑", "害", "穿", "破",
  "半合", "拱合", "三合", "三会", "伏吟", "反吟",
];

const STEMS = [..."甲乙丙丁戊己庚辛壬癸"];
const BRANCHES = [..."子丑寅卯辰巳午未申酉戌亥"];

const SCOPE_MAP = {
  natal: "natal",
  currentStage: "luck",
  singleYear: "year",
  multiYear: "multiYear",
  month: "month",
};

const CATEGORY_QUOTA = {
  ten_god: 5,
  relation: 5,
  pattern: 5,
  work_method: 5,
  palace: 4,
  relationship: 6,
  transit: 6,
  element: 5,
  career: 5,
};

export function buildImageryRulePack({
  question = "",
  plan = {},
  natalImageReport,
  luckImageReport,
  yearImageReport,
  monthImageReport,
  monthImageReports,
  requestedYearReports,
  selectedImagery,
} = {}) {
  if (!plan?.isBaziQuestion) {
    return {
      version: IMAGERY_RULE_CORPUS_VERSION,
      source: "blind_bazi_imagery_knowledge_base",
      role: "reference_only",
      methodologyRules: [],
      matchedRules: [],
      matchedRuleIds: [],
      ruleConstraint:
        buildRuleConstraint([]),
      coverage: buildCoverage(),
      instruction: "当前问题未识别为命理问题，不注入取象规则。",
    };
  }

  const context = buildRuleContext({
    question,
    plan,
    natalImageReport,
    luckImageReport,
    yearImageReport,
    monthImageReport,
    monthImageReports,
    requestedYearReports,
    selectedImagery,
  });

  const methodologyLimit = clamp(
    plan?.limits?.methodologyRules ??
      (plan?.answerDepth === "deep" ? 22 : plan?.answerDepth === "concise" ? 12 : 18),
    8,
    30,
  );

  const ruleLimit = clamp(
    plan?.limits?.imageryRules ??
      (plan?.answerDepth === "deep" ? 28 : plan?.answerDepth === "concise" ? 10 : 18),
    6,
    36,
  );

  const methodologyRules = IMAGERY_METHODOLOGY_RULES
    .filter((item) => methodologyApplies(item, context))
    .sort((a, b) => Number(b.priority || 0) - Number(a.priority || 0))
    .slice(0, methodologyLimit)
    .map(compactMethodologyRule);

  const scored = IMAGERY_RULES
    .filter((rule) => !rule.researchOnly && rule.allowInUserAnswer !== false)
    .map((rule) => scoreRule(rule, context))
    .filter(Boolean)
    .sort(compareScoredRules);

  const selected = selectWithCategoryDiversity(scored, ruleLimit)
    .map(compactMatchedRule);

  const ruleConstraint =
    buildRuleConstraint(
      selected,
    );

  return {
    version: IMAGERY_RULE_CORPUS_VERSION,
    source: "blind_bazi_imagery_knowledge_base",
    role: "reference_only",
    methodologyRules,
    matchedRules: selected,
    matchedRuleIds: selected.map((item) => item.id),
    ruleConstraint,
    sourceSummary: summarizeSources(selected),
    coverage: buildCoverage(),
    contextSummary: {
      timeScope: context.timeScope,
      domains: [...context.domains].sort(),
      gender: context.gender || null,
      observedTenGods: [...context.tenGods].sort(),
      observedRelations: [...context.relations].sort(),
    },
    instruction: [
      "采用规则优先的引导模式：匹配规则是主要取象依据，AI可在这些规则和硬事实之间做主次排序、合并与现实化表达。",
      "不得自行创造系统未提供的具名干支关系、正式格局、特殊口诀或确定事件。",
      "当规则库覆盖不足时，可以依据原局硬事实、岁运硬事实和取象总纲做保守补充推断，但必须降低语气，不得伪装成书本定则。",
      "总纲规定推理方法，匹配规则提供专业候选象；二者都不能替代命盘硬事实。",
      "应检查触发证据、成立条件、削弱因素和禁止越级结论，但不要求每句话机械绑定规则编号。",
      "先形成主象、辅象、矛盾象、条件象和反证象，再展开现实表现与建议。",
    ],
  };
}

function buildRuleContext({
  question,
  plan,
  natalImageReport,
  luckImageReport,
  yearImageReport,
  monthImageReport,
  monthImageReports,
  requestedYearReports,
  selectedImagery,
}) {
  const raw = JSON.stringify({
    natalImageReport,
    luckImageReport,
    yearImageReport,
    monthImageReport,
    monthImageReports,
    requestedYearReports,
    selectedImagery,
  });

  const pack = natalImageReport?.natalAiEvidencePack ?? natalImageReport?.natalDebug?.natalAiEvidencePack ?? {};
  const gender = String(pack?.chartSummary?.gender ?? "");
  const text = `${String(question ?? "")}\n${raw}`;

  return {
    question: String(question ?? ""),
    rawText: text,
    gender,
    timeScope: SCOPE_MAP[plan?.timeScope] ?? "natal",
    domains: new Set(Array.isArray(plan?.domainKeys) ? plan.domainKeys : ["general"]),
    tenGods: new Set(TEN_GODS.filter((item) => text.includes(item))),
    relations: new Set(RELATIONS.filter((item) => text.includes(item))),
    stems: new Set(STEMS.filter((item) => text.includes(item))),
    branches: new Set(BRANCHES.filter((item) => text.includes(item))),
    featureText: text,
  };
}

function methodologyApplies(rule, context) {
  const scopes = Array.isArray(rule?.appliesTo) ? rule.appliesTo : ["all"];
  if (scopes.includes("all")) return true;
  if (scopes.includes(context.timeScope)) return true;
  return scopes.some((item) => context.domains.has(item));
}

function scoreRule(rule, context) {
  if (!genderMatches(rule.gender, context.gender)) return null;

  const matchedBy = [];
  let score = Number(rule.priority || 0) / 12;

  const domains = array(rule.domains);
  const domainHits = domains.filter((item) => context.domains.has(item));
  if (domainHits.length) {
    score += 7 + Math.min(4, domainHits.length * 2);
    matchedBy.push(`领域：${domainHits.join("、")}`);
  } else if (domains.includes("general")) {
    score += 2;
    matchedBy.push("通用规则");
  }

  const scopes = array(rule.scopes);
  if (scopes.includes(context.timeScope) || (context.timeScope === "multiYear" && scopes.includes("year"))) {
    score += 4;
    matchedBy.push(`时间层：${context.timeScope}`);
  }

  const keywordHits = array(rule.queryKeywords)
    .filter((item) => context.question.includes(item));
  if (keywordHits.length) {
    score += Math.min(8, keywordHits.length * 3);
    matchedBy.push(`问题词：${keywordHits.slice(0, 3).join("、")}`);
  }

  const trigger = rule.trigger ?? {};
  const tenGodAny = expandAlternatives(trigger.tenGodsAny);
  const tenGodAll = array(trigger.tenGodsAll);
  const relationAny = expandAlternatives(trigger.relationsAny);
  const stemAny = expandAlternatives(trigger.stemsAny);
  const branchAny = expandAlternatives(trigger.branchesAny);
  const featureAny = expandAlternatives(trigger.featuresAny);

  const tenGodAnyHits = tenGodAny.filter((item) => context.tenGods.has(item));
  let allTenGodGroupsHit =
    tenGodAll.length ===
      0;

  if (tenGodAnyHits.length) {
    score += 5;
    matchedBy.push(`十神：${tenGodAnyHits.slice(0, 4).join("、")}`);
  }

  if (tenGodAll.length) {
    allTenGodGroupsHit =
      tenGodAll.every((group) =>
        String(group)
          .split("|")
          .some((item) =>
            context.tenGods.has(item),
          ),
      );

    if (!allTenGodGroupsHit) {
      return null;
    }

    score += 8;
    matchedBy.push(
      `组合十神：${tenGodAll.join("＋")}`,
    );
  }

  const relationHits = relationAny.filter((item) => context.relations.has(item));
  if (relationHits.length) {
    score += 6;
    matchedBy.push(`关系：${relationHits.slice(0, 3).join("、")}`);
  }

  const stemHits = stemAny.filter((item) => context.stems.has(item));
  const branchHits = branchAny.filter((item) => context.branches.has(item));
  if (stemHits.length || branchHits.length) {
    score += 3;
    matchedBy.push(`干支：${[...stemHits, ...branchHits].slice(0, 5).join("、")}`);
  }

  const featureHits = featureAny.filter((item) => context.featureText.includes(item));
  if (featureHits.length) {
    score += 5;
    matchedBy.push(`结构：${featureHits.slice(0, 3).join("、")}`);
  }

  const triggerEvidence = [
    ...tenGodAnyHits.map(
      (item) =>
        `十神:${item}`,
    ),
    ...(
      tenGodAll.length &&
      allTenGodGroupsHit
        ? tenGodAll.map(
            (item) =>
              `组合十神:${item}`,
          )
        : []
    ),
    ...relationHits.map(
      (item) =>
        `关系:${item}`,
    ),
    ...stemHits.map(
      (item) =>
        `天干:${item}`,
    ),
    ...branchHits.map(
      (item) =>
        `地支:${item}`,
    ),
    ...featureHits.map(
      (item) =>
        `结构:${item}`,
    ),
  ];

  /*
   * 领域、时间层和问题关键词可以召回“检查框架”类规则，
   * 但没有命中命盘或岁运触发条件时，该规则不能支撑具体结论。
   */
  const claimSupportAllowed =
    triggerEvidence.length >
      0;

  // Relation rules should not be injected when the relation is absent.
  if (rule.category === "relation" && relationAny.length && relationHits.length === 0) return null;

  // Element rules require at least one corresponding stem or branch.
  if (rule.category === "element" && stemHits.length + branchHits.length === 0) return null;

  // Specific pattern/work-method rules need at least one structural or ten-god hit.
  if (["pattern", "work_method"].includes(rule.category) &&
      featureHits.length + tenGodAnyHits.length === 0 && !matchedBy.some((x) => x.startsWith("组合十神"))) {
    return null;
  }

  if (score < 8) return null;

  return {
    rule,
    score:
      Number(
        score.toFixed(2),
      ),
    matchedBy,
    triggerEvidence:
      [...new Set(triggerEvidence)],
    claimSupportAllowed,
  };
}

function selectWithCategoryDiversity(scored, limit) {
  const selected = [];
  const counts = new Map();

  for (const item of scored) {
    const category = item.rule.category || "other";
    const quota = CATEGORY_QUOTA[category] ?? 4;
    if ((counts.get(category) ?? 0) >= quota) continue;
    selected.push(item);
    counts.set(category, (counts.get(category) ?? 0) + 1);
    if (selected.length >= limit) return selected;
  }

  if (selected.length < limit) {
    for (const item of scored) {
      if (selected.includes(item)) continue;
      selected.push(item);
      if (selected.length >= limit) break;
    }
  }

  return selected;
}

function compareScoredRules(a, b) {
  if (b.score !== a.score) return b.score - a.score;
  if (Number(b.rule.priority || 0) !== Number(a.rule.priority || 0)) {
    return Number(b.rule.priority || 0) - Number(a.rule.priority || 0);
  }
  return String(a.rule.id).localeCompare(String(b.rule.id));
}

function compactMethodologyRule(item) {
  return {
    id: item.id,
    title: item.title,
    priority: item.priority,
    instruction: item.instruction,
    sources: compactSources(item.sourceRefs),
  };
}

function compactMatchedRule(item) {
  const rule = item.rule;
  return {
    id: rule.id,
    title: rule.title,
    category: rule.category,
    ruleLevel: rule.ruleLevel,
    certainty: rule.certainty,
    priority: rule.priority,
    domains: array(rule.domains),
    scopes: array(rule.scopes),
    matchedBy: item.matchedBy,
    triggerEvidence:
      array(
        item.triggerEvidence,
      ).slice(0, 8),
    claimSupportAllowed:
      Boolean(
        item.claimSupportAllowed,
      ),
    conditionStatus:
      !item.claimSupportAllowed
        ? "context_only"
        : array(rule.requires).length
          ? "requires_review"
          : "trigger_verified",
    requires: array(rule.requires).slice(0, 4),
    weakeningConditions: array(rule.weakeningConditions).slice(0, 4),
    imagery: {
      core: array(rule.imagery?.core).slice(0, 3),
      positive: array(rule.imagery?.positive).slice(0, 3),
      negative: array(rule.imagery?.negative).slice(0, 3),
      realityChecks: array(rule.imagery?.realityChecks).slice(0, 3),
    },
    advice: array(rule.advice).slice(0, 3),
    prohibitions: array(rule.prohibitions).slice(0, 3),
    sources: compactSources(rule.sourceRefs),
    matchScore: item.score,
  };
}


function buildRuleConstraint(
  selected,
) {
  const rules =
    array(selected)
      .filter(
        (item) =>
          item
            ?.claimSupportAllowed !==
          false,
      );

  const allowedRuleIds =
    rules
      .map(
        (item) =>
          item.id,
      )
      .filter(Boolean);

  const conditionalRuleIds =
    rules
      .filter(
        (item) =>
          item
            ?.conditionStatus ===
          "requires_review",
      )
      .map(
        (item) =>
          item.id,
      );

  return {
    mode:
      "rule_guided",
    allowExternalImageryRules:
      false,
    methodologyCanSupportClaims:
      true,
    claimBindingRequired:
      false,
    auditRequired:
      false,
    allowedRuleIds,
    conditionalRuleIds,
    allowedFactLayers: [
      "natal",
      "luck",
      "year",
      "month",
    ],
    minimumRulesPerMajorClaim:
      0,
    minimumFactAnchorsPerMajorClaim:
      1,
    eventMinimumIndependentBases:
      2,
    fallbackWhenNoRuleMatches:
      "可以依据硬事实和取象总纲做保守补充推断，但不得创造具名关系、正式格局、特殊口诀或确定事件。",
    auditSchema: {
      claims: [
        {
          claim:
            "正文中的主象或重要判断",
          ruleIds: [
            "必须来自allowedRuleIds",
          ],
          factAnchors: [
            "必须来自本次原局或岁运硬事实",
          ],
          basisLayers: [
            "natal|luck|year|month",
          ],
          conditionsChecked: [
            "使用条件规则时必须填写",
          ],
          counterEvidence: [],
          confidence:
            "high|medium|low",
        },
      ],
    },
  };
}

function compactSources(refs) {
  return array(refs).map((ref) => ({
    sourceId: ref.sourceId,
    pdfPage: ref.pdfPage,
    section: ref.section,
  }));
}

function summarizeSources(selected) {
  const counts = new Map();
  for (const item of selected) {
    for (const ref of array(item.sources)) {
      counts.set(ref.sourceId, (counts.get(ref.sourceId) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([sourceId, ruleCount]) => ({ sourceId, ruleCount }))
    .sort((a, b) => b.ruleCount - a.ruleCount);
}

function buildCoverage() {
  return {
    registeredSourceCount: IMAGERY_SOURCE_REGISTRY.length,
    activeRuleCount: IMAGERY_RULES.filter((item) => !item.researchOnly && item.allowInUserAnswer !== false).length,
    methodologyRuleCount: IMAGERY_METHODOLOGY_RULES.length,
    sources: IMAGERY_SOURCE_REGISTRY.map((item) => ({
      id: item.id,
      title: item.title,
      ingestionStatus: item.ingestionStatus,
    })),
    notice: "当前为首批核心规则库；未完成可靠核读的扫描章节不会冒充已提炼。",
  };
}

function genderMatches(ruleGender, actualGender) {
  if (!ruleGender || ruleGender === "all") return true;
  const expected = Array.isArray(ruleGender) ? ruleGender : [ruleGender];
  const normalized = actualGender === "男" ? "male" : actualGender === "女" ? "female" : "unknown";
  return expected.includes(normalized) || expected.includes("all") || normalized === "unknown";
}

function expandAlternatives(items) {
  return [...new Set(array(items).flatMap((item) => String(item).split("|")).filter(Boolean))];
}

function array(value) {
  return Array.isArray(value) ? value : value == null ? [] : [value];
}

function clamp(value, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return min;
  return Math.max(min, Math.min(max, Math.round(number)));
}
