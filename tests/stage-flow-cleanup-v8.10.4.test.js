import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { renderLuckFlowReport } from "../js/components/luckFlowRenderer.js";
import { renderYearFlowReport } from "../js/components/yearMonthFlowRenderer.js";

test("大运删除无用的流年叠加步骤并重新编号", () => {
  const html = renderLuckFlowReport({
    overallJudgment: "测试总断",
    stemPhase: {},
    branchPhase: {},
    assessment: { verdict: "mixed" },
    directions: {},
    actionAdvice: {},
    transition: {},
  });
  assert.doesNotMatch(html, /叠加流年看具体年份/);
  assert.match(html, /⑦ 给出这步大运的行动建议/);
  assert.match(html, /⑧ 大运交接过渡期提示/);
});

test("流年不显示英文领域标签，只显示中文概括和三类卡片", () => {
  const html = renderYearFlowReport({
    overallJudgment: "本年规则与行动并重。",
    luckOverlay: {},
    natalInteraction: {},
    tenGodActivation: {},
    forceAssessment: { verdict: "mixed" },
    eventOutline: {
      summary: "事业领域最突出，伴随环境变动与人际关系调整。",
      domains: ["career", "spouse", "movement", "parents"],
      positive: ["有调整机会"],
      risks: ["节奏反复"],
      advice: ["先稳后动"],
    },
  });
  assert.match(html, /本年重点领域/);
  assert.match(html, /事业领域最突出/);
  assert.match(html, /有利面/);
  assert.match(html, /压力点/);
  assert.match(html, /建议/);
  assert.doesNotMatch(html, />career</);
  assert.doesNotMatch(html, />spouse</);
  assert.doesNotMatch(html, />movement</);
  assert.doesNotMatch(html, />parents</);
});

test("Prompt和兼容输出同步使用八步大运", async () => {
  const prompt = await readFile(new URL("../js/core/ai/buildStageGuidedPrompt.js", import.meta.url), "utf8");
  const contract = await readFile(new URL("../js/core/ai/stageAiReportContract.js", import.meta.url), "utf8");
  assert.doesNotMatch(prompt, /九步大运|叠加流年说明/);
  assert.match(prompt, /八步大运/);
  assert.match(prompt, /不得向用户输出career|不得输出career/);
  assert.doesNotMatch(contract, /⑦ 叠加流年看具体年份/);
});
