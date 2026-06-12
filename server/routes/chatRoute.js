import { loadLocalAiProviderOptions } from "../config/aiConfigLoader.js";
import { buildChatResponse } from "../services/chatService.js";
import { sendJson } from "../utils/response.js";
import { readJsonBody } from "./requestBody.js";

export async function chatRoute(request, response, url) {
  if (request.method !== "POST" || url.pathname !== "/api/chat") return false;
  const input = await readJsonBody(request);
  const result = await buildChatResponse(input, loadLocalAiProviderOptions());
  sendJson(response, result);
  return true;
}
