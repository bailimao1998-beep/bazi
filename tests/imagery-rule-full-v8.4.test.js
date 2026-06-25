import test from "node:test";
import assert from "node:assert/strict";

import {
  IMAGERY_METHODOLOGY_RULES,
  IMAGERY_RESEARCH_PENDING,
  IMAGERY_RULE_CORPUS_VERSION,
  IMAGERY_RULE_MODULES,
  IMAGERY_RULES,
  IMAGERY_SOURCE_CONFLICTS,
  IMAGERY_SOURCE_REGISTRY,
} from "../js/core/imagery-rules/imageryRuleBundle.js";
import { buildImageryRulePack } from "../js/core/imagery-rules/buildImageryRulePack.js";

test("v8.4形成全模块正式规则库", () => {
  assert.equal(IMAGERY_RULE_CORPUS_VERSION, "blind-bazi-imagery-kb-v8.4");
  assert.equal(IMAGERY_RULE_MODULES.length, 16);
  assert.equal(IMAGERY_RULES.length, 365);
  assert.equal(IMAGERY_METHODOLOGY_RULES.length, 34);
  assert.equal(new Set(IMAGERY_RULES.map((item) => item.id)).size, IMAGERY_RULES.length);
});

test("正式规则具备条件、反证、边界、来源和模块", () => {
  for (const item of IMAGERY_RULES) {
    assert.ok(item.id);
    assert.ok(item.title);
    assert.ok(item.module);
    assert.ok(Array.isArray(item.requires) && item.requires.length > 0, item.id);
    assert.ok(Array.isArray(item.weakeningConditions), item.id);
    assert.ok(Array.isArray(item.prohibitions) && item.prohibitions.length > 0, item.id);
    assert.ok(Array.isArray(item.sourceRefs) && item.sourceRefs.length > 0, item.id);
    assert.notEqual(item.researchOnly, true, item.id);
    assert.notEqual(item.allowInUserAnswer, false, item.id);
  }
});

test("未核读扫描正文只登记研究待办", () => {
  assert.ok(IMAGERY_RESEARCH_PENDING.length >= 4);
  assert.ok(IMAGERY_RESEARCH_PENDING.some((item) => item.sourceId === "cui_five_elements"));
  assert.ok(IMAGERY_RESEARCH_PENDING.some((item) => item.sourceId === "cui_advanced_2025"));
  assert.ok(IMAGERY_SOURCE_REGISTRY.every((item) => item.ingestionStatus));
  assert.ok(IMAGERY_SOURCE_CONFLICTS.length >= 5);
});

test("职业问题能召回职业、十神和宾主体用规则", () => {
  const pack = buildImageryRulePack({
    question: "这个人适合技术、管理还是创业，职业怎么取象",
    plan: {
      isBaziQuestion: true,
      timeScope: "natal",
      answerDepth: "deep",
      domainKeys: ["career", "self"],
      limits: { imageryRules: 32, methodologyRules: 30 },
    },
    natalImageReport: {
      natalAiEvidencePack: {
        chartSummary: {
          gender: "男",
          dayMaster: "辛",
          pillars: {
            year: { label: "戊寅", stem: "戊", branch: "寅", stemTenGod: "正印" },
            month: { label: "辛酉", stem: "辛", branch: "酉", stemTenGod: "比肩" },
            day: { label: "辛酉", stem: "辛", branch: "酉" },
            hour: { label: "戊子", stem: "戊", branch: "子", stemTenGod: "正印" },
          },
        },
        facts: [
          { statement: "正印透干，比肩得令，食神藏支" },
          { statement: "月日辛酉伏吟，酉酉自刑，子酉破" },
        ],
      },
    },
    selectedImagery: {
      role: "reference_only",
      natal: [{ title: "印比承载与食伤输出" }],
    },
  });

  const ids = new Set(pack.matchedRuleIds);
  assert.ok([...ids].some((id) => id.startsWith("career_")));
  assert.ok([...ids].some((id) => id.startsWith("tg_")));
  assert.ok(pack.coverage.activeRuleCount >= 365);
  assert.equal(pack.coverage.moduleCount, 16);
});

test("感情问题能召回婚恋边界规则且不注入研究待办", () => {
  const pack = buildImageryRulePack({
    question: "这个男命感情、婚姻和结婚应期怎么看",
    plan: {
      isBaziQuestion: true,
      timeScope: "natal",
      answerDepth: "deep",
      domainKeys: ["spouse"],
      limits: { imageryRules: 32, methodologyRules: 30 },
    },
    natalImageReport: {
      natalAiEvidencePack: {
        chartSummary: {
          gender: "男",
          dayMaster: "辛",
          pillars: {
            year: { label: "戊寅", stem: "戊", branch: "寅" },
            month: { label: "辛酉", stem: "辛", branch: "酉" },
            day: { label: "辛酉", stem: "辛", branch: "酉" },
            hour: { label: "戊子", stem: "戊", branch: "子" },
          },
        },
        facts: [
          { statement: "财星甲木藏于寅，夫妻宫酉，自刑与破存在" },
        ],
      },
    },
    selectedImagery: { role: "reference_only", natal: [] },
  });

  assert.ok(pack.matchedRuleIds.some((id) => id.startsWith("relationship_")));
  assert.equal("researchPending" in pack, false);
  assert.match(pack.coverage.notice, /未逐页核读/);
});
