import test from "node:test";
import assert from "node:assert/strict";

import { buildChatPrompt } from "../js/core/ai/buildChatPrompt.js";
import {
  sanitizeChatResponse,
  validateChatResponse,
} from "../js/core/ai/chatResponseGuard.js";

function standardPrompt(extra = {}) {
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
        mechanicalRelations: [
          { relation: "害", branches: ["子", "未"] },
        ],
      },
      ...extra,
    }),
  };
}

function standardAnswer(body) {
  return `
## 直接回答
${body}

## 核心取象
主象：以流年新增作用为主，交运前后分段观察。

## 命理依据
原局与目标流年存在明确作用。

## 展开分析
交运前看旧运，交运后看新运。

## 可能表现
1. 可能出现阶段调整。依据来自流年与大运；若现实条件配合则更明显。

## 行动建议
先观察现实进展并保留调整空间。

## 注意边界
命盘不能确认具体事件。
`;
}

test("明确拦截写反的天干生克方向", () => {
  const result = validateChatResponse({
    text: standardAnswer("流年克大运，形成丁克癸。"),
    prompt: standardPrompt(),
  });

  assert.ok(
    result.violations.some(
      (item) =>
        item.startsWith(
          "invalid_stem_control:丁克癸",
        ),
    ),
    result.violations.join("\n"),
  );
});

test("正确的癸水克丁火不会触发方向错误", () => {
  const result = validateChatResponse({
    text: standardAnswer("癸水对丁火形成克制。"),
    prompt: standardPrompt(),
  });

  assert.equal(
    result.violations.some(
      (item) =>
        item.startsWith(
          "invalid_stem_control:",
        ),
    ),
    false,
  );
});

test("显示清洗会把写反的丁克癸改成癸水克制丁火", () => {
  const cleaned = sanitizeChatResponse({
    text: standardAnswer("流年克大运，形成丁克癸。"),
    prompt: standardPrompt(),
  });

  assert.equal(
    cleaned.includes(
      "丁克癸",
    ),
    false,
  );
  assert.ok(
    cleaned.includes(
      "癸水克制丁火",
    ),
  );
});

test("没有流月数据时删除无依据月份，保留真实交运月份", () => {
  const prompt = standardPrompt({
    luckTimelineForTargetYear: {
      isTransitionYear: true,
      transitionAt: {
        year: 2027,
        month: 12,
      },
    },
  });

  const text = `
## 直接回答
2027年先看旧运，12月交运后再看新运。

## 核心取象
主象：交运前后分段。

## 命理依据
四月机会增加。

## 展开分析
辰月和四月（巳月）更明显。
12月交运后，新大运开始进入背景。

## 可能表现
1. 可能出现调整。依据来自流年；若现实条件配合则更明显。

## 行动建议
先观察现实情况。

## 注意边界
不锁定具体事件。
`;

  const cleaned = sanitizeChatResponse({
    text,
    prompt,
  });

  assert.equal(
    cleaned.includes(
      "四月机会增加",
    ),
    false,
  );
  assert.equal(
    cleaned.includes(
      "辰月和四月",
    ),
    false,
  );
  assert.ok(
    cleaned.includes(
      "12月交运后",
    ),
  );
  assert.equal(
    cleaned.includes(
      "相关力量再次集中时",
    ),
    false,
  );
  assert.equal(
    cleaned.includes(
      "本年相应阶段",
    ),
    false,
  );
});

test("年末交运时生成全年主次提示", () => {
  const result = buildChatPrompt({
    question: "2027年感情怎么样",
    chatIntent: "yearTrend",
    requestedYears: [2027],
    contextPlan: {
      isBaziQuestion: true,
      timeScope: "singleYear",
      answerDepth: "standard",
      domainKeys: ["spouse"],
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
          yearRange: "2017-2027",
          ganZhi: "癸亥",
          stem: "癸",
          branch: "亥",
          selectionYear: 2017,
          selectionMonth: 12,
        },
        {
          index: 3,
          ageRange: "29-38岁",
          yearRange: "2027-2037",
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
        year: 2027,
        ganZhi: "丁未",
        stem: "丁",
        branch: "未",
      },
    },
    requestedYearReports: [],
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
      .dominantSegment,
    "beforeTransition",
  );
  assert.deepEqual(
    payload
      .luckTimelineForTargetYear
      .coverageMonthsApprox,
    {
      beforeTransition: 11,
      afterTransition: 1,
    },
  );
  assert.ok(
    payload
      .luckTimelineForTargetYear
      .instruction
      .some(
        (item) =>
          item.includes(
            "新大运不得被写成全年第一主象",
          ),
      ),
  );
});

test("系统提示压制单个七杀或害破过度映射", () => {
  const result = buildChatPrompt({
    question: "2027年感情怎么样",
    chatIntent: "yearTrend",
    contextPlan: {
      isBaziQuestion: true,
      timeScope: "singleYear",
      answerDepth: "standard",
      domainKeys: ["spouse"],
      limits: {},
    },
  });

  assert.match(
    result.system,
    /不能仅凭一个信号直接拟人化成某类对象/,
  );
  assert.match(
    result.system,
    /不要一次扩展成家庭、距离、子女、金钱等多个具体场景/,
  );
});
