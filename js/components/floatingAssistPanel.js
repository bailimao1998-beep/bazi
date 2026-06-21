import { escapeHtml, hasValue, joinParts } from "../utils/html.js";
import {
  getShenshaMeaning,
  inferPillarKey,
} from "../data/shenshaMeaningDatabase.js";

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
  root.__floatingAssistCleanup?.();
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

  root.__floatingAssistCleanup = bindFloatingAssist(root, state);
}

function bindFloatingAssist(root, state) {
  const drawer = root.querySelector("[data-assist-drawer]");
  const body = root.querySelector("[data-assist-body]");
  const title = root.querySelector("[data-assist-title]");
  let activeTabId = "";

  const closeDrawer = () => {
    drawer?.classList.remove("is-open");
    root.querySelectorAll("[data-assist-open]").forEach((button) => button.classList.remove("is-active"));
    activeTabId = "";
    if (drawer) {
      drawer.hidden = true;
      delete drawer.dataset.assistActive;
    }
  };

  const openDrawer = (tabId, button) => {
    const tab = assistTabs.find(([id]) => id === tabId);
    if (title) title.textContent = tab?.[1] || "辅助信息";
    if (body) body.innerHTML = renderAssistContent(tabId, state);
    drawer?.classList.add("is-open");
    if (drawer) {
      drawer.hidden = false;
      drawer.dataset.assistActive = tabId;
    }
    root.querySelectorAll("[data-assist-open]").forEach((item) => item.classList.toggle("is-active", item === button));
    activeTabId = tabId;
  };

  const handleEscape = (event) => {
    if (event.key === "Escape" && drawer && !drawer.hidden) closeDrawer();
  };

  const handleOutsideClick = (event) => {
    if (!drawer || drawer.hidden) return;
    if (root.contains(event.target)) return;
    closeDrawer();
  };

  root.querySelectorAll("[data-assist-open]").forEach((button) => {
    button.addEventListener("click", () => {
      const tabId = button.dataset.assistOpen;
      if (drawer && !drawer.hidden && activeTabId === tabId) {
        closeDrawer();
        return;
      }
      openDrawer(tabId, button);
    });
  });
  root.querySelector("[data-assist-close]")?.addEventListener("click", closeDrawer);
  body?.addEventListener("click", (event) => {
    const target = event.target;
    if (typeof target?.closest !== "function") return;
    const chip = target.closest("[data-shensha-name]");
    const detailClose = target.closest("[data-assist-detail-close]");
    const detailSlot = body.querySelector("[data-assist-detail-slot]");
    if (detailClose) {
      if (detailSlot) detailSlot.innerHTML = "";
      return;
    }
    if (!chip || !detailSlot) return;
    detailSlot.innerHTML = renderShenshaDetail({
      name: chip.dataset.shenshaName,
      pillarName: chip.dataset.pillarName,
      pillarValue: chip.dataset.pillarValue,
      sourceBasis: chip.dataset.shenshaSource,
    });
  });

  if (typeof document !== "undefined") {
    document.addEventListener("keydown", handleEscape);
    document.addEventListener("pointerdown", handleOutsideClick);
  }

  return () => {
    if (typeof document !== "undefined") {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("pointerdown", handleOutsideClick);
    }
  };
}

function renderAssistContent(tabId, state = {}) {
  const viewModel = state.baseBaziViewModel ?? {};
  if (!viewModel.pillars?.length) return `<p class="muted">等待基础排盘后生成辅助信息。</p>`;

  if (tabId === "shensha") return renderShensha(state);
  if (tabId === "nayin") return renderNayin(viewModel);
  if (tabId === "voids") return renderVoids(viewModel);
  if (tabId === "growth") return renderGrowth(viewModel);
  if (tabId === "calendar") return renderCalendar(state);
  if (tabId === "relations") return renderRelations(state);
  return `<p class="muted">请选择辅助信息。</p>`;
}

function renderShensha(state = {}) {
  const viewModel = state.baseBaziViewModel ?? {};
  const natalEntries = (viewModel.pillars ?? []).map((pillar) => ({
    label: pillar.name,
    pillar: pillar.pillar,
    shensha: pillar.shensha,
  }));
  const transitEntries = buildTransitShenshaEntries(state);
  const hasTransitShensha = transitEntries.some((entry) => normalizeShensha(entry.shensha).length);

  return `
    <p class="fine-print">神煞只作辅助，不单独定论；需结合十神、柱位、原局结构与岁运触发复核。</p>
    <div data-assist-detail-slot></div>
    <div class="assist-list">
      <section>
        <h4>原局四柱</h4>
        ${renderShenshaRows(natalEntries)}
      </section>
      <section>
        <h4>当前岁运</h4>
        ${hasTransitShensha
          ? renderShenshaRows(transitEntries)
          : `<p class="muted">当前岁运神煞暂未生成，需后续补充岁运神煞计算。</p>`}
      </section>
    </div>
  `;
}

function renderShenshaRows(entries = []) {
  return entries.map((entry) => `
    <div class="assist-shensha-row">
      <strong>${escapeHtml(entry.label)} ${escapeHtml(entry.pillar || "")}</strong>
      <div class="assist-chip-row">
        ${renderShenshaChips(entry)}
      </div>
    </div>
  `).join("");
}

function renderShenshaChips(entry = {}) {
  const list = normalizeShensha(entry.shensha);
  return list.length
    ? list.map((item) => `
      <button
        type="button"
        class="assist-chip is-clickable"
        data-shensha-name="${escapeHtml(item.name)}"
        data-shensha-source="${escapeHtml(item.sourceBasis || "")}"
        data-pillar-name="${escapeHtml(entry.label)}"
        data-pillar-value="${escapeHtml(entry.pillar || "")}"
      >
        ${escapeHtml(item.name)}
      </button>
    `).join("")
    : `<span class="assist-chip">未列</span>`;
}

function renderShenshaDetail({
  name = "",
  pillarName = "",
  pillarValue = "",
  sourceBasis = "",
} = {}) {
  const pillarKey = inferPillarKey(pillarName);

  const meaning = getShenshaMeaning(
    name,
    pillarKey,
  );

  const aliases = meaning.aliases?.length
    ? meaning.aliases.join("、")
    : "";

  const manifestationList =
    meaning.manifestations?.length
      ? `
        <ul class="shensha-meaning-list">
          ${meaning.manifestations
            .map(
              (text) =>
                `<li>${escapeHtml(text)}</li>`,
            )
            .join("")}
        </ul>
      `
      : `<p>具体表现需要结合原局结构判断。</p>`;

  return `
    <section class="assist-detail-card">
      <div class="assist-detail-head">
        <div>
          <strong>${escapeHtml(
            name || "神煞说明",
          )}</strong>

          ${
            aliases
              ? `<small>又称：${escapeHtml(
                  aliases,
                )}</small>`
              : ""
          }
        </div>

        <button
          type="button"
          data-assist-detail-close
        >
          收起
        </button>
      </div>

      <p>
        <b>所在位置：</b>
        ${escapeHtml(
          joinParts([
            pillarName,
            pillarValue,
          ]) || "待查",
        )}
      </p>

      <section>
        <h4>核心含义</h4>
        <p>${escapeHtml(
          meaning.definition,
        )}</p>
      </section>

      <section>
        <h4>常见表现</h4>
        ${manifestationList}
      </section>

      ${
        meaning.pillarMeaning
          ? `
            <section>
              <h4>落柱含义</h4>
              <p>${escapeHtml(
                meaning.pillarMeaning,
              )}</p>
            </section>
          `
          : ""
      }

      <section>
        <h4>本盘依据</h4>
        <p>
          ${escapeHtml(
            sourceBasis ||
              "按对应神煞规则命中。",
          )}
        </p>
      </section>

      <section>
        <h4>注意事项</h4>
        <p>${escapeHtml(
          meaning.caution,
        )}</p>
      </section>
    </section>
  `;
}

function buildTransitShenshaEntries(state = {}) {
  const currentLuck = state.luckImageReport?.current
    ?? state.luckImageReport?.luckItems?.find((item) => item.isCurrent)
    ?? {};
  const yearItem = state.yearImageReport?.yearItem ?? {};
  const monthItem = state.monthImageReport?.monthItem ?? {};

  return [
    { label: "大运", pillar: currentLuck.ganZhi || currentLuck.label || "", shensha: currentLuck.shensha },
    { label: "流年", pillar: yearItem.ganZhi || yearItem.label || "", shensha: yearItem.shensha },
    { label: "流月", pillar: monthItem.ganZhi || monthItem.label || "", shensha: monthItem.shensha },
  ];
}


function normalizeShensha(items) {
  return (Array.isArray(items) ? items : [])
    .map((item) => (typeof item === "string" ? { name: item } : item))
    .filter((item) => item?.name);
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
  const baseRelations = dedupeRelations(state.baseBaziViewModel?.relations ?? []);
  const currentLuck = state.luckImageReport?.current
    ?? state.luckImageReport?.luckItems?.find((item) => item.isCurrent)
    ?? {};
  const yearItem = state.yearImageReport?.yearItem ?? {};
  const monthItem = state.monthImageReport?.monthItem ?? {};
  const groups = [
    { key: "base", title: "原局关系", tag: "原局", relations: baseRelations },
    { key: "luckNatal", title: "大运触发原局", tag: "大运", relations: dedupeRelations(currentLuck.relationToNatal) },
    { key: "yearNatal", title: "流年触发原局", tag: "流年", relations: dedupeRelations(yearItem.relationToNatal) },
    { key: "yearLuck", title: "流年触发大运", tag: "流年", relations: dedupeRelations(yearItem.relationToLuck) },
    { key: "monthNatal", title: "流月触发原局", tag: "流月", relations: dedupeRelations(monthItem.relationToNatal) },
    { key: "monthLuck", title: "流月触发大运", tag: "流月", relations: dedupeRelations(monthItem.relationToLuck) },
    { key: "monthYear", title: "流月触发流年", tag: "流月", relations: dedupeRelations(monthItem.relationToYear) },
  ];
  const activeGroups = groups.filter((group) => group.relations.length);
  const emptyGroups = groups.filter((group) => !group.relations.length);

  return `
    <section class="assist-relation-panel">
      ${renderRelationSummary(groups)}
      ${renderRelationFocus(activeGroups)}
      <div class="assist-relation-groups">
        ${activeGroups.map(renderRelationGroup).join("")}
      </div>
      ${emptyGroups.length
        ? `<p class="assist-empty-compact">暂无明显触发：${emptyGroups.map((group) => escapeHtml(group.title)).join("、")}</p>`
        : ""}
    </section>
  `;
}

function renderRelationSummary(groups = []) {
  const total = groups.reduce((sum, group) => sum + group.relations.length, 0);
  return `
    <div class="assist-relation-summary">
      <strong>关系总览</strong>
      <div>
        ${groups.map((group) => `
          <span class="${group.relations.length ? "has-hit" : ""}">
            ${escapeHtml(group.title.replace("触发", ""))} ${group.relations.length}
          </span>
        `).join("")}
      </div>
      <p>${total
        ? "以下关系只作结构提示，需结合十神、柱位、喜忌与岁运触发复核。"
        : "暂未命中冲、合、刑、害、破等明显关系。"}</p>
    </div>
  `;
}

function renderRelationFocus(activeGroups = []) {
  if (!activeGroups.length) return "";

  const first = activeGroups[0];
  const tags = unique(first.relations.flatMap((item) => detectRelationTags(relationText(item)))).slice(0, 4);

  return `
    <div class="assist-relation-focus">
      <b>重点提示</b>
      <span>${escapeHtml(first.title)}较明显：${escapeHtml(tags.join("、") || "关系触发")}。先看被触发柱位，再结合喜忌与岁运判断取向。</span>
    </div>
  `;
}

function renderRelationGroup(group = {}) {
  return `
    <section class="assist-relation-group">
      <h4>${escapeHtml(group.title)} <span>${group.relations.length} 条</span></h4>
      <div class="assist-relation-card-list">
        ${group.relations.map((item) => renderRelationCard(item, group)).join("")}
      </div>
    </section>
  `;
}

function renderRelationCard(item = {}, group = {}) {
  const text = relationText(item);
  const tags = detectRelationTags(text);
  return `
    <article class="assist-relation-card">
      <div class="assist-relation-top">
        <strong>${escapeHtml(relationTitle(item, group.title))}</strong>
        <span>${escapeHtml(group.tag || "关系")}</span>
      </div>
      <div class="assist-relation-tags">
        ${tags.map((tag) => `<em>${escapeHtml(tag)}</em>`).join("")}
      </div>
      <p class="assist-relation-text">${escapeHtml(text)}</p>
      <p class="assist-relation-image"><b>取象：</b>${escapeHtml(relationImageByTags(tags))}</p>
    </article>
  `;
}

function normalizeRelationList(relations = []) {
  return Array.isArray(relations) ? relations.filter(Boolean) : [];
}

function relationText(item = {}) {
  return item.description || item.evidence || item.effect || item.type || item.relationType || item.name || "关系触发";
}

function relationKey(item = {}) {
  return [
    item.source || item.sourcePillar || item.natalPillar || "",
    item.target || item.targetPillar || item.luckGanZhi || item.yearGanZhi || "",
    item.type || item.relationType || item.name || "",
    item.description || item.evidence || item.effect || "",
  ].join("|");
}

function dedupeRelations(relations = []) {
  const seen = new Set();
  return normalizeRelationList(relations).filter((item) => {
    const key = relationKey(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function detectRelationTags(text = "") {
  const tags = [];
  const candidates = [
    ["天干五合", "五合"],
    ["地支六合", "六合"],
    ["三合", "三合"],
    ["三会", "三会"],
    ["六冲", "冲"],
    ["相冲", "冲"],
    ["冲", "冲"],
    ["刑", "刑"],
    ["害", "害"],
    ["破", "破"],
    ["合", "合"],
    ["伏吟", "伏吟"],
    ["反吟", "反吟"],
    ["牵连", "牵连"],
    ["合绊", "合绊"],
  ];

  candidates.forEach(([keyword, label]) => {
    if (String(text).includes(keyword) && !tags.includes(label)) tags.push(label);
  });

  return tags.length ? tags : ["关系"];
}

function relationImageByTags(tags = []) {
  const images = {
    合: "合象、牵连、绑定、合作、关系靠近。",
    五合: "天干有合象，容易出现资源牵连、想法靠拢、关系绑定；是否成化需看月令、透干、根气。",
    六合: "地支六合，多见现实层面的牵连、合作、家庭或关系绑定。",
    三合: "三合多看一组力量成局或成势，需结合透干、季节和喜忌复核。",
    三会: "三会多看季节气势聚合，容易放大相关五行主题。",
    冲: "冲主动荡、变化、拉扯、迁移、关系宫被牵动。",
    刑: "刑主压力、规矩、纠缠、暗耗、反复。",
    害: "害主暗中不顺、误会、消耗、不明说的别扭。",
    破: "破主破损、松动、计划变化、关系裂缝。",
    伏吟: "伏吟主重复、停滞、反复验证，同一主题被放大。",
    反吟: "反吟主反复、对冲、变化、翻转。",
    牵连: "牵连说明此关系不孤立，可能带动相关柱位和宫位。",
    合绊: "合绊表示被关系黏住，有合作也有束缚，需要看喜忌。",
  };

  const matched = tags.map((tag) => images[tag]).filter(Boolean);
  return matched[0] || "该关系用于辅助判断，需要结合柱位、十神、原局强弱和岁运触发复核。";
}

function relationTitle(item = {}, fallbackGroup = "") {
  const text = relationText(item);
  if (item.source && item.target) return `${item.source} ↔ ${item.target}`;
  if (item.sourcePillar && item.targetPillar) return `${item.sourcePillar} ↔ ${item.targetPillar}`;
  if (Array.isArray(item.pillars) && item.pillars.length) return item.pillars.join(" ↔ ");
  if (Array.isArray(item.members) && item.members.length) return item.members.join(" ↔ ");
  if (typeof item.members === "string" && item.members.trim()) return item.members;

  const beforeColon = String(text).split("：")[0];
  if (beforeColon && beforeColon.length <= 24) return beforeColon;
  return fallbackGroup || "关系触发";
}

function unique(items = []) {
  return [...new Set(items.filter((item) => item !== undefined && item !== null && String(item).trim()))];
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
