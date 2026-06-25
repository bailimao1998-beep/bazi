import test from "node:test";
import assert from "node:assert/strict";
import { buildChatPrompt } from "../js/core/ai/buildChatPrompt.js";
import { validateChatResponse } from "../js/core/ai/chatResponseGuard.js";

function basePrompt({ age = 19, transition = false } = {}) {
  return {
    user: JSON.stringify({
      chatIntent: "yearTrend",
      subjectContext: { age, lifeStage: age >= 60 ? "晚年阶段" : "青年过渡阶段" },
      natalHardFacts: { gender: "男" },
      luckTimelineForTargetYear: transition ? {
        isTransitionYear: true,
        transitionAt: { year: 2017, month: 8 },
      } : { isTransitionYear: false },
      monthHardFactsList: [],
    }),
  };
}

const compliant = `
## 直接回答
2017年更像阶段转换与规则压力被同时放大的一年，但具体事件仍取决于现实背景。

## 数据完整度
已取得原局、两步大运和丁酉流年；该年为交运年，交运月份为8月，未取得全年十二流月。

## 确定结构
丁酉流年；交运前后分别对应两步大运；酉与原局酉重复，丁与辛存在克制关系。

## 专业判断
辛金偏旺是初步判断，需要月令、根气、透干和制泄共同确认。丁壬只构成五合条件，尚不能确认化木。交运前后应分段，不把两步运叠加。

## 主要显像
### 1. 身份或环境调整
- 可能性：中高
- 依据A：2017年处于交运节点。
- 依据B：丁酉流年重复激活原局酉支。
- 成立条件：现实中正处于升学、毕业、搬迁或角色转换阶段。
- 削弱因素：若现实安排稳定且没有外部节点，可能只表现为内在方向调整。

## 行动建议
- 提前整理不同阶段的任务与时间边界。
- 重要选择保留备选方案，不在压力高点一次性定死。

## 现实验证
观察交运前后生活节奏、身份要求或环境是否发生不同变化。

## 注意边界
不能仅凭命盘确认具体事件，健康不作医学判断。
`;

test("全局提示词包含证据层级、交运分段与建议规则", () => {
  const result = buildChatPrompt({
    question: "2017年会怎样",
    chatIntent: "yearTrend",
    natalImageReport: { natalAiEvidencePack: { chartSummary: { gender: "男", dayMaster: "辛", pillars: {} } } },
    luckImageReport: { luckItems: [
      { index: 1, ganZhi: "壬戌", yearRange: "2007-2017", selectionYear: 2007, selectionMonth: 8 },
      { index: 2, ganZhi: "癸亥", yearRange: "2017-2027", selectionYear: 2017, selectionMonth: 8 },
    ] },
    yearImageReport: { yearItem: { year: 2017, ganZhi: "丁酉", stem: "丁", branch: "酉" } },
    requestedYears: [2017],
    chart: { input: { year: 1998 } },
    currentInput: { targetYear: 2017 },
  });
  const payload = JSON.parse(result.user);
  assert.equal(payload.subjectContext.age, 19);
  assert.equal(payload.luckTimelineForTargetYear.isTransitionYear, true);
  assert.equal(payload.luckTimelineForTargetYear.transitionAt.month, 8);
  assert.match(result.system, /全局通用流程/);
  assert.match(result.system, /建议必须对应可控行动/);
});

test("交运年不分段会被拦截", () => {
  const bad = compliant.replace(/交运前后应分段，不把两步运叠加。/, "两步大运共同作用全年。").replace(/交运前后/, "全年");
  const result = validateChatResponse({ text: bad, prompt: basePrompt({ transition: true }) });
  assert.ok(result.violations.includes("transition_year_not_segmented"));
});

test("客观交运月份允许保留，预测月份仍被拦截", () => {
  const allowed = validateChatResponse({ text: compliant, prompt: basePrompt({ transition: true }) });
  assert.equal(allowed.violations.includes("specific_timing_without_evidence"), false);
  const bad = compliant.replace("交运月份为8月", "交运月份为8月，5月必有大事");
  const result = validateChatResponse({ text: bad, prompt: basePrompt({ transition: true }) });
  assert.ok(result.violations.includes("specific_timing_without_evidence"));
});

test("正式格局缺少条件会被拦截", () => {
  const bad = compliant.replace("丁壬只构成五合条件，尚不能确认化木。", "此年正式形成伤官配印格局。");
  const result = validateChatResponse({ text: bad, prompt: basePrompt({ transition: true }) });
  assert.ok(result.violations.some((x) => x.startsWith("formal_pattern_without_conditions:")));
});

test("主要显像必须有两条独立依据、条件和削弱因素", () => {
  const bad = compliant.replace(/- 依据B：[^\n]+\n/, "").replace(/- 削弱因素：[^\n]+\n/, "");
  const result = validateChatResponse({ text: bad, prompt: basePrompt({ transition: true }) });
  assert.ok(result.violations.some((x) => x.startsWith("event_missing_two_evidence:")));
  assert.ok(result.violations.some((x) => x.startsWith("event_missing_counterevidence:")));
});

test("晚年场景不得套用升学实习模板", () => {
  const bad = compliant.replace("现实中正处于升学、毕业、搬迁或角色转换阶段", "现实中正处于升学、选专业或实习阶段");
  const result = validateChatResponse({ text: bad, prompt: basePrompt({ age: 76, transition: true }) });
  assert.ok(result.violations.includes("life_stage_scene_mismatch"));
});

test("合规的交运年回答可以通过", () => {
  const result = validateChatResponse({ text: compliant, prompt: basePrompt({ transition: true }) });
  assert.equal(result.valid, true, result.violations.join("\n"));
});
