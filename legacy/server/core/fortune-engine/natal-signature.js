import { elementLabel, loadFortuneRules, ruleMatchesTenGod, unique } from "./rule-data.js";

const eventLabels = {
  career: "事业",
  wealth: "财运",
  relationship: "感情",
  study: "学业",
  movement: "迁移",
  social: "人际",
  health: "健康",
  pressure: "压力",
  resource: "资源",
  support: "支持",
};

export function analyzeNatalSignature(chart, rules = loadFortuneRules()) {
  const tenGodEntries = Object.entries(chart.tenGodStats?.mainQi ?? {});
  const tenGodTags = tenGodEntries.flatMap(([tenGod, count]) => {
    if (!count) return [];
    return rules.tenGods.filter((rule) => ruleMatchesTenGod(rule, tenGod)).flatMap((rule) => rule.tags);
  });
  const visibleCounts = chart.elementStats?.visible?.counts ?? {};
  const elementEntries = Object.entries(visibleCounts).map(([element, count]) => ({ element, count: Number(count || 0) }));
  const max = Math.max(...elementEntries.map((item) => item.count), 0);
  const min = Math.min(...elementEntries.map((item) => item.count), max);
  const usefulElements = elementEntries.filter((item) => item.count === min).map((item) => elementLabel(item.element));
  const avoidElements = elementEntries.filter((item) => item.count === max && item.count > min).map((item) => elementLabel(item.element));
  const relationTags = (chart.relations ?? []).flatMap((relation) => {
    if (String(relation.type).includes("冲")) return ["movement", "pressure"];
    if (String(relation.type).includes("害")) return ["relationship", "health"];
    if (String(relation.type).includes("合")) return ["relationship", "wealth"];
    return [];
  });
  const natalTags = unique([...tenGodTags, ...relationTags]).map((tag) => eventLabels[tag] ?? tag);
  const riskAreas = unique([
    ...(relationTags.includes("pressure") ? ["压力"] : []),
    ...(relationTags.includes("health") ? ["健康"] : []),
    ...(relationTags.includes("relationship") ? ["感情"] : []),
    ...(tenGodTags.includes("wealth") && tenGodTags.includes("social") ? ["财运"] : []),
  ]);
  const baseStrength = strengthText(elementEntries, chart.relations ?? []);

  return {
    natalTags: natalTags.length ? natalTags : ["原局结构"],
    baseStrength,
    riskAreas: riskAreas.length ? riskAreas : ["压力"],
    usefulElements,
    avoidElements,
    evidence: [
      `主气十神：${tenGodEntries.map(([name, count]) => `${name}${count}`).join("、") || "暂无"}`,
      `明面五行：${elementEntries.map((item) => `${elementLabel(item.element)}${item.count}`).join("、")}`,
      `原局关系：${(chart.relations ?? []).map((item) => `${item.ganzhi?.join("/")}${item.type}`).join("、") || "未命中"}`,
    ],
  };
}

function strengthText(elementEntries, relations) {
  const counts = elementEntries.map((item) => item.count);
  const spread = Math.max(...counts, 0) - Math.min(...counts, 0);
  if (relations.length >= 3) return "结构牵动较多";
  if (spread >= 3) return "五行偏性较明显";
  return "结构相对均衡";
}
