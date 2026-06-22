const controlRuleSchool = [
  "blind_school",
  "project_structured_v2",
];

const controlSourceRefs = {
  foodControlsKill: {
    sourceId:
      "cui_wenju_notes_5000",

    title:
      "崔文举盲派八字笔记",

    locator:
      "食神制杀1",

    principle:
      "食神与七杀须形成有效制伏；杀重食轻需比劫扶食，杀轻食重可由财星滋杀。",
  },

  sevenKillConfiguration: {
    sourceId:
      "cui_wenju_notes_5000",

    title:
      "崔文举盲派八字笔记",

    locator:
      "论杀、十神配置",

    principle:
      "七杀可配食神制，也可配印化；制与化并见时需要区分主要路线。",
  },

  killResourceTransform: {
    sourceId:
      "cui_wenju_notes_5000",

    title:
      "崔文举盲派八字笔记",

    locator:
      "官印相生2、官杀印相生",

    principle:
      "七杀通过印星承接并转化到日主，需观察杀印力量、根气和结构纯度。",
  },

  yangControlForms: {
    sourceId:
      "yang_qingjuan_advanced",

    title:
      "杨清娟盲派八字高级班笔记",

    locator:
      "第七章 八字制用的表现形式，第50—60页",

    principle:
      "制用、化用和复合结构必须检查真实作用路径、宾主及功用关系。",
  },
};

export const natalProfessionalControlRules = [
  {
    id:
      "professional_food_controls_kill",

    semanticGroup:
      "food_controls_kill",

    title:
      "食神制杀",

    role:
      "core",

    baseStatus:
      "conditional",

    importance:
      "high",

    baseConfidence:
      "medium",

    priority:
      95,

    school:
      controlRuleSchool,

    replacementPolicy:
      "ranked",

    sourceRefs: [
      controlSourceRefs
        .foodControlsKill,

      controlSourceRefs
        .sevenKillConfiguration,

      controlSourceRefs
        .yangControlForms,
    ],

    domains: [
      "career",
      "self",
      "fortune",
    ],

    thresholds: {
      foodMin:
        0.4,

      killMin:
        0.4,

      supportedFoodMin:
        0.8,

      supportedKillMin:
        0.8,

      killHeavyRatio:
        1.8,

      foodHeavyRatio:
        0.56,

      peerSupportMin:
        0.8,

      wealthSupportMin:
        0.5,

      transformResourceMin:
        0.7,
    },

    masterNarrative: {
      lifePattern:
        "人生容易面对压力、竞争或高要求环境，真正的优势在于能否用技术、方法、作品和解决问题的能力驾驭压力。",

      conclusion:
        "面对压力时应建立可以重复验证的方法和成果，而不是只依靠硬扛、冲动对抗或临时发挥。",
    },

    semantic: {
      formation:
        "食神与七杀同时有力，并形成食神制约七杀的明确方向；还需检查双方轻重、辅助力量及是否同时走印化路线。",

      meaning:
        "命主可以通过技术、方法、专业能力和实际解决问题的能力承接外部压力与竞争。",

      manifestations: [
        "面对难题和强要求时，更适合依靠方法、技术和实际成果取得主动。",
        "压力越明确，越容易推动命主形成专业能力和解决方案。",
      ],

      strengths: [
        "具备把压力转化为技术、执行力和专业成果的潜力。",
      ],

      risks: [
        "杀重食轻时容易压力超过处理能力；食重杀轻时也可能出现用力过度、目标不足。",
      ],

      boundary:
        "食神与七杀并见不等于食神制杀成立；制杀是否完整取决于真实路径、力量平衡、辅助条件和制化主次。",
    },

    domainNarratives: {
      career: {
        overview:
          "事业结构中存在以技术、方法和解决问题能力承接压力与责任的路径。",

        manifestation:
          "更适合面对明确任务、复杂问题、专业门槛和结果要求，通过能力取得位置。",

        strength:
          "能够在压力环境中逐步形成技术壁垒、执行方法和实际成果。",

        caution:
          "压力与能力不平衡时，容易出现任务过重、方向反复或长期消耗。",
      },

      self: {
        overview:
          "个人容易在外部要求和现实压力中形成较强的问题处理意识。",

        manifestation:
          "遇到强势环境时，不宜只正面硬碰，更适合用方法、证据和实际结果取得主动。",

        strength:
          "面对难题时具有研究办法、寻找突破口和解决问题的潜力。",

        caution:
          "食神不足时容易承压过多；食神过强而目标太弱时，也容易失去着力点。",
      },

      fortune: {
        overview:
          "内在稳定感来自能够理解压力、找到方法并实际解决问题。",

        manifestation:
          "事情越混乱，越需要把问题拆解成明确步骤，而不是持续焦虑或正面冲撞。",

        strength:
          "完成困难任务能够带来较明显的掌控感和成就感。",

        caution:
          "长期处在高压而缺少技术出口的环境中，精神负担容易累积。",
      },
    },
  },

  {
    id:
      "professional_kill_resource_transform",

    semanticGroup:
      "official_resource_work_chain",

    title:
      "杀印相生",

    role:
      "core",

    baseStatus:
      "conditional",

    importance:
      "high",

    baseConfidence:
      "medium",

    priority:
      94,

    school:
      controlRuleSchool,

    replacementPolicy:
      "ranked",

    sourceRefs: [
      controlSourceRefs
        .killResourceTransform,

      controlSourceRefs
        .sevenKillConfiguration,

      controlSourceRefs
        .yangControlForms,
    ],

    domains: [
      "career",
      "self",
      "parents",
    ],

    thresholds: {
      killMin:
        0.4,

      resourceMin:
        0.5,

      supportedKillMin:
        0.8,

      supportedResourceMin:
        0.8,

      controlFoodMin:
        0.7,
    },

    masterNarrative: {
      lifePattern:
        "人生更容易在压力、责任和规则环境中，通过学习、资质、经验和专业承接逐步建立位置。",

      conclusion:
        "真正的关键是把外部压力转化为稳定能力、专业信用和现实成果，而不是只增加身份、证书或内部准备。",
    },

    semantic: {
      formation:
        "七杀与印星形成明确的生成承接路径，七杀之压力通过印星转化为学习、资格、责任和专业能力。",

      meaning:
        "命主可以通过制度、学习、专业积累和责任承接，把外部压力转化为自身能力与社会位置。",

      manifestations: [
        "面对责任和高标准环境时，倾向于通过学习规则、掌握方法和提升能力进行承接。",
        "压力往往推动命主建立专业体系、信用和责任意识。",
      ],

      strengths: [
        "具备把压力转化为学习能力、专业资质和组织承接能力的潜力。",
      ],

      risks: [
        "杀重印轻时承接不足；印重杀轻时容易准备较多，但外部职责和位置兑现不足。",
      ],

      boundary:
        "七杀与印星同时存在不等于杀印相生成立；还需检查真实生成路径、根气、力量、官杀混杂以及是否同时受到食神制杀。",
    },

    domainNarratives: {
      career: {
        overview:
          "事业存在通过责任、规则、学习和专业承接建立社会位置的结构路径。",

        manifestation:
          "适合在职责清晰、专业门槛明确、需要长期信用和学习能力的环境中发展。",

        strength:
          "能够把工作压力逐步转化为经验、资格、专业能力和组织信任。",

        caution:
          "只有压力而缺少印星承接时容易负担过重；只有学习和资质而职责不足时，也难形成现实位置。",
      },

      self: {
        overview:
          "面对压力时更倾向于通过理解规则、学习方法和提升能力进行消化。",

        manifestation:
          "越是重要的任务，越会先掌握标准、建立方法，再逐步承担责任。",

        strength:
          "具备将外部要求转化为个人能力和责任感的潜力。",

        caution:
          "过度依靠规则和准备时，容易增加自我要求并降低行动灵活性。",
      },

      parents: {
        overview:
          "家庭教育、长辈要求和早年规则容易成为个人承接责任的重要来源。",

        manifestation:
          "长辈经验、教育资源或家庭规范可能推动命主形成专业能力和责任意识。",

        strength:
          "早年形成的学习习惯与规则意识可以成为长期资源。",

        caution:
          "家庭期待过高时，也容易把外部压力长期内化为自我要求。",
      },
    },
  },
];