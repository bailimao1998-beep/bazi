import { app, BrowserWindow } from "electron";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

function createStaticServer() {
  const server = http.createServer((req, res) => {
    const requestUrl = decodeURIComponent(req.url || "/");
    const safePath = requestUrl.split("?")[0] === "/" ? "/index.html" : requestUrl.split("?")[0];
    const filePath = path.normalize(path.join(rootDir, safePath));
    const relativePath = path.relative(rootDir, filePath);
    const isInsideRoot = relativePath && !relativePath.startsWith("..") && !path.isAbsolute(relativePath);

    if (!isInsideRoot) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }

    fs.readFile(filePath, (error, content) => {
      if (error) {
        res.writeHead(404);
        res.end("Not Found");
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, {
        "Content-Type": mimeTypes[ext] || "application/octet-stream"
      });
      res.end(content);
    });
  });

  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      resolve({
        server,
        url: `http://127.0.0.1:${address.port}/index.html`
      });
    });
  });
}

let staticServer = null;

async function createWindow() {
  const { server, url } = await createStaticServer();
  staticServer = server;

  const win = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 1100,
    minHeight: 720,
    title: "命理剧情解读系统 V1",
    backgroundColor: "#fffdf8",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  await win.loadURL(url);
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (staticServer) {
    staticServer.close();
    staticServer = null;
  }

  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
