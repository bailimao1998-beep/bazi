const INTERNAL_FIELD_NAMES = [
  "natalHardFacts",
  "natalAuxiliaryFacts",
  "luckHardFacts",
  "yearHardFacts",
  "monthHardFacts",
  "requestedYearFacts",
  "monthHardFactsList",
  "contextPlan",
  "selectedImagery",
  "imageryRulePack",
  "methodologyRules",
  "matchedRules",
  "sourceRefs",
  "ruleId",
  "ruleConstraint",
  "ruleAudit",
  "chatHistory",
  "chatIntent",
  "dataMode",
  "mechanicalRelations",
  "mechanicalStructureFacts",
];

const BASE_CHAT_RULES = [
  "你是面向不同性别、年龄、原局和岁运组合的八字命理分析助手，不得针对某一个示例命盘套答案。",
  "系统会同时提供三类材料：确定性基础事实、辅助结构信息、本地规则引擎筛选的候选取象。",
  "确定性基础事实优先级最高；辅助结构信息用于帮助判断但不是最终结论；候选取象只作参考，必须复核后才能使用。",
  "前端上下文规划器只负责选择时间层、领域和候选取象，不代表最终判断。你可以对本次匹配规则和候选取象做合并、降级、否定、排序和现实化表达。",
  "系统还会提供取象总纲和按问题召回的书本取象规则。匹配规则优先用于专业取象；规则覆盖不足时，可结合硬事实和总纲作保守补充推断。",
  "不得自行创造系统未提供的具名干支关系、正式格局、特殊口诀或确定事件；也不要主动混入无关门派规则。",
  "主象和重要判断应优先由匹配规则与硬事实共同支持；规则库暂未覆盖的部分只能作低强度补充推断，并明确条件与边界。",
  "若本次没有匹配到足够规则，不要硬套口诀；可以从硬事实出发作简洁、保守的解释，也可以指出规则库暂未覆盖。",
  "使用书本规则时必须逐条核对触发依据、成立条件、削弱因素和禁止越级结论；不能因为规则被召回就强行使用。",
  "多条规则冲突时，硬事实优先，其次看直接作用、当前时间层、条件完整度、规则等级和多源支持。",
  "必须先取象再展开：先形成主象、辅象、矛盾象、条件象与反证象，再映射到现实领域、时间节奏和建议。",
  "分析采用全局通用流程：核对事实完整度 → 月令与日主 → 根气、透干、生扶克泄 → 原局组合与制化 → 大运背景 → 流年新增作用 → 必要时流月触发。",
  "不得篡改系统给出的四柱、十神、藏干、岁运干支、年龄区间、交运时间、节气范围或机械关系。",
  "天干五行生克方向属于硬事实，必须按木克土、土克水、水克火、火克金、金克木判断；不确定时只写双方存在作用，不得写反。",
  "所有具名干支关系必须来自系统提供的机械关系白名单；本地候选取象中若出现与硬事实冲突的关系，必须舍弃。",
  "回答哪几年、什么时候时，只能从系统实际扫描并提供的年份中排序，严禁拿未扫描年份作举例或验证。",
  "同一条结构换一种说法不算第二条独立依据。事件汇合必须来自不同层级或不同类型。",
  "五合只代表五合条件。除非系统明确标注化气成立，否则严禁直接写已经化土、化金、化水、化木、化火。",
  "一个天干同时见多个合神时，只能写多重五合、争合或合意分散，不得写成全部合住。",
  "三合、三会、半合、拱合、三刑和伏吟必须区分条件齐全、成势、成局与化气，不得越级。",
  "旺衰判断必须同时说明月令、根气、透干、生扶克泄和制化；资料不足时使用偏旺、偏弱、明显偏强、倾向、初步判断，避免仅凭评分写身极强、旺至极。",
  "喜忌取用必须说明服务于什么结构问题，例如制旺、扶弱、调候、通关、制化；不得只因某五行少就说喜。没有完整取用链条时，优先写某五行具有疏泄、制衡或承接价值，不直接写某星就是用神。",
  "正式格局名称只能在所需角色、力量、位置和制化链条基本齐备时使用；否则写成结构倾向或条件。",
  "男命感情优先结合财星、日支、夫妻结构与当前岁运；女命感情优先结合官杀、日支、夫妻结构与当前岁运。",
  "十神与干支作用先描述主题，再映射现实。七杀、正官、财星等不能仅凭一个信号直接拟人化成某类对象；害、破、冲、刑也不要一次扩展成家庭、距离、子女、金钱等多个具体场景。",
  "年龄与人生阶段属于客观约束。未知现实背景时给分支条件，不得把升学、入职、婚育、退休同时并列。",
  "单个十神、单个冲合或单个宫位不能直接推出升职、恋爱、结婚、签约、考试、搬家、疾病等具体事件。",
  "具体事件至少需要两条真正独立的命理依据汇合；流年事件至少含一条流年新增依据，流月事件至少含一条流月新增依据。",
  "优先筛选最值得观察的主线。窄问题列零至三项主要显像；全面问题可以展开多个领域，但每个领域仍需有证据和边界。",
  "交运年份必须按交运前后分段。两步大运的作用不得当成全年同时存在。",
  "交运年的全年主次按实际覆盖时间判断：交运前覆盖更久，就以旧运加流年为全年主背景；交运后覆盖更久，才以新运为主。若在10月以后交运，新运只作年末转折与后续趋势，不得主导全年总判断。",
  "没有流月数据时，不得自行指定预测月份、季节、上半年或下半年；流月数据只在问题明确涉及月份时使用。",
  "健康只允许讨论传统体质、压力、作息、安全和就医建议；严禁仅凭命盘预测具体器官、疾病、症状或寿命。",
  "建议必须对应前文判断并且现实可执行，优先给信息核验、时间安排、沟通边界、学习准备、风险缓冲、作息与就医建议。",
  "不能假装命盘能确认现实事实，不能使用一定、必然、注定、必定、肯定会等绝对表达。",
  "优先做到说得通、依据清楚和主次分明，不要为了形式完整而堆叠规则、栏目或过度保守的免责声明。",
];

const DATA_USAGE_RULES = [
  "原局基础事实、辅助信息、完整大运基础时间轴和取象方法总纲属于常驻上下文；用户问任何未预设领域时，也可以基于这些材料独立取象。",
  "matchedRules是本次优先使用的专业规则集合；先验证再使用，条件不足的规则要降级或舍弃。",
  "methodologyRules主要约束分析步骤；与明确硬事实共同使用时，可以支持保守的结构性解释，但不能单独推出具体事件。",
  "用户问原局、性格、家庭、职业、关系或其他无具体时间的问题时，不要擅自加入流年流月。",
  "用户问当前阶段时，结合原局与当前大运；用户问某年时，结合该年对应大运与流年基础事实。",
  "用户问多年走势或哪几年、什么时候时，逐年比较系统实际提供的年份，不把不同年份证据混成同一结论。",
  "用户明确问月份、哪月或逐月时，才使用系统提供的流月基础事实和流月候选取象。",
  "候选取象的作用是帮助发现可能主线，不是替代推理。每条候选取象都要检查硬事实、成立条件、削弱因素和现实阶段。",
  "当候选取象与硬事实冲突、证据重复或置信度过低时，应主动舍弃而不是勉强写入答案。",
  "程序提供的机械关系只证明结构存在，不自动证明现实事件已经发生。",
  "若数据存在缺项、交运定位不清或关系冲突，先指出缺口，再降低结论强度。",
  "普通常识问题可以忽略命盘上下文，直接作为一般AI助手回答。",
];

const USER_FACING_RULES = [
  `严禁在回答中暴露代码字段名、JSON字段名、英文变量名或开发者术语，例如：${INTERNAL_FIELD_NAMES.join("、")}。`,
  "所有来源必须翻译成用户能看懂的中文，例如：原局四柱、当前大运、目标流年、目标流月、明确干支关系。",
  "不要说“数据包显示”或“字段中写着”，直接用自然中文说明命盘依据。",
];

const OUTPUT_FORMAT_RULES = [
  "回答命理问题时，优先按以下Markdown结构输出：",
  "## 直接回答",
  "先用1-3句话回答用户真正的问题，先给结论再展开。",
  "## 核心取象",
  "明确写出主象、辅象、矛盾象、条件象和主要反证；没有足够证据的类别可以省略。",
  "## 命理依据",
  "分清硬事实、辅助结构信息和经过复核的本地候选取象，不暴露内部字段名。",
  "## 展开分析",
  "按原局承接、大运背景、流年触发、必要时流月触发展开，解释为什么会形成这些象。",
  "## 可能表现",
  "窄问题列零至三项；全面问题按相关领域展开。每项说明可能性、至少两条独立依据、成立条件和削弱因素。",
  "## 时间节奏",
  "只有收到对应大运、流年或流月数据时才写；交运年必须分段。",
  "## 行动建议",
  "给出与判断直接对应、现实可执行、低风险的建议，不写空泛鸡汤。",
  "## 现实验证",
  "列出2-5条用户可以现实中观察的验证点。",
  "## 注意边界",
  "说明哪些不能仅凭命盘确认，健康不作具体医学判断。",
  "若上下文规划显示回答深度为concise，或用户明确说直接回答、只说结论、简单说，则只保留## 直接回答、## 核心取象、## 行动建议、## 注意边界四节，不强行填满所有栏目。",
  "若回答深度为standard，覆盖关键依据和主要表现即可；只有deep才完整展开多个领域、时间节奏和现实验证。",
  "正文不得展示英文规则ID、内部字段名或程序校验信息。规则追踪保留在程序调试数据中，不要求用户看到。",
];

const NATAL_CHAT_INTENTS = new Set([
  "natalOverview",
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
  contextPlan,
  selectedImagery,
  imageryRulePack,
  chatHistory,
  chart,
  baseBaziViewModel,
  currentInput,
} = {}) {
  const normalizedIntent =
    normalizeChatIntent(chatIntent);

  const resolvedTimeScope =
    String(
      contextPlan
        ?.timeScope ??
      "",
    ) ||
    (
      normalizedIntent ===
        "multiYear"
        ? "multiYear"
        : normalizedIntent ===
            "yearTrend"
          ? "singleYear"
          : normalizedIntent ===
              "monthTrend"
            ? "month"
            : "natal"
    );

  const userPayload = {
    question:
      String(question ?? "").trim(),

    chatIntent:
      normalizedIntent,

    dataMode:
      "hybrid_facts_plus_selected_imagery_plus_rule_kb",

    reasoningMode:
      "rule_guided_balanced",

    contextPlan:
      compactContextPlan(
        contextPlan,
      ),

    subjectContext:
      compactSubjectContext({
        natalImageReport,
        chart,
        baseBaziViewModel,
        currentInput,
        chatIntent:
          normalizedIntent,

        contextTimeScope:
          resolvedTimeScope,
      }),

    natalHardFacts:
      compactNatalHardFacts(
        natalImageReport,
      ),

    natalAuxiliaryFacts:
      compactNatalAuxiliaryFacts(
        natalImageReport,
      ),

    luckHardFacts:
      compactLuckHardFacts(
        luckImageReport,
      ),

    selectedImagery:
      compactSelectedImagery(
        selectedImagery,
      ),

    imageryRulePack:
      compactImageryRulePack(
        imageryRulePack,
      ),

    chatHistory:
      compactChatHistory({
        messages:
          chatHistory,
        limit:
          contextPlan
            ?.limits
            ?.chatTurns ??
          4,
      }),
  };

  if (resolvedTimeScope === "multiYear") {
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

  if (resolvedTimeScope === "singleYear") {
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

  if (resolvedTimeScope === "month") {
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


function compactContextPlan(
  plan,
) {
  if (
    !plan ||
    typeof plan !==
      "object"
  ) {
    return null;
  }

  return deepClean({
    version:
      plan.version,

    isBaziQuestion:
      Boolean(
        plan.isBaziQuestion,
      ),

    timeScope:
      plan.timeScope,

    answerDepth:
      plan.answerDepth,

    domainKeys:
      Array.isArray(
        plan.domainKeys,
      )
        ? plan.domainKeys
        : [],

    requestedYears:
      normalizeYears(
        plan.requestedYears,
      ),

    targetYear:
      plan.targetYear,

    selectedMonth:
      plan.selectedMonth,

    yearSearchMode:
      plan.yearSearchMode,

    monthMode:
      plan.monthMode,

    include:
      plan.include,

    availability:
      plan.availability,

    plannerInstruction:
      plan.plannerInstruction,
  });
}

function compactNatalAuxiliaryFacts(
  natalImageReport,
) {
  const pack =
    natalImageReport
      ?.natalAiEvidencePack ??
    natalImageReport
      ?.natalDebug
      ?.natalAiEvidencePack ??
    null;

  if (
    !pack
  ) {
    return null;
  }

  return deepClean({
    source:
      "local_structure_engine",

    role:
      "auxiliary_reference_not_final",

    dayMasterSummary:
      compactAuxiliaryValue(
        pack.dayMasterSummary,
        0,
      ),

    natalBaseline:
      compactAuxiliaryValue(
        pack.natalBaseline,
        0,
      ),

    warnings:
      (
        Array.isArray(
          pack.warnings,
        )
          ? pack.warnings
          : []
      ).slice(
        0,
        8,
      ),

    instruction:
      "辅助信息用于提高判断效率，但旺衰、格局、喜忌和现实取象仍需AI结合硬事实重新复核。",
  });
}

function compactSelectedImagery(
  value,
) {
  if (
    !value ||
    typeof value !==
      "object"
  ) {
    return null;
  }

  return compactAuxiliaryValue(
    value,
    0,
    {
      maxDepth:
        5,

      maxArray:
        20,

      maxString:
        600,
    },
  );
}

function compactImageryRulePack(
  value,
) {
  if (
    !value ||
    typeof value !==
      "object"
  ) {
    return null;
  }

  return compactAuxiliaryValue(
    value,
    0,
    {
      maxDepth:
        7,

      maxArray:
        32,

      maxString:
        800,
    },
  );
}

function compactChatHistory({
  messages,
  limit,
} = {}) {
  const safeLimit =
    Math.max(
      0,
      Math.min(
        8,
        Number(
          limit,
        ) ||
          0,
      ),
    );

  return (
    Array.isArray(
      messages,
    )
      ? messages
      : []
  )
    .slice(
      -safeLimit,
    )
    .map(
      (item) =>
        deepClean({
          question:
            String(
              item?.question ??
              "",
            ).slice(
              0,
              500,
            ),

          answer:
            String(
              item?.answer ??
              "",
            ).slice(
              0,
              1600,
            ),
        }),
    )
    .filter(
      (item) =>
        item.question ||
        item.answer,
    );
}

function compactAuxiliaryValue(
  value,
  depth,
  options = {},
) {
  const maxDepth =
    Number(
      options.maxDepth,
    ) ||
    4;

  const maxArray =
    Number(
      options.maxArray,
    ) ||
    16;

  const maxString =
    Number(
      options.maxString,
    ) ||
    420;

  if (
    value ===
      null ||
    value ===
      undefined
  ) {
    return null;
  }

  if (
    typeof value ===
      "string"
  ) {
    return value.slice(
      0,
      maxString,
    );
  }

  if (
    typeof value ===
      "number" ||
    typeof value ===
      "boolean"
  ) {
    return value;
  }

  if (
    depth >=
      maxDepth
  ) {
    return null;
  }

  if (
    Array.isArray(
      value,
    )
  ) {
    return value
      .slice(
        0,
        maxArray,
      )
      .map(
        (item) =>
          compactAuxiliaryValue(
            item,
            depth +
              1,
            options,
          ),
      )
      .filter(
        (item) =>
          item !==
            null &&
          item !==
            undefined,
      );
  }

  if (
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
              key,
            ],
          ) =>
            ![
              "masterSummary",
              "narrative",
              "story",
              "article",
              "html",
              "debug",
              "raw",
            ].includes(
              key,
            ),
        )
        .slice(
          0,
          40,
        )
        .map(
          (
            [
              key,
              child,
            ],
          ) => [
            key,
            compactAuxiliaryValue(
              child,
              depth +
                1,
              options,
            ),
          ],
        )
        .filter(
          (
            [
              ,
              child,
            ],
          ) =>
            child !==
              null &&
            child !==
              undefined,
        ),
    );
  }

  return null;
}

function compactSubjectContext({
  natalImageReport,
  chart,
  baseBaziViewModel,
  currentInput,
  chatIntent,
  contextTimeScope,
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

  const isTimeIntent =
    TIME_CHAT_INTENTS.has(
      String(
        chatIntent ??
        "",
      ),
    ) ||
    [
      "singleYear",
      "multiYear",
      "month",
    ].includes(
      String(
        contextTimeScope ??
        "",
      ),
    );

  return deepClean({
    birthYear,

    referenceAge:
      age,

    lifeStage:
      classifyLifeStage(
        age,
      ),

    ...(isTimeIntent
      ? {
          targetYear,

          selectedMonth:
            firstFiniteNumber([
              currentInput
                ?.selectedMonth,
              chart
                ?.input
                ?.selectedMonth,
              baseBaziViewModel
                ?.birthInfo
                ?.selectedMonth,
            ]),
        }
      : {}),
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

    const transitionMonth =
      Number(
        next.selectionMonth,
      );

    const beforeMonthsApprox =
      Number.isFinite(
        transitionMonth,
      )
        ? Math.max(
            0,
            Math.min(
              12,
              transitionMonth -
                1,
            ),
          )
        : null;

    const afterMonthsApprox =
      Number.isFinite(
        transitionMonth,
      )
        ? Math.max(
            0,
            Math.min(
              12,
              13 -
                transitionMonth,
            ),
          )
        : null;

    const dominantSegment =
      Number.isFinite(
        beforeMonthsApprox,
      ) &&
      Number.isFinite(
        afterMonthsApprox,
      )
        ? (
            beforeMonthsApprox >
              afterMonthsApprox
              ? "beforeTransition"
              : afterMonthsApprox >
                  beforeMonthsApprox
                ? "afterTransition"
                : "balanced"
          )
        : "unknown";

    const annualPriorityInstruction =
      dominantSegment ===
        "beforeTransition"
        ? "全年主判断以交运前的大运与流年为主，新大运只作交运后的转折和后续趋势。"
        : dominantSegment ===
            "afterTransition"
          ? "全年主判断以交运后的新大运与流年为主，旧大运只解释交运前阶段。"
          : "交运前后覆盖时间接近，应并列分段，不人为指定单一全年主背景。";

    return deepClean({
      targetYear: year,
      isTransitionYear: true,
      transitionAt: {
        year: next.selectionYear,
        month: next.selectionMonth,
      },
      beforeTransition: previous,
      afterTransition: next,
      coverageMonthsApprox: {
        beforeTransition:
          beforeMonthsApprox,
        afterTransition:
          afterMonthsApprox,
      },
      dominantSegment,
      instruction: [
        "交运前后必须分段分析，不得把两步大运当成全年同时存在。",
        annualPriorityInstruction,
        Number.isFinite(
          transitionMonth,
        ) &&
        transitionMonth >=
          10
          ? "本年在较晚月份交运，新大运不得被写成全年第一主象。"
          : null,
      ].filter(Boolean),
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
