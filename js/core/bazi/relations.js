const pillarOrder = ["year", "month", "day", "hour"];

const stemCombos = [
  ["天干五合", ["甲", "己"], "土象牵连"],
  ["天干五合", ["乙", "庚"], "金象牵连"],
  ["天干五合", ["丙", "辛"], "水象牵连"],
  ["天干五合", ["丁", "壬"], "木象牵连"],
  ["天干五合", ["戊", "癸"], "火象牵连"],
];

const stemClashes = [
  ["甲", "庚"],
  ["乙", "辛"],
  ["丙", "壬"],
  ["丁", "癸"],
];

const pairBranchRules = [
  ["地支六合", ["子", "丑"], "土象牵连"],
  ["地支六合", ["寅", "亥"], "木象牵连"],
  ["地支六合", ["卯", "戌"], "火象牵连"],
  ["地支六合", ["辰", "酉"], "金象牵连"],
  ["地支六合", ["巳", "申"], "水象牵连"],
  ["地支六合", ["午", "未"], "土象牵连"],
  ["地支六冲", ["子", "午"], "冲动"],
  ["地支六冲", ["丑", "未"], "冲动"],
  ["地支六冲", ["寅", "申"], "冲动"],
  ["地支六冲", ["卯", "酉"], "冲动"],
  ["地支六冲", ["辰", "戌"], "冲动"],
  ["地支六冲", ["巳", "亥"], "冲动"],
  ["地支六害", ["子", "未"], "暗中牵制"],
  ["地支六害", ["丑", "午"], "暗中牵制"],
  ["地支六害", ["寅", "巳"], "暗中牵制"],
  ["地支六害", ["卯", "辰"], "暗中牵制"],
  ["地支六害", ["申", "亥"], "暗中牵制"],
  ["地支六害", ["酉", "戌"], "暗中牵制"],
  ["地支穿", ["子", "未"], "穿害牵制"],
  ["地支穿", ["丑", "午"], "穿害牵制"],
  ["地支穿", ["寅", "巳"], "穿害牵制"],
  ["地支穿", ["卯", "辰"], "穿害牵制"],
  ["地支穿", ["申", "亥"], "穿害牵制"],
  ["地支穿", ["酉", "戌"], "穿害牵制"],
  ["地支六破", ["子", "酉"], "破象"],
  ["地支六破", ["卯", "午"], "破象"],
  ["地支六破", ["辰", "丑"], "破象"],
  ["地支六破", ["戌", "未"], "破象"],
  ["地支六破", ["寅", "亥"], "破象"],
  ["地支六破", ["巳", "申"], "破象"],
];

const tripleBranchRules = [
  ["地支三合", ["申", "子", "辰"], "水局条件"],
  ["地支三合", ["亥", "卯", "未"], "木局条件"],
  ["地支三合", ["寅", "午", "戌"], "火局条件"],
  ["地支三合", ["巳", "酉", "丑"], "金局条件"],
  ["地支三会", ["寅", "卯", "辰"], "东方木气会聚"],
  ["地支三会", ["巳", "午", "未"], "南方火气会聚"],
  ["地支三会", ["申", "酉", "戌"], "西方金气会聚"],
  ["地支三会", ["亥", "子", "丑"], "北方水气会聚"],
  ["地支三刑", ["寅", "巳", "申"], "刑象"],
  ["地支三刑", ["丑", "戌", "未"], "刑象"],
];

const selfPunishmentBranches = ["辰", "午", "酉", "亥"];
const expectedRelationTypes = [
  "天干五合",
  "地支六合",
  "地支六冲",
  "地支六害",
  "地支三合",
  "地支三会",
  "地支三刑",
  "地支自刑",
  "地支六破",
  "地支穿",
  "伏吟",
  "反吟",
  "天克地冲",
];

export function buildBaziRelations(pillars = {}) {
  const items = pillarOrder.map((key) => ({ key, ...pillars[key] })).filter((pillar) => pillar?.stem && pillar?.branch);
  const relations = [];

  for (let leftIndex = 0; leftIndex < items.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < items.length; rightIndex += 1) {
      const left = items[leftIndex];
      const right = items[rightIndex];
      for (const [type, members, effect] of stemCombos) {
        if (sameSet(members, [left.stem, right.stem])) relations.push(createPairRelation(type, members, [left, right], effect));
      }
      for (const [type, members, effect] of pairBranchRules) {
        if (sameSet(members, [left.branch, right.branch])) relations.push(createPairRelation(type, members, [left, right], effect));
      }
      if (left.label === right.label) relations.push(createPairRelation("伏吟", [left.label], [left, right], "同柱重复"));
      if (isStemClash(left.stem, right.stem) && isBranchClash(left.branch, right.branch)) {
        relations.push(createPairRelation("天克地冲", [left.label, right.label], [left, right], "天干相克、地支相冲同见"));
        relations.push(createPairRelation("反吟", [left.label, right.label], [left, right], "天干地支对冲"));
      }
    }
  }

  for (const [type, members, effect] of tripleBranchRules) {
    const matched = members.map((branch) => items.find((pillar) => pillar.branch === branch)).filter(Boolean);
    if (matched.length === members.length) relations.push(createGroupRelation(type, members, matched, effect));
  }

  for (const branch of selfPunishmentBranches) {
    const matched = items.filter((pillar) => pillar.branch === branch);
    if (matched.length >= 2) relations.push(createGroupRelation("地支自刑", [branch], matched, "同支自刑"));
  }

  return dedupeRelations(relations);
}

export function summarizeRelationCompleteness(relations = []) {
  const existing = [...new Set(relations.map((relation) => relation.type))];
  const missing = expectedRelationTypes.filter((type) => !existing.includes(type));
  return {
    existing,
    missing,
    notes: [
      existing.length
        ? `已列出${existing.join("、")}等结构关系，后续取象需结合柱位、月令与岁运触发。`
        : "当前基础盘未列出明显干支关系，后续仍需结合岁运触发复核。",
      missing.length ? `未见或未成组的关系：${missing.join("、")}。` : "常用关系类型均已有命中记录。",
    ],
  };
}

function createPairRelation(type, members, pair, effect) {
  return createRelation(type, members, pair, effect, pairEvidence(type, members, pair, effect));
}

function createGroupRelation(type, members, group, effect) {
  return createRelation(type, members, group, effect, groupEvidence(type, members, group, effect));
}

function createRelation(type, members, pillars, effect, evidence) {
  return {
    type,
    members,
    pillars: pillars.map((pillar) => pillar.role),
    ganzhi: pillars.map((pillar) => pillar.label),
    effect,
    evidence,
    confidence: "medium",
    needVerify: ["干支关系只作为结构观察点，具体作用需要结合柱位、月令、透干、根气与岁运验证。"],
  };
}

function pairEvidence(type, members, [left, right], effect) {
  const prefix = `${left.role}${left.label} 与 ${right.role}${right.label}`;
  if (type.includes("合")) return `${prefix}：见${members.join("")}${type}，有合象、牵连、合绊之象，偏向${effect}；是否成化需要结合月令、透干、根气复核。`;
  if (type.includes("冲") || type === "反吟" || type === "天克地冲") return `${prefix}：见${type}，有冲动、变化、拉扯之象；轻重需要结合柱位、月令和岁运触发观察。`;
  if (type.includes("害") || type.includes("穿")) return `${prefix}：见${members.join("")}${type}，有暗中牵制、互动不顺或穿害之象；具体表现需要结合现实承接复核。`;
  if (type.includes("破")) return `${prefix}：见${members.join("")}${type}，有破损、松动、反复之象；需结合原局强弱与岁运触发观察。`;
  if (type === "伏吟") return `${prefix}：同一干支重复，形成伏吟观察点；需结合柱位与岁运再判断作用方向。`;
  return `${prefix}：见${members.join("")}${type}，作为基础结构观察点。`;
}

function groupEvidence(type, members, group, effect) {
  return `${group.map((pillar) => `${pillar.role}${pillar.label}`).join("、")}：地支成${members.join("")}${type}，提示${effect}；是否成局或转化需结合月令、透干、根气复核。`;
}

function sameSet(left, right) {
  return left.length === right.length && left.every((item) => right.includes(item));
}

function isStemClash(left, right) {
  return stemClashes.some((pair) => sameSet(pair, [left, right]));
}

function isBranchClash(left, right) {
  return pairBranchRules.some(([type, members]) => type === "地支六冲" && sameSet(members, [left, right]));
}

function dedupeRelations(relations) {
  const seen = new Set();
  return relations.filter((relation) => {
    const key = `${relation.type}|${relation.members.join("")}|${relation.pillars.join("")}|${relation.ganzhi.join("")}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
