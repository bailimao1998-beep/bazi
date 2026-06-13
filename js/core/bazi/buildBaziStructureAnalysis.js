import { branchElements, elementLabels, hiddenStems, stemElements } from "./fiveElements.js";
import { branchMainStem, getTenGod } from "./tenGods.js";
import { summarizeRelationCompleteness } from "./relations.js";

const pillarNames = { year: "年柱", month: "月柱", day: "日柱", hour: "时柱" };
const elementGenerating = { wood: "fire", fire: "earth", earth: "metal", metal: "water", water: "wood" };
const elementControlling = { wood: "earth", earth: "water", water: "fire", fire: "metal", metal: "wood" };
const generatedBy = Object.fromEntries(Object.entries(elementGenerating).map(([source, target]) => [target, source]));
const controlledBy = Object.fromEntries(Object.entries(elementControlling).map(([source, target]) => [target, source]));

const monthCommandMap = {
  寅: { season: "spring", seasonLabel: "春", element: "wood", description: "寅月木气起势，春令以木为主。" },
  卯: { season: "spring", seasonLabel: "春", element: "wood", description: "卯月木气专旺，春令木象较明。" },
  巳: { season: "summer", seasonLabel: "夏", element: "fire", description: "巳月火气渐旺，夏令火象较明。" },
  午: { season: "summer", seasonLabel: "夏", element: "fire", description: "午月火气当令，燥热之象需复核。" },
  申: { season: "autumn", seasonLabel: "秋", element: "metal", description: "申月金气起势，秋令以金为主。" },
  酉: { season: "autumn", seasonLabel: "秋", element: "metal", description: "酉月金气专旺，秋令金象较明。" },
  亥: { season: "winter", seasonLabel: "冬", element: "water", description: "亥月水气起势，寒水之象需复核。" },
  子: { season: "winter", seasonLabel: "冬", element: "water", description: "子月水气当令，冬令寒象较明。" },
  辰: { season: "earth", seasonLabel: "四季", element: "earth", description: "辰为四季土，兼带湿土与余气。" },
  戌: { season: "earth", seasonLabel: "四季", element: "earth", description: "戌为四季土，偏燥，需看火金水木配合。" },
  丑: { season: "earth", seasonLabel: "四季", element: "earth", description: "丑为四季土，偏寒湿，需看火水配合。" },
  未: { season: "earth", seasonLabel: "四季", element: "earth", description: "未为四季土，偏燥，需看木火土配合。" },
};

export function buildBaziStructureAnalysis(chart = {}) {
  const pillars = chart.pillars ?? {};
  const dayStem = pillars.day?.stem ?? "";
  const dayMasterElement = stemElements[dayStem] ?? "";
  const monthBranch = pillars.month?.branch ?? "";
  const monthInfo = monthCommandMap[monthBranch] ?? {};
  const monthCommand = {
    branch: monthBranch,
    season: monthInfo.season ?? "unknown",
    seasonLabel: monthInfo.seasonLabel ?? "待查",
    element: monthInfo.element ?? branchElements[monthBranch] ?? "",
    elementLabel: elementLabels[monthInfo.element ?? branchElements[monthBranch]] ?? "",
    dayMasterElement,
    dayMasterElementLabel: elementLabels[dayMasterElement] ?? "",
    isDayMasterInSeason: Boolean(dayMasterElement && monthInfo.element === dayMasterElement),
    description: monthInfo.description ?? "月令信息待复核。",
  };

  const roots = buildRoots(pillars, dayStem, dayMasterElement);
  const stems = buildStemReveal(pillars, dayStem);
  const strength = buildStrength({ chart, monthCommand, roots, stems, dayMasterElement });
  const usefulGodHint = buildUsefulGodHint({ strength, dayMasterElement });
  const climate = buildClimate(chart, monthCommand);

  return {
    monthCommand,
    roots,
    stems,
    strength,
    usefulGodHint,
    climate,
    palaceBasics: buildPalaceBasics(pillars),
    relationCompleteness: summarizeRelationCompleteness(chart.relations ?? []),
  };
}

function buildRoots(pillars, dayStem, dayMasterElement) {
  const byPillar = ["year", "month", "day", "hour"].map((key) => {
    const pillar = pillars[key] ?? {};
    const hidden = hiddenStems[pillar.branch] ?? [];
    const exactIndex = hidden.indexOf(dayStem);
    const sameElementHits = hidden
      .filter((stem) => stemElements[stem] === dayMasterElement)
      .map((stem) => ({ stem, element: stemElements[stem], tenGod: getTenGod(dayStem, stem) }));
    const mainStem = branchMainStem(pillar.branch);
    const level = exactIndex === 0
      ? "strong"
      : exactIndex > 0
        ? "medium"
        : stemElements[mainStem] === dayMasterElement
          ? "medium"
          : sameElementHits.length
            ? "weak"
            : "none";
    return {
      key,
      name: pillarNames[key],
      branch: pillar.branch ?? "",
      hiddenStems: hidden,
      sameElementHits,
      level,
      evidence: level === "none"
        ? `${pillarNames[key]}${pillar.branch ?? ""}未见日主同类藏干。`
        : `${pillarNames[key]}${pillar.branch}藏干见${sameElementHits.map((item) => item.stem).join("、")}，可作日主根气观察。`,
    };
  });
  const rooted = byPillar.filter((item) => item.level !== "none");
  return {
    byPillar,
    summary: rooted.length
      ? rooted.map((item) => `${item.name}${item.branch}为${item.level}根：${item.evidence}`)
      : ["四支未见日主同类根气，需结合月令、印比透出和岁运补助复核。"],
    dayMasterRootLevel: summarizeRootLevel(byPillar),
  };
}

function buildStemReveal(pillars, dayStem) {
  const revealedTenGods = ["year", "month", "day", "hour"].map((key) => {
    const pillar = pillars[key] ?? {};
    const tenGod = key === "day" ? "日主" : getTenGod(dayStem, pillar.stem);
    return {
      key,
      name: pillarNames[key],
      stem: pillar.stem ?? "",
      tenGod,
      group: tenGodGroup(tenGod),
      element: stemElements[pillar.stem] ?? "",
      evidence: `${pillarNames[key]}天干${pillar.stem ?? ""}透出${tenGod}。`,
    };
  });
  const revealedElements = revealedTenGods.map((item) => ({
    key: item.key,
    name: item.name,
    stem: item.stem,
    element: item.element,
    elementLabel: elementLabels[item.element] ?? "",
  }));
  return {
    revealedTenGods,
    revealedElements,
    hasPeer: revealedTenGods.some((item) => item.key !== "day" && item.group === "peer"),
    hasResource: revealedTenGods.some((item) => item.group === "resource"),
    hasOutput: revealedTenGods.some((item) => item.group === "output"),
    hasWealth: revealedTenGods.some((item) => item.group === "wealth"),
    hasOfficerKilling: revealedTenGods.some((item) => item.group === "officer"),
  };
}

function buildStrength({ chart, monthCommand, roots, stems, dayMasterElement }) {
  const reasons = [];
  const counterReasons = [];
  let score = 50;

  if (monthCommand.isDayMasterInSeason) {
    score += 20;
    reasons.push(`月令${monthCommand.branch}属${monthCommand.elementLabel}，与日主同五行，得令可作为帮身依据。`);
  } else {
    score -= 12;
    counterReasons.push(`月令${monthCommand.branch}主${monthCommand.elementLabel || "待查"}，日主${monthCommand.dayMasterElementLabel || "待查"}未直接得令。`);
  }

  const rootScore = { strong: 20, medium: 12, weak: 6, none: -12 }[roots.dayMasterRootLevel] ?? 0;
  score += rootScore;
  if (roots.dayMasterRootLevel === "none") counterReasons.push("四支未见明确同类根气，日主承载力需谨慎复核。");
  else reasons.push(`通根综合为${roots.dayMasterRootLevel}，可作为日主有根的基础依据。`);

  if (stems.hasPeer) {
    score += 8;
    reasons.push("天干见比劫透出，日主同类有明面帮扶。");
  }
  if (stems.hasResource) {
    score += 8;
    reasons.push("天干见印星透出，存在生扶日主的结构依据。");
  }

  const elementCounts = chart.elements ?? {};
  const sameCount = Number(elementCounts[dayMasterElement] ?? 0);
  const resourceCount = Number(elementCounts[generatedBy[dayMasterElement]] ?? 0);
  const drainCount = Number(elementCounts[elementGenerating[dayMasterElement]] ?? 0);
  const wealthCount = Number(elementCounts[elementControlling[dayMasterElement]] ?? 0);
  const officerCount = Number(elementCounts[controlledBy[dayMasterElement]] ?? 0);
  if (sameCount + resourceCount >= 3.2) {
    score += 8;
    reasons.push("同类五行与印星数量偏多，形成帮身参考。");
  }
  if (drainCount + wealthCount + officerCount >= 4) {
    score -= 12;
    counterReasons.push("食伤、财、官杀相关五行数量偏多，对日主有泄耗克的参考。");
  }
  if (stems.hasOutput || stems.hasWealth || stems.hasOfficerKilling) {
    score -= 4;
    counterReasons.push("天干见食伤、财或官杀透出，需观察日主是否足以承载。");
  }
  if ((chart.relations ?? []).some((relation) => relation.type.includes("冲") || relation.type === "天克地冲")) {
    score -= 4;
    counterReasons.push("原局见冲动关系，根气与宫位稳定性需结合柱位复核。");
  }

  score = clamp(score, 0, 100);
  return {
    level: score >= 70 ? "strong" : score < 42 ? "weak" : reasons.length >= 2 && counterReasons.length >= 2 ? "mixed" : "balanced",
    score,
    reasons,
    counterReasons,
    confidence: "low",
  };
}

function buildUsefulGodHint({ strength, dayMasterElement }) {
  const peerElement = dayMasterElement;
  const resourceElement = generatedBy[dayMasterElement];
  const outputElement = elementGenerating[dayMasterElement];
  const wealthElement = elementControlling[dayMasterElement];
  const officerElement = controlledBy[dayMasterElement];
  const favorWeak = [peerElement, resourceElement].filter(Boolean);
  const favorStrong = [outputElement, wealthElement, officerElement].filter(Boolean);
  const isStrong = strength.level === "strong";
  const isWeak = strength.level === "weak";
  return {
    favorableElements: uniqueElements(isStrong ? favorStrong : isWeak ? favorWeak : [...favorWeak, ...favorStrong.slice(0, 1)]),
    unfavorableElements: uniqueElements(isStrong ? favorWeak : isWeak ? favorStrong : []),
    reasoning: `初步倾向，需结合格局、通关、调候复核；当前强弱初判为${strength.level}，这里只作为后续取象的元素方向提示。`,
    confidence: "low",
  };
}

function buildClimate(chart, monthCommand) {
  const counts = chart.elements ?? {};
  const fireEarth = Number(counts.fire ?? 0) + Number(counts.earth ?? 0);
  const metalWater = Number(counts.metal ?? 0) + Number(counts.water ?? 0);
  const reasons = [monthCommand.description].filter(Boolean);
  let coldWarm = "平";
  let dryWet = "平";
  if (monthCommand.season === "winter" || metalWater >= fireEarth + 2) {
    coldWarm = "偏寒";
    reasons.push("冬令或金水数量偏多，寒象需作为调候观察。");
  } else if (monthCommand.season === "summer" || fireEarth >= metalWater + 2) {
    coldWarm = "偏热";
    reasons.push("夏令或火土数量偏多，热燥之象需作为调候观察。");
  }
  if (["戌", "未"].includes(monthCommand.branch) || fireEarth >= metalWater + 2) {
    dryWet = "偏燥";
    reasons.push("火土较显或月令偏燥，需观察水木调和。");
  } else if (["辰", "丑"].includes(monthCommand.branch) || metalWater >= fireEarth + 2) {
    dryWet = "偏湿";
    reasons.push("金水较显或月令偏湿，需观察火土转化。");
  }
  return {
    coldWarm,
    dryWet,
    adjustmentHint: "寒暖燥湿只作调候提示，需结合月令、透干、根气与全局流通复核。",
    reasons,
  };
}

function buildPalaceBasics(pillars) {
  return {
    year: { name: "年柱", pillar: pillars.year?.label ?? "", note: "祖上、早年、外部背景的基础宫位观察。" },
    month: { name: "月柱", pillar: pillars.month?.label ?? "", note: "月令、父母缘、事业环境与结构气候的重点位置。" },
    day: { name: "日柱", pillar: pillars.day?.label ?? "", note: "日主与配偶宫的基础观察位置。" },
    hour: { name: "时柱", pillar: pillars.hour?.label ?? "", note: "晚年、子女、执行与结果层的基础观察位置。" },
  };
}

function summarizeRootLevel(items) {
  if (items.some((item) => item.level === "strong")) return "strong";
  if (items.some((item) => item.level === "medium")) return "medium";
  if (items.some((item) => item.level === "weak")) return "weak";
  return "none";
}

function tenGodGroup(tenGod) {
  if (["比肩", "劫财", "日主"].includes(tenGod)) return "peer";
  if (["正印", "偏印"].includes(tenGod)) return "resource";
  if (["食神", "伤官"].includes(tenGod)) return "output";
  if (["正财", "偏财"].includes(tenGod)) return "wealth";
  if (["正官", "七杀"].includes(tenGod)) return "officer";
  return "unknown";
}

function uniqueElements(elements) {
  return [...new Set(elements)].map((element) => ({ element, label: elementLabels[element] ?? element }));
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, Math.round(value)));
}
