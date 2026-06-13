import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { buildProviderOptionsFromAiSettings, getAiSettingsPath, readAiSettings } from "./aiSettingsStore.js";

export function loadLocalAiProviderOptions(options = {}) {
  const publicRoot = typeof options === "string" ? options : options.publicRoot ?? process.cwd();
  const settingsOptions = typeof options === "string" ? { publicRoot } : { ...options, publicRoot };
  if (existsSync(getAiSettingsPath(settingsOptions))) {
    return buildProviderOptionsFromAiSettings(readAiSettings({ ...settingsOptions, includeSecret: true }));
  }
  const filePath = path.resolve(publicRoot, "config/ai-config.json");
  if (!existsSync(filePath)) return { provider: "mock" };
  try {
    const config = JSON.parse(readFileSync(filePath, "utf8"));
    const apiKey = String(config?.deepseek?.apiKey ?? config?.apiKey ?? "").trim();
    if (!config?.enabled || config?.provider !== "deepseek" || !apiKey) return { provider: "mock" };
    return {
      provider: "deepseek",
      deepseek: {
        apiKey,
        ...(config.deepseek?.endpoint || config.endpoint ? { endpoint: config.deepseek?.endpoint ?? config.endpoint } : {}),
        ...(config.deepseek?.model || config.model ? { model: config.deepseek?.model ?? config.model } : {}),
      },
    };
  } catch {
    return { provider: "mock" };
  }
}
