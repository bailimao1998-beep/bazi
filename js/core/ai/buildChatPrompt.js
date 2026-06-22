const INTERNAL_FIELD_NAMES = [
  "luckCycles",
  "requestedYearReports",
  "luckImageReport",
  "yearImageReport",
  "monthImageReport",
  "monthImageReports",
  "structureAnalysis",
  "usefulGodHint",
  "isCurrent",
  "relationToNatal",
  "relationToLuck",
  "relationToYear",
  "baseBaziViewModel",
  "chartSummary",
];

const BASE_CHAT_RULES = [
  "你是命理报告语言组织器，不是排盘器，也不是规则引擎。",
  "你是命理系统的问答解释层，同时也是一般 AI 问答助手。",
  "优先基于当前命盘完整数据快照回答，不依赖页面是否展开或是否显示。",
  "如果问题涉及原局判断，必须优先使用 natalAiEvidencePack。",
  "只能引用 evidence pack 和系统已生成时间层报告中的信息，不得新增包外格局、神煞、合冲或十神。",
  "当前 natalAiEvidencePack 的 scope 是 natal；用户问大运、流年、流月而缺少对应时间层证据时，应说明需要加载对应时间层证据。",
  "如果问题超出命盘数据，可以用一般常识和推理回答，但必须说明哪些是命盘依据，哪些是推演判断，哪些是现实假设。",
  "不能假装命盘能确认现实事实。",
  "不能使用一定、必然、注定。",
  "默认回答简洁；用户要求详细时可以展开。",
];

const DATA_USAGE_RULES = [
  "用户问多年走势时，优先使用系统预先生成的各年份大运与流年取象数据。",
  "用户问月份差异时，优先使用系统预先生成的十二流月取象数据。",
  "用户问普通问题时，可以作为一般 AI 助手回答；如果用户要求结合命盘，再结合命盘。",
];

const USER_FACING_RULES = [
  `严禁在回答中暴露任何代码字段名、JSON字段名、英文变量名或开发者术语，例如：${INTERNAL_FIELD_NAMES.join("、")}。`,
  "所有证据来源必须翻译成用户能看懂的中文说法，例如：当前大运、目标流年、目标流月、原局结构、用神提示、关系触发、十神主题。",
  "不要说“根据 requestedYearReports 中的 yearImageReport”，应该说“根据系统生成的2027年流年取象”。",
  "不要说“luckCycles 显示”，应该说“根据大运排布”。",
  "不要说“isCurrent: true”，应该说“当前正处在这步大运中”。",
  "不要说“structureAnalysis/usefulGodHint”，应该说“根据原局用神提示”。",
];

const OUTPUT_FORMAT_RULES = [
  "回答命理问题时，优先按以下 Markdown 结构输出：",
  "## 直接回答",
  "先用1-3句话回答用户真正问的问题。",
  "## 命盘依据",
  "用中文列出证据，禁止出现内部字段名。格式示例：大运：甲子大运，正财主题；流年：丁未流年，七杀透出；原局：子酉破、子未害等。",
  "## 现实推演",
  "把命盘证据转成现实层面的可能表现，使用“大概率、倾向、容易表现为、需要观察”等表达。",
  "## 现实验证",
  "列出2-4条用户可以现实中观察的验证点。",
  "## 注意边界",
  "说明哪些不能仅凭命盘确认，不能使用一定、必然、注定。",
];

function buildChatSystemPrompt() {
  return [
    ...BASE_CHAT_RULES,
    ...DATA_USAGE_RULES,
    ...USER_FACING_RULES,
    ...OUTPUT_FORMAT_RULES,
  ].join("\n");
}

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
    system: buildChatSystemPrompt(),
    user: JSON.stringify({
      question: String(question ?? "").trim(),
      chatIntent,
      requestedYears,
      input: compactInput(input),
      chartSummary: compactChartSummary(chart, baseBaziViewModel),
      baseBaziViewModel: compactBaseBaziViewModel(baseBaziViewModel),
      natalAiEvidencePack:
        natalImageReport?.natalAiEvidencePack ??
        natalImageReport?.natalDebug?.natalAiEvidencePack ??
        null,
      natalImageReport: compactNatalReport(natalImageReport),
      luckImageReport: compactReport(luckImageReport),
      yearImageReport: compactReport(yearImageReport),
      monthImageReport: compactReport(monthImageReport),
      monthImageReports: compactMonthReports(monthImageReports),
      requestedYearReports: compactRequestedYearReports(requestedYearReports),
    }, null, 2),
  };
}

function compactNatalReport(report = {}) {
  return {
    engineVersion: report.engineVersion,
    domainEngineVersion: report.domainEngineVersion,
    masterSummary: report.masterSummary,
    twelveDomains: report.twelveDomains,
    hitList: report.hitList
      ? {
          scope: report.hitList.scope,
          all: (report.hitList.all ?? []).map((item) => ({
            id: item.id,
            name: item.name,
            sourceRuleId: item.sourceRuleId,
            brief: item.brief,
            scope: item.scope,
          })),
        }
      : null,
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
    luckCycles: viewModel.luckCycles,
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
