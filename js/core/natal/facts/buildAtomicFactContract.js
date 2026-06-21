import {
  normalizeAtomicNatalFacts,
  stableStringify,
} from "./atomicFactContract.js";

const pillarKeys = ["year", "month", "day", "hour"];
const elementKeys = ["wood", "fire", "earth", "metal", "water"];

export function buildAtomicFactContract(featureVector = {}) {
  return normalizeAtomicNatalFacts({
    facts: [
      ...extractDayMasterFacts(featureVector),
      ...extractPillarFacts(featureVector),
      ...extractElementFacts(featureVector),
      ...extractTenGodStateFacts(featureVector),
      ...extractRelationFacts(featureVector),
      ...extractPalaceFacts(featureVector),
      ...extractKinshipFacts(featureVector),
      ...extractVoidFacts(featureVector),
      ...extractStorageFacts(featureVector),
      ...extractGrowthStageFacts(featureVector),
      ...extractClimateFacts(featureVector),
      ...extractWorkChainFacts(featureVector),
    ],
    warnings: [],
  });
}

function extractDayMasterFacts(fv) {
  const dayMaster = fv.dayMaster ?? {};
  return [
    scalarFact("day_master", "day_master", "day_master", "day_master_stem", dayMaster.stem, "observed", "high", "dayMaster", "stem"),
    scalarFact("day_master", "day_master", "day_master", "day_master_element", dayMaster.element, "observed", "high", "dayMaster", "element"),
    scalarFact("day_master", "day_master", "day_master", "strength_level", dayMaster.strengthLevel, "derived", "medium", "dayMaster", "strengthLevel"),
    parseFiniteNumber(dayMaster.strengthScore) !== null
      ? scalarFact("day_master", "day_master", "day_master", "strength_score", parseFiniteNumber(dayMaster.strengthScore), "derived", "medium", "dayMaster", "strengthScore")
      : null,
    scalarFact("day_master", "day_master", "day_master", "in_season", Boolean(dayMaster.inSeason), "derived", "medium", "dayMaster", "inSeason"),
    scalarFact("day_master", "day_master", "day_master", "root_level", dayMaster.rootLevel, "derived", "medium", "dayMaster", "rootLevel"),
  ].filter(Boolean);
}

function extractPillarFacts(fv) {
  const facts = [];
  for (const key of pillarKeys) {
    const pillar = fv.pillars?.[key] ?? {};
    facts.push(
      scalarFact("pillar", "pillar", key, "pillar_stem", pillar.stem, "observed", "high", "pillars", `${key}.stem`),
      scalarFact("pillar", "pillar", key, "pillar_branch", pillar.branch, "observed", "high", "pillars", `${key}.branch`),
      scalarFact("pillar", "pillar", key, "pillar_stem_ten_god", pillar.stemTenGod, "observed", "high", "pillars", `${key}.stemTenGod`),
      scalarFact("pillar", "pillar", key, "pillar_branch_main_ten_god", pillar.branchMainTenGod, "observed", "high", "pillars", `${key}.branchMainTenGod`),
      scalarFact("pillar", "pillar", key, "pillar_nayin", pillar.nayin, "observed", "medium", "pillars", `${key}.nayin`),
      scalarFact("pillar", "pillar", key, "pillar_twelve_growth", pillar.twelveGrowth, "derived", "medium", "pillars", `${key}.twelveGrowth`),
      scalarFact("pillar", "pillar", key, "pillar_void_reference", pillar.voidBranches ?? [], "observed", "medium", "pillars", `${key}.voidBranches`),
    );
    for (const hidden of pillar.hiddenStems ?? []) {
      const hiddenKey =
        stableEntityKey("hidden", {
          pillar: key,
          stem: hidden.stem ?? "",
          tenGod: hidden.tenGod ?? "",
          role: hidden.role ?? hidden.qiLevel ?? "",
          weight: parseFiniteNumber(hidden.weight ?? hidden.percentage),
        });
      const hiddenValue = {
        stem: hidden.stem ?? "",
        tenGod: hidden.tenGod ?? "",
        role: hidden.role ?? hidden.qiLevel ?? "",
        position: `${key}.branch.hidden`,
      };
      assignFinite(hiddenValue, "weight", hidden.weight ?? hidden.percentage);
      facts.push(baseFact({
        category: "pillar",
        subject: subject("hidden_stem", `${key}.${hiddenKey}`, [key], `${key}藏干`),
        predicate: "hidden_stem",
        value: hiddenValue,
        status: "observed",
        confidence: "medium",
        sourceRefs: [sourceRef("pillars", `${key}.hiddenStems`, hiddenKey)],
        tags: ["hidden_stem", hidden.tenGod ?? ""],
      }));
    }
  }
  return facts.filter(Boolean);
}

function extractElementFacts(fv) {
  const elements = fv.elements ?? {};
  const facts = [];
  for (const key of elementKeys) {
    const count = parseFiniteNumber(elements.counts?.[key]);
    if (count !== null) {
      facts.push(scalarFact("element", "element", key, "element_count", count, "observed", "medium", "elements", `counts.${key}`));
    }
    const ratio = parseFiniteNumber(elements.ratios?.[key]);
    if (ratio !== null) {
      facts.push(scalarFact("element", "element", key, "element_ratio", ratio, "derived", "medium", "elements", `ratios.${key}`));
    }
  }
  facts.push(
    scalarFact("element", "element_set", "dominant", "dominant_elements", elements.dominant ?? [], "derived", "medium", "elements", "dominant"),
    scalarFact("element", "element_set", "weakest", "weakest_elements", elements.weakest ?? [], "derived", "medium", "elements", "weakest"),
    scalarFact("element", "element_profile", "bias", "bias_level", elements.biasLevel, "derived", "medium", "elements", "biasLevel"),
  );
  for (const chain of elements.flowChains ?? []) {
    const chainKey =
      stableEntityKey("flow_chain", chain);
    facts.push(scalarFact("element", "flow_chain", chainKey, "flow_chain_candidate", chain, "candidate", "medium", "elements", "flowChains"));
  }
  return facts.filter(Boolean);
}

function extractTenGodStateFacts(fv) {
  const facts = [];
  for (const [name, state] of Object.entries(fv.tenGodStates ?? {})) {
    const presenceValue = {
      tenGod: name,
    };
    assignFinite(presenceValue, "weightedCount", state.weightedCount);
    assignFinite(presenceValue, "visibleCount", state.visibleCount);
    assignFinite(presenceValue, "hiddenCount", state.hiddenCount);
    assignFinite(presenceValue, "mainQiCount", state.mainQiCount);
    facts.push(baseFact({
      category: "ten_god",
      subject: subject("ten_god", name, [], name),
      predicate: "ten_god_presence",
      value: presenceValue,
      status: "observed",
      confidence: "medium",
      sourceRefs: [sourceRef("tenGodStates", name, name)],
      tags: [name],
    }));
    facts.push(baseFact({
      category: "ten_god",
      subject: subject("ten_god", name, [], name),
      predicate: "ten_god_visibility",
      value: {
        visiblePositions: state.visiblePositions ?? [],
        hiddenPositions: state.hiddenPositions ?? [],
        mainQiPositions: state.mainQiPositions ?? [],
      },
      status: "observed",
      confidence: "medium",
      sourceRefs: [sourceRef("tenGodStates", name, name)],
      tags: [name],
    }));
    facts.push(baseFact({
      category: "ten_god",
      subject: subject("ten_god", name, [], name),
      predicate: "ten_god_strength",
      value: {
        strengthLevel: state.strengthLevel ?? "unknown",
        relationIds: (state.relatedRelations ?? []).map((relation) => relation.id).filter(Boolean),
      },
      status: "derived",
      confidence: "medium",
      sourceRefs: [sourceRef("tenGodStates", name, name)],
      tags: [name, state.strengthLevel ?? ""],
    }));
  }
  return facts;
}

function extractRelationFacts(fv) {
  return (fv.relationMatrix?.items ?? []).map((relation) => baseFact({
    category: "relation",
    subject: subject("pillar_pair", pillarPairKey(relation.participants), relationPillars(relation), ""),
    predicate: "has_relation",
    value: {
      relationType: relation.relationType ?? "unknown",
      layer: relation.layer ?? "unknown",
      participants: sanitizeParticipants(relation.participants ?? relation.members ?? []),
      direction: relation.direction ?? null,
      formation: relation.formation ?? "unknown",
      canTransform: Boolean(relation.canTransform),
      transformed: Boolean(relation.transformed),
      affects: relation.affects ?? {},
      confidence: relation.confidence ?? "unknown",
      relationId: relation.id ?? "",
    },
    status: "observed",
    confidence: relation.confidence ?? "unknown",
    sourceRefs: [sourceRef("relationMatrix", "items", relation.id ?? "")],
    evidence: evidenceList(relation.evidence),
    tags: [relation.relationType ?? "", relation.layer ?? ""],
    warnings: relation.warnings ?? [],
  }));
}

function extractPalaceFacts(fv) {
  const facts = [];
  for (const key of pillarKeys) {
    const palace = fv.palaceFeatures?.[key] ?? {};
    facts.push(baseFact({
      category: "palace",
      subject: subject("palace", key, [key], palace.label ?? ""),
      predicate: "palace_structure",
      value: {
        stem: palace.stem ?? "",
        branch: palace.branch ?? "",
        stemTenGod: palace.stemTenGod ?? "",
        branchMainTenGod: palace.branchMainTenGod ?? "",
        hiddenTenGods: palace.hiddenTenGods ?? [],
      },
      status: "observed",
      confidence: "medium",
      sourceRefs: [sourceRef("palaceFeatures", key, key)],
      tags: ["palace", key],
    }));
    facts.push(baseFact({
      category: "palace",
      subject: subject("palace", key, [key], palace.label ?? ""),
      predicate: "palace_relation",
      value: {
        relationTypes: palace.relationTypes ?? [],
        relationIds: palace.relationIds ?? [],
        relationSummary: palace.relationSummary ?? {},
      },
      status: "observed",
      confidence: "medium",
      sourceRefs: [sourceRef("palaceFeatures", `${key}.relationIds`, key)],
      tags: ["palace_relation", key],
    }));
  }
  const spouse = fv.palaceFeatures?.spousePalace ?? {};
  facts.push(
    scalarFact("palace", "spouse_palace", "spousePalace", "spouse_palace_branch", spouse.branch, "observed", "medium", "palaceFeatures", "spousePalace.branch"),
    scalarFact("palace", "spouse_palace", "spousePalace", "spouse_palace_main_ten_god", spouse.mainTenGod, "observed", "medium", "palaceFeatures", "spousePalace.mainTenGod"),
    scalarFact("palace", "spouse_palace", "spousePalace", "spouse_palace_relation", { relationTypes: spouse.relationTypes ?? [], relationIds: spouse.relationIds ?? [] }, "observed", "medium", "palaceFeatures", "spousePalace.relationIds"),
    scalarFact("palace", "spouse_palace", "spousePalace", "spouse_palace_repetition", Boolean(spouse.hasRepetition), "observed", "medium", "palaceFeatures", "spousePalace.hasRepetition"),
  );
  return facts.filter(Boolean);
}

function extractKinshipFacts(fv) {
  const facts = [];
  for (const key of ["father", "mother", "siblings", "spouse", "children"]) {
    const item = fv.kinshipFeatures?.[key] ?? {};
    const status = kinshipFactStatus(item.mappingStatus);
    facts.push(baseFact({
      category: "kinship",
      subject: subject("kinship", key, [], item.label ?? key),
      predicate: "kinship_mapping",
      value: {
        mappingStatus: item.mappingStatus ?? "unknown",
        primaryTenGods: item.primaryTenGods ?? [],
        secondaryTenGods: item.secondaryTenGods ?? [],
        candidateMappings: item.candidateMappings ?? [],
        palaceRefs: item.palaceRefs ?? [],
      },
      status,
      confidence: "medium",
      sourceRefs: [sourceRef("kinshipFeatures", key, key)],
      tags: ["kinship", key],
      warnings: item.warnings ?? [],
    }));
    facts.push(baseFact({
      category: "kinship",
      subject: subject("kinship", key, [], item.label ?? key),
      predicate: "kinship_star_presence",
      value: kinshipStarPresenceValue(item.starProfile),
      status,
      confidence: "medium",
      sourceRefs: [sourceRef("kinshipFeatures", `${key}.starProfile`, key)],
      tags: ["kinship_star", key],
    }));
    facts.push(baseFact({
      category: "kinship",
      subject: subject("kinship", key, [], item.label ?? key),
      predicate: "kinship_star_visibility",
      value: {
        visiblePositions: item.starProfile?.visiblePositions ?? [],
        hiddenPositions: item.starProfile?.hiddenPositions ?? [],
        relationIds: item.starProfile?.relationIds ?? [],
      },
      status,
      confidence: "medium",
      sourceRefs: [sourceRef("kinshipFeatures", `${key}.starProfile`, key)],
      tags: ["kinship_visibility", key],
    }));
    facts.push(baseFact({
      category: "kinship",
      subject: subject("kinship", key, [], item.label ?? key),
      predicate: "kinship_palace_relation",
      value: {
        palaceRefs: item.palaceProfile?.refs ?? [],
        relationTypes: item.palaceProfile?.relationTypes ?? [],
        relationIds: item.palaceProfile?.relationIds ?? [],
      },
      status: "candidate",
      confidence: "medium",
      sourceRefs: [sourceRef("kinshipFeatures", `${key}.palaceProfile`, key)],
      tags: ["kinship_palace", key],
    }));
  }
  return facts;
}

function extractVoidFacts(fv) {
  const facts = [];
  const voidFeatures = fv.voidFeatures ?? {};
  const references = voidFeatures.references ?? {};

  facts.push(baseFact({
    category: "void",
    subject: subject("void_primary_reference", "primary", [], "旬空主要参考"),
    predicate: "primary_void_reference",
    value: {
      primaryReference: voidFeatures.primaryReference ?? "day",
    },
    status: "observed",
    confidence: "medium",
    sourceRefs: [sourceRef("voidFeatures", "primaryReference", "primary")],
    tags: ["void", "primary_reference"],
  }));

  for (const referenceKey of ["day", "year"]) {
    const reference =
      references[referenceKey] ??
      (referenceKey === voidFeatures.primaryReference
        ? {
            sourcePillar: referenceKey,
            voidBranches: voidFeatures.voidBranches ?? [],
          }
        : null);
    if (!reference) continue;
    facts.push(baseFact({
      category: "void",
      subject: subject("void_reference", referenceKey, [], `${referenceKey}旬空参考`),
      predicate: "void_reference",
      value: {
        referencePillar:
          reference.referencePillar ??
          reference.sourcePillar ??
          referenceKey,
        sourceGanzhi:
          reference.sourceGanzhi ?? "",
        voidBranches:
          reference.voidBranches ?? [],
      },
      status: "observed",
      confidence: "medium",
      sourceRefs: [sourceRef("voidFeatures", `references.${referenceKey}`, referenceKey)],
      evidence: evidenceList(reference.evidence),
      tags: ["void", referenceKey],
      warnings: reference.warnings ?? [],
    }));
  }

  const referenceEntries =
    Object.keys(references).length > 0
      ? Object.entries(references)
      : [[voidFeatures.primaryReference ?? "day", voidFeatures]];
  for (const [referenceKey, reference] of referenceEntries) {
    for (const key of pillarKeys) {
      const item =
        reference?.byPillar?.[key] ??
        voidFeatures.byReference?.[referenceKey]?.byPillar?.[key] ??
        null;
      if (!item) continue;
      facts.push(baseFact({
        category: "void",
        subject: subject("pillar", `${referenceKey}:${key}`, [referenceKey, key], item.label ?? key),
        predicate: "pillar_void_state",
        value: {
          isVoid: Boolean(item.isVoid),
          referencePillar:
            item.referencePillar ??
            referenceKey,
          voidBranches:
            reference?.voidBranches ?? [],
          branchMainTenGod:
            item.branchMainTenGod ?? "",
        },
        status: "observed",
        confidence: "medium",
        sourceRefs: [sourceRef("voidFeatures", `references.${referenceKey}.byPillar.${key}`, `${referenceKey}:${key}`)],
        evidence: evidenceList(item.evidence),
        tags: ["void", referenceKey, key],
        warnings: item.warnings ?? [],
      }));
    }
  }

  facts.push(baseFact({
    category: "void",
    subject: subject("void_reference_set", "references", [], "旬空参考集合"),
    predicate: "void_reference_set",
    value: {
      primaryReference: voidFeatures.primaryReference ?? "day",
      referenceKeys: Object.keys(references),
    },
    status: "observed",
    confidence: "medium",
    sourceRefs: [sourceRef("voidFeatures", "references", "")],
    tags: ["void"],
  }));
  facts.push(baseFact({
    category: "void",
    subject: subject("spouse_palace", "spousePalace", ["day"], "夫妻宫"),
    predicate: "spouse_palace_void_state",
    value: voidFeatures.spousePalace ?? {},
    status: "observed",
    confidence: "medium",
    sourceRefs: [sourceRef("voidFeatures", "spousePalace", "spousePalace")],
    tags: ["void", "spousePalace"],
  }));
  return facts;
}

function extractStorageFacts(fv) {
  const facts = [];
  for (const key of pillarKeys) {
    const item = fv.storageFeatures?.byPillar?.[key] ?? {};
    facts.push(baseFact({
      category: "storage",
      subject: subject("pillar", key, [key], item.label ?? key),
      predicate: "is_storage_branch",
      value: {
        isStorage: Boolean(item.isStorage),
        storageElement: item.storageElement ?? "",
        storedStem: item.storedStem ?? "",
        storedTenGod: item.storedTenGod ?? "",
        openState: item.openState ?? "unknown",
      },
      status: "observed",
      confidence: "medium",
      sourceRefs: [sourceRef("storageFeatures", `byPillar.${key}`, key)],
      tags: ["storage", key],
    }));
    if (hasRealOpeningSignal(item)) {
      facts.push(baseFact({
        category: "storage",
        subject: subject("pillar", key, [key], item.label ?? key),
        predicate: "opening_signal",
        value: {
          hasOpeningSignal: true,
          openingSignalTypes: item.openingSignalTypes ?? [],
          openingSignalRelationIds: item.openingSignalRelationIds ?? [],
          openState: item.openState ?? "unknown",
        },
        status: "candidate",
        confidence: "medium",
        sourceRefs: [sourceRef("storageFeatures", `byPillar.${key}.openingSignalTypes`, key)],
        tags: ["storage_opening_candidate", key],
      }));
    }
  }
  return facts;
}

function extractGrowthStageFacts(fv) {
  return pillarKeys.flatMap((key) => {
    const item = fv.growthStageFeatures?.byPillar?.[key] ?? {};
    const growthValue = {
      referenceStem: fv.growthStageFeatures?.referenceStem ?? "",
      stage: item.stage ?? "unknown",
      isKnown: Boolean(item.isKnown),
    };
    assignFinite(growthValue, "stageIndex", item.stageIndex);
    return [
      baseFact({
        category: "growth_stage",
        subject: subject("pillar", key, [key], item.label ?? key),
        predicate: "growth_stage",
        value: growthValue,
        status: "derived",
        confidence: "medium",
        sourceRefs: [sourceRef("growthStageFeatures", `byPillar.${key}`, key)],
        tags: ["growth_stage", item.stage ?? ""],
      }),
      baseFact({
        category: "growth_stage",
        subject: subject("pillar", key, [key], item.label ?? key),
        predicate: "growth_phase",
        value: { phase: item.phase ?? "unknown" },
        status: "derived",
        confidence: "medium",
        sourceRefs: [sourceRef("growthStageFeatures", `byPillar.${key}.phase`, key)],
        tags: ["growth_phase", item.phase ?? ""],
      }),
    ];
  });
}

function extractClimateFacts(fv) {
  const climate = fv.climateProfile ?? {};
  const facts = [
    baseFact({
      category: "climate",
      subject: subject("month", "month", ["month"], "月令气候"),
      predicate: "month_climate",
      value: {
        monthBranch: climate.monthBranch ?? "",
        season: climate.season ?? "unknown",
        scores: climate.scores ?? {},
      },
      status: "derived",
      confidence: climate.confidence ?? "unknown",
      sourceRefs: [sourceRef("climateProfile", "monthBranch", "month")],
      tags: ["climate"],
    }),
    scalarFact("climate", "climate", "temperature", "temperature_tendency", climate.tendencies?.temperature, "derived", climate.confidence ?? "unknown", "climateProfile", "tendencies.temperature"),
    scalarFact("climate", "climate", "moisture", "moisture_tendency", climate.tendencies?.moisture, "derived", climate.confidence ?? "unknown", "climateProfile", "tendencies.moisture"),
    scalarFact("climate", "climate", "temperature", "temperature_severity", climate.severity?.temperature, "derived", climate.confidence ?? "unknown", "climateProfile", "severity.temperature"),
    scalarFact("climate", "climate", "moisture", "moisture_severity", climate.severity?.moisture, "derived", climate.confidence ?? "unknown", "climateProfile", "severity.moisture"),
  ];
  for (const need of climate.priorityNeeds ?? []) {
    const itemKey =
      stableEntityKey("priority_need", need);
    facts.push(scalarFact("climate", "priority_need", itemKey, "climate_priority_need", need, "candidate", climate.confidence ?? "unknown", "climateProfile", "priorityNeeds", itemKey));
  }
  for (const candidate of climate.candidateElements ?? []) {
    const itemKey =
      stableEntityKey("candidate_element", candidate.element ?? candidate);
    facts.push(scalarFact("climate", "candidate_element", itemKey, "climate_candidate_element", candidate, "candidate", candidate.confidence ?? climate.confidence ?? "unknown", "climateProfile", "candidateElements", itemKey));
  }
  for (const item of climate.existingSupport ?? []) {
    const itemKey =
      stableEntityKey("existing_support", item);
    facts.push(scalarFact("climate", "existing_support", itemKey, "climate_existing_support", item, "derived", "medium", "climateProfile", "existingSupport", itemKey));
  }
  for (const item of climate.missingSupport ?? []) {
    const itemKey =
      stableEntityKey("missing_support", item);
    facts.push(scalarFact("climate", "missing_support", itemKey, "climate_missing_support", item, "candidate", "medium", "climateProfile", "missingSupport", itemKey));
  }
  for (const item of climate.passThroughCandidates ?? []) {
    const itemKey =
      stableElementPairKey(item);
    facts.push(baseFact({
      category: "pass_through",
      subject: subject("element_pair", itemKey, item.conflictElements ?? [], item.label ?? ""),
      predicate: "coexistence_pass_through_candidate",
      value: {
        conflictElements: item.conflictElements ?? [],
        mediatorElement: item.mediatorElement ?? "",
        mediatorPresent: Boolean(item.mediatorPresent),
        availabilityStatus: item.availabilityStatus ?? item.status ?? "unknown",
      },
      status: "candidate",
      confidence: "medium",
      sourceRefs: [sourceRef("climateProfile", "passThroughCandidates", itemKey)],
      tags: ["pass_through", item.mediatorElement ?? ""],
    }));
  }
  return facts.filter(Boolean);
}

function extractWorkChainFacts(fv) {
  const workChains = fv.workChains ?? {};
  const facts = [];
  for (const node of workChains.nodes ?? []) {
    const nodeValue = {
      nodeId: node.id,
      pillar: node.pillar ?? "",
      position: node.position ?? "",
      visibility: node.visibility ?? "",
      stem: node.stem ?? "",
      branch: node.branch ?? "",
      element: node.element ?? "",
      tenGod: node.tenGod ?? "",
      defaultRole: node.defaultRole ?? "unknown",
      resolvedRole: node.resolvedRole ?? "unknown",
      relationIds: node.relationIds ?? [],
      roleMappingId: node.roleMappingId ?? workChains.roleMappingId ?? "",
    };
    assignFinite(nodeValue, "weight", node.weight);
    facts.push(baseFact({
      category: "work_node",
      subject: subject("work_node", node.id, [node.pillar], node.id),
      predicate: "work_node_role",
      value: nodeValue,
      status: "derived",
      confidence: "medium",
      sourceRefs: [sourceRef("workChains", "nodes", node.id ?? "")],
      tags: ["work_node", node.resolvedRole ?? ""],
    }));
  }
  for (const edge of workChains.edges ?? []) {
    facts.push(baseFact({
      category: "work_edge",
      subject: subject("work_edge", edge.id, [edge.source, edge.target], edge.id),
      predicate: "work_edge",
      value: {
        edgeId: edge.id,
        source: edge.source ?? "",
        target: edge.target ?? "",
        semanticType: edge.semanticType ?? "",
        activation: edge.activation ?? "potential",
        potentialConfidence: edge.potentialConfidence ?? "unknown",
        activatedConfidence: edge.activatedConfidence ?? "unknown",
        confidence: edge.confidence ?? "unknown",
        relationIds: edge.relationIds ?? [],
        scopes: edge.scopes ?? [],
        chainEligible: Boolean(edge.chainEligible),
      },
      status: edge.activation === "activated" ? "derived" : "candidate",
      confidence: edge.confidence ?? "unknown",
      sourceRefs: [sourceRef("workChains", "edges", edge.id ?? "")],
      tags: ["work_edge", edge.semanticType ?? "", edge.activation ?? ""],
    }));
  }
  for (const chain of workChains.chains ?? []) {
    const chainValue = {
      chainId: chain.id,
      chainType: chain.chainType ?? "",
      nodeIds: chain.nodeIds ?? [],
      edgeIds: chain.edgeIds ?? [],
      roleFlow: chain.roleFlow ?? "unknown",
      selfInvolved: Boolean(chain.selfInvolved),
      activationLevel: chain.activationLevel ?? "unknown",
      confidence: chain.confidence ?? "unknown",
    };
    assignFinite(chainValue, "hiddenNodeCount", chain.hiddenNodeCount);
    assignFinite(chainValue, "priorityScore", chain.priorityScore);
    facts.push(baseFact({
      category: "work_chain",
      subject: subject("work_chain", chain.id, chain.nodeIds ?? [], chain.id),
      predicate: "work_chain_candidate",
      value: chainValue,
      status: "candidate",
      confidence: chain.confidence ?? "unknown",
      sourceRefs: [sourceRef("workChains", "chains", chain.id ?? "")],
      tags: ["work_chain", chain.roleFlow ?? ""],
      warnings: chain.warnings ?? [],
    }));
  }
  for (const candidate of workChains.actualConflictCandidates ?? []) {
    const candidateKey =
      stableConflictKey(candidate);
    facts.push(baseFact({
      category: "conflict",
      subject: subject("work_edge", candidateKey, [candidate.sourceNodeId, candidate.targetNodeId], candidate.edgeId ?? ""),
      predicate: "actual_conflict_candidate",
      value: {
        edgeId: candidate.edgeId ?? "",
        relationIds: candidate.relationIds ?? [],
        sourceNodeId: candidate.sourceNodeId ?? "",
        targetNodeId: candidate.targetNodeId ?? "",
        conflictElements: candidate.conflictElements ?? [],
        mediatorElement: candidate.mediatorElement ?? "",
        mediatorPresent: Boolean(candidate.mediatorPresent),
        availabilityStatus: candidate.availabilityStatus ?? "unknown",
        confidence: candidate.confidence ?? "unknown",
      },
      status: "candidate",
      confidence: candidate.confidence ?? "unknown",
      sourceRefs: [sourceRef("workChains", "actualConflictCandidates", candidate.id ?? candidateKey)],
      tags: ["conflict", candidate.mediatorElement ?? ""],
    }));
  }
  return facts;
}

function scalarFact(category, subjectType, key, predicate, value, status, confidence, featureGroup, path, itemId = "") {
  if (isMissingValue(value)) return null;
  if (typeof value === "number" && !Number.isFinite(value)) return null;
  return baseFact({
    category,
    subject: subject(subjectType, key, [key], String(key)),
    predicate,
    value,
    status,
    confidence,
    sourceRefs: [sourceRef(featureGroup, path, itemId || `${subjectType}:${key}:${predicate}`)],
    tags: [predicate],
  });
}

function baseFact(fact) {
  return {
    category: fact.category,
    subject: fact.subject,
    predicate: fact.predicate,
    value: fact.value,
    status: fact.status,
    confidence: fact.confidence,
    sourceRefs: fact.sourceRefs ?? [],
    evidence: fact.evidence ?? [],
    tags: (fact.tags ?? []).filter(Boolean),
    warnings: fact.warnings ?? [],
  };
}

function subject(type, key, keys = [], label = "") {
  return {
    type,
    key: String(key ?? ""),
    keys: (Array.isArray(keys) ? keys : []).map(String).filter(Boolean),
    label: String(label ?? ""),
  };
}

function sourceRef(featureGroup, path, itemId = "") {
  return {
    featureGroup,
    path,
    itemId: String(itemId ?? ""),
  };
}

function evidenceList(items = []) {
  return (Array.isArray(items) ? items : [items])
    .filter((item) => item !== undefined && item !== null && item !== "")
    .map((item) => typeof item === "object" ? item : { text: String(item) });
}

function sanitizeParticipants(items = []) {
  return (Array.isArray(items) ? items : []).map((item) => ({
    pillar: item?.pillar ?? "",
    position: item?.position ?? "",
    value: item?.value ?? "",
  }));
}

function relationPillars(relation = {}) {
  return [...new Set((relation.participants ?? relation.members ?? [])
    .map((item) => item?.pillar)
    .filter(Boolean))];
}

function pillarPairKey(participants = []) {
  const keys = relationPillars({ participants });
  return keys.join("-") || "unknown";
}

function parseFiniteNumber(value) {
  if (value === undefined || value === null) return null;
  if (typeof value === "string" && value.trim() === "") return null;
  const number = Number(value);
  if (!Number.isFinite(number)) return null;
  return Math.round(number * 100) / 100;
}

function assignFinite(target, key, value) {
  const number =
    parseFiniteNumber(value);
  if (number !== null) {
    target[key] = number;
  }
}

function cleanNumericRecord(record = {}) {
  const result = {};
  for (const [key, value] of Object.entries(record ?? {})) {
    const number =
      parseFiniteNumber(value);
    if (number !== null) {
      result[key] = number;
    }
  }
  return result;
}

function kinshipStarPresenceValue(starProfile = {}) {
  const value = {
    weightedByTenGod:
      cleanNumericRecord(starProfile?.weightedByTenGod),
  };
  assignFinite(value, "weightedCount", starProfile?.weightedCount);
  return value;
}

function kinshipFactStatus(mappingStatus) {
  const status =
    String(mappingStatus ?? "unknown");
  if (new Set([
    "resolved",
    "mapped",
    "available",
    "confirmed",
  ]).has(status)) {
    return "derived";
  }
  return "candidate";
}

function hasRealOpeningSignal(item = {}) {
  if (item.isStorage !== true) return false;
  if (item.hasOpeningSignal !== true) return false;
  return [
    ...(item.openingSignalTypes ?? []),
    ...(item.openingSignalRelationIds ?? []),
  ].some((value) => !isMissingValue(value));
}

function isMissingValue(value) {
  return (
    value === undefined ||
    value === null ||
    (typeof value === "string" && value.trim() === "")
  );
}

function stableEntityKey(prefix, value) {
  const base =
    typeof value === "object" && value !== null
      ? stableStringify(value)
      : String(value ?? "");
  const clean =
    base
      .trim()
      .replace(/\s+/g, "_")
      .replace(/[^\p{L}\p{N}_:-]+/gu, "_")
      .replace(/^_+|_+$/g, "")
      .slice(0, 80);
  return `${prefix}:${clean || shortHash(base)}`;
}

function stableElementPairKey(item = {}) {
  return stableEntityKey("element_pair", {
    conflictElements:
      [...(item.conflictElements ?? [])].sort(),
    mediatorElement:
      item.mediatorElement ?? "",
    availabilityStatus:
      item.availabilityStatus ?? item.status ?? "unknown",
  });
}

function stableConflictKey(item = {}) {
  return item.edgeId
    ? String(item.edgeId)
    : stableEntityKey("actual_conflict", {
        sourceNodeId:
          item.sourceNodeId ?? "",
        targetNodeId:
          item.targetNodeId ?? "",
        conflictElements:
          [...(item.conflictElements ?? [])].sort(),
        mediatorElement:
          item.mediatorElement ?? "",
        relationIds:
          [...(item.relationIds ?? [])].sort(),
      });
}

function shortHash(value) {
  let hash = 0x811c9dc5;
  const text = String(value ?? "");
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, "0").slice(0, 8);
}
