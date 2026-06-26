export function renderAiText(text, { className = "", promoteSummary = false } = {}) {
  const blocks = parseAiBlocks(text);
  if (!blocks.length) return "";

  const visibleBlocks = promoteSummary
    ? moveSummaryToFront(blocks)
    : blocks;

  return `
    <article class="ai-narrative-output ai-readable-output ${escapeHtml(className)}">
      ${visibleBlocks.map(renderBlock).join("")}
    </article>
  `;
}

function normalizeAiMarkdown(text = "") {
  // 1. 把传进来的内容统一转成字符串
  // 2. 把 Windows 和旧版 Mac 的换行符统一成 \n
  // 3. 删除文本开头和结尾多余的空白
  let value = String(text ?? "")
    .replaceAll("\r\n", "\n")
    .replaceAll("\r", "\n")
    .trim();

  value = value
    // 删除单独占一行的 Markdown 空标题符号
    //
    // 会删除：
    // #
    // ##
    // ###
    // ####
    //
    // 不会删除：
    // # 标题
    // ## 直接回答
    // ### 行动建议
    .replace(/^[\t ]*#{1,6}[\t ]*$/gm, "")

    // 修复标题和上一句话粘在同一行的情况
    //
    // 修改前：
    // 这是上一段内容。## 直接回答
    //
    // 修改后：
    // 这是上一段内容。
    //
    // ## 直接回答
    .replace(
      /([^\n])[\t ]*(?=#{1,6}[\t ]+)/g,
      "$1\n\n",
    )

    // 修复 AI 没有加 # 的独立章节标题
    //
    // 修改前：
    // 直接回答
    //
    // 修改后：
    // ## 直接回答
    .replace(
      /^(直接回答|核心取象|命理依据|展开分析|可能表现|时间节奏|行动建议|现实验证|注意边界|总结)[：:]?[\t ]*$/gm,
      "## $1",
    )

    // 修复数字列表和上一句话粘在一起
    //
    // 修改前：
    // 第一件事。 2. 第二件事
    //
    // 修改后：
    // 第一件事。
    // 2. 第二件事
    .replace(
      /([。！？；])[\t ]+(?=\d{1,2}[.、][\t ]+)/g,
      "$1\n",
    )

    // 修复项目符号和上一句话粘在一起
    //
    // 修改前：
    // 需要注意。 - 工作变化
    //
    // 修改后：
    // 需要注意。
    // - 工作变化
    .replace(
      /([。！？；])[\t ]+(?=[-*][\t ]+)/g,
      "$1\n",
    )

    // 连续三个或更多空行，压缩成两个换行
    // 避免页面出现太大的空白
    .replace(/\n{3,}/g, "\n\n")

    // 再次清理开头和结尾的空白
    .trim();

  return value;
}

function parseAiBlocks(text = "") {
  const lines = normalizeAiMarkdown(text).split("\n");
  const blocks = [];
  let current = null;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    // 忽略模型偶尔输出的空 Markdown 标题，例如 #、##、###
    if (/^#{1,6}$/.test(line)) {
      current = null;
      continue;
    }
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

function moveSummaryToFront(blocks = []) {
  const summaryIndex = blocks.findIndex((block) =>
    isSummaryTitle(block?.title),
  );

  if (summaryIndex <= 0) {
    return blocks;
  }

  const result = [...blocks];
  const [summary] = result.splice(summaryIndex, 1);
  result.unshift(summary);
  return result;
}

function isSummaryTitle(title = "") {
  return /^(总结|综合总结|整体总结|最终总结|答案总结)$/
    .test(String(title || "").trim());
}

function renderBlock(block = {}) {
  const grouped = groupListItems(block.items);
  const isSummary = isSummaryTitle(block.title);
  const isHighlight = block.title && /核心|结论|重点|总览|一句话|总结/.test(block.title);

  return `
    <section class="ai-output-section${isHighlight ? " is-highlight" : ""}${isSummary ? " is-summary" : ""}">
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

function renderParagraph(
  text = "",
) {
  const value =
    String(
      text ?? "",
    ).trim();

  const insight =
    parseInsightLine(
      value,
    );

  if (insight) {
    return `
      <p
        class="
          ai-insight-line
          is-${insight.type}
        "
      >
        <strong>
          ${escapeHtml(
            insight.labelText,
          )}
        </strong>

        <span>
          ${formatInline(
            insight.content,
          )}
        </span>
      </p>
    `;
  }

  const isKeyLine =
    /^(核心判断|重点|结论|一句话|提醒|风险|机会|建议)[：:]/
      .test(value);

  return `<p class="${isKeyLine ? "ai-key-line" : ""}">${formatInline(value)}</p>`;
}

function parseInsightLine(
  value = "",
) {
  const match =
    /^\*{0,2}(优势|容易付出的代价|代价|劣势)([：:]|是)\*{0,2}\s*(.*)$/
      .exec(value) ??
    /^\*{0,2}(建议)([：:])\*{0,2}\s*(.*)$/
      .exec(value);

  if (!match) {
    return null;
  }

  const label =
    match[1];

  const separator =
    match[2];

  return {
    labelText:
      `${label}${separator}`,

    type: {
      优势:
        "advantage",

      容易付出的代价:
        "cost",

      代价:
        "cost",

      劣势:
        "cost",

      建议:
        "advice",
    }[label],

    content:
      match[3].trim(),
  };
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
