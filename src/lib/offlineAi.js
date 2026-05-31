const IMPORTANT_RULE_CATEGORIES = new Set([
  "element_season_strength",
  "branch_pair_relation",
  "branch_group_relation",
  "transit_branch_to_natal_branch",
  "transit_stem_to_daymaster",
  "branch_hidden_combination",
  "remote_combination",
  "arched_combination",
]);

export function summarizeReadingForAi(reading) {
  const pillars = reading.natal?.pillars ?? {};
  const patternNames = (reading.natal?.patternCandidates ?? []).map((item) => item.name).filter(Boolean);
  const importantRules = (reading.natal?.matchedRules ?? [])
    .filter((rule) => IMPORTANT_RULE_CATEGORIES.has(rule.category))
    .slice(0, 20)
    .map((rule) => ({
      title: rule.title,
      category: rule.category,
      interpretation: rule.interpretation,
    }));
  return {
    pillars: {
      year: pillars.year?.label,
      month: pillars.month?.label,
      day: pillars.day?.label,
      hour: pillars.hour?.label,
    },
    dayMaster: reading.natal?.dayMaster,
    nayinDay: reading.natal?.chartMeta?.nayin?.day,
    voidDay: reading.natal?.chartMeta?.voidBranches?.day ?? [],
    patterns: patternNames,
    strength: (reading.natal?.strengthSignals ?? []).map((item) => `${item.label}${item.seasonalStatus}: ${item.interpretation}`),
    rules: importantRules,
    referenceKnowledge: (reading.natal?.referenceKnowledgeHits ?? []).slice(0, 10).map((card) => ({
      title: card.title ?? card.displayTitle,
      summary: card.summary,
      interpretation: card.interpretation,
      sources: (card.sourceRefs ?? []).map(formatSourceRef),
    })),
    stars: (reading.natal?.starSignals ?? []).map((item) => `${item.name}(${item.basis})`),
    luck: {
      direction: reading.luck?.directionLabel,
      startAge: reading.luck?.startAge,
      firstPillars: (reading.luck?.pillars ?? []).slice(0, 4).map((item) => `${item.startAge}-${item.endAge}岁 ${item.label}`),
    },
    transit: {
      year: reading.transit?.selectedYear?.label,
      month: reading.transit?.selectedMonth?.label,
      hits: (reading.transit?.hits ?? []).slice(0, 8).map((item) => `${item.transit} -> ${item.target}: ${item.relation}`),
    },
    topics: (reading.topics ?? []).map((topic) => ({
      label: topic.label,
      summary: topic.paragraphs?.slice(0, 2) ?? [],
      signals: topic.signals ?? [],
    })),
    judgement: summarizeJudgementForAi(reading.judgement),
  };
}

export function collectReadingTags(reading) {
  const tags = new Set();
  for (const pattern of reading.natal?.patternCandidates ?? []) addTag(tags, pattern.name);
  for (const combo of reading.natal?.combinations ?? []) {
    addTag(tags, combo.effect);
    extractKnownTags(combo.title).forEach((tag) => addTag(tags, tag));
  }
  for (const rule of reading.natal?.matchedRules ?? []) {
    addTag(tags, rule.title);
    extractKnownTags(`${rule.title} ${rule.interpretation ?? ""}`).forEach((tag) => addTag(tags, tag));
  }
  for (const star of reading.natal?.starSignals ?? []) addTag(tags, star.name);
  for (const card of reading.natal?.referenceKnowledgeHits ?? []) {
    addTag(tags, card.title);
    for (const tag of card.tags ?? []) addTag(tags, tag);
  }
  for (const evidence of reading.judgement?.evidence ?? []) {
    addTag(tags, evidence.title);
    addTag(tags, evidence.interpretation);
    addTag(tags, evidence.category);
    addTag(tags, evidence.layer);
    for (const tag of evidence.tags ?? []) addTag(tags, tag);
  }
  return [...tags].filter(Boolean);
}

export function findSimilarCases(reading, cases = [], limit = 3) {
  if (reading.judgement?.caseSignals?.length) {
    return reading.judgement.caseSignals.slice(0, limit);
  }
  const readingTags = collectReadingTags(reading);
  return cases
    .map((caseItem) => {
      const caseTags = caseItem.tags ?? [];
      const matchedTags = caseTags.filter((tag) => readingTags.some((readingTag) => readingTag.includes(tag) || tag.includes(readingTag)));
      return {
        ...caseItem,
        score: matchedTags.length,
        matchedTags,
      };
    })
    .filter((caseItem) => caseItem.score > 0)
    .sort((left, right) => right.score - left.score || String(left.id).localeCompare(String(right.id)))
    .slice(0, limit);
}

export function buildOfflineAnalysisPrompt({ promptTemplate, readingSummary, similarCases }) {
  const sections = promptTemplate.outputSections ?? ["总论", "依据", "分项分析", "提醒"];
  const safetyRules = promptTemplate.safetyRules ?? [];
  const pillarLine = [
    readingSummary.pillars.year,
    readingSummary.pillars.month,
    readingSummary.pillars.day,
    readingSummary.pillars.hour,
  ]
    .filter(Boolean)
    .join(" ");

  return [
    promptTemplate.system ?? "你是离线八字分析助手。",
    "",
    "运行要求：完全离线，只能依据下面提供的命盘 JSON、本地规则摘要、本地案例，不得假装访问互联网或外部数据库。",
    ...safetyRules.map((rule) => `- ${rule}`),
    "",
    `四柱：${pillarLine}`,
    `日主：${readingSummary.dayMaster ?? "未知"}`,
    `日纳音：${readingSummary.nayinDay ?? "未知"}`,
    `日空：${(readingSummary.voidDay ?? []).join("、") || "未知"}`,
    `格局候选：${readingSummary.patterns.join("、") || "暂无"}`,
    "",
    "月令强弱：",
    ...readingSummary.strength.map((item) => `- ${item}`),
    "",
    "关键规则命中：",
    ...readingSummary.rules.map((rule) => `- ${rule.title}: ${rule.interpretation ?? ""}`),
    "",
    "参考资料命中：",
    ...(readingSummary.referenceKnowledge.length
      ? readingSummary.referenceKnowledge.map((card) => `- ${card.title}（${card.sources.join("、") || "未标页码"}）：${card.summary || card.interpretation}`)
      : ["- 暂无参考资料卡命中。"]),
    "",
    "综合证据链：",
    ...(readingSummary.judgement?.overview?.conclusions?.length
      ? readingSummary.judgement.overview.conclusions.map((item) => `- ${item}`)
      : ["- 暂无结构化综合结论。"]),
    "",
    "岁运分层：",
    `- 大运：${readingSummary.judgement?.transit?.majorLuck?.summary ?? "暂无大运判断。"}`,
    `- 流年：${readingSummary.judgement?.transit?.annual?.summary ?? "暂无流年判断。"}`,
    `- 流月：${readingSummary.judgement?.transit?.monthly?.summary ?? "暂无流月判断。"}`,
    "",
    "分项判断摘要：",
    ...(readingSummary.judgement?.domains?.length
      ? readingSummary.judgement.domains.map((domain) => `- ${domain.label}：${Object.entries(domain.sections ?? {}).map(([title, text]) => `${title}=${text}`).join("；")}`)
      : ["- 暂无分项判断。"]),
    "",
    "关键证据：",
    ...(readingSummary.judgement?.evidence?.length
      ? readingSummary.judgement.evidence.map((item) => `- [${item.layer}/${item.category}/${item.evidenceLevel}] ${item.title}: ${item.interpretation}`)
      : ["- 暂无结构化证据。"]),
    "",
    "相似本地案例：",
    ...(similarCases.length
      ? similarCases.map((item) => `- ${item.title}（${item.id}）：命中 ${(item.matchedTags ?? []).join("、") || "结构相似"}；命中原因：${(item.reasons ?? []).join("；") || "标签相似"}；${item.analysis}`)
      : ["- 暂无相似案例，请明确说明案例不足，不要编造。"]),
    "",
    `请按这些栏目输出：${sections.join("、")}。`,
  ].join("\n");
}

function summarizeJudgementForAi(judgement) {
  if (!judgement) {
    return {
      overview: { conclusions: [] },
      transit: {},
      domains: [],
      evidence: [],
      caseSignals: [],
    };
  }
  return {
    overview: {
      conclusions: judgement.overview?.conclusions ?? [],
      cautions: judgement.overview?.cautions ?? [],
    },
    transit: {
      majorLuck: summarizeTransitLayer(judgement.transit?.majorLuck),
      annual: summarizeTransitLayer(judgement.transit?.annual),
      monthly: summarizeTransitLayer(judgement.transit?.monthly),
    },
    domains: (judgement.domains ?? []).map((domain) => ({
      id: domain.id,
      label: domain.label,
      sections: domain.sections ?? {},
      signals: domain.signals ?? [],
    })),
    evidence: (judgement.evidence ?? []).slice(0, 16).map((item) => ({
      title: item.title,
      layer: item.layer,
      category: item.category,
      interpretation: item.interpretation,
      evidenceLevel: item.evidenceLevel,
      status: item.status,
      sourceIds: item.sourceIds ?? [],
    })),
    caseSignals: (judgement.caseSignals ?? []).slice(0, 4).map((item) => ({
      id: item.id,
      title: item.title,
      matchedTags: item.matchedTags ?? [],
      reasons: item.reasons ?? [],
      analysis: item.analysis,
    })),
  };
}

function summarizeTransitLayer(layer) {
  if (!layer) return null;
  return {
    summary: layer.summary,
    evidence: (layer.evidence ?? []).slice(0, 6).map((item) => item.title),
  };
}

function formatSourceRef(ref) {
  if (!ref?.sourceId) return "";
  const start = ref.pageStart ?? ref.page ?? "";
  const end = ref.pageEnd && ref.pageEnd !== start ? `-${ref.pageEnd}` : "";
  return start ? `${ref.sourceId}:${start}${end}` : ref.sourceId;
}

function addTag(tags, value) {
  if (!value) return;
  const text = String(value).trim();
  if (text) tags.add(text);
}

function extractKnownTags(text) {
  const tags = [];
  const source = String(text);
  for (const tag of ["申寅冲", "寅申冲", "子午冲", "卯酉冲", "辰戌冲", "巳亥冲", "丑未冲", "七杀格", "偏财格", "食神格", "驿马", "文昌贵人"]) {
    if (source.includes(tag)) tags.push(tag);
  }
  return tags;
}
