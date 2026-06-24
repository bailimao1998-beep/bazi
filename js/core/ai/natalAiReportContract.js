export const NATAL_SECTION_DEFINITIONS =
  Object.freeze([
    {
      key: "overall",
      title: "总体判断",
    },
    {
      key: "personality",
      title: "性格与能力",
    },
    {
      key: "learning",
      title: "学习与思维",
    },
    {
      key: "career",
      title: "事业与工作方式",
    },
    {
      key: "wealth",
      title: "财富与资源处理",
    },
    {
      key: "relationship",
      title: "感情互动",
    },
    {
      key: "family",
      title: "家庭与人际",
    },
    {
      key: "expression",
      title: "表达与成果",
    },
    {
      key: "wellbeing",
      title: "身心节奏",
    },
  ]);

export function normalizeNatalAiReport(
  result = {},
) {
  const source =
    isPlainObject(result)
      ? result
      : {};

  const overview =
    normalizeOverview(
      source.overview,
    );

  const sections =
    normalizeSections(
      source.sections,
    );

  return {
    version:
      textValue(
        source.version,
      ) ||
      "bazi-natal-report-v3",

    scope:
      "natal",

    title:
      textValue(
        source.title,
      ) ||
      "出生原局综合分析",

    confidence:
      normalizeConfidence(
        source.confidence,
      ),

    overview,

    sections,

    boundaries:
      normalizeTextRows(
        source.boundaries,
      ),

    warnings:
      normalizeTextRows(
        source.warnings,
      ),
  };
}

export function validateNatalAiReport(
  report = {},
) {
  const errors = [];

  if (
    !textValue(
      report.overview
        ?.headline,
    )
  ) {
    errors.push(
      "overview_headline_missing",
    );
  }

  if (
    !textValue(
      report.overview
        ?.summary,
    )
  ) {
    errors.push(
      "overview_summary_missing",
    );
  }

  const sections =
    Array.isArray(
      report.sections,
    )
      ? report.sections
      : [];

  for (
    const definition of
    NATAL_SECTION_DEFINITIONS
  ) {
    const section =
      sections.find(
        (item) =>
          item?.key ===
          definition.key,
      );

    if (!section) {
      errors.push(
        `section_missing:${definition.key}`,
      );

      continue;
    }

    for (
      const field of [
        "summary",
        "advantage",
        "cost",
        "advice",
      ]
    ) {
      if (
        !textValue(
          section[field],
        )
      ) {
        errors.push(
          `section_field_missing:${definition.key}.${field}`,
        );
      }
    }
  }

  return {
    ok:
      errors.length === 0,

    errors,
  };
}

function normalizeOverview(
  value,
) {
  if (
    typeof value ===
    "string"
  ) {
    return {
      headline: "",
      summary:
        value.trim(),
      evidenceRefs: [],
    };
  }

  const source =
    isPlainObject(value)
      ? value
      : {};

  return {
    headline:
      textValue(
        source.headline,
      ),

    summary:
      textValue(
        source.summary,
      ),

    evidenceRefs:
      normalizeTextRows(
        source.evidenceRefs,
      ),
  };
}

function normalizeSections(
  value,
) {
  const rows =
    Array.isArray(value)
      ? value.filter(
          isPlainObject,
        )
      : [];

  return NATAL_SECTION_DEFINITIONS
    .map(
      (definition) => {
        const source =
          rows.find(
            (item) =>
              textValue(
                item.key,
              ) ===
              definition.key,
          ) ??
          rows.find(
            (item) =>
              textValue(
                item.title,
              ) ===
              definition.title,
          );

        if (!source) {
          return null;
        }

        return {
          key:
            definition.key,

          title:
            definition.title,

          summary:
            textValue(
              source.summary,
            ),

          advantage:
            textValue(
              source.advantage,
            ),

          cost:
            textValue(
              source.cost,
            ),

          advice:
            textValue(
              source.advice,
            ),

          evidenceRefs:
            normalizeTextRows(
              source.evidenceRefs,
            ),
        };
      },
    )
    .filter(Boolean);
}

function normalizeConfidence(
  value,
) {
  const normalized =
    textValue(value);

  return [
    "high",
    "medium",
    "low",
  ].includes(normalized)
    ? normalized
    : "medium";
}

function normalizeTextRows(
  value,
) {
  const rows =
    Array.isArray(value)
      ? value
      : (
          value
            ? [value]
            : []
        );

  return [
    ...new Set(
      rows
        .map(
          textValue,
        )
        .filter(Boolean),
    ),
  ];
}

function textValue(
  value,
) {
  return typeof value ===
    "string"
    ? value.trim()
    : "";
}

function isPlainObject(
  value,
) {
  return Boolean(
    value &&
    typeof value ===
      "object" &&
    !Array.isArray(value),
  );
}