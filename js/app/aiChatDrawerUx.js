const SELECTORS = {
  drawer: "#aiChatDrawer",
  toggle: "#aiChatToggle",
  close: "#aiChatClose",
  header: ".ai-chat-drawer-head",
  textarea: "[data-ai-chat-question]",
  form: "[data-ai-chat-form]",
};

const DRAFT_KEY = "bazi.aiChatDraft";

function initAiChatDrawerUx() {
  const drawer = document.querySelector(SELECTORS.drawer);
  const toggle = document.querySelector(SELECTORS.toggle);
  const closeButton = document.querySelector(SELECTORS.close);
  const header = drawer?.querySelector(SELECTORS.header);

  if (!drawer || !toggle || !closeButton || !header) return;
  if (drawer.dataset.collapseUxReady === "true") return;
  drawer.dataset.collapseUxReady = "true";

  closeButton.textContent = "收起";
  closeButton.setAttribute("aria-label", "收起 AI 问答");
  closeButton.setAttribute("title", "收起 AI 问答（Esc）");

  header.setAttribute("role", "button");
  header.setAttribute("tabindex", "0");
  header.setAttribute("aria-label", "点击此处收起 AI 问答");

  if (!header.querySelector(".ai-chat-collapse-tip")) {
    const tip = document.createElement("span");
    tip.className = "ai-chat-collapse-tip";
    tip.textContent = "点击标题、页面空白处或按 Esc 收起";
    header.insertBefore(tip, closeButton);
  }

  const collapse = ({ returnFocus = true } = {}) => {
    if (drawer.hidden) return;
    rememberDraft(drawer);
    closeButton.click();
    if (returnFocus) {
      requestAnimationFrame(() => {
        try {
          toggle.focus({ preventScroll: true });
        } catch {
          toggle.focus();
        }
      });
    }
  };

  header.addEventListener("click", (event) => {
    if (event.target.closest("button, input, textarea, select, a, label")) return;
    collapse();
  });

  header.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    collapse();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || drawer.hidden) return;
    event.preventDefault();
    collapse();
  });

  document.addEventListener("pointerdown", (event) => {
    if (drawer.hidden) return;
    const target = event.target;
    if (!(target instanceof Node)) return;
    if (drawer.contains(target) || toggle.contains(target)) return;
    collapse({ returnFocus: false });
  }, true);

  drawer.addEventListener("input", (event) => {
    if (!event.target.matches?.(SELECTORS.textarea)) return;
    saveDraft(event.target.value);
  });

  drawer.addEventListener("submit", (event) => {
    if (!event.target.matches?.(SELECTORS.form)) return;
    clearDraft();
  }, true);

  const observer = new MutationObserver(() => {
    syncOpenState({ drawer, toggle, closeButton });
    restoreDraft(drawer);
  });

  observer.observe(drawer, {
    attributes: true,
    attributeFilter: ["hidden"],
    childList: true,
    subtree: true,
  });

  syncOpenState({ drawer, toggle, closeButton });
  restoreDraft(drawer);
}

function syncOpenState({ drawer, toggle, closeButton }) {
  const open = !drawer.hidden;
  document.documentElement.classList.toggle("ai-chat-is-open", open);
  closeButton.textContent = "收起";

  if (open) {
    toggle.setAttribute("aria-label", "AI 问答已展开");
    return;
  }

  const hasHistory = Boolean(drawer.querySelector(".ai-chat-message"));
  const hasDraft = Boolean(readDraft().trim());
  toggle.textContent = hasHistory || hasDraft ? "继续问答" : "AI 问答";
  toggle.setAttribute("aria-label", hasHistory || hasDraft ? "继续 AI 问答" : "打开 AI 问答");
}

function rememberDraft(drawer) {
  const textarea = drawer.querySelector(SELECTORS.textarea);
  if (!textarea) return;
  saveDraft(textarea.value);
}

function restoreDraft(drawer) {
  const textarea = drawer.querySelector(SELECTORS.textarea);
  if (!textarea || textarea.value.trim()) return;
  const draft = readDraft();
  if (draft) textarea.value = draft;
}

function saveDraft(value) {
  try {
    const text = String(value ?? "");
    if (text.trim()) sessionStorage.setItem(DRAFT_KEY, text);
    else sessionStorage.removeItem(DRAFT_KEY);
  } catch {
    // 部分受限环境可能禁用 sessionStorage，不影响问答本身。
  }
}

function readDraft() {
  try {
    return sessionStorage.getItem(DRAFT_KEY) || "";
  } catch {
    return "";
  }
}

function clearDraft() {
  try {
    sessionStorage.removeItem(DRAFT_KEY);
  } catch {
    // 忽略存储限制。
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initAiChatDrawerUx, { once: true });
} else {
  initAiChatDrawerUx();
}
