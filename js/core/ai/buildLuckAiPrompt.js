import { buildStageAiTrustedPack } from "./buildStageAiTrustedPack.js";

export function buildLuckAiPrompt({
  baseBaziViewModel,
  natalImageReport,
  luckImageReport,
} = {}) {
  const luckItems = Array.isArray(luckImageReport?.luckItems)
    ? luckImageReport.luckItems
    : [];
  const currentLuckItem = luckItems.find((item) => item?.isCurrent) ?? luckItems[0] ?? null;

  const trustedPack = buildStageAiTrustedPack({
    stage: "luck",
    item: currentLuckItem,
    currentLuckItem,
    baseBaziViewModel,
    natalImageReport,
  });

  return {
    system: [
      "你是八字命理系统的岁运解释层，不是排盘层。",
      "浏览器已经完成原局、大运结构、层级关系和触发取象；你只能解释 trustedPack，不能重新排盘或补算。",
      "本次只解释当前大运，不分析其他大运，不延伸具体流年和流月。",
      "讲述顺序必须读取 trustedPack.storyPack.storyOrder：opening → development → turn → landing。",
      "十神主次必须读取 trustedPack.themeHierarchy：primary 是天干外显主线；supporting 是地支现实承接背景。不得把两者平均展开成两条同等主线。",
      "directTriggers 才能作为明确发展线；hierarchyInteractions 用于转折；convergence 用于共同落点。",
      "conditionalPatterns 只能作为辅助趋势或待验证条件，不得写进一句话主结论，不得写成已成局、已化气或必然应事。",
      "没有 directTriggers 时，必须明确这是背景延续型大运，不得硬造重大事件。",
      "只展开证据最强的二至三个现实领域，不要机械地把事业、财务、感情、家庭全部写一遍。",
      "同一事实只能讲一次，不得在不同章节重复复述。",
      "不得使用一定、必然、注定；不得凭空断具体职业、金额、疾病、婚期、灾祸。",
      "表达要像专业命理师讲阶段故事：先定主线，再讲现实承接，再讲可能发展、转折和落点。",
      "输出结构固定为：",
      "### 一句话主线",
      "### 十年阶段故事",
      "### 主要现实落点",
      "### 可利用的力量与代价",
      "### 需要核实的现实问题",
      "每个结论都必须来自 trustedPack；不要展示 JSON、字段名或内部证据 ID。",
    ].join("\n"),
    user: JSON.stringify({
      task: "根据可信事实包解释当前大运，讲清阶段主线、现实承接、可能发展与代价。",
      trustedPack,
    }, null, 2),
    trustedPack,
    evidenceIds: trustedPack.allowedEvidenceRefs,
  };
}
