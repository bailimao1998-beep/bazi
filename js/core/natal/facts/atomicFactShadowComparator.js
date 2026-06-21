const validPillarKeys = new Set([
"year",
"month",
"day",
"hour",
]);

const validPositionTypes = new Set([
"stem",
"branch_main",
]);

const validElementKeys = new Set([
"wood",
"fire",
"earth",
"metal",
"water",
]);

export function compareLegacyAndContractFacts({
legacyFacts = [],
contractFacts = [],
} = {}) {
const warnings = [];

const safeLegacyFacts = Array.isArray(legacyFacts)
? legacyFacts
: [];

const safeContractFacts = Array.isArray(contractFacts)
? contractFacts
: [];

if (!Array.isArray(legacyFacts)) {
warnings.push(
"legacyFacts should be an array",
);
}

if (!Array.isArray(contractFacts)) {
warnings.push(
"contractFacts should be an array",
);
}

const legacyProjection =
buildSignalProjection(
safeLegacyFacts,
projectLegacyFactSignals,
warnings,
"legacy",
);

const contractProjection =
buildSignalProjection(
safeContractFacts,
projectContractFactSignals,
warnings,
"contract",
);

const matched = [];
const missingComparable = [];
const contractOnly = [];

for (
const signal of
legacyProjection.signals.values()
) {
const contractSignal =
contractProjection.signals.get(
signal.signalKey,
);

```
if (contractSignal) {
  matched.push({
    family: signal.family,
    signalKey: signal.signalKey,
    legacyFactIds:
      signal.sourceIds,
    contractFactIds:
      contractSignal.sourceIds,
  });
} else {
  missingComparable.push({
    family: signal.family,
    signalKey: signal.signalKey,
    legacyFactIds:
      signal.sourceIds,
    reason: "no_contract_signal",
  });
}
```

}

for (
const signal of
contractProjection.signals.values()
) {
if (
!legacyProjection.signals.has(
signal.signalKey,
)
) {
contractOnly.push({
family: signal.family,
signalKey: signal.signalKey,
contractFactIds:
signal.sourceIds,
});
}
}

const intentionallyUncompared =
legacyProjection.unprojected.map(
(fact) => ({
legacyFactId:
normalizeText(fact.id),
legacyCategory:
normalizeText(fact.category),
reason:
classifyUncomparedLegacyFact(
fact,
),
}),
);

matched.sort(compareSignalItems);
missingComparable.sort(
compareSignalItems,
);
contractOnly.sort(compareSignalItems);

intentionallyUncompared.sort(
(left, right) =>
left.reason.localeCompare(
right.reason,
) ||
left.legacyFactId.localeCompare(
right.legacyFactId,
),
);

const comparableLegacyCount =
legacyProjection.signals.size;

const matchedLegacyCount =
matched.length;

return {
version:
"atomic-fact-shadow-v1",

mode: "read_only",

comparableLegacyCount,

matchedLegacyCount,

missingComparableCount:
  missingComparable.length,

intentionallyUncomparedCount:
  intentionallyUncompared.length,

coverageRate:
  comparableLegacyCount > 0
    ? matchedLegacyCount /
      comparableLegacyCount
    : 0,

matched,

missingComparable,

intentionallyUncompared,

contractOnly,

warnings:
  [...new Set(warnings)].sort(),

};
}

export function projectLegacyStemTenGodSignal(
fact = {},
) {
const id = normalizeText(fact.id);

const match =
/^stem-visible-(year|month|day|hour)-(.+)$/.exec(
id,
);

if (!match) {
return null;
}

const [, pillar, tenGod] = match;

return createTenGodPositionSignal(
"stem",
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

return createTenGodPositionSignal(
"stem",
fact.subject?.key,
fact.value,
fact.id,
);
}

export function projectLegacyBranchMainTenGodSignal(
fact = {},
) {
const id = normalizeText(fact.id);

const match =
/^branch-main-(year|month|day|hour)-(.+)$/.exec(
id,
);

if (!match) {
return null;
}

const [, pillar, tenGod] = match;

return createTenGodPositionSignal(
"branch_main",
pillar,
tenGod,
id,
);
}

export function projectContractBranchMainTenGodSignal(
fact = {},
) {
if (
fact.category !== "pillar" ||
fact.predicate !==
"pillar_branch_main_ten_god"
) {
return null;
}

return createTenGodPositionSignal(
"branch_main",
fact.subject?.key,
fact.value,
fact.id,
);
}

export function projectLegacyDayMasterSeasonSignal(
fact = {},
) {
const id = normalizeText(fact.id);

if (
!id.startsWith(
"day-master-season-",
)
) {
return null;
}

const text = [
fact.name,
fact.label,
...(Array.isArray(fact.tags)
? fact.tags
: []),
]
.map(normalizeText)
.join("|");

if (text.includes("失令")) {
return createSimpleSignal(
"day_master",
"day_master",
id,
);
}

if (text.includes("得令")) {
return createSimpleSignal(
"day_master",
"day_master",
id,
);
}

return null;
}

export function projectContractDayMasterSeasonSignal(
fact = {},
) {
if (
fact.category !== "day_master" ||
fact.predicate !== "in_season" ||
typeof fact.value !== "boolean"
) {
return null;
}

return createSimpleSignal(
"day_master",
`day_master:in_season:${fact.value}`,
fact.id,
);
}

export function projectLegacyDayMasterRootSignal(
fact = {},
) {
const id = normalizeText(fact.id);

const match =
/^day-master-root-(.+)$/.exec(id);

if (!match) {
return null;
}

const rootLevel =
normalizeText(match[1]);

if (!rootLevel) {
return null;
}

return createSimpleSignal(
"day_master",
`day_master:root_level:${rootLevel}`,
id,
);
}

export function projectContractDayMasterRootSignal(
fact = {},
) {
if (
fact.category !== "day_master" ||
fact.predicate !== "root_level"
) {
return null;
}

const rootLevel =
normalizeText(fact.value);

if (!rootLevel) {
return null;
}

return createSimpleSignal(
"day_master",
`day_master:root_level:${rootLevel}`,
fact.id,
);
}

export function projectLegacyElementWeakSignal(
fact = {},
) {
const id = normalizeText(fact.id);

const match =
/^element-(wood|fire|earth|metal|water)-weak$/.exec(
id,
);

if (!match) {
return null;
}

return createSimpleSignal(
"element",
`element:weak:${match[1]}`,
id,
);
}

export function projectContractElementWeakSignal(
fact = {},
) {
if (
fact.category !== "element" ||
fact.predicate !== "element_count"
) {
return null;
}

const element =
normalizeText(fact.subject?.key);

const count =
parseFiniteNumber(fact.value);

if (
!validElementKeys.has(element) ||
count === null ||
count > 0.5
) {
return null;
}

return createSimpleSignal(
"element",
`element:weak:${element}`,
fact.id,
);
}

function projectLegacyFactSignals(
fact = {},
) {
return compactSignals([
projectLegacyStemTenGodSignal(
fact,
),

```
projectLegacyBranchMainTenGodSignal(
  fact,
),

projectLegacyDayMasterSeasonSignal(
  fact,
),

projectLegacyDayMasterRootSignal(
  fact,
),

projectLegacyElementWeakSignal(
  fact,
),
```

]);
}

function projectContractFactSignals(
fact = {},
) {
return compactSignals([
projectContractStemTenGodSignal(
fact,
),

```
projectContractBranchMainTenGodSignal(
  fact,
),

projectContractDayMasterSeasonSignal(
  fact,
),

projectContractDayMasterRootSignal(
  fact,
),

projectContractElementWeakSignal(
  fact,
),
```

]);
}

function buildSignalProjection(
facts,
projector,
warnings,
sourceLabel,
) {
const signals = new Map();
const unprojected = [];

for (const fact of facts) {
try {
const projected =
projector(fact);

  if (projected.length === 0) {
    unprojected.push(fact);
    continue;
  }

  for (const signal of projected) {
    const current =
      signals.get(
        signal.signalKey,
      );

    if (!current) {
      signals.set(
        signal.signalKey,
        signal,
      );
      continue;
    }

    current.sourceIds =
      uniqueSortedStrings([
        ...current.sourceIds,
        ...signal.sourceIds,
      ]);
  }
} catch (error) {
  warnings.push(
    `${sourceLabel} projection failed: ${
      error?.message ??
      "unknown error"
    }`,
  );

  unprojected.push(fact);
}

}

return {
signals,
unprojected,
};
}

function createTenGodPositionSignal(
positionType,
pillar,
tenGod,
sourceId,
) {
const normalizedPositionType =
normalizeText(positionType);

const normalizedPillar =
normalizeText(pillar);

const normalizedTenGod =
normalizeText(tenGod);

if (
!validPositionTypes.has(
normalizedPositionType,
) ||
!validPillarKeys.has(
normalizedPillar,
) ||
!normalizedTenGod ||
normalizedTenGod === "日主"
) {
return null;
}

return createSimpleSignal(
"ten_god_position",
`ten_god_position:${normalizedPositionType}:${normalizedPillar}:${normalizedTenGod}`,
sourceId,
);
}

function createSimpleSignal(
family,
signalKey,
sourceId,
) {
const normalizedFamily =
normalizeText(family);

const normalizedSignalKey =
normalizeText(signalKey);

if (
!normalizedFamily ||
!normalizedSignalKey
) {
return null;
}

const normalizedSourceId =
normalizeText(sourceId);

return {
family: normalizedFamily,
signalKey:
normalizedSignalKey,
sourceIds:
normalizedSourceId
? [normalizedSourceId]
: [],
};
}

function classifyUncomparedLegacyFact(
fact = {},
) {
const category =
normalizeText(fact.category);

if (category === "神煞辅助") {
return "shensha_not_in_contract_v1";
}

if (
category === "组合结构" ||
fact.factLevel === "pattern"
) {
return "interpretive_rule_waiting_for_composition";
}

return "unsupported_legacy_shape";
}

function compactSignals(items) {
return items.filter(Boolean);
}

function uniqueSortedStrings(items) {
return [
...new Set(
items
.map(normalizeText)
.filter(Boolean),
),
].sort();
}

function compareSignalItems(
left,
right,
) {
return (
left.family.localeCompare(
right.family,
) ||
left.signalKey.localeCompare(
right.signalKey,
)
);
}

function parseFiniteNumber(value) {
if (
value === undefined ||
value === null
) {
return null;
}

if (
typeof value === "string" &&
value.trim() === ""
) {
return null;
}

const parsed = Number(value);

return Number.isFinite(parsed)
? parsed
: null;
}

function normalizeText(value) {
return typeof value === "string"
? value.trim()
: "";
}
