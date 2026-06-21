export const KINSHIP_MAPPING_VERSION =
  "kinship-mapping-v1";

// Default traditional mapping. It is a configurable feature map, not a result judgment.
export const DEFAULT_KINSHIP_MAPPING = {
  id: "traditional-default-v1",
  version: KINSHIP_MAPPING_VERSION,

  common: {
    father: {
      primaryTenGods: ["偏财"],
      secondaryTenGods: ["正财"],
      palaceRefs: ["year", "month"],
    },

    mother: {
      primaryTenGods: ["正印"],
      secondaryTenGods: ["偏印"],
      palaceRefs: ["year", "month"],
    },

    siblings: {
      primaryTenGods: ["比肩", "劫财"],
      secondaryTenGods: [],
      palaceRefs: ["month"],
    },
  },

  male: {
    spouse: {
      primaryTenGods: ["正财"],
      secondaryTenGods: ["偏财"],
      palaceRefs: ["spousePalace"],
    },

    children: {
      primaryTenGods: ["正官", "七杀"],
      secondaryTenGods: [],
      palaceRefs: ["hour"],
    },
  },

  female: {
    spouse: {
      primaryTenGods: ["正官"],
      secondaryTenGods: ["七杀"],
      palaceRefs: ["spousePalace"],
    },

    children: {
      primaryTenGods: ["食神", "伤官"],
      secondaryTenGods: [],
      palaceRefs: ["hour"],
    },
  },
};

export function resolveKinshipMapping(
  gender,
  override,
) {
  const mapping = mergeMapping(
    DEFAULT_KINSHIP_MAPPING,
    override,
  );
  const normalizedGender = normalizeGender(gender);
  const baseRoles = {
    ...mapping.common,
  };

  if (normalizedGender === "male" || normalizedGender === "female") {
    return {
      id: mapping.id,
      version: mapping.version,
      gender: normalizedGender,
      mappingStatus: "resolved",
      roles: {
        ...baseRoles,
        ...mapping[normalizedGender],
      },
      candidateRoles: {},
      warnings: [],
    };
  }

  return {
    id: mapping.id,
    version: mapping.version,
    gender: "unknown",
    mappingStatus: "gender_required",
    roles: baseRoles,
    candidateRoles: {
      spouse: [
        { gender: "male", ...mapping.male.spouse },
        { gender: "female", ...mapping.female.spouse },
      ],
      children: [
        { gender: "male", ...mapping.male.children },
        { gender: "female", ...mapping.female.children },
      ],
    },
    warnings: [
      "gender is required to resolve spouse and children kinship mappings",
    ],
  };
}

function normalizeGender(value) {
  return value === "male" || value === "female" ? value : "unknown";
}

function mergeMapping(base, override) {
  if (!override || typeof override !== "object" || Array.isArray(override)) {
    return base;
  }
  return mergePlain(base, override);
}

function mergePlain(base, override) {
  if (Array.isArray(base)) return Array.isArray(override) ? override : base;
  if (!isPlainObject(base)) return override === undefined ? base : override;

  const result = { ...base };
  const source = isPlainObject(override) ? override : {};
  for (const [key, value] of Object.entries(source)) {
    result[key] = key in base ? mergePlain(base[key], value) : value;
  }
  return result;
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
