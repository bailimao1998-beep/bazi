import { createAiProvider } from "../core/ai/aiProvider.js";
import { buildProviderOptionsFromAiSettings, readAiSettings, saveAiSettings } from "../config/aiSettingsStore.js";
import { sendJson } from "../utils/response.js";
import { readJsonBody } from "./requestBody.js";

export async function aiSettingsRoute(request, response, url) {
  if (url.pathname === "/api/settings/ai" && request.method === "GET") {
    sendJson(response, readAiSettings());
    return true;
  }
  if (url.pathname === "/api/settings/ai" && request.method === "POST") {
    const input = await readJsonBody(request);
    sendJson(response, { saved: true, settings: saveAiSettings(input) });
    return true;
  }
  if (url.pathname === "/api/settings/ai/test" && request.method === "POST") {
    const input = await readJsonBody(request);
    const settings = buildTestSettings(input);
    const result = await testAiSettings(settings);
    sendJson(response, result);
    return true;
  }
  return false;
}

function buildTestSettings(input = {}) {
  const saved = readAiSettings({ includeSecret: true });
  if (!input || !Object.keys(input).length) return saved;
  return {
    ...saved,
    ...input,
    deepseek: {
      ...saved.deepseek,
      ...(input.deepseek ?? {}),
      apiKey: String(input.deepseek?.apiKey ?? "").trim() || saved.deepseek?.apiKey || "",
    },
  };
}

async function testAiSettings(settings = {}) {
  if (!settings.enabled || settings.provider === "mock") {
    return { ok: true, provider: "mock", message: "当前使用本地 mock AI，无需连接测试。" };
  }
  if (settings.provider === "deepseek") {
    const apiKey = String(settings.deepseek?.apiKey ?? "").trim();
    if (!apiKey) {
      return { ok: false, provider: "deepseek", message: "DeepSeek API Key 为空，请先填写 API Key。" };
    }
    try {
      const result = await createAiProvider({
        provider: "deepseek",
        deepseek: {
          apiKey,
          endpoint: settings.deepseek?.endpoint,
          model: settings.deepseek?.model,
        },
      }).generate({
        prompt: {
          system: "你只需要回复 OK。",
          user: "请回复 OK，用于连接测试。",
        },
      });
      return {
        ok: Boolean(String(result?.text ?? "").trim()),
        provider: "deepseek",
        message: "连接测试已返回结果。",
      };
    } catch (error) {
      return { ok: false, provider: "deepseek", message: error.message };
    }
  }
  return { ok: false, provider: settings.provider ?? "unknown", message: "不支持的 AI provider。" };
}
