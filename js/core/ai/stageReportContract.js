const STAGE_CONFIG = {
  luck: {
    heading:
      "十年总断",
    minThemes:
      2,
    maxThemes:
      3,
  },
  year: {
    heading:
      "今年总断",
    minThemes:
      2,
    maxThemes:
      3,
  },
  month: {
    heading:
      "本月总断",
    minThemes:
      2,
    maxThemes:
      3,
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

      const authoredText = [
        theme?.title,
        theme?.judgment,
        theme?.story,
        theme?.alternative,
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
        errors.push(
          `${prefix}:over_specific_scene_enumeration`,
        );
      }

      const evidenceTexts =
        evidenceIds
          .map(
            (id) =>
              factMap.get(id)?.text || "",
          )
          .filter(Boolean);

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

      if (
        hasLifeStageMismatch(
          authoredText,
          lifeContext,
        )
      ) {
        errors.push(
          `${prefix}:life_stage_scene_mismatch`,
        );
      }
    },
  );

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

  if (
    hasLifeStageMismatch(
      summaryAndLists,
      lifeContext,
    )
  ) {
    errors.push(
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

  const themes =
    array(
      report?.themes,
    ).slice(
      0,
      config.maxThemes,
    );

  const lines = [
    `### ${config.heading}`,
    sanitizeRenderedText({
      value:
        compactParagraph(
          report?.summary,
          300,
        ),
      evidenceTexts:
        [],
      lifeContext,
      stage,
    }),
    "",
    "### 主要主题",
  ];

  themes.forEach(
    (
      theme,
      index,
    ) => {
      const isLastMinor =
        index ===
          2 &&
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
              180,
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
                ? 210
                : 360,
            ),
          evidenceTexts:
            themeEvidenceTexts,
          lifeContext,
          stage,
        });

      lines.push(
        "",
        `#### ${safeTitle}`,
        `**判断：**${safeJudgment}`,
        "",
        `**现实剧本：**${safeStory}`,
      );

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
                160,
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
              ? 3
              : 2,
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
              ? 1
              : 2,
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
              [],
            lifeContext,
            stage,
          }),
      ),
      3,
      130,
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
              [],
            lifeContext,
            stage,
          }),
      ),
      3,
      130,
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
              [],
            lifeContext,
            stage,
          }),
      ),
      3,
      130,
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
              [],
            lifeContext,
            stage,
          }),
      ),
      3,
      160,
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
    title:
      secondTitle,
    importance:
      "中",
    judgment:
      "这是次于主线的补充方向，是否明显显现取决于现实基础与持续投入。",
    story:
      alternative,
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
      160,
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
