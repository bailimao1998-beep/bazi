import test from "node:test";
import assert from "node:assert/strict";

import {
  buildStageStructuredPromptSource,
  buildStageVerifiedFactPack,
} from "../js/core/ai/buildStageVerifiedFactPack.js";

function fixture(
  stage = "luck",
) {
  return {
    stage,
    target: {
      year:
        2026,
      ganZhi:
        stage === "luck"
          ? "癸亥"
          : stage === "year"
            ? "丙午"
            : "庚寅",
    },
    factualContext: {
      natal: {
        pillars: [
          {
            key:
              "year",
            stem:
              "戊",
            branch:
              "寅",
            ganZhi:
              "戊寅",
            stemTenGod:
              "正印",
            hiddenStems: [
              {
                stem:
                  "甲",
                tenGod:
                  "正财",
              },
              {
                stem:
                  "丙",
                tenGod:
                  "正官",
              },
              {
                stem:
                  "戊",
                tenGod:
                  "正印",
              },
            ],
          },
          {
            key:
              "month",
            stem:
              "辛",
            branch:
              "酉",
            ganZhi:
              "辛酉",
            stemTenGod:
              "比肩",
          },
          {
            key:
              "day",
            stem:
              "辛",
            branch:
              "酉",
            ganZhi:
              "辛酉",
            stemTenGod:
              "日主",
          },
          {
            key:
              "hour",
            stem:
              "戊",
            branch:
              "子",
            ganZhi:
              "戊子",
            stemTenGod:
              "正印",
          },
        ],
      },
      luck: {
        stem:
          "癸",
        branch:
          "亥",
        ganZhi:
          "癸亥",
        stemTenGod:
          "食神",
        hiddenStems: [
          {
            stem:
              "壬",
            tenGod:
              "伤官",
          },
          {
            stem:
              "甲",
            tenGod:
              "正财",
          },
        ],
      },
      year: {
        stem:
          "丙",
        branch:
          "午",
        ganZhi:
          "丙午",
        stemTenGod:
          "正官",
      },
      month: {
        stem:
          "庚",
        branch:
          "寅",
        ganZhi:
          "庚寅",
        stemTenGod:
          "劫财",
      },
    },
    mechanicalSignals: {
      layers:
        {},
    },
    relationFacts:
      [],
    evidenceConvergences:
      {},
  };
}

test(
  "大运自动补齐与原局的确定关系",
  () => {
    const pack =
      buildStageVerifiedFactPack(
        fixture(
          "luck",
        ),
      );

    const textValue =
      pack.facts
        .map(
          (fact) =>
            fact.text,
        )
        .join("\n");

    assert.match(
      textValue,
      /大运癸与年柱戊构成天干五合/,
    );

    assert.match(
      textValue,
      /大运地支亥与年柱地支寅构成地支六合/,
    );

    assert.match(
      textValue,
      /大运地支亥与年柱地支寅构成破/,
    );

    assert.match(
      textValue,
      /亥子丑三会水局.*尚缺丑.*未成局/,
    );
  },
);

test(
  "流年和流月自动补齐层级之间的生克",
  () => {
    const pack =
      buildStageVerifiedFactPack(
        fixture(
          "month",
        ),
      );

    const textValue =
      pack.facts
        .map(
          (fact) =>
            fact.text,
        )
        .join("\n");

    assert.match(
      textValue,
      /大运癸克流年丙/,
    );

    assert.match(
      textValue,
      /流年丙克流月庚/,
    );

    assert.match(
      textValue,
      /流月地支寅与年柱地支寅同支重复，但不是整柱伏吟/,
    );
  },
);

test(
  "领域事实卡将事实与允许边界绑定",
  () => {
    const pack =
      buildStageVerifiedFactPack(
        fixture(
          "luck",
        ),
      );

    const ability =
      pack.domainFactCards.find(
        (card) =>
          card.领域编号 ===
          "ability_output",
      );

    const resource =
      pack.domainFactCards.find(
        (card) =>
          card.领域编号 ===
          "resource_accumulation",
      );

    const relation =
      pack.domainFactCards.find(
        (card) =>
          card.领域编号 ===
          "relation_environment_change",
      );

    assert.ok(
      ability,
    );

    assert.ok(
      resource,
    );

    assert.ok(
      relation,
    );

    assert.match(
      ability.禁止直接推断.join(""),
      /不自动等于考试/,
    );

    assert.match(
      resource.禁止直接推断.join(""),
      /不自动等于兼职/,
    );

    assert.ok(
      relation.依据编号.length >=
      3,
    );

    const source =
      buildStageStructuredPromptSource(
        pack,
      );

    assert.ok(
      Array.isArray(
        source.领域事实卡,
      ),
    );
  },
);


test(
  "纯原局三合三会不会被误当成阶段触发",
  () => {
    const data =
      fixture(
        "luck",
      );

    data.factualContext.natal.pillars = [
      {
        key:
          "year",
        stem:
          "甲",
        branch:
          "申",
        ganZhi:
          "甲申",
      },
      {
        key:
          "month",
        stem:
          "乙",
        branch:
          "子",
        ganZhi:
          "乙子",
      },
      {
        key:
          "day",
        stem:
          "丙",
        branch:
          "辰",
        ganZhi:
          "丙辰",
      },
      {
        key:
          "hour",
        stem:
          "丁",
        branch:
          "酉",
        ganZhi:
          "丁酉",
      },
    ];

    data.factualContext.luck = {
      stem:
        "己",
      branch:
        "卯",
      ganZhi:
        "己卯",
      stemTenGod:
        "正印",
    };

    const pack =
      buildStageVerifiedFactPack(
        data,
      );

    const relationTexts =
      pack.evidenceFacts
        .map(
          (fact) =>
            fact.text,
        )
        .join("\n");

    assert.doesNotMatch(
      relationTexts,
      /申子辰三合水局三支齐备/,
    );
  },
);
