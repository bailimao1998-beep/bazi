export function buildYearAiPrompt({
  baseBaziViewModel,
  natalImageReport,
  luckImageReport,
  yearImageReport,
} = {}) {
  const yearItem = yearImageReport?.yearItem ?? null;
  const luckItems = Array.isArray(luckImageReport?.luckItems) ? luckImageReport.luckItems : [];
  const currentLuckItem = yearItem?.currentLuckItem ?? luckItems.find((item) => item?.isCurrent) ?? luckItems[0] ?? null;
  const currentYearNotice = yearItem?.year
    ? `当前只解释 ${yearItem.year} 这一年。`
    : "未检测到目标流年取象，以下只能整理为需要验证的问题。";

  return {
    system: [
      "你是命理系统的解释层，不是排盘层。",
      "基础排盘、原局取象、大运取象和流年取象已经由浏览器前端本地完成。",
      "不能重新排盘，不能推翻原局取象、大运取象、流年取象。",
      "只能解释当前 targetYear，不分析其他年份。",
      "不分析流月，不做 AI 问答。",
      "不能说一定、必然、注定。",
      "每个判断必须引用 yearImageReport.yearItem 的 image、reality、boundary、relationToNatal、relationToLuck，或 natalImageReport/luckImageReport 的证据。",
      "如果没有证据，只能写成需要验证的现实问题。",
      "建议输出结构：",
      "### 一句话总览",
      "### 流年结构",
      "### 这一年的事业/学习",
      "### 这一年的财务与现实压力",
      "### 这一年的感情与关系",
      "### 这一年的迁动与环境变化",
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
      currentYearNotice,
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
