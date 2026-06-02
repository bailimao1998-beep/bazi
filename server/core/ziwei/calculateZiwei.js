import { buildZiweiPalaces } from "./palaces.js";
import { calculateTransformations } from "./transformations.js";

export function calculateZiwei(input = {}, chart = {}) {
  const birthMonth = Number(String(input.birthDate ?? "").split("-")[1] ?? 1);
  return {
    palaces: buildZiweiPalaces({ birthMonth }),
    transformations: calculateTransformations({ yearStem: chart.pillars?.year?.stem }),
    meta: {
      engine: "ziwei-chart-engine",
      version: "0.1.0",
      evidence: ["紫微模块第一版先保留宫位和四化接口。"],
      confidence: "low",
      needVerify: ["后续补充农历、命宫身宫、主星和四化完整算法。"],
    },
  };
}
