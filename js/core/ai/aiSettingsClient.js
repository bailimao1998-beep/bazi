const storageKey = "fortune-ai-settings";
const defaultSettings = {
  provider: "mock",
  enabled: false,
  deepseek: {
    apiKey: "",
    endpoint: "https://api.deepseek.com/chat/completions",
    model: "deepseek-chat",
  },
};
let runtimeAiSettings = null;

export async function loadRuntimeAiSettings() {
  try {
    const response = await fetch("/config/ai-config.json", { cache: "no-store" });
    if (!response.ok) return null;
    const config = await response.json();
    const apiKey = String(config?.deepseek?.apiKey ?? config?.apiKey ?? "").trim();
    if (!apiKey) return null;
    runtimeAiSettings = normalizeSettings({
      enabled: true,
      provider: "deepseek",
      deepseek: {
        apiKey,
        endpoint: config.deepseek?.endpoint ?? config.endpoint ?? defaultSettings.deepseek.endpoint,
        model: config.deepseek?.model ?? config.model ?? defaultSettings.deepseek.model,
      },
    });
    return runtimeAiSettings;
  } catch {
    return null;
  }
}

export function readAiSettings({ includeSecret = false } = {}) {
  const settings = normalizeSettings(runtimeAiSettings ?? readStoredSettings());
  return includeSecret ? settings : publicSettings(settings);
}

export function saveAiSettings(input = {}) {
  const existing = readAiSettings({ includeSecret: true });
  const settings = normalizeSettings(input, existing);
  getStorage()?.setItem(storageKey, JSON.stringify(settings));
  return publicSettings(settings);
}

export function clearAiSettings() {
  getStorage()?.removeItem(storageKey);
  return publicSettings(defaultSettings);
}

export function maskApiKey(apiKey = "") {
  const value = String(apiKey || "").trim();
  if (!value) return "";
  const suffix = value.slice(-4);
  const prefix = value.startsWith("sk-") ? "sk-" : "";
  return `${prefix}****${suffix}`;
}

function readStoredSettings() {
  const storage = getStorage();
  if (!storage) return defaultSettings;
  try {
    const raw = storage.getItem(storageKey);
    return raw ? JSON.parse(raw) : defaultSettings;
  } catch {
    return defaultSettings;
  }
}

function normalizeSettings(input = {}, existing = defaultSettings) {
  const provider = ["mock", "deepseek"].includes(input.provider) ? input.provider : existing.provider ?? "mock";
  const deepseekInput = input.deepseek ?? {};
  const existingDeepseek = existing.deepseek ?? {};
  const apiKey = String(deepseekInput.apiKey ?? "").trim() || existingDeepseek.apiKey || "";
  return {
    provider,
    enabled: Boolean(input.enabled),
    deepseek: {
      apiKey,
      endpoint: String(deepseekInput.endpoint ?? existingDeepseek.endpoint ?? defaultSettings.deepseek.endpoint).trim() || defaultSettings.deepseek.endpoint,
      model: String(deepseekInput.model ?? existingDeepseek.model ?? defaultSettings.deepseek.model).trim() || defaultSettings.deepseek.model,
    },
  };
}

function publicSettings(settings) {
  const normalized = normalizeSettings(settings);
  return {
    provider: normalized.provider,
    enabled: normalized.enabled,
    deepseek: {
      hasApiKey: Boolean(normalized.deepseek.apiKey),
      maskedApiKey: maskApiKey(normalized.deepseek.apiKey),
      endpoint: normalized.deepseek.endpoint,
      model: normalized.deepseek.model,
    },
  };
}

function getStorage() {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}
