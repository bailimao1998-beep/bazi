import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataFile = path.join(repoRoot, "data", "source", "16-参考资料知识卡-reference-cards.json");
const forbiddenTextKeys = new Set(["rawText", "raw_text", "ocrText", "ocr_text", "fullText", "full_text", "pageText", "page_text"]);
const requiredCardFields = [
  "id",
  "title",
  "category",
  "domains",
  "tags",
  "match",
  "sourceRefs",
  "summary",
  "interpretation",
  "display",
  "enabledForAnalysis",
  "confidence",
  "status",
];
const matchKeys = ["stems", "branches", "tenGods", "elements", "relations", "patterns", "stars", "pillars"];

async function main() {
  const errors = [];
  const data = await readJson(dataFile, errors);
  if (!data) return finish(errors);

  if (!Array.isArray(data.sources) || data.sources.length === 0) {
    errors.push("sources must contain at least one PDF source");
  }
  if (!Array.isArray(data.cards)) {
    errors.push("cards must be an array");
  }

  const sources = new Map();
  for (const [index, source] of (data.sources ?? []).entries()) {
    const prefix = `sources[${index}]`;
    for (const key of ["id", "title", "fileName", "relativePath", "pageCount", "extractionMethod", "processingStatus", "status"]) {
      if (source?.[key] === undefined || source[key] === "") errors.push(`${prefix}.${key} missing`);
    }
    if (sources.has(source.id)) errors.push(`${prefix}.id duplicate ${source.id}`);
    sources.set(source.id, source);
    if (!Number.isInteger(source.pageCount) || source.pageCount < 1) errors.push(`${prefix}.pageCount must be a positive integer`);
  }

  const ids = new Set();
  for (const [index, card] of (data.cards ?? []).entries()) {
    const prefix = `cards[${index}]`;
    for (const key of requiredCardFields) {
      if (card?.[key] === undefined) errors.push(`${prefix}.${key} missing`);
    }
    if (ids.has(card.id)) errors.push(`${prefix}.id duplicate ${card.id}`);
    ids.add(card.id);
    if (!Array.isArray(card.domains) || card.domains.length === 0) errors.push(`${prefix}.domains must be a non-empty array`);
    if (!Array.isArray(card.tags)) errors.push(`${prefix}.tags must be an array`);
    if (!hasUsableMatch(card.match)) errors.push(`${prefix}.match must include at least one usable match array`);
    if (!Array.isArray(card.sourceRefs) || card.sourceRefs.length === 0) errors.push(`${prefix}.sourceRefs must be a non-empty array`);
    if (card.enabledForAnalysis !== true) errors.push(`${prefix}.enabledForAnalysis must be true for auto-enabled cards`);
    if (card.status !== "auto_enabled") errors.push(`${prefix}.status must be auto_enabled`);
    if (!card.display?.title && !card.display?.template) errors.push(`${prefix}.display must include title or template`);

    for (const [refIndex, ref] of (card.sourceRefs ?? []).entries()) {
      const source = sources.get(ref.sourceId);
      const refPrefix = `${prefix}.sourceRefs[${refIndex}]`;
      if (!source) {
        errors.push(`${refPrefix}.sourceId unknown ${ref.sourceId}`);
        continue;
      }
      const pageStart = ref.pageStart ?? ref.page;
      const pageEnd = ref.pageEnd ?? pageStart;
      if (!Number.isInteger(pageStart) || pageStart < 1) errors.push(`${refPrefix}.pageStart must be a positive integer`);
      if (!Number.isInteger(pageEnd) || pageEnd < pageStart) errors.push(`${refPrefix}.pageEnd must be >= pageStart`);
      if (Number.isInteger(pageEnd) && pageEnd > source.pageCount) errors.push(`${refPrefix}.pageEnd exceeds source pageCount`);
    }
  }

  findForbiddenTextFields(data, "$", errors);
  finish(errors);
}

async function readJson(filePath, errors) {
  try {
    return JSON.parse(await fs.readFile(filePath, "utf8"));
  } catch (error) {
    errors.push(`${path.relative(repoRoot, filePath)} invalid or missing: ${error.message}`);
    return null;
  }
}

function hasUsableMatch(match) {
  if (!match || typeof match !== "object" || Array.isArray(match)) return false;
  return matchKeys.some((key) => Array.isArray(match[key]) && match[key].length > 0);
}

function findForbiddenTextFields(value, pathName, errors) {
  if (!value || typeof value !== "object") return;
  if (Array.isArray(value)) {
    value.forEach((item, index) => findForbiddenTextFields(item, `${pathName}[${index}]`, errors));
    return;
  }
  for (const [key, child] of Object.entries(value)) {
    if (forbiddenTextKeys.has(key)) errors.push(`${pathName}.${key} is forbidden; store knowledge cards, not full OCR text`);
    findForbiddenTextFields(child, `${pathName}.${key}`, errors);
  }
}

function finish(errors) {
  if (errors.length) {
    console.error("Reference knowledge validation failed:");
    for (const error of errors) console.error(`- ${error}`);
    process.exit(1);
  }
  console.log("Reference knowledge validation passed");
}

main();
