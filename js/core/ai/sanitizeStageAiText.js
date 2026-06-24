const COMMON_TEXT_REPLACEMENTS = [
  [/Plan\s*B/gi, "备用方案"],
  [/Excel/gi, "电子表格"],
  [/\bAI\b/gi, "人工智能"],
  [/\bA部分\b/g, "其中一部分"],
  [/\brelationFacts\b/gi, "确定关系"],
  [/\brelationWhitelist\b/gi, "允许使用的关系"],
  [/\bmechanicalSignals\b/gi, "机械信号"],
  [/\bevidenceConvergences\b/gi, "证据汇合"],
  [/\bmust_compare\b/gi, "必须比较"],
  [/\bstandardsReview\b/gi, "学业资格与规则"],
  [/\bplanAndResults\b/gi, "计划执行与成果"],
  [/\boutputAndRules\b/gi, "表达输出与规则"],
];

const STORY_SOFTENING_REPLACEMENTS = [
  [/第三者/g, "外部干扰"],
  [/短暂分居/g, "短期疏离"],
  [/搬离共同住所/g, "调整共同生活安排"],
  [/谈婚论嫁/g, "讨论关系责任与未来安排"],
  [/共同居住/g, "共同生活安排"],
  [/财产安排/g, "现实资源安排"],
  [/提出分手/g, "重新评估关系方向"],
  [/辞职/g, "职业方向调整"],
  [/失业/g, "职业稳定性变化"],
  [/诉讼/g, "正式争议处理"],
  [/违约金/g, "额外履约成本"],
  [/口腔溃疡/g, "作息与精力波动"],
  [/视力下降/g, "感官与精力负担"],
  [/退休金/g, "稳定收入或既有储备"],
  [/子女婚嫁/g, "晚辈相关安排"],
  [/房产收益/g, "固定资产或既有资源"],
  [/老年生活/g, "后续生活安排"],
  [/长途独自驾驶/g, "高疲劳状态下进行高风险活动"],
  [/推迟到下个大运再做决定/g, "待信息更充分时再评估"],
  [/推迟到下一步大运再做决定/g, "待信息更充分时再评估"],
];

const TEN_GOD_ALIASES = {
  食神: ["食神", "食伤"],
  伤官: ["伤官", "食伤"],
  正官: ["正官", "官星", "官杀"],
  七杀: ["七杀", "官杀", "官星"],
  正印: ["正印", "印星"],
  偏印: ["偏印", "印星"],
  正财: ["正财", "财星"],
  偏财: ["偏财", "财星"],
  比肩: ["比肩", "比劫"],
  劫财: ["劫财", "比劫"],
};

const CHINESE_NUMBERS = [
  "零", "一", "二", "三", "四",
  "五", "六", "七", "八", "九", "十",
];

export function sanitizeStageAiText({
  text,
  stage,
  trustedPack,
} = {}) {
  let output = String(text || "");
  const changes = [];

  const apply = (label, transformer) => {
    const before = output;
    output = transformer(output);
    if (output !== before) changes.push(label);
  };

  apply("中文术语清理", sanitizeCommonEnglish);
  apply("时间措辞降级", (value) =>
    sanitizeUnsupportedTiming(value, stage));
  apply("透干藏支纠正", (value) =>
    sanitizeTransparencyClaims(value, trustedPack));
  apply("同支与伏吟纠正", (value) =>
    sanitizePillarRepeatClaims(value, stage, trustedPack));
  apply("生克方向纠正", (value) =>
    sanitizeControlDirections(value, trustedPack));
  apply("具体剧情中性化", softenUnsupportedStories);
  apply("藏干表述纠正", sanitizeHiddenStemLanguage);
  apply("文本清理", cleanupText);

  return {
    text: output,
    changes: unique(changes),
  };
}

function sanitizeCommonEnglish(text) {
  return COMMON_TEXT_REPLACEMENTS.reduce(
    (result, [pattern, replacement]) =>
      result.replace(pattern, replacement),
    text,
  );
}

function sanitizeUnsupportedTiming(text, stage) {
  let output = text;

  if (stage === "luck") {
    output = output
      .replace(
        /(?:大运)?(?:起始阶段|早期|中期|后期|运末|前半段|后半段|前半程|后半程)/g,
        "此运中",
      )
      .replace(
        /[（(]?\d{4}\s*(?:[-—至~～到])\s*\d{4}(?:年)?(?:左右)?[）)]?/g,
        "",
      )
      .replace(/随着时间推移/g, "随着相关事项推进");
  }

  if (stage === "year") {
    output = output
      .replace(
        /年初至年中|年中至年底|上半年|下半年|年初|年中|年末|年底/g,
        "本年过程中",
      )
      .replace(
        /夏秋季|春季|夏季|秋季|冬季/g,
        "本年相关阶段",
      )
      .replace(/到了本年过程中/g, "在本年过程中");
  }

  if (stage === "month") {
    output = output
      .replace(
        /月初|月末|月尾|月底|上旬|中旬|下旬/g,
        "本月过程中",
      )
      .replace(/随着时间推移/g, "随着相关事项推进")
      .replace(/到了本月过程中/g, "在本月过程中");
  }

  return output
    .replace(/本年过程中本年过程中/g, "本年过程中")
    .replace(/本月过程中本月过程中/g, "本月过程中")
    .replace(/此运中此运中/g, "此运中");
}

function sanitizeTransparencyClaims(text, trustedPack) {
  let output = text;
  const exposedCounts = countExposedTenGods(trustedPack);
  const hiddenCounts = countHiddenTenGods(trustedPack);

  output = replaceCombinedTransparencyClaim(
    output, "食伤齐透", "食神", "伤官",
    exposedCounts, hiddenCounts,
  );
  output = replaceCombinedTransparencyClaim(
    output, "食伤双透", "食神", "伤官",
    exposedCounts, hiddenCounts,
  );
  output = replaceCombinedTransparencyClaim(
    output, "官杀齐透", "正官", "七杀",
    exposedCounts, hiddenCounts,
  );
  output = replaceCombinedTransparencyClaim(
    output, "财星齐透", "正财", "偏财",
    exposedCounts, hiddenCounts,
  );
  output = replaceCombinedTransparencyClaim(
    output, "印星齐透", "正印", "偏印",
    exposedCounts, hiddenCounts,
  );

  Object.keys(TEN_GOD_ALIASES).forEach((tenGod) => {
    const count = exposedCounts[tenGod] || 0;
    const pattern = new RegExp(
      `${escapeRegExp(tenGod)}(?:双|[一二三四五六七八九十两\\d]+)透`,
      "g",
    );

    if (!pattern.test(output)) return;
    pattern.lastIndex = 0;
    output = output.replace(
      pattern,
      exposedCountLabel(tenGod, count),
    );
  });

  return output;
}

function replaceCombinedTransparencyClaim(
  text,
  claim,
  firstTenGod,
  secondTenGod,
  exposedCounts,
  hiddenCounts,
) {
  if (!text.includes(claim)) return text;

  const firstExposed = exposedCounts[firstTenGod] || 0;
  const secondExposed = exposedCounts[secondTenGod] || 0;

  if (firstExposed > 0 && secondExposed > 0) {
    return text;
  }

  let replacement = `${firstTenGod}${secondTenGod}力量共同参与`;

  if (firstExposed >= 2 && secondExposed === 0) {
    replacement = `${firstTenGod}双透`;
    if ((hiddenCounts[secondTenGod] || 0) > 0) {
      replacement += `，${secondTenGod}藏支`;
    }
  } else if (secondExposed >= 2 && firstExposed === 0) {
    replacement = `${secondTenGod}双透`;
    if ((hiddenCounts[firstTenGod] || 0) > 0) {
      replacement += `，${firstTenGod}藏支`;
    }
  } else if (firstExposed === 1 && secondExposed === 0) {
    replacement = `${firstTenGod}透出`;
    if ((hiddenCounts[secondTenGod] || 0) > 0) {
      replacement += `，${secondTenGod}藏支`;
    }
  } else if (secondExposed === 1 && firstExposed === 0) {
    replacement = `${secondTenGod}透出`;
    if ((hiddenCounts[firstTenGod] || 0) > 0) {
      replacement += `，${firstTenGod}藏支`;
    }
  }

  return text.replaceAll(claim, replacement);
}

function exposedCountLabel(tenGod, count) {
  if (count <= 0) return `${tenGod}力量参与`;
  if (count === 1) return `${tenGod}透出`;
  if (count === 2) return `${tenGod}双透`;
  return `${tenGod}${toChineseNumber(count)}透`;
}

function sanitizePillarRepeatClaims(
  text,
  stage,
  trustedPack,
) {
  const layer =
    trustedPack?.mechanicalSignals?.layers?.[stage];

  const comparisons = array(layer?.natalComparisons);

  if (!comparisons.some(
    (entry) => entry?.sameBranch && !entry?.samePillar,
  )) {
    return text;
  }

  const stageWords = {
    luck: ["大运", "此运"],
    year: ["流年", "本年", "今年"],
    month: ["流月", "本月"],
  }[stage] || [];

  const targetLabels = {
    year: "年柱",
    month: "月柱",
    day: "日柱",
    hour: "时柱",
  };

  return text
    .split(/(?<=[。；！？\n])/)
    .map((sentence) => {
      if (
        !sentence.includes("伏吟") ||
        !stageWords.some((word) => sentence.includes(word))
      ) {
        return sentence;
      }

      const matched = comparisons.some((entry) => {
        if (!entry?.sameBranch || entry?.samePillar) {
          return false;
        }

        const label = targetLabels[entry?.targetPillar];
        return !label || sentence.includes(label);
      });

      return matched
        ? sentence.replaceAll("伏吟", "同支重复")
        : sentence;
    })
    .join("");
}

function sanitizeControlDirections(text, trustedPack) {
  let output = text;

  array(trustedPack?.relationFacts)
    .filter((fact) =>
      fact?.meta?.controller &&
      fact?.meta?.controlled)
    .forEach((fact) => {
      const controller = String(fact.meta.controller);
      const controlled = String(fact.meta.controlled);

      output = replaceStemDirection(
        output,
        controller,
        controlled,
      );

      const controllerTenGod =
        findTenGodForStem(controller, trustedPack);
      const controlledTenGod =
        findTenGodForStem(controlled, trustedPack);

      if (controllerTenGod && controlledTenGod) {
        output = replaceTenGodDirection(
          output,
          controllerTenGod,
          controlledTenGod,
        );
      }
    });

  return output;
}

function replaceStemDirection(text, controller, controlled) {
  const controllerPattern = escapeRegExp(controller);
  const controlledPattern = escapeRegExp(controlled);

  return text
    .replace(
      new RegExp(
        `${controlledPattern}[^，。；（）()\\n]{0,4}(?:克|克制|制约)[^，。；（）()\\n]{0,4}${controllerPattern}`,
        "g",
      ),
      `${controller}克${controlled}`,
    )
    .replace(
      new RegExp(
        `${controllerPattern}[^，。；（）()\\n]{0,4}被[^，。；（）()\\n]{0,4}${controlledPattern}[^，。；（）()\\n]{0,4}(?:克|克制|制约)`,
        "g",
      ),
      `${controller}克${controlled}`,
    );
}

function replaceTenGodDirection(
  text,
  controllerTenGod,
  controlledTenGod,
) {
  const controllerAliases =
    TEN_GOD_ALIASES[controllerTenGod] || [controllerTenGod];
  const controlledAliases =
    TEN_GOD_ALIASES[controlledTenGod] || [controlledTenGod];

  let output = text;

  controlledAliases.forEach((wrongActor) => {
    controllerAliases.forEach((wrongTarget) => {
      output = output.replace(
        new RegExp(
          `${escapeRegExp(wrongActor)}[^，。；\\n]{0,7}(?:克|克制|制约)[^，。；\\n]{0,7}${escapeRegExp(wrongTarget)}`,
          "g",
        ),
        `${controllerTenGod}制约${controlledTenGod}`,
      );

      output = output.replace(
        new RegExp(
          `${escapeRegExp(wrongTarget)}[^，。；\\n]{0,7}被[^，。；\\n]{0,7}${escapeRegExp(wrongActor)}[^，。；\\n]{0,5}(?:克|克制|制约)`,
          "g",
        ),
        `${controllerTenGod}制约${controlledTenGod}`,
      );
    });
  });

  return output;
}

function softenUnsupportedStories(text) {
  return STORY_SOFTENING_REPLACEMENTS.reduce(
    (result, [pattern, replacement]) =>
      result.replace(pattern, replacement),
    text,
  );
}

function sanitizeHiddenStemLanguage(text) {
  return text
    .replace(
      /藏干([甲乙丙丁戊己庚辛壬癸])(?:木|火|土|金|水)?透于地支/g,
      "藏干$1藏于地支",
    )
    .replace(/藏于地支中透出/g, "藏于地支")
    .replace(
      /藏干[^，。；\n]{0,12}透于地支/g,
      (matched) => matched.replace("透于地支", "藏于地支"),
    );
}

function cleanupText(text) {
  return text
    .replace(/，{2,}/g, "，")
    .replace(/。{2,}/g, "。")
    .replace(/(?:本年过程中){2,}/g, "本年过程中")
    .replace(/(?:本月过程中){2,}/g, "本月过程中")
    .replace(/(?:此运中){2,}/g, "此运中")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function countExposedTenGods(trustedPack) {
  const counts = {};

  array(trustedPack?.factualContext?.natal?.pillars)
    .forEach((pillar) => {
      increment(counts, pillar?.stemTenGod);
    });

  Object.values(
    trustedPack?.mechanicalSignals?.layers || {},
  )
    .filter(Boolean)
    .forEach((layer) => {
      increment(counts, layer?.stemTenGod);
    });

  return counts;
}

function countHiddenTenGods(trustedPack) {
  const counts = {};

  array(trustedPack?.factualContext?.natal?.pillars)
    .forEach((pillar) => {
      array(pillar?.hiddenStems).forEach(
        (entry) => increment(counts, entry?.tenGod),
      );
    });

  Object.values(
    trustedPack?.mechanicalSignals?.layers || {},
  )
    .filter(Boolean)
    .forEach((layer) => {
      array(layer?.hiddenStems).forEach(
        (entry) => increment(counts, entry?.tenGod),
      );
    });

  return counts;
}

function findTenGodForStem(stem, trustedPack) {
  const layer =
    Object.values(
      trustedPack?.mechanicalSignals?.layers || {},
    )
      .filter(Boolean)
      .find((entry) =>
        entry?.stem === stem && entry?.stemTenGod);

  if (layer?.stemTenGod) return layer.stemTenGod;

  const pillar =
    array(trustedPack?.factualContext?.natal?.pillars)
      .find((entry) =>
        entry?.stem === stem && entry?.stemTenGod);

  return pillar?.stemTenGod || "";
}

function increment(counts, key) {
  const normalized = String(key || "").trim();
  if (!normalized) return;
  counts[normalized] =
    Number(counts[normalized] || 0) + 1;
}

function toChineseNumber(value) {
  const number = Number(value);
  return CHINESE_NUMBERS[number] || String(number);
}

function unique(values) {
  return [...new Set(
    array(values)
      .map((value) => String(value || ""))
      .filter(Boolean),
  )];
}

function array(value) {
  return Array.isArray(value)
    ? value
    : value === undefined || value === null
      ? []
      : [value];
}

function escapeRegExp(value) {
  return String(value || "").replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&",
  );
}
