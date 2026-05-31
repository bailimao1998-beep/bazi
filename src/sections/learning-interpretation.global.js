(function () {
  const { escapeHtml } = window.BaziShared;
  const { buildLearningInterpretations } = window.BaziLearningInterpretationEngine;

  const TABS = [
    ["readingOrder", "读盘顺序", ["structure"]],
    ["fiveTen", "五行十神", ["tenGods"]],
    ["relations", "干支关系", ["branchRelations"]],
    ["blind", "盲派候选", ["blindCandidates"]],
    ["usefulGods", "格局用神候选", ["strengthUsefulGods"]],
    ["luckFlow", "大运流年学习点", ["luckFlow"]],
    ["cases", "相似案例", ["cases"]],
  ];

  function renderLearningInterpretation({ state, el }) {
    const result = buildLearningInterpretations(state.reading, state.datasets);
    el.learning.innerHTML = `
      <div class="plugin-header">
        <p class="eyebrow">规则学习</p>
        <h2 id="learning-title">学习解读</h2>
      </div>
      <p class="quick-read-lead">这里只展示命盘触发了哪些学习规则、为什么触发，以及还需要哪些条件继续验证；不能单独作为结论。</p>
      ${renderTabs(result)}
    `;
    bindLearningTabs(el.learning);
  }

  function renderTabs(result) {
    return `
      <section class="core-tabs" data-learning-tabs>
        <div class="core-tab-list" role="tablist" aria-label="学习解读分类">
          ${TABS.map(([id, label], index) => renderTabButton(id, label, index)).join("")}
        </div>
        ${TABS.map(([id, label, groups], index) => renderTabPanel(id, label, collectItems(result.grouped, groups), index)).join("")}
      </section>
    `;
  }

  function renderTabButton(id, label, index) {
    const active = index === 0;
    return `<button type="button" id="learning-tab-${id}" class="core-tab ${active ? "is-active" : ""}" role="tab" aria-selected="${active ? "true" : "false"}" aria-controls="learning-panel-${id}" data-learning-tab="${id}">${safe(label)}</button>`;
  }

  function renderTabPanel(id, label, items, index) {
    const active = index === 0;
    return `
      <div id="learning-panel-${id}" class="core-tab-panel ${active ? "is-active" : ""}" role="tabpanel" aria-labelledby="learning-tab-${id}" aria-hidden="${active ? "false" : "true"}" data-learning-panel="${id}"${active ? "" : " hidden"}>
        <section class="analysis-block">
          <h3>${safe(label)}</h3>
          <div class="signal-list compact">
            ${items.length ? items.map(renderLearningCard).join("") : renderEmptyCard(label)}
          </div>
        </section>
      </div>
    `;
  }

  function renderLearningCard(item) {
    return `
      <article class="signal learning-card">
        <div>
          <strong>${safe(item.title)}</strong>
          <span class="badge ${item.status === "active" ? "" : "muted"}">${safe(formatStatus(item.status))}</span>
        </div>
        <p><b>命中的规则：</b>${safe(item.category)} · ${safe(item.matched ? "已命中" : "候选")}</p>
        <p><b>触发依据：</b>${safe(item.reason)}</p>
        <p><b>学习逻辑：</b>${safe(item.learningLogic)}</p>
        <p><b>白话解释：</b>${safe(item.plainExplanation)}</p>
        <p><b>不确定因素：</b>${safe(formatList(item.uncertaintyFactors))}</p>
        <p><b>参考来源：</b>${safe(formatSourceRefs(item.sourceRefs))}</p>
        <small>置信度：${safe(formatConfidence(item.confidence))} · 状态：${safe(formatStatus(item.status))}</small>
      </article>
    `;
  }

  function renderEmptyCard(label) {
    return `
      <article class="signal">
        <div><strong>${safe(label)}</strong><span class="badge muted">暂无命中</span></div>
        <p>当前分类没有命中的学习卡片，后续可以随着规则和案例库增加继续补充。</p>
        <small>结构已保留，案例匹配可以为空。</small>
      </article>
    `;
  }

  function bindLearningTabs(root) {
    const buttons = root.querySelectorAll("[data-learning-tab]");
    const panels = root.querySelectorAll("[data-learning-panel]");
    buttons.forEach((button) => {
      button.addEventListener("click", () => activateLearningTab(button, buttons, panels));
      button.addEventListener("keydown", (event) => {
        const current = Array.from(buttons).indexOf(button);
        const offset = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
        if (!offset) return;
        event.preventDefault();
        const next = buttons[(current + offset + buttons.length) % buttons.length];
        activateLearningTab(next, buttons, panels);
        next.focus();
      });
    });
  }

  function activateLearningTab(activeButton, buttons, panels) {
    const target = activeButton.dataset.learningTab;
    buttons.forEach((button) => {
      const active = button === activeButton;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-selected", active ? "true" : "false");
    });
    panels.forEach((panel) => {
      const active = panel.dataset.learningPanel === target;
      panel.classList.toggle("is-active", active);
      panel.hidden = !active;
      panel.setAttribute("aria-hidden", active ? "false" : "true");
    });
  }

  function collectItems(grouped, keys) {
    return keys.flatMap((key) => grouped?.[key] ?? []);
  }

  function formatList(value) {
    return Array.isArray(value) && value.length ? value.join("、") : "柱位语境、十神旺衰、岁运是否触发";
  }

  function formatSourceRefs(sourceRefs) {
    const refs = Array.isArray(sourceRefs) ? sourceRefs : [];
    if (!refs.length) return "当前规则或命盘派生";
    return refs.map((ref) => ref.sourceId ?? ref.note ?? ref.title ?? "来源待复核").join("、");
  }

  function formatConfidence(confidence) {
    return { high: "高", medium: "中", low: "低" }[confidence] ?? confidence ?? "低";
  }

  function formatStatus(status) {
    return { active: "已验证", draft: "候选参考" }[status] ?? status ?? "候选参考";
  }

  function safe(value) {
    return escapeHtml(value ?? "");
  }

  window.BaziSections = window.BaziSections ?? {};
  window.BaziSections.renderLearningInterpretation = renderLearningInterpretation;
})();
