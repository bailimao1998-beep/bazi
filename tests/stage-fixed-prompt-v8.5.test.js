import test from "node:test";
import assert from "node:assert/strict";

import { buildLuckAiPrompt } from "../js/core/ai/buildLuckAiPrompt.js";
import { buildYearAiPrompt } from "../js/core/ai/buildYearAiPrompt.js";
import { buildMonthAiPrompt } from "../js/core/ai/buildMonthAiPrompt.js";

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

test("三个Prompt都携带固定模型和阶段规则", () => {
  const luckItem = item("luck");
  const yearItem = { ...item("year"), currentLuckItem: luckItem };
  const monthItem = { ...item("month"), currentLuckItem: luckItem, yearItem };
  const luck = buildLuckAiPrompt({ luckImageReport: { luckItems: [luckItem] } });
  const year = buildYearAiPrompt({ luckImageReport: { luckItems: [luckItem] }, yearImageReport: { yearItem } });
  const month = buildMonthAiPrompt({ luckImageReport: { luckItems: [luckItem] }, yearImageReport: { yearItem }, monthImageReport: { monthItem } });

  for (const prompt of [luck, year, month]) {
    assert.ok(prompt.fixedReportModel);
    assert.ok(prompt.stageRulePack);
    assert.equal(prompt.stageRulePack.version, "blind-bazi-imagery-kb-v8.4");
    const payload = JSON.parse(prompt.user);
    assert.ok(payload.fixedReportModel);
    assert.ok(payload.stageRulePack);
  }
  assert.match(luck.system, /阶段总判/);
  assert.match(year.system, /今年新增的作用/);
  assert.match(month.system, /本月新增触发/);
});
