import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chatRoute } from "./routes/chatRoute.js";
import { narrativeRoute } from "./routes/narrativeRoute.js";
import { settingsRoute } from "./routes/settingsRoute.js";
import { staticRoute } from "./routes/staticRoute.js";
import { logError, logInfo } from "./utils/logger.js";
import { sendError } from "./utils/response.js";

export function createAppServer({ port = 3000, host = "127.0.0.1" } = {}) {
  let started = false;
  let currentUrl = `http://localhost:${port}`;

  const server = createServer(async (request, response) => {
    try {
      const url = new URL(request.url, `http://${request.headers.host}`);
      if (await settingsRoute(request, response, url)) return;
      if (await narrativeRoute(request, response, url)) return;
      if (await chatRoute(request, response, url)) return;
      staticRoute(url, response);
    } catch (error) {
      logError("request failed", error);
      sendError(response, error);
    }
  });

  const appServer = {
    server,
    get url() {
      return currentUrl;
    },
    start() {
      if (started) return Promise.resolve(appServer);
      return new Promise((resolve, reject) => {
        const onError = (error) => {
          server.off("listening", onListening);
          reject(error);
        };
        const onListening = () => {
          server.off("error", onError);
          started = true;
          const address = server.address();
          const actualPort = typeof address === "object" && address ? address.port : port;
          currentUrl = `http://localhost:${actualPort}`;
          resolve(appServer);
        };
        server.once("error", onError);
        server.once("listening", onListening);
        server.listen(port, host);
      });
    },
    stop() {
      if (!started) return Promise.resolve();
      return new Promise((resolve, reject) => {
        server.close((error) => {
          if (error) {
            reject(error);
            return;
          }
          started = false;
          resolve();
        });
      });
    },
  };

  return appServer;
}

function isDirectRun() {
  if (!process.argv[1]) return false;
  return path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
}

if (isDirectRun()) {
  const port = Number(process.env.PORT ?? 3000);
  const appServer = createAppServer({ port });
  try {
    await appServer.start();
    logInfo("fortune-ai server started", { port });
  } catch (error) {
    logError("server failed to start", error);
    process.exitCode = 1;
  }
}
