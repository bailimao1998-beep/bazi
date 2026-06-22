import test from "node:test";

import assert from "node:assert/strict";

import {
  listNatalCompositionSemantics,
} from "../js/core/natal/narrative/natalCompositionSemantics.js";

import {
  composeDomainNarrative,
} from "../js/core/natal/narrative/domainNarrativeComposer.js";

import {
  buildNatalMasterSummary,
} from "../js/core/natal/natalMasterSummaryEngine.js";

const validDomains =
  new Set([
    "self",
    "parents",
    "siblings",
    "spouse",
    "children",
    "wealth",
    "health",
    "movement",
    "friends",
    "career",
    "property",
    "fortune",
  ]);

test(
  "15个原局组合都有合法语义领域",
  () => {
    const semantics =
      listNatalCompositionSemantics();

    assert.equal(
      semantics.length,
      15,
    );

    for (
      const semantic of
      semantics
    ) {
      assert.ok(
        semantic.ruleId,
      );

      assert.ok(
        semantic.domains.length >
          0,
      );

      for (
        const domain of
        semantic.domains
      ) {
        assert.ok(
          validDomains.has(
            domain,
          ),
          `${semantic.ruleId} 含有非法领域 ${domain}`,
        );
      }
    }
  },
);

test(
  "父母领域不会复用命主自身象义",
  () => {
    const result =
      composeDomainNarrative({
        domainKey:
          "parents",

        images: [
          {
            id:
              "image-official-resource",

            ruleId:
              "official_resource_support",

            role:
              "core",

            status:
              "confirmed",

            priority:
              90,

            domains: [
              "parents",
            ],
          },
        ],
      });

    assert.match(
      result.manifestation,
      /长辈|家庭/,
    );

    assert.match(
      result.strength,
      /家庭|教育|长辈/,
    );

    assert.doesNotMatch(
      result.manifestation,
      /做事重标准/,
    );
  },
);

test(
  "健康领域使用体质语言而不是性格语言",
  () => {
    const result =
      composeDomainNarrative({
        domainKey:
          "health",

        images: [
          {
            id:
              "image-element-bias",

            ruleId:
              "element_bias_visible",

            role:
              "core",

            status:
              "confirmed",

            priority:
              88,

            domains: [
              "health",
            ],
          },
        ],
      });

    assert.match(
      result.manifestation,
      /体质|身体|环境|生活节奏/,
    );

    assert.match(
      result.caution,
      /疾病|医学|检查/,
    );

    assert.doesNotMatch(
      result.strength,
      /个人特色/,
    );
  },
);

test(
  "弱证据领域不强行生成优势和风险",
  () => {
    const result =
      composeDomainNarrative({
        domainKey:
          "movement",

        images: [],
        facts: [],
      });

    assert.equal(
      result
        .hasCompositionNarrative,
      false,
    );

    assert.equal(
      result.manifestation,
      "",
    );

    assert.equal(
      result.strength,
      "",
    );

    assert.equal(
      result.caution,
      "",
    );
  },
);

test(
  "条件象自动增加限定表达",
  () => {
    const result =
      composeDomainNarrative({
        domainKey:
          "spouse",

        images: [
          {
            id:
              "image-spouse-tension",

            ruleId:
              "spouse_palace_relation_tension",

            role:
              "conditional",

            status:
              "conditional",

            priority:
              70,

            domains: [
              "spouse",
            ],
          },
        ],
      });

    assert.match(
      result.overview,
      /^若该结构在现实中确有承接/,
    );
  },
);

test(
  "命理总批拆分感情和家庭章节",
  () => {
    const compositionImages = [
      {
        id:
          "image-official-resource",

        ruleId:
          "official_resource_support",

        title:
          "官印承接",

        brief:
          "命局重视规则、责任、资质和长期积累。",

        role:
          "core",

        status:
          "confirmed",

        priority:
          90,

        confidence:
          "high",

        importance:
          "high",

        matchedFactIds: [
          "fact-1",
        ],

        domains: [
          "self",
          "career",
          "parents",
        ],
      },
    ];

    const hitList = {
      all: [
        {
          id:
            "image-official-resource",

          name:
            "官印承接",

          sourceRuleId:
            "official_resource_support",

          role:
            "core",

          status:
            "confirmed",

          priority:
            90,

          meaning:
            "命局重视规则、责任、资质和长期积累。",

          strengths: [
            "学习和理解规则的能力较强。",
          ],

          risks: [
            "容易对自己要求过高。",
          ],
        },
      ],
    };

    const twelveDomains = [
      {
        key:
          "self",

        judgement:
          "命主做事重规则、依据和责任。",

        manifestation:
          "承担任务前会先确认标准。",

        confidence:
          "high",

        hasCompositionNarrative:
          true,
      },

      {
        key:
          "career",

        judgement:
          "事业适合制度清晰、职责明确的环境。",

        manifestation:
          "职业上重视专业信用和经验积累。",

        confidence:
          "high",

        hasCompositionNarrative:
          true,
      },

      {
        key:
          "spouse",

        judgement:
          "关系中重视陪伴、合作和共同目标。",

        pressure:
          "需要把责任和边界说清楚。",

        confidence:
          "medium",

        hasCompositionNarrative:
          true,
      },

      {
        key:
          "parents",

        judgement:
          "家庭教育和长辈要求对个人影响较深。",

        confidence:
          "medium",

        hasCompositionNarrative:
          true,
      },

      {
        key:
          "children",

        judgement:
          "对子女、作品和成果投入较多心力。",

        confidence:
          "medium",

        hasCompositionNarrative:
          true,
      },

      {
        key:
          "health",

        judgement:
          "身体状态容易受到作息和压力影响。",

        confidence:
          "medium",

        hasCompositionNarrative:
          true,
      },

      {
        key:
          "fortune",

        judgement:
          "内在安全感主要来自理解问题和掌握方法。",

        confidence:
          "medium",

        hasCompositionNarrative:
          true,
      },
    ];

    const summary =
      buildNatalMasterSummary({
        facts: [],
        compositionImages,
        hitList,
        twelveDomains,
        scope:
          "natal",
      });

    const labels =
      summary.sections.map(
        (section) =>
          section.label,
      );

    assert.ok(
      labels.includes(
        "感情关系",
      ),
    );

    assert.ok(
      labels.includes(
        "家庭与子女",
      ),
    );

    assert.ok(
      !labels.includes(
        "感情与家庭",
      ),
    );

    const normalizedTexts =
      summary.sections.map(
        (section) =>
          section.text
            .replace(
              /[，。；：、！？\s]/g,
              "",
            ),
      );

    assert.equal(
      new Set(
        normalizedTexts,
      ).size,
      normalizedTexts.length,
    );
  },
);