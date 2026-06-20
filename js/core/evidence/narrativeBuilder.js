import { knowledgeBase } from "./knowledgeBase.js";

const sectionTitles = ["命理师讲盘", "现实画面", "资料解释", "成立条件", "反证边界", "师傅复核点"];

export function buildLocalNarrative(evidencePack) {
  if (!evidencePack) return null;
  const stageRule = knowledgeBase.stages[evidencePack.stage] ?? knowledgeBase.stages.natal;
  const firstHit = evidencePack.hits?.[0] ?? null;
  const secondHit = evidencePack.hits?.[1] ?? null;
  const firstRelation = evidencePack.relations?.[0] ?? null;
  const explanationText = buildExplanationText(evidencePack);
  const headline = buildHeadline({ evidencePack, stageRule, firstHit, secondHit, firstRelation });

  return {
    headline,
    sections: [
      {
        title: sectionTitles[0],
        text: limitSentences(joinText(
          stageRule?.clientTalk || stageRule?.localTalk,
          buildHitTalk(firstHit),
          secondHit && secondHit.label !== firstHit?.label ? buildHitTalk(secondHit, "同时") : "",
          buildRelationTalk(firstRelation)
        ), 4),
      },
      {
        title: sectionTitles[1],
        text: limitSentences(joinText(
          evidencePack.summary?.reality,
          buildRealityText(evidencePack.hits, evidencePack.relations)
        ), 4),
      },
      {
        title: sectionTitles[2],
        text: limitSentences(explanationText, 4),
      },
      {
        title: sectionTitles[3],
        text: limitSentences(buildConditionText(evidencePack), 4),
      },
      {
        title: sectionTitles[4],
        text: limitSentences(joinText(
          evidencePack.summary?.caution,
          buildCounterText(evidencePack.hits, evidencePack.relations)
        ), 4),
      },
      {
        title: sectionTitles[5],
        text: limitSentences(joinText(
          evidencePack.summary?.verify,
          stageRule?.verify
        ), 4),
      },
    ].map((section) => ({
      ...section,
      text: section.text || "当前证据偏少，先把系统已经命中的象作为观察线索。",
    })),
    basis: buildBasis(evidencePack, stageRule),
  };
}

function buildHeadline({ evidencePack, stageRule, firstHit, secondHit, firstRelation }) {
  const target = evidencePack.target && evidencePack.target !== "目标待查" ? `${evidencePack.target}，` : "";
  const hitText = firstHit
    ? `呈现出${firstHit.label}的主题${firstHit.image?.length ? `，现实里容易牵到${firstHit.image.slice(0, 3).join("、")}` : ""}`
    : stageRule?.clientTalk || stageRule?.localTalk || stageRule?.masterTalk || "";
  const branchText = secondHit && secondHit.label !== firstHit?.label
    ? `同时带出${secondHit.label}，这会成为现实落点里的另一条背景线`
    : "";
  const relationText = firstRelation ? `关系上见${firstRelation.label}，${firstRelation.image?.slice(0, 2).join("、")}感会更明显` : "";
  return limitSentences(joinText(`${target}${hitText}。`, branchText ? `${branchText}。` : "", relationText ? `${relationText}。` : ""), 2);
}

function buildHitTalk(hit, prefix = "") {
  if (!hit) return "";
  const images = hit.realityImages?.slice(0, 3).join("、") || hit.image?.slice(0, 3).join("、");
  const talk = hit.clientTalk || hit.localTalk || hit.masterTalk;
  if (talk) return prefix ? `${prefix}${talk}` : talk;
  return `${prefix}${hit.label}这个象落到现实里，容易带出${images || "对应的人事主题"}。`;
}

function buildRelationTalk(relation) {
  if (!relation) return "";
  const images = relation.realityImages?.slice(0, 3).join("、") || relation.image?.slice(0, 3).join("、");
  const talk = relation.clientTalk || relation.localTalk || relation.masterTalk;
  if (talk) return talk;
  return `${relation.label}被触发时，现实里容易出现${images || "关系和事务变化"}。`;
}

function buildRealityText(hits = [], relations = []) {
  const images = [
    ...hits.flatMap((hit) => hit.realityImages || []),
    ...relations.flatMap((relation) => relation.realityImages || []),
  ].slice(0, 6);
  return images.length ? `现实中容易出现${images.join("、")}等画面。` : "";
}

function buildExplanationText(evidencePack = {}) {
  const explanations = evidencePack.explanations?.bookExplanations || evidencePack.aiContext?.资料解释 || [];
  return explanations.length ? `资料解释：${explanations.slice(0, 3).join("")}` : "";
}

function buildConditionText(evidencePack = {}) {
  const conditions = evidencePack.explanations?.conditions || evidencePack.aiContext?.成立条件 || [];
  return conditions.length ? `成立条件：${conditions.slice(0, 3).join("")}` : "";
}

function buildCounterText(hits = [], relations = []) {
  return [
    ...hits.flatMap((hit) => hit.counterEvidence || []),
    ...relations.flatMap((relation) => relation.counterEvidence || []),
  ].slice(0, 3).join("");
}

function buildBasis(evidencePack, stageRule) {
  const tenGodHits = (evidencePack.hits || []).filter((hit) => hit.type === "tenGod");
  const relations = evidencePack.relations || [];
  return [
    tenGodHits[0] ? `${tenGodHits[0].source}：${tenGodHits[0].label}` : "",
    tenGodHits[1] ? `${tenGodHits[1].source}：${tenGodHits[1].label}` : "",
    relations.length ? `关系：${[...new Set(relations.map((relation) => relation.label))].join("、")}` : "关系：暂无明显冲合刑害破触发",
    stageRule?.label ? `阶段：${stageRule.label}` : "",
  ].filter(Boolean);
}

function joinText(...parts) {
  return parts
    .filter((part) => part !== undefined && part !== null && String(part).trim())
    .map((part) => String(part).trim())
    .join("");
}

function limitSentences(text = "", max = 4) {
  const normalized = String(text).replace(/\s+/g, "");
  const sentences = normalized.match(/[^。！？；]+[。！？；]?/g) ?? [];
  return sentences.slice(0, max).join("");
}
