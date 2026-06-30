
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
  /呼吸系统|循环系统|消化系统|消化功能|肺部|肝胆|肾脏|脾胃|心脏|血液|皮肤病|癌症|疾病|手术|体弱|容易生病/;

const unsupportedFamilyPattern =
  /兄弟姐妹(?:多|少|数量)|朋友(?:多|不少|很少)|子女缘(?:薄|浅|晚)|父亲缘(?:薄|浅)|母亲.{0,8}(?:助力大|支持大)|房产(?:基础|数量|多|少|纠纷)|不动产守财/;

const mechanicalIndustryPattern =
  /互联网|销售|金融|法律|科研|绘画|音乐|绿色行业|餐饮|医药|传媒行业|教育行业|文化行业/;

export function guardNatalAiContent({
  report = {},
  evidencePack = {},
} = {}) {
  const warnings = [];

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
    keepReadableRows(
      sanitized
        .coreMechanism
        .steps,
    );

  sanitized.strengths =
    keepReadableRows(
      sanitized.strengths,
    );

  sanitized.repeatingPatterns =
    keepReadableRows(
      sanitized
        .repeatingPatterns,
    );

  sanitized.lifeThemes =
    keepReadableRows(
      sanitized.lifeThemes,
    );

  sanitized.realityChecks =
    keepReadableRows(
      sanitized.realityChecks,
    );

  sanitized.actions =
    keepReadableRows(
      sanitized.actions,
    );

  sanitized.conditionalInsights =
    keepReadableRows(
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
        "子水相关的表达与成果路径受到子酉关系牵动",
      )
      .replace(
        /身旺印旺|身极强旺|身极强|身极旺/g,
        "印比支持明显",
      )
      .replace(
        /日主自身力量非常突出/g,
        "日主得到的印比支持明显",
      )
      .replace(
        /印星过旺|正印星旺/g,
        "印星信息较突出",
      )
      .replace(
        /坐禄又得月令/g,
        "月支与日支均见同类信息",
      )
      .replace(
        /食神被破|食神受伤|食神遭破|食神失效/g,
        "食神受关系牵动",
      )
      .replace(
        /输出(?:通道|通路)(?:被)?堵死/g,
        "输出过程容易反复",
      )
      .replace(
        /财官(?:都)?被(?:旺)?金克制/g,
        "财星受金气牵制，官星藏而未透",
      )
      .replace(
        /妻子的信号较弱|妻星较弱/g,
        "妻星藏而未透，感情需求不一定直接表现",
      )
      .replace(
        /感情缘分来得较晚|缘分来得较晚/g,
        "感情需求和择偶标准不一定直接表现出来",
      )
      .replace(
        /土多金埋，?消化功能也需要留意/g,
        "土金信息集中时，需要注意作息和放松",
      )
      .replace(
        /土多金埋/g,
        "土金信息集中",
      )
      .replace(
        /财富进账容易有波动或不易积攒/g,
        "财富处理中更需要重视预算、合作边界和长期兑现",
      )
      .replace(
        /依靠技术或创意快速变现的通道不太顺畅/g,
        "将技术或创意转化为成果时，可能需要更多实践和现实承接",
      )
      .replace(
        /父亲在资源支持上不易直接体现/g,
        "与父亲之间更重实际责任和资源安排，情感表达可能不算直接",
      )
      .replace(
        /兄弟姐妹或同辈中既有互助也有竞争/g,
        "同辈关系中既重合作，也重边界",
      )
      .replace(
        /对子女的期望容易与现实产生落差，?教育上需避免过度保护或控制/g,
        "在照顾和教育关系中容易带入较高标准，需要给彼此更多空间",
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
      sentence =
        "具体时间需要结合岁运判断，原局只说明长期倾向。";

      warnings.push(
        `content_rewritten:timing:${path}`,
      );
    }

    if (
      unsupportedFamilyPattern.test(
        sentence,
      )
    ) {
      sentence =
        softenFamilySentence(
          sentence,
        );

      warnings.push(
        `content_rewritten:family_overreach:${path}`,
      );
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
        softenIndustrySentence(
          sentence,
        );

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

function softenFamilySentence(
  sentence = "",
) {
  const softened =
    sentence
      .replace(
        /父亲.{0,12}(?:支持不足|资源支持不易直接体现|关系疏远)/g,
        "与父亲之间更重实际责任和资源安排，情感表达可能不算直接",
      )
      .replace(
        /兄弟姐妹.{0,16}(?:互助也有竞争|竞争明显)/g,
        "同辈关系中既重合作，也重边界",
      )
      .replace(
        /子女.{0,18}(?:期望容易与现实产生落差|过度保护|控制)/g,
        "在照顾和教育关系中容易带入较高标准，需要给彼此更多空间",
      )
      .replace(
        /(?:妻星|妻子的信号).{0,8}(?:较弱|弱)/g,
        "妻星藏而未透，感情需求不一定直接表现",
      )
      .replace(
        /(?:感情缘分|缘分).{0,8}(?:来得较晚|较晚)/g,
        "感情需求和择偶标准不一定直接表现出来",
      );

  if (softened !== sentence) {
    return softened;
  }

  return sentence
    .replace(
      /(?:注定|必然|一定)/g,
      "更容易",
    );
}

function softenIndustrySentence(
  sentence = "",
) {
  return sentence
    .replace(
      /最适合|只适合/g,
      "较适合",
    )
    .replace(
      /^适合/g,
      "例如可参考",
    )
    .replace(
      /唯一/g,
      "主要",
    );
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