import { readFileSync } from "node:fs";
import path from "node:path";

export function loadJson(filePath) {
  const absolutePath = path.resolve(process.cwd(), filePath);
  return JSON.parse(readFileSync(absolutePath, "utf8"));
}
