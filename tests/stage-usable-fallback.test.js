import test from "node:test";
import assert from "node:assert/strict";

import {
  normalizeStageReportResponse,
  renderStageReport,
  validateStageReportContract,
} from "../js/core/ai/stageReportContract.js";

const facts = [
  {
    id:
      "F01",
    text:
      "当前年龄约77岁，人生阶段为晚年。",
    evidenceEligible:
      false,
    meta: {
      lifeContext: {
        age:
          77,
        lifeStage:
          "晚年",
      },
    },
  },
  {
    id:
      "F02",
    text:
      "大运干支为丙寅，天干丙为食神透出。",
    evidenceEligible:
      true,
    meta: {
      domains: [
        "ability_output",
      ],
    },
  },
  {
    id:
      "F03",
    text:
      "流年干支为丙午，天干丙为食神透出。",
    evidenceEligible:
      true,
    meta: {
      domains: [
        "ability_output",
      ],
    },
  },
  {
    id:
      "F04",
    text:
      "流月干支为庚寅，天干庚为七杀透出。",
    evidenceEligible:
      true,
    meta: {
      domains: [
        "rules_responsibility",
      ],
    },
  },
  {
    id:
      "F05",
    text:
      "流月地支寅与大运地支寅同支重复，但不是整柱伏吟。",
    evidenceEligible:
      true,
    meta: {
      domains: [
        "relation_environment_change",
      ],
    },
  },
  {
    id:
      "F06",
    text:
      "确定生克关系：大运丙克流月庚，施克者为大运丙，受克者为流月庚。",
    evidenceEligible:
      true,
    meta: {
      domains: [
        "relation_environment_change",
      ],
    },
  },
  {
    id:
      "F07",
    text:
      "流年地支午与日柱地支子构成冲。",
    evidenceEligible:
      true,
    meta: {
      domains: [
        "relation_environment_change",
      ],
    },
  },
];

function report({
  themes =
    [],
  opportunities =
    [],
  risks =
    [],
  actions =
    [],
  verification =
    [],
  summary =
    "同时本月存在若干变化，需要结合现实情况判断。",
} = {}) {
  return JSON.stringify({
    总断:
      summary,
    主题:
      themes,
    有利:
      opportunities,
    风险:
      risks,
    行动建议:
      actions,
    现实验证:
      verification,
  });
}

test(
  "流月主题全部无效时自动生成至少一个可靠主题",
  () => {
    const normalized =
      normalizeStageReportResponse({
        text:
          report({
            themes: [
              {
                领域编号:
                  "rules_responsibility",
                标题:
                  "空主题",
                重要度:
                  "中",
                判断:
                  "",
                现实剧本:
                  "",
                依据编号: [
                  "F04",
                ],
              },
            ],
            opportunities: [
              "食神制杀，面对临时压力能快速变通。",
            ],
            risks: [
              "流年冲动夫妻宫与子女宫。",
            ],
          }),
        stage:
          "month",
      });

    const rendered =
      renderStageReport({
        report:
          normalized.report,
        stage:
          "month",
        verifiedFacts:
          facts,
      });

    assert.equal(
      (
        rendered.match(
          /^#### /gm,
        ) ||
        []
      ).length >=
      1,
      true,
    );

    assert.match(
      rendered,
      /### 本月主要触发/,
    );

    assert.match(
      rendered,
      /\*\*判断：\*\*/m,
    );

    assert.match(
      rendered,
      /\*\*现实剧本：\*\*/m,
    );

    assert.match(
      rendered,
      /\*\*确定依据：\*\*/m,
    );

    assert.doesNotMatch(
      rendered,
      /流年冲动夫妻宫与子女宫/,
    );

    assert.doesNotMatch(
      rendered,
      /食神制杀/,
    );
  },
);

test(
  "晚年兜底主题避免默认写考试实习和职场竞争",
  () => {
    const normalized =
      normalizeStageReportResponse({
        text:
          report(),
        stage:
          "month",
      });

    const rendered =
      renderStageReport({
        report:
          normalized.report,
        stage:
          "month",
        verifiedFacts:
          facts,
      });

    assert.match(
      rendered,
      /家庭|亲友|日常|经验|兴趣/,
    );

    assert.doesNotMatch(
      rendered,
      /实习|求职|晋升|竞赛|资格考试/,
    );
  },
);

test(
  "流年只有一个强显像主题时不再强行补足第二个主题",
  () => {
    const normalized =
      normalizeStageReportResponse({
        text:
          report({
            themes: [
              {
                领域编号:
                  "relation_environment_change",
                标题:
                  "关系与环境调整",
                重要度:
                  "高",
                判断:
                  "本年关系和安排更容易出现重新协调。",
                现实剧本:
                  "已有事务可能需要重新确认边界和顺序，但不必直接推成重大关系事件。",
                可能表现: [
                  "已有安排需要重新沟通。",
                ],
                补充可能:
                  "",
                依据编号: [
                  "F05",
                  "F07",
                ],
                应对: [
                  "先确认事实再调整。",
                ],
              },
            ],
          }),
        stage:
          "year",
      });

    const rendered =
      renderStageReport({
        report:
          normalized.report,
        stage:
          "year",
        verifiedFacts:
          facts,
      });

    assert.equal(
      (
        rendered.match(
          /^#### /gm,
        ) ||
        []
      ).length,
      1,
    );

    assert.match(
      rendered,
      /本年主要显像/,
    );
  },
);

test(
  "主题的全部有效依据不会再被截断为两三条",
  () => {
    const normalized =
      normalizeStageReportResponse({
        text:
          report({
            themes: [
              {
                领域编号:
                  "relation_environment_change",
                标题:
                  "关系与环境结构调整",
                重要度:
                  "高",
                判断:
                  "本月多个关系信号共同出现，需要重新确认处理方式。",
                现实剧本:
                  "相似议题、外部要求与既有安排可能同时进入关注范围，适合先确认边界再推进。",
                可能表现: [
                  "已有事务需要重新沟通。",
                ],
                补充可能:
                  "",
                依据编号: [
                  "F02",
                  "F03",
                  "F04",
                  "F05",
                  "F06",
                  "F07",
                ],
                应对: [
                  "先确认事实。",
                ],
              },
            ],
          }),
        stage:
          "month",
      });

    const rendered =
      renderStageReport({
        report:
          normalized.report,
        stage:
          "month",
        verifiedFacts:
          facts,
      });

    const evidenceSection =
      rendered
        .split(
          "**确定依据：**",
        )[1]
        .split(
          "**应对：**",
        )[0];

    assert.equal(
      (
        evidenceSection.match(
          /^\d+\./gm,
        ) ||
        []
      ).length,
      6,
    );
  },
);

test(
  "顶层技术错误只作为可删除警告，不再让整个报告失败",
  () => {
    const normalized =
      normalizeStageReportResponse({
        text:
          report({
            themes: [
              {
                领域编号:
                  "relation_environment_change",
                标题:
                  "关系与环境调整",
                重要度:
                  "高",
                判断:
                  "本月相似议题可能再次进入关注范围。",
                现实剧本:
                  "已有安排需要重新确认边界和顺序，具体表现取决于现实事务与各方反馈，宜先观察再调整。",
                可能表现: [
                  "已有事务需要重新沟通。",
                ],
                补充可能:
                  "",
                依据编号: [
                  "F05",
                ],
                应对: [
                  "先确认事实。",
                ],
              },
            ],
            risks: [
              "流年冲动夫妻宫与子女宫。",
            ],
          }),
        stage:
          "month",
      });

    const validation =
      validateStageReportContract({
        report:
          normalized.report,
        stage:
          "month",
        verifiedFacts:
          facts,
      });

    assert.equal(
      validation.valid,
      true,
    );

    assert.ok(
      validation.warnings.some(
        (warning) =>
          warning.includes(
            "top_level_removed",
          ),
      ),
    );
  },
);

test(
  "清理总断开头残留连接词和大此运错字",
  () => {
    const normalized =
      normalizeStageReportResponse({
        text:
          report({
            summary:
              "同时大此运需要重新调整关系和安排，具体表现仍要结合现实条件。",
          }),
        stage:
          "luck",
      });

    const rendered =
      renderStageReport({
        report:
          normalized.report,
        stage:
          "luck",
        verifiedFacts:
          facts,
      });

    assert.doesNotMatch(
      rendered,
      /同时大此运|大此运/,
    );

    assert.match(
      rendered,
      /此运需要重新调整关系和安排/,
    );
  },
);
