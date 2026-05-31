const MIN_YEAR = 1900;
const MAX_YEAR = 2100;
const DAY_MS = 86400000;
const STEMS = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const BRANCHES = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
const MONTH_LABELS = ["正月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "腊月"];
const DAY_PREFIXES = ["初", "十", "廿", "三"];
const DAY_DIGITS = ["", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];

const lunarFormatter = new Intl.DateTimeFormat("zh-u-ca-chinese", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});

export function solarToLunar(dateText) {
  const date = parseSolarDate(dateText);
  const parts = Object.fromEntries(lunarFormatter.formatToParts(date).map((part) => [part.type, part.value]));
  const rawMonth = parts.month ?? "";
  const isLeapMonth = rawMonth.startsWith("闰");
  const monthLabel = isLeapMonth ? rawMonth.slice(1) : rawMonth;
  const lunar = {
    year: Number(parts.relatedYear),
    month: monthNumberFromLabel(monthLabel),
    day: Number(parts.day),
    isLeapMonth,
  };
  assertSupportedYear(lunar.year);
  return lunar;
}

export function lunarToSolar({ year, month, day, isLeapMonth = false }) {
  assertSupportedYear(year);
  const target = normalizeLunarInput({ year, month, day, isLeapMonth });
  const start = Date.UTC(year, 0, 1);
  const end = Date.UTC(year + 1, 2, 1);
  for (let value = start; value <= end; value += DAY_MS) {
    const solarDate = formatSolarDate(new Date(value));
    const lunar = solarToLunar(solarDate);
    if (
      lunar.year === target.year &&
      lunar.month === target.month &&
      lunar.day === target.day &&
      lunar.isLeapMonth === target.isLeapMonth
    ) {
      return solarDate;
    }
  }
  throw new RangeError("农历日期不存在，请检查年份、月份、日期和闰月。");
}

export function getLunarMonthOptions(year) {
  assertSupportedYear(Number(year));
  const months = [];
  const seen = new Set();
  const start = Date.UTC(Number(year), 0, 1);
  const end = Date.UTC(Number(year) + 1, 2, 1);
  for (let value = start; value <= end; value += DAY_MS) {
    const lunar = solarToLunar(formatSolarDate(new Date(value)));
    if (lunar.year !== Number(year)) continue;
    const key = `${lunar.month}-${lunar.isLeapMonth}`;
    const existing = months.find((item) => item.key === key);
    if (existing) {
      existing.days = Math.max(existing.days, lunar.day);
      continue;
    }
    if (seen.has(key)) continue;
    seen.add(key);
    months.push({
      key,
      value: lunar.month,
      label: `${lunar.isLeapMonth ? "闰" : ""}${MONTH_LABELS[lunar.month - 1]}`,
      isLeapMonth: lunar.isLeapMonth,
      days: lunar.day,
    });
  }
  return months.map(({ key, ...month }) => month);
}

export function formatLunarDate(lunarDate) {
  const lunar = normalizeLunarInput(lunarDate);
  return `农历${getGanzhiYear(lunar.year)}年${lunar.isLeapMonth ? "闰" : ""}${MONTH_LABELS[lunar.month - 1]}${formatLunarDay(lunar.day)}`;
}

export function getSupportedLunarRange() {
  return { minYear: MIN_YEAR, maxYear: MAX_YEAR };
}

function parseSolarDate(dateText) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(dateText));
  if (!match) throw new TypeError("公历日期必须使用 YYYY-MM-DD 格式。");
  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  assertSupportedYear(year);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() + 1 !== month || date.getUTCDate() !== day) {
    throw new RangeError("公历日期不存在，请检查年月日。");
  }
  return date;
}

function normalizeLunarInput({ year, month, day, isLeapMonth = false }) {
  const lunar = {
    year: Number(year),
    month: Number(month),
    day: Number(day),
    isLeapMonth: Boolean(isLeapMonth),
  };
  assertSupportedYear(lunar.year);
  if (!Number.isInteger(lunar.month) || lunar.month < 1 || lunar.month > 12) throw new RangeError("农历月份必须在 1-12 之间。");
  if (!Number.isInteger(lunar.day) || lunar.day < 1 || lunar.day > 30) throw new RangeError("农历日期必须在 1-30 之间。");
  return lunar;
}

function monthNumberFromLabel(label) {
  const month = MONTH_LABELS.indexOf(label) + 1;
  if (!month) throw new RangeError(`无法识别农历月份：${label}`);
  return month;
}

function formatSolarDate(date) {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
}

function assertSupportedYear(year) {
  if (!Number.isInteger(Number(year)) || Number(year) < MIN_YEAR || Number(year) > MAX_YEAR) {
    throw new RangeError(`农历转换仅支持 ${MIN_YEAR}-${MAX_YEAR} 年。`);
  }
}

function getGanzhiYear(year) {
  const index = ((year - 1984) % 60 + 60) % 60;
  return `${STEMS[index % 10]}${BRANCHES[index % 12]}`;
}

function formatLunarDay(day) {
  if (day === 10) return "初十";
  if (day === 20) return "二十";
  if (day === 30) return "三十";
  return `${DAY_PREFIXES[Math.floor(day / 10)]}${DAY_DIGITS[day % 10]}`;
}
