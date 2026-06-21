import { buildTwelveDomainPortrait } from "../domain/domainNarrativeEngine.js";
import { buildDomainEvidence } from "../domain/domainEvidenceEngine.js";
import { buildAtomicNatalFacts } from "../natal/atomicNatalFactEngine.js";
import { buildNatalFeatureVector } from "../natal/natalFeatureVector.js";

const elementLabels = { wood: "木", fire: "火", earth: "土", metal: "金", water: "水" };
const elementImages = {
  wood: "生发、规划、伸展、重成长",
  fire: "表达、热度、传播、重反馈",
  earth: "承载、稳定、整合、重落地",
  metal: "标准、边界、裁断、重规则",
  water: "流动、信息、适应、重变化",
};
const tenGodGroups = {
  peer: ["比肩", "劫财", "日主"],
  resource: ["正印", "偏印"],
  output: ["食神", "伤官"],
  wealth: ["正财", "偏财"],
  officer: ["正官", "七杀"],
};
const topicOrder = ["personality", "family", "study_skill", "career", "wealth", "relationship", "health", "movement", "life_pattern"];

export function buildNatalImageReport({ chart, baseBaziViewModel } = {}) {
  const safeChart = chart ?? {};
  const viewModel = baseBaziViewModel ?? {};
  const structure = safeChart.structureAnalysis ?? viewModel.structureAnalysis ?? {};
  const context = createContext(safeChart, viewModel, structure);
  const imageCards = [
    buildPersonalityCard(context),
    buildFamilyCard(context),
    buildStudySkillCard(context),
    buildCareerCard(context),
    buildWealthCard(context),
    buildRelationshipCard(context),
    buildHealthCard(context),
    buildMovementCard(context),
    buildLifePatternCard(context),
  ].map(normalizeCard);
  const report = {
    summary: buildSummary(context, imageCards),
    imageCards,
    keySignals: buildKeySignals(context, imageCards),
    weakSignals: buildWeakSignals(context),
    needVerify: buildNeedVerify(context, imageCards),
  };
  const featureVector = buildNatalFeatureVector({ chart: safeChart, baseBaziViewModel: viewModel });
  const atomicFacts = buildAtomicNatalFacts(featureVector);
  const domainEvidence = buildDomainEvidence({
    chart: safeChart,
    baseBaziViewModel: viewModel,
    natalImageReport: report,
    featureVector,
    atomicFacts,
  });
  const twelveDomains = buildTwelveDomainPortrait({
    chart: safeChart,
    baseBaziViewModel: viewModel,
    natalImageReport: report,
    featureVector,
    atomicFacts,
    domainEvidence,
  });
  const hitList = buildNatalHitListFromFacts(atomicFacts.facts);
  return {
    ...report,
    featureVector,
    atomicFacts,
    domainEvidence,
    twelveDomains,
    hitList,
    natalDebug: {
      featureVector,
      atomicFacts,
      domainEvidence,
      hitList,
    },
  };
}

function buildNatalHitListFromFacts(facts = []) {
  return facts
    .filter((fact) => fact.score >= 58 && fact.specificity !== "generic")
    .slice(0, 18)
    .map((fact) => ({
      id: fact.id,
      name: fact.label,
      category: categoryLabel(fact.category),
      score: fact.score,
      importance: fact.score >= 78 ? "high" : fact.score >= 66 ? "medium" : "low",
      domains: fact.domains,
      supports: fact.domains,
      evidence: fact.evidence ?? [],
      specificity: fact.specificity ?? "medium",
      source: "原子命理事实",
      brief: fact.meaning,
      image: fact.tags ?? [],
      confidence: fact.score >= 78 ? "high" : fact.score >= 66 ? "medium" : "low",
    }));
}

function categoryLabel(category = "") {
  return {
    day_master: "日主象",
    ten_god: "十神象",
    combination: "组合象",
    relation: "关系象",
    pillar: "柱位象",
    element: "五行象",
  }[category] ?? "结构象";
}

function createContext(chart, viewModel, structure) {
  const pillars = chart.pillars ?? {};
  const details = chart.pillarDetails ?? {};
  const dayMaster = chart.dayMaster ?? {};
  const dominantElements = chart.dominantElements ?? viewModel.fiveElements?.dominant ?? [];
  const tenGodCounts = sumCountMaps(
    viewModel.tenGods?.mainQi ?? chart.tenGodStats?.mainQi ?? {},
    viewModel.tenGods?.fullHidden ?? chart.tenGodStats?.fullHidden ?? {},
  );
  const groupCounts = Object.fromEntries(Object.entries(tenGodGroups).map(([group, names]) => [
    group,
    names.reduce((sum, name) => sum + Number(tenGodCounts[name] ?? 0), 0),
  ]));
  const relations = Array.isArray(chart.relations) ? chart.relations : [];
  const monthCommand = structure.monthCommand ?? {};
  const strength = structure.strength ?? {};
  const roots = structure.roots ?? {};
  const stems = structure.stems ?? {};
  const climate = structure.climate ?? {};
  const usefulGodHint = structure.usefulGodHint ?? {};
  const dominant = dominantElements[0] ?? {};
  const dayElement = dayMaster.element ?? monthCommand.dayMasterElement ?? "";
  const relationTypes = [...new Set(relations.map((item) => item.type))];
  return {
    chart,
    viewModel,
    structure,
    pillars,
    details,
    dayMaster,
    dayElement,
    dayElementLabel: elementLabels[dayElement] ?? dayElement,
    dominant,
    dominantLabel: dominant.label ?? elementLabels[dominant.element] ?? "待查",
    dominantImage: elementImages[dominant.element] ?? "结构特征待复核",
    tenGodCounts,
    groupCounts,
    relations,
    relationTypes,
    monthCommand,
    strength,
    roots,
    stems,
    climate,
    usefulGodHint,
  };
}

function buildSummary(context, cards) {
  const strengthText = context.strength.level ?? "mixed";
  const mainStructure = `${context.dayMaster.label ?? "日主"}，月令${context.monthCommand.branch ?? "待查"}，强弱初判为${strengthText}`;
  return {
    title: "原局整体取象",
    dayMaster: context.dayMaster.label ?? "",
    mainStructure,
    mainImage: `原局以${context.dominantLabel}气较明为主要结构观察，整体偏向${context.dominantImage}。`,
    strengthLevel: strengthText,
    usefulHint: context.usefulGodHint.reasoning ?? "初步倾向，需结合格局、通关、调候复核。",
    confidence: cards.some((card) => card.confidence === "low") ? "medium" : "medium",
    boundary: "原局取象只看出生盘结构，不看大运、流年、流月；后续实际应象需要岁运触发与现实背景复核。",
  };
}

function buildPersonalityCard(context) {
  const isInSeason = Boolean(context.monthCommand.isDayMasterInSeason);
  return {
    topic: "personality",
    title: `${context.dayElementLabel || "日主"}气为底，${context.dominantLabel}象较明`,
    level: isInSeason || context.strength.score >= 55 ? "high" : "medium",
    evidence: compact([
      `日主为${context.dayMaster.label ?? "待查"}`,
      `月令${context.monthCommand.branch ?? "待查"}，${isInSeason ? "日主得令" : "日主未直接得令"}`,
      context.roots.dayMasterRootLevel ? `通根综合为${context.roots.dayMasterRootLevel}` : "",
      context.dominantLabel ? `主导五行见${context.dominantLabel}` : "",
    ]),
    image: `${elementImages[context.dayElement] ?? "自我表达方式需复核"}，同时受${context.dominantLabel}气影响。`,
    reality: "现实中可先观察其做事标准、反应速度、稳定性、表达方式与边界感，再回到原局证据复核。",
    boundary: "性格底色不能单看日主五行，若透干、月令或冲合牵引明显，外在表现会有调整。",
    confidence: "medium",
  };
}

function buildFamilyCard(context) {
  const month = context.pillars.month ?? {};
  const year = context.pillars.year ?? {};
  const relationEvidence = relationSummary(context, ["地支六冲", "地支六害", "地支穿", "地支六破"]);
  return {
    topic: "family",
    title: "年柱月柱看早年与家庭结构",
    level: relationEvidence ? "medium" : "low",
    evidence: compact([
      `年柱${year.label ?? "待查"}为外部背景观察位`,
      `月柱${month.label ?? "待查"}为家庭、月令与成长环境重点位`,
      context.monthCommand.description,
      relationEvidence,
    ]),
    image: "家庭背景先看年柱外部环境与月柱成长秩序，若年/月受冲合刑害牵动，早年环境的稳定度需重点复核。",
    reality: "现实中可对应父母分工、居住环境、家中规则、早年资源与压力来源。",
    boundary: "家庭取象需要结合真实家庭结构，不宜仅凭单一柱位作结论。",
    confidence: "medium",
  };
}

function buildStudySkillCard(context) {
  const output = context.groupCounts.output;
  const resource = context.groupCounts.resource;
  return {
    topic: "study_skill",
    title: output >= resource ? "输出表达与技能落地需观察" : "印星学习与吸收能力需观察",
    level: output + resource >= 3 ? "high" : "medium",
    evidence: compact([
      `印星计数约${resource}`,
      `食伤计数约${output}`,
      context.stems.hasResource ? "天干见印星透出" : "天干印星透出不明显",
      context.stems.hasOutput ? "天干见食伤透出" : "天干食伤透出不明显",
    ]),
    image: output >= resource
      ? "技能形成更偏表达、输出、项目实践和可见成果。"
      : "技能形成更偏吸收、归纳、证照、体系学习和经验沉淀。",
    reality: "现实中可观察其学习路径是靠系统训练、证照规范，还是靠实作表达、项目反馈来成型。",
    boundary: "学业技能取象需结合教育经历和行业场景，印星或食伤只提供结构方向。",
    confidence: "medium",
  };
}

function buildCareerCard(context) {
  const officer = context.groupCounts.officer;
  const output = context.groupCounts.output;
  const resource = context.groupCounts.resource;
  return {
    topic: "career",
    title: officer >= output ? "规则岗位与职责压力较需观察" : "输出项目与技能交付较需观察",
    level: officer + output + resource >= 4 ? "high" : "medium",
    evidence: compact([
      `官杀计数约${officer}`,
      `食伤计数约${output}`,
      `印星计数约${resource}`,
      context.stems.hasOfficerKilling ? "天干见官杀透出" : "天干官杀透出不明显",
      context.stems.hasOutput ? "天干见食伤透出" : "",
    ]),
    image: officer >= output
      ? "事业结构更容易围绕规则、职责、岗位身份、考核压力来展开。"
      : "事业结构更容易围绕表达输出、技术项目、交付成果和市场反馈来展开。",
    reality: "现实中可观察岗位是否重流程、标准、审核、管理，或更重项目、作品、技术、销售表达。",
    boundary: "事业方向仍需结合专业背景与行业环境，原局只提供倾向，不替代职业选择判断。",
    confidence: "medium",
  };
}

function buildWealthCard(context) {
  const wealth = context.groupCounts.wealth;
  const output = context.groupCounts.output;
  return {
    topic: "wealth",
    title: wealth > 0 ? "财星有迹，财务方式需看承载力" : "财星不显，财务方式需从输出与资源转化看",
    level: wealth >= 2 ? "high" : "medium",
    evidence: compact([
      `财星计数约${wealth}`,
      `食伤计数约${output}`,
      context.stems.hasWealth ? "天干见财星透出" : "天干财星透出不明显",
      `日主强弱初判为${context.strength.level ?? "待查"}`,
    ]),
    image: wealth > 0
      ? "财务取象偏向资源调度、交易意识、现实收益与责任承接。"
      : "财务取象更宜观察技能输出、平台资源或长期积累如何转成收益。",
    reality: "现实中可看收入来源是否来自固定岗位、项目交易、资源整合、专业技能或家庭资产。",
    boundary: "财星不等于实际财富，需结合日主承载力、行业路径和后续岁运触发复核。",
    confidence: "medium",
  };
}

function buildRelationshipCard(context) {
  const dayBranch = context.pillars.day?.branch ?? "";
  const dayDetail = context.details.day ?? {};
  const spouseRelation = context.relations.find((relation) => relation.pillars?.includes("日柱"));
  return {
    topic: "relationship",
    title: spouseRelation ? "日支受关系牵动，关系模式需复核" : "日支为关系宫，先看稳定与互动方式",
    level: spouseRelation ? "high" : "medium",
    evidence: compact([
      `日支${dayBranch || "待查"}作为配偶宫观察位`,
      dayDetail.branchMainTenGod ? `日支主气十神为${dayDetail.branchMainTenGod}` : "",
      spouseRelation ? spouseRelation.evidence : "原局日柱未见明显冲合刑害穿破直接列出",
      context.climate.coldWarm ? `整体寒暖提示为${context.climate.coldWarm}` : "",
    ]),
    image: spouseRelation
      ? "关系模式容易带有拉扯、牵连、边界调整或反复沟通的结构提示。"
      : "关系模式先看日支主气、日主强弱与整体寒暖，偏向从互动节奏和边界感入手。",
    reality: "现实中可观察亲密关系中的安全感、边界、沟通方式、承诺节奏和现实责任分配。",
    boundary: "原局关系宫只说明关系模式，不直接对应婚恋事件；有无对象、关系阶段和岁运触发必须复核。",
    confidence: spouseRelation ? "medium" : "low",
  };
}

function buildHealthCard(context) {
  return {
    topic: "health",
    title: "体质先看五行偏重与寒暖燥湿",
    level: context.climate.coldWarm !== "平" || context.climate.dryWet !== "平" ? "medium" : "low",
    evidence: compact([
      `寒暖提示：${context.climate.coldWarm ?? "待查"}`,
      `燥湿提示：${context.climate.dryWet ?? "待查"}`,
      context.climate.reasons?.[0],
      context.dominantLabel ? `主导五行见${context.dominantLabel}` : "",
    ]),
    image: "健康体质先从寒热、燥湿、五行偏重与作息承载观察，作为生活习惯复核入口。",
    reality: "现实中可对应睡眠、消化、皮肤、呼吸、循环、压力反应等长期体感线索。",
    boundary: "健康取象不是医学诊断，如有不适应以专业医疗意见为准。",
    confidence: "low",
  };
}

function buildMovementCard(context) {
  const movementRelations = relationSummary(context, ["地支六冲", "反吟", "天克地冲", "地支六破"]);
  const hour = context.pillars.hour ?? {};
  return {
    topic: "movement",
    title: movementRelations ? "原局有动象，环境变化需观察" : "迁动环境先看时柱与冲动关系",
    level: movementRelations ? "high" : "low",
    evidence: compact([
      movementRelations,
      `时柱${hour.label ?? "待查"}为执行、远景与结果层观察位`,
      context.relationTypes.length ? `原局关系类型见${context.relationTypes.join("、")}` : "原局未列出明显冲动关系",
    ]),
    image: movementRelations
      ? "环境取象带有迁动、转换、往返、空间调整或节奏变化的提示。"
      : "迁动取象暂不突出，更适合结合职业、家庭和后续岁运触发再看。",
    reality: "现实中可观察搬家、通勤、出差、跨城、岗位环境变化或生活节奏切换。",
    boundary: "原局动象不直接等同实际迁移，是否落地需要大运流年触发和现实计划承接。",
    confidence: movementRelations ? "medium" : "low",
  };
}

function buildLifePatternCard(context) {
  return {
    topic: "life_pattern",
    title: "人生主线先看月令、强弱与五行流向",
    level: "medium",
    evidence: compact([
      context.monthCommand.description,
      `日主强弱初判为${context.strength.level ?? "待查"}`,
      `用忌神提示：${context.usefulGodHint.reasoning ?? "待复核"}`,
      context.relationTypes.length ? `关系结构见${context.relationTypes.join("、")}` : "",
    ]),
    image: "原局主线可先理解为日主承载力、月令环境、透干事务与关系牵引之间的组合。",
    reality: "现实中可观察其长期重复出现的选择模式：重规则、重表达、重资源、重关系或重稳定。",
    boundary: "人生主线是结构归纳，不是事件判断；后续仍需结合大运、流年、流月逐层验证。",
    confidence: "medium",
  };
}

function buildKeySignals(context, cards) {
  return compact([
    context.dayMaster.label ? `日主：${context.dayMaster.label}` : "",
    context.monthCommand.branch ? `月令：${context.monthCommand.branch}，${context.monthCommand.description}` : "",
    context.roots.dayMasterRootLevel ? `通根：${context.roots.dayMasterRootLevel}` : "",
    context.strength.level ? `强弱初判：${context.strength.level}，分值${context.strength.score}` : "",
    context.dominantLabel ? `主导五行：${context.dominantLabel}` : "",
    context.relationTypes.length ? `干支关系：${context.relationTypes.join("、")}` : "",
    `重点卡片：${cards.filter((card) => card.level === "high").map((card) => card.title).join("；") || "以中低强度结构观察为主"}`,
  ]);
}

function buildWeakSignals(context) {
  return compact([
    context.strength.counterReasons?.[0],
    context.roots.dayMasterRootLevel === "none" ? "日主根气不显，承载力需谨慎复核。" : "",
    !context.stems.hasWealth ? "财星天干透出不明显，财务取象需看转化路径。" : "",
    !context.stems.hasOfficerKilling ? "官杀天干透出不明显，岗位压力与规则身份需结合现实复核。" : "",
    !context.relationTypes.length ? "原局干支关系命中较少，事件牵引不宜放大。" : "",
  ]);
}

function buildNeedVerify(context, cards) {
  return compact([
    "出生时间、真太阳时和节气边界是否已复核",
    "现实性格表现是否更接近日主五行，还是更受月令与透干事务牵引",
    "家庭、学业、职业、关系等现实背景是否能承接对应结构",
    "健康体质相关内容只作生活观察，如有不适需以专业医疗意见为准",
    ...cards.map((card) => card.boundary),
    context.usefulGodHint.reasoning,
  ]).slice(0, 14);
}

function relationSummary(context, relationTypes) {
  const hit = context.relations.find((relation) => relationTypes.includes(relation.type));
  return hit ? hit.evidence : "";
}

function normalizeCard(card) {
  return {
    topic: card.topic,
    title: card.title,
    level: ["high", "medium", "low"].includes(card.level) ? card.level : "medium",
    evidence: compact(card.evidence).slice(0, 6),
    image: card.image || "取象待复核。",
    reality: card.reality || "需结合现实背景复核。",
    boundary: card.boundary || "此卡只作结构观察，不作事件结论。",
    confidence: ["high", "medium", "low"].includes(card.confidence) ? card.confidence : "medium",
  };
}

function sumCountMaps(...maps) {
  const result = {};
  for (const map of maps) {
    for (const [key, value] of Object.entries(map || {})) {
      result[key] = (result[key] || 0) + Number(value || 0);
    }
  }
  return result;
}

function compact(items = []) {
  return (Array.isArray(items) ? items : [items])
    .flat()
    .filter((item) => item !== undefined && item !== null && String(item).trim())
    .map((item) => String(item));
}
