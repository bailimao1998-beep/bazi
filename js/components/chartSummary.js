import { bindCoreTabs, renderAuxiliaryObservation } from "./auxiliaryObservation.js";
import { escapeHtml, hasValue, joinParts } from "../utils/html.js";

const elementLabels = { wood: "木", fire: "火", earth: "土", metal: "金", water: "水" };
const stemElements = {
  甲: "wood", 乙: "wood",
  丙: "fire", 丁: "fire",
  戊: "earth", 己: "earth",
  庚: "metal", 辛: "metal",
  壬: "water", 癸: "water",
};
const branchElements = {
  寅: "wood", 卯: "wood",
  巳: "fire", 午: "fire",
  辰: "earth", 戌: "earth", 丑: "earth", 未: "earth",
  申: "metal", 酉: "metal",
  亥: "water", 子: "water",
};

export function renderChartSummary(root, currentState) {
  if (!root) return;
  if (!currentState?.baseBaziViewModel) {
    root.innerHTML = `
      <div class="plugin-header">
        <p class="eyebrow">核心命盘</p>
        <h2>基础排盘展示</h2>
      </div>
      <p class="muted">等待基础排盘。</p>
    `;
    return;
  }

  const viewModel = currentState.baseBaziViewModel;
  const currentLuck = currentState.luckImageReport?.luckItems?.find((item) => item.isCurrent)
    ?? currentState.luckImageReport?.luckItems?.[0];

  root.innerHTML = `
    <div class="plugin-header chart-display-header">
      <p class="eyebrow">核心命盘</p>
      <h2>基础排盘展示</h2>
    </div>
    ${renderChartTopline(viewModel, currentState.chart)}
    ${renderBaziMatrix(viewModel.pillars, currentState.chart)}
    <details class="relation-overview">
      ${(() => {
        const unique = uniqueBaseRelations(viewModel.relations);
        return `<summary><span>干支关系 <b>${escapeHtml(String(unique.length))} 条</b></span><i class="relation-toggle-hint"><em class="is-closed">展开</em><em class="is-open">收起</em></i></summary>
      ${renderRelationList(unique)}`;
      })()}
    </details>
    ${renderAuxiliaryObservation(currentState, currentLuck, { renderBirthInfoStrip })}
  `;
  bindCoreTabs(root);
}

function renderChartTopline(viewModel = {}, chart = {}) {
  const dayPillar = viewModel.pillars?.find((item) => item.key === "day") ?? {};
  const monthPillar = viewModel.pillars?.find((item) => item.key === "month") ?? {};
  const dayElement = chart.pillars?.day?.stemElement ?? stemElements[dayPillar.stem];
  const monthElement = chart.pillars?.month?.branchElement ?? branchElements[monthPillar.branch];
  const visibleCounts = viewModel.fiveElements?.visible?.counts ?? {};
  return `
    <div class="chart-topline">
      <article class="chart-topline-item chart-topline-primary"><span>日主</span><strong>${escapeHtml(dayPillar.stem || dayMaster(viewModel) || "待查")}${escapeHtml(elementLabels[dayElement] ?? "")}</strong></article>
      <article class="chart-topline-item"><span>月令</span><strong>${escapeHtml(monthPillar.branch || "待查")}${escapeHtml(elementLabels[monthElement] ?? "")}</strong></article>
      <article class="chart-topline-item element-mini"><span>五行</span>${renderElementBars(visibleCounts)}</article>
    </div>
  `;
}

function renderBirthInfoStrip(currentState = {}) {
  const chart = currentState.chart ?? {};
  const viewModel = currentState.baseBaziViewModel ?? {};
  const calendar = chart.calendar ?? {};
  const trueSolar = calendar.trueSolarTime ?? {};
  const location = trueSolar.location ?? {};
  const input = chart.input ?? currentState.input ?? {};
  const solarTermPillars = viewModel.pillars?.map((item) => `${item.name}${item.pillar}`).join("、");
  const optionalNonTerm = chart.nonSolarTermPillars ?? chart.calendarPillars ?? chart.meta?.nonSolarTermPillars;
  const facts = [
    ["姓名", viewModel.birthInfo?.name],
    ["性别", genderLabel(input.gender ?? viewModel.birthInfo?.gender)],
    ["出生地", input.birthplace ?? viewModel.birthInfo?.birthplace],
    ["公历时间", joinParts([calendar.solarDate ?? input.birthDate, calendar.time ?? input.birthTime])],
    ["农历时间", calendar.lunarDate ?? viewModel.birthInfo?.lunarDate],
    ["真太阳时", joinParts([calendar.solarDate, calendar.time])],
    ["是否使用真太阳时", trueSolar.enabled ? "是" : "否"],
    ["节气四柱", solarTermPillars],
    ["非节气四柱", formatMaybePillars(optionalNonTerm)],
    ["经度/纬度", formatLocation(location)],
    ["节气范围", calendar.solarTermRange],
  ].filter(([, value]) => hasValue(value));

  return `
    <div class="birth-info-strip">
      ${facts.map(([label, value]) => `<article><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></article>`).join("")}
    </div>
  `;
}

function renderBaziMatrix(pillars = [], chart = {}) {
  return `
    <div class="bazi-matrix chart-summary-matrix">
      <div class="matrix-row matrix-head"><span></span>${pillars.map((item) => `<b>${escapeHtml(item.name)}</b>`).join("")}</div>
      <div class="matrix-row ten-god-row"><span>天干十神</span>${pillars.map((item) => `<em>${escapeHtml(item.stemTenGod || "待查")}</em>`).join("")}</div>
      <div class="matrix-row main-symbol-row">
        <span>天干</span>
        ${pillars.map((item) => {
          const raw = chart.pillars?.[item.key] ?? {};
          return renderSymbol(item.stem, raw.stemElement ?? stemElements[item.stem], raw.yinYang, item.key === "day");
        }).join("")}
      </div>
      <div class="matrix-row main-symbol-row">
        <span>地支</span>
        ${pillars.map((item) => {
          const raw = chart.pillars?.[item.key] ?? {};
          return renderSymbol(item.branch, raw.branchElement ?? branchElements[item.branch]);
        }).join("")}
      </div>
      <div class="matrix-row ten-god-row"><span>地支主气十神</span>${pillars.map((item) => `<em>${escapeHtml(item.branchMainTenGod || "待查")}</em>`).join("")}</div>
      <div class="matrix-row hidden-row">
        <span>完整藏干</span>
        ${pillars.map((item) => `<small>${renderHiddenStemChips(item.hiddenStems)}</small>`).join("")}
      </div>
      <div class="matrix-row shensha-row"><span>神煞</span>${pillars.map((item) => renderPillarShensha(item.shensha)).join("")}</div>
    </div>
  `;
}

function renderSymbol(symbol, element, yinYang, isDayMaster = false) {
  const elementText = `${escapeHtml(yinYangLabel(yinYang))}${escapeHtml(elementLabels[element] ?? "五行")}`;
  return `
    <b class="bazi-symbol element-${escapeHtml(element || "earth")}${isDayMaster ? " is-day-master" : ""}">
      <strong>${escapeHtml(symbol || "待")}</strong>
      <small>${elementText}</small>
    </b>
  `;
}

function renderHiddenStemChips(stems = []) {
  return stems.length
    ? `<span class="hidden-chip-list">${stems.map((item) => `
      <span class="hidden-chip element-${escapeHtml(item.element || "earth")}">
        <b>${escapeHtml(item.stem)}</b>
        <em>${escapeHtml(item.tenGod)}</em>
        <small>${escapeHtml(item.role)}<br>${escapeHtml(item.elementLabel ?? elementLabels[item.element] ?? item.element ?? "五行待查")}</small>
      </span>
    `).join("")}</span>`
    : "未列";
}

function renderPillarShensha(items = []) {
  const visibleItems = (items ?? []).slice(0, 4);
  const more = items.length > visibleItems.length ? `<em>+${escapeHtml(items.length - visibleItems.length)}</em>` : "";
  return `
    <small class="pillar-shensha">
      ${visibleItems.length ? visibleItems.map((item) => `<i>${escapeHtml(item.name)}</i>`).join("") + more : "<i>未列</i>"}
    </small>
  `;
}

function renderElementBars(counts = {}) {
  const max = Math.max(1, ...Object.values(counts).map((value) => Number(value) || 0));
  return `
    <div class="element-bars">
      ${Object.entries(elementLabels).map(([key, label]) => {
        const value = Number(counts[key] || 0);
        const level = `${Math.round((value / max) * 100)}%`;
        return `<i class="topline-element-bar element-${key}" style="--level:${level}"><b>${escapeHtml(label)}</b><em>${escapeHtml(value)}</em></i>`;
      }).join("")}
    </div>
  `;
}

function renderRelationList(relations = []) {
  const unique = uniqueBaseRelations(relations);

  return unique.length
    ? `<div class="relation-compact-list">${unique.map((item) => `
      <details class="relation-compact-item">
        <summary>
          <span class="relation-members">${escapeHtml(relationMembers(item))}</span>
          <span class="relation-main">
            <strong>${escapeHtml(relationName(item))}</strong>
            <em>${escapeHtml(relationEffect(item))}</em>
          </span>
        </summary>
        <p>${escapeHtml(item.evidence || item.description || item.effect || "此关系只作为结构观察点，需结合柱位、旺衰与岁运触发复核。")}</p>
      </details>
    `).join("")}</div>`
    : `<p class="muted relation-empty">当前内置规则未列出明显干支关系，继续结合岁运触发复核。</p>`;
}

function relationMembers(relation = {}) {
  const members = relation.ganzhi ?? relation.members ?? [];
  return Array.isArray(members) && members.length
    ? members.join(" / ")
    : "干支待查";
}

function relationName(relation = {}) {
  return relation.type || relation.relationType || relation.name || "关系";
}

function relationEffect(relation = {}) {
  const effect = relation.effect ?? "";

  if (!effect) return "";

  const name = relationName(relation);
  return String(effect).replace(name, "").trim();
}

function uniqueBaseRelations(relations = []) {
  const seen = new Set();

  return (Array.isArray(relations) ? relations : []).filter((relation) => {
    const displayGanZhi = normalizeDisplayPair(relation.ganzhi ?? relation.members ?? []);
    const relationName = relation.type ?? relation.relationType ?? relation.name ?? "";

    const key = [
      displayGanZhi.join("/"),
      relationName,
    ].join("|");

    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function normalizeDisplayPair(value = []) {
  const list = Array.isArray(value) ? value : [value];

  return list
    .map((item) => String(item ?? "").trim())
    .filter(Boolean)
    .sort();
}

function dayMaster(viewModel = {}) {
  return viewModel.pillars?.find((item) => item.key === "day")?.stem;
}

function genderLabel(value) {
  return { male: "男", female: "女", unknown: "未填" }[value] ?? value ?? "未填";
}

function yinYangLabel(value) {
  return { yang: "阳", yin: "阴" }[value] ?? "";
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
