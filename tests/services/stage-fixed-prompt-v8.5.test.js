import test from "node:test";
import assert from "node:assert/strict";

import { buildLuckAiPrompt } from "../../js/services/ai/transit/buildLuckAiPrompt.js";
import { buildYearAiPrompt } from "../../js/services/ai/transit/buildYearAiPrompt.js";
import { buildMonthAiPrompt } from "../../js/services/ai/transit/buildMonthAiPrompt.js";

function item(stage) {
  return {
    year: 2026,
    month: 2,
    flowMonthLabel: "寅月",
    ganZhi: stage === "luck" ? "癸亥" : stage === "year" ? "丙午" : "庚寅",
    isCurrent: true,
    transitStructure: { facts: [] },
    triggerImages: {
      storyPack: {
        themeHierarchy: {
          primary: { tenGod: "食神", summary: "输出主线", sourceLevel: stage },
          supporting: { tenGod: "正财", summary: "现实承接", sourceLevel: stage },
        },
        background: [],
        directTriggers: [],
        hierarchyInteractions: [],
        convergence: [],
        conditionalPatterns: [],
      },
    },
  };
}

test("三个Prompt都携带事实、候选规则和当前输出契约", () => {
  const luckItem = item("luck");
  const yearItem = { ...item("year"), currentLuckItem: luckItem };
  const monthItem = { ...item("month"), currentLuckItem: luckItem, yearItem };
  const luck = buildLuckAiPrompt({ luckImageReport: { luckItems: [luckItem] } });
  const year = buildYearAiPrompt({ luckImageReport: { luckItems: [luckItem] }, yearImageReport: { yearItem } });
  const month = buildMonthAiPrompt({ luckImageReport: { luckItems: [luckItem] }, yearImageReport: { yearItem }, monthImageReport: { monthItem } });

  for (const prompt of [luck, year, month]) {
    assert.ok(prompt.rawFactPack);
    assert.ok(prompt.candidatePack);
    assert.ok(prompt.outputContract);
    assert.equal("fixedReportModel" in prompt, false);
    assert.equal("stageRulePack" in prompt, false);
    const payload = JSON.parse(prompt.user);
    assert.ok(payload.rawFactPack);
    assert.ok(payload.candidatePack);
    assert.ok(payload.outputContract);
    assert.equal("fixedReportModel" in payload, false);
    assert.equal("stageRulePack" in payload, false);
  }
  assert.match(luck.system, /八步流程/);
  assert.match(year.system, /四步组织/);
  assert.match(month.system, /三层叠加/);
});
