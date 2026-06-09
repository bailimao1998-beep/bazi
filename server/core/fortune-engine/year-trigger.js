import { branchMainStem, getTenGod } from "../bazi/tenGods.js";
import { branchThemeByPillar, loadFortuneRules, pairMatches, relationPairs, ruleMatchesTenGod, unique } from "./rule-data.js";

const themeNames = {
  career: "官禄",
  wealth: "财帛",
  relationship: "夫妻",
  movement: "迁移",
  study: "学业",
  social: "人际",
  health: "健康",
  pressure: "压力",
};

export function analyzeYearTrigger({ chart, selectedLuck, yearInfluence, decadeAnalysis, rules = loadFortuneRules() } = {}) {
  const yearPillar = yearInfluence?.pillar;
  const yearStemTenGod = yearInfluence?.tenGods?.stem ?? getTenGod(chart.dayMaster?.stem, yearPillar?.stem);
  const yearBranchTenGod = yearInfluence?.tenGods?.branch ?? getTenGod(chart.dayMaster?.stem, branchMainStem(yearPillar?.branch));
  const chains = [];
  chains.push(...tenGodChains("流年天干十神", yearStemTenGod, rules, chart, selectedLuck, yearPillar));
  chains.push(...tenGodChains("流年地支十神", yearBranchTenGod, rules, chart, selectedLuck, yearPillar));
  chains.push(...relationChains({ chart, selectedLuck, yearPillar, rules }));
  chains.push(...specialChains({ chart, selectedLuck, yearPillar }));
  return chains.map((chain, index) => ({ id: `year-chain-${index + 1}`, ...chain }));
}

function tenGodChains(source, tenGod, rules, chart, selectedLuck, yearPillar) {
  return rules.tenGods.filter((rule) => ruleMatchesTenGod(rule, tenGod)).map((rule) => ({
    chain: `原局${chart.pillars?.day?.label} -> 大运${selectedLuck?.label} -> 流年${yearPillar?.label}`,
    source,
    reason: `${source}${tenGod}透出或进入主气，引动${tagsToThemes(rule.tags).join("、")}主题。`,
    tags: unique(rule.tags),
    weight: rule.weight,
    evidence: [`${source}：${tenGod}`, rule.explanation],
    realityMapping: rule.realityMapping,
    caution: rule.caution,
  }));
}

function relationChains({ chart, selectedLuck, yearPillar, rules }) {
  const chains = [];
  const targets = [
    ...Object.values(chart.pillars ?? {}).map((pillar) => ({ label: pillar.role, pillar })),
    { label: "大运", pillar: selectedLuck },
  ];
  for (const target of targets) {
    for (const rule of rules.relations) {
      const hit = relationPairs(rule).some((pair) => pairMatches(pair, yearPillar?.branch, target.pillar?.branch));
      if (!hit) continue;
      const pillarThemes = branchThemeByPillar(target.label);
      chains.push({
        chain: `原局${target.label}${target.pillar?.label} -> 大运${selectedLuck?.label} -> 流年${yearPillar?.label}`,
        source: "流年地支关系",
        reason: `流年地支${yearPillar?.branch}与${target.label}${target.pillar?.branch}形成${rule.condition.type}，引动${tagsToThemes([...rule.tags, ...pillarThemes]).join("、")}主题。`,
        tags: unique([...rule.tags, ...pillarThemes]),
        weight: rule.weight,
        evidence: [`${yearPillar?.label}流年与${target.label}${target.pillar?.label}形成${rule.condition.type}`, rule.explanation],
        realityMapping: rule.realityMapping,
        caution: rule.caution,
      });
    }
  }
  return chains;
}

function specialChains({ chart, selectedLuck, yearPillar }) {
  const chains = [];
  for (const pillar of Object.values(chart.pillars ?? {})) {
    const sameStem = pillar.stem === yearPillar?.stem;
    const sameBranch = pillar.branch === yearPillar?.branch;
    const clashBranch = isOppositeBranch(pillar.branch, yearPillar?.branch);
    if (sameStem || sameBranch) {
      chains.push({
        chain: `原局${pillar.role}${pillar.label} -> 大运${selectedLuck?.label} -> 流年${yearPillar?.label}`,
        source: "伏吟",
        reason: `流年与原局${pillar.role}出现${sameStem && sameBranch ? "同柱" : sameStem ? "同干" : "同支"}，可作为伏吟或旧题重现观察，并引动${tagsToThemes(branchThemeByPillar(pillar.role)).join("、")}主题。`,
        tags: unique(["repeat-theme", ...branchThemeByPillar(pillar.role)]),
        weight: 5,
        evidence: [`流年${yearPillar?.label}与${pillar.role}${pillar.label}同象`],
        realityMapping: "现实中可观察旧项目、旧关系、重复任务或同类问题是否回到台前。",
        caution: "伏吟只提示主题反复，需要结合大运和流月继续验证。",
      });
    }
    if (clashBranch) {
      chains.push({
        chain: `原局${pillar.role}${pillar.label} -> 大运${selectedLuck?.label} -> 流年${yearPillar?.label}`,
        source: "反吟",
        reason: `流年地支与原局${pillar.role}形成对冲，可作为反吟和变动观察，引动${tagsToThemes(branchThemeByPillar(pillar.role)).join("、")}主题。`,
        tags: unique(["movement", "pressure", ...branchThemeByPillar(pillar.role)]),
        weight: 5,
        evidence: [`流年${yearPillar?.label}冲${pillar.role}${pillar.label}`],
        realityMapping: "现实中可观察迁动、变更、冲突、重新安排和外部节奏变化。",
        caution: "反吟需要结合流月是否继续触发，不能单独作为结论。",
      });
    }
  }
  if (selectedLuck?.label === yearPillar?.label) {
    chains.push({
      chain: `原局${chart.pillars?.day?.label} -> 大运${selectedLuck?.label} -> 流年${yearPillar?.label}`,
      source: "岁运并临",
      reason: "大运与流年同柱，岁运并临使阶段主题与年度触发叠在一起。",
      tags: ["repeat-theme", "pressure"],
      weight: 6,
      evidence: [`大运${selectedLuck?.label}与流年${yearPillar?.label}同柱`],
      realityMapping: "现实中可观察阶段性主题在这一年集中出现、反复提醒或进入节点。",
      caution: "岁运并临只是强触发提示，需要结合具体原局和流月复核。",
    });
  }
  return chains;
}

function tagsToThemes(tags = []) {
  return unique(tags.map((tag) => themeNames[tag]).filter(Boolean));
}

function isOppositeBranch(a, b) {
  return [["子", "午"], ["丑", "未"], ["寅", "申"], ["卯", "酉"], ["辰", "戌"], ["巳", "亥"]].some((pair) => pair.includes(a) && pair.includes(b));
}
