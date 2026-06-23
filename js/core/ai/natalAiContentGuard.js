
const metadataKeys =
  new Set([
    "version",
    "scope",
    "key",
    "status",
    "treatment",
    "confidence",
    "evidenceRefs",
  ]);

const timingPattern =
  /大运|流年|流月|岁运|解空|引动|某年|哪年|运到|运势触发/;

const specificHealthPattern =
  /呼吸系统|循环系统|消化系统|肺部|肝胆|肾脏|脾胃|心脏|血液|皮肤病|癌症|疾病|手术|体弱|容易生病/;

const unsupportedFamilyPattern =
  /兄弟姐妹(?:多|少|数量)|朋友(?:多|不少|很少)|子女缘(?:薄|浅|晚)|父亲缘(?:薄|浅)|母亲.{0,8}(?:助力大|支持大)|房产(?:基础|数量|多|少|纠纷)|不动产守财/;

const mechanicalIndustryPattern =
  /互联网|销售|金融|法律|科研|绘画|音乐|绿色行业|餐饮|医药|传媒行业|教育行业|文化行业/;

export function guardNatalAiContent({
  report = {},
  evidencePack = {},
} = {}) {
  const warnings = [];

  const evidenceIndex =
    buildEvidenceIndex(
      evidencePack,
    );

  const chartCounts =
    buildChartCounts(
      evidencePack,
    );

  const sanitized =
    sanitizeNode(
      report,
      {
        warnings,
        chartCounts,
        path: "root",
      },
    );

  sanitized.coreMechanism =
    sanitized.coreMechanism ?? {};

  sanitized.coreMechanism.steps =
    filterMajorRows({
      rows:
        sanitized
          .coreMechanism
          .steps,

      evidenceIndex,

      warnings,

      section:
        "coreMechanism",

      requireStrongPattern:
        false,

      minimumFacts:
        2,
    });

  sanitized.strengths =
    filterMajorRows({
      rows:
        sanitized.strengths,

      evidenceIndex,

      warnings,

      section:
        "strengths",

      requireStrongPattern:
        false,

      minimumFacts:
        3,
    });

  sanitized.repeatingPatterns =
    filterMajorRows({
      rows:
        sanitized
          .repeatingPatterns,

      evidenceIndex,

      warnings,

      section:
        "repeatingPatterns",

      requireStrongPattern:
        true,

      minimumFacts:
        99,
    });

  sanitized.lifeThemes =
    filterMajorRows({
      rows:
        sanitized.lifeThemes,

      evidenceIndex,

      warnings,

      section:
        "lifeThemes",

      requireStrongPattern:
        false,

      minimumFacts:
        3,
    });

  sanitized.realityChecks =
    filterRowsWithEvidence(
      sanitized.realityChecks,
    );

  sanitized.actions =
    filterRowsWithEvidence(
      sanitized.actions,
    );

  sanitized.conditionalInsights =
    filterRowsWithEvidence(
      sanitized
        .conditionalInsights,
    );

  if (
    warnings.some(
      (warning) =>
        warning.startsWith(
          "content_removed:",
        ),
    ) &&
    sanitized.confidence ===
      "high"
  ) {
    sanitized.confidence =
      "medium";
  }

  return {
    report:
      removeEmptyValues(
        sanitized,
      ),

    warnings:
      uniqueText(
        warnings,
      ),
  };
}

  const evidenceIndex =
    buildEvidenceIndex(
      evidencePack,
    );

  const chartCounts =
    buildChartCounts(
      evidencePack,
    );

  const sanitized =
    sanitizeNode(
      report,
      {
        warnings,
        chartCounts,
        path: "root",
      },
    );

  sanitized.coreMechanism =
    sanitized.coreMechanism ?? {};

  sanitized.coreMechanism.steps =
    filterMajorRows({
      rows:
        sanitized
          .coreMechanism
          .steps,

      evidenceIndex,

      warnings,

      section:
        "coreMechanism",

      requireStrongPattern:
        false,

      minimumFacts:
        2,
    });

  sanitized.strengths =
    filterMajorRows({
      rows:
        sanitized.strengths,

      evidenceIndex,

      warnings,

      section:
        "strengths",

      requireStrongPattern:
        false,

      minimumFacts:
        3,
    });

  sanitized.repeatingPatterns =
    filterMajorRows({
      rows:
        sanitized
          .repeatingPatterns,

      evidenceIndex,

      warnings,

      section:
        "repeatingPatterns",

      requireStrongPattern:
        true,

      minimumFacts:
        99,
    });

  sanitized.lifeThemes =
    filterMajorRows({
      rows:
        sanitized.lifeThemes,

      evidenceIndex,

      warnings,

      section:
        "lifeThemes",

      requireStrongPattern:
        false,

      minimumFacts:
        3,
    });

  sanitized.realityChecks =
    filterRowsWithEvidence(
      sanitized.realityChecks,
    );

  sanitized.actions =
    filterRowsWithEvidence(
      sanitized.actions,
    );

  sanitized.conditionalInsights =
    filterRowsWithEvidence(
      sanitized
        .conditionalInsights,
    );

function keepReadableRows(
  rows,
) {
  return (
    Array.isArray(rows)
      ? rows
      : []
  ).filter(
    hasReadableContent,
  );
}

function buildChartCounts(
  evidencePack,
) {
    const pillars =
    evidencePack
        .chartSummary
        ?.pillars ??
    evidencePack
        .chart
        ?.pillars ??
    {};

  const stemCounts = {};
  const branchCounts = {};

  for (
    const pillar of
    Object.values(pillars)
  ) {
    const stem =
      normalizeText(
        pillar?.stem,
      );

    const branch =
      normalizeText(
        pillar?.branch,
      );

    if (stem) {
      stemCounts[stem] =
        (
          stemCounts[stem] ??
          0
        ) + 1;
    }

    if (branch) {
      branchCounts[branch] =
        (
          branchCounts[branch] ??
          0
        ) + 1;
    }
  }

  return {
    stemCounts,
    branchCounts,
  };
}


function sanitizeNode(
  value,
  {
    warnings,
    chartCounts,
    path,
  },
  key = "",
) {
  if (Array.isArray(value)) {
    if (
      key ===
      "evidenceRefs"
    ) {
      return value;
    }

    return value
      .map(
        (item, index) =>
          sanitizeNode(
            item,
            {
              warnings,
              chartCounts,
              path:
                `${path}[${index}]`,
            },
          ),
      )
      .filter(hasValue);
  }

  if (
    value &&
    typeof value ===
      "object"
  ) {
    return Object.fromEntries(
      Object.entries(value)
        .map(
          ([childKey, item]) => [
            childKey,

            sanitizeNode(
              item,
              {
                warnings,
                chartCounts,

                path:
                  `${path}.${childKey}`,
              },

              childKey,
            ),
          ],
        )
        .filter(
          ([, item]) =>
            hasValue(item),
        ),
    );
  }

  if (
    typeof value !==
    "string"
  ) {
    return value;
  }

  const text =
    value.trim();

  if (
    !text ||
    metadataKeys.has(key) ||
    path.includes(
      ".boundaries",
    ) ||
    path.includes(
      ".warnings",
    )
  ) {
    return text;
  }

  return sanitizeText(
    text,
    {
      warnings,
      chartCounts,
      path,
      isTitle:
        key === "title" ||
        key === "headline",
    },
  );
}

function sanitizeText(
  original,
  {
    warnings,
    chartCounts,
    path,
    isTitle,
  },
) {
  let text =
    correctCountClaims(
      original,
      chartCounts,
      warnings,
      path,
    )
      .replaceAll(
        "比劫夺财",
        "比劫牵财",
      )
      .replace(
        /子水被(?:强势)?酉金(?:压制|克制)/g,
        "子水的泄秀作用受到整体结构与子酉关系干扰",
      )
      .replace(
        /贯穿一生/g,
        "长期容易反复出现",
      )
      .replace(
        /一生的课题/g,
        "长期需要处理的课题",
      )
      .replace(
        /注定|必然|一定会|必有/g,
        "更容易",
      );

  if (
    !path.includes(
      "conditionalInsights",
    )
  ) {
    text =
      text.replaceAll(
        "财坏印",
        "财印之间的条件性牵动",
      );
  }

  if (isTitle) {
    return text;
  }

  const sentences =
    text.match(
      /[^。！？；]+[。！？；]?/g,
    ) ?? [text];

  const result = [];
  const seen = new Set();

  for (
    const rawSentence of
    sentences
  ) {
    let sentence =
      rawSentence.trim();

    if (!sentence) {
      continue;
    }

    if (
      timingPattern.test(
        sentence,
      )
    ) {
      warnings.push(
        `content_removed:timing:${path}`,
      );

      continue;
    }

    if (
      unsupportedFamilyPattern.test(
        sentence,
      )
    ) {
      warnings.push(
        `content_removed:family_overreach:${path}`,
      );

      continue;
    }

    if (
      specificHealthPattern.test(
        sentence,
      )
    ) {
      sentence =
        "原局只支持寒暖燥湿、压力和生活节奏层面的提醒，不足以判断具体器官或疾病。";

      warnings.push(
        `content_rewritten:health:${path}`,
      );
    }

    if (
      mechanicalIndustryPattern.test(
        sentence,
      )
    ) {
      sentence =
        "更适合选择能把专业积累转化为稳定输出、现实交付和清晰协作的环境。";

      warnings.push(
        `content_rewritten:industry:${path}`,
      );
    }

    const fingerprint =
      sentence
        .replace(
          /[，。！？；、\s]/g,
          "",
        )
        .slice(0, 80);

    if (
      !fingerprint ||
      seen.has(fingerprint)
    ) {
      continue;
    }

    seen.add(fingerprint);
    result.push(sentence);
  }

  return result.join("");
}

function correctCountClaims(
  text,
  chartCounts,
  warnings,
  path,
) {
  const numeralMap = {
    一: 1,
    二: 2,
    两: 2,
    双: 2,
    三: 3,
    四: 4,
  };

  const stems =
    "甲乙丙丁戊己庚辛壬癸";

  const branches =
    "子丑寅卯辰巳午未申酉戌亥";

  return text.replace(
    /([一二两双三四])重([甲乙丙丁戊己庚辛壬癸子丑寅卯辰巳午未申酉戌亥])/g,

    (
      match,
      numeral,
      symbol,
    ) => {
      const claimed =
        numeralMap[numeral];

      const actual =
        stems.includes(symbol)
          ? chartCounts
              .stemCounts[
              symbol
            ] ?? 0
          : branches.includes(
                symbol,
              )
            ? chartCounts
                .branchCounts[
                symbol
              ] ?? 0
            : 0;

      if (
        !actual ||
        claimed === actual
      ) {
        return match;
      }

      warnings.push(
        `content_corrected:count:${path}:${symbol}:${claimed}->${actual}`,
      );

      if (actual === 2) {
        return `双${symbol}`;
      }

      const label = {
        1: "一",
        3: "三",
        4: "四",
      }[actual] ?? String(actual);

      return `${label}重${symbol}`;
    },
  );
}


function hasReadableContent(
  value,
) {
  if (
    !value ||
    typeof value !==
      "object"
  ) {
    return false;
  }

  return Object.entries(value)
    .some(
      ([key, item]) =>
        key !==
          "evidenceRefs" &&
        (
          (
            typeof item ===
              "string" &&
            item.trim()
          ) ||
          (
            Array.isArray(item) &&
            item.length
          )
        ),
    );
}

function removeEmptyValues(
  value,
) {
  if (Array.isArray(value)) {
    return value
      .map(
        removeEmptyValues,
      )
      .filter(hasValue);
  }

  if (
    value &&
    typeof value ===
      "object"
  ) {
    return Object.fromEntries(
      Object.entries(value)
        .map(
          ([key, item]) => [
            key,
            removeEmptyValues(
              item,
            ),
          ],
        )
        .filter(
          ([, item]) =>
            hasValue(item),
        ),
    );
  }

  return value;
}

function hasValue(
  value,
) {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return false;
  }

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  if (
    typeof value ===
    "object"
  ) {
    return Object.keys(value)
      .length > 0;
  }

  return true;
}

function uniqueText(
  items,
) {
  return [
    ...new Set(
      (
        Array.isArray(items)
          ? items
          : []
      )
        .map(normalizeText)
        .filter(Boolean),
    ),
  ];
}

function normalizeText(
  value,
) {
  return typeof value ===
    "string"
    ? value.trim()
    : "";
}