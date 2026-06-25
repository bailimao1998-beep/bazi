import test from "node:test";
import assert from "node:assert/strict";

import { buildStageRawFactPack } from "../js/core/ai/buildStageRawFactPack.js";
import { buildStageImageCandidatePack } from "../js/core/ai/buildStageImageCandidatePack.js";
import {
  renderStageAiReportMarkdown,
  validateStageAiReport,
} from "../js/core/ai/stageAiReportContract.js";

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

test("report contract rejects invented imagery ids", () => {
  const result = validateStageAiReport({
    stage: "month",
    rawFactPack: { facts: [{ id: "f1" }] },
    candidatePack: {
      candidateImages: [{ ruleId: "r1", evidenceIds: ["f1"] }],
    },
    report: {
      stage: "month",
      overallJudgment: "本月以调整执行节奏为主，需要先处理现实条件再推进。",
      selectedImages: [{
        title: "凭空新增的婚姻象",
        evidenceIds: ["f2"],
        ruleIds: ["r2"],
        analysis: "这一段虽然写得很长，但引用了候选池之外的事实与规则，因此必须拒绝。",
        positive: ["关系推进"],
        risks: ["长期不稳"],
        advice: ["直接结婚"],
      }],
      finalAdvice: ["先核对现实条件"],
    },
  });

  assert.equal(result.usable, false);
  assert.ok(result.issues.some((issue) => issue.includes("不存在的事实ID")));
  assert.ok(result.issues.some((issue) => issue.includes("不存在的规则ID")));
});

test("valid luck report renders total judgment, domains, positives, risks and advice", () => {
  const report = {
    stage: "luck",
    overallJudgment: "这一步运以积累向外转化为核心，技术、学习与现实成果之间形成持续连接。",
    selectedImages: [{
      title: "积累向成果转化",
      evidenceIds: ["f1"],
      ruleIds: ["r1"],
      analysis: "原局已有较多输入与体系积累，当前阶段的直接事实又把输出主题推到前台，因此更适合观察知识、技能或方法怎样形成可交付结果。",
      positive: ["能力开始被外界看见"],
      risks: ["准备过多导致落地偏慢"],
      advice: ["每一阶段都形成可展示成果"],
      confidence: "strong",
    }],
    domainSummaries: {
      careerLearning: { summary: "事业与学业是主要承接面，重点在把学习转成实际能力。", evidenceIds: ["f1"], advice: ["建立稳定输出节奏"] },
      wealthResource: { summary: "财富没有形成独立强象，主要承接能力输出后的现实回报。", evidenceIds: [], advice: [] },
      relationshipMarriage: { summary: "感情没有形成独立强象，需要流年进一步触发。", evidenceIds: [], advice: [] },
      familyEnvironment: { summary: "环境可能随发展路径调整，但证据不足以锁定家庭事件。", evidenceIds: [], advice: [] },
      bodyMindRhythm: { summary: "需要平衡输入、输出和恢复节奏。", evidenceIds: ["f1"], advice: ["避免长期只输入不交付"] },
    },
    stageRhythm: "初入时先建立输出方式，持续阶段逐渐形成成果，临近换运时再看下一阶段承接。",
    finalAdvice: ["把长期积累转成项目、作品或可验证成果"],
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
  assert.match(markdown, /各方面简断/);
  assert.match(markdown, /有利面/);
  assert.match(markdown, /压力与代价/);
  assert.match(markdown, /建议/);
});
