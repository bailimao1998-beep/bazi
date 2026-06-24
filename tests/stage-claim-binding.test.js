import test from "node:test";
import assert from "node:assert/strict";

import {
  normalizeStageReportResponse,
  renderStageReport,
  validateStageReportContract,
} from "../js/core/ai/stageReportContract.js";

const lifeFact = {
  id:
    "F01",
  text:
    "当前年龄约77岁，人生阶段为晚年。现实场景优先考虑生活节奏与身心承受、家庭和亲友互动、兴趣、经验与精神生活、既有资源和日常收支、社区、老友与社会活动。",
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
};

const foodFact = {
  id:
    "F02",
  text:
    "大运干支为丙寅，天干丙为食神透出。",
};

const foodYearFact = {
  id:
    "F03",
  text:
    "流年干支为丙午，天干丙为食神透出。",
};

const killingFact = {
  id:
    "F04",
  text:
    "流月干支为庚寅，天干庚为七杀透出。",
};

const controlFact = {
  id:
    "F05",
  text:
    "确定生克关系：丙克庚，施克者为丙，受克者为庚。",
};

const sameBranchFact = {
  id:
    "F06",
  text:
    "流月地支寅与大运地支寅同支重复，但不是整柱伏吟。",
};

function makeReport({
  story,
  evidenceIds,
  stage = "month",
} = {}) {
  return JSON.stringify({
    总断:
      "本阶段压力与表达并存，需要在现实条件内调整节奏。",
    主题: [
      {
        标题:
          "主要主题",
        重要度:
          "高",
        判断:
          "当前需要协调外部要求与个人表达。",
        现实剧本:
          story,
        补充可能:
          "",
        依据编号:
          evidenceIds,
        应对: [
          "先核对条件，再分阶段推进。",
        ],
      },
      {
        标题:
          "次要主题",
        重要度:
          "中",
        判断:
          "相似议题可能再次被触发。",
        现实剧本:
          "过去熟悉的处理模式可能再次出现，需要根据当前条件重新判断。",
        补充可能:
          "",
        依据编号: [
          "F06",
        ],
        应对: [
          "记录差异，不按旧经验直接决定。",
        ],
      },
    ],
    有利:
      [],
    风险:
      [],
    行动建议: [
      "固定留出一段时间整理安排。",
    ],
    现实验证: [
      "本周是否遇到需要按规则处理的事务",
    ],
  });
}

test(
  "同支重复写成伏吟会被发现并在展示时纠正",
  () => {
    const normalized =
      normalizeStageReportResponse({
        text:
          makeReport({
            story:
              "流月寅与大运寅伏吟，相似事件会再次发生。",
            evidenceIds: [
              "F06",
            ],
          }),
        stage:
          "month",
      });

    const facts = [
      lifeFact,
      sameBranchFact,
    ];

    const validation =
      validateStageReportContract({
        report:
          normalized.report,
        stage:
          "month",
        verifiedFacts:
          facts,
      });

    assert.ok(
      validation.errors.some(
        (error) =>
          error.includes(
            "unsupported_fuyin_claim",
          ),
      ),
    );

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
      /流月寅与大运寅伏吟/,
    );

    assert.match(
      rendered,
      /现实剧本：.*同支重复/,
    );

    assert.match(
      rendered,
      /不是整柱伏吟/,
    );
  },
);

test(
  "食神制杀必须绑定三类事实且不能升级格局强弱",
  () => {
    const normalized =
      normalizeStageReportResponse({
        text:
          makeReport({
            story:
              "食神制杀格局已经形成，制杀之力强劲，可以彻底化解压力。",
            evidenceIds: [
              "F02",
              "F04",
            ],
          }),
        stage:
          "month",
      });

    const facts = [
      lifeFact,
      foodFact,
      killingFact,
      controlFact,
      sameBranchFact,
    ];

    const validation =
      validateStageReportContract({
        report:
          normalized.report,
        stage:
          "month",
        verifiedFacts:
          facts,
      });

    assert.ok(
      validation.errors.some(
        (error) =>
          error.includes(
            "unsupported_food_controls_killing",
          ),
      ),
    );

    assert.ok(
      validation.errors.some(
        (error) =>
          error.includes(
            "unsupported_pattern_upgrade",
          ),
      ),
    );
  },
);

test(
  "完整引用食神七杀与生克关系时可写作用关系",
  () => {
    const normalized =
      normalizeStageReportResponse({
        text:
          makeReport({
            story:
              "大运与流年的食神同时参与，流月七杀带来压力，食神制杀的作用关系有助于把压力转为行动。",
            evidenceIds: [
              "F02",
              "F03",
              "F04",
              "F05",
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
        verifiedFacts: [
          lifeFact,
          foodFact,
          foodYearFact,
          killingFact,
          controlFact,
          sameBranchFact,
        ],
      });

    assert.equal(
      validation.errors.some(
        (error) =>
          error.includes(
            "unsupported_food_controls_killing",
          ),
      ),
      false,
    );
  },
);

test(
  "没有时柱依据时不得自行写时柱关联",
  () => {
    const normalized =
      normalizeStageReportResponse({
        text:
          makeReport({
            story:
              "七杀还与年柱、时柱产生关联，责任会明显增加。",
            evidenceIds: [
              "F04",
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
        verifiedFacts: [
          lifeFact,
          killingFact,
          sameBranchFact,
        ],
      });

    assert.ok(
      validation.errors.some(
        (error) =>
          error.includes(
            "unsupported_layer_reference",
          ),
      ),
    );
  },
);

test(
  "晚年用户的在校职场主剧本会被发现",
  () => {
    const normalized =
      normalizeStageReportResponse({
        text:
          makeReport({
            story:
              "你会在学校与同事争夺晋升机会，上级会按项目名额进行审核。",
            evidenceIds: [
              "F02",
              "F03",
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
        verifiedFacts: [
          lifeFact,
          foodFact,
          foodYearFact,
          sameBranchFact,
        ],
      });

    assert.ok(
      validation.errors.some(
        (error) =>
          error.includes(
            "life_stage_scene_mismatch",
          ),
      ),
    );
  },
);

test(
  "流月中的本周和其他伪精确时间会被清理",
  () => {
    const normalized =
      normalizeStageReportResponse({
        text:
          makeReport({
            story:
              "近一两年积累的问题在本周集中出现，建议隔天再回应，并安排每日或每周固定的小时段处理。",
            evidenceIds: [
              "F02",
              "F03",
            ],
          }),
        stage:
          "month",
      });

    const allText =
      JSON.stringify(
        normalized.report,
      );

    assert.doesNotMatch(
      allText,
      /本周|近一两年|隔天再回应|每日或每周固定的小时段/,
    );

    assert.match(
      allText,
      /本月|近期|情绪平稳后再回应|固定留出一段时间/,
    );
  },
);
