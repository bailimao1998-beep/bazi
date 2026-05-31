import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = path.join(repoRoot, "data");
const sourceDir = path.join(dataDir, "source");

const DATASETS = [
  ["sources", "00-来源-sources.json", "来源清单"],
  ["stemsBranches", "01-天干地支-stems-branches.json", "天干地支"],
  ["fiveElements", "02-五行强弱-five-elements.json", "五行强弱"],
  ["tenGods", "03-十神-ten-gods.json", "十神"],
  ["combinations", "04-合冲刑害破-combinations.json", "合冲刑害破"],
  ["twelveStages", "05-十二长生-twelve-stages.json", "十二长生"],
  ["systemRules", "06-程序规则-system-rules.json", "程序规则"],
  ["blindCases", "07-盲派候选-blind-cases.json", "盲派候选"],
  ["strengthModel", "08-力量模型-strength-model.json", "力量模型"],
  ["patternsUsefulGods", "09-格局用神-patterns-useful-gods.json", "格局用神"],
  ["blindCoreMethods", "11-盲派核心方法-blind-core-methods.json", "盲派核心方法"],
  ["outputTemplates", "12-输出主题模板-output-templates.json", "输出主题模板"],
  ["locations", "13-城市经纬度-locations.json", "城市经纬度"],
  ["caseStudies", "14-案例库-case-studies.json", "案例库"],
  ["aiPrompts", "15-AI分析模板-ai-prompts.json", "AI分析模板"],
  ["referenceKnowledge", "16-参考资料知识卡-reference-cards.json", "参考资料知识卡"],
];

async function readJson(fileName) {
  return JSON.parse(await fs.readFile(path.join(sourceDir, fileName), "utf8"));
}

function countEntries(data) {
  if (Array.isArray(data)) return data.length;
  if (!data || typeof data !== "object") return 0;
  return Object.values(data).reduce((total, value) => {
    if (Array.isArray(value)) return total + value.length;
    if (value && typeof value === "object") {
      if (Array.isArray(value.rules)) return total + value.rules.length;
      if (Array.isArray(value.list)) return total + value.list.length;
      if (value.matrix && typeof value.matrix === "object") return total + Object.keys(value.matrix).length;
    }
    return total;
  }, 0);
}

async function main() {
  const datasets = {};
  const manifest = [];

  for (const [bundleKey, file, title] of DATASETS) {
    const data = await readJson(file);
    datasets[bundleKey] = data;
    manifest.push({
      bundleKey,
      file: `source/${file}`,
      title,
      status: data._meta?.status ?? "unknown",
      entryCount: countEntries(data),
    });
  }

  const bundle = {
    _meta: {
      file: "bazi-data-bundle.json",
      title: "八字数据整合包",
      purpose: "single_runtime_bundle",
      description: "页面和本地 AI 优先读取这个整合包；data/source/ 保留可维护的分模块源数据。",
      generatedAt: new Date().toISOString(),
      sourceDirectory: "source/",
      datasetCount: DATASETS.length,
    },
    manifest,
    datasets,
  };

  await fs.writeFile(path.join(dataDir, "bazi-data-bundle.json"), `${JSON.stringify(bundle, null, 2)}\n`, "utf8");
  console.log(`Wrote data/bazi-data-bundle.json with ${DATASETS.length} datasets.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
