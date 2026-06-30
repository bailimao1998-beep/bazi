import test from "node:test";
import assert from "node:assert/strict";
import {
  buildFollowUpQuestions,
  buildStarterQuestions,
} from "../../js/shared/chatSuggestionEngine.js";

test("starter questions use ordinary language for working-age users", () => {
  const questions = buildStarterQuestions({
    chart: { input: { year: 1998, targetYear: 2026 } },
    input: { targetYear: 2026 },
  });
  assert.equal(questions.length, 8);
  assert.ok(questions.some((item) => item.includes("遇到合适的人")));
  assert.ok(questions.some((item) => item.includes("换工作")));
  assert.ok(questions.every((item) => !/成立条件|承接不足|结构性|现实边界/.test(item)));
});

test("relationship question produces natural follow-ups", () => {
  const questions = buildFollowUpQuestions({
    messages: [{
      question: "我什么时候容易遇到合适的人？",
      answer: "2027年感情机会会更明显，但现实距离是阻力。",
    }],
    chartContext: { input: { targetYear: 2026 } },
  });
  assert.equal(questions.length, 4);
  assert.ok(questions[0].includes("2027年"));
  assert.ok(questions.some((item) => item.includes("新人")));
  assert.ok(questions.some((item) => item.includes("主动")));
});

test("career question produces practical follow-ups", () => {
  const questions = buildFollowUpQuestions({
    messages: [{
      question: "2026年适合换工作吗？",
      answer: "可以考虑调整，但需要先准备。",
    }],
    chartContext: { input: { targetYear: 2026 } },
  });
  assert.ok(questions.some((item) => item.includes("继续留下")));
  assert.ok(questions.some((item) => item.includes("哪几个月")));
  assert.ok(questions.some((item) => item.includes("岗位")));
});

test("follow-ups do not repeat questions already asked", () => {
  const questions = buildFollowUpQuestions({
    messages: [
      { question: "这件事最大的风险是什么？", answer: "需要控制节奏。" },
      { question: "今年适合换工作吗？", answer: "有机会，但要准备。" },
    ],
    chartContext: { input: { targetYear: 2026 } },
  });
  assert.ok(!questions.includes("这件事最大的风险是什么？"));
  assert.equal(new Set(questions).size, questions.length);
});
