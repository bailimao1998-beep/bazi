import { atomicNatalRules } from "./atomicNatalRuleDatabase.js";
import { evaluateNatalRules } from "./natalRuleEvaluator.js";
import { resolveNatalFacts } from "./natalFactResolver.js";
import {
  buildAtomicFactContract,
} from "./facts/buildAtomicFactContract.js";
import {
  validateAtomicNatalFacts,
} from "./facts/atomicFactContract.js";

export function buildAtomicNatalFacts(
  featureVector = {},
) {
  /*
   * 基础事实：
   * 日主、透藏、关系、重复、五行、神煞。
   *
   * 不再从这里生成官印相生、食伤生财等高阶组合。
   */
  const baseFacts = buildDerivedFacts(
    featureVector,
  );

  /*
   * 高阶规则：
   * 统一交给数据化规则库评估。
   */
  const ruleEvaluation =
    evaluateNatalRules(
      featureVector,
      atomicNatalRules,
    );

  /*
   * 合并、去重、冲突与主次处理。
   */
  const resolved =
    resolveNatalFacts([
      ...baseFacts,
      ...ruleEvaluation.facts,
    ]);
  const contract =
    buildAtomicFactContract(
      featureVector,
    );
  const contractValidation =
    validateAtomicNatalFacts(
      contract,
    );

  return {
    factContractVersion:
      contract.version,

    /*
     * Compatibility facts retained for current image composer,
     * domain report and master summary consumers.
     */
    facts: resolved.facts,
    legacyFacts:
      resolved.facts,

    /*
     * Stable machine-readable atomic fact contract.
     */
    contractFacts:
      contract.facts,
    indexes:
      contract.indexes,
    summary:
      contract.summary,
    warnings:
      contract.warnings,

    byDomain: resolved.byDomain,
    byCategory: resolved.byCategory,
    hitListGroups:
      resolved.hitListGroups,
    suppressedFacts:
      resolved.suppressedFacts,

    debug: {
      ...resolved.debug,
      baseFactCount:
        baseFacts.length,
      ruleFactCount:
        ruleEvaluation.facts.length,
      ruleEvaluation:
        ruleEvaluation.debug,
      contractValidation,
      contractFactCount:
        contract.facts.length,
      contractCategoryCounts:
        contract.summary.byCategory,
    },
  };
}

function buildDerivedFacts(fv = {}) {
  return [
    ...buildDayMasterFacts(fv),
    ...buildTenGodPositionFacts(fv),

    // 高阶组合已迁移到 atomicNatalRuleDatabase.js，
    // 这里不再调用 buildCombinationFacts。
    ...buildRelationFacts(fv),
    ...buildRepetitionFacts(fv),
    ...buildElementFacts(fv),
    ...buildShenshaFacts(fv),
  ].map(normalizeFact);
}

function buildCombinationFacts(fv = {}) {
  const facts = [];
  const monthStem = fv.pillars?.month?.stemTenGod || "";
  const monthBranch = fv.pillars?.month?.branchMainTenGod || "";
  const yearStem = fv.pillars?.year?.stemTenGod || "";
  const hasOfficer = /官|杀/.test(monthBranch) || Number(fv.tenGods?.weightedCounts?.正官 ?? 0) + Number(fv.tenGods?.weightedCounts?.七杀 ?? 0) >= 0.7;
  const hasResource = /印/.test(monthStem) || Number(fv.tenGods?.weightedCounts?.正印 ?? 0) + Number(fv.tenGods?.weightedCounts?.偏印 ?? 0) >= 1;
  if (hasOfficer && hasResource) {
    facts.push({
      id: "officer_resource_chain",
      name: /杀/.test(monthBranch) ? "杀印承接" : "官印承接",
      category: "组合结构",
      subcategory: "官印关系",
      status: /印/.test(monthStem) && /官|杀/.test(monthBranch) ? "confirmed" : "conditional",
      importance: "high",
      confidence: /印/.test(monthStem) && /官|杀/.test(monthBranch) ? "high" : "medium",
      score: /印/.test(monthStem) && /官|杀/.test(monthBranch) ? 88 : 76,
      specificity: "high",
      brief: "官星与印星形成承接，规则责任可以通过学习、资质或系统能力消化。",
      evidence: [
        evidence("ten_god", "月支", monthBranch, `月支${fv.pillars?.month?.branch || ""}主气对日主为${monthBranch}`),
        evidence("ten_god", "月干", monthStem, `月干${fv.pillars?.month?.stem || ""}对日主为${monthStem}`),
      ],
      conditions: ["官星与印星在原局同时有实际落点", "月令或月干参与时权重更高"],
      counterEvidence: ["若日主完全不能承受官杀，官印承接的正面表现会减弱"],
      tags: ["官星", "印星", "规则", "资质"],
      domains: ["career", "self", "parents", "fortune"],
    });
  }
  if (/财/.test(yearStem) && hasOfficer && hasResource) {
    facts.push({
      id: "wealth_officer_resource_trace",
      name: "年月财官印有承接线索",
      category: "组合结构",
      subcategory: "财官印",
      status: "conditional",
      importance: "medium",
      confidence: "medium",
      score: 74,
      specificity: "high",
      brief: "财、官、印分别有落点时，可作为资源、规则和承接能力之间的组合线索。",
      evidence: [
        evidence("ten_god", "年干", yearStem, `年干${fv.pillars?.year?.stem || ""}对日主为${yearStem}`),
        evidence("ten_god", "月支", monthBranch, `月支${fv.pillars?.month?.branch || ""}主气对日主为${monthBranch}`),
        evidence("ten_god", "月干", monthStem, `月干${fv.pillars?.month?.stem || ""}对日主为${monthStem}`),
      ],
      conditions: ["财星、官星、印星均在原局有落点"],
      counterEvidence: ["三者是否形成顺畅承接，还要看距离、强弱和阻隔"],
      tags: ["财星", "官星", "印星", "承接"],
      domains: ["wealth", "career", "parents", "property"],
    });
  }
  return facts;
}

function buildDayMasterFacts(fv = {}) {
  const facts = [];
  const month = fv.structure?.monthCommand ?? {};
  if (fv.dayMaster?.stem && month.branch) {
    facts.push({
      id: `day-master-season-${fv.dayMaster.stem}-${month.branch}`,
      name: `${fv.dayMaster.stem}${fv.dayMaster.element || ""}生于${month.branch}月${fv.dayMaster.inSeason ? "得令" : "失令"}`,
      category: "日主根气",
      subcategory: "月令",
      status: "confirmed",
      importance: fv.dayMaster.inSeason ? "medium" : "high",
      confidence: "high",
      score: fv.dayMaster.inSeason ? 72 : 82,
      specificity: "high",
      brief: fv.dayMaster.inSeason ? "日主得月令扶助，原局自身根气有季节支撑。" : "日主不得月令，原局自身力量要看印比、通根和后天承接。",
      evidence: evidence("structure", "月令", month.branch, month.description || `月令为${month.branch}`),
      conditions: ["月令与日主五行关系明确"],
      counterEvidence: ["若原局印比透出、合化成势或根气另有承接，日主承接会增强"],
      tags: ["日主", "月令", fv.dayMaster.inSeason ? "得令" : "失令"],
      domains: ["self", "health", "fortune"],
    });
  }
  const rootLevel = fv.dayMaster?.rootLevel || "";
  if (rootLevel) {
    facts.push({
      id: `day-master-root-${rootLevel}`,
      name: rootLevel === "none" ? "原局日主无同类根" : `原局日主根气${rootLevel}`,
      category: "日主根气",
      subcategory: "根气",
      status: rootLevel === "none" ? "conditional" : "confirmed",
      importance: rootLevel === "none" ? "medium" : "high",
      confidence: "medium",
      score: rootLevel === "none" ? 68 : 76,
      specificity: "high",
      brief: rootLevel === "none" ? "四支未见日主同类藏干，自身根气不从地支直接得力。" : "日主在地支有根气，行动和承接有内在支点。",
      evidence: (fv.structure?.roots?.summary ?? []).map((text) => evidence("structure", "通根", rootLevel, text)),
      conditions: ["以现有通根分析为准"],
      counterEvidence: ["透干印比、合化和其他原局承接会改变实际力度"],
      tags: ["日主", "根气"],
      domains: ["self"],
    });
  }
  return facts;
}

function buildTenGodPositionFacts(fv = {}) {
  const facts = [];
  for (const [key, pillar] of Object.entries(fv.pillars ?? {})) {
    const pillarName = pillar.name || pillarLabel(key);
    if (pillar.stemTenGod && pillar.stemTenGod !== "日主") {
      facts.push({
        id: `stem-visible-${key}-${pillar.stemTenGod}`,
        name: `${pillarName.replace("柱", "干")}${pillar.stemTenGod}透出`,
        category: "十神透藏",
        subcategory: "天干透出",
        status: "confirmed",
        importance: key === "month" ? "high" : "medium",
        confidence: "high",
        score: key === "month" ? 84 : 72,
        specificity: "high",
        brief: `${pillarName}天干见${pillar.stemTenGod}，属于明面可用的十神信号。`,
        evidence: evidence("ten_god", `${pillarName}天干`, pillar.stemTenGod, `${pillarName}天干${pillar.stem}对日主为${pillar.stemTenGod}`),
        conditions: ["天干透出，明面信号成立"],
        counterEvidence: ["仍需看该十神是否有根、有生扶或受克制"],
        tags: [pillar.stemTenGod, "透干"],
        domains: tenGodDomains(pillar.stemTenGod),
      });
    }
    if (pillar.branchMainTenGod && pillar.branchMainTenGod !== "日主") {
      const isMonth = key === "month";
      facts.push({
        id: `branch-main-${key}-${pillar.branchMainTenGod}`,
        name: isMonth ? `月令${pillar.branchMainTenGod}` : `${pillarName}地支主气${pillar.branchMainTenGod}`,
        category: "十神透藏",
        subcategory: "地支主气",
        status: "confirmed",
        importance: isMonth ? "high" : "medium",
        confidence: "high",
        score: isMonth ? 86 : 70,
        specificity: "high",
        brief: `${pillarName}地支主气为${pillar.branchMainTenGod}，比普通藏干更有分量。`,
        evidence: evidence("ten_god", `${pillarName}地支主气`, pillar.branchMainTenGod, `${pillarName}${pillar.branch}主气对日主为${pillar.branchMainTenGod}`),
        conditions: ["地支主气明确"],
        counterEvidence: ["若被冲合刑害破牵动，表现方式会转向关系或事件层"],
        tags: [pillar.branchMainTenGod, "主气", isMonth ? "月令" : ""],
        domains: tenGodDomains(pillar.branchMainTenGod),
      });
    }
  }
  for (const [group, label] of Object.entries({ output: "食伤", wealth: "财星", officer: "官杀", resource: "印星", peer: "比劫" })) {
    const count = Number(fv.tenGods?.groupCounts?.[group] ?? 0);
    if (count <= 0.4) {
      facts.push({
        id: `${group}-weak-absent`,
        name: `原局${label}不显`,
        category: "十神透藏",
        subcategory: "弱象",
        status: "weak",
        importance: group === "output" ? "medium" : "low",
        confidence: "medium",
        score: group === "output" ? 66 : 52,
        specificity: "high",
        semanticGroup: `${group}-weak`,
        brief: `${label}在原局权重较低，相关象不宜当作原局主线。`,
        evidence: evidence("ten_god", "十神加权统计", label, `${label}加权统计约${round(count)}`),
        conditions: ["以原局天干、地支主气和藏干加权统计为准"],
        counterEvidence: ["现实阶段带出该十神相关事务时，该方向会转强"],
        tags: [label, "不显"],
        domains: tenGodDomains(label),
      });
    }
  }
  return facts;
}

function buildRelationFacts(fv = {}) {
  return (fv.relationMatrix?.items ?? []).map((relation, index) => ({
    id: `relation-${index}-${relation.id || relation.relationType}`,
    name: matrixRelationName(relation),
    category: "干支关系",
    subcategory: relation.relationType || "unknown",
    factLevel: "structural",
    status: relation.confidence === "high" ? "confirmed" : "conditional",
    importance: relation.affects?.dayBranch || relation.affects?.monthBranch ? "high" : "medium",
    confidence: relation.confidence || "medium",
    score: relation.affects?.dayBranch ? 80 : 68,
    specificity: "high",
    brief: `${matrixRelationName(relation)}，作为原局结构关系观察点。`,
    evidence: evidence(
      "relation",
      relationParticipantsLabel(relation),
      relation.relationType || "unknown",
      matrixRelationName(relation),
    ),
    conditions: ["干支关系由原局四柱直接命中"],
    counterEvidence: ["关系成化或作用强弱仍需结合月令、透干和根气复核"],
    tags: [relation.relationType, relation.layer],
    domains: routeRelationDomains(relation),
    relationType: relation.relationType,
    layer: relation.layer,
    participants: relation.participants ?? relation.members ?? [],
    affects: relation.affects ?? {},
    formation: relation.formation ?? "unknown",
    canTransform: Boolean(relation.canTransform),
    transformed: Boolean(relation.transformed),
  }));
}

function buildRepetitionFacts(fv = {}) {
  const pillars = Object.values(fv.pillars ?? {});
  const facts = [];
  for (let i = 0; i < pillars.length; i += 1) {
    for (let j = i + 1; j < pillars.length; j += 1) {
      const left = pillars[i];
      const right = pillars[j];
      if (left.label && left.label === right.label) {
        facts.push({
          id: `repetition-pillar-${left.key}-${right.key}-${left.label}`,
          name: `${left.name}与${right.name}${left.label}伏吟`,
          category: "柱位重复",
          subcategory: "伏吟",
          status: "confirmed",
          importance: left.key === "day" || right.key === "day" ? "high" : "medium",
          confidence: "high",
          score: left.key === "day" || right.key === "day" ? 82 : 68,
          specificity: "high",
          brief: "同一干支在两个柱位重复，原局相关位置的象会被放大。",
          evidence: evidence("pillar", `${left.name}与${right.name}`, left.label, `${left.name}${left.label}与${right.name}${right.label}相同`),
          conditions: ["整柱干支完全相同"],
          counterEvidence: ["伏吟只说明重复和放大，具体吉凶需回到十神、强弱和关系复核"],
          tags: ["伏吟", left.label],
          domains: ["self", "children", "movement"],
        });
      }
      if (left.branch && left.branch === right.branch) {
        facts.push({
          id: `repetition-branch-${left.key}-${right.key}-${left.branch}`,
          name: `${left.name}、${right.name}双${left.branch}`,
          category: "柱位重复",
          subcategory: "地支重复",
          status: "confirmed",
          importance: "medium",
          confidence: "high",
          score: 66,
          specificity: "high",
          brief: "同一地支重复，相关藏干、关系和五行象会被加强。",
          evidence: evidence("pillar", `${left.name}与${right.name}`, left.branch, `${left.name}${left.branch}与${right.name}${right.branch}重复`),
          conditions: ["地支重复出现"],
          counterEvidence: ["地支重复仍需结合藏干和冲合关系判断作用方向"],
          tags: ["地支重复", left.branch],
          domains: ["self", "movement"],
        });
      }
    }
  }
  return facts;
}

function buildElementFacts(fv = {}) {
  const facts = [];
  const counts = fv.elements?.counts ?? {};
  for (const [key, label] of Object.entries({ wood: "木", fire: "火", earth: "土", metal: "金", water: "水" })) {
    const count = Number(counts[key] ?? 0);
    if (count <= 0.5) {
      facts.push({
        id: `element-${key}-weak`,
        name: `原局${label}弱或不显`,
        category: "五行调候",
        subcategory: "五行偏弱",
        status: "weak",
        importance: key === "fire" ? "medium" : "low",
        confidence: "medium",
        score: key === "fire" ? 66 : 50,
        specificity: "high",
        brief: `${label}气在原局不外显，相关调候和功能需看其他结构承接。`,
        evidence: evidence("element", "五行统计", label, `${label}计数约${round(count)}`),
        conditions: ["五行统计显示该元素很弱或不显"],
        counterEvidence: ["藏干、合化或后天阶段引动时会补出该五行"],
        tags: [label, "偏弱"],
        domains: ["health", "fortune"],
      });
    }
  }
  const dominant = fv.elements?.dominant ?? [];
  if (Number(counts.metal ?? 0) >= 1.5 && Number(counts.water ?? 0) >= 1.5) {
    facts.push({
      id: "element-metal-water-present",
      name: "金水较有存在感",
      category: "五行调候",
      subcategory: "五行组合",
      status: "confirmed",
      importance: "medium",
      confidence: "high",
      score: 70,
      specificity: "high",
      brief: "金水在原局较明显，规则、信息、流动和寒湿感会成为复核点。",
        evidence: evidence("element", "五行统计", "金水", `金约${round(counts.metal)}，水约${round(counts.water)}`),
      conditions: ["金、水在五行统计中较有分量"],
      counterEvidence: ["若火土能有效调候，寒湿与流动感会被收敛"],
      tags: ["金", "水", "调候"],
      domains: ["health", "career", "fortune"],
    });
  }
  for (const chain of fv.elements?.flowChains ?? []) {
    facts.push({
      id: `element-flow-${chain}`,
      name: `${chain}流通`,
      category: "五行调候",
      subcategory: "流通链",
      status: "confirmed",
      importance: "medium",
      confidence: "medium",
      score: 62,
      specificity: "medium",
      brief: `${chain}形成五行流通观察点。`,
      evidence: evidence("element", "五行流通", chain, `五行统计见${chain}`),
      conditions: ["相邻五行均有出现"],
      counterEvidence: ["数量过弱或受制时，流通作用会减轻"],
      tags: [chain],
      domains: ["self", "career", "fortune"],
    });
  }
  return facts;
}

function buildShenshaFacts(fv = {}) {
  const facts = [];
  for (const pillar of Object.values(fv.pillars ?? {})) {
    for (const item of pillar.shensha ?? []) {
      facts.push({
        id: `shensha-${pillar.key}-${item.name}`,
        name: `${pillar.name}${item.name}`,
        category: "神煞辅助",
        subcategory: item.category || "神煞",
        status: "weak",
        importance: "low",
        confidence: "medium",
        score: 42,
        specificity: "high",
        brief: item.theme || `${item.name}只作辅助参考。`,
        evidence: evidence("shensha", pillar.name, item.name, item.theme || item.name),
        conditions: [item.sourceBasis || "神煞由系统规则计算"],
        counterEvidence: ["神煞不单独定论，需回到十神、五行和干支结构复核"],
        tags: [item.name, item.category],
        domains: ["self", "fortune"],
      });
    }
  }
  return facts;
}

function groupByDomain(facts = []) {
  const result = {};
  for (const fact of facts) {
    for (const domain of fact.domains ?? []) {
      if (!result[domain]) result[domain] = [];
      result[domain].push(fact);
    }
  }
  return result;
}

function groupByCategory(facts = []) {
  const result = {};
  for (const fact of facts) {
    const category = fact.category || "structure";
    if (!result[category]) result[category] = [];
    result[category].push(fact);
  }
  return result;
}

function groupHitList(facts = []) {
  const all = facts.filter((fact) => fact.specificity !== "generic");
  const confirmed = all.filter((fact) => fact.status === "confirmed");
  const conditional = all.filter((fact) => fact.status === "conditional");
  const weak = all.filter((fact) => fact.status === "weak");
  const featured = all
    .filter((fact) => fact.category !== "神煞辅助" && fact.importance !== "low" && fact.specificity !== "generic")
    .slice(0, 8);
  return {
    all,
    confirmed,
    conditional,
    weak,
    featured,
    byCategory: groupByCategory(all),
  };
}

function normalizeFact(fact = {}) {
  return {
    id: fact.id,
    name: fact.name || fact.label,
    label: fact.label || fact.name,
    category: categoryLabel(fact.category),
    subcategory: fact.subcategory || "",
    factLevel: fact.factLevel || inferFactLevel(fact),
    status: fact.status || statusFromRole(fact.role),
    importance: fact.importance || importanceFromScore(fact.score),
    confidence: fact.confidence || confidenceFromScore(fact.score),
    score: Number(fact.score ?? 50),
    specificity: fact.specificity || "medium",
    brief: cleanNatalText(fact.brief || fact.meaning || ""),
    meaning: cleanNatalText(fact.meaning || fact.brief || ""),
    evidence: normalizeEvidence(fact.evidence),
    conditions: compact(fact.conditions).map(cleanNatalText),
    counterEvidence: compact(fact.counterEvidence).map(cleanNatalText),
    sourceRuleId: fact.sourceRuleId || fact.id,
    relatedFactIds: compact(fact.relatedFactIds),
    semanticGroup: fact.semanticGroup || fact.id,
    tags: compact(fact.tags).map(cleanNatalText),
    domains: compact(fact.domains),
    role: fact.role || "support",
    polarity: fact.polarity || "mixed",
    suppressedReason: fact.suppressedReason || "",
    relationType: fact.relationType,
    layer: fact.layer,
    participants: fact.participants,
    affects: fact.affects,
    formation: fact.formation,
    canTransform: fact.canTransform,
    transformed: fact.transformed,
  };
}

function dedupeFacts(facts = []) {
  const result = [];
  const seen = new Set();
  for (const fact of facts) {
    const key = fact.semanticGroup || `${fact.id}:${fact.name}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(fact);
  }
  return result;
}

function normalizeEvidence(items = []) {
  return compact(items).map((item) => {
    if (typeof item === "object") return { ...item, text: cleanNatalText(item.text), value: cleanNatalText(item.value), position: cleanNatalText(item.position) };
    return evidence("structure", "", "", cleanNatalText(String(item)));
  });
}

function evidence(type, position, value, text) {
  return { type, position, value, text: cleanNatalText(text) };
}

function cleanNatalText(text = "") {
  return String(text)
    .replace(/与岁运验证/g, "与现实阶段复核")
    .replace(/岁运/g, "现实阶段")
    .replace(/大运流年/g, "现实阶段")
    .replace(/大运|流年|流月|当前步运|流日/g, "现实阶段");
}

function categoryLabel(category = "") {
  return {
    day_master: "日主根气",
    ten_god: "十神透藏",
    ten_god_position: "十神透藏",
    combination: "组合结构",
    relation: "干支关系",
    pillar: "柱位重复",
    element: "五行调候",
    shensha: "神煞辅助",
    structure: "日主根气",
  }[category] ?? (category || "组合结构");
}

function inferFactLevel(fact = {}) {
  const category = categoryLabel(fact.category);
  if (category === "干支关系" || category === "柱位重复" || category === "五行调候") return "structural";
  if (category === "日主根气" || category === "十神透藏" || category === "神煞辅助") return "base";
  return "base";
}

function statusFromRole(role = "") {
  if (role === "counter") return "weak";
  if (role === "tension") return "conditional";
  return "confirmed";
}

function importanceFromScore(score = 50) {
  const value = Number(score ?? 50);
  if (value >= 78) return "high";
  if (value >= 62) return "medium";
  return "low";
}

function confidenceFromScore(score = 50) {
  const value = Number(score ?? 50);
  if (value >= 78) return "high";
  if (value >= 58) return "medium";
  return "low";
}

function relationName(relation = {}) {
  const pillars = relation.pillars ?? [];
  const ganzhi = relation.ganzhi ?? [];
  const members = relation.members ?? relation.branches ?? [];
  if (/伏吟/.test(relation.type || relation.name || "")) {
    return `${pillars[0] || ""}与${pillars[1] || ""}${ganzhi[0] || members[0] || ""}伏吟`;
  }
  const leftPosition = relationPosition(pillars[0], relation.type);
  const rightPosition = relationPosition(pillars[1], relation.type);
  const left = relation.type?.includes("天干") ? ganzhi[0]?.[0] : (ganzhi[0]?.[1] || members[0]);
  const right = relation.type?.includes("天干") ? ganzhi[1]?.[0] : (ganzhi[1]?.[1] || members[1]);
  const suffix = relationSuffix(relation.type || relation.name || "");
  return `${leftPosition}${left || ""}与${rightPosition}${right || ""}${suffix}`;
}

function relationPosition(pillar = "", type = "") {
  const short = { 年柱: "年", 月柱: "月", 日柱: "日", 时柱: "时" }[pillar] || pillar.replace("柱", "");
  return `${short}${type?.includes("天干") ? "干" : "支"}`;
}

function relationSuffix(type = "") {
  if (/六合/.test(type)) return "六合";
  if (/六冲|冲/.test(type)) return "相冲";
  if (/六破|破/.test(type)) return "相破";
  if (/刑/.test(type)) return "相刑";
  if (/害/.test(type)) return "相害";
  if (/三合/.test(type)) return "三合";
  if (/三会/.test(type)) return "三会";
  if (/五合/.test(type)) return "五合";
  return type.replace(/^天干|^地支/, "") || "关系";
}

function matrixRelationName(relation = {}) {
  const participants = relation.participants ?? relation.members ?? [];
  const [left, right] = participants;
  if (!left || !right) return relation.relationType || "干支关系";
  return `${positionLabel(left)}${left.value || ""}与${positionLabel(right)}${right.value || ""}${matrixRelationSuffix(relation.relationType)}`;
}

function matrixRelationSuffix(type = "") {
  return {
    stem_combine: "五合",
    stem_clash: "相冲",
    stem_control: "相克",
    branch_combine: "六合",
    branch_clash: "相冲",
    branch_punish: "相刑",
    branch_self_punish: "自刑",
    branch_harm: "相害",
    branch_break: "相破",
    three_harmony: "三合",
    three_meeting: "三会",
    half_harmony: "半合",
    arch_harmony: "拱合",
    repetition: "重复",
  }[type] ?? "关系";
}

function positionLabel(participant = {}) {
  const pillar = { year: "年", month: "月", day: "日", hour: "时" }[participant.pillar] ?? "";
  const position = participant.position === "stem" ? "干" : participant.position === "branch" ? "支" : "";
  return `${pillar}${position}`;
}

function relationParticipantsLabel(relation = {}) {
  return (relation.participants ?? relation.members ?? [])
    .map((item) => `${positionLabel(item)}${item.value || ""}`)
    .filter(Boolean)
    .join("与");
}

function routeRelationDomains(relation = {}) {
  const domains = new Set();
  const pairs = relationPillarPairs(relation.participants ?? relation.members ?? []);
  for (const pair of pairs) {
    for (const domain of domainsByPair(pair, relation.affects ?? {})) {
      domains.add(domain);
    }
  }
  if (relation.affects?.spousePalace) domains.add("spouse");
  if (domains.size === 0) {
    domains.add(relation.participants?.length ? "movement" : "self");
  }
  return [...domains];
}

function relationPillarPairs(participants = []) {
  const order = ["year", "month", "day", "hour"];
  const keys = [...new Set(participants.map((item) => item.pillar).filter((key) => order.includes(key)))]
    .sort((left, right) => order.indexOf(left) - order.indexOf(right));
  const pairs = [];
  for (let left = 0; left < keys.length; left += 1) {
    for (let right = left + 1; right < keys.length; right += 1) {
      pairs.push(`${keys[left]}-${keys[right]}`);
    }
  }
  return pairs;
}

function domainsByPair(pair, affects = {}) {
  if (pair === "year-month") return ["parents", "self", "career"];
  if (pair === "month-day") return affects.spousePalace ? ["self", "career", "spouse"] : ["self", "career"];
  if (pair === "day-hour") return affects.spousePalace ? ["self", "children", "spouse"] : ["self", "children"];
  if (pair === "year-hour") return ["parents", "children", "movement"];
  return ["self", "movement"];
}

function tenGodDomains(tenGod = "") {
  if (/印/.test(tenGod)) return ["self", "parents", "career", "fortune"];
  if (/财/.test(tenGod)) return ["wealth", "parents", "property"];
  if (/官|杀/.test(tenGod)) return ["career", "spouse", "self"];
  if (/食|伤/.test(tenGod)) return ["children", "career", "wealth"];
  if (/比|劫/.test(tenGod)) return ["self", "siblings", "friends"];
  return ["self"];
}

function pillarLabel(key = "") {
  return { year: "年柱", month: "月柱", day: "日柱", hour: "时柱" }[key] ?? key;
}

function round(value) {
  return Math.round(Number(value ?? 0) * 100) / 100;
}

function safeCall(fn, fallback) {
  try {
    return fn();
  } catch {
    return fallback;
  }
}

function compact(items = []) {
  return (Array.isArray(items) ? items.flat(Infinity) : [items])
    .filter((item) => item !== undefined && item !== null && String(item).trim() !== "");
}
