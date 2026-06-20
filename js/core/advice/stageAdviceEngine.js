import { stageAdvice } from "./stageAdviceData.js";

const adviceTitles = {
  luck: "当前大运建议",
  year: "当前流年建议",
  month: "当前流月建议",
};

const relationPriority = ["冲", "合", "刑", "害", "破"];

export function buildStageAdvice({ stage = "luck", item = {}, relations = [], confidence = "" } = {}) {
  const stageRule = stageAdvice.stageRules[stage] ?? stageAdvice.stageRules.luck;
  const stemTenGod = item.tenGod || item.stemTenGod || "";
  const branchTenGod = item.branchTenGod || item.branchMainTenGod || "";
  const stemTenGodRule = stageAdvice.tenGodRules[stemTenGod] ?? null;
  const branchTenGodRule = stageAdvice.tenGodRules[branchTenGod] ?? null;
  const relationTypes = detectRelationTypes(relations);
  const relationRules = pickRelationRules(relations);
  const confidenceRule = pickConfidenceRule({ relations, confidence });
  const branchHint = branchTenGodRule
    ? `地支主气见${branchTenGod}，现实落点可参考：${branchTenGodRule.main}`
    : "";

  return {
    title: adviceTitles[stage] ?? "阶段建议",
    basis: [
      stemTenGod ? `天干：${stemTenGod}` : "",
      branchTenGod ? `地支主气：${branchTenGod}` : "",
      relationTypes.length ? `关系：${relationTypes.join("、")}` : "关系：暂无明显触发",
      confidence ? `置信度：${confidenceLabel(confidence)}` : "",
    ].filter(Boolean),
    cards: [
      {
        title: "先看主线",
        content: joinSentence(
          stageRule.mainAdvice,
          stemTenGodRule?.main,
          branchHint,
          ...relationRules.map((rule) => rule.main),
          confidenceRule?.main
        ),
      },
      {
        title: "现实反馈",
        content: joinSentence(
          stageRule.realityCheck,
          stemTenGodRule?.reality,
          branchTenGodRule?.reality,
          ...relationRules.map((rule) => rule.reality),
          confidenceRule?.reality
        ),
      },
      {
        title: "复核边界",
        content: joinSentence(stageRule.boundary, ...relationRules.map((rule) => rule.risk), confidenceRule?.boundary),
      },
      {
        title: "反证提醒",
        content: joinSentence(stageRule.counterEvidence, stemTenGodRule?.risk, branchTenGodRule?.risk, confidenceRule?.counterEvidence),
      },
    ],
  };
}

function pickRelationRules(relations = []) {
  const relationTypes = detectRelationTypes(relations);
  return relationTypes
    .map((type) => stageAdvice.relationRules[type])
    .filter(Boolean)
    .slice(0, 2);
}

function pickConfidenceRule({ relations = [], confidence = "" } = {}) {
  if (confidence === "low") return stageAdvice.confidenceRules.lowConfidence;
  return relations.length ? null : stageAdvice.confidenceRules.noRelation;
}

function detectRelationTypes(relations = []) {
  const relationText = (Array.isArray(relations) ? relations : [])
    .map((relation) => [
      relation?.type,
      relation?.relationType,
      relation?.name,
      relation?.description,
      relation?.evidence,
      relation?.effect,
    ].filter(Boolean).join(" "))
    .join(" ");

  return relationPriority.filter((type) => relationText.includes(type));
}

function confidenceLabel(value) {
  return { high: "重点", medium: "可参考", low: "待验证" }[value] ?? value ?? "";
}

function joinSentence(...parts) {
  const text = parts
    .filter((part) => part !== undefined && part !== null && String(part).trim())
    .map((part) => String(part).trim())
    .join("");

  return limitSentences(text, 2) || "先结合原局结构、阶段背景和现实反馈交叉复核。";
}

function limitSentences(text = "", max = 2) {
  const normalized = String(text).replace(/\s+/g, "");
  const sentences = normalized.match(/[^。！？；]+[。！？；]?/g) ?? [];
  return sentences.slice(0, max).join("");
}
