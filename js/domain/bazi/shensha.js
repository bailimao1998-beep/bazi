import { baziShenshaRuleSet } from "./shenshaRules.js";
import { getShenshaMeaning } from "./shensha/shenshaMeaningDatabase.js";

const pillarKeys = ["year", "month", "day", "hour"];
const ruleSet = baziShenshaRuleSet;
const stemYinYang = { 甲: "yang", 乙: "yin", 丙: "yang", 丁: "yin", 戊: "yang", 己: "yin", 庚: "yang", 辛: "yin", 壬: "yang", 癸: "yin" };
const voidBranchesByDecade = [
  ["戌", "亥"],
  ["申", "酉"],
  ["午", "未"],
  ["辰", "巳"],
  ["寅", "卯"],
  ["子", "丑"],
];
const stems = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const branches = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];

export function buildShensha(pillars, input = {}) {
  const items = [];
  for (const rule of ruleSet.rules) {
    const matches = matchRule(rule, pillars, input);
    if (!matches.length) continue;
    const meaning = getShenshaMeaning(rule.name);

    items.push({
      name: rule.name,
      aliases: meaning.aliases,
      category: rule.category,
      theme: `${rule.category}：${rule.name}`,

      sourceBasis: rule.sourceBasis,
      matchedPillars: matches,

      evidence: matches.map((match) =>
        formatMatchEvidence(rule, match),
      ),

      // 新解释数据库内容。
      definition: meaning.definition,
      manifestations: meaning.manifestations,
      caution: meaning.caution,

      // 保留旧字段，兼容其他页面。
      learningNote:
        meaning.definition || rule.learningNote,

      typicalMeaning:
        meaning.definition || rule.learningNote,

      confidence: "medium",

      needVerify: [
        "神煞只作为辅助候选信号，需要结合柱位、旺衰、十神、原局结构和岁运验证。",
      ],
    });

  }

  const byPillar = Object.fromEntries(pillarKeys.map((key) => [key, []]));
  for (const item of items) {
    for (const match of item.matchedPillars) {
      const meaning = getShenshaMeaning(
        item.name,
        match.pillarKey,
      );

      byPillar[match.pillarKey]?.push({
        name: item.name,
        aliases: meaning.aliases,
        category: item.category,
        theme: item.theme,
        sourceBasis: item.sourceBasis,
        target: match.target,

        definition: meaning.definition,
        manifestations: meaning.manifestations,
        pillarMeaning: meaning.pillarMeaning,
        caution: meaning.caution,

        learningNote: meaning.definition,
        typicalMeaning: meaning.definition,

        sourcePillars: Array.isArray(match.sourcePillars)
          ? match.sourcePillars
          : [],
      });
    }
  }

  return {
    items,
    byPillar,
    summary: summarizeShensha(items),
    meta: {
      engine: ruleSet.meta.engine,
      version: ruleSet.meta.version,
      evidence: [`已启用${ruleSet.rules.length}条常用实务神煞规则，当前命中${items.length}项。`],
      confidence: "medium",
      needVerify: [ruleSet.meta.boundary],
    },
  };
}

function matchRule(rule, pillars, input) {
  if (rule.basis?.includes("pillarVoid")) return matchVoidRule(pillars);
  if (rule.basis?.includes("dayPillarLabel")) return matchDayPillarRule(rule, pillars);
  if (rule.basis?.includes("seasonDayPillar")) return matchSeasonDayPillarRule(rule, pillars);
  const targets = collectTargets(rule, pillars, input);
  if (!targets.length) return [];
  return pillarKeys.flatMap((key) => {
    const pillar = pillars[key];
    const values = valuesForTargetType(rule.targetType, pillar);
    const matchedTargets = targets.filter((target) => values.includes(target));
    return matchedTargets.map((target) => ({
      pillarKey: key,
      pillarLabel: pillar.role,
      target,
    }));
  });
}

function matchDayPillarRule(rule, pillars) {
  const targets = rule.targets?.dayPillarLabel ?? [];
  if (!targets.includes(pillars.day.label)) return [];
  return [{ pillarKey: "day", pillarLabel: pillars.day.role, target: pillars.day.label }];
}

function matchSeasonDayPillarRule(rule, pillars) {
  const targets = rule.targets?.[seasonKey(pillars.month.branch)] ?? [];
  if (!targets.includes(pillars.day.label)) return [];
  return [{ pillarKey: "day", pillarLabel: pillars.day.role, target: pillars.day.label }];
}

function collectTargets(rule, pillars, input) {
  if (rule.basis?.includes("yearBranchGender")) {
  const gender = input.gender;

  // 性别未填写时，不能擅自按男命计算。
  if (!["male", "female"].includes(gender)) {
    return [];
  }

  const yearYang =
    stemYinYang[pillars.year.stem] === "yang";

  const group =
    (gender === "male" && yearYang) ||
    (gender === "female" && !yearYang)
      ? "yangMaleYinFemale"
      : "yinMaleYangFemale";

  return (
    rule.targets?.[group]?.[pillars.year.branch] ?? []
  );
}
  return [...new Set((rule.basis ?? []).flatMap((basis) => rule.targets?.[basisValue(basis, pillars)] ?? []))];
}

function basisValue(basis, pillars) {
  return {
    dayStem: pillars.day.stem,
    dayBranch: pillars.day.branch,
    yearBranch: pillars.year.branch,
    monthBranch: pillars.month.branch,
  }[basis];
}

function valuesForTargetType(targetType, pillar) {
  if (targetType === "stem") return [pillar.stem];
  if (targetType === "stemOrBranch") return [pillar.stem, pillar.branch];
  return [pillar.branch];
}

function matchVoidRule(pillars) {
  const matchMap = new Map();

  for (const sourceKey of pillarKeys) {
    const sourcePillar = pillars[sourceKey];
    const voidBranches =
      getVoidBranches(sourcePillar);

    for (const targetKey of pillarKeys) {
      const targetPillar = pillars[targetKey];

      if (
        !voidBranches.includes(targetPillar.branch)
      ) {
        continue;
      }

      /*
       * 同一个目标柱即使被多个来源柱查到空亡，
       * 页面也只显示一个“空亡”，但内部保存全部来源。
       */
      const existing =
        matchMap.get(targetKey) ?? {
          pillarKey: targetKey,
          pillarLabel: targetPillar.role,
          target: targetPillar.branch,
          sourcePillars: [],
        };

      existing.sourcePillars.push({
        pillarKey: sourceKey,
        pillarLabel: sourcePillar.role,
        pillar: sourcePillar.label,
        voidBranches: [...voidBranches],
      });

      matchMap.set(targetKey, existing);
    }
  }

  return [...matchMap.values()];
}

function seasonKey(branch) {
  if (["寅", "卯", "辰"].includes(branch)) return "spring";
  if (["巳", "午", "未"].includes(branch)) return "summer";
  if (["申", "酉", "戌"].includes(branch)) return "autumn";
  return "winter";
}

function summarizeShensha(items) {
  const counts = {};
  for (const item of items) counts[item.category] = (counts[item.category] ?? 0) + 1;
  return Object.entries(counts).map(([category, count]) => ({ category, count }));
}

function formatMatchEvidence(rule, match = {}) {
  if (
    rule.name === "空亡" &&
    Array.isArray(match.sourcePillars) &&
    match.sourcePillars.length
  ) {
    const sourceText = match.sourcePillars
      .map((source) => {
        const voidText = Array.isArray(source.voidBranches)
          ? source.voidBranches.join("、")
          : "待查";

        return `${source.pillarLabel}${source.pillar}旬空为${voidText}`;
      })
      .join("；");

    return `${sourceText}，${match.pillarLabel}${match.target}命中空亡。`;
  }

  return `${match.pillarLabel}${match.target}命中${rule.name}，${rule.sourceBasis}。`;
}

function getVoidBranches(pillar) {
  return voidBranchesByDecade[Math.floor(getGanzhiIndex(pillar.stem, pillar.branch) / 10)] ?? [];
}

function getGanzhiIndex(stem, branch) {
  for (let index = 0; index < 60; index += 1) {
    if (stems[index % 10] === stem && branches[index % 12] === branch) return index;
  }
  return 0;
}
