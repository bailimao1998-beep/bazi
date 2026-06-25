import test from "node:test";
import assert from "node:assert/strict";

import {
  canonicalizeStructureFact,
  computeTenGod,
  filterEligibleRules,
  validateReportSemantics,
} from "../js/core/ai/stageFactRuleGuard.js";
import { buildStageRawFactPack } from "../js/core/ai/buildStageRawFactPack.js";
import { buildStageImageCandidatePack } from "../js/core/ai/buildStageImageCandidatePack.js";
import { validateStageAiReport } from "../js/core/ai/stageAiReportContract.js";

const baseBaziViewModel = {
  birthInfo: {
    gender: "male",
    solarDate: "1998-09-11",
  },
  pillars: [
    { key: "year", name: "年柱", pillar: "戊寅", stem: "戊", branch: "寅", stemTenGod: "正印", branchMainTenGod: "正财" },
    { key: "month", name: "月柱", pillar: "辛酉", stem: "辛", branch: "酉", stemTenGod: "比肩", branchMainTenGod: "比肩" },
    { key: "day", name: "日柱", pillar: "辛酉", stem: "辛", branch: "酉", stemTenGod: "比肩", branchMainTenGod: "比肩" },
    { key: "hour", name: "时柱", pillar: "戊子", stem: "戊", branch: "子", stemTenGod: "正印", branchMainTenGod: "食神" },
  ],
};

const luckItem = {
  id: "luck:gui-hai",
  ganZhi: "癸亥",
  stem: "癸",
  branch: "亥",
  stemTenGod: "食神",
  branchMainTenGod: "伤官",
  ageRange: "19-28岁",
  yearRange: "2017-2027",
  transitStructure: {
    facts: [
      {
        id: "fact:meeting",
        type: "partial_meeting",
        label: "三会两支",
        status: "condition_only",
        participants: ["luck:gui-hai", "natal:hour"],
        meta: { members: ["亥", "子"], element: "水" },
      },
      {
        id: "fact:harmony",
        type: "branch_six_harmony",
        label: "六合",
        status: "direct",
        participants: ["luck:gui-hai", "natal:year"],
        meta: { members: ["亥", "寅"] },
      },
    ],
  },
};

test("十神按日主重新核对", () => {
  assert.equal(computeTenGod("辛", "戊"), "正印");
  assert.equal(computeTenGod("辛", "癸"), "食神");
  assert.equal(computeTenGod("辛", "壬"), "伤官");
  assert.equal(computeTenGod("辛", "甲"), "正财");
  assert.equal(computeTenGod("辛", "乙"), "偏财");
  assert.equal(computeTenGod("辛", "丙"), "正官");
  assert.equal(computeTenGod("辛", "丁"), "七杀");
});

test("关系术语标准化", () => {
  const meeting = canonicalizeStructureFact({
    type: "partial_meeting",
    relation: "半会",
    status: "direct",
    meta: { members: ["亥", "子"] },
  });
  assert.equal(meeting.relation, "三会两支");
  assert.equal(meeting.certainty, "conditional");

  const punishment = canonicalizeStructureFact({
    type: "branch_punishment",
    relation: "刑",
    status: "direct",
    meta: { members: ["子", "卯"] },
  });
  assert.equal(punishment.relation, "刑");
  assert.equal(punishment.meta.punishmentName, "无礼之刑");
});

test("原局与大运硬事实预检通过", () => {
  const pack = buildStageRawFactPack({
    stage: "luck",
    item: luckItem,
    baseBaziViewModel,
    natalImageReport: {},
  });

  assert.equal(pack.natal.gender, "male");
  assert.equal(pack.natal.dayMaster, "辛");
  assert.equal(pack.layers.current.stemTenGod, "食神");
  assert.equal(pack.layers.current.branchMainTenGod, "伤官");
  assert.equal(pack.validation.usable, true, pack.validation.errors.join("；"));
  assert.equal(pack.facts.find((fact) => fact.id === "fact:meeting")?.relation, "三会两支");
});

test("基础十神不一致时阻断", () => {
  const invalid = structuredClone(baseBaziViewModel);
  invalid.pillars[0].stemTenGod = "偏印";
  const pack = buildStageRawFactPack({
    stage: "luck",
    item: luckItem,
    baseBaziViewModel: invalid,
    natalImageReport: {},
  });
  assert.equal(pack.validation.usable, false);
  assert.match(pack.validation.errors.join("；"), /戊的十神应为正印/);
});

test("男命排除女命专用候选规则", () => {
  const rawFactPack = buildStageRawFactPack({
    stage: "luck",
    item: luckItem,
    baseBaziViewModel,
    natalImageReport: {},
  });

  const stageRulePack = {
    matchedRules: [
      {
        id: "female-only",
        title: "女命食伤与官杀边界",
        scopes: ["luck"],
        matchedBy: ["十神:食神、伤官"],
        claimSupportAllowed: true,
        imagery: { core: ["女命夫星关系"] },
      },
      {
        id: "output-rule",
        title: "食伤输出",
        scopes: ["luck"],
        matchedBy: ["十神:食神、伤官"],
        claimSupportAllowed: true,
        imagery: { core: ["技能与成果输出"] },
      },
    ],
    methodologyRules: [],
  };

  const candidatePack = buildStageImageCandidatePack({
    stage: "luck",
    rawFactPack,
    stageRulePack,
  });

  assert.deepEqual(candidatePack.candidateRuleIds, ["output-rule"]);
  assert.equal(candidatePack.eligibility.excludedRules[0].id, "female-only");
});

test("输出语义硬伤会被拦截", () => {
  const rawFactPack = buildStageRawFactPack({
    stage: "luck",
    item: luckItem,
    baseBaziViewModel,
    natalImageReport: {},
  });
  const candidatePack = {
    candidateImages: [
      {
        ruleId: "output-rule",
        evidenceIds: ["fact:luck:gui-hai:stem-ten-god"],
        allowedScenes: ["技能输出"],
      },
    ],
  };

  const issues = validateReportSemantics({
    report: {
      overallJudgment: "女命以官杀为夫星，食伤齐透。亥子半会水局，需注意泌尿系统。",
      selectedImages: [],
    },
    stage: "luck",
    rawFactPack,
    candidatePack,
  });

  assert.ok(issues.some((item) => item.includes("男命报告误用了女命")));
  assert.ok(issues.some((item) => item.includes("食伤齐透")));
  assert.ok(issues.some((item) => item.includes("亥子两支")));
  assert.ok(issues.some((item) => item.includes("具体器官")));
});

test("完整大运九步报告校验会合并事实与语义检查", () => {
  const rawFactPack = buildStageRawFactPack({
    stage: "luck",
    item: luckItem,
    baseBaziViewModel,
    natalImageReport: {},
  });
  const stemFactId = "fact:luck:gui-hai:stem-ten-god";
  const branchFactId = "fact:luck:gui-hai:branch-ten-god";
  const candidatePack = {
    candidateImages: [
      { ruleId: "output-rule", evidenceIds: [stemFactId], allowedScenes: ["技能输出"] },
      { ruleId: "branch-rule", evidenceIds: [branchFactId], allowedScenes: ["环境承接"] },
      { ruleId: "relation-rule", evidenceIds: ["fact:harmony"], allowedScenes: ["关系磨合"] },
    ],
  };
  const report = {
    stage: "luck",
    overallJudgment: "此运以食神透干、伤官主气承接为背景，重点观察技能输出和现实成果，同时保留关系与环境调整的空间。",
    stemPhase: {
      title: "天干前五年",
      phaseNote: "前段权重与外显主题，不代表后段完全失效。",
      summary: "食神在大运天干直接出现，前段更容易先表现为技能、表达和成果输出的变化。",
      evidenceIds: [stemFactId],
      ruleIds: ["output-rule"],
      positive: ["输出能力增强"],
      risks: ["容易投入过多精力"],
      advice: ["把学习内容转成作品或项目"],
    },
    branchPhase: {
      title: "地支后五年",
      phaseNote: "后段权重与深层承接，不代表前段完全不起作用。",
      summary: "伤官作为地支主气承接，后段更重视执行方式、环境适应和长期结构调整。",
      evidenceIds: [branchFactId],
      ruleIds: ["branch-rule"],
      positive: ["解决问题更灵活"],
      risks: ["对限制的耐心下降"],
      advice: ["保留表达空间并遵守现实边界"],
    },
    assessment: {
      verdict: "mixed",
      label: "中性（调整）",
      summary: "原局能够使用食伤带来的输出能力，但表达与变化也增加节奏成本，因此机会和压力并存，不能只凭身强身弱定喜忌。",
      evidenceIds: [stemFactId],
      ruleIds: ["output-rule"],
      gains: ["能力更容易转成成果"],
      costs: ["需要控制节奏和沟通成本"],
    },
    directions: {
      careerDirection: {
        summary: "事业方向以能力转化和成果输出为主。",
        evidenceIds: [stemFactId],
        ruleIds: ["output-rule"],
        positive: ["专业能力容易被看见"],
        risks: ["路径可能调整"],
        advice: ["积累可验证成果"],
      },
      relationship: {
        summary: "关系领域存在连接和磨合并行的可能，是否落地仍需流年与现实条件。",
        evidenceIds: ["fact:harmony"],
        ruleIds: ["relation-rule"],
        positive: ["有建立联系的机会"],
        risks: ["现实安排可能反复"],
        advice: ["区分相处质量与长期落地"],
      },
      healthState: {
        summary: "健康状态未形成独立强象，只给一般性的精力、作息和压力节奏建议。",
        evidenceIds: [],
        ruleIds: [],
        positive: [],
        risks: [],
        advice: ["保持规律作息"],
      },
    },
    actionAdvice: {
      advance: ["持续积累可验证成果"],
      control: ["控制无效表达和过度分心"],
      avoidForNow: ["证据不足的长期事项暂不下定论"],
    },
    transition: {
      summary: "换运前后以收尾、观察和准备为主，不把气场交接直接写成确定吉凶。",
      advice: ["完成旧项目"],
    },
    verificationQuestions: ["现实中是否正在把学习内容转成作品或项目？"],
  };

  const validation = validateStageAiReport({
    report,
    stage: "luck",
    rawFactPack,
    candidatePack,
  });
  assert.equal(validation.usable, true, validation.issues.join("；"));
});
