import test from "node:test";
import assert from "node:assert/strict";

import {
  buildChatPrompt,
} from "../js/core/ai/buildChatPrompt.js";

function parseUser(
  result,
) {
  return JSON.parse(
    result.user,
  );
}

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
          hiddenStems: [
            {
              stem:
                "甲",
              tenGod:
                "正财",
              role:
                "主气",
              weight:
                60,
            },
          ],
        },
        month: {
          label:
            "辛酉",
          stem:
            "辛",
          branch:
            "酉",
        },
        day: {
          label:
            "辛酉",
          stem:
            "辛",
          branch:
            "酉",
        },
        hour: {
          label:
            "戊子",
          stem:
            "戊",
          branch:
            "子",
        },
      },
    },
    dayMasterSummary: {
      strengthLevel:
        "身强",
      strengthScore:
        88,
    },
    natalBaseline: {
      climate: {
        priorityNeeds: [
          "火",
        ],
      },
    },
    facts: [
      {
        id:
          "F01",
        statement:
          "候选事实",
      },
    ],
    compositions: [
      {
        id:
          "C01",
        manifestations: [
          "具体场景",
        ],
      },
    ],
    workChains: {
      chains: [
        {
          id:
            "W01",
        },
      ],
    },
    domains: [
      {
        key:
          "career",
      },
    ],
  },
};

const luckImageReport = {
  summary: {
    overview:
      "不要发送的大运故事",
  },
  keySignals: [
    "不要发送的重点",
  ],
  needVerify: [
    "不要发送的验证文案",
  ],
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
      image:
        "不要发送的取象",
      reality:
        "不要发送的现实故事",
      relationToNatal: [
        {
          type:
            "合",
          natalPillar:
            "年支寅",
          natalBranch:
            "寅",
          luckBranch:
            "亥",
          description:
            "不要发送的关系解释",
          effect:
            "不要发送的现实含义",
        },
      ],
      transitStructure: {
        summary: {
          text:
            "不要发送的结构总结",
        },
        facts: [
          {
            id:
              "R01",
            category:
              "direct",
            type:
              "branch_六合",
            label:
              "六合",
            source:
              "大运触发原局",
            text:
              "不要发送的解释文字",
            participants: [
              "luck:癸亥",
              "natal:year:戊寅",
            ],
          },
          {
            id:
              "I01",
            category:
              "convergence",
            type:
              "multi_domain_activation",
            label:
              "多领域联动",
            text:
              "不要发送的推断",
          },
        ],
      },
    },
  ],
};

const yearImageReport = {
  summary: {
    overview:
      "不要发送的流年故事",
  },
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
    currentLuckItem:
      luckImageReport
        .luckItems[0],
    image:
      "不要发送的取象",
    reality:
      "不要发送的现实故事",
    relationToNatal: [
      {
        type:
          "冲",
        yearBranch:
          "午",
        natalBranch:
          "子",
        natalPillar:
          "时支子",
        description:
          "不要发送的冲动解释",
      },
    ],
    relationToLuck:
      [],
    transitStructure: {
      facts: [
        {
          id:
            "Y01",
          category:
            "direct",
          type:
            "stem_control",
          label:
            "天干相克",
          source:
            "流年对大运",
          text:
            "不要发送的现实解释",
          participants: [
            "year:丙午",
            "luck:癸亥",
          ],
          meta: {
            controller:
              "癸",
            controlled:
              "丙",
            direction:
              "target_controls_current",
            extraStory:
              "不要发送",
          },
        },
      ],
    },
  },
};

const monthImageReport = {
  monthItem: {
    year:
      2026,
    month:
      1,
    flowMonthLabel:
      "寅月",
    dateRangeLabel:
      "2月4日-3月5日",
    ganZhi:
      "庚寅",
    stem:
      "庚",
    branch:
      "寅",
    stemTenGod:
      "劫财",
    branchTenGod:
      "正财",
    currentLuckItem:
      luckImageReport
        .luckItems[0],
    yearItem:
      yearImageReport
        .yearItem,
    image:
      "不要发送的流月故事",
    reality:
      "不要发送的流月现实解释",
    relationToNatal:
      [],
    relationToLuck:
      [],
    relationToYear:
      [],
    transitStructure: {
      facts: [],
    },
  },
};

test(
  "原局问答只发送基础排盘事实",
  () => {
    const payload =
      parseUser(
        buildChatPrompt({
          question:
            "我的事业怎么样",
          chatIntent:
            "career",
          natalImageReport,
        }),
      );

    assert.equal(
      payload.dataMode,
      "hard_facts_only",
    );

    assert.equal(
      payload
        .natalHardFacts
        .dayMaster,
      "辛",
    );

    assert.deepEqual(
      payload
        .natalHardFacts
        .pillars
        .year
        .hiddenStems,
      [
        {
          stem:
            "甲",
          tenGod:
            "正财",
        },
      ],
    );

    const raw =
      JSON.stringify(
        payload,
      );

    for (const forbidden of [
      '"strengthLevel"',
      '"strengthScore"',
      '"natalBaseline"',
      '"facts"',
      '"compositions"',
      '"workChains"',
      '"domains"',
      "候选事实",
      "具体场景",
    ]) {
      assert.equal(
        raw.includes(
          forbidden,
        ),
        false,
        forbidden,
      );
    }
  },
);

test(
  "岁运问答不发送取象故事和现实模板",
  () => {
    const payload =
      parseUser(
        buildChatPrompt({
          question:
            "2026年怎么样",
          chatIntent:
            "yearTrend",
          natalImageReport,
          luckImageReport,
          yearImageReport,
          requestedYears: [
            2026,
          ],
          requestedYearReports: [
            {
              year:
                2026,
              luckImageReport,
              yearImageReport,
            },
          ],
        }),
      );

    const raw =
      JSON.stringify(
        payload,
      );

    assert.doesNotMatch(
      raw,
      /不要发送|summary|image|reality|keySignals|needVerify|triggerImages|多领域联动/,
    );

    assert.match(
      raw,
      /癸亥/,
    );

    assert.match(
      raw,
      /丙午/,
    );

    assert.match(
      raw,
      /六合/,
    );

    assert.match(
      raw,
      /天干相克/,
    );
  },
);

test(
  "只保留机械关系字段并删除关系解释",
  () => {
    const payload =
      parseUser(
        buildChatPrompt({
          question:
            "2026年怎么样",
          chatIntent:
            "yearTrend",
          natalImageReport,
          luckImageReport,
          yearImageReport,
        }),
      );

    const relation =
      payload
        .yearHardFacts
        .relationToNatal[0];

    assert.deepEqual(
      relation,
      {
        type:
          "冲",
        currentBranch:
          "午",
        targetBranch:
          "子",
        natalPillar:
          "时支子",
        natalBranch:
          "子",
        yearBranch:
          "午",
      },
    );
  },
);

test(
  "流月问答保留月份基础事实与节气范围",
  () => {
    const payload =
      parseUser(
        buildChatPrompt({
          question:
            "这个月怎么样",
          chatIntent:
            "monthTrend",
          natalImageReport,
          luckImageReport,
          yearImageReport,
          monthImageReport,
          monthImageReports: [
            monthImageReport,
          ],
        }),
      );

    assert.equal(
      payload
        .monthHardFacts
        .ganZhi,
      "庚寅",
    );

    assert.equal(
      payload
        .monthHardFacts
        .dateRangeLabel,
      "2月4日-3月5日",
    );

    assert.equal(
      payload
        .monthHardFactsList
        .length,
      1,
    );

    assert.doesNotMatch(
      JSON.stringify(
        payload,
      ),
      /不要发送/,
    );
  },
);

test(
  "系统提示要求AI独立分析而不是复述页面结论",
  () => {
    const result =
      buildChatPrompt({
        question:
          "我的事业怎么样",
        chatIntent:
          "career",
        natalImageReport,
      });

    assert.match(
      result.system,
      /不再提供身强、用神、格局、领域结论、取象故事或现实场景模板/,
    );

    assert.match(
      result.system,
      /根据基础事实独立分析/,
    );

    assert.match(
      result.system,
      /不能把单个十神直接等同于具体事件/,
    );
  },
);
