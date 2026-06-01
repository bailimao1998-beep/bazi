(function () {
  const { escapeHtml } = window.BaziShared;
  const buildCoreReadingReport = window.BaziCoreReadingReportEngine?.buildCoreReadingReport;

  function renderOverallJudgement({ state, el }) {
    const coreSignals = getCoreSignals(state);
    const report = buildCoreReadingReport ? buildCoreReadingReport({ reading: state.reading, state }) : null;
    el.overall.innerHTML = `
      <div class="core-report-shell">
        <div class="plugin-header core-report-header">
          <div>
            <p class="eyebrow">本地取象</p>
            <h2 id="overall-title">本地取象摘要</h2>
          </div>
        </div>
        ${renderLocalSignalsSummary(coreSignals)}
        ${renderCoreSignalsDebug(coreSignals)}
        ${renderLegacyReport(report, state)}
      </div>
    `;
  }

  function renderLocalSignalsSummary(coreSignals) {
    if (!coreSignals) {
      return `
        <section class="local-signals-summary">
          <h3>本地取象摘要</h3>
          <p>coreSignals 暂未生成，请先确认基础排盘数据。</p>
        </section>
      `;
    }
    const counts = [
      `五行 ${asArray(coreSignals.elementSignals?.strong).length + asArray(coreSignals.elementSignals?.weak).length}`,
      `十神 ${asArray(coreSignals.tenGodSignals?.strong).length}`,
      `关系 ${asArray(coreSignals.relationSignals).length}`,
      `强弱 ${asArray(coreSignals.strengthSignals).length}`,
      `根气 ${asArray(coreSignals.rootingSignals).length}`,
      `标签 ${asArray(coreSignals.topicTags).length}`,
      `触发点 ${asArray(coreSignals.transitHooks).length}`,
    ];
    return `
      <section class="local-signals-summary">
        <h3>本地取象摘要</h3>
        <p>已提取日主、月令、五行信号、十神信号、关系信号、主题标签、岁运触发点。</p>
        <div class="local-signal-chip-row">${counts.map((item) => `<span>${safe(item)}</span>`).join("")}</div>
      </section>
    `;
  }

  function renderLegacyReport(report, state) {
    if (!report) return "";
    return `
      <details class="legacy-report-debug">
        <summary>旧版报告/学习报告</summary>
        ${renderCompactCoreReport(report, state)}
      </details>
    `;
  }

  function renderCompactCoreReport(report, state) {
    const cards = buildCompactCoreCards(report, state);
    return `
      <div class="core-report-grid">
        ${cards.map(renderCompactCoreCard).join("")}
      </div>
    `;
  }

  function buildCompactCoreCards(report, state) {
    const context = buildAnalysisContext(report, state);
    return [
      buildProfileCard(context),
      buildPersonalityCard(context),
      buildLearningResourceCard(context),
      buildCareerCard(context),
      buildWealthCard(context),
      buildRelationshipCard(context),
      buildStrengthWeaknessCard(context),
      buildEvidenceChainCard(context),
    ];
  }

  function buildAnalysisContext(report, state) {
    const structureSections = report.structureSections ?? [];
    const display = state.reading?.natal?.basicBaziDisplay ?? {};
    const pillars = state.reading?.natal?.pillars ?? display.pillars ?? {};
    const image = getDominantImage(display);
    const relations = structureSections.find((section) => section.relationItems?.length);
    const elements = findSection(structureSections, "五行力量");
    const relationItems = buildCoreRelationItems(relations);
    return {
      report,
      display,
      pillars,
      image,
      elements,
      relations,
      relationItems,
      elementEvidence: formatElementStateEvidence(display, elements),
      tenGodEvidence: `当前十神中，${image.label}较突出；${formatTenGodGroupEvidence(image.groups)}。`,
      locationEvidence: `${image.label}主要落在${joinChinese(findTenGodLocations(pillars, image.group)) || "待核对柱位"}。`,
      resourceLocations: findTenGodNameLocations(pillars, ["正印", "偏印"]),
      wealthLocations: findTenGodNameLocations(pillars, ["正财", "偏财"]),
      officerLocations: findTenGodNameLocations(pillars, ["正官", "七杀", "偏官"]),
      outputLocations: findTenGodNameLocations(pillars, ["食神", "伤官"]),
      peerLocations: findTenGodNameLocations(pillars, ["比肩", "劫财"]),
    };
  }

  function findSection(sections, title) {
    return sections.find((section) => section.title === title);
  }

  function buildProfileCard(context) {
    const { pillars, image, elementEvidence, tenGodEvidence } = context;
    return {
      title: "整体画像",
      evidence: `依据：日主${formatDayMasterText(pillars.day)}，月令${safeText(pillars.month?.branch)}，${elementEvidence} ${tenGodEvidence}`,
      explanation: `${formatDayMasterText(pillars.day)}生在${safeText(pillars.month?.branch)}月，整体更偏自我标准清楚、边界感较强，也重视秩序、质感和稳定承接。${image.label}较突出时，人的主线更容易围绕${formatTenGodTheme(image.group)}展开。`,
    };
  }

  function buildPersonalityCard(context) {
    const { pillars, image, elementEvidence, outputLocations } = context;
    return {
      title: "性格与思维",
      evidence: `依据：${formatDayMasterText(pillars.day)}日主，月柱${formatPillarGanzhi(pillars.month)}，${elementEvidence} ${image.label}主要落在${joinChinese(findTenGodLocations(pillars, image.group)) || "待核对柱位"}。`,
      explanation: "辛金气质偏精细、重标准、讲边界，思维上容易先看规则、质感和可控性。食伤线索在时柱有一处，表达和行动不算完全外放，更像先整理清楚再输出。",
    };
  }

  function buildLearningResourceCard(context) {
    const { pillars, resourceLocations } = context;
    const evidence = resourceLocations.length
      ? `依据：正印出现在${joinChinese(resourceLocations)}；年柱${formatPillarGanzhi(pillars.year)}、时柱${formatPillarGanzhi(pillars.hour)}见印星。`
      : "依据：当前明面印星不突出，学习和资源支持需要结合藏干、柱位和大运继续验证。";
    const explanation = resourceLocations.length
      ? "学习、证书、长辈支持和平台资源这条线比较值得看，适合通过系统训练、资质积累或稳定平台来承接压力。印星落在年柱和时柱时，也提示早期环境与后期发展都可能带来资源线索。"
      : "资源支持不算明面主线，学习和证书仍可看，但更需要靠实际结构和阶段运势补证。该项需要结合柱位和大运继续验证。";
    return {
      title: "学习与资源",
      evidence,
      explanation,
    };
  }

  function buildCareerCard(context) {
    const { image, officerLocations, resourceLocations, outputLocations } = context;
    const officerCount = Number(image.groups?.官杀 ?? 0);
    const hasOfficer = officerLocations.length > 0 || officerCount > 0;
    const hasResource = resourceLocations.length > 0;
    const hasOutput = outputLocations.length > 0;
    const directions = [];
    if (hasOfficer && hasResource) directions.push("规则型、专业型、证书型、平台型工作");
    if (hasOutput) directions.push("技术输出、内容表达、作品交付");
    if (image.group === "财") directions.push("资源经营、客户和交易场景");
    return {
      title: "事业方向",
      evidence: `依据：官杀统计${officerCount}，${formatLocationStatus(officerLocations)}；印星${formatLocationStatus(resourceLocations)}，食伤${formatLocationStatus(outputLocations)}。`,
      explanation: `${directions.length ? directions.join("，也可看") : "事业方向需要结合官杀、印星、食伤和财星继续验证"}。这类结构更适合把标准、责任和专业承接起来，不宜只看单一五行下判断。`,
    };
  }

  function buildWealthCard(context) {
    const { pillars, wealthLocations, peerLocations, relationItems } = context;
    const wealthEvidence = wealthLocations.length
      ? `财富线索来自${formatLocationsWithTenGod(pillars, wealthLocations, ["正财", "偏财"])}`
      : "明面财星不突出";
    const peerEvidence = peerLocations.length ? `比劫主要落在${joinChinese(peerLocations)}` : "比劫位置待核对";
    return {
      title: "财富与现实",
      evidence: `依据：${wealthEvidence}；${peerEvidence}；关系中可见${formatRelationEvidence(relationItems)}。`,
      explanation: "赚钱方式更适合围绕稳定资源、客户需求和专业服务展开，重在把已有标准转成可交付的现实价值。比劫较突出时，资源分配、合作边界和同业竞争需要注意，不直接推成具体财务结果。",
    };
  }

  function buildRelationshipCard(context) {
    const { pillars, relationItems } = context;
    const dayBranch = pillars.day?.branch ?? "待查";
    const dayBranchTenGod = pillars.day?.branchMainTenGod ?? "待查";
    return {
      title: "感情与合作",
      evidence: `依据：日支为${dayBranch}，日支主气为${dayBranchTenGod}；原局关系见${formatRelationEvidence(relationItems)}。`,
      explanation: "亲密关系和合作里，容易先强调平等、边界和同频，也会在互动中在意规则是否清楚。酉子破这类关系提示相处里有牵动和磨合点，具体表现仍要结合柱位与岁运。",
    };
  }

  function buildStrengthWeaknessCard(context) {
    const { elementEvidence, resourceLocations, peerLocations } = context;
    const resourceText = resourceLocations.length ? "有印星承接" : "资源承接需要补证";
    const peerText = peerLocations.length ? "比劫较突出" : "同类支持不算明面主线";
    return {
      title: "优势与短板",
      evidence: `依据：${elementEvidence} ${resourceText}；${peerText}。`,
      explanation: `优势：标准感强，做事容易重质量和边界；优势：有印星承接，学习、资质和平台资源可以成为支撑。短板：火在明面不见，外部推动和热启动感需要后续验证；短板：比劫较突出，合作和资源分配上要留意边界。`,
    };
  }

  function buildEvidenceChainCard(context) {
    const { pillars, image, elementEvidence, locationEvidence, resourceLocations, relationItems } = context;
    return {
      title: "证据链",
      evidence: `依据：日主${formatDayMasterText(pillars.day)}，月令${safeText(pillars.month?.branch)}，${elementEvidence} ${image.label}主要落在${joinChinese(findTenGodLocations(pillars, image.group)) || "待核对柱位"}，印星见${joinChinese(resourceLocations) || "待核对柱位"}，关系见${formatRelationEvidence(relationItems)}。`,
      explanation: `以上分析来自日主、月令、五行分布、十神落点和干支关系的交叉印证。${locationEvidence}该项需要结合柱位和大运继续验证，但不影响原局中这些结构线索的呈现。`,
    };
  }

  function findTenGodLocations(pillars = {}, group) {
    const locations = [];
    if (pillarHasTenGodGroup(pillars.year, group)) locations.push("年柱");
    if (pillarHasTenGodGroup(pillars.month, group)) locations.push("月柱");
    if (tenGodBelongsToGroup(pillars.day?.stemTenGod, group)) locations.push("日干");
    if (tenGodBelongsToGroup(pillars.day?.branchMainTenGod, group)) locations.push("日支");
    if (pillarHasTenGodGroup(pillars.hour, group)) locations.push("时柱");
    return unique(locations);
  }

  function findTenGodNameLocations(pillars = {}, names = []) {
    const locations = [];
    for (const [key, pillar] of Object.entries(pillars)) {
      if (names.includes(pillar.stemTenGod)) locations.push(pillarKeyLabel(key));
      if (key === "day" && names.includes(pillar.branchMainTenGod)) locations.push("日支");
      if (key !== "day" && names.includes(pillar.branchMainTenGod)) locations.push(pillarKeyLabel(key));
    }
    return unique(locations);
  }

  function formatLocationStatus(locations = []) {
    return locations.length ? `见于${joinChinese(locations)}` : "明面不突出";
  }

  function formatLocationsWithTenGod(pillars = {}, locations = [], names = []) {
    return locations
      .map((location) => {
        const pillar = pillarByLocation(pillars, location);
        const hit = [pillar?.stemTenGod, pillar?.branchMainTenGod].find((name) => names.includes(name)) ?? names[0] ?? "财星";
        return `${location}${hit}`;
      })
      .join("、");
  }

  function pillarByLocation(pillars = {}, location) {
    if (location === "年柱") return pillars.year;
    if (location === "月柱") return pillars.month;
    if (location === "日干" || location === "日支") return pillars.day;
    if (location === "时柱") return pillars.hour;
    return {};
  }

  function pillarHasTenGodGroup(pillar = {}, group) {
    return tenGodBelongsToGroup(pillar.stemTenGod, group) || tenGodBelongsToGroup(pillar.branchMainTenGod, group);
  }

  function formatPalaceBasics() {
    return "年柱：早年、祖上、外部环境；月柱：父母、事业平台、青年阶段；日干：自己、日主中心；日支：夫妻宫、内心、贴身关系；时柱：子女、晚年、结果、后期发展。";
  }

  function formatLocationMeanings(locations = []) {
    const meanings = {
      年柱: "年柱多和早年、祖上、外部环境有关",
      月柱: "月柱多和父母、学习环境、事业平台、青年阶段有关",
      日干: "日干多和自己、日主中心有关",
      日支: "日支多和夫妻宫、内心、贴身关系有关",
      时柱: "时柱多和子女、晚年、结果、后期发展有关",
    };
    return locations.map((location) => meanings[location]).filter(Boolean).join("；") || "先看四柱各自承载的基础含义";
  }

  function joinChinese(items = []) {
    if (items.length <= 2) return items.join("和");
    return `${items.slice(0, -1).join("、")}和${items[items.length - 1]}`;
  }

  function formatElementStateEvidence(display = {}, fallbackSection) {
    const visibleCounts = display.elementStats?.visible?.counts;
    const hiddenCounts = display.elementStats?.hidden?.counts;
    const visibleTop = pickElementHighs(visibleCounts);
    const visibleLow = pickElementLows(visibleCounts);
    const hiddenTop = pickElementHighs(hiddenCounts);
    if (!visibleTop.length && !visibleLow.length && !hiddenTop.length) return fallbackSection?.evidence ?? "五行统计待补。";

    const topText = visibleTop.length ? `五行中${joinElementLabels(visibleTop)}较明显` : "明面五行来源待补";
    const lowText = formatElementLowText(visibleLow);
    const hiddenText = hiddenTop.length ? `藏干里${joinElementLabels(hiddenTop)}较有来源` : "藏干来源待补";
    return `${topText}，${lowText}；${hiddenText}。`;
  }

  function pickElementHighs(counts = {}) {
    return elementEntries(counts)
      .filter((item) => item.value > 0)
      .sort((left, right) => right.value - left.value || left.index - right.index)
      .slice(0, 2);
  }

  function pickElementLows(counts = {}) {
    const entries = elementEntries(counts);
    const zeroItems = entries.filter((item) => item.value === 0);
    if (zeroItems.length) return zeroItems;
    return entries.sort((left, right) => left.value - right.value || left.index - right.index).slice(0, 2);
  }

  function elementEntries(counts = {}) {
    return [
      ["wood", "木"],
      ["fire", "火"],
      ["earth", "土"],
      ["metal", "金"],
      ["water", "水"],
    ].map(([key, label], index) => ({ key, label, index, value: Number(counts[key] ?? 0) }));
  }

  function formatElementLowText(items = []) {
    if (!items.length) return "偏少五行待补";
    const zeroItems = items.filter((item) => item.value === 0);
    if (zeroItems.length) return `${joinElementLabels(zeroItems)}在明面不见`;
    return `${joinElementLabels(items)}相对偏少`;
  }

  function joinElementLabels(items = []) {
    return items.map((item) => item.label).join("、");
  }

  function getDominantImage(display = {}) {
    const counts = display.tenGods?.stats?.fullHidden ?? {};
    const groups = {
      财: tenGodGroupCount(counts, ["正财", "偏财"]),
      官杀: tenGodGroupCount(counts, ["正官", "七杀", "偏官"]),
      印: tenGodGroupCount(counts, ["正印", "偏印"]),
      食伤: tenGodGroupCount(counts, ["食神", "伤官"]),
      比劫: tenGodGroupCount(counts, ["比肩", "劫财"]),
    };
    const entries = Object.entries(groups).sort((left, right) => Number(right[1]) - Number(left[1]));
    const [group, count] = entries[0] ?? ["十神", 0];
    return { group, count, groups, label: count > 0 ? formatTenGodGroupName(group) : "十神" };
  }

  function tenGodGroupCount(counts = {}, names = []) {
    return names.reduce((sum, name) => sum + Number(counts[name] ?? 0), 0);
  }

  function formatTenGodGroupEvidence(groups = {}) {
    return Object.entries(groups).map(([name, count]) => `${formatTenGodGroupName(name)}${count}`).join("、") || "十神统计待补";
  }

  function formatImageLocations(pillars = {}, group) {
    const locations = Object.entries(pillars)
      .map(([key, pillar]) => {
        const hits = unique([pillar.stemTenGod, pillar.branchMainTenGod].filter((name) => tenGodBelongsToGroup(name, group)));
        return hits.length ? `${pillar.label ?? pillarKeyLabel(key)}${formatPillarGanzhi(pillar)}见${hits.join("、")}` : "";
      })
      .filter(Boolean);
    return locations.length ? locations.join("；") : `${formatTenGodGroupName(group)}在四柱明面暂不突出，可继续看藏干统计。`;
  }

  function formatImageStrengthEvidence(pillars = {}, group) {
    const stemHits = Object.values(pillars).filter((pillar) => tenGodBelongsToGroup(pillar.stemTenGod, group));
    const branchHits = Object.values(pillars).filter((pillar) => tenGodBelongsToGroup(pillar.branchMainTenGod, group));
    const month = pillars.month ?? {};
    const notes = [];
    if (stemHits.length) notes.push(`透干：${stemHits.map((pillar) => `${pillar.label ?? ""}${pillar.stem ?? ""}`).join("、")}`);
    if (branchHits.length) notes.push(`有根：${branchHits.map((pillar) => `${pillar.label ?? ""}${pillar.branch ?? ""}`).join("、")}`);
    if (tenGodBelongsToGroup(month.stemTenGod, group) || tenGodBelongsToGroup(month.branchMainTenGod, group)) notes.push(`得令：月柱见${formatTenGodGroupName(group)}，可作为月令背景观察`);
    return notes.join("；") || "透干、有根、得令、生扶和冲穿合坏条件暂需继续核对。";
  }

  function summarizeRelationNames(section) {
    const items = section?.relationItems ?? [];
    if (!items.length) return "当前原局未展示明显直接关系。";
    const names = unique(items.map((item) => item.name).filter(Boolean));
    const shown = names.slice(0, 2).join("、");
    return names.length > 2 ? `${shown}等关系` : `${shown}关系`;
  }

  function buildRelationCard(section) {
    const relationItems = buildCoreRelationItems(section);
    return {
      title: "当前主要关系",
      evidence: relationItems.length ? `当前关系摘要：${summarizeRelationCardNames({ relationItems })}。` : "当前原局未展示明显直接关系。",
      explanation: "关系用来观察干支之间的牵连、冲动、配合或牵制。关系明细放在折叠区，具体含义还要回到柱位、十神、旺衰和岁运继续验证。",
      relationItems,
    };
  }

  function summarizeRelationCardNames(section) {
    const names = unique((section?.relationItems ?? []).map((item) => item.name).filter(Boolean));
    if (!names.length) return "当前没有可展示的主要关系";
    const shown = names.slice(0, 3).join("、");
    return names.length > 3 ? `${shown}等关系` : shown;
  }

  function formatRelationEvidence(items = []) {
    if (!items.length) return "当前原局未展示明显直接关系";
    const parts = items.slice(0, 4).map((item) => `${item.name}（${item.involvedGanzhi}）`);
    return items.length > 4 ? `${parts.join("、")}等关系` : parts.join("、");
  }

  function buildCoreRelationItems(section) {
    const seen = new Set();
    return (section?.relationItems ?? [])
      .map((item) => {
        const normalized = {
          name: item.name ?? "干支关系",
          involvedGanzhi: formatRelationInvolved(item),
          plainExplanation: formatRelationPlainExplanation(item),
          needVerify: formatRelationNeedVerify(item),
        };
        return normalized.name && normalized.involvedGanzhi ? normalized : null;
      })
      .filter(Boolean)
      .filter((item) => {
        const key = `${item.name}|${normalizeRelationMembers(item.involvedGanzhi)}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
  }

  function formatRelationInvolved(item = {}) {
    const text = String(item.involvedGanzhi ?? "");
    const parts = text.split(/、|与|↔|<->|-/).map((part) => part.trim()).filter(Boolean);
    if (!parts.length) return text;
    if (String(item.name ?? "").includes("地支")) {
      return parts.map((part) => extractBranch(part)).filter(Boolean).join("、") || text;
    }
    if (String(item.name ?? "").includes("天干")) {
      return parts.map((part) => extractStem(part)).filter(Boolean).join("、") || text;
    }
    return parts.join("、");
  }

  function extractStem(text) {
    const match = String(text).match(/[甲乙丙丁戊己庚辛壬癸]/);
    return match?.[0] ?? "";
  }

  function extractBranch(text) {
    const matches = String(text).match(/[子丑寅卯辰巳午未申酉戌亥]/g);
    return matches?.[matches.length - 1] ?? "";
  }

  function normalizeRelationMembers(text) {
    return String(text).split("、").map((item) => item.trim()).filter(Boolean).sort().join("、");
  }

  function formatRelationPlainExplanation(item = {}) {
    const name = item.name ?? "";
    if (name.includes("合")) return "合代表牵连、绑定、合作或被牵制。具体是好是坏，要看双方落在哪一柱、分别代表什么十神。";
    if (name.includes("冲")) return "冲代表推动、碰撞、变化或拉扯。需要看被冲的是哪一柱、对应什么主题。";
    if (name.includes("破")) return item.plainExplanation || "破代表关系里有松动、消耗或不稳定的互动。需要看参与干支所在柱位和十神含义。";
    if (name.includes("生")) return "相生代表一方对另一方有支持、承接或流通关系。要看这种生扶是否得令、有根，以及是否被其他关系打断。";
    if (name.includes("克")) return "相克代表制约、压力、管理或消耗关系。要看克的是谁、被克的是谁，以及双方在原局里有没有力量。";
    return item.plainExplanation || "这组关系提示原局里有干支互动，适合作为结构观察点。";
  }

  function formatRelationNeedVerify(item = {}) {
    const name = item.name ?? "";
    if (name.includes("合")) return "看是否成化、是否得令、是否被其他干支冲破。";
    if (name.includes("冲")) return "看冲到哪一柱、是否有合解、是否被岁运再次触发。";
    if (name.includes("破")) return "看破发生在哪些柱位、涉及哪些十神，以及是否还有合冲刑害共同参与。";
    if (name.includes("生")) return "看生扶是否得令、有根、透干，以及是否被冲破或转化。";
    if (name.includes("克")) return "看双方旺衰、十神角色、柱位主题，以及是否形成制化。";
    return item.needVerify || "还需要核对柱位、十神、旺衰和岁运触发。";
  }

  function formatTenGodTheme(group) {
    return {
      财: "资源、财务、客户、市场和现实交换",
      官杀: "规则、责任、职位压力和外部约束",
      印: "学习、资源、长辈支持、证书、保护系统",
      食伤: "表达、技能、作品、输出和子女主题",
      比劫: "自我、同类、协作、竞争和边界",
    }[group] ?? "对应的十神";
  }

  function formatTenGodGroupName(group) {
    return {
      财: "财星",
      官杀: "官杀",
      印: "印星",
      食伤: "食伤",
      比劫: "比劫",
    }[group] ?? group;
  }

  function formatAffairExplanation(group) {
    const focus = {
      财: "财象可先放到财与资源主题，再回看婚姻、父母、子女、事业和健康是否有对应证据。",
      官杀: "官杀象可先放到事业、规则与压力主题，再回看财、婚姻、父母、子女和健康是否有对应证据。",
      印: "印星可先放到父母、学习、资质和支持系统，再回看事业、财、婚姻、子女和健康是否有对应证据。",
      食伤: "食伤象可先放到表达、技能、子女和输出主题，再回看事业、财、婚姻、父母和健康是否有对应证据。",
      比劫: "比劫象可先放到自我、同类、协作和边界主题，再回看事业、财、婚姻、父母、子女和健康是否有对应证据。",
    }[group] ?? "这个象需要分别回到事业、财、婚姻、父母、子女、健康六类主题继续观察。";
    return `${focus} 这里只做主题归类，不把象直接断成具体人事。`;
  }

  function tenGodBelongsToGroup(name, group) {
    const groups = {
      财: ["正财", "偏财"],
      官杀: ["正官", "七杀", "偏官"],
      印: ["正印", "偏印"],
      食伤: ["食神", "伤官"],
      比劫: ["比肩", "劫财"],
    };
    return (groups[group] ?? []).includes(name);
  }

  function formatDayMasterText(day = {}) {
    if (!day.stem) return "待查日主";
    return `${day.stem}${formatElementShort(day.stemElementLabel ?? day.stemElement)}`;
  }

  function formatElementShort(value) {
    const text = String(value ?? "");
    if (text.includes("木") || text === "wood") return "木";
    if (text.includes("火") || text === "fire") return "火";
    if (text.includes("土") || text === "earth") return "土";
    if (text.includes("金") || text === "metal") return "金";
    if (text.includes("水") || text === "water") return "水";
    return text || "待查";
  }

  function pillarKeyLabel(key) {
    return { year: "年柱", month: "月柱", day: "日柱", hour: "时柱" }[key] ?? "";
  }

  function safeText(value) {
    return value ?? "待查";
  }

  function unique(items = []) {
    return [...new Set(items)];
  }

  function renderCompactCoreCard(item) {
    if (item.relationItems) return renderRelationCoreCard(item);
    return `
      <article class="core-report-card">
        <h3>${safe(item.title)}</h3>
        <p><b>盘面依据：</b>${safe(item.evidence)}</p>
        <p><b>白话解释：</b>${safe(item.explanation)}</p>
      </article>
    `;
  }

  function renderRelationCoreCard(item) {
    const details = item.relationItems ?? [];
    return `
      <article class="core-report-card">
        <h3>${safe(item.title)}</h3>
        <p><b>盘面依据：</b>${safe(item.evidence)}</p>
        <p><b>白话解释：</b>${safe(item.explanation)}</p>
        ${details.length ? `
          <details class="core-relation-more">
            <summary>关系明细</summary>
            <div class="core-relation-list">
              ${details.map((relation) => renderCoreRelationItem(relation, "core-relation-detail-item")).join("")}
            </div>
          </details>
        ` : ""}
      </article>
    `;
  }

  function renderCoreRelationItem(relation, className) {
    return `
      <section class="${className}">
        <p><b>关系名称：</b>${safe(relation.name)}</p>
        <p><b>涉及干支：</b>${safe(relation.involvedGanzhi)}</p>
        <p><b>白话解释：</b>${safe(relation.plainExplanation)}</p>
        <p><b>还要验证：</b>${safe(relation.needVerify)}</p>
      </section>
    `;
  }

  function renderReportHeadline(report) {
    return `
      <section class="analysis-block overall-report-section">
        <h3>报告标题</h3>
        <p class="reading-lead">${safe(report.headline)}</p>
      </section>
    `;
  }

  function renderCoreTakeaways(report) {
    return `
      <section class="analysis-block quick-read-section">
        <h3>核心内容结论</h3>
        <div class="field-guide-grid">
          ${(report.coreTakeaways ?? []).map(renderCoreTakeawayCard).join("")}
        </div>
      </section>
    `;
  }

  function renderCoreTakeawayCard(item) {
    return `
      <article>
        <strong>${safe(item.title)}</strong>
        <p><b>结论：</b>${safe(item.conclusion)}</p>
        <p><b>证据：</b>${safe(item.evidence)}</p>
        <p><b>含义：</b>${safe(item.meaning)}</p>
        <p><b>提醒：</b>${safe(item.caution)}</p>
      </article>
    `;
  }

  function renderPalaceKinship(state) {
    const pillars = state.reading?.natal?.pillars ?? state.reading?.natal?.basicBaziDisplay?.pillars ?? {};
    return `
      <section class="analysis-block quick-read-section">
        <h3>宫位与六亲</h3>
        <div class="field-guide-grid">
          ${buildPalaceKinshipItems(pillars).map(renderPalaceKinshipCard).join("")}
        </div>
      </section>
    `;
  }

  function buildPalaceKinshipItems(pillars) {
    return [
      {
        title: "年柱",
        pillar: pillars.year,
        focus: "早年、祖上、外部环境",
        reading: "传统命理中，年柱常作为早年背景、祖上来源和外部环境的观察点。",
      },
      {
        title: "月柱",
        pillar: pillars.month,
        focus: "父母、事业平台、青年阶段",
        reading: "传统命理中，月柱常作为父母缘分、事业平台和青年阶段环境的观察点。",
      },
      {
        title: "日柱",
        pillar: pillars.day,
        focus: "日主、日支、夫妻宫",
        reading: "传统命理中，日柱用于观察日主自身，日支也常作为夫妻宫的学习入口。",
      },
      {
        title: "时柱",
        pillar: pillars.hour,
        focus: "子女、晚年、结果",
        reading: "传统命理中，时柱常作为子女、晚年状态和事情结果的观察点。",
      },
    ];
  }

  function renderPalaceKinshipCard(item) {
    return `
      <article>
        <strong>${safe(item.title)} ${safe(formatPillarGanzhi(item.pillar))}</strong>
        <p><b>学习含义：</b>${safe(item.reading)}</p>
        <p><b>宫位主题：</b>${safe(item.focus)}</p>
        <p><b>盘面证据：</b>${safe(formatPillarEvidence(item.pillar))}</p>
        <p><b>提醒：</b>这里是候选信号，需要结合柱位、旺衰、十神、岁运继续验证，不能单独作为结论。</p>
      </article>
    `;
  }

  function formatPillarGanzhi(pillar = {}) {
    const ganzhi = pillar.ganzhi ?? pillar.label ?? [pillar.stem, pillar.branch].filter(Boolean).join("");
    return ganzhi || "待查";
  }

  function formatPillarEvidence(pillar = {}) {
    const ganzhi = formatPillarGanzhi(pillar);
    const stem = pillar.stem ? `天干${pillar.stem}` : "";
    const branch = pillar.branch ? `地支${pillar.branch}` : "";
    const stemTenGod = pillar.stemTenGod ? `天干十神${pillar.stemTenGod}` : "";
    const branchTenGod = pillar.branchMainTenGod ? `地支主气十神${pillar.branchMainTenGod}` : "";
    return [ganzhi, stem, branch, stemTenGod, branchTenGod].filter(Boolean).join("；") || "待查";
  }

  function renderPrioritySignals(report) {
    return `
      <section class="analysis-block priority-reading-section">
        <h3>读盘重点排序</h3>
        <div class="priority-signal-grid">
          ${(report.prioritySignals ?? []).map(renderPrioritySignalCard).join("")}
        </div>
      </section>
    `;
  }

  function renderPrioritySignalCard(signal) {
    return `
      <article class="priority-signal-card priority-level-${safe(signal.level)}">
        <div class="priority-signal-head">
          <span>第${safe(signal.rank)}重点</span>
          <b>${safe(signal.level)}</b>
        </div>
        <strong>${safe(signal.title)}</strong>
        <p><b>为什么重要：</b>${safe(signal.whyImportant)}</p>
        <p><b>盘面证据：</b>${safe(signal.evidence)}</p>
        <p><b>怎么读：</b>${safe(signal.howToRead)}</p>
        <p><b>内容解读：</b>${safe(signal.contentReading)}</p>
        <p><b>主题含义：</b>${safe(signal.themeMeaning)}</p>
        <p><b>边界提醒：</b>${safe(signal.limitation)}</p>
        <p><b>下一步看什么：</b>${safe(signal.nextCheck)}</p>
      </article>
    `;
  }

  function renderTeacherSummary(report) {
    return `
      <section class="analysis-block overall-report-section">
        <h3>老师式讲盘摘要</h3>
        <div class="report-copy">
          ${(report.teacherSummary ?? []).map((line) => `<p>${safe(line)}</p>`).join("")}
        </div>
      </section>
    `;
  }

  function renderReportStructure(report) {
    const relationSection = (report.structureSections ?? []).find((section) => section.relationItems?.length);
    const regularSections = (report.structureSections ?? []).filter((section) => !section.relationItems?.length);
    return `
      <section class="analysis-block quick-read-section">
        <h3>结构重点</h3>
        <div class="field-guide-grid">
          ${regularSections.map(renderReportStructureCard).join("")}
        </div>
      </section>
      ${relationSection ? renderRelationStructure(relationSection) : ""}
    `;
  }

  function renderReportStructureCard(section) {
    return `
      <article>
        <strong>${safe(section.title)}</strong>
        ${section.currentFocus ? `<p><b>当前十神重点：</b>${safe(section.currentFocus)}</p>` : ""}
        <p><b>盘面证据：</b>${safe(section.evidence)}</p>
        <p><b>怎么理解：</b>${safe(section.explanation)}</p>
        <p><b>还要验证什么：</b>${safe(section.needVerify)}</p>
      </article>
    `;
  }

  function renderRelationStructure(section) {
    return `
      <section class="analysis-block quick-read-section">
        <h3>${safe(section.title)}</h3>
        <div class="field-guide-grid">
          ${(section.relationItems ?? []).map(renderRelationStructureCard).join("")}
        </div>
      </section>
    `;
  }

  function renderRelationStructureCard(item) {
    return `
      <article>
        <strong>${safe(item.name)}</strong>
        <p><b>涉及干支：</b>${safe(item.involvedGanzhi)}</p>
        <p><b>盘面证据：</b>${safe(item.evidence)}</p>
        <p><b>白话解释：</b>${safe(item.plainExplanation)}</p>
        <p><b>还需要验证：</b>${safe(item.needVerify)}</p>
      </article>
    `;
  }

  function renderReportThemes(report) {
    return `
      <section class="analysis-block quick-read-section">
        <h3>主题观察</h3>
        <div class="field-guide-grid">
          ${(report.themeSections ?? []).map(renderReportThemeCard).join("")}
        </div>
      </section>
    `;
  }

  function renderReportThemeCard(section) {
    return `
      <article>
        <strong>${safe(section.title)}</strong>
        <p><b>内容解读：</b>${safe(section.reading)}</p>
        <p><b>盘面证据：</b>${safe(section.evidence)}</p>
        <p><b>可能表现：</b>${safe(section.likelyExpression)}</p>
        <p><b>提醒：</b>${safe(section.caution)}</p>
      </article>
    `;
  }

  function renderReportEvidenceChain(report) {
    return `
      <section class="analysis-block quick-read-section">
        <h3>证据链</h3>
        <div class="quick-read-steps evidence-chain-list">
          ${(report.evidenceChain ?? []).map(renderReportEvidenceStep).join("")}
        </div>
      </section>
    `;
  }

  function renderReportEvidenceStep(item) {
    return `
      <article class="quick-read-step evidence-chain-step">
        <span>${safe(String(item.step).padStart(2, "0"))}</span>
        <div>
          <strong>${safe(item.title)}</strong>
          <p><b>证据：</b>${safe(item.evidence)}</p>
          <p><b>含义：</b>${safe(item.meaning)}</p>
          <p><b>下一步：</b>${safe(item.nextCheck)}</p>
        </div>
      </article>
    `;
  }

  function renderReportUncertainty(report) {
    return `
      <section class="analysis-block quick-read-section">
        <h3>风险与不确定</h3>
        <div class="signal-list compact">
          ${(report.uncertaintyNotes ?? []).map((item) => `<article class="signal"><strong>${safe(item.title)}</strong><p>${safe(item.text)}</p></article>`).join("")}
        </div>
      </section>
    `;
  }

  function renderReportTransitBridge(report) {
    return `
      <section class="analysis-block quick-read-section">
        <h3>下一步看岁运</h3>
        <p class="reading-lead">${safe(report.transitBridge)}</p>
      </section>
    `;
  }

  function renderCoreSignalsDebug(coreSignals) {
    if (!coreSignals) return "";
    const validation = validateCoreSignals(coreSignals);
    return `
      <details class="core-signals-debug" data-core-signals-valid="${validation.valid ? "true" : "false"}">
        <summary>核心取象 JSON 调试区</summary>
        ${validation.valid ? "" : `<p class="debug-warning">${safe(validation.issues.join("；"))}</p>`}
        <pre>${safe(JSON.stringify(coreSignals, null, 2))}</pre>
      </details>
    `;
  }

  function getCoreSignals(state) {
    const reading = state.reading;
    if (!reading) return null;
    if (reading.coreSignals) return reading.coreSignals;
    const builder = window.BaziCoreSignals?.buildCoreSignals;
    if (!builder) return null;
    const coreSignals = builder(reading, state.datasets ?? {});
    reading.coreSignals = coreSignals;
    return coreSignals;
  }

  function validateCoreSignals(coreSignals) {
    const issues = [];
    const required = ["dayMaster", "monthCommand", "elementSignals", "tenGodSignals", "relationSignals", "palaceSignals", "strengthSignals", "rootingSignals", "topicTags", "transitHooks", "cautions"];
    for (const key of required) {
      if (coreSignals[key] === undefined) issues.push(`缺少 ${key}`);
    }
    const signals = collectSignalObjects(coreSignals);
    for (const [index, signal] of signals.entries()) {
      if (!Array.isArray(signal.evidence) || signal.evidence.length === 0) issues.push(`signal ${index} 缺少 evidence`);
      if (!signal.confidence) issues.push(`signal ${index} 缺少 confidence`);
      if (!Array.isArray(signal.needVerify) || signal.needVerify.length === 0) issues.push(`signal ${index} 缺少 needVerify`);
    }
    return { valid: issues.length === 0, issues };
  }

  function collectSignalObjects(coreSignals) {
    return [
      coreSignals.dayMaster,
      coreSignals.monthCommand,
      coreSignals.elementSignals,
      ...asArray(coreSignals.elementSignals?.strong),
      ...asArray(coreSignals.elementSignals?.weak),
      ...asArray(coreSignals.elementSignals?.missingVisible),
      coreSignals.tenGodSignals,
      ...asArray(coreSignals.tenGodSignals?.strong),
      ...asArray(coreSignals.tenGodSignals?.weak),
      ...Object.values(coreSignals.tenGodSignals?.groups ?? {}),
      ...asArray(coreSignals.relationSignals),
      ...asArray(coreSignals.palaceSignals),
      ...asArray(coreSignals.strengthSignals),
      ...asArray(coreSignals.rootingSignals),
      ...asArray(coreSignals.topicTags),
      ...asArray(coreSignals.transitHooks),
      ...asArray(coreSignals.cautions),
    ].filter(Boolean);
  }

  function safe(value) {
    return escapeHtml(value ?? "");
  }

  function asArray(value) {
    return Array.isArray(value) ? value : [];
  }

  window.BaziSections = window.BaziSections ?? {};
  window.BaziSections.renderOverallJudgement = renderOverallJudgement;
})();
