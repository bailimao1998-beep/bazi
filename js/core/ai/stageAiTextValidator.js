const ABSOLUTE_PATTERNS = [
  /百分之百/,
  /注定/,
  /一定会/,
  /必然发生/,
  /必然结婚/,
];

const YEAR_TIMING_PATTERNS = [
  /年初/,
  /年中/,
  /年末/,
  /上半年/,
  /下半年/,
  /农历[一二三四五六七八九十冬腊\d]+月/,
  /(?:正|二|三|四|五|六|七|八|九|十|冬|腊)月/,
];

const MONTH_TIMING_PATTERNS = [
  /月初/,
  /月末/,
  /月底/,
  /上旬/,
  /中旬/,
  /下旬/,
  /具体日期/,
  /\d{1,2}日(?:前后|左右)?/,
];

const LUCK_TIMING_PATTERNS = [
  /大运初期/,
  /大运中期/,
  /大运后期/,
  /开始几年/,
  /前几年/,
  /后几年/,
  /前半程/,
  /后半程/,
  /前半段/,
  /后半段/,
  /随着时间推移/,
  /约\s*\d{1,2}\s*(?:[-—至~～到])\s*\d{1,2}\s*岁/,
];

const HIGH_SPECIFICITY_PATTERNS = [
  /被骗/,
  /被盗/,
  /诈骗/,
  /偷窃/,
  /掉链子/,
  /动机不纯/,
];

const SPOUSE_PALACE_ERROR_PATTERNS = [
  /月支[^，。；\n]{0,12}配偶宫/,
  /月柱[^，。；\n]{0,12}配偶宫/,
  /日支与月支[^，。；\n]{0,8}(?:均为|都是|同为)[^，。；\n]{0,4}配偶宫/,
];

const TEN_GOD_RELATION_ERROR_PATTERNS = [
  /(?:食神|伤官|食伤)[^，。；\n]{0,6}(?:合|六合)[^，。；\n]{0,6}(?:正财|偏财|财星|财)/,
  /(?:正财|偏财|财星)[^，。；\n]{0,6}(?:合|六合)[^，。；\n]{0,6}(?:食神|伤官|食伤)/,
];

const THREE_MEETING_SETS = [
  ["亥", "子", "丑"],
  ["寅", "卯", "辰"],
  ["巳", "午", "未"],
  ["申", "酉", "戌"],
];

const THREE_HARMONY_SETS = [
  ["申", "子", "辰"],
  ["寅", "午", "戌"],
  ["亥", "卯", "未"],
  ["巳", "酉", "丑"],
];

const RELATION_TERM_PATTERNS = [
  ["暗合", /暗合/],
  ["半合", /半合/],
  ["三合", /三合/],
  ["三会", /三会|会局/],
  ["冲", /六冲|相冲/],
  ["刑", /相刑/],
  ["害", /相害/],
  ["破", /相破/],
  ["合", /六合/],
];

const INTERNAL_FIELD_PATTERNS = [
  /\brelationFacts\b/i,
  /\brelationWhitelist\b/i,
  /\bmechanicalSignals\b/i,
  /\bevidenceConvergences\b/i,
  /\bmust_compare\b/i,
  /\bstandardsReview\b/i,
  /\bplanAndResults\b/i,
  /\boutputAndRules\b/i,
  /\bindependentEvidenceCount\b/i,
  /\bsourcePack\b/i,
  /\bcontroller\b/i,
  /\bcontrolled\b/i,
  /\bstage-ai-source\b/i,
  /\b[A-Za-z][A-Za-z0-9_]{2,}\b/,
];

const META_OPENING_PATTERNS = [
  /^好的[，,]/,
  /^已收到/,
  /^根据您提供的/,
  /^作为传统命理分析师/,
  /^以下是/,
  /符合所有校验要求/,
];

const DISALLOWED_SECTION_PATTERNS = [
  /^###\s*事情怎样发展\s*$/m,
  /^###\s*其他较弱影响\s*$/m,
];

const MAX_REPORT_LENGTH = {
  luck: 4200,
  year: 3400,
  month: 2600,
};

const QUALITY_ONLY_VIOLATION_PREFIXES = [
  "report_too_long:",
  "non_chinese_or_internal_term:",
  "meta_opening:",
  "redundant_section:",
  "repetitive_content:",
  "insufficient_primary_themes:",
  "missing_relationship_convergence_theme",
  "missing_standards_review_theme",
];

const FULL_PILLAR_REPEAT_PATTERNS = [
  /(?:流月|本月|流年|今年|大运)[^，。；\n]{0,36}(?:伏吟|整柱相同|干支完全相同|完全相同)/,
  /与原局(?:年|月|日|时)柱[^，。；\n]{0,24}(?:伏吟|整柱相同|干支完全相同|完全相同)/,
];

const HEALTH_PATTERNS = [
  /循环系统/,
  /内分泌/,
  /炎症/,
  /下焦/,
  /肠胃不适/,
  /心脏问题/,
  /肝脏问题/,
  /肾脏问题/,
];

const USE_GOD_PATTERNS = [
  /为用/,
  /用神/,
  /喜神/,
  /忌神/,
  /喜用/,
];

const FORMED_PATTERNS = [
  /已经合化/,
  /合化为[木火土金水]/,
  /已经成局/,
  /形成(?:三合|三会|六合)?局/,
];

const STEM_ELEMENT = {
  甲: "木",
  乙: "木",
  丙: "火",
  丁: "火",
  戊: "土",
  己: "土",
  庚: "金",
  辛: "金",
  壬: "水",
  癸: "水",
};

export function validateStageAiText({
  text,
  stage = "luck",
  trustedPack = null,
} = {}) {
  const normalized =
    String(
      text || "",
    ).trim();

  const hardViolations = [];

  const compactLength =
    normalized
      .replace(
        /\s+/g,
        "",
      )
      .length;

  const maxLength =
    MAX_REPORT_LENGTH[stage] ??
    MAX_REPORT_LENGTH.year;

  if (
    compactLength >
    maxLength
  ) {
    hardViolations.push(
      `report_too_long:${compactLength}:${maxLength}`,
    );
  }

  INTERNAL_FIELD_PATTERNS.forEach(
    (pattern) => {
      if (
        pattern.test(
          normalized,
        )
      ) {
        hardViolations.push(
          `non_chinese_or_internal_term:${pattern.source}`,
        );
      }
    },
  );

  META_OPENING_PATTERNS.forEach(
    (pattern) => {
      if (
        pattern.test(
          normalized,
        )
      ) {
        hardViolations.push(
          `meta_opening:${pattern.source}`,
        );
      }
    },
  );

  DISALLOWED_SECTION_PATTERNS.forEach(
    (pattern) => {
      if (
        pattern.test(
          normalized,
        )
      ) {
        hardViolations.push(
          `redundant_section:${pattern.source}`,
        );
      }
    },
  );

  hardViolations.push(
    ...detectRepetitiveContent(
      normalized,
    ),
  );

  if (!normalized) {
    hardViolations.push(
      "empty_response",
    );
  }

  const themeCount =
    countPrimaryThemes(
      normalized,
    );

  if (
    normalized &&
    themeCount < 2
  ) {
    hardViolations.push(
      `insufficient_primary_themes:${themeCount}`,
    );
  }

  ABSOLUTE_PATTERNS.forEach(
    (pattern) => {
      if (
        pattern.test(
          normalized,
        )
      ) {
        hardViolations.push(
          `absolute_claim:${pattern.source}`,
        );
      }
    },
  );

  HEALTH_PATTERNS.forEach(
    (pattern) => {
      if (
        pattern.test(
          normalized,
        ) &&
        !sourceMaterialIncludes(
          trustedPack,
          pattern,
        )
      ) {
        hardViolations.push(
          `unsupported_health_claim:${pattern.source}`,
        );
      }
    },
  );

  if (
    normalized.includes(
      "财库",
    ) &&
    !sourceMaterialIncludes(
      trustedPack,
      /财库/,
    )
  ) {
    hardViolations.push(
      "unsupported_treasury_claim",
    );
  }

  if (
    USE_GOD_PATTERNS.some(
      (pattern) =>
        pattern.test(
          normalized,
        ),
    ) &&
    !hasConfirmedUseGod(
      trustedPack,
    )
  ) {
    hardViolations.push(
      "unsupported_use_god_claim",
    );
  }

  if (
    FORMED_PATTERNS.some(
      (pattern) =>
        pattern.test(
          normalized,
        ),
    ) &&
    !hasFormedTransformation(
      trustedPack,
    )
  ) {
    hardViolations.push(
      "unsupported_formed_transformation",
    );
  }

  hardViolations.push(
    ...detectReversedControls(
      normalized,
      trustedPack,
    ),
  );

  hardViolations.push(
    ...detectUnsupportedFullPillarRepeat(
      normalized,
      stage,
      trustedPack,
    ),
  );

  hardViolations.push(
    ...detectMissingConvergenceThemes(
      normalized,
      trustedPack,
    ),
  );

  hardViolations.push(
    ...detectUnsupportedRelationClaims(
      normalized,
      trustedPack,
    ),
  );

  hardViolations.push(
    ...detectIncompleteCombinationClaims(
      normalized,
    ),
  );

  hardViolations.push(
    ...detectReversedTenGodControls(
      normalized,
      trustedPack,
    ),
  );

  HIGH_SPECIFICITY_PATTERNS.forEach(
    (pattern) => {
      if (
        pattern.test(
          normalized,
        )
      ) {
        hardViolations.push(
          `unsupported_specific_event:${pattern.source}`,
        );
      }
    },
  );

  SPOUSE_PALACE_ERROR_PATTERNS.forEach(
    (pattern) => {
      if (
        pattern.test(
          normalized,
        )
      ) {
        hardViolations.push(
          `invalid_spouse_palace:${pattern.source}`,
        );
      }
    },
  );

  TEN_GOD_RELATION_ERROR_PATTERNS.forEach(
    (pattern) => {
      if (
        pattern.test(
          normalized,
        )
      ) {
        hardViolations.push(
          `imprecise_ten_god_relation:${pattern.source}`,
        );
      }
    },
  );

  if (stage === "year") {
    YEAR_TIMING_PATTERNS.forEach(
      (pattern) => {
        if (
          pattern.test(
            normalized,
          )
        ) {
          hardViolations.push(
            `unsupported_year_timing:${pattern.source}`,
          );
        }
      },
    );
  }

  if (stage === "month") {
    MONTH_TIMING_PATTERNS.forEach(
      (pattern) => {
        if (
          pattern.test(
            normalized,
          )
        ) {
          hardViolations.push(
            `unsupported_month_timing:${pattern.source}`,
          );
        }
      },
    );
  }

  if (stage === "luck") {
    LUCK_TIMING_PATTERNS.forEach(
      (pattern) => {
        if (
          pattern.test(
            normalized,
          )
        ) {
          hardViolations.push(
            `unsupported_luck_timing:${pattern.source}`,
          );
        }
      },
    );

    const ageRanges =
      normalized.match(
        /\d{1,2}\s*(?:[-—至~～到])\s*\d{1,2}\s*岁/g,
      ) || [];

    if (
      ageRanges.length > 1
    ) {
      hardViolations.push(
        `unsupported_luck_age_segments:${ageRanges.join(",")}`,
      );
    }
  }

  const uniqueViolations = [
    ...new Set(
      hardViolations,
    ),
  ];

  const qualityWarnings =
    uniqueViolations.filter(
      isQualityOnlyViolation,
    );

  const blockingViolations =
    uniqueViolations.filter(
      (entry) =>
        !isQualityOnlyViolation(
          entry,
        ),
    );

  return {
    valid:
      Boolean(
        normalized,
      ) &&
      uniqueViolations
        .length === 0,

    safeToDisplay:
      Boolean(
        normalized,
      ),

    themeCount,
    compactLength,
    maxLength,

    hardViolations:
      uniqueViolations,

    blockingViolations,
    qualityWarnings,

    violations:
      uniqueViolations,

    warnings:
      uniqueViolations,
  };
}

export function buildStageAiRepairPrompt(
  prompt,
  validation,
) {
  const violations =
    Array.isArray(
      validation
        ?.hardViolations,
    ) &&
    validation
      .hardViolations
      .length
      ? validation
          .hardViolations
          .map(
            describeStageViolation,
          )
          .join("；")
      : "存在未识别的质量问题";

  return {
    ...prompt,
    system: [
      prompt?.system || "",
      "",
      "上一版报告未通过校验，请重新生成完整报告。",
      `需要修复：${violations}`,
      "主要主题至少写两个，不要把全部结构压缩成工作、合作或财务一个主题。",
      "对同一结构比较不同现实落点：最强可能详写，第二可能有独立证据才写，最弱可能省略。",
      "重新生成时只使用简体中文，不得抄写任何英文内部字段、代码名或下划线名称。",
      "删除寒暄、分析过程、“事情怎样发展”和“其他较弱影响”两节。",
      "保留有价值的故事和建议：每个主题写清核心判断、可能剧本、关键依据和应对建议。",
      "压缩的是重复内容，不是有效信息；同一依据只完整解释一次，但不要删掉主要剧本、替代可能和行动建议。",
      "不要增加无依据的具体事件，必须服从中文资料包中的确定关系、允许使用的关系、机械信号与证据汇合。",
      "不得发明暗合、六合、冲刑害破、三合或三会；只允许使用资料包已有关系。",
      "只有日支是配偶宫；不得把地支合改写成食神合财等十神关系。",
      "同支不等于整柱伏吟；没有流日数据不得拆分月初、上旬、中旬或下旬。",
      "没有逐年事实不得拆分大运初中后期、前后半程或具体年龄段。",
    ].join("\n"),
    user: [
      prompt?.user || "",
      "",
      "请重新生成报告，修复上述问题。",
    ].join("\n"),
  };
}

function isQualityOnlyViolation(
  violation,
) {
  const normalized =
    String(
      violation || "",
    );

  return QUALITY_ONLY_VIOLATION_PREFIXES.some(
    (prefix) =>
      normalized.startsWith(
        prefix,
      ),
  );
}

function describeStageViolation(
  violation,
) {
  const normalized =
    String(
      violation || "",
    );

  if (normalized.startsWith("report_too_long:")) {
    return "篇幅超过安全上限，需要删减重复内容，但保留主要剧本和建议";
  }

  if (normalized.startsWith("non_chinese_or_internal_term:")) {
    return "正文出现英文、代码名或内部字段，需要改成自然中文";
  }

  if (normalized.startsWith("meta_opening:")) {
    return "开头含有寒暄或校验说明，需要直接进入报告";
  }

  if (normalized.startsWith("redundant_section:")) {
    return "出现已经取消的重复章节，需要合并到主要主题或发展路径";
  }

  if (normalized.startsWith("repetitive_content:")) {
    return "存在高度重复的句子，需要合并同义内容";
  }

  if (normalized.startsWith("insufficient_primary_themes:")) {
    return "主要主题数量不足，需要补足彼此不同的核心主题";
  }

  if (normalized === "missing_relationship_convergence_theme") {
    return "感情与配偶关系证据较集中，需要作为独立候选主题比较";
  }

  if (normalized === "missing_standards_review_theme") {
    return "学业资格、规则审核或正式手续证据较集中，需要作为独立候选主题比较";
  }

  if (normalized.startsWith("unsupported_relation_claim:")) {
    return "使用了资料包中不存在的冲合刑害破关系，需要删除该关系";
  }

  if (normalized.startsWith("incomplete_three_meeting:")) {
    return "把未齐全的地支写成三会或会局，需要改成条件性描述";
  }

  if (normalized.startsWith("incomplete_three_harmony:")) {
    return "把未齐全的地支写成三合或合局，需要改成条件性描述";
  }

  if (
    normalized.startsWith("reversed_control:") ||
    normalized.startsWith("reversed_ten_god_control:")
  ) {
    return "生克方向写反，需要服从资料中的施克者和受克者";
  }

  if (normalized.startsWith("unsupported_year_timing:")) {
    return "没有流月依据却划分了年内时间，需要删除年初、年中、年底或月份判断";
  }

  if (normalized.startsWith("unsupported_month_timing:")) {
    return "没有流日依据却划分了月内时间，需要删除月初、上中下旬或具体日期判断";
  }

  if (
    normalized.startsWith("unsupported_luck_timing:") ||
    normalized.startsWith("unsupported_luck_age_segments:")
  ) {
    return "没有逐年依据却划分了大运前后阶段或具体年龄段，需要删除该时间切分";
  }

  if (normalized.startsWith("unsupported_full_pillar_repeat:")) {
    return "把同干或同支误写成整柱伏吟，需要按实际干支关系修改";
  }

  if (normalized.startsWith("invalid_spouse_palace:")) {
    return "把日支以外的位置称作配偶宫，需要改正";
  }

  if (normalized.startsWith("imprecise_ten_god_relation:")) {
    return "把地支关系改写成不存在的十神相合，需要按原始干支关系表述";
  }

  if (normalized.startsWith("unsupported_specific_event:")) {
    return "推断了过度具体且无直接依据的事件，需要改成条件性风险";
  }

  if (normalized.startsWith("absolute_claim:")) {
    return "使用了绝对化措辞，需要改成概率和条件表达";
  }

  if (normalized.startsWith("unsupported_health_claim:")) {
    return "出现无依据的具体健康判断，需要改成一般性的精力或节奏提示";
  }

  if (normalized === "unsupported_treasury_claim") {
    return "无明确财库事实却使用了财库结论，需要删除";
  }

  if (normalized === "unsupported_use_god_claim") {
    return "未确认喜用神却下了喜用结论，需要删除";
  }

  if (normalized === "unsupported_formed_transformation") {
    return "条件关系被写成已经合化或成局，需要改成未确认或条件性表述";
  }

  if (normalized === "empty_response") {
    return "返回内容为空，需要重新生成完整报告";
  }

  return "报告仍存在事实或表达问题，需要按资料包重新核对";
}

function detectRepetitiveContent(
  text,
) {
  const sentences =
    String(text || "")
      .split(
        /[。！？；\n]+/,
      )
      .map(
        (entry) =>
          normalizeSentence(
            entry,
          ),
      )
      .filter(
        (entry) =>
          entry.length >= 20,
      );

  for (
    let leftIndex = 0;
    leftIndex <
    sentences.length;
    leftIndex += 1
  ) {
    for (
      let rightIndex =
        leftIndex + 1;
      rightIndex <
        sentences.length;
      rightIndex += 1
    ) {
      const left =
        sentences[leftIndex];

      const right =
        sentences[rightIndex];

      if (
        left === right &&
        left.length >= 16
      ) {
        return [
          `repetitive_content:exact:${leftIndex + 1}:${rightIndex + 1}`,
        ];
      }

      if (
        left.length < 26 ||
        right.length < 26
      ) {
        continue;
      }

      const similarity =
        bigramJaccard(
          left,
          right,
        );

      if (
        similarity.score >=
          0.88 &&
        similarity.common >=
          12
      ) {
        return [
          `repetitive_content:similar:${leftIndex + 1}:${rightIndex + 1}`,
        ];
      }
    }
  }

  return [];
}

function normalizeSentence(
  value,
) {
  return String(
    value || "",
  )
    .replace(
      /^#{1,6}\s*/,
      "",
    )
    .replace(
      /^(?:结论|依据|补充|主要表现|次要可能|有利|风险)[:：]*/,
      "",
    )
    .replace(
      /[\s#*_\-—，,、：:（）()“”"'《》【】\[\]\d]/g,
      "",
    )
    .trim();
}

function bigramJaccard(
  left,
  right,
) {
  const leftSet =
    makeBigrams(left);

  const rightSet =
    makeBigrams(right);

  let common = 0;

  leftSet.forEach(
    (entry) => {
      if (
        rightSet.has(
          entry,
        )
      ) {
        common += 1;
      }
    },
  );

  const union =
    leftSet.size +
    rightSet.size -
    common;

  return {
    common,
    score:
      union > 0
        ? common / union
        : 0,
  };
}

function makeBigrams(
  value,
) {
  const set =
    new Set();

  for (
    let index = 0;
    index <
      value.length - 1;
    index += 1
  ) {
    set.add(
      value.slice(
        index,
        index + 2,
      ),
    );
  }

  return set;
}

function countPrimaryThemes(
  text,
) {
  const section =
    extractSection(
      text,
      "主要主题",
    );

  if (!section) {
    return 0;
  }

  const headingCount =
    (
      section.match(
        /^####\s+/gm,
      ) ||
      []
    ).length;

  if (
    headingCount > 0
  ) {
    return headingCount;
  }

  return (
    section.match(
      /^(?:\d+[.、]|[-*])\s+/gm,
    ) ||
    []
  ).length;
}

function extractSection(
  text,
  heading,
) {
  const startMarker =
    `### ${heading}`;

  const startIndex =
    text.indexOf(
      startMarker,
    );

  if (
    startIndex < 0
  ) {
    return "";
  }

  const contentStart =
    startIndex +
    startMarker.length;

  const remainder =
    text.slice(
      contentStart,
    );

  const nextSection =
    remainder.search(
      /\n###\s+/,
    );

  return nextSection >= 0
    ? remainder.slice(
        0,
        nextSection,
      )
    : remainder;
}

function detectReversedControls(
  text,
  trustedPack,
) {
  return array(
    trustedPack
      ?.relationFacts,
  )
    .filter(
      (fact) =>
        fact?.meta
          ?.controller &&
        fact?.meta
          ?.controlled,
    )
    .flatMap((fact) => {
      const controller =
        String(
          fact.meta
            .controller,
        );

      const controlled =
        String(
          fact.meta
            .controlled,
        );

      const controllerElement =
        STEM_ELEMENT[
          controller
        ] ||
        "";

      const controlledElement =
        STEM_ELEMENT[
          controlled
        ] ||
        "";

      const reversed =
        new RegExp(
          `${escapeRegExp(controlled)}${controlledElement}?` +
          `[^，。；\\n]{0,10}(?:克制|克|制约)` +
          `[^，。；\\n]{0,10}` +
          `${escapeRegExp(controller)}${controllerElement}?`,
        );

      return reversed.test(
        text,
      )
        ? [
            `reversed_control:${controlled}->${controller}`,
          ]
        : [];
    });
}

function detectUnsupportedFullPillarRepeat(
  text,
  stage,
  trustedPack,
) {
  const mentionsFullRepeat =
    FULL_PILLAR_REPEAT_PATTERNS.some(
      (pattern) =>
        pattern.test(
          text,
        ),
    );

  if (
    !mentionsFullRepeat
  ) {
    return [];
  }

  const targetGanZhi =
    String(
      trustedPack
        ?.target
        ?.ganZhi ||
      "",
    ).trim();

  const natalGanZhi =
    array(
      trustedPack
        ?.factualContext
        ?.natal
        ?.pillars,
    )
      .map(
        (pillar) =>
          String(
            pillar
              ?.ganZhi ||
            "",
          ).trim(),
      )
      .filter(Boolean);

  if (
    targetGanZhi &&
    natalGanZhi.includes(
      targetGanZhi,
    )
  ) {
    return [];
  }

  return [
    `unsupported_full_pillar_repeat:${stage}:${targetGanZhi || "unknown"}`,
  ];
}


function detectMissingConvergenceThemes(
  text,
  trustedPack,
) {
  const section =
    extractSection(
      text,
      "主要主题",
    ) ||
    text;

  const convergences =
    trustedPack
      ?.evidenceConvergences ||
    {};

  const violations = [];

  if (
    convergences
      ?.relationship
      ?.priority ===
      "must_compare" &&
    !/(感情|恋爱|婚姻|异性|配偶|桃花|缘分)/.test(
      section,
    )
  ) {
    violations.push(
      "missing_relationship_convergence_theme",
    );
  }

  if (
    convergences
      ?.standardsReview
      ?.priority ===
      "must_compare" &&
    !/(学业|考试|资格|审核|认证|论文|申请|手续|规则|标准)/.test(
      section,
    )
  ) {
    violations.push(
      "missing_standards_review_theme",
    );
  }

  return violations;
}

function detectUnsupportedRelationClaims(
  text,
  trustedPack,
) {
  const whitelist =
    array(
      trustedPack
        ?.relationWhitelist,
    );

  const sentences =
    String(text || "")
      .split(
        /[。；\n]+/,
      )
      .map(
        (value) =>
          value.trim(),
      )
      .filter(Boolean);

  const violations = [];

  sentences.forEach(
    (sentence) => {
      const branches =
        uniqueText(
          sentence.match(
            /[子丑寅卯辰巳午未申酉戌亥]/g,
          ) ||
          [],
        );

      if (
        branches.length !== 2
      ) {
        return;
      }

      const kinds =
        extractClaimedRelationKinds(
          sentence,
        );

      kinds.forEach(
        (kind) => {
          if (
            !isRelationWhitelisted(
              branches,
              kind,
              whitelist,
            )
          ) {
            violations.push(
              `unsupported_relation_claim:${branches.join("")}:${kind}`,
            );
          }
        },
      );
    },
  );

  return violations;
}

function extractClaimedRelationKinds(
  sentence,
) {
  const kinds = [];

  RELATION_TERM_PATTERNS.forEach(
    ([kind, pattern]) => {
      pattern.lastIndex = 0;

      if (
        pattern.test(
          sentence,
        )
      ) {
        kinds.push(
          kind,
        );
      }
    },
  );

  const compactMatch =
    sentence.match(
      /([子丑寅卯辰巳午未申酉戌亥])([子丑寅卯辰巳午未申酉戌亥])(?:相)?(合|冲|刑|害|破)/,
    );

  if (
    compactMatch
  ) {
    kinds.push(
      compactMatch[3] ===
        "合"
        ? "合"
        : compactMatch[3],
    );
  }

  return uniqueText(kinds);
}

function isRelationWhitelisted(
  branches,
  claimedKind,
  whitelist,
) {
  const expected =
    [...branches].sort();

  return array(whitelist)
    .some((entry) => {
      const actual =
        array(
          entry?.branches,
        )
          .slice()
          .sort();

      if (
        actual.length < 2 ||
        actual[0] !==
          expected[0] ||
        actual[1] !==
          expected[1]
      ) {
        return false;
      }

      const allowedKind =
        String(
          entry?.kind ||
          "",
        );

      if (
        claimedKind ===
        "合"
      ) {
        return [
          "合",
          "半合",
          "三合",
          "三会",
        ].includes(
          allowedKind,
        );
      }

      return (
        allowedKind ===
        claimedKind
      );
    });
}

function detectIncompleteCombinationClaims(
  text,
) {
  const sentences =
    String(text || "")
      .split(
        /[。；\n]+/,
      )
      .map(
        (value) =>
          value.trim(),
      )
      .filter(Boolean);

  const violations = [];

  sentences.forEach(
    (sentence) => {
      if (
        /未成局|尚未成局|条件未成|不得成局/.test(
          sentence,
        )
      ) {
        return;
      }

      const branches =
        uniqueText(
          sentence.match(
            /[子丑寅卯辰巳午未申酉戌亥]/g,
          ) ||
          [],
        );

      if (
        /三会|三会之势|会局/.test(
          sentence,
        ) &&
        !containsCompleteSet(
          branches,
          THREE_MEETING_SETS,
        )
      ) {
        violations.push(
          `incomplete_three_meeting:${branches.join("") || "none"}`,
        );
      }

      if (
        /三合|三合局|形成[木火土金水]局|合局/.test(
          sentence,
        ) &&
        !containsCompleteSet(
          branches,
          THREE_HARMONY_SETS,
        )
      ) {
        violations.push(
          `incomplete_three_harmony:${branches.join("") || "none"}`,
        );
      }
    },
  );

  return violations;
}

function containsCompleteSet(
  branches,
  sets,
) {
  return array(sets)
    .some(
      (set) =>
        set.every(
          (branch) =>
            array(branches)
              .includes(
                branch,
              ),
        ),
    );
}

function detectReversedTenGodControls(
  text,
  trustedPack,
) {
  const layers =
    trustedPack
      ?.mechanicalSignals
      ?.layers ||
    {};

  const pillarData =
    array(
      trustedPack
        ?.factualContext
        ?.natal
        ?.pillars,
    );

  const violations = [];

  array(
    trustedPack
      ?.relationFacts,
  )
    .filter(
      (fact) =>
        fact?.meta
          ?.controller &&
        fact?.meta
          ?.controlled,
    )
    .forEach((fact) => {
      const controller =
        String(
          fact.meta
            .controller,
        );

      const controlled =
        String(
          fact.meta
            .controlled,
        );

      const controllerTenGod =
        findTenGodForStem(
          controller,
          layers,
          pillarData,
        );

      const controlledTenGod =
        findTenGodForStem(
          controlled,
          layers,
          pillarData,
        );

      if (
        !controllerTenGod ||
        !controlledTenGod
      ) {
        return;
      }

      const controllerAliases =
        tenGodAliases(
          controllerTenGod,
        );

      const controlledAliases =
        tenGodAliases(
          controlledTenGod,
        );

      const reversedActive =
        buildAliasControlRegex(
          controlledAliases,
          controllerAliases,
          false,
        );

      const reversedPassive =
        buildAliasControlRegex(
          controllerAliases,
          controlledAliases,
          true,
        );

      if (
        reversedActive.test(
          text,
        ) ||
        reversedPassive.test(
          text,
        )
      ) {
        violations.push(
          `reversed_ten_god_control:${controlledTenGod}->${controllerTenGod}`,
        );
      }
    });

  return violations;
}

function findTenGodForStem(
  stem,
  layers,
  pillars,
) {
  const layerMatch =
    Object.values(
      layers,
    ).find(
      (entry) =>
        entry?.stem ===
        stem &&
        entry
          ?.stemTenGod,
    );

  if (
    layerMatch
      ?.stemTenGod
  ) {
    return layerMatch
      .stemTenGod;
  }

  const pillarMatch =
    array(pillars).find(
      (pillar) =>
        pillar?.stem ===
          stem &&
        pillar
          ?.stemTenGod,
    );

  return pillarMatch
    ?.stemTenGod ||
    "";
}

function tenGodAliases(
  tenGod,
) {
  const groups = {
    食神: [
      "食神",
      "食伤",
    ],
    伤官: [
      "伤官",
      "食伤",
    ],
    正官: [
      "正官",
      "官星",
      "官杀",
    ],
    七杀: [
      "七杀",
      "官杀",
      "官星",
    ],
    正印: [
      "正印",
      "印星",
    ],
    偏印: [
      "偏印",
      "印星",
    ],
    正财: [
      "正财",
      "财星",
    ],
    偏财: [
      "偏财",
      "财星",
    ],
    比肩: [
      "比肩",
      "比劫",
    ],
    劫财: [
      "劫财",
      "比劫",
    ],
  };

  return groups[tenGod] ||
    [tenGod];
}

function buildAliasControlRegex(
  actorAliases,
  targetAliases,
  passive,
) {
  const actor =
    `(?:${array(actorAliases)
      .map(
        escapeRegExp,
      )
      .join("|")})`;

  const target =
    `(?:${array(targetAliases)
      .map(
        escapeRegExp,
      )
      .join("|")})`;

  if (passive) {
    return new RegExp(
      `${actor}[^，。；\\n]{0,8}被[^，。；\\n]{0,8}${target}[^，。；\\n]{0,6}(?:克制|克|制约)`,
    );
  }

  return new RegExp(
    `${actor}[^，。；\\n]{0,8}(?:克制|克|制约)[^，。；\\n]{0,8}${target}`,
  );
}

function uniqueText(
  values,
) {
  return [
    ...new Set(
      array(values)
        .map(
          (value) =>
            String(
              value ||
              "",
            ),
        )
        .filter(Boolean),
    ),
  ];
}

function hasConfirmedUseGod(
  trustedPack,
) {
  const material = [
    trustedPack
      ?.candidateInterpretations
      ?.natalStructure,
    trustedPack
      ?.candidateInterpretations
      ?.natalSummary,
    ...array(
      trustedPack
        ?.candidateInterpretations
        ?.natalImages,
    ),
  ];

  const serialized =
    JSON.stringify(
      material,
    );

  if (
    /尚未确认|未确认|待确认|证据不足/.test(
      serialized,
    )
  ) {
    return false;
  }

  return /用神|喜用|喜神|忌神/.test(
    serialized,
  );
}

function hasFormedTransformation(
  trustedPack,
) {
  return array(
    trustedPack
      ?.relationFacts,
  ).some((fact) => {
    const formation =
      String(
        fact?.meta
          ?.formationStatus ||
        "",
      );

    const transformation =
      String(
        fact?.meta
          ?.transformationStatus ||
        "",
      );

    return (
      formation ===
        "formed" ||
      transformation ===
        "formed"
    );
  });
}

function sourceMaterialIncludes(
  trustedPack,
  pattern,
) {
  const material = [
    ...array(
      trustedPack
        ?.relationFacts,
    ),
    trustedPack
      ?.mechanicalSignals,
    trustedPack
      ?.candidateInterpretations
      ?.natalStructure,
    trustedPack
      ?.candidateInterpretations
      ?.natalSummary,
    ...array(
      trustedPack
        ?.candidateInterpretations
        ?.natalImages,
    ),
  ]
    .filter(Boolean)
    .map((entry) =>
      typeof entry ===
      "string"
        ? entry
        : JSON.stringify(
            entry,
          ),
    )
    .join("\n");

  pattern.lastIndex = 0;

  return pattern.test(
    material,
  );
}

function escapeRegExp(
  value,
) {
  return String(
    value,
  ).replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&",
  );
}

function array(value) {
  return Array.isArray(
    value,
  )
    ? value
    : value ===
          undefined ||
        value === null
      ? []
      : [value];
}
