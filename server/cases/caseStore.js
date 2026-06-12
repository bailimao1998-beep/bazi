import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

const allowedFeedback = new Set(["待验证", "较准", "不准", "已应验"]);

export function getCaseStorePath({ settingsDir, publicRoot = process.cwd() } = {}) {
  const baseDir = settingsDir ?? process.env.FORTUNE_AI_USER_DATA_DIR;
  if (baseDir) return path.join(baseDir, "cases/cases.json");
  return path.resolve(publicRoot, "data/user-cases/cases.json");
}

export function listCases(options = {}) {
  return readCaseFile(options)
    .slice()
    .sort((a, b) => String(b.updatedAt ?? "").localeCompare(String(a.updatedAt ?? "")))
    .map(toCaseSummary);
}

export function readCase(id, options = {}) {
  return readCaseFile(options).find((item) => item.id === id) ?? null;
}

export function saveCase(input = {}, options = {}) {
  const now = new Date().toISOString();
  const cases = readCaseFile(options);
  const saved = normalizeCase(input, { id: randomUUID(), createdAt: now, updatedAt: now });
  writeCaseFile(cases.concat(saved), options);
  return saved;
}

export function updateCase(id, input = {}, options = {}) {
  const cases = readCaseFile(options);
  const index = cases.findIndex((item) => item.id === id);
  if (index < 0) return null;
  const updated = normalizeCase({ ...cases[index], ...input }, {
    id: cases[index].id,
    createdAt: cases[index].createdAt,
    updatedAt: new Date().toISOString(),
  });
  cases[index] = updated;
  writeCaseFile(cases, options);
  return updated;
}

export function deleteCase(id, options = {}) {
  const cases = readCaseFile(options);
  const nextCases = cases.filter((item) => item.id !== id);
  if (nextCases.length === cases.length) return false;
  writeCaseFile(nextCases, options);
  return true;
}

function readCaseFile(options = {}) {
  const filePath = getCaseStorePath(options);
  if (!existsSync(filePath)) return [];
  try {
    const parsed = JSON.parse(readFileSync(filePath, "utf8"));
    return Array.isArray(parsed?.cases) ? parsed.cases.map((item) => normalizeCase(item, item)) : [];
  } catch {
    preserveBrokenFile(filePath);
    return [];
  }
}

function writeCaseFile(cases, options = {}) {
  const filePath = getCaseStorePath(options);
  mkdirSync(path.dirname(filePath), { recursive: true });
  writeFileSync(filePath, `${JSON.stringify({ cases }, null, 2)}\n`, "utf8");
}

function preserveBrokenFile(filePath) {
  if (!existsSync(filePath)) return;
  const backupPath = `${filePath}.broken-${Date.now()}.bak`;
  try {
    renameSync(filePath, backupPath);
  } catch {
    // If backup fails, still return an empty case list rather than breaking the UI.
  }
}

function normalizeCase(input = {}, fallback = {}) {
  const id = String(fallback.id ?? input.id ?? randomUUID());
  const createdAt = String(fallback.createdAt ?? input.createdAt ?? new Date().toISOString());
  const updatedAt = String(fallback.updatedAt ?? input.updatedAt ?? createdAt);
  const selection = sanitizeValue(input.selection ?? {});
  return {
    id,
    createdAt,
    updatedAt,
    title: normalizeTitle(input.title, input, selection),
    input: sanitizeValue(input.input ?? {}),
    selection,
    chartSummary: sanitizeValue(input.chartSummary ?? {}),
    evidenceReport: sanitizeValue(input.evidenceReport ?? {}),
    annualEventReport: sanitizeValue(input.annualEventReport ?? {}),
    narrative: sanitizeValue(input.narrative ?? {}),
    teacherNotes: sanitizeText(input.teacherNotes ?? ""),
    tags: normalizeTags(input.tags),
    feedback: allowedFeedback.has(input.feedback) ? input.feedback : "待验证",
  };
}

function toCaseSummary(item = {}) {
  const input = item.input ?? {};
  return {
    id: item.id,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    title: item.title,
    selection: item.selection ?? {},
    tags: Array.isArray(item.tags) ? item.tags : [],
    feedback: item.feedback ?? "待验证",
    teacherNotesPreview: String(item.teacherNotes ?? "").slice(0, 80),
    inputSummary: {
      name: input.name,
      birthDate: input.birthDate,
      birthTime: input.birthTime,
      gender: input.gender,
      birthplace: input.birthplace,
    },
  };
}

function normalizeTitle(title, input, selection) {
  const value = sanitizeText(title ?? "").trim();
  if (value) return value.slice(0, 80);
  const name = sanitizeText(input.input?.name ?? input.name ?? "未命名案例").trim() || "未命名案例";
  const year = selection?.targetYear ? `${selection.targetYear}` : "年度待选";
  return `${name}｜${year}`;
}

function normalizeTags(tags) {
  const rows = Array.isArray(tags) ? tags : String(tags ?? "").split(/[,，\s]+/);
  return rows.map((item) => sanitizeText(item).trim()).filter(Boolean).slice(0, 12);
}

function sanitizeValue(value) {
  if (Array.isArray(value)) return value.map(sanitizeValue);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([key]) => !isSensitiveKey(key))
        .map(([key, item]) => [key, sanitizeValue(item)]),
    );
  }
  if (typeof value === "string") return sanitizeText(value);
  return value;
}

function sanitizeText(value) {
  return String(value ?? "")
    .replace(/sk-[A-Za-z0-9_-]{8,}/g, "[已过滤密钥]")
    .replace(/DEEPSEEK_API_KEY/g, "[敏感环境变量]")
    .replace(/apiKey/gi, "[敏感字段]");
}

function isSensitiveKey(key) {
  return /api[-_]?key|token|secret|password/i.test(String(key ?? ""));
}
