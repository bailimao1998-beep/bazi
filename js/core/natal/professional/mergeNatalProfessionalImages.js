import {
  compareNatalProfessionalImages,
  evaluateProfessionalReplacement,
  selectNatalPrimaryImage,
} from "./professionalImageRanking.js";

export const NATAL_PROFESSIONAL_IMAGE_MERGE_VERSION =
  "natal-professional-image-merge-v1";

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

  const replacementDecisions = [];
  const replacedRuleIds = new Set();
  const suppressedProfessionalImages = [];
  const acceptedProfessionalImages = [];
  const retainedContractByRuleId =
    new Map(
      safeContractImages.map(
        (image) => [
          image.ruleId,
          image,
        ],
      ),
    );

  for (const professionalImage of safeProfessionalImages) {
    const targetRuleIds =
      (
        Array.isArray(
          professionalImage
            .replacesRuleIds,
        )
          ? professionalImage
              .replacesRuleIds
          : []
      ).filter(Boolean);

    const targetImages =
      targetRuleIds
        .map(
          (ruleId) =>
            retainedContractByRuleId
              .get(ruleId),
        )
        .filter(Boolean);

    if (!targetImages.length) {
      acceptedProfessionalImages.push(
        professionalImage,
      );
      continue;
    }

    const decisions =
      targetImages.map(
        (contractImage) => {
          const replacement =
            evaluateProfessionalReplacement({
              professionalImage,
              contractImage,
            });

          return {
            professionalRuleId:
              professionalImage.ruleId ??
              "",

            contractRuleId:
              contractImage.ruleId ??
              "",

            accepted:
              replacement.accepted,

            reason:
              replacement.reason,
          };
        },
      );

    replacementDecisions.push(
      ...decisions,
    );

    const acceptedDecisions =
      decisions.filter(
        (decision) =>
          decision.accepted,
      );

    if (
      acceptedDecisions.length
    ) {
      acceptedProfessionalImages.push(
        professionalImage,
      );

      for (
        const decision of
        acceptedDecisions
      ) {
        replacedRuleIds.add(
          decision.contractRuleId,
        );
        retainedContractByRuleId.delete(
          decision.contractRuleId,
        );
      }
    } else {
      suppressedProfessionalImages.push(
        professionalImage,
      );
    }
  }

  const retainedContractImages = [
    ...retainedContractByRuleId
      .values(),
  ];

  const combined = [
    ...acceptedProfessionalImages,
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
      compareNatalProfessionalImages(
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
    ].sort(
      compareNatalProfessionalImages,
    );

  const primaryImage =
    selectNatalPrimaryImage(
      images,
    );

  return {
    version:
      NATAL_PROFESSIONAL_IMAGE_MERGE_VERSION,

    images,

    primaryImage,

    replacementDecisions,

    suppressedProfessionalImages,

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
      acceptedProfessionalImages
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
