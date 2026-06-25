
const DOMAIN_RULES = [
  {
    key: "self",
    label: "性格与自我",
    pattern: /性格|脾气|控制欲|固执|主见|聪明|天赋|能力|优点|缺点|内耗|自信|胆量|人格|为人|个性/,
  },
  {
    key: "parents",
    label: "父母与原生家庭",
    pattern: /父母|父亲|母亲|长辈|原生家庭|家庭关系|家里人/,
  },
  {
    key: "siblings",
    label: "兄弟姐妹与同辈",
    pattern: /兄弟|姐妹|手足|同辈|同学|同事关系/,
  },
  {
    key: "spouse",
    label: "感情与婚姻",
    pattern: /感情|婚姻|对象|配偶|正缘|桃花|恋爱|分手|复合|异性|伴侣|妻子|丈夫/,
  },
  {
    key: "children",
    label: "子女与成果",
    pattern: /子女|孩子|后代|生育|怀孕|作品|成果|学生|晚辈/,
  },
  {
    key: "wealth",
    label: "财运与资源",
    pattern: /财运|财富|赚钱|收入|工资|投资|资产|负债|预算|资源|钱|偏财|正财/,
  },
  {
    key: "health",
    label: "健康与状态",
    pattern: /健康|身体|体质|疾病|睡眠|焦虑|压力|情绪|疲劳|精神状态/,
  },
  {
    key: "movement",
    label: "迁移与环境",
    pattern: /出国|异地|迁移|搬家|旅行|出差|城市|居住|换地方|环境变化|远方/,
  },
  {
    key: "friends",
    label: "人际与合作",
    pattern: /朋友|社交|人脉|合作|客户|贵人|团队|圈子|人际|合伙/,
  },
  {
    key: "career",
    label: "事业与学业",
    pattern: /事业|工作|职业|行业|创业|项目|岗位|升职|辞职|跳槽|管理|技术|学业|学习|考试|升学|专业/,
  },
  {
    key: "property",
    label: "房产与居住承载",
    pattern: /房产|买房|卖房|住房|装修|土地|不动产|置业/,
  },
  {
    key: "fortune",
    label: "精神与长期福气",
    pattern: /福气|福德|幸福感|精神世界|心态|晚年|享受|内在安全感/,
  },
];

const BAZI_ANCHOR_PATTERN =
  /八字|命盘|命局|原局|四柱|大运|流年|流月|命理|算命|日主|十神|财星|官杀|印星|食伤|比劫|用神|喜忌|格局|取象|断命|运势|正缘|桃花/;

const PERSONAL_INFERENCE_PATTERN =
  /(?:我|本人|他|她|这个人|此人|命主).{0,12}(?:会不会|是不是|容易|适合|怎么样|如何|为何|为什么|性格|未来|一生|命|运|发展|选择|关系)/;

const GENERAL_ASSISTANT_PATTERN =
  /翻译|写邮件|改作文|代码报错|编程问题|天气|汇率|签证材料|手机设置|电脑设置|做饭|食谱|数学题|英语题|商品推荐/;

const DEEP_PATTERN =
  /全面|详细|深入|完整|综合|人生画像|人物画像|一生|所有方面|系统分析|仔细分析|断准|专业分析/;

const CONCISE_PATTERN =
  /简单说|简短|一句话|概括|不要太长/;

const CURRENT_STAGE_PATTERN =
  /现在|目前|当前|最近|这段时间|当下/;

const MONTH_ALL_PATTERN =
  /每个月|逐月|十二个月|哪几个月|哪些月|几个月|月月|流月详解/;

export function buildChatContextPlan({
  question = "",
  chatIntent = "free",
  requestedYears = [],
  yearSearchPlan = null,
  chartAvailable = false,
  monthReportsAvailable = false,
  targetYear = null,
  selectedMonth = null,
} = {}) {
  const text =
    String(
      question ??
      "",
    ).trim();

  const normalizedIntent =
    String(
      chatIntent ??
      "free",
    );

  const timeScope =
    resolveTimeScope({
      text,
      chatIntent:
        normalizedIntent,
    });

  const domains =
    detectDomainKeys(
      text,
    );

  const explicitBazi =
    BAZI_ANCHOR_PATTERN.test(
      text,
    );

  const likelyPersonalInference =
    PERSONAL_INFERENCE_PATTERN.test(
      text,
    );

  const looksGeneral =
    GENERAL_ASSISTANT_PATTERN.test(
      text,
    ) &&
    !explicitBazi &&
    !likelyPersonalInference &&
    domains.length ===
      0 &&
    normalizedIntent ===
      "free";

  const isBaziQuestion =
    Boolean(
      chartAvailable,
    ) &&
    !looksGeneral &&
    (
      normalizedIntent !==
        "free" ||
      explicitBazi ||
      likelyPersonalInference ||
      domains.length >
        0
    );

  const answerDepth =
    CONCISE_PATTERN.test(
      text,
    )
      ? "concise"
      : DEEP_PATTERN.test(
          text,
        )
        ? "deep"
        : "standard";

  const monthMode =
    timeScope ===
      "month"
      ? (
          MONTH_ALL_PATTERN.test(
            text,
          )
            ? "all"
            : "selected"
        )
      : "none";

  const normalizedYears =
    normalizeYears(
      requestedYears,
    );

  const includeLuckImagery =
    isBaziQuestion &&
    (
      timeScope !==
        "natal" ||
      CURRENT_STAGE_PATTERN.test(
        text,
      ) ||
      /大运|阶段|十年/.test(
        text,
      )
    );

  return {
    version:
      "chat-context-plan-v1",

    isBaziQuestion,

    timeScope,

    answerDepth,

    domainKeys:
      domains.length >
        0
        ? domains
        : [
            "general",
          ],

    requestedYears:
      normalizedYears,

    targetYear:
      finiteOrNull(
        targetYear,
      ),

    selectedMonth:
      finiteOrNull(
        selectedMonth,
      ),

    yearSearchMode:
      yearSearchPlan?.mode ??
      (
        normalizedYears.length >
          0
          ? "explicit_or_scanned"
          : "none"
      ),

    monthMode,

    include: {
      natalHardFacts:
        Boolean(
          chartAvailable,
        ),

      natalAuxiliaryFacts:
        Boolean(
          chartAvailable,
        ),

      allLuckBasics:
        Boolean(
          chartAvailable,
        ),

      yearBasics:
        [
          "singleYear",
          "multiYear",
          "month",
        ].includes(
          timeScope,
        ),

      monthBasics:
        timeScope ===
          "month",

      natalImagery:
        isBaziQuestion,

      luckImagery:
        includeLuckImagery,

      yearImagery:
        isBaziQuestion &&
        [
          "singleYear",
          "multiYear",
          "month",
        ].includes(
          timeScope,
        ),

      monthImagery:
        isBaziQuestion &&
        timeScope ===
          "month",

      chatHistory:
        true,
    },

    limits: {
      natalImagery:
        answerDepth ===
          "deep"
          ? 10
          : answerDepth ===
              "concise"
            ? 4
            : 7,

      luckImagery:
        answerDepth ===
          "deep"
          ? 8
          : 5,

      yearImagery:
        timeScope ===
          "multiYear"
          ? 20
          : 5,

      monthImagery:
        monthMode ===
          "all"
          ? 12
          : 3,

      manifestationsPerItem:
        answerDepth ===
          "deep"
          ? 4
          : 3,

      chatTurns:
        4,
    },

    availability: {
      chart:
        Boolean(
          chartAvailable,
        ),

      monthReports:
        Boolean(
          monthReportsAvailable,
        ),
    },

    plannerInstruction:
      "本规划器只负责选择输入材料和时间层，不负责替AI下最终结论。",
  };
}

export function detectDomainKeys(
  question = "",
) {
  const text =
    String(
      question ??
      "",
    );

  return DOMAIN_RULES
    .filter(
      (rule) =>
        rule.pattern.test(
          text,
        ),
    )
    .map(
      (rule) =>
        rule.key,
    );
}

export function resolveTimeScope({
  text = "",
  chatIntent = "free",
} = {}) {
  if (
    chatIntent ===
      "monthTrend" ||
    /流月|哪月|几月|月份|哪个月|哪些月|每个月|逐月/.test(
      text,
    )
  ) {
    return "month";
  }

  if (
    chatIntent ===
      "multiYear" ||
    /哪几年|哪些年|什么时候|何时|未来.{0,3}(?:\d+|三|四|五|六|七|八|九|十)年|多年/.test(
      text,
    )
  ) {
    return "multiYear";
  }

  if (
    chatIntent ===
      "yearTrend" ||
    /流年|今年|明年|后年|(?:19|20)\d{2}年?/.test(
      text,
    )
  ) {
    return "singleYear";
  }

  if (
    CURRENT_STAGE_PATTERN.test(
      text,
    )
  ) {
    return "currentStage";
  }

  return "natal";
}

export function getDomainLabels(
  keys = [],
) {
  const map =
    new Map(
      DOMAIN_RULES.map(
        (rule) => [
          rule.key,
          rule.label,
        ],
      ),
    );

  return (
    Array.isArray(
      keys,
    )
      ? keys
      : []
  ).map(
    (key) =>
      map.get(
        key,
      ) ??
      key,
  );
}

function normalizeYears(
  items,
) {
  return [
    ...new Set(
      (
        Array.isArray(
          items,
        )
          ? items
          : []
      )
        .map(Number)
        .filter(
          (year) =>
            Number.isFinite(
              year,
            ) &&
            year >=
              1900 &&
            year <=
              2100,
        ),
    ),
  ].sort(
    (
      left,
      right,
    ) =>
      left -
      right,
  );
}

function finiteOrNull(
  value,
) {
  const number =
    Number(
      value,
    );

  return Number.isFinite(
    number,
  )
    ? number
    : null;
}
