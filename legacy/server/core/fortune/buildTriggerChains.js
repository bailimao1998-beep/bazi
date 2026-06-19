import { branchMainStem, getTenGod } from "../bazi/tenGods.js";
import { getPillarRelations, normalizePillar, relationReality } from "./relationUtils.js";
import { ensureKnownEventHints, pillarTenGods, relationTopicHints, tenGodTopicHints } from "./topicMapper.js";
import { unique } from "./eventTaxonomy.js";

export function buildTriggerChains({ chart, selectedLuck, yearInfluence, monthInfluences = [] } = {}) {
  const chains = [];
  const dayStem = chart?.dayMaster?.stem || chart?.pillars?.day?.stem;
  const gender = chart?.input?.gender || "unknown";
  const luckPillar = normalizePillar(selectedLuck, "大运");
  const yearPillar = normalizePillar(yearInfluence?.pillar, "流年");
  const natalPillars = Object.entries(chart?.pillars ?? {}).map(([key, pillar]) => ({
    key,
    pillar: normalizePillar(pillar, pillar.role),
  }));

  if (luckPillar) {
    chains.push(...tenGodChains({ level: "luck-natal", layer: "大运", pillar: luckPillar, dayStem, gender }));
    for (const natal of natalPillars) {
      chains.push(...relationChains({ level: "luck-natal", sourceLayer: "大运", sourcePillar: luckPillar, targetLayer: "原局", target: natal, gender }));
    }
  }

  if (yearPillar) {
    chains.push(...tenGodChains({ level: "year-natal", layer: "流年", pillar: yearPillar, dayStem, gender, providedTenGods: yearInfluence?.tenGods }));
    for (const natal of natalPillars) {
      chains.push(...relationChains({ level: "year-natal", sourceLayer: "流年", sourcePillar: yearPillar, targetLayer: "原局", target: natal, gender }));
    }
    if (luckPillar) {
      chains.push(...relationChains({
        level: "luck-year",
        sourceLayer: "流年",
        sourcePillar: yearPillar,
        targetLayer: "大运",
        target: { key: "luck", pillar: luckPillar },
        gender,
        strengthBoost: 4,
      }));
      if (luckPillar.label === yearPillar.label) {
        chains.push(createChain({
          level: "luck-year",
          type: "岁运并临",
          sourceLayer: "流年",
          sourcePillar: yearPillar,
          targetLayer: "大运",
          targetPillar: luckPillar,
          topicHints: ["career_status", "health_risk", "movement_change"],
          strength: 36,
          evidence: `大运${luckPillar.label}与流年${yearPillar.label}同柱，阶段背景和年度触发叠加。`,
          realityMapping: "阶段里反复出现的职责、资源、关系或迁动议题，在当年更容易进入节点。",
          metadata: { relationType: "岁运并临" },
        }));
      }
    }
  }

  for (const month of monthInfluences) {
    const monthPillar = normalizePillar(month?.pillar, "流月");
    if (!monthPillar) continue;
    chains.push(...tenGodChains({
      level: "month-year",
      layer: "流月",
      pillar: monthPillar,
      dayStem,
      gender,
      month: month.month,
      strengthScale: 0.65,
      providedTenGods: month.tenGods,
    }));
    for (const natal of natalPillars) {
      chains.push(...relationChains({
        level: "month-natal",
        sourceLayer: "流月",
        sourcePillar: monthPillar,
        targetLayer: "原局",
        target: natal,
        gender,
        month: month.month,
        strengthScale: 0.78,
      }));
    }
    if (yearPillar) {
      chains.push(...relationChains({
        level: "month-year",
        sourceLayer: "流月",
        sourcePillar: monthPillar,
        targetLayer: "流年",
        target: { key: "year", pillar: yearPillar },
        gender,
        month: month.month,
        strengthScale: 0.76,
      }));
    }
    if (luckPillar) {
      chains.push(...relationChains({
        level: "month-luck",
        sourceLayer: "流月",
        sourcePillar: monthPillar,
        targetLayer: "大运",
        target: { key: "luck", pillar: luckPillar },
        gender,
        month: month.month,
        strengthScale: 0.72,
      }));
    }
  }

  return chains.map((chain, index) => ({ ...chain, id: `fortune-chain-${index + 1}` }));
}

function tenGodChains({ level, layer, pillar, dayStem, gender, month, strengthScale = 1, providedTenGods } = {}) {
  const tenGods = providedTenGods || pillarTenGods(dayStem, pillar);
  return [
    { part: "天干", tenGod: tenGods.stem ?? getTenGod(dayStem, pillar.stem), strength: 22 },
    { part: "地支主气", tenGod: tenGods.branch ?? getTenGod(dayStem, branchMainStem(pillar.branch)), strength: 20 },
  ].filter((item) => item.tenGod && item.tenGod !== "未知").map((item) => {
    const topicHints = ensureKnownEventHints(tenGodTopicHints(item.tenGod, gender));
    return createChain({
      level,
      type: "十神触发",
      sourceLayer: layer,
      sourcePillar: pillar,
      targetLayer: "原局",
      targetPillar: { role: "日主", label: `${dayStem || ""}日主` },
      topicHints,
      strength: Math.round(item.strength * strengthScale),
      evidence: `${layer}${pillar.label}${item.part}为${item.tenGod}，引动${topicHints.map(topicLabel).join("、") || "结构"}方向。`,
      realityMapping: tenGodReality(item.tenGod, gender),
      metadata: { tenGod: item.tenGod, part: item.part, month },
    });
  });
}

function relationChains({ level, sourceLayer, sourcePillar, targetLayer, target, gender, month, strengthBoost = 0, strengthScale = 1 } = {}) {
  const targetPillar = normalizePillar(target?.pillar, targetLayer);
  if (!sourcePillar || !targetPillar) return [];
  return getPillarRelations(sourcePillar, targetPillar).map((relation) => {
    const role = targetPillar.role || targetLayer;
    const hints = ensureKnownEventHints(relationTopicHints(relation.type, role));
    return createChain({
      level,
      type: relation.type,
      sourceLayer,
      sourcePillar,
      targetLayer,
      targetPillar,
      topicHints: hints,
      strength: Math.round((relation.strength + pillarBoost(role) + strengthBoost) * strengthScale),
      evidence: `${sourceLayer}${sourcePillar.label}与${targetLayer}${role}${targetPillar.label}形成${relation.type}，引动${hints.map(topicLabel).join("、") || "相关"}主题。`,
      realityMapping: relation.reality || relationReality(relation.type),
      metadata: { relationType: relation.type, targetKey: target?.key, targetRole: role, month, gender },
    });
  });
}

function createChain({ level, type, sourceLayer, sourcePillar, targetLayer, targetPillar, topicHints, strength, evidence, realityMapping, metadata = {} }) {
  return {
    level,
    type,
    source: { layer: sourceLayer, label: sourcePillar?.label, stem: sourcePillar?.stem, branch: sourcePillar?.branch },
    target: { layer: targetLayer, role: targetPillar?.role, label: targetPillar?.label, stem: targetPillar?.stem, branch: targetPillar?.branch },
    topicHints: unique(topicHints),
    strength: Number(strength || 0),
    evidence,
    realityMapping,
    metadata,
  };
}

function pillarBoost(role = "") {
  if (/日/.test(role)) return 8;
  if (/月/.test(role)) return 6;
  if (/时/.test(role)) return 5;
  if (/年/.test(role)) return 4;
  return 0;
}

function tenGodReality(tenGod, gender) {
  if (["正财", "偏财"].includes(tenGod)) return gender === "male"
    ? "钱与资源安排被带动，也可能映射到关系承诺、合作资源和现实责任。"
    : "钱与资源安排被带动，重点看收入、支出、报价、合同金额和现实事务。";
  if (["正官", "七杀"].includes(tenGod)) return gender === "female"
    ? "规则职责和关系星同时被带动，现实中看身份、岗位、流程、关系边界或承诺议题。"
    : "规则职责、岗位压力、考核流程或身份认证更容易被带到台前。";
  if (["食神", "伤官"].includes(tenGod)) return "表达输出、作品项目、学生晚辈、交付成果或公开呈现被带动。";
  if (["正印", "偏印"].includes(tenGod)) return "学习、证照、材料、支持系统、长辈家庭和制度资源被带动。";
  if (["比肩", "劫财"].includes(tenGod)) return "同辈、朋友、团队竞争、合作分工和资源边界被带动。";
  return "十神进入触发层，需要结合柱位和岁运观察现实反馈。";
}

function topicLabel(eventType) {
  return {
    relationship_marriage: "关系",
    wealth_resource: "财务资源",
    children_output: "子女输出",
    career_status: "事业身份",
    health_risk: "作息体感",
    movement_change: "迁动变化",
    social_conflict: "人际合作",
    family_home: "家庭居住",
  }[eventType] || eventType;
}

