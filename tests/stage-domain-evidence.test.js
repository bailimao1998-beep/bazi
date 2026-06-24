import test from "node:test";
import assert from "node:assert/strict";

import {
  buildStageStructuredPromptSource,
  buildStageVerifiedFactPack,
} from "../js/core/ai/buildStageVerifiedFactPack.js";

test(
  "领域证据按主线次线背景分级",
  () => {
    const pack =
      buildStageVerifiedFactPack({
        stage:
          "year",
        target: {
          year:
            2026,
        },
        factualContext: {
          natal: {
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
        evidenceConvergences: {
          output: {
            theme:
              "output",
            independentEvidenceCount:
              4,
          },
          relationship: {
            theme:
              "relationship",
            independentEvidenceCount:
              2,
          },
          health: {
            theme:
              "health",
            independentEvidenceCount:
              1,
          },
        },
      });

    const overview =
      pack.domainEvidenceOverview;

    assert.equal(
      overview.find(
        (item) =>
          item.领域 ===
          "表达、技能与成果",
      ).证据等级,
      "主线候选",
    );

    assert.equal(
      overview.find(
        (item) =>
          item.领域 ===
          "感情与重要关系",
      ).证据等级,
      "次线候选",
    );

    assert.equal(
      overview.find(
        (item) =>
          item.领域 ===
          "精力与生活节奏",
      ).证据等级,
      "背景参考",
    );

    const source =
      buildStageStructuredPromptSource(
        pack,
      );

    assert.ok(
      Array.isArray(
        source.领域证据排序,
      ),
    );
  },
);
