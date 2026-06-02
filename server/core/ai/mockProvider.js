import { loadJson } from "../../utils/jsonLoader.js";

export function createMockProvider() {
  return {
    name: "mock",
    async generate({ prompt, storyTags = [] } = {}) {
      if (prompt?.mode) {
        const report = createMockFlowReport(prompt.mode);
        return {
          provider: "mock",
          text: report.summary,
          report,
        };
      }
      const mock = loadJson("data/mock/mock-ai-response.json");
      const yearTags = storyTags.filter((tag) => tag.period === "year").slice(0, 3).map((tag) => tag.tag);
      return {
        provider: "mock",
        text: mock.text.replace("{yearTags}", yearTags.join("、") || "年度观察标签"),
        sections: mock.sections,
      };
    },
  };
}

function createMockFlowReport(mode) {
  const labels = { luck: "大运阶段", year: "流年年度", month: "流月窗口" };
  const label = labels[mode] ?? labels.year;
  return {
    summary: `${label}报告：本地规则已列出候选取象，AI 层只做白话整理，不能单独作为结论。`,
    keySignals: [`${label}重点看五行、十神、干支关系是否被触发。`, "所有信号都来自本地排盘和矩阵证据。"],
    likelyThemes: ["现实事务、关系互动、工作节奏和情绪状态可作为观察方向。"],
    cautions: ["不要把单个流年或流月直接当成结果。", "关系、财务、身体等主题需要结合现实反馈验证。"],
    verificationLimits: ["需要结合原局、大运、流年、流月和实际经历继续验证。"],
  };
}
