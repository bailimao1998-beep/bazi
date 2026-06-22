import {
  getNatalCompositionSemantic,
} from "./natalCompositionSemantics.js";

export const DOMAIN_NARRATIVE_COMPOSER_VERSION =
  "natal-domain-narrative-v2";

const domainLabels = {
  self: "命主自身",
  parents: "父母家庭",
  siblings: "兄弟同辈",
  spouse: "夫妻感情",
  children: "子女结果",
  wealth: "财帛财富",
  health: "疾厄健康",
  movement: "迁移环境",
  friends: "交友人脉",
  career: "官禄事业",
  property: "田宅资产",
  fortune: "福德精神",
};

const domainFallbacks = {
  self:
    "命主自身的高阶组合不算集中，目前主要从日主强弱、根气和柱位观察基本性情，不宜把某一种表现说得过满。",

  parents:
    "父母家庭方面没有特别强的高阶主象，长辈助力、要求和早年环境，仍要以年柱、月柱的具体落点为准。",

  siblings:
    "兄弟同辈方面没有特别集中的高阶组合，合作、竞争和彼此距离，需要结合比劫落点及现实关系判断。",

  spouse:
    "夫妻感情方面暂未形成特别集中的高阶主象，目前主要参考日支、配偶星和关系结构，不宜直接判断具体婚姻结果。",

  children:
    "子女、作品和项目成果方面的高阶信号不算集中，具体表现仍要结合时柱、食伤与现实人生阶段判断。",

  wealth:
    "财富方面目前以财星和资源落点为基础，尚不足以仅凭原局确定具体财富层级，更适合观察收入方式与承载习惯。",

  health:
    "健康方面只观察原局五行、寒暖与体质偏性，不直接对应具体疾病，现实作息和医学检查仍是主要依据。",

  movement:
    "迁移环境方面的原局信号不算集中，居住、异地、出行和岗位变化，更需要结合后续时间层判断。",

  friends:
    "交友人脉方面目前主要参考比劫、地支关系和合作结构，圈层质量与相处结果仍取决于现实边界。",

  career:
    "事业方面虽有基础事实落点，但高阶主线尚不够集中，职业方向仍要结合能力结构、现实岗位和承载方式判断。",

  property:
    "田宅资产方面没有足够集中的高阶主象，只能观察资源沉淀与居住承载倾向，不宜直接判断具体房产结果。",

  fortune:
    "精神与福德方面目前主要观察印星、食伤、五行寒暖和内在消化方式，真实状态仍会明显受到现实环境影响。",
};

const domainRuleNarratives = {
  self: {
    official_resource_support:
      "你做事重规则、依据和责任，通常先弄清标准再承担任务，整体偏稳，不喜欢长期处在混乱无序的环境。",

    wealth_official_resource_trace:
      "你既重现实结果，也在意身份、信誉和长期价值，常会在收入、责任与稳定之间反复权衡。",

    day_pillar_repetition:
      "你的自我感受与外部要求容易反复呼应，遇到重要问题时会多次确认，不容易草率翻篇。",

    spouse_palace_relation_tension:
      "关系变化容易明显影响你的状态，边界、态度和责任是否清楚，对你的内心稳定十分重要。",

    peer_wealth_competition:
      "你对公平、分工和资源归属较为敏感，合作时会自然关注谁投入、谁承担、谁获益。",

    resource_heavy_output_weak:
      "你更擅长吸收、理解和准备，真正把想法稳定表达出来，往往需要明确的出口和现实推动。",

    element_bias_visible:
      "你的性格和做事方式具有较明显的固定倾向，优点比较集中，短板也容易在不匹配的环境中被放大。",

    month_command_official:
      "你对责任、标准和评价较为敏感，容易把事情当成任务认真完成，也容易因此给自己压力。",

    hurting_officer_resource_balance:
      "你有独立判断，也愿意用知识和依据整理自己的表达，适合处理复杂问题，而不是盲目服从。",

    hurting_officer_meets_officer:
      "你不喜欢不合理的限制，遇到制度、岗位或权威问题时，容易直接表达自己的不同意见。",

    wealth_heavy_body_weak:
      "你对现实机会和资源较为敏感，但当任务或责任过多时，容易出现承接压力和疲惫感。",

    officer_killing_mixed:
      "你既重秩序又有危机意识，面对多重要求时，容易在稳定与突破之间产生拉扯。",

    day_branch_combined:
      "重要关系和合作容易影响你的选择，你通常重视共同基础、稳定连接和彼此配合。",

    metal_water_fire_weak:
      "你思考细致、反应偏谨慎，常常先观察再行动，启动速度容易受到目标感和外部推动影响。",
  },

  parents: {
    official_resource_support:
      "家庭或长辈对教育、规矩和责任感的影响较深，获得支持时，也常伴随着期待、要求和需要承担的事情。",
  },

  siblings: {
    peer_wealth_competition:
      "同辈之间既有合作互助，也容易出现比较、竞争或资源分配问题，关系能否稳定取决于边界是否清楚。",
  },

  spouse: {
    day_pillar_repetition:
      "亲密关系中容易重复面对相似的沟通课题，双方需要避免在同一问题上反复拉扯。",

    spouse_palace_relation_tension:
      "感情中的主要压力多与边界、责任分配和沟通节奏有关，外部家庭或现实事务也可能进入关系。",

    hurting_officer_meets_officer:
      "关系中容易出现一方重表达和自由、一方重规则和要求的情况，沟通方式比单纯讲道理更重要。",

    wealth_heavy_body_weak:
      "感情或婚姻中的现实责任可能偏多，需要注意金钱、家庭任务和个人承载之间是否平衡。",

    officer_killing_mixed:
      "关系中可能同时存在稳定要求和压力感，双方对责任、控制和自由的理解需要提前说清。",

    day_branch_combined:
      "你重视关系中的陪伴、合作和共同目标，重要选择容易受到伴侣或关系状态影响。",
  },

  children: {
    resource_heavy_output_weak:
      "对子女、作品和成果往往投入较多思考与准备，但表达、放手和让成果自然显现需要更多耐心。",

    output_wealth_chain:
      "子女、作品、项目或个人输出具有转化为现实成果的可能，关键在于持续产出和实际落地。",

    hurting_officer_resource_balance:
      "在教育、创作或项目表达上，既重独立思考，也重知识和方法，适合引导而不是简单压制。",
  },

  wealth: {
    wealth_official_resource_trace:
      "财富更容易通过专业、平台、责任和长期信用获得，不太适合完全依赖短期机会或无规则扩张。",

    peer_wealth_competition:
      "财富与合作、人脉和同辈关系联系较深，机会常由人带来，但分钱、分工和利益边界必须明确。",

    output_wealth_chain:
      "收入更适合通过技术、表达、作品、服务或解决实际问题获得，个人输出能力就是重要财源。",

    wealth_heavy_body_weak:
      "现实机会和财富任务可能不少，但能否真正留住和承接，取决于个人能力、精力和节奏是否匹配。",
  },

  health: {
    element_bias_visible:
      "体质上容易呈现明显偏性，重点不是直接判断疾病，而是观察作息、环境与五行失衡对状态的影响。",

    wealth_heavy_body_weak:
      "现实事务和责任过多时，身体容易先表现出疲劳和消耗，需要避免长期超出自身承载。",

    officer_killing_mixed:
      "多重要求和压力容易影响身心节奏，长期紧张时更需要注意休息、边界和恢复能力。",

    metal_water_fire_weak:
      "整体容易偏冷静、慢热或动力不足，体质轻重仍需结合调候、作息和现实状态复核。",
  },

  movement: {},

  friends: {
    peer_wealth_competition:
      "人脉能够带来机会和资源，但朋友合作中容易涉及竞争、利益和分工，边界清楚反而更利于长期关系。",

    hurting_officer_meets_officer:
      "社交中容易对规则、立场和观点产生直接表达，遇到强势或权威型人物时要注意沟通方式。",

    day_branch_combined:
      "你重视人际连接和共同目标，容易通过合作形成关系，但也要避免因为关系而失去个人判断。",
  },

  career: {
    official_resource_support:
      "事业更适合制度清晰、职责明确、重视专业积累的环境，资质、经验和可信度比短期表现更重要。",

    wealth_official_resource_trace:
      "职业发展容易同时连接资源、岗位责任和专业能力，适合在平台中逐步扩大承接范围。",

    resource_heavy_output_weak:
      "事业优势在于学习、理解和专业积累，压力在于成果显化和表达效率，不能长期只准备而不落地。",

    month_command_official:
      "职业和社会角色对你影响较大，适合承担明确任务，但也容易因为责任、评价和岗位要求感到压力。",

    output_wealth_chain:
      "事业更适合通过技术、产品、作品、表达或服务创造实际价值，成果能否落地直接影响发展。",

    hurting_officer_resource_balance:
      "你适合分析、研究、策划和解决复杂问题，专业知识能够帮助你把独立判断转化为职业价值。",

    hurting_officer_meets_officer:
      "工作中容易遇到个人判断与制度要求的矛盾，处理得好可以推动优化，处理不好则容易与上级或规则冲突。",

    officer_killing_mixed:
      "职业环境可能同时存在稳定职责与高压挑战，需要明确主次，避免同时承接多套相互冲突的标准。",

    metal_water_fire_weak:
      "事业上思考和分析能力较强，但行动推动、表达和现实显化可能偏慢，需要明确目标和执行节奏。",
  },

  property: {},

  fortune: {
    resource_heavy_output_weak:
      "内心更习惯通过学习、理解和思考获得安全感，但过度内收时容易想得多、表达得少。",

    element_bias_visible:
      "精神状态容易受环境匹配程度影响，长期处在不适合自己的节奏中，内在失衡感会更加明显。",

    hurting_officer_resource_balance:
      "你既有独立思考，也需要知识体系来安顿内心，理解问题本身往往能够缓解焦虑和冲突。",

    metal_water_fire_weak:
      "内在偏冷静和克制，情绪与动力通常需要温暖、目标感和现实行动来带动。",
  },
};

const domainDetailDefaults =
  Object.freeze({
    parents:
      createDomainDetail({
        manifestation:
          "现实中常表现为长辈的教育方式、规矩要求或家庭责任，对个人选择产生持续影响。",

        strength:
          "较容易从家庭经验、教育资源或长辈指导中得到承接。",

        caution:
          "家庭支持与期待往往同时存在，需要区分个人意愿与长辈要求。",
      }),

    siblings:
      createDomainDetail({
        manifestation:
          "同辈关系中容易同时出现合作、比较和资源协商，彼此距离会随利益与分工发生变化。",

        strength:
          "具备与同辈协作、交换信息和共同处理现实事务的能力。",

        caution:
          "资源、利益或责任划分不清时，容易出现竞争和关系消耗。",
      }),

    spouse:
      createDomainDetail({
        manifestation:
          "亲密关系中较重视陪伴、合作和责任回应，关系状态容易影响个人情绪与选择。",

        strength:
          "愿意经营关系，也较重视共同目标和长期稳定。",

        caution:
          "需要避免把期待、控制或现实压力全部带入亲密关系。",
      }),

    children:
      createDomainDetail({
        manifestation:
          "对子女、作品和项目成果通常投入较多心力，重视过程是否完整、结果是否真正落地。",

        strength:
          "具备培养、规划和持续打磨成果的耐心。",

        caution:
          "投入过多思考和要求时，容易影响放手、表达和成果自然成长。",
      }),

    wealth:
      createDomainDetail({
        manifestation:
          "财富活动较重视资源来源、现实回报和长期稳定，不太愿意完全脱离规则承担风险。",

        strength:
          "具备资源整合、现实判断和逐步积累收益的意识。",

        caution:
          "需要防止责任过多、合作边界不清或承接能力不足影响财富留存。",
      }),

    health:
      createDomainDetail({
        manifestation:
          "身体状态容易受到作息、压力、环境寒暖和长期生活节奏影响。",

        strength:
          "较容易通过稳定作息、适宜环境和规律恢复改善整体状态。",

        caution:
          "只作体质偏性观察，不应把命理结构直接对应具体疾病。",
      }),

    friends:
      createDomainDetail({
        manifestation:
          "人际关系容易围绕合作、共同目标和资源交换展开，圈层变化会影响现实机会。",

        strength:
          "具备建立合作关系、协调资源和形成共同目标的能力。",

        caution:
          "需要避免因为关系、面子或利益交换而失去个人判断。",
      }),

    career:
      createDomainDetail({
        manifestation:
          "职业发展较重视职责、专业能力和成果承接，岗位是否清晰会明显影响发挥。",

        strength:
          "适合在能够积累专业信用、经验和现实成果的环境中发展。",

        caution:
          "需要避免责任过多、标准冲突或长期只有准备而缺少结果。",
      }),

    fortune:
      createDomainDetail({
        manifestation:
          "内在安全感通常来自理解问题、掌握方法和维持可控节奏。",

        strength:
          "具备自我反思、长期学习和内部消化复杂问题的能力。",

        caution:
          "过度内收时容易想得多、表达得少，并形成精神上的反复消耗。",
      }),
  });

const domainRuleDetailOverrides =
  Object.freeze({
    spouse:
      Object.freeze({
        day_pillar_repetition:
          createDomainDetail({
            manifestation:
              "亲密关系中容易反复面对相似的沟通议题，旧问题不容易自然翻篇。",

            caution:
              "需要避免在同一个问题上反复确认、冷战或相互消耗。",
          }),

        spouse_palace_relation_tension:
          createDomainDetail({
            manifestation:
              "关系中的压力多落在责任分配、沟通节奏和外部事务介入。",

            caution:
              "边界不清或双方节奏失衡时，关系容易出现牵扯和摩擦。",
          }),

        day_branch_combined:
          createDomainDetail({
            manifestation:
              "重要选择容易受到伴侣、合作关系或共同目标影响。",

            strength:
              "具备陪伴、协作和长期经营关系的意识。",

            caution:
              "需要保留个人判断，避免为了维持关系而过度迁就。",
          }),

        wealth_heavy_body_weak:
          createDomainDetail({
            manifestation:
              "感情关系容易同时承载金钱、家庭任务和现实责任。",

            caution:
              "现实任务过多时，容易把疲惫和压力转移到关系之中。",
          }),
      }),

    children:
      Object.freeze({
        resource_heavy_output_weak:
          createDomainDetail({
            manifestation:
              "对子女、作品或项目准备较多，但真正放手表达和形成成果可能偏慢。",

            strength:
              "具有耐心规划、吸收知识和反复完善成果的能力。",

            caution:
              "容易准备过度，影响成果及时呈现。",
          }),

        output_wealth_chain:
          createDomainDetail({
            manifestation:
              "作品、技能、项目或个人表达具有转化为现实成果的可能。",

            strength:
              "输出能力与现实回报之间较容易形成连接。",

            caution:
              "需要持续产出和实际执行，不能只依赖一次性表现。",
          }),
      }),

    wealth:
      Object.freeze({
        peer_wealth_competition:
          createDomainDetail({
            manifestation:
              "财富机会容易通过同辈、朋友或合作关系出现，同时也伴随利益协商。",

            strength:
              "善于通过合作、人脉和资源交换寻找机会。",

            caution:
              "分钱、分工和资源归属必须提前说清。",
          }),

        output_wealth_chain:
          createDomainDetail({
            manifestation:
              "收入更适合来自技术、作品、服务、表达或实际问题的解决。",

            strength:
              "个人输出能够直接形成现实价值。",

            caution:
              "需要保持持续交付，避免输出不稳定导致收益波动。",
          }),

        wealth_heavy_body_weak:
          createDomainDetail({
            manifestation:
              "现实机会和财务事务可能不少，但处理起来容易占用较多精力。",

            strength:
              "对资源和机会较为敏感，能够看到现实价值。",

            caution:
              "扩张速度必须与个人能力、时间和精力承载匹配。",
          }),
      }),

    health:
      Object.freeze({
        element_bias_visible:
          createDomainDetail({
            manifestation:
              "体质状态容易呈现较明显偏性，并随环境和生活节奏发生变化。",

            strength:
              "偏性明确，反而较容易通过稳定环境和生活方式进行针对性调整。",

            caution:
              "结构偏性不等同于疾病结论，具体问题仍应以医学检查为准。",
          }),

        metal_water_fire_weak:
          createDomainDetail({
            manifestation:
              "整体容易偏冷、慢热或动力启动不足，状态较依赖温暖环境和明确目标。",

            strength:
              "冷静和恢复节奏较稳定时，适合长期持续投入。",

            caution:
              "需要注意长期缺少运动、光照、规律作息或现实推动造成的低迷状态。",
          }),

        wealth_heavy_body_weak:
          createDomainDetail({
            manifestation:
              "现实任务和责任增加时，身体容易先表现出疲劳和恢复变慢。",

            caution:
              "需要控制长期超负荷承接，避免事务量持续超过个人恢复能力。",
          }),
      }),

    friends:
      Object.freeze({
        peer_wealth_competition:
          createDomainDetail({
            manifestation:
              "朋友和合作关系既能带来机会，也容易牵涉竞争、利益和资源流动。",

            strength:
              "具备合作、协调和借助圈层资源推动事务的能力。",

            caution:
              "利益边界不清时，容易因为合作伤害关系。",
          }),

        hurting_officer_meets_officer:
          createDomainDetail({
            manifestation:
              "社交中对规则、立场和不合理要求较敏感，表达往往比较直接。",

            caution:
              "面对强势或权威型人物时，需要注意表达方式和时机。",
          }),
      }),

    career:
      Object.freeze({
        official_resource_support:
          createDomainDetail({
            manifestation:
              "工作中容易承担制度、流程、专业判断和责任型任务。",

            strength:
              "适合依靠资质、经验、专业信用和长期积累建立位置。",

            caution:
              "容易因为责任感过强而承接过多事务。",
          }),

        resource_heavy_output_weak:
          createDomainDetail({
            manifestation:
              "职业优势在于学习和理解，但成果表达、展示和及时交付可能偏慢。",

            strength:
              "专业吸收、分析和准备能力较强。",

            caution:
              "不能长期停留在准备阶段，需要建立稳定输出机制。",
          }),

        output_wealth_chain:
          createDomainDetail({
            manifestation:
              "职业成果更适合通过产品、作品、技术、服务或项目交付体现。",

            strength:
              "能够把个人能力转化为可见成果和现实价值。",

            caution:
              "需要保持交付质量和持续性，避免只重想法不重落地。",
          }),

        hurting_officer_meets_officer:
          createDomainDetail({
            manifestation:
              "工作中容易遇到个人判断与制度要求、上级意见之间的冲突。",

            strength:
              "有能力发现流程、规则或现实执行中的问题。",

            caution:
              "表达不当时容易把优化问题变成权威冲突。",
          }),

        officer_killing_mixed:
          createDomainDetail({
            manifestation:
              "职业环境中可能同时存在稳定职责、高压任务和多套评价标准。",

            strength:
              "能够应对复杂要求，并在压力中保持一定判断力。",

            caution:
              "必须明确主次，避免同时承接相互冲突的责任。",
          }),

        metal_water_fire_weak:
          createDomainDetail({
            manifestation:
              "职业上分析和判断较细，但启动、表达和推动速度可能慢于思考。",

            strength:
              "适合研究、分析、规划和长期专业积累。",

            caution:
              "需要明确目标、节点和交付节奏，防止长期停留在内部推演。",
          }),
      }),

    fortune:
      Object.freeze({
        resource_heavy_output_weak:
          createDomainDetail({
            manifestation:
              "内心习惯通过学习、理解和反复思考获得安全感。",

            strength:
              "具备较强的内部消化、学习和自我整理能力。",

            caution:
              "过度内收时容易想得多、表达得少。",
          }),

        element_bias_visible:
          createDomainDetail({
            manifestation:
              "精神状态容易受到环境是否匹配、自身节奏是否稳定的影响。",

            strength:
              "一旦找到适合自己的生活方式，内在状态较容易保持稳定。",

            caution:
              "长期处于不匹配环境中，偏性和内耗会更明显。",
          }),

        metal_water_fire_weak:
          createDomainDetail({
            manifestation:
              "情绪表达偏克制，内在动力需要温暖、目标和现实行动带动。",

            strength:
              "冷静、理性和深入思考能力较强。",

            caution:
              "长期缺少行动和外部连接时，容易进入低动力状态。",
          }),
      }),
  });

export function composeDomainNarrative({
  domainKey,
  images = [],
  facts = [],
  structureSynopsis = {},
} = {}) {
  const normalizedDomainKey =
    normalizeText(domainKey);

  const relevantImages =
    (
      Array.isArray(images)
        ? images
        : []
    )
      .filter(
        (image) =>
          includesDomain(
            image,
            normalizedDomainKey,
          ),
      )
      .sort(compareImages);

  const candidates =
    relevantImages
      .map((image) => {
        const ruleId =
          normalizeText(
            image.ruleId,
          );

        const semantic =
          getNatalCompositionSemantic(
            ruleId,
          );

        const ruleOverview =
          normalizeText(
            domainRuleNarratives[
              normalizedDomainKey
            ]?.[ruleId],
          );

        const detail =
          resolveDomainDetail(
            normalizedDomainKey,
            ruleId,
          );

        return {
          image,
          ruleId,
          semantic,
          overview:
            ruleOverview,
          detail,
        };
      })
      .filter(
        (item) =>
          item.overview,
      );

  const positive =
    candidates.find(
      (item) =>
        item.image.role ===
          "core" ||
        item.image.role ===
          "support",
    ) ??
    null;

  const tension =
    candidates.find(
      (item) =>
        item.image.role ===
          "tension" ||
        item.image.role ===
          "conditional" ||
        item.image.status ===
          "conditional",
    ) ??
    null;

  const primary =
    positive ||
    tension ||
    candidates[0] ||
    null;

  const structureBaseline =
    normalizeText(
      structureSynopsis
        .domainBaselines
        ?.[
          normalizedDomainKey
        ],
    );

  const compositionOverview =
    primary
      ? qualifyConditionalText(
          primary.overview,
          primary.image,
        )
      : "";

  const fallbackOverview =
    domainFallbacks[
      normalizedDomainKey
    ] ||
    "该领域目前缺少足够的原局证据。";

  const overview =
    joinNarrativeParts([
      structureBaseline,
      compositionOverview,

      !structureBaseline &&
      !compositionOverview
        ? fallbackOverview
        : "",
    ]);

  const useGenericSemantic =
    normalizedDomainKey ===
      "self";

  const primaryManifestation =
    primary
      ? qualifyConditionalText(
          primary.detail
            .manifestation,
          primary.image,
        )
      : "";

  const genericManifestation =
    useGenericSemantic
      ? normalizeText(
          primary?.semantic
            ?.manifestations?.[0],
        )
      : "";

  const manifestation =
    pickDistinctText(
      overview,
      primaryManifestation,
      genericManifestation,
    );

  const positiveStrength =
    positive
      ? qualifyConditionalText(
          positive.detail
            .strength,
          positive.image,
        )
      : "";

  const genericStrength =
    useGenericSemantic
      ? normalizeText(
          positive?.semantic
            ?.strengths?.[0] ??
          primary?.semantic
            ?.strengths?.[0],
        )
      : "";

  const strength =
    pickDistinctText(
      overview,
      positiveStrength,
      genericStrength,
    );

  const cautionSource =
    tension ||
    primary;

  const domainCaution =
    cautionSource
      ? qualifyConditionalText(
          cautionSource.detail
            .caution,
          cautionSource.image,
        )
      : "";

  const genericCaution =
    useGenericSemantic
      ? normalizeText(
          cautionSource
            ?.semantic
            ?.risks?.[0],
        )
      : "";

  const caution =
    pickDistinctText(
      overview,
      domainCaution,
      genericCaution,
    );

  return {
    version:
      DOMAIN_NARRATIVE_COMPOSER_VERSION,

    domainKey:
      normalizedDomainKey,

    label:
      domainLabels[
        normalizedDomainKey
      ] ||
      normalizedDomainKey,

    overview,

    manifestation,

    strength,

    caution,

    structureBaseline,

    compositionOverview,

    sourceRuleIds:
      uniqueStrings(
        candidates.map(
          (item) =>
            item.ruleId,
        ),
      ),

    sourceImageIds:
      uniqueStrings(
        candidates.map(
          (item) =>
            item.image.id,
        ),
      ),

    factCount:
      Array.isArray(facts)
        ? facts.length
        : 0,

    hasStructureBaseline:
      Boolean(
        structureBaseline,
      ),

    hasCompositionNarrative:
      Boolean(primary),

    warnings:
      normalizedDomainKey &&
      domainLabels[
        normalizedDomainKey
      ]
        ? []
        : [
            "unknown_domain_key",
          ],
  };
}

function createDomainDetail({
  manifestation = "",
  strength = "",
  caution = "",
} = {}) {
  return Object.freeze({
    manifestation:
      normalizeText(
        manifestation,
      ),

    strength:
      normalizeText(
        strength,
      ),

    caution:
      normalizeText(
        caution,
      ),
  });
}

function resolveDomainDetail(
  domainKey,
  ruleId,
) {
  const defaultDetail =
    domainDetailDefaults[
      domainKey
    ] ||
    createDomainDetail();

  const override =
    domainRuleDetailOverrides[
      domainKey
    ]?.[ruleId] ||
    {};

  return {
    manifestation:
      normalizeText(
        override
          .manifestation ||
        defaultDetail
          .manifestation,
      ),

    strength:
      normalizeText(
        override.strength ||
        defaultDetail.strength,
      ),

    caution:
      normalizeText(
        override.caution ||
        defaultDetail.caution,
      ),
  };
}

function qualifyConditionalText(
  value,
  image,
) {
  const text =
    normalizeText(value);

  if (!text) {
    return "";
  }

  const isConditional =
    image?.role ===
      "conditional" ||
    image?.status ===
      "conditional";

  if (
    !isConditional ||
    /^若|^如果|^在该结构/.test(
      text,
    )
  ) {
    return text;
  }

  return `若该结构在现实中确有承接，${text}`;
}

function includesDomain(
  item,
  domainKey,
) {
  const domains = [
    ...(
      Array.isArray(item?.domains)
        ? item.domains
        : []
    ),

    ...(
      Array.isArray(item?.supports)
        ? item.supports
        : []
    ),
  ]
    .map(normalizeText)
    .filter(Boolean);

  return domains.includes(
    domainKey,
  );
}

function compareImages(
  left,
  right,
) {
  return (
    roleRank(right?.role) -
      roleRank(left?.role) ||
    Number(
      right?.priority ?? 0,
    ) -
      Number(
        left?.priority ?? 0,
      ) ||
    normalizeText(
      left?.ruleId,
    ).localeCompare(
      normalizeText(
        right?.ruleId,
      ),
    )
  );
}

function roleRank(role) {
  return {
    core: 5,
    support: 4,
    tension: 3,
    conditional: 2,
    candidate: 1,
  }[normalizeText(role)] ?? 0;
}

function pickDistinctText(
  base,
  ...candidates
) {
  const normalizedBase =
    normalizeComparableText(base);

  for (
    const candidate of candidates
  ) {
    const normalized =
      normalizeText(candidate);

    if (!normalized) {
      continue;
    }

    if (
      normalizeComparableText(
        normalized,
      ) !== normalizedBase
    ) {
      return normalized;
    }
  }

  return "";
}

function uniqueStrings(items) {
  return [
    ...new Set(
      (Array.isArray(items)
        ? items
        : [])
        .map(normalizeText)
        .filter(Boolean),
    ),
  ];
}

function normalizeComparableText(
  value,
) {
  return normalizeText(value)
    .replace(
      /[，。；：、！？\s]/g,
      "",
    );
}

function joinNarrativeParts(
  values,
) {
  const result = [];

  for (
    const value of
    Array.isArray(values)
      ? values
      : []
  ) {
    const text =
      normalizeText(value);

    if (!text) {
      continue;
    }

    const comparable =
      normalizeComparableText(
        text,
      );

    const duplicated =
      result.some(
        (item) =>
          normalizeComparableText(
            item,
          ) === comparable,
      );

    if (!duplicated) {
      result.push(text);
    }
  }

  return result
    .map(
      (text) =>
        /[。！？]$/.test(text)
          ? text
          : `${text}。`,
    )
    .join("");
}

function normalizeText(value) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();
}
