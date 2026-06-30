const stageLabels = {
  luck: "大运",
  year: "流年",
  month: "流月",
};

const pillarLabels = {
  year: "年柱",
  month: "月柱",
  day: "日柱",
  hour: "时柱",
};

const pillarDomains = {
  year: ["family", "foundation"],
  month: ["career", "rules"],
  day: ["relationship", "cooperation"],
  hour: ["execution", "result"],
};

const tenGodDomains = {
  比肩: ["competition", "cooperation"],
  劫财: ["competition", "resource"],
  正印: ["learning", "support"],
  偏印: ["learning", "support"],
  食神: ["expression", "output"],
  伤官: ["expression", "rules"],
  正财: ["wealth", "resource"],
  偏财: ["wealth", "resource"],
  正官: ["career", "rules"],
  七杀: ["career", "pressure"],
};

const stemElements = {
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

const generatingElement = {
  木: "火",
  火: "土",
  土: "金",
  金: "水",
  水: "木",
};

const controllingElement = {
  木: "土",
  土: "水",
  水: "火",
  火: "金",
  金: "木",
};

const stemCombinations = [
  ["甲", "己", "土"],
  ["乙", "庚", "金"],
  ["丙", "辛", "水"],
  ["丁", "壬", "木"],
  ["戊", "癸", "火"],
];

const branchRelations = [
  ["冲", ["子", "午"], "变化、拉扯和位置调整"],
  ["冲", ["丑", "未"], "变化、拉扯和位置调整"],
  ["冲", ["寅", "申"], "变化、拉扯和位置调整"],
  ["冲", ["卯", "酉"], "变化、拉扯和位置调整"],
  ["冲", ["辰", "戌"], "变化、拉扯和位置调整"],
  ["冲", ["巳", "亥"], "变化、拉扯和位置调整"],
  ["六合", ["子", "丑"], "牵连、合作和绑定"],
  ["六合", ["寅", "亥"], "牵连、合作和绑定"],
  ["六合", ["卯", "戌"], "牵连、合作和绑定"],
  ["六合", ["辰", "酉"], "牵连、合作和绑定"],
  ["六合", ["巳", "申"], "牵连、合作和绑定"],
  ["六合", ["午", "未"], "牵连、合作和绑定"],
  ["害", ["子", "未"], "暗中牵制和互动不顺"],
  ["害", ["丑", "午"], "暗中牵制和互动不顺"],
  ["害", ["寅", "巳"], "暗中牵制和互动不顺"],
  ["害", ["卯", "辰"], "暗中牵制和互动不顺"],
  ["害", ["申", "亥"], "暗中牵制和互动不顺"],
  ["害", ["酉", "戌"], "暗中牵制和互动不顺"],
  ["破", ["子", "酉"], "反复、松动和破局"],
  ["破", ["卯", "午"], "反复、松动和破局"],
  ["破", ["辰", "丑"], "反复、松动和破局"],
  ["破", ["戌", "未"], "反复、松动和破局"],
  ["破", ["寅", "亥"], "反复、松动和破局"],
  ["破", ["巳", "申"], "反复、松动和破局"],
  ["刑", ["寅", "巳"], "规则压力、摩擦和内耗"],
  ["刑", ["巳", "申"], "规则压力、摩擦和内耗"],
  ["刑", ["申", "寅"], "规则压力、摩擦和内耗"],
  ["刑", ["丑", "戌"], "规则压力、摩擦和内耗"],
  ["刑", ["戌", "未"], "规则压力、摩擦和内耗"],
  ["刑", ["未", "丑"], "规则压力、摩擦和内耗"],
  ["刑", ["子", "卯"], "规则压力、摩擦和内耗"],
  ["刑", ["卯", "子"], "规则压力、摩擦和内耗"],
];

const selfPunishmentBranches = new Set(["辰", "午", "酉", "亥"]);

const tripleHarmonyGroups = [
  { members: ["申", "子", "辰"], element: "水" },
  { members: ["亥", "卯", "未"], element: "木" },
  { members: ["寅", "午", "戌"], element: "火" },
  { members: ["巳", "酉", "丑"], element: "金" },
];

const tripleMeetingGroups = [
  { members: ["寅", "卯", "辰"], element: "木" },
  { members: ["巳", "午", "未"], element: "火" },
  { members: ["申", "酉", "戌"], element: "金" },
  { members: ["亥", "子", "丑"], element: "水" },
];

/*
 * 三合中的两支并不都按“半合”处理：
 * - 中神参与：生地半合、墓地半合
 * - 缺中神：只记拱合条件
 */
const halfHarmonyPairs = [
  { members: ["申", "子"], element: "水", subtype: "生地半合" },
  { members: ["子", "辰"], element: "水", subtype: "墓地半合" },
  { members: ["亥", "卯"], element: "木", subtype: "生地半合" },
  { members: ["卯", "未"], element: "木", subtype: "墓地半合" },
  { members: ["寅", "午"], element: "火", subtype: "生地半合" },
  { members: ["午", "戌"], element: "火", subtype: "墓地半合" },
  { members: ["巳", "酉"], element: "金", subtype: "生地半合" },
  { members: ["酉", "丑"], element: "金", subtype: "墓地半合" },
];

const archHarmonyPairs = [
  { members: ["申", "辰"], element: "水" },
  { members: ["亥", "未"], element: "木" },
  { members: ["寅", "戌"], element: "火" },
  { members: ["巳", "丑"], element: "金" },
];

/*
 * 三会两支也区分相邻两支与首尾两支。
 * 首尾两支只保留“拱会条件”，不与相邻两支同权。
 */
const partialMeetingPairs = [
  { members: ["寅", "卯"], element: "木" },
  { members: ["卯", "辰"], element: "木" },
  { members: ["巳", "午"], element: "火" },
  { members: ["午", "未"], element: "火" },
  { members: ["申", "酉"], element: "金" },
  { members: ["酉", "戌"], element: "金" },
  { members: ["亥", "子"], element: "水" },
  { members: ["子", "丑"], element: "水" },
];

const archMeetingPairs = [
  { members: ["寅", "辰"], element: "木" },
  { members: ["巳", "未"], element: "火" },
  { members: ["申", "戌"], element: "金" },
  { members: ["亥", "丑"], element: "水" },
];

const triplePunishmentGroups = [
  { members: ["寅", "巳", "申"], name: "恃势之刑" },
  { members: ["丑", "戌", "未"], name: "无恩之刑" },
];

const pressureLabels = new Set([
  "冲",
  "刑",
  "害",
  "破",
  "自刑",
  "三刑组合",
  "天干相克",
  "天克地冲",
]);

const repeatLabels = new Set([
  "伏吟",
  "天干同现",
  "地支同现",
]);

const connectionLabels = new Set([
  "天干五合",
  "六合",
  "半合条件",
  "拱合条件",
  "三合局条件",
  "三会两支",
  "拱会条件",
  "三会局条件",
]);

export function buildTransitStructureAnalysis({
  stage = "luck",
  current = {},
  natalPillars = [],
  luckPillar = null,
  yearPillar = null,
} = {}) {
  const normalizedStage = stageLabels[stage] ? stage : "luck";
  const currentPillar = normalizePillar(current, normalizedStage, stageLabels[normalizedStage]);
  const natal = normalizeNatalPillars(natalPillars);
  const parents = buildParentLayers(normalizedStage, luckPillar, yearPillar);
  const activeLayers = [...parents, currentPillar].filter((pillar) => pillar.stem || pillar.branch);

  const directFacts = [
    ...natal.flatMap((pillar) => analyzePillarPair({
      stage: normalizedStage,
      current: currentPillar,
      target: pillar,
      source: `${stageLabels[normalizedStage]}触发原局`,
      targetDomains: pillar.domains,
    })),
    ...parents.flatMap((pillar) => analyzePillarPair({
      stage: normalizedStage,
      current: currentPillar,
      target: pillar,
      source: `${stageLabels[normalizedStage]}对${pillar.displayName}`,
      targetDomains: unique([
        ...domainsForTenGod(currentPillar.tenGod),
        ...domainsForTenGod(pillar.tenGod),
      ]),
    })),
  ];

  const combinationFacts = buildCombinationFacts({
    stage: normalizedStage,
    current: currentPillar,
    natal,
    activeLayers,
  });

  const convergenceFacts = buildConvergenceFacts({
    stage: normalizedStage,
    natal,
    activeLayers,
  });

  const hierarchyFacts = buildHierarchyFacts({
    stage: normalizedStage,
    current: currentPillar,
    parents,
    directFacts,
  });

  const facts = uniqueFacts([
    ...directFacts,
    ...combinationFacts,
    ...convergenceFacts,
    ...hierarchyFacts,
  ]).sort((left, right) =>
    Number(right.strength || 0) - Number(left.strength || 0),
  );

  const summary = buildSummary({
    stage: normalizedStage,
    current: currentPillar,
    facts,
    hierarchyFacts,
    convergenceFacts,
  });

  return {
    stage: normalizedStage,
    current: currentPillar,
    facts,
    directFacts: facts.filter((fact) => fact.category === "direct"),
    combinationFacts: facts.filter((fact) => fact.category === "combination"),
    convergenceFacts: facts.filter((fact) => fact.category === "convergence"),
    hierarchyFacts: facts.filter((fact) => fact.category === "hierarchy"),
    summary,
    boundaries: [
      "三合、三会、半合与拱局只表示组合条件；是否成局、化气仍需结合月令、中神旺衰、透干、制化、冲破和全局承接。",
      "伏吟、天克地冲和多层重复激活只表示主题加重或变化集中，不直接等同具体事件。",
      "岁运结构事实必须结合原局强弱、喜忌和现实反馈复核。",
    ],
  };
}

function analyzePillarPair({
  stage,
  current,
  target,
  source,
  targetDomains = [],
}) {
  if (!current || !target) return [];

  const facts = [];
  const domains =
    target.level === "natal" &&
    targetDomains.length
      ? unique(targetDomains)
      : unique([
          ...targetDomains,
          ...domainsForTenGod(current.tenGod),
          ...domainsForTenGod(target.tenGod),
        ]);

  const currentLabel = current.ganZhi || `${current.stem || ""}${current.branch || ""}` || current.displayName;
  const targetLabel = target.ganZhi || `${target.stem || ""}${target.branch || ""}` || target.displayName;
  const pairSource = target.level === "natal"
    ? `${source}${target.displayName}`
    : source;

  const isFullRepeat = Boolean(
    current.stem &&
    current.branch &&
    target.stem &&
    target.branch &&
    current.stem === target.stem &&
    current.branch === target.branch
  );

  if (isFullRepeat) {
    facts.push(createFact({
      stage,
      category: "direct",
      type: "repeat",
      label: "伏吟",
      source,
      text: `${pairSource}：${currentLabel}与${targetLabel}干支同柱，主题容易重复加力，也可能表现为同类议题反复出现。`,
      strength: 5,
      polarity: "mixed",
      domains,
      participants: [current.id, target.id],
    }));
  }

  if (current.stem && target.stem) {
    if (current.stem === target.stem && !isFullRepeat) {
      facts.push(createFact({
        stage,
        category: "direct",
        type: "stem_repeat",
        label: "天干同现",
        source,
        text: `${pairSource}：${current.stem}干重复出现，外显主题和行动方式容易得到加力。`,
        strength: 3,
        polarity: "mixed",
        domains,
        participants: [current.id, target.id],
      }));
    }

    const combination = findStemCombination(current.stem, target.stem);
    if (combination) {
      facts.push(createFact({
        stage,
        category: "direct",
        type: "stem_combination",
        label: "天干五合",
        source,
        text: `${pairSource}：${current.stem}${target.stem}五合，具备向${combination.element}气牵连的条件，但是否化气仍需结合月令与全局。`,
        strength: 4,
        polarity: "mixed",
        status: "direct",
        domains,
        participants: [current.id, target.id],
        meta: {
          transformationStatus: "unresolved",
          targetElement: combination.element,
        },
      }));
    }

    const control = combination
      ? null
      : findStemControl(current.stem, target.stem);
    if (control) {
      facts.push(createFact({
        stage,
        category: "direct",
        type: "stem_control",
        label: "天干相克",
        source,
        text: `${pairSource}：${control.controller}克${control.controlled}，外显主题之间存在制约、压力或取舍。`,
        strength: 3,
        polarity: "pressure",
        status: "direct",
        domains,
        participants: [current.id, target.id],
        meta: {
          controller: control.controller,
          controlled: control.controlled,
          direction:
            control.controller === current.stem
              ? "current_controls_target"
              : "target_controls_current",
        },
      }));
    }
  }

  const branchPairFacts = [];
  if (current.branch && target.branch) {
    if (current.branch === target.branch) {
      if (selfPunishmentBranches.has(current.branch)) {
        branchPairFacts.push(createFact({
          stage,
          category: "direct",
          type: "self_punishment",
          label: "自刑",
          source,
          text: `${pairSource}：${current.branch}${current.branch}自刑，容易表现为自我拉扯、重复施压或内部消耗。`,
          strength: 4,
          polarity: "pressure",
          domains,
          participants: [current.id, target.id],
        }));
      } else if (!isFullRepeat) {
        branchPairFacts.push(createFact({
          stage,
          category: "direct",
          type: "branch_repeat",
          label: "地支同现",
          source,
          text: `${pairSource}：${current.branch}支重复出现，环境落点和对应宫位主题容易被再次放大。`,
          strength: 3,
          polarity: "mixed",
          domains,
          participants: [current.id, target.id],
        }));
      }
    }

    findBranchRelations(current.branch, target.branch)
      .forEach((relation) => {
        branchPairFacts.push(createFact({
          stage,
          category: "direct",
          type: `branch_${relation.label}`,
          label: relation.label,
          source,
          text: `${pairSource}：${current.branch}与${target.branch}成${relation.label}，${relation.effect}。`,
          strength: relation.label === "冲" ? 4 : relation.label === "六合" ? 3 : 3,
          polarity: pressureLabels.has(relation.label) ? "pressure" : "mixed",
          domains,
          participants: [current.id, target.id],
        }));
      });
  }

  facts.push(...branchPairFacts);

  const hasClash = branchPairFacts.some((fact) => fact.label === "冲");
  const stemCombination = current.stem && target.stem
    ? findStemCombination(current.stem, target.stem)
    : null;
  const stemControl = current.stem && target.stem && !stemCombination
    ? findStemControl(current.stem, target.stem)
    : null;

  if (hasClash && stemControl) {
    facts.push(createFact({
      stage,
      category: "direct",
      type: "stem_control_branch_clash",
      label: "天克地冲",
      source,
      text: `${pairSource}：天干见${stemControl.controller}克${stemControl.controlled}，地支同时相冲，属于天克地冲，可按反吟倾向观察变化集中，但不能直接断具体事件。`,
      strength: 5,
      polarity: "pressure",
      domains,
      participants: [current.id, target.id],
      tags: ["反吟倾向"],
    }));
  }

  return uniqueFacts(facts);
}

function buildCombinationFacts({
  stage,
  current,
  natal,
  activeLayers,
}) {
  if (!current.branch) return [];

  const participants = [...natal, ...activeLayers]
    .filter((pillar) => pillar.branch);
  const branchSet = new Set(participants.map((pillar) => pillar.branch));
  const result = [];
  const domains = unique([
    ...domainsForTenGod(current.tenGod),
    ...participants.flatMap((pillar) => pillar.domains || []),
  ]);

  tripleHarmonyGroups.forEach((group) => {
    if (!group.members.includes(current.branch)) return;
    const present = group.members.filter((branch) => branchSet.has(branch));

    if (present.length === 3) {
      result.push(createFact({
        stage,
        category: "combination",
        type: "triple_harmony",
        label: "三合局条件",
        source: "多层组合",
        text: `${group.members.join("")}三合${group.element}局三支已齐，但这里只确认组合条件；是否成局、化气仍需结合月令、中神旺衰、透干、制化及是否被冲破。`,
        strength: 5,
        polarity: "mixed",
        status: "condition_only",
        domains,
        participants: participants
          .filter((pillar) => group.members.includes(pillar.branch))
          .map((pillar) => pillar.id),
        meta: {
          element: group.element,
          formationStatus: "unresolved",
          conditionType: "triple_harmony",
        },
      }));
      return;
    }

    if (present.length !== 2) return;

    const halfPair = halfHarmonyPairs.find((pair) =>
      samePair(pair.members, present),
    );

    if (halfPair) {
      result.push(createFact({
        stage,
        category: "combination",
        type: "half_harmony",
        label: "半合条件",
        source: "多层组合",
        text: `${present.join("")}为${halfPair.subtype}，具备${halfPair.element}局半合条件；中神已参与，但尚未齐三支，不能直接按成局或化气处理。`,
        strength: 3,
        polarity: "mixed",
        status: "condition_only",
        domains,
        participants: participants
          .filter((pillar) => present.includes(pillar.branch))
          .map((pillar) => pillar.id),
        meta: {
          element: halfPair.element,
          subtype: halfPair.subtype,
          formationStatus: "unresolved",
          conditionType: "half_harmony",
        },
      }));
      return;
    }

    const archPair = archHarmonyPairs.find((pair) =>
      samePair(pair.members, present),
    );

    if (archPair) {
      result.push(createFact({
        stage,
        category: "combination",
        type: "arch_harmony",
        label: "拱合条件",
        source: "多层组合",
        text: `${present.join("")}缺${group.members.find((branch) => !present.includes(branch)) || "中神"}，只具备拱${archPair.element}条件；可作为主题牵连线索，但强度低于半合，不能按成局处理。`,
        strength: 2,
        polarity: "mixed",
        status: "arch_condition",
        domains,
        participants: participants
          .filter((pillar) => present.includes(pillar.branch))
          .map((pillar) => pillar.id),
        meta: {
          element: archPair.element,
          formationStatus: "unresolved",
          conditionType: "arch_harmony",
        },
      }));
    }
  });

  tripleMeetingGroups.forEach((group) => {
    if (!group.members.includes(current.branch)) return;
    const present = group.members.filter((branch) => branchSet.has(branch));

    if (present.length === 3) {
      result.push(createFact({
        stage,
        category: "combination",
        type: "triple_meeting",
        label: "三会局条件",
        source: "多层组合",
        text: `${group.members.join("")}三会${group.element}局三支已齐，但这里只确认方气聚集条件；是否真正成势仍需结合月令、透干、制化和是否被冲散。`,
        strength: 5,
        polarity: "mixed",
        status: "condition_only",
        domains,
        participants: participants
          .filter((pillar) => group.members.includes(pillar.branch))
          .map((pillar) => pillar.id),
        meta: {
          element: group.element,
          formationStatus: "unresolved",
          conditionType: "triple_meeting",
        },
      }));
      return;
    }

    if (present.length !== 2) return;

    const partialPair = partialMeetingPairs.find((pair) =>
      samePair(pair.members, present),
    );

    if (partialPair) {
      result.push(createFact({
        stage,
        category: "combination",
        type: "partial_meeting",
        label: "三会两支",
        source: "多层组合",
        text: `${present.join("")}为相邻方气两支，具备${partialPair.element}方聚集条件；气势有靠拢倾向，但尚不能按完整三会局处理。`,
        strength: 3,
        polarity: "mixed",
        status: "condition_only",
        domains,
        participants: participants
          .filter((pillar) => present.includes(pillar.branch))
          .map((pillar) => pillar.id),
        meta: {
          element: partialPair.element,
          formationStatus: "unresolved",
          conditionType: "partial_meeting",
        },
      }));
      return;
    }

    const archPair = archMeetingPairs.find((pair) =>
      samePair(pair.members, present),
    );

    if (archPair) {
      result.push(createFact({
        stage,
        category: "combination",
        type: "arch_meeting",
        label: "拱会条件",
        source: "多层组合",
        text: `${present.join("")}隔位相见，只具备拱${archPair.element}方气条件；可观察环境趋向，但强度低于相邻两支，不能按三会局处理。`,
        strength: 2,
        polarity: "mixed",
        status: "arch_condition",
        domains,
        participants: participants
          .filter((pillar) => present.includes(pillar.branch))
          .map((pillar) => pillar.id),
        meta: {
          element: archPair.element,
          formationStatus: "unresolved",
          conditionType: "arch_meeting",
        },
      }));
    }
  });

  triplePunishmentGroups.forEach((group) => {
    if (!group.members.includes(current.branch)) return;
    const present = group.members.filter((branch) => branchSet.has(branch));
    if (present.length !== 3) return;

    result.push(createFact({
      stage,
      category: "combination",
      type: "triple_punishment",
      label: "三刑组合",
      source: "多层组合",
      text: `${group.members.join("")}三刑三支齐全（${group.name}），规则压力、摩擦和内耗容易集中；是否明显应事仍需结合原局承接和现实触发。`,
      strength: 5,
      polarity: "pressure",
      status: "condition_only",
      domains,
      participants: participants
        .filter((pillar) => group.members.includes(pillar.branch))
        .map((pillar) => pillar.id),
      meta: {
        formationStatus: "unresolved",
        conditionType: "triple_punishment",
      },
    }));
  });

  return uniqueFacts(result);
}

function buildConvergenceFacts({
  stage,
  natal,
  activeLayers,
}) {
  const result = [];

  natal.forEach((natalPillar) => {
    const activatedBy = activeLayers
      .map((layer) => ({
        layer,
        strength: activationStrength(layer, natalPillar),
      }))
      .filter((entry) => entry.strength >= 3)
      .map((entry) => entry.layer);

    if (activatedBy.length < 2) return;

    result.push(createFact({
      stage,
      category: "convergence",
      type: "multi_layer_activation",
      label: "多层重复激活",
      source: "层级汇合",
      text: `${activatedBy.map((pillar) => pillar.displayName).join("、")}同时以地支关系或整柱重复牵动原局${natalPillar.displayName}，${pillarRoleText(natalPillar.key)}更容易成为当前阶段的共同落点。`,
      strength: Math.min(5, 3 + activatedBy.length - 1),
      polarity: "mixed",
      status: "inferred",
      domains: natalPillar.domains,
      participants: [natalPillar.id, ...activatedBy.map((pillar) => pillar.id)],
    }));
  });

  const activatedPillars = natal.filter((natalPillar) =>
    activeLayers.some((layer) => activationStrength(layer, natalPillar) >= 3),
  );

  if (activatedPillars.length >= 2) {
    const isMulti = activatedPillars.length >= 3;
    result.push(createFact({
      stage,
      category: "convergence",
      type: isMulti ? "multi_domain_activation" : "dual_domain_activation",
      label: isMulti ? "多领域联动" : "双领域联动",
      source: "层级汇合",
      text: `当前岁运以地支关系或整柱重复同时牵动原局${activatedPillars.map((pillar) => pillar.displayName).join("、")}，说明变化可能形成${isMulti ? "多领域" : "两个领域"}联动，需要按主次分层复核。`,
      strength: isMulti ? 5 : 4,
      polarity: "mixed",
      status: "inferred",
      domains: unique(activatedPillars.flatMap((pillar) => pillar.domains)),
      participants: activatedPillars.map((pillar) => pillar.id),
    }));
  }

  return result;
}

function buildHierarchyFacts({
  stage,
  current,
  parents,
  directFacts,
}) {
  const result = [];

  parents.forEach((parent) => {
    const pairFacts = directFacts.filter((fact) =>
      fact.participants?.includes(current.id) &&
      fact.participants?.includes(parent.id),
    );

    const hasFullRepeat = pairFacts.some((fact) => fact.label === "伏吟");
    const hasBranchRepeat = pairFacts.some((fact) =>
      ["地支同现"].includes(fact.label),
    );
    const hasStemRepeat = pairFacts.some((fact) => fact.label === "天干同现");
    const hasConnection = pairFacts.some((fact) =>
      ["六合", "天干五合"].includes(fact.label),
    );
    const hasStrongPressure = pairFacts.some((fact) =>
      ["冲", "刑", "害", "破", "自刑", "天克地冲"].includes(fact.label),
    );

    let tone = "parallel";
    let label = "层级并行";
    let text = `${current.displayName}与${parent.displayName}暂未形成明显的重复、地支强关系或上下层制约，先分别观察各自主题。`;
    let strength = 1.8;
    let polarity = "neutral";
    let status = "inferred";

    if ((hasFullRepeat || hasBranchRepeat) && hasStrongPressure) {
      tone = "mixed";
      label = "一边加力一边牵制";
      text = `${current.displayName}与${parent.displayName}既有整柱或地支重复，又有冲刑害破等制约，主题会被放大，但推进方式容易拉扯、调整或反复。`;
      strength = 5;
      polarity = "mixed";
    } else if (hasFullRepeat || hasBranchRepeat) {
      tone = "reinforce";
      label = "层级同向加力";
      text = `${current.displayName}与${parent.displayName}存在${hasFullRepeat ? "整柱重复" : "地支重复"}，现实落点更容易沿上一层背景继续放大。`;
      strength = hasFullRepeat ? 4.5 : 4;
      polarity = "mixed";
    } else if (hasStrongPressure) {
      tone = "conflict";
      label = "层级牵制转向";
      text = `${current.displayName}与${parent.displayName}存在冲刑害破或天克地冲，当前阶段更可能对上一层背景形成调整、打断或转向。`;
      strength = 4;
      polarity = "pressure";
    } else if (hasConnection) {
      tone = "connection";
      label = "层级牵连";
      text = `${current.displayName}与${parent.displayName}存在合象或五合牵连，当前主题更容易被合作、关系或既有条件连接；合化与吉凶仍未判定。`;
      strength = 3;
      polarity = "mixed";
      status = "condition_only";
    } else if (hasStemRepeat) {
      tone = "stem_repeat";
      label = "外显主线重复";
      text = `${current.displayName}与${parent.displayName}天干相同，外显主题连续出现；这只说明主线重复，现实是否加重仍要看地支和原局承接。`;
      strength = 2.5;
      polarity = "mixed";
    } else {
      const direction = findStemElementRelation(current.stem, parent.stem);

      if (direction?.type === "parent_generates_current") {
        tone = "support";
        label = "上层生扶当前";
        text = `${parent.displayName}天干五行生${current.displayName}天干五行，上层背景对当前主题形成生扶；是否真正有利仍需结合十神性质与原局喜忌。`;
        strength = 3;
        polarity = "mixed";
      } else if (direction?.type === "current_generates_parent") {
        tone = "output";
        label = "当前向上输出";
        text = `${current.displayName}天干五行生${parent.displayName}天干五行，当前层更像向上一层输出、泄化或提供条件，可能带来付出与承接并存。`;
        strength = 3;
        polarity = "mixed";
      } else if (direction?.type === "current_controls_parent") {
        tone = "current_controls";
        label = "当前制约上层";
        text = `${current.displayName}天干五行克${parent.displayName}天干五行，当前层对上一层背景形成制约或改造，可能表现为主动调整、挑战旧规则或改变推进方式。`;
        strength = 3;
        polarity = "mixed";
      } else if (direction?.type === "parent_controls_current") {
        tone = "parent_controls";
        label = "上层约束当前";
        text = `${parent.displayName}天干五行克${current.displayName}天干五行，上层背景对当前行动形成约束、筛选或压力，推进需要服从既有条件。`;
        strength = 3;
        polarity = "pressure";
      } else if (direction?.type === "same_element") {
        tone = "same_element";
        label = "同气并行";
        text = `${current.displayName}与${parent.displayName}天干同属${direction.element}，外显方向相近，但不等同整柱伏吟或现实必然加重。`;
        strength = 2.2;
        polarity = "mixed";
      }
    }

    result.push(createFact({
      stage,
      category: "hierarchy",
      type: `hierarchy_${tone}`,
      label,
      source: "层级关系",
      text,
      strength,
      polarity,
      status,
      domains: unique([
        ...domainsForTenGod(current.tenGod),
        ...domainsForTenGod(parent.tenGod),
      ]),
      participants: [current.id, parent.id],
      meta: {
        tone,
        parentLevel: parent.level,
        stemDirection: findStemElementRelation(current.stem, parent.stem)?.type || "",
      },
    }));
  });

  return result;
}

function buildSummary({
  stage,
  current,
  facts,
  hierarchyFacts,
  convergenceFacts,
}) {
  const highFacts = facts.filter((fact) => Number(fact.strength || 0) >= 4);
  const pressureCount = facts.filter((fact) => fact.polarity === "pressure").length;
  const tones = hierarchyFacts.map((fact) => fact.meta?.tone).filter(Boolean);

  let tone = "平行观察";
  if (tones.includes("mixed")) tone = "加力与牵制并存";
  else if (tones.includes("conflict")) tone = "层级牵制转向";
  else if (tones.includes("reinforce")) tone = "层级重复加力";
  else if (tones.includes("parent_controls")) tone = "上层约束当前";
  else if (tones.includes("current_controls")) tone = "当前制约上层";
  else if (tones.includes("support")) tone = "上层生扶当前";
  else if (tones.includes("output")) tone = "当前向上输出";
  else if (convergenceFacts.some((fact) => fact.label === "多领域联动")) tone = "原局多点被牵动";
  else if (pressureCount >= 2) tone = "压力触发偏集中";

  const topLabels = unique(
    highFacts
      .filter((fact) => fact.status !== "arch_condition")
      .map((fact) => fact.label),
  ).slice(0, 4);
  const stageName = stageLabels[stage];

  return {
    tone,
    labels: topLabels,
    factCount: facts.length,
    highFactCount: highFacts.length,
    convergenceCount: convergenceFacts.length,
    text: `${current.ganZhi || current.displayName}${stageName}当前呈现“${tone}”的层级结构${topLabels.length ? `，重点见${topLabels.join("、")}` : ""}。`,
  };
}

function activationStrength(layer, natalPillar) {
  if (!layer || !natalPillar) return 0;

  if (
    layer.stem && layer.branch &&
    natalPillar.stem && natalPillar.branch &&
    layer.stem === natalPillar.stem &&
    layer.branch === natalPillar.branch
  ) {
    return 5;
  }

  let strength = 0;

  if (layer.branch && natalPillar.branch) {
    if (layer.branch === natalPillar.branch) {
      strength = Math.max(strength, 4);
    }

    const branchFacts = findBranchRelations(
      layer.branch,
      natalPillar.branch,
    );

    if (branchFacts.some((fact) => ["冲", "刑", "害", "破"].includes(fact.label))) {
      strength = Math.max(strength, 4);
    } else if (branchFacts.length) {
      strength = Math.max(strength, 3);
    }
  }

  /*
   * 单独天干同现、五合或相克只作为背景关联，
   * 不再直接把整柱计入多层重复激活。
   */
  if (layer.stem && natalPillar.stem) {
    if (layer.stem === natalPillar.stem) {
      strength = Math.max(strength, 2);
    } else if (findStemCombination(layer.stem, natalPillar.stem)) {
      strength = Math.max(strength, 2);
    } else if (findStemControl(layer.stem, natalPillar.stem)) {
      strength = Math.max(strength, 1);
    }
  }

  return strength;
}

function normalizeNatalPillars(pillars) {
  return array(pillars)
    .map((pillar, index) => {
      const key = pillar?.key || ["year", "month", "day", "hour"][index] || `pillar${index}`;
      const normalized = normalizePillar(pillar, "natal", pillarLabels[key] || pillar?.name || key);
      return {
        ...normalized,
        key,
        domains: pillarDomains[key] || [],
      };
    })
    .filter((pillar) => pillar.stem || pillar.branch);
}

function normalizePillar(pillar = {}, level = "unknown", displayName = "阶段") {
  const stem = String(pillar?.stem || "").trim();
  const branch = String(pillar?.branch || "").trim();
  const ganZhi = String(pillar?.ganZhi || pillar?.label || `${stem}${branch}`).trim();
  const levelLabel = stageLabels[level] || displayName || level;

  return {
    id: String(pillar?.id || `${level}:${pillar?.key || ganZhi || displayName}`).trim(),
    level,
    displayName: String(pillar?.displayName || displayName || levelLabel).trim(),
    ganZhi,
    stem,
    branch,
    tenGod: pillar?.tenGod || pillar?.stemTenGod || "",
    branchTenGod: pillar?.branchTenGod || pillar?.branchMainTenGod || "",
    domains: unique([
      ...array(pillar?.domains),
      ...domainsForTenGod(pillar?.tenGod || pillar?.stemTenGod),
      ...domainsForTenGod(pillar?.branchTenGod || pillar?.branchMainTenGod),
    ]),
  };
}

function buildParentLayers(stage, luckPillar, yearPillar) {
  const result = [];

  if ((stage === "year" || stage === "month") && luckPillar) {
    result.push(normalizePillar(luckPillar, "luck", "大运"));
  }

  if (stage === "month" && yearPillar) {
    result.push(normalizePillar(yearPillar, "year", "流年"));
  }

  return result.filter((pillar) => pillar.stem || pillar.branch);
}

function findStemCombination(left, right) {
  return stemCombinations
    .map(([first, second, element]) => ({ first, second, element }))
    .find((item) => samePair([item.first, item.second], [left, right])) || null;
}

function findStemControl(left, right) {
  const leftElement = stemElements[left];
  const rightElement = stemElements[right];
  if (!leftElement || !rightElement || leftElement === rightElement) return null;

  if (controllingElement[leftElement] === rightElement) {
    return { controller: left, controlled: right };
  }

  if (controllingElement[rightElement] === leftElement) {
    return { controller: right, controlled: left };
  }

  return null;
}

function findStemElementRelation(currentStem, parentStem) {
  const currentElement = stemElements[currentStem];
  const parentElement = stemElements[parentStem];

  if (!currentElement || !parentElement) return null;

  if (currentElement === parentElement) {
    return {
      type: "same_element",
      currentElement,
      parentElement,
      element: currentElement,
    };
  }

  if (generatingElement[parentElement] === currentElement) {
    return {
      type: "parent_generates_current",
      currentElement,
      parentElement,
    };
  }

  if (generatingElement[currentElement] === parentElement) {
    return {
      type: "current_generates_parent",
      currentElement,
      parentElement,
    };
  }

  if (controllingElement[currentElement] === parentElement) {
    return {
      type: "current_controls_parent",
      currentElement,
      parentElement,
    };
  }

  if (controllingElement[parentElement] === currentElement) {
    return {
      type: "parent_controls_current",
      currentElement,
      parentElement,
    };
  }

  return {
    type: "unrelated",
    currentElement,
    parentElement,
  };
}

function findBranchRelations(left, right) {
  if (!left || !right || left === right) return [];
  const seen = new Set();

  return branchRelations
    .filter(([, members]) => samePair(members, [left, right]))
    .map(([label, members, effect]) => ({
      label,
      members: members.join(""),
      effect,
    }))
    .filter((relation) => {
      const key = `${relation.label}|${relation.members.split("").sort().join("")}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function domainsForTenGod(tenGod) {
  return tenGodDomains[tenGod] || [];
}

function pillarRoleText(key) {
  return {
    year: "家庭、根基和早年结构",
    month: "事业环境、成长秩序和工作规则",
    day: "关系、亲密互动和合作模式",
    hour: "执行、后期规划和结果层",
  }[key] || "对应原局结构";
}

function createFact({
  stage,
  category,
  type,
  label,
  source,
  text,
  strength = 1,
  polarity = "neutral",
  status = "direct",
  domains = [],
  participants = [],
  tags = [],
  meta = {},
}) {
  const cleanParticipants = unique(participants.filter(Boolean));
  const id = [
    "transit",
    stage,
    category,
    type,
    ...cleanParticipants,
  ]
    .join(":")
    .replaceAll(/\s+/g, "");

  return {
    id,
    stage,
    category,
    type,
    label,
    source,
    text,
    description: text,
    strength,
    polarity,
    status,
    domains: unique(domains),
    participants: cleanParticipants,
    evidenceRefs: [id],
    tags: unique(tags),
    meta,
  };
}

function uniqueFacts(facts) {
  const seen = new Set();
  return array(facts).filter((fact) => {
    if (!fact) return false;
    const key = fact.id || [fact.label, fact.source, fact.text].join("|");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function samePair(left, right) {
  return left.length === right.length && left.every((item) => right.includes(item));
}

function array(value) {
  return Array.isArray(value) ? value : value ? [value] : [];
}

function unique(values) {
  return [...new Set(array(values).flat().filter(Boolean).map((value) => String(value)))];
}
