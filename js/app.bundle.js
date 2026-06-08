(function () {
  const stems = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
  const branches = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
  const stemElements = { 甲: "wood", 乙: "wood", 丙: "fire", 丁: "fire", 戊: "earth", 己: "earth", 庚: "metal", 辛: "metal", 壬: "water", 癸: "water" };
  const branchElements = { 子: "water", 丑: "earth", 寅: "wood", 卯: "wood", 辰: "earth", 巳: "fire", 午: "fire", 未: "earth", 申: "metal", 酉: "metal", 戌: "earth", 亥: "water" };
  const elementLabels = { wood: "木", fire: "火", earth: "土", metal: "金", water: "水" };
  const elementAttributes = { wood: "生发、条达、规划", fire: "表达、热度、显化", earth: "承载、稳定、转化", metal: "规则、收敛、执行", water: "流动、信息、应变" };
  const chatForbiddenWords = ["必离婚", "必发财", "必有灾", "必坐牢", "必死亡", "一定", "必定", "绝对", "必然"];
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
    ["天干五合", ["甲", "己"], "土象牵连"],
    ["天干五合", ["乙", "庚"], "金象牵连"],
    ["天干五合", ["丙", "辛"], "水象牵连"],
    ["天干五合", ["丁", "壬"], "木象牵连"],
    ["天干五合", ["戊", "癸"], "火象牵连"],
    ["地支六合", ["子", "丑"], "土象牵连"],
    ["地支六合", ["寅", "亥"], "木象牵连"],
    ["地支六合", ["卯", "戌"], "火象牵连"],
    ["地支六合", ["辰", "酉"], "金象牵连"],
    ["地支六合", ["巳", "申"], "水象牵连"],
    ["地支六合", ["午", "未"], "土象牵连"],
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
  let flowAiReports = { luck: null, year: null, month: null };
  let flowAiLoading = "";
  let chatTypingTimer = null;
  const chatState = {
    open: false,
    loading: false,
    contextVersion: 0,
    messages: [
      { role: "assistant", content: "可以直接问我任何问题。命盘和网页内容只是可选参考，相关时我会结合，不相关时我会按通用 AI 正常回答。", complete: true },
    ],
  };
  const state = { name: "测试用户", calendarType: "solar", birthDate: "1949-10-01", birthTime: "00:00", gender: "male", birthProvince: "北京市", birthplace: "北京", trueSolarTime: false, targetYear: now.getFullYear(), selectedMonth: now.getMonth() + 1 };
  Object.assign(state, solarToLunarState(state.birthDate));

  document.addEventListener("DOMContentLoaded", () => {
    refresh();
    renderChatWidget();
  });

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
    noteChatContextChanged();
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
    byId("birthFormInner")?.addEventListener("submit", e => { e.preventDefault(); resetFlowAiReports(); refresh(); });
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
    const core = data.coreSignals;
    const total = core.groups.reduce((sum, group) => sum + group.signals.length, 0);
    byId("coreSignals").innerHTML = `<div class="plugin-header"><p class="eyebrow">原局取象</p><h2>命盘结构解读</h2></div><p class="fine-print">以下内容属于基础取象，不等于最终断命。最终判断还需要结合月令旺衰、日主强弱、十神组合、合冲刑害、大运流年综合分析。</p><section class="reading-overview"><span>一句话总览</span><p>${core.overview}</p></section><section class="reading-panel"><div class="board-title"><h3>专业速览</h3><span>${total} 条</span></div><div class="core-signal-matrix"><table><thead><tr><th>分组</th><th>观察点</th><th>类型</th><th>原始依据</th><th>取象关键词</th><th>展开解释</th></tr></thead><tbody>${core.groups.map(group => group.signals.map(signal => renderCoreSignalRow(signal, group.title)).join("")).join("")}</tbody></table></div></section><details class="professional-evidence"><summary>专业依据</summary><div class="professional-grid">${core.professional.map(item => `<article><span>${item.label}</span><strong>${item.value}</strong><small>${item.note}</small></article>`).join("")}</div></details>`;
  }

  function renderCoreSignalRow(signal, groupTitle) {
    return `<tr class="core-signal-row"><td data-label="分组">${signal.group || groupTitle}</td><td data-label="观察点"><strong>${signal.title}</strong></td><td data-label="类型"><span class="badge">${signal.tag}</span></td><td data-label="原始依据">${signal.evidence}</td><td data-label="取象关键词">${signal.keywords}</td><td data-label="展开解释"><details class="inline-reading"><summary>展开</summary><dl><dt>白话取象</dt><dd>${signal.plainReading}</dd><dt>现实表现</dt><dd>${signal.realLifeMeaning}</dd><dt>判断限制</dt><dd>${signal.caution}</dd></dl></details></td></tr>`;
  }

  function renderSignalCard(signal) {
    if (signal.plainReading) return `<article class="signal reading-card"><div><strong>${signal.title}</strong><span class="badge">${signal.tag}</span></div><dl><dt>原始依据</dt><dd>${signal.evidence}</dd><dt>白话取象</dt><dd>${signal.plainReading}</dd><dt>现实表现</dt><dd>${signal.realLifeMeaning}</dd><dt>判断限制</dt><dd>${signal.caution}</dd></dl></article>`;
    return `<article class="signal"><div><strong>${signal.tag}</strong><span class="badge">${confidenceLabel(signal.confidence)}</span></div><p>${signal.evidence.join("；")}</p><small>${signal.needVerify.join("；")}</small></article>`;
  }

  function renderFlowAiControls(modes) {
    const labels = { luck: "AI解读大运", year: "AI解读流年", month: "AI解读流月" };
    const attrs = { luck: 'data-ai-mode="luck"', year: 'data-ai-mode="year"', month: 'data-ai-mode="month"' };
    return `<div class="flow-ai-controls">${modes.map(mode => `<button type="button" class="ai-flow-button" ${attrs[mode]} ${flowAiLoading === mode ? "disabled" : ""}>${flowAiLoading === mode ? "生成中..." : labels[mode]}</button>`).join("")}</div>${modes.map(mode => renderFlowAiReport(mode)).join("")}`;
  }

  function renderFlowAiReport(mode) {
    const report = flowAiReports[mode];
    if (!report && flowAiLoading !== mode) return "";
    if (flowAiLoading === mode) return `<article class="ai-report-panel is-loading"><strong>${flowAiModeLabel(mode)}报告</strong><p>正在根据当前矩阵证据生成白话取象...</p></article>`;
    return `<article class="ai-report-panel"><div class="ai-report-head"><span>AI辅助取象</span><strong>${flowAiModeLabel(mode)}报告</strong></div><p>${escapeHtml(report.summary)}</p><div class="ai-report-grid">${renderFlowAiList("重点象", report.keySignals)}${renderFlowAiList("现实主题", report.likelyThemes)}${renderFlowAiList("提醒", report.cautions)}${renderFlowAiList("判断限制", report.verificationLimits)}</div></article>`;
  }

  function renderFlowAiList(title, list = []) {
    return `<section><h4>${title}</h4><ul>${(list.length ? list : ["暂无内容"]).map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul></section>`;
  }

  function flowAiModeLabel(mode) {
    return { luck: "大运", year: "流年", month: "流月" }[mode] || "岁运";
  }

  async function requestFlowAiReport(mode) {
    if (!lastData || flowAiLoading) return;
    const browserConfig = getBrowserDeepseekConfig();
    if (location.protocol === "file:") {
      if (browserConfig.apiKey) {
        await requestBrowserDeepseekReport(mode, browserConfig);
        return;
      }
      flowAiReports[mode] = createLocalFlowAiReport(mode);
      setText("status", "文件模式：使用本地占位 AI 辅助取象。");
      renderMonth(lastData);
      return;
    }
    flowAiLoading = mode;
    renderMonth(lastData);
    try {
      const response = await fetch("/api/narrative", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON["stringify"]({
          ...state,
          mode,
          coreSignals: lastData.coreSignals,
          transitSignals: lastData.transitSignals,
          monthSignals: lastData.monthSignals,
          selectedLuck: lastData.selectedLuck,
          yearInfluence: lastData.yearInfluence,
          selectedMonthInfluence: lastData.selectedMonthInfluence,
        }),
      });
      const result = await response.json();
      flowAiReports[mode] = normalizeFlowAiReport(result.narrative?.report, result.narrative?.text, mode);
      setText("status", `${flowAiModeLabel(mode)}AI辅助取象已生成。`);
    } catch (error) {
      flowAiReports[mode] = createLocalFlowAiReport(mode);
      setText("status", "后端暂不可用：使用本地占位 AI 辅助取象。");
    } finally {
      flowAiLoading = "";
      renderMonth(lastData);
    }
  }

  function getBrowserDeepseekConfig() {
    const config = window.FortuneLocalAiConfig || {};
    const apiKey = String(config.deepseekApiKey || "").trim();
    const enabled = config.enableBrowserDirect !== false;
    return {
      apiKey: enabled ? apiKey : "",
      endpoint: config.deepseekEndpoint || "https://api.deepseek.com/chat/completions",
      model: config.deepseekModel || "deepseek-v4-flash",
    };
  }

  async function requestBrowserDeepseekReport(mode, config) {
    flowAiLoading = mode;
    renderMonth(lastData);
    try {
      const prompt = buildBrowserFlowAiPrompt(mode);
      const response = await fetch(config.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.apiKey}`,
        },
        body: JSON["stringify"]({
          model: config.model,
          messages: [
            { role: "system", content: `${prompt.system}\nDEEPSEEK_BROWSER_DIRECT：只输出合法 JSON 对象，不要输出 Markdown。` },
            { role: "user", content: prompt.user },
          ],
          response_format: { type: "json_object" },
        }),
      });
      const result = await response.json();
      const text = result.choices?.[0]?.message?.content || "";
      flowAiReports[mode] = normalizeFlowAiReport(JSON.parse(text), text, mode);
      setText("status", `${flowAiModeLabel(mode)}浏览器直连 DeepSeek 解读已生成。`);
    } catch (error) {
      flowAiReports[mode] = createLocalFlowAiReport(mode);
      setText("status", "浏览器直连 DeepSeek 未成功：已改用本地占位取象。");
    } finally {
      flowAiLoading = "";
      renderMonth(lastData);
    }
  }

  function buildBrowserFlowAiPrompt(mode) {
    const modeLabels = { luck: "大运阶段取象", year: "流年年度取象", month: "流月短期取象" };
    return {
      system: [
        "你是命理结构化学习网站的 AI 辅助取象层。",
        "不能重新排盘，不能补充不存在的干支关系，不能自行改写年份月份。",
        "只能根据本地页面传入的 chart、coreSignals、transitSignals、monthSignals 和当前岁运选择来润色。",
        "禁止确定性断语，不能断吉凶，不能把候选信号写成最终断命。",
        "所有输出都要保留“不能单独作为结论”的学习型边界。",
        "禁用词：一定、必定、绝对、必然、必离婚、必发财、必有灾、必坐牢、必死亡。",
        "输出 JSON 字段必须为 summary、keySignals、likelyThemes、cautions、verificationLimits。",
      ].join("\n"),
      user: JSON["stringify"]({
        mode,
        modeLabel: modeLabels[mode] || modeLabels.year,
        chart: lastData.chart,
        coreSignals: lastData.coreSignals,
        transitSignals: lastData.transitSignals,
        monthSignals: lastData.monthSignals,
        selectedLuck: lastData.selectedLuck,
        yearInfluence: lastData.yearInfluence,
        selectedMonthInfluence: lastData.selectedMonthInfluence,
        output: {
          schema: "summary/keySignals/likelyThemes/cautions/verificationLimits",
          style: "像老师点重点，但必须写成候选信号和观察建议。",
        },
      }, null, 2),
    };
  }

  function normalizeFlowAiReport(report, text, mode) {
    const fallback = {
      summary: text || `${flowAiModeLabel(mode)}报告暂未生成，请先查看本地专业矩阵。`,
      keySignals: ["以当前大运、流年、流月矩阵里的触发点为依据。"],
      likelyThemes: ["可观察现实事务、关系互动、情绪节奏和执行压力的变化。"],
      cautions: ["AI辅助只做白话整理，不重新排盘，也不补充不存在的干支关系。"],
      verificationLimits: ["这些内容不能单独作为结论，仍需结合原局和现实反馈验证。"],
    };
    if (!report) return fallback;
    return {
      summary: report.summary || fallback.summary,
      keySignals: Array.isArray(report.keySignals) ? report.keySignals : fallback.keySignals,
      likelyThemes: Array.isArray(report.likelyThemes) ? report.likelyThemes : fallback.likelyThemes,
      cautions: Array.isArray(report.cautions) ? report.cautions : fallback.cautions,
      verificationLimits: Array.isArray(report.verificationLimits) ? report.verificationLimits : fallback.verificationLimits,
    };
  }

  function createLocalFlowAiReport(mode) {
    const label = flowAiModeLabel(mode);
    return {
      summary: `${label}本地辅助报告：当前只根据页面已有矩阵证据整理候选取象，不能单独作为结论。`,
      keySignals: [`重点看${label}层级里五行、十神、干支关系是否被触发。`, "所有内容都来自本地排盘和专业速览矩阵。"],
      likelyThemes: ["现实事务、关系互动、工作节奏、情绪状态可作为观察方向。"],
      cautions: ["这里不重新排盘，也不补充页面没有列出的干支关系。", "若要使用真正 AI 润色，需要通过后端服务打开页面。"],
      verificationLimits: ["仍需结合原局、大运、流年、流月和实际经历继续验证。"],
    };
  }

  function bindFlowAiButtons() {
    document.querySelectorAll("[data-ai-mode]").forEach(button => button.addEventListener("click", () => requestFlowAiReport(button.dataset.aiMode)));
  }

  function resetFlowAiReports() {
    flowAiReports = { luck: null, year: null, month: null };
    flowAiLoading = "";
  }

  function renderTransitSignals(transitSignals) {
    const total = transitSignals.groups.reduce((sum, group) => sum + group.signals.length, 0);
    return `<section class="data-board transit-signal-board"><div class="board-title"><h3>3. 大运流年取象</h3><span>${total} 条</span></div><p class="fine-print">以下只列出大运、流年与原局之间的触发观察点，不单独作为事件结论。</p>${renderFlowAiControls(["luck", "year"])}${renderFlowSignalMatrix("岁运专业速览", transitSignals.groups)}</section>`;
  }

  function renderMonthSignals(monthSignals) {
    const total = monthSignals.groups.reduce((sum, group) => sum + group.signals.length, 0);
    return `<section class="data-board month-signal-board"><div class="board-title"><h3>5. 流月取象</h3><span>${total} 条</span></div><p class="fine-print">以下只列出当前流月的触发观察点，用于细化时间窗口。</p>${renderFlowAiControls(["month"])}${renderFlowSignalMatrix("流月专业速览", monthSignals.groups)}</section>`;
  }

  function renderFlowSignalMatrix(title, groups) {
    return `<section class="reading-panel"><div class="board-title"><h3>${title}</h3><span>${groups.reduce((sum, group) => sum + group.signals.length, 0)} 条</span></div><div class="flow-signal-matrix"><table><thead><tr><th>分组</th><th>观察点</th><th>类型</th><th>原始依据</th><th>取象关键词</th><th>展开解释</th></tr></thead><tbody>${groups.map(group => group.signals.map(signal => renderFlowSignalRow(signal, group.title)).join("")).join("")}</tbody></table></div></section>`;
  }

  function renderFlowSignalRow(signal, groupTitle) {
    return `<tr class="flow-signal-row"><td data-label="分组">${signal.group || groupTitle}</td><td data-label="观察点"><strong>${signal.title}</strong></td><td data-label="类型"><span class="badge">${signal.tag}</span></td><td data-label="原始依据">${signal.evidence}</td><td data-label="取象关键词">${signal.keywords}</td><td data-label="展开解释"><details class="inline-reading"><summary>展开</summary><dl><dt>白话取象</dt><dd>${signal.plainReading}</dd><dt>现实表现</dt><dd>${signal.realLifeMeaning}</dd><dt>判断限制</dt><dd>${signal.caution}</dd></dl></details></td></tr>`;
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
    document.querySelectorAll("[data-year]").forEach(b => b.addEventListener("click", () => { resetFlowAiReports(); state.targetYear = Number(b.dataset.year); state.selectedMonth = 1; refresh(); }));
    document.querySelectorAll("[data-month]").forEach(b => b.addEventListener("click", () => { resetFlowAiReports(); state.selectedMonth = Number(b.dataset.month); refresh(); }));
    document.querySelectorAll("[data-luck-index]").forEach(b => b.addEventListener("click", () => { resetFlowAiReports(); const p = luck.pillars[Number(b.dataset.luckIndex)]; state.selectedLuckIndex = p.index - 1; state.targetYear = p.startYear; state.selectedMonth = 1; refresh(); }));
    bindFlowAiButtons();
  }

  function renderNarrative(data) { byId("aiNarrative").innerHTML = `<h2>模型叙事层</h2><article class="narrative"><strong>${providerLabel(data.narrative.provider)}</strong><p>${escapeHtml(data.narrative.text)}</p></article>`; }

  function noteChatContextChanged() {
    chatState.contextVersion += 1;
    if (chatState.messages.length > 1) {
      chatState.messages.push({ role: "system", content: "当前排盘上下文已更新，后续问题会按新的大运、流年、流月回答。", complete: true });
    }
    renderChatWidget();
  }

  function renderChatWidget() {
    let root = byId("aiChatWidget");
    if (!root) {
      document.body.insertAdjacentHTML("beforeend", `<aside id="aiChatWidget" class="chat-widget" aria-label="AI问答"></aside>`);
      root = byId("aiChatWidget");
    }
    const messageHtml = chatState.messages.map((message, index) => renderChatMessage(message, index)).join("");
    root.classList.toggle("is-open", chatState.open);
    root.innerHTML = `
      <button type="button" class="chat-toggle" aria-expanded="${chatState.open ? "true" : "false"}">
        <span>问</span><strong>AI问答</strong>
      </button>
      <section class="chat-window" ${chatState.open ? "" : "hidden"}>
        <header class="chat-head">
          <div><span>学习问答</span><strong>通用 AI 助手</strong></div>
          <button type="button" class="chat-close" aria-label="收起AI问答">×</button>
        </header>
        <div class="chat-messages" role="log" aria-live="polite">${messageHtml}</div>
        <form class="chat-composer">
          <textarea name="chatQuestion" rows="2" maxlength="300" placeholder="可以问命盘，也可以问代码、学习、生活等任何问题..." ${chatState.loading ? "disabled" : ""}></textarea>
          <button type="submit" ${chatState.loading ? "disabled" : ""}>${chatState.loading ? "回答中" : "发送"}</button>
        </form>
      </section>
    `;
    root.querySelector(".chat-toggle")?.addEventListener("click", () => {
      chatState.open = !chatState.open;
      renderChatWidget();
    });
    root.querySelector(".chat-close")?.addEventListener("click", () => {
      chatState.open = false;
      renderChatWidget();
    });
    root.querySelector(".chat-composer")?.addEventListener("submit", event => {
      event.preventDefault();
      const textarea = event.currentTarget.elements.chatQuestion;
      sendChatQuestion(textarea.value);
    });
    const messages = root.querySelector(".chat-messages");
    if (messages) messages.scrollTop = messages.scrollHeight;
  }

  function renderChatMessage(message, index) {
    const role = message.role === "user" ? "user" : message.role === "system" ? "system" : "assistant";
    const label = role === "user" ? "你" : role === "system" ? "提示" : "AI";
    return `<article class="chat-message ${role}" data-chat-index="${index}"><span>${label}</span><p>${escapeHtml(message.content)}${message.complete === false ? '<i class="typing-caret"></i>' : ""}</p></article>`;
  }

  async function sendChatQuestion(question) {
    const text = String(question || "").trim();
    if (!text || chatState.loading) return;
    chatState.open = true;
    chatState.loading = true;
    chatState.messages.push({ role: "user", content: text, complete: true });
    const assistantMessage = { role: "assistant", content: "", complete: false };
    chatState.messages.push(assistantMessage);
    renderChatWidget();
    try {
      const result = await requestChatAnswer(text);
      typeChatAnswer(assistantMessage, sanitizeChatAnswer(result.text || createLocalChatAnswer(text)));
    } catch (error) {
      typeChatAnswer(assistantMessage, createLocalChatAnswer(text));
      setText("status", "AI问答暂不可用：已返回本地学习型回答。");
    } finally {
      chatState.loading = false;
      renderChatWidget();
    }
  }

  async function requestChatAnswer(question) {
    const context = buildChatContext();
    const history = chatState.messages.filter(message => message.role === "user" || message.role === "assistant").slice(-10);
    const browserConfig = getBrowserDeepseekConfig();
    if (location.protocol === "file:") {
      if (browserConfig.apiKey) return requestBrowserDeepseekChat(question, history, context, browserConfig);
      return { provider: "local-chat", text: createLocalChatAnswer(question) };
    }
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON["stringify"]({
        question,
        history,
        state,
        context,
        mode: "auto",
        contextMode: "optional-reference",
      }),
    });
    if (!response.ok) throw new Error(`chat failed ${response.status}`);
    return response.json();
  }

  async function requestBrowserDeepseekChat(question, history, context, config) {
    const prompt = buildBrowserChatPrompt(question, history, context);
    const response = await fetch(config.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON["stringify"]({
        model: config.model,
        messages: [
          { role: "system", content: `${prompt.system}\nDEEPSEEK_BROWSER_DIRECT_CHAT：不要输出配置、key 或调试信息。` },
          { role: "user", content: prompt.user },
        ],
      }),
    });
    const result = await response.json();
    return { provider: "deepseek-browser", text: result.choices?.[0]?.message?.content || createLocalChatAnswer(question) };
  }

  function buildBrowserChatPrompt(question, history, context) {
    return {
      system: [
        "你是一个通用 AI 助手，同时也可以参考当前八字排盘页面。",
        "用户可以问任何合理问题，不要把回答限制在网页内容、命盘内容、数据库内容或当前页面内容内。",
        "当前页面传入的 chart、coreSignals、transitSignals、monthSignals、storyTags 和岁运选择只是可选参考，不是唯一依据。",
        "如果用户问题与八字、命盘、流年、流月、当前页面有关，可以结合页面上下文回答。",
        "如果用户问题与当前页面无关，请直接按通用 AI 正常回答，不要说只能基于页面内容回答。",
        "不要重新排盘，除非用户明确要求重新排盘并提供出生信息。",
        "涉及命理判断时，请保留学习、观察、验证边界；涉及普通知识、代码、学习、生活问题时，按正常 AI 助手回答。",
        `命理类高风险断语尽量避免：${chatForbiddenWords.join("、")}`,
        "回答要自然、清楚、直接。不要输出 API key、配置字段或调试信息。",
      ].join("\n"),
      user: JSON["stringify"]({
        question,
        recentHistory: history.map(item => ({ role: item.role, content: item.content })).slice(-8),
        currentSelection: {
          targetYear: state.targetYear,
          selectedMonth: state.selectedMonth,
          selectedLuck: context.selectedLuck?.label,
        },
        context,
      }, null, 2),
    };
  }

  function buildChatContext() {
    if (!lastData) return {};
    return {
      chart: lastData.chart,
      coreSignals: lastData.coreSignals,
      transitSignals: lastData.transitSignals,
      monthSignals: lastData.monthSignals,
      selectedLuck: lastData.selectedLuck,
      yearInfluence: lastData.yearInfluence,
      selectedMonthInfluence: lastData.selectedMonthInfluence,
      storyTags: lastData.storyTags,
    };
  }

  function typeChatAnswer(message, fullText) {
    if (chatTypingTimer) window.clearInterval(chatTypingTimer);
    const chars = Array.from(fullText);
    let index = 0;
    message.content = "";
    message.complete = false;
    renderChatWidget();
    chatTypingTimer = window.setInterval(() => {
      index += 2;
      message.content = chars.slice(0, index).join("");
      const node = document.querySelector(`[data-chat-index="${chatState.messages.indexOf(message)}"] p`);
      if (node) node.innerHTML = `${escapeHtml(message.content)}<i class="typing-caret"></i>`;
      if (index >= chars.length) {
        window.clearInterval(chatTypingTimer);
        chatTypingTimer = null;
        message.content = fullText;
        message.complete = true;
        renderChatWidget();
      }
    }, 24);
  }

  function sanitizeChatAnswer(text) {
    return chatForbiddenWords.reduce((value, word) => value.split(word).join("需验证"), String(text || "").trim());
  }

  function createLocalChatAnswer(question) {
    const context = buildChatContext();
    const tags = (context.storyTags || []).slice(0, 3).map(tag => tag.tag).filter(Boolean);
    const focus = [context.yearInfluence?.year ? `${context.yearInfluence.year}年` : "", context.selectedMonthInfluence?.month ? `${context.selectedMonthInfluence.month}月` : "", ...tags].filter(Boolean).join("、") || "当前页面列出的排盘证据";
    const topic = question ? `关于“${String(question).slice(0, 80)}”，` : "";
    return `${topic}可以先从${focus}作为候选信号观察。当前回答只整理页面已有证据，传统命理中可作为观察点，仍需要结合柱位、旺衰、十神、岁运和现实反馈继续验证，不能单独作为结论。`;
  }

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
  function buildTransitSignals(chart, selectedLuck, yearInfluence) { const yearPillar = yearInfluence.pillar, luckTenGods = { stem: getTenGod(chart.dayMaster.stem, selectedLuck.stem), branch: getTenGod(chart.dayMaster.stem, branchMainStem(selectedLuck.branch)) }; return { engine: "transitSignalEngine", groups: [{ key: "luck-year", title: "大运与流年", signals: [generateLuckReading(selectedLuck, luckTenGods), generateYearReading(yearInfluence), generateTransitLayerReading(selectedLuck, yearInfluence)] }, { key: "triggers", title: "十神与五行触发", signals: [...generateTransitTenGodReadings(selectedLuck, yearInfluence, luckTenGods), ...generateTransitElementReadings(selectedLuck, yearPillar)] }, { key: "relations", title: "关系与原局触发", signals: [...generateTransitRelationReadings(chart, selectedLuck, yearPillar), ...generateTransitCoreHitReadings(chart, selectedLuck, yearPillar)] }] }; }
  function generateLuckReading(selectedLuck, luckTenGods) { return makeCoreReading("大运流年", `${selectedLuck.label}大运`, "关键结构", `大运${selectedLuck.label}，${selectedLuck.startYear}-${selectedLuck.endYear}年，${selectedLuck.startAge}-${selectedLuck.endAge}岁`, `大运阶段背景 / ${selectedLuck.label} / ${luckTenGods.stem}、${luckTenGods.branch}`, `大运是十年阶段背景，先看它带来的五行、十神和地支环境。${selectedLuck.label}大运天干为${luckTenGods.stem}，地支主气为${luckTenGods.branch}。`, "现实中可作为阶段性主题、资源环境、压力来源或行为方式变化的观察入口。", "大运不是单独结论，需要与原局、流年、流月叠加验证。"); }
  function generateYearReading(yearInfluence) { return makeCoreReading("大运流年", `${yearInfluence.year}年${yearInfluence.pillar.label}`, "关键结构", `流年${yearInfluence.pillar.label}，天干${yearInfluence.tenGods.stem}，地支主气${yearInfluence.tenGods.branch}`, `流年年度触发 / ${yearInfluence.pillar.label} / ${yearInfluence.tenGods.stem}、${yearInfluence.tenGods.branch}`, `流年是年度触发层，用来看这一年哪些五行、十神、干支关系被带到台前。`, "现实中可观察年度关注点、外部变化、事务触发和某些原局象被引动的机会。", "流年只是一年触发，不等于事件结果，需要结合大运背景、原局结构和流月细化。"); }
  function generateTransitLayerReading(selectedLuck, yearInfluence) { return makeCoreReading("大运流年", "岁运并看", "需验证", `${selectedLuck.label}大运 + ${yearInfluence.year}年${yearInfluence.pillar.label}流年`, `阶段背景 + 年度触发 / 层级叠加`, "岁运并看是先看大运的阶段气候，再看流年把哪些主题推到当年。", "现实中常体现为阶段主题遇到年度节点，某些学习、关系、资源、规则或表达议题更容易被看见。", "岁运并看只提示触发层级，需要结合原局取象和流月继续验证。"); }
  function generateTransitTenGodReadings(selectedLuck, yearInfluence, luckTenGods) { return [makeCoreReading("十神触发", "大运十神", "可取象", `${selectedLuck.label}大运：天干${luckTenGods.stem}，地支主气${luckTenGods.branch}`, `大运十神 / ${luckTenGods.stem}、${luckTenGods.branch}`, `大运十神用于看十年阶段里更常被带出的主题。`, "可对应学习吸收、表达输出、资源责任、规则压力、自我同辈等现实面向的阶段性变化。", "大运十神仍需结合原局有无承接、月令力量和流年触发。"), makeCoreReading("十神触发", "流年十神", "可取象", `${yearInfluence.year}年${yearInfluence.pillar.label}：天干${yearInfluence.tenGods.stem}，地支主气${yearInfluence.tenGods.branch}`, `流年十神 / ${yearInfluence.tenGods.stem}、${yearInfluence.tenGods.branch}`, `流年十神用于看当年更容易出现的行为入口和事务类型。`, "现实中可观察当年学习、表达、资源、规则、人际竞争等主题是否被放大。", "流年十神不能直接断结果，要看是否与原局和大运形成承接或冲突。")]; }
  function generateTransitElementReadings(selectedLuck, yearPillar) { return [makeCoreReading("五行触发", "大运五行", "可取象", `${selectedLuck.label}大运：天干${elementLabels[selectedLuck.stemElement]}，地支${elementLabels[selectedLuck.branchElement]}`, `大运五行 / ${elementLabels[selectedLuck.stemElement]}、${elementLabels[selectedLuck.branchElement]}`, "大运五行用于看阶段气候偏向哪些属性。", "现实中可观察相关属性在十年阶段是否更容易出现，比如规划、表达、承载、规则或流动。", "五行触发不等于喜忌，需要回到原局强弱和月令判断。"), makeCoreReading("五行触发", "流年五行", "可取象", `${yearPillar.label}流年：天干${elementLabels[yearPillar.stemElement]}，地支${elementLabels[yearPillar.branchElement]}`, `流年五行 / ${elementLabels[yearPillar.stemElement]}、${elementLabels[yearPillar.branchElement]}`, "流年五行用于看当年被带出的属性偏性。", "现实中可观察当年某类行动、表达、责任、规则或信息变化是否更显眼。", "流年五行也不能直接当作喜忌，要结合大运和原局判断。")]; }
  function generateTransitRelationReadings(chart, selectedLuck, yearPillar) { const rows = [], natal = Object.values(chart.pillars), collect = (sourceName, sourcePillar, targetName, targetPillar) => comboRules.forEach(([type, members, effect]) => { if (samePair(members, [sourcePillar.stem, targetPillar.stem]) || samePair(members, [sourcePillar.branch, targetPillar.branch])) rows.push(makeFlowRelationReading("关系触发", `${sourceName}${type}`, `${sourceName}${sourcePillar.label} 与 ${targetName}${targetPillar.label} 命中${members.join("、")}`, `${sourceName}-${targetName} / ${members.join("")} / ${effect}`, type, members, effect)); }); natal.forEach(p => { collect("大运", selectedLuck, p.role, p); collect("流年", yearPillar, p.role, p); }); collect("大运", selectedLuck, "流年", yearPillar); return rows.length ? rows : [makeCoreReading("关系触发", "关系触发未命中", "基础依据", "当前大运、流年与原局未命中已启用的合冲规则", "未命中 / 不强行取象", "当前启用规则下，岁运与原局没有额外列出合冲害候选点。", "现实中仍可从十神、五行和柱位层级观察，不必强行找关系象。", "未命中不代表没有细节，后续可扩展更多刑害破会规则。")]; }
  function generateTransitCoreHitReadings(chart, selectedLuck, yearPillar) { const hits = Object.values(chart.pillars).flatMap(p => { const list = []; if (p.stem === selectedLuck.stem || p.branch === selectedLuck.branch) list.push(makeCoreReading("原局触发", `大运触发${p.role}`, "需验证", `${selectedLuck.label}大运与${p.role}${p.label}出现同干或同支`, `大运触发 / ${p.role} / 同象`, "大运与原局同干或同支，传统命理中可作为同象被阶段性带出的候选信号。", "现实中可观察该柱代表的主题在此阶段是否更容易反复出现或被强调。", "同象触发需要结合柱位含义、原局强弱和流年流月是否继续引动。")); if (p.stem === yearPillar.stem || p.branch === yearPillar.branch) list.push(makeCoreReading("原局触发", `流年触发${p.role}`, "需验证", `${yearPillar.label}流年与${p.role}${p.label}出现同干或同支`, `流年触发 / ${p.role} / 同象`, "流年与原局同干或同支，传统命理中可作为年度触发候选信号。", "现实中可观察该柱主题在当年是否更容易被看见、重提或形成节点。", "流年同象不能直接断事件，需要结合大运和流月窗口验证。")); return list; }); return hits.length ? hits : [makeCoreReading("原局触发", "原局同象触发未命中", "基础依据", "当前大运、流年与原局四柱未出现同干或同支", "未命中 / 不强行取象", "当前岁运没有命中同干同支触发点。", "现实观察可转向五行十神和关系触发，不必强行解读同象。", "未命中同象不代表岁运无作用。")]; }
  function buildMonthSignals(chart, selectedLuck, yearInfluence, selectedMonthInfluence) { const monthPillar = selectedMonthInfluence.pillar, yearPillar = yearInfluence.pillar; return { engine: "transitSignalEngine", groups: [{ key: "month-main", title: "流月本身", signals: [generateMonthWindowReading(selectedMonthInfluence), generateMonthLayerReading(selectedLuck, yearInfluence, selectedMonthInfluence)] }, { key: "month-triggers", title: "流月十神与五行", signals: [generateMonthTenGodReading(selectedMonthInfluence), generateMonthElementReading(monthPillar)] }, { key: "month-relations", title: "流月关系触发", signals: [...generateMonthRelationReadings(chart, selectedLuck, yearPillar, monthPillar), ...generateMonthCoreHitReadings(chart, monthPillar)] }] }; }
  function generateMonthWindowReading(selectedMonthInfluence) { const p = selectedMonthInfluence.pillar; return makeCoreReading("流月本身", `${selectedMonthInfluence.month}月${p.label}`, "关键结构", `流月${p.label}，天干${selectedMonthInfluence.tenGods.stem}，地支主气${selectedMonthInfluence.tenGods.branch}`, `流月短期窗口 / ${selectedMonthInfluence.role} / ${p.label}`, "流月是短期窗口，用来观察当月哪些岁运主题被放大、收束或具体化。", "现实中可对应某个月份里的执行节奏、事务推进、情绪热度和触发节点。", "流月只用于细化时间窗口，需要结合原局、大运、流年共同观察。"); }
  function generateMonthLayerReading(selectedLuck, yearInfluence, selectedMonthInfluence) { return makeCoreReading("流月本身", "大运流年流月并看", "需验证", `${selectedLuck.label}大运 + ${yearInfluence.year}年${yearInfluence.pillar.label}流年 + ${selectedMonthInfluence.month}月${selectedMonthInfluence.pillar.label}流月`, `三层叠加 / 阶段-年度-月份`, "流月放在大运和流年之下看，是短期触发层，不单独承担全部判断。", "现实中可观察阶段主题在某一年、某一月是否出现更明确的动作或反馈。", "三层并看仍需要结合原局结构，不能只凭流月单断。"); }
  function generateMonthTenGodReading(selectedMonthInfluence) { return makeCoreReading("流月触发", "流月十神", "可取象", `${selectedMonthInfluence.month}月${selectedMonthInfluence.pillar.label}：天干${selectedMonthInfluence.tenGods.stem}，地支主气${selectedMonthInfluence.tenGods.branch}`, `流月十神 / ${selectedMonthInfluence.tenGods.stem}、${selectedMonthInfluence.tenGods.branch}`, "流月十神用于看当月更容易被触发的行为入口和事务类型。", "现实中可观察当月学习、表达、资源、规则、人际竞争等主题是否更集中。", "流月十神是短期信号，必须放在流年和大运背景下看。"); }
  function generateMonthElementReading(monthPillar) { return makeCoreReading("流月触发", "流月五行", "可取象", `${monthPillar.label}流月：天干${elementLabels[monthPillar.stemElement]}，地支${elementLabels[monthPillar.branchElement]}`, `流月五行 / ${elementLabels[monthPillar.stemElement]}、${elementLabels[monthPillar.branchElement]}`, "流月五行用于看当月气机偏向哪类属性。", "现实中可观察当月某类规划、表达、承载、规则或信息变化是否更明显。", "流月五行不等于喜忌，也不等于结果，需要结合原局和岁运层级。"); }
  function generateMonthRelationReadings(chart, selectedLuck, yearPillar, monthPillar) { const rows = [], collect = (targetName, targetPillar) => comboRules.forEach(([type, members, effect]) => { if (samePair(members, [monthPillar.stem, targetPillar.stem]) || samePair(members, [monthPillar.branch, targetPillar.branch])) rows.push(makeFlowRelationReading("流月关系", `流月${type}`, `流月${monthPillar.label} 与 ${targetName}${targetPillar.label} 命中${members.join("、")}`, `流月-${targetName} / ${members.join("")} / ${effect}`, type, members, effect)); }); Object.values(chart.pillars).forEach(p => collect(p.role, p)); collect("大运", selectedLuck); collect("流年", yearPillar); return rows.length ? rows : [makeCoreReading("流月关系", "流月关系触发未命中", "基础依据", "当前流月与原局、大运、流年未命中已启用的合冲规则", "未命中 / 不强行取象", "当前启用规则下，流月没有额外列出合冲害候选点。", "现实中仍可从流月十神、五行和当前月份角色观察。", "未命中规则不代表月份无作用。")]; }
  function generateMonthCoreHitReadings(chart, monthPillar) { const hits = Object.values(chart.pillars).flatMap(p => { const list = []; if (p.stem === monthPillar.stem) list.push(makeCoreReading("流月原局", `流月同干触发${p.role}`, "需验证", `流月${monthPillar.label}与${p.role}${p.label}出现同干`, `流月同干 / ${p.role}`, "流月同干可作为当月把某个原局天干主题带到台前的候选信号。", "现实中可观察该柱主题是否在当月更容易出现动作、沟通或反馈。", "同干触发需要结合大运流年和该柱在原局中的位置。")); if (p.branch === monthPillar.branch) list.push(makeCoreReading("流月原局", `流月同支触发${p.role}`, "需验证", `流月${monthPillar.label}与${p.role}${p.label}出现同支`, `流月同支 / ${p.role}`, "流月同支可作为当月把某个原局地支环境带出的候选信号。", "现实中可观察该柱相关环境、关系或事务是否在当月更容易被触发。", "同支触发需要结合大运流年和冲合刑害等关系继续验证。")); return list; }); return hits.length ? hits : [makeCoreReading("流月原局", "流月原局同象未命中", "基础依据", "当前流月与原局四柱未出现同干或同支", "未命中 / 不强行取象", "当前流月没有命中原局同干同支触发点。", "现实观察可转向流月五行十神和关系触发。", "未命中同象不代表该月无观察价值。")]; }
  function buildCoreSignals(chart) { return { engine: "coreSignalsEngine", overview: generateOverallReading(chart), groups: [{ key: "core", title: "核心", signals: [generateDayMasterReading(chart), generateMonthCommandReading(chart)] }, { key: "elements-ten-gods", title: "五行十神", signals: [...generateElementReading(chart), ...generateTenGodReading(chart)] }, { key: "rooting-relations", title: "根气关系", signals: [...generateRootingReadings(chart), ...generateStemBranchRelationReading(chart)] }, { key: "auxiliary", title: "辅助取象", signals: [...generateVoidReadings(chart), ...generateNayinReadings(chart), ...generateGrowthReadings(chart), ...generateAuxiliaryReadings(chart), generateCautionReading(chart)] }], professional: generateProfessionalEvidence(chart) }; }
  function makeCoreReading(group, title, tag, evidence, keywords, plainReading, realLifeMeaning, caution) { return { group, title, tag, evidence, keywords, plainReading, realLifeMeaning, caution }; }
  function generateDayMasterReading(chart) { const stem = chart.pillars.day.stem, element = elementLabels[chart.dayMaster.element], nature = stemNature(stem); return makeCoreReading("核心", `${stem}${element}日主`, "基础依据", `日干${stem}，五行${element}`, `${stem}${element} / ${elementAttributes[chart.dayMaster.element]} / 日主`, `${stem}${element}${nature.image}，传统取象可看成长、方向感、处事方式和自我表达的底色。`, nature.life, `${stem}${element}只是入口，日主强弱还要结合月令、根气、水火配合和十神组合判断。`); }
  function generateMonthCommandReading(chart) { const branch = chart.pillars.month.branch, info = monthCommandInfo(branch), dayStem = chart.pillars.day.stem, monthElement = elementLabels[chart.pillars.month.branchElement]; return makeCoreReading("核心", `月令${branch}`, "关键结构", `月柱${chart.pillars.month.label}，月令${branch}`, `${branch}月 / ${monthElement}气 / 出生环境`, `月令代表出生环境、季节力量、命局大气候。${branch}月${info.season}，对${dayStem}日主来说，环境底色带有${info.image}。`, `${info.life}这不是普通地支说明，而是在看命局最先受到哪类气候和现实环境塑形。`, "月令影响很大，但仍需结合透干、藏干、根气、五行数量和岁运触发一起看。"); }
  function generateElementReading(chart) { const visible = chart.elementStats.visible.counts, hidden = chart.elementStats.hidden.counts, monthElement = elementLabels[chart.pillars.month.branchElement]; return [makeCoreReading("五行十神", "明面五行偏性", "可取象", elementCountText(visible), `${topElementsText(visible)}突出 / ${weakElementText(visible).replace("在明面", "")}`, `明面数量里，${dominantElementText(visible)}；${weakElementText(visible)}。这可以用来观察外显结构，但五行数量不等于喜忌。`, "数量明显的五行，常对应相关属性更容易被看见；数量少或未显的五行，相关表达可能不在表层。", `月令会修正数量判断，例如月令属${monthElement}时，即使${monthElement}数量不多，也不能简单视为弱。`), makeCoreReading("五行十神", "藏干五行偏性", "可取象", elementCountText(hidden), `${topElementsText(hidden)}根气 / ${zeroElementsText(hidden)}`, `藏干数量里，${dominantElementText(hidden)}；${weakElementText(hidden).replace("明面", "藏干")}。这更偏向内在根气和来源支撑。`, "藏干层面的五行不一定外露，但常用于观察某类属性是否有暗处来源或持续支撑。", "藏干统计仍需结合主气、中气、余气权重，以及月令和透干情况判断。")]; }
  function generateTenGodReading(chart) { const groups = tenGodGroupCounts(chart.tenGodStats.mainQi, chart.tenGodStats.fullHidden), top = topTenGodGroup(groups), low = lowTenGodGroup(groups); return [makeCoreReading("五行十神", "主气十神", "可取象", countText(chart.tenGodStats.mainQi), `${top.label}入口 / 学习表达资源规则关系`, `主气十神用于看表层更容易被看见的行为入口。${top.label}相对明显，可先看${top.meaning}。`, "十神可对应学习、表达、资源、规则、关系与自我驱动力，但只能描述结构倾向。", "主气统计不能直接推出富贵贫贱，也不能脱离日主强弱、月令和组合关系单看。"), makeCoreReading("五行十神", "完整藏干十神", "可取象", countText(chart.tenGodStats.fullHidden), `${top.label}来源 / ${low.label}待观察`, `完整藏干十神用于看内在来源。${low.label}不算外显，${low.meaning}相关面向需要结合柱位和岁运观察。`, "藏干十神能补充主气没有展示出的信息来源，但现实表现要看是否被透干、月令或岁运引动。", "完整藏干数量也不等于最终格局，需要回到月令、透干、根气和组合结构。")]; }
  function generateRootingReadings(chart) { return ["year", "month", "day", "hour"].map(key => { const d = chart.pillarDetails[key], hidden = d.hiddenStems.map(h => `${h.stem}${h.tenGod}${h.role}`).join("、") || "无"; return makeCoreReading("根气关系", `${d.label}${d.pillar.branch}藏干根气`, d.label === "月柱" ? "关键结构" : "基础依据", `${d.pillar.label}，地支${d.pillar.branch}藏干：${hidden}`, `${d.pillar.branch} / ${hidden}`, `藏干根气用来观察一个地支内部藏了哪些五行和十神来源。${d.label}${d.pillar.branch}的藏干为${hidden}。`, "现实表现上，它更像暗处资源、习惯底层或环境来源，不一定直接外显。", "根气轻重需要结合主气、中气、余气、月令和透干判断，不能只看是否出现。"); }); }
  function generateStemBranchRelationReading(chart) { if (!chart.relations.length) return [makeCoreReading("根气关系", "干支关系未命中", "基础依据", "当前启用规则未命中明显合冲害关系", "未命中 / 不强行取象", "这表示本轮基础规则下，原局没有额外列出合冲害候选点。", "页面会优先看日主、月令、五行和十神，不强行补充关系取象。", "未命中规则不代表没有细节，后续可结合更多刑害破会规则继续扩展。")]; return chart.relations.map(r => makeCoreReading("根气关系", `${r.type}${r.effect}`, "需验证", `${r.ganzhi.join(" / ")} 命中${r.members.join("、")}`, `${r.members.join("")} / ${r.effect} / 牵连`, relationReadingText(r), "合多看牵连与黏合，冲多看变化与拉扯，害多看隐性别扭或互动不顺，具体落点要回到柱位。", "所有合象都不能默认成化，是否成化需要看月令、透干、根气和整体力量。")); }
  function generateVoidReadings(chart) { return ["year", "month", "day", "hour"].map(key => { const d = chart.pillarDetails[key]; return makeCoreReading("辅助取象", `${d.label}旬空`, "不能单断", `${d.pillar.label}旬空：${d.voidBranches.join("、")}`, `${d.voidBranches.join("、")} / 空亡观察`, `旬空用于记录该柱所在旬的空亡地支，传统命理中可作为虚实、落空、等待验证的辅助观察点。`, "现实表现不宜直接套结论，可作为某类主题暂不稳定、需等触发的候选信号。", "空亡必须结合柱位、冲合填实和岁运触发，不能单独作为结论。"); }); }
  function generateNayinReadings(chart) { return ["year", "month", "day", "hour"].map(key => { const d = chart.pillarDetails[key]; return makeCoreReading("辅助取象", `${d.label}纳音`, "辅助取象", `${d.pillar.label}纳音：${d.nayin}`, `${d.nayin} / 辅助象`, `纳音提供另一套干支组合取象，可作为辅助意象保留。${d.label}${d.pillar.label}纳音为${d.nayin}。`, "现实表现更适合做意象补充，不应覆盖日主、月令、五行十神等主线。", "纳音不是本模块的主判断依据，不能单独作为结论。"); }); }
  function generateGrowthReadings(chart) { return ["year", "month", "day", "hour"].map(key => { const d = chart.pillarDetails[key]; return makeCoreReading("辅助取象", `${d.label}十二长生`, "辅助取象", `以${chart.pillars.day.stem}日主看${d.pillar.branch}为${d.twelveGrowth}`, `${d.pillar.branch} / ${d.twelveGrowth} / 气势阶段`, `十二长生用于观察日主五行在各地支中的气势阶段。${d.label}${d.pillar.branch}对应${d.twelveGrowth}。`, "现实表现可作为某类力量处在启动、旺盛、收束或储藏阶段的候选象。", "十二长生要配合月令、根气和透干使用，不单独断强弱。"); }); }
  function generateAuxiliaryReadings(chart) { return [chart.auxiliary.fetalOrigin, chart.auxiliary.lifePalace, chart.auxiliary.bodyPalace].map(p => makeCoreReading("辅助取象", `${p.role}${p.label}`, "辅助取象", `${p.role}${p.label}，${p.meta.method}`, `${p.role} / ${p.label}`, `${p.role}属于辅助宫位取象，用于保留传统排盘里的旁支观察入口。`, "现实表现上只适合辅助理解命盘侧面，不宜压过四柱主线。", "胎元、命宫、身宫需要保留复核口径，本版本只作为学习观察点。")); }
  function generateCautionReading(chart) { return makeCoreReading("辅助取象", "取象边界", "不能单断", chart.meta.needVerify.join("；"), "学习观察 / 不作最终断命", "本区只整理原局候选信号，把可观察的象列出来，方便后续验证。", "现实表现需要回到具体柱位、组合、岁运和实际反馈，不适合从单项数据直接下判断。", "基础取象不等于最终断命，后续仍需结合月令旺衰、日主强弱、十神组合、合冲刑害、大运流年综合分析。"); }
  function generateOverallReading(chart) { const day = `${chart.pillars.day.stem}${elementLabels[chart.dayMaster.element]}`, month = chart.pillars.month.branch, visible = chart.elementStats.visible.counts, topElements = topElementsText(visible), zero = zeroElementsText(visible), weakPhrase = zero === "没有明显空缺项" ? "明面五行没有明显空缺项" : `${zero}不在明面`, ten = topTenGodGroup(tenGodGroupCounts(chart.tenGodStats.mainQi, chart.tenGodStats.fullHidden)); return `此命局日主为${day}，生于${month}月，整体呈现“${topElements}较明显，${weakPhrase}”的结构。${ten.label}较容易成为观察入口，现实中可先看${ten.meaning}；但这只是基础取象，不直接断吉凶。`; }
  function generateProfessionalEvidence(chart) { return [{ label: "日主", value: `${chart.pillars.day.stem}（${elementLabels[chart.dayMaster.element]}）`, note: "日干为命局观察中心" }, { label: "月令", value: `${chart.pillars.month.branch}（${elementLabels[chart.pillars.month.branchElement]}）`, note: "出生季节与命局大气候" }, { label: "明面五行", value: elementCountText(chart.elementStats.visible.counts), note: "天干与地支本气统计" }, { label: "藏干五行", value: elementCountText(chart.elementStats.hidden.counts), note: "四个地支完整藏干统计" }, { label: "主气十神", value: countText(chart.tenGodStats.mainQi), note: "天干与地支主气口径" }, { label: "完整藏干十神", value: countText(chart.tenGodStats.fullHidden), note: "藏干全部纳入统计" }, { label: "干支关系", value: chart.relations.length ? chart.relations.map(r => `${r.ganzhi.join("/")} ${r.type}${r.effect}`).join("；") : "未命中", note: "这里只列依据，不作为最终结论" }]; }
  function stemNature(stem) { return { 甲: { image: "像大树，重在向上生发、立方向、成体系", life: "容易重视长期规划、原则和成长路径，也可能比较坚持自己的判断。" }, 乙: { image: "像花草藤蔓，重在柔韧、适应、细腻生长", life: "容易重视关系中的弹性、审美和环境适应，也可能绕着现实条件寻找出路。" }, 丙: { image: "像太阳，重在照见、热度、外放表达", life: "容易在表达、带动气氛、公开呈现上有需求，也要看水金是否形成约束。" }, 丁: { image: "像灯火，重在专注、感受、细致照明", life: "容易重视灵感、温度和精细表达，也需要看木火是否有持续支撑。" }, 戊: { image: "像山岳厚土，重在承载、边界、稳定", life: "容易重视责任、秩序和现实承托，也可能显得慢热或守成。" }, 己: { image: "像田园湿土，重在吸收、整理、培育", life: "容易重视细节、服务和资源整合，也要避免过度包容导致压力累积。" }, 庚: { image: "像矿石刀斧，重在规则、决断、执行", life: "容易重视效率、标准和行动边界，也需要火来锻炼、水来润泽。" }, 辛: { image: "像珠玉精金，重在审美、标准、精细筛选", life: "容易重视品质、边界和专业标准，也可能对细节较敏感。" }, 壬: { image: "像江河大水，重在流动、信息、变化", life: "容易重视见识、流动性和系统理解，也需要土来定向、火来显化。" }, 癸: { image: "像雨露细水，重在感受、渗透、学习吸收", life: "容易重视观察、理解和细腻感受，也需要木火把吸收转成表达。" } }[stem] || { image: "可作为日主基础取象", life: "需要结合完整命盘继续观察。" }; }
  function monthCommandInfo(branch) { return { 子: { season: "冬水当令，水气明显", image: "信息、感受、流动和寒湿环境", life: "现实表现上常先看学习吸收、感受力、流动性和安全感。" }, 丑: { season: "寒土收束，水土夹杂", image: "积累、储藏、现实压力和慢性事务", life: "现实表现上常先看责任、耐心、资源沉淀和内在拉扯。" }, 寅: { season: "初春木气发动", image: "启动、规划、生长和方向感", life: "现实表现上常先看开端意识、成长欲和行动准备。" }, 卯: { season: "仲春木气舒展", image: "生发、条达、关系伸展", life: "现实表现上常先看成长、人际协调、审美和自我伸展。" }, 辰: { season: "湿土承接，木土水混杂", image: "转化、承载、资源整理", life: "现实表现上常先看现实责任、资源整合和阶段转换。" }, 巳: { season: "初夏火气升起", image: "表达、显化、技术和热度", life: "现实表现上常先看表达欲、行动热度、专业技能和外部呈现。" }, 午: { season: "盛夏火气明显", image: "曝光、热情、推动力", life: "现实表现上常先看表现欲、主动性、感染力和情绪热度。" }, 未: { season: "夏末燥土承火", image: "收纳、责任、现实承载", life: "现实表现上常先看责任感、稳定需求和现实任务。" }, 申: { season: "初秋金气起，水气也藏", image: "规则、技术、执行、信息流动", life: "现实表现上常先看标准、效率、专业训练和现实考核。" }, 酉: { season: "秋天金气较旺", image: "规则、标准、压力、技术、考核，也像修剪之力", life: "现实表现上常先看规则感、专业标准、证书技术、被环境打磨的体验。" }, 戌: { season: "秋末燥土藏火金", image: "收束、秩序、责任和旧事沉淀", life: "现实表现上常先看责任边界、规则收束和阶段复盘。" }, 亥: { season: "初冬水气起，木气暗藏", image: "学习、流动、远方信息和内在生机", life: "现实表现上常先看吸收力、感受力、流动变化和潜在成长。" } }[branch] || { season: "季节力量需要复核", image: "环境力量", life: "现实表现需要结合完整命盘观察。" }; }
  function elementCountText(counts) { return Object.entries(elementLabels).map(([k, label]) => `${label}${counts[k] || 0}`).join("、"); }
  function countText(counts) { const text = Object.entries(counts || {}).map(([k, v]) => `${k}${v}`).join("、"); return text || "暂无"; }
  function topElementsText(counts) { const max = Math.max(...Object.values(counts).map(Number)); return Object.entries(counts).filter(([, v]) => Number(v) === max && Number(v) > 0).slice(0, 2).map(([k]) => elementLabels[k]).join("、") || "五行"; }
  function zeroElementsText(counts) { const zero = Object.entries(counts).filter(([, v]) => Number(v) === 0).map(([k]) => elementLabels[k]); return zero.length ? `${zero.slice(0, 2).join("、")}` : "没有明显空缺项"; }
  function dominantElementText(counts) { const names = topElementsText(counts); return `${names}相对突出，可作为${names}相关属性的候选信号`; }
  function weakElementText(counts) { const zero = zeroElementsText(counts); return zero === "没有明显空缺项" ? "明面五行没有明显空缺项" : `${zero}在明面暂未出现，相关属性需要看藏干和岁运是否引动`; }
  function tenGodGroupCounts(mainQi, hidden) { const all = { ...mainQi }; Object.entries(hidden || {}).forEach(([k, v]) => all[k] = (all[k] || 0) + v); return [{ label: "印星", keys: ["正印", "偏印"], meaning: "学习、理解、信息吸收、依赖知识体系的倾向", count: sumKeys(all, ["正印", "偏印"]) }, { label: "食伤", keys: ["食神", "伤官"], meaning: "表达、输出、表现欲、创造和技术呈现", count: sumKeys(all, ["食神", "伤官"]) }, { label: "财星", keys: ["正财", "偏财"], meaning: "资源、金钱责任、现实事务和经营意识", count: sumKeys(all, ["正财", "偏财"]) }, { label: "官杀", keys: ["正官", "七杀"], meaning: "规则、压力、标准、考核和约束系统", count: sumKeys(all, ["正官", "七杀"]) }, { label: "比劫", keys: ["比肩", "劫财"], meaning: "自我、同辈、竞争、协作和主观驱动力", count: sumKeys(all, ["比肩", "劫财"]) }]; }
  function sumKeys(obj, keys) { return keys.reduce((sum, key) => sum + Number(obj[key] || 0), 0); }
  function topTenGodGroup(groups) { return [...groups].sort((a, b) => b.count - a.count)[0] || groups[0]; }
  function lowTenGodGroup(groups) { return [...groups].sort((a, b) => a.count - b.count)[0] || groups[0]; }
  function makeFlowRelationReading(group, title, evidence, keywords, type, members, effect) { const pair = members.join(""); if (type.includes("合")) return makeCoreReading(group, title, "需验证", evidence, keywords, `命局岁运见${pair}${type}，有合象、牵连、合绊之象，可能牵动${effect}。`, "现实中可观察相关柱位或层级之间是否出现黏连、协作、牵制或资源责任被带动。", "所有合象都不能默认成化，是否成化需要看月令、透干、根气和整体力量。"); if (type.includes("冲")) return makeCoreReading(group, title, "需验证", evidence, keywords, `命局岁运见${pair}${type}，有变化、拉扯、移动和触发之象。`, "现实中可观察相关主题是否出现变动、调整、冲突或需要重新安排。", "冲的轻重需要结合柱位、原局强弱、大运背景和流月是否继续触发。"); if (type.includes("害")) return makeCoreReading(group, title, "需验证", evidence, keywords, `命局岁运见${pair}${type}，有牵连、合绊、互动不顺之象。`, "现实中可观察相关主题是否出现隐性别扭、配合不畅或细节摩擦。", "害也不能单独断事，需要结合柱位和岁运层级验证。"); return makeCoreReading(group, title, "需验证", evidence, keywords, `命局岁运见${pair}${type}${effect}，可作为结构观察点。`, "现实中只作为触发线索，不直接当作结果。", "干支关系需要结合全局力量继续验证。"); }
  function relationReadingText(relation) { const pair = relation.members.join(""); if (relation.type.includes("合")) return `命局见${pair}${relation.type}，有合象、牵连、合绊之象，可能牵动${relation.effect}；是否成化需结合月令、透干、根气和整体力量判断`; if (relation.type.includes("冲")) return `命局见${pair}${relation.type}，有变化、拉扯、位置互动之象，轻重需看柱位和岁运触发`; if (relation.type.includes("害")) return `命局见${pair}${relation.type}，有牵连、合绊、互动不顺之象，具体表现需回到柱位`; return `命局见${pair}${relation.type}，可作为结构观察点`; }
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
  function renderElementBox(stat) { const max = Math.max(1, ...Object.values(stat.counts)); return `<article class="stats-box element-stats-box"><span>${stat.label}</span><strong>${stat.note}</strong><p class="element-summary">${elementSummaryText(stat.counts)}</p><p class="element-attribute">${elementAttributeText(stat.counts, stat.label)}</p><div class="element-count-grid">${Object.entries(elementLabels).map(([k, label]) => { const value = stat.counts[k]; const percent = Math.max(8, Math.round(value / max * 100)); return `<div class="element-card element-${k}" style="--value:${percent}%"><span>${label}</span><b>${value}</b><em class="element-bar"><mark style="width:${percent}%"></mark></em></div>`; }).join("")}</div></article>`; }
  function elementSummaryText(counts) { return `统计：${Object.entries(elementLabels).map(([k, label]) => `${label}${counts[k] || 0}`).join("、")}。`; }
  function elementAttributeText(counts, label) { const entries = Object.entries(elementLabels).map(([key, elementLabel]) => ({ key, label: elementLabel, value: Number(counts[key] || 0), attributes: elementAttributes[key] })); const max = Math.max(...entries.map(item => item.value)); const min = Math.min(...entries.map(item => item.value)); const prominent = entries.filter(item => item.value === max && item.value > 0).slice(0, 2); const zeroItems = entries.filter(item => item.value === 0); const weak = zeroItems.length ? zeroItems.slice(0, 2) : entries.filter(item => item.value === min && item.value < max).slice(0, 2); const lens = String(label).includes("藏干") ? "藏干层面" : "明面层面"; const role = String(label).includes("藏干") ? "内在根气、来源支撑" : "外显结构、表层呈现"; const prominentText = prominent.length ? `${formatElementNames(prominent)}相对突出，可作为${formatElementAttributes(prominent)}相关属性的候选信号` : "五行数量暂无明显突出项"; const weakText = weak.length ? `${formatElementNames(weak)}在${lens}${zeroItems.length ? "暂未出现" : "相对偏弱"}，${formatElementAttributes(weak)}相关属性需要结合柱位、旺衰、十神和岁运继续观察` : "五行数量接近，属性差异需要结合柱位、旺衰、十神和岁运继续观察"; return `属性倾向：从${role}看，${prominentText}；${weakText}。`; }
  function formatElementNames(items) { return items.map(item => item.label).join("、"); }
  function formatElementAttributes(items) { return items.map(item => `${item.label}的${item.attributes}`).join("、"); }
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
  function confidenceLabel(value) { return { low: "需验证", medium: "可取象", high: "关键结构" }[value] || "不能单断"; }
  function providerLabel(value) { return { "local-file": "本地演示", mock: "本地模拟" }[value] || "本地叙事"; }
  function escapeHtml(v) { return String(v ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;"); }
})();
