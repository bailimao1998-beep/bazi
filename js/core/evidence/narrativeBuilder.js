import { knowledgeBase } from "./knowledgeBase.js";

const sectionTitles = ["命理师讲盘", "现实表现", "需要注意", "怎么验证"];

export function buildLocalNarrative(evidencePack) {
  if (!evidencePack) return null;
  const stageRule = knowledgeBase.stages[evidencePack.stage] ?? knowledgeBase.stages.natal;
  const firstHit = evidencePack.hits?.[0] ?? null;
  const secondHit = evidencePack.hits?.[1] ?? null;
  const firstRelation = evidencePack.relations?.[0] ?? null;
  const headline = buildHeadline({ evidencePack, stageRule, firstHit, secondHit, firstRelation });

  return {
    headline,
    sections: [
      {
        title: sectionTitles[0],
        text: limitSentences(joinText(
          stageRule?.masterTalk,
          firstHit?.masterTalk,
          secondHit && secondHit.label !== firstHit?.label ? secondHit.masterTalk : "",
          firstRelation?.masterTalk
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
        text: limitSentences(joinText(
          evidencePack.summary?.caution,
          buildCounterText(evidencePack.hits, evidencePack.relations)
        ), 4),
      },
      {
        title: sectionTitles[3],
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
    ? `主线先看${firstHit.label}${firstHit.image?.length ? `，现实里偏向${firstHit.image.slice(0, 3).join("、")}` : ""}`
    : stageRule?.masterTalk || "";
  const branchText = secondHit && secondHit.label !== firstHit?.label
    ? `同时地支落点带出${secondHit.label}，要看它在现实环境里怎么承接`
    : "";
  const relationText = firstRelation ? `关系上见${firstRelation.label}，${firstRelation.image?.slice(0, 2).join("、")}感会更明显` : "";
  return limitSentences(joinText(`${target}${hitText}。`, branchText ? `${branchText}。` : "", relationText ? `${relationText}。` : ""), 2);
}

function buildRealityText(hits = [], relations = []) {
  const images = [
    ...hits.flatMap((hit) => hit.realityImages || []),
    ...relations.flatMap((relation) => relation.realityImages || []),
  ].slice(0, 6);
  return images.length ? `落到现实里，可以先看${images.join("、")}这些画面有没有浮出来。` : "";
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
