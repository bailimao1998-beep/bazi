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
import { buildStageAdvice } from "../js/core/advice/stageAdviceEngine.js";
import {
  buildLuckEvidencePack,
  buildMonthEvidencePack,
  buildNatalEvidencePack,
  buildYearEvidencePack,
} from "../js/core/evidence/evidencePackBuilder.js";
import { buildLocalNarrative } from "../js/core/evidence/narrativeBuilder.js";
import {
  buildNatalMasterSummary,
  defaultMasterSummaryDatabase,
} from "../js/core/master-summary/masterSummaryEngine.js";
import { renderNatalImagePanel } from "../js/components/natalImagePanel.js";
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
  "js/core/domain/domainRuleDatabase.js",
  "js/core/domain/combinationRuleDatabase.js",
  "js/core/domain/domainEvidenceEngine.js",
  "js/core/domain/domainNarrativeEngine.js",
  "js/core/master-summary/masterSummaryEngine.js",
  "js/core/advice/stageAdviceData.js",
  "js/core/advice/stageAdviceEngine.js",
  "js/core/evidence/knowledgeBase.js",
  "js/core/evidence/evidencePackBuilder.js",
  "js/core/evidence/narrativeBuilder.js",
  "data/advice/stageAdvice.json",
  "data/rules/bazi/master-summary.json",
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
  const natalAiPanelSource = readFileSync("js/components/natalAiNarrativePanel.js", "utf8");
  const stageAdviceDataSource = readFileSync("js/core/advice/stageAdviceData.js", "utf8");
  const stageAdviceEngineSource = readFileSync("js/core/advice/stageAdviceEngine.js", "utf8");
  const knowledgeBaseSource = readFileSync("js/core/evidence/knowledgeBase.js", "utf8");
  const evidencePackSource = readFileSync("js/core/evidence/evidencePackBuilder.js", "utf8");
  const narrativeBuilderSource = readFileSync("js/core/evidence/narrativeBuilder.js", "utf8");
  const natalReportSource = readFileSync("js/core/blind-bazi/buildNatalImageReport.js", "utf8");
  const domainRuleSource = readFileSync("js/core/domain/domainRuleDatabase.js", "utf8");
  const combinationRuleSource = readFileSync("js/core/domain/combinationRuleDatabase.js", "utf8");
  const domainEvidenceSource = readFileSync("js/core/domain/domainEvidenceEngine.js", "utf8");
  const domainNarrativeSource = readFileSync("js/core/domain/domainNarrativeEngine.js", "utf8");
  const masterSummaryEngineSource = readFileSync("js/core/master-summary/masterSummaryEngine.js", "utf8");
  const masterSummaryJson = JSON.parse(readFileSync("data/rules/bazi/master-summary.json", "utf8"));
  const natalImagePanelSource = readFileSync("js/components/natalImagePanel.js", "utf8");
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
  assert.match(index, /<section class="stage-image-content" id="natalImagePanel"><\/section>\s*<section class="stage-ai-collapse stage-ai-below" id="natalAiNarrative"><\/section>/);
  assert.doesNotMatch(index, /<div class="stage-analysis-header">\s*<div>[\s\S]*?<\/div>\s*<section class="stage-ai-collapse" id="natalAiNarrative"><\/section>\s*<\/div>/);
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
  assert.match(appControllerSource, /renderNatalImagePanel\(roots\.natalImagePanel, store\.state\.natalImageReport, \{/);
  assert.match(appControllerSource, /buildLuckImageReport/);
  assert.match(appControllerSource, /buildYearImageReport/);
  assert.match(appControllerSource, /buildMonthImageReport/);
  assert.match(appControllerSource, /renderFortuneTransitPanel\(roots\.fortuneTransitPanel/);
  assert.match(appControllerSource, /renderStageAnalysisPanel\(roots\.luckStageAnalysis/);
  assert.match(appControllerSource, /renderStageAnalysisPanel\(roots\.yearStageAnalysis/);
  assert.match(appControllerSource, /renderStageAnalysisPanel\(roots\.monthStageAnalysis/);
  assert.match(appControllerSource, /buildLuckStageSelector/);
  assert.match(appControllerSource, /buildYearStageSelector/);
  assert.match(appControllerSource, /buildMonthStageSelector/);
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
  assert.match(fortuneTransitSource, /transit-context-pill/);
  assert.match(transitHierarchySource, /transit-card-ganzhi/);
  assert.match(transitHierarchySource, /transit-card-signal/);
  assert.match(transitHierarchySource + styles, /transit-selector-board/);
  assert.match(transitHierarchySource + styles, /transit-selector-row/);
  assert.match(transitHierarchySource + styles, /transit-select-card/);
  assert.match(styles, /grid-template-columns:\s*72px minmax\(0,\s*1fr\)/);
  assert.match(styles, /transit-select-card::before/);
  assert.match(styles, /transit-card-list::before/);
  assert.match(styles, /transit-select-card\.is-active \.transit-card-ganzhi/);
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
  assert.match(stageAnalysisSource, /buildLuckEvidencePack/);
  assert.match(stageAnalysisSource, /buildLocalNarrative/);
  assert.match(stageAnalysisSource + styles, /stage-local-narrative-card/);
  assert.match(stageAnalysisSource + styles, /stage-local-narrative-main/);
  assert.match(stageAnalysisSource + styles, /stage-local-evidence-chain/);
  assert.match(stageAnalysisSource + styles, /stage-local-review-details/);
  assert.match(stageAnalysisSource, /命理师讲盘/);
  assert.match(natalImagePanelSource, /buildNatalEvidencePack/);
  assert.match(natalImagePanelSource, /buildNatalMasterSummary/);
  assert.doesNotMatch(natalImagePanelSource, /buildLocalNarrative/);
  assert.match(natalImagePanelSource + styles, /natal-master-summary/);
  assert.match(natalImagePanelSource + styles, /natal-master-sections/);
  assert.match(natalImagePanelSource + styles, /natal-domain-section/);
  assert.match(natalImagePanelSource + styles, /natal-domain-card/);
  assert.match(natalImagePanelSource + styles, /natal-domain-grid/);
  assert.match(natalImagePanelSource + styles, /natal-domain-pressure/);
  assert.match(natalImagePanelSource + styles, /natal-hit-index/);
  assert.match(natalImagePanelSource + styles, /natal-hit-summary-chips/);
  assert.match(natalImagePanelSource + styles, /natal-hit-details/);
  assert.match(natalImagePanelSource + styles, /natal-hit-compact-list/);
  assert.match(natalImagePanelSource + styles, /natal-hit-row/);
  assert.match(natalImagePanelSource, /renderNatalDomainReport/);
  assert.match(natalImagePanelSource, /renderNatalHitListSection/);
  assert.match(natalImagePanelSource, /buildNatalHitList/);
  assert.match(natalImagePanelSource, /buildNatalAiEvidencePack/);
  assert.match(natalImagePanelSource, /buildNatalMasterSummary/);
  assert.match(natalImagePanelSource, /cleanCardText/);
  assert.doesNotMatch(natalImagePanelSource, /firstSentence\(domain\.judgement/);
  assert.doesNotMatch(natalImagePanelSource, /firstSentence\(domain\.manifestation/);
  assert.doesNotMatch(natalImagePanelSource, /function buildNatalMasterSummaryText/);
  assert.doesNotMatch(natalImagePanelSource, /function buildNatalRealityCompareText/);
  assert.match(natalImagePanelSource, /renderDomainEvidenceDetail/);
  assert.doesNotMatch(natalImagePanelSource, /renderProfessionalReviewPanel/);
  assert.doesNotMatch(natalImagePanelSource + styles, /natal-professional-review/);
  assert.match(natalImagePanelSource, /命理师总批/);
  assert.match(natalAiPanelSource, /AI 深度分析/);
  assert.match(natalAiPanelSource, /AI 会基于上方命局画像和命中取象清单扩展说明，不重新排盘。/);
  assert.match(natalAiPanelSource, /生成原局 AI 深度分析/);
  assert.match(natalReportSource, /buildTwelveDomainPortrait/);
  assert.match(natalReportSource, /twelveDomains:\s*buildTwelveDomainPortrait/);
  assert.doesNotMatch(natalReportSource, /function buildTwelveDomainCards/);
  assert.match(domainRuleSource, /export const domainRules/);
  assert.match(domainRuleSource, /key:\s*"self"/);
  assert.match(domainRuleSource, /key:\s*"fortune"/);
  assert.match(domainRuleSource, /命主自身/);
  assert.match(domainRuleSource, /福德精神/);
  assert.match(combinationRuleSource, /export const combinationRules/);
  assert.ok((combinationRuleSource.match(/id:\s*"/g) || []).length >= 20);
  for (const label of [
    "比劫重而财星不显",
    "比劫重而财星有迹",
    "印星明显而食伤弱",
    "印星明显而食伤明显",
    "官杀明显而印星承接",
    "官杀明显而伤官明显",
    "财星明显而比劫明显",
    "食伤明显而财星有迹",
    "食伤明显而官杀有压力",
    "日支被冲",
    "日支被合",
    "日支被刑害破",
    "年月被冲合刑害",
    "时柱食伤明显",
    "时柱被冲",
    "土气明显而财印有迹",
    "水气明显而寒湿感较重",
    "火弱或火受制",
    "五行流通较好",
    "五行偏颇明显",
  ]) {
    assert.match(combinationRuleSource, new RegExp(label));
  }
  assert.match(domainEvidenceSource, /export function buildDomainEvidence/);
  assert.match(domainEvidenceSource, /domainRules/);
  assert.match(domainEvidenceSource, /combinationRules/);
  assert.match(domainNarrativeSource, /export function buildTwelveDomainPortrait/);
  assert.match(domainNarrativeSource, /function buildDomainHumanTitle/);
  assert.match(domainNarrativeSource, /function buildDomainFrontText/);
  assert.match(domainNarrativeSource, /function pickPrimaryCombinationForDomain/);
  assert.match(domainNarrativeSource, /pressure/);
  assert.match(domainNarrativeSource, /buildDomainEvidence/);
  assert.match(domainNarrativeSource, /domainRules/);
  assert.match(masterSummaryEngineSource, /export function buildNatalMasterSummary/);
  assert.match(masterSummaryEngineSource, /export async function loadMasterSummaryDatabase/);
  assert.match(masterSummaryEngineSource, /function buildMasterSections/);
  assert.match(masterSummaryEngineSource, /function composeMasterHeadline/);
  assert.match(masterSummaryEngineSource, /defaultMasterSummaryDatabase/);
  assert.ok(Array.isArray(masterSummaryJson.rules));
  assert.ok(masterSummaryJson.rules.length >= 7);
  for (const rule of masterSummaryJson.rules) {
    assert.ok(rule.id);
    assert.ok(rule.label);
    assert.ok(Array.isArray(rule.hitKeywords));
    assert.ok(Array.isArray(rule.domains));
    assert.ok(Number.isFinite(rule.priority));
    assert.ok(rule.headline);
    assert.ok(rule.paragraph);
    assert.ok(rule.reality);
    assert.ok(rule.boundary);
    assert.doesNotMatch(JSON.stringify(rule), /一定|必定|绝对|必然|必离婚|必发财|必有灾|必坐牢|必死亡/);
  }
  assert.match(knowledgeBaseSource, /比劫重/);
  assert.match(knowledgeBaseSource, /印星透/);
  assert.match(knowledgeBaseSource, /财星弱/);
  assert.match(knowledgeBaseSource, /clientTalk/);
  assert.match(evidencePackSource, /命中取象/);
  assert.match(evidencePackSource, /资料解释/);
  assert.match(evidencePackSource, /成立条件/);
  assert.match(evidencePackSource, /反证/);
  assert.match(evidencePackSource, /现实取象/);
  assert.match(narrativeBuilderSource, /资料解释/);
  assert.match(narrativeBuilderSource, /成立条件/);
  assert.match(narrativeBuilderSource, /反证边界/);
  assert.match(narrativeBuilderSource, /师傅复核点/);
  assert.match(stageAnalysisSource, /stageAdviceEngine/);
  assert.match(stageAnalysisSource + styles, /stage-analysis-header/);
  assert.match(stageAnalysisSource + styles, /ai-collapse-card/);
  assert.match(stageAnalysisSource, /AI 原局分析结果|AI 大运分析结果|AI 流年分析结果|AI 流月分析结果/);
  assert.match(stageAnalysisSource, /stage-evidence-list/);
  assert.match(stageAnalysisSource, /stage-advice-card/);
  assert.match(stageAnalysisSource, /stage-advice-list/);
  assert.match(stageAnalysisSource, /buildStageAdvice/);
  assert.doesNotMatch(stageAnalysisSource, /function stageMainAdvice|function stageRealityAdvice/);
  assert.match(stageAdviceDataSource, /stageRules/);
  assert.match(stageAdviceDataSource, /tenGodRules/);
  assert.match(stageAdviceDataSource, /relationRules/);
  assert.match(stageAdviceDataSource, /confidenceRules/);
  assert.match(stageAdviceEngineSource, /export function buildStageAdvice/);
  assert.match(stageAdviceEngineSource, /function detectRelationType/);
  assert.match(stageAdviceEngineSource, /function joinSentence/);
  assert.match(stageAnalysisSource, /stage-overview-card/);
  assert.match(stageAnalysisSource, /stage-detail-grid/);
  assert.match(stageAnalysisSource, /stage-side-stack/);
  assert.match(stageAnalysisSource, /renderStageLocalSelector/);
  assert.match(stageAnalysisSource, /stage-local-selector/);
  assert.match(stageAnalysisSource, /data-stage-selector/);
  assert.match(stageAnalysisSource, /onSelectStageValue/);
  assert.match(stageAnalysisSource, /<section class="stage-ai-collapse stage-ai-below">/);
  assert.doesNotMatch(stageAnalysisSource, /<div class="stage-analysis-tools">[\s\S]*?renderAiCollapse\(\{[\s\S]*?<\/div>\s*<\/div>\s*<section class="stage-image-content">/);
  assert.match(styles, /\.stage-ai-below/);
  assert.match(styles, /\.stage-analysis-header\s*\{\s*display:\s*block/);
  assert.match(stageAnalysisSource + styles, /transit-evidence-mini-grid/);
  assert.match(styles, /\.stage-detail-grid/);
  assert.match(styles, /\.stage-side-stack/);
  assert.match(styles, /\.stage-local-selector/);
  assert.match(styles, /\.stage-advice-card/);
  assert.match(stageAnalysisSource + styles, /transit-detail-chips/);
  assert.match(stageAnalysisSource + styles, /transit-signal-pills/);
  assert.match(stageAnalysisSource, /formatRelationEvidence/);
  assert.match(stageAnalysisSource, /ai-collapse-toolbar/);
  assert.match(stageAnalysisSource, /ai-collapse-status/);
  assert.match(stageAnalysisSource, /ai-collapse-summary-action/);
  assert.match(styles, /\.ai-collapse-action-only/);
  assert.match(styles, /min-height:\s*44px/);
  assert.match(styles, /\.ai-collapse-card > summary/);
  assert.match(styles, /\.stage-ai-below \.ai-collapse-output/);
  assert.match(floatingAssistSource + styles, /floating-assist/);
  assert.match(floatingAssistSource, /shenshaImageMap/);
  assert.match(floatingAssistSource, /getShenshaImage/);
  assert.match(floatingAssistSource, /data-shensha-name/);
  assert.match(floatingAssistSource, /data-pillar-name/);
  assert.match(floatingAssistSource, /data-pillar-value/);
  assert.match(floatingAssistSource, /assist-detail-card/);
  assert.match(floatingAssistSource, /data-assist-detail-close/);
  assert.match(floatingAssistSource, /handleEscape/);
  assert.match(floatingAssistSource, /handleOutsideClick/);
  assert.match(floatingAssistSource, /document\.addEventListener\("keydown", handleEscape\)/);
  assert.match(floatingAssistSource, /document\.addEventListener\("pointerdown", handleOutsideClick\)/);
  assert.match(floatingAssistSource, /state\.luckImageReport|state\.yearImageReport|state\.monthImageReport/);
  assert.match(floatingAssistSource, /assist-relation-panel/);
  assert.match(floatingAssistSource, /renderRelationSummary/);
  assert.match(floatingAssistSource, /renderRelationFocus/);
  assert.match(floatingAssistSource, /dedupeRelations/);
  assert.match(floatingAssistSource, /detectRelationTags/);
  assert.match(floatingAssistSource, /relationImageByTags/);
  assert.match(floatingAssistSource, /assist-empty-compact/);
  assert.doesNotMatch(floatingAssistSource, /function renderRelationList/);
  assert.match(styles, /\.assist-relation-summary/);
  assert.match(styles, /\.assist-relation-card/);
  assert.match(styles, /\.assist-empty-compact/);
  assert.match(styles, /\.core-chart-assist \.floating-assist-drawer\s*\{[\s\S]*position:\s*fixed/);
  assert.match(styles, /\.core-chart-assist \.floating-assist-drawer\[hidden\]\s*\{[\s\S]*display:\s*none/);
  assert.match(styles, /\.core-chart-assist \.floating-assist-drawer\.is-open\s*\{[\s\S]*display:\s*grid/);
  assert.match(styles, /top:\s*72px/);
  assert.match(styles, /bottom:\s*24px/);
  assert.match(styles, /\.floating-assist-head\s*\{[\s\S]*position:\s*sticky/);
  assert.match(styles, /\.floating-assist-body\s*\{[\s\S]*overflow-y:\s*auto/);
  assert.match(styles, /\.assist-chip\.is-clickable/);
  assert.match(styles, /\.assist-detail-card/);
  assert.match(styles, /@media \(max-width:\s*700px\)[\s\S]*\.core-chart-assist \.floating-assist-drawer/);
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
  assert.equal(natalImageReport.twelveDomains.length, 12);
  assert.deepEqual(natalImageReport.twelveDomains.map((domain) => domain.label), [
    "命主自身",
    "父母家庭",
    "兄弟同辈",
    "夫妻感情",
    "子女结果",
    "财帛财富",
    "疾厄健康",
    "迁移环境",
    "交友人脉",
    "官禄事业",
    "田宅资产",
    "福德精神",
  ]);
  for (const domain of natalImageReport.twelveDomains) {
    assert.ok(domain.key);
    assert.ok(domain.title);
    assert.ok(domain.judgement);
    assert.ok(domain.manifestation);
    assert.ok(Array.isArray(domain.keywords));
    assert.ok(Array.isArray(domain.evidence));
    assert.ok(Array.isArray(domain.matchedCombinations));
    assert.ok(Array.isArray(domain.condition));
    assert.ok(domain.bookExplanation);
    assert.ok(Array.isArray(domain.counterEvidence));
    assert.match(domain.confidence, /^(high|medium|low)$/);
    assert.doesNotMatch(
      `${domain.judgement} ${domain.manifestation}`,
      /现实中可观察|需观察|需要观察|需复核|需要复核|需要结合|先看|再看|待查|不宜直接|资料取象中|成立条件|反证方式|命中来源|命中依据/,
    );
    assert.doesNotMatch(
      domain.title,
      /日支被冲|日支被合|比劫重而财星不显|印星明显而食伤明显|官杀明显而印星承接|食伤明显而财星有迹|五行偏颇明显/,
    );
    assert.ok(sentenceCount(domain.judgement) <= 2);
    assert.ok(sentenceCount(domain.manifestation) <= 2);
  }
  const selfDomain = natalImageReport.twelveDomains.find((domain) => domain.key === "self");
  const selfFrontText = `${selfDomain?.title ?? ""}${selfDomain?.judgement ?? ""}${selfDomain?.manifestation ?? ""}`;
  assert.ok(
    countMatchedTerms(selfFrontText, ["性格", "主见", "脾气", "节奏", "边界"]) >= 3,
    "命主自身正面文案要聚焦性格、主见、脾气、做事节奏和边界感",
  );
  const uniqueFrontTexts = new Set(natalImageReport.twelveDomains.map((domain) => `${domain.judgement} ${domain.manifestation}`));
  assert.ok(uniqueFrontTexts.size >= 10, "十二维卡片正面文案不应大面积复用同一套关系牵动话术");
  const masterSummary = buildNatalMasterSummary({
    summary: natalImageReport.summary,
    twelveDomains: natalImageReport.twelveDomains,
    hitList: [
      {
        name: "比劫重而财星不显",
        category: "组合象",
        brief: "自我、同辈、竞争合作和财务资源分配之间有牵连。",
        domains: ["命主自身", "兄弟同辈", "交友人脉", "财帛财富"],
        importance: "high",
      },
      {
        name: "日支被冲",
        category: "关系象",
        brief: "感情、环境和现实责任容易互相牵动。",
        domains: ["夫妻感情", "迁移环境", "疾厄健康"],
        importance: "medium",
      },
    ],
    database: defaultMasterSummaryDatabase,
  });
  assert.ok(masterSummary.headline);
  assert.ok(masterSummary.paragraph);
  assert.ok(masterSummary.realityLine);
  assert.deepEqual(masterSummary.sections.map((section) => section.key), [
    "main",
    "personality",
    "reality",
    "future",
  ]);
  assert.deepEqual(masterSummary.sections.map((section) => section.title), [
    "命局主线",
    "性格与能力",
    "现实牵动",
    "后续重点",
  ]);
  assert.ok(masterSummary.mainLines.length >= 2);
  assert.ok(masterSummary.mainLines.length <= 3);
  assert.ok(masterSummary.tags.length >= 2);
  assert.ok(masterSummary.evidence.length > 0);
  assert.match(masterSummary.paragraph, /这个盘|这个人|原局/);
  assert.match(masterSummary.realityLine, /现实/);
  assert.doesNotMatch(
    JSON.stringify(masterSummary),
    /观察入口|开盘先看|先看|再看|资料取象|命中依据|需复核|可观察/,
  );
  assert.ok(masterSummary.headline.length <= 28);
  assert.doesNotMatch(masterSummary.headline, /。$/);
  assert.notEqual(
    masterSummary.paragraph,
    natalImageReport.twelveDomains.slice(0, 3).map((domain) => domain.title).join(""),
  );
  assert.doesNotMatch(JSON.stringify(masterSummary), /一定|必定|绝对|必然|必离婚|必发财|必有灾|必坐牢|必死亡/);
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
  assert.match(root.innerHTML, /命理师讲盘/);
  assert.match(root.innerHTML, /stage-local-narrative-card/);
  assert.match(root.innerHTML, /stage-local-narrative-main/);
  assert.match(root.innerHTML, /stage-local-evidence-chain/);
  assert.match(root.innerHTML, /stage-local-review-details/);
  assert.ok(root.innerHTML.indexOf("stage-local-narrative-main") < root.innerHTML.indexOf("stage-local-evidence-chain"));
  assert.ok(root.innerHTML.indexOf("stage-local-evidence-chain") < root.innerHTML.indexOf("stage-local-review-details"));
  assert.match(root.innerHTML, /先看主线/);
  assert.match(root.innerHTML, /现实反馈/);
  assert.match(root.innerHTML, /复核边界/);
  assert.match(root.innerHTML, /反证提醒/);
  assert.match(root.innerHTML, /<section class="stage-image-content">[\s\S]*<section class="stage-ai-collapse stage-ai-below">/);
  assert.doesNotMatch(headerHtml(root.innerHTML), /stage-ai-collapse|ai-collapse-card|data-stage-ai-generate/);
  assert.doesNotThrow(() => renderStageAnalysisPanel(root, { report: yearImageReport, stage: "year" }));
  assert.match(root.innerHTML, /目标流年/);
  assert.match(root.innerHTML, /命理师讲盘/);
  assert.match(root.innerHTML, /当前流年建议/);
  assert.match(root.innerHTML, /<section class="stage-image-content">[\s\S]*<section class="stage-ai-collapse stage-ai-below">/);
  assert.doesNotMatch(headerHtml(root.innerHTML), /stage-ai-collapse|ai-collapse-card|data-stage-ai-generate/);
  assert.doesNotThrow(() => renderStageAnalysisPanel(root, { report: monthImageReport, stage: "month" }));
  assert.match(root.innerHTML, /目标流月/);
  assert.match(root.innerHTML, /命理师讲盘/);
  assert.match(root.innerHTML, /当前流月建议/);
  assert.match(root.innerHTML, /<section class="stage-image-content">[\s\S]*<section class="stage-ai-collapse stage-ai-below">/);
  assert.doesNotMatch(headerHtml(root.innerHTML), /stage-ai-collapse|ai-collapse-card|data-stage-ai-generate/);

  assert.doesNotThrow(() => renderNatalImagePanel(root, natalImageReport, { chart, baseBaziViewModel }));
  assert.match(root.innerHTML, /原局整体取象/);
  assert.match(root.innerHTML, /命理师总批/);
  assert.match(root.innerHTML, /natal-master-summary/);
  assert.match(root.innerHTML, /这个原局|这个人|现实中|容易|倾向/);
  const masterSummaryHtml = root.innerHTML.match(/<section class="natal-master-summary">[\s\S]*?<\/section>/)?.[0] ?? "";
  assert.match(masterSummaryHtml, /natal-master-sections/);
  assert.match(masterSummaryHtml, /命局主线/);
  assert.match(masterSummaryHtml, /性格与能力/);
  assert.match(masterSummaryHtml, /现实牵动/);
  assert.match(masterSummaryHtml, /后续重点/);
  assert.doesNotMatch(masterSummaryHtml, /同时[^。]+现实中容易带出|整体来看，|观察入口|开盘先看|先看|再看|资料取象|命中依据|需复核|可观察/);
  assert.match(masterSummaryHtml, /现实里|现实中/);
  assert.match(root.innerHTML, /十二维命局画像/);
  assert.match(root.innerHTML, /12 个方面/);
  assert.match(root.innerHTML, /natal-domain-section/);
  assert.match(root.innerHTML, /natal-domain-grid/);
  assert.match(root.innerHTML, /natal-domain-card/);
  assert.match(root.innerHTML, /natal-domain-index/);
  assert.match(root.innerHTML, /natal-domain-judgement/);
  assert.match(root.innerHTML, /natal-domain-manifestation/);
  assert.match(root.innerHTML, /natal-domain-pressure/);
  assert.match(root.innerHTML, /natal-domain-keywords/);
  assert.equal((root.innerHTML.match(/<article class="natal-domain-card/g) || []).length, 12);
  for (const label of natalImageReport.twelveDomains.map((domain) => domain.label)) {
    assert.match(root.innerHTML, new RegExp(label));
  }
  assert.match(root.innerHTML, /取象索引/);
  assert.match(root.innerHTML, /系统从四柱、十神、藏干、五行、关系和结构中提取到的主要取象/);
  assert.match(root.innerHTML, /natal-hit-index/);
  assert.match(root.innerHTML, /natal-hit-summary-chips/);
  assert.match(root.innerHTML, /natal-hit-details/);
  assert.match(root.innerHTML, /展开全部取象依据/);
  assert.doesNotMatch(root.innerHTML, /<details class="natal-hit-details" open/);
  assert.match(root.innerHTML, /natal-hit-compact-list/);
  assert.doesNotMatch(root.innerHTML, /重点取象|查看更多取象|natal-hit-more/);
  assert.match(root.innerHTML, /natal-hit-row/);
  assert.match(root.innerHTML, /natal-hit-domains/);
  assert.match(root.innerHTML, /依据/);
  assert.match(root.innerHTML, /natal-hit-evidence-button/);
  assert.doesNotMatch(root.innerHTML, /查看更多取象 <span>0 个<\/span>/);
  assert.equal((root.innerHTML.match(/<details class="natal-hit-details">/g) || []).length, 1);
  assert.match(root.innerHTML, /对应方面/);
  assert.match(root.innerHTML, /命盘依据/);
  assert.match(root.innerHTML, /命中组合/);
  assert.match(root.innerHTML, /成立条件/);
  assert.match(root.innerHTML, /资料解释/);
  assert.match(root.innerHTML, /现实对应/);
  assert.match(root.innerHTML, /反证方式/);
  assert.ok(root.innerHTML.indexOf("natal-master-summary") < root.innerHTML.indexOf("natal-domain-section"));
  assert.ok(root.innerHTML.indexOf("natal-domain-section") < root.innerHTML.indexOf("natal-hit-index"));
  assert.ok(root.innerHTML.indexOf("命盘依据") < root.innerHTML.indexOf("资料解释"));
  assert.ok(root.innerHTML.indexOf("资料解释") < root.innerHTML.indexOf("成立条件"));
  assert.ok(root.innerHTML.indexOf("成立条件") < root.innerHTML.indexOf("现实对应"));
  assert.ok(root.innerHTML.indexOf("现实对应") < root.innerHTML.indexOf("反证方式"));
  assert.ok(root.innerHTML.indexOf("natal-domain-card") < root.innerHTML.indexOf("命盘依据"));
  assert.doesNotMatch(root.innerHTML, /专业复核资料|natal-professional-review|专业推理链|完整取象依据|原局九项取象明细|natal-evidence-sequence-card|natal-image-evidence-card|natal-image-card-evidence-grid|重点提醒|natal-focus-summary|<details class="natal-full-evidence"|原局总论|关键取象摘要|natal-overview-hero|natal-keyword-section/);
});

test("evidence packs drive local narratives without AI or recalculation", () => {
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

  const packs = [
    buildNatalEvidencePack({ chart, baseBaziViewModel, natalImageReport }),
    buildLuckEvidencePack({ baseBaziViewModel, luckImageReport }),
    buildYearEvidencePack({ baseBaziViewModel, luckImageReport, yearImageReport }),
    buildMonthEvidencePack({ baseBaziViewModel, luckImageReport, yearImageReport, monthImageReport }),
  ];

  for (const pack of packs) {
    assert.ok(pack.stage);
    assert.ok(pack.title);
    assert.ok(Array.isArray(pack.hits));
    assert.ok(Array.isArray(pack.relations));
    assert.ok(Array.isArray(pack.aiContext["命中取象"]));
    assert.ok(Array.isArray(pack.aiContext["资料解释"]));
    assert.ok(Array.isArray(pack.aiContext["成立条件"]));
    assert.ok(Array.isArray(pack.aiContext["反证"]));
    assert.ok(Array.isArray(pack.aiContext["现实取象"]));
    assert.match(pack.aiContext.instruction, /不能重新排盘/);
    const narrative = buildLocalNarrative(pack);
    assert.deepEqual(narrative.sections.map((section) => section.title), [
      "命理师讲盘",
      "现实画面",
      "资料解释",
      "成立条件",
      "反证边界",
      "师傅复核点",
    ]);
    assert.match(narrative.sections[0].text, /呈现|这步大运|这个流年|这个流月|原局/);
    assert.doesNotMatch(narrative.sections[0].text, /主线先看|怎么验证|要看它在现实环境里怎么承接|资料解释：|成立条件：/);
    assert.match(narrative.sections.find((section) => section.title === "资料解释")?.text ?? "", /资料解释/);
    assert.match(narrative.sections.find((section) => section.title === "成立条件")?.text ?? "", /成立条件/);
    assert.match(narrative.sections.find((section) => section.title === "反证边界")?.text ?? "", /若|不直接|未必|反证|边界/);
    assert.match(narrative.sections.find((section) => section.title === "师傅复核点")?.text ?? "", /复核|验证|观察|现实反馈/);
    assert.doesNotMatch(JSON.stringify({ pack, narrative }), /\/api\/|generateWithDeepSeek|readAiSettings/);
  }

  const noRelationPack = buildLuckEvidencePack({
    luckImageReport: {
      luckItems: [{ ganZhi: "甲子", stemTenGod: "正印", branchTenGod: "比肩", confidence: "low" }],
    },
  });
  const noRelationNarrative = buildLocalNarrative(noRelationPack);
  assert.equal(noRelationPack.relations.length, 0);
  assert.match(noRelationNarrative.basis.join("；"), /暂无明显冲合刑害破触发/);
});

test("stage advice engine combines stage ten-god relation and confidence rules", () => {
  const advice = buildStageAdvice({
    stage: "year",
    item: { stemTenGod: "正官", confidence: "low" },
    relations: [{ description: "流年与原局见相冲，需要看被触发柱位。" }],
    confidence: "low",
  });

  assert.equal(advice.title, "当前流年建议");
  assert.deepEqual(advice.cards.map((card) => card.title), ["先看主线", "现实反馈", "复核边界", "反证提醒"]);
  assert.match(advice.cards[0].content, /流年用于观察/);
  assert.match(advice.cards[0].content, /规则、职位、责任/);
  assert.match(advice.cards[2].content, /冲/);
  assert.ok(advice.cards.every((card) => card.content.split(/[。！？；]/).filter(Boolean).length <= 2));
});

function headerHtml(html) {
  return html.match(/<div class="stage-analysis-header">[\s\S]*?<\/div>\s*<\/div>/)?.[0] ?? "";
}

function sentenceCount(text = "") {
  return String(text).split(/[。！？!?]/).filter((item) => item.trim()).length;
}

function countMatchedTerms(text = "", terms = []) {
  return terms.filter((term) => String(text).includes(term)).length;
}

function createRenderRoot() {
  return {
    innerHTML: "",
    querySelectorAll() {
      return [];
    },
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
