import test from "node:test";
import assert from "node:assert/strict";

import {
  buildChatPrompt,
} from "../../js/services/ai/chat/buildChatPrompt.js";

const natalImageReport = {
  natalAiEvidencePack: {
    chartSummary: {
      gender:
        "男",
      dayMaster:
        "辛",
      pillars: {
        year: {
          label:
            "戊寅",
          stem:
            "戊",
          branch:
            "寅",
          stemTenGod:
            "正印",
          branchMainTenGod:
            "正财",
          hiddenStems: [],
        },
        month: {
          label:
            "辛酉",
          stem:
            "辛",
          branch:
            "酉",
          stemTenGod:
            "比肩",
          branchMainTenGod:
            "比肩",
          hiddenStems: [],
        },
        day: {
          label:
            "辛酉",
          stem:
            "辛",
          branch:
            "酉",
          stemTenGod:
            "比肩",
          branchMainTenGod:
            "比肩",
          hiddenStems: [],
        },
        hour: {
          label:
            "戊子",
          stem:
            "戊",
          branch:
            "子",
          stemTenGod:
            "正印",
          branchMainTenGod:
            "食神",
          hiddenStems: [],
        },
      },
    },
  },
};

const luckImageReport = {
  luckItems: [
    {
      index:
        3,
      ageRange:
        "21-30岁",
      yearRange:
        "2019-2028",
      ganZhi:
        "癸亥",
      stem:
        "癸",
      branch:
        "亥",
      tenGod:
        "食神",
      branchTenGod:
        "伤官",
      isCurrent:
        true,
      relationToNatal: [],
      transitStructure: {
        facts: [],
      },
    },
  ],
};

test(
  "原局机械关系只包含标准关系",
  () => {
    const result =
      buildChatPrompt({
        question:
          "我的感情怎么样",
        chatIntent:
          "relationship",
        natalImageReport,
        chart: {
          input: {
            year:
              1998,
          },
        },
        currentInput: {
          targetYear:
            2026,
        },
      });

    const payload =
      JSON.parse(
        result.user,
      );

    const raw =
      JSON.stringify(
        payload
          .natalHardFacts
          .mechanicalRelations,
      );

    assert.match(
      raw,
      /子.*酉|酉.*子/,
    );

    assert.match(
      raw,
      /"relation":"破"/,
    );

    assert.doesNotMatch(
      raw,
      /寅酉暗合|子酉半合|午酉破/,
    );
  },
);

test(
  "多年问题获得大运列表和逐年扫描信息",
  () => {
    const result =
      buildChatPrompt({
        question:
          "我的盘在哪几年会有感情",
        chatIntent:
          "multiYear",
        natalImageReport,
        luckImageReport,
        requestedYears: [
          2026,
          2027,
        ],
        requestedYearReports: [
          {
            year:
              2026,
            luckImageReport,
            yearImageReport: {
              yearItem: {
                year:
                  2026,
                ganZhi:
                  "丙午",
                stem:
                  "丙",
                branch:
                  "午",
                stemTenGod:
                  "正官",
                branchTenGod:
                  "七杀",
                relationToNatal: [],
                relationToLuck: [],
                transitStructure: {
                  facts: [],
                },
              },
            },
          },
        ],
        yearSearchPlan: {
          mode:
            "default_future_scan",
          reason:
            "默认未来窗口",
        },
        chart: {
          input: {
            year:
              1998,
          },
        },
        currentInput: {
          targetYear:
            2026,
        },
      });

    const payload =
      JSON.parse(
        result.user,
      );

    assert.equal(
      payload
        .luckHardFacts
        .luckCycles
        .length,
      1,
    );

    assert.equal(
      payload
        .yearSearchPlan
        .mode,
      "default_future_scan",
    );

    assert.equal(
      payload
        .subjectContext
        .birthYear,
      1998,
    );
  },
);
