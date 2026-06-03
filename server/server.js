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
const forbiddenWords = ["必离婚", "必发财", "必有灾", "必坐牢", "必死亡", "一定", "必定", "绝对", "必然"];

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url, `http://${request.headers.host}`);
    if (request.method === "POST" && url.pathname === "/api/narrative") {
      const input = await readJsonBody(request);
      const result = await buildNarrative(input);
      sendJson(response, result);
      return;
    }
    if (request.method === "POST" && url.pathname === "/api/chat") {
      const input = await readJsonBody(request);
      const result = await buildChatResponse(input);
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

export async function buildChatResponse(input = {}, providerOptions = {}) {
  const prompt = buildChatPrompt(input);
  const provider = createAiProvider(providerOptions);
  const result = await provider.generate({ prompt, storyTags: input.context?.storyTags ?? [] });
  const rawText = String(result?.text ?? "").trim();
  const fallback = createLocalChatAnswer(input.question, input.context);
  const textSource = isProviderPlaceholder(rawText) ? fallback : rawText || fallback;
  const safety = sanitizeChatText(textSource);
  return {
    provider: isProviderPlaceholder(rawText) ? "local-chat" : result?.provider ?? provider.name ?? "ai",
    text: safety.text,
    safety: {
      filtered: safety.filtered,
      boundary: "learning-only",
    },
    createdAt: new Date().toISOString(),
  };
}

export function buildChatPrompt(input = {}) {
  const question = String(input.question ?? "").trim().slice(0, 800);
  const context = pickChatContext(input.context);
  return {
    system: [
      "你是八字结构化学习排盘网站里的 AI 问答助手。",
      "产品定位是学习、观察、验证，不是直接断命系统。",
      "只能解释用户当前页面已经传入的 chart、coreSignals、transitSignals、monthSignals、storyTags 和岁运选择。",
      "不能重新排盘，不能补充页面没有列出的干支关系，不能自行改写年份月份。",
      "回答必须使用学习型表达，例如：候选信号、传统命理中可作为观察点、需要结合柱位、旺衰、十神、岁运继续验证、不能单独作为结论。",
      `禁用词：${forbiddenWords.join("、")}`,
      "回答要短，先直接回答问题，再指出依据和验证边界。不要输出 API key、配置字段或调试信息。",
    ].join("\n"),
    user: JSON.stringify({
      question,
      recentHistory: normalizeHistory(input.history),
      currentSelection: {
        targetYear: input.state?.targetYear ?? context.yearInfluence?.year,
        selectedMonth: input.state?.selectedMonth ?? context.selectedMonthInfluence?.month,
        selectedLuck: context.selectedLuck?.label,
      },
      context,
      output: {
        style: "中文白话，像老师答疑，但必须保留候选信号和观察边界。",
        maxLength: "500 Chinese characters",
      },
    }, null, 2),
  };
}

export function sanitizeChatText(text = "") {
  let filtered = false;
  let next = String(text || "").trim();
  for (const word of forbiddenWords) {
    if (next.includes(word)) {
      filtered = true;
      next = next.split(word).join("需验证");
    }
  }
  return {
    text: next || createLocalChatAnswer(),
    filtered,
  };
}

function pickChatContext(context = {}) {
  return {
    chart: context.chart,
    coreSignals: context.coreSignals,
    transitSignals: context.transitSignals,
    monthSignals: context.monthSignals,
    selectedLuck: context.selectedLuck,
    yearInfluence: context.yearInfluence,
    selectedMonthInfluence: context.selectedMonthInfluence,
    storyTags: Array.isArray(context.storyTags) ? context.storyTags.slice(0, 24) : [],
  };
}

function normalizeHistory(history = []) {
  if (!Array.isArray(history)) return [];
  return history.slice(-8).map((item) => ({
    role: item?.role === "assistant" ? "assistant" : "user",
    content: String(item?.content ?? "").slice(0, 500),
  }));
}

function isProviderPlaceholder(text) {
  return /未配置\s*apiKey|未配置 API key|未配置.*KEY/i.test(text);
}

function createLocalChatAnswer(question = "", context = {}) {
  const tags = Array.isArray(context?.storyTags) ? context.storyTags.slice(0, 3).map((tag) => tag.tag).filter(Boolean) : [];
  const year = context?.yearInfluence?.year;
  const month = context?.selectedMonthInfluence?.month;
  const focus = [year ? `${year}年` : "", month ? `${month}月` : "", ...tags].filter(Boolean).join("、") || "当前页面列出的排盘证据";
  const topic = String(question || "").trim() ? `关于“${String(question).trim().slice(0, 80)}”，` : "";
  return `${topic}可以先从${focus}作为候选信号观察。当前回答只整理页面已有证据，传统命理中可作为观察点，仍需要结合柱位、旺衰、十神、岁运和现实反馈继续验证，不能单独作为结论。`;
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
  if (normalized === "/js/local-deepseek-config.local.js") {
    response.writeHead(404);
    response.end("Not found");
    return;
  }
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
