const minYear = 1900;
const maxYear = 2100;
const dayMs = 86400000;
const stems = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const branches = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
const monthLabels = ["正月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "腊月"];
const dayPrefixes = ["初", "十", "廿", "三"];
const dayDigits = ["", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];

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
  return {
    year: Number(parts.relatedYear),
    month: monthNumberFromLabel(monthLabel),
    day: Number(parts.day),
    isLeapMonth,
  };
}

export function lunarToSolar({ year, month, day, isLeapMonth = false }) {
  assertSupportedYear(Number(year));
  const target = { year: Number(year), month: Number(month), day: Number(day), isLeapMonth: Boolean(isLeapMonth) };
  const start = Date.UTC(target.year, 0, 1);
  const end = Date.UTC(target.year + 1, 2, 1);
  for (let value = start; value <= end; value += dayMs) {
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
  for (let value = start; value <= end; value += dayMs) {
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
      label: `${lunar.isLeapMonth ? "闰" : ""}${monthLabels[lunar.month - 1]}`,
      isLeapMonth: lunar.isLeapMonth,
      days: lunar.day,
    });
  }
  return months.map(({ key, ...month }) => month);
}

export function formatLunarDate(lunarDate) {
  return `农历${getGanzhiYear(lunarDate.year)}年${lunarDate.isLeapMonth ? "闰" : ""}${monthLabels[lunarDate.month - 1]}${formatLunarDay(lunarDate.day)}`;
}

export function formatLunarDay(day) {
  if (day === 10) return "初十";
  if (day === 20) return "二十";
  if (day === 30) return "三十";
  return `${dayPrefixes[Math.floor(day / 10)]}${dayDigits[day % 10]}`;
}

export function formatSolarDateFromParts({ year, month, day }) {
  const normalizedDay = Math.min(Number(day), getSolarDayCount(year, month));
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, normalizedDay));
  if (date.getUTCFullYear() !== Number(year) || date.getUTCMonth() + 1 !== Number(month)) {
    throw new RangeError("公历日期不存在，请检查年月日。");
  }
  return formatSolarDate(date);
}

export function getSolarDayCount(year, month) {
  return new Date(Date.UTC(Number(year), Number(month), 0)).getUTCDate();
}

export function parseSolarDateParts(dateText) {
  const [year, month, day] = String(dateText).split("-").map(Number);
  return { year, month, day };
}

function parseSolarDate(dateText) {
  const [year, month, day] = String(dateText).split("-").map(Number);
  assertSupportedYear(year);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() + 1 !== month || date.getUTCDate() !== day) {
    throw new RangeError("公历日期不存在，请检查年月日。");
  }
  return date;
}

function monthNumberFromLabel(label) {
  const month = monthLabels.indexOf(label) + 1;
  if (!month) throw new RangeError(`无法识别农历月份：${label}`);
  return month;
}

function formatSolarDate(date) {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
}

function assertSupportedYear(year) {
  if (!Number.isInteger(Number(year)) || Number(year) < minYear || Number(year) > maxYear) {
    throw new RangeError(`农历转换仅支持 ${minYear}-${maxYear} 年。`);
  }
}

function getGanzhiYear(year) {
  const index = ((year - 1984) % 60 + 60) % 60;
  return `${stems[index % 10]}${branches[index % 12]}`;
}
