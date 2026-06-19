import { createAppController } from "./app/appController.js";
import { defaultInput } from "./app/appState.js";

const roots = {
  birthForm: document.querySelector("#birthForm"),
  chartSummary: document.querySelector("#chartSummary"),
  baseBaziPanel: document.querySelector("#baseBaziPanel"),
  natalImagePanel: document.querySelector("#natalImagePanel"),
  natalAiNarrative: document.querySelector("#natalAiNarrative"),
  fortuneTransitPanel: document.querySelector("#fortuneTransitPanel"),
  luckStageAnalysis: document.querySelector("#luckStageAnalysis"),
  yearStageAnalysis: document.querySelector("#yearStageAnalysis"),
  monthStageAnalysis: document.querySelector("#monthStageAnalysis"),
  floatingAssist: document.querySelector("#floatingAssist"),
  aiChatPanel: document.querySelector("#aiChatPanel"),
  aiChatToggle: document.querySelector("#aiChatToggle"),
  aiChatDrawer: document.querySelector("#aiChatDrawer"),
  aiChatClose: document.querySelector("#aiChatClose"),
  status: document.querySelector("#status"),
};

const app = createAppController({
  roots,
  initialInput: defaultInput,
});

app.init();
