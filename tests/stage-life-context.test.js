import test from "node:test";
import assert from "node:assert/strict";

import {
  buildStageStructuredPromptSource,
  buildStageVerifiedFactPack,
} from "../js/core/ai/buildStageVerifiedFactPack.js";

test(
  "从出生年与目标年推算人生阶段",
  () => {
    const result =
      buildStageVerifiedFactPack({
        stage:
          "year",
        target: {
          year:
            2026,
          ganZhi:
            "丙午",
        },
        factualContext: {
          natal: {
            birthYear:
              1949,
            pillars:
              [],
          },
          luck:
            {},
          year:
            {},
        },
        mechanicalSignals: {
          layers: {
            luck:
              {},
            year:
              {},
          },
        },
        relationFacts:
          [],
        evidenceConvergences:
          {},
      });

    assert.equal(
      result.lifeContext.age,
      77,
    );

    assert.equal(
      result.lifeContext.lifeStage,
      "晚年",
    );

    assert.ok(
      result.backgroundFacts.some(
        (fact) =>
          fact.text.includes(
            "人生阶段为晚年",
          ),
      ),
    );

    const source =
      buildStageStructuredPromptSource(
        result,
      );

    assert.equal(
      source.人生阶段.lifeStage,
      "晚年",
    );
  },
);

test(
  "可从中文年龄范围识别晚年",
  () => {
    const result =
      buildStageVerifiedFactPack({
        stage:
          "luck",
        target: {
          ageRange:
            "七十二至八十一岁",
          yearRange:
            "2021-2030",
        },
        factualContext: {
          natal: {
            pillars:
              [],
          },
          luck: {
            ageRange:
              "七十二至八十一岁",
            yearRange:
              "2021-2030",
          },
        },
        mechanicalSignals: {
          layers: {
            luck:
              {},
          },
        },
        relationFacts:
          [],
        evidenceConvergences:
          {},
      });

    assert.equal(
      result.lifeContext.lifeStage,
      "晚年",
    );

    assert.ok(
      result.lifeContext.age >=
      72,
    );
  },
);
