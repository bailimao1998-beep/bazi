const branchChars = "子丑寅卯辰巳午未申酉戌亥";
const stemChars = "甲乙丙丁戊己庚辛壬癸";

const relationDisplay = {
  六合: "合",
};

const roleLabels = {
  trigger: "直接触发",
  turn: "层级关系",
  landing: "汇合判断",
  background: "背景",
};

const statusLabels = {
  direct: "直接",
  inferred: "组合",
  background: "背景",
  condition_only: "条件",
  arch_condition: "拱势",
  unresolved: "待复核",
};

const roleWeights = {
  trigger: 1,
  turn: 2,
  landing: 3,
  background: 4,
};

export function buildStagePageDigest({
  stage = "luck",
  evidencePack = {},
  focusDomains = [],
  keyFacts = [],
  advantages = [],
  pressures = [],
  triggeredImages = {},
  structureFacts = [],
} = {}) {
  const threads = array(triggeredImages?.threads);
  const themeHierarchy = triggeredImages?.themeHierarchy ?? {};

  const triggers = buildCompactTriggers(threads);
  const structures = unique(
    triggers
      .map((entry) => entry.title)
      .filter(Boolean),
  ).slice(0, 5);

  return {
    stage,
    theme: {
      primary: normalizeTheme(themeHierarchy?.primary),
      supporting: normalizeTheme(themeHierarchy?.supporting),
    },
    structures,
    triggers,
    observations: array(focusDomains)
      .slice(0, 3)
      .map((entry) => ({
        label: String(entry?.label || "待复核"),
        reason: compactText(
          entry?.reason ||
          "由当前证据排序。",
          88,
        ),
        level: String(entry?.level || "关注"),
      })),
    keyFacts: compactKeyFacts(keyFacts),
    advantages: unique(
      array(advantages)
        .map((entry) =>
          compactText(
            typeof entry === "string"
              ? entry
              : entry?.text,
            70,
          ),
        )
        .filter(Boolean),
    ).slice(0, 3),
    pressures: unique(
      array(pressures)
        .map((entry) =>
          compactText(
            typeof entry === "string"
              ? entry
              : entry?.text,
            70,
          ),
        )
        .filter(Boolean),
    ).slice(0, 3),
    evidence: buildCompactEvidence({
      evidencePack,
      structureFacts,
    }),
  };
}

function normalizeTheme(entry) {
  if (!entry) return null;

  return {
    tenGod: String(entry?.tenGod || ""),
    label: String(
      entry?.label ||
      entry?.tenGod ||
      "待复核",
    ),
    summary: compactText(
      entry?.summary ||
      entry?.trigger ||
      "",
      110,
    ),
    domainLabel: String(
      entry?.domainLabel ||
      "现实落点",
    ),
  };
}

function compactKeyFacts(values = []) {
  const seen = new Set();
  const result = [];

  array(values).forEach((fact) => {
    const text = compactText(
      fact?.text ||
      fact?.description ||
      "",
      100,
    );
    if (!text) return;

    const key = [
      String(fact?.label || ""),
      relationSignature(text),
      stripInternalWords(text),
    ].join("|");

    if (seen.has(key)) return;
    seen.add(key);

    result.push({
      label: String(
        fact?.label ||
        "阶段事实",
      ),
      text,
      source: String(
        fact?.source ||
        "",
      ),
    });
  });

  return result.slice(0, 5);
}

function buildCompactTriggers(threads = []) {
  const groups = new Map();

  array(threads)
    .filter((thread) =>
      thread &&
      thread?.originType !== "ten_god" &&
      thread?.storyRole !== "background" &&
      thread?.certainty !== "conditional",
    )
    .forEach((thread, index) => {
      const signature =
        relationSignature(
          `${thread?.trigger || ""} ${thread?.summary || ""}`,
        );

      const key = signature
        ? [
            String(thread?.sourceLevel || ""),
            signature,
            String(thread?.storyRole || ""),
          ].join("|")
        : [
            String(thread?.sourceLevel || ""),
            String(thread?.label || ""),
            String(thread?.storyRole || ""),
            stripInternalWords(
              compactText(
                thread?.summary ||
                thread?.trigger ||
                "",
                70,
              ),
            ),
          ].join("|");

      const current = groups.get(key) || {
        order: index,
        strength: 0,
        role: String(
          thread?.storyRole ||
          "trigger",
        ),
        status: String(
          thread?.status ||
          thread?.certainty ||
          "",
        ),
        title:
          signature ||
          String(
            thread?.label ||
            thread?.trigger ||
            "结构触发",
          ),
        labels: [],
        summaries: [],
        domains: [],
        sources: [],
        evidenceRefs: [],
        count: 0,
      };

      current.strength = Math.max(
        Number(current.strength || 0),
        Number(thread?.strength || 0),
      );
      current.labels.push(
        String(thread?.label || ""),
      );
      current.summaries.push(
        compactText(
          thread?.summary ||
          thread?.trigger ||
          "",
          110,
        ),
      );
      current.domains.push(
        ...array(thread?.domains),
      );
      if (thread?.domain) {
        current.domains.push(
          String(thread.domain),
        );
      }
      if (thread?.domainLabel) {
        current.sources.push(
          String(thread.domainLabel),
        );
      }
      current.evidenceRefs.push(
        ...array(thread?.evidenceRefs),
      );
      current.count += 1;

      groups.set(key, current);
    });

  return [...groups.values()]
    .map((entry) => {
      const domainLabels = unique([
        ...entry.sources,
        ...entry.domains
          .map(domainLabel)
          .filter(Boolean),
      ]).slice(0, 3);

      const summary =
        unique(entry.summaries)
          .filter(Boolean)[0] ||
        "当前结构被触发。";

      return {
        type:
          roleLabels[entry.role] ||
          "结构触发",
        status:
          statusLabels[entry.status] ||
          "结构",
        title:
          entry.title ||
          unique(entry.labels)[0] ||
          "结构触发",
        domains: domainLabels,
        summary:
          entry.count > 1 &&
          domainLabels.length
            ? `${entry.title || unique(entry.labels)[0] || "同一触发"}同时落到${domainLabels.join("、")}，${relationMeaning(entry.title || unique(entry.labels)[0])}`
            : summary,
        strength: Number(
          entry.strength || 0,
        ),
        evidenceRefs: unique(
          entry.evidenceRefs,
        ),
        role: entry.role,
        order: entry.order,
      };
    })
    .sort((left, right) =>
      (roleWeights[left.role] || 9) -
        (roleWeights[right.role] || 9) ||
      Number(right.strength || 0) -
        Number(left.strength || 0) ||
      left.order - right.order,
    )
    .slice(0, 4);
}


function relationMeaning(value) {
  const text = String(value || "");

  if (text.includes("冲")) {
    return "变化、拉扯和位置调整需要合并观察。";
  }
  if (text.includes("害")) {
    return "隐性阻力、沟通偏差和推进不顺需要合并观察。";
  }
  if (text.includes("刑")) {
    return "规则摩擦、反复修正和内耗需要合并观察。";
  }
  if (text.includes("破")) {
    return "松动、返工和重新组合需要合并观察。";
  }
  if (text.includes("合")) {
    return "连接、合作和责任牵连需要合并观察。";
  }
  if (text.includes("克")) {
    return "制约、筛选和压力需要合并观察。";
  }

  return "相关领域需要按主次合并观察。";
}

function buildCompactEvidence({
  evidencePack = {},
  structureFacts = [],
} = {}) {
  const baseRows = [
    ...array(evidencePack?.hits)
      .map((hit) => ({
        kind: "十神",
        label: String(
          hit?.label ||
          "十神命中",
        ),
        source: String(
          hit?.source ||
          "十神命中",
        ),
        text: compactText(
          hit?.bookExplanation ||
          hit?.masterTalk ||
          hit?.description ||
          "",
          150,
        ),
      })),
    ...array(evidencePack?.relations)
      .map((relation) => ({
        kind: "基础关系",
        label: String(
          relation?.label ||
          "关系触发",
        ),
        source: String(
          relation?.source ||
          "关系触发",
        ),
        text: compactText(
          relation?.description ||
          relation?.bookExplanation ||
          relation?.effect ||
          "",
          150,
        ),
      })),
  ];

  const structureRows = array(structureFacts)
    .filter((fact) =>
      fact &&
      fact?.label !== "层级并行" &&
      (
        fact?.text ||
        fact?.description
      ),
    )
    .map((fact) => ({
      kind:
        fact?.category === "combination"
          ? "条件组合"
          : fact?.category === "hierarchy"
            ? "层级关系"
            : fact?.category === "convergence"
              ? "汇合判断"
              : "结构关系",
      label: String(
        fact?.label ||
        "结构事实",
      ),
      status: statusLabels[
        String(fact?.status || "")
      ] || "结构",
      source: String(
        fact?.source ||
        "结构分析",
      ),
      text: compactText(
        fact?.text ||
        fact?.description ||
        "",
        160,
      ),
      strength: Number(
        fact?.strength || 0,
      ),
    }));

  return {
    base: dedupeEvidenceRows(
      baseRows,
      10,
    ),
    structure: dedupeEvidenceRows(
      structureRows,
      12,
    ),
    conditions: uniqueText(
      evidencePack?.explanations
        ?.conditions,
      6,
    ),
    counterEvidence: uniqueText(
      evidencePack?.explanations
        ?.counterEvidence,
      6,
    ),
  };
}

function dedupeEvidenceRows(
  rows = [],
  limit = 10,
) {
  const groups = new Map();

  array(rows).forEach((row, index) => {
    const signature =
      relationSignature(row?.text);

    const key = signature
      ? [
          row?.kind,
          signature,
        ].join("|")
      : [
          row?.kind,
          row?.label,
          stripInternalWords(
            compactText(
              row?.text,
              90,
            ),
          ),
        ].join("|");

    const current = groups.get(key) || {
      ...row,
      order: index,
      sources: [],
      texts: [],
      strength: 0,
      count: 0,
    };

    if (row?.source) {
      current.sources.push(
        String(row.source),
      );
    }
    if (row?.text) {
      current.texts.push(
        String(row.text),
      );
    }
    current.strength = Math.max(
      Number(current.strength || 0),
      Number(row?.strength || 0),
    );
    current.count += 1;

    groups.set(key, current);
  });

  return [...groups.values()]
    .map((entry) => {
      const sources = unique(
        entry.sources,
      );
      const texts = unique(
        entry.texts,
      );

      return {
        kind: String(
          entry.kind ||
          "证据",
        ),
        label:
          relationSignature(
            texts.join(" "),
          ) ||
          String(
            entry.label ||
            "证据",
          ),
        status: String(
          entry.status ||
          "",
        ),
        source:
          sources
            .slice(0, 3)
            .join("、"),
        text:
          texts[0] ||
          "",
        strength: Number(
          entry.strength || 0,
        ),
        count: entry.count,
        order: entry.order,
      };
    })
    .sort((left, right) =>
      Number(right.strength || 0) -
        Number(left.strength || 0) ||
      left.order - right.order,
    )
    .slice(0, limit);
}

function relationSignature(value) {
  const text = String(value || "");

  const branchMatch = text.match(
    new RegExp(
      `([${branchChars}])与([${branchChars}])成(六合|冲|刑|害|破)`,
    ),
  );

  if (branchMatch) {
    const relation =
      relationDisplay[
        branchMatch[3]
      ] || branchMatch[3];

    return `${branchMatch[1]}${relation}${branchMatch[2]}`;
  }

  const branchRepeat = text.match(
    new RegExp(
      `([${branchChars}])支重复`,
    ),
  );
  if (branchRepeat) {
    return `${branchRepeat[1]}支同现`;
  }

  const stemControl = text.match(
    new RegExp(
      `([${stemChars}])克([${stemChars}])`,
    ),
  );
  if (stemControl) {
    return `${stemControl[1]}克${stemControl[2]}`;
  }

  const stemPair = text.match(
    new RegExp(
      `([${stemChars}])与([${stemChars}]).{0,12}(五合|相合|同现|重复)`,
    ),
  );
  if (stemPair) {
    return `${stemPair[1]}${stemPair[3]}${stemPair[2]}`;
  }

  return "";
}

function domainLabel(domain) {
  const labels = {
    career: "事业与规则",
    rules: "事业与规则",
    pressure: "事业与规则",
    wealth: "财务与资源",
    resource: "财务与资源",
    relationship: "关系与合作",
    cooperation: "关系与合作",
    family: "家庭与根基",
    foundation: "家庭与根基",
    learning: "学习与支持",
    support: "学习与支持",
    expression: "表达与成果",
    output: "表达与成果",
    execution: "执行与落地",
    result: "执行与落地",
    competition: "竞争与自主",
    multi: "多领域联动",
  };

  return labels[
    String(domain || "")
  ] || "";
}

function uniqueText(
  values = [],
  limit = 6,
) {
  return unique(
    array(values)
      .map((value) =>
        compactText(
          value,
          130,
        ),
      )
      .filter(Boolean),
  ).slice(0, limit);
}

function compactText(
  value,
  limit = 100,
) {
  const text = String(
    value || "",
  )
    .replace(/\s+/g, " ")
    .trim();

  if (!text) return "";
  if (text.length <= limit) {
    return text;
  }

  return `${text.slice(
    0,
    Math.max(
      1,
      limit - 1,
    ),
  )}…`;
}

function stripInternalWords(value) {
  return String(value || "")
    .replace(
      /(大运|流年|流月)触发原局(年柱|月柱|日柱|时柱)[:：]?/g,
      "",
    )
    .replace(
      /(大运|流年|流月)对(大运|流年)[:：]?/g,
      "",
    )
    .replace(
      /\s+/g,
      "",
    )
    .replace(
      /[，。；：、]/g,
      "",
    );
}

function array(value) {
  return Array.isArray(value)
    ? value.filter(Boolean)
    : [];
}

function unique(values = []) {
  return [
    ...new Set(
      array(values)
        .map((value) =>
          String(value || "").trim(),
        )
        .filter(Boolean),
    ),
  ];
}
