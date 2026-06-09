import { storyToneConfig } from "./storyToneConfig.js";

const forbiddenWords = ["一定", "必定", "绝对", "必然", "必离婚", "必发财", "必有灾", "必坐牢", "必死亡"];

export function buildNarrativePrompt({ chart, yearInfluence, monthInfluences = [], storyTags = [], tone = "default" } = {}) {
  return {
    system: [
      "你是命理剧情解读系统的叙事层。",
      "不能重新排盘，不能新增命盘信息，不能自行判断年份月份。",
      "只能根据本地 chartJson、yearInfluence、monthInfluences、storyTags 讲成故事。",
      `语气：${storyToneConfig[tone]?.tone ?? storyToneConfig.default.tone}`,
      `禁用词：${forbiddenWords.join("、")}`,
    ].join("\n"),
    user: JSON.stringify({
      chartJson: chart,
      yearInfluence,
      monthInfluences,
      storyTags,
      output: {
        sections: ["基础盘", "年度主线", "12个月剧情", "关键月份", "建议"],
        style: "有时间线，有情绪价值，但保留观察和验证语气。",
      },
    }, null, 2),
  };
}

export const flowReportSchema = {
  type: "object",
  additionalProperties: false,
  required: ["summary", "keySignals", "likelyThemes", "cautions", "verificationLimits", "scenarios"],
  properties: {
    summary: { type: "string" },
    keySignals: { type: "array", items: { type: "string" } },
    likelyThemes: { type: "array", items: { type: "string" } },
    cautions: { type: "array", items: { type: "string" } },
    verificationLimits: { type: "array", items: { type: "string" } },
    scenarios: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["title", "evidence", "lifeSignals", "verification", "boundary"],
        properties: {
          title: { type: "string" },
          evidence: { type: "array", items: { type: "string" } },
          lifeSignals: { type: "array", items: { type: "string" } },
          verification: { type: "array", items: { type: "string" } },
          boundary: { type: "string" },
        },
      },
    },
  },
};

export function buildFlowNarrativePrompt({
  mode = "year",
  chart,
  coreSignals,
  transitSignals,
  monthSignals,
  selectedLuck,
  yearInfluence,
  selectedMonthInfluence,
  tone = "default",
} = {}) {
  const modeLabels = { luck: "大运阶段取象", year: "流年年度取象", month: "流月短期取象" };
  const scenarioRules = {
    luck: "scenarios 输出 3-5 个长期背景候选，重在阶段底色、资源结构、关系结构、事业学习结构。",
    year: "scenarios 输出 3-5 个年度触发候选，重在这一年哪些主题更容易被点亮，以及被哪组岁运证据触发。",
    month: "scenarios 输出 2-4 个短期窗口候选，重在当月触发、节奏变化、临时事务和需要复核的窗口。",
  };
  return {
    mode,
    schema: flowReportSchema,
    system: [
      "你是命理结构化学习网站的 AI 辅助取象层。",
      "输出要结合咨询型语言和专业证据链：先说用户能听懂的总览，再列命盘证据，再翻译成现实可观察主题。",
      "不能重新排盘，不能补充不存在的干支关系，不能自行改写年份月份。",
      "只能根据本地规则给出的 chart、coreSignals、transitSignals、monthSignals 和当前岁运选择来润色。",
      "禁止确定性断语，不能断吉凶，不能把候选信号写成最终断命。",
      "所有输出都要保留“不能单独作为结论”的学习型边界。",
      "每条重点都按“证据链 -> 生活翻译 -> 验证步骤”组织，不要只写抽象术语。",
      "生活翻译必须落到具体候选事象，例如工作职责变化、合同手续复核、收支安排、合作摩擦、搬动出行、作息体感波动。",
      "敏感提醒只写作息体感、流程合规、出行操作安全等复核清单，不写病名、官非结果、灾祸结果。",
      "禁止只输出“现实事务、关系互动、工作节奏、情绪状态”这类空泛合集。",
      "必须输出多候选方向：scenarios 是核心内容，每个候选方向都按“证据链 -> 生活落点 -> 验证条件 -> 边界”展开。",
      scenarioRules[mode] ?? scenarioRules.year,
      "每个 scenario 固定包含 title、evidence、lifeSignals、verification、boundary；boundary 必须说明不能单独作为结论。",
      "字段写法：summary=咨询总览；keySignals=专业证据链；likelyThemes=生活落点；cautions=边界提醒；verificationLimits=现实验证；scenarios=候选方向卡片。",
      `禁用词：${forbiddenWords.join("、")}`,
      `语气：${storyToneConfig[tone]?.tone ?? storyToneConfig.default.tone}；短句、白话、重点明确，但每个判断都必须回到证据。`,
      "只输出一个合法 JSON 对象，字段必须匹配 summary、keySignals、likelyThemes、cautions、verificationLimits、scenarios，不要输出 Markdown。",
    ].join("\n"),
    user: JSON.stringify({
      mode,
      modeLabel: modeLabels[mode] ?? modeLabels.year,
      chart,
      coreSignals,
      transitSignals,
      monthSignals,
      selectedLuck,
      yearInfluence,
      selectedMonthInfluence,
      output: {
        schema: "summary/keySignals/likelyThemes/cautions/verificationLimits/scenarios",
        scenarioRule: scenarioRules[mode] ?? scenarioRules.year,
        sections: {
          summary: "咨询总览：1-2句，说这一层岁运最值得观察的主线，不下结果判断。",
          keySignals: "专业证据链：3-5条，每条包含具体证据和它说明的候选观察点。",
          likelyThemes: "生活落点：把证据翻成现实中的具体候选事象，例如关系合作、工作职责、学习证照、钱与资源、迁动变化、作息体感、流程合规。",
          cautions: "边界提醒：说明哪些内容不能从当前证据单独推出。",
          verificationLimits: "现实验证：给出后续应结合哪些柱位、旺衰、十神、岁运或现实反馈继续看。",
          scenarios: {
            title: "候选方向名称，避免写成结论。",
            evidence: "证据链：列对应的十神、五行、干支关系、岁运触发证据。",
            lifeSignals: "生活落点：说明现实中可能表现为哪些具体候选事象，不要只写抽象主题。",
            verification: "验证条件：说明哪些现实反馈或结构条件出现时，更像这个候选方向。",
            boundary: "边界：说明不能单独推出什么结论，并写明不能单独作为结论。",
          },
        },
        style: "咨询型语言 + 专业证据链；每条尽量写成“证据链 -> 生活翻译 -> 验证步骤”。",
      },
    }, null, 2),
  };
}
