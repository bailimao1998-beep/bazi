import { branchMainStem, getTenGod } from "../../bazi/tenGods.js";
import { stemElements } from "../../bazi/fiveElements.js";
import {
  ELEMENT_CONTROLLING,
  ELEMENT_GENERATING,
  ELEMENT_KEYS,
  ELEMENT_LABELS,
  ROLE_BY_TEN_GOD_GROUP,
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

export function buildWorkChains({
  dayMaster,
  pillars,
  relationMatrix,
  climateProfile,
} = {}) {
  const safePillars = pillars ?? {};
  const relations = Array.isArray(relationMatrix?.items) ? relationMatrix.items : [];
  const nodes = buildNodes(safePillars, dayMaster?.stem ?? "", relations);
  const nodeIndex = Object.fromEntries(nodes.map((node) => [node.id, node]));
  const structuralEdges = buildStructuralEdges(nodeIndex);
  const relationEdges = buildRelationEdges(relations, nodeIndex);
  const edges = dedupeById([...structuralEdges, ...relationEdges]);
  const chains = buildCandidateChains(nodes, edges);
  const interruptionSignals = relationEdges.filter((edge) => edge.edgeType === "interruption_signal");
  const bodyToUseCandidates = chains.filter((chain) => chain.roleFlow === "body_to_use");
  const useToBodyCandidates = chains.filter((chain) => chain.roleFlow === "use_to_body");
  const selfInvolvedCandidates = chains.filter((chain) => chain.nodeIds.includes("day.stem"));

  return {
    version: "work-chains-v1",
    nodes,
    edges,
    chains,
    bodyToUseCandidates,
    useToBodyCandidates,
    selfInvolvedCandidates,
    interruptionSignals,
    passThroughCandidates: Array.isArray(climateProfile?.passThroughCandidates)
      ? climateProfile.passThroughCandidates.map((item) => ({ ...item }))
      : [],
    summary: {
      nodeCount: nodes.length,
      edgeCount: edges.length,
      chainCount: chains.length,
      bodyNodeCount: nodes.filter((node) => ["self", "body"].includes(node.role)).length,
      useNodeCount: nodes.filter((node) => node.role === "use").length,
      bodyToUseCount: bodyToUseCandidates.length,
      interruptionCount: interruptionSignals.length,
    },
    confidence: nodes.length >= 8 ? "medium" : nodes.length ? "low" : "unknown",
    evidence: [
      {
        type: "work_chain_scope",
        position: "workChains",
        text: "做功链V1仅记录可计算的生、克、同类、合冲刑害破及体用路径候选，不直接判断成就与吉凶。",
      },
    ],
    warnings: nodes.length ? [] : ["no work-chain nodes could be built"],
  };
}

function buildNodes(pillars, dayStem, relations) {
  const nodes = [];

  for (const key of PILLAR_KEYS) {
    const pillar = pillars[key] ?? {};
    if (pillar.stem) {
      const tenGod = key === "day" ? "日主" : pillar.stemTenGod || getTenGod(dayStem, pillar.stem);
      nodes.push(createNode({
        id: `${key}.stem`,
        pillar: key,
        position: "stem",
        visibility: "visible",
        stem: pillar.stem,
        branch: "",
        element: stemElements[pillar.stem] ?? "",
        tenGod,
        role: key === "day" ? "self" : roleForTenGod(tenGod),
        weight: 1,
        relationIds: relationIdsForPosition(relations, key, "stem"),
      }));
    }

    const hiddenStems = Array.isArray(pillar.hiddenStems) ? pillar.hiddenStems : [];
    const mainHidden = hiddenStems.find((item) => /主气|本气/.test(item?.role ?? item?.qiLevel ?? "")) ?? hiddenStems[0];
    const mainStem = mainHidden?.stem || branchMainStem(pillar.branch);
    const mainTenGod = pillar.branchMainTenGod || mainHidden?.tenGod || (dayStem && mainStem ? getTenGod(dayStem, mainStem) : "");

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
        role: roleForTenGod(mainTenGod),
        weight: 0.7,
        relationIds: relationIdsForPosition(relations, key, "branch"),
      }));
    }

    hiddenStems.forEach((hidden, index) => {
      if (!hidden?.stem) return;
      if (hidden.stem === mainStem && index === hiddenStems.indexOf(mainHidden)) return;
      const tenGod = hidden.tenGod || (dayStem ? getTenGod(dayStem, hidden.stem) : "");
      nodes.push(createNode({
        id: `${key}.branch.hidden.${index}`,
        pillar: key,
        position: `branch.hidden.${index}`,
        visibility: "hidden",
        stem: hidden.stem,
        branch: pillar.branch ?? "",
        element: stemElements[hidden.stem] ?? "",
        tenGod,
        role: roleForTenGod(tenGod),
        weight: hiddenWeight(hidden),
        relationIds: relationIdsForPosition(relations, key, "branch"),
      }));
    });
  }

  return dedupeById(nodes);
}

function createNode(value) {
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
    role: value.role,
    weight: round(value.weight),
    relationIds: unique(value.relationIds),
    evidence: [{
      type: "work_node",
      position: value.id,
      text: `${value.id}为${value.stem || value.branch || "未知"}${ELEMENT_LABELS[value.element] ?? ""}${value.tenGod ? `（${value.tenGod}）` : ""}`,
    }],
  };
}

function buildStructuralEdges(nodeIndex) {
  const edges = [];
  for (const [leftId, rightId] of PRIMARY_PAIR_KEYS) {
    const left = nodeIndex[leftId];
    const right = nodeIndex[rightId];
    if (!left || !right || !left.element || !right.element) continue;
    edges.push(...elementEdges(left, right));
  }
  return edges;
}

function elementEdges(left, right) {
  if (left.element === right.element) {
    return [makeEdge({
      source: left.id,
      target: right.id,
      edgeType: "same_element",
      direction: "undirected",
      relationType: "same_element",
      confidence: "medium",
    })];
  }
  if (ELEMENT_GENERATING[left.element] === right.element) {
    return [makeElementEdge(left, right, "generate")];
  }
  if (ELEMENT_GENERATING[right.element] === left.element) {
    return [makeElementEdge(right, left, "generate")];
  }
  if (ELEMENT_CONTROLLING[left.element] === right.element) {
    return [makeElementEdge(left, right, "control")];
  }
  if (ELEMENT_CONTROLLING[right.element] === left.element) {
    return [makeElementEdge(right, left, "control")];
  }
  return [];
}

function makeElementEdge(source, target, edgeType) {
  return makeEdge({
    source: source.id,
    target: target.id,
    edgeType,
    direction: "directed",
    relationType: `element_${edgeType}`,
    confidence: "medium",
  });
}

function buildRelationEdges(relations, nodeIndex) {
  const edges = [];

  for (const relation of relations) {
    const participants = relation.participants ?? relation.members ?? [];
    const participantNodeIds = unique(participants.flatMap((participant) =>
      nodeIdsForParticipant(participant, nodeIndex),
    ));

    if (relation.relationType === "stem_control" && relation.direction) {
      const sourceIds = nodeIdsForParticipant(relation.direction.controller, nodeIndex);
      const targetIds = nodeIdsForParticipant(relation.direction.controlled, nodeIndex);
      for (const source of sourceIds) {
        for (const target of targetIds) {
          edges.push(makeEdge({
            source,
            target,
            edgeType: "control_signal",
            direction: "directed",
            relationType: relation.relationType,
            relationId: relation.id,
            confidence: relation.confidence,
          }));
        }
      }
      continue;
    }

    const edgeType = relationEdgeType(relation.relationType);
    if (!edgeType || participantNodeIds.length < 2) continue;

    for (let index = 1; index < participantNodeIds.length; index += 1) {
      edges.push(makeEdge({
        source: participantNodeIds[0],
        target: participantNodeIds[index],
        edgeType,
        direction: "undirected",
        relationType: relation.relationType,
        relationId: relation.id,
        confidence: relation.confidence,
      }));
    }
  }

  return edges;
}

function relationEdgeType(relationType) {
  if (/combine|harmony|meeting/.test(relationType)) return "combine_signal";
  if (/clash|punish|harm|break/.test(relationType)) return "interruption_signal";
  if (relationType === "repetition") return "repetition_signal";
  return "";
}

function nodeIdsForParticipant(participant, nodeIndex) {
  if (!participant?.pillar || participant.pillar === "unknown") return [];
  if (participant.position === "stem") {
    return nodeIndex[`${participant.pillar}.stem`] ? [`${participant.pillar}.stem`] : [];
  }
  if (participant.position === "branch") {
    return nodeIndex[`${participant.pillar}.branch.mainQi`] ? [`${participant.pillar}.branch.mainQi`] : [];
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
  const edgeType = String(value.edgeType ?? "unknown");
  const relationType = String(value.relationType ?? edgeType);
  const relationId = String(value.relationId ?? "");
  return {
    id: `${source}__${edgeType}__${target}__${slug(relationId || relationType)}`,
    source,
    target,
    edgeType,
    direction: value.direction ?? "unknown",
    relationType,
    relationId,
    confidence: ["high", "medium", "low"].includes(value.confidence) ? value.confidence : "medium",
    evidence: [{
      type: "work_edge",
      position: `${source}->${target}`,
      text: `${source}通过${relationType}连接${target}`,
    }],
  };
}

function buildCandidateChains(nodes, edges) {
  const nodeIndex = Object.fromEntries(nodes.map((node) => [node.id, node]));
  const directed = edges.filter((edge) => ["generate", "control", "control_signal"].includes(edge.edgeType));
  const chains = [];

  for (const edge of directed) {
    chains.push(makeChain([edge], nodeIndex));
  }

  for (const first of directed) {
    for (const second of directed) {
      if (first.target !== second.source) continue;
      if (new Set([first.source, first.target, second.target]).size < 3) continue;
      chains.push(makeChain([first, second], nodeIndex));
    }
  }

  return dedupeById(chains)
    .filter((chain) => chain.nodeIds.every((id) => nodeIndex[id]))
    .sort((left, right) => chainPriority(right, nodeIndex) - chainPriority(left, nodeIndex));
}

function makeChain(edges, nodeIndex) {
  const nodeIds = [edges[0].source, ...edges.map((edge) => edge.target)];
  const start = nodeIndex[nodeIds[0]];
  const end = nodeIndex[nodeIds.at(-1)];
  const edgeTypes = unique(edges.map((edge) => edge.edgeType));
  const chainType = edgeTypes.length === 1
    ? edgeTypes[0] === "generate" ? "generation_path" : "control_path"
    : "mixed_path";
  return {
    id: `${chainType}__${nodeIds.join("__")}`,
    chainType,
    nodeIds,
    edgeIds: edges.map((edge) => edge.id),
    startRole: start?.role ?? "unknown",
    endRole: end?.role ?? "unknown",
    roleFlow: resolveRoleFlow(start?.role, end?.role),
    selfInvolved: nodeIds.includes("day.stem"),
    status: "candidate",
    confidence: edges.every((edge) => edge.confidence === "high") ? "high" : edges.some((edge) => edge.confidence === "low") ? "low" : "medium",
    evidence: edges.flatMap((edge) => edge.evidence ?? []),
    warnings: [],
  };
}

function resolveRoleFlow(startRole, endRole) {
  const startBody = ["self", "body"].includes(startRole);
  const endBody = ["self", "body"].includes(endRole);
  if (startBody && endRole === "use") return "body_to_use";
  if (startRole === "use" && endBody) return "use_to_body";
  if (startBody && endBody) return "body_internal";
  if (startRole === "use" && endRole === "use") return "use_internal";
  return "mixed";
}

function chainPriority(chain, nodeIndex) {
  let score = chain.nodeIds.length;
  if (chain.roleFlow === "body_to_use") score += 10;
  if (chain.selfInvolved) score += 5;
  if (chain.nodeIds.some((id) => nodeIndex[id]?.visibility === "visible")) score += 1;
  return score;
}

function relationIdsForPosition(relations, pillar, position) {
  return unique(relations
    .filter((relation) => (relation.participants ?? relation.members ?? []).some((participant) =>
      participant?.pillar === pillar &&
      (participant?.position === position || participant?.position === "pillar"),
    ))
    .map((relation) => relation.id));
}

function roleForTenGod(tenGod) {
  return ROLE_BY_TEN_GOD_GROUP[tenGodGroup(tenGod)] ?? "unknown";
}

function hiddenWeight(hidden) {
  const role = hidden?.role ?? hidden?.qiLevel ?? "";
  if (/主气|本气/.test(role)) return 0.7;
  if (/中气/.test(role)) return 0.4;
  return 0.25;
}

function dedupeById(items) {
  const seen = new Set();
  return items.filter((item) => {
    if (!item?.id || seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

function unique(items = []) {
  return [...new Set(items.filter(Boolean))];
}

function round(value) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.round(number * 100) / 100 : 0;
}

function slug(value) {
  return String(value ?? "")
    .replace(/[^a-zA-Z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-|-$/g, "") || "signal";
}
