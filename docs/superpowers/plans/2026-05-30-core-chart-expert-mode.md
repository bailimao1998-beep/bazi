# Core Chart Expert Mode Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild only the 核心命盘 section into a four-pillar main chart with expert tabs for complete but organized BaZi chart data.

**Architecture:** Add a small `reading.natal.coreChart` derived object for UI-safe labels, counts, and candidate strength/useful-god data. Keep the main four-pillar matrix in `src/sections/core-chart.global.js`, then render six tab panels inside the same section without touching other page sections. Use existing datasets and mark approximate or incomplete judgments as candidates.

**Tech Stack:** Plain JavaScript, browser-global render modules, CSS, Node built-in test runner.

---

## File Structure

- Modify `src/lib/readingEngine.js`: add core-chart derived metadata used by the UI.
- Modify `src/lib/readingEngine.global.js`: mirror the same derived metadata for the browser build.
- Modify `src/lib/readingEngine.test.mjs`: cover gender label, zodiac, ten-god counts, and candidate strength/useful-god output.
- Modify `src/sections/core-chart.global.js`: replace the current detail boards with a tabbed expert layout.
- Modify `src/styles.css`: add tab, compact table, stat-chip, and responsive styles for the core chart.

Do not modify `src/sections/transit-luck.global.js`, `src/sections/overall-judgement.global.js`, `src/sections/topic-report.global.js`, `src/sections/case-showcase.global.js`, or AI analysis files.

## Task 1: Engine Core-Chart Metadata

**Files:**
- Modify: `src/lib/readingEngine.js`
- Modify: `src/lib/readingEngine.global.js`
- Test: `src/lib/readingEngine.test.mjs`

- [ ] **Step 1: Add failing tests for core-chart metadata**

Append this test to `src/lib/readingEngine.test.mjs`:

```js
test("returns core chart expert metadata for rendering professional tabs", () => {
  const reading = analyzeBirth({
    date: "1992-08-18",
    time: "14:30",
    gender: "male",
    birthplace: "北京",
    trueSolarTime: false,
    selectedYear: 2026,
    selectedMonth: 5,
  });

  assert.equal(reading.natal.coreChart.genderLabel, "乾造");
  assert.equal(reading.natal.coreChart.zodiac, "猴");
  assert.equal(reading.natal.coreChart.tenGodCounts["偏财"] >= 1, true);
  assert.equal(reading.natal.coreChart.tenGodCounts["七杀"] >= 1, true);
  assert.equal(reading.natal.coreChart.dayMasterStrength.status, "候选");
  assert.match(reading.natal.coreChart.dayMasterStrength.label, /丙火/);
  assert.ok(reading.natal.coreChart.usefulGodCandidates.favorable.length >= 1);
  assert.ok(reading.natal.coreChart.usefulGodCandidates.caution.length >= 1);
  assert.equal(reading.natal.coreChart.calendarPrecision.lunarStatus, "已接入");
  assert.match(reading.natal.coreChart.calendarPrecision.solarTermStatus, /近似/);
});
```

- [ ] **Step 2: Run the red test**

Run:

```bash
node --test src/lib/readingEngine.test.mjs
```

Expected: FAIL with a message that `reading.natal.coreChart` is undefined.

- [ ] **Step 3: Add zodiac and core-chart helpers to `src/lib/readingEngine.js`**

Add this constant near the other branch constants:

```js
const ZODIAC_BY_BRANCH = {
  子: "鼠",
  丑: "牛",
  寅: "虎",
  卯: "兔",
  辰: "龙",
  巳: "蛇",
  午: "马",
  未: "羊",
  申: "猴",
  酉: "鸡",
  戌: "狗",
  亥: "猪",
};
```

Add these helpers after `buildChartMeta(...)`:

```js
function buildCoreChartMeta(input, pillars, elements, tenGods, strengthSignals, chartMeta) {
  const gender = input.gender === "female" ? "female" : "male";
  const dayElement = pillars.day.stemElement;
  const dayStrength = strengthSignals.find((signal) => signal.element === dayElement);
  const elementRanking = Object.entries(elements)
    .map(([element, value]) => ({ element, value: roundScore(value) }))
    .sort((a, b) => b.value - a.value);
  const weakest = [...elementRanking].sort((a, b) => a.value - b.value).slice(0, 2);
  const strongest = elementRanking.slice(0, 2);

  return {
    genderLabel: gender === "female" ? "坤造" : "乾造",
    zodiac: ZODIAC_BY_BRANCH[pillars.year.branch] ?? "待查",
    tenGodCounts: countTenGods(tenGods),
    dayMasterStrength: {
      label: `${pillars.day.stem}${ELEMENT_LABELS[dayElement]}：${dayStrength?.seasonalStatus ?? "待查"}`,
      status: "候选",
      basis: dayStrength?.interpretation ?? "暂按月令旺相休囚死和五行分布生成候选。",
    },
    usefulGodCandidates: {
      favorable: weakest.map((item) => ({
        element: item.element,
        label: ELEMENT_LABELS[item.element],
        reason: `${ELEMENT_LABELS[item.element]}当前分数较低，暂列为平衡候选。`,
      })),
      caution: strongest.map((item) => ({
        element: item.element,
        label: ELEMENT_LABELS[item.element],
        reason: `${ELEMENT_LABELS[item.element]}当前分数较高，暂列为过旺观察项。`,
      })),
      status: "候选",
      note: "喜用忌神这里只做结构候选，未替代人工格局、调候、通关细判。",
    },
    calendarPrecision: {
      lunarStatus: chartMeta.calendar.lunarDate ? "已接入" : "待接入",
      solarTermStatus: chartMeta.calendar.monthNote || "节气换月使用近似边界。",
      trueSolarStatus: chartMeta.calendar.trueSolarTime?.enabled ? "已启用" : "未启用",
    },
  };
}

function countTenGods(tenGods) {
  return tenGods.reduce((acc, signal) => {
    const name = signal.name === "日主" ? "比肩" : signal.name;
    if (!name) return acc;
    acc[name] = (acc[name] ?? 0) + 1;
    return acc;
  }, {});
}
```

- [ ] **Step 4: Attach `coreChart` to the reading output**

In `analyzeBirth(...)`, after `const chartMeta = buildChartMeta(...)`, add:

```js
const coreChart = buildCoreChartMeta(input, pillars, elements, tenGods, strengthSignals, chartMeta);
```

Make sure this line appears after `strengthSignals` is declared. If `strengthSignals` currently appears after `chartMeta`, move the new line to immediately after the existing `const strengthSignals = ...` line.

In the returned `natal` object, add:

```js
coreChart,
```

- [ ] **Step 5: Mirror the same metadata in `src/lib/readingEngine.global.js`**

Apply the exact same constant, helper functions, `const coreChart = ...`, and returned `coreChart` property to the browser-global engine file.

- [ ] **Step 6: Run the metadata test**

Run:

```bash
node --test src/lib/readingEngine.test.mjs
```

Expected: PASS for the new core-chart metadata test and existing tests.

## Task 2: Core Chart Tabbed Rendering

**Files:**
- Modify: `src/sections/core-chart.global.js`

- [ ] **Step 1: Replace `renderCoreChart` with a tab-aware version**

In `src/sections/core-chart.global.js`, update the top destructuring to include `renderEnergyBars` as it already does, then replace `renderCoreChart(...)` with:

```js
function renderCoreChart({ state, el }) {
  el.chart.innerHTML = `
    <div class="plugin-header"><p class="eyebrow">核心命盘</p><h2 id="bazi-chart-title">四柱八字</h2></div>
    ${renderPillarMatrix(state)}
    ${renderCoreTabs(state)}
  `;
  bindCoreTabs(el.chart);
}
```

- [ ] **Step 2: Add the tab shell helpers**

Add these functions after `renderPillarMatrix(...)`:

```js
function renderCoreTabs(state) {
  const tabs = [
    ["overview", "总览", renderOverviewTab(state)],
    ["ten-gods", "十神藏干", renderTenGodHiddenTab(state)],
    ["strength", "旺衰五行", renderStrengthElementTab(state)],
    ["void-stars", "空亡神煞", renderVoidStarsTab(state)],
    ["calendar", "历法依据", renderCalendarEvidenceTab(state)],
    ["expert", "专家明细", renderExpertDetailsTab(state)],
  ];
  return `
    <section class="core-tabs" data-core-tabs>
      <div class="core-tab-list" role="tablist" aria-label="核心命盘专家信息">
        ${tabs.map(([id, label], index) => `<button type="button" class="core-tab ${index === 0 ? "is-active" : ""}" role="tab" aria-selected="${index === 0 ? "true" : "false"}" data-core-tab="${id}">${label}</button>`).join("")}
      </div>
      ${tabs.map(([id, , html], index) => `<div class="core-tab-panel ${index === 0 ? "is-active" : ""}" role="tabpanel" data-core-panel="${id}">${html}</div>`).join("")}
    </section>
  `;
}

function bindCoreTabs(root) {
  const buttons = root.querySelectorAll("[data-core-tab]");
  const panels = root.querySelectorAll("[data-core-panel]");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.coreTab;
      buttons.forEach((item) => {
        const active = item === button;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-selected", active ? "true" : "false");
      });
      panels.forEach((panel) => panel.classList.toggle("is-active", panel.dataset.corePanel === target));
    });
  });
}
```

- [ ] **Step 3: Add tab renderer helpers**

Add these functions after `bindCoreTabs(...)`:

```js
function renderOverviewTab(state) {
  const meta = state.reading.natal.chartMeta;
  const core = state.reading.natal.coreChart;
  const solar = meta.calendar.trueSolarTime ?? {};
  return `
    <div class="core-tab-grid">
      ${renderFact("日主", `${state.reading.natal.dayMaster}${labels.elements[state.reading.natal.pillars.day.stemElement]}`, "十神、旺衰与喜忌中心")}
      ${renderFact("造别", core.genderLabel, "由性别生成")}
      ${renderFact("生肖", core.zodiac, "按年支推得")}
      ${renderFact("公历", `${meta.calendar.originalSolarDate} ${meta.calendar.originalTime}`, "原始输入时间")}
      ${renderFact("出生地", escapeHtml(solar.location?.name ?? state.birthplace), solar.location ? `${solar.location.longitude} / ${solar.location.latitude}` : "经纬度待接入")}
      ${renderFact("真太阳时", core.calendarPrecision.trueSolarStatus, solar.enabled ? `校正${solar.correctionMinutes}分钟` : "未参与排盘")}
      ${renderFact("日空", meta.voidBranches.day.join("、"), "按日柱旬空")}
      ${renderFact("胎元", meta.fetalOrigin.label, meta.fetalOrigin.meta.method)}
      ${renderFact("命宫", meta.lifePalace.label, meta.lifePalace.meta.method)}
      ${renderFact("身宫", meta.bodyPalace.label, meta.bodyPalace.meta.method)}
    </div>
    <p class="fine-print">${escapeHtml(meta.calendar.monthNote || "节气换月提示待接入。")}</p>
  `;
}

function renderTenGodHiddenTab(state) {
  const details = state.reading.natal.pillarDetails;
  const keys = ["year", "month", "day", "hour"];
  const core = state.reading.natal.coreChart;
  return `
    <div class="compact-table">
      <div class="compact-row compact-head"><span>柱位</span><span>天干十神</span><span>地支主气</span><span>藏干明细</span></div>
      ${keys.map((key) => `<div class="compact-row"><span>${details[key].label}</span><strong>${details[key].stemTenGod}</strong><strong>${details[key].branchMainTenGod}</strong><small>${details[key].hiddenStems.map((item) => `${item.stem}${item.tenGod} ${item.role}${item.weight}%`).join(" / ")}</small></div>`).join("")}
    </div>
    <div class="stat-chip-row">
      ${Object.entries(core.tenGodCounts).map(([name, count]) => `<span><b>${escapeHtml(name)}</b>${count}</span>`).join("")}
    </div>
  `;
}

function renderStrengthElementTab(state) {
  const core = state.reading.natal.coreChart;
  return `
    <div class="energy-row">${renderEnergyBars(state.reading.natal.elements)}</div>
    <div class="strength-grid">
      ${state.reading.natal.strengthSignals.map((signal) => `<article><strong>${signal.label}：${signal.seasonalStatus}</strong><p>${escapeHtml(signal.interpretation)}</p></article>`).join("")}
    </div>
    <div class="candidate-grid">
      <article><span>日主旺衰</span><strong>${escapeHtml(core.dayMasterStrength.label)}</strong><small>${escapeHtml(core.dayMasterStrength.status)} · ${escapeHtml(core.dayMasterStrength.basis)}</small></article>
      <article><span>喜用候选</span><strong>${core.usefulGodCandidates.favorable.map((item) => item.label).join("、")}</strong><small>${escapeHtml(core.usefulGodCandidates.note)}</small></article>
      <article><span>忌神观察</span><strong>${core.usefulGodCandidates.caution.map((item) => item.label).join("、")}</strong><small>${escapeHtml(core.usefulGodCandidates.status)}，需结合格局调候复核。</small></article>
    </div>
  `;
}

function renderVoidStarsTab(state) {
  const meta = state.reading.natal.chartMeta;
  const keys = ["year", "month", "day", "hour"];
  const labelsByKey = { year: "年柱", month: "月柱", day: "日柱", hour: "时柱" };
  const stars = state.reading.natal.starSignals;
  return `
    <div class="compact-table">
      <div class="compact-row compact-head"><span>柱位</span><span>空亡</span><span>说明</span></div>
      ${keys.map((key) => `<div class="compact-row three"><span>${labelsByKey[key]}</span><strong>${meta.voidBranches[key].join("、")}</strong><small>按${labelsByKey[key]}所在旬推得</small></div>`).join("")}
    </div>
    <div class="star-list">
      ${stars.length ? stars.map((star) => `<article><strong>${escapeHtml(star.name)}</strong><span>${escapeHtml(star.branch)}</span><small>${escapeHtml(star.basis)}</small></article>`).join("") : `<article><strong>暂无命中</strong><small>当前命盘未命中已启用神煞规则。</small></article>`}
    </div>
  `;
}

function renderCalendarEvidenceTab(state) {
  const meta = state.reading.natal.chartMeta;
  const solar = meta.calendar.trueSolarTime ?? {};
  const location = solar.location ?? {};
  return `
    <div class="core-tab-grid">
      ${renderFact("输入历法", meta.calendar.inputCalendarType === "lunar" ? "农历" : "公历", meta.calendar.lunarDate ?? "农历信息按公历反推")}
      ${renderFact("原始时间", `${meta.calendar.originalSolarDate} ${meta.calendar.originalTime}`, "用户输入")}
      ${renderFact("排盘时间", `${meta.calendar.solarDate} ${meta.calendar.time}`, "真太阳时校正后使用")}
      ${renderFact("出生地", escapeHtml(location.name ?? state.birthplace), location.source ?? "用户输入")}
      ${renderFact("经纬度", location.longitude ? `${location.longitude} / ${location.latitude}` : "待接入", location.timezone ?? "时区待接入")}
      ${renderFact("标准经线", location.standardMeridian ?? "待接入", "用于经度校正")}
      ${renderFact("经度校正", `${solar.longitudeCorrectionMinutes ?? 0}分钟`, "本地平太阳时")}
      ${renderFact("均时差", `${solar.equationOfTimeMinutes ?? 0}分钟`, "近似值")}
      ${renderFact("总校正", `${solar.correctionMinutes ?? 0}分钟`, solar.enabled ? "已应用" : "未应用")}
      ${renderFact("节气换月", "近似", meta.calendar.monthNote || "下一版接入精确节气时刻")}
    </div>
  `;
}

function renderExpertDetailsTab(state) {
  const meta = state.reading.natal.chartMeta;
  const keys = ["year", "month", "day", "hour"];
  const details = state.reading.natal.pillarDetails;
  return `
    <div class="compact-table">
      <div class="compact-row compact-head"><span>柱位</span><span>干支</span><span>纳音</span><span>十二长生</span><span>旬空</span></div>
      ${keys.map((key) => `<div class="compact-row expert"><span>${details[key].label}</span><strong>${details[key].pillar.label}</strong><small>${meta.nayin[key]}</small><small>${meta.twelveStages[key]}</small><small>${meta.voidBranches[key].join("、")}</small></div>`).join("")}
    </div>
    <div class="candidate-grid">
      ${renderFact("胎元取法", meta.fetalOrigin.label, meta.fetalOrigin.meta.method)}
      ${renderFact("命宫取法", meta.lifePalace.label, meta.lifePalace.meta.method)}
      ${renderFact("身宫取法", meta.bodyPalace.label, meta.bodyPalace.meta.method)}
      ${renderFact("后续预留", "小运 / 胎息 / 命卦", "待接入，不参与当前判断")}
    </div>
  `;
}

function renderFact(label, value, note) {
  return `<article class="core-fact"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value ?? "待接入")}</strong><small>${escapeHtml(note ?? "")}</small></article>`;
}
```

- [ ] **Step 4: Remove obsolete board render calls**

Delete the old calls from `renderCoreChart(...)`:

```js
<div class="energy-row">${renderEnergyBars(state.reading.natal.elements)}</div>
${renderChartMetaBoard(state)}
${renderTenGodBoard(state)}
${renderStrengthBoard(state)}
```

Keep the old helper functions only if they are still referenced. If `renderChartMetaBoard`, `renderTenGodBoard`, and `renderStrengthBoard` become unused, delete them from the file.

## Task 3: Core Chart Styles

**Files:**
- Modify: `src/styles.css`

- [ ] **Step 1: Add tab and compact table styles**

Append this block near the existing `.data-board` and `.meta-grid` styles:

```css
.core-tabs {
  margin-top: 16px;
}

.core-tab-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.core-tab {
  min-height: 34px;
  padding: 0 12px;
  border: 1px solid var(--line);
  border-radius: 6px;
  background: #fffdf8;
  color: var(--muted);
  font-weight: 800;
}

.core-tab.is-active {
  border-color: var(--accent);
  background: var(--soft);
  color: var(--ink);
  box-shadow: inset 0 0 0 1px var(--accent);
}

.core-tab-panel {
  display: none;
  padding: 14px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fffaf1;
}

.core-tab-panel.is-active {
  display: block;
}

.core-tab-grid,
.candidate-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}

.core-fact,
.star-list article {
  min-width: 0;
  padding: 10px;
  border: 1px solid var(--line);
  border-radius: 6px;
  background: #fffdf8;
}

.core-fact span,
.core-fact small,
.star-list small,
.compact-row small {
  display: block;
  color: var(--muted);
  font-size: 12px;
  line-height: 1.45;
}

.core-fact strong {
  display: block;
  margin: 4px 0;
  font-size: 20px;
  line-height: 1.15;
}

.compact-table {
  display: grid;
  gap: 6px;
}

.compact-row {
  display: grid;
  grid-template-columns: .7fr .8fr .8fr minmax(0, 2fr);
  gap: 8px;
  align-items: center;
  padding: 9px 10px;
  border: 1px solid var(--line);
  border-radius: 6px;
  background: #fffdf8;
}

.compact-row.three {
  grid-template-columns: .8fr .8fr minmax(0, 2fr);
}

.compact-row.expert {
  grid-template-columns: .7fr .8fr 1fr 1fr 1fr;
}

.compact-head {
  background: var(--soft);
  color: var(--muted);
  font-size: 12px;
  font-weight: 800;
}

.stat-chip-row,
.star-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.stat-chip-row span {
  display: inline-flex;
  align-items: baseline;
  gap: 6px;
  padding: 7px 9px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: #fffdf8;
  color: var(--muted);
  font-size: 12px;
}

.stat-chip-row b {
  color: var(--ink);
}
```

- [ ] **Step 2: Add mobile responsive styles**

Inside the existing mobile media query near the bottom of `src/styles.css`, add:

```css
.core-tab-list {
  flex-wrap: nowrap;
  overflow-x: auto;
  padding-bottom: 4px;
}

.core-tab {
  flex: 0 0 auto;
}

.core-tab-grid,
.candidate-grid,
.strength-grid {
  grid-template-columns: 1fr;
}

.compact-row,
.compact-row.three,
.compact-row.expert {
  grid-template-columns: 1fr;
  align-items: start;
}
```

Expected: tabs remain usable on narrow screens and long table rows stack vertically.

## Task 4: Verification

**Files:**
- Verify changed files only.

- [ ] **Step 1: Run unit tests**

Run:

```bash
node --test
```

Expected: all tests pass.

- [ ] **Step 2: Validate data files**

Run:

```bash
node scripts/validate-bazi-data.mjs
```

Expected output includes:

```text
Bazi data validation passed
```

- [ ] **Step 3: Start the local site**

Run:

```bash
npm run dev
```

Expected output includes a local URL such as:

```text
离线八字服务已启动：http://127.0.0.1:5173
```

If the sandbox blocks binding to localhost, rerun the command with sandbox escalation.

- [ ] **Step 4: Browser-check the core chart**

Open the local URL in the in-app browser and verify:

- The four-pillar matrix still renders.
- The tab bar shows 总览、十神藏干、旺衰五行、空亡神煞、历法依据、专家明细.
- Clicking each tab changes the visible panel.
- 总览 shows 日主、造别、生肖、胎元、命宫、身宫.
- 十神藏干 shows full hidden-stem weights and ten-god count chips.
- 旺衰五行 shows energy bars and candidate labels.
- 空亡神煞 shows all four pillar void branches.
- 历法依据 shows true-solar correction details.
- 专家明细 shows nayin, twelve-stage, void, and method data.

- [ ] **Step 5: Mobile browser check**

Use a mobile viewport around 390px wide and verify:

- Tabs scroll or fit without text overlap.
- Compact rows stack vertically.
- No core-chart text overlaps neighboring content.

## Notes

The local git command currently fails with:

```text
xcrun: error: invalid active developer path (/Library/Developer/CommandLineTools)
```

Do not require git commit steps until Command Line Tools are fixed. Continue implementation and verification without destructive git commands.
