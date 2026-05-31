const STEM_ELEMENTS = {
  甲: "wood",
  乙: "wood",
  丙: "fire",
  丁: "fire",
  戊: "earth",
  己: "earth",
  庚: "metal",
  辛: "metal",
  壬: "water",
  癸: "water",
};

const TEN_GOD_GROUPS = {
  peer: ["比肩", "劫财"],
  output: ["食神", "伤官"],
  wealth: ["正财", "偏财"],
  power: ["正官", "七杀"],
  resource: ["正印", "偏印"],
};

const CONDITION_KEYS = new Set([
  "dayStem",
  "monthBranch",
  "dayMasterSeasonalStatus",
  "elementCount",
  "tenGodCount",
  "tenGodGroupCount",
  "hasSelectedLuck",
  "hasSelectedYear",
]);

/**
 * Convert the existing reading object into the stable shape consumed by fixed
 * basic interpretation rules.
 */
export function adaptBaziBasicChart(reading) {
  const natal = reading?.natal ?? reading ?? {};
  const pillars = natal.pillars ?? {};
  const dayPillar = pillars.day ?? natal.dayPillar ?? {};
  const monthPillar = pillars.month ?? natal.monthPillar ?? {};
  const dayStem = natal.dayMaster ?? dayPillar.stem;
  const dayElement = dayPillar.stemElement ?? STEM_ELEMENTS[dayStem];
  const tenGodCounts = normalizeTenGodCounts(natal.coreChart?.tenGodCounts ?? natal.tenGodCounts, natal.tenGods);
  const strengthSignal = (natal.strengthSignals ?? []).find((signal) => signal.element === dayElement);

  return {
    yearPillar: pillars.year ?? natal.yearPillar,
    monthPillar,
    dayPillar,
    hourPillar: pillars.hour ?? natal.hourPillar,
    dayStem,
    monthBranch: natal.monthBranch ?? monthPillar.branch,
    fiveElements: { ...(natal.elements ?? natal.fiveElements ?? {}) },
    tenGods: {
      counts: tenGodCounts,
      groupCounts: buildTenGodGroupCounts(tenGodCounts),
    },
    dayMasterSeasonalStatus: natal.dayMasterSeasonalStatus ?? strengthSignal?.seasonalStatus,
    selectedLuck: reading?.transit?.selectedLuck ?? natal.selectedLuck,
    selectedYear: reading?.transit?.selectedYear ?? natal.selectedYear,
  };
}

export function matchBaziBasicRules(chart, rules = []) {
  return rules
    .filter((rule) => rule?.status !== "inactive" && matchesCondition(chart, rule.condition ?? {}))
    .map((rule) => ({
      id: rule.id,
      title: rule.title,
      conclusion: rule.conclusion,
      evidence: rule.evidence,
      reason: rule.reason,
      category: rule.category,
      confidence: rule.confidence,
      displayOrder: Number(rule.displayOrder ?? 999),
    }))
    .sort((left, right) => left.displayOrder - right.displayOrder || String(left.id).localeCompare(String(right.id), "zh-Hans-CN"));
}

function matchesCondition(chart, condition) {
  const keys = Object.keys(condition ?? {});
  if (!keys.length) return false;
  if (keys.some((key) => !CONDITION_KEYS.has(key))) return false;

  return keys.every((key) => {
    const expected = condition[key];
    if (key === "dayStem") return chart.dayStem === expected;
    if (key === "monthBranch") return chart.monthBranch === expected;
    if (key === "dayMasterSeasonalStatus") return chart.dayMasterSeasonalStatus === expected;
    if (key === "elementCount") return everyCountRule(expected, (rule) => chart.fiveElements?.[rule.element]);
    if (key === "tenGodCount") return everyCountRule(expected, (rule) => chart.tenGods?.counts?.[rule.name]);
    if (key === "tenGodGroupCount") return everyCountRule(expected, (rule) => chart.tenGods?.groupCounts?.[rule.group]);
    if (key === "hasSelectedLuck") return Boolean(chart.selectedLuck) === Boolean(expected);
    if (key === "hasSelectedYear") return Boolean(chart.selectedYear) === Boolean(expected);
    return false;
  });
}

function everyCountRule(value, pickActual) {
  const rules = Array.isArray(value) ? value : [value];
  return rules.every((rule) => compareCount(Number(pickActual(rule) ?? 0), rule.operator ?? ">=", Number(rule.value ?? 1)));
}

function compareCount(actual, operator, expected) {
  if (operator === ">") return actual > expected;
  if (operator === ">=") return actual >= expected;
  if (operator === "<") return actual < expected;
  if (operator === "<=") return actual <= expected;
  if (operator === "==" || operator === "=") return actual === expected;
  return false;
}

function normalizeTenGodCounts(existingCounts, tenGodSignals = []) {
  if (existingCounts && typeof existingCounts === "object" && !Array.isArray(existingCounts)) return { ...existingCounts };
  return (tenGodSignals ?? []).reduce((acc, signal) => {
    const name = signal?.name === "日主" ? "比肩" : signal?.name;
    if (name) acc[name] = (acc[name] ?? 0) + 1;
    return acc;
  }, {});
}

function buildTenGodGroupCounts(counts) {
  return Object.fromEntries(
    Object.entries(TEN_GOD_GROUPS).map(([group, names]) => [
      group,
      names.reduce((total, name) => total + Number(counts?.[name] ?? 0), 0),
    ]),
  );
}
