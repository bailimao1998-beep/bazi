const stageLabels = {
  luck: "大运",
  year: "流年",
  month: "流月",
};

const stageTimeframes = {
  luck: "十年阶段",
  year: "年度",
  month: "当月",
};

const stageSceneLimits = {
  luck: 4,
  year: 5,
  month: 4,
};

const stageRoleQuotas = {
  luck: {
    background: 2,
    trigger: 1,
    turn: 1,
    landing: 1,
  },
  year: {
    background: 2,
    trigger: 2,
    turn: 1,
    landing: 1,
  },
  month: {
    background: 1,
    trigger: 1,
    turn: 1,
    landing: 1,
  },
};

const domainGroups = {
  career: {
    label: "事业与规则",
    members: ["career", "rules", "pressure"],
    scenes: ["岗位职责或工作规则调整", "项目节点、考核与流程变得突出", "团队分工或上下级协作需要重新协调"],
  },
  wealth: {
    label: "财务与资源",
    members: ["wealth", "resource"],
    scenes: ["预算、支出或资源配置需要重新安排", "收入、机会与现实责任同时被关注", "合作分配、投入产出或临时支出成为议题"],
  },
  relationship: {
    label: "关系与合作",
    members: ["relationship", "cooperation"],
    scenes: ["合作分工或关系边界需要重新商量", "伴侣、客户或合作对象的互动节奏发生变化", "沟通、承诺与彼此期待需要重新对齐"],
  },
  family: {
    label: "家庭与根基",
    members: ["family", "foundation"],
    scenes: ["家庭安排、居住环境或长期基础被重新关注", "长辈、家中事务或根基计划需要协调", "原有生活结构出现调整、修补或重新布局"],
  },
  learning: {
    label: "学习与支持",
    members: ["learning", "support"],
    scenes: ["学习、考试、证书或资料整理成为重点", "获得帮助、保护或专业支持的需求增加", "需要先吸收信息、休整或完善准备再推进"],
  },
  expression: {
    label: "表达与成果",
    members: ["expression", "output"],
    scenes: ["内容、技术、作品或方案输出增加", "表达、展示、教学或公开沟通成为重点", "创作成果需要从想法转为可交付结果"],
  },
  execution: {
    label: "执行与落地",
    members: ["execution", "result"],
    scenes: ["项目推进、时间表或交付节奏需要调整", "后续计划、结果验收或执行任务变得集中", "临时任务与长期安排需要重新排序"],
  },
  competition: {
    label: "竞争与自主",
    members: ["competition"],
    scenes: ["竞争比较、资源争取或独立推进增强", "同辈合作与个人主张之间需要平衡", "更想自己掌控节奏，但合作成本也会上升"],
  },
  multi: {
    label: "多领域联动",
    members: [],
    scenes: ["多个生活领域同时被牵动，需要先分清主次", "一处变化可能带动关系、工作或计划连续调整", "现实事件更可能呈现连锁反应而非单点变化"],
  },
};

const rawDomainToGroup = Object.entries(domainGroups)
  .reduce((result, [groupKey, group]) => {
    group.members.forEach((member) => {
      result[member] = groupKey;
    });
    return result;
  }, {});

const tenGodImages = {
  比肩: {
    label: "自主与同辈",
    domains: ["competition", "relationship"],
    scenes: ["独立推进、坚持自己的节奏", "同辈合作、竞争比较或职责并行", "需要在自主和配合之间重新分工"],
    useful: ["保持自主判断", "利用同辈协作", "把竞争转成明确分工"],
    pressure: ["固执对抗", "重复投入", "合作成本上升"],
  },
  劫财: {
    label: "资源争取与快速行动",
    domains: ["competition", "wealth"],
    scenes: ["资源、预算或机会需要争取和重新分配", "同辈、朋友或合作方带来竞争与行动压力", "临时投入、共同支出或资源调动增加"],
    useful: ["快速应变", "整合人脉资源", "果断处理分配问题"],
    pressure: ["冲动投入", "分配争议", "同辈竞争放大"],
  },
  正印: {
    label: "学习支持与保护",
    domains: ["learning"],
    scenes: ["学习、证书、资料或专业支持成为重点", "需要借助制度、长辈或专业资源保护推进", "先准备、吸收和完善条件，再进入行动"],
    useful: ["学习吸收", "借助专业支持", "完善资料与资质"],
    pressure: ["依赖保护", "行动变慢", "准备过多而迟迟不动"],
  },
  偏印: {
    label: "独立研究与非标准方法",
    domains: ["learning", "expression"],
    scenes: ["研究、信息筛选或非标准方案增加", "需要独立思考、快速理解复杂问题", "想法较多，但需要筛选可执行方向"],
    useful: ["独立研究", "快速理解", "寻找替代方案"],
    pressure: ["想法分散", "节奏不稳", "与常规流程脱节"],
  },
  食神: {
    label: "表达、技术与成果输出",
    domains: ["expression"],
    scenes: ["内容、技术、作品或方案输出增加", "更愿意表达、展示、分享或教学", "生活节奏、舒适度和个人空间成为关注点"],
    useful: ["表达能力", "技术输出", "作品沉淀"],
    pressure: ["偏重舒适", "执行放松", "输出多但收尾不足"],
  },
  伤官: {
    label: "表达突破与规则碰撞",
    domains: ["expression", "career"],
    scenes: ["表达、技术突破或问题识别能力增强", "更容易对规则、流程或权威提出意见", "需要把批评和创新转成可执行方案"],
    useful: ["技术创新", "发现问题", "表达突破"],
    pressure: ["沟通冲突", "规则摩擦", "过度否定或急于证明"],
  },
  正财: {
    label: "现实责任与稳定积累",
    domains: ["wealth"],
    scenes: ["收入、预算、责任和现实事务需要稳定处理", "工作成果与实际回报之间的联系增强", "家庭、关系或长期承诺带来更具体的责任"],
    useful: ["务实执行", "稳定积累", "责任管理"],
    pressure: ["琐事增多", "现实负担上升", "过度追求稳定"],
  },
  偏财: {
    label: "机会、人脉与资源流动",
    domains: ["wealth", "relationship"],
    scenes: ["机会、人脉、合作资源或额外收入线索增加", "资源流动更快，需要判断投入产出", "临时邀约、支出或外部事务变多"],
    useful: ["机会捕捉", "人脉调动", "资源整合"],
    pressure: ["机会分散", "临时支出", "承诺过多"],
  },
  正官: {
    label: "岗位、规则与责任",
    domains: ["career"],
    scenes: ["岗位职责、规则、考核或正式身份成为重点", "需要按流程推进并承担可见责任", "合同、制度或外部要求对行动形成约束"],
    useful: ["规则意识", "岗位承担", "稳定推进"],
    pressure: ["责任增加", "考核压力", "行动空间受限"],
  },
  七杀: {
    label: "压力、竞争与强执行",
    domains: ["career", "competition", "execution"],
    scenes: ["期限、竞争、危机处理或高强度任务集中", "需要快速决策、承担压力并推进结果", "风险感增强，行动速度和控制力成为重点"],
    useful: ["执行力", "快速反应", "承担压力"],
    pressure: ["焦虑冒进", "强压冲突", "风险放大"],
  },
};

const relationImages = {
  冲: {
    label: "变化与重排",
    certainty: "direct",
    scenes: ["原计划被打断后重新安排", "岗位、关系或时间表发生调整", "需要移动、换位、重谈或重新分配"],
    useful: ["主动调整", "及时止损", "把变化转成重新布局"],
    pressure: ["节奏被打乱", "冲突与拉扯", "仓促决定"],
  },
  刑: {
    label: "摩擦与反复修正",
    certainty: "direct",
    scenes: ["流程卡点、规则摩擦或反复修改增加", "同一问题多次出现，需要细化边界", "内部压力和自我要求持续累积"],
    useful: ["修正流程", "明确规则", "把压力转成标准化"],
    pressure: ["内耗", "硬碰硬", "反复纠结"],
  },
  害: {
    label: "隐性阻力与沟通误差",
    certainty: "direct",
    scenes: ["表面平静但推进不够顺畅", "沟通理解、隐含条件或背后安排出现偏差", "需要确认对方真实意图和未说出口的限制"],
    useful: ["提前核对", "保留书面确认", "识别隐性条件"],
    pressure: ["暗中牵制", "误会累积", "信息不对称"],
  },
  破: {
    label: "松动、修补与重做",
    certainty: "direct",
    scenes: ["旧方案、旧关系或既定安排出现松动", "小问题反复，需要修补或重做", "原有结构被打开，进入重新组合阶段"],
    useful: ["修复旧问题", "拆解重组", "重新校准"],
    pressure: ["反复返工", "稳定性下降", "细节漏洞"],
  },
  合: {
    label: "连接、合作与牵连",
    certainty: "direct",
    scenes: ["合作、协议、关系连接或资源绑定增强", "事情被人情、承诺或合作关系牵住", "需要处理连接带来的机会和责任"],
    useful: ["建立合作", "整合资源", "形成共识"],
    pressure: ["合而有绊", "责任绑定", "推进受牵连"],
  },
  六合: {
    label: "连接、合作与牵连",
    certainty: "direct",
    scenes: ["合作、协议、关系连接或资源绑定增强", "事情被人情、承诺或合作关系牵住", "需要处理连接带来的机会和责任"],
    useful: ["建立合作", "整合资源", "形成共识"],
    pressure: ["合而有绊", "责任绑定", "推进受牵连"],
  },
  伏吟: {
    label: "旧题重现与重复加力",
    certainty: "direct",
    scenes: ["旧事、旧关系或同类任务再次出现", "相同主题被连续放大，需要重新处理", "既有模式重复，需要判断是深化还是反复"],
    useful: ["完成旧事", "深化既有方向", "复盘重复模式"],
    pressure: ["反复拖延", "同类压力叠加", "情绪或事务重复"],
  },
  自刑: {
    label: "自我拉扯与内部施压",
    certainty: "direct",
    scenes: ["自己给自己增加要求或压力", "同一问题在内部反复推演", "外部事件不大，但心理和执行负担增加"],
    useful: ["自我校正", "细化标准", "识别内在矛盾"],
    pressure: ["自我消耗", "反复焦虑", "过度控制"],
  },
  天克地冲: {
    label: "集中转折与强制调整",
    certainty: "direct",
    scenes: ["外部决定和现实环境同时发生变化", "原有安排被强制调整，出现明显转折", "需要快速处理冲突、变动和重新定位"],
    useful: ["果断调整", "结束不合适结构", "重建新秩序"],
    pressure: ["变化集中", "决策压力", "多线同时调整"],
  },
  天干相克: {
    label: "取舍与制约",
    certainty: "background",
    scenes: ["两个外显主题之间需要取舍", "一个目标对另一个目标形成约束", "行动方式受到现实条件或他人要求制约"],
    useful: ["明确优先级", "形成制衡", "减少无效投入"],
    pressure: ["选择困难", "目标互相牵制", "推进受限"],
  },
  天干五合: {
    label: "主题牵连与协商",
    certainty: "conditional",
    scenes: ["两个主题、人物或任务形成牵连", "需要通过协商、合作或关系连接推进", "存在合化条件，但不能直接按化气处理"],
    useful: ["协商连接", "寻找共同利益", "整合不同主题"],
    pressure: ["合绊", "关系牵制", "目标被绑定"],
  },
  地支同现: {
    label: "环境落点重复",
    certainty: "direct",
    scenes: ["同一环境、位置或宫位主题再次被放大", "相似场景连续出现，需要持续处理", "现实落点比外显说法更容易重复"],
    useful: ["集中处理", "持续推进", "深化已有环境"],
    pressure: ["同类事务堆积", "环境重复", "难以切换"],
  },
  天干同现: {
    label: "外显主题重复",
    certainty: "background",
    scenes: ["相同表达方式或行动主题再次出现", "同类人物、任务或目标被连续关注", "外在表现更明显，但落地仍要看地支"],
    useful: ["强化主线", "集中表达", "保持连续性"],
    pressure: ["单一主题过度放大", "重复用力", "缺少变化"],
  },
  半合条件: {
    label: "主题汇聚条件",
    certainty: "conditional",
    scenes: ["资源、人事或事务开始向同一主题聚集", "两支已形成牵连，但仍等待第三条件或现实承接", "可以观察趋势，不能直接按完整成局断事"],
    useful: ["顺势聚集资源", "观察第三条件", "建立连接"],
    pressure: ["趋势未定", "容易提前下结论", "牵连增加"],
  },
  三合局条件: {
    label: "主题集中条件",
    certainty: "conditional",
    scenes: ["多层资源和人事向同一五行主题集中", "三支齐全但仍需判断月令、透干和受制", "现实中可能出现明显聚合，但不能直接断成局"],
    useful: ["集中资源", "形成阶段主线", "借势推进"],
    pressure: ["主题过度集中", "化气条件不足", "被冲破后反复"],
  },
  三会局条件: {
    label: "季节气势集中条件",
    certainty: "conditional",
    scenes: ["环境气势和人事资源向同一方向集中", "阶段氛围明显，但仍需判断是否真正成势", "同类事务可能成批出现"],
    useful: ["顺应环境", "集中布局", "借助团队或趋势"],
    pressure: ["环境裹挟", "单向过强", "缺少平衡"],
  },
  三刑组合: {
    label: "规则压力集中",
    certainty: "conditional",
    scenes: ["规则、流程、责任或人际摩擦集中出现", "多个环节互相牵制，需要分步骤拆解", "压力可能来自制度、合作和自我要求的叠加"],
    useful: ["重建流程", "明确责任", "逐项化解"],
    pressure: ["摩擦集中", "内耗叠加", "多环节卡住"],
  },
  多层重复激活: {
    label: "同一落点多层加重",
    certainty: "combined",
    scenes: ["大运、流年或流月连续指向同一领域", "同一宫位主题容易成为阶段共同落点", "相关事务更可能从背景进入现实执行"],
    useful: ["集中处理主线", "明确优先级", "持续跟踪现实反馈"],
    pressure: ["同类问题叠加", "难以回避", "阶段注意力被占用"],
  },
  双领域联动: {
    label: "两个领域联动",
    certainty: "combined",
    scenes: ["一个领域的变化带动另一个领域同步调整", "工作、关系、家庭或执行之间出现连锁反应", "需要先分清主次，避免同时用力"],
    useful: ["统筹安排", "按主次处理", "识别连锁影响"],
    pressure: ["顾此失彼", "多线并行", "决策复杂"],
  },
  多领域联动: {
    label: "多领域连锁变化",
    certainty: "combined",
    scenes: ["多个生活领域同时被牵动", "一处调整带动工作、关系或计划连续变化", "现实更可能呈现连锁反应而非单点事件"],
    useful: ["分层处理", "统筹资源", "识别核心矛盾"],
    pressure: ["多线压力", "注意力分散", "连锁调整"],
  },
  层级同向加力: {
    label: "背景连续加力",
    certainty: "combined",
    scenes: ["大运、流年或流月沿同一主题连续放大", "原本的阶段主线更容易进入现实层面", "同类机会与压力会同时增强"],
    useful: ["顺势推进", "集中资源", "保持连续性"],
    pressure: ["主题过强", "用力过度", "缺少缓冲"],
  },
  层级牵制转向: {
    label: "背景被调整或打断",
    certainty: "combined",
    scenes: ["流年或流月对上一层背景形成调整", "原计划需要改道、暂停或重新安排", "阶段主题从持续推进转为处理冲突和修正"],
    useful: ["及时转向", "修正旧路径", "重新安排资源"],
    pressure: ["节奏中断", "方向摇摆", "调整成本"],
  },
  一边加力一边牵制: {
    label: "推进与制约并存",
    certainty: "combined",
    scenes: ["一方面机会或动力增加，另一方面现实限制同步增强", "事情能推进，但过程伴随反复、协商或调整", "适合分阶段推进，不宜一次性压满"],
    useful: ["边做边调", "保留弹性", "利用制约优化方案"],
    pressure: ["拉扯反复", "投入和回报不同步", "节奏难统一"],
  },
  层级牵连: {
    label: "上下层主题牵连",
    certainty: "combined",
    scenes: ["当前阶段与上一层背景形成连接和绑定", "事情更依赖合作、关系或既有条件", "主题被牵住，推进需要处理承诺与边界"],
    useful: ["借助已有关系", "整合背景资源", "建立协作"],
    pressure: ["牵连过多", "自主空间下降", "责任绑定"],
  },
  牵连与制约并存: {
    label: "牵连与制约并存",
    certainty: "combined",
    scenes: ["关系或合作把事情连接起来，但限制和摩擦同步出现", "需要在承诺、规则与现实成本之间反复协调", "事情不是不能推进，而是推进方式受到牵制"],
    useful: ["明确边界", "分阶段协商", "保留退出和调整空间"],
    pressure: ["合中有绊", "协商成本", "连接越深限制越多"],
  },
  五行相承: {
    label: "主题承接",
    certainty: "background",
    scenes: ["当前阶段与上一层背景在五行上存在承接", "相近主题更容易延续，但具体落点仍看地支", "外显方向保持连续，现实执行需要另行确认"],
    useful: ["保持连续性", "沿已有方向推进", "减少重复试错"],
    pressure: ["惯性过强", "忽略现实变化", "只看方向不看落地"],
  },

  拱合条件: {
    label: "主题拱合线索",
    certainty: "conditional",
    scenes: ["两端条件已出现，但关键中神尚未到位", "现实中可见主题牵连或预热，暂不宜按成局处理", "等待第三条件、月令或现实承接后再判断强度"],
    useful: ["保留观察", "等待关键条件", "避免提前定性"],
    pressure: ["趋势被高估", "过早押注", "牵连未能落地"],
  },
  拱会条件: {
    label: "方气拱势线索",
    certainty: "conditional",
    scenes: ["首尾两支出现但中间支缺位", "环境方向可能靠拢，现实推动力仍不足", "可提前准备，但不宜把趋势当作已成形"],
    useful: ["观察环境走向", "准备资源", "等待中间条件"],
    pressure: ["趋势不完整", "误判环境", "过度提前布局"],
  },
  外显主线重复: {
    label: "外显主线连续",
    certainty: "background",
    scenes: ["同类目标、表达方式或行动主题连续出现", "上一层主题在当前阶段继续被提到", "外在主线保持一致，但落地强度仍由地支决定"],
    useful: ["保持连续性", "聚焦同类目标", "减少重复试错"],
    pressure: ["重复用力", "主线过窄", "忽略现实承接"],
  },
  上层生扶当前: {
    label: "上层背景提供支持",
    certainty: "combined",
    scenes: ["大运或流年背景为当前阶段提供资源、条件或推动", "当前主题更容易获得已有环境支持", "支持是否转成成果仍要看执行与原局承接"],
    useful: ["借用已有条件", "顺势推进", "把支持转成具体成果"],
    pressure: ["依赖背景", "支持未落地", "资源使用效率不足"],
  },
  当前向上输出: {
    label: "当前层向上输出",
    certainty: "combined",
    scenes: ["当前阶段需要向上一层主线投入时间、精力或成果", "短期行动为长期目标提供内容和承接", "可能出现付出增加、成果逐步沉淀的过程"],
    useful: ["持续输出", "形成成果", "服务长期主线"],
    pressure: ["泄耗增加", "付出先于回报", "短期负担上升"],
  },
  当前制约上层: {
    label: "当前层改造上层背景",
    certainty: "combined",
    scenes: ["当前行动对原有阶段安排形成挑战或修正", "旧规则、旧计划或长期路径需要调整", "主动改变能带来突破，也会产生协调成本"],
    useful: ["主动修正", "打破旧路径", "建立新方案"],
    pressure: ["冲突升级", "调整成本", "旧新目标拉扯"],
  },
  上层约束当前: {
    label: "上层背景约束当前",
    certainty: "combined",
    scenes: ["长期环境、规则或已有责任限制当前行动", "当前阶段需要先满足既有条件再推进", "外部压力可能筛选掉不现实的方案"],
    useful: ["接受筛选", "遵循条件", "在约束内优化"],
    pressure: ["行动受限", "压力集中", "自主空间下降"],
  },
  同气并行: {
    label: "同类方向并行",
    certainty: "background",
    scenes: ["上下层五行方向相近，主题容易保持连续", "同类目标或人物同时出现", "方向一致不等于现实必然加重，仍需看地支落点"],
    useful: ["保持方向", "协同推进", "减少内耗"],
    pressure: ["同质化", "缺少变化", "重复投入"],
  },
  三会两支: {
    label: "环境聚集条件",
    certainty: "conditional",
    scenes: ["两个地支开始形成同一方气的聚集趋势", "同类环境和人事可能逐渐集中", "尚未齐全，不能直接按完整三会处理"],
    useful: ["观察环境趋势", "提前准备资源", "等待条件完整"],
    pressure: ["趋势未定", "过早押注", "环境裹挟"],
  },
};

const storyRoleOrder = {
  background: 1,
  trigger: 2,
  turn: 3,
  landing: 4,
};

export function buildTransitTriggeredImages({
  stage = "luck",
  item = {},
  structureAnalysis = item?.transitStructure ?? {},
} = {}) {
  const normalizedStage = stageLabels[stage] ? stage : "luck";
  const facts = array(structureAnalysis?.facts);
  const candidates = [
    ...buildTenGodCandidates(normalizedStage, item),
    ...facts
      .map((fact) => buildFactCandidate(normalizedStage, fact))
      .filter(Boolean),
  ];

  const ranked = mergeAndRankCandidates(candidates);
  const threads = selectStageThreads(
    ranked,
    normalizedStage,
    stageSceneLimits[normalizedStage],
  );

  const themeHierarchy = buildThemeHierarchy(ranked);

  const storyBlueprint = buildStoryBlueprint({
    stage: normalizedStage,
    item,
    threads,
    themeHierarchy,
    structureSummary: structureAnalysis?.summary,
  });

  const storyPack = buildStoryPack({
    stage: normalizedStage,
    threads,
    ranked,
    themeHierarchy,
    storyBlueprint,
  });

  return {
    stage: normalizedStage,
    timeframe: stageTimeframes[normalizedStage],
    headline: storyBlueprint.opening,
    threads,
    themeHierarchy,
    storyBlueprint,
    storyPack,
    evidenceRefs: unique([
      ...threads.flatMap((thread) => thread.evidenceRefs),
      ...storyPack.conditionalPatterns.flatMap((thread) => thread.evidenceRefs),
    ]),
    boundaries: [
      "触发取象只提供可能的现实承载场景，不把结构关系直接等同为具体事件。",
      "天干十神作为外显主线，地支主气十神作为现实承接背景；两者不得无主次地平均展开。",
      "半合、拱合、三合、三会、五合化气等条件事实只能作为辅助趋势，不能抢占主线或按成局应事。",
    ],
  };
}

function buildTenGodCandidates(stage, item) {
  const stemTenGod = item?.tenGod || item?.stemTenGod || "";
  const branchTenGod = item?.branchTenGod || item?.branchMainTenGod || "";
  const result = [];

  if (stemTenGod && stemTenGod === branchTenGod && tenGodImages[stemTenGod]) {
    const image = tenGodImages[stemTenGod];
    const groupedDomains = normalizeGroupedDomains(image.domains);
    result.push({
      id: `${stage}:image:tenGod:combined:${stemTenGod}`,
      originType: "ten_god",
      sourceLevel: "stem_and_branch",
      themeRank: 1,
      narrativePriority: "primary",
      layerRole: "外显主线兼现实承接",
      tenGod: stemTenGod,
      domains: groupedDomains,
      domain: groupedDomains[0] || "execution",
      domainLabel: combinedDomainLabel(groupedDomains),
      label: image.label,
      certainty: "background",
      status: "background",
      polarity: "mixed",
      storyRole: "background",
      strength: 3.2,
      trigger: `天干与地支主气同见${stemTenGod}`,
      summary: `${stageLabels[stage]}天干与地支主气同见${stemTenGod}，${image.label}既是外显主线，也是现实承接背景，主题集中度较高。`,
      possibleScenes: image.scenes,
      usefulDirections: image.useful,
      pressureSignals: image.pressure,
      conditions: ["同一十神上下同现只说明主题集中，是否有利仍需结合原局强弱、喜忌、制化与现实承接。"],
      evidenceRefs: [],
    });
    return result;
  }

  [
    {
      tenGod: stemTenGod,
      source: "天干十神",
      sourceLevel: "stem",
      themeRank: 1,
      narrativePriority: "primary",
      layerRole: "外显主线",
      strength: 3,
      description: "外显主线",
    },
    {
      tenGod: branchTenGod,
      source: "地支主气十神",
      sourceLevel: "branch",
      themeRank: 2,
      narrativePriority: "supporting",
      layerRole: "现实承接背景",
      strength: 1.9,
      description: "现实承接背景",
    },
  ].forEach((entry) => {
    const image = tenGodImages[entry.tenGod];
    if (!image) return;

    const groupedDomains = normalizeGroupedDomains(image.domains);

    result.push({
      id: `${stage}:image:tenGod:${entry.sourceLevel}:${entry.tenGod}`,
      originType: "ten_god",
      sourceLevel: entry.sourceLevel,
      themeRank: entry.themeRank,
      narrativePriority: entry.narrativePriority,
      layerRole: entry.layerRole,
      tenGod: entry.tenGod,
      domains: groupedDomains,
      domain: groupedDomains[0] || "execution",
      domainLabel: combinedDomainLabel(groupedDomains),
      label: image.label,
      certainty: "background",
      status: "background",
      polarity: "mixed",
      storyRole: "background",
      strength: entry.strength,
      trigger: `${entry.source}见${entry.tenGod}`,
      summary: entry.sourceLevel === "stem"
        ? `${stageLabels[stage]}以${entry.tenGod}为外显主线，${image.label}优先决定这一阶段先讲什么。`
        : `${stageLabels[stage]}地支主气见${entry.tenGod}，${image.label}作为现实环境、执行方式和落地场景的承接背景。`,
      possibleScenes: image.scenes,
      usefulDirections: image.useful,
      pressureSignals: image.pressure,
      conditions: [
        entry.sourceLevel === "branch"
          ? "地支主气是承接背景，不应与天干外显主线平均展开；需结合原局宫位关系判断具体落点。"
          : "天干只定外显主线，仍需看地支承接、原局强弱、喜忌与制化决定落地方式。",
      ],
      evidenceRefs: [],
    });
  });

  return result;
}

function buildFactCandidate(stage, fact) {
  const image = relationImages[fact?.label];
  if (!image) return null;

  const groupedDomains = normalizeGroupedDomains(fact?.domains);
  const domain = selectDomain(groupedDomains, fact?.label);
  const sourceText = String(fact?.source || "结构触发");
  const storyRole = fact?.category === "hierarchy"
    ? "turn"
    : fact?.category === "convergence"
      ? "landing"
      : fact?.category === "combination"
        ? "turn"
        : "trigger";

  const status = String(fact?.status || (
    fact?.category === "combination"
      ? "condition_only"
      : fact?.category === "hierarchy" || fact?.category === "convergence"
        ? "inferred"
        : "direct"
  ));

  const isConditional = ["condition_only", "arch_condition", "unresolved"].includes(status);
  const certainty = isConditional ? "conditional" : image.certainty;
  const rawStrength = normalizeStrength(fact?.strength, fact?.category, fact?.label);
  const strength = isConditional
    ? Math.min(rawStrength, status === "arch_condition" ? 0.9 : 1.35)
    : rawStrength;

  return {
    id: String(fact?.id || `${stage}:image:${fact?.type || fact?.label || "fact"}`),
    factId: String(fact?.id || ""),
    originType: String(fact?.category || "direct"),
    sourceLevel: inferSourceLevel(sourceText),
    themeRank: isConditional ? 9 : 3,
    narrativePriority: isConditional ? "conditional" : "evidence",
    layerRole: isConditional ? "辅助趋势条件" : "结构触发",
    status,
    polarity: String(fact?.polarity || "mixed"),
    domains: groupedDomains.length ? groupedDomains : [domain],
    domain,
    domainLabel: combinedDomainLabel(groupedDomains.length ? groupedDomains : [domain]),
    label: image.label,
    certainty,
    storyRole,
    strength,
    trigger: `${humanSource(sourceText)}见${fact?.label || "结构触发"}`,
    summary: shortText(fact?.text || `${fact?.label || "结构"}被触发。`, 110),
    possibleScenes: mergeSceneLists(
      image.scenes,
      domainGroups[domain]?.scenes || [],
    ),
    usefulDirections: isConditional ? [] : image.useful,
    pressureSignals: isConditional ? ["条件尚未完整，避免提前按结果处理"] : image.pressure,
    conditions: buildFactConditions(fact),
    evidenceRefs: fact?.id ? [String(fact.id)] : [],
  };
}

function mergeAndRankCandidates(candidates) {
  const groups = new Map();

  candidates.forEach((candidate, index) => {
    if (!candidate) return;

    const key = [
      candidate.originType,
      candidate.label,
      candidate.domain,
      candidate.storyRole,
      candidate.certainty,
      candidate.status,
      candidate.sourceLevel,
    ].join("|");

    const current = groups.get(key) || {
      ...candidate,
      order: index,
      labels: [],
      triggers: [],
      summaries: [],
      domains: [],
      possibleScenes: [],
      usefulDirections: [],
      pressureSignals: [],
      conditions: [],
      evidenceRefs: [],
    };

    current.strength = Math.max(
      Number(current.strength || 0),
      Number(candidate.strength || 0),
    );
    current.themeRank = Math.min(
      Number(current.themeRank || 99),
      Number(candidate.themeRank || 99),
    );
    current.labels.push(candidate.label);
    current.triggers.push(candidate.trigger);
    current.summaries.push(candidate.summary);
    current.domains.push(...array(candidate.domains));
    current.possibleScenes.push(...array(candidate.possibleScenes));
    current.usefulDirections.push(...array(candidate.usefulDirections));
    current.pressureSignals.push(...array(candidate.pressureSignals));
    current.conditions.push(...array(candidate.conditions));
    current.evidenceRefs.push(...array(candidate.evidenceRefs));
    groups.set(key, current);
  });

  return [...groups.values()]
    .map((entry) => {
      const domains = unique(entry.domains);
      return {
        id: entry.id,
        factId: entry.factId || "",
        originType: entry.originType,
        sourceLevel: entry.sourceLevel,
        themeRank: Number(entry.themeRank || 99),
        narrativePriority: entry.narrativePriority || "evidence",
        layerRole: entry.layerRole || "结构触发",
        tenGod: entry.tenGod || "",
        status: entry.status,
        polarity: entry.polarity,
        domains,
        domain: entry.domain,
        domainLabel: combinedDomainLabel(domains.length ? domains : [entry.domain]),
        label: unique(entry.labels).slice(0, 2).join(" / ") || entry.label,
        certainty: entry.certainty,
        storyRole: entry.storyRole,
        strength: Number(entry.strength.toFixed(2)),
        trigger: unique(entry.triggers).slice(0, 2).join("；"),
        summary: shortText(unique(entry.summaries).slice(0, 2).join(" "), 170),
        possibleScenes: unique(entry.possibleScenes).slice(0, 4),
        usefulDirections: unique(entry.usefulDirections).slice(0, 3),
        pressureSignals: unique(entry.pressureSignals).slice(0, 3),
        conditions: unique(entry.conditions).slice(0, 3),
        evidenceRefs: unique(entry.evidenceRefs),
        order: entry.order,
      };
    })
    .sort((left, right) =>
      storyRoleOrder[left.storyRole] - storyRoleOrder[right.storyRole] ||
      narrativePriorityWeight(left) - narrativePriorityWeight(right) ||
      Number(right.strength || 0) - Number(left.strength || 0) ||
      left.order - right.order,
    );
}


function selectStageThreads(candidates, stage, limit) {
  const quota = stageRoleQuotas[stage] || stageRoleQuotas.luck;
  const selected = [];
  const selectedIds = new Set();

  const add = (candidate) => {
    if (!candidate || selectedIds.has(candidate.id) || selected.length >= limit) return;
    selected.push(candidate);
    selectedIds.add(candidate.id);
  };

  /* 十神主次固定：先天干主线，再地支承接。 */
  candidates
    .filter((candidate) =>
      candidate.storyRole === "background" &&
      candidate.originType === "ten_god",
    )
    .sort((left, right) =>
      Number(left.themeRank || 99) - Number(right.themeRank || 99) ||
      Number(right.strength || 0) - Number(left.strength || 0),
    )
    .slice(0, quota.background || 0)
    .forEach(add);

  /* 直接触发和层级转折优先，条件取象不得占用主要配额。 */
  ["trigger", "turn", "landing"].forEach((role) => {
    candidates
      .filter((candidate) =>
        candidate.storyRole === role &&
        candidate.certainty !== "conditional",
      )
      .slice(0, quota[role] || 0)
      .forEach(add);
  });

  candidates
    .filter((candidate) => candidate.certainty !== "conditional")
    .forEach(add);

  /* 条件取象最多保留一条，且只作为辅助趋势。 */
  candidates
    .filter((candidate) => candidate.certainty === "conditional")
    .slice(0, 1)
    .forEach(add);

  return selected
    .slice(0, limit)
    .sort((left, right) =>
      storyRoleOrder[left.storyRole] - storyRoleOrder[right.storyRole] ||
      narrativePriorityWeight(left) - narrativePriorityWeight(right) ||
      Number(right.strength || 0) - Number(left.strength || 0),
    );
}

function buildStoryPack({
  stage,
  threads,
  ranked = [],
  themeHierarchy = {},
  storyBlueprint,
}) {
  const clone = (thread) => ({
    id: thread.id,
    factId: thread.factId || "",
    label: thread.label,
    tenGod: thread.tenGod || "",
    sourceLevel: thread.sourceLevel || "",
    themeRank: Number(thread.themeRank || 99),
    narrativePriority: thread.narrativePriority || "evidence",
    layerRole: thread.layerRole || "结构触发",
    domain: thread.domain,
    domainLabel: thread.domainLabel,
    domains: array(thread.domains),
    certainty: thread.certainty,
    status: thread.status,
    polarity: thread.polarity,
    trigger: thread.trigger,
    summary: thread.summary,
    possibleScenes: array(thread.possibleScenes),
    usefulDirections: array(thread.usefulDirections),
    pressureSignals: array(thread.pressureSignals),
    conditions: array(thread.conditions),
    evidenceRefs: array(thread.evidenceRefs),
    strength: Number(thread.strength || 0),
  });

  const conditionCandidates = ranked
    .filter((thread) => thread.certainty === "conditional")
    .sort((left, right) => Number(right.strength || 0) - Number(left.strength || 0))
    .slice(0, 3)
    .map(clone);

  return {
    schemaVersion: "stage-story-v2",
    stage,
    themeHierarchy: {
      primary: themeHierarchy.primary ? clone(themeHierarchy.primary) : null,
      supporting: themeHierarchy.supporting ? clone(themeHierarchy.supporting) : null,
      concentrated: Boolean(themeHierarchy.concentrated),
      instruction: themeHierarchy.instruction || "先讲天干外显主线，再讲地支现实承接，不得平均展开。",
    },
    background: threads
      .filter((thread) => thread.storyRole === "background")
      .map(clone),
    directTriggers: threads
      .filter((thread) =>
        thread.storyRole === "trigger" &&
        thread.certainty === "direct",
      )
      .map(clone),
    hierarchyInteractions: threads
      .filter((thread) =>
        thread.storyRole === "turn" &&
        thread.originType === "hierarchy" &&
        thread.certainty !== "conditional",
      )
      .map(clone),
    convergence: threads
      .filter((thread) =>
        thread.storyRole === "landing" &&
        thread.certainty !== "conditional",
      )
      .map(clone),
    conditionalPatterns: conditionCandidates,
    sceneThreads: threads.map(clone),
    storyOrder: {
      opening: array(storyBlueprint?.openingThreadIds),
      development: array(storyBlueprint?.developmentThreadIds),
      turn: array(storyBlueprint?.turnThreadIds),
      landing: array(storyBlueprint?.landingThreadIds),
    },
    narrationRules: [
      "开头只用 primaryTheme 定主线；supportingTheme 只解释环境、执行方式和现实承接。",
      "直接触发决定故事的发展段，层级关系决定转折段，多层汇合决定现实落点。",
      "条件取象只允许放在辅助趋势或待验证部分，不得成为标题、主结论或主要事件。",
      "同一事实只讲一次，不得在多个领域重复复述。",
    ],
    unknowns: [
      "当前故事包未单独判断原局喜忌、调候和制化结果，不能把加力直接等同为吉，把冲克直接等同为凶。",
      "合局、会局、半合、拱局和天干五合只记录条件，未确认化气。",
      "具体事件领域仍需结合现实反馈，在多个可能场景中缩小范围。",
    ],
    forbiddenClaims: [
      "不得把条件取象写成已经成局或已经化气",
      "不得把关系触发写成必然发生的具体事件",
      "不得脱离原局和大运背景单独解释流年或流月",
      "不得把天干主线与地支承接无主次地平均展开",
    ],
  };
}

function buildStoryBlueprint({
  stage,
  item,
  threads,
  themeHierarchy = {},
  structureSummary,
}) {
  const stageName = stageLabels[stage];
  const target = item?.ganZhi || stageName;
  const primary = themeHierarchy.primary || null;
  const supporting = themeHierarchy.supporting || null;
  const background = primary || threads.find((thread) => thread.storyRole === "background") || null;
  const direct = threads.find((thread) =>
    thread.storyRole === "trigger" &&
    thread.certainty === "direct",
  ) || null;
  const turn = threads.find((thread) =>
    thread.storyRole === "turn" &&
    thread.certainty !== "conditional",
  ) || null;
  const landing = threads.find((thread) =>
    thread.storyRole === "landing" &&
    thread.certainty !== "conditional",
  ) || null;

  const supportText = supporting
    ? `；地支主气以${supporting.tenGod || supporting.label}作为现实承接背景，落点偏向${supporting.domainLabel}`
    : "";

  return {
    opening: shortText(
      background
        ? `${target}${stageName}先以${background.tenGod || background.label}所代表的${background.label}为外显主线${supportText}。`
        : `${target}${stageName}先以当前十神和层级背景作为开场。`,
      140,
    ),
    development: shortText(
      direct
        ? `${direct.trigger}，故事发展优先观察${direct.possibleScenes.slice(0, 2).join("、")}。`
        : `当前未见足够强的直接关系触发，故事发展应以主线的现实承接和反馈为主。`,
      140,
    ),
    turn: shortText(
      turn
        ? `${turn.label}构成中段转折：${turn.summary}`
        : structureSummary?.tone
          ? `层级关系目前呈现“${structureSummary.tone}”，但尚未形成需要单独放大的转折。`
          : `目前未见明确层级转向。`,
      140,
    ),
    landing: shortText(
      landing
        ? `${landing.label}提示${landing.domainLabel}可能成为多个触发共同落点，应按主次处理。`
        : supporting
          ? `最终先在${supporting.domainLabel}观察主线如何落地，再用现实反馈确认。`
          : background
            ? `最终落点先围绕${background.domainLabel}观察，并用现实反馈确认是否真正承接。`
            : `${stageTimeframes[stage]}取象只提供故事线索，具体事件仍需现实反馈确认。`,
      130,
    ),
    openingThreadIds: background ? [background.id] : [],
    developmentThreadIds: direct ? [direct.id] : [],
    turnThreadIds: turn ? [turn.id] : [],
    landingThreadIds: landing ? [landing.id] : [],
    threadIds: threads.map((thread) => thread.id),
  };
}

function buildFactConditions(fact) {
  const result = [];
  const label = String(fact?.label || "");
  const status = String(fact?.status || "");

  if (
    ["condition_only", "arch_condition", "unresolved"].includes(status) ||
    /半合|拱合|三合|三会|拱会|五合/.test(label)
  ) {
    result.push("当前只确认组合、牵连或拱势条件，需结合月令、中神旺衰、透干、制化和是否被冲破判断。");
  }

  if (/伏吟|同现|重复激活/.test(label)) {
    result.push("重复只代表主题加重或反复，需看现实是否已有同类事项承接。");
  }

  if (/冲|刑|害|破|天克地冲/.test(label)) {
    result.push("压力关系不直接等同坏事，也可能表现为调整、制衡、退出或重新安排。");
  }

  if (fact?.category === "hierarchy") {
    result.push("层级判断只说明大运、流年、流月之间的承接方向，不单独决定吉凶。");
  }

  return unique(result);
}

function selectDomain(rawDomains, label) {
  if (["多领域联动", "双领域联动"].includes(label)) return "multi";

  for (const domain of array(rawDomains)) {
    if (domainGroups[domain]) return domain;
    const group = rawDomainToGroup[domain];
    if (group) return group;
  }

  if (/冲|刑|害|破|天克地冲/.test(label)) return "execution";
  if (/合|牵连|半合|拱合|三合|三会|拱会/.test(label)) return "relationship";
  return "execution";
}


function normalizeGroupedDomains(rawDomains) {
  return unique(
    array(rawDomains)
      .map((domain) => domainGroups[domain] ? domain : rawDomainToGroup[domain])
      .filter(Boolean),
  );
}

function combinedDomainLabel(domains) {
  const labels = unique(
    array(domains)
      .map((domain) => domainLabel(domain))
      .filter(Boolean),
  );

  if (!labels.length) return "现实落点";
  if (labels.length === 1) return labels[0];
  return labels.slice(0, 2).join(" / ");
}

function inferSourceLevel(source) {
  const text = String(source || "");
  if (text.includes("原局")) return "natal";
  if (text.includes("大运")) return "luck";
  if (text.includes("流年")) return "year";
  if (text.includes("流月")) return "month";
  if (text.includes("多层")) return "multi";
  return "structure";
}

function domainLabel(domain) {
  return domainGroups[domain]?.label || "现实落点";
}

function normalizeStrength(value, category, label) {
  const numeric = Number(value || 0);
  if (numeric) return numeric;
  if (category === "convergence") return 4;
  if (category === "hierarchy") return 3.6;
  if (/天克地冲|伏吟|三刑组合/.test(label || "")) return 5;
  if (/半合|拱合|三合|三会|拱会|五合/.test(label || "")) return 1.2;
  return 3;
}


function buildThemeHierarchy(candidates = []) {
  const tenGodCandidates = array(candidates)
    .filter((candidate) => candidate?.originType === "ten_god")
    .sort((left, right) =>
      Number(left?.themeRank || 99) - Number(right?.themeRank || 99) ||
      Number(right?.strength || 0) - Number(left?.strength || 0),
    );

  const primary = tenGodCandidates.find((candidate) =>
    candidate?.narrativePriority === "primary",
  ) || tenGodCandidates[0] || null;

  const supporting = tenGodCandidates.find((candidate) =>
    candidate?.narrativePriority === "supporting" &&
    candidate?.id !== primary?.id,
  ) || null;

  return {
    primary,
    supporting,
    concentrated: Boolean(primary?.sourceLevel === "stem_and_branch"),
    instruction: primary?.sourceLevel === "stem_and_branch"
      ? "天干与地支主气同见一神，先作为集中主线讲述，再用直接触发决定现实落点。"
      : "先讲天干十神的外显主线，再讲地支主气十神的现实承接；地支不得与天干平均展开。",
  };
}

function narrativePriorityWeight(candidate = {}) {
  const priority = String(candidate?.narrativePriority || "evidence");
  return {
    primary: 0,
    supporting: 1,
    evidence: 2,
    conditional: 9,
  }[priority] ?? 5;
}

function mergeSceneLists(...lists) {
  return unique(lists.flatMap((list) => array(list))).slice(0, 5);
}

function humanSource(value) {
  return String(value || "")
    .replaceAll("大运触发原局", "大运对原局")
    .replaceAll("流年触发原局", "流年对原局")
    .replaceAll("流月触发原局", "流月对原局")
    .replaceAll("多层组合", "多层组合")
    .replaceAll("层级汇合", "层级汇合")
    .replaceAll("层级关系", "层级关系");
}

function shortText(value, maxLength) {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  if (text.length <= maxLength) return text;
  return `${text.slice(0, Math.max(0, maxLength - 1))}…`;
}

function unique(values) {
  return [...new Set(array(values).map((value) => String(value || "").trim()).filter(Boolean))];
}

function array(value) {
  return Array.isArray(value) ? value : value === undefined || value === null ? [] : [value];
}
