import test from "node:test";

import assert from "node:assert/strict";

import {
  listNatalCompositionSemantics,
} from "../../js/domain/natal/narrative/natalCompositionSemantics.js";

import {
  composeDomainNarrative,
} from "../../js/domain/natal/narrative/domainNarrativeComposer.js";

import {
  buildNatalMasterSummary,
} from "../../js/domain/natal/natalMasterSummaryEngine.js";

import {
  buildNatalProfessionalContext,
} from "../../js/domain/natal/professional/buildNatalProfessionalContext.js";

import {
  buildNatalProfessionalPatterns,
} from "../../js/domain/natal/professional/buildNatalProfessionalPatterns.js";

import {
  mergeNatalProfessionalImages,
} from "../../js/domain/natal/professional/mergeNatalProfessionalImages.js";

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
  "专业上下文区分最显位置、最近位置和关系牵动",
  () => {
    const context =
      buildNatalProfessionalContext({
        pillars: {
          year: {
            stem: "甲",
            branch: "寅",
          },
          month: {
            stem: "乙",
            branch: "卯",
          },
          day: {
            stem: "辛",
            branch: "亥",
          },
          hour: {
            stem: "丙",
            branch: "子",
          },
        },

        relationMatrix: {
          items: [
            {
              id: "rel-day-hour-harm",
              relationType:
                "branch_harm",
              participants: [
                {
                  pillar: "day",
                  position:
                    "branch",
                  value: "亥",
                },
                {
                  pillar: "hour",
                  position:
                    "branch",
                  value: "子",
                },
              ],
            },
          ],
        },

        tenGodStates: {
          正财: {
            weightedCount: 1.7,
            visiblePositions: [
              "year.stem",
            ],
            mainQiPositions: [
              "day.branch.mainQi",
            ],
            relatedRelations: [
              {
                id:
                  "rel-day-hour-harm",
                relationType:
                  "branch_harm",
              },
            ],
          },
        },

        palaceFeatures: {},

        kinshipFeatures: {
          spouse: {
            label: "配偶",
            mappingStatus:
              "resolved",
            starProfile: {
              weightedCount: 1.7,
              visiblePositions: [
                "year.stem",
              ],
              mainQiPositions: [
                "day.branch.mainQi",
              ],
            },
          },
        },
      });

    const wealth =
      context.tenGods.正财;

    assert.equal(
      wealth.primaryPosition.pillar,
      "year",
    );
    assert.equal(
      wealth.nearestPosition.pillar,
      "day",
    );
    assert.equal(
      wealth.nearestDistance,
      0,
    );
    assert.equal(
      wealth.isRelationAffected,
      true,
    );
    assert.deepEqual(
      wealth.tensionRelationIds,
      [
        "rel-day-hour-harm",
      ],
    );

    const spouse =
      context.kinships.spouse;

    assert.equal(
      spouse.primaryPosition.pillar,
      "year",
    );
    assert.equal(
      spouse.nearestPosition.pillar,
      "day",
    );
  },
);

test(
  "专业模式用真实做功链区分并见、连接和激活",
  () => {
    const baseContext = {
      tenGods: {
        食神: {
          weightedCount: 1,
          visibleCount: 1,
          positions: [],
          hostPositions: [
            {
              pillarLabel:
                "时柱",
              positionLabel:
                "天干",
            },
          ],
          guestPositions: [],
          hasRoot: true,
          isVisible: true,
          isBlocked: false,
          statusText:
            "食神透出",
        },
        正财: {
          weightedCount: 1,
          visibleCount: 1,
          positions: [],
          hostPositions: [],
          guestPositions: [
            {
              pillarLabel:
                "月柱",
              positionLabel:
                "天干",
            },
          ],
          hasRoot: true,
          isVisible: true,
          isBlocked: false,
          statusText:
            "正财透出",
        },
        正印: {
          weightedCount: 2,
          visibleCount: 1,
          positions: [],
          hostPositions: [],
          guestPositions: [],
          hasRoot: true,
          isVisible: true,
          isBlocked: false,
          statusText:
            "正印有力",
        },
        比肩: {
          weightedCount: 2,
          visibleCount: 1,
          positions: [],
          hostPositions: [],
          guestPositions: [],
          hasRoot: true,
          isVisible: true,
          isBlocked: false,
          statusText:
            "比肩有力",
        },
      },
      palaces: {},
      kinships: {},
      relations: [],
    };

    const rules = [
      {
        id:
          "professional_resource_peer_dominance",
        semanticGroup:
          "resource_peer_dominance",
        title: "印比成势",
        role: "core",
        baseStatus:
          "confirmed",
        baseConfidence: "high",
        importance: "high",
        priority: 96,
        domains: ["self"],
        thresholds: {
          resourceMin: 1.4,
          peerMin: 1.4,
          confirmedResourceMin: 1.8,
          confirmedPeerMin: 1.8,
        },
        semantic: {
          meaning:
            "印比成为原局主轴。",
        },
      },
      {
        id:
          "professional_output_wealth_work_chain",
        semanticGroup:
          "output_wealth_work_chain",
        title:
          "食伤生财做功候选",
        role: "core",
        baseStatus:
          "conditional",
        baseConfidence:
          "medium",
        importance: "high",
        priority: 120,
        domains: [
          "career",
          "wealth",
        ],
        thresholds: {
          outputMin: 0.5,
          wealthMin: 0.3,
          confirmedOutputMin: 0.9,
          confirmedWealthMin: 0.5,
        },
        semantic: {
          meaning:
            "食伤财星并见。",
        },
      },
    ];

    const presenceOnly =
      buildNatalProfessionalPatterns({
        structureSynopsis: {
          dayMaster: {
            strengthState:
              "strong",
          },
        },
        professionalContext:
          baseContext,
        workChains: {
          chains: [],
        },
        rules,
      });

    assert.equal(
      presenceOnly.primaryImage.title,
      "印比成势",
    );

    const outputWealth =
      presenceOnly.images.find(
        (image) =>
          image.ruleId ===
          "professional_output_wealth_work_chain",
      );

    assert.equal(
      outputWealth.title,
      "食伤财星并见，做功链待确认",
    );
    assert.equal(
      outputWealth.status,
      "conditional",
    );
    assert.equal(
      outputWealth.workStatus,
      "presence_only",
    );
    assert.ok(
      outputWealth.school,
    );
    assert.ok(
      outputWealth.sourceRefs,
    );
    assert.equal(
      outputWealth
        .masterNarrative,
      null,
    );
    assert.equal(
      outputWealth
        .replacementPolicy,
      "ranked",
    );

    const connected =
      buildNatalProfessionalPatterns({
        structureSynopsis: {
          dayMaster: {
            strengthState:
              "strong",
          },
        },
        professionalContext:
          baseContext,
        workChains:
          createWorkChains({
            activationLevel:
              "potential",
          }),
        rules,
      });

    assert.equal(
      connected.images.find(
        (image) =>
          image.ruleId ===
          "professional_output_wealth_work_chain",
      ).workStatus,
      "structurally_supported",
    );

    const activated =
      buildNatalProfessionalPatterns({
        structureSynopsis: {
          dayMaster: {
            strengthState:
              "strong",
          },
        },
        professionalContext:
          baseContext,
        workChains:
          createWorkChains({
            activationLevel:
              "activated",
          }),
        rules,
      });

    const activatedImage =
      activated.images.find(
        (image) =>
          image.ruleId ===
          "professional_output_wealth_work_chain",
      );

    assert.equal(
      activatedImage.title,
      "食伤生财做功链",
    );
    assert.equal(
      activatedImage.status,
      "confirmed",
    );
    assert.equal(
      activatedImage.workStatus,
      "activated",
    );
  },
);

test(
  "合并层逐条记录专业规则替换裁决",
  () => {
    const result =
      mergeNatalProfessionalImages({
        contractImages: [
          {
            id:
              "contract-output-wealth",
            ruleId:
              "output_wealth_chain",
            semanticGroup:
              "output_wealth_work_chain",
            title:
              "旧食伤生财",
            role: "core",
            status:
              "confirmed",
            confidence: "high",
            priority: 90,
          },
        ],
        professionalImages: [
          {
            id:
              "professional-output-wealth",
            ruleId:
              "professional_output_wealth_work_chain",
            semanticGroup:
              "output_wealth_work_chain",
            title:
              "食伤财星并见，做功链待确认",
            role:
              "conditional",
            status:
              "conditional",
            confidence: "low",
            priority: 120,
            replacesRuleIds: [
              "output_wealth_chain",
            ],
            replacementPolicy:
              "ranked",
          },
        ],
      });

    assert.equal(
      result.primaryImage.ruleId,
      "output_wealth_chain",
    );
    assert.equal(
      result.replacementDecisions.length,
      1,
    );
    assert.equal(
      result
        .replacementDecisions[0]
        .accepted,
      false,
    );
    assert.deepEqual(
      result
        .suppressedProfessionalImages
        .map((image) => image.ruleId),
      [
        "professional_output_wealth_work_chain",
      ],
    );
  },
);

test(
  "命理总批优先读取专业规则专属主线",
  () => {
    const summary =
      buildNatalMasterSummary({
        structureSynopsis: {},
        facts: [],
        compositionImages: [
          {
            id:
              "professional-image",
            ruleId:
              "professional_custom_rule",
            title:
              "专业自定义规则",
            brief:
              "专业规则主象。",
            role: "core",
            status:
              "confirmed",
            priority: 90,
            confidence: "high",
            importance: "high",
            domains: ["self"],
            masterNarrative: {
              lifePattern:
                "专属人生主线进入发展模式章节。",
              conclusion:
                "专属总结进入总批结论。",
            },
          },
        ],
        hitList: {
          all: [
            {
              id:
                "professional-row",
              name:
                "专业自定义规则",
              sourceRuleId:
                "professional_custom_rule",
              role: "core",
              status:
                "confirmed",
              priority: 90,
              meaning:
                "专业规则主象。",
              strengths: [
                "专业证据完整。",
              ],
              risks: [],
            },
          ],
        },
        twelveDomains: [],
      });

    assert.ok(
      summary.sections.some(
        (section) =>
          section.key ===
            "lifePattern" &&
          section.text.includes(
            "专属人生主线",
          ),
      ),
    );

    assert.match(
      summary.conclusion,
      /专属总结进入总批结论/,
    );
  },
);

function createWorkChains({
  activationLevel,
} = {}) {
  return {
    nodes: [
      {
        id: "output-node",
        pillar: "hour",
        tenGod: "食神",
        tenGodGroup: "output",
      },
      {
        id: "wealth-node",
        pillar: "month",
        tenGod: "正财",
        tenGodGroup: "wealth",
      },
    ],
    edges: [
      {
        id: "output-to-wealth",
        source: "output-node",
        target: "wealth-node",
        semanticType: "generate",
      },
    ],
    chains: [
      {
        id: "chain-output-wealth",
        nodeIds: [
          "output-node",
          "wealth-node",
        ],
        edgeIds: [
          "output-to-wealth",
        ],
        activationLevel,
        confidence: "high",
        hiddenNodeCount: 0,
        priorityScore: 90,
      },
    ],
    interruptionSignals: [],
  };
}

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
