import { createAiProvider } from "../core/ai/aiProvider.js";
import { buildChatPrompt } from "../prompts/chatPromptBuilder.js";
import { sanitizeChatText } from "../security/outputSanitizer.js";

export async function buildChatResponse(input = {}, providerOptions = {}) {
  const prompt = buildChatPrompt(input);
  const provider = createAiProvider(providerOptions);
  const result = await provider.generate({ prompt, storyTags: input.context?.storyTags ?? [] });
  const rawText = String(result?.text ?? "").trim();
  const fallback = createLocalChatAnswer(input.question, input.context);
  const textSource = isProviderPlaceholder(rawText) ? fallback : rawText || fallback;
  const safety = sanitizeChatText(textSource);
  return {
    provider: isProviderPlaceholder(rawText) ? "local-chat" : result?.provider ?? provider.name ?? "ai",
    text: safety.text,
    safety: {
      filtered: safety.filtered,
      boundary: "learning-only",
    },
    createdAt: new Date().toISOString(),
  };
}

function isProviderPlaceholder(text) {
  return /未配置\s*apiKey|未配置 API key|未配置.*KEY/i.test(text);
}

function createLocalChatAnswer(question = "", context = {}) {
  const tags = Array.isArray(context?.storyTags) ? context.storyTags.slice(0, 3).map((tag) => tag.tag).filter(Boolean) : [];
  const year = context?.yearInfluence?.year;
  const month = context?.selectedMonthInfluence?.month;
  const focus = [year ? `${year}年` : "", month ? `${month}月` : "", ...tags].filter(Boolean).join("、") || "当前页面列出的排盘证据";
  const topic = String(question || "").trim() ? `关于“${String(question).trim().slice(0, 80)}”，` : "";
  return `${topic}可先从${focus}切入研判。当前本地回答只整理页面已有证据：先看主断是否有 mainEvents 承接，再看断法依据、现实应象、成立条件和反证条件；若缺少触发链或现实背景，应降级为背景象，交由师傅复核。`;
}
