import test from "node:test";
import assert from "node:assert/strict";
import {
  formatLunarDate,
  getLunarMonthOptions,
  lunarToSolar,
  solarToLunar,
} from "./lunarCalendar.js";

test("converts Gregorian dates to Chinese lunar dates", () => {
  assert.deepEqual(solarToLunar("1992-08-18"), {
    year: 1992,
    month: 7,
    day: 20,
    isLeapMonth: false,
  });
  assert.deepEqual(solarToLunar("2000-01-01"), {
    year: 1999,
    month: 11,
    day: 25,
    isLeapMonth: false,
  });
});

test("converts Chinese lunar dates to Gregorian dates", () => {
  assert.equal(lunarToSolar({ year: 1992, month: 7, day: 20 }), "1992-08-18");
  assert.equal(lunarToSolar({ year: 1999, month: 11, day: 25 }), "2000-01-01");
});

test("supports leap lunar months", () => {
  assert.deepEqual(solarToLunar("2012-05-21"), {
    year: 2012,
    month: 4,
    day: 1,
    isLeapMonth: true,
  });
  assert.equal(lunarToSolar({ year: 2012, month: 4, day: 1, isLeapMonth: true }), "2012-05-21");
  assert.deepEqual(
    getLunarMonthOptions(2012).filter((month) => month.value === 4),
    [
      { value: 4, label: "四月", isLeapMonth: false, days: 30 },
      { value: 4, label: "闰四月", isLeapMonth: true, days: 29 },
    ],
  );
});

test("formats lunar dates for chart display", () => {
  assert.equal(formatLunarDate({ year: 1992, month: 7, day: 20 }), "农历壬申年七月二十");
  assert.equal(formatLunarDate({ year: 2012, month: 4, day: 1, isLeapMonth: true }), "农历壬辰年闰四月初一");
});
