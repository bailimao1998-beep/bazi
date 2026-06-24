import test from "node:test";
import assert from "node:assert/strict";

import { buildStageAiTrustedPack } from "../js/core/ai/buildStageAiTrustedPack.js";
import { buildYearAiPrompt } from "../js/core/ai/buildYearAiPrompt.js";
import {
  STAGE_AI_DOMAIN_LABELS,
  validateStageAiText,
} from "../js/core/ai/stageAiTextValidator.js";

const domainSignals = {
  checkedDomainCount: 12,
  primaryDomains: [
    { domain: "career", label: "事业与工作", score: 100 },
  ],
  domains: [
    {
      domain: "career",
      label: "事业与工作",
      score: 100,
      role: "primary",
      level: "strong",
      directFacts: [
        {
          id: "year:career:1",
          type: "ten_god",
          source: "流年天干",
          status: "direct",
          polarity: "mixed",
          strength: 4,
          text: "流年天干正官进入规则、责任和考核主题。",
        },
      ],
      evidenceIds: ["year:career:1"],
    },
    ...[
      ["learning", "学业与资格"],
      ["wealth", "财富与资源"],
      ["relationship", "感情与婚姻"],
      ["family", "家庭与父母"],
      ["siblings", "兄弟朋友"],
      ["children", "子女与成果"],
      ["health", "身心与健康"],
      ["migration", "迁移与出行"],
      ["housing", "住房与资产"],
      ["cooperation", "合作与人际"],
      ["mental", "精神状态"],
    ].map(([domain, label]) => ({
      domain,
      label,
      score: 0,
      role: "quiet",
      evidenceIds: [],
    })),
  ],
};

test("trustedPack只传候选证据，不传前端领域分数和主次", () => {
  const pack = buildStageAiTrustedPack({
    stage: "year",
    item: {
      year: 2026,
      ganZhi: "丙午",
      domainSignals,
      transitStructure: { facts: [] },
      triggerImages: { storyPack: {} },
    },
    baseBaziViewModel: {
      birthInfo: { gender: "male" },
      pillars: [],
    },
  });

  assert.ok(pack.domainEvidenceCandidates);
  assert.equal("domainCoverage" in pack, false);
  assert.equal("primaryDomains" in pack.domainEvidenceCandidates, false);

  const career = pack.domainEvidenceCandidates.domains[0];
  assert.equal("score" in career, false);
  assert.equal("role" in career, false);
  assert.equal(career.evidenceStatus, "has_candidates");
  assert.deepEqual(career.evidenceIds, ["year:career:1"]);
});

test("岁运AI校验要求十二领域全部出现", () => {
  const fullText = [
    "### 十二领域逐项分析",
    ...STAGE_AI_DOMAIN_LABELS.map(
      (label) => `${label}：当前证据待综合判断。`,
    ),
  ].join("\n");

  const valid = validateStageAiText({
    text: fullText,
    stage: "luck",
  });

  assert.equal(valid.valid, true);
  assert.deepEqual(valid.missingDomains, []);

  const invalid = validateStageAiText({
    text: "### 十二领域逐项分析\n事业与工作：较强。",
    stage: "luck",
  });

  assert.equal(invalid.valid, false);
  assert.ok(invalid.missingDomains.includes("感情与婚姻"));
});

test("流年AI校验拦截没有流月证据的具体年内应期", () => {
  const text = [
    "### 十二领域逐项分析",
    ...STAGE_AI_DOMAIN_LABELS.map(
      (label) => `${label}：当前证据待综合判断。`,
    ),
    "年中容易出现明显转折。",
  ].join("\n");

  const validation = validateStageAiText({
    text,
    stage: "year",
  });

  assert.equal(validation.valid, false);
  assert.ok(
    validation.violations.some((item) =>
      item.startsWith("unsupported_year_timing:"),
    ),
  );
});

test("流年Prompt要求AI独立分析十二领域", () => {
  const prompt = buildYearAiPrompt({
    baseBaziViewModel: {
      birthInfo: { gender: "male" },
      pillars: [],
    },
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
        domainSignals,
        transitStructure: { facts: [] },
        triggerImages: { storyPack: {} },
      },
    },
  });

  assert.match(prompt.system, /不得照搬前端旧评分/);
  assert.match(prompt.system, /十二领域必须全部分析/);
  STAGE_AI_DOMAIN_LABELS.forEach((label) => {
    assert.ok(prompt.system.includes(label));
  });
  assert.ok(prompt.trustedPack.domainEvidenceCandidates);
});
