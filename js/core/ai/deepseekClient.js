export async function generateWithDeepSeek({
  settings,
  prompt,
} = {}) {
  const deepseek =
    settings?.deepseek ??
    {};

  if (
    !settings?.enabled ||
    settings?.provider !==
      "deepseek"
  ) {
    throw new Error(
      "未检测到本地 DeepSeek Key",
    );
  }

  if (
    !String(
      deepseek.apiKey ??
      "",
    ).trim()
  ) {
    throw new Error(
      "未检测到本地 DeepSeek Key",
    );
  }

  const endpoint =
    String(
      deepseek.endpoint ??
      "https://api.deepseek.com/chat/completions",
    ).trim();

  const model =
    String(
      deepseek.model ??
      "deepseek-chat",
    ).trim();

  const wantsJson =
    prompt?.responseFormat ===
    "json_object";

  const requestBody = {
    model,

    messages: [
      {
        role:
          "system",

        content:
          prompt?.system ??
          "",
      },

      {
        role:
          "user",

        content:
          prompt?.user ??
          "",
      },
    ],

    temperature:
      wantsJson
        ? 0.1
        : 0.25,

    stream:
      false,
  };

  const requestedMaxTokens =
    Number(
      prompt?.maxTokens,
    );

  if (wantsJson) {
    requestBody
      .response_format = {
        type:
          "json_object",
      };

    requestBody
      .max_tokens =
      Number.isFinite(
        requestedMaxTokens,
      ) &&
      requestedMaxTokens > 0
        ? Math.trunc(
            requestedMaxTokens,
          )
        : 8192;
  } else if (
    Number.isFinite(
      requestedMaxTokens,
    ) &&
    requestedMaxTokens > 0
  ) {
    requestBody
      .max_tokens =
      Math.trunc(
        requestedMaxTokens,
      );
  }

  const response =
    await fetch(
      endpoint,
      {
        method:
          "POST",

        headers: {
          "Content-Type":
            "application/json",

          Authorization:
            `Bearer ${deepseek.apiKey}`,
        },

        body:
          JSON.stringify(
            requestBody,
          ),
      },
    );

  const data =
    await readResponseJson(
      response,
    );

  if (!response.ok) {
    throw new Error(
      readErrorMessage(
        data,
        response.status,
      ),
    );
  }

  const choice =
    data?.choices?.[0] ??
    {};

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

  if (
    !String(text).trim()
  ) {
    throw new Error(
      "DeepSeek 返回为空。",
    );
  }

  return {
    provider:
      "deepseek",

    model,

    text:
      String(text).trim(),

    finishReason,

    usage:
      data?.usage ??
      null,
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
