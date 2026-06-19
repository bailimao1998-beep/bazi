export function createGeminiProvider(config = {}) {
  return {
    name: "gemini",
    async generate({ prompt }) {
      if (!config.apiKey) return { provider: "gemini", text: "gemini provider 未配置 apiKey，当前使用占位响应。" };
      const endpoint = config.endpoint ?? `https://generativelanguage.googleapis.com/v1beta/models/${config.model ?? "gemini-1.5-flash"}:generateContent?key=${config.apiKey}`;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: `${prompt.system}\n\n${prompt.user}` }] }] }),
      });
      const data = await response.json();
      return { provider: "gemini", text: data.candidates?.[0]?.content?.parts?.[0]?.text ?? "" };
    },
  };
}
