import { buildStageAiTrustedPack } from "./buildStageAiTrustedPack.js";
import { buildStageAiFactPack } from "./buildStageAiFactPack.js";
import { buildStageRulePack } from "../transit/buildStageRulePack.js";

export function buildMonthAiPrompt({
  baseBaziViewModel,
  natalImageReport,
  luckImageReport,
  yearImageReport,
  monthImageReport,
} = {}) {
  const monthItem = monthImageReport?.monthItem ?? null;
  const yearItem = monthItem?.yearItem ?? yearImageReport?.yearItem ?? null;
  const luckItems = Array.isArray(luckImageReport?.luckItems) ? luckImageReport.luckItems : [];
  const currentLuckItem = monthItem?.currentLuckItem ?? yearItem?.currentLuckItem ?? luckItems.find((item) => item?.isCurrent) ?? luckItems[0] ?? null;
  const trustedPack = buildStageAiTrustedPack({
    stage: "month",
    item: monthItem,
    currentLuckItem,
    yearItem,
    baseBaziViewModel,
    natalImageReport,
  });
  const stageRulePack = buildStageRulePack({
    stage: "month",
    item: monthItem,
    domainKeys: [],
  });
  const factPack = buildStageAiFactPack({
    stage: "month",
    trustedPack,
    stageRulePack,
  });

  return {
    system: [
      "你是八字命理系统的流月综合判断层。前端只提供原局、大运、流年、流月的硬事实和候选规则，不替你决定现实领域。",
      "不得重新排盘，不得补造未提供的干支关系。",
      "不要读取或沿用前端生成的领域排名、固定报告标题、机会压力、行动建议或现实场景结论；这些内容没有作为本轮输入提供。",
      "判断顺序必须是：大运背景 → 流年年度框架 → 流月新增事实 → 本月直接作用 → 候选规则 → 短期执行落点。",
      "同一组干支参与者产生的多个结构标签要先合并，不得把同源合、破、冲等分别当作多条证据。",
      "流月只讲短期动作、竞争、沟通、调整、推进、停顿、重排和收尾，不得写成缩小版大运或流年。",
      "宫位只提示可能范围，不能仅因某柱被触发就直接认定家庭、感情、事业、客户或健康事件。",
      "现实领域由你根据全部事实自行排序，最多展开两个证据真正汇合的短期落点；没有强触发时直接写平稳延续。",
      "关系只写本月沟通、时间安排、边界、见面、费用或现实条件协商，不得直接断结婚、分手或长期结果。",
      "任务受阻只写调整、补充、延后、重排或观察，不得上升为长期失败。",
      "现实验证点和行动建议必须对应本月可观察事项，不能复述命理方法。",
      "只用自然中文，不得输出英文枚举、JSON、字段名、评分、规则ID或证据ID。",
      "输出结构固定为：",
      "### 本月主线",
      "### 承接年度背景",
      "### 本月新增触发",
      "### 现实落点",
      "### 行动节奏",
      "### 需要留意",
    ].join("\n"),
    user: JSON.stringify({
      task: "仅依据事实包与候选规则，由AI自行完成短期主次排序和现实化判断，生成当前流月报告。",
      factPack,
    }, null, 2),
    factPack,
    trustedPack: factPack,
    stageRulePack,
    evidenceIds: trustedPack.allowedEvidenceRefs,
  };
}
