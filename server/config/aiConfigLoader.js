import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

export function loadLocalAiProviderOptions(publicRoot = process.cwd()) {
  const filePath = path.resolve(publicRoot, "js/local-deepseek-config.local.js");
  if (!existsSync(filePath)) return {};
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
    return {};
  }
}

function readStringSetting(source, key) {
  const match = source.match(new RegExp(`${key}\\\\s*:\\\\s*["']([^"']+)["']`));
  return match?.[1]?.trim() || "";
}
