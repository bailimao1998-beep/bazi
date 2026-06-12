import { app, BrowserWindow, dialog } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createAppServer } from "../server/server.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow = null;
let appServer = null;

const defaultDesktopPorts = [3000, 3001, 3002, 3003, 3004, 3005];

async function startLocalServer() {
  if (appServer) return appServer.url;
  process.env.FORTUNE_AI_USER_DATA_DIR = app.getPath("userData");
  const configuredPort = process.env.FORTUNE_AI_DESKTOP_PORT ?? process.env.PORT;
  const ports = configuredPort ? [Number(configuredPort)] : defaultDesktopPorts;
  let lastError = null;

  for (const port of ports) {
    try {
      const candidate = createAppServer({ port });
      await candidate.start();
      appServer = candidate;
      return appServer.url;
    } catch (error) {
      lastError = error;
      appServer = null;
      if (error?.code !== "EADDRINUSE") throw error;
    }
  }

  throw lastError ?? new Error("本地服务端口不可用");
}

async function stopLocalServer() {
  if (!appServer) return;
  const serverToStop = appServer;
  appServer = null;
  await serverToStop.stop();
}

function createWindow(localUrl) {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 1080,
    minHeight: 720,
    title: "命理断事系统",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.loadURL(localUrl);
  mainWindow.on("closed", () => {
    mainWindow = null;
    stopLocalServer().finally(() => app.quit());
  });
}

app.whenReady().then(async () => {
  try {
    const localUrl = await startLocalServer();
    createWindow(localUrl);
  } catch (error) {
    console.error(error);
    dialog.showErrorBox("启动失败", `本地服务启动失败：${error.message}`);
    app.quit();
  }
});

app.on("before-quit", () => {
  void stopLocalServer();
});

app.on("window-all-closed", () => {
  app.quit();
});
