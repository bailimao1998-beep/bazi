# 八字数据目录

这个目录现在只保留当前程序基础运行需要的数据。

## 程序读取

- `bazi-data-bundle.json`：页面默认读取的核心整合包。
- `index.json`：核心数据地图。

## 保留的源数据

源数据在 `source/`：

| 文件 | 为什么保留 |
| --- | --- |
| `00-来源-sources.json` | 核心规则的来源登记 |
| `01-天干地支-stems-branches.json` | 排盘、藏干、六十甲子 |
| `02-五行强弱-five-elements.json` | 五行生克和旺相休囚死 |
| `03-十神-ten-gods.json` | 十神矩阵和基础含义 |
| `04-合冲刑害破-combinations.json` | 干支关系和岁运触发基础 |
| `05-十二长生-twelve-stages.json` | 核心命盘展示 |
| `06-程序规则-system-rules.json` | 当前自动匹配的基础规则库，含“基础命盘解读”固定规则 |
| `13-城市经纬度-locations.json` | 出生地和真太阳时 |

## 已删除，后续需要再重新弄

- `07-盲派候选-blind-cases.json`
- `08-力量模型-strength-model.json`
- `09-格局用神-patterns-useful-gods.json`
- `10-神煞-stars-spirits.json`
- `11-盲派核心方法-blind-core-methods.json`
- `12-输出主题模板-output-templates.json`
- `14-案例库-case-studies.json`
- `15-AI分析模板-ai-prompts.json`
- `16-参考资料知识卡-reference-cards.json`
- `legacy/`
- 之前的中间文件和数据库草稿

## 修改流程

1. 改 `data/source/` 里的核心源数据。
2. 运行 `npm run data:bundle`。
3. 运行 `node scripts/validate-bazi-data.mjs`。
4. 运行 `npm test`。

## 基础命盘解读规则

`06-程序规则-system-rules.json` 顶层的 `basicInterpretationRules` 用于页面“基础命盘解读”模块。新增规则时保持字段完整：

`id`、`category`、`condition`、`title`、`conclusion`、`evidence`、`reason`、`displayOrder`、`confidence`、`sourceIds`、`status`。

支持的 `condition` 包括：`dayStem`、`monthBranch`、`dayMasterSeasonalStatus`、`elementCount`、`tenGodCount`、`tenGodGroupCount`、`hasSelectedLuck`、`hasSelectedYear`。
