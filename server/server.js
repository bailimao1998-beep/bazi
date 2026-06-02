import { createReadStream, existsSync } from "node:fs";
import { createServer } from "node:http";
import path from "node:path";
import { calculateBazi } from "./core/bazi/calculateBazi.js";
import { calculateZiwei } from "./core/ziwei/calculateZiwei.js";
import { calculateYearInfluence } from "./core/liunian/calculateYearInfluence.js";
import { calculateMonthInfluence } from "./core/liunian/calculateMonthInfluence.js";
import { createMonthPillar, createPillarFromYear } from "./core/bazi/pillarMath.js";
import { ruleEngine } from "./core/rules/ruleEngine.js";
import { generateStoryTags } from "./core/story/generateStoryTags.js";
import { buildFlowNarrativePrompt, buildNarrativePrompt } from "./core/story/buildNarrativePrompt.js";
import { createAiProvider } from "./core/ai/aiProvider.js";
import { logError, logInfo } from "./utils/logger.js";
import { sendError, sendJson } from "./utils/response.js";

const port = Number(process.env.PORT ?? 3000);
const publicRoot = process.cwd();

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url, `http://${request.headers.host}`);
    if (request.method === "POST" && url.pathname === "/api/narrative") {
      const input = await readJsonBody(request);
      const result = await buildNarrative(input);
      sendJson(response, result);
      return;
    }
    serveStatic(url.pathname, response);
  } catch (error) {
    logError("request failed", error);
    sendError(response, error);
  }
});

export async function buildNarrative(input = {}) {
  const targetYear = Number(input.targetYear ?? new Date().getFullYear());
  const selectedMonth = Number(input.selectedMonth ?? new Date().getMonth() + 1);
  const aiMode = ["luck", "year", "month"].includes(input.mode) ? input.mode : "default";
  const chart = calculateBazi(input);
  const ziwei = calculateZiwei(input, chart);
  const yearInfluence = calculateYearInfluence({ chart, targetYear });
  const monthInfluences = Array.from({ length: 12 }, (_, index) =>
    calculateMonthInfluence({ chart, targetYear, month: index + 1 }),
  );
  const selectedMonthInfluence = monthInfluences[Math.max(0, Math.min(11, selectedMonth - 1))];
  const selectedLuck = selectLuckPillar(chart.luckCycles, input.selectedLuckIndex, targetYear);
  const transitYears = Array.from({ length: 11 }, (_, index) => {
    const year = targetYear - 5 + index;
    return { year, pillar: createPillarFromYear(year, "流年") };
  });
  const transitMonths = Array.from({ length: 12 }, (_, index) => {
    const month = index + 1;
    return { month, pillar: createMonthPillar(targetYear, month, "流月") };
  });
  const matchedRules = ruleEngine({ chart, ziwei, yearInfluence, monthInfluences });
  const storyTags = generateStoryTags({ chart, yearInfluence, monthInfluences, matchedRules });
  const prompt = aiMode === "default"
    ? buildNarrativePrompt({ chart, yearInfluence, monthInfluences, storyTags })
    : buildFlowNarrativePrompt({
      mode: aiMode,
      chart,
      coreSignals: input.coreSignals,
      transitSignals: input.transitSignals,
      monthSignals: input.monthSignals,
      selectedLuck,
      yearInfluence,
      selectedMonthInfluence,
    });
  const narrative = await createAiProvider().generate({ prompt, storyTags });
  return {
    aiMode,
    chart,
    ziwei,
    yearInfluence,
    monthInfluences,
    selectedMonthInfluence,
    selectedLuck,
    transitYears,
    transitMonths,
    matchedRules,
    storyTags,
    prompt,
    narrative,
    selection: { targetYear, selectedMonth, selectedLuckIndex: selectedLuck?.index ? selectedLuck.index - 1 : 0 },
  };
}

function selectLuckPillar(luckCycles, selectedLuckIndex, targetYear) {
  const pillars = luckCycles?.pillars ?? [];
  if (!pillars.length) return null;
  const byIndex = Number.isInteger(Number(selectedLuckIndex)) ? pillars[Number(selectedLuckIndex)] : null;
  if (byIndex) return byIndex;
  return pillars.find((item) => Number(targetYear) >= item.startYear && Number(targetYear) <= item.endYear) ?? pillars[0];
}

function serveStatic(pathname, response) {
  const normalized = pathname === "/" ? "/index.html" : pathname;
  const filePath = path.resolve(publicRoot, `.${normalized}`);
  if (!filePath.startsWith(publicRoot) || !existsSync(filePath)) {
    response.writeHead(404);
    response.end("Not found");
    return;
  }
  response.writeHead(200, { "Content-Type": contentType(filePath) });
  createReadStream(filePath).pipe(response);
}

function contentType(filePath) {
  if (filePath.endsWith(".html")) return "text/html; charset=utf-8";
  if (filePath.endsWith(".css")) return "text/css; charset=utf-8";
  if (filePath.endsWith(".js")) return "text/javascript; charset=utf-8";
  if (filePath.endsWith(".json")) return "application/json; charset=utf-8";
  return "text/plain; charset=utf-8";
}

function readJsonBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
    });
    request.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
    request.on("error", reject);
  });
}

if (process.argv[1] && process.argv[1].endsWith("server.js")) {
  server.listen(port, () => logInfo("fortune-ai server started", { port }));
}
