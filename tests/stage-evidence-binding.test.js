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
    meta: {
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
      domains: [
        "rules_responsibility",
      ],
    },
  },
  {
    id:
      "F03",
    text:
      "流月干支为庚寅，天干庚为劫财透出。",
    evidenceEligible:
      true,
    meta: {
      domains: [
        "peer_boundary",
      ],
    },
  },
  {
    id:
      "F04",
    text:
      "确定生克关系：大运癸克流年丙，施克者为大运癸，受克者为流年丙。",
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
      "F05",
    text:
      "流月地支寅与年柱地支寅同支重复，但不是整柱伏吟。",
    evidenceEligible:
      true,
    meta: {
      domains: [
        "relation_environment_change",
      ],
    },
  },
];

function baseReport(
  themes,
  extra = {},
) {
  return JSON.stringify({
    总断:
      "本阶段以能力输出、正式要求和现实调整之间的协调为主，具体落点取决于当前事务。",
    主题:
      themes,
    有利:
      extra.有利 ||
      [],
    风险:
      extra.风险 ||
      [],
    行动建议:
      extra.行动建议 ||
      [],
    现实验证:
      extra.现实验证 ||
      [],
  });
}

function theme({
  domainId,
  title,
  story,
  evidenceIds,
  judgment =
    "当前主题有明确事实支持，但仍需要结合现实条件判断具体表现。",
} = {}) {
  return {
    领域编号:
      domainId,
    标题:
      title,
    重要度:
      "高",
    判断:
      judgment,
    现实剧本:
      story,
    可能表现: [
      "较可能表现为既有计划需要调整。",
    ],
    补充可能:
      "",
    依据编号:
      evidenceIds,
    应对: [
      "先确认现实条件，再逐步推进。",
    ],
  };
}

test(
  "正文提到劫财但主题没有引用劫财事实会被发现",
  () => {
    const raw =
      baseReport([
        theme({
          domainId:
            "ability_output",
          title:
            "表达与资源",
          story:
            "大运食神支持表达，但流月劫财会带来合作和资源分配问题，需要在输出时兼顾他人。",
          evidenceIds: [
            "F01",
          ],
        }),
        theme({
          domainId:
            "relation_environment_change",
          title:
            "相似议题再触发",
          story:
            "同支重复提示相似议题再次出现，但不是整柱伏吟，需要更换处理方式。",
          evidenceIds: [
            "F05",
          ],
        }),
      ]);

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
            "unbound_tengod:劫财",
          ),
      ),
    );
  },
);

test(
  "十神关系必须引用双方和明确关系事实",
  () => {
    const raw =
      baseReport([
        theme({
          domainId:
            "ability_output",
          title:
            "食神制官",
          story:
            "食神制官使个人表达与正式要求发生拉扯，过程需要反复协调。",
          evidenceIds: [
            "F01",
            "F02",
          ],
        }),
        theme({
          domainId:
            "relation_environment_change",
          title:
            "结构调整",
          story:
            "相似议题被重新激活，需要根据现实条件改变原有做法。",
          evidenceIds: [
            "F05",
          ],
        }),
      ]);

    const normalized =
      normalizeStageReportResponse({
        text:
          raw,
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
            "unbound_tengod_relation",
          ),
      ),
    );
  },
);

test(
  "否定冲合与等待引动的判断会被删除",
  () => {
    const raw =
      baseReport([
        theme({
          domainId:
            "ability_output",
          title:
            "能力输出",
          story:
            "大运食神使表达与成果意识增强，适合通过实践验证能力。",
          evidenceIds: [
            "F01",
          ],
        }),
        theme({
          domainId:
            "relation_environment_change",
          title:
            "环境调整",
          story:
            "相似议题可能再次出现，需要根据当前条件调整处理方式。",
          evidenceIds: [
            "F05",
          ],
        }),
      ], {
        风险: [
          "大运未与年支产生冲合，外部机会信号偏弱，需要流年引动才能兑现。",
        ],
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

    assert.ok(
      validation.errors.some(
        (error) =>
          error.includes(
            "unsupported_negative_relation",
          ),
      ),
    );

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
      /未与年支产生冲合|机会信号偏弱|需要流年引动/,
    );
  },
);

test(
  "残缺主题不再显示且格式自动清理",
  () => {
    const raw =
      baseReport([
        theme({
          domainId:
            "ability_output",
          title:
            "能力输出",
          story:
            "大运食神使表达与成果意识增强，适合通过实践验证能力。",
          evidenceIds: [
            "F01",
          ],
        }),
        {
          领域编号:
            "peer_boundary",
          标题:
            "空主题",
          重要度:
            "中",
          判断:
            "",
          现实剧本:
            "流月劫财带来同辈参与和边界议题，需要结合现实事务判断。",
          可能表现:
            [],
          补充可能:
            "",
          依据编号: [
            "F03",
          ],
          应对:
            [],
        },
      ], {
        现实验证: [
          "观察本本月过程中是否出现新的调整。？",
        ],
      });

    const normalized =
      normalizeStageReportResponse({
        text:
          raw,
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
      1,
    );

    assert.doesNotMatch(
      rendered,
      /本本月|。？/,
    );

    assert.match(
      rendered,
      /本月过程中是否出现新的调整？/,
    );
  },
);


test(
  "无关的生克事实不能支持食神制官",
  () => {
    const unrelatedFacts = [
      ...facts,
      {
        id:
          "F06",
        text:
          "确定生克关系：流年丙克流月庚，施克者为流年丙，受克者为流月庚。",
        evidenceEligible:
          true,
        meta: {
          domains: [
            "relation_environment_change",
          ],
        },
      },
    ];

    const raw =
      baseReport([
        theme({
          domainId:
            "ability_output",
          title:
            "食神制官",
          story:
            "食神制官使表达与正式要求产生拉扯，需要调整沟通方式。",
          evidenceIds: [
            "F01",
            "F02",
            "F06",
          ],
        }),
        theme({
          domainId:
            "relation_environment_change",
          title:
            "结构调整",
          story:
            "同支重复使相似议题再次被注意，但不代表整柱伏吟。",
          evidenceIds: [
            "F05",
          ],
        }),
      ]);

    const normalized =
      normalizeStageReportResponse({
        text:
          raw,
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
          unrelatedFacts,
      });

    assert.ok(
      validation.errors.some(
        (error) =>
          error.includes(
            "unbound_tengod_relation",
          ),
      ),
    );
  },
);

test(
  "正文写同支重复时必须引用同支事实",
  () => {
    const raw =
      baseReport([
        theme({
          domainId:
            "ability_output",
          title:
            "能力与重复议题",
          story:
            "大运食神支持成果整理，同时同支重复使相似议题再次出现。",
          evidenceIds: [
            "F01",
          ],
        }),
        theme({
          domainId:
            "rules_responsibility",
          title:
            "正式要求",
          story:
            "流年正官使正式要求更明确，需要结合当前事务协调。",
          evidenceIds: [
            "F02",
          ],
        }),
      ]);

    const normalized =
      normalizeStageReportResponse({
        text:
          raw,
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
            "unbound_branch_relation:同支重复",
          ),
      ),
    );
  },
);
