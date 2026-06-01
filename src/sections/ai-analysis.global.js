(function () {
  const { escapeHtml } = window.BaziShared;

  const TARGET_SECTIONS = [
    "整体画像",
    "性格与思维",
    "学习资源与事业方向",
    "财富与现实模式",
    "感情人际与合作",
    "优势与短板",
    "需要大运流年验证的地方",
  ];

  function renderAiAnalysis({ state, el }) {
    const aiExplanationInput = buildAiExplanationInput(state);
    state.aiExplanationInput = aiExplanationInput;
    el.offlineAi.innerHTML = `
      <div class="plugin-header">
        <p class="eyebrow">AI 解读</p>
        <h2 id="offline-ai-title">AI 解读报告 <span class="badge muted">待生成</span></h2>
      </div>
      <p class="quick-read-lead">本地只负责取象；AI 解读区负责把 coreSignals 组织成可读报告。当前先生成输入 JSON，不调用模型。</p>
      <div class="ai-mode-row">
        <button type="button" data-ai-mode="brief">生成简版解读</button>
        <button type="button" data-ai-mode="detailed">生成详细解读</button>
        <button type="button" data-ai-mode="live-script">生成直播口播稿</button>
      </div>
      <section class="ai-target-structure">
        <h3>目标结构</h3>
        <div class="tag-row">${TARGET_SECTIONS.map((item) => `<span>${safe(item)}</span>`).join("")}</div>
      </section>
      <details class="ai-input-debug">
        <summary>aiExplanationInput JSON</summary>
        <pre>${safe(JSON.stringify(aiExplanationInput, null, 2))}</pre>
      </details>
    `;
  }

  function buildAiExplanationInput(state) {
    const coreSignals = getCoreSignals(state);
    return {
      source: "coreSignals",
      modes: ["brief", "detailed", "live-script"],
      targetSections: [...TARGET_SECTIONS],
      coreSignals: pickCoreSignals(coreSignals),
    };
  }

  function getCoreSignals(state) {
    if (state.reading?.coreSignals) return state.reading.coreSignals;
    const builder = window.BaziCoreSignals?.buildCoreSignals;
    if (!builder || !state.reading) return {};
    const coreSignals = builder(state.reading, state.datasets ?? {});
    state.reading.coreSignals = coreSignals;
    return coreSignals;
  }

  function pickCoreSignals(coreSignals = {}) {
    return {
      dayMaster: coreSignals.dayMaster,
      monthCommand: coreSignals.monthCommand,
      elementSignals: coreSignals.elementSignals,
      tenGodSignals: coreSignals.tenGodSignals,
      relationSignals: coreSignals.relationSignals,
      palaceSignals: coreSignals.palaceSignals,
      strengthSignals: coreSignals.strengthSignals,
      rootingSignals: coreSignals.rootingSignals,
      topicTags: coreSignals.topicTags,
      transitHooks: coreSignals.transitHooks,
      cautions: coreSignals.cautions,
    };
  }

  function safe(value) {
    return escapeHtml(value ?? "");
  }

  window.BaziSections = window.BaziSections ?? {};
  window.BaziSections.renderAiAnalysis = renderAiAnalysis;
  window.BaziSections.buildAiExplanationInput = buildAiExplanationInput;
})();
