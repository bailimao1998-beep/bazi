import {
  natalProfessionalPatternRules,
} from "./professionalPatternRuleDatabase.js";

import {
  compareNatalProfessionalImages,
  selectNatalPrimaryImage,
} from "./professionalImageRanking.js";

export const NATAL_PROFESSIONAL_PATTERN_VERSION =
  "natal-professional-pattern-v1";

const tenGodGroupMembers = {
  resource: [
    "正印",
    "偏印",
  ],

  peer: [
    "比肩",
    "劫财",
  ],

  output: [
    "食神",
    "伤官",
  ],

  wealth: [
    "正财",
    "偏财",
  ],

  officer: [
    "正官",
    "七杀",
  ],
};

const confidenceRank = {
  unknown: 0,
  low: 1,
  medium: 2,
  high: 3,
};

export function buildNatalProfessionalPatterns({
  structureSynopsis = {},
  professionalContext = {},
  workChains = {},
  rules = natalProfessionalPatternRules,
} = {}) {
  const context =
    buildPatternContext({
      structureSynopsis,
      professionalContext,
      workChains,
    });

  const images = [];
  const suppressedPatterns = [];
  const warnings = [];

  for (
    const rule of
    Array.isArray(rules)
      ? rules
      : []
  ) {
    try {
      const evaluation =
        evaluateProfessionalRule(
          rule,
          context,
        );

      if (!evaluation) {
        continue;
      }

      if (
        evaluation.blockingEvidence
          ?.length
      ) {
        suppressedPatterns.push(
          createPatternImage(
            rule,
            evaluation,
          ),
        );

        continue;
      }

      images.push(
        createPatternImage(
          rule,
          evaluation,
        ),
      );
    } catch (error) {
      warnings.push(
        `${rule?.id || "unknown_rule"}: ${
          error?.message ||
          "unknown error"
        }`,
      );
    }
  }

  const sortedImages =
    images
      .slice()
      .sort(
        compareNatalProfessionalImages,
      );

  const primaryImage =
    selectNatalPrimaryImage(
      sortedImages,
    );

  return {
    version:
      NATAL_PROFESSIONAL_PATTERN_VERSION,

    mode:
      "professional",

    images:
      sortedImages,

    primaryImage,

    secondaryImages:
      sortedImages
        .filter(
          (image) =>
            image !==
            primaryImage,
        )
        .slice(0, 5),

    byRole:
      buildByRole(
        sortedImages,
      ),

    suppressedPatterns:
      suppressedPatterns
        .sort(
          compareNatalProfessionalImages,
        ),

    summary: {
      totalRules:
        Array.isArray(rules)
          ? rules.length
          : 0,

      hitRules:
        sortedImages.length,

      suppressedRules:
        suppressedPatterns.length,

      primaryRuleId:
        primaryImage?.ruleId ||
        "",
    },

    warnings:
      uniqueText(warnings),
  };
}

function buildPatternContext({
  structureSynopsis,
  professionalContext,
  workChains,
}) {
  const groups =
    Object.fromEntries(
      Object.entries(
        tenGodGroupMembers,
      ).map(
        ([key, names]) => [
          key,
          buildTenGodGroup({
            key,
            names,
            professionalContext,
          }),
        ],
      ),
    );

  return {
    structureSynopsis,
    professionalContext,

    strengthState:
      normalizeText(
        structureSynopsis
          .dayMaster
          ?.strengthState,
      ) || "unknown",

    groups,

    spousePalace:
      professionalContext
        .palaces
        ?.spousePalace ??
      {},

    spouse:
      professionalContext
        .kinships
        ?.spouse ??
      {},

    relations:
      Array.isArray(
        professionalContext
          .relations,
      )
        ? professionalContext
            .relations
        : [],

    workChains:
      normalizeWorkChainContext(
        workChains,
      ),
  };
}

function buildTenGodGroup({
  key,
  names,
  professionalContext,
}) {
  const states =
    names
      .map(
        (name) =>
          professionalContext
            .tenGods
            ?.[name],
      )
      .filter(Boolean);

  const positions =
    states.flatMap(
      (state) =>
        state.positions ?? [],
    );

  const hostPositions =
    states.flatMap(
      (state) =>
        state.hostPositions ??
        [],
    );

  const guestPositions =
    states.flatMap(
      (state) =>
        state.guestPositions ??
        [],
    );

  const total =
    round(
      states.reduce(
        (sum, state) =>
          sum +
          finite(
            state.weightedCount,
          ),
        0,
      ),
    );

  const visibleCount =
    states.reduce(
      (sum, state) =>
        sum +
        finite(
          state.visibleCount,
        ),
      0,
    );

  const isRelationAffected =
    states.some(
      (state) =>
        Boolean(
          state
            .isRelationAffected ??
          state.isBlocked,
        ),
    );

  return {
    key,
    names,
    states,
    total,
    visibleCount,
    positions,
    hostPositions,
    guestPositions,

    hasRoot:
      states.some(
        (state) =>
          state.hasRoot,
      ),

    isVisible:
      states.some(
        (state) =>
          state.isVisible,
      ),

    isHiddenOnly:
      states.length > 0 &&
      states.every(
        (state) =>
          state.isHiddenOnly ||
          !state.isVisible,
      ),

    isRelationAffected,

    placementScope:
      resolvePlacementScope({
        hostPositions,
        guestPositions,
      }),

    strong:
      total >= 2 ||
      states.some(
        (state) =>
          state.strengthLevel ===
          "strong",
      ),

    evidence:
      uniqueText(
        states.map(
          (state) =>
            state.statusText,
        ),
      ),
  };
}

function normalizeWorkChainContext(
  workChains = {},
) {
  const nodes =
    Array.isArray(
      workChains.nodes,
    )
      ? workChains.nodes
      : [];

  const edges =
    Array.isArray(
      workChains.edges,
    )
      ? workChains.edges
      : [];

  const chains =
    Array.isArray(
      workChains.chains,
    )
      ? workChains.chains
      : [];

  const interruptionSignals =
    Array.isArray(
      workChains
        .interruptionSignals,
    )
      ? workChains
          .interruptionSignals
      : [];

  return {
    version:
      workChains.version ?? "",

    nodes,
    edges,
    chains,
    interruptionSignals,

    nodeById:
      Object.fromEntries(
        nodes.map(
          (node) => [
            node.id,
            node,
          ],
        ),
      ),

    edgeById:
      Object.fromEntries(
        edges.map(
          (edge) => [
            edge.id,
            edge,
          ],
        ),
      ),
  };
}

function findBestWorkPath(
  workChains,
  {
    fromGroups = [],
    toGroups = [],
    semanticTypes = [],
  } = {},
) {
  const candidates =
    workChains.chains
      .map((chain) => {
        const nodes =
          chain.nodeIds
            .map(
              (nodeId) =>
                workChains
                  .nodeById[
                  nodeId
                ],
            )
            .filter(Boolean);

        const edges =
          chain.edgeIds
            .map(
              (edgeId) =>
                workChains
                  .edgeById[
                  edgeId
                ],
            )
            .filter(Boolean);

        const start =
          nodes[0];

        const end =
          nodes.at(-1);

        if (
          !start ||
          !end ||
          !fromGroups.includes(
            start.tenGodGroup,
          ) ||
          !toGroups.includes(
            end.tenGodGroup,
          )
        ) {
          return null;
        }

        if (
          !edges.length ||
          !edges.every(
            (edge) =>
              semanticTypes.includes(
                edge.semanticType,
              ),
          )
        ) {
          return null;
        }

        return {
          chain,
          nodes,
          edges,

          activationLevel:
            chain.activationLevel ??
            "potential",

          confidence:
            chain.confidence ??
            "unknown",

          hiddenNodeCount:
            Number(
              chain.hiddenNodeCount ??
              0,
            ),

          priorityScore:
            Number(
              chain.priorityScore ??
              0,
            ),

          evidenceText:
            nodes
              .map(
                describeWorkNode,
              )
              .join(" → "),
        };
      })
      .filter(Boolean)
      .sort(
        compareWorkPaths,
      );

  return (
    candidates[0] ??
    null
  );
}

function compareWorkPaths(
  left,
  right,
) {
  return (
    workActivationRank(
      right.activationLevel,
    ) -
      workActivationRank(
        left.activationLevel,
      ) ||
    workConfidenceRank(
      right.confidence,
    ) -
      workConfidenceRank(
        left.confidence,
      ) ||
    left.hiddenNodeCount -
      right.hiddenNodeCount ||
    right.priorityScore -
      left.priorityScore
  );
}

function workActivationRank(
  value,
) {
  return {
    potential: 1,
    mixed: 2,
    activated: 3,
  }[value] ?? 0;
}

function workConfidenceRank(
  value,
) {
  return {
    unknown: 0,
    low: 1,
    medium: 2,
    high: 3,
  }[value] ?? 0;
}

function describeWorkNode(
  node = {},
) {
  const position = {
    year: "年柱",
    month: "月柱",
    day: "日柱",
    hour: "时柱",
  }[
    node.pillar
  ] || node.pillar || "未知柱位";

  return `${position}${node.tenGod || "未知十神"}`;
}

function resolvePathInterruptions(
  workChains,
  path,
) {
  if (!path) {
    return [];
  }

  const nodeIds =
    new Set(
      path.chain.nodeIds,
    );

  return workChains
    .interruptionSignals
    .filter(
      (edge) =>
        nodeIds.has(
          edge.source,
        ) ||
        nodeIds.has(
          edge.target,
        ),
    );
}

function serializeWorkPath(
  path,
) {
  if (!path) {
    return null;
  }

  return {
    chainId:
      path.chain.id,

    nodeIds:
      [...path.chain.nodeIds],

    edgeIds:
      [...path.chain.edgeIds],

    activationLevel:
      path.activationLevel,

    confidence:
      path.confidence,

    hiddenNodeCount:
      path.hiddenNodeCount,

    priorityScore:
      path.priorityScore,

    evidenceText:
      path.evidenceText,
  };
}

function evaluateProfessionalRule(
  rule,
  context,
) {
  switch (rule.id) {
    case "professional_resource_peer_dominance":
      return evaluateResourcePeerDominance(
        rule,
        context,
      );

    case "professional_resource_output_imbalance":
      return evaluateResourceOutputImbalance(
        rule,
        context,
      );

    case "professional_peer_wealth_pressure":
      return evaluatePeerWealthPressure(
        rule,
        context,
      );

    case "professional_output_wealth_work_chain":
      return evaluateOutputWealthWorkChain(
        rule,
        context,
      );

    case "professional_official_resource_work_chain":
      return evaluateOfficialResourceWorkChain(
        rule,
        context,
      );

    case "professional_spouse_palace_tension_stack":
      return evaluateSpousePalaceTensionStack(
        rule,
        context,
      );

    case "professional_spouse_star_guest_position":
      return evaluateSpouseStarGuestPosition(
        rule,
        context,
      );

    case "professional_output_anchor_in_host":
      return evaluateOutputAnchorInHost(
        rule,
        context,
      );

    default:
      return null;
  }
}

function evaluateResourcePeerDominance(
  rule,
  context,
) {
  const resource =
    context.groups.resource;

  const peer =
    context.groups.peer;

  const output =
    context.groups.output;

  const officer =
    context.groups.officer;

  const thresholds =
    rule.thresholds ?? {};

  if (
    context.strengthState !==
      "strong" ||
    resource.total <
      finite(
        thresholds.resourceMin,
      ) ||
    peer.total <
      finite(
        thresholds.peerMin,
      )
  ) {
    return null;
  }

  const supportingEvidence =
    uniqueText([
      `日主状态为${context.strengthState}`,
      `印星加权约${resource.total}`,
      `比劫加权约${peer.total}`,
      resource.isVisible
        ? "印星有透出"
        : "",

      peer.hasRoot
        ? "比劫有根"
        : "",
    ]);

  const weakeningEvidence =
    uniqueText([
      output.total >= 1.2
        ? `食伤加权约${output.total}，已有较明显泄化`
        : "",

      officer.total >= 1
        ? `官杀加权约${officer.total}，存在约束比劫的力量`
        : "",
    ]);

  const confirmed =
    resource.total >=
      finite(
        thresholds.confirmedResourceMin,
      ) &&
    peer.total >=
      finite(
        thresholds.confirmedPeerMin,
      );

  return {
    status:
      confirmed
        ? "confirmed"
        : "conditional",

    confidence:
      confirmed
        ? "high"
        : "medium",

    evidence:
      [
        ...resource.evidence,
        ...peer.evidence,
      ],

    supportingEvidence,
    weakeningEvidence,
    blockingEvidence: [],
  };
}

function evaluateResourceOutputImbalance(
  rule,
  context,
) {
  const resource =
    context.groups.resource;

  const output =
    context.groups.output;

  const thresholds =
    rule.thresholds ?? {};

  if (
    resource.total <
      finite(
        thresholds.resourceMin,
      ) ||
    output.total >
      finite(
        thresholds.outputMax,
      )
  ) {
    return null;
  }

  const supportingEvidence =
    uniqueText([
      `印星加权约${resource.total}`,
      `食伤加权约${output.total}`,
      resource.isVisible
        ? "印星有明显透出"
        : "",

      output.total <= 0.7
        ? "食伤整体偏弱"
        : "",
    ]);

  const weakeningEvidence =
    uniqueText([
      output.hostPositions.length
        ? "食伤在日时主位仍有出口"
        : "",

      output.hasRoot
        ? "食伤有根，并非完全无力"
        : "",
    ]);

  const confirmed =
    context.strengthState ===
      "strong" &&
    resource.total >=
      finite(
        thresholds.confirmedResourceMin,
      ) &&
    output.total <=
      finite(
        thresholds.confirmedOutputMax,
      );

  return {
    status:
      confirmed
        ? "confirmed"
        : "conditional",

    confidence:
      confirmed
        ? "high"
        : "medium",

    evidence:
      [
        ...resource.evidence,
        ...output.evidence,
      ],

    supportingEvidence,
    weakeningEvidence,
    blockingEvidence: [],
  };
}

function evaluatePeerWealthPressure(
  rule,
  context,
) {
  const peer =
    context.groups.peer;

  const wealth =
    context.groups.wealth;

  const officer =
    context.groups.officer;

  const thresholds =
    rule.thresholds ?? {};

  if (
    peer.total <
      finite(
        thresholds.peerMin,
      ) ||
    wealth.total <
      finite(
        thresholds.wealthMin,
      )
  ) {
    return null;
  }

  const blockingEvidence =
    uniqueText([
      wealth.strong &&
      wealth.total >
        peer.total * 1.2
        ? "财星自身强于比劫，本规则不应作为主要结构"
        : "",
    ]);

  const supportingEvidence =
    uniqueText([
      `比劫加权约${peer.total}`,
      `财星加权约${wealth.total}`,
      peer.strong
        ? "比劫力量集中"
        : "",

      wealth.placementScope ===
        "guest"
        ? "财星主要落宾位"
        : "",

      wealth.total <= 0.8
        ? "财星力量相对有限"
        : "",
    ]);

  const weakeningEvidence =
    uniqueText([
      officer.total >= 1
        ? "官杀有相对力量，可约束比劫"
        : "",

      wealth.strong
        ? "财星自身有力，承载能力较好"
        : "",

      wealth.hostPositions.length
        ? "财星在主位有直接承接"
        : "",
    ]);

  const confirmed =
    context.strengthState ===
      "strong" &&
    peer.total >=
      finite(
        thresholds.confirmedPeerMin,
      ) &&
    wealth.total <=
      finite(
        thresholds.weakWealthMax,
      );

  return {
    status:
      confirmed
        ? "confirmed"
        : "conditional",

    confidence:
      confirmed
        ? "high"
        : "medium",

    evidence:
      [
        ...peer.evidence,
        ...wealth.evidence,
      ],

    supportingEvidence,
    weakeningEvidence,
    blockingEvidence,
  };
}

function evaluateOutputWealthWorkChain(
  rule,
  context,
) {
  const output =
    context.groups.output;

  const wealth =
    context.groups.wealth;

  const thresholds =
    rule.thresholds ?? {};

  if (
    output.total <
      finite(
        thresholds.outputMin,
      ) ||
    wealth.total <
      finite(
        thresholds.wealthMin,
      )
  ) {
    return null;
  }

  const workPath =
    findBestWorkPath(
      context.workChains,
      {
        fromGroups: [
          "output",
        ],

        toGroups: [
          "wealth",
        ],

        semanticTypes: [
          "generate",
        ],
      },
    );

  const interruptions =
    resolvePathInterruptions(
      context.workChains,
      workPath,
    );

  const workStatus =
    !workPath
      ? "presence_only"
      : workPath.activationLevel ===
          "activated"
        ? "activated"
        : "connected";

  const supportingEvidence =
    uniqueText([
      `食伤加权约${output.total}`,
      `财星加权约${wealth.total}`,
      output.hostPositions.length
        ? "食伤在主位有成果出口"
        : "",

      wealth.hasRoot
        ? "财星有根"
        : "",

      workPath
        ? `做功链：${workPath.evidenceText}`
        : "",

      workStatus ===
        "activated"
        ? "workChains识别为原局激活连接"
        : "",
    ]);

  const weakeningEvidence =
    uniqueText([
      !workPath
        ? "现有workChains未识别食伤到财星的方向连接，不能仅凭二者同时存在认定食伤生财做功"
        : "",

      workPath &&
      workPath.activationLevel !==
        "activated"
        ? "结构边仍为潜在连接，不能视为原局已激活做功"
        : "",

      workPath?.hiddenNodeCount > 0
        ? "路径包含藏干节点，置信度需要降低"
        : "",

      interruptions.length
        ? "路径节点受到刑冲害破类中断信号牵动"
        : "",

      output
        .isRelationAffected
        ? "食伤受到刑冲害破类关系牵动"
        : "",

      wealth
        .isRelationAffected
        ? "财星受到刑冲害破类关系牵动"
        : "",

      output.total <= 0.7
        ? "食伤出口偏弱，需要后天训练"
        : "",
    ]);

  const confirmed =
    workPath &&
    workPath.activationLevel ===
      "activated" &&
    workPath.hiddenNodeCount === 0 &&
    interruptions.length === 0 &&
    output.total >=
      finite(
        thresholds.confirmedOutputMin,
      ) &&
    wealth.total >=
      finite(
        thresholds.confirmedWealthMin,
      );

  return {
    title:
      !workPath
        ? "食伤财星并见，做功链待确认"
        : confirmed
          ? "食伤生财做功链"
          : "食伤生财结构链候选",

    role:
      confirmed
        ? "core"
        : "conditional",

    status:
      confirmed
        ? "confirmed"
        : "conditional",

    confidence:
      confirmed
        ? workPath.confidence
        : !workPath
          ? "low"
          : workPath.confidence ===
              "high"
            ? "medium"
            : workPath.confidence,

    workStatus,

    workPath:
      serializeWorkPath(
        workPath,
      ),

    evidence:
      [
        ...output.evidence,
        ...wealth.evidence,
      ],

    supportingEvidence,
    weakeningEvidence,
    blockingEvidence: [],
  };
}

function evaluateOfficialResourceWorkChain(
  rule,
  context,
) {
  const officer =
    context.groups.officer;

  const resource =
    context.groups.resource;

  const thresholds =
    rule.thresholds ?? {};

  if (
    officer.total <
      finite(
        thresholds.officerMin,
      ) ||
    resource.total <
      finite(
        thresholds.resourceMin,
      )
  ) {
    return null;
  }

  const workPath =
    findBestWorkPath(
      context.workChains,
      {
        fromGroups: [
          "officer",
        ],

        toGroups: [
          "resource",
        ],

        semanticTypes: [
          "generate",
        ],
      },
    );

  const interruptions =
    resolvePathInterruptions(
      context.workChains,
      workPath,
    );

  const workStatus =
    !workPath
      ? "presence_only"
      : workPath.activationLevel ===
          "activated"
        ? "activated"
        : "connected";

  const supportingEvidence =
    uniqueText([
      `官杀加权约${officer.total}`,
      `印星加权约${resource.total}`,
      officer.hasRoot
        ? "官杀有根"
        : "",

      resource.hasRoot
        ? "印星有根"
        : "",

      resource.hostPositions.length
        ? "印星在主位有承接"
        : "",

      workPath
        ? `做功链：${workPath.evidenceText}`
        : "",

      workStatus ===
        "activated"
        ? "workChains识别为原局激活连接"
        : "",
    ]);

  const weakeningEvidence =
    uniqueText([
      !workPath
        ? "现有workChains未识别官杀到印星的方向连接，不能仅凭二者同时存在认定官印承接做功"
        : "",

      workPath &&
      workPath.activationLevel !==
        "activated"
        ? "结构边仍为潜在连接，不能视为原局已激活做功"
        : "",

      workPath?.hiddenNodeCount > 0
        ? "路径包含藏干节点，置信度需要降低"
        : "",

      interruptions.length
        ? "路径节点受到刑冲害破类中断信号牵动"
        : "",

      officer.isHiddenOnly
        ? "官杀藏而不透，社会位置需要后天推动"
        : "",

      officer
        .isRelationAffected
        ? "官杀受到关系牵动"
        : "",

      resource
        .isRelationAffected
        ? "印星受到关系牵动"
        : "",
    ]);

  const confirmed =
    workPath &&
    workPath.activationLevel ===
      "activated" &&
    workPath.hiddenNodeCount === 0 &&
    interruptions.length === 0 &&
    officer.total >=
      finite(
        thresholds.confirmedOfficerMin,
      ) &&
    resource.total >=
      finite(
        thresholds.confirmedResourceMin,
      );

  return {
    title:
      !workPath
        ? "官印并见，承接链待确认"
        : confirmed
          ? "官印承接做功链"
          : "官印承接结构链候选",

    role:
      confirmed
        ? "support"
        : "conditional",

    status:
      confirmed
        ? "confirmed"
        : "conditional",

    confidence:
      confirmed
        ? workPath.confidence
        : !workPath
          ? "low"
          : workPath.confidence ===
              "high"
            ? "medium"
            : workPath.confidence,

    workStatus,

    workPath:
      serializeWorkPath(
        workPath,
      ),

    evidence:
      [
        ...officer.evidence,
        ...resource.evidence,
      ],

    supportingEvidence,
    weakeningEvidence,
    blockingEvidence: [],
  };
}

function evaluateSpousePalaceTensionStack(
  rule,
  context,
) {
  const relations =
    context.relations.filter(
      (relation) =>
        relation.nature ===
          "tension" &&
        relation.affects
          ?.spousePalace,
    );

  if (
    relations.length <
    finite(
      rule.thresholds
        ?.minimumTensionCount,
    )
  ) {
    return null;
  }

  const conciseTitles =
    uniqueText(
      relations.map(
        shortRelationTitle,
      ),
    );

  return {
    title:
      conciseTitles.length
        ? `夫妻宫见${conciseTitles.join(
            "、",
          )}`
        : rule.title,

    priority:
      rule.priority +
      Math.min(
        relations.length - 1,
        3,
      ) * 3,

    status:
      "confirmed",

    confidence:
      relations.every(
        (relation) =>
          relation.confidence ===
          "high",
      )
        ? "high"
        : "medium",

    evidence:
      relations.map(
        (relation) =>
          relation.title,
      ),

    supportingEvidence:
      relations.map(
        (relation) =>
          `${relation.relationLabel}直接参与夫妻宫`,
      ),

    weakeningEvidence: [],
    blockingEvidence: [],
  };
}

function evaluateSpouseStarGuestPosition(
  rule,
  context,
) {
  const spouse =
    context.spouse;

  if (
    spouse.mappingStatus !==
      "resolved" ||
    spouse.placementScope !==
      "guest" ||
    spouse.weightedCount <= 0
  ) {
    return null;
  }

  const nearest =
    spouse.nearestPosition;

  return {
    status:
      "conditional",

    confidence:
      nearest
        ? "medium"
        : "low",

    evidence:
      uniqueText([
        `配偶星加权约${spouse.weightedCount}`,
        nearest
          ? `配偶星落在${nearest.pillarLabel}${nearest.positionLabel}`
          : "",

        "配偶星主要位于年月宾位",
      ]),

    supportingEvidence: [
      "配偶星结构位置与外部环境联系较多",
    ],

    weakeningEvidence:
      context.spousePalace
        .connectionRelationTitles
        ?.length
        ? [
            "夫妻宫另有合会关系，现实表现可能出现不同承接方式",
          ]
        : [],

    blockingEvidence: [],
  };
}

function evaluateOutputAnchorInHost(
  rule,
  context,
) {
  const output =
    context.groups.output;

  if (
    output.total <
      finite(
        rule.thresholds
          ?.outputMin,
      ) ||
    output.hostPositions.length ===
      0
  ) {
    return null;
  }

  const confirmed =
    output.total >= 0.7;

  return {
    status:
      confirmed
        ? "confirmed"
        : "conditional",

    confidence:
      confirmed
        ? "high"
        : "medium",

    evidence:
      uniqueText([
        ...output.evidence,

        ...output
          .hostPositions
          .map(
            (position) =>
              `食伤落在${position.pillarLabel}${position.positionLabel}`,
          ),
      ]),

    supportingEvidence: [
      "食伤在日时主位有实际出口",
    ],

    weakeningEvidence:
      output
        .isRelationAffected
        ? [
            "食伤落点受到关系牵动，出口稳定性需要复核",
          ]
        : [],

    blockingEvidence: [],
  };
}

function createPatternImage(
  rule,
  evaluation,
) {
  const supportingEvidence =
    uniqueText(
      evaluation
        .supportingEvidence,
    );

  const weakeningEvidence =
    uniqueText(
      evaluation
        .weakeningEvidence,
    );

  const blockingEvidence =
    uniqueText(
      evaluation
        .blockingEvidence,
    );

  const priority =
    finite(
      evaluation.priority ??
      rule.priority,
    ) +
    supportingEvidence.length *
      2 -
    weakeningEvidence.length *
      2;

  return {
    id:
      `professional_image:${rule.id}`,

    ruleId:
      rule.id,

    semanticGroup:
      rule.semanticGroup ||
      rule.id,

    title:
      normalizeText(
        evaluation.title ??
        rule.title,
      ),

    brief:
      normalizeText(
        rule.semantic
          ?.meaning,
      ),

    role:
      normalizeText(
        evaluation.role ??
        rule.role,
      ) || "conditional",

    status:
      normalizeText(
        evaluation.status ??
        rule.baseStatus,
      ) || "conditional",

    importance:
      normalizeText(
        rule.importance,
      ) || "medium",

    confidence:
      normalizeConfidence(
        evaluation.confidence ??
        rule.baseConfidence,
      ),

    priority:
      round(priority),

    matchedFactIds: [],

    counterFactIds: [],

    evidence:
      uniqueText(
        evaluation.evidence,
      ),

    supportingEvidence,

    weakeningEvidence,

    blockingEvidence,

    counterEvidence: [
      ...weakeningEvidence,
      ...blockingEvidence,
    ],

    reasoning: [
      ...supportingEvidence,
      ...weakeningEvidence.map(
        (item) =>
          `减弱条件：${item}`,
      ),
    ],

    tags:
      uniqueText([
        rule.title,
        rule.semanticGroup,
        "V2专业组合",
      ]),

    domains:
      uniqueText(
        rule.domains,
      ),

    workStatus:
      evaluation.workStatus ??
      "not_applicable",

    workPath:
      evaluation.workPath ??
      null,

    school:
      Array.isArray(
        rule.school,
      )
        ? [...rule.school]
        : [],

    sourceRefs:
      Array.isArray(
        rule.sourceRefs,
      )
        ? rule.sourceRefs.map(
            (item) => ({
              ...item,
            }),
          )
        : [],

    masterNarrative:
      rule.masterNarrative ??
      null,

    replacementPolicy:
      rule.replacementPolicy ??
      "ranked",

    replacesRuleIds:
      uniqueText(
        rule.replacesRuleIds,
      ),

    semantic:
      rule.semantic ?? null,

    domainNarratives:
      rule.domainNarratives ??
      {},

    source:
      "professional_context",
  };
}

function shortRelationTitle(
  relation,
) {
  const participants =
    relation.participants ??
    [];

  const left =
    participants[0];

  const right =
    participants[1];

  const leftText =
    left
      ? `${shortPillarLabel(
          left.pillar,
        )}${left.position ===
          "branch"
          ? "支"
          : left.position ===
              "stem"
            ? "干"
            : "柱"}${left.value}`
      : "";

  const rightText =
    right
      ? `${shortPillarLabel(
          right.pillar,
        )}${right.position ===
          "branch"
          ? "支"
          : right.position ===
              "stem"
            ? "干"
            : "柱"}${right.value}`
      : "";

  const relationText = {
    branch_self_punish:
      "自刑",

    branch_punish:
      "相刑",

    branch_break:
      "相破",

    branch_clash:
      "相冲",

    branch_harm:
      "相害",

    stem_control:
      "相克",

    stem_clash:
      "相冲",
  }[
    relation.relationType
  ] ||
  relation.relationLabel ||
  "";

  return `${leftText}与${rightText}${relationText}`;
}

function shortPillarLabel(
  pillar,
) {
  return {
    year: "年",
    month: "月",
    day: "日",
    hour: "时",
  }[pillar] || "";
}

function resolvePlacementScope({
  hostPositions,
  guestPositions,
}) {
  if (
    hostPositions.length &&
    guestPositions.length
  ) {
    return "mixed";
  }

  if (hostPositions.length) {
    return "host";
  }

  if (guestPositions.length) {
    return "guest";
  }

  return "none";
}

function buildByRole(
  images,
) {
  const result = {
    core: [],
    support: [],
    tension: [],
    conditional: [],
  };

  for (const image of images) {
    const role =
      Object.hasOwn(
        result,
        image.role,
      )
        ? image.role
        : "conditional";

    result[role].push(
      image,
    );
  }

  return result;
}

function normalizeConfidence(
  value,
) {
  const normalized =
    normalizeText(value);

  return Object.hasOwn(
    confidenceRank,
    normalized,
  )
    ? normalized
    : "unknown";
}

function uniqueText(
  values,
) {
  return [
    ...new Set(
      (
        Array.isArray(values)
          ? values
          : []
      )
        .map(normalizeText)
        .filter(Boolean),
    ),
  ];
}

function round(
  value,
) {
  return (
    Math.round(
      (
        finite(value) +
        Number.EPSILON
      ) * 100,
    ) / 100
  );
}

function finite(
  value,
) {
  const number =
    Number(value);

  return Number.isFinite(
    number,
  )
    ? number
    : 0;
}

function normalizeText(
  value,
) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();
}
