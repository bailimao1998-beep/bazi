export const DOMAIN_PROFESSIONAL_AGGREGATION_VERSION =
  "domain-professional-aggregation-v1";

export const professionalEvidenceStatusRank =
  Object.freeze({
    unknown: 0,
    weak: 1,
    candidate: 1,
    conditional: 2,
    structurally_supported: 3,
    derived: 4,
    confirmed: 4,
  });

const confidenceRank =
  Object.freeze({
    unknown: 0,
    low: 1,
    medium: 2,
    high: 3,
  });

const roleRank =
  Object.freeze({
    core: 5,
    tension: 4,
    support: 3,
    conditional: 2,
    candidate: 1,
  });

export function aggregateDomainProfessionalImages({
  images = [],
  domainKey = "",
} = {}) {
  const normalizedDomainKey =
    normalizeText(domainKey);

  const relevantImages =
    dedupeBySemanticGroup(
      (
        Array.isArray(images)
          ? images
          : []
      )
        .filter(Boolean)
        .filter(
          (image) =>
            !normalizedDomainKey ||
            includesDomain(
              image,
              normalizedDomainKey,
            ),
        )
        .slice()
        .sort(
          compareProfessionalEvidenceImages,
        ),
    );

  const positiveImages =
    relevantImages.filter(
      (image) =>
        image.role === "core" ||
        image.role === "support",
    );

  const tensionImages =
    relevantImages.filter(
      (image) =>
        image.role === "tension",
    );

  const conditionalImages =
    relevantImages.filter(
      (image) =>
        image.role ===
          "conditional" ||
        image.status ===
          "conditional",
    );

  const primaryPositive =
    positiveImages.find(
      isSupportedProfessionalImage,
    ) ??
    positiveImages[0] ??
    null;

  const supportImage =
    positiveImages.find(
      (image) =>
        image !== primaryPositive &&
        isSupportedProfessionalImage(
          image,
        ),
    ) ??
    positiveImages.find(
      (image) =>
        image !== primaryPositive,
    ) ??
    null;

  const primaryTension =
    tensionImages.find(
      isSupportedProfessionalImage,
    ) ??
    tensionImages[0] ??
    null;

  const primaryCandidates =
    uniqueImages([
      primaryPositive,
      primaryTension,
      relevantImages[0],
    ])
      .sort(
        compareProfessionalEvidenceImages,
      );

  const primaryImage =
    primaryCandidates[0] ??
    null;

  const decisiveImages =
    uniqueImages([
      primaryImage,
      primaryPositive,
      supportImage,
      primaryTension,
    ])
      .sort(
        compareProfessionalEvidenceImages,
      )
      .slice(0, 4);

  const supportedImages =
    relevantImages.filter(
      isSupportedProfessionalImage,
    );

  const confirmedImages =
    relevantImages.filter(
      (image) =>
        statusRank(
          image.status,
        ) >=
        professionalEvidenceStatusRank
          .confirmed,
    );

  const evidenceLevel =
    resolveEvidenceLevel({
      confirmedImages,
      supportedImages,
      relevantImages,
    });

  return {
    version:
      DOMAIN_PROFESSIONAL_AGGREGATION_VERSION,

    domainKey:
      normalizedDomainKey,

    relevantImages,
    decisiveImages,

    primaryImage,
    primaryPositive,
    supportImage,
    primaryTension,

    positiveImages,
    tensionImages,
    conditionalImages,
    supportedImages,
    confirmedImages,

    evidenceLevel,

    hasSupportedImage:
      supportedImages.length > 0,

    hasConfirmedImage:
      confirmedImages.length > 0,

    counts: {
      total:
        relevantImages.length,

      positive:
        positiveImages.length,

      tension:
        tensionImages.length,

      conditional:
        conditionalImages.length,

      supported:
        supportedImages.length,

      confirmed:
        confirmedImages.length,
    },
  };
}

export function compareProfessionalEvidenceImages(
  left,
  right,
) {
  return (
    statusRank(
      right?.status,
    ) -
      statusRank(
        left?.status,
      ) ||

    confidenceValue(
      right?.confidence,
    ) -
      confidenceValue(
        left?.confidence,
      ) ||

    roleValue(
      right?.role,
    ) -
      roleValue(
        left?.role,
      ) ||

    finite(
      right?.priority,
    ) -
      finite(
        left?.priority,
      ) ||

    normalizeText(
      left?.ruleId,
    ).localeCompare(
      normalizeText(
        right?.ruleId,
      ),
    )
  );
}

export function isSupportedProfessionalImage(
  image,
) {
  return (
    statusRank(
      image?.status,
    ) >=
    professionalEvidenceStatusRank
      .structurally_supported
  );
}

function resolveEvidenceLevel({
  confirmedImages,
  supportedImages,
  relevantImages,
}) {
  const confirmedWithConfidence =
    confirmedImages.some(
      (image) =>
        confidenceValue(
          image.confidence,
        ) >=
        confidenceRank.medium,
    );

  if (
    confirmedWithConfidence
  ) {
    return "high";
  }

  if (
    supportedImages.length > 0
  ) {
    return "medium";
  }

  if (
    relevantImages.length > 0
  ) {
    return "low";
  }

  return "none";
}

function dedupeBySemanticGroup(
  images,
) {
  const map = new Map();

  for (const image of images) {
    const key =
      normalizeText(
        image.semanticGroup,
      ) ||
      normalizeText(
        image.ruleId,
      ) ||
      normalizeText(
        image.id,
      );

    if (!key) {
      continue;
    }

    const current =
      map.get(key);

    if (
      !current ||
      compareProfessionalEvidenceImages(
        image,
        current,
      ) < 0
    ) {
      map.set(
        key,
        image,
      );
    }
  }

  return [
    ...map.values(),
  ].sort(
    compareProfessionalEvidenceImages,
  );
}

function includesDomain(
  image,
  domainKey,
) {
  return [
    ...(
      Array.isArray(
        image?.domains,
      )
        ? image.domains
        : []
    ),

    ...(
      Array.isArray(
        image?.supports,
      )
        ? image.supports
        : []
    ),
  ]
    .map(normalizeText)
    .includes(domainKey);
}

function uniqueImages(
  images,
) {
  const result = [];
  const seen = new Set();

  for (
    const image of
    images
  ) {
    if (!image) {
      continue;
    }

    const key =
      normalizeText(
        image.id,
      ) ||
      normalizeText(
        image.ruleId,
      );

    if (
      !key ||
      seen.has(key)
    ) {
      continue;
    }

    seen.add(key);
    result.push(image);
  }

  return result;
}

function statusRank(
  value,
) {
  return (
    professionalEvidenceStatusRank[
      normalizeText(value)
    ] ?? 0
  );
}

function confidenceValue(
  value,
) {
  return (
    confidenceRank[
      normalizeText(value)
    ] ?? 0
  );
}

function roleValue(
  value,
) {
  return (
    roleRank[
      normalizeText(value)
    ] ?? 0
  );
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

function normalizeText(
  value,
) {
  return String(
    value ?? "",
  )
    .replace(
      /\s+/g,
      " ",
    )
    .trim();
}