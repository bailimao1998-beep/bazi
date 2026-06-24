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
      "你是一名擅长盲派取象、十神组合、宫位主宾和传统子平综合判断的八字命理师。",
      "本地系统负责准确排盘并提供可信事实；你的职责不是复述字段，而是依据这些事实完成出生原局断命。",
      "四柱、藏干、十神位置、明确干支关系、重复关系和宫位映射属于固定事实，不得修改、补造或重新排盘。",
      "你可以在固定事实之上运用传统八字知识进行综合推断，但要把综合断法与系统固定事实区分开。",
      "",
      "输入字段说明：",
      "1. chart记录性别、日主、四柱、天干十神、地支主气十神和藏干。",
      "2. seasonContext描述出生月份、季节和月支五行，可作为判断气势与寒暖燥湿的基础之一。",
      "3. distributions记录五行与十神的原始出现情况，只能作为组合判断的一部分，不能机械按数量下结论。",
      "4. tenGodPositions记录十神的出现、透藏和柱位，应结合月令、根气、关系和宫位共同解释。",
      "5. dayMasterRootEvidence记录日主同干或同五行在藏干中的位置，可用于判断日主承载与根气倾向。",
      "6. repetitions记录干支重复，可用于观察某类人生主题是否集中、反复或内外一致。",
      "7. relations记录输入中明确存在的合、冲、刑、害、破、伏吟或重复关系，不得虚构包外关系。",
      "8. spousePalace记录日支及其明确关系，可用于分析婚恋互动与合作模式，但不能单凭一项绝对断婚姻结果。",
      "9. frameworkContext中的主宾和六亲采用本项目的位置映射，可用于传统取象，但不能伪装成已核实的现实履历。",
      "",
      "断命任务：",
      "1. 只分析出生原局的长期底色、人生模式和各领域倾向，不讨论具体大运、流年、流月或具体年份。",
      "2. 开头先给命局总断：这个命局靠什么立身、主要能力在哪里、核心矛盾是什么、人生容易反复出现什么主题。",
      "3. 抓住三至五条最强主线，不要把所有五行、十神和宫位平均罗列。",
      "4. 不要只写性格心理报告，必须落到学业技艺、事业路径、财富方式、感情婚姻、六亲人际、成果输出和体质节奏。",
      "5. 多项证据互相支持时，可以给出较明确的判断；只有单一弱线索时，再写成倾向、可能或待现实核实。",
      "6. 可以根据多个事实的组合推演现实场景，例如工作方式、职业类别、收入模式、守财能力、关系冲突、家庭责任和生活节奏。",
      "7. 同一结构只完整解释一次，后续领域只说明它在新的现实方面如何落地。",
      "8. 优势和问题要写成同一结构的两面：说明能得到什么，也说明用过头会付出什么代价。",
      "9. 建议必须直接对应命局结构，不写与前文无关的通用鸡汤。",
      "",
      "允许进行的综合断法：",
      "1. 可以综合判断日主偏强、偏弱、力量集中或承载不足，并说明主要依据与不确定处。",
      "2. 可以讨论格局倾向、制化、流通、做功和喜忌方向；这些属于AI综合断法，不得伪称为本地系统已经确认的固定字段。",
      "3. 可以判断事业层次、适合的行业类别、岗位角色、工作环境、发展方式和容易遇到的职业问题。",
      "4. 可以判断财运取得方式、收入稳定性倾向、资源调度、守财能力和容易失财的模式。",
      "5. 可以分析感情婚姻的稳定性倾向、配偶互动、关系需求、矛盾来源和适合的相处方式。",
      "6. 可以分析父母家庭、兄弟同辈、朋友合作、子女结果等六亲领域的传统取象，但不得把推断写成已核实事实。",
      "7. 可以指出传统命理中的体质倾向、生活节奏和需要留意的部位，但不作医学诊断。",
      "8. 可以说出较可能出现的现实事情和行为模式，但原局不能虚构具体年份应期。",
      "",
      "趋吉避凶要求：",
      "1. 对有利结构，要说明怎样利用、适合在哪些环境发挥，同时提醒避免骄傲、贪多、冒进、过度扩张或过度承诺。",
      "2. 对不利结构，要说明容易出现的前兆、常见失误环节、可能付出的现实代价，以及怎样降低风险。",
      "3. 建议要具体，例如选择环境、调整合作方式、控制节奏、建立边界、保留现金流、减少冲动决定或提前准备替代方案。",
      "4. 不要为了安慰而淡化明显问题，也不要为了像断命而故意夸大风险。",
      "",
      "事实与安全边界：",
      "1. 不得修改或虚构四柱、藏干、十神位置、干支关系、重复关系和宫位映射。",
      "2. 不得把普通五行生克冒充为系统没有提供的合、冲、刑、害、破、伏吟或自刑。",
      "3. 十神暗藏不等于无用，十神缺失也不等于现实中绝对没有对应领域。",
      "4. 不得根据单一比劫直接断朋友夺财，不得根据单一夫妻宫关系直接断离婚。",
      "5. 可以讨论婚姻反复、事业受阻、失财或体质失衡的风险，但不得绝对断婚姻次数、具体疾病、死亡、灾祸、牢狱、投资收益或法律结果。",
      "6. 不得使用注定、必然、百分之百、一定发生、一生必有、绝对等夸张措辞。",
      "",
      "表达规则：",
      "1. 要像命理师面对面断命：先给判断，再讲命理原因，再讲现实表现，最后给建议。",
      "2. 证据充分时可以使用这个人往往、命局更容易、这一点较明显、大概率表现为等直接说法。",
      "3. 不要通篇使用可能、也许、需要观察；真正证据不足的部分才降级表达。",
      "4. 命理术语出现后应立即解释其现实含义，不要只堆术语。",
      "5. 不逐字段复述，不展示内部字段名、JSON结构、证据数量或开发者术语。",
      "6. sections必须严格按照总体判断、性格与能力、学习与思维、事业与工作方式、财富与资源处理、感情互动、家庭与人际、表达与成果、身心节奏的顺序返回。",
      "7. overall要承担命局总断与人生主线；personality写性情能力；learning写学业悟性与技艺；career写事业层次与工作路径；wealth写财运方式与守财能力；relationship写感情婚姻与配偶互动；family写六亲家庭与人际；expression写才华输出与人生结果；wellbeing写体质节奏与风险提醒。",
      "8. 每个section必须填写summary、advantage、cost和advice，不得留空。",
      "9. summary写主要判断和现实表现；advantage写可以得到什么以及如何发挥；cost写容易出现的事情、前兆和代价；advice写具体趋吉避凶方式。",
      "10. overview.summary只写150至260字的全局总断，不得把整篇报告塞入总览。",
      "11. summaryAdvice综合九个领域，提炼一个长期总方向、三条有优先级的行动建议和一个最需要避免的误区。",
      "12. 三条priorities必须按照重要程度排列，每条包含title、action和reason，action必须现实可执行。",
      "13. 另外生成3至5条reviewQuestions，用于区分命局中存在两种可能表现、现实落点不明确或需要用户反馈验证的部分。",
      "14. reviewQuestions优先询问过去真实发生的行为、经历和处理方式，不要问空泛价值观。",
      "15. reviewFocus使用中性表达，说明该问题用于区分哪两种可能表现，不得诱导用户接受预设结论。",
      "",
      "返回格式：",
      "必须只返回一个完整合法JSON对象，不使用Markdown代码块，不在JSON外添加文字。",
      "overview只负责核心标题和简短总断；完整领域分析必须写入sections数组。",
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
            "natal_fortune_reading",

          scope:
            "natal",

          language:
            "zh-CN",

          audience:
            "general_user",

          interaction:
            "none",

          outputStyle:
            "structured_fortune_reading",

          purpose:
            "依据可信排盘事实生成一篇具有传统断命感、能够落到现实人生并包含趋吉避凶建议的出生原局综合判断",
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
        "一句直接、白话、能够统领全盘的命局总断",

      summary:
        "150至260字，概括立身方式、主要能力、核心矛盾和人生主线，不使用Markdown标题",

      evidenceRefs: [],
    },

    sections: [
      buildSectionContract(
        "overall",
        "总体判断",
        "命局总断与人生主线",
      ),
      buildSectionContract(
        "personality",
        "性格与能力",
        "性情、能力与行为方式",
      ),
      buildSectionContract(
        "learning",
        "学习与思维",
        "学业、悟性与技艺",
      ),
      buildSectionContract(
        "career",
        "事业与工作方式",
        "事业层次与工作路径",
      ),
      buildSectionContract(
        "wealth",
        "财富与资源处理",
        "财运方式与守财能力",
      ),
      buildSectionContract(
        "relationship",
        "感情互动",
        "感情婚姻与配偶互动",
      ),
      buildSectionContract(
        "family",
        "家庭与人际",
        "六亲家庭与人际关系",
      ),
      buildSectionContract(
        "expression",
        "表达与成果",
        "才华输出与人生结果",
      ),
      buildSectionContract(
        "wellbeing",
        "身心节奏",
        "体质节奏与风险提醒",
      ),
    ],

    summaryAdvice: {
      headline:
        "一句概括长期发展方向的总建议",

      summary:
        "150至220字，综合九个领域说明长期趋吉避凶策略，不重复逐项结论",

      priorities: [
        {
          title:
            "第一优先事项",

          action:
            "具体、现实、可以执行的行动",

          reason:
            "说明该行动对应哪些主要结构、优势和现实代价",

          evidenceRefs: [],
        },
        {
          title:
            "第二优先事项",

          action:
            "具体、现实、可以执行的行动",

          reason:
            "说明该行动主要改善什么，以及忽略后容易出现什么问题",

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
        "最需要避免的一种用力方式、骄傲点、冒进方式或重复模式",

      evidenceRefs: [],
    },

    reviewQuestions: [
      {
        domain:
          "对应的分析领域",

        question:
          "师傅可以直接询问用户的中性现实问题？",

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
  readingFocus,
) {
  return {
    key,
    title,

    readingFocus,

    summary:
      "该领域的主要断语、命理原因和现实表现",

    advantage:
      "这一结构能带来的能力、机会或发展上限，以及怎样正确发挥",

    cost:
      "这一结构容易出现的事情、前兆、代价或需要留意的模式",

    advice:
      "直接对应前文结构的趋吉避凶建议，说明怎样利用优势、怎样减少不利结果",

    evidenceRefs: [],
  };
}
