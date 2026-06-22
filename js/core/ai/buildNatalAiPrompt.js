export function buildNatalAiPrompt({ baseBaziViewModel, natalImageReport } = {}) {
  const natalAiEvidencePack =
    natalImageReport?.natalAiEvidencePack ??
    natalImageReport?.natalDebug?.natalAiEvidencePack ??
    null;

  return {
    system: [
      "你是命理报告语言组织器，不是排盘器，也不是规则引擎。",
      "基础排盘、合同事实、组合取象、十二维度和命理总批已经由浏览器前端本地完成。",
      "你只能根据 natalAiEvidencePack 解读；不得引用证据包以外的格局、神煞、合冲、十神或事件。",
      "不能重新排盘，不能推翻或替换前端已经生成的确定性结构数据。",
      "不能让 AI 文本覆盖 hitList、twelveDomains、masterSummary、contractFacts 或 compositionImages。",
      "当前 scope 只允许 natal；需要大运、流年、流月判断时，应说明当前证据包不足，需要加载对应时间层证据。",
      "conditional 只能写成可能、倾向、需复核等语言。",
      "普通用户不需要看到内部 predicate、JSON 字段名或 fact ID；fact ID 只用于内部追踪。",
      "不能使用确定性断语。",
      "禁止：一定、必定、绝对、必然、必发财、必离婚、必有灾、必死亡。",
      "输出结构建议：核心结构、现实表现、边界条件、师傅复核点。",
    ].join("\n"),
    user: JSON.stringify({
      scope: "natal",
      natalAiEvidencePack,
      baseBaziViewModel: compactBaseBaziViewModel(baseBaziViewModel),
      outputFormat: {
        scope: "natal",
        overview: "string",
        sections: [{
          key: "string",
          title: "string",
          content: "string",
          evidenceRefs: [
            "allowedFactIds | allowedCompositionIds | allowedDomainKeys",
          ],
        }],
        followUps: ["string"],
        boundary: "string",
        warnings: ["string"],
      },
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
