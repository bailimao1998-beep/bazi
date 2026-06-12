import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { buildProviderOptionsFromAiSettings, getAiSettingsPath, readAiSettings } from "./aiSettingsStore.js";

export function loadLocalAiProviderOptions(options = {}) {
  const publicRoot = typeof options === "string" ? options : options.publicRoot ?? process.cwd();
  const settingsOptions = typeof options === "string" ? { publicRoot } : { ...options, publicRoot };
  if (existsSync(getAiSettingsPath(settingsOptions))) {
    return buildProviderOptionsFromAiSettings(readAiSettings({ ...settingsOptions, includeSecret: true }));
  }
  const filePath = path.resolve(publicRoot, "js/local-deepseek-config.local.js");
  if (!existsSync(filePath)) return { provider: "mock" };
  try {
    const source = readFileSync(filePath, "utf8");
    const apiKey = readStringSetting(source, "deepseekApiKey");
    const endpoint = readStringSetting(source, "deepseekEndpoint");
    const model = readStringSetting(source, "deepseekModel");
    const disabled = /enableBrowserDirect\s*:\s*false/.test(source);
    if (disabled || !apiKey) return {};
    return {
      provider: "deepseek",
      deepseek: {
        apiKey,
        ...(endpoint ? { endpoint } : {}),
        ...(model ? { model } : {}),
      },
    };
  } catch {
    return { provider: "mock" };
  }
}

function readStringSetting(source, key) {
  const match = source.match(new RegExp(`${key}\\\\s*:\\\\s*["']([^"']+)["']`));
  return match?.[1]?.trim() || "";
}
