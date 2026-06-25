
import test from "node:test";
import assert from "node:assert/strict";

import {
  buildChatContextPlan,
} from "../js/core/ai/buildChatContextPlan.js";

test(
  "未预设的性格问题仍识别为命理问题并选择自我领域",
  () => {
    const plan =
      buildChatContextPlan({
        question:
          "这个人控制欲强吗，平时是不是很固执？",
        chatIntent:
          "free",
        chartAvailable:
          true,
      });

    assert.equal(
      plan.isBaziQuestion,
      true,
    );

    assert.equal(
      plan.timeScope,
      "natal",
    );

    assert.ok(
      plan.domainKeys.includes(
        "self",
      ),
    );

    assert.equal(
      plan.include.natalImagery,
      true,
    );

    assert.equal(
      plan.include.monthBasics,
      false,
    );
  },
);

test(
  "单年辞职问题只加载流年层不加载流月",
  () => {
    const plan =
      buildChatContextPlan({
        question:
          "2028年适不适合辞职换工作？",
        chatIntent:
          "yearTrend",
        requestedYears: [
          2028,
        ],
        chartAvailable:
          true,
        targetYear:
          2028,
      });

    assert.equal(
      plan.timeScope,
      "singleYear",
    );

    assert.ok(
      plan.domainKeys.includes(
        "career",
      ),
    );

    assert.equal(
      plan.include.yearBasics,
      true,
    );

    assert.equal(
      plan.include.monthBasics,
      false,
    );

    assert.equal(
      plan.include.yearImagery,
      true,
    );

    assert.equal(
      plan.include.monthImagery,
      false,
    );
  },
);

test(
  "明确问月份时加载流月基础数据和流月取象",
  () => {
    const plan =
      buildChatContextPlan({
        question:
          "2028年哪个月适合辞职？",
        chatIntent:
          "monthTrend",
        requestedYears: [
          2028,
        ],
        chartAvailable:
          true,
        targetYear:
          2028,
        selectedMonth:
          6,
      });

    assert.equal(
      plan.timeScope,
      "month",
    );

    assert.equal(
      plan.include.monthBasics,
      true,
    );

    assert.equal(
      plan.include.monthImagery,
      true,
    );

    assert.equal(
      plan.monthMode,
      "selected",
    );
  },
);

test(
  "全面分析会提高取象预算",
  () => {
    const plan =
      buildChatContextPlan({
        question:
          "全面详细分析这个人的一生和性格",
        chatIntent:
          "natalOverview",
        chartAvailable:
          true,
      });

    assert.equal(
      plan.answerDepth,
      "deep",
    );

    assert.ok(
      plan.limits.natalImagery >
      7,
    );
  },
);
