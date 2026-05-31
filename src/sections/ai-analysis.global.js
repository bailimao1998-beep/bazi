(function () {
  const { escapeHtml, renderMarkdownLite } = window.BaziShared;

  function renderAiAnalysis({ state, el }) {
    const result = state.aiResult;
    el.offlineAi.innerHTML = `
      <div class="plugin-header">
        <p class="eyebrow">AI 分析</p>
        <h2 id="offline-ai-title">离线 AI 分析</h2>
      </div>
      <p class="quick-read-lead">离线 AI 是可选功能，本周 Beta 版建议先使用基础排盘、证据链解读和学习卡片。</p>
      <div class="offline-ai-layout">
        <section class="ai-control">
          <label>
            <span>Ollama 模型</span>
            <input type="text" id="aiModelInput" value="${escapeHtml(state.aiModel)}" placeholder="qwen2.5:7b" />
          </label>
          <button id="runOfflineAi" type="button" ${state.aiLoading ? "disabled" : ""}>
            ${state.aiLoading ? "分析中..." : "生成离线分析"}
          </button>
          <p class="fine-print">完全离线：页面只请求本机服务 <code>/api/offline-analysis</code>，由本机 Ollama 生成，不上传出生信息。</p>
          ${
            state.aiError
              ? `<article class="signal"><strong>本地模型未就绪</strong><p>${escapeHtml(state.aiError)}</p><small>先运行：ollama run ${escapeHtml(state.aiModel)}</small></article>`
              : ""
          }
        </section>
        <section class="ai-output">
          ${
            result?.analysis
              ? `<article class="ai-report">${renderMarkdownLite(result.analysis)}</article>`
              : `<article class="signal"><strong>等待生成</strong><p>点击按钮后，会把当前命盘结构、本地规则命中和相似案例送入本机模型。</p></article>`
          }
        </section>
      </div>
    `;
    el.offlineAi.querySelector("#runOfflineAi").addEventListener("click", () => runOfflineAi({ state, el }));
    el.offlineAi.querySelector("#aiModelInput").addEventListener("change", (event) => {
      state.aiModel = event.currentTarget.value.trim() || "qwen2.5:7b";
    });
  }

  async function runOfflineAi({ state, el }) {
    state.aiLoading = true;
    state.aiError = "";
    state.aiResult = null;
    renderAiAnalysis({ state, el });
    try {
      const response = await fetch("/api/offline-analysis", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          model: state.aiModel,
          birth: {
            date: state.date,
            time: state.time,
            gender: state.gender,
            birthplace: state.birthplace,
            trueSolarTime: state.trueSolarTime,
            selectedYear: state.selectedYear,
            selectedMonth: state.selectedMonth,
          },
        }),
      });
      const payload = await response.json();
      state.aiResult = payload;
      if (!payload.ok) state.aiError = payload.error || "本地 AI 服务暂不可用。";
    } catch (error) {
      state.aiError = "无法连接本地离线 AI 服务，请使用 node scripts/local-ai-server.mjs 启动页面。";
    } finally {
      state.aiLoading = false;
      renderAiAnalysis({ state, el });
      window.BaziSections.renderCaseShowcase?.({ state, el });
    }
  }

  window.BaziSections = window.BaziSections ?? {};
  window.BaziSections.renderAiAnalysis = renderAiAnalysis;
})();
