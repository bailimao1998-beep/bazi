# 命理剧情解读系统

本项目是本地优先的 AI 命理剧情解读系统。代码先完成排盘、规则匹配、流年流月触发和剧情标签生成，再把结构化标签交给可替换的 AI provider 扩写成故事化语言。

## 核心边界

- 排盘由 `server/core/bazi` 和 `server/core/ziwei` 控制。
- 流年流月由 `server/core/liunian` 控制。
- 规则由 `server/core/rules` 读取本地 JSON。
- 剧情标签和 prompt 由 `server/core/story` 生成。
- AI provider 只负责叙事，不参与排盘、取象或触发判断。
- 默认 provider 是 `mock`，配置在 `config/ai-config.json`。

## 运行

```bash
npm run dev
```

打开 `http://localhost:3000`。

## 测试

```bash
node scripts/validate-bazi-data.mjs
npm test
```

## 当前版本说明

第一版重在架构闭环，八字和紫微算法为最小可用实现。所有输出都应保持“候选信号、观察点、继续验证”的学习型表达。
