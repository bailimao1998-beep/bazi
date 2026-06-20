import { stageAdvice } from "./stageAdviceData.js";

const adviceTitles = {
  luck: "当前大运建议",
  year: "当前流年建议",
  month: "当前流月建议",
};

const relationPriority = ["冲", "合", "刑", "害", "破"];

export function buildStageAdvice({ stage = "luck", item = {}, relations = [], confidence = "" } = {}) {
  const stageRule = stageAdvice.stageRules[stage] ?? stageAdvice.stageRules.luck;
  const tenGodRule = stageAdvice.tenGodRules[item.tenGod || item.stemTenGod] ?? null;
  const relationRule = pickRelationRule(relations);
  const confidenceRule = pickConfidenceRule({ relations, confidence });

  return {
    title: adviceTitles[stage] ?? "阶段建议",
    cards: [
      {
        title: "先看主线",
        content: joinSentence(stageRule.mainAdvice, tenGodRule?.main, relationRule?.main, confidenceRule?.main),
      },
      {
        title: "现实反馈",
        content: joinSentence(stageRule.realityCheck, tenGodRule?.reality, relationRule?.reality, confidenceRule?.reality),
      },
      {
        title: "复核边界",
        content: joinSentence(stageRule.boundary, relationRule?.risk, confidenceRule?.boundary),
      },
      {
        title: "反证提醒",
        content: joinSentence(stageRule.counterEvidence, tenGodRule?.risk, confidenceRule?.counterEvidence),
      },
    ],
  };
}

function pickRelationRule(relations = []) {
  const relationType = detectRelationType(relations);
  return relationType ? stageAdvice.relationRules[relationType] : null;
}

function pickConfidenceRule({ relations = [], confidence = "" } = {}) {
  if (confidence === "low") return stageAdvice.confidenceRules.lowConfidence;
  return relations.length ? null : stageAdvice.confidenceRules.noRelation;
}

function detectRelationType(relations = []) {
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

  return relationPriority.find((type) => relationText.includes(type)) || "";
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
