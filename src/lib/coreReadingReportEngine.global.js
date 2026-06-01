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
    coreTakeaways: buildCoreTakeaways(context, prioritySignals),
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
    contentReading: `这个盘的日主是${formatDayMaster(context)}，月令是${formatMonthBranch(context)}，日主和月令五行同气时，盘面内容会更集中在日主如何承接月令气势这一点上。`,
    themeMeaning: "这类入口容易把主题带到自我标准、边界感、承接力和外部环境之间的关系。",
    limitation: "日主和月令只能说明结构入口，仍要看十神、柱位和岁运。",
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
      contentReading: `这个盘里${elementProfile.top.label}的存在感较强，五行统计显示${elementProfile.top.label}${formatNumber(elementProfile.top.value)}，说明盘面内容会优先围绕${elementProfile.top.label}的来源、集中度和调节方向展开。`,
      themeMeaning: `${elementProfile.top.label}行偏重时，容易让命盘主题集中到${elementTheme(elementProfile.top.key)}等方向。`,
      limitation: "五行强弱不是生活事件，需要看它落在天干、地支、藏干和十神中的位置。",
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
      contentReading: `这个盘的五行统计为${formatElementSummary(context.elements)}，盘面没有只靠一个字形成判断，而是呈现出多种五行共同参与的结构。`,
      themeMeaning: "五行分布会影响表达、资源、规则和行动主题的轻重。",
      limitation: "五行数量需要配合柱位和十神，不宜直接推成事件。",
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
      contentReading: `这个盘里${elementProfile.low.label}相对少，五行统计为${elementProfile.low.label}${formatNumber(elementProfile.low.value)}，因此${elementProfile.low.label}更像调节点，而不是当前盘面最抢眼的内容。`,
      themeMeaning: `${elementProfile.low.label}行偏少时，相关的${elementTheme(elementProfile.low.key)}可以作为补充观察主题。`,
      limitation: "偏少不等于缺失影响，藏干和岁运中仍可能出现相关线索。",
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
      contentReading: `十神统计中${tenGodProfile.top.name}较突出，说明这个盘的主题不只停在五行强弱，还会落到${tenGodMeaning(tenGodProfile.top.name)}这一类内容上。`,
      themeMeaning: `十神重心对应${tenGodMeaning(tenGodProfile.top.name)}，适合用来理解盘面主题的表达方向。`,
      limitation: "十神要看透干、藏干和柱位，不能只用数量决定结论。",
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
      contentReading: `这个盘出现${relationSummary}，说明干支之间存在互动点，盘面内容不是孤立五行，而有字与字之间的牵动。`,
      themeMeaning: "关系层常对应互动方式、边界变化、连接或张力，适合作为结构复盘线索。",
      limitation: "关系要看参与柱位和十神含义，不能把单个关系直接翻成事件。",
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
      contentReading: `规则层面命中${candidateSummary}，说明当前盘面已有可被规则库识别的结构线索，可以作为辅助内容纳入主线。`,
      themeMeaning: "候选结构能帮助整理日主、月令、五行、十神之间的组合关系。",
      limitation: "候选规则只是参考框架，不代表格局已经完整成立。",
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
      contentReading: `岁运层面出现${transitSummary}，说明当前选择的年份和月份会把部分原局主题带到触发层观察。`,
      themeMeaning: "岁运线索用于看原局内容在时间层的重复、加强或转向。",
      limitation: "岁运只说明触发层，需要回到原局主题一起看。",
      nextCheck: "继续查看大运流年模块的触发层。",
    });
  }

  return ensurePriorityRange(signals);
}

function buildTeacherSummary(context, prioritySignals = []) {
  const elementProfile = getElementProfile(context.elements);
  const tenGodProfile = getTenGodProfile(context.tenGodCounts);
  const relations = summarizeRelations(context);
  const candidates = summarizeCandidates(context);
  const transit = summarizeTransit(context);
  const topSignalTitles = prioritySignals.slice(0, 3).map((item) => item.title).join("、");
  return [
    `日主与月令是这个盘的核心入口：日主为${formatDayMaster(context)}，月令为${formatMonthBranch(context)}，前三个读盘重点落在${topSignalTitles || "日主、月令、五行"}。这表示报告先抓盘面最集中的气势，再看它如何进入十神和干支关系。`,
    `五行呈现上，当前五行统计为${formatElementSummary(context.elements)}，其中${elementProfile.top?.label ?? "五行"}较突出，${elementProfile.low?.label ?? "部分五行"}相对偏少。这个盘的内容会自然聚焦在${elementProfile.top ? elementTheme(elementProfile.top.key) : "五行流通"}，同时留意${elementProfile.low ? elementTheme(elementProfile.low.key) : "平衡方向"}如何补入。`,
    `十神呈现上，统计为${formatTenGodSummary(context.tenGodCounts) || "十神资料暂少"}，较突出的是${tenGodProfile.top?.name ?? "待补十神"}。这让主题更容易落到${tenGodProfile.top ? tenGodMeaning(tenGodProfile.top.name) : "资源、表达、规则或行动"}，而不是只停留在五行数量。`,
    `干支关系呈现上，${relations ? `当前出现${relations}` : `当前干支关系未形成强展示项，仍可先看日主${formatDayMaster(context)}、月令${formatMonthBranch(context)}和五行${formatElementSummary(context.elements)}`}。关系层的意义在于看盘中字与字如何牵动，尤其是参与关系的柱位和十神含义。`,
    `规则和候选结构上，${candidates ? `当前命中${candidates}` : `当前规则命中不多，已有盘面信息仍以日主${formatDayMaster(context)}、月令${formatMonthBranch(context)}、五行${formatElementSummary(context.elements)}为主`}。这些规则可以帮助整理盘面内容，但更适合当作结构参考。`,
    `岁运衔接上，${transit ? `当前大运流年线索为${transit}` : `当前岁运触发线索较少，可先保留原局主题`}。也就是说，原局先说明这个盘呈现出的结构，流年和大运再看哪些主题被重复点到。`,
  ];
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

function buildCoreTakeaways(context, prioritySignals = []) {
  const elementProfile = getElementProfile(context.elements);
  const tenGodProfile = getTenGodProfile(context.tenGodCounts);
  const relations = summarizeRelations(context);
  const candidates = summarizeCandidates(context);
  const transit = summarizeTransit(context);
  const takeaways = [
    {
      title: "日主月令同看",
      conclusion: `当前命盘以${formatDayMaster(context)}日主为中心，月令为${formatMonthBranch(context)}，读盘内容先落在日主如何承接出生月份气势。`,
      evidence: `日干为${context.day.stem ?? "待查"}，月支为${context.month.branch ?? "待查"}。`,
      meaning: "这会把盘面主题带向自我承接、季节背景、外部环境和个人表达之间的关系。",
      caution: "日主月令只是原局入口，还要配合十神和柱位。",
    },
    {
      title: `${elementProfile.top?.label ?? "五"}行存在感`,
      conclusion: `${elementProfile.top?.label ?? "五行"}在当前五行统计中较突出，盘面内容会优先呈现${elementProfile.top ? elementTheme(elementProfile.top.key) : "五行分布"}相关主题。`,
      evidence: `五行统计：${formatElementSummary(context.elements)}；${elementProfile.top ? `${elementProfile.top.label}为${formatNumber(elementProfile.top.value)}` : "五行统计已列出"}。`,
      meaning: `这类结构容易让注意力放在${elementProfile.top ? elementTheme(elementProfile.top.key) : "五行流通和结构平衡"}。`,
      caution: "五行数量不是事件判断，还要看来源和十神转换。",
    },
    {
      title: "十神主题浮现",
      conclusion: tenGodProfile.top
        ? `十神中${tenGodProfile.top.name}较突出，盘面内容会带出${tenGodMeaning(tenGodProfile.top.name)}。`
        : "十神统计暂不集中，盘面主题需要从日主、月令和五行继续合看。",
      evidence: `十神统计：${formatTenGodSummary(context.tenGodCounts) || EMPTY_TEXT}`,
      meaning: tenGodProfile.top ? `这会让报告更关注${tenGodMeaning(tenGodProfile.top.name)}在柱位中的呈现。` : "十神不集中时，主题判断更依赖整体结构。",
      caution: "十神要看透出、藏干和柱位，不能只看数量。",
    },
  ];

  if (relations) {
    takeaways.push({
      title: "干支互动可见",
      conclusion: `干支关系中出现${relations}，说明盘内有互动点，适合放入主线理解。`,
      evidence: `关系证据：${relations}`,
      meaning: "这类互动常提示连接、牵动、边界变化或局部张力。",
      caution: "关系层需要回到参与柱位和十神含义。",
    });
  }

  if (candidates) {
    takeaways.push({
      title: "候选结构可参考",
      conclusion: `规则层面命中${candidates}，说明当前盘面已有可被规则库识别的结构内容。`,
      evidence: `规则命中：${candidates}`,
      meaning: "这些规则有助于把日主、月令、五行和十神组织成候选结构。",
      caution: "候选结构不等于完整定格，仍需看条件是否齐全。",
    });
  }

  if (transit) {
    takeaways.push({
      title: "岁运已有触发线索",
      conclusion: `大运流年层面出现${transit}，可以用来观察原局主题在时间层的呈现。`,
      evidence: `岁运证据：${transit}`,
      meaning: "岁运会把原局中的五行、十神或关系主题带到具体阶段。",
      caution: "岁运只看触发，不替代原局结构。",
    });
  }

  if (takeaways.length < 4 && elementProfile.low) {
    takeaways.push({
      title: `${elementProfile.low.label}行调节点`,
      conclusion: `${elementProfile.low.label}在五行统计中相对偏少，盘面内容上更像调节方向。`,
      evidence: `${elementProfile.low.label}统计值为${formatNumber(elementProfile.low.value)}；五行统计：${formatElementSummary(context.elements)}。`,
      meaning: `${elementProfile.low.label}对应的${elementTheme(elementProfile.low.key)}可以作为补充观察点。`,
      caution: "偏少不等于现实缺失，仍要看藏干和岁运是否补入。",
    });
  }

  return takeaways.slice(0, 6);
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
  const relationItems = buildRelationStructureItems(context);
  const sections = [
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
      title: "十神结构",
      currentFocus: formatTenGodFocus(context.tenGodCounts),
      evidence: `十神统计：${formatTenGodSummary(context.tenGodCounts) || EMPTY_TEXT}；十神分组：${formatTenGodGroupSummary(context.tenGodCounts)}。`,
      explanation: "财、官杀、印、食伤、比劫在学习中分别对应资源对象与交换主题、规则压力与责任框架、学习吸收与支持系统、表达输出与技能呈现、同类力量与协作边界。这里用于整理主题入口，不把十神直接断成现实事件。",
      needVerify: "还要看较突出的十神是否透出、落在哪些柱位、藏干层次、旺衰承接，以及是否和干支关系互相呼应。",
    },
    {
      title: "候选格局/规则命中",
      evidence: summarizeCandidates(context) ? `命中规则：${summarizeCandidates(context)}` : EMPTY_TEXT,
      explanation: "候选格局和规则命中只作为学习路径，用来提醒哪些结构值得继续看。",
      needVerify: "还要核对规则来源、资料等级、柱位条件和岁运是否配合。",
    },
  ];
  if (relationItems.length) {
    sections.splice(3, 0, {
      title: "干支关系与原局结构",
      evidence: relationItems.map((item) => item.evidence).join("；"),
      explanation: "只列出当前命盘实际出现的干支关系，用来观察原局内部哪些字有互动。",
      needVerify: "还需要回到参与柱位、旺衰、十神、透藏层次和现实样本继续核对。",
      relationItems,
    });
  }
  return sections;
}

function buildRelationStructureItems(context) {
  const items = [
    ...context.combinations.map(relationFromCombination),
    ...context.displayRelations.map(relationFromDisplay),
    ...context.pairInteractions.flatMap(relationFromPairInteraction),
  ].filter((item) => item.name && item.involvedGanzhi);
  const seen = new Set();
  return items.filter((item) => {
    const key = `${item.name}|${item.involvedGanzhi}|${item.evidence}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function relationFromCombination(item = {}) {
  const name = item.type ?? item.relation ?? relationNameFromTitle(item.title) ?? item.effect ?? "干支关系";
  const involvedGanzhi = formatRelationMembers(item.ganzhi ?? item.members ?? item.pillars);
  const evidence = `natal.combinations 命中${item.title ?? name}${involvedGanzhi ? `，涉及${involvedGanzhi}` : ""}`;
  return {
    name,
    involvedGanzhi,
    evidence,
    plainExplanation: item.note ?? item.description ?? item.interpretation ?? `这组干支在原局中形成${item.effect ?? "互动"}，适合作为结构观察点。`,
    needVerify: "还需要核对参与柱位、五行强弱、十神含义和透藏层次。",
  };
}

function relationNameFromTitle(title) {
  if (!title) return "";
  const parts = String(title).split(/[：:]/).map((item) => item.trim()).filter(Boolean);
  return parts.length > 1 ? parts[parts.length - 1] : title;
}

function relationFromDisplay(item = {}) {
  const name = item.type ?? item.title ?? "干支关系";
  const involvedGanzhi = formatRelationMembers(item.ganzhi ?? item.members);
  const pillars = formatRelationMembers(item.pillars);
  return {
    name,
    involvedGanzhi,
    evidence: `display.relations 命中${name}${pillars ? `，参与柱位为${pillars}` : ""}${involvedGanzhi ? `，涉及${involvedGanzhi}` : ""}`,
    plainExplanation: item.note ?? item.description ?? "这表示原局中有字与字之间的牵动，可作为观察互动方式和结构张力的入口。",
    needVerify: "还需要核对参与柱位、对应十神、原局强弱和是否有其他关系共同参与。",
  };
}

function relationFromPairInteraction(item = {}) {
  return asArray(item.directRelations).map((rule) => {
    const name = rule.title ?? rule.type ?? rule.effect ?? "干支关系";
    const involvedGanzhi = item.title ?? formatRelationMembers(rule.ganzhi ?? rule.members);
    return {
      name,
      involvedGanzhi,
      evidence: `pairInteractions 显示${item.title ?? "柱位互动"}命中${name}`,
      plainExplanation: rule.note ?? item.impact ?? `这组柱位存在${name}，适合观察两个柱位之间的牵动方式。`,
      needVerify: "还需要核对两个柱位各自代表的主题、十神含义、旺衰承接和原局整体配合。",
    };
  });
}

function formatRelationMembers(value) {
  return asArray(value).filter(Boolean).join("、");
}

function formatTenGodFocus(counts = {}) {
  const entries = Object.entries(counts)
    .filter(([, count]) => Number(count) > 0)
    .sort((left, right) => Number(right[1]) - Number(left[1]));
  if (!entries.length) return "当前十神资料暂少，先保留为待观察。";
  const max = Number(entries[0][1]);
  const focused = entries.filter(([, count]) => Number(count) === max).map(([name, count]) => `${name}${formatNumber(count)}`);
  return `${focused.join("、")}较突出，可作为当前十神重点继续观察。`;
}

function formatTenGodGroupSummary(counts = {}) {
  return [
    ["财", ["正财", "偏财"]],
    ["官杀", ["正官", "七杀", "偏官"]],
    ["印", ["正印", "偏印"]],
    ["食伤", ["食神", "伤官"]],
    ["比劫", ["比肩", "劫财"]],
  ].map(([label, names]) => `${label}${formatNumber(tenGodGroupCount(counts, names))}`).join("、");
}

function buildThemeSections(context) {
  const tenGodSummary = formatTenGodSummary(context.tenGodCounts) || EMPTY_TEXT;
  const relations = summarizeRelations(context) || EMPTY_TEXT;
  const evidenceBase = `日主${formatDayMaster(context)}、月令${formatMonthBranch(context)}、五行${formatElementSummary(context.elements)}`;
  const tenGodProfile = getTenGodProfile(context.tenGodCounts);
  const wealthCount = tenGodGroupCount(context.tenGodCounts, ["正财", "偏财"]);
  const resourceCount = tenGodGroupCount(context.tenGodCounts, ["正印", "偏印"]);
  const pressureCount = tenGodGroupCount(context.tenGodCounts, ["正官", "七杀", "偏官"]);
  return [
    {
      title: "性格与表达方式",
      reading: `${formatDayMaster(context)}日主在${formatMonthBranch(context)}月令下，五行统计为${formatElementSummary(context.elements)}，自我表达更适合从日主承接月令、同类力量和食伤线索一起看。`,
      evidence: `依据来自${evidenceBase}。`,
      likelyExpression: "可能表现为更重视标准、边界、表达节奏或做事手感，具体方向取决于十神落点。",
      caution: "性格表达还受现实环境和选择影响，不能单独作为结论。",
    },
    {
      title: "学习资源与支持系统",
      reading: `资源类十神合计为${formatNumber(resourceCount)}，十神统计为${tenGodSummary}，这个主题会落在学习吸收、资质支持、长辈或系统资源如何承接日主。`,
      evidence: `依据来自十神统计和藏干口径：${tenGodSummary}；藏干五行为${formatElementSummary(context.hiddenElements)}。`,
      likelyExpression: "可能表现为重视方法、证据、训练路径或外部支持系统。",
      caution: "资源是否能用上，还要看透干、柱位和现实条件。",
    },
    {
      title: "事业规则与压力结构",
      reading: `规则压力类十神合计为${formatNumber(pressureCount)}，当前十神重心为${tenGodProfile.top?.name ?? "待补"}，事业主题更适合观察责任、规则、要求和资源承接之间的关系。`,
      evidence: `依据来自十神统计：${tenGodSummary}；规则命中：${summarizeCandidates(context) || EMPTY_TEXT}。`,
      likelyExpression: "可能表现为容易把注意力放在标准、流程、资格、责任分配或组织规则上。",
      caution: "事业方向需要结合阶段、行业和大运流年，不直接推出好坏。",
    },
    {
      title: "财务资源与行动方式",
      reading: `财星类十神合计为${formatNumber(wealthCount)}，在这个盘中财务资源主题更适合看资源对象、行动选择和日主能否承接。`,
      evidence: `依据来自十神统计：${tenGodSummary}；五行统计：${formatElementSummary(context.elements)}。`,
      likelyExpression: "可能表现为关注现实资源、客户对象、投入产出或可执行的行动路径。",
      caution: "财务主题不等于收入结论，需要结合岁运和现实选择继续判断。",
    },
    {
      title: "感情合作与关系结构",
      reading: `关系主题会先看日支、财官类十神和干支互动；当前可见${relations}，说明合作与互动更适合从边界、牵动和参与柱位来读。`,
      evidence: `依据来自干支关系与盘面互动：${relations}。`,
      likelyExpression: "可能表现为在合作或关系中重视规则感、互动边界、沟通节奏或双方位置。",
      caution: "感情合作需要结合具体对象、岁运触发和现实互动，不直接下关系结论。",
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
      contentReading: "当前盘面仍可从五行统计读出结构轻重，先看哪一类五行更有存在感。",
      themeMeaning: "五行分布对应盘面气势、表达方式和调节方向。",
      limitation: "五行统计需要配合日主、月令和十神。",
      nextCheck: "继续核对天干、地支和藏干。",
    },
    {
      title: "十神重心",
      level: "support",
      score: 58,
      whyImportant: "十神用于整理学习主题。",
      evidence: "十神统计可作为主题线索。",
      howToRead: "先看十神是否透出，再看柱位。",
      contentReading: "当前盘面可从十神统计观察资源、表达、规则、财星和同类力量的分布。",
      themeMeaning: "十神分布对应具体学习主题的轻重。",
      limitation: "十神需要看透干、藏干和柱位。",
      nextCheck: "继续核对透藏层次。",
    },
    {
      title: "岁运触发接口",
      level: "watch",
      score: 54,
      whyImportant: "岁运用于后续触发层学习。",
      evidence: "大运流年模块会继续提供触发线索。",
      howToRead: "先回到原局主题，再看岁运是否重复触发。",
      contentReading: "大运流年会把原局五行、十神或关系主题带到时间层观察。",
      themeMeaning: "岁运对应阶段性触发和主题重复。",
      limitation: "岁运需要回到原局一起看。",
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
      contentReading: signal.contentReading,
      themeMeaning: signal.themeMeaning,
      limitation: signal.limitation,
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

function tenGodGroupCount(counts = {}, names = []) {
  return names.reduce((sum, name) => sum + Number(counts[name] ?? 0), 0);
}

function elementTheme(key) {
  return {
    wood: "生发、规划、资源开拓和成长弹性",
    fire: "表达、可见度、热度、礼法和推动力",
    earth: "承载、稳定、整合、信任和现实落点",
    metal: "规则、边界、执行、精细化和判断标准",
    water: "流动、学习、沟通、信息和适应能力",
  }[key] ?? "五行主题";
}

function tenGodMeaning(name) {
  if (["正印", "偏印"].includes(name)) return "学习吸收、资质支持、保护系统和方法来源";
  if (["食神", "伤官"].includes(name)) return "表达输出、技能呈现、创造方式和反馈机制";
  if (["正官", "七杀", "偏官"].includes(name)) return "规则压力、责任结构、约束要求和执行标准";
  if (["正财", "偏财"].includes(name)) return "现实资源、经营对象、投入产出和行动选择";
  if (["比肩", "劫财"].includes(name)) return "自我力量、同类关系、边界竞争和协作分工";
  return "十神主题";
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
