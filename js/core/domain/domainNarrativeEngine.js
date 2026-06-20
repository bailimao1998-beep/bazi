import { domainRules } from "./domainRuleDatabase.js";
import { buildDomainEvidence } from "./domainEvidenceEngine.js";

const domainCopy = {
  self: {
    title: "性格有主见，做事讲节奏和边界",
    judgement: "这个人性格里主见和边界感比较明，做事讲自己的节奏，不喜欢被别人安排得太死。",
    manifestation: "脾气上不太喜欢被逼着走，遇事容易先按自己的判断回应，也会比较在意自己是否被尊重。",
    low: "命主自身这一项不是最外放的主线，但日主、月令和五行底色仍会影响做事节奏与反应方式。",
  },
  parents: {
    title: "早年环境和家庭秩序有存在感",
    judgement: "早年环境和家庭秩序对这个人的底色有影响，家中规则、父母分工、成长资源或早期压力容易留下痕迹。",
    manifestation: "容易在现实里体现为重家庭规则、在意稳定来源，也会把早年经验带进后来的选择方式。",
    low: "父母家庭不是原局最突出的主线，更多从年柱月柱看基础背景和早年环境。",
  },
  siblings: {
    title: "同辈关系带出竞争合作和资源边界",
    judgement: "同辈关系是这个盘里有存在感的一条线，兄弟姐妹、同龄人、合作伙伴容易带来竞争、分工和资源分配议题。",
    manifestation: "容易在朋友、同事、合伙关系里遇到分利、协作、边界和谁来主导的问题。",
    low: "兄弟同辈不是原局最突出的主线，更多作为同龄关系、合作分工和资源边界的辅助线索。",
  },
  spouse: {
    title: "感情里安全感和边界感较重要",
    judgement: "感情里安全感和边界感是重点，关系推进不只是情绪互动，也容易牵到沟通、责任和现实分配。",
    manifestation: "容易表现为在亲密关系中既重连接，也会在意对方是否尊重自己的节奏和边界。",
    low: "夫妻感情不是原局最重的外显主题，先以日支关系宫看基本相处模式。",
  },
  children: {
    title: "子女结果层偏向输出、作品和长期规划",
    judgement: "子女和结果层更多体现为输出、作品、项目成果和长期规划，这个方向看时柱和食伤能不能把想法落成结果。",
    manifestation: "容易通过表达、技能、项目、作品或后续规划来呈现成果感。",
    low: "子女结果这一项不是原局最突出的主线，更多要等大运流年引动时柱或食伤后才会明显。",
  },
  wealth: {
    title: "财务要看资源调度和承载力",
    judgement: "财不是不能有，而是要看资源怎么被调度、能不能留住，钱财容易和技能、项目、合作、人情或后天运势产生关系。",
    manifestation: "容易表现为收入来源不只一种，财务稳定度会受到合作分配、专业能力和资源承接影响。",
    low: "财帛财富这一项不是原局最突出的主线，更多要等大运流年把财星或食伤引出来后才会明显。",
  },
  health: {
    title: "体质层面更像长期倾向",
    judgement: "体质层面更像一种长期倾向，不是直接断疾病，这个盘更适合看睡眠、消化、压力反应和寒湿燥热的体感变化。",
    manifestation: "容易在作息、精力、情绪压力和身体反应之间形成固定模式。",
    low: "疾厄健康只作体质取象，原局证据不重时以生活习惯和五行偏性作辅助参考。",
  },
  movement: {
    title: "环境变化和空间转换容易应事",
    judgement: "环境变化感比较明显，容易通过搬迁、出行、异地、岗位环境变化或生活节奏切换来应事。",
    manifestation: "容易在通勤、跨城、外部环境、人际圈层或工作场景变化中触发状态变化。",
    low: "迁移环境不是原局最突出的主线，更多等岁运冲动或现实计划引动后才明显。",
  },
  friends: {
    title: "外部圈层带机会，也带人情牵连",
    judgement: "外部朋友和人脉资源容易带来机会，也容易带来牵连，合作、人情、资源边界是交友里要处理的重点。",
    manifestation: "容易在朋友圈、合作圈、资源交换里出现互相帮忙、互相消耗或边界不清的情况。",
    low: "交友人脉不是原局最突出的主线，外部圈层更多要看后天环境和岁运牵动。",
  },
  career: {
    title: "事业围绕规则、职责和能力输出展开",
    judgement: "事业上更容易围绕规则、岗位身份、职责压力、考核和技术输出展开，职业发展看规则承接和能力输出能否配合。",
    manifestation: "容易在岗位责任、专业能力、流程要求和成果交付之间找到事业落点。",
    low: "官禄事业不是原局最突出的主线，事业落点更多要看后天行业和岁运承接。",
  },
  property: {
    title: "田宅资产看固定承载和家庭资源",
    judgement: "田宅资产这条线更适合看固定资产、居住环境、家庭资产和稳定承载力。",
    manifestation: "容易通过居住环境、家庭资源、长期积累或固定资产议题体现出来。",
    low: "田宅资产取象证据不强，先看家庭背景、财星承接和土气稳定度。",
  },
  fortune: {
    title: "精神安全感和长期心态是重点",
    judgement: "福德精神不是单纯说享福，而是看这个人的精神安全感、长期心态、兴趣系统和内在消耗。",
    manifestation: "容易在学习兴趣、信念系统、享受能力、孤独感、内耗和舒适度上形成固定倾向。",
    low: "福德精神不是原局最外显的主线，更多从印星、食伤和五行流通看长期心态。",
  },
};

const domainCoreKeywords = {
  self: ["性格底色", "主见", "脾气", "做事节奏", "边界感"],
  parents: ["早年环境", "家庭秩序", "父母分工", "成长资源", "责任感"],
  siblings: ["同辈关系", "竞争合作", "分工边界", "资源分配", "兄弟朋友"],
  spouse: ["安全感", "沟通方式", "亲密边界", "责任分配", "关系节奏"],
  children: ["输出能力", "作品成果", "长期规划", "后续落地", "结果意识"],
  wealth: ["收入方式", "资源调度", "承载力", "人情往来", "财务稳定"],
  health: ["体质倾向", "睡眠消化", "压力反应", "寒暖燥湿", "精力状态"],
  movement: ["环境变化", "出行迁动", "空间转换", "岗位切换", "生活节奏"],
  friends: ["朋友圈层", "人脉资源", "合作边界", "人情牵连", "资源交换"],
  career: ["岗位职责", "规则压力", "专业承接", "成果交付", "事业稳定"],
  property: ["居住环境", "固定资产", "家庭资源", "稳定承载", "长期积累"],
  fortune: ["精神安全感", "长期心态", "兴趣系统", "内在消耗", "放松能力"],
};

const domainFrontOverrides = {
  day_branch_clashed: {
    self: {
      title: "性格有主见，外部变化会牵动节奏",
      judgement: "这个人不是完全随环境走，性格里仍有主见和边界感，只是遇到关系、人事或外部变化时，做事节奏会更快被带动。",
      manifestation: "脾气上容易先判断再回应，现实里常从沟通、居住环境、工作节奏或生活安排里显出来。",
    },
    spouse: {
      title: "感情里安全感和边界感较重要",
      judgement: "感情里安全感和边界感是重点，关系推进不只是情绪互动，也容易牵涉沟通方式、现实责任和彼此节奏。",
      manifestation: "亲密关系里容易出现节奏拉扯、责任分配和边界确认的问题。",
    },
    health: {
      title: "压力和情绪容易转成体感反应",
      judgement: "关系、人事和环境变化一多，睡眠、紧绷感、消化或精神消耗就更容易被带出来。",
      manifestation: "体质层面更像长期压力反应，不是直接断疾病。",
    },
    movement: {
      title: "环境变化和空间转换容易应事",
      judgement: "搬动、出行、异地、岗位环境变化，往往比静态稳定更容易触发这个盘的状态。",
      manifestation: "外部环境一动，人的节奏、心态和现实安排也更容易跟着调整。",
    },
  },
  day_branch_combined: {
    spouse: {
      title: "关系推进容易带有牵连和现实责任",
      judgement: "亲密关系不只是情绪互动，也更容易带有绑定、合作、责任和现实分配。",
      manifestation: "感情里容易一边想靠近，一边又要处理彼此节奏和实际安排。",
    },
    friends: {
      title: "朋友合作带来机会，也容易带来牵连",
      judgement: "外部圈层容易形成互相帮忙和资源绑定，机会与人情往来常常一起出现。",
      manifestation: "合作、人情、资源边界，是交友里需要处理的重点。",
    },
    wealth: {
      title: "钱财容易和合作关系绑在一起",
      judgement: "财务方式不只是个人收入，也容易被合作、人情和现实责任牵动。",
      manifestation: "钱财进出常和项目、朋友、合作资源或关系承诺有关。",
    },
  },
  day_branch_punished_harmed_broken: {
    self: {
      title: "性格有边界，细碎压力容易耗神",
      judgement: "这个人性格里有自己的界线，脾气不一定外放，但细碎摩擦和被冒犯感容易慢慢累积。",
      manifestation: "现实里容易在沟通细节、日常压力和自我防御之间消耗精力。",
    },
    spouse: {
      title: "亲密关系里细节摩擦较有存在感",
      judgement: "感情不只是大起大落，很多时候是沟通细节、边界感和现实分配带来反复。",
      manifestation: "关系里的不舒服常从小事、节奏和未说清的责任里显出来。",
    },
    health: {
      title: "长期暗耗会影响体感和精神状态",
      judgement: "压力更容易变成慢性消耗，情绪、睡眠和紧绷感会比单一事件更有存在感。",
      manifestation: "体质取象偏向内耗、压力反应和生活节奏失衡。",
    },
  },
  peer_heavy_wealth_weak: {
    self: {
      title: "自我节奏明显，做事有自己的判断",
      judgement: "这个人自我意识比较明显，遇事通常会先按自己的判断推进，不太喜欢被别人安排太死。",
      manifestation: "容易表现为有主见、重边界，也比较在意自己是否被尊重。",
    },
    siblings: {
      title: "同辈竞争与资源边界较明显",
      judgement: "同辈关系是这个盘里比较重要的一条线，朋友、兄弟姐妹、同龄人、合作伙伴容易带来竞争、分工和资源分配问题。",
      manifestation: "合作时要把分工、收益和边界说清楚，否则容易消耗。",
    },
    friends: {
      title: "朋友合作带来机会，也容易带来牵连",
      judgement: "外部朋友和人脉资源容易带来机会，也容易带来牵连。",
      manifestation: "合作、人情、资源边界，是交友里需要处理的重点。",
    },
    wealth: {
      title: "钱财容易被合作、人情和资源分配牵动",
      judgement: "财不是完全没有机会，但不太适合只看有没有财，钱财更容易跟朋友、合作、项目和人情往来绑在一起。",
      manifestation: "钱进来以后也容易被分摊，或在合作、人情和项目周转里流动。",
    },
  },
  peer_heavy_wealth_visible: {
    siblings: {
      title: "同辈关系里有资源合作也有分配问题",
      judgement: "朋友、兄弟姐妹、同龄人和合作伙伴容易同时带来机会与分利问题。",
      manifestation: "合作有机会做出资源，但边界和收益分配要讲清楚。",
    },
    friends: {
      title: "人脉圈层能带资源，也会带人情成本",
      judgement: "外部圈层不是纯消耗，也有机会通过合作、人情和资源交换带来机会。",
      manifestation: "关键在于能不能把合作规则和分配方式定清楚。",
    },
    wealth: {
      title: "财富方式更看合作规则和资源调度",
      judgement: "钱财容易和同辈合作、人情资源绑在一起，有资源入口，也有分配压力。",
      manifestation: "适合看项目合作、收益分成、人情支出和资源调度能力。",
    },
  },
  resource_visible_output_visible: {
    self: {
      title: "学习吸收和表达输出都有空间",
      judgement: "这个人既能靠资料、经验和系统训练积累，也有机会把学到的东西转成表达、作品或项目结果。",
      manifestation: "适合在学习、整理、表达和实际交付之间形成自己的节奏。",
    },
    children: {
      title: "有输出和成果意识，但需要持续落地",
      judgement: "子女和结果层更多体现为输出、作品、项目成果和长期规划。",
      manifestation: "这个方向更适合看作品、项目、表达成果和后续落地，不适合直接断子女数量。",
    },
    career: {
      title: "资质承接和能力输出都会影响事业路径",
      judgement: "事业不只看机会，也要看证书、平台、专业能力和实际交付能不能配合起来。",
      manifestation: "容易通过学习积累、专业训练、表达输出或项目成果形成事业落点。",
    },
    fortune: {
      title: "精神安全感来自学习、兴趣和稳定系统",
      judgement: "这个人需要一个能持续吸收、思考和表达的空间，内在才比较容易安定。",
      manifestation: "兴趣、资料、表达和作品感，会影响长期心态和放松能力。",
    },
  },
  output_visible_wealth_trace: {
    wealth: {
      title: "财富方式更看技能、项目和后天转化",
      judgement: "钱财更容易从技能、表达、项目、内容、交付成果或专业服务里转出来。",
      manifestation: "收入稳定度要看项目承接、合作分配和持续输出能力。",
    },
    career: {
      title: "事业路径重能力输出和成果交付",
      judgement: "职业发展更容易围绕技能、表达、项目和可见成果展开。",
      manifestation: "适合看专业服务、项目交付、内容表达或技术输出。",
    },
    children: {
      title: "结果层有作品和项目成果意识",
      judgement: "这个方向不只看子女，也看作品、项目、表达成果和长期规划。",
      manifestation: "想法更容易通过具体交付和持续输出变成结果。",
    },
  },
  officer_visible_resource_support: {
    self: {
      title: "责任感和规则意识会塑造自我节奏",
      judgement: "这个人容易把责任、标准和身份感放进自己的做事方式里。",
      manifestation: "遇到规则压力时，反而可能通过学习、资质和稳定系统来承接。",
    },
    parents: {
      title: "家庭规则和成长秩序较有影响",
      judgement: "早年环境里规则、责任、长辈要求或资源保护感较容易留下底色。",
      manifestation: "家中秩序、父母分工和成长资源会参与塑造后来的选择方式。",
    },
    career: {
      title: "事业更看规则、职责和专业承接",
      judgement: "事业上更容易绕不开规则、职责、岗位身份和考核压力。",
      manifestation: "适合看专业能力、资质平台、规则承接和长期稳定性。",
    },
    fortune: {
      title: "精神安全感来自稳定规则和自我承接",
      judgement: "内在安定感和可依靠的系统有关，越有清楚规则和学习承接，心里越容易稳。",
      manifestation: "压力不全是坏事，能承接时会变成身份感和秩序感。",
    },
  },
  officer_visible_hurting_visible: {
    self: {
      title: "表达欲和规则压力容易同时出现",
      judgement: "这个人既有自己的表达和判断，也容易遇到规则、考核或责任的约束。",
      manifestation: "状态上会在想突破和要守规矩之间反复拉扯。",
    },
    spouse: {
      title: "关系里沟通方式和责任分配较关键",
      judgement: "感情里不只是情绪互动，也容易带出表达方式、规则感和现实责任。",
      manifestation: "说话方式、边界和谁来承担责任，会影响关系稳定度。",
    },
    career: {
      title: "事业路径重规则，也要看能力输出",
      judgement: "职业发展容易同时面对成果交付和制度要求，既要能做事，也要能承接规则。",
      manifestation: "适合在专业表达、技术输出和流程考核之间找到平衡。",
    },
  },
  earth_visible_wealth_resource_trace: {
    parents: {
      title: "家庭资源和稳定承接有存在感",
      judgement: "早年环境、家庭资源和稳定承接容易对这个人产生影响。",
      manifestation: "家中资产、居住环境、长辈支持或家庭责任会成为现实议题。",
    },
    property: {
      title: "固定资产和居住承载有观察点",
      judgement: "田宅资产这条线更适合看固定资产、居住环境、家庭资产和稳定承载力。",
      manifestation: "证据明显时说明有固定承载的观察点，证据弱时则要等岁运再引动。",
    },
    wealth: {
      title: "财富方式带有稳定积累和承载感",
      judgement: "钱财不只看流动收入，也更适合看长期积累、家庭资源和固定承载。",
      manifestation: "资产、居住、稳定项目和现实责任容易和财务方式连在一起。",
    },
  },
  water_visible_cold_damp: {
    health: {
      title: "体质层面偏向寒湿和压力体感",
      judgement: "体质取象更偏长期感受，不是直接断疾病。",
      manifestation: "睡眠、寒湿体感、精神敏感度和安全感需求会比较值得留意。",
    },
    movement: {
      title: "环境适应和信息流动感较明显",
      judgement: "这个人对环境、节奏和信息变化会比较敏感，外部变化容易带动状态。",
      manifestation: "通勤、异地、工作场景和生活节奏变化会影响表现。",
    },
    fortune: {
      title: "内在安定感容易受环境和情绪影响",
      judgement: "精神状态更看安全感、睡眠节奏和环境是否稳定。",
      manifestation: "当环境嘈杂或节奏不稳时，内耗感和敏感度更容易浮出来。",
    },
  },
  element_bias_clear: {
    self: {
      title: "性格和做事方式有固定倾向",
      judgement: "这个人的状态容易围绕某一类气象反复呈现，做事偏好和反应方式会比较有辨识度。",
      manifestation: "优点是风格清楚，压力点是容易卡在熟悉的模式里。",
    },
    health: {
      title: "体质层面更看长期偏性和压力反应",
      judgement: "体质层面更像长期倾向，不是直接断疾病。",
      manifestation: "睡眠、消化、压力反应、寒湿燥热和五行偏性会更容易形成固定体感。",
    },
    fortune: {
      title: "长期心态容易围绕固定模式反复",
      judgement: "精神安全感会受到自身偏好、生活节奏和压力承接方式影响。",
      manifestation: "内在消耗往往来自长期重复的思维和情绪模式。",
    },
  },
};

export function buildTwelveDomainPortrait({ chart, baseBaziViewModel, natalImageReport } = {}) {
  const evidenceResult = buildDomainEvidence({ chart, baseBaziViewModel, natalImageReport });
  return domainRules.map((rule) => {
    const evidence = evidenceResult.domainEvidence[rule.key] ?? {
      score: 0,
      matchedSignals: [],
      matchedRules: [],
      matchedCombinations: [],
      confidence: "low",
    };
    return buildDomainPortrait(rule, evidence);
  });
}

function buildDomainPortrait(rule, evidence) {
  const copy = domainCopy[rule.key] ?? {};
  const combinations = evidence.matchedCombinations ?? [];
  const confidence = evidence.confidence ?? "low";
  const keywords = buildDomainKeywords(rule, combinations);
  const evidenceTexts = evidence.matchedSignals.map((signal) => signal.text || `${signal.source}：${signal.label}`).slice(0, 8);
  const condition = unique([
    ...evidence.matchedRules,
    ...combinations.map((item) => item.evidenceText),
    confidence === "low" ? rule.weakEvidenceText : "",
  ]).slice(0, 8);
  const counterEvidence = unique([
    ...combinations.map((item) => item.pressure),
    confidence === "low" ? "这一项在原局不是主线，阶段运势不引动时表现会收敛。" : "",
    "若现实经历与命盘取象不贴合，优先回到柱位、十神强弱和岁运触发复核。",
  ]).slice(0, 6);
  const frontText = buildDomainFrontText(rule.key, evidence, rule);

  return {
    key: rule.key,
    label: rule.label,
    title: buildDomainHumanTitle(rule.key, evidence),
    judgement: frontText.judgement,
    manifestation: frontText.manifestation,
    pressure: combinations.map((item) => item.pressure).filter(Boolean).join(" ") || rule.pressureImages.join("、"),
    keywords,
    tags: keywords,
    evidence: evidenceTexts.length ? evidenceTexts : [rule.defaultJudgement],
    matchedCombinations: combinations.map((item) => ({
      id: item.id,
      label: item.label,
      judgement: item.judgement,
      manifestation: item.manifestation,
      pressure: item.pressure,
      evidenceText: item.evidenceText,
      keywords: item.keywords ?? [],
    })),
    condition,
    bookExplanation: buildBookExplanation(rule),
    counterEvidence,
    confidence,
    score: evidence.score,
  };
}

function buildDomainHumanTitle(domainKey, evidence = {}) {
  const override = findDomainFrontOverride(domainKey, evidence);
  const copy = domainCopy[domainKey] ?? {};
  return cleanFrontText(override?.title || copy.title || "这一项要看后天引动后的表现");
}

function buildDomainKeywords(rule = {}, combinations = []) {
  return unique([
    ...(domainCoreKeywords[rule.key] ?? []),
    ...rule.positiveImages,
    ...rule.pressureImages,
    ...combinations.flatMap((item) => item.keywords ?? []),
  ]).slice(0, 5);
}

function buildDomainFrontText(domainKey, evidence = {}, rule = {}) {
  const copy = domainCopy[domainKey] ?? {};
  const override = findDomainFrontOverride(domainKey, evidence);
  const confidence = evidence.confidence ?? "low";
  const lowText = copy.low || rule.weakEvidenceText || "这一项不是原局最突出的主线，更多要等大运流年引动后才会明显。";
  const judgement = confidence === "low"
    ? lowText
    : (override?.judgement || copy.judgement || rule.defaultJudgement || lowText);
  const manifestation = confidence === "low"
    ? "阶段环境和岁运触发到位时，这个方面才更容易显出来。"
    : (override?.manifestation || copy.manifestation || rule.weakEvidenceText || "");

  return {
    judgement: limitSentences(cleanFrontText(judgement), 2),
    manifestation: limitSentences(cleanFrontText(manifestation), 2),
  };
}

function findDomainFrontOverride(domainKey, evidence = {}) {
  for (const combination of evidence.matchedCombinations ?? []) {
    const copy = domainFrontOverrides[combination.id]?.[domainKey];
    if (copy) return copy;
  }
  return null;
}

function buildBookExplanation(rule) {
  return `${rule.label}主要参考${unique([
    ...rule.primarySignals,
    ...rule.secondarySignals.slice(0, 4),
    ...rule.relatedPillars,
  ]).slice(0, 9).join("、")}。${rule.defaultJudgement}`;
}

function cleanFrontText(text = "") {
  return String(text)
    .replace(/现实中可观察/g, "容易体现为")
    .replace(/需观察/g, "可落到")
    .replace(/需要观察/g, "可落到")
    .replace(/需复核/g, "可回到证据层复核")
    .replace(/需要复核/g, "可回到证据层复核")
    .replace(/待查/g, "证据较轻")
    .replace(/不宜直接/g, "不能只凭单象")
    .replace(/先看/g, "重点落在")
    .replace(/再看/g, "并参考")
    .replace(/需要结合/g, "还要参考")
    .replace(/资料取象中/g, "证据层中")
    .replace(/成立条件/g, "落地条件")
    .replace(/反证方式/g, "收敛边界")
    .replace(/命中来源/g, "来源")
    .replace(/命中依据/g, "依据")
    .trim();
}

function limitSentences(text = "", max = 2) {
  const normalized = String(text).replace(/\s+/g, " ").trim();
  if (!normalized) return "";
  const parts = normalized.match(/[^。！？!?]+[。！？!?]?/g) ?? [normalized];
  return parts.slice(0, max).join("").trim();
}

function joinText(...parts) {
  return parts
    .filter((part) => part !== undefined && part !== null && String(part).trim())
    .map((part) => String(part).trim())
    .join(" ");
}

function unique(items = []) {
  return [...new Set((Array.isArray(items) ? items : [items])
    .flat()
    .filter((item) => item !== undefined && item !== null && String(item).trim())
    .map((item) => String(item).trim()))];
}
