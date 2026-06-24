import { hiddenStems } from "../bazi/fiveElements.js";
import { getTenGod } from "../bazi/tenGods.js";

export const TRANSIT_DOMAIN_DEFINITIONS = [
  { key: "career", label: "事业与工作" },
  { key: "learning", label: "学业与资格" },
  { key: "wealth", label: "财富与资源" },
  { key: "relationship", label: "感情与婚姻" },
  { key: "family", label: "家庭与父母" },
  { key: "siblings", label: "兄弟朋友" },
  { key: "children", label: "子女与成果" },
  { key: "health", label: "身心与健康" },
  { key: "migration", label: "迁移与出行" },
  { key: "housing", label: "住房与资产" },
  { key: "cooperation", label: "合作与人际" },
  { key: "mental", label: "精神状态" },
];

const STAGE_LABELS = {
  luck: "大运",
  year: "流年",
  month: "流月",
};

const TEN_GOD_DOMAIN_RULES = {
  比肩: [
    signal("siblings", 2.4, "同辈、朋友、自主与竞争被带动"),
    signal("cooperation", 1.2, "合作中更强调平等与个人主张"),
    signal("wealth", 0.8, "资源分配和重复投入需要留意", "counter"),
  ],
  劫财: [
    signal("siblings", 2.6, "同辈、朋友、竞争和资源争取更突出"),
    signal("cooperation", 1.4, "合作分配和边界需要重新协调"),
    signal("wealth", 1.4, "共同支出、竞争性投入或资源分流增加", "counter"),
  ],
  正印: [
    signal("learning", 2.8, "学习、考试、证书、资料和专业支持被带动"),
    signal("family", 1.2, "长辈、保护和家庭支持成为背景"),
    signal("housing", 0.9, "稳定基础、居住和长期安排受到关注"),
    signal("mental", 0.8, "更重视安全感、准备和恢复节奏"),
  ],
  偏印: [
    signal("learning", 2.4, "研究、信息筛选和非标准学习路径增加"),
    signal("mental", 1.3, "独立思考增强，也容易想法过多或节奏不稳"),
    signal("family", 0.7, "既有支持方式可能需要调整"),
  ],
  食神: [
    signal("children", 2.0, "作品、成果、照料或子女相关主题更容易被带动"),
    signal("career", 0.9, "技术、内容和可交付成果成为工作抓手"),
    signal("mental", 1.1, "表达、舒适度和个人空间需求增加"),
    signal("wealth", 0.6, "输出与现实回报之间的联系开始增强"),
  ],
  伤官: [
    signal("career", 1.8, "问题识别、表达突破和规则碰撞增加"),
    signal("children", 1.8, "作品、成果或子女相关事务更需要投入"),
    signal("mental", 1.2, "表达冲动、反复思考和不耐受感增强"),
    signal("cooperation", 1.0, "沟通方式容易影响合作", "counter"),
  ],
  正财: [
    signal("wealth", 2.8, "稳定收入、预算、现实责任和资源管理被带动"),
    signal("family", 1.0, "家庭责任与现实承诺更具体"),
    signal("housing", 0.8, "长期资产、居住或稳定安排受到关注"),
  ],
  偏财: [
    signal("wealth", 2.6, "机会、人脉、额外资源和流动性增强"),
    signal("cooperation", 1.2, "外部邀约、合作资源和社交连接增多"),
  ],
  正官: [
    signal("career", 2.8, "岗位、规则、考核、正式身份和责任被带动"),
    signal("learning", 0.8, "资格、标准和正式评定受到关注"),
    signal("cooperation", 0.6, "合作需要更明确的规则与权责"),
  ],
  七杀: [
    signal("career", 2.7, "期限、压力、竞争和强执行任务集中"),
    signal("health", 1.1, "高压节奏对身体状态形成消耗提醒", "counter"),
    signal("mental", 1.2, "紧迫感、焦虑或控制感容易增强", "counter"),
  ],
};

const SPOUSE_TEN_GODS = {
  male: new Set(["正财", "偏财"]),
  female: new Set(["正官", "七杀"]),
};

const PRESSURE_LABELS = new Set([
  "冲",
  "刑",
  "害",
  "破",
  "自刑",
  "三刑组合",
  "天干相克",
  "天克地冲",
  "层级牵制转向",
  "当前制约上层",
  "上层约束当前",
]);

const CONNECTION_LABELS = new Set([
  "合",
  "六合",
  "天干五合",
  "层级牵连",
  "牵连与制约并存",
]);

const MOVEMENT_LABELS = new Set([
  "冲",
  "天克地冲",
  "层级牵制转向",
]);

const PEACH_BLOSSOM_GROUPS = [
  { members: ["申", "子", "辰"], target: "酉" },
  { members: ["寅", "午", "戌"], target: "卯" },
  { members: ["巳", "酉", "丑"], target: "午" },
  { members: ["亥", "卯", "未"], target: "子" },
];

const TRAVEL_HORSE_GROUPS = [
  { members: ["申", "子", "辰"], target: "寅" },
  { members: ["寅", "午", "戌"], target: "申" },
  { members: ["巳", "酉", "丑"], target: "亥" },
  { members: ["亥", "卯", "未"], target: "巳" },
];

const CANOPY_GROUPS = [
  { members: ["申", "子", "辰"], target: "辰" },
  { members: ["寅", "午", "戌"], target: "戌" },
  { members: ["巳", "酉", "丑"], target: "丑" },
  { members: ["亥", "卯", "未"], target: "未" },
];

const WENCHANG_BY_DAY_STEM = {
  甲: "巳",
  乙: "午",
  丙: "申",
  戊: "申",
  丁: "酉",
  己: "酉",
  庚: "亥",
  辛: "子",
  壬: "寅",
  癸: "卯",
};

const NOBLEMAN_BY_DAY_STEM = {
  甲: ["丑", "未"],
  戊: ["丑", "未"],
  庚: ["丑", "未"],
  乙: ["子", "申"],
  己: ["子", "申"],
  丙: ["亥", "酉"],
  丁: ["亥", "酉"],
  壬: ["卯", "巳"],
  癸: ["卯", "巳"],
  辛: ["寅", "午"],
};

const LU_BY_DAY_STEM = {
  甲: "寅",
  乙: "卯",
  丙: "巳",
  戊: "巳",
  丁: "午",
  己: "午",
  庚: "申",
  辛: "酉",
  壬: "亥",
  癸: "子",
};

const RED_LUAN_BY_YEAR_BRANCH = {
  子: "卯",
  丑: "寅",
  寅: "丑",
  卯: "子",
  辰: "亥",
  巳: "戌",
  午: "酉",
  未: "申",
  申: "未",
  酉: "午",
  戌: "巳",
  亥: "辰",
};

const TIAN_XI_BY_YEAR_BRANCH = {
  子: "酉",
  丑: "申",
  寅: "未",
  卯: "午",
  辰: "巳",
  巳: "辰",
  午: "卯",
  未: "寅",
  申: "丑",
  酉: "子",
  戌: "亥",
  亥: "戌",
};

export function buildTransitDomainSignals({
  stage = "year",
  chart = {},
  baseBaziViewModel = {},
  item = {},
  currentLuckItem = null,
  yearItem = null,
  structureAnalysis = item?.transitStructure ?? {},
} = {}) {
  const normalizedStage = STAGE_LABELS[stage] ? stage : "year";
  const stageLabel = STAGE_LABELS[normalizedStage];
  const gender = normalizeGender(
    chart?.input?.gender ??
      baseBaziViewModel?.birthInfo?.gender,
  );
  const dayStem =
    chart?.dayMaster?.stem ??
    findPillar(baseBaziViewModel, "day")?.stem ??
    chart?.pillars?.day?.stem ??
    "";
  const dayBranch =
    findPillar(baseBaziViewModel, "day")?.branch ??
    chart?.pillars?.day?.branch ??
    "";
  const yearBranch =
    findPillar(baseBaziViewModel, "year")?.branch ??
    chart?.pillars?.year?.branch ??
    "";
  const current = normalizeTransitItem(item, dayStem);
  const evidence = [];

  addTenGodEvidence(evidence, {
    stage: normalizedStage,
    stageLabel,
    layerLabel: stageLabel,
    tenGod: current.stemTenGod,
    sourceLevel: "stem",
    factor: 1,
    gender,
    current: true,
  });

  addTenGodEvidence(evidence, {
    stage: normalizedStage,
    stageLabel,
    layerLabel: stageLabel,
    tenGod: current.branchTenGod,
    sourceLevel: "branch",
    factor: 0.72,
    gender,
    current: true,
  });

  addHiddenStemEvidence(evidence, {
    stage: normalizedStage,
    stageLabel,
    layerLabel: stageLabel,
    branch: current.branch,
    dayStem,
    gender,
    factor: 1,
    current: true,
  });

  if (normalizedStage !== "luck") {
    const luck = normalizeTransitItem(
      currentLuckItem ?? item?.currentLuckItem,
      dayStem,
    );
    addBackgroundLayerEvidence(evidence, {
      stage: normalizedStage,
      stageLabel,
      layerLabel: "当前大运",
      current: luck,
      dayStem,
      gender,
      factor: 0.46,
    });
  }

  if (normalizedStage === "month") {
    const year = normalizeTransitItem(
      yearItem ?? item?.yearItem,
      dayStem,
    );
    addBackgroundLayerEvidence(evidence, {
      stage: normalizedStage,
      stageLabel,
      layerLabel: "当前流年",
      current: year,
      dayStem,
      gender,
      factor: 0.58,
    });
  }

  addStructureEvidence(
    evidence,
    structureAnalysis?.facts,
    normalizedStage,
    stageLabel,
  );

  addAuxiliaryEvidence(evidence, {
    stage: normalizedStage,
    stageLabel,
    currentBranch: current.branch,
    dayStem,
    dayBranch,
    yearBranch,
  });

  const domains = buildDomainEntries(evidence);
  const ranked = domains
    .filter((entry) => entry.score > 0)
    .sort((left, right) =>
      right.score - left.score ||
      left.index - right.index,
    );
  const primaryKeys = ranked
    .filter((entry) => entry.score >= 25)
    .slice(0, 3)
    .map((entry) => entry.domain);
  const secondaryKeys = ranked
    .filter((entry) =>
      !primaryKeys.includes(entry.domain) &&
      entry.score >= 12,
    )
    .slice(0, 4)
    .map((entry) => entry.domain);

  const normalizedDomains = domains.map((entry) => ({
    ...entry,
    role: primaryKeys.includes(entry.domain)
      ? "primary"
      : secondaryKeys.includes(entry.domain)
        ? "secondary"
        : entry.score > 0
          ? "background"
          : "quiet",
  }));

  const primaryDomains = normalizedDomains
    .filter((entry) => entry.role === "primary")
    .map(compactDomainHeadline);
  const secondaryDomains = normalizedDomains
    .filter((entry) => entry.role === "secondary")
    .map(compactDomainHeadline);
  const quietDomains = normalizedDomains
    .filter((entry) => entry.role === "quiet")
    .map((entry) => ({
      domain: entry.domain,
      label: entry.label,
      status: entry.status,
    }));

  return {
    schemaVersion: "transit-domain-signals-v1",
    stage: normalizedStage,
    stageLabel,
    target: {
      ganZhi: current.ganZhi,
      stem: current.stem,
      branch: current.branch,
      year: numberOrNull(item?.year),
      month: numberOrNull(item?.month ?? item?.flowMonthIndex),
    },
    gender,
    checkedDomainCount: TRANSIT_DOMAIN_DEFINITIONS.length,
    triggeredDomainCount: normalizedDomains.filter((entry) => entry.score > 0).length,
    primaryDomains,
    secondaryDomains,
    quietDomains,
    domains: normalizedDomains,
    summary: {
      primaryText: primaryDomains.length
        ? primaryDomains.map((entry) => `${entry.label}${entry.score}`).join("、")
        : "暂未形成强主线领域",
      secondaryText: secondaryDomains.length
        ? secondaryDomains.map((entry) => `${entry.label}${entry.score}`).join("、")
        : "暂未形成明确次线领域",
      instruction:
        "领域分数表示该领域被触发的强度，不等于吉凶；正文先讲主线，再简述次线，安静领域不得反推为现实中一定没有事情。",
    },
    boundaries: [
      "领域扫描用于确认各领域是否被岁运结构触发，不把单一十神、神煞或宫位直接等同具体事件。",
      "桃花、红鸾、天喜、驿马、华盖、文昌、天乙贵人与禄神仅作为辅助信号，必须结合十神、宫位和结构事实使用。",
      "藏干信号属于潜在线索，权重低于透干、主气和直接宫位触发。",
      "健康领域只描述压力、节奏和体质倾向，不判断具体器官或疾病。",
    ],
  };
}

function addBackgroundLayerEvidence(
  evidence,
  {
    stage,
    stageLabel,
    layerLabel,
    current,
    dayStem,
    gender,
    factor,
  },
) {
  if (!current.stem && !current.branch) return;

  addTenGodEvidence(evidence, {
    stage,
    stageLabel,
    layerLabel,
    tenGod: current.stemTenGod,
    sourceLevel: "background_stem",
    factor,
    gender,
    current: false,
  });

  addTenGodEvidence(evidence, {
    stage,
    stageLabel,
    layerLabel,
    tenGod: current.branchTenGod,
    sourceLevel: "background_branch",
    factor: factor * 0.72,
    gender,
    current: false,
  });

  addHiddenStemEvidence(evidence, {
    stage,
    stageLabel,
    layerLabel,
    branch: current.branch,
    dayStem,
    gender,
    factor: factor * 0.85,
    current: false,
  });
}

function addTenGodEvidence(
  evidence,
  {
    stage,
    stageLabel,
    layerLabel,
    tenGod,
    sourceLevel,
    factor,
    gender,
    current,
  },
) {
  if (!tenGod || tenGod === "未知") return;

  const rules = TEN_GOD_DOMAIN_RULES[tenGod] ?? [];
  rules.forEach((rule, index) => {
    pushEvidence(evidence, {
      id: `${stage}:domain:ten-god:${sourceLevel}:${tenGod}:${rule.domain}:${index}`,
      type: "ten_god",
      source: `${layerLabel}${sourceLevel.includes("stem") ? "天干" : "地支主气"}`,
      status: current && sourceLevel === "stem" ? "direct" : "supporting",
      polarity: rule.status === "counter" ? "pressure" : "mixed",
      strength: rule.weight * factor,
      text: `${layerLabel}${sourceLevel.includes("stem") ? "天干" : "地支主气"}见${tenGod}，${rule.text}。`,
      domains: [rule.domain],
      evidenceKind: rule.status === "counter" ? "counter" : "supporting",
    });
  });

  const spouseSet = SPOUSE_TEN_GODS[gender];
  if (!spouseSet?.has(tenGod)) return;

  const spouseWeight =
    tenGod === "正财" || tenGod === "正官"
      ? 2.8
      : 2.2;

  pushEvidence(evidence, {
    id: `${stage}:domain:spouse-star:${sourceLevel}:${tenGod}`,
    type: "spouse_star",
    source: `${layerLabel}${sourceLevel.includes("stem") ? "天干" : "地支主气"}`,
    status: current && sourceLevel === "stem" ? "direct" : "supporting",
    polarity: "mixed",
    strength: spouseWeight * factor,
    text: `${gender === "male" ? "男命" : "女命"}以${[...spouseSet].join("、")}为配偶星，${layerLabel}见${tenGod}，感情与伴侣议题获得${current ? "当前层" : "背景层"}信号。`,
    domains: ["relationship"],
    evidenceKind: "supporting",
  });
}

function addHiddenStemEvidence(
  evidence,
  {
    stage,
    layerLabel,
    branch,
    dayStem,
    gender,
    factor,
    current,
  },
) {
  const stems = hiddenStems[branch] ?? [];
  stems.slice(1).forEach((stem, index) => {
    const tenGod = getTenGod(dayStem, stem);
    const role = index === 0 ? "中气" : "余气";
    const roleFactor = index === 0 ? 0.72 : 0.5;
    const rules = TEN_GOD_DOMAIN_RULES[tenGod] ?? [];

    rules.slice(0, 2).forEach((rule, ruleIndex) => {
      pushEvidence(evidence, {
        id: `${stage}:domain:hidden:${layerLabel}:${branch}:${stem}:${rule.domain}:${ruleIndex}`,
        type: "hidden_stem",
        source: `${layerLabel}地支藏干`,
        status: "supporting",
        polarity: rule.status === "counter" ? "pressure" : "mixed",
        strength: rule.weight * factor * roleFactor * 0.55,
        text: `${layerLabel}地支${branch}${role}藏${stem}${tenGod}，${rule.text}，但属于潜在线索。`,
        domains: [rule.domain],
        evidenceKind: rule.status === "counter" ? "counter" : "hidden",
      });
    });

    const spouseSet = SPOUSE_TEN_GODS[gender];
    if (!spouseSet?.has(tenGod)) return;

    pushEvidence(evidence, {
      id: `${stage}:domain:hidden-spouse:${layerLabel}:${branch}:${stem}`,
      type: "hidden_spouse_star",
      source: `${layerLabel}地支藏干`,
      status: "supporting",
      polarity: "mixed",
      strength: (tenGod === "正财" || tenGod === "正官" ? 2.3 : 1.8) * factor * roleFactor,
      text: `${gender === "male" ? "男命" : "女命"}配偶星${tenGod}藏于${layerLabel}地支${branch}，感情机会存在背景承接，但未透出时不宜直接断定关系结果。`,
      domains: ["relationship"],
      evidenceKind: "hidden",
    });
  });
}

function addStructureEvidence(
  evidence,
  facts,
  stage,
  stageLabel,
) {
  array(facts).slice(0, 40).forEach((fact, index) => {
    const mappedDomains = normalizeFactDomains(fact?.domains);
    const baseStrength = normalizeFactStrength(fact);
    const status = normalizeFactStatus(fact?.status);
    const polarity = String(fact?.polarity || "mixed");
    const label = String(fact?.label || "结构触发");
    const factId = String(fact?.id || `${stage}:domain:structure:${index}`);

    if (mappedDomains.length) {
      pushEvidence(evidence, {
        id: `${factId}:domain`,
        type: "structure_fact",
        source: String(fact?.source || `${stageLabel}结构`),
        status,
        polarity,
        strength: baseStrength,
        text: String(fact?.text || `${label}被触发。`),
        domains: mappedDomains,
        evidenceKind: polarity === "pressure" || PRESSURE_LABELS.has(label)
          ? "counter"
          : "palace",
        originalFactId: factId,
      });
    }

    if (PRESSURE_LABELS.has(label)) {
      pushEvidence(evidence, {
        id: `${factId}:pressure-health`,
        type: "pressure_signal",
        source: String(fact?.source || `${stageLabel}结构`),
        status: status === "direct" ? "supporting" : status,
        polarity: "pressure",
        strength: baseStrength * 0.52,
        text: `${String(fact?.text || label)}，同时构成压力、节奏和身心消耗提醒。`,
        domains: ["health", "mental"],
        evidenceKind: "counter",
        originalFactId: factId,
      });
    }

    if (MOVEMENT_LABELS.has(label)) {
      pushEvidence(evidence, {
        id: `${factId}:movement`,
        type: "movement_signal",
        source: String(fact?.source || `${stageLabel}结构`),
        status: status === "direct" ? "direct" : "supporting",
        polarity: "mixed",
        strength: baseStrength * 0.72,
        text: `${String(fact?.text || label)}，迁移、出行、位置或时间表调整值得观察，但不能只凭冲动直接断搬迁。`,
        domains: ["migration"],
        evidenceKind: "supporting",
        originalFactId: factId,
      });
    }

    if (CONNECTION_LABELS.has(label)) {
      pushEvidence(evidence, {
        id: `${factId}:connection`,
        type: "connection_signal",
        source: String(fact?.source || `${stageLabel}结构`),
        status: status === "direct" ? "supporting" : status,
        polarity: "mixed",
        strength: baseStrength * 0.55,
        text: `${String(fact?.text || label)}，合作、人情、承诺和关系边界需要同时考虑。`,
        domains: ["cooperation"],
        evidenceKind: "supporting",
        originalFactId: factId,
      });
    }

    const factText = `${String(fact?.source || "")} ${String(fact?.text || "")}`;
    if (/时柱|时支/.test(factText)) {
      pushEvidence(evidence, {
        id: `${factId}:hour-children`,
        type: "palace_support",
        source: String(fact?.source || `${stageLabel}结构`),
        status: "supporting",
        polarity,
        strength: baseStrength * 0.35,
        text: `${String(fact?.text || label)}，时柱被引动时可兼看子女、作品、后续成果与未来安排，但不能直接等同具体子女事件。`,
        domains: ["children"],
        evidenceKind: "palace",
        originalFactId: factId,
      });
    }
  });
}

function addAuxiliaryEvidence(
  evidence,
  {
    stage,
    stageLabel,
    currentBranch,
    dayStem,
    dayBranch,
    yearBranch,
  },
) {
  if (!currentBranch) return;

  const dayPeach = groupTarget(PEACH_BLOSSOM_GROUPS, dayBranch);
  if (dayPeach && currentBranch === dayPeach) {
    pushEvidence(evidence, {
      id: `${stage}:domain:aux:peach:day:${dayBranch}:${currentBranch}`,
      type: "auxiliary",
      source: "日支桃花",
      status: "direct",
      polarity: "mixed",
      strength: 3,
      text: `日支${dayBranch}所属桃花位在${currentBranch}，${stageLabel}${currentBranch}命中日支桃花，人际吸引、异性接触和关系机会更容易浮现；桃花不等于正缘或婚期。`,
      domains: ["relationship"],
      evidenceKind: "auxiliary",
    });
  }

  const yearPeach = groupTarget(PEACH_BLOSSOM_GROUPS, yearBranch);
  if (yearPeach && currentBranch === yearPeach) {
    pushEvidence(evidence, {
      id: `${stage}:domain:aux:peach:year:${yearBranch}:${currentBranch}`,
      type: "auxiliary",
      source: "年支桃花",
      status: "supporting",
      polarity: "mixed",
      strength: 1.8,
      text: `年支${yearBranch}所属桃花位在${currentBranch}，${stageLabel}${currentBranch}命中年支桃花，社交曝光、人际互动和被关注度增加。`,
      domains: ["relationship"],
      evidenceKind: "auxiliary",
    });
  }

  const travelHorseTargets = unique([
    groupTarget(TRAVEL_HORSE_GROUPS, dayBranch),
    groupTarget(TRAVEL_HORSE_GROUPS, yearBranch),
  ]);
  if (travelHorseTargets.includes(currentBranch)) {
    pushEvidence(evidence, {
      id: `${stage}:domain:aux:travel-horse:${currentBranch}`,
      type: "auxiliary",
      source: "驿马",
      status: "supporting",
      polarity: "mixed",
      strength: 2.6,
      text: `${stageLabel}${currentBranch}命中日支或年支驿马位，出行、异地、搬动、环境切换和奔波信号增强，但仍需宫位和现实条件承接。`,
      domains: ["migration"],
      evidenceKind: "auxiliary",
    });
  }

  const canopyTargets = unique([
    groupTarget(CANOPY_GROUPS, dayBranch),
    groupTarget(CANOPY_GROUPS, yearBranch),
  ]);
  if (canopyTargets.includes(currentBranch)) {
    pushEvidence(evidence, {
      id: `${stage}:domain:aux:canopy:${currentBranch}`,
      type: "auxiliary",
      source: "华盖",
      status: "supporting",
      polarity: "mixed",
      strength: 1.4,
      text: `${stageLabel}${currentBranch}命中华盖位，独立研究、专业沉淀、审美或精神需求增强，也要留意孤立和过度封闭。`,
      domains: ["learning", "mental"],
      evidenceKind: "auxiliary",
    });
  }

  if (WENCHANG_BY_DAY_STEM[dayStem] === currentBranch) {
    pushEvidence(evidence, {
      id: `${stage}:domain:aux:wenchang:${dayStem}:${currentBranch}`,
      type: "auxiliary",
      source: "文昌",
      status: "supporting",
      polarity: "supportive",
      strength: 1.8,
      text: `${dayStem}日主文昌位在${currentBranch}，${stageLabel}命中文昌，学习、写作、考试、资料整理和表达能力得到辅助。`,
      domains: ["learning", "career"],
      evidenceKind: "auxiliary",
    });
  }

  if (array(NOBLEMAN_BY_DAY_STEM[dayStem]).includes(currentBranch)) {
    pushEvidence(evidence, {
      id: `${stage}:domain:aux:nobleman:${dayStem}:${currentBranch}`,
      type: "auxiliary",
      source: "天乙贵人",
      status: "supporting",
      polarity: "supportive",
      strength: 1.3,
      text: `${dayStem}日主天乙贵人位包含${currentBranch}，${stageLabel}容易出现帮助、协调或专业支持，但不能脱离现实行动单独断贵人必到。`,
      domains: ["cooperation", "learning", "career"],
      evidenceKind: "auxiliary",
    });
  }

  if (LU_BY_DAY_STEM[dayStem] === currentBranch) {
    pushEvidence(evidence, {
      id: `${stage}:domain:aux:lu:${dayStem}:${currentBranch}`,
      type: "auxiliary",
      source: "禄神",
      status: "supporting",
      polarity: "supportive",
      strength: 1.5,
      text: `${dayStem}日主禄位在${currentBranch}，${stageLabel}命中禄位，自主性、工作承接和现实资源感增强，仍需结合喜忌判断顺逆。`,
      domains: ["career", "wealth"],
      evidenceKind: "auxiliary",
    });
  }

  if (RED_LUAN_BY_YEAR_BRANCH[yearBranch] === currentBranch) {
    pushEvidence(evidence, {
      id: `${stage}:domain:aux:red-luan:${yearBranch}:${currentBranch}`,
      type: "auxiliary",
      source: "红鸾",
      status: "supporting",
      polarity: "mixed",
      strength: 1.6,
      text: `年支${yearBranch}红鸾位在${currentBranch}，${stageLabel}命中红鸾，关系连接、情感关注和社交议题增强；不能单独据此断婚恋结果。`,
      domains: ["relationship"],
      evidenceKind: "auxiliary",
    });
  }

  if (TIAN_XI_BY_YEAR_BRANCH[yearBranch] === currentBranch) {
    pushEvidence(evidence, {
      id: `${stage}:domain:aux:tian-xi:${yearBranch}:${currentBranch}`,
      type: "auxiliary",
      source: "天喜",
      status: "supporting",
      polarity: "supportive",
      strength: 1.5,
      text: `年支${yearBranch}天喜位在${currentBranch}，${stageLabel}命中天喜，人际喜庆、关系推进或值得高兴的连接机会增加，仍需主结构承接。`,
      domains: ["relationship", "family"],
      evidenceKind: "auxiliary",
    });
  }
}

function buildDomainEntries(evidence) {
  return TRANSIT_DOMAIN_DEFINITIONS.map((definition, index) => {
    const domainEvidence = evidence
      .filter((item) => item.domains.includes(definition.key))
      .sort((left, right) =>
        right.strength - left.strength ||
        left.id.localeCompare(right.id),
      );
    const rawScore = domainEvidence.reduce(
      (sum, item) => sum + item.strength,
      0,
    );
    const score = Math.min(100, Math.round(rawScore * 10));
    const positiveCount = domainEvidence.filter((item) => item.polarity === "supportive").length;
    const pressureCount = domainEvidence.filter((item) => item.polarity === "pressure").length;
    const directCount = domainEvidence.filter((item) => item.status === "direct").length;
    const supportingCount = domainEvidence.filter((item) => item.status === "supporting").length;
    const level = score >= 55
      ? "strong"
      : score >= 25
        ? "active"
        : score >= 12
          ? "secondary"
          : score > 0
            ? "background"
            : "quiet";
    const status = score > 0
      ? "triggered"
      : "checked_no_direct_signal";
    const confidence = directCount >= 2
      ? "high"
      : directCount >= 1 || supportingCount >= 2
        ? "medium"
        : score > 0
          ? "low"
          : "none";
    const polaritySummary = pressureCount && positiveCount
      ? "mixed"
      : pressureCount
        ? "pressure"
        : positiveCount
          ? "supportive"
          : domainEvidence.length
            ? "mixed"
            : "quiet";

    return {
      index,
      domain: definition.key,
      label: definition.label,
      score,
      level,
      role: "background",
      status,
      confidence,
      polaritySummary,
      directFacts: compactEvidence(domainEvidence.filter((item) => item.status === "direct"), 4),
      supportingFacts: compactEvidence(domainEvidence.filter((item) => item.status === "supporting"), 4),
      counterFacts: compactEvidence(domainEvidence.filter((item) => item.evidenceKind === "counter"), 4),
      hiddenStemSignals: compactEvidence(domainEvidence.filter((item) => item.evidenceKind === "hidden"), 3),
      auxiliarySignals: compactEvidence(domainEvidence.filter((item) => item.evidenceKind === "auxiliary"), 3),
      palaceTriggers: compactEvidence(domainEvidence.filter((item) => item.evidenceKind === "palace"), 3),
      evidenceIds: unique(domainEvidence.map((item) => item.id)),
      summary: buildDomainSummary(definition.label, score, polaritySummary, domainEvidence),
    };
  });
}

function buildDomainSummary(label, score, polaritySummary, evidence) {
  if (!score) return `${label}已完成扫描，当前未见进入主线的直接触发。`;
  const strongest = evidence[0]?.text ?? "存在辅助触发";
  const tone = polaritySummary === "pressure"
    ? "压力和调整信号偏多"
    : polaritySummary === "supportive"
      ? "支持与机会信号偏多"
      : "机会与压力并存";
  return `${label}触发分${score}，${tone}。最强依据：${strongest}`;
}

function normalizeFactDomains(values) {
  const result = new Set();
  array(values).forEach((value) => {
    const domain = String(value || "");
    if (["career", "rules", "pressure"].includes(domain)) result.add("career");
    if (["learning", "support"].includes(domain)) result.add("learning");
    if (["wealth", "resource"].includes(domain)) result.add("wealth");
    if (domain === "relationship") result.add("relationship");
    if (["family", "foundation"].includes(domain)) {
      result.add("family");
      result.add("housing");
    }
    if (domain === "cooperation") result.add("cooperation");
    if (domain === "competition") {
      result.add("siblings");
      result.add("cooperation");
    }
    if (["expression", "output"].includes(domain)) {
      result.add("career");
      result.add("children");
    }
    if (["execution", "result"].includes(domain)) {
      result.add("career");
    }
  });
  return [...result];
}

function normalizeFactStrength(fact) {
  const raw = Number(fact?.strength);
  const base = Number.isFinite(raw)
    ? Math.max(0.5, Math.min(4, raw))
    : fact?.category === "direct"
      ? 2.4
      : 1.5;
  const status = String(fact?.status || "direct");
  const factor = {
    direct: 1,
    inferred: 0.82,
    background: 0.58,
    condition_only: 0.32,
    unresolved: 0.25,
    arch_condition: 0.2,
  }[status] ?? 0.7;
  return base * factor;
}

function normalizeFactStatus(status) {
  if (status === "direct") return "direct";
  if (["condition_only", "unresolved", "arch_condition"].includes(status)) return "conditional";
  return "supporting";
}

function normalizeTransitItem(item, dayStem) {
  const source = item && typeof item === "object" ? item : {};
  const stem = String(source.stem || "");
  const branch = String(source.branch || "");
  return {
    stem,
    branch,
    ganZhi: String(source.ganZhi || source.label || `${stem}${branch}`),
    stemTenGod: String(
      source.tenGod ||
      source.stemTenGod ||
      (stem && dayStem ? getTenGod(dayStem, stem) : ""),
    ),
    branchTenGod: String(
      source.branchTenGod ||
      source.branchMainTenGod ||
      "",
    ),
  };
}

function normalizeGender(value) {
  const normalized = String(value || "").trim().toLowerCase();
  if (["male", "m", "男", "男命"].includes(normalized)) return "male";
  if (["female", "f", "女", "女命"].includes(normalized)) return "female";
  return "unknown";
}

function findPillar(viewModel, key) {
  return array(viewModel?.pillars).find((pillar) => pillar?.key === key) ?? null;
}

function groupTarget(groups, branch) {
  return groups.find((group) => group.members.includes(branch))?.target ?? "";
}

function pushEvidence(evidence, item) {
  const strength = Number(item?.strength || 0);
  if (!item?.id || !item?.text || !item?.domains?.length || strength <= 0) return;
  evidence.push({
    ...item,
    strength: Number(strength.toFixed(3)),
    domains: unique(item.domains),
  });
}

function compactEvidence(values, limit) {
  return values.slice(0, limit).map((item) => ({
    id: item.id,
    type: item.type,
    source: item.source,
    status: item.status,
    polarity: item.polarity,
    strength: Number(item.strength.toFixed(2)),
    text: item.text,
    originalFactId: item.originalFactId || undefined,
  }));
}

function compactDomainHeadline(entry) {
  return {
    domain: entry.domain,
    label: entry.label,
    score: entry.score,
    level: entry.level,
    confidence: entry.confidence,
    polaritySummary: entry.polaritySummary,
    summary: entry.summary,
  };
}

function signal(domain, weight, text, status = "supporting") {
  return { domain, weight, text, status };
}

function numberOrNull(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
}

function unique(values) {
  return [...new Set(array(values).map((value) => String(value || "").trim()).filter(Boolean))];
}

function array(value) {
  return Array.isArray(value)
    ? value
    : value === undefined || value === null
      ? []
      : [value];
}
