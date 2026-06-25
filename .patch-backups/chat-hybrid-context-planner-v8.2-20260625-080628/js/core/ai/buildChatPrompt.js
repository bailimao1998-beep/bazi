const INTERNAL_FIELD_NAMES = [
  "natalHardFacts",
  "luckHardFacts",
  "yearHardFacts",
  "monthHardFacts",
  "requestedYearFacts",
  "monthHardFactsList",
  "chatIntent",
  "dataMode",
  "mechanicalRelations",
  "mechanicalStructureFacts",
];

const BASE_CHAT_RULES = [
  "你是面向不同性别、年龄、原局和岁运组合的八字命理分析助手，不得针对某一个示例命盘套答案。",
  "命理问题只使用系统提供的基础排盘事实、岁运干支、客观时间信息和机械关系；普通问题不强行结合命盘。",
  "系统不提供身强、用神、格局、领域结论、取象故事或现实场景模板，你必须从基础事实独立分析。",
  "分析采用全局通用流程：先核对事实完整度，再看月令与日主，再看根气、透干、生扶克泄，再看原局组合，最后叠加大运、流年、流月。",
  "必须区分四层：确定事实、专业推断、条件性取象、现实建议。不得把推断和故事伪装成排盘事实。",
  "不得篡改系统给出的四柱、十神、藏干、岁运干支、年龄区间、交运时间、节气范围或机械关系。",
  "所有具名干支关系必须来自系统提供的机械关系白名单。系统没有提供寅酉暗合、子酉半合、午酉破等关系时，严禁自行创造或引用。",
  "回答“哪几年、什么时候”时，只能从系统实际扫描并提供的年份中排序，严禁拿未扫描年份作举例或验证。",
  "同一条结构换一种说法不算第二条独立依据。事件汇合必须来自不同层级或不同类型，例如原局承接加流年触发、大运背景加宫位作用、十神作用加明确冲合。",
  "五合只代表五合条件。除非系统明确标注化气成立，否则严禁直接写已经化土、化金、化水、化木、化火。",
  "一个天干同时见多个合神时，只能写多重五合、争合或合意分散，不得写成全部合住。",
  "三合、三会、半合、拱合、三刑和伏吟必须区分条件齐全、成势、成局与化气，不得越级。",
  "旺衰判断必须同时说明月令、根气、透干、生扶克泄和制化。资料不足时用偏旺、偏弱、倾向、初步判断；不得轻易断旺极、从格、假从、专旺。",
  "喜忌取用必须说明服务于什么结构问题，例如制旺、扶弱、调候、通关、制化；不得只因某五行少就说喜，也不得把一次岁运出现直接定为喜用。",
  "正式格局名称如食神制杀、伤官配印、杀印相生、食神生财、财官印相生，只能在所需角色、力量、位置和制化链条基本齐备时使用；否则只能写具有某结构倾向或条件。",
  "男命感情优先结合财星、日支、夫妻结构与当前岁运；女命感情优先结合官杀、日支、夫妻结构与当前岁运。不得机械地把单一财官直接等同具体伴侣。",
  "年龄与人生阶段属于客观约束。儿童、学生、成年、婚育、退休阶段必须使用不同现实场景；未知现实背景时给分支条件，不得把升学、入职、婚育、退休同时并列。",
  "单个十神、单个冲合或单个宫位不能直接推出升职、恋爱、结婚、签约、考试、搬家、疾病等具体事件。",
  "具体事件至少需要两条真正独立的命理依据汇合；流年事件至少含一条流年新增依据，流月事件至少含一条流月新增依据。",
  "同一关系不得扩展成大量互不相干的事件。优先筛选零至三项最可能显像的事情；证据不足时允许明确说没有足够依据锁定具体事件。",
  "交运年份必须按交运前后分段。两步大运的作用不得当成全年同时存在；交运月份或日期来自排盘时属于允许引用的客观时间。",
  "没有流月数据时，不得自行指定预测月份、季节、上半年或下半年；但可以引用数据中明确给出的交运月份、交运日期和大运起止范围。",
  "健康只允许讨论传统体质、压力、作息、安全和就医建议；严禁仅凭命盘预测具体器官、疾病、症状或寿命。",
  "建议必须对应可控行动：信息核验、时间安排、沟通边界、学习准备、风险缓冲、作息与就医。不得给出迷信化保证或高风险财务、法律、医疗指令。",
  "不能假装命盘能确认现实事实，不能使用一定、必然、注定、必定、肯定会等绝对表达。",
];

const DATA_USAGE_RULES = [
  "用户问原局时，只使用基础四柱、十神和藏干完成全局结构分析。",
  "用户问某年时，先判断该年是否交运；若交运则分交运前后，再判断全年共同的流年作用。",
  "用户问多年走势或“哪几年、什么时候”时，逐年比较系统实际提供的年份，不把不同年份的证据混成同一结论。",
  "当用户没有指定年份范围时，系统会提供默认扫描窗口；不得声称没有大运或流年数据，也不得要求用户重复提供已经存在的出生信息。",
  "用户问月份差异时，比较系统提供的目标年份十二流月基础事实。",
  "程序提供的机械关系只证明结构存在，不自动证明现实事件已经发生。",
  "条件组合只能作为条件性线索，不能升级为确定结论。",
  "不得引用系统未发送的页面取象、AI文章、领域排名或现实故事。",
  "若数据存在缺项、交运定位不清或关系冲突，先指出缺口，再降低结论强度。",
];

const USER_FACING_RULES = [
  `严禁在回答中暴露代码字段名、JSON字段名、英文变量名或开发者术语，例如：${INTERNAL_FIELD_NAMES.join("、")}。`,
  "所有来源必须翻译成用户能看懂的中文，例如：原局四柱、当前大运、目标流年、目标流月、明确干支关系。",
  "不要说“数据包显示”或“字段中写着”，直接用自然中文说明命盘依据。",
];

const OUTPUT_FORMAT_RULES = [
  "回答命理问题时，优先按以下Markdown结构输出：",
  "## 直接回答",
  "用1-3句话回答真正的问题；允许回答本阶段没有足够证据锁定具体事件。",
  "## 数据完整度",
  "说明已获得哪些层级、是否处于交运年、是否缺流月或现实背景。",
  "## 确定结构",
  "只列四柱、十神、岁运干支、交运时间和明确机械关系。",
  "## 专业判断",
  "依次说明旺衰依据、取用逻辑、原局承接、岁运新增作用；正式格局若条件不全必须降级为倾向。",
  "## 主要显像",
  "只列零至三项。每项必须包含：可能性等级、依据A、依据B、成立条件、削弱因素。",
  "## 行动建议",
  "给出2-5条与主要显像直接对应、现实可执行且低风险的建议。",
  "## 现实验证",
  "列出2-4条可观察验证点，不把验证问题写成暗示性确认。",
  "## 注意边界",
  "说明哪些不能仅凭命盘确认，健康不作具体医学判断。",
];

const NATAL_CHAT_INTENTS = new Set([
  "relationship",
  "career",
  "wealth",
  "health",
  "chartEvidence",
]);

const TIME_CHAT_INTENTS = new Set([
  "multiYear",
  "yearTrend",
  "monthTrend",
]);

const VALID_CHAT_INTENTS = new Set([
  ...NATAL_CHAT_INTENTS,
  ...TIME_CHAT_INTENTS,
  "free",
]);

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
  natalImageReport,
  luckImageReport,
  yearImageReport,
  monthImageReport,
  monthImageReports,
  chatIntent,
  requestedYears,
  requestedYearReports,
  yearSearchPlan,
  chart,
  baseBaziViewModel,
  currentInput,
} = {}) {
  const normalizedIntent =
    normalizeChatIntent(chatIntent);

  const userPayload = {
    question:
      String(question ?? "").trim(),

    chatIntent:
      normalizedIntent,

    dataMode:
      "hard_facts_only",

    subjectContext:
      compactSubjectContext({
        natalImageReport,
        chart,
        baseBaziViewModel,
        currentInput,
      }),
  };

  const needsNatalEvidence =
    NATAL_CHAT_INTENTS.has(
      normalizedIntent,
    ) ||
    TIME_CHAT_INTENTS.has(
      normalizedIntent,
    );

  if (needsNatalEvidence) {
    userPayload.natalHardFacts =
      compactNatalHardFacts(
        natalImageReport,
      );
  }

  if (normalizedIntent === "multiYear") {
    userPayload.requestedYears =
      normalizeYears(
        requestedYears,
      );

    userPayload.yearSearchPlan =
      compactYearSearchPlan({
        yearSearchPlan,
        requestedYears:
          userPayload.requestedYears,
      });

    userPayload.luckHardFacts =
      compactLuckHardFacts(
        luckImageReport,
      );

    userPayload.requestedYearFacts =
      compactRequestedYearFacts(
        requestedYearReports,
      );
  }

  if (normalizedIntent === "yearTrend") {
    userPayload.requestedYears =
      normalizeYears(
        requestedYears,
      );

    userPayload.luckHardFacts =
      compactLuckHardFacts(
        luckImageReport,
      );

    userPayload.yearHardFacts =
      compactYearHardFacts(
        yearImageReport,
      );

    userPayload.luckTimelineForTargetYear =
      buildLuckTimelineForTargetYear({
        luckReport:
          luckImageReport,
        targetYear:
          userPayload.yearHardFacts
            ?.year ??
          userPayload.requestedYears
            ?.[0],
      });

    userPayload.requestedYearFacts =
      compactRequestedYearFacts(
        requestedYearReports,
      );
  }

  if (normalizedIntent === "monthTrend") {
    userPayload.luckHardFacts =
      compactLuckHardFacts(
        luckImageReport,
      );

    userPayload.yearHardFacts =
      compactYearHardFacts(
        yearImageReport,
      );

    userPayload.luckTimelineForTargetYear =
      buildLuckTimelineForTargetYear({
        luckReport:
          luckImageReport,
        targetYear:
          userPayload.yearHardFacts
            ?.year ??
          userPayload.requestedYears
            ?.[0],
      });

    userPayload.monthHardFacts =
      compactMonthHardFacts(
        monthImageReport,
      );

    userPayload.monthHardFactsList =
      compactMonthFactsList(
        monthImageReports,
      );

    userPayload.luckTimelineForTargetYear =
      buildLuckTimelineForTargetYear({
        luckReport:
          luckImageReport,
        targetYear:
          userPayload.monthHardFacts
            ?.year,
      });
  }

  return {
    system:
      buildChatSystemPrompt(),

    user:
      JSON.stringify(
        deepClean(
          userPayload,
        ),
        null,
        2,
      ),
  };
}

function compactSubjectContext({
  natalImageReport,
  chart,
  baseBaziViewModel,
  currentInput,
} = {}) {
  const birthYear = firstFiniteNumber([
    chart?.input?.year,
    chart?.input?.birthYear,
    baseBaziViewModel?.birthInfo?.year,
    natalImageReport?.featureVector?.meta?.birthYear,
  ]);

  const targetYear = firstFiniteNumber([
    currentInput?.targetYear,
    chart?.input?.targetYear,
    baseBaziViewModel?.birthInfo?.targetYear,
  ]);

  const age = Number.isFinite(birthYear) && Number.isFinite(targetYear)
    ? Math.max(0, targetYear - birthYear)
    : null;

  return deepClean({
    birthYear,
    targetYear,
    selectedMonth: firstFiniteNumber([
      currentInput?.selectedMonth,
      chart?.input?.selectedMonth,
      baseBaziViewModel?.birthInfo?.selectedMonth,
    ]),
    age,
    lifeStage: classifyLifeStage(age),
  });
}

function classifyLifeStage(age) {
  if (!Number.isFinite(age)) return null;
  if (age < 7) return "幼年";
  if (age < 18) return "求学阶段";
  if (age < 25) return "青年过渡阶段";
  if (age < 40) return "成年发展阶段";
  if (age < 60) return "中年阶段";
  return "晚年阶段";
}

function firstFiniteNumber(items) {
  const matched = items.map(Number).find(Number.isFinite);
  return matched ?? null;
}

function buildLuckTimelineForTargetYear({
  luckReport,
  targetYear,
} = {}) {
  const year = Number(targetYear);
  if (!Number.isFinite(year)) return null;

  const cycles = (Array.isArray(luckReport?.luckItems)
    ? luckReport.luckItems
    : [])
    .map(compactLuckItem)
    .filter(Boolean)
    .sort((a, b) => Number(a.index ?? 0) - Number(b.index ?? 0));

  const startsThisYear = cycles.filter(
    (item) => Number(item.selectionYear) === year,
  );

  if (startsThisYear.length > 0) {
    const next = startsThisYear[0];
    const nextIndex = cycles.findIndex(
      (item) => item.index === next.index,
    );
    const previous = nextIndex > 0 ? cycles[nextIndex - 1] : null;

    return deepClean({
      targetYear: year,
      isTransitionYear: true,
      transitionAt: {
        year: next.selectionYear,
        month: next.selectionMonth,
      },
      beforeTransition: previous,
      afterTransition: next,
      instruction: "交运前后必须分段分析，不得把两步大运当成全年同时存在。",
    });
  }

  const active = cycles.find((item) => {
    const range = parseYearRange(item.yearRange);
    return range && year >= range.start && year <= range.end;
  }) ?? cycles.find((item) => item.isCurrent) ?? null;

  return deepClean({
    targetYear: year,
    isTransitionYear: false,
    activeLuck: active,
  });
}

function parseYearRange(value) {
  const matched = String(value ?? "").match(/((?:19|20)\d{2})\D+((?:19|20)\d{2})/);
  if (!matched) return null;
  return {
    start: Math.min(Number(matched[1]), Number(matched[2])),
    end: Math.max(Number(matched[1]), Number(matched[2])),
  };
}

function compactNatalHardFacts(
  natalImageReport,
) {
  const pack =
    natalImageReport
      ?.natalAiEvidencePack ??
    natalImageReport
      ?.natalDebug
      ?.natalAiEvidencePack ??
    null;

  const chart =
    pack?.chartSummary ??
    {};

  const pillars =
    chart?.pillars ??
    {};

  return deepClean({
    gender:
      chart?.gender ??
      null,

    dayMaster:
      chart?.dayMaster ??
      null,

    pillars:
      Object.fromEntries(
        [
          "year",
          "month",
          "day",
          "hour",
        ].map(
          (key) => [
            key,
            compactNatalPillar(
              pillars?.[key],
            ),
          ],
        ),
      ),

    mechanicalRelations:
      buildNatalMechanicalRelations(
        pillars,
      ),
  });
}

function compactNatalPillar(
  pillar,
) {
  if (
    !pillar ||
    typeof pillar !==
      "object"
  ) {
    return null;
  }

  return deepClean({
    label:
      pillar.label ??
      null,

    stem:
      pillar.stem ??
      null,

    branch:
      pillar.branch ??
      null,

    stemTenGod:
      pillar.stemTenGod ??
      null,

    branchMainTenGod:
      pillar.branchMainTenGod ??
      null,

    hiddenStems:
      (
        Array.isArray(
          pillar.hiddenStems,
        )
          ? pillar.hiddenStems
          : []
      ).map(
        (item) =>
          deepClean({
            stem:
              item?.stem ??
              null,

            tenGod:
              item?.tenGod ??
              null,
          }),
      ),
  });
}

function compactLuckHardFacts(
  report,
) {
  const items =
    Array.isArray(
      report?.luckItems,
    )
      ? report.luckItems
      : [];

  return {
    luckCycles:
      items.map(
        compactLuckItem,
      ),
  };
}

function compactLuckItem(
  item,
) {
  if (
    !item ||
    typeof item !==
      "object"
  ) {
    return null;
  }

  return deepClean({
    index:
      item.index ??
      null,

    ageRange:
      item.ageRange ??
      null,

    yearRange:
      item.yearRange ??
      null,

    ganZhi:
      item.ganZhi ??
      null,

    stem:
      item.stem ??
      null,

    branch:
      item.branch ??
      null,

    stemTenGod:
      item.tenGod ??
      item.stemTenGod ??
      null,

    branchMainTenGod:
      item.branchTenGod ??
      item.branchMainTenGod ??
      null,

    isCurrent:
      Boolean(
        item.isCurrent,
      ),

    selectionYear:
      item.selectionYear ??
      null,

    selectionMonth:
      item.selectionMonth ??
      null,

    mechanicalRelations:
      compactRelations(
        item.relationToNatal,
      ),

    mechanicalStructureFacts:
      compactMechanicalStructureFacts(
        item.transitStructure,
      ),
  });
}

function compactYearHardFacts(
  report,
) {
  const item =
    report?.yearItem;

  if (
    !item ||
    typeof item !==
      "object"
  ) {
    return null;
  }

  return deepClean({
    year:
      item.year ??
      null,

    ganZhi:
      item.ganZhi ??
      null,

    stem:
      item.stem ??
      null,

    branch:
      item.branch ??
      null,

    stemTenGod:
      item.stemTenGod ??
      null,

    branchMainTenGod:
      item.branchTenGod ??
      null,

    currentLuck:
      compactLuckReference(
        item.currentLuckItem,
      ),

    relationToNatal:
      compactRelations(
        item.relationToNatal,
      ),

    relationToLuck:
      compactRelations(
        item.relationToLuck,
      ),

    mechanicalStructureFacts:
      compactMechanicalStructureFacts(
        item.transitStructure,
      ),
  });
}

function compactMonthHardFacts(
  report,
) {
  const item =
    report?.monthItem;

  if (
    !item ||
    typeof item !==
      "object"
  ) {
    return null;
  }

  return deepClean({
    year:
      item.year ??
      null,

    month:
      item.month ??
      null,

    flowMonthIndex:
      item.flowMonthIndex ??
      null,

    flowMonthLabel:
      item.flowMonthLabel ??
      null,

    dateRangeLabel:
      item.dateRangeLabel ??
      null,

    startSolarTerm:
      item.startSolarTerm ??
      null,

    endSolarTerm:
      item.endSolarTerm ??
      null,

    ganZhi:
      item.ganZhi ??
      null,

    stem:
      item.stem ??
      null,

    branch:
      item.branch ??
      null,

    stemTenGod:
      item.stemTenGod ??
      null,

    branchMainTenGod:
      item.branchTenGod ??
      null,

    currentLuck:
      compactLuckReference(
        item.currentLuckItem,
      ),

    currentYear:
      compactYearReference(
        item.yearItem,
      ),

    relationToNatal:
      compactRelations(
        item.relationToNatal,
      ),

    relationToLuck:
      compactRelations(
        item.relationToLuck,
      ),

    relationToYear:
      compactRelations(
        item.relationToYear,
      ),

    mechanicalStructureFacts:
      compactMechanicalStructureFacts(
        item.transitStructure,
      ),
  });
}

function compactMonthFactsList(
  reports = [],
) {
  return (
    Array.isArray(
      reports,
    )
      ? reports
      : []
  )
    .map(
      compactMonthHardFacts,
    )
    .filter(Boolean);
}

function compactRequestedYearFacts(
  reports = [],
) {
  return (
    Array.isArray(
      reports,
    )
      ? reports
      : []
  ).map(
    (item) =>
      deepClean({
        year:
          item?.year ??
          null,

        luck:
          compactLuckHardFacts(
            item?.luckImageReport,
          ),

        yearFacts:
          compactYearHardFacts(
            item?.yearImageReport,
          ),
      }),
  );
}

function compactLuckReference(
  item,
) {
  if (
    !item ||
    typeof item !==
      "object"
  ) {
    return null;
  }

  return deepClean({
    index:
      item.index ??
      null,

    ageRange:
      item.ageRange ??
      null,

    yearRange:
      item.yearRange ??
      null,

    ganZhi:
      item.ganZhi ??
      null,

    stem:
      item.stem ??
      null,

    branch:
      item.branch ??
      null,

    stemTenGod:
      item.tenGod ??
      item.stemTenGod ??
      null,

    branchMainTenGod:
      item.branchTenGod ??
      item.branchMainTenGod ??
      null,

    isCurrent:
      Boolean(
        item.isCurrent,
      ),
  });
}

function compactYearReference(
  item,
) {
  if (
    !item ||
    typeof item !==
      "object"
  ) {
    return null;
  }

  return deepClean({
    year:
      item.year ??
      null,

    ganZhi:
      item.ganZhi ??
      null,

    stem:
      item.stem ??
      null,

    branch:
      item.branch ??
      null,

    stemTenGod:
      item.stemTenGod ??
      null,

    branchMainTenGod:
      item.branchTenGod ??
      null,
  });
}

function compactRelations(
  relations,
) {
  return (
    Array.isArray(
      relations,
    )
      ? relations
      : []
  ).map(
    (relation) =>
      deepClean({
        type:
          relation?.type ??
          relation?.label ??
          null,

        currentBranch:
          relation?.currentBranch ??
          relation?.monthBranch ??
          relation?.yearBranch ??
          relation?.luckBranch ??
          null,

        targetBranch:
          relation?.targetBranch ??
          relation?.natalBranch ??
          null,

        natalPillar:
          relation?.natalPillar ??
          null,

        natalBranch:
          relation?.natalBranch ??
          null,

        luckBranch:
          relation?.luckBranch ??
          null,

        yearBranch:
          relation?.yearBranch ??
          null,

        monthBranch:
          relation?.monthBranch ??
          null,
      }),
  );
}

function compactMechanicalStructureFacts(
  structure,
) {
  const facts =
    Array.isArray(
      structure?.facts,
    )
      ? structure.facts
      : [];

  return facts
    .filter(
      (fact) =>
        [
          "direct",
          "combination",
        ].includes(
          String(
            fact?.category ??
            "",
          ),
        ),
    )
    .map(
      (fact) =>
        deepClean({
          id:
            fact?.id ??
            null,

          category:
            fact?.category ??
            null,

          type:
            fact?.type ??
            null,

          label:
            fact?.label ??
            null,

          source:
            fact?.source ??
            null,

          status:
            fact?.status ??
            null,

          participants:
            Array.isArray(
              fact?.participants,
            )
              ? fact.participants
              : [],

          branches:
            extractParticipantBranches(
              fact?.participants,
            ),

          meta:
            compactMechanicalMeta(
              fact?.meta,
            ),
        }),
    );
}

function compactMechanicalMeta(
  meta,
) {
  if (
    !meta ||
    typeof meta !==
      "object"
  ) {
    return null;
  }

  const allowedKeys =
    [
      "controller",
      "controlled",
      "direction",
      "targetElement",
      "transformationStatus",
      "element",
      "subtype",
      "formationStatus",
      "conditionType",
    ];

  return deepClean(
    Object.fromEntries(
      allowedKeys
        .filter(
          (key) =>
            meta[key] !==
            undefined,
        )
        .map(
          (key) => [
            key,
            meta[key],
          ],
        ),
    ),
  );
}


const NATAL_PILLAR_KEYS = [
  "year",
  "month",
  "day",
  "hour",
];

const STEM_ELEMENTS = {
  甲: "木",
  乙: "木",
  丙: "火",
  丁: "火",
  戊: "土",
  己: "土",
  庚: "金",
  辛: "金",
  壬: "水",
  癸: "水",
};

const GENERATING_ELEMENT = {
  木: "火",
  火: "土",
  土: "金",
  金: "水",
  水: "木",
};

const CONTROLLING_ELEMENT = {
  木: "土",
  土: "水",
  水: "火",
  火: "金",
  金: "木",
};

const STEM_COMBINATIONS = [
  ["甲", "己", "土"],
  ["乙", "庚", "金"],
  ["丙", "辛", "水"],
  ["丁", "壬", "木"],
  ["戊", "癸", "火"],
];

const BRANCH_PAIR_RELATIONS = [
  ["冲", ["子", "午"]],
  ["冲", ["丑", "未"]],
  ["冲", ["寅", "申"]],
  ["冲", ["卯", "酉"]],
  ["冲", ["辰", "戌"]],
  ["冲", ["巳", "亥"]],
  ["六合", ["子", "丑"]],
  ["六合", ["寅", "亥"]],
  ["六合", ["卯", "戌"]],
  ["六合", ["辰", "酉"]],
  ["六合", ["巳", "申"]],
  ["六合", ["午", "未"]],
  ["害", ["子", "未"]],
  ["害", ["丑", "午"]],
  ["害", ["寅", "巳"]],
  ["害", ["卯", "辰"]],
  ["害", ["申", "亥"]],
  ["害", ["酉", "戌"]],
  ["破", ["子", "酉"]],
  ["破", ["卯", "午"]],
  ["破", ["辰", "丑"]],
  ["破", ["戌", "未"]],
  ["破", ["寅", "亥"]],
  ["破", ["巳", "申"]],
  ["刑", ["寅", "巳"]],
  ["刑", ["巳", "申"]],
  ["刑", ["申", "寅"]],
  ["刑", ["丑", "戌"]],
  ["刑", ["戌", "未"]],
  ["刑", ["未", "丑"]],
  ["刑", ["子", "卯"]],
  ["刑", ["卯", "子"]],
];

const SELF_PUNISHMENT_BRANCHES =
  new Set([
    "辰",
    "午",
    "酉",
    "亥",
  ]);

const HALF_HARMONY_PAIRS = [
  ["申", "子", "水", "生地半合"],
  ["子", "辰", "水", "墓地半合"],
  ["亥", "卯", "木", "生地半合"],
  ["卯", "未", "木", "墓地半合"],
  ["寅", "午", "火", "生地半合"],
  ["午", "戌", "火", "墓地半合"],
  ["巳", "酉", "金", "生地半合"],
  ["酉", "丑", "金", "墓地半合"],
];

const ARCH_HARMONY_PAIRS = [
  ["申", "辰", "水"],
  ["亥", "未", "木"],
  ["寅", "戌", "火"],
  ["巳", "丑", "金"],
];

const TRIPLE_HARMONY_GROUPS = [
  ["申", "子", "辰", "水"],
  ["亥", "卯", "未", "木"],
  ["寅", "午", "戌", "火"],
  ["巳", "酉", "丑", "金"],
];

const TRIPLE_MEETING_GROUPS = [
  ["寅", "卯", "辰", "木"],
  ["巳", "午", "未", "火"],
  ["申", "酉", "戌", "金"],
  ["亥", "子", "丑", "水"],
];

function compactYearSearchPlan({
  yearSearchPlan,
  requestedYears,
} = {}) {
  const years =
    normalizeYears(
      requestedYears,
    );

  return deepClean({
    mode:
      yearSearchPlan?.mode ??
      (
        years.length >
          0
          ? "explicit_or_default_scan"
          : "none"
      ),

    startYear:
      years[0] ??
      null,

    endYear:
      years.at(
        -1,
      ) ??
      null,

    count:
      years.length,

    reason:
      yearSearchPlan?.reason ??
      null,
  });
}

function buildNatalMechanicalRelations(
  pillars,
) {
  const rows =
    NATAL_PILLAR_KEYS
      .map(
        (key) => ({
          key,
          label:
            pillars?.[key]
              ?.label ??
            key,
          stem:
            pillars?.[key]
              ?.stem ??
            "",
          branch:
            pillars?.[key]
              ?.branch ??
            "",
        }),
      )
      .filter(
        (item) =>
          item.stem ||
          item.branch,
      );

  const facts = [];

  for (
    let leftIndex =
      0;
    leftIndex <
      rows.length;
    leftIndex +=
      1
  ) {
    for (
      let rightIndex =
        leftIndex +
        1;
      rightIndex <
        rows.length;
      rightIndex +=
        1
    ) {
      const left =
        rows[leftIndex];

      const right =
        rows[rightIndex];

      facts.push(
        ...buildStemPairFacts(
          left,
          right,
        ),
        ...buildBranchPairFacts(
          left,
          right,
        ),
      );
    }
  }

  facts.push(
    ...buildNatalCombinationConditions(
      rows,
    ),
  );

  return uniqueObjects(
    facts,
  );
}

function buildStemPairFacts(
  left,
  right,
) {
  if (
    !left.stem ||
    !right.stem
  ) {
    return [];
  }

  const facts = [];

  if (
    left.stem ===
    right.stem
  ) {
    facts.push({
      layer:
        "natal",
      type:
        "stem_repeat",
      relation:
        "天干同现",
      stems: [
        left.stem,
        right.stem,
      ],
      participants: [
        left.key,
        right.key,
      ],
      status:
        "direct",
    });
  }

  const combination =
    STEM_COMBINATIONS.find(
      (
        [
          first,
          second,
        ],
      ) =>
        samePair(
          [
            first,
            second,
          ],
          [
            left.stem,
            right.stem,
          ],
        ),
    );

  if (
    combination
  ) {
    facts.push({
      layer:
        "natal",
      type:
        "stem_combination",
      relation:
        "天干五合",
      stems: [
        left.stem,
        right.stem,
      ],
      participants: [
        left.key,
        right.key,
      ],
      status:
        "condition_only",
      targetElement:
        combination[2],
      transformationStatus:
        "unresolved",
    });
  }

  const leftElement =
    STEM_ELEMENTS[
      left.stem
    ];

  const rightElement =
    STEM_ELEMENTS[
      right.stem
    ];

  if (
    leftElement &&
    rightElement
  ) {
    if (
      GENERATING_ELEMENT[
        leftElement
      ] ===
      rightElement
    ) {
      facts.push({
        layer:
          "natal",
        type:
          "stem_generation",
        relation:
          "天干相生",
        controller:
          left.stem,
        recipient:
          right.stem,
        stems: [
          left.stem,
          right.stem,
        ],
        participants: [
          left.key,
          right.key,
        ],
        status:
          "direct",
      });
    } else if (
      GENERATING_ELEMENT[
        rightElement
      ] ===
      leftElement
    ) {
      facts.push({
        layer:
          "natal",
        type:
          "stem_generation",
        relation:
          "天干相生",
        controller:
          right.stem,
        recipient:
          left.stem,
        stems: [
          left.stem,
          right.stem,
        ],
        participants: [
          left.key,
          right.key,
        ],
        status:
          "direct",
      });
    }

    if (
      CONTROLLING_ELEMENT[
        leftElement
      ] ===
      rightElement
    ) {
      facts.push({
        layer:
          "natal",
        type:
          "stem_control",
        relation:
          "天干相克",
        controller:
          left.stem,
        controlled:
          right.stem,
        stems: [
          left.stem,
          right.stem,
        ],
        participants: [
          left.key,
          right.key,
        ],
        status:
          "direct",
      });
    } else if (
      CONTROLLING_ELEMENT[
        rightElement
      ] ===
      leftElement
    ) {
      facts.push({
        layer:
          "natal",
        type:
          "stem_control",
        relation:
          "天干相克",
        controller:
          right.stem,
        controlled:
          left.stem,
        stems: [
          left.stem,
          right.stem,
        ],
        participants: [
          left.key,
          right.key,
        ],
        status:
          "direct",
      });
    }
  }

  return facts;
}

function buildBranchPairFacts(
  left,
  right,
) {
  if (
    !left.branch ||
    !right.branch
  ) {
    return [];
  }

  const facts = [];

  if (
    left.branch ===
    right.branch
  ) {
    facts.push({
      layer:
        "natal",
      type:
        "branch_repeat",
      relation:
        "地支同现",
      branches: [
        left.branch,
        right.branch,
      ],
      participants: [
        left.key,
        right.key,
      ],
      status:
        "direct",
    });

    if (
      SELF_PUNISHMENT_BRANCHES
        .has(
          left.branch,
        )
    ) {
      facts.push({
        layer:
          "natal",
        type:
          "self_punishment",
        relation:
          "自刑",
        branches: [
          left.branch,
          right.branch,
        ],
        participants: [
          left.key,
          right.key,
        ],
        status:
          "direct",
      });
    }
  }

  BRANCH_PAIR_RELATIONS
    .filter(
      (
        [
          ,
          pair,
        ],
      ) =>
        samePair(
          pair,
          [
            left.branch,
            right.branch,
          ],
        ),
    )
    .forEach(
      (
        [
          relation,
        ],
      ) => {
        facts.push({
          layer:
            "natal",
          type:
            `branch_${relation}`,
          relation,
          branches: [
            left.branch,
            right.branch,
          ],
          participants: [
            left.key,
            right.key,
          ],
          status:
            "direct",
        });
      },
    );

  return facts;
}

function buildNatalCombinationConditions(
  rows,
) {
  const branchSet =
    new Set(
      rows
        .map(
          (item) =>
            item.branch,
        )
        .filter(Boolean),
    );

  const facts = [];

  TRIPLE_HARMONY_GROUPS
    .forEach(
      (
        [
          first,
          second,
          third,
          element,
        ],
      ) => {
        const members = [
          first,
          second,
          third,
        ];

        const present =
          members.filter(
            (branch) =>
              branchSet.has(
                branch,
              ),
          );

        if (
          present.length ===
          3
        ) {
          facts.push({
            layer:
              "natal",
            type:
              "triple_harmony",
            relation:
              "三合局条件",
            branches:
              members,
            element,
            status:
              "condition_only",
            formationStatus:
              "unresolved",
          });
        } else if (
          present.length ===
          2
        ) {
          const half =
            HALF_HARMONY_PAIRS
              .find(
                (item) =>
                  samePair(
                    item.slice(
                      0,
                      2,
                    ),
                    present,
                  ),
              );

          const arch =
            ARCH_HARMONY_PAIRS
              .find(
                (item) =>
                  samePair(
                    item.slice(
                      0,
                      2,
                    ),
                    present,
                  ),
              );

          if (
            half
          ) {
            facts.push({
              layer:
                "natal",
              type:
                "half_harmony",
              relation:
                "半合条件",
              branches:
                present,
              element:
                half[2],
              subtype:
                half[3],
              status:
                "condition_only",
              formationStatus:
                "unresolved",
            });
          } else if (
            arch
          ) {
            facts.push({
              layer:
                "natal",
              type:
                "arch_harmony",
              relation:
                "拱合条件",
              branches:
                present,
              element:
                arch[2],
              status:
                "condition_only",
              formationStatus:
                "unresolved",
            });
          }
        }
      },
    );

  TRIPLE_MEETING_GROUPS
    .forEach(
      (
        [
          first,
          second,
          third,
          element,
        ],
      ) => {
        const members = [
          first,
          second,
          third,
        ];

        if (
          members.every(
            (branch) =>
              branchSet.has(
                branch,
              ),
          )
        ) {
          facts.push({
            layer:
              "natal",
            type:
              "triple_meeting",
            relation:
              "三会局条件",
            branches:
              members,
            element,
            status:
              "condition_only",
            formationStatus:
              "unresolved",
          });
        }
      },
    );

  return facts;
}

function extractParticipantBranches(
  participants,
) {
  const branches =
    new Set();

  (
    Array.isArray(
      participants,
    )
      ? participants
      : []
  ).forEach(
    (participant) => {
      const matched =
        String(
          participant ??
          "",
        ).match(
          /[子丑寅卯辰巳午未申酉戌亥]/g,
        );

      if (
        matched?.length
      ) {
        branches.add(
          matched.at(
            -1,
          ),
        );
      }
    },
  );

  return [
    ...branches,
  ];
}

function samePair(
  left,
  right,
) {
  return (
    [
      ...left,
    ].sort()
      .join(
        "",
      ) ===
    [
      ...right,
    ].sort()
      .join(
        "",
      )
  );
}

function uniqueObjects(
  items,
) {
  const seen =
    new Set();

  return items.filter(
    (item) => {
      const key =
        JSON.stringify(
          item,
        );

      if (
        seen.has(
          key,
        )
      ) {
        return false;
      }

      seen.add(
        key,
      );

      return true;
    },
  );
}

function normalizeChatIntent(
  value,
) {
  const normalized =
    String(
      value ??
      "",
    ).trim();

  return VALID_CHAT_INTENTS.has(
    normalized,
  )
    ? normalized
    : "free";
}

function normalizeYears(
  items,
) {
  return [
    ...new Set(
      (
        Array.isArray(
          items,
        )
          ? items
          : []
      )
        .map(Number)
        .filter(
          (year) =>
            Number.isFinite(
              year,
            ) &&
            year >=
              1900 &&
            year <=
              2100,
        ),
    ),
  ].sort(
    (
      left,
      right,
    ) =>
      left -
      right,
  );
}

function deepClean(
  value,
) {
  if (
    Array.isArray(
      value,
    )
  ) {
    return value
      .map(
        deepClean,
      )
      .filter(
        (item) =>
          item !==
            undefined &&
          item !==
            null,
      );
  }

  if (
    value &&
    typeof value ===
      "object"
  ) {
    return Object.fromEntries(
      Object.entries(
        value,
      )
        .filter(
          (
            [
              ,
              child,
            ],
          ) =>
            child !==
              undefined &&
            child !==
              null,
        )
        .map(
          (
            [
              key,
              child,
            ],
          ) => [
            key,
            deepClean(
              child,
            ),
          ],
        ),
    );
  }

  return value;
}
