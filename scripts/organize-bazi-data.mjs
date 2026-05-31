import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataRoot = path.join(repoRoot, "data");
const dataDir = path.join(dataRoot, "source");
const legacyDate = "2026-05-26";
const legacyDir = path.join(dataRoot, "legacy", legacyDate);

const FILES = {
  sources: "00-来源-sources.json",
  stemsBranches: "01-天干地支-stems-branches.json",
  fiveElements: "02-五行强弱-five-elements.json",
  tenGods: "03-十神-ten-gods.json",
  combinations: "04-合冲刑害破-combinations.json",
  twelveStages: "05-十二长生-twelve-stages.json",
  systemRules: "06-程序规则-system-rules.json",
  blindCases: "07-盲派候选-blind-cases.json",
  strengthModel: "08-力量模型-strength-model.json",
  patternsUsefulGods: "09-格局用神-patterns-useful-gods.json",
  starsSpirits: "10-神煞-stars-spirits.json",
  blindCoreMethods: "11-盲派核心方法-blind-core-methods.json",
  outputTemplates: "12-输出主题模板-output-templates.json",
  index: "index.json",
};

const originalFiles = [
  "03-ten-gods.json",
  "04-combinations-clashes.json",
  "bazi-system-rules.json",
  "blind-bazi-cases.json",
  "gemini-code-1779699914160.json",
  "gemini-code-1779699919542.json",
  "gemini-code-1779699928438.json",
  "rules.json",
];

const staleRootFiles = [
  "00-sources.json",
  "01-stems-branches.json",
  "02-five-elements.json",
  "03-ten-gods.json",
  "04-combinations-clashes.json",
  "05-twelve-growth-stages.json",
  "06-system-rules.json",
  "07-blind-bazi-cases.json",
  "08-strength-model.json",
  "bazi-system-rules.json",
  "blind-bazi-cases.json",
  "gemini-code-1779699914160.json",
  "gemini-code-1779699919542.json",
  "gemini-code-1779699928438.json",
  "rules.json",
];

const stems = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const branches = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
const domains = ["personality", "career", "money", "health", "children", "marriage"];

const baseSources = [
  {
    id: "core-stems-branches",
    title: "天干地支与干支纪序",
    url: "https://zh.wikipedia.org/wiki/%E5%B9%B2%E6%94%AF",
    scope: "天干、地支、六十甲子等基础序列",
    type: "traditional_reference",
    evidenceLevel: "traditional_consensus",
    status: "active",
  },
  {
    id: "hidden-stems-xuenb",
    title: "地支五行藏干-十二地支藏干图表",
    url: "https://suanming.xuenb.com/canggan/",
    scope: "十二地支藏干表",
    type: "secondary_reference",
    evidenceLevel: "secondary_source",
    status: "active",
  },
  {
    id: "five-elements-wikipedia",
    title: "五行",
    url: "https://zh.wikipedia.org/wiki/%E4%BA%94%E8%A1%8C",
    scope: "五行生克与基础属性",
    type: "traditional_reference",
    evidenceLevel: "traditional_consensus",
    status: "active",
  },
  {
    id: "seasonal-strength",
    title: "旺相休囚死 - 麦八字教学网",
    url: "https://mybazi.net/basics/balance.html",
    scope: "五行在月令中的旺相休囚死与强弱判断",
    type: "secondary_reference",
    evidenceLevel: "secondary_source",
    status: "active",
  },
  {
    id: "stem-combinations-wikipedia",
    title: "天干化合",
    url: "https://zh.wikipedia.org/wiki/%E5%A4%A9%E5%B9%B2",
    scope: "甲己、乙庚、丙辛、丁壬、戊癸五合",
    type: "traditional_reference",
    evidenceLevel: "traditional_consensus",
    status: "active",
  },
  {
    id: "branch-relations",
    title: "八字基础：六合三合六冲三刑",
    url: "https://bazitalk.com/category/tiangandizhi/10652.html",
    scope: "天干地支合冲刑害破与组合关系",
    type: "secondary_reference",
    evidenceLevel: "secondary_source",
    status: "active",
  },
  {
    id: "branch-relations-wikipedia",
    title: "地支",
    url: "https://zh.wikipedia.org/wiki/%E5%9C%B0%E6%94%AF",
    scope: "地支相合、相冲、相害、相破等传统组合",
    type: "traditional_reference",
    evidenceLevel: "traditional_consensus",
    status: "active",
  },
  {
    id: "branch-six-breaks-bazitalk",
    title: "地支六破 - 说八字",
    url: "https://bazitalk.com/category/tiangandizhi/9821.html",
    scope: "地支六破组合与基础含义",
    type: "secondary_reference",
    evidenceLevel: "secondary_source",
    status: "active",
  },
  {
    id: "hidden-combinations-bazitalk-10926",
    title: "地支暗合、干支暗合 - 说八字",
    url: "https://bazitalk.com/category/tiangandizhi/10926.html",
    scope: "地支暗合、干支暗合的常见组合与说明",
    type: "secondary_reference",
    evidenceLevel: "secondary_source",
    status: "draft",
  },
  {
    id: "stem-branch-self-bazitalk-11067",
    title: "干支“暗合”技法详解 - 说八字",
    url: "https://bazitalk.com/category/bazizhishi/11067.html",
    scope: "干支自合、通合、通禄合、余刃合等暗合技法",
    type: "secondary_reference",
    evidenceLevel: "secondary_source",
    status: "draft",
  },
  {
    id: "arched-combinations-shen88",
    title: "八字中拱合是什么意思，拱合的构成条件",
    url: "https://www.shen88.cn/bazi/82153.html",
    scope: "拱合/暗拱的定义、相邻条件与岁运填实原则",
    type: "secondary_reference",
    evidenceLevel: "secondary_source",
    status: "draft",
  },
  {
    id: "arched-combinations-shenshu",
    title: "八字中的合冲刑害破与三合三会",
    url: "https://www.shen-shu.com/zh-CN/mingli",
    scope: "拱合、拱会、半合、三合三会的补充关系清单",
    type: "secondary_reference",
    evidenceLevel: "secondary_source",
    status: "draft",
  },
  {
    id: "positional-combination-policy",
    title: "组合距离与程序判定内部策略",
    url: null,
    scope: "遥合/隔合等位置型关系的程序判定策略，依据既有天干五合与地支六合派生",
    type: "internal_policy",
    evidenceLevel: "derived",
    status: "draft",
  },
  {
    id: "pattern-geju-howzan",
    title: "八字中的格局划分：普通格局与特殊格局",
    url: "https://www.howzan.com/ba-zi-zhong-de-ge-ju-hua-fen-pu-tong-ge-ju-yu-te-shu-ge-ju/",
    scope: "普通格局、特殊格局、月令取格思路",
    type: "secondary_reference",
    evidenceLevel: "secondary_source",
    status: "draft",
  },
  {
    id: "pattern-geju-fatemaster",
    title: "格局详解大全 - 八字命理格局完整指南",
    url: "https://www.fatemaster.ai/guides/geju",
    scope: "八正格、建禄格、特殊格局的分类补充",
    type: "secondary_reference",
    evidenceLevel: "secondary_source",
    status: "draft",
  },
  {
    id: "ziping-zhenquan-wikipedia",
    title: "子平真诠",
    url: "https://zh.wikipedia.org/wiki/%E5%AD%90%E5%B9%B3%E7%9C%9F%E8%A9%AE",
    scope: "月令、格局、相神等子平格局法背景",
    type: "traditional_reference",
    evidenceLevel: "secondary_source",
    status: "draft",
  },
  {
    id: "yongshen-tianjiyao",
    title: "八字用神喜忌与调候通关",
    url: "https://wiki.tianjiyao.com/bazi/yongshen-tiaohou.html",
    scope: "扶抑、调候、通关、病药等用神思路",
    type: "secondary_reference",
    evidenceLevel: "secondary_source",
    status: "draft",
  },
  {
    id: "yongshen-suanzhun",
    title: "用神三大原则，通关、扶抑、调侯方法",
    url: "https://www.suanzhun.net/article/2734.html",
    scope: "扶抑、调候、通关用神分类",
    type: "secondary_reference",
    evidenceLevel: "secondary_source",
    status: "draft",
  },
  {
    id: "stars-sina-shensha",
    title: "八字神煞解析：文昌、华盖、将星、驿马、桃花、羊刃",
    url: "https://k.sina.cn/article_7879848901_1d5acf3c501901niq4.html",
    scope: "常用神煞说明与部分查法",
    type: "secondary_reference",
    evidenceLevel: "secondary_source",
    status: "draft",
  },
  {
    id: "ten-gods",
    title: "十神关系 - 麦八字教学网",
    url: "https://mybazi.net/basics/ten-gods.html",
    scope: "十神组合、位置、力量与大运流年影响",
    type: "secondary_reference",
    evidenceLevel: "secondary_source",
    status: "active",
  },
  {
    id: "ten-gods-overview",
    title: "十神是什么？比劫食伤财官杀印全解",
    url: "https://www.fatebazi.com/learn/shishen",
    scope: "十神基本取象与现代解释",
    type: "secondary_reference",
    evidenceLevel: "secondary_source",
    status: "active",
  },
  {
    id: "ten-gods-bazifortune",
    title: "八字十神对照表",
    url: "https://bazifortune.app/zh-TW/blog/bazi-ten-gods-table-jia-yi-bing-ding-day-masters",
    scope: "十神矩阵交叉校验",
    type: "secondary_reference",
    evidenceLevel: "secondary_source",
    status: "active",
  },
  {
    id: "twelve-stages",
    title: "十二长生——天干的强弱起落周期",
    url: "https://bazi8.net/zh/learn/twelve-stages",
    scope: "天干在十二地支上的阶段性力量",
    type: "secondary_reference",
    evidenceLevel: "secondary_source",
    status: "active",
  },
];

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readJSON(fileName) {
  const legacyPath = path.join(legacyDir, fileName);
  const rootPath = path.join(dataDir, fileName);
  const filePath = (await exists(legacyPath)) ? legacyPath : rootPath;
  return JSON.parse(await fs.readFile(filePath, "utf8"));
}

async function writeJSON(fileName, value) {
  const outputDir = fileName === FILES.index ? dataRoot : dataDir;
  await fs.writeFile(path.join(outputDir, fileName), `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function withAudit(value, sourceIds, evidenceLevel, status = "active", notes = undefined) {
  return {
    ...value,
    sourceIds,
    evidenceLevel,
    status,
    ...(notes === undefined ? {} : { notes }),
  };
}

function normalizeRule(rule) {
  const notes = {
    originalKind: rule.kind,
  };
  if (rule.score !== undefined) notes.score = rule.score;
  if (rule.force !== undefined) notes.force = rule.force;
  if (rule.stage !== undefined) notes.stage = rule.stage;
  if (rule.status !== undefined) notes.seasonalStatus = rule.status;

  return {
    id: rule.id,
    category: rule.kind,
    match: rule.match,
    domains: rule.domains ?? domains,
    interpretation: rule.interpretation ?? rule.rationale ?? "",
    display: rule.display ?? null,
    sourceIds: rule.sourceIds ?? [],
    evidenceLevel: evidenceForRule(rule),
    status: "active",
    notes,
  };
}

function evidenceForRule(rule) {
  if (rule.kind === "branch_pair_relation" || rule.kind === "branch_group_relation") return "traditional_consensus";
  if (rule.kind === "transit_branch_to_natal_branch") return "derived";
  if (rule.kind === "transit_stem_to_daymaster") return "derived";
  if (rule.kind === "topic_element_balance") return "derived";
  return "secondary_source";
}

function normalizeConditions(conditions = {}) {
  const normalized = { ...conditions };
  if (Array.isArray(normalized.required_tags) && !normalized.tags) {
    normalized.tags = normalized.required_tags;
  }
  if (normalized.match_type && !normalized.matchType) {
    normalized.matchType = normalized.match_type;
  }
  delete normalized.required_tags;
  delete normalized.match_type;
  return normalized;
}

function sourceKey(source = {}) {
  return `${source.url ?? ""}|${source.title ?? ""}`;
}

function hashString(input) {
  let hash = 2166136261;
  for (const char of input) {
    hash ^= char.codePointAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}

function blindSourceId(source = {}) {
  if (source.url) {
    const match = source.url.match(/\/(\d+)\.html$/);
    if (match) return `blind-bazitalk-${match[1]}`;
  }
  return `blind-${hashString(sourceKey(source))}`;
}

function normalizeBlindCase(rawCase, sourceId, supplemental = undefined) {
  const analysis = { ...(rawCase.analysis ?? {}) };
  if (rawCase.rationale && !analysis.rationale) analysis.rationale = rawCase.rationale;
  if (supplemental?.rationale && !analysis.rationale) analysis.rationale = supplemental.rationale;

  const notes = {
    sourceTitle: rawCase.source?.title ?? null,
    sourceNote: rawCase.source?.note ?? null,
    evidencePolicy: "严格考据模式下，盲派条目先保留为待核对数据，不进入 active 自动断语。",
  };
  if (supplemental) {
    notes.mergedFrom = "gemini-code-1779699914160.json";
    if (supplemental.category && supplemental.category !== rawCase.category) {
      notes.supplementalCategory = supplemental.category;
    }
  }

  return {
    id: rawCase.id,
    school: "blind_bazi",
    domain: rawCase.domain,
    category: rawCase.category,
    conditions: normalizeConditions(rawCase.conditions),
    analysis,
    display: rawCase.display,
    sourceIds: [sourceId],
    evidenceLevel: "needs_review",
    status: "needs_source",
    notes,
  };
}

function makeJiaziList(list) {
  return list.map((item, index) => {
    const name = typeof item === "string" ? item : item.name;
    return withAudit(
      {
        index,
        name,
        stem: name[0],
        branch: name[1],
      },
      ["core-stems-branches"],
      "traditional_consensus",
    );
  });
}

function makeStemBranchData(rawBasics) {
  return {
    _meta: withAudit(
      {
        file: FILES.stemsBranches,
        title: "天干地支基础表",
        description: "天干、地支、藏干、六十甲子等基础对照数据。",
        version: "2.0.0",
        sourceRegistry: FILES.sources,
      },
      ["core-stems-branches", "hidden-stems-xuenb"],
      "traditional_consensus",
    ),
    heavenlyStems: rawBasics.heavenlyStems.map((stem) =>
      withAudit(stem, ["core-stems-branches"], "traditional_consensus"),
    ),
    earthlyBranches: rawBasics.earthlyBranches.map((branch) =>
      withAudit(branch, ["core-stems-branches", "hidden-stems-xuenb"], "secondary_source"),
    ),
    sixtyJiaziCycle: {
      description: rawBasics.sixtyJiaziCycle.description,
      sourceIds: ["core-stems-branches"],
      evidenceLevel: "traditional_consensus",
      status: "active",
      list: makeJiaziList(rawBasics.sixtyJiaziCycle.list),
    },
  };
}

function makeFiveElementsData(rawBasics, rawSystem) {
  const seasonalRules = rawSystem.rules
    .filter((rule) => rule.kind === "element_season_strength")
    .map((rule) => ({
      id: rule.id,
      monthBranch: rule.match.monthBranch,
      element: rule.match.element,
      seasonalStatus: rule.status,
      score: rule.score,
      domains: rule.domains,
      interpretation: rule.interpretation,
      display: rule.display,
      sourceIds: rule.sourceIds,
      evidenceLevel: "secondary_source",
      status: "active",
    }));

  const elementNames = {
    wood: "木",
    fire: "火",
    earth: "土",
    metal: "金",
    water: "水",
  };

  return {
    _meta: withAudit(
      {
        file: FILES.fiveElements,
        title: "五行关系与月令强弱",
        description: "五行生克关系、基础属性，以及五行在十二月令中的旺相休囚死。",
        version: "1.0.0",
        sourceRegistry: FILES.sources,
      },
      ["five-elements-wikipedia", "seasonal-strength"],
      "secondary_source",
    ),
    elements: Object.keys(elementNames).map((element) =>
      withAudit(
        {
          element,
          name: elementNames[element],
          generates: rawBasics.elementRelations.generation[element],
          restricts: rawBasics.elementRelations.restriction[element],
        },
        ["five-elements-wikipedia"],
        "traditional_consensus",
      ),
    ),
    relations: {
      generation: rawBasics.elementRelations.generation,
      restriction: rawBasics.elementRelations.restriction,
      sourceIds: ["five-elements-wikipedia"],
      evidenceLevel: "traditional_consensus",
      status: "active",
    },
    seasonalStrength: {
      description: "五行在十二月令中的旺相休囚死，用于判断季节性强弱。",
      sourceIds: ["seasonal-strength"],
      evidenceLevel: "secondary_source",
      status: "active",
      rules: seasonalRules,
    },
  };
}

function makeTenGodsData(rawTenGods) {
  return {
    ...rawTenGods,
    _meta: withAudit(
      {
        ...rawTenGods._meta,
        file: FILES.tenGods,
        version: "2.0.0",
        sourceRegistry: FILES.sources,
      },
      ["ten-gods", "ten-gods-overview", "ten-gods-bazifortune"],
      "secondary_source",
    ),
    tenGodDefinitions: rawTenGods.tenGodDefinitions.map((definition) =>
      withAudit(definition, ["ten-gods", "ten-gods-overview"], "secondary_source"),
    ),
    tenGodMatrix: {
      ...rawTenGods.tenGodMatrix,
      sourceIds: ["ten-gods", "ten-gods-bazifortune"],
      evidenceLevel: "derived",
      status: "active",
    },
    pillarPositionMeaning: withAudit(
      rawTenGods.pillarPositionMeaning,
      ["ten-gods"],
      "secondary_source",
    ),
    tenGodCombinations: {
      ...rawTenGods.tenGodCombinations,
      sourceIds: ["ten-gods"],
      evidenceLevel: "secondary_source",
      status: "active",
      pairs: rawTenGods.tenGodCombinations.pairs.map((pair) =>
        withAudit(pair, ["ten-gods"], "secondary_source"),
      ),
    },
  };
}

function annotateSection(section, sourceIds, evidenceLevel) {
  const result = {
    ...section,
    sourceIds,
    evidenceLevel,
    status: "active",
  };
  for (const key of ["rules", "halfCombinations", "list"]) {
    if (Array.isArray(result[key])) {
      result[key] = result[key].map((item) => withAudit(item, sourceIds, evidenceLevel));
    }
  }
  return result;
}

function supplementalCombinationSections() {
  const hiddenSourceIds = ["hidden-combinations-bazitalk-10926", "stem-branch-self-bazitalk-11067"];
  const archSourceIds = ["arched-combinations-shen88", "arched-combinations-shenshu"];

  const stemBranchSelfCombinations = {
    description: "干支自合：同一柱天干与坐支藏干暗中相合。此法门派差异明显，暂作 draft。",
    policy: {
      sourceIds: ["stem-branch-self-bazitalk-11067", "hidden-combinations-bazitalk-10926"],
      evidenceLevel: "secondary_source",
      status: "draft",
      conditions: [
        "只在同柱干支内部作用，不跨柱直接套用。",
        "需要结合坐支藏干、刑冲开合、月令强弱和十神得失。",
        "不同资料对自合柱数量有差异，程序默认只提示，不直接定吉凶。",
      ],
    },
    rules: [
      { pillar: "戊子", stem: "戊", branch: "子", hiddenStem: "癸", stemCombination: "戊癸", combinationElement: "fire", subtype: "通禄/坐支藏干自合", note: "戊与子中癸暗合。" },
      { pillar: "壬戌", stem: "壬", branch: "戌", hiddenStem: "丁", stemCombination: "丁壬", combinationElement: "wood", subtype: "坐支藏干自合", note: "壬与戌中丁暗合，资料中列为自合之一。" },
      { pillar: "丙戌", stem: "丙", branch: "戌", hiddenStem: "辛", stemCombination: "丙辛", combinationElement: "water", subtype: "余刃合/条件自合", note: "丙与戌中辛暗合，部分资料强调需刑冲引动。" },
      { pillar: "甲午", stem: "甲", branch: "午", hiddenStem: "己", stemCombination: "甲己", combinationElement: "earth", subtype: "通禄合", note: "甲与午中己暗合。" },
      { pillar: "壬午", stem: "壬", branch: "午", hiddenStem: "丁", stemCombination: "丁壬", combinationElement: "wood", subtype: "通禄合", note: "壬与午中丁暗合。" },
      { pillar: "丁亥", stem: "丁", branch: "亥", hiddenStem: "壬", stemCombination: "丁壬", combinationElement: "wood", subtype: "通禄合", note: "丁与亥中壬暗合。" },
      { pillar: "己亥", stem: "己", branch: "亥", hiddenStem: "甲", stemCombination: "甲己", combinationElement: "earth", subtype: "坐支藏干自合", note: "己与亥中甲暗合；资料表述有差异，需人工核对。" },
      { pillar: "辛巳", stem: "辛", branch: "巳", hiddenStem: "丙", stemCombination: "丙辛", combinationElement: "water", subtype: "通禄合", note: "辛与巳中丙暗合。" },
      { pillar: "癸巳", stem: "癸", branch: "巳", hiddenStem: "戊", stemCombination: "戊癸", combinationElement: "fire", subtype: "通禄合", note: "癸与巳中戊暗合。" },
    ].map((rule) => withAudit(rule, ["stem-branch-self-bazitalk-11067"], "secondary_source", "draft")),
    conditionalRules: [
      withAudit(
        {
          pillar: "庚辰",
          stem: "庚",
          branch: "辰",
          hiddenStem: "乙",
          stemCombination: "乙庚",
          combinationElement: "metal",
          subtype: "余刃合/条件自合",
          activation: "资料称辰被戌冲动开库时，庚才较易合到辰中乙。",
          note: "只作为条件候选，不纳入默认自合清单。",
        },
        ["stem-branch-self-bazitalk-11067"],
        "secondary_source",
        "draft",
      ),
    ],
    sourceIds: hiddenSourceIds,
    evidenceLevel: "secondary_source",
    status: "draft",
  };

  const branchHiddenCombinations = {
    description: "地支暗合：地支表面未成明合，但藏干之间发生天干五合。",
    policy: {
      sourceIds: hiddenSourceIds,
      evidenceLevel: "secondary_source",
      status: "draft",
      conditions: [
        "先按藏干是否成天干五合判断，不等同地支六合。",
        "经典常用组合与扩展组合并存，程序应区分 core 与 variant。",
        "暗合多作隐性牵连、暗中取象，不作为单独吉凶结论。",
      ],
    },
    rules: [
      {
        branches: ["寅", "丑"],
        subtype: "通合",
        hiddenStemPairs: [
          { stems: ["甲", "己"], combinationElement: "earth" },
          { stems: ["丙", "辛"], combinationElement: "water" },
          { stems: ["戊", "癸"], combinationElement: "fire" },
        ],
        note: "寅丑藏干多组相合，为常见核心暗合。",
      },
      {
        branches: ["午", "亥"],
        subtype: "通合/通禄合",
        hiddenStemPairs: [
          { stems: ["丁", "壬"], combinationElement: "wood" },
          { stems: ["己", "甲"], combinationElement: "earth" },
        ],
        note: "午亥藏干丁壬、甲己相合，为常见核心暗合。",
      },
      {
        branches: ["卯", "申"],
        subtype: "通禄合",
        hiddenStemPairs: [
          { stems: ["乙", "庚"], combinationElement: "metal" },
        ],
        note: "卯中乙与申中庚相合，为常见核心暗合。",
      },
    ].map((rule) => withAudit(rule, ["hidden-combinations-bazitalk-10926", "stem-branch-self-bazitalk-11067"], "secondary_source", "draft")),
    variantRules: [
      {
        branches: ["子", "巳"],
        subtype: "通禄合/扩展暗合",
        hiddenStemPairs: [{ stems: ["癸", "戊"], combinationElement: "fire" }],
        note: "部分资料列为扩展暗合，需结合原局力量核对。",
      },
      {
        branches: ["寅", "午"],
        subtype: "通禄合/扩展暗合",
        hiddenStemPairs: [{ stems: ["甲", "己"], combinationElement: "earth" }],
        note: "与寅午半合火并存时，需区分半合象与暗合象。",
      },
      {
        branches: ["巳", "酉"],
        subtype: "通禄合/扩展暗合",
        hiddenStemPairs: [{ stems: ["丙", "辛"], combinationElement: "water" }],
        note: "与巳酉半合金并存时，需区分半合象与暗合象。",
      },
    ].map((rule) => withAudit(rule, ["stem-branch-self-bazitalk-11067"], "secondary_source", "draft")),
    sourceIds: hiddenSourceIds,
    evidenceLevel: "secondary_source",
    status: "draft",
  };

  const remoteCombinations = {
    description: "遥合/隔合：本质仍是天干五合或地支六合，但因柱位相隔，合力弱于近合。",
    policy: {
      sourceIds: ["positional-combination-policy"],
      evidenceLevel: "derived",
      status: "draft",
      conditions: [
        "先匹配基础五合/六合，再由柱位距离判断 near、remote、separated。",
        "遥合只作为关系强度修正，不新增独立五行化气。",
        "若被冲、刑、合局或岁运填实引动，需要交给力量模型综合判断。",
      ],
    },
    stemRemoteRules: [
      { stems: ["甲", "己"], element: "earth" },
      { stems: ["乙", "庚"], element: "metal" },
      { stems: ["丙", "辛"], element: "water" },
      { stems: ["丁", "壬"], element: "wood" },
      { stems: ["戊", "癸"], element: "fire" },
    ].map((rule) => withAudit(
      {
        ...rule,
        relation: "遥合",
        baseRelation: "天干五合",
        positionCondition: "两天干不相邻或隔柱出现",
        strengthModifier: "weaker_than_adjacent_combination",
      },
      ["positional-combination-policy", "stem-combinations-wikipedia"],
      "derived",
      "draft",
    )),
    branchRemoteRules: [
      { branches: ["子", "丑"], element: "earth" },
      { branches: ["寅", "亥"], element: "wood" },
      { branches: ["卯", "戌"], element: "fire" },
      { branches: ["辰", "酉"], element: "metal" },
      { branches: ["巳", "申"], element: "water" },
      { branches: ["午", "未"], element: "fire_earth" },
    ].map((rule) => withAudit(
      {
        ...rule,
        relation: "遥合",
        baseRelation: "地支六合",
        positionCondition: "两地支不相邻或隔柱出现",
        strengthModifier: "weaker_than_adjacent_combination",
      },
      ["positional-combination-policy", "branch-relations-wikipedia"],
      "derived",
      "draft",
    )),
    sourceIds: ["positional-combination-policy"],
    evidenceLevel: "derived",
    status: "draft",
  };

  const archedCombinations = {
    description: "拱合/拱会：三合或三会缺中神，由两支暗拱中间一支；岁运填实时再按完整局论。",
    policy: {
      sourceIds: archSourceIds,
      evidenceLevel: "secondary_source",
      status: "draft",
      conditions: [
        "两支宜相邻或结构上成拱，缺失的中神不可原局已明见。",
        "拱出之气弱于完整三合/三会，未填实时只作潜在方向。",
        "大运、流年、流月补上 missingBranch 时，再触发完整三合或三会判断。",
      ],
    },
    archThreeCombinationRules: [
      { branches: ["申", "辰"], missingBranch: "子", element: "water", fullGroup: ["申", "子", "辰"], name: "申辰拱子水" },
      { branches: ["亥", "未"], missingBranch: "卯", element: "wood", fullGroup: ["亥", "卯", "未"], name: "亥未拱卯木" },
      { branches: ["寅", "戌"], missingBranch: "午", element: "fire", fullGroup: ["寅", "午", "戌"], name: "寅戌拱午火" },
      { branches: ["巳", "丑"], missingBranch: "酉", element: "metal", fullGroup: ["巳", "酉", "丑"], name: "巳丑拱酉金" },
    ].map((rule) => withAudit(
      {
        ...rule,
        relation: "拱合",
        baseRelation: "三合",
        activation: `岁运见${rule.missingBranch}时，可转入完整三合局判断。`,
      },
      archSourceIds,
      "secondary_source",
      "draft",
    )),
    archThreeMeetingRules: [
      { branches: ["亥", "丑"], missingBranch: "子", element: "water", fullGroup: ["亥", "子", "丑"], name: "亥丑拱子水" },
      { branches: ["寅", "辰"], missingBranch: "卯", element: "wood", fullGroup: ["寅", "卯", "辰"], name: "寅辰拱卯木" },
      { branches: ["巳", "未"], missingBranch: "午", element: "fire", fullGroup: ["巳", "午", "未"], name: "巳未拱午火" },
      { branches: ["申", "戌"], missingBranch: "酉", element: "metal", fullGroup: ["申", "酉", "戌"], name: "申戌拱酉金" },
    ].map((rule) => withAudit(
      {
        ...rule,
        relation: "拱会",
        baseRelation: "三会",
        activation: `岁运见${rule.missingBranch}时，可转入完整三会方判断。`,
      },
      archSourceIds,
      "secondary_source",
      "draft",
    )),
    sourceIds: archSourceIds,
    evidenceLevel: "secondary_source",
    status: "draft",
  };

  return {
    stemBranchSelfCombinations,
    branchHiddenCombinations,
    remoteCombinations,
    archedCombinations,
  };
}

function makeCombinationsData(rawCombinations) {
  const branchSources = ["branch-relations", "branch-relations-wikipedia"];
  const supplemental = supplementalCombinationSections();
  const sixBreaks = {
    description: "地支六破：两支相破，主破局、破约、修补、旧结构松动等象。",
    rules: [
      { branches: ["子", "酉"], note: "子酉相破，主自破、自扰，事情容易有暗损。" },
      { branches: ["丑", "辰"], note: "丑辰相破，主阻滞、疑滞，关系或结构不易舒展。" },
      { branches: ["寅", "亥"], note: "寅亥相破，破中有合，成败相伴，需看全局引动。" },
      { branches: ["卯", "午"], note: "卯午相破，主礼序失当、情感或门户之扰。" },
      { branches: ["巳", "申"], note: "巳申相破，破中带合，先成后损或成中有疵。" },
      { branches: ["未", "戌"], note: "未戌相破，土气相争，主损耗、争执、修补。" },
    ],
    interpretation: "六破比六冲更偏内部破损、结构松动；流年引动时，看落宫和十神主题，不单独定吉凶。",
  };

  return {
    ...rawCombinations,
    _meta: withAudit(
      {
        ...rawCombinations._meta,
        file: FILES.combinations,
        version: "2.0.0",
        sourceRegistry: FILES.sources,
      },
      ["stem-combinations-wikipedia", ...branchSources, "branch-six-breaks-bazitalk"],
      "secondary_source",
    ),
    heavenlyStemCombinations: annotateSection(
      rawCombinations.heavenlyStemCombinations,
      ["stem-combinations-wikipedia"],
      "traditional_consensus",
    ),
    branchSixCombinations: annotateSection(
      rawCombinations.branchSixCombinations,
      branchSources,
      "traditional_consensus",
    ),
    branchThreeCombinations: annotateSection(
      rawCombinations.branchThreeCombinations,
      branchSources,
      "traditional_consensus",
    ),
    branchThreeMeetings: annotateSection(
      rawCombinations.branchThreeMeetings,
      branchSources,
      "traditional_consensus",
    ),
    branchSixClashes: annotateSection(
      rawCombinations.branchSixClashes,
      branchSources,
      "traditional_consensus",
    ),
    branchThreePunishments: annotateSection(
      rawCombinations.branchThreePunishments,
      branchSources,
      "traditional_consensus",
    ),
    branchSixHarms: annotateSection(
      rawCombinations.branchSixHarms,
      branchSources,
      "traditional_consensus",
    ),
    branchSixBreaks: annotateSection(
      sixBreaks,
      ["branch-six-breaks-bazitalk", "branch-relations-wikipedia"],
      "secondary_source",
    ),
    stemBranchSelfCombinations: supplemental.stemBranchSelfCombinations,
    branchHiddenCombinations: supplemental.branchHiddenCombinations,
    remoteCombinations: supplemental.remoteCombinations,
    archedCombinations: supplemental.archedCombinations,
    specialStructures: annotateSection(
      rawCombinations.specialStructures,
      branchSources,
      "secondary_source",
    ),
  };
}

function makeTwelveStagesData(rawSystem) {
  const stageRules = rawSystem.rules
    .filter((rule) => rule.kind === "twelve_growth_stage")
    .map((rule) => ({
      id: rule.id,
      dayStem: rule.match.dayStem,
      branch: rule.match.branch,
      stage: rule.stage,
      score: rule.score,
      domains: rule.domains,
      interpretation: rule.interpretation,
      display: rule.display,
      sourceIds: rule.sourceIds,
      evidenceLevel: "secondary_source",
      status: "active",
    }));

  const matrix = {};
  for (const stem of stems) {
    matrix[stem] = {};
  }
  for (const rule of stageRules) {
    matrix[rule.dayStem][rule.branch] = rule.stage;
  }

  return {
    _meta: withAudit(
      {
        file: FILES.twelveStages,
        title: "十二长生",
        description: "十天干在十二地支上的长生、沐浴、冠带等阶段性力量。",
        version: "1.0.0",
        sourceRegistry: FILES.sources,
      },
      ["twelve-stages"],
      "secondary_source",
    ),
    stageOrder: ["长生", "沐浴", "冠带", "临官", "帝旺", "衰", "病", "死", "墓", "绝", "胎", "养"],
    matrix,
    rules: stageRules,
  };
}

function makeSystemRulesData(rawSystem) {
  const supplementalRules = makeSupplementalSystemRules();
  return {
    _meta: withAudit(
      {
        file: FILES.systemRules,
        title: "程序匹配规则库",
        description: "用于程序检索、匹配、解释的八字规则矩阵；已统一 rule interface。",
        version: "2.0.0",
        generatedFrom: "bazi-system-rules.json",
        originalGeneratedAt: rawSystem.generatedAt,
        sourceRegistry: FILES.sources,
      },
      ["seasonal-strength", "branch-relations", "ten-gods", "ten-gods-overview", "twelve-stages"],
      "derived",
    ),
    rules: [...rawSystem.rules.map(normalizeRule), ...supplementalRules],
  };
}

function makeSupplementalSystemRules() {
  const supplemental = supplementalCombinationSections();
  const rules = [];

  for (const item of [
    ...supplemental.stemBranchSelfCombinations.rules,
    ...supplemental.stemBranchSelfCombinations.conditionalRules,
  ]) {
    rules.push({
      id: `supplemental-self-${item.pillar}`,
      category: "stem_branch_self_combination",
      match: {
        pillar: item.pillar,
        stem: item.stem,
        branch: item.branch,
        hiddenStem: item.hiddenStem,
        stemCombination: item.stemCombination,
        relation: "自合",
        subtype: item.subtype,
      },
      domains,
      interpretation: item.note,
      display: {
        title: `${item.pillar}自合`,
        template: `${item.pillar}见同柱自合，先作暗中牵连或内部吸引看，需结合刑冲开合与十神得失。`,
      },
      sourceIds: item.sourceIds,
      evidenceLevel: item.evidenceLevel,
      status: item.status,
      notes: {
        fromSection: `${FILES.combinations}#stemBranchSelfCombinations`,
        activation: item.activation ?? null,
      },
    });
  }

  for (const item of [
    ...supplemental.branchHiddenCombinations.rules,
    ...supplemental.branchHiddenCombinations.variantRules,
  ]) {
    const name = item.branches.join("");
    rules.push({
      id: `supplemental-hidden-${name}`,
      category: "branch_hidden_combination",
      match: {
        branches: item.branches,
        relation: "暗合",
        subtype: item.subtype,
        hiddenStemPairs: item.hiddenStemPairs,
      },
      domains,
      interpretation: item.note,
      display: {
        title: `${name}暗合`,
        template: `${name}见暗合，先作藏干之间的隐性牵连看，不直接等同六合或三合。`,
      },
      sourceIds: item.sourceIds,
      evidenceLevel: item.evidenceLevel,
      status: item.status,
      notes: {
        fromSection: `${FILES.combinations}#branchHiddenCombinations`,
      },
    });
  }

  for (const item of [
    ...supplemental.remoteCombinations.stemRemoteRules,
    ...supplemental.remoteCombinations.branchRemoteRules,
  ]) {
    const key = item.stems?.join("") ?? item.branches?.join("");
    rules.push({
      id: `supplemental-remote-${key}`,
      category: "remote_combination",
      match: {
        ...(item.stems ? { stems: item.stems } : { branches: item.branches }),
        relation: item.relation,
        baseRelation: item.baseRelation,
        positionCondition: item.positionCondition,
      },
      domains,
      interpretation: `${key}可按${item.baseRelation}的遥合/隔合看，合力弱于贴近相合。`,
      display: {
        title: `${key}遥合`,
        template: `${key}有遥合之象，先降权处理，再看岁运是否引动。`,
      },
      sourceIds: item.sourceIds,
      evidenceLevel: item.evidenceLevel,
      status: item.status,
      notes: {
        fromSection: `${FILES.combinations}#remoteCombinations`,
        strengthModifier: item.strengthModifier,
      },
    });
  }

  for (const item of [
    ...supplemental.archedCombinations.archThreeCombinationRules,
    ...supplemental.archedCombinations.archThreeMeetingRules,
  ]) {
    rules.push({
      id: `supplemental-arch-${item.branches.join("")}-to-${item.missingBranch}`,
      category: "arched_combination",
      match: {
        branches: item.branches,
        missingBranch: item.missingBranch,
        relation: item.relation,
        baseRelation: item.baseRelation,
        element: item.element,
        fullGroup: item.fullGroup,
      },
      domains,
      interpretation: `${item.name}，为${item.baseRelation}缺中神的暗拱结构；岁运见${item.missingBranch}时再转入完整${item.baseRelation}判断。`,
      display: {
        title: item.name,
        template: `${item.name}先作潜在气势看，等${item.missingBranch}被岁运填实时，事件感会明显增强。`,
      },
      sourceIds: item.sourceIds,
      evidenceLevel: item.evidenceLevel,
      status: item.status,
      notes: {
        fromSection: `${FILES.combinations}#archedCombinations`,
        activation: item.activation,
      },
    });
  }

  return rules;
}

function makeStrengthModelData() {
  const commonSources = [
    "seasonal-strength",
    "core-stems-branches",
    "five-elements-wikipedia",
    "branch-relations",
    "ten-gods",
    "hidden-combinations-bazitalk-10926",
    "stem-branch-self-bazitalk-11067",
    "arched-combinations-shen88",
    "arched-combinations-shenshu",
  ];
  return {
    _meta: withAudit(
      {
        file: FILES.strengthModel,
        title: "力量强弱模型",
        description: "用于后续组合原局、大运、流年、流月时计算强弱、触发与解释优先级的结构化模型。",
        version: "0.1.0",
        sourceRegistry: FILES.sources,
      },
      commonSources,
      "derived",
      "draft",
      "当前只建立保守计算框架；具体权重需要用案例回测后再升为 active。",
    ),
    modelPolicy: {
      status: "draft",
      evidenceLevel: "derived",
      sourceIds: commonSources,
      principle: "先分清基础强弱、关系增减、岁运触发三层，再输出解释；不把单一旺衰分数当成最终结论。",
      outputMode: "qualitative_first",
      notes: `可复用 ${FILES.fiveElements} 的月令强弱、${FILES.stemsBranches} 的藏干、${FILES.combinations} 的合冲刑害破、${FILES.systemRules} 的规则解释。`,
    },
    targets: [
      withAudit({ id: "day_master", label: "日主强弱", description: "判断日主承载财官食伤印比的基础能力。" }, commonSources, "derived", "draft"),
      withAudit({ id: "element", label: "五行强弱", description: "判断木火土金水在原局与岁运中的增减。" }, ["seasonal-strength", "five-elements-wikipedia"], "derived", "draft"),
      withAudit({ id: "ten_god", label: "十神强弱", description: "把五行强弱映射为相对日主的十神作用力。" }, ["ten-gods"], "derived", "draft"),
      withAudit({ id: "theme", label: "主题强弱", description: "将十神、宫位、岁运触发合并到事业、财运、婚姻等主题。" }, ["ten-gods", "branch-relations"], "derived", "draft"),
    ],
    layers: [
      withAudit({ id: "natal", label: "原局", role: "base", description: "提供基础结构、月令、根气、十神分布。" }, commonSources, "derived", "draft"),
      withAudit({ id: "major_luck", label: "大运", role: "environment", description: "作为十年环境，对原局强弱做长期增减。" }, commonSources, "derived", "draft"),
      withAudit({ id: "annual", label: "流年", role: "trigger", description: "触发原局与大运中的合冲刑害破、十神主题。" }, commonSources, "derived", "draft"),
      withAudit({ id: "monthly", label: "流月", role: "fine_trigger", description: "细化流年事件窗口，做月度强弱与主题输出。" }, commonSources, "derived", "draft"),
    ],
    factors: [
      withAudit(
        {
          id: "seasonal_command",
          category: "base_strength",
          label: "月令旺相休囚死",
          dataSource: `${FILES.fiveElements}#seasonalStrength`,
          effect: "给五行基础强弱提供第一层判断。",
          implementationNote: "沿用现有 score 与 seasonalStatus，不在这里重新发明权重。",
        },
        ["seasonal-strength"],
        "secondary_source",
        "active",
      ),
      withAudit(
        {
          id: "rootedness_hidden_stems",
          category: "base_strength",
          label: "通根与藏干",
          dataSource: `${FILES.stemsBranches}#earthlyBranches.hiddenStems`,
          effect: "判断天干或十神是否在地支藏干中有根。",
          implementationNote: "先记录主气、中气、余气和已有 weight；最终权重需回测。",
        },
        ["hidden-stems-xuenb", "core-stems-branches"],
        "derived",
        "draft",
      ),
      withAudit(
        {
          id: "stem_exposure",
          category: "visibility",
          label: "透干",
          dataSource: `${FILES.stemsBranches}#heavenlyStems`,
          effect: "同一五行或十神透出天干时，事件表达更显性。",
          implementationNote: "只作为显性度，不单独定吉凶。",
        },
        ["core-stems-branches", "ten-gods"],
        "derived",
        "draft",
      ),
      withAudit(
        {
          id: "generation_restriction",
          category: "relation_modifier",
          label: "生克增减",
          dataSource: `${FILES.fiveElements}#relations`,
          effect: "用五行生克判断力量流向、泄耗、克制与扶助。",
          implementationNote: "输出应保留作用方向：生我、我生、克我、我克、同我。",
        },
        ["five-elements-wikipedia", "ten-gods"],
        "traditional_consensus",
        "active",
      ),
      withAudit(
        {
          id: "combination_clash_modifier",
          category: "relation_modifier",
          label: "合冲刑害破与补充关系",
          dataSource: FILES.combinations,
          effect: "合主牵绊与成局，冲主变动，刑害破主摩擦、暗耗与结构松动；自合、暗合、遥合、拱合、拱会作为低权重补充触发。",
          implementationNote: "基础合冲刑害破可直接提示；补充关系默认 draft，只做辅助解释和待核对触发。",
        },
        [
          "branch-relations",
          "branch-relations-wikipedia",
          "branch-six-breaks-bazitalk",
          "hidden-combinations-bazitalk-10926",
          "stem-branch-self-bazitalk-11067",
          "arched-combinations-shen88",
          "arched-combinations-shenshu",
        ],
        "derived",
        "draft",
      ),
      withAudit(
        {
          id: "period_trigger",
          category: "timing",
          label: "岁运流月触发",
          dataSource: `${FILES.systemRules}#transit_branch_to_natal_branch`,
          effect: "用流年流月干支触发原局关系，并记录被触发宫位、十神、主题。",
          implementationNote: "输出至少包含 layer、trigger、target、relation、domains。",
        },
        ["branch-relations", "ten-gods"],
        "derived",
        "draft",
      ),
    ],
    calculationFlow: [
      "读取原局四柱，统计天干、地支、藏干、十神分布。",
      "用月令旺相休囚死建立五行基础强弱。",
      "用通根、透干、生克关系修正基础强弱。",
      "加入大运作为长期环境层，只修正趋势，不直接等同事件。",
      "加入流年、流月，触发合冲刑害破与十神主题。",
      "输出时同时返回 strength、trigger、domains、evidenceLevel、sourceIds，避免只有断语没有依据。",
    ],
    requiredOutputShape: {
      target: "day_master | element | ten_god | theme",
      layer: "natal | major_luck | annual | monthly",
      strengthState: "strong | balanced | weak | unknown",
      triggers: [],
      domains: [],
      interpretation: "",
      sourceIds: [],
      evidenceLevel: "derived",
    },
  };
}

function makeBlindData(rawBlindCases, rawMiniBlind, blindSources) {
  const miniById = new Map(rawMiniBlind.map((entry) => [entry.id, entry]));
  const cases = rawBlindCases.map((entry) =>
    normalizeBlindCase(entry, blindSourceId(entry.source), miniById.get(entry.id)),
  );
  const existingIds = new Set(cases.map((entry) => entry.id));
  for (const entry of rawMiniBlind) {
    if (!existingIds.has(entry.id)) {
      cases.push(normalizeBlindCase(entry, blindSourceId(entry.source)));
    }
  }

  return {
    _meta: withAudit(
      {
        file: FILES.blindCases,
        title: "盲派案例与断法候选库",
        description: "盲派相关条目仅作候选知识保存；严格考据模式下默认不进入 active 自动断语。",
        version: "1.0.0",
        sourceRegistry: FILES.sources,
      },
      blindSources.map((source) => source.id),
      "needs_review",
      "needs_source",
    ),
    evidencePolicy: {
      defaultEvidenceLevel: "needs_review",
      defaultStatus: "needs_source",
      reason: "盲派条目目前多来自二手网页与生成整理，需逐条核对原文或经典出处后才能升为 active。",
    },
    cases,
    coverageGaps: [
      "做功路径与宾主体用尚未建立可考据 schema",
      "象法、应期、墓库、穿破的盲派专项条目仍需可靠来源",
      "真实案例缺少出生信息、断语原文、验证结果三段式结构",
      "男女命差异、六亲定位、岁运应期仍需人工核对后补充",
    ],
  };
}

function makePatternsUsefulGodsData() {
  const sourceIds = [
    "pattern-geju-howzan",
    "pattern-geju-fatemaster",
    "ziping-zhenquan-wikipedia",
    "yongshen-tianjiyao",
    "yongshen-suanzhun",
  ];
  const normalPatterns = [
    ["zheng_guan", "正官格", "正官", "以月令或透干正官成格，重清纯、有财印相护。"],
    ["qi_sha", "七杀格", "七杀", "以七杀成格，重制化；宜食神制杀或印化杀。"],
    ["zheng_cai", "正财格", "正财", "以正财成格，重稳定资源、经营与现实秩序。"],
    ["pian_cai", "偏财格", "偏财", "以偏财成格，重流动资源、机会与外部经营。"],
    ["zheng_yin", "正印格", "正印", "以正印成格，重资质、保护、文书与承载。"],
    ["pian_yin", "偏印格", "偏印", "以偏印成格，重专门知识、偏门资源与转换。"],
    ["shi_shen", "食神格", "食神", "以食神成格，重输出、技艺、福气与生财路径。"],
    ["shang_guan", "伤官格", "伤官", "以伤官成格，重表达、突破、才艺，也要看是否伤官见官。"],
    ["jian_lu", "建禄格", "比肩/禄", "月令临禄或比劫旺，重财官调配与身旺有依。"],
    ["yang_ren", "羊刃格/月刃格", "劫财/刃", "月令见刃，重制刃、化刃与权力风险。"],
  ].map(([id, name, tenGod, summary]) => withAudit(
    {
      id,
      name,
      tenGod,
      category: "normal_pattern",
      basis: "以月令为纲，结合藏干透出、日主强弱、清浊成败判断。",
      summary,
    },
    ["pattern-geju-howzan", "pattern-geju-fatemaster", "ziping-zhenquan-wikipedia"],
    "secondary_source",
    "draft",
  ));

  const specialPatterns = [
    ["cong_cai", "从财格", "从格", "财势极旺且日主无根无助，顺财势而从。"],
    ["cong_sha", "从杀格", "从格", "官杀成势且日主不能任，顺杀势而从。"],
    ["cong_er", "从儿格/从食伤", "从格", "食伤成势，日主顺输出之气。"],
    ["cong_shi", "从势格", "从格", "局势偏向一方，难以独立取扶抑。"],
    ["qu_zhi", "曲直格", "专旺格", "木气专旺成势。"],
    ["yan_shang", "炎上格", "专旺格", "火气专旺成势。"],
    ["jia_se", "稼穑格", "专旺格", "土气专旺成势。"],
    ["cong_ge", "从革格", "专旺格", "金气专旺成势。"],
    ["run_xia", "润下格", "专旺格", "水气专旺成势。"],
    ["hua_qi", "化气格", "化气格", "天干合化得令成气，按化出五行论格。"],
  ].map(([id, name, category, summary]) => withAudit(
    {
      id,
      name,
      category,
      summary,
      basis: "特殊格局必须先验证气势是否专一、日主是否可从、合化是否得令，不可只凭一个字定格。",
    },
    ["pattern-geju-howzan", "pattern-geju-fatemaster"],
    "secondary_source",
    "draft",
  ));

  const usefulGodMethods = [
    ["support_suppress", "扶抑用神", "日主偏弱取扶助，偏旺取泄耗克制，先解决承载力问题。"],
    ["seasonal_adjustment", "调候用神", "寒暖燥湿失衡时，以调候为先，尤其冬夏月令明显。"],
    ["bridging", "通关用神", "两气相战时取中间流通之神，使气机可转。"],
    ["medicine_illness", "病药用神", "先定命局之病，再取能治病之药。"],
    ["exclusive_strength", "专旺用神", "专旺或从格中顺其旺势，不按普通扶抑硬逆。"],
    ["pattern_assist", "格局相神", "格局成败常看相神护格、成格、救应。"],
  ].map(([id, name, principle]) => withAudit(
    {
      id,
      name,
      category: "useful_god_method",
      principle,
      databaseBoundary: "这里只存原则和取用类型；真正判断喜忌需要函数结合强弱模型、月令、透藏、刑冲合化计算。",
    },
    ["yongshen-tianjiyao", "yongshen-suanzhun", "ziping-zhenquan-wikipedia"],
    "secondary_source",
    "draft",
  ));

  return {
    _meta: withAudit(
      {
        file: FILES.patternsUsefulGods,
        title: "格局与用神资料库",
        description: "只保存格局、用神类型和判断原则；具体取格、取用神计算放在函数层。",
        version: "1.0.0",
        sourceRegistry: FILES.sources,
      },
      sourceIds,
      "secondary_source",
      "draft",
    ),
    normalPatterns,
    specialPatterns,
    usefulGodMethods,
    calculationBoundary: [
      "月令取格、透干取格、格局成败需要函数综合判断，不在数据库写死结果。",
      "用神喜忌必须依赖强弱模型和命局组合，不把单条原则直接当最终结论。",
    ],
  };
}

function makeStarsSpiritsData() {
  const sourceIds = ["stars-sina-shensha"];
  const byDayStem = (id, name, table, note) => withAudit(
    { id, name, category: "by_day_stem", table, note },
    sourceIds,
    "secondary_source",
    "draft",
  );
  const byGroup = (id, name, table, note) => withAudit(
    { id, name, category: "by_three_combo_group", table, note },
    sourceIds,
    "secondary_source",
    "draft",
  );

  return {
    _meta: withAudit(
      {
        file: FILES.starsSpirits,
        title: "常用神煞资料库",
        description: "保存常见神煞查表。神煞只作辅助提示，不单独定吉凶。",
        version: "1.0.0",
        sourceRegistry: FILES.sources,
      },
      sourceIds,
      "secondary_source",
      "draft",
    ),
    stars: [
      byDayStem("tian_yi_gui_ren", "天乙贵人", { "甲戊庚": ["丑", "未"], "乙己": ["子", "申"], "丙丁": ["亥", "酉"], "壬癸": ["卯", "巳"], "辛": ["寅", "午"] }, "以日干查贵人地支。"),
      byDayStem("wen_chang", "文昌贵人", { 甲: "巳", 乙: "午", 丙: "申", 丁: "酉", 戊: "申", 己: "酉", 庚: "亥", 辛: "子", 壬: "寅", 癸: "卯" }, "以日干查文昌。"),
      byDayStem("lu_shen", "禄神", { 甲: "寅", 乙: "卯", 丙: "巳", 丁: "午", 戊: "巳", 己: "午", 庚: "申", 辛: "酉", 壬: "亥", 癸: "子" }, "以日干查禄。"),
      byDayStem("yang_ren", "羊刃", { 甲: "卯", 乙: "寅", 丙: "午", 丁: "巳", 戊: "午", 己: "巳", 庚: "酉", 辛: "申", 壬: "子", 癸: "亥" }, "羊刃表门派略有差异，暂作 draft。"),
      byGroup("tao_hua", "桃花/咸池", { "申子辰": "酉", "寅午戌": "卯", "巳酉丑": "午", "亥卯未": "子" }, "按年支或日支所属三合局查。"),
      byGroup("yi_ma", "驿马", { "申子辰": "寅", "寅午戌": "申", "巳酉丑": "亥", "亥卯未": "巳" }, "主迁动、出行、变动。"),
      byGroup("hua_gai", "华盖", { "申子辰": "辰", "寅午戌": "戌", "巳酉丑": "丑", "亥卯未": "未" }, "主孤高、技艺、宗教玄学倾向。"),
      byGroup("jiang_xing", "将星", { "申子辰": "子", "寅午戌": "午", "巳酉丑": "酉", "亥卯未": "卯" }, "主组织、掌控、领导象。"),
      withAudit({ id: "kong_wang", name: "旬空/空亡", category: "by_jiazi_xun", table: { "甲子旬": ["戌", "亥"], "甲戌旬": ["申", "酉"], "甲申旬": ["午", "未"], "甲午旬": ["辰", "巳"], "甲辰旬": ["寅", "卯"], "甲寅旬": ["子", "丑"] }, note: "旬空依日柱所在旬计算，具体落点由函数判断。" }, sourceIds, "secondary_source", "draft"),
      withAudit({ id: "kui_gang", name: "魁罡", category: "by_day_pillar", pillars: ["庚辰", "庚戌", "壬辰", "戊戌"], note: "以日柱见者为主，作性情与格局辅助。" }, sourceIds, "secondary_source", "draft"),
      withAudit({ id: "shi_e_da_bai", name: "十恶大败", category: "by_day_pillar", pillars: ["甲辰", "乙巳", "壬申", "丙申", "丁亥", "庚辰", "戊戌", "癸亥", "辛巳", "己丑"], note: "资料常见表，先作提示，不单独定财败。" }, sourceIds, "secondary_source", "draft"),
    ],
    policy: {
      status: "draft",
      evidenceLevel: "secondary_source",
      sourceIds,
      notes: "神煞必须结合原局旺衰、十神、宫位和岁运触发使用，不能单独下结论。",
    },
  };
}

function makeBlindCoreMethodsData() {
  const sourceIds = ["blind-bazitalk-11381"];
  const methods = [
    ["zuo_gong", "做功", "看干支、十神、宫位之间是否发生制、化、合、冲、刑、穿、墓库开闭等实际作用。"],
    ["host_guest", "宾主", "区分命局中谁是主、谁是宾，先看作用方向，再看得失。"],
    ["body_use", "体用", "体为自身与结构，用为被使用的对象和成事路径。"],
    ["image_method", "象法", "把干支、十神、宫位、神煞、物象合看，用于具体断事。"],
    ["storage_open_close", "墓库开闭", "辰戌丑未不只作土看，还要看藏物、开库、闭库、冲库和库中之物能否被用。"],
    ["timing_trigger", "应期", "大运定环境，流年定事件，流月细化窗口，触发点常来自冲合刑害、伏吟反吟、填实拱局。"],
    ["palace_image", "宫位象", "年、月、日、时四柱分别承载祖上早年、父母事业、夫妻自身、子女晚年等象。"],
    ["six_kin_position", "六亲定位", "十神与宫位互参，不只看单个十神，也看其所在柱位和是否被引动。"],
  ].map(([id, name, principle]) => withAudit(
    {
      id,
      name,
      category: "blind_core_method",
      principle,
      databaseBoundary: "这里只存方法论和触发词；具体断事必须结合命盘函数输出的关系链。",
    },
    sourceIds,
    "needs_review",
    "needs_source",
  ));

  return {
    _meta: withAudit(
      {
        file: FILES.blindCoreMethods,
        title: "盲派核心方法库",
        description: "盲派做功、宾主、体用、象法、应期等方法论候选库。",
        version: "1.0.0",
        sourceRegistry: FILES.sources,
      },
      sourceIds,
      "needs_review",
      "needs_source",
    ),
    methods,
    coverageGaps: [
      "需要真实案例补足每个方法的触发条件、断语原文、验证结果。",
      "墓库开闭、穿倒、制化等规则需拆成可计算关系链后再升为 active。",
    ],
  };
}

function makeOutputTemplatesData() {
  const sourceIds = ["positional-combination-policy", "ten-gods", "branch-relations"];
  const domainsForOutput = [
    ["personality", "性格"],
    ["career", "事业"],
    ["money", "财运"],
    ["marriage", "婚恋"],
    ["health", "健康"],
    ["children", "子女"],
    ["study", "学业证书"],
    ["relocation", "迁移出行"],
    ["legal", "官非规则"],
    ["annual", "流年"],
    ["monthly", "流月"],
  ].map(([id, label]) => withAudit(
    {
      id,
      label,
      requiredSignals: ["strength", "tenGod", "palace", "trigger", "evidenceLevel"],
      outputOrder: ["主题判断", "触发依据", "强弱取舍", "提醒建议"],
    },
    sourceIds,
    "derived",
    "draft",
  ));

  return {
    _meta: withAudit(
      {
        file: FILES.outputTemplates,
        title: "输出主题模板库",
        description: "保存各主题输出所需字段和模板块；具体文案组合由函数完成。",
        version: "1.0.0",
        sourceRegistry: FILES.sources,
      },
      sourceIds,
      "derived",
      "draft",
    ),
    domains: domainsForOutput,
    templateBlocks: [
      withAudit({ id: "strength_summary", label: "强弱摘要", template: "此主题当前为 {strengthState}，主要由 {strengthFactors} 决定。" }, sourceIds, "derived", "draft"),
      withAudit({ id: "trigger_summary", label: "触发摘要", template: "{layer} 见 {trigger}，触动 {target}，关系为 {relation}。" }, sourceIds, "derived", "draft"),
      withAudit({ id: "evidence_tail", label: "依据尾注", template: "依据：{sourceIds}；证据等级：{evidenceLevel}。" }, sourceIds, "derived", "draft"),
    ],
    priorityPolicy: {
      status: "draft",
      evidenceLevel: "derived",
      sourceIds,
      order: ["active traditional_consensus", "active secondary_source", "derived", "draft", "needs_review"],
      notes: "输出时优先使用高证据等级和 active 规则；draft 只作辅助提示。",
    },
  };
}

function collectBlindSources(...caseArrays) {
  const seen = new Map();
  for (const caseArray of caseArrays) {
    for (const entry of caseArray) {
      const source = entry.source ?? {};
      const id = blindSourceId(source);
      if (!seen.has(id)) {
        seen.set(id, {
          id,
          title: source.title ?? "未命名盲派来源",
          url: source.url ?? null,
          scope: source.note ?? "盲派候选条目来源，待人工核对。",
          type: "blind_bazi_secondary_or_generated",
          evidenceLevel: "needs_review",
          status: "needs_source",
          notes: "该来源只用于候选库溯源，不代表已完成严格校勘。",
        });
      }
    }
  }
  return [...seen.values()].sort((a, b) => a.id.localeCompare(b.id));
}

function makeSourcesData(blindSources) {
  return {
    _meta: {
      file: FILES.sources,
      title: "数据来源清单",
      description: "所有规范数据文件使用的 sourceIds 都必须能在这里找到。",
      version: "1.0.0",
      generatedAt: new Date().toISOString(),
    },
    evidenceLevels: ["traditional_consensus", "secondary_source", "derived", "needs_review"],
    statuses: ["active", "draft", "archived", "needs_source"],
    sources: [...baseSources, ...blindSources],
  };
}

function makeIndexData(datasets) {
  return {
    _meta: {
      file: FILES.index,
      title: "八字数据索引",
      description: "规范数据集总览、覆盖状态和 legacy 位置。",
      version: "1.0.0",
      generatedAt: new Date().toISOString(),
    },
    sourceRegistry: FILES.sources,
    datasets,
    coverage: {
      verifiedCore: [
        "天干 10",
        "地支 12",
        "六十甲子 60",
        "十神矩阵 10x10",
        "天干五合 5",
        "地支六合 6",
        "地支三合 4",
        "地支三会 4",
        "地支六冲 6",
        "地支三刑 4组",
      "地支六害 6",
      "地支六破 6",
      "十二长生 120",
    ],
      draftSupplemental: [
        "干支自合 9 + 条件候选 1",
        "地支暗合核心 3 + 扩展候选 3",
        "遥合/隔合：天干五合 5、地支六合 6 的位置修正",
        "拱合 4、拱会 4",
        "正格/特殊格局/用神方法已建候选库",
        "常用神煞已建候选查表",
        "盲派核心方法和输出主题模板已建候选库",
      ],
      needsReview: [
        "盲派做功、宾主体用、象法、应期、墓库、穿破",
        "自合、暗合、遥合、拱合、拱会的成立条件和权重需案例回测",
        "真实盲派案例的原文、命盘、应验信息",
        "旧 rules.json 的早期演示条目",
      ],
      functionLayerOnly: [
        "节气换月、真太阳时、早晚子时、起运岁数、大运顺逆、流年流月干支生成",
      ],
    },
    legacy: {
      directory: `legacy/${legacyDate}/`,
      policy: "归档不丢；legacy 文件不参与 active 程序索引。",
      files: originalFiles,
    },
  };
}

function countCombinationEntries(data) {
  return [
    data.heavenlyStemCombinations?.rules,
    data.branchSixCombinations?.rules,
    data.branchThreeCombinations?.rules,
    data.branchThreeCombinations?.halfCombinations,
    data.branchThreeMeetings?.rules,
    data.branchSixClashes?.rules,
    data.branchThreePunishments?.rules,
    data.branchSixHarms?.rules,
    data.branchSixBreaks?.rules,
    data.stemBranchSelfCombinations?.rules,
    data.stemBranchSelfCombinations?.conditionalRules,
    data.branchHiddenCombinations?.rules,
    data.branchHiddenCombinations?.variantRules,
    data.remoteCombinations?.stemRemoteRules,
    data.remoteCombinations?.branchRemoteRules,
    data.archedCombinations?.archThreeCombinationRules,
    data.archedCombinations?.archThreeMeetingRules,
  ].reduce((total, list) => total + (Array.isArray(list) ? list.length : 0), 0);
}

function makeReadme() {
  return `# 八字数据目录

本目录已按“严格考据 + 程序/阅读两用 + 旧文件归档不丢”的原则整理。

## 文件说明

- \`${FILES.sources}\`：统一来源清单，所有 \`sourceIds\` 都必须在这里登记。
- \`${FILES.stemsBranches}\`：天干、地支、藏干、六十甲子。
- \`${FILES.fiveElements}\`：五行生克与旺相休囚死。
- \`${FILES.tenGods}\`：十神定义、100 格矩阵、宫位象意和常见组合。
- \`${FILES.combinations}\`：天干五合、地支六合/三合/三会/六冲/三刑/六害/六破，以及自合、暗合、遥合、拱合、拱会等补充关系。
- \`${FILES.twelveStages}\`：十二长生 10x12 表。
- \`${FILES.systemRules}\`：程序匹配用统一规则库。
- \`${FILES.blindCases}\`：盲派候选案例与断法，默认 \`needs_source\`，不直接参与 active 自动断语。
- \`${FILES.strengthModel}\`：力量强弱模型，描述原局、大运、流年、流月如何叠加强弱和触发关系。
- \`${FILES.patternsUsefulGods}\`：格局、特殊格局、用神方法，只存原则，不存计算结果。
- \`${FILES.starsSpirits}\`：常用神煞查表，只作辅助提示。
- \`${FILES.blindCoreMethods}\`：盲派做功、宾主、体用、象法、应期等方法论候选。
- \`${FILES.outputTemplates}\`：主题输出模板和优先级策略。
- \`index.json\`：数据集索引与覆盖状态。

## 证据等级

- \`traditional_consensus\`：传统基础共识或多来源可交叉验证的基础表。
- \`secondary_source\`：来自二手资料页、教学页或整理页。
- \`derived\`：由基础表机械生成的规则矩阵。
- \`needs_review\`：尚未完成严格原文核对，只保留为候选资料。

## 维护规则

1. 新增 active 条目必须带 \`sourceIds\`，且 ID 必须存在于 \`${FILES.sources}\`。
2. 盲派条目没有可靠原文、命盘或案例验证前，保持 \`status: "needs_source"\`。
3. 自合、暗合、遥合、拱合、拱会默认是 \`draft\`，可提示和触发，但不要直接当成基础共识定吉凶。
4. 排盘、起运、真太阳时、流年流月生成这类算法放函数层，不写死在数据库。
5. \`data/legacy/${legacyDate}/\` 是原始文件归档区，不参与程序索引。
6. 修改数据后运行 \`node scripts/validate-bazi-data.mjs\`。
`;
}

async function archiveOriginals() {
  await fs.mkdir(legacyDir, { recursive: true });
  const manifest = [];
  for (const fileName of originalFiles) {
    const sourcePath = path.join(dataDir, fileName);
    const targetPath = path.join(legacyDir, fileName);
    if (await exists(sourcePath)) {
      if (!(await exists(targetPath))) {
        await fs.copyFile(sourcePath, targetPath);
      }
      const stat = await fs.stat(targetPath);
      manifest.push({ file: fileName, bytes: stat.size, archivedAs: `legacy/${legacyDate}/${fileName}` });
    } else if (await exists(targetPath)) {
      const stat = await fs.stat(targetPath);
      manifest.push({ file: fileName, bytes: stat.size, archivedAs: `legacy/${legacyDate}/${fileName}` });
    }
  }
  await fs.writeFile(
    path.join(legacyDir, "manifest.json"),
    `${JSON.stringify({ archivedAt: new Date().toISOString(), files: manifest }, null, 2)}\n`,
    "utf8",
  );
}

async function removeStaleRootFiles() {
  for (const fileName of staleRootFiles) {
    const filePath = path.join(dataRoot, fileName);
    if (await exists(filePath)) {
      await fs.unlink(filePath);
    }
  }
}

async function main() {
  await archiveOriginals();

  const rawBasics = await readJSON("gemini-code-1779699928438.json");
  const rawTenGods = await readJSON("03-ten-gods.json");
  const rawCombinations = await readJSON("04-combinations-clashes.json");
  const rawSystem = await readJSON("bazi-system-rules.json");
  const rawBlindCases = await readJSON("blind-bazi-cases.json");
  const rawMiniBlind = await readJSON("gemini-code-1779699914160.json");

  const blindSources = collectBlindSources(rawBlindCases, rawMiniBlind);
  const sourcesData = makeSourcesData(blindSources);
  const stemBranchData = makeStemBranchData(rawBasics);
  const fiveElementsData = makeFiveElementsData(rawBasics, rawSystem);
  const tenGodsData = makeTenGodsData(rawTenGods);
  const combinationsData = makeCombinationsData(rawCombinations);
  const twelveStagesData = makeTwelveStagesData(rawSystem);
  const systemRulesData = makeSystemRulesData(rawSystem);
  const strengthModelData = makeStrengthModelData();
  const blindData = makeBlindData(rawBlindCases, rawMiniBlind, blindSources);
  const patternsUsefulGodsData = makePatternsUsefulGodsData();
  const starsSpiritsData = makeStarsSpiritsData();
  const blindCoreMethodsData = makeBlindCoreMethodsData();
  const outputTemplatesData = makeOutputTemplatesData();

  await writeJSON(FILES.sources, sourcesData);
  await writeJSON(FILES.stemsBranches, stemBranchData);
  await writeJSON(FILES.fiveElements, fiveElementsData);
  await writeJSON(FILES.tenGods, tenGodsData);
  await writeJSON(FILES.combinations, combinationsData);
  await writeJSON(FILES.twelveStages, twelveStagesData);
  await writeJSON(FILES.systemRules, systemRulesData);
  await writeJSON(FILES.blindCases, blindData);
  await writeJSON(FILES.strengthModel, strengthModelData);
  await writeJSON(FILES.patternsUsefulGods, patternsUsefulGodsData);
  await writeJSON(FILES.starsSpirits, starsSpiritsData);
  await writeJSON(FILES.blindCoreMethods, blindCoreMethodsData);
  await writeJSON(FILES.outputTemplates, outputTemplatesData);

  const datasets = [
    { id: "sources", file: FILES.sources, title: "来源清单", status: "active", entryCount: sourcesData.sources.length },
    { id: "stems-branches", file: FILES.stemsBranches, title: "天干地支", status: "active", entryCount: stemBranchData.heavenlyStems.length + stemBranchData.earthlyBranches.length + stemBranchData.sixtyJiaziCycle.list.length },
    { id: "five-elements", file: FILES.fiveElements, title: "五行强弱", status: "active", entryCount: fiveElementsData.elements.length + fiveElementsData.seasonalStrength.rules.length },
    { id: "ten-gods", file: FILES.tenGods, title: "十神", status: "active", entryCount: tenGodsData.tenGodDefinitions.length + tenGodsData.tenGodCombinations.pairs.length },
    { id: "combinations-clashes", file: FILES.combinations, title: "合冲刑害破与补充关系", status: "active", entryCount: countCombinationEntries(combinationsData) },
    { id: "twelve-growth-stages", file: FILES.twelveStages, title: "十二长生", status: "active", entryCount: twelveStagesData.rules.length },
    { id: "system-rules", file: FILES.systemRules, title: "程序规则库", status: "active", entryCount: systemRulesData.rules.length },
    { id: "blind-bazi-cases", file: FILES.blindCases, title: "盲派候选库", status: "needs_source", entryCount: blindData.cases.length },
    { id: "strength-model", file: FILES.strengthModel, title: "力量模型", status: "draft", entryCount: strengthModelData.factors.length },
    { id: "patterns-useful-gods", file: FILES.patternsUsefulGods, title: "格局用神", status: "draft", entryCount: patternsUsefulGodsData.normalPatterns.length + patternsUsefulGodsData.specialPatterns.length + patternsUsefulGodsData.usefulGodMethods.length },
    { id: "stars-spirits", file: FILES.starsSpirits, title: "神煞", status: "draft", entryCount: starsSpiritsData.stars.length },
    { id: "blind-core-methods", file: FILES.blindCoreMethods, title: "盲派核心方法", status: "needs_source", entryCount: blindCoreMethodsData.methods.length },
    { id: "output-templates", file: FILES.outputTemplates, title: "输出主题模板", status: "draft", entryCount: outputTemplatesData.domains.length + outputTemplatesData.templateBlocks.length },
  ];
  await writeJSON(FILES.index, makeIndexData(datasets));
  await fs.writeFile(path.join(dataRoot, "README.md"), makeReadme(), "utf8");

  await removeStaleRootFiles();

  console.log(`Organized Bazi data in ${dataDir}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
