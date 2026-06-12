export const forbiddenWords = ["必离婚", "必发财", "必有灾", "必坐牢", "必死亡", "一定", "必定", "绝对", "必然"];

export function sanitizeChatText(text = "") {
  let filtered = false;
  let next = String(text || "").trim();
  for (const word of forbiddenWords) {
    if (next.includes(word)) {
      filtered = true;
      next = next.split(word).join("需复核");
    }
  }
  return {
    text: next || createDefaultChatAnswer(),
    filtered,
  };
}

function createDefaultChatAnswer() {
  return "可先从当前页面列出的排盘证据切入研判。当前本地回答只整理页面已有证据：先看主断是否有 mainEvents 承接，再看断法依据、现实应象、成立条件和反证条件；若缺少触发链或现实背景，应降级为背景象，交由师傅复核。";
}
