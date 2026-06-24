import test from "node:test";
import assert from "node:assert/strict";

import {
  normalizeStageReportResponse,
  renderStageReport,
  validateStageReportContract,
} from "../js/core/ai/stageReportContract.js";

const facts = [
  {
    id: "F06",
    text:
      "大运干支为癸亥，天干癸为食神透出。",
  },
  {
    id: "F07",
    text:
      "大运地支亥藏干为壬伤官、甲正财，属于藏支信号，不作透干处理。",
  },
  {
    id: "F08",
    text:
      "确定生克关系：癸克丙，施克者为癸，受克者为丙。",
  },
];

function reportText() {
  return JSON.stringify({
    总断:
      "本年最重要的是计划与外部要求重新协调。关系和合作也需要更清楚地确认边界。",
    主题: [
      {
        标题:
          "计划与规则调整",
        重要度:
          "高",
        判断:
          "原有安排容易受到新要求影响，需要重新确认执行方式。",
        现实剧本:
          "你可能先收到新的要求（依据F06），随后修改方案并再次确认。主动核对标准通常比坚持原方案更有利。",
        补充可能:
          "",
        依据编号: [
          "F06",
          "F08",
        ],
        应对: [
          "重要事项先核对最新要求。",
          "保留一次完整修改空间。",
        ],
      },
      {
        标题:
          "关系与责任边界",
        重要度:
          "中",
        判断:
          "重要关系更容易讨论投入、责任与后续安排。",
        现实剧本:
          "互动增加后，双方会更关注现实配合是否稳定。基础较好时有利于确认方向，基础不足时则会暴露节奏差异。",
        补充可能:
          "",
        依据编号: [
          "F07",
        ],
        应对: [
          "观察持续行动，不以一时热度作决定。",
        ],
      },
    ],
    有利: [
      "标准明确后，执行重点会更清楚。",
    ],
    风险: [
      "过早定死方案，容易增加返工成本。",
    ],
    行动建议: [
      "每季度末复盘一次整体计划。",
      "合作中的关键约定尽量说清楚。",
      "保留必要的时间和资源余量。",
      "不同时推进过多方向。",
    ],
    现实验证: [
      "是否在年初收到新的要求",
      "是否有重要关系开始讨论现实安排",
      "是否感到外部标准比以往更明确",
    ],
  });
}

test(
  "正文中的事实编号自动移除",
  () => {
    const normalized =
      normalizeStageReportResponse({
        text:
          reportText(),
        stage:
          "year",
      });

    assert.doesNotMatch(
      normalized.report.themes[0].story,
      /F06|依据/,
    );
  },
);

test(
  "无依据的年内时间词自动降级",
  () => {
    const normalized =
      normalizeStageReportResponse({
        text:
          reportText(),
        stage:
          "year",
      });

    assert.doesNotMatch(
      normalized.report.verification[0],
      /年初|季度末/,
    );

    assert.match(
      normalized.report.verification[0],
      /本年过程中/,
    );

    assert.doesNotMatch(
      normalized.report.actions[0],
      /季度末/,
    );
  },
);

test(
  "最终只渲染三个总建议并保持依据准确",
  () => {
    const normalized =
      normalizeStageReportResponse({
        text:
          reportText(),
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
      /确定生克关系：癸克丙/,
    );

    const actionSection =
      rendered.split(
        "### 行动建议",
      )[1].split(
        "### 现实验证",
      )[0];

    assert.equal(
      (
        actionSection.match(
          /^\d+\./gm,
        ) ||
        []
      ).length,
      3,
    );
  },
);

test(
  "结构化报告仍可通过校验",
  () => {
    const normalized =
      normalizeStageReportResponse({
        text:
          reportText(),
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
      true,
    );
  },
);
