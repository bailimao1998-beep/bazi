import { createAiProvider } from "../core/ai/aiProvider.js";
import { buildProviderOptionsFromAiSettings, readAiSettings, saveAiSettings } from "../config/aiSettingsStore.js";
import { sendJson } from "../utils/response.js";
import { readJsonBody } from "./requestBody.js";

export async function settingsRoute(request, response, url) {
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
  const providerOptions = buildProviderOptionsFromAiSettings(settings);
  if (providerOptions.provider === "mock") {
    return { ok: true, provider: "mock", message: "当前使用本地 mock AI。" };
  }
  try {
    const result = await createAiProvider(providerOptions).generate({
      prompt: {
        system: "你只需要回复 OK。",
        user: "请回复 OK，用于连接测试。",
      },
    });
    return {
      ok: Boolean(String(result?.text ?? "").trim()),
      provider: result?.provider ?? providerOptions.provider,
      message: "连接测试已返回结果。",
    };
  } catch (error) {
    return { ok: false, provider: providerOptions.provider, message: error.message };
  }
}
