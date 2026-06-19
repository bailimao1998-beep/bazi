# Legacy backups

本目录只保留旧版演示和旧实验入口备份，不参与当前主链路，不进入正式打包。

当前正式主链路是：

```text
electron/main.js -> index.html -> js/app.js -> js/core/*
```

- `index.offline.html` 与 `app.bundle.js` 是旧版离线演示备份。
- `desktop/` 是旧的本地 server 桌面入口备份。
- `server/` 是旧的后端实验链路备份。
- `apiClient.js` 是旧的后端 API 客户端备份。

后续功能开发、排盘、取象、AI 问答和 Electron 打包都不应依赖本目录中的文件。
