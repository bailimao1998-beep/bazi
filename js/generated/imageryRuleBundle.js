export const IMAGERY_RULE_CORPUS_VERSION = "blind-bazi-imagery-kb-v8.4";

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
    "pageCount": 297,
    "ingestionStatus": "core_text_chapters_structured",
    "verifiedRanges": [
      "1-277"
    ],
    "excludedRanges": [
      {
        "pages": "278-297",
        "reason": "高风险灾病、牢狱、寿命及案例性极强内容不进入自动推理"
      }
    ],
    "ingestedSections": [
      "干支基础与关系",
      "十神类象与配置",
      "体用宾主与来源",
      "做工与制化结构",
      "婚姻与应期边界",
      "大运流年",
      "五行地支与职业像法"
    ],
    "notes": "文本层可用；规则均为条件化转述，未复制长段原文。"
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
    "pageCount": 366,
    "ingestionStatus": "selected_pages_and_outline_structured",
    "verifiedRanges": [
      "18-25"
    ],
    "outlineVerifiedRanges": [
      "6-9"
    ],
    "ingestedSections": [
      "十神类象选页",
      "地支作用关系选页",
      "墓库、宾主、制用、预测用语目录框架"
    ],
    "notes": "扫描资料仅已核读页面进入正式规则；目录只用于模块设计，不作为具体断语依据。"
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
    "pageCount": 165,
    "ingestionStatus": "outline_and_sampled_pages_pending_full_review",
    "outlineVerifiedRanges": [
      "5-13"
    ],
    "ingestedSections": [
      "五行、十天干、十二地支、六合、相穿、六冲、三合、三会、暗合、自合、墓库、三刑、半合章节框架"
    ],
    "notes": "本版只用已核对目录和样页支持模块框架；未核读正文不进入正式具体断语。"
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
    "pageCount": 328,
    "ingestionStatus": "outline_and_sampled_pages_pending_full_review",
    "outlineVerifiedRanges": [
      "5-13"
    ],
    "ingestedSections": [
      "事业、官命、格局、婚姻应期、离婚、桃花、父母兄弟子女、案例章节框架"
    ],
    "notes": "本版只使用已核对目录作为覆盖清单；未核读案例和具体口诀不进入正式规则。"
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
      "基础公式校验",
      "安全边界",
      "规则去重与冲突仲裁",
      "模块化召回"
    ],
    "notes": "用于把课程经验转成可审计、可条件化、低风险的规则。"
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
  },
  {
    "id": "method_module_route",
    "title": "按问题领域召回模块",
    "priority": 96,
    "instruction": "先识别性格、家庭、婚恋、职业、财富、健康和岁运层级，再召回相关模块；通用问题保留原局总纲。",
    "appliesTo": [
      "all"
    ],
    "sourceRefs": [
      {
        "sourceId": "system_synthesis",
        "section": "v8.4全量规则库工程",
        "verificationStatus": "confirmed"
      }
    ]
  },
  {
    "id": "method_object_method_environment",
    "title": "职业三分法",
    "priority": 95,
    "instruction": "职业判断分为工作对象、工作方式和组织环境，三者不得混成一个行业标签。",
    "appliesTo": [
      "career"
    ],
    "sourceRefs": [
      {
        "sourceId": "system_synthesis",
        "section": "v8.4全量规则库工程",
        "verificationStatus": "confirmed"
      }
    ]
  },
  {
    "id": "method_ownership_before_event",
    "title": "先归属再断事件",
    "priority": 94,
    "instruction": "财官印食先确认来源、宾主和归属，再判断命主能否取得或承接。",
    "appliesTo": [
      "all"
    ],
    "sourceRefs": [
      {
        "sourceId": "system_synthesis",
        "section": "v8.4全量规则库工程",
        "verificationStatus": "confirmed"
      }
    ]
  },
  {
    "id": "method_storage_four_questions",
    "title": "墓库四问",
    "priority": 93,
    "instruction": "看到墓库依次问：库中有什么、属于谁、如何开闭、命主能否承载；缺一项则降低结论。",
    "appliesTo": [
      "all"
    ],
    "sourceRefs": [
      {
        "sourceId": "system_synthesis",
        "section": "v8.4全量规则库工程",
        "verificationStatus": "confirmed"
      }
    ]
  },
  {
    "id": "method_relation_actor_target",
    "title": "关系三问",
    "priority": 92,
    "instruction": "每个合冲刑害破先说明谁作用谁、作用到哪个宫位、服务于什么结构问题。",
    "appliesTo": [
      "all"
    ],
    "sourceRefs": [
      {
        "sourceId": "system_synthesis",
        "section": "v8.4全量规则库工程",
        "verificationStatus": "confirmed"
      }
    ]
  },
  {
    "id": "method_transition_actual_date",
    "title": "实际交运时间唯一权威",
    "priority": 91,
    "instruction": "当前大运、交运年和阶段主次只按实际交运年月定位，不使用展示区间推断。",
    "appliesTo": [
      "luck",
      "year",
      "multiYear"
    ],
    "sourceRefs": [
      {
        "sourceId": "system_synthesis",
        "section": "v8.4全量规则库工程",
        "verificationStatus": "confirmed"
      }
    ]
  },
  {
    "id": "method_foundation_formula_check",
    "title": "基础公式先校验",
    "priority": 96,
    "instruction": "天干五合、五行生克、十神映射和地支关系属于确定规则，解释前必须先校验。",
    "appliesTo": [
      "all"
    ],
    "sourceRefs": [
      {
        "sourceId": "system_synthesis",
        "section": "v8.4全量规则库工程",
        "verificationStatus": "confirmed"
      }
    ]
  },
  {
    "id": "method_rule_status",
    "title": "规则按核读状态使用",
    "priority": 95,
    "instruction": "confirmed和cross_confirmed可进入正式推理；outline_verified只提供框架；needs_review和research_only不进入用户结论。",
    "appliesTo": [
      "all"
    ],
    "sourceRefs": [
      {
        "sourceId": "system_synthesis",
        "section": "v8.4全量规则库工程",
        "verificationStatus": "confirmed"
      }
    ]
  },
  {
    "id": "method_case_not_rule",
    "title": "案例断语不直接升格为通则",
    "priority": 94,
    "instruction": "案例中的结论必须抽取触发条件、反证和适用范围后才能进入正式规则。",
    "appliesTo": [
      "all"
    ],
    "sourceRefs": [
      {
        "sourceId": "system_synthesis",
        "section": "v8.4全量规则库工程",
        "verificationStatus": "confirmed"
      }
    ]
  },
  {
    "id": "method_safe_family_health",
    "title": "六亲健康高风险降级",
    "priority": 93,
    "instruction": "涉及亲属、疾病、事故、牢狱和寿命时，只保留关系压力、现实风险和专业求助建议。",
    "appliesTo": [
      "health",
      "parents",
      "children",
      "spouse"
    ],
    "sourceRefs": [
      {
        "sourceId": "system_synthesis",
        "section": "v8.4全量规则库工程",
        "verificationStatus": "confirmed"
      }
    ]
  },
  {
    "id": "method_reality_branch",
    "title": "未知现实背景用条件分支",
    "priority": 92,
    "instruction": "不了解职业、婚恋、家庭状态时，给一至两个最可能分支和验证点，不并列大量互斥故事。",
    "appliesTo": [
      "all"
    ],
    "sourceRefs": [
      {
        "sourceId": "system_synthesis",
        "section": "v8.4全量规则库工程",
        "verificationStatus": "confirmed"
      }
    ]
  },
  {
    "id": "method_concise_when_asked",
    "title": "用户要求简洁时保留主线",
    "priority": 91,
    "instruction": "用户明确说直接回答或不要太长时，仅保留结论、核心取象、关键建议和边界。",
    "appliesTo": [
      "all"
    ],
    "sourceRefs": [
      {
        "sourceId": "system_synthesis",
        "section": "v8.4全量规则库工程",
        "verificationStatus": "confirmed"
      }
    ]
  }
];

export const IMAGERY_RULE_MODULES = [
  {
    "id": "core",
    "file": "rules-core.json",
    "version": "imagery-rules-core-v2",
    "ruleCount": 51
  },
  {
    "id": "ten-gods",
    "file": "rules-ten-gods.json",
    "version": "imagery-rules-ten-gods-v1",
    "ruleCount": 60
  },
  {
    "id": "elements",
    "file": "rules-elements.json",
    "version": "imagery-rules-elements-v1",
    "ruleCount": 25
  },
  {
    "id": "stems-branches",
    "file": "rules-stems-branches.json",
    "version": "imagery-rules-stems-branches-v1",
    "ruleCount": 22
  },
  {
    "id": "relations",
    "file": "rules-relations.json",
    "version": "imagery-rules-relations-v1",
    "ruleCount": 30
  },
  {
    "id": "palaces",
    "file": "rules-palaces.json",
    "version": "imagery-rules-palaces-v1",
    "ruleCount": 12
  },
  {
    "id": "guest-host-body-use",
    "file": "rules-guest-host-body-use.json",
    "version": "imagery-rules-guest-host-body-use-v1",
    "ruleCount": 15
  },
  {
    "id": "work-methods",
    "file": "rules-work-methods.json",
    "version": "imagery-rules-work-methods-v1",
    "ruleCount": 20
  },
  {
    "id": "tomb-storage",
    "file": "rules-tomb-storage.json",
    "version": "imagery-rules-tomb-storage-v1",
    "ruleCount": 15
  },
  {
    "id": "relationship",
    "file": "rules-relationship.json",
    "version": "imagery-rules-relationship-v1",
    "ruleCount": 22
  },
  {
    "id": "family",
    "file": "rules-family.json",
    "version": "imagery-rules-family-v1",
    "ruleCount": 15
  },
  {
    "id": "career",
    "file": "rules-career.json",
    "version": "imagery-rules-career-v1",
    "ruleCount": 20
  },
  {
    "id": "wealth",
    "file": "rules-wealth.json",
    "version": "imagery-rules-wealth-v1",
    "ruleCount": 14
  },
  {
    "id": "health-state",
    "file": "rules-health-state.json",
    "version": "imagery-rules-health-state-v1",
    "ruleCount": 10
  },
  {
    "id": "transit",
    "file": "rules-transit.json",
    "version": "imagery-rules-transit-v1",
    "ruleCount": 20
  },
  {
    "id": "boundaries",
    "file": "rules-boundaries.json",
    "version": "imagery-rules-boundaries-v1",
    "ruleCount": 14
  }
];

export const IMAGERY_SOURCE_CONFLICTS = [
  {
    "topic": "天干五合与婚姻",
    "resolution": "五合只证明连接或牵连；婚恋必须再看配偶星、夫妻宫和岁运承接。",
    "priority": "deterministic_foundation"
  },
  {
    "topic": "劫财见财与破财离婚",
    "resolution": "先判断归属、强弱、官印约束和流年触发；不直接推出破财、第三者或离婚。",
    "priority": "conditional"
  },
  {
    "topic": "财破印、枭夺食、伤官见官",
    "resolution": "作为结构冲突主题使用；具体失业、疾病、牢狱、婚变等必须多条件汇合且高风险结论不自动输出。",
    "priority": "safety_boundary"
  },
  {
    "topic": "墓库开闭",
    "resolution": "先问库中对象、归属、开闭方式和承载；冲库不等于必然发财或灾祸。",
    "priority": "conditional"
  },
  {
    "topic": "五行与职业",
    "resolution": "五行只提供工作对象和环境物象；职业必须与十神、做功、宫位及现实背景交叉验证。",
    "priority": "multi_evidence"
  },
  {
    "topic": "大运起止",
    "resolution": "实际交运年月是唯一权威；展示年份区间不用于判断最后一年或换运。",
    "priority": "deterministic_foundation"
  }
];

export const IMAGERY_RESEARCH_PENDING = [
  {
    "sourceId": "yang_advanced_blind_notes",
    "pages": "26-366",
    "status": "needs_review",
    "reason": "扫描正文尚未逐页人工核读；官场等级、丢职、牢狱、风水和水晶章节风险或时代语境较强。"
  },
  {
    "sourceId": "cui_five_elements",
    "pages": "14-165",
    "status": "needs_review",
    "reason": "扫描正文尚未逐页人工核读；仅目录和样页已核对。"
  },
  {
    "sourceId": "cui_advanced_2025",
    "pages": "14-328",
    "status": "needs_review",
    "reason": "扫描正文尚未逐页人工核读；案例断语需拆分条件后才能成为规则。"
  },
  {
    "sourceId": "cui_blind_notes_5000",
    "pages": "278-297",
    "status": "research_only",
    "reason": "含高风险疾病、死亡、牢狱、灾祸和具体应期断语，不进入自动用户答案。"
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
    "allowInUserAnswer": true,
    "module": "core",
    "verificationStatus": "confirmed"
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
    "allowInUserAnswer": true,
    "module": "core",
    "verificationStatus": "confirmed"
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
    "allowInUserAnswer": true,
    "module": "core",
    "verificationStatus": "confirmed"
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
    "allowInUserAnswer": true,
    "module": "core",
    "verificationStatus": "confirmed"
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
    "allowInUserAnswer": true,
    "module": "core",
    "verificationStatus": "confirmed"
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
    "allowInUserAnswer": true,
    "module": "core",
    "verificationStatus": "confirmed"
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
    "allowInUserAnswer": true,
    "module": "core",
    "verificationStatus": "confirmed"
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
    "allowInUserAnswer": true,
    "module": "core",
    "verificationStatus": "confirmed"
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
    "allowInUserAnswer": true,
    "module": "core",
    "verificationStatus": "confirmed"
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
    "allowInUserAnswer": true,
    "module": "core",
    "verificationStatus": "confirmed"
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
    "allowInUserAnswer": true,
    "module": "core",
    "verificationStatus": "confirmed"
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
    "allowInUserAnswer": true,
    "module": "core",
    "verificationStatus": "confirmed"
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
    "allowInUserAnswer": true,
    "module": "core",
    "verificationStatus": "confirmed"
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
    "allowInUserAnswer": true,
    "module": "core",
    "verificationStatus": "confirmed"
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
    "allowInUserAnswer": true,
    "module": "core",
    "verificationStatus": "confirmed"
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
    "allowInUserAnswer": true,
    "module": "core",
    "verificationStatus": "confirmed"
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
    "allowInUserAnswer": true,
    "module": "core",
    "verificationStatus": "confirmed"
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
    "allowInUserAnswer": true,
    "module": "core",
    "verificationStatus": "confirmed"
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
    "allowInUserAnswer": true,
    "module": "core",
    "verificationStatus": "confirmed"
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
    "allowInUserAnswer": true,
    "module": "core",
    "verificationStatus": "confirmed"
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
    "allowInUserAnswer": true,
    "module": "core",
    "verificationStatus": "confirmed"
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
    "allowInUserAnswer": true,
    "module": "core",
    "verificationStatus": "confirmed"
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
    "allowInUserAnswer": true,
    "module": "core",
    "verificationStatus": "confirmed"
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
    "allowInUserAnswer": true,
    "module": "core",
    "verificationStatus": "confirmed"
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
    "allowInUserAnswer": true,
    "module": "core",
    "verificationStatus": "confirmed"
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
    "allowInUserAnswer": true,
    "module": "core",
    "verificationStatus": "confirmed"
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
    "allowInUserAnswer": true,
    "module": "core",
    "verificationStatus": "confirmed"
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
    "allowInUserAnswer": true,
    "module": "core",
    "verificationStatus": "confirmed"
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
    "allowInUserAnswer": true,
    "module": "core",
    "verificationStatus": "confirmed"
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
    "allowInUserAnswer": true,
    "module": "core",
    "verificationStatus": "confirmed"
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
    "allowInUserAnswer": true,
    "module": "core",
    "verificationStatus": "confirmed"
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
    "allowInUserAnswer": true,
    "module": "core",
    "verificationStatus": "confirmed"
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
    "allowInUserAnswer": true,
    "module": "core",
    "verificationStatus": "confirmed"
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
    "allowInUserAnswer": true,
    "module": "core",
    "verificationStatus": "confirmed"
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
    "allowInUserAnswer": true,
    "module": "core",
    "verificationStatus": "confirmed"
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
    "allowInUserAnswer": true,
    "module": "core",
    "verificationStatus": "confirmed"
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
    "allowInUserAnswer": true,
    "module": "core",
    "verificationStatus": "confirmed"
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
    "allowInUserAnswer": true,
    "module": "core",
    "verificationStatus": "confirmed"
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
    "allowInUserAnswer": true,
    "module": "core",
    "verificationStatus": "confirmed"
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
    "allowInUserAnswer": true,
    "module": "core",
    "verificationStatus": "confirmed"
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
    "allowInUserAnswer": true,
    "module": "core",
    "verificationStatus": "confirmed"
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
    "allowInUserAnswer": true,
    "module": "core",
    "verificationStatus": "confirmed"
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
    "allowInUserAnswer": true,
    "module": "core",
    "verificationStatus": "confirmed"
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
    "allowInUserAnswer": true,
    "module": "core",
    "verificationStatus": "confirmed"
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
    "allowInUserAnswer": true,
    "module": "core",
    "verificationStatus": "confirmed"
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
    "allowInUserAnswer": true,
    "module": "core",
    "verificationStatus": "confirmed"
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
    "allowInUserAnswer": true,
    "module": "core",
    "verificationStatus": "confirmed"
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
    "allowInUserAnswer": true,
    "module": "core",
    "verificationStatus": "confirmed"
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
    "allowInUserAnswer": true,
    "module": "core",
    "verificationStatus": "confirmed"
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
    "allowInUserAnswer": true,
    "module": "core",
    "verificationStatus": "confirmed"
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
    "allowInUserAnswer": true,
    "module": "core",
    "verificationStatus": "confirmed"
  },
  {
    "id": "tg_bijian_year_position",
    "title": "比肩在年柱：外层背景中的自我、同辈、独立判断与边界",
    "category": "ten_god",
    "domains": [
      "self",
      "parents",
      "career",
      "spouse",
      "wealth",
      "children"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 68,
    "gender": "all",
    "queryKeywords": [
      "比肩",
      "年柱",
      "早年环境"
    ],
    "trigger": {
      "tenGodsAny": [
        "比肩"
      ],
      "featuresAny": [
        "年柱",
        "year"
      ]
    },
    "requires": [
      "必须确认比肩确实落在年柱或该宫位被岁运直接引动",
      "结合透藏、根气、强弱和与日主的实际作用"
    ],
    "weakeningConditions": [
      "只有问题文本提到该宫位但命盘中并未落位",
      "该十神严重受制、无根或被其他结构改写"
    ],
    "imagery": {
      "core": [
        "比肩的主题更容易通过早年环境、家族根基、外部来源与远层关系表现"
      ],
      "positive": [
        "得用时，自主、坚持、并肩合作会在外层背景层面更明显"
      ],
      "negative": [
        "过旺或受损时，固执、同质竞争、资源分散也会通过外层背景层面显现"
      ],
      "realityChecks": [
        "核验早年环境、家族根基、外部来源与远层关系是否确实是现实中反复出现的场域"
      ]
    },
    "advice": [
      "合作前明确分工，保留独立负责的空间"
    ],
    "prohibitions": [
      "不能只因比肩在年柱就直接断定具体人物吉凶或单一事件"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "42-44",
        "section": "比肩类象与配置",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": 22,
        "section": "比肩类象",
        "verificationStatus": "selected_pages_verified"
      }
    ],
    "module": "ten-gods",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "tg_bijian_month_position",
    "title": "比肩在月柱：主要环境中的自我、同辈、独立判断与边界",
    "category": "ten_god",
    "domains": [
      "self",
      "parents",
      "career",
      "spouse",
      "wealth",
      "children"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 68,
    "gender": "all",
    "queryKeywords": [
      "比肩",
      "月柱",
      "成长秩序"
    ],
    "trigger": {
      "tenGodsAny": [
        "比肩"
      ],
      "featuresAny": [
        "月柱",
        "month"
      ]
    },
    "requires": [
      "必须确认比肩确实落在月柱或该宫位被岁运直接引动",
      "结合透藏、根气、强弱和与日主的实际作用"
    ],
    "weakeningConditions": [
      "只有问题文本提到该宫位但命盘中并未落位",
      "该十神严重受制、无根或被其他结构改写"
    ],
    "imagery": {
      "core": [
        "比肩的主题更容易通过成长秩序、父母承接、工作环境与社会接口表现"
      ],
      "positive": [
        "得用时，自主、坚持、并肩合作会在主要环境层面更明显"
      ],
      "negative": [
        "过旺或受损时，固执、同质竞争、资源分散也会通过主要环境层面显现"
      ],
      "realityChecks": [
        "核验成长秩序、父母承接、工作环境与社会接口是否确实是现实中反复出现的场域"
      ]
    },
    "advice": [
      "合作前明确分工，保留独立负责的空间"
    ],
    "prohibitions": [
      "不能只因比肩在月柱就直接断定具体人物吉凶或单一事件"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "42-44",
        "section": "比肩类象与配置",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": 22,
        "section": "比肩类象",
        "verificationStatus": "selected_pages_verified"
      }
    ],
    "module": "ten-gods",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "tg_bijian_day_position",
    "title": "比肩在日柱：核心落点中的自我、同辈、独立判断与边界",
    "category": "ten_god",
    "domains": [
      "self",
      "parents",
      "career",
      "spouse",
      "wealth",
      "children"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 68,
    "gender": "all",
    "queryKeywords": [
      "比肩",
      "日柱",
      "自我状态"
    ],
    "trigger": {
      "tenGodsAny": [
        "比肩"
      ],
      "featuresAny": [
        "日柱",
        "day"
      ]
    },
    "requires": [
      "必须确认比肩确实落在日柱或该宫位被岁运直接引动",
      "结合透藏、根气、强弱和与日主的实际作用"
    ],
    "weakeningConditions": [
      "只有问题文本提到该宫位但命盘中并未落位",
      "该十神严重受制、无根或被其他结构改写"
    ],
    "imagery": {
      "core": [
        "比肩的主题更容易通过自我状态、亲密关系、日常选择与直接承接表现"
      ],
      "positive": [
        "得用时，自主、坚持、并肩合作会在核心落点层面更明显"
      ],
      "negative": [
        "过旺或受损时，固执、同质竞争、资源分散也会通过核心落点层面显现"
      ],
      "realityChecks": [
        "核验自我状态、亲密关系、日常选择与直接承接是否确实是现实中反复出现的场域"
      ]
    },
    "advice": [
      "合作前明确分工，保留独立负责的空间"
    ],
    "prohibitions": [
      "不能只因比肩在日柱就直接断定具体人物吉凶或单一事件"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "42-44",
        "section": "比肩类象与配置",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": 22,
        "section": "比肩类象",
        "verificationStatus": "selected_pages_verified"
      }
    ],
    "module": "ten-gods",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "tg_bijian_hour_position",
    "title": "比肩在时柱：结果与后续中的自我、同辈、独立判断与边界",
    "category": "ten_god",
    "domains": [
      "self",
      "parents",
      "career",
      "spouse",
      "wealth",
      "children"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 68,
    "gender": "all",
    "queryKeywords": [
      "比肩",
      "时柱",
      "执行结果"
    ],
    "trigger": {
      "tenGodsAny": [
        "比肩"
      ],
      "featuresAny": [
        "时柱",
        "hour"
      ]
    },
    "requires": [
      "必须确认比肩确实落在时柱或该宫位被岁运直接引动",
      "结合透藏、根气、强弱和与日主的实际作用"
    ],
    "weakeningConditions": [
      "只有问题文本提到该宫位但命盘中并未落位",
      "该十神严重受制、无根或被其他结构改写"
    ],
    "imagery": {
      "core": [
        "比肩的主题更容易通过执行结果、作品、后期规划、子女或下属层表现"
      ],
      "positive": [
        "得用时，自主、坚持、并肩合作会在结果与后续层面更明显"
      ],
      "negative": [
        "过旺或受损时，固执、同质竞争、资源分散也会通过结果与后续层面显现"
      ],
      "realityChecks": [
        "核验执行结果、作品、后期规划、子女或下属层是否确实是现实中反复出现的场域"
      ]
    },
    "advice": [
      "合作前明确分工，保留独立负责的空间"
    ],
    "prohibitions": [
      "不能只因比肩在时柱就直接断定具体人物吉凶或单一事件"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "42-44",
        "section": "比肩类象与配置",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": 22,
        "section": "比肩类象",
        "verificationStatus": "selected_pages_verified"
      }
    ],
    "module": "ten-gods",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "tg_bijian_strong_state",
    "title": "比肩偏旺：主题强化与过度使用",
    "category": "ten_god",
    "domains": [
      "self",
      "career",
      "wealth",
      "spouse",
      "fortune"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 74,
    "gender": "all",
    "queryKeywords": [
      "比肩",
      "偏旺",
      "太旺",
      "多"
    ],
    "trigger": {
      "tenGodsAny": [
        "比肩"
      ],
      "featuresAny": [
        "比肩旺",
        "比肩强",
        "比肩成势",
        "比肩多"
      ]
    },
    "requires": [
      "确认偏旺来自月令、根气、透干或多层重复，而非简单计数",
      "判断旺势是否真正作用到日主、用神或关键宫位"
    ],
    "weakeningConditions": [
      "虽多但无根、受制或不直接参与做功",
      "辅助评分与实际根气不一致"
    ],
    "imagery": {
      "core": [
        "比肩的自我、同辈、独立判断与边界成为高频行为模式"
      ],
      "positive": [
        "结构承接良好时，自主、坚持、并肩合作可形成优势"
      ],
      "negative": [
        "失衡时更容易出现固执、同质竞争、资源分散"
      ],
      "realityChecks": [
        "现实中是否更依赖自己判断，并重视平等与边界"
      ]
    },
    "advice": [
      "合作前明确分工，保留独立负责的空间"
    ],
    "prohibitions": [
      "不能仅凭比肩数量多就锁定职业、婚姻或吉凶"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "42-44",
        "section": "比肩类象与配置",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": 22,
        "section": "比肩类象",
        "verificationStatus": "selected_pages_verified"
      }
    ],
    "module": "ten-gods",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "tg_bijian_controlled_state",
    "title": "比肩受制或不显：功能受限与替代通道",
    "category": "ten_god",
    "domains": [
      "self",
      "career",
      "wealth",
      "spouse",
      "fortune"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 71,
    "gender": "all",
    "queryKeywords": [
      "比肩",
      "弱",
      "受制",
      "不透",
      "入墓"
    ],
    "trigger": {
      "tenGodsAny": [
        "比肩"
      ],
      "featuresAny": [
        "比肩受制",
        "比肩弱",
        "比肩不透",
        "比肩入墓"
      ]
    },
    "requires": [
      "确认受制、无根、不透或入墓等具体事实",
      "同时寻找是否有生扶、通关、开库或岁运引动"
    ],
    "weakeningConditions": [
      "实际有强根或透干",
      "岁运已解除原局限制"
    ],
    "imagery": {
      "core": [
        "比肩代表的自我、同辈、独立判断与边界不容易直接表达，常需借助其他十神或岁运通道"
      ],
      "positive": [
        "受制若服务于整体制化，反而可能减少过度表现"
      ],
      "negative": [
        "功能不足时，自主、坚持、并肩合作难以稳定落实"
      ],
      "realityChecks": [
        "现实中是否在自我、同辈、独立判断与边界相关事项上需要外部条件才能启动"
      ]
    },
    "advice": [
      "先寻找可替代的现实通道，不把单一弱项当成能力缺失"
    ],
    "prohibitions": [
      "不能把比肩弱或藏而不透直接等同于现实中没有对应人物或机会"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "42-44",
        "section": "比肩类象与配置",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": 22,
        "section": "比肩类象",
        "verificationStatus": "selected_pages_verified"
      }
    ],
    "module": "ten-gods",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "tg_jiecai_year_position",
    "title": "劫财在年柱：外层背景中的行动、竞争、同辈动员与资源重新分配",
    "category": "ten_god",
    "domains": [
      "self",
      "parents",
      "career",
      "spouse",
      "wealth",
      "children"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 68,
    "gender": "all",
    "queryKeywords": [
      "劫财",
      "年柱",
      "早年环境"
    ],
    "trigger": {
      "tenGodsAny": [
        "劫财"
      ],
      "featuresAny": [
        "年柱",
        "year"
      ]
    },
    "requires": [
      "必须确认劫财确实落在年柱或该宫位被岁运直接引动",
      "结合透藏、根气、强弱和与日主的实际作用"
    ],
    "weakeningConditions": [
      "只有问题文本提到该宫位但命盘中并未落位",
      "该十神严重受制、无根或被其他结构改写"
    ],
    "imagery": {
      "core": [
        "劫财的主题更容易通过早年环境、家族根基、外部来源与远层关系表现"
      ],
      "positive": [
        "得用时，果断、动员力、敢于争取会在外层背景层面更明显"
      ],
      "negative": [
        "过旺或受损时，冲动、利益摩擦、人情消耗也会通过外层背景层面显现"
      ],
      "realityChecks": [
        "核验早年环境、家族根基、外部来源与远层关系是否确实是现实中反复出现的场域"
      ]
    },
    "advice": [
      "涉及资金和利益时先书面约定"
    ],
    "prohibitions": [
      "不能只因劫财在年柱就直接断定具体人物吉凶或单一事件"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "42-44",
        "section": "劫财类象与配置",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": 22,
        "section": "劫财类象",
        "verificationStatus": "selected_pages_verified"
      }
    ],
    "module": "ten-gods",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "tg_jiecai_month_position",
    "title": "劫财在月柱：主要环境中的行动、竞争、同辈动员与资源重新分配",
    "category": "ten_god",
    "domains": [
      "self",
      "parents",
      "career",
      "spouse",
      "wealth",
      "children"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 68,
    "gender": "all",
    "queryKeywords": [
      "劫财",
      "月柱",
      "成长秩序"
    ],
    "trigger": {
      "tenGodsAny": [
        "劫财"
      ],
      "featuresAny": [
        "月柱",
        "month"
      ]
    },
    "requires": [
      "必须确认劫财确实落在月柱或该宫位被岁运直接引动",
      "结合透藏、根气、强弱和与日主的实际作用"
    ],
    "weakeningConditions": [
      "只有问题文本提到该宫位但命盘中并未落位",
      "该十神严重受制、无根或被其他结构改写"
    ],
    "imagery": {
      "core": [
        "劫财的主题更容易通过成长秩序、父母承接、工作环境与社会接口表现"
      ],
      "positive": [
        "得用时，果断、动员力、敢于争取会在主要环境层面更明显"
      ],
      "negative": [
        "过旺或受损时，冲动、利益摩擦、人情消耗也会通过主要环境层面显现"
      ],
      "realityChecks": [
        "核验成长秩序、父母承接、工作环境与社会接口是否确实是现实中反复出现的场域"
      ]
    },
    "advice": [
      "涉及资金和利益时先书面约定"
    ],
    "prohibitions": [
      "不能只因劫财在月柱就直接断定具体人物吉凶或单一事件"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "42-44",
        "section": "劫财类象与配置",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": 22,
        "section": "劫财类象",
        "verificationStatus": "selected_pages_verified"
      }
    ],
    "module": "ten-gods",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "tg_jiecai_day_position",
    "title": "劫财在日柱：核心落点中的行动、竞争、同辈动员与资源重新分配",
    "category": "ten_god",
    "domains": [
      "self",
      "parents",
      "career",
      "spouse",
      "wealth",
      "children"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 68,
    "gender": "all",
    "queryKeywords": [
      "劫财",
      "日柱",
      "自我状态"
    ],
    "trigger": {
      "tenGodsAny": [
        "劫财"
      ],
      "featuresAny": [
        "日柱",
        "day"
      ]
    },
    "requires": [
      "必须确认劫财确实落在日柱或该宫位被岁运直接引动",
      "结合透藏、根气、强弱和与日主的实际作用"
    ],
    "weakeningConditions": [
      "只有问题文本提到该宫位但命盘中并未落位",
      "该十神严重受制、无根或被其他结构改写"
    ],
    "imagery": {
      "core": [
        "劫财的主题更容易通过自我状态、亲密关系、日常选择与直接承接表现"
      ],
      "positive": [
        "得用时，果断、动员力、敢于争取会在核心落点层面更明显"
      ],
      "negative": [
        "过旺或受损时，冲动、利益摩擦、人情消耗也会通过核心落点层面显现"
      ],
      "realityChecks": [
        "核验自我状态、亲密关系、日常选择与直接承接是否确实是现实中反复出现的场域"
      ]
    },
    "advice": [
      "涉及资金和利益时先书面约定"
    ],
    "prohibitions": [
      "不能只因劫财在日柱就直接断定具体人物吉凶或单一事件"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "42-44",
        "section": "劫财类象与配置",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": 22,
        "section": "劫财类象",
        "verificationStatus": "selected_pages_verified"
      }
    ],
    "module": "ten-gods",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "tg_jiecai_hour_position",
    "title": "劫财在时柱：结果与后续中的行动、竞争、同辈动员与资源重新分配",
    "category": "ten_god",
    "domains": [
      "self",
      "parents",
      "career",
      "spouse",
      "wealth",
      "children"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 68,
    "gender": "all",
    "queryKeywords": [
      "劫财",
      "时柱",
      "执行结果"
    ],
    "trigger": {
      "tenGodsAny": [
        "劫财"
      ],
      "featuresAny": [
        "时柱",
        "hour"
      ]
    },
    "requires": [
      "必须确认劫财确实落在时柱或该宫位被岁运直接引动",
      "结合透藏、根气、强弱和与日主的实际作用"
    ],
    "weakeningConditions": [
      "只有问题文本提到该宫位但命盘中并未落位",
      "该十神严重受制、无根或被其他结构改写"
    ],
    "imagery": {
      "core": [
        "劫财的主题更容易通过执行结果、作品、后期规划、子女或下属层表现"
      ],
      "positive": [
        "得用时，果断、动员力、敢于争取会在结果与后续层面更明显"
      ],
      "negative": [
        "过旺或受损时，冲动、利益摩擦、人情消耗也会通过结果与后续层面显现"
      ],
      "realityChecks": [
        "核验执行结果、作品、后期规划、子女或下属层是否确实是现实中反复出现的场域"
      ]
    },
    "advice": [
      "涉及资金和利益时先书面约定"
    ],
    "prohibitions": [
      "不能只因劫财在时柱就直接断定具体人物吉凶或单一事件"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "42-44",
        "section": "劫财类象与配置",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": 22,
        "section": "劫财类象",
        "verificationStatus": "selected_pages_verified"
      }
    ],
    "module": "ten-gods",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "tg_jiecai_strong_state",
    "title": "劫财偏旺：主题强化与过度使用",
    "category": "ten_god",
    "domains": [
      "self",
      "career",
      "wealth",
      "spouse",
      "fortune"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 74,
    "gender": "all",
    "queryKeywords": [
      "劫财",
      "偏旺",
      "太旺",
      "多"
    ],
    "trigger": {
      "tenGodsAny": [
        "劫财"
      ],
      "featuresAny": [
        "劫财旺",
        "劫财强",
        "劫财成势",
        "劫财多"
      ]
    },
    "requires": [
      "确认偏旺来自月令、根气、透干或多层重复，而非简单计数",
      "判断旺势是否真正作用到日主、用神或关键宫位"
    ],
    "weakeningConditions": [
      "虽多但无根、受制或不直接参与做功",
      "辅助评分与实际根气不一致"
    ],
    "imagery": {
      "core": [
        "劫财的行动、竞争、同辈动员与资源重新分配成为高频行为模式"
      ],
      "positive": [
        "结构承接良好时，果断、动员力、敢于争取可形成优势"
      ],
      "negative": [
        "失衡时更容易出现冲动、利益摩擦、人情消耗"
      ],
      "realityChecks": [
        "现实中是否常通过朋友同辈获得机会，也容易发生分配争议"
      ]
    },
    "advice": [
      "涉及资金和利益时先书面约定"
    ],
    "prohibitions": [
      "不能仅凭劫财数量多就锁定职业、婚姻或吉凶"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "42-44",
        "section": "劫财类象与配置",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": 22,
        "section": "劫财类象",
        "verificationStatus": "selected_pages_verified"
      }
    ],
    "module": "ten-gods",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "tg_jiecai_controlled_state",
    "title": "劫财受制或不显：功能受限与替代通道",
    "category": "ten_god",
    "domains": [
      "self",
      "career",
      "wealth",
      "spouse",
      "fortune"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 71,
    "gender": "all",
    "queryKeywords": [
      "劫财",
      "弱",
      "受制",
      "不透",
      "入墓"
    ],
    "trigger": {
      "tenGodsAny": [
        "劫财"
      ],
      "featuresAny": [
        "劫财受制",
        "劫财弱",
        "劫财不透",
        "劫财入墓"
      ]
    },
    "requires": [
      "确认受制、无根、不透或入墓等具体事实",
      "同时寻找是否有生扶、通关、开库或岁运引动"
    ],
    "weakeningConditions": [
      "实际有强根或透干",
      "岁运已解除原局限制"
    ],
    "imagery": {
      "core": [
        "劫财代表的行动、竞争、同辈动员与资源重新分配不容易直接表达，常需借助其他十神或岁运通道"
      ],
      "positive": [
        "受制若服务于整体制化，反而可能减少过度表现"
      ],
      "negative": [
        "功能不足时，果断、动员力、敢于争取难以稳定落实"
      ],
      "realityChecks": [
        "现实中是否在行动、竞争、同辈动员与资源重新分配相关事项上需要外部条件才能启动"
      ]
    },
    "advice": [
      "先寻找可替代的现实通道，不把单一弱项当成能力缺失"
    ],
    "prohibitions": [
      "不能把劫财弱或藏而不透直接等同于现实中没有对应人物或机会"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "42-44",
        "section": "劫财类象与配置",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": 22,
        "section": "劫财类象",
        "verificationStatus": "selected_pages_verified"
      }
    ],
    "module": "ten-gods",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "tg_zhengyin_year_position",
    "title": "正印在年柱：外层背景中的学习、保护、规则承接与正式支持",
    "category": "ten_god",
    "domains": [
      "self",
      "parents",
      "career",
      "spouse",
      "wealth",
      "children"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 68,
    "gender": "all",
    "queryKeywords": [
      "正印",
      "年柱",
      "早年环境"
    ],
    "trigger": {
      "tenGodsAny": [
        "正印"
      ],
      "featuresAny": [
        "年柱",
        "year"
      ]
    },
    "requires": [
      "必须确认正印确实落在年柱或该宫位被岁运直接引动",
      "结合透藏、根气、强弱和与日主的实际作用"
    ],
    "weakeningConditions": [
      "只有问题文本提到该宫位但命盘中并未落位",
      "该十神严重受制、无根或被其他结构改写"
    ],
    "imagery": {
      "core": [
        "正印的主题更容易通过早年环境、家族根基、外部来源与远层关系表现"
      ],
      "positive": [
        "得用时，稳定、耐心、重信誉和资质会在外层背景层面更明显"
      ],
      "negative": [
        "过旺或受损时，依赖、准备过多、行动偏慢也会通过外层背景层面显现"
      ],
      "realityChecks": [
        "核验早年环境、家族根基、外部来源与远层关系是否确实是现实中反复出现的场域"
      ]
    },
    "advice": [
      "把学习及时转成成果和交付"
    ],
    "prohibitions": [
      "不能只因正印在年柱就直接断定具体人物吉凶或单一事件"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "47-49",
        "section": "正印类象与配置",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": 18,
        "section": "正印类象",
        "verificationStatus": "selected_pages_verified"
      }
    ],
    "module": "ten-gods",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "tg_zhengyin_month_position",
    "title": "正印在月柱：主要环境中的学习、保护、规则承接与正式支持",
    "category": "ten_god",
    "domains": [
      "self",
      "parents",
      "career",
      "spouse",
      "wealth",
      "children"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 68,
    "gender": "all",
    "queryKeywords": [
      "正印",
      "月柱",
      "成长秩序"
    ],
    "trigger": {
      "tenGodsAny": [
        "正印"
      ],
      "featuresAny": [
        "月柱",
        "month"
      ]
    },
    "requires": [
      "必须确认正印确实落在月柱或该宫位被岁运直接引动",
      "结合透藏、根气、强弱和与日主的实际作用"
    ],
    "weakeningConditions": [
      "只有问题文本提到该宫位但命盘中并未落位",
      "该十神严重受制、无根或被其他结构改写"
    ],
    "imagery": {
      "core": [
        "正印的主题更容易通过成长秩序、父母承接、工作环境与社会接口表现"
      ],
      "positive": [
        "得用时，稳定、耐心、重信誉和资质会在主要环境层面更明显"
      ],
      "negative": [
        "过旺或受损时，依赖、准备过多、行动偏慢也会通过主要环境层面显现"
      ],
      "realityChecks": [
        "核验成长秩序、父母承接、工作环境与社会接口是否确实是现实中反复出现的场域"
      ]
    },
    "advice": [
      "把学习及时转成成果和交付"
    ],
    "prohibitions": [
      "不能只因正印在月柱就直接断定具体人物吉凶或单一事件"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "47-49",
        "section": "正印类象与配置",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": 18,
        "section": "正印类象",
        "verificationStatus": "selected_pages_verified"
      }
    ],
    "module": "ten-gods",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "tg_zhengyin_day_position",
    "title": "正印在日柱：核心落点中的学习、保护、规则承接与正式支持",
    "category": "ten_god",
    "domains": [
      "self",
      "parents",
      "career",
      "spouse",
      "wealth",
      "children"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 68,
    "gender": "all",
    "queryKeywords": [
      "正印",
      "日柱",
      "自我状态"
    ],
    "trigger": {
      "tenGodsAny": [
        "正印"
      ],
      "featuresAny": [
        "日柱",
        "day"
      ]
    },
    "requires": [
      "必须确认正印确实落在日柱或该宫位被岁运直接引动",
      "结合透藏、根气、强弱和与日主的实际作用"
    ],
    "weakeningConditions": [
      "只有问题文本提到该宫位但命盘中并未落位",
      "该十神严重受制、无根或被其他结构改写"
    ],
    "imagery": {
      "core": [
        "正印的主题更容易通过自我状态、亲密关系、日常选择与直接承接表现"
      ],
      "positive": [
        "得用时，稳定、耐心、重信誉和资质会在核心落点层面更明显"
      ],
      "negative": [
        "过旺或受损时，依赖、准备过多、行动偏慢也会通过核心落点层面显现"
      ],
      "realityChecks": [
        "核验自我状态、亲密关系、日常选择与直接承接是否确实是现实中反复出现的场域"
      ]
    },
    "advice": [
      "把学习及时转成成果和交付"
    ],
    "prohibitions": [
      "不能只因正印在日柱就直接断定具体人物吉凶或单一事件"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "47-49",
        "section": "正印类象与配置",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": 18,
        "section": "正印类象",
        "verificationStatus": "selected_pages_verified"
      }
    ],
    "module": "ten-gods",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "tg_zhengyin_hour_position",
    "title": "正印在时柱：结果与后续中的学习、保护、规则承接与正式支持",
    "category": "ten_god",
    "domains": [
      "self",
      "parents",
      "career",
      "spouse",
      "wealth",
      "children"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 68,
    "gender": "all",
    "queryKeywords": [
      "正印",
      "时柱",
      "执行结果"
    ],
    "trigger": {
      "tenGodsAny": [
        "正印"
      ],
      "featuresAny": [
        "时柱",
        "hour"
      ]
    },
    "requires": [
      "必须确认正印确实落在时柱或该宫位被岁运直接引动",
      "结合透藏、根气、强弱和与日主的实际作用"
    ],
    "weakeningConditions": [
      "只有问题文本提到该宫位但命盘中并未落位",
      "该十神严重受制、无根或被其他结构改写"
    ],
    "imagery": {
      "core": [
        "正印的主题更容易通过执行结果、作品、后期规划、子女或下属层表现"
      ],
      "positive": [
        "得用时，稳定、耐心、重信誉和资质会在结果与后续层面更明显"
      ],
      "negative": [
        "过旺或受损时，依赖、准备过多、行动偏慢也会通过结果与后续层面显现"
      ],
      "realityChecks": [
        "核验执行结果、作品、后期规划、子女或下属层是否确实是现实中反复出现的场域"
      ]
    },
    "advice": [
      "把学习及时转成成果和交付"
    ],
    "prohibitions": [
      "不能只因正印在时柱就直接断定具体人物吉凶或单一事件"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "47-49",
        "section": "正印类象与配置",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": 18,
        "section": "正印类象",
        "verificationStatus": "selected_pages_verified"
      }
    ],
    "module": "ten-gods",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "tg_zhengyin_strong_state",
    "title": "正印偏旺：主题强化与过度使用",
    "category": "ten_god",
    "domains": [
      "self",
      "career",
      "wealth",
      "spouse",
      "fortune"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 74,
    "gender": "all",
    "queryKeywords": [
      "正印",
      "偏旺",
      "太旺",
      "多"
    ],
    "trigger": {
      "tenGodsAny": [
        "正印"
      ],
      "featuresAny": [
        "正印旺",
        "正印强",
        "正印成势",
        "正印多"
      ]
    },
    "requires": [
      "确认偏旺来自月令、根气、透干或多层重复，而非简单计数",
      "判断旺势是否真正作用到日主、用神或关键宫位"
    ],
    "weakeningConditions": [
      "虽多但无根、受制或不直接参与做功",
      "辅助评分与实际根气不一致"
    ],
    "imagery": {
      "core": [
        "正印的学习、保护、规则承接与正式支持成为高频行为模式"
      ],
      "positive": [
        "结构承接良好时，稳定、耐心、重信誉和资质可形成优势"
      ],
      "negative": [
        "失衡时更容易出现依赖、准备过多、行动偏慢"
      ],
      "realityChecks": [
        "现实中是否重视证照、资料、制度与长辈支持"
      ]
    },
    "advice": [
      "把学习及时转成成果和交付"
    ],
    "prohibitions": [
      "不能仅凭正印数量多就锁定职业、婚姻或吉凶"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "47-49",
        "section": "正印类象与配置",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": 18,
        "section": "正印类象",
        "verificationStatus": "selected_pages_verified"
      }
    ],
    "module": "ten-gods",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "tg_zhengyin_controlled_state",
    "title": "正印受制或不显：功能受限与替代通道",
    "category": "ten_god",
    "domains": [
      "self",
      "career",
      "wealth",
      "spouse",
      "fortune"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 71,
    "gender": "all",
    "queryKeywords": [
      "正印",
      "弱",
      "受制",
      "不透",
      "入墓"
    ],
    "trigger": {
      "tenGodsAny": [
        "正印"
      ],
      "featuresAny": [
        "正印受制",
        "正印弱",
        "正印不透",
        "正印入墓"
      ]
    },
    "requires": [
      "确认受制、无根、不透或入墓等具体事实",
      "同时寻找是否有生扶、通关、开库或岁运引动"
    ],
    "weakeningConditions": [
      "实际有强根或透干",
      "岁运已解除原局限制"
    ],
    "imagery": {
      "core": [
        "正印代表的学习、保护、规则承接与正式支持不容易直接表达，常需借助其他十神或岁运通道"
      ],
      "positive": [
        "受制若服务于整体制化，反而可能减少过度表现"
      ],
      "negative": [
        "功能不足时，稳定、耐心、重信誉和资质难以稳定落实"
      ],
      "realityChecks": [
        "现实中是否在学习、保护、规则承接与正式支持相关事项上需要外部条件才能启动"
      ]
    },
    "advice": [
      "先寻找可替代的现实通道，不把单一弱项当成能力缺失"
    ],
    "prohibitions": [
      "不能把正印弱或藏而不透直接等同于现实中没有对应人物或机会"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "47-49",
        "section": "正印类象与配置",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": 18,
        "section": "正印类象",
        "verificationStatus": "selected_pages_verified"
      }
    ],
    "module": "ten-gods",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "tg_pianyin_year_position",
    "title": "偏印在年柱：外层背景中的研究、洞察、筛选与非常规理解",
    "category": "ten_god",
    "domains": [
      "self",
      "parents",
      "career",
      "spouse",
      "wealth",
      "children"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 68,
    "gender": "all",
    "queryKeywords": [
      "偏印",
      "年柱",
      "早年环境"
    ],
    "trigger": {
      "tenGodsAny": [
        "偏印"
      ],
      "featuresAny": [
        "年柱",
        "year"
      ]
    },
    "requires": [
      "必须确认偏印确实落在年柱或该宫位被岁运直接引动",
      "结合透藏、根气、强弱和与日主的实际作用"
    ],
    "weakeningConditions": [
      "只有问题文本提到该宫位但命盘中并未落位",
      "该十神严重受制、无根或被其他结构改写"
    ],
    "imagery": {
      "core": [
        "偏印的主题更容易通过早年环境、家族根基、外部来源与远层关系表现"
      ],
      "positive": [
        "得用时，敏感、策略、独立研究会在外层背景层面更明显"
      ],
      "negative": [
        "过旺或受损时，孤立、想法跳跃、输出不稳定也会通过外层背景层面显现"
      ],
      "realityChecks": [
        "核验早年环境、家族根基、外部来源与远层关系是否确实是现实中反复出现的场域"
      ]
    },
    "advice": [
      "建立固定输出和验证机制"
    ],
    "prohibitions": [
      "不能只因偏印在年柱就直接断定具体人物吉凶或单一事件"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "47-49",
        "section": "偏印类象与配置",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": 19,
        "section": "偏印类象",
        "verificationStatus": "selected_pages_verified"
      }
    ],
    "module": "ten-gods",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "tg_pianyin_month_position",
    "title": "偏印在月柱：主要环境中的研究、洞察、筛选与非常规理解",
    "category": "ten_god",
    "domains": [
      "self",
      "parents",
      "career",
      "spouse",
      "wealth",
      "children"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 68,
    "gender": "all",
    "queryKeywords": [
      "偏印",
      "月柱",
      "成长秩序"
    ],
    "trigger": {
      "tenGodsAny": [
        "偏印"
      ],
      "featuresAny": [
        "月柱",
        "month"
      ]
    },
    "requires": [
      "必须确认偏印确实落在月柱或该宫位被岁运直接引动",
      "结合透藏、根气、强弱和与日主的实际作用"
    ],
    "weakeningConditions": [
      "只有问题文本提到该宫位但命盘中并未落位",
      "该十神严重受制、无根或被其他结构改写"
    ],
    "imagery": {
      "core": [
        "偏印的主题更容易通过成长秩序、父母承接、工作环境与社会接口表现"
      ],
      "positive": [
        "得用时，敏感、策略、独立研究会在主要环境层面更明显"
      ],
      "negative": [
        "过旺或受损时，孤立、想法跳跃、输出不稳定也会通过主要环境层面显现"
      ],
      "realityChecks": [
        "核验成长秩序、父母承接、工作环境与社会接口是否确实是现实中反复出现的场域"
      ]
    },
    "advice": [
      "建立固定输出和验证机制"
    ],
    "prohibitions": [
      "不能只因偏印在月柱就直接断定具体人物吉凶或单一事件"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "47-49",
        "section": "偏印类象与配置",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": 19,
        "section": "偏印类象",
        "verificationStatus": "selected_pages_verified"
      }
    ],
    "module": "ten-gods",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "tg_pianyin_day_position",
    "title": "偏印在日柱：核心落点中的研究、洞察、筛选与非常规理解",
    "category": "ten_god",
    "domains": [
      "self",
      "parents",
      "career",
      "spouse",
      "wealth",
      "children"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 68,
    "gender": "all",
    "queryKeywords": [
      "偏印",
      "日柱",
      "自我状态"
    ],
    "trigger": {
      "tenGodsAny": [
        "偏印"
      ],
      "featuresAny": [
        "日柱",
        "day"
      ]
    },
    "requires": [
      "必须确认偏印确实落在日柱或该宫位被岁运直接引动",
      "结合透藏、根气、强弱和与日主的实际作用"
    ],
    "weakeningConditions": [
      "只有问题文本提到该宫位但命盘中并未落位",
      "该十神严重受制、无根或被其他结构改写"
    ],
    "imagery": {
      "core": [
        "偏印的主题更容易通过自我状态、亲密关系、日常选择与直接承接表现"
      ],
      "positive": [
        "得用时，敏感、策略、独立研究会在核心落点层面更明显"
      ],
      "negative": [
        "过旺或受损时，孤立、想法跳跃、输出不稳定也会通过核心落点层面显现"
      ],
      "realityChecks": [
        "核验自我状态、亲密关系、日常选择与直接承接是否确实是现实中反复出现的场域"
      ]
    },
    "advice": [
      "建立固定输出和验证机制"
    ],
    "prohibitions": [
      "不能只因偏印在日柱就直接断定具体人物吉凶或单一事件"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "47-49",
        "section": "偏印类象与配置",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": 19,
        "section": "偏印类象",
        "verificationStatus": "selected_pages_verified"
      }
    ],
    "module": "ten-gods",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "tg_pianyin_hour_position",
    "title": "偏印在时柱：结果与后续中的研究、洞察、筛选与非常规理解",
    "category": "ten_god",
    "domains": [
      "self",
      "parents",
      "career",
      "spouse",
      "wealth",
      "children"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 68,
    "gender": "all",
    "queryKeywords": [
      "偏印",
      "时柱",
      "执行结果"
    ],
    "trigger": {
      "tenGodsAny": [
        "偏印"
      ],
      "featuresAny": [
        "时柱",
        "hour"
      ]
    },
    "requires": [
      "必须确认偏印确实落在时柱或该宫位被岁运直接引动",
      "结合透藏、根气、强弱和与日主的实际作用"
    ],
    "weakeningConditions": [
      "只有问题文本提到该宫位但命盘中并未落位",
      "该十神严重受制、无根或被其他结构改写"
    ],
    "imagery": {
      "core": [
        "偏印的主题更容易通过执行结果、作品、后期规划、子女或下属层表现"
      ],
      "positive": [
        "得用时，敏感、策略、独立研究会在结果与后续层面更明显"
      ],
      "negative": [
        "过旺或受损时，孤立、想法跳跃、输出不稳定也会通过结果与后续层面显现"
      ],
      "realityChecks": [
        "核验执行结果、作品、后期规划、子女或下属层是否确实是现实中反复出现的场域"
      ]
    },
    "advice": [
      "建立固定输出和验证机制"
    ],
    "prohibitions": [
      "不能只因偏印在时柱就直接断定具体人物吉凶或单一事件"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "47-49",
        "section": "偏印类象与配置",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": 19,
        "section": "偏印类象",
        "verificationStatus": "selected_pages_verified"
      }
    ],
    "module": "ten-gods",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "tg_pianyin_strong_state",
    "title": "偏印偏旺：主题强化与过度使用",
    "category": "ten_god",
    "domains": [
      "self",
      "career",
      "wealth",
      "spouse",
      "fortune"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 74,
    "gender": "all",
    "queryKeywords": [
      "偏印",
      "偏旺",
      "太旺",
      "多"
    ],
    "trigger": {
      "tenGodsAny": [
        "偏印"
      ],
      "featuresAny": [
        "偏印旺",
        "偏印强",
        "偏印成势",
        "偏印多"
      ]
    },
    "requires": [
      "确认偏旺来自月令、根气、透干或多层重复，而非简单计数",
      "判断旺势是否真正作用到日主、用神或关键宫位"
    ],
    "weakeningConditions": [
      "虽多但无根、受制或不直接参与做功",
      "辅助评分与实际根气不一致"
    ],
    "imagery": {
      "core": [
        "偏印的研究、洞察、筛选与非常规理解成为高频行为模式"
      ],
      "positive": [
        "结构承接良好时，敏感、策略、独立研究可形成优势"
      ],
      "negative": [
        "失衡时更容易出现孤立、想法跳跃、输出不稳定"
      ],
      "realityChecks": [
        "现实中是否擅长处理复杂或非标准问题"
      ]
    },
    "advice": [
      "建立固定输出和验证机制"
    ],
    "prohibitions": [
      "不能仅凭偏印数量多就锁定职业、婚姻或吉凶"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "47-49",
        "section": "偏印类象与配置",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": 19,
        "section": "偏印类象",
        "verificationStatus": "selected_pages_verified"
      }
    ],
    "module": "ten-gods",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "tg_pianyin_controlled_state",
    "title": "偏印受制或不显：功能受限与替代通道",
    "category": "ten_god",
    "domains": [
      "self",
      "career",
      "wealth",
      "spouse",
      "fortune"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 71,
    "gender": "all",
    "queryKeywords": [
      "偏印",
      "弱",
      "受制",
      "不透",
      "入墓"
    ],
    "trigger": {
      "tenGodsAny": [
        "偏印"
      ],
      "featuresAny": [
        "偏印受制",
        "偏印弱",
        "偏印不透",
        "偏印入墓"
      ]
    },
    "requires": [
      "确认受制、无根、不透或入墓等具体事实",
      "同时寻找是否有生扶、通关、开库或岁运引动"
    ],
    "weakeningConditions": [
      "实际有强根或透干",
      "岁运已解除原局限制"
    ],
    "imagery": {
      "core": [
        "偏印代表的研究、洞察、筛选与非常规理解不容易直接表达，常需借助其他十神或岁运通道"
      ],
      "positive": [
        "受制若服务于整体制化，反而可能减少过度表现"
      ],
      "negative": [
        "功能不足时，敏感、策略、独立研究难以稳定落实"
      ],
      "realityChecks": [
        "现实中是否在研究、洞察、筛选与非常规理解相关事项上需要外部条件才能启动"
      ]
    },
    "advice": [
      "先寻找可替代的现实通道，不把单一弱项当成能力缺失"
    ],
    "prohibitions": [
      "不能把偏印弱或藏而不透直接等同于现实中没有对应人物或机会"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "47-49",
        "section": "偏印类象与配置",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": 19,
        "section": "偏印类象",
        "verificationStatus": "selected_pages_verified"
      }
    ],
    "module": "ten-gods",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "tg_shishen_year_position",
    "title": "食神在年柱：外层背景中的温和输出、技能、作品与生活节奏",
    "category": "ten_god",
    "domains": [
      "self",
      "parents",
      "career",
      "spouse",
      "wealth",
      "children"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 68,
    "gender": "all",
    "queryKeywords": [
      "食神",
      "年柱",
      "早年环境"
    ],
    "trigger": {
      "tenGodsAny": [
        "食神"
      ],
      "featuresAny": [
        "年柱",
        "year"
      ]
    },
    "requires": [
      "必须确认食神确实落在年柱或该宫位被岁运直接引动",
      "结合透藏、根气、强弱和与日主的实际作用"
    ],
    "weakeningConditions": [
      "只有问题文本提到该宫位但命盘中并未落位",
      "该十神严重受制、无根或被其他结构改写"
    ],
    "imagery": {
      "core": [
        "食神的主题更容易通过早年环境、家族根基、外部来源与远层关系表现"
      ],
      "positive": [
        "得用时，表达自然、服务意识、持续产出会在外层背景层面更明显"
      ],
      "negative": [
        "过旺或受损时，安逸、节奏松散、回避压力也会通过外层背景层面显现"
      ],
      "realityChecks": [
        "核验早年环境、家族根基、外部来源与远层关系是否确实是现实中反复出现的场域"
      ]
    },
    "advice": [
      "保持稳定节奏并设置明确交付"
    ],
    "prohibitions": [
      "不能只因食神在年柱就直接断定具体人物吉凶或单一事件"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "53-55",
        "section": "食神类象与配置",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "22-23",
        "section": "食神类象",
        "verificationStatus": "selected_pages_verified"
      }
    ],
    "module": "ten-gods",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "tg_shishen_month_position",
    "title": "食神在月柱：主要环境中的温和输出、技能、作品与生活节奏",
    "category": "ten_god",
    "domains": [
      "self",
      "parents",
      "career",
      "spouse",
      "wealth",
      "children"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 68,
    "gender": "all",
    "queryKeywords": [
      "食神",
      "月柱",
      "成长秩序"
    ],
    "trigger": {
      "tenGodsAny": [
        "食神"
      ],
      "featuresAny": [
        "月柱",
        "month"
      ]
    },
    "requires": [
      "必须确认食神确实落在月柱或该宫位被岁运直接引动",
      "结合透藏、根气、强弱和与日主的实际作用"
    ],
    "weakeningConditions": [
      "只有问题文本提到该宫位但命盘中并未落位",
      "该十神严重受制、无根或被其他结构改写"
    ],
    "imagery": {
      "core": [
        "食神的主题更容易通过成长秩序、父母承接、工作环境与社会接口表现"
      ],
      "positive": [
        "得用时，表达自然、服务意识、持续产出会在主要环境层面更明显"
      ],
      "negative": [
        "过旺或受损时，安逸、节奏松散、回避压力也会通过主要环境层面显现"
      ],
      "realityChecks": [
        "核验成长秩序、父母承接、工作环境与社会接口是否确实是现实中反复出现的场域"
      ]
    },
    "advice": [
      "保持稳定节奏并设置明确交付"
    ],
    "prohibitions": [
      "不能只因食神在月柱就直接断定具体人物吉凶或单一事件"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "53-55",
        "section": "食神类象与配置",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "22-23",
        "section": "食神类象",
        "verificationStatus": "selected_pages_verified"
      }
    ],
    "module": "ten-gods",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "tg_shishen_day_position",
    "title": "食神在日柱：核心落点中的温和输出、技能、作品与生活节奏",
    "category": "ten_god",
    "domains": [
      "self",
      "parents",
      "career",
      "spouse",
      "wealth",
      "children"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 68,
    "gender": "all",
    "queryKeywords": [
      "食神",
      "日柱",
      "自我状态"
    ],
    "trigger": {
      "tenGodsAny": [
        "食神"
      ],
      "featuresAny": [
        "日柱",
        "day"
      ]
    },
    "requires": [
      "必须确认食神确实落在日柱或该宫位被岁运直接引动",
      "结合透藏、根气、强弱和与日主的实际作用"
    ],
    "weakeningConditions": [
      "只有问题文本提到该宫位但命盘中并未落位",
      "该十神严重受制、无根或被其他结构改写"
    ],
    "imagery": {
      "core": [
        "食神的主题更容易通过自我状态、亲密关系、日常选择与直接承接表现"
      ],
      "positive": [
        "得用时，表达自然、服务意识、持续产出会在核心落点层面更明显"
      ],
      "negative": [
        "过旺或受损时，安逸、节奏松散、回避压力也会通过核心落点层面显现"
      ],
      "realityChecks": [
        "核验自我状态、亲密关系、日常选择与直接承接是否确实是现实中反复出现的场域"
      ]
    },
    "advice": [
      "保持稳定节奏并设置明确交付"
    ],
    "prohibitions": [
      "不能只因食神在日柱就直接断定具体人物吉凶或单一事件"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "53-55",
        "section": "食神类象与配置",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "22-23",
        "section": "食神类象",
        "verificationStatus": "selected_pages_verified"
      }
    ],
    "module": "ten-gods",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "tg_shishen_hour_position",
    "title": "食神在时柱：结果与后续中的温和输出、技能、作品与生活节奏",
    "category": "ten_god",
    "domains": [
      "self",
      "parents",
      "career",
      "spouse",
      "wealth",
      "children"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 68,
    "gender": "all",
    "queryKeywords": [
      "食神",
      "时柱",
      "执行结果"
    ],
    "trigger": {
      "tenGodsAny": [
        "食神"
      ],
      "featuresAny": [
        "时柱",
        "hour"
      ]
    },
    "requires": [
      "必须确认食神确实落在时柱或该宫位被岁运直接引动",
      "结合透藏、根气、强弱和与日主的实际作用"
    ],
    "weakeningConditions": [
      "只有问题文本提到该宫位但命盘中并未落位",
      "该十神严重受制、无根或被其他结构改写"
    ],
    "imagery": {
      "core": [
        "食神的主题更容易通过执行结果、作品、后期规划、子女或下属层表现"
      ],
      "positive": [
        "得用时，表达自然、服务意识、持续产出会在结果与后续层面更明显"
      ],
      "negative": [
        "过旺或受损时，安逸、节奏松散、回避压力也会通过结果与后续层面显现"
      ],
      "realityChecks": [
        "核验执行结果、作品、后期规划、子女或下属层是否确实是现实中反复出现的场域"
      ]
    },
    "advice": [
      "保持稳定节奏并设置明确交付"
    ],
    "prohibitions": [
      "不能只因食神在时柱就直接断定具体人物吉凶或单一事件"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "53-55",
        "section": "食神类象与配置",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "22-23",
        "section": "食神类象",
        "verificationStatus": "selected_pages_verified"
      }
    ],
    "module": "ten-gods",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "tg_shishen_strong_state",
    "title": "食神偏旺：主题强化与过度使用",
    "category": "ten_god",
    "domains": [
      "self",
      "career",
      "wealth",
      "spouse",
      "fortune"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 74,
    "gender": "all",
    "queryKeywords": [
      "食神",
      "偏旺",
      "太旺",
      "多"
    ],
    "trigger": {
      "tenGodsAny": [
        "食神"
      ],
      "featuresAny": [
        "食神旺",
        "食神强",
        "食神成势",
        "食神多"
      ]
    },
    "requires": [
      "确认偏旺来自月令、根气、透干或多层重复，而非简单计数",
      "判断旺势是否真正作用到日主、用神或关键宫位"
    ],
    "weakeningConditions": [
      "虽多但无根、受制或不直接参与做功",
      "辅助评分与实际根气不一致"
    ],
    "imagery": {
      "core": [
        "食神的温和输出、技能、作品与生活节奏成为高频行为模式"
      ],
      "positive": [
        "结构承接良好时，表达自然、服务意识、持续产出可形成优势"
      ],
      "negative": [
        "失衡时更容易出现安逸、节奏松散、回避压力"
      ],
      "realityChecks": [
        "现实中是否通过技术、作品、照顾或服务体现价值"
      ]
    },
    "advice": [
      "保持稳定节奏并设置明确交付"
    ],
    "prohibitions": [
      "不能仅凭食神数量多就锁定职业、婚姻或吉凶"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "53-55",
        "section": "食神类象与配置",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "22-23",
        "section": "食神类象",
        "verificationStatus": "selected_pages_verified"
      }
    ],
    "module": "ten-gods",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "tg_shishen_controlled_state",
    "title": "食神受制或不显：功能受限与替代通道",
    "category": "ten_god",
    "domains": [
      "self",
      "career",
      "wealth",
      "spouse",
      "fortune"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 71,
    "gender": "all",
    "queryKeywords": [
      "食神",
      "弱",
      "受制",
      "不透",
      "入墓"
    ],
    "trigger": {
      "tenGodsAny": [
        "食神"
      ],
      "featuresAny": [
        "食神受制",
        "食神弱",
        "食神不透",
        "食神入墓"
      ]
    },
    "requires": [
      "确认受制、无根、不透或入墓等具体事实",
      "同时寻找是否有生扶、通关、开库或岁运引动"
    ],
    "weakeningConditions": [
      "实际有强根或透干",
      "岁运已解除原局限制"
    ],
    "imagery": {
      "core": [
        "食神代表的温和输出、技能、作品与生活节奏不容易直接表达，常需借助其他十神或岁运通道"
      ],
      "positive": [
        "受制若服务于整体制化，反而可能减少过度表现"
      ],
      "negative": [
        "功能不足时，表达自然、服务意识、持续产出难以稳定落实"
      ],
      "realityChecks": [
        "现实中是否在温和输出、技能、作品与生活节奏相关事项上需要外部条件才能启动"
      ]
    },
    "advice": [
      "先寻找可替代的现实通道，不把单一弱项当成能力缺失"
    ],
    "prohibitions": [
      "不能把食神弱或藏而不透直接等同于现实中没有对应人物或机会"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "53-55",
        "section": "食神类象与配置",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "22-23",
        "section": "食神类象",
        "verificationStatus": "selected_pages_verified"
      }
    ],
    "module": "ten-gods",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "tg_shangguan_year_position",
    "title": "伤官在年柱：外层背景中的突破表达、创新、质疑与效率",
    "category": "ten_god",
    "domains": [
      "self",
      "parents",
      "career",
      "spouse",
      "wealth",
      "children"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 68,
    "gender": "all",
    "queryKeywords": [
      "伤官",
      "年柱",
      "早年环境"
    ],
    "trigger": {
      "tenGodsAny": [
        "伤官"
      ],
      "featuresAny": [
        "年柱",
        "year"
      ]
    },
    "requires": [
      "必须确认伤官确实落在年柱或该宫位被岁运直接引动",
      "结合透藏、根气、强弱和与日主的实际作用"
    ],
    "weakeningConditions": [
      "只有问题文本提到该宫位但命盘中并未落位",
      "该十神严重受制、无根或被其他结构改写"
    ],
    "imagery": {
      "core": [
        "伤官的主题更容易通过早年环境、家族根基、外部来源与远层关系表现"
      ],
      "positive": [
        "得用时，反应快、创新、敢于改进会在外层背景层面更明显"
      ],
      "negative": [
        "过旺或受损时，与规则摩擦、言语过直、变化过快也会通过外层背景层面显现"
      ],
      "realityChecks": [
        "核验早年环境、家族根基、外部来源与远层关系是否确实是现实中反复出现的场域"
      ]
    },
    "advice": [
      "先确认目标和边界，再表达不同意见"
    ],
    "prohibitions": [
      "不能只因伤官在年柱就直接断定具体人物吉凶或单一事件"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "53-55",
        "section": "伤官类象与配置",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "23-24",
        "section": "伤官类象",
        "verificationStatus": "selected_pages_verified"
      }
    ],
    "module": "ten-gods",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "tg_shangguan_month_position",
    "title": "伤官在月柱：主要环境中的突破表达、创新、质疑与效率",
    "category": "ten_god",
    "domains": [
      "self",
      "parents",
      "career",
      "spouse",
      "wealth",
      "children"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 68,
    "gender": "all",
    "queryKeywords": [
      "伤官",
      "月柱",
      "成长秩序"
    ],
    "trigger": {
      "tenGodsAny": [
        "伤官"
      ],
      "featuresAny": [
        "月柱",
        "month"
      ]
    },
    "requires": [
      "必须确认伤官确实落在月柱或该宫位被岁运直接引动",
      "结合透藏、根气、强弱和与日主的实际作用"
    ],
    "weakeningConditions": [
      "只有问题文本提到该宫位但命盘中并未落位",
      "该十神严重受制、无根或被其他结构改写"
    ],
    "imagery": {
      "core": [
        "伤官的主题更容易通过成长秩序、父母承接、工作环境与社会接口表现"
      ],
      "positive": [
        "得用时，反应快、创新、敢于改进会在主要环境层面更明显"
      ],
      "negative": [
        "过旺或受损时，与规则摩擦、言语过直、变化过快也会通过主要环境层面显现"
      ],
      "realityChecks": [
        "核验成长秩序、父母承接、工作环境与社会接口是否确实是现实中反复出现的场域"
      ]
    },
    "advice": [
      "先确认目标和边界，再表达不同意见"
    ],
    "prohibitions": [
      "不能只因伤官在月柱就直接断定具体人物吉凶或单一事件"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "53-55",
        "section": "伤官类象与配置",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "23-24",
        "section": "伤官类象",
        "verificationStatus": "selected_pages_verified"
      }
    ],
    "module": "ten-gods",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "tg_shangguan_day_position",
    "title": "伤官在日柱：核心落点中的突破表达、创新、质疑与效率",
    "category": "ten_god",
    "domains": [
      "self",
      "parents",
      "career",
      "spouse",
      "wealth",
      "children"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 68,
    "gender": "all",
    "queryKeywords": [
      "伤官",
      "日柱",
      "自我状态"
    ],
    "trigger": {
      "tenGodsAny": [
        "伤官"
      ],
      "featuresAny": [
        "日柱",
        "day"
      ]
    },
    "requires": [
      "必须确认伤官确实落在日柱或该宫位被岁运直接引动",
      "结合透藏、根气、强弱和与日主的实际作用"
    ],
    "weakeningConditions": [
      "只有问题文本提到该宫位但命盘中并未落位",
      "该十神严重受制、无根或被其他结构改写"
    ],
    "imagery": {
      "core": [
        "伤官的主题更容易通过自我状态、亲密关系、日常选择与直接承接表现"
      ],
      "positive": [
        "得用时，反应快、创新、敢于改进会在核心落点层面更明显"
      ],
      "negative": [
        "过旺或受损时，与规则摩擦、言语过直、变化过快也会通过核心落点层面显现"
      ],
      "realityChecks": [
        "核验自我状态、亲密关系、日常选择与直接承接是否确实是现实中反复出现的场域"
      ]
    },
    "advice": [
      "先确认目标和边界，再表达不同意见"
    ],
    "prohibitions": [
      "不能只因伤官在日柱就直接断定具体人物吉凶或单一事件"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "53-55",
        "section": "伤官类象与配置",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "23-24",
        "section": "伤官类象",
        "verificationStatus": "selected_pages_verified"
      }
    ],
    "module": "ten-gods",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "tg_shangguan_hour_position",
    "title": "伤官在时柱：结果与后续中的突破表达、创新、质疑与效率",
    "category": "ten_god",
    "domains": [
      "self",
      "parents",
      "career",
      "spouse",
      "wealth",
      "children"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 68,
    "gender": "all",
    "queryKeywords": [
      "伤官",
      "时柱",
      "执行结果"
    ],
    "trigger": {
      "tenGodsAny": [
        "伤官"
      ],
      "featuresAny": [
        "时柱",
        "hour"
      ]
    },
    "requires": [
      "必须确认伤官确实落在时柱或该宫位被岁运直接引动",
      "结合透藏、根气、强弱和与日主的实际作用"
    ],
    "weakeningConditions": [
      "只有问题文本提到该宫位但命盘中并未落位",
      "该十神严重受制、无根或被其他结构改写"
    ],
    "imagery": {
      "core": [
        "伤官的主题更容易通过执行结果、作品、后期规划、子女或下属层表现"
      ],
      "positive": [
        "得用时，反应快、创新、敢于改进会在结果与后续层面更明显"
      ],
      "negative": [
        "过旺或受损时，与规则摩擦、言语过直、变化过快也会通过结果与后续层面显现"
      ],
      "realityChecks": [
        "核验执行结果、作品、后期规划、子女或下属层是否确实是现实中反复出现的场域"
      ]
    },
    "advice": [
      "先确认目标和边界，再表达不同意见"
    ],
    "prohibitions": [
      "不能只因伤官在时柱就直接断定具体人物吉凶或单一事件"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "53-55",
        "section": "伤官类象与配置",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "23-24",
        "section": "伤官类象",
        "verificationStatus": "selected_pages_verified"
      }
    ],
    "module": "ten-gods",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "tg_shangguan_strong_state",
    "title": "伤官偏旺：主题强化与过度使用",
    "category": "ten_god",
    "domains": [
      "self",
      "career",
      "wealth",
      "spouse",
      "fortune"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 74,
    "gender": "all",
    "queryKeywords": [
      "伤官",
      "偏旺",
      "太旺",
      "多"
    ],
    "trigger": {
      "tenGodsAny": [
        "伤官"
      ],
      "featuresAny": [
        "伤官旺",
        "伤官强",
        "伤官成势",
        "伤官多"
      ]
    },
    "requires": [
      "确认偏旺来自月令、根气、透干或多层重复，而非简单计数",
      "判断旺势是否真正作用到日主、用神或关键宫位"
    ],
    "weakeningConditions": [
      "虽多但无根、受制或不直接参与做功",
      "辅助评分与实际根气不一致"
    ],
    "imagery": {
      "core": [
        "伤官的突破表达、创新、质疑与效率成为高频行为模式"
      ],
      "positive": [
        "结构承接良好时，反应快、创新、敢于改进可形成优势"
      ],
      "negative": [
        "失衡时更容易出现与规则摩擦、言语过直、变化过快"
      ],
      "realityChecks": [
        "现实中是否常发现制度漏洞并提出不同方案"
      ]
    },
    "advice": [
      "先确认目标和边界，再表达不同意见"
    ],
    "prohibitions": [
      "不能仅凭伤官数量多就锁定职业、婚姻或吉凶"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "53-55",
        "section": "伤官类象与配置",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "23-24",
        "section": "伤官类象",
        "verificationStatus": "selected_pages_verified"
      }
    ],
    "module": "ten-gods",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "tg_shangguan_controlled_state",
    "title": "伤官受制或不显：功能受限与替代通道",
    "category": "ten_god",
    "domains": [
      "self",
      "career",
      "wealth",
      "spouse",
      "fortune"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 71,
    "gender": "all",
    "queryKeywords": [
      "伤官",
      "弱",
      "受制",
      "不透",
      "入墓"
    ],
    "trigger": {
      "tenGodsAny": [
        "伤官"
      ],
      "featuresAny": [
        "伤官受制",
        "伤官弱",
        "伤官不透",
        "伤官入墓"
      ]
    },
    "requires": [
      "确认受制、无根、不透或入墓等具体事实",
      "同时寻找是否有生扶、通关、开库或岁运引动"
    ],
    "weakeningConditions": [
      "实际有强根或透干",
      "岁运已解除原局限制"
    ],
    "imagery": {
      "core": [
        "伤官代表的突破表达、创新、质疑与效率不容易直接表达，常需借助其他十神或岁运通道"
      ],
      "positive": [
        "受制若服务于整体制化，反而可能减少过度表现"
      ],
      "negative": [
        "功能不足时，反应快、创新、敢于改进难以稳定落实"
      ],
      "realityChecks": [
        "现实中是否在突破表达、创新、质疑与效率相关事项上需要外部条件才能启动"
      ]
    },
    "advice": [
      "先寻找可替代的现实通道，不把单一弱项当成能力缺失"
    ],
    "prohibitions": [
      "不能把伤官弱或藏而不透直接等同于现实中没有对应人物或机会"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "53-55",
        "section": "伤官类象与配置",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "23-24",
        "section": "伤官类象",
        "verificationStatus": "selected_pages_verified"
      }
    ],
    "module": "ten-gods",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "tg_zhengcai_year_position",
    "title": "正财在年柱：外层背景中的稳定资源、责任、预算与长期经营",
    "category": "ten_god",
    "domains": [
      "self",
      "parents",
      "career",
      "spouse",
      "wealth",
      "children"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 68,
    "gender": "all",
    "queryKeywords": [
      "正财",
      "年柱",
      "早年环境"
    ],
    "trigger": {
      "tenGodsAny": [
        "正财"
      ],
      "featuresAny": [
        "年柱",
        "year"
      ]
    },
    "requires": [
      "必须确认正财确实落在年柱或该宫位被岁运直接引动",
      "结合透藏、根气、强弱和与日主的实际作用"
    ],
    "weakeningConditions": [
      "只有问题文本提到该宫位但命盘中并未落位",
      "该十神严重受制、无根或被其他结构改写"
    ],
    "imagery": {
      "core": [
        "正财的主题更容易通过早年环境、家族根基、外部来源与远层关系表现"
      ],
      "positive": [
        "得用时，务实、重兑现、持续积累会在外层背景层面更明显"
      ],
      "negative": [
        "过旺或受损时，过度计较、受现实牵制、保守也会通过外层背景层面显现"
      ],
      "realityChecks": [
        "核验早年环境、家族根基、外部来源与远层关系是否确实是现实中反复出现的场域"
      ]
    },
    "advice": [
      "把责任分层，避免所有现实压力一人承担"
    ],
    "prohibitions": [
      "不能只因正财在年柱就直接断定具体人物吉凶或单一事件"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "45-47",
        "section": "正财类象与配置",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": 21,
        "section": "正财类象",
        "verificationStatus": "selected_pages_verified"
      }
    ],
    "module": "ten-gods",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "tg_zhengcai_month_position",
    "title": "正财在月柱：主要环境中的稳定资源、责任、预算与长期经营",
    "category": "ten_god",
    "domains": [
      "self",
      "parents",
      "career",
      "spouse",
      "wealth",
      "children"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 68,
    "gender": "all",
    "queryKeywords": [
      "正财",
      "月柱",
      "成长秩序"
    ],
    "trigger": {
      "tenGodsAny": [
        "正财"
      ],
      "featuresAny": [
        "月柱",
        "month"
      ]
    },
    "requires": [
      "必须确认正财确实落在月柱或该宫位被岁运直接引动",
      "结合透藏、根气、强弱和与日主的实际作用"
    ],
    "weakeningConditions": [
      "只有问题文本提到该宫位但命盘中并未落位",
      "该十神严重受制、无根或被其他结构改写"
    ],
    "imagery": {
      "core": [
        "正财的主题更容易通过成长秩序、父母承接、工作环境与社会接口表现"
      ],
      "positive": [
        "得用时，务实、重兑现、持续积累会在主要环境层面更明显"
      ],
      "negative": [
        "过旺或受损时，过度计较、受现实牵制、保守也会通过主要环境层面显现"
      ],
      "realityChecks": [
        "核验成长秩序、父母承接、工作环境与社会接口是否确实是现实中反复出现的场域"
      ]
    },
    "advice": [
      "把责任分层，避免所有现实压力一人承担"
    ],
    "prohibitions": [
      "不能只因正财在月柱就直接断定具体人物吉凶或单一事件"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "45-47",
        "section": "正财类象与配置",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": 21,
        "section": "正财类象",
        "verificationStatus": "selected_pages_verified"
      }
    ],
    "module": "ten-gods",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "tg_zhengcai_day_position",
    "title": "正财在日柱：核心落点中的稳定资源、责任、预算与长期经营",
    "category": "ten_god",
    "domains": [
      "self",
      "parents",
      "career",
      "spouse",
      "wealth",
      "children"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 68,
    "gender": "all",
    "queryKeywords": [
      "正财",
      "日柱",
      "自我状态"
    ],
    "trigger": {
      "tenGodsAny": [
        "正财"
      ],
      "featuresAny": [
        "日柱",
        "day"
      ]
    },
    "requires": [
      "必须确认正财确实落在日柱或该宫位被岁运直接引动",
      "结合透藏、根气、强弱和与日主的实际作用"
    ],
    "weakeningConditions": [
      "只有问题文本提到该宫位但命盘中并未落位",
      "该十神严重受制、无根或被其他结构改写"
    ],
    "imagery": {
      "core": [
        "正财的主题更容易通过自我状态、亲密关系、日常选择与直接承接表现"
      ],
      "positive": [
        "得用时，务实、重兑现、持续积累会在核心落点层面更明显"
      ],
      "negative": [
        "过旺或受损时，过度计较、受现实牵制、保守也会通过核心落点层面显现"
      ],
      "realityChecks": [
        "核验自我状态、亲密关系、日常选择与直接承接是否确实是现实中反复出现的场域"
      ]
    },
    "advice": [
      "把责任分层，避免所有现实压力一人承担"
    ],
    "prohibitions": [
      "不能只因正财在日柱就直接断定具体人物吉凶或单一事件"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "45-47",
        "section": "正财类象与配置",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": 21,
        "section": "正财类象",
        "verificationStatus": "selected_pages_verified"
      }
    ],
    "module": "ten-gods",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "tg_zhengcai_hour_position",
    "title": "正财在时柱：结果与后续中的稳定资源、责任、预算与长期经营",
    "category": "ten_god",
    "domains": [
      "self",
      "parents",
      "career",
      "spouse",
      "wealth",
      "children"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 68,
    "gender": "all",
    "queryKeywords": [
      "正财",
      "时柱",
      "执行结果"
    ],
    "trigger": {
      "tenGodsAny": [
        "正财"
      ],
      "featuresAny": [
        "时柱",
        "hour"
      ]
    },
    "requires": [
      "必须确认正财确实落在时柱或该宫位被岁运直接引动",
      "结合透藏、根气、强弱和与日主的实际作用"
    ],
    "weakeningConditions": [
      "只有问题文本提到该宫位但命盘中并未落位",
      "该十神严重受制、无根或被其他结构改写"
    ],
    "imagery": {
      "core": [
        "正财的主题更容易通过执行结果、作品、后期规划、子女或下属层表现"
      ],
      "positive": [
        "得用时，务实、重兑现、持续积累会在结果与后续层面更明显"
      ],
      "negative": [
        "过旺或受损时，过度计较、受现实牵制、保守也会通过结果与后续层面显现"
      ],
      "realityChecks": [
        "核验执行结果、作品、后期规划、子女或下属层是否确实是现实中反复出现的场域"
      ]
    },
    "advice": [
      "把责任分层，避免所有现实压力一人承担"
    ],
    "prohibitions": [
      "不能只因正财在时柱就直接断定具体人物吉凶或单一事件"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "45-47",
        "section": "正财类象与配置",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": 21,
        "section": "正财类象",
        "verificationStatus": "selected_pages_verified"
      }
    ],
    "module": "ten-gods",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "tg_zhengcai_strong_state",
    "title": "正财偏旺：主题强化与过度使用",
    "category": "ten_god",
    "domains": [
      "self",
      "career",
      "wealth",
      "spouse",
      "fortune"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 74,
    "gender": "all",
    "queryKeywords": [
      "正财",
      "偏旺",
      "太旺",
      "多"
    ],
    "trigger": {
      "tenGodsAny": [
        "正财"
      ],
      "featuresAny": [
        "正财旺",
        "正财强",
        "正财成势",
        "正财多"
      ]
    },
    "requires": [
      "确认偏旺来自月令、根气、透干或多层重复，而非简单计数",
      "判断旺势是否真正作用到日主、用神或关键宫位"
    ],
    "weakeningConditions": [
      "虽多但无根、受制或不直接参与做功",
      "辅助评分与实际根气不一致"
    ],
    "imagery": {
      "core": [
        "正财的稳定资源、责任、预算与长期经营成为高频行为模式"
      ],
      "positive": [
        "结构承接良好时，务实、重兑现、持续积累可形成优势"
      ],
      "negative": [
        "失衡时更容易出现过度计较、受现实牵制、保守"
      ],
      "realityChecks": [
        "现实中是否重视固定收入、长期关系和可持续安排"
      ]
    },
    "advice": [
      "把责任分层，避免所有现实压力一人承担"
    ],
    "prohibitions": [
      "不能仅凭正财数量多就锁定职业、婚姻或吉凶"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "45-47",
        "section": "正财类象与配置",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": 21,
        "section": "正财类象",
        "verificationStatus": "selected_pages_verified"
      }
    ],
    "module": "ten-gods",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "tg_zhengcai_controlled_state",
    "title": "正财受制或不显：功能受限与替代通道",
    "category": "ten_god",
    "domains": [
      "self",
      "career",
      "wealth",
      "spouse",
      "fortune"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 71,
    "gender": "all",
    "queryKeywords": [
      "正财",
      "弱",
      "受制",
      "不透",
      "入墓"
    ],
    "trigger": {
      "tenGodsAny": [
        "正财"
      ],
      "featuresAny": [
        "正财受制",
        "正财弱",
        "正财不透",
        "正财入墓"
      ]
    },
    "requires": [
      "确认受制、无根、不透或入墓等具体事实",
      "同时寻找是否有生扶、通关、开库或岁运引动"
    ],
    "weakeningConditions": [
      "实际有强根或透干",
      "岁运已解除原局限制"
    ],
    "imagery": {
      "core": [
        "正财代表的稳定资源、责任、预算与长期经营不容易直接表达，常需借助其他十神或岁运通道"
      ],
      "positive": [
        "受制若服务于整体制化，反而可能减少过度表现"
      ],
      "negative": [
        "功能不足时，务实、重兑现、持续积累难以稳定落实"
      ],
      "realityChecks": [
        "现实中是否在稳定资源、责任、预算与长期经营相关事项上需要外部条件才能启动"
      ]
    },
    "advice": [
      "先寻找可替代的现实通道，不把单一弱项当成能力缺失"
    ],
    "prohibitions": [
      "不能把正财弱或藏而不透直接等同于现实中没有对应人物或机会"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "45-47",
        "section": "正财类象与配置",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": 21,
        "section": "正财类象",
        "verificationStatus": "selected_pages_verified"
      }
    ],
    "module": "ten-gods",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "tg_piancai_year_position",
    "title": "偏财在年柱：外层背景中的流动资源、机会、人脉与多项选择",
    "category": "ten_god",
    "domains": [
      "self",
      "parents",
      "career",
      "spouse",
      "wealth",
      "children"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 68,
    "gender": "all",
    "queryKeywords": [
      "偏财",
      "年柱",
      "早年环境"
    ],
    "trigger": {
      "tenGodsAny": [
        "偏财"
      ],
      "featuresAny": [
        "年柱",
        "year"
      ]
    },
    "requires": [
      "必须确认偏财确实落在年柱或该宫位被岁运直接引动",
      "结合透藏、根气、强弱和与日主的实际作用"
    ],
    "weakeningConditions": [
      "只有问题文本提到该宫位但命盘中并未落位",
      "该十神严重受制、无根或被其他结构改写"
    ],
    "imagery": {
      "core": [
        "偏财的主题更容易通过早年环境、家族根基、外部来源与远层关系表现"
      ],
      "positive": [
        "得用时，灵活、善于连接、把握机会会在外层背景层面更明显"
      ],
      "negative": [
        "过旺或受损时，分散、追逐机会、边界模糊也会通过外层背景层面显现"
      ],
      "realityChecks": [
        "核验早年环境、家族根基、外部来源与远层关系是否确实是现实中反复出现的场域"
      ]
    },
    "advice": [
      "机会先做风险和现金流筛选"
    ],
    "prohibitions": [
      "不能只因偏财在年柱就直接断定具体人物吉凶或单一事件"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "45-47",
        "section": "偏财类象与配置",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": 21,
        "section": "偏财类象",
        "verificationStatus": "selected_pages_verified"
      }
    ],
    "module": "ten-gods",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "tg_piancai_month_position",
    "title": "偏财在月柱：主要环境中的流动资源、机会、人脉与多项选择",
    "category": "ten_god",
    "domains": [
      "self",
      "parents",
      "career",
      "spouse",
      "wealth",
      "children"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 68,
    "gender": "all",
    "queryKeywords": [
      "偏财",
      "月柱",
      "成长秩序"
    ],
    "trigger": {
      "tenGodsAny": [
        "偏财"
      ],
      "featuresAny": [
        "月柱",
        "month"
      ]
    },
    "requires": [
      "必须确认偏财确实落在月柱或该宫位被岁运直接引动",
      "结合透藏、根气、强弱和与日主的实际作用"
    ],
    "weakeningConditions": [
      "只有问题文本提到该宫位但命盘中并未落位",
      "该十神严重受制、无根或被其他结构改写"
    ],
    "imagery": {
      "core": [
        "偏财的主题更容易通过成长秩序、父母承接、工作环境与社会接口表现"
      ],
      "positive": [
        "得用时，灵活、善于连接、把握机会会在主要环境层面更明显"
      ],
      "negative": [
        "过旺或受损时，分散、追逐机会、边界模糊也会通过主要环境层面显现"
      ],
      "realityChecks": [
        "核验成长秩序、父母承接、工作环境与社会接口是否确实是现实中反复出现的场域"
      ]
    },
    "advice": [
      "机会先做风险和现金流筛选"
    ],
    "prohibitions": [
      "不能只因偏财在月柱就直接断定具体人物吉凶或单一事件"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "45-47",
        "section": "偏财类象与配置",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": 21,
        "section": "偏财类象",
        "verificationStatus": "selected_pages_verified"
      }
    ],
    "module": "ten-gods",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "tg_piancai_day_position",
    "title": "偏财在日柱：核心落点中的流动资源、机会、人脉与多项选择",
    "category": "ten_god",
    "domains": [
      "self",
      "parents",
      "career",
      "spouse",
      "wealth",
      "children"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 68,
    "gender": "all",
    "queryKeywords": [
      "偏财",
      "日柱",
      "自我状态"
    ],
    "trigger": {
      "tenGodsAny": [
        "偏财"
      ],
      "featuresAny": [
        "日柱",
        "day"
      ]
    },
    "requires": [
      "必须确认偏财确实落在日柱或该宫位被岁运直接引动",
      "结合透藏、根气、强弱和与日主的实际作用"
    ],
    "weakeningConditions": [
      "只有问题文本提到该宫位但命盘中并未落位",
      "该十神严重受制、无根或被其他结构改写"
    ],
    "imagery": {
      "core": [
        "偏财的主题更容易通过自我状态、亲密关系、日常选择与直接承接表现"
      ],
      "positive": [
        "得用时，灵活、善于连接、把握机会会在核心落点层面更明显"
      ],
      "negative": [
        "过旺或受损时，分散、追逐机会、边界模糊也会通过核心落点层面显现"
      ],
      "realityChecks": [
        "核验自我状态、亲密关系、日常选择与直接承接是否确实是现实中反复出现的场域"
      ]
    },
    "advice": [
      "机会先做风险和现金流筛选"
    ],
    "prohibitions": [
      "不能只因偏财在日柱就直接断定具体人物吉凶或单一事件"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "45-47",
        "section": "偏财类象与配置",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": 21,
        "section": "偏财类象",
        "verificationStatus": "selected_pages_verified"
      }
    ],
    "module": "ten-gods",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "tg_piancai_hour_position",
    "title": "偏财在时柱：结果与后续中的流动资源、机会、人脉与多项选择",
    "category": "ten_god",
    "domains": [
      "self",
      "parents",
      "career",
      "spouse",
      "wealth",
      "children"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 68,
    "gender": "all",
    "queryKeywords": [
      "偏财",
      "时柱",
      "执行结果"
    ],
    "trigger": {
      "tenGodsAny": [
        "偏财"
      ],
      "featuresAny": [
        "时柱",
        "hour"
      ]
    },
    "requires": [
      "必须确认偏财确实落在时柱或该宫位被岁运直接引动",
      "结合透藏、根气、强弱和与日主的实际作用"
    ],
    "weakeningConditions": [
      "只有问题文本提到该宫位但命盘中并未落位",
      "该十神严重受制、无根或被其他结构改写"
    ],
    "imagery": {
      "core": [
        "偏财的主题更容易通过执行结果、作品、后期规划、子女或下属层表现"
      ],
      "positive": [
        "得用时，灵活、善于连接、把握机会会在结果与后续层面更明显"
      ],
      "negative": [
        "过旺或受损时，分散、追逐机会、边界模糊也会通过结果与后续层面显现"
      ],
      "realityChecks": [
        "核验执行结果、作品、后期规划、子女或下属层是否确实是现实中反复出现的场域"
      ]
    },
    "advice": [
      "机会先做风险和现金流筛选"
    ],
    "prohibitions": [
      "不能只因偏财在时柱就直接断定具体人物吉凶或单一事件"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "45-47",
        "section": "偏财类象与配置",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": 21,
        "section": "偏财类象",
        "verificationStatus": "selected_pages_verified"
      }
    ],
    "module": "ten-gods",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "tg_piancai_strong_state",
    "title": "偏财偏旺：主题强化与过度使用",
    "category": "ten_god",
    "domains": [
      "self",
      "career",
      "wealth",
      "spouse",
      "fortune"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 74,
    "gender": "all",
    "queryKeywords": [
      "偏财",
      "偏旺",
      "太旺",
      "多"
    ],
    "trigger": {
      "tenGodsAny": [
        "偏财"
      ],
      "featuresAny": [
        "偏财旺",
        "偏财强",
        "偏财成势",
        "偏财多"
      ]
    },
    "requires": [
      "确认偏旺来自月令、根气、透干或多层重复，而非简单计数",
      "判断旺势是否真正作用到日主、用神或关键宫位"
    ],
    "weakeningConditions": [
      "虽多但无根、受制或不直接参与做功",
      "辅助评分与实际根气不一致"
    ],
    "imagery": {
      "core": [
        "偏财的流动资源、机会、人脉与多项选择成为高频行为模式"
      ],
      "positive": [
        "结构承接良好时，灵活、善于连接、把握机会可形成优势"
      ],
      "negative": [
        "失衡时更容易出现分散、追逐机会、边界模糊"
      ],
      "realityChecks": [
        "现实中是否常从项目、人脉或临时机会获得资源"
      ]
    },
    "advice": [
      "机会先做风险和现金流筛选"
    ],
    "prohibitions": [
      "不能仅凭偏财数量多就锁定职业、婚姻或吉凶"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "45-47",
        "section": "偏财类象与配置",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": 21,
        "section": "偏财类象",
        "verificationStatus": "selected_pages_verified"
      }
    ],
    "module": "ten-gods",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "tg_piancai_controlled_state",
    "title": "偏财受制或不显：功能受限与替代通道",
    "category": "ten_god",
    "domains": [
      "self",
      "career",
      "wealth",
      "spouse",
      "fortune"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 71,
    "gender": "all",
    "queryKeywords": [
      "偏财",
      "弱",
      "受制",
      "不透",
      "入墓"
    ],
    "trigger": {
      "tenGodsAny": [
        "偏财"
      ],
      "featuresAny": [
        "偏财受制",
        "偏财弱",
        "偏财不透",
        "偏财入墓"
      ]
    },
    "requires": [
      "确认受制、无根、不透或入墓等具体事实",
      "同时寻找是否有生扶、通关、开库或岁运引动"
    ],
    "weakeningConditions": [
      "实际有强根或透干",
      "岁运已解除原局限制"
    ],
    "imagery": {
      "core": [
        "偏财代表的流动资源、机会、人脉与多项选择不容易直接表达，常需借助其他十神或岁运通道"
      ],
      "positive": [
        "受制若服务于整体制化，反而可能减少过度表现"
      ],
      "negative": [
        "功能不足时，灵活、善于连接、把握机会难以稳定落实"
      ],
      "realityChecks": [
        "现实中是否在流动资源、机会、人脉与多项选择相关事项上需要外部条件才能启动"
      ]
    },
    "advice": [
      "先寻找可替代的现实通道，不把单一弱项当成能力缺失"
    ],
    "prohibitions": [
      "不能把偏财弱或藏而不透直接等同于现实中没有对应人物或机会"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "45-47",
        "section": "偏财类象与配置",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": 21,
        "section": "偏财类象",
        "verificationStatus": "selected_pages_verified"
      }
    ],
    "module": "ten-gods",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "tg_zhengguan_year_position",
    "title": "正官在年柱：外层背景中的秩序、责任、职位与正式身份",
    "category": "ten_god",
    "domains": [
      "self",
      "parents",
      "career",
      "spouse",
      "wealth",
      "children"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 68,
    "gender": "all",
    "queryKeywords": [
      "正官",
      "年柱",
      "早年环境"
    ],
    "trigger": {
      "tenGodsAny": [
        "正官"
      ],
      "featuresAny": [
        "年柱",
        "year"
      ]
    },
    "requires": [
      "必须确认正官确实落在年柱或该宫位被岁运直接引动",
      "结合透藏、根气、强弱和与日主的实际作用"
    ],
    "weakeningConditions": [
      "只有问题文本提到该宫位但命盘中并未落位",
      "该十神严重受制、无根或被其他结构改写"
    ],
    "imagery": {
      "core": [
        "正官的主题更容易通过早年环境、家族根基、外部来源与远层关系表现"
      ],
      "positive": [
        "得用时，自律、可靠、能在规则内承担会在外层背景层面更明显"
      ],
      "negative": [
        "过旺或受损时，拘谨、压力、过度在意评价也会通过外层背景层面显现"
      ],
      "realityChecks": [
        "核验早年环境、家族根基、外部来源与远层关系是否确实是现实中反复出现的场域"
      ]
    },
    "advice": [
      "把外部要求转成可执行步骤"
    ],
    "prohibitions": [
      "不能只因正官在年柱就直接断定具体人物吉凶或单一事件"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "50-52",
        "section": "正官类象与配置",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "19-20",
        "section": "正官类象",
        "verificationStatus": "selected_pages_verified"
      }
    ],
    "module": "ten-gods",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "tg_zhengguan_month_position",
    "title": "正官在月柱：主要环境中的秩序、责任、职位与正式身份",
    "category": "ten_god",
    "domains": [
      "self",
      "parents",
      "career",
      "spouse",
      "wealth",
      "children"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 68,
    "gender": "all",
    "queryKeywords": [
      "正官",
      "月柱",
      "成长秩序"
    ],
    "trigger": {
      "tenGodsAny": [
        "正官"
      ],
      "featuresAny": [
        "月柱",
        "month"
      ]
    },
    "requires": [
      "必须确认正官确实落在月柱或该宫位被岁运直接引动",
      "结合透藏、根气、强弱和与日主的实际作用"
    ],
    "weakeningConditions": [
      "只有问题文本提到该宫位但命盘中并未落位",
      "该十神严重受制、无根或被其他结构改写"
    ],
    "imagery": {
      "core": [
        "正官的主题更容易通过成长秩序、父母承接、工作环境与社会接口表现"
      ],
      "positive": [
        "得用时，自律、可靠、能在规则内承担会在主要环境层面更明显"
      ],
      "negative": [
        "过旺或受损时，拘谨、压力、过度在意评价也会通过主要环境层面显现"
      ],
      "realityChecks": [
        "核验成长秩序、父母承接、工作环境与社会接口是否确实是现实中反复出现的场域"
      ]
    },
    "advice": [
      "把外部要求转成可执行步骤"
    ],
    "prohibitions": [
      "不能只因正官在月柱就直接断定具体人物吉凶或单一事件"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "50-52",
        "section": "正官类象与配置",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "19-20",
        "section": "正官类象",
        "verificationStatus": "selected_pages_verified"
      }
    ],
    "module": "ten-gods",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "tg_zhengguan_day_position",
    "title": "正官在日柱：核心落点中的秩序、责任、职位与正式身份",
    "category": "ten_god",
    "domains": [
      "self",
      "parents",
      "career",
      "spouse",
      "wealth",
      "children"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 68,
    "gender": "all",
    "queryKeywords": [
      "正官",
      "日柱",
      "自我状态"
    ],
    "trigger": {
      "tenGodsAny": [
        "正官"
      ],
      "featuresAny": [
        "日柱",
        "day"
      ]
    },
    "requires": [
      "必须确认正官确实落在日柱或该宫位被岁运直接引动",
      "结合透藏、根气、强弱和与日主的实际作用"
    ],
    "weakeningConditions": [
      "只有问题文本提到该宫位但命盘中并未落位",
      "该十神严重受制、无根或被其他结构改写"
    ],
    "imagery": {
      "core": [
        "正官的主题更容易通过自我状态、亲密关系、日常选择与直接承接表现"
      ],
      "positive": [
        "得用时，自律、可靠、能在规则内承担会在核心落点层面更明显"
      ],
      "negative": [
        "过旺或受损时，拘谨、压力、过度在意评价也会通过核心落点层面显现"
      ],
      "realityChecks": [
        "核验自我状态、亲密关系、日常选择与直接承接是否确实是现实中反复出现的场域"
      ]
    },
    "advice": [
      "把外部要求转成可执行步骤"
    ],
    "prohibitions": [
      "不能只因正官在日柱就直接断定具体人物吉凶或单一事件"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "50-52",
        "section": "正官类象与配置",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "19-20",
        "section": "正官类象",
        "verificationStatus": "selected_pages_verified"
      }
    ],
    "module": "ten-gods",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "tg_zhengguan_hour_position",
    "title": "正官在时柱：结果与后续中的秩序、责任、职位与正式身份",
    "category": "ten_god",
    "domains": [
      "self",
      "parents",
      "career",
      "spouse",
      "wealth",
      "children"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 68,
    "gender": "all",
    "queryKeywords": [
      "正官",
      "时柱",
      "执行结果"
    ],
    "trigger": {
      "tenGodsAny": [
        "正官"
      ],
      "featuresAny": [
        "时柱",
        "hour"
      ]
    },
    "requires": [
      "必须确认正官确实落在时柱或该宫位被岁运直接引动",
      "结合透藏、根气、强弱和与日主的实际作用"
    ],
    "weakeningConditions": [
      "只有问题文本提到该宫位但命盘中并未落位",
      "该十神严重受制、无根或被其他结构改写"
    ],
    "imagery": {
      "core": [
        "正官的主题更容易通过执行结果、作品、后期规划、子女或下属层表现"
      ],
      "positive": [
        "得用时，自律、可靠、能在规则内承担会在结果与后续层面更明显"
      ],
      "negative": [
        "过旺或受损时，拘谨、压力、过度在意评价也会通过结果与后续层面显现"
      ],
      "realityChecks": [
        "核验执行结果、作品、后期规划、子女或下属层是否确实是现实中反复出现的场域"
      ]
    },
    "advice": [
      "把外部要求转成可执行步骤"
    ],
    "prohibitions": [
      "不能只因正官在时柱就直接断定具体人物吉凶或单一事件"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "50-52",
        "section": "正官类象与配置",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "19-20",
        "section": "正官类象",
        "verificationStatus": "selected_pages_verified"
      }
    ],
    "module": "ten-gods",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "tg_zhengguan_strong_state",
    "title": "正官偏旺：主题强化与过度使用",
    "category": "ten_god",
    "domains": [
      "self",
      "career",
      "wealth",
      "spouse",
      "fortune"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 74,
    "gender": "all",
    "queryKeywords": [
      "正官",
      "偏旺",
      "太旺",
      "多"
    ],
    "trigger": {
      "tenGodsAny": [
        "正官"
      ],
      "featuresAny": [
        "正官旺",
        "正官强",
        "正官成势",
        "正官多"
      ]
    },
    "requires": [
      "确认偏旺来自月令、根气、透干或多层重复，而非简单计数",
      "判断旺势是否真正作用到日主、用神或关键宫位"
    ],
    "weakeningConditions": [
      "虽多但无根、受制或不直接参与做功",
      "辅助评分与实际根气不一致"
    ],
    "imagery": {
      "core": [
        "正官的秩序、责任、职位与正式身份成为高频行为模式"
      ],
      "positive": [
        "结构承接良好时，自律、可靠、能在规则内承担可形成优势"
      ],
      "negative": [
        "失衡时更容易出现拘谨、压力、过度在意评价"
      ],
      "realityChecks": [
        "现实中是否重视正式流程、身份与责任评价"
      ]
    },
    "advice": [
      "把外部要求转成可执行步骤"
    ],
    "prohibitions": [
      "不能仅凭正官数量多就锁定职业、婚姻或吉凶"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "50-52",
        "section": "正官类象与配置",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "19-20",
        "section": "正官类象",
        "verificationStatus": "selected_pages_verified"
      }
    ],
    "module": "ten-gods",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "tg_zhengguan_controlled_state",
    "title": "正官受制或不显：功能受限与替代通道",
    "category": "ten_god",
    "domains": [
      "self",
      "career",
      "wealth",
      "spouse",
      "fortune"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 71,
    "gender": "all",
    "queryKeywords": [
      "正官",
      "弱",
      "受制",
      "不透",
      "入墓"
    ],
    "trigger": {
      "tenGodsAny": [
        "正官"
      ],
      "featuresAny": [
        "正官受制",
        "正官弱",
        "正官不透",
        "正官入墓"
      ]
    },
    "requires": [
      "确认受制、无根、不透或入墓等具体事实",
      "同时寻找是否有生扶、通关、开库或岁运引动"
    ],
    "weakeningConditions": [
      "实际有强根或透干",
      "岁运已解除原局限制"
    ],
    "imagery": {
      "core": [
        "正官代表的秩序、责任、职位与正式身份不容易直接表达，常需借助其他十神或岁运通道"
      ],
      "positive": [
        "受制若服务于整体制化，反而可能减少过度表现"
      ],
      "negative": [
        "功能不足时，自律、可靠、能在规则内承担难以稳定落实"
      ],
      "realityChecks": [
        "现实中是否在秩序、责任、职位与正式身份相关事项上需要外部条件才能启动"
      ]
    },
    "advice": [
      "先寻找可替代的现实通道，不把单一弱项当成能力缺失"
    ],
    "prohibitions": [
      "不能把正官弱或藏而不透直接等同于现实中没有对应人物或机会"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "50-52",
        "section": "正官类象与配置",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "19-20",
        "section": "正官类象",
        "verificationStatus": "selected_pages_verified"
      }
    ],
    "module": "ten-gods",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "tg_qisha_year_position",
    "title": "七杀在年柱：外层背景中的压力、竞争、执行、风险与强制变化",
    "category": "ten_god",
    "domains": [
      "self",
      "parents",
      "career",
      "spouse",
      "wealth",
      "children"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 68,
    "gender": "all",
    "queryKeywords": [
      "七杀",
      "年柱",
      "早年环境"
    ],
    "trigger": {
      "tenGodsAny": [
        "七杀"
      ],
      "featuresAny": [
        "年柱",
        "year"
      ]
    },
    "requires": [
      "必须确认七杀确实落在年柱或该宫位被岁运直接引动",
      "结合透藏、根气、强弱和与日主的实际作用"
    ],
    "weakeningConditions": [
      "只有问题文本提到该宫位但命盘中并未落位",
      "该十神严重受制、无根或被其他结构改写"
    ],
    "imagery": {
      "core": [
        "七杀的主题更容易通过早年环境、家族根基、外部来源与远层关系表现"
      ],
      "positive": [
        "得用时，果断、抗压、危机处理会在外层背景层面更明显"
      ],
      "negative": [
        "过旺或受损时，紧张、冲突、过度防御也会通过外层背景层面显现"
      ],
      "realityChecks": [
        "核验早年环境、家族根基、外部来源与远层关系是否确实是现实中反复出现的场域"
      ]
    },
    "advice": [
      "建立风险预案，避免在压力下孤注一掷"
    ],
    "prohibitions": [
      "不能只因七杀在年柱就直接断定具体人物吉凶或单一事件"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "50-52",
        "section": "七杀类象与配置",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": 20,
        "section": "七杀类象",
        "verificationStatus": "selected_pages_verified"
      }
    ],
    "module": "ten-gods",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "tg_qisha_month_position",
    "title": "七杀在月柱：主要环境中的压力、竞争、执行、风险与强制变化",
    "category": "ten_god",
    "domains": [
      "self",
      "parents",
      "career",
      "spouse",
      "wealth",
      "children"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 68,
    "gender": "all",
    "queryKeywords": [
      "七杀",
      "月柱",
      "成长秩序"
    ],
    "trigger": {
      "tenGodsAny": [
        "七杀"
      ],
      "featuresAny": [
        "月柱",
        "month"
      ]
    },
    "requires": [
      "必须确认七杀确实落在月柱或该宫位被岁运直接引动",
      "结合透藏、根气、强弱和与日主的实际作用"
    ],
    "weakeningConditions": [
      "只有问题文本提到该宫位但命盘中并未落位",
      "该十神严重受制、无根或被其他结构改写"
    ],
    "imagery": {
      "core": [
        "七杀的主题更容易通过成长秩序、父母承接、工作环境与社会接口表现"
      ],
      "positive": [
        "得用时，果断、抗压、危机处理会在主要环境层面更明显"
      ],
      "negative": [
        "过旺或受损时，紧张、冲突、过度防御也会通过主要环境层面显现"
      ],
      "realityChecks": [
        "核验成长秩序、父母承接、工作环境与社会接口是否确实是现实中反复出现的场域"
      ]
    },
    "advice": [
      "建立风险预案，避免在压力下孤注一掷"
    ],
    "prohibitions": [
      "不能只因七杀在月柱就直接断定具体人物吉凶或单一事件"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "50-52",
        "section": "七杀类象与配置",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": 20,
        "section": "七杀类象",
        "verificationStatus": "selected_pages_verified"
      }
    ],
    "module": "ten-gods",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "tg_qisha_day_position",
    "title": "七杀在日柱：核心落点中的压力、竞争、执行、风险与强制变化",
    "category": "ten_god",
    "domains": [
      "self",
      "parents",
      "career",
      "spouse",
      "wealth",
      "children"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 68,
    "gender": "all",
    "queryKeywords": [
      "七杀",
      "日柱",
      "自我状态"
    ],
    "trigger": {
      "tenGodsAny": [
        "七杀"
      ],
      "featuresAny": [
        "日柱",
        "day"
      ]
    },
    "requires": [
      "必须确认七杀确实落在日柱或该宫位被岁运直接引动",
      "结合透藏、根气、强弱和与日主的实际作用"
    ],
    "weakeningConditions": [
      "只有问题文本提到该宫位但命盘中并未落位",
      "该十神严重受制、无根或被其他结构改写"
    ],
    "imagery": {
      "core": [
        "七杀的主题更容易通过自我状态、亲密关系、日常选择与直接承接表现"
      ],
      "positive": [
        "得用时，果断、抗压、危机处理会在核心落点层面更明显"
      ],
      "negative": [
        "过旺或受损时，紧张、冲突、过度防御也会通过核心落点层面显现"
      ],
      "realityChecks": [
        "核验自我状态、亲密关系、日常选择与直接承接是否确实是现实中反复出现的场域"
      ]
    },
    "advice": [
      "建立风险预案，避免在压力下孤注一掷"
    ],
    "prohibitions": [
      "不能只因七杀在日柱就直接断定具体人物吉凶或单一事件"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "50-52",
        "section": "七杀类象与配置",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": 20,
        "section": "七杀类象",
        "verificationStatus": "selected_pages_verified"
      }
    ],
    "module": "ten-gods",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "tg_qisha_hour_position",
    "title": "七杀在时柱：结果与后续中的压力、竞争、执行、风险与强制变化",
    "category": "ten_god",
    "domains": [
      "self",
      "parents",
      "career",
      "spouse",
      "wealth",
      "children"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 68,
    "gender": "all",
    "queryKeywords": [
      "七杀",
      "时柱",
      "执行结果"
    ],
    "trigger": {
      "tenGodsAny": [
        "七杀"
      ],
      "featuresAny": [
        "时柱",
        "hour"
      ]
    },
    "requires": [
      "必须确认七杀确实落在时柱或该宫位被岁运直接引动",
      "结合透藏、根气、强弱和与日主的实际作用"
    ],
    "weakeningConditions": [
      "只有问题文本提到该宫位但命盘中并未落位",
      "该十神严重受制、无根或被其他结构改写"
    ],
    "imagery": {
      "core": [
        "七杀的主题更容易通过执行结果、作品、后期规划、子女或下属层表现"
      ],
      "positive": [
        "得用时，果断、抗压、危机处理会在结果与后续层面更明显"
      ],
      "negative": [
        "过旺或受损时，紧张、冲突、过度防御也会通过结果与后续层面显现"
      ],
      "realityChecks": [
        "核验执行结果、作品、后期规划、子女或下属层是否确实是现实中反复出现的场域"
      ]
    },
    "advice": [
      "建立风险预案，避免在压力下孤注一掷"
    ],
    "prohibitions": [
      "不能只因七杀在时柱就直接断定具体人物吉凶或单一事件"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "50-52",
        "section": "七杀类象与配置",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": 20,
        "section": "七杀类象",
        "verificationStatus": "selected_pages_verified"
      }
    ],
    "module": "ten-gods",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "tg_qisha_strong_state",
    "title": "七杀偏旺：主题强化与过度使用",
    "category": "ten_god",
    "domains": [
      "self",
      "career",
      "wealth",
      "spouse",
      "fortune"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 74,
    "gender": "all",
    "queryKeywords": [
      "七杀",
      "偏旺",
      "太旺",
      "多"
    ],
    "trigger": {
      "tenGodsAny": [
        "七杀"
      ],
      "featuresAny": [
        "七杀旺",
        "七杀强",
        "七杀成势",
        "七杀多"
      ]
    },
    "requires": [
      "确认偏旺来自月令、根气、透干或多层重复，而非简单计数",
      "判断旺势是否真正作用到日主、用神或关键宫位"
    ],
    "weakeningConditions": [
      "虽多但无根、受制或不直接参与做功",
      "辅助评分与实际根气不一致"
    ],
    "imagery": {
      "core": [
        "七杀的压力、竞争、执行、风险与强制变化成为高频行为模式"
      ],
      "positive": [
        "结构承接良好时，果断、抗压、危机处理可形成优势"
      ],
      "negative": [
        "失衡时更容易出现紧张、冲突、过度防御"
      ],
      "realityChecks": [
        "现实中是否经常面对高压、竞争或需要快速决策的场景"
      ]
    },
    "advice": [
      "建立风险预案，避免在压力下孤注一掷"
    ],
    "prohibitions": [
      "不能仅凭七杀数量多就锁定职业、婚姻或吉凶"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "50-52",
        "section": "七杀类象与配置",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": 20,
        "section": "七杀类象",
        "verificationStatus": "selected_pages_verified"
      }
    ],
    "module": "ten-gods",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "tg_qisha_controlled_state",
    "title": "七杀受制或不显：功能受限与替代通道",
    "category": "ten_god",
    "domains": [
      "self",
      "career",
      "wealth",
      "spouse",
      "fortune"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 71,
    "gender": "all",
    "queryKeywords": [
      "七杀",
      "弱",
      "受制",
      "不透",
      "入墓"
    ],
    "trigger": {
      "tenGodsAny": [
        "七杀"
      ],
      "featuresAny": [
        "七杀受制",
        "七杀弱",
        "七杀不透",
        "七杀入墓"
      ]
    },
    "requires": [
      "确认受制、无根、不透或入墓等具体事实",
      "同时寻找是否有生扶、通关、开库或岁运引动"
    ],
    "weakeningConditions": [
      "实际有强根或透干",
      "岁运已解除原局限制"
    ],
    "imagery": {
      "core": [
        "七杀代表的压力、竞争、执行、风险与强制变化不容易直接表达，常需借助其他十神或岁运通道"
      ],
      "positive": [
        "受制若服务于整体制化，反而可能减少过度表现"
      ],
      "negative": [
        "功能不足时，果断、抗压、危机处理难以稳定落实"
      ],
      "realityChecks": [
        "现实中是否在压力、竞争、执行、风险与强制变化相关事项上需要外部条件才能启动"
      ]
    },
    "advice": [
      "先寻找可替代的现实通道，不把单一弱项当成能力缺失"
    ],
    "prohibitions": [
      "不能把七杀弱或藏而不透直接等同于现实中没有对应人物或机会"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "50-52",
        "section": "七杀类象与配置",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": 20,
        "section": "七杀类象",
        "verificationStatus": "selected_pages_verified"
      }
    ],
    "module": "ten-gods",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "element_wood_season_root",
    "title": "木：季节与根气",
    "category": "element",
    "domains": [
      "self",
      "career",
      "wealth",
      "health",
      "movement",
      "fortune"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 65,
    "gender": "all",
    "queryKeywords": [
      "木",
      "季节与根气",
      "五行"
    ],
    "trigger": {
      "stemsAny": [
        "甲",
        "乙"
      ],
      "branchesAny": [
        "寅",
        "卯"
      ],
      "featuresAny": [
        "月令",
        "根气",
        "木"
      ]
    },
    "requires": [
      "先看是否得时、得地与有源",
      "同时结合阴阳、位置、十神和宫位"
    ],
    "weakeningConditions": [
      "只出现孤字而无根无作用",
      "被其他五行强烈制化或不参与当前问题"
    ],
    "imagery": {
      "core": [
        "木的状态要结合季节和根气；需要根、水分、空间和适度阳光"
      ],
      "positive": [
        "得用时可体现生长、规划、连接、教育与向上发展的正向功能"
      ],
      "negative": [
        "过旺时容易扩张过快、枝节过多或目标分散"
      ],
      "realityChecks": [
        "检查木是否得令、通根、透干并被关键结构调用"
      ]
    },
    "advice": [
      "现实建议围绕筋骨舒展、情绪条达与生活节律和结构所需的流通方式，不用颜色、饮食或饰品替代真实行动"
    ],
    "prohibitions": [
      "不能只按五行个数判断旺弱",
      "不能以五行物象替代职业、医学或事件证据"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "251-277",
        "section": "木五行与职业像法",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_five_elements",
        "pdfPage": "5-13",
        "section": "五行基础与章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "elements",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "element_wood_flow_channel",
    "title": "木：流通与出口",
    "category": "element",
    "domains": [
      "self",
      "career",
      "wealth",
      "health",
      "movement",
      "fortune"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 65,
    "gender": "all",
    "queryKeywords": [
      "木",
      "流通与出口",
      "五行"
    ],
    "trigger": {
      "stemsAny": [
        "甲",
        "乙"
      ],
      "branchesAny": [
        "寅",
        "卯"
      ],
      "featuresAny": [
        "流通",
        "通关",
        "出口",
        "木"
      ]
    },
    "requires": [
      "看是否能生、泄、制、化并进入现实成果",
      "同时结合阴阳、位置、十神和宫位"
    ],
    "weakeningConditions": [
      "只出现孤字而无根无作用",
      "被其他五行强烈制化或不参与当前问题"
    ],
    "imagery": {
      "core": [
        "木是否有价值取决于能否流通；需要根、水分、空间和适度阳光"
      ],
      "positive": [
        "得用时可体现生长、规划、连接、教育与向上发展的正向功能"
      ],
      "negative": [
        "过旺时容易扩张过快、枝节过多或目标分散"
      ],
      "realityChecks": [
        "检查木从哪里来、到哪里去、是否形成成果或制化"
      ]
    },
    "advice": [
      "现实建议围绕筋骨舒展、情绪条达与生活节律和结构所需的流通方式，不用颜色、饮食或饰品替代真实行动"
    ],
    "prohibitions": [
      "不能把出现等同于有效做功",
      "不能以五行物象替代职业、医学或事件证据"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "251-277",
        "section": "木五行与职业像法",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_five_elements",
        "pdfPage": "5-13",
        "section": "五行基础与章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "elements",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "element_wood_excess",
    "title": "木：偏旺与成势",
    "category": "element",
    "domains": [
      "self",
      "career",
      "wealth",
      "health",
      "movement",
      "fortune"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 65,
    "gender": "all",
    "queryKeywords": [
      "木",
      "偏旺与成势",
      "五行"
    ],
    "trigger": {
      "stemsAny": [
        "甲",
        "乙"
      ],
      "branchesAny": [
        "寅",
        "卯"
      ],
      "featuresAny": [
        "偏旺",
        "成势",
        "太旺",
        "木"
      ]
    },
    "requires": [
      "看旺势服务于什么结构，以及是否有制泄",
      "同时结合阴阳、位置、十神和宫位"
    ],
    "weakeningConditions": [
      "只出现孤字而无根无作用",
      "被其他五行强烈制化或不参与当前问题"
    ],
    "imagery": {
      "core": [
        "木的生长、规划、连接、教育与向上发展被放大；过旺时容易扩张过快、枝节过多或目标分散"
      ],
      "positive": [
        "得用时可体现生长、规划、连接、教育与向上发展的正向功能"
      ],
      "negative": [
        "过旺时容易扩张过快、枝节过多或目标分散"
      ],
      "realityChecks": [
        "现实中是否反复出现与生长、规划、连接、教育与向上发展相关的过度或高频表现"
      ]
    },
    "advice": [
      "现实建议围绕筋骨舒展、情绪条达与生活节律和结构所需的流通方式，不用颜色、饮食或饰品替代真实行动"
    ],
    "prohibitions": [
      "不能直接判吉凶",
      "不能以五行物象替代职业、医学或事件证据"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "251-277",
        "section": "木五行与职业像法",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_five_elements",
        "pdfPage": "5-13",
        "section": "五行基础与章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "elements",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "element_wood_weak",
    "title": "木：偏弱与受制",
    "category": "element",
    "domains": [
      "self",
      "career",
      "wealth",
      "health",
      "movement",
      "fortune"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 65,
    "gender": "all",
    "queryKeywords": [
      "木",
      "偏弱与受制",
      "五行"
    ],
    "trigger": {
      "stemsAny": [
        "甲",
        "乙"
      ],
      "branchesAny": [
        "寅",
        "卯"
      ],
      "featuresAny": [
        "偏弱",
        "受制",
        "无根",
        "木"
      ]
    },
    "requires": [
      "看是否有来源、救应、岁运补充与替代通道",
      "同时结合阴阳、位置、十神和宫位"
    ],
    "weakeningConditions": [
      "只出现孤字而无根无作用",
      "被其他五行强烈制化或不参与当前问题"
    ],
    "imagery": {
      "core": [
        "木的生长、规划、连接、教育与向上发展表达受限；偏弱时计划难落地、持续性不足或缺乏成长空间"
      ],
      "positive": [
        "得用时可体现生长、规划、连接、教育与向上发展的正向功能"
      ],
      "negative": [
        "偏弱时计划难落地、持续性不足或缺乏成长空间"
      ],
      "realityChecks": [
        "现实中是否需要外部环境或岁运才补足生长、规划、连接、教育与向上发展"
      ]
    },
    "advice": [
      "现实建议围绕筋骨舒展、情绪条达与生活节律和结构所需的流通方式，不用颜色、饮食或饰品替代真实行动"
    ],
    "prohibitions": [
      "不能把弱等同于不存在",
      "不能以五行物象替代职业、医学或事件证据"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "251-277",
        "section": "木五行与职业像法",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_five_elements",
        "pdfPage": "5-13",
        "section": "五行基础与章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "elements",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "element_wood_object",
    "title": "木：职业与环境物象",
    "category": "element",
    "domains": [
      "self",
      "career",
      "wealth",
      "health",
      "movement",
      "fortune"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 67,
    "gender": "all",
    "queryKeywords": [
      "木",
      "职业与环境物象",
      "五行"
    ],
    "trigger": {
      "stemsAny": [
        "甲",
        "乙"
      ],
      "branchesAny": [
        "寅",
        "卯"
      ],
      "featuresAny": [
        "职业",
        "行业",
        "环境",
        "物象",
        "木"
      ]
    },
    "requires": [
      "职业对象必须与十神角色和做功方式共同验证",
      "同时结合阴阳、位置、十神和宫位"
    ],
    "weakeningConditions": [
      "只出现孤字而无根无作用",
      "被其他五行强烈制化或不参与当前问题"
    ],
    "imagery": {
      "core": [
        "木可提供教育、规划、设计、林业、文字、组织发展等木性对象的对象线索"
      ],
      "positive": [
        "得用时可体现生长、规划、连接、教育与向上发展的正向功能"
      ],
      "negative": [
        "过旺时容易扩张过快、枝节过多或目标分散"
      ],
      "realityChecks": [
        "核验实际岗位的工作对象、工作方式和收入来源是否同时吻合"
      ]
    },
    "advice": [
      "现实建议围绕筋骨舒展、情绪条达与生活节律和结构所需的流通方式，不用颜色、饮食或饰品替代真实行动"
    ],
    "prohibitions": [
      "不能仅凭某五行锁定唯一行业",
      "不能以五行物象替代职业、医学或事件证据"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "251-277",
        "section": "木五行与职业像法",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_five_elements",
        "pdfPage": "5-13",
        "section": "五行基础与章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "elements",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "element_fire_season_root",
    "title": "火：季节与根气",
    "category": "element",
    "domains": [
      "self",
      "career",
      "wealth",
      "health",
      "movement",
      "fortune"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 65,
    "gender": "all",
    "queryKeywords": [
      "火",
      "季节与根气",
      "五行"
    ],
    "trigger": {
      "stemsAny": [
        "丙",
        "丁"
      ],
      "branchesAny": [
        "巳",
        "午"
      ],
      "featuresAny": [
        "月令",
        "根气",
        "火"
      ]
    },
    "requires": [
      "先看是否得时、得地与有源",
      "同时结合阴阳、位置、十神和宫位"
    ],
    "weakeningConditions": [
      "只出现孤字而无根无作用",
      "被其他五行强烈制化或不参与当前问题"
    ],
    "imagery": {
      "core": [
        "火的状态要结合季节和根气；需要燃料、空间与适度控制，过寒时有调候价值"
      ],
      "positive": [
        "得用时可体现热度、表达、照明、传播、规则与炼化的正向功能"
      ],
      "negative": [
        "过旺时容易急躁、曝光过度、压力和消耗加快"
      ],
      "realityChecks": [
        "检查火是否得令、通根、透干并被关键结构调用"
      ]
    },
    "advice": [
      "现实建议围绕活力、温度、兴奋度与作息稳定和结构所需的流通方式，不用颜色、饮食或饰品替代真实行动"
    ],
    "prohibitions": [
      "不能只按五行个数判断旺弱",
      "不能以五行物象替代职业、医学或事件证据"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "251-277",
        "section": "火五行与职业像法",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_five_elements",
        "pdfPage": "5-13",
        "section": "五行基础与章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "elements",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "element_fire_flow_channel",
    "title": "火：流通与出口",
    "category": "element",
    "domains": [
      "self",
      "career",
      "wealth",
      "health",
      "movement",
      "fortune"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 65,
    "gender": "all",
    "queryKeywords": [
      "火",
      "流通与出口",
      "五行"
    ],
    "trigger": {
      "stemsAny": [
        "丙",
        "丁"
      ],
      "branchesAny": [
        "巳",
        "午"
      ],
      "featuresAny": [
        "流通",
        "通关",
        "出口",
        "火"
      ]
    },
    "requires": [
      "看是否能生、泄、制、化并进入现实成果",
      "同时结合阴阳、位置、十神和宫位"
    ],
    "weakeningConditions": [
      "只出现孤字而无根无作用",
      "被其他五行强烈制化或不参与当前问题"
    ],
    "imagery": {
      "core": [
        "火是否有价值取决于能否流通；需要燃料、空间与适度控制，过寒时有调候价值"
      ],
      "positive": [
        "得用时可体现热度、表达、照明、传播、规则与炼化的正向功能"
      ],
      "negative": [
        "过旺时容易急躁、曝光过度、压力和消耗加快"
      ],
      "realityChecks": [
        "检查火从哪里来、到哪里去、是否形成成果或制化"
      ]
    },
    "advice": [
      "现实建议围绕活力、温度、兴奋度与作息稳定和结构所需的流通方式，不用颜色、饮食或饰品替代真实行动"
    ],
    "prohibitions": [
      "不能把出现等同于有效做功",
      "不能以五行物象替代职业、医学或事件证据"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "251-277",
        "section": "火五行与职业像法",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_five_elements",
        "pdfPage": "5-13",
        "section": "五行基础与章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "elements",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "element_fire_excess",
    "title": "火：偏旺与成势",
    "category": "element",
    "domains": [
      "self",
      "career",
      "wealth",
      "health",
      "movement",
      "fortune"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 65,
    "gender": "all",
    "queryKeywords": [
      "火",
      "偏旺与成势",
      "五行"
    ],
    "trigger": {
      "stemsAny": [
        "丙",
        "丁"
      ],
      "branchesAny": [
        "巳",
        "午"
      ],
      "featuresAny": [
        "偏旺",
        "成势",
        "太旺",
        "火"
      ]
    },
    "requires": [
      "看旺势服务于什么结构，以及是否有制泄",
      "同时结合阴阳、位置、十神和宫位"
    ],
    "weakeningConditions": [
      "只出现孤字而无根无作用",
      "被其他五行强烈制化或不参与当前问题"
    ],
    "imagery": {
      "core": [
        "火的热度、表达、照明、传播、规则与炼化被放大；过旺时容易急躁、曝光过度、压力和消耗加快"
      ],
      "positive": [
        "得用时可体现热度、表达、照明、传播、规则与炼化的正向功能"
      ],
      "negative": [
        "过旺时容易急躁、曝光过度、压力和消耗加快"
      ],
      "realityChecks": [
        "现实中是否反复出现与热度、表达、照明、传播、规则与炼化相关的过度或高频表现"
      ]
    },
    "advice": [
      "现实建议围绕活力、温度、兴奋度与作息稳定和结构所需的流通方式，不用颜色、饮食或饰品替代真实行动"
    ],
    "prohibitions": [
      "不能直接判吉凶",
      "不能以五行物象替代职业、医学或事件证据"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "251-277",
        "section": "火五行与职业像法",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_five_elements",
        "pdfPage": "5-13",
        "section": "五行基础与章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "elements",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "element_fire_weak",
    "title": "火：偏弱与受制",
    "category": "element",
    "domains": [
      "self",
      "career",
      "wealth",
      "health",
      "movement",
      "fortune"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 65,
    "gender": "all",
    "queryKeywords": [
      "火",
      "偏弱与受制",
      "五行"
    ],
    "trigger": {
      "stemsAny": [
        "丙",
        "丁"
      ],
      "branchesAny": [
        "巳",
        "午"
      ],
      "featuresAny": [
        "偏弱",
        "受制",
        "无根",
        "火"
      ]
    },
    "requires": [
      "看是否有来源、救应、岁运补充与替代通道",
      "同时结合阴阳、位置、十神和宫位"
    ],
    "weakeningConditions": [
      "只出现孤字而无根无作用",
      "被其他五行强烈制化或不参与当前问题"
    ],
    "imagery": {
      "core": [
        "火的热度、表达、照明、传播、规则与炼化表达受限；偏弱时动力、可见度、行动热度或规则执行不足"
      ],
      "positive": [
        "得用时可体现热度、表达、照明、传播、规则与炼化的正向功能"
      ],
      "negative": [
        "偏弱时动力、可见度、行动热度或规则执行不足"
      ],
      "realityChecks": [
        "现实中是否需要外部环境或岁运才补足热度、表达、照明、传播、规则与炼化"
      ]
    },
    "advice": [
      "现实建议围绕活力、温度、兴奋度与作息稳定和结构所需的流通方式，不用颜色、饮食或饰品替代真实行动"
    ],
    "prohibitions": [
      "不能把弱等同于不存在",
      "不能以五行物象替代职业、医学或事件证据"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "251-277",
        "section": "火五行与职业像法",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_five_elements",
        "pdfPage": "5-13",
        "section": "五行基础与章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "elements",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "element_fire_object",
    "title": "火：职业与环境物象",
    "category": "element",
    "domains": [
      "self",
      "career",
      "wealth",
      "health",
      "movement",
      "fortune"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 67,
    "gender": "all",
    "queryKeywords": [
      "火",
      "职业与环境物象",
      "五行"
    ],
    "trigger": {
      "stemsAny": [
        "丙",
        "丁"
      ],
      "branchesAny": [
        "巳",
        "午"
      ],
      "featuresAny": [
        "职业",
        "行业",
        "环境",
        "物象",
        "火"
      ]
    },
    "requires": [
      "职业对象必须与十神角色和做功方式共同验证",
      "同时结合阴阳、位置、十神和宫位"
    ],
    "weakeningConditions": [
      "只出现孤字而无根无作用",
      "被其他五行强烈制化或不参与当前问题"
    ],
    "imagery": {
      "core": [
        "火可提供传播、教育、文化、能源、电子、管理、公共表达等火性对象的对象线索"
      ],
      "positive": [
        "得用时可体现热度、表达、照明、传播、规则与炼化的正向功能"
      ],
      "negative": [
        "过旺时容易急躁、曝光过度、压力和消耗加快"
      ],
      "realityChecks": [
        "核验实际岗位的工作对象、工作方式和收入来源是否同时吻合"
      ]
    },
    "advice": [
      "现实建议围绕活力、温度、兴奋度与作息稳定和结构所需的流通方式，不用颜色、饮食或饰品替代真实行动"
    ],
    "prohibitions": [
      "不能仅凭某五行锁定唯一行业",
      "不能以五行物象替代职业、医学或事件证据"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "251-277",
        "section": "火五行与职业像法",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_five_elements",
        "pdfPage": "5-13",
        "section": "五行基础与章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "elements",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "element_earth_season_root",
    "title": "土：季节与根气",
    "category": "element",
    "domains": [
      "self",
      "career",
      "wealth",
      "health",
      "movement",
      "fortune"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 65,
    "gender": "all",
    "queryKeywords": [
      "土",
      "季节与根气",
      "五行"
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
      ],
      "featuresAny": [
        "月令",
        "根气",
        "土"
      ]
    },
    "requires": [
      "先看是否得时、得地与有源",
      "同时结合阴阳、位置、十神和宫位"
    ],
    "weakeningConditions": [
      "只出现孤字而无根无作用",
      "被其他五行强烈制化或不参与当前问题"
    ],
    "imagery": {
      "core": [
        "土的状态要结合季节和根气；需分辨燥湿、厚薄、是否堵塞以及能否生养万物"
      ],
      "positive": [
        "得用时可体现承载、信用、平台、库藏、边界与转换的正向功能"
      ],
      "negative": [
        "过旺时容易固化、压滞、包袱过重或信息流通变慢"
      ],
      "realityChecks": [
        "检查土是否得令、通根、透干并被关键结构调用"
      ]
    },
    "advice": [
      "现实建议围绕承载感、饮食规律、稳定节奏与压力消化和结构所需的流通方式，不用颜色、饮食或饰品替代真实行动"
    ],
    "prohibitions": [
      "不能只按五行个数判断旺弱",
      "不能以五行物象替代职业、医学或事件证据"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "251-277",
        "section": "土五行与职业像法",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_five_elements",
        "pdfPage": "5-13",
        "section": "五行基础与章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "elements",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "element_earth_flow_channel",
    "title": "土：流通与出口",
    "category": "element",
    "domains": [
      "self",
      "career",
      "wealth",
      "health",
      "movement",
      "fortune"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 65,
    "gender": "all",
    "queryKeywords": [
      "土",
      "流通与出口",
      "五行"
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
      ],
      "featuresAny": [
        "流通",
        "通关",
        "出口",
        "土"
      ]
    },
    "requires": [
      "看是否能生、泄、制、化并进入现实成果",
      "同时结合阴阳、位置、十神和宫位"
    ],
    "weakeningConditions": [
      "只出现孤字而无根无作用",
      "被其他五行强烈制化或不参与当前问题"
    ],
    "imagery": {
      "core": [
        "土是否有价值取决于能否流通；需分辨燥湿、厚薄、是否堵塞以及能否生养万物"
      ],
      "positive": [
        "得用时可体现承载、信用、平台、库藏、边界与转换的正向功能"
      ],
      "negative": [
        "过旺时容易固化、压滞、包袱过重或信息流通变慢"
      ],
      "realityChecks": [
        "检查土从哪里来、到哪里去、是否形成成果或制化"
      ]
    },
    "advice": [
      "现实建议围绕承载感、饮食规律、稳定节奏与压力消化和结构所需的流通方式，不用颜色、饮食或饰品替代真实行动"
    ],
    "prohibitions": [
      "不能把出现等同于有效做功",
      "不能以五行物象替代职业、医学或事件证据"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "251-277",
        "section": "土五行与职业像法",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_five_elements",
        "pdfPage": "5-13",
        "section": "五行基础与章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "elements",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "element_earth_excess",
    "title": "土：偏旺与成势",
    "category": "element",
    "domains": [
      "self",
      "career",
      "wealth",
      "health",
      "movement",
      "fortune"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 65,
    "gender": "all",
    "queryKeywords": [
      "土",
      "偏旺与成势",
      "五行"
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
      ],
      "featuresAny": [
        "偏旺",
        "成势",
        "太旺",
        "土"
      ]
    },
    "requires": [
      "看旺势服务于什么结构，以及是否有制泄",
      "同时结合阴阳、位置、十神和宫位"
    ],
    "weakeningConditions": [
      "只出现孤字而无根无作用",
      "被其他五行强烈制化或不参与当前问题"
    ],
    "imagery": {
      "core": [
        "土的承载、信用、平台、库藏、边界与转换被放大；过旺时容易固化、压滞、包袱过重或信息流通变慢"
      ],
      "positive": [
        "得用时可体现承载、信用、平台、库藏、边界与转换的正向功能"
      ],
      "negative": [
        "过旺时容易固化、压滞、包袱过重或信息流通变慢"
      ],
      "realityChecks": [
        "现实中是否反复出现与承载、信用、平台、库藏、边界与转换相关的过度或高频表现"
      ]
    },
    "advice": [
      "现实建议围绕承载感、饮食规律、稳定节奏与压力消化和结构所需的流通方式，不用颜色、饮食或饰品替代真实行动"
    ],
    "prohibitions": [
      "不能直接判吉凶",
      "不能以五行物象替代职业、医学或事件证据"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "251-277",
        "section": "土五行与职业像法",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_five_elements",
        "pdfPage": "5-13",
        "section": "五行基础与章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "elements",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "element_earth_weak",
    "title": "土：偏弱与受制",
    "category": "element",
    "domains": [
      "self",
      "career",
      "wealth",
      "health",
      "movement",
      "fortune"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 65,
    "gender": "all",
    "queryKeywords": [
      "土",
      "偏弱与受制",
      "五行"
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
      ],
      "featuresAny": [
        "偏弱",
        "受制",
        "无根",
        "土"
      ]
    },
    "requires": [
      "看是否有来源、救应、岁运补充与替代通道",
      "同时结合阴阳、位置、十神和宫位"
    ],
    "weakeningConditions": [
      "只出现孤字而无根无作用",
      "被其他五行强烈制化或不参与当前问题"
    ],
    "imagery": {
      "core": [
        "土的承载、信用、平台、库藏、边界与转换表达受限；偏弱时承接能力、稳定性、资源存放和边界不足"
      ],
      "positive": [
        "得用时可体现承载、信用、平台、库藏、边界与转换的正向功能"
      ],
      "negative": [
        "偏弱时承接能力、稳定性、资源存放和边界不足"
      ],
      "realityChecks": [
        "现实中是否需要外部环境或岁运才补足承载、信用、平台、库藏、边界与转换"
      ]
    },
    "advice": [
      "现实建议围绕承载感、饮食规律、稳定节奏与压力消化和结构所需的流通方式，不用颜色、饮食或饰品替代真实行动"
    ],
    "prohibitions": [
      "不能把弱等同于不存在",
      "不能以五行物象替代职业、医学或事件证据"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "251-277",
        "section": "土五行与职业像法",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_five_elements",
        "pdfPage": "5-13",
        "section": "五行基础与章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "elements",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "element_earth_object",
    "title": "土：职业与环境物象",
    "category": "element",
    "domains": [
      "self",
      "career",
      "wealth",
      "health",
      "movement",
      "fortune"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 67,
    "gender": "all",
    "queryKeywords": [
      "土",
      "职业与环境物象",
      "五行"
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
      ],
      "featuresAny": [
        "职业",
        "行业",
        "环境",
        "物象",
        "土"
      ]
    },
    "requires": [
      "职业对象必须与十神角色和做功方式共同验证",
      "同时结合阴阳、位置、十神和宫位"
    ],
    "weakeningConditions": [
      "只出现孤字而无根无作用",
      "被其他五行强烈制化或不参与当前问题"
    ],
    "imagery": {
      "core": [
        "土可提供地产、工程、仓储、平台、行政、农业、供应链等土性对象的对象线索"
      ],
      "positive": [
        "得用时可体现承载、信用、平台、库藏、边界与转换的正向功能"
      ],
      "negative": [
        "过旺时容易固化、压滞、包袱过重或信息流通变慢"
      ],
      "realityChecks": [
        "核验实际岗位的工作对象、工作方式和收入来源是否同时吻合"
      ]
    },
    "advice": [
      "现实建议围绕承载感、饮食规律、稳定节奏与压力消化和结构所需的流通方式，不用颜色、饮食或饰品替代真实行动"
    ],
    "prohibitions": [
      "不能仅凭某五行锁定唯一行业",
      "不能以五行物象替代职业、医学或事件证据"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "251-277",
        "section": "土五行与职业像法",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_five_elements",
        "pdfPage": "5-13",
        "section": "五行基础与章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "elements",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "element_metal_season_root",
    "title": "金：季节与根气",
    "category": "element",
    "domains": [
      "self",
      "career",
      "wealth",
      "health",
      "movement",
      "fortune"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 65,
    "gender": "all",
    "queryKeywords": [
      "金",
      "季节与根气",
      "五行"
    ],
    "trigger": {
      "stemsAny": [
        "庚",
        "辛"
      ],
      "branchesAny": [
        "申",
        "酉"
      ],
      "featuresAny": [
        "月令",
        "根气",
        "金"
      ]
    },
    "requires": [
      "先看是否得时、得地与有源",
      "同时结合阴阳、位置、十神和宫位"
    ],
    "weakeningConditions": [
      "只出现孤字而无根无作用",
      "被其他五行强烈制化或不参与当前问题"
    ],
    "imagery": {
      "core": [
        "金的状态要结合季节和根气；需看是否成器、是否得火炼、得水润、得木显价值"
      ],
      "positive": [
        "得用时可体现规则、工具、判断、切割、精密与价值显现的正向功能"
      ],
      "negative": [
        "过旺时容易刚硬、批判、边界过强或人际距离加大"
      ],
      "realityChecks": [
        "检查金是否得令、通根、透干并被关键结构调用"
      ]
    },
    "advice": [
      "现实建议围绕边界、呼吸节律、皮肤防护与紧张度和结构所需的流通方式，不用颜色、饮食或饰品替代真实行动"
    ],
    "prohibitions": [
      "不能只按五行个数判断旺弱",
      "不能以五行物象替代职业、医学或事件证据"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "251-277",
        "section": "金五行与职业像法",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_five_elements",
        "pdfPage": "5-13",
        "section": "五行基础与章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "elements",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "element_metal_flow_channel",
    "title": "金：流通与出口",
    "category": "element",
    "domains": [
      "self",
      "career",
      "wealth",
      "health",
      "movement",
      "fortune"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 65,
    "gender": "all",
    "queryKeywords": [
      "金",
      "流通与出口",
      "五行"
    ],
    "trigger": {
      "stemsAny": [
        "庚",
        "辛"
      ],
      "branchesAny": [
        "申",
        "酉"
      ],
      "featuresAny": [
        "流通",
        "通关",
        "出口",
        "金"
      ]
    },
    "requires": [
      "看是否能生、泄、制、化并进入现实成果",
      "同时结合阴阳、位置、十神和宫位"
    ],
    "weakeningConditions": [
      "只出现孤字而无根无作用",
      "被其他五行强烈制化或不参与当前问题"
    ],
    "imagery": {
      "core": [
        "金是否有价值取决于能否流通；需看是否成器、是否得火炼、得水润、得木显价值"
      ],
      "positive": [
        "得用时可体现规则、工具、判断、切割、精密与价值显现的正向功能"
      ],
      "negative": [
        "过旺时容易刚硬、批判、边界过强或人际距离加大"
      ],
      "realityChecks": [
        "检查金从哪里来、到哪里去、是否形成成果或制化"
      ]
    },
    "advice": [
      "现实建议围绕边界、呼吸节律、皮肤防护与紧张度和结构所需的流通方式，不用颜色、饮食或饰品替代真实行动"
    ],
    "prohibitions": [
      "不能把出现等同于有效做功",
      "不能以五行物象替代职业、医学或事件证据"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "251-277",
        "section": "金五行与职业像法",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_five_elements",
        "pdfPage": "5-13",
        "section": "五行基础与章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "elements",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "element_metal_excess",
    "title": "金：偏旺与成势",
    "category": "element",
    "domains": [
      "self",
      "career",
      "wealth",
      "health",
      "movement",
      "fortune"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 65,
    "gender": "all",
    "queryKeywords": [
      "金",
      "偏旺与成势",
      "五行"
    ],
    "trigger": {
      "stemsAny": [
        "庚",
        "辛"
      ],
      "branchesAny": [
        "申",
        "酉"
      ],
      "featuresAny": [
        "偏旺",
        "成势",
        "太旺",
        "金"
      ]
    },
    "requires": [
      "看旺势服务于什么结构，以及是否有制泄",
      "同时结合阴阳、位置、十神和宫位"
    ],
    "weakeningConditions": [
      "只出现孤字而无根无作用",
      "被其他五行强烈制化或不参与当前问题"
    ],
    "imagery": {
      "core": [
        "金的规则、工具、判断、切割、精密与价值显现被放大；过旺时容易刚硬、批判、边界过强或人际距离加大"
      ],
      "positive": [
        "得用时可体现规则、工具、判断、切割、精密与价值显现的正向功能"
      ],
      "negative": [
        "过旺时容易刚硬、批判、边界过强或人际距离加大"
      ],
      "realityChecks": [
        "现实中是否反复出现与规则、工具、判断、切割、精密与价值显现相关的过度或高频表现"
      ]
    },
    "advice": [
      "现实建议围绕边界、呼吸节律、皮肤防护与紧张度和结构所需的流通方式，不用颜色、饮食或饰品替代真实行动"
    ],
    "prohibitions": [
      "不能直接判吉凶",
      "不能以五行物象替代职业、医学或事件证据"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "251-277",
        "section": "金五行与职业像法",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_five_elements",
        "pdfPage": "5-13",
        "section": "五行基础与章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "elements",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "element_metal_weak",
    "title": "金：偏弱与受制",
    "category": "element",
    "domains": [
      "self",
      "career",
      "wealth",
      "health",
      "movement",
      "fortune"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 65,
    "gender": "all",
    "queryKeywords": [
      "金",
      "偏弱与受制",
      "五行"
    ],
    "trigger": {
      "stemsAny": [
        "庚",
        "辛"
      ],
      "branchesAny": [
        "申",
        "酉"
      ],
      "featuresAny": [
        "偏弱",
        "受制",
        "无根",
        "金"
      ]
    },
    "requires": [
      "看是否有来源、救应、岁运补充与替代通道",
      "同时结合阴阳、位置、十神和宫位"
    ],
    "weakeningConditions": [
      "只出现孤字而无根无作用",
      "被其他五行强烈制化或不参与当前问题"
    ],
    "imagery": {
      "core": [
        "金的规则、工具、判断、切割、精密与价值显现表达受限；偏弱时执行标准、决断、工具能力或自我边界不足"
      ],
      "positive": [
        "得用时可体现规则、工具、判断、切割、精密与价值显现的正向功能"
      ],
      "negative": [
        "偏弱时执行标准、决断、工具能力或自我边界不足"
      ],
      "realityChecks": [
        "现实中是否需要外部环境或岁运才补足规则、工具、判断、切割、精密与价值显现"
      ]
    },
    "advice": [
      "现实建议围绕边界、呼吸节律、皮肤防护与紧张度和结构所需的流通方式，不用颜色、饮食或饰品替代真实行动"
    ],
    "prohibitions": [
      "不能把弱等同于不存在",
      "不能以五行物象替代职业、医学或事件证据"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "251-277",
        "section": "金五行与职业像法",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_five_elements",
        "pdfPage": "5-13",
        "section": "五行基础与章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "elements",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "element_metal_object",
    "title": "金：职业与环境物象",
    "category": "element",
    "domains": [
      "self",
      "career",
      "wealth",
      "health",
      "movement",
      "fortune"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 67,
    "gender": "all",
    "queryKeywords": [
      "金",
      "职业与环境物象",
      "五行"
    ],
    "trigger": {
      "stemsAny": [
        "庚",
        "辛"
      ],
      "branchesAny": [
        "申",
        "酉"
      ],
      "featuresAny": [
        "职业",
        "行业",
        "环境",
        "物象",
        "金"
      ]
    },
    "requires": [
      "职业对象必须与十神角色和做功方式共同验证",
      "同时结合阴阳、位置、十神和宫位"
    ],
    "weakeningConditions": [
      "只出现孤字而无根无作用",
      "被其他五行强烈制化或不参与当前问题"
    ],
    "imagery": {
      "core": [
        "金可提供技术、制造、金融工具、法律规则、审计、精密器械等金性对象的对象线索"
      ],
      "positive": [
        "得用时可体现规则、工具、判断、切割、精密与价值显现的正向功能"
      ],
      "negative": [
        "过旺时容易刚硬、批判、边界过强或人际距离加大"
      ],
      "realityChecks": [
        "核验实际岗位的工作对象、工作方式和收入来源是否同时吻合"
      ]
    },
    "advice": [
      "现实建议围绕边界、呼吸节律、皮肤防护与紧张度和结构所需的流通方式，不用颜色、饮食或饰品替代真实行动"
    ],
    "prohibitions": [
      "不能仅凭某五行锁定唯一行业",
      "不能以五行物象替代职业、医学或事件证据"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "251-277",
        "section": "金五行与职业像法",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_five_elements",
        "pdfPage": "5-13",
        "section": "五行基础与章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "elements",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "element_water_season_root",
    "title": "水：季节与根气",
    "category": "element",
    "domains": [
      "self",
      "career",
      "wealth",
      "health",
      "movement",
      "fortune"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 65,
    "gender": "all",
    "queryKeywords": [
      "水",
      "季节与根气",
      "五行"
    ],
    "trigger": {
      "stemsAny": [
        "壬",
        "癸"
      ],
      "branchesAny": [
        "亥",
        "子"
      ],
      "featuresAny": [
        "月令",
        "根气",
        "水"
      ]
    },
    "requires": [
      "先看是否得时、得地与有源",
      "同时结合阴阳、位置、十神和宫位"
    ],
    "weakeningConditions": [
      "只出现孤字而无根无作用",
      "被其他五行强烈制化或不参与当前问题"
    ],
    "imagery": {
      "core": [
        "水的状态要结合季节和根气；需有源头、河道、堤岸和去处，过寒或泛滥都需调节"
      ],
      "positive": [
        "得用时可体现流动、信息、智慧、连接、变化与出口的正向功能"
      ],
      "negative": [
        "过旺时容易漂移、情绪波动、选择过多或执行松散"
      ],
      "realityChecks": [
        "检查水是否得令、通根、透干并被关键结构调用"
      ]
    },
    "advice": [
      "现实建议围绕休息恢复、情绪流动、补水与节律和结构所需的流通方式，不用颜色、饮食或饰品替代真实行动"
    ],
    "prohibitions": [
      "不能只按五行个数判断旺弱",
      "不能以五行物象替代职业、医学或事件证据"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "251-277",
        "section": "水五行与职业像法",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_five_elements",
        "pdfPage": "5-13",
        "section": "五行基础与章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "elements",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "element_water_flow_channel",
    "title": "水：流通与出口",
    "category": "element",
    "domains": [
      "self",
      "career",
      "wealth",
      "health",
      "movement",
      "fortune"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 65,
    "gender": "all",
    "queryKeywords": [
      "水",
      "流通与出口",
      "五行"
    ],
    "trigger": {
      "stemsAny": [
        "壬",
        "癸"
      ],
      "branchesAny": [
        "亥",
        "子"
      ],
      "featuresAny": [
        "流通",
        "通关",
        "出口",
        "水"
      ]
    },
    "requires": [
      "看是否能生、泄、制、化并进入现实成果",
      "同时结合阴阳、位置、十神和宫位"
    ],
    "weakeningConditions": [
      "只出现孤字而无根无作用",
      "被其他五行强烈制化或不参与当前问题"
    ],
    "imagery": {
      "core": [
        "水是否有价值取决于能否流通；需有源头、河道、堤岸和去处，过寒或泛滥都需调节"
      ],
      "positive": [
        "得用时可体现流动、信息、智慧、连接、变化与出口的正向功能"
      ],
      "negative": [
        "过旺时容易漂移、情绪波动、选择过多或执行松散"
      ],
      "realityChecks": [
        "检查水从哪里来、到哪里去、是否形成成果或制化"
      ]
    },
    "advice": [
      "现实建议围绕休息恢复、情绪流动、补水与节律和结构所需的流通方式，不用颜色、饮食或饰品替代真实行动"
    ],
    "prohibitions": [
      "不能把出现等同于有效做功",
      "不能以五行物象替代职业、医学或事件证据"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "251-277",
        "section": "水五行与职业像法",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_five_elements",
        "pdfPage": "5-13",
        "section": "五行基础与章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "elements",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "element_water_excess",
    "title": "水：偏旺与成势",
    "category": "element",
    "domains": [
      "self",
      "career",
      "wealth",
      "health",
      "movement",
      "fortune"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 65,
    "gender": "all",
    "queryKeywords": [
      "水",
      "偏旺与成势",
      "五行"
    ],
    "trigger": {
      "stemsAny": [
        "壬",
        "癸"
      ],
      "branchesAny": [
        "亥",
        "子"
      ],
      "featuresAny": [
        "偏旺",
        "成势",
        "太旺",
        "水"
      ]
    },
    "requires": [
      "看旺势服务于什么结构，以及是否有制泄",
      "同时结合阴阳、位置、十神和宫位"
    ],
    "weakeningConditions": [
      "只出现孤字而无根无作用",
      "被其他五行强烈制化或不参与当前问题"
    ],
    "imagery": {
      "core": [
        "水的流动、信息、智慧、连接、变化与出口被放大；过旺时容易漂移、情绪波动、选择过多或执行松散"
      ],
      "positive": [
        "得用时可体现流动、信息、智慧、连接、变化与出口的正向功能"
      ],
      "negative": [
        "过旺时容易漂移、情绪波动、选择过多或执行松散"
      ],
      "realityChecks": [
        "现实中是否反复出现与流动、信息、智慧、连接、变化与出口相关的过度或高频表现"
      ]
    },
    "advice": [
      "现实建议围绕休息恢复、情绪流动、补水与节律和结构所需的流通方式，不用颜色、饮食或饰品替代真实行动"
    ],
    "prohibitions": [
      "不能直接判吉凶",
      "不能以五行物象替代职业、医学或事件证据"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "251-277",
        "section": "水五行与职业像法",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_five_elements",
        "pdfPage": "5-13",
        "section": "五行基础与章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "elements",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "element_water_weak",
    "title": "水：偏弱与受制",
    "category": "element",
    "domains": [
      "self",
      "career",
      "wealth",
      "health",
      "movement",
      "fortune"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 65,
    "gender": "all",
    "queryKeywords": [
      "水",
      "偏弱与受制",
      "五行"
    ],
    "trigger": {
      "stemsAny": [
        "壬",
        "癸"
      ],
      "branchesAny": [
        "亥",
        "子"
      ],
      "featuresAny": [
        "偏弱",
        "受制",
        "无根",
        "水"
      ]
    },
    "requires": [
      "看是否有来源、救应、岁运补充与替代通道",
      "同时结合阴阳、位置、十神和宫位"
    ],
    "weakeningConditions": [
      "只出现孤字而无根无作用",
      "被其他五行强烈制化或不参与当前问题"
    ],
    "imagery": {
      "core": [
        "水的流动、信息、智慧、连接、变化与出口表达受限；偏弱时信息流通、表达出口、适应性和恢复力不足"
      ],
      "positive": [
        "得用时可体现流动、信息、智慧、连接、变化与出口的正向功能"
      ],
      "negative": [
        "偏弱时信息流通、表达出口、适应性和恢复力不足"
      ],
      "realityChecks": [
        "现实中是否需要外部环境或岁运才补足流动、信息、智慧、连接、变化与出口"
      ]
    },
    "advice": [
      "现实建议围绕休息恢复、情绪流动、补水与节律和结构所需的流通方式，不用颜色、饮食或饰品替代真实行动"
    ],
    "prohibitions": [
      "不能把弱等同于不存在",
      "不能以五行物象替代职业、医学或事件证据"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "251-277",
        "section": "水五行与职业像法",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_five_elements",
        "pdfPage": "5-13",
        "section": "五行基础与章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "elements",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "element_water_object",
    "title": "水：职业与环境物象",
    "category": "element",
    "domains": [
      "self",
      "career",
      "wealth",
      "health",
      "movement",
      "fortune"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 67,
    "gender": "all",
    "queryKeywords": [
      "水",
      "职业与环境物象",
      "五行"
    ],
    "trigger": {
      "stemsAny": [
        "壬",
        "癸"
      ],
      "branchesAny": [
        "亥",
        "子"
      ],
      "featuresAny": [
        "职业",
        "行业",
        "环境",
        "物象",
        "水"
      ]
    },
    "requires": [
      "职业对象必须与十神角色和做功方式共同验证",
      "同时结合阴阳、位置、十神和宫位"
    ],
    "weakeningConditions": [
      "只出现孤字而无根无作用",
      "被其他五行强烈制化或不参与当前问题"
    ],
    "imagery": {
      "core": [
        "水可提供数据、物流、咨询、贸易、传媒、交通、服务等水性对象的对象线索"
      ],
      "positive": [
        "得用时可体现流动、信息、智慧、连接、变化与出口的正向功能"
      ],
      "negative": [
        "过旺时容易漂移、情绪波动、选择过多或执行松散"
      ],
      "realityChecks": [
        "核验实际岗位的工作对象、工作方式和收入来源是否同时吻合"
      ]
    },
    "advice": [
      "现实建议围绕休息恢复、情绪流动、补水与节律和结构所需的流通方式，不用颜色、饮食或饰品替代真实行动"
    ],
    "prohibitions": [
      "不能仅凭某五行锁定唯一行业",
      "不能以五行物象替代职业、医学或事件证据"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "251-277",
        "section": "水五行与职业像法",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_five_elements",
        "pdfPage": "5-13",
        "section": "五行基础与章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "elements",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "stem_jia_imagery",
    "title": "甲阳木：基础物象与行为方式",
    "category": "stem_branch",
    "domains": [
      "self",
      "career",
      "wealth",
      "movement",
      "fortune"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 63,
    "gender": "all",
    "queryKeywords": [
      "甲",
      "阳木",
      "天干"
    ],
    "trigger": {
      "stemsAny": [
        "甲"
      ]
    },
    "requires": [
      "确认甲所在宫位、十神、根气与是否被当前岁运调用",
      "物象只能作为表达方式和现实对象候选"
    ],
    "weakeningConditions": [
      "甲无根、受制或只在远层出现",
      "同柱与全局组合明显改变其表现"
    ],
    "imagery": {
      "core": [
        "甲可取大树、栋梁、规划、直立与向上之象"
      ],
      "positive": [
        "重视方向、原则与长期成长"
      ],
      "negative": [
        "过强时容易僵直或扩张"
      ],
      "realityChecks": [
        "现实中是否在大树、栋梁、规划、直立与向上相关的行为或工作对象上反复出现"
      ]
    },
    "advice": [
      "把天干物象与十神、宫位和做功方式交叉验证"
    ],
    "prohibitions": [
      "不能仅凭甲锁定性格、职业、相貌或具体事件"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "251-264",
        "section": "甲天干与五行像法",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_five_elements",
        "pdfPage": "6-8",
        "section": "十天干章节目录与样页",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "stems-branches",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "stem_yi_imagery",
    "title": "乙阴木：基础物象与行为方式",
    "category": "stem_branch",
    "domains": [
      "self",
      "career",
      "wealth",
      "movement",
      "fortune"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 63,
    "gender": "all",
    "queryKeywords": [
      "乙",
      "阴木",
      "天干"
    ],
    "trigger": {
      "stemsAny": [
        "乙"
      ]
    },
    "requires": [
      "确认乙所在宫位、十神、根气与是否被当前岁运调用",
      "物象只能作为表达方式和现实对象候选"
    ],
    "weakeningConditions": [
      "乙无根、受制或只在远层出现",
      "同柱与全局组合明显改变其表现"
    ],
    "imagery": {
      "core": [
        "乙可取花草、藤蔓、协调、细节与柔性连接之象"
      ],
      "positive": [
        "善于适应、沟通与细部经营"
      ],
      "negative": [
        "过强时容易缠绕或犹豫"
      ],
      "realityChecks": [
        "现实中是否在花草、藤蔓、协调、细节与柔性连接相关的行为或工作对象上反复出现"
      ]
    },
    "advice": [
      "把天干物象与十神、宫位和做功方式交叉验证"
    ],
    "prohibitions": [
      "不能仅凭乙锁定性格、职业、相貌或具体事件"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "251-264",
        "section": "乙天干与五行像法",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_five_elements",
        "pdfPage": "6-8",
        "section": "十天干章节目录与样页",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "stems-branches",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "stem_bing_imagery",
    "title": "丙阳火：基础物象与行为方式",
    "category": "stem_branch",
    "domains": [
      "self",
      "career",
      "wealth",
      "movement",
      "fortune"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 63,
    "gender": "all",
    "queryKeywords": [
      "丙",
      "阳火",
      "天干"
    ],
    "trigger": {
      "stemsAny": [
        "丙"
      ]
    },
    "requires": [
      "确认丙所在宫位、十神、根气与是否被当前岁运调用",
      "物象只能作为表达方式和现实对象候选"
    ],
    "weakeningConditions": [
      "丙无根、受制或只在远层出现",
      "同柱与全局组合明显改变其表现"
    ],
    "imagery": {
      "core": [
        "丙可取太阳、公开、传播、热度与可见度之象"
      ],
      "positive": [
        "愿意表达、照亮和承担公开角色"
      ],
      "negative": [
        "过强时容易急躁或曝光过度"
      ],
      "realityChecks": [
        "现实中是否在太阳、公开、传播、热度与可见度相关的行为或工作对象上反复出现"
      ]
    },
    "advice": [
      "把天干物象与十神、宫位和做功方式交叉验证"
    ],
    "prohibitions": [
      "不能仅凭丙锁定性格、职业、相貌或具体事件"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "251-264",
        "section": "丙天干与五行像法",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_five_elements",
        "pdfPage": "6-8",
        "section": "十天干章节目录与样页",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "stems-branches",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "stem_ding_imagery",
    "title": "丁阴火：基础物象与行为方式",
    "category": "stem_branch",
    "domains": [
      "self",
      "career",
      "wealth",
      "movement",
      "fortune"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 63,
    "gender": "all",
    "queryKeywords": [
      "丁",
      "阴火",
      "天干"
    ],
    "trigger": {
      "stemsAny": [
        "丁"
      ]
    },
    "requires": [
      "确认丁所在宫位、十神、根气与是否被当前岁运调用",
      "物象只能作为表达方式和现实对象候选"
    ],
    "weakeningConditions": [
      "丁无根、受制或只在远层出现",
      "同柱与全局组合明显改变其表现"
    ],
    "imagery": {
      "core": [
        "丁可取灯火、专注、文化、精细表达与持续热度之象"
      ],
      "positive": [
        "擅长细致传播、审美与点状影响"
      ],
      "negative": [
        "过强时容易敏感或耗神"
      ],
      "realityChecks": [
        "现实中是否在灯火、专注、文化、精细表达与持续热度相关的行为或工作对象上反复出现"
      ]
    },
    "advice": [
      "把天干物象与十神、宫位和做功方式交叉验证"
    ],
    "prohibitions": [
      "不能仅凭丁锁定性格、职业、相貌或具体事件"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "251-264",
        "section": "丁天干与五行像法",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_five_elements",
        "pdfPage": "6-8",
        "section": "十天干章节目录与样页",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "stems-branches",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "stem_wu_imagery",
    "title": "戊阳土：基础物象与行为方式",
    "category": "stem_branch",
    "domains": [
      "self",
      "career",
      "wealth",
      "movement",
      "fortune"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 63,
    "gender": "all",
    "queryKeywords": [
      "戊",
      "阳土",
      "天干"
    ],
    "trigger": {
      "stemsAny": [
        "戊"
      ]
    },
    "requires": [
      "确认戊所在宫位、十神、根气与是否被当前岁运调用",
      "物象只能作为表达方式和现实对象候选"
    ],
    "weakeningConditions": [
      "戊无根、受制或只在远层出现",
      "同柱与全局组合明显改变其表现"
    ],
    "imagery": {
      "core": [
        "戊可取高地、平台、承载、信用与稳定边界之象"
      ],
      "positive": [
        "重视稳固、责任与大框架"
      ],
      "negative": [
        "过强时容易厚重堵塞"
      ],
      "realityChecks": [
        "现实中是否在高地、平台、承载、信用与稳定边界相关的行为或工作对象上反复出现"
      ]
    },
    "advice": [
      "把天干物象与十神、宫位和做功方式交叉验证"
    ],
    "prohibitions": [
      "不能仅凭戊锁定性格、职业、相貌或具体事件"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "251-264",
        "section": "戊天干与五行像法",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_five_elements",
        "pdfPage": "6-8",
        "section": "十天干章节目录与样页",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "stems-branches",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "stem_ji_imagery",
    "title": "己阴土：基础物象与行为方式",
    "category": "stem_branch",
    "domains": [
      "self",
      "career",
      "wealth",
      "movement",
      "fortune"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 63,
    "gender": "all",
    "queryKeywords": [
      "己",
      "阴土",
      "天干"
    ],
    "trigger": {
      "stemsAny": [
        "己"
      ]
    },
    "requires": [
      "确认己所在宫位、十神、根气与是否被当前岁运调用",
      "物象只能作为表达方式和现实对象候选"
    ],
    "weakeningConditions": [
      "己无根、受制或只在远层出现",
      "同柱与全局组合明显改变其表现"
    ],
    "imagery": {
      "core": [
        "己可取田园、培育、管理、细致承接与转化之象"
      ],
      "positive": [
        "善于照料、协调、整合和落实"
      ],
      "negative": [
        "过强时容易琐碎或包揽"
      ],
      "realityChecks": [
        "现实中是否在田园、培育、管理、细致承接与转化相关的行为或工作对象上反复出现"
      ]
    },
    "advice": [
      "把天干物象与十神、宫位和做功方式交叉验证"
    ],
    "prohibitions": [
      "不能仅凭己锁定性格、职业、相貌或具体事件"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "251-264",
        "section": "己天干与五行像法",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_five_elements",
        "pdfPage": "6-8",
        "section": "十天干章节目录与样页",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "stems-branches",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "stem_geng_imagery",
    "title": "庚阳金：基础物象与行为方式",
    "category": "stem_branch",
    "domains": [
      "self",
      "career",
      "wealth",
      "movement",
      "fortune"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 63,
    "gender": "all",
    "queryKeywords": [
      "庚",
      "阳金",
      "天干"
    ],
    "trigger": {
      "stemsAny": [
        "庚"
      ]
    },
    "requires": [
      "确认庚所在宫位、十神、根气与是否被当前岁运调用",
      "物象只能作为表达方式和现实对象候选"
    ],
    "weakeningConditions": [
      "庚无根、受制或只在远层出现",
      "同柱与全局组合明显改变其表现"
    ],
    "imagery": {
      "core": [
        "庚可取刀斧、机器、执行、改革与直接切割之象"
      ],
      "positive": [
        "行动果断、重效率和工具"
      ],
      "negative": [
        "过强时容易强硬或冲突"
      ],
      "realityChecks": [
        "现实中是否在刀斧、机器、执行、改革与直接切割相关的行为或工作对象上反复出现"
      ]
    },
    "advice": [
      "把天干物象与十神、宫位和做功方式交叉验证"
    ],
    "prohibitions": [
      "不能仅凭庚锁定性格、职业、相貌或具体事件"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "251-264",
        "section": "庚天干与五行像法",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_five_elements",
        "pdfPage": "6-8",
        "section": "十天干章节目录与样页",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "stems-branches",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "stem_xin_imagery",
    "title": "辛阴金：基础物象与行为方式",
    "category": "stem_branch",
    "domains": [
      "self",
      "career",
      "wealth",
      "movement",
      "fortune"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 63,
    "gender": "all",
    "queryKeywords": [
      "辛",
      "阴金",
      "天干"
    ],
    "trigger": {
      "stemsAny": [
        "辛"
      ]
    },
    "requires": [
      "确认辛所在宫位、十神、根气与是否被当前岁运调用",
      "物象只能作为表达方式和现实对象候选"
    ],
    "weakeningConditions": [
      "辛无根、受制或只在远层出现",
      "同柱与全局组合明显改变其表现"
    ],
    "imagery": {
      "core": [
        "辛可取珠玉、精密、标准、审美与价值筛选之象"
      ],
      "positive": [
        "细致、讲究品质和边界"
      ],
      "negative": [
        "过强时容易挑剔或自我约束"
      ],
      "realityChecks": [
        "现实中是否在珠玉、精密、标准、审美与价值筛选相关的行为或工作对象上反复出现"
      ]
    },
    "advice": [
      "把天干物象与十神、宫位和做功方式交叉验证"
    ],
    "prohibitions": [
      "不能仅凭辛锁定性格、职业、相貌或具体事件"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "251-264",
        "section": "辛天干与五行像法",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_five_elements",
        "pdfPage": "6-8",
        "section": "十天干章节目录与样页",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "stems-branches",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "stem_ren_imagery",
    "title": "壬阳水：基础物象与行为方式",
    "category": "stem_branch",
    "domains": [
      "self",
      "career",
      "wealth",
      "movement",
      "fortune"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 63,
    "gender": "all",
    "queryKeywords": [
      "壬",
      "阳水",
      "天干"
    ],
    "trigger": {
      "stemsAny": [
        "壬"
      ]
    },
    "requires": [
      "确认壬所在宫位、十神、根气与是否被当前岁运调用",
      "物象只能作为表达方式和现实对象候选"
    ],
    "weakeningConditions": [
      "壬无根、受制或只在远层出现",
      "同柱与全局组合明显改变其表现"
    ],
    "imagery": {
      "core": [
        "壬可取江河、流动、资源网络、远行与大信息之象"
      ],
      "positive": [
        "适应力、连接力和宏观流动强"
      ],
      "negative": [
        "过强时容易漂移或泛化"
      ],
      "realityChecks": [
        "现实中是否在江河、流动、资源网络、远行与大信息相关的行为或工作对象上反复出现"
      ]
    },
    "advice": [
      "把天干物象与十神、宫位和做功方式交叉验证"
    ],
    "prohibitions": [
      "不能仅凭壬锁定性格、职业、相貌或具体事件"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "251-264",
        "section": "壬天干与五行像法",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_five_elements",
        "pdfPage": "6-8",
        "section": "十天干章节目录与样页",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "stems-branches",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "stem_gui_imagery",
    "title": "癸阴水：基础物象与行为方式",
    "category": "stem_branch",
    "domains": [
      "self",
      "career",
      "wealth",
      "movement",
      "fortune"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 63,
    "gender": "all",
    "queryKeywords": [
      "癸",
      "阴水",
      "天干"
    ],
    "trigger": {
      "stemsAny": [
        "癸"
      ]
    },
    "requires": [
      "确认癸所在宫位、十神、根气与是否被当前岁运调用",
      "物象只能作为表达方式和现实对象候选"
    ],
    "weakeningConditions": [
      "癸无根、受制或只在远层出现",
      "同柱与全局组合明显改变其表现"
    ],
    "imagery": {
      "core": [
        "癸可取雨露、数据、细节信息、渗透与润泽之象"
      ],
      "positive": [
        "观察细腻、善于积累和隐性连接"
      ],
      "negative": [
        "过强时容易多虑或渗散"
      ],
      "realityChecks": [
        "现实中是否在雨露、数据、细节信息、渗透与润泽相关的行为或工作对象上反复出现"
      ]
    },
    "advice": [
      "把天干物象与十神、宫位和做功方式交叉验证"
    ],
    "prohibitions": [
      "不能仅凭癸锁定性格、职业、相貌或具体事件"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "251-264",
        "section": "癸天干与五行像法",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_five_elements",
        "pdfPage": "6-8",
        "section": "十天干章节目录与样页",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "stems-branches",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "branch_zi_imagery",
    "title": "子阳水：基础物象与现实场域",
    "category": "stem_branch",
    "domains": [
      "self",
      "career",
      "wealth",
      "movement",
      "property",
      "fortune"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 64,
    "gender": "all",
    "queryKeywords": [
      "子",
      "阳水",
      "地支"
    ],
    "trigger": {
      "branchesAny": [
        "子"
      ]
    },
    "requires": [
      "确认子所在宫位、藏干、是否为根或库，以及与其他地支的作用",
      "地支物象必须服从十神归属与当前问题领域"
    ],
    "weakeningConditions": [
      "子被强冲、穿、合绊或不参与做功",
      "只凭单个地支无法确定现实行业或地点"
    ],
    "imagery": {
      "core": [
        "子可取流动、夜间、信息、隐秘、交通与细小持续变化之象"
      ],
      "positive": [
        "灵活、敏感、重信息"
      ],
      "negative": [
        "过旺时波动、分散或休息不足"
      ],
      "realityChecks": [
        "现实中是否出现与流动、夜间、信息、隐秘、交通与细小持续变化相关的环境、资源或行为方式"
      ]
    },
    "advice": [
      "地支物象用来扩展候选场景，最终以宫位、十神和现实验证为准"
    ],
    "prohibitions": [
      "不能仅凭子直接断灾祸、疾病、职业或地点"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "265-270",
        "section": "子地支像法",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_five_elements",
        "pdfPage": "9-13",
        "section": "十二地支章节目录与样页",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "stems-branches",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "branch_chou_imagery",
    "title": "丑湿寒土、金库：基础物象与现实场域",
    "category": "stem_branch",
    "domains": [
      "self",
      "career",
      "wealth",
      "movement",
      "property",
      "fortune"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 64,
    "gender": "all",
    "queryKeywords": [
      "丑",
      "湿寒土、金库",
      "地支"
    ],
    "trigger": {
      "branchesAny": [
        "丑"
      ]
    },
    "requires": [
      "确认丑所在宫位、藏干、是否为根或库，以及与其他地支的作用",
      "地支物象必须服从十神归属与当前问题领域"
    ],
    "weakeningConditions": [
      "丑被强冲、穿、合绊或不参与做功",
      "只凭单个地支无法确定现实行业或地点"
    ],
    "imagery": {
      "core": [
        "丑可取收纳、仓储、金融、地下、组织与慢性积累之象"
      ],
      "positive": [
        "耐久、能储存和承接"
      ],
      "negative": [
        "过重时闭塞、拖延或难释放"
      ],
      "realityChecks": [
        "现实中是否出现与收纳、仓储、金融、地下、组织与慢性积累相关的环境、资源或行为方式"
      ]
    },
    "advice": [
      "地支物象用来扩展候选场景，最终以宫位、十神和现实验证为准"
    ],
    "prohibitions": [
      "不能仅凭丑直接断灾祸、疾病、职业或地点"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "265-270",
        "section": "丑地支像法",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_five_elements",
        "pdfPage": "9-13",
        "section": "十二地支章节目录与样页",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "stems-branches",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "branch_yin_imagery",
    "title": "寅阳木、火土之源：基础物象与现实场域",
    "category": "stem_branch",
    "domains": [
      "self",
      "career",
      "wealth",
      "movement",
      "property",
      "fortune"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 64,
    "gender": "all",
    "queryKeywords": [
      "寅",
      "阳木、火土之源",
      "地支"
    ],
    "trigger": {
      "branchesAny": [
        "寅"
      ]
    },
    "requires": [
      "确认寅所在宫位、藏干、是否为根或库，以及与其他地支的作用",
      "地支物象必须服从十神归属与当前问题领域"
    ],
    "weakeningConditions": [
      "寅被强冲、穿、合绊或不参与做功",
      "只凭单个地支无法确定现实行业或地点"
    ],
    "imagery": {
      "core": [
        "寅可取启动、远行、规划、组织、教育与向外开拓之象"
      ],
      "positive": [
        "主动、有方向、敢开局"
      ],
      "negative": [
        "过旺时急于扩张或多线推进"
      ],
      "realityChecks": [
        "现实中是否出现与启动、远行、规划、组织、教育与向外开拓相关的环境、资源或行为方式"
      ]
    },
    "advice": [
      "地支物象用来扩展候选场景，最终以宫位、十神和现实验证为准"
    ],
    "prohibitions": [
      "不能仅凭寅直接断灾祸、疾病、职业或地点"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "265-270",
        "section": "寅地支像法",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_five_elements",
        "pdfPage": "9-13",
        "section": "十二地支章节目录与样页",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "stems-branches",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "branch_mao_imagery",
    "title": "卯阴木：基础物象与现实场域",
    "category": "stem_branch",
    "domains": [
      "self",
      "career",
      "wealth",
      "movement",
      "property",
      "fortune"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 64,
    "gender": "all",
    "queryKeywords": [
      "卯",
      "阴木",
      "地支"
    ],
    "trigger": {
      "branchesAny": [
        "卯"
      ]
    },
    "requires": [
      "确认卯所在宫位、藏干、是否为根或库，以及与其他地支的作用",
      "地支物象必须服从十神归属与当前问题领域"
    ],
    "weakeningConditions": [
      "卯被强冲、穿、合绊或不参与做功",
      "只凭单个地支无法确定现实行业或地点"
    ],
    "imagery": {
      "core": [
        "卯可取门户、关系、审美、文字、教育与柔性协调之象"
      ],
      "positive": [
        "细腻、合作、重体验"
      ],
      "negative": [
        "过旺时边界松动或反复协调"
      ],
      "realityChecks": [
        "现实中是否出现与门户、关系、审美、文字、教育与柔性协调相关的环境、资源或行为方式"
      ]
    },
    "advice": [
      "地支物象用来扩展候选场景，最终以宫位、十神和现实验证为准"
    ],
    "prohibitions": [
      "不能仅凭卯直接断灾祸、疾病、职业或地点"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "265-270",
        "section": "卯地支像法",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_five_elements",
        "pdfPage": "9-13",
        "section": "十二地支章节目录与样页",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "stems-branches",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "branch_chen_imagery",
    "title": "辰湿土、水库：基础物象与现实场域",
    "category": "stem_branch",
    "domains": [
      "self",
      "career",
      "wealth",
      "movement",
      "property",
      "fortune"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 64,
    "gender": "all",
    "queryKeywords": [
      "辰",
      "湿土、水库",
      "地支"
    ],
    "trigger": {
      "branchesAny": [
        "辰"
      ]
    },
    "requires": [
      "确认辰所在宫位、藏干、是否为根或库，以及与其他地支的作用",
      "地支物象必须服从十神归属与当前问题领域"
    ],
    "weakeningConditions": [
      "辰被强冲、穿、合绊或不参与做功",
      "只凭单个地支无法确定现实行业或地点"
    ],
    "imagery": {
      "core": [
        "辰可取平台、综合仓储、网络节点、变化接口与复杂承载之象"
      ],
      "positive": [
        "可汇聚多种资源"
      ],
      "negative": [
        "过重时混杂、拖滞或库门难开"
      ],
      "realityChecks": [
        "现实中是否出现与平台、综合仓储、网络节点、变化接口与复杂承载相关的环境、资源或行为方式"
      ]
    },
    "advice": [
      "地支物象用来扩展候选场景，最终以宫位、十神和现实验证为准"
    ],
    "prohibitions": [
      "不能仅凭辰直接断灾祸、疾病、职业或地点"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "265-270",
        "section": "辰地支像法",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_five_elements",
        "pdfPage": "9-13",
        "section": "十二地支章节目录与样页",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "stems-branches",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "branch_si_imagery",
    "title": "巳阴火、金之长生：基础物象与现实场域",
    "category": "stem_branch",
    "domains": [
      "self",
      "career",
      "wealth",
      "movement",
      "property",
      "fortune"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 64,
    "gender": "all",
    "queryKeywords": [
      "巳",
      "阴火、金之长生",
      "地支"
    ],
    "trigger": {
      "branchesAny": [
        "巳"
      ]
    },
    "requires": [
      "确认巳所在宫位、藏干、是否为根或库，以及与其他地支的作用",
      "地支物象必须服从十神归属与当前问题领域"
    ],
    "weakeningConditions": [
      "巳被强冲、穿、合绊或不参与做功",
      "只凭单个地支无法确定现实行业或地点"
    ],
    "imagery": {
      "core": [
        "巳可取技术、传播、交易、变化、速度与精密加工之象"
      ],
      "positive": [
        "反应快、能转化和传播"
      ],
      "negative": [
        "过旺时急躁、消耗或暗中拉扯"
      ],
      "realityChecks": [
        "现实中是否出现与技术、传播、交易、变化、速度与精密加工相关的环境、资源或行为方式"
      ]
    },
    "advice": [
      "地支物象用来扩展候选场景，最终以宫位、十神和现实验证为准"
    ],
    "prohibitions": [
      "不能仅凭巳直接断灾祸、疾病、职业或地点"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "265-270",
        "section": "巳地支像法",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_five_elements",
        "pdfPage": "9-13",
        "section": "十二地支章节目录与样页",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "stems-branches",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "branch_wu_imagery",
    "title": "午阳火：基础物象与现实场域",
    "category": "stem_branch",
    "domains": [
      "self",
      "career",
      "wealth",
      "movement",
      "property",
      "fortune"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 64,
    "gender": "all",
    "queryKeywords": [
      "午",
      "阳火",
      "地支"
    ],
    "trigger": {
      "branchesAny": [
        "午"
      ]
    },
    "requires": [
      "确认午所在宫位、藏干、是否为根或库，以及与其他地支的作用",
      "地支物象必须服从十神归属与当前问题领域"
    ],
    "weakeningConditions": [
      "午被强冲、穿、合绊或不参与做功",
      "只凭单个地支无法确定现实行业或地点"
    ],
    "imagery": {
      "core": [
        "午可取公开、热度、竞争、文化、权力与快速显化之象"
      ],
      "positive": [
        "积极、可见、行动强"
      ],
      "negative": [
        "过旺时压力、冲突或透支"
      ],
      "realityChecks": [
        "现实中是否出现与公开、热度、竞争、文化、权力与快速显化相关的环境、资源或行为方式"
      ]
    },
    "advice": [
      "地支物象用来扩展候选场景，最终以宫位、十神和现实验证为准"
    ],
    "prohibitions": [
      "不能仅凭午直接断灾祸、疾病、职业或地点"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "265-270",
        "section": "午地支像法",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_five_elements",
        "pdfPage": "9-13",
        "section": "十二地支章节目录与样页",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "stems-branches",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "branch_wei_imagery",
    "title": "未燥土、木库：基础物象与现实场域",
    "category": "stem_branch",
    "domains": [
      "self",
      "career",
      "wealth",
      "movement",
      "property",
      "fortune"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 64,
    "gender": "all",
    "queryKeywords": [
      "未",
      "燥土、木库",
      "地支"
    ],
    "trigger": {
      "branchesAny": [
        "未"
      ]
    },
    "requires": [
      "确认未所在宫位、藏干、是否为根或库，以及与其他地支的作用",
      "地支物象必须服从十神归属与当前问题领域"
    ],
    "weakeningConditions": [
      "未被强冲、穿、合绊或不参与做功",
      "只凭单个地支无法确定现实行业或地点"
    ],
    "imagery": {
      "core": [
        "未可取规划落地、园林、建设、关系收纳与后期整合之象"
      ],
      "positive": [
        "能把成长转成承载"
      ],
      "negative": [
        "过重时缠绕、燥滞或责任堆积"
      ],
      "realityChecks": [
        "现实中是否出现与规划落地、园林、建设、关系收纳与后期整合相关的环境、资源或行为方式"
      ]
    },
    "advice": [
      "地支物象用来扩展候选场景，最终以宫位、十神和现实验证为准"
    ],
    "prohibitions": [
      "不能仅凭未直接断灾祸、疾病、职业或地点"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "265-270",
        "section": "未地支像法",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_five_elements",
        "pdfPage": "9-13",
        "section": "十二地支章节目录与样页",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "stems-branches",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "branch_shen_imagery",
    "title": "申阳金：基础物象与现实场域",
    "category": "stem_branch",
    "domains": [
      "self",
      "career",
      "wealth",
      "movement",
      "property",
      "fortune"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 64,
    "gender": "all",
    "queryKeywords": [
      "申",
      "阳金",
      "地支"
    ],
    "trigger": {
      "branchesAny": [
        "申"
      ]
    },
    "requires": [
      "确认申所在宫位、藏干、是否为根或库，以及与其他地支的作用",
      "地支物象必须服从十神归属与当前问题领域"
    ],
    "weakeningConditions": [
      "申被强冲、穿、合绊或不参与做功",
      "只凭单个地支无法确定现实行业或地点"
    ],
    "imagery": {
      "core": [
        "申可取工具、交通、技术、制度执行、市场与快速切换之象"
      ],
      "positive": [
        "效率、行动、资源交换"
      ],
      "negative": [
        "过旺时强硬、变动或竞争"
      ],
      "realityChecks": [
        "现实中是否出现与工具、交通、技术、制度执行、市场与快速切换相关的环境、资源或行为方式"
      ]
    },
    "advice": [
      "地支物象用来扩展候选场景，最终以宫位、十神和现实验证为准"
    ],
    "prohibitions": [
      "不能仅凭申直接断灾祸、疾病、职业或地点"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "265-270",
        "section": "申地支像法",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_five_elements",
        "pdfPage": "9-13",
        "section": "十二地支章节目录与样页",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "stems-branches",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "branch_you_imagery",
    "title": "酉阴金：基础物象与现实场域",
    "category": "stem_branch",
    "domains": [
      "self",
      "career",
      "wealth",
      "movement",
      "property",
      "fortune"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 64,
    "gender": "all",
    "queryKeywords": [
      "酉",
      "阴金",
      "地支"
    ],
    "trigger": {
      "branchesAny": [
        "酉"
      ]
    },
    "requires": [
      "确认酉所在宫位、藏干、是否为根或库，以及与其他地支的作用",
      "地支物象必须服从十神归属与当前问题领域"
    ],
    "weakeningConditions": [
      "酉被强冲、穿、合绊或不参与做功",
      "只凭单个地支无法确定现实行业或地点"
    ],
    "imagery": {
      "core": [
        "酉可取精密、审美、金融、口才、规则与成果筛选之象"
      ],
      "positive": [
        "重品质、标准和兑现"
      ],
      "negative": [
        "过旺时挑剔、内耗或关系疏离"
      ],
      "realityChecks": [
        "现实中是否出现与精密、审美、金融、口才、规则与成果筛选相关的环境、资源或行为方式"
      ]
    },
    "advice": [
      "地支物象用来扩展候选场景，最终以宫位、十神和现实验证为准"
    ],
    "prohibitions": [
      "不能仅凭酉直接断灾祸、疾病、职业或地点"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "265-270",
        "section": "酉地支像法",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_five_elements",
        "pdfPage": "9-13",
        "section": "十二地支章节目录与样页",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "stems-branches",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "branch_xu_imagery",
    "title": "戌燥土、火库：基础物象与现实场域",
    "category": "stem_branch",
    "domains": [
      "self",
      "career",
      "wealth",
      "movement",
      "property",
      "fortune"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 64,
    "gender": "all",
    "queryKeywords": [
      "戌",
      "燥土、火库",
      "地支"
    ],
    "trigger": {
      "branchesAny": [
        "戌"
      ]
    },
    "requires": [
      "确认戌所在宫位、藏干、是否为根或库，以及与其他地支的作用",
      "地支物象必须服从十神归属与当前问题领域"
    ],
    "weakeningConditions": [
      "戌被强冲、穿、合绊或不参与做功",
      "只凭单个地支无法确定现实行业或地点"
    ],
    "imagery": {
      "core": [
        "戌可取规则、守护、工程、组织边界、文化收藏与收束之象"
      ],
      "positive": [
        "责任、守成、结构稳定"
      ],
      "negative": [
        "过重时封闭、压力或难以变通"
      ],
      "realityChecks": [
        "现实中是否出现与规则、守护、工程、组织边界、文化收藏与收束相关的环境、资源或行为方式"
      ]
    },
    "advice": [
      "地支物象用来扩展候选场景，最终以宫位、十神和现实验证为准"
    ],
    "prohibitions": [
      "不能仅凭戌直接断灾祸、疾病、职业或地点"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "265-270",
        "section": "戌地支像法",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_five_elements",
        "pdfPage": "9-13",
        "section": "十二地支章节目录与样页",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "stems-branches",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "branch_hai_imagery",
    "title": "亥阴水、木之长生：基础物象与现实场域",
    "category": "stem_branch",
    "domains": [
      "self",
      "career",
      "wealth",
      "movement",
      "property",
      "fortune"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 64,
    "gender": "all",
    "queryKeywords": [
      "亥",
      "阴水、木之长生",
      "地支"
    ],
    "trigger": {
      "branchesAny": [
        "亥"
      ]
    },
    "requires": [
      "确认亥所在宫位、藏干、是否为根或库，以及与其他地支的作用",
      "地支物象必须服从十神归属与当前问题领域"
    ],
    "weakeningConditions": [
      "亥被强冲、穿、合绊或不参与做功",
      "只凭单个地支无法确定现实行业或地点"
    ],
    "imagery": {
      "core": [
        "亥可取远方、网络、学习、流动资源、想象与跨界连接之象"
      ],
      "positive": [
        "开放、包容、信息面广"
      ],
      "negative": [
        "过旺时漂移、理想化或目标分散"
      ],
      "realityChecks": [
        "现实中是否出现与远方、网络、学习、流动资源、想象与跨界连接相关的环境、资源或行为方式"
      ]
    },
    "advice": [
      "地支物象用来扩展候选场景，最终以宫位、十神和现实验证为准"
    ],
    "prohibitions": [
      "不能仅凭亥直接断灾祸、疾病、职业或地点"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "265-270",
        "section": "亥地支像法",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_five_elements",
        "pdfPage": "9-13",
        "section": "十二地支章节目录与样页",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "stems-branches",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "relation_stem_combine_mechanism",
    "title": "五合：作用机制与现实主题",
    "category": "relation",
    "domains": [
      "self",
      "career",
      "spouse",
      "wealth",
      "parents",
      "children",
      "movement",
      "property"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 75,
    "gender": "all",
    "queryKeywords": [
      "五合",
      "关系",
      "作用"
    ],
    "trigger": {
      "relationsAny": [
        "五合"
      ]
    },
    "requires": [
      "先确认只属于甲己、乙庚、丙辛、丁壬、戊癸五组，并区分合与化",
      "判断作用方向、宫位、十神归属和原局是否需要该作用"
    ],
    "weakeningConditions": [
      "关系虽存在但不触及当前问题领域",
      "被其他合冲制化改写或岁运未真正引动"
    ],
    "imagery": {
      "core": [
        "天干之间形成连接、牵连、合作意向或合绊"
      ],
      "positive": [
        "有机会建立正式连接、协议或角色绑定"
      ],
      "negative": [
        "也可能出现拖住、分心、争合或自主性下降"
      ],
      "realityChecks": [
        "现实中先核验发生了连接、变化、摩擦或重组，再判断具体事件"
      ]
    },
    "advice": [
      "把关系解释为作用方式，不先贴吉凶标签"
    ],
    "prohibitions": [
      "不能把五合直接等同于结婚、合作成功或已经化气",
      "单一干支关系不能独立证明具体事件"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "1-41",
        "section": "五合与干支作用",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "24-25",
        "section": "地支作用关系：五合",
        "verificationStatus": "selected_pages_verified"
      }
    ],
    "module": "relations",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "relation_stem_combine_palace_role",
    "title": "五合作用到宫位：人物与领域落点",
    "category": "relation",
    "domains": [
      "career",
      "spouse",
      "parents",
      "children",
      "movement",
      "property",
      "friends"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 72,
    "gender": "all",
    "queryKeywords": [
      "五合",
      "宫位",
      "作用到"
    ],
    "trigger": {
      "relationsAny": [
        "五合"
      ],
      "featuresAny": [
        "年柱",
        "月柱",
        "日支",
        "时柱",
        "宫位"
      ]
    },
    "requires": [
      "确认五合具体作用到哪个宫位和哪两个参与者",
      "同一关系作用到不同宫位，现实含义不同"
    ],
    "weakeningConditions": [
      "宫位信息缺失或参与者不明确",
      "只从关系名称推断人物事件"
    ],
    "imagery": {
      "core": [
        "五合的现实落点由被作用宫位决定，不能脱离宫位泛化"
      ],
      "positive": [
        "落在需要调整的宫位时，可促成关系、环境或计划更新"
      ],
      "negative": [
        "落在核心宫位且无承接时，相关领域更易感到波动或摩擦"
      ],
      "realityChecks": [
        "核验现实变化是否集中在该宫位所代表的关系和事项"
      ]
    },
    "advice": [
      "回答中明确写出作用到谁、哪一层、什么主题"
    ],
    "prohibitions": [
      "不能把年柱、月柱、日支、时柱所有含义同时并列"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "1-41",
        "section": "五合与干支作用",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "24-25",
        "section": "地支作用关系：五合",
        "verificationStatus": "selected_pages_verified"
      }
    ],
    "module": "relations",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "relation_six_combine_mechanism",
    "title": "六合：作用机制与现实主题",
    "category": "relation",
    "domains": [
      "self",
      "career",
      "spouse",
      "wealth",
      "parents",
      "children",
      "movement",
      "property"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 75,
    "gender": "all",
    "queryKeywords": [
      "六合",
      "关系",
      "作用"
    ],
    "trigger": {
      "relationsAny": [
        "六合"
      ]
    },
    "requires": [
      "确认六合双方、藏干归属、宫位与是否被冲破",
      "判断作用方向、宫位、十神归属和原局是否需要该作用"
    ],
    "weakeningConditions": [
      "关系虽存在但不触及当前问题领域",
      "被其他合冲制化改写或岁运未真正引动"
    ],
    "imagery": {
      "core": [
        "地支之间形成连接、接近、资源交换或彼此牵制"
      ],
      "positive": [
        "有利于建立接口、合作与关系承接"
      ],
      "negative": [
        "也可能因合绊而行动变慢或被关系牵制"
      ],
      "realityChecks": [
        "现实中先核验发生了连接、变化、摩擦或重组，再判断具体事件"
      ]
    },
    "advice": [
      "把关系解释为作用方式，不先贴吉凶标签"
    ],
    "prohibitions": [
      "不能见六合就定吉、定婚或定合作成功",
      "单一干支关系不能独立证明具体事件"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "1-41",
        "section": "六合与干支作用",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "24-25",
        "section": "地支作用关系：六合",
        "verificationStatus": "selected_pages_verified"
      },
      {
        "sourceId": "cui_five_elements",
        "pdfPage": "9-13",
        "section": "六合章节目录与样页",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "relations",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "relation_six_combine_palace_role",
    "title": "六合作用到宫位：人物与领域落点",
    "category": "relation",
    "domains": [
      "career",
      "spouse",
      "parents",
      "children",
      "movement",
      "property",
      "friends"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 72,
    "gender": "all",
    "queryKeywords": [
      "六合",
      "宫位",
      "作用到"
    ],
    "trigger": {
      "relationsAny": [
        "六合"
      ],
      "featuresAny": [
        "年柱",
        "月柱",
        "日支",
        "时柱",
        "宫位"
      ]
    },
    "requires": [
      "确认六合具体作用到哪个宫位和哪两个参与者",
      "同一关系作用到不同宫位，现实含义不同"
    ],
    "weakeningConditions": [
      "宫位信息缺失或参与者不明确",
      "只从关系名称推断人物事件"
    ],
    "imagery": {
      "core": [
        "六合的现实落点由被作用宫位决定，不能脱离宫位泛化"
      ],
      "positive": [
        "落在需要调整的宫位时，可促成关系、环境或计划更新"
      ],
      "negative": [
        "落在核心宫位且无承接时，相关领域更易感到波动或摩擦"
      ],
      "realityChecks": [
        "核验现实变化是否集中在该宫位所代表的关系和事项"
      ]
    },
    "advice": [
      "回答中明确写出作用到谁、哪一层、什么主题"
    ],
    "prohibitions": [
      "不能把年柱、月柱、日支、时柱所有含义同时并列"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "1-41",
        "section": "六合与干支作用",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "24-25",
        "section": "地支作用关系：六合",
        "verificationStatus": "selected_pages_verified"
      },
      {
        "sourceId": "cui_five_elements",
        "pdfPage": "9-13",
        "section": "六合章节目录与样页",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "relations",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "relation_hidden_combine_mechanism",
    "title": "暗合：作用机制与现实主题",
    "category": "relation",
    "domains": [
      "self",
      "career",
      "spouse",
      "wealth",
      "parents",
      "children",
      "movement",
      "property"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 75,
    "gender": "all",
    "queryKeywords": [
      "暗合",
      "关系",
      "作用"
    ],
    "trigger": {
      "relationsAny": [
        "暗合"
      ]
    },
    "requires": [
      "必须有系统明确标注的暗合关系，并核对藏干参与",
      "判断作用方向、宫位、十神归属和原局是否需要该作用"
    ],
    "weakeningConditions": [
      "关系虽存在但不触及当前问题领域",
      "被其他合冲制化改写或岁运未真正引动"
    ],
    "imagery": {
      "core": [
        "表面不显但内部存在连接、意向或资源暗中流动"
      ],
      "positive": [
        "可表现为隐性支持、私下协调或潜在连接"
      ],
      "negative": [
        "也可能形成信息不透明、暧昧或暗中牵制"
      ],
      "realityChecks": [
        "现实中先核验发生了连接、变化、摩擦或重组，再判断具体事件"
      ]
    },
    "advice": [
      "把关系解释为作用方式，不先贴吉凶标签"
    ],
    "prohibitions": [
      "不能把暗合直接断成秘密恋情或暗财",
      "单一干支关系不能独立证明具体事件"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "1-41",
        "section": "暗合与干支作用",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "24-25",
        "section": "地支作用关系：暗合",
        "verificationStatus": "selected_pages_verified"
      },
      {
        "sourceId": "cui_five_elements",
        "pdfPage": "9-13",
        "section": "暗合章节目录与样页",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "relations",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "relation_hidden_combine_palace_role",
    "title": "暗合作用到宫位：人物与领域落点",
    "category": "relation",
    "domains": [
      "career",
      "spouse",
      "parents",
      "children",
      "movement",
      "property",
      "friends"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 72,
    "gender": "all",
    "queryKeywords": [
      "暗合",
      "宫位",
      "作用到"
    ],
    "trigger": {
      "relationsAny": [
        "暗合"
      ],
      "featuresAny": [
        "年柱",
        "月柱",
        "日支",
        "时柱",
        "宫位"
      ]
    },
    "requires": [
      "确认暗合具体作用到哪个宫位和哪两个参与者",
      "同一关系作用到不同宫位，现实含义不同"
    ],
    "weakeningConditions": [
      "宫位信息缺失或参与者不明确",
      "只从关系名称推断人物事件"
    ],
    "imagery": {
      "core": [
        "暗合的现实落点由被作用宫位决定，不能脱离宫位泛化"
      ],
      "positive": [
        "落在需要调整的宫位时，可促成关系、环境或计划更新"
      ],
      "negative": [
        "落在核心宫位且无承接时，相关领域更易感到波动或摩擦"
      ],
      "realityChecks": [
        "核验现实变化是否集中在该宫位所代表的关系和事项"
      ]
    },
    "advice": [
      "回答中明确写出作用到谁、哪一层、什么主题"
    ],
    "prohibitions": [
      "不能把年柱、月柱、日支、时柱所有含义同时并列"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "1-41",
        "section": "暗合与干支作用",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "24-25",
        "section": "地支作用关系：暗合",
        "verificationStatus": "selected_pages_verified"
      },
      {
        "sourceId": "cui_five_elements",
        "pdfPage": "9-13",
        "section": "暗合章节目录与样页",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "relations",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "relation_self_combine_mechanism",
    "title": "自合：作用机制与现实主题",
    "category": "relation",
    "domains": [
      "self",
      "career",
      "spouse",
      "wealth",
      "parents",
      "children",
      "movement",
      "property"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 75,
    "gender": "all",
    "queryKeywords": [
      "自合",
      "关系",
      "作用"
    ],
    "trigger": {
      "relationsAny": [
        "自合"
      ]
    },
    "requires": [
      "必须有明确自合结构，并看该柱宫位和十神",
      "判断作用方向、宫位、十神归属和原局是否需要该作用"
    ],
    "weakeningConditions": [
      "关系虽存在但不触及当前问题领域",
      "被其他合冲制化改写或岁运未真正引动"
    ],
    "imagery": {
      "core": [
        "同柱内部干支产生牵连，主题更内化并反复自我运作"
      ],
      "positive": [
        "能形成自我驱动、内部闭环或持续承接"
      ],
      "negative": [
        "也可能形成自我束缚、反复或内在矛盾"
      ],
      "realityChecks": [
        "现实中先核验发生了连接、变化、摩擦或重组，再判断具体事件"
      ]
    },
    "advice": [
      "把关系解释为作用方式，不先贴吉凶标签"
    ],
    "prohibitions": [
      "不能只见自合就定婚姻、财富或灾祸",
      "单一干支关系不能独立证明具体事件"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "1-41",
        "section": "自合与干支作用",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "24-25",
        "section": "地支作用关系：自合",
        "verificationStatus": "selected_pages_verified"
      },
      {
        "sourceId": "cui_five_elements",
        "pdfPage": "9-13",
        "section": "自合章节目录与样页",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "relations",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "relation_self_combine_palace_role",
    "title": "自合作用到宫位：人物与领域落点",
    "category": "relation",
    "domains": [
      "career",
      "spouse",
      "parents",
      "children",
      "movement",
      "property",
      "friends"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 72,
    "gender": "all",
    "queryKeywords": [
      "自合",
      "宫位",
      "作用到"
    ],
    "trigger": {
      "relationsAny": [
        "自合"
      ],
      "featuresAny": [
        "年柱",
        "月柱",
        "日支",
        "时柱",
        "宫位"
      ]
    },
    "requires": [
      "确认自合具体作用到哪个宫位和哪两个参与者",
      "同一关系作用到不同宫位，现实含义不同"
    ],
    "weakeningConditions": [
      "宫位信息缺失或参与者不明确",
      "只从关系名称推断人物事件"
    ],
    "imagery": {
      "core": [
        "自合的现实落点由被作用宫位决定，不能脱离宫位泛化"
      ],
      "positive": [
        "落在需要调整的宫位时，可促成关系、环境或计划更新"
      ],
      "negative": [
        "落在核心宫位且无承接时，相关领域更易感到波动或摩擦"
      ],
      "realityChecks": [
        "核验现实变化是否集中在该宫位所代表的关系和事项"
      ]
    },
    "advice": [
      "回答中明确写出作用到谁、哪一层、什么主题"
    ],
    "prohibitions": [
      "不能把年柱、月柱、日支、时柱所有含义同时并列"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "1-41",
        "section": "自合与干支作用",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "24-25",
        "section": "地支作用关系：自合",
        "verificationStatus": "selected_pages_verified"
      },
      {
        "sourceId": "cui_five_elements",
        "pdfPage": "9-13",
        "section": "自合章节目录与样页",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "relations",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "relation_clash_mechanism",
    "title": "冲：作用机制与现实主题",
    "category": "relation",
    "domains": [
      "self",
      "career",
      "spouse",
      "wealth",
      "parents",
      "children",
      "movement",
      "property"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 75,
    "gender": "all",
    "queryKeywords": [
      "冲",
      "关系",
      "作用"
    ],
    "trigger": {
      "relationsAny": [
        "冲"
      ]
    },
    "requires": [
      "确认冲到的宫位、十神、原局是否需要变化及岁运层级",
      "判断作用方向、宫位、十神归属和原局是否需要该作用"
    ],
    "weakeningConditions": [
      "关系虽存在但不触及当前问题领域",
      "被其他合冲制化改写或岁运未真正引动"
    ],
    "imagery": {
      "core": [
        "对位冲击、换位、移动、打破原状与重新安排"
      ],
      "positive": [
        "可推动改变、释放停滞或打开新空间"
      ],
      "negative": [
        "也可能带来波动、冲突、计划中断或位置调整"
      ],
      "realityChecks": [
        "现实中先核验发生了连接、变化、摩擦或重组，再判断具体事件"
      ]
    },
    "advice": [
      "把关系解释为作用方式，不先贴吉凶标签"
    ],
    "prohibitions": [
      "不能把冲直接等同于分手、搬家、事故或失业",
      "单一干支关系不能独立证明具体事件"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "1-41",
        "section": "冲与干支作用",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "24-25",
        "section": "地支作用关系：冲",
        "verificationStatus": "selected_pages_verified"
      },
      {
        "sourceId": "cui_five_elements",
        "pdfPage": "9-13",
        "section": "冲章节目录与样页",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "relations",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "relation_clash_palace_role",
    "title": "冲作用到宫位：人物与领域落点",
    "category": "relation",
    "domains": [
      "career",
      "spouse",
      "parents",
      "children",
      "movement",
      "property",
      "friends"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 72,
    "gender": "all",
    "queryKeywords": [
      "冲",
      "宫位",
      "作用到"
    ],
    "trigger": {
      "relationsAny": [
        "冲"
      ],
      "featuresAny": [
        "年柱",
        "月柱",
        "日支",
        "时柱",
        "宫位"
      ]
    },
    "requires": [
      "确认冲具体作用到哪个宫位和哪两个参与者",
      "同一关系作用到不同宫位，现实含义不同"
    ],
    "weakeningConditions": [
      "宫位信息缺失或参与者不明确",
      "只从关系名称推断人物事件"
    ],
    "imagery": {
      "core": [
        "冲的现实落点由被作用宫位决定，不能脱离宫位泛化"
      ],
      "positive": [
        "落在需要调整的宫位时，可促成关系、环境或计划更新"
      ],
      "negative": [
        "落在核心宫位且无承接时，相关领域更易感到波动或摩擦"
      ],
      "realityChecks": [
        "核验现实变化是否集中在该宫位所代表的关系和事项"
      ]
    },
    "advice": [
      "回答中明确写出作用到谁、哪一层、什么主题"
    ],
    "prohibitions": [
      "不能把年柱、月柱、日支、时柱所有含义同时并列"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "1-41",
        "section": "冲与干支作用",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "24-25",
        "section": "地支作用关系：冲",
        "verificationStatus": "selected_pages_verified"
      },
      {
        "sourceId": "cui_five_elements",
        "pdfPage": "9-13",
        "section": "冲章节目录与样页",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "relations",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "relation_punishment_mechanism",
    "title": "刑：作用机制与现实主题",
    "category": "relation",
    "domains": [
      "self",
      "career",
      "spouse",
      "wealth",
      "parents",
      "children",
      "movement",
      "property"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 75,
    "gender": "all",
    "queryKeywords": [
      "刑",
      "关系",
      "作用"
    ],
    "trigger": {
      "relationsAny": [
        "刑"
      ]
    },
    "requires": [
      "区分自刑、无恩之刑、恃势之刑等条件是否完整",
      "判断作用方向、宫位、十神归属和原局是否需要该作用"
    ],
    "weakeningConditions": [
      "关系虽存在但不触及当前问题领域",
      "被其他合冲制化改写或岁运未真正引动"
    ],
    "imagery": {
      "core": [
        "规范压力、反复修正、摩擦和内部不协调"
      ],
      "positive": [
        "可促使纠偏、标准化和处理旧问题"
      ],
      "negative": [
        "容易反复、较劲、延误或心理压力增加"
      ],
      "realityChecks": [
        "现实中先核验发生了连接、变化、摩擦或重组，再判断具体事件"
      ]
    },
    "advice": [
      "把关系解释为作用方式，不先贴吉凶标签"
    ],
    "prohibitions": [
      "不能把刑直接断成官非、手术或灾祸",
      "单一干支关系不能独立证明具体事件"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "1-41",
        "section": "刑与干支作用",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "24-25",
        "section": "地支作用关系：刑",
        "verificationStatus": "selected_pages_verified"
      },
      {
        "sourceId": "cui_five_elements",
        "pdfPage": "9-13",
        "section": "刑章节目录与样页",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "relations",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "relation_punishment_palace_role",
    "title": "刑作用到宫位：人物与领域落点",
    "category": "relation",
    "domains": [
      "career",
      "spouse",
      "parents",
      "children",
      "movement",
      "property",
      "friends"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 72,
    "gender": "all",
    "queryKeywords": [
      "刑",
      "宫位",
      "作用到"
    ],
    "trigger": {
      "relationsAny": [
        "刑"
      ],
      "featuresAny": [
        "年柱",
        "月柱",
        "日支",
        "时柱",
        "宫位"
      ]
    },
    "requires": [
      "确认刑具体作用到哪个宫位和哪两个参与者",
      "同一关系作用到不同宫位，现实含义不同"
    ],
    "weakeningConditions": [
      "宫位信息缺失或参与者不明确",
      "只从关系名称推断人物事件"
    ],
    "imagery": {
      "core": [
        "刑的现实落点由被作用宫位决定，不能脱离宫位泛化"
      ],
      "positive": [
        "落在需要调整的宫位时，可促成关系、环境或计划更新"
      ],
      "negative": [
        "落在核心宫位且无承接时，相关领域更易感到波动或摩擦"
      ],
      "realityChecks": [
        "核验现实变化是否集中在该宫位所代表的关系和事项"
      ]
    },
    "advice": [
      "回答中明确写出作用到谁、哪一层、什么主题"
    ],
    "prohibitions": [
      "不能把年柱、月柱、日支、时柱所有含义同时并列"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "1-41",
        "section": "刑与干支作用",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "24-25",
        "section": "地支作用关系：刑",
        "verificationStatus": "selected_pages_verified"
      },
      {
        "sourceId": "cui_five_elements",
        "pdfPage": "9-13",
        "section": "刑章节目录与样页",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "relations",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "relation_harm_mechanism",
    "title": "害：作用机制与现实主题",
    "category": "relation",
    "domains": [
      "self",
      "career",
      "spouse",
      "wealth",
      "parents",
      "children",
      "movement",
      "property"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 75,
    "gender": "all",
    "queryKeywords": [
      "害",
      "关系",
      "作用"
    ],
    "trigger": {
      "relationsAny": [
        "害"
      ]
    },
    "requires": [
      "确认相害双方及其现实角色，不跨多个领域泛化",
      "判断作用方向、宫位、十神归属和原局是否需要该作用"
    ],
    "weakeningConditions": [
      "关系虽存在但不触及当前问题领域",
      "被其他合冲制化改写或岁运未真正引动"
    ],
    "imagery": {
      "core": [
        "隐性阻力、误解、信息不对称与配合不顺"
      ],
      "positive": [
        "能暴露隐蔽问题并推动细节校正"
      ],
      "negative": [
        "容易出现说不清、互不理解或暗中消耗"
      ],
      "realityChecks": [
        "现实中先核验发生了连接、变化、摩擦或重组，再判断具体事件"
      ]
    },
    "advice": [
      "把关系解释为作用方式，不先贴吉凶标签"
    ],
    "prohibitions": [
      "不能把害直接断成小人、疾病、婚变或家庭冲突",
      "单一干支关系不能独立证明具体事件"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "1-41",
        "section": "害与干支作用",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "24-25",
        "section": "地支作用关系：害",
        "verificationStatus": "selected_pages_verified"
      }
    ],
    "module": "relations",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "relation_harm_palace_role",
    "title": "害作用到宫位：人物与领域落点",
    "category": "relation",
    "domains": [
      "career",
      "spouse",
      "parents",
      "children",
      "movement",
      "property",
      "friends"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 72,
    "gender": "all",
    "queryKeywords": [
      "害",
      "宫位",
      "作用到"
    ],
    "trigger": {
      "relationsAny": [
        "害"
      ],
      "featuresAny": [
        "年柱",
        "月柱",
        "日支",
        "时柱",
        "宫位"
      ]
    },
    "requires": [
      "确认害具体作用到哪个宫位和哪两个参与者",
      "同一关系作用到不同宫位，现实含义不同"
    ],
    "weakeningConditions": [
      "宫位信息缺失或参与者不明确",
      "只从关系名称推断人物事件"
    ],
    "imagery": {
      "core": [
        "害的现实落点由被作用宫位决定，不能脱离宫位泛化"
      ],
      "positive": [
        "落在需要调整的宫位时，可促成关系、环境或计划更新"
      ],
      "negative": [
        "落在核心宫位且无承接时，相关领域更易感到波动或摩擦"
      ],
      "realityChecks": [
        "核验现实变化是否集中在该宫位所代表的关系和事项"
      ]
    },
    "advice": [
      "回答中明确写出作用到谁、哪一层、什么主题"
    ],
    "prohibitions": [
      "不能把年柱、月柱、日支、时柱所有含义同时并列"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "1-41",
        "section": "害与干支作用",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "24-25",
        "section": "地支作用关系：害",
        "verificationStatus": "selected_pages_verified"
      }
    ],
    "module": "relations",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "relation_pierce_mechanism",
    "title": "穿：作用机制与现实主题",
    "category": "relation",
    "domains": [
      "self",
      "career",
      "spouse",
      "wealth",
      "parents",
      "children",
      "movement",
      "property"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 75,
    "gender": "all",
    "queryKeywords": [
      "穿",
      "关系",
      "作用"
    ],
    "trigger": {
      "relationsAny": [
        "穿"
      ]
    },
    "requires": [
      "必须有系统明确标注的穿，并看是否穿到命主核心体用",
      "判断作用方向、宫位、十神归属和原局是否需要该作用"
    ],
    "weakeningConditions": [
      "关系虽存在但不触及当前问题领域",
      "被其他合冲制化改写或岁运未真正引动"
    ],
    "imagery": {
      "core": [
        "直接穿透、破坏接口、利益受损或关系难兼容"
      ],
      "positive": [
        "可快速切断低效连接、暴露核心矛盾"
      ],
      "negative": [
        "容易出现边界受损、资源被穿透或关系紧张"
      ],
      "realityChecks": [
        "现实中先核验发生了连接、变化、摩擦或重组，再判断具体事件"
      ]
    },
    "advice": [
      "把关系解释为作用方式，不先贴吉凶标签"
    ],
    "prohibitions": [
      "不能把穿直接断成死亡、牢狱或重大灾害",
      "单一干支关系不能独立证明具体事件"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "1-41",
        "section": "穿与干支作用",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "24-25",
        "section": "地支作用关系：穿",
        "verificationStatus": "selected_pages_verified"
      },
      {
        "sourceId": "cui_five_elements",
        "pdfPage": "9-13",
        "section": "穿章节目录与样页",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "relations",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "relation_pierce_palace_role",
    "title": "穿作用到宫位：人物与领域落点",
    "category": "relation",
    "domains": [
      "career",
      "spouse",
      "parents",
      "children",
      "movement",
      "property",
      "friends"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 72,
    "gender": "all",
    "queryKeywords": [
      "穿",
      "宫位",
      "作用到"
    ],
    "trigger": {
      "relationsAny": [
        "穿"
      ],
      "featuresAny": [
        "年柱",
        "月柱",
        "日支",
        "时柱",
        "宫位"
      ]
    },
    "requires": [
      "确认穿具体作用到哪个宫位和哪两个参与者",
      "同一关系作用到不同宫位，现实含义不同"
    ],
    "weakeningConditions": [
      "宫位信息缺失或参与者不明确",
      "只从关系名称推断人物事件"
    ],
    "imagery": {
      "core": [
        "穿的现实落点由被作用宫位决定，不能脱离宫位泛化"
      ],
      "positive": [
        "落在需要调整的宫位时，可促成关系、环境或计划更新"
      ],
      "negative": [
        "落在核心宫位且无承接时，相关领域更易感到波动或摩擦"
      ],
      "realityChecks": [
        "核验现实变化是否集中在该宫位所代表的关系和事项"
      ]
    },
    "advice": [
      "回答中明确写出作用到谁、哪一层、什么主题"
    ],
    "prohibitions": [
      "不能把年柱、月柱、日支、时柱所有含义同时并列"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "1-41",
        "section": "穿与干支作用",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "24-25",
        "section": "地支作用关系：穿",
        "verificationStatus": "selected_pages_verified"
      },
      {
        "sourceId": "cui_five_elements",
        "pdfPage": "9-13",
        "section": "穿章节目录与样页",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "relations",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "relation_break_mechanism",
    "title": "破：作用机制与现实主题",
    "category": "relation",
    "domains": [
      "self",
      "career",
      "spouse",
      "wealth",
      "parents",
      "children",
      "movement",
      "property"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 75,
    "gender": "all",
    "queryKeywords": [
      "破",
      "关系",
      "作用"
    ],
    "trigger": {
      "relationsAny": [
        "破"
      ]
    },
    "requires": [
      "确认破到的宫位和对象，判断是否服务于重组",
      "判断作用方向、宫位、十神归属和原局是否需要该作用"
    ],
    "weakeningConditions": [
      "关系虽存在但不触及当前问题领域",
      "被其他合冲制化改写或岁运未真正引动"
    ],
    "imagery": {
      "core": [
        "松动、漏洞、拆分、修补与原有结构不完整"
      ],
      "positive": [
        "适合拆旧重组、修复制度或调整方案"
      ],
      "negative": [
        "容易出现承诺松动、重复返工或小损耗"
      ],
      "realityChecks": [
        "现实中先核验发生了连接、变化、摩擦或重组，再判断具体事件"
      ]
    },
    "advice": [
      "把关系解释为作用方式，不先贴吉凶标签"
    ],
    "prohibitions": [
      "不能把破直接断成破产、离婚或关系必败",
      "单一干支关系不能独立证明具体事件"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "1-41",
        "section": "破与干支作用",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "24-25",
        "section": "地支作用关系：破",
        "verificationStatus": "selected_pages_verified"
      }
    ],
    "module": "relations",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "relation_break_palace_role",
    "title": "破作用到宫位：人物与领域落点",
    "category": "relation",
    "domains": [
      "career",
      "spouse",
      "parents",
      "children",
      "movement",
      "property",
      "friends"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 72,
    "gender": "all",
    "queryKeywords": [
      "破",
      "宫位",
      "作用到"
    ],
    "trigger": {
      "relationsAny": [
        "破"
      ],
      "featuresAny": [
        "年柱",
        "月柱",
        "日支",
        "时柱",
        "宫位"
      ]
    },
    "requires": [
      "确认破具体作用到哪个宫位和哪两个参与者",
      "同一关系作用到不同宫位，现实含义不同"
    ],
    "weakeningConditions": [
      "宫位信息缺失或参与者不明确",
      "只从关系名称推断人物事件"
    ],
    "imagery": {
      "core": [
        "破的现实落点由被作用宫位决定，不能脱离宫位泛化"
      ],
      "positive": [
        "落在需要调整的宫位时，可促成关系、环境或计划更新"
      ],
      "negative": [
        "落在核心宫位且无承接时，相关领域更易感到波动或摩擦"
      ],
      "realityChecks": [
        "核验现实变化是否集中在该宫位所代表的关系和事项"
      ]
    },
    "advice": [
      "回答中明确写出作用到谁、哪一层、什么主题"
    ],
    "prohibitions": [
      "不能把年柱、月柱、日支、时柱所有含义同时并列"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "1-41",
        "section": "破与干支作用",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "24-25",
        "section": "地支作用关系：破",
        "verificationStatus": "selected_pages_verified"
      }
    ],
    "module": "relations",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "relation_half_harmony_mechanism",
    "title": "半合：作用机制与现实主题",
    "category": "relation",
    "domains": [
      "self",
      "career",
      "spouse",
      "wealth",
      "parents",
      "children",
      "movement",
      "property"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 75,
    "gender": "all",
    "queryKeywords": [
      "半合",
      "关系",
      "作用"
    ],
    "trigger": {
      "relationsAny": [
        "半合"
      ]
    },
    "requires": [
      "区分生地半合、墓地半合及是否得令得势",
      "判断作用方向、宫位、十神归属和原局是否需要该作用"
    ],
    "weakeningConditions": [
      "关系虽存在但不触及当前问题领域",
      "被其他合冲制化改写或岁运未真正引动"
    ],
    "imagery": {
      "core": [
        "局部方向一致、力量聚集但条件未全"
      ],
      "positive": [
        "可形成阶段性的协同与倾向"
      ],
      "negative": [
        "也可能只成趋势、未必成局，受第三方条件影响大"
      ],
      "realityChecks": [
        "现实中先核验发生了连接、变化、摩擦或重组，再判断具体事件"
      ]
    },
    "advice": [
      "把关系解释为作用方式，不先贴吉凶标签"
    ],
    "prohibitions": [
      "不能把半合直接写成三合局或化气",
      "单一干支关系不能独立证明具体事件"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "1-41",
        "section": "半合与干支作用",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "24-25",
        "section": "地支作用关系：半合",
        "verificationStatus": "selected_pages_verified"
      },
      {
        "sourceId": "cui_five_elements",
        "pdfPage": "9-13",
        "section": "半合章节目录与样页",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "relations",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "relation_half_harmony_palace_role",
    "title": "半合作用到宫位：人物与领域落点",
    "category": "relation",
    "domains": [
      "career",
      "spouse",
      "parents",
      "children",
      "movement",
      "property",
      "friends"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 72,
    "gender": "all",
    "queryKeywords": [
      "半合",
      "宫位",
      "作用到"
    ],
    "trigger": {
      "relationsAny": [
        "半合"
      ],
      "featuresAny": [
        "年柱",
        "月柱",
        "日支",
        "时柱",
        "宫位"
      ]
    },
    "requires": [
      "确认半合具体作用到哪个宫位和哪两个参与者",
      "同一关系作用到不同宫位，现实含义不同"
    ],
    "weakeningConditions": [
      "宫位信息缺失或参与者不明确",
      "只从关系名称推断人物事件"
    ],
    "imagery": {
      "core": [
        "半合的现实落点由被作用宫位决定，不能脱离宫位泛化"
      ],
      "positive": [
        "落在需要调整的宫位时，可促成关系、环境或计划更新"
      ],
      "negative": [
        "落在核心宫位且无承接时，相关领域更易感到波动或摩擦"
      ],
      "realityChecks": [
        "核验现实变化是否集中在该宫位所代表的关系和事项"
      ]
    },
    "advice": [
      "回答中明确写出作用到谁、哪一层、什么主题"
    ],
    "prohibitions": [
      "不能把年柱、月柱、日支、时柱所有含义同时并列"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "1-41",
        "section": "半合与干支作用",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "24-25",
        "section": "地支作用关系：半合",
        "verificationStatus": "selected_pages_verified"
      },
      {
        "sourceId": "cui_five_elements",
        "pdfPage": "9-13",
        "section": "半合章节目录与样页",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "relations",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "relation_arch_harmony_mechanism",
    "title": "拱合：作用机制与现实主题",
    "category": "relation",
    "domains": [
      "self",
      "career",
      "spouse",
      "wealth",
      "parents",
      "children",
      "movement",
      "property"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 75,
    "gender": "all",
    "queryKeywords": [
      "拱合",
      "关系",
      "作用"
    ],
    "trigger": {
      "relationsAny": [
        "拱合"
      ]
    },
    "requires": [
      "确认两支确有拱合条件，并看缺字是否被岁运补齐",
      "判断作用方向、宫位、十神归属和原局是否需要该作用"
    ],
    "weakeningConditions": [
      "关系虽存在但不触及当前问题领域",
      "被其他合冲制化改写或岁运未真正引动"
    ],
    "imagery": {
      "core": [
        "缺一字的潜在聚合、期待或结构牵引"
      ],
      "positive": [
        "可形成隐性方向和待触发的协同"
      ],
      "negative": [
        "条件不足时只是一种倾向，容易落空"
      ],
      "realityChecks": [
        "现实中先核验发生了连接、变化、摩擦或重组，再判断具体事件"
      ]
    },
    "advice": [
      "把关系解释为作用方式，不先贴吉凶标签"
    ],
    "prohibitions": [
      "不能把拱合当成完整三合局",
      "单一干支关系不能独立证明具体事件"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "1-41",
        "section": "拱合与干支作用",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "24-25",
        "section": "地支作用关系：拱合",
        "verificationStatus": "selected_pages_verified"
      }
    ],
    "module": "relations",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "relation_arch_harmony_palace_role",
    "title": "拱合作用到宫位：人物与领域落点",
    "category": "relation",
    "domains": [
      "career",
      "spouse",
      "parents",
      "children",
      "movement",
      "property",
      "friends"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 72,
    "gender": "all",
    "queryKeywords": [
      "拱合",
      "宫位",
      "作用到"
    ],
    "trigger": {
      "relationsAny": [
        "拱合"
      ],
      "featuresAny": [
        "年柱",
        "月柱",
        "日支",
        "时柱",
        "宫位"
      ]
    },
    "requires": [
      "确认拱合具体作用到哪个宫位和哪两个参与者",
      "同一关系作用到不同宫位，现实含义不同"
    ],
    "weakeningConditions": [
      "宫位信息缺失或参与者不明确",
      "只从关系名称推断人物事件"
    ],
    "imagery": {
      "core": [
        "拱合的现实落点由被作用宫位决定，不能脱离宫位泛化"
      ],
      "positive": [
        "落在需要调整的宫位时，可促成关系、环境或计划更新"
      ],
      "negative": [
        "落在核心宫位且无承接时，相关领域更易感到波动或摩擦"
      ],
      "realityChecks": [
        "核验现实变化是否集中在该宫位所代表的关系和事项"
      ]
    },
    "advice": [
      "回答中明确写出作用到谁、哪一层、什么主题"
    ],
    "prohibitions": [
      "不能把年柱、月柱、日支、时柱所有含义同时并列"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "1-41",
        "section": "拱合与干支作用",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "24-25",
        "section": "地支作用关系：拱合",
        "verificationStatus": "selected_pages_verified"
      }
    ],
    "module": "relations",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "relation_triple_harmony_mechanism",
    "title": "三合：作用机制与现实主题",
    "category": "relation",
    "domains": [
      "self",
      "career",
      "spouse",
      "wealth",
      "parents",
      "children",
      "movement",
      "property"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 75,
    "gender": "all",
    "queryKeywords": [
      "三合",
      "关系",
      "作用"
    ],
    "trigger": {
      "relationsAny": [
        "三合"
      ]
    },
    "requires": [
      "三支齐全后仍需判断月令、透干、制化与是否真正成势",
      "判断作用方向、宫位、十神归属和原局是否需要该作用"
    ],
    "weakeningConditions": [
      "关系虽存在但不触及当前问题领域",
      "被其他合冲制化改写或岁运未真正引动"
    ],
    "imagery": {
      "core": [
        "三支共同形成较强的方向性与资源汇聚"
      ],
      "positive": [
        "可强化某五行主题并形成稳定协作"
      ],
      "negative": [
        "过旺时会压制其他结构或改变原有平衡"
      ],
      "realityChecks": [
        "现实中先核验发生了连接、变化、摩擦或重组，再判断具体事件"
      ]
    },
    "advice": [
      "把关系解释为作用方式，不先贴吉凶标签"
    ],
    "prohibitions": [
      "不能只因三支齐全就写已经化局",
      "单一干支关系不能独立证明具体事件"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "1-41",
        "section": "三合与干支作用",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "24-25",
        "section": "地支作用关系：三合",
        "verificationStatus": "selected_pages_verified"
      },
      {
        "sourceId": "cui_five_elements",
        "pdfPage": "9-13",
        "section": "三合章节目录与样页",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "relations",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "relation_triple_harmony_palace_role",
    "title": "三合作用到宫位：人物与领域落点",
    "category": "relation",
    "domains": [
      "career",
      "spouse",
      "parents",
      "children",
      "movement",
      "property",
      "friends"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 72,
    "gender": "all",
    "queryKeywords": [
      "三合",
      "宫位",
      "作用到"
    ],
    "trigger": {
      "relationsAny": [
        "三合"
      ],
      "featuresAny": [
        "年柱",
        "月柱",
        "日支",
        "时柱",
        "宫位"
      ]
    },
    "requires": [
      "确认三合具体作用到哪个宫位和哪两个参与者",
      "同一关系作用到不同宫位，现实含义不同"
    ],
    "weakeningConditions": [
      "宫位信息缺失或参与者不明确",
      "只从关系名称推断人物事件"
    ],
    "imagery": {
      "core": [
        "三合的现实落点由被作用宫位决定，不能脱离宫位泛化"
      ],
      "positive": [
        "落在需要调整的宫位时，可促成关系、环境或计划更新"
      ],
      "negative": [
        "落在核心宫位且无承接时，相关领域更易感到波动或摩擦"
      ],
      "realityChecks": [
        "核验现实变化是否集中在该宫位所代表的关系和事项"
      ]
    },
    "advice": [
      "回答中明确写出作用到谁、哪一层、什么主题"
    ],
    "prohibitions": [
      "不能把年柱、月柱、日支、时柱所有含义同时并列"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "1-41",
        "section": "三合与干支作用",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "24-25",
        "section": "地支作用关系：三合",
        "verificationStatus": "selected_pages_verified"
      },
      {
        "sourceId": "cui_five_elements",
        "pdfPage": "9-13",
        "section": "三合章节目录与样页",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "relations",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "relation_triple_meeting_mechanism",
    "title": "三会：作用机制与现实主题",
    "category": "relation",
    "domains": [
      "self",
      "career",
      "spouse",
      "wealth",
      "parents",
      "children",
      "movement",
      "property"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 75,
    "gender": "all",
    "queryKeywords": [
      "三会",
      "关系",
      "作用"
    ],
    "trigger": {
      "relationsAny": [
        "三会"
      ]
    },
    "requires": [
      "三支齐全并结合季节、透干和承载能力",
      "判断作用方向、宫位、十神归属和原局是否需要该作用"
    ],
    "weakeningConditions": [
      "关系虽存在但不触及当前问题领域",
      "被其他合冲制化改写或岁运未真正引动"
    ],
    "imagery": {
      "core": [
        "同季三支汇聚，环境和阶段力量高度集中"
      ],
      "positive": [
        "可形成强烈的环境趋势和集体资源"
      ],
      "negative": [
        "过强时容易一边倒、失衡或现实压力集中"
      ],
      "realityChecks": [
        "现实中先核验发生了连接、变化、摩擦或重组，再判断具体事件"
      ]
    },
    "advice": [
      "把关系解释为作用方式，不先贴吉凶标签"
    ],
    "prohibitions": [
      "不能把三会自动等同于吉局或化气",
      "单一干支关系不能独立证明具体事件"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "1-41",
        "section": "三会与干支作用",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "24-25",
        "section": "地支作用关系：三会",
        "verificationStatus": "selected_pages_verified"
      },
      {
        "sourceId": "cui_five_elements",
        "pdfPage": "9-13",
        "section": "三会章节目录与样页",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "relations",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "relation_triple_meeting_palace_role",
    "title": "三会作用到宫位：人物与领域落点",
    "category": "relation",
    "domains": [
      "career",
      "spouse",
      "parents",
      "children",
      "movement",
      "property",
      "friends"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 72,
    "gender": "all",
    "queryKeywords": [
      "三会",
      "宫位",
      "作用到"
    ],
    "trigger": {
      "relationsAny": [
        "三会"
      ],
      "featuresAny": [
        "年柱",
        "月柱",
        "日支",
        "时柱",
        "宫位"
      ]
    },
    "requires": [
      "确认三会具体作用到哪个宫位和哪两个参与者",
      "同一关系作用到不同宫位，现实含义不同"
    ],
    "weakeningConditions": [
      "宫位信息缺失或参与者不明确",
      "只从关系名称推断人物事件"
    ],
    "imagery": {
      "core": [
        "三会的现实落点由被作用宫位决定，不能脱离宫位泛化"
      ],
      "positive": [
        "落在需要调整的宫位时，可促成关系、环境或计划更新"
      ],
      "negative": [
        "落在核心宫位且无承接时，相关领域更易感到波动或摩擦"
      ],
      "realityChecks": [
        "核验现实变化是否集中在该宫位所代表的关系和事项"
      ]
    },
    "advice": [
      "回答中明确写出作用到谁、哪一层、什么主题"
    ],
    "prohibitions": [
      "不能把年柱、月柱、日支、时柱所有含义同时并列"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "1-41",
        "section": "三会与干支作用",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "24-25",
        "section": "地支作用关系：三会",
        "verificationStatus": "selected_pages_verified"
      },
      {
        "sourceId": "cui_five_elements",
        "pdfPage": "9-13",
        "section": "三会章节目录与样页",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "relations",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "relation_repetition_mechanism",
    "title": "伏吟：作用机制与现实主题",
    "category": "relation",
    "domains": [
      "self",
      "career",
      "spouse",
      "wealth",
      "parents",
      "children",
      "movement",
      "property"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 75,
    "gender": "all",
    "queryKeywords": [
      "伏吟",
      "关系",
      "作用"
    ],
    "trigger": {
      "relationsAny": [
        "伏吟"
      ]
    },
    "requires": [
      "确认重复发生在哪一层、哪个宫位及是否与岁运同现",
      "判断作用方向、宫位、十神归属和原局是否需要该作用"
    ],
    "weakeningConditions": [
      "关系虽存在但不触及当前问题领域",
      "被其他合冲制化改写或岁运未真正引动"
    ],
    "imagery": {
      "core": [
        "相同干支或结构重复，主题加重、重复和回看"
      ],
      "positive": [
        "有利于巩固、重做、复盘与完成旧事"
      ],
      "negative": [
        "也可能带来重复压力、停滞或情绪放大"
      ],
      "realityChecks": [
        "现实中先核验发生了连接、变化、摩擦或重组，再判断具体事件"
      ]
    },
    "advice": [
      "把关系解释为作用方式，不先贴吉凶标签"
    ],
    "prohibitions": [
      "不能把伏吟直接断成哭泣、死亡或必有灾",
      "单一干支关系不能独立证明具体事件"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "1-41",
        "section": "伏吟与干支作用",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "24-25",
        "section": "地支作用关系：伏吟",
        "verificationStatus": "selected_pages_verified"
      }
    ],
    "module": "relations",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "relation_repetition_palace_role",
    "title": "伏吟作用到宫位：人物与领域落点",
    "category": "relation",
    "domains": [
      "career",
      "spouse",
      "parents",
      "children",
      "movement",
      "property",
      "friends"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 72,
    "gender": "all",
    "queryKeywords": [
      "伏吟",
      "宫位",
      "作用到"
    ],
    "trigger": {
      "relationsAny": [
        "伏吟"
      ],
      "featuresAny": [
        "年柱",
        "月柱",
        "日支",
        "时柱",
        "宫位"
      ]
    },
    "requires": [
      "确认伏吟具体作用到哪个宫位和哪两个参与者",
      "同一关系作用到不同宫位，现实含义不同"
    ],
    "weakeningConditions": [
      "宫位信息缺失或参与者不明确",
      "只从关系名称推断人物事件"
    ],
    "imagery": {
      "core": [
        "伏吟的现实落点由被作用宫位决定，不能脱离宫位泛化"
      ],
      "positive": [
        "落在需要调整的宫位时，可促成关系、环境或计划更新"
      ],
      "negative": [
        "落在核心宫位且无承接时，相关领域更易感到波动或摩擦"
      ],
      "realityChecks": [
        "核验现实变化是否集中在该宫位所代表的关系和事项"
      ]
    },
    "advice": [
      "回答中明确写出作用到谁、哪一层、什么主题"
    ],
    "prohibitions": [
      "不能把年柱、月柱、日支、时柱所有含义同时并列"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "1-41",
        "section": "伏吟与干支作用",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "24-25",
        "section": "地支作用关系：伏吟",
        "verificationStatus": "selected_pages_verified"
      }
    ],
    "module": "relations",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "relation_opposition_mechanism",
    "title": "反吟：作用机制与现实主题",
    "category": "relation",
    "domains": [
      "self",
      "career",
      "spouse",
      "wealth",
      "parents",
      "children",
      "movement",
      "property"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 75,
    "gender": "all",
    "queryKeywords": [
      "反吟",
      "关系",
      "作用"
    ],
    "trigger": {
      "relationsAny": [
        "反吟"
      ]
    },
    "requires": [
      "必须有明确反吟或对冲结构，并看原局承载",
      "判断作用方向、宫位、十神归属和原局是否需要该作用"
    ],
    "weakeningConditions": [
      "关系虽存在但不触及当前问题领域",
      "被其他合冲制化改写或岁运未真正引动"
    ],
    "imagery": {
      "core": [
        "上下或岁运形成强对立，主题快速翻转与位置变化"
      ],
      "positive": [
        "可推动彻底调整和旧模式重构"
      ],
      "negative": [
        "容易出现方向冲突、节奏剧烈或稳定性下降"
      ],
      "realityChecks": [
        "现实中先核验发生了连接、变化、摩擦或重组，再判断具体事件"
      ]
    },
    "advice": [
      "把关系解释为作用方式，不先贴吉凶标签"
    ],
    "prohibitions": [
      "不能把反吟直接断成事故或人生大败",
      "单一干支关系不能独立证明具体事件"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "1-41",
        "section": "反吟与干支作用",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "24-25",
        "section": "地支作用关系：反吟",
        "verificationStatus": "selected_pages_verified"
      }
    ],
    "module": "relations",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "relation_opposition_palace_role",
    "title": "反吟作用到宫位：人物与领域落点",
    "category": "relation",
    "domains": [
      "career",
      "spouse",
      "parents",
      "children",
      "movement",
      "property",
      "friends"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 72,
    "gender": "all",
    "queryKeywords": [
      "反吟",
      "宫位",
      "作用到"
    ],
    "trigger": {
      "relationsAny": [
        "反吟"
      ],
      "featuresAny": [
        "年柱",
        "月柱",
        "日支",
        "时柱",
        "宫位"
      ]
    },
    "requires": [
      "确认反吟具体作用到哪个宫位和哪两个参与者",
      "同一关系作用到不同宫位，现实含义不同"
    ],
    "weakeningConditions": [
      "宫位信息缺失或参与者不明确",
      "只从关系名称推断人物事件"
    ],
    "imagery": {
      "core": [
        "反吟的现实落点由被作用宫位决定，不能脱离宫位泛化"
      ],
      "positive": [
        "落在需要调整的宫位时，可促成关系、环境或计划更新"
      ],
      "negative": [
        "落在核心宫位且无承接时，相关领域更易感到波动或摩擦"
      ],
      "realityChecks": [
        "核验现实变化是否集中在该宫位所代表的关系和事项"
      ]
    },
    "advice": [
      "回答中明确写出作用到谁、哪一层、什么主题"
    ],
    "prohibitions": [
      "不能把年柱、月柱、日支、时柱所有含义同时并列"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "1-41",
        "section": "反吟与干支作用",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "24-25",
        "section": "地支作用关系：反吟",
        "verificationStatus": "selected_pages_verified"
      }
    ],
    "module": "relations",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "palace_year_source",
    "title": "年柱作为来源与外层背景",
    "category": "palace",
    "domains": [
      "parents",
      "self",
      "movement",
      "fortune"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 71,
    "gender": "all",
    "queryKeywords": [
      "年柱"
    ],
    "trigger": {
      "featuresAny": [
        "年柱"
      ]
    },
    "requires": [
      "需结合年干年支的十神归属以及是否与日主发生直接作用",
      "宫位取象需与十神、宾主、来源和当前问题交叉验证"
    ],
    "weakeningConditions": [
      "现实阶段不对应该宫位的传统人物含义",
      "宫位虽被提及但无直接作用"
    ],
    "imagery": {
      "core": [
        "年柱更偏家族根基、早年环境、外层来源与较远关系"
      ],
      "positive": [
        "宫位明确时，可帮助缩小现实落点和人物范围"
      ],
      "negative": [
        "忽略宫位会把同一十神泛化到错误领域"
      ],
      "realityChecks": [
        "现实验证集中在该宫位的主要角色，不同时铺开所有类象"
      ]
    },
    "advice": [
      "回答时优先选择与年龄、问题和现实阶段最匹配的一个或两个落点"
    ],
    "prohibitions": [
      "不能把年柱所有事项机械等同于祖上或父母"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "64-68",
        "section": "宫位、家里外边与看命顺序",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "7,44-49",
        "section": "宾主理论及宫位目录框架",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "palaces",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "palace_year_external",
    "title": "年柱与外部资源、远方和公共环境",
    "category": "palace",
    "domains": [
      "movement",
      "career",
      "wealth"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 70,
    "gender": "all",
    "queryKeywords": [
      "年柱",
      "外边",
      "远方"
    ],
    "trigger": {
      "featuresAny": [
        "年柱",
        "外边",
        "远方"
      ]
    },
    "requires": [
      "判断资源能否流入主位、是否被命主取得",
      "宫位取象需与十神、宾主、来源和当前问题交叉验证"
    ],
    "weakeningConditions": [
      "现实阶段不对应该宫位的传统人物含义",
      "宫位虽被提及但无直接作用"
    ],
    "imagery": {
      "core": [
        "年柱中的财官印食可提示外部、远层或公共资源来源"
      ],
      "positive": [
        "宫位明确时，可帮助缩小现实落点和人物范围"
      ],
      "negative": [
        "忽略宫位会把同一十神泛化到错误领域"
      ],
      "realityChecks": [
        "现实验证集中在该宫位的主要角色，不同时铺开所有类象"
      ]
    },
    "advice": [
      "回答时优先选择与年龄、问题和现实阶段最匹配的一个或两个落点"
    ],
    "prohibitions": [
      "不能仅凭年柱有财官就断富贵"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "64-68",
        "section": "宫位、家里外边与看命顺序",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "7,44-49",
        "section": "宾主理论及宫位目录框架",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "palaces",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "palace_month_environment_detail",
    "title": "月柱作为成长秩序与事业环境",
    "category": "palace",
    "domains": [
      "parents",
      "career",
      "self"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 72,
    "gender": "all",
    "queryKeywords": [
      "月柱",
      "月令"
    ],
    "trigger": {
      "featuresAny": [
        "月柱",
        "月令"
      ]
    },
    "requires": [
      "月令还要承担旺衰和气候判断，不能只作人物宫位",
      "宫位取象需与十神、宾主、来源和当前问题交叉验证"
    ],
    "weakeningConditions": [
      "现实阶段不对应该宫位的传统人物含义",
      "宫位虽被提及但无直接作用"
    ],
    "imagery": {
      "core": [
        "月柱反映成长环境、父母承接、主要社会秩序与工作接口"
      ],
      "positive": [
        "宫位明确时，可帮助缩小现实落点和人物范围"
      ],
      "negative": [
        "忽略宫位会把同一十神泛化到错误领域"
      ],
      "realityChecks": [
        "现实验证集中在该宫位的主要角色，不同时铺开所有类象"
      ]
    },
    "advice": [
      "回答时优先选择与年龄、问题和现实阶段最匹配的一个或两个落点"
    ],
    "prohibitions": [
      "不能把月柱单独等同于父母吉凶"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "64-68",
        "section": "宫位、家里外边与看命顺序",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "7,44-49",
        "section": "宾主理论及宫位目录框架",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "palaces",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "palace_month_work_interface",
    "title": "月柱与单位、行业环境和社会评价",
    "category": "palace",
    "domains": [
      "career",
      "friends"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 71,
    "gender": "all",
    "queryKeywords": [
      "月柱",
      "工作环境",
      "单位"
    ],
    "trigger": {
      "featuresAny": [
        "月柱",
        "工作环境",
        "单位"
      ]
    },
    "requires": [
      "必须结合官印财食等角色和实际岁运作用",
      "宫位取象需与十神、宾主、来源和当前问题交叉验证"
    ],
    "weakeningConditions": [
      "现实阶段不对应该宫位的传统人物含义",
      "宫位虽被提及但无直接作用"
    ],
    "imagery": {
      "core": [
        "月柱被岁运引动时，单位环境、职责接口或社会评价更容易变化"
      ],
      "positive": [
        "宫位明确时，可帮助缩小现实落点和人物范围"
      ],
      "negative": [
        "忽略宫位会把同一十神泛化到错误领域"
      ],
      "realityChecks": [
        "现实验证集中在该宫位的主要角色，不同时铺开所有类象"
      ]
    },
    "advice": [
      "回答时优先选择与年龄、问题和现实阶段最匹配的一个或两个落点"
    ],
    "prohibitions": [
      "不能只见月柱冲合就断换工作"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "64-68",
        "section": "宫位、家里外边与看命顺序",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "7,44-49",
        "section": "宾主理论及宫位目录框架",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "palaces",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "palace_day_self",
    "title": "日干作为命主直接立场与承载",
    "category": "palace",
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
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 70,
    "gender": "all",
    "queryKeywords": [
      "日干",
      "日主"
    ],
    "trigger": {
      "featuresAny": [
        "日干",
        "日主"
      ]
    },
    "requires": [
      "需结合根气、帮扶、克泄和坐支",
      "宫位取象需与十神、宾主、来源和当前问题交叉验证"
    ],
    "weakeningConditions": [
      "现实阶段不对应该宫位的传统人物含义",
      "宫位虽被提及但无直接作用"
    ],
    "imagery": {
      "core": [
        "日干体现命主直接立场、行动主体和承载能力"
      ],
      "positive": [
        "宫位明确时，可帮助缩小现实落点和人物范围"
      ],
      "negative": [
        "忽略宫位会把同一十神泛化到错误领域"
      ],
      "realityChecks": [
        "现实验证集中在该宫位的主要角色，不同时铺开所有类象"
      ]
    },
    "advice": [
      "回答时优先选择与年龄、问题和现实阶段最匹配的一个或两个落点"
    ],
    "prohibitions": [
      "不能把日干旺弱直接等同于性格好坏"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "64-68",
        "section": "宫位、家里外边与看命顺序",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "7,44-49",
        "section": "宾主理论及宫位目录框架",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "palaces",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "palace_day_spouse",
    "title": "日支作为亲密关系与日常落点",
    "category": "palace",
    "domains": [
      "spouse",
      "self"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 72,
    "gender": "all",
    "queryKeywords": [
      "日支",
      "夫妻宫"
    ],
    "trigger": {
      "featuresAny": [
        "日支",
        "夫妻宫"
      ]
    },
    "requires": [
      "配偶星、日支、宾主和岁运必须共同判断",
      "宫位取象需与十神、宾主、来源和当前问题交叉验证"
    ],
    "weakeningConditions": [
      "现实阶段不对应该宫位的传统人物含义",
      "宫位虽被提及但无直接作用"
    ],
    "imagery": {
      "core": [
        "日支反映亲密关系模式、日常相处与命主贴身环境"
      ],
      "positive": [
        "宫位明确时，可帮助缩小现实落点和人物范围"
      ],
      "negative": [
        "忽略宫位会把同一十神泛化到错误领域"
      ],
      "realityChecks": [
        "现实验证集中在该宫位的主要角色，不同时铺开所有类象"
      ]
    },
    "advice": [
      "回答时优先选择与年龄、问题和现实阶段最匹配的一个或两个落点"
    ],
    "prohibitions": [
      "日支被冲合不直接等同于结婚或离婚"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "64-68",
        "section": "宫位、家里外边与看命顺序",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "7,44-49",
        "section": "宾主理论及宫位目录框架",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "palaces",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "palace_day_body",
    "title": "日柱干支一体与自我矛盾",
    "category": "palace",
    "domains": [
      "self",
      "spouse",
      "health"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 71,
    "gender": "all",
    "queryKeywords": [
      "日柱",
      "坐下",
      "连体"
    ],
    "trigger": {
      "featuresAny": [
        "日柱",
        "坐下",
        "连体"
      ]
    },
    "requires": [
      "需区分坐下是否为体、是否被外层结构调用",
      "宫位取象需与十神、宾主、来源和当前问题交叉验证"
    ],
    "weakeningConditions": [
      "现实阶段不对应该宫位的传统人物含义",
      "宫位虽被提及但无直接作用"
    ],
    "imagery": {
      "core": [
        "日干与日支的生克制化反映自我、身体感受和亲密关系之间的直接互动"
      ],
      "positive": [
        "宫位明确时，可帮助缩小现实落点和人物范围"
      ],
      "negative": [
        "忽略宫位会把同一十神泛化到错误领域"
      ],
      "realityChecks": [
        "现实验证集中在该宫位的主要角色，不同时铺开所有类象"
      ]
    },
    "advice": [
      "回答时优先选择与年龄、问题和现实阶段最匹配的一个或两个落点"
    ],
    "prohibitions": [
      "不能只凭坐下十神断身体疾病或婚姻结局"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "64-68",
        "section": "宫位、家里外边与看命顺序",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "7,44-49",
        "section": "宾主理论及宫位目录框架",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "palaces",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "palace_hour_result",
    "title": "时柱作为结果、作品与后期规划",
    "category": "palace",
    "domains": [
      "children",
      "career",
      "fortune"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 70,
    "gender": "all",
    "queryKeywords": [
      "时柱",
      "结果",
      "后期"
    ],
    "trigger": {
      "featuresAny": [
        "时柱",
        "结果",
        "后期"
      ]
    },
    "requires": [
      "需结合命主年龄和现实阶段，未婚未育者优先取成果与后期计划",
      "宫位取象需与十神、宾主、来源和当前问题交叉验证"
    ],
    "weakeningConditions": [
      "现实阶段不对应该宫位的传统人物含义",
      "宫位虽被提及但无直接作用"
    ],
    "imagery": {
      "core": [
        "时柱更偏执行结果、作品、后期规划、子女或下属层"
      ],
      "positive": [
        "宫位明确时，可帮助缩小现实落点和人物范围"
      ],
      "negative": [
        "忽略宫位会把同一十神泛化到错误领域"
      ],
      "realityChecks": [
        "现实验证集中在该宫位的主要角色，不同时铺开所有类象"
      ]
    },
    "advice": [
      "回答时优先选择与年龄、问题和现实阶段最匹配的一个或两个落点"
    ],
    "prohibitions": [
      "不能同时断子女、晚年、下属和作品"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "64-68",
        "section": "宫位、家里外边与看命顺序",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "7,44-49",
        "section": "宾主理论及宫位目录框架",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "palaces",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "palace_hour_future",
    "title": "时柱被岁运引动的后续变化",
    "category": "palace",
    "domains": [
      "career",
      "children",
      "fortune"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 72,
    "gender": "all",
    "queryKeywords": [
      "时柱",
      "流年",
      "大运"
    ],
    "trigger": {
      "featuresAny": [
        "时柱",
        "流年",
        "大运"
      ]
    },
    "requires": [
      "需有对应岁运事实，且按现实阶段选择最贴近场景",
      "宫位取象需与十神、宾主、来源和当前问题交叉验证"
    ],
    "weakeningConditions": [
      "现实阶段不对应该宫位的传统人物含义",
      "宫位虽被提及但无直接作用"
    ],
    "imagery": {
      "core": [
        "时柱受岁运直接作用时，成果交付、后期安排或子女下属层更易调整"
      ],
      "positive": [
        "宫位明确时，可帮助缩小现实落点和人物范围"
      ],
      "negative": [
        "忽略宫位会把同一十神泛化到错误领域"
      ],
      "realityChecks": [
        "现实验证集中在该宫位的主要角色，不同时铺开所有类象"
      ]
    },
    "advice": [
      "回答时优先选择与年龄、问题和现实阶段最匹配的一个或两个落点"
    ],
    "prohibitions": [
      "不能把时柱冲刑直接断子女有灾"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "64-68",
        "section": "宫位、家里外边与看命顺序",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "7,44-49",
        "section": "宾主理论及宫位目录框架",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "palaces",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "palace_inner_outer",
    "title": "年月为外层、日时为内层的相对区分",
    "category": "palace",
    "domains": [
      "self",
      "career",
      "spouse",
      "wealth"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 71,
    "gender": "all",
    "queryKeywords": [
      "年月",
      "日时",
      "内外"
    ],
    "trigger": {
      "featuresAny": [
        "年月",
        "日时",
        "内外"
      ]
    },
    "requires": [
      "宾主是相对关系，还需看具体组合和来源流向",
      "宫位取象需与十神、宾主、来源和当前问题交叉验证"
    ],
    "weakeningConditions": [
      "现实阶段不对应该宫位的传统人物含义",
      "宫位虽被提及但无直接作用"
    ],
    "imagery": {
      "core": [
        "年月更偏外层来源和环境，日时更偏命主可直接承接的家内与结果层"
      ],
      "positive": [
        "宫位明确时，可帮助缩小现实落点和人物范围"
      ],
      "negative": [
        "忽略宫位会把同一十神泛化到错误领域"
      ],
      "realityChecks": [
        "现实验证集中在该宫位的主要角色，不同时铺开所有类象"
      ]
    },
    "advice": [
      "回答时优先选择与年龄、问题和现实阶段最匹配的一个或两个落点"
    ],
    "prohibitions": [
      "不能把年月一律视为别人、日时一律视为自己"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "64-68",
        "section": "宫位、家里外边与看命顺序",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "7,44-49",
        "section": "宾主理论及宫位目录框架",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "palaces",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "palace_near_far",
    "title": "宫位远近与事情显现距离",
    "category": "palace",
    "domains": [
      "movement",
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
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 70,
    "gender": "all",
    "queryKeywords": [
      "远近",
      "年月日时"
    ],
    "trigger": {
      "featuresAny": [
        "远近",
        "年月日时"
      ]
    },
    "requires": [
      "距离只是相对象，仍受合冲和现实背景影响",
      "宫位取象需与十神、宾主、来源和当前问题交叉验证"
    ],
    "weakeningConditions": [
      "现实阶段不对应该宫位的传统人物含义",
      "宫位虽被提及但无直接作用"
    ],
    "imagery": {
      "core": [
        "年柱较远、月柱为主要环境、日柱贴身、时柱偏后续，可辅助判断资源和人物距离"
      ],
      "positive": [
        "宫位明确时，可帮助缩小现实落点和人物范围"
      ],
      "negative": [
        "忽略宫位会把同一十神泛化到错误领域"
      ],
      "realityChecks": [
        "现实验证集中在该宫位的主要角色，不同时铺开所有类象"
      ]
    },
    "advice": [
      "回答时优先选择与年龄、问题和现实阶段最匹配的一个或两个落点"
    ],
    "prohibitions": [
      "不能据此锁定地理距离或年龄差"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "64-68",
        "section": "宫位、家里外边与看命顺序",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "7,44-49",
        "section": "宾主理论及宫位目录框架",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "palaces",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "palace_palace_transit",
    "title": "岁运引动宫位不等于事件自动发生",
    "category": "palace",
    "domains": [
      "self",
      "career",
      "spouse",
      "parents",
      "children",
      "wealth",
      "movement"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 72,
    "gender": "all",
    "queryKeywords": [
      "宫位",
      "引动",
      "岁运"
    ],
    "trigger": {
      "featuresAny": [
        "宫位",
        "引动",
        "岁运"
      ]
    },
    "requires": [
      "至少再有一条独立依据并考虑大运背景",
      "宫位取象需与十神、宾主、来源和当前问题交叉验证"
    ],
    "weakeningConditions": [
      "现实阶段不对应该宫位的传统人物含义",
      "宫位虽被提及但无直接作用"
    ],
    "imagery": {
      "core": [
        "岁运触及宫位说明该领域主题被强调，具体事件还需十神、做功与现实条件汇合"
      ],
      "positive": [
        "宫位明确时，可帮助缩小现实落点和人物范围"
      ],
      "negative": [
        "忽略宫位会把同一十神泛化到错误领域"
      ],
      "realityChecks": [
        "现实验证集中在该宫位的主要角色，不同时铺开所有类象"
      ]
    },
    "advice": [
      "回答时优先选择与年龄、问题和现实阶段最匹配的一个或两个落点"
    ],
    "prohibitions": [
      "不能单凭引动宫位就断升职、婚变、搬家或生育"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "64-68",
        "section": "宫位、家里外边与看命顺序",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "7,44-49",
        "section": "宾主理论及宫位目录框架",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "palaces",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "ghbu_guest_host_relative",
    "title": "宾主是相对关系，不是固定标签",
    "category": "guest_host",
    "domains": [
      "self",
      "career",
      "wealth",
      "spouse"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 80,
    "gender": "all",
    "queryKeywords": [
      "宾主",
      "主位",
      "宾位"
    ],
    "trigger": {
      "featuresAny": [
        "宾主",
        "主位",
        "宾位"
      ]
    },
    "requires": [
      "同一字在不同问题中宾主属性可能变化",
      "同时核对宫位、根气、十神和作用方向"
    ],
    "weakeningConditions": [
      "宾主中心未定义",
      "来源或作用链条不完整"
    ],
    "imagery": {
      "core": [
        "先确定以谁为中心、要分析什么对象，再区分主位与宾位"
      ],
      "positive": [
        "结构清楚时，可显著提升取象的归属和现实落点准确度"
      ],
      "negative": [
        "忽略宾主体用容易把别人的资源、命主的付出和现实结果混在一起"
      ],
      "realityChecks": [
        "能否用一句话说明谁的资源、通过什么方式、落到哪里"
      ]
    },
    "advice": [
      "在AI回答中优先写清来源、作用方向和承接结果"
    ],
    "prohibitions": [
      "不能把某柱永久标记为宾或主"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "64-75",
        "section": "体用、宾主、家里外边、财官来源",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "44-49,73-81",
        "section": "宾主理论与预测用语目录框架",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "guest-host-body-use",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "ghbu_inside_outside_flow",
    "title": "家里与外边看资源流向",
    "category": "guest_host",
    "domains": [
      "wealth",
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
    "priority": 79,
    "gender": "all",
    "queryKeywords": [
      "家里",
      "外边",
      "流向"
    ],
    "trigger": {
      "featuresAny": [
        "家里",
        "外边",
        "流向"
      ]
    },
    "requires": [
      "需确认生克合制的实际方向",
      "同时核对宫位、根气、十神和作用方向"
    ],
    "weakeningConditions": [
      "宾主中心未定义",
      "来源或作用链条不完整"
    ],
    "imagery": {
      "core": [
        "资源从外层进入主位，侧重取得和承接；从主位流向外层，侧重付出、输出或被外部调用"
      ],
      "positive": [
        "结构清楚时，可显著提升取象的归属和现实落点准确度"
      ],
      "negative": [
        "忽略宾主体用容易把别人的资源、命主的付出和现实结果混在一起"
      ],
      "realityChecks": [
        "能否用一句话说明谁的资源、通过什么方式、落到哪里"
      ]
    },
    "advice": [
      "在AI回答中优先写清来源、作用方向和承接结果"
    ],
    "prohibitions": [
      "不能只凭位置判断资源属于谁"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "64-75",
        "section": "体用、宾主、家里外边、财官来源",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "44-49,73-81",
        "section": "宾主理论与预测用语目录框架",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "guest-host-body-use",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "ghbu_ownership_source",
    "title": "十神来源决定归属",
    "category": "guest_host",
    "domains": [
      "wealth",
      "career",
      "spouse",
      "parents"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 78,
    "gender": "all",
    "queryKeywords": [
      "来源",
      "出处",
      "归属"
    ],
    "trigger": {
      "featuresAny": [
        "来源",
        "出处",
        "归属"
      ]
    },
    "requires": [
      "需要明确根基和连接链条",
      "同时核对宫位、根气、十神和作用方向"
    ],
    "weakeningConditions": [
      "宾主中心未定义",
      "来源或作用链条不完整"
    ],
    "imagery": {
      "core": [
        "同一财官印食要追查从哪个根、库、宫位或天干而来，来源影响人物和资源归属"
      ],
      "positive": [
        "结构清楚时，可显著提升取象的归属和现实落点准确度"
      ],
      "negative": [
        "忽略宾主体用容易把别人的资源、命主的付出和现实结果混在一起"
      ],
      "realityChecks": [
        "能否用一句话说明谁的资源、通过什么方式、落到哪里"
      ]
    },
    "advice": [
      "在AI回答中优先写清来源、作用方向和承接结果"
    ],
    "prohibitions": [
      "不能看到财官就默认归命主所有"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "64-75",
        "section": "体用、宾主、家里外边、财官来源",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "44-49,73-81",
        "section": "宾主理论与预测用语目录框架",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "guest-host-body-use",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "ghbu_body_definition",
    "title": "体是命主可调用的能力与工具",
    "category": "guest_host",
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
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 77,
    "gender": "all",
    "queryKeywords": [
      "体",
      "日主",
      "禄",
      "印比"
    ],
    "trigger": {
      "featuresAny": [
        "体",
        "日主",
        "禄",
        "印比"
      ]
    },
    "requires": [
      "先判断是否连体、得根和真正归命主",
      "同时核对宫位、根气、十神和作用方向"
    ],
    "weakeningConditions": [
      "宾主中心未定义",
      "来源或作用链条不完整"
    ],
    "imagery": {
      "core": [
        "体通常包括日主、禄、比劫、印、食伤等可被命主调用的部分，但需结合具体体系与组合"
      ],
      "positive": [
        "结构清楚时，可显著提升取象的归属和现实落点准确度"
      ],
      "negative": [
        "忽略宾主体用容易把别人的资源、命主的付出和现实结果混在一起"
      ],
      "realityChecks": [
        "能否用一句话说明谁的资源、通过什么方式、落到哪里"
      ]
    },
    "advice": [
      "在AI回答中优先写清来源、作用方向和承接结果"
    ],
    "prohibitions": [
      "不能把所有印比食伤机械视为有力之体"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "64-75",
        "section": "体用、宾主、家里外边、财官来源",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "44-49,73-81",
        "section": "宾主理论与预测用语目录框架",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "guest-host-body-use",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "ghbu_use_definition",
    "title": "用是命主所求或要处理的目标",
    "category": "guest_host",
    "domains": [
      "career",
      "wealth",
      "spouse"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 76,
    "gender": "all",
    "queryKeywords": [
      "用",
      "财官",
      "目标"
    ],
    "trigger": {
      "featuresAny": [
        "用",
        "财官",
        "目标"
      ]
    },
    "requires": [
      "必须先确定问题领域和做功目的",
      "同时核对宫位、根气、十神和作用方向"
    ],
    "weakeningConditions": [
      "宾主中心未定义",
      "来源或作用链条不完整"
    ],
    "imagery": {
      "core": [
        "财官常作为所求之用，其他十神在具体结构中也可成为要处理的目标"
      ],
      "positive": [
        "结构清楚时，可显著提升取象的归属和现实落点准确度"
      ],
      "negative": [
        "忽略宾主体用容易把别人的资源、命主的付出和现实结果混在一起"
      ],
      "realityChecks": [
        "能否用一句话说明谁的资源、通过什么方式、落到哪里"
      ]
    },
    "advice": [
      "在AI回答中优先写清来源、作用方向和承接结果"
    ],
    "prohibitions": [
      "不能固定认为财官永远为喜、体永远为好"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "64-75",
        "section": "体用、宾主、家里外边、财官来源",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "44-49,73-81",
        "section": "宾主理论与预测用语目录框架",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "guest-host-body-use",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "ghbu_body_use_capacity",
    "title": "体能否承载用决定层次",
    "category": "guest_host",
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
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 80,
    "gender": "all",
    "queryKeywords": [
      "承载",
      "体用",
      "层次"
    ],
    "trigger": {
      "featuresAny": [
        "承载",
        "体用",
        "层次"
      ]
    },
    "requires": [
      "需比较力量、位置和制化链条",
      "同时核对宫位、根气、十神和作用方向"
    ],
    "weakeningConditions": [
      "宾主中心未定义",
      "来源或作用链条不完整"
    ],
    "imagery": {
      "core": [
        "用大而体弱时可能机会大但承接吃力；体有力而用可得时更易把资源转为成果"
      ],
      "positive": [
        "结构清楚时，可显著提升取象的归属和现实落点准确度"
      ],
      "negative": [
        "忽略宾主体用容易把别人的资源、命主的付出和现实结果混在一起"
      ],
      "realityChecks": [
        "能否用一句话说明谁的资源、通过什么方式、落到哪里"
      ]
    },
    "advice": [
      "在AI回答中优先写清来源、作用方向和承接结果"
    ],
    "prohibitions": [
      "不能以用多直接断财富或职位高"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "64-75",
        "section": "体用、宾主、家里外边、财官来源",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "44-49,73-81",
        "section": "宾主理论与预测用语目录框架",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "guest-host-body-use",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "ghbu_body_use_efficiency",
    "title": "做功能力与效率分开",
    "category": "guest_host",
    "domains": [
      "career",
      "wealth"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 79,
    "gender": "all",
    "queryKeywords": [
      "做功",
      "效率",
      "力量"
    ],
    "trigger": {
      "featuresAny": [
        "做功",
        "效率",
        "力量"
      ]
    },
    "requires": [
      "核对是否有多层绕行和重复消耗",
      "同时核对宫位、根气、十神和作用方向"
    ],
    "weakeningConditions": [
      "宾主中心未定义",
      "来源或作用链条不完整"
    ],
    "imagery": {
      "core": [
        "结构存在做功不等于效率高，需看直接性、力量、距离、损耗与反制"
      ],
      "positive": [
        "结构清楚时，可显著提升取象的归属和现实落点准确度"
      ],
      "negative": [
        "忽略宾主体用容易把别人的资源、命主的付出和现实结果混在一起"
      ],
      "realityChecks": [
        "能否用一句话说明谁的资源、通过什么方式、落到哪里"
      ]
    },
    "advice": [
      "在AI回答中优先写清来源、作用方向和承接结果"
    ],
    "prohibitions": [
      "不能只见合克生泄就断成事"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "64-75",
        "section": "体用、宾主、家里外边、财官来源",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "44-49,73-81",
        "section": "宾主理论与预测用语目录框架",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "guest-host-body-use",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "ghbu_guest_to_host",
    "title": "宾位资源进入主位",
    "category": "guest_host",
    "domains": [
      "career",
      "wealth",
      "spouse"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 78,
    "gender": "all",
    "queryKeywords": [
      "宾位",
      "主位",
      "进入"
    ],
    "trigger": {
      "featuresAny": [
        "宾位",
        "主位",
        "进入"
      ]
    },
    "requires": [
      "需要确认路径完整且命主承载得住",
      "同时核对宫位、根气、十神和作用方向"
    ],
    "weakeningConditions": [
      "宾主中心未定义",
      "来源或作用链条不完整"
    ],
    "imagery": {
      "core": [
        "外层财官或资源通过生、合、制、库等路径进入主位，可作为取得资源的候选象"
      ],
      "positive": [
        "结构清楚时，可显著提升取象的归属和现实落点准确度"
      ],
      "negative": [
        "忽略宾主体用容易把别人的资源、命主的付出和现实结果混在一起"
      ],
      "realityChecks": [
        "能否用一句话说明谁的资源、通过什么方式、落到哪里"
      ]
    },
    "advice": [
      "在AI回答中优先写清来源、作用方向和承接结果"
    ],
    "prohibitions": [
      "不能直接断得到具体钱、职位或对象"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "64-75",
        "section": "体用、宾主、家里外边、财官来源",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "44-49,73-81",
        "section": "宾主理论与预测用语目录框架",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "guest-host-body-use",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "ghbu_host_to_guest",
    "title": "主位力量作用宾位",
    "category": "guest_host",
    "domains": [
      "career",
      "wealth",
      "friends"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 77,
    "gender": "all",
    "queryKeywords": [
      "主位",
      "宾位",
      "作用"
    ],
    "trigger": {
      "featuresAny": [
        "主位",
        "宾位",
        "作用"
      ]
    },
    "requires": [
      "需看是否有回流和报酬承接",
      "同时核对宫位、根气、十神和作用方向"
    ],
    "weakeningConditions": [
      "宾主中心未定义",
      "来源或作用链条不完整"
    ],
    "imagery": {
      "core": [
        "命主的体向外作用，常体现输出、服务、管理、交易或为外部环境做功"
      ],
      "positive": [
        "结构清楚时，可显著提升取象的归属和现实落点准确度"
      ],
      "negative": [
        "忽略宾主体用容易把别人的资源、命主的付出和现实结果混在一起"
      ],
      "realityChecks": [
        "能否用一句话说明谁的资源、通过什么方式、落到哪里"
      ]
    },
    "advice": [
      "在AI回答中优先写清来源、作用方向和承接结果"
    ],
    "prohibitions": [
      "不能把对外付出直接断为吃亏或发财"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "64-75",
        "section": "体用、宾主、家里外边、财官来源",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "44-49,73-81",
        "section": "宾主理论与预测用语目录框架",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "guest-host-body-use",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "ghbu_direct_indirect",
    "title": "直接做功与间接做功",
    "category": "guest_host",
    "domains": [
      "career",
      "wealth"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 76,
    "gender": "all",
    "queryKeywords": [
      "直接",
      "间接",
      "做功"
    ],
    "trigger": {
      "featuresAny": [
        "直接",
        "间接",
        "做功"
      ]
    },
    "requires": [
      "判断链条是否连续、是否被截断",
      "同时核对宫位、根气、十神和作用方向"
    ],
    "weakeningConditions": [
      "宾主中心未定义",
      "来源或作用链条不完整"
    ],
    "imagery": {
      "core": [
        "直接作用通常更清楚快速；经多层生化或中介作用则更依赖环境和条件"
      ],
      "positive": [
        "结构清楚时，可显著提升取象的归属和现实落点准确度"
      ],
      "negative": [
        "忽略宾主体用容易把别人的资源、命主的付出和现实结果混在一起"
      ],
      "realityChecks": [
        "能否用一句话说明谁的资源、通过什么方式、落到哪里"
      ]
    },
    "advice": [
      "在AI回答中优先写清来源、作用方向和承接结果"
    ],
    "prohibitions": [
      "不能简单认为直接一定好、间接一定差"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "64-75",
        "section": "体用、宾主、家里外边、财官来源",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "44-49,73-81",
        "section": "宾主理论与预测用语目录框架",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "guest-host-body-use",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "ghbu_inner_party",
    "title": "内党作为命主一侧的协同结构",
    "category": "guest_host",
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
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 80,
    "gender": "all",
    "queryKeywords": [
      "内党",
      "我方",
      "协同"
    ],
    "trigger": {
      "featuresAny": [
        "内党",
        "我方",
        "协同"
      ]
    },
    "requires": [
      "必须排除表面同党实际争夺或反制",
      "同时核对宫位、根气、十神和作用方向"
    ],
    "weakeningConditions": [
      "宾主中心未定义",
      "来源或作用链条不完整"
    ],
    "imagery": {
      "core": [
        "与命主同一侧、共同作用目标的干支可形成协同，但需确认是否真正连体和同向"
      ],
      "positive": [
        "结构清楚时，可显著提升取象的归属和现实落点准确度"
      ],
      "negative": [
        "忽略宾主体用容易把别人的资源、命主的付出和现实结果混在一起"
      ],
      "realityChecks": [
        "能否用一句话说明谁的资源、通过什么方式、落到哪里"
      ]
    },
    "advice": [
      "在AI回答中优先写清来源、作用方向和承接结果"
    ],
    "prohibitions": [
      "不能把同五行直接视为内党"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "64-75",
        "section": "体用、宾主、家里外边、财官来源",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "44-49,73-81",
        "section": "宾主理论与预测用语目录框架",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "guest-host-body-use",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "ghbu_outer_party",
    "title": "外党作为目标或环境一侧",
    "category": "guest_host",
    "domains": [
      "career",
      "wealth",
      "spouse"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 79,
    "gender": "all",
    "queryKeywords": [
      "外党",
      "对方",
      "环境"
    ],
    "trigger": {
      "featuresAny": [
        "外党",
        "对方",
        "环境"
      ]
    },
    "requires": [
      "结合宾主和来源判断",
      "同时核对宫位、根气、十神和作用方向"
    ],
    "weakeningConditions": [
      "宾主中心未定义",
      "来源或作用链条不完整"
    ],
    "imagery": {
      "core": [
        "外党可代表被处理的目标、外部规则、资源或对方一侧，需看是否进入主位"
      ],
      "positive": [
        "结构清楚时，可显著提升取象的归属和现实落点准确度"
      ],
      "negative": [
        "忽略宾主体用容易把别人的资源、命主的付出和现实结果混在一起"
      ],
      "realityChecks": [
        "能否用一句话说明谁的资源、通过什么方式、落到哪里"
      ]
    },
    "advice": [
      "在AI回答中优先写清来源、作用方向和承接结果"
    ],
    "prohibitions": [
      "不能把外党直接视为敌人或坏事"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "64-75",
        "section": "体用、宾主、家里外边、财官来源",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "44-49,73-81",
        "section": "宾主理论与预测用语目录框架",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "guest-host-body-use",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "ghbu_rope_cow",
    "title": "绳子与牛：控制关系与被控制对象",
    "category": "guest_host",
    "domains": [
      "career",
      "wealth",
      "spouse"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 78,
    "gender": "all",
    "queryKeywords": [
      "绳子",
      "牛",
      "控制"
    ],
    "trigger": {
      "featuresAny": [
        "绳子",
        "牛",
        "控制"
      ]
    },
    "requires": [
      "需有明确制、合、穿、冲等作用链",
      "同时核对宫位、根气、十神和作用方向"
    ],
    "weakeningConditions": [
      "宾主中心未定义",
      "来源或作用链条不完整"
    ],
    "imagery": {
      "core": [
        "功神像绳子，用神像被牵引的目标，重点看谁控制谁、控制是否有效"
      ],
      "positive": [
        "结构清楚时，可显著提升取象的归属和现实落点准确度"
      ],
      "negative": [
        "忽略宾主体用容易把别人的资源、命主的付出和现实结果混在一起"
      ],
      "realityChecks": [
        "能否用一句话说明谁的资源、通过什么方式、落到哪里"
      ]
    },
    "advice": [
      "在AI回答中优先写清来源、作用方向和承接结果"
    ],
    "prohibitions": [
      "不能把比喻当作现实人物事实"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "64-75",
        "section": "体用、宾主、家里外边、财官来源",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "44-49,73-81",
        "section": "宾主理论与预测用语目录框架",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "guest-host-body-use",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "ghbu_source_to_result",
    "title": "来源—作用—结果链",
    "category": "guest_host",
    "domains": [
      "career",
      "wealth",
      "spouse",
      "parents"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 77,
    "gender": "all",
    "queryKeywords": [
      "来源",
      "作用",
      "结果"
    ],
    "trigger": {
      "featuresAny": [
        "来源",
        "作用",
        "结果"
      ]
    },
    "requires": [
      "链条任一环缺失时降低结论强度",
      "同时核对宫位、根气、十神和作用方向"
    ],
    "weakeningConditions": [
      "宾主中心未定义",
      "来源或作用链条不完整"
    ],
    "imagery": {
      "core": [
        "完整取象需说明资源从哪里来、通过什么方式作用、最后落到哪个宫位或成果"
      ],
      "positive": [
        "结构清楚时，可显著提升取象的归属和现实落点准确度"
      ],
      "negative": [
        "忽略宾主体用容易把别人的资源、命主的付出和现实结果混在一起"
      ],
      "realityChecks": [
        "能否用一句话说明谁的资源、通过什么方式、落到哪里"
      ]
    },
    "advice": [
      "在AI回答中优先写清来源、作用方向和承接结果"
    ],
    "prohibitions": [
      "不能只说有财官而省略取得方式"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "64-75",
        "section": "体用、宾主、家里外边、财官来源",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "44-49,73-81",
        "section": "宾主理论与预测用语目录框架",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "guest-host-body-use",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "ghbu_body_use_transit",
    "title": "岁运改变体用力量但不改原局归属",
    "category": "guest_host",
    "domains": [
      "career",
      "wealth",
      "spouse"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 76,
    "gender": "all",
    "queryKeywords": [
      "大运",
      "流年",
      "体用"
    ],
    "trigger": {
      "featuresAny": [
        "大运",
        "流年",
        "体用"
      ]
    },
    "requires": [
      "按大运背景与流年触发分层",
      "同时核对宫位、根气、十神和作用方向"
    ],
    "weakeningConditions": [
      "宾主中心未定义",
      "来源或作用链条不完整"
    ],
    "imagery": {
      "core": [
        "岁运可增强、削弱、引动或暂时替代体用角色，但原局的根本归属和底色仍需保留"
      ],
      "positive": [
        "结构清楚时，可显著提升取象的归属和现实落点准确度"
      ],
      "negative": [
        "忽略宾主体用容易把别人的资源、命主的付出和现实结果混在一起"
      ],
      "realityChecks": [
        "能否用一句话说明谁的资源、通过什么方式、落到哪里"
      ]
    },
    "advice": [
      "在AI回答中优先写清来源、作用方向和承接结果"
    ],
    "prohibitions": [
      "不能把流年一个字永久改写原局结构"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "64-75",
        "section": "体用、宾主、家里外边、财官来源",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "44-49,73-81",
        "section": "宾主理论与预测用语目录框架",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "guest-host-body-use",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "work_control_direct",
    "title": "正制：体直接制用",
    "category": "work_method",
    "domains": [
      "career",
      "wealth"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 79,
    "gender": "all",
    "queryKeywords": [
      "正制",
      "制用",
      "克制"
    ],
    "trigger": {
      "featuresAny": [
        "正制",
        "制用",
        "克制"
      ]
    },
    "requires": [
      "体与用的归属明确，制得住且不伤自身根基",
      "同时核对宾主、体用、根气和宫位"
    ],
    "weakeningConditions": [
      "作用链条中间被截断",
      "参与者无根、归属不清或力量严重失衡"
    ],
    "imagery": {
      "core": [
        "命主一侧的体直接克制、管理或筛选目标之用，成败看力量、距离和反制"
      ],
      "positive": [
        "做功有效时，命主更容易把结构能力转成现实成果"
      ],
      "negative": [
        "做功失效或反制时，容易出现成本、压力、返工或资源流失"
      ],
      "realityChecks": [
        "用一句话说明谁通过什么方式取得或处理什么目标"
      ]
    },
    "advice": [
      "现实建议对应做功方式：制用重边界，化用重承接，生泄重输出，合用重协议，墓用重释放条件"
    ],
    "prohibitions": [
      "不能把任何相克都写成制用成功"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "77-186",
        "section": "做工与制化结构",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "50-72",
        "section": "制用、化用、生泄用、合用、墓用目录框架",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "work-methods",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "work_control_reverse",
    "title": "反制：目标反过来制体",
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
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 78,
    "gender": "all",
    "queryKeywords": [
      "反制",
      "制用",
      "被制"
    ],
    "trigger": {
      "featuresAny": [
        "反制",
        "制用",
        "被制"
      ]
    },
    "requires": [
      "确认作用方向和谁强谁弱",
      "同时核对宾主、体用、根气和宫位"
    ],
    "weakeningConditions": [
      "作用链条中间被截断",
      "参与者无根、归属不清或力量严重失衡"
    ],
    "imagery": {
      "core": [
        "原本要处理的目标反而制约命主之体，常体现压力、受控、成本上升或能力被限制"
      ],
      "positive": [
        "做功有效时，命主更容易把结构能力转成现实成果"
      ],
      "negative": [
        "做功失效或反制时，容易出现成本、压力、返工或资源流失"
      ],
      "realityChecks": [
        "用一句话说明谁通过什么方式取得或处理什么目标"
      ]
    },
    "advice": [
      "现实建议对应做功方式：制用重边界，化用重承接，生泄重输出，合用重协议，墓用重释放条件"
    ],
    "prohibitions": [
      "不能只因被克就断失败或灾祸"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "77-186",
        "section": "做工与制化结构",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "50-72",
        "section": "制用、化用、生泄用、合用、墓用目录框架",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "work-methods",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "work_control_balance",
    "title": "制净与制过",
    "category": "work_method",
    "domains": [
      "career",
      "wealth"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 77,
    "gender": "all",
    "queryKeywords": [
      "制净",
      "制过",
      "制衡"
    ],
    "trigger": {
      "featuresAny": [
        "制净",
        "制过",
        "制衡"
      ]
    },
    "requires": [
      "检查用是否仍有可用价值和回流",
      "同时核对宾主、体用、根气和宫位"
    ],
    "weakeningConditions": [
      "作用链条中间被截断",
      "参与者无根、归属不清或力量严重失衡"
    ],
    "imagery": {
      "core": [
        "制用需有度；制得恰当可提高效率，过制则可能把资源、角色或通道一并破坏"
      ],
      "positive": [
        "做功有效时，命主更容易把结构能力转成现实成果"
      ],
      "negative": [
        "做功失效或反制时，容易出现成本、压力、返工或资源流失"
      ],
      "realityChecks": [
        "用一句话说明谁通过什么方式取得或处理什么目标"
      ]
    },
    "advice": [
      "现实建议对应做功方式：制用重边界，化用重承接，生泄重输出，合用重协议，墓用重释放条件"
    ],
    "prohibitions": [
      "不能把制得越尽越好作为通则"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "77-186",
        "section": "做工与制化结构",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "50-72",
        "section": "制用、化用、生泄用、合用、墓用目录框架",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "work-methods",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "work_transform_official_resource",
    "title": "官杀生印化用",
    "category": "work_method",
    "domains": [
      "career",
      "self"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 76,
    "gender": "all",
    "queryKeywords": [
      "官印相生",
      "化用",
      "官杀生印"
    ],
    "trigger": {
      "featuresAny": [
        "官印相生",
        "化用",
        "官杀生印"
      ]
    },
    "requires": [
      "官杀、印、日主链条连续且印不为过度负担",
      "同时核对宾主、体用、根气和宫位"
    ],
    "weakeningConditions": [
      "作用链条中间被截断",
      "参与者无根、归属不清或力量严重失衡"
    ],
    "imagery": {
      "core": [
        "压力、规则或职位通过印星转化为学习、资质、平台和承接能力"
      ],
      "positive": [
        "做功有效时，命主更容易把结构能力转成现实成果"
      ],
      "negative": [
        "做功失效或反制时，容易出现成本、压力、返工或资源流失"
      ],
      "realityChecks": [
        "用一句话说明谁通过什么方式取得或处理什么目标"
      ]
    },
    "advice": [
      "现实建议对应做功方式：制用重边界，化用重承接，生泄重输出，合用重协议，墓用重释放条件"
    ],
    "prohibitions": [
      "不能仅见官印同现就定官印相生格"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "77-186",
        "section": "做工与制化结构",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "50-72",
        "section": "制用、化用、生泄用、合用、墓用目录框架",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "work-methods",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "work_transform_output_wealth",
    "title": "食伤生财化用",
    "category": "work_method",
    "domains": [
      "career",
      "wealth"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 79,
    "gender": "all",
    "queryKeywords": [
      "食伤生财",
      "化用"
    ],
    "trigger": {
      "featuresAny": [
        "食伤生财",
        "化用"
      ]
    },
    "requires": [
      "食伤与财有真实连接，财能被命主承接",
      "同时核对宾主、体用、根气和宫位"
    ],
    "weakeningConditions": [
      "作用链条中间被截断",
      "参与者无根、归属不清或力量严重失衡"
    ],
    "imagery": {
      "core": [
        "技能、表达、产品或服务通过财星转为市场回报和现实资源"
      ],
      "positive": [
        "做功有效时，命主更容易把结构能力转成现实成果"
      ],
      "negative": [
        "做功失效或反制时，容易出现成本、压力、返工或资源流失"
      ],
      "realityChecks": [
        "用一句话说明谁通过什么方式取得或处理什么目标"
      ]
    },
    "advice": [
      "现实建议对应做功方式：制用重边界，化用重承接，生泄重输出，合用重协议，墓用重释放条件"
    ],
    "prohibitions": [
      "不能只见食伤财星就断赚钱"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "77-186",
        "section": "做工与制化结构",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "50-72",
        "section": "制用、化用、生泄用、合用、墓用目录框架",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "work-methods",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "work_transform_wealth_official",
    "title": "财生官的责任转换",
    "category": "work_method",
    "domains": [
      "career",
      "wealth"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 78,
    "gender": "all",
    "queryKeywords": [
      "财生官",
      "化用"
    ],
    "trigger": {
      "featuresAny": [
        "财生官",
        "化用"
      ]
    },
    "requires": [
      "财官链条有效且官不成为无法承受的压力",
      "同时核对宾主、体用、根气和宫位"
    ],
    "weakeningConditions": [
      "作用链条中间被截断",
      "参与者无根、归属不清或力量严重失衡"
    ],
    "imagery": {
      "core": [
        "现实资源、项目或关系进一步转为责任、职位、规则或正式身份"
      ],
      "positive": [
        "做功有效时，命主更容易把结构能力转成现实成果"
      ],
      "negative": [
        "做功失效或反制时，容易出现成本、压力、返工或资源流失"
      ],
      "realityChecks": [
        "用一句话说明谁通过什么方式取得或处理什么目标"
      ]
    },
    "advice": [
      "现实建议对应做功方式：制用重边界，化用重承接，生泄重输出，合用重协议，墓用重释放条件"
    ],
    "prohibitions": [
      "不能把财生官直接断升职"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "77-186",
        "section": "做工与制化结构",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "50-72",
        "section": "制用、化用、生泄用、合用、墓用目录框架",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "work-methods",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "work_generate_use",
    "title": "生用：持续供给目标",
    "category": "work_method",
    "domains": [
      "career",
      "wealth",
      "spouse"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 77,
    "gender": "all",
    "queryKeywords": [
      "生用",
      "相生"
    ],
    "trigger": {
      "featuresAny": [
        "生用",
        "相生"
      ]
    },
    "requires": [
      "生扶方向、来源和回流明确",
      "同时核对宾主、体用、根气和宫位"
    ],
    "weakeningConditions": [
      "作用链条中间被截断",
      "参与者无根、归属不清或力量严重失衡"
    ],
    "imagery": {
      "core": [
        "命主一侧持续生扶目标，常体现投入、培养、服务、生产或资源供给"
      ],
      "positive": [
        "做功有效时，命主更容易把结构能力转成现实成果"
      ],
      "negative": [
        "做功失效或反制时，容易出现成本、压力、返工或资源流失"
      ],
      "realityChecks": [
        "用一句话说明谁通过什么方式取得或处理什么目标"
      ]
    },
    "advice": [
      "现实建议对应做功方式：制用重边界，化用重承接，生泄重输出，合用重协议，墓用重释放条件"
    ],
    "prohibitions": [
      "不能把单向付出自动视为有收益"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "77-186",
        "section": "做工与制化结构",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "50-72",
        "section": "制用、化用、生泄用、合用、墓用目录框架",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "work-methods",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "work_discharge_use",
    "title": "泄用：通过输出释放体能",
    "category": "work_method",
    "domains": [
      "career",
      "self",
      "wealth"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 76,
    "gender": "all",
    "queryKeywords": [
      "泄用",
      "食伤",
      "输出"
    ],
    "trigger": {
      "featuresAny": [
        "泄用",
        "食伤",
        "输出"
      ]
    },
    "requires": [
      "体确有可泄之力，输出通道未被堵塞",
      "同时核对宾主、体用、根气和宫位"
    ],
    "weakeningConditions": [
      "作用链条中间被截断",
      "参与者无根、归属不清或力量严重失衡"
    ],
    "imagery": {
      "core": [
        "旺体通过食伤、作品、服务或表达释放，形成成果和社会接口"
      ],
      "positive": [
        "做功有效时，命主更容易把结构能力转成现实成果"
      ],
      "negative": [
        "做功失效或反制时，容易出现成本、压力、返工或资源流失"
      ],
      "realityChecks": [
        "用一句话说明谁通过什么方式取得或处理什么目标"
      ]
    },
    "advice": [
      "现实建议对应做功方式：制用重边界，化用重承接，生泄重输出，合用重协议，墓用重释放条件"
    ],
    "prohibitions": [
      "不能把泄气一律视为弱化或好事"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "77-186",
        "section": "做工与制化结构",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "50-72",
        "section": "制用、化用、生泄用、合用、墓用目录框架",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "work-methods",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "work_detail_combine_use",
    "title": "合用：通过连接取得或绑定目标",
    "category": "work_method",
    "domains": [
      "career",
      "wealth",
      "spouse"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 79,
    "gender": "all",
    "queryKeywords": [
      "合用",
      "五合",
      "六合"
    ],
    "trigger": {
      "featuresAny": [
        "合用",
        "五合",
        "六合"
      ]
    },
    "requires": [
      "合的双方归属明确，且不存在严重争合、合绊或被冲破",
      "同时核对宾主、体用、根气和宫位"
    ],
    "weakeningConditions": [
      "作用链条中间被截断",
      "参与者无根、归属不清或力量严重失衡"
    ],
    "imagery": {
      "core": [
        "通过合、协议、合作或身份绑定让目标进入命主可承接范围"
      ],
      "positive": [
        "做功有效时，命主更容易把结构能力转成现实成果"
      ],
      "negative": [
        "做功失效或反制时，容易出现成本、压力、返工或资源流失"
      ],
      "realityChecks": [
        "用一句话说明谁通过什么方式取得或处理什么目标"
      ]
    },
    "advice": [
      "现实建议对应做功方式：制用重边界，化用重承接，生泄重输出，合用重协议，墓用重释放条件"
    ],
    "prohibitions": [
      "不能把合用直接等同于成功取得"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "77-186",
        "section": "做工与制化结构",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "50-72",
        "section": "制用、化用、生泄用、合用、墓用目录框架",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "work-methods",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "work_combine_binding",
    "title": "合绊：连接同时限制行动",
    "category": "work_method",
    "domains": [
      "career",
      "spouse",
      "self"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 78,
    "gender": "all",
    "queryKeywords": [
      "合绊",
      "被合",
      "牵制"
    ],
    "trigger": {
      "featuresAny": [
        "合绊",
        "被合",
        "牵制"
      ]
    },
    "requires": [
      "判断谁被合、是否失去原有作用以及是否有解合",
      "同时核对宾主、体用、根气和宫位"
    ],
    "weakeningConditions": [
      "作用链条中间被截断",
      "参与者无根、归属不清或力量严重失衡"
    ],
    "imagery": {
      "core": [
        "合可建立连接，也可能使某一功能被牵住、注意力分散或行动减慢"
      ],
      "positive": [
        "做功有效时，命主更容易把结构能力转成现实成果"
      ],
      "negative": [
        "做功失效或反制时，容易出现成本、压力、返工或资源流失"
      ],
      "realityChecks": [
        "用一句话说明谁通过什么方式取得或处理什么目标"
      ]
    },
    "advice": [
      "现实建议对应做功方式：制用重边界，化用重承接，生泄重输出，合用重协议，墓用重释放条件"
    ],
    "prohibitions": [
      "不能只写合好或合坏"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "77-186",
        "section": "做工与制化结构",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "50-72",
        "section": "制用、化用、生泄用、合用、墓用目录框架",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "work-methods",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "work_detail_storage_use",
    "title": "墓用：资源通过库藏取得",
    "category": "work_method",
    "domains": [
      "wealth",
      "career",
      "property"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 77,
    "gender": "all",
    "queryKeywords": [
      "墓用",
      "墓库",
      "开库"
    ],
    "trigger": {
      "featuresAny": [
        "墓用",
        "墓库",
        "开库"
      ]
    },
    "requires": [
      "库中确有目标藏干且命主有取得路径",
      "同时核对宾主、体用、根气和宫位"
    ],
    "weakeningConditions": [
      "作用链条中间被截断",
      "参与者无根、归属不清或力量严重失衡"
    ],
    "imagery": {
      "core": [
        "财官印食等进入库藏后，需通过开库、透出、连体或岁运引动才能成为现实资源"
      ],
      "positive": [
        "做功有效时，命主更容易把结构能力转成现实成果"
      ],
      "negative": [
        "做功失效或反制时，容易出现成本、压力、返工或资源流失"
      ],
      "realityChecks": [
        "用一句话说明谁通过什么方式取得或处理什么目标"
      ]
    },
    "advice": [
      "现实建议对应做功方式：制用重边界，化用重承接，生泄重输出，合用重协议，墓用重释放条件"
    ],
    "prohibitions": [
      "不能见库就断大财或资源很多"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "77-186",
        "section": "做工与制化结构",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "50-72",
        "section": "制用、化用、生泄用、合用、墓用目录框架",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "work-methods",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "work_compound_chain",
    "title": "复合结构：多种做功串联",
    "category": "work_method",
    "domains": [
      "career",
      "wealth",
      "spouse"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 76,
    "gender": "all",
    "queryKeywords": [
      "复合结构",
      "多层做功"
    ],
    "trigger": {
      "featuresAny": [
        "复合结构",
        "多层做功"
      ]
    },
    "requires": [
      "每一段都有明确参与者和作用方向",
      "同时核对宾主、体用、根气和宫位"
    ],
    "weakeningConditions": [
      "作用链条中间被截断",
      "参与者无根、归属不清或力量严重失衡"
    ],
    "imagery": {
      "core": [
        "制、生、化、合、库等可串联形成复杂取得路径，需逐段检查是否连续"
      ],
      "positive": [
        "做功有效时，命主更容易把结构能力转成现实成果"
      ],
      "negative": [
        "做功失效或反制时，容易出现成本、压力、返工或资源流失"
      ],
      "realityChecks": [
        "用一句话说明谁通过什么方式取得或处理什么目标"
      ]
    },
    "advice": [
      "现实建议对应做功方式：制用重边界，化用重承接，生泄重输出，合用重协议，墓用重释放条件"
    ],
    "prohibitions": [
      "不能把多个关系堆叠当作多条独立证据"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "77-186",
        "section": "做工与制化结构",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "50-72",
        "section": "制用、化用、生泄用、合用、墓用目录框架",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "work-methods",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "work_root_connected_control",
    "title": "通根连体后才具备稳定制力",
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
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 79,
    "gender": "all",
    "queryKeywords": [
      "通根",
      "连体",
      "制用"
    ],
    "trigger": {
      "featuresAny": [
        "通根",
        "连体",
        "制用"
      ]
    },
    "requires": [
      "确认根、同柱、禄刃或生扶链条",
      "同时核对宾主、体用、根气和宫位"
    ],
    "weakeningConditions": [
      "作用链条中间被截断",
      "参与者无根、归属不清或力量严重失衡"
    ],
    "imagery": {
      "core": [
        "参与做功的干支若通根连体，力量和归属更稳定；无根时作用可能短暂或借力"
      ],
      "positive": [
        "做功有效时，命主更容易把结构能力转成现实成果"
      ],
      "negative": [
        "做功失效或反制时，容易出现成本、压力、返工或资源流失"
      ],
      "realityChecks": [
        "用一句话说明谁通过什么方式取得或处理什么目标"
      ]
    },
    "advice": [
      "现实建议对应做功方式：制用重边界，化用重承接，生泄重输出，合用重协议，墓用重释放条件"
    ],
    "prohibitions": [
      "不能仅凭天干相克判断制得住"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "77-186",
        "section": "做工与制化结构",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "50-72",
        "section": "制用、化用、生泄用、合用、墓用目录框架",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "work-methods",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "work_sitting_official_control",
    "title": "坐下官杀的直接压力与利用",
    "category": "work_method",
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
    "certainty": "conditional",
    "priority": 78,
    "gender": "all",
    "queryKeywords": [
      "坐下官杀",
      "官杀坐下"
    ],
    "trigger": {
      "featuresAny": [
        "坐下官杀",
        "官杀坐下"
      ]
    },
    "requires": [
      "结合日主承载、印食制化和夫妻宫角色",
      "同时核对宾主、体用、根气和宫位"
    ],
    "weakeningConditions": [
      "作用链条中间被截断",
      "参与者无根、归属不清或力量严重失衡"
    ],
    "imagery": {
      "core": [
        "官杀贴近日主时，责任、规则和压力更直接，也可能成为执行力和职位接口"
      ],
      "positive": [
        "做功有效时，命主更容易把结构能力转成现实成果"
      ],
      "negative": [
        "做功失效或反制时，容易出现成本、压力、返工或资源流失"
      ],
      "realityChecks": [
        "用一句话说明谁通过什么方式取得或处理什么目标"
      ]
    },
    "advice": [
      "现实建议对应做功方式：制用重边界，化用重承接，生泄重输出，合用重协议，墓用重释放条件"
    ],
    "prohibitions": [
      "不能直接断婚姻受压或有官职"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "77-186",
        "section": "做工与制化结构",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "50-72",
        "section": "制用、化用、生泄用、合用、墓用目录框架",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "work-methods",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "work_official_control_peer",
    "title": "官制比劫：秩序约束竞争",
    "category": "work_method",
    "domains": [
      "career",
      "friends",
      "wealth"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 77,
    "gender": "all",
    "queryKeywords": [
      "官制比",
      "官制劫"
    ],
    "trigger": {
      "featuresAny": [
        "官制比",
        "官制劫"
      ]
    },
    "requires": [
      "官杀有力且不反伤日主",
      "同时核对宾主、体用、根气和宫位"
    ],
    "weakeningConditions": [
      "作用链条中间被截断",
      "参与者无根、归属不清或力量严重失衡"
    ],
    "imagery": {
      "core": [
        "官杀对比劫形成约束，可把同辈竞争转为纪律、岗位分工或组织执行"
      ],
      "positive": [
        "做功有效时，命主更容易把结构能力转成现实成果"
      ],
      "negative": [
        "做功失效或反制时，容易出现成本、压力、返工或资源流失"
      ],
      "realityChecks": [
        "用一句话说明谁通过什么方式取得或处理什么目标"
      ]
    },
    "advice": [
      "现实建议对应做功方式：制用重边界，化用重承接，生泄重输出，合用重协议，墓用重释放条件"
    ],
    "prohibitions": [
      "不能直接断升职、制服小人或结婚"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "77-186",
        "section": "做工与制化结构",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "50-72",
        "section": "制用、化用、生泄用、合用、墓用目录框架",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "work-methods",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "work_output_control_kill",
    "title": "食伤制杀：技能应对压力",
    "category": "work_method",
    "domains": [
      "career",
      "self"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 76,
    "gender": "all",
    "queryKeywords": [
      "食神制杀",
      "伤官制杀"
    ],
    "trigger": {
      "featuresAny": [
        "食神制杀",
        "伤官制杀"
      ]
    },
    "requires": [
      "食伤有根有力且制杀不过度",
      "同时核对宾主、体用、根气和宫位"
    ],
    "weakeningConditions": [
      "作用链条中间被截断",
      "参与者无根、归属不清或力量严重失衡"
    ],
    "imagery": {
      "core": [
        "食伤对官杀形成制衡，常体现用技术、表达、方案和成果应对压力"
      ],
      "positive": [
        "做功有效时，命主更容易把结构能力转成现实成果"
      ],
      "negative": [
        "做功失效或反制时，容易出现成本、压力、返工或资源流失"
      ],
      "realityChecks": [
        "用一句话说明谁通过什么方式取得或处理什么目标"
      ]
    },
    "advice": [
      "现实建议对应做功方式：制用重边界，化用重承接，生泄重输出，合用重协议，墓用重释放条件"
    ],
    "prohibitions": [
      "不能只见食伤官杀就定正式格局"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "77-186",
        "section": "做工与制化结构",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "50-72",
        "section": "制用、化用、生泄用、合用、墓用目录框架",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "work-methods",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "work_resource_control_output",
    "title": "印制食伤：规则收束输出",
    "category": "work_method",
    "domains": [
      "career",
      "self"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 79,
    "gender": "all",
    "queryKeywords": [
      "印制食伤",
      "印夺食"
    ],
    "trigger": {
      "featuresAny": [
        "印制食伤",
        "印夺食"
      ]
    },
    "requires": [
      "区分适度收束与过度夺食，结合现实输出",
      "同时核对宾主、体用、根气和宫位"
    ],
    "weakeningConditions": [
      "作用链条中间被截断",
      "参与者无根、归属不清或力量严重失衡"
    ],
    "imagery": {
      "core": [
        "印对食伤可形成规范、学习和审核，也可能压制表达和成果通道"
      ],
      "positive": [
        "做功有效时，命主更容易把结构能力转成现实成果"
      ],
      "negative": [
        "做功失效或反制时，容易出现成本、压力、返工或资源流失"
      ],
      "realityChecks": [
        "用一句话说明谁通过什么方式取得或处理什么目标"
      ]
    },
    "advice": [
      "现实建议对应做功方式：制用重边界，化用重承接，生泄重输出，合用重协议，墓用重释放条件"
    ],
    "prohibitions": [
      "不能直接断疾病、生育或重大灾害"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "77-186",
        "section": "做工与制化结构",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "50-72",
        "section": "制用、化用、生泄用、合用、墓用目录框架",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "work-methods",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "work_wealth_control_resource",
    "title": "财制印：现实目标调整支持体系",
    "category": "work_method",
    "domains": [
      "career",
      "wealth",
      "parents"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 78,
    "gender": "all",
    "queryKeywords": [
      "财制印",
      "财破印"
    ],
    "trigger": {
      "featuresAny": [
        "财制印",
        "财破印"
      ]
    },
    "requires": [
      "看财印力量、日主承载和是否有通关",
      "同时核对宾主、体用、根气和宫位"
    ],
    "weakeningConditions": [
      "作用链条中间被截断",
      "参与者无根、归属不清或力量严重失衡"
    ],
    "imagery": {
      "core": [
        "财对印形成制约，常体现现实目标、收入和责任改变学习、平台或支持方式"
      ],
      "positive": [
        "做功有效时，命主更容易把结构能力转成现实成果"
      ],
      "negative": [
        "做功失效或反制时，容易出现成本、压力、返工或资源流失"
      ],
      "realityChecks": [
        "用一句话说明谁通过什么方式取得或处理什么目标"
      ]
    },
    "advice": [
      "现实建议对应做功方式：制用重边界，化用重承接，生泄重输出，合用重协议，墓用重释放条件"
    ],
    "prohibitions": [
      "不能直接断离职、父母吉凶、牢狱或离婚"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "77-186",
        "section": "做工与制化结构",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "50-72",
        "section": "制用、化用、生泄用、合用、墓用目录框架",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "work-methods",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "work_peer_control_wealth",
    "title": "比劫制财：资源分配与共同取得",
    "category": "work_method",
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
    "certainty": "conditional",
    "priority": 77,
    "gender": "all",
    "queryKeywords": [
      "比劫制财",
      "劫财见财"
    ],
    "trigger": {
      "featuresAny": [
        "比劫制财",
        "劫财见财"
      ]
    },
    "requires": [
      "必须区分财和比劫归属、强弱和是否有官印约束",
      "同时核对宾主、体用、根气和宫位"
    ],
    "weakeningConditions": [
      "作用链条中间被截断",
      "参与者无根、归属不清或力量严重失衡"
    ],
    "imagery": {
      "core": [
        "比劫与财互动，可能体现共同争取、合作分配、竞争或资源外流"
      ],
      "positive": [
        "做功有效时，命主更容易把结构能力转成现实成果"
      ],
      "negative": [
        "做功失效或反制时，容易出现成本、压力、返工或资源流失"
      ],
      "realityChecks": [
        "用一句话说明谁通过什么方式取得或处理什么目标"
      ]
    },
    "advice": [
      "现实建议对应做功方式：制用重边界，化用重承接，生泄重输出，合用重协议，墓用重释放条件"
    ],
    "prohibitions": [
      "不能直接断破财、第三者或离婚"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "77-186",
        "section": "做工与制化结构",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "50-72",
        "section": "制用、化用、生泄用、合用、墓用目录框架",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "work-methods",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "work_timing_work_activation",
    "title": "岁运引动原局做功链",
    "category": "work_method",
    "domains": [
      "career",
      "wealth",
      "spouse"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 76,
    "gender": "all",
    "queryKeywords": [
      "岁运",
      "做功",
      "引动"
    ],
    "trigger": {
      "featuresAny": [
        "岁运",
        "做功",
        "引动"
      ]
    },
    "requires": [
      "岁运新增字必须与原局链条直接发生作用",
      "同时核对宾主、体用、根气和宫位"
    ],
    "weakeningConditions": [
      "作用链条中间被截断",
      "参与者无根、归属不清或力量严重失衡"
    ],
    "imagery": {
      "core": [
        "原局已有做功结构在大运流年补齐参与者、增强力量或打开通道时，主题更容易显现"
      ],
      "positive": [
        "做功有效时，命主更容易把结构能力转成现实成果"
      ],
      "negative": [
        "做功失效或反制时，容易出现成本、压力、返工或资源流失"
      ],
      "realityChecks": [
        "用一句话说明谁通过什么方式取得或处理什么目标"
      ]
    },
    "advice": [
      "现实建议对应做功方式：制用重边界，化用重承接，生泄重输出，合用重协议，墓用重释放条件"
    ],
    "prohibitions": [
      "不能把原局没有的完整结构强行补成永久格局"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "77-186",
        "section": "做工与制化结构",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "50-72",
        "section": "制用、化用、生泄用、合用、墓用目录框架",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "work-methods",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "storage_definition",
    "title": "墓库先分所藏对象与归属",
    "category": "storage",
    "domains": [
      "wealth",
      "career",
      "parents",
      "spouse",
      "children"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 77,
    "gender": "all",
    "queryKeywords": [
      "墓库",
      "库中",
      "藏干"
    ],
    "trigger": {
      "relationsAny": [
        "墓库",
        "入墓",
        "开库"
      ],
      "branchesAny": [
        "辰",
        "戌",
        "丑",
        "未"
      ],
      "featuresAny": [
        "墓库",
        "库中",
        "藏干"
      ]
    },
    "requires": [
      "必须按地支藏干和十神归属确认，不用口号替代",
      "区分辰戌丑未所藏对象、宫位与岁运层级"
    ],
    "weakeningConditions": [
      "库中无对应对象",
      "开库后无承接或被其他作用破坏"
    ],
    "imagery": {
      "core": [
        "墓库代表收纳、集中、封存和待释放的资源，先看库中实际藏什么、属于谁"
      ],
      "positive": [
        "条件完整时，墓库可解释资源集中、储存、组织和阶段性释放"
      ],
      "negative": [
        "条件不全时容易出现封闭、延迟、承载压力或资源散失"
      ],
      "realityChecks": [
        "现实中先核验资源是否真实存在、是否可调用、是否需要手续或时机"
      ]
    },
    "advice": [
      "对库的判断优先落到资源管理、承载能力和释放条件"
    ],
    "prohibitions": [
      "不能见辰戌丑未就断有财库、官库或大资源"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "77-186,251-270",
        "section": "做工、开库与地支像法",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "34-43",
        "section": "墓库高级运用目录框架",
        "verificationStatus": "outline_verified"
      },
      {
        "sourceId": "cui_five_elements",
        "pdfPage": "12-13",
        "section": "墓库章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "tomb-storage",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "storage_open_clash",
    "title": "冲开库：释放与结构变动",
    "category": "storage",
    "domains": [
      "wealth",
      "career",
      "property"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 76,
    "gender": "all",
    "queryKeywords": [
      "冲开库",
      "开库",
      "冲库"
    ],
    "trigger": {
      "relationsAny": [
        "墓库",
        "入墓",
        "开库"
      ],
      "branchesAny": [
        "辰",
        "戌",
        "丑",
        "未"
      ],
      "featuresAny": [
        "冲开库",
        "开库",
        "冲库"
      ]
    },
    "requires": [
      "库中有物、冲力有效、命主有承接路径且不把库冲坏",
      "区分辰戌丑未所藏对象、宫位与岁运层级"
    ],
    "weakeningConditions": [
      "库中无对应对象",
      "开库后无承接或被其他作用破坏"
    ],
    "imagery": {
      "core": [
        "库被冲时可出现释放、调动、重组或资源外显，但也可能破坏原有承载"
      ],
      "positive": [
        "条件完整时，墓库可解释资源集中、储存、组织和阶段性释放"
      ],
      "negative": [
        "条件不全时容易出现封闭、延迟、承载压力或资源散失"
      ],
      "realityChecks": [
        "现实中先核验资源是否真实存在、是否可调用、是否需要手续或时机"
      ]
    },
    "advice": [
      "对库的判断优先落到资源管理、承载能力和释放条件"
    ],
    "prohibitions": [
      "不能把冲库一律断发财、升职或有人离开"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "77-186,251-270",
        "section": "做工、开库与地支像法",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "34-43",
        "section": "墓库高级运用目录框架",
        "verificationStatus": "outline_verified"
      },
      {
        "sourceId": "cui_five_elements",
        "pdfPage": "12-13",
        "section": "墓库章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "tomb-storage",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "storage_open_penalty",
    "title": "刑库与冲库效果区分",
    "category": "storage",
    "domains": [
      "wealth",
      "career",
      "property"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 75,
    "gender": "all",
    "queryKeywords": [
      "刑库",
      "墓库",
      "刑"
    ],
    "trigger": {
      "relationsAny": [
        "墓库",
        "入墓",
        "开库"
      ],
      "branchesAny": [
        "辰",
        "戌",
        "丑",
        "未"
      ],
      "featuresAny": [
        "刑库",
        "墓库",
        "刑"
      ]
    },
    "requires": [
      "区分刑的条件完整度与库中对象是否真正透出",
      "区分辰戌丑未所藏对象、宫位与岁运层级"
    ],
    "weakeningConditions": [
      "库中无对应对象",
      "开库后无承接或被其他作用破坏"
    ],
    "imagery": {
      "core": [
        "刑可扰动库藏并产生摩擦性释放，但通常比直接冲开更复杂，需看是否损伤库体"
      ],
      "positive": [
        "条件完整时，墓库可解释资源集中、储存、组织和阶段性释放"
      ],
      "negative": [
        "条件不全时容易出现封闭、延迟、承载压力或资源散失"
      ],
      "realityChecks": [
        "现实中先核验资源是否真实存在、是否可调用、是否需要手续或时机"
      ]
    },
    "advice": [
      "对库的判断优先落到资源管理、承载能力和释放条件"
    ],
    "prohibitions": [
      "不能把刑库自动等同于开库成功"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "77-186,251-270",
        "section": "做工、开库与地支像法",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "34-43",
        "section": "墓库高级运用目录框架",
        "verificationStatus": "outline_verified"
      },
      {
        "sourceId": "cui_five_elements",
        "pdfPage": "12-13",
        "section": "墓库章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "tomb-storage",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "storage_open_stem",
    "title": "天干引动库中藏干",
    "category": "storage",
    "domains": [
      "wealth",
      "career",
      "spouse"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 74,
    "gender": "all",
    "queryKeywords": [
      "透出",
      "库中出来",
      "天干引动"
    ],
    "trigger": {
      "relationsAny": [
        "墓库",
        "入墓",
        "开库"
      ],
      "branchesAny": [
        "辰",
        "戌",
        "丑",
        "未"
      ],
      "featuresAny": [
        "透出",
        "库中出来",
        "天干引动"
      ]
    },
    "requires": [
      "透干与原库有来源联系，且未被合走或强制",
      "区分辰戌丑未所藏对象、宫位与岁运层级"
    ],
    "weakeningConditions": [
      "库中无对应对象",
      "开库后无承接或被其他作用破坏"
    ],
    "imagery": {
      "core": [
        "库中藏干在岁运透出、得根或被同类引动时，相关资源主题更易显化"
      ],
      "positive": [
        "条件完整时，墓库可解释资源集中、储存、组织和阶段性释放"
      ],
      "negative": [
        "条件不全时容易出现封闭、延迟、承载压力或资源散失"
      ],
      "realityChecks": [
        "现实中先核验资源是否真实存在、是否可调用、是否需要手续或时机"
      ]
    },
    "advice": [
      "对库的判断优先落到资源管理、承载能力和释放条件"
    ],
    "prohibitions": [
      "不能只因岁运出现同五行就断库中物已经出来"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "77-186,251-270",
        "section": "做工、开库与地支像法",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "34-43",
        "section": "墓库高级运用目录框架",
        "verificationStatus": "outline_verified"
      },
      {
        "sourceId": "cui_five_elements",
        "pdfPage": "12-13",
        "section": "墓库章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "tomb-storage",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "storage_close_stem",
    "title": "天干闭库与资源封存",
    "category": "storage",
    "domains": [
      "wealth",
      "career"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 77,
    "gender": "all",
    "queryKeywords": [
      "闭库",
      "天干闭库"
    ],
    "trigger": {
      "relationsAny": [
        "墓库",
        "入墓",
        "开库"
      ],
      "branchesAny": [
        "辰",
        "戌",
        "丑",
        "未"
      ],
      "featuresAny": [
        "闭库",
        "天干闭库"
      ]
    },
    "requires": [
      "必须有明确闭库机制和来源链条",
      "区分辰戌丑未所藏对象、宫位与岁运层级"
    ],
    "weakeningConditions": [
      "库中无对应对象",
      "开库后无承接或被其他作用破坏"
    ],
    "imagery": {
      "core": [
        "特定合制或覆盖关系可能使库中资源更难释放，表现为手续、条件或承接通道受限"
      ],
      "positive": [
        "条件完整时，墓库可解释资源集中、储存、组织和阶段性释放"
      ],
      "negative": [
        "条件不全时容易出现封闭、延迟、承载压力或资源散失"
      ],
      "realityChecks": [
        "现实中先核验资源是否真实存在、是否可调用、是否需要手续或时机"
      ]
    },
    "advice": [
      "对库的判断优先落到资源管理、承载能力和释放条件"
    ],
    "prohibitions": [
      "不能把任何天干相合都解释为闭库"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "77-186,251-270",
        "section": "做工、开库与地支像法",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "34-43",
        "section": "墓库高级运用目录框架",
        "verificationStatus": "outline_verified"
      },
      {
        "sourceId": "cui_five_elements",
        "pdfPage": "12-13",
        "section": "墓库章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "tomb-storage",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "storage_luck_open",
    "title": "大运开库决定阶段背景",
    "category": "storage",
    "domains": [
      "wealth",
      "career",
      "property"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 76,
    "gender": "all",
    "queryKeywords": [
      "大运开库",
      "开库大运"
    ],
    "trigger": {
      "relationsAny": [
        "墓库",
        "入墓",
        "开库"
      ],
      "branchesAny": [
        "辰",
        "戌",
        "丑",
        "未"
      ],
      "featuresAny": [
        "大运开库",
        "开库大运"
      ]
    },
    "requires": [
      "需结合实际交运时间和流年应期",
      "区分辰戌丑未所藏对象、宫位与岁运层级"
    ],
    "weakeningConditions": [
      "库中无对应对象",
      "开库后无承接或被其他作用破坏"
    ],
    "imagery": {
      "core": [
        "大运长期冲合或引动墓库时，阶段内资源释放、组织重组或承载方式改变"
      ],
      "positive": [
        "条件完整时，墓库可解释资源集中、储存、组织和阶段性释放"
      ],
      "negative": [
        "条件不全时容易出现封闭、延迟、承载压力或资源散失"
      ],
      "realityChecks": [
        "现实中先核验资源是否真实存在、是否可调用、是否需要手续或时机"
      ]
    },
    "advice": [
      "对库的判断优先落到资源管理、承载能力和释放条件"
    ],
    "prohibitions": [
      "不能把整个大运都写成持续发财或持续变动"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "77-186,251-270",
        "section": "做工、开库与地支像法",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "34-43",
        "section": "墓库高级运用目录框架",
        "verificationStatus": "outline_verified"
      },
      {
        "sourceId": "cui_five_elements",
        "pdfPage": "12-13",
        "section": "墓库章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "tomb-storage",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "storage_year_trigger",
    "title": "流年触发库门",
    "category": "storage",
    "domains": [
      "wealth",
      "career",
      "property"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 75,
    "gender": "all",
    "queryKeywords": [
      "流年开库",
      "流年冲库"
    ],
    "trigger": {
      "relationsAny": [
        "墓库",
        "入墓",
        "开库"
      ],
      "branchesAny": [
        "辰",
        "戌",
        "丑",
        "未"
      ],
      "featuresAny": [
        "流年开库",
        "流年冲库"
      ]
    },
    "requires": [
      "必须处在相关大运背景并有原局承接",
      "区分辰戌丑未所藏对象、宫位与岁运层级"
    ],
    "weakeningConditions": [
      "库中无对应对象",
      "开库后无承接或被其他作用破坏"
    ],
    "imagery": {
      "core": [
        "流年对墓库形成直接作用时，可成为阶段资源显化的年度触发"
      ],
      "positive": [
        "条件完整时，墓库可解释资源集中、储存、组织和阶段性释放"
      ],
      "negative": [
        "条件不全时容易出现封闭、延迟、承载压力或资源散失"
      ],
      "realityChecks": [
        "现实中先核验资源是否真实存在、是否可调用、是否需要手续或时机"
      ]
    },
    "advice": [
      "对库的判断优先落到资源管理、承载能力和释放条件"
    ],
    "prohibitions": [
      "不能只见流年冲库就锁定金额或事件"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "77-186,251-270",
        "section": "做工、开库与地支像法",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "34-43",
        "section": "墓库高级运用目录框架",
        "verificationStatus": "outline_verified"
      },
      {
        "sourceId": "cui_five_elements",
        "pdfPage": "12-13",
        "section": "墓库章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "tomb-storage",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "storage_empty_storage",
    "title": "空库或无对应对象",
    "category": "storage",
    "domains": [
      "wealth",
      "career"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 74,
    "gender": "all",
    "queryKeywords": [
      "空库",
      "库空"
    ],
    "trigger": {
      "relationsAny": [
        "墓库",
        "入墓",
        "开库"
      ],
      "branchesAny": [
        "辰",
        "戌",
        "丑",
        "未"
      ],
      "featuresAny": [
        "空库",
        "库空"
      ]
    },
    "requires": [
      "确认库中对象、空亡和来源",
      "区分辰戌丑未所藏对象、宫位与岁运层级"
    ],
    "weakeningConditions": [
      "库中无对应对象",
      "开库后无承接或被其他作用破坏"
    ],
    "imagery": {
      "core": [
        "库若空亡、无目标藏干或与命主无归属关系，即使被引动也未必带来所问资源"
      ],
      "positive": [
        "条件完整时，墓库可解释资源集中、储存、组织和阶段性释放"
      ],
      "negative": [
        "条件不全时容易出现封闭、延迟、承载压力或资源散失"
      ],
      "realityChecks": [
        "现实中先核验资源是否真实存在、是否可调用、是否需要手续或时机"
      ]
    },
    "advice": [
      "对库的判断优先落到资源管理、承载能力和释放条件"
    ],
    "prohibitions": [
      "不能把库的名称当作真实存量"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "77-186,251-270",
        "section": "做工、开库与地支像法",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "34-43",
        "section": "墓库高级运用目录框架",
        "verificationStatus": "outline_verified"
      },
      {
        "sourceId": "cui_five_elements",
        "pdfPage": "12-13",
        "section": "墓库章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "tomb-storage",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "storage_capacity",
    "title": "开库后的承载能力",
    "category": "storage",
    "domains": [
      "wealth",
      "career",
      "self"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 77,
    "gender": "all",
    "queryKeywords": [
      "承载",
      "开库",
      "能力"
    ],
    "trigger": {
      "relationsAny": [
        "墓库",
        "入墓",
        "开库"
      ],
      "branchesAny": [
        "辰",
        "戌",
        "丑",
        "未"
      ],
      "featuresAny": [
        "承载",
        "开库",
        "能力"
      ]
    },
    "requires": [
      "比较体力、平台、团队、现金流和原局体用",
      "区分辰戌丑未所藏对象、宫位与岁运层级"
    ],
    "weakeningConditions": [
      "库中无对应对象",
      "开库后无承接或被其他作用破坏"
    ],
    "imagery": {
      "core": [
        "资源释放规模可能超过命主当前能力，表现为机会、任务和成本同步增加"
      ],
      "positive": [
        "条件完整时，墓库可解释资源集中、储存、组织和阶段性释放"
      ],
      "negative": [
        "条件不全时容易出现封闭、延迟、承载压力或资源散失"
      ],
      "realityChecks": [
        "现实中先核验资源是否真实存在、是否可调用、是否需要手续或时机"
      ]
    },
    "advice": [
      "对库的判断优先落到资源管理、承载能力和释放条件"
    ],
    "prohibitions": [
      "不能把大资源出现自动等同于净收益"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "77-186,251-270",
        "section": "做工、开库与地支像法",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "34-43",
        "section": "墓库高级运用目录框架",
        "verificationStatus": "outline_verified"
      },
      {
        "sourceId": "cui_five_elements",
        "pdfPage": "12-13",
        "section": "墓库章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "tomb-storage",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "storage_multiple_storage",
    "title": "多库并见与资源分区",
    "category": "storage",
    "domains": [
      "wealth",
      "career",
      "property"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 76,
    "gender": "all",
    "queryKeywords": [
      "多库",
      "辰戌丑未"
    ],
    "trigger": {
      "relationsAny": [
        "墓库",
        "入墓",
        "开库"
      ],
      "branchesAny": [
        "辰",
        "戌",
        "丑",
        "未"
      ],
      "featuresAny": [
        "多库",
        "辰戌丑未"
      ]
    },
    "requires": [
      "逐库追查藏干、根源和作用关系",
      "区分辰戌丑未所藏对象、宫位与岁运层级"
    ],
    "weakeningConditions": [
      "库中无对应对象",
      "开库后无承接或被其他作用破坏"
    ],
    "imagery": {
      "core": [
        "多个墓库并见时需分别识别所藏对象、归属和开闭状态，不可合成一个笼统大库"
      ],
      "positive": [
        "条件完整时，墓库可解释资源集中、储存、组织和阶段性释放"
      ],
      "negative": [
        "条件不全时容易出现封闭、延迟、承载压力或资源散失"
      ],
      "realityChecks": [
        "现实中先核验资源是否真实存在、是否可调用、是否需要手续或时机"
      ]
    },
    "advice": [
      "对库的判断优先落到资源管理、承载能力和释放条件"
    ],
    "prohibitions": [
      "不能因库多就断财富大、房产多或关系复杂"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "77-186,251-270",
        "section": "做工、开库与地支像法",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "34-43",
        "section": "墓库高级运用目录框架",
        "verificationStatus": "outline_verified"
      },
      {
        "sourceId": "cui_five_elements",
        "pdfPage": "12-13",
        "section": "墓库章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "tomb-storage",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "storage_storage_palace",
    "title": "墓库所在宫位决定资源场域",
    "category": "storage",
    "domains": [
      "wealth",
      "career",
      "parents",
      "spouse",
      "children"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 75,
    "gender": "all",
    "queryKeywords": [
      "墓库",
      "宫位"
    ],
    "trigger": {
      "relationsAny": [
        "墓库",
        "入墓",
        "开库"
      ],
      "branchesAny": [
        "辰",
        "戌",
        "丑",
        "未"
      ],
      "featuresAny": [
        "墓库",
        "宫位"
      ]
    },
    "requires": [
      "宫位、十神和宾主共同确认",
      "区分辰戌丑未所藏对象、宫位与岁运层级"
    ],
    "weakeningConditions": [
      "库中无对应对象",
      "开库后无承接或被其他作用破坏"
    ],
    "imagery": {
      "core": [
        "库在年月日时不同位置，分别偏向外层来源、主要环境、贴身承接和后续成果"
      ],
      "positive": [
        "条件完整时，墓库可解释资源集中、储存、组织和阶段性释放"
      ],
      "negative": [
        "条件不全时容易出现封闭、延迟、承载压力或资源散失"
      ],
      "realityChecks": [
        "现实中先核验资源是否真实存在、是否可调用、是否需要手续或时机"
      ]
    },
    "advice": [
      "对库的判断优先落到资源管理、承载能力和释放条件"
    ],
    "prohibitions": [
      "不能同时套用所有六亲含义"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "77-186,251-270",
        "section": "做工、开库与地支像法",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "34-43",
        "section": "墓库高级运用目录框架",
        "verificationStatus": "outline_verified"
      },
      {
        "sourceId": "cui_five_elements",
        "pdfPage": "12-13",
        "section": "墓库章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "tomb-storage",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "storage_storage_ownership",
    "title": "库属于谁比库大小更重要",
    "category": "storage",
    "domains": [
      "wealth",
      "career",
      "spouse"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 74,
    "gender": "all",
    "queryKeywords": [
      "墓库",
      "归属",
      "宾主"
    ],
    "trigger": {
      "relationsAny": [
        "墓库",
        "入墓",
        "开库"
      ],
      "branchesAny": [
        "辰",
        "戌",
        "丑",
        "未"
      ],
      "featuresAny": [
        "墓库",
        "归属",
        "宾主"
      ]
    },
    "requires": [
      "有清晰取得路径和回流",
      "区分辰戌丑未所藏对象、宫位与岁运层级"
    ],
    "weakeningConditions": [
      "库中无对应对象",
      "开库后无承接或被其他作用破坏"
    ],
    "imagery": {
      "core": [
        "库中资源是否能归命主使用，取决于宾主、连体、合制与流向"
      ],
      "positive": [
        "条件完整时，墓库可解释资源集中、储存、组织和阶段性释放"
      ],
      "negative": [
        "条件不全时容易出现封闭、延迟、承载压力或资源散失"
      ],
      "realityChecks": [
        "现实中先核验资源是否真实存在、是否可调用、是否需要手续或时机"
      ]
    },
    "advice": [
      "对库的判断优先落到资源管理、承载能力和释放条件"
    ],
    "prohibitions": [
      "不能看到别人宫位的库就断命主能得"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "77-186,251-270",
        "section": "做工、开库与地支像法",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "34-43",
        "section": "墓库高级运用目录框架",
        "verificationStatus": "outline_verified"
      },
      {
        "sourceId": "cui_five_elements",
        "pdfPage": "12-13",
        "section": "墓库章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "tomb-storage",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "storage_storage_timing",
    "title": "库中星的应期需透、开或被引动",
    "category": "storage",
    "domains": [
      "spouse",
      "wealth",
      "career"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 77,
    "gender": "all",
    "queryKeywords": [
      "库中星",
      "应期",
      "透出"
    ],
    "trigger": {
      "relationsAny": [
        "墓库",
        "入墓",
        "开库"
      ],
      "branchesAny": [
        "辰",
        "戌",
        "丑",
        "未"
      ],
      "featuresAny": [
        "库中星",
        "应期",
        "透出"
      ]
    },
    "requires": [
      "大运背景与流年触发至少一层有效",
      "区分辰戌丑未所藏对象、宫位与岁运层级"
    ],
    "weakeningConditions": [
      "库中无对应对象",
      "开库后无承接或被其他作用破坏"
    ],
    "imagery": {
      "core": [
        "藏于库中的财官印食通常需要透出、开库或岁运直接引动才更易进入现实"
      ],
      "positive": [
        "条件完整时，墓库可解释资源集中、储存、组织和阶段性释放"
      ],
      "negative": [
        "条件不全时容易出现封闭、延迟、承载压力或资源散失"
      ],
      "realityChecks": [
        "现实中先核验资源是否真实存在、是否可调用、是否需要手续或时机"
      ]
    },
    "advice": [
      "对库的判断优先落到资源管理、承载能力和释放条件"
    ],
    "prohibitions": [
      "不能直接指定结婚、发财或职位时间"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "77-186,251-270",
        "section": "做工、开库与地支像法",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "34-43",
        "section": "墓库高级运用目录框架",
        "verificationStatus": "outline_verified"
      },
      {
        "sourceId": "cui_five_elements",
        "pdfPage": "12-13",
        "section": "墓库章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "tomb-storage",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "storage_storage_damage",
    "title": "开库与坏库区分",
    "category": "storage",
    "domains": [
      "wealth",
      "career",
      "property"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 76,
    "gender": "all",
    "queryKeywords": [
      "坏库",
      "库破",
      "冲刑"
    ],
    "trigger": {
      "relationsAny": [
        "墓库",
        "入墓",
        "开库"
      ],
      "branchesAny": [
        "辰",
        "戌",
        "丑",
        "未"
      ],
      "featuresAny": [
        "坏库",
        "库破",
        "冲刑"
      ]
    },
    "requires": [
      "检查冲刑后藏干是否有去处",
      "区分辰戌丑未所藏对象、宫位与岁运层级"
    ],
    "weakeningConditions": [
      "库中无对应对象",
      "开库后无承接或被其他作用破坏"
    ],
    "imagery": {
      "core": [
        "对墓库的强烈作用可能是打开，也可能损坏承载和让资源散失，取决于原局是否需要、库体强弱和承接"
      ],
      "positive": [
        "条件完整时，墓库可解释资源集中、储存、组织和阶段性释放"
      ],
      "negative": [
        "条件不全时容易出现封闭、延迟、承载压力或资源散失"
      ],
      "realityChecks": [
        "现实中先核验资源是否真实存在、是否可调用、是否需要手续或时机"
      ]
    },
    "advice": [
      "对库的判断优先落到资源管理、承载能力和释放条件"
    ],
    "prohibitions": [
      "不能以‘冲则开’作为无条件定律"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "77-186,251-270",
        "section": "做工、开库与地支像法",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "34-43",
        "section": "墓库高级运用目录框架",
        "verificationStatus": "outline_verified"
      },
      {
        "sourceId": "cui_five_elements",
        "pdfPage": "12-13",
        "section": "墓库章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "tomb-storage",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "storage_storage_safe_boundary",
    "title": "墓库高风险断语边界",
    "category": "storage",
    "domains": [
      "health",
      "parents",
      "children",
      "spouse"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 75,
    "gender": "all",
    "queryKeywords": [
      "入墓",
      "收人",
      "墓库"
    ],
    "trigger": {
      "relationsAny": [
        "墓库",
        "入墓",
        "开库"
      ],
      "branchesAny": [
        "辰",
        "戌",
        "丑",
        "未"
      ],
      "featuresAny": [
        "入墓",
        "收人",
        "墓库"
      ]
    },
    "requires": [
      "涉及人物与健康必须回到现实风险提示和专业就医",
      "区分辰戌丑未所藏对象、宫位与岁运层级"
    ],
    "weakeningConditions": [
      "库中无对应对象",
      "开库后无承接或被其他作用破坏"
    ],
    "imagery": {
      "core": [
        "墓库用于描述收纳、限制、沉潜和资源状态，不用于直接预测死亡、牢狱、流产或具体疾病"
      ],
      "positive": [
        "条件完整时，墓库可解释资源集中、储存、组织和阶段性释放"
      ],
      "negative": [
        "条件不全时容易出现封闭、延迟、承载压力或资源散失"
      ],
      "realityChecks": [
        "现实中先核验资源是否真实存在、是否可调用、是否需要手续或时机"
      ]
    },
    "advice": [
      "对库的判断优先落到资源管理、承载能力和释放条件"
    ],
    "prohibitions": [
      "禁止用入墓、开库直接断死亡、灾祸或寿命"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "77-186,251-270",
        "section": "做工、开库与地支像法",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "yang_advanced_blind_notes",
        "pdfPage": "34-43",
        "section": "墓库高级运用目录框架",
        "verificationStatus": "outline_verified"
      },
      {
        "sourceId": "cui_five_elements",
        "pdfPage": "12-13",
        "section": "墓库章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "tomb-storage",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "relationship_star_palace_core",
    "title": "配偶星与夫妻宫共同判断",
    "category": "relationship",
    "domains": [
      "spouse"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 82,
    "gender": "all",
    "queryKeywords": [
      "配偶星",
      "夫妻宫",
      "日支"
    ],
    "trigger": {
      "featuresAny": [
        "配偶星",
        "夫妻宫",
        "日支"
      ],
      "tenGodsAny": []
    },
    "requires": [
      "男命以财星为主要参考，女命以官杀为主要参考，同时核对日支和现实阶段",
      "结合性别、年龄、现实关系状态和问题时间层"
    ],
    "weakeningConditions": [
      "现实阶段与婚恋议题不匹配",
      "只有同一条结构的重复表述而无独立证据"
    ],
    "imagery": {
      "core": [
        "配偶星说明对象与关系资源，日支说明贴身相处和关系落点，两者必须共同承接"
      ],
      "positive": [
        "条件完整时可用于判断关系机会、相处模式和阶段主题"
      ],
      "negative": [
        "条件失衡时更容易表现为边界、沟通、责任或现实安排的摩擦"
      ],
      "realityChecks": [
        "现实中核验接触机会、沟通方式、责任分配和长期规划，而不是只验证事件标签"
      ]
    },
    "advice": [
      "先厘清关系状态和现实条件，再给具体建议"
    ],
    "prohibitions": [
      "不能单凭配偶星或日支判定婚姻质量",
      "不得预测配偶具体身份、绝对婚期或婚姻次数"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "187-225",
        "section": "婚姻分类、结婚应期、离婚与多婚边界",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_advanced_2025",
        "pdfPage": "婚姻目录页",
        "section": "婚姻、应期、桃花、离婚章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "relationship",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "relationship_star_hidden",
    "title": "配偶星藏支的显化条件",
    "category": "relationship",
    "domains": [
      "spouse"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 81,
    "gender": "all",
    "queryKeywords": [
      "配偶星藏支",
      "藏而不透"
    ],
    "trigger": {
      "featuresAny": [
        "配偶星藏支",
        "藏而不透"
      ],
      "tenGodsAny": []
    },
    "requires": [
      "确认藏干来源和是否真正归命主",
      "结合性别、年龄、现实关系状态和问题时间层"
    ],
    "weakeningConditions": [
      "现实阶段与婚恋议题不匹配",
      "只有同一条结构的重复表述而无独立证据"
    ],
    "imagery": {
      "core": [
        "配偶星藏于地支时，关系机会更依赖透出、得根、开库、合入或岁运引动"
      ],
      "positive": [
        "条件完整时可用于判断关系机会、相处模式和阶段主题"
      ],
      "negative": [
        "条件失衡时更容易表现为边界、沟通、责任或现实安排的摩擦"
      ],
      "realityChecks": [
        "现实中核验接触机会、沟通方式、责任分配和长期规划，而不是只验证事件标签"
      ]
    },
    "advice": [
      "先厘清关系状态和现实条件，再给具体建议"
    ],
    "prohibitions": [
      "不能写成没有对象或必晚婚",
      "不得预测配偶具体身份、绝对婚期或婚姻次数"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "187-225",
        "section": "婚姻分类、结婚应期、离婚与多婚边界",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_advanced_2025",
        "pdfPage": "婚姻目录页",
        "section": "婚姻、应期、桃花、离婚章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "relationship",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "relationship_star_external",
    "title": "配偶星在宾位或外层",
    "category": "relationship",
    "domains": [
      "spouse",
      "movement"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 80,
    "gender": "all",
    "queryKeywords": [
      "配偶星",
      "宾位",
      "外边"
    ],
    "trigger": {
      "featuresAny": [
        "配偶星",
        "宾位",
        "外边"
      ],
      "tenGodsAny": []
    },
    "requires": [
      "需有进入主位的作用路径",
      "结合性别、年龄、现实关系状态和问题时间层"
    ],
    "weakeningConditions": [
      "现实阶段与婚恋议题不匹配",
      "只有同一条结构的重复表述而无独立证据"
    ],
    "imagery": {
      "core": [
        "配偶星在外层可提示对象或关系资源来自外部环境、远层关系、工作社交或异地接口"
      ],
      "positive": [
        "条件完整时可用于判断关系机会、相处模式和阶段主题"
      ],
      "negative": [
        "条件失衡时更容易表现为边界、沟通、责任或现实安排的摩擦"
      ],
      "realityChecks": [
        "现实中核验接触机会、沟通方式、责任分配和长期规划，而不是只验证事件标签"
      ]
    },
    "advice": [
      "先厘清关系状态和现实条件，再给具体建议"
    ],
    "prohibitions": [
      "不能据此锁定异地恋、年龄差或职业",
      "不得预测配偶具体身份、绝对婚期或婚姻次数"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "187-225",
        "section": "婚姻分类、结婚应期、离婚与多婚边界",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_advanced_2025",
        "pdfPage": "婚姻目录页",
        "section": "婚姻、应期、桃花、离婚章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "relationship",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "relationship_star_internal",
    "title": "配偶星在主位或贴身",
    "category": "relationship",
    "domains": [
      "spouse"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 79,
    "gender": "all",
    "queryKeywords": [
      "配偶星",
      "主位",
      "日时"
    ],
    "trigger": {
      "featuresAny": [
        "配偶星",
        "主位",
        "日时"
      ],
      "tenGodsAny": []
    },
    "requires": [
      "仍需看星是否有力、是否被合制及夫妻宫承接",
      "结合性别、年龄、现实关系状态和问题时间层"
    ],
    "weakeningConditions": [
      "现实阶段与婚恋议题不匹配",
      "只有同一条结构的重复表述而无独立证据"
    ],
    "imagery": {
      "core": [
        "配偶星贴近主位时，关系议题更容易进入日常生活和直接选择"
      ],
      "positive": [
        "条件完整时可用于判断关系机会、相处模式和阶段主题"
      ],
      "negative": [
        "条件失衡时更容易表现为边界、沟通、责任或现实安排的摩擦"
      ],
      "realityChecks": [
        "现实中核验接触机会、沟通方式、责任分配和长期规划，而不是只验证事件标签"
      ]
    },
    "advice": [
      "先厘清关系状态和现实条件，再给具体建议"
    ],
    "prohibitions": [
      "不能直接断早婚或关系稳定",
      "不得预测配偶具体身份、绝对婚期或婚姻次数"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "187-225",
        "section": "婚姻分类、结婚应期、离婚与多婚边界",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_advanced_2025",
        "pdfPage": "婚姻目录页",
        "section": "婚姻、应期、桃花、离婚章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "relationship",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "relationship_palace_clash",
    "title": "夫妻宫受冲：关系模式调整",
    "category": "relationship",
    "domains": [
      "spouse"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 78,
    "gender": "all",
    "queryKeywords": [
      "夫妻宫",
      "冲"
    ],
    "trigger": {
      "featuresAny": [
        "夫妻宫",
        "冲"
      ],
      "tenGodsAny": []
    },
    "requires": [
      "至少再有配偶星或岁运新增依据",
      "结合性别、年龄、现实关系状态和问题时间层"
    ],
    "weakeningConditions": [
      "现实阶段与婚恋议题不匹配",
      "只有同一条结构的重复表述而无独立证据"
    ],
    "imagery": {
      "core": [
        "日支受冲表示相处方式、居住安排或关系状态需要调整，变化幅度取决于大运和现实背景"
      ],
      "positive": [
        "条件完整时可用于判断关系机会、相处模式和阶段主题"
      ],
      "negative": [
        "条件失衡时更容易表现为边界、沟通、责任或现实安排的摩擦"
      ],
      "realityChecks": [
        "现实中核验接触机会、沟通方式、责任分配和长期规划，而不是只验证事件标签"
      ]
    },
    "advice": [
      "先厘清关系状态和现实条件，再给具体建议"
    ],
    "prohibitions": [
      "不能直接断分手、离婚或搬家",
      "不得预测配偶具体身份、绝对婚期或婚姻次数"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "187-225",
        "section": "婚姻分类、结婚应期、离婚与多婚边界",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_advanced_2025",
        "pdfPage": "婚姻目录页",
        "section": "婚姻、应期、桃花、离婚章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "relationship",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "relationship_palace_combine",
    "title": "夫妻宫受合：连接与牵制",
    "category": "relationship",
    "domains": [
      "spouse"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 82,
    "gender": "all",
    "queryKeywords": [
      "夫妻宫",
      "合"
    ],
    "trigger": {
      "featuresAny": [
        "夫妻宫",
        "合"
      ],
      "tenGodsAny": []
    },
    "requires": [
      "确认合神归属、是否争合及是否被冲破",
      "结合性别、年龄、现实关系状态和问题时间层"
    ],
    "weakeningConditions": [
      "现实阶段与婚恋议题不匹配",
      "只有同一条结构的重复表述而无独立证据"
    ],
    "imagery": {
      "core": [
        "日支受合可表示关系连接、合作、注意力被牵引或相处模式被绑定"
      ],
      "positive": [
        "条件完整时可用于判断关系机会、相处模式和阶段主题"
      ],
      "negative": [
        "条件失衡时更容易表现为边界、沟通、责任或现实安排的摩擦"
      ],
      "realityChecks": [
        "现实中核验接触机会、沟通方式、责任分配和长期规划，而不是只验证事件标签"
      ]
    },
    "advice": [
      "先厘清关系状态和现实条件，再给具体建议"
    ],
    "prohibitions": [
      "不能见合就断恋爱、结婚或第三者",
      "不得预测配偶具体身份、绝对婚期或婚姻次数"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "187-225",
        "section": "婚姻分类、结婚应期、离婚与多婚边界",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_advanced_2025",
        "pdfPage": "婚姻目录页",
        "section": "婚姻、应期、桃花、离婚章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "relationship",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "relationship_palace_harm_break",
    "title": "夫妻宫害破：隐性摩擦与修补",
    "category": "relationship",
    "domains": [
      "spouse"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 81,
    "gender": "all",
    "queryKeywords": [
      "夫妻宫",
      "害",
      "破"
    ],
    "trigger": {
      "featuresAny": [
        "夫妻宫",
        "害",
        "破"
      ],
      "tenGodsAny": []
    },
    "requires": [
      "结合配偶星和现实互动确认落点",
      "结合性别、年龄、现实关系状态和问题时间层"
    ],
    "weakeningConditions": [
      "现实阶段与婚恋议题不匹配",
      "只有同一条结构的重复表述而无独立证据"
    ],
    "imagery": {
      "core": [
        "日支受害破更适合解释为沟通盲点、边界松动或关系结构需要修补"
      ],
      "positive": [
        "条件完整时可用于判断关系机会、相处模式和阶段主题"
      ],
      "negative": [
        "条件失衡时更容易表现为边界、沟通、责任或现实安排的摩擦"
      ],
      "realityChecks": [
        "现实中核验接触机会、沟通方式、责任分配和长期规划，而不是只验证事件标签"
      ]
    },
    "advice": [
      "先厘清关系状态和现实条件，再给具体建议"
    ],
    "prohibitions": [
      "不能直接扩展为家庭反对、异地、金钱和孩子等多项问题",
      "不得预测配偶具体身份、绝对婚期或婚姻次数"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "187-225",
        "section": "婚姻分类、结婚应期、离婚与多婚边界",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_advanced_2025",
        "pdfPage": "婚姻目录页",
        "section": "婚姻、应期、桃花、离婚章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "relationship",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "relationship_peer_wealth_male",
    "title": "男命比劫与财星的关系边界",
    "category": "relationship",
    "domains": [
      "spouse",
      "wealth",
      "friends"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 80,
    "gender": "male",
    "queryKeywords": [
      "男命",
      "比劫",
      "财星"
    ],
    "trigger": {
      "featuresAny": [
        "男命",
        "比劫",
        "财星"
      ],
      "tenGodsAny": [
        "正财",
        "偏财"
      ]
    },
    "requires": [
      "区分比劫和财星归属、强弱、官印约束与岁运触发",
      "结合性别、年龄、现实关系状态和问题时间层"
    ],
    "weakeningConditions": [
      "现实阶段与婚恋议题不匹配",
      "只有同一条结构的重复表述而无独立证据"
    ],
    "imagery": {
      "core": [
        "比劫与财星同时强烈互动，可能体现同辈竞争、资源分配、朋友影响或关系边界问题"
      ],
      "positive": [
        "条件完整时可用于判断关系机会、相处模式和阶段主题"
      ],
      "negative": [
        "条件失衡时更容易表现为边界、沟通、责任或现实安排的摩擦"
      ],
      "realityChecks": [
        "现实中核验接触机会、沟通方式、责任分配和长期规划，而不是只验证事件标签"
      ]
    },
    "advice": [
      "先厘清关系状态和现实条件，再给具体建议"
    ],
    "prohibitions": [
      "不能直接断第三者、夺妻、破财或离婚",
      "不得预测配偶具体身份、绝对婚期或婚姻次数"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "187-225",
        "section": "婚姻分类、结婚应期、离婚与多婚边界",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_advanced_2025",
        "pdfPage": "婚姻目录页",
        "section": "婚姻、应期、桃花、离婚章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "relationship",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "relationship_output_official_female",
    "title": "女命食伤与官杀的表达边界",
    "category": "relationship",
    "domains": [
      "spouse",
      "career"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 79,
    "gender": "female",
    "queryKeywords": [
      "女命",
      "食伤",
      "官杀"
    ],
    "trigger": {
      "featuresAny": [
        "女命",
        "食伤",
        "官杀"
      ],
      "tenGodsAny": [
        "正官",
        "七杀"
      ]
    },
    "requires": [
      "区分制杀、伤官见官、印制食伤等不同结构",
      "结合性别、年龄、现实关系状态和问题时间层"
    ],
    "weakeningConditions": [
      "现实阶段与婚恋议题不匹配",
      "只有同一条结构的重复表述而无独立证据"
    ],
    "imagery": {
      "core": [
        "食伤与官杀强烈互动，可能体现表达方式、关系规则、择偶标准与责任压力之间的拉扯"
      ],
      "positive": [
        "条件完整时可用于判断关系机会、相处模式和阶段主题"
      ],
      "negative": [
        "条件失衡时更容易表现为边界、沟通、责任或现实安排的摩擦"
      ],
      "realityChecks": [
        "现实中核验接触机会、沟通方式、责任分配和长期规划，而不是只验证事件标签"
      ]
    },
    "advice": [
      "先厘清关系状态和现实条件，再给具体建议"
    ],
    "prohibitions": [
      "不能直接断克夫、离婚或婚姻差",
      "不得预测配偶具体身份、绝对婚期或婚姻次数"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "187-225",
        "section": "婚姻分类、结婚应期、离婚与多婚边界",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_advanced_2025",
        "pdfPage": "婚姻目录页",
        "section": "婚姻、应期、桃花、离婚章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "relationship",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "relationship_wealth_resource_conflict",
    "title": "财印冲突在关系中的现实与支持拉扯",
    "category": "relationship",
    "domains": [
      "spouse",
      "wealth",
      "parents"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 78,
    "gender": "all",
    "queryKeywords": [
      "财印",
      "感情",
      "婚姻"
    ],
    "trigger": {
      "featuresAny": [
        "财印",
        "感情",
        "婚姻"
      ],
      "tenGodsAny": []
    },
    "requires": [
      "需看财印谁属于命主、谁在夫妻结构中被引动",
      "结合性别、年龄、现实关系状态和问题时间层"
    ],
    "weakeningConditions": [
      "现实阶段与婚恋议题不匹配",
      "只有同一条结构的重复表述而无独立证据"
    ],
    "imagery": {
      "core": [
        "财与印冲突可体现伴侣现实需求、原生支持、学习事业与生活安排之间的优先级冲突"
      ],
      "positive": [
        "条件完整时可用于判断关系机会、相处模式和阶段主题"
      ],
      "negative": [
        "条件失衡时更容易表现为边界、沟通、责任或现实安排的摩擦"
      ],
      "realityChecks": [
        "现实中核验接触机会、沟通方式、责任分配和长期规划，而不是只验证事件标签"
      ]
    },
    "advice": [
      "先厘清关系状态和现实条件，再给具体建议"
    ],
    "prohibitions": [
      "不能直接断婆媳矛盾、离婚或父母反对",
      "不得预测配偶具体身份、绝对婚期或婚姻次数"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "187-225",
        "section": "婚姻分类、结婚应期、离婚与多婚边界",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_advanced_2025",
        "pdfPage": "婚姻目录页",
        "section": "婚姻、应期、桃花、离婚章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "relationship",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "relationship_output_wealth_source",
    "title": "食伤生财需检查来源归属",
    "category": "relationship",
    "domains": [
      "spouse",
      "wealth"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 82,
    "gender": "all",
    "queryKeywords": [
      "食伤生财",
      "婚姻",
      "来源"
    ],
    "trigger": {
      "featuresAny": [
        "食伤生财",
        "婚姻",
        "来源"
      ],
      "tenGodsAny": []
    },
    "requires": [
      "食伤财星链条完整并有现实关系承接",
      "结合性别、年龄、现实关系状态和问题时间层"
    ],
    "weakeningConditions": [
      "现实阶段与婚恋议题不匹配",
      "只有同一条结构的重复表述而无独立证据"
    ],
    "imagery": {
      "core": [
        "食伤生财用于婚恋时，要看输出来自谁、财归谁以及是否进入夫妻宫或主位"
      ],
      "positive": [
        "条件完整时可用于判断关系机会、相处模式和阶段主题"
      ],
      "negative": [
        "条件失衡时更容易表现为边界、沟通、责任或现实安排的摩擦"
      ],
      "realityChecks": [
        "现实中核验接触机会、沟通方式、责任分配和长期规划，而不是只验证事件标签"
      ]
    },
    "advice": [
      "先厘清关系状态和现实条件，再给具体建议"
    ],
    "prohibitions": [
      "不能只见食伤生财就断桃花多或二婚",
      "不得预测配偶具体身份、绝对婚期或婚姻次数"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "187-225",
        "section": "婚姻分类、结婚应期、离婚与多婚边界",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_advanced_2025",
        "pdfPage": "婚姻目录页",
        "section": "婚姻、应期、桃花、离婚章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "relationship",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "relationship_five_combine_relationship",
    "title": "天干五合在婚恋中只作连接候选",
    "category": "relationship",
    "domains": [
      "spouse"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 81,
    "gender": "all",
    "queryKeywords": [
      "天干五合",
      "婚姻"
    ],
    "trigger": {
      "featuresAny": [
        "天干五合",
        "婚姻"
      ],
      "tenGodsAny": []
    },
    "requires": [
      "五合必须是固定五组并检查争合、合绊和化气条件",
      "结合性别、年龄、现实关系状态和问题时间层"
    ],
    "weakeningConditions": [
      "现实阶段与婚恋议题不匹配",
      "只有同一条结构的重复表述而无独立证据"
    ],
    "imagery": {
      "core": [
        "五合可提示连接、吸引、协议和牵连，但是否成为关系需看配偶星、夫妻宫和岁运背景"
      ],
      "positive": [
        "条件完整时可用于判断关系机会、相处模式和阶段主题"
      ],
      "negative": [
        "条件失衡时更容易表现为边界、沟通、责任或现实安排的摩擦"
      ],
      "realityChecks": [
        "现实中核验接触机会、沟通方式、责任分配和长期规划，而不是只验证事件标签"
      ]
    },
    "advice": [
      "先厘清关系状态和现实条件，再给具体建议"
    ],
    "prohibitions": [
      "不能把五合直接等同于结婚、桃花或配偶被合走",
      "不得预测配偶具体身份、绝对婚期或婚姻次数"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "187-225",
        "section": "婚姻分类、结婚应期、离婚与多婚边界",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_advanced_2025",
        "pdfPage": "婚姻目录页",
        "section": "婚姻、应期、桃花、离婚章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "relationship",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "relationship_timing_luck_first",
    "title": "婚恋应期先选有承接的大运",
    "category": "relationship",
    "domains": [
      "spouse"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 80,
    "gender": "all",
    "queryKeywords": [
      "结婚应期",
      "大运",
      "婚恋"
    ],
    "trigger": {
      "featuresAny": [
        "结婚应期",
        "大运",
        "婚恋"
      ],
      "tenGodsAny": []
    },
    "requires": [
      "大运需引动配偶星、夫妻宫、根气或平衡结构",
      "结合性别、年龄、现实关系状态和问题时间层"
    ],
    "weakeningConditions": [
      "现实阶段与婚恋议题不匹配",
      "只有同一条结构的重复表述而无独立证据"
    ],
    "imagery": {
      "core": [
        "大运先决定关系议题是否进入阶段背景，流年再触发接触、确认或变化"
      ],
      "positive": [
        "条件完整时可用于判断关系机会、相处模式和阶段主题"
      ],
      "negative": [
        "条件失衡时更容易表现为边界、沟通、责任或现实安排的摩擦"
      ],
      "realityChecks": [
        "现实中核验接触机会、沟通方式、责任分配和长期规划，而不是只验证事件标签"
      ]
    },
    "advice": [
      "先厘清关系状态和现实条件，再给具体建议"
    ],
    "prohibitions": [
      "不能跳过大运只凭流年定婚期",
      "不得预测配偶具体身份、绝对婚期或婚姻次数"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "187-225",
        "section": "婚姻分类、结婚应期、离婚与多婚边界",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_advanced_2025",
        "pdfPage": "婚姻目录页",
        "section": "婚姻、应期、桃花、离婚章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "relationship",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "relationship_timing_star_arrives",
    "title": "配偶星到位只是应期条件之一",
    "category": "relationship",
    "domains": [
      "spouse"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 79,
    "gender": "all",
    "queryKeywords": [
      "星到",
      "配偶星",
      "流年"
    ],
    "trigger": {
      "featuresAny": [
        "星到",
        "配偶星",
        "流年"
      ],
      "tenGodsAny": []
    },
    "requires": [
      "同时需夫妻宫、命主承载和现实阶段配合",
      "结合性别、年龄、现实关系状态和问题时间层"
    ],
    "weakeningConditions": [
      "现实阶段与婚恋议题不匹配",
      "只有同一条结构的重复表述而无独立证据"
    ],
    "imagery": {
      "core": [
        "配偶星在岁运透出、得根或从库中显现，可增加关系机会和对象主题"
      ],
      "positive": [
        "条件完整时可用于判断关系机会、相处模式和阶段主题"
      ],
      "negative": [
        "条件失衡时更容易表现为边界、沟通、责任或现实安排的摩擦"
      ],
      "realityChecks": [
        "现实中核验接触机会、沟通方式、责任分配和长期规划，而不是只验证事件标签"
      ]
    },
    "advice": [
      "先厘清关系状态和现实条件，再给具体建议"
    ],
    "prohibitions": [
      "不能见财官流年就断恋爱或结婚",
      "不得预测配偶具体身份、绝对婚期或婚姻次数"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "187-225",
        "section": "婚姻分类、结婚应期、离婚与多婚边界",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_advanced_2025",
        "pdfPage": "婚姻目录页",
        "section": "婚姻、应期、桃花、离婚章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "relationship",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "relationship_timing_palace_activation",
    "title": "夫妻宫引动与关系状态变化",
    "category": "relationship",
    "domains": [
      "spouse"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 78,
    "gender": "all",
    "queryKeywords": [
      "引动夫妻宫",
      "桃花运",
      "日支"
    ],
    "trigger": {
      "featuresAny": [
        "引动夫妻宫",
        "桃花运",
        "日支"
      ],
      "tenGodsAny": []
    },
    "requires": [
      "需区分已有关系和单身状态，并结合配偶星",
      "结合性别、年龄、现实关系状态和问题时间层"
    ],
    "weakeningConditions": [
      "现实阶段与婚恋议题不匹配",
      "只有同一条结构的重复表述而无独立证据"
    ],
    "imagery": {
      "core": [
        "大运流年合冲刑害日支，可使关系模式和相处议题进入显著阶段"
      ],
      "positive": [
        "条件完整时可用于判断关系机会、相处模式和阶段主题"
      ],
      "negative": [
        "条件失衡时更容易表现为边界、沟通、责任或现实安排的摩擦"
      ],
      "realityChecks": [
        "现实中核验接触机会、沟通方式、责任分配和长期规划，而不是只验证事件标签"
      ]
    },
    "advice": [
      "先厘清关系状态和现实条件，再给具体建议"
    ],
    "prohibitions": [
      "不能直接确定是认识、结婚、分手还是复合",
      "不得预测配偶具体身份、绝对婚期或婚姻次数"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "187-225",
        "section": "婚姻分类、结婚应期、离婚与多婚边界",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_advanced_2025",
        "pdfPage": "婚姻目录页",
        "section": "婚姻、应期、桃花、离婚章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "relationship",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "relationship_timing_root_capacity",
    "title": "双方立得住与关系承载",
    "category": "relationship",
    "domains": [
      "spouse"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 82,
    "gender": "all",
    "queryKeywords": [
      "立得住",
      "根气",
      "婚姻"
    ],
    "trigger": {
      "featuresAny": [
        "立得住",
        "根气",
        "婚姻"
      ],
      "tenGodsAny": []
    },
    "requires": [
      "根气、印比支持、宫位和现实准备共同判断",
      "结合性别、年龄、现实关系状态和问题时间层"
    ],
    "weakeningConditions": [
      "现实阶段与婚恋议题不匹配",
      "只有同一条结构的重复表述而无独立证据"
    ],
    "imagery": {
      "core": [
        "关系应期不仅看星到，还看命主和对方象是否有根、有承接和能否稳定进入生活"
      ],
      "positive": [
        "条件完整时可用于判断关系机会、相处模式和阶段主题"
      ],
      "negative": [
        "条件失衡时更容易表现为边界、沟通、责任或现实安排的摩擦"
      ],
      "realityChecks": [
        "现实中核验接触机会、沟通方式、责任分配和长期规划，而不是只验证事件标签"
      ]
    },
    "advice": [
      "先厘清关系状态和现实条件，再给具体建议"
    ],
    "prohibitions": [
      "不能以无根直接断无婚或关系不长",
      "不得预测配偶具体身份、绝对婚期或婚姻次数"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "187-225",
        "section": "婚姻分类、结婚应期、离婚与多婚边界",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_advanced_2025",
        "pdfPage": "婚姻目录页",
        "section": "婚姻、应期、桃花、离婚章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "relationship",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "relationship_timing_storage_star",
    "title": "库中配偶星需打开或透出",
    "category": "relationship",
    "domains": [
      "spouse"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 81,
    "gender": "all",
    "queryKeywords": [
      "库中星",
      "配偶星",
      "开库"
    ],
    "trigger": {
      "featuresAny": [
        "库中星",
        "配偶星",
        "开库"
      ],
      "tenGodsAny": []
    },
    "requires": [
      "库中确有配偶星且开库不损坏承载",
      "结合性别、年龄、现实关系状态和问题时间层"
    ],
    "weakeningConditions": [
      "现实阶段与婚恋议题不匹配",
      "只有同一条结构的重复表述而无独立证据"
    ],
    "imagery": {
      "core": [
        "配偶星藏库时，开库、透出、同类引动或直接合入可增加关系显化条件"
      ],
      "positive": [
        "条件完整时可用于判断关系机会、相处模式和阶段主题"
      ],
      "negative": [
        "条件失衡时更容易表现为边界、沟通、责任或现实安排的摩擦"
      ],
      "realityChecks": [
        "现实中核验接触机会、沟通方式、责任分配和长期规划，而不是只验证事件标签"
      ]
    },
    "advice": [
      "先厘清关系状态和现实条件，再给具体建议"
    ],
    "prohibitions": [
      "不能见冲库就断结婚或桃花",
      "不得预测配偶具体身份、绝对婚期或婚姻次数"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "187-225",
        "section": "婚姻分类、结婚应期、离婚与多婚边界",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_advanced_2025",
        "pdfPage": "婚姻目录页",
        "section": "婚姻、应期、桃花、离婚章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "relationship",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "relationship_relationship_quality",
    "title": "婚姻质量看长期互动，不按上中下机械定级",
    "category": "relationship",
    "domains": [
      "spouse"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 80,
    "gender": "all",
    "queryKeywords": [
      "婚姻质量",
      "上等婚",
      "下等婚"
    ],
    "trigger": {
      "featuresAny": [
        "婚姻质量",
        "上等婚",
        "下等婚"
      ],
      "tenGodsAny": []
    },
    "requires": [
      "至少有多条独立结构和现实验证",
      "结合性别、年龄、现实关系状态和问题时间层"
    ],
    "weakeningConditions": [
      "现实阶段与婚恋议题不匹配",
      "只有同一条结构的重复表述而无独立证据"
    ],
    "imagery": {
      "core": [
        "关系质量需看星宫承接、双方边界、制化是否平衡和现实沟通，不宜只按单一组合定级"
      ],
      "positive": [
        "条件完整时可用于判断关系机会、相处模式和阶段主题"
      ],
      "negative": [
        "条件失衡时更容易表现为边界、沟通、责任或现实安排的摩擦"
      ],
      "realityChecks": [
        "现实中核验接触机会、沟通方式、责任分配和长期规划，而不是只验证事件标签"
      ]
    },
    "advice": [
      "先厘清关系状态和现实条件，再给具体建议"
    ],
    "prohibitions": [
      "不能输出宿命式上等婚、下等婚标签",
      "不得预测配偶具体身份、绝对婚期或婚姻次数"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "187-225",
        "section": "婚姻分类、结婚应期、离婚与多婚边界",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_advanced_2025",
        "pdfPage": "婚姻目录页",
        "section": "婚姻、应期、桃花、离婚章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "relationship",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "relationship_multiple_relationships",
    "title": "多次关系需事件链而非计数十神",
    "category": "relationship",
    "domains": [
      "spouse"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 79,
    "gender": "all",
    "queryKeywords": [
      "二婚",
      "多婚",
      "离婚次数"
    ],
    "trigger": {
      "featuresAny": [
        "二婚",
        "多婚",
        "离婚次数"
      ],
      "tenGodsAny": []
    },
    "requires": [
      "多段岁运各自形成独立关系事件链",
      "结合性别、年龄、现实关系状态和问题时间层"
    ],
    "weakeningConditions": [
      "现实阶段与婚恋议题不匹配",
      "只有同一条结构的重复表述而无独立证据"
    ],
    "imagery": {
      "core": [
        "十神数量、合冲次数或库中星数量不能直接等同于婚姻次数，需有阶段性应期和现实事实"
      ],
      "positive": [
        "条件完整时可用于判断关系机会、相处模式和阶段主题"
      ],
      "negative": [
        "条件失衡时更容易表现为边界、沟通、责任或现实安排的摩擦"
      ],
      "realityChecks": [
        "现实中核验接触机会、沟通方式、责任分配和长期规划，而不是只验证事件标签"
      ]
    },
    "advice": [
      "先厘清关系状态和现实条件，再给具体建议"
    ],
    "prohibitions": [
      "不能预测具体婚姻次数",
      "不得预测配偶具体身份、绝对婚期或婚姻次数"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "187-225",
        "section": "婚姻分类、结婚应期、离婚与多婚边界",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_advanced_2025",
        "pdfPage": "婚姻目录页",
        "section": "婚姻、应期、桃花、离婚章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "relationship",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "relationship_separation_condition",
    "title": "关系分离是多条件结果",
    "category": "relationship",
    "domains": [
      "spouse"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 78,
    "gender": "all",
    "queryKeywords": [
      "离婚应期",
      "分手",
      "关系变化"
    ],
    "trigger": {
      "featuresAny": [
        "离婚应期",
        "分手",
        "关系变化"
      ],
      "tenGodsAny": []
    },
    "requires": [
      "至少两条独立命理依据及现实状态",
      "结合性别、年龄、现实关系状态和问题时间层"
    ],
    "weakeningConditions": [
      "现实阶段与婚恋议题不匹配",
      "只有同一条结构的重复表述而无独立证据"
    ],
    "imagery": {
      "core": [
        "分离候选需同时有关系承接削弱、星宫受损、岁运触发和现实问题累积"
      ],
      "positive": [
        "条件完整时可用于判断关系机会、相处模式和阶段主题"
      ],
      "negative": [
        "条件失衡时更容易表现为边界、沟通、责任或现实安排的摩擦"
      ],
      "realityChecks": [
        "现实中核验接触机会、沟通方式、责任分配和长期规划，而不是只验证事件标签"
      ]
    },
    "advice": [
      "先厘清关系状态和现实条件，再给具体建议"
    ],
    "prohibitions": [
      "不能由一冲一合一刑直接断离婚",
      "不得预测配偶具体身份、绝对婚期或婚姻次数"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "187-225",
        "section": "婚姻分类、结婚应期、离婚与多婚边界",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_advanced_2025",
        "pdfPage": "婚姻目录页",
        "section": "婚姻、应期、桃花、离婚章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "relationship",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "relationship_single_status",
    "title": "无婚或晚婚不能由单一弱星决定",
    "category": "relationship",
    "domains": [
      "spouse"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 82,
    "gender": "all",
    "queryKeywords": [
      "无婚",
      "晚婚",
      "单身"
    ],
    "trigger": {
      "featuresAny": [
        "无婚",
        "晚婚",
        "单身"
      ],
      "tenGodsAny": []
    },
    "requires": [
      "需比较完整大运和现实选择",
      "结合性别、年龄、现实关系状态和问题时间层"
    ],
    "weakeningConditions": [
      "现实阶段与婚恋议题不匹配",
      "只有同一条结构的重复表述而无独立证据"
    ],
    "imagery": {
      "core": [
        "配偶星弱、藏、受制或夫妻宫静，只说明显化条件不足，不等于无婚"
      ],
      "positive": [
        "条件完整时可用于判断关系机会、相处模式和阶段主题"
      ],
      "negative": [
        "条件失衡时更容易表现为边界、沟通、责任或现实安排的摩擦"
      ],
      "realityChecks": [
        "现实中核验接触机会、沟通方式、责任分配和长期规划，而不是只验证事件标签"
      ]
    },
    "advice": [
      "先厘清关系状态和现实条件，再给具体建议"
    ],
    "prohibitions": [
      "不能断终身无婚",
      "不得预测配偶具体身份、绝对婚期或婚姻次数"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "187-225",
        "section": "婚姻分类、结婚应期、离婚与多婚边界",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_advanced_2025",
        "pdfPage": "婚姻目录页",
        "section": "婚姻、应期、桃花、离婚章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "relationship",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "relationship_relationship_advice",
    "title": "关系建议对应结构问题",
    "category": "relationship",
    "domains": [
      "spouse"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 81,
    "gender": "all",
    "queryKeywords": [
      "感情建议",
      "婚姻建议"
    ],
    "trigger": {
      "featuresAny": [
        "感情建议",
        "婚姻建议"
      ],
      "tenGodsAny": []
    },
    "requires": [
      "建议必须来自前文主象而非泛泛而谈",
      "结合性别、年龄、现实关系状态和问题时间层"
    ],
    "weakeningConditions": [
      "现实阶段与婚恋议题不匹配",
      "只有同一条结构的重复表述而无独立证据"
    ],
    "imagery": {
      "core": [
        "比劫财星问题重边界与分配，食伤官杀问题重表达与规则，财印问题重现实与支持协调"
      ],
      "positive": [
        "条件完整时可用于判断关系机会、相处模式和阶段主题"
      ],
      "negative": [
        "条件失衡时更容易表现为边界、沟通、责任或现实安排的摩擦"
      ],
      "realityChecks": [
        "现实中核验接触机会、沟通方式、责任分配和长期规划，而不是只验证事件标签"
      ]
    },
    "advice": [
      "先厘清关系状态和现实条件，再给具体建议"
    ],
    "prohibitions": [
      "不能用颜色、饰品、改名或保证性方法替代沟通和选择",
      "不得预测配偶具体身份、绝对婚期或婚姻次数"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "187-225",
        "section": "婚姻分类、结婚应期、离婚与多婚边界",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_advanced_2025",
        "pdfPage": "婚姻目录页",
        "section": "婚姻、应期、桃花、离婚章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "relationship",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "family_parents_star_palace",
    "title": "父母判断星位与宫位同看",
    "category": "family",
    "domains": [
      "parents"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 73,
    "gender": "all",
    "queryKeywords": [
      "父母星",
      "年柱",
      "月柱"
    ],
    "trigger": {
      "featuresAny": [
        "父母星",
        "年柱",
        "月柱"
      ],
      "tenGodsAny": [
        "正印",
        "偏印",
        "正财",
        "偏财",
        "比肩",
        "劫财",
        "食神",
        "伤官"
      ]
    },
    "requires": [
      "先明确性别体系下父母星取法，并核对现实家庭结构",
      "宫位、十神、来源和现实家庭结构共同验证"
    ],
    "weakeningConditions": [
      "人物星与宫位不一致",
      "现实中该家庭角色缺位或由他人承担"
    ],
    "imagery": {
      "core": [
        "父母相关判断需结合印财等角色、年月宫位、来源与岁运引动"
      ],
      "positive": [
        "结构顺畅时可体现支持、协作、传承和稳定责任"
      ],
      "negative": [
        "结构失衡时更容易出现边界、责任、资源或沟通压力"
      ],
      "realityChecks": [
        "现实核验具体由谁提供支持、承担责任和影响决策"
      ]
    },
    "advice": [
      "优先给可执行的家庭沟通和资源安排建议"
    ],
    "prohibitions": [
      "不能单凭印财旺弱断父母吉凶、健康或寿命"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "42-75,251-270",
        "section": "十神、宫位、来源与六亲取象",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_advanced_2025",
        "pdfPage": "六亲目录页",
        "section": "父母、兄弟、子女章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "family",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "family_parents_support",
    "title": "印星与长辈支持的承接",
    "category": "family",
    "domains": [
      "parents",
      "career"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 72,
    "gender": "all",
    "queryKeywords": [
      "印星",
      "长辈",
      "支持"
    ],
    "trigger": {
      "featuresAny": [
        "印星",
        "长辈",
        "支持"
      ],
      "tenGodsAny": [
        "正印",
        "偏印",
        "正财",
        "偏财",
        "比肩",
        "劫财",
        "食神",
        "伤官"
      ]
    },
    "requires": [
      "印确与年月或父母宫位发生联系",
      "宫位、十神、来源和现实家庭结构共同验证"
    ],
    "weakeningConditions": [
      "人物星与宫位不一致",
      "现实中该家庭角色缺位或由他人承担"
    ],
    "imagery": {
      "core": [
        "印星可提示照顾、教育、规则和支持方式，但是否来自父母要看宫位和来源"
      ],
      "positive": [
        "结构顺畅时可体现支持、协作、传承和稳定责任"
      ],
      "negative": [
        "结构失衡时更容易出现边界、责任、资源或沟通压力"
      ],
      "realityChecks": [
        "现实核验具体由谁提供支持、承担责任和影响决策"
      ]
    },
    "advice": [
      "优先给可执行的家庭沟通和资源安排建议"
    ],
    "prohibitions": [
      "不能把所有印星都解释为母亲"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "42-75,251-270",
        "section": "十神、宫位、来源与六亲取象",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_advanced_2025",
        "pdfPage": "六亲目录页",
        "section": "父母、兄弟、子女章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "family",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "family_father_wealth",
    "title": "财星作为父亲或现实资源的条件取象",
    "category": "family",
    "domains": [
      "parents",
      "wealth"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 71,
    "gender": "all",
    "queryKeywords": [
      "父亲",
      "财星"
    ],
    "trigger": {
      "featuresAny": [
        "父亲",
        "财星"
      ],
      "tenGodsAny": [
        "正印",
        "偏印",
        "正财",
        "偏财",
        "比肩",
        "劫财",
        "食神",
        "伤官"
      ]
    },
    "requires": [
      "父亲取象与财星来源、年月位置相符",
      "宫位、十神、来源和现实家庭结构共同验证"
    ],
    "weakeningConditions": [
      "人物星与宫位不一致",
      "现实中该家庭角色缺位或由他人承担"
    ],
    "imagery": {
      "core": [
        "财星可作为父亲和现实供给的候选象，需结合宫位、根气和家庭角色"
      ],
      "positive": [
        "结构顺畅时可体现支持、协作、传承和稳定责任"
      ],
      "negative": [
        "结构失衡时更容易出现边界、责任、资源或沟通压力"
      ],
      "realityChecks": [
        "现实核验具体由谁提供支持、承担责任和影响决策"
      ]
    },
    "advice": [
      "优先给可执行的家庭沟通和资源安排建议"
    ],
    "prohibitions": [
      "不能把财星受制直接断父亲有灾"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "42-75,251-270",
        "section": "十神、宫位、来源与六亲取象",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_advanced_2025",
        "pdfPage": "六亲目录页",
        "section": "父母、兄弟、子女章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "family",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "family_mother_resource",
    "title": "印星作为母亲或养育支持的条件取象",
    "category": "family",
    "domains": [
      "parents"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 70,
    "gender": "all",
    "queryKeywords": [
      "母亲",
      "印星"
    ],
    "trigger": {
      "featuresAny": [
        "母亲",
        "印星"
      ],
      "tenGodsAny": [
        "正印",
        "偏印",
        "正财",
        "偏财",
        "比肩",
        "劫财",
        "食神",
        "伤官"
      ]
    },
    "requires": [
      "印星与父母宫位、来源或岁运直接相关",
      "宫位、十神、来源和现实家庭结构共同验证"
    ],
    "weakeningConditions": [
      "人物星与宫位不一致",
      "现实中该家庭角色缺位或由他人承担"
    ],
    "imagery": {
      "core": [
        "印星可作为母亲、教育和养育支持的候选象，需结合宫位和现实验证"
      ],
      "positive": [
        "结构顺畅时可体现支持、协作、传承和稳定责任"
      ],
      "negative": [
        "结构失衡时更容易出现边界、责任、资源或沟通压力"
      ],
      "realityChecks": [
        "现实核验具体由谁提供支持、承担责任和影响决策"
      ]
    },
    "advice": [
      "优先给可执行的家庭沟通和资源安排建议"
    ],
    "prohibitions": [
      "不能把偏印正印数量直接等同于多个母亲或家庭关系"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "42-75,251-270",
        "section": "十神、宫位、来源与六亲取象",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_advanced_2025",
        "pdfPage": "六亲目录页",
        "section": "父母、兄弟、子女章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "family",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "family_siblings_peer",
    "title": "比劫与兄弟姐妹、同辈关系",
    "category": "family",
    "domains": [
      "siblings",
      "friends"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 73,
    "gender": "all",
    "queryKeywords": [
      "兄弟姐妹",
      "比劫"
    ],
    "trigger": {
      "featuresAny": [
        "兄弟姐妹",
        "比劫"
      ],
      "tenGodsAny": [
        "正印",
        "偏印",
        "正财",
        "偏财",
        "比肩",
        "劫财",
        "食神",
        "伤官"
      ]
    },
    "requires": [
      "比劫与年月、月柱或同辈宫位有关",
      "宫位、十神、来源和现实家庭结构共同验证"
    ],
    "weakeningConditions": [
      "人物星与宫位不一致",
      "现实中该家庭角色缺位或由他人承担"
    ],
    "imagery": {
      "core": [
        "比肩劫财可提示同辈、兄弟姐妹和竞争合作方式，实际人数和关系需宫位与现实验证"
      ],
      "positive": [
        "结构顺畅时可体现支持、协作、传承和稳定责任"
      ],
      "negative": [
        "结构失衡时更容易出现边界、责任、资源或沟通压力"
      ],
      "realityChecks": [
        "现实核验具体由谁提供支持、承担责任和影响决策"
      ]
    },
    "advice": [
      "优先给可执行的家庭沟通和资源安排建议"
    ],
    "prohibitions": [
      "不能由比劫数量预测兄弟姐妹人数"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "42-75,251-270",
        "section": "十神、宫位、来源与六亲取象",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_advanced_2025",
        "pdfPage": "六亲目录页",
        "section": "父母、兄弟、子女章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "family",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "family_siblings_resource",
    "title": "同辈资源合作与分配",
    "category": "family",
    "domains": [
      "siblings",
      "friends",
      "wealth"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 72,
    "gender": "all",
    "queryKeywords": [
      "比劫",
      "资源分配",
      "同辈"
    ],
    "trigger": {
      "featuresAny": [
        "比劫",
        "资源分配",
        "同辈"
      ],
      "tenGodsAny": [
        "正印",
        "偏印",
        "正财",
        "偏财",
        "比肩",
        "劫财",
        "食神",
        "伤官"
      ]
    },
    "requires": [
      "确认比劫归属和现实合作关系",
      "宫位、十神、来源和现实家庭结构共同验证"
    ],
    "weakeningConditions": [
      "人物星与宫位不一致",
      "现实中该家庭角色缺位或由他人承担"
    ],
    "imagery": {
      "core": [
        "比劫参与财或项目时，家人同辈可能成为合作、支持或分配压力来源"
      ],
      "positive": [
        "结构顺畅时可体现支持、协作、传承和稳定责任"
      ],
      "negative": [
        "结构失衡时更容易出现边界、责任、资源或沟通压力"
      ],
      "realityChecks": [
        "现实核验具体由谁提供支持、承担责任和影响决策"
      ]
    },
    "advice": [
      "优先给可执行的家庭沟通和资源安排建议"
    ],
    "prohibitions": [
      "不能直接断借钱不还、争产或关系破裂"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "42-75,251-270",
        "section": "十神、宫位、来源与六亲取象",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_advanced_2025",
        "pdfPage": "六亲目录页",
        "section": "父母、兄弟、子女章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "family",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "family_children_output",
    "title": "食伤与子女、作品、学生的多重取象",
    "category": "family",
    "domains": [
      "children",
      "career"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 71,
    "gender": "all",
    "queryKeywords": [
      "子女星",
      "食伤",
      "作品"
    ],
    "trigger": {
      "featuresAny": [
        "子女星",
        "食伤",
        "作品"
      ],
      "tenGodsAny": [
        "正印",
        "偏印",
        "正财",
        "偏财",
        "比肩",
        "劫财",
        "食神",
        "伤官"
      ]
    },
    "requires": [
      "结合时柱、现实婚育状态和岁运层级",
      "宫位、十神、来源和现实家庭结构共同验证"
    ],
    "weakeningConditions": [
      "人物星与宫位不一致",
      "现实中该家庭角色缺位或由他人承担"
    ],
    "imagery": {
      "core": [
        "食伤可对应子女、作品、技能、学生或输出成果，按年龄和问题选择最合理落点"
      ],
      "positive": [
        "结构顺畅时可体现支持、协作、传承和稳定责任"
      ],
      "negative": [
        "结构失衡时更容易出现边界、责任、资源或沟通压力"
      ],
      "realityChecks": [
        "现实核验具体由谁提供支持、承担责任和影响决策"
      ]
    },
    "advice": [
      "优先给可执行的家庭沟通和资源安排建议"
    ],
    "prohibitions": [
      "不能未婚未育时强行解释为子女"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "42-75,251-270",
        "section": "十神、宫位、来源与六亲取象",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_advanced_2025",
        "pdfPage": "六亲目录页",
        "section": "父母、兄弟、子女章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "family",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "family_children_hour",
    "title": "时柱作为子女与后续成果宫位",
    "category": "family",
    "domains": [
      "children",
      "career"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 70,
    "gender": "all",
    "queryKeywords": [
      "时柱",
      "子女宫"
    ],
    "trigger": {
      "featuresAny": [
        "时柱",
        "子女宫"
      ],
      "tenGodsAny": [
        "正印",
        "偏印",
        "正财",
        "偏财",
        "比肩",
        "劫财",
        "食神",
        "伤官"
      ]
    },
    "requires": [
      "时柱被相关十神或岁运直接引动",
      "宫位、十神、来源和现实家庭结构共同验证"
    ],
    "weakeningConditions": [
      "人物星与宫位不一致",
      "现实中该家庭角色缺位或由他人承担"
    ],
    "imagery": {
      "core": [
        "时柱贴近后续成果、子女或下属层，需结合食伤、官杀和现实阶段"
      ],
      "positive": [
        "结构顺畅时可体现支持、协作、传承和稳定责任"
      ],
      "negative": [
        "结构失衡时更容易出现边界、责任、资源或沟通压力"
      ],
      "realityChecks": [
        "现实核验具体由谁提供支持、承担责任和影响决策"
      ]
    },
    "advice": [
      "优先给可执行的家庭沟通和资源安排建议"
    ],
    "prohibitions": [
      "不能把时柱冲刑直接断子女有灾"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "42-75,251-270",
        "section": "十神、宫位、来源与六亲取象",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_advanced_2025",
        "pdfPage": "六亲目录页",
        "section": "父母、兄弟、子女章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "family",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "family_children_timing",
    "title": "子女或成果应期需星宫与现实条件",
    "category": "family",
    "domains": [
      "children"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 73,
    "gender": "all",
    "queryKeywords": [
      "子女应期",
      "食伤",
      "时柱"
    ],
    "trigger": {
      "featuresAny": [
        "子女应期",
        "食伤",
        "时柱"
      ],
      "tenGodsAny": [
        "正印",
        "偏印",
        "正财",
        "偏财",
        "比肩",
        "劫财",
        "食神",
        "伤官"
      ]
    },
    "requires": [
      "现实有婚育计划或明确成果目标",
      "宫位、十神、来源和现实家庭结构共同验证"
    ],
    "weakeningConditions": [
      "人物星与宫位不一致",
      "现实中该家庭角色缺位或由他人承担"
    ],
    "imagery": {
      "core": [
        "食伤、时柱和岁运共同引动时，可提示子女议题或成果项目进入阶段"
      ],
      "positive": [
        "结构顺畅时可体现支持、协作、传承和稳定责任"
      ],
      "negative": [
        "结构失衡时更容易出现边界、责任、资源或沟通压力"
      ],
      "realityChecks": [
        "现实核验具体由谁提供支持、承担责任和影响决策"
      ]
    },
    "advice": [
      "优先给可执行的家庭沟通和资源安排建议"
    ],
    "prohibitions": [
      "不能预测怀孕、流产、性别或具体医学结果"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "42-75,251-270",
        "section": "十神、宫位、来源与六亲取象",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_advanced_2025",
        "pdfPage": "六亲目录页",
        "section": "父母、兄弟、子女章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "family",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "family_family_palace_activation",
    "title": "年月宫位被岁运引动",
    "category": "family",
    "domains": [
      "parents",
      "siblings"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 72,
    "gender": "all",
    "queryKeywords": [
      "年柱",
      "月柱",
      "岁运"
    ],
    "trigger": {
      "featuresAny": [
        "年柱",
        "月柱",
        "岁运"
      ],
      "tenGodsAny": [
        "正印",
        "偏印",
        "正财",
        "偏财",
        "比肩",
        "劫财",
        "食神",
        "伤官"
      ]
    },
    "requires": [
      "根据当前问题和实际家庭结构选择一个主要落点",
      "宫位、十神、来源和现实家庭结构共同验证"
    ],
    "weakeningConditions": [
      "人物星与宫位不一致",
      "现实中该家庭角色缺位或由他人承担"
    ],
    "imagery": {
      "core": [
        "岁运直接作用年月时，家庭环境、长辈关系、同辈接口或工作环境可能调整"
      ],
      "positive": [
        "结构顺畅时可体现支持、协作、传承和稳定责任"
      ],
      "negative": [
        "结构失衡时更容易出现边界、责任、资源或沟通压力"
      ],
      "realityChecks": [
        "现实核验具体由谁提供支持、承担责任和影响决策"
      ]
    },
    "advice": [
      "优先给可执行的家庭沟通和资源安排建议"
    ],
    "prohibitions": [
      "不能同时断父母、兄弟、单位和祖业"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "42-75,251-270",
        "section": "十神、宫位、来源与六亲取象",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_advanced_2025",
        "pdfPage": "六亲目录页",
        "section": "父母、兄弟、子女章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "family",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "family_family_source_flow",
    "title": "家庭资源流入或命主反向承担",
    "category": "family",
    "domains": [
      "parents",
      "wealth"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 71,
    "gender": "all",
    "queryKeywords": [
      "家庭资源",
      "来源",
      "流向"
    ],
    "trigger": {
      "featuresAny": [
        "家庭资源",
        "来源",
        "流向"
      ],
      "tenGodsAny": [
        "正印",
        "偏印",
        "正财",
        "偏财",
        "比肩",
        "劫财",
        "食神",
        "伤官"
      ]
    },
    "requires": [
      "作用方向和资源归属清楚",
      "宫位、十神、来源和现实家庭结构共同验证"
    ],
    "weakeningConditions": [
      "人物星与宫位不一致",
      "现实中该家庭角色缺位或由他人承担"
    ],
    "imagery": {
      "core": [
        "年月资源进入日时可体现家庭支持；日时力量向年月作用可体现命主反向承担或输出"
      ],
      "positive": [
        "结构顺畅时可体现支持、协作、传承和稳定责任"
      ],
      "negative": [
        "结构失衡时更容易出现边界、责任、资源或沟通压力"
      ],
      "realityChecks": [
        "现实核验具体由谁提供支持、承担责任和影响决策"
      ]
    },
    "advice": [
      "优先给可执行的家庭沟通和资源安排建议"
    ],
    "prohibitions": [
      "不能把相生一律解释为父母给钱或命主尽孝"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "42-75,251-270",
        "section": "十神、宫位、来源与六亲取象",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_advanced_2025",
        "pdfPage": "六亲目录页",
        "section": "父母、兄弟、子女章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "family",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "family_family_distance",
    "title": "宫位远近与家庭联系模式",
    "category": "family",
    "domains": [
      "parents",
      "siblings",
      "movement"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 70,
    "gender": "all",
    "queryKeywords": [
      "远近",
      "父母",
      "兄弟"
    ],
    "trigger": {
      "featuresAny": [
        "远近",
        "父母",
        "兄弟"
      ],
      "tenGodsAny": [
        "正印",
        "偏印",
        "正财",
        "偏财",
        "比肩",
        "劫财",
        "食神",
        "伤官"
      ]
    },
    "requires": [
      "结合实际居住、联系频率和岁运",
      "宫位、十神、来源和现实家庭结构共同验证"
    ],
    "weakeningConditions": [
      "人物星与宫位不一致",
      "现实中该家庭角色缺位或由他人承担"
    ],
    "imagery": {
      "core": [
        "年月较远、日时较近可辅助判断家庭影响是背景性还是日常性"
      ],
      "positive": [
        "结构顺畅时可体现支持、协作、传承和稳定责任"
      ],
      "negative": [
        "结构失衡时更容易出现边界、责任、资源或沟通压力"
      ],
      "realityChecks": [
        "现实核验具体由谁提供支持、承担责任和影响决策"
      ]
    },
    "advice": [
      "优先给可执行的家庭沟通和资源安排建议"
    ],
    "prohibitions": [
      "不能据宫位锁定分居、异地或亲疏"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "42-75,251-270",
        "section": "十神、宫位、来源与六亲取象",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_advanced_2025",
        "pdfPage": "六亲目录页",
        "section": "父母、兄弟、子女章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "family",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "family_family_conflict",
    "title": "家庭摩擦需独立证据",
    "category": "family",
    "domains": [
      "parents",
      "siblings"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 73,
    "gender": "all",
    "queryKeywords": [
      "家庭矛盾",
      "冲刑害破"
    ],
    "trigger": {
      "featuresAny": [
        "家庭矛盾",
        "冲刑害破"
      ],
      "tenGodsAny": [
        "正印",
        "偏印",
        "正财",
        "偏财",
        "比肩",
        "劫财",
        "食神",
        "伤官"
      ]
    },
    "requires": [
      "至少两条独立依据并考虑大运背景",
      "宫位、十神、来源和现实家庭结构共同验证"
    ],
    "weakeningConditions": [
      "人物星与宫位不一致",
      "现实中该家庭角色缺位或由他人承担"
    ],
    "imagery": {
      "core": [
        "冲刑害破作用年月可作为家庭沟通、责任或环境调整候选，但需人物星和现实问题汇合"
      ],
      "positive": [
        "结构顺畅时可体现支持、协作、传承和稳定责任"
      ],
      "negative": [
        "结构失衡时更容易出现边界、责任、资源或沟通压力"
      ],
      "realityChecks": [
        "现实核验具体由谁提供支持、承担责任和影响决策"
      ]
    },
    "advice": [
      "优先给可执行的家庭沟通和资源安排建议"
    ],
    "prohibitions": [
      "不能单一关系断父母离异、家庭不和或亲人有灾"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "42-75,251-270",
        "section": "十神、宫位、来源与六亲取象",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_advanced_2025",
        "pdfPage": "六亲目录页",
        "section": "父母、兄弟、子女章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "family",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "family_family_advice",
    "title": "六亲建议以沟通、责任和资源边界为主",
    "category": "family",
    "domains": [
      "parents",
      "siblings",
      "children"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 72,
    "gender": "all",
    "queryKeywords": [
      "家庭建议",
      "六亲建议"
    ],
    "trigger": {
      "featuresAny": [
        "家庭建议",
        "六亲建议"
      ],
      "tenGodsAny": [
        "正印",
        "偏印",
        "正财",
        "偏财",
        "比肩",
        "劫财",
        "食神",
        "伤官"
      ]
    },
    "requires": [
      "建议对应前文具体结构",
      "宫位、十神、来源和现实家庭结构共同验证"
    ],
    "weakeningConditions": [
      "人物星与宫位不一致",
      "现实中该家庭角色缺位或由他人承担"
    ],
    "imagery": {
      "core": [
        "六亲问题的建议应落到沟通频率、责任分配、经济边界、照护安排和现实支持"
      ],
      "positive": [
        "结构顺畅时可体现支持、协作、传承和稳定责任"
      ],
      "negative": [
        "结构失衡时更容易出现边界、责任、资源或沟通压力"
      ],
      "realityChecks": [
        "现实核验具体由谁提供支持、承担责任和影响决策"
      ]
    },
    "advice": [
      "优先给可执行的家庭沟通和资源安排建议"
    ],
    "prohibitions": [
      "不能以命盘替代医学、法律或家庭决策"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "42-75,251-270",
        "section": "十神、宫位、来源与六亲取象",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_advanced_2025",
        "pdfPage": "六亲目录页",
        "section": "父母、兄弟、子女章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "family",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "family_family_safety",
    "title": "六亲高风险结论边界",
    "category": "family",
    "domains": [
      "parents",
      "siblings",
      "children"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 71,
    "gender": "all",
    "queryKeywords": [
      "克父",
      "克母",
      "克子",
      "六亲灾"
    ],
    "trigger": {
      "featuresAny": [
        "克父",
        "克母",
        "克子",
        "六亲灾"
      ],
      "tenGodsAny": [
        "正印",
        "偏印",
        "正财",
        "偏财",
        "比肩",
        "劫财",
        "食神",
        "伤官"
      ]
    },
    "requires": [
      "涉及现实健康和安全必须建议专业评估",
      "宫位、十神、来源和现实家庭结构共同验证"
    ],
    "weakeningConditions": [
      "人物星与宫位不一致",
      "现实中该家庭角色缺位或由他人承担"
    ],
    "imagery": {
      "core": [
        "命盘只用于观察关系模式与阶段压力，不用于确认亲属疾病、死亡、事故和寿命"
      ],
      "positive": [
        "结构顺畅时可体现支持、协作、传承和稳定责任"
      ],
      "negative": [
        "结构失衡时更容易出现边界、责任、资源或沟通压力"
      ],
      "realityChecks": [
        "现实核验具体由谁提供支持、承担责任和影响决策"
      ]
    },
    "advice": [
      "优先给可执行的家庭沟通和资源安排建议"
    ],
    "prohibitions": [
      "禁止输出克父克母、克子女或具体灾期"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "42-75,251-270",
        "section": "十神、宫位、来源与六亲取象",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_advanced_2025",
        "pdfPage": "六亲目录页",
        "section": "父母、兄弟、子女章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "family",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "career_object_method",
    "title": "职业对象与工作方式分开判断",
    "category": "career",
    "domains": [
      "career"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 80,
    "gender": "all",
    "queryKeywords": [
      "职业",
      "对象",
      "方式"
    ],
    "trigger": {
      "featuresAny": [
        "职业",
        "对象",
        "方式"
      ],
      "tenGodsAny": [
        "正印",
        "偏印",
        "食神",
        "伤官",
        "正官",
        "七杀",
        "正财",
        "偏财",
        "比肩",
        "劫财"
      ]
    },
    "requires": [
      "五行物象说明对象，十神和做功说明方式，宫位说明环境",
      "职业对象、工作方式、组织环境和收入模式至少区分两层"
    ],
    "weakeningConditions": [
      "现实教育和经验不支持",
      "只有单一十神或五行线索"
    ],
    "imagery": {
      "core": [
        "职业取象要分别回答做什么对象、通过什么方式做、在什么组织环境承接"
      ],
      "positive": [
        "证据汇合时可形成较稳定的职业方式和发展方向"
      ],
      "negative": [
        "证据不全时容易把岗位、行业、职位和收入混为一谈"
      ],
      "realityChecks": [
        "核验实际工作每天在处理什么、如何产生价值、由谁付费、在哪种组织内"
      ]
    },
    "advice": [
      "优先给技能与平台选择建议，不一次列过多行业"
    ],
    "prohibitions": [
      "不能由一个十神或五行锁定唯一职业"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "271-277",
        "section": "职业取像",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "64-75,77-186",
        "section": "体用、财官与做工",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_advanced_2025",
        "pdfPage": "事业官命目录页",
        "section": "事业、官命、职业章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "career",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "career_skill_output",
    "title": "食伤做功偏技能、作品与服务",
    "category": "career",
    "domains": [
      "career"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 79,
    "gender": "all",
    "queryKeywords": [
      "食伤",
      "技术",
      "作品"
    ],
    "trigger": {
      "featuresAny": [
        "食伤",
        "技术",
        "作品"
      ],
      "tenGodsAny": [
        "正印",
        "偏印",
        "食神",
        "伤官",
        "正官",
        "七杀",
        "正财",
        "偏财",
        "比肩",
        "劫财"
      ]
    },
    "requires": [
      "食伤有根、有出口并能转成财官或成果",
      "职业对象、工作方式、组织环境和收入模式至少区分两层"
    ],
    "weakeningConditions": [
      "现实教育和经验不支持",
      "只有单一十神或五行线索"
    ],
    "imagery": {
      "core": [
        "食伤有效做功时，职业方式偏技术输出、产品、表达、服务、教学或解决问题"
      ],
      "positive": [
        "证据汇合时可形成较稳定的职业方式和发展方向"
      ],
      "negative": [
        "证据不全时容易把岗位、行业、职位和收入混为一谈"
      ],
      "realityChecks": [
        "核验实际工作每天在处理什么、如何产生价值、由谁付费、在哪种组织内"
      ]
    },
    "advice": [
      "优先给技能与平台选择建议，不一次列过多行业"
    ],
    "prohibitions": [
      "不能见食伤就断艺术、口才或自由职业"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "271-277",
        "section": "职业取像",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "64-75,77-186",
        "section": "体用、财官与做工",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_advanced_2025",
        "pdfPage": "事业官命目录页",
        "section": "事业、官命、职业章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "career",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "career_resource_platform",
    "title": "印星做功偏学习、资质与平台",
    "category": "career",
    "domains": [
      "career"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 78,
    "gender": "all",
    "queryKeywords": [
      "印星",
      "资质",
      "平台"
    ],
    "trigger": {
      "featuresAny": [
        "印星",
        "资质",
        "平台"
      ],
      "tenGodsAny": [
        "正印",
        "偏印",
        "食神",
        "伤官",
        "正官",
        "七杀",
        "正财",
        "偏财",
        "比肩",
        "劫财"
      ]
    },
    "requires": [
      "印能承接官杀或帮助日主，且不过度压制输出",
      "职业对象、工作方式、组织环境和收入模式至少区分两层"
    ],
    "weakeningConditions": [
      "现实教育和经验不支持",
      "只有单一十神或五行线索"
    ],
    "imagery": {
      "core": [
        "印星有效时，职业更依赖知识、证照、制度、研究、资料和组织支持"
      ],
      "positive": [
        "证据汇合时可形成较稳定的职业方式和发展方向"
      ],
      "negative": [
        "证据不全时容易把岗位、行业、职位和收入混为一谈"
      ],
      "realityChecks": [
        "核验实际工作每天在处理什么、如何产生价值、由谁付费、在哪种组织内"
      ]
    },
    "advice": [
      "优先给技能与平台选择建议，不一次列过多行业"
    ],
    "prohibitions": [
      "不能见印就断体制、公务员或高学历"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "271-277",
        "section": "职业取像",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "64-75,77-186",
        "section": "体用、财官与做工",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_advanced_2025",
        "pdfPage": "事业官命目录页",
        "section": "事业、官命、职业章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "career",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "career_official_role",
    "title": "官杀做功偏责任、管理与规则执行",
    "category": "career",
    "domains": [
      "career"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 77,
    "gender": "all",
    "queryKeywords": [
      "官杀",
      "职位",
      "管理"
    ],
    "trigger": {
      "featuresAny": [
        "官杀",
        "职位",
        "管理"
      ],
      "tenGodsAny": [
        "正印",
        "偏印",
        "食神",
        "伤官",
        "正官",
        "七杀",
        "正财",
        "偏财",
        "比肩",
        "劫财"
      ]
    },
    "requires": [
      "官杀有制化、日主承载得住并有组织接口",
      "职业对象、工作方式、组织环境和收入模式至少区分两层"
    ],
    "weakeningConditions": [
      "现实教育和经验不支持",
      "只有单一十神或五行线索"
    ],
    "imagery": {
      "core": [
        "官杀有效时，职业更强调责任、执行、竞争、风险和正式身份"
      ],
      "positive": [
        "证据汇合时可形成较稳定的职业方式和发展方向"
      ],
      "negative": [
        "证据不全时容易把岗位、行业、职位和收入混为一谈"
      ],
      "realityChecks": [
        "核验实际工作每天在处理什么、如何产生价值、由谁付费、在哪种组织内"
      ]
    },
    "advice": [
      "优先给技能与平台选择建议，不一次列过多行业"
    ],
    "prohibitions": [
      "不能见官杀就断有官职、当领导或受处罚"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "271-277",
        "section": "职业取像",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "64-75,77-186",
        "section": "体用、财官与做工",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_advanced_2025",
        "pdfPage": "事业官命目录页",
        "section": "事业、官命、职业章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "career",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "career_wealth_market",
    "title": "财星做功偏市场、客户与资源经营",
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
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 76,
    "gender": "all",
    "queryKeywords": [
      "财星",
      "市场",
      "客户"
    ],
    "trigger": {
      "featuresAny": [
        "财星",
        "市场",
        "客户"
      ],
      "tenGodsAny": [
        "正印",
        "偏印",
        "食神",
        "伤官",
        "正官",
        "七杀",
        "正财",
        "偏财",
        "比肩",
        "劫财"
      ]
    },
    "requires": [
      "财有来源、能进入主位并有体承接",
      "职业对象、工作方式、组织环境和收入模式至少区分两层"
    ],
    "weakeningConditions": [
      "现实教育和经验不支持",
      "只有单一十神或五行线索"
    ],
    "imagery": {
      "core": [
        "财星有效时，职业更关注客户、预算、交易、资源配置和现实回报"
      ],
      "positive": [
        "证据汇合时可形成较稳定的职业方式和发展方向"
      ],
      "negative": [
        "证据不全时容易把岗位、行业、职位和收入混为一谈"
      ],
      "realityChecks": [
        "核验实际工作每天在处理什么、如何产生价值、由谁付费、在哪种组织内"
      ]
    },
    "advice": [
      "优先给技能与平台选择建议，不一次列过多行业"
    ],
    "prohibitions": [
      "不能见财就断经商、销售或发财"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "271-277",
        "section": "职业取像",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "64-75,77-186",
        "section": "体用、财官与做工",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_advanced_2025",
        "pdfPage": "事业官命目录页",
        "section": "事业、官命、职业章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "career",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "career_peer_team",
    "title": "比劫做功偏团队、竞争与自主承担",
    "category": "career",
    "domains": [
      "career",
      "friends"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 80,
    "gender": "all",
    "queryKeywords": [
      "比劫",
      "团队",
      "竞争"
    ],
    "trigger": {
      "featuresAny": [
        "比劫",
        "团队",
        "竞争"
      ],
      "tenGodsAny": [
        "正印",
        "偏印",
        "食神",
        "伤官",
        "正官",
        "七杀",
        "正财",
        "偏财",
        "比肩",
        "劫财"
      ]
    },
    "requires": [
      "比劫受官印约束或有清晰分工",
      "职业对象、工作方式、组织环境和收入模式至少区分两层"
    ],
    "weakeningConditions": [
      "现实教育和经验不支持",
      "只有单一十神或五行线索"
    ],
    "imagery": {
      "core": [
        "比劫参与做功时，职业方式可能强调独立负责、同辈协作、项目竞争或资源整合"
      ],
      "positive": [
        "证据汇合时可形成较稳定的职业方式和发展方向"
      ],
      "negative": [
        "证据不全时容易把岗位、行业、职位和收入混为一谈"
      ],
      "realityChecks": [
        "核验实际工作每天在处理什么、如何产生价值、由谁付费、在哪种组织内"
      ]
    },
    "advice": [
      "优先给技能与平台选择建议，不一次列过多行业"
    ],
    "prohibitions": [
      "不能见比劫就断合伙、创业或竞争失败"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "271-277",
        "section": "职业取像",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "64-75,77-186",
        "section": "体用、财官与做工",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_advanced_2025",
        "pdfPage": "事业官命目录页",
        "section": "事业、官命、职业章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "career",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "career_technical",
    "title": "技术型岗位的结构条件",
    "category": "career",
    "domains": [
      "career"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 79,
    "gender": "all",
    "queryKeywords": [
      "技术",
      "工程师",
      "专业"
    ],
    "trigger": {
      "featuresAny": [
        "技术",
        "工程师",
        "专业"
      ],
      "tenGodsAny": [
        "正印",
        "偏印",
        "食神",
        "伤官",
        "正官",
        "七杀",
        "正财",
        "偏财",
        "比肩",
        "劫财"
      ]
    },
    "requires": [
      "至少有技能输出和专业承接两类独立证据",
      "职业对象、工作方式、组织环境和收入模式至少区分两层"
    ],
    "weakeningConditions": [
      "现实教育和经验不支持",
      "只有单一十神或五行线索"
    ],
    "imagery": {
      "core": [
        "技术岗位通常需要食伤输出、印星学习、金水工具信息或明确制化链条共同支持"
      ],
      "positive": [
        "证据汇合时可形成较稳定的职业方式和发展方向"
      ],
      "negative": [
        "证据不全时容易把岗位、行业、职位和收入混为一谈"
      ],
      "realityChecks": [
        "核验实际工作每天在处理什么、如何产生价值、由谁付费、在哪种组织内"
      ]
    },
    "advice": [
      "优先给技能与平台选择建议，不一次列过多行业"
    ],
    "prohibitions": [
      "不能只凭金水或食伤锁定程序员、工程师"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "271-277",
        "section": "职业取像",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "64-75,77-186",
        "section": "体用、财官与做工",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_advanced_2025",
        "pdfPage": "事业官命目录页",
        "section": "事业、官命、职业章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "career",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "career_research",
    "title": "研究咨询型岗位的结构条件",
    "category": "career",
    "domains": [
      "career"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 78,
    "gender": "all",
    "queryKeywords": [
      "研究",
      "咨询",
      "分析"
    ],
    "trigger": {
      "featuresAny": [
        "研究",
        "咨询",
        "分析"
      ],
      "tenGodsAny": [
        "正印",
        "偏印",
        "食神",
        "伤官",
        "正官",
        "七杀",
        "正财",
        "偏财",
        "比肩",
        "劫财"
      ]
    },
    "requires": [
      "印食能够衔接，输出不被过度压制",
      "职业对象、工作方式、组织环境和收入模式至少区分两层"
    ],
    "weakeningConditions": [
      "现实教育和经验不支持",
      "只有单一十神或五行线索"
    ],
    "imagery": {
      "core": [
        "研究咨询偏印星理解、食伤表达、信息流通和解决非标准问题"
      ],
      "positive": [
        "证据汇合时可形成较稳定的职业方式和发展方向"
      ],
      "negative": [
        "证据不全时容易把岗位、行业、职位和收入混为一谈"
      ],
      "realityChecks": [
        "核验实际工作每天在处理什么、如何产生价值、由谁付费、在哪种组织内"
      ]
    },
    "advice": [
      "优先给技能与平台选择建议，不一次列过多行业"
    ],
    "prohibitions": [
      "不能只凭偏印断研究、玄学或咨询"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "271-277",
        "section": "职业取像",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "64-75,77-186",
        "section": "体用、财官与做工",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_advanced_2025",
        "pdfPage": "事业官命目录页",
        "section": "事业、官命、职业章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "career",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "career_management",
    "title": "管理型岗位的结构条件",
    "category": "career",
    "domains": [
      "career"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 77,
    "gender": "all",
    "queryKeywords": [
      "管理",
      "领导",
      "项目管理"
    ],
    "trigger": {
      "featuresAny": [
        "管理",
        "领导",
        "项目管理"
      ],
      "tenGodsAny": [
        "正印",
        "偏印",
        "食神",
        "伤官",
        "正官",
        "七杀",
        "正财",
        "偏财",
        "比肩",
        "劫财"
      ]
    },
    "requires": [
      "日主承载、授权边界和组织环境匹配",
      "职业对象、工作方式、组织环境和收入模式至少区分两层"
    ],
    "weakeningConditions": [
      "现实教育和经验不支持",
      "只有单一十神或五行线索"
    ],
    "imagery": {
      "core": [
        "管理需要官杀责任、印星制度、财星资源和比劫团队中的至少两类共同承接"
      ],
      "positive": [
        "证据汇合时可形成较稳定的职业方式和发展方向"
      ],
      "negative": [
        "证据不全时容易把岗位、行业、职位和收入混为一谈"
      ],
      "realityChecks": [
        "核验实际工作每天在处理什么、如何产生价值、由谁付费、在哪种组织内"
      ]
    },
    "advice": [
      "优先给技能与平台选择建议，不一次列过多行业"
    ],
    "prohibitions": [
      "不能只凭官杀或身旺断管理能力"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "271-277",
        "section": "职业取像",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "64-75,77-186",
        "section": "体用、财官与做工",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_advanced_2025",
        "pdfPage": "事业官命目录页",
        "section": "事业、官命、职业章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "career",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "career_sales_market",
    "title": "销售商务型岗位的结构条件",
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
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 76,
    "gender": "all",
    "queryKeywords": [
      "销售",
      "商务",
      "客户"
    ],
    "trigger": {
      "featuresAny": [
        "销售",
        "商务",
        "客户"
      ],
      "tenGodsAny": [
        "正印",
        "偏印",
        "食神",
        "伤官",
        "正官",
        "七杀",
        "正财",
        "偏财",
        "比肩",
        "劫财"
      ]
    },
    "requires": [
      "有现实回报通道和持续客户承接",
      "职业对象、工作方式、组织环境和收入模式至少区分两层"
    ],
    "weakeningConditions": [
      "现实教育和经验不支持",
      "只有单一十神或五行线索"
    ],
    "imagery": {
      "core": [
        "销售商务需要财星客户资源、食伤表达、比劫人脉或水木流通等多项支持"
      ],
      "positive": [
        "证据汇合时可形成较稳定的职业方式和发展方向"
      ],
      "negative": [
        "证据不全时容易把岗位、行业、职位和收入混为一谈"
      ],
      "realityChecks": [
        "核验实际工作每天在处理什么、如何产生价值、由谁付费、在哪种组织内"
      ]
    },
    "advice": [
      "优先给技能与平台选择建议，不一次列过多行业"
    ],
    "prohibitions": [
      "不能只凭偏财或伤官断销售"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "271-277",
        "section": "职业取像",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "64-75,77-186",
        "section": "体用、财官与做工",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_advanced_2025",
        "pdfPage": "事业官命目录页",
        "section": "事业、官命、职业章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "career",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "career_public_system",
    "title": "体制与规范组织的结构条件",
    "category": "career",
    "domains": [
      "career"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 80,
    "gender": "all",
    "queryKeywords": [
      "体制",
      "公务员",
      "单位"
    ],
    "trigger": {
      "featuresAny": [
        "体制",
        "公务员",
        "单位"
      ],
      "tenGodsAny": [
        "正印",
        "偏印",
        "食神",
        "伤官",
        "正官",
        "七杀",
        "正财",
        "偏财",
        "比肩",
        "劫财"
      ]
    },
    "requires": [
      "官印角色和组织宫位真实有效",
      "职业对象、工作方式、组织环境和收入模式至少区分两层"
    ],
    "weakeningConditions": [
      "现实教育和经验不支持",
      "只有单一十神或五行线索"
    ],
    "imagery": {
      "core": [
        "规范组织更看官印链条、月柱环境、正式资质与稳定承接"
      ],
      "positive": [
        "证据汇合时可形成较稳定的职业方式和发展方向"
      ],
      "negative": [
        "证据不全时容易把岗位、行业、职位和收入混为一谈"
      ],
      "realityChecks": [
        "核验实际工作每天在处理什么、如何产生价值、由谁付费、在哪种组织内"
      ]
    },
    "advice": [
      "优先给技能与平台选择建议，不一次列过多行业"
    ],
    "prohibitions": [
      "不能见正官正印就断公务员"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "271-277",
        "section": "职业取像",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "64-75,77-186",
        "section": "体用、财官与做工",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_advanced_2025",
        "pdfPage": "事业官命目录页",
        "section": "事业、官命、职业章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "career",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "career_entrepreneurship",
    "title": "创业与自主经营的结构条件",
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
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 79,
    "gender": "all",
    "queryKeywords": [
      "创业",
      "自己干",
      "自由职业"
    ],
    "trigger": {
      "featuresAny": [
        "创业",
        "自己干",
        "自由职业"
      ],
      "tenGodsAny": [
        "正印",
        "偏印",
        "食神",
        "伤官",
        "正官",
        "七杀",
        "正财",
        "偏财",
        "比肩",
        "劫财"
      ]
    },
    "requires": [
      "现金流、客户、执行与团队至少多项具备",
      "职业对象、工作方式、组织环境和收入模式至少区分两层"
    ],
    "weakeningConditions": [
      "现实教育和经验不支持",
      "只有单一十神或五行线索"
    ],
    "imagery": {
      "core": [
        "自主经营通常需要命主体有力、食伤财星流通、资源边界和风险承接"
      ],
      "positive": [
        "证据汇合时可形成较稳定的职业方式和发展方向"
      ],
      "negative": [
        "证据不全时容易把岗位、行业、职位和收入混为一谈"
      ],
      "realityChecks": [
        "核验实际工作每天在处理什么、如何产生价值、由谁付费、在哪种组织内"
      ]
    },
    "advice": [
      "优先给技能与平台选择建议，不一次列过多行业"
    ],
    "prohibitions": [
      "不能只因比劫旺、伤官旺或无官就断创业"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "271-277",
        "section": "职业取像",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "64-75,77-186",
        "section": "体用、财官与做工",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_advanced_2025",
        "pdfPage": "事业官命目录页",
        "section": "事业、官命、职业章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "career",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "career_organization_size",
    "title": "平台规模与命主承载",
    "category": "career",
    "domains": [
      "career"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 78,
    "gender": "all",
    "queryKeywords": [
      "平台",
      "规模",
      "层次"
    ],
    "trigger": {
      "featuresAny": [
        "平台",
        "规模",
        "层次"
      ],
      "tenGodsAny": [
        "正印",
        "偏印",
        "食神",
        "伤官",
        "正官",
        "七杀",
        "正财",
        "偏财",
        "比肩",
        "劫财"
      ]
    },
    "requires": [
      "不能仅凭财官多或库大判断层次",
      "职业对象、工作方式、组织环境和收入模式至少区分两层"
    ],
    "weakeningConditions": [
      "现实教育和经验不支持",
      "只有单一十神或五行线索"
    ],
    "imagery": {
      "core": [
        "职业平台和项目规模取决于用的大小、体的承载、组织资源和做功效率"
      ],
      "positive": [
        "证据汇合时可形成较稳定的职业方式和发展方向"
      ],
      "negative": [
        "证据不全时容易把岗位、行业、职位和收入混为一谈"
      ],
      "realityChecks": [
        "核验实际工作每天在处理什么、如何产生价值、由谁付费、在哪种组织内"
      ]
    },
    "advice": [
      "优先给技能与平台选择建议，不一次列过多行业"
    ],
    "prohibitions": [
      "不能直接断公司规模、级别或收入"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "271-277",
        "section": "职业取像",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "64-75,77-186",
        "section": "体用、财官与做工",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_advanced_2025",
        "pdfPage": "事业官命目录页",
        "section": "事业、官命、职业章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "career",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "career_position_change",
    "title": "岗位调整需岁运新增依据",
    "category": "career",
    "domains": [
      "career"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 77,
    "gender": "all",
    "queryKeywords": [
      "岗位调整",
      "跳槽",
      "辞职"
    ],
    "trigger": {
      "featuresAny": [
        "岗位调整",
        "跳槽",
        "辞职"
      ],
      "tenGodsAny": [
        "正印",
        "偏印",
        "食神",
        "伤官",
        "正官",
        "七杀",
        "正财",
        "偏财",
        "比肩",
        "劫财"
      ]
    },
    "requires": [
      "至少一条流年新增依据和一条原局承接依据",
      "职业对象、工作方式、组织环境和收入模式至少区分两层"
    ],
    "weakeningConditions": [
      "现实教育和经验不支持",
      "只有单一十神或五行线索"
    ],
    "imagery": {
      "core": [
        "岗位变化候选需大运背景、流年新增作用和工作宫位或职业链条被引动"
      ],
      "positive": [
        "证据汇合时可形成较稳定的职业方式和发展方向"
      ],
      "negative": [
        "证据不全时容易把岗位、行业、职位和收入混为一谈"
      ],
      "realityChecks": [
        "核验实际工作每天在处理什么、如何产生价值、由谁付费、在哪种组织内"
      ]
    },
    "advice": [
      "优先给技能与平台选择建议，不一次列过多行业"
    ],
    "prohibitions": [
      "不能仅凭冲合或伤官见官断辞职"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "271-277",
        "section": "职业取像",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "64-75,77-186",
        "section": "体用、财官与做工",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_advanced_2025",
        "pdfPage": "事业官命目录页",
        "section": "事业、官命、职业章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "career",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "career_promotion",
    "title": "升职与责任增加区分",
    "category": "career",
    "domains": [
      "career"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 76,
    "gender": "all",
    "queryKeywords": [
      "升职",
      "职位",
      "官运"
    ],
    "trigger": {
      "featuresAny": [
        "升职",
        "职位",
        "官运"
      ],
      "tenGodsAny": [
        "正印",
        "偏印",
        "食神",
        "伤官",
        "正官",
        "七杀",
        "正财",
        "偏财",
        "比肩",
        "劫财"
      ]
    },
    "requires": [
      "正式身份与组织承接明确",
      "职业对象、工作方式、组织环境和收入模式至少区分两层"
    ],
    "weakeningConditions": [
      "现实教育和经验不支持",
      "只有单一十神或五行线索"
    ],
    "imagery": {
      "core": [
        "官星或职责增强可能只是任务、考核和责任增加，是否升职还需身份、平台、资源和现实流程"
      ],
      "positive": [
        "证据汇合时可形成较稳定的职业方式和发展方向"
      ],
      "negative": [
        "证据不全时容易把岗位、行业、职位和收入混为一谈"
      ],
      "realityChecks": [
        "核验实际工作每天在处理什么、如何产生价值、由谁付费、在哪种组织内"
      ]
    },
    "advice": [
      "优先给技能与平台选择建议，不一次列过多行业"
    ],
    "prohibitions": [
      "不能把官杀增强直接等同于升职"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "271-277",
        "section": "职业取像",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "64-75,77-186",
        "section": "体用、财官与做工",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_advanced_2025",
        "pdfPage": "事业官命目录页",
        "section": "事业、官命、职业章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "career",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "career_job_loss",
    "title": "工作受阻与丢职区分",
    "category": "career",
    "domains": [
      "career"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 80,
    "gender": "all",
    "queryKeywords": [
      "丢工作",
      "失业",
      "处分"
    ],
    "trigger": {
      "featuresAny": [
        "丢工作",
        "失业",
        "处分"
      ],
      "tenGodsAny": [
        "正印",
        "偏印",
        "食神",
        "伤官",
        "正官",
        "七杀",
        "正财",
        "偏财",
        "比肩",
        "劫财"
      ]
    },
    "requires": [
      "大运、流年、官印食伤链条共同受损",
      "职业对象、工作方式、组织环境和收入模式至少区分两层"
    ],
    "weakeningConditions": [
      "现实教育和经验不支持",
      "只有单一十神或五行线索"
    ],
    "imagery": {
      "core": [
        "职业链条受制可提示压力、调整或岗位不稳，但丢职需多层独立依据和现实制度背景"
      ],
      "positive": [
        "证据汇合时可形成较稳定的职业方式和发展方向"
      ],
      "negative": [
        "证据不全时容易把岗位、行业、职位和收入混为一谈"
      ],
      "realityChecks": [
        "核验实际工作每天在处理什么、如何产生价值、由谁付费、在哪种组织内"
      ]
    },
    "advice": [
      "优先给技能与平台选择建议，不一次列过多行业"
    ],
    "prohibitions": [
      "不能用伤官见官、财破印等单条规则断失业处分"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "271-277",
        "section": "职业取像",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "64-75,77-186",
        "section": "体用、财官与做工",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_advanced_2025",
        "pdfPage": "事业官命目录页",
        "section": "事业、官命、职业章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "career",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "career_work_environment",
    "title": "工作环境与岗位内容分开",
    "category": "career",
    "domains": [
      "career"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 79,
    "gender": "all",
    "queryKeywords": [
      "月柱",
      "工作环境",
      "岗位"
    ],
    "trigger": {
      "featuresAny": [
        "月柱",
        "工作环境",
        "岗位"
      ],
      "tenGodsAny": [
        "正印",
        "偏印",
        "食神",
        "伤官",
        "正官",
        "七杀",
        "正财",
        "偏财",
        "比肩",
        "劫财"
      ]
    },
    "requires": [
      "同时读取宫位和做功",
      "职业对象、工作方式、组织环境和收入模式至少区分两层"
    ],
    "weakeningConditions": [
      "现实教育和经验不支持",
      "只有单一十神或五行线索"
    ],
    "imagery": {
      "core": [
        "月柱和官印更多说明组织环境，食伤财官做功更多说明工作内容，两者可能不同"
      ],
      "positive": [
        "证据汇合时可形成较稳定的职业方式和发展方向"
      ],
      "negative": [
        "证据不全时容易把岗位、行业、职位和收入混为一谈"
      ],
      "realityChecks": [
        "核验实际工作每天在处理什么、如何产生价值、由谁付费、在哪种组织内"
      ]
    },
    "advice": [
      "优先给技能与平台选择建议，不一次列过多行业"
    ],
    "prohibitions": [
      "不能把单位性质直接当职业内容"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "271-277",
        "section": "职业取像",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "64-75,77-186",
        "section": "体用、财官与做工",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_advanced_2025",
        "pdfPage": "事业官命目录页",
        "section": "事业、官命、职业章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "career",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "career_career_timing",
    "title": "职业应期按大运—流年—流月分层",
    "category": "career",
    "domains": [
      "career"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 78,
    "gender": "all",
    "queryKeywords": [
      "职业应期",
      "大运",
      "流年"
    ],
    "trigger": {
      "featuresAny": [
        "职业应期",
        "大运",
        "流年"
      ],
      "tenGodsAny": [
        "正印",
        "偏印",
        "食神",
        "伤官",
        "正官",
        "七杀",
        "正财",
        "偏财",
        "比肩",
        "劫财"
      ]
    },
    "requires": [
      "交运年分段且必须有对应时间数据",
      "职业对象、工作方式、组织环境和收入模式至少区分两层"
    ],
    "weakeningConditions": [
      "现实教育和经验不支持",
      "只有单一十神或五行线索"
    ],
    "imagery": {
      "core": [
        "大运决定职业阶段，流年触发岗位项目或身份变化，流月仅在明确询问时细化"
      ],
      "positive": [
        "证据汇合时可形成较稳定的职业方式和发展方向"
      ],
      "negative": [
        "证据不全时容易把岗位、行业、职位和收入混为一谈"
      ],
      "realityChecks": [
        "核验实际工作每天在处理什么、如何产生价值、由谁付费、在哪种组织内"
      ]
    },
    "advice": [
      "优先给技能与平台选择建议，不一次列过多行业"
    ],
    "prohibitions": [
      "不能自行编月份或未扫描年份"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "271-277",
        "section": "职业取像",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "64-75,77-186",
        "section": "体用、财官与做工",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_advanced_2025",
        "pdfPage": "事业官命目录页",
        "section": "事业、官命、职业章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "career",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "career_career_reality_check",
    "title": "职业取象需现实背景校准",
    "category": "career",
    "domains": [
      "career"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 77,
    "gender": "all",
    "queryKeywords": [
      "教育背景",
      "经验",
      "地区",
      "行业"
    ],
    "trigger": {
      "featuresAny": [
        "教育背景",
        "经验",
        "地区",
        "行业"
      ],
      "tenGodsAny": [
        "正印",
        "偏印",
        "食神",
        "伤官",
        "正官",
        "七杀",
        "正财",
        "偏财",
        "比肩",
        "劫财"
      ]
    },
    "requires": [
      "结合用户已有技能和现实机会",
      "职业对象、工作方式、组织环境和收入模式至少区分两层"
    ],
    "weakeningConditions": [
      "现实教育和经验不支持",
      "只有单一十神或五行线索"
    ],
    "imagery": {
      "core": [
        "同一命盘可在不同教育、地区、行业和家庭条件下落成不同职业，规则只提供方向与方式"
      ],
      "positive": [
        "证据汇合时可形成较稳定的职业方式和发展方向"
      ],
      "negative": [
        "证据不全时容易把岗位、行业、职位和收入混为一谈"
      ],
      "realityChecks": [
        "核验实际工作每天在处理什么、如何产生价值、由谁付费、在哪种组织内"
      ]
    },
    "advice": [
      "优先给技能与平台选择建议，不一次列过多行业"
    ],
    "prohibitions": [
      "不能把命理职业建议替代现实求职评估"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "271-277",
        "section": "职业取像",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "64-75,77-186",
        "section": "体用、财官与做工",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_advanced_2025",
        "pdfPage": "事业官命目录页",
        "section": "事业、官命、职业章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "career",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "career_career_advice",
    "title": "职业建议围绕能力转化与风险边界",
    "category": "career",
    "domains": [
      "career"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 76,
    "gender": "all",
    "queryKeywords": [
      "职业建议",
      "发展方向"
    ],
    "trigger": {
      "featuresAny": [
        "职业建议",
        "发展方向"
      ],
      "tenGodsAny": [
        "正印",
        "偏印",
        "食神",
        "伤官",
        "正官",
        "七杀",
        "正财",
        "偏财",
        "比肩",
        "劫财"
      ]
    },
    "requires": [
      "每条建议能对应至少一个命理判断与现实动作",
      "职业对象、工作方式、组织环境和收入模式至少区分两层"
    ],
    "weakeningConditions": [
      "现实教育和经验不支持",
      "只有单一十神或五行线索"
    ],
    "imagery": {
      "core": [
        "建议应对应主象，落到技能、作品、资质、沟通、平台、客户、团队和风险管理"
      ],
      "positive": [
        "证据汇合时可形成较稳定的职业方式和发展方向"
      ],
      "negative": [
        "证据不全时容易把岗位、行业、职位和收入混为一谈"
      ],
      "realityChecks": [
        "核验实际工作每天在处理什么、如何产生价值、由谁付费、在哪种组织内"
      ]
    },
    "advice": [
      "优先给技能与平台选择建议，不一次列过多行业"
    ],
    "prohibitions": [
      "不能只给五行颜色、方位或空泛行业名单"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "271-277",
        "section": "职业取像",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "64-75,77-186",
        "section": "体用、财官与做工",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_advanced_2025",
        "pdfPage": "事业官命目录页",
        "section": "事业、官命、职业章节目录",
        "verificationStatus": "outline_verified"
      }
    ],
    "module": "career",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "wealth_source",
    "title": "财富先看来源与归属",
    "category": "wealth",
    "domains": [
      "wealth"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 78,
    "gender": "all",
    "queryKeywords": [
      "财源",
      "来源",
      "归属"
    ],
    "trigger": {
      "featuresAny": [
        "财源",
        "来源",
        "归属"
      ],
      "tenGodsAny": [
        "正财",
        "偏财",
        "食神",
        "伤官",
        "比肩",
        "劫财"
      ]
    },
    "requires": [
      "有明确根基、宫位和做功路径",
      "结合宾主体用、宫位和现实财务背景"
    ],
    "weakeningConditions": [
      "资源虽出现但归属不明",
      "做功路径中断或承载不足"
    ],
    "imagery": {
      "core": [
        "财星、财库或资源必须追查从哪里来、属于谁、如何进入主位"
      ],
      "positive": [
        "条件完整时可判断收入方式、资源来源和阶段机会"
      ],
      "negative": [
        "失衡时更易出现现金流、分配、成本或机会筛选压力"
      ],
      "realityChecks": [
        "核验收入来自工资、项目、资产、客户还是家庭支持"
      ]
    },
    "advice": [
      "优先建立预算、合同、现金流和风险缓冲"
    ],
    "prohibitions": [
      "不能见财星就断命主可得"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "42-75,77-186,226-250",
        "section": "财星、体用、做功与岁运",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "271-277",
        "section": "职业与财富像法",
        "verificationStatus": "confirmed"
      }
    ],
    "module": "wealth",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "wealth_capacity",
    "title": "财富规模与承载能力",
    "category": "wealth",
    "domains": [
      "wealth",
      "career"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 77,
    "gender": "all",
    "queryKeywords": [
      "财富量",
      "承载",
      "体用"
    ],
    "trigger": {
      "featuresAny": [
        "财富量",
        "承载",
        "体用"
      ],
      "tenGodsAny": [
        "正财",
        "偏财",
        "食神",
        "伤官",
        "比肩",
        "劫财"
      ]
    },
    "requires": [
      "比较体用力量和做功效率",
      "结合宾主体用、宫位和现实财务背景"
    ],
    "weakeningConditions": [
      "资源虽出现但归属不明",
      "做功路径中断或承载不足"
    ],
    "imagery": {
      "core": [
        "资源机会大小与命主体、平台、团队和现金流承载共同决定"
      ],
      "positive": [
        "条件完整时可判断收入方式、资源来源和阶段机会"
      ],
      "negative": [
        "失衡时更易出现现金流、分配、成本或机会筛选压力"
      ],
      "realityChecks": [
        "核验收入来自工资、项目、资产、客户还是家庭支持"
      ]
    },
    "advice": [
      "优先建立预算、合同、现金流和风险缓冲"
    ],
    "prohibitions": [
      "不能以财多、库多或官杀多直接断大富"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "42-75,77-186,226-250",
        "section": "财星、体用、做功与岁运",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "271-277",
        "section": "职业与财富像法",
        "verificationStatus": "confirmed"
      }
    ],
    "module": "wealth",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "wealth_stable_income",
    "title": "稳定收入的结构候选",
    "category": "wealth",
    "domains": [
      "wealth",
      "career"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 76,
    "gender": "all",
    "queryKeywords": [
      "工资",
      "稳定收入",
      "正财"
    ],
    "trigger": {
      "featuresAny": [
        "工资",
        "稳定收入",
        "正财"
      ],
      "tenGodsAny": [
        "正财",
        "偏财",
        "食神",
        "伤官",
        "比肩",
        "劫财"
      ]
    },
    "requires": [
      "至少有持续价值输出和稳定支付来源",
      "结合宾主体用、宫位和现实财务背景"
    ],
    "weakeningConditions": [
      "资源虽出现但归属不明",
      "做功路径中断或承载不足"
    ],
    "imagery": {
      "core": [
        "稳定收入更看正财、官印、持续食伤输出和组织承接的组合"
      ],
      "positive": [
        "条件完整时可判断收入方式、资源来源和阶段机会"
      ],
      "negative": [
        "失衡时更易出现现金流、分配、成本或机会筛选压力"
      ],
      "realityChecks": [
        "核验收入来自工资、项目、资产、客户还是家庭支持"
      ]
    },
    "advice": [
      "优先建立预算、合同、现金流和风险缓冲"
    ],
    "prohibitions": [
      "不能只见正财就断工资高"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "42-75,77-186,226-250",
        "section": "财星、体用、做功与岁运",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "271-277",
        "section": "职业与财富像法",
        "verificationStatus": "confirmed"
      }
    ],
    "module": "wealth",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "wealth_variable_income",
    "title": "项目与流动收入候选",
    "category": "wealth",
    "domains": [
      "wealth",
      "career"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 75,
    "gender": "all",
    "queryKeywords": [
      "偏财",
      "项目收入",
      "机会"
    ],
    "trigger": {
      "featuresAny": [
        "偏财",
        "项目收入",
        "机会"
      ],
      "tenGodsAny": [
        "正财",
        "偏财",
        "食神",
        "伤官",
        "比肩",
        "劫财"
      ]
    },
    "requires": [
      "有食伤、人脉或交易通道，并能控制风险",
      "结合宾主体用、宫位和现实财务背景"
    ],
    "weakeningConditions": [
      "资源虽出现但归属不明",
      "做功路径中断或承载不足"
    ],
    "imagery": {
      "core": [
        "偏财、人脉、项目和流动资源可提示非固定收入，但波动和筛选成本也更高"
      ],
      "positive": [
        "条件完整时可判断收入方式、资源来源和阶段机会"
      ],
      "negative": [
        "失衡时更易出现现金流、分配、成本或机会筛选压力"
      ],
      "realityChecks": [
        "核验收入来自工资、项目、资产、客户还是家庭支持"
      ]
    },
    "advice": [
      "优先建立预算、合同、现金流和风险缓冲"
    ],
    "prohibitions": [
      "不能见偏财就断横财、投机或中奖"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "42-75,77-186,226-250",
        "section": "财星、体用、做功与岁运",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "271-277",
        "section": "职业与财富像法",
        "verificationStatus": "confirmed"
      }
    ],
    "module": "wealth",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "wealth_output_to_money",
    "title": "技能成果转化为收入",
    "category": "wealth",
    "domains": [
      "wealth",
      "career"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 78,
    "gender": "all",
    "queryKeywords": [
      "食伤生财",
      "变现",
      "作品"
    ],
    "trigger": {
      "featuresAny": [
        "食伤生财",
        "变现",
        "作品"
      ],
      "tenGodsAny": [
        "正财",
        "偏财",
        "食神",
        "伤官",
        "比肩",
        "劫财"
      ]
    },
    "requires": [
      "食伤财星链条连续，财归命主并有市场承接",
      "结合宾主体用、宫位和现实财务背景"
    ],
    "weakeningConditions": [
      "资源虽出现但归属不明",
      "做功路径中断或承载不足"
    ],
    "imagery": {
      "core": [
        "食伤通过产品、服务、表达和技术进入财星，构成能力变现候选"
      ],
      "positive": [
        "条件完整时可判断收入方式、资源来源和阶段机会"
      ],
      "negative": [
        "失衡时更易出现现金流、分配、成本或机会筛选压力"
      ],
      "realityChecks": [
        "核验收入来自工资、项目、资产、客户还是家庭支持"
      ]
    },
    "advice": [
      "优先建立预算、合同、现金流和风险缓冲"
    ],
    "prohibitions": [
      "不能只见食伤财星同现就断能变现"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "42-75,77-186,226-250",
        "section": "财星、体用、做功与岁运",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "271-277",
        "section": "职业与财富像法",
        "verificationStatus": "confirmed"
      }
    ],
    "module": "wealth",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "wealth_resource_to_money",
    "title": "资质平台转化为收入",
    "category": "wealth",
    "domains": [
      "wealth",
      "career"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 77,
    "gender": "all",
    "queryKeywords": [
      "印星",
      "平台",
      "收入"
    ],
    "trigger": {
      "featuresAny": [
        "印星",
        "平台",
        "收入"
      ],
      "tenGodsAny": [
        "正财",
        "偏财",
        "食神",
        "伤官",
        "比肩",
        "劫财"
      ]
    },
    "requires": [
      "印不压制输出，平台有真实支付与晋升通道",
      "结合宾主体用、宫位和现实财务背景"
    ],
    "weakeningConditions": [
      "资源虽出现但归属不明",
      "做功路径中断或承载不足"
    ],
    "imagery": {
      "core": [
        "印星通过资质、专业、组织平台或知识产权转化为收入，需要财官或食伤接口"
      ],
      "positive": [
        "条件完整时可判断收入方式、资源来源和阶段机会"
      ],
      "negative": [
        "失衡时更易出现现金流、分配、成本或机会筛选压力"
      ],
      "realityChecks": [
        "核验收入来自工资、项目、资产、客户还是家庭支持"
      ]
    },
    "advice": [
      "优先建立预算、合同、现金流和风险缓冲"
    ],
    "prohibitions": [
      "不能见印就断靠学历赚钱"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "42-75,77-186,226-250",
        "section": "财星、体用、做功与岁运",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "271-277",
        "section": "职业与财富像法",
        "verificationStatus": "confirmed"
      }
    ],
    "module": "wealth",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "wealth_peer_distribution",
    "title": "合作分配与比劫边界",
    "category": "wealth",
    "domains": [
      "wealth",
      "friends"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 76,
    "gender": "all",
    "queryKeywords": [
      "比劫",
      "分成",
      "合作"
    ],
    "trigger": {
      "featuresAny": [
        "比劫",
        "分成",
        "合作"
      ],
      "tenGodsAny": [
        "正财",
        "偏财",
        "食神",
        "伤官",
        "比肩",
        "劫财"
      ]
    },
    "requires": [
      "合同、权责和回流清楚，官印可约束分配",
      "结合宾主体用、宫位和现实财务背景"
    ],
    "weakeningConditions": [
      "资源虽出现但归属不明",
      "做功路径中断或承载不足"
    ],
    "imagery": {
      "core": [
        "比劫参与财星时，财富主题常伴随合伙、团队、同辈竞争和分配机制"
      ],
      "positive": [
        "条件完整时可判断收入方式、资源来源和阶段机会"
      ],
      "negative": [
        "失衡时更易出现现金流、分配、成本或机会筛选压力"
      ],
      "realityChecks": [
        "核验收入来自工资、项目、资产、客户还是家庭支持"
      ]
    },
    "advice": [
      "优先建立预算、合同、现金流和风险缓冲"
    ],
    "prohibitions": [
      "不能直接断破财、被骗或朋友夺财"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "42-75,77-186,226-250",
        "section": "财星、体用、做功与岁运",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "271-277",
        "section": "职业与财富像法",
        "verificationStatus": "confirmed"
      }
    ],
    "module": "wealth",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "wealth_wealth_storage",
    "title": "财库的存在、打开与承接",
    "category": "wealth",
    "domains": [
      "wealth",
      "property"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 75,
    "gender": "all",
    "queryKeywords": [
      "财库",
      "开库",
      "墓库"
    ],
    "trigger": {
      "featuresAny": [
        "财库",
        "开库",
        "墓库"
      ],
      "tenGodsAny": [
        "正财",
        "偏财",
        "食神",
        "伤官",
        "比肩",
        "劫财"
      ]
    },
    "requires": [
      "库中确有财星并有取得路径",
      "结合宾主体用、宫位和现实财务背景"
    ],
    "weakeningConditions": [
      "资源虽出现但归属不明",
      "做功路径中断或承载不足"
    ],
    "imagery": {
      "core": [
        "财库只说明资源收纳候选，需确认库中财、归属、开库方式和承载能力"
      ],
      "positive": [
        "条件完整时可判断收入方式、资源来源和阶段机会"
      ],
      "negative": [
        "失衡时更易出现现金流、分配、成本或机会筛选压力"
      ],
      "realityChecks": [
        "核验收入来自工资、项目、资产、客户还是家庭支持"
      ]
    },
    "advice": [
      "优先建立预算、合同、现金流和风险缓冲"
    ],
    "prohibitions": [
      "不能见财库就断不动产、大额财富或发财"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "42-75,77-186,226-250",
        "section": "财星、体用、做功与岁运",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "271-277",
        "section": "职业与财富像法",
        "verificationStatus": "confirmed"
      }
    ],
    "module": "wealth",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "wealth_wealth_loss",
    "title": "损耗与破财需多条件",
    "category": "wealth",
    "domains": [
      "wealth"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 78,
    "gender": "all",
    "queryKeywords": [
      "破财",
      "损失",
      "财受制"
    ],
    "trigger": {
      "featuresAny": [
        "破财",
        "损失",
        "财受制"
      ],
      "tenGodsAny": [
        "正财",
        "偏财",
        "食神",
        "伤官",
        "比肩",
        "劫财"
      ]
    },
    "requires": [
      "至少两条独立结构且有流年新增作用",
      "结合宾主体用、宫位和现实财务背景"
    ],
    "weakeningConditions": [
      "资源虽出现但归属不明",
      "做功路径中断或承载不足"
    ],
    "imagery": {
      "core": [
        "财星外流、被制、比劫竞争或库损可提示成本和损耗，但实际破财需岁运触发与现实风险"
      ],
      "positive": [
        "条件完整时可判断收入方式、资源来源和阶段机会"
      ],
      "negative": [
        "失衡时更易出现现金流、分配、成本或机会筛选压力"
      ],
      "realityChecks": [
        "核验收入来自工资、项目、资产、客户还是家庭支持"
      ]
    },
    "advice": [
      "优先建立预算、合同、现金流和风险缓冲"
    ],
    "prohibitions": [
      "不能凭单一劫财、冲财或财破印断破财"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "42-75,77-186,226-250",
        "section": "财星、体用、做功与岁运",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "271-277",
        "section": "职业与财富像法",
        "verificationStatus": "confirmed"
      }
    ],
    "module": "wealth",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "wealth_investment",
    "title": "投资风险不以偏财单断",
    "category": "wealth",
    "domains": [
      "wealth"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 77,
    "gender": "all",
    "queryKeywords": [
      "投资",
      "理财",
      "偏财"
    ],
    "trigger": {
      "featuresAny": [
        "投资",
        "理财",
        "偏财"
      ],
      "tenGodsAny": [
        "正财",
        "偏财",
        "食神",
        "伤官",
        "比肩",
        "劫财"
      ]
    },
    "requires": [
      "现实风险承受能力和专业信息优先",
      "结合宾主体用、宫位和现实财务背景"
    ],
    "weakeningConditions": [
      "资源虽出现但归属不明",
      "做功路径中断或承载不足"
    ],
    "imagery": {
      "core": [
        "投资取象需财星、食伤信息、比劫竞争、官杀风险和现实现金流共同评估"
      ],
      "positive": [
        "条件完整时可判断收入方式、资源来源和阶段机会"
      ],
      "negative": [
        "失衡时更易出现现金流、分配、成本或机会筛选压力"
      ],
      "realityChecks": [
        "核验收入来自工资、项目、资产、客户还是家庭支持"
      ]
    },
    "advice": [
      "优先建立预算、合同、现金流和风险缓冲"
    ],
    "prohibitions": [
      "不能给具体买卖、彩票、号码或收益保证"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "42-75,77-186,226-250",
        "section": "财星、体用、做功与岁运",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "271-277",
        "section": "职业与财富像法",
        "verificationStatus": "confirmed"
      }
    ],
    "module": "wealth",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "wealth_property",
    "title": "房产与资产承载",
    "category": "wealth",
    "domains": [
      "wealth",
      "property"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 76,
    "gender": "all",
    "queryKeywords": [
      "房产",
      "不动产",
      "土",
      "库"
    ],
    "trigger": {
      "featuresAny": [
        "房产",
        "不动产",
        "土",
        "库"
      ],
      "tenGodsAny": [
        "正财",
        "偏财",
        "食神",
        "伤官",
        "比肩",
        "劫财"
      ]
    },
    "requires": [
      "至少有资产承载和现实资金两类证据",
      "结合宾主体用、宫位和现实财务背景"
    ],
    "weakeningConditions": [
      "资源虽出现但归属不明",
      "做功路径中断或承载不足"
    ],
    "imagery": {
      "core": [
        "房产资产需看土、财、印、库、日时承接和岁运引动的多项汇合"
      ],
      "positive": [
        "条件完整时可判断收入方式、资源来源和阶段机会"
      ],
      "negative": [
        "失衡时更易出现现金流、分配、成本或机会筛选压力"
      ],
      "realityChecks": [
        "核验收入来自工资、项目、资产、客户还是家庭支持"
      ]
    },
    "advice": [
      "优先建立预算、合同、现金流和风险缓冲"
    ],
    "prohibitions": [
      "不能见土或墓库就断买房卖房"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "42-75,77-186,226-250",
        "section": "财星、体用、做功与岁运",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "271-277",
        "section": "职业与财富像法",
        "verificationStatus": "confirmed"
      }
    ],
    "module": "wealth",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "wealth_wealth_timing",
    "title": "财富应期由阶段与年度触发",
    "category": "wealth",
    "domains": [
      "wealth"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 75,
    "gender": "all",
    "queryKeywords": [
      "发财应期",
      "大运",
      "流年"
    ],
    "trigger": {
      "featuresAny": [
        "发财应期",
        "大运",
        "流年"
      ],
      "tenGodsAny": [
        "正财",
        "偏财",
        "食神",
        "伤官",
        "比肩",
        "劫财"
      ]
    },
    "requires": [
      "流年新增依据、原局承接和现实机会同时存在",
      "结合宾主体用、宫位和现实财务背景"
    ],
    "weakeningConditions": [
      "资源虽出现但归属不明",
      "做功路径中断或承载不足"
    ],
    "imagery": {
      "core": [
        "大运先提供资源和做功背景，流年再触发财星、财库或变现通道"
      ],
      "positive": [
        "条件完整时可判断收入方式、资源来源和阶段机会"
      ],
      "negative": [
        "失衡时更易出现现金流、分配、成本或机会筛选压力"
      ],
      "realityChecks": [
        "核验收入来自工资、项目、资产、客户还是家庭支持"
      ]
    },
    "advice": [
      "优先建立预算、合同、现金流和风险缓冲"
    ],
    "prohibitions": [
      "不能指定金额、月份或保证盈利"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "42-75,77-186,226-250",
        "section": "财星、体用、做功与岁运",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "271-277",
        "section": "职业与财富像法",
        "verificationStatus": "confirmed"
      }
    ],
    "module": "wealth",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "wealth_wealth_reality",
    "title": "财富建议服从现实财务原则",
    "category": "wealth",
    "domains": [
      "wealth"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 78,
    "gender": "all",
    "queryKeywords": [
      "预算",
      "现金流",
      "风险"
    ],
    "trigger": {
      "featuresAny": [
        "预算",
        "现金流",
        "风险"
      ],
      "tenGodsAny": [
        "正财",
        "偏财",
        "食神",
        "伤官",
        "比肩",
        "劫财"
      ]
    },
    "requires": [
      "建议低风险且可执行",
      "结合宾主体用、宫位和现实财务背景"
    ],
    "weakeningConditions": [
      "资源虽出现但归属不明",
      "做功路径中断或承载不足"
    ],
    "imagery": {
      "core": [
        "命理财富建议只能用于提醒收入方式、合作边界和风险节奏，现实预算、合同和专业建议优先"
      ],
      "positive": [
        "条件完整时可判断收入方式、资源来源和阶段机会"
      ],
      "negative": [
        "失衡时更易出现现金流、分配、成本或机会筛选压力"
      ],
      "realityChecks": [
        "核验收入来自工资、项目、资产、客户还是家庭支持"
      ]
    },
    "advice": [
      "优先建立预算、合同、现金流和风险缓冲"
    ],
    "prohibitions": [
      "不能代替金融顾问、法律合同或投资决策"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "42-75,77-186,226-250",
        "section": "财星、体用、做功与岁运",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "271-277",
        "section": "职业与财富像法",
        "verificationStatus": "confirmed"
      }
    ],
    "module": "wealth",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "wealth_wealth_not_morality",
    "title": "财星不等于品德或感情好坏",
    "category": "wealth",
    "domains": [
      "wealth",
      "spouse"
    ],
    "scopes": [
      "natal",
      "luck",
      "year"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 77,
    "gender": "all",
    "queryKeywords": [
      "财星",
      "品德",
      "婚姻"
    ],
    "trigger": {
      "featuresAny": [
        "财星",
        "品德",
        "婚姻"
      ],
      "tenGodsAny": [
        "正财",
        "偏财",
        "食神",
        "伤官",
        "比肩",
        "劫财"
      ]
    },
    "requires": [
      "结合全局结构和现实行为",
      "结合宾主体用、宫位和现实财务背景"
    ],
    "weakeningConditions": [
      "资源虽出现但归属不明",
      "做功路径中断或承载不足"
    ],
    "imagery": {
      "core": [
        "财星说明现实资源、责任和关系对象候选，不代表贪财、花心、贤惠或婚姻质量"
      ],
      "positive": [
        "条件完整时可判断收入方式、资源来源和阶段机会"
      ],
      "negative": [
        "失衡时更易出现现金流、分配、成本或机会筛选压力"
      ],
      "realityChecks": [
        "核验收入来自工资、项目、资产、客户还是家庭支持"
      ]
    },
    "advice": [
      "优先建立预算、合同、现金流和风险缓冲"
    ],
    "prohibitions": [
      "不能以财多财少评价人格或伴侣"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "42-75,77-186,226-250",
        "section": "财星、体用、做功与岁运",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "271-277",
        "section": "职业与财富像法",
        "verificationStatus": "confirmed"
      }
    ],
    "module": "wealth",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "health_traditional_state",
    "title": "健康只作传统状态与压力提示",
    "category": "health_state",
    "domains": [
      "health"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 90,
    "gender": "all",
    "queryKeywords": [
      "健康",
      "体质",
      "状态"
    ],
    "trigger": {
      "featuresAny": [
        "健康",
        "体质",
        "状态"
      ]
    },
    "requires": [
      "结合现实症状和医学评估",
      "健康问题优先依据用户现实描述和专业医疗信息"
    ],
    "weakeningConditions": [
      "没有现实不适或压力证据",
      "命理信号只来自单一关系"
    ],
    "imagery": {
      "core": [
        "命理可讨论寒热燥湿、压力、作息、恢复和安全倾向，不确认具体疾病"
      ],
      "positive": [
        "用于提醒作息、压力、安全和恢复管理"
      ],
      "negative": [
        "过度医学化会造成误导和不必要恐慌"
      ],
      "realityChecks": [
        "询问现实作息、压力和症状持续情况，而不是从命盘猜病"
      ]
    },
    "advice": [
      "有持续不适时及时就医，命理仅作生活管理提醒"
    ],
    "prohibitions": [
      "不能凭命盘诊断器官、疾病、症状或寿命"
    ],
    "sourceRefs": [
      {
        "sourceId": "system_synthesis",
        "section": "健康与安全边界",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "251-270",
        "section": "五行像法的低风险转译",
        "verificationStatus": "confirmed"
      }
    ],
    "module": "health-state",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "health_five_element_balance",
    "title": "五行偏颇用于生活节律，不用于诊断",
    "category": "health_state",
    "domains": [
      "health"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 89,
    "gender": "all",
    "queryKeywords": [
      "五行偏颇",
      "健康"
    ],
    "trigger": {
      "featuresAny": [
        "五行偏颇",
        "健康"
      ]
    },
    "requires": [
      "只给低风险作息、运动和就医建议",
      "健康问题优先依据用户现实描述和专业医疗信息"
    ],
    "weakeningConditions": [
      "没有现实不适或压力证据",
      "命理信号只来自单一关系"
    ],
    "imagery": {
      "core": [
        "五行偏颇可提醒生活节律、活动与休息的平衡，不等同于对应器官患病"
      ],
      "positive": [
        "用于提醒作息、压力、安全和恢复管理"
      ],
      "negative": [
        "过度医学化会造成误导和不必要恐慌"
      ],
      "realityChecks": [
        "询问现实作息、压力和症状持续情况，而不是从命盘猜病"
      ]
    },
    "advice": [
      "有持续不适时及时就医，命理仅作生活管理提醒"
    ],
    "prohibitions": [
      "不能建立五行—器官—疾病的一对一断法"
    ],
    "sourceRefs": [
      {
        "sourceId": "system_synthesis",
        "section": "健康与安全边界",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "251-270",
        "section": "五行像法的低风险转译",
        "verificationStatus": "confirmed"
      }
    ],
    "module": "health-state",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "health_pressure_official",
    "title": "官杀压力与紧张度",
    "category": "health_state",
    "domains": [
      "health",
      "self"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 88,
    "gender": "all",
    "queryKeywords": [
      "官杀",
      "压力",
      "紧张"
    ],
    "trigger": {
      "featuresAny": [
        "官杀",
        "压力",
        "紧张"
      ]
    },
    "requires": [
      "结合工作量、睡眠和情绪现实反馈",
      "健康问题优先依据用户现实描述和专业医疗信息"
    ],
    "weakeningConditions": [
      "没有现实不适或压力证据",
      "命理信号只来自单一关系"
    ],
    "imagery": {
      "core": [
        "官杀增强可提示责任、竞争和警觉度上升，现实中可能需要更主动管理压力"
      ],
      "positive": [
        "用于提醒作息、压力、安全和恢复管理"
      ],
      "negative": [
        "过度医学化会造成误导和不必要恐慌"
      ],
      "realityChecks": [
        "询问现实作息、压力和症状持续情况，而不是从命盘猜病"
      ]
    },
    "advice": [
      "有持续不适时及时就医，命理仅作生活管理提醒"
    ],
    "prohibitions": [
      "不能由官杀直接断失眠、焦虑症或具体疾病"
    ],
    "sourceRefs": [
      {
        "sourceId": "system_synthesis",
        "section": "健康与安全边界",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "251-270",
        "section": "五行像法的低风险转译",
        "verificationStatus": "confirmed"
      }
    ],
    "module": "health-state",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "health_output_blocked",
    "title": "食伤通道受阻与身心松弛",
    "category": "health_state",
    "domains": [
      "health",
      "self"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 90,
    "gender": "all",
    "queryKeywords": [
      "食伤受制",
      "输出受阻"
    ],
    "trigger": {
      "featuresAny": [
        "食伤受制",
        "输出受阻"
      ]
    },
    "requires": [
      "需现实反馈支持，并区分工作压力和情绪问题",
      "健康问题优先依据用户现实描述和专业医疗信息"
    ],
    "weakeningConditions": [
      "没有现实不适或压力证据",
      "命理信号只来自单一关系"
    ],
    "imagery": {
      "core": [
        "表达和输出通道受限时，可能主观感到不畅、压抑或难以放松"
      ],
      "positive": [
        "用于提醒作息、压力、安全和恢复管理"
      ],
      "negative": [
        "过度医学化会造成误导和不必要恐慌"
      ],
      "realityChecks": [
        "询问现实作息、压力和症状持续情况，而不是从命盘猜病"
      ]
    },
    "advice": [
      "有持续不适时及时就医，命理仅作生活管理提醒"
    ],
    "prohibitions": [
      "不能断消化系统、生殖系统或具体症状"
    ],
    "sourceRefs": [
      {
        "sourceId": "system_synthesis",
        "section": "健康与安全边界",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "251-270",
        "section": "五行像法的低风险转译",
        "verificationStatus": "confirmed"
      }
    ],
    "module": "health-state",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "health_resource_heavy",
    "title": "印星过重与静态负担",
    "category": "health_state",
    "domains": [
      "health",
      "self"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 89,
    "gender": "all",
    "queryKeywords": [
      "印重",
      "准备过多"
    ],
    "trigger": {
      "featuresAny": [
        "印重",
        "准备过多"
      ]
    },
    "requires": [
      "结合运动、工作方式和现实作息",
      "健康问题优先依据用户现实描述和专业医疗信息"
    ],
    "weakeningConditions": [
      "没有现实不适或压力证据",
      "命理信号只来自单一关系"
    ],
    "imagery": {
      "core": [
        "印星过重可提示思虑、静态时间、保护倾向和行动节奏偏慢"
      ],
      "positive": [
        "用于提醒作息、压力、安全和恢复管理"
      ],
      "negative": [
        "过度医学化会造成误导和不必要恐慌"
      ],
      "realityChecks": [
        "询问现实作息、压力和症状持续情况，而不是从命盘猜病"
      ]
    },
    "advice": [
      "有持续不适时及时就医，命理仅作生活管理提醒"
    ],
    "prohibitions": [
      "不能直接断肥胖、抑郁或代谢疾病"
    ],
    "sourceRefs": [
      {
        "sourceId": "system_synthesis",
        "section": "健康与安全边界",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "251-270",
        "section": "五行像法的低风险转译",
        "verificationStatus": "confirmed"
      }
    ],
    "module": "health-state",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "health_clash_safety",
    "title": "岁运冲动与一般安全提醒",
    "category": "health_state",
    "domains": [
      "health",
      "movement"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 88,
    "gender": "all",
    "queryKeywords": [
      "冲",
      "安全",
      "出行"
    ],
    "trigger": {
      "featuresAny": [
        "冲",
        "安全",
        "出行"
      ]
    },
    "requires": [
      "必须有明确岁运冲动且现实中确有出行或高压任务",
      "健康问题优先依据用户现实描述和专业医疗信息"
    ],
    "weakeningConditions": [
      "没有现实不适或压力证据",
      "命理信号只来自单一关系"
    ],
    "imagery": {
      "core": [
        "强烈冲动可提示节奏变化、移动和注意力分散，适合做一般安全与行程预案"
      ],
      "positive": [
        "用于提醒作息、压力、安全和恢复管理"
      ],
      "negative": [
        "过度医学化会造成误导和不必要恐慌"
      ],
      "realityChecks": [
        "询问现实作息、压力和症状持续情况，而不是从命盘猜病"
      ]
    },
    "advice": [
      "有持续不适时及时就医，命理仅作生活管理提醒"
    ],
    "prohibitions": [
      "不能断车祸、手术或灾难"
    ],
    "sourceRefs": [
      {
        "sourceId": "system_synthesis",
        "section": "健康与安全边界",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "251-270",
        "section": "五行像法的低风险转译",
        "verificationStatus": "confirmed"
      }
    ],
    "module": "health-state",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "health_heat_cold",
    "title": "寒热燥湿只作环境与节律象",
    "category": "health_state",
    "domains": [
      "health"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 90,
    "gender": "all",
    "queryKeywords": [
      "寒",
      "热",
      "燥",
      "湿"
    ],
    "trigger": {
      "featuresAny": [
        "寒",
        "热",
        "燥",
        "湿"
      ]
    },
    "requires": [
      "建议保持适宜环境、规律作息并听从专业意见",
      "健康问题优先依据用户现实描述和专业医疗信息"
    ],
    "weakeningConditions": [
      "没有现实不适或压力证据",
      "命理信号只来自单一关系"
    ],
    "imagery": {
      "core": [
        "寒热燥湿可用于描述命局环境和生活节律，不直接映射医学病名"
      ],
      "positive": [
        "用于提醒作息、压力、安全和恢复管理"
      ],
      "negative": [
        "过度医学化会造成误导和不必要恐慌"
      ],
      "realityChecks": [
        "询问现实作息、压力和症状持续情况，而不是从命盘猜病"
      ]
    },
    "advice": [
      "有持续不适时及时就医，命理仅作生活管理提醒"
    ],
    "prohibitions": [
      "不能以调候替代就医"
    ],
    "sourceRefs": [
      {
        "sourceId": "system_synthesis",
        "section": "健康与安全边界",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "251-270",
        "section": "五行像法的低风险转译",
        "verificationStatus": "confirmed"
      }
    ],
    "module": "health-state",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "health_mental_load",
    "title": "自刑伏吟与反复心理负担",
    "category": "health_state",
    "domains": [
      "health",
      "self"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 89,
    "gender": "all",
    "queryKeywords": [
      "自刑",
      "伏吟",
      "内耗"
    ],
    "trigger": {
      "featuresAny": [
        "自刑",
        "伏吟",
        "内耗"
      ]
    },
    "requires": [
      "结合实际压力、行为和持续时间",
      "健康问题优先依据用户现实描述和专业医疗信息"
    ],
    "weakeningConditions": [
      "没有现实不适或压力证据",
      "命理信号只来自单一关系"
    ],
    "imagery": {
      "core": [
        "自刑或伏吟可提示重复、较劲和心理负担主题，但程度需现实验证"
      ],
      "positive": [
        "用于提醒作息、压力、安全和恢复管理"
      ],
      "negative": [
        "过度医学化会造成误导和不必要恐慌"
      ],
      "realityChecks": [
        "询问现实作息、压力和症状持续情况，而不是从命盘猜病"
      ]
    },
    "advice": [
      "有持续不适时及时就医，命理仅作生活管理提醒"
    ],
    "prohibitions": [
      "不能直接诊断焦虑、强迫或抑郁"
    ],
    "sourceRefs": [
      {
        "sourceId": "system_synthesis",
        "section": "健康与安全边界",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "251-270",
        "section": "五行像法的低风险转译",
        "verificationStatus": "confirmed"
      }
    ],
    "module": "health-state",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "health_medical_boundary",
    "title": "出现具体不适时以医学为准",
    "category": "health_state",
    "domains": [
      "health"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 88,
    "gender": "all",
    "queryKeywords": [
      "就医",
      "不适",
      "诊断"
    ],
    "trigger": {
      "featuresAny": [
        "就医",
        "不适",
        "诊断"
      ]
    },
    "requires": [
      "任何具体症状、用药和治疗问题转向专业医疗",
      "健康问题优先依据用户现实描述和专业医疗信息"
    ],
    "weakeningConditions": [
      "没有现实不适或压力证据",
      "命理信号只来自单一关系"
    ],
    "imagery": {
      "core": [
        "命理建议只到风险提醒和生活管理，持续或明显不适应及时就医"
      ],
      "positive": [
        "用于提醒作息、压力、安全和恢复管理"
      ],
      "negative": [
        "过度医学化会造成误导和不必要恐慌"
      ],
      "realityChecks": [
        "询问现实作息、压力和症状持续情况，而不是从命盘猜病"
      ]
    },
    "advice": [
      "有持续不适时及时就医，命理仅作生活管理提醒"
    ],
    "prohibitions": [
      "不能建议停药、替代治疗或保证康复"
    ],
    "sourceRefs": [
      {
        "sourceId": "system_synthesis",
        "section": "健康与安全边界",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "251-270",
        "section": "五行像法的低风险转译",
        "verificationStatus": "confirmed"
      }
    ],
    "module": "health-state",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "health_health_advice",
    "title": "健康建议必须低风险可执行",
    "category": "health_state",
    "domains": [
      "health"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 90,
    "gender": "all",
    "queryKeywords": [
      "作息",
      "运动",
      "压力管理"
    ],
    "trigger": {
      "featuresAny": [
        "作息",
        "运动",
        "压力管理"
      ]
    },
    "requires": [
      "建议不与医学治疗冲突",
      "健康问题优先依据用户现实描述和专业医疗信息"
    ],
    "weakeningConditions": [
      "没有现实不适或压力证据",
      "命理信号只来自单一关系"
    ],
    "imagery": {
      "core": [
        "适合给规律睡眠、适度运动、饮食规律、压力缓冲和安全检查等通用建议"
      ],
      "positive": [
        "用于提醒作息、压力、安全和恢复管理"
      ],
      "negative": [
        "过度医学化会造成误导和不必要恐慌"
      ],
      "realityChecks": [
        "询问现实作息、压力和症状持续情况，而不是从命盘猜病"
      ]
    },
    "advice": [
      "有持续不适时及时就医，命理仅作生活管理提醒"
    ],
    "prohibitions": [
      "不能用补五行食物、颜色、饰品或方位声称治病"
    ],
    "sourceRefs": [
      {
        "sourceId": "system_synthesis",
        "section": "健康与安全边界",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "251-270",
        "section": "五行像法的低风险转译",
        "verificationStatus": "confirmed"
      }
    ],
    "module": "health-state",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "transit_luck_stage",
    "title": "大运决定十年阶段背景",
    "category": "transit",
    "domains": [
      "self",
      "career",
      "wealth",
      "spouse"
    ],
    "scopes": [
      "luck",
      "year",
      "month",
      "multiYear"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 88,
    "gender": "all",
    "queryKeywords": [
      "大运",
      "阶段",
      "十年"
    ],
    "trigger": {
      "featuresAny": [
        "大运",
        "阶段",
        "十年"
      ]
    },
    "requires": [
      "必须按实际交运年月定位当前大运",
      "原局、大运、流年、流月按层级分开"
    ],
    "weakeningConditions": [
      "时间数据缺失",
      "只有原局结论而无岁运新增作用"
    ],
    "imagery": {
      "core": [
        "大运改变原局各角色的力量和可用性，决定阶段主要矛盾与可用通道"
      ],
      "positive": [
        "分层清楚时，可形成阶段、年份和短期节奏的可靠比较"
      ],
      "negative": [
        "混层会把十年背景、年度触发和月份落点相互替代"
      ],
      "realityChecks": [
        "核验当前实际大运、目标年份和是否明确询问月份"
      ]
    },
    "advice": [
      "先给阶段主线，再给年度变化；流月只在需要时展开"
    ],
    "prohibitions": [
      "不能用展示年份范围替代实际交运日期"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "226-250",
        "section": "大运、流年与应期",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "system_synthesis",
        "section": "时间层级与实际交运数据",
        "verificationStatus": "confirmed"
      }
    ],
    "module": "transit",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "transit_year_trigger",
    "title": "流年触发年度新增作用",
    "category": "transit",
    "domains": [
      "self",
      "career",
      "wealth",
      "spouse"
    ],
    "scopes": [
      "luck",
      "year",
      "month",
      "multiYear"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 87,
    "gender": "all",
    "queryKeywords": [
      "流年",
      "触发",
      "年度"
    ],
    "trigger": {
      "featuresAny": [
        "流年",
        "触发",
        "年度"
      ]
    },
    "requires": [
      "至少说明一条流年新增关系",
      "原局、大运、流年、流月按层级分开"
    ],
    "weakeningConditions": [
      "时间数据缺失",
      "只有原局结论而无岁运新增作用"
    ],
    "imagery": {
      "core": [
        "流年新增干支直接作用原局和大运，决定当年哪些主题被放大或落地"
      ],
      "positive": [
        "分层清楚时，可形成阶段、年份和短期节奏的可靠比较"
      ],
      "negative": [
        "混层会把十年背景、年度触发和月份落点相互替代"
      ],
      "realityChecks": [
        "核验当前实际大运、目标年份和是否明确询问月份"
      ]
    },
    "advice": [
      "先给阶段主线，再给年度变化；流月只在需要时展开"
    ],
    "prohibitions": [
      "不能只重复原局结论当作流年分析"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "226-250",
        "section": "大运、流年与应期",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "system_synthesis",
        "section": "时间层级与实际交运数据",
        "verificationStatus": "confirmed"
      }
    ],
    "module": "transit",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "transit_month_landing_detail",
    "title": "流月用于短期落点",
    "category": "transit",
    "domains": [
      "self",
      "career",
      "wealth",
      "spouse"
    ],
    "scopes": [
      "luck",
      "year",
      "month",
      "multiYear"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 86,
    "gender": "all",
    "queryKeywords": [
      "流月",
      "月份",
      "落点"
    ],
    "trigger": {
      "featuresAny": [
        "流月",
        "月份",
        "落点"
      ]
    },
    "requires": [
      "用户明确询问月份且系统提供流月数据",
      "原局、大运、流年、流月按层级分开"
    ],
    "weakeningConditions": [
      "时间数据缺失",
      "只有原局结论而无岁运新增作用"
    ],
    "imagery": {
      "core": [
        "流月只在大运和流年背景内细化短期节奏，不改写原局和全年主线"
      ],
      "positive": [
        "分层清楚时，可形成阶段、年份和短期节奏的可靠比较"
      ],
      "negative": [
        "混层会把十年背景、年度触发和月份落点相互替代"
      ],
      "realityChecks": [
        "核验当前实际大运、目标年份和是否明确询问月份"
      ]
    },
    "advice": [
      "先给阶段主线，再给年度变化；流月只在需要时展开"
    ],
    "prohibitions": [
      "不能自行编月份、季节或上下半年"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "226-250",
        "section": "大运、流年与应期",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "system_synthesis",
        "section": "时间层级与实际交运数据",
        "verificationStatus": "confirmed"
      }
    ],
    "module": "transit",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "transit_transition_date",
    "title": "交运按实际年月分段",
    "category": "transit",
    "domains": [
      "self",
      "career",
      "wealth",
      "spouse"
    ],
    "scopes": [
      "luck",
      "year",
      "month",
      "multiYear"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 85,
    "gender": "all",
    "queryKeywords": [
      "交运",
      "换运",
      "分段"
    ],
    "trigger": {
      "featuresAny": [
        "交运",
        "换运",
        "分段"
      ]
    },
    "requires": [
      "系统提供实际交运年月",
      "原局、大运、流年、流月按层级分开"
    ],
    "weakeningConditions": [
      "时间数据缺失",
      "只有原局结论而无岁运新增作用"
    ],
    "imagery": {
      "core": [
        "交运年必须按实际交运月划分旧运和新运，全年主次按各自覆盖时间判断"
      ],
      "positive": [
        "分层清楚时，可形成阶段、年份和短期节奏的可靠比较"
      ],
      "negative": [
        "混层会把十年背景、年度触发和月份落点相互替代"
      ],
      "realityChecks": [
        "核验当前实际大运、目标年份和是否明确询问月份"
      ]
    },
    "advice": [
      "先给阶段主线，再给年度变化；流月只在需要时展开"
    ],
    "prohibitions": [
      "不能把年末新运写成全年第一主象"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "226-250",
        "section": "大运、流年与应期",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "system_synthesis",
        "section": "时间层级与实际交运数据",
        "verificationStatus": "confirmed"
      }
    ],
    "module": "transit",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "transit_existing_char",
    "title": "原局已有字被岁运引动",
    "category": "transit",
    "domains": [
      "self",
      "career",
      "wealth",
      "spouse"
    ],
    "scopes": [
      "luck",
      "year",
      "month",
      "multiYear"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 84,
    "gender": "all",
    "queryKeywords": [
      "原局有字",
      "岁运出来"
    ],
    "trigger": {
      "featuresAny": [
        "原局有字",
        "岁运出来"
      ]
    },
    "requires": [
      "确认同字同角色及作用层级",
      "原局、大运、流年、流月按层级分开"
    ],
    "weakeningConditions": [
      "时间数据缺失",
      "只有原局结论而无岁运新增作用"
    ],
    "imagery": {
      "core": [
        "岁运重复原局已有干支或十神时，熟悉主题被加强、重做或显化"
      ],
      "positive": [
        "分层清楚时，可形成阶段、年份和短期节奏的可靠比较"
      ],
      "negative": [
        "混层会把十年背景、年度触发和月份落点相互替代"
      ],
      "realityChecks": [
        "核验当前实际大运、目标年份和是否明确询问月份"
      ]
    },
    "advice": [
      "先给阶段主线，再给年度变化；流月只在需要时展开"
    ],
    "prohibitions": [
      "不能只因同字出现就断伏吟或具体事件"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "226-250",
        "section": "大运、流年与应期",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "system_synthesis",
        "section": "时间层级与实际交运数据",
        "verificationStatus": "confirmed"
      }
    ],
    "module": "transit",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "transit_new_char",
    "title": "原局没有的岁运新字",
    "category": "transit",
    "domains": [
      "self",
      "career",
      "wealth",
      "spouse"
    ],
    "scopes": [
      "luck",
      "year",
      "month",
      "multiYear"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 88,
    "gender": "all",
    "queryKeywords": [
      "原局没有",
      "新来字"
    ],
    "trigger": {
      "featuresAny": [
        "原局没有",
        "新来字"
      ]
    },
    "requires": [
      "新字与原局发生真实关系并被承接",
      "原局、大运、流年、流月按层级分开"
    ],
    "weakeningConditions": [
      "时间数据缺失",
      "只有原局结论而无岁运新增作用"
    ],
    "imagery": {
      "core": [
        "岁运带来原局未显的角色时，可表示新的环境、人物或处理方式进入"
      ],
      "positive": [
        "分层清楚时，可形成阶段、年份和短期节奏的可靠比较"
      ],
      "negative": [
        "混层会把十年背景、年度触发和月份落点相互替代"
      ],
      "realityChecks": [
        "核验当前实际大运、目标年份和是否明确询问月份"
      ]
    },
    "advice": [
      "先给阶段主线，再给年度变化；流月只在需要时展开"
    ],
    "prohibitions": [
      "不能把新字直接当成确定对象或事件"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "226-250",
        "section": "大运、流年与应期",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "system_synthesis",
        "section": "时间层级与实际交运数据",
        "verificationStatus": "confirmed"
      }
    ],
    "module": "transit",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "transit_luck_year_relation",
    "title": "大运与流年必须相互作用",
    "category": "transit",
    "domains": [
      "self",
      "career",
      "wealth",
      "spouse"
    ],
    "scopes": [
      "luck",
      "year",
      "month",
      "multiYear"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 87,
    "gender": "all",
    "queryKeywords": [
      "大运流年",
      "岁运关系"
    ],
    "trigger": {
      "featuresAny": [
        "大运流年",
        "岁运关系"
      ]
    },
    "requires": [
      "明确大运、流年干支及正确基础关系",
      "原局、大运、流年、流月按层级分开"
    ],
    "weakeningConditions": [
      "时间数据缺失",
      "只有原局结论而无岁运新增作用"
    ],
    "imagery": {
      "core": [
        "流年不仅作用原局，也与当前大运发生生克合冲，影响年度主题的可用程度"
      ],
      "positive": [
        "分层清楚时，可形成阶段、年份和短期节奏的可靠比较"
      ],
      "negative": [
        "混层会把十年背景、年度触发和月份落点相互替代"
      ],
      "realityChecks": [
        "核验当前实际大运、目标年份和是否明确询问月份"
      ]
    },
    "advice": [
      "先给阶段主线，再给年度变化；流月只在需要时展开"
    ],
    "prohibitions": [
      "不能写不存在的天干合或写反生克"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "226-250",
        "section": "大运、流年与应期",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "system_synthesis",
        "section": "时间层级与实际交运数据",
        "verificationStatus": "confirmed"
      }
    ],
    "module": "transit",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "transit_repeated_layer",
    "title": "原局大运流年重复激活",
    "category": "transit",
    "domains": [
      "self",
      "career",
      "wealth",
      "spouse"
    ],
    "scopes": [
      "luck",
      "year",
      "month",
      "multiYear"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 86,
    "gender": "all",
    "queryKeywords": [
      "重复激活",
      "伏吟",
      "多层"
    ],
    "trigger": {
      "featuresAny": [
        "重复激活",
        "伏吟",
        "多层"
      ]
    },
    "requires": [
      "区分真正独立层级而非同一关系换说法",
      "原局、大运、流年、流月按层级分开"
    ],
    "weakeningConditions": [
      "时间数据缺失",
      "只有原局结论而无岁运新增作用"
    ],
    "imagery": {
      "core": [
        "同一主题被原局、大运、流年多层重复时优先级提高，但也可能增加重复压力"
      ],
      "positive": [
        "分层清楚时，可形成阶段、年份和短期节奏的可靠比较"
      ],
      "negative": [
        "混层会把十年背景、年度触发和月份落点相互替代"
      ],
      "realityChecks": [
        "核验当前实际大运、目标年份和是否明确询问月份"
      ]
    },
    "advice": [
      "先给阶段主线，再给年度变化；流月只在需要时展开"
    ],
    "prohibitions": [
      "不能把重复直接断成必然事件"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "226-250",
        "section": "大运、流年与应期",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "system_synthesis",
        "section": "时间层级与实际交运数据",
        "verificationStatus": "confirmed"
      }
    ],
    "module": "transit",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "transit_root_activation",
    "title": "岁运补根或引根",
    "category": "transit",
    "domains": [
      "self",
      "career",
      "wealth",
      "spouse"
    ],
    "scopes": [
      "luck",
      "year",
      "month",
      "multiYear"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 85,
    "gender": "all",
    "queryKeywords": [
      "得根",
      "岁运补根"
    ],
    "trigger": {
      "featuresAny": [
        "得根",
        "岁运补根"
      ]
    },
    "requires": [
      "确认根与天干来源一致且未被破坏",
      "原局、大运、流年、流月按层级分开"
    ],
    "weakeningConditions": [
      "时间数据缺失",
      "只有原局结论而无岁运新增作用"
    ],
    "imagery": {
      "core": [
        "原局虚浮角色在岁运得根、通根或同类支持时，功能更易稳定显现"
      ],
      "positive": [
        "分层清楚时，可形成阶段、年份和短期节奏的可靠比较"
      ],
      "negative": [
        "混层会把十年背景、年度触发和月份落点相互替代"
      ],
      "realityChecks": [
        "核验当前实际大运、目标年份和是否明确询问月份"
      ]
    },
    "advice": [
      "先给阶段主线，再给年度变化；流月只在需要时展开"
    ],
    "prohibitions": [
      "不能只因同五行到来就说完全立住"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "226-250",
        "section": "大运、流年与应期",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "system_synthesis",
        "section": "时间层级与实际交运数据",
        "verificationStatus": "confirmed"
      }
    ],
    "module": "transit",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "transit_hidden_reveal",
    "title": "藏干岁运透出",
    "category": "transit",
    "domains": [
      "self",
      "career",
      "wealth",
      "spouse"
    ],
    "scopes": [
      "luck",
      "year",
      "month",
      "multiYear"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 84,
    "gender": "all",
    "queryKeywords": [
      "藏干透出",
      "岁运透出"
    ],
    "trigger": {
      "featuresAny": [
        "藏干透出",
        "岁运透出"
      ]
    },
    "requires": [
      "透出与原支来源关系明确",
      "原局、大运、流年、流月按层级分开"
    ],
    "weakeningConditions": [
      "时间数据缺失",
      "只有原局结论而无岁运新增作用"
    ],
    "imagery": {
      "core": [
        "藏干在岁运透出可使潜在角色从内部条件转为更可见的年度主题"
      ],
      "positive": [
        "分层清楚时，可形成阶段、年份和短期节奏的可靠比较"
      ],
      "negative": [
        "混层会把十年背景、年度触发和月份落点相互替代"
      ],
      "realityChecks": [
        "核验当前实际大运、目标年份和是否明确询问月份"
      ]
    },
    "advice": [
      "先给阶段主线，再给年度变化；流月只在需要时展开"
    ],
    "prohibitions": [
      "不能直接把透出等同于现实事件"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "226-250",
        "section": "大运、流年与应期",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "system_synthesis",
        "section": "时间层级与实际交运数据",
        "verificationStatus": "confirmed"
      }
    ],
    "module": "transit",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "transit_relation_activation",
    "title": "岁运补齐合冲刑害关系",
    "category": "transit",
    "domains": [
      "self",
      "career",
      "wealth",
      "spouse"
    ],
    "scopes": [
      "luck",
      "year",
      "month",
      "multiYear"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 88,
    "gender": "all",
    "queryKeywords": [
      "岁运补齐",
      "合冲刑害"
    ],
    "trigger": {
      "featuresAny": [
        "岁运补齐",
        "合冲刑害"
      ]
    },
    "requires": [
      "系统机械关系明确且作用到当前问题",
      "原局、大运、流年、流月按层级分开"
    ],
    "weakeningConditions": [
      "时间数据缺失",
      "只有原局结论而无岁运新增作用"
    ],
    "imagery": {
      "core": [
        "岁运补齐原局关系条件时，原有潜在结构进入活动状态"
      ],
      "positive": [
        "分层清楚时，可形成阶段、年份和短期节奏的可靠比较"
      ],
      "negative": [
        "混层会把十年背景、年度触发和月份落点相互替代"
      ],
      "realityChecks": [
        "核验当前实际大运、目标年份和是否明确询问月份"
      ]
    },
    "advice": [
      "先给阶段主线，再给年度变化；流月只在需要时展开"
    ],
    "prohibitions": [
      "不能跨层级创造不存在的关系"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "226-250",
        "section": "大运、流年与应期",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "system_synthesis",
        "section": "时间层级与实际交运数据",
        "verificationStatus": "confirmed"
      }
    ],
    "module": "transit",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "transit_storage_activation",
    "title": "岁运开库闭库",
    "category": "transit",
    "domains": [
      "career",
      "wealth",
      "spouse"
    ],
    "scopes": [
      "luck",
      "year",
      "month",
      "multiYear"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 87,
    "gender": "all",
    "queryKeywords": [
      "岁运开库",
      "闭库"
    ],
    "trigger": {
      "featuresAny": [
        "岁运开库",
        "闭库"
      ]
    },
    "requires": [
      "库中有对象、作用方式明确并有现实承接",
      "原局、大运、流年、流月按层级分开"
    ],
    "weakeningConditions": [
      "时间数据缺失",
      "只有原局结论而无岁运新增作用"
    ],
    "imagery": {
      "core": [
        "大运流年作用墓库可改变资源显隐和承接方式"
      ],
      "positive": [
        "分层清楚时，可形成阶段、年份和短期节奏的可靠比较"
      ],
      "negative": [
        "混层会把十年背景、年度触发和月份落点相互替代"
      ],
      "realityChecks": [
        "核验当前实际大运、目标年份和是否明确询问月份"
      ]
    },
    "advice": [
      "先给阶段主线，再给年度变化；流月只在需要时展开"
    ],
    "prohibitions": [
      "不能一律断发财、结婚或灾祸"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "226-250",
        "section": "大运、流年与应期",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "system_synthesis",
        "section": "时间层级与实际交运数据",
        "verificationStatus": "confirmed"
      }
    ],
    "module": "transit",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "transit_ten_god_luck",
    "title": "十神大运作为阶段主题",
    "category": "transit",
    "domains": [
      "self",
      "career",
      "wealth",
      "spouse"
    ],
    "scopes": [
      "luck",
      "year",
      "month",
      "multiYear"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 86,
    "gender": "all",
    "queryKeywords": [
      "十神大运",
      "大运主题"
    ],
    "trigger": {
      "featuresAny": [
        "十神大运",
        "大运主题"
      ]
    },
    "requires": [
      "结合原局是否需要、来源与制化",
      "原局、大运、流年、流月按层级分开"
    ],
    "weakeningConditions": [
      "时间数据缺失",
      "只有原局结论而无岁运新增作用"
    ],
    "imagery": {
      "core": [
        "某十神进入大运时，其角色、工作方式和关系主题更易成为十年背景"
      ],
      "positive": [
        "分层清楚时，可形成阶段、年份和短期节奏的可靠比较"
      ],
      "negative": [
        "混层会把十年背景、年度触发和月份落点相互替代"
      ],
      "realityChecks": [
        "核验当前实际大运、目标年份和是否明确询问月份"
      ]
    },
    "advice": [
      "先给阶段主线，再给年度变化；流月只在需要时展开"
    ],
    "prohibitions": [
      "不能按十神名称给大运简单贴好坏"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "226-250",
        "section": "大运、流年与应期",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "system_synthesis",
        "section": "时间层级与实际交运数据",
        "verificationStatus": "confirmed"
      }
    ],
    "module": "transit",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "transit_ten_god_year",
    "title": "十神流年作为年度主题",
    "category": "transit",
    "domains": [
      "self",
      "career",
      "wealth",
      "spouse"
    ],
    "scopes": [
      "luck",
      "year",
      "month",
      "multiYear"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 85,
    "gender": "all",
    "queryKeywords": [
      "十神流年",
      "年度主题"
    ],
    "trigger": {
      "featuresAny": [
        "十神流年",
        "年度主题"
      ]
    },
    "requires": [
      "至少有一条直接作用关系",
      "原局、大运、流年、流月按层级分开"
    ],
    "weakeningConditions": [
      "时间数据缺失",
      "只有原局结论而无岁运新增作用"
    ],
    "imagery": {
      "core": [
        "流年十神提示年度新增角色，但具体表现取决于原局和大运承接"
      ],
      "positive": [
        "分层清楚时，可形成阶段、年份和短期节奏的可靠比较"
      ],
      "negative": [
        "混层会把十年背景、年度触发和月份落点相互替代"
      ],
      "realityChecks": [
        "核验当前实际大运、目标年份和是否明确询问月份"
      ]
    },
    "advice": [
      "先给阶段主线，再给年度变化；流月只在需要时展开"
    ],
    "prohibitions": [
      "不能见财官流年就断发财升职恋爱"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "226-250",
        "section": "大运、流年与应期",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "system_synthesis",
        "section": "时间层级与实际交运数据",
        "verificationStatus": "confirmed"
      }
    ],
    "module": "transit",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "transit_good_luck_bad_year",
    "title": "好大运遇阻流年",
    "category": "transit",
    "domains": [
      "career",
      "wealth",
      "spouse"
    ],
    "scopes": [
      "luck",
      "year",
      "month",
      "multiYear"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 84,
    "gender": "all",
    "queryKeywords": [
      "好大运",
      "坏流年"
    ],
    "trigger": {
      "featuresAny": [
        "好大运",
        "坏流年"
      ]
    },
    "requires": [
      "比较大运长期作用和流年短期触发",
      "原局、大运、流年、流月按层级分开"
    ],
    "weakeningConditions": [
      "时间数据缺失",
      "只有原局结论而无岁运新增作用"
    ],
    "imagery": {
      "core": [
        "有利大运中的不利流年通常表现为阶段中的调整或成本，不轻易改写整个十年方向"
      ],
      "positive": [
        "分层清楚时，可形成阶段、年份和短期节奏的可靠比较"
      ],
      "negative": [
        "混层会把十年背景、年度触发和月份落点相互替代"
      ],
      "realityChecks": [
        "核验当前实际大运、目标年份和是否明确询问月份"
      ]
    },
    "advice": [
      "先给阶段主线，再给年度变化；流月只在需要时展开"
    ],
    "prohibitions": [
      "不能因一年波动否定整个大运"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "226-250",
        "section": "大运、流年与应期",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "system_synthesis",
        "section": "时间层级与实际交运数据",
        "verificationStatus": "confirmed"
      }
    ],
    "module": "transit",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "transit_hard_luck_good_year",
    "title": "困难大运中的机会流年",
    "category": "transit",
    "domains": [
      "career",
      "wealth",
      "spouse"
    ],
    "scopes": [
      "luck",
      "year",
      "month",
      "multiYear"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 88,
    "gender": "all",
    "queryKeywords": [
      "坏大运",
      "好流年"
    ],
    "trigger": {
      "featuresAny": [
        "坏大运",
        "好流年"
      ]
    },
    "requires": [
      "流年确有独立支持且现实窗口存在",
      "原局、大运、流年、流月按层级分开"
    ],
    "weakeningConditions": [
      "时间数据缺失",
      "只有原局结论而无岁运新增作用"
    ],
    "imagery": {
      "core": [
        "困难阶段中的有利流年可提供窗口、缓冲或局部机会，但承接上限受大运背景限制"
      ],
      "positive": [
        "分层清楚时，可形成阶段、年份和短期节奏的可靠比较"
      ],
      "negative": [
        "混层会把十年背景、年度触发和月份落点相互替代"
      ],
      "realityChecks": [
        "核验当前实际大运、目标年份和是否明确询问月份"
      ]
    },
    "advice": [
      "先给阶段主线，再给年度变化；流月只在需要时展开"
    ],
    "prohibitions": [
      "不能把局部好年写成全面翻盘"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "226-250",
        "section": "大运、流年与应期",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "system_synthesis",
        "section": "时间层级与实际交运数据",
        "verificationStatus": "confirmed"
      }
    ],
    "module": "transit",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "transit_multi_year_compare",
    "title": "多年问题逐年独立比较",
    "category": "transit",
    "domains": [
      "career",
      "wealth",
      "spouse"
    ],
    "scopes": [
      "luck",
      "year",
      "month",
      "multiYear"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 87,
    "gender": "all",
    "queryKeywords": [
      "哪几年",
      "多年",
      "比较"
    ],
    "trigger": {
      "featuresAny": [
        "哪几年",
        "多年",
        "比较"
      ]
    },
    "requires": [
      "只使用系统实际扫描年份",
      "原局、大运、流年、流月按层级分开"
    ],
    "weakeningConditions": [
      "时间数据缺失",
      "只有原局结论而无岁运新增作用"
    ],
    "imagery": {
      "core": [
        "多年排序需逐年比较相同指标，不把不同年份的证据拼成一个结论"
      ],
      "positive": [
        "分层清楚时，可形成阶段、年份和短期节奏的可靠比较"
      ],
      "negative": [
        "混层会把十年背景、年度触发和月份落点相互替代"
      ],
      "realityChecks": [
        "核验当前实际大运、目标年份和是否明确询问月份"
      ]
    },
    "advice": [
      "先给阶段主线，再给年度变化；流月只在需要时展开"
    ],
    "prohibitions": [
      "不能引用未扫描年份或混淆交运前后"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "226-250",
        "section": "大运、流年与应期",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "system_synthesis",
        "section": "时间层级与实际交运数据",
        "verificationStatus": "confirmed"
      }
    ],
    "module": "transit",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "transit_event_convergence",
    "title": "具体事件需多层汇合",
    "category": "transit",
    "domains": [
      "career",
      "wealth",
      "spouse"
    ],
    "scopes": [
      "luck",
      "year",
      "month",
      "multiYear"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 86,
    "gender": "all",
    "queryKeywords": [
      "应事",
      "应期",
      "汇合"
    ],
    "trigger": {
      "featuresAny": [
        "应事",
        "应期",
        "汇合"
      ]
    },
    "requires": [
      "事件强度与证据层级相匹配",
      "原局、大运、流年、流月按层级分开"
    ],
    "weakeningConditions": [
      "时间数据缺失",
      "只有原局结论而无岁运新增作用"
    ],
    "imagery": {
      "core": [
        "具体事件候选至少需要原局承接、大运背景和流年新增作用中的独立汇合"
      ],
      "positive": [
        "分层清楚时，可形成阶段、年份和短期节奏的可靠比较"
      ],
      "negative": [
        "混层会把十年背景、年度触发和月份落点相互替代"
      ],
      "realityChecks": [
        "核验当前实际大运、目标年份和是否明确询问月份"
      ]
    },
    "advice": [
      "先给阶段主线，再给年度变化；流月只在需要时展开"
    ],
    "prohibitions": [
      "不能用单一十神或关系断具体事件"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "226-250",
        "section": "大运、流年与应期",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "system_synthesis",
        "section": "时间层级与实际交运数据",
        "verificationStatus": "confirmed"
      }
    ],
    "module": "transit",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "transit_transition_aftereffect",
    "title": "换运后的适应期",
    "category": "transit",
    "domains": [
      "self",
      "career",
      "wealth",
      "spouse"
    ],
    "scopes": [
      "luck",
      "year",
      "month",
      "multiYear"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 85,
    "gender": "all",
    "queryKeywords": [
      "换运后",
      "适应期"
    ],
    "trigger": {
      "featuresAny": [
        "换运后",
        "适应期"
      ]
    },
    "requires": [
      "实际已过交运日期，并区分前后覆盖月份",
      "原局、大运、流年、流月按层级分开"
    ],
    "weakeningConditions": [
      "时间数据缺失",
      "只有原局结论而无岁运新增作用"
    ],
    "imagery": {
      "core": [
        "新大运开始后，旧结构惯性与新主题可能短期并存，现实适应需要时间"
      ],
      "positive": [
        "分层清楚时，可形成阶段、年份和短期节奏的可靠比较"
      ],
      "negative": [
        "混层会把十年背景、年度触发和月份落点相互替代"
      ],
      "realityChecks": [
        "核验当前实际大运、目标年份和是否明确询问月份"
      ]
    },
    "advice": [
      "先给阶段主线，再给年度变化；流月只在需要时展开"
    ],
    "prohibitions": [
      "不能把新运第一年所有变化都归于新运"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "226-250",
        "section": "大运、流年与应期",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "system_synthesis",
        "section": "时间层级与实际交运数据",
        "verificationStatus": "confirmed"
      }
    ],
    "module": "transit",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "transit_transit_reality",
    "title": "岁运分析需现实验证",
    "category": "transit",
    "domains": [
      "self",
      "career",
      "wealth",
      "spouse"
    ],
    "scopes": [
      "luck",
      "year",
      "month",
      "multiYear"
    ],
    "ruleLevel": "B",
    "certainty": "conditional",
    "priority": 84,
    "gender": "all",
    "queryKeywords": [
      "岁运验证",
      "现实背景"
    ],
    "trigger": {
      "featuresAny": [
        "岁运验证",
        "现实背景"
      ]
    },
    "requires": [
      "询问或利用用户已知现实背景",
      "原局、大运、流年、流月按层级分开"
    ],
    "weakeningConditions": [
      "时间数据缺失",
      "只有原局结论而无岁运新增作用"
    ],
    "imagery": {
      "core": [
        "同一岁运结构可落在不同现实领域，需根据工作、关系、家庭和计划选择最贴近的落点"
      ],
      "positive": [
        "分层清楚时，可形成阶段、年份和短期节奏的可靠比较"
      ],
      "negative": [
        "混层会把十年背景、年度触发和月份落点相互替代"
      ],
      "realityChecks": [
        "核验当前实际大运、目标年份和是否明确询问月份"
      ]
    },
    "advice": [
      "先给阶段主线，再给年度变化；流月只在需要时展开"
    ],
    "prohibitions": [
      "不能为了故事完整同时列出多个互斥事件"
    ],
    "sourceRefs": [
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "226-250",
        "section": "大运、流年与应期",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "system_synthesis",
        "section": "时间层级与实际交运数据",
        "verificationStatus": "confirmed"
      }
    ],
    "module": "transit",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "boundary_facts_first",
    "title": "硬事实高于书本规则与AI取象",
    "category": "boundary",
    "domains": [
      "self",
      "career",
      "wealth",
      "spouse",
      "parents",
      "children",
      "health"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month",
      "multiYear"
    ],
    "ruleLevel": "A",
    "certainty": "direct",
    "priority": 100,
    "gender": "all",
    "queryKeywords": [
      "硬事实",
      "规则",
      "取象"
    ],
    "trigger": {
      "featuresAny": [
        "硬事实",
        "规则",
        "取象"
      ]
    },
    "requires": [
      "发现冲突时舍弃或纠正规则解释"
    ],
    "weakeningConditions": [],
    "imagery": {
      "core": [
        "四柱、十神、藏干、实际交运时间和确定关系是最高层，规则和取象必须服从这些数据"
      ],
      "positive": [
        "用于提高基础正确性、可追溯性和回答稳定性"
      ],
      "negative": [
        "忽略边界会产生基础规则错误、越级事件和高风险误导"
      ],
      "realityChecks": [
        "检查回答中的干支、十神、交运时间、关系名称和事件强度"
      ]
    },
    "advice": [
      "基础事实错误优先纠正，其余取象保持适度灵活"
    ],
    "prohibitions": [
      "不能让口诀覆盖排盘事实"
    ],
    "sourceRefs": [
      {
        "sourceId": "system_synthesis",
        "section": "基础规则与确定数据校验",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "1-75,226-250",
        "section": "干支、十神、体用与岁运基础",
        "verificationStatus": "confirmed"
      }
    ],
    "module": "boundaries",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "boundary_five_combinations",
    "title": "天干五合固定基础",
    "category": "boundary",
    "domains": [
      "self",
      "career",
      "wealth",
      "spouse"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month",
      "multiYear"
    ],
    "ruleLevel": "A",
    "certainty": "direct",
    "priority": 99,
    "gender": "all",
    "queryKeywords": [
      "天干五合",
      "甲己",
      "乙庚",
      "丙辛",
      "丁壬",
      "戊癸"
    ],
    "trigger": {
      "featuresAny": [
        "天干五合",
        "甲己",
        "乙庚",
        "丙辛",
        "丁壬",
        "戊癸"
      ]
    },
    "requires": [
      "先确认配对，再谈合意、合绊和化气"
    ],
    "weakeningConditions": [],
    "imagery": {
      "core": [
        "天干五合只有甲己、乙庚、丙辛、丁壬、戊癸五组"
      ],
      "positive": [
        "用于提高基础正确性、可追溯性和回答稳定性"
      ],
      "negative": [
        "忽略边界会产生基础规则错误、越级事件和高风险误导"
      ],
      "realityChecks": [
        "检查回答中的干支、十神、交运时间、关系名称和事件强度"
      ]
    },
    "advice": [
      "基础事实错误优先纠正，其余取象保持适度灵活"
    ],
    "prohibitions": [
      "禁止创造丙癸合、甲乙合等不存在关系"
    ],
    "sourceRefs": [
      {
        "sourceId": "system_synthesis",
        "section": "基础规则与确定数据校验",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "1-75,226-250",
        "section": "干支、十神、体用与岁运基础",
        "verificationStatus": "confirmed"
      }
    ],
    "module": "boundaries",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "boundary_generation_control",
    "title": "五行生克方向固定",
    "category": "boundary",
    "domains": [
      "self",
      "career",
      "wealth",
      "spouse"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month",
      "multiYear"
    ],
    "ruleLevel": "A",
    "certainty": "direct",
    "priority": 98,
    "gender": "all",
    "queryKeywords": [
      "五行生克",
      "生克方向"
    ],
    "trigger": {
      "featuresAny": [
        "五行生克",
        "生克方向"
      ]
    },
    "requires": [
      "基础方向正确后再判断力量和制化"
    ],
    "weakeningConditions": [],
    "imagery": {
      "core": [
        "生为木火土金水循环，克为木克土、土克水、水克火、火克金、金克木"
      ],
      "positive": [
        "用于提高基础正确性、可追溯性和回答稳定性"
      ],
      "negative": [
        "忽略边界会产生基础规则错误、越级事件和高风险误导"
      ],
      "realityChecks": [
        "检查回答中的干支、十神、交运时间、关系名称和事件强度"
      ]
    },
    "advice": [
      "基础事实错误优先纠正，其余取象保持适度灵活"
    ],
    "prohibitions": [
      "禁止写反生克或互相克制"
    ],
    "sourceRefs": [
      {
        "sourceId": "system_synthesis",
        "section": "基础规则与确定数据校验",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "1-75,226-250",
        "section": "干支、十神、体用与岁运基础",
        "verificationStatus": "confirmed"
      }
    ],
    "module": "boundaries",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "boundary_ten_god_mapping",
    "title": "十神映射按日主阴阳固定计算",
    "category": "boundary",
    "domains": [
      "self",
      "career",
      "wealth",
      "spouse"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month",
      "multiYear"
    ],
    "ruleLevel": "A",
    "certainty": "direct",
    "priority": 100,
    "gender": "all",
    "queryKeywords": [
      "十神",
      "日主",
      "映射"
    ],
    "trigger": {
      "featuresAny": [
        "十神",
        "日主",
        "映射"
      ]
    },
    "requires": [
      "以日主和目标天干阴阳五行计算"
    ],
    "weakeningConditions": [],
    "imagery": {
      "core": [
        "同我者比劫、生我者印、我生者食伤、我克者财、克我者官杀，正偏由阴阳决定"
      ],
      "positive": [
        "用于提高基础正确性、可追溯性和回答稳定性"
      ],
      "negative": [
        "忽略边界会产生基础规则错误、越级事件和高风险误导"
      ],
      "realityChecks": [
        "检查回答中的干支、十神、交运时间、关系名称和事件强度"
      ]
    },
    "advice": [
      "基础事实错误优先纠正，其余取象保持适度灵活"
    ],
    "prohibitions": [
      "禁止把辛日主的丙火写成财星等基础错误"
    ],
    "sourceRefs": [
      {
        "sourceId": "system_synthesis",
        "section": "基础规则与确定数据校验",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "1-75,226-250",
        "section": "干支、十神、体用与岁运基础",
        "verificationStatus": "confirmed"
      }
    ],
    "module": "boundaries",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "boundary_relation_presence",
    "title": "具名干支关系必须真实存在",
    "category": "boundary",
    "domains": [
      "self",
      "career",
      "wealth",
      "spouse"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month",
      "multiYear"
    ],
    "ruleLevel": "A",
    "certainty": "direct",
    "priority": 99,
    "gender": "all",
    "queryKeywords": [
      "合冲刑害破",
      "机械关系"
    ],
    "trigger": {
      "featuresAny": [
        "合冲刑害破",
        "机械关系"
      ]
    },
    "requires": [
      "明确参与干支和层级"
    ],
    "weakeningConditions": [],
    "imagery": {
      "core": [
        "暗合、六合、冲、刑、害、破、三合三会等必须由系统机械关系确认"
      ],
      "positive": [
        "用于提高基础正确性、可追溯性和回答稳定性"
      ],
      "negative": [
        "忽略边界会产生基础规则错误、越级事件和高风险误导"
      ],
      "realityChecks": [
        "检查回答中的干支、十神、交运时间、关系名称和事件强度"
      ]
    },
    "advice": [
      "基础事实错误优先纠正，其余取象保持适度灵活"
    ],
    "prohibitions": [
      "禁止根据语义联想创造关系"
    ],
    "sourceRefs": [
      {
        "sourceId": "system_synthesis",
        "section": "基础规则与确定数据校验",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "1-75,226-250",
        "section": "干支、十神、体用与岁运基础",
        "verificationStatus": "confirmed"
      }
    ],
    "module": "boundaries",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "boundary_combine_transform",
    "title": "合不等于化",
    "category": "boundary",
    "domains": [
      "self",
      "career",
      "wealth",
      "spouse"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month",
      "multiYear"
    ],
    "ruleLevel": "A",
    "certainty": "direct",
    "priority": 98,
    "gender": "all",
    "queryKeywords": [
      "合化",
      "化气"
    ],
    "trigger": {
      "featuresAny": [
        "合化",
        "化气"
      ]
    },
    "requires": [
      "系统未明确标注时只写合意或成势条件"
    ],
    "weakeningConditions": [],
    "imagery": {
      "core": [
        "天干五合和地支合局首先只是关系，化气需月令、根气、透干、局势和制化条件"
      ],
      "positive": [
        "用于提高基础正确性、可追溯性和回答稳定性"
      ],
      "negative": [
        "忽略边界会产生基础规则错误、越级事件和高风险误导"
      ],
      "realityChecks": [
        "检查回答中的干支、十神、交运时间、关系名称和事件强度"
      ]
    },
    "advice": [
      "基础事实错误优先纠正，其余取象保持适度灵活"
    ],
    "prohibitions": [
      "禁止直接写已经化木化火化土化金化水"
    ],
    "sourceRefs": [
      {
        "sourceId": "system_synthesis",
        "section": "基础规则与确定数据校验",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "1-75,226-250",
        "section": "干支、十神、体用与岁运基础",
        "verificationStatus": "confirmed"
      }
    ],
    "module": "boundaries",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "boundary_strength_not_count",
    "title": "旺衰不按数量或评分单断",
    "category": "boundary",
    "domains": [
      "self",
      "career",
      "health"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month",
      "multiYear"
    ],
    "ruleLevel": "A",
    "certainty": "direct",
    "priority": 100,
    "gender": "all",
    "queryKeywords": [
      "旺衰",
      "评分",
      "数量"
    ],
    "trigger": {
      "featuresAny": [
        "旺衰",
        "评分",
        "数量"
      ]
    },
    "requires": [
      "评分仅作辅助摘要"
    ],
    "weakeningConditions": [],
    "imagery": {
      "core": [
        "旺衰需月令、根气、透藏、生扶克泄和制化综合判断"
      ],
      "positive": [
        "用于提高基础正确性、可追溯性和回答稳定性"
      ],
      "negative": [
        "忽略边界会产生基础规则错误、越级事件和高风险误导"
      ],
      "realityChecks": [
        "检查回答中的干支、十神、交运时间、关系名称和事件强度"
      ]
    },
    "advice": [
      "基础事实错误优先纠正，其余取象保持适度灵活"
    ],
    "prohibitions": [
      "禁止因分数高就写旺至极、从格或用神确定"
    ],
    "sourceRefs": [
      {
        "sourceId": "system_synthesis",
        "section": "基础规则与确定数据校验",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "1-75,226-250",
        "section": "干支、十神、体用与岁运基础",
        "verificationStatus": "confirmed"
      }
    ],
    "module": "boundaries",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "boundary_event_two_evidence",
    "title": "具体事件至少两条独立依据",
    "category": "boundary",
    "domains": [
      "career",
      "wealth",
      "spouse",
      "parents",
      "children"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month",
      "multiYear"
    ],
    "ruleLevel": "A",
    "certainty": "direct",
    "priority": 99,
    "gender": "all",
    "queryKeywords": [
      "具体事件",
      "独立依据"
    ],
    "trigger": {
      "featuresAny": [
        "具体事件",
        "独立依据"
      ]
    },
    "requires": [
      "流年事件含流年新增作用，流月事件含流月新增作用"
    ],
    "weakeningConditions": [],
    "imagery": {
      "core": [
        "升职、结婚、分手、搬家、破财等具体事件至少需不同层级或不同类型依据汇合"
      ],
      "positive": [
        "用于提高基础正确性、可追溯性和回答稳定性"
      ],
      "negative": [
        "忽略边界会产生基础规则错误、越级事件和高风险误导"
      ],
      "realityChecks": [
        "检查回答中的干支、十神、交运时间、关系名称和事件强度"
      ]
    },
    "advice": [
      "基础事实错误优先纠正，其余取象保持适度灵活"
    ],
    "prohibitions": [
      "禁止单一十神、关系或宫位直接推出事件"
    ],
    "sourceRefs": [
      {
        "sourceId": "system_synthesis",
        "section": "基础规则与确定数据校验",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "1-75,226-250",
        "section": "干支、十神、体用与岁运基础",
        "verificationStatus": "confirmed"
      }
    ],
    "module": "boundaries",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "boundary_actual_transition",
    "title": "大运状态以实际交运年月为准",
    "category": "boundary",
    "domains": [
      "self",
      "career",
      "wealth",
      "spouse"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month",
      "multiYear"
    ],
    "ruleLevel": "A",
    "certainty": "direct",
    "priority": 98,
    "gender": "all",
    "queryKeywords": [
      "交运时间",
      "最后一年",
      "换运"
    ],
    "trigger": {
      "featuresAny": [
        "交运时间",
        "最后一年",
        "换运"
      ]
    },
    "requires": [
      "计算目标日期位于哪步大运"
    ],
    "weakeningConditions": [],
    "imagery": {
      "core": [
        "当前大运、交运年和最后阶段只认实际交运年月，不认展示区间字符串"
      ],
      "positive": [
        "用于提高基础正确性、可追溯性和回答稳定性"
      ],
      "negative": [
        "忽略边界会产生基础规则错误、越级事件和高风险误导"
      ],
      "realityChecks": [
        "检查回答中的干支、十神、交运时间、关系名称和事件强度"
      ]
    },
    "advice": [
      "基础事实错误优先纠正，其余取象保持适度灵活"
    ],
    "prohibitions": [
      "禁止把尚未换运的年份写成新运全年或旧运最后一年"
    ],
    "sourceRefs": [
      {
        "sourceId": "system_synthesis",
        "section": "基础规则与确定数据校验",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "1-75,226-250",
        "section": "干支、十神、体用与岁运基础",
        "verificationStatus": "confirmed"
      }
    ],
    "module": "boundaries",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "boundary_no_month_without_data",
    "title": "无流月数据不指定月份",
    "category": "boundary",
    "domains": [
      "career",
      "wealth",
      "spouse",
      "health"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month",
      "multiYear"
    ],
    "ruleLevel": "A",
    "certainty": "direct",
    "priority": 100,
    "gender": "all",
    "queryKeywords": [
      "流月数据",
      "月份"
    ],
    "trigger": {
      "featuresAny": [
        "流月数据",
        "月份"
      ]
    },
    "requires": [
      "用户明确询问月份且系统提供月柱和月关系"
    ],
    "weakeningConditions": [],
    "imagery": {
      "core": [
        "未加载流月事实时，只能分析全年和交运前后，不指定月份、季节或上下半年"
      ],
      "positive": [
        "用于提高基础正确性、可追溯性和回答稳定性"
      ],
      "negative": [
        "忽略边界会产生基础规则错误、越级事件和高风险误导"
      ],
      "realityChecks": [
        "检查回答中的干支、十神、交运时间、关系名称和事件强度"
      ]
    },
    "advice": [
      "基础事实错误优先纠正，其余取象保持适度灵活"
    ],
    "prohibitions": [
      "禁止模型自行推算或编造流月"
    ],
    "sourceRefs": [
      {
        "sourceId": "system_synthesis",
        "section": "基础规则与确定数据校验",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "1-75,226-250",
        "section": "干支、十神、体用与岁运基础",
        "verificationStatus": "confirmed"
      }
    ],
    "module": "boundaries",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "boundary_no_medical_diagnosis",
    "title": "命理不作医学诊断",
    "category": "boundary",
    "domains": [
      "health"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month",
      "multiYear"
    ],
    "ruleLevel": "A",
    "certainty": "direct",
    "priority": 99,
    "gender": "all",
    "queryKeywords": [
      "疾病",
      "器官",
      "寿命"
    ],
    "trigger": {
      "featuresAny": [
        "疾病",
        "器官",
        "寿命"
      ]
    },
    "requires": [
      "具体症状和治疗交给专业医疗"
    ],
    "weakeningConditions": [],
    "imagery": {
      "core": [
        "健康内容只讨论压力、作息、安全和传统状态倾向"
      ],
      "positive": [
        "用于提高基础正确性、可追溯性和回答稳定性"
      ],
      "negative": [
        "忽略边界会产生基础规则错误、越级事件和高风险误导"
      ],
      "realityChecks": [
        "检查回答中的干支、十神、交运时间、关系名称和事件强度"
      ]
    },
    "advice": [
      "基础事实错误优先纠正，其余取象保持适度灵活"
    ],
    "prohibitions": [
      "禁止预测疾病、器官问题、流产、死亡和寿命"
    ],
    "sourceRefs": [
      {
        "sourceId": "system_synthesis",
        "section": "基础规则与确定数据校验",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "1-75,226-250",
        "section": "干支、十神、体用与岁运基础",
        "verificationStatus": "confirmed"
      }
    ],
    "module": "boundaries",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "boundary_no_illegal_harm",
    "title": "高风险断语不进入正式规则",
    "category": "boundary",
    "domains": [
      "health",
      "parents",
      "children",
      "spouse"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month",
      "multiYear"
    ],
    "ruleLevel": "A",
    "certainty": "direct",
    "priority": 98,
    "gender": "all",
    "queryKeywords": [
      "死亡",
      "牢狱",
      "灾祸",
      "流产"
    ],
    "trigger": {
      "featuresAny": [
        "死亡",
        "牢狱",
        "灾祸",
        "流产"
      ]
    },
    "requires": [
      "需要现实法律医疗安全证据和人工专业判断"
    ],
    "weakeningConditions": [],
    "imagery": {
      "core": [
        "课程中的高风险经验断语只能作为待研究材料，不能进入用户侧自动推理"
      ],
      "positive": [
        "用于提高基础正确性、可追溯性和回答稳定性"
      ],
      "negative": [
        "忽略边界会产生基础规则错误、越级事件和高风险误导"
      ],
      "realityChecks": [
        "检查回答中的干支、十神、交运时间、关系名称和事件强度"
      ]
    },
    "advice": [
      "基础事实错误优先纠正，其余取象保持适度灵活"
    ],
    "prohibitions": [
      "禁止自动输出死亡、牢狱、重大事故、流产或犯罪预测"
    ],
    "sourceRefs": [
      {
        "sourceId": "system_synthesis",
        "section": "基础规则与确定数据校验",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "1-75,226-250",
        "section": "干支、十神、体用与岁运基础",
        "verificationStatus": "confirmed"
      }
    ],
    "module": "boundaries",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "boundary_source_verification",
    "title": "扫描资料按核读状态分级",
    "category": "boundary",
    "domains": [
      "self",
      "career",
      "wealth",
      "spouse"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month",
      "multiYear"
    ],
    "ruleLevel": "A",
    "certainty": "direct",
    "priority": 100,
    "gender": "all",
    "queryKeywords": [
      "来源",
      "核读",
      "扫描"
    ],
    "trigger": {
      "featuresAny": [
        "来源",
        "核读",
        "扫描"
      ]
    },
    "requires": [
      "sourceRefs标注verificationStatus"
    ],
    "weakeningConditions": [],
    "imagery": {
      "core": [
        "已人工核读内容可进入正式规则；仅目录或模糊识别内容只登记研究待办"
      ],
      "positive": [
        "用于提高基础正确性、可追溯性和回答稳定性"
      ],
      "negative": [
        "忽略边界会产生基础规则错误、越级事件和高风险误导"
      ],
      "realityChecks": [
        "检查回答中的干支、十神、交运时间、关系名称和事件强度"
      ]
    },
    "advice": [
      "基础事实错误优先纠正，其余取象保持适度灵活"
    ],
    "prohibitions": [
      "禁止把未核读扫描内容冒充已提炼规则"
    ],
    "sourceRefs": [
      {
        "sourceId": "system_synthesis",
        "section": "基础规则与确定数据校验",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "1-75,226-250",
        "section": "干支、十神、体用与岁运基础",
        "verificationStatus": "confirmed"
      }
    ],
    "module": "boundaries",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  },
  {
    "id": "boundary_conflict_resolution",
    "title": "多来源冲突先保留条件差异",
    "category": "boundary",
    "domains": [
      "self",
      "career",
      "wealth",
      "spouse"
    ],
    "scopes": [
      "natal",
      "luck",
      "year",
      "month",
      "multiYear"
    ],
    "ruleLevel": "A",
    "certainty": "direct",
    "priority": 99,
    "gender": "all",
    "queryKeywords": [
      "多来源",
      "冲突",
      "仲裁"
    ],
    "trigger": {
      "featuresAny": [
        "多来源",
        "冲突",
        "仲裁"
      ]
    },
    "requires": [
      "硬事实优先，条件更完整、直接作用和多源支持者优先"
    ],
    "weakeningConditions": [],
    "imagery": {
      "core": [
        "不同老师断法不一致时，保留各自适用条件、来源和反证，不强行合成绝对口诀"
      ],
      "positive": [
        "用于提高基础正确性、可追溯性和回答稳定性"
      ],
      "negative": [
        "忽略边界会产生基础规则错误、越级事件和高风险误导"
      ],
      "realityChecks": [
        "检查回答中的干支、十神、交运时间、关系名称和事件强度"
      ]
    },
    "advice": [
      "基础事实错误优先纠正，其余取象保持适度灵活"
    ],
    "prohibitions": [
      "禁止无条件选择更极端或更吸引人的断语"
    ],
    "sourceRefs": [
      {
        "sourceId": "system_synthesis",
        "section": "基础规则与确定数据校验",
        "verificationStatus": "confirmed"
      },
      {
        "sourceId": "cui_blind_notes_5000",
        "pdfPage": "1-75,226-250",
        "section": "干支、十神、体用与岁运基础",
        "verificationStatus": "confirmed"
      }
    ],
    "module": "boundaries",
    "verificationStatus": "confirmed",
    "researchOnly": false,
    "allowInUserAnswer": true
  }
];

