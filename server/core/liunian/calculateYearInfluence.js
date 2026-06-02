import { branchMainStem, getTenGod } from "../bazi/tenGods.js";
import { createPillarFromYear } from "../bazi/pillarMath.js";

export function calculateYearInfluence({ chart, targetYear = new Date().getFullYear() } = {}) {
  const pillar = createPillarFromYear(Number(targetYear), "流年");
  const stemTenGod = getTenGod(chart.dayMaster?.stem, pillar.stem);
  const branchTenGod = getTenGod(chart.dayMaster?.stem, branchMainStem(pillar.branch));
  const relationHits = Object.values(chart.pillars ?? {})
    .filter((natalPillar) => natalPillar.branch === pillar.branch || natalPillar.stem === pillar.stem)
    .map((natalPillar) => ({
      type: natalPillar.branch === pillar.branch ? "伏吟观察" : "同干观察",
      target: natalPillar.role,
      evidence: `${pillar.label} 与 ${natalPillar.role}${natalPillar.label}形成同象观察点`,
      confidence: "medium",
      needVerify: ["流年关系触发为观察信号，需要结合原局、大运、流月继续验证。"],
    }));
  return {
    year: Number(targetYear),
    pillar,
    tenGods: { stem: stemTenGod, branch: branchTenGod },
    relationHits,
    evidence: [`流年${pillar.label}，天干为${stemTenGod}，地支主气为${branchTenGod}`],
    confidence: "medium",
    needVerify: ["流年只提供触发观察点，不能单独作为事件结论。"],
  };
}
