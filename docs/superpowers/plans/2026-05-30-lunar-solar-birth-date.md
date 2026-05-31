# Lunar Solar Birth Date Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let users enter birth dates by Gregorian or Chinese lunar calendar, convert between them, and show both in the chart.

**Architecture:** Add a focused calendar conversion module shared by tests and the browser global bundle. The reading engine normalizes birth input to Gregorian before existing four-pillar calculations, while UI state stores both calendar modes.

**Tech Stack:** Vanilla JavaScript, Node `node:test`, browser global scripts.

---

### Task 1: Calendar Conversion Module

**Files:**
- Create: `src/lib/lunarCalendar.js`
- Create: `src/lib/lunarCalendar.global.js`
- Test: `src/lib/lunarCalendar.test.mjs`

- [ ] Write failing tests for Gregorian to lunar, lunar to Gregorian, and leap month conversion.
- [ ] Run `node --test src/lib/lunarCalendar.test.mjs` and confirm the missing module failure.
- [ ] Implement the 1900-2100 conversion table and exported helpers.
- [ ] Run `node --test src/lib/lunarCalendar.test.mjs` and confirm all conversion tests pass.

### Task 2: Reading Engine Integration

**Files:**
- Modify: `src/lib/readingEngine.js`
- Modify: `src/lib/readingEngine.global.js`
- Test: `src/lib/readingEngine.test.mjs`

- [ ] Add failing tests showing lunar input produces the same pillars as equivalent Gregorian input.
- [ ] Run `node --test src/lib/readingEngine.test.mjs` and confirm the new assertions fail.
- [ ] Import or reference the calendar helpers and normalize input in `parseBirth()`.
- [ ] Add `calendar.lunarDate`, `calendar.inputCalendarType`, and conversion notes to chart metadata.
- [ ] Run `node --test src/lib/readingEngine.test.mjs` and confirm the suite passes.

### Task 3: Birth Settings UI

**Files:**
- Modify: `index.html`
- Modify: `src/main.global.js`
- Modify: `src/sections/birth-settings.global.js`
- Modify: `src/sections/core-chart.global.js`
- Modify: `src/styles.css`

- [ ] Load `src/lib/lunarCalendar.global.js` before the reading engine global script.
- [ ] Extend initial state with calendar mode and lunar fields.
- [ ] Render segmented calendar controls and the matching date fields.
- [ ] On submit, persist both the active input and converted counterpart.
- [ ] Show both dates in the命盘要点 calendar line.

### Task 4: Verification

**Files:**
- Verify all changed files.

- [ ] Run `npm test`.
- [ ] Start the local server with `npm run dev`.
- [ ] Open the app in the browser and verify switching 公历/农历 keeps dates synchronized and the chart renders.
