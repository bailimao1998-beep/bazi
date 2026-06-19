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
  "js/components/birthSummary.js",
  "js/components/fortuneTransitPanel.js",
  "js/components/transitHierarchyPanel.js",
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
  const floatingAssistSource = readFileSync("js/components/floatingAssistPanel.js", "utf8");
  const styles = readFileSync("styles/layout.css", "utf8")
    + readFileSync("styles/fortune.css", "utf8")
    + readFileSync("styles/bazi-chart.css", "utf8")
    + readFileSync("styles/ai.css", "utf8")
    + readFileSync("styles/responsive.css", "utf8");

  assert.match(index, /<script src="js\/locationData\.js\?v=20260612b"><\/script>/);
  assert.match(index, /<script type="module" src="js\/app\.js\?v=20260613c"><\/script>/);
  assert.match(index, /id="birthForm"/);
  assert.match(index, /id="birthDock"/);
  assert.match(index, /id="birthSummary"/);
  assert.match(index, /id="coreWorkbench"/);
  assert.match(index, /id="chartSummary"/);
  assert.match(index, /class="core-workbench"/);
  assert.match(index, /class="transit-control-panel"/);
  assert.match(index, /class="core-chart-panel"/);
  assert.match(index, /id="floatingAssist"/);
  assert.match(index, /id="natalImagePanel"/);
  assert.match(index, /id="natalAiNarrative"/);
  assert.match(index, /id="fortuneTransitPanel"/);
  assert.match(index, /id="aiChatFloat"/);
  assert.match(index, /id="aiChatPanel"/);
  assert.match(index, /id="baseBaziPanel"/);
  assert.doesNotMatch(index, /legacy-stage-panels|data-fortune-tab|data-fortune-panel|id="luckImagePanel"|id="yearImagePanel"|id="monthImagePanel"|js\/app\.bundle\.js|index\.offline/);

  assert.match(appSource, /createAppController/);
  assert.match(appSource, /document\.querySelector\("#birthForm"\)/);
  assert.match(appSource, /document\.querySelector\("#birthSummary"\)/);
  assert.match(appSource, /document\.querySelector\("#birthDock"\)/);
  assert.match(appSource, /document\.querySelector\("#fortuneTransitPanel"\)/);
  assert.match(appSource, /document\.querySelector\("#floatingAssist"\)/);
  assert.doesNotMatch(appSource, /function renderChartSummary|function renderBaziMatrix|function renderBirthInfoStrip|function bindShenshaPopupEvents|function askAiQuestion|function generateNatalAiNarrative|function detectChatIntent|function escapeHtml|generateWithDeepSeek|readAiSettings/);

  assert.match(appControllerSource, /calculateBazi\(.*locations: .*locationCatalog/s);
  assert.match(appControllerSource, /buildBaseBaziViewModel\(chart\)/);
  assert.match(appControllerSource, /buildNatalImageReport\(\{ chart, baseBaziViewModel \}\)/);
  assert.match(appControllerSource, /buildLuckImageReport/);
  assert.match(appControllerSource, /buildYearImageReport/);
  assert.match(appControllerSource, /buildMonthImageReport/);
  assert.match(appControllerSource, /renderBirthSummary\(roots\.birthSummary/);
  assert.match(appControllerSource, /renderFortuneTransitPanel\(roots\.fortuneTransitPanel/);
  assert.match(appControllerSource, /renderFloatingAssistPanel\(roots\.floatingAssist/);
  assert.match(appControllerSource, /renderAiChatPanel\(roots\.aiChatPanel/);
  assert.match(chartSummarySource, /export function renderChartSummary/);
  assert.match(chartSummarySource, /命局骨架/);
  assert.match(chartSummarySource, /当前岁运摘要/);
  assert.match(chartSummarySource, /核心关系摘要/);
  assert.match(fortuneTransitSource, /renderTransitHierarchyPanel/);
  assert.match(transitHierarchySource + styles, /transit-hierarchy/);
  assert.match(transitHierarchySource + styles, /transit-column/);
  assert.match(transitHierarchySource + styles, /transit-node/);
  assert.match(floatingAssistSource + styles, /floating-assist/);
  assert.match(styles, /core-workbench/);
  assert.match(styles, /transit-control-panel/);
  assert.match(styles, /core-chart-panel/);
  assert.match(styles, /birth-dock-summary/);
  assert.match(aiActionsSource, /generateWithDeepSeek/);
  assert.match(aiActionsSource, /readAiSettings\(\{ includeSecret: true \}\)/);
  assert.match(chatActionsSource, /buildChatPrompt/);
  assert.match(chatActionsSource, /generateWithDeepSeek/);
  assert.doesNotMatch(appSource, /renderLuckImagePanel|renderYearImagePanel|renderMonthImagePanel|luckImagePanel|yearImagePanel|monthImagePanel|bindFortuneTabs|setActiveFortuneTab|activeFortuneTab|\/api\/|createAppServer/);
  assert.doesNotMatch(appControllerSource + aiActionsSource + chatActionsSource + chartSummarySource + fortuneTransitSource + transitHierarchySource + floatingAssistSource, /\/api\/chat|\/api\/narrative|createAppServer/);

  assert.doesNotMatch(styles, /\.section-tabs|\.fortune-tab-panel/);
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

test("legacy backups are documented and excluded from package files", () => {
  const legacyReadme = readFileSync("legacy/README.md", "utf8");
  const legacyIndex = readFileSync("legacy/index.offline.html", "utf8");
  const packageJson = JSON.parse(readFileSync("package.json", "utf8"));

  assert.match(legacyReadme, /不参与当前主链路/);
  assert.match(legacyReadme, /不进入正式打包/);
  assert.match(legacyIndex, /js\/app\.bundle\.js|app\.bundle\.js/);
  assert.equal(packageJson.build.files.some((item) => item.startsWith("legacy")), false);
});
