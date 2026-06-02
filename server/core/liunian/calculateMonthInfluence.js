import { branchMainStem, getTenGod } from "../bazi/tenGods.js";
import { createMonthPillar } from "../bazi/pillarMath.js";

export function calculateMonthInfluence({ chart, targetYear = new Date().getFullYear(), month = 1 } = {}) {
  const pillar = createMonthPillar(Number(targetYear), Number(month), "流月");
  const stemTenGod = getTenGod(chart.dayMaster?.stem, pillar.stem);
  const branchTenGod = getTenGod(chart.dayMaster?.stem, branchMainStem(pillar.branch));
  return {
    year: Number(targetYear),
    month: Number(month),
    pillar,
    role: monthRole(month),
    tenGods: { stem: stemTenGod, branch: branchTenGod },
    evidence: [`${month}月${pillar.label}，适合作为${monthRole(month)}观察窗口。`],
    confidence: "medium",
    needVerify: ["流月用于细化时间线，需要结合流年和原局共同观察。"],
  };
}

function monthRole(month) {
  if ([1, 2, 3].includes(Number(month))) return "铺垫期";
  if ([4, 5, 6].includes(Number(month))) return "推进期";
  if ([7, 8, 9].includes(Number(month))) return "显化期";
  return "收束期";
}
