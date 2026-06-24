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
  domains: STAGE_AI_DOMAIN_LABELS.map((label, index) => ({
    domain: `domain-${index}`,
    label,
    score: index === 0 ? 100 : 0,
    role: index === 0 ? "primary" : "quiet",
    directFacts: index === 0
      ? [{
          id: "fact-career",
          type: "ten_god",
          source: "流年天干",
          status: "direct",
          polarity: "mixed",
          strength: 4,
          text: "流年天干正官进入规则和责任主题。",
        }]
      : [],
    evidenceIds: index === 0 ? ["fact-career"] : [],
  })),
};

const trustedPack = {
  evidenceFacts: [
    {
      id: "control-1",
      text: "戊克壬，外显主题之间存在制约。",
      meta: {
        controller: "戊",
        controlled: "壬",
        direction: "target_controls_current",
      },
    },
  ],
  domainEvidenceCandidates: {
    domains: [],
  },
  context: {
    natal: {
      imageCards: [],
    },
  },
};

function validReport() {
  return [
    "### 今年总断",
    "当前以事业和学业为主要观察点。",
    "### 重点主线",
    "#### 事业与工作",
    "当前直接触发较强。",
    "#### 学业与资格",
    "有现实任务承接。",
    "### 次要领域",
    "- 财富与资源：有背景信号，但不是核心。",
    "- 感情与婚姻：有候选信息，仍需现实验证。",
    "### 当前不突出",
    "- 家庭与父母：当前缺少直接触发。",
    "- 兄弟朋友：当前缺少独立触发。",
    "- 子女与成果：时柱信息不足，不直接判断实际子女。",
    "- 身心与健康：当前只有一般压力背景。",
    "- 迁移与出行：当前缺少直接移动信号。",
    "- 住房与资产：当前缺少直接资产信号。",
    "- 合作与人际：当前没有形成独立主线。",
    "- 精神状态：当前主要是伴随背景。",
    "### 事情发展逻辑",
    "先有任务，再看现实承接。",
    "### 有利与风险",
    "有利在准备，风险在急躁。",
    "### 现实验证点",
    "观察现实任务是否增加。",
  ].join("\n");
}

test("trustedPack移除前端故事主线并保留关系方向", () => {
  const pack = buildStageAiTrustedPack({
    stage: "year",
    item: {
      year: 2026,
      ganZhi: "丙午",
      domainSignals,
      transitStructure: {
        facts: [{
          id: "control-1",
          type: "stem_control",
          label: "天干相克",
          text: "戊克壬，外显主题之间存在制约。",
          category: "direct",
          status: "direct",
          source: "流月触发原局",
          polarity: "pressure",
          strength: 3,
          domains: ["career"],
          meta: {
            controller: "戊",
            controlled: "壬",
            direction: "target_controls_current",
          },
        }],
      },
      triggerImages: {
        storyPack: {
          themeHierarchy: {
            primary: { id: "legacy-primary" },
          },
        },
      },
    },
    baseBaziViewModel: {
      birthInfo: { gender: "male" },
      pillars: [],
    },
    natalImageReport: {
      imageCards: Array.from({ length: 12 }, (_, index) => ({
        id: `image-${index}`,
        title: `取象${index}`,
        evidence: [`证据${index}`],
      })),
    },
  });

  assert.equal("storyPack" in pack, false);
  assert.equal("themeHierarchy" in pack, false);
  assert.equal(pack.evidenceFacts[0].meta.controller, "戊");
  assert.equal(pack.evidenceFacts[0].meta.controlled, "壬");
  assert.equal(pack.context.natal.imageCards.length, 12);
  assert.equal(
    "score" in pack.domainEvidenceCandidates.domains[0],
    false,
  );
});

test("正式报告必须把十二领域各归类一次", () => {
  const validation = validateStageAiText({
    text: validReport(),
    stage: "year",
    trustedPack,
  });

  assert.equal(validation.valid, true);
  assert.deepEqual(validation.missingDomains, []);
  assert.deepEqual(validation.duplicateDomains, []);
  assert.equal(validation.primaryDomains.length, 2);
  assert.equal(validation.quietDomains.length, 8);
});

test("缺失或重复领域不能通过", () => {
  const text = validReport()
    .replace(
      "- 精神状态：当前主要是伴随背景。",
      "",
    )
    .replace(
      "#### 事业与工作",
      "#### 事业与工作\n- 财富与资源：重复放入主线。",
    );

  const validation = validateStageAiText({
    text,
    stage: "year",
    trustedPack,
  });

  assert.equal(validation.valid, false);
  assert.ok(validation.missingDomains.includes("精神状态"));
  assert.ok(validation.duplicateDomains.includes("财富与资源"));
});

test("不突出领域禁止继续编具体事件", () => {
  const text = validReport().replace(
    "- 住房与资产：当前缺少直接资产信号。",
    "- 住房与资产：当前可能买房或装修。",
  );

  const validation = validateStageAiText({
    text,
    stage: "year",
    trustedPack,
  });

  assert.equal(validation.valid, false);
  assert.ok(
    validation.violations.some((entry) =>
      entry.startsWith("quiet_domain_overreach:"),
    ),
  );
});

test("校验器拦截生克写反和无依据财库", () => {
  const text = validReport()
    .replace(
      "先有任务，再看现实承接。",
      "壬水克制戊土，亥中甲木又构成财库。",
    );

  const validation = validateStageAiText({
    text,
    stage: "year",
    trustedPack,
  });

  assert.equal(validation.valid, false);
  assert.ok(
    validation.violations.includes("reversed_control:壬->戊"),
  );
  assert.ok(
    validation.violations.includes("unsupported_treasury_claim"),
  );
});

test("大运报告不能自行切出多个年龄段", () => {
  const text = validReport()
    .replace("### 今年总断", "### 十年总断")
    .replace(
      "先有任务，再看现实承接。",
      "19—22岁起步，22—25岁发展，25—28岁转折。",
    );

  const validation = validateStageAiText({
    text,
    stage: "luck",
    trustedPack,
  });

  assert.equal(validation.valid, false);
  assert.ok(
    validation.violations.some((entry) =>
      entry.startsWith("unsupported_luck_age_segments:"),
    ),
  );
});

test("流年Prompt采用重点、次要、不突出报告结构", () => {
  const prompt = buildYearAiPrompt({
    baseBaziViewModel: {
      birthInfo: { gender: "male" },
      pillars: [],
    },
    natalImageReport: {},
    luckImageReport: {
      luckItems: [{
        isCurrent: true,
        ganZhi: "癸亥",
      }],
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

  assert.match(prompt.system, /重点主线/);
  assert.match(prompt.system, /次要领域/);
  assert.match(prompt.system, /当前不突出/);
  assert.match(prompt.system, /每个领域只能出现一次/);
  assert.equal("storyPack" in prompt.trustedPack, false);
});
