export function buildChatPrompt({
  question,
  input,
  chart,
  baseBaziViewModel,
  natalImageReport,
  luckImageReport,
  yearImageReport,
  monthImageReport,
  monthImageReports,
  chatIntent,
  requestedYears,
  requestedYearReports,
} = {}) {
  return {
    system: [
      "你是命理系统的问答解释层，同时也是一般 AI 问答助手。",
      "优先基于当前命盘完整数据快照回答，不依赖页面是否展开或是否显示。",
      "如果问题涉及命理判断，必须尽量引用原局、大运、流年、流月中的证据。",
      "如果问题超出命盘数据，可以用一般常识和推理回答，但必须说明哪些是命盘依据，哪些是推演判断，哪些是现实假设。",
      "不能假装命盘能确认现实事实。",
      "不能使用一定、必然、注定。",
      "用户问多年走势时，优先读取 requestedYearReports。",
      "用户问月份差异时，优先读取 monthImageReports。",
      "用户问普通问题时，可以作为一般 AI 助手回答；如果用户要求结合命盘，再结合命盘。",
      "默认回答简洁；用户要求详细时可以展开。",
    ].join("\n"),
    user: JSON.stringify({
      question: String(question ?? "").trim(),
      chatIntent,
      requestedYears,
      input: compactInput(input),
      chartSummary: compactChartSummary(chart, baseBaziViewModel),
      baseBaziViewModel: compactBaseBaziViewModel(baseBaziViewModel),
      natalImageReport,
      luckImageReport: compactReport(luckImageReport),
      yearImageReport: compactReport(yearImageReport),
      monthImageReport: compactReport(monthImageReport),
      monthImageReports: compactMonthReports(monthImageReports),
      requestedYearReports: compactRequestedYearReports(requestedYearReports),
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
function compactInput(input = {}) {
  return {
    name: input.name,
    gender: input.gender,
    birthDate: input.birthDate,
    birthTime: input.birthTime,
    birthplace: input.birthplace,
    targetYear: input.targetYear,
    selectedMonth: input.selectedMonth,
    trueSolarTime: input.trueSolarTime,
  };
}

function compactChartSummary(chart = {}, baseBaziViewModel = {}) {
  const pillars = baseBaziViewModel?.pillars ?? [];

  return {
    dayMaster: baseBaziViewModel?.dayMaster ?? chart?.dayMaster,
    pillars: pillars.map((item) => ({
      key: item.key,
      name: item.name,
      pillar: item.pillar,
      stem: item.stem,
      branch: item.branch,
      stemTenGod: item.stemTenGod,
      branchMainTenGod: item.branchMainTenGod,
      hiddenStems: item.hiddenStems,
      shensha: item.shensha,
    })),
    fiveElements: baseBaziViewModel?.fiveElements,
    tenGods: baseBaziViewModel?.tenGods,
    relations: baseBaziViewModel?.relations,
    structureAnalysis: baseBaziViewModel?.structureAnalysis,
    luckCycles: baseBaziViewModel?.luckCycles,
  };
}

function compactMonthReports(reports = []) {
  return (Array.isArray(reports) ? reports : []).map((report) => {
    const item = report?.monthItem ?? {};

    return {
      summary: report?.summary ?? null,
      keySignals: report?.keySignals ?? [],
      needVerify: report?.needVerify ?? [],
      monthItem: {
        year: item.year,
        month: item.month,
        ganZhi: item.ganZhi,
        stemTenGod: item.stemTenGod,
        branchTenGod: item.branchTenGod,
        relationToNatal: item.relationToNatal ?? [],
        relationToLuck: item.relationToLuck ?? [],
        relationToYear: item.relationToYear ?? [],
        image: item.image,
        reality: item.reality,
        boundary: item.boundary,
        confidence: item.confidence,
      },
    };
  });
}

function compactRequestedYearReports(reports = []) {
  return (Array.isArray(reports) ? reports : []).map((item) => ({
    year: item.year,
    luckImageReport: compactReport(item.luckImageReport),
    yearImageReport: compactReport(item.yearImageReport),
  }));
}