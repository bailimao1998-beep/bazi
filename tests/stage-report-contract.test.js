import test from "node:test";
import assert from "node:assert/strict";

import {
  normalizeStageReportResponse,
  renderStageReport,
  validateStageReportContract,
} from "../js/core/ai/stageReportContract.js";

const facts = [
  {
    id: "F01",
    text:
      "流年天干丙为正官透出。",
  },
  {
    id: "F02",
    text:
      "流年地支午与时支子构成子午冲。",
  },
  {
    id: "F03",
    text:
      "大运癸克流年丙，施克者为癸，受克者为丙。",
  },
];

function validJson() {
  return JSON.stringify({
    总断:
      "今年最明显的是外部要求与个人计划之间需要重新协调。关系与合作也会进入更现实的讨论阶段。整体适合先确认标准，再保留调整空间。",
    主题: [
      {
        标题:
          "计划与规则调整",
        重要度:
          "高",
        判断:
          "原有安排更容易受到新的要求影响，需要重新确认执行方式。",
        现实剧本:
          "一项已经开始的事务可能先收到新的要求，随后经历修改、补充和再次确认。主动理解标准并分阶段处理，通常比坚持原方案更有利。",
        补充可能:
          "",
        依据编号: [
          "F02",
          "F03",
        ],
        应对: [
          "重要事项先核对最新要求。",
          "给方案保留一次完整修改空间。",
        ],
      },
      {
        标题:
          "关系与责任边界",
        重要度:
          "中",
        判断:
          "重要关系更容易讨论责任、投入和后续安排。",
        现实剧本:
          "互动增加后，双方会更关注现实配合是否稳定。关系基础较好时有利于确认方向，基础不足时则会暴露节奏差异。",
        补充可能:
          "",
        依据编号: [
          "F01",
        ],
        应对: [
          "观察持续行动，不以一时热度作决定。",
        ],
      },
    ],
    有利: [
      "外部标准明确后，执行重点会更清楚。",
      "修改过程有助于提高成果稳定性。",
    ],
    风险: [
      "过早定死方案，容易增加返工成本。",
      "关系中只谈情绪、不谈责任，容易产生误解。",
    ],
    行动建议: [
      "把最重要的事项拆成几个确认节点。",
      "合作和关系中的关键约定尽量说清楚。",
      "保留必要的时间和资源余量。",
    ],
    现实验证: [
      "是否出现已经确定的计划需要重新修改",
      "是否有重要关系开始讨论现实安排",
      "是否感到外部标准比以往更明确",
    ],
  });
}

test(
  "解析并验证结构化报告",
  () => {
    const normalized =
      normalizeStageReportResponse({
        text:
          `\`\`\`json\n${validJson()}\n\`\`\``,
        stage:
          "year",
      });

    const validation =
      validateStageReportContract({
        report:
          normalized.report,
        stage:
          "year",
        verifiedFacts:
          facts,
        parseError:
          normalized.parseError,
      });

    assert.equal(
      validation.valid,
      true,
    );
  },
);

test(
  "未知依据编号会被发现",
  () => {
    const source =
      JSON.parse(
        validJson(),
      );

    source
      .主题[0]
      .依据编号 = [
        "F99",
      ];

    const normalized =
      normalizeStageReportResponse({
        text:
          JSON.stringify(
            source,
          ),
        stage:
          "year",
      });

    const validation =
      validateStageReportContract({
        report:
          normalized.report,
        stage:
          "year",
        verifiedFacts:
          facts,
      });

    assert.equal(
      validation.valid,
      false,
    );

    assert.ok(
      validation.errors.some(
        (error) =>
          error.includes(
            "unknown_evidence",
          ),
      ),
    );
  },
);

test(
  "故事中重新计算命理会被要求重写",
  () => {
    const source =
      JSON.parse(
        validJson(),
      );

    source
      .主题[0]
      .现实剧本 +=
      "丙火正官冲击子水。";

    const normalized =
      normalizeStageReportResponse({
        text:
          JSON.stringify(
            source,
          ),
        stage:
          "year",
      });

    const validation =
      validateStageReportContract({
        report:
          normalized.report,
        stage:
          "year",
        verifiedFacts:
          facts,
      });

    assert.equal(
      validation.valid,
      false,
    );

    assert.ok(
      validation.errors.some(
        (error) =>
          error.includes(
            "technical_recalculation",
          ),
      ),
    );
  },
);

test(
  "最终依据由程序渲染且结构更精简",
  () => {
    const normalized =
      normalizeStageReportResponse({
        text:
          validJson(),
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

    assert.match(
      rendered,
      /### 今年总断/,
    );

    assert.match(
      rendered,
      /确定依据/,
    );

    assert.match(
      rendered,
      /大运癸克流年丙/,
    );

    assert.doesNotMatch(
      rendered,
      /可能的发展路径/,
    );

    assert.equal(
      (
        rendered.match(
          /### 现实验证/g,
        ) ||
        []
      ).length,
      1,
    );
  },
);
