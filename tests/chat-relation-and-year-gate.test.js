import test from "node:test";
import assert from "node:assert/strict";

import {
  validateChatResponse,
} from "../js/core/ai/chatResponseGuard.js";

function prompt() {
  return {
    user:
      JSON.stringify({
        chatIntent:
          "multiYear",
        subjectContext: {
          birthYear:
            1998,
          targetYear:
            2026,
        },
        requestedYears: [
          2026,
          2027,
        ],
        requestedYearFacts: [
          {
            year:
              2026,
          },
          {
            year:
              2027,
          },
        ],
        luckHardFacts: {
          luckCycles: [
            {
              ganZhi:
                "癸亥",
            },
          ],
        },
        natalHardFacts: {
          gender:
            "男",
          pillars: {
            year: {
              label:
                "戊寅",
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
      }),
  };
}

const base = `
## 直接回答
2026与2027需要结合逐年事实比较。

## 数据完整度
已经获得原局、大运和逐年资料。

## 确定结构
原局子酉破。

## 专业判断
只使用系统提供的机械关系。

## 主要显像
### 1. 关系机会
- 可能性：中
- 依据A：原局关系结构。
- 依据B：逐年新增作用。
- 成立条件：现实中存在稳定接触机会。
- 削弱因素：缺少持续互动。

## 行动建议
扩大稳定社交并观察现实反馈。

## 现实验证
观察2026与2027年的实际差异。

## 注意边界
不能仅凭命盘确认事实。
`;

test(
  "不存在的暗合和半合会被拦截",
  () => {
    const result =
      validateChatResponse({
        text:
          base.replace(
            "原局子酉破。",
            "原局寅酉暗合，子酉半合。",
          ),
        prompt:
          prompt(),
      });

    assert.ok(
      result.violations.some(
        (item) =>
          item.startsWith(
            "unsupported_named_relation:",
          ),
      ),
    );
  },
);

test(
  "扫描范围外和出生前年份会被拦截",
  () => {
    const result =
      validateChatResponse({
        text:
          base.replace(
            "观察2026与2027年的实际差异。",
            "回顾1987，并重点观察2047。",
          ),
        prompt:
          prompt(),
      });

    assert.ok(
      result.violations.some(
        (item) =>
          item.startsWith(
            "year_before_birth:",
          ),
      ),
    );

    assert.ok(
      result.violations.some(
        (item) =>
          item.startsWith(
            "year_outside_scan:",
          ),
      ),
    );
  },
);

test(
  "已有大运时不能谎称缺少大运",
  () => {
    const result =
      validateChatResponse({
        text:
          base.replace(
            "已经获得原局、大运和逐年资料。",
            "未提供任何大运信息。",
          ),
        prompt:
          prompt(),
      });

    assert.ok(
      result.violations.includes(
        "false_missing_luck_data",
      ),
    );
  },
);
