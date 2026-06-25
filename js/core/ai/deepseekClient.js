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
    throw createDeepSeekError({
      message:
        "未检测到本地 DeepSeek Key",
      code:
        "DEEPSEEK_NOT_CONFIGURED",
    });
  }

  if (
    !String(
      deepseek.apiKey ??
      "",
    ).trim()
  ) {
    throw createDeepSeekError({
      message:
        "未检测到本地 DeepSeek Key",
      code:
        "DEEPSEEK_KEY_MISSING",
    });
  }

  const endpoint =
    String(
      deepseek.endpoint ??
      "https://api.deepseek.com/chat/completions",
    ).trim();

  const configuredModel =
    String(
      deepseek.model ??
      "deepseek-chat",
    ).trim();

  const model =
    String(
      prompt?.modelOverride ??
      configuredModel,
    ).trim() ||
    "deepseek-chat";

  const wantsJson =
    (
      prompt?.responseFormatOverride ??
      prompt?.responseFormat
    ) ===
    "json_object";

  const temperatureOverride =
    Number(
      prompt?.temperatureOverride,
    );

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
      Number.isFinite(
        temperatureOverride,
      )
        ? temperatureOverride
        : wantsJson
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

  let response;

  try {
    response =
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
  } catch (error) {
    throw createDeepSeekError({
      message:
        `DeepSeek 网络请求失败：${error?.message || "未知网络错误"}`,
      code:
        "DEEPSEEK_FETCH_FAILED",
      cause:
        error,
      meta: {
        model,
        endpoint,
      },
    });
  }

  const data =
    await readResponsePayload(
      response,
    );

  if (!response.ok) {
    throw createDeepSeekError({
      message:
        readErrorMessage(
          data,
          response.status,
        ),
      code:
        "DEEPSEEK_HTTP_ERROR",
      status:
        response.status,
      meta: {
        model,
        endpoint,
        response:
          compactResponseMeta(
            data,
          ),
      },
    });
  }

  const choice =
    data?.choices?.[0] ??
    {};

  const message =
    choice?.message ??
    data?.message ??
    {};

  const text =
    extractTextContent(
      message?.content,
    );

  const reasoningText =
    extractTextContent(
      message?.reasoning_content ??
      choice?.reasoning_content ??
      data?.reasoning_content,
    );

  const finishReason =
    String(
      choice?.finish_reason ??
      data?.finish_reason ??
      "",
    ).trim();

  const usage =
    data?.usage ??
    null;

  if (
    !String(
      text,
    ).trim()
  ) {
    const reasoningLength =
      reasoningText.length;

    const detail =
      [
        `模型 ${model}`,
        finishReason
          ? `finish_reason=${finishReason}`
          : "",
        reasoningLength > 0
          ? `仅返回推理内容 ${reasoningLength} 字`
          : "未返回正文",
      ]
        .filter(Boolean)
        .join("，");

    throw createDeepSeekError({
      message:
        `DeepSeek 返回为空（${detail}）。`,
      code:
        "DEEPSEEK_EMPTY_RESPONSE",
      status:
        response.status,
      meta: {
        model,
        endpoint,
        finishReason,
        usage,
        reasoningLength,
        choiceCount:
          Array.isArray(
            data?.choices,
          )
            ? data.choices.length
            : 0,
        response:
          compactResponseMeta(
            data,
          ),
      },
    });
  }

  return {
    provider:
      "deepseek",

    model,

    configuredModel,

    text:
      String(
        text,
      ).trim(),

    finishReason,

    usage,

    diagnostics: {
      reasoningLength:
        reasoningText.length,

      choiceCount:
        Array.isArray(
          data?.choices,
        )
          ? data.choices.length
          : 0,
    },
  };
}

async function readResponsePayload(
  response,
) {
  const rawText =
    await response.text();

  if (
    !rawText
  ) {
    return {
      __rawText:
        "",
    };
  }

  try {
    return JSON.parse(
      rawText,
    );
  } catch {
    return {
      __rawText:
        rawText.slice(
          0,
          2000,
        ),
    };
  }
}

function extractTextContent(
  value,
) {
  if (
    typeof value ===
    "string"
  ) {
    return value.trim();
  }

  if (
    Array.isArray(
      value,
    )
  ) {
    return value
      .map(
        (item) => {
          if (
            typeof item ===
            "string"
          ) {
            return item;
          }

          if (
            item &&
            typeof item ===
              "object"
          ) {
            return (
              item.text ??
              item.content ??
              item.value ??
              ""
            );
          }

          return "";
        },
      )
      .filter(Boolean)
      .join("\n")
      .trim();
  }

  if (
    value &&
    typeof value ===
      "object"
  ) {
    return extractTextContent(
      value.text ??
      value.content ??
      value.value ??
      "",
    );
  }

  return "";
}

function compactResponseMeta(
  data,
) {
  return {
    keys:
      data &&
      typeof data ===
        "object"
        ? Object.keys(
            data,
          ).slice(
            0,
            20,
          )
        : [],

    finishReason:
      data?.choices?.[0]
        ?.finish_reason ??
      data?.finish_reason ??
      "",

    choiceCount:
      Array.isArray(
        data?.choices,
      )
        ? data.choices.length
        : 0,

    usage:
      data?.usage ??
      null,

    rawTextPreview:
      typeof data?.__rawText ===
        "string"
        ? data.__rawText.slice(
            0,
            500,
          )
        : "",
  };
}

function createDeepSeekError({
  message,
  code,
  status,
  meta,
  cause,
} = {}) {
  const error =
    new Error(
      message ||
      "DeepSeek 请求失败。",
    );

  error.code =
    code ||
    "DEEPSEEK_ERROR";

  if (
    Number.isFinite(
      Number(
        status,
      ),
    )
  ) {
    error.status =
      Number(
        status,
      );
  }

  error.meta =
    meta ??
    null;

  if (
    cause
  ) {
    error.cause =
      cause;
  }

  return error;
}

function readErrorMessage(
  data,
  status,
) {
  return (
    data?.error?.message ||
    data?.message ||
    (
      data?.__rawText
        ? `DeepSeek 请求失败：${status}，${data.__rawText.slice(0, 300)}`
        : `DeepSeek 请求失败：${status}`
    )
  );
}
