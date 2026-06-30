export const defaultMasterSummaryDatabase = {
  version: 1,
  rules: [
    {
      id: "self_rhythm",
      label: "自我节奏线",
      hitKeywords: ["日主", "自我", "比劫", "主见", "边界", "性格", "节奏", "脾气"],
      domains: ["self", "fortune"],
      priority: 96,
      headline: "自我节奏和内在边界是主线。",
      paragraph: "这个盘先落在人本身，性格里有自己的节奏和判断，不是完全随环境走。遇到人事压力、合作分工或环境变化时，内在反应会比较快，边界感和被尊重感也容易被带出来。",
      reality: "现实落点多在做事节奏、主见、脾气反应、边界感和与人配合的方式上。",
      boundary: "复核时要回到日主强弱、月令承接、比劫轻重和现实阶段，不能只凭一个自我信号定性。",
    },
    {
      id: "wealth_people",
      label: "财务人情线",
      hitKeywords: ["财星", "财帛", "财富", "钱财", "比劫", "资源", "合作", "人情", "分配", "合伙"],
      domains: ["wealth", "siblings", "friends"],
      priority: 92,
      headline: "钱财和人情合作容易绑在一起看。",
      paragraph: "这个盘的财务线不适合只看有没有财星，还要看钱财进入之后怎么被人情、合作、项目和资源分配牵动。若同辈或合作信号同时明显，财务方式更像一边有机会，一边也要处理分摊和边界。",
      reality: "现实落点多在合伙分利、朋友人情、项目开销、资源调度和钱财能否留住上。",
      boundary: "复核时要看食伤能否生财、财星是否透藏有根，以及后续阶段是否把财星或食伤带出来。",
    },
    {
      id: "career_rules",
      label: "规则事业线",
      hitKeywords: ["官杀", "事业", "官禄", "职责", "规则", "岗位", "考核", "印星", "食伤", "专业"],
      domains: ["career", "self", "fortune"],
      priority: 88,
      headline: "事业更看规则、职责和专业承接。",
      paragraph: "这个盘的事业线要从规则压力、岗位身份和能力输出一起看。若官杀、印星或食伤有承接，职业发展更容易围绕责任、专业、平台和长期稳定性展开。",
      reality: "现实落点多在岗位角色、证照资质、专业交付、考核压力和组织规则里。",
      boundary: "复核时要看官杀是否有印承接、食伤是否过度顶规则，以及现实行业是否给到稳定平台。",
    },
    {
      id: "family_early",
      label: "家庭早年线",
      hitKeywords: ["父母", "家庭", "早年", "年柱", "月柱", "印星", "财星", "家中", "规则", "成长"],
      domains: ["parents", "property", "self"],
      priority: 84,
      headline: "早年秩序和家庭背景会参与性格底色。",
      paragraph: "这个盘不能只看成年后的选择，家庭早年、家中规则和父母分工也会留下底色。若年月柱或印财信号被带出来，做事方式里会带着早期环境给到的责任感、资源感或压力感。",
      reality: "现实落点多在家庭秩序、父母影响、成长资源、家宅承接和责任意识上。",
      boundary: "复核时要看年月柱关系、印财轻重和现实家庭结构，避免把早年背景直接等同为单一好坏。",
    },
    {
      id: "relationship_movement",
      label: "关系迁动线",
      hitKeywords: ["日支", "夫妻", "感情", "关系", "冲", "合", "刑", "害", "破", "迁移", "变化", "环境"],
      domains: ["spouse", "movement", "friends", "health"],
      priority: 86,
      headline: "关系和环境变化容易互相牵动。",
      paragraph: "这个盘遇到关系、人事或环境变化时，状态容易被带动。亲密关系、合作关系、居住环境或岗位环境不只是外部事件，也会影响安全感、节奏和现实责任分配。",
      reality: "现实落点多在感情沟通、合作牵连、搬动出行、岗位环境变化和压力反应上。",
      boundary: "复核时要看具体是哪一柱被触发、关系类型是否成局，以及后续阶段是否再次带动同一位置。",
    },
    {
      id: "learning_output",
      label: "学习输出线",
      hitKeywords: ["印星", "食伤", "学习", "表达", "输出", "技能", "作品", "项目", "子女", "结果"],
      domains: ["children", "career", "fortune"],
      priority: 82,
      headline: "学习吸收和表达输出可以连成一条线。",
      paragraph: "这个盘若印星和食伤同时有迹，不能只说会学，也要看能不能把资料、经验和训练转成表达、作品或项目结果。学习系统和输出系统配合得好，才容易形成稳定能力。",
      reality: "现实落点多在学习能力、证照资料、表达输出、作品成果、项目交付和长期规划上。",
      boundary: "复核时要看印星是否过重压住输出，食伤是否有财官承接，以及现实训练是否持续。",
    },
    {
      id: "health_spirit",
      label: "体质精神线",
      hitKeywords: ["健康", "疾厄", "体质", "五行", "寒湿", "燥热", "压力", "睡眠", "精神", "福德"],
      domains: ["health", "fortune"],
      priority: 78,
      headline: "体质和精神状态要从长期偏性看。",
      paragraph: "这个盘的身心状态更适合看长期倾向，不是单独落到某个断语。五行偏性、寒暖燥湿、压力反应和精神安全感会共同影响这个人是否容易放松、恢复和稳定。",
      reality: "现实落点多在睡眠、消化、紧绷感、精神消耗、兴趣系统和长期心态上。",
      boundary: "复核时要区分体质取象和医学判断，并结合生活习惯、现实压力和后续阶段确认轻重。",
    },
  ],
};

export async function loadMasterSummaryDatabase(fetcher = globalThis.fetch) {
  if (typeof fetcher !== "function") return defaultMasterSummaryDatabase;
  try {
    const response = await fetcher("/data/rules/natal/master-summary.json", { cache: "no-store" });
    if (!response?.ok) return defaultMasterSummaryDatabase;
    const data = await response.json();
    return normalizeDatabase(data).rules.length ? data : defaultMasterSummaryDatabase;
  } catch {
    return defaultMasterSummaryDatabase;
  }
}

export function buildNatalMasterSummary({
  summary = {},
  twelveDomains = [],
  hitList = [],
  featureVector = null,
  atomicFacts = null,
  domainEvidence = null,
  database = defaultMasterSummaryDatabase,
} = {}) {
  const natalSummary = filterNatalOnlyEvidence(summary);
  const natalHitList = filterNatalOnlyHits(hitList);
  const rules = normalizeDatabase(database).rules;
  const context = {
    summary: natalSummary,
    twelveDomains,
    hitList: natalHitList,
    featureVector,
    atomicFacts: Array.isArray(atomicFacts) ? { facts: atomicFacts } : atomicFacts,
    domainEvidence,
  };
  const scored = rules
    .map((rule) => scoreMasterRule(rule, context))
    .sort((a, b) => b.score - a.score || b.rule.priority - a.rule.priority);
  const selected = ensureMainLineCount(scored).slice(0, 3);

  if (!selected.length) return buildFallbackSummary({ summary: natalSummary, twelveDomains });

  const mainLines = selected.map(({ rule, evidence, selectedFacts }) => ({
    id: rule.id,
    label: rule.label,
    headline: stripTransitSignal(rule.headline),
    reality: stripTransitSignal(rule.reality),
    boundary: stripTransitSignal(rule.boundary),
    evidence,
    selectedFactIds: selectedFacts.map((fact) => fact.id),
  }));
  const selectedRules = selected.map((item) => item.rule);
  const headline = composeMasterHeadline(selectedRules, context);
  const sections = buildMasterSections(selectedRules, context);
  const paragraph = sections.map((section) => section.text).join("");
  const realityLine = sections.find((section) => section.key === "reality")?.text || buildRealityLine(selectedRules);
  const selectedFactIds = uniqueText(selected.flatMap((item) => item.selectedFacts.map((fact) => fact.id))).slice(0, 8);
  const evidence = uniqueText([
    selected.flatMap((item) => item.evidence),
    selected.flatMap((item) => item.selectedFacts.flatMap((fact) => fact.evidence ?? [])),
  ]).slice(0, 8);

  return {
    headline,
    sections,
    paragraph,
    realityLine,
    mainLines,
    selectedFactIds,
    tags: selectedRules.map((rule) => rule.label).slice(0, 3),
    evidence,
  };
}

function normalizeDatabase(database = {}) {
  const rules = Array.isArray(database) ? database : database.rules;
  return {
    ...database,
    rules: (Array.isArray(rules) ? rules : [])
      .filter((rule) => rule?.id && rule?.headline && rule?.paragraph)
      .map((rule) => ({
        ...rule,
        hitKeywords: compact(rule.hitKeywords),
        domains: compact(rule.domains),
        priority: Number.isFinite(rule.priority) ? rule.priority : 50,
      })),
  };
}

function scoreMasterRule(rule, { summary = {}, twelveDomains = [], hitList = [], atomicFacts = null, domainEvidence = null, featureVector = null } = {}) {
  const keywords = compact(rule.hitKeywords);
  const domains = compact(rule.domains);
  const context = { summary, twelveDomains, hitList, atomicFacts, domainEvidence, featureVector };
  const domainMatches = twelveDomains
    .filter((domain) => domains.includes(domain.key))
    .map((domain) => ({
      label: domain.label,
      weight: confidenceWeight(domain.confidence),
      text: compact([domain.title, domain.judgement, domain.manifestation, domain.keywords]).join(" "),
    }));
  const hitMatches = hitList
    .filter((hit) => textHitsKeyword(hitText(hit), keywords) || compact(hit.supports).some((key) => domains.includes(key)))
    .map((hit) => ({
      label: hit.name,
      weight: confidenceWeight(hit.importance || hit.confidence),
      text: hitText(hit),
    }));
  const summaryText = compact([
    summary.mainImage,
    summary.mainStructure,
    summary.usefulHint,
    summary.dayMaster,
  ]).join(" ");
  const summaryMatches = keywords.filter((keyword) => summaryText.includes(keyword));
  const factMatches = (context.atomicFacts?.facts ?? [])
    .filter((fact) => factMatchesRule(fact, rule, keywords, domains))
    .slice(0, 5);
  const score = rule.priority
    + weightMasterRulePriority(rule, context)
    + factMatches.reduce((total, fact) => total + Math.min(24, Number(fact.score ?? 0) / 4), 0)
    + domainMatches.reduce((total, item) => total + item.weight * 9 + keywordScore(item.text, keywords), 0)
    + hitMatches.reduce((total, item) => total + item.weight * 12 + keywordScore(item.text, keywords), 0)
    + summaryMatches.length * 6;

  return {
    rule,
    score,
    selectedFacts: factMatches,
    evidence: uniqueText([
      ...factMatches.map((fact) => `事实：${fact.label}`),
      ...domainMatches.map((item) => `领域：${item.label}`),
      ...hitMatches.map((item) => `取象：${item.label}`),
      ...summaryMatches.map((item) => `摘要关键词：${item}`),
    ]),
  };
}

function ensureMainLineCount(scored = []) {
  const positive = scored.filter((item) => item.score > item.rule.priority);
  const source = positive.length >= 2 ? positive : scored;
  return source.slice(0, Math.min(3, Math.max(2, source.length)));
}

function composeMasterHeadline(selectedRules = [], context = {}) {
  const ids = selectedRules.map((rule) => rule.id);
  const strongRelation = isStrongRelationshipMovement(context);
  const domainByKey = Object.fromEntries((context.twelveDomains ?? []).map((domain) => [domain.key, domain]));
  const wealthText = domainFrontText(domainByKey.wealth);
  const childrenText = domainFrontText(domainByKey.children);
  const movementText = domainFrontText(domainByKey.movement);
  const fixedWealth = /长期承载|稳定资源|家庭承载|固定承载|现实责任|岗位收益/.test(wealthText);
  const skillWealth = /技能|项目|后天转化|成果交付|专业服务/.test(wealthText);
  const weakOutput = /原局输出不算最外放|后天引动|成果感更明显/.test(childrenText);
  const strongMovement = strongRelation && /空间转换容易应事|搬动|出行|异地|岗位环境变化/.test(movementText);

  if (skillWealth && ids.includes("career_rules")) {
    return trimHeadline("技能项目牵财，规则责任同看");
  }
  if (strongMovement && ids.includes("career_rules")) {
    return trimHeadline(fixedWealth ? "关系环境易动，规则承载并行" : "关系环境易动，职责节奏并行");
  }
  if (ids.includes("career_rules") && ids.includes("wealth_people")) {
    return trimHeadline(fixedWealth && weakOutput
      ? "官印承接较明，现实承载是主线"
      : "规则责任较重，固定承载同看");
  }
  if (ids.includes("career_rules") && ids.includes("family_early") && ids.includes("self_rhythm")) {
    return trimHeadline("自我节奏有根，规则责任和家庭底色较重");
  }
  if (ids.includes("learning_output") && ids.includes("career_rules")) {
    return trimHeadline("学习吸收较强，专业承接与现实责任并存");
  }
  if (ids.includes("career_rules") && ids.includes("family_early")) {
    return trimHeadline("规则责任较重，家庭承载并行");
  }

  const orderedParts = [
    ids.includes("career_rules") ? "规则责任较重" : "",
    ids.includes("learning_output") ? "学习吸收成线" : "",
    ids.includes("wealth_people") ? "现实承载有迹" : "",
    ids.includes("self_rhythm") ? "自我节奏有主" : "",
    ids.includes("family_early") ? "家庭早年留底" : "",
    strongRelation && ids.includes("relationship_movement") ? "关系环境易动" : "",
    ids.includes("health_spirit") ? "身心偏性需养" : "",
  ];
  const headline = compact(orderedParts).slice(0, 3).join("，")
    || selectedRules.map((rule) => rule.label.replace(/线$/, "")).slice(0, 3).join("，");
  return trimHeadline(headline || "命局主线需从结构与现实同看");
}

function buildMasterSections(selectedRules = [], context = {}) {
  const ids = selectedRules.map((rule) => rule.id);
  const hasSelf = ids.includes("self_rhythm");
  const hasCareer = ids.includes("career_rules");
  const hasFamily = ids.includes("family_early");
  const hasRelation = ids.includes("relationship_movement");
  const hasLearning = ids.includes("learning_output");
  const hasWealth = ids.includes("wealth_people");
  const hasHealth = ids.includes("health_spirit");

  const mainSubjects = compact([
    hasSelf ? "自我判断" : "",
    hasCareer ? "现实责任" : "",
    hasFamily ? "家庭早年" : "",
    hasRelation ? "外部牵动" : "",
    hasWealth ? "资源分配" : "",
    hasLearning ? "学习输出" : "",
    hasHealth ? "身心偏性" : "",
  ]).slice(0, 4);
  const mainText = mainSubjects.length
    ? `这个原局不是单点看财或单点看感情，主线更像${joinChineseList(mainSubjects)}同时有存在感。后面的选择容易围绕${joinChineseList(mainSubjects.slice(0, 3))}展开，轻重要看哪一条结构被现实先带出来。`
    : "这个原局的主线不算特别外放，更多是几个结构在底层同时铺开，后面要看哪一条结构被现实先带出来。";

  const personalityText = compact([
    hasSelf ? "性格上有主见，也重边界，不太喜欢完全被别人安排，遇事往往会先建立自己的判断，再决定怎么配合外部环境。" : "",
    hasLearning ? "能力来源不只是冲劲，也包括学习、吸收、整理和表达输出，适合把经验资料转成自己的方法。" : "",
    hasCareer ? "规则感、责任感和岗位身份也会参与塑造做事方式，压力承接得住时会变成专业感和身份感。" : "",
  ]).slice(0, 2).join("");

  const realityItems = compact([
    hasRelation ? "关系、人事、居住环境、岗位变化容易牵动状态" : "",
    hasWealth ? "合作、人情、资源分配和钱财进出容易绑在一起" : "",
    hasFamily ? "家庭秩序、父母影响和成长资源容易留下底色" : "",
    hasCareer ? "岗位、证照、平台、考核和规则压力是现实重点" : "",
    hasHealth ? "睡眠、压力反应和精神消耗会影响稳定度" : "",
  ]);
  const realityText = realityItems.length
    ? `现实里更容易落在${joinChineseList(realityItems.slice(0, 4))}。这些事不必同时出现，但遇到对应阶段或现实事件时，会比单独一个象更有存在感。`
    : "现实里更容易从性格反应、关系互动和阶段事件里显出轻重。";

  const futureItems = compact([
    hasWealth ? "财星" : "",
    hasCareer ? "官印" : "",
    hasRelation ? "日支关系和迁移变化" : "",
    hasLearning ? "食伤输出" : "",
    hasFamily ? "居住家庭和固定承载" : "",
    hasHealth ? "作息压力和身心恢复" : "",
  ]);
  const futureText = futureItems.length
    ? `这个盘不是完全静态守成型，后续重点落在${joinChineseList(futureItems.slice(0, 5))}。这些位置被现实阶段带动时，事业、关系、财务或居住环境就容易一起显出来。`
    : "后续重点要等现实阶段带动命局主线，再判断事业、关系、财务和居住环境哪一端先显出来。";

  return [
    { key: "main", title: "命局主线", text: mainText },
    { key: "personality", title: "性格与能力", text: personalityText || "性格和能力不是单靠一个象决定，更多要看日主、月令、十神和现实训练如何配合。" },
    { key: "reality", title: "现实牵动", text: realityText },
    { key: "future", title: "后续重点", text: futureText },
  ];
}

function buildRealityLine(rules = []) {
  const realities = rules
    .map((rule) => stripPrefix(firstSentence(rule.reality), "现实落点多在"))
    .filter(Boolean)
    .slice(0, 3);
  if (!realities.length) return "现实里要从性格反应、关系互动和阶段事件里复核轻重。";
  return `现实里更容易从${realities.join("，以及")}这些地方显出来。`;
}

function filterNatalOnlyHits(hitList = []) {
  return (Array.isArray(hitList) ? hitList : [])
    .filter((hit) => !transitSignalPattern.test(hitText(hit)));
}

function filterNatalOnlyEvidence(evidence = {}) {
  if (Array.isArray(evidence)) {
    return evidence
      .map((item) => filterNatalOnlyEvidence(item))
      .filter((item) => {
        if (item === undefined || item === null || item === "") return false;
        return !transitSignalPattern.test(JSON.stringify(item));
      });
  }
  if (evidence && typeof evidence === "object") {
    return Object.fromEntries(
      Object.entries(evidence)
        .map(([key, value]) => [key, filterNatalOnlyEvidence(value)])
        .filter(([, value]) => value !== undefined && value !== null && value !== ""),
    );
  }
  const value = String(evidence ?? "");
  return transitSignalPattern.test(value) ? "" : evidence;
}

function stripTransitSignal(text = "") {
  return String(text)
    .replace(/[^。！？!?]*(大运|流年|流月|当前步运|岁运|运势|流日)[^。！？!?]*[。！？!?]?/g, "")
    .trim();
}

function weightMasterRulePriority(rule, context = {}) {
  const text = contextText(context);
  if (rule.id === "relationship_movement") {
    return isStrongRelationshipMovement(context) ? 18 : -55;
  }
  if (rule.id === "career_rules") {
    return /(官印|正官|官杀|印星|癸印|酉月|规则|职责|岗位|专业承接)/.test(text) ? 28 : 8;
  }
  if (rule.id === "family_early") {
    return /(年柱|月柱|家庭|父母|早年|己丑|土气|固定承载|现实责任|家庭承载)/.test(text) ? 22 : 6;
  }
  if (rule.id === "wealth_people") {
    return /(固定承载|长期承载|稳定资源|土气|己丑|财印|财星.*承载|家庭资产)/.test(text) ? 18 : 2;
  }
  if (rule.id === "self_rhythm") {
    return /(甲木|日主|比肩|主见|理解系统|边界|自我节奏|学习吸收)/.test(text) ? 16 : 6;
  }
  if (rule.id === "learning_output") {
    return /(印星|癸印|学习|吸收|资料|输出|食伤)/.test(text) ? 10 : 2;
  }
  return 0;
}

function isStrongRelationshipMovement(context = {}) {
  const text = contextText(context);
  if (/日支被冲|日柱[^。；，,]*冲|冲[^。；，,]*日柱/.test(text)) return true;
  if (/(三合|三会|成局|驿马|迁移强|多处|多组|集中)/.test(text)) return true;
  const relationCount = (text.match(/冲|合|刑|害|破|穿/g) || []).length;
  if (/子酉破/.test(text) && relationCount <= 3) return false;
  if (/日支被刑害破/.test(text) && relationCount <= 3) return false;
  return relationCount >= 5;
}

function buildFallbackSummary({ summary = {}, twelveDomains = [] } = {}) {
  const domains = twelveDomains.slice(0, 3);
  const headline = summary.mainImage || "原局主线需要回到命盘结构里复核。";
  const paragraph = domains.length
    ? `这个盘先从人本身和现实落点一起看，${domains.map((domain) => domain.label).join("、")}会参与主线。具体轻重要回到命盘证据和现实阶段里复核。`
    : "这个盘主线不算特别外放，先从日主、月令、十神和关系触发里慢慢落点。";
  return {
    headline,
    sections: [
      { key: "main", title: "命局主线", text: paragraph },
      { key: "personality", title: "性格与能力", text: "性格和能力要从日主、月令、十神与现实训练共同落点。" },
      { key: "reality", title: "现实牵动", text: "现实里要从性格反应、关系互动和阶段事件里复核轻重。" },
      { key: "future", title: "后续重点", text: "后续重点看现实阶段如何带动事业、关系、财务和居住环境。" },
    ],
    paragraph,
    realityLine: "现实里要从性格反应、关系互动和阶段事件里复核轻重。",
    mainLines: domains.map((domain) => ({
      id: domain.key,
      label: domain.label,
      headline: domain.title,
      reality: domain.manifestation,
      boundary: compact(domain.counterEvidence)[0] || "",
      evidence: compact(domain.evidence).slice(0, 3),
    })),
    tags: domains.map((domain) => domain.label).slice(0, 3),
    evidence: domains.flatMap((domain) => compact(domain.evidence)).slice(0, 6),
  };
}

function hitText(hit = {}) {
  return compact([
    hit.name,
    hit.category,
    hit.type,
    hit.brief,
    hit.source,
    hit.domains,
    hit.image,
    hit.evidence,
  ]).join(" ");
}

function factMatchesRule(fact = {}, rule = {}, keywords = [], domains = []) {
  const text = compact([fact.id, fact.label, fact.meaning, fact.category, fact.tags, fact.evidence]).join(" ");
  return (fact.domains ?? []).some((domain) => domains.includes(domain))
    || keywords.some((keyword) => text.includes(keyword));
}

function contextText(context = {}) {
  return compact([
    context.summary?.mainImage,
    context.summary?.mainStructure,
    context.summary?.usefulHint,
    context.summary?.dayMaster,
    context.twelveDomains?.map((domain) => compact([
      domain.key,
      domain.label,
      domain.title,
      domain.judgement,
      domain.manifestation,
      domain.pressure,
      domain.keywords,
      domain.evidence,
      domain.matchedCombinations?.map((item) => compact([item.id, item.label, item.judgement, item.evidenceText]).join(" ")),
    ]).join(" ")),
    context.hitList?.map((hit) => hitText(hit)),
    context.atomicFacts?.facts?.map((fact) => compact([fact.id, fact.label, fact.meaning, fact.tags, fact.evidence]).join(" ")),
  ]).join(" ");
}

function domainFrontText(domain = {}) {
  return compact([
    domain.title,
    domain.judgement,
    domain.manifestation,
    domain.pressure,
  ]).join(" ");
}

function textHitsKeyword(text = "", keywords = []) {
  return keywords.some((keyword) => text.includes(keyword));
}

function keywordScore(text = "", keywords = []) {
  return keywords.reduce((score, keyword) => score + (text.includes(keyword) ? 3 : 0), 0);
}

function confidenceWeight(value = "medium") {
  return { high: 3, medium: 2, low: 1 }[value] ?? 2;
}

function firstSentence(text = "") {
  const value = String(text).replace(/\s+/g, " ").trim();
  return value.match(/[^。！？!?]+[。！？!?]?/)?.[0]?.trim() || value;
}

function stripPrefix(text = "", prefix = "") {
  return String(text).startsWith(prefix) ? String(text).slice(prefix.length) : text;
}

function joinChineseList(items = []) {
  return compact(items).join("、");
}

function trimHeadline(text = "") {
  return String(text).replace(/。+$/, "").slice(0, 28);
}

function compact(value) {
  return (Array.isArray(value) ? value.flat(Infinity) : [value])
    .filter((item) => item !== undefined && item !== null && String(item).trim() !== "");
}

function uniqueText(items = []) {
  return [...new Set(compact(items).map((item) => String(item).trim()))];
}

const transitSignalPattern = /大运|流年|流月|当前步运|岁运|运势|流日/;
