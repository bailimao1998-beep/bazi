const branchRelations = [
  { type: "冲", pairs: [["子", "午"], ["丑", "未"], ["寅", "申"], ["卯", "酉"], ["辰", "戌"], ["巳", "亥"]], strength: 32, reality: "变动、拉扯、重新安排、地点或节奏变化。" },
  { type: "合", pairs: [["子", "丑"], ["寅", "亥"], ["卯", "戌"], ["辰", "酉"], ["巳", "申"], ["午", "未"]], strength: 24, reality: "靠近、绑定、协商、资源或关系牵连。" },
  { type: "害", pairs: [["子", "未"], ["丑", "午"], ["寅", "巳"], ["卯", "辰"], ["申", "亥"], ["酉", "戌"]], strength: 22, reality: "隐性摩擦、别扭反复、流程卡点或配合不畅。" },
  { type: "穿", pairs: [["子", "未"], ["丑", "午"], ["寅", "巳"], ["卯", "辰"], ["申", "亥"], ["酉", "戌"]], strength: 20, reality: "细节穿透、暗处消耗、需要复核约定和流程。" },
  { type: "刑", pairs: [["子", "卯"], ["寅", "巳"], ["巳", "申"], ["申", "寅"], ["丑", "戌"], ["戌", "未"], ["未", "丑"]], strength: 24, reality: "规则压力、内耗、反复修正或关系紧张。" },
];

const stemCombos = [
  ["甲", "己"],
  ["乙", "庚"],
  ["丙", "辛"],
  ["丁", "壬"],
  ["戊", "癸"],
];

export function normalizePillar(pillar, fallbackRole = "") {
  if (!pillar) return null;
  const label = pillar.label || `${pillar.stem ?? ""}${pillar.branch ?? ""}`;
  return {
    ...pillar,
    label,
    role: pillar.role || fallbackRole,
    stem: pillar.stem || label.slice(0, 1),
    branch: pillar.branch || label.slice(1, 2),
  };
}

export function getBranchRelations(leftBranch, rightBranch) {
  if (!leftBranch || !rightBranch) return [];
  const relations = [];
  if (leftBranch === rightBranch) {
    relations.push({ type: "同支", strength: 26, reality: "旧题重现、同类事务回到台前。" });
  }
  for (const relation of branchRelations) {
    if (relation.pairs.some((pair) => samePair(pair, [leftBranch, rightBranch]))) {
      relations.push({ type: relation.type, strength: relation.strength, reality: relation.reality });
    }
  }
  return relations;
}

export function getStemRelations(leftStem, rightStem) {
  if (!leftStem || !rightStem) return [];
  const relations = [];
  if (leftStem === rightStem) {
    relations.push({ type: "同干", strength: 18, reality: "同类职责、身份或表达方式再次出现。" });
  }
  if (stemCombos.some((pair) => samePair(pair, [leftStem, rightStem]))) {
    relations.push({ type: "天干合", strength: 18, reality: "外显角色、资源或承诺出现牵连。" });
  }
  return relations;
}

export function getPillarRelations(source, target) {
  const left = normalizePillar(source);
  const right = normalizePillar(target);
  if (!left || !right) return [];
  const stem = getStemRelations(left.stem, right.stem);
  const branch = getBranchRelations(left.branch, right.branch);
  const relations = [...stem, ...branch];
  if (left.stem === right.stem && left.branch === right.branch) {
    relations.push({ type: "伏吟", strength: 34, reality: "同柱重叠，旧主题、旧任务或同类关系更容易重现。" });
  } else if (isOppositeBranch(left.branch, right.branch)) {
    relations.push({ type: "反吟", strength: 30, reality: "对冲明显，变动、重排和外部节奏变化更容易被看见。" });
  }
  return relations;
}

export function isOppositeBranch(leftBranch, rightBranch) {
  return branchRelations[0].pairs.some((pair) => samePair(pair, [leftBranch, rightBranch]));
}

export function relationReality(type) {
  return branchRelations.find((item) => item.type === type)?.reality
    || { 同支: "旧题重现、同类事务回到台前。", 同干: "同类职责、身份或表达方式再次出现。", 伏吟: "旧题重现，主题反复。", 反吟: "变动和重排增强。" }[type]
    || "关系被触发，需要结合柱位和层级观察。";
}

export function samePair(pair, values) {
  return pair.length === values.length && pair.every((item) => values.includes(item));
}

