import { loadJson } from "../../utils/jsonLoader.js";
import { createDeepseekProvider } from "./deepseekProvider.js";
import { createGeminiProvider } from "./geminiProvider.js";
import { createMockProvider } from "./mockProvider.js";
import { createOllamaProvider } from "./ollamaProvider.js";
import { createOpenaiProvider } from "./openaiProvider.js";

export function createAiProvider(options = {}) {
  const config = { ...loadJson("config/ai-config.json"), ...options };
  const provider = config.provider ?? "mock";
  if (provider === "deepseek") return createDeepseekProvider(config.deepseek ?? config);
  if (provider === "openai") return createOpenaiProvider(config.openai ?? config);
  if (provider === "gemini") return createGeminiProvider(config.gemini ?? config);
  if (provider === "ollama") return createOllamaProvider(config.ollama ?? config);
  return createMockProvider(config.mock ?? config);
}
