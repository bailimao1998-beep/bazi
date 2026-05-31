# Core Chart Expert Mode Design

## Goal

Redesign only the "核心命盘" section so it can show a fuller professional BaZi chart without making the first screen noisy. The section should keep the four-pillar chart as the main anchor, then expose complete supporting data through expert tabs.

This change is limited to the core chart experience. It must not redesign 综合判断、大运流年、分项报告、案例库, or AI 分析.

## User Choice

Use the "主盘 + 专家标签页" approach.

The main chart remains visible at the top. Detailed content moves into tabs:

- 总览
- 十神藏干
- 旺衰五行
- 空亡神煞
- 历法依据
- 专家明细

## Information Architecture

### Main Four-Pillar Chart

The top matrix stays as the default chart. It should show one concise row per core pillar fact:

- 四柱 labels: 年柱、月柱、日柱、时柱
- 天干十神
- 天干
- 地支
- 地支主气十神
- 藏干 summary
- 纳音
- 十二长生 / 地势

The main chart should avoid repeating long explanations. It is the visual anchor, not the full report.

### Tab: 总览

Purpose: answer "what chart is this?" at a glance.

Fields:

- 日主 and element
- 乾造 / 坤造 based on gender
- 生肖, if a reliable derivation is available
- 公历出生 date and time
- 出生地
- 真太阳时 enabled/disabled status
- 日空
- 胎元
- 命宫
- 身宫
- 节气换月 note

Current duplicate "命盘要点" content should be reorganized here.

### Tab: 十神藏干

Purpose: show all ten-god and hidden-stem structure without duplicating the main matrix.

Fields:

- Four heavenly stem ten gods
- Four branch main-qi ten gods
- Full hidden-stem list for each branch
- Hidden-stem role and weight
- Ten-god count summary across visible stems, branch main qi, and hidden stems
- Clear distinction between direct stem signals and hidden signals

The main matrix keeps short labels; this tab owns the detailed table.

### Tab: 旺衰五行

Purpose: gather strength, element, and useful-god related data in one place.

Fields:

- Five-element scores
- Month-command seasonal status: 旺、相、休、囚、死
- 日主旺衰候选
- 喜神、用神、忌神候选
- Notes about confidence and algorithm limits

If 日主旺衰 or 喜用忌神 is not yet reliable enough, the UI must mark it as "候选" or "待精校" rather than presenting it as a final judgment.

### Tab: 空亡神煞

Purpose: make void branches and stars visible inside the core chart.

Fields:

- 年柱、月柱、日柱、时柱旬空 / 空亡
- 命中神煞 list
- 神煞所落地支
- 查法 basis or source label when available
- Empty state when no star is matched

The core chart should show all four-pillar void branches here, not only 日空.

### Tab: 历法依据

Purpose: explain why the chart was calculated this way.

Fields:

- Original solar date and time
- Adjusted date and time after true solar correction, when enabled
- Birthplace name
- Longitude, latitude, timezone, standard meridian when available
- Longitude correction minutes
- Equation-of-time minutes
- Total true-solar correction minutes
- Month-boundary / solar-term approximation note
- Lunar date placeholder, clearly marked as unavailable until a lunar calendar engine is added

This tab should keep precision caveats visible without cluttering the main chart.

### Tab: 专家明细

Purpose: provide a place for dense or future expert fields.

Fields:

- Nayin full table
- Twelve-growth-stage full table
- Void-branch full table
- Fetal origin / life palace / body palace derivation method
- Dataset coverage relevant to core chart calculations
- Optional placeholders for future 小运、胎息、命卦、身主、命主, only if clearly marked as not implemented

This tab may be denser than the others, but should still be structured rather than a raw dump.

## Data Changes

Use existing calculated data wherever possible:

- `reading.natal.pillars`
- `reading.natal.pillarDetails`
- `reading.natal.chartMeta`
- `reading.natal.hiddenStems`
- `reading.natal.tenGods`
- `reading.natal.elements`
- `reading.natal.elementScores`
- `reading.natal.strengthSignals`
- `reading.natal.starSignals`
- `reading.natal.datasetCoverage`

Add derived fields only when they reduce duplication or make rendering safer:

- Ten-god counts grouped by name
- Chart-gender label: 乾造 / 坤造
- Zodiac label from year branch, if implemented locally
- Core-chart useful-god candidates, if based on existing strength model

Do not add speculative calculations as final truth. Any incomplete or approximate algorithm must be labeled as candidate or approximation in the UI.

## Component Design

Primary target:

- `src/sections/core-chart.global.js`

Likely supporting files:

- `src/styles.css`
- `src/lib/readingEngine.js`
- `src/lib/readingEngine.global.js`
- `src/lib/readingEngine.test.mjs`

The core section should be split into focused render helpers:

- `renderPillarMatrix`
- `renderCoreTabs`
- `renderOverviewTab`
- `renderTenGodHiddenTab`
- `renderStrengthElementTab`
- `renderVoidStarsTab`
- `renderCalendarEvidenceTab`
- `renderExpertDetailsTab`

Tab state can be local DOM state inside the core chart section. It does not need to be added to global app state unless another section needs to read it.

## Interaction Design

The tab bar should behave like a segmented control:

- Clicking a tab switches the visible panel.
- The selected tab has a clear active state.
- The first tab, 总览, is selected by default.
- On mobile, tabs wrap or scroll horizontally without overflowing text.
- No information should disappear permanently; hidden panels remain reachable through tabs.

## Visual Design

The section should remain work-focused and information-dense:

- Keep the existing dark dashboard tone.
- Avoid nested card-in-card patterns.
- Use compact tables, stat chips, and short explanatory notes.
- Long technical notes should appear in small text inside their relevant tab.
- The main matrix should not become taller than necessary.

## Error Handling and Empty States

- If datasets are missing, render built-in fallback values where available.
- If a field is unavailable, show `待接入` or `待精校`, not a blank cell.
- If star signals are empty, show a short empty state.
- If true solar time is disabled, still show birthplace and the correction that would apply.
- If location lookup fails, keep the user-entered birthplace and show location data as unavailable.

## Testing

Add focused tests for engine-derived fields if new fields are added:

- Ten-god counts are stable for a sample chart.
- Gender chart label returns 乾造 / 坤造.
- Zodiac label derives from the year branch.
- Useful-god or strength candidates are labeled as candidate data.

Run:

- `node --test`
- `node scripts/validate-bazi-data.mjs`

Also run a browser check for the core section:

- Main matrix renders.
- Each tab can be selected.
- No visible overflow in desktop width.
- Mobile tab bar remains usable.

## Out of Scope

- Redesigning 大运流年.
- Redesigning 综合判断.
- Adding a full lunar calendar engine.
- Adding precise astronomical solar-term calculation.
- Claiming final 喜用神 precision without stronger rules.
- Importing new third-party libraries unless a later implementation plan explicitly justifies it.
