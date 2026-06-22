import {
  natalProfessionalControlRules,
} from "./professionalControlRuleDatabase.js";

export const NATAL_PROFESSIONAL_PATTERN_RULE_VERSION =
  "natal-professional-pattern-rule-v1";

const professionalRuleSchool = [
  "blind_school",
  "project_structured_v2",
];

const professionalSourceRefs = {
  yangHostGuest: {
    sourceId:
      "yang_qingjuan_advanced",

    title:
      "杨清娟盲派八字高级班笔记",

    locator:
      "第六章 宾主理论及宫位，第44页起",

    principle:
      "年月宾位、日时主位及宫位观察框架",
  },

  yangWorkForms: {
    sourceId:
      "yang_qingjuan_advanced",

    title:
      "杨清娟盲派八字高级班笔记",

    locator:
      "第七章 八字制用的表现形式，第50—60页",

    principle:
      "制用、化用、生用、泄用、合用、墓用及复合结构",
  },

  cuiMethodOrder: {
    sourceId:
      "cui_wenju_notes_5000",

    title:
      "崔文举盲派八字笔记",

    locator:
      "看命顺序",

    principle:
      "区分财官归属，并观察体通过合、生、克等关系取得财官",
  },

  cuiOfficialResource: {
    sourceId:
      "cui_wenju_notes_5000",

    title:
      "崔文举盲派八字笔记",

    locator:
      "官印相生1",

    principle:
      "官生印、印生身及财坏印、食伤扰官等破坏条件",
  },

  cuiOutputWealth: {
    sourceId:
      "cui_wenju_notes_5000",

    title:
      "崔文举盲派八字笔记",

    locator:
      "发财命、老板命",

    principle:
      "食伤生财需结合日主承载、印星干扰和财富量判断",
  },

  cuiBalance: {
    sourceId:
      "cui_wenju_notes_5000",

    title:
      "崔文举盲派八字笔记",

    locator:
      "用忌神与通关",

    principle:
      "印多、比劫多、食伤多等结构需结合泄化、制约和通关判断",
  },
};

export const natalProfessionalPatternRules = [
  ...natalProfessionalControlRules,
  {
    id: "professional_resource_peer_dominance",
    semanticGroup: "resource_peer_dominance",
    title: "印比成势",
    role: "core",
    baseStatus: "confirmed",
    importance: "high",
    baseConfidence: "high",
    priority: 96,

    school:
      professionalRuleSchool,

    sourceRefs: [
      professionalSourceRefs
        .cuiBalance,
      professionalSourceRefs
        .yangWorkForms,
    ],

    masterNarrative: {
      lifePattern:
        "人生发展更偏向先吸收、先建立判断体系，再把专业经验和责任能力逐步转化为现实位置。",

      conclusion:
        "真正的发展关键不在继续增加内部准备，而在于建立稳定输出、持续行动和可验证成果。",
    },

    domains: [
      "self",
      "career",
      "parents",
      "siblings",
      "fortune",
    ],

    thresholds: {
      resourceMin: 1.4,
      peerMin: 1.4,
      confirmedResourceMin: 1.8,
      confirmedPeerMin: 1.8,
    },

    semantic: {
      formation:
        "日主偏强，同时印星与比劫均形成较明确力量，命局的内部承载、学习吸收和自我系统成为全局主轴。",

      meaning:
        "命主依靠理解能力、专业积累、规则意识和个人判断建立稳定性。",

      manifestations: [
        "遇到重要问题时倾向于先理解、验证和形成自己的判断。",
        "重视依据、秩序和确定性，不容易在没有准备时仓促行动。",
      ],

      strengths: [
        "学习吸收、持续积累、专业判断和承受复杂信息的能力较强。",
      ],

      risks: [
        "印比过重而缺少有效泄化时，容易准备多、标准高、行动显化偏慢。",
      ],

      boundary:
        "印比成势不等同于富贵结论，最终层次仍取决于是否形成有效输出、制化和现实做功。",
    },

    domainNarratives: {
      self: {
        overview:
          "印比成为原局主轴，命主依靠理解、判断、规则和个人标准建立内在稳定。",

        manifestation:
          "做事通常先观察和确认，再按自己的逻辑推进，不喜欢在依据不足时贸然决定。",

        strength:
          "学习能力、专业积累、责任意识和独立判断较有优势。",

        caution:
          "标准过高或长期停留在内部准备阶段时，容易形成反复思考和行动迟缓。",
      },

      career: {
        overview:
          "事业更适合依靠专业、资质、知识体系、判断能力和长期积累形成位置。",

        manifestation:
          "比起短期投机，更适合在需要分析、规则、技术、管理或专业判断的环境中发展。",

        strength:
          "能够持续吸收复杂知识，并逐步建立自己的方法和专业壁垒。",

        caution:
          "若缺少现实输出通道，容易能力储备较多，但成绩显化和职位兑现偏慢。",
      },

      parents: {
        overview:
          "印星进入主结构，家庭教育、长辈观念和早年规则对个人影响较深。",

        manifestation:
          "容易从家庭获得方法、经验或现实支持，同时也较容易承受期待和规范。",

        strength:
          "早年形成的学习能力、责任感和规则意识可成为长期资源。",

        caution:
          "过度依赖已有经验或长辈尺度时，可能限制个人主动试错。",
      },

      siblings: {
        overview:
          "比劫进入主结构，同辈互动、合作竞争和资源边界较为重要。",

        manifestation:
          "既重视同辈之间的理解与合作，也容易产生比较、竞争和彼此坚持。",

        strength:
          "在团队中有独立立场，也能够承担责任。",

        caution:
          "权责和资源分配不清时，容易因立场相近而互不相让。",
      },

      fortune: {
        overview:
          "内在安全感主要来自理解、掌控、规则和形成确定判断。",

        manifestation:
          "遇到压力时容易先在内部分析和消化，而不是立即向外释放。",

        strength:
          "能够通过学习和理解逐步恢复秩序感。",

        caution:
          "长期缺少行动出口时，容易把思考转化为精神负担。",
      },
    },
  },

  {
    id: "professional_resource_output_imbalance",
    semanticGroup: "resource_output_imbalance",
    title: "印重泄秀受限",
    role: "tension",
    baseStatus: "conditional",
    importance: "high",
    baseConfidence: "medium",
    priority: 88,

    school:
      professionalRuleSchool,

    replacementPolicy:
      "authoritative_refinement",

    sourceRefs: [
      professionalSourceRefs
        .cuiBalance,
    ],

    masterNarrative: {
      lifePattern:
        "人生优势来自学习、理解和体系化积累，但能否打开局面，取决于是否能把内部能力持续转化为表达、作品和现实交付。",

      conclusion:
        "减少过度准备和反复修改，建立固定输出节奏，比继续增加知识储备更重要。",
    },

    replacesRuleIds: [
      "resource_heavy_output_weak",
    ],

    domains: [
      "self",
      "career",
      "children",
      "fortune",
    ],

    thresholds: {
      resourceMin: 1.5,
      outputMax: 0.9,
      confirmedResourceMin: 2,
      confirmedOutputMax: 0.7,
    },

    semantic: {
      formation:
        "印星力量明显高于食伤，吸收、理解和内部准备强于表达、展示与成果释放。",

      meaning:
        "命主并非没有能力，而是容易出现内部积累快于外部显化的结构差异。",

      manifestations: [
        "理解和准备较充分，但表达、展示、交付和成果转换可能偏慢。",
        "容易等到自己认为足够完善后才愿意公开输出。",
      ],

      strengths: [
        "思考较深入，能够形成体系化认识。",
      ],

      risks: [
        "容易想得多、修改多，错过及时表达和现实推进。",
      ],

      boundary:
        "若食伤在主位有根或得到后续阶段扶持，输出不足可以明显改善，因此不能直接判断终身表达能力差。",
    },

    domainNarratives: {
      self: {
        overview:
          "原局吸收和内部准备强于外部表达，容易形成想得深、说得慢、行动需要充分确认的特点。",

        manifestation:
          "面对重要任务时会投入较多时间理解、整理和修正，不容易草率交付。",

        strength:
          "适合处理需要深入学习、分析和长期积累的问题。",

        caution:
          "过度追求完善时，容易把准备变成拖延。",
      },

      career: {
        overview:
          "事业能力更容易先体现在学习、判断和专业积累上，成果展示与现实兑现需要主动训练。",

        manifestation:
          "容易在幕后分析、方案、技术或专业支持环节表现较好，但公开表达和快速交付需要加强。",

        strength:
          "能够建立较扎实的知识体系和专业方法。",

        caution:
          "只积累而不持续输出时，实际成绩可能落后于真实能力。",
      },

      children: {
        overview:
          "食伤出口偏弱，子女、作品、项目和成果需要通过持续投入才能显化。",

        manifestation:
          "对子女或作品容易投入较多思考和要求，但结果形成通常需要时间。",

        strength:
          "对成果质量有要求，愿意长期完善。",

        caution:
          "标准过高时容易增加自己和晚辈的压力。",
      },

      fortune: {
        overview:
          "思想和情绪容易先在内部消化，外部释放速度相对较慢。",

        manifestation:
          "压力较大时可能反复分析问题，而不是立即表达需求。",

        strength:
          "具备深入反思和自我整理能力。",

        caution:
          "缺少稳定表达、运动或行动出口时，内在负担容易累积。",
      },
    },
  },

  {
    id: "professional_peer_wealth_pressure",
    semanticGroup: "peer_wealth_pressure",
    title: "比劫分财压力",
    role: "tension",
    baseStatus: "conditional",
    importance: "high",
    baseConfidence: "medium",
    priority: 86,

    school:
      professionalRuleSchool,

    replacementPolicy:
      "authoritative_refinement",

    sourceRefs: [
      professionalSourceRefs
        .cuiMethodOrder,
      professionalSourceRefs
        .yangWorkForms,
    ],

    masterNarrative: {
      lifePattern:
        "现实机会常与同辈、团队和合作关系相连，但发展是否稳定，取决于资源边界、分工和收益规则是否清楚。",

      conclusion:
        "合作可以扩大机会，但账目、权责和退出机制必须提前明确。",
    },

    replacesRuleIds: [
      "peer_wealth_competition",
    ],

    domains: [
      "wealth",
      "siblings",
      "friends",
      "self",
    ],

    thresholds: {
      peerMin: 1.2,
      wealthMin: 0.3,
      confirmedPeerMin: 1.6,
      weakWealthMax: 0.8,
    },

    semantic: {
      formation:
        "比劫力量明显，而财星力量相对有限，合作、竞争与资源分配之间容易形成压力。",

      meaning:
        "财富机会往往伴随合作、同辈、团队和分配问题，关键不只是取得资源，也包括如何守住和安排资源。",

      manifestations: [
        "容易因为合作、朋友、同辈或共同项目接触财富机会。",
        "利益边界不清时，收入可能被分流，或因人情和合作增加支出。",
      ],

      strengths: [
        "能够借助团队、圈层和共同项目获得机会。",
      ],

      risks: [
        "分工、权责和利益比例不清时，容易出现付出与收益不匹配。",
      ],

      boundary:
        "若官杀能够约束比劫，或财星自身有根有力，分财压力会明显减轻。",
    },

    domainNarratives: {
      wealth: {
        overview:
          "财富结构中合作机会与分配压力并存，得财和守财需要同时考虑。",

        manifestation:
          "容易通过团队、同辈、人脉或共同项目取得机会，但必须提前明确成本、权责和收益比例。",

        strength:
          "适合利用合作和圈层扩大资源入口。",

        caution:
          "不宜因为人情、信任或口头承诺忽略合同、账目和利益边界。",
      },

      siblings: {
        overview:
          "同辈关系中既有合作空间，也容易涉及资源比较和利益分配。",

        manifestation:
          "共同做事时需要把责任和收益讲清楚，否则容易因立场相近而争执。",

        strength:
          "能够与能力相近的人共同推进事情。",

        caution:
          "利益边界模糊时，关系容易受到现实问题影响。",
      },

      friends: {
        overview:
          "朋友和合作关系能够带来机会，但资源往来必须保持清楚。",

        manifestation:
          "容易在圈层和人脉中获得信息与项目，也容易承担额外成本。",

        strength:
          "社交合作可以扩大现实机会。",

        caution:
          "借贷、担保、共同投资和模糊分账需要谨慎。",
      },

      self: {
        overview:
          "个人主见和资源意识较强，遇到利益问题时容易坚持自己的判断。",

        manifestation:
          "合作中既希望保持公平，也不愿失去自主权。",

        strength:
          "具备维护自身利益和承担责任的意识。",

        caution:
          "过度坚持自己的分配标准时，也可能降低合作效率。",
      },
    },
  },

  {
    id: "professional_output_wealth_work_chain",
    semanticGroup: "output_wealth_work_chain",
    title: "食伤生财做功候选",
    role: "core",
    baseStatus: "conditional",
    importance: "high",
    baseConfidence: "medium",
    priority: 92,

    school:
      professionalRuleSchool,

    replacementPolicy:
      "authoritative_refinement",

    sourceRefs: [
      professionalSourceRefs
        .cuiOutputWealth,
      professionalSourceRefs
        .yangWorkForms,
    ],

    masterNarrative: {
      lifePattern:
        "人生价值更适合通过技能、作品、项目和实际交付转化为现实收益，但只有结构链真正连接并持续运转时，才算形成稳定做功。",

      conclusion:
        "应优先建立能够重复交付的成果通道，而不是只停留在能力和设想层面。",
    },

    replacesRuleIds: [
      "output_wealth_chain",
    ],

    domains: [
      "career",
      "wealth",
      "children",
    ],

    thresholds: {
      outputMin: 0.5,
      wealthMin: 0.3,
      confirmedOutputMin: 0.9,
      confirmedWealthMin: 0.5,
    },

    semantic: {
      formation:
        "食伤与财星均有落点，若输出端稳定且未被明显牵制，可形成能力、项目和成果向现实收益转换的通道。",

      meaning:
        "命主可以通过技术、表达、作品、项目或实际交付获得收益。",

      manifestations: [
        "收入更适合建立在可见成果、专业交付和实际解决问题的能力上。",
      ],

      strengths: [
        "能够把知识、技能和项目成果逐步转化为现实价值。",
      ],

      risks: [
        "若食伤过弱、受制或缺乏持续输出，财星虽有落点，也难形成稳定变现。",
      ],

      boundary:
        "食伤与财星同时存在不等于完整做功成立，还要检查根气、主宾位置和受制情况。",
    },

    domainNarratives: {
      career: {
        overview:
          "事业存在由能力和成果通向现实收益的做功候选。",

        manifestation:
          "适合通过技术、作品、项目、方案或解决实际问题建立职业价值。",

        strength:
          "持续输出能够直接推动事业和收入。",

        caution:
          "只学习不交付，或成果无法稳定复制时，做功链难以真正落地。",
      },

      wealth: {
        overview:
          "财富更适合来自技能、成果、项目和实际交付，而不是只依赖固定资源。",

        manifestation:
          "收入增长与输出质量、项目完成度和市场承接能力密切相关。",

        strength:
          "具备以能力换取收益的路径。",

        caution:
          "输出不稳定时，收入也容易随项目和环境波动。",
      },

      children: {
        overview:
          "子女、作品和项目成果可以成为现实价值的重要出口。",

        manifestation:
          "对作品、项目或晚辈投入的培养，可能逐步形成可见成果。",

        strength:
          "成果具有继续扩大和转化的可能。",

        caution:
          "需要避免只重视设想而忽略持续完成。",
      },
    },
  },

  {
    id: "professional_official_resource_work_chain",
    semanticGroup: "official_resource_work_chain",
    title: "官印承接做功候选",
    role: "support",
    baseStatus: "conditional",
    importance: "high",
    baseConfidence: "medium",
    priority: 90,

    school:
      professionalRuleSchool,

    replacementPolicy:
      "authoritative_refinement",

    sourceRefs: [
      professionalSourceRefs
        .cuiOfficialResource,
      professionalSourceRefs
        .yangWorkForms,
    ],

    masterNarrative: {
      lifePattern:
        "人生更容易通过规则平台、责任承担、专业资质和学习承接建立社会位置，但官印是否真正流通，需要结合做功链与破坏条件判断。",

      conclusion:
        "适合在规则明确、专业门槛清楚的环境中积累信用与位置，同时避免只重资质而缺少实际成果。",
    },

    replacesRuleIds: [
      "official_resource_support",
    ],

    domains: [
      "career",
      "self",
      "parents",
    ],

    thresholds: {
      officerMin: 0.3,
      resourceMin: 0.5,
      confirmedOfficerMin: 0.7,
      confirmedResourceMin: 0.7,
    },

    semantic: {
      formation:
        "官杀与印星均有落点，若官杀有根、印星能够承接，可形成责任、规则、资质和专业能力之间的做功关系。",

      meaning:
        "命主可以通过制度平台、责任承担、专业资质和学习能力获得社会位置。",

      manifestations: [
        "更适合在有规则、有责任、有专业门槛的环境中逐步建立位置。",
      ],

      strengths: [
        "能够把压力转化为学习、资质和专业能力。",
      ],

      risks: [
        "官杀太弱或藏而不显时，社会位置需要后天平台和后续阶段推动。",
      ],

      boundary:
        "官印同时出现只是候选，仍需检查官杀根气、印星承接和日主负担。",
    },

    domainNarratives: {
      career: {
        overview:
          "事业存在通过规则、责任、资质和专业承接形成位置的候选路径。",

        manifestation:
          "适合进入需要专业门槛、制度规则、资格认证或责任管理的工作环境。",

        strength:
          "能够通过学习和承担责任逐步提升职业位置。",

        caution:
          "官星偏弱或只藏不透时，职位兑现通常需要平台和时间推动。",
      },

      self: {
        overview:
          "面对规则和压力时，倾向于通过学习、理解和提升能力进行承接。",

        manifestation:
          "遇到要求时更愿意先掌握方法，再按规范完成。",

        strength:
          "具有将压力转化为能力和责任感的潜力。",

        caution:
          "过度重视标准时，容易增加自我要求。",
      },

      parents: {
        overview:
          "家庭规则、教育方式和长辈经验容易影响个人对责任与社会位置的理解。",

        manifestation:
          "早年获得的教育和规则意识，可能成为后期职业发展的基础。",

        strength:
          "长辈经验和学习资源能够提供承接。",

        caution:
          "若家庭期待较高，也容易形成长期自我压力。",
      },
    },
  },

  {
    id: "professional_spouse_palace_tension_stack",
    semanticGroup: "spouse_palace_tension_stack",
    title: "夫妻宫多重关系牵动",
    role: "tension",
    baseStatus: "confirmed",
    importance: "high",
    baseConfidence: "high",
    priority: 94,

    school:
      professionalRuleSchool,

    replacementPolicy:
      "authoritative_refinement",

    sourceRefs: [
      professionalSourceRefs
        .yangHostGuest,
    ],

    masterNarrative: {
      lifePattern:
        "关系中的重复课题容易反馈到个人状态，真正的成长来自把沟通、边界和现实责任逐步说清。",

      conclusion:
        "感情不宜靠反复猜测维持，应把节奏、责任和真实需求落实到具体安排。",
    },

    replacesRuleIds: [
      "spouse_palace_relation_tension",
    ],

    domains: [
      "spouse",
      "self",
    ],

    thresholds: {
      minimumTensionCount: 1,
    },

    semantic: {
      formation:
        "夫妻宫同时参与刑、冲、害、破或自刑关系，亲密关系宫位受到明确牵动。",

      meaning:
        "感情中的内部感受、现实节奏和相处方式容易反复触发同类问题。",

      manifestations: [
        "关系中容易出现重复确认、内部较劲、节奏差异或现实安排反复。",
      ],

      strengths: [
        "经历磨合后，能够更清楚地认识自身关系需求和边界。",
      ],

      risks: [
        "问题长期不说清楚时，同类矛盾容易重复发生。",
      ],

      boundary:
        "夫妻宫受牵动不等于婚姻结果已经确定，仍要结合配偶星状态、关系中的制化与后续阶段触发。",
    },

    domainNarratives: {
      spouse: {
        overview:
          "夫妻宫受到具体刑、冲、害、破类关系牵动，感情模式具有较明显的重复和调整特征。",

        manifestation:
          "相处中容易反复确认对方态度，也可能因生活节奏、责任安排或表达方式出现内部较劲。",

        strength:
          "经过清楚沟通和现实磨合后，关系边界可以逐步稳定。",

        caution:
          "回避问题或只坚持自身尺度时，同类矛盾容易重复出现。",
      },

      self: {
        overview:
          "夫妻宫关系会反馈到个人情绪、判断和自我要求。",

        manifestation:
          "关系中的不确定感容易引发反复思考和自我确认。",

        strength:
          "能够通过关系经验逐步认识自己的真实需求。",

        caution:
          "不宜把所有关系压力长期留在内部消化。",
      },
    },
  },

  {
    id: "professional_spouse_star_guest_position",
    semanticGroup: "spouse_star_guest_position",
    title: "配偶星落宾位",
    role: "conditional",
    baseStatus: "conditional",
    importance: "medium",
    baseConfidence: "medium",
    priority: 74,

    school:
      professionalRuleSchool,

    sourceRefs: [
      professionalSourceRefs
        .yangHostGuest,
      professionalSourceRefs
        .cuiMethodOrder,
    ],

    masterNarrative: {
      lifePattern:
        "感情缘分更容易与外部环境、现实条件和社会圈层相连，关系推进需要同时看情感互动与现实承接。",

      conclusion:
        "感情判断应同时复核配偶星位置、夫妻宫牵动和现实条件，不宜只凭宾位直接下结论。",
    },

    domains: [
      "spouse",
      "movement",
    ],

    thresholds: {},

    semantic: {
      formation:
        "配偶星主要落在年月宾位，与外部环境、家庭背景、社会圈层或异地因素联系较多。",

      meaning:
        "感情缘分和现实关系更容易受到外部环境及现实条件影响。",

      manifestations: [
        "对象来源可能与工作、学习、社会圈层、家庭介绍或异地环境有关。",
      ],

      strengths: [
        "外部平台和社会环境能够扩大关系机会。",
      ],

      risks: [
        "现实条件、距离或家庭背景可能影响关系推进速度。",
      ],

      boundary:
        "宾位只表示结构位置，不直接等同于异地婚姻或配偶来自外地。",
    },

    domainNarratives: {
      spouse: {
        overview:
          "配偶星主要落宾位，感情更容易与外部环境、现实条件和社会圈层发生联系。",

        manifestation:
          "关系建立往往需要先经过现实接触和条件确认，不容易只凭情绪迅速定型。",

        strength:
          "工作、学习和社会活动能够扩大关系机会。",

        caution:
          "距离、家庭背景或现实安排可能影响关系推进。",
      },

      movement: {
        overview:
          "感情缘分与外部环境、工作学习圈层或居住变化存在某种联系。",

        manifestation:
          "环境转换可能增加认识对象或调整关系状态的机会。",

        strength:
          "进入新的圈层有利于扩大关系选择。",

        caution:
          "不能仅凭配偶星落宾位就判断异地发展。",
      },
    },
  },

  {
    id: "professional_output_anchor_in_host",
    semanticGroup: "output_anchor_in_host",
    title: "食伤落主位",
    role: "support",
    baseStatus: "confirmed",
    importance: "medium",
    baseConfidence: "high",
    priority: 78,

    school:
      professionalRuleSchool,

    sourceRefs: [
      professionalSourceRefs
        .yangHostGuest,
      professionalSourceRefs
        .yangWorkForms,
    ],

    masterNarrative: {
      lifePattern:
        "后期发展更需要通过主位输出、作品项目和持续交付打开，行动出口越稳定，内部能力越容易显化。",

      conclusion:
        "应把表达、项目和实际完成度作为复核重点，避免长期只停留在准备和设想。",
    },

    domains: [
      "career",
      "children",
      "fortune",
    ],

    thresholds: {
      outputMin: 0.25,
    },

    semantic: {
      formation:
        "食神或伤官在日时主位有实际落点，命主仍保留表达、成果、项目和后期发展的出口。",

      meaning:
        "即使整体食伤不旺，也并非完全没有输出能力，后天训练和现实环境可以激活出口。",

      manifestations: [
        "越到需要实际完成项目、作品或承担结果时，输出能力越容易被推动出来。",
      ],

      strengths: [
        "具备通过持续训练形成成果的基础。",
      ],

      risks: [
        "出口偏弱时，需要主动建立表达和交付习惯。",
      ],

      boundary:
        "食伤落主位只说明有出口，能否形成高水平成果仍取决于力量、根气和做功。",
    },

    domainNarratives: {
      career: {
        overview:
          "食伤在主位有落点，职业能力仍有转化为成果和实际交付的出口。",

        manifestation:
          "通过项目、作品、技术实践和持续训练，能力能够逐步显化。",

        strength:
          "后期成果和实际交付具有成长空间。",

        caution:
          "需要避免长期只做准备而不建立稳定输出节奏。",
      },

      children: {
        overview:
          "食伤落在主位，子女、作品、项目和后期成果具有现实承接位置。",

        manifestation:
          "对晚辈或成果的投入，往往需要时间才能看到稳定结果。",

        strength:
          "具备持续培养和完成成果的能力。",

        caution:
          "成果形成速度可能慢于内部预期。",
      },

      fortune: {
        overview:
          "思想和情绪并非完全没有出口，行动、表达和成果能够帮助释放内部压力。",

        manifestation:
          "实际做事比持续停留在思考中更有利于恢复精神状态。",

        strength:
          "可以通过创造、表达和完成任务获得满足。",

        caution:
          "出口长期不用时，内部思虑仍容易累积。",
      },
    },
  },
];
