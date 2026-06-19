import { escapeHtml } from "../utils/html.js";

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
      <div class="plugin-header core-panel-header">
        <p class="eyebrow">核心盘面</p>
        <h2>常驻核心盘</h2>
      </div>
      <p class="muted">等待基础排盘。</p>
    `;
    return;
  }

  const viewModel = currentState.baseBaziViewModel;
  const chart = currentState.chart ?? {};
  const currentLuck = currentState.luckImageReport?.luckItems?.find((item) => item.isCurrent)
    ?? currentState.luckImageReport?.luckItems?.[0]
    ?? {};
  const yearItem = currentState.yearImageReport?.yearItem ?? {};
  const monthItem = currentState.monthImageReport?.monthItem ?? {};
  const relations = uniqueBaseRelations(viewModel.relations).slice(0, 6);

  root.innerHTML = `
    <div class="plugin-header core-panel-header">
      <p class="eyebrow">核心盘面</p>
      <h2>常驻核心盘</h2>
    </div>

    <section class="core-card core-bazi-card">
      <div class="core-card-title">
        <h3>四柱主盘</h3>
        <span>日柱高亮</span>
      </div>
      ${renderBaziMatrix(viewModel.pillars, chart)}
    </section>

    <section class="core-card">
      <div class="core-card-title">
        <h3>命局骨架</h3>
        <span>结构速览</span>
      </div>
      ${renderStructureSkeleton(viewModel, chart)}
    </section>

    <section class="core-card">
      <div class="core-card-title">
        <h3>当前岁运摘要</h3>
        <span>${escapeHtml(`${currentState.input?.targetYear ?? "目标年"} · ${currentState.input?.selectedMonth ?? "目标月"}月`)}</span>
      </div>
      ${renderTransitSummary(currentLuck, yearItem, monthItem)}
    </section>

    <section class="core-card">
      <div class="core-card-title">
        <h3>核心关系摘要</h3>
        <span>${escapeHtml(String(relations.length))} 条</span>
      </div>
      ${renderRelationSummary(relations)}
    </section>

    <p class="core-quick-tip">右侧为核心盘面速览，完整神煞、纳音、空亡、历法信息请点右侧浮动辅助。</p>
  `;
}

function renderBaziMatrix(pillars = [], chart = {}) {
  return `
    <div class="core-bazi-matrix">
      <div class="core-bazi-row core-bazi-head"><span></span>${pillars.map((item) => `<b>${escapeHtml(item.name)}</b>`).join("")}</div>
      <div class="core-bazi-row"><span>天干十神</span>${pillars.map((item) => `<em>${escapeHtml(item.stemTenGod || "待查")}</em>`).join("")}</div>
      <div class="core-bazi-row core-symbol-row">
        <span>天干</span>
        ${pillars.map((item) => {
          const raw = chart.pillars?.[item.key] ?? {};
          return renderSymbol(item.stem, raw.stemElement ?? stemElements[item.stem], raw.yinYang, item.key === "day");
        }).join("")}
      </div>
      <div class="core-bazi-row core-symbol-row">
        <span>地支</span>
        ${pillars.map((item) => {
          const raw = chart.pillars?.[item.key] ?? {};
          return renderSymbol(item.branch, raw.branchElement ?? branchElements[item.branch], undefined, item.key === "day");
        }).join("")}
      </div>
      <div class="core-bazi-row"><span>地支主气</span>${pillars.map((item) => `<em>${escapeHtml(item.branchMainTenGod || "待查")}</em>`).join("")}</div>
      <div class="core-bazi-row core-hidden-row"><span>藏干摘要</span>${pillars.map((item) => `<small>${renderHiddenStemSummary(item.hiddenStems)}</small>`).join("")}</div>
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

function renderHiddenStemSummary(stems = []) {
  return stems.length
    ? stems.slice(0, 3).map((item) => `${item.stem}${item.tenGod ? `/${item.tenGod}` : ""}`).join("、")
    : "未列";
}

function renderStructureSkeleton(viewModel = {}, chart = {}) {
  const dayPillar = viewModel.pillars?.find((item) => item.key === "day") ?? {};
  const monthPillar = viewModel.pillars?.find((item) => item.key === "month") ?? {};
  const dayElement = chart.pillars?.day?.stemElement ?? stemElements[dayPillar.stem];
  const monthElement = chart.pillars?.month?.branchElement ?? branchElements[monthPillar.branch];
  return `
    <div class="core-fact-list">
      ${renderFact("日主", `${dayPillar.stem || dayMaster(viewModel) || "待查"}${elementLabels[dayElement] ?? ""}`)}
      ${renderFact("月令", `${monthPillar.branch || "待查"}${elementLabels[monthElement] ?? ""}`)}
      ${renderFact("五行重心", summarizeElementFocus(viewModel))}
      ${renderFact("十神重心", summarizeTenGodFocus(viewModel))}
    </div>
  `;
}

function renderTransitSummary(currentLuck = {}, yearItem = {}, monthItem = {}) {
  const relationSummary = summarizeRelations([
    currentLuck.relationToNatal,
    yearItem.relationToNatal,
    yearItem.relationToLuck,
    monthItem.relationToNatal,
    monthItem.relationToLuck,
    monthItem.relationToYear,
  ].flat());
  return `
    <div class="core-fact-list">
      ${renderFact("当前大运", currentLuck.ganZhi || currentLuck.label || "待查", formatRange(currentLuck.ageRange, currentLuck.yearRange))}
      ${renderFact("目标流年", yearItem.ganZhi || "待查", yearItem.year)}
      ${renderFact("目标流月", monthItem.ganZhi || "待查", `${monthItem.year ?? "目标年"}年${monthItem.month ?? "目标月"}月`)}
      ${renderFact("关键触发", relationSummary)}
    </div>
  `;
}

function renderRelationSummary(relations = []) {
  return relations.length
    ? `<div class="core-relation-list">${relations.map((item) => `<span>${escapeHtml(relationLabel(item))}</span>`).join("")}</div>`
    : `<p class="muted">当前内置规则未列出明显干支关系，继续结合岁运触发复核。</p>`;
}

function renderFact(label, value, note = "") {
  return `
    <article>
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value || "待查")}</strong>
      ${note ? `<small>${escapeHtml(note)}</small>` : ""}
    </article>
  `;
}

function summarizeElementFocus(viewModel = {}) {
  const dominant = viewModel.fiveElements?.dominant ?? [];
  if (dominant.length) {
    return `${dominant.slice(0, 2).map((item) => `${item.label}${item.value}`).join("、")}偏显`;
  }

  const counts = viewModel.fiveElements?.visible?.counts ?? {};
  return summarizeCounts(counts, elementLabels, "五行待复核");
}

function summarizeTenGodFocus(viewModel = {}) {
  const counts = viewModel.tenGods?.visible?.counts
    ?? viewModel.tenGods?.counts
    ?? {};
  return summarizeCounts(counts, {}, "十神待复核");
}

function summarizeCounts(counts = {}, labels = {}, fallback = "待复核") {
  const entries = Object.entries(counts || {})
    .map(([key, value]) => [key, Number(value) || 0])
    .filter(([, value]) => value > 0)
    .sort((left, right) => right[1] - left[1])
    .slice(0, 3);
  return entries.length
    ? entries.map(([key, value]) => `${labels[key] ?? key}${value}`).join("、")
    : fallback;
}

function summarizeRelations(relations = []) {
  const visible = (Array.isArray(relations) ? relations : [])
    .filter(Boolean)
    .map(relationLabel)
    .filter(Boolean);
  return visible.length ? [...new Set(visible)].slice(0, 4).join("、") : "暂无明显关系触发";
}

function relationLabel(relation = {}) {
  const name = relation.type || relation.relationType || relation.name || "关系";
  const members = relation.ganzhi ?? relation.members ?? [];
  const memberText = Array.isArray(members) && members.length ? members.join("/") : "";
  const target = relation.natalPillar || relation.natalBranch || relation.luckGanZhi || relation.yearGanZhi || "";
  return [memberText || target, name].filter(Boolean).join(" ");
}

function uniqueBaseRelations(relations = []) {
  const seen = new Set();
  return (Array.isArray(relations) ? relations : []).filter((relation) => {
    const key = relationLabel(relation);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function dayMaster(viewModel = {}) {
  return viewModel.pillars?.find((item) => item.key === "day")?.stem;
}

function yinYangLabel(value) {
  return { yang: "阳", yin: "阴" }[value] ?? "";
}

function formatRange(ageRange, yearRange) {
  return [ageRange, yearRange].filter(Boolean).join(" / ") || "";
}
