export function createOpenaiProvider(config = {}) {
  return {
    name: "openai",
    async generate({ prompt }) {
      if (!config.apiKey) return { provider: "openai", text: "openai provider 未配置 apiKey，当前使用占位响应。" };
      const response = await fetch(config.endpoint ?? "https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${config.apiKey}` },
        body: JSON.stringify({
          model: config.model ?? "gpt-4o-mini",
          messages: [{ role: "system", content: prompt.system }, { role: "user", content: prompt.user }],
        }),
      });
      const data = await response.json();
      return { provider: "openai", text: data.choices?.[0]?.message?.content ?? "" };
    },
  };
}
