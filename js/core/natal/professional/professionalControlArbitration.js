import {
  compareNatalProfessionalImages,
  professionalStatusRank,
  selectNatalPrimaryImage,
} from "./professionalImageRanking.js";

export const PROFESSIONAL_CONTROL_ARBITRATION_VERSION =
  "professional-control-arbitration-v1";

const confidenceRank = {
  unknown: 0,
  low: 1,
  medium: 2,
  high: 3,
};

const downgradeStatusMap = {
  confirmed:
    "structurally_supported",

  derived:
    "structurally_supported",

  structurally_supported:
    "conditional",

  conditional:
    "conditional",

  candidate:
    "weak",

  weak:
    "weak",

  unknown:
    "unknown",
};

const downgradeWorkStatusMap = {
  activated:
    "structurally_supported",

  structurally_supported:
    "connected",

  connected:
    "connected",

  presence_only:
    "presence_only",

  not_applicable:
    "not_applicable",
};

export function arbitrateProfessionalControlImages({
  images = [],
} = {}) {
  const imageMap =
    new Map(
      (
        Array.isArray(images)
          ? images
          : []
      ).map(
        (image) => [
          image.ruleId,
          cloneImage(image),
        ],
      ),
    );

  const suppressedImages = [];
  const decisions = [];

  const wealthBreaksResource =
    imageMap.get(
      "professional_wealth_breaks_resource",
    );

  if (
    isSupportedImage(
      wealthBreaksResource,
    )
  ) {
    downgradeTargets({
      imageMap,
      sourceImage:
        wealthBreaksResource,

      targetRuleIds: [
        "professional_hurt_officer_with_resource",
        "professional_kill_resource_transform",
        "professional_official_resource_work_chain",
      ],

      reason:
        "财星对印星形成有效破坏，依赖印星承接的结构需要降级",

      decisions,
    });
  }

  const owlSeizesFood =
    imageMap.get(
      "professional_owl_seizes_food",
    );

  if (
    isSupportedImage(
      owlSeizesFood,
    )
  ) {
    downgradeTargets({
      imageMap,
      sourceImage:
        owlSeizesFood,

      targetRuleIds: [
        "professional_food_controls_kill",
        "professional_output_wealth_work_chain",
        "professional_output_anchor_in_host",
      ],

      reason:
        "偏印对食神形成有效制约，依赖食神出口的结构需要降级",

      decisions,
    });
  }

  const hurtOfficerWithResource =
    imageMap.get(
      "professional_hurt_officer_with_resource",
    );

  const hurtOfficerMeetsOfficial =
    imageMap.get(
      "professional_hurt_officer_meets_official",
    );

  if (
    isSupportedImage(
      hurtOfficerWithResource,
    ) &&
    hurtOfficerMeetsOfficial &&
    compareImageStrength(
      hurtOfficerWithResource,
      hurtOfficerMeetsOfficial,
    ) >= 0
  ) {
    imageMap.delete(
      "professional_hurt_officer_meets_official",
    );

    suppressedImages.push({
      ...hurtOfficerMeetsOfficial,

      suppressedBy:
        hurtOfficerWithResource
          .ruleId,

      suppressionReason:
        "正印对伤官的制约足以承接伤官见官冲突，伤官见官不再作为主要结构输出",
    });

    decisions.push({
      action:
        "suppress",

      sourceRuleId:
        hurtOfficerWithResource
          .ruleId,

      targetRuleId:
        hurtOfficerMeetsOfficial
          .ruleId,

      reason:
        "resource_resolves_hurt_officer_conflict",
    });
  }

  const officialKillMixture =
    imageMap.get(
      "professional_official_kill_mixture",
    );

  if (
    isSupportedImage(
      officialKillMixture,
    )
  ) {
    annotateTargets({
      imageMap,

      sourceImage:
        officialKillMixture,

      targetRuleIds: [
        "professional_food_controls_kill",
        "professional_kill_resource_transform",
        "professional_official_resource_work_chain",
        "professional_hurt_officer_meets_official",
      ],

      reason:
        "正官与七杀并见，相关官杀路线的结构纯度需要降低",

      priorityPenalty:
        4,

      decisions,
    });
  }

  const arbitratedImages =
    [
      ...imageMap.values(),
    ].sort(
      compareNatalProfessionalImages,
    );

  return {
    version:
      PROFESSIONAL_CONTROL_ARBITRATION_VERSION,

    images:
      arbitratedImages,

    primaryImage:
      selectNatalPrimaryImage(
        arbitratedImages,
      ),

    suppressedImages:
      suppressedImages.sort(
        compareNatalProfessionalImages,
      ),

    decisions,
  };
}

function downgradeTargets({
  imageMap,
  sourceImage,
  targetRuleIds,
  reason,
  decisions,
}) {
  for (
    const targetRuleId of
    targetRuleIds
  ) {
    const targetImage =
      imageMap.get(
        targetRuleId,
      );

    if (!targetImage) {
      continue;
    }

    const downgraded =
      downgradeImage(
        targetImage,
        reason,
      );

    imageMap.set(
      targetRuleId,
      downgraded,
    );

    decisions.push({
      action:
        "downgrade",

      sourceRuleId:
        sourceImage.ruleId,

      targetRuleId,

      previousStatus:
        targetImage.status,

      nextStatus:
        downgraded.status,

      previousWorkStatus:
        targetImage.workStatus,

      nextWorkStatus:
        downgraded.workStatus,

      reason,
    });
  }
}

function annotateTargets({
  imageMap,
  sourceImage,
  targetRuleIds,
  reason,
  priorityPenalty,
  decisions,
}) {
  for (
    const targetRuleId of
    targetRuleIds
  ) {
    const targetImage =
      imageMap.get(
        targetRuleId,
      );

    if (!targetImage) {
      continue;
    }

    const annotated = {
      ...targetImage,

      priority:
        finite(
          targetImage.priority,
        ) -
        finite(
          priorityPenalty,
        ),

      weakeningEvidence:
        uniqueText([
          ...(
            targetImage
              .weakeningEvidence ??
            []
          ),

          reason,
        ]),

      counterEvidence:
        uniqueText([
          ...(
            targetImage
              .counterEvidence ??
            []
          ),

          reason,
        ]),

      reasoning:
        uniqueText([
          ...(
            targetImage.reasoning ??
            []
          ),

          `减弱条件：${reason}`,
        ]),

      arbitrationNotes:
        uniqueText([
          ...(
            targetImage
              .arbitrationNotes ??
            []
          ),

          reason,
        ]),
    };

    imageMap.set(
      targetRuleId,
      annotated,
    );

    decisions.push({
      action:
        "annotate",

      sourceRuleId:
        sourceImage.ruleId,

      targetRuleId,

      reason,
    });
  }
}

function downgradeImage(
  image,
  reason,
) {
  const nextStatus =
    downgradeStatusMap[
      image.status
    ] ??
    "conditional";

  const nextWorkStatus =
    downgradeWorkStatusMap[
      image.workStatus
    ] ??
    image.workStatus ??
    "not_applicable";

  const nextRole =
    nextStatus ===
      "conditional"
      ? "conditional"
      : image.role ===
          "core"
        ? "support"
        : image.role;

  return {
    ...image,

    status:
      nextStatus,

    workStatus:
      nextWorkStatus,

    role:
      nextRole,

    confidence:
      downgradeConfidence(
        image.confidence,
      ),

    priority:
      finite(
        image.priority,
      ) - 8,

    weakeningEvidence:
      uniqueText([
        ...(
          image
            .weakeningEvidence ??
          []
        ),

        reason,
      ]),

    counterEvidence:
      uniqueText([
        ...(
          image
            .counterEvidence ??
          []
        ),

        reason,
      ]),

    reasoning:
      uniqueText([
        ...(
          image.reasoning ??
          []
        ),

        `降级条件：${reason}`,
      ]),

    arbitrationNotes:
      uniqueText([
        ...(
          image
            .arbitrationNotes ??
          []
        ),

        reason,
      ]),
  };
}

function isSupportedImage(
  image,
) {
  if (!image) {
    return false;
  }

  return (
    (
      professionalStatusRank[
        image.status
      ] ?? 0
    ) >=
    professionalStatusRank
      .structurally_supported
  );
}

function compareImageStrength(
  left,
  right,
) {
  const leftStatus =
    professionalStatusRank[
      left?.status
    ] ?? 0;

  const rightStatus =
    professionalStatusRank[
      right?.status
    ] ?? 0;

  if (
    leftStatus !==
    rightStatus
  ) {
    return (
      leftStatus -
      rightStatus
    );
  }

  const leftConfidence =
    confidenceRank[
      left?.confidence
    ] ?? 0;

  const rightConfidence =
    confidenceRank[
      right?.confidence
    ] ?? 0;

  if (
    leftConfidence !==
    rightConfidence
  ) {
    return (
      leftConfidence -
      rightConfidence
    );
  }

  return (
    finite(
      left?.priority,
    ) -
    finite(
      right?.priority,
    )
  );
}

function downgradeConfidence(
  value,
) {
  return {
    high:
      "medium",

    medium:
      "low",

    low:
      "low",

    unknown:
      "unknown",
  }[
    value
  ] ?? "unknown";
}

function cloneImage(
  image,
) {
  return {
    ...image,

    evidence:
      [
        ...(
          image.evidence ??
          []
        ),
      ],

    supportingEvidence:
      [
        ...(
          image
            .supportingEvidence ??
          []
        ),
      ],

    weakeningEvidence:
      [
        ...(
          image
            .weakeningEvidence ??
          []
        ),
      ],

    blockingEvidence:
      [
        ...(
          image
            .blockingEvidence ??
          []
        ),
      ],

    counterEvidence:
      [
        ...(
          image
            .counterEvidence ??
          []
        ),
      ],

    reasoning:
      [
        ...(
          image.reasoning ??
          []
        ),
      ],

    arbitrationNotes:
      [
        ...(
          image
            .arbitrationNotes ??
          []
        ),
      ],
  };
}

function uniqueText(
  values,
) {
  return [
    ...new Set(
      (
        Array.isArray(values)
          ? values
          : []
      )
        .map(
          (value) =>
            String(
              value ?? "",
            )
              .replace(
                /\s+/g,
                " ",
              )
              .trim(),
        )
        .filter(Boolean),
    ),
  ];
}

function finite(
  value,
) {
  const parsed =
    Number(value);

  return Number.isFinite(
    parsed,
  )
    ? parsed
    : 0;
}