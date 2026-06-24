import test from "node:test";
import assert from "node:assert/strict";

import {
  buildStageAiTrustedPack,
} from "../js/core/ai/buildStageAiTrustedPack.js";

import {
  buildYearAiPrompt,
} from "../js/core/ai/buildYearAiPrompt.js";

import {
  validateStageAiText,
} from "../js/core/ai/stageAiTextValidator.js";

const baseBaziViewModel = {
  birthInfo: {
    gender: "male",
  },
  pillars: [
    {
      key: "year",
      stem: "戊",
      branch: "寅",
      pillar: "戊寅",
      stemTenGod: "正印",
      branchMainTenGod: "正财",
      hiddenStems: [],
      shensha: [],
    },
  ],
  fiveElements: {
    金: 2,
  },
  structureAnalysis: {
    conclusion: "原局结构候选解释",
  },
};

const relationFact = {
  id: "control-1",
  type: "stem_control",
  label: "天干相克",
  status: "direct",
  category: "direct",
  source: "流月触发原局",
  participants: ["戊", "壬"],
  text: "戊克壬。",
  meta: {
    controller: "戊",
    controlled: "壬",
    direction: "target_controls_current",
    formationStatus: "not_applicable",
  },
};

function buildPack() {
  return buildStageAiTrustedPack({
    stage: "year",
    item: {
      year: 2026,
      ganZhi: "丙午",
      transitStructure: {
        facts: [relationFact],
      },
      triggerImages: {
        threads: [
          {
            id: "image-1",
            label: "候选取象",
            domain: "career",
            domainLabel: "事业与工作",
            themeRank: 1,
            narrativePriority: "high",
            strength: 99,
            summary: "可能表现为任务变化。",
            evidenceRefs: ["control-1"],
          },
        ],
      },
    },
    currentLuckItem: {
      ganZhi: "癸亥",
    },
    yearItem: {
      year: 2026,
      ganZhi: "丙午",
    },
    baseBaziViewModel,
    natalImageReport: {
      summary: "原局候选总结",
      imageCards: [
        {
          id: "natal-1",
          title: "原局取象",
          summary: "候选场景",
          evidence: ["原局证据"],
        },
      ],
    },
  });
}

test("可信包不再包含十二领域与故事主线", () => {
  const pack = buildPack();

  assert.equal("domainEvidenceCandidates" in pack, false);
  assert.equal("storyPack" in pack, false);
  assert.equal("themeHierarchy" in pack, false);

  assert.ok(pack.factualContext);
  assert.ok(pack.relationFacts);
  assert.ok(pack.candidateInterpretations);
});

test("关系事实保留方向与成立状态", () => {
  const fact = buildPack().relationFacts[0];

  assert.equal(fact.meta.controller, "戊");
  assert.equal(fact.meta.controlled, "壬");
  assert.equal(
    fact.meta.direction,
    "target_controls_current",
  );
  assert.equal(
    fact.meta.formationStatus,
    "not_applicable",
  );
});

test("候选取象不再携带领域和本地权重", () => {
  const image =
    buildPack().candidateInterpretations.stageImages[0];

  assert.equal("domain" in image, false);
  assert.equal("domainLabel" in image, false);
  assert.equal("themeRank" in image, false);
  assert.equal("narrativePriority" in image, false);
  assert.equal("strength" in image, false);
});

test("Prompt不要求十二领域填表", () => {
  const prompt = buildYearAiPrompt({
    baseBaziViewModel,
    natalImageReport: {},
    luckImageReport: {
      luckItems: [
        {
          isCurrent: true,
          ganZhi: "癸亥",
        },
      ],
    },
    yearImageReport: {
      yearItem: {
        year: 2026,
        ganZhi: "丙午",
        transitStructure: {
          facts: [relationFact],
        },
        triggerImages: {
          threads: [],
        },
      },
    },
  });

  assert.doesNotMatch(prompt.system, /十二领域/);
  assert.doesNotMatch(prompt.system, /当前不突出/);
  assert.match(
    prompt.system,
    /证据弱的内容可以完全不写/,
  );
  assert.match(prompt.system, /relationFacts/);
});

test("普通自由报告无需固定领域和标题", () => {
  const validation = validateStageAiText({
    text:
      "这一年最明显的是规则压力和计划调整，其他内容证据较弱。",
    stage: "year",
    trustedPack: buildPack(),
  });

  assert.equal(validation.valid, true);
});

test("校验器拦截生克写反", () => {
  const validation = validateStageAiText({
    text: "壬水克制戊土，事情因此反复。",
    stage: "month",
    trustedPack: buildPack(),
  });

  assert.equal(validation.valid, false);
  assert.ok(
    validation.hardViolations.includes(
      "reversed_control:壬->戊",
    ),
  );
});

test("校验器拦截无依据财库和喜用", () => {
  const validation = validateStageAiText({
    text: "亥中甲木是财库，食伤出水为用。",
    stage: "luck",
    trustedPack: buildPack(),
  });

  assert.equal(validation.valid, false);
  assert.ok(
    validation.hardViolations.includes(
      "unsupported_treasury_claim",
    ),
  );
  assert.ok(
    validation.hardViolations.includes(
      "unsupported_use_god_claim",
    ),
  );
});

test("流年禁止自行加入年内应期", () => {
  const validation = validateStageAiText({
    text: "年中出现转折，下半年逐渐稳定。",
    stage: "year",
    trustedPack: buildPack(),
  });

  assert.equal(validation.valid, false);
  assert.ok(
    validation.hardViolations.some((entry) =>
      entry.startsWith("unsupported_year_timing:"),
    ),
  );
});
