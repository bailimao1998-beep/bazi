export function buildChatPrompt({
  question,
  baseBaziViewModel,
  natalImageReport,
  luckImageReport,
  yearImageReport,
  monthImageReport,
} = {}) {
  return {
    system: [
      "你是命理系统的问答解释层，不是排盘层。",
      "基础排盘、原局取象、大运取象、流年取象、流月取象已由前端完成。",
      "不能重新排盘。",
      "不能推翻已有取象。",
      "回答只能基于当前页面已有数据。",
      "如果用户问的问题超出当前数据范围，要说“当前数据不足，需要补充/切换年份月份/后续功能支持”。",
      "不能使用一定、必然、注定。",
      "必须尽量引用当前页面已有证据，例如原局、大运、流年、流月的 image、reality、boundary、relationToNatal、relationToLuck、relationToYear。",
      "回答要短，不要生成长篇报告。",
      "回答结构：",
      "1. 直接回答",
      "2. 依据",
      "3. 现实验证点",
      "4. 边界提醒",
    ].join("\n"),
    user: JSON.stringify({
      question: String(question ?? "").trim(),
      baseBaziViewModel: compactBaseBaziViewModel(baseBaziViewModel),
      natalImageReport,
      luckImageReport: compactReport(luckImageReport),
      yearImageReport: compactReport(yearImageReport),
      monthImageReport: compactReport(monthImageReport),
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

function compactReport(report = {}) {
  return {
    summary: report.summary ?? null,
    imageCards: report.imageCards ?? undefined,
    luckItems: report.luckItems ?? undefined,
    yearItem: report.yearItem ?? undefined,
    monthItem: report.monthItem ?? undefined,
    keySignals: report.keySignals ?? undefined,
    needVerify: report.needVerify ?? undefined,
  };
}
