import { escapeHtml, hasValue, joinParts } from "../utils/html.js";

const assistTabs = [
  ["shensha", "神煞"],
  ["nayin", "纳音"],
  ["voids", "空亡"],
  ["growth", "长生"],
  ["calendar", "历法"],
  ["relations", "关系"],
];

export function renderFloatingAssistPanel(root, { state } = {}) {
  if (!root) return;
  const hasChart = Boolean(state?.baseBaziViewModel);
  root.innerHTML = `
    <div class="floating-assist-buttons" aria-label="辅助信息">
      ${assistTabs.map(([id, label]) => `
        <button type="button" data-assist-open="${escapeHtml(id)}" ${hasChart ? "" : "disabled"}>${escapeHtml(label)}</button>
      `).join("")}
    </div>
    <aside class="floating-assist-drawer" data-assist-drawer hidden>
      <div class="floating-assist-head">
        <strong data-assist-title>辅助信息</strong>
        <button type="button" data-assist-close>关闭</button>
      </div>
      <div class="floating-assist-body" data-assist-body>
        <p class="muted">选择一个辅助项查看完整校验信息。</p>
      </div>
    </aside>
  `;

  bindFloatingAssist(root, state);
}

function bindFloatingAssist(root, state) {
  const drawer = root.querySelector("[data-assist-drawer]");
  const body = root.querySelector("[data-assist-body]");
  const title = root.querySelector("[data-assist-title]");
  root.querySelectorAll("[data-assist-open]").forEach((button) => {
    button.addEventListener("click", () => {
      const tabId = button.dataset.assistOpen;
      const tab = assistTabs.find(([id]) => id === tabId);
      if (title) title.textContent = tab?.[1] || "辅助信息";
      if (body) body.innerHTML = renderAssistContent(tabId, state);
      drawer?.classList.add("is-open");
      if (drawer) drawer.hidden = false;
    });
  });
  root.querySelector("[data-assist-close]")?.addEventListener("click", () => {
    drawer?.classList.remove("is-open");
    if (drawer) drawer.hidden = true;
  });
}

function renderAssistContent(tabId, state = {}) {
  const viewModel = state.baseBaziViewModel ?? {};
  if (!viewModel.pillars?.length) return `<p class="muted">等待基础排盘后生成辅助信息。</p>`;

  if (tabId === "shensha") return renderShensha(viewModel);
  if (tabId === "nayin") return renderNayin(viewModel);
  if (tabId === "voids") return renderVoids(viewModel);
  if (tabId === "growth") return renderGrowth(viewModel);
  if (tabId === "calendar") return renderCalendar(state);
  if (tabId === "relations") return renderRelations(state);
  return `<p class="muted">请选择辅助信息。</p>`;
}

function renderShensha(viewModel = {}) {
  return `
    <p class="fine-print">神煞只作辅助，不单独定论；需结合十神、柱位、原局结构与岁运触发复核。</p>
    <div class="assist-list">
      ${(viewModel.pillars ?? []).map((pillar) => `
        <section>
          <h4>${escapeHtml(pillar.name)} ${escapeHtml(pillar.pillar)}</h4>
          <div class="assist-chip-row">
            ${(pillar.shensha ?? []).length
              ? pillar.shensha.map((item) => `<span>${escapeHtml(item.name)}</span>`).join("")
              : `<span>未列</span>`}
          </div>
        </section>
      `).join("")}
    </div>
  `;
}

function renderNayin(viewModel = {}) {
  const auxiliary = viewModel.auxiliary ?? {};
  return `
    <div class="assist-table">
      <div><b>柱位</b><b>纳音</b><b>十二长生</b></div>
      ${(viewModel.pillars ?? []).map((pillar) => `
        <div><span>${escapeHtml(pillar.name)}</span><strong>${escapeHtml(pillar.nayin || "待查")}</strong><span>${escapeHtml(pillar.twelveGrowth || "待查")}</span></div>
      `).join("")}
    </div>
    <div class="assist-fact-grid">
      ${renderFact("胎元", auxiliary.fetalOrigin?.label, auxiliary.fetalOrigin?.meta?.method)}
      ${renderFact("命宫", auxiliary.lifePalace?.label, auxiliary.lifePalace?.meta?.method)}
      ${renderFact("身宫", auxiliary.bodyPalace?.label, auxiliary.bodyPalace?.meta?.method)}
      ${renderFact("胎息", auxiliary.fetalBreath?.label ?? auxiliary.fetalRest?.label ?? auxiliary.fetalBreath)}
    </div>
  `;
}

function renderVoids(viewModel = {}) {
  return `
    <div class="assist-fact-grid">
      ${(viewModel.pillars ?? []).map((pillar) => renderFact(`${pillar.name}旬空`, pillar.voidBranches?.join("、") || "待查", pillar.pillar)).join("")}
    </div>
  `;
}

function renderGrowth(viewModel = {}) {
  return `
    <div class="assist-fact-grid">
      ${(viewModel.pillars ?? []).map((pillar) => renderFact(`${pillar.name}长生`, pillar.twelveGrowth || "待查", `${pillar.pillar} · ${pillar.nayin || "纳音待查"}`)).join("")}
    </div>
  `;
}

function renderCalendar(state = {}) {
  const chart = state.chart ?? {};
  const viewModel = state.baseBaziViewModel ?? {};
  const calendar = chart.calendar ?? {};
  const trueSolar = calendar.trueSolarTime ?? {};
  const location = trueSolar.location ?? {};
  const input = chart.input ?? state.input ?? {};
  const solarTermPillars = viewModel.pillars?.map((item) => `${item.name}${item.pillar}`).join("、");
  const optionalNonTerm = chart.nonSolarTermPillars ?? chart.calendarPillars ?? chart.meta?.nonSolarTermPillars;
  return `
    <div class="assist-fact-grid">
      ${renderFact("公历时间", joinParts([calendar.solarDate ?? input.birthDate, calendar.time ?? input.birthTime]))}
      ${renderFact("农历时间", calendar.lunarDate ?? viewModel.birthInfo?.lunarDate)}
      ${renderFact("真太阳时", trueSolar.enabled ? joinParts([calendar.solarDate, calendar.time]) : "未启用")}
      ${renderFact("出生地经纬度", formatLocation(location))}
      ${renderFact("节气范围", calendar.solarTermRange)}
      ${renderFact("节气四柱", solarTermPillars)}
      ${renderFact("非节气四柱", formatMaybePillars(optionalNonTerm))}
    </div>
  `;
}

function renderRelations(state = {}) {
  const baseRelations = state.baseBaziViewModel?.relations ?? [];
  const currentLuck = state.luckImageReport?.luckItems?.find((item) => item.isCurrent) ?? {};
  const yearItem = state.yearImageReport?.yearItem ?? {};
  const monthItem = state.monthImageReport?.monthItem ?? {};
  const groups = [
    ["原局关系", baseRelations],
    ["大运触发原局", currentLuck.relationToNatal],
    ["流年触发原局", yearItem.relationToNatal],
    ["流年触发大运", yearItem.relationToLuck],
    ["流月触发原局", monthItem.relationToNatal],
    ["流月触发大运", monthItem.relationToLuck],
    ["流月触发流年", monthItem.relationToYear],
  ];
  return `
    <div class="assist-list">
      ${groups.map(([title, relations]) => `
        <section>
          <h4>${escapeHtml(title)}</h4>
          ${renderRelationList(relations)}
        </section>
      `).join("")}
    </div>
  `;
}

function renderRelationList(relations = []) {
  const list = Array.isArray(relations) ? relations : [];
  return list.length
    ? `<ul>${list.map((item) => `<li>${escapeHtml(item.description || item.evidence || item.effect || item.type || "关系触发")}</li>`).join("")}</ul>`
    : `<p class="muted">暂未命中冲、合、刑、害、破等明显关系。</p>`;
}

function renderFact(label, value, note = "") {
  if (!hasValue(value)) return "";
  return `<article><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong>${note ? `<small>${escapeHtml(note)}</small>` : ""}</article>`;
}

function formatLocation(location = {}) {
  const longitude = location.longitude;
  const latitude = location.latitude;
  if (!hasValue(longitude) && !hasValue(latitude)) return "";
  return `${hasValue(longitude) ? `经度${longitude}` : ""}${hasValue(longitude) && hasValue(latitude) ? "，" : ""}${hasValue(latitude) ? `纬度${latitude}` : ""}`;
}

function formatMaybePillars(value) {
  if (!value) return "";
  if (Array.isArray(value)) {
    return value.map((item) => item?.label ?? item?.pillar ?? item).filter(Boolean).join("、");
  }
  if (typeof value === "object") {
    return Object.values(value).map((item) => item?.label ?? item?.pillar ?? item).filter(Boolean).join("、");
  }
  return String(value);
}
