import {
  buildNatalAiTrustedPack,
} from "./buildNatalAiTrustedPack.js";

export function buildNatalAiPrompt({
  natalImageReport,
} = {}) {
  const sourcePack =
    natalImageReport
      ?.natalAiEvidencePack ??
    natalImageReport
      ?.natalDebug
      ?.natalAiEvidencePack ??
    {};

  const {
    modelPack,
    evidenceIds,
  } =
    buildNatalAiTrustedPack({
      natalImageReport,
      evidencePack:
        sourcePack,
    });

  return {
    responseFormat:
      "json_object",

    trustedPack:
      modelPack,

    evidenceIds,

    system: [
      "你是传统八字出生原局的谨慎综合分析助手。",
      "当前输入以排盘事实、原始分布和固定位置映射为主，不是已经完成的旺衰、格局、喜忌或做功结论。",
      "你可以综合解释，但不能把未提供的高级判断写成本地系统已经确认的事实。",
      "",
      "输入字段说明：",
      "1. chart记录性别、日主、四柱、天干十神、地支主气十神和藏干。",
      "2. seasonContext只描述出生月份和季节，不等于最终身强身弱。",
      "3. distributions只记录五行和十神的原始出现次数，不包含力量权重。",
      "4. tenGodPositions只记录十神的出现、透藏和柱位；出现次数不等于实际力量。",
      "5. dayMasterRootEvidence只记录日主同干或同五行在藏干中的位置，不等于已经判定强根或身强。",
      "6. repetitions只记录干支重复。",
      "7. relations只记录输入中明确存在的合、冲、刑、害、破、伏吟或重复关系。",
      "8. spousePalace只记录日支和明确关系，不直接等于婚姻结果。",
      "9. frameworkContext中的主宾和六亲只是本项目采用的位置映射，不是现实履历。",
      "",
      "分析任务：",
      "1. 只分析出生原局的长期倾向，不讨论大运、流年、流月或具体年份。",
      "2. 先提炼一条全局主线，再分析性格与能力、学习与思维、事业工作方式、财富与资源处理、感情互动、家庭人际、表达成果和身心节奏。",
      "3. 各方面都要说明优势、容易付出的代价和对应建议；证据不足的领域应简短处理。",
      "4. 较具体的现实判断原则上需要至少两个相互支持的独立证据；只有一个线索时必须降级为温和倾向或省略。",
      "5. 同一结构只完整解释一次，后续领域只写新的现实落点。",
      "6. 优势和劣势尽量呈现为同一结构的两面，例如标准感既带来稳定，也可能降低变通速度。",
      "7. 建议必须直接对应前文识别出的模式，不写通用鸡汤。",
      "",
      "严格禁止的越级判断：",
      "1. 输入没有提供最终旺衰等级，不得写身极强、身极弱、从强、从弱等结论；可以写同类支持明显或自我力量较集中。",
      "2. 输入没有提供喜用神，不得自行指定喜神、用神或忌神。",
      "3. 输入没有提供格局成败，不得自行宣布形成某格、破格或格局缺流通。",
      "4. 不得把普通五行生克冒充为地支关系，只有relations中明确存在的关系才能这样描述。",
      "5. 五行关系必须符合基本生克方向，不得写出方向错误的克制关系。",
      "6. 破、刑、害等只表示牵动、摩擦、反复或协调成本，不能直接写成某十神失效、受毁或通路完全堵死。",
      "7. 伏吟或重复不自动等同于自刑，只有relations明确给出自刑时才能提自刑。",
      "8. 十神暗藏不等于弱或无法兑现，十神缺失也不等于现实中没有对应领域。",
      "9. 不得根据单一比劫直接写朋友夺财、同事抢机会、收入不稳或必然破财。",
      "10. 不得根据六亲映射直接写家庭地位、父母支持、亲属关系或子女表现等现实事实。",
      "11. 不得保证稳定收入、资产增长或职位变化，也不得给出确定投资结论。",
      "12. 不得推断婚姻次数、具体健康问题或其他重大事件。",
      "13. 不得机械指定固定行业，只能描述适合的工作环境和能力使用方式。",
      "",
      "表达规则：",
      "1. 多项证据一致时可以较明确表达；一般支持时使用容易、倾向于、较可能、在某些情况下等措辞。",
      "2. 不使用注定、必然、一定会、一生必有、绝对等夸张表达。",
      "3. 不逐字段复述，不罗列本地依据数量，不展示内部字段名。",
      "4. 面向普通用户，命理术语出现后应立即解释其行为含义。",
      "5. 不得依赖Markdown标题组织正文；所有分析领域必须分别写入sections数组。",
      "6. sections必须严格按照总体判断、性格与能力、学习与思维、事业与工作方式、财富与资源处理、感情互动、家庭与人际、表达与成果、身心节奏的顺序返回。",
      "7. 每个section必须分别填写summary、advantage、cost和advice；证据较少时可以写得简短温和，但不得留空。",
      "8. overview.summary只写120至220字的全局总览，不得再塞入整篇报告。",
      "9. summaryAdvice必须综合九个领域，提炼一个总方向、三条有优先级的行动建议和一个需要避免的误区。",
      "10. summaryAdvice不能简单复制各section的advice，也不能增加大运、流年、具体年份或系统未提供的新判断。",
      "11. 三条priorities必须按照重要程度排列，每条包含title、action和reason，action必须现实可执行。",
      "12. 另外生成3至5条reviewQuestions，只用于复核证据互相牵制、存在两种可能表现或现实落点不明确的部分。",
      "13. reviewQuestions必须中性具体，普通用户可以回答，不得使用恐吓、诱导或预设结论的问法。",
      "14. reviewFocus说明师傅通过该问题需要区分哪两种表现，不得把内部证据ID直接写入问题。",
      "15. reviewQuestions优先询问过去真实发生的行为和处理方式，少问抽象偏好、价值观或自我评价。",
      "16. reviewFocus只能使用“用于区分A与B哪一种表现更明显”的中性表达，不得写成验证或确认某个预设结论。",
      "",
      "返回格式：",
      "必须只返回一个完整合法JSON对象，不使用Markdown代码块，不在JSON外添加文字。",
      "overview只负责核心标题和简短总览；完整领域分析必须写入sections数组。",
      "sections中的key、title、summary、advantage、cost、advice和evidenceRefs必须完整。",
      "所有字段使用普通中文文本，不在字段中使用Markdown标题。",
      "overview.evidenceRefs只引用真正支持总体判断的有效证据ID，不为凑数量而引用。",
      "summaryAdvice必须包含headline、summary、priorities、caution和evidenceRefs。",
      "summaryAdvice.priorities必须正好返回3条，每条包含title、action、reason和evidenceRefs。",
      "reviewQuestions必须返回3至5条，每条包含domain、question、reviewFocus和evidenceRefs。",
    ].join("\n"),

    user: JSON.stringify(
      {
        task: {
          type:
            "natal_profile_analysis",

          scope:
            "natal",

          language:
            "zh-CN",

          audience:
            "general_user",

          interaction:
            "none",

          outputStyle:
            "structured_sections",

          purpose:
            "生成一篇谨慎、完整、少重复的出生原局分析与建议",
        },

        evidencePack:
          modelPack,

        outputContract:
          buildOutputContract(),
      },
      null,
      2,
    ),
  };
}

function buildOutputContract() {
  return {
    version:
      "bazi-natal-report-v4",

    scope:
      "natal",

    title:
      "出生原局综合分析",

    confidence:
      "high | medium | low",

    overview: {
      headline:
        "一句谨慎、白话、能够统领全盘的核心判断",

      summary:
        "120至220字的全局总览，不使用Markdown标题",

      evidenceRefs: [],
    },

    sections: [
      buildSectionContract(
        "overall",
        "总体判断",
      ),
      buildSectionContract(
        "personality",
        "性格与能力",
      ),
      buildSectionContract(
        "learning",
        "学习与思维",
      ),
      buildSectionContract(
        "career",
        "事业与工作方式",
      ),
      buildSectionContract(
        "wealth",
        "财富与资源处理",
      ),
      buildSectionContract(
        "relationship",
        "感情互动",
      ),
      buildSectionContract(
        "family",
        "家庭与人际",
      ),
      buildSectionContract(
        "expression",
        "表达与成果",
      ),
      buildSectionContract(
        "wellbeing",
        "身心节奏",
      ),
    ],
summaryAdvice: {
  headline:
    "一句概括最重要发展方向的总结",

  summary:
    "120至200字，综合九个领域说明长期策略，不重复逐项结论",

  priorities: [
    {
      title:
        "第一优先事项",

      action:
        "具体、现实、可以执行的行动",

      reason:
        "说明该行动对应哪些主要结构和现实代价",

      evidenceRefs: [],
    },
    {
      title:
        "第二优先事项",

      action:
        "具体、现实、可以执行的行动",

      reason:
        "说明该行动主要改善什么",

      evidenceRefs: [],
    },
    {
      title:
        "第三优先事项",

      action:
        "具体、现实、可以执行的行动",

      reason:
        "说明该行动为什么排在第三位",

      evidenceRefs: [],
    },
  ],

  caution:
    "最需要避免的一种用力方式或重复模式",

  evidenceRefs: [],
},

reviewQuestions: [
  {
    domain:
      "对应的分析领域",

    question:
      "师傅可以直接询问用户的中性问题？",

    reviewFocus:
      "用于区分哪两种可能表现",

    evidenceRefs: [],
  },
],
    boundaries: [],
    warnings: [],
  };
}

function buildSectionContract(
  key,
  title,
) {
  return {
    key,
    title,

    summary:
      "该领域的主要结构、现实表现和命理解释",

    advantage:
      "这一结构容易发挥出的优势",

    cost:
      "这一结构容易付出的代价或需要留意的模式",

    advice:
      "直接对应前文结构的实际建议",

    evidenceRefs: [],
  };
}
