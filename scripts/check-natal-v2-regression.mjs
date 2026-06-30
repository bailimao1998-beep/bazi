import assert from "node:assert/strict";

import {
  aggregateDomainProfessionalImages,
} from "../js/domain/natal/professional/domainProfessionalAggregation.js";

import {
  arbitrateProfessionalControlImages,
} from "../js/domain/natal/professional/professionalControlArbitration.js";

import {
  buildFactDrivenDomainReport,
} from "../js/domain/natal/domains/domainPortraitEngineV2.js";

import {
  buildNatalMasterSummary,
} from "../js/domain/natal/natalMasterSummaryEngine.js";

const regressionResults = [];

runCase(
  "confirmed tension outranks structurally supported core",
  () => {
    const aggregation =
      aggregateDomainProfessionalImages({
        domainKey:
          "career",

        images: [
          createImage({
            id:
              "core-structural",

            ruleId:
              "professional_food_controls_kill",

            semanticGroup:
              "food_controls_kill",

            title:
              "食神制杀结构较完整",

            role:
              "core",

            status:
              "structurally_supported",

            confidence:
              "medium",

            priority:
              99,
          }),

          createImage({
            id:
              "tension-confirmed",

            ruleId:
              "professional_hurt_officer_meets_official",

            semanticGroup:
              "hurt_officer_meets_official",

            title:
              "伤官见官冲突链",

            role:
              "tension",

            status:
              "confirmed",

            confidence:
              "medium",

            priority:
              80,
          }),
        ],
      });

    assert.equal(
      aggregation
        .primaryImage
        ?.id,
      "tension-confirmed",
    );
  },
);

runCase(
  "conditional core cannot outrank confirmed support",
  () => {
    const aggregation =
      aggregateDomainProfessionalImages({
        domainKey:
          "career",

        images: [
          createImage({
            id:
              "conditional-core",

            ruleId:
              "conditional-core-rule",

            semanticGroup:
              "conditional-core",

            role:
              "core",

            status:
              "conditional",

            confidence:
              "high",

            priority:
              100,
          }),

          createImage({
            id:
              "confirmed-support",

            ruleId:
              "confirmed-support-rule",

            semanticGroup:
              "confirmed-support",

            role:
              "support",

            status:
              "confirmed",

            confidence:
              "medium",

            priority:
              60,
          }),
        ],
      });

    assert.equal(
      aggregation
        .primaryImage
        ?.id,
      "confirmed-support",
    );
  },
);

runCase(
  "same semantic group keeps strongest image",
  () => {
    const aggregation =
      aggregateDomainProfessionalImages({
        domainKey:
          "career",

        images: [
          createImage({
            id:
              "weak-version",

            ruleId:
              "rule-a",

            semanticGroup:
              "same-group",

            status:
              "conditional",

            role:
              "core",

            priority:
              100,
          }),

          createImage({
            id:
              "strong-version",

            ruleId:
              "rule-b",

            semanticGroup:
              "same-group",

            status:
              "confirmed",

            role:
              "support",

            priority:
              60,
          }),
        ],
      });

    assert.equal(
      aggregation
        .relevantImages
        .length,
      1,
    );

    assert.equal(
      aggregation
        .relevantImages[0]
        .id,
      "strong-version",
    );
  },
);

runCase(
  "structurally supported image gives medium evidence",
  () => {
    const aggregation =
      aggregateDomainProfessionalImages({
        domainKey:
          "wealth",

        images: [
          createImage({
            id:
              "structural-wealth",

            ruleId:
              "professional_output_wealth_work_chain",

            semanticGroup:
              "output_wealth",

            role:
              "core",

            status:
              "structurally_supported",

            confidence:
              "high",

            domains: [
              "wealth",
            ],
          }),
        ],
      });

    assert.equal(
      aggregation
        .evidenceLevel,
      "medium",
    );
  },
);

runCase(
  "confirmed medium confidence image gives high evidence",
  () => {
    const aggregation =
      aggregateDomainProfessionalImages({
        domainKey:
          "career",

        images: [
          createImage({
            id:
              "confirmed-career",

            ruleId:
              "professional_kill_resource_transform",

            semanticGroup:
              "kill_resource",

            role:
              "core",

            status:
              "confirmed",

            confidence:
              "medium",
          }),
        ],
      });

    assert.equal(
      aggregation
        .evidenceLevel,
      "high",
    );
  },
);

runCase(
  "owl seizes food downgrades food route but not hurt officer route",
  () => {
    const result =
      arbitrateProfessionalControlImages({
        images: [
          createImage({
            id:
              "owl",

            ruleId:
              "professional_owl_seizes_food",

            semanticGroup:
              "owl_seizes_food",

            title:
              "枭神夺食结构张力明显",

            role:
              "tension",

            status:
              "structurally_supported",

            workStatus:
              "structurally_supported",

            workPath:
              createWorkPath(
                "偏印",
                "食神",
              ),
          }),

          createImage({
            id:
              "food-wealth",

            ruleId:
              "professional_output_wealth_work_chain",

            semanticGroup:
              "food-wealth",

            title:
              "食神生财结构较完整",

            role:
              "core",

            status:
              "structurally_supported",

            workStatus:
              "structurally_supported",

            workPath:
              createWorkPath(
                "食神",
                "正财",
              ),
          }),

          createImage({
            id:
              "hurt-wealth",

            ruleId:
              "hurt-officer-wealth-route",

            semanticGroup:
              "hurt-wealth",

            title:
              "伤官生财结构较完整",

            role:
              "core",

            status:
              "structurally_supported",

            workStatus:
              "structurally_supported",

            workPath:
              createWorkPath(
                "伤官",
                "正财",
              ),
          }),
        ],
      });

    const foodRoute =
      result.images.find(
        (image) =>
          image.id ===
          "food-wealth",
      );

    const hurtRoute =
      result.images.find(
        (image) =>
          image.id ===
          "hurt-wealth",
      );

    assert.equal(
      foodRoute.status,
      "conditional",
    );

    assert.equal(
      hurtRoute.status,
      "structurally_supported",
    );
  },
);

runCase(
  "wealth breaks proper resource only downgrades proper resource route",
  () => {
    const result =
      arbitrateProfessionalControlImages({
        images: [
          createImage({
            id:
              "wealth-breaks-resource",

            ruleId:
              "professional_wealth_breaks_resource",

            semanticGroup:
              "wealth_breaks_resource",

            title:
              "财坏印结构张力明显",

            role:
              "tension",

            status:
              "structurally_supported",

            workStatus:
              "structurally_supported",

            workPath:
              createWorkPath(
                "正财",
                "正印",
              ),
          }),

          createImage({
            id:
              "proper-resource-route",

            ruleId:
              "professional_hurt_officer_with_resource",

            semanticGroup:
              "hurt_officer_with_resource",

            title:
              "伤官配印结构较完整",

            role:
              "core",

            status:
              "structurally_supported",

            workStatus:
              "structurally_supported",

            workPath:
              createWorkPath(
                "正印",
                "伤官",
              ),
          }),

          createImage({
            id:
              "owl-resource-route",

            ruleId:
              "professional_kill_resource_transform",

            semanticGroup:
              "kill_resource",

            title:
              "杀印相生结构较完整",

            role:
              "core",

            status:
              "structurally_supported",

            workStatus:
              "structurally_supported",

            workPath:
              createWorkPath(
                "七杀",
                "偏印",
              ),
          }),
        ],
      });

    const properResourceRoute =
      result.images.find(
        (image) =>
          image.id ===
          "proper-resource-route",
      );

    const owlResourceRoute =
      result.images.find(
        (image) =>
          image.id ===
          "owl-resource-route",
      );

    assert.equal(
      properResourceRoute.status,
      "conditional",
    );

    assert.equal(
      owlResourceRoute.status,
      "structurally_supported",
    );
  },
);

runCase(
  "supported hurt officer with resource suppresses hurt officer meets official",
  () => {
    const result =
      arbitrateProfessionalControlImages({
        images: [
          createImage({
            id:
              "hurt-resource",

            ruleId:
              "professional_hurt_officer_with_resource",

            semanticGroup:
              "hurt_officer_with_resource",

            title:
              "伤官配印结构较完整",

            role:
              "core",

            status:
              "structurally_supported",

            confidence:
              "high",

            priority:
              93,

            workStatus:
              "structurally_supported",

            workPath:
              createWorkPath(
                "正印",
                "伤官",
              ),
          }),

          createImage({
            id:
              "hurt-official",

            ruleId:
              "professional_hurt_officer_meets_official",

            semanticGroup:
              "hurt_officer_meets_official",

            title:
              "伤官见官结构张力明显",

            role:
              "tension",

            status:
              "structurally_supported",

            confidence:
              "medium",

            priority:
              92,

            workStatus:
              "structurally_supported",

            workPath:
              createWorkPath(
                "伤官",
                "正官",
              ),
          }),
        ],
      });

    assert.equal(
      result.images.some(
        (image) =>
          image.ruleId ===
          "professional_hurt_officer_meets_official",
      ),
      false,
    );

    assert.equal(
      result.suppressedImages.some(
        (image) =>
          image.ruleId ===
          "professional_hurt_officer_meets_official",
      ),
      true,
    );
  },
);

runCase(
  "domain report exposes professional aggregation fields",
  () => {
    const result =
      buildFactDrivenDomainReport({
        structureSynopsis: {
          summary:
            "日主偏强，印比成势。",
        },

        contractFacts: [],

        compositionImages: [
          createImage({
            id:
              "career-main",

            ruleId:
              "professional_kill_resource_transform",

            semanticGroup:
              "kill_resource",

            title:
              "杀印相生结构较完整",

            brief:
              "压力通过学习与专业承接转化。",

            role:
              "core",

            status:
              "structurally_supported",

            confidence:
              "medium",

            domains: [
              "career",
              "self",
            ],

            semantic: {
              strengths: [
                "能够把压力转化为专业能力。",
              ],

              risks: [
                "责任过重时容易形成长期消耗。",
              ],
            },

            domainNarratives: {
              career: {
                overview:
                  "事业通过责任、学习和专业承接建立位置。",

                manifestation:
                  "适合职责清晰和专业门槛明确的环境。",

                strength:
                  "能够积累专业信用。",

                caution:
                  "责任过重时需要控制承接范围。",
              },
            },
          }),
        ],

        hitList: {
          all: [],
        },

        scope:
          "natal",
      });

    const career =
      result.twelveDomains.find(
        (domain) =>
          domain.key ===
          "career",
      );

    assert.ok(
      career,
    );

    assert.equal(
      career
        .professionalEvidenceLevel,
      "medium",
    );

    assert.equal(
      career
        .primaryProfessionalImage
        ?.ruleId,
      "professional_kill_resource_transform",
    );
  },
);

runCase(
  "master summary uses stronger supported tension as primary",
  () => {
    const compositionImages = [
      createImage({
        id:
          "structural-core",

        ruleId:
          "professional_food_controls_kill",

        semanticGroup:
          "food-controls-kill",

        title:
          "食神制杀结构较完整",

        brief:
          "通过技术和方法承接压力。",

        role:
          "core",

        status:
          "structurally_supported",

        confidence:
          "medium",

        priority:
          95,

        semantic: {
          strengths: [
            "具备处理复杂压力的能力。",
          ],

          risks: [
            "压力和能力失衡时容易消耗。",
          ],
        },
      }),

      createImage({
        id:
          "confirmed-tension",

        ruleId:
          "professional_hurt_officer_meets_official",

        semanticGroup:
          "hurt-officer-official",

        title:
          "伤官见官冲突链",

        brief:
          "个人表达与规则责任形成明显冲突。",

        role:
          "tension",

        status:
          "confirmed",

        confidence:
          "medium",

        priority:
          92,

        semantic: {
          strengths: [
            "能够发现规则和流程中的问题。",
          ],

          risks: [
            "表达方式不当时容易形成权威冲突。",
          ],
        },
      }),
    ];

    const summary =
      buildNatalMasterSummary({
        structureSynopsis: {
          summary:
            "日主有根，原局结构清楚。",
        },

        facts: [],

        compositionImages,

        hitList: {
          all:
            compositionImages.map(
              imageToHitRow,
            ),
        },

        twelveDomains: [],

        scope:
          "natal",
      });

    assert.equal(
      summary
        .selectionDebug
        .primaryRuleId,
      "professional_hurt_officer_meets_official",
    );
  },
);

printRegressionReport();

function createImage({
  id,
  ruleId,
  semanticGroup,
  title = "",
  brief = "",
  role = "support",
  status = "conditional",
  confidence = "medium",
  priority = 50,
  importance = "medium",
  workStatus = "not_applicable",
  workPath = null,
  domains = [
    "career",
  ],
  semantic,
  domainNarratives,
} = {}) {
  return {
    id,
    ruleId,
    semanticGroup,
    title,
    brief:
      brief ||
      title,

    role,
    status,
    confidence,
    priority,
    importance,
    workStatus,
    workPath,

    domains,
    supports: [],

    matchedFactIds: [],
    counterFactIds: [],

    evidence: [],
    supportingEvidence: [],
    weakeningEvidence: [],
    blockingEvidence: [],
    counterEvidence: [],
    reasoning: [],
    arbitrationNotes: [],

    tags: [],

    semantic:
      semantic ?? {
        strengths: [
          `${title}的优势证据`,
        ],

        risks: [
          `${title}的风险证据`,
        ],
      },

    domainNarratives:
      domainNarratives ?? {},

    masterNarrative: {
      lifePattern:
        `${title}形成相应的人生发展模式。`,

      conclusion:
        `${title}需要在现实中进行稳定承接。`,
    },
  };
}

function createWorkPath(
  startTenGod,
  endTenGod,
) {
  return {
    chainId:
      `${startTenGod}-${endTenGod}`,

    nodeIds: [
      `node-${startTenGod}`,
      `node-${endTenGod}`,
    ],

    edgeIds: [
      `edge-${startTenGod}-${endTenGod}`,
    ],

    activationLevel:
      "potential",

    confidence:
      "medium",

    hiddenNodeCount:
      0,

    priorityScore:
      80,

    evidenceText:
      `${startTenGod}指向${endTenGod}`,

    startTenGod,
    endTenGod,

    nodeTenGods: [
      startTenGod,
      endTenGod,
    ],
  };
}

function imageToHitRow(
  image,
) {
  return {
    id:
      image.id,

    sourceRuleId:
      image.ruleId,

    semanticGroup:
      image.semanticGroup,

    name:
      image.title,

    meaning:
      image.brief,

    role:
      image.role,

    status:
      image.status,

    confidence:
      image.confidence,

    priority:
      image.priority,

    score:
      image.priority,

    domains:
      image.domains,

    strengths:
      image.semantic
        ?.strengths ??
      [],

    risks:
      image.semantic
        ?.risks ??
      [],
  };
}

function runCase(
  name,
  callback,
) {
  try {
    callback();

    regressionResults.push({
      name,
      passed:
        true,
    });
  } catch (error) {
    regressionResults.push({
      name,
      passed:
        false,

      error:
        error?.stack ||
        error?.message ||
        String(error),
    });
  }
}

function printRegressionReport() {
  const passed =
    regressionResults.filter(
      (item) =>
        item.passed,
    );

  const failed =
    regressionResults.filter(
      (item) =>
        !item.passed,
    );

  console.log(
    "\n=== Natal V2 Regression ===",
  );

  for (
    const item of
    regressionResults
  ) {
    console.log(
      item.passed
        ? `✅ ${item.name}`
        : `❌ ${item.name}`,
    );

    if (
      !item.passed &&
      item.error
    ) {
      console.log(
        item.error,
      );
    }
  }

  console.log(
    `\n通过：${passed.length}`,
  );

  console.log(
    `失败：${failed.length}`,
  );

  if (failed.length) {
    process.exitCode = 1;
  } else {
    console.log(
      "\nV2核心语义回归全部通过。",
    );
  }
}