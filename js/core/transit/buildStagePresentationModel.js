const stageLabels = {
  luck: "大运",
  year: "流年",
  month: "流月",
};

const stageLimits = {
  luck: {
    facts: 6,
    advantages: 2,
    pressures: 2,
    boundaries: 3,
  },
  year: {
    facts: 7,
    advantages: 2,
    pressures: 2,
    boundaries: 3,
  },
  month: {
    facts: 6,
    advantages: 1,
    pressures: 2,
    boundaries: 2,
  },
};

const domainGroups = {
  career: {
    label: "事业与规则",
    members: ["career", "rules", "pressure"],
  },
  wealth: {
    label: "财务与资源",
    members: ["wealth", "resource"],
  },
  relationship: {
    label: "关系与合作",
    members: ["relationship", "cooperation"],
  },
  family: {
    label: "家庭与根基",
    members: ["family", "foundation"],
  },
  learning: {
    label: "学习与支持",
    members: ["learning", "support"],
  },
  expression: {
    label: "表达与成果",
    members: ["expression", "output"],
  },
  execution: {
    label: "执行与落地",
    members: ["execution", "result"],
  },
  competition: {
    label: "竞争与自主",
    members: ["competition"],
  },
};

const rawDomainToGroup = Object.entries(domainGroups)
  .reduce((result, [groupKey, group]) => {
    group.members.forEach((member) => {
      result[member] = groupKey;
    });
    return result;
  }, {});

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

const tenGodBalance = {
  比肩: {
    strengths: ["自主推进", "坚持立场", "同辈协作"],
    pressures: ["竞争增强，合作成本和固执需要控制"],
  },
  劫财: {
    strengths: ["行动果断", "资源整合", "快速应变"],
    pressures: ["资源分配、冲动投入和同辈竞争需要控制"],
  },
  正印: {
    strengths: ["学习吸收", "资质保护", "获得支持"],
    pressures: ["容易依赖保护，执行速度可能偏慢"],
  },
  偏印: {
    strengths: ["独立研究", "快速理解", "非标准方法"],
    pressures: ["容易多想、节奏不稳或与常规脱节"],
  },
  食神: {
    strengths: ["表达能力", "技术输出", "作品沉淀"],
    pressures: ["容易偏重舒适和表达，执行节奏需要复核"],
  },
  伤官: {
    strengths: ["表达突破", "技术创新", "问题识别"],
    pressures: ["容易与规则、权威或沟通边界发生摩擦"],
  },
  正财: {
    strengths: ["务实执行", "责任管理", "稳定积累"],
    pressures: ["现实责任、支出和琐事可能增加"],
  },
  偏财: {
    strengths: ["资源流动", "机会捕捉", "人际调动"],
    pressures: ["机会容易分散，临时支出或承诺可能增多"],
  },
  正官: {
    strengths: ["规则意识", "岗位承担", "稳定推进"],
    pressures: ["考核、责任和外部约束可能增加"],
  },
  七杀: {
    strengths: ["执行力", "快速反应", "承担压力"],
    pressures: ["焦虑、冒进、强压和风险感需要控制"],
  },
};

const relationStrengths = {
  合: "合作、连接和资源整合更容易成为可用条件",
};

const relationPressures = {
  冲: "变化与拉扯增加，计划和关系需要保留调整空间",
  刑: "规则摩擦和内耗增加，执行时需要减少硬碰硬",
  害: "暗中牵制和不顺畅增加，需要留意隐性阻力",
  破: "反复、松动或计划调整增加，不宜过早定死结果",
};

const pressureRelations = new Set([
  "冲",
  "刑",
  "害",
  "破",
]);

export function buildStagePresentationModel({
  stage = "luck",
  item = {},
  report = {},
  evidencePack = {},
  localNarrative = null,
} = {}) {
  const normalizedStage = stageLabels[stage]
    ? stage
    : "luck";

  const limits =
    stageLimits[normalizedStage];

  const hits =
    array(evidencePack?.hits);

  const relations =
    array(evidencePack?.relations);

  const structureFacts =
    array(item?.transitStructure?.facts);

  const validIds = new Set(
    [
      ...hits,
      ...relations,
      ...structureFacts,
    ]
      .map((entry) =>
        String(entry?.id || "").trim(),
      )
      .filter(Boolean),
  );

  const triggeredImages =
    buildTriggeredImageModel(
      item?.triggerImages,
      validIds,
      normalizedStage,
    );

  const target =
    buildTarget(
      normalizedStage,
      item,
    );

  const contextChain =
    buildContextChain(
      normalizedStage,
      item,
    );

  const keyFacts =
    buildKeyFacts({
      stage: normalizedStage,
      item,
      hits,
      relations,
      structureFacts,
      validIds,
      limit: limits.facts,
    });

  const focusDomains =
    buildFocusDomains({
      hits,
      relations,
      structureFacts,
      validIds,
    });

  const advantages =
    buildAdvantages({
      hits,
      relations,
      structureFacts,
      validIds,
      localNarrative,
      limit: limits.advantages,
    });

  const pressures =
    buildPressures({
      hits,
      relations,
      structureFacts,
      validIds,
      item,
      limit: limits.pressures,
    });

  const boundaries =
    buildBoundaries({
      stage: normalizedStage,
      item,
      report,
      evidencePack,
      limit: limits.boundaries,
    });

  const headline =
    buildHeadline({
      stage: normalizedStage,
      item,
      hits,
      relations,
      localNarrative,
      report,
    });

  const allowedEvidenceRefs =
    unique([
      ...keyFacts.flatMap(
        (entry) =>
          entry.evidenceRefs,
      ),
      ...focusDomains.flatMap(
        (entry) =>
          entry.evidenceRefs,
      ),
      ...advantages.flatMap(
        (entry) =>
          entry.evidenceRefs,
      ),
      ...pressures.flatMap(
        (entry) =>
          entry.evidenceRefs,
      ),
      ...triggeredImages.threads.flatMap(
        (entry) =>
          entry.evidenceRefs,
      ),
    ].filter((id) =>
      validIds.has(id),
    ));

  return {
    stage: normalizedStage,
    target,
    headline,
    contextChain,
    focusDomains,
    keyFacts,
    advantages,
    pressures,
    boundaries,
    structureSummary:
      item?.transitStructure?.summary ?? null,
    structureFacts,
    triggeredImages,
    aiPack: {
      stage: normalizedStage,
      target,
      headline,
      selectedFacts: keyFacts,
      focusDomains,
      boundaries,
      structureSummary:
        item?.transitStructure?.summary ?? null,
      structureFacts,
      triggeredImages,
      storyBlueprint:
        triggeredImages.storyBlueprint,
      hierarchyFacts:
        array(item?.transitStructure?.hierarchyFacts),
      convergenceFacts:
        array(item?.transitStructure?.convergenceFacts),
      allowedEvidenceRefs,
      forbiddenClaims: [
        "不得脱离证据重新排盘",
        "不得把结构触发写成必然事件",
        "不得凭空断具体职业、金额、疾病、婚期或灾祸",
      ],
    },
  };
}

function buildTriggeredImageModel(
  rawValue,
  validIds,
  stage,
) {
  const raw =
    rawValue &&
    typeof rawValue === "object"
      ? rawValue
      : {};

  const threads = array(raw.threads)
    .map((thread, index) => ({
      id:
        String(
          thread?.id ||
          `${stage}:trigger-image:${index}`,
        ),
      domain:
        String(thread?.domain || ""),
      domainLabel:
        String(
          thread?.domainLabel ||
          "现实落点",
        ),
      label:
        String(
          thread?.label ||
          "触发取象",
        ),
      certainty:
        normalizeImageCertainty(
          thread?.certainty,
        ),
      storyRole:
        String(
          thread?.storyRole ||
          "trigger",
        ),
      strength:
        Number(thread?.strength || 0),
      trigger:
        shortText(
          thread?.trigger || "",
          72,
        ),
      summary:
        shortText(
          thread?.summary || "",
          150,
        ),
      possibleScenes:
        unique(
          array(
            thread?.possibleScenes,
          ),
        ).slice(0, 4),
      usefulDirections:
        unique(
          array(
            thread?.usefulDirections,
          ),
        ).slice(0, 3),
      pressureSignals:
        unique(
          array(
            thread?.pressureSignals,
          ),
        ).slice(0, 3),
      conditions:
        unique(
          array(thread?.conditions),
        ).slice(0, 3),
      evidenceRefs:
        unique(
          array(thread?.evidenceRefs)
            .filter((id) =>
              validIds.has(
                String(id),
              ),
            ),
        ),
    }))
    .filter((thread) =>
      thread.summary ||
      thread.possibleScenes.length,
    );

  const blueprint =
    raw.storyBlueprint &&
    typeof raw.storyBlueprint ===
      "object"
      ? {
          opening:
            shortText(
              raw.storyBlueprint.opening ||
              raw.headline ||
              "",
              100,
            ),
          development:
            shortText(
              raw.storyBlueprint.development ||
              "",
              130,
            ),
          turn:
            shortText(
              raw.storyBlueprint.turn ||
              "",
              120,
            ),
          landing:
            shortText(
              raw.storyBlueprint.landing ||
              "",
              120,
            ),
          threadIds:
            unique(
              array(
                raw.storyBlueprint.threadIds,
              ),
            ),
        }
      : {
          opening: "",
          development: "",
          turn: "",
          landing: "",
          threadIds: [],
        };

  return {
    stage,
    timeframe:
      String(raw.timeframe || ""),
    headline:
      shortText(
        raw.headline ||
        blueprint.opening ||
        "",
        100,
      ),
    threads,
    storyBlueprint: blueprint,
    evidenceRefs:
      unique(
        threads.flatMap(
          (thread) =>
            thread.evidenceRefs,
        ),
      ),
    boundaries:
      unique(
        array(raw.boundaries),
      ).slice(0, 3),
  };
}

function normalizeImageCertainty(value) {
  return [
    "direct",
    "background",
    "conditional",
    "combined",
  ].includes(value)
    ? value
    : "background";
}


function buildTarget(
  stage,
  item,
) {
  if (stage === "luck") {
    return {
      label: [
        item.ageRange,
        item.yearRange,
      ].filter(Boolean).join(" / "),
      ganZhi: item.ganZhi || "",
      year: null,
      month: null,
      dateRange: "",
    };
  }

  if (stage === "year") {
    return {
      label:
        item.year
          ? `${item.year}年`
          : "",
      ganZhi:
        item.ganZhi || "",
      year:
        numberOrNull(item.year),
      month: null,
      dateRange: "",
    };
  }

  return {
    label:
      item.flowMonthLabel ||
      (
        item.month
          ? `${item.month}月`
          : ""
      ),
    ganZhi:
      item.ganZhi || "",
    year:
      numberOrNull(item.year),
    month:
      numberOrNull(
        item.month ||
        item.flowMonthIndex,
      ),
    dateRange:
      item.dateRangeLabel || "",
  };
}

function buildContextChain(
  stage,
  item,
) {
  const result = [
    {
      level: "natal",
      label: "原局",
      value: "底层结构",
    },
  ];

  if (stage === "luck") {
    result.push({
      level: "luck",
      label: "大运",
      value: [
        item.ganZhi,
        item.ageRange,
        item.yearRange,
      ].filter(Boolean).join(" / ") ||
        "待复核",
    });

    return result;
  }

  result.push({
    level: "luck",
    label: "大运",
    value: [
      item.currentLuckItem?.ganZhi,
      item.currentLuckItem?.ageRange,
      item.currentLuckItem?.yearRange,
    ].filter(Boolean).join(" / ") ||
      "待复核",
  });

  if (stage === "year") {
    result.push({
      level: "year",
      label: "流年",
      value: [
        item.year,
        item.ganZhi,
      ].filter(Boolean).join(" ") ||
        "待复核",
    });

    return result;
  }

  result.push({
    level: "year",
    label: "流年",
    value: [
      item.yearItem?.year,
      item.yearItem?.ganZhi,
    ].filter(Boolean).join(" ") ||
      "待复核",
  });

  result.push({
    level: "month",
    label: "流月",
    value: [
      item.ganZhi,
      item.dateRangeLabel,
    ].filter(Boolean).join(" / ") ||
      "待复核",
  });

  return result;
}

function buildHeadline({
  stage,
  item,
  hits,
  relations,
  localNarrative,
  report,
}) {
  const tenGods = unique(
    hits
      .map((hit) =>
        hit?.label,
      )
      .filter(Boolean),
  );

  const relationLabels = unique(
    relations
      .map((relation) =>
        relation?.label,
      )
      .filter(Boolean),
  );

  const themeText =
    tenGods.length
      ? tenGods.slice(0, 2).join("、")
      : "当前十神";

  const relationText =
    relationLabels.length
      ? `同时见${relationLabels.slice(0, 3).join("、")}关系触发`
      : "当前基础关系触发不强";

  const structureText =
    item?.transitStructure?.summary?.text ||
    "";

  if (stage === "luck") {
    return shortText(
      `${item.ganZhi || "当前"}大运以${themeText}为长期主线，${relationText}。${structureText}`,
      124,
    );
  }

  if (stage === "year") {
    return shortText(
      `${item.year || "当前"}年${item.ganZhi || ""}流年在${item.currentLuckItem?.ganZhi || "当前"}大运背景下新增${themeText}主题，${relationText}。${structureText}`,
      124,
    );
  }

  if (stage === "month") {
    return shortText(
      `${item.year || "当前"}年${item.ganZhi || ""}流月主要看${themeText}带来的短期触发，${relationText}。${structureText}`,
      120,
    );
  }

  return shortText(
    localNarrative?.headline ||
    report?.summary?.overview ||
    item?.shortImage ||
    item?.image ||
    "当前阶段结构待复核",
    96,
  );
}

function buildKeyFacts({
  stage,
  item,
  hits,
  relations,
  structureFacts,
  validIds,
  limit,
}) {
  const advancedFacts =
    structureFacts.map(
      (fact, index) => {
        const evidenceId =
          safeId(
            fact?.id,
            validIds,
          );

        return {
          id:
            evidenceId ||
            `${stage}:structure:${index}`,
          type:
            fact?.category ||
            fact?.type ||
            "structure",
          label:
            fact?.label ||
            "结构组合",
          text:
            shortText(
              fact?.text ||
              fact?.description ||
              "结构事实待复核",
              76,
            ),
          source:
            humanSource(
              fact?.source ||
              "结构分析",
            ),
          strength:
            Number(
              fact?.strength,
            ) || 3,
          evidenceRefs:
            evidenceId
              ? [evidenceId]
              : [],
        };
      },
    );

  const advancedLabels =
    new Set(
      structureFacts
        .map((fact) =>
          fact?.label === "六合"
            ? "合"
            : fact?.label,
        )
        .filter(Boolean),
    );

  const relationFacts =
    relations
      .filter((relation) =>
        !advancedLabels.has(
          relation?.label,
        ),
      )
      .map(
      (relation, index) => {
        const evidenceId =
          safeId(
            relation?.id,
            validIds,
          );

        return {
          id:
            evidenceId ||
            `${stage}:relation:${index}`,
          type: "relation",
          label:
            relation?.label ||
            "关系触发",
          text:
            shortText(
              relation?.description ||
              relation?.effect ||
              relation?.bookExplanation ||
              relation?.label ||
              "关系触发待复核",
              64,
            ),
          source:
            humanSource(
              relation?.source ||
              "关系触发",
            ),
          strength:
            pressureRelations.has(
              relation?.label,
            )
              ? 4
              : 3,
          evidenceRefs:
            evidenceId
              ? [evidenceId]
              : [],
        };
      },
    );

  const hitFacts =
    hits.map(
      (hit, index) => {
        const evidenceId =
          safeId(
            hit?.id,
            validIds,
          );

        const strengthText =
          first(
            tenGodBalance[
              hit?.label
            ]?.strengths,
          );

        return {
          id:
            evidenceId ||
            `${stage}:hit:${index}`,
          type: "ten_god",
          label:
            hit?.label ||
            "十神主题",
          text:
            shortText(
              `${humanSource(hit?.source || "十神命中")}见${hit?.label || "待查"}${strengthText ? `，可先关注${strengthText}` : ""}。`,
              64,
            ),
          source:
            humanSource(
              hit?.source ||
              "十神命中",
            ),
          strength: 2,
          evidenceRefs:
            evidenceId
              ? [evidenceId]
              : [],
        };
      },
    );

  const contextFacts =
    buildContextFacts(
      stage,
      item,
    );

  const advancedLimit =
    stage === "month"
      ? 4
      : 5;

  const selectedAdvanced =
    [...advancedFacts]
      .sort(
        (left, right) =>
          right.strength -
          left.strength,
      )
      .slice(0, advancedLimit);

  return uniqueObjects([
    ...selectedAdvanced,
    ...relationFacts,
    ...hitFacts.slice(0, 2),
    ...contextFacts,
  ])
    .slice(0, limit);
}

function buildContextFacts(
  stage,
  item,
) {
  const facts = [];

  if (stage === "luck") {
    facts.push({
      id: "luck:context:range",
      type: "context",
      label: "阶段位置",
      text: shortText(
        `${item.ganZhi || "当前大运"}覆盖${item.ageRange || "年龄待查"}、${item.yearRange || "年份待查"}，只作为长期背景。`,
        64,
      ),
      source: "当前选择",
      strength: 1,
      evidenceRefs: [],
    });
  }

  if (stage === "year") {
    facts.push({
      id: "year:context:luck",
      type: "context",
      label: "大运背景",
      text: shortText(
        `本年需要放在${item.currentLuckItem?.ganZhi || "当前大运"}大运中判断，不单独脱离大运解释。`,
        64,
      ),
      source: "上下文",
      strength: 1,
      evidenceRefs: [],
    });
  }

  if (stage === "month") {
    facts.push(
      {
        id: "month:context:luck",
        type: "context",
        label: "大运背景",
        text: shortText(
          `本月继承${item.currentLuckItem?.ganZhi || "当前大运"}大运的长期背景。`,
          64,
        ),
        source: "上下文",
        strength: 1,
        evidenceRefs: [],
      },
      {
        id: "month:context:year",
        type: "context",
        label: "流年背景",
        text: shortText(
          `本月同时继承${item.yearItem?.year || item.year || "当前"}年${item.yearItem?.ganZhi || "流年"}的年度主线。`,
          64,
        ),
        source: "上下文",
        strength: 1,
        evidenceRefs: [],
      },
    );
  }

  return facts;
}

function buildFocusDomains({
  hits,
  relations,
  structureFacts,
  validIds,
}) {
  const scoreMap = new Map();
  let order = 0;

  function add(
    rawDomain,
    score,
    reason,
    evidenceId,
  ) {
    const groupKey =
      rawDomainToGroup[
        rawDomain
      ];

    const group =
      domainGroups[groupKey];

    if (!group) {
      return;
    }

    const current =
      scoreMap.get(groupKey) || {
        key: groupKey,
        label: group.label,
        score: 0,
        order: order++,
        reasons: [],
        evidenceRefs: [],
      };

    current.score += score;

    if (reason) {
      current.reasons.push(reason);
    }

    if (
      evidenceId &&
      validIds.has(evidenceId)
    ) {
      current.evidenceRefs.push(
        evidenceId,
      );
    }

    scoreMap.set(
      groupKey,
      current,
    );
  }


  structureFacts.forEach(
    (fact) => {
      const score =
        Math.max(
          1,
          Math.min(
            5,
            Number(fact?.strength) || 2,
          ),
        );

      array(fact?.domains)
        .forEach((domain) => {
          add(
            domain,
            score,
            `${fact?.label || "结构"}：${humanSource(fact?.source || "层级关系")}`,
            fact?.id,
          );
        });
    },
  );
  hits.forEach((hit) => {
    (
      tenGodDomains[
        hit?.label
      ] || []
    ).forEach((domain) => {
      add(
        domain,
        1,
        `${hit.label}主题`,
        hit.id,
      );
    });
  });

  relations.forEach(
    (relation) => {
      const relationText = [
        relation?.description,
        relation?.natalPillar,
        relation?.source,
      ].filter(Boolean).join(" ");

      const matchedDomains =
        Object.entries(
          pillarDomains,
        )
          .filter(([pillar]) =>
            relationText.includes(
              pillar,
            ),
          )
          .flatMap(([, domains]) =>
            domains,
          );

      const fallbackDomains =
        relation?.source?.includes(
          "原局",
        )
          ? [
              "relationship",
              "execution",
            ]
          : relation?.source?.includes(
              "大运",
            )
            ? [
                "career",
                "foundation",
              ]
            : [
                "execution",
                "cooperation",
              ];

      const score =
        2 +
        (
          pressureRelations.has(
            relation?.label,
          )
            ? 1
            : 0
        );

      (
        matchedDomains.length
          ? matchedDomains
          : fallbackDomains
      ).forEach((domain) => {
        add(
          domain,
          score,
          `${humanSource(relation?.source || "关系触发")}见${relation?.label || "触发"}`,
          relation.id,
        );
      });
    },
  );

  return [
    ...scoreMap.values(),
  ]
    .sort(
      (left, right) =>
        right.score -
        left.score ||
        left.order -
        right.order,
    )
    .slice(0, 3)
    .map((entry) => ({
      key: entry.key,
      label: entry.label,
      score: entry.score,
      level:
        entry.score >= 5
          ? "高"
          : entry.score >= 3
            ? "中"
            : "关注",
      reason:
        unique(entry.reasons)
          .slice(0, 2)
          .join("；"),
      evidenceRefs:
        unique(
          entry.evidenceRefs,
        ),
    }));
}

function buildAdvantages({
  hits,
  relations,
  structureFacts,
  validIds,
  localNarrative,
  limit,
}) {
  const result = [];


  structureFacts
    .filter((fact) =>
      [
        "六合",
        "天干五合",
        "半合条件",
        "三合局条件",
        "三会两支",
        "三会局条件",
        "层级同向加力",
        "五行相承",
      ].includes(fact?.label),
    )
    .forEach((fact) => {
      const evidenceId =
        safeId(
          fact?.id,
          validIds,
        );

      result.push({
        text:
          shortText(
            fact?.text ||
            `${fact?.label || "结构"}可作为当前阶段的承接条件`,
            72,
          ),
        evidenceRefs:
          evidenceId
            ? [evidenceId]
            : [],
      });
    });
  hits.forEach((hit) => {
    const evidenceId =
      safeId(
        hit?.id,
        validIds,
      );

    const strengths =
      tenGodBalance[
        hit?.label
      ]?.strengths || [];

    strengths
      .slice(0, 2)
      .forEach((text) => {
        result.push({
          text:
            shortText(
              text,
              56,
            ),
          evidenceRefs:
            evidenceId
              ? [evidenceId]
              : [],
        });
      });
  });

  relations.forEach(
    (relation) => {
      const text =
        relationStrengths[
          relation?.label
        ];

      if (!text) {
        return;
      }

      const evidenceId =
        safeId(
          relation?.id,
          validIds,
        );

      result.push({
        text:
          shortText(
            text,
            64,
          ),
        evidenceRefs:
          evidenceId
            ? [evidenceId]
            : [],
      });
    },
  );

  if (!result.length) {
    const realitySection =
      array(
        localNarrative?.sections,
      ).find(
        (section) =>
          section?.title ===
          "现实画面",
      );

    if (realitySection?.text) {
      result.push({
        text:
          shortText(
            realitySection.text,
            64,
          ),
        evidenceRefs: [],
      });
    }
  }

  return uniqueObjects(result)
    .slice(0, limit);
}

function buildPressures({
  hits,
  relations,
  structureFacts,
  validIds,
  item,
  limit,
}) {
  const result = [];


  structureFacts
    .filter((fact) =>
      fact?.polarity ===
        "pressure" ||
      [
        "冲",
        "刑",
        "害",
        "破",
        "自刑",
        "三刑组合",
        "天干相克",
        "天克地冲",
        "层级牵制转向",
      ].includes(fact?.label),
    )
    .forEach((fact) => {
      const evidenceId =
        safeId(
          fact?.id,
          validIds,
        );

      result.push({
        text:
          shortText(
            fact?.text ||
            `${fact?.label || "结构压力"}需要留意`,
            78,
          ),
        evidenceRefs:
          evidenceId
            ? [evidenceId]
            : [],
      });
    });
  relations.forEach(
    (relation) => {
      const evidenceId =
        safeId(
          relation?.id,
          validIds,
        );

      const mappedText =
        relationPressures[
          relation?.label
        ];

      const text =
        mappedText ||
        first(
          relation?.counterEvidence,
        ) ||
        relation?.effect ||
        "";

      if (!text) {
        return;
      }

      result.push({
        text:
          shortText(
            text,
            72,
          ),
        evidenceRefs:
          evidenceId
            ? [evidenceId]
            : [],
      });
    },
  );

  hits.forEach((hit) => {
    const evidenceId =
      safeId(
        hit?.id,
        validIds,
      );

    const pressureText =
      first(
        tenGodBalance[
          hit?.label
        ]?.pressures,
      );

    if (!pressureText) {
      return;
    }

    result.push({
      text:
        shortText(
          pressureText,
          72,
        ),
      evidenceRefs:
        evidenceId
          ? [evidenceId]
          : [],
    });
  });

  if (
    !result.length &&
    item?.reality
  ) {
    result.push({
      text:
        shortText(
          firstSentence(
            item.reality,
          ),
          72,
        ),
      evidenceRefs: [],
    });
  }

  return uniqueObjects(result)
    .slice(0, limit);
}

function buildBoundaries({
  stage,
  item,
  report,
  evidencePack,
  limit,
}) {
  const candidates = [
    item?.boundary,
    ...array(
      report?.needVerify,
    ),
    evidencePack?.summary?.caution,
    evidencePack?.summary?.verify,
  ];

  const selected = [];
  const usedCategories =
    new Set();

  unique(candidates)
    .forEach((text) => {
      const category =
        boundaryCategory(text);

      if (
        category &&
        usedCategories.has(category)
      ) {
        return;
      }

      selected.push({
        text:
          shortText(
            text,
            stage === "month"
              ? 78
              : 90,
          ),
        evidenceRefs: [],
      });

      if (category) {
        usedCategories.add(
          category,
        );
      }
    });

  return selected.slice(0, limit);
}

function boundaryCategory(
  value,
) {
  const text =
    String(value || "");

  if (
    /不直接|不等同|不能.*事件|不宜.*断/.test(
      text,
    )
  ) {
    return "event";
  }

  if (
    /结合原局|大运背景|流年背景|现实反馈|现实承接/.test(
      text,
    )
  ) {
    return "context";
  }

  if (
    /复核|起运|顺逆|节气|边界/.test(
      text,
    )
  ) {
    return "verify";
  }

  return "";
}

function humanSource(
  value,
) {
  return String(value || "")
    .replaceAll("阶段信号", "阶段信息")
    .replaceAll("报告信号", "阶段信息")
    .replaceAll("天干十神", "天干")
    .replaceAll("地支主气十神", "地支主气")
    .trim();
}

function safeId(
  value,
  validIds,
) {
  const id =
    String(value || "").trim();

  return id &&
    validIds.has(id)
      ? id
      : "";
}

function array(value) {
  return Array.isArray(value)
    ? value.filter(Boolean)
    : [];
}

function numberOrNull(value) {
  const number =
    Number(value);

  return Number.isFinite(number)
    ? number
    : null;
}

function first(value) {
  if (Array.isArray(value)) {
    return value.find(
      (entry) =>
        String(entry || "").trim(),
    ) || "";
  }

  return String(value || "")
    .trim();
}

function firstSentence(value) {
  const text =
    String(value || "")
      .replace(/\s+/g, " ")
      .trim();

  return text.match(
    /^[^。！？；]+[。！？；]?/,
  )?.[0] || text;
}

function shortText(
  value,
  maxLength = 80,
) {
  const text =
    String(value || "")
      .replace(
        /必然|一定|注定|肯定发生/g,
        "更容易",
      )
      .replace(/\s+/g, " ")
      .trim();

  return text.length > maxLength
    ? `${text.slice(0, maxLength - 1)}…`
    : text;
}

function unique(items) {
  return [
    ...new Set(
      items
        .flat()
        .map((item) =>
          String(item || "").trim(),
        )
        .filter(Boolean),
    ),
  ];
}

function uniqueObjects(items) {
  const seen = new Set();

  return items.filter((item) => {
    const key =
      String(item?.text || "")
        .replace(/[，。；：、\s]/g, "")
        .trim();

    if (
      !key ||
      seen.has(key)
    ) {
      return false;
    }

    seen.add(key);
    return true;
  });
}
