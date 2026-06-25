import test from "node:test";
import assert from "node:assert/strict";

import {
  buildYearSearchPlan,
  detectChatIntent,
} from "../js/app/yearQuestionUtils.js";

test(
  "哪几年会有感情会进入多年扫描",
  () => {
    assert.equal(
      detectChatIntent(
        "我的盘在哪几年会有感情",
      ),
      "multiYear",
    );
  },
);

test(
  "未指定范围时扫描当前和下一步大运窗口",
  () => {
    const result =
      buildYearSearchPlan({
        question:
          "我的盘在哪几年会有感情",
        baseYear:
          2026,
        birthYear:
          1998,
        luckItems: [
          {
            index:
              3,
            yearRange:
              "2019-2028",
            isCurrent:
              true,
          },
          {
            index:
              4,
            yearRange:
              "2029-2038",
          },
        ],
      });

    assert.equal(
      result.mode,
      "default_future_scan",
    );

    assert.deepEqual(
      result.years,
      Array.from(
        {
          length:
            13,
        },
        (
          _,
          index,
        ) =>
          2026 +
          index,
      ),
    );
  },
);

test(
  "2026年哪几个月优先识别为流月",
  () => {
    assert.equal(
      detectChatIntent(
        "2026年哪几个月感情明显",
      ),
      "monthTrend",
    );
  },
);
