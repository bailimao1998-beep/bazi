export const SUMMARY_PRIORITY_COUNT =
  3;

export const REVIEW_QUESTION_LIMITS =
  Object.freeze({
    min: 3,
    max: 5,
  });

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
      "bazi-natal-report-v4",

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

    summaryAdvice:
    normalizeSummaryAdvice(
        source.summaryAdvice,
    ),

    reviewQuestions:
    normalizeReviewQuestions(
        source.reviewQuestions,
    ),
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
    validateSummaryAdvice(
    report.summaryAdvice,
    errors,
    );

    validateReviewQuestions(
    report.reviewQuestions,
    errors,
    );
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

function normalizeSummaryAdvice(
  value,
) {
  const source =
    isPlainObject(value)
      ? value
      : {};

  const priorities =
    (
      Array.isArray(
        source.priorities,
      )
        ? source.priorities
        : []
    )
      .filter(
        isPlainObject,
      )
      .map(
        (item) => ({
          title:
            textValue(
              item.title,
            ),

          action:
            textValue(
              item.action,
            ),

          reason:
            textValue(
              item.reason,
            ),

          evidenceRefs:
            normalizeTextRows(
              item.evidenceRefs,
            ),
        }),
      )
      .slice(
        0,
        SUMMARY_PRIORITY_COUNT,
      );

  return {
    headline:
      textValue(
        source.headline,
      ),

    summary:
      textValue(
        source.summary,
      ),

    priorities,

    caution:
      textValue(
        source.caution,
      ),

    evidenceRefs:
      normalizeTextRows(
        source.evidenceRefs,
      ),
  };
}

function normalizeReviewQuestions(
  value,
) {
  return (
    Array.isArray(value)
      ? value
      : []
  )
    .filter(
      isPlainObject,
    )
    .map(
      (item) => ({
        domain:
          textValue(
            item.domain,
          ),

        question:
          normalizeQuestion(
            item.question,
          ),

        reviewFocus:
          textValue(
            item.reviewFocus,
          ),

        evidenceRefs:
          normalizeTextRows(
            item.evidenceRefs,
          ),
      }),
    )
    .filter(
      (item) =>
        item.domain &&
        item.question &&
        item.reviewFocus,
    )
    .slice(
      0,
      REVIEW_QUESTION_LIMITS.max,
    );
}

function normalizeQuestion(
  value,
) {
  const text =
    textValue(value)
      .replace(
        /[。！!]+$/,
        "",
      );

  if (!text) {
    return "";
  }

  return /[？?]$/.test(text)
    ? text
    : `${text}？`;
}

function validateSummaryAdvice(
  value,
  errors,
) {
  if (
    !textValue(
      value?.headline,
    )
  ) {
    errors.push(
      "summary_advice_headline_missing",
    );
  }

  if (
    !textValue(
      value?.summary,
    )
  ) {
    errors.push(
      "summary_advice_summary_missing",
    );
  }

  if (
    !textValue(
      value?.caution,
    )
  ) {
    errors.push(
      "summary_advice_caution_missing",
    );
  }

  const priorities =
    Array.isArray(
      value?.priorities,
    )
      ? value.priorities
      : [];

  if (
    priorities.length !==
    SUMMARY_PRIORITY_COUNT
  ) {
    errors.push(
      "summary_advice_priorities_count_invalid",
    );
  }

  priorities.forEach(
    (
      item,
      index,
    ) => {
      for (
        const field of [
          "title",
          "action",
          "reason",
        ]
      ) {
        if (
          !textValue(
            item?.[field],
          )
        ) {
          errors.push(
            `summary_advice_priority_field_missing:${index}.${field}`,
          );
        }
      }
    },
  );
}

function validateReviewQuestions(
  value,
  errors,
) {
  const questions =
    Array.isArray(value)
      ? value
      : [];

  if (
    questions.length <
      REVIEW_QUESTION_LIMITS.min ||
    questions.length >
      REVIEW_QUESTION_LIMITS.max
  ) {
    errors.push(
      "review_questions_count_invalid",
    );
  }

  questions.forEach(
    (
      item,
      index,
    ) => {
      for (
        const field of [
          "domain",
          "question",
          "reviewFocus",
        ]
      ) {
        if (
          !textValue(
            item?.[field],
          )
        ) {
          errors.push(
            `review_question_field_missing:${index}.${field}`,
          );
        }
      }
    },
  );
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