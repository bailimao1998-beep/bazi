import { renderAiText } from "./aiTextRenderer.js";

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
const yinYangMap = {
  甲: "阳", 丙: "阳", 戊: "阳", 庚: "阳", 壬: "阳",
  乙: "阴", 丁: "阴", 己: "阴", 辛: "阴", 癸: "阴",
};

export function renderFortuneTransitPanel(root, payload = {}) {
  if (!root) return;
  const { state } = payload ?? {};
  if (!state?.baseBaziViewModel) {
    root.innerHTML = `
      <div class="plugin-header">
        <h2>大运流年盘面</h2>
      </div>
      <p class="muted">等待基础排盘后生成大运、流年与流月盘面。</p>
    `;
    return;
  }

  const luckItems = state.luckImageReport?.luckItems ?? [];
  const currentLuck = luckItems.find((item) => item.isCurrent) ?? luckItems[0] ?? {};
  const yearItem = state.yearImageReport?.yearItem ?? {};
  const monthItem = state.monthImageReport?.monthItem ?? {};
  const selectedYear = Number(yearItem.year ?? state.input?.targetYear);
  const selectedMonth = Number(monthItem.month ?? state.input?.selectedMonth ?? 1);
  const monthReports = normalizeMonthReports(state.monthImageReports, state.monthImageReport);

  root.innerHTML = `
    <section class="fortune-dashboard">
      <div class="fortune-dashboard-head">
        <div>
          <h2>大运流年盘面</h2>
        </div>
        <span>${escapeHtml(formatLuckStart(state.chart, selectedYear, yearItem))}</span>
      </div>

      <div class="fortune-transit-board">
        <div class="fortune-transit-grid">
          ${renderLuckTransitCard(currentLuck, luckItems)}
          ${renderYearTransitCard(yearItem, currentLuck, selectedYear)}
          ${renderNatalTransitCard(state)}
        </div>
      </div>

      <p class="fortune-start-note">${escapeHtml(formatStartNote(state.chart))}</p>

      ${renderAiLayer({
        currentLuck,
        yearItem,
        luckAiState: payload.luckAiState,
        yearAiState: payload.yearAiState,
        hasLuckReport: Boolean(luckItems.length),
        hasYearReport: Boolean(yearItem.ganZhi),
      })}

      ${renderEvidenceStore(state, currentLuck, yearItem)}

      <section class="month-flow-section">
        <div class="fortune-dashboard-head month-flow-head">
          <div>
            <h3>4. 最后细看流月</h3>
            <p>${escapeHtml(formatYearMonthContext(yearItem, monthItem))}</p>
          </div>
          <span>${escapeHtml(`${selectedYear || "待查"} 年 · 当前 ${formatFlowMonthLabel(monthItem)} ${monthItem.ganZhi ?? ""}`)}</span>
        </div>
        <div class="month-flow-overview">
          <strong>${escapeHtml(`${selectedYear || "待查"} 流年${yearItem.ganZhi || "待查"}`)}</strong>
          <span>${escapeHtml(`${formatFlowMonthLabel(monthItem)} 流月${monthItem.ganZhi || "待查"}`)}</span>
        </div>
        ${renderMonthGrid(monthReports, selectedMonth)}
        ${renderMonthFocusCard(monthItem)}
        ${renderMonthEvidenceStore(state.monthImageReport)}
        ${renderMonthAiStage(monthItem, payload.monthAiState, Boolean(monthItem.ganZhi))}
      </section>
    </section>
  `;

  bindTransitEvents(root, payload);
}

function renderLuckTransitCard(currentLuck = {}, luckItems = []) {
  const index = Math.max(0, luckItems.findIndex((item) => item.index === currentLuck.index || item.ganZhi === currentLuck.ganZhi));
  const previous = luckItems[index - 1];
  const next = luckItems[index + 1];
  return `
    <article class="fortune-transit-card">
      <div class="transit-card-head">
        <div>
          <h4>1. 大运盘</h4>
          <span>${escapeHtml(formatRange(currentLuck.ageRange, currentLuck.yearRange))}</span>
        </div>
        <strong>${escapeHtml(currentLuck.ganZhi || "待查")}</strong>
      </div>
      ${renderTwoPillarMatrix({
        stem: currentLuck.stem,
        branch: currentLuck.branch,
        stemTenGod: currentLuck.tenGod,
        branchTenGod: displayBranchTenGod(currentLuck),
      })}
      ${renderStepper({
        label: "大运切换",
        selectName: "luck",
        options: luckItems.map((item) => ({
          value: firstYearOfRange(item.yearRange),
          label: `${item.ageRange || "年龄待查"}`,
          note: `${item.ageRange || ""} · ${item.yearRange || ""}`,
          active: item.ganZhi === currentLuck.ganZhi,
        })),
        previousValue: previous ? firstYearOfRange(previous.yearRange) : "",
        nextValue: next ? firstYearOfRange(next.yearRange) : "",
      })}
    </article>
  `;
}

function renderYearTransitCard(yearItem = {}, currentLuck = {}, selectedYear) {
  const yearOptions = buildYearOptions(currentLuck, selectedYear);
  return `
    <article class="fortune-transit-card">
      <div class="transit-card-head">
        <div>
          <h4>2. 流年盘</h4>
          <span>${escapeHtml(`${yearItem.year ?? selectedYear ?? "待查"} · 所在大运 ${currentLuck.ganZhi || "待查"}`)}</span>
        </div>
        <strong>${escapeHtml(yearItem.ganZhi || "待查")}</strong>
      </div>
      ${renderTwoPillarMatrix({
        stem: yearItem.stem,
        branch: yearItem.branch,
        stemTenGod: yearItem.stemTenGod,
        branchTenGod: yearItem.branchTenGod,
      })}
      ${renderStepper({
        label: "流年切换",
        selectName: "year",
        options: yearOptions,
        previousValue: Number.isFinite(Number(selectedYear)) ? Number(selectedYear) - 1 : "",
        nextValue: Number.isFinite(Number(selectedYear)) ? Number(selectedYear) + 1 : "",
      })}
    </article>
  `;
}

function renderNatalTransitCard(state = {}) {
  const pillars = state.baseBaziViewModel?.pillars ?? [];
  const dayPillar = pillars.find((item) => item.key === "day") ?? {};
  const currentLuck = state.luckImageReport?.luckItems?.find((item) => item.isCurrent) ?? state.luckImageReport?.luckItems?.[0] ?? {};
  return `
    <article class="fortune-transit-card natal-transit-card">
      <div class="transit-card-head">
        <div>
          <h4>3. 原局参照盘</h4>
          <span>默认只看当前阶段上下文</span>
        </div>
        <strong>${escapeHtml(dayPillar.pillar || `${dayPillar.stem ?? ""}${dayPillar.branch ?? ""}` || "待查")}</strong>
      </div>
      <div class="transit-context-line">
        <span>当前大运 <b>${escapeHtml(currentLuck.ganZhi || "待查")}</b></span>
        <span>目标流年 <b>${escapeHtml(state.yearImageReport?.yearItem?.ganZhi || "待查")}</b></span>
        <span>目标流月 <b>${escapeHtml(state.monthImageReport?.monthItem?.ganZhi || "待查")}</b></span>
      </div>
      <div class="bazi-matrix transit-pillar-matrix natal-transit-matrix">
        <div class="matrix-row matrix-head"><span></span>${pillars.map((item) => `<b>${escapeHtml(item.name)}</b>`).join("")}</div>
        <div class="matrix-row ten-god-row"><span>天干十神</span>${pillars.map((item) => `<em>${escapeHtml(item.stemTenGod || "待查")}</em>`).join("")}</div>
        <div class="matrix-row main-symbol-row"><span>天干</span>${pillars.map((item) => renderSymbol(item.stem, item.stemElement ?? stemElements[item.stem], item.key === "day")).join("")}</div>
        <div class="matrix-row main-symbol-row"><span>地支</span>${pillars.map((item) => renderSymbol(item.branch, item.branchElement ?? branchElements[item.branch])).join("")}</div>
        <div class="matrix-row ten-god-row"><span>地支主气</span>${pillars.map((item) => `<em>${escapeHtml(item.branchMainTenGod || "待查")}</em>`).join("")}</div>
      </div>
    </article>
  `;
}

function renderTwoPillarMatrix({ stem, branch, stemTenGod, branchTenGod } = {}) {
  return `
    <div class="bazi-matrix transit-pillar-matrix">
      <div class="matrix-row matrix-head"><span></span><b>天干</b><b>地支</b></div>
      <div class="matrix-row ten-god-row"><span>十神</span><em>${escapeHtml(stemTenGod || "待查")}</em><em>${escapeHtml(branchTenGod || "待查")}</em></div>
      <div class="matrix-row main-symbol-row"><span>干支</span>${renderSymbol(stem, stemElements[stem])}${renderSymbol(branch, branchElements[branch])}</div>
      <div class="matrix-row ten-god-row"><span>五行</span><em>${escapeHtml(elementLabels[stemElements[stem]] || "待查")}</em><em>${escapeHtml(elementLabels[branchElements[branch]] || "待查")}</em></div>
    </div>
  `;
}

function renderStepper({ label, selectName, options, previousValue, nextValue } = {}) {
  const normalizedOptions = (options ?? []).filter((item) => item.value !== undefined && item.value !== null && item.value !== "");
  return `
    <div class="fortune-stepper">
      <button type="button" class="stepper-button" data-${escapeHtml(selectName)}-step="${escapeHtml(previousValue)}" ${previousValue === "" || previousValue === undefined ? "disabled" : ""}>&lt;</button>
      <label class="stepper-picker">
        <span>${escapeHtml(label)}</span>
        <select data-${escapeHtml(selectName)}-select>
          ${normalizedOptions.map((item) => `<option value="${escapeHtml(item.value)}" ${item.active ? "selected" : ""}>${escapeHtml(item.label)}</option>`).join("")}
        </select>
        <small>${escapeHtml(normalizedOptions.find((item) => item.active)?.note ?? normalizedOptions[0]?.note ?? "待选择")}</small>
      </label>
      <button type="button" class="stepper-button" data-${escapeHtml(selectName)}-step="${escapeHtml(nextValue)}" ${nextValue === "" || nextValue === undefined ? "disabled" : ""}>&gt;</button>
    </div>
  `;
}

function renderAiLayer({ currentLuck, yearItem, luckAiState, yearAiState, hasLuckReport, hasYearReport } = {}) {
  return `
    <section class="fortune-ai-layout">
      <div class="board-title">
        <h3>阶段 AI 分析</h3>
        <span>AI 预先解读只生成目标流年；当前大运同步作为背景</span>
      </div>
      <div class="fortune-ai-stack">
        ${renderAiCard({
          mode: "luck",
          title: "大运 AI 分析",
          meta: currentLuck?.ganZhi,
          button: "生成当前大运 AI 分析",
          state: luckAiState,
          hasReport: hasLuckReport,
        })}
        ${renderAiCard({
          mode: "year",
          title: "流年 AI 分析",
          meta: `${yearItem?.year ?? ""} ${yearItem?.ganZhi ?? ""}`.trim(),
          button: "生成目标流年 AI 分析",
          state: yearAiState,
          hasReport: hasYearReport,
        })}
      </div>
    </section>
  `;
}

function renderMonthAiStage(monthItem = {}, aiState = {}, hasReport = false) {
  return renderAiCard({
    mode: "month",
    title: "流月 AI 分析",
    meta: `${monthItem.month ?? ""}月 ${monthItem.ganZhi ?? ""}`.trim(),
    button: "生成目标流月 AI 分析",
    state: aiState,
    hasReport,
    extraClass: "month-ai-card",
  });
}

function renderAiCard({ mode, title, meta, button, state = {}, hasReport, extraClass = "" } = {}) {
  return `
    <article class="flow-ai-card ${escapeHtml(extraClass)}">
      <div class="board-title">
        <h3>${escapeHtml(title)}</h3>
        <span>${escapeHtml(meta || "待生成")}</span>
      </div>

      <p class="ai-card-hint">AI 只负责把当前取象证据转成可读分析，不参与排盘和取象。</p>

      <button type="button" class="secondary" data-ai-trigger="${escapeHtml(mode)}" ${state.loading || !hasReport ? "disabled" : ""}>
        ${state.loading ? "生成中..." : escapeHtml(button)}
      </button>

      ${state.error ? `<p class="form-error">${escapeHtml(state.error)}</p>` : ""}
      ${state.text ? renderAiText(state.text) : ""}
    </article>
  `;
}

function renderEvidenceStore(state = {}, currentLuck = {}, yearItem = {}) {
  const currentLuckSignals = buildCurrentLuckEvidenceSignals(currentLuck);
  const currentYearSignals = buildCurrentYearEvidenceSignals(yearItem, currentLuck);
  const relationCount = countRelations(currentLuck) + countRelations(yearItem);
  const visibleSignalCount = currentLuckSignals.length + currentYearSignals.length;
  const relationHint = relationCount ? ` · ${relationCount} 个关系触发` : "";

  return `
    <details class="evidence-library fortune-evidence-store">
      <summary>
        <span>3. 大运流年取象证据库</span>
        <b>${escapeHtml(`${visibleSignalCount} 条关键证据${relationHint} · 展开查看完整取象`)}</b>
      </summary>

      <div class="transit-evidence-grid">
        ${renderTransitEvidenceCard({
          title: "当前大运取象",
          marker: currentLuck.ganZhi,
          summary: currentLuck.shortImage || currentLuck.image,
          chips: [
            ["大运", currentLuck.ganZhi],
            ["年龄", currentLuck.ageRange],
            ["年份", currentLuck.yearRange],
            ["天干十神", currentLuck.tenGod],
            ["地支主气", displayBranchTenGod(currentLuck)],
            ["置信度", confidenceLabel(currentLuck.confidence)],
          ],
          structure: currentLuck.structureImage || currentLuck.image,
          reality: currentLuck.reality,
          boundary: currentLuck.boundary,
          relations: [["原局关系触发", currentLuck.relationToNatal]],
          signals: currentLuckSignals,
        })}

        ${renderTransitEvidenceCard({
          title: "目标流年取象",
          marker: `${yearItem.year ?? ""} ${yearItem.ganZhi ?? ""}`.trim(),
          summary: state.yearImageReport?.summary?.overview || yearItem.image,
          chips: [
            ["流年", `${yearItem.year ?? ""} ${yearItem.ganZhi ?? ""}`.trim()],
            ["天干十神", yearItem.stemTenGod],
            ["地支主气", yearItem.branchTenGod],
            ["当前大运", yearItem.currentLuckItem?.ganZhi || currentLuck.ganZhi],
            ["置信度", confidenceLabel(yearItem.confidence)],
          ],
          structure: yearItem.image,
          reality: yearItem.reality,
          boundary: yearItem.boundary,
          relations: [
            ["原局关系触发", yearItem.relationToNatal],
            ["大运关系触发", yearItem.relationToLuck],
          ],
          signals: currentYearSignals,
        })}
      </div>
    </details>
  `;
}

function buildCurrentLuckEvidenceSignals(currentLuck = {}) {
  const relations = Array.isArray(currentLuck.relationToNatal)
    ? currentLuck.relationToNatal
    : [];

  return compact([
    currentLuck.ganZhi ? `当前大运：${currentLuck.ganZhi}` : "",
    currentLuck.ageRange ? `年龄段：${currentLuck.ageRange}` : "",
    currentLuck.yearRange ? `年份段：${currentLuck.yearRange}` : "",
    currentLuck.tenGod ? `天干十神：${currentLuck.tenGod}` : "",
    displayBranchTenGod(currentLuck) ? `地支主气：${displayBranchTenGod(currentLuck)}` : "",
    relations.length
      ? `原局触发：${relations.map(formatRelationEvidence).join("、")}`
      : "原局触发：当前大运暂未命中冲、合、刑、害、破",
  ]);
}

function buildCurrentYearEvidenceSignals(yearItem = {}, currentLuck = {}) {
  const natalRelations = Array.isArray(yearItem.relationToNatal)
    ? yearItem.relationToNatal
    : [];
  const luckRelations = Array.isArray(yearItem.relationToLuck)
    ? yearItem.relationToLuck
    : [];
  const currentLuckLabel = yearItem.currentLuckItem?.ganZhi || currentLuck.ganZhi;

  return compact([
    yearItem.year && yearItem.ganZhi ? `目标流年：${yearItem.year}年${yearItem.ganZhi}` : "",
    yearItem.stemTenGod ? `天干十神：${yearItem.stemTenGod}` : "",
    yearItem.branchTenGod ? `地支主气：${yearItem.branchTenGod}` : "",
    currentLuckLabel ? `当前大运：${currentLuckLabel}` : "",
    natalRelations.length
      ? `原局触发：${natalRelations.map(formatRelationEvidence).join("、")}`
      : "原局触发：暂未命中冲、合、刑、害、破",
    luckRelations.length
      ? `大运触发：${luckRelations.map(formatRelationEvidence).join("、")}`
      : "大运触发：暂未命中冲、合、刑、害、破",
  ]);
}

function buildCurrentMonthEvidenceSignals(monthItem = {}) {
  const natalRelations = Array.isArray(monthItem.relationToNatal)
    ? monthItem.relationToNatal
    : [];
  const luckRelations = Array.isArray(monthItem.relationToLuck)
    ? monthItem.relationToLuck
    : [];
  const yearRelations = Array.isArray(monthItem.relationToYear)
    ? monthItem.relationToYear
    : [];

  return compact([
    monthItem.year && monthItem.month && monthItem.ganZhi
    ? `目标流月：${monthItem.year}年${formatFlowMonthLabel(monthItem)} ${monthItem.ganZhi}`
    : "",
    monthItem.stemTenGod ? `天干十神：${monthItem.stemTenGod}` : "",
    monthItem.branchTenGod ? `地支主气：${monthItem.branchTenGod}` : "",
    monthItem.currentLuckItem?.ganZhi ? `当前大运：${monthItem.currentLuckItem.ganZhi}` : "",
    monthItem.yearItem?.ganZhi ? `当前流年：${monthItem.yearItem.ganZhi}` : "",
    natalRelations.length
      ? `原局触发：${natalRelations.map(formatRelationEvidence).join("、")}`
      : "原局触发：暂未命中冲、合、刑、害、破",
    luckRelations.length
      ? `大运触发：${luckRelations.map(formatRelationEvidence).join("、")}`
      : "大运触发：暂未命中冲、合、刑、害、破",
    yearRelations.length
      ? `流年触发：${yearRelations.map(formatRelationEvidence).join("、")}`
      : "流年触发：暂未命中冲、合、刑、害、破",
  ]);
}

function formatRelationEvidence(relation = {}) {
  const type = relation.type || "触发";
  const target =
    relation.natalPillar ||
    (relation.luckGanZhi ? `当前大运${relation.luckGanZhi}` : "") ||
    (relation.yearGanZhi ? `当前流年${relation.yearGanZhi}` : "") ||
    relation.natalBranch ||
    (relation.luckBranch ? `大运支${relation.luckBranch}` : "") ||
    (relation.yearBranch ? `流年支${relation.yearBranch}` : "") ||
    "";

  return `${type}${target}`;
}

function renderTransitEvidenceCard({
  title,
  marker,
  chips = [],
  summary,
  structure,
  imageText,
  lead,
  reality,
  boundary,
  relations = [],
  signals = [],
} = {}) {
  const structureText = structure || imageText || lead;
  const summaryText = summary || lead || structureText;

  return `
    <article class="transit-image-detail transit-evidence-card">
      <div class="transit-card-compact-head">
        <div>
          <span>取象卡片</span>
          <h4>${escapeHtml(title || "取象")}</h4>
        </div>
        <strong>${escapeHtml(marker || "待查")}</strong>
      </div>

      ${renderDetailChips(chips)}

      ${summaryText ? `<p class="transit-evidence-lead">${escapeHtml(summaryText)}</p>` : ""}

      <div class="transit-evidence-mini-grid">
        ${renderMiniEvidenceBlock("结构取象", structureText)}
        ${renderMiniEvidenceBlock("现实应象", reality)}
        ${renderMiniEvidenceBlock("成立边界", boundary)}
        ${renderMiniRelationBlock("关系触发", relations)}
      </div>

      ${renderSignalPills("关键证据", signals)}
    </article>
  `;
}

function renderMiniEvidenceBlock(title, text) {
  const lines = String(text || "暂无明确描述。")
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

  return `
    <section class="transit-mini-block">
      <h5>${escapeHtml(title)}</h5>
      ${
        lines.length > 1
          ? `<ul>${lines.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ul>`
          : `<p>${escapeHtml(lines[0] || "暂无明确描述。")}</p>`
      }
    </section>
  `;
}

function renderMiniRelationBlock(title, groups = []) {
  const relationTexts = groups
    .filter(([, relations]) => Array.isArray(relations) && relations.length)
    .flatMap(([groupTitle, relations]) => {
      const source = String(groupTitle || "关系触发")
        .replaceAll("关系触发", "")
        .replaceAll("触发", "")
        .trim() || "关系";

      return relations.map((relation) => {
        const label = formatRelationEvidence(relation);
        const effect = relation.effect ? `（${relation.effect}）` : "";
        return `${source}触发：${label}${effect}`;
      });
    })
    .filter(Boolean);

  return `
    <section class="transit-mini-block">
      <h5>${escapeHtml(title)}</h5>
      ${
        relationTexts.length
          ? `<ul>${relationTexts.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
          : `<p>暂未命中冲、合、刑、害、破。</p>`
      }
    </section>
  `;
}

function renderSignalPills(title, signals = []) {
  const visible = compact(signals);

  return `
    <section class="transit-signal-pills">
      <h5>${escapeHtml(title)}</h5>
      <div>
        ${
          visible.length
            ? visible.map((item) => `<span>${escapeHtml(item)}</span>`).join("")
            : `<span>暂无证据条目</span>`
        }
      </div>
    </section>
  `;
}

function shortenText(text, max = 120) {
  const value = String(text ?? "").replace(/\s+/g, " ").trim();
  return value.length > max ? `${value.slice(0, max)}…` : value;
}

function renderMonthEvidenceStore(monthImageReport = {}) {
  const item = monthImageReport?.monthItem ?? {};
  const currentMonthSignals = buildCurrentMonthEvidenceSignals(item);
  const relationCount = countRelations(item);
  const relationHint = relationCount ? ` · ${relationCount} 个关系触发` : "";

  return `
    <details class="evidence-library fortune-evidence-store">
      <summary>
        <span>4.3 流月取象证据库</span>
        <b>${escapeHtml(`${currentMonthSignals.length} 条关键证据${relationHint} · 展开查看完整取象`)}</b>
      </summary>

      <div class="transit-evidence-grid single">
        ${renderTransitEvidenceCard({
          title: "目标流月取象",
          marker: `${item.year ?? ""}年 ${formatFlowMonthLabel(item)} ${item.ganZhi ?? ""}`.trim(),
          chips: [
            ["流月", `${item.year ?? ""}年 ${formatFlowMonthLabel(item)} ${item.ganZhi ?? ""}`.trim()],
            ["天干十神", item.stemTenGod],
            ["地支主气", item.branchTenGod],
            ["当前大运", item.currentLuckItem?.ganZhi],
            ["当前流年", item.yearItem?.ganZhi],
            ["置信度", confidenceLabel(item.confidence)],
          ],
          summary: monthImageReport?.summary?.overview || item.shortImage || item.image,
          structure: item.structureImage || item.image,
          reality: item.reality,
          boundary: item.boundary,
          relations: [
            ["原局关系触发", item.relationToNatal],
            ["大运关系触发", item.relationToLuck],
            ["流年关系触发", item.relationToYear],
          ],
          signals: currentMonthSignals,
        })}
      </div>
    </details>
  `;
}

function renderImageDetail(title, item = {}, options = {}) {
  return `
    <section class="transit-image-detail">
      <div class="board-title"><h4>${escapeHtml(title)}</h4><span>${escapeHtml(item.ganZhi || item.year || "当前")}</span></div>
      ${renderDetailChips(options.chips)}
      ${renderTextBlock(options.imageLabel || "结构取象", options.imageText || item.image || item.structureImage)}
      ${renderTextBlock("现实应象", item.reality)}
      ${renderTextBlock("成立边界", item.boundary)}
      ${renderRelationGroups(options.relations)}
      ${renderSignalList("关键证据", options.signals)}
    </section>
  `;
}

function renderDetailChips(chips = []) {
  const rows = chips.filter(([, value]) => value !== undefined && value !== null && String(value).trim());
  return rows.length
    ? `<div class="transit-detail-chips">${rows.map(([label, value]) => `<span><b>${escapeHtml(label)}</b>${escapeHtml(value)}</span>`).join("")}</div>`
    : "";
}

function renderTextBlock(title, text) {
  return text
    ? `<section class="transit-text-block"><h5>${escapeHtml(title)}</h5><p>${escapeHtml(text)}</p></section>`
    : "";
}

function renderRelationGroups(groups = []) {
  const visible = groups.filter(([, relations]) => Array.isArray(relations) && relations.length);
  return visible.length
    ? visible.map(([title, relations]) => `
      <section class="transit-text-block">
        <h5>${escapeHtml(title)}</h5>
        <ul>${relations.map((relation) => `<li>${escapeHtml(relation.description || `${relation.type || "触发"}：${relation.effect || ""}`)}</li>`).join("")}</ul>
      </section>
    `).join("")
    : `<section class="transit-text-block"><h5>关系触发</h5><p class="muted">暂未命中冲、合、刑、害、破。</p></section>`;
}

function renderSignalList(title, signals = []) {
  const visible = compact(signals);
  return `
    <section class="transit-hit-list">
      <h4>${escapeHtml(title)}</h4>
      ${visible.length ? visible.map((item) => `<p>${escapeHtml(item)}</p>`).join("") : `<p>暂无证据条目。</p>`}
    </section>
  `;
}

function renderMonthFocusCard(monthItem = {}) {
  const relationCount = countRelations(monthItem);
  const relationText = relationCount
    ? `本月命中 ${relationCount} 个关系触发，需要结合原局、大运、流年一起看。`
    : "本月暂未命中明显冲、合、刑、害、破，更多作为月度背景参考。";

  const tenGodLine = [
    monthItem.stemTenGod || "天干十神待查",
    monthItem.branchTenGod || "地支主气待查",
  ].join(" / ");

  return `
    <section class="month-focus-card">
      <div class="transit-card-head">
        <div>
          <h4>当前流月重点</h4>
          <span>${escapeHtml(`${monthItem.year ?? "目标年待查"}年 · ${formatFlowMonthLabel(monthItem)}`)}</span>
        </div>
        <strong>${escapeHtml(monthItem.ganZhi || "待查")}</strong>
      </div>

      <div class="month-focus-grid">
        <article>
          <span>流月主题</span>
          <strong>${escapeHtml(tenGodLine)}</strong>
        </article>
        <article>
          <span>当前大运</span>
          <strong>${escapeHtml(monthItem.currentLuckItem?.ganZhi || "待查")}</strong>
        </article>
        <article>
          <span>当前流年</span>
          <strong>${escapeHtml(monthItem.yearItem?.ganZhi || "待查")}</strong>
        </article>
        <article>
          <span>关系触发</span>
          <strong>${escapeHtml(relationCount ? `${relationCount} 个` : "暂无明显触发")}</strong>
        </article>
      </div>

      <p>${escapeHtml(relationText)}</p>
    </section>
  `;
}

function renderMonthGrid(monthReports = [], selectedMonth) {
  const reports = monthReports.length
    ? monthReports
    : Array.from({ length: 12 }, (_, index) => ({ monthItem: { month: index + 1 } }));

  return `
    <div class="month-board fortune-month-board enhanced-month-board">
      ${reports.map((report) => {
        const item = report.monthItem ?? {};
        const active = Number(item.month) === Number(selectedMonth);
        const relationCount = countRelations(item);
        const triggerLabel = relationCount ? `${relationCount} 个触发` : "无明显触发";
        const tenGodLine = [
          item.stemTenGod || "天干待查",
          item.branchTenGod || "地支待查",
        ].join(" / ");

        return `
          <button type="button" class="flow-chip month enhanced-month-chip${active ? " is-active" : ""}" data-month-select="${escapeHtml(item.month)}">
            <span>${escapeHtml(formatFlowMonthLabel(item))} · ${active ? "当前" : "流月"}</span>
            <strong>${escapeHtml(item.ganZhi || "待查")}</strong>
            <small>${escapeHtml(tenGodLine)}</small>
            <em class="${relationCount ? "has-trigger" : "no-trigger"}">${escapeHtml(triggerLabel)}</em>
          </button>
        `;
      }).join("")}
    </div>
  `;
}

function formatFlowMonthLabel(item = {}) {
  const branch = item.branch ? `${item.branch}月` : "月令待查";
  return `${item.month || "待查"}月/${branch}`;
}

function bindTransitEvents(root, payload = {}) {
  root.querySelectorAll("[data-luck-step]").forEach((button) => {
    button.addEventListener("click", () => payload.onSelectLuckYear?.(Number(button.dataset.luckStep)));
  });
  root.querySelector("[data-luck-select]")?.addEventListener("change", (event) => {
    payload.onSelectLuckYear?.(Number(event.target.value));
  });
  root.querySelectorAll("[data-year-step]").forEach((button) => {
    button.addEventListener("click", () => payload.onSelectYear?.(Number(button.dataset.yearStep)));
  });
  root.querySelector("[data-year-select]")?.addEventListener("change", (event) => {
    payload.onSelectYear?.(Number(event.target.value));
  });
  root.querySelectorAll("[data-month-select]").forEach((button) => {
    button.addEventListener("click", () => payload.onSelectMonth?.(Number(button.dataset.monthSelect)));
  });
  root.querySelectorAll("[data-ai-trigger]").forEach((button) => {
    button.addEventListener("click", () => {
      const mode = button.dataset.aiTrigger;
      if (mode === "luck") payload.onGenerateLuckAi?.();
      if (mode === "year") payload.onGenerateYearAi?.();
      if (mode === "month") payload.onGenerateMonthAi?.();
    });
  });
}

function normalizeMonthReports(monthReports, selectedReport) {
  if (Array.isArray(monthReports) && monthReports.length) return monthReports;
  return selectedReport?.monthItem ? [selectedReport] : [];
}

function buildYearOptions(currentLuck = {}, selectedYear) {
  const [start, end] = parseYearRange(currentLuck.yearRange);
  const first = Number.isFinite(start) ? start : Number(selectedYear) - 5;
  const last = Number.isFinite(end) ? end : Number(selectedYear) + 5;
  const safeFirst = Number.isFinite(first) ? first : new Date().getFullYear() - 5;
  const safeLast = Number.isFinite(last) ? last : safeFirst + 10;
  return Array.from({ length: Math.max(1, safeLast - safeFirst + 1) }, (_, index) => {
    const year = safeFirst + index;
    return {
      value: year,
      label: `${year}`,
      note: currentLuck.ganZhi ? `所在大运 ${currentLuck.ganZhi}` : "所在大运待查",
      active: Number(year) === Number(selectedYear),
    };
  });
}

function renderSymbol(symbol, element, isDayMaster = false) {
  const elementKey = element || "earth";
  const label = `${yinYangMap[symbol] || ""}${elementLabels[elementKey] ?? "五行"}`;
  return `
    <b class="bazi-symbol element-${escapeHtml(elementKey)}${isDayMaster ? " is-day-master" : ""}">
      <strong>${escapeHtml(symbol || "待")}</strong>
      <small>${escapeHtml(label)}</small>
    </b>
  `;
}

function formatLuckStart(chart = {}, selectedYear, yearItem = {}) {
  const direction = chart.luckCycles?.directionLabel || "顺逆待查";
  const startAge = chart.luckCycles?.startAgeText || chart.luckCycles?.startAge || "起运待查";
  const yearLabel = `${selectedYear || yearItem.year || "目标年待查"} ${yearItem.ganZhi || ""}`.trim();
  return `${direction} · ${startAge} · ${yearLabel}`;
}

function formatStartNote(chart = {}) {
  return chart.luckCycles?.startNote
    || chart.luckCycles?.startCalculation?.method
    || "起运按节气边界折算，具体顺逆与起运时间请结合出生信息复核。";
}

function formatYearMonthContext(yearItem = {}, monthItem = {}) {
  return `${yearItem.year || "目标年待查"} 流年${yearItem.ganZhi || "待查"}；${formatFlowMonthLabel(monthItem)} 流月${monthItem.ganZhi || "待查"}`;
}

function formatRange(ageRange, yearRange) {
  return [ageRange, yearRange].filter(Boolean).join(" · ") || "范围待查";
}

function firstYearOfRange(range = "") {
  const [start] = parseYearRange(range);
  return Number.isFinite(start) ? start : "";
}

function parseYearRange(range = "") {
  const [start, end] = String(range).match(/\d{3,4}/g)?.map(Number) ?? [];
  return [start, end];
}

function countRelations(item = {}) {
  return ["relationToNatal", "relationToLuck", "relationToYear"]
    .reduce((total, key) => total + (Array.isArray(item[key]) ? item[key].length : 0), 0);
}

function displayBranchTenGod(item = {}) {
  return item.branchTenGod
    || item.branchMainTenGod
    || String(item.structureImage ?? "").match(/地支主气十神为([^，。；]+)/)?.[1]
    || "";
}

function confidenceLabel(value) {
  return { high: "重点", medium: "可参考", low: "待验证" }[value] ?? value ?? "可参考";
}

function compact(items = []) {
  return [...new Set(items.flat()
    .filter((item) => item !== undefined && item !== null && String(item).trim())
    .map((item) => String(item)))];
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
