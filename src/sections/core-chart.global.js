(function () {
  const { escapeHtml } = window.BaziShared;
  const PILLAR_KEYS = ["year", "month", "day", "hour"];
  const PILLAR_LABELS = { year: "年柱", month: "月柱", day: "日柱", hour: "时柱" };
  const ELEMENT_LABELS = { wood: "木", fire: "火", earth: "土", metal: "金", water: "水" };

  function renderCoreChart({ state, el }) {
    const display = getBasicDisplay(state);
    el.chart.innerHTML = `
      <div class="plugin-header"><p class="eyebrow">核心命盘</p><h2 id="bazi-chart-title">基础排盘展示</h2></div>
      ${renderCorePillarModule(display)}
      ${renderBasicTabs(display)}
    `;
    bindCoreTabs(el.chart);
  }

  function renderCorePillarModule(display) {
    const pillars = display.pillars ?? {};
    return `
      <div class="bazi-matrix">
        <div class="matrix-row matrix-head"><span></span>${PILLAR_KEYS.map((key) => `<b>${safe(pillar(pillars, key).label ?? PILLAR_LABELS[key])}</b>`).join("")}</div>
        <div class="matrix-row ten-god-row"><span>天干十神</span>${PILLAR_KEYS.map((key) => `<em>${safe(pillar(pillars, key).stemTenGod)}</em>`).join("")}</div>
        <div class="matrix-row gan-row main-symbol-row"><span>天干</span>${PILLAR_KEYS.map((key) => renderBaziSymbol(pillar(pillars, key).stem, pillar(pillars, key).stemElement, pillar(pillars, key).stemElementLabel)).join("")}</div>
        <div class="matrix-row zhi-row main-symbol-row"><span>地支</span>${PILLAR_KEYS.map((key) => renderBaziSymbol(pillar(pillars, key).branch, pillar(pillars, key).branchElement, pillar(pillars, key).branchElementLabel)).join("")}</div>
        <div class="matrix-row ten-god-row"><span>地支主气十神</span>${PILLAR_KEYS.map((key) => `<em>${safe(pillar(pillars, key).branchMainTenGod)}</em>`).join("")}</div>
        <div class="matrix-row hidden-row"><span>完整藏干</span>${PILLAR_KEYS.map((key) => `<small>${renderHiddenStemSummary(pillar(pillars, key).hiddenStems)}</small>`).join("")}</div>
        <div class="matrix-row aux-row"><span>纳音</span>${PILLAR_KEYS.map((key) => `<small>${safe(pillar(pillars, key).nayin)}</small>`).join("")}</div>
        <div class="matrix-row aux-row"><span>十二长生</span>${PILLAR_KEYS.map((key) => `<small>${safe(pillar(pillars, key).twelveGrowth)}</small>`).join("")}</div>
      </div>
      <p class="fine-print">${safe(display.twelveGrowth?.note ?? "十二长生按日主天干推算")}</p>
    `;
  }

  function renderBasicTabs(display) {
    const tabs = [
      ["elements", "五行统计", renderElementStatsModule(display)],
      ["hidden", "十神藏干", renderTenGodHiddenModule(display)],
      ["voids", "空亡旬空", renderVoidModule(display)],
      ["relations", "干支关系", renderRelationsModule(display)],
      ["expert", "专家明细", renderExpertModule(display)],
      ["calendar", "历法依据", renderCalendarModule(display)],
    ];
    return `
      <section class="core-tabs" data-core-tabs>
        <div class="core-tab-list" role="tablist" aria-label="核心命盘基础信息">
          ${tabs.map(([id, label], index) => `<button type="button" id="core-tab-${id}" class="core-tab ${index === 0 ? "is-active" : ""}" role="tab" aria-selected="${index === 0 ? "true" : "false"}" aria-controls="core-panel-${id}" data-core-tab="${id}">${safe(label)}</button>`).join("")}
        </div>
        ${tabs.map(([id, , html], index) => `<div id="core-panel-${id}" class="core-tab-panel ${index === 0 ? "is-active" : ""}" role="tabpanel" aria-labelledby="core-tab-${id}" aria-hidden="${index === 0 ? "false" : "true"}" data-core-panel="${id}"${index === 0 ? "" : " hidden"}>${html}</div>`).join("")}
      </section>
    `;
  }

  function renderTenGodHiddenModule(display) {
    const pillars = display.pillars ?? {};
    return `
      <div class="compact-table">
        <div class="compact-row hidden-detail compact-head"><span>柱位</span><span>地支</span><span>完整藏干</span></div>
        ${PILLAR_KEYS.map((key) => {
          const item = pillar(pillars, key);
          return `<div class="compact-row hidden-detail"><span>${safe(item.label ?? PILLAR_LABELS[key])}</span><strong>${safe(item.branch)}</strong><small>${renderHiddenStemDetails(item.hiddenStems)}</small></div>`;
        }).join("")}
      </div>
      ${renderTenGodStats(display.tenGods)}
    `;
  }

  function renderTenGodStats(tenGods = {}) {
    const fullHidden = Object.entries(tenGods.stats?.fullHidden ?? {});
    const mainQi = Object.entries(tenGods.stats?.mainQi ?? {});
    return `
      <div class="stats-two-col">
        <article class="stats-box">
          <span>十神统计</span>
          <strong>${safe(tenGods.notes?.fullHidden ?? "按完整藏干统计")}</strong>
          <div class="stat-chip-row">${renderStatChips(fullHidden)}</div>
        </article>
        <article class="stats-box">
          <span>十神统计</span>
          <strong>${safe(tenGods.notes?.mainQi ?? "按地支主气统计")}</strong>
          <div class="stat-chip-row">${renderStatChips(mainQi)}</div>
        </article>
      </div>
    `;
  }

  function renderElementStatsModule(display) {
    const visible = display.elementStats?.visible ?? {};
    const hidden = display.elementStats?.hidden ?? {};
    return `
      <div class="stats-two-col">
        ${renderElementStatBox(visible)}
        ${renderElementStatBox(hidden)}
      </div>
    `;
  }

  function renderElementStatBox(stat = {}) {
    const counts = stat.counts ?? {};
    const max = Math.max(1, ...Object.values(counts).map((value) => Number(value) || 0));
    return `
      <article class="stats-box">
        <span>${safe(stat.label)}</span>
        <strong>${safe(stat.note)}</strong>
        <div class="element-count-grid">
          ${Object.entries(ELEMENT_LABELS).map(([key, label]) => renderElementCard(key, label, counts[key] ?? 0, max)).join("")}
        </div>
      </article>
    `;
  }

  function renderElementCard(key, label, value, max) {
    const percent = Math.max(8, Math.round((Number(value) || 0) / max * 100));
    return `
      <div class="element-card element-${key}">
        <span>${safe(label)}</span>
        <b>${safe(value)}</b>
        <i class="element-bar"><em style="width:${percent}%"></em></i>
      </div>
    `;
  }

  function renderBaziSymbol(char, element, elementLabel) {
    const elementKey = element || "unknown";
    const polarity = String(elementLabel ?? "").startsWith("阳") ? "yang" : String(elementLabel ?? "").startsWith("阴") ? "yin" : "unknown";
    return `
      <span class="bazi-symbol element-${safe(elementKey, "unknown")} polarity-${safe(polarity, "unknown")}" data-element-label="${safe(elementLabel)}">
        <strong>${safe(char)}</strong>
        <small>${safe(elementLabel)}</small>
      </span>
    `;
  }

  function renderVoidModule(display) {
    const day = display.voids?.day ?? {};
    return `
      <div class="core-tab-grid">
        ${renderFact("日柱空亡", joinText(asArray(day.branches), "、"), `${day.pillar ?? "日柱"}属于${day.xun ?? "待查"}`)}
        ${renderFact("查看完整旬空", "专家明细", "年柱、月柱、日柱、时柱各自旬空放在最后一栏")}
      </div>
    `;
  }

  function renderCalendarModule(display) {
    const calendar = display.calendar ?? {};
    const solar = calendar.trueSolarTime ?? {};
    return `
      <div class="core-tab-grid">
        ${renderFact("输入历法", calendar.inputCalendarType, "用户输入")}
        ${renderFact("原始输入时间", joinText([calendar.originalDate, calendar.originalTime], " "), "不启用真太阳时时保持原始时间")}
        ${renderFact("出生地", calendar.birthplace, "用于经纬度与时区")}
        ${renderFact("经纬度", hasValue(calendar.longitude) ? `${calendar.longitude} / ${calendar.latitude ?? "待接入"}` : "待接入", calendar.timezone)}
        ${renderFact("标准经线", calendar.standardMeridian, "用于经度校正")}
        ${renderFact("真太阳时", solar.enabled ? "启用" : "未启用", solar.applied ? "已应用到排盘时间" : "未参与排盘")}
        ${renderFact("经度校正", `${solar.longitudeCorrectionMinutes ?? 0}分钟`, "按出生地经度")}
        ${renderFact("均时差", solar.equationOfTimeMinutes, "当前算法未应用时显示未计算")}
        ${renderFact("最终排盘时间", joinText([calendar.finalDate, calendar.finalTime], " "), "用于生成四柱")}
        ${renderFact("最终时辰", calendar.finalHourBranch, "按最终排盘时间")}
        ${renderFact("月柱规则", calendar.solarTermRule, calendar.solarTermRange)}
      </div>
    `;
  }

  function renderRelationsModule(display) {
    const relations = asArray(display.relations);
    const grouped = groupBy(relations, (item) => item.type || "其他关系");
    return relations.length ? `
      <div class="relation-groups">
        ${Object.entries(grouped).map(([type, items]) => `
          <section class="relation-group">
            <h3>${safe(type)}</h3>
            <div class="relation-list">
              ${items.map((item) => `
                <article>
                  <span>${safe(joinText(asArray(item.pillars), "、"))}</span>
                  <strong>${safe(joinText(asArray(item.members), "、"))}</strong>
                  <small>${safe(joinText(asArray(item.ganzhi), " / "))}</small>
                </article>
              `).join("")}
            </div>
          </section>
        `).join("")}
      </div>
    ` : `<p class="fine-print">当前命盘未命中已启用的干支关系规则。</p>`;
  }

  function renderExpertModule(display) {
    const pillars = display.pillars ?? {};
    const palace = display.fetalPalaces ?? {};
    return `
      <div class="compact-table">
        <div class="compact-row expert compact-head"><span>柱位</span><span>干支</span><span>纳音</span><span>长生</span><span>旬空</span></div>
        ${PILLAR_KEYS.map((key) => {
          const item = pillar(pillars, key);
          const voidItem = display.voids?.byPillar?.[key] ?? {};
          return `<div class="compact-row expert"><span>${safe(item.label)}</span><strong>${safe(item.ganzhi)}</strong><small>${safe(item.nayin)}</small><small>${safe(item.twelveGrowth)}</small><small>${safe(joinText([voidItem.xun, joinText(asArray(voidItem.branches), "、")], " · "))}</small></div>`;
        }).join("")}
      </div>
      <div class="candidate-grid">
        ${renderPalaceFact("胎元", palace.fetalOrigin)}
        ${renderPalaceFact("命宫", palace.lifePalace)}
        ${renderPalaceFact("身宫", palace.bodyPalace)}
      </div>
      <p class="fine-print">${safe(palace.note ?? "当前为近似算法，仅作基础展示，不参与核心判断。")}</p>
    `;
  }

  function renderPalaceFact(label, palace) {
    return renderFact(label, palace?.label, palace?.method ?? "当前为近似算法，仅作基础展示");
  }

  function renderFact(label, value, note) {
    return `<article class="core-fact"><span>${safe(label)}</span><strong>${safe(value)}</strong><small>${safe(note, "")}</small></article>`;
  }

  function renderHiddenStemSummary(hiddenStems) {
    return renderHiddenStemChips(hiddenStems, false);
  }

  function renderHiddenStemDetails(hiddenStems) {
    return renderHiddenStemChips(hiddenStems, true);
  }

  function renderHiddenStemChips(hiddenStems, showElement) {
    const chips = asArray(hiddenStems).map((item) => {
      const roleClass = item.role === "主气" ? "is-main" : item.role === "中气" ? "is-middle" : "is-extra";
      return `
        <span class="hidden-chip ${roleClass}">
          <b>${safe(item.stem)}</b>
          <em>${safe(item.tenGod)}</em>
          <small>${safe(item.role)}</small>
          ${showElement ? `<i>${safe(item.elementLabel)}</i>` : ""}
        </span>
      `;
    });
    return chips.length ? `<span class="hidden-chip-list">${chips.join("")}</span>` : safe("");
  }

  function renderStatChips(entries) {
    return entries.length ? entries.map(([name, count]) => `<span><b>${safe(name)}</b>${safe(count)}</span>`).join("") : `<span><b>暂无</b>0</span>`;
  }

  function bindCoreTabs(root) {
    const buttons = root.querySelectorAll("[data-core-tab]");
    const panels = root.querySelectorAll("[data-core-panel]");
    buttons.forEach((button) => {
      button.addEventListener("click", () => activateCoreTab(button, buttons, panels));
      button.addEventListener("keydown", (event) => {
        const current = Array.from(buttons).indexOf(button);
        const offset = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
        if (!offset) return;
        event.preventDefault();
        const next = buttons[(current + offset + buttons.length) % buttons.length];
        activateCoreTab(next, buttons, panels);
        next.focus();
      });
    });
  }

  function activateCoreTab(activeButton, buttons, panels) {
    const target = activeButton.dataset.coreTab;
    buttons.forEach((item) => {
      const active = item === activeButton;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-selected", active ? "true" : "false");
    });
    panels.forEach((panel) => {
      const active = panel.dataset.corePanel === target;
      panel.classList.toggle("is-active", active);
      panel.hidden = !active;
      panel.setAttribute("aria-hidden", active ? "false" : "true");
    });
  }

  function getBasicDisplay(state) {
    return state?.reading?.natal?.basicBaziDisplay ?? {};
  }

  function pillar(pillars, key) {
    return pillars?.[key] ?? {};
  }

  function asArray(value) {
    return Array.isArray(value) ? value : [];
  }

  function joinText(values, separator) {
    return values.filter(hasValue).join(separator);
  }

  function hasValue(value) {
    return value !== undefined && value !== null && value !== "";
  }

  function groupBy(items, getKey) {
    return items.reduce((acc, item) => {
      const key = getKey(item);
      acc[key] = acc[key] ?? [];
      acc[key].push(item);
      return acc;
    }, {});
  }

  function safe(value, fallback = "待接入") {
    return escapeHtml(hasValue(value) ? value : fallback);
  }

  window.BaziSections = window.BaziSections ?? {};
  window.BaziSections.renderCoreChart = renderCoreChart;
})();
