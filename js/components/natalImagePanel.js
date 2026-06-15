const topicLabels = {
  personality: "性格底色",
  family: "家庭背景",
  study_skill: "学业技能",
  career: "事业方向",
  wealth: "财务方式",
  relationship: "感情模式",
  health: "健康体质",
  movement: "迁动环境",
  life_pattern: "人生主线",
};

const cardGroups = [
  {
    title: "人自身",
    desc: "性格、体质、人生底色",
    topics: ["personality", "health", "life_pattern"],
  },
  {
    title: "现实发展",
    desc: "学习、事业、财务方式",
    topics: ["study_skill", "career", "wealth"],
  },
  {
    title: "关系环境",
    desc: "家庭、感情、迁动环境",
    topics: ["family", "relationship", "movement"],
  },
];

const fallbackOverviewTopics = ["personality", "career", "wealth", "relationship", "life_pattern"];
const confidenceLabels = {
  high: "重点",
  medium: "可参考",
  low: "待验证",
};
const strengthLabels = {
  weak: "偏弱",
  strong: "偏强",
  balanced: "平衡",
  medium: "中和",
  mixed: "需复核",
  none: "不显",
};

export function renderNatalImagePanel(root, report) {
  if (!root) return;
  if (!report) {
    root.innerHTML = `
      <div class="plugin-header">
        <p class="eyebrow">原局取象</p>
        <h2>原局整体取象</h2>
      </div>
      <p class="muted">等待基础排盘完成后生成原局取象。</p>
    `;
    return;
  }
  root.innerHTML = `
    <div class="plugin-header">
      <p class="eyebrow">原局取象</p>
      <h2>原局整体取象</h2>
    </div>
    ${renderOverview(report)}
    ${renderKeywordSummary(report.imageCards)}
    ${renderGroupedCards(report.imageCards)}
  `;
}

function renderOverview(report = {}) {
  const summary = report.summary ?? {};
  const cards = report.imageCards ?? [];
  const overview = buildOverviewItems(summary, cards, report.needVerify);

  const mainText = overview.find(([label]) => label === "一句话总览")?.[1] || "待复核。";
  const advantageText = overview.find(([label]) => label === "核心优势")?.[1] || "待复核。";
  const pressureText = overview.find(([label]) => label === "主要压力")?.[1] || "待复核。";
  const realityText = overview.find(([label]) => label === "现实验证点")?.[1] || "待复核。";

  return `
    <section class="natal-overview-card natal-overview-hero">
      <div class="board-title">
        <h3>原局总论</h3>
        <span>${safe(confidenceLabel(summary.confidence))}</span>
      </div>

      <article class="natal-main-conclusion">
        <span>原局一句话</span>
        <p>${display(mainText)}</p>
      </article>

      <div class="natal-overview-points">
        <article>
          <b>核心优势</b>
          <p>${display(advantageText)}</p>
        </article>
        <article>
          <b>主要压力</b>
          <p>${display(pressureText)}</p>
        </article>
        <article>
          <b>现实验证</b>
          <p>${display(realityText)}</p>
        </article>
      </div>
    </section>
  `;
}

function buildOverviewItems(summary = {}, cards = [], needVerify = []) {
  const fallbackCards = fallbackOverviewTopics
    .map((topic) => cards.find((card) => card.topic === topic))
    .filter(Boolean);
  const highCards = cards.filter((card) => card.level === "high");
  const firstHighCard = highCards[0] ?? fallbackCards[0] ?? cards[0] ?? {};
  const pressureCard = cards.find((card) => card.confidence === "low")
    ?? cards.find((card) => card.boundary)
    ?? fallbackCards[1]
    ?? cards[1]
    ?? {};
  const realityCard = fallbackCards.find((card) => card.reality)
    ?? cards.find((card) => card.reality)
    ?? {};

  return [
    ["一句话总览", summary.mainImage || fallbackCards.map((card) => card.image).filter(Boolean).slice(0, 2).join("；")],
    ["核心优势", firstHighCard.image || firstHighCard.title || summary.mainStructure],
    ["主要压力", summary.usefulHint || pressureCard.boundary || pressureCard.title],
    ["现实验证点", realityCard.reality || compact(needVerify)[0] || summary.boundary],
  ];
}

function renderKeywordSummary(cards = []) {
  const chips = cards
    .map((card) => ({
      label: card.tags?.[0] || card.title || topicLabels[card.topic] || card.topic,
      level: card.level || card.confidence || "medium",
      confidence: card.confidence || "medium",
    }))
    .filter((item) => item.label)
    .slice(0, 6);
  return `
    <section class="natal-keyword-section">
      <div class="board-title">
        <h3>关键取象摘要</h3>
        <span>${safe(chips.length)} 个关键词</span>
      </div>
      <div class="natal-keyword-chips">
        ${chips.map((item) => `<span class="natal-keyword-chip is-${safe(item.level)}">${display(item.label)}<small>${safe(confidenceLabel(item.confidence))}</small></span>`).join("")}
      </div>
    </section>
  `;
}

function renderGroupedCards(cards = []) {
  return `
    <section class="natal-grouped-cards">
      <div class="board-title">
        <h3>原局九项取象</h3>
        <span>3 类 · ${safe(cards.length)} 个维度</span>
      </div>
      ${cardGroups.map((group) => renderCardGroup(group, cards)).join("")}
    </section>
  `;
}

function renderCardGroup(group, cards = []) {
  const rows = group.topics
    .map((topic) => cards.find((card) => card.topic === topic))
    .filter(Boolean);

  return `
    <details class="natal-card-group natal-card-group-entry">
      <summary>
        <span>
          <strong>${safe(group.title)}</strong>
          <small>${safe(group.desc || "点击查看该组取象")}</small>
        </span>
        <b>${safe(rows.length)} 张</b>
      </summary>
      <div class="natal-compact-grid">
        ${rows.map(renderImageCard).join("")}
      </div>
    </details>
  `;
}

function renderImageCard(card = {}) {
  return `
    <details class="natal-image-card natal-compact-card">
      <summary>
        <div>
          <span>${safe(topicLabels[card.topic] ?? card.topic)}</span>
          <h3>${display(card.title)}</h3>
          <p>${display(card.image)}</p>
        </div>
        <div class="natal-card-footer">
          <span class="confidence-chip">${safe(confidenceLabel(card.confidence))}</span>
          <span class="natal-card-toggle"><b class="is-closed">展开依据</b><b class="is-open">收起依据</b></span>
        </div>
      </summary>
      <div class="natal-card-detail">
        ${renderList("命盘证据", card.evidence)}
        ${renderParagraph("现实应象", card.reality)}
        ${renderParagraph("成立边界", card.boundary)}
        ${renderList("需要验证的问题", [card.boundary])}
      </div>
    </details>
  `;
}


function renderList(title, items = []) {
  const rows = compact(items);
  return rows.length ? `<section><h4>${safe(title)}</h4><ul>${rows.map((item) => `<li>${display(item)}</li>`).join("")}</ul></section>` : "";
}

function renderParagraph(title, text) {
  return text ? `<section><h4>${safe(title)}</h4><p>${display(text)}</p></section>` : "";
}

function compact(items = []) {
  return (Array.isArray(items) ? items : [items])
    .flat()
    .filter((item) => item !== undefined && item !== null && String(item).trim())
    .map((item) => String(item));
}

function safe(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function display(value) {
  return safe(humanizeText(value));
}

function confidenceLabel(value) {
  return confidenceLabels[value] ?? value ?? "可参考";
}

function humanizeText(value) {
  return String(value ?? "")
    .replace(/当前强弱初判为(weak|strong|balanced|medium|mixed|none)/g, (_, level) => `当前强弱初判${strengthLabels[level] ?? level}`)
    .replace(/强弱初判为(weak|strong|balanced|medium|mixed|none)/g, (_, level) => `强弱初判${strengthLabels[level] ?? level}`)
    .replace(/强弱初判：(weak|strong|balanced|medium|mixed|none)，?分值?\d*/g, (_, level) => `强弱初判：${strengthLabels[level] ?? level}，仅作为后续取象方向提示`)
    .replace(/，?分值\d+/g, "")
    .replace(/\bweak\b/g, "偏弱")
    .replace(/\bstrong\b/g, "偏强")
    .replace(/\bbalanced\b/g, "平衡")
    .replace(/\bmixed\b/g, "需复核")
    .replace(/\bhigh\b/g, "重点")
    .replace(/\bmedium\b/g, "可参考")
    .replace(/\blow\b/g, "待验证")
    .replace(/\bconfidence\b/gi, "参考级别")
    .replace(/\bmodel\b/gi, "模型")
    .replace(/\bscore\b/gi, "分值");
}
