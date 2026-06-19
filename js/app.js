import { createAppController } from "./app/appController.js";
import { defaultInput } from "./app/appState.js";

const roots = {
  birthDock: document.querySelector("#birthDock"),
  birthForm: document.querySelector("#birthForm"),
  birthSummary: document.querySelector("#birthSummary"),
  chartSummary: document.querySelector("#chartSummary"),
  baseBaziPanel: document.querySelector("#baseBaziPanel"),
  natalImagePanel: document.querySelector("#natalImagePanel"),
  natalAiNarrative: document.querySelector("#natalAiNarrative"),
  fortuneTransitPanel: document.querySelector("#fortuneTransitPanel"),
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
