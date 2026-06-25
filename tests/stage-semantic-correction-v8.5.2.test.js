import test from "node:test";
import assert from "node:assert/strict";

import {
  buildStageSemanticContext,
  describeStemRelation,
  formatLuckDateRange,
} from "../js/core/transit/stageSemanticModel.js";

import {
  buildStageFixedReportModel,
} from "../js/core/transit/buildStageFixedReportModel.js";

import {
  validateStageNarrative,
} from "../js/core/ai/stageFixedNarrativeService.js";

const natalViewModel = {
  pillars: [
    { name: "年柱", stem: "戊", branch: "寅", ganZhi: "戊寅" },
    { name: "月柱", stem: "辛", branch: "酉", ganZhi: "辛酉" },
    { name: "日柱", stem: "辛", branch: "酉", ganZhi: "辛酉" },
    { name: "时柱", stem: "戊", branch: "子", ganZhi: "戊子" },
  ],
};

function yearItem() {
  return {
    year: 2026,
    ganZhi: "丙午",
    stem: "丙",
    branch: "午",
    stemTenGod: "正官",
    branchTenGod: "七杀",
    currentLuckItem: {
      ganZhi: "癸亥",
      stem: "癸",
      branch: "亥",
      tenGod: "食神",
      branchTenGod: "伤官",
    },
    relationToNatal: [
      {
        type: "冲",
        natalPillar: "时支戊子",
        natalBranch: "子",
        description: "冲时支子：执行层被牵动",
      },
    ],
    transitStructure: {
      facts: [
        {
          id: "year:stem-combo",
          text: "流年丙火与月干辛金、日干辛金形成丙辛五合",
          category: "combination",
          status: "direct",
          strength: 90,
          domains: ["self", "career"],
        },
        {
          id: "year:branch-clash",
          text: "流年午支冲原局时支子水",
          category: "direct",
          status: "direct",
          strength: 88,
          domains: ["execution"],
        },
      ],
    },
    triggerImages: {
      storyPack: {
        themeHierarchy: {
          primary: {
            tenGod: "正官",
            summary: "规则、岗位和责任进入主线",
            sourceLevel: "year",
          },
          supporting: {
            tenGod: "七杀",
            summary: "现实环境要求更快回应",
            sourceLevel: "year",
          },
        },
        background: [],
        directTriggers: [
          {
            id: "year:career",
            domain: "career",
            domains: ["career"],
            certainty: "direct",
            status: "direct",
            sourceLevel: "year",
            strength: 90,
            summary: "岗位责任与工作方式需要调整",
            possibleScenes: ["职责调整"],
            usefulDirections: ["先明确责任边界"],
            pressureSignals: ["规则压力"],
            conditions: ["现实中是否出现明确岗位或任务变化"],
          },
          {
            id: "year:execution",
            domain: "execution",
            domains: ["execution"],
            certainty: "direct",
            status: "direct",
            sourceLevel: "year",
            strength: 88,
            summary: "执行节奏和结果路径需要调整",
            possibleScenes: ["时间表变化"],
            usefulDirections: ["保留调整空间"],
            pressureSignals: ["节奏被打断"],
            conditions: ["现实中是否出现计划或时间表调整"],
          },
        ],
        hierarchyInteractions: [],
        convergence: [],
        conditionalPatterns: [],
      },
    },
  };
}

test("大运范围优先使用实际交运月份", () => {
  assert.equal(
    formatLuckDateRange({
      startMonthIndex: 2017 * 12 + 11,
      endMonthIndexExclusive: 2027 * 12 + 11,
      startYear: 2017,
      endYear: 2026,
    }),
    "2017年12月—2027年12月",
  );
});

test("丙合两个辛时识别争合候选且不误判夫妻宫", () => {
  const semantic = buildStageSemanticContext({
    stage: "year",
    item: yearItem(),
    baseBaziViewModel: natalViewModel,
  });

  assert.equal(semantic.combinationDiagnostics.matchCount, 2);
  assert.equal(semantic.combinationDiagnostics.multiplePartner, true);
  assert.equal(semantic.combinationDiagnostics.affectsDayStem, true);
  assert.equal(semantic.relationshipEvidence.dayBranchTriggered, false);
  assert.match(
    semantic.combinationDiagnostics.note,
    /合意分散|争合/,
  );
});

test("癸水克丙火按施克方向解释", () => {
  const relation = describeStemRelation(
    "大运",
    {
      stem: "癸",
      tenGod: "食神",
    },
    "流年",
    {
      stem: "丙",
      stemTenGod: "正官",
    },
  );

  assert.equal(relation.controllerLayer, "大运");
  assert.equal(relation.controlledLayer, "流年");
  assert.match(relation.text, /大运癸.*制约或调节流年丙/);
  assert.match(relation.interpretation, /不能|不应|不等同/);
});

test("固定报告补齐中文领域且保留主象与替代分支", () => {
  const model = buildStageFixedReportModel({
    stage: "year",
    item: yearItem(),
    baseBaziViewModel: natalViewModel,
  });

  assert.equal(model.schemaVersion, "stage-fixed-report-v8.5.2");
  assert.ok(
    model.primaryDomains.some(
      (domain) => domain.label === "任务执行与成果落地",
    ),
  );
  assert.ok(
    model.primaryDomains.every(
      (domain) => !/[a-z_]{3,}/i.test(domain.label),
    ),
  );
  assert.ok(
    model.primaryDomains.some(
      (domain) =>
        Array.isArray(domain.alternativeScenarios),
    ),
  );
  assert.equal(
    model.semanticContext.relationshipEvidence.spousePalaceDirect,
    false,
  );
});

test("语义校验拒绝时间越级、夫妻宫误判、未支持格局和内部key", () => {
  const model = buildStageFixedReportModel({
    stage: "year",
    item: yearItem(),
    baseBaziViewModel: natalViewModel,
  });

  const text = [
    "### 年度总判",
    "今年一定会遇到对象。",
    "### 今年新增的作用",
    "日柱被流年合动，夫妻宫被合动，并形成财破印。",
    "### 最强现实落点",
    "年初主要处理任务执行（execution）。",
    "内容".repeat(50),
  ].join("\n");

  const result = validateStageNarrative({
    text,
    stage: "year",
    fixedReportModel: model,
  });

  assert.equal(result.valid, false);
  assert.ok(result.issues.some((issue) => /夫妻宫|日柱/.test(issue)));
  assert.ok(result.issues.some((issue) => /年内时段/.test(issue)));
  assert.ok(result.issues.some((issue) => /财破印/.test(issue)));
  assert.ok(result.issues.some((issue) => /execution/.test(issue)));
  assert.ok(result.issues.some((issue) => /确定性|确定事件/.test(issue)));
});

test("没有逐年证据时拒绝大运前中后期具体年份", () => {
  const model = {
    semanticContext: {
      temporalEvidence: {
        allowsExactPhaseYears: false,
      },
      relationshipEvidence: {},
      allowedNamedPatterns: [],
    },
  };

  const result = validateStageNarrative({
    text: [
      "### 阶段总判",
      "内容".repeat(50),
      "### 主要现实领域",
      "事业。",
      "### 阶段节奏",
      "前期（2017-2020年）建立资源，中期继续推进。",
      "### 现实验证点",
      "核实。",
    ].join("\n"),
    stage: "luck",
    fixedReportModel: model,
  });

  assert.equal(result.valid, false);
  assert.ok(result.issues.some((issue) => /前中后期/.test(issue)));
});
