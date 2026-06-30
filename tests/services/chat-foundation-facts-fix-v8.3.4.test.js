import test from "node:test";
import assert from "node:assert/strict";

import { buildChatPrompt } from "../../js/services/ai/chat/buildChatPrompt.js";
import {
  sanitizeChatResponse,
  validateChatResponse,
} from "../../js/services/ai/guards/chatResponseGuard.js";

function prompt(extra = {}) {
  return {
    user: JSON.stringify({
      chatIntent: "yearTrend",
      contextPlan: {
        isBaziQuestion: true,
        timeScope: "singleYear",
        answerDepth: "standard",
      },
      natalHardFacts: {
        gender: "男",
        dayMaster: "辛",
        pillars: {
          year: { label: "戊寅" },
          month: { label: "辛酉" },
          day: { label: "辛酉" },
          hour: { label: "戊子" },
        },
      },
      ...extra,
    }),
  };
}

function answer(body) {
  return `
## 直接回答
${body}

## 核心取象
主象：以原局与流年明确作用为主。

## 命理依据
只采用系统给出的确定关系。

## 展开分析
按原局、大运、流年分层分析。

## 可能表现
1. 可能出现阶段调整。依据来自明确结构；若现实条件配合则更明显。

## 行动建议
结合现实情况稳步处理。

## 注意边界
命盘不能确认具体事件。
`;
}

test("丙癸合会被识别为基础规则错误", () => {
  const result = validateChatResponse({
    text: answer("丙火也合着癸水，双方互相牵制。"),
    prompt: prompt(),
  });

  assert.ok(
    result.violations.includes(
      "invalid_stem_combination:丙癸",
    ),
    result.violations.join("\n"),
  );
});

test("丙辛合属于正确天干五合", () => {
  const result = validateChatResponse({
    text: answer("丙辛合属于天干五合。"),
    prompt: prompt(),
  });

  assert.equal(
    result.violations.some(
      (item) =>
        item.startsWith(
          "invalid_stem_combination:",
        ),
    ),
    false,
  );
});

test("兜底清洗会删除包含错误天干五合的句子", () => {
  const cleaned = sanitizeChatResponse({
    text: answer("癸水克丙火，同时丙火也合着癸水。"),
    prompt: prompt(),
  });

  assert.equal(
    cleaned.includes(
      "丙火也合着癸水",
    ),
    false,
  );
});

test("明确十神标签错误会按辛日主纠正", () => {
  const bad = answer("丙火正财透出，戊土偏印也明显。");

  const validation = validateChatResponse({
    text: bad,
    prompt: prompt(),
  });

  assert.ok(
    validation.violations.includes(
      "invalid_ten_god_label:丙:正财:正官",
    ),
  );
  assert.ok(
    validation.violations.includes(
      "invalid_ten_god_label:戊:偏印:正印",
    ),
  );

  const cleaned = sanitizeChatResponse({
    text: bad,
    prompt: prompt(),
  });

  assert.ok(
    cleaned.includes(
      "丙火正官",
    ),
  );
  assert.ok(
    cleaned.includes(
      "戊土正印",
    ),
  );
});

test("2026不会因展示年份范围被判断为癸亥大运最后一年", () => {
  const result = buildChatPrompt({
    question: "2026年怎么样",
    chatIntent: "yearTrend",
    requestedYears: [2026],
    contextPlan: {
      isBaziQuestion: true,
      timeScope: "singleYear",
      answerDepth: "standard",
      domainKeys: ["general"],
      limits: {},
    },
    natalImageReport: {
      natalAiEvidencePack: {
        chartSummary: {
          gender: "男",
          dayMaster: "辛",
          pillars: {
            year: { label: "戊寅", stem: "戊", branch: "寅", hiddenStems: [] },
            month: { label: "辛酉", stem: "辛", branch: "酉", hiddenStems: [] },
            day: { label: "辛酉", stem: "辛", branch: "酉", hiddenStems: [] },
            hour: { label: "戊子", stem: "戊", branch: "子", hiddenStems: [] },
          },
        },
      },
    },
    luckImageReport: {
      luckItems: [
        {
          index: 2,
          ageRange: "19-28岁",
          yearRange: "2017-2026",
          ganZhi: "癸亥",
          stem: "癸",
          branch: "亥",
          selectionYear: 2017,
          selectionMonth: 12,
        },
        {
          index: 3,
          ageRange: "29-38岁",
          yearRange: "2027-2036",
          ganZhi: "甲子",
          stem: "甲",
          branch: "子",
          selectionYear: 2027,
          selectionMonth: 12,
        },
      ],
    },
    yearImageReport: {
      yearItem: {
        year: 2026,
        ganZhi: "丙午",
        stem: "丙",
        branch: "午",
      },
    },
    selectedImagery: {
      role: "reference_only",
      natal: [],
      luck: [],
      year: [],
    },
    imageryRulePack: {
      methodologyRules: [],
      matchedRules: [],
      ruleConstraint: {
        mode: "rule_guided",
        auditRequired: false,
      },
    },
  });

  const payload = JSON.parse(
    result.user,
  );

  assert.equal(
    payload
      .luckTimelineForTargetYear
      .isTransitionYear,
    false,
  );
  assert.equal(
    payload
      .luckTimelineForTargetYear
      .isFinalCalendarYearOfLuck,
    false,
  );
  assert.deepEqual(
    payload
      .luckTimelineForTargetYear
      .nextTransitionAt,
    {
      year: 2027,
      month: 12,
    },
  );
  assert.ok(
    payload
      .luckTimelineForTargetYear
      .instruction
      .some(
        (item) =>
          item.includes(
            "不得把2026年写成当前大运最后一年",
          ),
      ),
  );
});

test("错误的大运最后一年表述会被拦截并清理", () => {
  const p = prompt({
    luckTimelineForTargetYear: {
      targetYear: 2026,
      isTransitionYear: false,
      isFinalCalendarYearOfLuck: false,
      nextTransitionAt: {
        year: 2027,
        month: 12,
      },
    },
  });

  const bad = answer("2026年是癸亥大运的最后一年。");

  const validation = validateChatResponse({
    text: bad,
    prompt: p,
  });

  assert.ok(
    validation.violations.includes(
      "invalid_luck_status:2026:not_final_year",
    ),
  );

  const cleaned = sanitizeChatResponse({
    text: bad,
    prompt: p,
  });

  assert.equal(
    cleaned.includes(
      "最后一年",
    ),
    false,
  );
  assert.ok(
    cleaned.includes(
      "尚未到实际交运时间",
    ),
  );
});
