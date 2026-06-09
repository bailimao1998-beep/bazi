import { loadJson } from "../../utils/jsonLoader.js";
import { buildEventCandidateReportFromPrompt } from "../story/eventCandidates.js";

export function createMockProvider() {
  return {
    name: "mock",
    async generate({ prompt, storyTags = [] } = {}) {
      if (prompt?.mode) {
        const report = buildEventCandidateReportFromPrompt(prompt);
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
