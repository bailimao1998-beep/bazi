const modeLabels = { luck: "大运", year: "流年", month: "流月" };

const tenGodEventMap = [
  {
    keys: ["正官", "七杀", "官杀"],
    title: "规则职责与流程复核",
    candidates: ["候选事象：工作职责变化、考核流程、合规边界、合同手续复核。"],
    verification: ["验证条件：现实中若出现岗位责任、审核流程、证照手续或合同节点，再结合原局承接和岁运层级复核。"],
  },
  {
    keys: ["正财", "偏财", "财星"],
    title: "钱与资源安排",
    candidates: ["候选事象：收支安排、预算分配、客户资源、合作报价或家庭资源承接。"],
    verification: ["验证条件：现实中若出现付款、报价、资源调配或家庭开支主题，再结合财星位置和日主承载继续验证。"],
  },
  {
    keys: ["正印", "偏印", "印星"],
    title: "学习资质与支持系统",
    candidates: ["候选事象：课程学习、证书材料、长辈支持、信息吸收或制度内资源申请。"],
    verification: ["验证条件：现实中若出现学习计划、资料办理、上级支持或文书材料，再回到印星和柱位复核。"],
  },
  {
    keys: ["食神", "伤官", "食伤"],
    title: "表达输出与作品交付",
    candidates: ["候选事象：作品输出、公开表达、方案呈现、沟通交付或技术展示。"],
    verification: ["验证条件：现实中若出现汇报、发布、写作、创作或客户沟通，再结合食伤是否被制化继续验证。"],
  },
  {
    keys: ["比肩", "劫财", "比劫"],
    title: "同辈竞争与协作边界",
    candidates: ["候选事象：同事同辈竞争、合伙分工、朋友互动、团队资源分配或边界调整。"],
    verification: ["验证条件：现实中若出现协作分工、竞争比较或资源分摊，再结合比劫强弱和岁运触发复核。"],
  },
];

const elementEventMap = [
  { keys: ["木"], title: "规划生长", candidates: ["候选事象：新计划启动、学习成长、方向调整、关系伸展或长期项目发芽。"] },
  { keys: ["火"], title: "表达曝光", candidates: ["候选事象：公开表达、被看见、活动热度、作品显化或情绪热度上升。"] },
  { keys: ["土"], title: "承载家宅", candidates: ["候选事象：家宅配置、资产承载、责任分配、储蓄整理或稳定性议题。"] },
  { keys: ["金"], title: "规则工具", candidates: ["候选事象：流程制度、工具技术、标准审核、合规材料或专业训练。"] },
  { keys: ["水"], title: "流动信息", candidates: ["候选事象：出行流动、信息沟通、远方消息、学习吸收或情绪体感波动。"] },
];

const relationEventMap = [
  {
    keys: ["冲", "变化", "拉扯", "移动", "重新安排"],
    title: "变动迁移与重新安排",
    candidates: ["候选事象：搬动、出行、岗位或项目重新安排、沟通冲突、日程改动。"],
    verification: ["验证条件：现实中若出现地点、时间表、合作关系或任务优先级变化，再结合被冲柱位和流月复核。"],
  },
  {
    keys: ["合", "合象", "牵连", "合绊"],
    title: "合作绑定与资源牵连",
    candidates: ["候选事象：合作绑定、资源责任被带动、关系黏连、共同项目或协议协商。"],
    verification: ["验证条件：现实中若出现协作、签约、资源共用或关系牵制，再看是否有月令、透干、根气承接。"],
  },
  {
    keys: ["害", "隐性", "摩擦", "不顺"],
    title: "隐性摩擦与细节复核",
    candidates: ["候选事象：暗处别扭、沟通误会、流程卡点、配合不畅或细节返工。"],
    verification: ["验证条件：现实中若出现说不清的卡顿、误会或小流程反复，再结合柱位和岁运层级观察。"],
  },
  {
    keys: ["同干", "同支", "伏吟", "同象"],
    title: "旧题重现与主题反复",
    candidates: ["候选事象：旧项目重提、熟人旧事回到台前、原有责任再被强调或同类问题反复出现。"],
    verification: ["验证条件：现实中若出现重复议题、旧人旧事或同类任务回流，再结合被触发柱位继续验证。"],
  },
];

const pillarEventMap = [
  { key: "年柱", text: "柱位落点：年柱偏外部环境、家族背景、远端资源或公开层面的观察。" },
  { key: "月柱", text: "柱位落点：月柱偏工作环境、团队节奏、上级规则或现实运行环境。" },
  { key: "日柱", text: "柱位落点：日柱偏自我状态、亲密关系、合作边界或当下体感。" },
  { key: "时柱", text: "柱位落点：时柱偏长期项目、下属晚辈、后续安排或未来规划。" },
];

const sensitiveReview = "敏感复核：作息体感、流程合规、出行操作安全只作为观察清单，需要结合现实反馈和更多结构验证，不能单独作为结论。";

export function buildEventCandidateScenarios({ mode = "year", signals, coreSignals, text = "" } = {}) {
  const label = modeLabels[mode] ?? "岁运";
  const rows = pickSignals(mode, signals, coreSignals);
  const scenarios = rows.length ? rows.map((signal) => buildScenario(signal, label)).slice(0, mode === "month" ? 4 : 5) : fallbackScenarios(label);
  return {
    summary: `${label}本地辅助报告：已把页面矩阵证据翻成具体候选事象，仍需结合现实反馈继续验证，不能单独作为结论。`,
    keySignals: rows.slice(0, 5).map((signal) => `证据链 -> ${signal.evidence || signal.title || "页面矩阵信号"}；候选事象 -> ${eventTextForSignal(signal).join("；")}`),
    likelyThemes: collectEventCandidatesFromSignals(scenarios).slice(0, 8),
    cautions: ["这里不重新排盘，也不补充页面没有列出的干支关系。", sensitiveReview],
    verificationLimits: ["现实验证仍需结合原局、大运、流年、流月、柱位、旺衰与实际经历继续观察，不能单独作为结论。"],
    scenarios: scenarios.length ? scenarios : fallbackScenarios(label, text),
  };
}

export function buildEventCandidateReportFromPrompt(prompt = {}) {
  const input = parsePromptUser(prompt.user);
  const mode = prompt.mode ?? input.mode ?? "year";
  return buildEventCandidateScenarios({
    mode,
    signals: mode === "month" ? input.monthSignals : input.transitSignals,
    coreSignals: input.coreSignals,
    text: input.modeLabel,
  });
}

export function collectEventCandidatesFromSignals(value = []) {
  const scenarios = Array.isArray(value) ? value : value?.scenarios ?? [];
  return scenarios.flatMap((scenario) => normalizeList(scenario?.lifeSignals)).filter((item) => item.includes("候选事象"));
}

function parsePromptUser(user) {
  try {
    return JSON.parse(user || "{}");
  } catch {
    return {};
  }
}

function pickSignals(mode, signals, coreSignals) {
  const rows = [...flattenSignals(signals), ...flattenSignals(mode === "luck" ? coreSignals : null)]
    .filter((signal) => signal && !String(signal.title || "").includes("未命中"));
  return rows.length ? rows : flattenSignals(coreSignals).filter((signal) => signal && !String(signal.title || "").includes("未命中"));
}

function flattenSignals(source) {
  if (!source) return [];
  if (Array.isArray(source)) return source.flatMap(flattenSignals);
  if (Array.isArray(source.groups)) return source.groups.flatMap((group) => flattenSignals(group.signals).map((signal) => ({ ...signal, groupTitle: group.title })));
  if (Array.isArray(source.signals)) return source.signals;
  if (source.title || source.evidence || source.keywords) return [source];
  return [];
}

function buildScenario(signal, label) {
  const events = eventTextForSignal(signal);
  return {
    title: scenarioTitle(signal, label),
    evidence: [`证据链 -> ${signal.evidence || signal.title || "页面矩阵信号"}`],
    lifeSignals: [...events, ...pillarTexts(signal), sensitiveReview],
    verification: verificationTextForSignal(signal),
    boundary: "边界 -> 当前只整理候选事象，不能单独推出具体结果，不能单独作为结论。",
  };
}

function scenarioTitle(signal, label) {
  const text = signalText(signal);
  const matched = [...relationEventMap, ...tenGodEventMap, ...elementEventMap].find((item) => hasAny(text, item.keys));
  return `${label}${matched?.title || signal.title || "候选事象"}`;
}

function eventTextForSignal(signal) {
  const text = signalText(signal);
  const matched = [...relationEventMap, ...tenGodEventMap, ...elementEventMap].filter((item) => hasAny(text, item.keys));
  const events = matched.flatMap((item) => item.candidates);
  if (events.length) return dedupe(events);
  return ["候选事象：工作职责变化、收支安排、合作摩擦、搬动出行、作息体感波动可作为复核入口。"];
}

function verificationTextForSignal(signal) {
  const text = signalText(signal);
  const matched = [...relationEventMap, ...tenGodEventMap].filter((item) => hasAny(text, item.keys)).flatMap((item) => item.verification || []);
  return dedupe([
    ...matched,
    "验证条件：若现实反馈与候选事象集中重合，再回到柱位、旺衰、十神、岁运继续验证。",
  ]);
}

function pillarTexts(signal) {
  const text = signalText(signal);
  return pillarEventMap.filter((item) => text.includes(item.key)).map((item) => item.text);
}

function fallbackScenarios(label) {
  return [
    {
      title: `${label}规则职责与现实安排`,
      evidence: [`证据链 -> ${label}层级已有本地矩阵触发点，需要回看对应十神、五行和干支关系。`],
      lifeSignals: ["候选事象：工作职责变化、流程合规、合同手续复核、任务重新安排。", sensitiveReview],
      verification: ["验证条件：现实中若出现职责、流程、合同或时间表变化，再结合原局和岁运层级复核。"],
      boundary: "边界 -> 不能单独推出具体结果，不能单独作为结论。",
    },
    {
      title: `${label}资源关系与迁动复核`,
      evidence: [`证据链 -> ${label}层级可从十神、五行、合冲害和柱位继续拆分。`],
      lifeSignals: ["候选事象：收支安排、合作摩擦、搬动出行、信息沟通和作息体感波动。", sensitiveReview],
      verification: ["验证条件：现实中若这些主题反复出现，再结合大运、流年、流月和实际反馈继续观察。"],
      boundary: "边界 -> 不能单独推出关系、财务或状态结论，不能单独作为结论。",
    },
  ];
}

function signalText(signal) {
  return [
    signal?.title,
    signal?.tag,
    signal?.group,
    signal?.groupTitle,
    signal?.evidence,
    signal?.keywords,
    signal?.plainReading,
    signal?.realLifeMeaning,
    signal?.caution,
  ].filter(Boolean).join(" ");
}

function normalizeList(value) {
  return Array.isArray(value) ? value.map((item) => String(item)) : [];
}

function hasAny(text, keys) {
  return keys.some((key) => text.includes(key));
}

function dedupe(items) {
  return [...new Set(items.filter(Boolean))];
}
