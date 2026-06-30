import test from "node:test";
import assert from "node:assert/strict";

import { buildStageRawFactPack } from "../../js/services/ai/transit/buildStageRawFactPack.js";
import { buildStageImageCandidatePack } from "../../js/services/ai/transit/buildStageImageCandidatePack.js";
import {
  renderStageAiReportMarkdown,
  validateStageAiReport,
} from "../../js/services/ai/contracts/stageAiReportContract.js";

test("raw fact pack strips frontend domains and groups same participants", () => {
  const pack = buildStageRawFactPack({
    stage: "luck",
    item: {
      id: "luck:癸亥",
      ganZhi: "癸亥",
      stem: "癸",
      branch: "亥",
      tenGod: "食神",
      branchTenGod: "伤官",
      transitStructure: {
        facts: [
          {
            id: "f1",
            category: "direct",
            type: "stem_combination",
            label: "天干五合",
            status: "direct",
            domains: ["family"],
            text: "家庭被牵动",
            participants: ["luck:癸亥", "natal:year:戊寅"],
            meta: { transformationStatus: "unresolved", targetElement: "火" },
          },
          {
            id: "f2",
            category: "direct",
            type: "branch_六合",
            label: "六合",
            status: "direct",
            domains: ["family"],
            text: "长辈与房屋事务",
            participants: ["luck:癸亥", "natal:year:戊寅"],
          },
          {
            id: "f3",
            category: "direct",
            type: "branch_破",
            label: "破",
            status: "direct",
            participants: ["luck:癸亥", "natal:year:戊寅"],
          },
        ],
      },
    },
  });

  const json = JSON.stringify(pack);
  assert.equal(json.includes("family"), false);
  assert.equal(json.includes("家庭被牵动"), false);
  assert.equal(json.includes("长辈与房屋事务"), false);
  assert.equal(pack.factGroups.length, 1);
  assert.equal(pack.factGroups[0].relations.length, 3);
});

test("candidate pack only keeps rules supported by facts", () => {
  const rawFactPack = {
    facts: [
      { id: "tg1", kind: "ten_god", tenGod: "食神", relation: "天干十神" },
      { id: "f1", kind: "structure", relation: "天干五合", type: "stem_combination", participants: ["a", "b"] },
    ],
  };
  const pack = buildStageImageCandidatePack({
    stage: "luck",
    rawFactPack,
    stageRulePack: {
      matchedRules: [
        {
          id: "r1",
          title: "食神与五合的成果转化",
          claimSupportAllowed: true,
          matchedBy: ["十神:食神", "关系:天干五合"],
          domains: ["learning", "expression"],
          imagery: {
            core: ["积累向成果转化"],
            positive: ["形成可交付成果"],
            negative: ["责任牵制输出"],
            realityChecks: ["是否有学习成果需要落地"],
          },
          advice: ["把输入转成项目或作品"],
        },
        {
          id: "r2",
          title: "七杀压力",
          claimSupportAllowed: true,
          matchedBy: ["十神:七杀"],
          imagery: { core: ["规则压力"] },
        },
      ],
    },
  });

  assert.equal(pack.candidateImages.length, 1);
  assert.equal(pack.candidateImages[0].ruleId, "r1");
  assert.deepEqual(new Set(pack.candidateImages[0].evidenceIds), new Set(["tg1", "f1"]));
});

test("year report keeps the original section-level reference validation scope", () => {
  const result = validateStageAiReport({
    stage: "year",
    rawFactPack: { facts: [{ id: "f1" }] },
    candidatePack: {
      candidateImages: [{ ruleId: "r1", evidenceIds: ["f1"] }],
    },
    report: {
      stage: "year",
      overallJudgment: "本年以调整执行节奏为主，需要先处理现实条件再推进。",
      luckOverlay: {
        summary: "凭空引用了候选池之外的事实与规则。",
        evidenceIds: ["f2"],
        ruleIds: ["r2"],
      },
      natalInteraction: { summary: "原局结构保持稳定。" },
      tenGodActivation: { summary: "外显主题需要继续复核。" },
      forceAssessment: { verdict: "mixed", summary: "机会与压力并存。" },
      eventOutline: { summary: "现实安排可能调整。" },
      finalAdvice: ["先核对现实条件"],
    },
  });

  assert.equal(result.issues.some((issue) => issue.includes("不存在的事实ID")), false);
  assert.equal(result.issues.some((issue) => issue.includes("不存在的规则ID")), false);
});

test("valid luck report renders total judgment, domains, positives, risks and advice", () => {
  const report = {
    stage: "luck",
    overallJudgment: "这一步运以积累向外转化为核心，技术、学习与现实成果之间形成持续连接。",
    stemPhase: {
      title: "天干前五年",
      phaseNote: "前段偏重外显主题，但不代表后段完全失效。",
      summary: "前段更容易先表现为技能、表达和成果输出的变化。",
      evidenceIds: ["f1"],
      ruleIds: ["r1"],
      positive: ["能力开始被外界看见"],
      risks: ["准备过多导致落地偏慢"],
      advice: ["每一阶段都形成可展示成果"],
    },
    branchPhase: {
      title: "地支后五年",
      phaseNote: "后段偏重现实承接，但不代表前段完全不起作用。",
      summary: "后段更重视环境适应、执行方式和长期结构调整。",
      evidenceIds: ["f1"],
      ruleIds: ["r1"],
      positive: ["执行方式逐渐稳定"],
      risks: ["调整过程可能反复"],
      advice: ["保留调整空间"],
    },
    assessment: {
      verdict: "mixed",
      label: "机会与调整并存",
      summary: "能力输出与现实承接同时出现，因此需要兼顾成果和节奏。",
      evidenceIds: ["f1"],
      ruleIds: ["r1"],
      gains: ["能力更容易形成成果"],
      costs: ["需要投入稳定执行"],
    },
    directions: {
      careerDirection: { summary: "事业与学业是主要承接面。", evidenceIds: ["f1"], ruleIds: ["r1"], positive: ["能力可见"], risks: ["落地偏慢"], advice: ["建立输出节奏"] },
      relationship: { summary: "这一方向不是本运最强主线，具体变化更看后续流年触发。", evidenceIds: [], ruleIds: [], positive: [], risks: [], advice: [] },
      healthState: { summary: "身心状态以平衡输入、输出和恢复节奏为主。", evidenceIds: [], ruleIds: [], positive: [], risks: [], advice: ["保持规律作息"] },
    },
    actionAdvice: { advance: ["形成可验证成果"], control: ["控制分心"], avoidForNow: ["暂不锁定长期结果"] },
    transition: { summary: "换运前后以收尾、观察和准备为主。", advice: ["完成旧项目"] },
    verificationQuestions: ["现实中是否已经从单纯学习转向承担实际交付？"],
  };
  const validation = validateStageAiReport({
    report,
    stage: "luck",
    rawFactPack: { facts: [{ id: "f1" }] },
    candidatePack: { candidateImages: [{ ruleId: "r1", evidenceIds: ["f1"] }] },
  });
  assert.equal(validation.usable, true);
  const markdown = renderStageAiReportMarkdown(validation.structured, "luck");
  assert.match(markdown, /十年总断/);
  assert.match(markdown, /展开讲三个方向/);
  assert.match(markdown, /可以获得/);
  assert.match(markdown, /需要付出/);
  assert.match(markdown, /行动建议/);
});
