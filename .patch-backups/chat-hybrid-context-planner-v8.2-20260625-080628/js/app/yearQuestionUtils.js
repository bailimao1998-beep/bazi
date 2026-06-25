const MAX_SCAN_YEARS = 20;
const DEFAULT_FUTURE_SCAN_YEARS = 15;

export function detectChatIntent(
  question = "",
) {
  const text =
    String(
      question,
    );

  const hasMonthIntent =
    /流月|月份|这个月|下个月|每个月|几个月|哪几个月|几月|哪月|哪些月/.test(
      text,
    );

  const hasMultiYearIntent =
    /20\d{2}.*20\d{2}|未来.{0,3}(三|四|五|六|七|八|九|十|\d+)年|哪几年|哪些年|什么时候|何时|几年|多年|一生.*年/.test(
      text,
    );

  if (
    hasMonthIntent &&
    !hasMultiYearIntent
  ) {
    return "monthTrend";
  }

  if (
    hasMonthIntent &&
    /(?:19|20)\d{2}/.test(
      text,
    ) &&
    !/未来.{0,3}(三|四|五|六|七|八|九|十|\d+)年|20\d{2}.*20\d{2}/.test(
      text,
    )
  ) {
    return "monthTrend";
  }

  if (
    hasMultiYearIntent
  ) {
    return "multiYear";
  }

  if (
    /流年|今年|明年|后年|年份|哪一年|20\d{2}/.test(
      text,
    )
  ) {
    return "yearTrend";
  }

  if (
    hasMonthIntent
  ) {
    return "monthTrend";
  }

  if (
    /感情|婚姻|对象|正缘|桃花|恋爱|分手|复合|配偶/.test(
      text,
    )
  ) {
    return "relationship";
  }

  if (
    /事业|工作|职业|行业|上班|创业|项目|学业|学习|考试/.test(
      text,
    )
  ) {
    return "career";
  }

  if (
    /财|钱|收入|赚钱|投资|资产|负债/.test(
      text,
    )
  ) {
    return "wealth";
  }

  if (
    /健康|身体|疾病|体质|睡眠|焦虑|压力/.test(
      text,
    )
  ) {
    return "health";
  }

  if (
    /为什么|依据|证据|怎么看出来|哪里看/.test(
      text,
    )
  ) {
    return "chartEvidence";
  }

  return "free";
}

export function buildYearSearchPlan({
  question = "",
  baseYear =
    new Date()
      .getFullYear(),
  birthYear,
  luckItems = [],
} = {}) {
  const text =
    String(
      question,
    );

  const currentYear =
    Number(
      baseYear,
    ) ||
    new Date()
      .getFullYear();

  const explicit =
    extractExplicitYears(
      text,
      currentYear,
    );

  if (
    explicit.length >
    0
  ) {
    return {
      mode:
        "explicit",
      reason:
        "用户明确给出年份或年份范围",
      years:
        explicit.slice(
          0,
          MAX_SCAN_YEARS,
        ),
    };
  }

  if (
    !/哪几年|哪些年|什么时候|何时|几年|多年|会有|容易有|正缘/.test(
      text,
    )
  ) {
    return {
      mode:
        "none",
      reason:
        "问题未要求跨年份扫描",
      years:
        [],
    };
  }

  if (
    /过去|以前|曾经|回顾|哪年发生过/.test(
      text,
    )
  ) {
    const safeBirthYear =
      Number(
        birthYear,
      );

    const start =
      Number.isFinite(
        safeBirthYear,
      )
        ? Math.max(
            safeBirthYear +
              12,
            currentYear -
              (
                MAX_SCAN_YEARS -
                1
              ),
          )
        : currentYear -
          (
            MAX_SCAN_YEARS -
            1
          );

    return {
      mode:
        "default_past_scan",
      reason:
        "未指定范围，按成年前后至当前年份的最近窗口扫描",
      years:
        rangeYears(
          start,
          currentYear,
        ),
    };
  }

  const currentCycle =
    findLuckCycleForYear(
      luckItems,
      currentYear,
    );

  const nextCycle =
    findNextLuckCycle(
      luckItems,
      currentCycle,
    );

  const proposedEnd =
    nextCycle?.endYear ??
    currentCycle?.endYear ??
    (
      currentYear +
      DEFAULT_FUTURE_SCAN_YEARS -
      1
    );

  const end =
    Math.min(
      proposedEnd,
      currentYear +
        MAX_SCAN_YEARS -
        1,
    );

  return {
    mode:
      "default_future_scan",
    reason:
      "未指定范围，扫描当前年份至当前/下一步大运覆盖的未来窗口",
    years:
      rangeYears(
        currentYear,
        Math.max(
          currentYear,
          end,
        ),
      ),
  };
}

export function extractYearsFromQuestion(
  question = "",
  baseYear =
    new Date()
      .getFullYear(),
  options = {},
) {
  return buildYearSearchPlan({
    question,
    baseYear,
    birthYear:
      options?.birthYear,
    luckItems:
      options?.luckItems,
  }).years;
}

export function buildRequestedYearReports({
  years = [],
  state,
  buildLuckImageReport,
  buildYearImageReport,
}) {
  if (
    !state?.chart ||
    !state?.baseBaziViewModel ||
    !state?.natalImageReport
  ) {
    return [];
  }

  const safeYears =
    [
      ...new Set(
        (
          Array.isArray(
            years,
          )
            ? years
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
    ].slice(
      0,
      MAX_SCAN_YEARS,
    );

  return safeYears.map(
    (targetYear) => {
      const luckImageReport =
        buildLuckImageReport({
          chart:
            state.chart,
          baseBaziViewModel:
            state.baseBaziViewModel,
          natalImageReport:
            state.natalImageReport,
          targetYear,
        });

      const yearImageReport =
        buildYearImageReport({
          chart:
            state.chart,
          baseBaziViewModel:
            state.baseBaziViewModel,
          natalImageReport:
            state.natalImageReport,
          luckImageReport,
          targetYear,
        });

      return {
        year:
          targetYear,
        luckImageReport,
        yearImageReport,
      };
    },
  );
}

function extractExplicitYears(
  text,
  currentYear,
) {
  const years =
    new Set();

  const rangeMatch =
    text.match(
      /((?:19|20)\d{2})\s*(?:到|至|-|—|~)\s*((?:19|20)\d{2})/,
    );

  if (
    rangeMatch
  ) {
    const start =
      Number(
        rangeMatch[1],
      );

    const end =
      Number(
        rangeMatch[2],
      );

    rangeYears(
      Math.min(
        start,
        end,
      ),
      Math.max(
        start,
        end,
      ),
    ).forEach(
      (year) =>
        years.add(
          year,
        ),
    );
  }

  for (
    const match of
      text.matchAll(
        /(?:19|20)\d{2}/g,
      )
  ) {
    years.add(
      Number(
        match[0],
      ),
    );
  }

  const futureMatch =
    text.match(
      /未来\s*(\d+|三|四|五|六|七|八|九|十)\s*年/,
    );

  if (
    futureMatch
  ) {
    const count =
      chineseNumberToInt(
        futureMatch[1],
      ) ||
      3;

    for (
      let index =
        0;
      index <
        count &&
      index <
        MAX_SCAN_YEARS;
      index +=
        1
    ) {
      years.add(
        currentYear +
        index,
      );
    }
  }

  if (
    /明年/.test(
      text,
    )
  ) {
    years.add(
      currentYear +
      1,
    );
  }

  if (
    /后年/.test(
      text,
    )
  ) {
    years.add(
      currentYear +
      2,
    );
  }

  if (
    /今年|当前年份|目标年份/.test(
      text,
    )
  ) {
    years.add(
      currentYear,
    );
  }

  return [
    ...years,
  ]
    .filter(
      (year) =>
        Number.isFinite(
          year,
        ) &&
        year >=
          1900 &&
        year <=
          2100,
    )
    .sort(
      (
        left,
        right,
      ) =>
        left -
        right,
    )
    .slice(
      0,
      MAX_SCAN_YEARS,
    );
}

function rangeYears(
  start,
  end,
) {
  const years = [];

  for (
    let year =
      Number(
        start,
      );
    year <=
      Number(
        end,
      ) &&
    years.length <
      MAX_SCAN_YEARS;
    year +=
      1
  ) {
    years.push(
      year,
    );
  }

  return years;
}

function findLuckCycleForYear(
  luckItems,
  year,
) {
  return normalizeLuckRanges(
    luckItems,
  ).find(
    (item) =>
      year >=
        item.startYear &&
      year <=
        item.endYear,
  ) ??
  null;
}

function findNextLuckCycle(
  luckItems,
  currentCycle,
) {
  if (
    !currentCycle
  ) {
    return null;
  }

  return normalizeLuckRanges(
    luckItems,
  ).find(
    (item) =>
      item.startYear >
      currentCycle.startYear,
  ) ??
  null;
}

function normalizeLuckRanges(
  luckItems,
) {
  return (
    Array.isArray(
      luckItems,
    )
      ? luckItems
      : []
  )
    .map(
      (item) => {
        const matched =
          String(
            item?.yearRange ??
            "",
          ).match(
            /((?:19|20)\d{2})\D+((?:19|20)\d{2})/,
          );

        if (
          !matched
        ) {
          return null;
        }

        return {
          ...item,
          startYear:
            Math.min(
              Number(
                matched[1],
              ),
              Number(
                matched[2],
              ),
            ),
          endYear:
            Math.max(
              Number(
                matched[1],
              ),
              Number(
                matched[2],
              ),
            ),
        };
      },
    )
    .filter(Boolean)
    .sort(
      (
        left,
        right,
      ) =>
        left.startYear -
        right.startYear,
    );
}

export function chineseNumberToInt(
  value,
) {
  const map = {
    三:
      3,
    四:
      4,
    五:
      5,
    六:
      6,
    七:
      7,
    八:
      8,
    九:
      9,
    十:
      10,
  };

  if (
    /^\d+$/.test(
      String(
        value,
      ),
    )
  ) {
    return Number(
      value,
    );
  }

  return (
    map[value] ??
    null
  );
}
