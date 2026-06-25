const STEMS = [..."甲乙丙丁戊己庚辛壬癸"];
const BRANCHES = [..."子丑寅卯辰巳午未申酉戌亥"];

const STEM_META = {
  甲: { element: "木", yang: true },
  乙: { element: "木", yang: false },
  丙: { element: "火", yang: true },
  丁: { element: "火", yang: false },
  戊: { element: "土", yang: true },
  己: { element: "土", yang: false },
  庚: { element: "金", yang: true },
  辛: { element: "金", yang: false },
  壬: { element: "水", yang: true },
  癸: { element: "水", yang: false },
};

const BRANCH_MAIN_STEM = {
  子: "癸",
  丑: "己",
  寅: "甲",
  卯: "乙",
  辰: "戊",
  巳: "丙",
  午: "丁",
  未: "己",
  申: "庚",
  酉: "辛",
  戌: "戊",
  亥: "壬",
};

const GENERATES = {
  木: "火",
  火: "土",
  土: "金",
  金: "水",
  水: "木",
};

const CONTROLS = {
  木: "土",
  土: "水",
  水: "火",
  火: "金",
  金: "木",
};

const TEN_GODS = [
  "比肩", "劫财", "正印", "偏印", "食神", "伤官", "正财", "偏财", "正官", "七杀",
];

const CANONICAL_RELATIONS = new Set([
  "天干十神",
  "地支主气十神",
  "天干五合",
  "天干相克",
  "六合",
  "冲",
  "刑",
  "自刑",
  "害",
  "破",
  "半合条件",
  "拱合条件",
  "三合局条件",
  "三会两支",
  "拱会条件",
  "三会局条件",
  "伏吟",
  "天干同现",
  "地支同现",
  "天克地冲",
]);

const CONDITIONAL_RELATIONS = new Set([
  "半合条件",
  "拱合条件",
  "三合局条件",
  "三会两支",
  "拱会条件",
  "三会局条件",
]);

const HEALTH_SENSITIVE_TERMS = [
  "心脑血管", "心血管", "脑血管", "肾脏", "肾", "泌尿系统", "肝脏", "肝", "肺部", "肺",
  "脾胃", "胃病", "甲状腺", "妇科", "男科", "精神疾病", "抑郁症", "焦虑症", "失眠症",
];

const FAMILY_SPECIFIC_TERMS = [
  "祖产", "祖业", "祖上资源", "家族资源", "遗产", "房产分配", "长辈资源", "长辈支持",
];

const YOUTH_LOW_PRIORITY_TERMS = [
  "晚年", "孙辈", "子女教育", "子女事务", "下属关系", "晚辈关系",
];

export function normalizeGender(value) {
  const normalized = text(value).toLowerCase();
  if (["male", "m", "man", "boy", "男", "男命"].includes(normalized)) return "male";
  if (["female", "f", "woman", "girl", "女", "女命"].includes(normalized)) return "female";
  return "unknown";
}

export function computeTenGod(dayMaster, targetStem) {
  const day = STEM_META[text(dayMaster)];
  const target = STEM_META[text(targetStem)];
  if (!day || !target) return "";

  const samePolarity = day.yang === target.yang;
  if (day.element === target.element) return samePolarity ? "比肩" : "劫财";
  if (GENERATES[target.element] === day.element) return samePolarity ? "偏印" : "正印";
  if (GENERATES[day.element] === target.element) return samePolarity ? "食神" : "伤官";
  if (CONTROLS[day.element] === target.element) return samePolarity ? "偏财" : "正财";
  if (CONTROLS[target.element] === day.element) return samePolarity ? "七杀" : "正官";
  return "";
}

export function branchMainStem(branch) {
  return BRANCH_MAIN_STEM[text(branch)] || "";
}

export function normalizePillarTenGod(pillar, dayMaster) {
  if (!pillar || typeof pillar !== "object") return pillar;
  const stem = text(pillar.stem);
  const branch = text(pillar.branch);
  const mainStem = branchMainStem(branch);
  const expectedStemTenGod = computeTenGod(dayMaster, stem);
  const expectedBranchMainTenGod = computeTenGod(dayMaster, mainStem);
  return {
    ...pillar,
    reportedStemTenGod: text(pillar.stemTenGod),
    reportedBranchMainTenGod: text(pillar.branchMainTenGod),
    stemTenGod: expectedStemTenGod || text(pillar.stemTenGod),
    branchMainTenGod: expectedBranchMainTenGod || text(pillar.branchMainTenGod),
    branchMainStem: mainStem,
  };
}

export function canonicalizeStructureFact(fact = {}) {
  const type = text(fact.type).toLowerCase();
  const originalRelation = text(fact.relation || fact.label || fact.type || "结构关系");
  const members = normalizeMembers(fact?.meta?.members || fact?.members || fact?.tags);
  let relation = originalRelation;

  if (/stem.*(combine|combination)|heavenly.*combine/.test(type)) relation = "天干五合";
  else if (/stem.*(control|克)|heavenly.*control/.test(type)) relation = "天干相克";
  else if (/six.*harmony|branch.*combine/.test(type)) relation = "六合";
  else if (/clash|冲/.test(type)) relation = "冲";
  else if (/self.*punish|自刑/.test(type)) relation = "自刑";
  else if (/punish|刑/.test(type)) relation = "刑";
  else if (/harm|害|穿/.test(type)) relation = "害";
  else if (/break|破/.test(type)) relation = "破";
  else if (/half.*harmony/.test(type)) relation = "半合条件";
  else if (/arch.*harmony/.test(type)) relation = "拱合条件";
  else if (/triple.*harmony/.test(type)) relation = "三合局条件";
  else if (/partial.*meeting/.test(type)) relation = "三会两支";
  else if (/arch.*meeting/.test(type)) relation = "拱会条件";
  else if (/triple.*meeting/.test(type)) relation = "三会局条件";
  else if (/heaven.*earth.*clash/.test(type)) relation = "天克地冲";
  else if (/repetition|伏吟/.test(type) && originalRelation.includes("伏吟")) relation = "伏吟";

  if (originalRelation === "半合") relation = "半合条件";
  if (originalRelation === "拱合") relation = "拱合条件";
  if (originalRelation === "三合") relation = "三合局条件";
  if (originalRelation === "三会" || originalRelation === "半会") relation = "三会两支";

  const meta = { ...(fact.meta || {}) };
  if (relation === "刑") {
    if (sameMembers(members, ["子", "卯"])) meta.punishmentName = "无礼之刑";
    if (containsAll(members, ["丑", "戌", "未"])) meta.punishmentName = "无恩之刑";
    if (containsAll(members, ["寅", "巳", "申"])) meta.punishmentName = "恃势之刑";
  }

  const conditional = CONDITIONAL_RELATIONS.has(relation)
    || ["condition_only", "arch_condition", "unresolved", "conditional"].includes(text(fact.status));

  return {
    ...fact,
    relation,
    status: conditional ? normalizeConditionalStatus(fact.status) : text(fact.status || "direct"),
    certainty: conditional ? "conditional" : "direct",
    meta,
  };
}

export function validateRawFactPack(rawFactPack = {}) {
  const errors = [];
  const warnings = [];
  const natal = rawFactPack?.natal || {};
  const gender = normalizeGender(natal.gender);
  const dayMaster = text(natal.dayMaster);
  const pillars = array(natal.pillars);

  if (gender === "unknown") errors.push("命盘性别缺失或无法识别");
  if (!STEMS.includes(dayMaster)) errors.push("日主缺失或不是有效天干");
  if (pillars.length !== 4) errors.push("原局四柱不完整");

  pillars.forEach((pillar, index) => {
    const label = text(pillar?.name || ["年柱", "月柱", "日柱", "时柱"][index]);
    if (!STEMS.includes(text(pillar?.stem)) || !BRANCHES.includes(text(pillar?.branch))) {
      errors.push(`${label}干支不完整`);
      return;
    }
    validateTenGodFields({ pillar, dayMaster, label, errors });
  });

  Object.values(rawFactPack?.layers || {}).filter(Boolean).forEach((pillar) => {
    validateTenGodFields({
      pillar,
      dayMaster,
      label: text(pillar?.displayName || pillar?.level || "岁运层"),
      errors,
    });
  });

  array(rawFactPack?.facts).forEach((fact) => {
    if (!text(fact?.id)) errors.push("存在缺少ID的岁运事实");
    if (fact?.kind === "ten_god") {
      const expected = fact?.type === "branch_ten_god"
        ? computeTenGod(dayMaster, branchMainStem(fact.char))
        : computeTenGod(dayMaster, fact.char);
      if (expected && text(fact?.tenGod) !== expected) {
        errors.push(`${fact.char}十神应为${expected}，当前为${text(fact?.tenGod) || "空"}`);
      }
      return;
    }
    if (fact?.kind === "structure" && !CANONICAL_RELATIONS.has(text(fact?.relation))) {
      warnings.push(`结构关系“${text(fact?.relation)}”尚未进入标准词表`);
    }
    if (CONDITIONAL_RELATIONS.has(text(fact?.relation)) && fact?.certainty !== "conditional") {
      errors.push(`${text(fact?.relation)}必须标记为条件事实`);
    }
  });

  return {
    usable: errors.length === 0,
    errors: unique(errors),
    warnings: unique(warnings),
    checkedAt: "build-time",
  };
}

export function filterEligibleRules(rules, { rawFactPack = {}, stage = "luck" } = {}) {
  const gender = normalizeGender(rawFactPack?.natal?.gender);
  const age = numberOrNull(rawFactPack?.natal?.ageAtTarget);
  const eligible = [];
  const excluded = [];

  array(rules).forEach((rule) => {
    const reasons = [];
    const scopes = unique(array(rule?.scopes));
    const genderScope = normalizeGenderScope(rule);
    const ageScope = normalizeAgeScope(rule?.ageScope);
    const ruleText = collectRuleText(rule);

    if (scopes.length && !scopes.includes("all") && !scopes.includes(stage) && !scopes.includes("natal")) {
      reasons.push(`不适用于${stage}`);
    }
    if (genderScope.length && gender !== "unknown" && !genderScope.includes(gender)) {
      reasons.push("性别不适用");
    }
    if (gender === "male" && /(女命|夫星|官杀为夫)/.test(ruleText)) reasons.push("女命专用规则");
    if (gender === "female" && /(男命|妻星|财星为妻)/.test(ruleText)) reasons.push("男命专用规则");
    if (age !== null && ageScope.min !== null && age < ageScope.min) reasons.push("低于规则年龄范围");
    if (age !== null && ageScope.max !== null && age > ageScope.max) reasons.push("高于规则年龄范围");

    if (reasons.length) {
      excluded.push({ id: text(rule?.id), title: text(rule?.title), reasons: unique(reasons) });
    } else {
      eligible.push(rule);
    }
  });

  return { eligible, excluded };
}

export function sanitizeCandidateForProfile(candidate, rawFactPack = {}) {
  const age = numberOrNull(rawFactPack?.natal?.ageAtTarget);
  const gender = normalizeGender(rawFactPack?.natal?.gender);
  const filterTextList = (values) => unique(array(values)).filter((value) => {
    if (gender === "male" && /(女命|夫星|官杀为夫)/.test(value)) return false;
    if (gender === "female" && /(男命|妻星|财星为妻)/.test(value)) return false;
    if (age !== null && age < 35 && containsAny(value, YOUTH_LOW_PRIORITY_TERMS)) return false;
    return true;
  });

  return {
    ...candidate,
    allowedMeanings: filterTextList(candidate?.allowedMeanings),
    positive: filterTextList(candidate?.positive),
    risks: filterTextList(candidate?.risks),
    allowedScenes: filterTextList(candidate?.allowedScenes),
    advice: filterTextList(candidate?.advice),
    profileConstraints: {
      gender,
      age,
      youthLowPriorityScenesRemoved: age !== null && age < 35,
    },
  };
}

export function validateReportSemantics({ report, stage = "luck", rawFactPack = {}, candidatePack = {} } = {}) {
  const issues = [];
  const visibleText = collectVisibleText(report);
  const gender = normalizeGender(rawFactPack?.natal?.gender);
  const age = numberOrNull(rawFactPack?.natal?.ageAtTarget);
  const exposedTenGods = new Set(collectExposedTenGods(rawFactPack));
  const candidateText = JSON.stringify(candidatePack?.candidateImages || []);

  if (gender === "male" && /(女命|官杀为夫星|夫星合身|女命以官杀)/.test(visibleText)) {
    issues.push("男命报告误用了女命夫星规则");
  }
  if (gender === "female" && /(男命|财星为妻星|妻星合身|男命以财星)/.test(visibleText)) {
    issues.push("女命报告误用了男命妻星规则");
  }

  TEN_GODS.forEach((tenGod) => {
    const pattern = new RegExp(`${tenGod}(?:齐)?透|透出${tenGod}|${tenGod}透干`);
    if (pattern.test(visibleText) && !exposedTenGods.has(tenGod)) {
      issues.push(`${tenGod}只在藏干或地支主气出现，不能写成透干`);
    }
  });
  if (/食伤齐透/.test(visibleText)
    && !(exposedTenGods.has("食神") && exposedTenGods.has("伤官"))) {
    issues.push("食神与伤官没有同时出现在天干，不能写成食伤齐透");
  }

  if (/亥子.{0,8}(六合|合水|半合水|半会水局)/.test(visibleText)) {
    issues.push("亥子两支只能表述为三会水方条件或水势相连，不能写成六合、半合或已成水局");
  }
  if (/子卯.{0,8}无恩之刑|无恩之刑.{0,8}子卯/.test(visibleText)) {
    issues.push("子卯刑应称无礼之刑，不能称无恩之刑");
  }
  if (/丙辛合身|官星合身/.test(visibleText) && hasMultiTargetStemCombination(rawFactPack, "丙", "辛")) {
    issues.push("丙对多个辛为多目标五合候选，不能直接写成单一稳定合身");
  }

  if (HEALTH_SENSITIVE_TERMS.some((term) => visibleText.includes(term))
    && !HEALTH_SENSITIVE_TERMS.some((term) => candidateText.includes(term))) {
    issues.push("没有专门健康规则支持时，禁止输出具体器官或疾病");
  }

  if (FAMILY_SPECIFIC_TERMS.some((term) => visibleText.includes(term))
    && !FAMILY_SPECIFIC_TERMS.some((term) => candidateText.includes(term))) {
    issues.push("家庭或年柱事实不足以直接扩写祖产、祖业或长辈资源");
  }

  if (age !== null && age < 35 && YOUTH_LOW_PRIORITY_TERMS.some((term) => visibleText.includes(term))
    && !YOUTH_LOW_PRIORITY_TERMS.some((term) => candidateText.includes(term))) {
    issues.push("青年阶段不能仅凭时柱优先断晚年、子女或下属事务");
  }

  if (stage === "luck") {
    if (/\b(?:19|20|21|22|23|24|25|26|27|28|29|30)[—\-至到](?:19|20|21|22|23|24|25|26|27|28|29|30)岁\b/.test(visibleText)
      || /20\d{2}(?:年)?/.test(stripTargetRanges(visibleText, rawFactPack))) {
      issues.push("大运总报告没有逐年证据时不能自行划分具体年龄段或指定年份高峰");
    }
  }

  return unique(issues);
}

export function buildFactRulePreflight({ rawFactPack = {}, candidatePack = {} } = {}) {
  const factValidation = rawFactPack?.validation || validateRawFactPack(rawFactPack);
  const errors = [...array(factValidation?.errors)];
  if (!array(candidatePack?.candidateImages).length) {
    errors.push("没有通过资格审核且能追溯到硬事实的候选取象规则");
  }
  return {
    usable: errors.length === 0,
    errors: unique(errors),
    warnings: unique([
      ...array(factValidation?.warnings),
      ...array(candidatePack?.eligibility?.warnings),
    ]),
  };
}

function validateTenGodFields({ pillar, dayMaster, label, errors }) {
  const stem = text(pillar?.stem);
  const branch = text(pillar?.branch);
  if (!stem && !branch) return;
  const expectedStem = computeTenGod(dayMaster, stem);
  const expectedBranch = computeTenGod(dayMaster, branchMainStem(branch));
  const reportedStem = text(pillar?.reportedStemTenGod || pillar?.stemTenGod);
  const reportedBranch = text(pillar?.reportedBranchMainTenGod || pillar?.branchMainTenGod);
  if (expectedStem && reportedStem && expectedStem !== reportedStem) {
    errors.push(`${label}${stem}的十神应为${expectedStem}，当前为${reportedStem}`);
  }
  if (expectedBranch && reportedBranch && expectedBranch !== reportedBranch) {
    errors.push(`${label}${branch}主气十神应为${expectedBranch}，当前为${reportedBranch}`);
  }
}

function normalizeGenderScope(rule) {
  const explicit = unique(array(rule?.genderScope || rule?.genders)).map(normalizeGender).filter((value) => value !== "unknown");
  if (explicit.length) return explicit;
  const value = collectRuleText(rule);
  if (/(女命|夫星|官杀为夫)/.test(value)) return ["female"];
  if (/(男命|妻星|财星为妻)/.test(value)) return ["male"];
  return [];
}

function normalizeAgeScope(value) {
  if (!value || typeof value !== "object") return { min: null, max: null };
  return {
    min: numberOrNull(value.min),
    max: numberOrNull(value.max),
  };
}

function collectRuleText(rule) {
  return JSON.stringify({
    title: rule?.title,
    requires: rule?.requires,
    weakeningConditions: rule?.weakeningConditions,
    imagery: rule?.imagery,
    advice: rule?.advice,
    prohibitions: rule?.prohibitions,
  });
}

function collectExposedTenGods(rawFactPack) {
  const result = [];
  array(rawFactPack?.natal?.pillars).forEach((pillar) => result.push(text(pillar?.stemTenGod)));
  Object.values(rawFactPack?.layers || {}).filter(Boolean).forEach((pillar) => result.push(text(pillar?.stemTenGod)));
  return unique(result);
}

function hasMultiTargetStemCombination(rawFactPack, sourceStem, targetStem) {
  const groups = array(rawFactPack?.factGroups);
  return groups.some((group) => {
    const relations = array(group?.relations);
    const combinationCount = relations.filter((item) => item?.relation === "天干五合").length;
    const textValue = JSON.stringify(group);
    return combinationCount > 1 && textValue.includes(sourceStem) && textValue.includes(targetStem);
  }) || array(rawFactPack?.facts).filter((fact) => fact?.relation === "天干五合"
    && JSON.stringify(fact).includes(sourceStem)
    && JSON.stringify(fact).includes(targetStem)).length > 1;
}

function collectVisibleText(report) {
  return JSON.stringify(report || {});
}

function stripTargetRanges(value, rawFactPack) {
  let result = value;
  const ranges = [rawFactPack?.target?.yearRange, rawFactPack?.layers?.luck?.yearRange].filter(Boolean);
  ranges.forEach((range) => {
    result = result.replaceAll(String(range), "");
  });
  return result;
}

function normalizeMembers(value) {
  const raw = array(value).flatMap((item) => text(item).split(/[、，,\s|/]+/));
  return unique(raw.filter((item) => BRANCHES.includes(item)));
}

function sameMembers(left, right) {
  return left.length === right.length && containsAll(left, right);
}

function containsAll(left, right) {
  return right.every((item) => left.includes(item));
}

function normalizeConditionalStatus(value) {
  const status = text(value);
  return status || "condition_only";
}

function containsAny(value, terms) {
  return terms.some((term) => text(value).includes(term));
}

function numberOrNull(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function text(value) {
  return value === undefined || value === null ? "" : String(value).trim();
}

function array(value) {
  return Array.isArray(value) ? value : value === undefined || value === null ? [] : [value];
}

function unique(values) {
  return [...new Set(array(values).map(text).filter(Boolean))];
}
