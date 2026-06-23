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
      "你是传统八字出生原局的证据综合解释器。",
      "本地系统已经完成排盘、十神、旺衰、干支关系、宫位、亲属星、专业结构和结构状态判断。",
      "你不得重新排盘，不得修改本地事实，也不得自行新增命理关系。",
      "",
      "输入数据说明：",
      "chart是不可修改的四柱事实。",
      "baseline是本地系统已经整理的原局基础状态。",
      "hardFacts是确定事实。",
      "positionContext只描述十神、宫位、主宾、远近和关系所在位置。",
      "patterns.confirmedPatterns可以进入核心结论。",
      "patterns.supportedPatterns只能写成明显倾向。",
      "patterns.conditionalPatterns只能进入条件线索。",
      "workMechanisms只解释本地系统已经提供的做功方向，不得自行补链。",
      "domainLabels只是分类名称，不是证据。",
      "",
      "分析要求：",
      "1. 找到最能统领全盘的一条核心运行机制。",
      "2. 解释优势、代价、重复模式和各人生领域如何由同一结构展开。",
      "3. 所有有充分依据且提供新信息的重要内容都应保留。",
      "4. 不按固定条数、固定领域数量或固定总字数裁剪。",
      "5. 同一个事实不能反复包装成多个结论。",
      "6. 核心机制完整解释一次，后续领域只说明具体落地。",
      "7. 结论必须结合位置、主宾、远近、宫位、藏透、关系和结构状态。",
      "8. 不得把内部统计、领域名称或分类标签当成命理证据。",
      "",
      "禁止推断：",
      "1. 不得仅凭单一十神推断朋友数量、兄弟姐妹数量、婚姻次数、子女早晚或房产得失。",
      "2. 不得把五行机械对应成具体职业行业。",
      "3. 不得判断具体器官、疾病、手术、死亡或灾祸。",
      "4. 不得混入大运、流年、流月和具体年份事件。",
      "5. 不得把conditional或candidate写成已经确定的事实。",
      "6. 不得写收入一定稳定、财富机会一定很多、一定成为团队核心等无直接证据结论。",
      "",
      "证据引用规则：",
      "evidenceRefs只能引用输入中真实存在的hardFacts、patterns或relations的ID。",
      "domainLabels、字段名和分类键不能放入evidenceRefs。",
      "证据ID必须真正支持对应结论，不能只因主题相关就引用。",
      "",
      "必须只返回一个完整合法JSON对象。",
      "不要使用Markdown代码块。",
      "不要在JSON外添加文字。",
      "不得省略overview、coreMechanism和lifeThemes。",
    ].join("\n"),

    user: JSON.stringify(
      {
        task: {
          type:
            "natal_deep_analysis",

          scope:
            "natal",

          language:
            "zh-CN",

          audience:
            "general_user",

          interaction:
            "one_click_report",
        },

        evidencePack:
          modelPack,

        /*
         * 这里继续保留你现有的
         * outputContract完整内容。
         */
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
      "bazi-deep-analysis-result-v1",

    scope:
      "natal",

    title:
      "出生原局深度分析",

    confidence:
      "high | medium | low",

    overview: {
      headline:
        "白话核心结论",

      summary:
        "完整但不重复的全局总结",

      evidenceRefs: [],
    },

    coreMechanism: {
      title:
        "核心运行机制",

      steps: [
        {
          title:
            "机制标题",

          content:
            "说明形成、传递和结果",

          evidenceRefs: [],
        },
      ],

      synthesis:
        "把各层结构合成一条完整因果链",

      evidenceRefs: [],
    },

    strengths: [
      {
        title:
          "核心优势",

        explanation:
          "优势为何形成",

        cost:
          "同源代价",

        bestUse:
          "最适合的发挥方式，不指定固定行业",

        evidenceRefs: [],
      },
    ],

    repeatingPatterns: [
      {
        title:
          "长期容易重复的模式",

        trigger:
          "如何开始",

        cycle:
          "如何反复",

        consequence:
          "可能形成的现实影响",

        adjustment:
          "如何改善",

        evidenceRefs: [],
      },
    ],

    lifeThemes: [
      {
        key:
          "主题英文键",

        title:
          "用户可读主题",

        treatment:
          "standalone | integrated | brief",

        summary:
          "该领域的具体判断",

        positive: [],

        pressure: [],

        connection:
          "该领域与核心机制的联系",

        evidenceRefs: [],
      },
    ],

    conditionalInsights: [
      {
        title:
          "条件结构或观察线索",

        status:
          "structurally_supported | conditional | candidate",

        whatSeen:
          "目前已经看到什么",

        conditions: [],

        counterEvidence: [],

        evidenceRefs: [],
      },
    ],

    realityChecks: [
      {
        title:
          "现实验证点",

        description:
          "用户可以观察的长期表现",

        evidenceRefs: [],
      },
    ],

    actions: [
      {
        title:
          "行动方向",

        action:
          "可执行但不机械的建议",

        basis:
          "为什么与当前结构对应",

        evidenceRefs: [],
      },
    ],

    boundaries: [],

    warnings: [],
  };
}