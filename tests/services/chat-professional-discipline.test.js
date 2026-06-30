import test from "node:test";
import assert from "node:assert/strict";

import {
  buildChatPrompt,
} from "../../js/services/ai/chat/buildChatPrompt.js";

import {
  buildChatRepairPrompt,
  sanitizeChatResponse,
  validateChatResponse,
} from "../../js/services/ai/guards/chatResponseGuard.js";

function prompt({
  gender = "男",
  intent = "yearTrend",
  withMonth = false,
} = {}) {
  return {
    user: JSON.stringify({
      chatIntent: intent,
      natalHardFacts: {
        gender,
      },
      monthHardFacts: withMonth
        ? {
            month: 5,
            ganZhi: "庚寅",
          }
        : null,
      monthHardFactsList: withMonth
        ? [
            {
              month: 5,
              ganZhi: "庚寅",
            },
          ]
        : [],
      yearHardFacts: {
        relationToNatal: [
          {
            relation: "冲",
            currentBranch: "午",
            targetBranch: "子",
          },
        ],
      },
    }),
  };
}

const validAnswer = `
## 直接回答
2026年更值得观察规则责任与个人安排之间的协调。

## 核心取象
主象是规则责任与执行安排之间的协调，辅象是时柱被冲后的节奏变化，反证是现实责任没有明显调整。

## 命理依据
丙午流年，丙为正官；午与原局子相冲。

## 展开分析
丙辛构成五合条件，但是否化水尚不能确认。子午冲说明执行与后续安排容易变化。

## 可能表现
### 1. 正式要求增加
- 可能性：中
- 依据A：流年正官透出，规则责任进入外显层。
- 依据B：子午冲动时柱，执行与后续安排出现调整信号。
- 成立条件：现实中正处于求职、升学、签约或责任调整阶段。
- 削弱因素：若现实责任和时间安排没有变化，可能只表现为内在压力增加。

## 行动建议
- 先核对正式要求和时间边界，再安排执行顺序。

## 现实验证
观察正式要求、责任和时间安排是否增多。

## 注意边界
不能仅凭流年确认具体事件。
`;

test("合化被写成确定结论时不通过", () => {
  const answer = validAnswer.replace(
    "丙辛构成五合条件，但是否化水尚不能确认。",
    "丙辛合化水。",
  );
  const result = validateChatResponse({
    text: answer,
    prompt: prompt(),
  });
  assert.equal(result.valid, false);
  assert.ok(
    result.violations.some((item) =>
      item.startsWith("unconfirmed_transformation:"),
    ),
  );
});

test("男命把官星解释为丈夫时不通过", () => {
  const answer = validAnswer.replace(
    "2026年更值得观察规则责任与个人安排之间的协调。",
    "2026年正官代表男友或丈夫进入生活。",
  );
  const result = validateChatResponse({
    text: answer,
    prompt: prompt({
      gender: "男",
    }),
  });
  assert.ok(
    result.violations.includes(
      "male_official_spouse_mismatch",
    ),
  );
});

test("没有流月数据时不得自行指定月份", () => {
  const answer = validAnswer.replace(
    "观察正式要求、责任和时间安排是否增多。",
    "尤其观察农历五月和十一月。",
  );
  const result = validateChatResponse({
    text: answer,
    prompt: prompt(),
  });
  assert.ok(
    result.violations.includes(
      "specific_timing_without_evidence",
    ),
  );
});

test("有流月数据时允许比较具体月份", () => {
  const answer = validAnswer.replace(
    "观察正式要求、责任和时间安排是否增多。",
    "比较5月的月度结构差异。",
  );
  const result = validateChatResponse({
    text: answer,
    prompt: prompt({
      intent: "monthTrend",
      withMonth: true,
    }),
  });
  assert.equal(
    result.violations.includes(
      "specific_timing_without_evidence",
    ),
    false,
  );
});

test("具体器官和疾病推断会被拦截", () => {
  const answer = validAnswer.replace(
    "不能仅凭流年确认具体事件。",
    "子午冲提示心血管和神经系统问题。",
  );
  const result = validateChatResponse({
    text: answer,
    prompt: prompt(),
  });
  assert.ok(
    result.violations.some((item) =>
      item.startsWith("specific_medical_claim:"),
    ),
  );
});

test("合规回答可以通过", () => {
  const result = validateChatResponse({
    text: validAnswer,
    prompt: prompt(),
  });
  assert.equal(
    result.valid,
    true,
    result.violations.join("\n"),
  );
});

test("修复提示会列出专业边界问题", () => {
  const repaired = buildChatRepairPrompt({
    basePrompt: prompt(),
    draft: "丙辛合化水。",
    violations: [
      "unconfirmed_transformation:丙辛合化水。",
      "specific_timing_without_evidence",
    ],
  });
  assert.match(
    repaired.system,
    /正式格局、喜用和合化必须写完整成立依据/,
  );
  assert.match(
    repaired.system,
    /没有流月基础数据时，删除具体月份/,
  );
});

test("二次回答仍越界时可以做最低限度清理", () => {
  const cleaned = sanitizeChatResponse({
    text: "丙辛合化水。夏季要注意心血管问题。",
    prompt: prompt(),
  });
  assert.match(cleaned, /尚不能确认化水/);
  assert.doesNotMatch(cleaned, /夏季|心血管/);
});


test("Prompt明确禁止把五合直接当成合化", () => {
  const result = buildChatPrompt({
    question: "2026年会发生什么",
    chatIntent: "yearTrend",
    natalImageReport: {
      natalAiEvidencePack: {
        chartSummary: {
          gender: "男",
          dayMaster: "辛",
          pillars: {},
        },
      },
    },
  });

  assert.match(
    result.system,
    /五合只代表五合条件/,
  );
  assert.match(
    result.system,
    /严禁.*直接写已经化土、化金、化水、化木、化火/,
  );
});

test("Prompt要求具体事件至少两条独立依据", () => {
  const result = buildChatPrompt({
    question: "2026年会发生什么",
    chatIntent: "yearTrend",
  });

  assert.match(
    result.system,
    /具体事件至少需要两条真正独立的命理依据汇合/,
  );
  assert.match(
    result.system,
    /列零至三项/,
  );
});

test("Prompt禁止无流月数据时指定具体月份和疾病", () => {
  const result = buildChatPrompt({
    question: "2026年会发生什么",
    chatIntent: "yearTrend",
  });

  assert.match(
    result.system,
    /没有流月数据时/,
  );
  assert.match(
    result.system,
    /严禁仅凭命盘预测具体器官、疾病、症状或寿命/,
  );
});
