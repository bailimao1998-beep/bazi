export function sendJson(response, data, status = 200) {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(data, null, 2));
}

export function sendError(response, error, status = 500) {
  sendJson(response, { error: error.message ?? String(error) }, status);
}
