export function buildMonthAiPrompt({
  baseBaziViewModel,
  natalImageReport,
  luckImageReport,
  yearImageReport,
  monthImageReport,
} = {}) {
  const monthItem = monthImageReport?.monthItem ?? null;
  const yearItem = monthItem?.yearItem ?? yearImageReport?.yearItem ?? null;
  const luckItems = Array.isArray(luckImageReport?.luckItems) ? luckImageReport.luckItems : [];
  const currentLuckItem = monthItem?.currentLuckItem ?? yearItem?.currentLuckItem ?? luckItems.find((item) => item?.isCurrent) ?? luckItems[0] ?? null;
  const currentMonthNotice = monthItem?.year && monthItem?.month
    ? `当前只解释 ${monthItem.year} 年 ${monthItem.month} 月。`
    : "未检测到目标流月取象，以下只能整理为需要验证的问题。";

  return {
    system: [
      "你是命理系统的解释层，不是排盘层。",
      "基础排盘、原局取象、大运取象、流年取象和流月取象已经由浏览器前端本地完成。",
      "不能重新排盘，不能推翻原局、大运、流年、流月取象。",
      "只能解释当前 selectedMonth，不分析其他月份。",
      "不分析全年所有月份，不做 AI 问答。",
      "不能说一定、必然、注定。",
      "每个判断必须引用 monthImageReport.monthItem 的 image、reality、boundary、relationToNatal、relationToLuck、relationToYear，或上层原局/大运/流年证据。",
      "如果没有证据，只能写成需要验证的现实问题。",
      "建议输出结构：",
      "### 一句话总览",
      "### 流月结构",
      "### 这个月的事业/学习",
      "### 这个月的财务与现实压力",
      "### 这个月的感情与关系",
      "### 这个月的行动建议",
      "### 需要验证的现实问题",
      "### 边界提醒",
    ].join("\n"),
    user: JSON.stringify({
      baseBaziViewModel: compactBaseBaziViewModel(baseBaziViewModel),
      natalImageReport,
      currentLuckItem,
      luckSummary: luckImageReport?.summary ?? null,
      yearItem,
      yearSummary: yearImageReport?.summary ?? null,
      monthItem,
      monthSummary: monthImageReport?.summary ?? null,
      currentMonthNotice,
    }, null, 2),
  };
}

function compactBaseBaziViewModel(viewModel = {}) {
  return {
    birthInfo: viewModel.birthInfo,
    pillars: viewModel.pillars,
    fiveElements: viewModel.fiveElements,
    tenGods: viewModel.tenGods,
    relations: viewModel.relations,
    structureAnalysis: viewModel.structureAnalysis,
  };
}
