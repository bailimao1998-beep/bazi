import { domainRules } from "./domainRuleDatabase.js";
import { combinationRules } from "./combinationRuleDatabase.js";
import { buildAtomicNatalFacts } from "../natal/atomicNatalFactEngine.js";
import { buildNatalFeatureVector } from "../natal/natalFeatureVector.js";

const tenGodGroups = {
  peer: ["比肩", "劫财", "日主"],
  resource: ["正印", "偏印"],
  output: ["食神", "伤官"],
  wealth: ["正财", "偏财"],
  officer: ["正官", "七杀"],
};

const elementLabels = {
  wood: "木",
  fire: "火",
  earth: "土",
  metal: "金",
  water: "水",
};

const pillarKeys = ["year", "month", "day", "hour"];

const primaryFactPreferences = {
  self: [
    "resource_visible_month_stem",
    "officer_resource_chain",
    "day_master_profile",
    "peer_visible_hour_stem",
    "peer_dominant",
    "element_bias",
    "day_branch_relation",
  ],
  parents: [
    "wealth_visible_year_month",
    "earth_storage_bearing",
    "resource_visible_month_stem",
    "officer_resource_chain",
    "month_pillar_environment",
  ],
  siblings: [
    "peer_visible_hour_stem",
    "peer_dominant",
    "peer_wealth_tension",
  ],
  spouse: [
    "day_branch_relation",
    "officer_dominant",
    "officer_resource_chain",
  ],
  children: [
    "output_weak",
    "hour_pillar_result",
    "output_wealth_chain",
    "output_dominant",
  ],
  wealth: [
    "wealth_visible_year_month",
    "earth_storage_bearing",
    "output_wealth_chain",
    "peer_wealth_tension",
    "wealth_dominant",
    "peer_dominant",
  ],
  health: [
    "element_bias",
    "day_branch_relation",
    "water_wood_flow",
  ],
  movement: [
    "water_wood_flow",
    "day_branch_relation",
    "element_bias",
  ],
  friends: [
    "peer_visible_hour_stem",
    "peer_wealth_tension",
    "peer_dominant",
    "day_branch_relation",
  ],
  career: [
    "officer_resource_chain",
    "resource_visible_month_stem",
    "output_wealth_chain",
    "officer_dominant",
    "month_pillar_environment",
    "output_weak",
  ],
  property: [
    "earth_storage_bearing",
    "wealth_visible_year_month",
    "month_pillar_environment",
  ],
  fortune: [
    "resource_visible_month_stem",
    "officer_resource_chain",
    "water_wood_flow",
    "element_bias",
    "day_master_profile",
  ],
};

export function buildDomainEvidence({ chart, baseBaziViewModel, natalImageReport, featureVector, atomicFacts } = {}) {
  const vector = featureVector ?? buildNatalFeatureVector({ chart, baseBaziViewModel });
  const factResult = atomicFacts ?? buildAtomicNatalFacts(vector);
  const signals = extractSignals({ chart: chart ?? {}, baseBaziViewModel: baseBaziViewModel ?? {}, natalImageReport: natalImageReport ?? {} });
  const primaryUse = new Map();
  const domainEvidence = Object.fromEntries(domainRules.map((rule) => {
    const facts = selectFactsForDomain(rule.key, factResult.facts ?? [], primaryUse);
    const matchedSignals = matchDomainSignals(signals, rule);
    const matchedCombinations = matchCombinations(signals, rule.key);
    const score = calculateScore({ matchedSignals, matchedCombinations, facts });
    const primaryFact = facts.primaryFact ?? null;
    if (primaryFact?.id) primaryUse.set(primaryFact.id, (primaryUse.get(primaryFact.id) || 0) + 1);
    return [rule.key, {
      domain: rule.key,
      score,
      primaryFact,
      secondaryFacts: facts.secondaryFacts,
      tensionFact: facts.tensionFact,
      counterFact: facts.counterFact,
      matchedFactIds: compact([
        primaryFact?.id,
        facts.secondaryFacts.map((fact) => fact.id),
        facts.tensionFact?.id,
        facts.counterFact?.id,
      ]),
      evidence: compact([
        primaryFact?.evidence,
        facts.secondaryFacts.flatMap((fact) => fact.evidence ?? []),
        facts.tensionFact?.evidence,
      ]).slice(0, 10),
      matchedSignals,
      matchedRules: buildMatchedRules(rule, matchedSignals),
      matchedCombinations,
      confidence: confidenceFromScore(score),
    }];
  }));

  return { signals, atomicFacts: factResult, featureVector: vector, domainEvidence };
}

function selectFactsForDomain(domainKey, facts = [], primaryUse = new Map()) {
  const matched = facts
    .filter((fact) => (fact.domains ?? []).includes(domainKey))
    .sort((a, b) => rankFactForDomain(domainKey, b) - rankFactForDomain(domainKey, a) || b.score - a.score || a.id.localeCompare(b.id));
  const primaryFact = matched.find((fact) => (primaryUse.get(fact.id) || 0) < 2 && fact.specificity !== "generic") || matched[0] || null;
  const secondaryFacts = matched
    .filter((fact) => fact.id !== primaryFact?.id && fact.role !== "tension" && fact.role !== "counter")
    .slice(0, 2);
  const tensionFact = matched.find((fact) => fact.role === "tension" && fact.id !== primaryFact?.id) || null;
  const counterFact = matched.find((fact) => fact.role === "counter" && fact.id !== primaryFact?.id) || null;
  return { primaryFact, secondaryFacts, tensionFact, counterFact };
}

function rankFactForDomain(domainKey, fact = {}) {
  const preferences = primaryFactPreferences[domainKey] ?? [];
  const preferenceIndex = preferences.indexOf(fact.id);
  const preferenceScore = preferenceIndex >= 0 ? 140 - preferenceIndex * 12 : 0;
  const specificityScore = {
    high: 32,
    medium: 12,
    low: 0,
    generic: -20,
  }[fact.specificity] ?? 8;
  const roleScore = {
    main: 16,
    resource: 14,
    support: 10,
    base: 8,
    tension: domainKey === "spouse" || domainKey === "health" || domainKey === "movement" ? 12 : 4,
    counter: domainKey === "children" ? 18 : 2,
  }[fact.role] ?? 6;
  return preferenceScore + specificityScore + roleScore + Number(fact.score ?? 0) / 10;
}

function extractSignals({ chart, baseBaziViewModel, natalImageReport }) {
  const signals = [];
  const details = chart.pillarDetails ?? {};
  const pillars = chart.pillars ?? {};
  const structure = chart.structureAnalysis ?? baseBaziViewModel.structureAnalysis ?? {};
  const tenGodCounts = sumCountMaps(
    baseBaziViewModel.tenGods?.mainQi ?? chart.tenGodStats?.mainQi ?? {},
    baseBaziViewModel.tenGods?.fullHidden ?? chart.tenGodStats?.fullHidden ?? {},
  );
  const groupCounts = {
    peer: sumTenGods(tenGodCounts, tenGodGroups.peer),
    resource: sumTenGods(tenGodCounts, tenGodGroups.resource),
    output: sumTenGods(tenGodCounts, tenGodGroups.output),
    wealth: sumTenGods(tenGodCounts, tenGodGroups.wealth),
    officer: sumTenGods(tenGodCounts, tenGodGroups.officer),
  };

  addSignal(signals, {
    type: "structure",
    label: chart.dayMaster?.label || "日主",
    value: chart.dayMaster?.stem || chart.dayMaster?.label || "日主",
    source: "日主",
    strength: "medium",
    text: chart.dayMaster?.element ? `日主五行为${elementLabels[chart.dayMaster.element] ?? chart.dayMaster.element}` : "日主为原局自身入口",
  });
  addSignal(signals, {
    type: "element",
    label: "日主五行",
    value: elementLabels[chart.dayMaster?.element] ?? chart.dayMaster?.element,
    source: "日主",
    strength: "medium",
    text: chart.dayMaster?.element ? `日主五行为${elementLabels[chart.dayMaster.element] ?? chart.dayMaster.element}` : "",
  });

  for (const key of pillarKeys) {
    const pillar = pillars[key] ?? {};
    const detail = details[key] ?? {};
    const pillarName = detail.label ?? pillar.role ?? pillarLabel(key);
    addSignal(signals, {
      type: "pillar",
      label: pillarName,
      value: pillar.label,
      source: "四柱",
      strength: key === "day" || key === "month" ? "strong" : "medium",
      text: pillar.label ? `${pillarName}${pillar.label}` : "",
    });
    addSignal(signals, {
      type: "tenGod",
      label: detail.stemTenGod,
      value: detail.stemTenGod,
      source: `${pillarName}天干十神`,
      strength: "medium",
      text: detail.stemTenGod ? `${pillarName}天干见${detail.stemTenGod}` : "",
    });
    addSignal(signals, {
      type: "tenGod",
      label: detail.branchMainTenGod,
      value: detail.branchMainTenGod,
      source: `${pillarName}地支主气十神`,
      strength: "medium",
      text: detail.branchMainTenGod ? `${pillarName}地支主气为${detail.branchMainTenGod}` : "",
    });
    for (const hidden of detail.hiddenStems ?? []) {
      addSignal(signals, {
        type: "tenGod",
        label: hidden.tenGod,
        value: hidden.tenGod,
        source: `${pillarName}藏干`,
        strength: hidden.role === "主气" ? "medium" : "weak",
        text: hidden.tenGod ? `${pillarName}藏干${hidden.stem ?? ""}见${hidden.tenGod}` : "",
      });
    }
    for (const item of detail.shensha ?? []) {
      addSignal(signals, {
        type: "shensha",
        label: item.name,
        value: item.name,
        source: `${pillarName}神煞`,
        strength: "weak",
        text: item.theme || item.name,
      });
    }
  }

  addCountSignals(signals, groupCounts);
  addElementSignals(signals, chart, baseBaziViewModel);
  addStructureSignals(signals, structure);
  addRelationSignals(signals, chart.relations ?? baseBaziViewModel.relations ?? []);
  addReportSignals(signals, natalImageReport);

  return dedupeSignals(signals);
}

function addCountSignals(signals, counts) {
  addSignal(signals, signalFromCount("比劫重", "比劫", counts.peer, 3, "十神统计"));
  if (counts.peer >= 2) addSignal(signals, signalFromCount("比劫明显", "比劫", counts.peer, 2, "十神统计"));
  addSignal(signals, signalFromCount("印星明显", "印星", counts.resource, 3, "十神统计"));
  addSignal(signals, signalFromCount("食伤明显", "食伤", counts.output, 3, "十神统计"));
  if (counts.output <= 1) addSignal(signals, signalFromCount("食伤弱", "食伤", counts.output, 1, "十神统计"));
  addSignal(signals, signalFromCount("财星明显", "财星", counts.wealth, 3, "十神统计"));
  if (counts.wealth >= 1) addSignal(signals, signalFromCount("财星有迹", "财星", counts.wealth, 1, "十神统计"));
  if (counts.wealth === 0) addSignal(signals, signalFromCount("财星弱", "财星", counts.wealth, 0, "十神统计"));
  addSignal(signals, signalFromCount("官杀明显", "官杀", counts.officer, 2, "十神统计"));
}

function addElementSignals(signals, chart, baseBaziViewModel) {
  const fiveElements = chart.elements ?? chart.elementStats ?? baseBaziViewModel.fiveElements ?? {};
  const counts = sumElementCounts(fiveElements);
  const values = Object.values(counts);
  const nonZero = values.filter((value) => value > 0).length;
  const max = Math.max(0, ...values);
  const min = Math.min(...values.filter((value) => value > 0), max);
  const dominant = chart.dominantElements?.[0] ?? baseBaziViewModel.fiveElements?.dominant?.[0] ?? null;

  if (dominant?.element) {
    addSignal(signals, {
      type: "element",
      label: `${elementLabels[dominant.element] ?? dominant.label ?? dominant.element}气明显`,
      value: elementLabels[dominant.element] ?? dominant.label ?? dominant.element,
      source: "五行统计",
      strength: "strong",
      text: `主导五行见${elementLabels[dominant.element] ?? dominant.label ?? dominant.element}`,
    });
  }
  if (nonZero >= 5) {
    addSignal(signals, {
      type: "element",
      label: "五行流通较好",
      value: "五行流通",
      source: "五行统计",
      strength: "medium",
      text: "五行均有出现，结构具备流通观察点",
    });
  }
  if (max - min >= 3 || nonZero <= 3) {
    addSignal(signals, {
      type: "element",
      label: "五行偏颇明显",
      value: "五行偏颇",
      source: "五行统计",
      strength: "medium",
      text: "五行分布有偏重偏弱的结构提示",
    });
  }
  if ((counts.fire ?? 0) <= 1) {
    addSignal(signals, {
      type: "element",
      label: "火弱或火受制",
      value: "火",
      source: "五行统计",
      strength: "medium",
      text: "火气不算外显主线",
    });
  }
}

function addStructureSignals(signals, structure) {
  const monthCommand = structure.monthCommand ?? {};
  addSignal(signals, {
    type: "structure",
    label: "月令",
    value: monthCommand.branch,
    source: "月令",
    strength: "strong",
    text: monthCommand.description || (monthCommand.branch ? `月令为${monthCommand.branch}` : ""),
  });
  addSignal(signals, {
    type: "structure",
    label: "强弱",
    value: structure.strength?.level,
    source: "强弱",
    strength: structure.strength?.confidence === "high" ? "strong" : "medium",
    text: structure.strength?.level ? `日主强弱初判为${structure.strength.level}` : "",
  });
  for (const reason of structure.roots?.summary ?? []) {
    addSignal(signals, {
      type: "structure",
      label: "通根",
      value: "通根",
      source: "通根",
      strength: "medium",
      text: reason,
    });
  }
  for (const item of structure.stems?.revealedTenGods ?? []) {
    addSignal(signals, {
      type: "tenGod",
      label: `${item.tenGod}透出`,
      value: item.tenGod,
      source: "透干",
      strength: "strong",
      text: item.evidence || `${item.name ?? ""}天干透出${item.tenGod}`,
    });
    if (tenGodGroups.resource.includes(item.tenGod)) addSignal(signals, plainSignal("印星透", "印星", "透干", item.evidence));
  }
  const climate = compact([structure.climate?.coldWarm, structure.climate?.dryWet, structure.climate?.adjustmentHint]).join(" ");
  if (/寒|湿/.test(climate)) {
    addSignal(signals, {
      type: "structure",
      label: "寒湿感",
      value: "寒湿",
      source: "寒暖燥湿",
      strength: "medium",
      text: climate,
    });
  }
  addSignal(signals, {
    type: "structure",
    label: "寒暖燥湿",
    value: climate,
    source: "寒暖燥湿",
    strength: "weak",
    text: climate,
  });
}

function addRelationSignals(signals, relations = []) {
  for (const relation of Array.isArray(relations) ? relations : []) {
    const text = compact([relation.type, relation.name, relation.evidence, relation.effect, relation.pillars, relation.ganzhi]).join(" ");
    addSignal(signals, {
      type: "relation",
      label: relation.type,
      value: relation.type,
      source: "原局关系",
      strength: relation.confidence === "high" ? "strong" : "medium",
      text,
    });
    if (/日柱/.test(text) && /冲/.test(text)) addSignal(signals, plainSignal("日支被冲", "日支", "原局关系", text, "strong"));
    if (/日柱/.test(text) && /合/.test(text)) addSignal(signals, plainSignal("日支被合", "日支", "原局关系", text, "strong"));
    if (/日柱/.test(text) && /(刑|害|破|穿)/.test(text)) addSignal(signals, plainSignal("日支被刑害破", "日支", "原局关系", text, "strong"));
    if (/时柱/.test(text) && /冲/.test(text)) addSignal(signals, plainSignal("时柱被冲", "时柱", "原局关系", text, "medium"));
    if (/年柱/.test(text) && /月柱/.test(text) && /(冲|合|刑|害|破|穿)/.test(text)) addSignal(signals, plainSignal("年月被冲合刑害", "年月", "原局关系", text, "medium"));
  }
}

function addReportSignals(signals, report = {}) {
  for (const card of report.imageCards ?? []) {
    const text = compact([card.title, card.image, card.reality, card.boundary, card.evidence]).join(" ");
    addSignal(signals, {
      type: "topic",
      label: card.topic,
      value: card.topic,
      source: "原局取象报告",
      strength: card.level === "high" || card.confidence === "high" ? "strong" : "medium",
      text,
    });
  }
  for (const item of report.keySignals ?? []) {
    addSignal(signals, {
      type: "structure",
      label: item,
      value: item,
      source: "关键取象",
      strength: "medium",
      text: item,
    });
  }
  for (const item of report.needVerify ?? []) {
    addSignal(signals, {
      type: "structure",
      label: "复核点",
      value: item,
      source: "原局复核",
      strength: "weak",
      text: item,
    });
  }
}

function matchDomainSignals(signals, rule) {
  return signals.filter((signal) => {
    const text = signalText(signal);
    return [
      ...rule.primarySignals,
      ...rule.secondarySignals,
      ...rule.relatedPillars,
      ...rule.relatedTopics,
      ...rule.watchRelations,
    ].some((keyword) => text.includes(keyword));
  }).slice(0, 12);
}

function matchCombinations(signals, domainKey) {
  return combinationRules
    .filter((rule) => rule.domains.includes(domainKey) && isCombinationMatched(signals, rule))
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 4);
}

function isCombinationMatched(signals, rule) {
  const text = signals.map(signalText).join(" ");
  const hasIncluded = (rule.when?.includesAny ?? []).some((keyword) => text.includes(keyword));
  const blocked = (rule.when?.excludesStrong ?? []).some((keyword) => signals.some((signal) => {
    const itemText = signalText(signal);
    return itemText.includes(keyword) && signal.strength === "strong";
  }));
  return hasIncluded && !blocked;
}

function calculateScore({ matchedSignals, matchedCombinations, facts = {} }) {
  const signalScore = matchedSignals.reduce((sum, signal) => {
    const weight = signal.strength === "strong" ? 3 : signal.strength === "medium" ? 2 : 1;
    return sum + weight;
  }, 0);
  const comboScore = matchedCombinations.reduce((sum, rule) => sum + Math.min(6, Number(rule.weight ?? 0)), 0);
  const factItems = [
    facts.primaryFact,
    ...(facts.secondaryFacts ?? []),
    facts.tensionFact,
    facts.counterFact,
  ].filter(Boolean);
  const factScore = factItems.reduce((sum, fact) => sum + Math.min(12, Number(fact.score ?? 0) / 8), 0);
  return signalScore + comboScore + factScore;
}

function buildMatchedRules(rule, matchedSignals) {
  const text = matchedSignals.map(signalText).join(" ");
  return [
    ...rule.primarySignals.filter((keyword) => text.includes(keyword)).map((keyword) => `主证：${keyword}`),
    ...rule.secondarySignals.filter((keyword) => text.includes(keyword)).map((keyword) => `辅证：${keyword}`),
  ].slice(0, 8);
}

function confidenceFromScore(score) {
  if (score >= 18) return "high";
  if (score >= 8) return "medium";
  return "low";
}

function signalFromCount(label, value, count, threshold, source) {
  if (count < threshold) return null;
  return {
    type: "tenGod",
    label,
    value,
    source,
    strength: count >= threshold + 2 ? "strong" : "medium",
    text: `${label}，统计约${count}`,
  };
}

function plainSignal(label, value, source, text, strength = "medium") {
  return { type: "structure", label, value, source, strength, text };
}

function addSignal(signals, signal) {
  if (!signal || !signal.label) return;
  const text = compact([signal.text, signal.value, signal.label]).join(" ");
  if (!text) return;
  signals.push({
    type: signal.type || "structure",
    label: signal.label,
    value: signal.value || signal.label,
    source: signal.source || "命盘",
    strength: ["strong", "medium", "weak"].includes(signal.strength) ? signal.strength : "medium",
    text,
  });
}

function dedupeSignals(signals) {
  const seen = new Set();
  const result = [];
  for (const signal of signals) {
    const key = [signal.type, signal.label, signal.source, signal.text].join("|");
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(signal);
  }
  return result;
}

function signalText(signal) {
  return compact([signal.label, signal.value, signal.source, signal.text, signal.type]).join(" ");
}

function sumTenGods(counts, names) {
  return names.reduce((sum, name) => sum + Number(counts[name] ?? 0), 0);
}

function sumCountMaps(...maps) {
  const result = {};
  for (const map of maps) {
    for (const [key, value] of Object.entries(map || {})) {
      result[key] = (result[key] || 0) + Number(value || 0);
    }
  }
  return result;
}

function sumElementCounts(fiveElements = {}) {
  const counts = {};
  for (const map of [
    fiveElements.visible?.counts,
    fiveElements.hidden?.counts,
    fiveElements.counts,
  ]) {
    for (const [key, value] of Object.entries(map || {})) {
      counts[key] = (counts[key] || 0) + Number(value || 0);
    }
  }
  return counts;
}

function pillarLabel(key) {
  return { year: "年柱", month: "月柱", day: "日柱", hour: "时柱" }[key] ?? key;
}

function compact(items = []) {
  return (Array.isArray(items) ? items : [items])
    .flat()
    .filter((item) => item !== undefined && item !== null && String(item).trim())
    .map((item) => String(item));
}
