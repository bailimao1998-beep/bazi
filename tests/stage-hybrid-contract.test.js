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
      "大运干支为癸亥，天干癸为食神透出。",
    evidenceEligible:
      true,
  },
  {
    id:
      "F02",
    text:
      "大运地支亥藏干为壬伤官、甲正财，属于藏支信号，不作透干处理。",
    evidenceEligible:
      true,
  },
  {
    id:
      "F03",
    text:
      "流年干支为丙午，天干丙为正官透出。",
    evidenceEligible:
      true,
  },
  {
    id:
      "F04",
    text:
      "流月干支为庚寅，天干庚为劫财透出。",
    evidenceEligible:
      true,
  },
  {
    id:
      "F05",
    text:
      "确定生克关系：丙克庚，施克者为丙，受克者为庚。",
    evidenceEligible:
      true,
  },
];

function makeReport({
  story =
    "本阶段需要协调表达与外部要求，并根据现实条件调整执行方式。",
  opportunities =
    [],
  risks =
    [],
  actions =
    [],
} = {}) {
  return JSON.stringify({
    总断:
      "本阶段的重点是能力输出与现实规则之间的协调。",
    主题: [
      {
        标题:
          "表达与执行",
        重要度:
          "高",
        判断:
          "表达和行动会受到现实要求检验。",
        现实剧本:
          story,
        补充可能:
          "",
        依据编号: [
          "F01",
          "F03",
        ],
        应对: [
          "先核对条件，再推进重要事项。",
        ],
      },
      {
        标题:
          "资源与边界",
        重要度:
          "中",
        判断:
          "资源安排需要保持清楚边界。",
        现实剧本:
          "现实回报更依赖持续经营和边界管理，而不是一次性冒进；先观察投入与反馈，再决定是否扩大行动范围。",
        补充可能:
          "",
        依据编号: [
          "F02",
        ],
        应对: [
          "保留必要余量。",
        ],
      },
    ],
    有利:
      opportunities,
    风险:
      risks,
    行动建议:
      actions,
    现实验证: [
      "是否感到表达和外部要求需要重新协调",
    ],
  });
}

test(
  "具体场景和人生阶段只作警告不阻断",
  () => {
    const normalized =
      normalizeStageReportResponse({
        text:
          makeReport({
            story:
              "你可能同时面对考试、导师、上级、客户、恋爱和投资等多类问题，容易因此分散判断重点，需要先收束成一个主要矛盾再处理。",
          }),
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

    assert.ok(
      validation.warnings.some(
        (warning) =>
          warning.includes(
            "over_specific_scene_enumeration",
          ),
      ),
    );
  },
);

test(
  "有利风险建议中的错误藏干组合也会被发现",
  () => {
    const normalized =
      normalizeStageReportResponse({
        text:
          makeReport({
            opportunities: [
              "大运地支藏官印，长期容易得到贵人支持。",
            ],
          }),
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
            "unsupported_hidden_tengod",
          ),
      ),
    );
  },
);

test(
  "页面自动清除错误藏干并修正常见过度解释",
  () => {
    const normalized =
      normalizeStageReportResponse({
        text:
          makeReport({
            opportunities: [
              "大运地支藏官印，长期资源积累有潜在支持。",
              "正官象征贵人机遇。",
              "正官克制劫财，外部规则保护公平竞争。",
            ],
            actions: [
              "食神大运为内在思考提供支持。",
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

    assert.doesNotMatch(
      rendered,
      /大运地支藏官印/,
    );

    assert.doesNotMatch(
      rendered,
      /正官象征贵人|保护公平竞争|内在思考提供支持/,
    );

    assert.match(
      rendered,
      /正式要求或被评价的机会|约束竞争行为|表达、技能与成果整理/,
    );
  },
);

test(
  "暗合不存在时不能把财星藏支写成暗合财星",
  () => {
    const normalized =
      normalizeStageReportResponse({
        text:
          makeReport({
            story:
              "大运藏支暗合财星，因此收入渠道会被直接打开。",
          }),
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

    assert.ok(
      validation.errors.some(
        (error) =>
          error.includes(
            "unsupported_dark_combine",
          ),
      ),
    );
  },
);
