const STAGE_CONFIG = {
  luck: {
    heading:
      "十年总断",
    themeHeading:
      "十年突出领域",
    minThemes:
      2,
    maxThemes:
      5,
    summaryMax:
      520,
    judgmentMax:
      220,
    primaryStoryMax:
      620,
    minorStoryMax:
      360,
    possibilityLimit:
      4,
    possibilityTextMax:
      180,
    alternativeMax:
      220,
    highEvidenceLimit:
      4,
    normalEvidenceLimit:
      3,
    advicePerTheme:
      2,
    minorAdviceLimit:
      1,
    opportunityLimit:
      4,
    riskLimit:
      4,
    actionLimit:
      4,
    verificationLimit:
      4,
    displayTargetThemes:
      3,
    currentEvidenceRatio:
      0,
    evidenceDisplayLimit:
      8,
  },
  year: {
    heading:
      "今年总断",
    themeHeading:
      "本年主要显像",
    minThemes:
      1,
    maxThemes:
      3,
    summaryMax:
      360,
    judgmentMax:
      190,
    primaryStoryMax:
      430,
    minorStoryMax:
      270,
    possibilityLimit:
      3,
    possibilityTextMax:
      160,
    alternativeMax:
      180,
    highEvidenceLimit:
      3,
    normalEvidenceLimit:
      2,
    advicePerTheme:
      2,
    minorAdviceLimit:
      1,
    opportunityLimit:
      3,
    riskLimit:
      3,
    actionLimit:
      3,
    verificationLimit:
      3,
    displayTargetThemes:
      1,
    currentEvidenceRatio:
      0.34,
    evidenceDisplayLimit:
      7,
  },
  month: {
    heading:
      "本月总断",
    themeHeading:
      "本月主要触发",
    minThemes:
      0,
    maxThemes:
      2,
    summaryMax:
      240,
    judgmentMax:
      160,
    primaryStoryMax:
      300,
    minorStoryMax:
      200,
    possibilityLimit:
      2,
    possibilityTextMax:
      130,
    alternativeMax:
      130,
    highEvidenceLimit:
      3,
    normalEvidenceLimit:
      2,
    advicePerTheme:
      2,
    minorAdviceLimit:
      1,
    opportunityLimit:
      2,
    riskLimit:
      2,
    actionLimit:
      2,
    verificationLimit:
      2,
    displayTargetThemes:
      0,
    currentEvidenceRatio:
      0.5,
    evidenceDisplayLimit:
      6,
  },
};

const TECHNICAL_PATTERN =
  /(?:[甲乙丙丁戊己庚辛壬癸][木火土金水]?|[子丑寅卯辰巳午未申酉戌亥][木火土金水]?|食神|伤官|正官|七杀|正印|偏印|正财|偏财|比肩|劫财|伏吟|反吟|透干|藏干|藏支|三合|三会|六合|暗合|半合|相冲|相刑|相害|相破|合化|成局)/;

export function normalizeStageReportResponse({
  text,
  stage,
} = {}) {
  const parsed =
    parseJsonObject(
      text,
    );

  if (
    !parsed.value
  ) {
    return {
      report:
        null,
      parseError:
        parsed.error ||
        "无法解析结构化报告",
      rawText:
        String(
          text || "",
        ),
    };
  }

  return {
    report:
      normalizeReport(
        parsed.value,
        stage,
      ),
    parseError:
      "",
    rawText:
      String(
        text || "",
      ),
  };
}

export function validateStageReportContract({
  report,
  stage,
  verifiedFacts,
  parseError,
} = {}) {
  const config =
    STAGE_CONFIG[
      stage
    ] ||
    STAGE_CONFIG.year;

  const errors = [];
  const warnings = [];

  if (
    parseError
  ) {
    errors.push(
      `parse_error:${parseError}`,
    );
  }

  if (
    !report
  ) {
    errors.push(
      "missing_report",
    );

    return {
      valid:
        false,
      errors:
        unique(errors),
      warnings:
        unique(warnings),
      safeToDisplay:
        false,
    };
  }

  if (
    text(
      report?.summary,
    ).length <
    20
  ) {
    errors.push(
      "summary_too_short",
    );
  }

  const themes =
    array(
      report?.themes,
    );

  if (
    themes.length <
    config.minThemes
  ) {
    errors.push(
      `insufficient_themes:${themes.length}`,
    );
  }

  if (
    themes.length >
    config.maxThemes
  ) {
    warnings.push(
      `too_many_themes:${themes.length}`,
    );
  }

  const validFactIds =
    new Set(
      array(
        verifiedFacts,
      ).map(
        (fact) =>
          fact?.id,
      ),
    );

  const factMap =
    new Map(
      array(
        verifiedFacts,
      ).map(
        (fact) => [
          fact?.id,
          fact,
        ],
      ),
    );

  const lifeContext =
    extractLifeContext(
      verifiedFacts,
    );

  const availableDomainIds =
    new Set(
      array(
        verifiedFacts,
      )
        .flatMap(
          (fact) =>
            array(
              fact
                ?.meta
                ?.domains,
            ),
        )
        .filter(Boolean),
    );

  const titleSet =
    new Set();

  themes.forEach(
    (
      theme,
      index,
    ) => {
      const prefix =
        `theme_${index + 1}`;

      const title =
        text(
          theme?.title,
        );

      if (
        !title
      ) {
        errors.push(
          `${prefix}:missing_title`,
        );
      } else if (
        titleSet.has(
          title,
        )
      ) {
        warnings.push(
          `${prefix}:duplicate_title`,
        );
      } else {
        titleSet.add(
          title,
        );
      }

      if (
        text(
          theme?.judgment,
        ).length <
        12
      ) {
        errors.push(
          `${prefix}:judgment_too_short`,
        );
      }

      if (
        text(
          theme?.story,
        ).length <
        30
      ) {
        errors.push(
          `${prefix}:story_too_short`,
        );
      }

      const evidenceIds =
        unique(
          array(
            theme
              ?.evidenceIds,
          )
            .map(
              text,
            )
            .filter(Boolean),
        );

      if (
        evidenceIds.length ===
        0
      ) {
        errors.push(
          `${prefix}:missing_evidence`,
        );
      }

      const unknown =
        evidenceIds.filter(
          (id) =>
            !validFactIds.has(
              id,
            ),
        );

      if (
        unknown.length >
        0
      ) {
        errors.push(
          `${prefix}:unknown_evidence:${unknown.join(",")}`,
        );
      }

      if (
        theme
          ?.importance ===
          "高" &&
        evidenceIds.length <
          2
      ) {
        warnings.push(
          `${prefix}:high_theme_needs_two_facts`,
        );
      }

      if (
        array(
          theme?.possibilities,
        ).length >
        config.possibilityLimit
      ) {
        warnings.push(
          `${prefix}:too_many_possibilities`,
        );
      }

      const authoredText = [
        theme?.title,
        theme?.judgment,
        theme?.story,
        theme?.alternative,
        ...array(
          theme?.possibilities,
        ),
        ...array(
          theme?.advice,
        ),
      ]
        .map(
          text,
        )
        .join("\n");

      if (
        /(?:依据|证据)?F\d{2}/i.test(
          authoredText,
        )
      ) {
        errors.push(
          `${prefix}:evidence_id_leaked_into_prose`,
        );
      }

      const specificity =
        countConcreteScenes(
          authoredText,
        );

      if (
        specificity.termCount >= 4 ||
        specificity.categoryCount >= 3
      ) {
        warnings.push(
          `${prefix}:over_specific_scene_enumeration`,
        );
      }

      const evidenceFacts =
        evidenceIds
          .map(
            (id) =>
              factMap.get(id),
          )
          .filter(Boolean);

      const evidenceTexts =
        evidenceFacts
          .map(
            (fact) =>
              fact?.text ||
              "",
          )
          .filter(Boolean);

      validateCurrentStageEvidence({
        evidenceFacts,
        stage,
        minimumRatio:
          config.currentEvidenceRatio,
      }).forEach(
        (code) =>
          errors.push(
            `${prefix}:${code}`,
          ),
      );

      validateTechnicalTokenCoverage({
        authoredText,
        evidenceTexts,
      }).forEach(
        (code) =>
          errors.push(
            `${prefix}:${code}`,
          ),
      );

      validateBranchRelationTokenCoverage({
        authoredText,
        evidenceTexts,
      }).forEach(
        (code) =>
          errors.push(
            `${prefix}:${code}`,
          ),
      );

      validateNegativeTechnicalClaims({
        authoredText,
        evidenceTexts,
      }).forEach(
        (code) =>
          errors.push(
            `${prefix}:${code}`,
          ),
      );

      validateThemeDomainBinding({
        domainId:
          theme?.domainId,
        evidenceFacts,
        availableDomainIds,
      }).forEach(
        (code) =>
          errors.push(
            `${prefix}:${code}`,
          ),
      );

      if (
        evidenceTexts.some(
          (value) =>
            value.includes("同支重复"),
        ) &&
        /旧项目|旧关系|旧机会|再次出现|重新出现|卷土重来|复考|房源|设备采购|上次失败|历史重演/.test(
          authoredText,
        )
      ) {
        errors.push(
          `${prefix}:same_branch_overinterpreted`,
        );
      }

      validateTechnicalClaims({
        authoredText,
        evidenceTexts,
      }).forEach(
        (code) =>
          errors.push(
            `${prefix}:${code}`,
          ),
      );

      validateInterpretiveOverreach(
        authoredText,
      ).forEach(
        (code) =>
          warnings.push(
            `${prefix}:${code}`,
          ),
      );

      if (
        hasLifeStageMismatch(
          authoredText,
          lifeContext,
        )
      ) {
        warnings.push(
          `${prefix}:life_stage_scene_mismatch`,
        );
      }
    },
  );

  const allEvidenceTexts =
    array(
      verifiedFacts,
    )
      .filter(
        (fact) =>
          fact?.evidenceEligible !==
          false,
      )
      .map(
        (fact) =>
          fact?.text ||
          "",
      )
      .filter(Boolean);

  const summaryAndLists = [
    report?.summary,
    ...array(
      report?.opportunities,
    ),
    ...array(
      report?.risks,
    ),
    ...array(
      report?.actions,
    ),
    ...array(
      report?.verification,
    ),
  ]
    .map(
      text,
    )
    .join("\n");

  validateTechnicalClaims({
    authoredText:
      summaryAndLists,
    evidenceTexts:
      allEvidenceTexts,
  }).forEach(
    (code) =>
      warnings.push(
        `top_level_removed:${code}`,
      ),
  );

  validateTechnicalTokenCoverage({
    authoredText:
      summaryAndLists,
    evidenceTexts:
      allEvidenceTexts,
  }).forEach(
    (code) =>
      warnings.push(
        `top_level_removed:${code}`,
      ),
  );

  validateBranchRelationTokenCoverage({
    authoredText:
      summaryAndLists,
    evidenceTexts:
      allEvidenceTexts,
  }).forEach(
    (code) =>
      warnings.push(
        `top_level_removed:${code}`,
      ),
  );

  validateNegativeTechnicalClaims({
    authoredText:
      summaryAndLists,
    evidenceTexts:
      allEvidenceTexts,
  }).forEach(
    (code) =>
      warnings.push(
        `top_level_removed:${code}`,
      ),
  );

  validateInterpretiveOverreach(
    summaryAndLists,
  ).forEach(
    (code) =>
      warnings.push(
        `top_level:${code}`,
      ),
  );

  if (
    hasLifeStageMismatch(
      summaryAndLists,
      lifeContext,
    )
  ) {
    warnings.push(
      "top_level_life_stage_scene_mismatch",
    );
  }

  if (
    repeatedLineCount(
      report,
    ) >
    2
  ) {
    warnings.push(
      "repetitive_content",
    );
  }

  return {
    valid:
      errors.length ===
      0,
    errors:
      unique(errors),
    warnings:
      unique([
        ...warnings,
        ...errors,
      ]),
    safeToDisplay:
      Boolean(
        report &&
        text(
          report?.summary,
        ),
      ),
  };
}

export function renderStageReport({
  report,
  stage,
  verifiedFacts,
} = {}) {
  const config =
    STAGE_CONFIG[
      stage
    ] ||
    STAGE_CONFIG.year;

  const factMap =
    new Map(
      array(
        verifiedFacts,
      ).map(
        (fact) => [
          fact?.id,
          fact,
        ],
      ),
    );

  const lifeContext =
    extractLifeContext(
      verifiedFacts,
    );

  const compiledThemes =
    compileThemesForDisplay({
      report,
      stage,
      verifiedFacts,
      factMap,
      lifeContext,
      config,
    });

  const themeEvidenceTexts =
    unique(
      compiledThemes.flatMap(
        (theme) =>
          theme.evidenceTexts,
      ),
    );

  let summary =
    cleanupDisplayText(
      sanitizeRenderedText({
        value:
          compactParagraph(
            report?.summary,
            config.summaryMax,
          ),
        evidenceTexts:
          themeEvidenceTexts,
        lifeContext,
        stage,
      }),
    );

  if (
    summary.length <
    20
  ) {
    summary =
      buildFallbackSummary({
        themes:
          compiledThemes,
        stage,
      });
  }

  const lines = [
    `### ${config.heading}`,
    summary,
  ];

  if (
    compiledThemes.length >
    0
  ) {
    lines.push(
      "",
      `### ${config.themeHeading}`,
    );
  }

  compiledThemes.forEach(
    (
      theme,
      index,
    ) => {
      const isLastMinor =
        index ===
          compiledThemes.length -
          1 &&
        index >
          0 &&
        theme
          ?.importance !==
          "高";

      lines.push(
        "",
        `#### ${theme.title}`,
        `**判断：**${theme.judgment}`,
        "",
        `**现实剧本：**${theme.story}`,
      );

      const possibilities =
        array(
          theme?.possibilities,
        ).slice(
          0,
          config.possibilityLimit,
        );

      if (
        possibilities.length >
        0
      ) {
        lines.push(
          "",
          "**可能表现：**",
          ...possibilities.map(
            (
              item,
              possibilityIndex,
            ) =>
              `${possibilityIndex + 1}. ${item}`,
          ),
        );
      }

      if (
        text(
          theme
            ?.alternative,
        ) &&
        !isLastMinor
      ) {
        lines.push(
          "",
          `**补充可能：**${theme.alternative}`,
        );
      }

      const evidenceLines =
        unique(
          array(
            theme
              ?.evidenceIds,
          )
            .map(
              (id) =>
                factMap.get(
                  id,
                ),
            )
            .filter(Boolean)
            .map(
              (fact) =>
                fact.text,
            ),
        )
          .slice(
            0,
            config.evidenceDisplayLimit,
          );

      if (
        evidenceLines.length >
        0
      ) {
        lines.push(
          "",
          "**确定依据：**",
          ...evidenceLines.map(
            (
              evidence,
              evidenceIndex,
            ) =>
              `${evidenceIndex + 1}. ${evidence}`,
          ),
        );
      }

      const advice =
        array(
          theme?.advice,
        ).slice(
          0,
          isLastMinor
            ? config.minorAdviceLimit
            : config.advicePerTheme,
        );

      if (
        advice.length >
        0
      ) {
        lines.push(
          "",
          "**应对：**",
          ...advice.map(
            (
              item,
              adviceIndex,
            ) =>
              `${adviceIndex + 1}. ${item}`,
          ),
        );
      }
    },
  );

  const secondaryOverview =
    compileStageSecondaryOverview({
      stage,
      verifiedFacts,
      themes:
        compiledThemes,
    });

  if (
    secondaryOverview.length >
    0
  ) {
    lines.push(
      "",
      `### ${secondaryOverviewHeading(stage)}`,
      ...secondaryOverview.map(
        (item) =>
          `- ${item}`,
      ),
    );
  }

  const opportunities =
    compileAnchoredTopLevelList({
      items:
        report?.opportunities,
      kind:
        "opportunities",
      themes:
        compiledThemes,
      limit:
        config.opportunityLimit,
      lifeContext,
      stage,
    });

  const risks =
    compileAnchoredTopLevelList({
      items:
        report?.risks,
      kind:
        "risks",
      themes:
        compiledThemes,
      limit:
        config.riskLimit,
      lifeContext,
      stage,
    });

  if (
    opportunities.length ||
    risks.length
  ) {
    lines.push(
      "",
      "### 有利与风险",
    );

    if (
      opportunities.length
    ) {
      lines.push(
        "**有利：**",
        ...opportunities.map(
          (item) =>
            `- ${item}`,
        ),
      );
    }

    if (
      risks.length
    ) {
      lines.push(
        "",
        "**风险：**",
        ...risks.map(
          (item) =>
            `- ${item}`,
        ),
      );
    }
  }

  const actions =
    compileAnchoredTopLevelList({
      items:
        report?.actions,
      kind:
        "actions",
      themes:
        compiledThemes,
      limit:
        config.actionLimit,
      lifeContext,
      stage,
    });

  if (
    actions.length
  ) {
    lines.push(
      "",
      "### 行动建议",
      ...actions.map(
        (
          item,
          index,
        ) =>
          `${index + 1}. ${item}`,
      ),
    );
  }

  const verification =
    compileAnchoredTopLevelList({
      items:
        report?.verification,
      kind:
        "verification",
      themes:
        compiledThemes,
      limit:
        config.verificationLimit,
      lifeContext,
      stage,
    });

  if (
    verification.length
  ) {
    lines.push(
      "",
      "### 现实验证",
      ...verification.map(
        (
          item,
          index,
        ) =>
          `${index + 1}. ${ensureQuestion(item)}`,
      ),
    );
  }

  return cleanupFinalRenderedReport(
    lines
      .filter(
        (line) =>
          line !==
          null &&
          line !==
          undefined,
      )
      .join("\n"),
  );
}

function compileThemesForDisplay({
  report,
  stage,
  verifiedFacts,
  factMap,
  lifeContext,
  config,
} = {}) {
  const availableDomainIds =
    new Set(
      array(
        verifiedFacts,
      )
        .flatMap(
          (fact) =>
            array(
              fact
                ?.meta
                ?.domains,
            ),
        )
        .filter(Boolean),
    );

  const compiled = [];
  const usedDomains =
    new Set();
  const usedTitles =
    new Set();

  array(
    report?.themes,
  ).forEach(
    (theme) => {
      const safeTheme =
        compileAiThemeForDisplay({
          theme,
          stage,
          verifiedFacts,
          factMap,
          lifeContext,
          availableDomainIds,
          config,
        });

      if (
        !safeTheme
      ) {
        return;
      }

      const titleKey =
        normalizeForCompare(
          safeTheme.title,
        );

      if (
        usedTitles.has(
          titleKey,
        ) ||
        (
          safeTheme.domainId &&
          usedDomains.has(
            safeTheme.domainId,
          )
        )
      ) {
        return;
      }

      compiled.push(
        safeTheme,
      );

      usedTitles.add(
        titleKey,
      );

      if (
        safeTheme.domainId
      ) {
        usedDomains.add(
          safeTheme.domainId,
        );
      }
    },
  );

  const preferredTarget =
    stage ===
      "luck"
      ? config.displayTargetThemes
      : config.minThemes;

  const target =
    Math.min(
      config.maxThemes,
      Math.max(
        config.minThemes,
        preferredTarget,
      ),
    );

  if (
    compiled.length <
    target
  ) {
    const fallbackThemes =
      buildDeterministicFallbackThemes({
        stage,
        verifiedFacts,
        lifeContext,
        usedDomains,
        needed:
          target -
          compiled.length,
        config,
      });

    fallbackThemes.forEach(
      (theme) => {
        const titleKey =
          normalizeForCompare(
            theme.title,
          );

        if (
          compiled.length >=
            config.maxThemes ||
          usedTitles.has(
            titleKey,
          )
        ) {
          return;
        }

        compiled.push(
          theme,
        );

        usedTitles.add(
          titleKey,
        );

        if (
          theme.domainId
        ) {
          usedDomains.add(
            theme.domainId,
          );
        }
      },
    );
  }

  if (
    compiled.length ===
    0 &&
    (
      stage ===
        "luck" ||
      hasCurrentStageEvidence(
        verifiedFacts,
        stage,
      )
    )
  ) {
    const emergency =
      buildEmergencyFallbackTheme({
        stage,
        verifiedFacts,
        lifeContext,
        config,
      });

    if (
      emergency
    ) {
      compiled.push(
        emergency,
      );
    }
  }

  return compiled.slice(
    0,
    config.maxThemes,
  );
}

function compileAiThemeForDisplay({
  theme,
  stage,
  verifiedFacts,
  factMap,
  lifeContext,
  availableDomainIds,
  config,
} = {}) {
  const evidenceIds =
    unique(
      array(
        theme?.evidenceIds,
      )
        .map(
          text,
        )
        .filter(
          (id) =>
            factMap.has(
              id,
            ),
        ),
    )
      .slice(
        0,
        config.evidenceDisplayLimit,
      );

  if (
    evidenceIds.length ===
    0
  ) {
    return null;
  }

  const evidenceFacts =
    evidenceIds
      .map(
        (id) =>
          factMap.get(
            id,
          ),
      )
      .filter(Boolean);

  const evidenceTexts =
    evidenceFacts
      .map(
        (fact) =>
          fact?.text ||
          "",
      )
      .filter(Boolean);

  const domainId =
    inferDisplayDomainId({
      preferred:
        theme?.domainId,
      evidenceFacts,
    });

  const title =
    cleanupDisplayText(
      sanitizeRenderedText({
        value:
          compactParagraph(
            theme?.title,
            80,
          ),
        evidenceTexts,
        lifeContext,
        stage,
      }),
    );

  const judgment =
    cleanupDisplayText(
      sanitizeRenderedText({
        value:
          compactParagraph(
            theme?.judgment,
            config.judgmentMax,
          ),
        evidenceTexts,
        lifeContext,
        stage,
      }),
    );

  const story =
    cleanupDisplayText(
      sanitizeRenderedText({
        value:
          compactParagraph(
            theme?.story,
            config.primaryStoryMax,
          ),
        evidenceTexts,
        lifeContext,
        stage,
      }),
    );

  const possibilities =
    unique(
      array(
        theme?.possibilities,
      )
        .map(
          (item) =>
            cleanupDisplayText(
              sanitizeRenderedText({
                value:
                  compactParagraph(
                    item,
                    config.possibilityTextMax,
                  ),
                evidenceTexts,
                lifeContext,
                stage,
              }),
            ),
        )
        .filter(Boolean),
    )
      .slice(
        0,
        config.possibilityLimit,
      );

  const alternative =
    cleanupDisplayText(
      sanitizeRenderedText({
        value:
          compactParagraph(
            theme?.alternative,
            config.alternativeMax,
          ),
        evidenceTexts,
        lifeContext,
        stage,
      }),
    );

  const advice =
    unique(
      array(
        theme?.advice,
      )
        .map(
          (item) =>
            cleanupDisplayText(
              sanitizeRenderedText({
                value:
                  compactParagraph(
                    item,
                    140,
                  ),
                evidenceTexts,
                lifeContext,
                stage,
              }),
            ),
        )
        .filter(Boolean),
    );

  if (
    !title ||
    judgment.length <
      8 ||
    story.length <
      20
  ) {
    return null;
  }

  const authoredText = [
    title,
    judgment,
    story,
    alternative,
    ...possibilities,
    ...advice,
  ]
    .filter(Boolean)
    .join("\n");

  const hardErrors = [
    ...validateTechnicalClaims({
      authoredText,
      evidenceTexts,
    }),
    ...validateTechnicalTokenCoverage({
      authoredText,
      evidenceTexts,
    }),
    ...validateBranchRelationTokenCoverage({
      authoredText,
      evidenceTexts,
    }),
    ...validateNegativeTechnicalClaims({
      authoredText,
      evidenceTexts,
    }),
    ...validateThemeDomainBinding({
      domainId,
      evidenceFacts,
      availableDomainIds,
    }),
    ...validateCurrentStageEvidence({
      evidenceFacts,
      stage,
      minimumRatio:
        config.currentEvidenceRatio,
    }),
  ];

  if (
    hardErrors.length >
    0
  ) {
    return null;
  }

  return {
    domainId,
    title,
    importance:
      normalizeImportance(
        theme?.importance,
      ),
    judgment,
    story,
    possibilities,
    alternative,
    evidenceIds,
    evidenceTexts,
    advice,
    authoredText,
    isFallback:
      false,
    fallbackLists:
      buildDomainFallbackLists({
        domainId,
        stage,
        lifeContext,
      }),
  };
}

function buildDeterministicFallbackThemes({
  stage,
  verifiedFacts,
  lifeContext,
  usedDomains,
  needed,
  config,
} = {}) {
  const buckets =
    new Map();

  array(
    verifiedFacts,
  )
    .filter(
      (fact) =>
        fact?.evidenceEligible !==
        false &&
        text(
          fact?.id,
        ) &&
        text(
          fact?.text,
        ),
    )
    .forEach(
      (fact) => {
        array(
          fact
            ?.meta
            ?.domains,
        ).forEach(
          (domainId) => {
            if (
              !domainId
            ) {
              return;
            }

            if (
              !buckets.has(
                domainId,
              )
            ) {
              buckets.set(
                domainId,
                [],
              );
            }

            buckets
              .get(
                domainId,
              )
              .push(
                fact,
              );
          },
        );
      },
    );

  const candidates =
    [
      ...buckets.entries(),
    ]
      .filter(
        (
          [
            domainId,
          ],
        ) =>
          !usedDomains.has(
            domainId,
          ),
      )
      .map(
        (
          [
            domainId,
            facts,
          ],
        ) => ({
          domainId,
          facts:
            uniqueFacts(
              facts,
            ),
          currentFacts:
            uniqueFacts(
              facts.filter(
                (fact) =>
                  isCurrentStageFact(
                    fact,
                    stage,
                  ),
              ),
            ),
          score:
            displayDomainScore({
              domainId,
              facts,
              stage,
            }),
        }),
      )
      .filter(
        (item) =>
          item.facts.length >
            0 &&
          (
            stage ===
              "luck" ||
            item.currentFacts.length >
              0
          ),
      )
      .sort(
        (left, right) =>
          right.score -
          left.score,
      );

  const result = [];

  candidates.forEach(
    (candidate) => {
      if (
        result.length >=
        needed
      ) {
        return;
      }

      const fallback =
        buildFallbackThemeForDomain({
          domainId:
            candidate.domainId,
          facts:
            stage ===
              "luck"
              ? candidate.facts
              : prioritizeCurrentFacts(
                  candidate.facts,
                  stage,
                ),
          stage,
          lifeContext,
          config,
        });

      if (
        fallback
      ) {
        result.push(
          fallback,
        );
      }
    },
  );

  return result;
}

function buildFallbackThemeForDomain({
  domainId,
  facts,
  stage,
  lifeContext,
  config,
} = {}) {
  const copy =
    fallbackDomainCopy({
      domainId,
      stage,
      lifeContext,
    });

  if (
    !copy
  ) {
    return null;
  }

  const evidenceFacts =
    uniqueFacts(
      facts,
    )
      .slice(
        0,
        config.evidenceDisplayLimit,
      );

  if (
    evidenceFacts.length ===
    0
  ) {
    return null;
  }

  return {
    domainId,
    title:
      copy.title,
    importance:
      evidenceFacts.length >=
        2
        ? "高"
        : "中",
    judgment:
      copy.judgment,
    story:
      copy.story,
    possibilities:
      copy.possibilities.slice(
        0,
        config.possibilityLimit,
      ),
    alternative:
      "",
    evidenceIds:
      evidenceFacts.map(
        (fact) =>
          fact.id,
      ),
    evidenceTexts:
      evidenceFacts.map(
        (fact) =>
          fact.text,
      ),
    advice:
      copy.advice,
    authoredText: [
      copy.title,
      copy.judgment,
      copy.story,
      ...copy.possibilities,
      ...copy.advice,
    ].join("\n"),
    isFallback:
      true,
    fallbackLists:
      copy.lists,
  };
}

function buildEmergencyFallbackTheme({
  stage,
  verifiedFacts,
  lifeContext,
  config,
} = {}) {
  const evidenceFacts =
    uniqueFacts(
      array(
        verifiedFacts,
      ).filter(
        (fact) =>
          fact?.evidenceEligible !==
            false &&
          text(
            fact?.id,
          ) &&
          text(
            fact?.text,
          ) &&
          (
            stage ===
              "luck" ||
            isCurrentStageFact(
              fact,
              stage,
            )
          ),
      ),
    )
      .slice(
        0,
        Math.min(
          3,
          config.evidenceDisplayLimit,
        ),
      );

  if (
    evidenceFacts.length ===
    0
  ) {
    return null;
  }

  const older =
    Number(
      lifeContext?.age,
    ) >=
    70;

  const stageText =
    stage ===
      "month"
      ? "本月"
      : stage ===
          "year"
        ? "本年"
        : "此运";

  return {
    domainId:
      "general_stage_overview",
    title:
      "阶段重点与现实调整",
    importance:
      "中",
    judgment:
      `${stageText}已有若干确定信号，但不足以支持过细的单一事件判断。`,
    story:
      older
        ? "更稳妥的看法是，先观察家庭、亲友、日常安排与身心节奏中是否出现需要重新协调的事项；没有明显事件时，也可能只是处理方式和关注重点发生变化。"
        : "更稳妥的看法是，先观察当前计划、关系边界和执行方式中是否出现需要重新协调的事项；没有明显事件时，也可能只是处理节奏和关注重点发生变化。",
    possibilities: [
      "已有事务需要重新排序或补充沟通。",
      "某些想法开始进入实践，但仍需现实反馈确认。",
    ],
    alternative:
      "",
    evidenceIds:
      evidenceFacts.map(
        (fact) =>
          fact.id,
      ),
    evidenceTexts:
      evidenceFacts.map(
        (fact) =>
          fact.text,
      ),
    advice: [
      "先确认现实条件，再做可逆的小幅调整。",
    ],
    authoredText:
      "阶段重点与现实调整",
    isFallback:
      true,
    fallbackLists:
      {
        opportunities:
          "已有经验和现实反馈可以帮助你减少重复试错。",
        risks:
          "若急于把条件性信号当成确定结果，容易造成误判。",
        actions:
          "先处理最直接、最可验证的事项，再决定是否扩大调整。",
        verification:
          "当前是否出现需要重新排序、沟通或调整处理方式的事情",
      },
  };
}

function fallbackDomainCopy({
  domainId,
  stage,
  lifeContext,
} = {}) {
  const older =
    Number(
      lifeContext?.age,
    ) >=
    70;

  const stageText =
    stage ===
      "month"
      ? "本月"
      : stage ===
          "year"
        ? "本年"
        : "此运";

  const longTerm =
    stage ===
    "luck";

  const shortTerm =
    stage ===
    "month";

  const copies = {
    relation_environment_change: {
      title:
        "关系与环境结构调整",
      judgment:
        `${stageText}关系、安排或互动方式更容易出现重新协调。`,
      story:
        older
          ? "更常见的现实落点，是家庭、亲友、固定团体或日常安排中的边界和分工需要重新确认。既可能有靠近和配合，也可能有牵制和反复；这不等于必然发生重大关系事件，重点在于如何减少无效消耗。"
          : longTerm
            ? "这更适合看作长期结构变化：关系、计划和生活环境可能在靠近、牵制与调整之间反复，最终促使你重新确定边界和优先级。它不直接等于感情成败或重大变动。"
            : "更常见的现实落点，是已有关系、合作安排或生活计划需要重新确认边界和处理方式。它不直接等于分离或重大变化，重点在于及时沟通和调整顺序。",
      possibilities: [
        "已有安排需要重新沟通、分工或排序。",
        older
          ? "家庭、亲友或固定团体中的责任边界需要再次确认。"
          : "重要关系或合作中的节奏需要重新磨合。",
        shortTerm
          ? "没有明显关系事件时，也可能只是本月计划和生活节奏发生小幅调整。"
          : "没有明显关系事件时，也可能表现为环境、计划或关注重点逐步变化。",
      ],
      advice: [
        "先确认各方真实需求和边界，再决定如何调整。",
        "对尚未明确的事项保留缓冲，不急于作不可逆决定。",
      ],
      lists: {
        opportunities:
          "重新梳理关系和安排，有助于减少长期反复。",
        risks:
          "靠近与牵制同时存在时，容易因猜测或反复沟通而消耗精力。",
        actions:
          "把责任、边界和下一步安排说清楚，再观察现实反馈。",
        verification:
          "关系、家庭或固定安排中是否出现需要重新确认边界和分工的事情",
      },
    },

    ability_output: {
      title:
        "能力输出与经验运用",
      judgment:
        `${stageText}更重视把兴趣、经验或技能转化为可观察的成果。`,
      story:
        older
          ? "现实中可以落在兴趣整理、经验分享、资料归纳、日常技能或帮助身边人解决问题上。重点不是一定从事某种职业或参加考试，而是把已有经验用得更顺、更有条理，并从反馈中判断哪些方向值得继续。"
          : longTerm
            ? "长期看，更愿意通过实践、表达和成果反馈验证能力，逐步形成自己的处理方式。具体可以落在学习、工作、兴趣或日常技能，但不能仅凭这一信号断定具体职业、考试或收入结果。"
            : "现实中更容易出现需要表达、整理、讲解或实际操作的事务。重点是通过反馈改进方法，而不是把某一种具体场景当成必然结果。",
      possibilities: [
        older
          ? "整理旧经验、兴趣或资料，形成更清楚的做法。"
          : "把已有想法转化为可以展示、验证或复盘的成果。",
        older
          ? "在家庭、亲友或熟人圈中提供经验和实际帮助。"
          : "尝试新的方法，并根据现实反馈决定是否继续。",
        "若仍有工作或学习事务，可能更愿意使用自己熟悉的方法完成。",
      ],
      advice: [
        "保留简单记录，比较哪些做法真正有效。",
        "先稳定一个方向，再决定是否增加新的尝试。",
      ],
      lists: {
        opportunities:
          "经验、兴趣和技能更容易通过实际运用得到反馈。",
        risks:
          "方向过多或只停留在想法层面，会削弱持续积累。",
        actions:
          "选择一个当前最有现实反馈的方向持续推进。",
        verification:
          "近期是否更愿意整理经验、分享方法或完成可观察的成果",
      },
    },

    resource_accumulation: {
      title:
        "资源安排与现实回报",
      judgment:
        `${stageText}对资源配置、日常投入和现实回报更为敏感。`,
      story:
        older
          ? "更稳妥的现实落点是既有资源、家庭安排、日常收支和物品使用方式需要更清楚。它不等于一定投资或增加收入，重点是减少浪费、安排优先级，并观察哪些投入真正改善生活。"
          : longTerm
            ? "长期看，资源意识会逐步增强，更关注投入是否产生持续回报。它可以涉及收入、时间、机会或家庭资源，但不能仅凭财星信号断定兼职、副业或具体金额。"
            : "现实中更容易注意到时间、金钱、机会或物品安排是否合理。回报需要持续经营，不能把条件性信号直接写成收入必然增加。",
      possibilities: [
        older
          ? "重新整理日常收支、物品使用或家庭资源安排。"
          : "开始更清楚地比较投入、成本和实际回报。",
        "某项已有资源可能需要重新分配或提高使用效率。",
        "若现实中存在收入或合作机会，仍需先确认条件和持续性。",
      ],
      advice: [
        "先梳理已有资源和固定支出，再考虑新增投入。",
        "涉及风险和金额的决定，以现实数据和专业意见为准。",
      ],
      lists: {
        opportunities:
          "更清楚地安排已有资源，有助于提高使用效率。",
        risks:
          "把条件性机会当成确定收益，容易造成不必要投入。",
        actions:
          "先核对已有资源、固定支出和真实需求。",
        verification:
          "近期是否更关注日常资源、收支或投入回报的安排",
      },
    },

    rules_responsibility: {
      title:
        "规则责任与现实要求",
      judgment:
        `${stageText}正式要求、责任边界或被评价感更容易进入关注范围。`,
      story:
        older
          ? "现实中更可能落在手续、约定、家庭责任、医疗生活安排或相关机构要求上。它不自动等于上级、考试或重大压力，重点是先看清要求，再决定哪些需要配合、哪些可以沟通调整。"
          : longTerm
            ? "长期看，个人做法需要不断与外部标准和责任要求协调。它可以落在工作、学习、合作或手续，但具体场景必须结合现实，不应自动推成上级、审核或考试。"
            : "现实中可能出现标准更明确、责任需要落实或结果需要被检验的事务。先理解规则，再保留合理表达空间，通常比直接对抗更有效。",
      possibilities: [
        "某项正式事务需要补充材料、明确责任或按标准处理。",
        older
          ? "家庭约定或相关机构要求需要更清楚地确认。"
          : "个人方式与外部标准之间需要重新协调。",
        "没有明显正式事务时，也可能只是对责任和边界的感受增强。",
      ],
      advice: [
        "先弄清实际要求和可调整范围，再安排下一步。",
        "重要约定尽量留下清楚记录，减少误解。",
      ],
      lists: {
        opportunities:
          "明确标准和责任，有助于减少反复与误解。",
        risks:
          "不理解要求就急于回应，容易增加返工或摩擦。",
        actions:
          "先确认规则、责任和可协商部分，再采取行动。",
        verification:
          "近期是否出现需要明确标准、责任或手续的事务",
      },
    },

    learning_support: {
      title:
        "经验复盘与支持结构",
      judgment:
        `${stageText}理解、复盘和借助既有经验的重要性上升。`,
      story:
        older
          ? "现实中可以表现为回顾经验、整理资料、学习兴趣内容，或更愿意听取可靠建议。它不等于一定获得学历或证书，重点是利用已有知识和支持，降低重复试错。"
          : "现实中更适合通过资料、经验、复盘和可靠支持提高判断质量。它不自动等于学历、老师或考试结果，重点在于吸收后能否转化为实际做法。",
      possibilities: [
        "重新整理过去经验，并形成更稳定的处理方法。",
        "从可靠资料、专业意见或熟悉的人那里获得帮助。",
        "某项兴趣或知识需要慢慢理解，而不是急于求成。",
      ],
      advice: [
        "优先选择来源清楚、可以验证的信息。",
        "把得到的建议转化成一两个可执行步骤。",
      ],
      lists: {
        opportunities:
          "复盘经验和借助可靠支持，可以减少重复试错。",
        risks:
          "信息过多但缺少筛选，反而容易犹豫。",
        actions:
          "先确认信息来源，再把建议转化为小步骤。",
        verification:
          "近期是否更需要整理经验、查找资料或听取可靠建议",
      },
    },

    peer_boundary: {
      title:
        "共同参与与边界分配",
      judgment:
        `${stageText}共同参与、分工和自主边界更容易成为现实议题。`,
      story:
        older
          ? "现实中可以落在亲友、邻里、固定团体或共同处理事务的人之间。它不自动等于竞争或破财，重点是把谁负责什么、资源如何使用、意见如何表达说清楚。"
          : "现实中更容易出现共同参与、协作分工或资源边界需要确认的情况。它不自动等于竞争或争夺，重点是减少含糊和重复投入。",
      possibilities: [
        older
          ? "亲友或共同参与者之间需要重新确认分工。"
          : "合作或共同事务中的分工和边界需要明确。",
        "某项资源、时间或责任安排需要重新协调。",
        "没有明显冲突时，也可能只是更重视自主空间。",
      ],
      advice: [
        "提前说清分工、责任和可接受的边界。",
        "出现分歧时先回到具体事项，不扩大到人身评价。",
      ],
      lists: {
        opportunities:
          "分工和边界更清楚后，共同事务更容易推进。",
        risks:
          "责任含糊或重复投入，容易造成不满和消耗。",
        actions:
          "把共同事务的分工和边界提前说明。",
        verification:
          "共同事务中是否出现需要重新确认分工或自主边界的情况",
      },
    },
  };

  return copies[
    domainId
  ] || null;
}

function buildDomainFallbackLists({
  domainId,
  stage,
  lifeContext,
} = {}) {
  return fallbackDomainCopy({
    domainId,
    stage,
    lifeContext,
  })?.lists || {
    opportunities:
      "现实反馈有助于判断哪些方向值得继续。",
    risks:
      "条件尚未明确时，过早下结论容易造成误判。",
    actions:
      "先确认事实，再做可逆调整。",
    verification:
      "当前是否出现可以直接验证的现实变化",
  };
}

function compileAnchoredTopLevelList({
  items,
  kind,
  themes,
  limit,
  lifeContext,
  stage,
} = {}) {
  const safeItems =
    unique(
      array(
        items,
      )
        .map(
          (item) =>
            cleanupDisplayText(
              sanitizeRenderedText({
                value:
                  compactParagraph(
                    item,
                    kind ===
                      "verification"
                      ? 180
                      : 150,
                  ),
                evidenceTexts:
                  unique(
                    themes.flatMap(
                      (theme) =>
                        theme.evidenceTexts,
                    ),
                  ),
                lifeContext,
                stage,
              }),
            ),
        )
        .filter(Boolean)
        .filter(
          (item) =>
            topLevelItemIsAnchored({
              item,
              themes,
            }),
        ),
    );

  const fallbackItems =
    unique(
      themes
        .map(
          (theme) =>
            text(
              theme
                ?.fallbackLists
                ?.[
                  kind
                ],
            ),
        )
        .filter(Boolean),
    );

  return listItems(
    [
      ...safeItems,
      ...fallbackItems,
    ],
    limit,
    kind ===
      "verification"
      ? 180
      : 150,
  );
}

function topLevelItemIsAnchored({
  item,
  themes,
} = {}) {
  const technical =
    TECHNICAL_PATTERN.test(
      item,
    ) ||
    /大运|流年|流月|年柱|月柱|日柱|时柱|夫妻宫|配偶宫|子女宫/.test(
      item,
    );

  const itemDomains =
    inferTextDomainsForDisplay(
      item,
    );

  if (
    !technical
  ) {
    if (
      itemDomains.length ===
      0
    ) {
      return true;
    }

    return themes.some(
      (theme) =>
        itemDomains.includes(
          theme.domainId,
        ),
    );
  }

  return themes.some(
    (theme) => {
      const technicalErrors = [
        ...validateTechnicalClaims({
          authoredText:
            item,
          evidenceTexts:
            theme.evidenceTexts,
        }),
        ...validateTechnicalTokenCoverage({
          authoredText:
            item,
          evidenceTexts:
            theme.evidenceTexts,
        }),
        ...validateBranchRelationTokenCoverage({
          authoredText:
            item,
          evidenceTexts:
            theme.evidenceTexts,
        }),
        ...validateNegativeTechnicalClaims({
          authoredText:
            item,
          evidenceTexts:
            theme.evidenceTexts,
        }),
      ];

      if (
        technicalErrors.length >
        0
      ) {
        return false;
      }

      if (
        itemDomains.length >
        0 &&
        !itemDomains.includes(
          theme.domainId,
        )
      ) {
        return false;
      }

      const tokens =
        technicalTokensForDisplay(
          item,
        );

      return tokens.every(
        (token) =>
          theme.authoredText.includes(
            token,
          ),
      );
    },
  );
}

function technicalTokensForDisplay(
  value,
) {
  const matches =
    text(
      value,
    ).match(
      /食神|伤官|正官|七杀|正印|偏印|正财|偏财|比肩|劫财|伏吟|反吟|三合|三会|六合|暗合|半合|相冲|冲|相刑|刑|相害|害|相破|破|夫妻宫|配偶宫|子女宫|年柱|月柱|日柱|时柱|大运|流年|流月/g,
    ) ||
    [];

  return unique(
    matches,
  );
}

function inferTextDomainsForDisplay(
  value,
) {
  const textValue =
    text(
      value,
    );

  const domains = [];

  if (
    /食神|伤官|表达|输出|技能|经验|兴趣|成果/.test(
      textValue,
    )
  ) {
    domains.push(
      "ability_output",
    );
  }

  if (
    /正财|偏财|资源|收入|收支|回报|投入/.test(
      textValue,
    )
  ) {
    domains.push(
      "resource_accumulation",
    );
  }

  if (
    /正官|七杀|规则|责任|标准|手续|要求/.test(
      textValue,
    )
  ) {
    domains.push(
      "rules_responsibility",
    );
  }

  if (
    /正印|偏印|学习|资料|复盘|支持/.test(
      textValue,
    )
  ) {
    domains.push(
      "learning_support",
    );
  }

  if (
    /比肩|劫财|同辈|分工|边界|共同参与/.test(
      textValue,
    )
  ) {
    domains.push(
      "peer_boundary",
    );
  }

  if (
    /天干五合|地支六合|三合|三会|冲|刑|害|破|同支重复|伏吟|关系|环境结构/.test(
      textValue,
    )
  ) {
    domains.push(
      "relation_environment_change",
    );
  }

  return unique(
    domains,
  );
}

function inferDisplayDomainId({
  preferred,
  evidenceFacts,
} = {}) {
  const preferredValue =
    text(
      preferred,
    );

  if (
    preferredValue &&
    evidenceFacts.some(
      (fact) =>
        array(
          fact
            ?.meta
            ?.domains,
        ).includes(
          preferredValue,
        ),
    )
  ) {
    return preferredValue;
  }

  const counts =
    new Map();

  evidenceFacts.forEach(
    (fact) => {
      array(
        fact
          ?.meta
          ?.domains,
      ).forEach(
        (domainId) => {
          counts.set(
            domainId,
            (
              counts.get(
                domainId,
              ) ||
              0
            ) +
            1,
          );
        },
      );
    },
  );

  return [
    ...counts.entries(),
  ]
    .sort(
      (left, right) =>
        right[1] -
        left[1],
    )
    ?.[0]
    ?.[0] ||
    "";
}

function currentStageLabel(
  stage,
) {
  return stage ===
    "month"
    ? "流月"
    : stage ===
        "year"
      ? "流年"
      : "大运";
}

function isCurrentStageFact(
  fact,
  stage,
) {
  if (
    fact
      ?.meta
      ?.temporalRole ===
    "current"
  ) {
    return true;
  }

  const label =
    currentStageLabel(
      stage,
    );

  return text(
    fact?.text,
  ).includes(
    label,
  );
}

function hasCurrentStageEvidence(
  verifiedFacts,
  stage,
) {
  return array(
    verifiedFacts,
  ).some(
    (fact) =>
      fact?.evidenceEligible !==
        false &&
      isCurrentStageFact(
        fact,
        stage,
      ),
  );
}

function validateCurrentStageEvidence({
  evidenceFacts,
  stage,
  minimumRatio = 0,
} = {}) {
  if (
    stage ===
    "luck"
  ) {
    return [];
  }

  const facts =
    array(
      evidenceFacts,
    );

  const currentFacts =
    facts.filter(
      (fact) =>
        isCurrentStageFact(
          fact,
          stage,
        ),
    );

  const errors = [];

  if (
    currentFacts.length ===
    0
  ) {
    errors.push(
      "missing_current_stage_evidence",
    );

    return errors;
  }

  const ratio =
    currentFacts.length /
    Math.max(
      1,
      facts.length,
    );

  if (
    Number(
      minimumRatio,
    ) >
      0 &&
    ratio <
      Number(
        minimumRatio,
      )
  ) {
    errors.push(
      `current_stage_evidence_ratio_low:${ratio.toFixed(2)}`,
    );
  }

  return errors;
}

function prioritizeCurrentFacts(
  facts,
  stage,
) {
  const current =
    uniqueFacts(
      array(
        facts,
      ).filter(
        (fact) =>
          isCurrentStageFact(
            fact,
            stage,
          ),
      ),
    );

  const background =
    uniqueFacts(
      array(
        facts,
      ).filter(
        (fact) =>
          !isCurrentStageFact(
            fact,
            stage,
          ),
      ),
    );

  return [
    ...current,
    ...background.slice(
      0,
      Math.max(
        1,
        current.length,
      ),
    ),
  ];
}

function countCurrentEligibleDomains({
  verifiedFacts,
  stage,
} = {}) {
  if (
    stage ===
    "luck"
  ) {
    return new Set(
      array(
        verifiedFacts,
      )
        .filter(
          (fact) =>
            fact?.evidenceEligible !==
            false,
        )
        .flatMap(
          (fact) =>
            array(
              fact
                ?.meta
                ?.domains,
            ),
        )
        .filter(Boolean),
    ).size;
  }

  return new Set(
    array(
      verifiedFacts,
    )
      .filter(
        (fact) =>
          fact?.evidenceEligible !==
            false &&
          isCurrentStageFact(
            fact,
            stage,
          ),
      )
      .flatMap(
        (fact) =>
          array(
            fact
              ?.meta
              ?.domains,
          ),
      )
      .filter(Boolean),
  ).size;
}

function compileStageSecondaryOverview({
  stage,
  verifiedFacts,
  themes,
} = {}) {
  const usedDomains =
    new Set(
      array(
        themes,
      )
        .map(
          (theme) =>
            theme?.domainId,
        )
        .filter(Boolean),
    );

  const buckets =
    new Map();

  array(
    verifiedFacts,
  )
    .filter(
      (fact) =>
        fact?.evidenceEligible !==
          false &&
        (
          stage ===
            "luck" ||
          isCurrentStageFact(
            fact,
            stage,
          )
        ),
    )
    .forEach(
      (fact) => {
        array(
          fact
            ?.meta
            ?.domains,
        ).forEach(
          (domainId) => {
            if (
              !domainId ||
              usedDomains.has(
                domainId,
              )
            ) {
              return;
            }

            if (
              !buckets.has(
                domainId,
              )
            ) {
              buckets.set(
                domainId,
                [],
              );
            }

            buckets
              .get(
                domainId,
              )
              .push(
                fact,
              );
          },
        );
      },
    );

  const limit =
    stage ===
      "luck"
      ? 4
      : stage ===
          "year"
        ? 2
        : 1;

  return [
    ...buckets.entries(),
  ]
    .map(
      (
        [
          domainId,
          facts,
        ],
      ) => ({
        domainId,
        facts:
          uniqueFacts(
            facts,
          ),
        score:
          displayDomainScore({
            domainId,
            facts,
            stage,
          }),
      }),
    )
    .sort(
      (left, right) =>
        right.score -
        left.score,
    )
    .slice(
      0,
      limit,
    )
    .map(
      (item) => {
        const copy =
          fallbackDomainCopy({
            domainId:
              item.domainId,
            stage,
            lifeContext:
              extractLifeContext(
                verifiedFacts,
              ),
          });

        const title =
          copy?.title ||
          item.domainId;

        if (
          stage ===
          "luck"
        ) {
          return `${title}：有一定长期线索，但证据强度低于上述突出领域，作为十年辅助方向观察。`;
        }

        if (
          stage ===
          "year"
        ) {
          return `${title}：本年存在条件性信号，但汇合程度不足，不作为主要显像。`;
        }

        return `${title}：本月只有单一或较弱触发，暂不展开成独立事件。`;
      },
    );
}

function secondaryOverviewHeading(
  stage,
) {
  return stage ===
    "luck"
    ? "十年其他领域概览"
    : stage ===
        "year"
      ? "本年次级可能"
      : "本月次级提醒";
}

function displayDomainScore({
  domainId,
  facts,
  stage,
} = {}) {
  const stageOrder = {
    luck: [
      "relation_environment_change",
      "ability_output",
      "resource_accumulation",
      "rules_responsibility",
      "learning_support",
      "peer_boundary",
    ],
    year: [
      "relation_environment_change",
      "rules_responsibility",
      "ability_output",
      "resource_accumulation",
      "peer_boundary",
      "learning_support",
    ],
    month: [
      "relation_environment_change",
      "rules_responsibility",
      "peer_boundary",
      "ability_output",
      "resource_accumulation",
      "learning_support",
    ],
  };

  const order =
    stageOrder[
      stage
    ] ||
    stageOrder.year;

  const orderIndex =
    order.indexOf(
      domainId,
    );

  const activeLabel =
    stage ===
      "month"
      ? "流月"
      : stage ===
          "year"
        ? "流年"
        : "大运";

  const activeCount =
    array(
      facts,
    ).filter(
      (fact) =>
        text(
          fact?.text,
        ).includes(
          activeLabel,
        ),
    ).length;

  return (
    activeCount *
      160 +
    uniqueFacts(
      facts,
    ).length *
      (
        stage ===
          "luck"
          ? 100
          : 30
      ) +
    (
      orderIndex >=
        0
        ? order.length -
          orderIndex
        : 0
    )
  );
}

function uniqueFacts(
  facts,
) {
  const seen =
    new Set();

  return array(
    facts,
  ).filter(
    (fact) => {
      const key =
        text(
          fact?.sourceRef,
        ) ||
        text(
          fact?.id,
        ) ||
        text(
          fact?.text,
        );

      if (
        !key ||
        seen.has(
          key,
        )
      ) {
        return false;
      }

      seen.add(
        key,
      );

      return true;
    },
  );
}

function buildFallbackSummary({
  themes,
  stage,
} = {}) {
  const titles =
    unique(
      array(
        themes,
      )
        .map(
          (theme) =>
            theme.title,
        )
        .filter(Boolean),
    )
      .slice(
        0,
        3,
      );

  const joined =
    titles.join(
      "、",
    ) ||
    "现实安排与处理方式";

  if (
    stage ===
    "month"
  ) {
    if (
      array(
        themes,
      ).length ===
      0
    ) {
      return "本月未见足以单独展开的新增强信号，主要延续流年已有安排。适合处理细节、维持节奏，并根据现实反馈做小幅调整。";
    }

    return `本月重点集中在${joined}。先处理最直接、最可验证的事情，再根据反馈调整，不把短期信号扩大成长期结论。`;
  }

  if (
    stage ===
    "luck"
  ) {
    return `此运的长期重点集中在${joined}。这些主题会通过不同现实事务逐步显现，宜先看持续出现的模式，再判断具体落点。`;
  }

  return `本年的主要焦点集中在${joined}。具体表现取决于现实基础，宜先确认已经发生的变化，再调整关系、计划和执行方式。`;
}

function cleanupDisplayText(
  value,
) {
  return text(
    value,
  )
    .replace(
      /大此运/g,
      "此运",
    )
    .replace(
      /大此运/g,
      "此运",
    )
    .replace(
      /本月流月/g,
      "本月",
    )
    .replace(
      /本本月/g,
      "本月",
    )
    .replace(
      /此此运/g,
      "此运",
    )
    .replace(
      /^(?:同时|此外|另外|并且|而且|不过|但是|但)[，、：\s]*/,
      "",
    )
    .replace(
      /([。！？；])(?:同时|此外|另外|并且|而且)[，、：\s]*(?=$)/g,
      "$1",
    )
    .replace(
      /[；，、：\s]+$/g,
      "",
    )
    .replace(
      /\s{2,}/g,
      " ",
    )
    .trim();
}

function cleanupFinalRenderedReport(
  value,
) {
  return text(
    value,
  )
    .replace(
      /\n{3,}/g,
      "\n\n",
    )
    .replace(
      /### (?:十年主要结构|十年突出领域|年度重点|本年主要显像|本月触发|本月主要触发)\n(?=### )/g,
      "",
    )
    .replace(
      /[。！；]+？/g,
      "？",
    )
    .replace(
      /？？+/g,
      "？",
    )
    .replace(
      /大此运/g,
      "此运",
    )
    .replace(
      /本月流月/g,
      "本月",
    )
    .replace(
      /本本月/g,
      "本月",
    )
    .trim();
}


export function buildStageStructuredRepairPrompt(
  prompt,
  validation,
) {
  const problems =
    array(
      validation?.errors,
    )
      .slice(
        0,
        8,
      )
      .map(
        translateValidationError,
      )
      .join("；");

  return {
    ...prompt,

    system:
      `${prompt?.system || ""}\n\n` +
      "上一版未满足结构要求。请重新生成完整JSON，不要解释错误原因。" +
      `${problems ? `需要修正：${problems}。` : ""}`,

    user:
      prompt?.user,
  };
}

function normalizeReport(
  value,
  stage,
) {
  const source =
    value?.报告 &&
    typeof value
      .报告 ===
      "object"
      ? value.报告
      : value;

  const themesSource =
    source?.主题 ||
    source?.主要主题 ||
    source?.themes ||
    [];

  const normalizedReport = {
    stage,

    summary:
      sanitizeAuthorText(
        source?.总断 ||
        source?.summary ||
        source?.结论,
        stage,
      ),

    themes:
      array(
        themesSource,
      ).map(
        (theme) =>
          normalizeTheme(
            theme,
            stage,
          ),
      ),

    opportunities:
      normalizeStringArray(
        source?.有利 ||
        source?.机会 ||
        source?.opportunities,
      ).map(
        (item) =>
          sanitizeAuthorText(
            item,
            stage,
          ),
      ),

    risks:
      normalizeStringArray(
        source?.风险 ||
        source?.risks,
      ).map(
        (item) =>
          sanitizeAuthorText(
            item,
            stage,
          ),
      ),

    actions:
      normalizeStringArray(
        source?.行动建议 ||
        source?.建议 ||
        source?.actions,
      ).map(
        (item) =>
          sanitizeAuthorText(
            item,
            stage,
          ),
      ),

    verification:
      normalizeStringArray(
        source?.现实验证 ||
        source?.验证问题 ||
        source?.verification,
      ).map(
        (item) =>
          sanitizeAuthorText(
            item,
            stage,
          ),
      ),
  };

  return ensureMinimumThemeCoverage(
    normalizedReport,
    stage,
  );
}

function normalizeTheme(
  source,
  stage,
) {
  return {
    domainId:
      text(
        source?.领域编号 ||
        source?.domainId ||
        source?.domain,
      ),

    title:
      sanitizeAuthorText(
        source?.标题 ||
        source?.主题 ||
        source?.title ||
        source?.name,
        stage,
      ),

    importance:
      normalizeImportance(
        source?.重要度 ||
        source?.等级 ||
        source?.importance,
      ),

    judgment:
      sanitizeAuthorText(
        source?.判断 ||
        source?.核心判断 ||
        source?.judgment,
        stage,
      ),

    story:
      sanitizeAuthorText(
        source?.现实剧本 ||
        source?.最可能的剧本 ||
        source?.剧本 ||
        source?.story,
        stage,
      ),

    possibilities:
      normalizeStringArray(
        source?.可能表现 ||
        source?.现实可能 ||
        source?.possibleManifestations ||
        source?.possibilities,
      ).map(
        (item) =>
          sanitizeAuthorText(
            item,
            stage,
          ),
      ),

    alternative:
      sanitizeAuthorText(
        source?.补充可能 ||
        source?.另一种可能 ||
        source?.alternative,
        stage,
      ),

    evidenceIds:
      normalizeStringArray(
        source?.依据编号 ||
        source?.证据编号 ||
        source?.evidenceIds,
      ),

    advice:
      normalizeStringArray(
        source?.应对 ||
        source?.应对建议 ||
        source?.建议 ||
        source?.advice,
      ).map(
        (item) =>
          sanitizeAuthorText(
            item,
            stage,
          ),
      ),
  };
}

function parseJsonObject(
  rawText,
) {
  const raw =
    String(
      rawText || "",
    )
      .trim()
      .replace(
        /^```(?:json)?\s*/i,
        "",
      )
      .replace(
        /\s*```$/,
        "",
      )
      .trim();

  const candidates = [
    raw,
    extractBalancedObject(
      raw,
    ),
  ]
    .filter(Boolean);

  for (
    const candidate of
    candidates
  ) {
    try {
      return {
        value:
          JSON.parse(
            candidate,
          ),
        error:
          "",
      };
    } catch {
      // Continue with the next candidate.
    }
  }

  return {
    value:
      null,
    error:
      "JSON解析失败",
  };
}

function extractBalancedObject(
  textValue,
) {
  const start =
    textValue.indexOf(
      "{",
    );

  if (
    start <
    0
  ) {
    return "";
  }

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (
    let index = start;
    index <
    textValue.length;
    index += 1
  ) {
    const char =
      textValue[
        index
      ];

    if (
      escaped
    ) {
      escaped = false;
      continue;
    }

    if (
      char ===
      "\\"
    ) {
      escaped = true;
      continue;
    }

    if (
      char ===
      '"'
    ) {
      inString =
        !inString;
      continue;
    }

    if (
      inString
    ) {
      continue;
    }

    if (
      char ===
      "{"
    ) {
      depth += 1;
    } else if (
      char ===
      "}"
    ) {
      depth -= 1;

      if (
        depth ===
        0
      ) {
        return textValue.slice(
          start,
          index + 1,
        );
      }
    }
  }

  return "";
}

function repeatedLineCount(
  report,
) {
  const values = [
    report?.summary,
    ...array(
      report?.themes,
    ).flatMap(
      (theme) => [
        theme?.judgment,
        theme?.story,
        theme?.alternative,
        ...array(
          theme?.possibilities,
        ),
        ...array(
          theme?.advice,
        ),
      ],
    ),
    ...array(
      report?.opportunities,
    ),
    ...array(
      report?.risks,
    ),
    ...array(
      report?.actions,
    ),
  ]
    .map(
      (value) =>
        normalizeForCompare(
          value,
        ),
    )
    .filter(
      (value) =>
        value.length >
        18,
    );

  const seen =
    new Set();

  let repeated = 0;

  values.forEach(
    (value) => {
      if (
        seen.has(
          value,
        )
      ) {
        repeated += 1;
      } else {
        seen.add(
          value,
        );
      }
    },
  );

  return repeated;
}

function translateValidationError(
  error,
) {
  const value =
    String(
      error || "",
    );

  if (
    value.startsWith(
      "parse_error",
    )
  ) {
    return "必须只返回可解析的JSON";
  }

  if (
    value.includes(
      "unknown_evidence",
    )
  ) {
    return "只能引用资料中存在的事实编号";
  }

  if (
    value.includes(
      "contains_technical_recalculation",
    )
  ) {
    return "故事和建议中不得重新书写天干地支、十神、生克冲合等命理判断";
  }

  if (
    value.includes(
      "evidence_id_leaked_into_prose",
    )
  ) {
    return "事实编号只能放在依据编号数组中，正文里不要写依据Fxx";
  }

  if (
    value.includes(
      "over_specific_scene_enumeration",
    )
  ) {
    return "一个主题不要同时枚举多种职业、考试、恋爱或手续场景，应收束成一个中性主剧本";
  }

  if (
    value.includes(
      "same_branch_overinterpreted",
    )
  ) {
    return "同支重复只能解释为相似议题或处理模式再次被触发，不能直接写成旧项目、旧人或旧机会回归";
  }

  if (
    value.includes(
      "unsupported_hidden_tengod",
    )
  ) {
    return "不得把某层地支藏干写成事实中不存在的十神组合，例如亥中没有官印就不能写大运地支藏官印";
  }

  if (
    value.includes(
      "unsupported_dark_combine",
    )
  ) {
    return "只有确定事实明确存在暗合时才能使用暗合，不能把六合、藏财或其他关系改写成暗合财星";
  }

  if (
    value.includes(
      "unsupported_fuyin_claim",
    )
  ) {
    return "只有所引事实明确写明整柱相同或可称伏吟时，正文才能使用伏吟";
  }

  if (
    value.includes(
      "unsupported_food_controls_killing",
    )
  ) {
    return "写食神制杀必须同时引用食神、七杀及明确生克关系三类事实";
  }

  if (
    value.includes(
      "unsupported_pattern_upgrade",
    )
  ) {
    return "不得把一般作用关系升级为格局或成格，除非事实中已明确给出";
  }

  if (
    value.includes(
      "unsupported_strength_upgrade",
    )
  ) {
    return "不得自行判断制杀、合化、成局等力量强劲或彻底";
  }

  if (
    value.includes(
      "unsupported_layer_reference",
    )
  ) {
    return "正文提到年柱、月柱、日柱、时柱或配偶宫时，所引事实必须明确包含对应层级";
  }

  if (
    value.includes(
      "unsupported_direct_relation",
    )
  ) {
    return "正文写具体天干生克冲合时，所引事实必须包含相同双方和作用方向";
  }

  if (
    value.includes(
      "life_stage_scene_mismatch",
    )
  ) {
    return "现实剧本必须符合当前年龄和人生阶段；工作、考试、晋升等只可作为有现实条件时的简短分支";
  }

  if (
    value.includes(
      "unbound_tengod"
    ) ||
    value.includes(
      "unbound_layer_tengod"
    )
  ) {
    return "正文出现的每个十神及其所属层级，都必须出现在本主题自己的依据编号中";
  }

  if (
    value.includes(
      "unbound_tengod_relation",
    )
  ) {
    return "写食神制官、食神生财等十神关系时，必须同时引用双方十神事实和明确关系事实";
  }

  if (
    value.includes(
      "missing_current_stage_evidence",
    )
  ) {
    return "流年或流月主题必须引用本层新增事实，不能只重复大运和原局背景";
  }

  if (
    value.includes(
      "current_stage_evidence_ratio_low",
    )
  ) {
    return "本层新增事实占比过低，需要减少上层背景依据，突出当前流年或流月";
  }

  if (
    value.includes(
      "unbound_branch_relation",
    )
  ) {
    return "正文写六合、三合、三会、冲刑害破或同支重复时，本主题自己的依据必须包含同一种关系事实";
  }

  if (
    value.includes(
      "unsupported_negative_relation"
    ) ||
    value.includes(
      "unsupported_negative_opportunity"
    ) ||
    value.includes(
      "unsupported_trigger_requirement"
    )
  ) {
    return "不得自行判断没有冲合、机会偏弱或必须等待引动；没有明确否定事实时改写为当前依据不足";
  }

  if (
    value.includes(
      "missing_domain_id"
    ) ||
    value.includes(
      "unknown_domain_id"
    ) ||
    value.includes(
      "domain_without_evidence"
    )
  ) {
    return "每个主题必须选择资料中的领域编号，并至少引用一条属于该领域的事实";
  }

  if (
    value.includes(
      "unsupported_tengod_strength",
    )
  ) {
    return "不得自行把十神写成过旺、偏旺或过弱，除非确定事实已经给出强弱判断";
  }

  if (
    value.includes(
      "missing_evidence",
    )
  ) {
    return "每个主题必须引用至少一个事实编号";
  }

  if (
    value.includes(
      "insufficient_themes",
    )
  ) {
    return "需要保留两个彼此不同的主要主题";
  }

  return "补全缺失字段并减少重复";
}

function sanitizeAuthorText(
  value,
  stage,
) {
  let output =
    text(
      value,
    );

  output =
    output
      .replace(
        /[（(]?(?:依据|证据)\s*F\d{2}(?:\s*[、,，]\s*F\d{2})*[）)]?/gi,
        "",
      )
      .replace(
        /\bF\d{2}\b/gi,
        "",
      )
      .replace(
        /参加培训、尝试写作或设计类工作/g,
        "学习新方法并形成可展示的成果",
      )
      .replace(
        /公开演讲、作品展示或项目汇报/g,
        "成果展示与公开表达",
      )
      .replace(
        /写作、设计、演讲(?:等)?/g,
        "内容表达与成果展示",
      )
      .replace(
        /恋爱、订约或与权威的互动/g,
        "重要关系或正式合作",
      )
      .replace(
        /上司、父母等权威人物/g,
        "对你有明确要求的重要人物",
      )
      .replace(
        /考试、申请、审核/g,
        "需要遵循明确标准的事务",
      )
      .replace(
        /考试、报名或审批/g,
        "需要按标准办理的事务",
      )
      .replace(
        /项目名额、晋升机会、奖项/g,
        "资源、机会或评价结果",
      )
      .replace(
        /复考机会、房源或设备采购/g,
        "与过去相似的事务",
      )
      .replace(
        /法律或税务事务/g,
        "专业手续",
      )
      .replace(
        /法务、税务/g,
        "专业渠道",
      )
      .replace(
        /每三个月/g,
        "分阶段",
      )
      .replace(
        /过去三年内|近三年内|过去几年内/g,
        "近期",
      )
      .replace(
        /每周(?:花)?\s*\d+\s*分钟/g,
        "定期",
      )
      .replace(
        /先观察一周/g,
        "先留出观察时间",
      )
      .replace(
        /提前(?:至少)?\s*两周/g,
        "提前留出充足时间",
      )
      .replace(
        /每季度末/g,
        "定期",
      )
      .replace(
        /每日或每周固定的小时段|每天或每周固定的小时段/g,
        "固定留出一段时间",
      )
      .replace(
        /每日或每周|每天或每周/g,
        "定期",
      )
      .replace(
        /近一两年|近两年|最近一两年/g,
        "近期",
      )
      .replace(
        /隔天再回应|第二天再回应/g,
        "情绪平稳后再回应",
      )
      .replace(
        /本周/g,
        stage ===
          "month"
          ? "本月"
          : "当前阶段",
      )
      .replace(
        /[ \t]{2,}/g,
        " ",
      )
      .replace(
        /，{2,}/g,
        "，",
      )
      .replace(
        /（\s*）|\(\s*\)/g,
        "",
      )
      .trim();

  if (
    stage ===
    "year"
  ) {
    output =
      output
        .replace(
          /年初|年中|年末|年底|上半年|下半年|第一季度|第二季度|第三季度|第四季度|每季度末/g,
          "本年过程中",
        )
        .replace(
          /本年过程中本年过程中/g,
          "本年过程中",
        );
  }

  if (
    stage ===
    "month"
  ) {
    output =
      output
        .replace(
          /月初|月中|月末|月底|上旬|中旬|下旬/g,
          "本月过程中",
        )
        .replace(
          /本月过程中本月过程中/g,
          "本月过程中",
        );
  }

  if (
    stage ===
    "luck"
  ) {
    output =
      output
        .replace(
          /大运前期|大运中期|大运后期|运初|运中|运末|前半段|后半段/g,
          "此运过程中",
        )
        .replace(
          /此运过程中此运过程中/g,
          "此运过程中",
        );
  }

  output =
    output
      .replace(
        /大此运/g,
        "此运",
      )
      .replace(
        /本本月/g,
        "本月",
      )
      .replace(
        /此此运/g,
        "此运",
      )
      .replace(
        /本月过程中本月过程中/g,
        "本月过程中",
      )
      .replace(
        /本年过程中本年过程中/g,
        "本年过程中",
      )
      .replace(
        /[。！；]+？/g,
        "？",
      )
      .replace(
        /？？+/g,
        "？",
      );

  return output
    .replace(
      /\s+([，。；：！？])/g,
      "$1",
    )
    .replace(
      /([，。；：！？])\s+/g,
      "$1",
    )
    .trim();
}

function validateLayerHiddenTenGodClaims({
  authoredText,
  evidenceTexts,
} = {}) {
  const errors = [];

  const layerNames = [
    "大运",
    "流年",
    "流月",
  ];

  const tenGodNames = [
    "食神",
    "伤官",
    "正官",
    "七杀",
    "正印",
    "偏印",
    "正财",
    "偏财",
    "比肩",
    "劫财",
  ];

  layerNames.forEach(
    (layerName) => {
      const layerHiddenFacts =
        array(
          evidenceTexts,
        ).filter(
          (value) =>
            value.includes(
              `${layerName}地支`,
            ) &&
            /藏干为|藏有/.test(
              value,
            ),
        );

      if (
        layerHiddenFacts.length ===
          0
      ) {
        return;
      }

      splitSentences(
        authoredText,
      )
        .filter(
          (sentence) =>
            sentence.includes(
              layerName,
            ) &&
            /地支|藏支|藏干|暗藏/.test(
              sentence,
            ),
        )
        .forEach(
          (sentence) => {
            const claimed =
              tenGodNames.filter(
                (name) =>
                  sentence.includes(
                    name,
                  ),
              );

            claimed.forEach(
              (name) => {
                const supported =
                  layerHiddenFacts.some(
                    (fact) =>
                      fact.includes(
                        name,
                      ),
                  );

                if (
                  !supported
                ) {
                  errors.push(
                    `unsupported_hidden_tengod:${layerName}:${name}`,
                  );
                }
              },
            );

            if (
              /官印/.test(
                sentence,
              ) &&
              !layerHiddenFacts.some(
                (fact) =>
                  /正官|七杀/.test(
                    fact,
                  ) &&
                  /正印|偏印/.test(
                    fact,
                  ),
              )
            ) {
              errors.push(
                `unsupported_hidden_tengod:${layerName}:官印`,
              );
            }
          },
        );
    },
  );

  return unique(
    errors,
  );
}

function validateInterpretiveOverreach(
  value,
) {
  const warnings = [];
  const textValue =
    text(
      value,
    );

  if (
    /正官[^。；]{0,12}贵人/.test(
      textValue,
    )
  ) {
    warnings.push(
      "stereotype_official_as_benefactor",
    );
  }

  if (
    /保护公平竞争|公平竞争|结果倾向于公平/.test(
      textValue,
    )
  ) {
    warnings.push(
      "unsupported_fairness_conclusion",
    );
  }

  if (
    /食神[^。；]{0,12}内在思考|食神为内在思考/.test(
      textValue,
    )
  ) {
    warnings.push(
      "misframed_food_god_as_inner_thought",
    );
  }

  if (
    /食神好逸/.test(
      textValue,
    )
  ) {
    warnings.push(
      "stereotype_food_god_as_laziness",
    );
  }

  return warnings;
}

function validateTechnicalTokenCoverage({
  authoredText,
  evidenceTexts,
} = {}) {
  const errors = [];

  const textValue =
    text(
      authoredText,
    );

  const facts =
    array(
      evidenceTexts,
    );

  const tenGodNames = [
    "食神",
    "伤官",
    "正官",
    "七杀",
    "正印",
    "偏印",
    "正财",
    "偏财",
    "比肩",
    "劫财",
  ];

  tenGodNames.forEach(
    (tenGod) => {
      if (
        textValue.includes(
          tenGod,
        ) &&
        !facts.some(
          (fact) =>
            fact.includes(
              tenGod,
            ),
        )
      ) {
        errors.push(
          `unbound_tengod:${tenGod}`,
        );
      }
    },
  );

  const layerTenGodMatches =
    [
      ...textValue.matchAll(
        /(大运|流年|流月)[^。；，]{0,18}(食神|伤官|正官|七杀|正印|偏印|正财|偏财|比肩|劫财)/g,
      ),
    ];

  layerTenGodMatches.forEach(
    (match) => {
      const layer =
        match[1];

      const tenGod =
        match[2];

      const supported =
        facts.some(
          (fact) =>
            fact.includes(
              layer,
            ) &&
            fact.includes(
              tenGod,
            ),
        );

      if (
        !supported
      ) {
        errors.push(
          `unbound_layer_tengod:${layer}:${tenGod}`,
        );
      }
    },
  );

  const relationMatches =
    [
      ...textValue.matchAll(
        /(食神|伤官|正官|七杀|正印|偏印|正财|偏财|比肩|劫财|官|财)(?:与|对)?(克|制|生|合)(食神|伤官|正官|七杀|正印|偏印|正财|偏财|比肩|劫财|官|财)/g,
      ),
    ];

  relationMatches.forEach(
    (match) => {
      const left =
        match[1];

      const operator =
        match[2];

      const right =
        match[3];

      const leftSupported =
        tenGodAliasSupported(
          left,
          facts,
        );

      const rightSupported =
        tenGodAliasSupported(
          right,
          facts,
        );

      const leftStems =
        stemsForTenGodAlias(
          left,
          facts,
        );

      const rightStems =
        stemsForTenGodAlias(
          right,
          facts,
        );

      const relationSupported =
        facts.some(
          (fact) => {
            const hasBothStems =
              leftStems.some(
                (stem) =>
                  fact.includes(
                    stem,
                  ),
              ) &&
              rightStems.some(
                (stem) =>
                  fact.includes(
                    stem,
                  ),
              );

            if (
              !hasBothStems
            ) {
              return false;
            }

            if (
              operator ===
                "克" ||
              operator ===
                "制"
            ) {
              return /确定生克关系|克/.test(
                fact,
              );
            }

            if (
              operator ===
                "合"
            ) {
              return /合/.test(
                fact,
              );
            }

            return /生/.test(
              fact,
            );
          },
        );

      if (
        !(
          leftSupported &&
          rightSupported &&
          leftStems.length >
            0 &&
          rightStems.length >
            0 &&
          relationSupported
        )
      ) {
        errors.push(
          `unbound_tengod_relation:${left}${operator}${right}`,
        );
      }
    },
  );

  return unique(
    errors,
  );
}

function tenGodAliasSupported(
  value,
  evidenceTexts,
) {
  if (
    value ===
    "官"
  ) {
    return array(
      evidenceTexts,
    ).some(
      (fact) =>
        /正官|七杀/.test(
          fact,
        ),
    );
  }

  if (
    value ===
    "财"
  ) {
    return array(
      evidenceTexts,
    ).some(
      (fact) =>
        /正财|偏财/.test(
          fact,
        ),
    );
  }

  return array(
    evidenceTexts,
  ).some(
    (fact) =>
      fact.includes(
        value,
      ),
  );
}

function stemsForTenGodAlias(
  value,
  evidenceTexts,
) {
  const aliases =
    value ===
      "官"
      ? [
          "正官",
          "七杀",
        ]
      : value ===
          "财"
        ? [
            "正财",
            "偏财",
          ]
        : [
            value,
          ];

  const stems = [];

  array(
    evidenceTexts,
  ).forEach(
    (fact) => {
      aliases.forEach(
        (alias) => {
          const patterns = [
            new RegExp(
              `天干([甲乙丙丁戊己庚辛壬癸])为${alias}透出`,
              "g",
            ),
            new RegExp(
              `([甲乙丙丁戊己庚辛壬癸])${alias}`,
              "g",
            ),
          ];

          patterns.forEach(
            (pattern) => {
              for (
                const match of
                fact.matchAll(
                  pattern,
                )
              ) {
                stems.push(
                  match[1],
                );
              }
            },
          );
        },
      );
    },
  );

  return unique(
    stems,
  );
}

function validateBranchRelationTokenCoverage({
  authoredText,
  evidenceTexts,
} = {}) {
  const errors = [];

  const joinedEvidence =
    array(
      evidenceTexts,
    ).join("\n");

  const rules = [
    {
      name:
        "六合",
      authored:
        /地支六合|六合/,
      evidence:
        /地支六合|六合/,
    },
    {
      name:
        "三合",
      authored:
        /三合/,
      evidence:
        /三合/,
    },
    {
      name:
        "三会",
      authored:
        /三会/,
      evidence:
        /三会/,
    },
    {
      name:
        "半合",
      authored:
        /半合/,
      evidence:
        /半合/,
    },
    {
      name:
        "暗合",
      authored:
        /暗合/,
      evidence:
        /暗合/,
    },
    {
      name:
        "同支重复",
      authored:
        /同支重复/,
      evidence:
        /同支重复/,
    },
    {
      name:
        "相冲",
      authored:
        /六冲|相冲|地支冲|构成冲/,
      evidence:
        /六冲|相冲|地支冲|构成冲/,
    },
    {
      name:
        "相刑",
      authored:
        /三刑|自刑|相刑|构成刑/,
      evidence:
        /三刑|自刑|相刑|构成刑/,
    },
    {
      name:
        "相害",
      authored:
        /六害|相害|构成害/,
      evidence:
        /六害|相害|构成害/,
    },
    {
      name:
        "相破",
      authored:
        /相破|构成破/,
      evidence:
        /相破|构成破/,
    },
  ];

  rules.forEach(
    (rule) => {
      if (
        rule.authored.test(
          text(
            authoredText,
          ),
        ) &&
        !rule.evidence.test(
          joinedEvidence,
        )
      ) {
        errors.push(
          `unbound_branch_relation:${rule.name}`,
        );
      }
    },
  );

  return unique(
    errors,
  );
}

function validateNegativeTechnicalClaims({
  authoredText,
  evidenceTexts,
} = {}) {
  const errors = [];

  const joinedEvidence =
    array(
      evidenceTexts,
    ).join("\n");

  splitSentences(
    authoredText,
  ).forEach(
    (sentence) => {
      const hasNegativeRelation =
        /(?:未与|没有与|并未与|不与|无)[^。；]{0,24}(?:冲|合|刑|害|破|三合|三会|暗合|关系|作用)/.test(
          sentence,
        ) ||
        /(?:没有|未形成|无)[^。；]{0,16}(?:冲合|合冲|引动|作用)/.test(
          sentence,
        );

      if (
        hasNegativeRelation &&
        !/(?:不存在|未形成|尚缺|未成局|没有构成|无此关系)/.test(
          joinedEvidence,
        )
      ) {
        errors.push(
          "unsupported_negative_relation",
        );
      }

      if (
        /外部机会信号偏弱|机会信号偏弱|缺乏外部机会/.test(
          sentence,
        ) &&
        !/机会信号偏弱|外部机会偏弱/.test(
          joinedEvidence,
        )
      ) {
        errors.push(
          "unsupported_negative_opportunity",
        );
      }

      if (
        /(?:需要|只有|必须)[^。；]{0,12}引动|未被引动|没有引动/.test(
          sentence,
        ) &&
        !/引动/.test(
          joinedEvidence,
        )
      ) {
        errors.push(
          "unsupported_trigger_requirement",
        );
      }
    },
  );

  return unique(
    errors,
  );
}

function validateThemeDomainBinding({
  domainId,
  evidenceFacts,
  availableDomainIds,
} = {}) {
  const errors = [];

  const normalizedDomainId =
    text(
      domainId,
    );

  if (
    availableDomainIds.size >
      0 &&
    !normalizedDomainId
  ) {
    errors.push(
      "missing_domain_id",
    );

    return errors;
  }

  if (
    normalizedDomainId &&
    !availableDomainIds.has(
      normalizedDomainId,
    )
  ) {
    errors.push(
      `unknown_domain_id:${normalizedDomainId}`,
    );

    return errors;
  }

  if (
    normalizedDomainId
  ) {
    const bound =
      array(
        evidenceFacts,
      ).some(
        (fact) =>
          array(
            fact
              ?.meta
              ?.domains,
          ).includes(
            normalizedDomainId,
          ),
      );

    if (
      !bound
    ) {
      errors.push(
        `domain_without_evidence:${normalizedDomainId}`,
      );
    }
  }

  return errors;
}

function genericTenGodStrengthErrors(
  authoredText,
  evidenceTexts,
) {
  const errors = [];

  const joinedEvidence =
    array(
      evidenceTexts,
    ).join("\n");

  const matches =
    [
      ...text(
        authoredText,
      ).matchAll(
        /(食神|伤官|正官|七杀|正印|偏印|正财|偏财|比肩|劫财)[^。；，]{0,8}(过旺|太旺|偏旺|极旺|旺盛|过弱|太弱|偏弱|衰弱)/g,
      ),
    ];

  matches.forEach(
    (match) => {
      if (
        !joinedEvidence.includes(
          match[2],
        )
      ) {
        errors.push(
          `unsupported_tengod_strength:${match[1]}:${match[2]}`,
        );
      }
    },
  );

  return unique(
    errors,
  );
}

function validateTechnicalClaims({
  authoredText,
  evidenceTexts,
} = {}) {
  const errors = [];

  const joinedEvidence =
    array(
      evidenceTexts,
    ).join("\n");

  if (
    /伏吟/.test(
      authoredText,
    ) &&
    !/(?:整柱相同|可称伏吟)/.test(
      joinedEvidence,
    )
  ) {
    errors.push(
      "unsupported_fuyin_claim",
    );
  }

  if (
    /反吟/.test(
      authoredText,
    ) &&
    !/反吟/.test(
      joinedEvidence,
    )
  ) {
    errors.push(
      "unsupported_fanyin_claim",
    );
  }

  const doubleExposedMatches =
    [
      ...String(
        authoredText ||
        "",
      ).matchAll(
        /(食神|伤官|正官|七杀|正印|偏印|正财|偏财|比肩|劫财)双透/g,
      ),
    ];

  doubleExposedMatches.forEach(
    (match) => {
      const tenGod =
        match[1];

      const count =
        array(
          evidenceTexts,
        ).filter(
          (value) =>
            value.includes(
              `${tenGod}透出`,
            ),
        ).length;

      if (
        count <
        2
      ) {
        errors.push(
          `unsupported_double_exposed:${tenGod}`,
        );
      }
    },
  );

  validateLayerHiddenTenGodClaims({
    authoredText,
    evidenceTexts,
  }).forEach(
    (code) =>
      errors.push(
        code,
      ),
  );

  if (
    /暗合/.test(
      authoredText,
    ) &&
    !/暗合/.test(
      joinedEvidence,
    )
  ) {
    errors.push(
      "unsupported_dark_combine",
    );
  }

  if (
    /食神制杀/.test(
      authoredText,
    )
  ) {
    const hasFoodGod =
      /食神/.test(
        joinedEvidence,
      );

    const hasSevenKillings =
      /七杀/.test(
        joinedEvidence,
      );

    const hasControl =
      /确定生克关系：[^。]*克[^。]*施克者/.test(
        joinedEvidence,
      );

    if (
      !(
        hasFoodGod &&
        hasSevenKillings &&
        hasControl
      )
    ) {
      errors.push(
        "unsupported_food_controls_killing",
      );
    }
  }

  if (
    /(?:格局|成格)/.test(
      authoredText,
    ) &&
    !/(?:格局|成格)/.test(
      joinedEvidence,
    )
  ) {
    errors.push(
      "unsupported_pattern_upgrade",
    );
  }

  if (
    /(?:制杀|合化|成局|冲克)[^。；，]{0,8}(?:强劲|有力|彻底|完全)|(?:强劲|有力|彻底|完全)[^。；，]{0,8}(?:制杀|合化|成局|冲克)/.test(
      authoredText,
    ) &&
    !/(?:强|旺|有力|完全|彻底)/.test(
      joinedEvidence,
    )
  ) {
    errors.push(
      "unsupported_strength_upgrade",
    );
  }

  genericTenGodStrengthErrors(
    authoredText,
    evidenceTexts,
  ).forEach(
    (code) =>
      errors.push(
        code,
      ),
  );

  const layerLabels = [
    "年柱",
    "月柱",
    "日柱",
    "时柱",
    "夫妻宫",
    "配偶宫",
    "子女宫",
  ];

  layerLabels.forEach(
    (label) => {
      if (
        authoredText.includes(
          label,
        ) &&
        !joinedEvidence.includes(
          label,
        )
      ) {
        errors.push(
          `unsupported_layer_reference:${label}`,
        );
      }
    },
  );

  const directRelations =
    [
      ...String(
        authoredText ||
        "",
      ).matchAll(
        /([甲乙丙丁戊己庚辛壬癸])(?:木|火|土|金|水)?[^，。；]{0,8}(克|合|冲|刑|害|破|制)[^，。；]{0,8}([甲乙丙丁戊己庚辛壬癸])(?:木|火|土|金|水)?/g,
      ),
    ];

  directRelations.forEach(
    (match) => {
      const left =
        match[1];

      const operator =
        match[2];

      const right =
        match[3];

      const supported =
        array(
          evidenceTexts,
        ).some(
          (value) =>
            value.includes(
              left,
            ) &&
            value.includes(
              right,
            ) &&
            (
              operator ===
                "制"
                ? /克|制/.test(
                    value,
                  )
                : value.includes(
                    operator,
                  )
            ),
        );

      if (
        !supported
      ) {
        errors.push(
          `unsupported_direct_relation:${left}${operator}${right}`,
        );
      }
    },
  );

  return unique(
    errors,
  );
}

function extractLifeContext(
  verifiedFacts,
) {
  const lifeFact =
    array(
      verifiedFacts,
    ).find(
      (fact) =>
        fact
          ?.meta
          ?.lifeContext,
    );

  if (
    lifeFact
      ?.meta
      ?.lifeContext
  ) {
    return lifeFact
      .meta
      .lifeContext;
  }

  const textValue =
    array(
      verifiedFacts,
    )
      .map(
        (fact) =>
          fact?.text ||
          "",
      )
      .join("\n");

  const ageMatch =
    textValue.match(
      /当前年龄约(\d{1,3})岁/,
    );

  const stageMatch =
    textValue.match(
      /人生阶段为([^。；，]+)/,
    );

  if (
    !ageMatch &&
    !stageMatch
  ) {
    return null;
  }

  return {
    age:
      ageMatch
        ? Number(
            ageMatch[1],
          )
        : null,
    lifeStage:
      stageMatch
        ? stageMatch[1]
        : "",
  };
}

function hasLifeStageMismatch(
  value,
  lifeContext,
) {
  if (
    !lifeContext ||
    Number(
      lifeContext?.age,
    ) <
      70
  ) {
    return false;
  }

  const activeStageTerms =
    /求职|晋升|职级|升学|备考|考试报名|资格申请|学校|同事|上级|客户|甲方|项目冲刺|副业扩张|奖项名额/;

  const conditional =
    /若|如果|如仍|仍在|仍需|尚在|当前还有|现实中仍有|若已有对应条件/;

  return splitSentences(
    value,
  ).some(
    (sentence) =>
      activeStageTerms.test(
        sentence,
      ) &&
      !conditional.test(
        sentence,
      ),
  );
}

function sanitizeRenderedText({
  value,
  evidenceTexts,
  lifeContext,
  stage,
} = {}) {
  let output =
    text(
      value,
    );

  const joinedEvidence =
    array(
      evidenceTexts,
    ).join("\n");

  output =
    output
      .replace(
        /正官(?:象征|代表)?贵人(?:机遇|机会)?/g,
        "正官带来正式要求或被评价的机会",
      )
      .replace(
        /外部规则保护公平竞争|保护公平竞争|正官克制劫财，外部规则保护公平竞争/g,
        "外部规则约束竞争行为",
      )
      .replace(
        /反而促成解决方案|结果倾向于公平/g,
        "促使各方回到规则边界",
      )
      .replace(
        /食神(?:大运)?为内在思考提供支持/g,
        "食神大运支持表达、技能与成果整理",
      )
      .replace(
        /食神好逸/g,
        "食神重享受的一面",
      )
      .replace(
        /大运藏支暗合财星/g,
        "财星藏于大运地支，相关地支关系同时参与",
      );

  splitSentences(
    output,
  ).forEach(
    (sentence) => {
      const hiddenErrors =
        validateLayerHiddenTenGodClaims({
          authoredText:
            sentence,
          evidenceTexts,
        });

      if (
        hiddenErrors.length >
        0
      ) {
        output =
          output.replace(
            sentence,
            "",
          );
      }
    },
  );

  output =
    splitSentences(
      output,
    )
      .filter(
        (sentence) => {
          const hardErrors = [
            ...validateTechnicalClaims({
              authoredText:
                sentence,
              evidenceTexts,
            }),
            ...validateTechnicalTokenCoverage({
              authoredText:
                sentence,
              evidenceTexts,
            }),
            ...validateBranchRelationTokenCoverage({
              authoredText:
                sentence,
              evidenceTexts,
            }),
            ...validateNegativeTechnicalClaims({
              authoredText:
                sentence,
              evidenceTexts,
            }),
          ];

          return hardErrors.length ===
            0;
        },
      )
      .join("");

  if (
    output.includes(
      "伏吟",
    ) &&
    !/(?:整柱相同|可称伏吟)/.test(
      joinedEvidence,
    )
  ) {
    output =
      output.replace(
        /伏吟/g,
        joinedEvidence.includes(
          "同支重复",
        )
          ? "同支重复"
          : "重复触发",
      );
  }

  if (
    /食神制杀/.test(
      output,
    )
  ) {
    const supported =
      /食神/.test(
        joinedEvidence,
      ) &&
      /七杀/.test(
        joinedEvidence,
      ) &&
      /确定生克关系：[^。]*克/.test(
        joinedEvidence,
      );

    if (
      !supported
    ) {
      output =
        output.replace(
          /食神制杀(?:格局)?|食神制杀之力强劲/g,
          "食神与七杀同时参与",
        );
    } else if (
      !/(?:格局|成格)/.test(
        joinedEvidence,
      )
    ) {
      output =
        output.replace(
          /食神制杀格局/g,
          "食神制杀的作用关系",
        );
    }

    output =
      output.replace(
        /食神制杀之力强劲/g,
        "食神制杀作用较明显",
      );
  }

  splitSentences(
    output,
  ).forEach(
    (sentence) => {
      [
        "年柱",
        "月柱",
        "日柱",
        "时柱",
        "夫妻宫",
        "配偶宫",
        "子女宫",
      ].forEach(
        (label) => {
          if (
            sentence.includes(
              label,
            ) &&
            !joinedEvidence.includes(
              label,
            )
          ) {
            output =
              output.replace(
                sentence,
                "",
              );
          }
        },
      );
    },
  );

  if (
    Number(
      lifeContext?.age,
    ) >=
      70
  ) {
    output =
      output
        .replace(
          /在职场、学校或申请场景中/g,
          "在仍需处理正式事务的场景中",
        )
        .replace(
          /同事、同行或同辈/g,
          "身边同辈或共同参与者",
        )
        .replace(
          /上级、监管方或既定规则/g,
          "有明确要求的机构或相关方",
        )
        .replace(
          /上级或外部压力/g,
          "外部要求",
        )
        .replace(
          /项目冲刺/g,
          "重要事项推进",
        )
        .replace(
          /求职、晋升或职级评定/g,
          "仍在处理的职业事务",
        )
        .replace(
          /副业扩张/g,
          "额外尝试",
        )
        .replace(
          /学校或单位/g,
          "相关机构",
        )
        .replace(
          /换学校\/?工作环境|换学校或工作环境/g,
          "调整居住、活动或固定关系环境",
        )
        .replace(
          /学业或职业基础|职业\/?学业基础|学业、职业基础/g,
          "日常能力与生活安排基础",
        )
        .replace(
          /项目、作品或比赛|作品或比赛|比赛等形式/g,
          "兴趣实践、经验整理或日常活动",
        )
        .replace(
          /商业化/g,
          "转化为可持续的实际用途",
        )
        .replace(
          /兼职、副业|兼职或副业|副业或兼职/g,
          "日常资源补充",
        )
        .replace(
          /职业发展|后续职业/g,
          "后续生活安排",
        )
        .replace(
          /优先完成学业或职业基础/g,
          "优先稳定日常安排与既有责任",
        );
  }

  if (
    stage ===
    "month"
  ) {
    output =
      output.replace(
        /本周/g,
        "本月",
      );
  }

  return output
    .replace(
      /本本月/g,
      "本月",
    )
    .replace(
      /此此运/g,
      "此运",
    )
    .replace(
      /本月过程中本月过程中/g,
      "本月过程中",
    )
    .replace(
      /本年过程中本年过程中/g,
      "本年过程中",
    )
    .replace(
      /[。！；]+？/g,
      "？",
    )
    .replace(
      /？？+/g,
      "？",
    )
    .replace(
      /每日或每周固定的小时段|每天或每周固定的小时段/g,
      "固定留出一段时间",
    )
    .replace(
      /近一两年|近两年|最近一两年/g,
      "近期",
    )
    .replace(
      /(?:观察|留意|注意)?\s*\d{1,2}\s*[-—至]\s*\d{1,2}月/g,
      "观察本年过程中",
    )
    .replace(
      /三年内|两年内|一年内/g,
      stage ===
        "luck"
        ? "此运过程中"
        : stage ===
            "year"
          ? "本年过程中"
          : "本月过程中",
    )
    .replace(
      /隔天再回应|第二天再回应/g,
      "情绪平稳后再回应",
    )
    .replace(
      /\s{2,}/g,
      " ",
    )
    .trim();
}

function splitSentences(
  value,
) {
  return text(
    value,
  ).match(
    /[^。！？；]+[。！？；]?/g,
  ) ||
  [];
}

function ensureMinimumThemeCoverage(
  report,
  stage,
) {
  if (
    stage !== "luck" ||
    array(report?.themes).length !== 1
  ) {
    return report;
  }

  const primary =
    report.themes[0];

  const alternative =
    text(primary?.alternative);

  if (
    alternative.length < 24
  ) {
    return report;
  }

  const secondTitle =
    /收入|收益|财务|资源|储蓄|回报/.test(
      alternative,
    )
      ? "资源积累与现实回报"
      : /关系|合作|伙伴|人际/.test(
          alternative,
        )
        ? "关系与合作边界"
        : "次要发展方向";

  const secondTheme = {
    domainId:
      /收入|收益|财务|资源|储蓄|回报/.test(
        alternative,
      )
        ? "resource_accumulation"
        : /关系|合作|伙伴|人际/.test(
            alternative,
          )
          ? "relation_environment_change"
          : "ability_output",
    title:
      secondTitle,
    importance:
      "中",
    judgment:
      "这是次于主线的补充方向，是否明显显现取决于现实基础与持续投入。",
    story:
      alternative,
    possibilities:
      [],
    alternative:
      "",
    evidenceIds:
      unique(
        array(primary?.evidenceIds),
      ).slice(0, 2),
    advice:
      [],
  };

  primary.alternative = "";

  return {
    ...report,
    themes: [
      primary,
      secondTheme,
    ],
  };
}

function countConcreteScenes(
  value,
) {
  const textValue =
    text(value);

  const categories = {
    education: [
      "考试",
      "报名",
      "资格认证",
      "证书",
      "学校",
      "导师",
      "审批",
      "审核",
    ],
    work: [
      "上级",
      "客户",
      "同事",
      "晋升",
      "项目名额",
      "职级",
      "单位",
      "甲方",
    ],
    relationship: [
      "恋爱",
      "伴侣",
      "订婚",
      "结婚",
      "定居",
      "父母",
    ],
    financeLegal: [
      "法务",
      "税务",
      "诉讼",
      "房源",
      "设备采购",
      "投资",
    ],
    creative: [
      "培训",
      "写作",
      "设计",
      "演讲",
      "比赛",
      "副业",
    ],
  };

  const matchedTerms = [];

  const matchedCategories =
    Object.entries(categories)
      .filter(([, terms]) => {
        const matches =
          terms.filter(
            (term) =>
              textValue.includes(term),
          );

        matchedTerms.push(...matches);
        return matches.length > 0;
      })
      .map(([category]) => category);

  return {
    termCount:
      unique(matchedTerms).length,
    categoryCount:
      unique(matchedCategories).length,
  };
}

function normalizeImportance(
  value,
) {
  const normalized =
    text(
      value,
    );

  if (
    /高|强|主要/.test(
      normalized,
    )
  ) {
    return "高";
  }

  if (
    /低|弱|补充/.test(
      normalized,
    )
  ) {
    return "低";
  }

  return "中";
}

function normalizeStringArray(
  value,
) {
  if (
    Array.isArray(
      value,
    )
  ) {
    return value
      .map(
        (item) =>
          typeof item ===
          "string"
            ? item
            : text(
                item?.text ||
                item?.内容 ||
                item?.value,
              ),
      )
      .map(
        text,
      )
      .filter(Boolean);
  }

  const normalized =
    text(
      value,
    );

  return normalized
    ? [
        normalized,
      ]
    : [];
}

function listItems(
  value,
  limit,
  maxLength,
) {
  return unique(
    array(
      value,
    )
      .map(
        (item) =>
          compactParagraph(
            item,
            maxLength,
          ),
      )
      .filter(Boolean),
  ).slice(
    0,
    limit,
  );
}

function compactParagraph(
  value,
  maxLength,
) {
  const normalized =
    text(
      value,
    )
      .replace(
        /\s+/g,
        " ",
      )
      .trim();

  if (
    normalized.length <=
    maxLength
  ) {
    return normalized;
  }

  const sentences =
    normalized.match(
      /[^。！？]+[。！？]?/g,
    ) ||
    [
      normalized,
    ];

  let result = "";

  for (
    const sentence of
    sentences
  ) {
    if (
      (
        result +
        sentence
      ).length >
      maxLength
    ) {
      break;
    }

    result +=
      sentence;
  }

  return result ||
    `${normalized.slice(0, maxLength - 1)}…`;
}

function ensureQuestion(
  value,
) {
  const normalized =
    compactParagraph(
      value,
      180,
    )
      .replace(
        /[。！；：，、\s]+$/g,
        "",
      )
      .replace(
        /？？+/g,
        "？",
      );

  return /[？?]$/.test(
    normalized,
  )
    ? normalized
    : `${normalized}？`;
}

function normalizeForCompare(
  value,
) {
  return text(
    value,
  )
    .replace(
      /[\s，。；：、！？,.!?;:'"“”‘’（）()《》【】[\]{}_-]+/g,
      "",
    )
    .toLowerCase();
}

function unique(
  values,
) {
  return [
    ...new Set(
      array(
        values,
      ),
    ),
  ];
}

function text(
  value,
) {
  return value ===
      null ||
    value ===
      undefined
    ? ""
    : String(
        value,
      ).trim();
}

function array(
  value,
) {
  return Array.isArray(
    value,
  )
    ? value
    : value ===
          null ||
        value ===
          undefined
      ? []
      : [value];
}
