export function renderAiSettingsPanel(root, state = {}, actions = {}) {
  if (!root) return;
  const settings = state.settings ?? {};
  const deepseek = settings.deepseek ?? {};
  root.innerHTML = `
    <div class="plugin-header">
      <p class="eyebrow">AI 配置</p>
      <h2>桌面 AI 设置</h2>
    </div>
    <div class="settings-grid">
      <label class="checkbox-line">
        <input type="checkbox" name="aiEnabled" ${settings.enabled ? "checked" : ""} />
        <span>启用 AI 叙事</span>
      </label>
      <label>
        <span>Provider</span>
        <select name="provider">
          <option value="mock" ${settings.provider === "mock" ? "selected" : ""}>mock</option>
          <option value="deepseek" ${settings.provider === "deepseek" ? "selected" : ""}>deepseek</option>
        </select>
      </label>
      <label>
        <span>API Key</span>
        <input type="password" name="apiKey" placeholder="${escapeHtml(deepseek.maskedApiKey || "保存后不回显完整 Key")}" autocomplete="off" />
      </label>
      <label>
        <span>Endpoint</span>
        <input name="endpoint" value="${escapeHtml(deepseek.endpoint ?? "https://api.deepseek.com/chat/completions")}" />
      </label>
      <label>
        <span>Model</span>
        <input name="model" value="${escapeHtml(deepseek.model ?? "deepseek-chat")}" />
      </label>
    </div>
    <div class="form-actions">
      <button type="button" data-ai-save>保存</button>
      <button type="button" data-ai-test>测试连接</button>
      <span class="muted">${escapeHtml(state.status ?? "API Key 只保存在本机后端配置中。")}</span>
    </div>
  `;

  root.querySelector("[data-ai-save]")?.addEventListener("click", () => actions.onSave?.(collectSettings(root)));
  root.querySelector("[data-ai-test]")?.addEventListener("click", () => actions.onTest?.(collectSettings(root)));
}

function collectSettings(root) {
  return {
    enabled: Boolean(root.querySelector("[name='aiEnabled']")?.checked),
    provider: root.querySelector("[name='provider']")?.value ?? "mock",
    deepseek: {
      apiKey: root.querySelector("[name='apiKey']")?.value ?? "",
      endpoint: root.querySelector("[name='endpoint']")?.value ?? "",
      model: root.querySelector("[name='model']")?.value ?? "",
    },
  };
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
