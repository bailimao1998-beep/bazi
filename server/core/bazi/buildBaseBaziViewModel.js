const pillarOrder = [
  ["year", "年柱"],
  ["month", "月柱"],
  ["day", "日柱"],
  ["hour", "时柱"],
];

export function buildBaseBaziViewModel(chart = {}) {
  const calendar = chart.calendar ?? {};
  const details = chart.pillarDetails ?? {};
  return {
    birthInfo: {
      name: chart.input?.name ?? "",
      gender: chart.input?.gender ?? "unknown",
      birthplace: chart.input?.birthplace ?? "",
      solarDate: calendar.solarDate ?? chart.input?.birthDate ?? "",
      lunarDate: calendar.lunarDate ?? "",
      trueSolarTime: Boolean(calendar.trueSolarTime ?? chart.input?.trueSolarTime),
      calendarNotes: [
        calendar.monthNote,
        calendar.solarTermRange,
        calendar.dayPillarRule,
        calendar.hourPillarRule,
      ].filter(Boolean),
    },
    pillars: pillarOrder.map(([key, name]) => normalizePillar(key, name, details[key] ?? {}, chart.pillars?.[key] ?? {})),
    fiveElements: {
      visible: chart.elementStats?.visible ?? { label: "明面五行", counts: chart.elements ?? {} },
      hidden: chart.elementStats?.hidden ?? { label: "藏干五行", counts: {} },
      dominant: chart.dominantElements ?? [],
    },
    tenGods: {
      mainQi: chart.tenGodStats?.mainQi ?? {},
      fullHidden: chart.tenGodStats?.fullHidden ?? {},
    },
    relations: Array.isArray(chart.relations) ? chart.relations : [],
    auxiliary: chart.auxiliary ?? {},
    luckCycles: Array.isArray(chart.luckCycles?.pillars) ? chart.luckCycles.pillars : [],
  };
}

function normalizePillar(key, name, detail, pillar) {
  const source = detail.pillar ?? pillar;
  return {
    key,
    name,
    pillar: source.label ?? `${source.stem ?? ""}${source.branch ?? ""}`,
    stem: source.stem ?? "",
    branch: source.branch ?? "",
    stemTenGod: detail.stemTenGod ?? "",
    branchMainTenGod: detail.branchMainTenGod ?? "",
    hiddenStems: Array.isArray(detail.hiddenStems) ? detail.hiddenStems : [],
    nayin: detail.nayin ?? "",
    twelveGrowth: detail.twelveGrowth ?? "",
    voidBranches: Array.isArray(detail.voidBranches) ? detail.voidBranches : [],
    shensha: Array.isArray(detail.shensha) ? detail.shensha : [],
  };
}
