const ELEMENT_LABELS = { wood: "木", fire: "火", earth: "土", metal: "金", water: "水" };
const ELEMENT_KEYS = ["wood", "fire", "earth", "metal", "water"];
const STEMS = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const BRANCHES = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
const TEN_GOD_NAMES = ["比肩", "劫财", "食神", "伤官", "正财", "偏财", "正官", "七杀", "正印", "偏印"];

const FALLBACK_TEN_GOD_GROUP_RULES = [
  groupRule("resource", "印星", ["正印", "偏印"]),
  groupRule("output", "食伤", ["食神", "伤官"]),
  groupRule("wealth", "财星", ["正财", "偏财"]),
  groupRule("authority", "官杀", ["正官", "七杀"]),
  groupRule("peer", "比劫", ["比肩", "劫财"]),
];
const FALLBACK_PALACE_RULES = [
  palaceRule("year", ["来源", "早年", "外缘"]),
  palaceRule("month", ["月令", "环境", "秩序"]),
  palaceRule("day", ["日主", "日支", "自身参照"]),
  palaceRule("hour", ["后续", "子女", "长期计划"]),
];
const FALLBACK_RELATION_RULES = [
  relationRule("地支六破", ["地支六破", "六破", "破"], ["破损", "反复", "结构松动"], "high"),
  relationRule("合", ["天干五合", "地支六合", "三合", "三会", "合"], ["牵连", "合作", "合化线索"]),
  relationRule("冲", ["地支六冲", "六冲", "冲"], ["变动", "推动", "对冲"]),
  relationRule("刑", ["三刑", "刑"], ["摩擦", "规则", "压力"]),
  relationRule("害", ["六害", "害"], ["暗耗", "牵制", "隐性摩擦"]),
  relationRule("伏吟", ["伏吟"], ["重复", "加重", "同象"], "high"),
  relationRule("反吟", ["反吟"], ["对照", "反复", "翻动"]),
];

export function buildCoreSignals(input = {}, displayOrDatasets, maybeDatasets) {
  const natal = input?.natal ?? input ?? {};
  const explicitDisplay = isDisplayLike(displayOrDatasets) ? displayOrDatasets : undefined;
  const datasets = maybeDatasets ?? (explicitDisplay ? {} : displayOrDatasets) ?? input?.datasets ?? {};
  const display = explicitDisplay ?? natal.basicBaziDisplay ?? {};
  const rules = collectRuleSets(datasets);
  const context = buildContext(natal, display, rules);
  const dayMaster = buildDayMaster(context);
  const monthCommand = buildMonthCommand(context);
  const elementSignals = buildElementSignals(context);
  const tenGodSignals = buildTenGodSignals(context);
  const relationSignals = buildRelationSignals(context);
  const palaceSignals = buildPalaceSignals(context);
  const topicTags = buildTopicTags({ elementSignals, tenGodSignals, relationSignals, rules });
  const transitHooks = buildTransitHooks({ tenGodSignals, relationSignals });
  const cautions = buildCautions(context);

  return { dayMaster, monthCommand, elementSignals, tenGodSignals, relationSignals, palaceSignals, topicTags, transitHooks, cautions };
}

function buildContext(natal, display, rules) {
  const pillars = natal.pillars ?? display.pillars ?? {};
  return {
    natal,
    display,
    rules,
    pillars,
    calendar: display.calendar ?? natal.chartMeta?.calendar ?? {},
    elementCounts: normalizeElementCounts(natal.elements, display.elementStats?.visible?.counts),
    visibleElementCounts: normalizeElementCounts(display.elementStats?.visible?.counts),
    hiddenElementCounts: normalizeElementCounts(display.elementStats?.hidden?.counts),
    tenGodCounts: buildTenGodCounts(natal, display),
    combinations: asArray(natal.combinations),
    displayRelations: asArray(display.relations),
    pairInteractions: asArray(natal.pairInteractions),
  };
}

function buildDayMaster(context) {
  const day = context.pillars.day ?? {};
  const element = day.stemElement ?? context.display.pillars?.day?.stemElement;
  return withMeta({
    stem: day.stem ?? context.display.pillars?.day?.stem ?? "",
    element,
    label: `${day.stem ?? ""}${ELEMENT_LABELS[element] ?? ""}日主`,
    evidence: [`日柱：${day.label ?? context.display.pillars?.day?.ganzhi ?? "待查"}`, "日干作为取象参照点"],
    confidence: "high",
    needVerify: ["日主强弱需要结合月令、五行和岁运继续验证"],
  });
}

function buildMonthCommand(context) {
  const month = context.pillars.month ?? {};
  const element = month.branchElement ?? context.display.pillars?.month?.branchElement;
  return withMeta({
    branch: month.branch ?? context.display.pillars?.month?.branch ?? "",
    element,
    label: `${month.branch ?? ""}${ELEMENT_LABELS[element] ?? ""}月令`,
    evidence: [
      `月柱：${month.label ?? context.display.pillars?.month?.ganzhi ?? "待查"}`,
      context.calendar.solarTermRange ? `节气区间：${context.calendar.solarTermRange}` : "月柱采用节气排月",
    ],
    confidence: "high",
    needVerify: ["靠近节气边界时需要复核具体节气时刻"],
  });
}

function buildElementSignals(context) {
  const ranking = rankCounts(context.elementCounts, ELEMENT_KEYS);
  const strongRule = firstRule(context.rules.element, "elementSignals.strong");
  const weakRule = firstRule(context.rules.element, "elementSignals.weak");
  const missingRule = firstRule(context.rules.element, "elementSignals.missingVisible");
  const strongLimit = Number(strongRule?.conditions?.maxItems ?? 2);
  const weakLimit = Number(weakRule?.conditions?.maxItems ?? 2);
  const strong = ranking.slice(0, strongLimit).map(([element, value]) => elementSignal(element, value, strongRule, "偏重"));
  const weak = [...ranking].reverse().slice(0, weakLimit).map(([element, value]) => elementSignal(element, value, weakRule, "偏少"));
  const missingVisible = ELEMENT_KEYS
    .filter((element) => compareNumber(Number(context.visibleElementCounts[element] ?? 0), missingRule?.conditions?.operator ?? "=", Number(missingRule?.conditions?.value ?? 0)))
    .map((element) => elementSignal(element, 0, missingRule, "明面不见"));
  return withMeta({
    strong,
    weak,
    missingVisible,
    evidence: [`五行统计：${formatElementCounts(context.elementCounts)}`],
    confidence: "medium",
    needVerify: ["五行偏重偏少只是数量入口，还需要结合月令、藏干和组合关系"],
  });
}

function elementSignal(element, value, rule, fallbackStatus) {
  const label = ELEMENT_LABELS[element] ?? element;
  return withMeta({
    element,
    label,
    value,
    status: rule?.outputs?.status ?? fallbackStatus,
    evidence: [renderTemplate(rule?.evidenceTemplate, { element, elementLabel: label, value: formatNumber(value) }) || `${label}：${formatNumber(value)}`],
    confidence: rule?.confidence ?? (fallbackStatus === "明面不见" ? "high" : "medium"),
    needVerify: rule?.needVerify ?? ["需要结合旺衰、透藏和岁运补充复核"],
  });
}

function buildTenGodSignals(context) {
  const counts = context.tenGodCounts;
  const ranked = rankCounts(counts, TEN_GOD_NAMES);
  const strongRule = firstRule(context.rules.tenGod, "tenGodSignals.strong");
  const weakRule = firstRule(context.rules.tenGod, "tenGodSignals.weak");
  const strong = ranked
    .filter(([, count]) => count >= Number(strongRule?.conditions?.minCount ?? 1))
    .slice(0, Number(strongRule?.conditions?.maxItems ?? 3))
    .map(([name, count]) => tenGodSignal(name, count, strongRule, strongRule?.outputs?.status ?? "突出"));
  const zeroItems = ranked.filter(([, count]) => count === 0);
  const weakSource = weakRule?.conditions?.rank === "zeroOrBottom" && zeroItems.length ? zeroItems : [...ranked].reverse();
  const weak = weakSource.slice(0, Number(weakRule?.conditions?.maxItems ?? 3))
    .map(([name, count]) => tenGodSignal(name, count, weakRule, count === 0 ? weakRule?.outputs?.zeroStatus ?? "不显" : weakRule?.outputs?.bottomStatus ?? "偏弱"));
  const groups = buildTenGodGroups(context.rules.tenGod, counts);
  return withMeta({
    strong,
    weak,
    groups,
    evidence: [`十神统计：${formatTenGodCounts(counts)}`],
    confidence: "medium",
    needVerify: ["十神数量不能单独作为结论，需要结合柱位、旺衰和岁运"],
  });
}

function buildTenGodGroups(rules, counts) {
  const groupRules = rules.filter((rule) => rule.category === "tenGodSignals.groups");
  const source = groupRules.length ? groupRules : FALLBACK_TEN_GOD_GROUP_RULES;
  return Object.fromEntries(source.map((rule) => {
    const key = rule.outputs?.key ?? rule.conditions?.group;
    const label = rule.outputs?.label ?? rule.name;
    const names = rule.outputs?.names ?? [];
    const count = names.reduce((sum, name) => sum + Number(counts[name] ?? 0), 0);
    return [key, withMeta({
      key,
      label,
      names,
      count,
      evidence: [renderTemplate(rule.evidenceTemplate, { count, group: key, groupLabel: label }) || `${label}：${count}`],
      confidence: rule.confidence ?? "medium",
      needVerify: rule.needVerify ?? ["十神分组需要结合所在柱位、透干和藏干层次"],
    })];
  }));
}

function tenGodSignal(name, count, rule, status) {
  return withMeta({
    name,
    count,
    status,
    evidence: [renderTemplate(rule?.evidenceTemplate, { name, count }) || `${name}：${count}`],
    confidence: count > 0 ? rule?.confidence ?? "medium" : "low",
    needVerify: rule?.needVerify ?? ["需要检查该十神来自天干、地支主气还是藏干"],
  });
}

function buildRelationSignals(context) {
  const relationRules = context.rules.relation.length ? context.rules.relation : FALLBACK_RELATION_RULES;
  const candidates = [
    ...context.displayRelations.map((relation) => fromDisplayRelation(relation, relationRules)),
    ...context.combinations.map((item) => fromCombination(item, relationRules)),
    ...context.pairInteractions.flatMap((pair) => fromPairInteraction(pair, relationRules)),
  ].filter(Boolean);
  return mergeRelationSignals(candidates)
    .sort((left, right) => confidenceScore(right.confidence) - confidenceScore(left.confidence) || right.evidence.length - left.evidence.length)
    .slice(0, 5);
}

function fromDisplayRelation(relation, rules) {
  const rule = findRelationRule(relation.type, rules);
  const type = rule?.outputs?.type ?? normalizeRelationType(relation.type, relation.members);
  return relationSignal({
    name: `${type}${normalizeList(relation.members).join("")}`,
    type,
    members: normalizeList(relation.members),
    pillars: normalizeList(relation.pillars),
    evidence: [`基础关系：${type}`, ...normalizeList(relation.ganzhi).map((item) => `干支：${item}`)],
    confidence: rule?.confidence ?? "high",
    rule,
  });
}

function fromCombination(item, rules) {
  const rule = findRelationRule(`${item.title ?? ""} ${item.effect ?? ""}`, rules);
  const type = rule?.outputs?.type ?? normalizeRelationType(item.title ?? item.effect, item.members);
  return relationSignal({
    name: item.title ?? `${type}${normalizeList(item.members).join("")}`,
    type,
    members: normalizeList(item.members),
    pillars: normalizeList(item.sources),
    evidence: [item.title, item.description].filter(Boolean),
    confidence: rule?.confidence ?? (item.evidenceLevel === "traditional_consensus" || item.status === "active" ? "high" : "medium"),
    rule,
  });
}

function fromPairInteraction(pair, rules) {
  return asArray(pair.directRelations).map((relation) => {
    const rule = findRelationRule(`${relation.title ?? ""} ${relation.effect ?? ""}`, rules);
    const type = rule?.outputs?.type ?? normalizeRelationType(relation.title ?? relation.effect, []);
    return relationSignal({
      name: `${pair.title}：${type}`,
      type,
      members: extractGanzhi(pair.title),
      pillars: extractPillars(pair.title),
      evidence: [pair.title, relation.title, relation.note].filter(Boolean),
      confidence: rule?.confidence ?? (relation.status === "active" ? "medium" : "low"),
      rule,
    });
  });
}

function relationSignal({ name, type, members, pillars, evidence, confidence, rule }) {
  const normalizedMembers = normalizeRelationMembers(type, members);
  return withMeta({
    name,
    type,
    members: normalizedMembers,
    pillars: normalizeList(pillars),
    meaningKeywords: rule?.outputs?.meaningKeywords ?? relationKeywords(type),
    evidence: normalizeList(evidence),
    confidence,
    needVerify: rule?.needVerify ?? ["关系取象需要回到柱位、十神和岁运触发复核"],
  });
}

function mergeRelationSignals(items) {
  const merged = new Map();
  for (const item of items) {
    const key = `${item.type}-${normalizeList(item.members).sort().join("")}`;
    const existing = merged.get(key);
    if (!existing) {
      merged.set(key, item);
      continue;
    }
    existing.pillars = uniqueList([...existing.pillars, ...item.pillars]);
    existing.evidence = uniqueList([...existing.evidence, ...item.evidence]);
    existing.confidence = confidenceScore(item.confidence) > confidenceScore(existing.confidence) ? item.confidence : existing.confidence;
  }
  return [...merged.values()];
}

function buildPalaceSignals(context) {
  const palaceRules = context.rules.palace.length ? context.rules.palace : FALLBACK_PALACE_RULES;
  return ["year", "month", "day", "hour"].map((key) => {
    const pillar = context.display.pillars?.[key] ?? context.pillars[key] ?? {};
    const rule = palaceRules.find((item) => item.conditions?.pillarKey === key || item.outputs?.pillarKey === key);
    return withMeta({
      pillarKey: key,
      pillarLabel: pillar.label ?? pillar.role ?? `${key}柱`,
      ganzhi: pillar.ganzhi ?? pillar.label ?? "",
      stemTenGod: pillar.stemTenGod,
      branchMainTenGod: pillar.branchMainTenGod,
      hiddenTenGods: asArray(pillar.hiddenStems).map((item) => ({ stem: item.stem, tenGod: item.tenGod, role: item.role })),
      basicMeaningKeywords: rule?.outputs?.basicMeaningKeywords ?? [],
      evidence: [
        renderTemplate(rule?.evidenceTemplate, { ganzhi: pillar.ganzhi ?? pillar.label ?? "待查" }) || `${pillar.label ?? key}：${pillar.ganzhi ?? pillar.label ?? "待查"}`,
        pillar.stemTenGod ? `天干十神：${pillar.stemTenGod}` : "",
        pillar.branchMainTenGod ? `地支主气十神：${pillar.branchMainTenGod}` : "",
      ].filter(Boolean),
      confidence: rule?.confidence ?? "medium",
      needVerify: rule?.needVerify ?? ["柱位含义只做基础取象，需要结合整体结构和岁运"],
    });
  });
}

function buildTopicTags({ elementSignals, tenGodSignals, relationSignals, rules }) {
  const topicRules = rules.topic.length ? rules.topic : [];
  if (topicRules.length) {
    return dedupeByName(topicRules.filter((rule) => rule.status !== "inactive" && topicRuleMatches(rule, { tenGodSignals, relationSignals, elementSignals }))
      .map((rule) => topicTagFromRule(rule, { tenGodSignals, relationSignals })));
  }
  return buildFallbackTopicTags({ elementSignals, tenGodSignals, relationSignals });
}

function buildFallbackTopicTags({ elementSignals, tenGodSignals, relationSignals }) {
  const tags = [];
  const groups = tenGodSignals.groups;
  const hasRelation = (keyword) => relationSignals.some((relation) => relation.type.includes(keyword));
  if (groups.resource.count >= 2 || tenGodSignals.strong.some((item) => groups.resource.names.includes(item.name))) tags.push(topicTag("学习资源明显", [`印星计数：${groups.resource.count}`], "medium"));
  if (groups.output.count <= 2 && !tenGodSignals.strong.some((item) => groups.output.names.includes(item.name))) tags.push(topicTag("表达输出偏弱", [`食伤计数：${groups.output.count}`], "low"));
  if (groups.authority.count > 0) tags.push(topicTag("规则压力存在", [`官杀计数：${groups.authority.count}`], "medium"));
  if (groups.wealth.count > 0) tags.push(topicTag("财星有线索", [`财星计数：${groups.wealth.count}`], "medium"));
  if (hasRelation("合")) tags.push(topicTag("关系有合", ["原局关系命中合类"], "medium"));
  if (hasRelation("破")) tags.push(topicTag("关系有破", ["原局关系命中破类"], "medium"));
  if (groups.resource.count > 0 || groups.authority.count > 0) tags.push(topicTag("适合看专业积累", [`印星${groups.resource.count}，官杀${groups.authority.count}`], "low"));
  if (elementSignals.weak.length || relationSignals.length) tags.push(topicTag("需要结合大运验证", ["原局信号需要岁运触发层复核"], "medium"));
  return dedupeByName(tags);
}

function topicTagFromRule(rule, context) {
  const groupName = rule.conditions?.tenGodGroupCount?.group;
  const evidenceContext = buildTopicEvidenceContext(context, groupName);
  return withMeta({
    name: rule.outputs?.name ?? rule.name,
    evidence: [renderTemplate(rule.evidenceTemplate, evidenceContext) || rule.name],
    confidence: rule.confidence ?? "low",
    needVerify: rule.needVerify,
  });
}

function buildTopicEvidenceContext({ tenGodSignals, relationSignals }, groupName) {
  const group = groupName ? tenGodSignals.groups[groupName] : undefined;
  return {
    count: group?.count ?? 0,
    resourceCount: tenGodSignals.groups.resource?.count ?? 0,
    authorityCount: tenGodSignals.groups.authority?.count ?? 0,
    relationCount: relationSignals.length,
    relationType: relationSignals.map((item) => item.type).join("、"),
  };
}

function topicRuleMatches(rule, { tenGodSignals, relationSignals, elementSignals }) {
  const conditions = rule.conditions ?? {};
  if (conditions.tenGodGroupCount && !groupCountMatches(conditions.tenGodGroupCount, tenGodSignals.groups)) return false;
  if (conditions.anyTenGodGroupCount && !conditions.anyTenGodGroupCount.some((item) => groupCountMatches(item, tenGodSignals.groups))) return false;
  if (conditions.relationTypeIncludes && !relationSignals.some((item) => item.type.includes(conditions.relationTypeIncludes))) return false;
  if (conditions.anyRelation && relationSignals.length === 0) return false;
  if (conditions.anyWeakElement && elementSignals.weak.length === 0) return false;
  return true;
}

function groupCountMatches(condition, groups) {
  return compareNumber(Number(groups[condition.group]?.count ?? 0), condition.operator ?? ">=", Number(condition.value ?? 1));
}

function topicTag(name, evidence, confidence) {
  return withMeta({ name, evidence, confidence, needVerify: ["标签只是索引，后续仍需结合柱位、旺衰和大运流年"] });
}

function buildTransitHooks({ tenGodSignals, relationSignals }) {
  const hooks = [];
  for (const relation of relationSignals) {
    if (!relation.members.length) continue;
    hooks.push(withMeta({
      name: `原局${relation.members.join("")}${relation.type}待岁运复核`,
      sourceType: "relation",
      triggerHint: `岁运再见${relation.members.join("、")}或冲合相关地支时复核`,
      evidence: relation.evidence,
      confidence: relation.confidence,
      needVerify: ["需要看大运、流年、流月是否再次引动同一组成员"],
    }));
  }
  for (const [key, group] of Object.entries(tenGodSignals.groups)) {
    if (group.count <= 0) continue;
    hooks.push(withMeta({
      name: `原局${group.label}有线索，岁运引动时复核`,
      sourceType: key,
      triggerHint: `岁运出现${group.names.join("、")}相关天干地支时复核`,
      evidence: group.evidence,
      confidence: "medium",
      needVerify: ["需要结合岁运落点、原局柱位和强弱层次"],
    }));
  }
  return hooks.slice(0, 8);
}

function buildCautions(context) {
  const calendar = context.calendar;
  return [
    caution("出生时间", [`原始时间：${calendar.originalTime ?? calendar.time ?? "待查"}`, `最终时间：${calendar.finalTime ?? calendar.time ?? "待查"}`]),
    caution("节气边界", [calendar.solarTermRange ?? "节气区间待查", calendar.solarTermBasis ?? "月柱按节气排月"]),
    caution("真太阳时", [`启用：${calendar.trueSolarTime?.enabled ? "是" : "否"}`, `应用：${calendar.trueSolarTime?.applied ? "是" : "否"}`]),
    caution("晚子时", [calendar.dayPillarRule ?? "23:00-23:59按次日计算日柱", `日柱日期：${calendar.dayPillarDate ?? "待查"}`]),
    caution("旺衰未定", ["当前 coreSignals 只做取象，不代替旺衰、格局、调候判断"], "medium"),
    caution("需要大运流年验证", ["原局信号需要结合大运、流年、流月触发层复核"], "medium"),
  ];
}

function caution(name, evidence, confidence = "high") {
  return withMeta({ name, evidence, confidence, needVerify: ["进入报告或判断前需要复核该项"] });
}

function collectRuleSets(datasets = {}) {
  return {
    tenGod: activeRules(datasets.tenGodSignalRules?.rules),
    element: activeRules(datasets.elementSignalRules?.rules),
    relation: activeRules(datasets.relationSignalRules?.rules),
    palace: activeRules(datasets.palaceSignalRules?.rules),
    topic: activeRules(datasets.topicTagRules?.rules),
  };
}

function activeRules(rules) {
  return asArray(rules).filter((rule) => rule?.status !== "inactive");
}

function firstRule(rules, category) {
  return rules.find((rule) => rule.category === category);
}

function findRelationRule(text, rules) {
  const source = String(text ?? "");
  return rules.find((rule) => normalizeList(rule.conditions?.typeIncludes).some((token) => source.includes(token)));
}

function buildTenGodCounts(natal, display) {
  const counts = { ...normalizeCountMap(natal.coreChart?.tenGodCounts) };
  for (const source of [display.tenGods?.stats?.fullHidden, display.tenGods?.stats?.mainQi, countRows(display.tenGods?.heavenlyStems), countRows(display.tenGods?.branchMain)]) {
    for (const [name, count] of Object.entries(normalizeCountMap(source))) {
      if (name === "日主") continue;
      counts[name] = Math.max(Number(counts[name] ?? 0), Number(count ?? 0));
    }
  }
  return counts;
}

function countRows(rows = []) {
  return asArray(rows).reduce((acc, row) => {
    const name = row.tenGod;
    if (name && name !== "日主") acc[name] = (acc[name] ?? 0) + 1;
    return acc;
  }, {});
}

function normalizeElementCounts(primary = {}, fallback = {}) {
  const source = Object.keys(primary ?? {}).length ? primary : fallback;
  return Object.fromEntries(ELEMENT_KEYS.map((key) => [key, Number(source?.[key] ?? 0)]));
}

function normalizeCountMap(value = {}) {
  return value && typeof value === "object" && !Array.isArray(value) ? { ...value } : {};
}

function rankCounts(counts, orderedKeys) {
  return orderedKeys
    .map((key) => [key, Number(counts?.[key] ?? 0)])
    .sort((left, right) => right[1] - left[1] || orderedKeys.indexOf(left[0]) - orderedKeys.indexOf(right[0]));
}

function normalizeRelationType(text = "", members = []) {
  const rule = findRelationRule(text, FALLBACK_RELATION_RULES);
  if (rule) return rule.outputs.type;
  return normalizeList(members).length ? "干支关系" : "关系";
}

function relationKeywords(type = "") {
  return findRelationRule(type, FALLBACK_RELATION_RULES)?.outputs?.meaningKeywords ?? ["结构关系"];
}

function extractPillars(text = "") {
  const matches = String(text).match(/[年月日时]柱/g);
  return uniqueList(matches ?? []);
}

function extractGanzhi(text = "") {
  const matches = String(text).match(/[甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥]/g);
  return uniqueList(matches ?? []);
}

function normalizeRelationMembers(type, members) {
  const values = normalizeList(members);
  if (type.includes("天干")) return sortByOrder(values.map((item) => item[0]).filter((item) => STEMS.includes(item)), STEMS);
  if (type.includes("地支") || ["合", "冲", "破", "害", "刑"].some((item) => type.includes(item))) {
    const branches = values
      .map((item) => item.length === 2 && STEMS.includes(item[0]) ? item[1] : item)
      .filter((item) => BRANCHES.includes(item));
    return sortByOrder(branches, BRANCHES);
  }
  return uniqueList(values);
}

function renderTemplate(template, values = {}) {
  if (!template) return "";
  return String(template).replace(/\{(\w+)\}/g, (_, key) => values[key] ?? "");
}

function compareNumber(actual, operator, expected) {
  if (operator === ">") return actual > expected;
  if (operator === ">=") return actual >= expected;
  if (operator === "<") return actual < expected;
  if (operator === "<=") return actual <= expected;
  if (operator === "=" || operator === "==") return actual === expected;
  return false;
}

function withMeta(signal) {
  return {
    ...signal,
    evidence: normalizeList(signal.evidence),
    confidence: signal.confidence ?? "low",
    needVerify: normalizeList(signal.needVerify).length ? normalizeList(signal.needVerify) : ["需要结合更多盘面证据复核"],
  };
}

function isDisplayLike(value) {
  return Boolean(value && typeof value === "object" && (
    value.pillars
    || value.elementStats
    || value.calendar
    || value.relations
    || value.tenGods?.stats
    || value.tenGods?.heavenlyStems
    || value.tenGods?.branchMain
  ));
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeList(value) {
  if (!value) return [];
  return (Array.isArray(value) ? value : [value]).map((item) => String(item ?? "").trim()).filter(Boolean);
}

function uniqueList(values) {
  return [...new Set(normalizeList(values))];
}

function sortByOrder(values, order) {
  return uniqueList(values).sort((left, right) => order.indexOf(left) - order.indexOf(right));
}

function dedupeByName(items) {
  const seen = new Set();
  return items.filter((item) => {
    if (seen.has(item.name)) return false;
    seen.add(item.name);
    return true;
  });
}

function confidenceScore(confidence) {
  return { high: 3, medium: 2, low: 1 }[confidence] ?? 0;
}

function formatNumber(value) {
  return new Intl.NumberFormat("zh-CN", { maximumFractionDigits: 1 }).format(Number(value ?? 0));
}

function formatElementCounts(counts) {
  return ELEMENT_KEYS.map((key) => `${ELEMENT_LABELS[key]}${formatNumber(counts[key])}`).join("、");
}

function formatTenGodCounts(counts) {
  return TEN_GOD_NAMES.filter((name) => Number(counts[name] ?? 0) > 0)
    .map((name) => `${name}${formatNumber(counts[name])}`)
    .join("、") || "未见突出十神";
}

function groupRule(key, label, names) {
  return {
    category: "tenGodSignals.groups",
    name: label,
    conditions: { group: key },
    outputs: { key, label, names },
    evidenceTemplate: `${label}：{count}`,
    confidence: "medium",
    needVerify: ["十神分组需要结合所在柱位、透干和藏干层次"],
    status: "active",
  };
}

function palaceRule(key, keywords) {
  return {
    category: "palaceSignals",
    name: key,
    conditions: { pillarKey: key },
    outputs: { pillarKey: key, basicMeaningKeywords: keywords },
    evidenceTemplate: "{ganzhi}",
    confidence: "medium",
    needVerify: ["柱位含义只做基础取象，需要结合整体结构和岁运"],
    status: "active",
  };
}

function relationRule(type, aliases, meaningKeywords, confidence = "medium") {
  return {
    category: "relationSignals",
    name: type,
    conditions: { typeIncludes: aliases },
    outputs: { type, meaningKeywords },
    confidence,
    needVerify: ["关系取象需要回到柱位、十神和岁运触发复核"],
    status: "active",
  };
}
