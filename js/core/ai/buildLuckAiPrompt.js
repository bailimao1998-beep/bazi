import { buildStageAiTrustedPack } from "./buildStageAiTrustedPack.js";

export function buildLuckAiPrompt({
  baseBaziViewModel,
  natalImageReport,
  luckImageReport,
} = {}) {
  const luckItems = Array.isArray(luckImageReport?.luckItems)
    ? luckImageReport.luckItems
    : [];
  const currentLuckItem = luckItems.find((item) => item?.isCurrent) ?? luckItems[0] ?? null;

  const trustedPack = buildStageAiTrustedPack({
    stage: "luck",
    item: currentLuckItem,
    currentLuckItem,
    baseBaziViewModel,
    natalImageReport,
  });

  return {
    system: [
      "你是一名擅长把八字结构讲成人生阶段故事的传统命理师。",
      "浏览器已经完成排盘、十神、藏干、岁运干支和基础关系检测；trustedPack中的这些关系属于固定事实，不得重新排盘、补算或虚构。",
      "domainEvidenceCandidates 只是候选证据索引，不是领域分数、主线排序或最终结论。不得照搬前端旧评分。",
      "你的任务是先独立审查全部十二领域，再综合判断这步大运真正的主线、副线和证据不足处。",
      "本次只解释当前大运，不虚构具体流年和流月应期。",
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
      "每个领域都必须说明：",
      "1. 当前强度判断：强、中、弱或证据不足。",
      "2. 主要依据：只能使用 trustedPack 中真实存在的事实。",
      "3. 有利表现、压力表现和现实核实点。",
      "4. 没有直接证据时要明确写证据较弱，不得为了完整而编造事件。",
      "",
      "综合判断要求：",
      "1. 完成十二领域逐项分析后，再选二至三个真正最重要的领域作为十年主线。",
      "2. 主线轻重必须由你综合原局、大运直接触发、藏干和辅助事实判断，不得使用前端分数。",
      "3. storyPack 用于组织起步、发展、转折和落点，但同一事实只能完整讲一次。",
      "4. conditionalPatterns 只能写成条件分支，不得写成已成局、已化气或确定事件。",
      "5. 桃花、红鸾、天喜、驿马、贵人、文昌、禄神、藏干只能作为辅助，不能单独推出恋爱、婚姻、升职、搬家或发财。",
      "",
      "事实边界：",
      "1. 不得凭空补充事实包中不存在的冲合刑害破、伏吟、天克地冲、宫位触发或具体职业。",
      "2. 不得使用注定、必然、百分之百、一定发生等绝对措辞。",
      "3. 不得确定断具体金额、疾病、死亡、灾祸、牢狱、婚期、投资收益或法律结果。",
      "4. 不要展示 JSON、英文变量名或内部证据 ID。",
      "",
      "输出结构固定为：",
      "### 十年总断",
      "### 十二领域逐项分析",
      "必须按上述十二个名称逐项输出，不得合并或遗漏。",
      "### 这步大运的故事怎样展开",
      "### 真正需要抓住的主线",
      "### 有利一面怎样利用",
      "### 不利一面怎样提前规避",
      "### 现实验证点",
    ].join("\n"),
    user: JSON.stringify({
      task: "依据硬事实独立分析当前大运的十二领域，再综合形成十年主线、故事和趋吉避凶建议。",
      trustedPack,
    }, null, 2),
    trustedPack,
    evidenceIds: trustedPack.allowedEvidenceRefs,
    maxTokens: 7000,
  };
}
