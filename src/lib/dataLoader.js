const DATA_BUNDLE = "data/bazi-data-bundle.json";

export async function loadBaziDatasets() {
  if (window.location.protocol === "file:") {
    throw new Error("直接打开 file:// 时浏览器禁止读取本地 JSON，请用内置基础规则渲染页面。");
  }

  const response = await fetch(DATA_BUNDLE);
  if (!response.ok) throw new Error(`无法读取 ${DATA_BUNDLE}: ${response.status}`);
  const bundle = await response.json();
  return bundle.datasets ?? {};
}

export function summarizeDatasets(datasets) {
  const ruleCount = datasets.systemRules?.rules?.length ?? 0;
  const basicRuleCount = datasets.systemRules?.basicInterpretationRules?.length ?? 0;
  const comboGroups = Object.values(datasets.combinations ?? {}).filter((value) => value?.rules?.length).length;
  const tenGods = datasets.tenGods?.tenGodDefinitions?.length ?? 0;
  const referenceCards = datasets.referenceKnowledge?.cards?.length ?? 0;
  return `已载入 ${ruleCount} 条程序规则、${basicRuleCount} 条基础解读规则、${comboGroups} 组组合关系、${tenGods} 个十神定义、${referenceCards} 张资料卡`;
}
