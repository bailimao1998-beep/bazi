const VALUE_LABELS = {
  luck: "大运",
  year: "流年",
  month: "流月",
  male: "男",
  female: "女",
  unknown: "未知",
  yang: "阳",
  yin: "阴",
  direct: "直接成立",
  inferred: "推导成立",
  background: "背景条件",
  condition_only: "仅有条件",
  unresolved: "尚未确认",
  arch_condition: "拱合条件",
  formed: "已成立",
  not_formed: "未成立",
  not_applicable: "不适用",
  must_compare: "必须比较",
  optional: "可选比较",
  year: "年柱",
  month: "月柱",
  day: "日柱",
  hour: "时柱",
};

const META_KEY_LABELS = {
  controller: "施克者",
  controlled: "受克者",
  direction: "作用方向",
  targetElement: "目标五行",
  transformationStatus: "合化状态",
  formationStatus: "成局状态",
  conditionType: "条件类型",
  parentLevel: "上层层级",
  stemDirection: "天干方向",
  subtype: "细分类别",
  element: "五行",
  sourceLevel: "来源层级",
  targetLevel: "目标层级",
  natalPillar: "原局柱位",
  currentStem: "当前天干",
  currentBranch: "当前地支",
  targetStem: "目标天干",
  targetBranch: "目标地支",
};

export function buildStageAiPromptSource(
  trustedPack = {},
) {
  return deepCompact({
    报告阶段:
      text(
        trustedPack?.stageLabel,
      ) ||
      translateValue(
        trustedPack?.stage,
      ),

    分析目标:
      translateTarget(
        trustedPack?.target,
      ),

    基础资料: {
      原局:
        translateNatal(
          trustedPack
            ?.factualContext
            ?.natal,
        ),
      大运:
        translateStageLayer(
          trustedPack
            ?.factualContext
            ?.luck,
        ),
      流年:
        translateStageLayer(
          trustedPack
            ?.factualContext
            ?.year,
        ),
      流月:
        translateStageLayer(
          trustedPack
            ?.factualContext
            ?.month,
        ),
    },

    确定关系:
      array(
        trustedPack?.relationFacts,
      )
        .map(
          translateRelationFact,
        )
        .filter(Boolean),

    允许使用的关系:
      array(
        trustedPack
          ?.relationWhitelist,
      )
        .map(
          translateRelationWhitelist,
        )
        .filter(Boolean),

    机械信号:
      translateMechanicalSignals(
        trustedPack
          ?.mechanicalSignals,
      ),

    证据汇合:
      translateEvidenceConvergences(
        trustedPack
          ?.evidenceConvergences,
      ),

    原局候选取象:
      translateNatalInterpretations(
        trustedPack
          ?.candidateInterpretations,
      ),

    写作边界: [
      "只能解释这里已经提供的机械关系，不得自行补充新的冲合刑害破。",
      "同一十神可以有多个现实落点，应比较证据强弱后排序。",
      "标为必须比较的证据汇合不能完全忽略。",
      "只允许把日支称为配偶宫。",
      "条件关系不能写成已经合化或已经成局。",
      "不得默认当事人正在工作、在校、已婚或已有子女。",
    ],
  });
}

function translateTarget(
  target,
) {
  if (!target) {
    return null;
  }

  return compactObject({
    年份:
      numberOrNull(
        target?.year,
      ),
    月份:
      numberOrNull(
        target?.month,
      ),
    干支:
      text(
        target?.ganZhi,
      ),
    年龄范围:
      text(
        target?.ageRange,
      ),
    年份范围:
      text(
        target?.yearRange,
      ),
    流月名称:
      text(
        target
          ?.flowMonthLabel,
      ),
    日期范围:
      text(
        target
          ?.dateRangeLabel,
      ),
  });
}

function translateNatal(
  natal,
) {
  if (!natal) {
    return null;
  }

  return compactObject({
    性别:
      translateValue(
        natal?.gender,
      ),
    日主:
      text(
        natal?.dayMaster,
      ),
    四柱:
      array(
        natal?.pillars,
      ).map(
        translateNatalPillar,
      ),
    五行:
      natal?.fiveElements ??
      null,
  });
}

function translateNatalPillar(
  pillar,
) {
  return compactObject({
    柱位:
      translatePillarKey(
        pillar?.key,
      ),
    名称:
      text(
        pillar?.name,
      ),
    天干:
      text(
        pillar?.stem,
      ),
    地支:
      text(
        pillar?.branch,
      ),
    干支:
      text(
        pillar?.ganZhi,
      ),
    天干十神:
      text(
        pillar?.stemTenGod,
      ),
    地支主气十神:
      text(
        pillar
          ?.branchMainTenGod,
      ),
    藏干:
      translateHiddenStems(
        pillar?.hiddenStems,
      ),
    神煞:
      translateShensha(
        pillar?.shensha,
      ),
  });
}

function translateStageLayer(
  layer,
) {
  if (!layer) {
    return null;
  }

  return compactObject({
    干支:
      text(
        layer?.ganZhi,
      ),
    年份:
      numberOrNull(
        layer?.year,
      ),
    月份:
      numberOrNull(
        layer?.month,
      ),
    年龄范围:
      text(
        layer?.ageRange,
      ),
    年份范围:
      text(
        layer?.yearRange,
      ),
    流月名称:
      text(
        layer
          ?.flowMonthLabel,
      ),
    日期范围:
      text(
        layer
          ?.dateRangeLabel,
      ),
    天干十神:
      text(
        layer?.stemTenGod,
      ),
    地支主气十神:
      text(
        layer
          ?.branchMainTenGod,
      ),
    藏干:
      translateHiddenStems(
        layer?.hiddenStems,
      ),
    神煞:
      translateShensha(
        layer?.shensha,
      ),
  });
}

function translateRelationFact(
  fact,
) {
  if (!fact) {
    return null;
  }

  return compactObject({
    关系:
      text(
        fact?.label,
      ),
    状态:
      translateValue(
        fact?.status,
      ),
    类别:
      translateValue(
        fact?.category,
      ),
    来源:
      text(
        fact?.source,
      ),
    参与对象:
      array(
        fact?.participants,
      )
        .map(text)
        .filter(Boolean),
    方向信息:
      translateRelationMeta(
        fact?.meta,
      ),
  });
}

function translateRelationMeta(
  meta,
) {
  if (
    !meta ||
    typeof meta !== "object"
  ) {
    return null;
  }

  const result = {};

  Object.entries(
    META_KEY_LABELS,
  ).forEach(
    ([
      sourceKey,
      targetKey,
    ]) => {
      const value =
        meta?.[sourceKey];

      if (
        value === undefined ||
        value === null ||
        value === ""
      ) {
        return;
      }

      result[targetKey] =
        translateValue(
          value,
        );
    },
  );

  return Object.keys(
    result,
  ).length
    ? result
    : null;
}

function translateRelationWhitelist(
  entry,
) {
  if (!entry) {
    return null;
  }

  return compactObject({
    关系类型:
      text(
        entry?.kind,
      ),
    天干:
      array(
        entry?.stems,
      )
        .map(text)
        .filter(Boolean),
    地支:
      array(
        entry?.branches,
      )
        .map(text)
        .filter(Boolean),
    状态:
      translateValue(
        entry?.status,
      ),
    成局状态:
      translateValue(
        entry
          ?.formationStatus,
      ),
    合化状态:
      translateValue(
        entry
          ?.transformationStatus,
      ),
  });
}

function translateMechanicalSignals(
  signals,
) {
  if (!signals) {
    return null;
  }

  return compactObject({
    日主:
      compactObject({
        天干:
          text(
            signals
              ?.dayMaster
              ?.stem,
          ),
        五行:
          text(
            signals
              ?.dayMaster
              ?.element,
          ),
        阴阳:
          translateValue(
            signals
              ?.dayMaster
              ?.polarity,
          ),
      }),

    配偶星规则:
      compactObject({
        性别:
          translateValue(
            signals
              ?.spouseStarRule
              ?.gender,
          ),
        对应十神:
          array(
            signals
              ?.spouseStarRule
              ?.tenGods,
          )
            .map(text)
            .filter(Boolean),
        规则说明:
          text(
            signals
              ?.spouseStarRule
              ?.rule,
          ),
      }),

    分层信号:
      compactObject({
        大运:
          translateMechanicalLayer(
            signals
              ?.layers
              ?.luck,
          ),
        流年:
          translateMechanicalLayer(
            signals
              ?.layers
              ?.year,
          ),
        流月:
          translateMechanicalLayer(
            signals
              ?.layers
              ?.month,
          ),
      }),

    跨层汇合:
      compactObject({
        重复十神:
          array(
            signals
              ?.convergence
              ?.repeatedTenGods,
          ).map(
            (entry) =>
              compactObject({
                十神:
                  text(
                    entry?.tenGod,
                  ),
                出现层级:
                  array(
                    entry?.layers,
                  ).map(
                    translateValue,
                  ),
              }),
          ),
        配偶星出现层级:
          array(
            signals
              ?.convergence
              ?.spouseStarLayers,
          ).map(
            translateLayerEvidence,
          ),
        辅助命中:
          array(
            signals
              ?.convergence
              ?.auxiliaryHits,
          ).map(
            translateAuxiliaryHit,
          ),
      }),
  });
}

function translateMechanicalLayer(
  layer,
) {
  if (!layer) {
    return null;
  }

  return compactObject({
    层级:
      translateValue(
        layer?.layer,
      ),
    干支:
      text(
        layer?.ganZhi,
      ),
    天干:
      text(
        layer?.stem,
      ),
    地支:
      text(
        layer?.branch,
      ),
    天干十神:
      text(
        layer?.stemTenGod,
      ),
    地支主气十神:
      text(
        layer
          ?.branchMainTenGod,
      ),
    藏干:
      translateHiddenStems(
        layer?.hiddenStems,
      ),
    配偶星出现:
      array(
        layer?.spouseStarHits,
      ).map(
        (entry) =>
          compactObject({
            位置:
              text(
                entry?.location,
              ),
            天干:
              text(
                entry?.stem,
              ),
            十神:
              text(
                entry?.tenGod,
              ),
          }),
      ),
    辅助命中:
      array(
        layer?.auxiliaryHits,
      ).map(
        translateAuxiliaryHit,
      ),
    与原局比较:
      array(
        layer
          ?.natalComparisons,
      ).map(
        (entry) =>
          compactObject({
            目标柱位:
              translatePillarKey(
                entry
                  ?.targetPillar,
              ),
            目标柱:
              text(
                entry
                  ?.targetGanZhi,
              ),
            同干:
              Boolean(
                entry?.sameStem,
              ),
            同支:
              Boolean(
                entry?.sameBranch,
              ),
            整柱相同:
              Boolean(
                entry
                  ?.samePillar,
              ),
          }),
      ),
    神煞:
      translateShensha(
        layer?.shensha,
      ),
  });
}

function translateEvidenceConvergences(
  convergences,
) {
  if (!convergences) {
    return null;
  }

  return compactObject({
    原局十神数量:
      convergences
        ?.natalTenGodCounts ??
      null,

    感情与配偶关系:
      translateConvergenceBlock(
        convergences
          ?.relationship,
      ),

    学业资格与规则:
      translateConvergenceBlock(
        convergences
          ?.standardsReview,
      ),

    表达输出与规则:
      translateConvergenceBlock(
        convergences
          ?.outputAndRules,
      ),

    计划执行与成果:
      translateConvergenceBlock(
        convergences
          ?.planAndResults,
      ),
  });
}

function translateConvergenceBlock(
  block,
) {
  if (!block) {
    return null;
  }

  return compactObject({
    优先级:
      translateValue(
        block?.priority,
      ),
    独立证据数量:
      numberOrNull(
        block
          ?.independentEvidenceCount,
      ),
    比较要求:
      text(
        block?.instruction,
      ),
    配偶星层级:
      array(
        block?.spouseStarLayers,
      ).map(
        translateLayerEvidence,
      ),
    日支桃花命中:
      array(
        block?.dayPeachHits,
      ).map(
        translateAuxiliaryHit,
      ),
    日柱关系:
      array(
        block?.dayRelationFacts,
      ).map(
        translateRelationReference,
      ),
    官杀层级:
      array(
        block?.officerLayers,
      ).map(
        translateLayerEvidence,
      ),
    原局印星数量:
      numberOrNull(
        block?.natalSealCount,
      ),
    成果层关系:
      array(
        block
          ?.resultLayerRelations,
      ).map(
        translateRelationReference,
      ),
    食伤层级:
      array(
        block?.outputLayers,
      ).map(
        translateLayerEvidence,
      ),
    定向生克关系:
      array(
        block
          ?.directionalControlFacts,
      ).map(
        translateRelationReference,
      ),
  });
}

function translateLayerEvidence(
  entry,
) {
  if (!entry) {
    return null;
  }

  return compactObject({
    层级:
      translateValue(
        entry?.layer,
      ),
    干支:
      text(
        entry?.ganZhi,
      ),
    十神:
      array(
        entry?.tenGods,
      )
        .map(text)
        .filter(Boolean),
    命中:
      array(
        entry?.hits,
      ).map(
        (hit) =>
          compactObject({
            位置:
              text(
                hit?.location,
              ),
            天干:
              text(
                hit?.stem,
              ),
            十神:
              text(
                hit?.tenGod,
              ),
          }),
      ),
  });
}

function translateAuxiliaryHit(
  entry,
) {
  if (!entry) {
    return null;
  }

  return compactObject({
    层级:
      translateValue(
        entry?.layer,
      ),
    名称:
      text(
        entry?.name,
      ),
    计算柱位:
      translatePillarKey(
        entry?.basisPillar,
      ),
    计算地支:
      text(
        entry?.basisBranch,
      ),
    命中地支:
      text(
        entry?.hitBranch,
      ),
    计算依据:
      text(
        entry?.rule,
      ),
  });
}

function translateRelationReference(
  entry,
) {
  if (!entry) {
    return null;
  }

  return compactObject({
    关系:
      text(
        entry?.label,
      ),
    状态:
      translateValue(
        entry?.status,
      ),
    参与对象:
      array(
        entry?.participants,
      )
        .map(text)
        .filter(Boolean),
    原局柱位:
      translatePillarKey(
        entry?.natalPillar,
      ),
    施克者:
      text(
        entry?.controller,
      ),
    受克者:
      text(
        entry?.controlled,
      ),
  });
}

function translateNatalInterpretations(
  interpretations,
) {
  if (!interpretations) {
    return null;
  }

  const summaryTexts =
    unique(
      collectChineseTexts([
        interpretations
          ?.natalStructure,
        interpretations
          ?.natalSummary,
      ]),
    ).slice(
      0,
      24,
    );

  const images =
    array(
      interpretations
        ?.natalImages,
    ).map(
      (entry) =>
        compactObject({
          标题:
            text(
              entry?.title,
            ),
          取象:
            text(
              entry?.summary,
            ),
          依据:
            array(
              entry?.evidence,
            )
              .map(text)
              .filter(Boolean),
        }),
    );

  return compactObject({
    原局结构说明:
      summaryTexts,
    原局取象:
      images,
  });
}

function translateHiddenStems(
  values,
) {
  return array(values).map(
    (entry) =>
      compactObject({
        天干:
          text(
            entry?.stem,
          ),
        十神:
          text(
            entry?.tenGod,
          ),
        层次:
          text(
            entry?.role,
          ),
      }),
  );
}

function translateShensha(
  values,
) {
  return array(values).map(
    (entry) =>
      typeof entry ===
      "string"
        ? compactObject({
            名称:
              text(entry),
          })
        : compactObject({
            名称:
              text(
                entry?.name,
              ),
            类别:
              text(
                entry?.category,
              ),
          }),
  );
}

function collectChineseTexts(
  value,
  result = [],
) {
  if (
    result.length >= 60
  ) {
    return result;
  }

  if (
    typeof value ===
    "string"
  ) {
    const normalized =
      value
        .replace(
          /\b[A-Za-z][A-Za-z0-9_]{2,}\b/g,
          "",
        )
        .replace(
          /\s+/g,
          " ",
        )
        .trim();

    if (
      /[\u3400-\u9fff]/.test(
        normalized,
      )
    ) {
      result.push(
        normalized,
      );
    }

    return result;
  }

  if (
    Array.isArray(value)
  ) {
    value.forEach(
      (entry) =>
        collectChineseTexts(
          entry,
          result,
        ),
    );

    return result;
  }

  if (
    value &&
    typeof value ===
      "object"
  ) {
    Object.values(
      value,
    ).forEach(
      (entry) =>
        collectChineseTexts(
          entry,
          result,
        ),
    );
  }

  return result;
}

function translatePillarKey(
  value,
) {
  const map = {
    year: "年柱",
    month: "月柱",
    day: "日柱",
    hour: "时柱",
  };

  return (
    map[
      text(value)
    ] ||
    text(value)
  );
}

function translateValue(
  value,
) {
  const normalized =
    text(value);

  return (
    VALUE_LABELS[
      normalized
    ] ||
    normalized
      .replace(
        /\b[A-Za-z][A-Za-z0-9_]{2,}\b/g,
        "",
      )
      .trim()
  );
}


function deepCompact(
  value,
) {
  if (
    Array.isArray(value)
  ) {
    return value
      .map(
        deepCompact,
      )
      .filter(
        (entry) =>
          !isEmptyValue(
            entry,
          ),
      );
  }

  if (
    value &&
    typeof value ===
      "object"
  ) {
    return Object.fromEntries(
      Object.entries(
        value,
      )
        .map(
          ([
            key,
            entry,
          ]) => [
            key,
            deepCompact(
              entry,
            ),
          ],
        )
        .filter(
          ([, entry]) =>
            !isEmptyValue(
              entry,
            ),
        ),
    );
  }

  return value;
}

function isEmptyValue(
  value,
) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return true;
  }

  if (
    Array.isArray(value)
  ) {
    return value.length === 0;
  }

  if (
    value &&
    typeof value ===
      "object"
  ) {
    return Object.keys(
      value,
    ).length === 0;
  }

  return false;
}

function compactObject(
  value,
) {
  if (
    !value ||
    typeof value !==
      "object"
  ) {
    return value;
  }

  return Object.fromEntries(
    Object.entries(
      value,
    ).filter(
      ([, entry]) => {
        if (
          entry === null ||
          entry === undefined ||
          entry === ""
        ) {
          return false;
        }

        if (
          Array.isArray(entry)
        ) {
          return entry.length > 0;
        }

        if (
          typeof entry ===
            "object"
        ) {
          return Object.keys(
            entry,
          ).length > 0;
        }

        return true;
      },
    ),
  );
}

function numberOrNull(
  value,
) {
  const numeric =
    Number(value);

  return Number.isFinite(
    numeric,
  )
    ? numeric
    : null;
}

function text(
  value,
) {
  return value ===
    undefined ||
    value === null
    ? ""
    : String(
        value,
      ).trim();
}

function unique(
  values,
) {
  return [
    ...new Set(
      array(values)
        .map(text)
        .filter(Boolean),
    ),
  ];
}

function array(
  value,
) {
  return Array.isArray(
    value,
  )
    ? value
    : value ===
          undefined ||
        value === null
      ? []
      : [value];
}
