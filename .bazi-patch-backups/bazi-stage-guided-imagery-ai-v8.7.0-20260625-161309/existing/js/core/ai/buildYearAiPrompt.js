import { buildStageAiTrustedPack } from "./buildStageAiTrustedPack.js";
import { buildStageAiFactPack } from "./buildStageAiFactPack.js";
import { buildStageRulePack } from "../transit/buildStageRulePack.js";

export function buildYearAiPrompt({
  baseBaziViewModel,
  natalImageReport,
  luckImageReport,
  yearImageReport,
} = {}) {
  const yearItem = yearImageReport?.yearItem ?? null;
  const luckItems = Array.isArray(luckImageReport?.luckItems) ? luckImageReport.luckItems : [];
  const currentLuckItem = yearItem?.currentLuckItem ?? luckItems.find((item) => item?.isCurrent) ?? luckItems[0] ?? null;
  const trustedPack = buildStageAiTrustedPack({
    stage: "year",
    item: yearItem,
    currentLuckItem,
    yearItem,
    baseBaziViewModel,
    natalImageReport,
  });
  const stageRulePack = buildStageRulePack({
    stage: "year",
    item: yearItem,
    domainKeys: [],
  });
  const factPack = buildStageAiFactPack({
    stage: "year",
    trustedPack,
    stageRulePack,
  });

  return {
    system: [
      "你是八字命理系统的流年综合判断层。前端只提供原局、大运、流年的硬事实和候选规则，不替你决定学业、事业、感情、家庭、财务或迁移谁是主线。",
      "不得重新排盘，不得补造未提供的作用关系。",
      "不要读取或沿用前端生成的领域排名、固定报告标题、机会压力、行动建议或现实场景结论；这些内容没有作为本轮输入提供。",
      "判断顺序必须是：原局基础 → 大运长期背景 → 流年新增干支与十神 → 流年对原局及大运的直接作用 → 多条事实汇合 → 候选规则 → 年度现实落点。",
      "同一组干支参与者产生的多个结构标签要先合并，不能把同源五合、六合、冲、破等当作多条独立证据重复加权。",
      "宫位只提示可能涉及的生活层面，不能因为月柱被动就直接认定工作，不能因为年柱被动就直接认定家庭，不能因为日干被合就直接认定恋爱或结婚。",
      "必须比较同一结构在当事人不同现实身份下的可能落点，例如规则压力既可能是岗位考核，也可能是学业考试、资格、证书、合同、签证或程序条件。",
      "流年只讲相对大运新增了什么：是推进、受阻、延后、补条件、换路径、重新安排还是终止。没有终止证据时，不得写成彻底失败。",
      "感情成为候选领域时，分别判断相处质量、现实障碍和长期可行性；关系融洽与婚姻可落地不是同一件事。",
      "环境变化可写成异地、跨城市、远程、海外、回归原环境或生活方式重组等宽场景，但不得断定具体地点。",
      "现实领域由你根据全部事实自行排序，只展开一至三个证据真正汇合的领域；不凑领域。",
      "每个主要领域必须给出：命理原因、主表现、替代分支、成立条件和现实验证问题。",
      "现实验证点必须是真实生活问题，不能写成天干、地支、层级、化气等方法说明。",
      "只用自然中文，不得输出英文枚举、JSON、字段名、评分、规则ID或证据ID。",
      "输出结构固定为：",
      "### 年度总判",
      "### 大运背景",
      "### 今年新增的作用",
      "### 最强现实落点",
      "### 机会与压力",
      "### 今年适合推进与不宜勉强",
      "### 现实验证点",
    ].join("\n"),
    user: JSON.stringify({
      task: "仅依据事实包与候选规则，由AI自行完成年度主次排序和现实化判断，生成当前流年报告。",
      factPack,
    }, null, 2),
    factPack,
    trustedPack: factPack,
    stageRulePack,
    evidenceIds: trustedPack.allowedEvidenceRefs,
  };
}
