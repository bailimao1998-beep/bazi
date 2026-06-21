const validPillarKeys = new Set([
  "year",
  "month",
  "day",
  "hour",
]);

export function projectLegacyStemTenGodSignal(
  fact = {},
) {
  const id =
    typeof fact.id === "string"
      ? fact.id.trim()
      : "";

  const match =
    /^stem-visible-(year|month|day|hour)-(.+)$/.exec(
      id,
    );

  if (!match) {
    return null;
  }

  const [, pillar, tenGod] = match;

  return createStemTenGodSignal(
    pillar,
    tenGod,
    id,
  );
}

export function projectContractStemTenGodSignal(
  fact = {},
) {
  if (
    fact.category !== "pillar" ||
    fact.predicate !==
      "pillar_stem_ten_god"
  ) {
    return null;
  }

  return createStemTenGodSignal(
    fact.subject?.key,
    fact.value,
    fact.id,
  );
}

function createStemTenGodSignal(
  pillar,
  tenGod,
  sourceId,
) {
  const normalizedPillar =
    String(pillar ?? "").trim();

  const normalizedTenGod =
    String(tenGod ?? "").trim();

  if (
    !validPillarKeys.has(
      normalizedPillar,
    ) ||
    !normalizedTenGod ||
    normalizedTenGod === "日主"
  ) {
    return null;
  }

  const normalizedSourceId =
    typeof sourceId === "string"
      ? sourceId.trim()
      : "";

  return {
    family: "ten_god_position",

    signalKey:
      `ten_god_position:stem:${normalizedPillar}:${normalizedTenGod}`,

    sourceIds:
      normalizedSourceId
        ? [normalizedSourceId]
        : [],
  };
}