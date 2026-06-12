import {
  createPillarByIndex,
  formatLocalDateTime,
  getGanzhiIndex,
  getLocalBirthMs,
  getSolarMonthContext,
  stemYinYang,
} from "./pillarMath.js";

export function buildLuckCycles({ birth, birthYear, gender = "unknown", yearPillar, monthPillar }) {
  const resolvedBirth = birth ?? { year: Number(birthYear), month: 1, day: 1, hour: 12, minute: 0 };
  const yearIsYang = stemYinYang[yearPillar?.stem] === "yang";
  const direction = (gender === "male" && yearIsYang) || (gender === "female" && !yearIsYang) ? "forward" : "reverse";
  const monthIndex = getGanzhiIndex(monthPillar.stem, monthPillar.branch);
  const startCalculation = calculateLuckStart(resolvedBirth, direction);
  const startAge = startCalculation.startAge;
  const pillars = Array.from({ length: 10 }, (_, index) => {
    const offset = direction === "forward" ? index + 1 : -(index + 1);
    const pillar = createPillarByIndex(monthIndex + offset, "大运");
    const ageStart = startAge + index * 10;
    return {
      index: index + 1,
      ...pillar,
      startAge: ageStart,
      endAge: ageStart + 9,
      startYear: Number(resolvedBirth.year) + ageStart,
      endYear: Number(resolvedBirth.year) + ageStart + 9,
    };
  });
  return {
    gender,
    direction,
    directionLabel: direction === "forward" ? "顺行" : "逆行",
    startAge,
    startAgeText: startCalculation.ageText,
    startCalculation,
    startNote: `起运按${direction === "forward" ? "出生后下一节气" : "出生前上一节气"}折算，采用三天折一岁的规则；当前约${startCalculation.ageText}起运。`,
    pillars,
    cycles: pillars,
    evidence: [
      `年干${yearPillar?.stem ?? "待查"}为${yearIsYang ? "阳" : "阴"}，性别参数为${gender}，大运${direction === "forward" ? "顺行" : "逆行"}。`,
      `以月柱${monthPillar.label}为起点，按节气差折算起运时间。`,
    ],
    confidence: "medium",
    needVerify: ["起运仍需结合历法口径和出生地资料复核。"],
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

function roundTo(value, digits) {
  const factor = 10 ** digits;
  return Math.round((Number(value) + Number.EPSILON) * factor) / factor;
}

export { createPillarByIndex, getGanzhiIndex as ganzhiIndex };
