import test from "node:test";
import assert from "node:assert/strict";

import {
  sanitizeStageAiText,
} from "../js/core/ai/sanitizeStageAiText.js";

function pack() {
  return {
    factualContext: {
      natal: {
        pillars: [
          {
            key: "year",
            stem: "戊",
            branch: "寅",
            ganZhi: "戊寅",
            stemTenGod: "正印",
            hiddenStems: [
              { stem: "戊", tenGod: "正印" },
            ],
          },
          {
            key: "month",
            stem: "辛",
            branch: "酉",
            ganZhi: "辛酉",
            stemTenGod: "比肩",
            hiddenStems: [],
          },
          {
            key: "day",
            stem: "辛",
            branch: "酉",
            ganZhi: "辛酉",
            stemTenGod: "日主",
            hiddenStems: [],
          },
          {
            key: "hour",
            stem: "戊",
            branch: "子",
            ganZhi: "戊子",
            stemTenGod: "正印",
            hiddenStems: [],
          },
        ],
      },
    },
    mechanicalSignals: {
      layers: {
        luck: {
          stem: "癸",
          stemTenGod: "食神",
          hiddenStems: [
            { stem: "壬", tenGod: "伤官" },
          ],
          natalComparisons: [],
        },
        year: {
          stem: "丙",
          stemTenGod: "正官",
          hiddenStems: [],
          natalComparisons: [],
        },
        month: {
          stem: "庚",
          stemTenGod: "劫财",
          hiddenStems: [],
          natalComparisons: [
            {
              targetPillar: "year",
              sameBranch: true,
              samePillar: false,
            },
          ],
        },
      },
    },
    relationFacts: [
      {
        meta: {
          controller: "丙",
          controlled: "庚",
        },
      },
      {
        meta: {
          controller: "癸",
          controlled: "丙",
        },
      },
    ],
  };
}

test("纠正丙庚生克方向", () => {
  const result = sanitizeStageAiText({
    text:
      "流月庚金劫财克流年丙火正官，形成庚克丙。",
    stage: "month",
    trustedPack: pack(),
  });

  assert.doesNotMatch(
    result.text,
    /庚克丙|劫财克[^。；]*正官/,
  );

  assert.match(
    result.text,
    /丙克庚|正官制约劫财/,
  );
});

test("纠正正官双透", () => {
  const result = sanitizeStageAiText({
    text:
      "2026年正官双透，规则压力明显。",
    stage: "year",
    trustedPack: pack(),
  });

  assert.doesNotMatch(result.text, /正官双透/);
  assert.match(result.text, /正官透出/);
});

test("纠正食伤齐透为透干藏支", () => {
  const result = sanitizeStageAiText({
    text:
      "大运食伤齐透，输出力量增强。",
    stage: "luck",
    trustedPack: pack(),
  });

  assert.doesNotMatch(result.text, /食伤齐透/);
  assert.match(result.text, /食神透出，伤官藏支/);
});

test("纠正同支误写伏吟", () => {
  const result = sanitizeStageAiText({
    text:
      "流月庚寅与年柱伏吟，事情重复出现。",
    stage: "month",
    trustedPack: pack(),
  });

  assert.doesNotMatch(result.text, /伏吟/);
  assert.match(result.text, /同支重复/);
});

test("降级无依据时间节点", () => {
  const year = sanitizeStageAiText({
    text:
      "年初受阻，年中调整，年底完成。",
    stage: "year",
    trustedPack: pack(),
  });

  assert.doesNotMatch(year.text, /年初|年中|年底/);

  const month = sanitizeStageAiText({
    text:
      "月初承压，到了月尾逐步缓解。",
    stage: "month",
    trustedPack: pack(),
  });

  assert.doesNotMatch(month.text, /月初|月尾/);
});

test("降低过度具体剧情", () => {
  const result = sanitizeStageAiText({
    text:
      "关系可能短暂分居并受第三者干扰，同时涉及退休金与房产收益。",
    stage: "year",
    trustedPack: pack(),
  });

  assert.doesNotMatch(
    result.text,
    /短暂分居|第三者|退休金|房产收益/,
  );

  assert.match(
    result.text,
    /短期疏离|外部干扰|稳定收入或既有储备|固定资产或既有资源/,
  );
});

test("纠正藏干透于地支", () => {
  const result = sanitizeStageAiText({
    text:
      "大运藏干甲木透于地支，资源信号明显。",
    stage: "luck",
    trustedPack: pack(),
  });

  assert.doesNotMatch(result.text, /透于地支/);
  assert.match(result.text, /藏干甲藏于地支/);
});
