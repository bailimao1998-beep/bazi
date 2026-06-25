export const IMAGERY_RULE_CORPUS_VERSION = "blind-bazi-imagery-kb-v1";

export const IMAGERY_SOURCE_REGISTRY = [
  {
    "id": "cui_blind_notes_5000",
    "title": "催老师催文举崔老师盲派八字笔记（5000元）",
    "school": [
      "盲派",
      "崔文举体系"
    ],
    "fileName": "催老师催文举崔老师盲派八字笔记（5000元）.pdf",
    "type": "course_notes",
    "ingestionStatus": "core_chapters_partially_structured",
    "ingestedSections": [
      "基础与干支关系",
      "十神",
      "看命顺序与体用",
      "做工与四大结构",
      "婚姻",
      "大运流年",
      "五行、十神、地支与职业像法"
    ],
    "notes": "本版本只做规则化转述，不复制长段原文；高风险断语未进入用户侧规则。"
  },
  {
    "id": "yang_advanced_blind_notes",
    "title": "杨清娟盲派体系八字《盲派八字高级班笔记》",
    "school": [
      "盲派",
      "杨清娟体系"
    ],
    "fileName": "杨清娟盲派体系八字《盲派八字高级班笔记》364页.pdf",
    "type": "advanced_course_notes",
    "ingestionStatus": "selected_core_pages_structured",
    "ingestedSections": [
      "十神类象（选页）",
      "地支作用关系总纲（选页）",
      "宾主、制用、化用、生泄用、合用、墓用目录框架"
    ],
    "notes": "扫描版仅结构化已人工核读的选页，其余章节后续分批补录。"
  },
  {
    "id": "cui_five_elements",
    "title": "崔文举 盲派八字（五行篇）W",
    "school": [
      "盲派",
      "崔文举体系"
    ],
    "fileName": "崔文举 盲派八字（五行篇）W.pdf",
    "type": "scanned_course_notes",
    "ingestionStatus": "registered_ocr_pending",
    "ingestedSections": [],
    "notes": "已登记来源，扫描文本质量不足，本版本不冒充已完成提炼。"
  },
  {
    "id": "cui_advanced_2025",
    "title": "崔老师八字精进班320页2025年",
    "school": [
      "盲派",
      "崔文举体系"
    ],
    "fileName": "崔老师八字精进班320页2025年.pdf",
    "type": "scanned_course_notes",
    "ingestionStatus": "registered_ocr_pending",
    "ingestedSections": [],
    "notes": "已登记来源，后续按章节渲染核读后再进入正式规则库。"
  },
  {
    "id": "system_synthesis",
    "title": "命理数据工程约束与多源归纳",
    "school": [
      "system"
    ],
    "type": "internal_methodology",
    "ingestionStatus": "active",
    "ingestedSections": [
      "证据分层",
      "安全边界",
      "跨层级推理纪律"
    ],
    "notes": "用于把书本经验转成可审计规则，不作为古籍或课程原文。"
  }
];

export const IMAGERY_METHODOLOGY_RULES = [
  {
    "id": "method_facts_first",
    "title": "硬事实优先于辅助结论与候选取象",
    "priority": 100,
    "instruction": "排盘、十神、藏干、岁运干支和确定关系为最高层；辅助结构、书本规则和本地取象都必须服从硬事实。",
    "appliesTo": [
      "all"
    ],
    "sourceRefs": [
      {
        "sourceId": "system_synthesis",
        "section": "证据分层"
      }
    ]
  },
  {
    "id": "method_image_before_story",
    "title": "先取象，再展开现实故事",
    "priority": 99,
    "instruction": "先归纳主象、辅象、矛盾象、条件象、反证象，再映射现实领域；禁止从一个十神直接跳到具体事件。",
    "appliesTo": [
      "all"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": 68,
        "section": "打开八字找财官：先格局、做工、取象"
      },
      {
        "sourceId": "system_synthesis",
        "section": "输出纪律"
      }
    ]
  },
  {
    "id": "method_layer_order",
    "title": "原局、大运、流年、流月分层",
    "priority": 98,
    "instruction": "原局定底色，大运定阶段背景，流年定年度触发，流月只作短期落点；不得倒置层级。",
    "appliesTo": [
      "luck",
      "year",
      "month",
      "multiYear"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": 229,
        "section": "大运定事、流年定应期"
      },
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": 244,
        "section": "流年字的力量"
      }
    ]
  },
  {
    "id": "method_month_command_root_visibility",
    "title": "先月令、根气、透藏，再谈旺衰",
    "priority": 97,
    "instruction": "旺衰必须同时检查月令、根气、透干、藏干、生扶克泄与受制状态，不能只数五行个数。",
    "appliesTo": [
      "natal",
      "luck",
      "year"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": 64,
        "section": "命局基本论：寻根基"
      },
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": 67,
        "section": "八字层次：承载财官"
      }
    ]
  },
  {
    "id": "method_source_trace",
    "title": "追根溯源与归属",
    "priority": 95,
    "instruction": "判断十神与五行时要追查其出处、根基、宫位和是否属于命主，不能只看表面出现。",
    "appliesTo": [
      "all"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": 64,
        "section": "命局基本论"
      },
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": 65,
        "section": "看命顺序"
      }
    ]
  },
  {
    "id": "method_body_use_balance",
    "title": "体用与承载能力共同判断",
    "priority": 94,
    "instruction": "先区分命主可调用的体与所求的财官等用，再判断体是否有力、用是否可得、命主是否承载得住。",
    "appliesTo": [
      "natal",
      "career",
      "wealth",
      "spouse"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": 64,
        "section": "体与用"
      },
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": 69,
        "section": "如何得到财和官"
      }
    ]
  },
  {
    "id": "method_guest_host_location",
    "title": "宫位与宾主决定现实落点",
    "priority": 93,
    "instruction": "同一十神落在家内、家外、年、月、日、时，其人物、资源归属和现实表现不同；宫位不能被省略。",
    "appliesTo": [
      "all"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": 64,
        "section": "家里与外边"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": 7,
        "section": "目录：宾主理论及宫位"
      }
    ]
  },
  {
    "id": "method_relation_not_good_bad",
    "title": "地支作用先看做功方式，不先判吉凶",
    "priority": 92,
    "instruction": "冲、合、刑、穿、墓、脆等先说明发生了什么作用、作用到谁、是否服务于做功，再判断利弊。",
    "appliesTo": [
      "all"
    ],
    "sourceRefs": [
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": 24,
        "section": "地支作用关系总纲"
      },
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": 228,
        "section": "大运基本论"
      }
    ]
  },
  {
    "id": "method_independent_evidence",
    "title": "具体事件至少两条独立依据",
    "priority": 91,
    "instruction": "同一关系换一种说法不算第二条依据；至少需要不同层级、不同角色或宫位与十神的独立汇合。",
    "appliesTo": [
      "all"
    ],
    "sourceRefs": [
      {
        "sourceId": "system_synthesis",
        "section": "事件证据纪律"
      }
    ]
  },
  {
    "id": "method_conditions_and_counterevidence",
    "title": "每个候选象必须同时检查成立条件与反证",
    "priority": 90,
    "instruction": "命中规则不等于事件成立；必须列出需要满足的条件、削弱因素、阻断因素和现实验证点。",
    "appliesTo": [
      "all"
    ],
    "sourceRefs": [
      {
        "sourceId": "system_synthesis",
        "section": "规则仲裁"
      }
    ]
  },
  {
    "id": "method_combine_not_transform",
    "title": "五合条件不等于合化成立",
    "priority": 100,
    "instruction": "天干五合先论牵连与合意；只有月令、根气、局势和化神条件充分时才讨论化气，且仍需标明条件。",
    "appliesTo": [
      "all"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": 4,
        "section": "天干五合条件"
      }
    ]
  },
  {
    "id": "method_combination_condition_levels",
    "title": "半合、拱合、三合三会区分条件层级",
    "priority": 96,
    "instruction": "两支牵连、三支齐全、得月令成势、透干化气是不同层级，不能把条件直接写成完整成局。",
    "appliesTo": [
      "all"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": 75,
        "section": "合的做工方式"
      },
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": 244,
        "section": "中神在旺点才能合成"
      }
    ]
  },
  {
    "id": "method_star_palace_relation",
    "title": "人物星、宫位与岁运必须共同核对",
    "priority": 94,
    "instruction": "婚恋、父母、子女等人物判断，不能只看一个十神；必须同时核对人物星、对应宫位、来源与岁运触发。",
    "appliesTo": [
      "spouse",
      "parents",
      "children"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": 192,
        "section": "定夫妻星"
      },
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": 204,
        "section": "结婚应期流年"
      }
    ]
  },
  {
    "id": "method_gender_spouse_roles",
    "title": "婚恋取象先按性别确定主参考星",
    "priority": 99,
    "instruction": "男命以财星为主要配偶参考，女命以官杀为主要配偶参考，同时必须结合日支与全局，不把单星机械等同配偶。",
    "appliesTo": [
      "spouse"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": 192,
        "section": "定夫妻星"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": 24,
        "section": "六亲基本原则"
      }
    ]
  },
  {
    "id": "method_transition_year_segment",
    "title": "交运年份分交运前后",
    "priority": 98,
    "instruction": "交运年份必须分别使用旧运和新运判断，不能把两步大运关系叠加成全年同时存在。",
    "appliesTo": [
      "year",
      "month"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": 229,
        "section": "交运前后变数"
      },
      {
        "sourceId": "system_synthesis",
        "section": "时间边界"
      }
    ]
  },
  {
    "id": "method_original_image_transit_trigger",
    "title": "原局有象，岁运才谈引动与改写",
    "priority": 95,
    "instruction": "先确认原局是否存在可承接结构，再判断大运流年是放大、补足、冲开、合绊、制约还是转向。",
    "appliesTo": [
      "luck",
      "year",
      "month",
      "multiYear"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": 229,
        "section": "原局字与外来字"
      },
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": 244,
        "section": "流年字的力量"
      }
    ]
  },
  {
    "id": "method_month_only_when_needed",
    "title": "流月只用于明确的月度定位",
    "priority": 89,
    "instruction": "用户未问月份时不借流月制造精确时间；问月时才结合节气月、流年和大运定位。",
    "appliesTo": [
      "month"
    ],
    "sourceRefs": [
      {
        "sourceId": "system_synthesis",
        "section": "流月按需加载"
      }
    ]
  },
  {
    "id": "method_life_stage_constraint",
    "title": "现实取象必须符合年龄与人生阶段",
    "priority": 92,
    "instruction": "相同结构在幼年、求学、工作、婚育和晚年落点不同；不知道现实背景时使用条件分支。",
    "appliesTo": [
      "all"
    ],
    "sourceRefs": [
      {
        "sourceId": "system_synthesis",
        "section": "人生阶段约束"
      }
    ]
  },
  {
    "id": "method_rule_conflict_arbitration",
    "title": "规则冲突按证据、层级和适用条件仲裁",
    "priority": 93,
    "instruction": "多条规则冲突时，优先硬事实、直接作用、当前时间层、条件完整和多源支持；单一流派候选不得压过明确反证。",
    "appliesTo": [
      "all"
    ],
    "sourceRefs": [
      {
        "sourceId": "system_synthesis",
        "section": "多源规则仲裁"
      }
    ]
  },
  {
    "id": "method_advice_must_be_grounded",
    "title": "建议必须对应主象和现实条件",
    "priority": 88,
    "instruction": "建议应针对规则、沟通、时间、资源、风险缓冲、学习或作息等具体问题，不给空泛转运承诺。",
    "appliesTo": [
      "all"
    ],
    "sourceRefs": [
      {
        "sourceId": "system_synthesis",
        "section": "建议生成纪律"
      }
    ]
  },
  {
    "id": "method_health_boundary",
    "title": "健康只谈传统倾向与现实照护",
    "priority": 100,
    "instruction": "不得仅凭命盘判断具体器官、疾病、寿命或治疗方案；只能提示作息、压力、安全和必要时就医。",
    "appliesTo": [
      "health",
      "all"
    ],
    "sourceRefs": [
      {
        "sourceId": "system_synthesis",
        "section": "医学边界"
      }
    ]
  },
  {
    "id": "method_no_absolute_claim",
    "title": "命理结论使用概率和条件表达",
    "priority": 100,
    "instruction": "不得使用必然、注定、肯定会；明确区分确定结构、专业推断、条件性可能和证据不足。",
    "appliesTo": [
      "all"
    ],
    "sourceRefs": [
      {
        "sourceId": "system_synthesis",
        "section": "不确定性表达"
      }
    ]
  }
];

export const IMAGERY_RULES = [
  {
    "id": "tg_zhengyin_balanced",
    "title": "正印：学习、保护、秩序与承接",
    "category": "ten_god",
    "domains": [
      "self",
      "parents",
      "career",
      "fortune"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "structurally_supported",
    "priority": 84,
    "gender": "all",
    "queryKeywords": [
      "学习",
      "证书",
      "学历",
      "贵人",
      "父母",
      "保护"
    ],
    "trigger": {
      "tenGodsAny": [
        "正印"
      ]
    },
    "requires": [
      "正印需结合位置、强弱与是否真正生扶日主"
    ],
    "weakeningConditions": [
      "印过旺、印被财破、印对食伤形成过度抑制"
    ],
    "imagery": {
      "core": [
        "倾向通过学习、资质、制度、长辈或专业支持获得承接"
      ],
      "positive": [
        "重视秩序、信誉、知识和稳定支持"
      ],
      "negative": [
        "过重时可能依赖保护、准备过多、行动变慢"
      ],
      "realityChecks": [
        "现实中是否持续投入学习、证照、资料与规范流程"
      ]
    },
    "advice": [
      "把支持转成可验证成果，避免只准备不行动"
    ],
    "prohibitions": [
      "不能仅见正印就断公务员、母亲吉凶或学历高低"
    ],
    "sourceRefs": [
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": 18,
        "section": "正印类象"
      },
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": 47,
        "section": "论印"
      }
    ],
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "tg_pianyin_balanced",
    "title": "偏印：研究、洞察、非常规方法与筛选",
    "category": "ten_god",
    "domains": [
      "self",
      "career",
      "fortune"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "structurally_supported",
    "priority": 82,
    "gender": "all",
    "queryKeywords": [
      "研究",
      "创意",
      "策略",
      "敏感",
      "非标准"
    ],
    "trigger": {
      "tenGodsAny": [
        "偏印"
      ]
    },
    "requires": [
      "偏印是否有用要看是否服务于理解、研究或制化"
    ],
    "weakeningConditions": [
      "偏印过旺、无输出承接、与食神形成强冲突"
    ],
    "imagery": {
      "core": [
        "倾向独立研究、快速理解复杂信息、寻找替代方案"
      ],
      "positive": [
        "敏感、机智、策略性和创造性较强"
      ],
      "negative": [
        "过重时容易孤立、想法分散、与常规流程脱节"
      ],
      "realityChecks": [
        "现实中是否更适合研究、咨询、设计、技术或非标准问题"
      ]
    },
    "advice": [
      "建立输出和复盘机制，避免只在头脑中循环"
    ],
    "prohibitions": [
      "不能仅见偏印就断宗教、孤僻或疾病"
    ],
    "sourceRefs": [
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": 19,
        "section": "偏印类象"
      }
    ],
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "tg_zhengguan_balanced",
    "title": "正官：规则、责任、正式身份与约束",
    "category": "ten_god",
    "domains": [
      "career",
      "self",
      "spouse"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "structurally_supported",
    "priority": 86,
    "gender": "all",
    "queryKeywords": [
      "规则",
      "岗位",
      "责任",
      "考试",
      "合同",
      "管理"
    ],
    "trigger": {
      "tenGodsAny": [
        "正官"
      ]
    },
    "requires": [
      "正官是否有用要看日主承载、印星承接和食伤是否破坏"
    ],
    "weakeningConditions": [
      "官弱无根、官被伤官强制、官多转杀"
    ],
    "imagery": {
      "core": [
        "规则、职责、考核、正式身份或组织关系成为主线"
      ],
      "positive": [
        "有利于规范、稳定推进和承担可见责任"
      ],
      "negative": [
        "过重时可能拘谨、压力大、行动空间受限"
      ],
      "realityChecks": [
        "现实中是否出现明确流程、合同、岗位职责或评价标准"
      ]
    },
    "advice": [
      "先确认规则和责任边界，再争取空间"
    ],
    "prohibitions": [
      "正官不自动等于升职、婚姻或公务员"
    ],
    "sourceRefs": [
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": 19,
        "section": "正官类象"
      },
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": 43,
        "section": "论官"
      }
    ],
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "tg_qisha_controlled",
    "title": "七杀：压力、执行、竞争与风险控制",
    "category": "ten_god",
    "domains": [
      "career",
      "self",
      "health"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 87,
    "gender": "all",
    "queryKeywords": [
      "压力",
      "竞争",
      "执行",
      "风险",
      "权威"
    ],
    "trigger": {
      "tenGodsAny": [
        "七杀"
      ]
    },
    "requires": [
      "必须检查是否有食伤制、印化、合杀或日主足以承载"
    ],
    "weakeningConditions": [
      "七杀无制无化、力量过强、日主无根"
    ],
    "imagery": {
      "core": [
        "强目标、竞争、期限、危机处理和执行压力增强"
      ],
      "positive": [
        "有制化时可转成决断、纪律和承担高压任务的能力"
      ],
      "negative": [
        "无制化时易表现为焦虑、冲动、强压冲突或风险放大"
      ],
      "realityChecks": [
        "现实中是否存在明确高压任务、竞争环境或风险责任"
      ]
    },
    "advice": [
      "拆分压力源、建立流程和风险缓冲，不靠硬扛"
    ],
    "prohibitions": [
      "不能仅见七杀就断灾祸、官司或暴力职业"
    ],
    "sourceRefs": [
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": 20,
        "section": "七杀类象"
      },
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": 44,
        "section": "论杀"
      }
    ],
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "tg_zhengcai_balanced",
    "title": "正财：稳定资源、现实责任与长期承诺",
    "category": "ten_god",
    "domains": [
      "wealth",
      "spouse",
      "career"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "structurally_supported",
    "priority": 85,
    "gender": "all",
    "queryKeywords": [
      "稳定收入",
      "责任",
      "妻星",
      "长期关系",
      "预算"
    ],
    "trigger": {
      "tenGodsAny": [
        "正财"
      ]
    },
    "requires": [
      "财星需结合来源、根气、日主承载与是否被比劫夺取"
    ],
    "weakeningConditions": [
      "财弱受制、财多身弱、财被合绊或来源不清"
    ],
    "imagery": {
      "core": [
        "重视稳定收入、现实事务、责任分配和可持续积累"
      ],
      "positive": [
        "务实、重承诺、善于维护稳定资源"
      ],
      "negative": [
        "过重时可能保守、琐事负担增加、过度看重确定性"
      ],
      "realityChecks": [
        "现实中是否更关注预算、固定收入、长期关系与责任"
      ]
    },
    "advice": [
      "建立长期预算和责任边界，避免把稳定变成束缚"
    ],
    "prohibitions": [
      "男命正财可作配偶候选星，但不能单独断妻子或婚期"
    ],
    "sourceRefs": [
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": 21,
        "section": "正财类象"
      },
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": 49,
        "section": "论财"
      }
    ],
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "tg_piancai_balanced",
    "title": "偏财：机会、人脉、流动资源与选择",
    "category": "ten_god",
    "domains": [
      "wealth",
      "friends",
      "spouse"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "structurally_supported",
    "priority": 83,
    "gender": "all",
    "queryKeywords": [
      "机会",
      "人脉",
      "额外收入",
      "投资",
      "桃花"
    ],
    "trigger": {
      "tenGodsAny": [
        "偏财"
      ]
    },
    "requires": [
      "偏财需结合来源、流动速度、比劫竞争和现实承载"
    ],
    "weakeningConditions": [
      "偏财过多、比劫强、无稳定承接"
    ],
    "imagery": {
      "core": [
        "外部机会、人脉、临时资源、额外收入或多种选择增加"
      ],
      "positive": [
        "善于捕捉机会、整合资源和扩大社交连接"
      ],
      "negative": [
        "过重时容易分散、投机、承诺过多或财来财去"
      ],
      "realityChecks": [
        "现实中是否频繁出现邀约、合作、临时项目和资源调动"
      ]
    },
    "advice": [
      "先筛选投入产出，再决定是否承诺"
    ],
    "prohibitions": [
      "偏财不自动等于横财、情人或发财"
    ],
    "sourceRefs": [
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": 21,
        "section": "偏财类象"
      }
    ],
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "tg_bijian_balanced",
    "title": "比肩：自主、同辈、合作与边界",
    "category": "ten_god",
    "domains": [
      "self",
      "siblings",
      "friends",
      "career"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "structurally_supported",
    "priority": 82,
    "gender": "all",
    "queryKeywords": [
      "主见",
      "合作",
      "同辈",
      "竞争",
      "独立"
    ],
    "trigger": {
      "tenGodsAny": [
        "比肩"
      ]
    },
    "requires": [
      "比肩要结合数量、旺衰、是否参与做功和财星状态"
    ],
    "weakeningConditions": [
      "比肩过旺、同类重复而无财官食伤出口"
    ],
    "imagery": {
      "core": [
        "个人主见、独立推进、同辈关系与合作边界突出"
      ],
      "positive": [
        "有利于自信、自主判断和并肩协作"
      ],
      "negative": [
        "过重时可能固执、资源重复投入、合作成本上升"
      ],
      "realityChecks": [
        "现实中是否更想自己决定，同时又必须处理同辈合作"
      ]
    },
    "advice": [
      "明确分工、权益和退出机制"
    ],
    "prohibitions": [
      "比肩不自动等于兄弟多、竞争失败或克财"
    ],
    "sourceRefs": [
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": 22,
        "section": "比肩类象"
      }
    ],
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "tg_jiecai_work_or_loss",
    "title": "劫财：资源争夺、行动力与分配风险",
    "category": "ten_god",
    "domains": [
      "wealth",
      "friends",
      "siblings",
      "spouse"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 86,
    "gender": "all",
    "queryKeywords": [
      "合伙",
      "分钱",
      "竞争",
      "朋友",
      "投资"
    ],
    "trigger": {
      "tenGodsAny": [
        "劫财"
      ]
    },
    "requires": [
      "检查劫财是否有做功、是否受官杀约束、是否有食伤转化"
    ],
    "weakeningConditions": [
      "劫财旺而无制化、财星直接暴露、资源边界模糊"
    ],
    "imagery": {
      "core": [
        "资源分配、竞争、合伙、快速行动与利益边界成为焦点"
      ],
      "positive": [
        "有做功时可表现为争取资源、带动团队和快速整合"
      ],
      "negative": [
        "无做功时容易出现冲动投入、分配争议、被分走成果"
      ],
      "realityChecks": [
        "现实中是否出现共同出资、利益分配、朋友合作或竞争"
      ]
    },
    "advice": [
      "重大合作先写清资金、职责和退出条款"
    ],
    "prohibitions": [
      "劫财不自动等于破财、离婚或小人"
    ],
    "sourceRefs": [
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": 22,
        "section": "劫财类象"
      },
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": 231,
        "section": "劫财大运"
      }
    ],
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "tg_shishen_output",
    "title": "食神：温和输出、才华、作品与生活节奏",
    "category": "ten_god",
    "domains": [
      "self",
      "career",
      "children",
      "fortune"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "structurally_supported",
    "priority": 84,
    "gender": "all",
    "queryKeywords": [
      "作品",
      "表达",
      "技术",
      "教学",
      "孩子"
    ],
    "trigger": {
      "tenGodsAny": [
        "食神"
      ]
    },
    "requires": [
      "食神是否有用要看能否泄身、生财、制杀或形成成果"
    ],
    "weakeningConditions": [
      "食神被强印压制、食神过旺而执行不足"
    ],
    "imagery": {
      "core": [
        "表达、教学、技术、作品、服务和舒适节奏成为主线"
      ],
      "positive": [
        "有利于温和输出、创造价值和形成可交付成果"
      ],
      "negative": [
        "过重时可能偏舒适、收尾不足或回避压力"
      ],
      "realityChecks": [
        "现实中是否更愿意分享、创作、教学或做长期作品"
      ]
    },
    "advice": [
      "把兴趣转成固定产出和完成节点"
    ],
    "prohibitions": [
      "食神不自动等于孩子、口福或发财"
    ],
    "sourceRefs": [
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": 23,
        "section": "食神类象"
      },
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": 50,
        "section": "论食伤"
      }
    ],
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "tg_shangguan_channelled",
    "title": "伤官：表达突破、创新与规则碰撞",
    "category": "ten_god",
    "domains": [
      "self",
      "career",
      "spouse"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 86,
    "gender": "all",
    "queryKeywords": [
      "创新",
      "表达",
      "自由",
      "冲突",
      "规则"
    ],
    "trigger": {
      "tenGodsAny": [
        "伤官"
      ]
    },
    "requires": [
      "检查伤官是否生财、制杀、配印或直接冲击正官"
    ],
    "weakeningConditions": [
      "伤官过旺、无财印承接、与官星正面冲突"
    ],
    "imagery": {
      "core": [
        "批判、创新、表达、技术突破和不愿受束缚的需求增强"
      ],
      "positive": [
        "有承接时可转成创造力、问题识别和改革能力"
      ],
      "negative": [
        "无承接时可能尖锐、冲动表达、与规则或关系发生摩擦"
      ],
      "realityChecks": [
        "现实中是否因表达方式、流程意见或自由需求产生冲突"
      ]
    },
    "advice": [
      "先把批评转成方案，再公开表达"
    ],
    "prohibitions": [
      "伤官不自动等于离婚、官司或反社会"
    ],
    "sourceRefs": [
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": 23,
        "section": "伤官类象"
      },
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": 43,
        "section": "食伤克官"
      }
    ],
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "rel_clash_rearrangement",
    "title": "冲：变化、换位与重新安排",
    "category": "relation",
    "domains": [
      "movement",
      "career",
      "spouse",
      "self"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "A",
    "certainty": "direct",
    "priority": 90,
    "gender": "all",
    "queryKeywords": [
      "冲",
      "变化",
      "搬家",
      "变动"
    ],
    "trigger": {
      "relationsAny": [
        "冲"
      ]
    },
    "requires": [
      "必须说明冲到哪一柱、哪一星、哪一时间层"
    ],
    "weakeningConditions": [
      "冲到无关位置、双方力量悬殊、没有现实承接"
    ],
    "imagery": {
      "core": [
        "既有结构被拉开，原计划、位置、关系或节奏需要重排"
      ],
      "positive": [
        "可主动调整、搬移、换位、重新分工"
      ],
      "negative": [
        "也可能表现为拉扯、冲突、仓促变化"
      ],
      "realityChecks": [
        "现实中是否出现计划重排、环境变化或关系重新协商"
      ]
    },
    "advice": [
      "预留时间与方案缓冲，先确认冲动的是哪个领域"
    ],
    "prohibitions": [
      "冲不自动等于灾、搬家、离婚或手术"
    ],
    "sourceRefs": [
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": 24,
        "section": "地支作用关系总纲"
      },
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": 9,
        "section": "六冲"
      }
    ],
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "rel_combine_binding",
    "title": "合：连接、牵连、合作与合绊",
    "category": "relation",
    "domains": [
      "friends",
      "spouse",
      "career",
      "wealth"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "A",
    "certainty": "direct",
    "priority": 89,
    "gender": "all",
    "queryKeywords": [
      "合",
      "合作",
      "绑定",
      "结婚"
    ],
    "trigger": {
      "relationsAny": [
        "合",
        "六合",
        "天干五合"
      ]
    },
    "requires": [
      "检查谁与谁合、归属、力量和是否被合绊"
    ],
    "weakeningConditions": [
      "合而不化、争合、多重合、被其他关系冲破"
    ],
    "imagery": {
      "core": [
        "人事、资源、承诺或目标产生连接与绑定"
      ],
      "positive": [
        "可形成合作、协议、关系靠近或资源整合"
      ],
      "negative": [
        "也可能被承诺、人情或多方关系牵住"
      ],
      "realityChecks": [
        "现实中是否出现合作、邀约、承诺或难以脱身的绑定"
      ]
    },
    "advice": [
      "明确权责与退出条件，避免把连接等同结果"
    ],
    "prohibitions": [
      "合不自动等于结婚、和好、发财或合化"
    ],
    "sourceRefs": [
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": 24,
        "section": "地支作用关系总纲"
      },
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": 7,
        "section": "六合"
      }
    ],
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "rel_punishment_revision",
    "title": "刑：摩擦、规范压力与反复修正",
    "category": "relation",
    "domains": [
      "self",
      "career",
      "spouse"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "A",
    "certainty": "direct",
    "priority": 87,
    "gender": "all",
    "queryKeywords": [
      "刑",
      "自刑",
      "纠结",
      "反复"
    ],
    "trigger": {
      "relationsAny": [
        "刑",
        "自刑"
      ]
    },
    "requires": [
      "必须区分自刑、三刑、两支刑及所落宫位"
    ],
    "weakeningConditions": [
      "刑关系弱、未被岁运激活、现实无对应压力"
    ],
    "imagery": {
      "core": [
        "同一问题反复出现，需要修正规则、边界或流程"
      ],
      "positive": [
        "可转成标准化、反复打磨和自我校正"
      ],
      "negative": [
        "也可能表现为内耗、纠结、流程卡点和硬碰硬"
      ],
      "realityChecks": [
        "现实中是否有反复修改、重复矛盾或自我要求上升"
      ]
    },
    "advice": [
      "把反复问题写成流程清单，减少情绪化应对"
    ],
    "prohibitions": [
      "刑不自动等于牢狱、疾病、流产或伤灾"
    ],
    "sourceRefs": [
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": 24,
        "section": "地支作用关系总纲"
      }
    ],
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "rel_harm_hidden_friction",
    "title": "害：隐性阻力、误解与不顺畅",
    "category": "relation",
    "domains": [
      "friends",
      "spouse",
      "career",
      "parents"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "A",
    "certainty": "direct",
    "priority": 84,
    "gender": "all",
    "queryKeywords": [
      "害",
      "穿",
      "暗中",
      "误会"
    ],
    "trigger": {
      "relationsAny": [
        "害",
        "穿"
      ]
    },
    "requires": [
      "说明双方关系、宫位与是否存在信息不对称"
    ],
    "weakeningConditions": [
      "关系未激活、现实沟通顺畅、存在强支持结构"
    ],
    "imagery": {
      "core": [
        "表面不一定剧烈，但容易有隐含条件、误会或推进不顺"
      ],
      "positive": [
        "可提前识别风险、核对细节和隐含要求"
      ],
      "negative": [
        "也可能形成暗中牵制、沟通偏差和不舒服感"
      ],
      "realityChecks": [
        "现实中是否出现说不清、信息不全、承诺落差"
      ]
    },
    "advice": [
      "保留书面确认，主动问清隐含条件"
    ],
    "prohibitions": [
      "害或穿不自动等于背叛、死亡或疾病"
    ],
    "sourceRefs": [
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": 24,
        "section": "地支作用关系总纲"
      },
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": 11,
        "section": "六穿"
      }
    ],
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "rel_break_loosen_rework",
    "title": "破：松动、漏洞、修补与重做",
    "category": "relation",
    "domains": [
      "career",
      "spouse",
      "wealth",
      "movement"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "A",
    "certainty": "direct",
    "priority": 83,
    "gender": "all",
    "queryKeywords": [
      "破",
      "反复",
      "返工",
      "松动"
    ],
    "trigger": {
      "relationsAny": [
        "破"
      ]
    },
    "requires": [
      "检查被破的是宫位、资源、关系还是执行结构"
    ],
    "weakeningConditions": [
      "破关系没有进入当前时间层、同时存在强合或生扶"
    ],
    "imagery": {
      "core": [
        "旧安排出现松动，小问题反复，需要拆解重组"
      ],
      "positive": [
        "可借机修补旧问题、更新结构和重新校准"
      ],
      "negative": [
        "也可能表现为返工、稳定性下降和细节漏洞"
      ],
      "realityChecks": [
        "现实中是否有反复修补、承诺松动或计划重做"
      ]
    },
    "advice": [
      "先处理漏洞，再扩大行动"
    ],
    "prohibitions": [
      "破不自动等于分手、破产、搬家或疾病"
    ],
    "sourceRefs": [
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": 24,
        "section": "地支作用关系总纲"
      },
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": 19,
        "section": "支见支详解"
      }
    ],
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "pattern_wealth_breaks_resource",
    "title": "财与印冲突：现实资源和支持体系的拉扯",
    "category": "pattern",
    "domains": [
      "wealth",
      "career",
      "parents",
      "self"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "C",
    "certainty": "conditional",
    "priority": 88,
    "gender": "all",
    "queryKeywords": [
      "财破印",
      "学历",
      "父母",
      "辞职",
      "稳定与赚钱"
    ],
    "trigger": {
      "tenGodsAll": [
        "正财|偏财",
        "正印|偏印"
      ],
      "featuresAny": [
        "财破印"
      ]
    },
    "requires": [
      "财与印必须真实发生克制或破坏，且印承担重要功能"
    ],
    "weakeningConditions": [
      "财印力量均弱、仅同时出现但无作用、印可被合护或通关"
    ],
    "imagery": {
      "core": [
        "现实利益、收入、选择与学习、资质、支持或稳定体系发生冲突"
      ],
      "positive": [
        "可表现为从依赖支持转向独立经营，或用知识技术变现"
      ],
      "negative": [
        "也可能出现资源投入压缩学习准备、信誉或支持关系"
      ],
      "realityChecks": [
        "现实中是否在赚钱与学习、稳定与自主之间反复取舍"
      ]
    },
    "advice": [
      "先判断印承担的核心功能，再决定是否牺牲稳定支持"
    ],
    "prohibitions": [
      "不能直接断牢狱、父母死亡、离婚或疾病"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": 80,
        "section": "财破印条件"
      },
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": 83,
        "section": "财破印类象"
      }
    ],
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "pattern_resource_suppresses_output",
    "title": "枭印与食伤冲突：输入保护压制输出",
    "category": "pattern",
    "domains": [
      "career",
      "self",
      "children",
      "wealth"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "C",
    "certainty": "conditional",
    "priority": 88,
    "gender": "all",
    "queryKeywords": [
      "枭夺食",
      "输出受阻",
      "学习",
      "作品",
      "转行"
    ],
    "trigger": {
      "tenGodsAll": [
        "正印|偏印",
        "食神|伤官"
      ],
      "featuresAny": [
        "枭夺食",
        "印制食伤"
      ]
    },
    "requires": [
      "印枭必须真实克制食伤，且食伤承担输出、生财或制杀功能"
    ],
    "weakeningConditions": [
      "日主弱而食伤过旺、印对食伤属于必要修正、存在财制印"
    ],
    "imagery": {
      "core": [
        "准备、保护、规范与表达、技术、作品或自由度发生拉扯"
      ],
      "positive": [
        "适度时可形成学习后输出、标准化技术和专业沉淀"
      ],
      "negative": [
        "过度时可能想法被压、成果难落地、行业或表达方式调整"
      ],
      "realityChecks": [
        "现实中是否出现学得多做得少、方案被流程压住或输出受阻"
      ]
    },
    "advice": [
      "给输入设置截止时间，并保留固定输出窗口"
    ],
    "prohibitions": [
      "不能直接断抑郁、牢狱、流产、车祸或死亡"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": 87,
        "section": "枭神夺食条件"
      },
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": 89,
        "section": "枭夺食化解"
      }
    ],
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "pattern_peer_competes_wealth",
    "title": "比劫与财冲突：资源分配和竞争",
    "category": "pattern",
    "domains": [
      "wealth",
      "spouse",
      "friends",
      "career"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "C",
    "certainty": "conditional",
    "priority": 89,
    "gender": "all",
    "queryKeywords": [
      "劫财见财",
      "合伙",
      "竞争",
      "分成",
      "感情竞争"
    ],
    "trigger": {
      "tenGodsAll": [
        "比肩|劫财",
        "正财|偏财"
      ],
      "featuresAny": [
        "劫财见财",
        "比劫见财"
      ]
    },
    "requires": [
      "比劫与财必须发生实际争夺、克制或共同分配"
    ],
    "weakeningConditions": [
      "有官杀约束比劫、有食伤转化、财星有强根且边界清楚"
    ],
    "imagery": {
      "core": [
        "个人、同辈、合作方与资源、收益或关系责任之间存在分配问题"
      ],
      "positive": [
        "有制化时可形成团队争取资源、合作经营和快速扩张"
      ],
      "negative": [
        "无制化时可能利益争议、重复投入、成果被分走或感情竞争"
      ],
      "realityChecks": [
        "现实中是否出现合伙、共同支出、佣金分成或竞争者"
      ]
    },
    "advice": [
      "合作前明确资金、职责、分成和退出机制"
    ],
    "prohibitions": [
      "不能直接断破财、被朋友骗、第三者或离婚"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": 194,
        "section": "劫财见财看婚姻"
      },
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": 231,
        "section": "劫财大运"
      }
    ],
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "pattern_output_challenges_official",
    "title": "伤官与官冲突：表达创新挑战规则",
    "category": "pattern",
    "domains": [
      "career",
      "self",
      "spouse"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "C",
    "certainty": "conditional",
    "priority": 89,
    "gender": "all",
    "queryKeywords": [
      "伤官见官",
      "规则冲突",
      "辞职",
      "创新"
    ],
    "trigger": {
      "tenGodsAll": [
        "伤官",
        "正官|七杀"
      ],
      "featuresAny": [
        "伤官见官",
        "伤官制官"
      ]
    },
    "requires": [
      "必须确认伤官和官杀力量、位置与是否存在财印通关"
    ],
    "weakeningConditions": [
      "伤官生财后形成现实成果、印星适度承接、官杀本身无力"
    ],
    "imagery": {
      "core": [
        "个人表达、技术创新或自由需求与制度、岗位、权威发生拉扯"
      ],
      "positive": [
        "有承接时可形成改革、专业监督、技术解决规则问题"
      ],
      "negative": [
        "无承接时可能沟通冲突、评价受损、方向频繁变化"
      ],
      "realityChecks": [
        "现实中是否因表达方式、流程意见或权威关系出现摩擦"
      ]
    },
    "advice": [
      "先形成证据和方案，再挑战规则"
    ],
    "prohibitions": [
      "不能直接断官司、牢狱、离婚或失业"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": 43,
        "section": "食伤克官"
      },
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": 67,
        "section": "四个不良组合"
      }
    ],
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "work_control_use",
    "title": "制用：通过克制、管理或筛选取得目标",
    "category": "work_method",
    "domains": [
      "career",
      "wealth",
      "self"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "C",
    "certainty": "conditional",
    "priority": 87,
    "gender": "all",
    "queryKeywords": [
      "制用",
      "管理",
      "控制",
      "解决问题"
    ],
    "trigger": {
      "featuresAny": [
        "制用",
        "制财",
        "制官",
        "制杀",
        "制印",
        "制食伤"
      ]
    },
    "requires": [
      "制者有力、被制对象真实可用、制而不过且形成结果"
    ],
    "weakeningConditions": [
      "制者无根、被制对象过强、反制、制坏命主关键承载"
    ],
    "imagery": {
      "core": [
        "通过管理、竞争、技术控制、规则约束或筛选获得资源和位置"
      ],
      "positive": [
        "可形成执行力、管理力、风险处理和专业控制能力"
      ],
      "negative": [
        "制过头会变成冲突、损耗或把可用资源一起破坏"
      ],
      "realityChecks": [
        "现实中是否靠解决难题、管控流程或控制质量获得成果"
      ]
    },
    "advice": [
      "先确认控制对象和边界，避免把“压住”当成“得到”"
    ],
    "prohibitions": [
      "不能只见相克就说制用成立"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": 67,
        "section": "做工与得到财官"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": 7,
        "section": "目录：制用结构做功"
      }
    ],
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "work_transform_use",
    "title": "化用：通过生化承接压力与资源",
    "category": "work_method",
    "domains": [
      "career",
      "self",
      "fortune"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "C",
    "certainty": "conditional",
    "priority": 88,
    "gender": "all",
    "queryKeywords": [
      "化官生印",
      "杀印相生",
      "平台",
      "资质"
    ],
    "trigger": {
      "featuresAny": [
        "化用",
        "官生印",
        "杀印相生",
        "化官生印"
      ]
    },
    "requires": [
      "生化链条连续、各角色有力、最终能回到命主或目标"
    ],
    "weakeningConditions": [
      "链条中断、被财破印、印过旺堵塞、官杀无源"
    ],
    "imagery": {
      "core": [
        "把外部压力、规则或资源转成学习、资质、权力或支持"
      ],
      "positive": [
        "有利于在组织中获得承接、专业认可和稳定成长"
      ],
      "negative": [
        "链条中断时可能只有压力或名义，没有实际承接"
      ],
      "realityChecks": [
        "现实中是否通过资质、平台、导师或制度将压力转成机会"
      ]
    },
    "advice": [
      "优先补齐链条中最弱的一环"
    ],
    "prohibitions": [
      "不能看到官印同时出现就正式定格"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": 67,
        "section": "化官生印"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": 7,
        "section": "目录：化用结构做功"
      }
    ],
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "work_generate_discharge_use",
    "title": "生用与泄用：通过输出、流通和成果转化",
    "category": "work_method",
    "domains": [
      "career",
      "wealth",
      "children",
      "self"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "C",
    "certainty": "conditional",
    "priority": 86,
    "gender": "all",
    "queryKeywords": [
      "食伤生财",
      "输出",
      "作品",
      "变现"
    ],
    "trigger": {
      "featuresAny": [
        "生用",
        "泄用",
        "食伤生财",
        "食神泄秀"
      ]
    },
    "requires": [
      "输出端有力、目标端可承接、链条没有被强印或比劫截断"
    ],
    "weakeningConditions": [
      "食伤被制、财星无根、输出过多而不落地"
    ],
    "imagery": {
      "core": [
        "通过表达、技术、作品、服务或产品把能力转成资源"
      ],
      "positive": [
        "可形成内容、技术、教学、销售和成果变现"
      ],
      "negative": [
        "链条不完整时容易输出很多、回报不稳或只停留在想法"
      ],
      "realityChecks": [
        "现实中是否能把知识、技术或作品转成可交付和回报"
      ]
    },
    "advice": [
      "建立固定交付、反馈和变现路径"
    ],
    "prohibitions": [
      "不能只见食伤与财就断发财"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": 67,
        "section": "食伤生财与食神泄秀"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": 7,
        "section": "目录：生用、泄用结构做功"
      }
    ],
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "work_combine_use",
    "title": "合用：通过连接、协议和资源绑定取得目标",
    "category": "work_method",
    "domains": [
      "career",
      "wealth",
      "spouse",
      "friends"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "C",
    "certainty": "conditional",
    "priority": 86,
    "gender": "all",
    "queryKeywords": [
      "合用",
      "合作",
      "签约",
      "客户",
      "伴侣"
    ],
    "trigger": {
      "featuresAny": [
        "合用",
        "合财",
        "合官",
        "合杀"
      ],
      "relationsAny": [
        "合",
        "六合",
        "天干五合"
      ]
    },
    "requires": [
      "合的双方真实存在、归属明确、合后目标仍可用"
    ],
    "weakeningConditions": [
      "争合、合绊、合而不化、目标被他人占有或合后失去功能"
    ],
    "imagery": {
      "core": [
        "通过合作、协议、关系、平台或资源整合获得目标"
      ],
      "positive": [
        "可形成签约、合作、关系连接和共同推进"
      ],
      "negative": [
        "也可能因承诺和人情产生合绊与依赖"
      ],
      "realityChecks": [
        "现实中是否通过合作方、客户、伴侣或平台获得机会"
      ]
    },
    "advice": [
      "先写清合作边界与成果归属"
    ],
    "prohibitions": [
      "不能只见合就断得到、结婚或升职"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": 65,
        "section": "合财合官"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": 7,
        "section": "目录：合用结构做功"
      }
    ],
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "work_storage_use",
    "title": "墓库用：资源储存、打开、收纳与释放",
    "category": "work_method",
    "domains": [
      "wealth",
      "career",
      "property",
      "parents"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "C",
    "certainty": "conditional",
    "priority": 84,
    "gender": "all",
    "queryKeywords": [
      "墓库",
      "开库",
      "房产",
      "库存",
      "隐藏资源"
    ],
    "trigger": {
      "featuresAny": [
        "墓库",
        "开库",
        "闭库",
        "入墓"
      ],
      "branchesAny": [
        "辰",
        "戌",
        "丑",
        "未"
      ]
    },
    "requires": [
      "必须确认库中所藏、开库工具、开后是释放还是收走"
    ],
    "weakeningConditions": [
      "把所有辰戌丑未都当库、忽略藏干与归属、只见冲就断开库"
    ],
    "imagery": {
      "core": [
        "资源、人物或能力处于储存、封闭、释放或重新归集状态"
      ],
      "positive": [
        "条件合适可表现为资源释放、资产盘活或隐藏能力被调用"
      ],
      "negative": [
        "条件不合适可能只是封闭、收纳、延迟或资源被带走"
      ],
      "realityChecks": [
        "现实中是否出现资产、库存、资质、旧项目或家族资源被重新启用"
      ]
    },
    "advice": [
      "先核对库中具体内容，再判断冲合的方向"
    ],
    "prohibitions": [
      "不能只见墓库冲刑就断发财、死亡或灾祸"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": 23,
        "section": "墓库"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": 7,
        "section": "目录：墓库高级运用"
      }
    ],
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "work_hidden_stem_activation",
    "title": "藏干透出或被岁运引动后作用增强",
    "category": "work_method",
    "domains": [
      "general",
      "career",
      "wealth",
      "spouse"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "C",
    "certainty": "conditional",
    "priority": 82,
    "gender": "all",
    "queryKeywords": [
      "藏干",
      "透出",
      "出现",
      "引动"
    ],
    "trigger": {
      "featuresAny": [
        "藏干",
        "透干",
        "翻天",
        "见根"
      ]
    },
    "requires": [
      "确认藏干确实存在、透出年份正确、与原局有承接"
    ],
    "weakeningConditions": [
      "只凭藏干存在就当作已经做功、透出后被合绊或无根"
    ],
    "imagery": {
      "core": [
        "原本隐性的角色、资源或关系在岁运中变得可见和可操作"
      ],
      "positive": [
        "可表现为隐藏机会、人物或能力浮出水面"
      ],
      "negative": [
        "也可能把原局潜在矛盾带到现实层面"
      ],
      "realityChecks": [
        "现实中是否有原本不明显的人事、技能或资源突然被提起"
      ]
    },
    "advice": [
      "区分“出现”与“真正取得”"
    ],
    "prohibitions": [
      "不能把所有藏干都当成现实中已经发生的事"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": 69,
        "section": "藏干出来时做工"
      }
    ],
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "palace_year_foundation",
    "title": "年柱：早年、根基与外层家庭背景",
    "category": "palace",
    "domains": [
      "parents",
      "fortune",
      "movement"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "candidate",
    "priority": 72,
    "gender": "all",
    "queryKeywords": [
      "父母",
      "早年",
      "家庭",
      "祖上"
    ],
    "trigger": {
      "featuresAny": [
        "年柱",
        "年支",
        "年干"
      ]
    },
    "requires": [
      "必须与人物星、十神和具体关系共同使用"
    ],
    "weakeningConditions": [
      "只凭年柱一字直接断父母事件"
    ],
    "imagery": {
      "core": [
        "更偏早年环境、家族根基、外部背景与远层关系"
      ],
      "positive": [],
      "negative": [],
      "realityChecks": [
        "相关关系是否主要落在早年、家族或外部环境"
      ]
    },
    "advice": [
      "把年柱当背景，不替代人物星判断"
    ],
    "prohibitions": [
      "不能单凭年柱断父亲、母亲吉凶"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": 64,
        "section": "家里外边与宫位"
      }
    ],
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "palace_month_environment",
    "title": "月柱：成长秩序、事业环境与父母承接",
    "category": "palace",
    "domains": [
      "parents",
      "career",
      "self"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "candidate",
    "priority": 75,
    "gender": "all",
    "queryKeywords": [
      "月令",
      "事业环境",
      "父母",
      "成长"
    ],
    "trigger": {
      "featuresAny": [
        "月柱",
        "月支",
        "月干",
        "月令"
      ]
    },
    "requires": [
      "月令与月柱角色要分开，结合十神和关系"
    ],
    "weakeningConditions": [
      "只凭月柱直接断职业或父母事件"
    ],
    "imagery": {
      "core": [
        "更偏成长环境、工作学习秩序、社会规则和近层家庭承接"
      ],
      "positive": [],
      "negative": [],
      "realityChecks": [
        "相关主题是否集中在工作学习环境、父母要求或组织规则"
      ]
    },
    "advice": [
      "月柱被岁运触发时优先观察环境和规则变化"
    ],
    "prohibitions": [
      "不能把月柱所有变化都解释成事业"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": 65,
        "section": "看命顺序与月上"
      }
    ],
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "palace_day_self_spouse",
    "title": "日柱与日支：自身、亲密关系和合作落点",
    "category": "palace",
    "domains": [
      "self",
      "spouse",
      "friends"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "structurally_supported",
    "priority": 85,
    "gender": "all",
    "queryKeywords": [
      "夫妻宫",
      "日支",
      "婚姻",
      "合作"
    ],
    "trigger": {
      "featuresAny": [
        "日柱",
        "日支",
        "夫妻宫"
      ]
    },
    "requires": [
      "必须结合日主、配偶星和实际作用关系"
    ],
    "weakeningConditions": [
      "只见日支冲合就直接断婚变"
    ],
    "imagery": {
      "core": [
        "日柱更贴近命主自身状态，日支常作为亲密关系与合作模式的重要落点"
      ],
      "positive": [],
      "negative": [],
      "realityChecks": [
        "日支被岁运引动时，现实中是否出现关系、合作或自我状态变化"
      ]
    },
    "advice": [
      "优先核对关系边界和双方承载能力"
    ],
    "prohibitions": [
      "日支被动不自动等于结婚、离婚或同居"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": 192,
        "section": "定夫妻星与家里财官"
      }
    ],
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "palace_hour_output_result",
    "title": "时柱：执行、成果、后期规划与子女层",
    "category": "palace",
    "domains": [
      "children",
      "career",
      "fortune"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "candidate",
    "priority": 74,
    "gender": "all",
    "queryKeywords": [
      "时柱",
      "子女",
      "成果",
      "后期"
    ],
    "trigger": {
      "featuresAny": [
        "时柱",
        "时支",
        "时干"
      ]
    },
    "requires": [
      "结合食伤、子女星、做工和年龄阶段"
    ],
    "weakeningConditions": [
      "把所有时柱触发都解释成子女"
    ],
    "imagery": {
      "core": [
        "更偏执行结果、项目后续、晚期规划、作品或子女层面"
      ],
      "positive": [],
      "negative": [],
      "realityChecks": [
        "现实中是否落在执行、成果、后续安排或子女事务"
      ]
    },
    "advice": [
      "区分成果层与子女层，不强行二选一"
    ],
    "prohibitions": [
      "时柱不自动等于子女或晚年事件"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": 74,
        "section": "日落归时"
      }
    ],
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "spouse_gender_primary_star",
    "title": "配偶星按性别确定主要参考，但不单独定人",
    "category": "relationship",
    "domains": [
      "spouse"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "structurally_supported",
    "priority": 96,
    "gender": "all",
    "queryKeywords": [
      "配偶星",
      "妻星",
      "夫星",
      "对象"
    ],
    "trigger": {
      "featuresAny": [
        "配偶星",
        "夫妻星",
        "财星",
        "官杀"
      ]
    },
    "requires": [
      "男命财星、女命官杀只是主要参考，还需日支、来源、强弱与岁运"
    ],
    "weakeningConditions": [
      "星过弱、被制、多人多源、宫位无承接"
    ],
    "imagery": {
      "core": [
        "配偶相关人物与关系责任由主参考星提供线索"
      ],
      "positive": [],
      "negative": [],
      "realityChecks": [
        "现实中对象特征是否与对应十神的责任、资源或规则主题有关"
      ]
    },
    "advice": [
      "不要只凭一颗星选择对象或判断婚期"
    ],
    "prohibitions": [
      "不能把男命官杀或女命财星默认当配偶"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": 192,
        "section": "定夫妻星"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": 24,
        "section": "六亲基本原则"
      }
    ],
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "spouse_star_and_palace",
    "title": "感情判断必须同时检查配偶星与日支",
    "category": "relationship",
    "domains": [
      "spouse"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "structurally_supported",
    "priority": 95,
    "gender": "all",
    "queryKeywords": [
      "感情年份",
      "结婚",
      "夫妻宫"
    ],
    "trigger": {
      "featuresAny": [
        "夫妻宫",
        "日支",
        "配偶星"
      ]
    },
    "requires": [
      "星说明人物与关系资源，宫位说明关系落点与互动模式"
    ],
    "weakeningConditions": [
      "只动星不动宫、只动宫不见星、现实阶段不匹配"
    ],
    "imagery": {
      "core": [
        "星与宫同时被承接时，关系议题更容易从想法进入现实"
      ],
      "positive": [],
      "negative": [],
      "realityChecks": [
        "是否同时出现对象线索、稳定互动与关系边界变化"
      ]
    },
    "advice": [
      "同时观察人物是否出现和关系是否能落地"
    ],
    "prohibitions": [
      "单纯冲合日支不能直接定恋爱或婚变"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": 192,
        "section": "定夫妻星"
      },
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": 204,
        "section": "结婚流年"
      }
    ],
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "spouse_hidden_star_activation",
    "title": "配偶星藏支时需透出、得根或被引动",
    "category": "relationship",
    "domains": [
      "spouse"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "C",
    "certainty": "conditional",
    "priority": 88,
    "gender": "all",
    "queryKeywords": [
      "藏干",
      "桃花",
      "对象出现",
      "配偶星透出"
    ],
    "trigger": {
      "featuresAny": [
        "配偶星藏干",
        "藏干透出",
        "星在库中"
      ]
    },
    "requires": [
      "确认配偶星确实藏于原局且岁运透出或引动"
    ],
    "weakeningConditions": [
      "透出后无根、被合走、被比劫争夺或宫位无承接"
    ],
    "imagery": {
      "core": [
        "隐性的关系需求、对象线索或责任在岁运中变得可见"
      ],
      "positive": [],
      "negative": [],
      "realityChecks": [
        "现实中是否从无明确对象转为出现可持续接触的人"
      ]
    },
    "advice": [
      "观察持续互动，不把短暂出现直接定为正缘"
    ],
    "prohibitions": [
      "藏干透出不自动等于结婚"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": 189,
        "section": "库中财官出来桃花"
      },
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": 204,
        "section": "星在库中透出的岁运"
      }
    ],
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "spouse_timing_multi_condition",
    "title": "婚恋应期需星、宫、承载与大运背景汇合",
    "category": "relationship",
    "domains": [
      "spouse"
    ],
    "scopes": [
      "luck",
      "year",
      "multiYear"
    ],
    "ruleLevel": "C",
    "certainty": "conditional",
    "priority": 94,
    "gender": "all",
    "queryKeywords": [
      "哪几年有感情",
      "结婚应期",
      "正缘"
    ],
    "trigger": {
      "featuresAny": [
        "结婚应期",
        "配偶星",
        "夫妻宫",
        "立住"
      ]
    },
    "requires": [
      "至少具备配偶星出现或增强、日支关系被触发、大运承接和双方可持续性中的两到三项"
    ],
    "weakeningConditions": [
      "只有桃花字、只有一个冲合、年龄与现实不匹配"
    ],
    "imagery": {
      "core": [
        "关系机会从心理需求转为现实接触、确认或承诺的概率提高"
      ],
      "positive": [],
      "negative": [],
      "realityChecks": [
        "现实中是否有稳定接触、双方投入、关系定义和现实安排"
      ]
    },
    "advice": [
      "先验证持续性和现实条件，再讨论承诺"
    ],
    "prohibitions": [
      "不能仅凭子午卯酉、财官到或日支被冲就定婚期"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": 199,
        "section": "结婚条件"
      },
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": 204,
        "section": "结婚应期流年"
      }
    ],
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "spouse_peer_wealth_tension",
    "title": "男命比劫与财星冲突时先看资源和关系边界",
    "category": "relationship",
    "domains": [
      "spouse",
      "wealth",
      "friends"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "C",
    "certainty": "conditional",
    "priority": 88,
    "gender": "male",
    "queryKeywords": [
      "比劫见财",
      "感情竞争",
      "第三者"
    ],
    "trigger": {
      "tenGodsAll": [
        "比肩|劫财",
        "正财|偏财"
      ]
    },
    "requires": [
      "男命财星为关系主要参考且比劫真实参与争夺"
    ],
    "weakeningConditions": [
      "官杀约束比劫、食伤转化、财星稳定有根、现实关系边界清晰"
    ],
    "imagery": {
      "core": [
        "感情与资源分配、同辈竞争、个人主见可能互相牵动"
      ],
      "positive": [],
      "negative": [
        "可能出现关系中的比较、竞争或责任分配争议"
      ],
      "realityChecks": [
        "现实中是否存在朋友介入、工作资源冲突或双方边界不清"
      ]
    },
    "advice": [
      "把感情和金钱、朋友、合作的边界分开处理"
    ],
    "prohibitions": [
      "不能直接断第三者、离婚或被抢走对象"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": 194,
        "section": "劫财见财看婚姻"
      }
    ],
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "spouse_output_source_ownership",
    "title": "食伤生财时检查财的来源和归属",
    "category": "relationship",
    "domains": [
      "spouse",
      "wealth"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "C",
    "certainty": "conditional",
    "priority": 84,
    "gender": "all",
    "queryKeywords": [
      "食伤生财",
      "感情来源",
      "共同项目"
    ],
    "trigger": {
      "featuresAny": [
        "食伤生财"
      ],
      "tenGodsAll": [
        "食神|伤官",
        "正财|偏财"
      ]
    },
    "requires": [
      "确认食伤与财真实相生、来源属于谁、是否有他人共同参与"
    ],
    "weakeningConditions": [
      "只是五行相生但无根、财星未被日主承接"
    ],
    "imagery": {
      "core": [
        "关系可能通过表达、作品、工作或共同事务建立，也可能与资源分配绑定"
      ],
      "positive": [],
      "negative": [
        "来源多人时，关系和利益边界更复杂"
      ],
      "realityChecks": [
        "现实中关系是否因工作、项目、消费或共同资源而建立"
      ]
    },
    "advice": [
      "先明确关系与利益是否绑定"
    ],
    "prohibitions": [
      "不能按食伤或财星数量直接断几次婚姻"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": 195,
        "section": "食伤生财看婚姻"
      }
    ],
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "spouse_palace_activation_change",
    "title": "日支被引动代表关系模式变化，不预设吉凶",
    "category": "relationship",
    "domains": [
      "spouse",
      "self"
    ],
    "scopes": [
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 89,
    "gender": "all",
    "queryKeywords": [
      "夫妻宫",
      "日支被冲",
      "感情变化"
    ],
    "trigger": {
      "featuresAny": [
        "夫妻宫被引动",
        "日支被冲",
        "日支被合",
        "日支被刑",
        "日支被破"
      ]
    },
    "requires": [
      "说明是哪种关系、由哪一层触发、配偶星是否同时承接"
    ],
    "weakeningConditions": [
      "只有宫位被动而无人物星、现实没有关系场景"
    ],
    "imagery": {
      "core": [
        "亲密关系、合作方式或自身边界更容易发生调整"
      ],
      "positive": [
        "可表现为关系靠近、重新协商或合作模式改变"
      ],
      "negative": [
        "也可能只是关系压力、距离变化或自我状态改变"
      ],
      "realityChecks": [
        "现实中是否出现新关系、旧关系重谈或合作边界变化"
      ]
    },
    "advice": [
      "不要把“动”直接当“好”或“坏”"
    ],
    "prohibitions": [
      "不能仅凭日支被冲合断结婚、离婚或出轨"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": 196,
        "section": "天干五合与宫位"
      },
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": 204,
        "section": "引动宫位"
      }
    ],
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "transit_luck_background_year_trigger",
    "title": "大运定阶段，流年定触发",
    "category": "transit",
    "domains": [
      "general",
      "career",
      "spouse",
      "wealth"
    ],
    "scopes": [
      "luck",
      "year",
      "multiYear"
    ],
    "ruleLevel": "B",
    "certainty": "structurally_supported",
    "priority": 96,
    "gender": "all",
    "queryKeywords": [
      "大运流年",
      "哪几年",
      "某年"
    ],
    "trigger": {
      "featuresAny": [
        "大运",
        "流年"
      ]
    },
    "requires": [
      "先确定目标年属于哪步大运，再看流年新增作用"
    ],
    "weakeningConditions": [
      "大运定位错误、交运年未分段、只看流年不看原局"
    ],
    "imagery": {
      "core": [
        "大运提供长期主题和可承载范围，流年决定当年哪部分被放大"
      ],
      "positive": [],
      "negative": [],
      "realityChecks": [
        "同一流年在不同大运中现实表现是否明显不同"
      ]
    },
    "advice": [
      "年份比较时先按大运分组"
    ],
    "prohibitions": [
      "不能把流年一字直接等同全年事件"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": 229,
        "section": "大运定事流年定应期"
      }
    ],
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "transit_original_vs_external",
    "title": "原局已有字与岁运新来字区分熟悉与外来",
    "category": "transit",
    "domains": [
      "general",
      "friends",
      "career",
      "spouse"
    ],
    "scopes": [
      "luck",
      "year"
    ],
    "ruleLevel": "C",
    "certainty": "conditional",
    "priority": 82,
    "gender": "all",
    "queryKeywords": [
      "新机会",
      "旧问题",
      "外来"
    ],
    "trigger": {
      "featuresAny": [
        "原局有字",
        "原局无字",
        "外来字"
      ]
    },
    "requires": [
      "确认该字在原局是否真实存在、力量和位置"
    ],
    "weakeningConditions": [
      "只按字面熟悉/陌生，不看现实来源和承接"
    ],
    "imagery": {
      "core": [
        "原局已有的主题更像旧结构被放大，原局没有的主题更像新环境或新人物进入"
      ],
      "positive": [],
      "negative": [],
      "realityChecks": [
        "现实中是旧问题复现，还是新人物、新平台、新要求出现"
      ]
    },
    "advice": [
      "把“新来”当观察线索，不直接断欺骗或伤害"
    ],
    "prohibitions": [
      "不能把原局没有的字一概解释为骗子或灾"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": 229,
        "section": "原局有的是认识、没有的是外来"
      }
    ],
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "transit_year_strength_from_natal",
    "title": "流年字的作用大小取决于原局根气与承接",
    "category": "transit",
    "domains": [
      "general"
    ],
    "scopes": [
      "year",
      "multiYear"
    ],
    "ruleLevel": "B",
    "certainty": "structurally_supported",
    "priority": 87,
    "gender": "all",
    "queryKeywords": [
      "流年力量",
      "为什么同年不同命"
    ],
    "trigger": {
      "featuresAny": [
        "流年字",
        "根气",
        "承接"
      ]
    },
    "requires": [
      "检查流年字在原局是否有根、有同类、有生扶或被制"
    ],
    "weakeningConditions": [
      "只按流年天干地支表面强弱判断"
    ],
    "imagery": {
      "core": [
        "同一流年字会因原局基础不同而呈现不同强度和领域"
      ],
      "positive": [],
      "negative": [],
      "realityChecks": [
        "现实中该主题是明显主线还是轻微背景"
      ]
    },
    "advice": [
      "把原局承接强弱写进年度结论"
    ],
    "prohibitions": [
      "不能用同一流年模板套所有命盘"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": 244,
        "section": "流年字的力量"
      }
    ],
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "transit_all_layers_interact",
    "title": "流年同时检查原局和大运关系",
    "category": "transit",
    "domains": [
      "general"
    ],
    "scopes": [
      "year",
      "month",
      "multiYear"
    ],
    "ruleLevel": "B",
    "certainty": "structurally_supported",
    "priority": 92,
    "gender": "all",
    "queryKeywords": [
      "大运流年互动",
      "多层作用"
    ],
    "trigger": {
      "featuresAny": [
        "关系到原局",
        "关系到大运",
        "多层关系"
      ]
    },
    "requires": [
      "至少分别列出流年对原局和对大运的直接作用"
    ],
    "weakeningConditions": [
      "只看一个冲合、忽略天干地支另一半"
    ],
    "imagery": {
      "core": [
        "年度主线由原局承接、大运背景和流年新增作用共同形成"
      ],
      "positive": [],
      "negative": [],
      "realityChecks": [
        "现实中是否出现背景与触发同向或互相牵制"
      ]
    },
    "advice": [
      "先写背景，再写新增，再写落点"
    ],
    "prohibitions": [
      "不能把大运和流年所有关系简单相加"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": 244,
        "section": "流年与大运、原局都发生关系"
      }
    ],
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "transit_repeated_activation",
    "title": "多层重复激活提高主题优先级",
    "category": "transit",
    "domains": [
      "general",
      "career",
      "spouse",
      "wealth"
    ],
    "scopes": [
      "year",
      "month",
      "multiYear"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 89,
    "gender": "all",
    "queryKeywords": [
      "伏吟",
      "重复",
      "多层激活"
    ],
    "trigger": {
      "featuresAny": [
        "重复激活",
        "伏吟",
        "同字重复",
        "同一宫位多层触发"
      ]
    },
    "requires": [
      "重复必须落在同一对象、同一宫位或同一做功链"
    ],
    "weakeningConditions": [
      "只是相同五行但落点不同、存在强反证或被冲散"
    ],
    "imagery": {
      "core": [
        "同一主题从背景进入现实执行的概率提高"
      ],
      "positive": [],
      "negative": [
        "同类机会与压力可能同时加重"
      ],
      "realityChecks": [
        "现实中同一问题是否在多个时间层连续出现"
      ]
    },
    "advice": [
      "集中处理一条主线，避免多线消耗"
    ],
    "prohibitions": [
      "重复不自动等于事情必然发生"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": 244,
        "section": "流年与各字发生关系"
      },
      {
        "sourceId": "system_synthesis",
        "section": "多层激活"
      }
    ],
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "transit_month_landing",
    "title": "流月是短期落点，不改写长期底色",
    "category": "transit",
    "domains": [
      "general"
    ],
    "scopes": [
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 90,
    "gender": "all",
    "queryKeywords": [
      "哪个月",
      "流月",
      "月份"
    ],
    "trigger": {
      "featuresAny": [
        "流月",
        "节气月"
      ]
    },
    "requires": [
      "流月必须放在原局、大运、流年背景中解释"
    ],
    "weakeningConditions": [
      "脱离流年大运单独断月、把公历月或农历月当节气月"
    ],
    "imagery": {
      "core": [
        "流月更适合定位短期集中、推进、变化和验证窗口"
      ],
      "positive": [],
      "negative": [],
      "realityChecks": [
        "现实中当月是否比全年其他月份更集中出现同类主题"
      ]
    },
    "advice": [
      "月度建议以节奏安排和风险管理为主"
    ],
    "prohibitions": [
      "不能用一个流月推翻全年和原局结论"
    ],
    "sourceRefs": [
      {
        "sourceId": "system_synthesis",
        "section": "流月层级"
      }
    ],
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "transit_transition_segment",
    "title": "交运年旧运新运分别分析",
    "category": "transit",
    "domains": [
      "general"
    ],
    "scopes": [
      "year",
      "month"
    ],
    "ruleLevel": "A",
    "certainty": "direct",
    "priority": 98,
    "gender": "all",
    "queryKeywords": [
      "交运",
      "换大运",
      "转折"
    ],
    "trigger": {
      "featuresAny": [
        "交运年",
        "换大运",
        "脱运"
      ]
    },
    "requires": [
      "交运日期与前后大运必须由排盘引擎提供"
    ],
    "weakeningConditions": [
      "不知道交运月份、将两运同时用于全年"
    ],
    "imagery": {
      "core": [
        "全年可能呈现旧阶段收尾与新阶段启动的双重节奏"
      ],
      "positive": [],
      "negative": [
        "前后阶段主题不同，现实感受可能反复或明显转向"
      ],
      "realityChecks": [
        "交运前后现实主题是否有清晰变化"
      ]
    },
    "advice": [
      "重大决策按交运前后分别评估"
    ],
    "prohibitions": [
      "不能用两步大运的所有利好和风险同时支持一个结论"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": 229,
        "section": "男怕交运女怕脱运"
      },
      {
        "sourceId": "system_synthesis",
        "section": "交运分段"
      }
    ],
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "element_wood_environment",
    "title": "木象先看生长环境、根、水、火与季节",
    "category": "element",
    "domains": [
      "self",
      "career",
      "wealth"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "C",
    "certainty": "conditional",
    "priority": 78,
    "gender": "all",
    "queryKeywords": [
      "木",
      "甲木",
      "乙木",
      "成长",
      "教育"
    ],
    "trigger": {
      "stemsAny": [
        "甲",
        "乙"
      ],
      "branchesAny": [
        "寅",
        "卯"
      ]
    },
    "requires": [
      "区分活木、干木、湿木、死木及季节环境"
    ],
    "weakeningConditions": [
      "只见木就断教育、林业或仁慈"
    ],
    "imagery": {
      "core": [
        "木更强调生长、方向、规划、连接和持续发展"
      ],
      "positive": [
        "环境合适时表现为成长、扩展、教育、设计与组织能力"
      ],
      "negative": [
        "环境不合时可能方向不稳、受压、难以落地或频繁换环境"
      ],
      "realityChecks": [
        "现实中是否需要平台、资源、规则或空间才能发挥"
      ]
    },
    "advice": [
      "先改善成长条件，再追求扩张"
    ],
    "prohibitions": [
      "木的职业映射只能作候选"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": 253,
        "section": "木的像法"
      },
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": 256,
        "section": "干木湿木"
      }
    ],
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "element_metal_refinement",
    "title": "金象先看是否需要火炼、木显价值或水润",
    "category": "element",
    "domains": [
      "self",
      "career",
      "wealth"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "C",
    "certainty": "conditional",
    "priority": 80,
    "gender": "all",
    "queryKeywords": [
      "金旺",
      "庚金",
      "辛金",
      "技术",
      "金融"
    ],
    "trigger": {
      "stemsAny": [
        "庚",
        "辛"
      ],
      "branchesAny": [
        "申",
        "酉"
      ]
    },
    "requires": [
      "结合季节、燥湿、强弱与火木水的实际作用"
    ],
    "weakeningConditions": [
      "金旺就机械地说喜火水木、不看制过与寒暖"
    ],
    "imagery": {
      "core": [
        "金更强调规则、判断、切割、技术、品质与执行标准"
      ],
      "positive": [
        "适度火炼、木为目标、水为流通时可体现专业和价值"
      ],
      "negative": [
        "制过或寒湿失衡时可能过硬、过冷、反复消耗"
      ],
      "realityChecks": [
        "现实中是否擅长标准、分析、技术、金融或质量控制"
      ]
    },
    "advice": [
      "根据实际结构选择“炼、润、耗、泄”，不要一概补火"
    ],
    "prohibitions": [
      "不能仅凭金旺确定喜用或职业"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": 259,
        "section": "金的像法"
      }
    ],
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "element_water_flow",
    "title": "水象先看流动、出口、控制与源头",
    "category": "element",
    "domains": [
      "self",
      "career",
      "wealth",
      "fortune"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "C",
    "certainty": "conditional",
    "priority": 78,
    "gender": "all",
    "queryKeywords": [
      "水旺",
      "壬水",
      "癸水",
      "数据",
      "流通"
    ],
    "trigger": {
      "stemsAny": [
        "壬",
        "癸"
      ],
      "branchesAny": [
        "亥",
        "子"
      ]
    },
    "requires": [
      "检查水有源、能否生木、是否需土制或金生"
    ],
    "weakeningConditions": [
      "只见水就断聪明、桃花、物流或玄学"
    ],
    "imagery": {
      "core": [
        "水更强调流动、信息、思考、变化、连接和资源周转"
      ],
      "positive": [
        "有出口和控制时可表现为智慧、传播、数据、运输和流通"
      ],
      "negative": [
        "无出口或过弱时可能迷茫、漂移、资源难沉淀"
      ],
      "realityChecks": [
        "现实中是否长期处理信息、流通、跨区域或复杂变化"
      ]
    },
    "advice": [
      "建立目标和沉淀机制，避免只流动不积累"
    ],
    "prohibitions": [
      "不能按水的多少直接断财富或健康"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": 258,
        "section": "水的像法"
      }
    ],
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "element_fire_warm_refine",
    "title": "火象先看温暖、照明、炼化与过热",
    "category": "element",
    "domains": [
      "self",
      "career",
      "fortune"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "C",
    "certainty": "conditional",
    "priority": 78,
    "gender": "all",
    "queryKeywords": [
      "火旺",
      "丙火",
      "丁火",
      "传媒",
      "教育"
    ],
    "trigger": {
      "stemsAny": [
        "丙",
        "丁"
      ],
      "branchesAny": [
        "巳",
        "午"
      ]
    },
    "requires": [
      "结合季节、强弱、是否炼金、暖局或受水调节"
    ],
    "weakeningConditions": [
      "只见火就断文化、传媒、教育或名声"
    ],
    "imagery": {
      "core": [
        "火更强调目标、可见度、动力、传播、规则和转化"
      ],
      "positive": [
        "适度时可带来行动、表达、温暖、教育和专业炼化"
      ],
      "negative": [
        "过旺或无承接时可能急躁、过热、消耗和目标过强"
      ],
      "realityChecks": [
        "现实中是否需要曝光、领导、传播或快速行动"
      ]
    },
    "advice": [
      "控制节奏与热度，把目标转成可持续流程"
    ],
    "prohibitions": [
      "不能按火旺直接断具体疾病或官位"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": 260,
        "section": "火的像法"
      }
    ],
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "element_earth_bearing",
    "title": "土象先看承载、生长、库藏与堵塞",
    "category": "element",
    "domains": [
      "career",
      "wealth",
      "property",
      "parents"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "C",
    "certainty": "conditional",
    "priority": 76,
    "gender": "all",
    "queryKeywords": [
      "土旺",
      "戊土",
      "己土",
      "房产",
      "管理"
    ],
    "trigger": {
      "stemsAny": [
        "戊",
        "己"
      ],
      "branchesAny": [
        "辰",
        "戌",
        "丑",
        "未"
      ]
    },
    "requires": [
      "区分戊己、燥湿、是否生金、长木、克水或作为墓库"
    ],
    "weakeningConditions": [
      "只见土就断房地产、稳定或脾胃"
    ],
    "imagery": {
      "core": [
        "土更强调承载、平台、资源沉淀、服务和边界"
      ],
      "positive": [
        "条件合适时可表现为组织、建设、管理、资产与长期承载"
      ],
      "negative": [
        "过重或失衡时可能阻塞、负担、保守或替别人承载"
      ],
      "realityChecks": [
        "现实中是否承担平台、管理、资产、后勤或建设责任"
      ]
    },
    "advice": [
      "明确承载对象和边界，避免过度兜底"
    ],
    "prohibitions": [
      "不能仅凭土多确定职业或健康"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": 257,
        "section": "土的像法"
      }
    ],
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "career_object_and_method",
    "title": "职业取象同时看目标对象与取得方式",
    "category": "career",
    "domains": [
      "career",
      "wealth"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "C",
    "certainty": "conditional",
    "priority": 88,
    "gender": "all",
    "queryKeywords": [
      "职业",
      "行业",
      "适合做什么",
      "技术还是管理"
    ],
    "trigger": {
      "featuresAny": [
        "职业取象",
        "财官",
        "做工",
        "行业"
      ]
    },
    "requires": [
      "先看所用财官或目标五行，再看命主通过印、食伤、比劫、制、合、生化何种方式取得"
    ],
    "weakeningConditions": [
      "只凭一个五行或一个十神锁定唯一职业"
    ],
    "imagery": {
      "core": [
        "职业方向由“做什么”与“怎么做”两部分共同决定"
      ],
      "positive": [
        "可区分技术、管理、销售、组织、独立经营或体力执行等工作方式"
      ],
      "negative": [
        "忽略层次和现实技能时容易把古代行业机械套到现代"
      ],
      "realityChecks": [
        "现实职业是否同时符合目标行业和工作方式"
      ]
    },
    "advice": [
      "把行业候选与已有技能、学历、地区机会交叉验证"
    ],
    "prohibitions": [
      "职业规则只能给方向候选，不能锁定具体单位和职位"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": 272,
        "section": "职业取像"
      },
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": 275,
        "section": "行业的界定"
      }
    ],
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "career_output_skill",
    "title": "食伤做工偏技术、表达、作品与服务",
    "category": "career",
    "domains": [
      "career",
      "wealth"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "C",
    "certainty": "conditional",
    "priority": 81,
    "gender": "all",
    "queryKeywords": [
      "技术",
      "销售",
      "老师",
      "表达",
      "作品"
    ],
    "trigger": {
      "tenGodsAny": [
        "食神",
        "伤官"
      ],
      "featuresAny": [
        "食伤做工"
      ]
    },
    "requires": [
      "食伤需要有成果、财星或官杀对象承接"
    ],
    "weakeningConditions": [
      "食伤被强印压制、输出无结果、职业现实不匹配"
    ],
    "imagery": {
      "core": [
        "更适合通过技术、表达、教学、设计、咨询、销售或作品获得价值"
      ],
      "positive": [],
      "negative": [
        "层次不足时可能只表现为口才、临时输出或频繁换方向"
      ],
      "realityChecks": [
        "现实中是否靠专业输出而非单纯职位获得认可"
      ]
    },
    "advice": [
      "持续积累作品、案例和可验证成果"
    ],
    "prohibitions": [
      "不能仅凭食伤确定老师、销售或艺术家"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": 273,
        "section": "食伤做工职业取像"
      }
    ],
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "career_resource_support",
    "title": "印星做工偏学习、资质、平台与组织支持",
    "category": "career",
    "domains": [
      "career",
      "parents"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "C",
    "certainty": "conditional",
    "priority": 80,
    "gender": "all",
    "queryKeywords": [
      "印星",
      "学历",
      "证书",
      "后台",
      "管理支持"
    ],
    "trigger": {
      "tenGodsAny": [
        "正印",
        "偏印"
      ],
      "featuresAny": [
        "印做工"
      ]
    },
    "requires": [
      "印必须服务于官、日主、知识或平台承接"
    ],
    "weakeningConditions": [
      "印过旺无输出、财破印、现实无资质平台"
    ],
    "imagery": {
      "core": [
        "工作方式偏学习、研究、证照、后台、管理支持和专业服务"
      ],
      "positive": [],
      "negative": [
        "也可能准备多、行动慢或依赖组织"
      ],
      "realityChecks": [
        "现实中是否通过证书、知识、平台或导师获得机会"
      ]
    },
    "advice": [
      "把知识转成成果，不停留在证书本身"
    ],
    "prohibitions": [
      "不能仅凭印星锁定公务员、教师或医生"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": 273,
        "section": "印做工职业取像"
      }
    ],
    "researchOnly": false,
    "allowInUserAnswer": true
  }
];

