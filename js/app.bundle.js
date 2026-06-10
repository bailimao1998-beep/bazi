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
  const shenshaRules = [
    ["天乙贵人", "贵人助力", ["dayStem"], "branch", "按日干取地支贵人", { 甲: ["丑", "未"], 乙: ["子", "申"], 丙: ["亥", "酉"], 丁: ["亥", "酉"], 戊: ["丑", "未"], 己: ["子", "申"], 庚: ["丑", "未"], 辛: ["寅", "午"], 壬: ["巳", "卯"], 癸: ["巳", "卯"] }, "传统命理中可作为外部助力、资源承接的候选信号，需要结合柱位、旺衰、十神、岁运继续验证。"],
    ["太极贵人", "贵人助力", ["dayStem"], "branch", "按日干取太极贵人地支", { 甲: ["子", "午"], 乙: ["子", "午"], 丙: ["卯", "酉"], 丁: ["卯", "酉"], 戊: ["辰", "戌", "丑", "未"], 己: ["辰", "戌", "丑", "未"], 庚: ["寅", "亥"], 辛: ["寅", "亥"], 壬: ["巳", "申"], 癸: ["巳", "申"] }, "可作为学习、理解、抽象思考相关的候选信号，不能单独作为结论。"],
    ["文昌", "学习才艺", ["dayStem"], "branch", "按日干取文昌地支", { 甲: ["巳"], 乙: ["午"], 丙: ["申"], 丁: ["酉"], 戊: ["申"], 己: ["酉"], 庚: ["亥"], 辛: ["子"], 壬: ["寅"], 癸: ["卯"] }, "传统命理中可作为学习、表达、文书能力的候选信号，需要结合十神和实际训练继续验证。"],
    ["学堂", "学习才艺", ["dayStem"], "branch", "按日干取学堂地支", { 甲: ["亥"], 乙: ["午"], 丙: ["寅"], 丁: ["酉"], 戊: ["寅"], 己: ["酉"], 庚: ["巳"], 辛: ["子"], 壬: ["申"], 癸: ["卯"] }, "可作为学习环境、吸收能力、知识训练的观察点，仍需结合柱位和岁运验证。"],
    ["词馆", "学习才艺", ["dayStem"], "branch", "按日干取词馆地支", { 甲: ["寅"], 乙: ["卯"], 丙: ["巳"], 丁: ["午"], 戊: ["巳"], 己: ["午"], 庚: ["申"], 辛: ["酉"], 壬: ["亥"], 癸: ["子"] }, "可作为语言、表达、专业术语训练的候选信号，不能脱离整体结构单看。"],
    ["桃花", "关系互动", ["yearBranch", "dayBranch"], "branch", "按年支或日支三合局取桃花", { 申: ["酉"], 子: ["酉"], 辰: ["酉"], 寅: ["卯"], 午: ["卯"], 戌: ["卯"], 巳: ["午"], 酉: ["午"], 丑: ["午"], 亥: ["子"], 卯: ["子"], 未: ["子"] }, "传统命理中可作为人际吸引、审美表达、互动活跃度的候选信号，需要结合十神与岁运验证。"],
    ["红鸾", "关系互动", ["yearBranch"], "branch", "按年支取红鸾地支", { 子: ["卯"], 丑: ["寅"], 寅: ["丑"], 卯: ["子"], 辰: ["亥"], 巳: ["戌"], 午: ["酉"], 未: ["申"], 申: ["未"], 酉: ["午"], 戌: ["巳"], 亥: ["辰"] }, "可作为关系互动被看见的候选信号，不能单独推导关系结果。"],
    ["天喜", "关系互动", ["yearBranch"], "branch", "按年支取天喜地支", { 子: ["酉"], 丑: ["申"], 寅: ["未"], 卯: ["午"], 辰: ["巳"], 巳: ["辰"], 午: ["卯"], 未: ["寅"], 申: ["丑"], 酉: ["子"], 戌: ["亥"], 亥: ["戌"] }, "可作为关系、庆贺、互动机会的候选信号，仍要结合柱位和岁运观察。"],
    ["驿马", "移动变化", ["yearBranch", "dayBranch"], "branch", "按年支或日支三合局取驿马", { 申: ["寅"], 子: ["寅"], 辰: ["寅"], 寅: ["申"], 午: ["申"], 戌: ["申"], 巳: ["亥"], 酉: ["亥"], 丑: ["亥"], 亥: ["巳"], 卯: ["巳"], 未: ["巳"] }, "传统命理中可作为移动、变动、转换环境的候选信号，需要结合岁运触发继续验证。"],
    ["华盖", "学习才艺", ["yearBranch", "dayBranch"], "branch", "按年支或日支三合局取华盖", { 申: ["辰"], 子: ["辰"], 辰: ["辰"], 寅: ["戌"], 午: ["戌"], 戌: ["戌"], 巳: ["丑"], 酉: ["丑"], 丑: ["丑"], 亥: ["未"], 卯: ["未"], 未: ["未"] }, "可作为专注、审美、独立研究倾向的候选信号，需要结合整体结构验证。"],
    ["将星", "辅助参考", ["yearBranch", "dayBranch"], "branch", "按年支或日支三合局取将星", { 申: ["子"], 子: ["子"], 辰: ["子"], 寅: ["午"], 午: ["午"], 戌: ["午"], 巳: ["酉"], 酉: ["酉"], 丑: ["酉"], 亥: ["卯"], 卯: ["卯"], 未: ["卯"] }, "可作为组织、承担、主导感的候选信号，不能脱离十神和现实角色单看。"],
    ["禄神", "辅助参考", ["dayStem"], "branch", "按日干取禄地", { 甲: ["寅"], 乙: ["卯"], 丙: ["巳"], 丁: ["午"], 戊: ["巳"], 己: ["午"], 庚: ["申"], 辛: ["酉"], 壬: ["亥"], 癸: ["子"] }, "可作为根气、承接、资源落点的候选信号，需要结合旺衰和岁运验证。"],
    ["羊刃", "状态提醒", ["dayStem"], "branch", "按日干取刃地", { 甲: ["卯"], 乙: ["寅"], 丙: ["午"], 丁: ["巳"], 戊: ["午"], 己: ["巳"], 庚: ["酉"], 辛: ["申"], 壬: ["子"], 癸: ["亥"] }, "可作为力量集中、行动直接、边界感较强的候选信号，需要结合制化和岁运观察。"],
    ["劫煞", "状态提醒", ["yearBranch", "dayBranch"], "branch", "按年支或日支三合局取劫煞", { 申: ["巳"], 子: ["巳"], 辰: ["巳"], 寅: ["亥"], 午: ["亥"], 戌: ["亥"], 巳: ["寅"], 酉: ["寅"], 丑: ["寅"], 亥: ["申"], 卯: ["申"], 未: ["申"] }, "可作为资源流动、竞争压力、节奏变化的候选信号，需要结合实际事务验证。"],
    ["灾煞", "状态提醒", ["yearBranch", "dayBranch"], "branch", "按年支或日支三合局取灾煞", { 申: ["午"], 子: ["午"], 辰: ["午"], 寅: ["子"], 午: ["子"], 戌: ["子"], 巳: ["卯"], 酉: ["卯"], 丑: ["卯"], 亥: ["酉"], 卯: ["酉"], 未: ["酉"] }, "可作为状态波动、外部扰动的观察点，只能提示需要继续验证。"],
    ["亡神", "状态提醒", ["yearBranch", "dayBranch"], "branch", "按年支或日支三合局取亡神", { 申: ["亥"], 子: ["亥"], 辰: ["亥"], 寅: ["巳"], 午: ["巳"], 戌: ["巳"], 巳: ["申"], 酉: ["申"], 丑: ["申"], 亥: ["寅"], 卯: ["寅"], 未: ["寅"] }, "可作为注意力转移、隐藏压力、内在牵动的候选信号，不能单独作为结论。"],
    ["孤辰", "关系互动", ["yearBranch"], "branch", "按年支三会方取孤辰", { 亥: ["寅"], 子: ["寅"], 丑: ["寅"], 寅: ["巳"], 卯: ["巳"], 辰: ["巳"], 巳: ["申"], 午: ["申"], 未: ["申"], 申: ["亥"], 酉: ["亥"], 戌: ["亥"] }, "可作为边界感、独立性、人际距离的候选信号，不能单独推导关系结论。"],
    ["寡宿", "关系互动", ["yearBranch"], "branch", "按年支三会方取寡宿", { 亥: ["戌"], 子: ["戌"], 丑: ["戌"], 寅: ["丑"], 卯: ["丑"], 辰: ["丑"], 巳: ["辰"], 午: ["辰"], 未: ["辰"], 申: ["未"], 酉: ["未"], 戌: ["未"] }, "可作为关系节奏、情感表达距离的观察点，需要结合十神、柱位和现实反馈验证。"],
    ["空亡", "辅助参考", ["pillarVoid"], "branch", "按各柱旬空取空亡观察", {}, "可作为落空、延迟、需要复核的辅助观察点，不能单独作为结论。"],
    ["金舆", "辅助参考", ["dayStem"], "branch", "按日干取金舆地支", { 甲: ["辰"], 乙: ["巳"], 丙: ["未"], 丁: ["申"], 戊: ["未"], 己: ["申"], 庚: ["戌"], 辛: ["亥"], 壬: ["丑"], 癸: ["寅"] }, "可作为资源载体、生活配置、承接条件的候选信号，需要结合现实环境验证。"],
    ["天德", "贵人助力", ["monthBranch"], "stemOrBranch", "按月支取天德", { 寅: ["丁"], 卯: ["申"], 辰: ["壬"], 巳: ["辛"], 午: ["亥"], 未: ["甲"], 申: ["癸"], 酉: ["寅"], 戌: ["丙"], 亥: ["乙"], 子: ["巳"], 丑: ["庚"] }, "可作为缓和、承接、外部助力的候选信号，仍要结合整体结构观察。"],
    ["月德", "贵人助力", ["monthBranch"], "stem", "按月支三合局取月德天干", { 寅: ["丙"], 午: ["丙"], 戌: ["丙"], 申: ["壬"], 子: ["壬"], 辰: ["壬"], 亥: ["甲"], 卯: ["甲"], 未: ["甲"], 巳: ["庚"], 酉: ["庚"], 丑: ["庚"] }, "可作为助力、调和、资源承接的观察点，不能单独判断结果。"],
    ["国印", "辅助参考", ["dayStem"], "branch", "按日干取国印地支", { 甲: ["戌"], 乙: ["亥"], 丙: ["丑"], 丁: ["寅"], 戊: ["丑"], 己: ["寅"], 庚: ["辰"], 辛: ["巳"], 壬: ["未"], 癸: ["申"] }, "可作为规则、凭证、组织体系相关的候选信号，需要结合十神和现实角色验证。"],
    ["福星", "贵人助力", ["dayStem"], "branch", "按日干取福星地支", { 甲: ["寅"], 乙: ["卯"], 丙: ["子"], 丁: ["亥"], 戊: ["子"], 己: ["亥"], 庚: ["申"], 辛: ["未"], 壬: ["辰"], 癸: ["巳"] }, "可作为资源感、缓冲条件、支持环境的候选信号，需要继续验证。"],
    ["天医", "状态提醒", ["monthBranch"], "branch", "按月支前一位取天医", { 寅: ["丑"], 卯: ["寅"], 辰: ["卯"], 巳: ["辰"], 午: ["巳"], 未: ["午"], 申: ["未"], 酉: ["申"], 戌: ["酉"], 亥: ["戌"], 子: ["亥"], 丑: ["子"] }, "可作为身心状态、修复方式、照护主题的观察点，不能单独作健康判断。"],
    ["天厨", "贵人助力", ["dayStem"], "branch", "按日干取天厨地支", { 甲: ["巳"], 乙: ["午"], 丙: ["巳"], 丁: ["午"], 戊: ["申"], 己: ["酉"], 庚: ["亥"], 辛: ["子"], 壬: ["寅"], 癸: ["卯"] }, "可作为饮食、供养、资源滋养和生活照料相关的候选信号，需要结合现实条件验证。"],
    ["红艳", "关系互动", ["dayStem"], "branch", "按日干取红艳地支", { 甲: ["午"], 乙: ["申"], 丙: ["寅"], 丁: ["未"], 戊: ["辰"], 己: ["辰"], 庚: ["戌"], 辛: ["酉"], 壬: ["子"], 癸: ["申"] }, "可作为外在吸引、审美、人际互动被看见的候选信号，不能单独推导情感结果。"],
    ["流霞", "状态提醒", ["dayStem"], "branch", "按日干取流霞地支", { 甲: ["酉"], 乙: ["戌"], 丙: ["未"], 丁: ["申"], 戊: ["巳"], 己: ["午"], 庚: ["辰"], 辛: ["卯"], 壬: ["亥"], 癸: ["寅"] }, "可作为状态起伏、外部牵动、细节风险意识的观察点，需要结合岁运和现实反馈验证。"],
    ["天德合", "贵人助力", ["monthBranch"], "stemOrBranch", "按月支取天德合", { 寅: ["壬"], 卯: ["巳"], 辰: ["丁"], 巳: ["丙"], 午: ["寅"], 未: ["己"], 申: ["戊"], 酉: ["亥"], 戌: ["辛"], 亥: ["庚"], 子: ["申"], 丑: ["乙"] }, "可作为调和、缓冲、外部承接的辅助观察点，需要结合柱位和整体结构判断。"],
    ["月德合", "贵人助力", ["monthBranch"], "stem", "按月支三合局取月德合天干", { 寅: ["辛"], 午: ["辛"], 戌: ["辛"], 申: ["丁"], 子: ["丁"], 辰: ["丁"], 亥: ["己"], 卯: ["己"], 未: ["己"], 巳: ["乙"], 酉: ["乙"], 丑: ["乙"] }, "可作为资源调和、关系缓冲、事务承接的候选信号，不能单独作为结论。"],
    ["魁罡", "辅助参考", ["dayPillarLabel"], "pillarLabel", "按日柱见庚辰、庚戌、壬辰、戊戌取魁罡", { dayPillarLabel: ["庚辰", "庚戌", "壬辰", "戊戌"] }, "可作为性格棱角、规则意识、行动力度较集中的候选信号，需要结合格局和岁运观察。"],
    ["金神", "辅助参考", ["dayPillarLabel"], "pillarLabel", "按日柱见乙丑、己巳、癸酉取金神", { dayPillarLabel: ["乙丑", "己巳", "癸酉"] }, "可作为干支组合特殊性的辅助观察点，解释时仍需回到日主、月令和整体力量。"],
    ["阴差阳错", "关系互动", ["dayPillarLabel"], "pillarLabel", "按日柱见阴差阳错日取", { dayPillarLabel: ["丙子", "丁丑", "戊寅", "辛卯", "壬辰", "癸巳", "丙午", "丁未", "戊申", "辛酉", "壬戌", "癸亥"] }, "可作为关系节奏、沟通错位、现实配合需要复核的候选信号，不能单独推导关系结论。"],
    ["十恶大败", "状态提醒", ["dayPillarLabel"], "pillarLabel", "按日柱见十恶大败日取", { dayPillarLabel: ["甲辰", "乙巳", "丙申", "丁亥", "戊戌", "己丑", "庚辰", "辛巳", "壬申", "癸亥"] }, "可作为资源管理、承接能力、现实消耗需要观察的候选信号，不能单独判断财务或成败。"],
    ["孤鸾", "关系互动", ["dayPillarLabel"], "pillarLabel", "按日柱见孤鸾日取", { dayPillarLabel: ["甲寅", "乙巳", "丙午", "丁巳", "戊申", "戊午", "辛亥", "壬子"] }, "可作为关系边界、自我节奏、互动方式需要观察的候选信号，不能单独推断婚恋结果。"],
    ["天赦", "贵人助力", ["seasonDayPillar"], "pillarLabel", "按季节月令取天赦日", { spring: ["戊寅"], summer: ["甲午"], autumn: ["戊申"], winter: ["甲子"] }, "可作为缓和、转圜、修复机会的候选信号，需要结合岁运和现实反馈验证。"],
    ["四废", "状态提醒", ["seasonDayPillar"], "pillarLabel", "按季节月令取四废日", { spring: ["庚申", "辛酉"], summer: ["壬子", "癸亥"], autumn: ["甲寅", "乙卯"], winter: ["丙午", "丁巳"] }, "可作为阶段力量不易承接、行动效率需要复核的候选信号，不能单独判断事务结果。"],
    ["元辰", "状态提醒", ["yearBranchGender"], "branch", "按年支、年干阴阳与性别取元辰", { yangMaleYinFemale: { 子: ["未"], 丑: ["申"], 寅: ["酉"], 卯: ["戌"], 辰: ["亥"], 巳: ["子"], 午: ["丑"], 未: ["寅"], 申: ["卯"], 酉: ["辰"], 戌: ["巳"], 亥: ["午"] }, yinMaleYangFemale: { 子: ["巳"], 丑: ["午"], 寅: ["未"], 卯: ["申"], 辰: ["酉"], 巳: ["戌"], 午: ["亥"], 未: ["子"], 申: ["丑"], 酉: ["寅"], 戌: ["卯"], 亥: ["辰"] } }, "可作为内在牵动、状态反复、节奏不稳的候选信号，需要结合岁运与实际反馈继续验证。"],
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
  const state = { name: "测试用户", calendarType: "solar", birthDate: "1949-10-01", birthTime: "00:00", gender: "male", birthProvince: "北京市", birthplace: "北京", trueSolarTime: false, targetYear: now.getFullYear(), selectedMonth: now.getMonth() + 1, preInterpretAi: false };
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
    renderFortuneDebugPanel(data);
    renderMonth(data);
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
    const fortuneAnalysis = buildLocalFortuneAnalysis({
      chart,
      selectedLuck,
      yearInfluence,
      selectedMonthInfluence,
      monthInfluences,
      transitSignals,
      monthSignals
    });
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
      fortuneAnalysis,
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
        <label><span>默认 AI 分析年份</span><input type="number" name="defaultAiYear" min="1900" max="2100" value="${Number(state.targetYear) || now.getFullYear()}" required /></label>
        <label class="switch-row"><input type="checkbox" name="preInterpretAi" ${state.preInterpretAi ? "checked" : ""} /><span>AI 预先解读</span></label>
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
    bindChange("defaultAiYear", el => { state.targetYear = clampYear(el.value); state.selectedLuckIndex = undefined; });
    byName("trueSolarTime")?.addEventListener("change", e => { state.trueSolarTime = e.target.checked; rerenderSettingsOnly(); });
    byName("preInterpretAi")?.addEventListener("change", e => { state.preInterpretAi = e.target.checked; });
    byId("birthFormInner")?.addEventListener("submit", e => {
      e.preventDefault();
      state.targetYear = clampYear(byName("defaultAiYear")?.value || state.targetYear);
      state.preInterpretAi = Boolean(byName("preInterpretAi")?.checked);
      state.selectedLuckIndex = undefined;
      resetFlowAiReports();
      refresh();
      if (state.preInterpretAi) setTimeout(() => triggerInitialFlowAiReports(["luck", "year"], { reveal: true }), 0);
    });
  }

  function renderChart(data) {
    const chart = data.chart;
    const d = chart.pillarDetails;
    byId("chartSummary").innerHTML = `
      <div class="plugin-header"><p class="eyebrow">核心命盘</p><h2>基础排盘展示</h2></div>
      ${renderChartTopline(chart)}
      <div class="bazi-matrix">
        <div class="matrix-row matrix-head"><span></span>${["year", "month", "day", "hour"].map(k => `<b>${d[k].label}</b>`).join("")}</div>
        <div class="matrix-row ten-god-row"><span>天干十神</span>${["year", "month", "day", "hour"].map(k => `<em>${d[k].stemTenGod}</em>`).join("")}</div>
        <div class="matrix-row main-symbol-row"><span>天干</span>${["year", "month", "day", "hour"].map(k => renderSymbol(d[k].pillar.stem, d[k].pillar.stemElement, d[k].pillar.yinYang)).join("")}</div>
        <div class="matrix-row main-symbol-row"><span>地支</span>${["year", "month", "day", "hour"].map(k => renderSymbol(d[k].pillar.branch, d[k].pillar.branchElement)).join("")}</div>
        <div class="matrix-row ten-god-row"><span>地支主气十神</span>${["year", "month", "day", "hour"].map(k => `<em>${d[k].branchMainTenGod}</em>`).join("")}</div>
        <div class="matrix-row hidden-row"><span>完整藏干</span>${["year", "month", "day", "hour"].map(k => `<small>${renderHidden(d[k].hiddenStems)}</small>`).join("")}</div>
        <div class="matrix-row shensha-row"><span>神煞</span>${["year", "month", "day", "hour"].map(k => renderPillarShensha(d[k].shensha)).join("")}</div>
      </div>
      ${renderRelationOverview(chart)}
      ${renderTabs(chart)}`;
    bindTabs();
  }

  function renderTabs(chart) {
    const auxiliaryTabs = [
      ["shensha", "神煞总表", renderShenshaStats(chart)], ["nayin-growth", "纳音长生", renderNayinGrowth(chart)], ["voids", "空亡旬空", renderVoidStats(chart)], ["elements", "五行详表", renderElementStats(chart)], ["expert", "专家明细", renderExpert(chart)], ["calendar", "历法依据", renderCalendar(chart)],
    ];
    return `<details class="auxiliary-observation"><summary>辅助观察项：神煞总表、纳音、十二长生、旬空、五行详表、专家明细、历法依据</summary>${renderTabSection(auxiliaryTabs)}</details>`;
  }

  function renderChartTopline(chart) {
    const visible = chart.elementStats.visible.counts;
    return `<div class="chart-topline"><article class="chart-topline-item chart-topline-primary"><span>日主</span><strong>${chart.pillars.day.stem}${elementLabels[chart.dayMaster.element]}</strong></article><article class="chart-topline-item"><span>月令</span><strong>${chart.pillars.month.branch}${elementLabels[chart.pillars.month.branchElement]}</strong></article><article class="chart-topline-item element-mini"><span>五行</span>${renderElementBars(visible)}</article></div>`;
  }

  function renderElementBars(counts) {
    const max = Math.max(1, ...Object.keys(elementLabels).map(key => Number(counts[key] || 0)));
    return `<span class="element-bars">${Object.entries(elementLabels).map(([key, label]) => {
      const value = Number(counts[key] || 0);
      const level = Math.max(4, Math.round((value / max) * 100));
      return `<i class="topline-element-bar element-${key}" style="--level:${level}%"><b>${label}</b><em>${value}</em></i>`;
    }).join("")}</span>`;
  }

  function renderPillarShensha(items = []) {
    const list = items.slice(0, 3);
    const more = items.length > list.length ? `<em>+${items.length - list.length}</em>` : "";
    return `<small class="pillar-shensha">${list.length ? list.map(item => `<i>${item.name}</i>`).join("") + more : "<i>未列</i>"}</small>`;
  }

  function renderRelationOverview(chart) {
    const relations = chart.relations || [];
    return `<details class="relation-overview"><summary><span>干支关系 <b>${relations.length ? `${relations.length} 条` : "未命中"}</b></span><i class="relation-toggle-hint" aria-hidden="true"><em class="is-closed">展开查看</em><em class="is-open">收起</em></i></summary>${relations.length ? `<div class="relation-chip-list">${relations.map(r => `<details><summary>${r.ganzhi.join(" / ")} · ${r.type}${r.effect}</summary><p>${relationReadingText(r)}</p></details>`).join("")}</div>` : `<p class="fine-print">当前启用规则未命中明显合冲害关系，继续看十神、月令和岁运触发。</p>`}</details>`;
  }

  function renderTabSection(tabs) {
    return `<section class="core-tabs"><div class="core-tab-list">${tabs.map(([id, label], i) => `<button type="button" class="core-tab ${i === 0 ? "is-active" : ""}" data-tab="${id}">${label}</button>`).join("")}</div>${tabs.map(([id, , html], i) => `<div class="core-tab-panel ${i === 0 ? "is-active" : ""}" data-panel="${id}" ${i ? "hidden" : ""}>${html}</div>`).join("")}</section>`;
  }

  function renderCoreSignals(data) {
    const core = data.coreSignals;
    const visibleGroups = core.groups.filter(group => group.key !== "auxiliary");
    const auxiliaryGroups = core.groups.filter(group => group.key === "auxiliary");
    const visibleTotal = visibleGroups.reduce((sum, group) => sum + group.signals.length, 0);
    const auxiliaryTotal = auxiliaryGroups.reduce((sum, group) => sum + group.signals.length, 0);
    byId("coreSignals").innerHTML = `<div class="plugin-header"><p class="eyebrow">原局总览</p><h2>命盘结构解读</h2></div><section class="reading-overview"><span>一句话总览</span><p>${core.overview}</p></section><details class="evidence-library"><summary><span>取象证据库</span><b>${visibleTotal + auxiliaryTotal} 条</b></summary><section class="reading-panel"><div class="board-title"><h3>核心取象</h3><span>${visibleTotal} 条</span></div><div class="core-signal-matrix"><table><thead><tr><th>分组</th><th>观察点</th><th>类型</th><th>原始依据</th><th>取象关键词</th><th>展开解释</th></tr></thead><tbody>${visibleGroups.map(group => group.signals.map(signal => renderCoreSignalRow(signal, group.title)).join("")).join("")}</tbody></table></div></section><section class="reading-panel"><div class="board-title"><h3>辅助取象</h3><span>${auxiliaryTotal} 条</span></div><div class="core-signal-matrix"><table><thead><tr><th>分组</th><th>观察点</th><th>类型</th><th>原始依据</th><th>取象关键词</th><th>展开解释</th></tr></thead><tbody>${auxiliaryGroups.map(group => group.signals.map(signal => renderCoreSignalRow(signal, group.title)).join("")).join("")}</tbody></table></div></section><section class="professional-evidence"><div class="board-title"><h3>专业依据</h3><span>${core.professional.length} 项</span></div><div class="professional-grid">${core.professional.map(item => `<article><span>${item.label}</span><strong>${item.value}</strong><small>${item.note}</small></article>`).join("")}</div></section></details>`;
  }

  function renderCoreSignalRow(signal, groupTitle) {
    return `<tr class="core-signal-row"><td data-label="分组">${signal.group || groupTitle}</td><td data-label="观察点"><strong>${signal.title}</strong></td><td data-label="类型"><span class="badge">${signal.tag}</span></td><td data-label="原始依据">${signal.evidence}</td><td data-label="取象关键词">${signal.keywords}</td><td data-label="展开解释"><details class="inline-reading"><summary>展开</summary><dl><dt>怎么取的</dt><dd>${signal.evidence}</dd>${renderSignalEventCandidates(signal)}<dt>解释</dt><dd>${signal.plainReading} ${signal.realLifeMeaning} ${signal.caution}</dd></dl></details></td></tr>`;
  }

  function renderSignalCard(signal) {
    if (signal.plainReading) return `<article class="signal reading-card"><div><strong>${signal.title}</strong><span class="badge">${signal.tag}</span></div><dl><dt>怎么取的</dt><dd>${signal.evidence}</dd>${renderSignalEventCandidates(signal)}<dt>解释</dt><dd>${signal.plainReading} ${signal.realLifeMeaning} ${signal.caution}</dd></dl></article>`;
    return `<article class="signal"><div><strong>${signal.tag}</strong><span class="badge">${confidenceLabel(signal.confidence)}</span></div><p>${signal.evidence.join("；")}</p><small>${signal.needVerify.join("；")}</small></article>`;
  }

  function renderSignalEventCandidates(signal) {
    const items = Array.isArray(signal.eventCandidates) && signal.eventCandidates.length ? signal.eventCandidates : deriveEventCandidates(signal);
    return `<dt>候选事象</dt><dd><ul class="event-candidate-list">${items.map(item => `<li>${item}</li>`).join("")}</ul></dd>`;
  }

  function renderFlowAiControls(modes) {
    const labels = { luck: "AI解读大运", year: "AI解读流年", month: "AI解读流月" };
    const attrs = { luck: 'data-ai-mode="luck"', year: 'data-ai-mode="year"', month: 'data-ai-mode="month"' };
    return `<div class="flow-ai-controls">${modes.map(mode => `<button type="button" class="ai-flow-button" ${attrs[mode]} ${flowAiLoading === mode ? "disabled" : ""}>${flowAiLoading === mode ? "生成中..." : labels[mode]}</button>`).join("")}</div>${modes.map(mode => renderFlowAiReport(mode)).join("")}`;
  }

  function renderFlowAiReport(mode) {
    const report = flowAiReports[mode];
    if (!report && flowAiLoading !== mode) return "";
    if (flowAiLoading === mode) return `<article class="ai-report-panel is-loading"><strong>${flowAiModeLabel(mode)}报告</strong><p>正在根据当前矩阵证据生成学习说明...</p></article>`;
    if (report?.coreConclusion) return renderReadableFlowAiReport(mode, report);
    const scenarios = renderFlowAiScenarios(report.scenarios);
    const legacyLists = `<div class="ai-report-grid">${renderFlowAiList("专业证据链", report.keySignals)}${renderFlowAiList("生活落点", report.likelyThemes)}${renderFlowAiList("边界提醒", report.cautions)}${renderFlowAiList("现实验证", report.verificationLimits)}</div>`;
    return `<article class="ai-report-panel"><div class="ai-report-head"><span>AI辅助取象</span><strong>${flowAiModeLabel(mode)}咨询总览</strong></div><p>${escapeHtml(report.summary)}</p>${scenarios || legacyLists}</article>`;
  }

  function renderReadableFlowAiReport(mode, report) {
    const placeholder = report.isPlaceholder ? `<span class="ai-placeholder-badge">本地占位报告</span>` : "";
    const titles = readableReportSectionTitles(mode);
    const monthBlock = mode === "month" && Array.isArray(report.monthlyHighlights) && report.monthlyHighlights.length
      ? `<section class="ai-report-section"><h4>${titles.months}</h4><div class="ai-month-list">${report.monthlyHighlights.map(renderAiMonth).join("")}</div></section>`
      : "";
    return `<article class="ai-report-panel ai-readable-report">
      <div class="ai-report-head"><span>AI短解${placeholder}</span><strong>${escapeHtml(report.title || `${flowAiModeLabel(mode)}解读`)}</strong></div>
      <p class="ai-one-line">${escapeHtml(shortText(report.coreConclusion, 42))}</p>
      <section class="ai-report-section compact"><h4>${titles.events}</h4><div class="ai-focus-list compact">${(report.likelyEvents || []).map(renderAiLikelyEvent).join("")}</div></section>
      ${monthBlock}
      <p class="ai-boundary">${escapeHtml(shortText(report.boundary || "以上为学习型观察边界，请结合现实反馈复核。", 36))}</p>
    </article>`;
  }

  function readableReportSectionTitles(mode) {
    if (mode === "luck") {
      return {
        background: "大运取象",
        trigger: "大运依据",
        events: "大运候选事象",
        focus: "大运领域依据",
        months: "",
      };
    }
    if (mode === "month") {
      return {
        background: "",
        trigger: "流月触发",
        events: "流月候选事象",
        focus: "本月领域依据",
        months: "本月应期",
      };
    }
    return {
      background: "",
      trigger: "流年触发",
      events: "流年候选事象",
      focus: "流年领域依据",
      months: "",
    };
  }

  function renderAiReportBlock(title, block = {}) {
    return `<section class="ai-report-section"><h4>${title}</h4><p>${escapeHtml(block.conclusion || "暂无结论")}</p><dl><dt>依据</dt><dd>${renderScenarioItems(block.evidence || [])}</dd><dt>现实表现</dt><dd>${escapeHtml(block.reality || "暂无现实映射")}</dd></dl></section>`;
  }

  function renderAiEventFocus(item = {}) {
    return `<article class="ai-focus-card"><div><strong>${fortuneScoreLabel(item.topic)}</strong><span>${levelLabel(item.level)}</span></div><p>${escapeHtml(item.conclusion || "")}</p><dl><dt>依据</dt><dd>${renderScenarioItems(item.evidence || [])}</dd><dt>现实表现</dt><dd>${escapeHtml(item.reality || "")}</dd><dt>建议</dt><dd>${escapeHtml(item.advice || "")}</dd></dl></article>`;
  }

  function renderAiLikelyEvent(item = {}) {
    const evidence = firstListItem(item.evidence) || "本地触发链不足";
    const possible = item.reality || item.conclusion || item.event || "等待现实反馈";
    return `<article class="ai-focus-card ai-event-brief"><div><strong>${escapeHtml(shortText(item.event || "候选事件", 24))}</strong><span>${levelLabel(item.probabilityLevel)}</span></div><dl><dt>取象</dt><dd>${escapeHtml(shortText(evidence, 42))}</dd><dt>可能的事</dt><dd>${escapeHtml(shortText(possible, 46))}</dd></dl></article>`;
  }

  function renderAiMonth(item = {}) {
    return `<article class="ai-focus-card"><div><strong>${Number(item.month) || "-"}月</strong><span>${levelLabel(item.level)}</span></div><p>${escapeHtml(item.theme || "")}</p><dl><dt>依据</dt><dd>${renderScenarioItems(item.evidence || [])}</dd><dt>现实表现</dt><dd>${escapeHtml(item.reality || "")}</dd><dt>建议</dt><dd>${escapeHtml(item.advice || "")}</dd></dl></article>`;
  }

  function levelLabel(level) {
    return { high: "高触发", medium: "中触发", low: "低触发" }[level] || "观察";
  }

  function renderFlowAiList(title, list = []) {
    return `<section><h4>${title}</h4><ul>${(list.length ? list : ["暂无内容"]).map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul></section>`;
  }

  function renderFlowAiScenarios(scenarios = []) {
    if (!Array.isArray(scenarios) || !scenarios.length) return "";
    return `<div class="ai-scenario-list">${scenarios.map(scenario => `<section class="ai-scenario-card"><h4>候选方向：${escapeHtml(scenario.title || "待验证方向")}</h4><dl><dt>证据链</dt><dd>${renderScenarioItems(scenario.evidence)}</dd><dt>生活落点</dt><dd>${renderScenarioItems(scenario.lifeSignals)}</dd><dt>验证条件</dt><dd>${renderScenarioItems(scenario.verification)}</dd><dt>边界</dt><dd>${escapeHtml(scenario.boundary || "不能单独作为结论。")}</dd></dl></section>`).join("")}</div>`;
  }

  function renderScenarioItems(items = []) {
    const list = Array.isArray(items) && items.length ? items : ["暂无内容"];
    return `<ul>${list.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
  }

  function firstListItem(items = []) {
    return Array.isArray(items) && items.length ? String(items[0] || "") : "";
  }

  function shortText(value = "", maxLength = 48) {
    const text = String(value || "").replace(/\s+/g, " ").split(/[。；;]/u).find(Boolean)?.trim() || "";
    if (text.length <= maxLength) return text;
    return `${text.slice(0, maxLength - 1)}…`;
  }

  function flowAiModeLabel(mode) {
    return { luck: "大运", year: "流年", month: "流月" }[mode] || "岁运";
  }

  async function triggerInitialFlowAiReports(modes, options = {}) {
    for (const mode of modes) {
      await requestFlowAiReport(mode);
    }
    if (options.reveal) revealFlowAiReports();
  }

  function revealFlowAiReports() {
    const report = document.querySelector(".ai-report-panel");
    if (!report) return;
    report.scrollIntoView({ behavior: "smooth", block: "start" });
    setText("status", "AI辅助取象已生成，已定位到下方报告。");
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
      renderYear(lastData);
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
          fortuneAnalysis: lastData.fortuneAnalysis,
        }),
      });
      const result = await response.json();
      flowAiReports[mode] = normalizeFlowAiReport(result.narrative?.report, result.narrative?.text, mode, result.narrative?.isPlaceholder);
      setText("status", `${flowAiModeLabel(mode)}AI辅助取象已生成。`);
    } catch (error) {
      flowAiReports[mode] = createLocalFlowAiReport(mode);
      setText("status", "后端暂不可用：使用本地占位 AI 辅助取象。");
    } finally {
      flowAiLoading = "";
      renderYear(lastData);
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
      flowAiReports[mode] = normalizeFlowAiReport(JSON.parse(text), text, mode, false);
      setText("status", `${flowAiModeLabel(mode)}浏览器直连 DeepSeek 解读已生成。`);
    } catch (error) {
      flowAiReports[mode] = createLocalFlowAiReport(mode);
      setText("status", "浏览器直连 DeepSeek 未成功：已改用本地占位取象。");
    } finally {
      flowAiLoading = "";
      renderYear(lastData);
      renderMonth(lastData);
    }
  }

  function buildBrowserFlowAiPrompt(mode) {
    const modeLabels = { luck: "大运阶段取象", year: "流年年度取象", month: "流月短期取象" };
    const rootFortune = lastData.fortuneAnalysis || {};
    const pickedFortuneAnalysis = pickBrowserFortuneAnalysis(getFortuneAnalysisByMode(mode, rootFortune));
    const modeInstruction = flowModeInstruction(mode);
    return {
      system: [
        "你是命理网站的白话解读层，不是排盘层。",
        "不能重新排盘，不能新增不存在的干支关系，不能补充不存在的干支关系，不能自行改写年份月份。",
        "本地事件引擎已经提供 eventCandidates 和 mainEvents；AI 不再自己判断事件，也不能新增 mainEvents 之外的强判断。",
        "你只能根据 fortuneAnalysis、mainEvents、triggerChains、monthlyHighlights 和 evidencePackage 写解读，且这些字段必须来自当前 mode 对应层级、对应分析层。",
        "你的任务是把本地事件引擎识别出的 1-3 个重点候选事件翻译成非常短的“象 → 可能的事”。",
        "mainEvents 是唯一主线；只重点解释 score 最高的 1-3 个 mainEvents；禁止平均解释所有领域。",
        "每条 likelyEvents 都必须逐条对应一个 mainEvent，不允许新增 mainEvents 之外的强事件。",
        "每条 likelyEvents 必须包含字段，但内容要短：conclusion 一句话，evidence 只放最关键 1 条象，reality 只写 1 句可能的现实事情，verifyBy 最多 2 条，boundary 一句。",
        "如果 mainEvents 为空，必须说明“本地触发链不足，不能硬断年度事件”，likelyEvents 不要补写强事件。",
        "没有 evidenceChain 的事件不能写成强判断，只能放在 boundary 或不写。",
        "输出顺序：先给结论，也就是一句总览；再列候选事象。每条候选事象先讲取象，再讲可能的事。",
        "不要写复杂报告，不要长篇故事。用户只需要类似“2017 年酉触发日支酉，可能遇到初恋、暧昧或确定关系”这种短句。",
        "禁止确定性断语，禁止使用：一定、必定、绝对、必然、必发财、必离婚、必有灾、必坐牢、必死亡。",
        "禁止编造输入里没有的干支关系。",
        "禁止平均解释 12 个月；只有流月模式才写选中月份，其他模式不要展开月份。",
        "大运模式：只讲十年背景如何承载原局，不要把它写成某一年或某个月的完整报告。",
        "流年模式：只讲当年被大运和原局引动的事件链条，不要复述十二个月流水账。",
        "流月模式：只讲选中月份的短期应期，候选事件和 timeWindow 都要聚焦该月。",
        "禁止只说“事业、关系、情绪、注意沟通、保持积极、谨慎行事”这种空话。",
        "不要每句话都重复边界提醒，把学习边界集中放到 boundary 字段，一句话即可。",
        "禁用词：一定、必定、绝对、必然、必离婚、必发财、必有灾、必坐牢、必死亡。",
        "输出 JSON 字段必须为 title、coreConclusion、luckBackground、yearTrigger、likelyEvents、eventFocus、monthlyHighlights、overallAdvice、boundary。",
      ].join("\n"),
      user: JSON["stringify"]({
        mode,
        modeLabel: modeLabels[mode] || modeLabels.year,
        modeInstruction,
        fortuneAnalysis: pickedFortuneAnalysis,
        evidencePackage: buildBrowserEvidencePackage(pickedFortuneAnalysis, { mode, selectedMonthInfluence: lastData.selectedMonthInfluence }),
        referenceOnly: {
          chart: lastData.chart,
          coreSignals: lastData.coreSignals,
          transitSignals: lastData.transitSignals,
          monthSignals: lastData.monthSignals,
          selectedLuck: lastData.selectedLuck,
          yearInfluence: lastData.yearInfluence,
          selectedMonthInfluence: lastData.selectedMonthInfluence,
        },
        output: {
          schema: "title/coreConclusion/luckBackground/yearTrigger/likelyEvents/eventFocus/monthlyHighlights/overallAdvice/boundary",
          order: ["一句总览", "象", "可能的事"],
          style: "极简短句。AI 只解释 fortuneAnalysis.mainEvents，不新增本地没有给出的事件。每个 likelyEvents 只写：根据什么象、可能遇到什么事，不写长建议。",
          modeInstruction,
        },
      }, null, 2),
    };
  }

  function pickBrowserFortuneAnalysis(fortuneAnalysis = {}) {
    return {
      annualTheme: fortuneAnalysis.annualTheme || "",
      overallSummary: fortuneAnalysis.overallSummary || "",
      luckBackground: fortuneAnalysis.luckBackground || {
        conclusion: fortuneAnalysis.decadeTheme || "",
        evidence: fortuneAnalysis.decadeEvidence || [],
        reality: "大运作为十年背景影响当年事件承接方式。",
      },
      eventCandidates: Array.isArray(fortuneAnalysis.eventCandidates) ? fortuneAnalysis.eventCandidates : [],
      mainEvents: Array.isArray(fortuneAnalysis.mainEvents) ? fortuneAnalysis.mainEvents : [],
      triggerChains: Array.isArray(fortuneAnalysis.triggerChains) ? fortuneAnalysis.triggerChains : [],
      eventScores: fortuneAnalysis.eventScores || {},
      monthlyHighlights: Array.isArray(fortuneAnalysis.monthlyHighlights) ? fortuneAnalysis.monthlyHighlights : [],
      lowEvidenceTopics: Array.isArray(fortuneAnalysis.lowEvidenceTopics) ? fortuneAnalysis.lowEvidenceTopics : [],
      advice: Array.isArray(fortuneAnalysis.advice) ? fortuneAnalysis.advice : [],
    };
  }

  function buildBrowserEvidencePackage(fortuneAnalysis = {}, { mode = "year", selectedMonthInfluence } = {}) {
    const mainEvents = Array.isArray(fortuneAnalysis.mainEvents) ? fortuneAnalysis.mainEvents : [];
    const topEventScores = Object.entries(fortuneAnalysis.eventScores || {})
      .sort((a, b) => Number(b[1]?.score || 0) - Number(a[1]?.score || 0))
      .slice(0, 5)
      .map(([topic, value]) => ({
        topic,
        score: Number(value?.score || 0),
        evidence: Array.isArray(value?.evidence) ? value.evidence.slice(0, 4) : [],
      }));
    const triggerChains = Array.isArray(fortuneAnalysis.triggerChains) ? fortuneAnalysis.triggerChains.slice(0, 8) : [];
    const monthlyHighlights = Array.isArray(fortuneAnalysis.monthlyHighlights) ? fortuneAnalysis.monthlyHighlights.slice(0, 5) : [];
    const selectedMonth = Number(selectedMonthInfluence?.month || 0);
    const pickedMonthlyHighlights = mode === "month" && selectedMonth
      ? monthlyHighlights.filter(month => Number(month.month) === selectedMonth)
      : mode === "luck" || mode === "year" ? [] : monthlyHighlights;
    const modeTriggerChains = mode === "luck" || mode === "month" ? [] : triggerChains;
    const modeEventScores = mode === "luck"
      ? inferBrowserScoresFromEvidence(fortuneAnalysis.luckBackground?.evidence, fortuneAnalysis.decadeRiskTags, fortuneAnalysis.decadeSupportScore)
      : mode === "month"
        ? inferBrowserScoresFromEvidence(pickedMonthlyHighlights.flatMap(month => month.reasons || selectedMonthInfluence?.evidence || []), [], pickedMonthlyHighlights[0]?.score)
        : topEventScores;
    return {
      role: "本地当前层级事件证据包；AI 只能解释 mainEvents，不允许补充不存在的干支关系或新增事件。",
      mode,
      modeInstruction: flowModeInstruction(mode),
      luckBackground: fortuneAnalysis.luckBackground,
      mainEvents: mainEvents.slice(0, 3).map(event => ({
        eventType: event.eventType,
        score: event.score,
        level: event.level,
        confidence: event.confidence,
        evidenceChain: Array.isArray(event.evidenceChain) ? event.evidenceChain.slice(0, 6) : [],
        possibleManifestations: Array.isArray(event.possibleManifestations) ? event.possibleManifestations.slice(0, 5) : [],
        timing: Array.isArray(event.timing) ? event.timing.slice(0, 5) : [],
      })),
      triggerChains: modeTriggerChains.map(chain => ({
        level: chain.level,
        type: chain.type,
        source: chain.source,
        target: chain.target,
        topicHints: chain.topicHints,
        strength: chain.strength,
        reason: chain.reason,
        tags: chain.tags,
        weight: chain.weight,
        evidence: chain.evidence,
        realityMapping: chain.realityMapping,
      })),
      topEventScores: mainEvents.length ? mainEvents.slice(0, 3).map(event => ({
        topic: event.eventType,
        score: event.score,
        evidence: Array.isArray(event.evidenceChain) ? event.evidenceChain.slice(0, 4) : [],
      })) : modeEventScores,
      selectedMonth: mode === "month" ? {
        month: selectedMonth || selectedMonthInfluence?.month,
        pillar: selectedMonthInfluence?.pillar?.label || selectedMonthInfluence?.pillar,
        evidence: selectedMonthInfluence?.evidence,
      } : null,
      timeWindows: pickedMonthlyHighlights.map(month => ({
        month: month.month,
        pillar: month.pillar,
        intensity: month.intensity,
        reasons: month.reasons,
      })),
    };
  }

  function inferBrowserScoresFromEvidence(evidence = [], tags = [], score = 55) {
    const evidenceList = Array.isArray(evidence) ? evidence : [String(evidence || "")].filter(Boolean);
    const topics = uniqueText([
      ...(Array.isArray(tags) ? tags : []).filter(tag => ["career", "wealth", "relationship", "study", "health", "movement", "social"].includes(tag)),
      ...topicHintsFromText(evidenceList.join(" ")),
    ]);
    const picked = topics.length ? topics : ["career", "study", "social"];
    return picked.slice(0, 5).map((topic, index) => ({
      topic,
      score: Math.max(35, Math.min(100, Number(score || 55) - index * 5)),
      evidence: evidenceList.length ? evidenceList.slice(0, 4) : ["当前模式只使用本层级证据。"],
    }));
  }

  function topicHintsFromText(text = "") {
    const topics = [];
    if (/官|杀|规则|职责|流程|事业|任务/.test(text)) topics.push("career");
    if (/财|资源|收支|付款|报价|预算/.test(text)) topics.push("wealth");
    if (/关系|合作|夫妻|亲密/.test(text)) topics.push("relationship");
    if (/印|食神|伤官|学习|表达|文书|作品|证照/.test(text)) topics.push("study");
    if (/害|刑|穿|压力|作息|体感|安全/.test(text)) topics.push("health");
    if (/冲|迁移|搬动|出行|地点|通勤/.test(text)) topics.push("movement");
    if (/比肩|劫财|同辈|团队|朋友|人际/.test(text)) topics.push("social");
    return topics;
  }

  function flowModeInstruction(mode = "year") {
    if (mode === "luck") return "大运报告只回答：这步大运给原局带来什么十年背景、哪些领域被长期放大、阶段里反复出现什么候选事象。";
    if (mode === "month") return "流月报告只回答：选中月份发生什么短期应期，本月哪些事变明显，不平均解释其他月份。";
    return "流年报告只回答：这一年自身触发了什么候选事件、依据是什么、现实中可能表现成什么。";
  }

  function normalizeFlowAiReport(report, text, mode, isPlaceholder = false) {
    const fallback = createLocalFlowAiReport(mode, true);
    if (!report) return { ...fallback, coreConclusion: text || fallback.coreConclusion, isPlaceholder: true };
    if (report.coreConclusion || report.eventFocus || report.monthlyHighlights) {
      return sanitizeLocalAiReport({
        title: report.title || fallback.title,
        coreConclusion: report.coreConclusion || text || fallback.coreConclusion,
        luckBackground: normalizeAiBlock(report.luckBackground, fallback.luckBackground),
        yearTrigger: normalizeAiBlock(report.yearTrigger, fallback.yearTrigger),
        likelyEvents: normalizeAiLikelyEvents(report.likelyEvents, fallback.likelyEvents),
        eventFocus: normalizeAiEventFocus(report.eventFocus, fallback.eventFocus),
        monthlyHighlights: normalizeAiMonths(report.monthlyHighlights, fallback.monthlyHighlights),
        overallAdvice: normalizeTextList(report.overallAdvice, fallback.overallAdvice),
        boundary: report.boundary || fallback.boundary,
        isPlaceholder: Boolean(isPlaceholder),
      });
    }
    return {
      summary: report.summary || fallback.summary,
      keySignals: Array.isArray(report.keySignals) ? report.keySignals : fallback.keySignals,
      likelyThemes: Array.isArray(report.likelyThemes) ? report.likelyThemes : fallback.likelyThemes,
      cautions: Array.isArray(report.cautions) ? report.cautions : fallback.cautions,
      verificationLimits: Array.isArray(report.verificationLimits) ? report.verificationLimits : fallback.verificationLimits,
      scenarios: normalizeFlowAiScenarios(report.scenarios, fallback.scenarios),
      isPlaceholder: Boolean(isPlaceholder),
    };
  }

  function normalizeAiBlock(value, fallback) {
    return {
      conclusion: value?.conclusion || fallback.conclusion,
      evidence: normalizeTextList(value?.evidence, fallback.evidence),
      reality: value?.reality || fallback.reality,
    };
  }

  function normalizeAiEventFocus(value, fallback) {
    if (!Array.isArray(value) || !value.length) return fallback;
    return value.map((item, index) => {
      const base = fallback[index] || fallback[0];
      return {
        topic: ["career", "wealth", "relationship", "study", "health", "movement", "social"].includes(item?.topic) ? item.topic : base.topic,
        level: ["high", "medium", "low"].includes(item?.level) ? item.level : base.level,
        conclusion: item?.conclusion || base.conclusion,
        evidence: normalizeTextList(item?.evidence, base.evidence),
        reality: item?.reality || base.reality,
        advice: item?.advice || base.advice,
      };
    });
  }

  function normalizeAiLikelyEvents(value, fallback) {
    if (!Array.isArray(value) || !value.length) return fallback;
    return value.map((item, index) => {
      const base = fallback[index] || fallback[0];
      return {
        event: item?.event || base.event,
        conclusion: item?.conclusion || base.conclusion,
        probabilityLevel: ["high", "medium", "low"].includes(item?.probabilityLevel) ? item.probabilityLevel : base.probabilityLevel,
        timeWindow: item?.timeWindow || base.timeWindow,
        timing: item?.timing || base.timing,
        evidence: normalizeTextList(item?.evidence, base.evidence),
        reality: item?.reality || base.reality,
        advice: item?.advice || base.advice,
        verifyBy: normalizeTextList(item?.verifyBy, base.verifyBy),
        boundary: item?.boundary || base.boundary,
      };
    });
  }

  function normalizeAiMonths(value, fallback) {
    if (!Array.isArray(value) || !value.length) return fallback;
    return value.map((item, index) => {
      const base = fallback[index] || fallback[0];
      return {
        month: Number(item?.month || base.month),
        level: ["high", "medium", "low"].includes(item?.level) ? item.level : base.level,
        theme: item?.theme || base.theme,
        evidence: normalizeTextList(item?.evidence, base.evidence),
        reality: item?.reality || base.reality,
        advice: item?.advice || base.advice,
      };
    });
  }

  function normalizeFlowAiScenarios(value, fallback) {
    if (!Array.isArray(value) || !value.length) return fallback;
    return value.map((scenario, index) => {
      const fallbackScenario = fallback[index] || fallback[0];
      return {
        title: scenario?.title || fallbackScenario.title,
        evidence: normalizeTextList(scenario?.evidence, fallbackScenario.evidence),
        lifeSignals: normalizeTextList(scenario?.lifeSignals, fallbackScenario.lifeSignals),
        verification: normalizeTextList(scenario?.verification, fallbackScenario.verification),
        boundary: scenario?.boundary || fallbackScenario.boundary,
      };
    });
  }

  function normalizeTextList(value, fallback) {
    return Array.isArray(value) && value.length ? value.map(item => String(item)) : fallback;
  }

  function createLocalFlowAiReport(mode, isPlaceholder = true) {
    return buildLocalReadableAiReport(mode, isPlaceholder);
  }

  function createLocalFlowAiScenarios(mode) {
    return buildLocalEventCandidateReport(mode).scenarios;
  }

  function getFortuneAnalysisByMode(mode, fortune = lastData?.fortuneAnalysis || {}) {
    if (mode === "luck") {
      return fortune.luckAnalysis || {};
    }
    if (mode === "month") {
      return fortune.monthAnalysis || {};
    }
    return fortune.yearAnalysis || {};
  }

  function buildLocalReadableAiReport(mode, isPlaceholder = true) {
    const rootFortune = lastData?.fortuneAnalysis || {};
    const fortune = getFortuneAnalysisByMode(mode, rootFortune);

    const annualTopEvents = Array.isArray(fortune.mainEvents) && fortune.mainEvents.length
      ? fortune.mainEvents.map(event => [event.eventType, {
        score: event.score,
        evidence: event.evidenceChain,
        candidate: event,
      }])
      : [];

    const triggerChains = Array.isArray(fortune.triggerChains) ? fortune.triggerChains : [];
    const months = mode === "month" && Array.isArray(fortune.monthlyHighlights)
      ? fortune.monthlyHighlights.slice(0, 5)
      : [];

    const context = selectLocalReportContext(mode, {
      fortune,
      rootFortune,
      topEvents: annualTopEvents,
      triggerChains,
      months
    });
    const likelyEvents = buildLocalLikelyEvents(context.topEvents, context.triggerChains, context.months, mode, context.selectedMonth);
    const legacy = buildLocalEventCandidateReport(mode);
    const report = {
      title: context.title,
      coreConclusion: context.coreConclusion(likelyEvents),
      luckBackground: {
        conclusion: context.luckConclusion,
        evidence: normalizeTextList(fortune.luckBackground?.evidence, fortune.decadeEvidence || []).slice(0, 4),
        reality: context.luckReality,
      },
      yearTrigger: {
        conclusion: context.yearTriggerConclusion,
        evidence: context.triggerChains.flatMap(chain => normalizeTextList(chain.evidence, chain.reason ? [chain.reason] : [])).slice(0, 5),
        reality: context.triggerReality(likelyEvents),
      },
      likelyEvents,
      eventFocus: context.topEvents.map(([topic, score]) => ({
        topic: localScoreKeyForEventType(topic),
        level: scoreLevel(score?.score),
        conclusion: `${fortuneScoreLabel(localScoreKeyForEventType(topic))}：${context.focusPrefix}${levelLabel(scoreLevel(score?.score))}证据，作为候选事件来源参考。`,
        evidence: normalizeTextList(score?.evidence, ["当前本地规则没有给出更高权重触发链。"]).slice(0, 4),
        reality: eventReality(localScoreKeyForEventType(topic)),
        advice: eventAdvice(localScoreKeyForEventType(topic)),
      })),
      monthlyHighlights: context.months.map(month => ({
        month: Number(month.month),
        level: month.intensity || scoreLevel(month.score),
        theme: `${month.pillar || ""}${month.intensity || ""}触发窗口`,
        evidence: normalizeTextList(month.reasons, ["本月作为规则引擎挑出的观察窗口。"]).slice(0, 4),
        reality: "本月重点盯职责变化、合同流程、付款资源、关系协作或出行改期。",
        advice: "只记录本月实际出现的事，不把没有发生的主题硬套进去。",
      })),
      overallAdvice: context.overallAdvice,
      boundary: "以上为本地规则取象后的白话整理，请结合现实反馈复核。",
      isPlaceholder,
      summary: legacy.summary,
      keySignals: legacy.keySignals,
      likelyThemes: legacy.likelyThemes,
      cautions: legacy.cautions,
      verificationLimits: legacy.verificationLimits,
      scenarios: legacy.scenarios,
    };
    return sanitizeLocalAiReport(ensureLocalReadableReport(report));
  }

  function selectLocalReportContext(mode, { fortune, rootFortune = {}, topEvents, triggerChains, months }) {
    const selectedMonth = Number(lastData?.selectedMonthInfluence?.month || state.selectedMonth || months[0]?.month || 1);
    const selectedMonthHighlight = months.find(month => Number(month.month) === selectedMonth) || {
      month: selectedMonth,
      pillar: lastData?.selectedMonthInfluence?.pillar?.label || "",
      intensity: "medium",
      reasons: ["当前流月由页面选中月份进入短期应期判断。"],
    };
    const luckEvidence = normalizeTextList(
      rootFortune.luckBackground?.evidence || fortune.luckBackground?.evidence,
      rootFortune.decadeEvidence || fortune.decadeEvidence || []
    );
    const luckBackground = rootFortune.luckBackground || fortune.luckBackground || {};
    const luckEvents = buildLocalEventEntriesFromEvidence({
      evidence: luckEvidence,
      fallbackTopics: fortune.decadeRiskTags || [],
      fallbackEntries: topEvents,
      score: Number(fortune.decadeSupportScore || 55),
    }).slice(0, 4);
    const monthEvents = buildLocalEventEntriesFromEvidence({
      evidence: normalizeTextList(selectedMonthHighlight.reasons, []),
      fallbackEntries: topEvents,
      score: scoreFromIntensity(selectedMonthHighlight.intensity),
    }).slice(0, 3);
    if (mode === "luck") {
      return {
        selectedMonth,
        topEvents: luckEvents,
        triggerChains: [{
          reason: luckBackground.conclusion || "当前大运形成十年阶段背景。",
          tags: luckEvents.map(([topic]) => topic),
          weight: Math.max(3, Math.round(Number(fortune.decadeSupportScore || 55) / 18)),
          evidence: luckEvidence,
        }],
        months: [],
        title: `${flowAiModeLabel(mode)}十年背景解读`,
        coreConclusion: events => events.length
          ? `这步大运先看十年背景：${events.slice(0, 3).map(item => item.event).join("；")}。`
          : "这步大运先看十年内职责、资源、关系和迁动承接方式的变化。",
        luckConclusion: luckBackground.conclusion || "当前大运形成十年阶段背景。",
        luckReality: conciseText(luckBackground.reality) || "十年背景主要影响资源条件、职责压力、合作节奏和阶段性承接方式。",
        yearTriggerConclusion: "本段只分析大运本身：看这十年背景提供、放大或消耗哪些原局主题。",
        triggerReality: events => events.length
          ? `现实中先看这些事是否在十年阶段里反复出现：${events.slice(0, 3).map(item => item.event).join("、")}。`
          : "现实中先看资源条件、职责压力、合作节奏和迁动承接方式。",
        focusPrefix: "大运背景下的",
        overallAdvice: ["只看这步大运反复放大的阶段主题。", "把十年阶段里的职责、资源、关系和迁动变化做长期记录。", "不在大运报告里展开某一年或某一个月。"],
      };
    }
    if (mode === "month") {
      return {
        selectedMonth,
        topEvents: monthEvents,
        triggerChains: [{
          reason: `${selectedMonth}月流月信号进入短期应期。`,
          tags: monthEvents.map(([topic]) => topic),
          weight: Math.max(2, Math.round(scoreFromIntensity(selectedMonthHighlight.intensity) / 18)),
          evidence: normalizeTextList(selectedMonthHighlight.reasons, []),
        }],
        months: [selectedMonthHighlight],
        title: `${selectedMonth}月${flowAiModeLabel(mode)}应期解读`,
        coreConclusion: events => events.length
          ? `${selectedMonth}月优先看：${events.slice(0, 3).map(item => item.event).join("；")}。`
          : `${selectedMonth}月先看当月是否出现职责、资源、关系或出行安排的短期变化。`,
        luckConclusion: "流月报告不展开大运背景，只保留当前月份的短期触发。",
        luckReality: "本段看本月日程、沟通、流程、资源和地点安排是否变明显。",
        yearTriggerConclusion: `${selectedMonth}月流月信号进入短期应期，只看本月变明显的事。`,
        triggerReality: events => events.length
          ? `本月现实中先盯${events.slice(0, 3).map(item => item.event).join("、")}。`
          : "本月只看短期日程、流程、沟通和地点安排是否变明显。",
        focusPrefix: "流月应期里的",
        overallAdvice: [`只记录${selectedMonth}月实际出现的事。`, "把本月流程、沟通、资源和地点安排单独复盘。", "不把其他月份的信号套到本月。"],
      };
    }
    return {
      selectedMonth,
      topEvents,
      triggerChains,
      months: [],
      title: `${fortune.annualTheme || flowAiModeLabel(mode)}结构化解读`,
      coreConclusion: events => events.length
        ? `今年优先看：${events.slice(0, 3).map(item => item.event).join("；")}。`
        : firstSentence(fortune.overallSummary) || "今年先看职责、资源、关系和时间表是否出现具体调整。",
      yearTriggerConclusion: triggerChains[0]?.reason || "流年把原局与大运中的重点主题推到当年。",
      luckConclusion: "流年报告不展开大运，只分析当年触发本身。",
      luckReality: "本段看年度干支、十神和原局关系把哪些现实主题推到当年。",
      triggerReality: conciseTriggerReality,
      focusPrefix: "流年触发后的",
      overallAdvice: ["只看这一年自身被触发的候选事项。", "把今年出现的职责、资源、关系和迁动变化记录成清单。", "流月应期留到流月报告单独判断。"],
    };
  }

  function buildLocalEventEntriesFromEvidence({ evidence = [], fallbackTopics = [], fallbackEntries = [], score = 55 } = {}) {
    const topics = uniqueText([
      ...normalizeTextList(fallbackTopics, []).filter(topic => ["career", "wealth", "relationship", "study", "health", "movement", "social"].includes(topic)),
      ...topicHintsFromText(normalizeTextList(evidence, []).join(" ")),
    ]);
    const pickedTopics = topics.length ? topics : fallbackEntries.map(([topic]) => topic).slice(0, 3);
    const entries = pickedTopics.map((topic, index) => [topic, {
      score: Math.max(35, Math.min(100, Number(score) - index * 5)),
      evidence: normalizeTextList(evidence, []).length ? normalizeTextList(evidence, []).slice(0, 4) : normalizeTextList(fallbackEntries[index]?.[1]?.evidence, []).slice(0, 3),
    }]);
    return entries.length ? entries : [["career", { score, evidence: normalizeTextList(evidence, ["当前层级只保留低强度观察。"]) }]];
  }

  function scoreFromIntensity(intensity) {
    return { high: 78, medium: 56, low: 36 }[intensity] || 50;
  }

  function ensureLocalReadableReport(report) {
    return {
      ...report,
      likelyEvents: report.likelyEvents.length ? report.likelyEvents : [{
        event: "本地触发链不足",
        conclusion: "本地触发链不足，不能硬断年度事件。",
        probabilityLevel: "low",
        timeWindow: "不指定强事件窗口",
        timing: "不指定强事件窗口",
        evidence: ["当前本地证据包没有给出 mainEvents。"],
        reality: "只能作为趋势观察入口，不能写成明确年度事件。",
        advice: "先记录现实反馈，等触发链更明确时再展开。",
        verifyBy: ["是否出现现实反馈", "是否有对应柱位、十神和岁运证据", "是否存在流月再次触发"],
        boundary: "本地触发链不足，不能硬断年度事件。",
      }],
      eventFocus: report.eventFocus.length ? report.eventFocus : [{
        topic: "career",
        level: "low",
        conclusion: "事业先作为低强度观察项。",
        evidence: ["当前本地规则没有给出更高权重触发链。"],
        reality: eventReality("career"),
        advice: eventAdvice("career"),
      }],
      monthlyHighlights: Array.isArray(report.monthlyHighlights) ? report.monthlyHighlights : [],
    };
  }

  function buildLocalLikelyEvents(topEvents = [], triggerChains = [], monthlyHighlights = [], mode = "year", selectedMonth) {
    return topEvents.slice(0, 5).map(([topic, score], index) => {
      if (score?.candidate) {
        const candidate = score.candidate;
        const eventText = normalizeTextList(candidate.possibleManifestations, [localEventLabel(candidate.eventType)])[0];
        const timing = normalizeTextList(candidate.timing, [eventTimeWindow(monthlyHighlights[index % Math.max(monthlyHighlights.length, 1)] || {}, scoreLevel(candidate.score), mode, selectedMonth)])[0];
        const evidence = normalizeTextList(candidate.evidenceChain, [])[0] || "本地触发链命中";
        const reality = normalizeTextList(candidate.possibleManifestations, [eventReality(localScoreKeyForEventType(candidate.eventType))])[0];
        return {
          event: eventText,
          conclusion: `${evidence}，可能是${eventText}。`,
          probabilityLevel: scoreLevel(candidate.score),
          timeWindow: timing,
          timing,
          evidence: [evidence],
          reality,
          advice: "只当候选事象看，等现实反馈验证。",
          verifyBy: normalizeTextList(candidate.timing, []).slice(0, 1).concat(["现实中是否出现对应事项"]).slice(0, 2),
          boundary: "这是本地事件引擎给出的候选事件，需要结合现实反馈、柱位、旺衰、十神和岁运继续验证，不能单独作为结论。",
        };
      }
      const chains = triggerChains.filter(chain => Array.isArray(chain.tags) && chain.tags.includes(topic));
      const chain = chains[0] || triggerChains[index] || {};
      const month = monthlyHighlights[index % Math.max(monthlyHighlights.length, 1)] || {};
      const template = normalizeTemplateForMode(likelyEventTemplate(topic, mode), mode);
      const probabilityLevel = scoreLevel(score?.score || chain.weight * 18);
      const evidence = uniqueText([
        ...normalizeTextList(score?.evidence, []).slice(0, 2),
        ...normalizeTextList(chain.evidence, []).slice(0, 2),
        chain.reason,
        month.month ? `${month.month}月${month.pillar || ""}${month.intensity || ""}触发窗口` : "",
      ].filter(Boolean)).slice(0, 1);
      return {
        event: template.event,
        conclusion: `${evidence[0] || topicName(topic)}，可能是${template.event}。`,
        probabilityLevel,
        timeWindow: eventTimeWindow(month, probabilityLevel, mode, selectedMonth),
        timing: eventTimeWindow(month, probabilityLevel, mode, selectedMonth),
        evidence,
        reality: shortText(template.reality, 46),
        advice: "只当候选事象看，等现实反馈验证。",
        verifyBy: normalizeTextList(template.verifyBy, []).slice(0, 2),
        boundary: "这是本地事件引擎给出的候选事件，需要结合现实反馈、柱位、旺衰、十神和岁运继续验证，不能单独作为结论。",
      };
    });
  }

  function likelyEventTemplate(topic, mode = "year") {
    const yearlyTemplates = {
      career: {
        event: "工作职责、项目分工或审批流程出现调整",
        reality: "可能表现为换负责人、任务边界重划、流程审核变多、交付节奏被重新安排。",
        verifyBy: ["是否出现岗位职责变化", "是否有项目负责人或协作对象调整", "是否出现审批、合同、流程节点"],
      },
      wealth: {
        event: "收支安排、报价付款或资源分配需要重新核算",
        reality: "可能表现为预算重排、付款节点延后、报价协商、家庭或团队资源重新分配。",
        verifyBy: ["是否出现大额收支计划", "是否有报价付款或合同金额复核", "是否需要重新分配资源"],
      },
      relationship: {
        event: "亲密关系或合作关系的边界被重新讨论",
        reality: "可能表现为沟通频率变化、分工承诺重谈、关系黏连或合作责任变清楚。",
        verifyBy: ["是否出现关系边界讨论", "是否有合作承诺或分工变化", "是否在重点月份出现反复沟通"],
      },
      study: {
        event: "学习证照、材料文书或表达交付被推到台前",
        reality: "可能表现为报名考试、整理材料、作品发布、方案汇报或技能训练加密。",
        verifyBy: ["是否出现考试证照计划", "是否需要补材料或写方案", "是否有公开表达或作品交付"],
      },
      health: {
        event: "作息体感、压力负荷和安全操作需要复核",
        reality: "可能表现为熬夜增多、节奏被打乱、压力集中、出行或工具操作需要更谨慎。",
        verifyBy: ["是否出现作息波动", "是否出现压力负荷增加", "是否涉及出行、工具或流程安全复核"],
      },
      movement: {
        event: "出行、搬动、通勤或地点安排出现变化",
        reality: "可能表现为临时出差、搬动计划、通勤变化、行程改期或项目地点调整。",
        verifyBy: ["是否出现出行搬动安排", "是否有地点或时间表变化", "是否在重点月份落地"],
      },
      social: {
        event: "同事同辈、朋友或团队协作出现分工摩擦",
        reality: "可能表现为资源归属要说清、合作节奏不一致、同辈比较或团队分工重新协调。",
        verifyBy: ["是否出现团队分工争议", "是否有资源归属讨论", "是否出现同辈竞争或协作摩擦"],
      },
    };
    const yearly = yearlyTemplates[topic] || {
      event: "现实事务出现需要重新安排的节点",
      reality: "可能表现为计划调整、沟通增加、流程复核或资源重新分配。",
      verifyBy: ["是否出现计划变化", "是否需要流程复核", "是否有资源或关系重新安排"],
    };
    const luck = {
      career: { ...yearlyTemplates.career, event: "十年阶段内职责权限、项目角色或流程标准逐步调整" },
      wealth: { ...yearlyTemplates.wealth, event: "十年阶段内收支结构、报价方式或资源配置逐步重算" },
      relationship: { ...yearlyTemplates.relationship, event: "十年阶段内亲密关系或合作边界反复重谈" },
      study: { ...yearlyTemplates.study, event: "十年阶段内学习证照、专业训练或文书能力逐步加重" },
      health: { ...yearlyTemplates.health, event: "十年阶段内作息体感、压力负荷和安全操作需要持续复核" },
      movement: { ...yearlyTemplates.movement, event: "十年阶段内出行、搬动、通勤或项目地点逐步变化" },
      social: { ...yearlyTemplates.social, event: "十年阶段内同辈协作、团队分工或资源归属反复协调" },
    }[topic];
    const month = {
      career: { ...yearlyTemplates.career, event: "本月工作职责、项目分工或审批流程出现短期调整" },
      wealth: { ...yearlyTemplates.wealth, event: "本月收支安排、报价付款或资源分配需要当月核算" },
      relationship: { ...yearlyTemplates.relationship, event: "本月亲密关系或合作关系边界被集中讨论" },
      study: { ...yearlyTemplates.study, event: "本月学习证照、材料文书或表达交付被催动" },
      health: { ...yearlyTemplates.health, event: "本月作息体感、压力负荷和安全操作需要复核" },
      movement: { ...yearlyTemplates.movement, event: "本月出行、搬动、通勤或地点安排出现变化" },
      social: { ...yearlyTemplates.social, event: "本月同事同辈、朋友或团队协作出现分工摩擦" },
    }[topic];
    if (mode === "luck" && luck) return luck;
    if (mode === "month" && month) return month;
    return yearly;
  }

  function normalizeTemplateForMode(template, mode = "year") {
    if (mode === "month") {
      return {
        ...template,
        verifyBy: normalizeTextList(template.verifyBy, []).map(item => item.replaceAll("重点月份", "本月")),
      };
    }
    return {
      ...template,
      verifyBy: normalizeTextList(template.verifyBy, []).map(item => item
        .replaceAll("重点月份", mode === "luck" ? "大运阶段" : "流年层级")
        .replaceAll("在大运阶段出现", "在大运阶段反复出现")),
    };
  }

  function eventTimeWindow(month, probabilityLevel, mode = "year", selectedMonth) {
    if (mode === "luck") return "当前大运十年阶段反复观察";
    if (mode === "month") {
      const monthNumber = Number(selectedMonth || month?.month || 1);
      return `${monthNumber}月${month?.pillar ? ` ${month.pillar}` : ""}，当前流月应期`;
    }
    if (month?.month) return `${month.month}月${month.pillar ? ` ${month.pillar}` : ""}，${month.intensity || probabilityLevel}触发窗口`;
    if (mode === "year") return "全年层面的流年触发，不展开流月应期";
    return probabilityLevel === "high" ? "全年偏高触发，重点看高强度月份" : "全年观察，等重点月份反馈";
  }

  function conciseText(value = "") {
    return String(value || "").replaceAll("现实中可观察", "").replaceAll("是否被触发", "").replaceAll("反馈", "变化").trim();
  }

  function conciseTriggerReality(likelyEvents = []) {
    if (!likelyEvents.length) return "流年触发后，优先看职责、资源、关系、迁动或作息里有没有具体变更。";
    return `流年触发后，先盯${likelyEvents.slice(0, 3).map(item => item.event).join("、")}。`;
  }

  function uniqueText(items = []) {
    return [...new Set(items.map(item => String(item)).filter(Boolean))];
  }

  function firstSentence(value = "") {
    return String(value || "").split(/\n|。/u).find(Boolean)?.trim() || "";
  }

  function scoreLevel(score) {
    const value = Number(score || 0);
    if (value >= 70) return "high";
    if (value >= 40) return "medium";
    return "low";
  }

  function localScoreKeyForEventType(eventType) {
    return {
      relationship_marriage: "relationship",
      wealth_resource: "wealth",
      children_output: "study",
      career_status: "career",
      health_risk: "health",
      movement_change: "movement",
      social_conflict: "social",
      family_home: "social",
    }[eventType] || eventType;
  }

  function localEventLabel(eventType) {
    return {
      relationship_marriage: "关系婚恋",
      wealth_resource: "财与资源",
      children_output: "子与输出",
      career_status: "事业身份",
      health_risk: "作息体感",
      movement_change: "迁移变动",
      social_conflict: "人际合作",
      family_home: "家庭居住",
    }[eventType] || fortuneScoreLabel(localScoreKeyForEventType(eventType));
  }

  function eventReality(topic) {
    return {
      career: "现实中看岗位职责、任务交付、流程审核和项目调整。",
      wealth: "现实中看收支安排、预算分配、报价付款和资源承接。",
      relationship: "现实中看亲密互动、合作边界、沟通摩擦和关系规则。",
      study: "现实中看课程证书、资料整理、技能训练和表达输出。",
      health: "现实中只看作息体感、压力负荷和安全操作复核。",
      movement: "现实中看搬动出行、通勤变化、地点调整和计划改期。",
      social: "现实中看同事同辈、朋友互动、合作分工和沟通密度。",
    }[topic] || "现实中看该主题是否出现明确反馈。";
  }

  function eventAdvice(topic) {
    return {
      career: "把职责、流程、交付节点列清楚，遇到审核或规则变化时留证据。",
      wealth: "把收支、报价、合同和资源分配写成清单，避免只凭感觉判断。",
      relationship: "先看互动频率和边界变化，再看是否有实际协作或承诺动作。",
      study: "把学习目标拆成证书、材料、作品或训练计划，按月份复盘。",
      health: "只做现实层面的作息、压力和安全复核，必要时按专业渠道处理。",
      movement: "提前核对行程、地点、交通和时间表，重要变动保留备选方案。",
      social: "合作前先确认分工、资源归属和沟通节奏。",
    }[topic] || "把现实反馈记录下来，再回到触发链复核。";
  }

  function sanitizeLocalAiReport(value) {
    const forbidden = ["一定", "必定", "绝对", "必然", "必离婚", "必发财", "必有灾", "必坐牢", "必死亡"];
    if (typeof value === "string") return forbidden.reduce((text, word) => text.split(word).join("需复核"), value);
    if (Array.isArray(value)) return value.map(sanitizeLocalAiReport);
    if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, sanitizeLocalAiReport(item)]));
    return value;
  }

  function buildLocalEventCandidateReport(mode) {
    const label = flowAiModeLabel(mode);
    const rows = localEventSignalsForMode(mode);
    const scenarios = rows.length ? rows.map(signal => buildLocalEventScenario(signal, label)).slice(0, mode === "month" ? 4 : 5) : fallbackEventScenarios(label);
    return {
      summary: `${label}本地辅助报告：已把页面矩阵证据翻成具体候选事象，仍需结合现实反馈继续验证，不能单独作为结论。`,
      keySignals: rows.slice(0, 5).map(signal => `证据链 -> ${signal.evidence || signal.title}；候选事象 -> ${deriveEventCandidates(signal).join("；")}`),
      likelyThemes: scenarios.flatMap(s => s.lifeSignals).filter(item => item.includes("候选事象")).slice(0, 8),
      cautions: ["这里不重新排盘，也不补充页面没有列出的干支关系。", sensitiveReviewText()],
      verificationLimits: ["仍需结合原局、大运、流年、流月、柱位、旺衰和实际经历继续验证，不能单独作为结论。"],
      scenarios,
    };
  }

  function localEventSignalsForMode(mode) {
    const source = mode === "month" ? lastData?.monthSignals : lastData?.transitSignals;
    const rows = flattenSignalGroups(source).filter(signal => !String(signal.title || "").includes("未命中"));
    if (mode === "luck") rows.push(...flattenSignalGroups(lastData?.coreSignals).filter(signal => !String(signal.title || "").includes("未命中")).slice(0, 2));
    return rows.length ? rows : flattenSignalGroups(lastData?.coreSignals).filter(signal => !String(signal.title || "").includes("未命中"));
  }

  function flattenSignalGroups(source) {
    if (!source) return [];
    if (Array.isArray(source)) return source.flatMap(flattenSignalGroups);
    if (Array.isArray(source.groups)) return source.groups.flatMap(group => flattenSignalGroups(group.signals).map(signal => ({ ...signal, groupTitle: group.title })));
    if (Array.isArray(source.signals)) return source.signals;
    return source.title || source.evidence || source.keywords ? [source] : [];
  }

  function buildLocalEventScenario(signal, label) {
    return {
      title: `${label}${eventTitleForSignal(signal)}`,
      evidence: [`证据链 -> ${signal.evidence || signal.title || "页面矩阵信号"}`],
      lifeSignals: [...deriveEventCandidates(signal), ...pillarEventTexts(signal), sensitiveReviewText()],
      verification: verificationForSignal(signal),
      boundary: "边界 -> 当前只整理候选事象，不能单独推出具体结果，不能单独作为结论。",
    };
  }

  function fallbackEventScenarios(label) {
    return [
      {
        title: `${label}规则职责与现实安排`,
        evidence: [`证据链 -> ${label}层级已有本地矩阵触发点，需要回看对应十神、五行和干支关系。`],
        lifeSignals: ["候选事象：工作职责变化、流程合规、合同手续复核、任务重新安排。", sensitiveReviewText()],
        verification: ["验证条件 -> 现实中若出现职责、流程、合同或时间表变化，再结合原局和岁运层级复核。"],
        boundary: "边界 -> 不能单独推出具体结果，不能单独作为结论。",
      },
      {
        title: `${label}资源关系与迁动复核`,
        evidence: [`证据链 -> ${label}层级可从十神、五行、合冲害和柱位继续拆分。`],
        lifeSignals: ["候选事象：收支安排、合作摩擦、搬动出行、信息沟通和作息体感波动。", sensitiveReviewText()],
        verification: ["验证条件 -> 现实中若这些主题反复出现，再结合大运、流年、流月和实际反馈继续观察。"],
        boundary: "边界 -> 不能单独推出关系、财务或状态结论，不能单独作为结论。",
      },
    ];
  }

  function deriveEventCandidates(signal) {
    const text = signalTextForEvent(signal);
    const items = [];
    if (hasEventKey(text, ["正官", "七杀", "官杀"])) items.push("候选事象：工作职责变化、考核流程、合规边界、合同手续复核。");
    if (hasEventKey(text, ["正财", "偏财", "财星"])) items.push("候选事象：收支安排、预算分配、客户资源、合作报价或家庭资源承接。");
    if (hasEventKey(text, ["正印", "偏印", "印星"])) items.push("候选事象：课程学习、证书材料、长辈支持、信息吸收或制度内资源申请。");
    if (hasEventKey(text, ["食神", "伤官", "食伤"])) items.push("候选事象：作品输出、公开表达、方案呈现、沟通交付或技术展示。");
    if (hasEventKey(text, ["比肩", "劫财", "比劫"])) items.push("候选事象：同事同辈竞争、合伙分工、朋友互动、团队资源分配或边界调整。");
    if (hasEventKey(text, ["木"])) items.push("候选事象：新计划启动、学习成长、方向调整、关系伸展或长期项目发芽。");
    if (hasEventKey(text, ["火"])) items.push("候选事象：公开表达、被看见、活动热度、作品显化或情绪热度上升。");
    if (hasEventKey(text, ["土"])) items.push("候选事象：家宅配置、资产承载、责任分配、储蓄整理或稳定性议题。");
    if (hasEventKey(text, ["金"])) items.push("候选事象：流程制度、工具技术、标准审核、合规材料或专业训练。");
    if (hasEventKey(text, ["水"])) items.push("候选事象：出行流动、信息沟通、远方消息、学习吸收或情绪体感波动。");
    if (hasEventKey(text, ["冲", "变化", "拉扯", "移动", "重新安排"])) items.push("候选事象：搬动、出行、岗位或项目重新安排、沟通冲突、日程改动。");
    if (hasEventKey(text, ["合", "合象", "牵连", "合绊"])) items.push("候选事象：合作绑定、资源责任被带动、关系黏连、共同项目或协议协商。");
    if (hasEventKey(text, ["害", "隐性", "摩擦", "不顺"])) items.push("候选事象：暗处别扭、沟通误会、流程卡点、配合不畅或细节返工。");
    if (hasEventKey(text, ["同干", "同支", "伏吟", "同象"])) items.push("候选事象：旧项目重提、熟人旧事回到台前、原有责任再被强调或同类问题反复出现。");
    return [...new Set(items.length ? items : ["候选事象：工作职责变化、收支安排、合作摩擦、搬动出行、作息体感波动可作为复核入口。"])];
  }

  function eventTitleForSignal(signal) {
    const text = signalTextForEvent(signal);
    if (hasEventKey(text, ["冲", "变化", "拉扯", "移动", "重新安排"])) return "变动迁移与重新安排";
    if (hasEventKey(text, ["合", "合象", "牵连", "合绊"])) return "合作绑定与资源牵连";
    if (hasEventKey(text, ["害", "隐性", "摩擦", "不顺"])) return "隐性摩擦与细节复核";
    if (hasEventKey(text, ["同干", "同支", "伏吟", "同象"])) return "旧题重现与主题反复";
    if (hasEventKey(text, ["正官", "七杀", "官杀"])) return "规则职责与流程复核";
    if (hasEventKey(text, ["正财", "偏财", "财星"])) return "钱与资源安排";
    if (hasEventKey(text, ["正印", "偏印", "印星"])) return "学习资质与支持系统";
    if (hasEventKey(text, ["食神", "伤官", "食伤"])) return "表达输出与作品交付";
    if (hasEventKey(text, ["比肩", "劫财", "比劫"])) return "同辈竞争与协作边界";
    return signal.title || "候选事象";
  }

  function verificationForSignal(signal) {
    const text = signalTextForEvent(signal);
    const items = [];
    if (hasEventKey(text, ["正官", "七杀", "官杀"])) items.push("验证条件 -> 现实中若出现岗位责任、审核流程、证照手续或合同节点，再结合原局承接和岁运层级复核。");
    if (hasEventKey(text, ["正财", "偏财", "财星"])) items.push("验证条件 -> 现实中若出现付款、报价、资源调配或家庭开支主题，再结合财星位置和日主承载继续验证。");
    if (hasEventKey(text, ["冲", "变化", "拉扯", "移动", "重新安排"])) items.push("验证条件 -> 现实中若出现地点、时间表、合作关系或任务优先级变化，再结合被冲柱位和流月复核。");
    if (hasEventKey(text, ["合", "合象", "牵连", "合绊"])) items.push("验证条件 -> 现实中若出现协作、签约、资源共用或关系牵制，再看是否有月令、透干、根气承接。");
    if (hasEventKey(text, ["害", "隐性", "摩擦", "不顺"])) items.push("验证条件 -> 现实中若出现说不清的卡顿、误会或小流程反复，再结合柱位和岁运层级观察。");
    items.push("验证条件 -> 若现实反馈与候选事象集中重合，再回到柱位、旺衰、十神、岁运继续验证。");
    return [...new Set(items)];
  }

  function pillarEventTexts(signal) {
    const text = signalTextForEvent(signal);
    return [
      ["年柱", "柱位落点：年柱偏外部环境、家族背景、远端资源或公开层面的观察。"],
      ["月柱", "柱位落点：月柱偏工作环境、团队节奏、上级规则或现实运行环境。"],
      ["日柱", "柱位落点：日柱偏自我状态、亲密关系、合作边界或当下体感。"],
      ["时柱", "柱位落点：时柱偏长期项目、下属晚辈、后续安排或未来规划。"],
    ].filter(([key]) => text.includes(key)).map(([, value]) => value);
  }

  function sensitiveReviewText() {
    return "敏感复核：作息体感、流程合规、出行操作安全只作为观察清单，需要结合现实反馈和更多结构验证，不能单独作为结论。";
  }

  function signalTextForEvent(signal) {
    return [signal?.title, signal?.tag, signal?.group, signal?.groupTitle, signal?.evidence, signal?.keywords, signal?.plainReading, signal?.realLifeMeaning, signal?.caution].filter(Boolean).join(" ");
  }

  function hasEventKey(text, keys) {
    return keys.some(key => String(text || "").includes(key));
  }

  function bindFlowAiButtons() {
    document.querySelectorAll("[data-ai-mode]").forEach(button => button.addEventListener("click", () => requestFlowAiReport(button.dataset.aiMode)));
  }

  function resetFlowAiReports() {
    flowAiReports = { luck: null, year: null, month: null };
    flowAiLoading = "";
  }

  function renderTransitSignals(transitSignals, data) {
    const total = transitSignals.groups.reduce((sum, group) => sum + group.signals.length, 0);
    return `<details class="data-board transit-signal-board evidence-library"><summary><span>3. 大运流年取象证据库</span><b>${total + 1} 条</b></summary><p class="fine-print">以下只列出大运、流年与原局之间的触发观察点，不单独作为事件结论。</p>${renderYearEvidence(data)}${renderFlowSignalMatrix("岁运专业速览", transitSignals.groups)}</details>`;
  }

  function renderMonthSignals(monthSignals, data) {
    const total = monthSignals.groups.reduce((sum, group) => sum + group.signals.length, 0);
    return `<details class="data-board month-signal-board evidence-library"><summary><span>5. 流月取象证据库</span><b>${total + 1} 条</b></summary><p class="fine-print">以下只列出当前流月的触发观察点，用于细化时间窗口。</p>${renderMonthEvidence(data)}${renderFlowSignalMatrix("流月专业速览", monthSignals.groups)}</details>`;
  }

  function renderYearEvidence(data) {
    return `<article class="evidence-note"><strong>${data.yearInfluence.year} · ${data.yearInfluence.pillar.label}</strong><p>${data.yearInfluence.evidence.join("；")}</p><div class="tag-row">${data.storyTags.filter(t => t.period === "year").map(t => `<span>${t.tag}</span>`).join("")}</div></article>`;
  }

  function renderMonthEvidence(data) {
    return `<article class="evidence-note"><strong>${data.selectedMonthInfluence.month}月 ${data.selectedMonthInfluence.pillar.label}</strong><p>${data.selectedMonthInfluence.evidence.join("；")}</p><small>${data.selectedMonthInfluence.needVerify.join("；")}</small></article>`;
  }

  function renderFlowAiStage(mode, title, contextLabel, extraClass = "") {
    return `<section class="data-board flow-ai-stage ${extraClass}" data-ai-scope="${mode}"><div class="board-title"><h3>${title}</h3><span>${contextLabel}</span></div>${renderFlowAiControls([mode])}</section>`;
  }

  function renderNatalMiniChart(chart) {
    const details = chart.pillarDetails || {};
    const keys = ["year", "month", "day", "hour"];
    const dayMaster = chart.dayMaster || {};
    const monthPillar = chart.pillars?.month || {};
    const summary = `日主 ${chart.pillars?.day?.stem || ""}${elementLabels[dayMaster.element] || ""} · 月令 ${monthPillar.branch || ""}${elementLabels[monthPillar.branchElement] || ""}`;
    return `<section class="data-board natal-mini-chart"><div class="board-title"><h3>原局对照</h3><span>${summary}</span></div><div class="natal-mini-grid">${keys.map(key => {
      const item = details[key] || {};
      const pillar = item.pillar || chart.pillars?.[key] || {};
      return `<article><span>${item.label || key}</span><strong>${pillar.label || ""}</strong><small>${item.stemTenGod || ""} / ${item.branchMainTenGod || ""}</small></article>`;
    }).join("")}</div></section>`;
  }

  function renderFortuneTransitChart(data) {
    const luck = data.chart.luckCycles;
    const luckIndex = Math.max(0, luck.pillars.findIndex(p => p.index === data.selectedLuck.index));
    const yearIndex = Math.max(0, data.transitYears.findIndex(item => item.year === data.yearInfluence.year));
    const luckTenGods = buildTransitPillarTenGods(data.chart, data.selectedLuck);
    const yearTenGods = data.yearInfluence.tenGods || buildTransitPillarTenGods(data.chart, data.yearInfluence.pillar);
    return `<section class="data-board fortune-transit-board"><div class="board-title"><h3>大运流年盘面</h3><span>${luck.directionLabel} · ${luck.startAgeText} · ${data.yearInfluence.year} ${data.yearInfluence.pillar.label}</span></div><div class="fortune-transit-grid">${renderTransitPillarMatrix({
      title: "1. 大运盘",
      subtitle: `${data.selectedLuck.startAge}-${data.selectedLuck.endAge}岁 · ${data.selectedLuck.startYear}-${data.selectedLuck.endYear}`,
      pillar: data.selectedLuck,
      stemTenGod: luckTenGods.stem,
      branchTenGod: luckTenGods.branch,
      controls: renderFortuneStepper("luck", luck.pillars, luckIndex, data)
    })}${renderTransitPillarMatrix({
      title: "2. 流年盘",
      subtitle: `${data.yearInfluence.year} · 所在大运 ${data.selectedLuck.label}`,
      pillar: data.yearInfluence.pillar,
      stemTenGod: yearTenGods.stem,
      branchTenGod: yearTenGods.branch,
      controls: renderFortuneStepper("year", data.transitYears, yearIndex, data)
    })}${renderNatalTransitMatrix(data)}</div><p class="fine-print">${luck.startNote}</p></section>`;
  }

  function renderTransitPillarMatrix({ title, subtitle, pillar, stemTenGod, branchTenGod, controls }) {
    return `<article class="fortune-transit-card"><div class="transit-card-head"><div><h4>${title}</h4><span>${subtitle}</span></div><strong>${pillar.label}</strong></div><div class="bazi-matrix transit-pillar-matrix"><div class="matrix-row matrix-head"><span></span><b>天干</b><b>地支</b></div><div class="matrix-row ten-god-row"><span>十神</span><em>${stemTenGod || ""}</em><em>${branchTenGod || ""}</em></div><div class="matrix-row main-symbol-row"><span>干支</span>${renderSymbol(pillar.stem, pillar.stemElement, pillar.yinYang)}${renderSymbol(pillar.branch, pillar.branchElement)}</div><div class="matrix-row ten-god-row"><span>五行</span><em>${elementLabels[pillar.stemElement] || ""}</em><em>${elementLabels[pillar.branchElement] || ""}</em></div></div>${controls}</article>`;
  }

  function renderNatalTransitMatrix(data) {
    const details = data.chart.pillarDetails || {};
    const keys = ["year", "month", "day", "hour"];
    return `<article class="fortune-transit-card natal-transit-card"><div class="transit-card-head"><div><h4>3. 基础命盘</h4><span>原局四柱 · 与大运流年合看</span></div><strong>${data.chart.pillars?.day?.label || ""}</strong></div><div class="bazi-matrix transit-pillar-matrix natal-transit-matrix"><div class="matrix-row matrix-head"><span></span>${keys.map(key => `<b>${details[key]?.label || key}</b>`).join("")}</div><div class="matrix-row ten-god-row"><span>天干十神</span>${keys.map(key => `<em>${details[key]?.stemTenGod || ""}</em>`).join("")}</div><div class="matrix-row main-symbol-row"><span>天干</span>${keys.map(key => {
      const pillar = details[key]?.pillar || {};
      return renderSymbol(pillar.stem, pillar.stemElement, pillar.yinYang);
    }).join("")}</div><div class="matrix-row main-symbol-row"><span>地支</span>${keys.map(key => {
      const pillar = details[key]?.pillar || {};
      return renderSymbol(pillar.branch, pillar.branchElement);
    }).join("")}</div><div class="matrix-row ten-god-row"><span>地支主气</span>${keys.map(key => `<em>${details[key]?.branchMainTenGod || ""}</em>`).join("")}</div></div></article>`;
  }

  function renderFortuneStepper(kind, items, activeIndex, data) {
    const isLuck = kind === "luck";
    const safeIndex = Math.max(0, activeIndex);
    const current = items[safeIndex] || items[0] || {};
    const prev = Math.max(0, safeIndex - 1);
    const next = Math.min(items.length - 1, safeIndex + 1);
    const prevAttr = isLuck ? `data-luck-prev="${prev}"` : `data-year-prev="${items[prev]?.year || data.yearInfluence.year}"`;
    const nextAttr = isLuck ? `data-luck-next="${next}"` : `data-year-next="${items[next]?.year || data.yearInfluence.year}"`;
    const label = isLuck ? "大运" : "流年";
    const currentMeta = isLuck
      ? `${current.startAge}-${current.endAge}岁 · ${current.startYear}-${current.endYear}`
      : `所在大运 ${data.selectedLuck.label}`;
    const options = isLuck
      ? items.map((p, i) => `<option value="${i}" ${i === safeIndex ? "selected" : ""}>${p.startAge}-${p.endAge}岁 · ${p.label} · ${p.startYear}-${p.endYear}</option>`).join("")
      : items.map(({ year, pillar }) => `<option value="${year}" ${year === data.yearInfluence.year ? "selected" : ""}>${year} · ${pillar.label}</option>`).join("");
    const selectAttr = isLuck ? "data-luck-select" : "data-year-select";
    return `<div class="fortune-stepper ${isLuck ? "luck-stepper" : "year-stepper"}"><button type="button" class="stepper-button" ${prevAttr} ${safeIndex === 0 ? "disabled" : ""} aria-label="上一个${label}"><span aria-hidden="true">&lt;</span></button><label class="stepper-picker"><span>${label}切换</span><select ${selectAttr} aria-label="${label}切换">${options}</select><small>${currentMeta}</small></label><button type="button" class="stepper-button" ${nextAttr} ${safeIndex === items.length - 1 ? "disabled" : ""} aria-label="下一个${label}"><span aria-hidden="true">&gt;</span></button></div>`;
  }

  function buildTransitPillarTenGods(chart, pillar) {
    const dayStem = chart.dayMaster?.stem || chart.pillars?.day?.stem;
    return {
      stem: dayStem && pillar?.stem ? getTenGod(dayStem, pillar.stem) : "",
      branch: dayStem && pillar?.branch ? getTenGod(dayStem, branchMainStem(pillar.branch)) : ""
    };
  }

  function renderFlowSignalMatrix(title, groups) {
    return `<section class="reading-panel"><div class="board-title"><h3>${title}</h3><span>${groups.reduce((sum, group) => sum + group.signals.length, 0)} 条</span></div><div class="flow-signal-matrix"><table><thead><tr><th>分组</th><th>观察点</th><th>类型</th><th>原始依据</th><th>取象关键词</th><th>展开解释</th></tr></thead><tbody>${groups.map(group => group.signals.map(signal => renderFlowSignalRow(signal, group.title)).join("")).join("")}</tbody></table></div></section>`;
  }

  function renderFlowSignalRow(signal, groupTitle) {
    return `<tr class="flow-signal-row"><td data-label="分组">${signal.group || groupTitle}</td><td data-label="观察点"><strong>${signal.title}</strong></td><td data-label="类型"><span class="badge">${signal.tag}</span></td><td data-label="原始依据">${signal.evidence}</td><td data-label="取象关键词">${signal.keywords}</td><td data-label="展开解释"><details class="inline-reading"><summary>展开</summary><dl><dt>怎么取的</dt><dd>${signal.evidence}</dd>${renderSignalEventCandidates(signal)}<dt>解释</dt><dd>${signal.plainReading} ${signal.realLifeMeaning} ${signal.caution}</dd></dl></details></td></tr>`;
  }

  function buildLocalFortuneAnalysis({
  chart,
  selectedLuck,
  yearInfluence,
  selectedMonthInfluence,
  monthInfluences,
  transitSignals,
  monthSignals
}) {
  const transitRows = flattenSignalGroups(transitSignals)
    .filter(signal => !String(signal.title || "").includes("未命中"));

  const monthRows = flattenSignalGroups(monthSignals)
    .filter(signal => !String(signal.title || "").includes("未命中"));

  // 1. 大运层：只看大运、阶段背景，不看流年、流月
  const luckRows = transitRows.filter(signal => {
    const text = signalTextForEvent(signal);
    return /大运|阶段背景/.test(text) && !/流年|年度触发|岁运并看|流月/.test(text);
  });

  // 2. 流年层：看大运 + 流年，但不看当前选择的流月
  const yearRows = transitRows.filter(signal => {
    const text = signalTextForEvent(signal);
    return !/流月|当前月份|selectedMonth/.test(text);
  });

  // 3. 流月层：只看当前选择的流月信号
  const currentMonthRows = monthRows;

  const luckAnalysis = buildLayerFortuneAnalysis({
    mode: "luck",
    chart,
    selectedLuck,
    rows: luckRows,
    yearInfluence,
    selectedMonthInfluence
  });

  const yearAnalysis = buildLayerFortuneAnalysis({
    mode: "year",
    chart,
    selectedLuck,
    yearInfluence,
    rows: yearRows,
    selectedMonthInfluence
  });

  const monthAnalysis = buildLayerFortuneAnalysis({
    mode: "month",
    chart,
    selectedLuck,
    yearInfluence,
    selectedMonthInfluence,
    rows: currentMonthRows
  });

  const decadeTheme =
    selectedLuck.stemElement === chart.dayMaster.element ||
    selectedLuck.branchElement === chart.dayMaster.element
      ? "增强原局"
      : "补足原局";

  const decadeEvidence = [
    `大运${selectedLuck.label}，天干${getTenGod(chart.dayMaster.stem, selectedLuck.stem)}，地支主气${getTenGod(chart.dayMaster.stem, branchMainStem(selectedLuck.branch))}`,
    `流年${yearInfluence.pillar.label}接入大运${selectedLuck.label}`
  ];

  // 兼容旧代码：顶层继续放 yearAnalysis，避免页面和 AI prompt 立刻报错
  return {
    luckAnalysis,
    yearAnalysis,
    monthAnalysis,

    year: yearInfluence.year,
    decadeTheme,
    decadeSupportScore: luckAnalysis.topScore || 0,
    decadeRiskTags: luckAnalysis.triggerChains.flatMap(chain => chain.tags).slice(0, 6),
    decadeEvidence,

    luckBackground: {
      conclusion: `${selectedLuck.label}大运${decadeTheme}`,
      evidence: decadeEvidence,
      reality: "大运是十年背景层，主要看阶段里的资源承接、规则压力、关系互动或迁动变化。"
    },

    // 下面这些是旧字段，先映射到流年层，保证现有页面还能跑
    annualTheme: yearAnalysis.annualTheme,
    overallSummary: yearAnalysis.summary,
    eventCandidates: yearAnalysis.eventCandidates,
    mainEvents: yearAnalysis.mainEvents,
    eventScores: yearAnalysis.eventScores,
    triggerChains: yearAnalysis.triggerChains,
    monthlyHighlights: [],

    advice: [
      "大运只看阶段背景，不直接断某一年结果。",
      "流年用于判断年度主事件，不混入当前选中的流月。",
      "流月用于判断当前月份的短期应期。"
    ]
  };
}

function buildLayerFortuneAnalysis({
  mode,
  chart,
  selectedLuck,
  yearInfluence,
  selectedMonthInfluence,
  rows
}) {
  const triggerChains = [
    ...buildStructuredLayerChains({ mode, chart, selectedLuck, yearInfluence, selectedMonthInfluence }),
    ...rows.slice(0, 8).map((signal, index) => {
    const tags = limitTopicTags(localTagsFromSignal(signal), signal);
    const evidence = [signal.evidence, signal.plainReading].filter(Boolean);

    return {
      id: `${mode}-signal-chain-${index + 1}`,
      chain: buildLayerChainLabel({ mode, chart, selectedLuck, yearInfluence, selectedMonthInfluence }),
      source: signal.group || signal.groupTitle || layerModeLabel(mode),
      reason: `${signal.title}：${signal.keywords || signal.evidence}，引动${tags.map(fortuneScoreLabel).join("、")}主题。`,
      tags,
      weight: chainHasSpecificEvidence({
        reason: signal.title,
        evidence: [signal.evidence, signal.keywords].filter(Boolean)
      }) ? 5 : 2,
      evidence,
      realityMapping: signal.realLifeMeaning,
      caution: signal.caution,
    };
  })
  ].filter(chain => chain.tags.length);

  const eventScores = scoreLayerEvents(triggerChains);

  const eventCandidates = Object.entries(eventScores).map(([key, value], index) => {
    const eventType = localEventTypeForScoreKey(key);
    const level = value.score >= 70 ? "high" : value.score >= 35 ? "medium" : value.score >= 15 ? "low" : "none";

    return {
      eventType,
      score: value.score,
      level,
      confidence: value.score >= 70 ? "high" : value.score >= 35 ? "medium" : "low",
      rank: index + 1,
      evidenceChain: value.evidence || [],
      possibleManifestations: localManifestationsForEvent(eventType),
      timing: mode === "month" && selectedMonthInfluence
        ? [`${selectedMonthInfluence.month}月${selectedMonthInfluence.pillar.label}：当前流月触发窗口`]
        : [],
      debug: {
        source: `browser-local-${mode}-scores`,
        scoreKey: key
      },
    };
  }).sort((a, b) => b.score - a.score)
    .map((event, index) => ({ ...event, rank: index + 1 }));

  const mainEvents = eventCandidates
    .filter(event => ["high", "medium"].includes(event.level))
    .filter(event => event.evidenceChain?.length)
    .filter(event => event.score >= 35)
    .slice(0, 3);

  const top = Object.entries(eventScores)
    .sort((a, b) => b[1].score - a[1].score)
    .filter(([, value]) => value.score > 0)
    .slice(0, 3)
    .map(([key]) => fortuneScoreLabel(key))
    .join("、");

  return {
    mode,
    modeLabel: layerModeLabel(mode),
    annualTheme: top || "暂无明显高分主题",
    summary: buildLayerSummary({
      mode,
      chart,
      selectedLuck,
      yearInfluence,
      selectedMonthInfluence,
      top,
      triggerChains
    }),
    eventScores,
    eventCandidates,
    mainEvents,
    triggerChains,
    monthlyHighlights: mode === "month" ? [{
      month: Number(selectedMonthInfluence?.month || state.selectedMonth || 1),
      pillar: selectedMonthInfluence?.pillar?.label || "",
      intensity: scoreLevel(eventCandidates[0]?.score || 40),
      score: eventCandidates[0]?.score || 40,
      reasons: triggerChains.slice(0, 4).flatMap(chain => normalizeTextList(chain.evidence, [chain.reason])).slice(0, 5),
      eventTypes: mainEvents.map(event => event.eventType),
    }] : [],
    topScore: eventCandidates[0]?.score || 0
  };
}

function buildStructuredLayerChains({ mode, chart, selectedLuck, yearInfluence, selectedMonthInfluence } = {}) {
  if (mode === "luck") {
    return buildLuckStructuredChains({ chart, selectedLuck });
  }
  if (mode === "month") {
    return buildMonthStructuredChains({ chart, selectedLuck, yearInfluence, selectedMonthInfluence });
  }
  return buildYearStructuredChains({ chart, selectedLuck, yearInfluence });
}

function buildYearStructuredChains({ chart, selectedLuck, yearInfluence } = {}) {
  const chains = [];
  const dayBranch = chart?.pillars?.day?.branch;
  const yearPillar = yearInfluence?.pillar || {};
  const yearBranch = yearPillar.branch;
  const yearStemGod = yearInfluence?.tenGods?.stem || getTenGod(chart?.dayMaster?.stem, yearPillar.stem);
  const yearBranchGod = yearInfluence?.tenGods?.branch || getTenGod(chart?.dayMaster?.stem, branchMainStem(yearBranch));
  const gender = chart?.input?.gender || state?.gender || "unknown";

  for (const relation of localBranchRelations(yearBranch, dayBranch)) {
    const scoreBonus = { same: 35, clash: 40, combo: 25, harm: 20, break: 20, punish: 20 }[relation.kind] || 0;
    chains.push(createStructuredChain({
      mode: "year",
      id: `year-relationship-day-${relation.kind}`,
      tags: ["relationship", "health"].concat(relation.kind === "clash" ? ["movement"] : []),
      scoreBonus,
      reason: relation.reason(yearBranch, dayBranch),
      evidence: [relation.reason(yearBranch, dayBranch)],
      weight: Math.max(3, Math.round(scoreBonus / 10)),
    }));
  }

  const yearGods = [yearStemGod, yearBranchGod].filter(Boolean);
  if (gender === "male" && yearGods.some(god => ["正财", "偏财"].includes(god))) {
    chains.push(createStructuredChain({
      mode: "year",
      id: "year-relationship-spouse-star",
      tags: ["relationship", "wealth"],
      scoreBonus: 25,
      reason: "男命流年出现财星，传统命理中可作为关系对象的重要观察点。",
      evidence: [`流年${yearPillar.label}十神见${yearGods.join("、")}。`],
      weight: 3,
    }));
  }
  if (gender === "female" && yearGods.some(god => ["正官", "七杀"].includes(god))) {
    chains.push(createStructuredChain({
      mode: "year",
      id: "year-relationship-spouse-star",
      tags: ["relationship", "career", "health"],
      scoreBonus: 25,
      reason: "女命流年出现官杀，传统命理中可作为关系对象的重要观察点。",
      evidence: [`流年${yearPillar.label}十神见${yearGods.join("、")}。`],
      weight: 3,
    }));
  }

  if (yearGods.some(god => ["正官", "七杀"].includes(god))) {
    chains.push(createStructuredChain({
      mode: "year",
      id: "year-career-officer",
      tags: ["career", "health"],
      scoreBonus: 25,
      reason: `流年${yearPillar.label}出现官杀，事业身份、规则流程和压力负荷作为观察点。`,
      evidence: [`流年天干/地支十神：${yearGods.join("、")}。`],
      weight: 3,
    }));
  }
  if (yearGods.some(god => ["正财", "偏财"].includes(god))) {
    chains.push(createStructuredChain({
      mode: "year",
      id: "year-wealth-star",
      tags: ["wealth"],
      scoreBonus: 25,
      reason: `流年${yearPillar.label}出现财星，财务资源、收支报价和现实责任作为观察点。`,
      evidence: [`流年天干/地支十神：${yearGods.join("、")}。`],
      weight: 3,
    }));
  }
  if (yearGods.some(god => ["食神", "伤官"].includes(god))) {
    chains.push(createStructuredChain({
      mode: "year",
      id: "year-output-star",
      tags: ["study"],
      scoreBonus: 25,
      reason: `流年${yearPillar.label}出现食伤，作品、表达、学业成果和交付作为观察点。`,
      evidence: [`流年天干/地支十神：${yearGods.join("、")}。`],
      weight: 3,
    }));
  }

  for (const [key, pillar] of Object.entries(chart?.pillars || {})) {
    for (const relation of localBranchRelations(yearBranch, pillar.branch)) {
      if (!["clash", "harm", "break", "punish"].includes(relation.kind)) continue;
      const tags = ["health"];
      if (["year", "month", "hour"].includes(key) || relation.kind === "clash") tags.push("movement");
      if (key === "month") tags.push("career", "social");
      if (key === "hour") tags.push("study");
      chains.push(createStructuredChain({
        mode: "year",
        id: `year-${key}-${relation.kind}`,
        tags,
        scoreBonus: relation.kind === "clash" ? 22 : 14,
        reason: `流年${yearBranch}与原局${pillar.role || key}${pillar.branch}形成${relation.label}，${key === "day" ? "日支" : "对应柱位"}作为年度变化观察点。`,
        evidence: [`流年${yearPillar.label}触发原局${pillar.label}。`],
        weight: 2,
      }));
    }
  }

  if (selectedLuck?.branch) {
    for (const relation of localBranchRelations(yearBranch, selectedLuck.branch)) {
      chains.push(createStructuredChain({
        mode: "year",
        id: `year-luck-${relation.kind}`,
        tags: relation.kind === "clash" ? ["career", "movement", "health"] : ["career", "wealth", "relationship"],
        scoreBonus: relation.kind === "clash" ? 22 : 14,
        reason: `流年${yearPillar.label}与大运${selectedLuck.label}形成${relation.label}，阶段背景与年度触发叠加。`,
        evidence: [`流年支${yearBranch}触发大运支${selectedLuck.branch}。`],
        weight: 2,
      }));
    }
  }

  return chains;
}

function buildLuckStructuredChains({ chart, selectedLuck } = {}) {
  if (!selectedLuck?.label) return [];
  const dayStem = chart?.dayMaster?.stem;
  const gods = [getTenGod(dayStem, selectedLuck.stem), getTenGod(dayStem, branchMainStem(selectedLuck.branch))].filter(Boolean);
  return gods.map((god, index) => createStructuredChain({
    mode: "luck",
    id: `luck-ten-god-${index + 1}`,
    tags: localTagsFromTenGod(god, chart?.input?.gender),
    scoreBonus: 18,
    reason: `大运${selectedLuck.label}十神见${god}，作为十年阶段背景观察点。`,
    evidence: [`大运${selectedLuck.label}接入原局${chart?.pillars?.day?.label || ""}。`],
    weight: 2,
  }));
}

function buildMonthStructuredChains({ chart, selectedLuck, yearInfluence, selectedMonthInfluence } = {}) {
  const monthPillar = selectedMonthInfluence?.pillar || {};
  const monthBranch = monthPillar.branch;
  const chains = [];
  const targets = [
    ["日支", chart?.pillars?.day?.branch, ["relationship", "health"]],
    ["流年支", yearInfluence?.pillar?.branch, ["career", "movement", "health", "social"]],
    ["大运支", selectedLuck?.branch, ["career", "wealth", "relationship", "movement"]],
  ];
  for (const [label, branch, tags] of targets) {
    for (const relation of localBranchRelations(monthBranch, branch)) {
      chains.push(createStructuredChain({
        mode: "month",
        id: `month-${label}-${relation.kind}`,
        tags,
        scoreBonus: relation.kind === "clash" ? 28 : relation.kind === "combo" ? 22 : 18,
        reason: `流月${monthBranch}触发${label}${branch}形成${relation.label}，只进入流月短期应期观察。`,
        evidence: [`${selectedMonthInfluence?.month || ""}月${monthPillar.label || ""}触发${label}${branch}。`],
        weight: 3,
      }));
    }
  }
  return chains;
}

function createStructuredChain({ mode, id, tags, scoreBonus, reason, evidence, weight }) {
  return {
    id,
    chain: `${layerModeLabel(mode)}结构化事件链`,
    source: layerModeLabel(mode),
    reason,
    tags: uniqueText(tags).filter(tag => ["career", "wealth", "relationship", "study", "health", "movement", "social"].includes(tag)),
    weight,
    scoreBonus,
    evidence,
    realityMapping: "传统命理中可作为观察点，需要结合柱位、旺衰、十神、岁运继续验证。",
    caution: "不能单独作为结论。",
  };
}

function localTagsFromTenGod(tenGod, gender = "unknown") {
  const tags = [];
  if (["正官", "七杀"].includes(tenGod)) tags.push("career", "health");
  if (["正印", "偏印"].includes(tenGod)) tags.push("career", "study");
  if (["正财", "偏财"].includes(tenGod)) tags.push("wealth");
  if (["食神", "伤官"].includes(tenGod)) tags.push("study");
  if (["比肩", "劫财"].includes(tenGod)) tags.push("social");
  if (gender === "male" && ["正财", "偏财"].includes(tenGod)) tags.push("relationship");
  if (gender === "female" && ["正官", "七杀"].includes(tenGod)) tags.push("relationship");
  return tags;
}

function localBranchRelations(left, right) {
  if (!left || !right) return [];
  const rows = [];
  if (left === right) {
    rows.push({
      kind: "same",
      label: "同支",
      reason: (yearBranch, dayBranch) => `流年${yearBranch}触发日支${dayBranch}，日支作为关系宫位被重复引动。`,
    });
  }
  if (localSameBranchPair(left, right, [["子", "午"], ["丑", "未"], ["寅", "申"], ["卯", "酉"], ["辰", "戌"], ["巳", "亥"]])) {
    rows.push({
      kind: "clash",
      label: "冲",
      reason: (yearBranch, dayBranch) => `流年${yearBranch}冲动日支${dayBranch}，关系宫位有变化、拉扯、调整之象。`,
    });
  }
  if (localSameBranchPair(left, right, [["子", "丑"], ["寅", "亥"], ["卯", "戌"], ["辰", "酉"], ["巳", "申"], ["午", "未"]])) {
    rows.push({
      kind: "combo",
      label: "合",
      reason: (yearBranch, dayBranch) => `流年${yearBranch}合动日支${dayBranch}，关系宫位有靠近、牵连、绑定之象。`,
    });
  }
  if (localSameBranchPair(left, right, [["子", "未"], ["丑", "午"], ["寅", "巳"], ["卯", "辰"], ["申", "亥"], ["酉", "戌"]])) {
    rows.push({
      kind: "harm",
      label: "害",
      reason: (yearBranch, dayBranch) => `流年${yearBranch}对日支${dayBranch}形成不顺互动，关系细节容易别扭或反复。`,
    });
  }
  if (localSameBranchPair(left, right, [["子", "卯"], ["寅", "巳"], ["巳", "申"], ["申", "寅"], ["丑", "戌"], ["戌", "未"], ["未", "丑"]])) {
    rows.push({
      kind: "punish",
      label: "刑",
      reason: (yearBranch, dayBranch) => `流年${yearBranch}对日支${dayBranch}形成不顺互动，关系细节容易别扭或反复。`,
    });
  }
  return rows;
}

function localSameBranchPair(left, right, pairs) {
  return pairs.some(pair => pair.includes(left) && pair.includes(right));
}

function scoreLayerEvents(triggerChains = []) {
  return Object.fromEntries(["career", "wealth", "relationship", "study", "health", "movement", "social"].map(key => {
    const hits = triggerChains.filter(chain => chain.tags.includes(key));
    const specificHits = hits.filter(chainHasSpecificEvidence);
    const genericHits = hits.filter(chain => !chainHasSpecificEvidence(chain));

    const specificScore = specificHits.reduce((sum, chain) => sum + Number(chain.weight || 0) * 7, 0);
    const genericScore = genericHits.reduce((sum, chain) => sum + Number(chain.weight || 0) * 3, 0);
    const bonusScore = hits.reduce((sum, chain) => sum + Number(chain.scoreBonus || 0), 0);
    const layerBonus = specificHits.length >= 2 ? 8 : 0;

    const score = hits.length
      ? Math.min(95, Math.round(specificScore + genericScore + bonusScore + layerBonus))
      : 0;

    return [key, {
      score,
      evidence: hits.length
        ? hits.slice(0, 3).map(chain => chain.reason)
        : ["暂未出现直接触发链，先保留为低强度观察。"],
    }];
  }));
}

function buildLayerChainLabel({
  mode,
  chart,
  selectedLuck,
  yearInfluence,
  selectedMonthInfluence
}) {
  const natal = `原局${chart.pillars.day.label}`;
  if (mode === "luck") {
    return `${natal} -> 大运${selectedLuck.label}`;
  }
  if (mode === "year") {
    return `${natal} -> 大运${selectedLuck.label} -> 流年${yearInfluence.pillar.label}`;
  }
  return `${natal} -> 大运${selectedLuck.label} -> 流年${yearInfluence.pillar.label} -> 流月${selectedMonthInfluence?.pillar?.label || ""}`;
}

function layerModeLabel(mode) {
  return {
    luck: "大运评分",
    year: "流年评分",
    month: "流月评分"
  }[mode] || "评分";
}

function buildLayerSummary({
  mode,
  chart,
  selectedLuck,
  yearInfluence,
  selectedMonthInfluence,
  top,
  triggerChains
}) {
  if (mode === "luck") {
    return `结论：${selectedLuck.label}大运主要看${top || "阶段背景"}。\n命理依据：原局${chart.pillars.day.label}接入大运${selectedLuck.label}，当前形成${triggerChains.length}条大运层引动链。\n边界：大运只代表十年阶段环境，不直接断某一年结果。`;
  }

  if (mode === "year") {
    return `结论：${yearInfluence.year}年主要看${top || "年度触发"}。\n命理依据：原局${chart.pillars.day.label}接大运${selectedLuck.label}，再由流年${yearInfluence.pillar.label}触发，当前形成${triggerChains.length}条流年层引动链。\n边界：流年评分不使用当前选中的流月，不把某个月当作全年重点。`;
  }

  return `结论：${selectedMonthInfluence?.month || ""}月${selectedMonthInfluence?.pillar?.label || ""}主要看${top || "当前流月触发"}。\n命理依据：当前流月接在大运${selectedLuck.label}与流年${yearInfluence.pillar.label}之后，形成${triggerChains.length}条流月层引动链。\n边界：流月只判断当前月份的短期应期，不代表全年。`;
}

  function localEventTypeForScoreKey(key) {
    return {
      relationship: "relationship_marriage",
      wealth: "wealth_resource",
      study: "children_output",
      career: "career_status",
      health: "health_risk",
      movement: "movement_change",
      social: "social_conflict",
    }[key] || "social_conflict";
  }

  function localManifestationsForEvent(eventType) {
    return {
      relationship_marriage: ["可能遇到初恋、暧昧或确定关系", "关系边界重谈", "旧关系议题回到台前"],
      wealth_resource: ["收支安排复核", "报价付款核算", "资源分配重新讨论"],
      children_output: ["作品项目交付", "方案表达或成果整理", "晚辈学生或长期项目安排增加"],
      career_status: ["岗位职责调整", "审批考核节点", "证书材料或身份角色复核"],
      health_risk: ["作息体感波动", "压力负荷复核", "出行操作和流程安全复核"],
      movement_change: ["出行改期", "搬动通勤调整", "地点或时间表重排"],
      social_conflict: ["团队分工重谈", "同辈竞争协作", "合作资源边界讨论"],
      family_home: ["家庭事务整理", "居住环境调整", "房屋材料或长辈安排复核"],
    }[eventType] || ["现实事务重新安排"];
  }

  function localTagsFromSignal(signal) {
    const text = signalTextForEvent(signal);
    const tags = [];
    if (hasEventKey(text, ["官", "职责", "规则", "事业", "任务"])) tags.push("career");
    if (hasEventKey(text, ["财", "资源", "收支", "承接"])) tags.push("wealth");
    if (hasEventKey(text, ["关系", "合作", "日柱", "合"])) tags.push("relationship");
    if (hasEventKey(text, ["印", "食伤", "学习", "表达", "作品"])) tags.push("study");
    if (hasEventKey(text, ["害", "刑", "穿", "作息", "状态", "压力"])) tags.push("health");
    if (hasEventKey(text, ["冲", "迁移", "移动", "出行", "变化"])) tags.push("movement");
    if (hasEventKey(text, ["比劫", "同辈", "人际", "沟通"])) tags.push("social");
    return [...new Set(tags.length ? tags : ["career", "social"])];
  }

function limitTopicTags(tags = [], signal = {}) {
  const text = signalTextForEvent(signal);
  const unique = [...new Set(tags)].filter(Boolean);

  // 大运十神、流年十神、五行这种信号太泛，一条最多给 1 个主题
  const isBroadSignal = /大运十神|流年十神|大运五行|流年五行|岁运并看|阶段背景/.test(text);
  const maxTopics = isBroadSignal ? 1 : 2;

  return unique
    .map(topic => ({ topic, score: topicPriorityScore(topic, text) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, maxTopics)
    .map(item => item.topic);
}

function topicPriorityScore(topic, text = "") {
  const rules = {
    relationship: /日支|夫妻|感情|关系|六合|合动|六害|害/,
    career: /官|杀|职责|规则|事业|任务|审批|考核|岗位/,
    wealth: /财|资源|收支|付款|预算|报价/,
    movement: /冲|迁移|移动|出行|变化|搬动|改期/,
    study: /印|学习|表达|作品|文书|证书|材料/,
    health: /害|刑|穿|作息|状态|压力|体感|安全/,
    social: /比劫|同辈|人际|沟通|朋友|团队/
  };

  return rules[topic]?.test(String(text || "")) ? 10 : 0;
}

function hasSpecificEvidenceText(text = "") {
  return /六冲|六害|六合|三合|三会|冲|害|刑|破|穿|伏吟|同支|同干|日支|夫妻宫|年柱|月柱|时柱|流月|流年-/.test(String(text || ""));
}

function chainHasSpecificEvidence(chain = {}) {
  return hasSpecificEvidenceText([
    chain.reason,
    ...(Array.isArray(chain.evidence) ? chain.evidence : [])
  ].join(" "));
}
  function fortuneScoreLabel(key) {
    return { career: "事业", wealth: "财运", relationship: "感情", study: "学业", health: "健康", movement: "迁移", social: "人际", pressure: "压力", "repeat-theme": "主题反复" }[key] || key;
  }

  function renderFortuneDebugPanel(data) {
    const fortune = data.fortuneAnalysis || {};

    return `
      <details class="debug-fortune-panel">
        <summary>开发调试：本地事件评分</summary>
        <pre>${escapeHtml(JSON.stringify({
          luckAnalysis: fortune.luckAnalysis,
          yearAnalysis: fortune.yearAnalysis,
          monthAnalysis: fortune.monthAnalysis,
          mainEvents: fortune.mainEvents,
          eventScores: fortune.eventScores,
          triggerChains: fortune.triggerChains,
          monthlyHighlights: fortune.monthlyHighlights,
        }, null, 2))}</pre>
      </details>
    `;
  }

  function renderYear(data) {
    const root = byId("yearStory");
    if (!root) return;

    root.hidden = false;
    root.innerHTML = `
      <div class="plugin-header">
        <p class="eyebrow">年度解读</p>
        <h2>${data.yearInfluence?.year || ""} 年事件报告</h2>
      </div>

      ${renderFlowAiStage("year", "年度 AI 解读", "根据本地事件引擎生成")}

      ${renderFortuneDebugPanel(data)}
    `;

    bindFlowAiButtons();
  }

  function renderMonth(data) {
    const luck = data.chart.luckCycles;
    byId("monthTimeline").innerHTML = `<div class="plugin-header"><p class="eyebrow">大运 · 流年 · 流月</p><h2>岁运推演</h2></div>${renderFortuneTransitChart(data)}<section class="fortune-ai-layout"><div class="board-title"><h3>AI 分层解读</h3><span>先看十年背景，再看年度触发</span></div><div class="fortune-ai-stack">${renderFlowAiStage("luck", "大运 AI 解读", data.selectedLuck.label, "flow-ai-card")} ${renderFlowAiStage("year", "流年 AI 解读", `${data.yearInfluence.year} ${data.yearInfluence.pillar.label}`, "flow-ai-card")}</div></section>${renderTransitSignals(data.transitSignals, data)}<section class="data-board month-flow-board"><div class="board-title"><h3>4. 最后细看流月</h3><span>${data.yearInfluence.year} 年 · 当前 ${state.selectedMonth}月 ${data.selectedMonthInfluence.pillar.label}</span></div><div class="transit-layout"><div class="flow-focus">${renderPillarCard(data.yearInfluence.pillar, `${data.yearInfluence.year} 流年`)}${renderPillarCard(data.selectedMonthInfluence.pillar, `${state.selectedMonth}月流月`)}</div><div><div class="month-board">${data.monthInfluences.map(m => `<button class="flow-chip month ${m.month === state.selectedMonth ? "is-active" : ""}" data-month="${m.month}"><span>${m.month}月 · ${m.role}</span><strong>${m.pillar.label}</strong></button>`).join("")}</div></div></div>${renderFlowAiStage("month", "流月 AI 解读", `${state.selectedMonth}月 ${data.selectedMonthInfluence.pillar.label}`)}</section>${renderMonthSignals(data.monthSignals, data)}`;
    document.querySelectorAll("[data-year]").forEach(b => b.addEventListener("click", () => { resetFlowAiReports(); state.targetYear = Number(b.dataset.year); state.selectedMonth = 1; refresh(); }));
    document.querySelectorAll("[data-month]").forEach(b => b.addEventListener("click", () => { resetFlowAiReports(); state.selectedMonth = Number(b.dataset.month); refresh(); }));
    document.querySelectorAll("[data-luck-index]").forEach(b => b.addEventListener("click", () => { resetFlowAiReports(); const p = luck.pillars[Number(b.dataset.luckIndex)]; state.selectedLuckIndex = p.index - 1; state.targetYear = p.startYear; state.selectedMonth = 1; refresh(); }));
    document.querySelectorAll("[data-luck-select]").forEach(select => select.addEventListener("change", () => { resetFlowAiReports(); const p = luck.pillars[Number(select.value)]; if (!p) return; state.selectedLuckIndex = p.index - 1; state.targetYear = p.startYear; state.selectedMonth = 1; refresh(); }));
    document.querySelectorAll("[data-year-select]").forEach(select => select.addEventListener("change", () => { resetFlowAiReports(); state.targetYear = Number(select.value); state.selectedMonth = 1; refresh(); }));
    document.querySelectorAll("[data-luck-prev],[data-luck-next]").forEach(b => b.addEventListener("click", () => { resetFlowAiReports(); const index = Number(b.dataset.luckPrev ?? b.dataset.luckNext); const p = luck.pillars[index]; if (!p) return; state.selectedLuckIndex = p.index - 1; state.targetYear = p.startYear; state.selectedMonth = 1; refresh(); }));
    document.querySelectorAll("[data-year-prev],[data-year-next]").forEach(b => b.addEventListener("click", () => { resetFlowAiReports(); const year = Number(b.dataset.yearPrev ?? b.dataset.yearNext); if (!year) return; state.targetYear = year; state.selectedMonth = 1; refresh(); }));
    bindFlowAiButtons();
  }

  function renderNarrative() {}

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

  function renderDebug() {}

  function calculateBazi(input) {
    const birth = parseBirth(input);
    const pillars = buildNatalPillars(birth);
    const shensha = buildShensha(pillars, input);
    const pillarDetails = buildPillarDetails(pillars, shensha.byPillar);
    const elements = countElements(pillars);
    const luckCycles = buildLuckCycles(input, birth, pillars);
    const calendar = { solarDate: formatBirthDate(birth), time: formatBirthTime(birth), originalSolarDate: formatBirthDate(birth.original), originalTime: formatBirthTime(birth.original), inputCalendarType: birth.calendar.inputCalendarType, lunarDate: birth.calendar.lunarDate, trueSolarTime: birth.trueSolarTime, monthNote: pillars.month.meta.method, solarTermRange: `${pillars.month.meta.solarTerm}之后、${pillars.month.meta.nextSolarTerm}之前`, dayPillarDate: pillars.day.meta.pillarDate, dayPillarRule: "23:00-23:59按次日计算日柱（晚子时换日）", hourPillarRule: "按最终排盘时间取时辰，晚子时使用次日日干起时柱。" };
    return { input, pillars, dayMaster: { stem: pillars.day.stem, element: stemElements[pillars.day.stem], label: `${pillars.day.stem}日主` }, elements, dominantElements: dominantElements(elements), tenGods: buildTenGodSummary(pillars.day.stem, pillars), pillarDetails, tenGodStats: buildTenGodStats(pillarDetails), elementStats: buildElementStats(pillars), relations: findRelations(pillars), shensha, auxiliary: buildAuxiliary(pillars), luckCycles, calendar, meta: { engine: "birth-chart-engine", evidence: [`四柱：${Object.values(pillars).map(p => p.label).join(" ")}`, `月柱依据${pillars.month.meta.solarTerm}换月；日柱日期为${pillars.day.meta.pillarDate}。`], confidence: "medium", needVerify: ["节气时刻、真太阳时和起运口径仍建议保留人工复核入口。"] } };
  }

  function buildShensha(pillars, input) {
    const items = shenshaRules.flatMap(([name, category, basis, targetType, sourceBasis, targets, learningNote]) => {
      const matchedPillars = matchShenshaRule({ basis, targetType, targets }, pillars, input);
      if (!matchedPillars.length) return [];
      return [{
        name,
        category,
        theme: `${category}：${name}`,
        sourceBasis,
        matchedPillars,
        evidence: matchedPillars.map(hit => `${hit.pillarLabel}${hit.target}命中${name}，${sourceBasis}。`),
        learningNote,
        typicalMeaning: learningNote,
        confidence: "medium",
        needVerify: ["神煞只作为辅助候选信号，需要结合柱位、旺衰、十神、岁运继续验证，不能单独作为结论。"],
      }];
    });
    const byPillar = Object.fromEntries(["year", "month", "day", "hour"].map(key => [key, []]));
    items.forEach(item => item.matchedPillars.forEach(hit => byPillar[hit.pillarKey]?.push({ name: item.name, category: item.category, theme: item.theme, sourceBasis: item.sourceBasis, target: hit.target })));
    const counts = {};
    items.forEach(item => counts[item.category] = (counts[item.category] || 0) + 1);
    return { items, byPillar, summary: Object.entries(counts).map(([category, count]) => ({ category, count })), meta: { engine: "shensha-rule-table", version: "0.1.0", evidence: [`已启用${shenshaRules.length}条常用实务神煞规则，当前命中${items.length}项。`], confidence: "medium", needVerify: ["当前为内置常用实务神煞表，不宣称覆盖所有流派异名；神煞只作为传统命理中的辅助观察点，不能单独作为结论。"] } };
  }

  function matchShenshaRule(rule, pillars, input) {
    if (rule.basis.includes("pillarVoid")) return matchVoidShensha(pillars);
    if (rule.basis.includes("dayPillarLabel")) return matchDayPillarShensha(rule, pillars);
    if (rule.basis.includes("seasonDayPillar")) return matchSeasonDayPillarShensha(rule, pillars);
    const targets = collectShenshaTargets(rule.basis, rule.targets, pillars, input);
    if (!targets.length) return [];
    return ["year", "month", "day", "hour"].flatMap(key => {
      const p = pillars[key], values = rule.targetType === "stem" ? [p.stem] : rule.targetType === "stemOrBranch" ? [p.stem, p.branch] : [p.branch];
      return targets.filter(target => values.includes(target)).map(target => ({ pillarKey: key, pillarLabel: p.role, target }));
    });
  }

  function matchDayPillarShensha(rule, pillars) {
    return (rule.targets.dayPillarLabel || []).includes(pillars.day.label) ? [{ pillarKey: "day", pillarLabel: pillars.day.role, target: pillars.day.label }] : [];
  }

  function matchSeasonDayPillarShensha(rule, pillars) {
    const targets = rule.targets[seasonKey(pillars.month.branch)] || [];
    return targets.includes(pillars.day.label) ? [{ pillarKey: "day", pillarLabel: pillars.day.role, target: pillars.day.label }] : [];
  }

  function collectShenshaTargets(basis, targets, pillars, input) {
    if (basis.includes("yearBranchGender")) {
      const yearYang = stemYinYang[pillars.year.stem] === "yang", gender = input.gender === "female" ? "female" : "male";
      const group = (gender === "male" && yearYang) || (gender === "female" && !yearYang) ? "yangMaleYinFemale" : "yinMaleYangFemale";
      return targets[group]?.[pillars.year.branch] || [];
    }
    const valueByBasis = { dayStem: pillars.day.stem, dayBranch: pillars.day.branch, yearBranch: pillars.year.branch, monthBranch: pillars.month.branch };
    return [...new Set(basis.flatMap(key => targets[valueByBasis[key]] || []))];
  }

  function matchVoidShensha(pillars) {
    return ["year", "month", "day", "hour"].flatMap(sourceKey => {
      const voids = getVoidBranches(pillars[sourceKey]);
      return ["year", "month", "day", "hour"].filter(targetKey => voids.includes(pillars[targetKey].branch)).map(targetKey => ({ pillarKey: targetKey, pillarLabel: pillars[targetKey].role, target: pillars[targetKey].branch }));
    });
  }

  function seasonKey(branch) {
    if (["寅", "卯", "辰"].includes(branch)) return "spring";
    if (["巳", "午", "未"].includes(branch)) return "summer";
    if (["申", "酉", "戌"].includes(branch)) return "autumn";
    return "winter";
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
  function buildCoreSignals(chart) { return { engine: "coreSignalsEngine", overview: generateOverallReading(chart), groups: [{ key: "core", title: "核心", signals: [generateDayMasterReading(chart), generateMonthCommandReading(chart)] }, { key: "elements-ten-gods", title: "五行十神", signals: [...generateElementReading(chart), ...generateTenGodReading(chart)] }, { key: "rooting-relations", title: "根气关系", signals: [...generateRootingReadings(chart), ...generateStemBranchRelationReading(chart)] }, { key: "auxiliary", title: "辅助取象", signals: [...generateShenshaReadings(chart), ...generateVoidReadings(chart), ...generateNayinReadings(chart), ...generateGrowthReadings(chart), ...generateAuxiliaryReadings(chart), generateCautionReading(chart)] }], professional: generateProfessionalEvidence(chart) }; }
  function makeCoreReading(group, title, tag, evidence, keywords, plainReading, realLifeMeaning, caution) { const signal = { group, title, tag, evidence, keywords, plainReading, realLifeMeaning, caution }; return { ...signal, eventCandidates: deriveEventCandidates(signal) }; }
  function generateDayMasterReading(chart) { const stem = chart.pillars.day.stem, element = elementLabels[chart.dayMaster.element], nature = stemNature(stem); return makeCoreReading("核心", `${stem}${element}日主`, "基础依据", `日干${stem}，五行${element}`, `${stem}${element} / ${elementAttributes[chart.dayMaster.element]} / 日主`, `${stem}${element}${nature.image}，传统取象可看成长、方向感、处事方式和自我表达的底色。`, nature.life, `${stem}${element}只是入口，日主强弱还要结合月令、根气、水火配合和十神组合判断。`); }
  function generateMonthCommandReading(chart) { const branch = chart.pillars.month.branch, info = monthCommandInfo(branch), dayStem = chart.pillars.day.stem, monthElement = elementLabels[chart.pillars.month.branchElement]; return makeCoreReading("核心", `月令${branch}`, "关键结构", `月柱${chart.pillars.month.label}，月令${branch}`, `${branch}月 / ${monthElement}气 / 出生环境`, `月令代表出生环境、季节力量、命局大气候。${branch}月${info.season}，对${dayStem}日主来说，环境底色带有${info.image}。`, `${info.life}这不是普通地支说明，而是在看命局最先受到哪类气候和现实环境塑形。`, "月令影响很大，但仍需结合透干、藏干、根气、五行数量和岁运触发一起看。"); }
  function generateElementReading(chart) { const visible = chart.elementStats.visible.counts, hidden = chart.elementStats.hidden.counts, monthElement = elementLabels[chart.pillars.month.branchElement]; return [makeCoreReading("五行十神", "明面五行偏性", "可取象", elementCountText(visible), `${topElementsText(visible)}突出 / ${weakElementText(visible).replace("在明面", "")}`, `明面数量里，${dominantElementText(visible)}；${weakElementText(visible)}。这可以用来观察外显结构，但五行数量不等于喜忌。`, "数量明显的五行，常对应相关属性更容易被看见；数量少或未显的五行，相关表达可能不在表层。", `月令会修正数量判断，例如月令属${monthElement}时，即使${monthElement}数量不多，也不能简单视为弱。`), makeCoreReading("五行十神", "藏干五行偏性", "可取象", elementCountText(hidden), `${topElementsText(hidden)}根气 / ${zeroElementsText(hidden)}`, `藏干数量里，${dominantElementText(hidden)}；${weakElementText(hidden).replace("明面", "藏干")}。这更偏向内在根气和来源支撑。`, "藏干层面的五行未必外露，但常用于观察某类属性是否有暗处来源或持续支撑。", "藏干统计仍需结合主气、中气、余气权重，以及月令和透干情况判断。")]; }
  function generateTenGodReading(chart) { const groups = tenGodGroupCounts(chart.tenGodStats.mainQi, chart.tenGodStats.fullHidden), top = topTenGodGroup(groups), low = lowTenGodGroup(groups); return [makeCoreReading("五行十神", "主气十神", "可取象", countText(chart.tenGodStats.mainQi), `${top.label}入口 / 学习表达资源规则关系`, `主气十神用于看表层更容易被看见的行为入口。${top.label}相对明显，可先看${top.meaning}。`, "十神可对应学习、表达、资源、规则、关系与自我驱动力，但只能描述结构倾向。", "主气统计不能直接推出富贵贫贱，也不能脱离日主强弱、月令和组合关系单看。"), makeCoreReading("五行十神", "完整藏干十神", "可取象", countText(chart.tenGodStats.fullHidden), `${top.label}来源 / ${low.label}待观察`, `完整藏干十神用于看内在来源。${low.label}不算外显，${low.meaning}相关面向需要结合柱位和岁运观察。`, "藏干十神能补充主气没有展示出的信息来源，但现实表现要看是否被透干、月令或岁运引动。", "完整藏干数量也不等于最终格局，需要回到月令、透干、根气和组合结构。")]; }
  function generateRootingReadings(chart) { return ["year", "month", "day", "hour"].map(key => { const d = chart.pillarDetails[key], hidden = d.hiddenStems.map(h => `${h.stem}${h.tenGod}${h.role}`).join("、") || "无"; return makeCoreReading("根气关系", `${d.label}${d.pillar.branch}藏干根气`, d.label === "月柱" ? "关键结构" : "基础依据", `${d.pillar.label}，地支${d.pillar.branch}藏干：${hidden}`, `${d.pillar.branch} / ${hidden}`, `藏干根气用来观察一个地支内部藏了哪些五行和十神来源。${d.label}${d.pillar.branch}的藏干为${hidden}。`, "现实表现上，它更像暗处资源、习惯底层或环境来源，未必直接外显。", "根气轻重需要结合主气、中气、余气、月令和透干判断，不能只看是否出现。"); }); }
  function generateStemBranchRelationReading(chart) { if (!chart.relations.length) return [makeCoreReading("根气关系", "干支关系未命中", "基础依据", "当前启用规则未命中明显合冲害关系", "未命中 / 不强行取象", "这表示本轮基础规则下，原局没有额外列出合冲害候选点。", "页面会优先看日主、月令、五行和十神，不强行补充关系取象。", "未命中规则不代表没有细节，后续可结合更多刑害破会规则继续扩展。")]; return chart.relations.map(r => makeCoreReading("根气关系", `${r.type}${r.effect}`, "需验证", `${r.ganzhi.join(" / ")} 命中${r.members.join("、")}`, `${r.members.join("")} / ${r.effect} / 牵连`, relationReadingText(r), "合多看牵连与黏合，冲多看变化与拉扯，害多看隐性别扭或互动不顺，具体落点要回到柱位。", "所有合象都不能默认成化，是否成化需要看月令、透干、根气和整体力量。")); }
  function generateVoidReadings(chart) { return ["year", "month", "day", "hour"].map(key => { const d = chart.pillarDetails[key]; return makeCoreReading("辅助取象", `${d.label}旬空`, "不能单断", `${d.pillar.label}旬空：${d.voidBranches.join("、")}`, `${d.voidBranches.join("、")} / 空亡观察`, `旬空用于记录该柱所在旬的空亡地支，传统命理中可作为虚实、落空、等待验证的辅助观察点。`, "现实表现不宜直接套结论，可作为某类主题暂不稳定、需等触发的候选信号。", "空亡必须结合柱位、冲合填实和岁运触发，不能单独作为结论。"); }); }
  function generateShenshaReadings(chart) { const items = chart.shensha?.items || []; if (!items.length) return [makeCoreReading("辅助取象", "神煞未命中", "辅助取象", "当前内置神煞规则未命中", "神煞 / 不强行取象", "当前内置神煞表没有额外列出候选信号，仍可回到五行、十神、柱位和岁运观察。", "现实分析不需要强行补神煞，先看核心结构更稳。", "未命中不代表没有细节，神煞本身也不能单独作为结论。")]; return items.map(item => makeCoreReading("辅助取象", item.name, "辅助取象", item.evidence.join("；"), `${item.category} / ${item.name}`, item.learningNote, "现实中只适合作为辅助入口，需观察它落在哪个柱位、对应哪类十神和岁运是否引动。", item.needVerify.join("；"))); }
  function generateNayinReadings(chart) { return ["year", "month", "day", "hour"].map(key => { const d = chart.pillarDetails[key]; return makeCoreReading("辅助取象", `${d.label}纳音`, "辅助取象", `${d.pillar.label}纳音：${d.nayin}`, `${d.nayin} / 辅助象`, `纳音提供另一套干支组合取象，可作为辅助意象保留。${d.label}${d.pillar.label}纳音为${d.nayin}。`, "现实表现更适合做意象补充，不应覆盖日主、月令、五行十神等主线。", "纳音不是本模块的主判断依据，不能单独作为结论。"); }); }
  function generateGrowthReadings(chart) { return ["year", "month", "day", "hour"].map(key => { const d = chart.pillarDetails[key]; return makeCoreReading("辅助取象", `${d.label}十二长生`, "辅助取象", `以${chart.pillars.day.stem}日主看${d.pillar.branch}为${d.twelveGrowth}`, `${d.pillar.branch} / ${d.twelveGrowth} / 气势阶段`, `十二长生用于观察日主五行在各地支中的气势阶段。${d.label}${d.pillar.branch}对应${d.twelveGrowth}。`, "现实表现可作为某类力量处在启动、旺盛、收束或储藏阶段的候选象。", "十二长生要配合月令、根气和透干使用，不单独断强弱。"); }); }
  function generateAuxiliaryReadings(chart) { return [chart.auxiliary.fetalOrigin, chart.auxiliary.lifePalace, chart.auxiliary.bodyPalace].map(p => makeCoreReading("辅助取象", `${p.role}${p.label}`, "辅助取象", `${p.role}${p.label}，${p.meta.method}`, `${p.role} / ${p.label}`, `${p.role}属于辅助宫位取象，用于保留传统排盘里的旁支观察入口。`, "现实表现上只适合辅助理解命盘侧面，不宜压过四柱主线。", "胎元、命宫、身宫需要保留复核口径，本版本只作为学习观察点。")); }
  function generateCautionReading(chart) { return makeCoreReading("辅助取象", "取象边界", "不能单断", chart.meta.needVerify.join("；"), "学习观察 / 不作最终断命", "本区只整理原局候选信号，把可观察的象列出来，方便后续验证。", "现实表现需要回到具体柱位、组合、岁运和实际反馈，不适合从单项数据直接下判断。", "基础取象不等于最终断命，后续仍需结合月令旺衰、日主强弱、十神组合、合冲刑害、大运流年综合分析。"); }
  function generateOverallReading(chart) { const day = `${chart.pillars.day.stem}${elementLabels[chart.dayMaster.element]}`, month = chart.pillars.month.branch, visible = chart.elementStats.visible.counts, topElements = topElementsText(visible), zero = zeroElementsText(visible), weakPhrase = zero === "没有明显空缺项" ? "明面五行没有明显空缺项" : `${zero}不在明面`, ten = topTenGodGroup(tenGodGroupCounts(chart.tenGodStats.mainQi, chart.tenGodStats.fullHidden)); return `此命局日主为${day}，生于${month}月，整体呈现“${topElements}较明显，${weakPhrase}”的结构。${ten.label}较容易成为观察入口，现实中可先看${ten.meaning}；但这只是基础取象，不直接断吉凶。`; }
  function generateProfessionalEvidence(chart) { return [{ label: "日主", value: `${chart.pillars.day.stem}（${elementLabels[chart.dayMaster.element]}）`, note: "日干为命局观察中心" }, { label: "月令", value: `${chart.pillars.month.branch}（${elementLabels[chart.pillars.month.branchElement]}）`, note: "出生季节与命局大气候" }, { label: "明面五行", value: elementCountText(chart.elementStats.visible.counts), note: "天干与地支本气统计" }, { label: "藏干五行", value: elementCountText(chart.elementStats.hidden.counts), note: "四个地支完整藏干统计" }, { label: "主气十神", value: countText(chart.tenGodStats.mainQi), note: "天干与地支主气口径" }, { label: "完整藏干十神", value: countText(chart.tenGodStats.fullHidden), note: "藏干全部纳入统计" }, { label: "神煞", value: chart.shensha?.items?.length ? chart.shensha.items.map(item => item.name).join("、") : "未命中", note: "神煞只作为辅助候选信号" }, { label: "干支关系", value: chart.relations.length ? chart.relations.map(r => `${r.ganzhi.join("/")} ${r.type}${r.effect}`).join("；") : "未命中", note: "这里只列依据，不作为最终结论" }]; }
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

  function buildPillarDetails(pillars, shenshaByPillar = {}) { return Object.fromEntries(Object.entries(pillars).map(([key, p]) => [key, { key, label: p.role, pillar: p, stemTenGod: key === "day" ? "日主" : getTenGod(pillars.day.stem, p.stem), branchMainTenGod: getTenGod(pillars.day.stem, branchMainStem(p.branch)), hiddenStems: (hiddenStems[p.branch] || []).map((s, i) => ({ stem: s, tenGod: getTenGod(pillars.day.stem, s), element: stemElements[s], elementLabel: elementLabels[stemElements[s]], role: ["主气", "中气", "余气"][i] || "余气" })), nayin: getNayin(p), twelveGrowth: twelveStageMatrix[pillars.day.stem]?.[p.branch] || "待查", voidBranches: getVoidBranches(p), shensha: shenshaByPillar[key] || [] }])); }
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
  function renderShenshaStats(chart) { const keys = ["year", "month", "day", "hour"]; const items = chart.shensha?.items || []; if (!items.length) return `<p class="fine-print">当前内置常用实务神煞规则未命中，仍可从十神、五行和岁运继续观察。</p>`; return `<div class="shensha-group-list"><p class="fine-print">${chart.shensha?.meta?.needVerify?.join("；") || "神煞只作为辅助观察点。"}</p>${keys.map(key => { const detail = chart.pillarDetails[key], names = new Set((detail.shensha || []).map(item => item.name)); const list = items.filter(item => item.matchedPillars.some(hit => hit.pillarKey === key) || names.has(item.name)); return `<section><h4>${detail.label} ${detail.pillar.label}</h4>${list.length ? `<div class="shensha-card-grid">${list.map(item => `<article class="shensha-card"><span>${item.name}</span><dl><dt>取象</dt><dd>${item.sourceBasis}；命中位置：${item.matchedPillars.filter(hit => hit.pillarKey === key).map(hit => `${hit.pillarLabel}${hit.target}`).join("、") || detail.label}</dd><dt>解释</dt><dd>${item.typicalMeaning || item.learningNote}</dd></dl></article>`).join("")}</div>` : `<p class="fine-print">此柱未列出神煞。</p>`}</section>`; }).join("")}</div>`; }
  function renderNayinGrowth(chart) { return `<div class="compact-table"><div class="compact-row expert compact-head"><span>柱位</span><span>干支</span><span>纳音</span><span>十二长生</span><span>神煞简表</span></div>${["year", "month", "day", "hour"].map(k => { const d = chart.pillarDetails[k]; return `<div class="compact-row expert"><span>${d.label}</span><strong>${d.pillar.label}</strong><small>${d.nayin}</small><small>${d.twelveGrowth}</small><small>${(d.shensha || []).map(item => item.name).join("、") || "未命中"}</small></div>`; }).join("")}</div>`; }
  function renderVoidStats(chart) { return `<div class="core-tab-grid">${["year", "month", "day", "hour"].map(k => `<article class="core-fact"><span>${chart.pillarDetails[k].label}</span><strong>${chart.pillarDetails[k].voidBranches.join("、")}</strong><small>${chart.pillarDetails[k].pillar.label} 旬空观察</small></article>`).join("")}</div>`; }
  function renderRelations(chart) { return chart.relations.length ? `<div class="relation-list">${chart.relations.map(r => `<article><span>${r.type}</span><strong>${r.members.join("、")} ${r.effect}</strong><small>${r.ganzhi.join(" / ")}</small></article>`).join("")}</div>` : `<p class="fine-print">当前命盘未命中已启用的干支关系规则。</p>`; }
  function renderExpert(chart) { return `<div class="compact-table"><div class="compact-row expert compact-head"><span>柱位</span><span>干支</span><span>纳音</span><span>长生</span><span>旬空</span></div>${["year", "month", "day", "hour"].map(k => `<div class="compact-row expert"><span>${chart.pillarDetails[k].label}</span><strong>${chart.pillarDetails[k].pillar.label}</strong><small>${chart.pillarDetails[k].nayin}</small><small>${chart.pillarDetails[k].twelveGrowth}</small><small>${chart.pillarDetails[k].voidBranches.join("、")}</small></div>`).join("")}</div><div class="candidate-grid below"><article class="core-fact"><span>胎元</span><strong>${chart.auxiliary.fetalOrigin.label}</strong><small>${chart.auxiliary.fetalOrigin.meta.method}</small></article><article class="core-fact"><span>命宫</span><strong>${chart.auxiliary.lifePalace.label}</strong><small>${chart.auxiliary.lifePalace.meta.method}</small></article><article class="core-fact"><span>身宫</span><strong>${chart.auxiliary.bodyPalace.label}</strong><small>${chart.auxiliary.bodyPalace.meta.method}</small></article></div>`; }
  function renderCalendar(chart) { const c = chart.calendar, s = c.trueSolarTime, loc = s.location || {}; return `<div class="core-tab-grid"><article class="core-fact"><span>输入历法</span><strong>${c.inputCalendarType === "lunar" ? "农历" : "公历"}</strong><small>用户输入</small></article><article class="core-fact"><span>原始输入时间</span><strong>${c.originalSolarDate} ${c.originalTime}</strong><small>不启用真太阳时时保持原始时间</small></article><article class="core-fact"><span>公历日期</span><strong>${c.originalSolarDate}</strong><small>农历输入会先换算为公历</small></article><article class="core-fact"><span>农历日期</span><strong>${c.lunarDate}</strong><small>用于核对阴阳历转换</small></article><article class="core-fact"><span>出生地</span><strong>${loc.displayName || loc.name}</strong><small>${loc.province || loc.source || ""}</small></article><article class="core-fact"><span>经纬度</span><strong>${Number.isFinite(Number(loc.longitude)) ? `${Number(loc.longitude).toFixed(4)} / ${Number(loc.latitude).toFixed(4)}` : "待接入"}</strong><small>${loc.timezone || "Asia/Shanghai"}</small></article><article class="core-fact"><span>标准经线</span><strong>${loc.standardMeridian || 120}</strong><small>用于经度校正</small></article><article class="core-fact"><span>真太阳时</span><strong>${s.enabled ? "启用" : "未启用"}</strong><small>${s.applied ? "已参与排盘" : "未参与排盘"}</small></article><article class="core-fact"><span>经度校正</span><strong>${s.longitudeCorrectionMinutes || 0}分钟</strong><small>按出生地经度</small></article><article class="core-fact"><span>均时差</span><strong>${s.equationOfTimeMinutes || 0}分钟</strong><small>用于真太阳时校正</small></article><article class="core-fact"><span>最终排盘时间</span><strong>${c.solarDate} ${c.time}</strong><small>用于生成四柱</small></article><article class="core-fact"><span>最终时辰</span><strong>${chart.pillars.hour.branch}</strong><small>按最终排盘时间</small></article><article class="core-fact"><span>日柱取日</span><strong>${c.dayPillarDate}</strong><small>${c.dayPillarRule}</small></article><article class="core-fact"><span>月柱换月依据</span><strong>${c.solarTermRange}</strong><small>${c.monthNote}</small></article><article class="core-fact"><span>时柱规则</span><strong>${chart.pillars.hour.branch}</strong><small>${c.hourPillarRule}</small></article></div>`; }
  function renderSymbol(value, element, yy) { const label = [polarityLabels[yy], elementLabels[element]].filter(Boolean).join(""); return `<span class="bazi-symbol element-${element || "unknown"} polarity-${yy || "unknown"}" data-element-label="${label}"><strong>${value}</strong><small>${label || elementLabels[element]}</small></span>`; }
  function renderHidden(items) { const elementByLabel = { 木: "wood", 火: "fire", 土: "earth", 金: "metal", 水: "water" }; return `<span class="hidden-chip-list">${items.map(i => `<span class="hidden-chip element-${elementByLabel[i.elementLabel] || "earth"}"><b>${i.stem}</b><em>${i.tenGod}</em><small>${i.role}</small><i>${i.elementLabel}</i></span>`).join("")}</span>`; }
  function renderPillarCard(p, title) { return `<article class="pillar-card"><span>${title}</span><strong>${p.label}</strong><small>${p.stemElement} / ${p.branchElement}</small></article>`; }
  function bindTabs() { document.querySelectorAll(".core-tabs").forEach(section => { const buttons = [...section.querySelectorAll("[data-tab]")], panels = [...section.querySelectorAll("[data-panel]")]; buttons.forEach(b => b.addEventListener("click", () => { buttons.forEach(x => x.classList.toggle("is-active", x === b)); panels.forEach(p => { const active = p.dataset.panel === b.dataset.tab; p.classList.toggle("is-active", active); p.hidden = !active; }); })); }); }

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
  function clampYear(value) { return Math.max(1900, Math.min(2100, Number(value) || now.getFullYear())); }
  function confidenceLabel(value) { return { low: "需验证", medium: "可取象", high: "关键结构" }[value] || "不能单断"; }
  function providerLabel(value) { return { "local-file": "本地演示", mock: "本地模拟" }[value] || "本地叙事"; }
  function escapeHtml(v) { return String(v ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;"); }
})();
