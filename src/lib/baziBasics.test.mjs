import test from "node:test";
import assert from "node:assert/strict";
import {
  getBasicBaziDisplay,
  getElementStats,
  getHiddenStems,
  getKongWang,
  getNaYin,
  getTenGod,
  getTwelveGrowth,
} from "./baziBasics.js";

test("returns fixed hidden stems with normalized roles, elements, and polarity", () => {
  assert.deepEqual(
    getHiddenStems("丑").map(({ stem, role, element, yinYang, weight }) => ({ stem, role, element, yinYang, weight })),
    [
      { stem: "己", role: "主气", element: "earth", yinYang: "yin", weight: 100 },
      { stem: "癸", role: "中气", element: "water", yinYang: "yin", weight: 0 },
      { stem: "辛", role: "余气", element: "metal", yinYang: "yin", weight: 0 },
    ],
  );
  assert.deepEqual(
    getHiddenStems("亥").map(({ stem, role }) => ({ stem, role })),
    [
      { stem: "壬", role: "主气" },
      { stem: "甲", role: "余气" },
    ],
  );
});

test("derives the fixed ten-god matrix from the day stem", () => {
  const expectedForJia = {
    甲: "比肩",
    乙: "劫财",
    丙: "食神",
    丁: "伤官",
    戊: "偏财",
    己: "正财",
    庚: "七杀",
    辛: "正官",
    壬: "偏印",
    癸: "正印",
  };

  assert.deepEqual(
    Object.fromEntries(Object.keys(expectedForJia).map((stem) => [stem, getTenGod("甲", stem)])),
    expectedForJia,
  );
  assert.equal(getTenGod("戊", "丁"), "正印");
  assert.equal(getTenGod("辛", "甲"), "正财");
});

test("counts visible and hidden five-elements from fixed pillar rules", () => {
  const pillars = {
    year: { stem: "戊", branch: "寅", label: "戊寅" },
    month: { stem: "辛", branch: "酉", label: "辛酉" },
    day: { stem: "辛", branch: "酉", label: "辛酉" },
    hour: { stem: "戊", branch: "子", label: "戊子" },
  };

  assert.deepEqual(getElementStats(pillars, "visible").counts, {
    wood: 1,
    fire: 0,
    earth: 2,
    metal: 4,
    water: 1,
  });
  assert.deepEqual(getElementStats(pillars, "hidden").counts, {
    wood: 1,
    fire: 1,
    earth: 1,
    metal: 2,
    water: 1,
  });
});

test("returns fixed twelve-growth, void-branch, and nayin values", () => {
  assert.equal(getTwelveGrowth("甲", "亥"), "长生");
  assert.equal(getTwelveGrowth("辛", "子"), "长生");
  assert.deepEqual(getKongWang("甲子"), {
    pillar: "甲子",
    xun: "甲子旬",
    branches: ["戌", "亥"],
  });
  assert.deepEqual(getKongWang("辛酉"), {
    pillar: "辛酉",
    xun: "甲寅旬",
    branches: ["子", "丑"],
  });
  assert.equal(getNaYin("甲子"), "海中金");
  assert.equal(getNaYin("癸亥"), "大海水");
});

test("builds basic bazi display from fixed rule outputs without adding interpretations", () => {
  const pillars = {
    year: { stem: "戊", branch: "寅", label: "戊寅" },
    month: { stem: "辛", branch: "酉", label: "辛酉" },
    day: { stem: "辛", branch: "酉", label: "辛酉" },
    hour: { stem: "戊", branch: "子", label: "戊子" },
  };

  const display = getBasicBaziDisplay({
    input: { calendarType: "solar" },
    birth: { year: 1998, month: 9, day: 11, hour: 0, minute: 30 },
    pillars,
  });

  assert.equal(display.pillars.day.stemTenGod, "日主");
  assert.equal(display.pillars.year.hiddenStems[0].tenGod, "正财");
  assert.equal(display.pillars.month.nayin, "石榴木");
  assert.equal(display.twelveGrowth.byPillar.hour, "长生");
  assert.deepEqual(display.voids.day.branches, ["子", "丑"]);
  assert.ok(display.relations.every((relation) => !relation.description && !relation.interpretation));
});
