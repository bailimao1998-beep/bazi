
import test from "node:test";
import assert from "node:assert/strict";

import {
  selectChatImagery,
} from "../../js/services/ai/chat/selectChatImagery.js";

const natalImageReport = {
  hitList: {
    all: [
      {
        id:
          "spouse-core",
        title:
          "关系边界与责任",
        brief:
          "日支与财星结构共同指向关系责任。",
        role:
          "core",
        status:
          "confirmed",
        confidence:
          "high",
        domains: [
          "spouse",
        ],
        manifestations: [
          "关系中重视稳定与边界",
        ],
        conditions: [
          "岁运引动日支或财星时更明显",
        ],
        counterEvidence: [
          "现实中缺少稳定接触时不一定显像",
        ],
      },
      {
        id:
          "career-main",
        title:
          "职业规则",
        brief:
          "官杀结构偏向规则与责任。",
        role:
          "main",
        status:
          "confirmed",
        confidence:
          "high",
        domains: [
          "career",
        ],
      },
      {
        id:
          "weak-spouse",
        title:
          "低置信桃花",
        brief:
          "只有单一线索。",
        role:
          "candidate",
        status:
          "weak",
        confidence:
          "low",
        domains: [
          "spouse",
        ],
      },
    ],
  },
};

const luckImageReport = {
  luckItems: [
    {
      index:
        1,
      yearRange:
        "2020-2029",
      ganZhi:
        "甲子",
      tenGod:
        "正财",
      branchTenGod:
        "食神",
      isCurrent:
        true,
      confidence:
        "medium",
      shortImage:
        "阶段重视现实责任与关系资源。",
      structureImage:
        "大运与原局关系宫形成牵连。",
      reality:
        "现实中可观察关系责任是否增加。",
      boundary:
        "不直接等同恋爱或结婚。",
    },
  ],
};

test(
  "按感情领域优先筛选相关原局取象并压低弱候选",
  () => {
    const result =
      selectChatImagery({
        plan: {
          isBaziQuestion:
            true,
          domainKeys: [
            "spouse",
          ],
          requestedYears: [
            2026,
          ],
          include: {
            natalImagery:
              true,
            luckImagery:
              true,
            yearImagery:
              false,
            monthImagery:
              false,
          },
          limits: {
            natalImagery:
              2,
            luckImagery:
              2,
            manifestationsPerItem:
              3,
          },
        },
        natalImageReport,
        luckImageReport,
      });

    assert.equal(
      result.role,
      "reference_only",
    );

    assert.equal(
      result.natal[0].id,
      "spouse-core",
    );

    assert.equal(
      result.natal.some(
        (item) =>
          item.id ===
          "career-main",
      ),
      false,
    );

    assert.equal(
      result.months.length,
      0,
    );
  },
);

test(
  "非命理问题不注入取象",
  () => {
    const result =
      selectChatImagery({
        plan: {
          isBaziQuestion:
            false,
        },
        natalImageReport,
        luckImageReport,
      });

    assert.deepEqual(
      result.natal,
      [],
    );

    assert.deepEqual(
      result.luck,
      [],
    );
  },
);
