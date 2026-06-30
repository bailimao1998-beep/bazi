# 盲派八字断盘工作台

本项目是本地优先的盲派八字断盘辅助工具，用于在个人电脑上完成排盘、原局取象、大运流年流月分析，并把结构化证据交给可选 AI 解释层整理成专业复核型叙事。

## 当前主链路

正式运行链路为：

```text
electron/main.js -> index.html -> js/app.js
```

- `electron/main.js`：Electron 静态壳，只负责本地静态加载 `index.html`。
- `index.html` / `js/app.js`：前端主入口。
- `js/domain/bazi`：前端本地排盘。
- `js/domain/natal` / `js/domain/transit`：前端本地取象与大运流年流月分析。
- `js/services/ai`：前端读取本机 AI 配置，并直接调用 DeepSeek；如 endpoint 指向兼容 OpenAI/DeepSeek chat completions 格式的接口，也可作为本地个人用途接入。当前前端设置层默认只内置 mock/deepseek 两类 provider，不做后端 provider 路由。
- `data/rules`：本地 JSON 规则库。

本项目不使用后端 server 作为主链路；封版后不保留旧后端、旧桌面入口和旧路径兼容层。

## AI 配置

真实配置文件放在本机：

```text
config/ai-config.json
```

该文件已被 `.gitignore` 忽略，不应提交仓库。仓库只保留：

```text
config/ai-config.example.json
```

注意：这是个人本地工具，前端会读取本机私有配置并直接调用 AI 接口。不适合把真实 API Key 放到公网部署环境，也不应把真实 Key 写入代码或提交到仓库。

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

测试样例数据位于 `tests/fixtures/`，不参与正式打包；正式运行数据按规则、知识与内容分别归档在 `data/rules`、`data/knowledge` 和 `data/content`。

## 项目结构

- `js/app`：页面状态和流程编排。
- `js/ui`：按原局、岁运、问答和共享组件组织的渲染层。
- `js/domain`：八字、原局、岁运及共享证据逻辑。
- `js/services`：AI、地区和外部数据服务。
- `js/generated`：由权威 JSON 生成的运行时数据。
- `js/shared`：不依赖业务层的通用纯函数。
- `tests`：按 `architecture`、`domain`、`services`、`ui`、`integration` 分类。

依赖方向由架构测试约束：`app -> ui/services/domain/shared`、`ui -> domain/shared`、`services -> domain/shared/generated`、`domain -> shared/generated`。

## 边界

当前版本方向已收口为盲派八字，不做紫微斗数或多体系混合。所有输出都应保持“候选信号、观察点、继续验证”的专业复核型表达。
