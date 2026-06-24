import { buildStageAiTrustedPack } from "./buildStageAiTrustedPack.js";

export function buildMonthAiPrompt({
  baseBaziViewModel,
  natalImageReport,
  luckImageReport,
  yearImageReport,
  monthImageReport,
} = {}) {
  const monthItem = monthImageReport?.monthItem ?? null;
  const yearItem = monthItem?.yearItem ?? yearImageReport?.yearItem ?? null;
  const luckItems = Array.isArray(luckImageReport?.luckItems)
    ? luckImageReport.luckItems
    : [];
  const currentLuckItem = monthItem?.currentLuckItem ??
    yearItem?.currentLuckItem ??
    luckItems.find((item) => item?.isCurrent) ??
    luckItems[0] ??
    null;

  const trustedPack = buildStageAiTrustedPack({
    stage: "month",
    item: monthItem,
    currentLuckItem,
    yearItem,
    baseBaziViewModel,
    natalImageReport,
  });

  return {
    system: [
      "你是八字命理系统的岁运解释层，不是排盘层。",
      "浏览器已经完成原局、大运、流年、流月结构、层级关系和触发取象；你只能解释 trustedPack，不能重新排盘或补算。",
      "本次只解释当前流月，不分析其他月份，不重新讲完整大运和完整流年。",
      "流月必须作为大运和流年的短期执行层来讲：先承接年度背景，再说明本月新增触发。",
      "讲述顺序必须读取 trustedPack.storyPack.storyOrder：opening → development → turn → landing。",
      "十神主次必须读取 trustedPack.themeHierarchy：primary 是流月天干外显主线；supporting 是流月地支现实承接背景。不得平均展开。",
      "directTriggers 决定本月最值得观察的具体变化；hierarchyInteractions 说明本月怎样承接或调整流年；convergence 说明现实落点。",
      "conditionalPatterns 必须降级，只能放在最后作为辅助趋势或待验证条件；不得写进一句话总览，不得写成已成局或必然事件。",
      "流月篇幅应短于流年，只展开一至两个最强领域；没有直接触发时，不得硬造事件。",
      "同一事实只能讲一次，不得在事业、关系、行动建议中重复换词复述。",
      "不得使用一定、必然、注定；不得凭空断具体职业、金额、疾病、婚期、灾祸。",
      "输出结构固定为：",
      "### 本月一句话",
      "### 本月怎样展开",
      "### 现实落点与节奏",
      "### 可利用方式与需要控制的代价",
      "### 需要核实的现实问题",
      "每个结论都必须来自 trustedPack；不要展示 JSON、字段名或内部证据 ID。",
    ].join("\n"),
    user: JSON.stringify({
      task: "根据可信事实包解释当前流月，突出短期触发、执行节奏、现实落点和需要核实的问题。",
      trustedPack,
    }, null, 2),
    trustedPack,
    evidenceIds: trustedPack.allowedEvidenceRefs,
  };
}
