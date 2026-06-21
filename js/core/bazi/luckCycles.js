import {
  createPillarByIndex,
  formatLocalDateTime,
  getGanzhiIndex,
  getLocalBirthMs,
  getSolarMonthContext,
  stemYinYang,
} from "./pillarMath.js";

export function buildLuckCycles({
  birth,
  birthYear,
  gender = "unknown",
  yearPillar,
  monthPillar,
}) {
  const resolvedBirth = birth ?? {
    year: Number(birthYear),
    month: 1,
    day: 1,
    hour: 12,
    minute: 0,
  };

  const yearIsYang = stemYinYang[yearPillar?.stem] === "yang";

  const direction =
    (gender === "male" && yearIsYang) ||
    (gender === "female" && !yearIsYang)
      ? "forward"
      : "reverse";

  const monthIndex = getGanzhiIndex(
    monthPillar.stem,
    monthPillar.branch,
  );

  const startCalculation = calculateLuckStart(
    resolvedBirth,
    direction,
  );

  // 保留旧版整数起运年龄，避免现有功能立即断裂。
  const startAge = startCalculation.startAge;

  const pillars = Array.from({ length: 10 }, (_, index) => {
    const offset =
      direction === "forward"
        ? index + 1
        : -(index + 1);

    const pillar = createPillarByIndex(
      monthIndex + offset,
      "大运",
    );

    const ageStart = startAge + index * 10;

    // 每步大运相隔120个月，也就是10年。
    const preciseStartMonths =
      startCalculation.totalMonths + index * 120;

    const preciseEndMonths =
      preciseStartMonths + 120;

    const preciseStartAge =
      splitAgeMonths(preciseStartMonths);

    const preciseEndAge =
      splitAgeMonths(preciseEndMonths);

    const preciseStartDate = addMonthsToYearMonth(
      resolvedBirth,
      preciseStartMonths,
    );

    const preciseEndDate = addMonthsToYearMonth(
      resolvedBirth,
      preciseEndMonths,
    );

    return {
      index: index + 1,
      ...pillar,

      // 旧字段保留。
      startAge: ageStart,
      endAge: ageStart + 9,
      startYear:
        Number(resolvedBirth.year) + ageStart,
      endYear:
        Number(resolvedBirth.year) + ageStart + 9,

      // 新增精确年龄字段。
      startAgeYears: preciseStartAge.years,
      startAgeMonths: preciseStartAge.months,
      endAgeYears: preciseEndAge.years,
      endAgeMonths: preciseEndAge.months,

      ageRangeText: `${formatLuckAgeText(
        preciseStartAge.years,
        preciseStartAge.months,
      )}—${formatLuckAgeText(
        preciseEndAge.years,
        preciseEndAge.months,
      )}`,

      // 新增精确年月字段。
      startYearMonth:
        formatYearMonth(preciseStartDate),

      endYearMonth:
        formatYearMonth(preciseEndDate),
    };
  });

  return {
    gender,
    direction,
    directionLabel:
      direction === "forward" ? "顺行" : "逆行",

    startAge,
    startAgeText: startCalculation.ageText,
    startCalculation,

    startNote: `起运按${
      direction === "forward"
        ? "出生后下一节气"
        : "出生前上一节气"
    }折算，采用三天折一岁的规则；当前约${
      startCalculation.ageText
    }起运。`,

    pillars,
    cycles: pillars,

    evidence: [
      `年干${yearPillar?.stem ?? "待查"}为${
        yearIsYang ? "阳" : "阴"
      }，性别参数为${gender}，大运${
        direction === "forward" ? "顺行" : "逆行"
      }。`,

      `以月柱${monthPillar.label}为起点，按节气差折算起运时间。`,
    ],

    confidence: "medium",

    needVerify: [
      "起运仍需结合历法口径和出生地资料复核。",
    ],
  };
}


function calculateLuckStart(birth, direction) {
  const monthContext = getSolarMonthContext(birth);
  const boundary = direction === "forward" ? monthContext.next : monthContext.current;
  const offsetMinutes = Math.abs(boundary.localMs - getLocalBirthMs(birth)) / 60000;
  const offsetDays = offsetMinutes / 1440;
  const ageInYears = offsetDays / 3;
  const totalMonths = Math.max(1, Math.round(ageInYears * 12));
  const ageYears = Math.floor(totalMonths / 12);
  const ageMonths = totalMonths % 12;
  return {
    direction,
    boundaryName: boundary.name,
    boundaryAt: formatLocalDateTime(boundary),
    offsetDays: roundTo(offsetDays, 2),
    offsetHours: roundTo(offsetMinutes / 60, 1),
    ageYears,
    ageMonths,
    totalMonths,
    ageText: formatLuckAgeText(ageYears, ageMonths),
    startAge: Math.max(1, Math.round(ageInYears)),
    method: direction === "forward"
      ? "顺行取出生后下一节气，按三天折一岁。"
      : "逆行取出生前上一节气，按三天折一岁。",
  };
}

function formatLuckAgeText(years, months) {
  const parts = [];
  if (years) parts.push(`${years}年`);
  if (months) parts.push(`${months}个月`);
  return parts.join("") || "1个月";
}

function splitAgeMonths(totalMonths) {
  const normalizedMonths = Math.max(0, Math.trunc(Number(totalMonths) || 0));

  return {
    years: Math.floor(normalizedMonths / 12),
    months: normalizedMonths % 12,
  };
}

function addMonthsToYearMonth(birth, monthsToAdd) {
  const baseMonthIndex =
    Number(birth.year) * 12 +
    (Number(birth.month) - 1) +
    Number(monthsToAdd);

  return {
    year: Math.floor(baseMonthIndex / 12),
    month: ((baseMonthIndex % 12) + 12) % 12 + 1,
  };
}

function formatYearMonth(value = {}) {
  return `${value.year}年${String(value.month).padStart(2, "0")}月`;
}

function roundTo(value, digits) {
  const factor = 10 ** digits;
  return Math.round((Number(value) + Number.EPSILON) * factor) / factor;
}

export { createPillarByIndex, getGanzhiIndex as ganzhiIndex };
