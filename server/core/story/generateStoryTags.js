export function generateStoryTags({ chart, yearInfluence, monthInfluences = [], matchedRules = [] } = {}) {
  const ruleTags = matchedRules.map((rule) => normalizeTag({
    period: rule.topic?.includes("month") ? "month" : "year",
    topic: rule.topic ?? "general",
    tag: rule.tag ?? rule.title,
    evidence: rule.evidence,
    confidence: rule.confidence,
    sourceRuleId: rule.id,
  }));
  const yearTag = normalizeTag({
    period: "year",
    topic: "year-theme",
    tag: `${yearInfluence?.pillar?.label ?? ""}年度主线`,
    evidence: yearInfluence?.evidence ?? [],
    confidence: yearInfluence?.confidence ?? "medium",
  });
  const monthTags = monthInfluences.map((month) => normalizeTag({
    period: "month",
    month: month.month,
    topic: "month-role",
    tag: `${month.month}月${month.role}`,
    evidence: month.evidence,
    confidence: month.confidence,
  }));
  const chartTag = normalizeTag({
    period: "natal",
    topic: "chart",
    tag: `${chart?.dayMaster?.label ?? "日主"}结构观察`,
    evidence: chart?.meta?.evidence ?? [],
    confidence: chart?.meta?.confidence ?? "medium",
  });
  return uniqueTags([chartTag, yearTag, ...ruleTags, ...monthTags]);
}

function normalizeTag(tag) {
  return {
    period: tag.period ?? "year",
    month: tag.month,
    topic: tag.topic ?? "general",
    tag: tag.tag ?? "观察标签",
    evidence: normalizeList(tag.evidence).length ? normalizeList(tag.evidence) : ["本地规则生成"],
    confidence: tag.confidence ?? "medium",
    needVerify: ["剧情标签只负责叙事组织，不能单独作为结论。"],
    sourceRuleId: tag.sourceRuleId,
  };
}

function uniqueTags(tags) {
  const seen = new Set();
  return tags.filter((tag) => {
    const key = `${tag.period}-${tag.month ?? ""}-${tag.topic}-${tag.tag}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function normalizeList(value) {
  if (!value) return [];
  return (Array.isArray(value) ? value : [value]).map((item) => String(item ?? "").trim()).filter(Boolean);
}
