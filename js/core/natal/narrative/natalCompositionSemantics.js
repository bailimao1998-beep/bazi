export const NATAL_COMPOSITION_SEMANTICS_VERSION =
  "natal-composition-semantics-v1";

export const natalCompositionSemantics =
  Object.freeze({
    official_resource_support:
      createSemantic({
        ruleId:
          "official_resource_support",

        title:
          "官印承接",

        formation:
          "官杀与印星同时有力，印星能够承接官杀所代表的规则、责任与压力。",

        meaning:
          "命局重视规则、责任、资质、名誉和长期积累，通常适合依靠专业能力、制度平台与可信度建立位置。",

        manifestations: [
          "做事重标准、依据和完整流程。",
          "遇到责任时通常愿意承担，不喜欢敷衍。",
          "重视学习、资格、经验和专业认可。",
          "在制度清晰的环境中更容易发挥。",
        ],

        strengths: [
          "学习和理解规则的能力较强。",
          "责任感、稳定性和承接能力较好。",
          "适合长期积累专业信用。",
          "容易从平台、资质或长辈经验中获得帮助。",
        ],

        risks: [
          "容易对自己要求过高。",
          "面对权责和评价时容易紧张。",
          "思想可能偏紧，不容易真正放松。",
          "过度重视标准时，可能降低变通速度。",
        ],

        domains: [
          "self",
          "parents",
          "career",
          "fortune",
        ],
      }),

    wealth_official_resource_trace:
      createSemantic({
        ruleId:
          "wealth_official_resource_trace",

        title:
          "财官印承接线索",

        formation:
          "财星、官杀与印星三类力量在原局均有落点，形成资源、责任和资质相互衔接的可能。",

        meaning:
          "现实资源能够与事业责任、规则平台和专业能力发生联系，适合通过资源整合、责任承接和长期信用获得成果。",

        manifestations: [
          "看重现实结果，也重视规则和名誉。",
          "容易在资源、岗位和专业能力之间寻找平衡。",
          "做事通常不只追求收入，也在意身份和长期价值。",
          "获得资源后，往往伴随责任和约束。",
        ],

        strengths: [
          "具备资源整合和现实承接意识。",
          "事业、财富和专业积累有机会相互促进。",
          "适合在有平台、有标准的环境中发展。",
          "能够把学习经验转化为现实价值。",
        ],

        risks: [
          "资源、责任和个人能力需要匹配。",
          "同时追求多项目标时容易产生压力。",
          "若承接能力不足，资源反而可能成为负担。",
          "容易在收入、身份和稳定之间反复权衡。",
        ],

        domains: [
          "self",
          "wealth",
          "career",
          "parents",
          "property",
        ],
      }),

    day_pillar_repetition:
      createSemantic({
        ruleId:
          "day_pillar_repetition",

        title:
          "日柱参与伏吟",

        formation:
          "日柱与命局中的其他柱干支完全相同，形成重复和回响结构。",

        meaning:
          "代表自我状态与对应柱位之间存在较强的重复、呼应和反复确认，相关事情不容易轻轻带过。",

        manifestations: [
          "容易在相似问题上反复思考。",
          "某些人生课题可能以不同形式重复出现。",
          "自我感受与外部环境容易互相强化。",
          "做决定前后可能多次确认，很难草率放下。",
        ],

        strengths: [
          "专注力和持续投入能力较强。",
          "对重要问题有深入反思能力。",
          "经历重复后容易形成稳定经验。",
          "对自身立场和感受较为敏锐。",
        ],

        risks: [
          "容易自我较劲或陷入重复思路。",
          "相似矛盾可能多次出现。",
          "面对变化时不容易快速转身。",
          "对应宫位的压力可能被放大。",
        ],

        domains: [
          "self",
          "spouse",
          "career",
          "fortune",
        ],
      }),

    spouse_palace_relation_tension:
      createSemantic({
        ruleId:
          "spouse_palace_relation_tension",

        title:
          "日支关系牵动",

        formation:
          "日支参与刑、冲、害、破等关系，夫妻宫或亲密关系位置受到其他柱位牵动。",

        meaning:
          "亲密关系、合作关系和个人边界容易受到外部环境、责任分配或沟通方式影响，需要重视互动节奏。",

        manifestations: [
          "关系中比较在意位置、态度和责任。",
          "双方节奏不同容易产生摩擦。",
          "外部家庭、工作或现实压力可能进入关系。",
          "矛盾往往与边界、沟通和责任分配有关。",
        ],

        strengths: [
          "对关系变化较为敏感。",
          "愿意认真看待承诺和责任。",
          "经过磨合后容易形成明确边界。",
          "能够从关系问题中看见自身模式。",
        ],

        risks: [
          "容易出现重复争执或内在纠结。",
          "关系中可能存在拉扯和误解。",
          "情绪与现实责任容易互相影响。",
          "若沟通僵硬，关系压力会被放大。",
        ],

        domains: [
          "spouse",
          "self",
          "family",
          "friends",
        ],
      }),

    peer_wealth_competition:
      createSemantic({
        ruleId:
          "peer_wealth_competition",

        title:
          "比劫牵财",

        formation:
          "比肩、劫财与财星同时具有实际力量，合作、竞争和资源分配相互牵动。",

        meaning:
          "财富和机会容易通过同辈、朋友、合作或竞争产生，但利益边界、分工和资源归属需要提前明确。",

        manifestations: [
          "合作能够带来机会，也容易伴随竞争。",
          "收入和资源常与人际关系相连。",
          "比较重视公平、分工和实际投入。",
          "在人情与利益之间需要作出取舍。",
        ],

        strengths: [
          "具备合作、竞争和资源调动意识。",
          "容易通过人脉和同辈获得信息或机会。",
          "面对利益问题时有较强现实判断。",
          "适合在明确规则下共同做事。",
        ],

        risks: [
          "利益分配不清容易伤害关系。",
          "合伙、借贷和担保需要谨慎。",
          "容易因为人情承担额外成本。",
          "竞争心或边界问题可能影响财富稳定。",
        ],

        domains: [
          "wealth",
          "siblings",
          "friends",
          "career",
        ],
      }),

    resource_heavy_output_weak:
      createSemantic({
        ruleId:
          "resource_heavy_output_weak",

        title:
          "印重食伤弱",

        formation:
          "印星力量明显高于食神、伤官，吸收、学习和内部消化强于表达、输出和转化。",

        meaning:
          "擅长学习、理解和积累，但把知识、想法或能力稳定地表达出来，需要更多训练、环境推动和实际出口。",

        manifestations: [
          "喜欢先理解清楚，再向外表达。",
          "思考和准备往往多于立即行动。",
          "重视知识、依据和安全感。",
          "成果显化速度可能慢于内部积累速度。",
        ],

        strengths: [
          "学习和吸收能力较强。",
          "适合深入研究和长期积累。",
          "理解复杂信息时较有耐心。",
          "做事通常有准备，不容易过于草率。",
        ],

        risks: [
          "容易想得多、说得少或行动偏慢。",
          "表达和成果转化可能不够顺畅。",
          "过度准备会推迟实际推进。",
          "容易依赖熟悉环境，不愿轻易试错。",
        ],

        domains: [
          "self",
          "children",
          "career",
          "fortune",
        ],
      }),

    element_bias_visible:
      createSemantic({
        ruleId:
          "element_bias_visible",

        title:
          "五行偏性明显",

        formation:
          "原局五行分布存在明显集中和不足，旺衰差异较为突出。",

        meaning:
          "命局的性格、节奏和现实选择容易呈现鲜明倾向，优势较集中，同时也需要通过环境与行为补足短板。",

        manifestations: [
          "性格和做事方式具有较明显的固定倾向。",
          "擅长的方面容易持续强化。",
          "不熟悉或不足的方面需要主动训练。",
          "环境是否匹配，对个人状态影响较大。",
        ],

        strengths: [
          "优势方向明确，容易形成个人特色。",
          "在适合的环境中容易持续积累。",
          "做事风格较稳定。",
          "能够在熟悉领域形成深度。",
        ],

        risks: [
          "结构失衡时容易走向过度。",
          "适应不同环境的速度可能受限。",
          "强项过强可能压制其他能力。",
          "需要注意节奏、身心和现实条件的协调。",
        ],

        domains: [
          "self",
          "health",
          "career",
          "fortune",
        ],
      }),

    month_command_official:
      createSemantic({
        ruleId:
          "month_command_official",

        title:
          "月令官杀主事",

        formation:
          "月支主气落在正官或七杀，官杀力量进入月令主导位置。",

        meaning:
          "命局对规则、责任、秩序、竞争和社会评价较为敏感，人生发展容易围绕职责、岗位和现实要求展开。",

        manifestations: [
          "对责任、标准和评价较为在意。",
          "面对任务时容易产生压力感。",
          "做事重秩序，也重现实结果。",
          "职业和社会角色对个人影响较大。",
        ],

        strengths: [
          "责任意识较强。",
          "适合面对明确目标和实际任务。",
          "能够在压力中建立执行力。",
          "重视规则和社会信用。",
        ],

        risks: [
          "容易感到约束和压力。",
          "过度在意评价时会变得紧张。",
          "面对权威或竞争时容易内耗。",
          "需要平衡责任要求与个人承载能力。",
        ],

        domains: [
          "self",
          "career",
          "parents",
          "fortune",
        ],
      }),

    output_wealth_chain:
      createSemantic({
        ruleId:
          "output_wealth_chain",

        title:
          "食伤生财",

        formation:
          "食神、伤官与财星形成承接，表达、技术、作品或行动能够连接现实资源。",

        meaning:
          "个人能力需要通过输出、产品、表达、服务或解决问题转化为收入和现实成果。",

        manifestations: [
          "愿意用能力、表达或作品换取结果。",
          "重视实际产出和市场反馈。",
          "适合把专业能力转化为产品或服务。",
          "收入与个人输出效率关系较大。",
        ],

        strengths: [
          "具备成果转化和变现意识。",
          "创造、表达与现实需求容易衔接。",
          "适合凭技能、作品或服务获得资源。",
          "主动性较强时更容易看到结果。",
        ],

        risks: [
          "输出不稳定时收入也容易波动。",
          "容易为了现实结果消耗过多精力。",
          "表达过强时可能忽略规则和关系。",
          "需要兼顾质量、节奏和长期积累。",
        ],

        domains: [
          "wealth",
          "career",
          "children",
          "self",
        ],
      }),

    hurting_officer_resource_balance:
      createSemantic({
        ruleId:
          "hurting_officer_resource_balance",

        title:
          "伤官配印",

        formation:
          "伤官与印星同时具有力量，表达、判断和突破意识受到学习、依据与理性约束。",

        meaning:
          "既有独立思考、表达和质疑能力，也能够通过知识、专业和规则整理锋芒，适合解决复杂问题。",

        manifestations: [
          "有自己的判断，不容易盲从。",
          "表达通常带有分析和辨别能力。",
          "愿意质疑不合理的规则。",
          "专业积累能够提升表达的分量。",
        ],

        strengths: [
          "独立思考和学习能力兼具。",
          "适合分析、研究、策划和解决问题。",
          "能够把个性转化为专业特色。",
          "面对复杂问题时有拆解能力。",
        ],

        risks: [
          "表达过直容易引起误解。",
          "理想和现实规则之间容易冲突。",
          "内心容易一边质疑、一边自我约束。",
          "需要避免只讲道理而忽略沟通方式。",
        ],

        domains: [
          "self",
          "career",
          "children",
          "fortune",
        ],
      }),

    hurting_officer_meets_officer:
      createSemantic({
        ruleId:
          "hurting_officer_meets_officer",

        title:
          "伤官见官",

        formation:
          "伤官与正官同时具有力量，个人表达、独立判断与规则、责任和权威发生直接碰撞。",

        meaning:
          "既想按照自己的判断做事，又要面对制度、责任和他人评价，处理得好能够推动改革，处理不好容易产生冲突。",

        manifestations: [
          "不喜欢不合理的限制。",
          "面对权威时容易表达不同意见。",
          "对规则漏洞较为敏感。",
          "工作中容易遇到表达与制度的矛盾。",
        ],

        strengths: [
          "敢于指出问题。",
          "具备改进规则和流程的能力。",
          "思维独立，不容易随波逐流。",
          "适合处理需要突破和优化的问题。",
        ],

        risks: [
          "容易与权威、制度或上级产生摩擦。",
          "表达方式过强会影响职业关系。",
          "情绪化反应可能放大问题。",
          "需要学会用专业依据而非对抗推动改变。",
        ],

        domains: [
          "career",
          "self",
          "friends",
          "fortune",
        ],
      }),

    wealth_heavy_body_weak:
      createSemantic({
        ruleId:
          "wealth_heavy_body_weak",

        title:
          "财多身弱",

        formation:
          "财星力量较重，而日主承载能力相对不足，资源和现实事务超过个人当前负荷。",

        meaning:
          "机会、责任和现实需求较多，但需要先提升自身能力、节奏和稳定性，才能真正承接资源。",

        manifestations: [
          "容易同时面对多项现实任务。",
          "对收入和资源较为敏感。",
          "机会出现时也容易感到压力。",
          "承担过多事务后容易疲惫。",
        ],

        strengths: [
          "现实意识和资源意识较强。",
          "能够看见机会和市场需求。",
          "愿意为实际结果投入。",
          "在能力提升后，资源转化空间较大。",
        ],

        risks: [
          "容易贪多或承接超过能力范围的任务。",
          "财富压力可能影响生活节奏。",
          "需要防止只追求机会而忽略自身状态。",
          "合作与资源配置需要量力而行。",
        ],

        domains: [
          "wealth",
          "career",
          "self",
          "health",
        ],
      }),

    officer_killing_mixed:
      createSemantic({
        ruleId:
          "officer_killing_mixed",

        title:
          "官杀混杂",

        formation:
          "正官与七杀同时具有实际力量，稳定规则与竞争压力并存。",

        meaning:
          "命局既追求秩序、规范和稳定，也会面对竞争、变化和高压任务，需要明确主次和责任边界。",

        manifestations: [
          "既重规则，也有较强危机意识。",
          "面对任务时容易同时考虑稳定和突破。",
          "职业环境可能存在多重要求。",
          "对权责、评价和竞争较为敏感。",
        ],

        strengths: [
          "能够适应不同类型的责任。",
          "面对压力时有一定执行和应变能力。",
          "既能守规则，也能处理复杂局面。",
          "适合职责清晰且有挑战性的环境。",
        ],

        risks: [
          "多重标准容易造成内耗。",
          "权责不清时压力会明显增加。",
          "容易在服从与反抗之间摇摆。",
          "需要避免同时承担过多相互冲突的任务。",
        ],

        domains: [
          "career",
          "self",
          "parents",
          "fortune",
        ],
      }),

    day_branch_combined:
      createSemantic({
        ruleId:
          "day_branch_combined",

        title:
          "日支逢合",

        formation:
          "日支与其他地支形成合的关系，夫妻宫或自我落点与其他宫位产生连接。",

        meaning:
          "亲密关系、自我选择和现实合作容易受到其他人、家庭或环境牵引，关系中具有连接和绑定倾向。",

        manifestations: [
          "重视关系中的陪伴、合作和共同目标。",
          "重要选择容易受到关系影响。",
          "容易通过合作或关系获得支持。",
          "对关系稳定和归属感有一定需求。",
        ],

        strengths: [
          "具备合作和协调意识。",
          "关系中愿意建立共同基础。",
          "容易通过连接形成资源。",
          "对承诺和稳定关系较为重视。",
        ],

        risks: [
          "容易因关系影响个人判断。",
          "关系绑定过深时边界可能不清。",
          "外部家庭或现实条件可能介入关系。",
          "合不等于一定有利，仍需结合全局判断。",
        ],

        domains: [
          "spouse",
          "self",
          "friends",
          "family",
        ],
      }),

    metal_water_fire_weak:
      createSemantic({
        ruleId:
          "metal_water_fire_weak",

        title:
          "金水偏重、火气不足线索",

        formation:
          "原局金水力量相对集中，而火元素明显不足，寒暖与推动力存在偏差。",

        meaning:
          "思考、判断、冷静和内部积累较强，但温度、主动表达、行动推动和现实显化需要后天环境补足。",

        manifestations: [
          "做事偏谨慎，通常先观察再行动。",
          "思考细致，但启动速度可能偏慢。",
          "情绪表达相对克制。",
          "需要明确目标或外部推动才能加速。",
        ],

        strengths: [
          "冷静、理性和判断能力较强。",
          "适合分析、研究和长期思考。",
          "面对复杂信息时不容易冲动。",
          "能够在安静环境中深入积累。",
        ],

        risks: [
          "容易显得冷、慢或动力不足。",
          "行动和表达可能落后于思考。",
          "长期缺少推动时容易陷入停滞。",
          "具体轻重仍需结合调候和现实状态复核。",
        ],

        domains: [
          "self",
          "health",
          "career",
          "fortune",
        ],
      }),
  });

export function getNatalCompositionSemantic(
  ruleId,
) {
  const normalizedRuleId =
    normalizeRuleId(ruleId);

  return (
    natalCompositionSemantics[
      normalizedRuleId
    ] ?? null
  );
}

export function hasNatalCompositionSemantic(
  ruleId,
) {
  return Boolean(
    getNatalCompositionSemantic(ruleId),
  );
}

export function listNatalCompositionSemantics() {
  return Object.values(
    natalCompositionSemantics,
  );
}

function createSemantic({
  ruleId,
  title,
  formation,
  meaning,
  manifestations = [],
  strengths = [],
  risks = [],
  domains = [],
}) {
  return Object.freeze({
    ruleId:
      normalizeRuleId(ruleId),

    title:
      normalizeText(title),

    formation:
      normalizeText(formation),

    meaning:
      normalizeText(meaning),

    manifestations:
      freezeTextArray(
        manifestations,
      ),

    strengths:
      freezeTextArray(strengths),

    risks:
      freezeTextArray(risks),

    domains:
      freezeTextArray(domains),

    boundary:
      "该象只说明出生原局中的结构倾向，不直接代表某件事情必然发生；具体轻重仍需结合全局、现实反馈及时间层复核。",
  });
}

function freezeTextArray(items) {
  return Object.freeze(
    [
      ...new Set(
        (Array.isArray(items)
          ? items
          : [])
          .map(normalizeText)
          .filter(Boolean),
      ),
    ],
  );
}

function normalizeRuleId(value) {
  return String(value ?? "")
    .trim();
}

function normalizeText(value) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();
}