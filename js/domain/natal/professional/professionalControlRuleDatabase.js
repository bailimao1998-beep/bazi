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
    hurtOfficerResource: {
    sourceId:
      "cui_wenju_notes_5000",

    title:
      "崔文举盲派八字笔记",

    locator:
      "伤官配印格例子",

    principle:
      "伤官对官星产生不利作用时，可由正印制约伤官并保护官星；印星本身不能再受财星严重破坏。",
  },

  hurtOfficerOfficial: {
    sourceId:
      "cui_wenju_notes_5000",

    title:
      "崔文举盲派八字笔记",

    locator:
      "伤官制官、伤官见官",

    principle:
      "伤官与正官并见需检查是否形成真实制克，以及是否存在印制伤官或伤官生财转官的缓解路线。",
  },

  wealthBreakResource: {
    sourceId:
      "cui_wenju_notes_5000",

    title:
      "崔文举盲派八字笔记",

    locator:
      "财破印",

    principle:
      "财星对印星形成有效制约时，会破坏依赖印星承接、保护和转化的结构。",
  },

  owlSeizesFood: {
    sourceId:
      "cui_wenju_notes_5000",

    title:
      "崔文举盲派八字笔记",

    locator:
      "枭神夺食",

    principle:
      "偏印对食神形成有效制约时，会影响食神所代表的输出、成果和生财通道；轻重须比较双方力量。",
  },

  officialKillMixture: {
    sourceId:
      "cui_wenju_notes_5000",

    title:
      "崔文举盲派八字笔记",

    locator:
      "论官杀混杂",

    principle:
      "正官与七杀并见时，需要区分主次、制化与去留；不能仅凭同时出现直接判断吉凶。",
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

    {
    id:
      "professional_hurt_officer_with_resource",

    semanticGroup:
      "hurt_officer_with_resource",

    title:
      "伤官配印",

    role:
      "core",

    baseStatus:
      "conditional",

    importance:
      "high",

    baseConfidence:
      "medium",

    priority:
      93,

    school:
      controlRuleSchool,

    replacementPolicy:
      "ranked",

    sourceRefs: [
      controlSourceRefs
        .hurtOfficerResource,

      controlSourceRefs
        .yangControlForms,
    ],

    domains: [
      "career",
      "self",
      "fortune",
    ],

    thresholds: {
      hurtMin:
        0.4,

      resourceMin:
        0.5,

      supportedHurtMin:
        0.8,

      supportedResourceMin:
        0.8,

      wealthBreakMin:
        0.7,
    },

    masterNarrative: {
      lifePattern:
        "人生优势来自独立思考、表达和突破能力，但真正形成稳定发展，需要规则、学习和专业体系对锋芒进行承接。",

      conclusion:
        "既不能完全压制创造和表达，也不能任由情绪与反叛主导，关键是把伤官转化为专业方法和可验证成果。",
    },

    semantic: {
      formation:
        "伤官有实际力量，同时正印能够形成对伤官的制约和承接，使伤官不再无序冲击规则与责任。",

      meaning:
        "命主可以把独立思考、表达、创新和批判能力，转化为专业方法、学习成果和现实秩序。",

      manifestations: [
        "有自己的判断与表达方式，但经过学习和规则训练后，更容易形成专业能力。",
        "既不愿盲从，也能够在成熟后理解制度和标准的价值。",
      ],

      strengths: [
        "兼具独立思考、创造力、学习能力和体系化能力。",
      ],

      risks: [
        "印星过重会压制表达；伤官过重而印弱，则容易与规则、权威和责任发生摩擦。",
      ],

      boundary:
        "伤官与印星并见不等于伤官配印成立；必须存在正印制约伤官的真实路径，且印星不能被财星严重破坏。",
    },

    domainNarratives: {
      career: {
        overview:
          "事业适合把独立思考、创新表达和专业学习结合，形成有方法、有标准的成果。",

        manifestation:
          "在技术、研究、方案、分析、设计和专业表达领域更容易发挥优势。",

        strength:
          "能够发现问题，也有机会通过学习和体系化能力提出解决方法。",

        caution:
          "与规则环境发生摩擦时，应把反对意见转化为证据、方法和可交付成果。",
      },

      self: {
        overview:
          "个性中同时存在独立表达与规则承接两种力量。",

        manifestation:
          "不容易盲从，但成熟后能够把个人观点整理成稳定的方法体系。",

        strength:
          "思考活跃，学习能力和自我修正能力较强。",

        caution:
          "需要避免一边过度自我否定，一边又以情绪方式反抗外部要求。",
      },

      fortune: {
        overview:
          "精神稳定来自既能表达真实想法，又能通过学习和秩序整理内在冲突。",

        manifestation:
          "写作、研究、创造和系统学习都有利于释放压力。",

        strength:
          "能够通过理解和表达逐步形成自洽。",

        caution:
          "表达长期受压或规则压力过重时，容易形成内部对抗。",
      },
    },
  },

  {
    id:
      "professional_hurt_officer_meets_official",

    semanticGroup:
      "hurt_officer_meets_official",

    title:
      "伤官见官",

    role:
      "tension",

    baseStatus:
      "conditional",

    importance:
      "high",

    baseConfidence:
      "medium",

    priority:
      92,

    school:
      controlRuleSchool,

    replacementPolicy:
      "ranked",

    sourceRefs: [
      controlSourceRefs
        .hurtOfficerOfficial,

      controlSourceRefs
        .yangControlForms,
    ],

    domains: [
      "career",
      "self",
      "fortune",
    ],

    thresholds: {
      hurtMin:
        0.4,

      officerMin:
        0.4,

      supportedHurtMin:
        0.8,

      supportedOfficerMin:
        0.8,

      resourceResolveMin:
        0.7,

      wealthMediateMin:
        0.5,
    },

    masterNarrative: {
      lifePattern:
        "人生容易在个人表达、独立判断与外部规则、职责要求之间产生张力，发展关键在于能否建立缓解和转化通道。",

      conclusion:
        "面对权威和规则时，不宜只靠对抗；把观点转化为方法、成果和现实价值，才能减少长期冲突。",
    },

    semantic: {
      formation:
        "伤官与正官形成明确制克关系，并且缺少足够正印制伤或伤官生财转官的缓解路线。",

      meaning:
        "个人表达、突破和批判意识容易与制度、职责、上级或现实标准发生冲突。",

      manifestations: [
        "容易对不合理规则提出质疑，也可能因表达方式直接而引发摩擦。",
        "面对权威和职责要求时，个人判断与外部标准容易互相拉扯。",
      ],

      strengths: [
        "能够发现制度、流程和执行中的问题。",
      ],

      risks: [
        "缺少缓解路线时，容易把能力消耗在冲突、反复解释和关系摩擦中。",
      ],

      boundary:
        "伤官与正官同时出现不等于伤官见官成立；必须检查真实制克路径，以及印星和财星是否能够缓解。",
    },

    domainNarratives: {
      career: {
        overview:
          "事业中个人表达与规则职责之间存在较明显张力。",

        manifestation:
          "容易发现上级、制度和流程中的问题，但表达和处理方式会直接影响职业关系。",

        strength:
          "适合改善流程、发现漏洞和提出新方法。",

        caution:
          "不宜在缺少证据和替代方案时直接与制度或管理者正面冲突。",
      },

      self: {
        overview:
          "个人主见较强，对不合理要求较敏感。",

        manifestation:
          "容易先看到问题和限制，再决定是否接受外部规则。",

        strength:
          "保持独立判断，不容易盲目服从。",

        caution:
          "需要区分真正的问题与情绪化抵触。",
      },

      fortune: {
        overview:
          "长期处在表达受限或规则冲突环境中时，内在压力容易累积。",

        manifestation:
          "反复争论和解释会消耗较多精神能量。",

        strength:
          "找到有效表达与现实转化方式后，精神状态会明显改善。",

        caution:
          "避免把所有外部要求都理解为对个人自由的压制。",
      },
    },
  },

  {
    id:
      "professional_wealth_breaks_resource",

    semanticGroup:
      "wealth_breaks_resource",

    title:
      "财坏印",

    role:
      "tension",

    baseStatus:
      "conditional",

    importance:
      "high",

    baseConfidence:
      "medium",

    priority:
      91,

    school:
      controlRuleSchool,

    replacementPolicy:
      "ranked",

    sourceRefs: [
      controlSourceRefs
        .wealthBreakResource,

      controlSourceRefs
        .yangControlForms,
    ],

    domains: [
      "career",
      "wealth",
      "parents",
      "self",
    ],

    thresholds: {
      wealthMin:
        0.4,

      resourceMin:
        0.5,

      supportedWealthMin:
        0.8,

      supportedResourceMin:
        0.8,
    },

    masterNarrative: {
      lifePattern:
        "人生容易在现实收益、市场选择与学习、资格、稳定体系之间进行取舍。",

      conclusion:
        "追求收益时不能破坏长期信用、专业积累和基本承接体系，否则短期得到可能伴随长期能力与稳定性的损失。",
    },

    semantic: {
      formation:
        "财星与印星形成明确制克关系，现实收益与资源追求对学习、资格、保护和稳定承接形成破坏。",

      meaning:
        "命主容易在赚钱、市场机会与长期学习、资质、稳定平台之间发生冲突。",

      manifestations: [
        "现实收益可能推动命主离开原有学习或稳定体系。",
        "短期利益与长期专业积累之间容易出现选择。",
      ],

      strengths: [
        "现实意识和市场敏感度较强。",
      ],

      risks: [
        "过度追求短期收益时，容易损害长期信用、学习体系和稳定承接。",
      ],

      boundary:
        "财印并见不等于财坏印；必须存在财星克印的真实路径，并比较双方力量与印星是否另有保护。",
    },

    domainNarratives: {
      career: {
        overview:
          "事业中现实收益与专业资质、稳定平台之间容易形成取舍。",

        manifestation:
          "可能因收入、市场或项目机会改变原有职业学习路线。",

        strength:
          "能够关注现实回报和市场价值。",

        caution:
          "不宜为短期收益放弃能够形成长期壁垒的学习和信用积累。",
      },

      wealth: {
        overview:
          "财富机会具有较强现实推动力，但可能冲击稳定体系和长期积累。",

        manifestation:
          "赚钱动机会加快决策，也容易让命主减少耐心。",

        strength:
          "具备主动寻找收益机会的意识。",

        caution:
          "应区分真正可持续的收益与透支长期能力的短期机会。",
      },

      parents: {
        overview:
          "现实利益、个人选择与家庭教育或长辈尺度之间容易产生差异。",

        manifestation:
          "职业与财富选择可能不完全符合家庭原有规划。",

        strength:
          "能够形成自己的现实判断。",

        caution:
          "不宜因现实分歧完全否定长辈经验和已有资源。",
      },

      self: {
        overview:
          "个人容易在安全稳定与现实收益之间反复权衡。",

        manifestation:
          "机会出现时容易加快行动，但也可能打乱原有学习和积累计划。",

        strength:
          "现实感较强，愿意为机会作出调整。",

        caution:
          "需要保留最低限度的长期体系和专业底座。",
      },
    },
  },

  {
    id:
      "professional_owl_seizes_food",

    semanticGroup:
      "owl_seizes_food",

    title:
      "枭神夺食",

    role:
      "tension",

    baseStatus:
      "conditional",

    importance:
      "high",

    baseConfidence:
      "medium",

    priority:
      90,

    school:
      controlRuleSchool,

    replacementPolicy:
      "ranked",

    sourceRefs: [
      controlSourceRefs
        .owlSeizesFood,

      controlSourceRefs
        .yangControlForms,
    ],

    domains: [
      "career",
      "wealth",
      "children",
      "fortune",
    ],

    thresholds: {
      owlMin:
        0.4,

      foodMin:
        0.4,

      supportedOwlMin:
        0.8,

      supportedFoodMin:
        0.5,

      minimumPowerRatio:
        0.6,
    },

    masterNarrative: {
      lifePattern:
        "人生容易出现理解、顾虑和内部准备压制实际表达、成果和现实输出的情况。",

      conclusion:
        "关键不是继续增加思考，而是保护稳定的表达、交付和生活节奏，避免内部压力长期切断成果出口。",
    },

    semantic: {
      formation:
        "偏印与食神形成明确制克关系，并且偏印力量足以对食神出口产生实际压制。",

      meaning:
        "内部思虑、顾虑、学习和防御机制可能压制表达、成果、项目和生财出口。",

      manifestations: [
        "容易因想得过多、顾虑过多而降低输出速度。",
        "项目和表达可能在内部反复修改，难以及时完成。",
      ],

      strengths: [
        "思考深入，能够看到隐藏风险和复杂问题。",
      ],

      risks: [
        "偏印过重时，容易把分析变成对行动、表达和成果的压制。",
      ],

      boundary:
        "偏印与食神并见不等于枭神夺食；必须存在偏印制食神的真实路径，并比较双方力量。",
    },

    domainNarratives: {
      career: {
        overview:
          "事业中内部思考和风险顾虑可能压制实际交付与成果显化。",

        manifestation:
          "容易准备充分，但项目推出和结果兑现偏慢。",

        strength:
          "适合深入研究、风险检查和复杂分析。",

        caution:
          "需要建立明确截止时间，避免反复修改阻断交付。",
      },

      wealth: {
        overview:
          "食神生财出口受到偏印制约时，能力转化为收益的速度可能降低。",

        manifestation:
          "有能力和想法，但变现可能被顾虑、流程或反复准备拖慢。",

        strength:
          "能够提前识别收益过程中的风险。",

        caution:
          "不能让风险控制完全取代实际行动。",
      },

      children: {
        overview:
          "对子女、作品和项目容易投入较多思考与要求。",

        manifestation:
          "培养和完善过程较细，但也可能增加控制和压力。",

        strength:
          "重视质量、方法和长期培养。",

        caution:
          "标准过多时，容易压制晚辈或作品的自然成长空间。",
      },

      fortune: {
        overview:
          "内在思虑容易压住表达和情绪释放。",

        manifestation:
          "压力较大时可能反复分析，却不愿直接表达需求。",

        strength:
          "具备深入反思和自我整理能力。",

        caution:
          "应通过行动、运动、表达和完成任务打开出口。",
      },
    },
  },

  {
    id:
      "professional_official_kill_mixture",

    semanticGroup:
      "official_kill_mixture",

    title:
      "官杀混杂",

    role:
      "tension",

    baseStatus:
      "conditional",

    importance:
      "high",

    baseConfidence:
      "medium",

    priority:
      89,

    school:
      controlRuleSchool,

    replacementPolicy:
      "ranked",

    sourceRefs: [
      controlSourceRefs
        .officialKillMixture,

      controlSourceRefs
        .yangControlForms,
    ],

    domains: [
      "career",
      "self",
      "fortune",
    ],

    thresholds: {
      officerMin:
        0.4,

      killMin:
        0.4,

      supportedOfficerMin:
        0.7,

      supportedKillMin:
        0.7,

      dominanceRatio:
        2,
    },

    masterNarrative: {
      lifePattern:
        "人生容易同时面对不同性质的规则、责任和压力来源，发展关键在于确定主线并减少方向混乱。",

      conclusion:
        "不能同时迎合所有标准和压力来源，应明确主要责任、主要平台和主要解决路线。",
    },

    semantic: {
      formation:
        "正官与七杀同时形成实际力量，规则责任与竞争压力并存，需要进一步区分主次、去留和制化。",

      meaning:
        "命主可能同时面对稳定规则和高压竞争两类要求，容易出现方向、角色和责任标准不一致。",

      manifestations: [
        "工作中可能同时受到制度要求与结果压力推动。",
        "面对不同上级、平台或责任标准时，容易增加判断成本。",
      ],

      strengths: [
        "能够接触和理解不同类型的责任环境。",
      ],

      risks: [
        "主次不清时容易方向分散、责任冲突和长期消耗。",
      ],

      boundary:
        "正官与七杀并见不应直接断凶；需要观察是否一方明显为主、另一方被制化，以及是否形成清楚的工作路线。",
    },

    domainNarratives: {
      career: {
        overview:
          "事业中同时存在规则职责和竞争压力，职业主线需要进一步明确。",

        manifestation:
          "可能同时承担稳定管理要求与高强度结果要求。",

        strength:
          "能够适应多种责任环境。",

        caution:
          "不宜同时追随多个相互冲突的职业标准和平台。",
      },

      self: {
        overview:
          "个人容易在稳定秩序与突破压力之间反复调整。",

        manifestation:
          "有时重视规范，有时又希望快速解决问题和取得结果。",

        strength:
          "能够理解规则，也具备面对压力的意识。",

        caution:
          "需要确定主要目标，避免长期处于相互矛盾的要求中。",
      },

      fortune: {
        overview:
          "多个责任和压力来源并存时，精神负担容易增加。",

        manifestation:
          "容易同时考虑不同标准，导致决策变慢或方向反复。",

        strength:
          "能够从多个角度评估责任和风险。",

        caution:
          "应减少无效责任，保留清楚的优先顺序。",
      },
    },
  },
];