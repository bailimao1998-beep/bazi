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
  "domainSignals",
  "domainCoverage",
];

const BASE_CHAT_RULES = [
  "你同时具有两种身份：命理问答助手和通用AI助手。",
  "先判断用户的问题是否与八字命理有关，再决定是否使用命盘数据。",
  "非命理问题直接作为通用AI正常回答，不得强行结合命盘，也不必附加命理边界说明。",
  "命理问题应优先读取系统提供的四柱、十神、藏干、宫位、干支关系、大运、流年、流月和取象报告。",
  "系统提供的排盘、十神位置和明确关系属于固定事实，不得修改、补造或重新排盘。",
  "在固定事实基础上，你可以结合传统八字知识自由进行综合判断、取象、比较、推演和情景分析。",
  "不要因为系统没有直接提供旺衰、格局、喜忌、做功或现实结论字段，就拒绝进行合理综合分析。",
  "系统事实之外的结论属于AI综合推断，应自然表达为进一步推演、综合来看或较可能的现实表现，不得伪称为本地系统已经确认的固定结果。",
  "用户询问感情、事业、财运、家庭、体质或人生主线时，应先直接回答主要判断，再说明依据、现实表现和建议。",
  "用户询问大运、流年、流月时，应使用对应时间层报告；存在多个取象时，可以结合用户反馈继续缩小现实落点。",
  "可以说出较可能发生的事情和两种可能走向，但不能把推演写成必然事实。",
  "不得使用注定、必然、百分之百、一定发生等绝对措辞。",
  "不得确定断死亡、重大疾病、灾祸、牢狱、投资收益或法律结果。",
  "回答风格应自然、直接、像真正解决问题的AI，不要为了展示命理流程而机械复述所有数据。",
];

const DATA_USAGE_RULES = [
  "用户问出生原局、命好不好、一生主线或某个长期领域时，优先使用原局可信证据包，并允许在固定事实之上进行传统命理综合推断。",
  "用户问多年走势时，优先使用系统预先生成的各年份大运与流年取象数据。",
  "用户问某一年时，必须把该流年放在当时的大运背景中解释。",
  "用户问月份差异时，优先使用系统预先生成的十二流月取象数据。",
  "用户明确写出年份时，以问题中指定年份对应的报告为准，不得用页面当前选中的年份替代。",
  "命理数据不足以确认现实细节时，可以给出最可能的几种场景，并明确需要用户提供哪些现实反馈来继续缩小范围。",
  "用户问普通问题时，作为通用AI助手直接回答；除非用户明确要求结合命盘，否则不要提八字。",
];

const USER_FACING_RULES = [
  `严禁在回答中暴露任何代码字段名、JSON字段名、英文变量名或开发者术语，例如：${INTERNAL_FIELD_NAMES.join("、")}。`,
  "所有证据来源必须翻译成普通用户能看懂的中文说法，例如当前大运、目标流年、目标流月、原局结构、关系触发和十神主题。",
  "固定排盘事实与AI综合推断容易混淆时，使用根据系统排盘可确定、进一步综合推演来看、现实中更容易表现为等自然说法加以区分。",
  "不要说根据某个JSON包或某个内部字段；应直接说根据原局、当前大运、目标流年或本月触发。",
  "不要展示内部证据ID、评分、调试信息或数据结构。",
];

const OUTPUT_FORMAT_RULES = [
  "回答应先直接回应用户真正的问题，不要先写长篇免责声明。",
  "简单问题直接自然回答，不强制套用固定Markdown模板。",
  "复杂命理问题可以按直接判断、命盘依据、现实推演、建议与验证点组织，但只保留真正有用的部分。",
  "命理判断要先给结论，再讲原因，再讲现实表现；建议必须与前面的判断直接对应。",
  "有利趋势要说明怎样把握并避免骄傲、贪进或过度扩张；不利趋势要说明早期信号和降低风险的方法。",
  "用户要求详细时可以展开；用户只问一个小问题时保持聚焦。",
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
} = {}) {
  const normalizedQuestion =
    String(question ?? "").trim();

  const normalizedIntent =
    normalizeChatIntent(chatIntent);

  const normalizedRequestedYears =
    normalizeYears(requestedYears);

  const compactRequestedReports =
    compactRequestedYearReports(
      requestedYearReports,
    );

  const userPayload = {
    question:
      normalizedQuestion,

    chatIntent:
      normalizedIntent,
  };

  const isFortuneQuestion =
    looksLikeFortuneQuestion(
      normalizedQuestion,
    );

  const needsNatalEvidence =
    NATAL_CHAT_INTENTS.has(
      normalizedIntent,
    ) ||
    TIME_CHAT_INTENTS.has(
      normalizedIntent,
    ) ||
    isFortuneQuestion;

  if (needsNatalEvidence) {
    userPayload.natalAiEvidencePack =
      natalImageReport?.natalAiEvidencePack ??
      natalImageReport?.natalDebug
        ?.natalAiEvidencePack ??
      null;
  }

  if (normalizedIntent === "multiYear") {
    userPayload.requestedYears =
      normalizedRequestedYears;

    userPayload.requestedYearReports =
      compactRequestedReports;
  }

  if (normalizedIntent === "yearTrend") {
    if (compactRequestedReports.length) {
      userPayload.requestedYears =
        normalizedRequestedYears;

      userPayload.requestedYearReports =
        compactRequestedReports;
    } else {
      userPayload.luckImageReport =
        compactReport(luckImageReport);

      userPayload.yearImageReport =
        compactReport(yearImageReport);
    }
  }

  if (normalizedIntent === "monthTrend") {
    if (compactRequestedReports.length) {
      userPayload.requestedYears =
        normalizedRequestedYears;

      userPayload.requestedYearReports =
        compactRequestedReports;
    } else {
      userPayload.luckImageReport =
        compactReport(luckImageReport);

      userPayload.yearImageReport =
        compactReport(yearImageReport);

      userPayload.monthImageReport =
        compactReport(monthImageReport);

      userPayload.monthImageReports =
        compactMonthReports(
          monthImageReports,
        );
    }
  }

  return {
    system: buildChatSystemPrompt(),

    user: JSON.stringify(
      userPayload,
      null,
      2,
    ),
  };
}

function looksLikeFortuneQuestion(
  question = "",
) {
  const text =
    String(question ?? "").trim();

  if (!text) return false;

  return /八字|命盘|命局|命理|排盘|日主|四柱|五行|十神|藏干|格局|喜用|用神|忌神|旺衰|身强|身弱|做功|制化|调候|大运|流年|流月|命好|命怎么样|人生主线|一生|妻财子禄寿|正缘|桃花|婚姻运|感情运|事业运|官运|财运|子女运|父母运|健康运/.test(
    text,
  );
}

function compactReport(report) {
  if (
    !report ||
    typeof report !== "object"
  ) {
    return null;
  }

  return {
    summary:
      report.summary ?? null,

    imageCards:
      report.imageCards ?? undefined,

    luckItems:
      report.luckItems ?? undefined,

    yearItem:
      report.yearItem ?? undefined,

    monthItem:
      report.monthItem ?? undefined,

    keySignals:
      report.keySignals ?? undefined,

    needVerify:
      report.needVerify ?? undefined,
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
        domainSignals: item.domainSignals ?? null,
      },
    };
  });
}

function compactRequestedYearReports(reports = []) {
  return (Array.isArray(reports) ? reports : []).map((item) => {
    const monthReports =
      compactMonthReports(
        item.monthImageReports,
      );

    return {
      year: item.year,
      luckImageReport:
        compactReport(item.luckImageReport),
      yearImageReport:
        compactReport(item.yearImageReport),
      ...(monthReports.length
        ? {
            monthImageReports:
              monthReports,
          }
        : {}),
    };
  });
}

function normalizeChatIntent(value) {
  const normalized =
    String(value ?? "").trim();

  return VALID_CHAT_INTENTS.has(
    normalized,
  )
    ? normalized
    : "free";
}

function normalizeYears(items) {
  return [
    ...new Set(
      (Array.isArray(items)
        ? items
        : [])
        .map(Number)
        .filter((year) =>
          Number.isFinite(year) &&
          year >= 1900 &&
          year <= 2100,
        ),
    ),
  ].sort((left, right) =>
    left - right,
  );
}
