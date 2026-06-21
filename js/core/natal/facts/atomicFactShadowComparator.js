const validPillarKeys = new Set([
  "year",
  "month",
  "day",
  "hour",
]);

export function projectLegacyStemTenGodSignal(
  fact = {},
) {
  // TODO：
  // 1. 读取 fact.id
  // 2. 只接受：
  //    stem-visible-<pillar>-<tenGod>
  // 3. 提取 pillar 和 tenGod
  // 4. 调用 createStemTenGodSignal
}

export function projectContractStemTenGodSignal(
  fact = {},
) {
  // TODO：
  // 1. category 必须为 pillar
  // 2. predicate 必须为 pillar_stem_ten_god
  // 3. pillar 来自 fact.subject.key
  // 4. tenGod 来自 fact.value
  // 5. value 为“日主”时返回 null
  // 6. 调用 createStemTenGodSignal
}

function createStemTenGodSignal(
  pillar,
  tenGod,
  sourceId,
) {
  // TODO：
  // 1. pillar 必须属于 validPillarKeys
  // 2. tenGod 去除前后空格后不能为空
  // 3. 返回：
  //
  // {
  //   family: "ten_god_position",
  //   signalKey:
  //     `ten_god_position:stem:${pillar}:${tenGod}`,
  //   sourceIds: sourceId ? [sourceId] : [],
  // }
}