import test from "node:test";
import assert from "node:assert/strict";

import {
  buildStageStructuredPromptSource,
  buildStageVerifiedFactPack,
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
        id: "control",
        meta: {
          controller: "丙",
          controlled: "庚",
        },
      },
      {
        id: "generic-combine",
        text: "天干五合。",
      },
      {
        id: "specific-combine",
        type: "stem_combine",
        meta: {
          currentStem: "丙",
          targetStem: "辛",
          transformationStatus: "unresolved",
        },
      },
      {
        id: "generic-clash",
        text: "冲。",
      },
    ],
    evidenceConvergences: {
      relationship: {
        theme: "relationship",
        independentEvidenceCount: 2,
        priority: "medium",
      },
    },
  };
}

test(
  "背景资料不可作为主题依据",
  () => {
    const result =
      buildStageVerifiedFactPack(
        samplePack(),
      );

    assert.ok(
      result.backgroundFacts.length >=
      5,
    );

    assert.ok(
      result.evidenceFacts.length >=
      5,
    );

    assert.ok(
      result.backgroundFacts.every(
        (fact) =>
          !result.factIds.includes(
            fact.id,
          ),
      ),
    );

    assert.ok(
      result.evidenceFacts.every(
        (fact) =>
          result.factIds.includes(
            fact.id,
          ),
      ),
    );
  },
);

test(
  "泛化关系标签不进入确定依据",
  () => {
    const result =
      buildStageVerifiedFactPack(
        samplePack(),
      );

    const texts =
      result.facts.map(
        (fact) =>
          fact.text,
      );

    assert.equal(
      texts.includes(
        "天干五合。",
      ),
      false,
    );

    assert.equal(
      texts.includes(
        "冲。",
      ),
      false,
    );

    assert.ok(
      texts.some(
        (value) =>
          value.includes(
            "丙与辛构成天干五合",
          ) &&
          value.includes(
            "不能写成已经成局或合化",
          ),
      ),
    );
  },
);

test(
  "提示资料分离背景与可引用事实",
  () => {
    const result =
      buildStageVerifiedFactPack(
        samplePack(),
      );

    const source =
      buildStageStructuredPromptSource(
        result,
      );

    assert.ok(
      Array.isArray(
        source.背景资料,
      ),
    );

    assert.ok(
      Array.isArray(
        source.可引用事实,
      ),
    );

    assert.ok(
      source.可引用事实.every(
        (fact) =>
          /^F\d{2}$/.test(
            fact.编号,
          ),
      ),
    );

    assert.equal(
      source.背景资料.some(
        (value) =>
          /本次分析目标/.test(
            value,
          ),
      ),
      true,
    );
  },
);
