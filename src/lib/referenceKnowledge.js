const DEFAULT_LIMIT = 12;

export function matchReferenceKnowledge(readingContext, referenceKnowledge, limit = DEFAULT_LIMIT) {
  const cards = Array.isArray(referenceKnowledge?.cards) ? referenceKnowledge.cards : [];
  if (!cards.length) return [];

  const context = buildMatchContext(readingContext);
  return cards
    .filter((card) => card?.enabledForAnalysis === true)
    .map((card) => ({ card, reasons: matchCard(card, context) }))
    .filter(({ reasons }) => reasons.length > 0)
    .map(({ card, reasons }) => normalizeHit(card, reasons))
    .slice(0, limit);
}

function buildMatchContext({
  pillars = {},
  elements = {},
  tenGods = [],
  matchedRules = [],
  patternCandidates = [],
  starSignals = [],
  combinations = [],
  transitHits = [],
} = {}) {
  const pillarList = Object.values(pillars).filter(Boolean);
  const stems = new Set(pillarList.map((pillar) => pillar.stem));
  const branches = new Set(pillarList.map((pillar) => pillar.branch));
  const labels = new Set(pillarList.map((pillar) => pillar.label));
  const tenGodNames = new Set(tenGods.map((signal) => signal.name).filter(Boolean));
  const elementNames = new Set(Object.entries(elements).filter(([, value]) => Number(value) > 0).map(([key]) => key));
  const patternNames = new Set(patternCandidates.map((pattern) => pattern.name).filter(Boolean));
  const starNames = new Set(starSignals.map((star) => star.name).filter(Boolean));
  const relationTokens = new Set();

  for (const combo of combinations) {
    addRelationToken(relationTokens, combo.title);
    addRelationToken(relationTokens, combo.effect);
    if (Array.isArray(combo.members)) {
      addRelationToken(relationTokens, combo.members.join(""));
      addRelationToken(relationTokens, `${combo.members.join("")}${combo.effect ?? ""}`);
    }
  }
  for (const rule of matchedRules) {
    addRelationToken(relationTokens, rule.title);
    addRelationToken(relationTokens, rule.interpretation);
    const match = rule.match ?? {};
    if (match.branchA && match.branchB) addRelationToken(relationTokens, `${match.branchA}${match.branchB}${match.relation ?? ""}`);
    if (Array.isArray(match.branches)) addRelationToken(relationTokens, match.branches.join(""));
  }
  for (const hit of transitHits) {
    addRelationToken(relationTokens, hit.title);
    addRelationToken(relationTokens, hit.relation);
    addRelationToken(relationTokens, hit.interpretation);
  }

  return {
    stems,
    branches,
    labels,
    tenGodNames,
    elementNames,
    patternNames,
    starNames,
    relationTokens: [...relationTokens],
  };
}

function matchCard(card, context) {
  const match = card.match ?? {};
  const checks = [
    matchAll(match.stems, context.stems, "天干"),
    matchAll(match.branches, context.branches, "地支"),
    matchAll(match.pillars, context.labels, "柱"),
    matchAny(match.tenGods, context.tenGodNames, "十神"),
    matchAny(match.elements, context.elementNames, "五行"),
    matchAny(match.patterns, context.patternNames, "格局"),
    matchAny(match.stars, context.starNames, "神煞"),
    matchRelation(match.relations, context.relationTokens),
    matchAny(card.tags, new Set([...context.relationTokens, ...context.tenGodNames, ...context.patternNames, ...context.starNames]), "标签"),
  ].filter(Boolean);

  const hasExplicitMatch = Object.values(match).some((value) => Array.isArray(value) ? value.length > 0 : Boolean(value));
  return hasExplicitMatch ? checks : [];
}

function matchAll(values, available, label) {
  const list = normalizeList(values);
  if (!list.length) return "";
  return list.every((value) => available.has(value)) ? `${label}命中：${list.join("、")}` : "";
}

function matchAny(values, available, label) {
  const hits = normalizeList(values).filter((value) => available.has(value));
  return hits.length ? `${label}命中：${hits.join("、")}` : "";
}

function matchRelation(values, relationTokens) {
  const hits = normalizeList(values).filter((value) =>
    relationTokens.some((token) => token.includes(value) || value.includes(token)),
  );
  return hits.length ? `关系命中：${hits.join("、")}` : "";
}

function normalizeHit(card, reasons) {
  return {
    id: card.id,
    title: card.display?.title ?? card.title,
    displayTitle: card.display?.title ?? card.title,
    originalTitle: card.title,
    category: card.category,
    domains: card.domains ?? [],
    tags: card.tags ?? [],
    match: card.match ?? {},
    sourceRefs: card.sourceRefs ?? [],
    summary: card.summary ?? "",
    interpretation: card.interpretation ?? "",
    display: card.display ?? {},
    enabledForAnalysis: card.enabledForAnalysis === true,
    confidence: card.confidence ?? "unknown",
    status: card.status ?? "auto_enabled",
    matchReasons: [...new Set(reasons)],
  };
}

function normalizeList(value) {
  if (!value) return [];
  return (Array.isArray(value) ? value : [value]).map((item) => String(item).trim()).filter(Boolean);
}

function addRelationToken(tokens, value) {
  const text = String(value ?? "").trim();
  if (text) tokens.add(text);
}
