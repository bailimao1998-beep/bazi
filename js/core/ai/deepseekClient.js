export async function generateWithDeepSeek({ settings, prompt } = {}) {
  const deepseek = settings?.deepseek ?? {};
  if (!settings?.enabled || settings?.provider !== "deepseek") {
    throw new Error("未检测到本地 DeepSeek Key");
  }
  if (!String(deepseek.apiKey ?? "").trim()) {
    throw new Error("未检测到本地 DeepSeek Key");
  }
  const endpoint = String(deepseek.endpoint ?? "https://api.deepseek.com/chat/completions").trim();
  const model = String(deepseek.model ?? "deepseek-chat").trim();
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${deepseek.apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: prompt?.system ?? "" },
        { role: "user", content: prompt?.user ?? "" },
      ],
      temperature: 0.25,
      max_tokens: 6000,
    }),
  });
  const data = await readResponseJson(response);
  if (!response.ok) {
    throw new Error(readErrorMessage(data, response.status));
  }
  const choice =
    data?.choices?.[0] ?? {};

  const text =
    choice?.message?.content ??
    data?.message?.content ??
    "";

  const finishReason =
    String(
      choice?.finish_reason ??
      data?.finish_reason ??
      "",
    ).trim();

  if (!String(text).trim()) {
    throw new Error(
      "DeepSeek 返回为空，请稍后重试。",
    );
  }

  return {
    provider: "deepseek",
    model,
    text: String(text).trim(),
    finishReason,
  };
}

async function readResponseJson(response) {
  try {
    return await response.json();
  } catch {
    return {};
  }
}

function readErrorMessage(data, status) {
  return data?.error?.message || data?.message || `DeepSeek 请求失败：${status}`;
}
