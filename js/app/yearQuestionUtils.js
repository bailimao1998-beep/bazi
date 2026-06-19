export function detectChatIntent(question = "") {
  const text = String(question);

  if (/20\d{2}.*20\d{2}|未来.{0,3}(三|四|五|六|七|八|九|十|\d+)年|几年|多年/.test(text)) {
    return "multiYear";
  }

  if (/流年|今年|明年|后年|年份|哪一年|20\d{2}/.test(text)) {
    return "yearTrend";
  }

  if (/流月|月份|这个月|下个月|几月|哪月/.test(text)) {
    return "monthTrend";
  }

  if (/感情|婚姻|对象|正缘|桃花|恋爱|分手|复合|配偶/.test(text)) {
    return "relationship";
  }

  if (/事业|工作|职业|行业|上班|创业|项目|学业|学习|考试/.test(text)) {
    return "career";
  }

  if (/财|钱|收入|赚钱|投资|资产|负债/.test(text)) {
    return "wealth";
  }

  if (/健康|身体|疾病|体质|睡眠|焦虑|压力/.test(text)) {
    return "health";
  }

  if (/为什么|依据|证据|怎么看出来|哪里看/.test(text)) {
    return "chartEvidence";
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

    return {
      year: targetYear,
      luckImageReport,
      yearImageReport,
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
