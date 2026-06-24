import test from "node:test";
import assert from "node:assert/strict";

import {
  buildTransitDomainSignals,
  TRANSIT_DOMAIN_DEFINITIONS,
} from "../js/core/transit/buildTransitDomainSignals.js";

const maleBaseViewModel = {
  birthInfo: { gender: "male" },
  pillars: [
    { key: "year", stem: "戊", branch: "寅" },
    { key: "month", stem: "辛", branch: "酉" },
    { key: "day", stem: "辛", branch: "酉" },
    { key: "hour", stem: "戊", branch: "子" },
  ],
};

const maleChart = {
  input: { gender: "male" },
  dayMaster: { stem: "辛" },
  pillars: {
    year: { stem: "戊", branch: "寅" },
    month: { stem: "辛", branch: "酉" },
    day: { stem: "辛", branch: "酉" },
    hour: { stem: "戊", branch: "子" },
  },
};

const yearItem = {
  year: 2026,
  ganZhi: "丙午",
  stem: "丙",
  branch: "午",
  stemTenGod: "正官",
  branchTenGod: "七杀",
};

const luckItem = {
  ganZhi: "癸亥",
  stem: "癸",
  branch: "亥",
  tenGod: "食神",
  branchTenGod: "伤官",
};

const structureAnalysis = {
  facts: [
    {
      id: "year:2026:chong:hour",
      label: "冲",
      text: "流年午与时柱子冲。",
      category: "direct",
      status: "direct",
      source: "流年触发原局",
      polarity: "pressure",
      strength: 3.2,
      domains: ["execution", "result"],
    },
  ],
};

test("岁运领域扫描固定覆盖十二个领域", () => {
  const result = buildTransitDomainSignals({
    stage: "year",
    chart: maleChart,
    baseBaziViewModel: maleBaseViewModel,
    item: yearItem,
    currentLuckItem: luckItem,
    structureAnalysis,
  });

  assert.equal(
    result.domains.length,
    TRANSIT_DOMAIN_DEFINITIONS.length,
  );
  assert.equal(result.checkedDomainCount, 12);
  assert.deepEqual(
    result.domains.map((entry) => entry.domain),
    TRANSIT_DOMAIN_DEFINITIONS.map((entry) => entry.key),
  );
});

test("男命2026午年能识别日支桃花和大运藏干配偶星", () => {
  const result = buildTransitDomainSignals({
    stage: "year",
    chart: maleChart,
    baseBaziViewModel: maleBaseViewModel,
    item: yearItem,
    currentLuckItem: luckItem,
    structureAnalysis,
  });

  const relationship = result.domains.find(
    (entry) => entry.domain === "relationship",
  );

  assert.ok(relationship.score >= 25);
  assert.ok(
    relationship.auxiliarySignals.some(
      (item) => item.source === "日支桃花",
    ),
  );
  assert.ok(
    relationship.hiddenStemSignals.some(
      (item) => item.text.includes("正财"),
    ),
  );
  assert.ok(
    result.primaryDomains.some(
      (item) => item.domain === "relationship",
    ) ||
      result.secondaryDomains.some(
        (item) => item.domain === "relationship",
      ),
  );
});

test("冲动时把迁移、身心与精神列为独立领域，而非直接断具体事件", () => {
  const result = buildTransitDomainSignals({
    stage: "year",
    chart: maleChart,
    baseBaziViewModel: maleBaseViewModel,
    item: yearItem,
    currentLuckItem: luckItem,
    structureAnalysis,
  });

  const migration = result.domains.find(
    (entry) => entry.domain === "migration",
  );
  const health = result.domains.find(
    (entry) => entry.domain === "health",
  );
  const mental = result.domains.find(
    (entry) => entry.domain === "mental",
  );

  assert.ok(migration.score > 0);
  assert.ok(health.score > 0);
  assert.ok(mental.score > 0);
  assert.match(migration.summary, /不能只凭冲动直接断搬迁/);
  assert.ok(
    result.boundaries.some(
      (item) => item.includes("不判断具体器官或疾病"),
    ),
  );
});

test("女命官杀会进入感情领域，但不会直接生成婚期结论", () => {
  const femaleViewModel = {
    ...maleBaseViewModel,
    birthInfo: { gender: "female" },
  };
  const femaleChart = {
    ...maleChart,
    input: { gender: "female" },
  };

  const result = buildTransitDomainSignals({
    stage: "year",
    chart: femaleChart,
    baseBaziViewModel: femaleViewModel,
    item: yearItem,
    currentLuckItem: null,
    structureAnalysis: { facts: [] },
  });

  const relationship = result.domains.find(
    (entry) => entry.domain === "relationship",
  );

  assert.ok(
    relationship.directFacts.some(
      (item) => item.type === "spouse_star",
    ),
  );
  assert.equal(
    JSON.stringify(result).includes("必然结婚"),
    false,
  );
});

test("无直接信号的领域仍保留已扫描状态", () => {
  const result = buildTransitDomainSignals({
    stage: "year",
    chart: {
      input: { gender: "unknown" },
      dayMaster: { stem: "甲" },
      pillars: {
        year: { stem: "甲", branch: "申" },
        day: { stem: "甲", branch: "寅" },
      },
    },
    baseBaziViewModel: {
      birthInfo: { gender: "unknown" },
      pillars: [
        { key: "year", stem: "甲", branch: "申" },
        { key: "day", stem: "甲", branch: "寅" },
      ],
    },
    item: {
      ganZhi: "甲子",
      stem: "甲",
      branch: "子",
      stemTenGod: "比肩",
      branchTenGod: "正印",
    },
    structureAnalysis: { facts: [] },
  });

  const quiet = result.domains.filter(
    (entry) => entry.status === "checked_no_direct_signal",
  );

  assert.ok(quiet.length > 0);
  assert.ok(
    quiet.every((entry) => entry.role === "quiet"),
  );
});
