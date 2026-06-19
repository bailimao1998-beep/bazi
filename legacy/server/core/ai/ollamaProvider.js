export function createOllamaProvider(config = {}) {
  return {
    name: "ollama",
    async generate({ prompt }) {
      const response = await fetch(config.endpoint ?? "http://localhost:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: config.model ?? "qwen2.5:7b",
          prompt: `${prompt.system}\n\n${prompt.user}`,
          stream: false,
        }),
      });
      const data = await response.json();
      return { provider: "ollama", text: data.response ?? "" };
    },
  };
}
