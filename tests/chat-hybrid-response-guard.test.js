
import test from "node:test";
import assert from "node:assert/strict";

import {
  validateChatResponse,
} from "../js/core/ai/chatResponseGuard.js";

const prompt = {
  user:
    JSON.stringify({
      chatIntent:
        "free",
      contextPlan: {
        isBaziQuestion:
          true,
        answerDepth:
          "standard",
      },
      natalHardFacts: {
        gender:
          "男",
        dayMaster:
          "辛",
        pillars: {
          year: {
            label:
              "戊寅",
          },
          month: {
            label:
              "辛酉",
          },
          day: {
            label:
              "辛酉",
          },
          hour: {
            label:
              "戊子",
          },
        },
        mechanicalRelations: [
          {
            relation:
              "破",
            branches: [
              "子",
              "酉",
            ],
          },
        ],
      },
      luckHardFacts: {
        luckCycles: [
          {
            ganZhi:
              "癸亥",
          },
        ],
      },
    }),
};

const valid = `
## 直接回答
这个人的边界感较强，但是否表现为控制欲，要看现实关系中的安全感和沟通方式。

## 核心取象
- 主象：自我标准与边界意识较强。
- 辅象：表达与现实责任之间需要协调。
- 条件象：在关系压力增加时更明显。
- 反证象：现实环境宽松时未必表现为控制。

## 命理依据
硬事实来自原局四柱与子酉破；辅助信息只作复核。

## 展开分析
原局先看日主、月令和根气，再看关系结构，不把单一比肩直接等同控制欲。

## 可能表现
1. 可能性中等。依据来自自我结构与关系落点；若现实中缺少安全感更容易显像，沟通稳定时会减弱。

## 时间节奏
当前没有指定流年，因此不展开具体年份。

## 行动建议
把边界和需求直接说清楚，避免用控制代替沟通。

## 现实验证
观察压力增加时是否更想掌控细节。

## 注意边界
命盘不能确认现实人格事实。
`;

test(
  "命理问题缺少核心取象会被拦截",
  () => {
    const result =
      validateChatResponse({
        text:
          valid.replace(
            "- 主象：自我标准与边界意识较强。",
            "- 观察：自我标准较强。",
          ),
        prompt,
      });

    assert.ok(
      result
        .violations
        .includes(
          "missing_primary_imagery",
        ),
      result
        .violations
        .join(
          "\n",
        ),
    );
  },
);

test(
  "完整的先取象后展开回答可以通过结构校验",
  () => {
    const result =
      validateChatResponse({
        text:
          valid,
        prompt,
      });

    assert.equal(
      result.valid,
      true,
      result
        .violations
        .join(
          "\n",
        ),
    );
  },
);
