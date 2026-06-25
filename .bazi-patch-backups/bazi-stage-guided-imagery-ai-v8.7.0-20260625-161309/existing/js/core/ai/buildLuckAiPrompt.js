import { buildStageAiTrustedPack } from "./buildStageAiTrustedPack.js";
import { buildStageAiFactPack } from "./buildStageAiFactPack.js";
import { buildStageRulePack } from "../transit/buildStageRulePack.js";

export function buildLuckAiPrompt({
  baseBaziViewModel,
  natalImageReport,
  luckImageReport,
} = {}) {
  const luckItems = Array.isArray(luckImageReport?.luckItems) ? luckImageReport.luckItems : [];
  const currentLuckItem = luckItems.find((item) => item?.isCurrent) ?? luckItems[0] ?? null;
  const trustedPack = buildStageAiTrustedPack({
    stage: "luck",
    item: currentLuckItem,
    currentLuckItem,
    baseBaziViewModel,
    natalImageReport,
  });
  const stageRulePack = buildStageRulePack({
    stage: "luck",
    item: currentLuckItem,
    domainKeys: [],
  });
  const factPack = buildStageAiFactPack({
    stage: "luck",
    trustedPack,
    stageRulePack,
  });

  return {
    system: [
      "你是八字命理系统的大运综合判断层。前端只提供排盘硬事实、结构事实和候选规则，不替你决定现实领域和主次。",
      "不得重新排盘，不得补造未提供的干支关系。",
      "不要读取或沿用前端生成的领域排名、固定报告标题、机会压力、行动建议或现实场景结论；这些内容没有作为本轮输入提供。",
      "判断顺序必须是：原局基础结构 → 当前大运干支与十神 → 大运对原局的直接作用 → 多条事实汇合 → 候选规则 → 现实领域与场景。",
      "先把同一组干支参与者产生的五合、六合、冲、刑、害、破等标签合并为一个复合作用，再判断主次，不能把同源标签当作多条独立证据重复加权。",
      "宫位只负责提示生活层面，不能因为年柱被触发就直接写家庭、长辈或房屋，也不能因为日柱被触发就直接写婚恋。",
      "大运报告要回答：这十年整体会过一种怎样的生活，哪些能力被推向现实，学习、工作、环境、关系和资源怎样互相牵动。",
      "现实领域由你根据全部事实自行排序，只展开证据真正汇合的一至四项；证据不足时少写，不得凑领域。",
      "关系质量与婚姻或共同生活的现实可行性必须分开；感情好不代表能落地，现实困难也不等于关系差。",
      "计划受阻要区分延后、补充条件、改变路径和彻底终止；没有终止证据时不得写成失败。",
      "大运节奏只写初入、持续和临近换运，不得自行划分没有流年证据支持的具体年份。",
      "每个主要结论必须包含：命理原因、现实矛盾、较可能表现、替代分支、成立条件或验证点。",
      "只用自然中文，不得输出英文枚举、JSON、字段名、评分、规则ID或证据ID。",
      "输出结构固定为：",
      "### 阶段总判",
      "### 原局如何承接",
      "### 这十年的作用链",
      "### 主要现实领域",
      "### 阶段节奏",
      "### 可以获得什么，需要付出什么",
      "### 现实验证点",
    ].join("\n"),
    user: JSON.stringify({
      task: "仅依据事实包与候选规则，由AI自行完成主次排序和现实化判断，生成当前大运报告。",
      factPack,
    }, null, 2),
    factPack,
    trustedPack: factPack,
    stageRulePack,
    evidenceIds: trustedPack.allowedEvidenceRefs,
  };
}
