import { getTenGod } from "../../bazi/tenGods.js";
import {
  PILLAR_KEYS,
  STORAGE_BRANCH_CONFIG,
} from "../config/specialStateTables.js";

const pillarLabels = {
  year: "年柱",
  month: "月柱",
  day: "日柱",
  hour: "时柱",
};

const openingSignalTypes = new Set([
  "branch_clash",
  "branch_punish",
  "branch_self_punish",
]);

export function buildStorageFeatures({
  pillars,
  relationMatrix,
  dayMaster,
} = {}) {
  const safePillars = pillars ?? {};
  const relations = Array.isArray(relationMatrix?.items)
    ? relationMatrix.items
    : [];

  const byPillar = Object.fromEntries(
    PILLAR_KEYS.map((key) => [
      key,
      buildPillarStorageState({
        key,
        pillar: safePillars[key] ?? {},
        relations,
        dayStem: dayMaster?.stem ?? "",
      }),
    ]),
  );

  const storagePillars = PILLAR_KEYS.filter((key) => byPillar[key].isStorage);
  const openingSignalPillars = storagePillars.filter((key) => byPillar[key].hasOpeningSignal);
  const byElement = {};

  for (const key of storagePillars) {
    const element = byPillar[key].storageElement;
    if (!element) continue;
    if (!byElement[element]) byElement[element] = [];
    byElement[element].push(key);
  }

  return {
    convention: "four-storage-branches-v1",
    byPillar,
    storagePillars,
    count: storagePillars.length,
    branchesPresent: unique(storagePillars.map((key) => byPillar[key].branch)),
    elementsPresent: unique(storagePillars.map((key) => byPillar[key].storageElement)),
    byElement,
    openingSignalPillars,
    warnings: [],
  };
}

function buildPillarStorageState({
  key,
  pillar,
  relations,
  dayStem,
}) {
  const branch = pillar.branch ?? "";
  const config = STORAGE_BRANCH_CONFIG[branch];
  const isStorage = Boolean(config);
  const hiddenStems = sanitizeHiddenStems(pillar.hiddenStems);
  const hiddenTenGods = unique(hiddenStems.map((item) => item.tenGod).filter(Boolean));
  const relatedRelations = relations.filter((relation) =>
    hasParticipant(relation, key, "branch") ||
    hasParticipant(relation, key, "pillar"),
  );
  const relationIds = unique(relatedRelations.map((relation) => relation.id));
  const relationTypes = unique(relatedRelations.map((relation) => relation.relationType));
  const openingRelations = isStorage
    ? relatedRelations.filter((relation) => openingSignalTypes.has(relation.relationType))
    : [];
  const storedTenGod = config
    ? hiddenStems.find((item) => item.stem === config.storedStem)?.tenGod ||
      (dayStem ? getTenGod(dayStem, config.storedStem) : "")
    : "";

  return {
    key,
    label: pillarLabels[key] ?? key,
    branch,
    isStorage,

    storageElement: config?.storageElement ?? "",
    storageElementLabel: config?.storageElementLabel ?? "",
    storageLabel: config?.storageLabel ?? "",
    storedStem: config?.storedStem ?? "",
    storedTenGod,

    hiddenStems,
    hiddenTenGods,

    relationIds,
    relationTypes,
    openingSignalRelationIds: unique(openingRelations.map((relation) => relation.id)),
    openingSignalTypes: unique(openingRelations.map((relation) => relation.relationType)),
    hasOpeningSignal: openingRelations.length > 0,

    // This phase only records structural signals. It does not judge whether a storage is truly opened.
    openState: "unknown",

    evidence: isStorage
      ? [{
          type: "storage_branch",
          position: `${key}.branch`,
          text: `${pillarLabels[key] ?? key}${branch}为${config.storageLabel}结构位`,
        }]
      : [],
    warnings: [],
  };
}

function sanitizeHiddenStems(value) {
  return (Array.isArray(value) ? value : [])
    .map((item) => ({
      stem: String(item?.stem ?? ""),
      tenGod: String(item?.tenGod ?? ""),
      role: String(item?.role ?? item?.qiLevel ?? ""),
    }))
    .filter((item) => item.stem || item.tenGod);
}

function hasParticipant(relation, pillar, position) {
  return (relation?.participants ?? relation?.members ?? []).some((participant) =>
    participant?.pillar === pillar &&
    participant?.position === position,
  );
}

function unique(items = []) {
  return [...new Set(items.filter((item) => item !== undefined && item !== null && item !== ""))];
}
