export function renderAiText(text, { className = "" } = {}) {
  const blocks = parseAiBlocks(text);
  if (!blocks.length) return "";
  return `
    <article class="ai-narrative-output ai-readable-output ${escapeHtml(className)}">
      ${blocks.map(renderBlock).join("")}
    </article>
  `;
}

function parseAiBlocks(text = "") {
  const lines = String(text ?? "").replaceAll("\r\n", "\n").split("\n");
  const blocks = [];
  let current = null;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      current = null;
      continue;
    }

    const heading = line.match(/^#{1,6}\s*(.+)$/);
    if (heading) {
      current = { type: "section", title: heading[1].trim(), items: [] };
      blocks.push(current);
      continue;
    }

    const listItem = line.match(/^[-*]\s+(.+)$/) || line.match(/^\d+[.、]\s*(.+)$/);
    if (listItem) {
      const target = current ?? ensureSection(blocks);
      target.items.push({ type: "list", text: listItem[1].trim() });
      continue;
    }

    const target = current ?? ensureSection(blocks);
    target.items.push({ type: "paragraph", text: line });
  }

  return blocks.filter((block) => block.title || block.items.length);
}

function ensureSection(blocks) {
  const last = blocks[blocks.length - 1];
  if (last && !last.title) return last;
  const section = { type: "section", title: "", items: [] };
  blocks.push(section);
  return section;
}

function renderBlock(block = {}) {
  const grouped = groupListItems(block.items);
  const isHighlight = block.title && /核心|结论|重点|总览|一句话/.test(block.title);

  return `
    <section class="ai-output-section${isHighlight ? " is-highlight" : ""}">
      ${block.title ? `<h4>${escapeHtml(block.title)}</h4>` : ""}
      ${grouped.map((item) => {
        if (item.type === "listGroup") {
          return `<ul>${item.items.map((listItem) => `<li>${formatInline(listItem)}</li>`).join("")}</ul>`;
        }
        return renderParagraph(item.text);
      }).join("")}
    </section>
  `;
}

function renderParagraph(text = "") {
  const value = String(text ?? "").trim();
  const isKeyLine = /^(核心判断|重点|结论|一句话|提醒|风险|机会|建议)[：:]/.test(value);

  return `<p class="${isKeyLine ? "ai-key-line" : ""}">${formatInline(value)}</p>`;
}

function groupListItems(items = []) {
  const result = [];
  let list = null;
  for (const item of items) {
    if (item.type === "list") {
      if (!list) {
        list = { type: "listGroup", items: [] };
        result.push(list);
      }
      list.items.push(item.text);
      continue;
    }
    list = null;
    result.push(item);
  }
  return result;
}

function formatInline(text = "") {
  const escaped = escapeHtml(text).replace(/`([^`]+)`/g, "$1");

  return escaped
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/^([^：:]{2,14})([：:])/, "<strong>$1$2</strong>");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
