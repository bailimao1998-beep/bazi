import test from "node:test";
import assert from "node:assert/strict";

import {
  buildStageReportSystem,
} from "../js/core/ai/stageReportPromptPolicy.js";

import {
  validateStageAiText,
} from "../js/core/ai/stageAiTextValidator.js";

function basePack({
  luckTenGod = "食神",
  yearTenGod = "食神",
  monthTenGod = "七杀",
} = {}) {
  return {
    relationFacts: [],
    relationWhitelist: [],
    evidenceConvergences: {},
    factualContext: {
      natal: {
        pillars: [],
      },
    },
    mechanicalSignals: {
      layers: {
        luck: {
          stemTenGod:
            luckTenGod,
        },
        year: {
          stemTenGod:
            yearTenGod,
        },
        month: {
          stemTenGod:
            monthTenGod,
        },
      },
    },
  };
}

function reportWith(
  extra,
) {
  return [
    "### 今年总断",
    "今年主要围绕规则、关系与计划调整展开。",
    "### 主要主题",
    "#### 学业与审核",
    "核心判断：考试、申请或正式审核是较强落点。",
    "最可能的剧本：外部要求先明确，随后需要调整材料与表达方式。",
    "关键依据：官印与成果层信号共同出现。",
    "应对建议：提前核对要求并预留修改空间。",
    "#### 感情与关系",
    "核心判断：关系机会增加，但需要观察持续投入。",
    "最可能的剧本：互动增强后，现实安排会成为筛选因素。",
    "关键依据：配偶星与日柱关系共同参与。",
    "应对建议：观察责任、投入和实际安排。",
    "### 可能的发展路径",
    extra,
    "### 有利与风险",
    "- 有利：标准明确后更容易集中准备。",
    "- 风险：避免过早下结论。",
    "### 行动建议",
    "1. 重要材料提前复查。",
    "2. 关系中观察持续行动。",
    "### 现实验证",
    "1. 是否出现审核或计划修改？",
    "2. 是否出现持续关系互动？",
  ].join("\n");
}

test(
  "提示词要求按强中弱证据分级故事",
  () => {
    const system =
      buildStageReportSystem(
        "year",
      );

    assert.match(
      system,
      /证据分级/,
    );

    assert.match(
      system,
      /强证据可以作为主要主题/,
    );

    assert.match(
      system,
      /弱证据不得独立扩写/,
    );

    assert.match(
      system,
      /透干与藏支必须区分/,
    );

    assert.match(
      system,
      /不得默认当事人是学生、职员、退休者/,
    );
  },
);

test(
  "只有食神双透时写食伤齐透会记录警告",
  () => {
    const result =
      validateStageAiText({
        text:
          reportWith(
            "大运流年食伤齐透，推动表达与成果。",
          ),
        stage: "year",
        trustedPack:
          basePack({
            luckTenGod:
              "食神",
            yearTenGod:
              "食神",
          }),
      });

    assert.equal(
      result.safeToDisplay,
      true,
    );

    assert.ok(
      result.hardViolations.some(
        (entry) =>
          entry.startsWith(
            "unsupported_transparency_claim:",
          ),
      ),
    );
  },
);

test(
  "食神与伤官确实都透时允许食伤齐透",
  () => {
    const result =
      validateStageAiText({
        text:
          reportWith(
            "大运流年食伤齐透，推动表达与成果。",
          ),
        stage: "year",
        trustedPack:
          basePack({
            luckTenGod:
              "食神",
            yearTenGod:
              "伤官",
          }),
      });

    assert.equal(
      result.hardViolations.some(
        (entry) =>
          entry.startsWith(
            "unsupported_transparency_claim:",
          ),
      ),
      false,
    );
  },
);

test(
  "分居第三者和退休金等具体剧情会记录提示但不阻断",
  () => {
    const result =
      validateStageAiText({
        text:
          reportWith(
            "关系可能出现短暂分居或第三者，同时需要处理退休金。",
          ),
        stage: "year",
        trustedPack:
          basePack(),
      });

    assert.equal(
      result.safeToDisplay,
      true,
    );

    assert.ok(
      result.hardViolations.some(
        (entry) =>
          entry.startsWith(
            "over_specific_story:",
          ),
      ),
    );
  },
);
