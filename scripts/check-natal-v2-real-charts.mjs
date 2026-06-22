import assert from "node:assert/strict";

import {
  calculateBazi,
} from "../js/core/bazi/calculateBazi.js";

import {
  buildBaseBaziViewModel,
} from "../js/core/bazi/buildBaseBaziViewModel.js";

import {
  buildNatalImageReport,
} from "../js/core/blind-bazi/buildNatalImageReport.js";

import {
  compareProfessionalEvidenceImages,
  isSupportedProfessionalImage,
} from "../js/core/natal/professional/domainProfessionalAggregation.js";

const expectedDomainKeys = [
  "self",
  "parents",
  "siblings",
  "spouse",
  "children",
  "wealth",
  "health",
  "movement",
  "friends",
  "career",
  "property",
  "fortune",
];

const realChartCases = [
  {
    id:
      "reference-strong-metal",

    label:
      "基准命盘：辛金酉月",

    input: {
      name:
        "基准命盘",

      birthDate:
        "1998-09-11",

      birthTime:
        "00:30",

      birthProvince:
        "河北省",

      birthplace:
        "定州",

      gender:
        "male",

      trueSolarTime:
        false,

      targetYear:
        2026,

      selectedMonth:
        1,
    },

    expectedPillars: [
      "戊寅",
      "辛酉",
      "辛酉",
      "戊子",
    ],
  },

  {
    id:
      "female-winter-chart",

    label:
      "冬季女命",

    input: {
      name:
        "冬季女命",

      birthDate:
        "2003-01-11",

      birthTime:
        "10:50",

      birthProvince:
        "天津市",

      birthplace:
        "天津",

      gender:
        "female",

      trueSolarTime:
        false,

      targetYear:
        2026,

      selectedMonth:
        1,
    },
  },

  {
    id:
      "female-early-morning",

    label:
      "秋季卯时女命",

    input: {
      name:
        "秋季卯时女命",

      birthDate:
        "2009-09-26",

      birthTime:
        "05:30",

      birthProvince:
        "北京市",

      birthplace:
        "北京",

      gender:
        "female",

      trueSolarTime:
        false,

      targetYear:
        2026,

      selectedMonth:
        1,
    },
  },

  {
    id:
      "male-summer-chart",

    label:
      "夏季未时男命",

    input: {
      name:
        "夏季未时男命",

      birthDate:
        "1988-05-18",

      birthTime:
        "14:20",

      birthProvince:
        "广东省",

      birthplace:
        "广州",

      gender:
        "male",

      trueSolarTime:
        false,

      targetYear:
        2026,

      selectedMonth:
        1,
    },
  },

  {
    id:
      "female-winter-morning",

    label:
      "冬季巳时女命",

    input: {
      name:
        "冬季巳时女命",

      birthDate:
        "1993-01-06",

      birthTime:
        "09:30",

      birthProvince:
        "北京市",

      birthplace:
        "北京",

      gender:
        "female",

      trueSolarTime:
        false,

      targetYear:
        2026,

      selectedMonth:
        1,
    },
  },

  {
    id:
      "late-zi-rollover",

    label:
      "晚子时换日测试",

    input: {
      name:
        "晚子时测试",

      birthDate:
        "1976-12-02",

      birthTime:
        "23:30",

      birthProvince:
        "四川省",

      birthplace:
        "成都",

      gender:
        "male",

      trueSolarTime:
        false,

      targetYear:
        2026,

      selectedMonth:
        1,
    },
  },

  {
    id:
      "true-solar-west",

    label:
      "乌鲁木齐真太阳时测试",

    input: {
      name:
        "真太阳时测试",

      birthDate:
        "1990-07-15",

      birthTime:
        "00:20",

      birthProvince:
        "新疆维吾尔自治区",

      birthplace:
        "乌鲁木齐",

      gender:
        "female",

      trueSolarTime:
        true,

      targetYear:
        2026,

      selectedMonth:
        1,
    },
  },
];

const results = [];

for (
  const chartCase of
  realChartCases
) {
  runRealChartCase(
    chartCase,
  );
}

printReport();

function runRealChartCase(
  chartCase,
) {
  try {
    const chart =
      calculateBazi(
        chartCase.input,
      );

    const baseBaziViewModel =
      buildBaseBaziViewModel(
        chart,
      );

    const report =
      buildNatalImageReport({
        chart,
        baseBaziViewModel,
      });

    validateChart({
      chartCase,
      chart,
    });

    validateReport({
      chartCase,
      chart,
      report,
    });

    results.push({
      id:
        chartCase.id,

      label:
        chartCase.label,

      passed:
        true,

      snapshot:
        createSnapshot({
          chart,
          report,
        }),
    });
  } catch (error) {
    results.push({
      id:
        chartCase.id,

      label:
        chartCase.label,

      passed:
        false,

      error:
        error?.stack ||
        error?.message ||
        String(error),
    });
  }
}

function validateChart({
  chartCase,
  chart,
}) {
  assert.ok(
    chart,
    `${chartCase.label}没有生成chart`,
  );

  const pillarLabels =
    getPillarLabels(
      chart,
    );

  assert.equal(
    pillarLabels.length,
    4,
    `${chartCase.label}四柱数量错误`,
  );

  for (
    const pillarLabel of
    pillarLabels
  ) {
    assert.match(
      pillarLabel,
      /^[甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥]$/,
      `${chartCase.label}存在无效干支：${pillarLabel}`,
    );
  }

  assert.ok(
    chart.dayMaster?.stem,
    `${chartCase.label}缺少日主`,
  );

  assert.ok(
    chart.structureAnalysis,
    `${chartCase.label}缺少结构分析`,
  );

  if (
    Array.isArray(
      chartCase.expectedPillars,
    )
  ) {
    assert.deepEqual(
      pillarLabels,
      chartCase.expectedPillars,
      `${chartCase.label}四柱与基准不一致`,
    );
  }

  if (
    chartCase.id ===
    "late-zi-rollover"
  ) {
    assert.equal(
      chart.calendar
        ?.dayPillarRule,
      "23:00-23:59按次日计算日柱（晚子时换日）",
    );
  }

  if (
    chartCase.id ===
    "true-solar-west"
  ) {
    assert.equal(
      chart.calendar
        ?.trueSolarTime
        ?.enabled,
      true,
      "真太阳时测试没有启用校正",
    );
  }
}

function validateReport({
  chartCase,
  chart,
  report,
}) {
  assert.ok(
    report,
    `${chartCase.label}没有生成原局报告`,
  );

  assert.equal(
    report.engineVersion,
    "natal-v2",
    `${chartCase.label}没有进入原局V2`,
  );

  const domains =
    Array.isArray(
      report.twelveDomains,
    )
      ? report.twelveDomains
      : [];

  assert.equal(
    domains.length,
    12,
    `${chartCase.label}十二领域数量错误`,
  );

  const domainKeys =
    domains.map(
      (domain) =>
        domain.key,
    );

  assert.equal(
    new Set(
      domainKeys,
    ).size,
    12,
    `${chartCase.label}领域出现重复`,
  );

  assert.deepEqual(
    [...domainKeys].sort(),
    [...expectedDomainKeys].sort(),
    `${chartCase.label}领域键不完整`,
  );

  for (
    const domain of
    domains
  ) {
    validateDomain({
      chartCase,
      domain,
    });
  }

  const images =
    Array.isArray(
      report.mergedComposition
        ?.images,
    )
      ? report
          .mergedComposition
          .images
      : [];

  validateCompositionImages({
    chartCase,
    images,
  });

  validateMasterSummary({
    chartCase,
    report,
    images,
  });

  assert.ok(
    report.natalAiEvidencePack,
    `${chartCase.label}缺少AI证据包`,
  );

  assert.ok(
    report.structureSynopsis,
    `${chartCase.label}缺少结构摘要`,
  );

  assert.equal(
    chart.pillars.day.stem,
    report.featureVector
      ?.dayMaster
      ?.stem,
    `${chartCase.label}排盘日主与特征向量不一致`,
  );
}

function validateDomain({
  chartCase,
  domain,
}) {
  assert.ok(
    domain.key,
    `${chartCase.label}存在无key领域`,
  );

  assert.ok(
    [
      "high",
      "medium",
      "low",
    ].includes(
      domain.confidence,
    ),
    `${chartCase.label}/${domain.key}置信度无效`,
  );

  assert.ok(
    [
      "high",
      "medium",
      "low",
      "none",
    ].includes(
      domain
        .professionalEvidenceLevel,
    ),
    `${chartCase.label}/${domain.key}专业证据等级无效`,
  );

  assert.ok(
    typeof domain.summary ===
      "string",
    `${chartCase.label}/${domain.key}缺少summary`,
  );

  assert.ok(
    typeof domain.manifestation ===
      "string",
    `${chartCase.label}/${domain.key}缺少manifestation`,
  );

  if (
    domain
      .professionalEvidenceLevel ===
    "none"
  ) {
    assert.equal(
      domain
        .primaryProfessionalImage,
      null,
      `${chartCase.label}/${domain.key}没有专业证据却存在主专业象`,
    );
  }

  if (
    domain
      .professionalEvidenceLevel ===
    "high"
  ) {
    assert.equal(
      domain.confidence,
      "high",
      `${chartCase.label}/${domain.key}高专业证据没有对应高置信`,
    );
  }

  if (
    domain
      .primaryProfessionalImage
  ) {
    assert.ok(
      domain
        .primaryProfessionalImage
        .ruleId,
      `${chartCase.label}/${domain.key}主专业象缺少ruleId`,
    );
  }

  assert.equal(
    new Set(
      domain
        .decisiveProfessionalImageIds ??
      [],
    ).size,
    (
      domain
        .decisiveProfessionalImageIds ??
      []
    ).length,
    `${chartCase.label}/${domain.key}关键专业象重复`,
  );
}

function validateCompositionImages({
  chartCase,
  images,
}) {
  const semanticKeys =
    images
      .map(
        (image) =>
          image.semanticGroup ||
          image.ruleId ||
          image.id,
      )
      .filter(Boolean);

  assert.equal(
    new Set(
      semanticKeys,
    ).size,
    semanticKeys.length,
    `${chartCase.label}合并专业象存在重复semanticGroup`,
  );

  for (
    const image of
    images
  ) {
    assert.ok(
      image.id,
      `${chartCase.label}存在无id专业象`,
    );

    assert.ok(
      image.ruleId,
      `${chartCase.label}存在无ruleId专业象`,
    );

    assert.ok(
      [
        "confirmed",
        "derived",
        "structurally_supported",
        "conditional",
        "candidate",
        "weak",
        "unknown",
      ].includes(
        image.status,
      ),
      `${chartCase.label}/${image.ruleId}状态无效：${image.status}`,
    );

    const hasContradictoryTitle =
      image.status ===
        "conditional" &&
      /做功链/.test(
        image.title ?? "",
      ) &&
      !/结构降级|缓解|候选|待确认/.test(
        image.title ?? "",
      );

    assert.equal(
      hasContradictoryTitle,
      false,
      `${chartCase.label}/${image.ruleId}标题仍称做功链，但状态已经是conditional`,
    );
  }
}

function validateMasterSummary({
  chartCase,
  report,
  images,
}) {
  const summary =
    report.masterSummary;

  assert.ok(
    summary,
    `${chartCase.label}缺少命理总批`,
  );

  assert.ok(
    summary.opening ||
    summary.paragraph,
    `${chartCase.label}总批缺少开篇`,
  );

  assert.ok(
    summary.conclusion,
    `${chartCase.label}总批缺少结论`,
  );

  assert.ok(
    Array.isArray(
      summary.sections,
    ),
    `${chartCase.label}总批sections无效`,
  );

  assert.ok(
    summary.sections.length > 0,
    `${chartCase.label}总批没有章节`,
  );

  const supportedImages =
    images
      .filter(
        isSupportedProfessionalImage,
      )
      .slice()
      .sort(
        compareProfessionalEvidenceImages,
      );

  const expectedPrimary =
    supportedImages[0] ??
    images
      .slice()
      .sort(
        compareProfessionalEvidenceImages,
      )[0] ??
    null;

  const actualPrimaryRuleId =
    summary
      .selectionDebug
      ?.primaryRuleId ??
    "";

  if (expectedPrimary) {
    assert.equal(
      actualPrimaryRuleId,
      expectedPrimary.ruleId,
      `${chartCase.label}总批主象没有选择当前最强证据结构`,
    );
  }
}

function createSnapshot({
  chart,
  report,
}) {
  const images =
    report.mergedComposition
      ?.images ??
    [];

  const primaryRuleId =
    report.masterSummary
      ?.selectionDebug
      ?.primaryRuleId ??
    "";

  const primaryImage =
    images.find(
      (image) =>
        image.ruleId ===
        primaryRuleId,
    ) ??
    images[0] ??
    null;

  const selectedDomains = [
    "career",
    "wealth",
    "spouse",
    "self",
  ].map(
    (key) => {
      const domain =
        report.twelveDomains
          .find(
            (item) =>
              item.key === key,
          );

      return {
        key,

        confidence:
          domain?.confidence ??
          "",

        evidenceLevel:
          domain
            ?.professionalEvidenceLevel ??
          "",

        primaryRuleId:
          domain
            ?.primaryProfessionalImage
            ?.ruleId ??
          "",
      };
    },
  );

  return {
    pillars:
      getPillarLabels(
        chart,
      ).join(" "),

    dayMaster:
      chart.dayMaster
        ?.label ??
      "",

    strength:
      report
        .structureSynopsis
        ?.dayMaster
        ?.strengthState ??
      report
        .featureVector
        ?.dayMaster
        ?.strengthLevel ??
      "",

    primaryImage: {
      ruleId:
        primaryImage
          ?.ruleId ??
        "",

      title:
        primaryImage
          ?.title ??
        "",

      role:
        primaryImage
          ?.role ??
        "",

      status:
        primaryImage
          ?.status ??
        "",

      workStatus:
        primaryImage
          ?.workStatus ??
        "",
    },

    topImages:
      images
        .slice()
        .sort(
          compareProfessionalEvidenceImages,
        )
        .slice(0, 4)
        .map(
          (image) => ({
            ruleId:
              image.ruleId,

            title:
              image.title,

            role:
              image.role,

            status:
              image.status,

            workStatus:
              image.workStatus,
          }),
        ),

    suppressedCount:
      report
        .professionalPatterns
        ?.suppressedPatterns
        ?.length ??
      0,

    domains:
      selectedDomains,

    opening:
      report.masterSummary
        ?.opening ??
      "",

    conclusion:
      report.masterSummary
        ?.conclusion ??
      "",
  };
}

function getPillarLabels(
  chart,
) {
  return [
    chart.pillars?.year,
    chart.pillars?.month,
    chart.pillars?.day,
    chart.pillars?.hour,
  ]
    .map(
      (pillar) =>
        pillar?.label ||
        `${pillar?.stem ?? ""}${pillar?.branch ?? ""}`,
    )
    .filter(Boolean);
}

function printReport() {
  const passed =
    results.filter(
      (result) =>
        result.passed,
    );

  const failed =
    results.filter(
      (result) =>
        !result.passed,
    );

  console.log(
    "\n=== Natal V2 Real Chart Regression ===\n",
  );

  for (
    const result of
    results
  ) {
    console.log(
      result.passed
        ? `✅ ${result.label}`
        : `❌ ${result.label}`,
    );

    if (
      result.passed
    ) {
      console.log(
        JSON.stringify(
          result.snapshot,
          null,
          2,
        ),
      );
    } else {
      console.log(
        result.error,
      );
    }

    console.log(
      "----------------------------------------",
    );
  }

  console.log(
    `\n通过：${passed.length}`,
  );

  console.log(
    `失败：${failed.length}`,
  );

  if (
    failed.length
  ) {
    process.exitCode = 1;
  } else {
    console.log(
      "\n真实命盘完整链路回归全部通过。",
    );
  }
}