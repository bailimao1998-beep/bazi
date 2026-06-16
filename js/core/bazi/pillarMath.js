import { branchElements, stemElements } from "./fiveElements.js";
import { branches, stems } from "./tenGods.js";
import { formatLunarDate, lunarToSolar, solarToLunar } from "../../lunarCalendar.js";

export const stemYinYang = {
  甲: "yang",
  乙: "yin",
  丙: "yang",
  丁: "yin",
  戊: "yang",
  己: "yin",
  庚: "yang",
  辛: "yin",
  壬: "yang",
  癸: "yin",
};

const localTimezoneOffsetMinutes = 480;
const dayPillarAnchor = { year: 1984, month: 2, day: 2, index: 2, label: "丙寅" };
const monthBranches = ["寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥", "子", "丑"];
const monthBoundaryTerms = [
  { name: "小寒", month: 1, day: 6, longitude: 285, branch: "丑" },
  { name: "立春", month: 2, day: 4, longitude: 315, branch: "寅" },
  { name: "惊蛰", month: 3, day: 6, longitude: 345, branch: "卯" },
  { name: "清明", month: 4, day: 5, longitude: 15, branch: "辰" },
  { name: "立夏", month: 5, day: 6, longitude: 45, branch: "巳" },
  { name: "芒种", month: 6, day: 6, longitude: 75, branch: "午" },
  { name: "小暑", month: 7, day: 7, longitude: 105, branch: "未" },
  { name: "立秋", month: 8, day: 8, longitude: 135, branch: "申" },
  { name: "白露", month: 9, day: 8, longitude: 165, branch: "酉" },
  { name: "寒露", month: 10, day: 8, longitude: 195, branch: "戌" },
  { name: "立冬", month: 11, day: 7, longitude: 225, branch: "亥" },
  { name: "大雪", month: 12, day: 7, longitude: 255, branch: "子" },
];
const solarTermCache = new Map();
const defaultLocations = [
  { name: "北京", aliases: ["北京市"], longitude: 116.4074, latitude: 39.9042, timezone: "Asia/Shanghai", standardMeridian: 120 },
  { name: "上海", aliases: ["上海市"], longitude: 121.4737, latitude: 31.2304, timezone: "Asia/Shanghai", standardMeridian: 120 },
  { name: "广州", aliases: ["广州市"], longitude: 113.2644, latitude: 23.1291, timezone: "Asia/Shanghai", standardMeridian: 120 },
  { name: "深圳", aliases: ["深圳市"], longitude: 114.0579, latitude: 22.5431, timezone: "Asia/Shanghai", standardMeridian: 120 },
  { name: "成都", aliases: ["成都市"], longitude: 104.0665, latitude: 30.5728, timezone: "Asia/Shanghai", standardMeridian: 120 },
  { name: "乌鲁木齐", aliases: ["乌市", "乌鲁木齐市"], longitude: 87.6168, latitude: 43.8256, timezone: "Asia/Shanghai", standardMeridian: 120 },
  { name: "定州", aliases: ["定州市"], longitude: 114.9902, latitude: 38.5162, timezone: "Asia/Shanghai", standardMeridian: 120 },
];

export function parseBirth(input = {}, datasets = {}) {
  const calendar = normalizeBirthCalendar(input);
  const dateText = calendar.solarDate;
  const timeText = input.birthTime ?? input.time ?? "12:00";
  const [year, month, day] = dateText.split("-").map(Number);
  const [hour, minute] = timeText.split(":").map(Number);
  const rawBirth = {
    year,
    month,
    day,
    hour,
    minute: minute || 0,
    calendar,
  };
  const location = resolveBirthLocation(input.birthplace, datasets);
  return applyTrueSolarTime(rawBirth, location, input.trueSolarTime);
}

function normalizeBirthCalendar(input) {
  const inputCalendarType = input.calendarType === "lunar" ? "lunar" : "solar";
  const solarDate = inputCalendarType === "lunar"
    ? lunarToSolar({
        year: input.lunarYear,
        month: input.lunarMonth,
        day: input.lunarDay,
        isLeapMonth: input.lunarLeapMonth,
      })
    : input.birthDate ?? input.date ?? "1992-08-18";
  const lunar = solarToLunar(solarDate);
  return {
    inputCalendarType,
    solarDate,
    lunar,
    lunarDate: formatLunarDate(lunar),
  };
}

export function buildNatalPillars(birth) {
  const year = createPillarFromYear(adjustedSolarYear(birth), "年柱");
  const month = createBirthMonthPillar(birth, year.stem, "月柱");
  const dayPillarBirth = getDayPillarBirth(birth);
  const day = createDayPillar(dayPillarBirth, "日柱");
  const hour = createHourPillar(birth.hour, day.stem, "时柱");
  return { year, month, day, hour };
}

export function createPillarFromYear(year, role = "流年") {
  return createPillarByIndex(Number(year) - 1984, role, { year: Number(year) });
}

export function createMonthPillar(year, month, role = "流月") {
  const yearStem = createPillarFromYear(year, "流年").stem;
  return createFlowMonthPillar(yearStem, month, role, { year: Number(year), month: Number(month) });
}

function createFlowMonthPillar(yearStem, month, role = "流月", meta = {}) {
  const monthIndex = Math.min(12, Math.max(1, Math.trunc(Number(month) || 1))) - 1;
  const branch = monthBranches[monthIndex];
  const branchOrderFromYin = monthBranches.indexOf(branch);
  const yearStemIndex = stems.indexOf(yearStem);
  const stem = stems[((yearStemIndex % 5) * 2 + 2 + branchOrderFromYin) % 10];

  return makePillar(stem, branch, role, {
    ...meta,
    flowMonthIndex: monthIndex + 1,
    method: "流月按目标流年内部的十二节气月排布：第1月为寅月，之后卯、辰、巳、午、未、申、酉、戌、亥、子、丑。",
  });
}

export function createBirthMonthPillar(birth, yearStem, role = "月柱") {
  const monthContext = getSolarMonthContext(birth);
  const branch = monthContext.current.branch;
  const branchOrderFromYin = monthBranches.indexOf(branch);
  const yearStemIndex = stems.indexOf(yearStem);
  const stem = stems[((yearStemIndex % 5) * 2 + 2 + branchOrderFromYin) % 10];
  return makePillar(stem, branch, role, {
    month: birth.month,
    solarTerm: monthContext.current.name,
    nextSolarTerm: monthContext.next.name,
    solarTermAt: formatLocalDateTime(monthContext.current),
    nextSolarTermAt: formatLocalDateTime(monthContext.next),
    method: "月柱按节气排月，以太阳黄经计算的节气时刻为月令边界。",
  });
}

export function createPillarByIndex(index, role = "", meta = {}) {
  const normalized = ((Number(index) % 60) + 60) % 60;
  return makePillar(stems[normalized % 10], branches[normalized % 12], role, meta);
}

export function getGanzhiIndex(stem, branch) {
  for (let index = 0; index < 60; index += 1) {
    if (stems[index % 10] === stem && branches[index % 12] === branch) return index;
  }
  return 0;
}

export function getSolarMonthContext(birth) {
  const localMs = getLocalBirthMs(birth);
  const boundaries = [birth.year - 1, birth.year, birth.year + 1]
    .flatMap((year) => monthBoundaryTerms.map((term) => getSolarTermBoundary(year, term.name)))
    .sort((left, right) => left.localMs - right.localMs);
  const currentIndex = Math.max(0, boundaries.findLastIndex((boundary) => localMs >= boundary.localMs));
  return {
    current: boundaries[currentIndex],
    next: boundaries[currentIndex + 1] ?? boundaries[currentIndex],
  };
}

export function formatBirthDate(birth) {
  return `${birth.year}-${String(birth.month).padStart(2, "0")}-${String(birth.day).padStart(2, "0")}`;
}

export function formatBirthTime(birth) {
  return `${String(birth.hour).padStart(2, "0")}:${String(birth.minute).padStart(2, "0")}`;
}

export function getLocalBirthMs(birth) {
  return Date.UTC(birth.year, birth.month - 1, birth.day, birth.hour ?? 0, birth.minute ?? 0);
}

export function formatLocalDateTime(boundary) {
  return `${boundary.localYear}-${String(boundary.localMonth).padStart(2, "0")}-${String(boundary.localDay).padStart(2, "0")} ${String(boundary.localHour).padStart(2, "0")}:${String(boundary.localMinute).padStart(2, "0")}`;
}

function resolveBirthLocation(birthplace, datasets) {
  const defaultLocation = {
    name: "北京",
    longitude: 116.4074,
    latitude: 39.9042,
    timezone: "Asia/Shanghai",
    standardMeridian: 120,
    source: "default",
  };
  const query = String(birthplace ?? "").trim();
  const cities = datasets?.locations?.cities?.length ? datasets.locations.cities : defaultLocations;
  if (!query) return defaultLocation;
  const matched = cities.find((city) => {
    const names = [city.name, ...(city.aliases ?? [])].filter(Boolean);
    return names.some((name) => query === name || query.includes(name) || name.includes(query));
  });
  return matched
    ? { ...defaultLocation, ...matched, source: "dataset" }
    : {
        name: query,
        longitude: null,
        latitude: null,
        timezone: defaultLocation.timezone,
        standardMeridian: defaultLocation.standardMeridian,
        source: "unmatched",
      };
}

function applyTrueSolarTime(rawBirth, location, enabled = false) {
  const applied = Boolean(enabled && hasUsableLocation(location));
  const correctionMinutes = applied ? calculateTrueSolarCorrection(rawBirth, location) : 0;
  const utc = Date.UTC(rawBirth.year, rawBirth.month - 1, rawBirth.day, rawBirth.hour, rawBirth.minute) + correctionMinutes * 60000;
  const adjusted = new Date(utc);
  return {
    year: adjusted.getUTCFullYear(),
    month: adjusted.getUTCMonth() + 1,
    day: adjusted.getUTCDate(),
    hour: adjusted.getUTCHours(),
    minute: adjusted.getUTCMinutes(),
    original: { ...rawBirth },
    calendar: rawBirth.calendar,
    trueSolarTime: {
      enabled: Boolean(enabled),
      applied,
      correctionMinutes: Math.round(correctionMinutes),
      longitudeCorrectionMinutes: applied ? Math.round((Number(location.longitude) - Number(location.standardMeridian ?? 120)) * 4) : 0,
      equationOfTimeMinutes: applied ? Math.round(calculateEquationOfTime(rawBirth)) : 0,
      note: enabled && !applied ? "出生地未匹配经纬度，未应用真太阳时校正。" : "",
      location,
    },
  };
}

function hasUsableLocation(location) {
  return location?.longitude !== null &&
    location?.longitude !== undefined &&
    location?.longitude !== "" &&
    Number.isFinite(Number(location.longitude)) &&
    Number.isFinite(Number(location.standardMeridian));
}

function calculateTrueSolarCorrection(birth, location) {
  const longitudeCorrection = (Number(location.longitude) - Number(location.standardMeridian ?? 120)) * 4;
  return longitudeCorrection + calculateEquationOfTime(birth);
}

function calculateEquationOfTime(birth) {
  const dayOfYear = getDayOfYear(birth);
  const b = (2 * Math.PI * (dayOfYear - 81)) / 364;
  return 9.87 * Math.sin(2 * b) - 7.53 * Math.cos(b) - 1.5 * Math.sin(b);
}

function getDayOfYear(birth) {
  const start = Date.UTC(birth.year, 0, 0);
  const current = Date.UTC(birth.year, birth.month - 1, birth.day);
  return Math.floor((current - start) / 86400000);
}

function adjustedSolarYear(birth) {
  const lichun = getSolarTermBoundary(birth.year, "立春");
  return getLocalBirthMs(birth) < lichun.localMs ? birth.year - 1 : birth.year;
}

function createDayPillar(birth, role) {
  const diffDays = gregorianToJdn(birth.year, birth.month, birth.day) -
    gregorianToJdn(dayPillarAnchor.year, dayPillarAnchor.month, dayPillarAnchor.day);
  return createPillarByIndex(diffDays + dayPillarAnchor.index, role, {
    method: `日柱以${formatBirthDate(dayPillarAnchor)}${dayPillarAnchor.label}为锚点，用Gregorian JDN推算。`,
    pillarDate: formatBirthDate(birth),
    lateZiApplied: Boolean(birth.lateZiApplied),
  });
}

function createHourPillar(hour, dayStem, role) {
  const branchIndex = hour === 23 ? 0 : Math.floor((hour + 1) / 2) % 12;
  const dayStemIndex = stems.indexOf(dayStem);
  const baseStemIndex = [0, 2, 4, 6, 8][dayStemIndex % 5];
  return makePillar(stems[(baseStemIndex + branchIndex) % 10], branches[branchIndex], role);
}

function makePillar(stem, branch, role, meta = {}) {
  return {
    stem,
    branch,
    label: `${stem}${branch}`,
    role,
    stemElement: stemElements[stem],
    branchElement: branchElements[branch],
    yinYang: stemYinYang[stem],
    meta,
  };
}

function getDayPillarBirth(birth) {
  if (birth.hour < 23) return { ...birth, lateZiApplied: false };
  const shifted = shiftBirthDate(birth, 1);
  return { ...shifted, hour: birth.hour, minute: birth.minute, lateZiApplied: true };
}

function shiftBirthDate(birth, days) {
  const shifted = new Date(Date.UTC(birth.year, birth.month - 1, birth.day + days, birth.hour ?? 0, birth.minute ?? 0));
  return {
    ...birth,
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth() + 1,
    day: shifted.getUTCDate(),
    hour: shifted.getUTCHours(),
    minute: shifted.getUTCMinutes(),
  };
}

function getSolarTermBoundary(year, name) {
  const term = monthBoundaryTerms.find((item) => item.name === name);
  if (!term) throw new Error(`Unsupported solar term: ${name}`);
  const cacheKey = `${year}-${name}`;
  if (solarTermCache.has(cacheKey)) return solarTermCache.get(cacheKey);
  const utcMs = findSolarTermUtcMs(year, term);
  const localMs = utcMs + localTimezoneOffsetMinutes * 60000;
  const local = new Date(localMs);
  const boundary = {
    ...term,
    year,
    localMs,
    localYear: local.getUTCFullYear(),
    localMonth: local.getUTCMonth() + 1,
    localDay: local.getUTCDate(),
    localHour: local.getUTCHours(),
    localMinute: local.getUTCMinutes(),
  };
  solarTermCache.set(cacheKey, boundary);
  return boundary;
}

function findSolarTermUtcMs(year, term) {
  let low = Date.UTC(year, term.month - 1, term.day, 4) - 5 * 86400000;
  let high = Date.UTC(year, term.month - 1, term.day, 4) + 5 * 86400000;
  while (hasReachedSolarLongitude(low, term.longitude)) low -= 86400000;
  while (!hasReachedSolarLongitude(high, term.longitude)) high += 86400000;
  for (let index = 0; index < 48; index += 1) {
    const mid = (low + high) / 2;
    if (hasReachedSolarLongitude(mid, term.longitude)) high = mid;
    else low = mid;
  }
  return high;
}

function hasReachedSolarLongitude(utcMs, longitude) {
  return normalizeDegrees(apparentSolarLongitude(utcMs) - longitude) < 180;
}

function apparentSolarLongitude(utcMs) {
  const jd = utcMs / 86400000 + 2440587.5;
  const t = (jd - 2451545.0) / 36525;
  const l0 = normalizeDegrees(280.46646 + 36000.76983 * t + 0.0003032 * t * t);
  const m = normalizeDegrees(357.52911 + 35999.05029 * t - 0.0001537 * t * t);
  const c = (1.914602 - 0.004817 * t - 0.000014 * t * t) * sinDeg(m) +
    (0.019993 - 0.000101 * t) * sinDeg(2 * m) +
    0.000289 * sinDeg(3 * m);
  const omega = 125.04 - 1934.136 * t;
  return normalizeDegrees(l0 + c - 0.00569 - 0.00478 * sinDeg(omega));
}

function gregorianToJdn(year, month, day) {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

function sinDeg(degrees) {
  return Math.sin(degrees * Math.PI / 180);
}

function normalizeDegrees(degrees) {
  return ((degrees % 360) + 360) % 360;
}
