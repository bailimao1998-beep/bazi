const pillarKeys = ["year", "month", "day", "hour"];
const pillarLabels = { year: "年柱", month: "月柱", day: "日柱", hour: "时柱" };
const elementLabels = { wood: "木", fire: "火", earth: "土", metal: "金", water: "水" };
const tenGodGroups = {
  peer: ["比肩", "劫财", "日主"],
  resource: ["正印", "偏印"],
  output: ["食神", "伤官"],
  wealth: ["正财", "偏财"],
  officer: ["正官", "七杀"],
};

export function buildNatalFeatureVector({ chart, baseBaziViewModel } = {}) {
  const safeChart = chart ?? {};
  const viewModel = baseBaziViewModel ?? {};
  const structure = safeChart.structureAnalysis ?? viewModel.structureAnalysis ?? {};
  const pillars = buildPillars(safeChart);
  const tenGods = buildTenGodVector(safeChart, viewModel, pillars);
  const elements = buildElementVector(safeChart, viewModel);

  return {
    dayMaster: {
      stem: safeChart.dayMaster?.stem ?? safeChart.pillars?.day?.stem ?? "",
      label: safeChart.dayMaster?.label ?? safeChart.pillars?.day?.stem ?? "",
      element: elementLabels[safeChart.dayMaster?.element] ?? safeChart.dayMaster?.element ?? "",
      strengthLevel: structure.strength?.level ?? "",
      strengthScore: Number(structure.strength?.score ?? 0),
      inSeason: Boolean(structure.monthCommand?.isDayMasterInSeason),
      rootLevel: structure.roots?.dayMasterRootLevel ?? "",
    },
    elements,
    tenGods,
    pillars,
    relations: buildRelations(safeChart.relations ?? viewModel.relations ?? []),
    structure: {
      monthCommand: structure.monthCommand ?? {},
      visibleStems: structure.stems?.revealedTenGods ?? [],
      roots: structure.roots ?? {},
      usefulGodHint: structure.usefulGodHint ?? {},
      climate: structure.climate ?? {},
    },
  };
}

function buildPillars(chart = {}) {
  const details = chart.pillarDetails ?? {};
  const pillars = chart.pillars ?? {};
  return Object.fromEntries(pillarKeys.map((key) => {
    const pillar = pillars[key] ?? {};
    const detail = details[key] ?? {};
    return [key, {
      key,
      label: pillar.label ?? "",
      name: pillarLabels[key],
      stem: pillar.stem ?? "",
      branch: pillar.branch ?? "",
      stemTenGod: detail.stemTenGod ?? "",
      branchMainTenGod: detail.branchMainTenGod ?? "",
      hiddenStems: detail.hiddenStems ?? [],
      shensha: detail.shensha ?? [],
    }];
  }));
}

function buildTenGodVector(chart = {}, viewModel = {}, pillars = {}) {
  const hiddenCounts = viewModel.tenGods?.fullHidden ?? chart.tenGodStats?.fullHidden ?? {};
  const visibleCounts = countVisibleTenGods(pillars);
  const mainQiCounts = viewModel.tenGods?.mainQi ?? chart.tenGodStats?.mainQi ?? {};
  const weightedCounts = sumCountMaps(visibleCounts, mainQiCounts, hiddenCounts);
  const groupCounts = Object.fromEntries(Object.entries(tenGodGroups).map(([key, names]) => [
    key,
    names.reduce((sum, name) => sum + Number(weightedCounts[name] ?? 0), 0),
  ]));

  return {
    weightedCounts,
    visibleCounts,
    hiddenCounts,
    mainQiCounts,
    byPillar: Object.fromEntries(Object.entries(pillars).map(([key, pillar]) => [key, {
      stemTenGod: pillar.stemTenGod,
      branchMainTenGod: pillar.branchMainTenGod,
      hiddenTenGods: (pillar.hiddenStems ?? []).map((item) => item.tenGod).filter(Boolean),
    }])),
    groupCounts,
    dominantGroups: Object.entries(groupCounts)
      .filter(([, count]) => count >= 3)
      .map(([key]) => key),
    weakGroups: Object.entries(groupCounts)
      .filter(([, count]) => count <= 1)
      .map(([key]) => key),
  };
}

function buildElementVector(chart = {}, viewModel = {}) {
  const counts = sumElementCounts(chart.elements ?? chart.elementStats ?? viewModel.fiveElements ?? {});
  const total = Object.values(counts).reduce((sum, value) => sum + Number(value || 0), 0) || 1;
  const ratios = Object.fromEntries(Object.entries(counts).map(([key, value]) => [key, Number(value || 0) / total]));
  const sorted = Object.entries(counts).sort((a, b) => Number(b[1] || 0) - Number(a[1] || 0));
  const dominant = sorted.filter(([, value]) => Number(value || 0) > 0).slice(0, 2).map(([key]) => elementLabels[key] ?? key);
  const weakest = sorted.filter(([, value]) => Number(value || 0) <= 1).map(([key]) => elementLabels[key] ?? key);
  const climate = chart.structureAnalysis?.climate ?? viewModel.structureAnalysis?.climate ?? {};
  return {
    counts,
    ratios,
    dominant,
    weakest,
    biasLevel: sorted[0] && sorted.at(-1) && Number(sorted[0][1] || 0) - Number(sorted.at(-1)[1] || 0) >= 3 ? "偏颇" : "中和",
    climate,
    flowChains: buildFlowChains(counts),
  };
}

function buildRelations(relations = []) {
  return (Array.isArray(relations) ? relations : []).map((relation) => {
    const text = compact([relation.type, relation.name, relation.evidence, relation.effect, relation.pillars, relation.ganzhi]).join(" ");
    return {
      type: relation.type ?? relation.name ?? "",
      name: relation.name ?? relation.type ?? "",
      pillars: relation.pillars ?? [],
      branches: relation.branches ?? relation.ganzhi ?? [],
      target: text,
      importance: /日柱|月柱/.test(text) ? "high" : "medium",
      affectsDayBranch: /日柱/.test(text),
      affectsMonthBranch: /月柱/.test(text),
      text,
    };
  });
}

function countVisibleTenGods(pillars = {}) {
  const result = {};
  for (const pillar of Object.values(pillars)) {
    for (const name of [pillar.stemTenGod, pillar.branchMainTenGod]) {
      if (!name) continue;
      result[name] = (result[name] || 0) + 1;
    }
  }
  return result;
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
  const result = {};
  for (const map of [fiveElements.visible?.counts, fiveElements.hidden?.counts, fiveElements.counts]) {
    for (const [key, value] of Object.entries(map || {})) {
      result[key] = (result[key] || 0) + Number(value || 0);
    }
  }
  return result;
}

function buildFlowChains(counts = {}) {
  const chains = [];
  if ((counts.wood ?? 0) && (counts.fire ?? 0)) chains.push("木火相生");
  if ((counts.fire ?? 0) && (counts.earth ?? 0)) chains.push("火土相生");
  if ((counts.earth ?? 0) && (counts.metal ?? 0)) chains.push("土金相生");
  if ((counts.metal ?? 0) && (counts.water ?? 0)) chains.push("金水相生");
  if ((counts.water ?? 0) && (counts.wood ?? 0)) chains.push("水木相生");
  return chains;
}

function compact(items = []) {
  return (Array.isArray(items) ? items.flat(Infinity) : [items])
    .filter((item) => item !== undefined && item !== null && String(item).trim() !== "");
}
