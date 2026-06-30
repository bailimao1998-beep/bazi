import test from "node:test";
import assert from "node:assert/strict";

import { buildRelationMatrix } from "../../js/domain/natal/featureBuilders/buildRelationMatrix.js";

const pillars = {
  year: { key: "year", stem: "甲", branch: "子", label: "甲子" },
  month: { key: "month", stem: "乙", branch: "午", label: "乙午" },
  day: { key: "day", stem: "庚", branch: "子", label: "庚子" },
  hour: { key: "hour", stem: "辛", branch: "酉", label: "辛酉" },
};

test("month branch clash with day branch affects spouse palace only through day branch", () => {
  const matrix = buildRelationMatrix({
    pillars,
    relations: [
      {
        type: "地支六冲",
        members: ["子", "午"],
        pillars: ["月柱", "日柱"],
        ganzhi: ["乙午", "庚子"],
        evidence: "月柱乙午 与 日柱庚子：见子午地支六冲。",
      },
    ],
  });

  assert.equal(matrix.items.length, 1);
  assert.equal(matrix.items[0].relationType, "branch_clash");
  assert.equal(matrix.items[0].affects.dayBranch, true);
  assert.equal(matrix.items[0].affects.spousePalace, true);
  assert.equal(matrix.items[0].affects.dayStem, false);
  assert.equal(matrix.byPillarPair["month-day"].length, 1);
  assert.equal(matrix.dayBranchRelations.length, 1);
});

test("month stem combine with day stem does not affect day branch or spouse palace", () => {
  const matrix = buildRelationMatrix({
    pillars,
    relations: [
      {
        type: "天干五合",
        members: ["乙", "庚"],
        pillars: ["月柱", "日柱"],
        ganzhi: ["乙午", "庚子"],
        evidence: "月柱乙午 与 日柱庚子：见乙庚天干五合。",
      },
    ],
  });

  assert.equal(matrix.items[0].relationType, "stem_combine");
  assert.equal(matrix.items[0].affects.dayStem, true);
  assert.equal(matrix.items[0].affects.dayBranch, false);
  assert.equal(matrix.items[0].affects.spousePalace, false);
  assert.equal(matrix.dayStemRelations.length, 1);
  assert.equal(matrix.dayBranchRelations.length, 0);
});

test("year and hour branch relation uses ordered pillar-pair key", () => {
  const matrix = buildRelationMatrix({
    pillars,
    relations: [
      {
        type: "地支六破",
        members: ["子", "酉"],
        pillars: ["时柱", "年柱"],
        ganzhi: ["辛酉", "甲子"],
      },
    ],
  });

  assert.equal(matrix.items[0].left.pillar, "hour");
  assert.equal(matrix.items[0].right.pillar, "year");
  assert.equal(matrix.byPillarPair["year-hour"].length, 1);
});

test("unknown relation is retained with low confidence and warnings", () => {
  const matrix = buildRelationMatrix({
    pillars,
    relations: [
      { name: "待复核关系", evidence: "无法结构化的原始文本" },
    ],
  });

  assert.equal(matrix.items[0].relationType, "unknown");
  assert.equal(matrix.items[0].confidence, "low");
  assert.ok(matrix.items[0].warnings.length > 0);
});

test("relation indexes do not duplicate repeated raw relations", () => {
  const relation = {
    type: "地支六冲",
    members: ["子", "午"],
    pillars: ["月柱", "日柱"],
    ganzhi: ["乙午", "庚子"],
  };
  const matrix = buildRelationMatrix({
    pillars,
    relations: [relation, relation],
  });

  assert.equal(matrix.items.length, 1);
  assert.equal(matrix.byRelationType.branch_clash.length, 1);
  assert.equal(new Set(matrix.dayBranchRelations.map((item) => item.id)).size, 1);
});

test("three harmony includes every participant and marks day branch as spouse palace even when third", () => {
  const triplePillars = {
    year: { key: "year", stem: "甲", branch: "申", label: "甲申" },
    month: { key: "month", stem: "丙", branch: "子", label: "丙子" },
    day: { key: "day", stem: "戊", branch: "辰", label: "戊辰" },
    hour: { key: "hour", stem: "庚", branch: "午", label: "庚午" },
  };
  const matrix = buildRelationMatrix({
    pillars: triplePillars,
    relations: [
      {
        type: "地支三合",
        members: ["申", "子", "辰"],
        pillars: ["年柱", "月柱", "日柱"],
        ganzhi: ["甲申", "丙子", "戊辰"],
      },
    ],
  });

  assert.equal(matrix.items[0].relationType, "three_harmony");
  assert.equal(matrix.items[0].participants.length, 3);
  assert.equal(matrix.items[0].left.pillar, "year");
  assert.equal(matrix.items[0].right.pillar, "month");
  assert.equal(matrix.items[0].affects.dayBranch, true);
  assert.equal(matrix.items[0].affects.spousePalace, true);
  assert.deepEqual(Object.keys(matrix.byPillarPair).sort(), ["month-day", "year-day", "year-month"]);
  assert.equal(matrix.byPillarPair["year-month"].length, 1);
  assert.equal(matrix.byPillarPair["year-day"].length, 1);
  assert.equal(matrix.byPillarPair["month-day"].length, 1);
});

test("stem control records direction and never marks spouse palace", () => {
  const matrix = buildRelationMatrix({
    pillars: {
      year: { key: "year", stem: "甲", branch: "子", label: "甲子" },
      month: { key: "month", stem: "己", branch: "丑", label: "己丑" },
      day: { key: "day", stem: "庚", branch: "寅", label: "庚寅" },
      hour: { key: "hour", stem: "辛", branch: "卯", label: "辛卯" },
    },
    relations: [
      {
        type: "天干克",
        members: ["甲", "己"],
        pillars: ["年柱", "月柱"],
        ganzhi: ["甲子", "己丑"],
      },
    ],
  });

  const relation = matrix.items[0];
  assert.equal(relation.relationType, "stem_control");
  assert.deepEqual(relation.direction.controller, { pillar: "year", position: "stem", value: "甲" });
  assert.deepEqual(relation.direction.controlled, { pillar: "month", position: "stem", value: "己" });
  assert.equal(relation.affects.spousePalace, false);
});

test("stem clash stays separate from stem control", () => {
  const matrix = buildRelationMatrix({
    pillars,
    relations: [
      {
        type: "天干相冲",
        members: ["甲", "庚"],
        pillars: ["年柱", "日柱"],
        ganzhi: ["甲子", "庚子"],
      },
    ],
  });

  assert.equal(matrix.items[0].relationType, "stem_clash");
  assert.equal(matrix.items[0].direction, null);
});

test("branch control wording is not modeled as stem control in phase 1", () => {
  const matrix = buildRelationMatrix({
    pillars,
    relations: [
      {
        type: "地支相克",
        members: ["卯", "酉"],
        pillars: ["月柱", "日柱"],
      },
    ],
  });

  const relation = matrix.items[0];
  assert.equal(relation.relationType, "unknown");
  assert.equal(relation.confidence, "low");
  assert.ok(relation.warnings.includes("branch control relation is not modeled in natal-feature-v2 phase 1"));
});

test("unknown relation is forced to low confidence even when upstream says high", () => {
  const matrix = buildRelationMatrix({
    pillars,
    relations: [
      {
        name: "无法识别的关系",
        confidence: "high",
      },
    ],
  });

  assert.equal(matrix.items[0].relationType, "unknown");
  assert.equal(matrix.items[0].confidence, "low");
});

test("stem control with unresolved direction is forced to low confidence", () => {
  const matrix = buildRelationMatrix({
    pillars: {
      year: { key: "year", stem: "甲", branch: "子", label: "甲子" },
      month: { key: "month", stem: "乙", branch: "丑", label: "乙丑" },
      day: { key: "day", stem: "庚", branch: "寅", label: "庚寅" },
      hour: { key: "hour", stem: "辛", branch: "卯", label: "辛卯" },
    },
    relations: [
      {
        type: "天干克",
        members: ["甲", "乙"],
        pillars: ["年柱", "月柱"],
        ganzhi: ["甲子", "乙丑"],
        confidence: "high",
      },
    ],
  });

  const relation = matrix.items[0];
  assert.equal(relation.relationType, "stem_control");
  assert.equal(relation.direction, null);
  assert.equal(relation.confidence, "low");
  assert.ok(relation.warnings.includes("stem control direction could not be determined"));
});

test("day pillar repetition affects both day stem day branch and spouse palace", () => {
  const matrix = buildRelationMatrix({
    pillars,
    relations: [
      {
        type: "伏吟",
        pillars: ["年柱", "日柱"],
        ganzhi: ["甲子", "庚子"],
      },
    ],
  });

  const relation = matrix.items[0];
  assert.equal(relation.relationType, "repetition");
  assert.equal(relation.layer, "pillar");
  assert.equal(relation.left.position, "pillar");
  assert.equal(relation.affects.dayStem, true);
  assert.equal(relation.affects.dayBranch, true);
  assert.equal(relation.affects.spousePalace, true);
  assert.equal(matrix.dayStemRelations.length, 1);
  assert.equal(matrix.dayBranchRelations.length, 1);
});

test("month pillar repetition affects both month stem and month branch", () => {
  const matrix = buildRelationMatrix({
    pillars,
    relations: [
      {
        type: "伏吟",
        pillars: ["月柱", "时柱"],
        ganzhi: ["乙午", "辛酉"],
      },
    ],
  });

  const relation = matrix.items[0];
  assert.equal(relation.relationType, "repetition");
  assert.equal(relation.affects.monthStem, true);
  assert.equal(relation.affects.monthBranch, true);
  assert.equal(matrix.monthStemRelations.length, 1);
  assert.equal(matrix.monthBranchRelations.length, 1);
});
