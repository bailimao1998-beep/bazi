import { loadJson } from "../../utils/jsonLoader.js";
import { buildReadableAiReportFromPrompt } from "../story/eventCandidates.js";

export function createMockProvider() {
  return {
    name: "mock",
    async generate({ prompt, storyTags = [] } = {}) {
      if (prompt?.mode) {
        const report = buildReadableAiReportFromPrompt(prompt);
        return {
          provider: "mock",
          text: report.coreConclusion,
          report,
          isPlaceholder: true,
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
