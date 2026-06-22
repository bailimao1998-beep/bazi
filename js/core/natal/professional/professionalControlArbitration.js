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
  const brokenResourceTenGod =
    normalizeTenGod(
      wealthBreaksResource
        .workPath
        ?.endTenGod,
    );

  const affectedRuleIds = [];

  const hurtOfficerWithResource =
    imageMap.get(
      "professional_hurt_officer_with_resource",
    );

  if (
    routeUsesTenGod(
      hurtOfficerWithResource,
      brokenResourceTenGod,
    )
  ) {
    affectedRuleIds.push(
      "professional_hurt_officer_with_resource",
    );
  }

  const killResourceTransform =
    imageMap.get(
      "professional_kill_resource_transform",
    );

  if (
    routeUsesTenGod(
      killResourceTransform,
      brokenResourceTenGod,
    )
  ) {
    affectedRuleIds.push(
      "professional_kill_resource_transform",
    );
  }

  const officialResourceWorkChain =
    imageMap.get(
      "professional_official_resource_work_chain",
    );

  if (
    routeUsesTenGod(
      officialResourceWorkChain,
      brokenResourceTenGod,
    )
  ) {
    affectedRuleIds.push(
      "professional_official_resource_work_chain",
    );
  }

  downgradeTargets({
    imageMap,

    sourceImage:
      wealthBreaksResource,

    targetRuleIds:
      affectedRuleIds,

    reason:
      brokenResourceTenGod
        ? `财星实际制约${brokenResourceTenGod}，依赖该印星承接的结构需要降级`
        : "财星对印星形成有效制约，但受克印星类型不清，仅对明确同路线结构执行降级",

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
  const affectedRuleIds = [];

  const foodControlsKill =
    imageMap.get(
      "professional_food_controls_kill",
    );

  if (
    routeStartsWithTenGod(
      foodControlsKill,
      "食神",
    )
  ) {
    affectedRuleIds.push(
      "professional_food_controls_kill",
    );
  }

  const outputWealthWorkChain =
    imageMap.get(
      "professional_output_wealth_work_chain",
    );

  /*
   * 只有食神生财受到枭神夺食影响。
   * 伤官生财不能被误伤。
   */
  if (
    routeStartsWithTenGod(
      outputWealthWorkChain,
      "食神",
    )
  ) {
    affectedRuleIds.push(
      "professional_output_wealth_work_chain",
    );
  }

  downgradeTargets({
    imageMap,

    sourceImage:
      owlSeizesFood,

    targetRuleIds:
      affectedRuleIds,

    reason:
      "偏印实际制约食神，依赖食神作为起点的结构需要降级",

    decisions,
  });

  /*
   * 食伤主位出口无法确定究竟来自食神还是伤官，
   * 所以只增加减弱提示，不直接降级。
   */
  annotateTargets({
    imageMap,

    sourceImage:
      owlSeizesFood,

    targetRuleIds: [
      "professional_output_anchor_in_host",
    ],

    reason:
      "偏印制食神会削弱部分食伤出口，但无法据此认定全部主位食伤出口失效",

    priorityPenalty:
      2,

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
        sourceImage,
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
  sourceImage,
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
    originalTitle:
    image.originalTitle ??
    image.title,

    title:
    buildDowngradedTitle({
        image,
        sourceImage,
    }),
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

function routeStartsWithTenGod(
  image,
  tenGod,
) {
  const normalizedTenGod =
    normalizeTenGod(
      tenGod,
    );

  if (!normalizedTenGod) {
    return false;
  }

  return (
    normalizeTenGod(
      image?.workPath
        ?.startTenGod,
    ) ===
    normalizedTenGod
  );
}

function routeUsesTenGod(
  image,
  tenGod,
) {
  const normalizedTenGod =
    normalizeTenGod(
      tenGod,
    );

  if (!normalizedTenGod) {
    return false;
  }

  const nodeTenGods =
    Array.isArray(
      image?.workPath
        ?.nodeTenGods,
    )
      ? image.workPath
          .nodeTenGods
          .map(
            normalizeTenGod,
          )
      : [];

  return (
    normalizeTenGod(
      image?.workPath
        ?.startTenGod,
    ) ===
      normalizedTenGod ||
    normalizeTenGod(
      image?.workPath
        ?.endTenGod,
    ) ===
      normalizedTenGod ||
    nodeTenGods.includes(
      normalizedTenGod,
    )
  );
}

function buildDowngradedTitle({
  image,
  sourceImage,
}) {
  const baseTitle =
    String(
      image?.originalTitle ??
      image?.title ??
      "专业结构",
    )
      .replace(
        /（受.+?牵制，结构降级）$/,
        "",
      )
      .trim();

  const sourceLabel =
    resolveSourceLabel(
      sourceImage,
    );

  return (
    `${baseTitle}（受${sourceLabel}牵制，结构降级）`
  );
}

function resolveSourceLabel(
  image,
) {
  const semanticGroup =
    String(
      image?.semanticGroup ??
      "",
    );

  if (
    semanticGroup ===
    "wealth_breaks_resource"
  ) {
    return "财坏印";
  }

  if (
    semanticGroup ===
    "owl_seizes_food"
  ) {
    return "枭神夺食";
  }

  return (
    String(
      image?.title ??
      "竞争结构",
    )
      .replace(
        /(冲突链|结构张力明显|结构候选|做功链|结构较完整)$/,
        "",
      )
      .trim() ||
    "竞争结构"
  );
}

function normalizeTenGod(
  value,
) {
  const normalized =
    String(
      value ?? "",
    ).trim();

  return [
    "正印",
    "偏印",
    "食神",
    "伤官",
    "正官",
    "七杀",
    "正财",
    "偏财",
    "比肩",
    "劫财",
  ].includes(
    normalized,
  )
    ? normalized
    : "";
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