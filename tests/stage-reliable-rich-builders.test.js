import test from "node:test";
import assert from "node:assert/strict";
import {
  readFileSync,
} from "node:fs";
import {
  fileURLToPath,
} from "node:url";
import {
  dirname,
  resolve,
} from "node:path";

const here =
  dirname(
    fileURLToPath(
      import.meta.url,
    ),
  );

function source(
  filename,
) {
  return readFileSync(
    resolve(
      here,
      `../js/core/ai/${filename}`,
    ),
    "utf8",
  );
}

test(
  "内容预算按大运流年流月递减",
  () => {
    const luck =
      source(
        "buildLuckAiPrompt.js",
      );

    const year =
      source(
        "buildYearAiPrompt.js",
      );

    const month =
      source(
        "buildMonthAiPrompt.js",
      );

    const tokenOf =
      (value) =>
        Number(
          value.match(
            /maxTokens:\s*(\d+)/s,
          )[1],
        );

    assert.equal(
      tokenOf(luck) >
      tokenOf(year),
      true,
    );

    assert.equal(
      tokenOf(year) >
      tokenOf(month),
      true,
    );

    assert.match(
      luck,
      /二至四种有层次的可能表现/,
    );

    assert.match(
      year,
      /一至三种现实可能/,
    );

    assert.match(
      month,
      /一至两种短期表现/,
    );
  },
);
