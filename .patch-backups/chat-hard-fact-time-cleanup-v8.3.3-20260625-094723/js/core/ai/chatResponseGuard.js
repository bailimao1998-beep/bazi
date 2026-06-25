import {
  stripRuleAudit,
  validateRuleAudit,
} from "./ruleAudit.js";

export {
  stripRuleAudit,
} from "./ruleAudit.js";

const CONDITIONAL_MARKERS = [
  "不一定", "未必", "不能确认", "尚不能", "尚未", "是否", "条件",
  "可能", "倾向", "有待", "需结合", "若", "如果", "才可", "初步",
];

const FORMAL_PATTERNS = [
  "食神制杀", "伤官配印", "杀印相生", "食神生财", "伤官生财",
  "财官印相生", "官印相生", "从财格", "从官格", "从杀格", "从儿格",
  "专旺格", "建禄格", "羊刃格",
];

const MEDICAL_TERMS = [
  "心血管", "神经系统", "生殖系统", "心脏", "血压", "肝胆", "肝脏",
  "胆囊", "脾胃", "肠胃", "肾脏", "肺部", "癌症", "肿瘤", "病变",
  "炎症", "口腔溃疡", "心跳加速",
];

const STANDARD_REQUIRED_HEADINGS = [
  "## 直接回答",
  "## 核心取象",
  "## 命理依据",
  "## 展开分析",
  "## 可能表现",
  "## 行动建议",
  "## 注意边界",
];

const CONCISE_REQUIRED_HEADINGS = [
  "## 直接回答",
  "## 核心取象",
  "## 行动建议",
  "## 注意边界",
];

const INTERNAL_RULE_ID_PATTERN =
  /\b(?:tg|pattern|rel|work|career|palace|transit|element|method|rule)_[a-z0-9_]+\b/gi;

export function validateChatResponse({ text = "", prompt = {} } = {}) {
  const rawResponse =
    String(
      text ??
      "",
    ).trim();
  const response =
    stripRuleAudit(
      rawResponse,
    ).trim();
  const payload =
    parsePromptPayload(
      prompt?.user,
    );
  const violations = [];

  if (!response) return { valid: false, violations: ["empty_response"], payload, ruleAudit: null };

  const intent = String(payload?.chatIntent ?? "");
  const isBaziQuestion =
    Boolean(
      payload
        ?.contextPlan
        ?.isBaziQuestion,
    ) ||
    (
      intent &&
      intent !==
        "free"
    );

  const ruleAuditValidation =
    validateRuleAudit({
      text:
        rawResponse,
      payload,
      isBaziQuestion,
    });

  ruleAuditValidation
    .violations
    .forEach(
      (violation) =>
        violations.push(
          violation,
        ),
    );

  validateFormalPatternsAgainstMatchedRules({
    response,
    payload,
  }).forEach(
    (violation) =>
      violations.push(
        violation,
      ),
  );

  if (isBaziQuestion) {
    requiredHeadingsFor(payload).forEach((heading) => {
      if (!response.includes(heading)) violations.push(`missing_heading:${heading}`);
    });
  }

  splitSentences(response).forEach((sentence) => {
    if (/化[木火土金水]/.test(sentence) && !hasConditionalMarker(sentence)) {
      violations.push(`unconfirmed_transformation:${sentence}`);
    }
    if (/合住/.test(sentence) && !hasConditionalMarker(sentence)) {
      violations.push(`overstated_combination:${sentence}`);
    }
    if (/(旺至极|身极旺|极弱|从格|假从|专旺)/.test(sentence) && !hasConditionalMarker(sentence)) {
      violations.push(`overstated_strength_or_following:${sentence}`);
    }
    if (FORMAL_PATTERNS.some((name) => sentence.includes(name)) && !hasConditionalMarker(sentence)) {
      violations.push(`formal_pattern_without_conditions:${sentence}`);
    }
  });

  const gender = String(payload?.natalHardFacts?.gender ?? "");
  if (gender === "男" && /(正官|七杀|官杀|官星).{0,20}(男友|丈夫)/.test(response)) {
    violations.push("male_official_spouse_mismatch");
  }
  if (gender === "女" && /(正财|偏财|财星).{0,20}(女友|妻子)/.test(response)) {
    violations.push("female_wealth_spouse_mismatch");
  }

  const age = Number(
    payload
      ?.subjectContext
      ?.referenceAge ??
    payload
      ?.subjectContext
      ?.age,
  );
  if (Number.isFinite(age)) {
    if (age >= 60 && /(升学|选专业|转专业|实习|初入职场|校园)/.test(response)) {
      violations.push("life_stage_scene_mismatch");
    }
    if (age < 16 && /(退休|养老|子女婚嫁|孙辈)/.test(response)) {
      violations.push("life_stage_scene_mismatch");
    }
  }

  validateNamedRelations({
    response,
    payload,
  }).forEach(
    (violation) =>
      violations.push(
        violation,
      ),
  );

  validateScannedYears({
    response,
    payload,
  }).forEach(
    (violation) =>
      violations.push(
        violation,
      ),
  );

  if (
    payload?.luckHardFacts
      ?.luckCycles
      ?.length >
      0 &&
    /(?:未获得|未提供|缺少).{0,12}大运/.test(
      response,
    )
  ) {
    violations.push(
      "false_missing_luck_data",
    );
  }

  if (
    payload?.natalHardFacts
      ?.pillars &&
    /(?:如获知|请提供|尚缺|未提供).{0,16}(?:出生时间|出生日期|四柱)/.test(
      response,
    )
  ) {
    violations.push(
      "false_missing_birth_data",
    );
  }

  if (
    hasCompleteNatalHardFacts(
      payload
        ?.natalHardFacts,
    ) &&
    /(?:缺少|未获得|未提供|没有).{0,18}(?:出生年月日时|八字原局|原局|四柱|日主)|无法进行任何个人化|无法生成人生画像/.test(
      response,
    )
  ) {
    violations.push(
      "false_missing_natal_data",
    );
  }

  if (
    payload?.chatIntent ===
      "multiYear" &&
    (
      !Array.isArray(
        payload
          ?.requestedYearFacts,
      ) ||
      payload
        .requestedYearFacts
        .length ===
        0
    )
  ) {
    violations.push(
      "multi_year_without_year_facts",
    );
  }

  if (payload?.luckTimelineForTargetYear?.isTransitionYear) {
    const hasExplicitSegmentation =
      /分段/.test(response) ||
      (/交运前/.test(response) && /交运后/.test(response));

    if (!hasExplicitSegmentation) {
      violations.push("transition_year_not_segmented");
    }
  }

  if (hasUnsupportedSpecificTiming(response, payload)) {
    violations.push("specific_timing_without_evidence");
  }

  const medicalHits = MEDICAL_TERMS.filter((term) => response.includes(term));
  if (medicalHits.length > 0) {
    violations.push(`specific_medical_claim:${medicalHits.join(",")}`);
  }

  if (/(一定|必然|注定|必定|肯定会)/.test(response)) {
    violations.push("absolute_claim");
  }

  const imagerySection =
    extractSection(
      response,
      "## 核心取象",
    );

  if (
    isBaziQuestion &&
    !/(主象|核心象)/.test(
      imagerySection,
    )
  ) {
    violations.push(
      "missing_primary_imagery",
    );
  }

  const eventSection =
    extractSection(
      response,
      "## 可能表现",
    );

  const eventItems =
    splitEventItems(
      eventSection,
    );

  const maxEventItems =
    payload
      ?.contextPlan
      ?.answerDepth ===
      "deep"
      ? 8
      : 3;

  if (
    eventItems.length >
      maxEventItems
  ) {
    violations.push(
      "too_many_event_possibilities",
    );
  }

  if (
    isBaziQuestion &&
    eventSection.trim() &&
    !/(依据|因为|来自|原局|大运|流年|流月)/.test(
      eventSection,
    )
  ) {
    violations.push(
      "event_section_missing_evidence",
    );
  }

  if (
    isBaziQuestion &&
    eventSection.trim() &&
    !/(成立条件|条件|前提|若|如果|现实中)/.test(
      eventSection,
    )
  ) {
    violations.push(
      "event_section_missing_condition",
    );
  }

  const adviceSection =
    extractSection(
      response,
      "## 行动建议",
    );

  if (
    isBaziQuestion &&
    !adviceSection.trim()
  ) {
    violations.push(
      "missing_action_advice",
    );
  }
  if (/包治|转运必成|保证发财|稳赚|替代就医|停止用药/.test(adviceSection)) {
    violations.push("unsafe_advice");
  }

  return {
    valid:
      violations.length ===
        0,
    violations:
      unique(
        violations,
      ),
    payload,
    ruleAudit:
      ruleAuditValidation
        .audit,
  };
}

export function buildChatRepairPrompt({ basePrompt = {}, draft = "", violations = [] } = {}) {
  return {
    ...basePrompt,
    system: [
      basePrompt.system,
      "",
      "上一轮回答未通过全局专业校验，请完整重写，不要只修一句。",
      "必须修复：",
      ...violations.map((item) => `- ${localizeViolation(item)}`),
      "",
      "重写要求：",
      "- 交运年按交运前后分段，不能把两步大运叠加成全年共同背景。",
      "- 正式格局、喜用和合化必须写完整成立依据；条件不全时降级为倾向。",
      "- 必须先写核心取象，至少明确主象，再写辅象、矛盾象、条件象和反证象。",
      "- 窄问题的可能表现最多三项；全面问题可以分领域展开，但必须有依据、条件和削弱因素。",
      "- 只能使用本次允许的匹配规则取象，严禁调用规则集之外的口诀、门派知识或自创关系。",
      "- 每个主象和重要判断必须同时绑定允许规则与硬事实；条件规则必须写清已检查条件。",
      "- 不要在正文中输出英文规则ID或内部字段；优先依据匹配规则和硬事实，规则不足时作保守补充推断。",
      "- 本地候选取象只作参考，必须用硬事实复核，不能照抄为确定事件。",
      "- 建议必须与可能表现对应，现实可执行、低风险。",
      "- 不输出纠错说明，只输出最终答案。",
    ].join("\n"),
    user: JSON.stringify({ originalRequest: parsePromptPayload(basePrompt.user), draftToRewrite: String(draft ?? "") }, null, 2),
  };
}

export function sanitizeChatResponse({ text = "", prompt = {} } = {}) {
  let output =
    stripRuleAudit(
      String(
        text ??
        "",
      ),
    );
  const payload = parsePromptPayload(prompt?.user);

  output = stripInternalRuleIds(
    output,
  );

  output = splitSentences(output).map((sentence) => {
    let next = sentence;
    if (/化[木火土金水]/.test(next) && !hasConditionalMarker(next)) {
      next = next.replace(/化([木火土金水])/g, "具备向$1气牵连的条件，但尚不能确认化$1");
    }
    if (/合住/.test(next) && !hasConditionalMarker(next)) {
      next = next.replace(/合住/g, "构成五合条件并产生牵连");
    }
    if (FORMAL_PATTERNS.some((name) => next.includes(name)) && !hasConditionalMarker(next)) {
      next = `从现有基础事实看，${next.replace(/[。；\n]+$/g, "")}更适合暂作结构倾向观察，尚不能直接定为正式格局。`;
    }
    if (MEDICAL_TERMS.some((term) => next.includes(term))) {
      return "健康方面不宜仅凭命盘指向具体器官、疾病或症状，宜关注压力、作息、安全并在不适时就医。";
    }
    return next;
  }).join("");

  if (hasUnsupportedSpecificTiming(output, payload)) {
    output = removeUnsupportedTiming(output, payload);
  }

  return stripInternalRuleIds(
    output,
  ).trim();
}

function requiredHeadingsFor(
  payload,
) {
  return payload
    ?.contextPlan
    ?.answerDepth ===
      "concise"
    ? CONCISE_REQUIRED_HEADINGS
    : STANDARD_REQUIRED_HEADINGS;
}

function stripInternalRuleIds(
  value,
) {
  return String(
    value ??
    "",
  )
    .replace(
      INTERNAL_RULE_ID_PATTERN,
      "相关取象规则",
    )
    .replace(
      /(?:规则|依据)\s*[（(]\s*相关取象规则\s*[）)]/g,
      "相关取象规则",
    )
    .replace(
      /相关取象规则\s*规则/g,
      "相关取象规则",
    )
    .replace(
      /[（(]\s*相关取象规则\s*[）)]/g,
      "",
    );
}

function validateFormalPatternsAgainstMatchedRules({
  response,
  payload,
} = {}) {
  const constraint =
    payload
      ?.imageryRulePack
      ?.ruleConstraint;

  if (
    constraint?.mode !==
      "closed_world"
  ) {
    return [];
  }

  const allowedRuleText =
    JSON.stringify(
      payload
        ?.imageryRulePack
        ?.matchedRules ??
      [],
    );

  return FORMAL_PATTERNS
    .filter(
      (pattern) =>
        String(
          response ??
          "",
        ).includes(
          pattern,
        ) &&
        !allowedRuleText.includes(
          pattern,
        ),
    )
    .map(
      (pattern) =>
        `formal_pattern_outside_matched_rules:${pattern}`,
    );
}

const RELATION_CLAIM_PATTERN =
  /([子丑寅卯辰巳午未申酉戌亥])(?:与|和|同)?([子丑寅卯辰巳午未申酉戌亥])(?:构成|形成|成|为|有|存在)?(?:地支)?(暗合|半合|六合|相冲|冲|相害|害|相破|破|自刑|相刑|刑|三合|三会|拱合|拱会)/g;

function validateNamedRelations({
  response,
  payload,
} = {}) {
  const allowed =
    collectAllowedNamedRelations(
      payload,
    );

  const violations = [];

  for (
    const matched of
      String(
        response ??
        "",
      ).matchAll(
        RELATION_CLAIM_PATTERN,
      )
  ) {
    const first =
      matched[1];

    const second =
      matched[2];

    const relation =
      normalizeRelationName(
        matched[3],
      );

    const key =
      relationKey({
        relation,
        branches: [
          first,
          second,
        ],
      });

    if (
      !allowed.has(
        key,
      )
    ) {
      violations.push(
        `unsupported_named_relation:${first}${second}${relation}`,
      );
    }
  }

  return unique(
    violations,
  );
}

function collectAllowedNamedRelations(
  value,
) {
  const allowed =
    new Set();

  walkObjects(
    value,
    (item) => {
      const relation =
        normalizeRelationName(
          item?.relation ??
          item?.label ??
          item?.type,
        );

      const branches =
        [
          ...(
            Array.isArray(
              item?.branches,
            )
              ? item.branches
              : []
          ),
          item?.currentBranch,
          item?.targetBranch,
          item?.natalBranch,
          item?.luckBranch,
          item?.yearBranch,
          item?.monthBranch,
        ]
          .filter(
            (branch) =>
              /^[子丑寅卯辰巳午未申酉戌亥]$/.test(
                String(
                  branch ??
                  "",
                ),
              ),
          );

      const uniqueBranches =
        [
          ...new Set(
            branches,
          ),
        ];

      if (
        relation &&
        uniqueBranches.length >=
          2
      ) {
        allowed.add(
          relationKey({
            relation,
            branches:
              uniqueBranches.slice(
                0,
                3,
              ),
          }),
        );
      }
    },
  );

  return allowed;
}

function validateScannedYears({
  response,
  payload,
} = {}) {
  const violations = [];

  const birthYear =
    Number(
      payload
        ?.subjectContext
        ?.birthYear,
    );

  const requestedYears =
    new Set(
      (
        Array.isArray(
          payload
            ?.requestedYears,
        )
          ? payload.requestedYears
          : []
      ).map(
        Number,
      ),
    );

  const relevantSections = [
    extractSection(
      response,
      "## 直接回答",
    ),
    extractSection(
      response,
      "## 可能表现",
    ),

    extractSection(
      response,
      "## 时间节奏",
    ),
    extractSection(
      response,
      "## 现实验证",
    ),
    extractSection(
      response,
      "## 行动建议",
    ),
  ].join(
    "\n",
  );

  const years =
    [
      ...new Set(
        (
          relevantSections.match(
            /(?:19|20)\d{2}/g,
          ) ??
          []
        ).map(
          Number,
        ),
      ),
    ];

  years.forEach(
    (year) => {
      if (
        Number.isFinite(
          birthYear,
        ) &&
        year <
          birthYear
      ) {
        violations.push(
          `year_before_birth:${year}`,
        );

        return;
      }

      if (
        payload?.chatIntent ===
          "multiYear" &&
        requestedYears.size >
          0 &&
        !requestedYears.has(
          year,
        )
      ) {
        violations.push(
          `year_outside_scan:${year}`,
        );
      }
    },
  );

  return unique(
    violations,
  );
}

function normalizeRelationName(
  value,
) {
  const text =
    String(
      value ??
      "",
    );

  if (
    /暗合/.test(
      text,
    )
  ) {
    return "暗合";
  }

  if (
    /半合/.test(
      text,
    )
  ) {
    return "半合";
  }

  if (
    /六合|branch_六合/.test(
      text,
    )
  ) {
    return "六合";
  }

  if (
    /三合/.test(
      text,
    )
  ) {
    return "三合";
  }

  if (
    /三会/.test(
      text,
    )
  ) {
    return "三会";
  }

  if (
    /拱合/.test(
      text,
    )
  ) {
    return "拱合";
  }

  if (
    /拱会/.test(
      text,
    )
  ) {
    return "拱会";
  }

  if (
    /自刑/.test(
      text,
    )
  ) {
    return "自刑";
  }

  if (
    /相冲|branch_冲|^冲$/.test(
      text,
    )
  ) {
    return "冲";
  }

  if (
    /相害|branch_害|^害$/.test(
      text,
    )
  ) {
    return "害";
  }

  if (
    /相破|branch_破|^破$/.test(
      text,
    )
  ) {
    return "破";
  }

  if (
    /相刑|branch_刑|^刑$/.test(
      text,
    )
  ) {
    return "刑";
  }

  return "";
}

function relationKey({
  relation,
  branches,
} = {}) {
  return [
    relation,
    ...[
      ...branches,
    ].sort(),
  ].join(
    ":",
  );
}

function walkObjects(
  value,
  callback,
) {
  if (
    Array.isArray(
      value,
    )
  ) {
    value.forEach(
      (item) =>
        walkObjects(
          item,
          callback,
        ),
    );

    return;
  }

  if (
    !value ||
    typeof value !==
      "object"
  ) {
    return;
  }

  callback(
    value,
  );

  Object.values(
    value,
  ).forEach(
    (item) =>
      walkObjects(
        item,
        callback,
      ),
  );
}


function hasCompleteNatalHardFacts(
  natalHardFacts,
) {
  const pillars =
    natalHardFacts?.pillars;

  if (
    !pillars ||
    typeof pillars !==
      "object"
  ) {
    return false;
  }

  return [
    "year",
    "month",
    "day",
    "hour",
  ].every(
    (key) => {
      const pillar =
        pillars[key];

      return Boolean(
        pillar &&
        (
          pillar.label ||
          (
            pillar.stem &&
            pillar.branch
          )
        ),
      );
    },
  ) &&
  Boolean(
    natalHardFacts
      ?.dayMaster,
  );
}

function hasUnsupportedSpecificTiming(response, payload) {
  const allowed = collectAllowedTimingTokens(payload);
  const candidates = [
    ...(response.match(/农历[一二三四五六七八九十\d]+月/g) ?? []),
    ...(response.match(/(?<!\d)(?:1[0-2]|[1-9])月/g) ?? []),
    ...(response.match(/(?:上半年|下半年|春季|夏季|秋季|冬季)/g) ?? []),
  ];
  return candidates.some((token) => !allowed.has(token));
}

function collectAllowedTimingTokens(payload) {
  const allowed = new Set();
  const transition = payload?.luckTimelineForTargetYear?.transitionAt;
  if (Number.isFinite(Number(transition?.month))) allowed.add(`${Number(transition.month)}月`);

  const months = [payload?.monthHardFacts, ...(Array.isArray(payload?.monthHardFactsList) ? payload.monthHardFactsList : [])];
  months.filter(Boolean).forEach((item) => {
    if (Number.isFinite(Number(item?.month))) allowed.add(`${Number(item.month)}月`);
    if (item?.flowMonthLabel) allowed.add(String(item.flowMonthLabel));
    if (item?.dateRangeLabel) allowed.add(String(item.dateRangeLabel));
  });
  return allowed;
}

function removeUnsupportedTiming(response, payload) {
  const allowed = collectAllowedTimingTokens(payload);
  return response
    .replace(/农历[一二三四五六七八九十\d]+月/g, (m) => allowed.has(m) ? m : "相关力量再次集中时")
    .replace(/(?<!\d)(?:1[0-2]|[1-9])月/g, (m) => allowed.has(m) ? m : "相关力量再次集中时")
    .replace(/(?:上半年|下半年|春季|夏季|秋季|冬季)/g, "本年相应阶段");
}

function splitEventItems(section) {
  if (!section.trim()) return [];
  const byHeading = section.split(/\n###\s+/).map((x) => x.trim()).filter(Boolean);
  if (byHeading.length > 1) return byHeading;
  return section.split(/(?:^|\n)(?=\d+[.、])/).map((x) => x.trim()).filter(Boolean);
}

function parsePromptPayload(value) {
  if (value && typeof value === "object") return value;
  try { return JSON.parse(String(value ?? "{}")); } catch { return {}; }
}

function splitSentences(value) {
  return String(value ?? "").match(/[^。！？；\n]+[。！？；\n]?/g) ?? [];
}

function hasConditionalMarker(sentence) {
  return CONDITIONAL_MARKERS.some((marker) => sentence.includes(marker));
}

function extractSection(text, heading) {
  const start = text.indexOf(heading);
  if (start < 0) return "";
  const rest = text.slice(start + heading.length);
  const next = rest.search(/\n##\s+/);
  return next < 0 ? rest : rest.slice(0, next);
}

function localizeViolation(value) {
  const text = String(value ?? "");
  const map = {
    empty_response: "回答为空",
    male_official_spouse_mismatch: "男命把官杀机械解释为男友或丈夫",
    female_wealth_spouse_mismatch: "女命把财星机械解释为女友或妻子",
    life_stage_scene_mismatch: "现实场景与年龄阶段不匹配",
    transition_year_not_segmented: "交运年份没有按交运前后分段",
    specific_timing_without_evidence: "使用了数据中不存在的具体时间",
    absolute_claim: "使用了绝对化结论",
    too_many_event_possibilities: "可能表现超过当前回答深度允许的数量",
    missing_primary_imagery: "缺少先取象步骤或没有明确主象",
    event_section_missing_evidence: "可能表现没有给出命理依据",
    event_section_missing_condition: "可能表现没有说明成立条件或现实前提",
    missing_action_advice: "缺少与判断对应的行动建议",
    unsafe_advice: "建议存在高风险或不当保证",
    false_missing_luck_data: "数据中已有大运，却错误声称缺少大运",
    false_missing_birth_data: "数据中已有四柱和出生信息，却要求用户重复提供",
    false_missing_natal_data: "数据中已有完整原局，却错误声称没有原局或无法生成人生画像",
    multi_year_without_year_facts: "跨年份问题没有实际加载逐年事实",
    missing_rule_audit: "缺少规则与硬事实绑定校验",
    invalid_rule_audit: "规则绑定校验格式无效",
    empty_rule_audit_claims: "规则绑定校验没有覆盖任何主象或重要判断",
  };
  if (text.startsWith("missing_heading:")) return `缺少结构：${text.slice(16)}`;
  if (text.startsWith("unconfirmed_transformation:")) return "把五合或化气条件写成已合化";
  if (text.startsWith("overstated_combination:")) return "把五合条件写成完全合住";
  if (text.startsWith("overstated_strength_or_following:")) return "旺衰、从格或专旺结论过度";
  if (text.startsWith("formal_pattern_without_conditions:")) return "正式格局名称缺少成立条件";
  if (text.startsWith("formal_pattern_outside_matched_rules:")) return "使用了本次匹配规则之外的正式结构";
  if (text.startsWith("rule_audit_claim_")) return "主象或重要判断没有正确绑定允许规则、硬事实或成立条件";
  if (text.startsWith("rule_audit_missing_time_layer:")) return "岁运判断没有绑定对应的大运、流年或流月时间层";
  if (text.startsWith("specific_medical_claim:")) return "给出了具体器官、疾病或症状判断";
  if (text.startsWith("event_missing_probability:")) return "主要显像缺少可能性等级";
  if (text.startsWith("event_missing_two_evidence:")) return "主要显像缺少两条独立依据";
  if (text.startsWith("event_missing_condition:")) return "主要显像缺少成立条件";
  if (text.startsWith("event_missing_counterevidence:")) return "主要显像缺少削弱因素或反证";
  if (text.startsWith("unsupported_named_relation:")) return "使用了系统机械关系白名单中不存在的干支关系";
  if (text.startsWith("year_outside_scan:")) return "引用了系统没有实际扫描的年份";
  if (text.startsWith("year_before_birth:")) return "引用了出生前的年份作为个人经历";
  return map[text] ?? text;
}

function unique(items) { return [...new Set(items)]; }
