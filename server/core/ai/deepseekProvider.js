export function createDeepseekProvider(config = {}) {
  return createHttpProvider({
    name: "deepseek",
    endpoint: config.endpoint ?? "https://api.deepseek.com/chat/completions",
    apiKey: config.apiKey,
    model: config.model ?? "deepseek-chat",
  });
}

function createHttpProvider({ name, endpoint, apiKey, model }) {
  return {
    name,
    async generate({ prompt }) {
      if (!apiKey) return { provider: name, text: `${name} provider 未配置 apiKey，当前使用占位响应。` };
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({ model, messages: [{ role: "system", content: prompt.system }, { role: "user", content: prompt.user }] }),
      });
      const data = await response.json();
      return { provider: name, text: data.choices?.[0]?.message?.content ?? "" };
    },
  };
}
