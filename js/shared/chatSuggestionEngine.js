const INTENT_PATTERNS = [
  {
    key: "relationship",
    patterns: [/感情/g, /恋爱/g, /婚姻/g, /对象/g, /正缘/g, /桃花/g, /伴侣/g, /分手/g, /复合/g, /结婚/g, /喜欢的人/g, /合适的人/g, /缘分/g],
  },
  {
    key: "study",
    patterns: [/考试/g, /学业/g, /毕业/g, /专业/g, /深造/g, /考研/g, /留学/g, /学校/g, /学习/g],
  },
  {
    key: "career",
    patterns: [/工作/g, /事业/g, /职业/g, /岗位/g, /跳槽/g, /换工作/g, /求职/g, /升职/g, /创业/g, /上班/g, /生意/g],
  },
  {
    key: "wealth",
    patterns: [/财运/g, /赚钱/g, /收入/g, /破财/g, /投资/g, /存钱/g, /支出/g, /买房/g, /钱/g],
  },
  {
    key: "movement",
    patterns: [/外地/g, /城市/g, /搬家/g, /迁移/g, /出国/g, /回国/g, /远方/g, /换地方/g, /环境变化/g],
  },
  {
    key: "family",
    patterns: [/家庭/g, /父母/g, /家人/g, /子女/g, /孩子/g, /长辈/g, /家里/g],
  },
  {
    key: "health",
    patterns: [/健康/g, /身体/g, /睡眠/g, /压力/g, /情绪/g, /疲惫/g, /精神状态/g, /不舒服/g],
  },
  {
    key: "timing",
    patterns: [/今年/g, /明年/g, /未来/g, /哪年/g, /几年/g, /月份/g, /什么时候/g, /最近/g, /哪几个月/g, /时间/g],
  },
];

export function buildStarterQuestions(chartContext = {}, limit = 8) {
  const targetYear = resolveTargetYear(chartContext);
  const age = resolveAge(chartContext, targetYear);
  const yearLabel = Number.isFinite(targetYear) ? `${targetYear}年` : "今年";

  let questions;
  if (Number.isFinite(age) && age <= 23) {
    questions = [
      `${yearLabel}考试、毕业或找工作要注意什么？`,
      "我现在选的专业或方向适合我吗？",
      "我适合留在家附近，还是去外地发展？",
      "我什么时候容易遇到合适的人？",
      "感情和学业工作，现阶段应该把重心放哪边？",
      "接下来几年哪一年机会更多？",
      "最近为什么总觉得不顺，什么时候会缓过来？",
      "我现在最应该先解决哪一件事？",
    ];
  } else if (Number.isFinite(age) && age >= 60) {
    questions = [
      "接下来几年生活里哪方面变化最明显？",
      "哪些年份适合安稳，哪些年份不宜折腾？",
      "家庭和子女方面最需要注意什么？",
      "以后更适合留在原地，还是换个生活环境？",
      "财务上更适合保守，还是可以做些调整？",
      "最近身体和精神状态为什么容易累？",
      "哪一年生活会更顺一点？",
      "我现在最应该先处理哪件事？",
    ];
  } else if (Number.isFinite(age) && age >= 40) {
    questions = [
      "接下来几年事业是继续往前冲，还是慢下来调整？",
      "现在的工作或生意还值得继续投入吗？",
      "哪几年赚钱机会更好，哪些年份要守一点？",
      "家庭和工作发生冲突时，我应该先顾哪一边？",
      "子女和家庭方面最近最需要注意什么？",
      "未来几年适合换城市或改变生活环境吗？",
      "最近为什么总觉得不顺，什么时候会缓过来？",
      "我现在最应该先解决哪一件事？",
    ];
  } else {
    questions = [
      "我什么时候容易遇到合适的人？",
      "现在这段感情还有没有继续发展的可能？",
      `${yearLabel}适合换工作或换方向吗？`,
      "我更适合留在现在的地方，还是去外地发展？",
      "接下来几年哪一年赚钱机会更好？",
      "最近为什么总觉得不顺，什么时候会缓过来？",
      `${yearLabel}哪几个月最关键？`,
      "我现在最应该先解决哪一件事？",
    ];
  }

  return uniqueQuestions(questions).slice(0, Math.max(1, Number(limit) || 8));
}

export function buildFollowUpQuestions({ messages = [], chartContext = {}, limit = 4 } = {}) {
  const history = Array.isArray(messages) ? messages.filter(Boolean) : [];
  const last = history.at(-1) ?? {};
  const question = cleanText(last.question);
  const answer = cleanText(last.answer);
  if (!question && !answer) return [];

  const targetYear = resolveTargetYear(chartContext);
  const focusYear = extractUsefulYear(`${question} ${answer}`, targetYear);
  const yearLabel = Number.isFinite(focusYear) ? `${focusYear}年` : "今年";
  const intent = detectIntent(question, answer);
  const asked = new Set(history.map((item) => normalizeQuestion(item?.question)));

  const candidates = followUpsForIntent(intent, yearLabel);
  const filtered = uniqueQuestions(candidates)
    .filter((item) => !asked.has(normalizeQuestion(item)))
    .slice(0, Math.max(1, Number(limit) || 4));

  if (filtered.length >= Math.min(3, limit)) return filtered;

  return uniqueQuestions([
    ...filtered,
    "那这件事大概什么时候最明显？",
    "最好的可能是什么？",
    "最大的风险是什么？",
    "我现在应该先做什么？",
  ])
    .filter((item) => !asked.has(normalizeQuestion(item)))
    .slice(0, Math.max(1, Number(limit) || 4));
}

function followUpsForIntent(intent, yearLabel) {
  switch (intent) {
    case "relationship":
      return [
        `${yearLabel}哪几个月感情最明显？`,
        "更像遇到新人，还是现有关系发生变化？",
        "这段关系最大的阻力是什么？",
        "我应该主动一点，还是顺其自然？",
      ];
    case "study":
      return [
        "这次更适合冲一把，还是稳妥准备？",
        "哪段时间最容易看到结果？",
        "我更适合继续深造，还是尽快工作？",
        "现在最需要补的短板是什么？",
      ];
    case "career":
      return [
        "那我更适合换工作，还是继续留下？",
        `${yearLabel}哪几个月行动更合适？`,
        "更适合什么类型的岗位或工作方式？",
        "这件事最大的风险是什么？",
      ];
    case "wealth":
      return [
        "我的钱更适合从哪里赚？",
        "哪一年收入提升更明显？",
        "最近要注意哪些支出？",
        "现在更适合投资，还是先存钱？",
      ];
    case "movement":
      return [
        "更适合主动换地方，还是等机会带动？",
        `${yearLabel}哪几个月行动更合适？`,
        "换环境对工作和感情哪方面影响更大？",
        "这次变化最大的风险是什么？",
      ];
    case "family":
      return [
        "这件事主要会影响家里的哪一方面？",
        "我应该主动沟通，还是先保持距离？",
        "什么时候更容易缓和？",
        "我需要承担到什么程度才合适？",
      ];
    case "health":
      return [
        "最近更像压力大，还是作息失衡？",
        "哪段时间需要特别注意休息？",
        "哪些生活习惯最值得先调整？",
        "什么情况应该及时去医院检查？",
      ];
    case "timing":
      return [
        `${yearLabel}最重要的一件事是什么？`,
        `${yearLabel}哪几个月最容易出现变化？`,
        `${yearLabel}什么事情不适合勉强？`,
        `${yearLabel}有什么机会值得主动抓住？`,
      ];
    default:
      return [
        "那这件事大概什么时候最明显？",
        "最好的可能是什么？",
        "最大的风险是什么？",
        "我现在应该先做什么？",
      ];
  }
}

function detectIntent(question, answer) {
  let best = { key: "generic", score: 0 };
  for (const entry of INTENT_PATTERNS) {
    const questionScore = countMatches(question, entry.patterns) * 3;
    const answerScore = countMatches(answer, entry.patterns);
    const score = questionScore + answerScore;
    if (score > best.score) best = { key: entry.key, score };
  }
  return best.key;
}

function countMatches(text, patterns) {
  return patterns.reduce((sum, pattern) => {
    const flags = pattern.flags.includes("g") ? pattern.flags : `${pattern.flags}g`;
    const matched = String(text || "").match(new RegExp(pattern.source, flags));
    return sum + (matched?.length || 0);
  }, 0);
}

function resolveTargetYear(chartContext = {}) {
  return firstFinite([
    chartContext?.input?.targetYear,
    chartContext?.yearImageReport?.yearItem?.year,
    chartContext?.chart?.input?.targetYear,
    new Date().getFullYear(),
  ]);
}

function resolveAge(chartContext = {}, targetYear) {
  const birthYear = firstFinite([
    chartContext?.chart?.input?.year,
    chartContext?.chart?.input?.birthYear,
    chartContext?.baseBaziViewModel?.birthInfo?.year,
    chartContext?.baseBaziViewModel?.birthInfo?.birthYear,
  ]);
  if (!Number.isFinite(birthYear) || !Number.isFinite(targetYear)) return NaN;
  return Math.max(0, Math.trunc(targetYear - birthYear));
}

function extractUsefulYear(text, fallback) {
  const years = [...String(text || "").matchAll(/(?:19|20)\d{2}/g)]
    .map((item) => Number(item[0]))
    .filter(Number.isFinite);
  if (!years.length) return Number.isFinite(fallback) ? fallback : NaN;
  const baseline = Number.isFinite(fallback) ? fallback : years[0];
  return years.find((year) => year >= baseline) ?? years.at(-1);
}

function firstFinite(values = []) {
  for (const value of values) {
    const number = Number(value);
    if (Number.isFinite(number)) return Math.trunc(number);
  }
  return NaN;
}

function uniqueQuestions(values = []) {
  const seen = new Set();
  return values
    .map(cleanText)
    .filter(Boolean)
    .filter((item) => {
      const key = normalizeQuestion(item);
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function normalizeQuestion(value) {
  return cleanText(value)
    .replace(/[，。！？、；：,.!?;:\s]/g, "")
    .toLowerCase();
}

function cleanText(value) {
  return String(value ?? "").trim();
}
