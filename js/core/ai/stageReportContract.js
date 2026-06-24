const STAGE_CONFIG = {
  luck: {
    heading:
      "十年总断",
    themeHeading:
      "十年主要结构",
    minThemes:
      2,
    maxThemes:
      4,
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
  },
  year: {
    heading:
      "今年总断",
    themeHeading:
      "年度重点",
    minThemes:
      2,
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
  },
  month: {
    heading:
      "本月总断",
    themeHeading:
      "本月触发",
    minThemes:
      1,
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
      errors.push(
        `top_level:${code}`,
      ),
  );

  validateNegativeTechnicalClaims({
    authoredText:
      summaryAndLists,
    evidenceTexts:
      allEvidenceTexts,
  }).forEach(
    (code) =>
      errors.push(
        `top_level:${code}`,
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

  const allFactTexts =
    array(
      verifiedFacts,
    )
      .map(
        (fact) =>
          fact?.text ||
          "",
      )
      .filter(Boolean);

  const themes =
    array(
      report?.themes,
    )
      .filter(
        (theme) =>
          text(
            theme?.title,
          ) &&
          text(
            theme?.judgment,
          ).length >=
            8 &&
          text(
            theme?.story,
          ).length >=
            20 &&
          array(
            theme?.evidenceIds,
          ).length >
            0,
      )
      .slice(
        0,
        config.maxThemes,
      );

  const lines = [
    `### ${config.heading}`,
    sanitizeRenderedText({
      value:
        compactParagraph(
          report?.summary,
          config.summaryMax,
        ),
      evidenceTexts:
        allFactTexts,
      lifeContext,
      stage,
    }),
    "",
    `### ${config.themeHeading}`,
  ];

  themes.forEach(
    (
      theme,
      index,
    ) => {
      const isLastMinor =
        index ===
          themes.length -
          1 &&
        index >
          0 &&
        theme
          ?.importance !==
          "高";

      const themeEvidenceTexts =
        unique(
          array(
            theme
              ?.evidenceIds,
          )
            .map(
              (id) =>
                factMap.get(
                  id,
                )
                  ?.text ||
                "",
            )
            .filter(Boolean),
        );

      const safeTitle =
        sanitizeRenderedText({
          value:
            text(theme?.title) ||
            `主题${index + 1}`,
          evidenceTexts:
            themeEvidenceTexts,
          lifeContext,
          stage,
        });

      const safeJudgment =
        sanitizeRenderedText({
          value:
            compactParagraph(
              theme?.judgment,
              config.judgmentMax,
            ),
          evidenceTexts:
            themeEvidenceTexts,
          lifeContext,
          stage,
        });

      const safeStory =
        sanitizeRenderedText({
          value:
            compactParagraph(
              theme?.story,
              isLastMinor
                ? config.minorStoryMax
                : config.primaryStoryMax,
            ),
          evidenceTexts:
            themeEvidenceTexts,
          lifeContext,
          stage,
        });

      if (
        !safeTitle ||
        !safeJudgment ||
        !safeStory ||
        themeEvidenceTexts.length ===
          0
      ) {
        return;
      }

      lines.push(
        "",
        `#### ${safeTitle}`,
        `**判断：**${safeJudgment}`,
        "",
        `**现实剧本：**${safeStory}`,
      );

      const possibilities =
        unique(
          array(
            theme?.possibilities,
          )
            .map(
              text,
            )
            .filter(Boolean),
        )
          .slice(
            0,
            config.possibilityLimit,
          )
          .map(
            (item) =>
              sanitizeRenderedText({
                value:
                  compactParagraph(
                    item,
                    config.possibilityTextMax,
                  ),
                evidenceTexts:
                  themeEvidenceTexts,
                lifeContext,
                stage,
              }),
          )
          .filter(Boolean);

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
          `**补充可能：**${sanitizeRenderedText({
            value:
              compactParagraph(
                theme.alternative,
                config.alternativeMax,
              ),
            evidenceTexts:
              themeEvidenceTexts,
            lifeContext,
            stage,
          })}`,
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
            theme
              ?.importance ===
              "高"
              ? config.highEvidenceLimit
              : config.normalEvidenceLimit,
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
        unique(
          array(
            theme?.advice,
          )
            .map(
              text,
            )
            .filter(Boolean),
        )
          .slice(
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
              `${adviceIndex + 1}. ${sanitizeRenderedText({
                value:
                  compactParagraph(
                    item,
                    120,
                  ),
                evidenceTexts:
                  themeEvidenceTexts,
                lifeContext,
                stage,
              })}`,
          ),
        );
      }
    },
  );

  const opportunities =
    listItems(
      array(
        report?.opportunities,
      ).map(
        (item) =>
          sanitizeRenderedText({
            value:
              item,
            evidenceTexts:
              allFactTexts,
            lifeContext,
            stage,
          }),
      ),
      config.opportunityLimit,
      150,
    );

  const risks =
    listItems(
      array(
        report?.risks,
      ).map(
        (item) =>
          sanitizeRenderedText({
            value:
              item,
            evidenceTexts:
              allFactTexts,
            lifeContext,
            stage,
          }),
      ),
      config.riskLimit,
      150,
    );

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
    listItems(
      array(
        report?.actions,
      ).map(
        (item) =>
          sanitizeRenderedText({
            value:
              item,
            evidenceTexts:
              allFactTexts,
            lifeContext,
            stage,
          }),
      ),
      config.actionLimit,
      150,
    );

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
    listItems(
      array(
        report?.verification,
      ).map(
        (item) =>
          sanitizeRenderedText({
            value:
              item,
            evidenceTexts:
              allFactTexts,
            lifeContext,
            stage,
          }),
      ),
      config.verificationLimit,
      180,
    );

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

  return lines
    .filter(
      (line) =>
        line !==
        null &&
        line !==
        undefined,
    )
    .join("\n")
    .replace(
      /\n{3,}/g,
      "\n\n",
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
    "配偶宫",
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
        "配偶宫",
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
