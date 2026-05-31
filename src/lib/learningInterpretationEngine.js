const DATASET_KEYS = [
  "blindCases",
  "strengthModel",
  "patternsUsefulGods",
  "blindCoreMethods",
  "outputTemplates",
  "caseStudies",
  "referenceKnowledge",
];

const GROUP_KEYS = [
  "structure",
  "tenGods",
  "branchRelations",
  "blindCandidates",
  "strengthUsefulGods",
  "luckFlow",
  "cases",
];

const ELEMENT_LABELS = {
  wood: "木",
  fire: "火",
  earth: "土",
  metal: "金",
  water: "水",
};

const ELEMENT_KEYS = Object.keys(ELEMENT_LABELS);
const FORBIDDEN_TEXT = /(一定|必定|绝对|必然|必离婚|必发财|必有灾|必坐牢|必死亡)/g;

export function buildLearningInterpretations(reading = {}, datasets = {}) {
  const context = buildContext(reading, datasets);
  const fromRules = collectLearningRules(datasets)
    .filter((rule) => matchesRule(rule, context))
    .map((rule) => normalizeRuleInterpretation(rule, context));
  const derived = [
    buildStructureInterpretation(context),
    ...buildRelationInterpretations(context),
    ...buildTenGodInterpretations(context),
    ...buildStrengthInterpretations(context),
    ...buildLuckFlowInterpretations(context),
    ...buildCaseInterpretations(context),
  ].filter(Boolean);

  const learningInterpretations = dedupeById([...fromRules, ...derived])
    .map(sanitizeInterpretation)
    .sort((left, right) => groupRank(left.category) - groupRank(right.category) || confidenceRank(right.confidence) - confidenceRank(left.confidence));
  const grouped = buildGrouped(learningInterpretations);

  return { learningInterpretations, grouped };
}

function buildContext(reading, datasets) {
  const pillars = reading?.natal?.pillars ?? {};
  const natalRelations = normalizeList(reading?.natal?.combinations);
  const transitRelations = [
    ...normalizeList(reading?.transit?.triggers),
    ...normalizeList(reading?.transit?.hits).filter((hit) => hit.relation && hit.relation !== "平照"),
  ];
  const tenGodCounts = countBy(normalizeList(reading?.natal?.tenGods).map((item) => item.name).filter(Boolean));
  const elements = reading?.natal?.elements ?? {};
  const strengthSignals = normalizeList(reading?.natal?.strengthSignals);
  const dayMasterElement = pillars.day?.stemElement;
  const dayMasterSeason = strengthSignals.find((item) => item.element === dayMasterElement);
  const tags = collectReadingTags(reading);
  return {
    reading,
    datasets,
    pillars,
    elements,
    tenGodCounts,
    strengthSignals,
    dayMasterSeason,
    natalRelations,
    transitRelations,
    patternCandidates: normalizeList(reading?.natal?.patternCandidates),
    referenceKnowledgeHits: normalizeList(reading?.natal?.referenceKnowledgeHits),
    caseStudies: normalizeList(datasets?.caseStudies?.cases),
    tags,
  };
}

function collectLearningRules(datasets = {}) {
  return DATASET_KEYS.flatMap((key) => normalizeList(datasets?.[key]?.rules).map((rule) => ({ ...rule, datasetKey: key })))
    .filter((rule) => rule && rule.status !== "archived");
}

function matchesRule(rule, context) {
  const conditions = rule.conditions ?? {};
  if (conditions.always) return true;
  if (conditions.dayStem && conditions.dayStem !== context.pillars.day?.stem) return false;
  if (conditions.monthBranch && conditions.monthBranch !== context.pillars.month?.branch) return false;
  if (conditions.yearBranch && conditions.yearBranch !== context.pillars.year?.branch) return false;
  if (conditions.hourBranch && conditions.hourBranch !== context.pillars.hour?.branch) return false;
  if (conditions.relationType && !matchesRelationType(conditions.relationType, [...context.natalRelations, ...context.transitRelations])) return false;
  if (conditions.tenGod && Number(context.tenGodCounts[conditions.tenGod] ?? 0) <= 0) return false;
  if (conditions.tenGodCount && !countConditionMatches(conditions.tenGodCount, context.tenGodCounts, "name")) return false;
  if (conditions.elementCount && !countConditionMatches(conditions.elementCount, context.elements, "element")) return false;
  if (conditions.elementStrength && !matchesElementStrength(conditions.elementStrength, context)) return false;
  if (conditions.dayMasterSeason && !matchesDayMasterSeason(conditions.dayMasterSeason, context.dayMasterSeason)) return false;
  if (conditions.luckTrigger && !matchesRelationType(conditions.luckTrigger, context.transitRelations)) return false;
  if (conditions.caseTags && !matchesCaseTags(conditions.caseTags, context.tags)) return false;
  if (conditions.hasPatternCandidate && !context.patternCandidates.length) return false;
  if (conditions.referenceCategory && !context.referenceKnowledgeHits.some((hit) => hit.category === conditions.referenceCategory)) return false;
  return true;
}

function normalizeRuleInterpretation(rule, context) {
  const evidence = rule.evidence && typeof rule.evidence === "object" ? rule.evidence : {};
  const reason = evidence.whyMatched ?? deriveReason(rule.conditions ?? {}, context);
  const learningLogic = rule.logic ?? evidence.howToLearn ?? "把命中条件放回柱位、十神、旺衰和岁运中逐层验证。";
  const uncertaintyFactors = normalizeTextList(evidence.uncertaintyFactors).length
    ? normalizeTextList(evidence.uncertaintyFactors)
    : defaultUncertaintyFactors();
  return {
    id: rule.id,
    title: rule.title ?? "学习规则",
    category: mapCategory(rule.category, rule.datasetKey),
    matched: true,
    reason,
    learningLogic,
    plainExplanation: rule.plainExplanation ?? "这是一条候选学习信号，需要结合更多条件继续验证，不能单独作为结论。",
    evidence: buildRuleEvidence(rule, reason),
    uncertaintyFactors,
    sourceRefs: normalizeList(rule.sourceRefs),
    confidence: rule.confidence ?? "low",
    status: rule.status ?? "draft",
  };
}

function buildStructureInterpretation(context) {
  if (!context.pillars.day?.stem || !context.pillars.month?.branch) return null;
  return createInterpretation({
    id: "derived-reading-order",
    title: "读盘顺序：日主、月令、五行十神、关系岁运",
    category: "structure",
    reason: `日主为${context.pillars.day.stem}，月令为${context.pillars.month.branch}，可以按固定顺序拆解命盘。`,
    learningLogic: "先确定日主和月令，再看五行分布、十神数量、干支关系，最后把大运流年作为触发层复核。",
    plainExplanation: "这是学习读盘的路径提示，不把单一字段直接当成结论。",
    evidence: [`日柱：${context.pillars.day.label}`, `月柱：${context.pillars.month.label}`],
    uncertaintyFactors: ["出生时间准确性", "节气边界", "真太阳时设置"],
    confidence: "medium",
    status: "active",
  });
}

function buildRelationInterpretations(context) {
  return context.natalRelations.slice(0, 4).map((relation) => createInterpretation({
    id: `relation-${relation.id ?? relation.title}`,
    title: `干支关系：${relation.title ?? relation.effect ?? relation.relation ?? "关系命中"}`,
    category: "branchRelations",
    reason: `原局出现${relation.effect ?? relation.relation ?? relation.type ?? "干支关系"}，涉及${formatMembers(relation)}。`,
    learningLogic: "先记录关系类型，再看落在哪些柱位、牵动哪些十神，之后等待岁运是否再次触发。",
    plainExplanation: "这里是候选信号，说明这个关系值得观察，不能单独作为结论。",
    evidence: [relation.description, ...(relation.sources ?? [])].filter(Boolean),
    uncertaintyFactors: ["柱位语境", "十神对应", "关系是否被岁运再次触动"],
    sourceRefs: normalizeSourceRefs(relation.sources, relation.sourceIds),
    confidence: relation.confidence ?? "medium",
    status: relation.status ?? "active",
  }));
}

function buildTenGodInterpretations(context) {
  return Object.entries(context.tenGodCounts)
    .filter(([, count]) => Number(count) >= 2)
    .sort((left, right) => Number(right[1]) - Number(left[1]))
    .slice(0, 3)
    .map(([name, count]) => createInterpretation({
      id: `ten-god-${name}`,
      title: `十神观察：${name}出现较多`,
      category: "tenGods",
      reason: `${name}在当前命盘信号中出现${count}次。`,
      learningLogic: "十神数量只是入口，还要分清天干、地支主气、藏干来源，以及是否得月令支持。",
      plainExplanation: "传统命理中可作为观察点，但需要结合旺衰、柱位和岁运继续验证。",
      evidence: [`${name}计数：${count}`],
      uncertaintyFactors: ["藏干权重", "是否透干", "所在柱位"],
      confidence: "medium",
      status: "active",
    }));
}

function buildStrengthInterpretations(context) {
  const items = [];
  const strongest = getExtremeElements(context.elements, "max").slice(0, 2);
  const weakest = getExtremeElements(context.elements, "min").slice(0, 2);
  for (const item of strongest) {
    items.push(createInterpretation({
      id: `element-strong-${item.element}`,
      title: `五行观察：${ELEMENT_LABELS[item.element]}偏多`,
      category: "strengthUsefulGods",
      reason: `${ELEMENT_LABELS[item.element]}的统计值为${formatNumber(item.value)}，在当前五行中较明显。`,
      learningLogic: "五行偏多先看是否来自月令、透干或藏干，再看是否需要泄、耗、制或通关。",
      plainExplanation: "这是力量分布的候选观察点，需要结合日主强弱和格局取舍继续验证。",
      evidence: [`${ELEMENT_LABELS[item.element]}：${formatNumber(item.value)}`],
      uncertaintyFactors: ["统计口径", "月令影响", "组合是否改变力量流向"],
      confidence: "medium",
      status: "active",
    }));
  }
  for (const item of weakest.filter((entry) => Number(entry.value) <= 1)) {
    items.push(createInterpretation({
      id: `element-weak-${item.element}`,
      title: `五行观察：${ELEMENT_LABELS[item.element]}偏少`,
      category: "strengthUsefulGods",
      reason: `${ELEMENT_LABELS[item.element]}的统计值为${formatNumber(item.value)}，在当前五行中较少。`,
      learningLogic: "五行偏少只能提示需要复核，不能直接推出事件，要看藏干、岁运补充和整体取用。",
      plainExplanation: "这里是候选信号，适合继续学习力量平衡，不单独作为结论。",
      evidence: [`${ELEMENT_LABELS[item.element]}：${formatNumber(item.value)}`],
      uncertaintyFactors: ["藏干是否有根", "岁运是否补足", "调候是否优先"],
      confidence: "low",
      status: "draft",
    }));
  }
  if (context.dayMasterSeason) {
    items.push(createInterpretation({
      id: "day-master-season",
      title: "日主季节：回到月令看旺相休囚死",
      category: "strengthUsefulGods",
      reason: `日主五行为${context.dayMasterSeason.label}，在月令中为${context.dayMasterSeason.seasonalStatus}。`,
      learningLogic: "日主季节状态是强弱学习入口，之后还要看同类帮扶、印星资源、财官食伤消耗与岁运变化。",
      plainExplanation: "传统命理中可作为观察点，但不能离开整体结构单独判断。",
      evidence: [context.dayMasterSeason.interpretation],
      uncertaintyFactors: ["月令边界", "透干根气", "组合成化"],
      sourceRefs: normalizeSourceRefs(null, context.dayMasterSeason.sourceIds),
      confidence: "medium",
      status: context.dayMasterSeason.status ?? "active",
    }));
  }
  return items;
}

function buildLuckFlowInterpretations(context) {
  return context.transitRelations.slice(0, 4).map((hit) => createInterpretation({
    id: `luck-flow-${hit.id ?? hit.title ?? `${hit.transit}-${hit.target}`}`,
    title: `大运流年学习点：${hit.title ?? hit.relation ?? "岁运触发"}`,
    category: "luckFlow",
    reason: `岁运层出现${hit.relation ?? hit.effect ?? "触发"}，关联${[hit.transit, hit.target].filter(Boolean).join("与") || formatMembers(hit)}。`,
    learningLogic: "岁运只当作触发层学习，先回原局确认主题，再看触发发生在哪个时间层。",
    plainExplanation: "这里提示某个原局主题被岁运带到前台，需要结合原局和现实背景继续验证。",
    evidence: [hit.interpretation, hit.description].filter(Boolean),
    uncertaintyFactors: ["原局是否已有同类信号", "大运和流年先后层次", "现实环境是否对应"],
    sourceRefs: normalizeSourceRefs(hit.sources, hit.sourceIds),
    confidence: hit.evidenceLevel === "traditional_consensus" ? "medium" : "low",
    status: hit.status ?? "active",
  }));
}

function buildCaseInterpretations(context) {
  const matches = matchCases(context).slice(0, 4);
  return matches.map((caseItem) => createInterpretation({
    id: `case-${caseItem.id}`,
    title: `相似案例：${caseItem.title ?? caseItem.id}`,
    category: "cases",
    reason: caseItem.matchedTags.length ? `案例标签命中：${caseItem.matchedTags.join("、")}。` : "案例结构与当前命盘有可比较字段。",
    learningLogic: "案例只用于学习相似结构如何被复盘，不能用单个案例反推当前命盘结论。",
    plainExplanation: caseItem.analysis ?? "案例匹配是学习参考，需要结合当前命盘重新验证。",
    evidence: normalizeTextList(caseItem.reasons).length ? normalizeTextList(caseItem.reasons) : caseItem.matchedTags,
    uncertaintyFactors: ["案例数量", "出生时间可靠性", "事件记录完整度"],
    sourceRefs: normalizeList(caseItem.sourceRefs),
    confidence: "low",
    status: "draft",
  }));
}

function matchCases(context) {
  return context.caseStudies
    .map((caseItem) => {
      const caseTags = normalizeTextList(caseItem.tags);
      const matchedTags = caseTags.filter((tag) => context.tags.some((readingTag) => includesEither(readingTag, tag)));
      return { ...caseItem, matchedTags, score: matchedTags.length };
    })
    .filter((caseItem) => caseItem.score > 0)
    .sort((left, right) => right.score - left.score || String(left.id).localeCompare(String(right.id)));
}

function createInterpretation(input) {
  return {
    matched: true,
    sourceRefs: [],
    confidence: "low",
    status: "draft",
    ...input,
    uncertaintyFactors: normalizeTextList(input.uncertaintyFactors).length ? normalizeTextList(input.uncertaintyFactors) : defaultUncertaintyFactors(),
  };
}

function buildRuleEvidence(rule, reason) {
  return [
    `触发规则：${rule.trigger ?? rule.category ?? rule.id}`,
    reason,
  ].filter(Boolean);
}

function deriveReason(conditions, context) {
  const reasons = [];
  if (conditions.always) reasons.push("该规则是通用学习规则。");
  if (conditions.dayStem) reasons.push(`日干为${context.pillars.day?.stem}。`);
  if (conditions.monthBranch) reasons.push(`月支为${context.pillars.month?.branch}。`);
  if (conditions.relationType) reasons.push(`命盘关系命中${conditions.relationType === "any" ? "基础干支关系" : conditions.relationType}。`);
  if (conditions.tenGod) reasons.push(`十神中出现${conditions.tenGod}。`);
  if (conditions.tenGodCount) reasons.push("十神数量满足学习条件。");
  if (conditions.elementStrength || conditions.elementCount) reasons.push("五行强弱满足学习条件。");
  if (conditions.dayMasterSeason) reasons.push("日主季节状态满足学习条件。");
  if (conditions.luckTrigger) reasons.push("岁运与原局发生关系触发。");
  if (conditions.caseTags) reasons.push("命盘标签与案例标签存在交集。");
  return reasons.join(" ") || "当前命盘满足规则条件。";
}

function buildGrouped(items) {
  const grouped = Object.fromEntries(GROUP_KEYS.map((key) => [key, []]));
  for (const item of items) {
    const key = GROUP_KEYS.includes(item.category) ? item.category : "structure";
    grouped[key].push(item);
  }
  return grouped;
}

function mapCategory(category, datasetKey) {
  if (category?.includes("blind")) return "blindCandidates";
  if (category?.includes("strength") || category?.includes("pattern")) return "strengthUsefulGods";
  if (category?.includes("case")) return "cases";
  if (category?.includes("reference") || category?.includes("output") || category?.includes("month_order")) return "structure";
  if (datasetKey === "blindCases" || datasetKey === "blindCoreMethods") return "blindCandidates";
  if (datasetKey === "strengthModel" || datasetKey === "patternsUsefulGods") return "strengthUsefulGods";
  if (datasetKey === "caseStudies") return "cases";
  return "structure";
}

function groupRank(category) {
  const index = GROUP_KEYS.indexOf(category);
  return index === -1 ? 0 : index;
}

function confidenceRank(confidence) {
  return { high: 3, medium: 2, low: 1 }[confidence] ?? 0;
}

function matchesRelationType(expected, relations) {
  if (expected === "any") return relations.length > 0;
  return relations.some((relation) => [relation.type, relation.effect, relation.relation, relation.title, relation.description]
    .filter(Boolean)
    .some((value) => String(value).includes(expected)));
}

function matchesElementStrength(condition, context) {
  const items = Array.isArray(condition) ? condition : [condition];
  return items.every((item) => {
    if (typeof item === "string") return context.strengthSignals.some((signal) => signal.seasonalStatus === item || signal.element === item);
    const element = item.element;
    if (!element) return false;
    const value = Number(context.elements[element] ?? 0);
    if (item.state === "strong") return value >= 3 || isExtremeElement(context.elements, element, "max");
    if (item.state === "weak") return value <= 1 || isExtremeElement(context.elements, element, "min");
    if (item.seasonalStatus) return context.strengthSignals.some((signal) => signal.element === element && signal.seasonalStatus === item.seasonalStatus);
    return compareNumber(value, item.operator ?? ">=", Number(item.value ?? 1));
  });
}

function matchesDayMasterSeason(condition, dayMasterSeason) {
  if (!dayMasterSeason) return false;
  if (condition === "any") return true;
  if (typeof condition === "string") return dayMasterSeason.seasonalStatus === condition || dayMasterSeason.element === condition;
  if (condition.status && condition.status !== dayMasterSeason.seasonalStatus) return false;
  if (condition.element && condition.element !== dayMasterSeason.element) return false;
  return true;
}

function matchesCaseTags(expected, tags) {
  const expectedTags = normalizeTextList(expected);
  return expectedTags.some((tag) => tags.some((readingTag) => includesEither(readingTag, tag)));
}

function countConditionMatches(condition, counts, targetKey) {
  const items = Array.isArray(condition) ? condition : [condition];
  return items.every((item) => {
    const key = item?.[targetKey];
    if (!key) return false;
    return compareNumber(Number(counts[key] ?? 0), item.operator ?? ">=", Number(item.value ?? 1));
  });
}

function compareNumber(left, operator, right) {
  if (operator === ">") return left > right;
  if (operator === ">=") return left >= right;
  if (operator === "<") return left < right;
  if (operator === "<=") return left <= right;
  if (operator === "=" || operator === "==") return left === right;
  return false;
}

function collectReadingTags(reading) {
  return uniqueText([
    ...(reading?.natal?.combinations ?? []).flatMap((item) => [item.title, item.effect, ...(item.members ?? [])]),
    ...(reading?.transit?.triggers ?? []).flatMap((item) => [item.title, item.effect, ...(item.members ?? [])]),
    ...(reading?.transit?.hits ?? []).flatMap((item) => [item.title, item.relation]),
    ...(reading?.natal?.tenGods ?? []).map((item) => item.name),
    ...Object.entries(reading?.natal?.elements ?? {}).map(([key, value]) => `${ELEMENT_LABELS[key] ?? key}${formatNumber(value)}`),
    ...(reading?.natal?.patternCandidates ?? []).map((item) => item.name ?? item.title),
    ...(reading?.natal?.referenceKnowledgeHits ?? []).flatMap((item) => [item.title, ...(item.tags ?? [])]),
  ]);
}

function getExtremeElements(elements, mode) {
  const entries = ELEMENT_KEYS.map((element) => ({ element, value: Number(elements[element] ?? 0) }));
  const target = mode === "max"
    ? Math.max(...entries.map((item) => item.value))
    : Math.min(...entries.map((item) => item.value));
  return entries.filter((item) => item.value === target).sort((left, right) => ELEMENT_KEYS.indexOf(left.element) - ELEMENT_KEYS.indexOf(right.element));
}

function isExtremeElement(elements, element, mode) {
  return getExtremeElements(elements, mode).some((item) => item.element === element);
}

function formatMembers(relation) {
  const members = relation.members ?? relation.ganzhi ?? [];
  const sources = relation.sources ?? relation.pillars ?? [];
  if (members.length && sources.length) return `${members.join("、")}（${sources.join("、")}）`;
  if (members.length) return members.join("、");
  return relation.title ?? relation.relation ?? "当前命盘";
}

function normalizeSourceRefs(sources, sourceIds) {
  const refs = [];
  for (const source of normalizeTextList(sources)) refs.push({ note: source });
  for (const sourceId of normalizeTextList(sourceIds)) refs.push({ sourceId });
  return refs;
}

function sanitizeInterpretation(item) {
  return sanitizeValue(item);
}

function sanitizeValue(value) {
  if (typeof value === "string") return value.replace(FORBIDDEN_TEXT, "不能单独作为结论");
  if (Array.isArray(value)) return value.map(sanitizeValue);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, sanitizeValue(item)]));
  }
  return value;
}

function normalizeList(value) {
  if (!value) return [];
  return Array.isArray(value) ? value.filter(Boolean) : [value].filter(Boolean);
}

function normalizeTextList(value) {
  return normalizeList(value).map((item) => String(item ?? "").trim()).filter(Boolean);
}

function countBy(values) {
  return values.reduce((acc, value) => {
    acc[value] = Number(acc[value] ?? 0) + 1;
    return acc;
  }, {});
}

function uniqueText(values) {
  return [...new Set(normalizeTextList(values))];
}

function includesEither(left, right) {
  const a = String(left ?? "");
  const b = String(right ?? "");
  return Boolean(a && b && (a.includes(b) || b.includes(a)));
}

function formatNumber(value) {
  return new Intl.NumberFormat("zh-CN", { maximumFractionDigits: 1 }).format(Number(value ?? 0));
}

function dedupeById(items) {
  const seen = new Set();
  return items.filter((item) => {
    const key = item.id ?? item.title;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function defaultUncertaintyFactors() {
  return ["柱位语境", "十神旺衰", "岁运是否触发"];
}
