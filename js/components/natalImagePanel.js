import { buildNatalEvidencePack } from "../core/evidence/evidencePackBuilder.js";
import { buildNatalMasterSummary } from "../core/master-summary/masterSummaryEngine.js";

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

const portraitLabels = {
  personality: "性格底色",
  family: "家庭与早年",
  sibling_friend: "兄弟朋友",
  study_skill: "学业技能",
  career: "事业方向",
  wealth: "财富方式",
  relationship: "感情婚姻",
  health: "健康体质",
  movement: "迁移环境",
  life_pattern: "人生主线",
};
const portraitOrder = [
  "personality",
  "family",
  "sibling_friend",
  "study_skill",
  "career",
  "wealth",
  "relationship",
  "health",
  "movement",
  "life_pattern",
];
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
const mainLinePriority = [
  "life_pattern",
  "personality",
  "career",
  "wealth",
  "relationship",
  "study_skill",
  "family",
  "movement",
  "health",
];
const mainLineTitles = {
  life_pattern: "人生主线",
  personality: "自我与性格",
  career: "事业与职责",
  wealth: "财务方式",
  relationship: "关系牵动",
  study_skill: "学习与技能",
  family: "家庭背景",
  movement: "迁动环境",
  health: "体质状态",
};
const topicKeywordFallbacks = {
  life_pattern: ["长期模式", "结构重心", "岁运复核"],
  personality: ["自我系统", "行为风格", "边界感"],
  career: ["事业方向", "岗位角色", "执行压力"],
  wealth: ["资源调度", "财务方式", "承载力"],
  relationship: ["关系模式", "牵连感", "边界调整"],
  study_skill: ["学习吸收", "技能输出", "证照资料"],
  family: ["家庭结构", "早年环境", "成长秩序"],
  movement: ["环境变化", "迁动转换", "节奏调整"],
  health: ["体质观察", "寒暖燥湿", "生活习惯"],
};
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

const hitTopicDomains = {
  personality: ["self", "fortune"],
  family: ["parents", "property"],
  study_skill: ["children", "career", "fortune"],
  career: ["career", "self"],
  wealth: ["wealth", "friends"],
  relationship: ["spouse", "friends"],
  health: ["health", "fortune"],
  movement: ["movement", "property"],
  life_pattern: ["self", "fortune", "career"],
};


export function renderNatalImagePanel(root, report, context = {}) {
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
    ${renderNatalMasterSummary(report, context)}
    ${renderNatalDomainReport(report)}
    ${renderNatalHitListSection(report)}
  `;

  bindNatalEvidencePopup(root);
}

function renderNatalMasterSummary(report = {}, context = {}) {
  const domains = buildNatalDomainCards(report);
  const hitList = buildNatalHitList(report);
  const summary = buildNatalMasterSummary({
    summary: report.summary,
    twelveDomains: domains,
    hitList,
    database: context.masterSummaryDatabase,
  });
  const sectionTexts = Array.isArray(summary.sections) && summary.sections.length
    ? summary.sections
    : [
      { key: "main", title: "命局主线", text: summary.paragraph },
      { key: "reality", title: "现实牵动", text: summary.realityLine },
    ].filter((section) => section.text);
  return `
    <section class="natal-master-summary">
      <p class="eyebrow">命理师总批</p>
      <h3>${display(summary.headline)}</h3>
      <div class="natal-master-sections">
        ${sectionTexts.map((section) => `
          <p><b>${display(section.title)}</b>${display(section.text)}</p>
        `).join("")}
      </div>
      ${summary.mainLines?.length ? `
        <div class="natal-master-lines">
          ${summary.mainLines.map((line) => `
            <span>${display(line.label)}</span>
          `).join("")}
        </div>
      ` : ""}
    </section>
  `;
}

function renderNatalDomainReport(report = {}) {
  const domains = buildNatalDomainCards(report);
  return `
    <section class="natal-portrait-section natal-domain-section">
      <div class="board-title">
        <h3>十二维命局画像</h3>
        <span>${safe(domains.length)} 个方面</span>
      </div>
      <div class="natal-domain-grid">
        ${domains.map((domain, index) => renderNatalDomainCard(domain, index)).join("")}
      </div>
    </section>
  `;
}

function renderNatalDomainCard(domain = {}, index = 0) {
  const keywords = compact(domain.keywords || domain.tags).slice(0, 5);
  return `
    <article class="natal-domain-card natal-summary-card">
      <div class="natal-domain-card-head">
        <div>
          <span>${display(domain.label)}</span>
          <i class="natal-domain-index">${String(index + 1).padStart(2, "0")}</i>
        </div>
        <strong>${display(domain.title)}</strong>
      </div>
      <p class="natal-domain-judgement">${display(cleanCardText(domain.judgement || domain.summary || "这一项不是原局最突出的主线，更多要等大运流年引动后才会明显。", 2))}</p>
      <p class="natal-domain-manifestation">${display(cleanCardText(domain.manifestation || domain.reality || "这一项会通过阶段环境、现实选择和岁运触发慢慢显出来。", 2))}</p>
      <p class="natal-domain-pressure">${display(cleanCardText(domain.pressure || "压力点要回到对应柱位、十神强弱和岁运触发里确认。", 1))}</p>
      <div class="natal-domain-keywords">
        ${keywords.map((keyword) => `<span>${display(keyword)}</span>`).join("")}
      </div>
      <button type="button" class="natal-evidence-open">查看依据</button>
      <template class="natal-evidence-template">
        ${renderDomainEvidenceDetail(domain)}
      </template>
    </article>
  `;
}

function renderNatalHitListSection(report = {}) {
  const rows = buildNatalHitList(report);
  const chips = rows.slice(0, 8);
  return `
    <section class="natal-hit-index">
      <div class="board-title">
        <h3>取象索引</h3>
        <span>共 ${safe(rows.length)} 个象</span>
      </div>
      <p class="natal-hit-intro">系统从四柱、十神、藏干、五行、关系和结构中提取到的主要取象。</p>
      ${chips.length ? `
        <div class="natal-hit-summary-chips">
          ${chips.map((item) => `<span>${display(item.name)}</span>`).join("")}
        </div>
      ` : `<p class="muted">当前原局未形成可列出的明显取象。</p>`}
      ${rows.length ? `
        <details class="natal-hit-details">
          <summary>展开全部取象依据</summary>
          <div class="natal-hit-compact-list">
            ${rows.map(renderNatalHitCard).join("")}
          </div>
        </details>
      ` : ""}
    </section>
  `;
}

function renderNatalHitCard(item = {}) {
  const detailItems = compact(item.evidence).slice(0, 5);
  return `
    <article class="natal-hit-row is-${safe(item.importance || "medium")}">
      <div class="natal-hit-main">
        <span>${display(item.category || item.type || "取象")} · ${display(confidenceLabel(item.importance || item.confidence || "medium"))}</span>
        <strong>${display(item.name)}</strong>
        <p class="natal-hit-domains">对应方面：${display(compact(item.domains).join("、") || "原局命局画像")}</p>
      </div>
      <details class="natal-hit-detail">
        <summary class="natal-hit-evidence-button">依据</summary>
        <div class="natal-hit-detail-body">
          <p><b>来源</b><span>${display(item.source || "原局结构")}</span></p>
          <p><b>含义</b><span>${display(item.brief || compact(item.image).join("、") || "该象用于支撑原局命局画像。")}</span></p>
          ${detailItems.length ? `
            <ul>
              ${detailItems.map((detail) => `<li>${display(detail)}</li>`).join("")}
            </ul>
          ` : `<p class="muted">详细证据可在查看依据弹窗和内部证据包中追溯。</p>`}
        </div>
      </details>
    </article>
  `;
}

function renderReasonChain(report = {}) {
  const rows = buildNatalReasonChain(report);
  return `
    <section class="natal-reason-chain">
      <div class="board-title">
        <h3>专业推理链</h3>
        <span>展开后供师傅复核</span>
      </div>
      <ol>
        ${rows.map((row) => `
          <li>
            <b>${display(row.title)}</b>
            <p>${display(row.text)}</p>
          </li>
        `).join("")}
      </ol>
    </section>
  `;
}

function buildNatalAiEvidencePack(report = {}) {
  return {
    summary: report.summary,
    twelveDomains: buildNatalDomainCards(report),
    hitList: buildNatalHitList(report),
    instruction: "AI 只能基于命局画像和命中取象清单扩展说明，不能重新排盘，不能脱离证据另起判断。",
  };
}

function buildNatalDomainCards(report = {}) {
  return Array.isArray(report.twelveDomains) && report.twelveDomains.length
    ? report.twelveDomains
    : buildNatalPortraitCards(report).map((card) => ({
      key: card.card?.topic || card.label,
      label: card.label,
      title: card.title,
      judgement: card.text,
      manifestation: card.reality,
      summary: card.text,
      reality: card.reality,
      keywords: card.keywords,
      tags: card.keywords,
      evidence: compact(card.card?.evidence),
      matchedCombinations: [],
      condition: compact([card.card?.boundary]),
      bookExplanation: "此维度从原局取象卡和命盘证据综合参考。",
      counterEvidence: compact([card.card?.boundary]),
      confidence: card.card?.confidence || "medium",
    }));
}

function buildNatalHitList(report = {}) {
  const domains = buildNatalDomainCards(report);
  const byKey = new Map(domains.map((domain) => [domain.key, domain]));
  const rows = [];

  for (const domain of domains) {
    for (const combination of domain.matchedCombinations || []) {
      const id = combination.id || combination.label;
      const existing = rows.find((row) => row.id === id);
      if (existing) {
        existing.supports = uniqueText([...existing.supports, domain.key]);
        existing.domains = uniqueText([...existing.domains, domain.label]);
        continue;
      }
      rows.push({
        id,
        name: combination.label,
        type: "组合",
        category: "组合象",
        importance: normalizeImportance(domain.confidence || "medium"),
        source: "领域组合规则",
        evidence: compact([combination.evidenceText, combination.judgement]),
        image: compact(combination.keywords).length ? compact(combination.keywords) : [combination.manifestation],
        brief: buildHitBrief({
          category: "组合象",
          name: combination.label,
          image: compact(combination.keywords),
          fallback: combination.manifestation,
        }),
        domains: compact([domain.label]),
        supports: compact([domain.key]),
        confidence: domain.confidence || "medium",
      });
    }
  }

  for (const card of compactCards(report.imageCards)) {
    const supports = hitTopicDomains[card.topic] || [];
    rows.push({
      id: `image-${card.topic || card.title}`,
      name: card.title || topicLabels[card.topic] || "原局取象",
      type: "原局取象",
      category: hitCategoryFromTopic(card.topic),
      importance: normalizeImportance(card.level || card.confidence || "medium"),
      source: topicLabels[card.topic] || "原局取象报告",
      evidence: compact(card.evidence).slice(0, 4),
      image: buildPortraitKeywords(card),
      brief: buildHitBrief({
        category: hitCategoryFromTopic(card.topic),
        name: card.title || topicLabels[card.topic] || "原局取象",
        image: buildPortraitKeywords(card),
        fallback: card.image || card.reality,
      }),
      domains: supports.map((key) => byKey.get(key)?.label).filter(Boolean),
      supports,
      confidence: card.confidence || card.level || "medium",
    });
  }

  for (const item of compact(report.keySignals).slice(0, 6)) {
    const domainsForSignal = domains
      .filter((domain) => compact([domain.title, domain.judgement, domain.manifestation, domain.evidence]).join(" ").includes(item.split("：")[0]))
      .slice(0, 3);
    rows.push({
      id: `signal-${item}`,
      name: item.split("：")[0] || "关键结构",
      type: "结构",
      category: hitCategoryFromText(item),
      importance: "medium",
      source: "关键取象",
      evidence: [item],
      image: [item],
      brief: buildHitBrief({
        category: hitCategoryFromText(item),
        name: item.split("：")[0] || "关键结构",
        image: [item],
        fallback: item,
      }),
      domains: domainsForSignal.length ? domainsForSignal.map((domain) => domain.label) : domains.slice(0, 2).map((domain) => domain.label),
      supports: domainsForSignal.map((domain) => domain.key),
      confidence: "medium",
    });
  }

  return dedupeHitRows(rows)
    .sort((a, b) => confidenceScore(b.confidence) - confidenceScore(a.confidence))
    .slice(0, 18);
}

function dedupeHitRows(rows = []) {
  const seen = new Map();
  for (const row of rows) {
    const key = row.id || row.name;
    if (!key) continue;
    const current = seen.get(key);
    if (!current) {
      seen.set(key, {
        ...row,
        evidence: compact(row.evidence),
        image: compact(row.image),
        domains: compact(row.domains),
        supports: compact(row.supports),
      });
      continue;
    }
    current.evidence = uniqueText([...current.evidence, ...compact(row.evidence)]).slice(0, 5);
    current.image = uniqueText([...current.image, ...compact(row.image)]).slice(0, 6);
    current.domains = uniqueText([...current.domains, ...compact(row.domains)]).slice(0, 6);
    current.supports = uniqueText([...current.supports, ...compact(row.supports)]).slice(0, 6);
      current.confidence = confidenceScore(row.confidence) > confidenceScore(current.confidence)
      ? row.confidence
      : current.confidence;
    current.importance = confidenceScore(row.importance) > confidenceScore(current.importance)
      ? row.importance
      : current.importance;
  }
  return [...seen.values()].filter((row) => row.name);
}

function normalizeImportance(value = "medium") {
  if (value === "high") return "high";
  if (value === "low") return "low";
  return "medium";
}

function hitCategoryFromTopic(topic = "") {
  if (topic === "relationship") return "关系象";
  if (topic === "movement") return "关系象";
  if (topic === "health") return "五行象";
  if (topic === "family") return "柱位象";
  if (topic === "life_pattern") return "柱位象";
  if (topic === "personality") return "十神象";
  return "十神象";
}

function hitCategoryFromText(text = "") {
  if (/(冲|合|刑|害|破|伏吟|反吟)/.test(text)) return "关系象";
  if (/(五行|寒|暖|燥|湿|木|火|土|金|水)/.test(text)) return "五行象";
  if (/(年柱|月柱|日柱|时柱)/.test(text)) return "柱位象";
  if (/(贵人|桃花|华盖|驿马|将星|羊刃)/.test(text)) return "神煞象";
  return "十神象";
}

function buildHitBrief({ category = "取象", image = [], fallback = "" } = {}) {
  const images = compact(image).slice(0, 4);
  if (images.length) return `${images.join("、")}这几类象较有存在感。`;
  if (fallback) return limitText(fallback, 52);
  if (category === "关系象") return "关系、牵连、边界和现实触发之间有联系。";
  if (category === "五行象") return "五行偏性会落到性格、体质或长期状态里。";
  if (category === "柱位象") return "柱位信息用于定位人生阶段、关系位置和现实落点。";
  return "该象用于支撑原局命局画像。";
}

function limitText(text = "", maxLength = 52) {
  const value = String(text).replace(/\s+/g, " ").trim();
  return value.length > maxLength ? `${value.slice(0, maxLength)}…` : value;
}

function firstSentence(text = "") {
  const value = String(text).replace(/\s+/g, " ").trim();
  return value.match(/[^。！？!?]+[。！？!?]?/)?.[0]?.trim() || value;
}

function cleanCardText(text = "", maxSentences = 2) {
  const value = String(text).replace(/\s+/g, " ").trim();
  if (!value) return "";
  const parts = value.match(/[^。！？!?]+[。！？!?]?/g) ?? [value];
  return parts.slice(0, maxSentences).join("").trim();
}

function confidenceScore(value) {
  return { high: 3, medium: 2, low: 1 }[value] ?? 2;
}

function buildNatalPortraitCards(report = {}) {
  const sourceCards = compactCards(report.imageCards);
  const byTopic = new Map(sourceCards.map((card) => [card.topic, card]));
  const siblingCard = buildSiblingFriendCard(report);
  const cards = portraitOrder
    .map((topic) => topic === "sibling_friend" ? siblingCard : byTopic.get(topic))
    .filter(Boolean)
    .map((card) => ({
      label: portraitLabels[card.topic] || topicLabels[card.topic] || card.title || "原局取象",
      title: card.title || portraitLabels[card.topic] || "原局取象",
      text: card.image || card.title || "",
      reality: card.reality || card.image || card.boundary || "",
      keywords: buildPortraitKeywords(card),
      card,
    }));
  return cards;
}

function buildSiblingFriendCard(report = {}) {
  const cards = compactCards(report.imageCards);
  const joined = compact([report.summary?.mainImage, report.summary?.mainStructure, cards.map((card) => [card.title, card.image, card.reality, card.evidence].flat().join(" "))]).join(" ");
  if (!/(比肩|劫财|比劫|同辈|竞争|合作|朋友|资源分配|资源分摊)/.test(joined)) return null;
  const baseCard = cards.find((card) => /(同辈|竞争|合作|自我|资源)/.test(compact([card.title, card.image, card.reality, card.evidence]).join(" ")))
    || cards.find((card) => card.topic === "personality")
    || cards.find((card) => card.topic === "relationship")
    || {};
  return {
    ...baseCard,
    topic: "sibling_friend",
    title: "同辈关系与合作竞争需要留意",
    image: "同辈、朋友、合作和资源分配容易成为现实里反复出现的主题。",
    reality: "现实中多表现为有自己的节奏，遇到合作、分工、朋友往来时，边界和利益分配需要说清楚。",
    evidence: compact(baseCard.evidence),
    boundary: baseCard.boundary || "同辈关系只是原局取象之一，仍要结合实际人际环境和岁运触发。",
  };
}

function buildNatalFocusItems(report = {}) {
  const cards = buildNatalDomainCards(report);
  const high = cards.find((card) => card.confidence === "high") || cards[0];
  const relation = cards.find((card) => /(关系|合作|牵连|迁动|变化|人脉|同辈)/.test(compact([card.title, card.summary, card.reality, card.evidence]).join(" "))) || cards[1];
  const verify = cards.find((card) => card.confidence === "low" || compact(card.counterEvidence).length > 1) || cards[2];
  return [
    {
      title: "最明显的结构",
      text: high ? `${high.label}较突出，${high.summary || high.reality}` : report.summary?.mainImage || "原局结构需要结合现实反馈确认轻重。",
    },
    {
      title: "最容易应事的地方",
      text: relation ? `${relation.label}容易被现实事件带出来，${relation.reality || relation.summary}` : "人事关系和环境变化可作为后续观察重点。",
    },
    {
      title: "最需要验证的地方",
      text: compact(verify?.counterEvidence)[0] || report.summary?.boundary || "原局只提供倾向，仍要结合实际背景和岁运触发复核。",
    },
  ];
}

function buildNatalMainLines(report = {}) {
  const cards = compactCards(report.imageCards);
  const sorted = cards
    .map((card) => ({
      card,
      score: mainLineScore(card, cards),
    }))
    .sort((a, b) => b.score - a.score)
    .map(({ card }) => card);
  return sorted.slice(0, 3).map((card) => ({
    title: mainLineTitles[card.topic] || topicLabels[card.topic] || card.title || "原局主线",
    signal: card.title || topicLabels[card.topic] || "结构主题",
    text: buildMainLineText(card),
    keywords: buildMainLineKeywords(card),
    evidence: compact(card.evidence),
    card,
  }));
}

function buildNatalReasonChain(report = {}) {
  const summary = report.summary || {};
  const mainLines = buildNatalMainLines(report);
  const relationCard = findRelationCard(report.imageCards || []);
  return [
    {
      title: "先看日主",
      text: summary.dayMaster
        ? `${summary.dayMaster}为观察入口，再看月令、透干和地支承接。`
        : summary.mainStructure || "日主信息待基础排盘生成后复核。",
    },
    {
      title: "再看结构重心",
      text: mainLines[0]?.text || summary.mainImage || "结构重心需结合五行、十神和月令复核。",
    },
    {
      title: "再看辅助力量",
      text: mainLines[1]?.text || summary.usefulHint || "辅助力量需看印比、食伤、财官是否能承接主线。",
    },
    {
      title: "再看关系牵动",
      text: relationCard
        ? buildMainLineText(relationCard)
        : "原局关系触发暂不突出，先保留为后续岁运复核线索。",
    },
    {
      title: "合成判断",
      text: summary.mainImage || compact(mainLines.map((line) => line.signal)).join("；") || "原局主线需结合现实反馈再定轻重。",
    },
  ];
}

function buildNatalImageEvidenceCards(evidencePack = {}) {
  const hitCards = (evidencePack.hits || []).map((hit) => ({
    label: hit.label,
    kind: hit.type === "pattern" ? "命中象" : "十神象",
    source: hit.source,
    basis: compact([hit.source]),
    condition: hit.condition,
    bookExplanation: compact([hit.bookExplanation]),
    realityImages: hit.realityImages,
    counterEvidence: hit.counterEvidence,
  }));
  const relationCards = groupNatalRelations(evidencePack.relations || []);

  return [...hitCards, ...relationCards].filter((item) => item.label);
}

function groupNatalRelations(relations = []) {
  const groups = new Map();
  relations.forEach((relation) => {
    const pair = extractRelationPair(relation.description);
    const key = pair || relation.label || "关系触发";
    const current = groups.get(key) || {
      label: pair || relation.label || "关系触发",
      kind: "关系象",
      source: relation.label ? `关系：${relation.label}` : relation.source,
      basis: [],
      relationTypes: [],
      condition: relation.condition,
      bookExplanation: compact([relation.bookExplanation]),
      realityImages: relation.realityImages,
      counterEvidence: relation.counterEvidence,
    };
    current.relationTypes.push(extractRelationType(relation.description) || relation.label);
    groups.set(key, current);
  });

  return [...groups.values()].map((group) => ({
    ...group,
    relationTypes: uniqueText(group.relationTypes),
  })).map((group) => ({
    ...group,
    basis: [buildRelationBasis(group.label, group.relationTypes, {
      label: group.label,
      image: group.realityImages,
      condition: group.condition,
      source: group.source,
    })],
  }));
}

function renderNatalImageEvidenceCard(item = {}) {
  return `
    <article class="natal-image-evidence-card">
      <header>
        <span>${display(item.kind || "取象")}</span>
        <h5>${display(item.label)}</h5>
        ${item.source ? `<b>${display(item.source)}</b>` : ""}
      </header>
      <div class="natal-image-card-evidence-grid">
        ${renderEvidenceCardBlock("命盘依据", item.basis, item.kind === "关系象" ? "命中位置" : "")}
        ${renderEvidenceCardBlock("成立条件", item.condition)}
        ${renderEvidenceCardBlock("书籍解释", item.bookExplanation)}
        ${renderEvidenceCardBlock("现实对应", item.realityImages)}
        ${renderEvidenceCardBlock("反证方式", item.counterEvidence)}
      </div>
    </article>
  `;
}

function renderEvidenceCardBlock(title, items = [], prefix = "") {
  const rows = compact(items);
  return `
    <section>
      <h6>${safe(title)}</h6>
      ${rows.length
        ? `<ul>${rows.map((item) => `<li>${prefix ? `<b>${safe(prefix)}</b>` : ""}${display(item)}</li>`).join("")}</ul>`
        : `<p class="muted">暂无明确内容。</p>`}
    </section>
  `;
}

function bindNatalEvidencePopup(root) {
  root.querySelectorAll(".natal-evidence-open").forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest(".natal-summary-card");
      const title = card?.querySelector("h3, h4, h5")?.textContent?.trim() || "取象依据";
      const topic = card?.querySelector("header span")?.textContent?.trim() || "原局取象";
      const template = card?.querySelector(".natal-evidence-template");

      openNatalEvidencePopup({
        title,
        topic,
        content: template?.innerHTML || "<p>暂无依据。</p>",
      });
    });
  })
}

function openNatalEvidencePopup({ title, topic, content } = {}) {
  document.querySelector(".natal-evidence-popup-backdrop")?.remove();

  const backdrop = document.createElement("div");
  backdrop.className = "natal-evidence-popup-backdrop";
  backdrop.innerHTML = `
    <div class="natal-evidence-popup" role="dialog" aria-modal="true">
      <div class="natal-evidence-popup-head">
        <div>
          <p class="eyebrow">${safe(topic || "原局取象")}</p>
          <h3>${safe(title || "取象依据")}</h3>
        </div>
        <button type="button" class="natal-evidence-popup-close" aria-label="关闭">×</button>
      </div>
      <div class="natal-evidence-popup-body">
        ${content}
      </div>
    </div>
  `;

  backdrop.addEventListener("click", (event) => {
    if (event.target === backdrop) backdrop.remove();
  });

  backdrop.querySelector(".natal-evidence-popup-close")?.addEventListener("click", () => {
    backdrop.remove();
  });

  document.body.appendChild(backdrop);
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
    <details class="natal-grouped-cards natal-grouped-details">
      <summary>
        <span>
          <strong>原局九项取象明细</strong>
          <small>性格、家庭、学业、事业、财务、感情等维度，供展开复核。</small>
        </span>
        <b>3 类 · ${safe(cards.length)} 个维度</b>
      </summary>
      <div class="natal-grouped-details-body">
        ${cardGroups.map((group) => renderCardGroup(group, cards)).join("")}
      </div>
    </details>
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
    <article class="natal-image-card natal-compact-card natal-summary-card">
      <header>
        <span>${safe(topicLabels[card.topic] ?? card.topic)}</span>
        <h3>${display(card.title)}</h3>
      </header>

      <p>${display(card.image)}</p>

      ${card.reality ? `<small class="natal-card-reality">${display(card.reality)}</small>` : ""}

      <footer class="natal-card-footer">
        <span class="confidence-chip">${safe(confidenceLabel(card.confidence))}</span>
        <button type="button" class="natal-evidence-open">查看依据</button>
      </footer>

      <template class="natal-evidence-template">
        ${renderCardEvidenceDetail(card)}
      </template>
    </article>
  `;
}

function renderCardEvidenceDetail(card = {}) {
  const evidenceRows = compact(card.evidence);

  return `
    <div class="natal-card-detail natal-evidence-detail">
      <section class="natal-evidence-block">
        <h4>命盘依据</h4>
        ${evidenceRows.length
          ? `<div class="natal-evidence-list">
              ${evidenceRows.map((item, index) => `
                <p>
                  <b>${safe(index + 1)}</b>
                  <span>${display(item)}</span>
                </p>
              `).join("")}
            </div>`
          : `<p class="muted">暂无明确证据，需结合整体结构复核。</p>`}
      </section>

      <div class="natal-evidence-two-col">
        ${card.reality ? `
          <section class="natal-evidence-block is-reality">
            <h4>现实应象</h4>
            <p>${display(card.reality)}</p>
          </section>
        ` : ""}

        ${card.boundary ? `
          <section class="natal-evidence-block is-boundary">
            <h4>成立边界</h4>
            <p>${display(card.boundary)}</p>
          </section>
        ` : ""}
      </div>
    </div>
  `;
}

function renderDomainEvidenceDetail(domain = {}) {
  return `
    <div class="natal-card-detail natal-evidence-detail">
      <section class="natal-evidence-block">
        <h4>命盘依据</h4>
        ${renderEvidenceParagraphList(domain.evidence)}
      </section>
      <section class="natal-evidence-block">
        <h4>命中组合</h4>
        ${renderCombinationList(domain.matchedCombinations)}
      </section>
      <section class="natal-evidence-block">
        <h4>资料解释</h4>
        <p>${display(domain.bookExplanation || "此维度需结合四柱、十神、五行、藏干与关系触发综合参考。")}</p>
      </section>
      <div class="natal-evidence-two-col">
        <section class="natal-evidence-block is-reality">
          <h4>成立条件</h4>
          ${renderEvidenceParagraphList(domain.condition)}
        </section>
        <section class="natal-evidence-block is-reality">
          <h4>现实对应</h4>
          <p>${display(domain.manifestation || domain.reality || domain.summary || "这一项会通过阶段环境、现实选择和岁运触发慢慢显出来。")}</p>
        </section>
        <section class="natal-evidence-block is-boundary">
          <h4>反证方式</h4>
          ${renderEvidenceParagraphList(domain.counterEvidence)}
        </section>
      </div>
    </div>
  `;
}

function renderCombinationList(items = []) {
  const rows = Array.isArray(items) ? items : [];
  return rows.length
    ? `<div class="natal-evidence-list">
        ${rows.map((item, index) => `
          <p>
            <b>${safe(index + 1)}</b>
            <span>${display(compact([item.label, item.judgement, item.evidenceText]).join("："))}</span>
          </p>
        `).join("")}
      </div>`
    : `<p class="muted">本项以单项命盘证据为主，组合命中不算突出。</p>`;
}

function renderEvidenceParagraphList(items = []) {
  const rows = compact(items);
  return rows.length
    ? `<div class="natal-evidence-list">
        ${rows.map((item, index) => `
          <p>
            <b>${safe(index + 1)}</b>
            <span>${display(item)}</span>
          </p>
        `).join("")}
      </div>`
    : `<p class="muted">暂无明确证据，需结合整体结构复核。</p>`;
}

function compactCards(cards = []) {
  return (Array.isArray(cards) ? cards : []).filter((card) => card && (card.title || card.image || card.topic));
}

function mainLineScore(card = {}, cards = []) {
  const priorityIndex = mainLinePriority.indexOf(card.topic);
  const priorityScore = priorityIndex >= 0 ? (mainLinePriority.length - priorityIndex) * 10 : 0;
  const levelScore = card.level === "high" ? 60 : card.level === "medium" ? 30 : 0;
  const confidenceScore = card.confidence === "high" ? 24 : card.confidence === "medium" ? 12 : 0;
  const relationBoost = card.topic === "relationship" && hasRelationSignal(card) ? 55 : 0;
  const evidenceScore = Math.min(compact(card.evidence).length, 5);
  const highCount = cards.filter((item) => item.level === "high").length;
  return priorityScore + levelScore + confidenceScore + relationBoost + evidenceScore + (highCount ? 0 : priorityScore);
}

function buildMainLineText(card = {}) {
  const signal = card.title || topicLabels[card.topic] || "这个取象";
  const image = card.image || card.reality || card.boundary || "需要结合命盘证据和现实反馈复核。";
  return `${signal}，${image}`;
}

function buildMainLineKeywords(card = {}) {
  const fromText = compact([card.image, card.reality])
    .join("，")
    .split(/[，、；。:：,]/)
    .map((item) => item.trim())
    .filter((item) => item.length >= 2 && item.length <= 8)
    .slice(0, 3);
  return uniqueText([...fromText, ...(topicKeywordFallbacks[card.topic] || [])]).slice(0, 4);
}

function buildPortraitKeywords(card = {}) {
  const fromTags = compact(card.tags);
  const fromText = compact([card.image, card.reality, card.title])
    .join("，")
    .split(/[，、；。:：,]/)
    .map((item) => item.trim())
    .filter((item) => item.length >= 2 && item.length <= 8);
  return uniqueText([...fromTags, ...fromText, ...(topicKeywordFallbacks[card.topic] || [])]).slice(0, 4);
}

function findRelationCard(cards = []) {
  return compactCards(cards).find((card) => card.topic === "relationship" || hasRelationSignal(card));
}

function hasRelationSignal(card = {}) {
  return compact([card.title, card.image, card.reality, card.boundary, card.evidence])
    .join(" ")
    .includes("关系");
}

function extractRelationPair(text = "") {
  const match = String(text).match(/([^：:]+?)\s*与\s*([^：:]+?)[:：]/);
  return match ? `${match[1].trim()} ↔ ${match[2].trim()}` : "";
}

function extractRelationType(text = "") {
  const match = String(text).match(/见([^，；。]+)/);
  return match?.[1]?.trim() || "";
}

function buildRelationBasis(pair, relationTypes = [], relation = {}) {
  const types = uniqueText(relationTypes).join("、") || relation.label || "关系触发";
  const images = compact(relation.image).slice(0, 3).join("、");
  const review = compact(relation.condition).slice(0, 2).join("；");
  return compact([
    pair || relation.description || relation.source,
    types ? `命中：${types}` : "",
    images ? `取象：${images}` : "",
    review ? `复核：${review}` : "",
  ]).join("；");
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

function uniqueText(items = []) {
  return [...new Set(compact(items))];
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
    .replace(/通根综合为none/g, "通根综合为不显")
    .replace(/\bnone\b/g, "不显")
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
