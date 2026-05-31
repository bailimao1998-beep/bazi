(function () {
  const STEMS = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
  const BRANCHES = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
  const PILLAR_KEYS = ["year", "month", "day", "hour"];
  const PILLAR_LABELS = { year: "年柱", month: "月柱", day: "日柱", hour: "时柱" };
  const ELEMENT_LABELS = { wood: "木", fire: "火", earth: "土", metal: "金", water: "水" };
  const YIN_YANG_LABELS = { yang: "阳", yin: "阴" };
  const STEM_ELEMENTS = { 甲: "wood", 乙: "wood", 丙: "fire", 丁: "fire", 戊: "earth", 己: "earth", 庚: "metal", 辛: "metal", 壬: "water", 癸: "water" };
  const STEM_YIN_YANG = { 甲: "yang", 乙: "yin", 丙: "yang", 丁: "yin", 戊: "yang", 己: "yin", 庚: "yang", 辛: "yin", 壬: "yang", 癸: "yin" };
  const BRANCH_ELEMENTS = { 子: "water", 丑: "earth", 寅: "wood", 卯: "wood", 辰: "earth", 巳: "fire", 午: "fire", 未: "earth", 申: "metal", 酉: "metal", 戌: "earth", 亥: "water" };
  const BRANCH_YIN_YANG = { 子: "yang", 丑: "yin", 寅: "yang", 卯: "yin", 辰: "yang", 巳: "yin", 午: "yang", 未: "yin", 申: "yang", 酉: "yin", 戌: "yang", 亥: "yin" };
  const HIDDEN_STEMS = {
    子: [{ stem: "癸", role: "主气" }],
    丑: [{ stem: "己", role: "主气" }, { stem: "癸", role: "中气" }, { stem: "辛", role: "余气" }],
    寅: [{ stem: "甲", role: "主气" }, { stem: "丙", role: "中气" }, { stem: "戊", role: "余气" }],
    卯: [{ stem: "乙", role: "主气" }],
    辰: [{ stem: "戊", role: "主气" }, { stem: "乙", role: "中气" }, { stem: "癸", role: "余气" }],
    巳: [{ stem: "丙", role: "主气" }, { stem: "庚", role: "中气" }, { stem: "戊", role: "余气" }],
    午: [{ stem: "丁", role: "主气" }, { stem: "己", role: "中气" }],
    未: [{ stem: "己", role: "主气" }, { stem: "丁", role: "中气" }, { stem: "乙", role: "余气" }],
    申: [{ stem: "庚", role: "主气" }, { stem: "壬", role: "中气" }, { stem: "戊", role: "余气" }],
    酉: [{ stem: "辛", role: "主气" }],
    戌: [{ stem: "戊", role: "主气" }, { stem: "辛", role: "中气" }, { stem: "丁", role: "余气" }],
    亥: [{ stem: "壬", role: "主气" }, { stem: "甲", role: "中气" }],
  };
  const NAYIN_BY_PAIR = [
    "海中金", "炉中火", "大林木", "路旁土", "剑锋金", "山头火",
    "涧下水", "城头土", "白蜡金", "杨柳木", "泉中水", "屋上土",
    "霹雳火", "松柏木", "长流水", "沙中金", "山下火", "平地木",
    "壁上土", "金箔金", "覆灯火", "天河水", "大驿土", "钗钏金",
    "桑柘木", "大溪水", "沙中土", "天上火", "石榴木", "大海水",
  ];
  const VOID_BRANCHES_BY_DECADE = [["戌", "亥"], ["申", "酉"], ["午", "未"], ["辰", "巳"], ["寅", "卯"], ["子", "丑"]];
  const TWELVE_STAGE_MATRIX = {
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
  const SOLAR_TERM_BOUNDARIES = [
    { month: 1, day: 6, name: "小寒" }, { month: 2, day: 4, name: "立春" },
    { month: 3, day: 6, name: "惊蛰" }, { month: 4, day: 5, name: "清明" },
    { month: 5, day: 6, name: "立夏" }, { month: 6, day: 6, name: "芒种" },
    { month: 7, day: 7, name: "小暑" }, { month: 8, day: 8, name: "立秋" },
    { month: 9, day: 8, name: "白露" }, { month: 10, day: 8, name: "寒露" },
    { month: 11, day: 7, name: "立冬" }, { month: 12, day: 7, name: "大雪" },
  ];

  function getTenGod(dayStem, targetStem, datasets = {}) {
    return datasets?.tenGods?.tenGodMatrix?.matrix?.[dayStem]?.[targetStem] ?? deriveTenGod(dayStem, targetStem);
  }

  function getHiddenStems(branch, datasets = {}) {
    const fromDataset = datasets?.stemsBranches?.earthlyBranches?.find((item) => item.branch === branch)?.hiddenStems;
    const source = fromDataset?.length ? fromDataset : HIDDEN_STEMS[branch] ?? [];
    return source.map((item, index) => {
      const stem = item.stem;
      return { stem, role: normalizeHiddenStemRole(index, source.length), originalRole: item.role ?? "", element: item.element ?? getStemElement(stem), yinYang: getYinYang(stem), weight: item.weight ?? (index === 0 ? 100 : 0) };
    });
  }

  function getStemElement(stem) {
    return STEM_ELEMENTS[stem];
  }

  function getBranchElement(branch) {
    return BRANCH_ELEMENTS[branch];
  }

  function getYinYang(char) {
    return STEM_YIN_YANG[char] ?? BRANCH_YIN_YANG[char];
  }

  function getNaYin(ganzhi) {
    const { stem, branch } = parseGanzhi(ganzhi);
    return NAYIN_BY_PAIR[Math.floor(getGanzhiIndex(stem, branch) / 2)] ?? "待查";
  }

  function getTwelveGrowth(dayStem, branch, datasets = {}) {
    const matrix = datasets?.twelveStages?.matrix ?? TWELVE_STAGE_MATRIX;
    return matrix?.[dayStem]?.[branch] ?? "待查";
  }

  function getKongWang(ganzhi) {
    const { stem, branch } = parseGanzhi(ganzhi);
    const index = getGanzhiIndex(stem, branch);
    const xunStart = Math.floor(index / 10) * 10;
    return { pillar: `${stem}${branch}`, xun: `${STEMS[xunStart % 10]}${BRANCHES[xunStart % 12]}旬`, branches: VOID_BRANCHES_BY_DECADE[Math.floor(index / 10)] ?? [] };
  }

  function getGanZhiRelations(chart, datasets = {}) {
    const pillars = PILLAR_KEYS.map((key) => ({ key, ...chart[key] })).filter((item) => item.stem && item.branch);
    const relations = [];
    const pairRules = getPairRelationRules(datasets);
    for (let i = 0; i < pillars.length; i += 1) {
      for (let j = i + 1; j < pillars.length; j += 1) {
        const left = pillars[i];
        const right = pillars[j];
        if (left.label === right.label) relations.push(makeRelation("伏吟", [left, right], [left.label]));
        if (isFanYin(left, right)) relations.push(makeRelation("反吟", [left, right], [left.label, right.label]));
        for (const rule of pairRules) {
          const values = rule.kind === "stem" ? [left.stem, right.stem] : [left.branch, right.branch];
          if (sameMembers(rule.members, values)) relations.push(makeRelation(rule.type, [left, right], values));
        }
      }
    }
    for (const rule of getGroupRelationRules(datasets)) {
      const matched = pillars.filter((pillar) => rule.members.includes(pillar.branch));
      if (matched.length === rule.members.length) relations.push(makeRelation(rule.type, matched, rule.members));
    }
    return uniqueRelations(relations);
  }

  function getElementStats(chart, mode = "visible", datasets = {}) {
    const counts = emptyElementCounts();
    const pillars = PILLAR_KEYS.map((key) => chart[key]).filter(Boolean);
    if (mode === "hidden") {
      for (const pillar of pillars) {
        for (const hidden of getHiddenStems(pillar.branch, datasets)) incrementElement(counts, hidden.element);
      }
      return { label: "藏干五行", note: "按完整藏干逐个统计，不按权重折算", counts };
    }
    for (const pillar of pillars) {
      incrementElement(counts, getStemElement(pillar.stem));
      incrementElement(counts, getBranchElement(pillar.branch));
    }
    return { label: "明面五行", note: "四个天干 + 四个地支本气", counts };
  }

  function getBasicBaziDisplay({ input = {}, birth = {}, pillars, datasets = {}, chartMeta = {} }) {
    const dayStem = pillars.day.stem;
    const enrichedPillars = Object.fromEntries(PILLAR_KEYS.map((key) => [key, buildBasicPillar(key, pillars[key], dayStem, datasets)]));
    const voidsByPillar = Object.fromEntries(PILLAR_KEYS.map((key) => [key, getKongWang(pillars[key].label)]));
    return {
      pillars: enrichedPillars,
      tenGods: {
        heavenlyStems: PILLAR_KEYS.map((key) => pickTenGod(enrichedPillars[key], "stem")),
        branchMain: PILLAR_KEYS.map((key) => pickTenGod(enrichedPillars[key], "branch")),
        hiddenStems: PILLAR_KEYS.flatMap((key) => enrichedPillars[key].hiddenStems.map((item) => ({ pillarKey: key, pillarLabel: PILLAR_LABELS[key], branch: enrichedPillars[key].branch, ...item }))),
        stats: { fullHidden: countBy(PILLAR_KEYS.flatMap((key) => enrichedPillars[key].hiddenStems.map((item) => item.tenGod))), mainQi: countBy(PILLAR_KEYS.map((key) => enrichedPillars[key].branchMainTenGod)) },
        notes: { fullHidden: "按完整藏干统计", mainQi: "按地支主气统计" },
      },
      elementStats: { visible: getElementStats(pillars, "visible", datasets), hidden: getElementStats(pillars, "hidden", datasets) },
      nayin: Object.fromEntries(PILLAR_KEYS.map((key) => [key, enrichedPillars[key].nayin])),
      twelveGrowth: { note: "十二长生按日主天干推算", byPillar: Object.fromEntries(PILLAR_KEYS.map((key) => [key, enrichedPillars[key].twelveGrowth])) },
      voids: { day: voidsByPillar.day, byPillar: voidsByPillar },
      calendar: buildBasicCalendar(input, birth, chartMeta),
      fetalPalaces: { note: "当前为近似算法，仅作基础展示，不参与核心判断。", fetalOrigin: normalizePalace(chartMeta.fetalOrigin), lifePalace: normalizePalace(chartMeta.lifePalace), bodyPalace: normalizePalace(chartMeta.bodyPalace) },
      relations: getGanZhiRelations(pillars, datasets),
    };
  }

  function buildBasicPillar(key, pillar, dayStem, datasets) {
    const hiddenStems = getHiddenStems(pillar.branch, datasets).map((item) => ({ ...item, tenGod: getTenGod(dayStem, item.stem, datasets), elementLabel: formatElementYinYang(item.stem) }));
    return {
      key,
      label: PILLAR_LABELS[key],
      ganzhi: pillar.label,
      stem: pillar.stem,
      branch: pillar.branch,
      stemTenGod: key === "day" ? "日主" : getTenGod(dayStem, pillar.stem, datasets),
      branchMainTenGod: getTenGod(dayStem, hiddenStems[0]?.stem ?? branchMainStem(pillar.branch), datasets),
      stemElement: getStemElement(pillar.stem),
      branchElement: getBranchElement(pillar.branch),
      stemYinYang: getYinYang(pillar.stem),
      branchYinYang: getYinYang(pillar.branch),
      stemElementLabel: formatElementYinYang(pillar.stem),
      branchElementLabel: formatElementYinYang(pillar.branch),
      hiddenStems,
      nayin: getNaYin(pillar.label),
      twelveGrowth: getTwelveGrowth(dayStem, pillar.branch, datasets),
    };
  }

  function buildBasicCalendar(input, birth, chartMeta = {}) {
    const original = birth.original ?? birth;
    const finalTime = `${String(birth.hour ?? 0).padStart(2, "0")}:${String(birth.minute ?? 0).padStart(2, "0")}`;
    const originalTime = `${String(original.hour ?? 0).padStart(2, "0")}:${String(original.minute ?? 0).padStart(2, "0")}`;
    const trueSolarTime = birth.trueSolarTime ?? {};
    const location = trueSolarTime.location ?? {};
    const calendarMeta = chartMeta.calendar ?? {};
    return {
      inputCalendarType: input.calendarType === "lunar" ? "农历" : "公历",
      originalDate: `${original.year}-${String(original.month).padStart(2, "0")}-${String(original.day).padStart(2, "0")}`,
      originalTime,
      lunarDate: birth.calendar?.lunarDate ?? calendarMeta.lunarDate ?? "",
      birthplace: location.name ?? input.birthplace ?? "待接入",
      longitude: location.longitude ?? null,
      latitude: location.latitude ?? null,
      timezone: location.timezone ?? "Asia/Shanghai",
      standardMeridian: location.standardMeridian ?? 120,
      trueSolarTime: {
        enabled: Boolean(trueSolarTime.enabled),
        applied: Boolean(trueSolarTime.applied),
        correctionMinutes: trueSolarTime.correctionMinutes ?? 0,
        longitudeCorrectionMinutes: trueSolarTime.longitudeCorrectionMinutes ?? 0,
        equationOfTimeMinutes: trueSolarTime.applied ? trueSolarTime.equationOfTimeMinutes ?? 0 : "未计算",
      },
      finalDate: `${birth.year}-${String(birth.month).padStart(2, "0")}-${String(birth.day).padStart(2, "0")}`,
      finalTime,
      finalHourBranch: `${hourBranch(birth.hour ?? 0)}时`,
      solarTermRule: "月柱采用节气排月",
      solarTermRange: getSolarTermRange(birth.month, birth.day, calendarMeta),
      solarTermBasis: "以精确节气时刻为月令边界",
      dayPillarRule: calendarMeta.dayPillarRule ?? "23:00-23:59按次日计算日柱（晚子时换日）",
      dayPillarDate: calendarMeta.dayPillarDate ?? `${birth.year}-${String(birth.month).padStart(2, "0")}-${String(birth.day).padStart(2, "0")}`,
      hourPillarRule: calendarMeta.hourPillarRule ?? "按最终排盘时间取时辰，晚子时使用次日日干起时柱。",
    };
  }

  function getPairRelationRules(datasets) {
    const combos = datasets?.combinations;
    const rules = [
      ...extractPairRules(combos?.heavenlyStemCombinations?.rules, "天干五合", "stem", "stems"),
      ...extractPairRules(combos?.branchSixCombinations?.rules, "地支六合", "branch", "branches"),
      ...extractPairRules(combos?.branchSixClashes?.rules, "地支六冲", "branch", "branches"),
      ...extractPairRules(combos?.branchThreePunishments?.rules, "地支刑", "branch", "branches"),
      ...extractPairRules(combos?.branchSixHarms?.rules, "地支害", "branch", "branches"),
      ...extractPairRules(combos?.branchSixBreaks?.rules, "地支六破", "branch", "branches"),
    ];
    if (rules.length) return rules;
    return [
      ["天干五合", "stem", ["甲", "己"]], ["天干五合", "stem", ["乙", "庚"]], ["天干五合", "stem", ["丙", "辛"]], ["天干五合", "stem", ["丁", "壬"]], ["天干五合", "stem", ["戊", "癸"]],
      ["地支六合", "branch", ["子", "丑"]], ["地支六合", "branch", ["寅", "亥"]], ["地支六合", "branch", ["卯", "戌"]], ["地支六合", "branch", ["辰", "酉"]], ["地支六合", "branch", ["巳", "申"]], ["地支六合", "branch", ["午", "未"]],
      ["地支六冲", "branch", ["子", "午"]], ["地支六冲", "branch", ["丑", "未"]], ["地支六冲", "branch", ["寅", "申"]], ["地支六冲", "branch", ["卯", "酉"]], ["地支六冲", "branch", ["辰", "戌"]], ["地支六冲", "branch", ["巳", "亥"]],
      ["地支六破", "branch", ["子", "酉"]], ["地支六破", "branch", ["丑", "辰"]], ["地支六破", "branch", ["寅", "亥"]], ["地支六破", "branch", ["卯", "午"]], ["地支六破", "branch", ["巳", "申"]], ["地支六破", "branch", ["未", "戌"]],
    ].map(([type, kind, members]) => ({ type, kind, members }));
  }

  function getGroupRelationRules(datasets) {
    const combos = datasets?.combinations;
    return [
      ...extractPairRules(combos?.branchThreeCombinations?.rules, "三合", "branch", "branches"),
      ...extractPairRules(combos?.branchThreeMeetings?.rules, "三会", "branch", "branches"),
    ].filter((rule) => rule.members.length === 3);
  }

  function extractPairRules(rules = [], type, kind, memberKey) {
    return rules.map((item) => ({ type, kind, members: item?.[memberKey] ?? item?.pair ?? [] })).filter((item) => item.members.length >= 2);
  }

  function makeRelation(type, pillars, members) {
    return { type, pillars: pillars.map((pillar) => PILLAR_LABELS[pillar.key]), ganzhi: pillars.map((pillar) => pillar.label), members };
  }

  function uniqueRelations(relations) {
    const seen = new Set();
    return relations.filter((relation) => {
      const key = `${relation.type}-${relation.pillars.join("/")}-${relation.members.join("/")}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function isFanYin(left, right) {
    return controls(getStemElement(left.stem)) === getStemElement(right.stem) && branchClashes(left.branch, right.branch);
  }

  function branchClashes(left, right) {
    return sameMembers([left, right], ["子", "午"]) || sameMembers([left, right], ["丑", "未"]) ||
      sameMembers([left, right], ["寅", "申"]) || sameMembers([left, right], ["卯", "酉"]) ||
      sameMembers([left, right], ["辰", "戌"]) || sameMembers([left, right], ["巳", "亥"]);
  }

  function pickTenGod(pillar, layer) {
    return { pillarKey: pillar.key, pillarLabel: pillar.label, stem: pillar.stem, branch: pillar.branch, tenGod: layer === "stem" ? pillar.stemTenGod : pillar.branchMainTenGod };
  }

  function normalizePalace(palace) {
    if (!palace) return undefined;
    return { label: palace.label, stem: palace.stem, branch: palace.branch, method: palace.meta?.method ?? "近似算法" };
  }

  function normalizeHiddenStemRole(index, length) {
    if (index === 0) return "主气";
    if (index === 1 && length > 2) return "中气";
    return "余气";
  }

  function formatElementYinYang(char) {
    const element = getStemElement(char) ?? getBranchElement(char);
    const yinYang = getYinYang(char);
    return `${YIN_YANG_LABELS[yinYang] ?? ""}${ELEMENT_LABELS[element] ?? ""}`;
  }

  function parseGanzhi(ganzhi) {
    if (typeof ganzhi === "string") return { stem: ganzhi[0], branch: ganzhi[1] };
    return ganzhi;
  }

  function getGanzhiIndex(stem, branch) {
    for (let index = 0; index < 60; index += 1) {
      if (STEMS[index % 10] === stem && BRANCHES[index % 12] === branch) return index;
    }
    return 0;
  }

  function branchMainStem(branch) {
    return HIDDEN_STEMS[branch]?.[0]?.stem;
  }

  function deriveTenGod(dayStem, targetStem) {
    const dayElement = getStemElement(dayStem);
    const targetElement = getStemElement(targetStem);
    const samePolarity = getYinYang(dayStem) === getYinYang(targetStem);
    if (targetElement === dayElement) return samePolarity ? "比肩" : "劫财";
    if (generates(dayElement) === targetElement) return samePolarity ? "食神" : "伤官";
    if (controls(dayElement) === targetElement) return samePolarity ? "偏财" : "正财";
    if (controls(targetElement) === dayElement) return samePolarity ? "七杀" : "正官";
    return samePolarity ? "偏印" : "正印";
  }

  function generates(element) {
    return { wood: "fire", fire: "earth", earth: "metal", metal: "water", water: "wood" }[element];
  }

  function controls(element) {
    return { wood: "earth", fire: "metal", earth: "water", metal: "wood", water: "fire" }[element];
  }

  function sameMembers(left, right) {
    return left.length === right.length && left.every((member) => right.includes(member));
  }

  function emptyElementCounts() {
    return { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
  }

  function incrementElement(counts, element) {
    if (element) counts[element] += 1;
  }

  function countBy(items) {
    return items.filter(Boolean).reduce((acc, item) => {
      acc[item] = (acc[item] ?? 0) + 1;
      return acc;
    }, {});
  }

  function hourBranch(hour) {
    return hour === 23 ? "子" : BRANCHES[Math.floor((hour + 1) / 2) % 12];
  }

  function getSolarTermRange(month, day, calendarMeta = {}) {
    if (calendarMeta.solarTermRange) return calendarMeta.solarTermRange;
    let currentIndex = -1;
    for (let index = 0; index < SOLAR_TERM_BOUNDARIES.length; index += 1) {
      const term = SOLAR_TERM_BOUNDARIES[index];
      if (month > term.month || (month === term.month && day >= term.day)) currentIndex = index;
    }
    const current = SOLAR_TERM_BOUNDARIES[currentIndex >= 0 ? currentIndex : SOLAR_TERM_BOUNDARIES.length - 1];
    const next = SOLAR_TERM_BOUNDARIES[(currentIndex + 1 + SOLAR_TERM_BOUNDARIES.length) % SOLAR_TERM_BOUNDARIES.length];
    return `${current.name}之后、${next.name}之前`;
  }

  window.BaziBasics = {
    getTenGod,
    getHiddenStems,
    getStemElement,
    getBranchElement,
    getYinYang,
    getNaYin,
    getTwelveGrowth,
    getKongWang,
    getGanZhiRelations,
    getElementStats,
    getBasicBaziDisplay,
  };
})();
