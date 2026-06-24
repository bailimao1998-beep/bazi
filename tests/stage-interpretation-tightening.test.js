import test from "node:test";
import assert from "node:assert/strict";

import {
  normalizeStageReportResponse,
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
      "大运地支亥藏干为壬伤官、甲正财，属于藏支信号。",
  },
  {
    id: "F08",
    text:
      "流月地支寅与年柱地支寅同支重复，但不是整柱伏吟。",
  },
];

test(
  "正文允许使用命理术语",
  () => {
    const raw =
      JSON.stringify({
        总断:
          "食神透出后，表达与技能输出会成为这一阶段的重要主线。",
        主题: [
          {
            标题:
              "表达与技能积累",
            重要度:
              "高",
            判断:
              "食神力量增强，适合持续形成可展示的成果。",
            现实剧本:
              "你会更愿意输出想法，并通过反复实践逐渐形成稳定优势。藏支伤官会带来突破惯性的冲动，但仍需控制节奏。",
            补充可能:
              "",
            依据编号: [
              "F06",
              "F07",
            ],
            应对: [
              "按阶段设置成果目标。",
            ],
          },
          {
            标题:
              "资源与回报",
            重要度:
              "中",
            判断:
              "现实回报更依赖长期经营，而不是短期冒进。",
            现实剧本:
              "当能力逐渐稳定后，部分成果可能转化为收入、合作机会或更明确的资源支持。",
            补充可能:
              "",
            依据编号: [
              "F07",
            ],
            应对: [
              "先验证需求，再增加投入。",
            ],
          },
        ],
        有利: [],
        风险: [],
        行动建议: [],
        现实验证: [],
      });

    const normalized =
      normalizeStageReportResponse({
        text:
          raw,
        stage:
          "luck",
      });

    const validation =
      validateStageReportContract({
        report:
          normalized.report,
        stage:
          "luck",
        verifiedFacts:
          facts,
      });

    assert.equal(
      validation.valid,
      true,
    );
  },
);

test(
  "一个主题枚举过多具体场景会被要求重写",
  () => {
    const raw =
      JSON.stringify({
        总断:
          "本月需要协调竞争与规则。",
        主题: [
          {
            标题:
              "多场景混写",
            重要度:
              "高",
            判断:
              "外部要求会影响执行。",
            现实剧本:
              "你可能同时面对考试、导师、上级、客户、恋爱、投资和设备采购等问题，需要逐项处理。",
            补充可能:
              "",
            依据编号: [
              "F06",
              "F07",
            ],
            应对: [],
          },
          {
            标题:
              "次要主题",
            重要度:
              "中",
            判断:
              "需要保持节奏稳定。",
            现实剧本:
              "先确认最重要的事项，再逐步处理剩余安排。",
            补充可能:
              "",
            依据编号: [
              "F07",
            ],
            应对: [],
          },
        ],
        有利: [],
        风险: [],
        行动建议: [],
        现实验证: [],
      });

    const normalized =
      normalizeStageReportResponse({
        text:
          raw,
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

    assert.ok(
      validation.errors.some(
        (error) =>
          error.includes(
            "over_specific_scene_enumeration",
          ),
      ),
    );
  },
);

test(
  "同支重复不能直接断旧机会回归",
  () => {
    const raw =
      JSON.stringify({
        总断:
          "本月相似议题容易再次被触发。",
        主题: [
          {
            标题:
              "重复议题",
            重要度:
              "中",
            判断:
              "需要重新评估类似问题。",
            现实剧本:
              "旧项目、复考机会、房源或设备采购可能再次出现。",
            补充可能:
              "",
            依据编号: [
              "F08",
            ],
            应对: [],
          },
          {
            标题:
              "执行调整",
            重要度:
              "中",
            判断:
              "先核对条件再推进。",
            现实剧本:
              "相似环境会再次要求你调整处理方式。",
            补充可能:
              "",
            依据编号: [
              "F06",
            ],
            应对: [],
          },
        ],
        有利: [],
        风险: [],
        行动建议: [],
        现实验证: [],
      });

    const normalized =
      normalizeStageReportResponse({
        text:
          raw,
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

    assert.ok(
      validation.errors.some(
        (error) =>
          error.includes(
            "same_branch_overinterpreted",
          ),
      ),
    );
  },
);

test(
  "固定周期建议自动改为阶段性表达",
  () => {
    const raw =
      JSON.stringify({
        总断:
          "本阶段适合稳步积累。",
        主题: [
          {
            标题:
              "能力积累",
            重要度:
              "高",
            判断:
              "持续练习更有利。",
            现实剧本:
              "通过稳定投入，你会逐渐形成优势。",
            补充可能:
              "",
            依据编号: [
              "F06",
              "F07",
            ],
            应对: [
              "每三个月设置一个成果目标。",
              "先观察一周再决定。",
            ],
          },
        ],
        有利: [],
        风险: [],
        行动建议: [
          "每周花15分钟复盘。",
          "提前两周准备材料。",
        ],
        现实验证: [
          "过去三年内是否学习过新技能",
        ],
      });

    const normalized =
      normalizeStageReportResponse({
        text:
          raw,
        stage:
          "luck",
      });

    const allText =
      JSON.stringify(
        normalized.report,
      );

    assert.doesNotMatch(
      allText,
      /每三个月|观察一周|每周花15分钟|提前两周|过去三年内/,
    );

    assert.match(
      allText,
      /分阶段|留出观察时间|定期|提前留出充足时间|近期/,
    );
  },
);

test(
  "大运单主题有补充可能时自动形成第二主题",
  () => {
    const raw =
      JSON.stringify({
        总断:
          "这十年以能力输出和方向形成作为主线。",
        主题: [
          {
            标题:
              "表达与技能积累",
            重要度:
              "高",
            判断:
              "持续实践有助于形成稳定优势。",
            现实剧本:
              "你会主动寻找适合自己的输出方式，并逐步把兴趣转化为可展示的成果。",
            补充可能:
              "随着能力稳定，部分成果可能逐渐转化为收入、合作机会或其他现实回报。",
            依据编号: [
              "F06",
              "F07",
            ],
            应对: [],
          },
        ],
        有利: [],
        风险: [],
        行动建议: [],
        现实验证: [],
      });

    const normalized =
      normalizeStageReportResponse({
        text:
          raw,
        stage:
          "luck",
      });

    assert.equal(
      normalized.report.themes.length,
      2,
    );

    assert.equal(
      normalized.report.themes[1].title,
      "资源积累与现实回报",
    );
  },
);
