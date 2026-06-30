import test from "node:test";
import assert from "node:assert/strict";

import { buildKinshipFeatures } from "../../js/domain/natal/featureBuilders/buildKinshipFeatures.js";
import { buildPalaceFeatures } from "../../js/domain/natal/featureBuilders/buildPalaceFeatures.js";
import { buildRelationMatrix } from "../../js/domain/natal/featureBuilders/buildRelationMatrix.js";
import { buildTenGodStates } from "../../js/domain/natal/featureBuilders/buildTenGodStates.js";
import {
  DEFAULT_KINSHIP_MAPPING,
  KINSHIP_MAPPING_VERSION,
  resolveKinshipMapping,
} from "../../js/domain/natal/config/kinshipMapping.js";

const pillars = {
  year: {
    key: "year",
    label: "甲子",
    stem: "甲",
    branch: "子",
    stemTenGod: "偏财",
    branchMainTenGod: "正印",
    hiddenStems: [{ stem: "癸", tenGod: "正印", role: "主气" }],
  },
  month: {
    key: "month",
    label: "乙午",
    stem: "乙",
    branch: "午",
    stemTenGod: "正财",
    branchMainTenGod: "劫财",
    hiddenStems: [{ stem: "丁", tenGod: "劫财", role: "主气" }],
  },
  day: {
    key: "day",
    label: "庚子",
    stem: "庚",
    branch: "子",
    stemTenGod: "日主",
    branchMainTenGod: "伤官",
    hiddenStems: [{ stem: "癸", tenGod: "伤官", role: "主气" }],
  },
  hour: {
    key: "hour",
    label: "辛酉",
    stem: "辛",
    branch: "酉",
    stemTenGod: "正官",
    branchMainTenGod: "七杀",
    hiddenStems: [{ stem: "辛", tenGod: "七杀", role: "主气" }],
  },
};

function buildFeatureInput(gender) {
  const relationMatrix = buildRelationMatrix({
    pillars,
    relations: [
      {
        type: "天干五合",
        members: ["甲", "乙"],
        pillars: ["年柱", "月柱"],
        ganzhi: ["甲子", "乙午"],
      },
      {
        type: "地支六冲",
        members: ["午", "子"],
        pillars: ["月柱", "日柱"],
        ganzhi: ["乙午", "庚子"],
      },
    ],
  });
  const tenGodStates = buildTenGodStates({
    pillars,
    tenGods: {},
    relationMatrix,
  });
  const palaceFeatures = buildPalaceFeatures({
    pillars,
    relationMatrix,
    tenGodStates,
  });

  return {
    gender,
    tenGodStates,
    palaceFeatures,
    relationMatrix,
  };
}

test("default mapping resolves male and female kinship ten gods explicitly", () => {
  const male = resolveKinshipMapping("male");
  const female = resolveKinshipMapping("female");

  assert.equal(DEFAULT_KINSHIP_MAPPING.id, "traditional-default-v1");
  assert.equal(male.version, KINSHIP_MAPPING_VERSION);
  assert.deepEqual(male.roles.spouse.primaryTenGods, ["正财"]);
  assert.deepEqual(male.roles.spouse.secondaryTenGods, ["偏财"]);
  assert.deepEqual(male.roles.children.primaryTenGods, ["正官", "七杀"]);
  assert.deepEqual(female.roles.spouse.primaryTenGods, ["正官"]);
  assert.deepEqual(female.roles.spouse.secondaryTenGods, ["七杀"]);
  assert.deepEqual(female.roles.children.primaryTenGods, ["食神", "伤官"]);
});

test("unknown gender keeps common mappings and does not default to male spouse or children", () => {
  const features = buildKinshipFeatures(buildFeatureInput("unknown"));

  assert.equal(features.gender, "unknown");
  assert.equal(features.spouse.mappingStatus, "gender_required");
  assert.equal(features.children.mappingStatus, "gender_required");
  assert.deepEqual(features.spouse.primaryTenGods, []);
  assert.ok(features.spouse.candidateMappings.some((item) => item.gender === "male"));
  assert.ok(features.spouse.candidateMappings.some((item) => item.gender === "female"));
  assert.ok(features.warnings.some((item) => /gender is required/.test(item)));
});

test("male kinship features separate spouse star profile from spouse palace profile", () => {
  const features = buildKinshipFeatures(buildFeatureInput("male"));

  assert.equal(features.mappingVersion, "kinship-mapping-v1");
  assert.equal(features.mappingId, "traditional-default-v1");
  assert.equal(features.gender, "male");
  assert.deepEqual(features.father.primaryTenGods, ["偏财"]);
  assert.deepEqual(features.father.secondaryTenGods, ["正财"]);
  assert.deepEqual(features.mother.primaryTenGods, ["正印"]);
  assert.deepEqual(features.mother.secondaryTenGods, ["偏印"]);
  assert.deepEqual(features.siblings.primaryTenGods, ["比肩", "劫财"]);
  assert.deepEqual(features.father.palaceRefs, ["year", "month"]);
  assert.deepEqual(features.siblings.palaceRefs, ["month"]);

  assert.deepEqual(features.spouse.primaryTenGods, ["正财"]);
  assert.deepEqual(features.spouse.secondaryTenGods, ["偏财"]);
  assert.deepEqual(features.spouse.palaceRefs, ["spousePalace"]);
  assert.ok(features.spouse.starProfile.tenGods.includes("正财"));
  assert.deepEqual(features.spouse.starProfile.primary.tenGods, ["正财"]);
  assert.deepEqual(features.spouse.starProfile.secondary.tenGods, ["偏财"]);
  assert.equal(features.spouse.starProfile.weightedByTenGod.正财, 1);
  assert.equal(features.spouse.starProfile.weightedByTenGod.偏财, 1);
  assert.ok(features.spouse.starProfile.primary.visiblePositions.includes("month.stem"));
  assert.ok(features.spouse.starProfile.secondary.visiblePositions.includes("year.stem"));
  assert.ok(features.spouse.starProfile.visiblePositions.includes("month.stem"));
  assert.ok(features.spouse.palaceProfile.refs.includes("spousePalace"));
  assert.ok(features.spouse.palaceProfile.relationTypes.includes("branch_clash"));
  assert.notDeepEqual(features.spouse.starProfile.relationIds, features.spouse.palaceProfile.relationIds);
  assert.equal("relatedRelations" in features.spouse.starProfile.states[0], false);
  assert.equal("raw" in features.spouse.starProfile.states[0], false);
});

test("female kinship features use officer star for spouse and output stars for children", () => {
  const features = buildKinshipFeatures(buildFeatureInput("female"));

  assert.deepEqual(features.spouse.primaryTenGods, ["正官"]);
  assert.deepEqual(features.spouse.secondaryTenGods, ["七杀"]);
  assert.deepEqual(features.children.primaryTenGods, ["食神", "伤官"]);
  assert.deepEqual(features.spouse.starProfile.primary.tenGods, ["正官"]);
  assert.deepEqual(features.spouse.starProfile.secondary.tenGods, ["七杀"]);
  assert.equal(features.spouse.starProfile.weightedByTenGod.正官, 1);
  assert.equal(features.spouse.starProfile.weightedByTenGod.七杀, 0.7);
  assert.ok(features.spouse.starProfile.tenGods.includes("正官"));
  assert.ok(features.spouse.starProfile.visiblePositions.includes("hour.stem"));
});

test("parent palace profile keeps exact relation types from palace features", () => {
  const features = buildKinshipFeatures(buildFeatureInput("male"));

  assert.ok(features.father.palaceProfile.refs.includes("year"));
  assert.ok(features.father.palaceProfile.refs.includes("month"));
  assert.ok(features.father.palaceProfile.relationTypes.includes("stem_combine"));
  assert.ok(features.father.palaceProfile.relationTypes.includes("branch_clash"));
  assert.equal(features.father.palaceProfile.relationTypes.includes("combine"), false);
});

test("unknown gender creates candidate star profiles without selecting a side", () => {
  const features = buildKinshipFeatures(buildFeatureInput("unknown"));

  assert.equal(features.spouse.mappingStatus, "gender_required");
  assert.deepEqual(features.spouse.starProfile.tenGods, []);
  assert.equal(features.spouse.starProfile.weightedCount, 0);
  assert.equal(features.spouse.candidateStarProfiles.length, 2);
  assert.deepEqual(
    features.spouse.candidateStarProfiles.map((item) => item.gender).sort(),
    ["female", "male"],
  );

  const male = features.spouse.candidateStarProfiles.find((item) => item.gender === "male");
  const female = features.spouse.candidateStarProfiles.find((item) => item.gender === "female");
  assert.deepEqual(male.primaryTenGods, ["正财"]);
  assert.deepEqual(female.primaryTenGods, ["正官"]);
  assert.ok(male.starProfile.primary.visiblePositions.includes("month.stem"));
  assert.ok(female.starProfile.primary.visiblePositions.includes("hour.stem"));
});
