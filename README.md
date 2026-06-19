# 盲派八字断盘工作台

本项目是本地优先的盲派八字断盘辅助工具，用于在个人电脑上完成排盘、原局取象、大运流年流月分析，并把结构化证据交给可选 AI 解释层整理成专业复核型叙事。

## 当前主链路

正式运行链路为：

```text
electron/main.js -> index.html -> js/app.js -> js/core/*
```

- `electron/main.js`：Electron 静态壳，只负责本地静态加载 `index.html`。
- `index.html` / `js/app.js`：前端主入口。
- `js/core/bazi`：前端本地排盘。
- `js/core/blind-bazi`：前端本地取象报告。
- `js/core/ai`：前端读取本机 AI 配置，并直接调用 DeepSeek 或配置中的 AI 接口。
- `data/rules`：本地 JSON 规则库。

本项目不使用后端 server 作为主链路；`/api/narrative`、`/api/chat` 等旧后端接口已作为历史备份移到 `legacy/server/`。

## AI 配置

真实配置文件放在本机：

```text
config/ai-config.json
```

该文件已被 `.gitignore` 忽略，不应提交仓库。仓库只保留：

```text
config/ai-config.example.json
```

注意：这是个人本地工具，前端会读取本机配置并直接调用 AI 接口。不适合把真实 API Key 放到公网部署环境，也不应把真实 Key 写入代码或提交到仓库。

## 使用方式

安装依赖：

```bash
npm install
```

启动桌面应用：

```bash
npm start
```

Windows 打包：

```bash
npm run dist:win
npm run dist:win-portable
```

## 测试

```bash
node scripts/validate-bazi-data.mjs
npm test
```

## Legacy

旧版离线演示和旧 server/desktop 实验链路已移动到 `legacy/`：

- `legacy/index.offline.html`
- `legacy/app.bundle.js`
- `legacy/desktop/`
- `legacy/server/`

这些文件只作历史备份，不参与当前正式运行和打包。

## 边界

当前版本方向已收口为盲派八字，不做紫微斗数或多体系混合。所有输出都应保持“候选信号、观察点、继续验证”的专业复核型表达。
