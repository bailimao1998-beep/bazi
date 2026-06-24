const stageLabels = {
  luck: "大运",
  year: "流年",
  month: "流月",
};

const domainLabels = {
  career: "事业与岗位",
  rules: "规则与考核",
  wealth: "财务与资源",
  resource: "资源分配",
  relationship: "关系与亲密互动",
  cooperation: "合作与分工",
  family: "家庭与根基",
  foundation: "长期基础",
  learning: "学习与资质",
  support: "支持与贵人",
  expression: "表达与输出",
  output: "作品与成果",
  execution: "执行与计划",
  result: "结果与落地",
  competition: "竞争与自主",
  pressure: "压力与约束",
};

const tenGodDomains = {
  比肩: ["competition", "cooperation"],
  劫财: ["competition", "resource"],
  正印: ["learning", "support"],
  偏印: ["learning", "support"],
  食神: ["expression", "output"],
  伤官: ["expression", "rules"],
  正财: ["wealth", "resource"],
  偏财: ["wealth", "resource"],
  正官: ["career", "rules"],
  七杀: ["career", "pressure"],
};

const pillarDomains = {
  年支: ["family", "foundation"],
  月支: ["career", "rules"],
  日支: ["relationship", "cooperation"],
  时支: ["execution", "result"],
};

const pressureRelations = new Set(["冲", "刑", "害", "破"]);

export function buildStagePresentationModel({
  stage = "luck",
  item = {},
  report = {},
  evidencePack = {},
  localNarrative = null,
} = {}) {
  const hits = array(evidencePack?.hits);
  const relations = array(evidencePack?.relations);
  const validIds = new Set(
    [...hits, ...relations]
      .map((entry) => String(entry?.id || "").trim())
      .filter(Boolean),
  );

  const target = buildTarget(stage, item);
  const contextChain = buildContextChain(stage, item);
  const keyFacts = buildKeyFacts({
    stage,
    hits,
    relations,
    signals: array(report?.keySignals),
    validIds,
  });
  const focusDomains = buildFocusDomains({
    hits,
    relations,
    validIds,
  });
  const advantages = buildAdvantages({
    hits,
    localNarrative,
    validIds,
  });
  const pressures = buildPressures({
    relations,
    item,
    validIds,
  });
  const boundaries = buildBoundaries({
    item,
    report,
    evidencePack,
  });

  const headline = shortText(
    localNarrative?.headline
      || report?.summary?.overview
      || item?.shortImage
      || item?.image
      || `${stageLabels[stage] || "阶段"}结构待复核`,
    96,
  );

  const allowedEvidenceRefs = unique(
    [
      ...keyFacts.flatMap((entry) => entry.evidenceRefs),
      ...focusDomains.flatMap((entry) => entry.evidenceRefs),
      ...advantages.flatMap((entry) => entry.evidenceRefs),
      ...pressures.flatMap((entry) => entry.evidenceRefs),
    ].filter((id) => validIds.has(id)),
  );

  return {
    stage,
    target,
    headline,
    contextChain,
    focusDomains,
    keyFacts,
    advantages,
    pressures,
    boundaries,
    aiPack: {
      stage,
      target,
      headline,
      selectedFacts: keyFacts,
      focusDomains,
      boundaries,
      allowedEvidenceRefs,
      forbiddenClaims: [
        "不得脱离证据重新排盘",
        "不得把结构触发写成必然事件",
        "不得凭空断具体职业、金额、疾病、婚期或灾祸",
      ],
    },
  };
}

function buildTarget(stage, item) {
  if (stage === "luck") {
    return {
      label: [item.ageRange, item.yearRange].filter(Boolean).join(" / "),
      ganZhi: item.ganZhi || "",
      year: null,
      month: null,
      dateRange: "",
    };
  }

  if (stage === "year") {
    return {
      label: item.year ? `${item.year}年` : "",
      ganZhi: item.ganZhi || "",
      year: numberOrNull(item.year),
      month: null,
      dateRange: "",
    };
  }

  return {
    label: item.flowMonthLabel || (item.month ? `${item.month}月` : ""),
    ganZhi: item.ganZhi || "",
    year: numberOrNull(item.year),
    month: numberOrNull(item.month || item.flowMonthIndex),
    dateRange: item.dateRangeLabel || "",
  };
}

function buildContextChain(stage, item) {
  const result = [
    { level: "natal", label: "原局", value: "底层结构" },
  ];

  if (stage === "year" || stage === "month") {
    result.push({
      level: "luck",
      label: "大运",
      value: [
        item.currentLuckItem?.ganZhi,
        item.currentLuckItem?.ageRange,
        item.currentLuckItem?.yearRange,
      ].filter(Boolean).join(" / ") || "待复核",
    });
  }

  if (stage === "month") {
    result.push({
      level: "year",
      label: "流年",
      value: [
        item.yearItem?.year,
        item.yearItem?.ganZhi,
      ].filter(Boolean).join(" / ") || "待复核",
    });
  }

  result.push({
    level: stage,
    label: stageLabels[stage] || "阶段",
    value: [
      item.ganZhi,
      item.dateRangeLabel,
    ].filter(Boolean).join(" / ") || "待复核",
  });

  return result;
}

function buildKeyFacts({ stage, hits, relations, signals, validIds }) {
  const relationFacts = relations.map((relation, index) => {
    const evidenceId = safeId(relation?.id, validIds);
    return {
      id: evidenceId || `${stage}:relation:${index}`,
      type: "relation",
      label: relation?.label || "关系触发",
      text: shortText(
        relation?.description
          || relation?.effect
          || relation?.bookExplanation
          || relation?.label
          || "关系触发待复核",
        60,
      ),
      source: relation?.source || "关系触发",
      strength: pressureRelations.has(relation?.label) ? 3 : 2,
      evidenceRefs: evidenceId ? [evidenceId] : [],
    };
  });

  const hitFacts = hits.map((hit, index) => {
    const evidenceId = safeId(hit?.id, validIds);
    return {
      id: evidenceId || `${stage}:hit:${index}`,
      type: "ten_god",
      label: hit?.label || "十神主题",
      text: shortText(
        [hit?.source, hit?.label, first(hit?.realityImages)]
          .filter(Boolean)
          .join("："),
        60,
      ),
      source: hit?.source || "十神命中",
      strength: 1,
      evidenceRefs: evidenceId ? [evidenceId] : [],
    };
  });

  const signalFacts = signals.map((signal, index) => ({
    id: `${stage}:signal:${index}`,
    type: "context",
    label: "阶段信号",
    text: shortText(signal, 60),
    source: "报告信号",
    strength: 0.8,
    evidenceRefs: [],
  }));

  return uniqueObjects(
    [...relationFacts, ...hitFacts, ...signalFacts],
  )
    .sort((a, b) => b.strength - a.strength)
    .slice(0, 6);
}

function buildFocusDomains({ hits, relations, validIds }) {
  const scoreMap = new Map();
  let order = 0;

  function add(key, score, reason, evidenceId) {
    if (!domainLabels[key]) return;

    const current = scoreMap.get(key) || {
      key,
      label: domainLabels[key],
      score: 0,
      order: order++,
      reasons: [],
      evidenceRefs: [],
    };

    current.score += score;
    if (reason) current.reasons.push(reason);
    if (evidenceId && validIds.has(evidenceId)) {
      current.evidenceRefs.push(evidenceId);
    }
    scoreMap.set(key, current);
  }

  hits.forEach((hit) => {
    (tenGodDomains[hit?.label] || []).forEach((domain) => {
      add(domain, 1, `${hit.label}命中`, hit.id);
    });
  });

  relations.forEach((relation) => {
    const relationText = [
      relation?.description,
      relation?.natalPillar,
      relation?.source,
    ].filter(Boolean).join(" ");

    const matchedDomains = Object.entries(pillarDomains)
      .filter(([pillar]) => relationText.includes(pillar))
      .flatMap(([, domains]) => domains);

    const fallbackDomains = relation?.source?.includes("流年")
      ? ["execution", "pressure"]
      : relation?.source?.includes("大运")
        ? ["career", "foundation"]
        : ["execution", "cooperation"];

    const score = 2 + (pressureRelations.has(relation?.label) ? 1 : 0);

    (matchedDomains.length ? matchedDomains : fallbackDomains)
      .forEach((domain) => {
        add(
          domain,
          score,
          `${relation.source || "关系"}：${relation.label || "触发"}`,
          relation.id,
        );
      });
  });

  return [...scoreMap.values()]
    .sort((a, b) => b.score - a.score || a.order - b.order)
    .slice(0, 3)
    .map((entry) => ({
      key: entry.key,
      label: entry.label,
      score: entry.score,
      reason: unique(entry.reasons).slice(0, 2).join("；"),
      evidenceRefs: unique(entry.evidenceRefs),
    }));
}

function buildAdvantages({ hits, localNarrative, validIds }) {
  const result = [];

  hits.forEach((hit) => {
    const evidenceId = safeId(hit?.id, validIds);
    array(hit?.realityImages || hit?.image)
      .slice(0, 2)
      .forEach((text) => {
        result.push({
          text: shortText(text, 72),
          evidenceRefs: evidenceId ? [evidenceId] : [],
        });
      });
  });

  if (result.length < 2) {
    const realitySection = array(localNarrative?.sections)
      .find((section) => section?.title === "现实画面");

    if (realitySection?.text) {
      result.push({
        text: shortText(realitySection.text, 72),
        evidenceRefs: [],
      });
    }
  }

  return uniqueObjects(result).slice(0, 2);
}

function buildPressures({ relations, item, validIds }) {
  const result = relations.map((relation) => {
    const evidenceId = safeId(relation?.id, validIds);
    return {
      text: shortText(
        first(relation?.counterEvidence)
          || relation?.effect
          || relation?.description
          || relation?.bookExplanation
          || "",
        72,
      ),
      evidenceRefs: evidenceId ? [evidenceId] : [],
    };
  }).filter((entry) => entry.text);

  if (result.length < 2 && item?.reality) {
    result.push({
      text: shortText(item.reality, 72),
      evidenceRefs: [],
    });
  }

  return uniqueObjects(result).slice(0, 2);
}

function buildBoundaries({ item, report, evidencePack }) {
  return unique([
    item?.boundary,
    ...array(report?.needVerify),
    evidencePack?.summary?.caution,
    evidencePack?.summary?.verify,
  ])
    .map((text) => ({
      text: shortText(text, 90),
      evidenceRefs: [],
    }))
    .slice(0, 3);
}

function safeId(value, validIds) {
  const id = String(value || "").trim();
  return id && validIds.has(id) ? id : "";
}

function array(value) {
  return Array.isArray(value) ? value.filter(Boolean) : [];
}

function numberOrNull(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function first(value) {
  if (Array.isArray(value)) {
    return value.find((entry) => String(entry || "").trim()) || "";
  }
  return String(value || "").trim();
}

function shortText(value, maxLength = 80) {
  const text = String(value || "")
    .replace(/必然|一定|注定|肯定发生/g, "更容易")
    .replace(/\s+/g, " ")
    .trim();

  return text.length > maxLength
    ? `${text.slice(0, maxLength - 1)}…`
    : text;
}

function unique(items) {
  return [...new Set(
    items
      .flat()
      .map((item) => String(item || "").trim())
      .filter(Boolean),
  )];
}

function uniqueObjects(items) {
  const seen = new Set();
  return items.filter((item) => {
    const key = item?.text;
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
