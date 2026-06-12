import { createServer } from "node:http";
import { chatRoute } from "./routes/chatRoute.js";
import { narrativeRoute } from "./routes/narrativeRoute.js";
import { staticRoute } from "./routes/staticRoute.js";
import { logError, logInfo } from "./utils/logger.js";
import { sendError } from "./utils/response.js";

const port = Number(process.env.PORT ?? 3000);

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url, `http://${request.headers.host}`);
    if (await narrativeRoute(request, response, url)) return;
    if (await chatRoute(request, response, url)) return;
    staticRoute(url, response);
  } catch (error) {
    logError("request failed", error);
    sendError(response, error);
  }
});

if (process.argv[1] && process.argv[1].endsWith("server.js")) {
  server.listen(port, () => logInfo("fortune-ai server started", { port }));
}
