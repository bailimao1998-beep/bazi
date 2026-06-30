import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "../..");
const canonicalRoots = ["app", "ui", "domain", "services", "generated", "shared"];
const styleRoots = ["tokens", "base", "layout", "natal", "transit", "chat"];
const allowedDependencies = {
  app: new Set(["app", "ui", "services", "domain", "shared"]),
  ui: new Set(["ui", "domain", "shared", "generated"]),
  services: new Set(["services", "domain", "shared", "generated"]),
  domain: new Set(["domain", "shared", "generated"]),
  generated: new Set(["generated", "shared"]),
  shared: new Set(["shared"]),
};

test("canonical source directories exist", () => {
  for (const directory of canonicalRoots) {
    assert.equal(existsSync(path.join(root, "js", directory)), true, `missing js/${directory}`);
  }
  for (const directory of styleRoots) {
    assert.equal(existsSync(path.join(root, "styles", directory)), true, `missing styles/${directory}`);
  }

  const mainCss = readFileSync(path.join(root, "styles", "main.css"), "utf8");
  const imports = [...mainCss.matchAll(/@import\s+["'](.+?)["']/g)].map((match) => match[1]);
  assert.equal(imports.some((specifier) => /v\d/i.test(specifier)), false);
  for (const specifier of imports) {
    assert.equal(existsSync(path.resolve(root, "styles", specifier)), true, `missing CSS import ${specifier}`);
  }
});

test("canonical modules follow one-way dependency boundaries", () => {
  const violations = [];
  for (const file of walkJs(path.join(root, "js"))) {
    const relative = path.relative(path.join(root, "js"), file);
    const sourceLayer = relative.split(path.sep)[0];
    if (!allowedDependencies[sourceLayer]) continue;

    const source = readFileSync(file, "utf8");
    for (const specifier of importSpecifiers(source)) {
      if (!specifier.startsWith(".")) continue;
      const target = path.resolve(path.dirname(file), specifier.split("?")[0]);
      if (!existsSync(target)) {
        violations.push(`${relative} -> missing ${specifier}`);
        continue;
      }
      const targetRelative = path.relative(path.join(root, "js"), target);
      const targetLayer = targetRelative.split(path.sep)[0];
      if (!allowedDependencies[sourceLayer].has(targetLayer)) {
        violations.push(`${relative} -> ${specifier}`);
      }
    }
  }
  assert.deepEqual(violations, []);
});

test("UI modules do not fetch rule databases directly", () => {
  const violations = walkJs(path.join(root, "js", "ui"))
    .filter((file) => /fetch\([^)]*(?:data\/|\.json)/s.test(readFileSync(file, "utf8")))
    .map((file) => path.relative(root, file));
  assert.deepEqual(violations, []);
});

test("Beta compatibility modules stay as thin re-exports", () => {
  const compatibilityFiles = [
    ...walkJs(path.join(root, "js", "core")),
    ...walkJs(path.join(root, "js", "components")),
    path.join(root, "js", "lunarCalendar.js"),
    path.join(root, "js", "data", "shenshaMeaningDatabase.js"),
    path.join(root, "js", "utils", "html.js"),
  ];
  const violations = compatibilityFiles
    .filter((file) => !/^export \* from ["'][^"']+["'];\s*$/.test(readFileSync(file, "utf8")))
    .map((file) => path.relative(root, file));
  assert.deepEqual(violations, []);
});

function walkJs(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory).flatMap((name) => {
    const file = path.join(directory, name);
    return statSync(file).isDirectory() ? walkJs(file) : file.endsWith(".js") ? [file] : [];
  });
}

function importSpecifiers(source) {
  return [
    ...source.matchAll(/\bfrom\s*["']([^"']+)["']/g),
    ...source.matchAll(/\bimport\s*["']([^"']+)["']/g),
    ...source.matchAll(/\bimport\s*\(\s*["']([^"']+)["']/g),
  ].map((match) => match[1]);
}
