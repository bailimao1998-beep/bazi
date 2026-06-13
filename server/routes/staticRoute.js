import { createReadStream, existsSync } from "node:fs";
import path from "node:path";

export function staticRoute(url, response, publicRoot = process.cwd()) {
  serveStatic(url.pathname, response, publicRoot);
  return true;
}

function serveStatic(pathname, response, publicRoot) {
  const normalized = pathname === "/" ? "/index.html" : pathname;
  const filePath = path.resolve(publicRoot, `.${normalized}`);
  if (!filePath.startsWith(publicRoot) || !existsSync(filePath)) {
    response.writeHead(404);
    response.end("Not found");
    return;
  }
  response.writeHead(200, { "Content-Type": contentType(filePath) });
  createReadStream(filePath).pipe(response);
}

function contentType(filePath) {
  if (filePath.endsWith(".html")) return "text/html; charset=utf-8";
  if (filePath.endsWith(".css")) return "text/css; charset=utf-8";
  if (filePath.endsWith(".js")) return "text/javascript; charset=utf-8";
  if (filePath.endsWith(".json")) return "application/json; charset=utf-8";
  return "text/plain; charset=utf-8";
}
