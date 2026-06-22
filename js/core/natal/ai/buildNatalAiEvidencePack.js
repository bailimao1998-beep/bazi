export const NATAL_AI_EVIDENCE_PACK_VERSION =
  "natal-ai-evidence-pack-v1";

const boundaries = [
  "只允许基于证据包解释。",
  "不得重新排盘。",
  "不得添加包外命理事实。",
  "不得混入大运、流年、流月。",
  "不得给出确定医学、法律、投资结论。",
  "conditional 只能用可能、倾向、需复核等语言。",
  "没有证据时明确说明证据不足。",
];

export function buildNatalAiEvidencePack({
  chart = {},
  featureVector = {},
  contractFacts = [],
  compositionImages = [],
  hitList = {},
  twelveDomains = [],
  masterSummary = {},
  scope = "natal",
} = {}) {
  const warnings = [];
  const normalizedScope =
    normalizeText(scope) || "natal";
  const facts = normalizeObjects(
    contractFacts,
    "contractFacts",
    warnings,
  )
    .map(compactFact)
    .filter((fact) => fact.id)
    .sort(compareById);
  const compositions = normalizeObjects(
    compositionImages,
    "compositionImages",
    warnings,
  )
    .map(compactComposition)
    .filter((image) => image.id)
    .sort(compareById);
  const domains = normalizeObjects(
    twelveDomains,
    "twelveDomains",
    warnings,
  )
    .map(compactDomain)
    .filter((domain) => domain.key)
    .sort((left, right) =>
      left.key.localeCompare(right.key),
    );

  return {
    version:
      NATAL_AI_EVIDENCE_PACK_VERSION,
    scope: normalizedScope,
    chartSummary:
      buildChartSummary(chart),
    dayMasterSummary:
      buildDayMasterSummary(
        featureVector,
        chart,
      ),
    facts,
    compositions,
    domains,
    masterSummary:
      compactMasterSummary(masterSummary),
    hitListSummary:
      compactHitListSummary(hitList),
    allowedFactIds:
      uniqueSortedStrings(
        facts.map((fact) => fact.id),
      ),
    allowedCompositionIds:
      uniqueSortedStrings(
        compositions.map(
          (image) => image.id,
        ),
      ),
    allowedDomainKeys:
      uniqueSortedStrings(
        domains.map((domain) => domain.key),
      ),
    boundaries,
    warnings:
      uniqueSortedStrings(warnings),
  };
}

function compactFact(fact) {
  return cleanObject({
    id: normalizeText(fact.id),
    category: normalizeText(fact.category),
    predicate: normalizeText(fact.predicate),
    subject: fact.subject ?? null,
    value: fact.value,
    confidence:
      normalizeText(fact.confidence) ||
      "unknown",
    source:
      uniqueSortedStrings(
        (fact.sourceRefs ?? []).map(
          (ref) => ref.featureGroup,
        ),
      ).join(","),
  });
}

function compactComposition(image) {
  return cleanObject({
    id: normalizeText(image.id),
    ruleId: normalizeText(image.ruleId),
    title: normalizeText(image.title),
    brief: normalizeText(image.brief),
    role: normalizeText(image.role),
    status: normalizeText(image.status),
    confidence:
      normalizeText(image.confidence) ||
      "unknown",
    domains:
      uniqueSortedStrings(image.domains),
    matchedFactIds:
      uniqueSortedStrings(
        image.matchedFactIds,
      ),
    counterFactIds:
      uniqueSortedStrings(
        image.counterFactIds,
      ),
  });
}

function compactDomain(domain) {
  return cleanObject({
    key: normalizeText(domain.key),
    title: normalizeText(domain.title),
    summary: normalizeText(domain.summary),
    judgement:
      normalizeText(domain.judgement),
    pressure:
      normalizeText(domain.pressure),
    evidenceFactIds:
      uniqueSortedStrings(
        domain.evidenceFactIds,
      ),
    compositionImageIds:
      uniqueSortedStrings(
        domain.compositionImageIds,
      ),
  });
}

function compactMasterSummary(summary) {
  return cleanObject({
    version: normalizeText(summary.version),
    scope: normalizeText(summary.scope),
    title: normalizeText(summary.title),
    conclusion:
      normalizeText(summary.conclusion),
    coreStructure:
      normalizeText(summary.coreStructure),
    strengths:
      uniqueSortedStrings(summary.strengths),
    tensions:
      uniqueSortedStrings(summary.tensions),
    conditions:
      uniqueSortedStrings(summary.conditions),
    careerWealthLine:
      normalizeText(summary.careerWealthLine),
    relationshipLine:
      normalizeText(summary.relationshipLine),
    healthLine:
      normalizeText(summary.healthLine),
    familyLine:
      normalizeText(summary.familyLine),
    lifePatternLine:
      normalizeText(summary.lifePatternLine),
    evidenceFactIds:
      uniqueSortedStrings(
        summary.evidenceFactIds,
      ),
    compositionImageIds:
      uniqueSortedStrings(
        summary.compositionImageIds,
      ),
    domainKeys:
      uniqueSortedStrings(summary.domainKeys),
    confidence:
      normalizeText(summary.confidence),
    boundary: normalizeText(summary.boundary),
  });
}

function compactHitListSummary(hitList) {
  const rows = Array.isArray(hitList?.all)
    ? hitList.all
    : [];

  return {
    scope: normalizeText(hitList?.scope),
    count: rows.length,
    ruleIds: uniqueSortedStrings(
      rows.map((row) => row.sourceRuleId),
    ),
  };
}

function buildChartSummary(chart) {
  const pillars = chart?.pillars ?? {};

  return {
    pillars:
      Object.fromEntries(
        ["year", "month", "day", "hour"]
          .map((key) => [
            key,
            {
              label: normalizeText(
                pillars[key]?.label,
              ),
              stem: normalizeText(
                pillars[key]?.stem,
              ),
              branch: normalizeText(
                pillars[key]?.branch,
              ),
            },
          ]),
      ),
    dayMaster:
      normalizeText(chart?.dayMaster),
  };
}

function buildDayMasterSummary(
  featureVector,
  chart,
) {
  const dayMaster =
    featureVector?.dayMaster ?? {};

  return cleanObject({
    stem:
      normalizeText(dayMaster.stem) ||
      normalizeText(chart?.dayMaster),
    element: normalizeText(dayMaster.element),
    strengthLevel:
      normalizeText(dayMaster.strengthLevel),
    strengthScore:
      dayMaster.strengthScore,
    rootLevel:
      normalizeText(dayMaster.rootLevel),
    inSeason: dayMaster.inSeason,
  });
}

function normalizeObjects(
  items,
  label,
  warnings,
) {
  if (!Array.isArray(items)) {
    warnings.push(`${label} should be an array`);
    return [];
  }

  return items.filter((item) => {
    const valid =
      item &&
      typeof item === "object" &&
      !Array.isArray(item);

    if (!valid) {
      warnings.push(
        `${label} contains invalid item`,
      );
    }

    return valid;
  });
}

function cleanObject(object) {
  return Object.fromEntries(
    Object.entries(object)
      .filter(([, value]) =>
        value !== undefined &&
        value !== null &&
        value !== "" &&
        (
          !Array.isArray(value) ||
          value.length > 0
        ),
      ),
  );
}

function compareById(left, right) {
  return normalizeText(left.id)
    .localeCompare(
      normalizeText(right.id),
    );
}

function uniqueSortedStrings(items) {
  return [
    ...new Set(
      (Array.isArray(items) ? items : [])
        .map(normalizeText)
        .filter(Boolean),
    ),
  ].sort();
}

function normalizeText(value) {
  return typeof value === "string"
    ? value.trim()
    : "";
}
