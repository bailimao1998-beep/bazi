import { loadJson } from "../../utils/jsonLoader.js";
import { createDeepseekProvider } from "./deepseekProvider.js";
import { createGeminiProvider } from "./geminiProvider.js";
import { createMockProvider } from "./mockProvider.js";
import { createOllamaProvider } from "./ollamaProvider.js";
import { createOpenaiProvider } from "./openaiProvider.js";

export function createAiProvider(options = {}) {
  const config = { ...loadAiConfig(), ...options };
  const provider = config.provider ?? "mock";
  if (provider === "deepseek") return createDeepseekProvider(config.deepseek ?? config);
  if (provider === "openai") return createOpenaiProvider(config.openai ?? config);
  if (provider === "gemini") return createGeminiProvider(config.gemini ?? config);
  if (provider === "ollama") return createOllamaProvider(config.ollama ?? config);
  return createMockProvider(config.mock ?? config);
}

function loadAiConfig() {
  try {
    return normalizeAiConfig(loadJson("config/ai-config.json"));
  } catch {
    try {
      return normalizeAiConfig(loadJson("config/ai-config.example.json"));
    } catch {
      return { provider: "mock", mock: {} };
    }
  }
}

function normalizeAiConfig(config = {}) {
  const apiKey = String(config.deepseek?.apiKey ?? config.apiKey ?? process.env.DEEPSEEK_API_KEY ?? "").trim();
  if (config.provider === "deepseek" && !apiKey) return { provider: "mock", mock: {} };
  return config;
}
