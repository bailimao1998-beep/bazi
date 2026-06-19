import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { calculateBazi } from "../js/core/bazi/calculateBazi.js";
import { buildBaseBaziViewModel } from "../js/core/bazi/buildBaseBaziViewModel.js";
import { buildNatalImageReport } from "../js/core/blind-bazi/buildNatalImageReport.js";
import { buildLuckImageReport } from "../js/core/blind-bazi/buildLuckImageReport.js";
import { buildYearImageReport } from "../js/core/blind-bazi/buildYearImageReport.js";
import { buildMonthImageReport } from "../js/core/blind-bazi/buildMonthImageReport.js";
import { renderStageAnalysisPanel } from "../js/components/stageAnalysisPanel.js";

const requiredPaths = [
  "electron/main.js",
  "index.html",
  "js/app.js",
  "js/app/appState.js",
  "js/app/appController.js",
  "js/app/aiActions.js",
  "js/app/chatActions.js",
  "js/app/yearQuestionUtils.js",
  "js/app/renderBaseError.js",
  "js/app/shenshaPopup.js",
  "js/locationData.js",
  "js/core/ai/deepseekClient.js",
  "js/core/ai/aiSettingsClient.js",
  "js/core/ai/buildChatPrompt.js",
  "js/core/ai/buildLuckAiPrompt.js",
  "js/core/ai/buildMonthAiPrompt.js",
  "js/core/ai/buildNatalAiPrompt.js",
  "js/core/ai/buildYearAiPrompt.js",
  "js/core/bazi/calculateBazi.js",
  "js/core/bazi/buildBaseBaziViewModel.js",
  "js/core/blind-bazi/buildNatalImageReport.js",
  "js/core/blind-bazi/buildLuckImageReport.js",
  "js/core/blind-bazi/buildYearImageReport.js",
  "js/core/blind-bazi/buildMonthImageReport.js",
  "js/components/birthForm.js",
  "js/components/fortuneTransitPanel.js",
  "js/components/transitHierarchyPanel.js",
  "js/components/stageAnalysisPanel.js",
  "js/components/floatingAssistPanel.js",
  "js/components/aiChatPanel.js",
  "js/components/chartSummary.js",
  "js/components/auxiliaryObservation.js",
  "js/utils/html.js",
  "styles/main.css",
  "config/ai-config.example.json",
  "tests/fixtures/mock-chart.json",
  "tests/fixtures/mock-year-story-tags.json",
  "tests/fixtures/mock-ai-response.json",
  ...readdirSync("data/rules/bazi")
    .filter((name) => name.endsWith(".json"))
    .sort()
    .map((name) => path.join("data/rules/bazi", name)),
];

test("required static Electron frontend paths exist", () => {
  for (const filePath of requiredPaths) {
    assert.ok(existsSync(filePath), `${filePath} should exist`);
  }

  assert.equal(existsSync("desktop"), false);
  assert.equal(existsSync("server"), false);
  assert.equal(existsSync("data/mock"), false);
  assert.equal(existsSync("index.offline.html"), false);
  assert.equal(existsSync("js/app.bundle.js"), false);
  assert.ok(existsSync("legacy/desktop"));
  assert.ok(existsSync("legacy/server"));
  assert.ok(existsSync("legacy/index.offline.html"));
  assert.ok(existsSync("legacy/app.bundle.js"));
});

test("package metadata points at the static Electron shell", () => {
  const packageJson = JSON.parse(readFileSync("package.json", "utf8"));

  assert.equal(packageJson.main, "electron/main.js");
  assert.equal(packageJson.scripts.start, "electron .");
  assert.equal(packageJson.scripts.test, "node --test tests/architecture.test.js");
  assert.equal(packageJson.scripts["dist:win"], "electron-builder --win nsis --publish never");
  assert.equal(packageJson.scripts["dist:win-portable"], "electron-builder --win portable --publish never");
  assert.deepEqual(packageJson.build.files, [
    "index.html",
    "styles/**/*",
    "js/**/*",
    "config/ai-config.example.json",
    "electron/**/*",
    "data/**/*",
  ]);
  assert.equal(packageJson.build.files.some((item) => item.startsWith("server")), false);
  assert.equal(packageJson.build.files.some((item) => item.startsWith("desktop")), false);
  assert.equal(packageJson.build.files.some((item) => item.startsWith("tests")), false);
  assert.equal(packageJson.build.files.some((item) => item.startsWith("legacy")), false);
});

test("index and app use only the current frontend panels", () => {
  const index = readFileSync("index.html", "utf8");
  const appSource = readFileSync("js/app.js", "utf8");
  const appControllerSource = readFileSync("js/app/appController.js", "utf8");
  const aiActionsSource = readFileSync("js/app/aiActions.js", "utf8");
  const chatActionsSource = readFileSync("js/app/chatActions.js", "utf8");
  const chartSummarySource = readFileSync("js/components/chartSummary.js", "utf8");
  const fortuneTransitSource = readFileSync("js/components/fortuneTransitPanel.js", "utf8");
  const transitHierarchySource = readFileSync("js/components/transitHierarchyPanel.js", "utf8");
  const stageAnalysisSource = readFileSync("js/components/stageAnalysisPanel.js", "utf8");
  const birthFormSource = readFileSync("js/components/birthForm.js", "utf8");
  const floatingAssistSource = readFileSync("js/components/floatingAssistPanel.js", "utf8");
  const styles = readFileSync("styles/layout.css", "utf8")
    + readFileSync("styles/form.css", "utf8")
    + readFileSync("styles/fortune.css", "utf8")
    + readFileSync("styles/bazi-chart.css", "utf8")
    + readFileSync("styles/natal.css", "utf8")
    + readFileSync("styles/ai.css", "utf8")
    + readFileSync("styles/responsive.css", "utf8");

  assert.match(index, /<script src="js\/locationData\.js\?v=20260612b"><\/script>/);
  assert.match(index, /<script type="module" src="js\/app\.js\?v=20260613c"><\/script>/);
  assert.match(index, /id="birthForm"/);
  assert.match(index, /id="fortuneTransitPanel"/);
  assert.match(index, /id="coreChartSection"/);
  assert.match(index, /id="chartSummary"/);
  assert.match(index, /id="floatingAssist"/);
  assert.match(index, /id="natalImagePanel"/);
  assert.match(index, /id="natalAiNarrative"/);
  assert.match(index, /id="luckStageAnalysis"/);
  assert.match(index, /id="yearStageAnalysis"/);
  assert.match(index, /id="monthStageAnalysis"/);
  assert.match(index, /id="baseBaziPanel"/);
  assert.match(index, /id="aiChatFloat"/);
  assert.match(index, /id="aiChatPanel"/);
  assert.match(index, /class="panel input-section"/);
  assert.match(index, /class="panel transit-selector-section"/);
  assert.match(index, /class="panel core-seven-chart-section"/);
  assert.doesNotMatch(index, /birthDock|birthSummary|coreWorkbench|transitAnalysisSection|transitStageAnalysisPanel|legacy-stage-panels|data-fortune-tab|data-fortune-panel|id="luckImagePanel"|id="yearImagePanel"|id="monthImagePanel"|js\/app\.bundle\.js|index\.offline/);

  assert.match(appSource, /createAppController/);
  assert.match(appSource, /document\.querySelector\("#birthForm"\)/);
  assert.match(appSource, /document\.querySelector\("#fortuneTransitPanel"\)/);
  assert.match(appSource, /document\.querySelector\("#floatingAssist"\)/);
  assert.match(appSource, /document\.querySelector\("#luckStageAnalysis"\)/);
  assert.match(appSource, /document\.querySelector\("#yearStageAnalysis"\)/);
  assert.match(appSource, /document\.querySelector\("#monthStageAnalysis"\)/);
  assert.doesNotMatch(appSource, /function renderChartSummary|function renderBaziMatrix|function renderBirthInfoStrip|function bindShenshaPopupEvents|function askAiQuestion|function generateNatalAiNarrative|function detectChatIntent|function escapeHtml|generateWithDeepSeek|readAiSettings/);
  assert.doesNotMatch(appSource, /birthDock|birthSummary/);

  assert.match(appControllerSource, /calculateBazi\(.*locations: .*locationCatalog/s);
  assert.match(appControllerSource, /buildBaseBaziViewModel\(chart\)/);
  assert.match(appControllerSource, /buildNatalImageReport\(\{ chart, baseBaziViewModel \}\)/);
  assert.match(appControllerSource, /buildLuckImageReport/);
  assert.match(appControllerSource, /buildYearImageReport/);
  assert.match(appControllerSource, /buildMonthImageReport/);
  assert.match(appControllerSource, /renderFortuneTransitPanel\(roots\.fortuneTransitPanel/);
  assert.match(appControllerSource, /renderStageAnalysisPanel\(roots\.luckStageAnalysis/);
  assert.match(appControllerSource, /renderStageAnalysisPanel\(roots\.yearStageAnalysis/);
  assert.match(appControllerSource, /renderStageAnalysisPanel\(roots\.monthStageAnalysis/);
  assert.match(appControllerSource, /renderFloatingAssistPanel\(roots\.floatingAssist/);
  assert.match(appControllerSource, /renderAiChatPanel\(roots\.aiChatPanel/);
  assert.match(chartSummarySource, /export function renderChartSummary/);
  assert.match(chartSummarySource + styles, /core-chart-matrix/);
  assert.match(chartSummarySource + styles, /core-matrix-scroll/);
  assert.match(chartSummarySource + styles, /core-matrix-grid/);
  assert.match(chartSummarySource + styles, /matrix-row-label/);
  assert.match(chartSummarySource + styles, /matrix-col-head/);
  assert.match(chartSummarySource + styles, /matrix-symbol/);
  assert.match(chartSummarySource + styles, /matrix-hidden-stems/);
  assert.match(chartSummarySource + styles, /core-chart-assist/);
  assert.match(chartSummarySource, /chart-topline/);
  assert.match(chartSummarySource, /bazi-matrix/);
  assert.match(chartSummarySource, /main-symbol-row/);
  assert.match(chartSummarySource, /bazi-symbol/);
  assert.match(chartSummarySource, /hidden-row/);
  assert.match(chartSummarySource, /polarityLabels/);
  assert.match(chartSummarySource, /symbolAttributeLabel/);
  assert.match(chartSummarySource, /elementClassForSymbol/);
  assert.match(chartSummarySource + styles, /matrix-symbol\.is-wood/);
  assert.match(styles, /minmax\(96px,\s*0\.78fr\)/);
  assert.match(styles, /minmax\(144px,\s*1\.08fr\)/);
  assert.doesNotMatch(chartSummarySource, /"神煞"|matrix-shensha|pillar-shensha|renderShenshaCell|relation-row|renderRelationCell/);
  assert.doesNotMatch(chartSummarySource + styles, /matrix-shensha|matrix-relation|is-shensha|is-relation/);
  assert.doesNotMatch(chartSummarySource, /core-seven-column|core-seven-grid/);
  assert.match(fortuneTransitSource, /renderTransitHierarchyPanel/);
  assert.match(fortuneTransitSource, /export function renderFortuneTransitPanel/);
  assert.match(transitHierarchySource + styles, /transit-selector-board/);
  assert.match(transitHierarchySource + styles, /transit-selector-row/);
  assert.match(transitHierarchySource + styles, /transit-select-card/);
  assert.match(birthFormSource + styles, /birth-form-compact/);
  assert.match(birthFormSource + styles, /birth-form-main-grid/);
  assert.match(birthFormSource + styles, /birth-form-inline-row/);
  assert.match(birthFormSource + styles, /birth-form-action-row/);
  assert.match(birthFormSource + styles, /birth-form-hint-row/);
  assert.match(birthFormSource + styles, /birth-field-date/);
  assert.match(birthFormSource + styles, /birth-form-heading/);
  assert.match(birthFormSource + styles, /birth-time-control/);
  assert.match(birthFormSource, /name="birthHour"/);
  assert.match(birthFormSource, /name="birthMinute"/);
  assert.match(birthFormSource, /formatBirthTime/);
  assert.match(birthFormSource, /getChineseHourLabel/);
  assert.match(styles, /@media \(max-width: 900px\)/);
  assert.match(styles, /@media \(max-width: 600px\)/);
  assert.match(stageAnalysisSource + styles, /stage-analysis-section/);
  assert.match(stageAnalysisSource + styles, /stage-analysis-header/);
  assert.match(stageAnalysisSource + styles, /ai-collapse-card/);
  assert.match(stageAnalysisSource, /AI 原局分析结果|AI 大运分析结果|AI 流年分析结果|AI 流月分析结果/);
  assert.match(stageAnalysisSource, /stage-evidence-list/);
  assert.match(stageAnalysisSource, /stage-relation-groups/);
  assert.match(stageAnalysisSource + styles, /transit-evidence-mini-grid/);
  assert.match(stageAnalysisSource + styles, /transit-detail-chips/);
  assert.match(stageAnalysisSource + styles, /transit-signal-pills/);
  assert.match(stageAnalysisSource, /formatRelationEvidence/);
  assert.match(floatingAssistSource + styles, /floating-assist/);
  assert.match(aiActionsSource, /generateWithDeepSeek/);
  assert.match(aiActionsSource, /readAiSettings\(\{ includeSecret: true \}\)/);
  assert.match(chatActionsSource, /buildChatPrompt/);
  assert.match(chatActionsSource, /generateWithDeepSeek/);
  assert.doesNotMatch(appSource, /renderLuckImagePanel|renderYearImagePanel|renderMonthImagePanel|luckImagePanel|yearImagePanel|monthImagePanel|bindFortuneTabs|setActiveFortuneTab|activeFortuneTab|\/api\/|createAppServer/);
  assert.doesNotMatch(appControllerSource + aiActionsSource + chatActionsSource + chartSummarySource + fortuneTransitSource + transitHierarchySource + floatingAssistSource + stageAnalysisSource, /\/api\/chat|\/api\/narrative|createAppServer/);

  assert.doesNotMatch(styles, /\.section-tabs|\.fortune-tab-panel/);
  assert.doesNotMatch(styles, /workbench-layout|core-sticky-panel|birth-dock-summary|core-workbench|transit-control-panel|core-chart-panel|transit-hierarchy|transit-column|transit-node|fortune-transit-grid|fortune-transit-card|inline-details/);
});

test("electron main serves index.html statically without desktop/server imports", () => {
  const electronMain = readFileSync("electron/main.js", "utf8");

  assert.match(electronMain, /BrowserWindow/);
  assert.match(electronMain, /createStaticServer/);
  assert.match(electronMain, /\/index\.html/);
  assert.match(electronMain, /loadURL\(url\)/);
  assert.match(electronMain, /path\.relative\(rootDir, filePath\)/);
  assert.match(electronMain, /path\.isAbsolute\(relativePath\)/);
  assert.doesNotMatch(electronMain, /filePath\.startsWith\(rootDir\)/);
  assert.match(electronMain, /nodeIntegration:\s*false/);
  assert.match(electronMain, /contextIsolation:\s*true/);
  assert.doesNotMatch(electronMain, /createAppServer|desktop|preload|server\/server|\/api\//);
});

test("frontend AI config and direct DeepSeek call stay in js/core/ai", () => {
  const settingsClient = readFileSync("js/core/ai/aiSettingsClient.js", "utf8");
  const deepseekClient = readFileSync("js/core/ai/deepseekClient.js", "utf8");
  const gitignore = readFileSync(".gitignore", "utf8");
  const exampleConfig = readFileSync("config/ai-config.example.json", "utf8");
  const exampleJson = JSON.parse(exampleConfig);

  assert.match(settingsClient, /fetch\("\/config\/ai-config\.json", \{ cache: "no-store" \}\)/);
  assert.match(settingsClient, /localStorage/);
  assert.match(settingsClient, /readAiSettings/);
  assert.match(settingsClient, /includeSecret/);
  assert.match(deepseekClient, /fetch\(endpoint/);
  assert.match(deepseekClient, /Authorization: `Bearer \$\{deepseek\.apiKey\}`/);
  assert.doesNotMatch(settingsClient + deepseekClient, /\/api\/chat|\/api\/narrative|server\/core|createAiProvider/);
  assert.match(gitignore, /config\/ai-config\.json/);
  assert.match(gitignore, /\.env/);
  assert.match(gitignore, /dist\//);
  assert.match(gitignore, /node_modules\//);
  assert.equal(exampleJson.deepseek.apiKey, "");
  assert.doesNotMatch(exampleConfig, /sk-/);
});

test("frontend bazi and blind-bazi chain calculates reports locally", () => {
  global.window = {};
  Function(readFileSync("js/locationData.js", "utf8"))();
  assert.equal(global.window.FortuneLocationData.cities.length, 3337);

  const chart = calculateBazi({
    birthDate: "1992-08-18",
    birthTime: "14:30",
    birthProvince: "北京市",
    birthplace: "北京",
    gender: "female",
    targetYear: 2026,
    selectedMonth: 6,
    trueSolarTime: true,
  }, {
    locations: global.window.FortuneLocationData,
  });
  const baseBaziViewModel = buildBaseBaziViewModel(chart);
  const natalImageReport = buildNatalImageReport({ chart, baseBaziViewModel });
  const luckImageReport = buildLuckImageReport({ chart, baseBaziViewModel, natalImageReport, targetYear: 2026 });
  const yearImageReport = buildYearImageReport({ chart, baseBaziViewModel, natalImageReport, luckImageReport, targetYear: 2026 });
  const monthImageReport = buildMonthImageReport({
    chart,
    baseBaziViewModel,
    natalImageReport,
    luckImageReport,
    yearImageReport,
    targetYear: 2026,
    selectedMonth: 6,
  });

  assert.ok(chart.pillars.year.label);
  assert.ok(baseBaziViewModel.pillars.length >= 4);
  assert.ok(natalImageReport.imageCards.length > 0);
  assert.ok(luckImageReport.luckItems.length > 0);
  assert.equal(yearImageReport.yearItem.year, 2026);
  assert.equal(monthImageReport.monthItem.month, 6);
});

test("stage analysis panels render calculated report data without breaking refresh", () => {
  global.window = {};
  Function(readFileSync("js/locationData.js", "utf8"))();

  const chart = calculateBazi({
    birthDate: "1992-08-18",
    birthTime: "14:30",
    birthProvince: "北京市",
    birthplace: "北京",
    gender: "female",
    targetYear: 2026,
    selectedMonth: 6,
    trueSolarTime: true,
  }, {
    locations: global.window.FortuneLocationData,
  });
  const baseBaziViewModel = buildBaseBaziViewModel(chart);
  const natalImageReport = buildNatalImageReport({ chart, baseBaziViewModel });
  const luckImageReport = buildLuckImageReport({ chart, baseBaziViewModel, natalImageReport, targetYear: 2026 });
  const yearImageReport = buildYearImageReport({ chart, baseBaziViewModel, natalImageReport, luckImageReport, targetYear: 2026 });
  const monthImageReport = buildMonthImageReport({
    chart,
    baseBaziViewModel,
    natalImageReport,
    luckImageReport,
    yearImageReport,
    targetYear: 2026,
    selectedMonth: 6,
  });
  const root = createRenderRoot();

  assert.doesNotThrow(() => renderStageAnalysisPanel(root, { report: luckImageReport, stage: "luck" }));
  assert.match(root.innerHTML, /当前大运/);
  assert.doesNotThrow(() => renderStageAnalysisPanel(root, { report: yearImageReport, stage: "year" }));
  assert.match(root.innerHTML, /目标流年/);
  assert.doesNotThrow(() => renderStageAnalysisPanel(root, { report: monthImageReport, stage: "month" }));
  assert.match(root.innerHTML, /目标流月/);
});

function createRenderRoot() {
  return {
    innerHTML: "",
    querySelector() {
      return { addEventListener() {} };
    },
  };
}

test("legacy backups are documented and excluded from package files", () => {
  const legacyReadme = readFileSync("legacy/README.md", "utf8");
  const legacyIndex = readFileSync("legacy/index.offline.html", "utf8");
  const packageJson = JSON.parse(readFileSync("package.json", "utf8"));

  assert.match(legacyReadme, /不参与当前主链路/);
  assert.match(legacyReadme, /不进入正式打包/);
  assert.match(legacyIndex, /js\/app\.bundle\.js|app\.bundle\.js/);
  assert.equal(packageJson.build.files.some((item) => item.startsWith("legacy")), false);
});
