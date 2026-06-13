export function renderAiSettingsPanel(root, state = {}, actions = {}) {
  if (!root) return;
  const settings = state.settings ?? {};
  const deepseek = settings.deepseek ?? {};
  const hasLocalKey = Boolean(deepseek.hasApiKey || deepseek.apiKey);
  root.innerHTML = `
    <div class="plugin-header">
      <p class="eyebrow">AI 配置</p>
      <h2>配置文件 DeepSeek 设置</h2>
    </div>
    <p class="${hasLocalKey ? "muted" : "error-text"}">
      ${hasLocalKey
        ? "已读取 config/ai-config.json 中的 DeepSeek Key，点击原局 AI 分析即可生成。"
        : "未检测到 config/ai-config.json 中的 DeepSeek Key，请在本地创建该文件并填写 DeepSeek Key。"}
    </p>
    <p class="muted">${escapeHtml(state.status ?? "")}</p>
    <div class="settings-grid readonly-settings">
      ${renderReadonlyField("Provider", settings.provider ?? "mock")}
      ${renderReadonlyField("Endpoint", deepseek.endpoint ?? "https://api.deepseek.com/chat/completions")}
      ${renderReadonlyField("Model", deepseek.model ?? "deepseek-chat")}
      ${renderReadonlyField("Key", deepseek.maskedApiKey || (hasLocalKey ? "已检测" : "未检测"))}
    </div>
  `;
}

function renderReadonlyField(label, value) {
  return `
    <div>
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
    </div>
  `;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
