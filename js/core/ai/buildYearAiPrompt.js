import { buildStageAiTrustedPack } from "./buildStageAiTrustedPack.js";

export function buildYearAiPrompt({
  baseBaziViewModel,
  natalImageReport,
  luckImageReport,
  yearImageReport,
} = {}) {
  const yearItem = yearImageReport?.yearItem ?? null;
  const luckItems = Array.isArray(luckImageReport?.luckItems)
    ? luckImageReport.luckItems
    : [];
  const currentLuckItem = yearItem?.currentLuckItem ??
    luckItems.find((item) => item?.isCurrent) ??
    luckItems[0] ??
    null;

  const trustedPack = buildStageAiTrustedPack({
    stage: "year",
    item: yearItem,
    currentLuckItem,
    yearItem,
    baseBaziViewModel,
    natalImageReport,
  });

  return {
    system: [
      "你是八字命理系统的岁运解释层，不是排盘层。",
      "浏览器已经完成原局、大运、流年结构、层级关系和触发取象；你只能解释 trustedPack，不能重新排盘或补算。",
      "本次只解释当前流年，不分析其他年份，不展开流月。",
      "流年必须放在当前大运背景中讲，不能脱离大运单独断年。",
      "讲述顺序必须读取 trustedPack.storyPack.storyOrder：opening → development → turn → landing。",
      "十神主次必须读取 trustedPack.themeHierarchy：primary 是流年天干外显主线；supporting 是流年地支现实承接背景。不得平均展开。",
      "directTriggers 用于说明今年哪些位置真正被牵动；hierarchyInteractions 用于说明流年怎样承接、加力或调整大运；convergence 用于说明多个触发的共同落点。",
      "conditionalPatterns 必须降级，只能写成趋势、牵连或待验证条件；不得进入一句话总览，不得写成已成局、已化气或确定事件。",
      "只展开证据最强的二至三个领域，不要机械覆盖事业、财务、感情、家庭全部领域。",
      "同一条冲、害、重复或层级关系只能讲一次；不要在多个章节反复复述。",
      "如果没有足够强的直接触发，应写成年度背景延续或主题浮现，不得硬造转折。",
      "不得使用一定、必然、注定；不得凭空断具体职业、金额、疾病、婚期、灾祸。",
      "输出结构固定为：",
      "### 一句话主线",
      "### 今年怎样展开",
      "### 大运背景下的转折与联动",
      "### 主要现实落点",
      "### 可利用的力量与代价",
      "### 需要核实的现实问题",
      "每个结论都必须来自 trustedPack；不要展示 JSON、字段名或内部证据 ID。",
    ].join("\n"),
    user: JSON.stringify({
      task: "根据可信事实包讲清当前流年在大运背景中的发展、转折、现实落点与代价。",
      trustedPack,
    }, null, 2),
    trustedPack,
    evidenceIds: trustedPack.allowedEvidenceRefs,
  };
}
