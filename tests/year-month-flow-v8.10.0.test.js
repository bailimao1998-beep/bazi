import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  renderMonthFlowReport,
  renderYearFlowReport,
} from "../js/components/yearMonthFlowRenderer.js";
import {
  getStageAiOutputContract,
  validateStageAiReport,
} from "../js/core/ai/stageAiReportContract.js";
import { buildStageGuidedPrompt } from "../js/core/ai/buildStageGuidedPrompt.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");

test("year flow renderer exposes the four requested steps", () => {
  const html = renderYearFlowReport({
    overallJudgment: "年度以规则变化与执行调整为主。",
    luckOverlay: { summary: "流年与大运形成制约。" },
    natalInteraction: { summary: "流年冲动原局时柱。" },
    tenGodActivation: { summary: "正官主题显现。" },
    forceAssessment: { verdict: "favorable_with_pressure", summary: "整体能推进，但局部受限。" },
    eventOutline: { summary: "工作学习与计划安排有动静。" },
  });
  assert.match(html, /① 叠加大运/);
  assert.match(html, /② 冲合原局/);
  assert.match(html, /③ 十神引动/);
  assert.match(html, /④ 力度评价/);
  assert.match(html, /力度叠加示意/);
});

test("month flow renderer exposes rhythm-first logic", () => {
  const html = renderMonthFlowReport({
    overallJudgment: "本月以调整节奏为主。",
    threeLayerOverlay: { summary: "大运、流年、流月三层叠加。" },
    rhythmAssessment: { mode: "adjust", summary: "先调整后推进。" },
    localTrigger: { summary: "局部关系被触发。" },
    actionAdvice: { do: ["复核计划"], avoid: ["仓促决定"], pace: ["留出缓冲"] },
  });
  assert.match(html, /① 三层叠加/);
  assert.match(html, /② 节奏判断/);
  assert.match(html, /③ 小触发点/);
  assert.match(html, /④ 行动建议/);
  assert.match(html, /流月不讲具体结果/);
});

test("contracts and normalization preserve year/month flow fields", () => {
  const yearContract = getStageAiOutputContract("year");
  const monthContract = getStageAiOutputContract("month");
  assert.ok(yearContract.luckOverlay);
  assert.ok(yearContract.forceAssessment);
  assert.ok(monthContract.threeLayerOverlay);
  assert.ok(monthContract.rhythmAssessment);

  const yearValidation = validateStageAiReport({
    stage: "year",
    report: {
      stage: "year",
      overallJudgment: "今年在大运背景下出现规则与执行层面的触发。",
      luckOverlay: { summary: "大运与流年有制约。" },
      natalInteraction: { summary: "原局时柱被冲。" },
      tenGodActivation: { summary: "正官主题显现。" },
      forceAssessment: { verdict: "mixed", summary: "机会与压力并存。" },
      eventOutline: { summary: "学业工作与计划有动静。" },
    },
    rawFactPack: { facts: [] },
    candidatePack: { candidateImages: [] },
  });
  assert.equal(yearValidation.structured.stage, "year");
  assert.equal(yearValidation.structured.luckOverlay.summary, "大运与流年有制约。");
});

test("prompt requires the new year and month flow", () => {
  const empty = {
    item: {},
    baseBaziViewModel: {},
    natalImageReport: {},
    luckImageReport: {},
    yearImageReport: {},
    monthImageReport: {},
  };
  const year = buildStageGuidedPrompt({ ...empty, stage: "year" });
  const month = buildStageGuidedPrompt({ ...empty, stage: "month" });
  assert.match(year.system, /流年报告固定按四步组织/);
  assert.match(year.system, /叠加大运/);
  assert.match(month.system, /流月报告固定按四步组织/);
  assert.match(month.system, /三层叠加/);
});

test("stage panel selects dedicated year and month renderers", () => {
  const source = fs.readFileSync(path.join(root, "js/components/stageAnalysisPanel.js"), "utf8");
  assert.match(source, /renderYearFlowReport/);
  assert.match(source, /renderMonthFlowReport/);
  assert.match(source, /structuredYear/);
  assert.match(source, /structuredMonth/);
});
