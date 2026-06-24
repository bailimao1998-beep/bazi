import test from "node:test";
import assert from "node:assert/strict";

import {
  normalizeStageReportResponse,
  renderStageReport,
} from "../js/core/ai/stageReportContract.js";

const facts = [
  {
    id: "F01",
    text:
      "大运天干食神透出。",
  },
  {
    id: "F02",
    text:
      "大运地支藏伤官和正财。",
  },
  {
    id: "F03",
    text:
      "流年天干正官透出。",
  },
  {
    id: "F04",
    text:
      "流月天干劫财透出。",
  },
];

function makeTheme(index) {
  return {
    标题:
      `主题${index}`,
    重要度:
      index === 1
        ? "高"
        : "中",
    判断:
      `这是第${index}个独立主题，用于检验不同时间层的信息密度。`,
    现实剧本:
      "这一主题说明起因、矛盾、发展过程和可能结果，保持判断可靠，同时允许列出不同现实落点。",
    可能表现: [
      "较可能表现为能力或计划方式发生调整。",
      "若现实中已有对应事务，也可能落在合作、学习或资源安排上。",
      "较弱可能是生活节奏和兴趣方向发生变化。",
      "只有特定条件存在时，才会发展成更正式的安排。",
    ],
    补充可能:
      "",
    依据编号: [
      `F0${Math.min(index, 4)}`,
    ],
    应对: [
      "先确认现实条件。",
      "根据反馈逐步调整。",
    ],
  };
}

function makeReport(themeCount) {
  return JSON.stringify({
    总断:
      "这是阶段总断，用于说明整体主线、主要矛盾、现实价值和需要注意的方向。可靠性优先，但不把所有可能性压缩成单一答案。",
    主题:
      Array.from(
        {
          length:
            themeCount,
        },
        (_, index) =>
          makeTheme(index + 1),
      ),
    有利: [
      "有利一",
      "有利二",
      "有利三",
      "有利四",
    ],
    风险: [
      "风险一",
      "风险二",
      "风险三",
      "风险四",
    ],
    行动建议: [
      "建议一",
      "建议二",
      "建议三",
      "建议四",
    ],
    现实验证: [
      "问题一",
      "问题二",
      "问题三",
      "问题四",
    ],
  });
}

test(
  "大运保留四个主题和每主题四种可能",
  () => {
    const normalized =
      normalizeStageReportResponse({
        text:
          makeReport(4),
        stage:
          "luck",
      });

    const rendered =
      renderStageReport({
        report:
          normalized.report,
        stage:
          "luck",
        verifiedFacts:
          facts,
      });

    assert.equal(
      (
        rendered.match(
          /^#### /gm,
        ) ||
        []
      ).length,
      4,
    );

    assert.match(
      rendered,
      /### 十年主要结构/,
    );

    const firstTheme =
      rendered
        .split(
          "#### 主题1",
        )[1]
        .split(
          "#### 主题2",
        )[0];

    assert.equal(
      (
        firstTheme.match(
          /^\d+\./gm,
        ) ||
        []
      ).length >= 4,
      true,
    );
  },
);

test(
  "流年最多保留三个主题和每主题三种可能",
  () => {
    const normalized =
      normalizeStageReportResponse({
        text:
          makeReport(4),
        stage:
          "year",
      });

    const rendered =
      renderStageReport({
        report:
          normalized.report,
        stage:
          "year",
        verifiedFacts:
          facts,
      });

    assert.equal(
      (
        rendered.match(
          /^#### /gm,
        ) ||
        []
      ).length,
      3,
    );

    const firstTheme =
      rendered
        .split(
          "#### 主题1",
        )[1]
        .split(
          "#### 主题2",
        )[0];

    const possibilityBlock =
      firstTheme
        .split(
          "**可能表现：**",
        )[1]
        .split(
          "**确定依据：**",
        )[0];

    assert.equal(
      (
        possibilityBlock.match(
          /^\d+\./gm,
        ) ||
        []
      ).length,
      3,
    );
  },
);

test(
  "流月最多保留两个主题和每主题两种可能",
  () => {
    const normalized =
      normalizeStageReportResponse({
        text:
          makeReport(4),
        stage:
          "month",
      });

    const rendered =
      renderStageReport({
        report:
          normalized.report,
        stage:
          "month",
        verifiedFacts:
          facts,
      });

    assert.equal(
      (
        rendered.match(
          /^#### /gm,
        ) ||
        []
      ).length,
      2,
    );

    assert.match(
      rendered,
      /### 本月触发/,
    );

    const firstTheme =
      rendered
        .split(
          "#### 主题1",
        )[1]
        .split(
          "#### 主题2",
        )[0];

    const possibilityBlock =
      firstTheme
        .split(
          "**可能表现：**",
        )[1]
        .split(
          "**确定依据：**",
        )[0];

    assert.equal(
      (
        possibilityBlock.match(
          /^\d+\./gm,
        ) ||
        []
      ).length,
      2,
    );
  },
);
