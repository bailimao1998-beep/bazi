import test from "node:test";
import assert from "node:assert/strict";

import {
  buildStageAiTrustedPack,
} from "../js/core/ai/buildStageAiTrustedPack.js";

import {
  buildYearAiPrompt,
} from "../js/core/ai/buildYearAiPrompt.js";

import {
  validateStageAiText,
} from "../js/core/ai/stageAiTextValidator.js";

const baseBaziViewModel = {
  birthInfo: {
    gender: "male",
  },
  pillars: [
    {
      key: "year",
      name: "年柱",
      stem: "戊",
      branch: "寅",
      pillar: "戊寅",
      stemTenGod: "正印",
      branchMainTenGod: "正财",
      hiddenStems: [
        {
          stem: "甲",
          tenGod: "正财",
          role: "主气",
        },
      ],
      shensha: [],
    },
    {
      key: "month",
      name: "月柱",
      stem: "辛",
      branch: "酉",
      pillar: "辛酉",
      stemTenGod: "比肩",
      branchMainTenGod: "比肩",
      hiddenStems: [],
      shensha: [],
    },
    {
      key: "day",
      name: "日柱",
      stem: "辛",
      branch: "酉",
      pillar: "辛酉",
      stemTenGod: "日主",
      branchMainTenGod: "比肩",
      hiddenStems: [],
      shensha: [],
    },
    {
      key: "hour",
      name: "时柱",
      stem: "戊",
      branch: "子",
      pillar: "戊子",
      stemTenGod: "正印",
      branchMainTenGod: "食神",
      hiddenStems: [],
      shensha: [],
    },
  ],
  fiveElements: {
    金: 2,
  },
  structureAnalysis: {
    conclusion:
      "原局结构候选解释",
  },
};

const controlFact = {
  id: "control-1",
  type: "stem_control",
  label: "天干相克",
  status: "direct",
  category: "direct",
  source: "岁运层级关系",
  participants: ["癸", "丙"],
  text:
    "前端故事文字不应进入AI。",
  strength: 99,
  domains: ["career"],
  meta: {
    controller: "癸",
    controlled: "丙",
    direction:
      "luck_controls_year",
    formationStatus:
      "not_applicable",
  },
};

function buildPack({
  stage = "year",
  ganZhi = "丙午",
} = {}) {
  const item = {
    year: 2026,
    month: 1,
    ganZhi,
    stemTenGod:
      stage === "month"
        ? "劫财"
        : "正官",
    branchMainTenGod:
      stage === "month"
        ? "正财"
        : "七杀",
    transitStructure: {
      facts: [
        controlFact,
      ],
    },
    triggerImages: {
      threads: [
        {
          id:
            "stage-story-1",
          summary:
            "家庭、房产与合作成为主线。",
        },
      ],
    },
  };

  return buildStageAiTrustedPack({
    stage,
    item,
    currentLuckItem: {
      ganZhi: "癸亥",
      stemTenGod:
        "食神",
      branchMainTenGod:
        "伤官",
    },
    yearItem: {
      year: 2026,
      ganZhi: "丙午",
      stemTenGod:
        "正官",
      branchMainTenGod:
        "七杀",
    },
    baseBaziViewModel,
    natalImageReport: {
      summary:
        "原局候选总结",
      imageCards: [
        {
          id:
            "natal-1",
          title:
            "原局取象",
          summary:
            "原局候选场景",
          evidence: [
            "原局证据",
          ],
        },
      ],
    },
  });
}

test(
  "补回大运藏干及配偶星机械信号",
  () => {
    const pack =
      buildPack();

    const luck =
      pack
        .mechanicalSignals
        .layers
        .luck;

    assert.deepEqual(
      luck.hiddenStems.map(
        (entry) => [
          entry.stem,
          entry.tenGod,
        ],
      ),
      [
        ["壬", "伤官"],
        ["甲", "正财"],
      ],
    );

    assert.ok(
      luck.spouseStarHits.some(
        (entry) =>
          entry.stem ===
            "甲" &&
          entry.tenGod ===
            "正财",
      ),
    );
  },
);

test(
  "2026午命中日支酉桃花并保留依据",
  () => {
    const pack =
      buildPack();

    const year =
      pack
        .mechanicalSignals
        .layers
        .year;

    const peach =
      year.auxiliaryHits.find(
        (entry) =>
          entry.name ===
            "桃花" &&
          entry.basisPillar ===
            "day",
      );

    assert.ok(peach);
    assert.equal(
      peach.basisBranch,
      "酉",
    );
    assert.equal(
      peach.hitBranch,
      "午",
    );
    assert.equal(
      peach.rule,
      "巳酉丑见午",
    );
  },
);

test(
  "庚寅与戊寅只标记同支不是整柱相同",
  () => {
    const pack =
      buildPack({
        stage: "month",
        ganZhi: "庚寅",
      });

    const comparison =
      pack
        .mechanicalSignals
        .layers
        .month
        .natalComparisons
        .find(
          (entry) =>
            entry
              .targetPillar ===
            "year",
        );

    assert.ok(comparison);
    assert.equal(
      comparison.sameBranch,
      true,
    );
    assert.equal(
      comparison.sameStem,
      false,
    );
    assert.equal(
      comparison.samePillar,
      false,
    );
  },
);

test(
  "当前岁运故事仍不会进入可信包",
  () => {
    const serialized =
      JSON.stringify(
        buildPack(),
      );

    assert.doesNotMatch(
      serialized,
      /家庭、房产与合作成为主线/,
    );

    assert.doesNotMatch(
      serialized,
      /stageImages/,
    );
  },
);

test(
  "Prompt要求比较多种现实落点并输出多个主题",
  () => {
    const prompt =
      buildYearAiPrompt({
        baseBaziViewModel,
        natalImageReport: {},
        luckImageReport: {
          luckItems: [
            {
              isCurrent: true,
              ganZhi: "癸亥",
              stemTenGod:
                "食神",
              branchMainTenGod:
                "伤官",
            },
          ],
        },
        yearImageReport: {
          yearItem: {
            year: 2026,
            ganZhi: "丙午",
            stemTenGod:
              "正官",
            branchMainTenGod:
              "七杀",
            transitStructure: {
              facts: [
                controlFact,
              ],
            },
          },
        },
      });

    assert.match(
      prompt.system,
      /二至五个主要主题/,
    );

    assert.match(
      prompt.system,
      /不得默认当事人正在工作、在校/,
    );

    assert.match(
      prompt.system,
      /官星可对应学校规则、考试资格、职业职责、官方手续/,
    );

    assert.match(
      prompt.system,
      /感情关系作为独立候选主题/,
    );

    assert.match(
      prompt.system,
      /主要表现/,
    );

    assert.match(
      prompt.system,
      /次要可能/,
    );
  },
);

test(
  "只有一个主要主题会触发重试",
  () => {
    const validation =
      validateStageAiText({
        text: [
          "### 今年总断",
          "今年有一个主题。",
          "### 主要主题",
          "#### 主题一：规则压力",
          "主要表现：需要适应标准。",
          "### 事情怎样发展",
          "逐步调整。",
        ].join("\n"),
        stage: "year",
        trustedPack:
          buildPack(),
      });

    assert.equal(
      validation.valid,
      false,
    );

    assert.ok(
      validation
        .hardViolations
        .includes(
          "insufficient_primary_themes:1",
        ),
    );
  },
);

test(
  "三个主要主题可以通过结构检查",
  () => {
    const validation =
      validateStageAiText({
        text: [
          "### 今年总断",
          "今年有多个并行主题。",
          "### 主要主题",
          "#### 主题一：学业资格",
          "主要表现：规则与审核。",
          "#### 主题二：感情关系",
          "主要表现：配偶星与桃花汇合。",
          "#### 主题三：计划调整",
          "主要表现：结果层被冲动。",
          "### 事情怎样发展",
          "三条线分别验证。",
        ].join("\n"),
        stage: "year",
        trustedPack:
          buildPack(),
      });

    assert.equal(
      validation.valid,
      true,
    );

    assert.equal(
      validation.themeCount,
      3,
    );
  },
);

test(
  "生克方向写反仍会被拦截",
  () => {
    const validation =
      validateStageAiText({
        text: [
          "### 本月总断",
          "结构需要调整。",
          "### 主要主题",
          "#### 主题一：规则",
          "壬水克制戊土。",
          "#### 主题二：关系",
          "需要现实验证。",
        ].join("\n"),
        stage: "month",
        trustedPack: {
          ...buildPack({
            stage: "month",
            ganZhi: "庚寅",
          }),
          relationFacts: [
            {
              id:
                "reverse-test",
              type:
                "stem_control",
              meta: {
                controller:
                  "戊",
                controlled:
                  "壬",
              },
            },
          ],
        },
      });

    assert.equal(
      validation.valid,
      false,
    );

    assert.ok(
      validation
        .hardViolations
        .includes(
          "reversed_control:壬->戊",
        ),
    );
  },
);
