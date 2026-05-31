(function () {
const ELEMENT_LABELS = {
  wood: "木",
  fire: "火",
  earth: "土",
  metal: "金",
  water: "水",
};

const FORBIDDEN_TEXT = /(一定|必定|绝对|必然|必离婚|必发财|必有灾|必坐牢|必死亡)/g;
const EMPTY_TEXT = "此处暂未形成突出的盘面信号，可随规则库继续补充。";

function buildCoreReadingReport(input = {}) {
  const reading = input.reading ?? input;
  const state = input.state ?? {};
  const context = collectReportContext(reading, state);
  const prioritySignals = buildPrioritySignals(context);
  const report = {
    headline: buildHeadline(context, prioritySignals),
    prioritySignals,
    teacherSummary: buildTeacherSummary(context, prioritySignals),
    secondaryNotes: buildSecondaryNotes(context, prioritySignals),
    mainNarrative: buildMainNarrative(context, prioritySignals),
    structureSections: buildStructureSections(context),
    themeSections: buildThemeSections(context),
    evidenceChain: buildEvidenceChain(context),
    uncertaintyNotes: buildUncertaintyNotes(context),
    transitBridge: "原局只看结构，具体年份需要看大运、流年、流月是否再次触发原局主题。",
  };
  return sanitizeReport(report);
}

function collectReportContext(reading = {}, state = {}) {
  const natal = reading.natal ?? {};
  const display = natal.basicBaziDisplay ?? {};
  const pillars = natal.pillars ?? display.pillars ?? {};
  const day = pillars.day ?? {};
  const month = pillars.month ?? {};
  const calendar = display.calendar ?? natal.chartMeta?.calendar ?? {};
  const elements = normalizeElementCounts(natal.elements, display.elementStats?.visible?.counts);
  const hiddenElements = normalizeElementCounts(display.elementStats?.hidden?.counts);
  const tenGodCounts = countTenGods(natal.tenGods, display.tenGods?.stats?.fullHidden);
  const combinations = asArray(natal.combinations);
  const displayRelations = asArray(display.relations);
  const pairInteractions = asArray(natal.pairInteractions);
  const matchedRules = asArray(natal.matchedRules);
  const patternCandidates = asArray(natal.patternCandidates);
  const referenceKnowledgeHits = asArray(natal.referenceKnowledgeHits);
  const learningRuleHits = asArray(natal.learningRuleHits);
  const basicInterpretations = asArray(natal.basicInterpretations);
  const judgement = reading.judgement ?? {};
  const transit = reading.transit ?? {};
  return {
    reading,
    state,
    natal,
    display,
    pillars,
    day,
    month,
    calendar,
    elements,
    hiddenElements,
    tenGodCounts,
    combinations,
    displayRelations,
    pairInteractions,
    matchedRules,
    patternCandidates,
    referenceKnowledgeHits,
    learningRuleHits,
    basicInterpretations,
    overallAnalysis: asArray(natal.overallAnalysis),
    strengthSignals: asArray(natal.strengthSignals),
    judgement,
    judgementEvidence: asArray(judgement.evidence),
    transit,
    transitTriggers: asArray(transit.triggers),
    transitHits: asArray(transit.hits),
    luck: reading.luck,
    trueSolarTime: Boolean(state.trueSolarTime ?? calendar.trueSolarTime?.enabled),
  };
}

function buildHeadline(context, prioritySignals = []) {
  const dayMaster = formatDayMaster(context);
  const month = formatMonthBranch(context);
  const firstSignal = prioritySignals[0]?.title;
  const focus = firstSignal && !firstSignal.includes("日主") ? firstSignal : formatElementFocus(context);
  return `此盘以${dayMaster}日主为中心，${month}月令提供读盘入口，当前最值得先看的重点是${focus}。`;
}

function buildPrioritySignals(context) {
  const signals = [];
  const elementProfile = getElementProfile(context.elements);
  const tenGodProfile = getTenGodProfile(context.tenGodCounts);
  const relationSummary = summarizeRelations(context);
  const candidateSummary = summarizeCandidates(context);
  const transitSummary = summarizeTransit(context);
  const relationCount = countRelations(context);
  const candidateCount = countCandidates(context);

  signals.push({
    title: "日主与月令入口",
    level: "main",
    score: 92,
    whyImportant: "日主是参照点，月令是季节背景，两者决定后面五行和十神该从哪里入手。",
    evidence: `日干为${context.day.stem ?? "待查"}，月支为${context.month.branch ?? "待查"}；日主五行为${elementName(context.day.stemElement, context.day.stemElementLabel)}，月令五行为${elementName(context.month.branchElement, context.month.branchElementLabel)}。`,
    howToRead: `先把${formatDayMaster(context)}放在中心，再看${formatMonthBranch(context)}对它的承接、助力或约束。`,
    nextCheck: "接着核对月令与五行统计是否同向。",
  });

  if (elementProfile.top && elementProfile.isHigh) {
    signals.push({
      title: `${elementProfile.top.label}行偏重`,
      level: "main",
      score: 98,
      whyImportant: "五行偏重会改变读盘重心，报告需要先说明它从哪里来，以及是否过于集中。",
      evidence: `${elementProfile.top.label}统计值为${formatNumber(elementProfile.top.value)}；五行统计为${formatElementSummary(context.elements)}。`,
      howToRead: `先看${elementProfile.top.label}来自天干、地支还是藏干，再观察它和日主、月令、十神之间的关系。`,
      nextCheck: "继续看偏少五行能否形成调节方向。",
    });
  } else if (elementProfile.top) {
    signals.push({
      title: "五行分布入口",
      level: "support",
      score: 82,
      whyImportant: "五行分布能帮助判断盘面先看哪类气势，再决定十神和关系层怎么读。",
      evidence: `五行统计为${formatElementSummary(context.elements)}。`,
      howToRead: "先比较明面五行，再补看藏干口径，避免只凭单个字下判断。",
      nextCheck: "继续区分天干、地支本气和藏干来源。",
    });
  }

  if (elementProfile.low && elementProfile.isLow) {
    signals.push({
      title: `${elementProfile.low.label}行补足/调节`,
      level: "watch",
      score: 74,
      whyImportant: "偏少五行不是结论，而是提示读盘时要留意结构的调节方向。",
      evidence: `${elementProfile.low.label}统计值为${formatNumber(elementProfile.low.value)}；五行统计为${formatElementSummary(context.elements)}。`,
      howToRead: `观察${elementProfile.low.label}是否在藏干、岁运或关系层中出现，并看它是否能参与全局流通。`,
      nextCheck: "继续结合柱位、旺衰和岁运复核。",
    });
  }

  if (tenGodProfile.top) {
    signals.push({
      title: "十神重心",
      level: tenGodProfile.isConcentrated ? "main" : "support",
      score: tenGodProfile.isConcentrated ? 90 : 80,
      whyImportant: "十神把五行关系转成学习主题，集中出现时更适合提前说明主题方向。",
      evidence: `十神统计：${formatTenGodSummary(context.tenGodCounts)}；当前较突出的十神为${tenGodProfile.top.name}${formatNumber(tenGodProfile.top.value)}。`,
      howToRead: "先看它们是否透出、落在哪些柱位，再看和日主、月令之间如何配合。",
      nextCheck: "继续核对十神所在柱位与透藏层次。",
    });
  }

  if (relationSummary) {
    signals.push({
      title: "干支关系互动",
      level: relationCount >= 3 ? "main" : "support",
      score: relationCount >= 3 ? 88 : 76,
      whyImportant: "关系层能说明盘内字与字如何牵动，是把静态五行读成结构互动的关键。",
      evidence: `出现关系：${relationSummary}`,
      howToRead: "先看参与关系的柱位，再回到十神含义和五行力量，观察它在原局中的位置。",
      nextCheck: "继续核对关系是否被岁运再次触发。",
    });
  }

  if (candidateSummary) {
    signals.push({
      title: "候选结构/规则命中",
      level: "support",
      score: candidateCount >= 3 ? 84 : 72,
      whyImportant: "规则命中用于提示学习路径，适合把零散证据整理成候选结构。",
      evidence: `命中规则：${candidateSummary}`,
      howToRead: "把它当作候选观察，逐条核对规则条件、资料等级和盘面证据。",
      nextCheck: "继续看候选结构是否同时得到日主、月令、五行和十神支持。",
    });
  }

  if (transitSummary) {
    signals.push({
      title: "岁运触发接口",
      level: "watch",
      score: 68,
      whyImportant: "岁运不是原局本身，但能提示哪些原局主题可能在年份层被再次点亮。",
      evidence: `岁运线索：${transitSummary}`,
      howToRead: "先回到原局主题，再看大运、流年、流月是否重复触发同类五行、十神或关系。",
      nextCheck: "继续查看大运流年模块的触发层。",
    });
  }

  return ensurePriorityRange(signals);
}

function buildTeacherSummary(context, prioritySignals = []) {
  const topSignals = prioritySignals.slice(0, 3);
  const first = topSignals[0];
  const second = topSignals[1];
  const third = topSignals[2];
  const paragraphs = [];

  if (first) {
    paragraphs.push(`第一个重点是${first.title}。${first.evidence}这说明讲盘入口要先定中心和背景，${trimSentenceEnd(first.howToRead)}。`);
  }
  if (second) {
    paragraphs.push(`第二个重点是${second.title}。${second.evidence}报告会围绕这个信号看来源、集中度和调节方向，而不是把它直接翻成事件。`);
  }
  if (third) {
    paragraphs.push(`第三个重点是${third.title}。${third.evidence}${trimSentenceEnd(third.howToRead)}；再看它和前两个重点是否互相呼应。`);
  }

  const linkedTitles = topSignals.map((item) => item.title).join("、");
  paragraphs.push(`把前三个重点连起来看，主线就是先抓${linkedTitles || "日主、月令和五行"}，再补十神、关系和规则命中的证据。这样读盘会更像老师带着复盘：先分主次，再看细节。`);

  const secondary = prioritySignals.slice(3).map((item) => item.title).join("、");
  if (secondary) {
    paragraphs.push(`后面的${secondary}先放在辅助层。它们不是被忽略，而是等主线站稳后，用来检查有没有补充证据或需要修正的地方。`);
  }

  paragraphs.push("最后再接到岁运：原局负责说明结构，具体年份需要看大运、流年、流月是否再次触发这些主题。");
  return paragraphs.slice(0, 6);
}

function buildSecondaryNotes(context, prioritySignals = []) {
  const shown = new Set(prioritySignals.map((item) => item.title));
  const notes = [];
  const candidateSummary = summarizeCandidates(context);
  const transitSummary = summarizeTransit(context);
  if (candidateSummary && !shown.has("候选结构/规则命中")) {
    notes.push(`候选结构可后置复核：${candidateSummary}`);
  }
  if (transitSummary && !shown.has("岁运触发接口")) {
    notes.push(`岁运线索可在大运流年模块继续查看：${transitSummary}`);
  }
  if (!notes.length) {
    notes.push("辅助层先保持轻量，优先把前三个读盘重点讲清楚。");
  }
  return notes;
}

function buildMainNarrative(context, prioritySignals = []) {
  const dayMaster = formatDayMaster(context);
  const month = formatMonthBranch(context);
  const elementSummary = formatElementSummary(context.elements);
  const lowElements = formatLowElements(context.elements);
  const tenGodSummary = formatTenGodSummary(context.tenGodCounts);
  const relations = summarizeRelations(context);
  const candidates = summarizeCandidates(context);
  const strength = summarizeStrength(context.strengthSignals);
  const basicLine = summarizeBasicInterpretations(context.basicInterpretations);
  const overallLine = context.overallAnalysis.slice(0, 2).join("；");
  const priorityLine = prioritySignals.slice(0, 3).map((item) => item.title).join("、");
  return [
    priorityLine ? `本盘主线先围绕${priorityLine}展开，其他内容放在辅助层复核。` : "",
    `日干为${context.day.stem ?? "待查"}，五行属${elementName(context.day.stemElement, context.day.stemElementLabel)}，所以本报告先以${dayMaster}作为读盘中心；其他五行、十神和干支关系，都要回到这个中心观察。`,
    `月支为${context.month.branch ?? "待查"}，五行属${elementName(context.month.branchElement, context.month.branchElementLabel)}，月令代表出生月份的主气；${month}对日主和全局结构的影响，是学习旺衰和取象层次的第一入口。`,
    `五行分布显示：${elementSummary}。其中${formatElementFocus(context)}；${lowElements}。这些信息只说明结构偏重和平衡方向，不直接当作吉凶结论。`,
    `十神层面可以先看${tenGodSummary || "当前十神统计仍需补充"}。十神用于把五行生克转成学习主题，例如资源、表达、规则、财星和同类力量，但仍要看它们落在什么柱位、是否透出、是否被岁运触发。`,
    relations ? `干支关系层面，当前可见${relations}。这些关系是盘内结构互动点，适合用来解释字与字之间如何牵连，仍需回到日主、月令和十神复核。` : "干支关系层面暂未形成突出展示，读盘可以先回到五行分布和十神重心，再等待岁运或更多规则补充。", 
    candidates ? `格局和规则层面，${candidates}可作为候选结构观察。这里的“候选”表示值得继续核对柱位、旺衰和来源，不表示已经形成定论。` : "格局和规则层面当前没有强展示项，先把基础盘、五行、十神和干支关系讲清楚。", 
    strength || basicLine || overallLine
      ? `补充线索：${[strength, basicLine, overallLine].filter(Boolean).join("；")}。这些内容适合当作传统命理中可作为观察点，需要继续和盘面证据互相核对。`
      : "补充线索暂时较少，报告先保持结构化学习口径，后续可随着规则库和案例复盘继续丰富。",
    "原局主要回答“这张盘的结构在哪里”，具体年份还要看大运、流年、流月是否再次触发这些原局主题。",
  ].filter(Boolean);
}

function buildStructureSections(context) {
  return [
    {
      title: "日主与月令",
      evidence: `日干为${context.day.stem ?? "待查"}，月支为${context.month.branch ?? "待查"}；日主五行为${elementName(context.day.stemElement, context.day.stemElementLabel)}，月令五行为${elementName(context.month.branchElement, context.month.branchElementLabel)}。`,
      explanation: `先以${formatDayMaster(context)}为中心，再看${formatMonthBranch(context)}提供的季节背景，判断学习时应从日主承接、月令力量和全局配合入手。`,
      needVerify: "简短复核柱位、旺衰、透干、藏干和岁运。",
    },
    {
      title: "五行力量",
      evidence: `五行统计：${formatElementSummary(context.elements)}；藏干口径：${formatElementSummary(context.hiddenElements)}。`,
      explanation: `${formatElementFocus(context)}，偏少处为${formatLowElements(context.elements)}，这提示读盘要同时观察来源、集中度和平衡方向。`,
      needVerify: "还要区分天干、地支本气和藏干权重，数量只是结构入口。",
    },
    {
      title: "十神分布",
      evidence: `十神统计：${formatTenGodSummary(context.tenGodCounts) || EMPTY_TEXT}`,
      explanation: "十神分布用来整理学习主题，例如资源、表达、规则、财星、同类力量等，不直接推出生活事件。",
      needVerify: "还要看十神所在柱位、透藏层次、旺衰承接和岁运触发。",
    },
    {
      title: "干支关系",
      evidence: summarizeRelations(context) ? `出现关系：${summarizeRelations(context)}` : EMPTY_TEXT,
      explanation: "干支关系说明盘内字与字之间的结构互动，传统命理中可作为观察点。",
      needVerify: "还要回到参与关系的柱位、十神和原局强弱继续核对。",
    },
    {
      title: "候选格局/规则命中",
      evidence: summarizeCandidates(context) ? `命中规则：${summarizeCandidates(context)}` : EMPTY_TEXT,
      explanation: "候选格局和规则命中只作为学习路径，用来提醒哪些结构值得继续看。",
      needVerify: "还要核对规则来源、资料等级、柱位条件和岁运是否配合。",
    },
  ];
}

function buildThemeSections(context) {
  const tenGodSummary = formatTenGodSummary(context.tenGodCounts) || EMPTY_TEXT;
  const relations = summarizeRelations(context) || EMPTY_TEXT;
  const evidenceBase = `日主${formatDayMaster(context)}、月令${formatMonthBranch(context)}、五行${formatElementSummary(context.elements)}`;
  return [
    {
      title: "自我与性格表达",
      observation: `先观察${formatDayMaster(context)}如何承接月令与五行分布，表达方式可以从日主、比劫、食伤和五行偏重处学习。`,
      evidence: `依据来自${evidenceBase}。`,
      limitation: "性格表达还受柱位、家庭环境和现实选择影响，当前只是候选信号。",
    },
    {
      title: "学习/资源/贵人结构",
      observation: "先看印星、资源类十神和藏干来源，观察学习、吸收、支持系统是否在盘面中较容易被看见。",
      evidence: `依据来自十神统计：${tenGodSummary}。`,
      limitation: "资源结构需要看是否透出、是否得地、是否能被日主承接。",
    },
    {
      title: "事业/规则/压力结构",
      observation: "先看官杀、印星、食伤和财星之间是否形成可解释的规则、责任、表达与资源链条。",
      evidence: `依据来自十神统计和规则命中：${[tenGodSummary, summarizeCandidates(context)].filter(Boolean).join("；") || EMPTY_TEXT}。`,
      limitation: "事业相关主题需要结合大运流年和现实阶段，只能先作为结构观察。",
    },
    {
      title: "感情/合作/关系结构",
      observation: "先看日支、财官类十神、合冲刑害破等关系层，观察互动方式和合作边界。",
      evidence: `依据来自干支关系与盘面互动：${relations}。`,
      limitation: "感情与合作需要结合具体对象、岁运触发和现实互动。",
    },
  ];
}

function buildEvidenceChain(context) {
  return [
    {
      step: 1,
      title: "日主证据",
      evidence: `日干为${context.day.stem ?? "待查"}，五行属${elementName(context.day.stemElement, context.day.stemElementLabel)}。`,
      meaning: "日主是所有五行和十神关系的参照点。",
      nextCheck: "继续看月令是否帮助、约束或引出日主主题。",
    },
    {
      step: 2,
      title: "月令证据",
      evidence: `月支为${context.month.branch ?? "待查"}，五行属${elementName(context.month.branchElement, context.month.branchElementLabel)}。`,
      meaning: "月令提供季节背景，是旺衰和结构重点的入口。",
      nextCheck: "继续看五行统计与月令是否互相呼应。",
    },
    {
      step: 3,
      title: "五行证据",
      evidence: `五行统计：${formatElementSummary(context.elements)}。`,
      meaning: "五行统计提示哪里较明显、哪里偏少，适合观察平衡方向。",
      nextCheck: "继续区分天干、地支本气和藏干来源。",
    },
    {
      step: 4,
      title: "十神证据",
      evidence: `十神统计：${formatTenGodSummary(context.tenGodCounts) || EMPTY_TEXT}`,
      meaning: "十神把生克关系翻译成学习主题。",
      nextCheck: "继续看十神落在哪些柱位，以及是否透出或被岁运触发。",
    },
    {
      step: 5,
      title: "关系证据",
      evidence: summarizeRelations(context) || EMPTY_TEXT,
      meaning: "关系层说明字与字之间的互动方式。",
      nextCheck: "继续看参与关系的柱位和十神含义。",
    },
    {
      step: 6,
      title: "规则命中证据",
      evidence: summarizeCandidates(context) || EMPTY_TEXT,
      meaning: "规则命中和候选格局用于提示可继续复核的结构。",
      nextCheck: "继续核对规则来源、条件和资料等级。",
    },
    {
      step: 7,
      title: "岁运触发证据",
      evidence: summarizeTransit(context) || EMPTY_TEXT,
      meaning: "岁运只作为触发层学习，需要回到原局主题。",
      nextCheck: "继续看大运、流年、流月是否再次触发同类主题。",
    },
  ];
}

function buildUncertaintyNotes(context) {
  return [
    {
      title: "出生时间是否准确",
      text: context.calendar.originalTime ? `当前输入时间为${context.calendar.originalTime}，分钟差异可能影响时柱。` : "当前按页面输入时间排盘，仍建议核对出生记录。",
    },
    {
      title: "真太阳时是否启用",
      text: context.trueSolarTime ? "当前已启用真太阳时，需要确认出生地经纬度来源。" : "当前未启用真太阳时，跨地区样本可另行复核。",
    },
    {
      title: "节气边界",
      text: context.calendar.solarTermRule ? `${context.calendar.solarTermRule}；靠近节气时建议复核节气时刻。` : "月柱通常按节气切换，靠近节气时建议复核。",
    },
    {
      title: "晚子时换日规则",
      text: context.calendar.dayPillarRule ? `${context.calendar.dayPillarRule}；子时附近样本需额外核对。` : "子时附近样本需核对是否涉及换日。",
    },
    {
      title: "起运仍需结合具体算法复核",
      text: context.luck?.startNote ?? "当前已给出起运信息，细节仍需结合算法口径复核。",
    },
    {
      title: "当前规则库还是 Beta",
      text: "当前规则库仍在 Beta 阶段，覆盖范围和资料卡会继续迭代。",
    },
    {
      title: "当前报告不是确定断语",
      text: "当前报告用于结构化学习，不是确定断语；所有观察点都需要结合柱位、旺衰、十神和岁运继续验证。",
    },
  ];
}

function ensurePriorityRange(signals) {
  const uniqueSignals = [];
  const seen = new Set();
  for (const signal of signals) {
    if (!signal?.title || seen.has(signal.title)) continue;
    seen.add(signal.title);
    uniqueSignals.push(signal);
  }

  const ordered = uniqueSignals
    .sort((left, right) => Number(right.score ?? 0) - Number(left.score ?? 0))
    .slice(0, 5);

  const fallbacks = [
    {
      title: "五行分布入口",
      level: "support",
      score: 60,
      whyImportant: "五行分布能帮助判断盘面先看哪类气势。",
      evidence: "五行统计仍可作为基础学习入口。",
      howToRead: "先比较五行数量，再看来源和柱位。",
      nextCheck: "继续核对天干、地支和藏干。",
    },
    {
      title: "十神重心",
      level: "support",
      score: 58,
      whyImportant: "十神用于整理学习主题。",
      evidence: "十神统计可作为主题观察入口。",
      howToRead: "先看十神是否透出，再看柱位。",
      nextCheck: "继续核对透藏层次。",
    },
    {
      title: "岁运触发接口",
      level: "watch",
      score: 54,
      whyImportant: "岁运用于后续触发层学习。",
      evidence: "大运流年模块会继续提供触发线索。",
      howToRead: "先回到原局主题，再看岁运是否重复触发。",
      nextCheck: "继续查看大运流年。",
    },
  ];

  for (const fallback of fallbacks) {
    if (ordered.length >= 3) break;
    if (ordered.some((item) => item.title === fallback.title)) continue;
    ordered.push(fallback);
  }

  return ordered
    .slice(0, 5)
    .map((signal, index) => ({
      rank: index + 1,
      title: signal.title,
      level: signal.level,
      whyImportant: signal.whyImportant,
      evidence: signal.evidence,
      howToRead: signal.howToRead,
      nextCheck: signal.nextCheck,
    }));
}

function getElementProfile(counts = {}) {
  const entries = Object.entries(ELEMENT_LABELS).map(([key, label]) => ({
    key,
    label,
    value: Number(counts[key] ?? 0),
  }));
  const sortedHigh = [...entries].sort((left, right) => right.value - left.value);
  const sortedLow = [...entries].sort((left, right) => left.value - right.value);
  const top = sortedHigh[0];
  const second = sortedHigh[1] ?? { value: 0 };
  const low = sortedLow[0];
  const total = entries.reduce((sum, item) => sum + item.value, 0);
  const average = entries.length ? total / entries.length : 0;
  return {
    top,
    low,
    average,
    isHigh: Boolean(top && top.value > 0 && (top.value - second.value >= 1 || top.value >= average * 1.25)),
    isLow: Boolean(low && (low.value <= 0 || low.value <= average * 0.55)),
  };
}

function getTenGodProfile(counts = {}) {
  const entries = Object.entries(counts)
    .map(([name, value]) => ({ name, value: Number(value ?? 0) }))
    .filter((item) => item.value > 0)
    .sort((left, right) => right.value - left.value);
  const top = entries[0];
  const second = entries[1] ?? { value: 0 };
  return {
    top,
    isConcentrated: Boolean(top && (top.value >= 3 || top.value - second.value >= 2)),
  };
}

function countRelations(context) {
  const combinationCount = context.combinations.length;
  const displayCount = context.displayRelations.length;
  const pairCount = context.pairInteractions.reduce((sum, item) => sum + asArray(item.directRelations).length, 0);
  return combinationCount + displayCount + pairCount;
}

function countCandidates(context) {
  return context.patternCandidates.length
    + context.matchedRules.length
    + context.referenceKnowledgeHits.length
    + context.learningRuleHits.length;
}

function normalizeElementCounts(primary, fallback = {}) {
  const source = Object.keys(primary ?? {}).length ? primary : fallback ?? {};
  return Object.keys(ELEMENT_LABELS).reduce((acc, key) => {
    const value = source[key];
    acc[key] = typeof value === "object" && value ? Number(value.value ?? 0) : Number(value ?? 0);
    return acc;
  }, {});
}

function countTenGods(tenGods, fallback = {}) {
  if (Array.isArray(tenGods) && tenGods.length) {
    return tenGods.reduce((acc, signal) => {
      const name = signal.name === "日主" ? "比肩" : signal.name;
      if (!name) return acc;
      acc[name] = (acc[name] ?? 0) + 1;
      return acc;
    }, {});
  }
  return Object.fromEntries(Object.entries(fallback ?? {}).map(([key, value]) => [key, Number(value ?? 0)]));
}

function formatElementSummary(counts = {}) {
  const text = Object.entries(ELEMENT_LABELS)
    .map(([key, label]) => `${label}${formatNumber(counts[key] ?? 0)}`)
    .join("、");
  return text || EMPTY_TEXT;
}

function formatElementFocus(context) {
  const top = strongestElements(context.elements);
  if (!top.length) return "五行重点暂不明显";
  return `${top.map(([key]) => `${ELEMENT_LABELS[key]}气`).join("、")}较明显`;
}

function formatLowElements(counts = {}) {
  const entries = Object.entries(counts).map(([key, value]) => [key, Number(value ?? 0)]);
  if (!entries.length) return "偏少五行暂不明显";
  const min = Math.min(...entries.map(([, value]) => value));
  const lows = entries.filter(([, value]) => value === min).map(([key]) => ELEMENT_LABELS[key]);
  return lows.length ? `${lows.join("、")}相对偏少，适合作为平衡观察点` : "偏少五行暂不明显";
}

function strongestElements(counts = {}) {
  const entries = Object.entries(counts).filter(([, value]) => Number(value ?? 0) > 0);
  if (!entries.length) return [];
  const max = Math.max(...entries.map(([, value]) => Number(value ?? 0)));
  return entries.filter(([, value]) => Number(value ?? 0) === max);
}

function formatTenGodSummary(counts = {}) {
  return Object.entries(counts)
    .filter(([, count]) => Number(count) > 0)
    .sort((left, right) => Number(right[1]) - Number(left[1]))
    .slice(0, 5)
    .map(([name, count]) => `${name}${formatNumber(count)}`)
    .join("、");
}

function summarizeRelations(context) {
  const fromCombinations = context.combinations.map((item) => item.title || [item.effect, asArray(item.members).join("、")].filter(Boolean).join("："));
  const fromDisplay = context.displayRelations.map((item) => formatRelation(item));
  const fromPairs = context.pairInteractions
    .filter((item) => asArray(item.directRelations).length)
    .map((item) => `${item.title}：${asArray(item.directRelations).map((rule) => rule.title).filter(Boolean).join("、")}`);
  return unique([...fromCombinations, ...fromDisplay, ...fromPairs].filter(Boolean)).slice(0, 5).join("；");
}

function formatRelation(relation = {}) {
  const members = asArray(relation.ganzhi ?? relation.members).join("、");
  const pillars = asArray(relation.pillars).join("与");
  return `${relation.type ?? relation.title ?? "关系"}${pillars ? `(${pillars})` : ""}${members ? `：${members}` : ""}`;
}

function summarizeCandidates(context) {
  const patterns = context.patternCandidates.map((item) => item.name ?? item.title).filter(Boolean);
  const rules = context.matchedRules.map((item) => item.title).filter(Boolean);
  const references = context.referenceKnowledgeHits.map((item) => item.title).filter(Boolean);
  const learning = context.learningRuleHits.map((item) => item.title).filter(Boolean);
  return unique([...patterns, ...rules, ...references, ...learning]).slice(0, 6).join("；");
}

function summarizeStrength(strengthSignals = []) {
  return strengthSignals
    .slice(0, 3)
    .map((item) => item.label && item.seasonalStatus ? `${item.label}气在月令为${item.seasonalStatus}` : item.interpretation ?? item.title)
    .filter(Boolean)
    .join("；");
}

function summarizeBasicInterpretations(items = []) {
  return items
    .slice()
    .sort((left, right) => Number(left.displayOrder ?? 0) - Number(right.displayOrder ?? 0))
    .slice(0, 3)
    .map((item) => item.conclusion || item.title)
    .filter(Boolean)
    .join("；");
}

function summarizeTransit(context) {
  const triggers = context.transitTriggers.map((item) => item.title || item.description).filter(Boolean);
  const hits = context.transitHits.map((item) => [item.transit, item.target, item.relation].filter(Boolean).join(" ")).filter(Boolean);
  const judgement = [
    context.judgement?.transit?.majorLuck?.summary,
    context.judgement?.transit?.annual?.summary,
    context.judgement?.transit?.monthly?.summary,
  ].filter(Boolean);
  return unique([...triggers, ...hits, ...judgement]).slice(0, 5).join("；");
}

function formatDayMaster(context) {
  if (!context.day.stem) return "待查";
  return `${context.day.stem}${elementName(context.day.stemElement, context.day.stemElementLabel)}`;
}

function formatMonthBranch(context) {
  if (!context.month.branch) return "待查";
  return `${context.month.branch}${elementName(context.month.branchElement, context.month.branchElementLabel)}`;
}

function elementName(key, label) {
  if (ELEMENT_LABELS[key]) return ELEMENT_LABELS[key];
  const text = String(label ?? "");
  return Object.values(ELEMENT_LABELS).find((item) => text.includes(item)) ?? "待查";
}

function sanitizeReport(value) {
  if (Array.isArray(value)) return value.map(sanitizeReport);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, sanitizeReport(item)]));
  }
  if (typeof value === "string") return value.replace(FORBIDDEN_TEXT, "固定判断").trim();
  return value;
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function unique(items) {
  return [...new Set(items.map((item) => String(item ?? "").trim()).filter(Boolean))];
}

function formatNumber(value) {
  const number = Math.round((Number(value) + Number.EPSILON) * 10) / 10;
  return Number.isInteger(number) ? String(number) : String(number);
}

function trimSentenceEnd(value) {
  return String(value ?? "").replace(/[。；;，,、\s]+$/u, "");
}

  window.BaziCoreReadingReportEngine = { buildCoreReadingReport };
})();
