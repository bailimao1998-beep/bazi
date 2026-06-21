import { branchMainStem, getTenGod } from "../../bazi/tenGods.js";
import { stemElements } from "../../bazi/fiveElements.js";
import {
  DEFAULT_WORK_ROLE_MAPPING,
  ELEMENT_CONTROLLING,
  ELEMENT_GENERATING,
  ELEMENT_LABELS,
  WORK_ROLE_MAPPING_VERSION,
  resolveWorkRole,
  tenGodGroup,
} from "../config/climateAndWorkConfig.js";

const PILLAR_KEYS = ["year", "month", "day", "hour"];
const PRIMARY_PAIR_KEYS = [
  ["year.stem", "year.branch.mainQi"],
  ["month.stem", "month.branch.mainQi"],
  ["day.stem", "day.branch.mainQi"],
  ["hour.stem", "hour.branch.mainQi"],
  ["year.stem", "month.stem"],
  ["month.stem", "day.stem"],
  ["day.stem", "hour.stem"],
  ["year.branch.mainQi", "month.branch.mainQi"],
  ["month.branch.mainQi", "day.branch.mainQi"],
  ["day.branch.mainQi", "hour.branch.mainQi"],
];

const confidenceRank = {
  unknown: 0,
  low: 1,
  medium: 2,
  high: 3,
};

export function buildWorkChains({
  dayMaster,
  pillars,
  relationMatrix,
  climateProfile,
  roleMapping = DEFAULT_WORK_ROLE_MAPPING,
} = {}) {
  const safePillars = pillars ?? {};
  const relations = Array.isArray(relationMatrix?.items) ? relationMatrix.items : [];
  const nodes = buildNodes(safePillars, dayMaster?.stem ?? "", relations, roleMapping);
  const nodeIndex = Object.fromEntries(nodes.map((node) => [node.id, node]));

  const potentialEdges = buildPotentialEdges(nodeIndex);
  const activatedRelationEdges = buildRelationEdges(relations, nodeIndex);
  const supportEdges = buildSupportEdges(nodes);
  const edges = mergeEdges([
    ...potentialEdges,
    ...activatedRelationEdges,
    ...supportEdges,
  ]);

  const chains = buildCandidateChains(nodes, edges);
  const interruptionSignals = edges.filter((edge) =>
    edge.semanticType === "interruption_signal",
  );
  const bodyToUseCandidates = chains.filter((chain) =>
    chain.roleFlow === "body_to_use",
  );
  const useToBodyCandidates = chains.filter((chain) =>
    chain.roleFlow === "use_to_body",
  );
  const selfInvolvedCandidates = chains.filter((chain) =>
    chain.nodeIds.includes("day.stem"),
  );
  const coexistenceCandidates = normalizeCoexistenceCandidates(
    climateProfile?.passThroughCandidates,
  );
  const actualConflictCandidates = buildActualConflictCandidates({
    edges,
    nodeIndex,
    coexistenceCandidates,
  });

  return {
    version: "work-chains-v1",
    semanticVersion: "work-chains-semantic-v1",
    roleMappingVersion:
      roleMapping?.version ??
      WORK_ROLE_MAPPING_VERSION,
    roleMappingId:
      roleMapping?.id ??
      DEFAULT_WORK_ROLE_MAPPING.id,

    nodes,
    edges,
    potentialEdges: edges.filter((edge) => edge.activation === "potential"),
    activatedEdges: edges.filter((edge) => edge.activation === "activated"),
    chains,

    bodyToUseCandidates,
    useToBodyCandidates,
    selfInvolvedCandidates,
    interruptionSignals,

    coexistenceCandidates,
    actualConflictCandidates,

    // Compatibility field retained for current downstream consumers.
    passThroughCandidates: coexistenceCandidates,

    summary: {
      nodeCount: nodes.length,
      edgeCount: edges.length,
      potentialEdgeCount: edges.filter((edge) => edge.activation === "potential").length,
      activatedEdgeCount: edges.filter((edge) => edge.activation === "activated").length,
      chainCount: chains.length,
      activatedChainCount: chains.filter((chain) => chain.activationLevel === "activated").length,
      bodyNodeCount: nodes.filter((node) => ["self", "body"].includes(node.resolvedRole)).length,
      mediatorNodeCount: nodes.filter((node) => node.resolvedRole === "mediator").length,
      useNodeCount: nodes.filter((node) => node.resolvedRole === "use").length,
      hiddenNodeCount: nodes.filter((node) => node.visibility === "hidden").length,
      bodyToUseCount: bodyToUseCandidates.length,
      interruptionCount: interruptionSignals.length,
      actualConflictCount: actualConflictCandidates.length,
    },

    confidence: nodes.length >= 8 ? "medium" : nodes.length ? "low" : "unknown",
    evidence: [
      {
        type: "work_chain_scope",
        position: "workChains",
        text: "做功链语义版区分潜在边、原局激活边、藏干低置信连接和真实冲突候选；所有链仍为候选结构。",
      },
    ],
    warnings: nodes.length ? [] : ["no work-chain nodes could be built"],
  };
}

function buildNodes(pillars, dayStem, relations, roleMapping) {
  const nodes = [];

  for (const key of PILLAR_KEYS) {
    const pillar = pillars[key] ?? {};

    if (pillar.stem) {
      const tenGod = key === "day"
        ? "日主"
        : pillar.stemTenGod || getTenGod(dayStem, pillar.stem);

      nodes.push(createNode({
        id: `${key}.stem`,
        pillar: key,
        position: "stem",
        visibility: "visible",
        stem: pillar.stem,
        branch: "",
        element: stemElements[pillar.stem] ?? "",
        tenGod,
        weight: 1,
        relationIds: relationIdsForPosition(relations, key, "stem"),
        isDayMaster: key === "day",
        roleMapping,
      }));
    }

    const hiddenStems = Array.isArray(pillar.hiddenStems)
      ? pillar.hiddenStems
      : [];
    const mainHidden =
      hiddenStems.find((item) =>
        /主气|本气/.test(item?.role ?? item?.qiLevel ?? ""),
      ) ?? hiddenStems[0];
    const mainHiddenIndex = hiddenStems.indexOf(mainHidden);
    const mainStem =
      mainHidden?.stem ||
      branchMainStem(pillar.branch);
    const mainTenGod =
      pillar.branchMainTenGod ||
      mainHidden?.tenGod ||
      (
        dayStem && mainStem
          ? getTenGod(dayStem, mainStem)
          : ""
      );

    if (pillar.branch || mainStem) {
      nodes.push(createNode({
        id: `${key}.branch.mainQi`,
        pillar: key,
        position: "branch.mainQi",
        visibility: "main_qi",
        stem: mainStem ?? "",
        branch: pillar.branch ?? "",
        element: stemElements[mainStem] ?? "",
        tenGod: mainTenGod,
        weight: 0.7,
        relationIds: relationIdsForPosition(relations, key, "branch"),
        isDayMaster: false,
        roleMapping,
      }));
    }

    hiddenStems.forEach((hidden, index) => {
      if (!hidden?.stem) return;
      if (hidden.stem === mainStem && index === mainHiddenIndex) return;

      const tenGod =
        hidden.tenGod ||
        (
          dayStem
            ? getTenGod(dayStem, hidden.stem)
            : ""
        );

      nodes.push(createNode({
        id: `${key}.branch.hidden.${index}`,
        pillar: key,
        position: `branch.hidden.${index}`,
        visibility: "hidden",
        stem: hidden.stem,
        branch: pillar.branch ?? "",
        element: stemElements[hidden.stem] ?? "",
        tenGod,
        weight: hiddenWeight(hidden),
        relationIds: relationIdsForPosition(relations, key, "branch"),
        isDayMaster: false,
        roleMapping,
      }));
    });
  }

  return dedupeById(nodes);
}

function createNode(value) {
  const role = resolveWorkRole({
    tenGod: value.tenGod,
    isDayMaster: value.isDayMaster,
    pillar: value.pillar,
    position: value.position,
    visibility: value.visibility,
    mapping: value.roleMapping,
  });

  return {
    id: value.id,
    pillar: value.pillar,
    position: value.position,
    visibility: value.visibility,
    stem: value.stem,
    branch: value.branch,
    element: value.element,
    elementLabel: ELEMENT_LABELS[value.element] ?? "",
    tenGod: value.tenGod || "unknown",
    tenGodGroup: tenGodGroup(value.tenGod),

    defaultRole: role.defaultRole,
    resolvedRole: role.resolvedRole,
    role: role.resolvedRole,
    roleEvidence: role.roleEvidence,
    roleMappingVersion: role.mappingVersion,
    roleMappingId: role.mappingId,

    weight: round(value.weight),
    relationIds: unique(value.relationIds),
    evidence: [{
      type: "work_node",
      position: value.id,
      text: `${value.id}为${value.stem || value.branch || "未知"}${ELEMENT_LABELS[value.element] ?? ""}${value.tenGod ? `（${value.tenGod}）` : ""}`,
    }],
  };
}

function buildPotentialEdges(nodeIndex) {
  const edges = [];

  for (const [leftId, rightId] of PRIMARY_PAIR_KEYS) {
    const left = nodeIndex[leftId];
    const right = nodeIndex[rightId];
    if (!left || !right) continue;

    edges.push(
      ...elementEdges(left, right, {
        scope: "primary_structure",
        activation: "potential",
        confidence: potentialConfidence(left, right),
      }),
    );
  }

  const hiddenNodes = Object.values(nodeIndex).filter((node) =>
    node.visibility === "hidden",
  );

  for (const hidden of hiddenNodes) {
    const pillarStem = nodeIndex[`${hidden.pillar}.stem`];
    const mainQi = nodeIndex[`${hidden.pillar}.branch.mainQi`];

    if (pillarStem) {
      edges.push(
        ...elementEdges(hidden, pillarStem, {
          scope: "internal_hidden_to_stem",
          activation: "potential",
          confidence: "low",
        }),
      );
    }

    if (mainQi) {
      edges.push(
        ...elementEdges(hidden, mainQi, {
          scope: "internal_hidden_to_main_qi",
          activation: "potential",
          confidence: "low",
        }),
      );
    }
  }

  return edges;
}

function buildSupportEdges(nodes) {
  const edges = [];
  const visibleByStem = new Map();

  for (const node of nodes) {
    if (node.visibility !== "visible" || !node.stem) continue;
    if (!visibleByStem.has(node.stem)) visibleByStem.set(node.stem, []);
    visibleByStem.get(node.stem).push(node);
  }

  for (const node of nodes) {
    if (!["hidden", "main_qi"].includes(node.visibility)) continue;
    if (!node.stem || !visibleByStem.has(node.stem)) continue;

    for (const visible of visibleByStem.get(node.stem)) {
      edges.push(makeEdge({
        source: node.id,
        target: visible.id,
        semanticType: "same_stem_support",
        activation: "activated",
        direction: "undirected",
        relationType: "same_stem_reveal",
        relationId: "",
        confidence: node.visibility === "hidden" ? "low" : "medium",
        scope: "root_reveal_support",
        chainEligible: false,
      }));
    }
  }

  return edges;
}

function elementEdges(left, right, {
  scope,
  activation,
  confidence,
}) {
  if (!left.element || !right.element) return [];

  if (left.element === right.element) {
    return [makeEdge({
      source: left.id,
      target: right.id,
      semanticType: "same_element",
      activation,
      direction: "undirected",
      relationType: "same_element",
      relationId: "",
      confidence,
      scope,
      chainEligible: false,
    })];
  }

  if (ELEMENT_GENERATING[left.element] === right.element) {
    return [makeElementEdge(left, right, "generate", {
      scope,
      activation,
      confidence,
    })];
  }

  if (ELEMENT_GENERATING[right.element] === left.element) {
    return [makeElementEdge(right, left, "generate", {
      scope,
      activation,
      confidence,
    })];
  }

  if (ELEMENT_CONTROLLING[left.element] === right.element) {
    return [makeElementEdge(left, right, "control", {
      scope,
      activation,
      confidence,
    })];
  }

  if (ELEMENT_CONTROLLING[right.element] === left.element) {
    return [makeElementEdge(right, left, "control", {
      scope,
      activation,
      confidence,
    })];
  }

  return [];
}

function makeElementEdge(source, target, semanticType, options) {
  return makeEdge({
    source: source.id,
    target: target.id,
    semanticType,
    activation: options.activation,
    direction: "directed",
    relationType: `element_${semanticType}`,
    relationId: "",
    confidence: options.confidence,
    scope: options.scope,
    chainEligible: true,
  });
}

function buildRelationEdges(relations, nodeIndex) {
  const edges = [];

  for (const relation of relations) {
    const participants =
      relation.participants ??
      relation.members ??
      [];

    if (
      relation.relationType === "stem_control" &&
      relation.direction
    ) {
      const sourceIds = nodeIdsForParticipant(
        relation.direction.controller,
        nodeIndex,
      );
      const targetIds = nodeIdsForParticipant(
        relation.direction.controlled,
        nodeIndex,
      );

      for (const source of sourceIds) {
        for (const target of targetIds) {
          edges.push(makeEdge({
            source,
            target,
            semanticType: "control",
            activation: "activated",
            direction: "directed",
            relationType: relation.relationType,
            relationId: relation.id,
            confidence: relation.confidence,
            scope: "explicit_relation",
            chainEligible: true,
          }));
        }
      }
      continue;
    }

    const participantNodeIds = unique(
      participants.flatMap((participant) =>
        nodeIdsForParticipant(
          participant,
          nodeIndex,
        ),
      ),
    );
    const semanticType = relationSemanticType(
      relation.relationType,
    );

    if (
      !semanticType ||
      participantNodeIds.length < 2
    ) {
      continue;
    }

    for (
      let index = 1;
      index < participantNodeIds.length;
      index += 1
    ) {
      edges.push(makeEdge({
        source: participantNodeIds[0],
        target: participantNodeIds[index],
        semanticType,
        activation: "activated",
        direction: "undirected",
        relationType: relation.relationType,
        relationId: relation.id,
        confidence: relation.confidence,
        scope: "explicit_relation",
        chainEligible: false,
      }));
    }
  }

  return edges;
}

function relationSemanticType(relationType) {
  if (/combine|harmony|meeting/.test(relationType)) {
    return "combine_signal";
  }
  if (/clash|punish|harm|break/.test(relationType)) {
    return "interruption_signal";
  }
  if (relationType === "repetition") {
    return "repetition_signal";
  }
  return "";
}

function nodeIdsForParticipant(participant, nodeIndex) {
  if (
    !participant?.pillar ||
    participant.pillar === "unknown"
  ) {
    return [];
  }

  if (participant.position === "stem") {
    const id = `${participant.pillar}.stem`;
    return nodeIndex[id] ? [id] : [];
  }

  if (participant.position === "branch") {
    const id =
      `${participant.pillar}.branch.mainQi`;
    return nodeIndex[id] ? [id] : [];
  }

  if (participant.position === "pillar") {
    return [
      `${participant.pillar}.stem`,
      `${participant.pillar}.branch.mainQi`,
    ].filter((id) => nodeIndex[id]);
  }

  return [];
}

function makeEdge(value) {
  const source = String(value.source ?? "");
  const target = String(value.target ?? "");
  const semanticType = String(
    value.semanticType ?? "unknown",
  );
  const relationType = String(
    value.relationType ?? semanticType,
  );
  const relationId = String(
    value.relationId ?? "",
  );
  const activation =
    value.activation === "activated"
      ? "activated"
      : "potential";

  return {
    id: buildEdgeId({
      source,
      target,
      semanticType,
      direction: value.direction,
    }),
    source,
    target,

    semanticType,
    edgeType: semanticType,
    activation,
    activationSources: unique([
      activation === "activated"
        ? relationId || relationType
        : value.scope,
    ]),

    direction:
      value.direction ?? "unknown",
    relationType,
    relationTypes: unique([relationType]),
    relationId,
    relationIds: unique([relationId]),

    confidence: normalizeConfidence(
      value.confidence,
    ),
    scope: value.scope ?? "unknown",
    scopes: unique([value.scope]),
    chainEligible:
      value.chainEligible === true,

    evidence: [{
      type: "work_edge",
      position: `${source}->${target}`,
      text: `${source}通过${relationType}连接${target}，状态为${activation}`,
    }],
  };
}

function mergeEdges(edges) {
  const map = new Map();

  for (const edge of edges) {
    const key = edgeMergeKey(edge);
    const current = map.get(key);

    if (!current) {
      map.set(key, {
        ...edge,
        activationSources: [...edge.activationSources],
        relationTypes: [...edge.relationTypes],
        relationIds: [...edge.relationIds],
        scopes: [...edge.scopes],
        evidence: [...edge.evidence],
      });
      continue;
    }

    current.activation =
      (
        current.activation === "activated" ||
        edge.activation === "activated"
      )
        ? "activated"
        : "potential";
    current.activationSources = unique([
      ...current.activationSources,
      ...edge.activationSources,
    ]);
    current.relationTypes = unique([
      ...current.relationTypes,
      ...edge.relationTypes,
    ]);
    current.relationIds = unique([
      ...current.relationIds,
      ...edge.relationIds,
    ]);
    current.relationId =
      current.relationIds[0] ?? "";
    current.scopes = unique([
      ...current.scopes,
      ...edge.scopes,
    ]);
    current.scope =
      current.scopes.join("+");
    current.confidence = higherConfidence(
      current.confidence,
      edge.confidence,
    );
    current.chainEligible =
      current.chainEligible ||
      edge.chainEligible;
    current.evidence = dedupeEvidence([
      ...current.evidence,
      ...edge.evidence,
    ]);
  }

  return [...map.values()].map((edge) => ({
    ...edge,
    id: buildEdgeId(edge),
  }));
}

function edgeMergeKey(edge) {
  const directed =
    edge.direction === "directed";
  const endpoints = directed
    ? [edge.source, edge.target]
    : [edge.source, edge.target].sort();

  return [
    endpoints.join("|"),
    edge.semanticType,
    directed ? "directed" : "undirected",
  ].join("|");
}

function buildEdgeId({
  source,
  target,
  semanticType,
  direction,
}) {
  const endpoints =
    direction === "undirected"
      ? [source, target].sort()
      : [source, target];

  return `${endpoints[0]}__${semanticType}__${endpoints[1]}`;
}

function buildCandidateChains(nodes, edges) {
  const nodeIndex = Object.fromEntries(
    nodes.map((node) => [node.id, node]),
  );
  const directed = edges.filter((edge) =>
    edge.direction === "directed" &&
    edge.chainEligible &&
    ["generate", "control"].includes(
      edge.semanticType,
    ),
  );
  const chains = [];

  for (const edge of directed) {
    chains.push(makeChain(
      [edge],
      nodeIndex,
    ));
  }

  for (const first of directed) {
    for (const second of directed) {
      if (first.target !== second.source) {
        continue;
      }
      if (
        new Set([
          first.source,
          first.target,
          second.target,
        ]).size < 3
      ) {
        continue;
      }

      chains.push(makeChain(
        [first, second],
        nodeIndex,
      ));
    }
  }

  return dedupeById(chains)
    .filter((chain) =>
      chain.nodeIds.every((id) =>
        nodeIndex[id],
      ),
    )
    .sort((left, right) =>
      right.priorityScore -
      left.priorityScore,
    );
}

function makeChain(edges, nodeIndex) {
  const nodeIds = [
    edges[0].source,
    ...edges.map((edge) => edge.target),
  ];
  const start = nodeIndex[nodeIds[0]];
  const end = nodeIndex[nodeIds.at(-1)];
  const semanticTypes = unique(
    edges.map((edge) => edge.semanticType),
  );
  const hiddenNodeCount = nodeIds.filter((id) =>
    nodeIndex[id]?.visibility === "hidden",
  ).length;
  const activationLevel =
    edges.every((edge) =>
      edge.activation === "activated",
    )
      ? "activated"
      : edges.some((edge) =>
          edge.activation === "activated",
        )
        ? "mixed"
        : "potential";
  const chainType =
    semanticTypes.length === 1
      ? semanticTypes[0] === "generate"
        ? "generation_path"
        : "control_path"
      : "mixed_path";
  const roleFlow = resolveRoleFlow(
    start?.resolvedRole,
    end?.resolvedRole,
  );

  const chain = {
    id: `${chainType}__${nodeIds.join("__")}`,
    chainType,
    nodeIds,
    edgeIds: edges.map((edge) => edge.id),

    startRole:
      start?.resolvedRole ??
      "unknown",
    endRole:
      end?.resolvedRole ??
      "unknown",
    roleFlow,

    selfInvolved:
      nodeIds.includes("day.stem"),
    hiddenNodeCount,
    activationLevel,
    status: "candidate",

    confidence: chainConfidence(
      edges,
      hiddenNodeCount,
    ),
    evidence: dedupeEvidence(
      edges.flatMap((edge) =>
        edge.evidence ?? [],
      ),
    ),
    warnings:
      hiddenNodeCount > 0
        ? ["chain contains hidden-stem nodes and should retain lower confidence"]
        : [],
  };

  return {
    ...chain,
    priorityScore: chainPriority(chain),
  };
}

function resolveRoleFlow(
  startRole,
  endRole,
) {
  const startBody = [
    "self",
    "body",
    "mediator",
  ].includes(startRole);
  const endBody = [
    "self",
    "body",
    "mediator",
  ].includes(endRole);

  if (
    startBody &&
    endRole === "use"
  ) {
    return "body_to_use";
  }
  if (
    startRole === "use" &&
    endBody
  ) {
    return "use_to_body";
  }
  if (
    startBody &&
    endBody
  ) {
    return "body_internal";
  }
  if (
    startRole === "use" &&
    endRole === "use"
  ) {
    return "use_internal";
  }
  return "mixed";
}

function chainPriority(chain) {
  let score =
    chain.nodeIds.length;

  if (
    chain.roleFlow === "body_to_use"
  ) {
    score += 10;
  }
  if (chain.selfInvolved) {
    score += 5;
  }
  if (
    chain.activationLevel === "activated"
  ) {
    score += 6;
  } else if (
    chain.activationLevel === "mixed"
  ) {
    score += 3;
  }

  score -= chain.hiddenNodeCount * 1.5;

  return round(score);
}

function chainConfidence(
  edges,
  hiddenNodeCount,
) {
  let confidence = edges
    .map((edge) => edge.confidence)
    .sort((left, right) =>
      confidenceRank[left] -
      confidenceRank[right],
    )[0] ?? "unknown";

  if (
    hiddenNodeCount > 0 &&
    confidenceRank[confidence] > confidenceRank.low
  ) {
    confidence = "low";
  }

  return confidence;
}

function normalizeCoexistenceCandidates(
  candidates,
) {
  return (
    Array.isArray(candidates)
      ? candidates
      : []
  ).map((candidate) => ({
    ...candidate,
    candidateLevel:
      "coexistence_candidate",
    status:
      "coexistence_candidate",
  }));
}

function buildActualConflictCandidates({
  edges,
  nodeIndex,
  coexistenceCandidates,
}) {
  const activatedControls = edges.filter((edge) =>
    edge.semanticType === "control" &&
    edge.activation === "activated",
  );
  const candidates = [];

  for (const edge of activatedControls) {
    const source = nodeIndex[edge.source];
    const target = nodeIndex[edge.target];

    if (
      !source?.element ||
      !target?.element
    ) {
      continue;
    }

    const coexistence =
      coexistenceCandidates.find((item) =>
        sameElementPair(
          item.conflictElements,
          [
            source.element,
            target.element,
          ],
        ),
      );

    candidates.push({
      edgeId: edge.id,
      relationIds: [...edge.relationIds],
      sourceNodeId: source.id,
      targetNodeId: target.id,
      conflictElements: [
        source.element,
        target.element,
      ],
      mediatorElement:
        coexistence?.mediatorElement ??
        "",
      mediatorPresent:
        coexistence?.mediatorPresent ??
        false,
      candidateLevel:
        "actual_conflict_candidate",
      status:
        "actual_conflict_candidate",
      confidence:
        edge.confidence,
      evidence: [
        ...edge.evidence,
        ...(
          coexistence
            ? [{
                type: "pass_through_candidate",
                position: "climateProfile.passThroughCandidates",
                text: coexistence.label,
              }]
            : []
        ),
      ],
    });
  }

  return dedupeById(
    candidates.map((candidate) => ({
      ...candidate,
      id: `actual_conflict__${candidate.edgeId}`,
    })),
  );
}

function sameElementPair(
  left,
  right,
) {
  if (
    !Array.isArray(left) ||
    !Array.isArray(right) ||
    left.length !== 2 ||
    right.length !== 2
  ) {
    return false;
  }

  return [...left].sort().join("|") ===
    [...right].sort().join("|");
}

function relationIdsForPosition(
  relations,
  pillar,
  position,
) {
  return unique(
    relations
      .filter((relation) =>
        (
          relation.participants ??
          relation.members ??
          []
        ).some((participant) =>
          participant?.pillar === pillar &&
          (
            participant?.position === position ||
            participant?.position === "pillar"
          ),
        ),
      )
      .map((relation) =>
        relation.id,
      ),
  );
}

function potentialConfidence(
  left,
  right,
) {
  if (
    left.visibility === "hidden" ||
    right.visibility === "hidden"
  ) {
    return "low";
  }
  return "medium";
}

function hiddenWeight(hidden) {
  const role =
    hidden?.role ??
    hidden?.qiLevel ??
    "";

  if (/主气|本气/.test(role)) return 0.7;
  if (/中气/.test(role)) return 0.4;
  return 0.25;
}

function normalizeConfidence(value) {
  return Object.hasOwn(
    confidenceRank,
    value,
  )
    ? value
    : "medium";
}

function higherConfidence(
  left,
  right,
) {
  return (
    confidenceRank[right] >
    confidenceRank[left]
  )
    ? right
    : left;
}

function dedupeEvidence(items) {
  const seen = new Set();

  return items.filter((item) => {
    const key = JSON.stringify(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function dedupeById(items) {
  const seen = new Set();

  return items.filter((item) => {
    if (
      !item?.id ||
      seen.has(item.id)
    ) {
      return false;
    }
    seen.add(item.id);
    return true;
  });
}

function unique(items = []) {
  return [
    ...new Set(
      items.filter(Boolean),
    ),
  ];
}

function round(value) {
  const number = Number(value);

  return Number.isFinite(number)
    ? Math.round(number * 100) / 100
    : 0;
}
