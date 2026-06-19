export const eventTaxonomy = {
  relationship_marriage: {
    label: "关系婚恋",
    legacyTopic: "relationship",
    symbols: ["妻/夫", "婚恋", "关系变化"],
    manifestations: ["恋爱启动、暧昧或确定关系", "关系边界重谈", "合作或亲密关系靠近", "承诺、分工或相处节奏变化", "旧关系议题回到台前"],
    advice: "把关系里的承诺、边界、分工和实际反馈分开记录，不把单一信号当成结果。",
  },
  wealth_resource: {
    label: "财与资源",
    legacyTopic: "wealth",
    symbols: ["财", "收入", "支出", "资源"],
    manifestations: ["兼职打工、临时收入或资源变现", "收入结构调整", "支出预算重算", "报价付款复核", "投资或资源安排被重新讨论"],
    advice: "重点复核合同金额、付款节奏、预算上限和资源归属。",
  },
  children_output: {
    label: "子与输出",
    legacyTopic: "study",
    symbols: ["子", "作品", "项目", "成果"],
    manifestations: ["作品交付", "项目成果显化", "学生、晚辈或宠物事务增加", "表达发布和方案呈现变多"],
    advice: "把输出物、交付节点和反馈对象写清楚，年轻用户优先按项目成果看。",
  },
  career_status: {
    label: "禄与事业身份",
    legacyTopic: "career",
    symbols: ["禄", "事业", "身份", "证书"],
    manifestations: ["岗位职责变化", "考试证书安排", "审批考核节点", "身份角色或头衔被重新确认"],
    advice: "先看职责、权限、流程、证照和考核时间表，不把压力信号直接当成坏结果。",
  },
  health_risk: {
    label: "寿与体感风险",
    legacyTopic: "health",
    symbols: ["寿", "作息", "体感", "风险提醒"],
    manifestations: ["作息体感波动", "压力负荷上升", "出行或工具操作需要复核", "流程安全和身体状态需要留意"],
    advice: "只做作息、体感、流程和出行操作的复核提醒；具体健康问题交给现实反馈和专业判断。",
  },
  movement_change: {
    label: "迁移变动",
    legacyTopic: "movement",
    symbols: ["迁移", "出行", "搬动", "环境变化"],
    manifestations: ["出行改期", "搬动或通勤变化", "工作地点或生活环境调整", "计划节奏被迫重排"],
    advice: "把地点、交通、时间表和备用方案提前核对。",
  },
  social_conflict: {
    label: "人际竞争合作",
    legacyTopic: "social",
    symbols: ["同辈", "竞争", "合作", "朋友"],
    manifestations: ["团队分工重谈", "同辈竞争变明显", "朋友或合伙资源边界调整", "合作摩擦需要摊开说清"],
    advice: "把资源归属、职责边界和沟通记录留痕，避免口头约定模糊。",
  },
  family_home: {
    label: "家庭居住",
    legacyTopic: "family_home",
    symbols: ["家庭", "房产", "父母", "居住环境"],
    manifestations: ["家庭事务被带到台前", "居住环境整理", "房屋或老家事务复核", "父母长辈相关安排增加"],
    advice: "优先复核居住、证件、房屋费用、长辈安排和家庭分工。",
  },
};

export const eventTypes = Object.keys(eventTaxonomy);

export function scoreLevel(score = 0) {
  const value = Number(score || 0);
  if (value >= 75) return "high";
  if (value >= 50) return "medium";
  if (value >= 30) return "low";
  return "none";
}

export function clampScore(value) {
  return Math.max(0, Math.min(100, Math.round(Number(value || 0))));
}

export function unique(items = []) {
  return [...new Set(items.filter(Boolean))];
}

export function createEventCandidate({
  eventType,
  score,
  confidence,
  evidenceChain = [],
  possibleManifestations,
  timing,
  debug = {},
} = {}) {
  const taxonomy = eventTaxonomy[eventType] ?? eventTaxonomy.social_conflict;
  const normalizedScore = clampScore(score);
  return {
    eventType,
    score: normalizedScore,
    level: scoreLevel(normalizedScore),
    confidence: confidence ?? (normalizedScore >= 75 ? "high" : normalizedScore >= 50 ? "medium" : "low"),
    rank: 0,
    evidenceChain: unique(evidenceChain).slice(0, 8),
    possibleManifestations: unique(possibleManifestations?.length ? possibleManifestations : taxonomy.manifestations).slice(0, 5),
    timing: unique(timing).slice(0, 5),
    debug,
  };
}

export function candidateToLegacyScore(candidate) {
  const taxonomy = eventTaxonomy[candidate.eventType] ?? eventTaxonomy.social_conflict;
  return {
    score: candidate.score,
    label: taxonomy.legacyTopic,
    evidence: candidate.evidenceChain,
    realityMapping: candidate.possibleManifestations.join("；"),
    caution: "事件候选来自本地触发链，需要结合现实反馈、原局承接和流月继续复核。",
  };
}

export function chainsForEvent(triggerChains = [], eventType) {
  return triggerChains.filter((chain) => chain.topicHints?.includes(eventType));
}

export function evidenceFromChains(chains = [], limit = 6) {
  return unique(chains.map((chain) => chain.evidence).filter(Boolean)).slice(0, limit);
}

export function timingFromChains(chains = [], fallback = "全年观察，重点看流月是否继续触发。") {
  const monthRows = chains
    .filter((chain) => Number(chain.metadata?.month))
    .sort((a, b) => Number(b.strength || 0) - Number(a.strength || 0))
    .slice(0, 4)
    .map((chain) => `${chain.metadata.month}月：${chain.evidence}`);
  return monthRows.length ? monthRows : [fallback];
}

export function sumStrength(chains = []) {
  return chains.reduce((sum, chain) => sum + Number(chain.strength || 0), 0);
}

export function strongestChains(chains = [], limit = 6) {
  return [...chains].sort((a, b) => Number(b.strength || 0) - Number(a.strength || 0)).slice(0, limit);
}
