(function () {
  const stems = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
  const branches = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
  const stemElements = { 甲: "wood", 乙: "wood", 丙: "fire", 丁: "fire", 戊: "earth", 己: "earth", 庚: "metal", 辛: "metal", 壬: "water", 癸: "water" };
  const branchElements = { 子: "water", 丑: "earth", 寅: "wood", 卯: "wood", 辰: "earth", 巳: "fire", 午: "fire", 未: "earth", 申: "metal", 酉: "metal", 戌: "earth", 亥: "water" };
  const elementLabels = { wood: "木", fire: "火", earth: "土", metal: "金", water: "水" };
  const stemYinYang = { 甲: "yang", 乙: "yin", 丙: "yang", 丁: "yin", 戊: "yang", 己: "yin", 庚: "yang", 辛: "yin", 壬: "yang", 癸: "yin" };
  const polarityLabels = { yang: "阳", yin: "阴" };
  const hiddenStems = { 子: ["癸"], 丑: ["己", "癸", "辛"], 寅: ["甲", "丙", "戊"], 卯: ["乙"], 辰: ["戊", "乙", "癸"], 巳: ["丙", "庚", "戊"], 午: ["丁", "己"], 未: ["己", "丁", "乙"], 申: ["庚", "壬", "戊"], 酉: ["辛"], 戌: ["戊", "辛", "丁"], 亥: ["壬", "甲"] };
  const monthBranches = ["寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥", "子", "丑"];
  const monthLabels = ["正月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "腊月"];
  const dayPrefixes = ["初", "十", "廿", "三"];
  const dayDigits = ["", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
  const lunarNumberMap = { 正: 1, 一: 1, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9, 十: 10, 冬: 11, 腊: 12 };
  const dayAnchor = { year: 1984, month: 2, day: 2, index: 2, label: "丙寅" };
  const monthBoundaryTerms = [
    { name: "小寒", month: 1, day: 6, longitude: 285, branch: "丑" }, { name: "立春", month: 2, day: 4, longitude: 315, branch: "寅" },
    { name: "惊蛰", month: 3, day: 6, longitude: 345, branch: "卯" }, { name: "清明", month: 4, day: 5, longitude: 15, branch: "辰" },
    { name: "立夏", month: 5, day: 6, longitude: 45, branch: "巳" }, { name: "芒种", month: 6, day: 6, longitude: 75, branch: "午" },
    { name: "小暑", month: 7, day: 7, longitude: 105, branch: "未" }, { name: "立秋", month: 8, day: 8, longitude: 135, branch: "申" },
    { name: "白露", month: 9, day: 8, longitude: 165, branch: "酉" }, { name: "寒露", month: 10, day: 8, longitude: 195, branch: "戌" },
    { name: "立冬", month: 11, day: 7, longitude: 225, branch: "亥" }, { name: "大雪", month: 12, day: 7, longitude: 255, branch: "子" },
  ];
  const fallbackLocations = [
    { province: "常用城市", name: "北京", longitude: 116.4074, latitude: 39.9042, standardMeridian: 120 },
    { province: "常用城市", name: "上海", longitude: 121.4737, latitude: 31.2304, standardMeridian: 120 },
    { province: "常用城市", name: "广州", longitude: 113.2644, latitude: 23.1291, standardMeridian: 120 },
    { province: "常用城市", name: "深圳", longitude: 114.0579, latitude: 22.5431, standardMeridian: 120 },
    { province: "常用城市", name: "成都", longitude: 104.0665, latitude: 30.5728, standardMeridian: 120 },
    { province: "常用城市", name: "乌鲁木齐", longitude: 87.6168, latitude: 43.8256, standardMeridian: 120 },
    { province: "河北", name: "定州", longitude: 114.9902, latitude: 38.5162, standardMeridian: 120 },
  ];
  const nayinByPair = ["海中金", "炉中火", "大林木", "路旁土", "剑锋金", "山头火", "涧下水", "城头土", "白蜡金", "杨柳木", "泉中水", "屋上土", "霹雳火", "松柏木", "长流水", "沙中金", "山下火", "平地木", "壁上土", "金箔金", "覆灯火", "天河水", "大驿土", "钗钏金", "桑柘木", "大溪水", "沙中土", "天上火", "石榴木", "大海水"];
  const voidBranchesByDecade = [["戌", "亥"], ["申", "酉"], ["午", "未"], ["辰", "巳"], ["寅", "卯"], ["子", "丑"]];
  const twelveStageMatrix = {
    甲: { 子: "沐浴", 丑: "冠带", 寅: "临官", 卯: "帝旺", 辰: "衰", 巳: "病", 午: "死", 未: "墓", 申: "绝", 酉: "胎", 戌: "养", 亥: "长生" },
    乙: { 子: "病", 丑: "衰", 寅: "帝旺", 卯: "临官", 辰: "冠带", 巳: "沐浴", 午: "长生", 未: "养", 申: "胎", 酉: "绝", 戌: "墓", 亥: "死" },
    丙: { 子: "胎", 丑: "养", 寅: "长生", 卯: "沐浴", 辰: "冠带", 巳: "临官", 午: "帝旺", 未: "衰", 申: "病", 酉: "死", 戌: "墓", 亥: "绝" },
    丁: { 子: "绝", 丑: "墓", 寅: "死", 卯: "病", 辰: "衰", 巳: "帝旺", 午: "临官", 未: "冠带", 申: "沐浴", 酉: "长生", 戌: "养", 亥: "胎" },
    戊: { 子: "胎", 丑: "养", 寅: "长生", 卯: "沐浴", 辰: "冠带", 巳: "临官", 午: "帝旺", 未: "衰", 申: "病", 酉: "死", 戌: "墓", 亥: "绝" },
    己: { 子: "绝", 丑: "墓", 寅: "死", 卯: "病", 辰: "衰", 巳: "帝旺", 午: "临官", 未: "冠带", 申: "沐浴", 酉: "长生", 戌: "养", 亥: "胎" },
    庚: { 子: "死", 丑: "墓", 寅: "绝", 卯: "胎", 辰: "养", 巳: "长生", 午: "沐浴", 未: "冠带", 申: "临官", 酉: "帝旺", 戌: "衰", 亥: "病" },
    辛: { 子: "长生", 丑: "养", 寅: "胎", 卯: "绝", 辰: "墓", 巳: "死", 午: "病", 未: "衰", 申: "帝旺", 酉: "临官", 戌: "冠带", 亥: "沐浴" },
    壬: { 子: "帝旺", 丑: "衰", 寅: "病", 卯: "死", 辰: "墓", 巳: "绝", 午: "胎", 未: "养", 申: "长生", 酉: "沐浴", 戌: "冠带", 亥: "临官" },
    癸: { 子: "临官", 丑: "冠带", 寅: "沐浴", 卯: "长生", 辰: "养", 巳: "胎", 午: "绝", 未: "墓", 申: "死", 酉: "病", 戌: "衰", 亥: "帝旺" },
  };
  const comboRules = [
    ["天干五合", ["甲", "己"], "合化土"],
    ["天干五合", ["乙", "庚"], "合化金"],
    ["天干五合", ["丙", "辛"], "合化水"],
    ["天干五合", ["丁", "壬"], "合化木"],
    ["天干五合", ["戊", "癸"], "合化火"],
    ["地支六合", ["子", "丑"], "合土"],
    ["地支六合", ["寅", "亥"], "合木"],
    ["地支六合", ["卯", "戌"], "合火"],
    ["地支六合", ["辰", "酉"], "合金"],
    ["地支六合", ["巳", "申"], "合水"],
    ["地支六合", ["午", "未"], "合土"],
    ["地支六冲", ["子", "午"], "冲"],
    ["地支六冲", ["丑", "未"], "冲"],
    ["地支六冲", ["寅", "申"], "冲"],
    ["地支六冲", ["卯", "酉"], "冲"],
    ["地支六冲", ["辰", "戌"], "冲"],
    ["地支六冲", ["巳", "亥"], "冲"],
    ["地支六害", ["子", "未"], "害"],
    ["地支六害", ["丑", "午"], "害"],
    ["地支六害", ["寅", "巳"], "害"],
    ["地支六害", ["卯", "辰"], "害"],
    ["地支六害", ["申", "亥"], "害"],
    ["地支六害", ["酉", "戌"], "害"],
  ];
  const solarTermCache = new Map();
  const lunarFormatter = new Intl.DateTimeFormat("zh-u-ca-chinese", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });

  const locations = window.FortuneLocationData?.cities?.length ? window.FortuneLocationData.cities : fallbackLocations;
  const now = new Date();
  let lastData = null;
  const state = { name: "测试用户", calendarType: "solar", birthDate: "1949-10-01", birthTime: "00:00", gender: "male", birthProvince: "北京市", birthplace: "北京", trueSolarTime: false, targetYear: now.getFullYear(), selectedMonth: now.getMonth() + 1 };
  Object.assign(state, solarToLunarState(state.birthDate));

  document.addEventListener("DOMContentLoaded", () => refresh());

  function refresh() {
    const data = buildNarrative(state);
    lastData = data;
    renderBirthForm(data);
    renderChart(data);
    renderCoreSignals(data);
    renderYear(data);
    renderMonth(data);
    renderNarrative(data);
    renderDebug(data);
    setText("status", location.protocol === "file:" ? "文件模式：已完成前端本地排盘。" : "已完成前端本地排盘，可直接打开本地文件。")
  }

  function rerenderSettingsOnly() {
    renderBirthForm(lastData);
    setText("status", "命盘设置已修改，点击“重新排盘”后更新右侧命盘。");
  }

  function buildNarrative(input) {
    const chart = calculateBazi(input);
    const targetYear = Number(input.targetYear || new Date().getFullYear());
    const selectedMonth = Number(input.selectedMonth || 1);
    const selectedLuck = selectLuck(chart.luckCycles, input.selectedLuckIndex, targetYear);
    const yearInfluence = calculateYearInfluence(chart, targetYear);
    const monthInfluences = Array.from({ length: 12 }, (_, i) => calculateMonthInfluence(chart, targetYear, i + 1));
    const selectedMonthInfluence = monthInfluences[selectedMonth - 1];
    const coreSignals = buildCoreSignals(chart);
    const transitSignals = buildTransitSignals(chart, selectedLuck, yearInfluence);
    const monthSignals = buildMonthSignals(chart, selectedLuck, yearInfluence, selectedMonthInfluence);
    const storyTags = buildStoryTags(chart, yearInfluence, monthInfluences);
    return {
      chart,
      yearInfluence,
      monthInfluences,
      selectedMonthInfluence,
      selectedLuck,
      transitYears: Array.from({ length: selectedLuck.endYear - selectedLuck.startYear + 1 }, (_, i) => ({ year: selectedLuck.startYear + i, pillar: createPillarFromYear(selectedLuck.startYear + i, "流年") })),
      coreSignals,
      transitSignals,
      monthSignals,
      storyTags,
      narrative: { provider: "local-file", text: `年度主线：${storyTags.filter(t => t.period === "year").map(t => t.tag).join("、")}。这些只作为本地规则生成的观察点。` },
      selection: { targetYear, selectedMonth },
    };
  }

  function renderBirthForm(data) {
    syncCalendarState();
    const root = byId("birthForm");
    const solar = parseSolarDateParts(state.birthDate);
    const solarDayCount = getSolarDayCount(solar.year, solar.month);
    const lunarMonths = getLunarMonthOptions(state.lunarYear);
    const selectedMonth = lunarMonths.find(m => m.value === state.lunarMonth && m.isLeapMonth === Boolean(state.lunarLeapMonth)) || lunarMonths[0];
    const cityOptions = locations.filter(c => (c.province || "其他") === state.birthProvince);
    const city = cityOptions.find(c => c.name === state.birthplace) || locations.find(c => c.name === state.birthplace) || cityOptions[0] || locations[0];
    root.innerHTML = `
      <div class="plugin-header"><p class="eyebrow">命盘设置</p><h2 id="birth-input-title">出生信息</h2></div>
      <form id="birthFormInner" class="birth-form">
        <div class="calendar-tabs" role="radiogroup" aria-label="选择日期历法">
          ${calendarTab("solar", "公历")} ${calendarTab("lunar", "农历")}
        </div>
        ${state.calendarType === "lunar" ? renderLunarControls(lunarMonths, selectedMonth.days) : renderSolarControls(solar, solarDayCount)}
        <p class="calendar-preview">${escapeHtml(`公历 ${state.birthDate} · ${formatLunarDate(state)}`)}</p>
        <label><span>出生时间</span><input type="time" name="birthTime" value="${escapeHtml(state.birthTime)}" required /></label>
        <label><span>性别</span><select name="gender"><option value="male" ${sel(state.gender, "male")}>男命</option><option value="female" ${sel(state.gender, "female")}>女命</option></select></label>
        <label><span>出生省份</span><select name="birthProvince">${[...new Set(locations.map(c => c.province || "其他"))].map(p => `<option value="${p}" ${sel(state.birthProvince, p)}>${formatProvinceName(p)}</option>`).join("")}</select></label>
        <label><span>出生城市 / 区县</span><select name="birthplace">${cityOptions.map(c => `<option value="${c.name}" ${sel(state.birthplace, c.name)}>${c.displayName || c.name}</option>`).join("")}</select></label>
        <p class="location-preview">${escapeHtml(renderLocationPreview(city))}</p>
        <label class="switch-row"><input type="checkbox" name="trueSolarTime" ${state.trueSolarTime ? "checked" : ""} /><span>按真太阳时校正</span></label>
        <button type="submit">重新排盘</button>
      </form>
      <p class="fine-print">当前已展示专业命盘字段；农历换算支持 1900-2100 年，节气与真太阳时为本地近似算法。</p>`;
    bindBirthForm();
  }

  function bindBirthForm() {
    document.querySelectorAll('input[name="calendarType"]').forEach(input => input.addEventListener("change", e => { state.calendarType = e.target.value; rerenderSettingsOnly(); }));
    const bindChange = (name, fn) => byName(name)?.addEventListener("change", e => { fn(e.target); rerenderSettingsOnly(); });
    bindChange("solarYear", el => updateSolar({ ...parseSolarDateParts(state.birthDate), year: Number(el.value) }));
    bindChange("solarMonth", el => updateSolar({ ...parseSolarDateParts(state.birthDate), month: Number(el.value) }));
    bindChange("solarDay", el => updateSolar({ ...parseSolarDateParts(state.birthDate), day: Number(el.value) }));
    bindChange("lunarYear", el => { state.lunarYear = Number(el.value); updateLunar(); });
    bindChange("lunarMonth", el => { const [month, leap] = el.value.split("|"); state.lunarMonth = Number(month); state.lunarLeapMonth = leap === "1"; updateLunar(); });
    bindChange("lunarDay", el => { state.lunarDay = Number(el.value); updateLunar(); });
    ["birthTime", "gender"].forEach(name => bindChange(name, el => { state[name] = el.value; }));
    bindChange("birthProvince", el => { state.birthProvince = el.value; state.birthplace = locations.find(c => (c.province || "其他") === state.birthProvince)?.name || state.birthplace; });
    bindChange("birthplace", el => { state.birthplace = el.value; });
    byName("trueSolarTime")?.addEventListener("change", e => { state.trueSolarTime = e.target.checked; rerenderSettingsOnly(); });
    byId("birthFormInner")?.addEventListener("submit", e => { e.preventDefault(); refresh(); });
  }

  function renderChart(data) {
    const chart = data.chart;
    const d = chart.pillarDetails;
    byId("chartSummary").innerHTML = `
      <div class="plugin-header"><p class="eyebrow">核心命盘</p><h2>基础排盘展示</h2></div>
      <div class="bazi-matrix">
        <div class="matrix-row matrix-head"><span></span>${["year", "month", "day", "hour"].map(k => `<b>${d[k].label}</b>`).join("")}</div>
        <div class="matrix-row ten-god-row"><span>天干十神</span>${["year", "month", "day", "hour"].map(k => `<em>${d[k].stemTenGod}</em>`).join("")}</div>
        <div class="matrix-row main-symbol-row"><span>天干</span>${["year", "month", "day", "hour"].map(k => renderSymbol(d[k].pillar.stem, d[k].pillar.stemElement, d[k].pillar.yinYang)).join("")}</div>
        <div class="matrix-row main-symbol-row"><span>地支</span>${["year", "month", "day", "hour"].map(k => renderSymbol(d[k].pillar.branch, d[k].pillar.branchElement)).join("")}</div>
        <div class="matrix-row ten-god-row"><span>地支主气十神</span>${["year", "month", "day", "hour"].map(k => `<em>${d[k].branchMainTenGod}</em>`).join("")}</div>
        <div class="matrix-row hidden-row"><span>完整藏干</span>${["year", "month", "day", "hour"].map(k => `<small>${renderHidden(d[k].hiddenStems)}</small>`).join("")}</div>
        <div class="matrix-row aux-row"><span>纳音</span>${["year", "month", "day", "hour"].map(k => `<small>${d[k].nayin}</small>`).join("")}</div>
        <div class="matrix-row aux-row"><span>十二长生</span>${["year", "month", "day", "hour"].map(k => `<small>${d[k].twelveGrowth}</small>`).join("")}</div>
      </div>
      <p class="fine-print">基础盘只提供结构观察，后续判断需要结合柱位、旺衰、十神和岁运继续验证。</p>
      ${renderTabs(chart)}`;
    bindTabs();
  }

  function renderTabs(chart) {
    const tabs = [
      ["elements", "五行统计", renderElementStats(chart)], ["hidden", "十神藏干", renderTenGodStats(chart)], ["voids", "空亡旬空", renderVoidStats(chart)],
      ["relations", "干支关系", renderRelations(chart)], ["expert", "专家明细", renderExpert(chart)], ["calendar", "历法依据", renderCalendar(chart)],
    ];
    return `<section class="core-tabs"><div class="core-tab-list">${tabs.map(([id, label], i) => `<button type="button" class="core-tab ${i === 0 ? "is-active" : ""}" data-tab="${id}">${label}</button>`).join("")}</div>${tabs.map(([id, , html], i) => `<div class="core-tab-panel ${i === 0 ? "is-active" : ""}" data-panel="${id}" ${i ? "hidden" : ""}>${html}</div>`).join("")}</section>`;
  }

  function renderCoreSignals(data) {
    byId("coreSignals").innerHTML = `<div class="plugin-header"><p class="eyebrow">原局取象</p><h2>命盘候选信号</h2></div><p class="fine-print">以下只把命盘中的象列出来，作为学习和验证入口；不能单独作为结论。</p><div class="signal-board">${data.coreSignals.groups.map(group => `<section class="signal-section"><div class="board-title"><h3>${group.title}</h3><span>${group.signals.length} 条</span></div><div class="signal-grid">${group.signals.map(renderSignalCard).join("")}</div></section>`).join("")}</div>`;
  }

  function renderSignalCard(signal) {
    return `<article class="signal"><div><strong>${signal.tag}</strong><span class="badge">${confidenceLabel(signal.confidence)}</span></div><p>${signal.evidence.join("；")}</p><small>${signal.needVerify.join("；")}</small></article>`;
  }

  function renderTransitSignals(transitSignals) {
    return `<section class="data-board transit-signal-board"><div class="board-title"><h3>3. 大运流年取象</h3><span>${transitSignals.groups.reduce((sum, group) => sum + group.signals.length, 0)} 条</span></div><p class="fine-print">以下只列出大运、流年与原局之间的触发观察点，不单独作为事件结论。</p><div class="signal-board">${transitSignals.groups.map(group => `<section class="signal-section"><div class="board-title"><h3>${group.title}</h3><span>${group.signals.length} 条</span></div><div class="signal-grid">${group.signals.map(renderSignalCard).join("")}</div></section>`).join("")}</div></section>`;
  }

  function renderMonthSignals(monthSignals) {
    return `<section class="data-board month-signal-board"><div class="board-title"><h3>5. 流月取象</h3><span>${monthSignals.groups.reduce((sum, group) => sum + group.signals.length, 0)} 条</span></div><p class="fine-print">以下只列出当前流月的触发观察点，用于细化时间窗口。</p><div class="signal-board">${monthSignals.groups.map(group => `<section class="signal-section"><div class="board-title"><h3>${group.title}</h3><span>${group.signals.length} 条</span></div><div class="signal-grid">${group.signals.map(renderSignalCard).join("")}</div></section>`).join("")}</div></section>`;
  }

  function renderYear(data) {
    const root = byId("yearStory");
    if (!root) return;
    root.hidden = true;
    root.innerHTML = "";
  }

  function renderMonth(data) {
    const luck = data.chart.luckCycles;
    byId("monthTimeline").innerHTML = `<div class="plugin-header"><p class="eyebrow">大运 · 流年 · 流月</p><h2>岁运推演</h2></div><section class="data-board luck-board"><div class="board-title"><h3>1. 先选大运</h3><span>${luck.directionLabel} · ${luck.startAgeText} · 当前 ${data.selectedLuck.label}</span></div><div class="luck-table">${luck.pillars.map((p, i) => `<button class="luck-cell ${p.index === data.selectedLuck.index ? "is-active" : ""}" data-luck-index="${i}"><span>${p.startAge}-${p.endAge}岁</span><strong>${p.label}</strong><small>${p.startYear}-${p.endYear}</small></button>`).join("")}</div><p class="fine-print">${luck.startNote}</p></section><section class="data-board year-board"><div class="board-title"><h3>2. 再看该大运内的流年</h3><span>${data.selectedLuck.startYear}-${data.selectedLuck.endYear} · 当前 ${data.yearInfluence.year} ${data.yearInfluence.pillar.label}</span></div><div class="year-strip decade-strip">${data.transitYears.map(({ year, pillar }) => `<button class="flow-chip ${year === data.yearInfluence.year ? "is-active" : ""}" data-year="${year}"><span>${year}</span><strong>${pillar.label}</strong></button>`).join("")}</div><article class="story-card below"><strong>${data.yearInfluence.year} · ${data.yearInfluence.pillar.label}</strong><p>${data.yearInfluence.evidence.join("；")}</p><div class="tag-row">${data.storyTags.filter(t => t.period === "year").map(t => `<span>${t.tag}</span>`).join("")}</div></article></section>${renderTransitSignals(data.transitSignals)}<section class="data-board month-flow-board"><div class="board-title"><h3>4. 最后细看流月</h3><span>${data.yearInfluence.year} 年 · 当前 ${state.selectedMonth}月 ${data.selectedMonthInfluence.pillar.label}</span></div><div class="transit-layout"><div class="flow-focus">${renderPillarCard(data.yearInfluence.pillar, `${data.yearInfluence.year} 流年`)}${renderPillarCard(data.selectedMonthInfluence.pillar, `${state.selectedMonth}月流月`)}</div><div><div class="month-board">${data.monthInfluences.map(m => `<button class="flow-chip month ${m.month === state.selectedMonth ? "is-active" : ""}" data-month="${m.month}"><span>${m.month}月 · ${m.role}</span><strong>${m.pillar.label}</strong></button>`).join("")}</div></div></div></section>${renderMonthSignals(data.monthSignals)}<section class="analysis-block"><h3>月度窗口</h3><div class="transit-hit-list"><article><strong>${data.selectedMonthInfluence.month}月 ${data.selectedMonthInfluence.pillar.label}</strong><p>${data.selectedMonthInfluence.evidence.join("；")}</p><small>${data.selectedMonthInfluence.needVerify.join("；")}</small></article></div></section>`;
    document.querySelectorAll("[data-year]").forEach(b => b.addEventListener("click", () => { state.targetYear = Number(b.dataset.year); state.selectedMonth = 1; refresh(); }));
    document.querySelectorAll("[data-month]").forEach(b => b.addEventListener("click", () => { state.selectedMonth = Number(b.dataset.month); refresh(); }));
    document.querySelectorAll("[data-luck-index]").forEach(b => b.addEventListener("click", () => { const p = luck.pillars[Number(b.dataset.luckIndex)]; state.selectedLuckIndex = p.index - 1; state.targetYear = p.startYear; state.selectedMonth = 1; refresh(); }));
  }

  function renderNarrative(data) { byId("aiNarrative").innerHTML = `<h2>模型叙事层</h2><article class="narrative"><strong>${providerLabel(data.narrative.provider)}</strong><p>${escapeHtml(data.narrative.text)}</p></article>`; }
  function renderDebug(data) { byId("debugPanel").innerHTML = `<h2>调试数据</h2><div class="debug-summary"><article><span>排盘引擎</span><strong>本地排盘</strong><small>${data.chart.meta.evidence.join("；")}</small></article><article><span>原局取象</span><strong>${data.coreSignals.groups.length} 组</strong><small>${data.coreSignals.groups.map(group => `${group.title}${group.signals.length}条`).join("；")}</small></article><article><span>岁运取象</span><strong>${data.transitSignals.groups.length} 组</strong><small>${data.transitSignals.groups.map(group => `${group.title}${group.signals.length}条`).join("；")}</small></article><article><span>流月取象</span><strong>${data.monthSignals.groups.length} 组</strong><small>${data.monthSignals.groups.map(group => `${group.title}${group.signals.length}条`).join("；")}</small></article><article><span>岁运选择</span><strong>${data.selectedLuck.label} · ${data.yearInfluence.year}年 · ${data.selection.selectedMonth}月</strong><small>大运、流年、流月均由本地规则计算。</small></article><article><span>叙事来源</span><strong>${providerLabel(data.narrative.provider)}</strong><small>当前只使用本地生成的剧情标签做演示。</small></article></div>`; }

  function calculateBazi(input) {
    const birth = parseBirth(input);
    const pillars = buildNatalPillars(birth);
    const pillarDetails = buildPillarDetails(pillars);
    const elements = countElements(pillars);
    const luckCycles = buildLuckCycles(input, birth, pillars);
    const calendar = { solarDate: formatBirthDate(birth), time: formatBirthTime(birth), originalSolarDate: formatBirthDate(birth.original), originalTime: formatBirthTime(birth.original), inputCalendarType: birth.calendar.inputCalendarType, lunarDate: birth.calendar.lunarDate, trueSolarTime: birth.trueSolarTime, monthNote: pillars.month.meta.method, solarTermRange: `${pillars.month.meta.solarTerm}之后、${pillars.month.meta.nextSolarTerm}之前`, dayPillarDate: pillars.day.meta.pillarDate, dayPillarRule: "23:00-23:59按次日计算日柱（晚子时换日）", hourPillarRule: "按最终排盘时间取时辰，晚子时使用次日日干起时柱。" };
    return { input, pillars, dayMaster: { stem: pillars.day.stem, element: stemElements[pillars.day.stem], label: `${pillars.day.stem}日主` }, elements, dominantElements: dominantElements(elements), tenGods: buildTenGodSummary(pillars.day.stem, pillars), pillarDetails, tenGodStats: buildTenGodStats(pillarDetails), elementStats: buildElementStats(pillars), relations: findRelations(pillars), auxiliary: buildAuxiliary(pillars), luckCycles, calendar, meta: { engine: "birth-chart-engine", evidence: [`四柱：${Object.values(pillars).map(p => p.label).join(" ")}`, `月柱依据${pillars.month.meta.solarTerm}换月；日柱日期为${pillars.day.meta.pillarDate}。`], confidence: "medium", needVerify: ["节气时刻、真太阳时和起运口径仍建议保留人工复核入口。"] } };
  }

  function parseBirth(input) {
    const calendar = normalizeCalendar(input);
    const [year, month, day] = calendar.solarDate.split("-").map(Number);
    const [hour, minute] = String(input.birthTime || "12:00").split(":").map(Number);
    const raw = { year, month, day, hour, minute: minute || 0, calendar };
    return applyTrueSolar(raw, resolveLocation(input), input.trueSolarTime);
  }
  function normalizeCalendar(input) { const type = input.calendarType === "lunar" ? "lunar" : "solar"; const solarDate = type === "lunar" ? lunarToSolar(input) : input.birthDate; const lunar = solarToLunar(solarDate); return { inputCalendarType: type, solarDate, lunar, lunarDate: formatLunarDate(lunar) }; }
  function buildNatalPillars(birth) { const year = createPillarFromYear(adjustedSolarYear(birth), "年柱"); const month = createBirthMonthPillar(birth, year.stem, "月柱"); const dayBirth = getDayPillarBirth(birth); const day = createDayPillar(dayBirth, "日柱"); const hour = createHourPillar(birth.hour, day.stem, "时柱"); return { year, month, day, hour }; }
  function createPillarFromYear(year, role) { return createPillarByIndex(year - 1984, role, { year }); }
  function createMonthPillar(year, month, role) { return createBirthMonthPillar({ year, month, day: 15, hour: 12, minute: 0 }, createPillarFromYear(year, "流年").stem, role); }
  function createBirthMonthPillar(birth, yearStem, role) { const ctx = getSolarMonthContext(birth); const branch = ctx.current.branch; const order = monthBranches.indexOf(branch); const stem = stems[((stems.indexOf(yearStem) % 5) * 2 + 2 + order) % 10]; return makePillar(stem, branch, role, { month: birth.month, solarTerm: ctx.current.name, nextSolarTerm: ctx.next.name, solarTermAt: formatLocalDateTime(ctx.current), nextSolarTermAt: formatLocalDateTime(ctx.next), method: "月柱按节气排月，以太阳黄经计算的节气时刻为月令边界。" }); }
  function createDayPillar(birth, role) { const diff = gregorianToJdn(birth.year, birth.month, birth.day) - gregorianToJdn(dayAnchor.year, dayAnchor.month, dayAnchor.day); return createPillarByIndex(diff + dayAnchor.index, role, { pillarDate: formatBirthDate(birth), lateZiApplied: Boolean(birth.lateZiApplied) }); }
  function createHourPillar(hour, dayStem, role) { const branchIndex = hour === 23 ? 0 : Math.floor((hour + 1) / 2) % 12; const base = [0, 2, 4, 6, 8][stems.indexOf(dayStem) % 5]; return makePillar(stems[(base + branchIndex) % 10], branches[branchIndex], role); }
  function createPillarByIndex(index, role, meta) { const n = ((Number(index) % 60) + 60) % 60; return makePillar(stems[n % 10], branches[n % 12], role, meta || {}); }
  function makePillar(stem, branch, role, meta) { return { stem, branch, label: `${stem}${branch}`, role, stemElement: stemElements[stem], branchElement: branchElements[branch], yinYang: stemYinYang[stem], meta }; }

  function buildLuckCycles(input, birth, pillars) { const gender = input.gender === "male" ? "male" : "female"; const yang = stemYinYang[pillars.year.stem] === "yang"; const direction = (gender === "male" && yang) || (gender === "female" && !yang) ? "forward" : "reverse"; const start = calculateLuckStart(birth, direction); const monthIndex = getGanzhiIndex(pillars.month.stem, pillars.month.branch); const list = Array.from({ length: 10 }, (_, i) => { const p = createPillarByIndex(monthIndex + (direction === "forward" ? i + 1 : -(i + 1)), "大运"); const age = start.startAge + i * 10; return { index: i + 1, ...p, startAge: age, endAge: age + 9, startYear: birth.year + age, endYear: birth.year + age + 9 }; }); return { gender, direction, directionLabel: direction === "forward" ? "顺行" : "逆行", startAge: start.startAge, startAgeText: start.ageText, startCalculation: start, startNote: `起运按${direction === "forward" ? "出生后下一节气" : "出生前上一节气"}折算，采用三天折一岁的规则；当前约${start.ageText}起运。`, pillars: list, cycles: list, evidence: [], confidence: "medium", needVerify: ["起运仍需结合历法口径和出生地资料复核。"] }; }
  function calculateLuckStart(birth, direction) { const ctx = getSolarMonthContext(birth); const b = direction === "forward" ? ctx.next : ctx.current; const mins = Math.abs(b.localMs - getLocalBirthMs(birth)) / 60000; const years = mins / 1440 / 3; const months = Math.max(1, Math.round(years * 12)); const yy = Math.floor(months / 12), mm = months % 12; return { direction, boundaryName: b.name, boundaryAt: formatLocalDateTime(b), offsetDays: round(mins / 1440, 2), offsetHours: round(mins / 60, 1), ageYears: yy, ageMonths: mm, ageText: `${yy ? yy + "年" : ""}${mm ? mm + "个月" : ""}` || "1个月", startAge: Math.max(1, Math.round(years)) }; }

  function calculateYearInfluence(chart, year) { const p = createPillarFromYear(year, "流年"); return { year, pillar: p, tenGods: { stem: getTenGod(chart.dayMaster.stem, p.stem), branch: getTenGod(chart.dayMaster.stem, branchMainStem(p.branch)) }, relationHits: Object.values(chart.pillars).filter(n => n.branch === p.branch || n.stem === p.stem).map(n => ({ type: n.branch === p.branch ? "伏吟观察" : "同干观察", target: n.role, evidence: `${p.label} 与 ${n.role}${n.label}形成同象观察点`, confidence: "medium", needVerify: ["流年关系触发为观察信号，需要结合原局、大运、流月继续验证。"] })), evidence: [`流年${p.label}，天干为${getTenGod(chart.dayMaster.stem, p.stem)}，地支主气为${getTenGod(chart.dayMaster.stem, branchMainStem(p.branch))}`], confidence: "medium", needVerify: ["流年只提供触发观察点，不能单独作为事件结论。"] }; }
  function calculateMonthInfluence(chart, year, month) { const p = createMonthPillar(year, month, "流月"); return { year, month, pillar: p, role: monthRole(month), tenGods: { stem: getTenGod(chart.dayMaster.stem, p.stem), branch: getTenGod(chart.dayMaster.stem, branchMainStem(p.branch)) }, evidence: [`${month}月${p.label}，适合作为${monthRole(month)}观察窗口。`], confidence: "medium", needVerify: ["流月用于细化时间线，需要结合流年和原局共同观察。"] }; }
  function buildTransitSignals(chart, selectedLuck, yearInfluence) { const make = (type, tag, evidence, confidence = "medium", needVerify = ["需要结合原局、岁运层级和具体月份继续验证。"]) => ({ type, tag, evidence, confidence, needVerify }); const yearPillar = yearInfluence.pillar; const luckTenGods = { stem: getTenGod(chart.dayMaster.stem, selectedLuck.stem), branch: getTenGod(chart.dayMaster.stem, branchMainStem(selectedLuck.branch)) }; const luckSignals = [make("luckSignals", `${selectedLuck.label}大运取象`, [`大运${selectedLuck.label}，天干为${luckTenGods.stem}，地支主气为${luckTenGods.branch}`, `覆盖${selectedLuck.startYear}-${selectedLuck.endYear}年，年龄段为${selectedLuck.startAge}-${selectedLuck.endAge}岁`])]; const yearSignals = [make("yearSignals", `${yearInfluence.year}年${yearPillar.label}取象`, [`流年${yearPillar.label}，天干为${yearInfluence.tenGods.stem}，地支主气为${yearInfluence.tenGods.branch}`])]; const tenGodTriggers = [make("tenGodTriggers", "大运十神触发", [`${selectedLuck.label}大运：天干${luckTenGods.stem}，地支主气${luckTenGods.branch}`]), make("tenGodTriggers", "流年十神触发", [`${yearInfluence.year}年${yearPillar.label}：天干${yearInfluence.tenGods.stem}，地支主气${yearInfluence.tenGods.branch}`])]; const elementTriggers = [make("elementTriggers", "大运五行触发", [`${selectedLuck.label}大运：天干${elementLabels[selectedLuck.stemElement]}，地支${elementLabels[selectedLuck.branchElement]}`]), make("elementTriggers", "流年五行触发", [`${yearPillar.label}流年：天干${elementLabels[yearPillar.stemElement]}，地支${elementLabels[yearPillar.branchElement]}`])]; const relationTriggers = buildRelationTriggers(chart, selectedLuck, yearPillar, make); const triggeredCoreSignals = buildTriggeredCoreSignals(chart, selectedLuck, yearPillar, make); const combined = make("combinedTransit", "岁运并看", [`当前选择为${selectedLuck.label}大运、${yearInfluence.year}年${yearPillar.label}流年`, `大运作为阶段背景，流年作为年度触发观察点。`], "medium", ["岁运并看只提示触发层级，需要结合原局取象和流月继续验证。"]); return { engine: "transitSignalEngine", groups: [{ key: "luck-year", title: "大运与流年", signals: [...luckSignals, ...yearSignals, combined] }, { key: "triggers", title: "十神与五行触发", signals: [...tenGodTriggers, ...elementTriggers] }, { key: "relations", title: "关系与原局触发", signals: [...relationTriggers, ...triggeredCoreSignals] }] }; }
  function buildRelationTriggers(chart, selectedLuck, yearPillar, make) { const natal = Object.values(chart.pillars); const rows = []; const collect = (sourceName, sourcePillar, targetName, targetPillar) => comboRules.forEach(([type, members, effect]) => { if (samePair(members, [sourcePillar.stem, targetPillar.stem]) || samePair(members, [sourcePillar.branch, targetPillar.branch])) rows.push(make("relationTriggers", `${sourceName}${type}`, [`${sourceName}${sourcePillar.label} 与 ${targetName}${targetPillar.label} 命中${members.join("、")}，形成${effect}观察点。`])); }); natal.forEach(p => { collect("大运", selectedLuck, p.role, p); collect("流年", yearPillar, p.role, p); }); collect("大运", selectedLuck, "流年", yearPillar); return rows.length ? rows : [make("relationTriggers", "关系触发未命中", ["当前大运、流年与原局未命中已启用的合冲规则。"], "low")]; }
  function buildTriggeredCoreSignals(chart, selectedLuck, yearPillar, make) { const hits = Object.values(chart.pillars).flatMap(p => { const list = []; if (p.stem === selectedLuck.stem || p.branch === selectedLuck.branch) list.push(make("triggeredCoreSignals", `大运触发${p.role}`, [`${selectedLuck.label}大运与${p.role}${p.label}出现同干或同支观察点。`])); if (p.stem === yearPillar.stem || p.branch === yearPillar.branch) list.push(make("triggeredCoreSignals", `流年触发${p.role}`, [`${yearPillar.label}流年与${p.role}${p.label}出现同干或同支观察点。`])); return list; }); return hits.length ? hits : [make("triggeredCoreSignals", "原局同象触发未命中", ["当前大运、流年与原局四柱未出现同干或同支观察点。"], "low")]; }
  function buildMonthSignals(chart, selectedLuck, yearInfluence, selectedMonthInfluence) { const make = (type, tag, evidence, confidence = "medium", needVerify = ["流月只用于细化时间窗口，需要结合原局、大运、流年继续验证。"]) => ({ type, tag, evidence, confidence, needVerify }); const monthPillar = selectedMonthInfluence.pillar; const yearPillar = yearInfluence.pillar; const monthSignal = make("monthSignals", `${selectedMonthInfluence.month}月${monthPillar.label}取象`, [`流月${monthPillar.label}，天干为${selectedMonthInfluence.tenGods.stem}，地支主气为${selectedMonthInfluence.tenGods.branch}`, `${selectedMonthInfluence.month}月作为${selectedMonthInfluence.role}观察窗口。`]); const tenGodSignals = [make("monthTenGodTriggers", "流月十神触发", [`${selectedMonthInfluence.month}月${monthPillar.label}：天干${selectedMonthInfluence.tenGods.stem}，地支主气${selectedMonthInfluence.tenGods.branch}`])]; const elementSignals = [make("monthElementTriggers", "流月五行触发", [`${monthPillar.label}流月：天干${elementLabels[monthPillar.stemElement]}，地支${elementLabels[monthPillar.branchElement]}`])]; const relationSignals = buildMonthRelationSignals(chart, selectedLuck, yearPillar, monthPillar, make); const coreHits = buildMonthCoreHits(chart, monthPillar, make); const layerSignal = make("monthLayerSignal", "月令窗口层级", [`当前层级为${selectedLuck.label}大运、${yearInfluence.year}年${yearPillar.label}流年、${selectedMonthInfluence.month}月${monthPillar.label}流月。`, "流月作为短期窗口，用于观察触发是否被月份放大或收束。"], "medium"); return { engine: "transitSignalEngine", groups: [{ key: "month-main", title: "流月本身", signals: [monthSignal, layerSignal] }, { key: "month-triggers", title: "流月十神与五行", signals: [...tenGodSignals, ...elementSignals] }, { key: "month-relations", title: "流月关系触发", signals: [...relationSignals, ...coreHits] }] }; }
  function buildMonthRelationSignals(chart, selectedLuck, yearPillar, monthPillar, make) { const rows = []; const collect = (targetName, targetPillar) => comboRules.forEach(([type, members, effect]) => { if (samePair(members, [monthPillar.stem, targetPillar.stem]) || samePair(members, [monthPillar.branch, targetPillar.branch])) rows.push(make("monthRelationTriggers", `流月${type}`, [`流月${monthPillar.label} 与 ${targetName}${targetPillar.label} 命中${members.join("、")}，形成${effect}观察点。`])); }); Object.values(chart.pillars).forEach(p => collect(p.role, p)); collect("大运", selectedLuck); collect("流年", yearPillar); return rows.length ? rows : [make("monthRelationTriggers", "流月关系触发未命中", ["当前流月与原局、大运、流年未命中已启用的合冲规则。"], "low")]; }
  function buildMonthCoreHits(chart, monthPillar, make) { const hits = Object.values(chart.pillars).flatMap(p => { const list = []; if (p.stem === monthPillar.stem) list.push(make("monthCoreTriggers", `流月同干触发${p.role}`, [`流月${monthPillar.label}与${p.role}${p.label}出现同干观察点。`])); if (p.branch === monthPillar.branch) list.push(make("monthCoreTriggers", `流月同支触发${p.role}`, [`流月${monthPillar.label}与${p.role}${p.label}出现同支观察点。`])); return list; }); return hits.length ? hits : [make("monthCoreTriggers", "流月原局同象未命中", ["当前流月与原局四柱未出现同干或同支观察点。"], "low")]; }
  function buildCoreSignals(chart) { const detailList = ["year", "month", "day", "hour"].map(k => chart.pillarDetails[k]); const make = (type, tag, evidence, confidence = "medium", needVerify = ["需要结合柱位、旺衰、十神、岁运继续验证。"]) => ({ type, tag, evidence, confidence, needVerify }); const dayMaster = make("dayMaster", `${chart.dayMaster.label}取象`, [`日柱天干为${chart.pillars.day.stem}，五行属${elementLabels[chart.dayMaster.element]}`]); const monthCommand = make("monthCommand", `月令${chart.pillars.month.branch}取象`, [`月柱为${chart.pillars.month.label}，月令地支为${chart.pillars.month.branch}`, chart.calendar.monthNote]); const visibleElements = Object.entries(chart.elementStats.visible.counts).map(([k, v]) => `${elementLabels[k]}${v}`).join("、"); const hiddenElements = Object.entries(chart.elementStats.hidden.counts).map(([k, v]) => `${elementLabels[k]}${v}`).join("、"); const elementSignals = [make("elementSignals", "明面五行分布", [`四柱天干地支统计：${visibleElements}`]), make("elementSignals", "藏干五行分布", [`地支藏干统计：${hiddenElements}`])]; const mainTenGods = Object.entries(chart.tenGodStats.mainQi).map(([k, v]) => `${k}${v}`).join("、") || "暂无"; const hiddenTenGods = Object.entries(chart.tenGodStats.fullHidden).map(([k, v]) => `${k}${v}`).join("、") || "暂无"; const tenGodSignals = [make("tenGodSignals", "主气十神分布", [`${chart.tenGodStats.notes.mainQi}：${mainTenGods}`]), make("tenGodSignals", "完整藏干十神分布", [`${chart.tenGodStats.notes.fullHidden}：${hiddenTenGods}`])]; const rootingSignals = detailList.map(d => make("rootingSignals", `${d.label}${d.pillar.branch}藏干`, [`${d.pillar.label}，地支${d.pillar.branch}藏干：${d.hiddenStems.map(h => `${h.stem}${h.tenGod}${h.role}`).join("、") || "无"}`])); const relationSignals = chart.relations.length ? chart.relations.map(r => make("relationSignals", `${r.type}${r.effect}`, [`${r.ganzhi.join(" / ")} 命中 ${r.members.join("、")}，作为干支关系观察点。`])) : [make("relationSignals", "干支关系未命中", ["当前启用规则中未命中合冲关系。"], "low")]; const voidSignals = detailList.map(d => make("voidSignals", `${d.label}旬空`, [`${d.pillar.label} 旬空：${d.voidBranches.join("、")}`], "medium", ["空亡用于学习观察，需要结合柱位和岁运验证。"])); const nayinSignals = detailList.map(d => make("nayinSignals", `${d.label}纳音`, [`${d.pillar.label} 纳音为${d.nayin}`], "low", ["纳音作为辅助取象，不单独作为结论。"])); const growthSignals = detailList.map(d => make("growthSignals", `${d.label}十二长生`, [`以${chart.pillars.day.stem}日主看${d.pillar.branch}为${d.twelveGrowth}`], "medium")); const auxiliarySignals = [chart.auxiliary.fetalOrigin, chart.auxiliary.lifePalace, chart.auxiliary.bodyPalace].map(p => make("palaceSignals", `${p.role}${p.label}`, [`${p.role}为${p.label}，${p.meta.method}`], "low", ["胎元、命宫、身宫为辅助观察点，需要保留复核口径。"])); const caution = make("cautions", "取象边界", chart.meta.needVerify, "medium", ["本区只整理原局候选信号，不做事件判断。"]); return { engine: "coreSignalsEngine", groups: [{ key: "day-month", title: "日主与月令", signals: [dayMaster, monthCommand] }, { key: "elements-ten-gods", title: "五行与十神", signals: [...elementSignals, ...tenGodSignals] }, { key: "rooting-relations", title: "藏干根气与关系", signals: [...rootingSignals, ...relationSignals] }, { key: "auxiliary", title: "空亡、纳音、长生与辅助宫位", signals: [...voidSignals, ...nayinSignals, ...growthSignals, ...auxiliarySignals, caution] }] }; }
  function buildStoryTags(chart, year, months) { return [{ period: "natal", topic: "chart", tag: `${chart.dayMaster.stem}日主结构观察`, evidence: chart.meta.evidence, confidence: "medium", needVerify: ["剧情标签只负责叙事组织，不能单独作为结论。"] }, { period: "year", topic: "year-theme", tag: `${year.pillar.label}年度主线`, evidence: year.evidence, confidence: "medium", needVerify: ["剧情标签只负责叙事组织，不能单独作为结论。"] }, ...months.map(m => ({ period: "month", month: m.month, topic: "month-role", tag: `${m.month}月${m.role}`, evidence: m.evidence, confidence: "medium", needVerify: ["剧情标签只负责叙事组织，不能单独作为结论。"] }))]; }

  function buildPillarDetails(pillars) { return Object.fromEntries(Object.entries(pillars).map(([key, p]) => [key, { key, label: p.role, pillar: p, stemTenGod: key === "day" ? "日主" : getTenGod(pillars.day.stem, p.stem), branchMainTenGod: getTenGod(pillars.day.stem, branchMainStem(p.branch)), hiddenStems: (hiddenStems[p.branch] || []).map((s, i) => ({ stem: s, tenGod: getTenGod(pillars.day.stem, s), element: stemElements[s], elementLabel: elementLabels[stemElements[s]], role: ["主气", "中气", "余气"][i] || "余气" })), nayin: getNayin(p), twelveGrowth: twelveStageMatrix[pillars.day.stem]?.[p.branch] || "待查", voidBranches: getVoidBranches(p) }])); }
  function buildElementStats(pillars) { const visible = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 }, hidden = { ...visible }; Object.values(pillars).forEach(p => { visible[p.stemElement]++; visible[p.branchElement]++; (hiddenStems[p.branch] || []).forEach(s => hidden[stemElements[s]]++); }); return { visible: { label: "明面五行", note: "按四柱天干地支统计", counts: visible }, hidden: { label: "藏干五行", note: "按地支藏干统计", counts: hidden } }; }
  function buildTenGodStats(details) { const fullHidden = {}, mainQi = {}; Object.values(details).forEach(d => { inc(mainQi, d.stemTenGod === "日主" ? "比肩" : d.stemTenGod); inc(mainQi, d.branchMainTenGod); d.hiddenStems.forEach(h => inc(fullHidden, h.tenGod)); }); return { fullHidden, mainQi, notes: { fullHidden: "按完整藏干统计", mainQi: "按天干与地支主气统计" } }; }
  function buildAuxiliary(pillars) { return { fetalOrigin: createPillarByIndex(getGanzhiIndex(pillars.month.stem, pillars.month.branch) + 1, "胎元", { method: "月柱后一干三支近似法" }), lifePalace: createPalacePillar(pillars.month, pillars.hour, "命宫", false), bodyPalace: createPalacePillar(pillars.month, pillars.hour, "身宫", true) }; }
  function createPalacePillar(month, hour, role, body) { const mp = monthBranches.indexOf(month.branch) + 1, hp = branches.indexOf(hour.branch) + 1; const bi = body ? (mp + hp - 2) % 12 : (14 - mp - hp + 12) % 12; const branch = monthBranches[bi], stem = stems[(stems.indexOf(month.stem) + bi) % 10]; return { ...makePillar(stem, branch, role, { method: body ? "月时顺推身宫近似法" : "月时逆推命宫近似法" }) }; }
  function findRelations(pillars) { const list = Object.values(pillars), out = []; for (let i = 0; i < list.length; i++) for (let j = i + 1; j < list.length; j++) comboRules.forEach(([type, members, effect]) => { if (samePair(members, [list[i].stem, list[j].stem]) || samePair(members, [list[i].branch, list[j].branch])) out.push({ type, effect, members, ganzhi: [list[i].label, list[j].label] }); }); return out; }

  function getSolarMonthContext(birth) { const ms = getLocalBirthMs(birth); const bs = [birth.year - 1, birth.year, birth.year + 1].flatMap(y => monthBoundaryTerms.map(t => getSolarTermBoundary(y, t.name))).sort((a, b) => a.localMs - b.localMs); const idx = Math.max(0, bs.findLastIndex(b => ms >= b.localMs)); return { current: bs[idx], next: bs[idx + 1] || bs[idx] }; }
  function getSolarTermBoundary(year, name) { const term = monthBoundaryTerms.find(t => t.name === name); const key = `${year}-${name}`; if (solarTermCache.has(key)) return solarTermCache.get(key); const utcMs = findSolarTermUtcMs(year, term); const localMs = utcMs + 480 * 60000; const d = new Date(localMs); const b = { ...term, year, localMs, localYear: d.getUTCFullYear(), localMonth: d.getUTCMonth() + 1, localDay: d.getUTCDate(), localHour: d.getUTCHours(), localMinute: d.getUTCMinutes() }; solarTermCache.set(key, b); return b; }
  function findSolarTermUtcMs(year, term) { let low = Date.UTC(year, term.month - 1, term.day, 4) - 5 * 86400000, high = Date.UTC(year, term.month - 1, term.day, 4) + 5 * 86400000; while (hasReachedSolarLongitude(low, term.longitude)) low -= 86400000; while (!hasReachedSolarLongitude(high, term.longitude)) high += 86400000; for (let i = 0; i < 48; i++) { const mid = (low + high) / 2; if (hasReachedSolarLongitude(mid, term.longitude)) high = mid; else low = mid; } return high; }
  function hasReachedSolarLongitude(ms, longitude) { return normalizeDegrees(apparentSolarLongitude(ms) - longitude) < 180; }
  function apparentSolarLongitude(ms) { const jd = ms / 86400000 + 2440587.5, t = (jd - 2451545) / 36525; const l0 = normalizeDegrees(280.46646 + 36000.76983 * t + 0.0003032 * t * t), m = normalizeDegrees(357.52911 + 35999.05029 * t - 0.0001537 * t * t); const c = (1.914602 - 0.004817 * t - 0.000014 * t * t) * sinDeg(m) + (0.019993 - 0.000101 * t) * sinDeg(2 * m) + 0.000289 * sinDeg(3 * m); return normalizeDegrees(l0 + c - 0.00569 - 0.00478 * sinDeg(125.04 - 1934.136 * t)); }

  function solarToLunar(dateText) { const d = parseDate(dateText); const parts = Object.fromEntries(lunarFormatter.formatToParts(d).map(p => [p.type, p.value])); const formatted = lunarFormatter.format(d); const rawMonth = parts.month || extractLunarMonthText(formatted); const leap = rawMonth.startsWith("闰"); const month = monthNumberFromLunarLabel(leap ? rawMonth.slice(1) : rawMonth); const day = parseLunarDayValue(parts.day || extractLunarDayText(formatted)); const year = Number(parts.relatedYear || parts.year || formatted.match(/\d{4}/)?.[0]); return { year, month, day, isLeapMonth: leap }; }
  function lunarToSolar(input) { const target = { year: Number(input.lunarYear || input.year), month: Number(input.lunarMonth || input.month), day: Number(input.lunarDay || input.day), isLeapMonth: Boolean(input.lunarLeapMonth ?? input.isLeapMonth) }; for (let ms = Date.UTC(target.year, 0, 1); ms <= Date.UTC(target.year + 1, 2, 1); ms += 86400000) { const solar = formatDate(new Date(ms)); const lunar = solarToLunar(solar); if (lunar.year === target.year && lunar.month === target.month && lunar.day === target.day && lunar.isLeapMonth === target.isLeapMonth) return solar; } throw new Error("农历日期不存在，请检查输入。"); }
  function getLunarMonthOptions(year) { const months = [], seen = new Set(); for (let ms = Date.UTC(Number(year), 0, 1); ms <= Date.UTC(Number(year) + 1, 2, 1); ms += 86400000) { const lunar = solarToLunar(formatDate(new Date(ms))); if (lunar.year !== Number(year)) continue; const key = `${lunar.month}-${lunar.isLeapMonth}`; const existing = months.find(m => m.key === key); if (existing) { existing.days = Math.max(existing.days, lunar.day); continue; } if (seen.has(key)) continue; seen.add(key); months.push({ key, value: lunar.month, label: `${lunar.isLeapMonth ? "闰" : ""}${monthLabels[lunar.month - 1]}`, isLeapMonth: lunar.isLeapMonth, days: lunar.day }); } return months; }
  function formatLunarDate(lunar) { const year = Number(lunar.year ?? lunar.lunarYear), month = Number(lunar.month ?? lunar.lunarMonth), day = Number(lunar.day ?? lunar.lunarDay), leap = Boolean(lunar.isLeapMonth ?? lunar.lunarLeapMonth); return `农历${createPillarFromYear(year, "").label}年${leap ? "闰" : ""}${monthLabels[month - 1]}${formatLunarDay(day)}`; }
  function formatLunarDay(day) { const value = Number(day); if (value === 10) return "初十"; if (value === 20) return "二十"; if (value === 30) return "三十"; return `${dayPrefixes[Math.floor(value / 10)]}${dayDigits[value % 10]}`; }
  function monthNumberFromLunarLabel(label) { const clean = String(label || "").replace("月", ""); const numeric = Number(clean); if (Number.isInteger(numeric) && numeric >= 1 && numeric <= 12) return numeric; const direct = monthLabels.indexOf(clean.endsWith("月") ? clean : `${clean}月`) + 1; if (direct) return direct; if (clean === "十一") return 11; if (clean === "十二") return 12; return lunarNumberMap[clean] || 0; }
  function parseLunarDayValue(value) { const clean = String(value || "").replace("日", ""); const numeric = Number(clean); if (Number.isInteger(numeric) && numeric >= 1 && numeric <= 30) return numeric; if (clean === "初十") return 10; if (clean === "二十") return 20; if (clean === "三十") return 30; const prefix = clean[0], digit = clean.slice(1); const base = prefix === "初" ? 0 : prefix === "十" ? 10 : prefix === "廿" ? 20 : prefix === "三" ? 30 : 0; return base + (lunarNumberMap[digit] || 0); }
  function extractLunarMonthText(text) { return String(text || "").match(/闰?[正一二三四五六七八九十冬腊0-9]{1,3}月/u)?.[0] || ""; }
  function extractLunarDayText(text) { return String(text || "").match(/(?:月|年)(初十|二十|三十|初[一二三四五六七八九]|十[一二三四五六七八九]?|廿[一二三四五六七八九]?|三十|[0-9]{1,2})/u)?.[1] || ""; }

  function updateSolar(parts) { state.birthDate = formatSolarDateFromParts(parts); Object.assign(state, solarToLunarState(state.birthDate)); }
  function updateLunar() { const opts = getLunarMonthOptions(state.lunarYear); const selected = opts.find(m => m.value === state.lunarMonth && m.isLeapMonth === state.lunarLeapMonth) || opts[0]; state.lunarMonth = selected.value; state.lunarLeapMonth = selected.isLeapMonth; state.lunarDay = Math.min(state.lunarDay, selected.days); state.birthDate = lunarToSolar(state); }
  function syncCalendarState() { if (state.calendarType === "lunar") updateLunar(); else updateSolar(parseSolarDateParts(state.birthDate)); }
  function solarToLunarState(date) { const l = solarToLunar(date); return { lunarYear: l.year, lunarMonth: l.month, lunarDay: l.day, lunarLeapMonth: l.isLeapMonth }; }

  function renderElementStats(chart) { return `<div class="stats-two-col element-stats-layout">${renderElementBox({ ...chart.elementStats.visible, note: "天干 + 地支本气统计，用来看明面结构。" })}${renderElementBox({ ...chart.elementStats.hidden, note: "四个地支的完整藏干统计，用来看根气来源。" })}</div>`; }
  function renderElementBox(stat) { const max = Math.max(1, ...Object.values(stat.counts)); const symbols = { wood: "木", fire: "火", earth: "土", metal: "金", water: "水" }; return `<article class="stats-box element-stats-box"><span>${stat.label}</span><strong>${stat.note}</strong><div class="element-count-grid">${Object.entries(elementLabels).map(([k, label]) => { const value = stat.counts[k]; const percent = Math.max(8, Math.round(value / max * 100)); return `<div class="element-card element-${k}" style="--value:${percent}%"><i>${symbols[k]}</i><span>${label}</span><b>${value}</b><small>${value ? "有观察点" : "暂未显出"}</small><em class="element-bar"><mark style="width:${percent}%"></mark></em></div>`; }).join("")}</div></article>`; }
  function renderTenGodStats(chart) { return `<div class="compact-table"><div class="compact-row hidden-detail compact-head"><span>柱位</span><span>地支</span><span>完整藏干</span></div>${["year", "month", "day", "hour"].map(k => `<div class="compact-row hidden-detail"><span>${chart.pillarDetails[k].label}</span><strong>${chart.pillarDetails[k].pillar.branch}</strong><small>${renderHidden(chart.pillarDetails[k].hiddenStems)}</small></div>`).join("")}</div><div class="stats-two-col below">${renderStatBox("完整藏干十神", chart.tenGodStats.notes.fullHidden, chart.tenGodStats.fullHidden)}${renderStatBox("主气十神", chart.tenGodStats.notes.mainQi, chart.tenGodStats.mainQi)}</div>`; }
  function renderStatBox(title, note, counts) { const entries = Object.entries(counts || {}); return `<article class="stats-box"><span>${title}</span><strong>${note}</strong><div class="stat-chip-row">${entries.length ? entries.map(([name, count]) => `<span><b>${name}</b>${count}</span>`).join("") : "<span><b>暂无</b>0</span>"}</div></article>`; }
  function renderVoidStats(chart) { return `<div class="core-tab-grid">${["year", "month", "day", "hour"].map(k => `<article class="core-fact"><span>${chart.pillarDetails[k].label}</span><strong>${chart.pillarDetails[k].voidBranches.join("、")}</strong><small>${chart.pillarDetails[k].pillar.label} 旬空观察</small></article>`).join("")}</div>`; }
  function renderRelations(chart) { return chart.relations.length ? `<div class="relation-list">${chart.relations.map(r => `<article><span>${r.type}</span><strong>${r.members.join("、")} ${r.effect}</strong><small>${r.ganzhi.join(" / ")}</small></article>`).join("")}</div>` : `<p class="fine-print">当前命盘未命中已启用的干支关系规则。</p>`; }
  function renderExpert(chart) { return `<div class="compact-table"><div class="compact-row expert compact-head"><span>柱位</span><span>干支</span><span>纳音</span><span>长生</span><span>旬空</span></div>${["year", "month", "day", "hour"].map(k => `<div class="compact-row expert"><span>${chart.pillarDetails[k].label}</span><strong>${chart.pillarDetails[k].pillar.label}</strong><small>${chart.pillarDetails[k].nayin}</small><small>${chart.pillarDetails[k].twelveGrowth}</small><small>${chart.pillarDetails[k].voidBranches.join("、")}</small></div>`).join("")}</div><div class="candidate-grid below"><article class="core-fact"><span>胎元</span><strong>${chart.auxiliary.fetalOrigin.label}</strong><small>${chart.auxiliary.fetalOrigin.meta.method}</small></article><article class="core-fact"><span>命宫</span><strong>${chart.auxiliary.lifePalace.label}</strong><small>${chart.auxiliary.lifePalace.meta.method}</small></article><article class="core-fact"><span>身宫</span><strong>${chart.auxiliary.bodyPalace.label}</strong><small>${chart.auxiliary.bodyPalace.meta.method}</small></article></div>`; }
  function renderCalendar(chart) { const c = chart.calendar, s = c.trueSolarTime, loc = s.location || {}; return `<div class="core-tab-grid"><article class="core-fact"><span>输入历法</span><strong>${c.inputCalendarType === "lunar" ? "农历" : "公历"}</strong><small>用户输入</small></article><article class="core-fact"><span>原始输入时间</span><strong>${c.originalSolarDate} ${c.originalTime}</strong><small>不启用真太阳时时保持原始时间</small></article><article class="core-fact"><span>公历日期</span><strong>${c.originalSolarDate}</strong><small>农历输入会先换算为公历</small></article><article class="core-fact"><span>农历日期</span><strong>${c.lunarDate}</strong><small>用于核对阴阳历转换</small></article><article class="core-fact"><span>出生地</span><strong>${loc.displayName || loc.name}</strong><small>${loc.province || loc.source || ""}</small></article><article class="core-fact"><span>经纬度</span><strong>${Number.isFinite(Number(loc.longitude)) ? `${Number(loc.longitude).toFixed(4)} / ${Number(loc.latitude).toFixed(4)}` : "待接入"}</strong><small>${loc.timezone || "Asia/Shanghai"}</small></article><article class="core-fact"><span>标准经线</span><strong>${loc.standardMeridian || 120}</strong><small>用于经度校正</small></article><article class="core-fact"><span>真太阳时</span><strong>${s.enabled ? "启用" : "未启用"}</strong><small>${s.applied ? "已参与排盘" : "未参与排盘"}</small></article><article class="core-fact"><span>经度校正</span><strong>${s.longitudeCorrectionMinutes || 0}分钟</strong><small>按出生地经度</small></article><article class="core-fact"><span>均时差</span><strong>${s.equationOfTimeMinutes || 0}分钟</strong><small>用于真太阳时校正</small></article><article class="core-fact"><span>最终排盘时间</span><strong>${c.solarDate} ${c.time}</strong><small>用于生成四柱</small></article><article class="core-fact"><span>最终时辰</span><strong>${chart.pillars.hour.branch}</strong><small>按最终排盘时间</small></article><article class="core-fact"><span>日柱取日</span><strong>${c.dayPillarDate}</strong><small>${c.dayPillarRule}</small></article><article class="core-fact"><span>月柱换月依据</span><strong>${c.solarTermRange}</strong><small>${c.monthNote}</small></article><article class="core-fact"><span>时柱规则</span><strong>${chart.pillars.hour.branch}</strong><small>${c.hourPillarRule}</small></article></div>`; }
  function renderSymbol(value, element, yy) { const label = [polarityLabels[yy], elementLabels[element]].filter(Boolean).join(""); return `<span class="bazi-symbol element-${element || "unknown"} polarity-${yy || "unknown"}" data-element-label="${label}"><strong>${value}</strong><small>${label || elementLabels[element]}</small></span>`; }
  function renderHidden(items) { const elementByLabel = { 木: "wood", 火: "fire", 土: "earth", 金: "metal", 水: "water" }; return `<span class="hidden-chip-list">${items.map(i => `<span class="hidden-chip element-${elementByLabel[i.elementLabel] || "earth"}"><b>${i.stem}</b><em>${i.tenGod}</em><small>${i.role}</small><i>${i.elementLabel}</i></span>`).join("")}</span>`; }
  function renderPillarCard(p, title) { return `<article class="pillar-card"><span>${title}</span><strong>${p.label}</strong><small>${p.stemElement} / ${p.branchElement}</small></article>`; }
  function bindTabs() { document.querySelectorAll("[data-tab]").forEach(b => b.addEventListener("click", () => { document.querySelectorAll("[data-tab]").forEach(x => x.classList.toggle("is-active", x === b)); document.querySelectorAll("[data-panel]").forEach(p => { const active = p.dataset.panel === b.dataset.tab; p.classList.toggle("is-active", active); p.hidden = !active; }); })); }

  function getTenGod(dayStem, targetStem) { const de = stemElements[dayStem], te = stemElements[targetStem], same = stemYinYang[dayStem] === stemYinYang[targetStem]; if (te === de) return same ? "比肩" : "劫财"; if (generates(de) === te) return same ? "食神" : "伤官"; if (controls(de) === te) return same ? "偏财" : "正财"; if (controls(te) === de) return same ? "七杀" : "正官"; return same ? "偏印" : "正印"; }
  function buildTenGodSummary(dayStem, pillars) { return Object.fromEntries(Object.entries(pillars).map(([k, p]) => [k, { stem: k === "day" ? "日主" : getTenGod(dayStem, p.stem), branch: getTenGod(dayStem, branchMainStem(p.branch)) }])); }
  function countElements(pillars) { const c = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 }; Object.values(pillars).forEach(p => { c[p.stemElement]++; c[p.branchElement]++; (hiddenStems[p.branch] || []).forEach(s => c[stemElements[s]] += 0.4); }); Object.keys(c).forEach(k => c[k] = round(c[k], 1)); return c; }
  function dominantElements(c) { return Object.entries(c).sort((a, b) => b[1] - a[1]).slice(0, 2).map(([element, value]) => ({ element, label: elementLabels[element], value })); }
  function applyTrueSolar(raw, location, enabled) { const applied = Boolean(enabled && location); const correction = applied ? (location.longitude - (location.standardMeridian || 120)) * 4 + calculateEquationOfTime(raw) : 0; const d = new Date(Date.UTC(raw.year, raw.month - 1, raw.day, raw.hour, raw.minute) + correction * 60000); return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate(), hour: d.getUTCHours(), minute: d.getUTCMinutes(), original: raw, calendar: raw.calendar, trueSolarTime: { enabled: Boolean(enabled), applied, correctionMinutes: Math.round(correction), longitudeCorrectionMinutes: applied ? Math.round((location.longitude - (location.standardMeridian || 120)) * 4) : 0, equationOfTimeMinutes: applied ? Math.round(calculateEquationOfTime(raw)) : 0, location: { ...location, source: "dataset" } } }; }
  function resolveLocation(input) { return locations.find(l => l.name === input.birthplace && (l.province || "其他") === input.birthProvince) || locations.find(l => l.name === input.birthplace) || locations[0]; }
  function adjustedSolarYear(birth) { return getLocalBirthMs(birth) < getSolarTermBoundary(birth.year, "立春").localMs ? birth.year - 1 : birth.year; }
  function getDayPillarBirth(birth) { return birth.hour < 23 ? { ...birth, lateZiApplied: false } : shiftBirthDate(birth, 1); }
  function shiftBirthDate(birth, days) { const d = new Date(Date.UTC(birth.year, birth.month - 1, birth.day + days, birth.hour, birth.minute)); return { ...birth, year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate(), lateZiApplied: true }; }
  function calculateEquationOfTime(b) { const day = Math.floor((Date.UTC(b.year, b.month - 1, b.day) - Date.UTC(b.year, 0, 0)) / 86400000); const x = (2 * Math.PI * (day - 81)) / 364; return 9.87 * Math.sin(2 * x) - 7.53 * Math.cos(x) - 1.5 * Math.sin(x); }
  function selectLuck(luck, index, year) { return Number.isInteger(Number(index)) ? luck.pillars[Number(index)] : luck.pillars.find(p => year >= p.startYear && year <= p.endYear) || luck.pillars[0]; }
  function monthRole(m) { return m <= 3 ? "铺垫期" : m <= 6 ? "推进期" : m <= 9 ? "显化期" : "收束期"; }
  function branchMainStem(b) { return { 子: "癸", 丑: "己", 寅: "甲", 卯: "乙", 辰: "戊", 巳: "丙", 午: "丁", 未: "己", 申: "庚", 酉: "辛", 戌: "戊", 亥: "壬" }[b]; }
  function getNayin(p) { return nayinByPair[Math.floor(getGanzhiIndex(p.stem, p.branch) / 2)] || "待查"; }
  function getVoidBranches(p) { return voidBranchesByDecade[Math.floor(getGanzhiIndex(p.stem, p.branch) / 10)] || []; }
  function getGanzhiIndex(stem, branch) { for (let i = 0; i < 60; i++) if (stems[i % 10] === stem && branches[i % 12] === branch) return i; return 0; }
  function samePair(a, b) { return a.every(x => b.includes(x)); }
  function inc(o, k) { if (k) o[k] = (o[k] || 0) + 1; }
  function generates(e) { return { wood: "fire", fire: "earth", earth: "metal", metal: "water", water: "wood" }[e]; }
  function controls(e) { return { wood: "earth", earth: "water", water: "fire", fire: "metal", metal: "wood" }[e]; }
  function parseSolarDateParts(t) { const [year, month, day] = String(t).split("-").map(Number); return { year, month, day }; }
  function getSolarDayCount(y, m) { return new Date(Date.UTC(y, m, 0)).getUTCDate(); }
  function formatSolarDateFromParts(p) { return formatDate(new Date(Date.UTC(p.year, p.month - 1, Math.min(p.day, getSolarDayCount(p.year, p.month))))); }
  function parseDate(t) { const p = parseSolarDateParts(t); return new Date(Date.UTC(p.year, p.month - 1, p.day)); }
  function formatDate(d) { return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`; }
  function formatBirthDate(b) { return `${b.year}-${String(b.month).padStart(2, "0")}-${String(b.day).padStart(2, "0")}`; }
  function formatBirthTime(b) { return `${String(b.hour).padStart(2, "0")}:${String(b.minute).padStart(2, "0")}`; }
  function getLocalBirthMs(b) { return Date.UTC(b.year, b.month - 1, b.day, b.hour || 0, b.minute || 0); }
  function formatLocalDateTime(b) { return `${b.localYear}-${String(b.localMonth).padStart(2, "0")}-${String(b.localDay).padStart(2, "0")} ${String(b.localHour).padStart(2, "0")}:${String(b.localMinute).padStart(2, "0")}`; }
  function gregorianToJdn(y, m, d) { const a = Math.floor((14 - m) / 12), yy = y + 4800 - a, mm = m + 12 * a - 3; return d + Math.floor((153 * mm + 2) / 5) + 365 * yy + Math.floor(yy / 4) - Math.floor(yy / 100) + Math.floor(yy / 400) - 32045; }
  function sinDeg(d) { return Math.sin(d * Math.PI / 180); }
  function normalizeDegrees(d) { return ((d % 360) + 360) % 360; }
  function round(v, n) { const f = 10 ** n; return Math.round((v + Number.EPSILON) * f) / f; }
  function byId(id) { return document.getElementById(id); }
  function byName(name) { return document.querySelector(`[name='${name}']`); }
  function setText(id, text) { const el = byId(id); if (el) el.textContent = text; }
  function sel(a, b) { return a === b ? "selected" : ""; }
  function calendarTab(v, label) { return `<label class="${state.calendarType === v ? "is-active" : ""}"><input type="radio" name="calendarType" value="${v}" ${state.calendarType === v ? "checked" : ""}/><span>${label}</span></label>`; }
  function renderSolarControls(s, days) { return `<div class="calendar-date-grid"><label><span>公历年份</span><input type="number" name="solarYear" min="1900" max="2100" value="${s.year}" required /></label><label><span>公历月份</span><select name="solarMonth">${rangeOptions(12, s.month, "月")}</select></label><label><span>公历日期</span><select name="solarDay">${rangeOptions(days, s.day, "日")}</select></label></div>`; }
  function renderLunarControls(months, days) { const key = `${state.lunarMonth}|${state.lunarLeapMonth ? "1" : "0"}`; return `<div class="calendar-date-grid"><label><span>农历年份</span><input type="number" name="lunarYear" min="1900" max="2100" value="${state.lunarYear}" required /></label><label><span>农历月份</span><select name="lunarMonth">${months.map(m => `<option value="${m.value}|${m.isLeapMonth ? "1" : "0"}" ${`${m.value}|${m.isLeapMonth ? "1" : "0"}` === key ? "selected" : ""}>${m.label}</option>`).join("")}</select></label><label><span>农历日期</span><select name="lunarDay">${rangeOptions(days, state.lunarDay, "", formatLunarDay)}</select></label></div>`; }
  function rangeOptions(count, selected, suffix, fmt) { return Array.from({ length: count }, (_, i) => { const v = i + 1; return `<option value="${v}" ${v === Number(selected) ? "selected" : ""}>${fmt ? fmt(v) : `${v}${suffix}`}</option>`; }).join(""); }
  function renderLocationPreview(city) { const c = Math.round((city.longitude - (city.standardMeridian || 120)) * 4); return `${city.name}：经度${city.longitude.toFixed(4)}，纬度${city.latitude.toFixed(4)}；${state.trueSolarTime ? `经度校正约${c}分钟，已自动参与排盘。` : "勾选真太阳时后会自动按此地校正。"}`; }
  function formatProvinceName(province) { return String(province || "其他").replace(/特别行政区$/u, "").replace(/省$/u, "").replace(/市$/u, ""); }
  function confidenceLabel(value) { return { low: "较低", medium: "中等", high: "较高" }[value] || "待复核"; }
  function providerLabel(value) { return { "local-file": "本地演示", mock: "本地模拟" }[value] || "本地叙事"; }
  function escapeHtml(v) { return String(v ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;"); }
})();
