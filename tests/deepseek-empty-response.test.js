import test from "node:test";
import assert from "node:assert/strict";

import {
  generateWithDeepSeek,
} from "../js/core/ai/deepseekClient.js";

const settings = {
  enabled:
    true,
  provider:
    "deepseek",
  deepseek: {
    apiKey:
      "test-key",
    endpoint:
      "https://example.test/chat/completions",
    model:
      "deepseek-reasoner",
  },
};

test(
  "正文为空但存在推理内容时返回可识别错误",
  async () => {
    const originalFetch =
      globalThis.fetch;

    globalThis.fetch =
      async () =>
        new Response(
          JSON.stringify({
            choices: [
              {
                finish_reason:
                  "length",
                message: {
                  content:
                    "",
                  reasoning_content:
                    "内部推理内容",
                },
              },
            ],
            usage: {
              completion_tokens:
                3300,
            },
          }),
          {
            status:
              200,
            headers: {
              "Content-Type":
                "application/json",
            },
          },
        );

    try {
      await assert.rejects(
        () =>
          generateWithDeepSeek({
            settings,
            prompt: {
              system:
                "system",
              user:
                "user",
              responseFormat:
                "json_object",
              maxTokens:
                3300,
            },
          }),
        (error) => {
          assert.equal(
            error.code,
            "DEEPSEEK_EMPTY_RESPONSE",
          );

          assert.equal(
            error.meta.finishReason,
            "length",
          );

          assert.ok(
            error.meta.reasoningLength >
            0,
          );

          return true;
        },
      );
    } finally {
      globalThis.fetch =
        originalFetch;
    }
  },
);

test(
  "支持数组形式的正文内容",
  async () => {
    const originalFetch =
      globalThis.fetch;

    globalThis.fetch =
      async () =>
        new Response(
          JSON.stringify({
            choices: [
              {
                finish_reason:
                  "stop",
                message: {
                  content: [
                    {
                      type:
                        "text",
                      text:
                        "{\"总断\":\"正常\"}",
                    },
                  ],
                },
              },
            ],
          }),
          {
            status:
              200,
            headers: {
              "Content-Type":
                "application/json",
            },
          },
        );

    try {
      const result =
        await generateWithDeepSeek({
          settings,
          prompt: {
            system:
              "system",
            user:
              "user",
            responseFormat:
              "json_object",
            modelOverride:
              "deepseek-chat",
            maxTokens:
              6000,
            temperatureOverride:
              0,
          },
        });

      assert.equal(
        result.text,
        "{\"总断\":\"正常\"}",
      );

      assert.equal(
        result.model,
        "deepseek-chat",
      );
    } finally {
      globalThis.fetch =
        originalFetch;
    }
  },
);
