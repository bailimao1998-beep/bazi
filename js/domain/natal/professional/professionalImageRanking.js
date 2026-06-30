export const professionalStatusRank = {

  unknown: 0,

  weak: 1,

  candidate: 1,

  conditional: 2,

  structurally_supported: 3,

  derived: 4,

  confirmed: 4,

};

export const professionalConfidenceRank = {
  unknown: 0,
  low: 1,
  medium: 2,
  high: 3,
};

export const professionalRoleRank = {
  conditional: 1,
  tension: 2,
  support: 3,
  core: 4,
};

const highOrderContractRuleIds =
  new Set([
    "official_resource_support",
    "wealth_official_resource_trace",
    "peer_wealth_competition",
    "resource_heavy_output_weak",
    "output_wealth_chain",
    "hurting_officer_resource_balance",
    "hurting_officer_meets_officer",
    "wealth_heavy_body_weak",
    "officer_killing_mixed",
  ]);

const simpleRelationRuleIds =
  new Set([
    "day_pillar_repetition",
    "spouse_palace_relation_tension",
    "day_branch_combined",
  ]);

const basicSignalRuleIds =
  new Set([
    "month_command_official",
    "element_bias_visible",
    "metal_water_fire_weak",
  ]);

export function resolveNatalNarrativeTier(
  image = {},
) {
  const ruleId =
    normalizeRankingText(
      image.ruleId,
    );

  const cluster =
    resolveNatalNarrativeCluster(
      image,
    );

  if (
    cluster ===
    "relationship_repetition_route"
  ) {
    return 1;
  }

  if (
    cluster ===
    "element_climate_route"
  ) {
    return 2;
  }
  
  if (
    image.source ===
      "professional_context" ||
    ruleId.startsWith(
      "professional_",
    ) ||
    image.workPath
  ) {
    return 4;
  }

  if (
    highOrderContractRuleIds.has(
      ruleId,
    )
  ) {
    return 3;
  }

  if (
    basicSignalRuleIds.has(
      ruleId,
    )
  ) {
    return 2;
  }

  if (
    simpleRelationRuleIds.has(
      ruleId,
    )
  ) {
    return 1;
  }

  return 2;
}

export function isNatalMasterAnchorCandidate(
  image = {},
) {
  const cluster =
    resolveNatalNarrativeCluster(
      image,
    );

  if (
    cluster ===
      "relationship_repetition_route" ||
    cluster ===
      "element_climate_route"
  ) {
    return false;
  }

  return (
    resolveNatalNarrativeTier(
      image,
    ) >= 3 &&
    rank(
      image.status,
      professionalStatusRank,
    ) >=
      professionalStatusRank
        .conditional
  );
}
export function compareNatalMasterNarrativeImages(
  left,
  right,
) {
  return (
    resolveNatalNarrativeTier(
      right,
    ) -
      resolveNatalNarrativeTier(
        left,
      ) ||

    rank(
      right.status,
      professionalStatusRank,
    ) -
      rank(
        left.status,
        professionalStatusRank,
      ) ||

    rank(
      right.confidence,
      professionalConfidenceRank,
    ) -
      rank(
        left.confidence,
        professionalConfidenceRank,
      ) ||

    rank(
      right.role,
      professionalRoleRank,
    ) -
      rank(
        left.role,
        professionalRoleRank,
      ) ||

    finite(
      right.priority,
    ) -
      finite(
        left.priority,
      )
  );
}

export function resolveNatalNarrativeCluster(
  image = {},
) {
  const ruleId =
    normalizeRankingText(
      image.ruleId,
    );

  const semanticGroup =
    normalizeRankingText(
      image.semanticGroup,
    );

  const text =
    `${ruleId}|${semanticGroup}`;

  if (
    /official_resource|kill_resource|wealth_official_resource|wealth_breaks_resource|month_command_official/.test(
      text,
    )
  ) {
    return "official_resource_route";
  }

  if (
    /food_controls_kill|hurt_officer|output_wealth|resource_output|owl_seizes_food/.test(
      text,
    )
  ) {
    return "output_conversion_route";
  }

  if (
    /resource_peer_dominance|peer_wealth/.test(
      text,
    )
  ) {
    return "peer_resource_route";
  }

  if (
    /spouse|day_pillar_repetition|day_branch_combined/.test(
      text,
    )
  ) {
    return "relationship_repetition_route";
  }

  if (
    /element_bias|metal_water_fire_weak/.test(
      text,
    )
  ) {
    return "element_climate_route";
  }

  return (
    semanticGroup ||
    ruleId ||
    normalizeRankingText(
      image.id,
    )
  );
}

export function resolveNatalNarrativeClusterLabel(
  cluster,
) {
  return {
    official_resource_route:
      "官印与财印主线",

    output_conversion_route:
      "输出与制化主线",

    peer_resource_route:
      "印比与合作主线",

    relationship_repetition_route:
      "关系与重复模式",

    element_climate_route:
      "五行与调候偏性",
  }[
    normalizeRankingText(
      cluster,
    )
  ] || "其他结构";
}

function normalizeRankingText(
  value,
) {
  return String(
    value ?? "",
  ).trim();
}

export function compareNatalProfessionalImages(
  left,
  right,
) {
  return (
    finite(right.priority) -
      finite(left.priority) ||
    rank(
      right.role,
      professionalRoleRank,
    ) -
      rank(
        left.role,
        professionalRoleRank,
      ) ||
    rank(
      right.confidence,
      professionalConfidenceRank,
    ) -
      rank(
        left.confidence,
        professionalConfidenceRank,
      ) ||
    String(
      left.ruleId ?? "",
    ).localeCompare(
      String(
        right.ruleId ?? "",
      ),
    )
  );
}

export function compareNatalSemanticImages(
  left,
  right,
) {
  return (
    rank(
      right.status,
      professionalStatusRank,
    ) -
      rank(
        left.status,
        professionalStatusRank,
      ) ||
    rank(
      right.confidence,
      professionalConfidenceRank,
    ) -
      rank(
        left.confidence,
        professionalConfidenceRank,
      ) ||
    rank(
      right.role,
      professionalRoleRank,
    ) -
      rank(
        left.role,
        professionalRoleRank,
      ) ||
    finite(right.priority) -
      finite(left.priority) ||
    String(
      left.ruleId ?? "",
    ).localeCompare(
      String(
        right.ruleId ?? "",
      ),
    )
  );
}

export function selectNatalPrimaryImage(
  images = [],
) {
  return (
    (
      Array.isArray(images)
        ? images
        : []
    )
      .slice()
      .sort(
        comparePrimaryCandidates,
      )[0] ??
    null
  );
}

export function evaluateProfessionalReplacement({
  professionalImage,
  contractImage,
} = {}) {
  if (
    !professionalImage ||
    !contractImage
  ) {
    return {
      accepted: false,
      reason: "missing_image",
    };
  }

  if (
    professionalImage
      .replacementPolicy ===
      "authoritative_refinement" &&
    professionalImage.status !==
      "weak"
  ) {
    return {
      accepted: true,
      reason:
        "authoritative_refinement",
    };
  }

  const professionalStatus =
    rank(
      professionalImage.status,
      professionalStatusRank,
    );

  const contractStatus =
    rank(
      contractImage.status,
      professionalStatusRank,
    );

  if (
    professionalStatus >
    contractStatus
  ) {
    return {
      accepted: true,
      reason:
        "higher_status",
    };
  }

  if (
    professionalStatus <
    contractStatus
  ) {
    return {
      accepted: false,
      reason:
        "lower_status",
    };
  }

  const professionalConfidence =
    rank(
      professionalImage
        .confidence,
      professionalConfidenceRank,
    );

  const contractConfidence =
    rank(
      contractImage
        .confidence,
      professionalConfidenceRank,
    );

  if (
    professionalConfidence <
    contractConfidence
  ) {
    return {
      accepted: false,
      reason:
        "lower_confidence",
    };
  }

  if (
    finite(
      professionalImage.priority,
    ) <
    finite(
      contractImage.priority,
    ) - 8
  ) {
    return {
      accepted: false,
      reason:
        "priority_too_low",
    };
  }

  return {
    accepted: true,
    reason:
      "same_or_better_evidence",
  };
}

function comparePrimaryCandidates(
  left,
  right,
) {
  return (
    primaryTier(right) -
      primaryTier(left) ||
    rank(
      right.confidence,
      professionalConfidenceRank,
    ) -
      rank(
        left.confidence,
        professionalConfidenceRank,
      ) ||
    finite(right.priority) -
      finite(left.priority) ||
    String(
      left.ruleId ?? "",
    ).localeCompare(
      String(
        right.ruleId ?? "",
      ),
    )
  );
}

function primaryTier(image = {}) {
  const status =
    image.status;

  const role =
    image.role;

  if (
    isConfirmed(status) &&
    role === "core"
  ) {
    return 70;
  }

  if (
    isConfirmed(status) &&
    role === "support"
  ) {
    return 60;
  }

  if (
    status ===
      "structurally_supported" &&
    role === "core"
  ) {
    return 55;
  }

  if (
    status ===
      "structurally_supported" &&
    role === "support"
  ) {
    return 50;
  }

  if (
    status === "conditional" &&
    role === "core"
  ) {
    return 45;
  }

  if (
    isConfirmed(status) &&
    role === "tension"
  ) {
    return 40;
  }

  if (
    status ===
      "structurally_supported" &&
    role === "tension"
  ) {
    return 35;
  }

  if (
    status === "conditional" &&
    role === "support"
  ) {
    return 30;
  }

  if (
    status === "conditional" &&
    role === "tension"
  ) {
    return 20;
  }

  return 10;
}

function isConfirmed(value) {
  return (
    value === "confirmed" ||
    value === "derived"
  );
}

function rank(value, map) {
  return (
    map[
      String(value ?? "")
    ] ?? 0
  );
}

function finite(value) {
  const parsed =
    Number(value);

  return Number.isFinite(
    parsed,
  )
    ? parsed
    : 0;
}
