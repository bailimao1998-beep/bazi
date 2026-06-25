# 盲派取象知识与规则库 v1

本目录是 v8.3 的 JSON 源数据，共包含：

- 来源登记：5 项
- 常驻取象总纲：22 条
- 首批专业取象规则：51 条

## 规则原则

1. 规则是专业参考，不是现实事件。
2. 每条规则都包含成立条件、削弱条件、候选取象、建议和禁止越级结论。
3. 高风险的死亡、牢狱、具体疾病、流产等断语没有进入用户侧规则。
4. 来源内容采用结构化转述，不复制长段原文。
5. 两本扫描资料已登记，但未完成可靠核读的章节不会冒充已提炼。

## 数据文件

- `sources.json`：四本资料和系统归纳的来源登记
- `methodology.json`：每次命理问答都可使用的取象总纲
- `rules-core.json`：根据问题动态召回的首批规则
- `schema.json`：规则字段约束

## 后续扩展

新增规则后运行：

```bash
node scripts/build-imagery-rule-bundle.mjs
```

生成浏览器可直接 import 的：

```text
js/core/imagery-rules/imageryRuleBundle.js
```
