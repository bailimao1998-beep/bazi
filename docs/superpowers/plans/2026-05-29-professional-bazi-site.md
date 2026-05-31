# Professional BaZi Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the initial BaZi workbench into a more professional chart page with core chart metadata, luck pillars, cleaner input, and polished numeric display.

**Architecture:** Extend `readingEngine` so chart-derived facts live in the analysis object, then render them in both module and browser-global entrypoints. Keep calculations deterministic and local, using existing structured datasets where available.

**Tech Stack:** Plain HTML/CSS/JavaScript, Node built-in test runner, local JSON datasets.

---

### Task 1: Engine Metadata

**Files:**
- Modify: `src/lib/readingEngine.js`
- Modify: `src/lib/readingEngine.global.js`
- Test: `src/lib/readingEngine.test.mjs`

- [ ] **Step 1: Write failing tests**

Add tests asserting `analyzeBirth()` returns chart metadata with `nayin`, `twelveStage`, `voidBranches`, `fetalOrigin`, `lifePalace`, `bodyPalace`, and a 10-step `luckPillars` array when `gender` is supplied.

- [ ] **Step 2: Run red test**

Run: `node --test src/lib/readingEngine.test.mjs`
Expected: FAIL because `reading.natal.chartMeta` and `reading.luckPillars` are not defined yet.

- [ ] **Step 3: Implement metadata**

Add helper tables and pure functions in the engine for sixty-cycle index, nayin lookup, void branch lookup, fetal origin, life/body palace approximations, twelve-stage lookup from `data/05`, and gender/year-yin-yang based luck direction.

- [ ] **Step 4: Run green test**

Run: `node --test src/lib/readingEngine.test.mjs`
Expected: PASS.

### Task 2: Professional UI

**Files:**
- Modify: `src/main.global.js`
- Modify: `src/main.js`
- Modify: `src/styles.css`
- Modify: `index.html`

- [ ] **Step 1: Write failing display test**

Add a test for exported `formatEnergyValue()` or engine-level rounded energy values so floating point artifacts cannot appear in the UI.

- [ ] **Step 2: Run red test**

Run: `node --test src/lib/readingEngine.test.mjs`
Expected: FAIL before formatting helper exists.

- [ ] **Step 3: Implement UI**

Add gender/location/true-solar-time controls, render a chart metadata board, render a luck pillar table, remove plugin names from visible copy, and format energy values to at most one decimal.

- [ ] **Step 4: Run green test**

Run: `node --test src/lib/readingEngine.test.mjs`
Expected: PASS.

### Task 3: Verification

**Files:**
- Test all changed code.

- [ ] **Step 1: Validate data**

Run: `node scripts/validate-bazi-data.mjs`
Expected: `Bazi data validation passed`.

- [ ] **Step 2: Run unit tests**

Run: `node --test`
Expected: all tests pass.

- [ ] **Step 3: Browser check**

Start a local static server, open the page in the in-app browser, and verify the professional fields render without console errors or obvious overflow.
