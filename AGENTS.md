# Codex Project Instructions

## Project Nature

本项目是八字结构化学习排盘网站，不是直接断命系统。

后续 Codex 修改时，应围绕“学习、观察、验证”的产品定位展开，避免把排盘结果包装成确定性人生结论。

## Page Narrative

页面主线必须遵守以下顺序：

1. 排盘结果
2. 一句话总览
3. 证据链
4. 学习卡片
5. 大运流年

## Interpretation Rules

不要新增确定性断语。

禁止输出以下词语或表达：

- 一定
- 必定
- 绝对
- 必然
- 必离婚
- 必发财
- 必有灾
- 必坐牢
- 必死亡

所有解读必须使用学习型表达，例如：

- 候选信号
- 传统命理中可作为观察点
- 需要结合柱位、旺衰、十神、岁运继续验证
- 不能单独作为结论

## Development Constraints

修改代码后必须运行：

```bash
node scripts/validate-bazi-data.mjs
npm test
```

不要删除已有模块。

不要大规模重构。

本周目标是可用 Beta，不追求内容很多，优先保证页面清晰、稳定、不报错。
