import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const defaultEndpoint = "https://api.deepseek.com/chat/completions";
const defaultModel = "deepseek-chat";

export function getAiSettingsPath({ settingsDir, publicRoot = process.cwd() } = {}) {
  const baseDir = settingsDir ?? process.env.FORTUNE_AI_USER_DATA_DIR;
  if (baseDir) return path.join(baseDir, "ai-settings.json");
  return path.resolve(publicRoot, "config/local-ai-settings.json");
}

export function readAiSettings(options = {}) {
  const filePath = getAiSettingsPath(options);
  if (!existsSync(filePath)) return sanitizeSettings(defaultAiSettings(), options);
  try {
    const settings = normalizeAiSettings(JSON.parse(readFileSync(filePath, "utf8")));
    return sanitizeSettings(settings, options);
  } catch {
    return sanitizeSettings(defaultAiSettings(), options);
  }
}

export function saveAiSettings(input = {}, options = {}) {
  const filePath = getAiSettingsPath(options);
  const existing = readAiSettings({ ...options, includeSecret: true });
  const settings = normalizeAiSettings(input, existing);
  mkdirSync(path.dirname(filePath), { recursive: true });
  writeFileSync(filePath, `${JSON.stringify(settings, null, 2)}\n`, "utf8");
  return sanitizeSettings(settings, options);
}

export function buildProviderOptionsFromAiSettings(settings = {}) {
  const normalized = normalizeAiSettings(settings);
  if (!normalized.enabled || normalized.provider === "mock") return { provider: "mock" };
  if (normalized.provider === "deepseek" && normalized.deepseek.apiKey) {
    return {
      provider: "deepseek",
      deepseek: {
        apiKey: normalized.deepseek.apiKey,
        endpoint: normalized.deepseek.endpoint,
        model: normalized.deepseek.model,
      },
    };
  }
  return { provider: "mock" };
}

export function maskApiKey(apiKey = "") {
  const value = String(apiKey || "").trim();
  if (!value) return "";
  const suffix = value.slice(-4);
  const prefix = value.startsWith("sk-") ? "sk-" : "";
  return `${prefix}****${suffix}`;
}

function defaultAiSettings() {
  return {
    provider: "mock",
    enabled: false,
    deepseek: {
      apiKey: "",
      endpoint: defaultEndpoint,
      model: defaultModel,
    },
  };
}

function normalizeAiSettings(input = {}, existing = defaultAiSettings()) {
  const provider = ["mock", "deepseek"].includes(input.provider) ? input.provider : existing.provider ?? "mock";
  const deepseekInput = input.deepseek ?? {};
  const existingDeepseek = existing.deepseek ?? {};
  const apiKey = String(deepseekInput.apiKey ?? "").trim() || existingDeepseek.apiKey || "";
  return {
    provider,
    enabled: Boolean(input.enabled),
    deepseek: {
      apiKey,
      endpoint: String(deepseekInput.endpoint ?? existingDeepseek.endpoint ?? defaultEndpoint).trim() || defaultEndpoint,
      model: String(deepseekInput.model ?? existingDeepseek.model ?? defaultModel).trim() || defaultModel,
    },
  };
}

function sanitizeSettings(settings, { includeSecret = false } = {}) {
  const normalized = normalizeAiSettings(settings);
  if (includeSecret) return normalized;
  return {
    provider: normalized.provider,
    enabled: normalized.enabled,
    deepseek: {
      hasApiKey: Boolean(normalized.deepseek.apiKey),
      endpoint: normalized.deepseek.endpoint,
      model: normalized.deepseek.model,
      maskedApiKey: maskApiKey(normalized.deepseek.apiKey),
    },
  };
}
