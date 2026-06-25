import test from "node:test";
import assert from "node:assert/strict";

import {
  buildStageRulePack,
} from "../js/core/transit/buildStageRulePack.js";

import {
  buildLuckAiPrompt,
} from "../js/core/ai/buildLuckAiPrompt.js";

function sampleItem() {
  return {
    ganZhi:
      "丙午",

    stemTenGod:
      "正官",

    branchTenGod:
      "七杀",

    isCurrent:
      true,

    transitStructure: {
      facts: [
        {
          id:
            "year:fact:1",

          text:
            "丙辛天干五合，子午冲，事业与表达结构被触发",

          category:
            "direct",

          status:
            "direct",

          domains: [
            "career",
          ],
        },
      ],
    },

    triggerImages: {
      storyPack: {
        themeHierarchy: {
          primary: {
            tenGod:
              "正官",

            summary:
              "规则与责任进入主线",

            sourceLevel:
              "year",
          },

          supporting: {
            tenGod:
              "食神",

            summary:
              "输出方式承接现实要求",

            sourceLevel:
              "year",
          },
        },

        background: [],

        directTriggers: [
          {
            id:
              "year:career",

            domain:
              "career",

            domains: [
              "career",
            ],

            certainty:
              "direct",

            status:
              "direct",

            sourceLevel:
              "year",

            summary:
              "事业职责与输出方式出现调整",
          },
        ],

        hierarchyInteractions: [],

        convergence: [],

        conditionalPatterns: [],
      },
    },
  };
}

test(
  "规则召回忽略旧固定报告中的大对象",
  () => {
    const item =
      sampleItem();

    const basePack =
      buildStageRulePack({
        stage:
          "year",

        item,

        domainKeys: [
          "career",
        ],
      });

    const heavyLuckReport = {
      luckItems: [
        {
          isCurrent:
            true,

          ganZhi:
            "癸亥",

          tenGod:
            "食神",

          fixedReport: {
            stageRulePack: {
              matchedRules:
                Array.from(
                  {
                    length:
                      200,
                  },
                  (
                    _,
                    index,
                  ) => ({
                    id:
                      `noise_${index}`,

                    text:
                      "七杀 正官 冲 刑 害 财星 婚姻",
                  }),
                ),
            },

            sections:
              Array.from(
                {
                  length:
                    100,
                },
                () =>
                  "无关旧报告内容",
              ),
          },
        },
      ],
    };

    const heavyPack =
      buildStageRulePack({
        stage:
          "year",

        item,

        luckImageReport:
          heavyLuckReport,

        domainKeys: [
          "career",
        ],
      });

    assert.deepEqual(
      heavyPack
        .matchedRuleIds,
      basePack
        .matchedRuleIds,
    );
  },
);

test(
  "AI请求体不再重复嵌套固定报告和规则包",
  () => {
    const item =
      sampleItem();

    const fixedReport = {
      schemaVersion:
        "stage-fixed-report-v8.5",

      stage:
        "luck",

      headline:
        "测试大运主线",

      stageRulePack:
        buildStageRulePack({
          stage:
            "luck",

          item,
        }),

      sections: [
        {
          title:
            "阶段总判",

          summary:
            "测试",
        },
      ],
    };

    const prompt =
      buildLuckAiPrompt({
        luckImageReport: {
          luckItems: [
            {
              ...item,

              isCurrent:
                true,

              fixedReport,
            },
          ],
        },
      });

    const payload =
      JSON.parse(
        prompt.user,
      );

    assert.ok(
      payload
        .stageRulePack,
    );

    assert.equal(
      "stageRulePack" in
        payload
          .fixedReportModel,
      false,
    );

    assert.equal(
      "fixedReportModel" in
        payload
          .trustedPack,
      false,
    );

    assert.equal(
      "stageRulePack" in
        payload
          .trustedPack,
      false,
    );

    assert.equal(
      (
        prompt.user.match(
          /blind-bazi-imagery-kb-v8\.4/g,
        ) ??
        []
      ).length,
      1,
    );
  },
);
