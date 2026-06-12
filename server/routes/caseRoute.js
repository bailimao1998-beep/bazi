import { deleteCase, listCases, readCase, saveCase, updateCase } from "../cases/caseStore.js";
import { sendJson } from "../utils/response.js";
import { readJsonBody } from "./requestBody.js";

export async function caseRoute(request, response, url) {
  if (url.pathname === "/api/cases" && request.method === "GET") {
    sendJson(response, { cases: listCases() });
    return true;
  }
  if (url.pathname === "/api/cases" && request.method === "POST") {
    const input = await readJsonBody(request);
    sendJson(response, { saved: true, case: saveCase(input) });
    return true;
  }

  const match = url.pathname.match(/^\/api\/cases\/([^/]+)$/);
  if (!match) return false;

  const id = decodeURIComponent(match[1]);
  if (request.method === "GET") {
    const item = readCase(id);
    sendJson(response, item ? { case: item } : { error: "案例不存在" }, item ? 200 : 404);
    return true;
  }
  if (request.method === "PUT") {
    const input = await readJsonBody(request);
    const item = updateCase(id, input);
    sendJson(response, item ? { saved: true, case: item } : { error: "案例不存在" }, item ? 200 : 404);
    return true;
  }
  if (request.method === "DELETE") {
    sendJson(response, { deleted: deleteCase(id) });
    return true;
  }
  return false;
}
