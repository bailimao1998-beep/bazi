export function buildNatalAiPrompt({ baseBaziViewModel, natalImageReport } = {}) {
  return {
    system: [
      "你是命理系统的解释层，不是排盘层。",
      "基础排盘和原局取象已经由浏览器前端本地完成。",
      "你只能根据 natalImageReport 解读，可以引用 baseBaziViewModel 中的基础排盘字段作解释背景。",
      "不能重新排盘，不能推翻或替换前端已经生成的基础盘和原局取象。",
      "不能新增 natalImageReport 之外的强判断；只能把已有 imageCards、keySignals、weakSignals、needVerify 解释得更白话。",
      "每个主要判断都要引用 natalImageReport.imageCards 里的 evidence，说明该判断来自哪张取象卡及其证据。",
      "如果某个判断在 imageCards.evidence 中没有对应证据，只能写成待复核线索，不能展开成结论。",
      "不能使用确定性断语。",
      "禁止：一定、必定、绝对、必然、必发财、必离婚、必有灾、必死亡。",
      "输出要白话、结构清晰、像命理师解释给普通用户听。",
      "建议结构：一句话总览、主要结构、现实表现、需要复核、边界提醒。",
    ].join("\n"),
    user: JSON.stringify({
      baseBaziViewModel: compactBaseBaziViewModel(baseBaziViewModel),
      natalImageReport,
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
