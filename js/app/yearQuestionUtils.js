const FORTUNE_CONTEXT_PATTERN =
  /八字|命盘|命局|命理|排盘|日主|四柱|五行|十神|藏干|格局|喜用|用神|忌神|旺衰|身强|身弱|做功|制化|调候|大运|流年|流月|运势|运程|命中|命里|算命|看命|命好|人生主线|妻财子禄寿/;

const FORTUNE_PREDICTION_PATTERN =
  /怎么样|如何|好不好|会不会|能不能|什么时候|何时|哪一年|哪年|哪月|哪几个月|哪些月|未来|以后|一生|容易|适合|发展|结果|出现|发生|走向|趋势|运势|运程/;

const PERSONAL_OR_CHART_SUBJECT_PATTERN =
  /我|我的|本人|命主|这个人|此人|他|她|男命|女命/;

const FORTUNE_DOMAIN_PATTERN =
  /感情|婚姻|对象|正缘|桃花|恋爱|分手|复合|配偶|事业|工作|职业|行业|上班|创业|项目|学业|学习|考试|财运|财富|钱|收入|赚钱|投资|资产|负债|健康|身体|疾病|体质|睡眠|焦虑|压力/;

const FORTUNE_TIME_PATTERN =
  /20\d{2}|今年|明年|后年|未来|几年|多年|月份|几月|哪月/;

const GENERAL_TASK_PATTERN =
  /是什么|什么意思|解释一下|翻译|怎么学|如何学|学什么|学习方法|教程|课程|代码|编程|语法|算法|Python|JavaScript|写一封|写邮件|邮件|简历|面试|求职|作业|题目|怎么做|怎么办|步骤|方案|方法|技巧|基金|股票|指标|价格|报价|成本|预算|怎么省|如何省|怎么赚|如何赚|怎么投资|如何投资|投资建议|治疗|用药|缓解|调节|天气|旅游|旅行|新闻|政策|法律|产品|手机|电脑|苹果|发布|上市|市场趋势|行业趋势/;

export function detectChatIntent(question = "") {
  const text = String(question).trim();
  if (!text) return "free";

  const hasExplicitFortuneContext =
    FORTUNE_CONTEXT_PATTERN.test(text);

  const looksLikeGeneralTask =
    !hasExplicitFortuneContext &&
    GENERAL_TASK_PATTERN.test(text);

  const hasFortunePredictionSignal =
    FORTUNE_PREDICTION_PATTERN.test(text) &&
    (
      PERSONAL_OR_CHART_SUBJECT_PATTERN.test(text) ||
      FORTUNE_DOMAIN_PATTERN.test(text) ||
      FORTUNE_TIME_PATTERN.test(text)
    );

  const isFortuneQuestion =
    hasExplicitFortuneContext ||
    (
      !looksLikeGeneralTask &&
      hasFortunePredictionSignal
    );

  if (!isFortuneQuestion) {
    return "free";
  }

  if (/20\d{2}.*20\d{2}|未来.{0,3}(三|四|五|六|七|八|九|十|\d+)年|几年|多年/.test(text)) {
    return "multiYear";
  }

  /*
   * 月份意图必须先于年份意图判断。
   * 例如“2027年哪几个月好”同时含年份和月份，
   * 实际需要十二流月数据，而不是只加载流年。
   */
  if (/流月|月份|这个月|下个月|每个月|几月|哪月|哪几个月|哪些月|哪个月/.test(text)) {
    return "monthTrend";
  }

  if (/流年|今年|明年|后年|年份|哪一年|20\d{2}/.test(text)) {
    return "yearTrend";
  }

  const asksForEvidence =
    /为什么|依据|证据|怎么看出来|哪里看|如何判断/.test(text);

  if (
    hasExplicitFortuneContext &&
    asksForEvidence
  ) {
    return "chartEvidence";
  }

  if (/感情|婚姻|对象|正缘|桃花|恋爱|分手|复合|配偶/.test(text)) {
    return "relationship";
  }

  if (/事业|工作|职业|行业|上班|创业|项目|学业|学习|考试/.test(text)) {
    return "career";
  }

  if (/财运|财富|钱|收入|赚钱|投资|资产|负债/.test(text)) {
    return "wealth";
  }

  if (/健康|身体|疾病|体质|睡眠|焦虑|压力/.test(text)) {
    return "health";
  }

  return "free";
}

export function extractYearsFromQuestion(question = "", baseYear = new Date().getFullYear()) {
  const text = String(question);
  const years = new Set();
  const currentYear = Number(baseYear) || new Date().getFullYear();

  const rangeMatch = text.match(/((?:19|20)\d{2})\s*(?:到|至|-|—|~)\s*((?:19|20)\d{2})/);
  if (rangeMatch) {
    const start = Number(rangeMatch[1]);
    const end = Number(rangeMatch[2]);
    const min = Math.min(start, end);
    const max = Math.max(start, end);

    for (let year = min; year <= max && years.size < 10; year += 1) {
      years.add(year);
    }
  }

  for (const match of text.matchAll(/(?:19|20)\d{2}/g)) {
    years.add(Number(match[0]));
  }

  const futureMatch = text.match(/未来\s*(\d+|三|四|五|六|七|八|九|十)\s*年/);
  if (futureMatch) {
    const count = chineseNumberToInt(futureMatch[1]) || 3;
    for (let i = 0; i < count && i < 10; i += 1) {
      years.add(currentYear + i);
    }
  }

  if (/明年/.test(text)) years.add(currentYear + 1);
  if (/后年/.test(text)) years.add(currentYear + 2);
  if (/今年|当前年份|目标年份/.test(text)) years.add(currentYear);

  return Array.from(years)
    .filter((year) => Number.isFinite(year) && year >= 1900 && year <= 2100)
    .sort((a, b) => a - b)
    .slice(0, 10);
}

export function buildRequestedYearReports({
  years = [],
  state,
  buildLuckImageReport,
  buildYearImageReport,
  buildMonthImageReport,
}) {
  if (!state?.chart || !state?.baseBaziViewModel || !state?.natalImageReport) {
    return [];
  }

  const safeYears = [...new Set(
    (Array.isArray(years) ? years : [])
      .map(Number)
      .filter((year) => Number.isFinite(year) && year >= 1900 && year <= 2100)
  )].slice(0, 10);

  return safeYears.map((targetYear) => {
    const luckImageReport = buildLuckImageReport({
      chart: state.chart,
      baseBaziViewModel: state.baseBaziViewModel,
      natalImageReport: state.natalImageReport,
      targetYear,
    });

    const yearImageReport = buildYearImageReport({
      chart: state.chart,
      baseBaziViewModel: state.baseBaziViewModel,
      natalImageReport: state.natalImageReport,
      luckImageReport,
      targetYear,
    });

    const monthImageReports =
      typeof buildMonthImageReport === "function"
        ? Array.from(
            { length: 12 },
            (_, index) =>
              dedupeMonthImageReportRelations(
                buildMonthImageReport({
                  chart: state.chart,
                  baseBaziViewModel: state.baseBaziViewModel,
                  natalImageReport: state.natalImageReport,
                  luckImageReport,
                  yearImageReport,
                  targetYear,
                  selectedMonth: index + 1,
                }),
              ),
          )
        : [];

    return {
      year: targetYear,
      luckImageReport,
      yearImageReport,
      monthImageReports,
    };
  });
}

export function chineseNumberToInt(value) {
  const map = {
    三: 3,
    四: 4,
    五: 5,
    六: 6,
    七: 7,
    八: 8,
    九: 9,
    十: 10,
  };

  if (/^\d+$/.test(String(value))) return Number(value);
  return map[value] ?? null;
}


function dedupeMonthImageReportRelations(report = {}) {
  const item = report.monthItem;
  if (!item) return report;

  return {
    ...report,
    monthItem: {
      ...item,
      relationToNatal:
        uniqueRelations(item.relationToNatal),
      relationToLuck:
        uniqueRelations(item.relationToLuck),
      relationToYear:
        uniqueRelations(item.relationToYear),
    },
  };
}

function uniqueRelations(relations = []) {
  const seen = new Set();

  return (
    Array.isArray(relations)
      ? relations
      : []
  ).filter((relation) => {
    const key = [
      relation.type,
      relation.natalPillar ??
        relation.luckGanZhi ??
        relation.yearGanZhi ??
        "",
      relation.natalBranch ??
        relation.luckBranch ??
        relation.yearBranch ??
        "",
      relation.monthBranch ??
        relation.sourceBranch ??
        "",
    ].join("|");

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}
