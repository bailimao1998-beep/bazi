import test from "node:test";
import assert from "node:assert/strict";

import {
  buildStageStructuredPromptSource,
  buildStageVerifiedFactPack,
} from "../js/core/ai/buildStageVerifiedFactPack.js";

import {
  normalizeStageReportResponse,
  renderStageReport,
  validateStageReportContract,
} from "../js/core/ai/stageReportContract.js";

function fixture(
  stage,
) {
  return {
    stage,
    stageLabel:
      stage ===
        "month"
        ? "流月"
        : stage ===
            "year"
          ? "流年"
          : "大运",
    target: {
      year:
        2026,
      age:
        77,
    },
    factualContext: {
      natal: {
        birthYear:
          1949,
        pillars: [
          {
            key:
              "year",
            stem:
              "戊",
            branch:
              "寅",
            ganZhi:
              "戊寅",
          },
          {
            key:
              "month",
            stem:
              "辛",
            branch:
              "酉",
            ganZhi:
              "辛酉",
          },
          {
            key:
              "day",
            stem:
              "辛",
            branch:
              "酉",
            ganZhi:
              "辛酉",
          },
          {
            key:
              "hour",
            stem:
              "戊",
            branch:
              "子",
            ganZhi:
              "戊子",
          },
        ],
      },
      luck: {
        stem:
          "癸",
        branch:
          "亥",
        ganZhi:
          "癸亥",
        stemTenGod:
          "食神",
        hiddenStems: [
          {
            stem:
              "壬",
            tenGod:
              "伤官",
          },
          {
            stem:
              "甲",
            tenGod:
              "正财",
          },
        ],
      },
      year: {
        stem:
          "丙",
        branch:
          "午",
        ganZhi:
          "丙午",
        stemTenGod:
          "正官",
        hiddenStems: [
          {
            stem:
              "丁",
            tenGod:
              "七杀",
          },
          {
            stem:
              "己",
            tenGod:
              "偏印",
          },
        ],
      },
      month: {
        stem:
          "庚",
        branch:
          "寅",
        ganZhi:
          "庚寅",
        stemTenGod:
          "劫财",
      },
    },
    relationFacts:
      [],
    mechanicalSignals: {
      layers: {},
    },
    evidenceConvergences:
      [],
  };
}

function report({
  summary =
    "本阶段存在若干确定信号，需要根据当前层新增事实判断实际显像。",
  themes =
    [],
} = {}) {
  return JSON.stringify({
    总断:
      summary,
    主题:
      themes,
    有利:
      [],
    风险:
      [],
    行动建议:
      [],
    现实验证:
      [],
  });
}

test(
  "事实包区分当前层事实和上层背景",
  () => {
    const pack =
      buildStageVerifiedFactPack(
        fixture(
          "month",
        ),
      );

    const monthFacts =
      pack.evidenceFacts.filter(
        (fact) =>
          fact.meta
            ?.temporalRole ===
          "current",
      );

    const backgroundFacts =
      pack.evidenceFacts.filter(
        (fact) =>
          fact.meta
            ?.temporalRole ===
          "background",
      );

    assert.ok(
      monthFacts.some(
        (fact) =>
          fact.text.includes(
            "流月",
          ),
      ),
    );

    assert.ok(
      backgroundFacts.some(
        (fact) =>
          fact.text.includes(
            "大运",
          ),
      ),
    );

    const source =
      buildStageStructuredPromptSource(
        pack,
      );

    assert.ok(
      Array.isArray(
        source.阶段显像排序,
      ),
    );

    assert.ok(
      source.领域事实卡.some(
        (card) =>
          Array.isArray(
            card.当前层依据编号,
          ),
      ),
    );
  },
);

test(
  "流年主题不能只引用大运背景事实",
  () => {
    const facts = [
      {
        id:
          "F01",
        text:
          "大运干支为癸亥，天干癸为食神透出。",
        evidenceEligible:
          true,
        meta: {
          temporalRole:
            "background",
          domains: [
            "ability_output",
          ],
        },
      },
      {
        id:
          "F02",
        text:
          "流年干支为丙午，天干丙为正官透出。",
        evidenceEligible:
          true,
        meta: {
          temporalRole:
            "current",
          domains: [
            "rules_responsibility",
          ],
        },
      },
    ];

    const normalized =
      normalizeStageReportResponse({
        text:
          report({
            themes: [
              {
                领域编号:
                  "ability_output",
                标题:
                  "能力输出",
                重要度:
                  "高",
                判断:
                  "本年能力输出成为主要主题。",
                现实剧本:
                  "个人更愿意通过实践检验自身能力，并逐步调整表达方式与安排。",
                依据编号: [
                  "F01",
                ],
                应对: [
                  "根据反馈调整。",
                ],
              },
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

    assert.ok(
      validation.errors.some(
        (error) =>
          error.includes(
            "missing_current_stage_evidence",
          ),
      ),
    );
  },
);

test(
  "流月主题中流月新增事实至少占一半",
  () => {
    const facts = [
      {
        id:
          "F01",
        text:
          "大运干支为癸亥，天干癸为食神透出。",
        evidenceEligible:
          true,
        meta: {
          temporalRole:
            "background",
          domains: [
            "ability_output",
          ],
        },
      },
      {
        id:
          "F02",
        text:
          "流年干支为丙午，天干丙为正官透出。",
        evidenceEligible:
          true,
        meta: {
          temporalRole:
            "background",
          domains: [
            "rules_responsibility",
          ],
        },
      },
      {
        id:
          "F03",
        text:
          "大运地支亥与年柱地支寅构成地支六合。",
        evidenceEligible:
          true,
        meta: {
          temporalRole:
            "background",
          domains: [
            "relation_environment_change",
          ],
        },
      },
      {
        id:
          "F04",
        text:
          "流月地支寅与年柱地支寅同支重复，但不是整柱伏吟。",
        evidenceEligible:
          true,
        meta: {
          temporalRole:
            "current",
          domains: [
            "relation_environment_change",
          ],
        },
      },
    ];

    const normalized =
      normalizeStageReportResponse({
        text:
          report({
            themes: [
              {
                领域编号:
                  "relation_environment_change",
                标题:
                  "重复议题",
                重要度:
                  "高",
                判断:
                  "本月同支重复使相似处理模式再次受到关注。",
                现实剧本:
                  "已有安排可能需要重新确认，但应只看本月具体触发，不扩大为长期结论。",
                依据编号: [
                  "F01",
                  "F02",
                  "F03",
                  "F04",
                ],
                应对: [
                  "先确认本月新增变化。",
                ],
              },
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

    assert.ok(
      validation.errors.some(
        (error) =>
          error.includes(
            "current_stage_evidence_ratio_low",
          ),
      ),
    );
  },
);

test(
  "流年一个强显像主题不会被程序强行补成两个",
  () => {
    const facts = [
      {
        id:
          "F01",
        text:
          "流年干支为丙午，天干丙为正官透出。",
        evidenceEligible:
          true,
        meta: {
          temporalRole:
            "current",
          domains: [
            "rules_responsibility",
          ],
        },
      },
      {
        id:
          "F02",
        text:
          "确定生克关系：大运癸克流年丙，施克者为大运癸，受克者为流年丙。",
        evidenceEligible:
          true,
        meta: {
          temporalRole:
            "current",
          domains: [
            "relation_environment_change",
          ],
        },
      },
    ];

    const normalized =
      normalizeStageReportResponse({
        text:
          report({
            themes: [
              {
                领域编号:
                  "rules_responsibility",
                标题:
                  "规则与责任",
                重要度:
                  "高",
                判断:
                  "本年正式要求和责任边界更容易进入关注范围。",
                现实剧本:
                  "现实中可能需要重新理解某项要求，并在个人节奏与外部标准之间做协调。",
                依据编号: [
                  "F01",
                ],
                应对: [
                  "先确认规则细节。",
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
  "没有流月新增事实时不强行制造月度主题",
  () => {
    const facts = [
      {
        id:
          "F01",
        text:
          "大运干支为癸亥，天干癸为食神透出。",
        evidenceEligible:
          true,
        meta: {
          temporalRole:
            "background",
          domains: [
            "ability_output",
          ],
        },
      },
    ];

    const normalized =
      normalizeStageReportResponse({
        text:
          report({
            summary:
              "",
            themes:
              [],
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
      ).length,
      0,
    );

    assert.doesNotMatch(
      rendered,
      /本月主要触发/,
    );

    assert.match(
      rendered,
      /未见足以单独展开的新增强信号/,
    );
  },
);

test(
  "晚年报告会改写升学竞赛和商业化场景",
  () => {
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
          "大运干支为癸亥，天干癸为食神透出。",
        evidenceEligible:
          true,
        meta: {
          temporalRole:
            "current",
          domains: [
            "ability_output",
          ],
        },
      },
    ];

    const normalized =
      normalizeStageReportResponse({
        text:
          report({
            themes: [
              {
                领域编号:
                  "ability_output",
                标题:
                  "能力输出",
                重要度:
                  "高",
                判断:
                  "此运适合为后续职业奠定基础。",
                现实剧本:
                  "可能通过项目、作品或比赛验证能力，并尝试将兴趣商业化。",
                依据编号: [
                  "F02",
                ],
                应对: [
                  "优先完成学业或职业基础。",
                ],
              },
            ],
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
      /升学|竞赛|商业化|后续职业|学业或职业基础/,
    );

    assert.match(
      rendered,
      /兴趣实践|实际用途|生活安排/,
    );
  },
);
