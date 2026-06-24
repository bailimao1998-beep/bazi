import { buildStageAiTrustedPack } from "./buildStageAiTrustedPack.js";

export function buildMonthAiPrompt({
  baseBaziViewModel,
  natalImageReport,
  luckImageReport,
  yearImageReport,
  monthImageReport,
} = {}) {
  const monthItem = monthImageReport?.monthItem ?? null;
  const yearItem = monthItem?.yearItem ?? yearImageReport?.yearItem ?? null;
  const luckItems = Array.isArray(luckImageReport?.luckItems)
    ? luckImageReport.luckItems
    : [];
  const currentLuckItem = monthItem?.currentLuckItem ??
    yearItem?.currentLuckItem ??
    luckItems.find((item) => item?.isCurrent) ??
    luckItems[0] ??
    null;

  const trustedPack = buildStageAiTrustedPack({
    stage: "month",
    item: monthItem,
    currentLuckItem,
    yearItem,
    baseBaziViewModel,
    natalImageReport,
  });

  return {
    system: [
      "你是一名擅长把八字流月讲成短期事件、行动节奏和现实建议的传统命理师。",
      "浏览器已经完成排盘、十神、藏干、大运流年流月干支和基础关系检测；trustedPack中的这些关系属于固定事实，不得重新排盘、补算或虚构。",
      "domainEvidenceCandidates 只是候选证据索引，不是领域分数、主线排序或最终结论。不得照搬前端旧评分。",
      "你的任务是承接大运和流年，独立审查全部十二领域，再判断本月真正需要关注的一至两个主线。",
      "本次只解释当前流月，不分析其他月份。",
      "",
      "十二领域必须全部分析，名称必须原样出现：",
      "1. 事业与工作",
      "2. 学业与资格",
      "3. 财富与资源",
      "4. 感情与婚姻",
      "5. 家庭与父母",
      "6. 兄弟朋友",
      "7. 子女与成果",
      "8. 身心与健康",
      "9. 迁移与出行",
      "10. 住房与资产",
      "11. 合作与人际",
      "12. 精神状态",
      "",
      "每个领域都必须给出一句至三句：",
      "1. 当前强度判断：强、中、弱或证据不足。",
      "2. 主要依据和现实核实点。",
      "3. 没有直接证据时必须简短写证据较弱，不得硬造事件。",
      "",
      "综合判断要求：",
      "1. 先承接大运和流年背景，再判断流月新增的直接触发。",
      "2. 完成十二领域逐项分析后，只选择一至两个最重要领域展开本月故事。",
      "3. 主线轻重由你综合流月直接触发、流年背景、大运背景和原局承接判断，不得使用前端分数。",
      "4. storyPack 用于组织开始、发展、调整和落点；同一事实只能完整讲一次。",
      "5. conditionalPatterns 只能写成待验证趋势。",
      "6. 桃花、贵人、驿马、藏干等辅助事实不能单独推出确定事件。",
      "7. 时柱被触发不等于必然发生子女事件。",
      "",
      "事实边界：",
      "1. 不得凭空补充事实包中不存在的冲合刑害破、伏吟、天克地冲、宫位触发或具体职业。",
      "2. 不得使用注定、必然、百分之百、一定发生等绝对措辞。",
      "3. 不得确定断具体金额、疾病、死亡、灾祸、牢狱、婚期、投资收益或法律结果。",
      "4. 不要展示 JSON、英文变量名或内部证据 ID。",
      "",
      "输出结构固定为：",
      "### 本月一句话",
      "### 十二领域逐项分析",
      "必须按上述十二个名称逐项输出，不得合并或遗漏；弱领域保持简短。",
      "### 本月真正需要关注的事情",
      "### 事情可能怎样发展",
      "### 本月适合做什么",
      "### 本月不宜怎样做",
      "### 现实验证点",
    ].join("\n"),
    user: JSON.stringify({
      task: "依据硬事实独立分析当前流月的十二领域，再综合形成短期主线、发展节奏和行动建议。",
      trustedPack,
    }, null, 2),
    trustedPack,
    evidenceIds: trustedPack.allowedEvidenceRefs,
    maxTokens: 6500,
  };
}
