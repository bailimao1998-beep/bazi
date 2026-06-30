export const NATAL_COMPOSITION_MIGRATION_CATALOG_VERSION =
  "natal-composition-migration-catalog-v1";

const natalCompositionMigrationCatalogItems = [
  {
    legacyRuleId: "branch-main-month-七杀",
    legacySemanticGroup: "branch-main-month-七杀",
    legacyTitle: "月令七杀",
    sourceFiles: [
      "js/domain/natal/atomicNatalFactEngine.js",
      "js/domain/natal/composition/compareNatalCompositionShadow.js",
    ],
    classification: "composition_natal",
    targetRuleId: "month_command_official",
    targetFamilyKey: "month_command_official",
    migrationStatus: "covered",
    reason:
      "月支主气为七杀时属于月令官杀主轴，已由 month_command_official 从 pillar_branch_main_ten_god 重建。",
    aliases: [
      "idPattern:^branch-main-month-(正官|七杀)$",
      "namePattern:^月令(正官|七杀)$",
      "月令七杀",
    ],
  },
  {
    legacyRuleId: "branch-main-month-正官",
    legacySemanticGroup: "branch-main-month-正官",
    legacyTitle: "月令正官",
    sourceFiles: [
      "js/domain/natal/atomicNatalFactEngine.js",
      "js/domain/natal/composition/compareNatalCompositionShadow.js",
    ],
    classification: "composition_natal",
    targetRuleId: "month_command_official",
    targetFamilyKey: "month_command_official",
    migrationStatus: "covered",
    reason:
      "月支主气为正官时属于月令官杀主轴，已由 month_command_official 从 pillar_branch_main_ten_god 重建。",
    aliases: [
      "idPattern:^branch-main-month-(正官|七杀)$",
      "namePattern:^月令(正官|七杀)$",
      "月令正官",
    ],
  },
  {
    legacyRuleId: "branch-main-*",
    legacySemanticGroup: "branch-main-*",
    legacyTitle: "地支主气十神",
    sourceFiles: [
      "js/domain/natal/atomicNatalFactEngine.js",
    ],
    classification: "atomic_fact",
    targetRuleId: "",
    targetFamilyKey: "",
    migrationStatus: "excluded",
    reason:
      "单个地支主气十神属于原子事实，除月令官杀已进入组合族外，不作为高阶取象卡片。",
    aliases: [
      "idPattern:^branch-main-(year|month|day|hour)-.+$",
    ],
  },
  {
    legacyRuleId: "day-master-root-*",
    legacySemanticGroup: "day-master-root",
    legacyTitle: "日主根气",
    sourceFiles: [
      "js/domain/natal/atomicNatalFactEngine.js",
    ],
    classification: "atomic_fact",
    targetRuleId: "",
    targetFamilyKey: "",
    migrationStatus: "excluded",
    reason:
      "日主根气是单项强弱证据，供组合规则复用，不单独进入高阶取象索引。",
    aliases: [
      "idPattern:^day-master-root-.+$",
      "日主根气",
    ],
  },
  {
    legacyRuleId: "day-master-season-*",
    legacySemanticGroup: "day-master-season",
    legacyTitle: "日主得令",
    sourceFiles: [
      "js/domain/natal/atomicNatalFactEngine.js",
    ],
    classification: "atomic_fact",
    targetRuleId: "",
    targetFamilyKey: "",
    migrationStatus: "excluded",
    reason:
      "日主得令是单项强弱证据，供组合规则复用，不单独进入高阶取象索引。",
    aliases: [
      "idPattern:^day-master-season-.+$",
      "日主得令",
    ],
  },
  {
    legacyRuleId: "day_branch_clashed",
    legacySemanticGroup: "day-branch-clashed",
    legacyTitle: "日支受冲",
    sourceFiles: [
      "js/domain/natal/atomicNatalRuleDatabase.js",
    ],
    classification: "composition_natal",
    targetRuleId: "spouse_palace_relation_tension",
    targetFamilyKey: "spouse_palace_relation_tension",
    migrationStatus: "merged",
    reason:
      "日支受冲与日支刑害破同属关系宫张力，已合并到 spouse_palace_relation_tension；冲的事实仍由 relation.has_relation 保留。",
    aliases: [
      "day-branch-clashed",
      "day_branch_clashed",
      "idPattern:^relation-.+day-branch.+branch_clash.+$",
      "namePattern:日支.+冲",
      "日支受冲",
    ],
  },
  {
    legacyRuleId: "day_branch_combined",
    legacySemanticGroup: "day-branch-combined",
    legacyTitle: "日支逢合",
    sourceFiles: [
      "js/domain/natal/atomicNatalRuleDatabase.js",
    ],
    classification: "composition_natal",
    targetRuleId: "day_branch_combined",
    targetFamilyKey: "day_branch_combined",
    migrationStatus: "covered",
    reason:
      "日支合局关系可由 relation.has_relation 的 day branch 参与者与合类 relationType 稳定重建，独立于张力关系。",
    aliases: [
      "day-branch-combined",
      "day_branch_combined",
      "idPattern:^relation-.+day-branch.+(branch_combine|three_harmony|three_meeting|half_harmony|arch_harmony).+$",
      "namePattern:日支.+(合|三合|三会|半合|拱合)",
      "日支逢合",
    ],
  },
  {
    legacyRuleId: "day_branch_punished_harmed_broken",
    legacySemanticGroup: "day-branch-tension",
    legacyTitle: "日支刑害破牵动",
    sourceFiles: [
      "js/domain/natal/atomicNatalRuleDatabase.js",
    ],
    classification: "composition_natal",
    targetRuleId: "spouse_palace_relation_tension",
    targetFamilyKey: "spouse_palace_relation_tension",
    migrationStatus: "merged",
    reason:
      "日支刑害破与日支受冲同属关系宫张力，已合并到 spouse_palace_relation_tension；具体关系类型仍保留在 relation.has_relation。",
    aliases: [
      "day-branch-tension",
      "day_branch_punished_harmed_broken",
      "idPattern:^relation-.+day-branch.+branch_(punish|self_punish|harm|break).+$",
      "namePattern:日支.+(刑|害|破|自刑)",
      "日支刑害破牵动",
    ],
  },
  {
    legacyRuleId: "day_pillar_fuyin",
    legacySemanticGroup: "day-pillar-fuyin",
    legacyTitle: "日柱参与伏吟",
    sourceFiles: [
      "js/domain/natal/atomicNatalRuleDatabase.js",
      "js/domain/natal/atomicNatalFactEngine.js",
    ],
    classification: "composition_natal",
    targetRuleId: "day_pillar_repetition",
    targetFamilyKey: "day_pillar_repetition",
    migrationStatus: "covered",
    reason:
      "旧规则与 repetition-pillar 动态事实都可由 pillar_stem 与 pillar_branch 重建，已由 day_pillar_repetition 覆盖。",
    aliases: [
      "day-pillar-fuyin",
      "day_pillar_fuyin",
      "idPattern:^repetition-pillar-(year|month|hour)-day-.+$",
      "idPattern:^repetition-pillar-day-(year|month|hour)-.+$",
      "namePattern:日柱.+伏吟",
      "日柱参与伏吟",
    ],
  },
  {
    legacyRuleId: "element-*-weak",
    legacySemanticGroup: "element-weak",
    legacyTitle: "五行弱象",
    sourceFiles: [
      "js/domain/natal/atomicNatalFactEngine.js",
    ],
    classification: "atomic_fact",
    targetRuleId: "",
    targetFamilyKey: "",
    migrationStatus: "excluded",
    reason:
      "单个五行偏弱属于原子调候证据，供组合规则复用，不单独进入高阶取象索引。",
    aliases: [
      "idPattern:^element-.+-weak$",
      "五行调候",
    ],
  },
  {
    legacyRuleId: "element-flow-*",
    legacySemanticGroup: "element-flow",
    legacyTitle: "五行流通链",
    sourceFiles: [
      "js/domain/natal/atomicNatalFactEngine.js",
    ],
    classification: "atomic_fact",
    targetRuleId: "",
    targetFamilyKey: "",
    migrationStatus: "excluded",
    reason:
      "五行流通链是候选原子线索，当前不作为主取象卡片；后续可在通关专题规则中复用。",
    aliases: [
      "idPattern:^element-flow-.+$",
      "五行流通链",
    ],
  },
  {
    legacyRuleId: "element-metal-water-present",
    legacySemanticGroup: "element-metal-water-present",
    legacyTitle: "金水同见",
    sourceFiles: [
      "js/domain/natal/atomicNatalFactEngine.js",
    ],
    classification: "atomic_fact",
    targetRuleId: "",
    targetFamilyKey: "",
    migrationStatus: "excluded",
    reason:
      "金水同见只是五行数量事实；金水偏重且火弱的高阶组合已由 metal_water_fire_weak 覆盖。",
    aliases: [
      "element-metal-water-present",
    ],
  },
  {
    legacyRuleId: "element_bias_clear",
    legacySemanticGroup: "element-bias-clear",
    legacyTitle: "五行偏性明显",
    sourceFiles: [
      "js/domain/natal/atomicNatalRuleDatabase.js",
    ],
    classification: "composition_natal",
    targetRuleId: "element_bias_visible",
    targetFamilyKey: "element_bias_visible",
    migrationStatus: "covered",
    reason:
      "五行偏性由 bias_level、dominant_elements、weakest_elements 共同判断，已由 element_bias_visible 覆盖。",
    aliases: [
      "element-bias-clear",
      "element_bias_clear",
      "五行偏性明显",
      "五行偏颇明显",
    ],
  },
  {
    legacyRuleId: "hurting_officer_meets_officer",
    legacySemanticGroup: "hurting-officer-officer",
    legacyTitle: "伤官见官线索",
    sourceFiles: [
      "js/domain/natal/atomicNatalRuleDatabase.js",
    ],
    classification: "composition_natal",
    targetRuleId: "hurting_officer_meets_officer",
    targetFamilyKey: "hurting_officer_meets_officer",
    migrationStatus: "covered",
    reason:
      "伤官与正官单十神 weightedCount 和旧 tenGods.weightedCounts 同标尺，阈值 0.6 可直接迁移。",
    aliases: [
      "hurting-officer-officer",
      "hurting_officer_meets_officer",
      "伤官见官线索",
    ],
  },
  {
    legacyRuleId: "hurting_officer_resource_balance",
    legacySemanticGroup: "hurting-officer-resource",
    legacyTitle: "伤官配印线索",
    sourceFiles: [
      "js/domain/natal/atomicNatalRuleDatabase.js",
    ],
    classification: "composition_natal",
    targetRuleId: "hurting_officer_resource_balance",
    targetFamilyKey: "hurting_officer_resource_balance",
    migrationStatus: "covered",
    reason:
      "伤官 weightedCount 与印星组 weightedCount 均来自十神统计同一口径，阈值 0.6 与 0.7 可直接迁移。",
    aliases: [
      "hurting-officer-resource",
      "hurting_officer_resource_balance",
      "伤官配印线索",
    ],
  },
  {
    legacyRuleId: "metal_water_fire_weak",
    legacySemanticGroup: "metal-water-fire-weak",
    legacyTitle: "金水偏重、火气不足线索",
    sourceFiles: [
      "js/domain/natal/atomicNatalRuleDatabase.js",
    ],
    classification: "composition_natal",
    targetRuleId: "metal_water_fire_weak",
    targetFamilyKey: "metal_water_fire_weak",
    migrationStatus: "covered",
    reason:
      "旧 elements.counts 与新版 element_count 采用同一五行数量口径，金水阈值 1.5、火阈值 0.5 可直接迁移。",
    aliases: [
      "metal-water-fire-weak",
      "metal_water_fire_weak",
      "金水偏重、火气不足线索",
    ],
  },
  {
    legacyRuleId: "month-hit-list-*",
    legacySemanticGroup: "month-layer",
    legacyTitle: "流月取象",
    sourceFiles: [
      "js/domain/transit/monthly",
    ],
    classification: "time_layer",
    targetRuleId: "",
    targetFamilyKey: "",
    migrationStatus: "excluded",
    reason:
      "依赖流月时间层，不属于本次原局组合取象迁移范围。",
    aliases: [
      "monthly",
      "流月",
    ],
  },
  {
    legacyRuleId: "officer-weak-absent",
    legacySemanticGroup: "officer-weak-absent",
    legacyTitle: "官杀弱象",
    sourceFiles: [
      "js/domain/natal/atomicNatalFactEngine.js",
    ],
    classification: "atomic_fact",
    targetRuleId: "",
    targetFamilyKey: "",
    migrationStatus: "excluded",
    reason:
      "十神组弱象是聚合后的原子事实，不作为高阶组合卡片。",
    aliases: [
      "officer-weak-absent",
    ],
  },
  {
    legacyRuleId: "officer_killing_mixed",
    legacySemanticGroup: "officer-killing-mixed",
    legacyTitle: "官杀混杂线索",
    sourceFiles: [
      "js/domain/natal/atomicNatalRuleDatabase.js",
    ],
    classification: "composition_natal",
    targetRuleId: "officer_killing_mixed",
    targetFamilyKey: "officer_killing_mixed",
    migrationStatus: "covered",
    reason:
      "正官与七杀分别使用 contract ten_god_presence.weightedCount，和旧 weightedCounts 同标尺，阈值 0.5 可直接迁移。",
    aliases: [
      "officer-killing-mixed",
      "officer_killing_mixed",
      "官杀混杂线索",
    ],
  },
  {
    legacyRuleId: "officer_resource_chain",
    legacySemanticGroup: "officer-resource-chain",
    legacyTitle: "官印承接",
    sourceFiles: [
      "js/domain/natal/atomicNatalFactEngine.js",
      "js/domain/natal/atomicNatalRuleDatabase.js",
    ],
    classification: "composition_natal",
    targetRuleId: "official_resource_support",
    targetFamilyKey: "official_resource_support",
    migrationStatus: "covered",
    reason:
      "官杀组与印星组阈值经前轮校准为 0.7，并要求结构锚点，已由 official_resource_support 覆盖。",
    aliases: [
      "officer-resource-chain",
      "officer_resource_chain",
      "官印承接",
      "官印相生",
      "杀印承接",
    ],
  },
  {
    legacyRuleId: "output-weak-absent",
    legacySemanticGroup: "output-weak-absent",
    legacyTitle: "食伤弱象",
    sourceFiles: [
      "js/domain/natal/atomicNatalFactEngine.js",
    ],
    classification: "atomic_fact",
    targetRuleId: "",
    targetFamilyKey: "",
    migrationStatus: "excluded",
    reason:
      "食伤弱象是聚合后的原子事实；印重食伤弱等高阶组合已单独迁移。",
    aliases: [
      "output-weak-absent",
    ],
  },
  {
    legacyRuleId: "output_wealth_chain",
    legacySemanticGroup: "output-wealth-chain",
    legacyTitle: "食伤生财线索",
    sourceFiles: [
      "js/domain/natal/atomicNatalRuleDatabase.js",
    ],
    classification: "composition_natal",
    targetRuleId: "output_wealth_chain",
    targetFamilyKey: "output_wealth_chain",
    migrationStatus: "covered",
    reason:
      "食伤组与财星组 weightedCount 和旧 groupCounts 同为十神加权口径，阈值 0.9 与 0.5 可直接迁移。",
    aliases: [
      "output-wealth-chain",
      "output_wealth_chain",
      "食伤生财线索",
    ],
  },
  {
    legacyRuleId: "peer-weak-absent",
    legacySemanticGroup: "peer-weak-absent",
    legacyTitle: "比劫弱象",
    sourceFiles: [
      "js/domain/natal/atomicNatalFactEngine.js",
    ],
    classification: "atomic_fact",
    targetRuleId: "",
    targetFamilyKey: "",
    migrationStatus: "excluded",
    reason:
      "比劫弱象是聚合后的原子事实，不作为高阶组合卡片。",
    aliases: [
      "peer-weak-absent",
    ],
  },
  {
    legacyRuleId: "peer_wealth_tension",
    legacySemanticGroup: "peer-wealth-tension",
    legacyTitle: "比劫牵财",
    sourceFiles: [
      "js/domain/natal/atomicNatalRuleDatabase.js",
    ],
    classification: "composition_natal",
    targetRuleId: "peer_wealth_competition",
    targetFamilyKey: "peer_wealth_competition",
    migrationStatus: "covered",
    reason:
      "旧 peer groupCounts 包含日主自身，新版只统计比肩与劫财；peerMinWeightedCount 已换算为 1。",
    aliases: [
      "peer-wealth-tension",
      "peer_wealth_tension",
      "比劫牵财",
    ],
  },
  {
    legacyRuleId: "relation-*",
    legacySemanticGroup: "relation",
    legacyTitle: "干支关系",
    sourceFiles: [
      "js/domain/natal/atomicNatalFactEngine.js",
    ],
    classification: "atomic_fact",
    targetRuleId: "",
    targetFamilyKey: "",
    migrationStatus: "excluded",
    reason:
      "单条干支关系属于原子关系事实；仅当日支参与并形成特定组合时进入对应高阶规则。",
    aliases: [
      "idPattern:^relation-.+$",
      "干支关系",
    ],
  },
  {
    legacyRuleId: "repetition-branch-*",
    legacySemanticGroup: "repetition-branch",
    legacyTitle: "地支重复",
    sourceFiles: [
      "js/domain/natal/atomicNatalFactEngine.js",
    ],
    classification: "atomic_fact",
    targetRuleId: "",
    targetFamilyKey: "",
    migrationStatus: "excluded",
    reason:
      "单个地支重复是柱位原子事实；只有日柱干支完全重复进入 day_pillar_repetition。",
    aliases: [
      "idPattern:^repetition-branch-.+$",
    ],
  },
  {
    legacyRuleId: "repetition-pillar-*",
    legacySemanticGroup: "repetition-pillar",
    legacyTitle: "整柱重复",
    sourceFiles: [
      "js/domain/natal/atomicNatalFactEngine.js",
    ],
    classification: "atomic_fact",
    targetRuleId: "",
    targetFamilyKey: "",
    migrationStatus: "excluded",
    reason:
      "整柱重复是柱位原子事实；日柱参与的整柱重复已由 day_pillar_repetition 迁移。",
    aliases: [
      "idPattern:^repetition-pillar-.+$",
    ],
  },
  {
    legacyRuleId: "resource-weak-absent",
    legacySemanticGroup: "resource-weak-absent",
    legacyTitle: "印星弱象",
    sourceFiles: [
      "js/domain/natal/atomicNatalFactEngine.js",
    ],
    classification: "atomic_fact",
    targetRuleId: "",
    targetFamilyKey: "",
    migrationStatus: "excluded",
    reason:
      "印星弱象是聚合后的原子事实，不作为高阶组合卡片。",
    aliases: [
      "resource-weak-absent",
    ],
  },
  {
    legacyRuleId: "resource_heavy_output_weak",
    legacySemanticGroup: "resource-heavy-output-weak",
    legacyTitle: "印重食伤弱",
    sourceFiles: [
      "js/domain/natal/atomicNatalRuleDatabase.js",
    ],
    classification: "composition_natal",
    targetRuleId: "resource_heavy_output_weak",
    targetFamilyKey: "resource_heavy_output_weak",
    migrationStatus: "covered",
    reason:
      "印星组与食伤组 weightedCount 采用同一十神加权口径；阈值已按前轮校准保持 resource >= 2 且 output <= 0.7。",
    aliases: [
      "resource-heavy-output-weak",
      "resource_heavy_output_weak",
      "印重食伤弱",
    ],
  },
  {
    legacyRuleId: "shensha-*",
    legacySemanticGroup: "shensha",
    legacyTitle: "神煞辅助",
    sourceFiles: [
      "js/domain/natal/atomicNatalFactEngine.js",
    ],
    classification: "auxiliary",
    targetRuleId: "",
    targetFamilyKey: "",
    migrationStatus: "excluded",
    reason:
      "神煞仅作为辅助提示，不作为新版原局高阶组合取象主卡片。",
    aliases: [
      "idPattern:^shensha-.+$",
      "神煞辅助",
    ],
  },
  {
    legacyRuleId: "stem-visible-*",
    legacySemanticGroup: "stem-visible",
    legacyTitle: "天干十神透出",
    sourceFiles: [
      "js/domain/natal/atomicNatalFactEngine.js",
    ],
    classification: "atomic_fact",
    targetRuleId: "",
    targetFamilyKey: "",
    migrationStatus: "excluded",
    reason:
      "单柱天干十神透出是原子事实，供组合规则复用，不单独进入高阶取象索引。",
    aliases: [
      "idPattern:^stem-visible-.+$",
      "天干十神透出",
    ],
  },
  {
    legacyRuleId: "wealth-weak-absent",
    legacySemanticGroup: "wealth-weak-absent",
    legacyTitle: "财星弱象",
    sourceFiles: [
      "js/domain/natal/atomicNatalFactEngine.js",
    ],
    classification: "atomic_fact",
    targetRuleId: "",
    targetFamilyKey: "",
    migrationStatus: "excluded",
    reason:
      "财星弱象是聚合后的原子事实，不作为高阶组合卡片。",
    aliases: [
      "wealth-weak-absent",
    ],
  },
  {
    legacyRuleId: "wealth_heavy_body_weak",
    legacySemanticGroup: "wealth-heavy-body-weak",
    legacyTitle: "财多身弱线索",
    sourceFiles: [
      "js/domain/natal/atomicNatalRuleDatabase.js",
    ],
    classification: "composition_natal",
    targetRuleId: "wealth_heavy_body_weak",
    targetFamilyKey: "wealth_heavy_body_weak",
    migrationStatus: "covered",
    reason:
      "财星 groupCounts 与 contract wealth weightedCount 同标尺，日主强弱分由 day_master.strength_score 提供，阈值可直接迁移。",
    aliases: [
      "wealth-heavy-body-weak",
      "wealth_heavy_body_weak",
      "财多身弱线索",
    ],
  },
  {
    legacyRuleId: "wealth_officer_resource_chain",
    legacySemanticGroup: "wealth-officer-resource-chain",
    legacyTitle: "财官印承接线索",
    sourceFiles: [
      "js/domain/natal/atomicNatalRuleDatabase.js",
    ],
    classification: "composition_natal",
    targetRuleId: "wealth_official_resource_trace",
    targetFamilyKey: "wealth_official_resource_trace",
    migrationStatus: "covered",
    reason:
      "财、官杀、印星三组阈值经前轮校准为 0.7，已由 wealth_official_resource_trace 覆盖。",
    aliases: [
      "wealth-officer-resource-chain",
      "wealth_officer_resource_chain",
      "财官印承接线索",
    ],
  },
  {
    legacyRuleId: "wealth_officer_resource_trace",
    legacySemanticGroup: "wealth-officer-resource-trace",
    legacyTitle: "年月财官印有承接线索",
    sourceFiles: [
      "js/domain/natal/atomicNatalFactEngine.js",
    ],
    classification: "duplicate_or_deprecated",
    targetRuleId: "wealth_official_resource_trace",
    targetFamilyKey: "wealth_official_resource_trace",
    migrationStatus: "merged",
    reason:
      "旧派生函数里的 trace 已被 atomicNatalRuleDatabase 的 wealth_officer_resource_chain 取代；比较时并入同一新版财官印承接族。",
    aliases: [
      "wealth_officer_resource_trace",
      "年月财官印有承接线索",
    ],
  },
  {
    legacyRuleId: "year-hit-list-*",
    legacySemanticGroup: "annual-layer",
    legacyTitle: "流年取象",
    sourceFiles: [
      "js/domain/transit/yearly",
    ],
    classification: "time_layer",
    targetRuleId: "",
    targetFamilyKey: "",
    migrationStatus: "excluded",
    reason:
      "依赖流年时间层，不属于本次原局组合取象迁移范围。",
    aliases: [
      "annual",
      "流年",
    ],
  },
];

export const natalCompositionMigrationCatalog =
  natalCompositionMigrationCatalogItems
    .slice()
    .sort(compareCatalogItems);

export const natalCompositionFamilyKeys =
  uniqueSortedStrings(
    natalCompositionMigrationCatalog
      .filter((item) =>
        item.classification ===
          "composition_natal" &&
        (
          item.migrationStatus === "covered" ||
          item.migrationStatus === "merged"
        ),
      )
      .map((item) => item.targetFamilyKey),
  );

export const natalCompositionMigrationSummary =
  buildMigrationSummary(
    natalCompositionMigrationCatalog,
  );

export function getNatalCompositionComparableItems() {
  return natalCompositionMigrationCatalog
    .filter((item) =>
      (
        item.classification ===
          "composition_natal" ||
        item.classification ===
          "duplicate_or_deprecated"
      ) &&
      (
        item.migrationStatus === "covered" ||
        item.migrationStatus === "merged"
      ) &&
      item.targetFamilyKey,
    )
    .slice()
    .sort(compareCatalogItems);
}

function buildMigrationSummary(items) {
  const summary = {
    catalogVersion:
      NATAL_COMPOSITION_MIGRATION_CATALOG_VERSION,
    totalCatalogItems: items.length,
    compositionNatalItems: 0,
    coveredCatalogItems: 0,
    mergedCatalogItems: 0,
    excludedCatalogItems: 0,
    blockedCatalogItems: 0,
    unclassifiedCatalogItems: 0,
  };

  for (const item of items) {
    if (item.classification === "composition_natal") {
      summary.compositionNatalItems += 1;
    }

    if (item.migrationStatus === "covered") {
      summary.coveredCatalogItems += 1;
    } else if (item.migrationStatus === "merged") {
      summary.mergedCatalogItems += 1;
    } else if (item.migrationStatus === "excluded") {
      summary.excludedCatalogItems += 1;
    } else if (
      item.migrationStatus ===
      "blocked_missing_contract_fact"
    ) {
      summary.blockedCatalogItems += 1;
    }

    if (!item.classification) {
      summary.unclassifiedCatalogItems += 1;
    }
  }

  return summary;
}

function compareCatalogItems(left, right) {
  return normalizeText(left.legacyRuleId)
    .localeCompare(
      normalizeText(right.legacyRuleId),
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
