(function () {
  const { categoryLabel, escapeHtml, groupBy, renderSignal } = window.BaziShared;

  function renderOverallJudgement({ state, el }) {
    renderSimpleOverallReading(state, el);
  }

  function renderSimpleOverallReading(state, el) {
    const display = getBasicDisplay(state);
    el.overall.innerHTML = `
      <div class="plugin-header"><p class="eyebrow">命盘速读</p></div>
      <p class="quick-read-lead">这不是断语，而是告诉你读盘顺序：先看日主，再看月令，然后看五行分布、十神关系和干支关系。</p>
      ${renderQuickReadFacts(display)}
      <section class="analysis-block quick-read-section">
        <h3>读盘顺序</h3>
        <div class="quick-read-steps">
          ${renderQuickReadStep("01", "先看日主", getInterpretationText(state, "day_master", "日主看日柱天干，代表命盘里“我”的核心。"))}
          ${renderQuickReadStep("02", "再看月令", getInterpretationText(state, "month_order", "月令看月柱地支，代表出生月份的当令之气，是判断旺衰和整体背景的第一入口。"))}
          ${renderQuickReadStep("03", "五行分布", buildElementReading(display))}
          ${renderQuickReadStep("04", "十神关系", buildTenGodReading(display))}
          ${renderQuickReadStep("05", "干支关系", buildRelationReading(display))}
        </div>
      </section>
      ${renderLearningRuleHits(state)}
      ${renderFieldGuide()}
    `;
  }

  function getBasicDisplay(state) {
    return state.reading?.natal?.basicBaziDisplay ?? {};
  }

  function renderQuickReadFacts(display) {
    const day = display.pillars?.day ?? {};
    const month = display.pillars?.month ?? {};
    const visibleCounts = display.elementStats?.visible?.counts ?? {};
    const strongest = getStrongestElements(visibleCounts);
    const relations = display.relations ?? [];
    return `
      <div class="quick-read-facts">
        ${renderQuickReadFact("日主", formatPillarFact(day.stem, day.stemElementLabel, "待排盘"), "先看日柱天干，它代表命主本人。")}
        ${renderQuickReadFact("月令", formatPillarFact(month.branch, month.branchElementLabel, "待排盘"), "再看月柱地支，它代表出生月份的主气。")}
        ${renderQuickReadFact("明面最明显", strongest.length ? strongest.map(({ key, count }) => `${elementLabel(key)}${count}`).join("、") : "待统计", "按四个天干与四个地支本气统计。")}
        ${renderQuickReadFact("关系命中", relations.length ? `${relations.length} 条` : "暂无", formatRelationTitle(relations[0]))}
      </div>
    `;
  }

  function renderQuickReadFact(label, value, note) {
    return `
      <article class="quick-read-fact">
        <span>${escapeHtml(label)}</span>
        <strong>${escapeHtml(value)}</strong>
        <small>${escapeHtml(note)}</small>
      </article>
    `;
  }

  function renderQuickReadStep(order, title, text) {
    return `
      <article class="quick-read-step">
        <span>${escapeHtml(order)}</span>
        <div>
          <strong>${escapeHtml(title)}</strong>
          <p>${escapeHtml(text)}</p>
        </div>
      </article>
    `;
  }

  function renderLearningRuleHits(state) {
    const hits = state.reading?.natal?.learningRuleHits ?? [];
    if (!hits.length) return "";
    return `
      <section class="analysis-block quick-read-guide">
        <h3>学习型规则命中</h3>
        <div class="field-guide-grid">
          ${hits.slice(0, 4).map(renderLearningRuleCard).join("")}
        </div>
      </section>
    `;
  }

  function renderLearningRuleCard(hit) {
    const uncertainty = (hit.uncertaintyFactors ?? []).join("、") || "资料等级、案例复核、岁运触发";
    return `
      <article>
        <strong>${escapeHtml(hit.title)}</strong>
        <p><b>命中了什么规则</b>：${escapeHtml(hit.trigger ?? hit.category)}</p>
        <p><b>为什么命中</b>：${escapeHtml(hit.whyMatched)}</p>
        <p><b>这条规则怎么学</b>：${escapeHtml(hit.howToLearn ?? hit.plainExplanation)}</p>
        <p><b>不确定因素</b>：${escapeHtml(uncertainty)}</p>
        <p><b>不允许说“一定发生”</b>：${escapeHtml(hit.absoluteWarning ?? "只能作为学习线索。")}</p>
      </article>
    `;
  }

  function getInterpretationText(state, category, fallback) {
    const item = takeByCategory(state.reading?.natal?.basicInterpretations ?? [], category, 1)[0];
    if (!item) return fallback;
    const reason = item.reason ? ` ${item.reason}` : "";
    return `${item.conclusion}${reason}`;
  }

  function buildElementReading(display) {
    const visibleCounts = display.elementStats?.visible?.counts ?? {};
    const hiddenCounts = display.elementStats?.hidden?.counts ?? {};
    const strongest = getStrongestElements(visibleCounts);
    const missing = getMissingElements(visibleCounts);
    const hiddenSummary = formatElementCounts(hiddenCounts);
    const strongestText = strongest.length ? strongest.map(({ key, count }) => `${elementLabel(key)}${count}`).join("、") : "暂无明显偏重";
    const missingText = missing.length ? `；明面缺 ${missing.map(elementLabel).join("、")}` : "";
    const hiddenText = hiddenSummary ? ` 藏干另看：${hiddenSummary}。` : "";
    return `明面最明显：${strongestText}${missingText}。这里的明面五行只看四个天干和四个地支本气，不把完整藏干混在一起。${hiddenText}`;
  }

  function buildTenGodReading(display) {
    const stats = display.tenGods?.stats?.fullHidden ?? {};
    const summary = formatTenGodSummary(stats);
    if (!summary) return "十神把五行生克翻成人事主题；当前未拿到完整藏干十神统计，先回到上方基础盘查看天干、地支主气与藏干十神。";
    return `按完整藏干统计，出现较多的是：${summary}。十神关系用于理解资源、表达、规则、财星和同类力量各自是否明显。`;
  }

  function buildRelationReading(display) {
    const relations = display.relations ?? [];
    if (!relations.length) return "当前基础关系未命中明显组合；这里只展示结构关系，不做吉凶断语。";
    return `当前命中 ${relations.length} 条基础关系：${relations.slice(0, 3).map(formatRelationSummary).join("；")}。这里只展示关系，不输出命理解读。`;
  }

  function renderFieldGuide() {
    const items = [
      ["日主", "代表命主本人，先回答“这张盘以谁为中心”。"],
      ["月令", "代表出生月份气势，先看它是否帮日主、克日主或引出主题。"],
      ["五行", "看能量分布，先分清明面五行和藏干五行两个口径。"],
      ["十神", "把生克关系翻译成人事主题，比如印、财、官、食伤、比劫。"],
      ["干支关系", "只看字与字之间是否合、冲、刑、害、破、三合三会等。"],
    ];
    return `
      <section class="analysis-block quick-read-guide">
        <h3>这些字段怎么看</h3>
        <div class="field-guide-grid">
          ${items.map(([title, text]) => `<article><strong>${escapeHtml(title)}</strong><p>${escapeHtml(text)}</p></article>`).join("")}
        </div>
      </section>
    `;
  }

  function getStrongestElements(counts) {
    const entries = Object.entries(counts).filter(([, count]) => Number(count) > 0);
    const max = Math.max(0, ...entries.map(([, count]) => Number(count)));
    return entries.filter(([, count]) => Number(count) === max).map(([key, count]) => ({ key, count: Number(count) }));
  }

  function getMissingElements(counts) {
    return ["wood", "fire", "earth", "metal", "water"].filter((key) => Number(counts[key] ?? 0) === 0);
  }

  function formatElementCounts(counts) {
    return ["wood", "fire", "earth", "metal", "water"]
      .filter((key) => counts[key] !== undefined)
      .map((key) => `${elementLabel(key)}${Number(counts[key] ?? 0)}`)
      .join("、");
  }

  function elementLabel(key) {
    return { wood: "木", fire: "火", earth: "土", metal: "金", water: "水" }[key] ?? key;
  }

  function formatTenGodSummary(stats) {
    return Object.entries(stats)
      .filter(([, count]) => Number(count) > 0)
      .sort((left, right) => Number(right[1]) - Number(left[1]))
      .slice(0, 4)
      .map(([name, count]) => `${name}${Number(count)}`)
      .join("、");
  }

  function formatPillarFact(char, label, fallback) {
    if (!char && !label) return fallback;
    return [char, label].filter(Boolean).join(" · ");
  }

  function formatRelationTitle(relation) {
    if (!relation) return "只显示命中的基础关系";
    return `${relation.type ?? "关系"}：${(relation.members ?? relation.ganzhi ?? []).join("、")}`;
  }

  function formatRelationSummary(relation) {
    const members = (relation.ganzhi ?? relation.members ?? []).join("、");
    const pillars = (relation.pillars ?? []).join(" 与 ");
    return `${relation.type ?? "关系"}${pillars ? `（${pillars}）` : ""}${members ? `：${members}` : ""}`;
  }

  function renderNatalPlainReading(state) {
    const items = state.reading.natal.basicInterpretations ?? [];
    const natalItems = [
      ...takeByCategory(items, "day_master", 1),
      ...takeByCategory(items, "month_order", 1),
      ...takeByCategory(items, "strength", 1),
      ...takeByCategory(items, "five_elements", 1),
      ...takeByCategory(items, "ten_gods", 1),
    ];
    const fallback = (state.reading.natal.overallAnalysis ?? []).slice(0, 3).map((text, index) => ({
      id: `fallback-natal-${index}`,
      title: index === 0 ? "原局简析" : "结构提示",
      conclusion: text,
      evidence: "来自当前排盘结构。",
    }));
    const visible = natalItems.length ? natalItems : fallback;
    return `
      <section class="analysis-block overall-report-section">
        <h3>基础命盘简析</h3>
        <p class="reading-lead">${escapeHtml(buildNatalLead(visible))}</p>
        <div class="signal-list compact">
          ${visible.map(renderPlainPoint).join("")}
        </div>
      </section>
    `;
  }

  function renderLifeThemeReading(state) {
    const items = state.reading.natal.basicInterpretations ?? [];
    const themeItems = [
      ...takeByCategory(items, "personality", 1),
      ...takeByCategory(items, "career", 1),
      ...takeByCategory(items, "wealth", 1),
      ...takeByCategory(items, "relationship", 1),
    ];
    const domainFallback = (state.reading.judgement?.domains ?? []).slice(0, 4).map((domain) => ({
      id: `domain-${domain.id}`,
      title: domain.label,
      conclusion: domain.sections?.主题判断 ?? "",
      evidence: domain.sections?.触发依据 ?? "",
    }));
    const visible = themeItems.length ? themeItems : domainFallback;
    if (!visible.length) return "";
    return `
      <section class="analysis-block overall-report-section">
        <h3>大致人生主题</h3>
        <p class="reading-lead">这一段只做大方向判断，先看性格底色、事业财运和关系中的反复主题，不把单一规则当成绝对结论。</p>
        <div class="signal-list compact">
          ${visible.map(renderPlainPoint).join("")}
        </div>
      </section>
    `;
  }

  function renderTransitPlainReading(state) {
    const transit = state.reading.judgement?.transit ?? {};
    const sections = [
      transit.majorLuck ? { title: "大运先看十年环境", summary: transit.majorLuck.summary, evidence: transit.majorLuck.evidence } : null,
      transit.annual ? { title: "流年再看年度触发", summary: transit.annual.summary, evidence: transit.annual.evidence } : null,
      transit.monthly?.pillar ? { title: "流月只作时间窗口", summary: transit.monthly.summary, evidence: transit.monthly.evidence } : null,
    ].filter(Boolean);
    const fallbackTriggers = (state.reading.transit?.triggers ?? []).slice(0, 3).map((trigger) => ({
      title: trigger.title,
      summary: trigger.description,
      evidence: [],
    }));
    const visible = sections.length ? sections : fallbackTriggers;
    if (!visible.length) return "";
    return `
      <section class="analysis-block overall-report-section">
        <h3>大运流年判断</h3>
        <p class="reading-lead">先看原局像什么样的人，再看大运和流年把哪个主题推到前面；岁运只是触发条件，不单独定吉凶。</p>
        <div class="signal-list compact">
          ${visible.map(renderTransitPoint).join("")}
        </div>
      </section>
    `;
  }

  function renderPlainPoint(item) {
    return `
      <article class="signal overall-report-card">
        <strong>${escapeHtml(item.title)}</strong>
        <p>${escapeHtml(item.conclusion)}</p>
        ${item.evidence ? `<small>依据：${escapeHtml(item.evidence)}</small>` : ""}
      </article>
    `;
  }

  function renderTransitPoint(item) {
    const evidence = (item.evidence ?? []).slice(0, 2);
    return `
      <article class="signal overall-report-card">
        <strong>${escapeHtml(item.title)}</strong>
        <p>${escapeHtml(item.summary ?? "")}</p>
        ${
          evidence.length
            ? `<small>参考：${evidence.map((hit) => `${hit.title}：${hit.interpretation}`).map(escapeHtml).join("；")}</small>`
            : ""
        }
      </article>
    `;
  }

  function takeByCategory(items, category, limit) {
    return items.filter((item) => item.category === category).sort((left, right) => left.displayOrder - right.displayOrder).slice(0, limit);
  }

  function buildNatalLead(items) {
    const dayMaster = items.find((item) => item.category === "day_master");
    const monthOrder = items.find((item) => item.category === "month_order");
    if (dayMaster && monthOrder) return `${dayMaster.conclusion} ${monthOrder.conclusion}`;
    return "先按日主、月令、五行分布、十神分布和日主旺衰看原局大概性情与结构。";
  }

  function renderBasicInterpretationBoard(state) {
    const items = state.reading.natal.basicInterpretations ?? [];
    if (!items.length) return "";
    return `
      <section class="analysis-block basic-interpretation-section">
        <h3>基础命盘解读</h3>
        <div class="basic-interpretation-list">
          ${items.map(renderBasicInterpretationItem).join("")}
        </div>
      </section>
    `;
  }

  function renderBasicInterpretationItem(item) {
    return `
      <article class="signal basic-interpretation-card">
        <div><strong>${escapeHtml(item.title)}</strong><span class="badge muted">${escapeHtml(item.confidence)}</span></div>
        <p><b>结论：</b>${escapeHtml(item.conclusion)}</p>
        <p><b>命盘依据：</b>${escapeHtml(item.evidence)}</p>
        <p><b>为什么这么看：</b>${escapeHtml(item.reason)}</p>
      </article>
    `;
  }

  function renderJudgementEvidenceBoard(judgement) {
    const grouped = groupBy(judgement.evidence ?? [], "layer");
    const labels = {
      natal: "原局",
      major_luck: "大运",
      annual: "流年",
      monthly: "流月",
    };
    return `
      <details class="analysis-block evidence-section" open>
        <summary><span>证据链</span><b>${judgement.evidence.length} 条</b></summary>
        ${Object.entries(grouped)
          .map(([layer, items]) => `<div class="rule-group"><h4>${labels[layer] ?? layer} <span>${items.length}</span></h4>${items.slice(0, 10).map(renderJudgementEvidence).join("")}</div>`)
          .join("")}
      </details>
    `;
  }

  function renderJudgementEvidence(item) {
    const isActive = item.status === "active";
    return `
      <article class="signal rule-item">
        <div><strong>${escapeHtml(item.title)}</strong><span class="${isActive ? "badge" : "badge muted"}">${isActive ? "已验证" : "候选参考"}</span></div>
        <p>${escapeHtml(item.interpretation)}</p>
        <small>${escapeHtml(layerLabel(item.layer))} · ${escapeHtml(categoryLabel(item.category))} · 证据：${escapeHtml(item.evidenceLevel)}</small>
      </article>
    `;
  }

  function layerLabel(layer) {
    return {
      natal: "原局",
      major_luck: "大运",
      annual: "流年",
      monthly: "流月",
    }[layer] ?? layer;
  }

  function renderPatternBoard(state) {
    const patterns = state.reading.natal.patternCandidates;
    return `
      <details class="analysis-block evidence-section" open>
        <summary><span>格局候选</span><b>${patterns.length} 条</b></summary>
        ${
          patterns.length
            ? patterns.map((pattern) => `<article class="signal"><div><strong>${pattern.name}</strong><span class="badge muted">${pattern.status}</span></div><p>${escapeHtml(pattern.summary ?? pattern.basis ?? "")}</p><small>${escapeHtml((pattern.sourceIds ?? []).join("、"))}</small></article>`).join("")
            : `<article class="signal"><strong>暂未命中明确格局</strong><p>当前只按月令藏干和透干做候选提示，精确取格还需要继续完善。</p></article>`
        }
      </details>
    `;
  }

  function renderEvidenceNavigator(state) {
    const relationRules = state.reading.natal.matchedRules.filter((rule) =>
      ["branch_pair_relation", "branch_group_relation", "branch_hidden_combination", "remote_combination", "arched_combination"].includes(rule.category),
    );
    const strengthRules = state.reading.natal.matchedRules.filter((rule) => rule.category === "element_season_strength");
    const transitRules = state.reading.natal.matchedRules.filter((rule) => rule.category.startsWith("transit_"));
    return `
      <section class="data-board evidence-overview">
        <div class="board-title"><h3>依据命中</h3><span>把底层规则转成可读的命中摘要</span></div>
        <div class="coverage-grid">
          <div><strong>${strengthRules.length}</strong><span>月令强弱</span></div>
          <div><strong>${state.reading.natal.patternCandidates.length}</strong><span>格局候选</span></div>
          <div><strong>${relationRules.length}</strong><span>字与字关系</span></div>
          <div><strong>${transitRules.length}</strong><span>岁运触发</span></div>
          <div><strong>${state.reading.natal.starSignals.length}</strong><span>神煞辅助</span></div>
          <div><strong>${state.reading.natal.referenceKnowledgeHits.length}</strong><span>参考资料</span></div>
        </div>
      </section>
    `;
  }

  function renderReferenceKnowledgeBoard(state) {
    const hits = state.reading.natal.referenceKnowledgeHits;
    return `
      <details class="analysis-block evidence-section" open>
        <summary><span>参考资料命中</span><b>${hits.length} 张自动资料卡</b></summary>
        ${
          hits.length
            ? hits.map(renderReferenceCard).join("")
            : `<article class="signal"><strong>暂无资料卡命中</strong><p>独立参考资料库已加载后，会按天干地支、十神、格局、神煞和关系触发自动匹配。</p></article>`
        }
        <p class="fine-print">这些内容来自 AI OCR 自动提取资料卡，已按你的设置自动参与分析；遇到关键判断仍建议回看页码来源。</p>
      </details>
    `;
  }

  function renderReferenceCard(hit) {
    return `
      <article class="signal reference-card">
        <div><strong>${escapeHtml(hit.title)}</strong><span class="badge muted">${escapeHtml(hit.confidence ?? "auto")}</span></div>
        <p>${escapeHtml(hit.interpretation || hit.summary)}</p>
        <small>命中：${escapeHtml((hit.matchReasons ?? []).join("；") || "资料卡规则")}</small>
        <small>来源：${escapeHtml(formatSourceRefs(hit.sourceRefs))}</small>
        <div class="tag-row">${(hit.tags ?? []).slice(0, 8).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>
      </article>
    `;
  }

  function renderPairInteractionBoard(state) {
    const directCount = state.reading.natal.pairInteractions.filter((pair) => pair.directRelations.length).length;
    return `
      <details class="analysis-block evidence-section">
        <summary><span>字与字关系</span><b>${directCount}/${state.reading.natal.pairInteractions.length} 组直接命中</b></summary>
        <div class="pair-grid">${state.reading.natal.pairInteractions.map(renderPairInteraction).join("")}</div>
      </details>
    `;
  }

  function renderPairInteraction(pair) {
    return `
      <article class="pair-card">
        <h4>${escapeHtml(pair.title)}</h4>
        <p><b>天干：</b>${escapeHtml(pair.stemRelation)}</p>
        ${renderSourceLine(pair.stemRelationSource)}
        <p><b>地支：</b>${escapeHtml(pair.branchRelation)}</p>
        ${renderSourceLine(pair.branchRelationSource)}
        <p><b>十神：</b>${escapeHtml(pair.tenGodRelation)}</p>
        <p>${escapeHtml(pair.impact)}</p>
        ${
          pair.directRelations.length
            ? `<div class="tag-row">${pair.directRelations.map((rule) => `<span>${escapeHtml(rule.title)} · ${escapeHtml(rule.status)}</span>`).join("")}</div>`
            : `<div class="tag-row"><span>数据库未命中直接合冲刑害破，按生克派生</span></div>`
        }
      </article>
    `;
  }

  function renderRuleBoard(title, rules) {
    const visibleCategories = new Set([
      "element_season_strength",
      "twelve_growth_stage",
      "branch_pair_relation",
      "branch_group_relation",
      "transit_branch_to_natal_branch",
      "transit_stem_to_daymaster",
      "branch_hidden_combination",
      "remote_combination",
      "arched_combination",
    ]);
    const filtered = rules.filter((rule) => visibleCategories.has(rule.category));
    const grouped = groupBy(filtered, "category");
    return `
      <details class="analysis-block evidence-section">
        <summary><span>${title}</span><b>${filtered.length}/${rules.length} 条关键规则</b></summary>
        ${
          filtered.length
            ? Object.entries(grouped)
                .map(([category, items]) => `<div class="rule-group"><h4>${categoryLabel(category)} <span>${items.length}</span></h4>${items.slice(0, 12).map(renderRuleItem).join("")}</div>`)
                .join("")
            : `<article class="signal"><strong>暂无关键规则命中</strong><p>底层规则库仍已参与主题分析；这里仅展示对读盘有解释价值的命中。</p></article>`
        }
        <p class="fine-print">已隐藏大量主题模板类规则，避免把底层数据库日志当成报告正文。</p>
      </details>
    `;
  }

  function renderRuleItem(rule) {
    return `
      <article class="signal rule-item">
        <div><strong>${escapeHtml(rule.title)}</strong><span class="${rule.status === "active" ? "badge" : "badge muted"}">${rule.status}</span></div>
        <p>${escapeHtml(rule.interpretation)}</p>
        <small>证据：${escapeHtml(rule.evidenceLevel ?? "")} · 来源：${escapeHtml((rule.sourceIds ?? []).join("、"))}</small>
      </article>
    `;
  }

  function renderSourceLine(source) {
    if (!source) return "";
    const label = source.type === "database" ? "数据库" : source.type === "database_derived" ? "数据库派生" : "内置派生";
    return `<small class="source-line">${label} · ${escapeHtml(source.label ?? "")} · ${escapeHtml(source.evidenceLevel ?? "")} · ${escapeHtml((source.sourceIds ?? []).join("、"))}</small>`;
  }

  function formatSourceRefs(refs = []) {
    return refs
      .map((ref) => {
        const start = ref.pageStart ?? ref.page ?? "";
        const end = ref.pageEnd && ref.pageEnd !== start ? `-${ref.pageEnd}` : "";
        return start ? `${ref.sourceId}:${start}${end}` : ref.sourceId;
      })
      .filter(Boolean)
      .join("、") || "未标页码";
  }

  function renderStarBoard(state) {
    const stars = state.reading.natal.starSignals;
    return `
      <details class="analysis-block evidence-section">
        <summary><span>神煞辅助</span><b>${stars.length} 条</b></summary>
        <div class="tag-row">
          ${stars.length ? stars.map((star) => `<span>${star.name}：${star.branch}（${star.basis}）</span>`).join("") : `<span>暂无命中或未启用神煞规则</span>`}
        </div>
        <p class="fine-print">神煞只作为辅助提示，不直接覆盖五行、十神、格局和岁运判断。</p>
      </details>
    `;
  }

  function renderCoverageBoard(state) {
    return `
      <details class="analysis-block evidence-section">
        <summary><span>依据库覆盖</span><b>${state.reading.natal.datasetCoverage.filter((item) => item.used).length} 类已使用</b></summary>
        <div class="coverage-grid">${state.reading.natal.datasetCoverage.map((item) => `<div><strong>${item.count}</strong><span>${item.label}</span></div>`).join("")}</div>
      </details>
    `;
  }

  window.BaziSections = window.BaziSections ?? {};
  window.BaziSections.renderOverallJudgement = renderOverallJudgement;
})();
