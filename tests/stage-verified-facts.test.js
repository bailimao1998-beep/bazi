import test from "node:test";
import assert from "node:assert/strict";

import {
  buildStageVerifiedFactPack,
  buildStageStructuredPromptSource,
} from "../js/core/ai/buildStageVerifiedFactPack.js";

function samplePack() {
  return {
    stage: "month",
    target: {
      ganZhi: "庚寅",
      year: 2026,
      month: 2,
    },
    factualContext: {
      natal: {
        pillars: [
          {
            key: "year",
            ganZhi: "戊寅",
            stem: "戊",
            branch: "寅",
            stemTenGod: "正印",
            hiddenStems: [
              {
                stem: "甲",
                tenGod: "正财",
              },
            ],
          },
          {
            key: "month",
            ganZhi: "辛酉",
            stem: "辛",
            branch: "酉",
            stemTenGod: "比肩",
          },
          {
            key: "day",
            ganZhi: "辛酉",
            stem: "辛",
            branch: "酉",
            stemTenGod: "日主",
          },
          {
            key: "hour",
            ganZhi: "戊子",
            stem: "戊",
            branch: "子",
            stemTenGod: "正印",
          },
        ],
      },
    },
    mechanicalSignals: {
      layers: {
        luck: {
          ganZhi: "癸亥",
          stem: "癸",
          branch: "亥",
          stemTenGod: "食神",
          hiddenStems: [
            {
              stem: "壬",
              tenGod: "伤官",
            },
            {
              stem: "甲",
              tenGod: "正财",
            },
          ],
        },
        year: {
          ganZhi: "丙午",
          stem: "丙",
          branch: "午",
          stemTenGod: "正官",
        },
        month: {
          ganZhi: "庚寅",
          stem: "庚",
          branch: "寅",
          stemTenGod: "劫财",
          natalComparisons: [
            {
              targetPillar: "year",
              currentBranch: "寅",
              targetBranch: "寅",
              sameBranch: true,
              samePillar: false,
            },
          ],
        },
      },
    },
    relationFacts: [
      {
        id: "control-1",
        meta: {
          controller: "丙",
          controlled: "庚",
        },
      },
      {
        id: "condition-1",
        type: "three_meeting",
        meta: {
          currentBranch: "亥",
          targetBranch: "子",
          formationStatus: "condition_only",
        },
      },
    ],
    evidenceConvergences: {
      relationship: {
        theme: "relationship",
        independentEvidenceCount: 2,
        priority: "medium",
      },
      review: {
        theme: "standardsReview",
        independentEvidenceCount: 3,
        mustCompare: true,
      },
    },
  };
}

test(
  "程序生成带编号的确定事实",
  () => {
    const pack =
      buildStageVerifiedFactPack(
        samplePack(),
      );

    assert.ok(
      pack.facts.length >=
      8,
    );

    assert.equal(
      pack.facts[0].id,
      "F01",
    );

    assert.ok(
      pack.facts.some(
        (fact) =>
          fact.text.includes(
            "丙克庚",
          ) &&
          fact.text.includes(
            "施克者为丙",
          ),
      ),
    );

    assert.ok(
      pack.facts.some(
        (fact) =>
          fact.text.includes(
            "同支重复",
          ) &&
          fact.text.includes(
            "不是整柱伏吟",
          ),
      ),
    );

    assert.ok(
      pack.facts.some(
        (fact) =>
          fact.text.includes(
            "壬伤官",
          ) &&
          fact.text.includes(
            "藏支信号",
          ),
      ),
    );
  },
);

test(
  "提示资料只暴露事实编号与中文事实",
  () => {
    const pack =
      buildStageVerifiedFactPack(
        samplePack(),
      );

    const source =
      buildStageStructuredPromptSource(
        pack,
      );

    assert.ok(
      Array.isArray(
        source.已确认事实,
      ),
    );

    assert.ok(
      source.已确认事实.every(
        (fact) =>
          /^F\d{2}$/.test(
            fact.编号,
          ),
      ),
    );

    assert.equal(
      source.基础资料,
      undefined,
    );

    assert.equal(
      source.机械信号,
      undefined,
    );
  },
);
