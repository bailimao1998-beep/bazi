const STAGE_MIN_RETRY_TOKENS = {
  luck:
    9000,
  year:
    7000,
  month:
    6000,
};

const RETRYABLE_HTTP_STATUS = new Set([
  408,
  409,
  425,
  429,
  500,
  502,
  503,
  504,
]);

export async function generateStageRawWithTransportRetry({
  settings,
  prompt,
  stage,
  generate,
  maxAttempts = 3,
  delay =
    wait,
} = {}) {
  if (
    typeof generate !==
    "function"
  ) {
    throw new TypeError(
      "generate 必须是函数。",
    );
  }

  const attempts = [];

  let currentPrompt =
    prompt;

  let lastError =
    null;

  for (
    let attemptIndex = 0;
    attemptIndex < maxAttempts;
    attemptIndex += 1
  ) {
    try {
      const result =
        await generate({
          settings,
          prompt:
            currentPrompt,
        });

      attempts.push({
        attempt:
          attemptIndex + 1,
        ok:
          true,
        model:
          result?.model ??
          currentPrompt
            ?.modelOverride ??
          settings
            ?.deepseek
            ?.model ??
          "",
        finishReason:
          result?.finishReason ??
          "",
        textLength:
          String(
            result?.text ??
            "",
          ).length,
        usage:
          result?.usage ??
          null,
        diagnostics:
          result?.diagnostics ??
          null,
        promptMode:
          currentPrompt
            ?.__transportRetryMode ??
          "original",
      });

      return {
        result,
        attempts,
        retried:
          attemptIndex >
          0,
        promptUsed:
          currentPrompt,
      };
    } catch (error) {
      lastError =
        error;

      const retryable =
        isRetryableDeepSeekTransportError(
          error,
        );

      attempts.push({
        attempt:
          attemptIndex + 1,
        ok:
          false,
        retryable,
        code:
          error?.code ??
          "",
        status:
          error?.status ??
          null,
        message:
          error?.message ??
          "DeepSeek 请求失败。",
        meta:
          error?.meta ??
          null,
        promptMode:
          currentPrompt
            ?.__transportRetryMode ??
          "original",
        model:
          currentPrompt
            ?.modelOverride ??
          settings
            ?.deepseek
            ?.model ??
          "",
      });

      if (
        !retryable ||
        attemptIndex >=
          maxAttempts -
            1
      ) {
        throw buildTransportRetryError({
          error,
          attempts,
          stage,
        });
      }

      currentPrompt =
        buildStageTransportRetryPrompt({
          originalPrompt:
            prompt,
          currentPrompt,
          stage,
          retryIndex:
            attemptIndex + 1,
          settings,
        });

      await delay(
        500 *
        (
          attemptIndex +
          1
        ),
      );
    }
  }

  throw buildTransportRetryError({
    error:
      lastError,
    attempts,
    stage,
  });
}

export function isRetryableDeepSeekTransportError(
  error,
) {
  const code =
    String(
      error?.code ??
      "",
    );

  if (
    [
      "DEEPSEEK_EMPTY_RESPONSE",
      "DEEPSEEK_FETCH_FAILED",
    ].includes(
      code,
    )
  ) {
    return true;
  }

  const status =
    Number(
      error?.status,
    );

  if (
    RETRYABLE_HTTP_STATUS.has(
      status,
    )
  ) {
    return true;
  }

  return /返回为空|网络请求失败|fetch failed|timeout|timed out|连接中断|ECONNRESET/i.test(
    String(
      error?.message ??
      "",
    ),
  );
}

export function buildStageTransportRetryPrompt({
  originalPrompt,
  currentPrompt,
  stage,
  retryIndex,
  settings,
} = {}) {
  const sourcePrompt =
    currentPrompt ??
    originalPrompt ??
    {};

  const configuredModel =
    String(
      settings
        ?.deepseek
        ?.model ??
      "",
    ).trim();

  const minTokens =
    STAGE_MIN_RETRY_TOKENS[
      stage
    ] ??
    6500;

  const originalTokens =
    Number(
      originalPrompt
        ?.maxTokens ??
      sourcePrompt
        ?.maxTokens,
    );

  const retryMultiplier =
    retryIndex >=
      2
      ? 1.35
      : 1.15;

  const maxTokens =
    Math.max(
      minTokens,
      Number.isFinite(
        originalTokens,
      )
        ? Math.ceil(
            originalTokens *
            retryMultiplier,
          )
        : minTokens,
    );

  const useChatFallback =
    /reasoner/i.test(
      configuredModel,
    ) ||
    /reasoner/i.test(
      String(
        sourcePrompt
          ?.modelOverride ??
        "",
      ),
    );

  const compactLevel =
    retryIndex >=
      2
      ? 2
      : 1;

  return {
    ...sourcePrompt,

    system:
      [
        originalPrompt
          ?.system ??
        sourcePrompt
          ?.system ??
        "",
        "",
        "传输重试要求：不要展示分析过程，不要输出解释性前缀，直接返回一个完整、合法、非空的JSON对象。",
        "优先保证JSON闭合和正文非空；内容可以适度精简，但不能省略确定依据编号。",
      ]
        .filter(Boolean)
        .join("\n"),

    user:
      compactStageUserPrompt(
        originalPrompt
          ?.user ??
        sourcePrompt
          ?.user ??
        "",
        {
          stage,
          compactLevel,
        },
      ),

    maxTokens,

    temperatureOverride:
      0,

    modelOverride:
      useChatFallback
        ? "deepseek-chat"
        : sourcePrompt
            ?.modelOverride,

    __transportRetryMode:
      compactLevel ===
        2
        ? "compact-final"
        : useChatFallback
          ? "chat-fallback"
          : "expanded-budget",
  };
}

export function compactStageUserPrompt(
  user,
  {
    stage,
    compactLevel = 1,
  } = {},
) {
  const raw =
    String(
      user ??
      "",
    ).trim();

  let parsed;

  try {
    parsed =
      JSON.parse(
        raw,
      );
  } catch {
    return raw;
  }

  const source =
    parsed?.资料 ??
    {};

  const compactSource = {
    报告阶段:
      source?.报告阶段 ??
      stage ??
      "",

    分析目标:
      source?.分析目标 ??
      null,

    人生阶段:
      source?.人生阶段 ??
      null,

    可引用事实:
      source?.可引用事实 ??
      [],

    领域事实卡:
      source?.领域事实卡 ??
      [],

    领域证据排序:
      compactLevel >=
        2
        ? undefined
        : source
            ?.领域证据排序 ??
          [],
  };

  const task =
    stage ===
      "month"
      ? compactLevel >=
          2
        ? "直接生成一个可用的流月JSON报告：只保留最强的一个主题，最多两种可能表现，必须引用确定事实编号。"
        : "直接生成流月JSON报告：保留一至两个最强短期主题，内容精简但完整，必须引用确定事实编号。"
      : stage ===
          "year"
        ? compactLevel >=
            2
          ? "直接生成一个可用的流年JSON报告：保留最强的一至两个主题，必须引用确定事实编号。"
          : "直接生成流年JSON报告：保留二至三个年度重点，必须引用确定事实编号。"
        : compactLevel >=
            2
          ? "直接生成一个可用的大运JSON报告：保留最强的两个至三个主题，必须引用确定事实编号。"
          : "直接生成大运JSON报告：保留三个左右长期主题，必须引用确定事实编号。";

  return JSON.stringify({
    任务:
      task,

    资料:
      removeUndefined(
        compactSource,
      ),
  });
}

export function buildTransportRetryError({
  error,
  attempts,
  stage,
} = {}) {
  const lastAttempt =
    Array.isArray(
      attempts,
    ) &&
    attempts.length >
      0
      ? attempts[
          attempts.length -
          1
        ]
      : null;

  const model =
    lastAttempt
      ?.model ||
    error
      ?.meta
      ?.model ||
    "未知模型";

  const finishReason =
    error
      ?.meta
      ?.finishReason ||
    lastAttempt
      ?.meta
      ?.finishReason ||
    "";

  const reasoningLength =
    Number(
      error
        ?.meta
        ?.reasoningLength ??
      lastAttempt
        ?.meta
        ?.reasoningLength ??
      0,
    );

  const detail = [
    `阶段=${stage || "未知"}`,
    `模型=${model}`,
    finishReason
      ? `finish_reason=${finishReason}`
      : "",
    reasoningLength > 0
      ? `仅推理内容=${reasoningLength}字`
      : "",
    `已尝试=${Array.isArray(attempts) ? attempts.length : 0}次`,
  ]
    .filter(Boolean)
    .join("，");

  const finalError =
    new Error(
      `DeepSeek 连续未返回可用正文（${detail}）。`,
    );

  finalError.code =
    "DEEPSEEK_TRANSPORT_RETRY_EXHAUSTED";

  finalError.attempts =
    attempts ??
    [];

  finalError.cause =
    error ??
    null;

  finalError.meta = {
    stage,
    model,
    finishReason,
    reasoningLength,
  };

  return finalError;
}

function removeUndefined(
  value,
) {
  if (
    Array.isArray(
      value,
    )
  ) {
    return value.map(
      removeUndefined,
    );
  }

  if (
    value &&
    typeof value ===
      "object"
  ) {
    return Object.fromEntries(
      Object.entries(
        value,
      )
        .filter(
          (
            [
              ,
              child,
            ],
          ) =>
            child !==
            undefined,
        )
        .map(
          (
            [
              key,
              child,
            ],
          ) => [
            key,
            removeUndefined(
              child,
            ),
          ],
        ),
    );
  }

  return value;
}

function wait(
  milliseconds,
) {
  return new Promise(
    (resolve) =>
      setTimeout(
        resolve,
        milliseconds,
      ),
  );
}
