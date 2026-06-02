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
