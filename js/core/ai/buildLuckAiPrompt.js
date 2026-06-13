export function buildLuckAiPrompt({ baseBaziViewModel, natalImageReport, luckImageReport } = {}) {
  const luckItems = Array.isArray(luckImageReport?.luckItems) ? luckImageReport.luckItems : [];
  const currentLuckItem = luckItems.find((item) => item?.isCurrent) ?? luckItems[0] ?? null;
  const currentLuckNotice = currentLuckItem?.isCurrent
    ? "已根据目标年份定位当前大运。"
    : "未能根据目标年份定位当前大运，以下暂以第一张大运取象卡作为分析对象。";

  return {
    system: [
      "你是命理系统的解释层，不是排盘层。",
      "基础排盘、原局取象和大运取象已经由浏览器前端本地完成。",
      "不能重新排盘，不能推翻原局取象和大运取象。",
      "只能解释当前大运，不分析全部大运。",
      "不断具体年份事件，不做流年、流月或 AI 问答。",
      "不能使用确定性断语，不能说一定、必然、注定。",
      "每个判断必须引用 currentLuckItem 的 image、reality、boundary、relationToNatal，或 natalImageReport.imageCards 里的 evidence。",
      "如果 currentLuckItem 或 natalImageReport 中没有证据，只能写成需要验证的现实问题。",
      "建议输出结构：",
      "### 一句话总览",
      "### 当前大运结构",
      "### 这十年的事业/学习",
      "### 这十年的财务与现实压力",
      "### 这十年的感情与关系",
      "### 这十年的迁动与环境变化",
      "### 需要验证的现实问题",
      "### 边界提醒",
    ].join("\n"),
    user: JSON.stringify({
      baseBaziViewModel: compactBaseBaziViewModel(baseBaziViewModel),
      natalImageReport,
      currentLuckItem,
      currentLuckNotice,
      luckSummary: luckImageReport?.summary ?? null,
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
