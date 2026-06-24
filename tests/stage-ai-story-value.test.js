import test from "node:test";
import assert from "node:assert/strict";

import {
  buildStageReportSystem,
} from "../js/core/ai/stageReportPromptPolicy.js";

import {
  buildLuckAiPrompt,
} from "../js/core/ai/buildLuckAiPrompt.js";

import {
  buildYearAiPrompt,
} from "../js/core/ai/buildYearAiPrompt.js";

import {
  buildMonthAiPrompt,
} from "../js/core/ai/buildMonthAiPrompt.js";

import {
  validateStageAiText,
} from "../js/core/ai/stageAiTextValidator.js";

function emptyInput() {
  return {
    baseBaziViewModel: {
      birthInfo: {
        gender: "male",
      },
      pillars: [],
    },
    natalImageReport: {},
    luckImageReport: {
      luckItems: [],
    },
    yearImageReport: {
      yearItem: {
        year: 2026,
        ganZhi: "丙午",
        transitStructure: {
          facts: [],
        },
      },
    },
    monthImageReport: {
      monthItem: {
        year: 2026,
        month: 1,
        ganZhi: "庚寅",
        transitStructure: {
          facts: [],
        },
      },
    },
  };
}

test(
  "提示词要求讲现实剧本并提出具体建议",
  () => {
    const system =
      buildStageReportSystem(
        "year",
      );

    assert.match(
      system,
      /可能剧本/,
    );

    assert.match(
      system,
      /应对建议/,
    );

    assert.match(
      system,
      /可能的发展路径/,
    );

    assert.match(
      system,
      /行动建议/,
    );

    assert.match(
      system,
      /压缩的是重复内容|同一冲合/,
    );
  },
);

test(
  "三个阶段保留充足生成空间",
  () => {
    const input =
      emptyInput();

    assert.equal(
      buildLuckAiPrompt(
        input,
      ).maxTokens,
      6000,
    );

    assert.equal(
      buildYearAiPrompt(
        input,
      ).maxTokens,
      4800,
    );

    assert.equal(
      buildMonthAiPrompt(
        input,
      ).maxTokens,
      3800,
    );
  },
);

test(
  "较丰富但不重复的流年报告不会因旧上限失败",
  () => {
    const themeParagraph =
      "核心判断：本阶段需要在标准要求与自主表达之间寻找平衡，学业审核、资格申请或正式手续更可能成为主要落点。可能剧本：先出现明确要求，随后需要修改材料、方案或表达方式；若现实中已有感情互动，关系也可能因责任与边界问题进入更认真讨论。关键依据：官星进入流年并直接作用自身，原局印星与成果层同时参与。应对建议：提前核对要求，预留修改空间，对关系则观察行动是否持续一致。";

    const report = [
      "### 今年总断",
      "今年不是单一吉凶，而是规则、关系与计划调整同时出现。真正的价值在于把外部要求转化为可交付成果，并在关系中建立更清楚的边界。",
      "### 主要主题",
      "#### 学业、资格与审核",
      themeParagraph,
      "#### 感情与关系选择",
      "核心判断：感情机会可以成为重要主题，但更值得观察的是关系是否从吸引走向稳定投入。可能剧本：一开始互动增多，随后现实条件、责任或双方节奏会成为筛选因素；若缺乏持续行动，则更可能只是短期热度。关键依据：配偶星、桃花与日柱作用形成汇合。应对建议：不要只看表达热度，应观察承诺、时间投入和实际安排。",
      "#### 计划与成果调整",
      "核心判断：原计划较容易出现修改、补充或重新安排。可能剧本：外部标准先改变执行方式，随后个人需要重排优先级，最终留下更符合长期目标的方案。关键依据：成果层受到直接触发，食伤与规则信号同时存在。应对建议：保留备用方案，重要材料和节点至少提前复查一次。",
      "### 可能的发展路径",
      "较可能的主线是外部标准先把问题摆到台面，个人随后通过学习、修改和表达完成适应；关系与计划则在这个过程中接受现实检验。另一种可能是职业或手续成为主要承载，但仍需看现实中是否已有对应条件。",
      "### 有利与风险",
      "- 有利：标准明确后，努力更容易转化为可验证成果。",
      "- 有利：关系信号增强，有机会看清双方是否适合长期推进。",
      "- 风险：反复修改和多线并行会消耗精力。",
      "- 风险：把一次机会过早判断成确定结果。",
      "### 行动建议",
      "1. 对考试、申请、论文或手续，先列出硬性要求和最晚修改时间。",
      "2. 对感情关系，重点观察持续投入、责任感和实际安排，而不是只看一时表达。",
      "3. 对计划变化，准备一个可替代方案，并给重要节点预留缓冲。",
      "4. 同一阶段只抓两三件最重要的事，避免因同时推进太多方向而分散。",
      "### 现实验证",
      "1. 是否出现必须修改材料、方案或提交方式的要求？",
      "2. 某段关系是否从频繁互动进入更现实的责任讨论？",
      "3. 原定计划是否需要调整优先级或准备替代方案？",
    ].join("\n");

    const result =
      validateStageAiText({
        text:
          report,
        stage: "year",
        trustedPack: {
          relationFacts: [],
          relationWhitelist: [],
          evidenceConvergences: {},
          factualContext: {
            natal: {
              pillars: [],
            },
          },
        },
      });

    assert.equal(
      result.maxLength,
      3400,
    );

    assert.equal(
      result.hardViolations.some(
        (entry) =>
          entry.startsWith(
            "report_too_long:",
          ),
      ),
      false,
      result.hardViolations.join(
        ",",
      ),
    );
  },
);

test(
  "重复内容仍然会被质量门禁拦截",
  () => {
    const repeated =
      "本阶段需要在规则要求下完成材料修改与审核，同时调整自己的表达和执行方式";

    const report = [
      "### 今年总断",
      "今年有多个主题。",
      "### 主要主题",
      "#### 主题一",
      repeated + "。",
      repeated + "。",
      "#### 主题二",
      "关系需要现实验证。",
    ].join("\n");

    const result =
      validateStageAiText({
        text:
          report,
        stage: "year",
        trustedPack: {
          relationFacts: [],
          relationWhitelist: [],
          evidenceConvergences: {},
          factualContext: {
            natal: {
              pillars: [],
            },
          },
        },
      });

    assert.equal(
      result.valid,
      false,
    );

    assert.ok(
      result.hardViolations.some(
        (entry) =>
          entry.startsWith(
            "repetitive_content:",
          ),
      ),
    );
  },
);
