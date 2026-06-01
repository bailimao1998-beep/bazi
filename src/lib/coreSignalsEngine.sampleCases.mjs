const basePillars = {
  year: { label: "甲子", stem: "甲", branch: "子", stemElement: "wood", branchElement: "water" },
  month: { label: "乙酉", stem: "乙", branch: "酉", stemElement: "wood", branchElement: "metal" },
  day: { label: "辛卯", stem: "辛", branch: "卯", stemElement: "metal", branchElement: "wood" },
  hour: { label: "壬午", stem: "壬", branch: "午", stemElement: "water", branchElement: "fire" },
};

const displayPillars = {
  year: {
    label: "年柱",
    ganzhi: "甲子",
    stemTenGod: "正财",
    branchMainTenGod: "食神",
    hiddenStems: [{ stem: "癸", tenGod: "食神", role: "主气" }],
  },
  month: {
    label: "月柱",
    ganzhi: "乙酉",
    stemTenGod: "偏财",
    branchMainTenGod: "比肩",
    hiddenStems: [{ stem: "辛", tenGod: "比肩", role: "主气" }],
  },
  day: {
    label: "日柱",
    ganzhi: "辛卯",
    stemTenGod: "日主",
    branchMainTenGod: "偏财",
    hiddenStems: [{ stem: "乙", tenGod: "偏财", role: "主气" }],
  },
  hour: {
    label: "时柱",
    ganzhi: "壬午",
    stemTenGod: "伤官",
    branchMainTenGod: "七杀",
    hiddenStems: [{ stem: "丁", tenGod: "七杀", role: "主气" }],
  },
};

const elementCounts = { wood: 2, fire: 1, earth: 0, metal: 2, water: 2 };
const visibleElementCounts = { wood: 3, fire: 1, earth: 0, metal: 2, water: 2 };
const hiddenElementCounts = { wood: 1, fire: 1, earth: 0, metal: 1, water: 1 };

export const coreSignalSampleCases = [
  {
    id: "resource-prominent",
    title: "印星突出样例",
    tenGodCounts: { 正印: 2, 比肩: 1 },
    relations: [],
    expectedTopicTags: ["学习资源明显"],
  },
  {
    id: "output-weak",
    title: "食伤弱样例",
    tenGodCounts: { 比肩: 3, 正印: 1 },
    relations: [],
    expectedTopicTags: ["表达输出偏弱"],
  },
  {
    id: "authority-present",
    title: "官杀明显样例",
    tenGodCounts: { 正官: 1, 七杀: 1, 比肩: 1 },
    relations: [],
    expectedTopicTags: ["规则压力存在"],
  },
  {
    id: "wealth-present",
    title: "财星明显样例",
    tenGodCounts: { 正财: 1, 偏财: 1, 比肩: 1 },
    relations: [],
    expectedTopicTags: ["财星有线索"],
  },
  {
    id: "relation-combination",
    title: "关系有合样例",
    tenGodCounts: { 比肩: 1 },
    relations: [relation("地支六合", ["子", "丑"], ["年柱", "月柱"], ["甲子", "乙丑"])],
    expectedTopicTags: ["关系有合"],
  },
  {
    id: "relation-break",
    title: "关系有破样例",
    tenGodCounts: { 比肩: 1 },
    relations: [relation("地支六破", ["子", "酉"], ["年柱", "月柱"], ["甲子", "乙酉"])],
    expectedTopicTags: ["关系有破"],
  },
  {
    id: "relation-clash",
    title: "关系有冲样例",
    tenGodCounts: { 比肩: 1 },
    relations: [relation("地支六冲", ["子", "午"], ["年柱", "时柱"], ["甲子", "壬午"])],
    expectedTopicTags: ["关系有冲"],
  },
];

export function makeCoreSignalSampleReading(sample) {
  const tenGodCounts = { ...sample.tenGodCounts };
  return {
    natal: {
      pillars: structuredClone(basePillars),
      elements: { ...elementCounts },
      coreChart: { tenGodCounts },
      combinations: [],
      pairInteractions: [],
      basicBaziDisplay: {
        pillars: structuredClone(displayPillars),
        tenGods: {
          stats: {
            fullHidden: tenGodCounts,
            mainQi: tenGodCounts,
          },
          heavenlyStems: [],
          branchMain: [],
        },
        elementStats: {
          visible: { label: "明面五行", counts: { ...visibleElementCounts } },
          hidden: { label: "藏干五行", counts: { ...hiddenElementCounts } },
        },
        calendar: {
          originalTime: "08:00",
          finalTime: "08:00",
          solarTermRange: "白露-寒露",
          solarTermBasis: "月柱按节气排月",
          trueSolarTime: { enabled: false, applied: false },
          dayPillarRule: "23:00-23:59按次日计算日柱",
          dayPillarDate: "2000-09-10",
        },
        relations: structuredClone(sample.relations),
      },
    },
  };
}

function relation(type, members, pillars, ganzhi) {
  return { type, members, pillars, ganzhi };
}
