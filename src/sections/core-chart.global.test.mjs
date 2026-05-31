import assert from "node:assert/strict";
import fs from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

test("renders core chart details with readable hierarchy and low-priority calendar tab", async () => {
  const context = {
    window: {
      BaziShared: {
        escapeHtml(value) {
          return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
        },
      },
      BaziSections: {},
    },
  };
  vm.createContext(context);
  vm.runInContext(await fs.readFile(new URL("./core-chart.global.js", import.meta.url), "utf8"), context);

  const chartEl = {
    innerHTML: "",
    querySelectorAll() {
      return [];
    },
  };

  context.window.BaziSections.renderCoreChart({
    state: { reading: { natal: { basicBaziDisplay: buildDisplay() } } },
    el: { chart: chartEl },
  });

  const html = chartEl.innerHTML;
  const tabIds = ["elements", "hidden", "voids", "relations", "expert", "calendar"];
  const renderedTabs = [...html.matchAll(/<button[^>]+data-core-tab="([^"]+)"/g)].map((match) => match[1]);
  assert.deepEqual(renderedTabs, tabIds, "tabs should be ordered by reading priority");
  assert.match(html, /hidden-chip is-main/);
  assert.match(html, /hidden-chip is-middle/);
  assert.match(html, /element-card element-wood/);
  assert.match(html, /element-bar/);
  assert.equal([...html.matchAll(/class="bazi-symbol /g)].length, 8, "eight bazi symbols should render with visual element classes");
  assert.match(html, /bazi-symbol element-earth polarity-yang/);
  assert.match(html, /bazi-symbol element-metal polarity-yin/);
  assert.match(html, /bazi-symbol element-water polarity-yang/);
  assert.match(html, /data-element-label="阳土"/);
  assert.doesNotMatch(html, /element-badge/);
  assert.match(html, /relation-group/);
});

function buildDisplay() {
  const pillars = {
    year: buildPillar("year", "年柱", "戊寅", "戊", "寅", "正印", "正财", [
      { stem: "甲", tenGod: "正财", role: "主气", elementLabel: "阳木" },
      { stem: "丙", tenGod: "正官", role: "中气", elementLabel: "阳火" },
      { stem: "戊", tenGod: "正印", role: "余气", elementLabel: "阳土" },
    ]),
    month: buildPillar("month", "月柱", "辛酉", "辛", "酉", "比肩", "比肩", [
      { stem: "辛", tenGod: "比肩", role: "主气", elementLabel: "阴金" },
    ]),
    day: buildPillar("day", "日柱", "辛酉", "辛", "酉", "日主", "比肩", [
      { stem: "辛", tenGod: "比肩", role: "主气", elementLabel: "阴金" },
    ]),
    hour: buildPillar("hour", "时柱", "戊子", "戊", "子", "正印", "食神", [
      { stem: "癸", tenGod: "食神", role: "主气", elementLabel: "阴水" },
    ]),
  };
  return {
    pillars,
    tenGods: {
      stats: {
        fullHidden: { 比肩: 2, 正财: 1, 正官: 1, 正印: 1, 食神: 1 },
        mainQi: { 比肩: 2, 正财: 1, 食神: 1 },
      },
      notes: { fullHidden: "按完整藏干统计", mainQi: "按地支主气统计" },
    },
    elementStats: {
      visible: { label: "明面五行", note: "四个天干 + 四个地支本气", counts: { wood: 1, fire: 0, earth: 2, metal: 4, water: 1 } },
      hidden: { label: "藏干五行", note: "按完整藏干逐个统计，不按权重折算", counts: { wood: 1, fire: 1, earth: 1, metal: 2, water: 1 } },
    },
    voids: {
      day: { pillar: "辛酉", xun: "甲寅旬", branches: ["子", "丑"] },
      byPillar: {
        year: { xun: "甲戌旬", branches: ["申", "酉"] },
        month: { xun: "甲寅旬", branches: ["子", "丑"] },
        day: { xun: "甲寅旬", branches: ["子", "丑"] },
        hour: { xun: "甲申旬", branches: ["午", "未"] },
      },
    },
    calendar: {
      inputCalendarType: "公历",
      originalDate: "1998-09-11",
      originalTime: "00:30",
      birthplace: "北京",
      longitude: 116.4074,
      latitude: 39.9042,
      timezone: "Asia/Shanghai",
      standardMeridian: 120,
      trueSolarTime: { enabled: false, applied: false, longitudeCorrectionMinutes: 0, equationOfTimeMinutes: "未计算" },
      finalDate: "1998-09-11",
      finalTime: "00:30",
      finalHourBranch: "子时",
      solarTermRule: "月柱采用节气排月",
      solarTermRange: "白露之后、寒露之前",
    },
    fetalPalaces: { note: "当前为近似算法，仅作基础展示，不参与核心判断。" },
    relations: [{ type: "地支六破", pillars: ["月柱", "时柱"], ganzhi: ["辛酉", "戊子"], members: ["酉", "子"] }],
    twelveGrowth: { note: "十二长生按日主天干推算" },
  };
}

function buildPillar(key, label, ganzhi, stem, branch, stemTenGod, branchMainTenGod, hiddenStems) {
  return {
    key,
    label,
    ganzhi,
    stem,
    branch,
    stemTenGod,
    branchMainTenGod,
    stemElementLabel: stem === "戊" ? "阳土" : "阴金",
    branchElementLabel: branch === "寅" ? "阳木" : branch === "子" ? "阳水" : "阴金",
    stemElement: stem === "戊" ? "earth" : "metal",
    branchElement: branch === "寅" ? "wood" : branch === "子" ? "water" : "metal",
    hiddenStems,
    nayin: "待查",
    twelveGrowth: "待查",
  };
}
