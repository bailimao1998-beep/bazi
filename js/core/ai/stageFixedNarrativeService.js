import { renderStageFixedReportMarkdown } from "../transit/buildStageFixedReportModel.js";

const REQUIRED_HEADINGS = {
  luck: ["阶段总判", "主要现实领域", "现实验证点"],
  year: ["年度总判", "今年新增的作用", "最强现实落点"],
  month: ["本月主线", "本月新增触发", "行动节奏"],
};

export async function generateStageFixedNarrative({
  settings,
  prompt,
  stage = "luck",
  generate,
} = {}) {
  if (typeof generate !== "function") {
    throw new TypeError("generateStageFixedNarrative requires a generate function.");
  }

  const attempts = [];
  let lastError = null;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const result = await generate({
        settings,
        prompt: attempt === 0 ? prompt : buildRetryPrompt(prompt, stage),
      });
      const text = String(result?.text || "").trim();
      const usable = isUsableStageText(text, stage);
      attempts.push({
        attempt: attempt + 1,
        finishReason: result?.finishReason ?? null,
        textLength: text.length,
        usable,
      });
      if (usable) {
        return { text, fallbackUsed: false, attempts, result };
      }
      lastError = new Error("AI阶段报告内容为空、过短或缺少核心章节。");
    } catch (error) {
      lastError = error;
      attempts.push({
        attempt: attempt + 1,
        error: error?.message || "unknown_error",
        usable: false,
      });
      if (isFatalConfigurationError(error)) break;
    }
  }

  const fallbackText = renderStageFixedReportMarkdown(prompt?.fixedReportModel);
  if (fallbackText) {
    return {
      text: fallbackText,
      fallbackUsed: true,
      attempts,
      result: null,
      warning: lastError?.message || "AI报告未返回，已使用本地固定报告。",
    };
  }

  throw lastError || new Error("阶段报告生成失败。");
}

export function isUsableStageText(text, stage = "luck") {
  const normalized = String(text || "").trim();
  if (normalized.length < 120) return false;
  const headings = REQUIRED_HEADINGS[stage] || REQUIRED_HEADINGS.luck;
  return headings.every((heading) => normalized.includes(heading));
}

function buildRetryPrompt(prompt, stage) {
  const headings = REQUIRED_HEADINGS[stage] || REQUIRED_HEADINGS.luck;
  return {
    ...prompt,
    system: [
      prompt?.system || "",
      "",
      "格式纠错：上一轮阶段报告为空、过短或缺少核心章节。",
      `本次必须包含：${headings.join("、")}。`,
      "只使用fixedReportModel、stageRulePack与trustedPack，不重新排盘。",
      "不得输出JSON、规则ID或内部字段名。",
    ].join("\n"),
  };
}

function isFatalConfigurationError(error) {
  const message = String(error?.message || "");
  return (
    message.includes("未检测到本地 DeepSeek Key") ||
    message.includes("401") ||
    message.includes("Unauthorized")
  );
}
