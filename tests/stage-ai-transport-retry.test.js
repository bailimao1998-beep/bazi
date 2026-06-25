import test from "node:test";
import assert from "node:assert/strict";

import {
  compactStageUserPrompt,
  generateStageRawWithTransportRetry,
} from "../js/core/ai/stageAiTransportRetry.js";

function emptyError() {
  const error =
    new Error(
      "DeepSeek 返回为空。",
    );

  error.code =
    "DEEPSEEK_EMPTY_RESPONSE";

  error.meta = {
    model:
      "deepseek-reasoner",
    finishReason:
      "length",
    reasoningLength:
      3300,
  };

  return error;
}

test(
  "空响应会自动切换chat模型并增加流月预算",
  async () => {
    const received = [];

    const outcome =
      await generateStageRawWithTransportRetry({
        settings: {
          deepseek: {
            model:
              "deepseek-reasoner",
          },
        },

        prompt: {
          system:
            "system",
          user:
            JSON.stringify({
              任务:
                "生成流月",
              资料: {
                报告阶段:
                  "流月",
                分析目标: {
                  ganZhi:
                    "庚寅",
                },
                背景资料: [
                  "很长的背景",
                ],
                可引用事实: [
                  {
                    编号:
                      "F01",
                    事实:
                      "流月庚为劫财透出。",
                  },
                ],
                领域事实卡: [
                  {
                    领域编号:
                      "peer_boundary",
                  },
                ],
                候选主题: [
                  "候选",
                ],
              },
            }),
          responseFormat:
            "json_object",
          maxTokens:
            3300,
        },

        stage:
          "month",

        delay:
          async () => {},

        generate:
          async ({
            prompt,
          }) => {
            received.push(
              prompt,
            );

            if (
              received.length ===
              1
            ) {
              throw emptyError();
            }

            return {
              model:
                prompt.modelOverride,
              text:
                "{\"总断\":\"成功\"}",
              finishReason:
                "stop",
            };
          },
      });

    assert.equal(
      outcome.result.text,
      "{\"总断\":\"成功\"}",
    );

    assert.equal(
      received[1].modelOverride,
      "deepseek-chat",
    );

    assert.ok(
      received[1].maxTokens >=
      6000,
    );

    assert.equal(
      JSON.parse(
        received[1].user,
      ).资料.背景资料,
      undefined,
    );
  },
);

test(
  "连续空响应三次后返回详细错误",
  async () => {
    await assert.rejects(
      () =>
        generateStageRawWithTransportRetry({
          settings: {
            deepseek: {
              model:
                "deepseek-reasoner",
            },
          },
          prompt: {
            system:
              "system",
            user:
              "{}",
            maxTokens:
              3300,
          },
          stage:
            "month",
          delay:
            async () => {},
          generate:
            async () => {
              throw emptyError();
            },
        }),
      (error) => {
        assert.equal(
          error.code,
          "DEEPSEEK_TRANSPORT_RETRY_EXHAUSTED",
        );

        assert.equal(
          error.attempts.length,
          3,
        );

        assert.match(
          error.message,
          /已尝试=3次/,
        );

        return true;
      },
    );
  },
);

test(
  "最终压缩提示只保留生成所需资料",
  () => {
    const compact =
      JSON.parse(
        compactStageUserPrompt(
          JSON.stringify({
            任务:
              "原任务",
            资料: {
              报告阶段:
                "流月",
              分析目标:
                {},
              人生阶段:
                {},
              背景资料: [
                "删除",
              ],
              可引用事实: [
                {
                  编号:
                    "F01",
                },
              ],
              领域事实卡: [
                {
                  领域编号:
                    "a",
                },
              ],
              领域证据排序: [
                {
                  领域:
                    "a",
                },
              ],
              候选主题: [
                "删除",
              ],
            },
          }),
          {
            stage:
              "month",
            compactLevel:
              2,
          },
        ),
      );

    assert.equal(
      compact.资料.背景资料,
      undefined,
    );

    assert.equal(
      compact.资料.候选主题,
      undefined,
    );

    assert.equal(
      compact.资料.领域证据排序,
      undefined,
    );

    assert.equal(
      compact.资料.可引用事实.length,
      1,
    );
  },
);
