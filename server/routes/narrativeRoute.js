import { loadLocalAiProviderOptions } from "../config/aiConfigLoader.js";
import { buildNarrative } from "../services/narrativeService.js";
import { sendJson } from "../utils/response.js";
import { readJsonBody } from "./requestBody.js";

export async function narrativeRoute(request, response, url) {
  if (request.method !== "POST" || url.pathname !== "/api/narrative") return false;
  const input = await readJsonBody(request);
  const result = await buildNarrative(input, loadLocalAiProviderOptions());
  sendJson(response, result);
  return true;
}
