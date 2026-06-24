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
      "原局印星明显，取象仅供候选。",
  },
};

const facts = [
  {
    id: "luck-year-control",
    type: "stem_control",
    label: "天干相克",
    status: "direct",
    category: "direct",
    source: "岁运层级关系",
    participants: ["癸", "丙"],
    meta: {
      controller: "癸",
      controlled: "丙",
      direction: "luck_controls_year",
    },
  },
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
  {
    id: "year-hour-clash",
    type: "branch_六冲",
    label: "地支六冲",
    status: "direct",
    category: "direct",
    source: "流年触发原局",
    participants: ["午", "子"],
    meta: {
      natalPillar: "hour",
      currentBranch: "午",
      targetBranch: "子",
    },
  },
  {
    id: "luck-year-combine",
    type: "branch_六合",
    label: "地支六合",
    status: "direct",
    category: "direct",
    source: "大运触发原局",
    participants: ["亥", "寅"],
    meta: {
      currentBranch: "亥",
      targetBranch: "寅",
    },
  },
];

function buildPack({
  stage = "year",
  ganZhi = "丙午",
} = {}) {
  return buildStageAiTrustedPack({
    stage,
    item: {
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
        facts,
      },
    },
    currentLuckItem: {
      ganZhi: "癸亥",
      stemTenGod: "食神",
      branchMainTenGod: "伤官",
    },
    yearItem: {
      year: 2026,
      ganZhi: "丙午",
      stemTenGod: "正官",
      branchMainTenGod: "七杀",
    },
    baseBaziViewModel,
    natalImageReport: {
      summary: "原局候选总结",
      imageCards: [],
    },
  });
}

function validYearReport() {
  return [
    "### 今年总断",
    "今年存在多个并行主题。",
    "### 主要主题",
    "#### 主题一：学业、资格与正式审核",
    "主要表现：规则、考试或申请要求更突出；职业职责属于次要可能。",
    "依据：官印和结果层关系同时出现。",
    "#### 主题二：感情与关系机会",
    "主要表现：配偶星、日支桃花和日柱关系共同形成候选。",
    "依据：多类机械信号汇合。",
    "#### 主题三：计划与成果调整",
    "主要表现：原定安排、提交或未来计划需要调整。",
    "依据：时支受到直接关系。",
    "### 事情怎样发展",
    "几个主题并行推进，具体落点需要现实验证。",
    "### 有利与风险",
    "有利于调整，风险在于过度推断。",
    "### 现实验证点",
    "观察考试审核、关系互动与计划变动。",
  ].join("\n");
}

test("生成关系白名单和证据汇合", () => {
  const pack = buildPack();

  assert.equal(
    pack.schemaVersion,
    "stage-ai-source-v5",
  );

  assert.ok(
    pack.relationWhitelist.some(
      (entry) =>
        entry.kind === "冲" &&
        entry.branches.includes("午") &&
        entry.branches.includes("子"),
    ),
  );

  assert.equal(
    pack.evidenceConvergences.relationship.priority,
    "must_compare",
  );

  assert.equal(
    pack.evidenceConvergences.standardsReview.priority,
    "must_compare",
  );
});

test("流年强感情汇合不能被完全遗漏", () => {
  const report = validYearReport()
    .replace(
      /#### 主题二：感情与关系机会[\s\S]*?依据：多类机械信号汇合。\n/,
      "",
    );

  const validation = validateStageAiText({
    text: report,
    stage: "year",
    trustedPack: buildPack(),
  });

  assert.equal(validation.valid, false);
  assert.ok(
    validation.hardViolations.includes(
      "missing_relationship_convergence_theme",
    ),
  );
});

test("流年强审核汇合不能被完全遗漏", () => {
  const report = validYearReport()
    .replace(/学业、资格与正式审核/g, "个人调整")
    .replace(/规则、考试或申请要求/g, "外部变化");

  const validation = validateStageAiText({
    text: report,
    stage: "year",
    trustedPack: buildPack(),
  });

  assert.equal(validation.valid, false);
  assert.ok(
    validation.hardViolations.includes(
      "missing_standards_review_theme",
    ),
  );
});

test("白名单外的寅酉暗合会被拦截", () => {
  const report = validYearReport().replace(
    "几个主题并行推进，具体落点需要现实验证。",
    "寅木与酉金形成暗合，因此关系推进。",
  );

  const validation = validateStageAiText({
    text: report,
    stage: "year",
    trustedPack: buildPack(),
  });

  assert.equal(validation.valid, false);
  assert.ok(
    validation.hardViolations.some(
      (entry) =>
        entry.startsWith(
          "unsupported_relation_claim:寅酉:暗合",
        ),
    ),
  );
});

test("白名单内的寅亥合可以使用", () => {
  const report = validYearReport().replace(
    "几个主题并行推进，具体落点需要现实验证。",
    "亥与寅存在六合，但具体落点仍需验证。",
  );

  const validation = validateStageAiText({
    text: report,
    stage: "year",
    trustedPack: buildPack(),
  });

  assert.equal(validation.valid, true);
});

test("亥子两支不能写三会或会局", () => {
  const report = validYearReport().replace(
    "几个主题并行推进，具体落点需要现实验证。",
    "亥子形成三会之势并构成会局。",
  );

  const validation = validateStageAiText({
    text: report,
    stage: "year",
    trustedPack: buildPack(),
  });

  assert.equal(validation.valid, false);
  assert.ok(
    validation.hardViolations.some(
      (entry) =>
        entry.startsWith("incomplete_three_meeting:"),
    ),
  );
});

test("月支不能被称为配偶宫", () => {
  const report = validYearReport().replace(
    "多类机械信号汇合。",
    "日支与月支均为配偶宫。",
  );

  const validation = validateStageAiText({
    text: report,
    stage: "year",
    trustedPack: buildPack(),
  });

  assert.equal(validation.valid, false);
  assert.ok(
    validation.hardViolations.some(
      (entry) =>
        entry.startsWith("invalid_spouse_palace:"),
    ),
  );
});

test("不得把地支关系改写为食神合财", () => {
  const report = validYearReport().replace(
    "几个主题并行推进，具体落点需要现实验证。",
    "本阶段形成食神合财，事情因此落地。",
  );

  const validation = validateStageAiText({
    text: report,
    stage: "year",
    trustedPack: buildPack(),
  });

  assert.equal(validation.valid, false);
  assert.ok(
    validation.hardViolations.some(
      (entry) =>
        entry.startsWith(
          "imprecise_ten_god_relation:",
        ),
    ),
  );
});

test("十神化表述写反生克方向也会拦截", () => {
  const report = validYearReport().replace(
    "几个主题并行推进，具体落点需要现实验证。",
    "大运食伤被流年官星克制，因此表达受限。",
  );

  const validation = validateStageAiText({
    text: report,
    stage: "year",
    trustedPack: buildPack(),
  });

  assert.equal(validation.valid, false);
  assert.ok(
    validation.hardViolations.includes(
      "reversed_ten_god_control:正官->食神",
    ),
  );
});

test("大运不得自行划分开始几年或后半程", () => {
  const report = [
    "### 十年总断",
    "此运有多个主题。",
    "### 主要主题",
    "#### 主题一：技能表达",
    "主要表现：输出增强。",
    "#### 主题二：环境变化",
    "主要表现：向外拓展。",
    "#### 主题三：资源关系",
    "主要表现：需要比较。",
    "### 事情怎样发展",
    "开始几年适应环境，后半程逐渐稳定。",
  ].join("\n");

  const validation = validateStageAiText({
    text: report,
    stage: "luck",
    trustedPack: buildPack({
      stage: "luck",
      ganZhi: "癸亥",
    }),
  });

  assert.equal(validation.valid, false);
  assert.ok(
    validation.hardViolations.some(
      (entry) =>
        entry.startsWith("unsupported_luck_timing:"),
    ),
  );
});

test("高具体度被骗被盗说法会被拦截", () => {
  const report = validYearReport().replace(
    "几个主题并行推进，具体落点需要现实验证。",
    "合作时可能被骗或被盗。",
  );

  const validation = validateStageAiText({
    text: report,
    stage: "year",
    trustedPack: buildPack(),
  });

  assert.equal(validation.valid, false);
  assert.ok(
    validation.hardViolations.some(
      (entry) =>
        entry.startsWith(
          "unsupported_specific_event:",
        ),
    ),
  );
});

test("完整的多主题报告可以通过", () => {
  const validation = validateStageAiText({
    text: validYearReport(),
    stage: "year",
    trustedPack: buildPack(),
  });

  assert.equal(
    validation.valid,
    true,
    validation.hardViolations.join(","),
  );
});
