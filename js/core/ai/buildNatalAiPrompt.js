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
      "3. 不向用户提问，不输出现实验证问题，不出现你是否之类问句。",
      "4. 不逐字段复述，不罗列本地依据数量，不展示内部字段名。",
      "5. 面向普通用户，命理术语出现后应立即解释其行为含义。",
      "6. 正文使用自然小标题和连续段落，避免卡片、表格、编号证据清单和重复结论。",
      "7. 正文约1200至1800个中文字符，建议覆盖总体判断、性格与能力、学习与事业、财富与资源、感情与人际、家庭与身心、综合建议。",
      "",
      "返回格式：",
      "必须只返回一个完整合法JSON对象，不使用Markdown代码块，不在JSON外添加文字。",
      "完整报告正文全部写入overview.summary；overview.summary内部可以使用Markdown小标题和换行。",
      "overview.evidenceRefs只引用真正支持总体判断的有效证据ID，不为凑数量而引用。",
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
            "continuous_text",

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
      "bazi-natal-text-v2",

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
        "一篇完整连续的中文原局分析与建议正文，可含自然小标题和换行，不得包含向用户提问的验证点",

      evidenceRefs: [],
    },

    boundaries: [],

    warnings: [],
  };
}
