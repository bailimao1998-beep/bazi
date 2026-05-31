import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { analyzeBirth } from "../src/lib/readingEngine.js";
import { buildOfflineAnalysisPrompt, findSimilarCases, summarizeReadingForAi } from "../src/lib/offlineAi.js";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const port = Number(process.env.BAZI_PORT ?? 5173);
const ollamaUrl = process.env.OLLAMA_URL ?? "http://127.0.0.1:11434/api/generate";
const defaultModel = process.env.OLLAMA_MODEL;

const dataBundleFile = "data/bazi-data-bundle.json";

const contentTypes = {
  ".html": "text/html;charset=utf-8",
  ".js": "text/javascript;charset=utf-8",
  ".css": "text/css;charset=utf-8",
  ".json": "application/json;charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
};

startServer(port);

function startServer(targetPort, attempts = 0) {
  const server = createServer();
  server.once("error", (error) => {
    if (error.code === "EADDRINUSE" && attempts < 10) {
      server.close();
      startServer(targetPort + 1, attempts + 1);
      return;
    }
    throw error;
  });
  server.listen(targetPort, "127.0.0.1", () => {
    console.log(`离线八字服务已启动：http://127.0.0.1:${targetPort}`);
    console.log("如需 AI 生成，请先启动 Ollama，例如：ollama run qwen2.5:7b");
  });
}

function createServer() {
  return http.createServer(async (request, response) => {
    try {
      const url = new URL(request.url, `http://${request.headers.host}`);
      if (request.method === "POST" && url.pathname === "/api/offline-analysis") {
        await handleOfflineAnalysis(request, response);
        return;
      }
      if (request.method === "GET" && url.pathname === "/api/offline-status") {
        await sendJson(response, { ok: true, mode: "offline-local", ollamaUrl, defaultModel: defaultModel ?? "from data/15" });
        return;
      }
      if (request.method !== "GET" && request.method !== "HEAD") {
        sendJson(response, { ok: false, error: "只支持 GET/POST" }, 405);
        return;
      }
      await serveStatic(url.pathname, response);
    } catch (error) {
      sendJson(response, { ok: false, error: error.message }, 500);
    }
  });
}

async function handleOfflineAnalysis(request, response) {
  const body = await readRequestJson(request);
  const datasets = await loadDatasets();
  const casesData = datasets.caseStudies ?? { cases: [] };
  const promptsData = datasets.aiPrompts ?? { default: {} };
  const promptTemplate = promptsData.default;
  const reading = analyzeBirth(body.birth ?? body, datasets);
  const readingSummary = summarizeReadingForAi(reading);
  const similarCases = findSimilarCases(reading, casesData.cases ?? [], 3);
  const prompt = buildOfflineAnalysisPrompt({ promptTemplate, readingSummary, similarCases });
  const model = body.model || defaultModel || promptTemplate.model || "qwen2.5:7b";

  try {
    const analysis = await callOllama({ model, prompt });
    await sendJson(response, {
      ok: true,
      model,
      mode: "ollama",
      analysis,
      similarCases: similarCases.map(publicCase),
      readingSummary,
    });
  } catch (error) {
    await sendJson(response, {
      ok: false,
      mode: "offline-local",
      error: "未能连接本机 Ollama。请确认已运行：ollama run " + model,
      detail: error.message,
      similarCases: similarCases.map(publicCase),
      promptPreview: prompt,
      readingSummary,
    }, 503);
  }
}

async function callOllama({ model, prompt }) {
  const response = await fetch(ollamaUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ model, prompt, stream: false }),
  });
  if (!response.ok) throw new Error(`Ollama HTTP ${response.status}`);
  const data = await response.json();
  return data.response ?? "";
}

async function loadDatasets() {
  const bundle = await readJson(dataBundleFile);
  return bundle.datasets ?? {};
}

async function readJson(file) {
  return JSON.parse(await fs.readFile(path.join(repoRoot, file), "utf8"));
}

async function readRequestJson(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  if (!chunks.length) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

async function serveStatic(pathname, response) {
  const normalized = pathname === "/" ? "/index.html" : decodeURIComponent(pathname);
  const filePath = path.normalize(path.join(repoRoot, normalized));
  if (!filePath.startsWith(repoRoot)) {
    response.writeHead(403);
    response.end("forbidden");
    return;
  }
  const content = await fs.readFile(filePath);
  response.writeHead(200, { "content-type": contentTypes[path.extname(filePath)] ?? "application/octet-stream" });
  response.end(content);
}

async function sendJson(response, payload, status = 200) {
  response.writeHead(status, { "content-type": "application/json;charset=utf-8" });
  response.end(JSON.stringify(payload));
}

function publicCase(caseItem) {
  return {
    id: caseItem.id,
    title: caseItem.title,
    tags: caseItem.tags,
    matchedTags: caseItem.matchedTags,
    score: caseItem.score,
    events: caseItem.events,
    analysis: caseItem.analysis,
    privacy: caseItem.privacy,
  };
}
