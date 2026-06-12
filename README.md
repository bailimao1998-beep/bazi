# 盲派八字断盘工作台

本项目是本地优先的盲派八字断盘辅助工作台。代码先完成基础排盘、原局取象、岁运流月触发和证据报告，再把结构化证据交给可替换的 AI provider 整理成专业复核型叙事。

## 核心边界

- 排盘只由 `server/core/bazi` 控制。
- 流年流月由 `server/core/liunian` 控制。
- 规则由 `server/core/rules` 读取本地 JSON。
- 剧情标签和 prompt 由 `server/core/story` 生成。
- AI provider 只负责叙事，不参与排盘、取象或触发判断。
- 默认 provider 是 `mock`，配置在 `config/ai-config.json`。

## 使用方式

Beta 主运行模式为 server 模式：

```text
index.html → js/app.js → /api/narrative → 后端 buildNarrative → baseBaziViewModel / evidenceReport → 页面分层展示
```

开发者调试：

```bash
npm run dev
```

打开 `http://localhost:3000`。

本机快速启动桌面壳：

```bash
npm run desktop
```

桌面版打包：

```bash
npm run package:mac
npm run package:win
```

普通用户使用：

打开 `dist/` 中生成的 `命理断事系统.app` 或 `命理断事系统.exe`，双击即可使用，不需要安装 npm、Node、Git 或 VS Code。

`js/app.bundle.js` 和 `index.offline.html` 保留为 legacy/offline 纯前端演示入口，只用于旧版本地展示，不参与盲派八字断盘工作台主链路。

桌面应用仍然通过本地后端读取配置或环境变量，浏览器页面不会直接读取 DeepSeek API Key。
桌面版可在页面里的“AI 配置”面板保存 DeepSeek 设置；Key 写入 Electron `userData` 目录的 `ai-settings.json`，页面只读取脱敏后的 `maskedApiKey`，例如 `sk-****abcd`。
不要把 API Key 写入 `config/ai-config.json`。本地测试请使用 AI 设置页，或使用 `config/local-ai-settings.json`；`config/local-ai-settings.json` 已在 `.gitignore` 中，不应提交到 GitHub。

## 测试

```bash
node scripts/validate-bazi-data.mjs
npm test
```

## 当前版本说明

当前版本方向已收口为盲派八字，不做紫微斗数或多体系混合。所有输出都应保持“候选信号、观察点、继续验证”的专业复核型表达。
