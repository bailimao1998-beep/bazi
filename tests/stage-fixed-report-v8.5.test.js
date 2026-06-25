import test from "node:test";
import assert from "node:assert/strict";

import {
  buildStageDomainScan,
  buildStageFixedReportModel,
  renderStageFixedReportMarkdown,
} from "../js/core/transit/buildStageFixedReportModel.js";
import { buildStageRulePack } from "../js/core/transit/buildStageRulePack.js";
import {
  generateStageFixedNarrative,
  isUsableStageText,
} from "../js/core/ai/stageFixedNarrativeService.js";

function sampleItem(stage = "year") {
  return {
    year: 2026,
    month: 3,
    flowMonthLabel: "寅月",
    dateRangeLabel: "2026-02-04 至 2026-03-05",
    ganZhi: stage === "luck" ? "癸亥" : stage === "year" ? "丙午" : "庚寅",
    tenGod: stage === "luck" ? "食神" : "",
    stemTenGod: stage === "year" ? "正官" : stage === "month" ? "劫财" : "",
    branchTenGod: "七杀",
    currentLuckItem: { ganZhi: "癸亥", tenGod: "食神", branchTenGod: "伤官" },
    yearItem: { year: 2026, ganZhi: "丙午", stemTenGod: "正官", branchTenGod: "七杀" },
    transitStructure: {
      facts: [
        {
          id: `${stage}:fact:1`,
          text: `${stage}当前层直接触发事业与表达结构`,
          category: "direct",
          status: "direct",
          strength: 90,
        },
        {
          id: `${stage}:fact:2`,
          text: "丙辛天干五合，是否化气未确认",
          category: "combination",
          status: "condition_only",
          strength: 65,
        },
      ],
    },
    triggerImages: {
      storyPack: {
        themeHierarchy: {
          primary: {
            tenGod: stage === "luck" ? "食神" : "正官",
            label: "外显主线",
            summary: "规则、输出与现实责任之间需要重新安排主次。",
            sourceLevel: stage,
            evidenceRefs: [`${stage}:fact:1`],
          },
          supporting: {
            tenGod: "七杀",
            label: "现实承接",
            summary: "现实环境要求更直接、更快地作出回应。",
            sourceLevel: stage,
            evidenceRefs: [`${stage}:fact:1`],
          },
        },
        background: [
          {
            id: "background:1",
            domain: "self",
            certainty: "background",
            summary: "原局自我要求较高。",
            evidenceRefs: ["natal:1"],
          },
        ],
        directTriggers: [
          {
            id: `${stage}:career`,
            domain: "career",
            domains: ["career"],
            certainty: "direct",
            status: "direct",
            sourceLevel: stage,
            strength: 90,
            summary: "工作任务、规则与输出方式出现直接调整。",
            possibleScenes: ["职责调整", "项目推进"],
            usefulDirections: ["先明确责任边界，再推进输出"],
            pressureSignals: ["时间与规则压力"],
            conditions: ["现实中是否出现明确岗位或任务变化"],
            evidenceRefs: [`${stage}:fact:1`],
          },
          {
            id: `${stage}:wealth`,
            domain: "wealth",
            domains: ["wealth"],
            certainty: stage === "month" ? "background" : "direct",
            status: stage === "month" ? "background" : "direct",
            sourceLevel: stage === "month" ? "year" : stage,
            strength: 70,
            summary: "资源安排与现实回报需要重新排序。",
            possibleScenes: ["预算调整"],
            usefulDirections: ["把资源投入到可验证成果"],
            pressureSignals: ["投入与回报不匹配"],
            conditions: ["现实中是否出现预算或回报调整"],
            evidenceRefs: [`${stage}:fact:1`],
          },
        ],
        hierarchyInteractions: [],
        convergence: [],
        conditionalPatterns: [],
      },
    },
  };
}

test("三层报告具有不同领域容量", () => {
  const luck = buildStageDomainScan({ stage: "luck", item: sampleItem("luck") });
  const year = buildStageDomainScan({ stage: "year", item: sampleItem("year") });
  const month = buildStageDomainScan({ stage: "month", item: sampleItem("month") });
  assert.ok(luck.primaryDomains.length >= 2 && luck.primaryDomains.length <= 5);
  assert.ok(year.primaryDomains.length >= 1 && year.primaryDomains.length <= 3);
  assert.ok(month.primaryDomains.length <= 2);
  assert.ok(month.primaryDomains.every((entry) => entry.currentLayerEvidenceCount > 0));
});

test("固定报告模型接入v8.4规则并区分章节", () => {
  const luck = buildStageFixedReportModel({ stage: "luck", item: sampleItem("luck") });
  const year = buildStageFixedReportModel({ stage: "year", item: sampleItem("year") });
  const month = buildStageFixedReportModel({ stage: "month", item: sampleItem("month") });
  assert.equal(luck.schemaVersion, "stage-fixed-report-v8.5");
  assert.equal(luck.stageRulePack.version, "blind-bazi-imagery-kb-v8.4");
  assert.ok(luck.stageRulePack.matchedRules.length > 0);
  assert.ok(luck.sections.some((section) => section.title === "阶段总判"));
  assert.ok(year.sections.some((section) => section.title === "今年新增的作用"));
  assert.ok(month.sections.some((section) => section.title === "本月新增触发"));
  assert.ok(month.sections.length < luck.sections.length);
});

test("规则包按阶段限量并保留条件边界", () => {
  const pack = buildStageRulePack({
    stage: "year",
    item: sampleItem("year"),
    domainKeys: ["career", "wealth"],
  });
  assert.equal(pack.version, "blind-bazi-imagery-kb-v8.4");
  assert.ok(pack.matchedRules.length > 0 && pack.matchedRules.length <= 12);
  assert.ok(pack.matchedRules.every((rule) => Array.isArray(rule.requires)));
  assert.ok(pack.matchedRules.every((rule) => Array.isArray(rule.prohibitions)));
});

test("本地固定报告可渲染为Markdown", () => {
  const model = buildStageFixedReportModel({ stage: "year", item: sampleItem("year") });
  const text = renderStageFixedReportMarkdown(model);
  assert.match(text, /## 年度总判/);
  assert.match(text, /## 今年新增的作用/);
  assert.match(text, /## 最强现实落点/);
  assert.ok(text.length > 200);
});

test("AI空响应时使用本地固定报告", async () => {
  const model = buildStageFixedReportModel({ stage: "month", item: sampleItem("month") });
  const outcome = await generateStageFixedNarrative({
    stage: "month",
    prompt: { system: "test", fixedReportModel: model },
    generate: async () => ({ text: "", finishReason: "stop" }),
  });
  assert.equal(outcome.fallbackUsed, true);
  assert.match(outcome.text, /## 本月主线/);
  assert.match(outcome.text, /## 本月新增触发/);
  assert.equal(outcome.attempts.length, 2);
});

test("AI报告必须包含当前层核心章节", () => {
  const good = "### 年度总判\n" + "内容".repeat(50) + "\n### 今年新增的作用\n变化。\n### 最强现实落点\n事业。";
  assert.equal(isUsableStageText(good, "year"), true);
  assert.equal(isUsableStageText("### 阶段总判\n" + "内容".repeat(80), "year"), false);
});
