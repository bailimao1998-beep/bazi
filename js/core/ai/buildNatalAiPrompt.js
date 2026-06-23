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

  /*
   * 只发送我们确认可靠的证据层。
   *
   * 不发送：
   * - 十二画像 judgement / summary 文案
   * - 总批 conclusion / 各领域文案
   *
   * 只发送它们的证据路由和选择ID。
   */
  const evidencePack =
    buildTrustedPromptPack(
      sourcePack,
    );

  return {
    system: [
      "你是传统八字原局证据解释与综合分析器。",
      "你不是排盘器，也不是独立规则引擎。",
      "",
      "本地系统已经完成：",
      "1. 四柱排盘；",
      "2. 月令、旺衰、根气、透藏、五行和十神统计；",
      "3. 干支关系与原子事实提取；",
      "4. 专业结构和做功路径识别；",
      "5. confirmed、structurally_supported、conditional、candidate状态裁决。",
      "",
      "你的任务是：",
      "根据证据建立一条统一的原局运行机制，",
      "解释这个人的优势如何形成、代价为何同源、",
      "哪些问题容易反复、这些模式如何影响不同人生主题，",
      "并给出可验证、可执行、带条件边界的分析。",
      "",
      "重要原则：",
      "1. 只写有充分依据的重要结论；证据不足的领域直接省略，不得为了覆盖面而补写。",
      "2. 不得逐条复述输入数据，不得用同一事实重复制造多个结论。",
      "3. 必须选择一个最能统领全盘的核心主线。",
      "4. 其他结构按支撑主题、主要张力和条件结构处理。",
      "5. 不要固定机械书写十二个领域。",
      "6. 对有意义的领域判断为standalone、integrated或brief。",
      "7. 证据充分的重要领域独立分析；同源内容合并；证据弱的领域简短说明或省略。",
      "8. 优势与代价需要说明是否来自同一套结构。",
      "9. 重点分析长期重复机制，不预测具体年份和具体事件。",
      "10. 不得向用户提问，不要求出生地点、职业或现实反馈。",
      "",
      "禁止过度推断：",
      "1. 不得仅因某十神弱或不显，就判断父母疏远、兄弟姐妹数量、婚姻次数、子女体弱或房产得失。",
      "2. 不得把五行机械对应成具体行业，除非证据包明确提供该依据。",
      "3. 不得根据五行类象直接判断具体器官或疾病。",
      "4. 当前只分析出生原局，不得写某大运或流年会解空、发财、结婚、生子或引动某结构。",
      "5. 神煞、驿马、桃花等只有证据包明确提供时才能使用。",
      "",
      "输出数量规则：",
      "1. 核心机制写3至4步。",
      "2. 核心优势写2至3项。",
      "3. 重复模式写2至3项。",
      "4. 人生主题写4至6项，证据不足不补齐。",
      "5. 条件结构最多3项。",
      "6. 现实验证点固定写3项。",
      "7. 行动建议固定写3项。",
      "8. 每个主题的有利表现和压力限制各不超过2条。",
      "",
      "字段长度规则：",
      "headline不超过36个汉字。",
      "overview.summary不超过240个汉字。",
      "普通解释字段原则上不超过180个汉字。",
      "列表单项原则上不超过80个汉字。",
      "不得用重复、套话和领域填充增加篇幅。",
      "",
      "必须只返回一个合法JSON对象。",
      "不要使用Markdown代码块，不要在JSON外添加任何文字。",
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

        evidencePack,

        outputContract: {
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
              "一句最能概括整盘运行机制的话",

            summary:
              "完整但不重复的核心结论",

            evidenceRefs: [
              "合法证据ID",
            ],
          },

          coreMechanism: {
            title:
              "核心运行机制",

            steps: [
              {
                title:
                  "机制步骤标题",

                content:
                  "说明该力量如何承接到下一步",

                evidenceRefs: [
                  "合法证据ID",
                ],
              },
            ],

            synthesis:
              "将整条因果链合成为完整解释",

            evidenceRefs: [
              "合法证据ID",
            ],
          },

          strengths: [
            {
              title:
                "核心优势",

              explanation:
                "优势从何种结构形成",

              cost:
                "同一结构可能带来的代价",

              bestUse:
                "在什么环境下最容易发挥",

              evidenceRefs: [
                "合法证据ID",
              ],
            },
          ],

          repeatingPatterns: [
            {
              title:
                "容易反复出现的循环",

              trigger:
                "循环通常如何开始",

              cycle:
                "行为和现实结果如何往复",

              consequence:
                "长期可能形成什么影响",

              adjustment:
                "如何切断或改善循环",

              evidenceRefs: [
                "合法证据ID",
              ],
            },
          ],

          lifeThemes: [
            {
              key:
                "主题英文键，例如 career_wealth",

              title:
                "用户可读的主题名称",

              treatment:
                "standalone | integrated | brief",

              summary:
                "该主题的核心判断",

              positive: [
                "有利表现",
              ],

              pressure: [
                "压力或限制",
              ],

              connection:
                "与核心机制及其他领域如何关联",

              evidenceRefs: [
                "合法证据ID或领域键",
              ],
            },
          ],

          conditionalInsights: [
            {
              title:
                "条件结构名称",

              status:
                "structurally_supported | conditional | candidate",

              whatSeen:
                "目前已经看到了什么",

              conditions: [
                "什么条件下会加强",
              ],

              counterEvidence: [
                "什么因素会削弱或反证",
              ],

              evidenceRefs: [
                "合法证据ID",
              ],
            },
          ],

          realityChecks: [
            {
              title:
                "现实验证点",

              description:
                "用户可以观察什么长期表现",

              evidenceRefs: [
                "合法证据ID",
              ],
            },
          ],

          actions: [
            {
              title:
                "行动方向",

              action:
                "具体、可执行的做法",

              basis:
                "为什么这条建议对应当前结构",

              evidenceRefs: [
                "合法证据ID",
              ],
            },
          ],

          boundaries: [
            "本报告的确定程度和范围说明",
          ],

          warnings: [
            "仅保留真正需要提示的证据问题",
          ],
        },
      },
      null,
      2,
    ),
  };
}

function buildTrustedPromptPack(
  pack = {},
) {
  const compositions =
    Array.isArray(
      pack.compositions,
    )
      ? pack.compositions
      : [];

  return {
    version:
      pack.contractVersion ??
      "bazi-deep-analysis-pack-v1",

    scope:
      "natal",

    chart:
      pack.chartSummary ??
      {},

    natalBaseline:
      pack.natalBaseline ??
      pack.dayMasterSummary ??
      {},

    facts:
      Array.isArray(
        pack.facts,
      )
        ? pack.facts
        : [],

    professionalPatterns:
      compositions.filter(
        (item) =>
          item?.sourceLayer ===
          "professional_pattern",
      ),

    structuralCompositions:
      compositions.filter(
        (item) =>
          item?.sourceLayer !==
          "professional_pattern",
      ),

    workChains:
      pack.workChains ??
      {},

    arbitration:
      pack.arbitration ??
      {},

    selectionHints:
      pack.selectionHints ??
      {},

    domainEvidenceMap:
      pack.domainEvidenceMap ??
      {},

    hitListSummary:
      pack.hitListSummary ??
      {},

    allowedFactIds:
      pack.allowedFactIds ??
      [],

    allowedPatternIds:
      pack.allowedPatternIds ??
      pack.professionalPatternIds ??
      [],

    allowedCompositionIds:
      pack.allowedCompositionIds ??
      [],

    allowedDomainKeys:
      pack.allowedDomainKeys ??
      [],

    boundaries:
      pack.boundaries ??
      [],

    warnings:
      pack.warnings ??
      [],
  };
}