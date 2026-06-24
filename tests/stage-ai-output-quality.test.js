import test from "node:test";
import assert from "node:assert/strict";

import {
  buildStageAiPromptSource,
} from "../js/core/ai/buildStageAiPromptSource.js";

import {
  buildStageReportSystem,
} from "../js/core/ai/stageReportPromptPolicy.js";

import {
  buildYearAiPrompt,
} from "../js/core/ai/buildYearAiPrompt.js";

import {
  validateStageAiText,
} from "../js/core/ai/stageAiTextValidator.js";

function trustedPack() {
  return {
    stage: "year",
    stageLabel: "流年",
    target: {
      year: 2026,
      ganZhi: "丙午",
    },
    factualContext: {
      natal: {
        gender: "male",
        dayMaster: "辛",
        pillars: [
          {
            key: "day",
            name: "日柱",
            stem: "辛",
            branch: "酉",
            ganZhi: "辛酉",
            stemTenGod: "日主",
            branchMainTenGod: "比肩",
            hiddenStems: [],
            shensha: [],
          },
        ],
        fiveElements: {
          金: 2,
        },
      },
      luck: {
        ganZhi: "癸亥",
        stemTenGod: "食神",
        branchMainTenGod: "伤官",
        hiddenStems: [
          {
            stem: "甲",
            tenGod: "正财",
            role: "中气",
          },
        ],
      },
      year: {
        year: 2026,
        ganZhi: "丙午",
        stemTenGod: "正官",
        branchMainTenGod: "七杀",
        hiddenStems: [],
      },
      month: null,
    },
    relationFacts: [
      {
        id: "year-day-combine",
        type: "stem_combine",
        label: "天干五合",
        status: "direct",
        category: "direct",
        source: "流年触发原局",
        participants: ["丙", "辛"],
        meta: {
          natalPillar: "day",
          currentStem: "丙",
          targetStem: "辛",
        },
      },
    ],
    relationWhitelist: [
      {
        id: "year-day-combine",
        kind: "合",
        stems: ["丙", "辛"],
        branches: [],
        status: "direct",
      },
    ],
    mechanicalSignals: {
      dayMaster: {
        stem: "辛",
        element: "金",
        polarity: "yin",
      },
      spouseStarRule: {
        gender: "male",
        tenGods: ["正财", "偏财"],
        rule: "男命以财星作为配偶星候选。",
      },
      layers: {
        luck: {
          layer: "luck",
          ganZhi: "癸亥",
          stem: "癸",
          branch: "亥",
          stemTenGod: "食神",
          branchMainTenGod: "伤官",
          hiddenStems: [],
          spouseStarHits: [],
          auxiliaryHits: [],
          natalComparisons: [],
          shensha: [],
        },
        year: {
          layer: "year",
          ganZhi: "丙午",
          stem: "丙",
          branch: "午",
          stemTenGod: "正官",
          branchMainTenGod: "七杀",
          hiddenStems: [],
          spouseStarHits: [],
          auxiliaryHits: [],
          natalComparisons: [],
          shensha: [],
        },
        month: null,
      },
      convergence: {
        repeatedTenGods: [],
        spouseStarLayers: [],
        auxiliaryHits: [],
      },
    },
    evidenceConvergences: {
      natalTenGodCounts: {
        正印: 2,
      },
      relationship: {
        priority: "optional",
        independentEvidenceCount: 1,
        instruction: "比较感情与资源。",
      },
      standardsReview: {
        priority: "must_compare",
        independentEvidenceCount: 2,
        officerLayers: [
          {
            layer: "year",
            ganZhi: "丙午",
            tenGods: ["正官", "七杀"],
          },
        ],
        natalSealCount: 2,
        instruction: "比较学业资格、职业职责和官方手续。",
      },
      outputAndRules: {
        priority: "must_compare",
        independentEvidenceCount: 2,
        instruction: "比较考试表达与规则。",
      },
      planAndResults: {
        priority: "optional",
        independentEvidenceCount: 1,
        instruction: "比较计划与成果。",
      },
    },
    candidateInterpretations: {
      natalStructure: {
        conclusion:
          "原局印星明显。",
        internalKey:
          "standardsReview",
      },
      natalSummary:
        "原局候选总结。",
      natalImages: [
        {
          id: "natal-1",
          title: "原局取象",
          summary: "重视知识积累。",
          evidence: ["印星较多"],
        },
      ],
    },
    allowedEvidenceRefs: [
      "year-day-combine",
      "natal-1",
    ],
  };
}

function conciseReport() {
  return [
    "### 今年总断",
    "今年最明显的是规则审核、关系互动与计划调整。重点不是单一事业变化，而是如何在标准要求下完成自己的事情。",
    "### 主要主题",
    "#### 学业、资格与正式审核",
    "结论：考试、申请、论文或资格审核较容易成为主要现实落点。职业职责属于次要可能，但证据弱于学业与手续。",
    "依据：官星出现，原局印星较多，并有日柱关系参与。",
    "#### 感情与关系互动",
    "结论：关系机会有所增加，但仍应以现实互动是否持续作为判断依据。",
    "依据：财星进入大运，流年关系直接作用自身。",
    "#### 计划与成果调整",
    "结论：原定安排可能需要修改，重点在提交、执行和未来计划。",
    "依据：成果层与流年关系同时被引动。",
    "### 有利与风险",
    "- 有利：按标准准备更容易得到结果。",
    "- 有利：关系表达更直接。",
    "- 风险：不要把一次互动判断成确定结果。",
    "### 现实验证",
    "1. 是否正在准备考试、论文、申请或资格材料？",
    "2. 是否出现持续而非一次性的关系互动？",
    "3. 是否有原定计划需要重新提交或调整？",
  ].join("\n");
}

test(
  "发送给模型的资料包只使用中文键名",
  () => {
    const source =
      buildStageAiPromptSource(
        trustedPack(),
      );

    const serialized =
      JSON.stringify(source);

    assert.doesNotMatch(
      serialized,
      /\b(?:relationFacts|relationWhitelist|mechanicalSignals|evidenceConvergences|must_compare|standardsReview|sourcePack)\b/,
    );

    assert.doesNotMatch(
      serialized,
      /\b[A-Za-z][A-Za-z0-9_]{2,}\b/,
    );

    assert.match(
      serialized,
      /学业资格与规则/,
    );
  },
);

test(
  "系统提示使用真实换行且要求中文精简",
  () => {
    const system =
      buildStageReportSystem(
        "year",
      );

    assert.match(
      system,
      /\n### 主要主题/,
    );

    assert.doesNotMatch(
      system,
      /\\n### 主要主题/,
    );

    assert.match(
      system,
      /只使用简体中文/,
    );

    assert.match(
      system,
      /不再设置“事情怎样发展”和“其他较弱影响”/,
    );
  },
);

test(
  "流年请求使用中文资料包并降低输出上限",
  () => {
    const prompt =
      buildYearAiPrompt({
        baseBaziViewModel: {
          birthInfo: {
            gender: "male",
          },
          pillars: [],
        },
        natalImageReport: {},
        luckImageReport: {
          luckItems: [],
        },
        yearImageReport: {
          yearItem: {
            year: 2026,
            ganZhi: "丙午",
            transitStructure: {
              facts: [],
            },
          },
        },
      });

    const payload =
      JSON.parse(
        prompt.user,
      );

    assert.ok(
      payload.资料包,
    );

    assert.equal(
      "sourcePack" in payload,
      false,
    );

    assert.equal(
      prompt.maxTokens,
      2400,
    );
  },
);

test(
  "英文内部字段会触发重试",
  () => {
    const text =
      conciseReport().replace(
        "官星出现",
        "standardsReview 为 must_compare，官星出现",
      );

    const result =
      validateStageAiText({
        text,
        stage: "year",
        trustedPack:
          trustedPack(),
      });

    assert.equal(
      result.valid,
      false,
    );

    assert.ok(
      result.hardViolations.some(
        (entry) =>
          entry.startsWith(
            "non_chinese_or_internal_term:",
          ),
      ),
    );
  },
);

test(
  "旧的重复章节会被拦截",
  () => {
    const text = [
      conciseReport(),
      "### 事情怎样发展",
      "前文内容再次展开。",
    ].join("\n");

    const result =
      validateStageAiText({
        text,
        stage: "year",
        trustedPack:
          trustedPack(),
      });

    assert.equal(
      result.valid,
      false,
    );

    assert.ok(
      result.hardViolations.some(
        (entry) =>
          entry.startsWith(
            "redundant_section:",
          ),
      ),
    );
  },
);

test(
  "高度重复的长句会被拦截",
  () => {
    const repeated =
      "今年需要在规则要求下完成考试申请与材料审核，同时调整个人表达和执行方式";

    const text = [
      conciseReport(),
      repeated + "。",
      repeated + "。",
    ].join("\n");

    const result =
      validateStageAiText({
        text,
        stage: "year",
        trustedPack:
          trustedPack(),
      });

    assert.equal(
      result.valid,
      false,
    );

    assert.ok(
      result.hardViolations.some(
        (entry) =>
          entry.startsWith(
            "repetitive_content:",
          ),
      ),
    );
  },
);

test(
  "超长流年报告会被拦截",
  () => {
    const text =
      conciseReport() +
      "补充说明".repeat(
        400,
      );

    const result =
      validateStageAiText({
        text,
        stage: "year",
        trustedPack:
          trustedPack(),
      });

    assert.equal(
      result.valid,
      false,
    );

    assert.ok(
      result.hardViolations.some(
        (entry) =>
          entry.startsWith(
            "report_too_long:",
          ),
      ),
    );
  },
);

test(
  "精简中文多主题报告可以通过",
  () => {
    const result =
      validateStageAiText({
        text:
          conciseReport(),
        stage: "year",
        trustedPack:
          trustedPack(),
      });

    assert.equal(
      result.valid,
      true,
      result.hardViolations.join(
        ",",
      ),
    );
  },
);
