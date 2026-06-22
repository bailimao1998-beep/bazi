export const NATAL_PROFESSIONAL_IMAGE_MERGE_VERSION =
  "natal-professional-image-merge-v1";

const confidenceRank = {
  unknown: 0,
  low: 1,
  medium: 2,
  high: 3,
};

const roleRank = {
  core: 4,
  support: 3,
  tension: 2,
  conditional: 1,
};

export function mergeNatalProfessionalImages({
  contractImages = [],
  professionalImages = [],
} = {}) {
  const safeContractImages =
    Array.isArray(
      contractImages,
    )
      ? contractImages
      : [];

  const safeProfessionalImages =
    Array.isArray(
      professionalImages,
    )
      ? professionalImages
      : [];

  const replacedRuleIds =
    new Set(
      safeProfessionalImages
        .flatMap(
          (image) =>
            Array.isArray(
              image.replacesRuleIds,
            )
              ? image.replacesRuleIds
              : [],
        )
        .filter(Boolean),
    );

  const retainedContractImages =
    safeContractImages.filter(
      (image) =>
        !replacedRuleIds.has(
          image.ruleId,
        ),
    );

  const combined = [
    ...safeProfessionalImages,
    ...retainedContractImages,
  ];

  const bySemanticGroup =
    new Map();

  for (const image of combined) {
    const semanticGroup =
      image.semanticGroup ||
      image.ruleId ||
      image.id;

    const current =
      bySemanticGroup.get(
        semanticGroup,
      );

    if (
      !current ||
      compareImages(
        image,
        current,
      ) < 0
    ) {
      bySemanticGroup.set(
        semanticGroup,
        image,
      );
    }
  }

  const images =
    [
      ...bySemanticGroup.values(),
    ].sort(compareImages);

  const primaryImage =
    images.find(
      (image) =>
        image.role === "core",
    ) ||
    images.find(
      (image) =>
        image.role === "support",
    ) ||
    images[0] ||
    null;

  return {
    version:
      NATAL_PROFESSIONAL_IMAGE_MERGE_VERSION,

    images,

    primaryImage,

    replacedRuleIds:
      [...replacedRuleIds].sort(),

    retainedContractRuleIds:
      retainedContractImages
        .map(
          (image) =>
            image.ruleId,
        )
        .filter(Boolean)
        .sort(),

    professionalRuleIds:
      safeProfessionalImages
        .map(
          (image) =>
            image.ruleId,
        )
        .filter(Boolean)
        .sort(),

    byRole:
      buildByRole(images),
  };
}

function buildByRole(
  images,
) {
  const result = {
    core: [],
    support: [],
    tension: [],
    conditional: [],
  };

  for (const image of images) {
    const role =
      Object.hasOwn(
        result,
        image.role,
      )
        ? image.role
        : "conditional";

    result[role].push(
      image,
    );
  }

  return result;
}

function compareImages(
  left,
  right,
) {
  return (
    finite(
      right.priority,
    ) -
      finite(
        left.priority,
      ) ||
    roleRank[
      right.role
    ] -
      roleRank[
        left.role
      ] ||
    confidenceRank[
      right.confidence
    ] -
      confidenceRank[
        left.confidence
      ] ||
    String(
      left.ruleId ?? "",
    ).localeCompare(
      String(
        right.ruleId ?? "",
      ),
    )
  );
}

function finite(
  value,
) {
  const number =
    Number(value);

  return Number.isFinite(
    number,
  )
    ? number
    : 0;
}