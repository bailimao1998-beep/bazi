export const professionalStatusRank = {
  unknown: 0,
  weak: 1,
  candidate: 1,
  conditional: 2,
  derived: 3,
  confirmed: 3,
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
    return 60;
  }

  if (
    isConfirmed(status) &&
    role === "support"
  ) {
    return 50;
  }

  if (
    status === "conditional" &&
    role === "core"
  ) {
    return 40;
  }

  if (
    isConfirmed(status) &&
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
